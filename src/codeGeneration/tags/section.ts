import {formTypes} from '../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers');

H.registerHelpers(Handlebars);

// const helpers = require('handlebars-helpers');

/*
export default compose(graphql(EXECUTE, { name: 'create{{SingularName}}' }),{{{SINGLE_CHILDREN_COMPOSE_STATEMENTS}}})(
  {{SingularName}}CreationForm
);
)({{SingularName}});
 */

/*
// ns__custom_start unit: {{Unit}}, comp: {{SingularName}}CreationForm, loc: styling
// change styling here
const Form = styled.div`
  margin: 2em;
  padding: 1.5em;
  border: none;
  border-radius: 5px;
  background-color: #F5F5F5;
`;
// ns__custom_end unit: {{Unit}}, comp: {{SingularName}}CreationForm, loc: styling

 */

export const section = Handlebars.compile(`

// ns__start_section {{tempDetails}} {{sectionName}}
{{{sectionContents}}}
// ns__end_section {{tempDetails}} button
`)
