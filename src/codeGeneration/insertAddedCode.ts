// const findInFiles = require('find-in-files')
// import {AddedCode} from '../constants/types'
//
// const fs = require('fs-extra')
// const readdir = require('@mrmlnc/readdir-enhanced')
// const regexReplace = require('regex-replace')

// const recursive = require('recursive-readdir')

// rootDir: string
import chalk from 'chalk'
import execa = require('execa')
import * as path from 'path'
import {CustomCodeRepository} from '../constants/types'
import {singularName} from '../tools/inflections'

const fs = require('fs-extra')

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
  // console.log(`addedCode=${JSON.stringify(addedCode, null, 1)}`)
  if (Object.keys(customCode).length === 0) {
    // no added code to add
    return
  }

  const {removedCode} = customCode
  Object.keys(removedCode).map(unit => {
    const unitInfo = removedCode[unit]
    Object.keys(unitInfo).map(comp => {
      const compInfo = unitInfo[comp]
      Object.keys(compInfo).map(async location => {
        const fileName = `${testDir}/src/components/${singularName(unit)}/${comp}/index.jsx`

        //  sed 's/^\(\s*\)import styled/\1\/\/ns__removed_import styled/g' index.jsx
        await execa(
          'sed',
          ['-i', '-e', `s/^\\(\\s*\\)import ${location}/\\1\\/\\/ns__remove_import ${location}/g`, fileName],
        ).catch(
          (error: any) => {
            throw new Error(`${chalk.red('error inserting added code.')} Here is the error reported:\n${error}`)
          },
        )
      })
    })
  })

  // console.log(`about to call grunt:
  //    $ ${gruntDir}/node_modules/.bin/grunt --testDir=${baseDir} --addedCodeDoc=${addedCodeDoc} --base=${gruntDir}
  // `)
  await execa(
    `${gruntDir}/node_modules/.bin/grunt`,
    ['--testDir=' + baseDir,  '--addedCodeDoc=' + addedCodeDoc,  `--base=${gruntDir}`],
  ).catch(
    (error: any) => {
      throw new Error(`${chalk.red('error inserting added code.')} Here is the error reported:\n${error}`)
    },
  )
}
