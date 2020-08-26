{{{START_OF_FILE}}}
import React from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import { flattenData } from '../../../flattenData';

import { {{SOURCE_ID_CONSTANT}}{{ChildrenTypeList}} } from '../../../config';

import { {{RELATIONSHIPS_NAME}}, {{SOURCE_QUERY_NAME}} } from '../../source-props/{{SingularSourceLowercase}}';

{{{CHILDREN_IMPORT_LIST}}}

// add styling here
const {{SingularName}}StyleWrapper = styled.div`
  margin: 2em 1em;
  padding: 1.5em;
  border: none;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
`;

function {{SingularName}}({ {{SingularNameLowercase}}Id }) {
  const parameters = {
    {{CONSTRAINT_VALUE}}: {{SingularNameLowercase}}Id,
  };

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

        const {{SingularNameLowercase}} = data.unitData.map(el => flattenData(el));

        const childTypes = {{SingularNameLowercase}}[0] && {{SingularNameLowercase}}[0].children;
        if (!childTypes) {
          return null;
        }

        {{{CHILDREN_CONSTANT_DECLARATIONS}}}

        return (
          <{{SingularName}}StyleWrapper>
            {{{CHILDREN_BODY_LIST}}}
          </{{SingularName}}StyleWrapper>
          );
      }}
    </Unit>
  );
}

export default {{SingularName}};
