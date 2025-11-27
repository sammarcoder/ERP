// import { Auth0Client } from '@auth0/nextjs-auth0/server';

// export const auth0 = new Auth0Client();













import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: 'https://erp-system-api.com',
    scope: 'openid profile email offline_access'
  }
});
