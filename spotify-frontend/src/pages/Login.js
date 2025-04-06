import React from 'react';
import styled from 'styled-components';
import { Theme, Mixins, MainStyle, Media } from '../styles';
import spotifyLogo from '../assets/logo/spotify.png';

const { colors, fontSizes } = Theme;

const LoginContainer = styled(MainStyle)`
  ${Mixins.flexCenter};
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  position: relative;
  padding: 40px;
  text-align: center;
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: ${colors.darkestGrey};
  border-radius: 50%;
  padding: 20px;
  margin-bottom: 40px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 3px solid ${colors.white};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: ${colors.lightGreen};
  }

  ${Media.tablet`
    width: 150px;
    height: 150px;
  `};
`;

const LogoImage = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: ${colors.white};
  margin-bottom: 20px;
  letter-spacing: -1px;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);

  ${Media.tablet`
    font-size: 2.5rem;
  `};

  ${Media.phablet`
    font-size: 2rem;
  `};
`;

const Subtitle = styled.p`
  font-size: ${fontSizes.lg};
  color: ${colors.lightGrey};
  margin-bottom: 40px;
  max-width: 500px;
  line-height: 1.5;

  ${Media.tablet`
    font-size: ${fontSizes.md};
  `};
`;

const LoginButton = styled.a`
  ${Mixins.button};
  background-color: ${colors.green};
  color: ${colors.white};
  border-radius: 30px;
  padding: 17px 35px;
  margin: 20px 0;
  min-width: 200px;
  font-size: ${fontSizes.md};
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(46, 229, 157, 0.3);

  &:hover,
  &:focus {
    background-color: ${colors.lightGreen};
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(46, 229, 157, 0.4);
  }

  ${Media.tablet`
    padding: 15px 30px;
    font-size: ${fontSizes.sm};
  `};
`;

const Login = () => {
  const loginUrl = `${process.env.REACT_APP_API_BASE_URL}/login`;

  return (
    <LoginContainer>
      <LogoContainer href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
        <LogoImage src={spotifyLogo} alt="Spotify Logo"/>
      </LogoContainer>
      
      <Title>Spotify Profile</Title>
      <Subtitle>
        Connect with Spotify to view your listening history, 
        top artists, tracks, and more.
      </Subtitle>
      
      <LoginButton href={loginUrl}>Log in to Spotify</LoginButton>
    </LoginContainer>
  );
};

export default Login;