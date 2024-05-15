import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import { getPlaylist, getMultipleTrackAudioFeatures } from '../utils/spotify';
import { catchErrors } from '../utils';

import { TrackList, Loader } from '../components';

import styled from 'styled-components';
import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';

const { colors, fontSizes } = Theme;

const PlaylistContainer = styled.div`
  ${Media.tablet`
    display: block;
  `};
  margin-top: 40px;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  padding-top: 38px;
  padding-left: 38px;
  padding-right: 38px;
  padding-bottom: 62px;
  background-color: ${colors.mediumGrey};
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

const RecommendationButton = styled(Link)`
  background-color: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.white};
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

const Bottom = styled.div`
  flex-grow: 1;
  ${Media.tablet`
    margin: 50px 0 0;
  `};
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

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 4px;
`;

const ProfileText = styled.span`
  color: ${colors.lightGrey};
`;

const Slash = styled.span`
  color: ${colors.lightGrey};
  margin: 0px 10px;
`;

const Dropdown = styled.select`
  background-color: transparent;
  color: ${colors.white};
  border: none;
  appearance: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  text-transform: capitalize;
  &:focus {
    outline: none;
  }
`;

const DropdownOption = styled.option`
  background-color: ${colors.mediumGrey};
`;

const PlaylistHeader = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 25px;
  margin-bottom: 50px;
  margin-top: 60px;
`;

const PlaylistHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const PlaylistHeaderMiddle = styled.div`
  display: flex;
  align-items: center;
`
const PlaylistHeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const Playlist = props => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [sortValue, setSortValue] = useState('');
  const [tracksData, setTracksData] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [sortedTracks, setSortedTracks] = useState(null);
  const sortOptions = ['acousticness', 'danceability', 'energy', 'duration_ms', 'instrumentalness', 'liveness', 'loudness', 'tempo', 'speechiness', 'valence'];
  const tracksForTracklist = useMemo(() => {
    if (!tracks) {
      return;
    }
    return tracks.map(({ track }) => track);
  }, [tracks]);

  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return null;
    }

    return tracks.map(({ track }) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = audioFeatures.find(item => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd['audio_features'] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylist(playlistId);
      setPlaylist(data);
      setTracksData(data.tracks);
      
    };
    catchErrors(fetchData());
  }, [playlistId]);

  useEffect(() => {
    if (!tracksData) {
      return;
    }
    const fetchMoreData = async () => {
      if (tracksData.next) {
        const { data } = await axios.get(tracksData.next);
        setTracksData(data);
      }
    };

    setTracks(tracks => ([
      ...tracks ? tracks : [],
      ...tracksData.items
    ]));
    catchErrors(fetchMoreData());

    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({ track }) => track.id).join(',');
      const { data } = await getMultipleTrackAudioFeatures(ids);
      setAudioFeatures(audioFeatures => ([
        ...audioFeatures ? audioFeatures : [],
        ...data['audio_features']
      ]));
    };
    catchErrors(fetchAudioFeatures());
  }, [tracksData]);

  useEffect(() => {
    if (sortValue && tracksWithAudioFeatures) {
      const sorted = [...tracksWithAudioFeatures].sort((a, b) => {
        const aFeatures = a['audio_features'];
        const bFeatures = b['audio_features'];
    
        if (!aFeatures || !bFeatures) {
          return false;
        }
    
        return bFeatures[sortValue] - aFeatures[sortValue];
      });
      setSortedTracks(sorted);
    } else {
      setSortedTracks(tracksWithAudioFeatures);
    }
  }, [sortValue, tracksWithAudioFeatures]);

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    setSortValue(selectedValue);
  };

  return (
    <React.Fragment>
      {playlist ? (
        <RealMain>
          <TopSection>
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

              <UserContainer>
                <User>By {playlist.owner.display_name} </User>
                <p>•</p>
                <TotalTracks> {playlist.tracks.total} Songs</TotalTracks>
              </UserContainer>

              
            </HeaderRight>
          </TopSection>
          <MainStyle>
            <PlaylistContainer>
              <PlaylistHeader>
                <PlaylistHeaderLeft>
                  <ProfileText>Profile</ProfileText>
                  <Slash>/</Slash>
                  Playlist
                </PlaylistHeaderLeft>
                <PlaylistHeaderMiddle>
                  <RecommendationButton to={`/recommendations/${playlist.id}`}>Get Recommendations</RecommendationButton>
                </PlaylistHeaderMiddle>
                <PlaylistHeaderRight>
                  <Dropdown onChange={handleSortChange} value={sortValue}>
                    <DropdownOption value="">Original</DropdownOption>
                    {sortOptions.map((option, index) => (
                      <DropdownOption key={index} value={option}>
                        {option}
                      </DropdownOption>
                    ))}
                  </Dropdown>
                </PlaylistHeaderRight>
              </PlaylistHeader>
              <Bottom>
                <ul>
                  
                  {sortedTracks !== null ? (
                    <TrackList tracks={sortedTracks} />
                  ) : (
                    <TrackList tracks={tracksForTracklist} />
                  )}
                </ul>
              </Bottom>
            </PlaylistContainer>
          </MainStyle>
        </RealMain>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

Playlist.propTypes = {
  playlistId: PropTypes.string,
};

export default Playlist;
