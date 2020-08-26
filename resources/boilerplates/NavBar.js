/*
  This file has been partially generated!
  To permit updates to the generated portions of this code in the future,
  please follow all rules at https://bit.ly/nsFrontEndRules
 */
// ns__file unit: general, comp: NavBar

// ns__custom_start unit: general, comp: NavBar, loc: beforeImports
'use strict';
// ns__custom_end unit: general, comp: NavBar, loc: beforeImports

import React from 'react';
import styled from 'styled-components';

import { LogoutButton } from '@nostack/no-stack';

// change styling here
const Wrapper = styled.div`
  left: 0;
  top: 0;
  padding: 1em 3em;
  font-size: 1rem;
  color: #fffff0;
  background-color: #00000f;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavBar = () => (
  <Wrapper>
    <div>{{appName}}</div>
    <div>
      <LogoutButton />
    </div>
  </Wrapper>
);

export default NavBar;
