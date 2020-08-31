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
import {beginningOfFile} from './sectionFunctions/beginningOfFile'
import {button} from './sectionFunctions/button'
import {compose} from './sectionFunctions/compose'
import {functionDec} from './sectionFunctions/functionDec'
import {handlers} from './sectionFunctions/handlers'
import {imports} from './sectionFunctions/imports'
import {proptypes} from './sectionFunctions/propTypes'
import {styling} from './sectionFunctions/styling'
import {
  actionIdsForSingleChildrenTemplate,
  childrenBodyTemplate,
  childrenConstantDeclarationsTemplate,
  childrenImportsTemplate,
  childrenTypeListTemplate,
  connectedChildrenBodyTemplate,
  connectedChildrenImportsTemplate,
  singleChildCreationCodeTemplate,
  singleChildrenComposeStatementsTemplate,
  singleChildrenParamsTemplate,
  typeIdsForSingleChildrenTemplate,
} from './subTemplates'

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

  let connectedChildren: TreeTypeChildrenList = {}
  if (connectedUnit) {
    connectedChildren = {
      ...connectedUnitInfo.tree[type],
    }
  }

  // content
  const typeSpecifier = allCaps(`${type}_for_${unit}`)

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

  const childrenBodyList = childrenBodyTemplate({
    children: children.map(child => {
      const childInfo = typesInfo[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType !== associationTypes.SINGLE_REQUIRED)
        return {
          nonProperty: true,
          childComponent: pluralName(child),
          childPlural: pluralLowercaseName(child),
          childSingular: singularName(child),
          type,
        }
      return {
        nonProperty: false,
        childComponent: singularName(child),
        child,
        type,
      }
    }),
  }) + connectedChildrenBodyTemplate(
    {
      connectedChildren: Object.keys(connectedChildren).map((child: string) => {
        if (connectedChildren[child] !== associationTypes.SINGLE_REQUIRED)
          return {childComponent: pluralName(child), type}
        return {childComponent: singularName(child), type}
      }),
    },
  )

  const childrenImportList = childrenImportsTemplate({
    children: children.map(child => {
      const childInfo = typesInfo[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType !== associationTypes.SINGLE_REQUIRED)
        return {childComponent: pluralName(child)}
      return {childComponent: singularName(child)}
    }),
  }) + connectedChildrenImportsTemplate(
    {
      connectedChildren: Object.keys(connectedChildren).map((child: string) => {
        const singularConnected = singularName(connectedUnit)
        if (connectedChildren[child] !== associationTypes.SINGLE_REQUIRED)
          return {childComponent: pluralName(child), singularConnected}
        return {childComponent: singularName(child), singularConnected}
      }),
    },
  )

  const singleChildrenParams = singleChildrenParamsTemplate({
    children: children.map(child => {
      const childInfo = typesInfo[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
        return {property: true, childSingular: singularName(child)}
    }),
  })
  const actionIdsForSingleChildren = actionIdsForSingleChildrenTemplate({
    children: children.map(child => {
      const childInfo = typesInfo[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
        return {childAllCaps: allCaps(child), sourceAllCaps: allCaps(unit)}
    }).filter(Boolean),
  })
  const typeIdsForSingleChildren = typeIdsForSingleChildrenTemplate({
    children: children.map(child => {
      const childInfo = typesInfo[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
        return {property: true, childAllCaps: allCaps(child)}
    }),
  })

  const childrenConstantDeclarations = childrenConstantDeclarationsTemplate({
    children: children.map(child => {
      const childInfo = typesInfo[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType !== associationTypes.SINGLE_REQUIRED)
        return {
          nonProperty: true,
          childAllCaps: allCaps(child),
          child,
          type,
          pluralChild: pluralLowercaseName(child),
        }
      return {
        nonProperty: false,
        childAllCaps: allCaps(child),
        child,
        type,
      }
    }),
  })

  const childrenTypeList = childrenTypeListTemplate({
    children: children.map(child => {
      return {childAllCaps: allCaps(child)}
    }),
  })

  const singleChildrenComposeStatements = singleChildrenComposeStatementsTemplate({
    children: children.map(child => {
      const childInfo = typesInfo[child]
      const assnInfo = childInfo.sources[unit]
      // const isNotLast: boolean = numberOfChildren > index + 1
      // console.log(`for type ${type}, for child ${child}, isNotLast=${isNotLast}`)
      // if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
      //   return {property: true, childSingular: singularName(child), isNotLast}

      if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
        return {property: true, childSingular: singularName(child)}
    }),
  })

  const fileInfo = fileInfoString({
    unitName: unit,
    component: getComponentName(type, boilerPlateInfo.formType),
  })

  const singleChildCreationCode = singleChildCreationCodeTemplate({
    children: children.map(child => {
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
    }),
  })

  return {
    START_OF_FILE: beginningOfFile({
      fileInfo,
      defaultContent: '\'use strict\';',
    }),
    COMPOSE_CLAUSE: compose({
      boilerPlateInfo,
      singleChildrenComposeStatements,
      names,
    }),
    STYLING_SECTION: styling({
      boilerPlateInfo,
      tempDetails,
      names,
    }),
    PROP_TYPES_SECTION: proptypes({
      boilerPlateInfo,
      component,
      instance,
      tempDetails,
      names,
    }),
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
    BUTTON_SECTION: button({
      boilerPlateInfo,
      component,
      instance,
      tempDetails,
    }),
    HANDLERS_SECTION: handlers({
      boilerPlateInfo,
      component,
      instance,
      tempDetails,
      SingularName,
      typeSpecifier,
      refetchQueriesLine,
      SingularNameLowercase: type,
      singleChildCreationCode,
    }),
    FUNCTION_SECTION: functionDec({
      boilerPlateInfo,
      component,
      instance,
      tempDetails,
      names,
      typeSpecifier,
      childrenBodyList,
      childrenConstantDeclarations,
      singleChildrenParams,
      refetchQueriesLine,
      constraintValue,
    }),
  }
}
