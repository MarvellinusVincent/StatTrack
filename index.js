require('dotenv').config()

const express = require('express');
const query_string = require('querystring');
const axios = require('axios');
const path = require('path');

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

const state_key = 'spotify_auth_state';

app.use(express.static(path.resolve(__dirname, './user/build')));
const isProduction = process.env.VERCEL_ENV === 'production';

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

app.get('/login', (req, res) => {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-modify-playback-state';
    res.cookie(state_key, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
        query_string.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state
    }));
});

app.get('/callback', async (req, res) => {
  try {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[state_key] : null;

    // Validate state
    if (!state || state !== storedState) {
      res.redirect(`/#${query_string.stringify({ error: 'state_mismatch' })}`);
      return;
    }

    // Clear state cookie
    res.clearCookie(state_key);

    // Request tokens from Spotify
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: query_string.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    if (tokenResponse.status === 200) {
      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      
      // Set query params for frontend
      const queryParams = query_string.stringify({
        access_token,
        refresh_token,
        expires_in
      });

      // Determine redirect URL based on environment
      const frontendUrl = process.env.VERCEL_ENV === 'production'
        ? process.env.FRONTEND_URI
        : 'http://localhost:3000';

      res.redirect(`${frontendUrl}/?${queryParams}`);
    } else {
      throw new Error(`Spotify API returned status ${tokenResponse.status}`);
    }
  } catch (error) {
    console.error('Callback error:', error);
    
    // Determine redirect URL based on environment
    const frontendUrl = process.env.VERCEL_ENV === 'production'
      ? process.env.FRONTEND_URI
      : 'http://localhost:3000';
    
    res.redirect(`${frontendUrl}/#${query_string.stringify({ 
      error: 'invalid_token' 
    })}`);
  }
});

app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;
    
    if (!refresh_token) {
        return res.status(400).json({ error: 'Refresh token missing' });
    }

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: query_string.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Refresh token error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to refresh token' });
      });
});

app.listen(PORT, () => {
    console.log(`Port listened on ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});