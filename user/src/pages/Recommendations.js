import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getPlaylist, getRecommendationsForTracks, getCurrentUserProfile, addTrackToPlaylist } from '../utils/spotify';
import { catchErrors } from '../utils';

import { RecommendedTrackItem } from '../components';
import styled from 'styled-components';

import { Media, MainStyle, RealMain, Theme } from '../styles';
import { useParams } from 'react-router-dom';

const { colors, fontSizes } = Theme;

const PlaylistTopSection = styled.div`
  display: flex;
  align-items: center;
  padding-top: 38px;
  padding-left: 38px;
  padding-right: 38px;
  padding-bottom: 62px;
  background-color: ${colors.mediumGrey};
`;

const Description = styled.p`
  font-size: ${fontSizes.sm};
  color: ${colors.lightGrey};
  a {
    color: ${colors.white};
    border-bottom: 1px solid transparent;
    &:hover,
    &:focus {
      border-bottom: 1px solid ${colors.white};
    }
  }
`;
const UserTotalContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 4px;
`;

const TracksContainer = styled.ul`
  margin-top: 67px;
`;

const PlaylistImage = styled.img`
  object-fit: cover;
  width: 250px;
  height: 250px;
  border-radius: 2%;
  margin-top: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 30px;
`;

const Name = styled.h1`
  font-size: 110px;
  font-weight: 700;
  margin: 20px 0 0;
  ${Media.tablet`
    font-size: 40px;
  `};
  ${Media.phablet`
    font-size: 8vw;
  `};
  &:hover {
    color: ${colors.lightGreen};
  }
`;

const User = styled.p`
  font-size: 12px;
  color: ${colors.white};
`;

const TotalTracks = styled.p`
  font-size: 12px;
  color: ${colors.lightGrey};
`;

const Recommendations = () => {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [recommendations, setRecommmendations] = useState(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      const { data } = await getPlaylist(playlistId);
      setPlaylist(data);
    };
    catchErrors(fetchPlaylistData());

    const fetchUserData = async () => {
      const { data } = await getCurrentUserProfile();
    };
    catchErrors(fetchUserData());
  }, [playlistId]);

  useEffect(() => {
    const fetchData = async () => {
      if (playlist) {
        const { data } = await getRecommendationsForTracks(playlist.tracks.items);
        setRecommmendations(data);
      }
    };
    catchErrors(fetchData());
  }, [playlist]);
  
  console.log(playlist);

  return (
    <RealMain>
      {playlist && (
        <PlaylistTopSection>
          <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            {playlist.images.length && (
              <PlaylistImage src={playlist.images[0].url} alt="Album Art" />
            )}
          </a>

          <HeaderRight>
            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <Name>{playlist.name}</Name>
            </a>

            {playlist.description && (
              <Description dangerouslySetInnerHTML={{ __html: playlist.description }} />
            )}

            <UserTotalContainer>
              <User>By {playlist.owner.display_name} </User>
              <p>•</p>
              <TotalTracks> {playlist.tracks.total} Songs</TotalTracks>
            </UserTotalContainer>
          </HeaderRight>
        </PlaylistTopSection>
      )}
      <MainStyle>
        {playlist && (
        <TracksContainer>
          <h2 style={{ marginBottom: '55px' }}>
            Recommended Tracks Based On{' '}
            {playlist.name}
          </h2>
          {recommendations &&
            recommendations.tracks.map((track, i) => (
              <RecommendedTrackItem
                track={track}
                key={i}
                onAddToPlaylist={() => addTrackToPlaylist(playlistId, track.id)}
              />
            ))}
        </TracksContainer>
        )}
      </MainStyle>
    </RealMain>
  );
};

Recommendations.propTypes = {
  playlistId: PropTypes.string,
  playlist: PropTypes.string
};

export default Recommendations;


