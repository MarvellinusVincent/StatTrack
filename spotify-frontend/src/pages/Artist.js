import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Theme, Media, MainStyle } from '../styles';
import { format2, catchErrors } from '../utils';
import { getArtist } from '../utils/spotify';
import { Loader } from '../components';

const { colors, fontSizes, spacing } = Theme;

const ArtistContainer = styled(MainStyle)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px;
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
  text-align: center;
`;

const ArtistHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${spacing.xxl};
`;

const ArtistImageContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  margin-bottom: ${spacing.xl};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  }

  ${Media.tablet`
    width: 200px;
    height: 200px;
  `};
`;

const ArtistImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ArtistName = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  margin: 0;
  color: ${colors.white};
  letter-spacing: -2px;
  line-height: 1;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  transition: color 0.3s ease;
  
  &:hover {
    color: ${colors.lightGreen};
  }

  ${Media.tablet`
    font-size: 3.5rem;
  `};

  ${Media.phablet`
    font-size: 2.5rem;
  `};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.sm};  
  width: 100%;
  max-width: 800px;
  margin-top: ${spacing.xl};  
  padding: ${spacing.sm} ${spacing.xl};  
  background-color: ${colors.darkestGrey};
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  ${Media.tablet`
    grid-template-columns: 1fr;
    gap: ${spacing.md};  
    padding: ${spacing.md};  
  `};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.md};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: ${fontSizes.xxl};
  font-weight: 700;
  color: ${colors.lightGreen};
  margin-bottom: ${spacing.xs};

  ${Media.tablet`
    font-size: ${fontSizes.xl};
  `};
`;

const StatLabel = styled.div`
  font-size: ${fontSizes.sm};
  color: ${colors.lightGrey};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const GenresContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${spacing.sm};
  margin-top: ${spacing.sm};
`;

const GenreTag = styled.span`
  background-color: ${colors.green};
  color: ${colors.actualBlack};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: ${fontSizes.xs};
  font-weight: 700;
`;

const Artist = () => {
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getArtist(artistId);
      setArtistData(data);
    };

    catchErrors(fetchData());
  }, [artistId]);

  return (
    <ArtistContainer>
      {artistData ? (
        <>
          <ArtistHeader>
            <ArtistImageContainer as="a" href={artistData.uri} target="_blank" rel="noopener noreferrer">
              {artistData.images.length > 0 && (
                <ArtistImage src={artistData.images[0].url} alt={artistData.name} />
              )}
            </ArtistImageContainer>
            
            <ArtistName as="a" href={artistData.uri} target="_blank" rel="noopener noreferrer">
              {artistData.name}
            </ArtistName>
          </ArtistHeader>

          <StatsContainer>
            <StatItem>
              <StatValue>{format2(artistData.followers.total)}</StatValue>
              <StatLabel>Followers</StatLabel>
            </StatItem>

            <StatItem>
              <StatValue>{artistData.popularity}%</StatValue>
              <StatLabel>Popularity</StatLabel>
            </StatItem>

            <StatItem>
              <StatValue>{artistData.genres.length}</StatValue>
              <StatLabel>Genres</StatLabel>
              {artistData.genres.length > 0 && (
                <GenresContainer>
                  {artistData.genres.slice(0, 3).map(genre => (
                    <GenreTag key={genre}>{genre}</GenreTag>
                  ))}
                </GenresContainer>
              )}
            </StatItem>
          </StatsContainer>
        </>
      ) : (
        <Loader />
      )}
    </ArtistContainer>
  );
};

Artist.propTypes = {
  artistId: PropTypes.string,
};

export default Artist;