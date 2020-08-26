import {boilerplateDir, BoilerPlateInfoType, boilerPlates} from '../../constants'
import {StackInfo} from '../../constants/types'
import {singularName} from '../../tools/inflections'
import {compDir} from '../createTopProjectDirs'
import {makeDirs} from '../makeDirs'
import {replacementTags} from '../tags/replacementTags'

import {boilerPlateToDir} from './boilderPlateToDir'

const fs = require('fs-extra')
const Handlebars = require('handlebars')

const boilerPlateFromInfo = (boilerPlateInfo: BoilerPlateInfoType) =>
  boilerPlates[boilerPlateInfo.formType + boilerPlateInfo.dataType + boilerPlateInfo.nodeType]

export async function generateTypeFile(type: string, source: string, boilerPlateInfo: BoilerPlateInfoType, currentStack: StackInfo) {
  console.log(`in generateTypeFile, type=${type}, boilerPlateInfo=${JSON.stringify(boilerPlateInfo)}`)
  const boilerPlate = boilerPlateFromInfo(boilerPlateInfo)
  console.log(`... boilerPlate=${boilerPlate}`)
  const dir = boilerPlateToDir(type, boilerPlateInfo.formType)
  // console.log(`in generateTypeFile, dir=${dir}`)

  const path = `${compDir}/${singularName(source)}/${dir}`
  const dirList = [
    path,
  ]

  console.log(`about to call replacementTags(${type}, ${source}, ${currentStack}, ${boilerPlateInfo})`)
  const tags = replacementTags(type, source, currentStack, boilerPlateInfo)

  // if (boilerPlate === 'genericCreationFormRoot') {
  //   console.log(`tags = ${JSON.stringify(tags, null, 2)}`)
  // }
  // console.log(`options is: ${JSON.stringify(options)}`)
  await makeDirs(dirList)

  try {
    const template = Handlebars.compile(await fs.readFile(`${boilerplateDir}/${boilerPlate}.js`, 'utf-8'))
    // console.log(`tags.START_OF_FILE=${tags.START_OF_FILE}`)
    await fs.outputFile(`${path}/index.jsx`, template(tags))
  } catch (err) {
    console.error(err)
    throw new Error(`error with generateFromBoilerPlate: ${err}`)
  }
}
