{{{START_OF_FILE}}}
import React, {useState} from 'react';
import styled from 'styled-components';
import {EXECUTE} from '@nostack/no-stack';
import {graphql} from '@apollo/react-hoc';

import { DELETE_{{SingularForRelationshipAllCaps}}_ACTION_ID{{ChildrenTypeList}} } from '../../../config';

// if it has action, import the component
// import { {{ ActionName }} } from '../{{ ActionName }}';

{{{CHILDREN_IMPORT_LIST}}}

// add styling here
const {{SingularName}}StyleWrapper = styled.div`
  margin: 2em 1em;
  padding: 1.5em;
  border: none;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
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

const DeleteMenu = styled.div`
  color: red;
  margin: 1em;
  padding: 1em;
  border: 1px solid #eeeeee;
`;

function {{SingularName}}({ {{SingularNameLowercase}}, parentId, updateInstance, deleteInstance, refetchQueries }) {
  const [ isDeleteMode, updateIsDeleteMode ] = useState(false);
  const [ isDeleting, updateIsDeleting ] = useState(false);

  {{{CHILDREN_CONSTANT_DECLARATIONS}}}

  async function handleDelete() {
    updateIsDeleting(true);

    try {
      await deleteInstance({
        variables: {
          actionId: DELETE_{{SingularForRelationshipAllCaps}}_ACTION_ID,
        executionParameters: JSON.stringify({
        parentInstanceId: parentId,
        childInstanceId: {{SingularNameLowercase}}.id,
    }),
    },
      refetchQueries,
    });
    } catch (e) {
      updateIsDeleting(false);
    }
  }

  return (
    <{{SingularName}}StyleWrapper isDeleting={isDeleting}>
{ {{SingularNameLowercase}}.value }
{/* if it has contact action, insert button here
      <{{ActionName}} parentId={ {{SingularNameLowercase}}.id } /> */}
{isDeleteMode ? (
    <DeleteMenu>
      Delete?
      <Button
        type='button'
        hoverColor='#00FF00'
        onClick={handleDelete}
        disabled={isDeleting}
      >
        &#10003;
      </Button>
      <Button
        type='button'
        hoverColor='#FF0000'
        onClick={() => updateIsDeleteMode(false)}
        disabled={isDeleting}
      >
        &#10005;
      </Button>
    </DeleteMenu>
  ) :
  (
    <Button type='button'   onClick={() => updateIsDeleteMode(true)}>
      &#128465;
    </Button>
  )
}
{{{CHILDREN_BODY_LIST}}}
</{{SingularName}}StyleWrapper>
);
}

export default graphql(EXECUTE, { name: 'deleteInstance' })({{SingularName}});
