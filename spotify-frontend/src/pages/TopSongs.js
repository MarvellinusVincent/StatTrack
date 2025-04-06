import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';
import { getTopTracksShort, getTopTracks, getTopTracksMedium } from '../utils/spotify';
import { catchErrors } from '../utils';
import { Loader, TrackItem } from '../components';
import Header from './Header';

const { colors, fontSizes } = Theme;

const TopTracksContainer = styled(RealMain)`
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
`;

const ContentHeader = styled.header`
  ${Mixins.flexBetween};
  align-items: flex-end;
  margin: 50px 0 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.lightGrey};
  
  ${Media.tablet`
    flex-direction: column;
    align-items: flex-start;
    margin: 40px 0 25px;
  `};
`;

const PageTitle = styled.h2`
  font-size: ${fontSizes.xxl};
  font-weight: 800;
  margin: 0;
  color: ${colors.white};
  letter-spacing: -0.5px;
  
  ${Media.tablet`
    margin-bottom: 25px;
  `};
`;

const RangeControls = styled.div`
  display: flex;
  gap: 15px;
  
  ${Media.tablet`
    width: 100%;
    justify-content: space-between;
    gap: 10px;
  `};
  
  ${Media.phablet`
    flex-wrap: wrap;
  `};
`;

const RangeButton = styled.button`
  background-color: ${props => props.$isActive ? colors.lightGreen : 'transparent'};
  color: ${props => props.$isActive ? colors.actualBlack : colors.white};
  border: 2px solid ${props => props.$isActive ? colors.lightGreen : colors.white};
  border-radius: 30px;
  padding: 12px 25px;
  font-size: ${fontSizes.xs};
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => !props.$isActive && colors.lightGreen};
    color: ${props => !props.$isActive && colors.actualBlack};
    transform: translateY(-2px);
  }
  
  ${Media.phablet`
    flex: 1;
    min-width: calc(50% - 5px);
    padding: 10px 15px;
  `};
`;

const TracksList = styled.div`
  margin: 40px 0;
  background-color: ${colors.darkestGrey};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  list-style-type: none;
`;

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  const apiCalls = {
    long: getTopTracks(),
    medium: getTopTracksMedium(),
    short: getTopTracksShort(),
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopTracksShort();
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
    <TopTracksContainer>
      <Header />
      <MainStyle>
        <ContentHeader>
          <PageTitle>Top Tracks</PageTitle>
          <RangeControls>
            <RangeButton 
              $isActive={activeRange === 'short'} 
              onClick={() => setRangeData('short')}
            >
              Last 4 Weeks
            </RangeButton>
            <RangeButton 
              $isActive={activeRange === 'medium'} 
              onClick={() => setRangeData('medium')}
            >
              Last 6 Months
            </RangeButton>
            <RangeButton 
              $isActive={activeRange === 'long'} 
              onClick={() => setRangeData('long')}
            >
              All Time
            </RangeButton>
          </RangeControls>
        </ContentHeader>

        <TracksList>
          {topTracks ? (
            topTracks.items.map((track, i) => (
              <TrackItem 
                track={track} 
                key={i} 
                index={i + 1}
              />
            ))
          ) : (
            <Loader />
          )}
        </TracksList>
      </MainStyle>
    </TopTracksContainer>
  );
};

export default TopTracks;