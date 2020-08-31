const Handlebars = require('handlebars')

export const connectedChildrenImportsTemplate = Handlebars.compile(`
{{#connectedChildren}}
import {{childComponent}} from '../../{{singularConnected}}/{{childComponent}}';
{{/connectedChildren}}
`)
export const singleChildCreationCodeTemplate = Handlebars.compile(`
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
export const childrenBodyTemplate = Handlebars.compile(`
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
export const childrenConstantDeclarationsTemplate = Handlebars.compile(`
{{#children}}
  const {{child}}Data = {{type}}.children && {{type}}.children.find(child => child.typeId === TYPE_{{childAllCaps}}_ID);
{{#if nonProperty}}
  const {{pluralChild}} = {{child}}Data ? {{child}}Data.instances : [];
{{else}}
  const {{child}} = {{child}}Data ? {{child}}Data.instances[0] : [];
{{/if}}
{{/children}}
`)
export const childrenTypeListTemplate = Handlebars.compile(
  '{{#children}},\n' +
  'TYPE_{{childAllCaps}}_ID{{/children}}')
export const typeIdsForSingleChildrenTemplate = Handlebars.compile(
  '{{#children}}{{#if property}}, TYPE_{{childAllCaps}}_ID{{/if}}{{/children}}')
export const singleChildrenParamsTemplate = Handlebars.compile(
  '{{#children}}{{#if property}}, create{{childSingular}}{{/if}}{{/children}}')
export const singleChildrenComposeStatementsTemplate = Handlebars.compile(
  '{{#children}}{{#if property}}, graphql(EXECUTE_ACTION, { name: \'create{{childSingular}}\' }){{/if}}{{#if notIsLast}}, {{/if}}{{/children}}')
export const childrenImportsTemplate = Handlebars.compile(`
{{#children}}
import {{childComponent}} from '../{{childComponent}}';
{{/children}}
`)
export const actionIdsForSingleChildrenTemplate = Handlebars.compile(
  '{{#children}}, CREATE_{{childAllCaps}}_FOR_{{sourceAllCaps}}_ACTION_ID{{/children}}',
)
export const connectedChildrenBodyTemplate = Handlebars.compile(`
{{#connectedChildren}}
< {{childComponent}} {{type}}Id = { {{type}}.id} />
{{/connectedChildren}}
`)
