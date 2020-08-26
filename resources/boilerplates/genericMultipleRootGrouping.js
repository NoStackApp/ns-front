{{{START_OF_FILE}}}
import React from 'react';
import { Unit } from '@nostack/no-stack';
import styled from 'styled-components';
import { flattenData } from '../../../flattenData';

import {SingularName}CreationForm from '../{{SingularName}}CreationForm';
import {{SingularName}} from '../{{SingularName}}';

import { {{SOURCE_ID_CONSTANT}} } from '../../../config';
import {
import {getDescriptionChild} from '../../../../temp/pivotateraw/src/custom/getDescriptionChild';
import FirstTimeAppCreationForm from '../../../../temp/pivotateraw/src/components/AppSpec/FirstTimeAppCreationForm'; {{RELATIONSHIPS_NAME}}, {{SOURCE_QUERY_NAME}} } from '../../source-props/{{SingularSourceLowercase}}';

// ns__custom_start unit: {{Unit}}, comp: {{PluralName}}, loc: addedImports
// ns__custom_end unit: {{Unit}}, comp: {{PluralName}}, loc: addedImports

// ns__custom_start unit: {{Unit}}, comp: {{PluralName}}, loc: styling
// add styling here
const {{PluralName}}StyleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
// ns__custom_end unit: {{Unit}}, comp: {{PluralName}}, loc: styling


function {{PluralName}}({ {{SingularParentName}}Id }) {
// ns__custom_start {{Unit}}, comp: {{PluralName}}, loc: beginning
// ns__custom_end {{Unit}}, comp: {{PluralName}}, loc: beginning
  const parameters = {
    {{CONSTRAINT_VALUE}}: {{SingularParentName}}Id,
  };

  // ns__custom_start {{Unit}}, comp: {{PluralName}}, loc: beforeReturn
  // ns__custom_end {{Unit}}, comp: {{PluralName}}, loc: beforeReturn
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

        return (
          <>
          <{{SingularName}}CreationForm
          {{SingularParentName}}Id={ {{SingularParentName}}Id }
          refetchQueries={refetchQueries}
          // ns__custom_start unit: {{Unit}}, comp: {{PluralName}}, loc: addedPropsForCreationForm
          // ns__custom_end unit: {{Unit}}, comp: {{PluralName}}, loc: addedPropsForCreationForm
          />

    <{{PluralName}}StyleWrapper>
            {
              {{PluralNameLowercase}} && {{PluralNameLowercase}}.map(({{SingularNameLowercase}}) => (
                <{{SingularName}}
                  key={ {{SingularNameLowercase}}.id }
                  parentId={ {{SingularParentName}}Id }
                  {{SingularNameLowercase}}={ {{SingularNameLowercase}} }
                  refetchQueries={refetchQueries}
                />
              ))
            }
            <{{SingularName}}CreationForm  {{SingularParentName}}Id={ {{SingularParentName}}Id } refetchQueries={refetchQueries}/>
          </{{PluralName}}StyleWrapper>
    {/* ns__custom_start unit: {{Unit}}, comp: {{PluralName}}, loc: renderEnding */}
    {/* ns__custom_end unit: {{Unit}}, comp: {{PluralName}}, loc: renderEnding */}

  </>
        );
      }}
    </Unit>
  );
}
export default {{PluralName}};

