import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';
import { getPlaylists } from '../utils/spotify';
import { catchErrors } from '../utils';
import { Loader } from '../components';
import Header from './Header';

const { colors, fontSizes, spacing } = Theme;

const PlaylistsPage = styled(RealMain)`
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
  padding-bottom: ${spacing.xxl};
`;

const PageHeader = styled.header`
  h2 {
    font-size: ${fontSizes.xxl};
    font-weight: 800;
    margin: ${spacing.md} 0 ${spacing.md} 0;
    color: ${colors.white};
    letter-spacing: -0.5px;
  }
`;

const PlaylistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${spacing.lg};
  width: 100%;
  padding: 0 ${spacing.xxl};
  margin-bottom: ${spacing.xxl};
  
  ${Media.tablet`
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${spacing.md};
    padding: 0 ${spacing.xl};
    margin-top: ${spacing.md};
  `};
  
  ${Media.phablet`
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: ${spacing.sm};
    padding: 0 ${spacing.md};
    margin-top: ${spacing.sm};
  `};
`;

const PlaylistCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.darkestGrey};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    background-color: ${colors.darkGrey};
  }
`;

const PlaylistImageLink = styled(Link)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
`;

const PlaylistImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.darkGrey};
  ${Mixins.flexCenter};
  
  svg {
    width: 50px;
    height: 50px;
    color: ${colors.lightGrey};
  }
`;

const PlaylistInfo = styled.div`
  padding: ${spacing.md};
  text-align: center;
`;

const PlaylistName = styled(Link)`
  display: block;
  font-size: ${fontSizes.md};
  font-weight: 600;
  color: ${colors.white};
  margin-bottom: ${spacing.xs};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.lightGreen};
  }
`;

const TrackCount = styled.div`
  font-size: ${fontSizes.xs};
  color: ${colors.lightGrey};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AllPlaylists = () => {
  const [playlistData, setPlaylistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getPlaylists();
        setPlaylistData(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    catchErrors(fetchData());
  }, []);

  return (
    <PlaylistsPage>
      <Header />
      <MainStyle>
        <PageHeader>
          <h2>Your Library</h2>
        </PageHeader>
        
        {isLoading ? (
          <Loader />
        ) : (
          <PlaylistsGrid>
            {playlistData?.items.map(({ id, images, name, tracks }) => (
              <PlaylistCard key={id}>
                <PlaylistImageLink to={`/playlist/${id}`}>
                  {images.length ? (
                    <PlaylistImage src={images[0].url} alt={name} />
                  ) : (
                    <PlaceholderImage>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5zm12 0a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5z"/>
                      </svg>
                    </PlaceholderImage>
                  )}
                </PlaylistImageLink>
                
                <PlaylistInfo>
                  <PlaylistName to={`/playlist/${id}`}>
                    {name}
                  </PlaylistName>
                  <TrackCount>{tracks.total} Songs</TrackCount>
                </PlaylistInfo>
              </PlaylistCard>
            ))}
          </PlaylistsGrid>
        )}
      </MainStyle>
    </PlaylistsPage>
  );
};

export default AllPlaylists;