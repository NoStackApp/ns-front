{{{START_OF_FILE}}}
import React from 'react';
import styled from 'styled-components';
import './App.css';
import { NoStackConsumer } from '@nostack/no-stack';

import { PLATFORM_ID, {{userTypeId}} } from './config';

import NavBar from './components/NavBar';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import {{topComponentName}} from './components/{{sourceName}}/{{topComponentName}}';

const Wrapper = styled.div`
  padding: 5em 5em;
  min-width: 480px;
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const App = () => (
  <>
    <NavBar />
    <Wrapper className='App'>
      <NoStackConsumer>
        {({ loading, currentUser }) => {
          if (loading) return null;

          if (!currentUser) {
            return (
              <LoginWrapper>
                <AuthTabs
                  menuTitles={[
                    'Login',
                    'Register',
                  ]}
                >
                  <LoginForm />
                  <RegistrationForm
                    platformId={PLATFORM_ID}
                    userClassId={ {{userTypeId}} }
                  />
                </AuthTabs>
              </LoginWrapper>
            );
          }

          return (
            <{{topComponentName}} {{{topComponentPropSetting}}} />
          );
        }}
      </NoStackConsumer>
    </Wrapper>
  </>
);

export default App;
