import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { catchErrors } from '../utils';
import { getCurrentUserProfile, getCurrentUserPlaylists, getFollowing, logout } from '../utils/spotify';

import styled from 'styled-components';
import { Theme, Media } from '../styles';

import UserIcon from '../assets/icons/user.png';

const { colors, fontSizes, spacing } = Theme;

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  padding: 80px;
  background-color: ${colors.mediumGrey};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarLink = styled.a`
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: ${spacing.md};
  box-shadow: 0 10px 30px 1px ${colors.shadow};
  transition: transform 0.3s ease-in-out;
  img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
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

const NoAvatar = styled.div`
  border: 2px solid currentColor;
  border-radius: 100%;
  padding: ${spacing.md};
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 30px;
`;

const RightSection = styled.div`
  margin-left: auto;
  text-align: right;
  align-self: flex-start;
`;

const UserNameLink = styled.a`
  &:hover,
  &:focus {
    color: ${colors.lightGreen};
  }
  margin-bottom: 5px;
`;

const Name = styled.h1`
  font-size: 80px;
  font-weight: 700;
  margin: 20px 0 0;
  ${Media.tablet`
    font-size: 40px;
  `};
  ${Media.phablet`
    font-size: 8vw;
  `};
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Stat = styled.div`
  text-align: center;
  margin-right: 20px;
`;

const Number = styled.div`
  color: ${colors.green};
  font-weight: 700;
  font-size: ${fontSizes.xs};
`;

const NumLabel = styled.p`
  color: ${colors.lightGrey};
  font-size: ${fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: ${spacing.xs};
`;

const LogoutButton = styled.a`
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
  
    const totalPlaylists = userPlaylists ? userPlaylists.total : 0;
  
    return (
        <Wrapper>
        {userProfile && (
            <>
            <LeftSection>
                <AvatarLink href={userProfile.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                {userProfile.images.length > 0 ? (
                    <img src={userProfile.images[0].url} alt="avatar" />
                ) : (
                    <NoAvatar>
                        <img src={UserIcon} alt="User" />
                    </NoAvatar>
                )}
                </AvatarLink>
            </LeftSection>
            <MiddleSection>
                <UserNameLink href={userProfile.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <Name>{userProfile.display_name}</Name>
                </UserNameLink>
                <Stats>
                <Stat>
                    <Number>{userProfile.followers.total}</Number>
                    <NumLabel>Followers</NumLabel>
                </Stat>
                {userFollowing && (
                    <Stat>
                    <Number>{userFollowing.artists.items.length}</Number>
                    <NumLabel>Following</NumLabel>
                    </Stat>
                )}
                {totalPlaylists && (
                    <Stat>
                        <Link to="/playlists">
                            <Number>{totalPlaylists}</Number>
                            <NumLabel>Playlists</NumLabel>
                        </Link>
                    </Stat>
                )}
                </Stats>
            </MiddleSection>
            <RightSection>
                <LogoutButton onClick={logout}>Logout</LogoutButton>
            </RightSection>
            </>
        )}
        </Wrapper>
    );
};

export default Header;
