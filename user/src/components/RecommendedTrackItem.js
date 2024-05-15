import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatTime } from '../utils';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Theme, Mixins, Media } from '../styles';
import { PlusIcon, PlayIcon, PauseIcon } from '../assets';
import { playTrack, pauseTrack } from '../utils/spotify';

const { colors, fontSizes, spacing } = Theme;

const TrackLeft = styled.span`
  ${Mixins.overflowEllipsis};
`;

const TrackRight = styled.span`
  display: flex;
  align-items: center;
`;

const TrackPicture = styled.div`
  display: inline-block;
  position: relative;
  width: 60px;
  min-width: 60px;
  margin-right: ${spacing.base};
`;

const PlayButton = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const AlbumImage = styled.img`
  border-radius: 8px;
  opacity: 1;
`;

const PlayIconImg = styled.img`
  width: 40px;
  opacity: 2;
`;

const PauseIconImg = styled.img`
  width: 40px;
`

const Cover = styled.div`
  ${Mixins.flexCenter};
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: ${colors.white};
  opacity: 0;
  transition: ${Theme.transition};
`;

const TrackContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  ${Media.tablet`
    margin-bottom: ${spacing.base};
  `};
  &:hover,
  &:focus {
    ${Cover} {
      opacity: 1;
    }
    ${PlayButton} {
      opacity: 1;
    }
    background-color: #2a2a2a;

    .plus-icon {
      visibility: visible;
    }
  }

  .plus-icon {
    visibility: hidden;
  }
`;

const TrackMiniContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 10px;
`;

const TrackName = styled.span`
  margin-bottom: 5px;
  border-bottom: 1px solid transparent;
  &:hover,
  &:focus {
    border-bottom: 1px solid ${colors.white};
    text-decoration: none;
  }
`;

const TrackAlbum = styled.div`
  ${Mixins.overflowEllipsis};
  color: ${colors.lightGrey};
  font-size: ${fontSizes.sm};
  margin-top: 3px;
`;

const TrackDuration = styled.span`
  color: ${colors.lightGrey};
  font-size: ${fontSizes.sm};
`;

const PlusIconImg = styled.img`
  width: 18px;
  margin-right: 10px;
`;

const RecommendedTrackItem = ({ track, onAddToPlaylist }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack(track.id);
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <li>
      <TrackContainer>
        <TrackPicture>
          {track.album.images.length && (
            <>
              <AlbumImage src={track.album.images[2].url} alt="Album Artwork" />
              <PlayButton>
              <a onClick={togglePlayPause}>
                {isPlaying ? (
                  <PauseIconImg src={PauseIcon} alt="Pause Icon" />
                ) : (
                  <PlayIconImg src={PlayIcon} alt="Play Icon" />
                )}
              </a>
              </PlayButton>
            </>
          )}
        </TrackPicture>
        <TrackMiniContainer>
          <TrackLeft>
            {track.name && (
              <TrackName as={Link} to={`/track/${track.id}`}>
                {track.name}
              </TrackName>
            )}
            {track.artists && track.album && (
              <TrackAlbum>
                {track.artists &&
                  track.artists.map(({ name }, i) => (
                    <span key={i}>
                      {name}
                      {i !== track.artists.length - 1 && ', '}
                    </span>
                  ))}
              </TrackAlbum>
            )}
          </TrackLeft>
          <TrackRight>
            <a>
              <PlusIconImg
                className="plus-icon"
                src={PlusIcon}
                alt="Plus Icon"
                onClick={() => onAddToPlaylist(track.id)}
              />
            </a>
            {track.duration_ms && <TrackDuration>{formatTime(track.duration_ms)}</TrackDuration>}
          </TrackRight>
        </TrackMiniContainer>
      </TrackContainer>
    </li>
  );
};

RecommendedTrackItem.propTypes = {
  track: PropTypes.object.isRequired,
  onAddToPlaylist: PropTypes.func.isRequired,
};

export default RecommendedTrackItem;
