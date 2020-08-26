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

export const handlers = Handlebars.compile(`

{{#if (eq boilerPlateInfo.formType '${formTypes.CREATION}') }}
  // ns__start_section {{tempDetails}} handleChange
  function handleChange(e) {
    update{{SingularName}}Value(e.target.value);
  }
  // ns__end_section {{tempDetails}} handleChange

  // ns__start_section {{tempDetails}} handleSubmit
  async function handleSubmit(e) {
    e.preventDefault();

    if (!{{instance}}Value) {
      return;
    }

    updateLoading(true);

    const create{{SingularName}}Response = await create{{SingularName}}({
      variables: {
        actionId: CREATE_{{typeSpecifier}}_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: parentId,
          value: {{{SingularNameLowercase}}}Value,
        }),
        unrestricted: false,
      },
      {{refreshQueriesLine}}
    });

    {{{SINGLE_CHILDREN_CREATION_CODE}}}

    update{{SingularName}}Value('');
    updateLoading(false);
  }
  // ns__end_section {{tempDetails}} handleSubmit

  // ns__start_section {{tempDetails}} handleKeyPress
  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }
  // ns__end_section {{tempDetails}} handleKeyPress
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.LIST}') }}
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') }}
{{{childrenImportList}}}
{{/if}}

// ns__custom_start {{tempDetails}} addedHandlers
// ns__custom_end {{tempDetails}} addedHandlers

`)

