import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { formatDuration, getYear, parsePitchClass } from '../utils';
import { getTrackInfo } from '../utils/spotify';

import styled from 'styled-components';
import { TrackChart, Loader } from '../components';

import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';

const { colors, fontSizes } = Theme;

const TrackContainer = styled.div`
  display: flex;
  margin-bottom: 70px;
  ${Media.phablet`
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  `};
`;

const Picture = styled.div`
  ${Mixins.coverShadow};
  max-width: 250px;
  margin-right: 40px;
  ${Media.tablet`
    max-width: 200px;
  `};
  ${Media.phablet`
    margin: 0 auto;
  `};
`;

const TrackInfo = styled.div`
  flex-grow: 1;
  ${Media.phablet`
    text-align: center;
    margin-top: 30px;
  `};
`;

const PlayTrackButton = styled.a`
  ${Mixins.greenButton};
`;

const Title = styled.h1`
  font-size: 36px;
  margin: 0 0 5px;
  ${Media.tablet`
    font-size: 30px;
  `};
`;

const ArtistName = styled.h2`
  color: ${colors.lightestGrey};
  font-weight: 700;
  text-align: left !important;
  ${Media.tablet`
    font-size: 18px;
  `};
  ${Media.phablet`
    text-align: center !important;
  `};
`;

const Album = styled.h3`
  color: ${colors.lightGrey};
  font-weight: 400;
  font-size: 14px;
`;

const AudioFeatures = styled.div`
  ${Mixins.flexCenter};
  flex-direction: column;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 20px;
  width: 100%;
  margin-bottom: 50px;
  text-align: center;
  border: 1px solid ${colors.grey};
  padding: 20px;
`;

const Feature = styled.div`
  padding: 15px 10px;
`;

const FeatureText = styled.h4`
  color: ${colors.lightestGrey};
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const FeatureLabel = styled.p`
  color: ${colors.lightestGrey};
  font-size: ${fontSizes.xs};
  margin-bottom: 0;
`;

const DescriptionLink = styled.a`
  color: ${colors.lightestGrey};
  margin-top: 20px;
  border-bottom: 1px solid transparent;
  &:hover,
  &:focus {
    color: ${colors.white};
    border-bottom: 1px solid ${colors.white};
  }
`;

const Track = ({ trackId }) => {
  const [track, setTrack] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);

  useEffect(() => {
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
            <Picture>
              <img src={track.album.images[0].url} alt="Album Picture" />
            </Picture>
            <TrackInfo>
              <Title>{track.name}</Title>
              <ArtistName>
                {track.artists &&
                  track.artists.map(({ name }, i) => (
                    <span key={i}>
                      {name}
                      {track.artists.length > 0 && i === track.artists.length - 1 ? '' : ','}
                      &nbsp;
                    </span>
                  ))}
              </ArtistName>
              <Album>
                <a
                  href={track.album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer">
                  {track.album.name}
                </a>{' '}
                &middot; {getYear(track.album.release_date)}
              </Album>
              <PlayTrackButton
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer">
                Play on Spotify
              </PlayTrackButton>
            </TrackInfo>
          </TrackContainer>

          {audioFeatures && audioAnalysis && (
            <AudioFeatures>
              <Features>
                <Feature>
                  <FeatureText>{formatDuration(audioFeatures.duration_ms)}</FeatureText>
                  <FeatureLabel>Duration</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{parsePitchClass(audioFeatures.key)}</FeatureText>
                  <FeatureLabel>Key</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.mode === 1 ? 'Major' : 'Minor'}</FeatureText>
                  <FeatureLabel>Modality</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioFeatures.time_signature}</FeatureText>
                  <FeatureLabel>Time Signature</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{Math.round(audioFeatures.tempo)}</FeatureText>
                  <FeatureLabel>Tempo (BPM)</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{track.popularity}%</FeatureText>
                  <FeatureLabel>Popularity</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioAnalysis.bars.length}</FeatureText>
                  <FeatureLabel>Bars</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioAnalysis.beats.length}</FeatureText>
                  <FeatureLabel>Beats</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioAnalysis.sections.length}</FeatureText>
                  <FeatureLabel>Sections</FeatureLabel>
                </Feature>
                <Feature>
                  <FeatureText>{audioAnalysis.segments.length}</FeatureText>
                  <FeatureLabel>Segments</FeatureLabel>
                </Feature>
              </Features>

              <TrackChart features={audioFeatures} type="" />

              <DescriptionLink
                href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/"
                target="_blank"
                rel="noopener noreferrer">
                Full Description of Audio Features
              </DescriptionLink>
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
