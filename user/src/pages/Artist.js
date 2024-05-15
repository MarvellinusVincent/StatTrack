import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { formatWithCommas, catchErrors } from '../utils';
import { getArtist } from '../utils/spotify';

import { Loader } from '../components';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';

import { Theme, Mixins, Media, MainStyle } from '../styles';

const { colors, fontSizes, spacing } = Theme;

const ArtistContainer = styled(MainStyle)`
  ${Mixins.flexCenter};
  flex-direction: column;
  height: 100%;
  text-align: center;
`;

const PictureLink = styled.a`
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: ${spacing.md};
  box-shadow: 0 10px 30px -15px ${colors.shadow};
  transition: transform 0.3s ease-in-out;
  img {
    width: 300px;
    height: 300px;
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

const ArtistNameLink = styled.a`
  font-size: 70px;
  margin-top: ${spacing.md};
  ${Media.tablet`
    font-size: 7vw;
  `};
  &:hover,
  &:focus {
    color: ${colors.green};
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  margin-top: ${spacing.md};
  text-align: center;
`;

const Number = styled.div`
  color: ${colors.green};
  font-weight: 700;
  font-size: ${fontSizes.lg};
  text-transform: capitalize;
  ${Media.tablet`
    font-size: ${fontSizes.md};
  `};
`;

const Genre = styled.div`
  font-size: ${fontSizes.md};
`;

const NumLabel = styled.p`
  color: ${colors.lightGrey};
  font-size: ${fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: ${spacing.xs};
`;

const Artist = props => {
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getArtist(artistId);
      setArtistData(data);
    };

    catchErrors(fetchData());
  }, [artistId]);

  return (
    <React.Fragment>
      {artistData ? (
        <ArtistContainer>
          <PictureLink href={artistData.uri} target="_blank">
            <img src={artistData.images[0].url} alt="Artist Picture" />
          </PictureLink>
          <div>
            <ArtistNameLink>{artistData.name}</ArtistNameLink>
            <Stats>
              <div>
                <Number>{formatWithCommas(artistData.followers.total)}</Number>
                <NumLabel>Followers</NumLabel>
              </div>
              {artistData.genres && (
                <div>
                  <Number>
                    {artistData.genres.map(genre => (
                      <Genre key={genre}>{genre}</Genre>
                    ))}
                  </Number>
                  <NumLabel>Genres</NumLabel>
                </div>
              )}
              {artistData.popularity && (
                <div>
                  <Number>{artistData.popularity}%</Number>
                  <NumLabel>Popularity</NumLabel>
                </div>
              )}
            </Stats>
          </div>
        </ArtistContainer>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

Artist.propTypes = {
  artistId: PropTypes.string,
};

export default Artist;
