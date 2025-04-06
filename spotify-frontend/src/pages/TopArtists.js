import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';
import { getTopArtistsShort, getTopArtistsMedium, getTopArtists } from '../utils/spotify';
import { catchErrors } from '../utils';
import { Loader } from '../components';
import Header from './Header';

const { colors, fontSizes } = Theme;

const TopArtistsContainer = styled(RealMain)`
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
`;

const ContentHeader = styled.header`
  ${Mixins.flexBetween};
  margin: 50px 0 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.lightGrey};
  
  ${Media.tablet`
    flex-direction: column;
    align-items: flex-start;
    margin: 40px 0 30px;
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

const ArtistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  margin: 40px 0;
  
  ${Media.tablet`
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
  `};
  
  ${Media.phablet`
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 15px;
  `};
`;

const ArtistCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.darkestGrey};
  border-radius: 12px;
  padding: 25px 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    background-color: ${colors.darkGrey};
  }
`;

const ArtistImageLink = styled(Link)`
  display: block;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${Media.tablet`
    width: 140px;
    height: 140px;
  `};
  
  ${Media.phablet`
    width: 110px;
    height: 110px;
  `};
`;

const ArtistImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ArtistNameLink = styled.a`
  font-size: ${fontSizes.lg};
  font-weight: 600;
  color: ${colors.white};
  text-align: center;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-bottom: 5px;
  
  &:hover {
    color: ${colors.lightGreen};
  }
  
  ${Media.tablet`
    font-size: ${fontSizes.md};
  `};
`;

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  const apiCalls = {
    long: getTopArtists(),
    medium: getTopArtistsMedium(),
    short: getTopArtistsShort(),
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTopArtistsShort();
      setTopArtists(data);
    };
    catchErrors(fetchData());
  }, []);

  const changeRange = async range => {
    const { data } = await apiCalls[range];
    setTopArtists(data);
    setActiveRange(range);
  };

  const setRangeData = range => catchErrors(changeRange(range));

  return (
    <TopArtistsContainer>
      <Header />
      <MainStyle>
        <ContentHeader>
          <PageTitle>Top Artists</PageTitle>
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

        <ArtistsGrid>
          {topArtists ? (
            topArtists.items.map(({ id, external_urls, images, name }, i) => (
              <ArtistCard key={i}>
                <ArtistImageLink to={`/artist/${id}`}>
                  {images.length && (
                    <ArtistImage 
                      src={images[1]?.url || images[0]?.url} 
                      alt={name} 
                    />
                  )}
                </ArtistImageLink>
                <ArtistNameLink 
                  href={external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {name}
                </ArtistNameLink>
              </ArtistCard>
            ))
          ) : (
            <Loader />
          )}
        </ArtistsGrid>
      </MainStyle>
    </TopArtistsContainer>
  );
};

export default TopArtists;