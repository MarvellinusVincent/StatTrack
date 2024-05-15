import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ScrollToTop from '../components/ScrollToTop';

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
    <BrowserRouter>
      <ScrollToTop>
        <Nav />
        <Routes>
          <Route path="/">
            <Route index element={<Profile />} />
            <Route path="playlists/:playlistId" element={<Playlist />} />
            <Route path="playlists" element={<AllPlaylists />} />
            <Route path="artists" element={<TopArtists />} />
            <Route path="tracks" element={<TopTracks />} />
            <Route path="recent" element={<RecentlyPlayed />} />
            <Route path="artist/:artistId" element={<Artist />} />
            <Route path="track/:trackId" element={<Track />} />
            <Route path="recommendations/:playlistId" element={<Recommendations />} />
          </Route>
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  </MainDiv>
);

export default Main;
