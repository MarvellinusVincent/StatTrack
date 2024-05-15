import React from 'react';
import { Router } from '@reach/router';

import { Nav } from '../components';
import Profile from './Profile';
import RecentlyPlayed from './RecentlyPlayed';
import TopArtists from './TopArtists';
import TopTracks from './TopSongs';
import Playlist from './Playlist';
import Recommendations from './Recommendations';
import Track from './Track';
import Artist from './Artist';
import AllPlaylists from './AllPlaylists';

import styled from 'styled-components';
import { Theme, Media } from '../styles';

const MainDiv = styled.div`
  padding-left: ${Theme.navWidth};
  ${Media.tablet`
    padding-left: 0;
    padding-bottom: 50px;
  `};
`;

const Main = () => (
  <MainDiv>
    <Nav />
    <Router primary={false}>
        <Profile path="/" />
        <TopArtists path="artists" />
        <TopTracks path="tracks" />
        <RecentlyPlayed path="recent" />
        <AllPlaylists path="playlists" />
        <Artist path="artist/:artistId" />
        <Playlist path="playlists/:playlistId" />
        <Recommendations path="recommendations/:playlistId" />
        <Track path="track/:trackId" />

    </Router>
  </MainDiv>
);

export default Main;