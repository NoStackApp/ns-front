// const findInFiles = require('find-in-files')
// import {AddedCode} from '../constants/types'
//
// const fs = require('fs-extra')
// const readdir = require('@mrmlnc/readdir-enhanced')
// const regexReplace = require('regex-replace')

// const recursive = require('recursive-readdir')

// rootDir: string
const chalk = require('chalk')

import execa = require('execa');
import * as path from 'path'
// import {regExAddedCodeSection} from '../constants/Regex/regExAddedCodeSection'
// import {commentOpen, content, endOfLine} from '../constants/Regex/regExShared'
// import { regExReplacedCodeSection } from '../constants/Regex/regExReplacedCodeSection';
import {CustomCodeRepository} from '../constants/types'
import {singularName} from '../tools/inflections'

const fs = require('fs-extra')
// const readdir = require('@mrmlnc/readdir-enhanced')
// const replace = require('replace-in-file')

async function updateCode(
  fileName: string,
  sedString: string,
) {
  await execa(
    'sed',
    ['-i', '-e ' + sedString, fileName],
  ).catch(
    (error: any) => {
      throw new Error(`${chalk.red('error inserting added code.')} Here is the error reported:\n${error}`)
    },
  )
}

// async function updateAddedImports(customCode: CustomCodeRepository, testDir: string) {
//   const {addedCode} = customCode
//   Object.keys(addedCode).map(unit => {
//     const unitInfo = addedCode[unit]
//     Object.keys(unitInfo).map(comp => {
//       const compInfo = unitInfo[comp]
//       Object.keys(compInfo).map(async location => {
//         const addedContent = addedCode[unit][comp][location]
//         let fileName = `${testDir}/src/components/${singularName(unit)}/${comp}/index.jsx`
//         if (unit === 'general') {
//           fileName = `${testDir}/src/components/${comp}/index.jsx`
//         }
//
//         // // const commentOpen = '(\/\/|{\\/\*)'
//         // const commentOpen = '(\/\/)';
//         // const endOfLine = '( \*\/\}\n|\n)';
//         // const content = '((.|\n)*?)';
//
//         const firstLineBody = `${commentOpen} ns__custom_start unit: ${unit} comp: ${comp} loc: ${location}${endOfLine}`
//         // console.log(`unit=${unit}, sing: ${singularName(unit)}`)
//         // const firstLineBody = `${commentOpen} ns__custom_start unit: ${unit}`
//         const finalLineBody = `${commentOpen} ns__custom_end unit: ${unit} comp: ${comp} loc: ${location}${endOfLine}`
//
//         const fullRegExBody = `${firstLineBody}${content}${finalLineBody}`
//         const fullReplacement = `${firstLineBody}${addedContent}${finalLineBody}`
//         // const fullRegExBodyRaw = `${firstLineBody}`;
//         console.log(fullRegExBody)
//         // const fullRegExBody = fullRegExBodyRaw.replace(/\\\\/g, '\\')
//         // console.log(fullRegExBody)
//         const regExAddedCodeSection = new RegExp(fullRegExBody, 'g')
//         try {
//           const fileContents = fs.readFile(fileName, 'utf8')
//           // const fileInfoMatch = regExAddedCodeSection.exec(fileContents)
//           fileContents.replace(regExAddedCodeSection, fullReplacement)
//           fs.writeFile(fileName, fileContents, 'utf8')
//
//           // const options = {
//           //   files: fileName,
//           //   from: fullRegExBodyRaw,
//           //   // to: 'foo',
//           //   // to: firstLineBody + addedContent + finalLineBody,
//           // };
//           // await replace(options)
//           // console.log('options:', options);
//           // const results = await replace(options);
//           // console.log('Replacement results:', results);
//         } catch
//         (error) {
//           throw error
//         }
//       })
//     }
//
//     )
//   })
// }

async function updateRemovedImports(customCode: CustomCodeRepository, testDir: string) {
  const {removedCode} = customCode
  Object.keys(removedCode).map(unit => {
    const unitInfo = removedCode[unit]
    Object.keys(unitInfo).map(comp => {
      const compInfo = unitInfo[comp]
      Object.keys(compInfo).map(async location => {
        const fileName = `${testDir}/src/components/${singularName(unit)}/${comp}/index.jsx`
        const sedString = `s/^\\(\\s*\\)import ${location}/\\1\\/\\/ns__remove_import ${location}/g`
        await updateCode(fileName, sedString)
      })
    })
  })
}

export const insertAddedCode = async (testDir: string, addedCodeDoc: string) => {
  const baseDir = path.resolve(process.cwd(), testDir)
  const gruntDir = path.resolve(__dirname, '../..')

  // console.log(`gruntDir=${gruntDir}`)
  // console.log(`appDir=${baseDir}`)
  // console.log(`addedCodeJsonFile=${addedCodeJsonFile}`)

  const existsComponents = await fs.pathExists(addedCodeDoc)
  // console.log(`existsComponents=${existsComponents}`)

  let customCode: CustomCodeRepository = {
    addedCode: {},
    replacedCode: {},
    removedCode: {},
  }
  if (!existsComponents) {
    try {
      await fs.writeJson(addedCodeDoc, customCode)
    } catch (error) {
      throw error
    }
    return
  }

  customCode = await fs.readJson(addedCodeDoc)

  if (Object.keys(customCode).length === 0) {
    // no added code to add
    return
  }

  // const compsDir = baseDir + '/src/components/'
  // const files = readdir.sync(compsDir, {deep: true, filter: '**/*.{js,jsx}'})
  // console.log(`files: ${JSON.stringify(files, null, 2)}`)

  // let i
  // for (i = 0; i < files.length; i++) {
  //   const file = compsDir + files[i]
  //   // eslint-disable-next-line no-await-in-loop
  //   await insertCustomCodeForFile(file, customCode)
  // }

  // await updateAddedImports(customCode, testDir)
  await updateRemovedImports(customCode, testDir)

  // console.log(`about to call grunt:
  //    $ ${gruntDir}/node_modules/.bin/grunt --testDir=${baseDir} --addedCodeDoc=${addedCodeDoc} --base=${gruntDir}
  // `)
  await execa(
    `${gruntDir}/node_modules/.bin/grunt`,
    ['--testDir=' + baseDir, '--addedCodeDoc=' + addedCodeDoc, `--base=${gruntDir}`],
  ).catch(
    (error: any) => {
      throw new Error(`${chalk.red('error inserting added code.')} Here is the error reported:\n${error}`)
    },
  )
}
