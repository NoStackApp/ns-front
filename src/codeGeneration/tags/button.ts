import {formTypes, nodeTypes} from '../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers')

H.registerHelpers(Handlebars)

const startButton = `

// ns__start_section {{tempDetails}} button
const Button = styled.button\`
// ns__custom_start {{tempDetails}} buttonStyling`

const endButton = `// ns__custom_end {{tempDetails}} buttonStyling
\`;
// ns__end_section {{tempDetails}} button`

export const button = Handlebars.compile(`
{{#if (eq boilerPlateInfo.formType '${formTypes.CREATION}') }}
  ${startButton}
  margin-left: 1em;
  ${endButton}
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.LIST}') }}
{{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
  ${startButton}
  display: block;
  margin: 0 auto;
  ${endButton}
{{/if}}{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') }}
  ${startButton}
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  color: #bbbbbb;
  transition: color 0.5s ease;
  &:hover {
    color: \${(props) => props.hoverColor || '#000000'};
  }
  ${endButton}
{{/if}}
`)

