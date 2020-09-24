import {AppInfo, Schema} from '../constants/types'
import {contextForStandard} from './contextForStandard'
import {loadFileTemplate} from './loadFileTemplate'
import {registerHelpers} from './registerHelpers'
import {registerPartials} from './registerPartials'

const fs = require('fs-extra')
const path = require('path')
const walk = require('walkdir')
// const yaml = require('js-yaml')

const options = {
  mode: 0o2775,
}

// async function processDirStructure(
//   fileStructure: Directory,
//   appDir: string,
//   templateDir: string,
//   appInfo: AppInfo,
//   stackInfo: Schema,
// ) {
//   try {
//     await registerPartials(`${templateDir}/partials`)
//     await registerHelpers(`${templateDir}/helpers`)
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.log(error)
//     throw new Error(`error registering the partials or helpers at ${templateDir}.
// It may be that the template location is faulty, or that the template is not
// correctly specified:
// ${error}`)
//   }
//
//   await Promise.all(Object.keys(fileStructure).map(
//     async name => {
//       const fileOrSubdirectory = fileStructure[name]
//       if (fileOrSubdirectory && typeof fileOrSubdirectory === 'string') {
//         try {
//           const fileTemplatePath = `${templateDir}/fileTemplates/${name}.hbs`
//           const fileTemplate = await loadFileTemplate(fileTemplatePath)
//           const fileText = await fileTemplate(contextForStandard(appInfo, stackInfo, name))
//           // console.log(`configText=${configText}`)
//           await fs.outputFile(`${appDir}/${fileStructure[name]}`, fileText)
//         } catch (error) {
//           // eslint-disable-next-line no-console
//           console.log(error)
//           throw new Error(`problem trying to create ${appDir}/${fileStructure[name]}.
// Could be do to a missing or faulty file template ${name} in the template.
//    `)
//         }
//       } else {
//         // it's a subdirectory
//         const childrenAppDir = `${appDir}/${name}`
//         // console.log(`${name} is a directory in ${appDir}`)
//
//         try {
//           await fs.ensureDir(childrenAppDir, options)
//           // console.log('success creating dirs')
//         } catch (error) {
//           // eslint-disable-next-line no-console
//           throw error
//         }
//
//         if (fileOrSubdirectory)
//           await processDirStructure(
//             fileOrSubdirectory as Directory,
//             childrenAppDir,
//             templateDir,
//             appInfo,
//             stackInfo
//           )
//       }
//     },
//   ))
// }

// async function createStandardFiles(fileOrDirectory: any) {
//   try {
//     console.log('found: ', fileOrDirectory)
//   } catch (error) {
//     throw new Error(`creating the file or directory '${fileOrDirectory}'}: ${error}`)
//   }
// }

export async function standardFiles(
  templateDir: string,
  appDir: string,
  appInfo: AppInfo,
  stackInfo: Schema,
) {
  const standardDir = `${templateDir}/standard`

  try {
    await registerPartials(`${templateDir}/partials`)
    await registerHelpers(`${templateDir}/helpers`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error registering the partials or helpers at ${templateDir}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  const emitter = walk(standardDir)

  emitter.on('file', async function (filename: any) {
    const fileTemplate = await loadFileTemplate(filename)
    const localPath = filename.replace(standardDir, '')
    const newPath = `${appDir}${localPath}`
    const parsed = path.parse(newPath)
    const newFileName = path.join(parsed.dir, parsed.name)
    // const {ext} = parsed.ext
    // if (ext !== '.hbs') {
    //   throw new Error(`the file ${filename} in the template standard dir
    //   does not end with the .hbs extension.  The only files permitted must have
    //   the .hbs extension.`)
    // }

    const fileText = await fileTemplate(contextForStandard(appInfo, stackInfo, parsed.name))
    await fs.outputFile(newFileName, fileText)
  })

  emitter.on('directory', async function (path: any) {
    const localPath = path.replace(standardDir, '')
    const newPath = `${appDir}${localPath}`
    try {
      // await fs.ensureDir(childrenAppDir, options)
      await fs.ensureDir(newPath, options)
    } catch (error) {
      // eslint-disable-next-line no-console
      throw error
    }
  })
}
