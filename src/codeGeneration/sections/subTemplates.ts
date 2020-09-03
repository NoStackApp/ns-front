const Handlebars = require('handlebars')

export const connectedChildrenImportsTemplate = Handlebars.compile(`
{{#connectedChildrenInfo}}
import {{childComponent}} from '../../{{singularConnected}}/{{childComponent}}';
{{/connectedChildrenInfo}}
`)

export const singleChildCreationCodeTemplate = Handlebars.compile(`
{{#singleChildrenInfo}}
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
{{/singleChildrenInfo}}
`)

export const childrenBodyTemplate = Handlebars.compile(`
{{#childrenInfo}}
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
{{/childrenInfo}}
`)

export const childrenConstantDeclarationsTemplate = Handlebars.compile(`
{{#childrenInfo}}
  const {{child}}Data = {{type}}.children && {{type}}.children.find(child => child.typeId === TYPE_{{childAllCaps}}_ID);
{{#if nonProperty}}
  const {{pluralChild}} = {{child}}Data ? {{child}}Data.instances : [];
{{else}}
  const {{child}} = {{child}}Data ? {{child}}Data.instances[0] : [];
{{/if}}
{{/childrenInfo}}
`)

export const childrenTypeListTemplate = Handlebars.compile(
  '{{#childrenInfo}},\n' +
  'TYPE_{{childAllCaps}}_ID{{/childrenInfo}}')

export const typeIdsForSingleChildrenTemplate = Handlebars.compile(
  '{{#singleChildrenInfo}}{{#if property}}, TYPE_{{childAllCaps}}_ID{{/if}}{{/singleChildrenInfo}}')

export const singleChildrenParamsTemplate = Handlebars.compile(
  '{{#singleChildrenInfo}}{{#if property}}, create{{childSingular}}{{/if}}{{/singleChildrenInfo}}')

export const singleChildrenComposeStatementsTemplate = Handlebars.compile(
  '{{#singleChildrenInfo}}{{#if property}}, graphql(EXECUTE_ACTION, { name: \'create{{singularChild}}\' }){{/if}}{{#if notIsLast}}, {{/if}}{{/singleChildrenInfo}}')

export const childrenImportsTemplate = Handlebars.compile(`
{{#childrenInfo}}
import {{childComponent}} from '../{{childComponent}}';
{{/childrenInfo}}
`)

export const actionIdsForSingleChildrenTemplate = Handlebars.compile(
  '{{#singleChildrenInfo}}, CREATE_{{childAllCaps}}_FOR_{{sourceAllCaps}}_ACTION_ID{{/singleChildrenInfo}}',
)

export const connectedChildrenBodyTemplate = Handlebars.compile(`
{{#connectedChildrenInfo}}
< {{childComponent}} {{type}}Id = { {{type}}.id} />
{{/connectedChildrenInfo}}
`)
