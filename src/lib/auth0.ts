// lib/auth0.ts
import { Auth0Client, filterDefaultIdTokenClaims } from "@auth0/nextjs-auth0/server";

const NAMESPACE = 'https://erp-system-api.com/'; 

export const auth0 = new Auth0Client({
  // ... existing configuration ...

  afterCallback: async (session) => {
    const customClaims = filterDefaultIdTokenClaims(session.user, [
      `${NAMESPACE}roles`,
      `${NAMESPACE}permissions`,
    ]);
    return { ...session, user: customClaims };
  },
});
