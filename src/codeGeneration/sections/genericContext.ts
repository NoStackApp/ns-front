import {associationTypes, BoilerPlateInfoType, formTypes, nodeTypes} from '../../constants'
import {StackInfo, TreeTypeChildrenList} from '../../constants/types'
import {
  allCaps,
  pluralLowercaseName,
  pluralName,
  queryForSource,
  relationshipsForSource,
  singularName,
} from '../../tools/inflections'
// import {beginningOfFile} from './sectionFunctions/beginningOfFile'
// import {button} from './sectionFunctions/button'
// import {compose} from './sectionFunctions/compose'
// import {functionDec} from './sectionFunctions/functionDec'
// import {handlers} from './sectionFunctions/handlers'
// import {imports} from './sectionFunctions/imports'
// import {proptypes} from './sectionFunctions/propTypes'
// import {styling} from './sectionFunctions/styling'
// import {
//   actionIdsForSingleChildrenTemplate,
//   childrenBodyTemplate,
//   childrenConstantDeclarationsTemplate,
//   childrenImportsTemplate,
//   childrenTypeListTemplate,
//   connectedChildrenBodyTemplate,
//   connectedChildrenImportsTemplate,
//   singleChildCreationCodeTemplate,
//   singleChildrenComposeStatementsTemplate,
//   singleChildrenParamsTemplate,
//   typeIdsForSingleChildrenTemplate,
// } from './subTemplates'

const Handlebars = require('handlebars')
const inflection = require('inflection')

// Handlebars.registerHelper('escape', function (variable: string) {
//   return variable.replace(/(['"])/g, '\\$1');
// });

const getInstance = (type: string, componentType: string) => {
  if (componentType === formTypes.LIST) return pluralLowercaseName(type)
  return type
}

const getLowercaseComponentName = (type: string, componentType: string) => {
  if (componentType === formTypes.CREATION) return type + 'CreationForm'
  if (componentType === formTypes.LIST) return pluralLowercaseName(type)
  return type
}

const getComponentName = (type: string, componentType: string) => {
  return inflection.camelize(getLowercaseComponentName(type, componentType))
}

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

export const genericContext = (
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

  // names
  const SingularName = singularName(type)
  const PluralName = pluralName(type)
  const component = getComponentName(type, boilerPlateInfo.formType)
  const instance = getInstance(type, boilerPlateInfo.formType)
  const names = {
    singular: SingularName,
    singularLowercase: type,
    plural: PluralName,
    pluralLowercase: pluralLowercaseName(type),
    parent: parentType,
    source: {
      name: unit,
      allCaps: allCaps(unit),
      constant: `SOURCE_${allCaps(unit)}_ID`,
      relationships: relationshipsForSource(unit),
      query: queryForSource(unit),
    },
  }

  // we set children and connectedChildren, then derive all of the tag values
  // to pass to the boilerplate templates.

  // content
  const fileInfo = fileInfoString({
    unitName: unit,
    component: getComponentName(type, boilerPlateInfo.formType),
  })

  const typeSpecifier = allCaps(`${type}_for_${unit}`)

  let connectedChildren: TreeTypeChildrenList = {}
  if (connectedUnit) {
    connectedChildren = {
      ...connectedUnitInfo.tree[type],
    }
  }

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

  // constraintValue is is set to 'ignoredParameter' except in specific cases.
  let constraintValue = 'ignoredParameter'
  Object.keys(constraintsInfo).map(key => {
    if (constraintsInfo[key].constraintType === 'ID') {
      if (constraintsInfo[key].typeName === parentType || unitInfo.selectionRoot) {
        constraintValue = constraintsInfo[key].constraintValue
      }
    }
  })

  const tempDetails = fileInfoString({
    unitName: unit,
    component: getComponentName(type, boilerPlateInfo.formType),
  }) + ', loc:'

  // data for specific templates

  const childrenInfo = children.map(child => {
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

  return {
    component,
    instance,
    names,
    fileInfo,
    tempDetails,
    typeSpecifier,
    refetchQueriesLine,
    constraintValue,
    childrenInfo,
    connectedChildrenInfo,
    singleChildrenInfo,
  }
}
