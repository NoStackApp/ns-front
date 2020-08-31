import {BoilerPlateInfoType} from '../../constants'
import {StackInfo} from '../../constants/types'
import {singularName} from '../../tools/inflections'
import {compDir} from '../createTopProjectDirs'
import {makeDirs} from '../makeDirs'
import {sectionsContent} from '../sections/sectionsContent'
import {generic} from './generic'

import {boilerPlateToDir} from './boilderPlateToDir'

const fs = require('fs-extra')

// const boilerPlateFromInfo = (boilerPlateInfo: BoilerPlateInfoType) =>
//   boilerPlates[boilerPlateInfo.formType + boilerPlateInfo.dataType + boilerPlateInfo.nodeType]

export async function generateTypeFile(type: string, source: string, boilerPlateInfo: BoilerPlateInfoType, currentStack: StackInfo) {
  const dir = boilerPlateToDir(type, boilerPlateInfo.formType)
  // console.log(`in generateTypeFile, dir=${dir}`)

  const path = `${compDir}/${singularName(source)}/${dir}`
  const dirList = [
    path,
  ]

  const tags = sectionsContent(type, source, currentStack, boilerPlateInfo)

  // if (boilerPlate === 'genericCreationFormRoot') {
  //   console.log(`tags = ${JSON.stringify(tags, null, 2)}`)
  // }
  // console.log(`options is: ${JSON.stringify(options)}`)
  await makeDirs(dirList)

  try {
    // const specificFileTemplate = Handlebars.compile(await fs.readFile(`${boilerplateDir}/${boilerPlate}.js`, 'utf-8'))
    // console.log(`tags.START_OF_FILE=${tags.START_OF_FILE}`)
    await fs.outputFile(`${path}/index.jsx`, generic(tags))
  } catch (error) {
    throw new Error(`error with generateFromBoilerPlate: ${error}`)
  }
}
