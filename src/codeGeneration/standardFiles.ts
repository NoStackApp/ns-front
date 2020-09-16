import {AppInfo, Directory, StackInfo} from '../constants/types'
import {contextForStandard} from './contextForStandard'
import {loadFileTemplate} from './loadFileTemplate'
import {registerPartials} from './registerPartials'

const fs = require('fs-extra')
const yaml = require('js-yaml')

const options = {
  mode: 0o2775,
}

async function processDirStructure(
  fileStructure: Directory,
  appDir: string,
  templateDir: string,
  appInfo: AppInfo,
  stackInfo: StackInfo,
) {
  await registerPartials(`${templateDir}/partials`)

  await Promise.all(Object.keys(fileStructure).map(
    async name => {
      const fileOrSubdirectory = fileStructure[name]
      if (fileOrSubdirectory && typeof fileOrSubdirectory === 'string') {
        try {
          const fileTemplatePath = `${templateDir}/fileTemplates/${name}.hbs`
          const fileTemplate = await loadFileTemplate(fileTemplatePath)
          const fileText = await fileTemplate(contextForStandard(appInfo, stackInfo, name))
          // console.log(`configText=${configText}`)
          await fs.outputFile(`${appDir}/${fileStructure[name]}`, fileText)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
          throw new Error(`problem trying to create ${appDir}/${fileStructure[name]}.
Could be do to a missing or faulty file template ${name} in the template.
   `)
        }
      } else {
        // it's a subdirectory
        const childrenAppDir = `${appDir}/${name}`
        // console.log(`${name} is a directory in ${appDir}`)

        try {
          await fs.ensureDir(childrenAppDir, options)
          // console.log('success creating dirs')
        } catch (error) {
          // eslint-disable-next-line no-console
          throw error
        }

        if (fileOrSubdirectory)
          await processDirStructure(
            fileOrSubdirectory as Directory,
            childrenAppDir,
            templateDir,
            appInfo,
            stackInfo
          )
      }
    },
  ))
}

export async function standardFiles(
  templateDir: string,
  appDir: string,
  appInfo: AppInfo,
  stackInfo: StackInfo,
) {
  let fileStructure: Directory
  const standardFile = `${templateDir}/standard.yml`
  try {
    const appYaml = fs.readFileSync(standardFile, 'utf8')
    fileStructure = await yaml.safeLoad(appYaml)
  } catch (error) {
    throw new Error(`error finding the file ${standardFile}.
It may be that the template location is faulty, or that the file does not exist
or is not properly configured:
${error}`)
  }

  await processDirStructure(fileStructure, appDir, templateDir, appInfo, stackInfo)
}
