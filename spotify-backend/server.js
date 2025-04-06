require('dotenv').config();
const express = require('express');
const query_string = require('querystring');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URI, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST']
}));
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', apiLimiter);

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, FRONTEND_URI, PORT = 8888, NODE_ENV } = process.env;
const state_key = 'spotify_auth_state';

// Constants
const SCOPES = [
  'user-read-private', 'user-read-email', 
  'user-read-recently-played', 'user-top-read',
  'user-follow-read', 'user-follow-modify',
  'playlist-read-private', 'playlist-read-collaborative',
  'playlist-modify-public', 'playlist-modify-private',
  'user-modify-playback-state'
].join(' ');

const generateRandomString = (length) => {
  return require('crypto').randomBytes(length)
    .toString('base64')
    .replace(/[+/]/g, '')
    .substring(0, length);
};

const getFrontendUrl = () => NODE_ENV === 'production' 
  ? FRONTEND_URI 
  : 'http://localhost:3000';

  app.get('/login', (req, res) => {
    const state = generateRandomString(32);
    res.cookie(state_key, state, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600000 // 10 minutes
    });
    
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('scope', SCOPES);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('prompt', 'login');
    
    res.redirect(authUrl.toString());
  });

app.get('/callback', async (req, res) => {
  try {
    const { code, state, error: spotifyError } = req.query;
    const storedState = req.cookies[state_key];
    
    if (spotifyError) {
      return redirectWithError(res, spotifyError);
    }
    
    if (!state || !storedState || state !== storedState) {
      return redirectWithError(res, 'state_mismatch');
    }
    
    res.clearCookie(state_key);
    
    if (!code) {
      return redirectWithError(res, 'missing_auth_code');
    }
    
    const tokenResponse = await exchangeCodeForTokens(code);
    
    res.redirect(`${getFrontendUrl()}/#${query_string.stringify({
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_in: tokenResponse.expires_in
    })}`);
    
  } catch (error) {
    console.error('Callback error:', error);
    redirectWithError(res, 'authentication_failed');
  }
});

async function exchangeCodeForTokens(code) {
  const response = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: query_string.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI
      // Add PKCE: code_verifier: storedCodeVerifier
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  });
  
  if (response.status !== 200) {
    throw new Error(`Spotify API returned status ${response.status}`);
  }
  
  return response.data;
}

function redirectWithError(res, error) {
  res.redirect(`${getFrontendUrl()}/#${query_string.stringify({ error })}`);
}

app.get('/refresh_token', apiLimiter, async (req, res) => {
  try {
    const { refresh_token } = req.query;
    
    if (!refresh_token) {
      return res.status(400).json({ error: 'refresh_token_required' });
    }
    
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: query_string.stringify({
        grant_type: 'refresh_token',
        refresh_token
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Refresh token error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'token_refresh_failed',
      details: error.response?.data || error.message 
    });
  }
});

// Production static files
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});