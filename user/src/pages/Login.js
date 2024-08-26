import React from 'react';

import styled from 'styled-components';
import { Theme, Mixins, MainStyle } from '../styles';

import spotifyLogo from '../assets/logo/spotify.png';

const { colors } = Theme;

const Container = styled(MainStyle)`
  ${Mixins.flexCenter};
  flex-direction: column;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
`;

const LogoContainer = styled.a`
  top: 0px;
  border: 3px solid ${colors.white};
  padding: 5px;
  /* border-radius:50%; */
  transform: scale(0.6);
`;


const LogoImage = styled.img`
  width: 100%;
  height: 100%;
`;

const LoginButton = styled.a`
  display: inline-block;
  background-color: ${colors.green};
  color: ${colors.white};
  border-radius: 30px;
  padding: 17px 35px;
  margin: 20px 0 70px;
  min-width: 160px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${colors.lightGreen};
  }
`;

const LOGIN_URI =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8888/login'
    : 'https://statspot-fe32fb3a9656.herokuapp.com/login';


const Login = () => (
  <Container>
    <LogoContainer href="https://open.spotify.com">
      <LogoImage src={spotifyLogo} alt="Spotify Logo"/>
    </LogoContainer>
    <LoginButton href={LOGIN_URI}>Log in to Spotify</LoginButton>
  </Container>
);

export default Login;
