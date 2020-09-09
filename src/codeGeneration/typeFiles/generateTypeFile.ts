import * as path from 'path'
// import {TSError} from 'ts-node'
// import {fileURLToPath} from 'url'
import {BoilerPlateInfoType} from '../../constants'
import {StackInfo} from '../../constants/types'
import {singularName} from '../../tools/inflections'
import {compDir} from '../createTopProjectDirs'
import {makeDirs} from '../makeDirs'
import {sectionsContent} from './sectionsContent'
// import {generic} from '../sections/generic'

import {boilerPlateToDir} from './boilderPlateToDir'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers')
const fs = require('fs-extra')
// const fetch = require('node-fetch')
// const Handlebars = require('handlebars')
// const boilerPlateFromInfo = (boilerPlateInfo: BoilerPlateInfoType) =>
//   boilerPlates[boilerPlateInfo.formType + boilerPlateInfo.dataType + boilerPlateInfo.nodeType]

H.registerHelpers(Handlebars)

function registerPartial(path: string, name: string) {
  // Require partial
  const template = require(path)

  // Register partial
  Handlebars.registerPartial(name, template)
}

async function registerPartials(dir: string) {
  // console.log(`about to list partials in ${dir}`)
  const partials: [string] = await fs.readdir(dir)
  await Promise.all(partials.map(fileName => {
    const filePath = `${dir}/${fileName}`
    const fileType = path.parse(filePath).ext

    if (fileType === '.hbs' || fileType === '.handlebars') {
      const partialName = path.parse(filePath).name
      registerPartial(filePath, partialName)
    }
  }
  ))
}

export async function generateTypeFile(
  type: string,
  source: string,
  boilerPlateInfo: BoilerPlateInfoType,
  currentStack: StackInfo,
  templateLocation: string,
) {
  const dir = boilerPlateToDir(type, boilerPlateInfo.formType)

  try {
    await registerPartials(`${templateLocation}/partials`)
  } catch (error) {
    throw new Error(`error registering the partials at ${templateLocation}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  let generic = ''
  try {
    generic = await fs.readFile(`${templateLocation}/generic.hbs`, 'utf-8') // require('../sections/generic.hbs')
  } catch (error) {
    throw new Error(`error finding the file 'generic.hbs' at ${templateLocation}.
It may be that the template location is faulty, or that the template is not
correctly specified:
${error}`)
  }

  const genericTemplate = Handlebars.compile(generic)

  const path = `${compDir}/${singularName(source)}/${dir}`
  const dirList = [
    path,
  ]

  const tags = sectionsContent(type, source, currentStack, boilerPlateInfo)
  // console.log(`tags.context.formTypes.LIST=${JSON.stringify(tags.context.formTypes.LIST)}`)
  // console.log(`tags.context.boilerPlateInfo.formType=${JSON.stringify(tags.context.boilerPlateInfo.formType)}`)

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
    await fs.outputFile(`${path}/index.jsx`, genericTemplate(tags.context))
  } catch (error) {
    throw new Error(`error with generateFromBoilerPlate: ${error}`)
  }
}
