import {associationTypes, BoilerPlateInfoType, dataTypes, formTypes, nodeTypes} from '../constants'
import {StackInfo, TreeTypeChildrenList} from '../constants/types'
import {
  allCaps,
  pluralLowercaseName,
  pluralName,
  queryForSource,
  relationshipsForSource,
  singularName,
} from '../tools/inflections'

const Handlebars = require('handlebars')

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const contextForStandard = (
  component: string,
) => {
  // stack data
  const unit = 'general'

  const names = {
    singular: singularName(component),
    singularLowercase: component,
    plural: pluralName(component),
    pluralLowercase: pluralLowercaseName(component),
    component,
  }

  // content
  const fileInfo = fileInfoString({
    unitName: unit,
    component: names.component,
  })

  Handlebars.registerHelper('tempDetails', function () {
    const tempDetails = `unit: ${unit}, comp: ${names.component}, loc:`
    return new Handlebars.SafeString(tempDetails)
  })

  // const tempDetails = fileInfoString({
  //   unitName: unit,
  //   component: names.component,
  // }) + ', loc:'

  return {
    formTypes,
    nodeTypes,
    dataTypes,
    names,
    fileInfo,
  }
}
