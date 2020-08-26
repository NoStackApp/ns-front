{{{START_OF_FILE}}}
import React, { useState } from 'react';
import styled from 'styled-components';
import { graphql } from '@apollo/react-hoc';
import { EXECUTE } from '@nostack/no-stack';

import {UPDATE_{{SingularForRelationshipAllCaps}}_ACTION_ID} from '../../../config';

{{{STYLING_SECTION}}}

function {{SingularName}}({ {{SingularNameLowercase}}, label, updateInstance, refetchQueries, disabled = false }) {
  const [ {{SingularNameLowercase}}Value, update{{SingularName}}Value ] = useState({{SingularNameLowercase}}.value);

  async function handle{{SingularName}}ValueChange() {
    const value = {{SingularNameLowercase}}Value === 'true' ? 'false' : 'true';

    update{{SingularName}}Value(value);

    await updateInstance({
      variables: {
        actionId: UPDATE_{{SingularForRelationshipAllCaps}}_ACTION_ID,
        executionParameters: JSON.stringify({
          value,
          instanceId: {{SingularNameLowercase}}.id,
        }),
        unrestricted: false,
      },
      refetchQueries,
    });
  }

  return (
    <{{SingularName}}StyleWrapper>
      <label htmlFor={ {{SingularNameLowercase}}.id }>
        {label}
        <input
          id={ {{SingularNameLowercase}}.id }
          type='checkbox'
          checked={ {{SingularNameLowercase}}Value === 'true' }
          onChange={handle{{SingularName}}ValueChange}
          disabled={disabled}
        />
      </label>
    </{{SingularName}}StyleWrapper>
  );
}

export default graphql(EXECUTE, { name: 'updateInstance' })({{SingularName}});
