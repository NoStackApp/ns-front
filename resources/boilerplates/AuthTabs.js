/*
  This file has been partially generated!
  To permit updates to the generated portions of this code in the future,
  please follow all rules at https://bit.ly/nsFrontEndRules
 */
// ns__file unit: general, comp: AuthTabs

// ns__custom_start unit: general, comp: AuthTabs, loc: beforeImports
'use strict';
// ns__custom_end unit: general, comp: AuthTabs, loc: beforeImports

import React, { useState } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  padding: 1em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  box-shadow: 10px 10px 8px rgba(0, 0, 0, 0.6);

  margin-bottom: 20px;
`;

const Button = styled.button(({ selected }) => `
  font-size: 1.25em;
  background-color: #ffffff;
  opacity: ${selected ? 1.0 : 0.5};
  border: none;
  padding: 5px;
  cursor: ${selected ? 'initial' : 'pointer'};
  transition: opacity 0.5s ease;

  &:hover {
    opacity: 1.0;
    text-decoration: underline;
  }
`);

const AuthTabs = ({ menuTitles, children }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div>
      <MenuContainer>
        {menuTitles.map((title, index) => (
          <Button
            selected={index === selectedTab}
            onClick={e => {
              e.preventDefault();

              setSelectedTab(index);
            }}
          >
            {title}
          </Button>
        ))}
      </MenuContainer>
      <div>
        {React.Children.map(children, (child, index) => {
          if (index !== selectedTab) {
            return null;
          }

          return (
            <div className='test'>{child}</div>
          );
        })}
      </div>
    </div>
  );
}

export default AuthTabs;
