import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Theme, Mixins, Media } from '../styles';
import { catchErrors } from '../utils';
import { getCurrentUserProfile, getCurrentUserPlaylists, getFollowing, logout } from '../utils/spotify';
import UserIcon from '../assets/icons/user.png';

const { colors, fontSizes } = Theme;

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  padding: 60px 80px;
  background: linear-gradient(to right, ${colors.darkGrey} 0%, ${colors.mediumGrey} 100%);
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
    padding: 40px 30px;
    text-align: center;
  `};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  z-index: 1;
  
  ${Media.tablet`
    margin-bottom: 30px;
  `};
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  }

  ${Media.tablet`
    width: 150px;
    height: 150px;
  `};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.darkestGrey};
  
  img {
    width: 60%;
    height: 60%;
    opacity: 0.7;
  }
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  z-index: 1;
  flex-grow: 1;
  
  ${Media.tablet`
    margin-left: 0;
    align-items: center;
    width: 100%;
  `};
`;

const ProfileName = styled.h1`
  font-size: 5.5rem;
  font-weight: 900;
  margin: 0;
  color: ${colors.white};
  letter-spacing: -2px; 
  line-height: 1;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  margin-bottom: 10px;
  word-break: break-word;
  
  ${Media.desktop`
    font-size: 4.5rem;
  `}
  
  ${Media.tablet`
    font-size: 3.5rem;
    letter-spacing: -1px;
  `}
  
  ${Media.phablet`
    font-size: 2.5rem;
  `}
  
  ${Media.phone`
    font-size: 2rem;
  `}
`;

const StatsContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 30px;
  
  ${Media.phablet`
    gap: 20px;
  `};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const StatNumber = styled(Link)`
  font-size: ${fontSizes.lg};
  font-weight: 700;
  color: ${colors.lightGreen};
  margin-bottom: 5px;
  text-decoration: none;
  
  &:hover {
    color: ${colors.white};
  }
`;

const StatLabel = styled.span`
  font-size: ${fontSizes.xs};
  color: ${colors.lightGrey};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RightSection = styled.div`
  margin-left: auto;
  z-index: 1;
  align-self: flex-start;
  
  ${Media.tablet`
    margin: 30px 0 0;
    align-self: center;
  `};
`;

const LogoutButton = styled.button`
  ${Mixins.button};
  background-color: transparent;
  border: 2px solid ${colors.lightGreen};
  color: ${colors.lightGreen};
  padding: 12px 30px;
  font-size: ${fontSizes.sm};
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${colors.lightGreen};
    color: ${colors.actualBlack};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 229, 157, 0.3);
  }
`;

const Header = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [userFollowing, setUserFollowing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getCurrentUserProfile();
        setUserProfile(profileData.data);

        const playlistsData = await getCurrentUserPlaylists();
        setUserPlaylists(playlistsData.data);

        const followingData = await getFollowing();
        setUserFollowing(followingData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    catchErrors(fetchData());
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const totalPlaylists = userPlaylists ? userPlaylists.total : 0;
  const followingCount = userFollowing ? userFollowing.artists.items.length : 0;

  return (
    <HeaderWrapper>
      {userProfile && (
        <>
          <LeftSection>
            <AvatarContainer as={userProfile.external_urls.spotify ? 'a' : 'div'}
              href={userProfile.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer">
              {userProfile.images.length > 0 ? (
                <AvatarImage src={userProfile.images[0].url} alt="avatar" />
              ) : (
                <DefaultAvatar>
                  <img src={UserIcon} alt="User" />
                </DefaultAvatar>
              )}
            </AvatarContainer>
          </LeftSection>

          <MiddleSection>
            <ProfileName as={userProfile.external_urls.spotify ? 'a' : 'div'}
              href={userProfile.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer">
              {userProfile.display_name}
            </ProfileName>

            <StatsContainer>
              <StatItem>
                <StatNumber to="#" onClick={(e) => e.preventDefault()}>
                  {userProfile.followers.total.toLocaleString()}
                </StatNumber>
                <StatLabel>Followers</StatLabel>
              </StatItem>

              <StatItem>
                <StatNumber to="#" onClick={(e) => e.preventDefault()}>
                  {followingCount.toLocaleString()}
                </StatNumber>
                <StatLabel>Following</StatLabel>
              </StatItem>

              <StatItem>
                <StatNumber to="/playlists">
                  {totalPlaylists.toLocaleString()}
                </StatNumber>
                <StatLabel>Playlists</StatLabel>
              </StatItem>
            </StatsContainer>
          </MiddleSection>

          <RightSection>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </RightSection>
        </>
      )}
    </HeaderWrapper>
  );
};

export default Header;