import {dataTypes, formTypes, nodeTypes} from '../constants'
import {AppInfo, StackInfo} from '../constants/types'
import {
  allCaps,
  pluralLowercaseName,
  pluralName,
  singularName,
} from '../tools/inflections'

const Handlebars = require('handlebars')

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const contextForStandard = (
  appInfo: AppInfo,
  stackInfo: StackInfo,
  component: string
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

  const actionTypeList = Object.keys(stackInfo.actions).map(actionType => {
    const actionsForCurrentType = stackInfo.actions[actionType]
    return {
      actionType,
      actions: Object.keys(actionsForCurrentType).map(action => {
        const currentActionInfo = actionsForCurrentType[action]
        return {
          actionConst: currentActionInfo.const,
          actionId: currentActionInfo.id,
        }
      }),
    }
  })

  const sourceList = Object.keys(stackInfo.sources).map(sourceName => {
    const currentSourceInfo = stackInfo.sources[sourceName]
    return {
      sourceConst: currentSourceInfo.const,
      sourceId: currentSourceInfo.id,
    }
  })

  const typesText = Object.keys(stackInfo.types).map(typeName => {
    const currentTypeInfo = stackInfo.types[typeName]
    return {
      typeConst: currentTypeInfo.const,
      typeId: currentTypeInfo.id,
    }
  })

  const topUnit = singularName(appInfo.topUnits[0])
  const topComponentName = singularName(Object.keys(appInfo.units)[0])
  const userClass = appInfo.userClass
  const topComponentPropSetting = `${userClass}Id={ currentUser.id }`
  const userTypeId = `TYPE_${allCaps(userClass)}_ID`

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
    topUnit,
    topComponentName,
    topComponentPropSetting,
    userTypeId,
    appName: appInfo.appName,
    stackId: stackInfo.stack.stackId,
    sources: sourceList,
    types: typesText,
    actionTypes: actionTypeList,
  }
}
