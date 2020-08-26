import {StackInfo} from '../constants/types'

import {createConfigFile} from './createConfigFile'
import {createHighestLevelFiles} from './createHighestLevelFiles'
import {createQueryFile} from './createQueryFile'
import {createTopProjectDirs, srcDir} from './createTopProjectDirs'
import {generateAppTypeFiles} from './typeFiles/generateAppTypeFiles'
import execa = require('execa');

const fs = require('fs-extra')

export async function generateTestCode(
  appDir: string,
  userClass: string,
  jsonPath: string,
  appName: string,
) {
  // console.log(`stacklocation=${appDir}/stack.json`)
  const currentStack: StackInfo = await fs.readJSON(jsonPath) // await generateJSON.bind(this)(template, appDir)

  try {
    await createTopProjectDirs(currentStack, appDir)
  } catch (error) {
    throw error
  }

  // console.log(`appDir=${appDir}`)
  // const appName = appNameFromPath(appDir)
  const configText = await createConfigFile(currentStack, appName)
  // console.log(`configText=${configText}`)
  fs.outputFile(`${srcDir}/config/index.js`, configText)

  try {
    await createHighestLevelFiles(currentStack, appDir, userClass, appName)
  } catch (error) {
    throw new Error(`error in creating highest level files: ${error}`)
  }

  const sources = currentStack.sources

  // mapObject

  try {
    await Promise.all(Object.keys(sources).map(async source => {
      await createQueryFile(currentStack, source)
    }))
  } catch (error) {
    throw new Error('error in creating top project directories')
  }

  try {
    await generateAppTypeFiles(sources, userClass, currentStack)
  } catch (error) {
    throw error
  }

  // '--end-of-line auto',
  // '--trailing-comma es5',
  const prettierArgs = [
    '--single-quote',
    '--jsx-single-quote',
    '--trailing-comma es5',
    '--write',
    `${appDir}/src/**/*.{js,jsx}`,
  ]

  try {
    await execa('prettier', prettierArgs)
  } catch (error) {
    throw error
  }
}
