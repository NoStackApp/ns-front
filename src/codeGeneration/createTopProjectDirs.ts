import {StackInfo} from '../constants/types'
import {singularName} from '../tools/inflections'

import {makeDirs} from './makeDirs'

let appDir: string
let srcDir: string
let compDir: string
let sourcePropsDir: string

export async function createTopProjectDirs(currentStack: StackInfo, appDir: string) {
  const dirList: string[] = []
  srcDir = `${appDir}/src`
  compDir = `${srcDir}/components`
  sourcePropsDir = `${compDir}/source-props`

  // general directories
  dirList.push(appDir)
  dirList.push(srcDir)
  dirList.push(`${compDir}/NavBar`)
  dirList.push(`${srcDir}/config`)
  dirList.push(`${srcDir}/custom`)
  dirList.push(`${srcDir}/client`)
  dirList.push(sourcePropsDir)
  dirList.push(compDir)

  // source directories
  // console.log(`currentStack.sources=${JSON.stringify(currentStack.sources, null, 2)}`)
  Object.keys(currentStack.sources).map(function (key) {
    dirList.push(`${compDir}/${singularName(currentStack.sources[key].name)}`)
  })

  await makeDirs(dirList)
}
export {sourcePropsDir}
export {compDir}
export {srcDir}
export {appDir}
