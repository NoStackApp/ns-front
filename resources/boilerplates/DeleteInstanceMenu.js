/*
  This file has been partially generated!
  To permit updates to the generated portions of this code in the future,
  please follow all rules at https://bit.ly/nsFrontEndRules
 */
// ns__file unit: general, comp: DeleteInstanceMenu

// ns__custom_start unit: general, comp: DeleteInstanceMenu, loc: beforeImports
'use strict';
// ns__custom_end unit: general, comp: DeleteInstanceMenu, loc: beforeImports

import React from 'react';
import styled from 'styled-components';

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

const Container = styled.div`
  color: red;
  margin: 1em;
  padding: 1em;
  border: 1px solid #eeeeee;
`;

function DeleteInstanceMenu({
  onDelete,
  onCancel,
  disabled,
}) {
  return (
    <Container>
      Delete?
      <Button
        type='button'
        hoverColor='#00FF00'
        onClick={onDelete}
        disabled={disabled}
      >
        &#10003;
      </Button>
      <Button
        type='button'
        hoverColor='#FF0000'
        onClick={onCancel}
        disabled={disabled}
      >
        &#10005;
      </Button>
    </Container>
  )
}

export default DeleteInstanceMenu;
