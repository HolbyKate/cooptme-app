export const CONFIG = {
  API_URL: 'http://192.168.31.149:3000/api',
  AUTH_CONFIG: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || '',
  },
};