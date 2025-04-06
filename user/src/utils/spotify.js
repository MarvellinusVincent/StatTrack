import axios from 'axios';

const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

const expiredToken = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) return false;
  const millisecondsElapsed = Date.now() - Number(timestamp);
  const secondsElapsed = millisecondsElapsed / 1000;
  return secondsElapsed > Number(expireTime);
};

export const refreshToken = async () => {
  try {
    if (!LOCALSTORAGE_VALUES.refreshToken) {
      console.error('No refresh token available');
      logout();
      return;
    }

    // Determine the base URL based on environment
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:8888' 
      : '';

    const { data } = await axios.get(
      `${baseUrl}/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (data.access_token) {
      window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now().toString());
      
      // Only reload if we got a new refresh token
      if (data.refresh_token) {
        window.localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, data.refresh_token);
        window.location.reload();
      }
      return data.access_token;
    }
    
    throw new Error('No access token in response');
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    // Specific handling for different error cases
    if (error.response?.status === 400) {
      console.error('Invalid refresh token - logging out');
    } else if (error.response?.status === 401) {
      console.error('Refresh token revoked - logging out');
    }
    
    logout();
    return null;
  }
};


const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
  };
  const hasError = urlParams.get('error');

  if (hasError || expiredToken() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
    refreshToken();
    return false;  // Prevent further code execution if the token is invalid
  }

  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  return false;
};


export const token = getAccessToken();

if (token) {
  axios.defaults.baseURL = 'https://api.spotify.com/v1';
  axios.defaults.headers.common = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
} else {
  console.error('Token is not available');
}


axios.defaults.baseURL = 'https://api.spotify.com/v1';
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

axios.defaults.headers.common = headers;

export const getCurrentUserProfile = () => {
  return axios.get('/me');
};

export const getCurrentUserPlaylists = (limit = 50) => {
  console.log('getCurrentUserPlaylists parameters:', limit);
  return axios.get(`/me/playlists?limit=${limit}`);
};

export const getTopArtists = (time_range = 'long_term') => {
  console.log('getTopArtists parameters:', time_range);
  return axios.get(`/me/top/artists?time_range=${time_range}&limit=50`);
};

export const getTopArtistsShort = (time_range = 'short_term') => {
  console.log('getTopArtistsShort parameters:', time_range);
  return axios.get(`/me/top/artists?time_range=${time_range}&limit=50`);
};

export const getTopArtistsMedium = (time_range = 'medium_term') => {
  console.log('getTopArtistsMedium parameters:', time_range);
  return axios.get(`/me/top/artists?time_range=${time_range}&limit=50`);
};

export const getTopSongs = (time_range = 'long_term') => {
  console.log('getTopSongs parameters:', time_range);
  return axios.get(`/me/top/tracks?time_range=${time_range}&limit=50`);
};

export const getTopSongsShort = (time_range = 'short_term') => {
  console.log('getTopSongsShort parameters:', time_range);
  return axios.get(`/me/top/tracks?time_range=${time_range}&limit=50`);
};

export const getTopSongsMedium = (time_range = 'medium_term') => {
  console.log('getTopSongsMedium parameters:', time_range);
  return axios.get(`/me/top/tracks?time_range=${time_range}&limit=50`);
};

export const getFollowing = () => {
  return axios.get('/me/following?type=artist');
};

export const getRecentlyPlayed = () => {
  return axios.get('/me/player/recently-played?limit=50');
};

export const getPlaylists = () => {
  return axios.get('/me/playlists?limit=50');
};

export const getArtist = artistId => {
  console.log('getArtist parameters:', artistId);
  return axios.get(`/artists/${artistId}`);
};

export const getPlaylist = playlistId => {
  console.log('getPlaylist parameters:', playlistId);
  return axios.get(`/playlists/${playlistId}`);
};


export const addTrackToPlaylist = (playlistId, uris) => {
  console.log('addTrackToPlaylist parameters:', playlistId, uris);
  const data = {
    position: 0
  };
  axios.post(`/playlists/${playlistId}/tracks?uris=spotify:track:${uris}`, data);
};

export const getTrack = trackId => {
  console.log('getTrack parameters:', trackId);
  return axios.get(`/tracks/${trackId}`);
};

const getTrackIds = tracks => tracks.map(({ track }) => track.id).join(',');

export const getTrackInfo = trackId => {
  console.log('getTrackInfo parameters:', trackId);
  return axios
    .all([getTrack(trackId)])
    .then(
      axios.spread((track) => ({
        track: track.data,
      })),
    );
};

export const removeTrackFromPlaylist = (playlistId, uris) => {
  console.log('removeTrackFromPlaylist parameters:', playlistId, uris);
  const trackUris = Array.isArray(uris) ? uris : [uris];

  const data = {
    tracks: trackUris.map(uri => ({
      uri: `spotify:track:${uri}`
    }))
  };
  console.log('Track IDs from spotify.js:', trackUris);
  console.log('Playlist ID from spotify.js:', playlistId);
  console.log('Data:', data);
  axios.post(`/playlists/${playlistId}/tracks`, data);
};

export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  window.location = window.location.origin;
};