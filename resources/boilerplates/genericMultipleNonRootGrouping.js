{{{START_OF_FILE}}}
import React from 'react';
import styled from 'styled-components';

import {{SingularName}}CreationForm from '../{{SingularName}}CreationForm';
import {{SingularName}} from '../{{SingularName}}';

const {{PluralName}}StyleWrapper = styled.div``;

function {{PluralName}}({ {{SingularNameLowercase}}s, {{SingularParentName}}Id, currentTodoId, onUpdate, refetchQueries }) {
  return (
    <{{PluralName}}StyleWrapper>
      <{{SingularName}}CreationForm
        parentId={ {{SingularParentName}}Id }
        refetchQueries={refetchQueries}
      />

      { {{SingularNameLowercase}}s.map(({{SingularNameLowercase}}) => (
        <{{SingularName}}
          key={ {{SingularNameLowercase}}.id}
          {{SingularNameLowercase}}={ {{SingularNameLowercase}} }
          onUpdate={onUpdate}
          parentId={ {{SingularParentName}}Id }
          refetchQueries={refetchQueries}
        />
      )) }
    </{{PluralName}}StyleWrapper>
  );
}

export default {{PluralName}};
