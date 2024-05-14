import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';

import { catchErrors } from '../utils';
import { getCurrentUserProfile, getTopArtists, getTopSongs } from '../utils/spotify';

import styled from 'styled-components';
import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';

import { Loader, TrackItem } from '../components';

import Header from './Header';

const { colors, fontSizes, spacing } = Theme;

const Preview = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 70px;
  width: 100%;
  margin-top: 100px;
  ${Media.tablet`
    display: block;
    margin-top: 70px;
  `};
`;

const Tracklist = styled.div`
  ${Media.tablet`
    &:last-of-type {
      margin-top: 50px;
    }
  `};
`;

const TracklistHeading = styled.div`
  ${Mixins.flexBetween};
  margin-bottom: 40px;
  h3 {
    display: inline-block;
    margin: 0;
    font-size: 28px;
  }
`;

const TrackListContent = styled.div`
  margin-bottom: 40px;
  background-color: ${colors.darkestGrey};
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
  border-radius:3%;
`;

const MoreButton = styled(Link)`
  ${Mixins.button};
  text-align: center;
  white-space: nowrap;
  ${Media.phablet`
    padding: 11px 20px;
    font-sizes: ${fontSizes.xs};
  `};
`;

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
  svg {
    width: 25px;
  }
`;

const Artist = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover,
  &:focus {
    ${Cover} {
      opacity: 1;
    }
    background-color: #2a2a2a;
  }
`;

const ArtistDetailContainer = styled.div`
  align-items: center;
  justify-content: center;
  padding-bottom: 8px;
`

const ArtistArtwork = styled(Link)`
  display: inline-block;
  position: relative;
  width: 60px;
  min-width: 50px;
  margin-right: ${spacing.base};
  img {
    width: 60px;
    min-width: 50px;
    height: 60px;
    margin-right: ${spacing.base};
    border-radius: 100%;
  }
`;

const ArtistName = styled(Link)`
  flex-grow: 1;
  span {
    border-bottom: 1px solid transparent;
    &:hover,
    &:focus {
      border-bottom: 1px solid ${colors.white};
    }
  }
`;

const TopContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  img {
    border-radius: 8px;
  }
`;

const TopArtistContainer = styled(Link)`
  display: flex;
  width: 13rem;
  height: 13rem;
  background-image: url(${props => props.imageurl});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.3s, opacity 0.3s, box-shadow 0.3s;
  z-index: 1;
  position: relative;
  margin-right: -2.5rem;
  margin-left: -2.5rem;
  
  &:hover,
  &:focus {
    &:nth-child(1) {
      transform: scale(1.1) translateX(-9px) rotate(-4deg);
    }
    &:nth-child(2) {
      transform: scale(1.1);
    }
    &:nth-child(3) {
      transform: scale(1.1) translateX(9px) rotate(4deg);
    }
  }

  ${Media.md`
    width: 9rem;
    height: 9rem;
  `}

  &:nth-child(2) {
    z-index: 2;
    width: 14rem;
    height: 14rem;
  }
`;

const TopTrackContainer = styled(Link)`
  display: inline-block;
  width: 13rem; 
  height: 13rem;
  background-image: url(${props => props.imageurl});
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.3s, opacity 0.3s, box-shadow 0.3s;
  z-index: 1;
  position:relative;
  margin-right: -2.5rem;
  margin-left: -2.5rem;

  &:hover,
  &:focus {
    &:nth-child(1) {
      transform: scale(1.1) translateX(-9px) rotate(-4deg);
    }
    &:nth-child(2) {
      transform: scale(1.1);
    }
    &:nth-child(3) {
      transform: scale(1.1) translateX(9px) rotate(4deg);
    }
  }

  ${Media.md`
    width: 9rem;
    height: 9rem;
  `}

  &:nth-child(2) {
    z-index: 2;
    width: 14rem;
    height: 14rem;
  }

  img {
    border-radius: 8px;
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

        const userTopTracks = await getTopSongs();
        setTopTracks(userTopTracks.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    catchErrors(fetchData());
  }, []);

  return (
    <React.Fragment>
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
                <TrackListContent>
                  {topArtists ? (
                      <TopContainer>
                        <TopArtistContainer
                          to={`/artist/${topArtists.items[1].id}`}
                          imageurl={topArtists.items[1].images.length ? topArtists.items[1].images[0].url : ''}
                        />
                        <TopArtistContainer
                          to={`/artist/${topArtists.items[0].id}`}
                          imageurl={topArtists.items[0].images.length ? topArtists.items[0].images[0].url : ''}
                        />
                        <TopArtistContainer
                          to={`/artist/${topArtists.items[2].id}`}
                          imageurl={topArtists.items[2].images.length ? topArtists.items[2].images[0].url : ''}
                        />
                      </TopContainer>
                    ) : (
                      <Loader />
                    )}
                    {topArtists ? (
                      <ul>
                        {topArtists.items.slice(0, 10).map((artist, i) => (
                            <ArtistDetailContainer>
                              <Artist key={i}>
                                <ArtistArtwork to={`/artist/${artist.id}`}>
                                  {artist.images.length && <img src={artist.images[2].url} alt="Artist" />}
                                </ArtistArtwork>
                                <ArtistName to={`/artist/${artist.id}`}>
                                  <span>{artist.name}</span>
                                </ArtistName>
                              </Artist>
                            </ArtistDetailContainer>
                        ))}
                      </ul>
                    ) : (
                      <Loader />
                    )}
                </TrackListContent>
              </Tracklist>

              <Tracklist>
                <TracklistHeading>
                  <h3>Top Songs</h3>
                  <MoreButton to="/tracks">See More</MoreButton>
                </TracklistHeading>
                <TrackListContent>
                {topTracks ? (
                  <TopContainer>
                    <TopTrackContainer
                      to={`/track/${topTracks.items[0].id}`}
                      imageurl={topTracks.items[1].album.images.length ? topTracks.items[1].album.images[0].url : ''}
                    >
                      <img src={topTracks.items[1].album.images.length ? topTracks.items[1].album.images[0].url : ''} alt="Track" />
                    </TopTrackContainer>
                    <TopTrackContainer
                      to={`/track/${topTracks.items[1].id}`}
                      imageurl={topTracks.items[0].album.images.length ? topTracks.items[0].album.images[0].url : ''}
                    >
                      <img src={topTracks.items[0].album.images.length ? topTracks.items[0].album.images[0].url : ''} alt="Track" />
                    </TopTrackContainer>
                    <TopTrackContainer
                      to={`/track/${topTracks.items[2].id}`}
                      imageurl={topTracks.items[2].album.images.length ? topTracks.items[2].album.images[0].url : ''}
                    >
                      <img src={topTracks.items[2].album.images.length ? topTracks.items[2].album.images[0].url : ''} alt="Track" />
                    </TopTrackContainer>
                  </TopContainer>
                ) : (
                  <Loader /> 
                )}
                  {topTracks ? (
                    <ul>
                      {topTracks.items.slice(0, 10).map((track, i) => (
                        <TrackItem track={track} key={i} />
                      ))}
                    </ul>
                  ) : (
                    <Loader />
                  )}
                </TrackListContent>
              </Tracklist>
            </Preview>
          </MainStyle>
        </RealMain>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default Profile;
