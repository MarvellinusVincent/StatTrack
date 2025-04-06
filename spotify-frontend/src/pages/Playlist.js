import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getPlaylist } from '../utils/spotify';
import { catchErrors } from '../utils';
import { TrackList, Loader } from '../components';
import styled from 'styled-components';
import { Theme, Media, MainStyle, RealMain, Mixins } from '../styles';
import { getAccessToken } from '../utils/spotify';

const { colors, fontSizes } = Theme;

const PlaylistContainer = styled(RealMain)`
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 80px 60px;
  background: linear-gradient(to bottom, ${colors.mediumGrey} 0%, rgba(40,40,40,0.8) 100%);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent 0%, ${colors.lightGrey} 50%, transparent 100%);
  }

  ${Media.tablet`
    flex-direction: column;
    align-items: flex-start;
    padding: 60px 40px;
  `};
`;

const PlaylistImage = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 8px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  margin-right: 50px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  ${Media.tablet`
    width: 200px;
    height: 200px;
    margin-right: 0;
    margin-bottom: 30px;
  `};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaylistInfo = styled.div`
  flex: 1;
  z-index: 1;
`;

const PlaylistName = styled.h1`
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0 0 15px;
  color: ${colors.white};
  line-height: 1;
  letter-spacing: -1px;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  
  ${Media.tablet`
    font-size: 3.5rem;
  `};
  
  ${Media.phablet`
    font-size: 2.5rem;
  `};
`;

const PlaylistDescription = styled.div`
  font-size: ${fontSizes.md};
  color: ${colors.lightGrey};
  margin-bottom: 25px;
  line-height: 1.5;
  
  a {
    color: ${colors.white};
    transition: color 0.2s ease;
    
    &:hover {
      color: ${colors.lightGreen};
      text-decoration: none;
    }
  }
`;

const PlaylistMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: ${fontSizes.sm};
  color: ${colors.lightGrey};
  margin-top: 15px;
  
  span {
    margin: 0 10px;
  }
  
  a {
    color: ${colors.white};
    font-weight: 600;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${colors.lightGreen};
      text-decoration: none;
    }
  }
`;

const StatsContainer = styled.div`
  display: flex;
  margin-top: 25px;
  gap: 30px;
  
  ${Media.phablet`
    gap: 20px;
  `};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatNumber = styled.div`
  font-size: ${fontSizes.lg};
  font-weight: 700;
  color: ${colors.lightGreen};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: ${fontSizes.xs};
  color: ${colors.lightGrey};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentSection = styled(MainStyle)`
  padding: 50px;
  ${Media.tablet`
    padding: 30px;
  `};
`;

const TracklistHeader = styled.div`
  ${Mixins.flexBetween};
  margin-bottom: 30px;
  
  h2 {
    margin: 0;
    font-size: ${fontSizes.xxl};
    color: ${colors.white};
    font-weight: 700;
  }
`;

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylist(playlistId);
      setPlaylist(data);
      setTracksData(data.tracks);
    };
    catchErrors(fetchData());
  }, [playlistId]);

  useEffect(() => {
    if (!tracksData) return;

    const fetchMoreTracks = async () => {
      if (tracksData.next) {
        try {
          const { data } = await axios.get(tracksData.next, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          });
          setTracksData(data);
        } catch (error) {
          if (error.response?.status === 401) {
            setTracksData(prev => ({ ...prev, next: null }));
          }
        }
      }
    };

    setTracks(prev => [
      ...(prev || []),
      ...tracksData.items.filter(item => item.track),
    ]);

    catchErrors(fetchMoreTracks());
  }, [tracksData]);

  const tracksForTracklist = useMemo(() => {
    if (!tracks) return null;
    return tracks.map(({ track }) => track).filter(Boolean);
  }, [tracks]);

  return (
    <PlaylistContainer>
      {playlist ? (
        <>
          <HeaderSection>
            <PlaylistImage as={playlist.external_urls.spotify ? 'a' : 'div'}
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer">
              {playlist.images[0]?.url ? (
                <img src={playlist.images[0].url} alt={playlist.name} />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: colors.darkestGrey,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.lightGrey
                }}>
                  No Image
                </div>
              )}
            </PlaylistImage>
            
            <PlaylistInfo>
              <PlaylistName as={playlist.external_urls.spotify ? 'a' : 'div'}
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer">
                {playlist.name}
              </PlaylistName>
              
              {playlist.description && (
                <PlaylistDescription 
                  dangerouslySetInnerHTML={{ __html: playlist.description }} 
                />
              )}
              
              <StatsContainer>
                <StatItem>
                  <StatNumber>{playlist.tracks.total.toLocaleString()}</StatNumber>
                  <StatLabel>Tracks</StatLabel>
                </StatItem>
                
                <StatItem>
                  <StatNumber>{playlist.followers?.total?.toLocaleString() || '0'}</StatNumber>
                  <StatLabel>Followers</StatLabel>
                </StatItem>
              </StatsContainer>
              
              <PlaylistMeta>
                <span>Created by</span>
                <Link to={`/user/${playlist.owner.id}`}>{playlist.owner.display_name}</Link>
              </PlaylistMeta>
            </PlaylistInfo>
          </HeaderSection>

          <ContentSection>
            <TracklistHeader>
              <h2>Tracks</h2>
            </TracklistHeader>

            {tracksForTracklist ? (
              <TrackList tracks={tracksForTracklist} />
            ) : (
              <Loader />
            )}
          </ContentSection>
        </>
      ) : (
        <Loader fullScreen />
      )}
    </PlaylistContainer>
  );
};

Playlist.propTypes = {
  playlistId: PropTypes.string,
};

export default Playlist;