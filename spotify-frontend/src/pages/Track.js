import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReadableYear } from '../utils';
import { getTrackInfo } from '../utils/spotify';
import styled from 'styled-components';
import { Theme, Media, MainStyle, RealMain } from '../styles';
import { useParams } from 'react-router-dom';

const { colors, fontSizes, spacing } = Theme;

const TrackContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 150px;
`;

const Picture = styled.div`
  display: inline-block;
  overflow: hidden;
  margin-bottom: ${spacing.md};
  transition: transform 0.3s ease-in-out;
  img {
    width: 300px;
    height: 300px;
    object-fit: cover;
    ${Media.tablet`
      width: 200px;
      height: 200px;
    `};
  }
  &:hover,
  &:focus {
    transform: scale(1.1);
  }
`;

const AlbumLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const TrackInfo = styled.div`
  text-align: center;
`;

const PlayTrackButton = styled.a`
  background-color: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.white};
  margin-top: 20px;
  margin-bottom: 30px;
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

const Title = styled.h1`
  font-size: 40px;
  margin: 0 0 10px;
  color: ${colors.dark};
  &:hover,
  &:focus {
    color: ${colors.green};
  }
  a {
    text-decoration: none;
    color: inherit;
    &:hover,
    &:focus {
      color: ${colors.green};
    }
  }
`;

const ArtistName = styled.h2`
  color: ${colors.grey};
  font-weight: 700;
  margin-bottom: 20px;
  a {
    text-decoration: none;
    color: inherit;
    &:hover,
    &:focus {
      color: ${colors.green};
    }
  }
`;

const Album = styled.h3`
  color: ${colors.lightGrey};
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 20px;
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
        <div>Loading track information...</div>
      </RealMain>
    );
  }

  if (error) {
    return (
      <RealMain>
        <div>Error loading track: {error.message}</div>
      </RealMain>
    );
  }

  return (
    <RealMain>
      {track && (
        <MainStyle>
          <TrackContainer>
            <AlbumLink href={track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <Picture>
                <img src={track.album.images[0]?.url} alt={`Album cover for ${track.album.name}`} />
              </Picture>
            </AlbumLink>
            <TrackInfo>
              <Title>
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {track.name}
                </a>
              </Title>
              <ArtistName>
                {track.artists?.map(({ name, external_urls }, i) => (
                  <React.Fragment key={external_urls.spotify}>
                    <a href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                    {i < track.artists.length - 1 ? ', ' : ''}
                  </React.Fragment>
                ))}
              </ArtistName>
              <Album>
                {track.album.name} · {ReadableYear(track.album.release_date)}
              </Album>
              <PlayTrackButton
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                Play on Spotify
              </PlayTrackButton>
            </TrackInfo>
          </TrackContainer>
        </MainStyle>
      )}
    </RealMain>
  );
};

Track.propTypes = {
  trackId: PropTypes.string,
};

export default Track;