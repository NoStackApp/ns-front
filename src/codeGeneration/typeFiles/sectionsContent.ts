import {associationTypes, BoilerPlateInfoType, dataTypes, formTypes, nodeTypes} from '../../constants'
import {StackInfo, TreeTypeChildrenList} from '../../constants/types'
import {
  allCaps,
  pluralLowercaseName,
  pluralName,
  queryForSource,
  relationshipsForSource,
  singularName,
} from '../../tools/inflections'

const Handlebars = require('handlebars')

const getComponentName = (type: string, componentType: string) => {
  if (componentType === formTypes.CREATION)
    return singularName(type) + 'CreationForm'
  if (componentType === formTypes.LIST) return pluralName(type)
  return singularName(type)
}

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const sectionsContent = (
  type: string,
  unit: string,
  stackInfo: StackInfo,
  boilerPlateInfo: BoilerPlateInfoType,
) => {
  // stack data
  const typesInfo = stackInfo.types
  const sourcesInfo = stackInfo.sources
  const unitInfo = sourcesInfo[unit]
  const typeUnitInfo = typesInfo[type].sources[unit]
  const {parentType} = typeUnitInfo
  const children = unitInfo.selectedTree[type]
  const connectedUnit: string = unitInfo.connections[type]
  const connectedUnitInfo = sourcesInfo[connectedUnit]
  const constraintsInfo = unitInfo.constraints

  const names = {
    singular: singularName(type),
    singularLowercase: type,
    plural: pluralName(type),
    pluralLowercase: pluralLowercaseName(type),
    parent: parentType,
    component: getComponentName(type, boilerPlateInfo.formType),
    source: {
      name: unit,
      allCaps: allCaps(unit),
      constant: `SOURCE_${allCaps(unit)}_ID`,
      typeSpecifier: allCaps(`${type}_for_${unit}`),
      relationships: relationshipsForSource(unit),
      query: queryForSource(unit),
    },
  }

  // content
  const fileInfo = fileInfoString({
    unitName: unit,
    component: names.component,
  })

  let connectedChildren: TreeTypeChildrenList = {}
  if (connectedUnit) {
    connectedChildren = {
      ...connectedUnitInfo.tree[type],
    }
  }

  Handlebars.registerHelper('refetchQueriesLine', function () {
    // updateOnAddLine is 'refetchQueries' unless the current typeName is a property.
    let refetchQueriesLine = 'refetchQueries,'
    if (boilerPlateInfo.nodeType === nodeTypes.ROOT) {
      children.map(
        child => {
          const childInfo = typesInfo[child]
          const assnInfo = childInfo.sources[unit]
          if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED) {
            refetchQueriesLine = ''
          }
        },
      )
    }
    return new Handlebars.SafeString(refetchQueriesLine)
  })

  Handlebars.registerHelper('constraintValue', function () {
    // constraintValue is is set to 'ignoredParameter' except in specific cases.
    let constraintValue = 'ignoredParameter'
    Object.keys(constraintsInfo).map(key => {
      if (constraintsInfo[key].constraintType === 'ID') {
        if (constraintsInfo[key].typeName === parentType || unitInfo.selectionRoot) {
          constraintValue = constraintsInfo[key].constraintValue
        }
      }
    })
    return new Handlebars.SafeString(constraintValue)
  })

  Handlebars.registerHelper('tempDetails', function () {
    const tempDetails = `unit: ${unit}, comp: ${names.component}, loc:`
    return new Handlebars.SafeString(tempDetails)
  })

  // const tempDetails = fileInfoString({
  //   unitName: unit,
  //   component: names.component,
  // }) + ', loc:'

  // data for specific templates

  const childrenInfoAll = children.map(child => {
    const childInfo = typesInfo[child]
    const assnInfo = childInfo.sources[unit]
    if (assnInfo.assnType !== associationTypes.SINGLE_REQUIRED)
      return {
        nonProperty: true,
        childComponent: pluralName(child),
        childPlural: pluralLowercaseName(child),
        childAllCaps: allCaps(child),
        childSingular: singularName(child),
        child,
        type,
        pluralChild: pluralLowercaseName(child),
      }
    return {
      nonProperty: false,
      childComponent: singularName(child),
      childAllCaps: allCaps(child),
      child,
      type,
    }
  })

  const connectedChildrenInfo =
    Object.keys(connectedChildren).map((child: string) => {
      const singularConnected = singularName(connectedUnit)
      if (connectedChildren[child] !== associationTypes.SINGLE_REQUIRED)
        return {childComponent: pluralName(child), singularConnected, type}
      return {childComponent: singularName(child), singularConnected, type}
    })

  const singleChildrenInfo = children.map(child => {
    const childInfo = typesInfo[child]
    const assnInfo = childInfo.sources[unit]
    if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
      return {
        property: true,
        singularChild: singularName(child),
        childAllCaps: allCaps(child),
        sourceAllCaps: allCaps(unit),
        singularParent: singularName(type),
      }
  }).filter(Boolean)

  /*
      IMPORTS_SECTION: imports({
      boilerPlateInfo,
      component,
      instance,
      tempDetails,
      names,
      childrenImportList,
      typeSpecifier,
      childrenTypeList,
      actionIdsForSingleChildren,
      typeIdsForSingleChildren,
    }),
   */

  const childrenInfo = {
    all: childrenInfoAll,
    connected: connectedChildrenInfo,
    single: singleChildrenInfo,
  }

  return {
    context: {
      formTypes,
      nodeTypes,
      dataTypes,
      boilerPlateInfo,
      names,
      childrenInfo,
      fileInfo,
    },
  }
}
