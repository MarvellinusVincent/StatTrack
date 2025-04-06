import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getTopArtistsShort, getTopArtistsMedium, getTopArtists } from '../utils/spotify';
import { catchErrors } from '../utils';

import { Loader } from '../components';
import styled from 'styled-components';

import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';

import Header from './Header';

const { colors, fontSizes, spacing } = Theme;

const HeaderStyle = styled.header`
  ${Mixins.flexBetween};
  ${Media.tablet`
    display: block;
  `};
  h2 {
    margin: 0;
  }
  margin-top: 50px;
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

const ArtistsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  margin-top: 30px;
  justify-items: center;
  align-items: center;
  ${Media.tablet`
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  `}
  ${Media.phablet`
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  `};
`;

const Artist = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background-color: ${colors.actualBlack};
  border-radius: ${Theme.borderRadius};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.darkGrey};
  }
`;

const ArtistArtwork = styled(Link)`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  ${Media.tablet`
    width: 150px;
    height: 150px;
  `};
  ${Media.phablet`
    width: 120px;
    height: 120px;
  `};
  &:hover,
  &:focus {
    transform: scale(1.1);
  }
  img {
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const ArtistName = styled.a`
  margin: ${spacing.base} 0;
  border-bottom: 1px solid transparent;
  color: ${colors.lightGrey};
  transition: color 0.3s ease;
  &:hover,
  &:focus {
    border-bottom: 1px solid ${colors.white};
    color: ${colors.white};
  }
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
    <RealMain>
      <Header />
      <MainStyle>
        <HeaderStyle>
          <h2>Top Artists</h2>
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
        <ArtistsContainer>
          {topArtists ? (
            topArtists.items.map(({ id, external_urls, images, name }, i) => (
              <Artist key={i}>
                <ArtistArtwork to={`/artist/${id}`}>
                  {images.length && <img src={images[1].url} alt="Artist" />}
                </ArtistArtwork>
                <ArtistName href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {name}
                </ArtistName>
              </Artist>
            ))
          ) : (
            <Loader />
          )}
        </ArtistsContainer>
      </MainStyle>
    </RealMain>
  );
};

export default TopArtists;
