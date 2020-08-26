{{{START_OF_FILE}}}
import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { EXECUTE } from '@nostack/no-stack';

// import { CONTACT_USER_FOR_TASK_INFO_ACTION_ID } from '../../../config';
import { {{ActionIdAllCaps}} } from '../../../config';

const Wrapper = styled.div`
  margin: 0 1em;
  display: inline-block;
  vertical-align: top;
`;

const Button = styled.button`
  cursor: pointer;
`;

const {{ActionName}} = ({ parentId, execute }) => {
  const [ loading, updateLoading ] = useState(false);
  const [ success, updateSuccess ] = useState(false);
  const [ error, updateError ] = useState('');

  const variables = {
    actionId: {{ActionIdAllCaps}},
    executionParameters: JSON.stringify({
      finalText: 'Some Text',
      parentInstanceId: parentId,
    }),
    unrestricted: false,
  };

  const handleSubmit = async () => {
    updateLoading(true);
    updateSuccess(false);
    updateError('');

    try {
      await execute({
        variables
      });

      updateSuccess(true);
    } catch (e) {
      updateError('Something went wrong. Please try again.');

      console.log(e);
    }

    updateLoading(false);
  }

  return (
    <Wrapper>
      <Button
        type='button'
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? '{{ActionName}}ing...' : '{{ActionName}}'}
      </Button>
      {success && <div>{{ActionName}} successful!</div>}
      {error && <div>{error}</div>}
    </Wrapper>
  );
};

export default graphql(EXECUTE, { name: 'execute' })({{ActionName}});
