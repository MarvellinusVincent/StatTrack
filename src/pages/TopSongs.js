import React, { useState, useEffect } from 'react';

import { getTopSongsShort, getTopSongsMedium, getTopSongs } from '../utils/spotify';
import { catchErrors } from '../utils';

import { Loader, TrackItem } from '../components';
import styled from 'styled-components';

import Header from './Header';

import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';

const { colors, fontSizes } = Theme;

const HeaderStyle = styled.header`
  ${Mixins.flexBetween};
  ${Media.tablet`
    display: block;
  `};
  h2 {
    margin: 0;
  }
  margin-top:50px;
`;

const Range = styled.div`
  display: flex;
  margin-right: -11px;
  ${Media.tablet`
    justify-content: space-around;
    margin: 30px 0 0;
  `};
  gap: 10px;
`;

const RangeButton = styled.button`
  background-color: transparent;
  color: ${colors.white};
  border-radius: 30px;
  padding: 12px 30px;
  font-size: ${fontSizes.xs};
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${colors.lightGreen};
    color: ${colors.actualBlack};
  }
`;

const TracksContainer = styled.ul`
  margin-top: 30px;
`;

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  const apiCalls = {
    long: getTopSongs(),
    medium: getTopSongsMedium(),
    short: getTopSongsShort(),
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopSongsShort();
      setTopTracks(data);
    };
    catchErrors(fetchData());
  }, []);

  const changeRange = async range => {
    const { data } = await apiCalls[range];
    setTopTracks(data);
    setActiveRange(range);
  };

  const setRangeData = range => catchErrors(changeRange(range));

  return (
    <RealMain>
        <Header />
        <MainStyle>
        <HeaderStyle>
            <h2>Top Songs</h2>
            <Range>
            <RangeButton isActive={activeRange === 'short'} onClick={() => setRangeData('short')}>
                <span>Last 4 Weeks</span>
            </RangeButton>
            <RangeButton isActive={activeRange === 'medium'} onClick={() => setRangeData('medium')}>
                <span>Last 6 Months</span>
            </RangeButton>
            <RangeButton isActive={activeRange === 'long'} onClick={() => setRangeData('long')}>
                <span>All Time</span>
            </RangeButton>
            </Range>
        </HeaderStyle>
        <TracksContainer>
            {topTracks ? (
            topTracks.items.map((track, i) => <TrackItem track={track} key={i} />)
            ) : (
            <Loader />
            )}
        </TracksContainer>
        </MainStyle>
    </RealMain>
  );
};

export default TopTracks;