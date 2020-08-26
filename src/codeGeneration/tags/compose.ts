import {formTypes} from '../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers');

H.registerHelpers(Handlebars);

// Handlebars.registerHelper('equal', function (lvalue: string, rvalue: string, options: any) {
//   if (arguments.length < 3)
//     throw new Error('Handlebars Helper equal needs 2 parameters')
//   if (lvalue !== rvalue) {
//     // @ts-ignore
//     return options.inverse(this);
//   }
//   // @ts-ignore
//   return options.fn(this);
// })

// Handlebars.registerHelper('equals', function (a: string, b: string) {
//   return a === b;
// })

// export const compose = Handlebars.compile(`
// {{#if isCreatonForm}}
// export default compose(graphql(EXECUTE, { name: 'create{{SingularName}}' }){{{SINGLE_CHILDREN_COMPOSE_STATEMENTS}}})({{SingularName}}CreationForm);
// {{else}}
// export default compose(
//   graphql(EXECUTE, { name: 'updateInstance' }),
//   graphql(EXECUTE, { name: 'deleteInstance' })
// )({{SingularName}})
// {{/if}}`)

export const compose = Handlebars.compile(`

// ns__start_section {{tempDetails}} compose
{{#if (eq formType '${formTypes.CREATION}') }}
export default compose(graphql(EXECUTE, { name: 'create{{SingularName}}' }){{{SINGLE_CHILDREN_COMPOSE_STATEMENTS}}})(
  {{SingularName}}CreationForm
);
{{/if}}
{{#if (eq formType '${formTypes.SINGLE_INSTANCE}') }}
export default compose(
  graphql(EXECUTE, { name: 'updateInstance' }),
  graphql(EXECUTE, { name: 'deleteInstance' })
)({{SingularName}});
{{/if}}
// ns__end_section {{tempDetails}} compose
`)

