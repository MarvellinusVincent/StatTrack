import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme, Media, MainStyle, RealMain } from '../styles';
import { getRecentlyPlayed } from '../utils/spotify';
import { catchErrors } from '../utils';
import { Loader, TrackItem } from '../components';
import Header from './Header';

const { colors, fontSizes, spacing } = Theme;

const RecentlyPlayedPage = styled(RealMain)`
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
  padding-bottom: ${spacing.xxl};
`;

const ContentHeader = styled.header`
  
  h2 {
    font-size: ${fontSizes.xxl};
    font-weight: 800;
    margin: ${spacing.md} 0 ${spacing.md} 0;
    color: ${colors.white};
    letter-spacing: -0.5px;
    text-align: left;
    width: 100%;
  }

  ${Media.tablet`
    padding: 0 ${spacing.xl};
  `};

  ${Media.phablet`
    padding: 0 ${spacing.md};
    margin: ${spacing.xl} 0 ${spacing.md};
  `};
`;


const TracksList = styled.div`
  margin: 0 ${spacing.xxl} ${spacing.xxl};
  background-color: ${colors.darkestGrey};
  border-radius: 12px;
  padding: ${spacing.lg};
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  ${Media.tablet`
    margin: 0 ${spacing.xl};
    padding: ${spacing.md};
  `};

  ${Media.phablet`
    margin: 0 ${spacing.md};
    padding: ${spacing.sm};
  `};
`;

const RecentlyPlayed = () => {
  const [recentlyPlayedData, setRecentlyPlayedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getRecentlyPlayed();
        setRecentlyPlayedData(data);
      } catch (error) {
        console.error('Error fetching recently played tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    catchErrors(fetchData());
  }, []);

  return (
    <RecentlyPlayedPage>
      <Header />
      <MainStyle>
        <ContentHeader>
          <h2>Recently Played</h2>
        </ContentHeader>
        
        <TracksList>
          {isLoading ? (
            <Loader />
          ) : (
            <ul>
              {recentlyPlayedData?.items.map(({ track }, i) => (
                <TrackItem track={track} key={i} />
              ))}
            </ul>
          )}
        </TracksList>
      </MainStyle>
    </RecentlyPlayedPage>
  );
};

export default RecentlyPlayed;