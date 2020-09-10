import {AppInfo, StackInfo} from '../constants/types'
import {configuredDirs} from './configuredDirs'

import {createConfigFile} from './createConfigFile'
// import {createHighestLevelFiles} from './createHighestLevelFiles'
import {createQueryFile} from './createQueryFile'
import {getConfiguration} from './getConfiguration'
import {standardFiles} from './standardFiles'
import {generateAppTypeFiles} from './typeFiles/generateAppTypeFiles'
// import execa = require('execa');

const fs = require('fs-extra')

export async function generateTestCode(
  appDir: string,
  appParams: AppInfo,
  jsonPath: string,
) {
  const srcDir = `${appDir}/src`
  const {appName, userClass, units, template} = appParams

  const config = await getConfiguration(template)
  // console.log(`stacklocation=${appDir}/stack.json`)
  const currentStack: StackInfo = await fs.readJSON(jsonPath) // await generateJSON.bind(this)(template, appDir)

  try {
    await standardFiles(template, appDir)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error in creating standard files: ${error}`)
  }

  try {
    await configuredDirs(config, appDir, units)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(`error in creating configured dirs: ${error}`)
  }

  // console.log(`appDir=${appDir}`)
  // const appName = appNameFromPath(appDir)
  const configText = await createConfigFile(currentStack, appName, template)
  // console.log(`configText=${configText}`)
  await fs.outputFile(`${srcDir}/config/index.js`, configText)

  // try {
  //   await createHighestLevelFiles(currentStack, appDir, userClass, appName)
  // } catch (error) {
  //   throw new Error(`error in creating highest level files: ${error}`)
  // }

  const sources = currentStack.sources

  // mapObject
  const compDir = `${srcDir}/components`
  const sourcePropsDir = `${compDir}/source-props`
  try {
    await Promise.all(Object.keys(sources).map(async source => {
      await createQueryFile(currentStack, source, sourcePropsDir)
    }))
  } catch (error) {
    throw new Error('error in creating top project directories')
  }

  console.log('about to call generateAppTypeFiles.')
  try {
    await generateAppTypeFiles(sources, userClass, currentStack, template, compDir)
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
