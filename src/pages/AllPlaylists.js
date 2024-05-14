import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';

import { getPlaylists } from '../utils/spotify';
import { catchErrors } from '../utils';

import { Loader } from '../components';

import styled from 'styled-components';
import { Theme, Mixins, Media, MainStyle, RealMain } from '../styles';

import Header from './Header';

const { colors, fontSizes, spacing } = Theme;

const HeaderStyle = styled.header`
  h2 {
    margin: 0;
  }
  margin-top: 58px;
`;

const Wrap = styled.div`
  ${Mixins.flexBetween};
  align-items: flex-start;
`;

const PlaylistsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: ${spacing.md};
  width: 100%;
  margin-top: 50px;
  ${Media.tablet`
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  `};
  ${Media.phablet`
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  `};
`;

const PlaylistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: ${colors.actualBlack};
  border-radius: 5%;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.darkGrey};
  }
`;

const PlaylistImage = styled.img`
  object-fit: cover;
  width: 200px;
  height: 200px;
  border-radius: ${Theme.borderRadius} ${Theme.borderRadius} 0 0;
  margin-top: 10px;
`;

const PlaylistLink = styled(Link)`
  ${Mixins.coverShadow};
  position: relative;
  width: 100%;
  margin-bottom: ${spacing.base};
`;

const PlaceholderPicture = styled.div`
  ${Mixins.flexCenter};
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: ${colors.darkGrey};
  svg {
    width: 50px;
    height: 50px;
  }
`;

const PlaceholderContent = styled.div`
  ${Mixins.flexCenter};
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const PlaylistNameLink = styled(Link)`
  display: inline;
  border-bottom: 1px solid transparent;
  color: ${colors.lightGrey};
  transition: color 0.3s ease;
  &:hover,
  &:focus {
    border-bottom: 1px solid ${colors.white};
    color: ${colors.white};
  }
`;

const TotalTracks = styled.div`
  text-transform: uppercase;
  margin: 5px 0;
  color: ${colors.lightGrey};
  font-size: ${fontSizes.xs};
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

const AllPlaylists = () => {
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylists();
      setPlaylistData(data);
    };
    catchErrors(fetchData());
  }, []);

  return (
    <RealMain>
      <Header />
      <MainStyle>
        <HeaderStyle>
          <h2>Your Library</h2>
          <Wrap>
            <PlaylistsContainer>
              {playlistData ? (
                playlistData.items.map(({ id, images, name, tracks }, i) => (
                  <PlaylistWrapper key={i}>
                    <PlaylistLink to={id}>
                      {images.length ? (
                        <PlaylistImage src={images[0].url} alt="Album Art" />
                      ) : (
                        <PlaceholderPicture>
                          <PlaceholderContent></PlaceholderContent>
                        </PlaceholderPicture>
                      )}
                    </PlaylistLink>
                    <div>
                      <PlaylistNameLink to={id}>{name}</PlaylistNameLink>
                      <TotalTracks>{tracks.total} Songs</TotalTracks>
                    </div>
                  </PlaylistWrapper>
                ))
              ) : (
                <Loader />
              )}
            </PlaylistsContainer>
          </Wrap>
        </HeaderStyle>
      </MainStyle>
    </RealMain>
  );
};

export default AllPlaylists;
