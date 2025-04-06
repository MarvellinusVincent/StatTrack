import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AllPageStyle } from '../styles';
import { token, logout } from '../utils/spotify'; // Import logout for error handling
import Login from './Login';
import Main from './Main';

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
`;

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleToken = async () => {
      try {
        // If token exists but is expired, refreshToken() will be called automatically
        // via the axios interceptor in spotify.js
        setAccessToken(token || null);
      } catch (error) {
        console.error('Auth error:', error);
        logout(); // Force clean logout on errors
      } finally {
        setIsLoading(false);
      }
    };

    handleToken();
  }, []);

  if (isLoading) {
    return (
      <AppContainer>
        <AllPageStyle />
        <div>Loading...</div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <AllPageStyle />
      {!accessToken ? <Login /> : <Main />}
    </AppContainer>
  );
};

export default App;