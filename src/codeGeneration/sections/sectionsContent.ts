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
import {compose} from './sectionFunctions/compose'
import {functionDec} from './sectionFunctions/functionDec'
import {handlers} from './sectionFunctions/handlers'
import {proptypes} from './sectionFunctions/propTypes'
import {styling} from './sectionFunctions/styling'
import {imports} from './sectionFunctions/imports'
import {button} from './sectionFunctions/button'

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

// const componentName = (type: string, componentType: string) => {
//   if (componentType === formTypes.CREATION) return singularName(type) + 'CreationForm'
//   if (componentType === formTypes.LIST) return pluralName(type)
//   return singularName(type)
// };

// const isCreationType = (componentType: string) => componentType === formTypes.CREATION;

const fileInfoString = Handlebars.compile('unit: {{unitName}}, comp: {{component}}')

const singleChildCreationCodeTemplate = Handlebars.compile(`
{{#children}}
{{#if property}}
    await create{{singularChild}}({
      variables: {
        actionId: CREATE_{{childAllCaps}}_FOR_{{sourceAllCaps}}_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: new{{singularParent}}Data.instanceId,
          value: 'false',
        }),
        unrestricted: false,
      },
      refetchQueries,
    });
{{/if}}
{{/children}}
`)

const childrenBodyTemplate = Handlebars.compile(`
{{#children}}
{{#if nonProperty}}
< {{childComponent}}
              {{childPlural}} = { {{childPlural}} }
              {{type}}Id = { {{type}}.id }
              label='{{childSingular}}?'
              refetchQueries={refetchQueries}
      />
{{else}}
< {{childComponent}}
              {{child}} = { {{child}} }
              {{type}}Id = { {{type}}.id }
              label='{{childComponent}}?'
              refetchQueries={refetchQueries}
      />
{{/if}}
{{/children}}
`)

const childrenConstantDeclarationsTemplate = Handlebars.compile(`
{{#children}}
  const {{child}}Data = {{type}}.children && {{type}}.children.find(child => child.typeId === TYPE_{{childAllCaps}}_ID);
{{#if nonProperty}}
  const {{pluralChild}} = {{child}}Data ? {{child}}Data.instances : [];
{{else}}
  const {{child}} = {{child}}Data ? {{child}}Data.instances[0] : [];
{{/if}}
{{/children}}
`)

const childrenTypeListTemplate = Handlebars.compile(
  '{{#children}},\n' +
  'TYPE_{{childAllCaps}}_ID{{/children}}')
const typeIdsForSingleChildrenTemplate = Handlebars.compile(
  '{{#children}}{{#if property}}, TYPE_{{childAllCaps}}_ID{{/if}}{{/children}}')
const singleChildrenParamsTemplate = Handlebars.compile(
  '{{#children}}{{#if property}}, create{{childSingular}}{{/if}}{{/children}}')
const singleChildrenComposeStatementsTemplate = Handlebars.compile(
  '{{#children}}{{#if property}}, graphql(EXECUTE_ACTION, { name: \'create{{childSingular}}\' }){{/if}}{{#if notIsLast}}, {{/if}}{{/children}}')

const childrenImportsTemplate = Handlebars.compile(`
{{#children}}
import {{childComponent}} from '../{{childComponent}}';
{{/children}}
`)

const actionIdsForSingleChildrenTemplate = Handlebars.compile(
  '{{#children}}, CREATE_{{childAllCaps}}_FOR_{{sourceAllCaps}}_ACTION_ID{{/children}}',
)

const connectedChildrenBodyTemplate = Handlebars.compile(`
{{#connectedChildren}}
< {{childComponent}} {{type}}Id = { {{type}}.id} />
{{/connectedChildren}}
`)

const connectedChildrenImportsTemplate = Handlebars.compile(`
{{#connectedChildren}}
import {{childComponent}} from '../../{{singularConnected}}/{{childComponent}}';
{{/connectedChildren}}
`)

export const sectionsContent = (
  type: string,
  unit: string,
  stackInfo: StackInfo,
  boilerPlateInfo: BoilerPlateInfoType,
) => {
  // we set children and connectedChildren, then derive all of the tag values to pass to the boilerplate templates.
  const unitInfo = stackInfo.sources[unit]
  const typeUnitInfo = stackInfo.types[type].sources[unit]
  const {parentType} = typeUnitInfo

  const children = unitInfo.selectedTree[type]
  // console.log(`children for type ${type} = ${JSON.stringify(children)}`)
  const connectedUnit: string = unitInfo.connections[type]
  const constraintsInfo = unitInfo.constraints

  let connectedChildren: TreeTypeChildrenList = {}
  if (connectedUnit) {
    connectedChildren = {
      ...stackInfo.sources[connectedUnit].tree[type],
    }
  }

  // updateOnAddLine is 'refetchQueries' unless the current typeName is a property.
  let refetchQueriesLine = 'refetchQueries,'
  if (boilerPlateInfo.nodeType === nodeTypes.ROOT) {
    children.map(
      child => {
        const childInfo = stackInfo.types[child]
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

  const component = getComponentName(type, boilerPlateInfo.formType)
  const instance = getInstance(type, boilerPlateInfo.formType)

  const childrenBodyList = childrenBodyTemplate({
    children: children.map(child => {
      const childInfo = stackInfo.types[child]
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
      const childInfo = stackInfo.types[child]
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

  const SingularName = singularName(type)
  const PluralName = pluralName(type)
  const typeSpecifier = allCaps(`${type}_for_${unit}`)

  const singleChildrenParams = singleChildrenParamsTemplate({
    children: children.map(child => {
      const childInfo = stackInfo.types[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
        return {property: true, childSingular: singularName(child)}
    }),
  })
  const actionIdsForSingleChildren = actionIdsForSingleChildrenTemplate({
    children: children.map(child => {
      const childInfo = stackInfo.types[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
        return {childAllCaps: allCaps(child), sourceAllCaps: allCaps(unit)}
    }).filter(Boolean),
  })
  const typeIdsForSingleChildren = typeIdsForSingleChildrenTemplate({
    children: children.map(child => {
      const childInfo = stackInfo.types[child]
      const assnInfo = childInfo.sources[unit]
      if (assnInfo.assnType === associationTypes.SINGLE_REQUIRED)
        return {property: true, childAllCaps: allCaps(child)}
    }),
  })

  const childrenConstantDeclarations = childrenConstantDeclarationsTemplate({
    children: children.map(child => {
      const childInfo = stackInfo.types[child]
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
      const childInfo = stackInfo.types[child]
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

  const singleChildCreationCode = singleChildCreationCodeTemplate({
    children: children.map(child => {
      const childInfo = stackInfo.types[child]
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
