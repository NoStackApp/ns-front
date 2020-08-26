import {formTypes, nodeTypes} from '../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers');

H.registerHelpers(Handlebars);

export const proptypes = Handlebars.compile(`

// ns__start_section {{tempDetails}} propTypes
{{component}}.propTypes = {
{{#if (eq boilerPlateInfo.formType '${formTypes.CREATION}') }}
  parentId: PropTypes.string,
  refetchQueries: PropTypes.array,
  create{{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}{{names.singular}}{{/if}}: PropTypes.func,
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.LIST}') }}
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') }}
  parentId: PropTypes.string,
  selected: PropTypes.bool,
  updateInstance: PropTypes.func,
  deleteInstance: PropTypes.func,
  refetchQueries: PropTypes.array,
  {{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
  onSelect: PropTypes.func,
  {{/if}}
  {{instance}}: PropTypes.shape({
    children: PropTypes.array,
    id: PropTypes.string,
  }),
{{/if}}
  // ns__custom_start {{tempDetails}} addedPropTypes
  // ns__custom_end {{tempDetails}} addedPropTypes
};
// ns__end_section {{tempDetails}} propTypes
`)

