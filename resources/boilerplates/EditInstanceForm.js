/*
  This file has been partially generated!
  To permit updates to the generated portions of this code in the future,
  please follow all rules at https://bit.ly/nsFrontEndRules
 */
// ns__file unit: general, comp: EditInstanceForm

// ns__custom_start unit: general, comp: EditInstanceForm, loc: beforeImports
'use strict';
// ns__custom_end unit: general, comp: EditInstanceForm, loc: beforeImports

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

function EditInstanceForm({
  id,
  label,
  value,
  onChange,
  onSave,
  onCancel,
  disabled,
}) {
  return (
    <>
      <label htmlFor={id}>
        {label}
        <input
          id={id}
          type='text'
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </label>
      <Button
        type='button'
        hoverColor='#00FF00'
        onClick={onSave}
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
    </>
  );
}

export default EditInstanceForm;
