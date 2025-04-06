import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReadableYear } from '../utils';
import { getTrackInfo } from '../utils/spotify';
import styled from 'styled-components';
import { Theme, Media, MainStyle, RealMain } from '../styles';
import { useParams } from 'react-router-dom';
import { Loader } from '../components';

const { colors, fontSizes, spacing } = Theme;

const TrackContainer = styled(MainStyle)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px;
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
  text-align: center;
`;

const TrackHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${spacing.xxl};
`;

const AlbumArt = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 8px;
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

const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TrackTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 ${spacing.sm};
  color: ${colors.white};
  letter-spacing: -1px;
  line-height: 1;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  transition: color 0.3s ease;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: ${colors.lightGreen};
    }
  }

  ${Media.tablet`
    font-size: 2.5rem;
  `};

  ${Media.phablet`
    font-size: 2rem;
  `};
`;

const TrackArtists = styled.div`
  margin-bottom: ${spacing.md};
  
  a {
    font-size: ${fontSizes.xl};
    color: ${colors.lightGrey};
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${colors.lightGreen};
    }
  }

  ${Media.tablet`
    font-size: ${fontSizes.lg};
  `};
`;

const TrackAlbum = styled.div`
  font-size: ${fontSizes.md};
  color: ${colors.lightGrey};
  margin-bottom: ${spacing.lg};
  
  a {
    color: ${colors.lightGreen};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${colors.white};
    }
  }
`;

const PlayButton = styled.a`
  background-color: ${colors.lightGreen};
  color: ${colors.actualBlack};
  padding: 12px 30px;
  border-radius: 30px;
  font-size: ${fontSizes.sm};
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${colors.white};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 229, 157, 0.3);
  }
`;

const Track = () => {
  const { trackId } = useParams();
  const [track, setTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTrackInfo(trackId);
        setTrack(data.track);
      } catch (err) {
        console.error('Error fetching track:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [trackId]);

  if (isLoading) {
    return (
      <RealMain>
        <TrackContainer>
          <Loader />
        </TrackContainer>
      </RealMain>
    );
  }

  if (error) {
    return (
      <RealMain>
        <TrackContainer>
          <div>Error loading track: {error.message}</div>
        </TrackContainer>
      </RealMain>
    );
  }

  return (
    <RealMain>
      {track && (
        <TrackContainer>
          <TrackHeader>
            <AlbumArt as="a" href={track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <AlbumImage src={track.album.images[0]?.url} alt={`Album cover for ${track.album.name}`} />
            </AlbumArt>
            
            <TrackTitle as="a" href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {track.name}
            </TrackTitle>
            
            <TrackArtists>
              {track.artists?.map(({ name, external_urls, id }, i) => (
                <React.Fragment key={id}>
                  <a href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    {name}
                  </a>
                  {i < track.artists.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))}
            </TrackArtists>
            
            <TrackAlbum>
              From <a href={track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                {track.album.name}
              </a> · {ReadableYear(track.album.release_date)}
            </TrackAlbum>
            
            <PlayButton
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Play on Spotify
            </PlayButton>
          </TrackHeader>
        </TrackContainer>
      )}
    </RealMain>
  );
};

Track.propTypes = {
  trackId: PropTypes.string,
};

export default Track;