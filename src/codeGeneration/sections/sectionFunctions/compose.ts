import {formTypes} from '../../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers')

H.registerHelpers(Handlebars)

export const compose = Handlebars.compile(`

// ns__start_section {{tempDetails}} compose
{{#if (eq boilerPlateInfo.formType '${formTypes.CREATION}') }}
export default compose(graphql(EXECUTE, { name: 'create{{names.singular}}' }){{{SINGLE_CHILDREN_COMPOSE_STATEMENTS}}})(
  {{names.singular}}CreationForm
);
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') }}
export default compose(
  graphql(EXECUTE, { name: 'updateInstance' }),
  graphql(EXECUTE, { name: 'deleteInstance' })
)({{names.singular}});
{{/if}}
// ns__end_section {{tempDetails}} compose
`)

