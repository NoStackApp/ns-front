import {associationTypes, boilerplateDir} from '../constants'
import {StackInfo} from '../constants/types'
import {allCaps, pluralName, singularName} from '../tools/inflections'

// import {srcDir} from './createTopProjectDirs'

const fs = require('fs-extra')
const Handlebars = require('handlebars')

export async function generateAppFile(currentStack: StackInfo, userClass: string, srcDir: string) {
  // App
  if (!currentStack.userClasses[userClass]) {
    throw new Error(`template contains no userClass '${userClass}'`)
  }

  const source: string = currentStack.userClasses[userClass].topSource
  if (!source) {
    throw new Error('template contains no sources')
  }

  // console.log(`currentStack.sources[source]=${JSON.stringify(currentStack.sources[source])}`)

  const highestLevel = 'highestLevel'
  const sourceInfo = currentStack.sources[source]
  const highestLevelList = sourceInfo.selectedTree[highestLevel]

  let topComponentType: string = sourceInfo.root
  let topComponent = singularName(topComponentType)
  const topComponentSetting = `${userClass}Id={ currentUser.id }`

  if (highestLevelList.length === 1) {
    topComponentType = highestLevelList[0]
    topComponent = pluralName(topComponentType)
    // topComponentSetting = `${userClass}Id={ currentUser.id }`
  }

  // eslint-disable-next-line no-warning-comments
  // todo: remove this
  if (!topComponentType) {
    throw new Error(`source ${source} contains no selected items`)
  }

  if (currentStack.types[topComponentType].sources[source].assnType === associationTypes.SINGLE_REQUIRED) {
    topComponent = singularName(topComponentType)
  }

  const appFile = Handlebars.compile(await fs.readFile(`${boilerplateDir}/App.js`, 'utf-8'))

  const appFileContents = appFile({
    sourceName: singularName(source),
    topComponentName: topComponent,
    topComponentPropSetting: topComponentSetting,
    userTypeId: `TYPE_${allCaps(userClass)}_ID`,
  })

  // console.log(appFileContents)
  await fs.outputFile(`${srcDir}/App.js`, appFileContents)
}
