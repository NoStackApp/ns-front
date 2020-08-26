{{{START_OF_FILE}}}
import React, { useState } from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import Select from 'react-select';

import { flattenData } from '../../../flattenData';

import { {{SOURCE_ID_CONSTANT}} } from '../../../config';
import { {{RELATIONSHIPS_NAME}}, {{SOURCE_QUERY_NAME}} } from '../../source-props/{{SingularSourceLowercase}}';

// add styling here
const {{SingularName}}SelectStyleWrapper = styled.div``;

const Button = styled.button`
  margin-left: 1em;
`;

function {{SingularName}}Select({ id, onSubmit, disabled }) {
  const [selected, updateSelected] = useState();

  const handleChange = option => updateSelected(option);

  const handleSubmit = async () => {
    if (!selected || !selected.value || !selected.label ) {
      return;
    }

    await onSubmit(selected.value);

    updateSelected(null);
  }

  const parameters = {};

  return (
    <Unit
      id={ {{SOURCE_ID_CONSTANT}} }
      typeRelationships={ {{RELATIONSHIPS_NAME}} }
      query={ {{SOURCE_QUERY_NAME}} }
      parameters={parameters}
    >
      {({loading, error, data, refetchQueries}) => {
        if (loading) return 'Loading...';

        if (error) {
          console.error(error);
          return `Error: ${error.graphQLErrors}`
        };

        const {{PluralNameLowercase}} = data.unitData.map(el => flattenData(el));

        const options = {{PluralNameLowercase}}.map(({{SingularNameLowercase}}) => ({
          value: {{SingularNameLowercase}}.id,
          label: {{SingularNameLowercase}}.value,
        }));

        return (
          <{{SingularName}}SelectStyleWrapper>
            <Select
              inputId={id}
              isClearable={true}
              value={selected}
              onChange={handleChange}
              options={options}
              isDisabled={disabled}
            />
            <Button
              onClick={handleSubmit}
              disabled={disabled
                || !selected
                || !selected.value}
            >
              Add User
            </Button>
          </{{SingularName}}SelectStyleWrapper>
        );
      }}
    </Unit>
  );
}

export default {{SingularName}}Select;
