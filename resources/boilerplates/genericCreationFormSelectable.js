{{{START_OF_FILE}}}
import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { withNoStack, EXECUTE } from '@nostack/no-stack';

import {{SingularName}}Select from '../../{{SelectionSource}}/{{SingularName}}Select';
import { CREATE_{{SingularForRelationshipAllCaps}}_ACTION_ID{{ACTION_IDS_FOR_SINGLE_CHILDREN}}{{TYPE_IDS_FOR_SINGLE_CHILDREN}} } from '../../../config';

// ns__custom_start unit: {{Unit}}, comp: {{SingularName}}CreationForm, loc: addedImports
// ns__custom_end unit: {{Unit}}, comp: {{SingularName}}CreationForm, loc: addedImports

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

function {{SingularName}}CreationForm({ parentId, create{{SingularName}}{{SINGLE_CHILDREN_PARAMS}}, refetchQueries }) {
  const [ loading, updateLoading ] = useState(false);

  const handleSubmit = async value => {
    if (!value) {
      return;
    }

    updateLoading(true);

    try {
      const create{{SingularName}}Response = await create{{SingularName}}({
        variables: {
          actionId: CREATE_{{SingularForRelationshipAllCaps}}_ACTION_ID,
          executionParameters: JSON.stringify({
            parentInstanceId: parentId,
            childInstanceId: value,
          }),
          unrestricted: false,
        },
        refetchQueries,
      });
    } catch (e) {
      console.log(e);
    }

    updateLoading(false);
  }

  const selectId = `{{SingularNameLowercase}}-value-${parentId}`;

  return (
    <div>
      <label htmlFor={selectId}>
        {{SingularName}}:
        <{{SingularName}}Select
          id={selectId}
          onSubmit={handleSubmit}
          disabled={loading}
        />
      </label>
    </div>
  );
}

export default graphql(EXECUTE, { name: 'create{{SingularName}}' })({{SingularName}}CreationForm);
