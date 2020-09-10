import {Directory} from '../constants/types'
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
  template: string
) {
  await registerPartials(`${template}/partials`)
  console.log(`in processDirStructure, here's the template: ${template}`)
  await Promise.all(Object.keys(fileStructure).map(
    async name => {
      const fileOrSubdirectory = fileStructure[name]
      if (fileOrSubdirectory && typeof fileOrSubdirectory === 'string') {
        try {
          console.log(`${fileOrSubdirectory} is a file in ${appDir}`)
          console.log(`template is ${template}`)
          const fileTemplatePath = `${template}/fileTemplates/${name}.hbs`
          const fileTemplate = await loadFileTemplate(fileTemplatePath)
          const fileText = await fileTemplate(contextForStandard(name))
          // console.log(`configText=${configText}`)
          await fs.outputFile(`${appDir}/${fileStructure[name]}`, fileText)
          console.log(`output to ${appDir}/${fileStructure[name]}`)
        } catch (error) {
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
            template
          )
      }
    },
  ))
}

export async function standardFiles(
  template: string,
  appDir: string,
) {
  let fileStructure: Directory
  const standardFile = `${template}/standard.yml`
  try {
    const appYaml = fs.readFileSync(standardFile, 'utf8')
    fileStructure = await yaml.safeLoad(appYaml)
  } catch (error) {
    throw new Error(`error finding the file ${standardFile}.
It may be that the template location is faulty, or that the file does not exist
or is not properly configured:
${error}`)
  }

  console.log(`in standardFiles, here's the template: ${template}`)
  await processDirStructure(fileStructure, appDir, template)
  console.log('finished!!!')
}
