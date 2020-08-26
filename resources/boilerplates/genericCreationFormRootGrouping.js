{{{START_OF_FILE}}}
import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import { CREATE_{{SingularForRelationshipAllCaps}}_ACTION_ID{{ACTION_IDS_FOR_SINGLE_CHILDREN}}{{TYPE_IDS_FOR_SINGLE_CHILDREN}} } from '../../../config';

// change styling here
const Form = styled.div`
  margin: 2em;
  padding: 1.5em;
  border: none;
  border-radius: 5px;
  background-color: #F5F5F5;
`;

const Button = styled.button`
  margin-left: 1em;
`;

function {{SingularName}}CreationForm({ {{SingularParentName}}Id, create{{SingularName}}{{SINGLE_CHILDREN_PARAMS}}, refetchQueries }) {
  const [ {{SingularNameLowercase}}Value, update{{SingularName}}Value ] = useState('');
  const [ loading, updateLoading ] = useState(false);

  function handleChange(e) {
    update{{SingularName}}Value(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!{{SingularNameLowercase}}Value) {
      return;
    }

    updateLoading(true);

    const create{{SingularName}}Response = await create{{SingularName}}({
      variables: {
        actionId: CREATE_{{SingularForRelationshipAllCaps}}_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: {{SingularParentName}}Id,
          value: {{{SingularNameLowercase}}}Value,
        }),
        unrestricted: false,
      },{{UPDATE_ON_ADD_LINE}}
    });

    const new{{SingularName}}Data = JSON.parse(create{{SingularName}}Response.data.Execute);

    {{{SINGLE_CHILDREN_CREATION_CODE}}}

    update{{SingularName}}Value('');
    updateLoading(false);
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor='{{SingularNameLowercase}}-value'>
        {{SingularName}}:
        <input
          id='{{SingularNameLowercase}}-value'
          type='text'
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={ {{SingularNameLowercase}}Value }
          disabled={loading}
        />
      </label>
      <Button type='submit'  disabled={loading}  onClick={handleSubmit}>
        {
          loading
            ? 'Creating {{SingularName}}...'
            : 'Create {{SingularName}}'
        }
      </Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE, { name: 'create{{SingularName}}' }),{{{SINGLE_CHILDREN_COMPOSE_STATEMENTS}}}
)({{SingularName}}CreationForm);
