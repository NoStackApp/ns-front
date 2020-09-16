import {AppInfo, StackInfo} from '../constants/types'
import {configuredDirs} from './configuredDirs'

import {getConfiguration} from '../constants/getConfiguration'
import {createQueryFiles} from './createQueryFiles'
import {standardFiles} from './standardFiles'
import {generateAppTypeFiles} from './typeFiles/generateAppTypeFiles'

const fs = require('fs-extra')

export async function generateAppCode(
  appDir: string,
  appInfo: AppInfo,
  jsonPath: string,
) {
  const {userClass, units, template} = appInfo

  const config = await getConfiguration(template.dir)
  // console.log(`stacklocation=${appDir}/stack.json`)
  const stackInfo: StackInfo = await fs.readJSON(jsonPath) // await generateJSON.bind(this)(template, appDir)

  try {
    await standardFiles(template.dir, appDir, appInfo, stackInfo)
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

  // mapObject
  await createQueryFiles(config, appInfo, appDir)
  // if (config.dirs.queries) {
  //   // create query files in the directory specified by the template.
  //   const queriesDir = config.dirs.queries
  //   try {
  //     console.log(`before units: ${JSON.stringify(Object.keys(units), null, 2)}`)
  //     await Promise.all(Object.keys(units).map(async unit => {
  //       console.log(`creating query file for unit ${unit}`)
  //       const unitNameInfo = parseUnitSpecName(unit)
  //       await createQueryFile(unitNameInfo.name, queriesDir, appInfo, template)
  //     }))
  //   } catch (error) {
  //     console.error(error)
  //     throw new Error('error in creating query file')
  //   }
  // }

  const compDir = `${appDir}/${config.dirs.components}`

  try {
    await generateAppTypeFiles(userClass, stackInfo, template.dir, compDir)
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
