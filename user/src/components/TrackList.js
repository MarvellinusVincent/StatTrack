import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDuration } from '../utils';
import styled from 'styled-components';
import { Theme, Mixins, Media } from '../styles';

const { colors, fontSizes, spacing } = Theme;

const TrackContainer = styled(Link)`
  ${Mixins.overflowEllipsis};
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
    background-color: #2a2a2a;
  }
`;

const TrackMiniContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 10px;
`;

const TrackLeft = styled.span`
  ${Mixins.overflowEllipsis};
  margin-bottom: 5px;
  border-bottom: 1px solid transparent;
  &:hover,
  &:focus {
  }
`;

const TrackRight = styled.span`
  color: ${colors.lightGrey};
  font-size: ${fontSizes.sm};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TrackPicture = styled.div`
  display: inline-block;
  position: relative;
  width: 60px;
  min-width: 60px;
  margin-right: ${spacing.base};
  img {
    border-radius: 8px;
  }
`;

const TrackName = styled.span`
  ${Mixins.overflowEllipsis};
  &:hover,
  &:focus {
    border-bottom: 1px solid ${colors.white};
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

const TrackList = ({ tracks }) => (
  <>
    {tracks && tracks.length ? (
      <main>
        {tracks.map((track, i) => (
          <TrackContainer key={i} to={`/track/${track.id}`}>
            <div>
              <TrackPicture>
                {track.album.images.length && <img src={track.album.images[2].url} alt="Album Artwork" />}
              </TrackPicture>
            </div>
            <TrackMiniContainer>
              <TrackLeft>
                {track.name && <TrackName>{track.name}</TrackName>}
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
                {track.duration_ms && <TrackDuration>{formatDuration(track.duration_ms)}</TrackDuration>}
              </TrackRight>
            </TrackMiniContainer>
          </TrackContainer>
        ))}
      </main>
    ) : (
      <p className="empty-notice">No tracks available</p>
    )}
  </>
);

TrackList.propTypes = {
  tracks: PropTypes.array,
};

export default TrackList;
