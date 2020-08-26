{{{START_OF_FILE}}}
import React, {useState} from 'react';
import styled from 'styled-components';
import {EXECUTE} from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import {graphql} from '@apollo/react-hoc';

import {UPDATE_{{SingularForRelationshipAllCaps}}_ACTION_ID, DELETE_{{SingularForRelationshipAllCaps}}_ACTION_ID{{ChildrenTypeList}} } from '../../../config';

{{{CHILDREN_IMPORT_LIST}}}

// add styling here
const {{SingularName}}StyleWrapper = styled.div`
  margin: 2em 1em;
  padding: 1.5em;
  border: none;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
`;

const Row = styled.div`
  margin: 1em 0;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  color: #bbbbbb;
  transition: color 0.5s ease;
  &:hover {
    color: ${(props) => props.hoverColor || '#000000'};
  }
`;

function {{SingularName}}({ {{SingularNameLowercase}}, parentId, updateInstance, refetchQueries}) {
  const [{{SingularNameLowercase}}Value, update{{SingularName}}Value] = useState(parseFloat({{SingularNameLowercase}}.value));
  const [isEditMode, updateIsEditMode] = useState(false);
  const [isSaving, updateIsSaving] = useState(false);

  {{{CHILDREN_CONSTANT_DECLARATIONS}}}

  function handle{{SingularName}}ValueChange(e) {
    const value = e.target.validity.valid || !!e.target.value ? e.target.value : 0;

    update{{SingularName}}Value(parseFloat(value));
  }

  async function handle{{SingularName}}ValueSave() {
    updateIsSaving(true);

    await updateInstance({
      variables: {
        actionId: UPDATE_{{SingularForRelationshipAllCaps}}_ACTION_ID,
        executionParameters: JSON.stringify({
          value: {{SingularNameLowercase}}Value,
          instanceId: {{SingularNameLowercase}}.id,
        }),
      },
      refetchQueries,
    });

    updateIsEditMode(false);
    updateIsSaving(false);
  }

  return (
    <{{SingularName}}StyleWrapper>
      {isEditMode ?
        (
          <>
            <label htmlFor={ {{SingularNameLowercase}}.id}>
              {{SingularName}} Value:
              <input
                id={ {{SingularNameLowercase}}.id}
                type='number'
                value={ {{SingularNameLowercase}}Value}
                onChange={handle{{SingularName}}ValueChange}
                disabled={isSaving}
              />
            </label>
            <Button
              type='button'
              hoverColor='#00FF00'
              onClick={handle{{SingularName}}ValueSave}
              disabled={isSaving}
            >
              &#10003;
            </Button>
            <Button
              type='button'
              hoverColor='#FF0000'
              onClick={() => updateIsEditMode(false)}
              disabled={isSaving}
            >
              &#10005;
            </Button>
          </>
        ) :
        (
          <>
            {{SingularName}} Value:
            { {{SingularNameLowercase}}Value}
            <Button type='button'   onClick={() => updateIsEditMode(true)}>
              &#9998;
            </Button>

            {{{CHILDREN_BODY_LIST}}}
          </>
        )
      }
    </{{SingularName}}StyleWrapper>
  );
}

export default compose(
  graphql(EXECUTE, { name: 'updateInstance' }),
)({{SingularName}});
