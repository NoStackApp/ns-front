import {AppInfo, StackInfo} from '../constants/types'
import {configuredDirs} from './configuredDirs'

import {createQueryFile} from './createQueryFile'
import {getConfiguration} from './getConfiguration'
import {standardFiles} from './standardFiles'
import {generateAppTypeFiles} from './typeFiles/generateAppTypeFiles'

const fs = require('fs-extra')

export async function generateTestCode(
  appDir: string,
  appInfo: AppInfo,
  jsonPath: string,
) {
  const srcDir = `${appDir}/src`
  const {userClass, units, template} = appInfo

  const config = await getConfiguration(template)
  // console.log(`stacklocation=${appDir}/stack.json`)
  const stackInfo: StackInfo = await fs.readJSON(jsonPath) // await generateJSON.bind(this)(template, appDir)

  try {
    await standardFiles(template, appDir, appInfo, stackInfo)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error in creating standard files: ${error}`)
  }

  // console.log(`units is: ${JSON.stringify(Object.keys(units), null, 2)}`)
  try {
    await configuredDirs(config, appDir, Object.keys(units))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error in creating configured dirs: ${error}`)
  }

  // console.log(`appDir=${appDir}`)
  // const appName = appNameFromPath(appDir)
  // const configText = await createConfigFile(currentStack, appName, template)
  // console.log(`configText=${configText}`)
  // await fs.outputFile(`${srcDir}/config/index.js`, configText)

  // try {
  //   await createHighestLevelFiles(currentStack, appDir, userClass, appName)
  // } catch (error) {
  //   throw new Error(`error in creating highest level files: ${error}`)
  // }

  const sources = stackInfo.sources

  // mapObject
  const compDir = `${srcDir}/components`
  const sourcePropsDir = `${compDir}/source-props`
  try {
    await Promise.all(Object.keys(sources).map(async source => {
      await createQueryFile(stackInfo, source, sourcePropsDir)
    }))
  } catch (error) {
    throw new Error('error in creating top project directories')
  }

  try {
    await generateAppTypeFiles(sources, userClass, stackInfo, template, compDir)
  } catch (error) {
    throw error
  }

  // // '--end-of-line auto',
  // // '--trailing-comma es5',
  // const prettierArgs = [
  //   'prettier',
  //   '--single-quote',
  //   '--jsx-single-quote',
  //   // '--trailing-comma es5',
  //   '--write',
  //   `${appDir}/src/**/*.{js,jsx}`,
  // ]
  //
  // try {
  //   await execa('npx', prettierArgs)
  // } catch (error) {
  //   throw error
  // }
}
