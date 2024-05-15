import React from 'react';
import { GithubIconLogo, PlaylistIconLogo, RecentIconLogo, SpotifyLogo, TopArtistsLogo, TopTracksLogo, UserAvatar } from '../assets/index'
import styled from 'styled-components';
import { Theme, Mixins, Media } from '../styles';
import { Link, Outlet } from 'react-router-dom';
const { colors } = Theme;

const Container = styled.nav`
  ${Mixins.coverShadow};
  ${Mixins.flexBetween};
  flex-direction: column;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: ${Theme.navWidth};
  background-color: ${colors.otherBlack};
  text-align: center;
  z-index: 99;
  ${Media.tablet`
    top: auto;
    bottom: 0;
    right: 0;
    width: 100%;
    min-height: ${Theme.navHeight};
    height: ${Theme.navHeight};
    flex-direction: row;
  `};
  & > * {
    width: 100%;
    ${Media.tablet`
      height: 100%;
    `};
  }
`;

const Logo = styled.div`
  color: ${colors.green};
  margin-top: 30px;
  width: 130px;
  height: 130px;
  transition: ${Theme.transition};
  ${Media.tablet`
    display: none;
  `};
  &:hover,
  &:focus {
    color: ${colors.lightGreen};
  }
  svg {
    width: 50px;
  }
`;

const Github = styled.div`
  color: ${colors.lightGrey};
  width: 45px;
  height: 45px;
  margin-bottom: 50px;
  ${Media.tablet`
    display: none;
  `};
`;

const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  ${Media.tablet`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
  `};
`;

const MenuItem = styled.li`
  color: ${colors.lightGrey};
  font-size: 13px;
  ${Media.tablet`
    flex-grow: 1;
    flex-basis: 100%;
    height: 100%;
  `};
  a {
    display: block;
    padding: 15px 0;
    border-left: 5px solid transparent;
    width: 100%;
    height: 100%;
    ${Media.tablet`
      ${Mixins.flexCenter};
      flex-direction: column;
      padding: 0;
      border-left: 0;
      border-top: 3px solid transparent;
    `};
    &:hover,
    &:focus,
    &.active {
      color: ${colors.white};
      background-color: ${colors.actualBlack};
      border-left: 5px solid ${colors.lightGreen};
      ${Media.tablet`
        border-left: 0;
        border-top: 3px solid ${colors.lightGreen};
      `};
    }
  }
  img {
    width: 30px;
    height: 30px;
    margin-bottom: 7px;
  }
`;

const MenuItem2 = styled.li`
  color: ${colors.lightGrey};
  font-size: 13px;
  ${Media.tablet`
    flex-grow: 1;
    flex-basis: 100%;
    height: 100%;
  `};
  a {
    display: block;
    padding: 15px 0;
    border-left: 5px solid transparent;
    width: 100%;
    height: 100%;
    ${Media.tablet`
      ${Mixins.flexCenter};
      flex-direction: column;
      padding: 0;
      border-left: 0;
      border-top: 3px solid transparent;
    `};
    &:hover,
    &:focus,
    &.active {
      color: ${colors.white};
      background-color: ${colors.actualBlack};
      border-left: 5px solid ${colors.lightGreen};
      ${Media.tablet`
        border-left: 0;
        border-top: 3px solid ${colors.lightGreen};
      `};
    }
  }
  img {
    width: 40px;
    height: 40px;
    margin-bottom: 7px;
  }
`;

const MenuItem3 = styled.li`
  color: ${colors.lightGrey};
  font-size: 13px;
  ${Media.tablet`
    flex-grow: 1;
    flex-basis: 100%;
    height: 100%;
  `};
  a {
    display: block;
    padding: 15px 0;
    border-left: 5px solid transparent;
    width: 100%;
    height: 100%;
    ${Media.tablet`
      ${Mixins.flexCenter};
      flex-direction: column;
      padding: 0;
      border-left: 0;
      border-top: 3px solid transparent;
    `};
    &:hover,
    &:focus,
    &.active {
      color: ${colors.white};
      background-color: ${colors.actualBlack};
      border-left: 5px solid ${colors.lightGreen};
      ${Media.tablet`
        border-left: 0;
        border-top: 3px solid ${colors.lightGreen};
      `};
    }
  }
  img {
    width: 25px;
    height: 25px;
    margin-bottom: 7px;
  }
`;

const Nav = () => (
  <Container>
    <Logo>
      <Link to="/">
        <img src={SpotifyLogo} alt="UserAvatar" />
      </Link>
    </Logo>
    <Menu>
      <MenuItem3>
        <Link to="/">
          <img src={UserAvatar} alt="UserAvatar" />
          <div>Profile</div>
        </Link>
      </MenuItem3>
      <MenuItem>
        <Link to="artists">
          <img src={TopArtistsLogo} alt="TopArtists" />
          <div>Top Artists</div>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to="tracks">
          <img src={TopTracksLogo} alt="TopTracks" />
          <div>Top Songs</div>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to="recent">
          <img src={RecentIconLogo} alt="RecentIcon" />
          <div>Recent</div>
        </Link>
      </MenuItem>
      <MenuItem2>
        <Link to="playlists">
          <img src={PlaylistIconLogo} alt="PlaylistIcon" />
          <div>Library</div>
        </Link>
      </MenuItem2>
    </Menu>
    <Github>
      <a
        href="https://github.com/MarvellinusVincent/SpotiStats"
        target="_blank"
        rel="noopener noreferrer">
        <img src={GithubIconLogo} alt="GithubIcon" />
      </a>
    </Github>
  </Container>
);

export default Nav;