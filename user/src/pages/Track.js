import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ReadableYear } from '../utils';
import { getTrackInfo } from '../utils/spotify';
import AudioFeaturesChart from '../components/AudioFeatureChart';

import styled from 'styled-components';
import { Loader } from '../components';

import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';

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
  box-shadow: 0 10px 30px -15px ${colors.shadow};
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

const AudioFeatures = styled.div`
  ${Mixins.flexCenter};
  flex-direction: column;
  gap: 100px;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 20px;
  width: 100%;
  text-align: center;
`;

const Feature = styled.div`
  padding: 15px 10px;
`;

const FeatureText = styled.h4`
  color: ${colors.lightestGrey};
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
  &:hover {
    color: ${colors.green};
    + p {
      color: ${colors.green};
    }
  }
`;

const FeatureLabel = styled.p`
  color: ${colors.lightestGrey};
  font-size: ${fontSizes.xs};
  margin-bottom: 0;
`;

const Track = () => {
  const { trackId } = useParams();
  const [track, setTrack] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);

  useEffect(() => {
    console.log('Track ID in trakcitem.js before sending:', trackId);
    const fetchData = async () => {
      try {
        const data = await getTrackInfo(trackId);
        setTrack(data.track);
        setAudioAnalysis(data.audioAnalysis);
        setAudioFeatures(data.audioFeatures);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [trackId]);

  return (
    <RealMain>
      {track ? (
        <MainStyle>
          <TrackContainer>
          <AlbumLink href={track.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            <Picture>
              <img src={track.album.images[0].url} alt="Album Picture" />
            </Picture>
          </AlbumLink>
            <TrackInfo>
            <Title>
              <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">{track.name}</a>
            </Title>
              <ArtistName>
                {track.artists &&
                  track.artists.map(({ name, uri }, i) => (
                    <React.Fragment key={i}>
                      <a href={uri} target="_blank" rel="noopener noreferrer">{name}</a>
                      {track.artists.length > 0 && i === track.artists.length - 1 ? '' : ','}&nbsp;
                    </React.Fragment>
                  ))}
              </ArtistName>
              <Album>
                  {track.album.name}
                  {' '}
                  &middot; {ReadableYear(track.album.release_date)}
              </Album>
              <PlayTrackButton
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer">
                Play on Spotify
              </PlayTrackButton>
            </TrackInfo>
          </TrackContainer>

          {audioFeatures && (
            <AudioFeatures>
              <Features>
                <Feature>
                  <FeatureText>{audioFeatures.tempo}</FeatureText>
                  <FeatureLabel>Tempo</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.loudness}</FeatureText>
                  <FeatureLabel>Loudness</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.acousticness}</FeatureText>
                  <FeatureLabel>Acousticness</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.danceability}</FeatureText>
                  <FeatureLabel>Danceability</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.energy}</FeatureText>
                  <FeatureLabel>Energy</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.liveness}</FeatureText>
                  <FeatureLabel>Liveness</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.speechiness}</FeatureText>
                  <FeatureLabel>Speechiness</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.instrumentalness}</FeatureText>
                  <FeatureLabel>Instrumentalness</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.valence}</FeatureText>
                  <FeatureLabel>Valence</FeatureLabel>
                </Feature>
              </Features>
              {audioFeatures && (
                <AudioFeaturesChart
                  audioFeatures={audioFeatures}
                  track={track}
                />
              )}
            </AudioFeatures>
          )}
        </MainStyle>
      ) : (
        <Loader />
      )}
    </RealMain>
  );
};

Track.propTypes = {
  trackId: PropTypes.string,
};

export default Track;

