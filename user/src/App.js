import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles';

import { token } from './utils/spotify';

import Login from './pages/Login';
import Main from './pages/Main';

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
      <GlobalStyle />
      {accessToken ? <Main /> : <Login />}
    </AppContainer>
  );
};

export default App;