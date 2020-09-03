const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers')

import {formTypes} from '../../constants'

H.registerHelpers(Handlebars)

export const generic = Handlebars.compile(`
{{> START_OF_FILE fileInfo=fileInfo}}
{{{IMPORTS_SECTION}}}
{{{STYLING_SECTION}}}
{{{BUTTON_SECTION}}}
{{{FUNCTION_SECTION}}}
{{#if (eq boilerPlateInfo.formType '${formTypes.LIST}') }}
export default {{PluralName}};
{{/if}}
{{#if (neq boilerPlateInfo.formType '${formTypes.LIST}') }}
{{{COMPOSE_CLAUSE}}}
{{{PROP_TYPES_SECTION}}}
{{/if}}
`)
