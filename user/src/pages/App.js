import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AllPageStyle } from '../styles';

import { token } from '../utils/spotify';

import Login from './Login';
import Main from './Main';

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  useEffect(() => {
    setAccessToken(token);
    console.log("access token", accessToken)
  }, []);

  return (
    <AppContainer>
      <AllPageStyle />
      {!accessToken ?(
        <Login />
      ) : (
      <Main />
    )}
    </AppContainer>
  );
};

export default App;