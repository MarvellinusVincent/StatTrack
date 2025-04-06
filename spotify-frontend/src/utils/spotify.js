import axios from 'axios';

// Environment config
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 

// LocalStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

// Spotify API client
const spotifyApiClient = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject token
spotifyApiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
spotifyApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) { // Network error (no internet, etc.)
      return Promise.reject(error); 
    }
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken(); // Changed function name here
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return spotifyApiClient(originalRequest);
      }
      logout();
    }
    return Promise.reject(error);
  }
);

// Refresh token function (renamed to avoid conflict)
export const refreshAccessToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken); // Changed variable name
    if (!storedRefreshToken) {
      throw new Error('No refresh token');
    }

    const { data } = await axios.get(`${API_BASE_URL}/refresh_token`, {
      params: { refresh_token: storedRefreshToken }, // Changed variable name
    });

    if (data.access_token) {
      localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
      localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now().toString());
      
      if (data.refresh_token) {
        localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, data.refresh_token);
      }
      return data.access_token;
    }
  } catch (err) {
    console.error('Refresh token error:', err);
    logout();
    return null;
  }
};

// Get access token
export const getAccessToken = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const expiresIn = params.get('expires_in');
  const error = params.get('error');

  if (error) {
    console.error('Auth error:', error);
    logout();
    return null;
  }

  // Store new tokens from URL
  if (accessToken && expiresIn) {
    localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now().toString());
    localStorage.setItem(LOCALSTORAGE_KEYS.expireTime, expiresIn);
    
    if (refreshToken) {
      localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, refreshToken);
    }

    window.history.pushState({}, document.title, window.location.pathname);
    return accessToken;
  }

  // Check stored token
  const storedToken = localStorage.getItem(LOCALSTORAGE_KEYS.accessToken);
  const storedTimestamp = localStorage.getItem(LOCALSTORAGE_KEYS.timestamp);
  const storedExpireTime = localStorage.getItem(LOCALSTORAGE_KEYS.expireTime);

  if (storedToken && storedTimestamp && storedExpireTime) {
    const isExpired = (Date.now() - Number(storedTimestamp)) / 1000 > 
      (Number(storedExpireTime) * 0.9);
    return isExpired ? refreshAccessToken() : storedToken; // Changed function name here
  }

  return null;
};

// API methods
// User Data
export const getCurrentUserProfile = () => 
  spotifyApiClient.get('/me');

export const getCurrentUserPlaylists = (limit = 50) => 
  spotifyApiClient.get(`/me/playlists?limit=${limit}`);

export const getFollowing = () => 
  spotifyApiClient.get('/me/following?type=artist');

// Top Items
export const getTopArtists = (time_range = 'long_term') => 
  spotifyApiClient.get(`/me/top/artists?time_range=${time_range}&limit=50`);

export const getTopArtistsShort = () => 
  spotifyApiClient.get('/me/top/artists?time_range=short_term&limit=50');

export const getTopArtistsMedium = () => 
  spotifyApiClient.get('/me/top/artists?time_range=medium_term&limit=50');

export const getTopTracks = (time_range = 'long_term') => 
  spotifyApiClient.get(`/me/top/tracks?time_range=${time_range}&limit=50`);

export const getTopTracksShort = () => 
  spotifyApiClient.get('/me/top/tracks?time_range=short_term&limit=50');

export const getTopTracksMedium = () => 
  spotifyApiClient.get('/me/top/tracks?time_range=medium_term&limit=50');

// Playback History
export const getRecentlyPlayed = () => 
  spotifyApiClient.get('/me/player/recently-played?limit=50');

// Playlists
export const getPlaylists = () => 
  spotifyApiClient.get('/me/playlists?limit=50');

export const getPlaylist = (playlistId) => 
  spotifyApiClient.get(`/playlists/${playlistId}`);

export const addTrackToPlaylist = (playlistId, trackUri) => 
  spotifyApiClient.post(`/playlists/${playlistId}/tracks`, {
    uris: [trackUri],
    position: 0,
  });

export const removeTrackFromPlaylist = (playlistId, trackUri) => 
  spotifyApiClient.delete(`/playlists/${playlistId}/tracks`, {
    data: { tracks: [{ uri: trackUri }] },
  });

// Artists & Tracks
export const getArtist = (artistId) => 
  spotifyApiClient.get(`/artists/${artistId}`);

export const getTrack = (trackId) => 
  spotifyApiClient.get(`/tracks/${trackId}`);

export const getTrackInfo = async (trackId) => {
  const { data: track } = await getTrack(trackId);
  return { track };
};

// Authentication
export const logout = () => {
  Object.values(LOCALSTORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  window.location.href = window.location.origin;
};

// Initialize token
export const token = getAccessToken();