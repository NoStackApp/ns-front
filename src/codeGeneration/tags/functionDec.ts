import {formTypes, nodeTypes} from '../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers');

H.registerHelpers(Handlebars);

export const functionDec = Handlebars.compile(`

// ns__custom_start {{tempDetails}} beforeFunction
// ns__custom_end {{tempDetails}} beforeFunction

// ns__start_section {{tempDetails}} function
{{#if (eq boilerPlateInfo.formType '${formTypes.CREATION}') }}
function {{names.singular}}CreationForm({
  {{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}parentId{{/if}}{{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}{{names.parent}}Id{{/if}},
  create{{names.singular}}{{SINGLE_CHILDREN_PARAMS}},
  refetchQueries,
  // ns__custom_start {{tempDetails}} addedProps
  // ns__custom_end {{tempDetails}} addedProps
}) {
  const [ {{instance}}Value, update{{names.singular}}Value ] = useState('');
  const [ loading, updateLoading ] = useState(false);
// ns__custom_start {{tempDetails}} beginning
  /* any special declarations etc. */
// ns__custom_end {{tempDetails}} beginning

    // ns__start_section {{tempDetails}} handleChange
  function handleChange(e) {
    update{{names.singular}}Value(e.target.value);
  }
  // ns__end_section {{tempDetails}} handleChange

  // ns__start_section {{tempDetails}} handleSubmit
  async function handleSubmit(e) {
    e.preventDefault();

    if (!{{instance}}Value) {
      return;
    }

    updateLoading(true);

    await create{{names.singular}}({
      variables: {
        actionId: CREATE_{{typeSpecifier}}_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: {{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}parentId{{/if}}{{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}{{names.parent}}Id{{/if}},
          value: {{{instance}}}Value,
        }),
        unrestricted: false,
      },
      {{refetchQueriesLine}}
    });

    {{{SINGLE_CHILDREN_CREATION_CODE}}}

    update{{names.singular}}Value('');
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


  // ns__custom_start {{tempDetails}} beforeReturn
  // ns__custom_end {{tempDetails}} beforeReturn

  // ns__start_section {{tempDetails}} return
  return (
    < Form>
          <label htmlFor='{{instance}}-value'>
        {{names.singular}}:
        <input
          id='{{instance}}-value'
          type='text'
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={ {{instance}}Value }
          disabled={loading}
        />
      </label>
      <Button type='submit'  disabled={loading}  onClick={handleSubmit}>
        {loading ? 'Creating {{names.singular}}...' : 'Create {{names.singular}}'}
      </Button>
    </Form>
  );
  // ns__end_section {{tempDetails}} return

}

{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.LIST}') }}
class {{component}} extends Component {
// ns__custom_start {{tempDetails}} beginning
  /* any special declarations etc. */
// ns__custom_end {{tempDetails}} beginning
  state = {
    selected{{names.singular}}Id: null,
      // ns__custom_start {{tempDetails}} addedState
      // ns__custom_end {{tempDetails}} addedState
  };

  wrapperRef = createRef();

  // ns__start_section {{tempDetails}} didMount
  componentDidMount() {
    // ns__custom_start {{tempDetails}} componentDidMount
    // ns__custom_end {{tempDetails}} componentDidMount
    document.addEventListener('mousedown', this.handleClick);
  }
  // ns__end_section {{tempDetails}} didMount

  // ns__start_section {{tempDetails}} willMount
  componentWillUnmount() {
    // ns__custom_start {{tempDetails}} componentWillUnmount
    // ns__custom_end {{tempDetails}} componentWillUnmount
    document.removeEventListener('mousedown', this.handleClick);
  }
  // ns__end_section {{tempDetails}} willMount

  // ns__start_section {{tempDetails}} handleClick
  handleClick = (e) => {
    const node = this.wrapperRef.current;

    if (node && node !== e.target && !node.contains(e.target)) {
      this.setState({ selected{{names.singular}}Id: null });
    }
  };
  // ns__end_section {{tempDetails}} handleClick

  // ns__start_section {{tempDetails}} handleSelect
  handleSelect = (id) => this.setState({ selected{{names.singular}}Id: id });
  // ns__end_section {{tempDetails}} handleSelect

  // ns__custom_start {{tempDetails}} beforeRender
  // ns__custom_end {{tempDetails}} beforeRender

  // ns__start_section {{tempDetails}} render
  render() {
    {{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
    const { {{names.parent}}Id, {{names.pluralLowercase}}, refetchQueries, onUpdate } = this.props;
    {{/if}}
    {{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
    const { {{names.parent}}Id } = this.props;
    {{/if}}

    const { selected{{names.singular}}Id } = this.state;
    {{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
    const parameters = {
      {{constraintValue}}: {{names.parent}}Id,
    };
    {{/if}}

    // ns__custom_start {{tempDetails}} renderBeginning
    // ns__custom_end {{tempDetails}} renderBeginning

    // ns__start_section {{tempDetails}} renderReturn
    return (
      {{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
      <{{component}}StyleWrapper
        ref={this.wrapperRef}
        onClick={this.handleClick}
      >
        <{{names.singular}}CreationForm
          parentId={ {{names.parent}}Id }
          refetchQueries={refetchQueries}
          // ns__custom_start {{tempDetails}} addedPropsForCreationForm
          // ns__custom_end {{tempDetails}} addedPropsForCreationForm
        />

      {/* ns__start_section {{tempDetails}} listElements */}
      { {{names.pluralLowercase}}.map(({{names.singularLowercase}}) => (
          <{{names.singular}}
            key={v4()}
            {{names.singularLowercase}}={ {{names.singularLowercase}} }
            selected={ {{names.singularLowercase}}.id === selected{{names.singular}}Id }
            onUpdate={onUpdate}
            parentId={ {{names.parent}}Id }
            refetchQueries={refetchQueries}
            onSelect={this.handleSelect}
            // ns__custom_start {{tempDetails}} addedPropsForChildren
            // ns__custom_end {{tempDetails}} addedPropsForChildren
          />
        )) }
      {/* ns__end_section {{tempDetails}} listElements */}

      {/* ns__custom_start {{tempDetails}} renderEnding */}
      {/* ns__custom_end {{tempDetails}} renderEnding */}
      </{{component}}StyleWrapper>
      {{/if}}
      {{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
            <Unit
        id={ {{names.source.constant}} }
        typeRelationships={ {{names.source.relationships}} }
        query={ {{names.source.query}} }
        parameters={parameters}
      >
        {({loading, error, data, refetchQueries}) => {
          if (loading) return 'Loading...';

          if (error) {
            console.error(error);
            return \`Error: \${error.graphQLErrors}\`;
          }

          const {{names.pluralLowercase}} = data.unitData.map((el) => flattenData(el));

      // ns__custom_start {{tempDetails}} beforeReturn
      // ns__custom_end {{tempDetails}} beforeReturn
          return (
            <>
              <{{names.singular}}CreationForm
                  {{names.parent}}Id={ {{names.parent}}Id }
                  refetchQueries={refetchQueries}
                  // ns__custom_start {{tempDetails}} addedPropsForCreationForm
                  // ns__custom_end {{tempDetails}} addedPropsForCreationForm
              />
              <{{names.plural}}StyleWrapper
                ref={this.wrapperRef}
                onClick={this.handleClick}
              >
                { {{names.pluralLowercase}} &&
                  {{names.pluralLowercase}}.map(({{names.singularLowercase}}) => (
                  <{{names.singular}}
                    key={v4()}
                    parentId={ {{names.parent}}Id }
                    {{names.singularLowercase}}={ {{names.singularLowercase}} }
                    selected={ {{names.singularLowercase}}.id === selected{{names.singular}}Id }
                    refetchQueries={refetchQueries}
                    onSelect={this.handleSelect}
                    // ns__custom_start {{tempDetails}} addedPropsForChildren
                    // ns__custom_end {{tempDetails}} addedPropsForChildren
                  />
                )) }
              </{{names.plural}}StyleWrapper>
                {/* ns__custom_start {{tempDetails}} renderEnding */}
                {/* ns__custom_end {{tempDetails}} renderEnding */}
            </>
          );
        }}
      </Unit>
      {{/if}}
  );
  // ns__end_section {{tempDetails}} renderReturn
  }
  // ns__end_section {{tempDetails}} render
}
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') }}
function {{component}}({
  {{instance}},
  parentId,
  selected,
  updateInstance,
  deleteInstance,
  refetchQueries,
  onSelect,
  // ns__custom_start {{tempDetails}} addedProps
  // ns__custom_end {{tempDetails}} addedProps
}) {
  const [{{instance}}Value, update{{component}}Value] = useState({{instance}}.value);
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);
  const [isDeleteMode, updateIsDeleteMode] = useState(false);
  const [isDeleting, updateIsDeleting] = useState(false);
  // ns__custom_start {{tempDetails}} beginning
  // ns__custom_end {{tempDetails}} beginning

  {{{CHILDREN_CONSTANT_DECLARATIONS}}}

  // ns__custom_start {{tempDetails}} beforeReturn
  // ns__custom_end {{tempDetails}} beforeReturn

  // ns__start_section {{tempDetails}} notSelected
  if (!selected) {
    return (
      <{{component}}StyleWrapper onClick={() => onSelect({{instance}}.id)}>
        { {{instance}}Value }
      </{{component}}StyleWrapper>
    );
  }
  // ns__end_section {{tempDetails}} notSelected

  // ns__start_section {{tempDetails}} change
  function handle{{component}}ValueChange(e) {
    update{{component}}Value(e.target.value);
  }
  // ns__end_section {{tempDetails}} change

  // ns__start_section {{tempDetails}} save
  async function handle{{component}}ValueSave() {
    updateIsSaving(true);

    await updateInstance({
      variables: {
        actionId: UPDATE_{{typeSpecifier}}_ACTION_ID,
        executionParameters: JSON.stringify({
          value: {{{instance}}}Value,
          instanceId: {{instance}}.id,
        }),
      },
      refetchQueries,
    });

    updateIsEditMode(false);
    updateIsSaving(false);
  }
  // ns__end_section {{tempDetails}} save

  // ns__start_section {{tempDetails}} cancel
  function handleCancelEdit() {
    updateIsEditMode(false);
  }
  // ns__end_section {{tempDetails}} cancel

  // ns__start_section {{tempDetails}} isEdit
  if (isEditMode) {
    return (
      <{{component}}StyleWrapper>
        <EditInstanceForm
          id={ {{instance}}.id }
          label='{{component}} Value:'
          value={ {{instance}}Value }
          onChange={handle{{component}}ValueChange}
          onSave={handle{{component}}ValueSave}
          onCancel={handleCancelEdit}
          disabled={isSaving}
        />
      </{{component}}StyleWrapper>
    );
  }
  // ns__end_section {{tempDetails}} isEdit

  // ns__start_section {{tempDetails}} delete
  async function handleDelete() {
    updateIsDeleting(true);

    try {
      await deleteInstance({
        variables: {
          actionId: DELETE_{{typeSpecifier}}_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            instanceId: {{instance}}.id,
          }),
        },
        refetchQueries,
      });
    } catch (e) {
      updateIsDeleting(false);
    }
  }
  // ns__end_section {{tempDetails}} delete

  // ns__start_section {{tempDetails}} cancelDelete
  function handleCancelDelete() {
    updateIsDeleteMode(false);
  }
  // ns__end_section {{tempDetails}} cancelDelete

  // ns__start_section {{tempDetails}} isDelete
  if (isDeleteMode) {
    return (
      <{{component}}StyleWrapper selected={selected} isDeleting={isDeleting}>
        { {{instance}}Value }
        <DeleteInstanceMenu
          onDelete={handleDelete}
          onCancel={handleCancelDelete}
          disabled={isDeleting}
        />
      </{{component}}StyleWrapper>
    );
  }
  // ns__end_section {{tempDetails}} isDelete

  // ns__start_section {{tempDetails}} functionReturn
  return (
    <{{component}}StyleWrapper selected={selected}>
      {/* ns__start_section {{tempDetails}} instanceValue */}
      { {{instance}}Value }
      <Button type='button'   onClick={() => updateIsEditMode(true)}>
        &#9998;
      </Button>
      <Button type='button'   onClick={() => updateIsDeleteMode(true)}>
        &#128465;
      </Button>
      {/* ns__end_section {{tempDetails}} instanceValue */}

      {/* ns__start_section {{tempDetails}} childrenList */}
      {{{CHILDREN_BODY_LIST}}}
      {/* ns__end_section {{tempDetails}} childrenList */}

      {/* ns__custom_start {{tempDetails}} renderEnding */}
      {/* ns__custom_end {{tempDetails}} renderEnding */}

</{{component}}StyleWrapper>
  );
  // ns__end_section {{tempDetails}} functionReturn
}

{{/if}}
// ns__end_section {{tempDetails}} function
`)

