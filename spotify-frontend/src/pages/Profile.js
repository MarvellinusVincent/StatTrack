import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';
import { catchErrors } from '../utils';
import { getCurrentUserProfile, getTopArtists, getTopTracks } from '../utils/spotify';
import { Loader, TrackItem } from '../components';
import Header from './Header';

const { colors, fontSizes, spacing } = Theme;

const ProfileContainer = styled.div`
  background: linear-gradient(to bottom, ${colors.darkGrey} 0%, ${colors.actualBlack} 100%);
  min-height: 100vh;
`;

const Preview = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 50px;
  width: 100%;
  margin-top: 50px;
  ${Media.tablet`
    grid-template-columns: 1fr;
    grid-gap: 30px;
    margin-top: 30px;
  `};
`;

const Tracklist = styled.div`
  background: ${colors.darkestGrey};
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  }

  ${Media.tablet`
    &:last-of-type {
      margin-top: 30px;
    }
  `};
`;

const TracklistHeading = styled.div`
  ${Mixins.flexBetween};
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${colors.lightGrey};
  
  h3 {
    margin: 0;
    font-size: ${fontSizes.xxl};
    color: ${colors.white};
    font-weight: 700;
    letter-spacing: -0.5px;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
`;

const TopItem = styled(Link)`
  display: flex;
  width: 120px;
  height: 120px;
  background-image: url(${props => props.imageurl});
  background-size: cover;
  background-position: center;
  border-radius: ${props => props.type === 'artist' ? '50%' : '8px'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    
    &:before {
      opacity: 1;
    }
    
    &:nth-child(1) {
      transform: scale(1.05) translateX(-5px);
    }
    &:nth-child(3) {
      transform: scale(1.05) translateX(5px);
    }
  }

  &:nth-child(2) {
    width: 140px;
    height: 140px;
    z-index: 2;
  }

  ${Media.md`
    width: 90px;
    height: 90px;
    
    &:nth-child(2) {
      width: 110px;
      height: 110px;
    }
  `}
`;

const ArtistList = styled.ul`
  margin-top: 20px;
`;

const ArtistItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${colors.darkGrey};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ArtistImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: ${spacing.base};
  object-fit: cover;
`;

const ArtistName = styled(Link)`
  font-size: ${fontSizes.base};
  color: ${colors.white};
  font-weight: 500;
  flex-grow: 1;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${colors.lightGreen};
    text-decoration: none;
  }
`;

const MoreButton = styled(Link)`
  ${Mixins.button};
  background-color: transparent;
  border: 1px solid ${colors.lightGreen};
  color: ${colors.lightGreen};
  padding: 10px 25px;
  font-size: ${fontSizes.sm};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${colors.lightGreen};
    color: ${colors.actualBlack};
    transform: translateY(-2px);
  }
`;

const TrackListContainer = styled.div`
  margin-top: 20px;
  list-style-type: none;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: ${colors.lightGrey};
  text-align: center;
  
  svg {
    font-size: 50px;
    margin-bottom: 20px;
  }
`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile.data);

        const userTopArtists = await getTopArtists();
        setTopArtists(userTopArtists.data);

        const userTopTracks = await getTopTracks();
        setTopTracks(userTopTracks.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    catchErrors(fetchData());
  }, []);

  return (
    <ProfileContainer>
      {profile ? (
        <RealMain>
          <Header />
          <MainStyle>
            <Preview>
              <Tracklist>
                <TracklistHeading>
                  <h3>Top Artists</h3>
                  <MoreButton to="/artists">See More</MoreButton>
                </TracklistHeading>
                
                {topArtists ? (
                  <>
                    <TopContainer>
                      {topArtists.items.slice(0, 3).map((artist, i) => (
                        <TopItem
                          key={i}
                          to={`/artist/${artist.id}`}
                          imageurl={artist.images.length ? artist.images[0].url : ''}
                          type="artist"
                        />
                      ))}
                    </TopContainer>
                    
                    <ArtistList>
                      {topArtists.items.slice(0, 10).map((artist, i) => (
                        <ArtistItem key={i}>
                          {artist.images.length && (
                            <ArtistImage src={artist.images[2].url} alt={artist.name} />
                          )}
                          <ArtistName to={`/artist/${artist.id}`}>
                            {artist.name}
                          </ArtistName>
                        </ArtistItem>
                      ))}
                    </ArtistList>
                  </>
                ) : (
                  <EmptyState>
                    <Loader />
                    <p>Loading your top artists...</p>
                  </EmptyState>
                )}
              </Tracklist>

              <Tracklist>
                <TracklistHeading>
                  <h3>Top Tracks</h3>
                  <MoreButton to="/tracks">See More</MoreButton>
                </TracklistHeading>
                
                {topTracks ? (
                  <>
                    <TopContainer>
                      {topTracks.items.slice(0, 3).map((track, i) => (
                        <TopItem
                          key={i}
                          to={`/tracks/${track.id}`}
                          imageurl={track.album.images.length ? track.album.images[0].url : ''}
                          type="track"
                        />
                      ))}
                    </TopContainer>
                    
                    <TrackListContainer>
                      {topTracks.items.slice(0, 10).map((track, i) => (
                        <TrackItem track={track} key={i} />
                      ))}
                    </TrackListContainer>
                  </>
                ) : (
                  <EmptyState>
                    <Loader />
                    <p>Loading your top tracks...</p>
                  </EmptyState>
                )}
              </Tracklist>
            </Preview>
          </MainStyle>
        </RealMain>
      ) : (
        <Loader fullScreen />
      )}
    </ProfileContainer>
  );
};

export default Profile;