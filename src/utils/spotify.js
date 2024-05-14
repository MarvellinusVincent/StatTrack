import axios from 'axios';
import { getParams } from '.';

const EXPIRED_TIME = 3600;

const setTokenTimestamp = () => window.localStorage.setItem('spotify_token_timestamp', Date.now());
const setAccessToken = token => {
  setTokenTimestamp();
  window.localStorage.setItem('spotify_access_token', token);
};
const setRefreshToken = token => window.localStorage.setItem('spotify_refresh_token', token);
const getTokenTimestamp = () => window.localStorage.getItem('spotify_token_timestamp');
const getStoredAccessToken = () => window.localStorage.getItem('spotify_access_token');
const getStoredRefreshToken = () => window.localStorage.getItem('spotify_refresh_token');

const refreshToken = async() => {
  try {
    const { data } = await axios.get(`/refresh_token?refresh_token=${getStoredRefreshToken()}`);
    const { access_token } = data;
    setAccessToken(access_token);
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
};

const getAccessToken = () => {
  console.log("Getting access token...");
  const { error, access_token, refresh_token } = getParams();
  if (error) {
    refreshToken();
  }

  if (Date.now() - getTokenTimestamp() > EXPIRED_TIME) {
    console.warn('Access token has expired, refreshing...');
    refreshToken();
  }

  const localAccessToken = getStoredAccessToken();

  if ((!localAccessToken || localAccessToken === 'undefined') && access_token) {
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    return access_token;
  }

  return localAccessToken;
};

export const token = getAccessToken();

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${token}`;
axios.defaults.headers['Content-Type'] = 'application/json';

export const getCurrentUserProfile = () => axios.get('/me');

export const getCurrentUserPlaylists = (limit = 50) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

export const getTopArtists = (time_range = 'long_term') => {
  return axios.get(`/me/top/artists?time_range=${time_range}&limit=50`);
};

export const getTopArtistsShort = (time_range = 'short_term') => {
  return axios.get(`/me/top/artists?time_range=${time_range}&limit=50`);
};

export const getTopArtistsMedium = (time_range = 'medium_term') => {
  return axios.get(`/me/top/artists?time_range=${time_range}&limit=50`);
};

export const getTopSongs = (time_range = 'long_term') => {
  return axios.get(`/me/top/tracks?time_range=${time_range}&limit=50`);
};

export const getTopSongsShort = (time_range = 'short_term') => {
  return axios.get(`/me/top/tracks?time_range=${time_range}&limit=50`);
};

export const getTopSongsMedium = (time_range = 'medium_term') => {
  return axios.get(`/me/top/tracks?time_range=${time_range}&limit=50`);
};

export const getFollowing = () =>
  axios.get('/me/following?type=artist');

export const getRecentlyPlayed = () =>
  axios.get('/me/player/recently-played?limit=50')

export const getPlaylists = () =>
  axios.get('/me/playlists?limit=50')

export const getArtist = artistId =>
  axios.get(`/artists/${artistId}`);

export const getPlaylist = playlistId =>
  axios.get(`/playlists/${playlistId}`);

export const getMultipleTrackAudioFeatures = ids =>
  axios.get(`/audio-features?ids=${ids}`);

export const getTrackAudioFeatures = trackId =>
  axios.get(`/audio-features/${trackId}`);

const getTrackIds = tracks => tracks.map(({ track }) => track.id).join(',');

export const getRecommendationsForTracks = tracks => {
  const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
  const seed_tracks = getTrackIds(shuffledTracks.slice(0, 5));
  const seed_artists = '';
  const seed_genres = '';
  return axios.get(`/recommendations?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}&seed_genres=${seed_genres}`);
};

export const addTrackToPlaylist = (playlistId, uris) => {
  const data = {
    position: 0
  }
  axios.post(`/playlists/${playlistId}/tracks?uris=spotify:track:${uris}`, data);
};

export const getTrack = trackId =>
  axios.get(`/tracks/${trackId}`);

export const getTrackAudioAnalysis = trackId =>
  axios.get(`/audio-analysis/${trackId}`);

export const getTrackInfo = trackId =>
  axios
    .all([getTrack(trackId), getTrackAudioAnalysis(trackId), getTrackAudioFeatures(trackId)])
    .then(
      axios.spread((track, audioAnalysis, audioFeatures) => ({
        track: track.data,
        audioAnalysis: audioAnalysis.data,
        audioFeatures: audioFeatures.data,
      })),
    );

export const playTrack = trackId => {
  const data = {
    uris: [
      `spotify:track:${trackId}`
    ]
  }
  axios.put(`/me/player/play`, data);
};

export const logout = () => {
  window.localStorage.removeItem('spotify_token_timestamp');
  window.localStorage.removeItem('spotify_access_token');
  window.localStorage.removeItem('spotify_refresh_token');
  window.location.reload();
};