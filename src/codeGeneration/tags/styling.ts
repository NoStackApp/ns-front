import {formTypes, dataTypes, nodeTypes} from '../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers');

H.registerHelpers(Handlebars);

const startCustomStyling = `// ns__custom_start {{tempDetails}} styling`;

const endCustomStyling = `// ns__custom_end {{tempDetails}} styling`

export const styling = Handlebars.compile(`

// ns__start_section {{tempDetails}} stylingSection
{{#if (eq boilerPlateInfo.formType '${formTypes.CREATION}') }}
const Form = styled.div\`
  ${startCustomStyling}
  margin: 2em;
  padding: 1.5em;
  border: none;
  border-radius: 5px;
  background-color: #F5F5F5;
  ${endCustomStyling}
\`;
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.LIST}') }}
    {{#if (neq boilerPlateInfo.formType '${nodeTypes.ROOT}') }}
const {{names.plural}}StyleWrapper = styled.div\`
  ${startCustomStyling}
  ${endCustomStyling}
\`;
    {{/if}}
    {{#if (eq boilerPlateInfo.formType '${nodeTypes.ROOT}') }}
const {{names.plural}}StyleWrapper = styled.div\`
  ${startCustomStyling}
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  ${endCustomStyling}
\`;
    {{/if}}

{{/if}}
{{#if (and (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') (eq boilerPlateInfo.dataType '${dataTypes.STRING}')) }}
const {{names.singular}}StyleWrapper = styled.div(
  ({ selected, isDeleting }) => \`
  ${startCustomStyling}
  margin: 2em 1em;
  padding: 1.5em;
  border: \${selected ? '1px solid aquamarine' : '1px solid white'};
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
  background-color: \${isDeleting && 'tomato'};
  cursor: \${selected ? 'auto' : 'pointer'};

  &:hover {
    border: 1px solid aquamarine;
  }
  ${endCustomStyling}
\`
);
{{/if}}
{{#if (and (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') (eq boilerPlateInfo.dataType '${dataTypes.BOOLEAN}')) }}
const {{names.singular}}StyleWrapper = styled.span\`
  ${startCustomStyling}
  margin-left: 1.5em;
  display: inline-block;
  border: 1px solid #eeeeee;
  padding: 0.5em;
  ${endCustomStyling}
\`;
{{/if}}
// ns__end_section {{tempDetails}} stylingSection
`)

