import axios from 'axios';

export const getGoogleTokens = async (code, clientId, clientSecret, redirectUri) => {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  return response.data;
};

export const getGoogleUserInfo = async (accessToken) => {
  const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.data;
};
