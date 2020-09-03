import {BoilerPlateInfoType} from '../../constants'
import {StackInfo} from '../../constants/types'
import {singularName} from '../../tools/inflections'
import {compDir} from '../createTopProjectDirs'
import {makeDirs} from '../makeDirs'
import {sectionsContent} from '../sections/sectionsContent'
import {generic} from './generic'

import {boilerPlateToDir} from './boilderPlateToDir'

const fs = require('fs-extra')
// const fetch = require('node-fetch')
// const Handlebars = require('handlebars')

// const boilerPlateFromInfo = (boilerPlateInfo: BoilerPlateInfoType) =>
//   boilerPlates[boilerPlateInfo.formType + boilerPlateInfo.dataType + boilerPlateInfo.nodeType]

export async function generateTypeFile(type: string, source: string, boilerPlateInfo: BoilerPlateInfoType, currentStack: StackInfo) {
  const dir = boilerPlateToDir(type, boilerPlateInfo.formType)

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

  // const unitTemplate = 'https://raw.githubusercontent.com/YizYah/basicNsFrontTemplate/master/generic.txt'
  // let specificFileTemplate = function (tags: any) {
  //   // eslint-disable-next-line no-console
  //   console.error(`template not fetched.  This could be due to a uri error
  //   tags = ${JSON.stringify(tags)}`)
  //   throw new Error('template not fetched.  This could be due to a uri error')
  // }
  try {
    // await fetch(unitTemplate)
    // .then((res: any) => res.text())
    // .then((body: any) => {
    //   specificFileTemplate = Handlebars.compile(body)
    // })

    // await fs.outputFile(`${path}/index.jsx`, specificFileTemplate(tags))
    await fs.outputFile(`${path}/index.jsx`, generic(tags))
  } catch (error) {
    throw new Error(`error with generateFromBoilerPlate: ${error}`)
  }
}
