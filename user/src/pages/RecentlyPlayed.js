import React, { useState, useEffect } from 'react';

import { getRecentlyPlayed } from '../utils/spotify';
import { catchErrors } from '../utils';

import { Loader, TrackItem } from '../components';

import { MainStyle, RealMain } from '../styles';
import styled from 'styled-components';

import Header from './Header'


const TracksContainer = styled.ul`
  margin-top: 50px;
`;

const HeaderStyle = styled.header`
  h2 {
    margin: 0;
  }
  margin-top: 58px;
`;

const RecentlyPlayed = () => {
  const [recentlyPlayedData, setRecentlyPlayedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getRecentlyPlayed();
      setRecentlyPlayedData(data);
    };
    catchErrors(fetchData());
  }, []);

  return (
    <RealMain>
        <Header/>
        <MainStyle>
          <HeaderStyle>
          <h2>Recently Played Songs</h2>
          <TracksContainer>
              {recentlyPlayedData ? (
              recentlyPlayedData.items.map(({ track }, i) => <TrackItem track={track} key={i} />)
              ) : (
              <Loader />
              )}
          </TracksContainer>
          </HeaderStyle>
          </MainStyle>
    </RealMain>
  );
};

export default RecentlyPlayed;