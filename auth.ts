// import NextAuth from "next-auth"
// import Keycloak from "next-auth/providers/keycloak"
// import { JWT } from "next-auth/jwt"

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string
//     idToken?: string
//     user: {
//       id: string
//       name?: string | null
//       email?: string | null
//       image?: string | null
//       roles?: string[]
//       resourceAccess?: Record<string, any>
//     }
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     accessToken?: string
//     idToken?: string
//     refreshToken?: string
//     roles?: string[]
//     resourceAccess?: Record<string, any>
//   }
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     Keycloak({
//       clientId: process.env.AUTH_KEYCLOAK_ID!,
//       clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
//       issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
//     })
//   ],
//   callbacks: {
//     async jwt({ token, account }): Promise<JWT> {
//       if (account) {
//         token.accessToken = account.access_token
//         token.idToken = account.id_token
//         token.refreshToken = account.refresh_token
        
//         // Extract roles from Keycloak token
//         if (account.access_token) {
//           try {
//             const payload = JSON.parse(
//               Buffer.from(account.access_token.split('.')[1], 'base64').toString()
//             )
//             token.roles = payload.realm_access?.roles || []
//             token.resourceAccess = payload.resource_access || {}
//           } catch (error) {
//             console.error('Error parsing access token:', error)
//             token.roles = []
//           }
//         }
//       }
//       return token
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken
//       session.idToken = token.idToken
//       session.user.roles = token.roles
//       session.user.resourceAccess = token.resourceAccess
//       return session
//     }
//   },
//   pages: {
//     signIn: '/login',
//   }
// })



























// // auth.ts - Just store essential data in cookies
// import NextAuth from "next-auth"
// import Keycloak from "next-auth/providers/keycloak"

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string
//     user: {
//       id: string
//       name?: string | null
//       email?: string | null
//       roles?: string[]
//     }
//   }
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     Keycloak({
//       clientId: process.env.AUTH_KEYCLOAK_ID!,
//       clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
//       issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
//     })
//   ],
  
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         //  Only store what we actually need
//         token.accessToken = account.access_token
//         token.expiresAt = account.expires_at
//         token.refreshToken = account.refresh_token
        
//         // Store only essential roles (not full resourceAccess object)
//         if (account.access_token) {
//           try {
//             const payload = JSON.parse(
//               Buffer.from(account.access_token.split('.')[1], 'base64').toString()
//             )
//             // Only store role names, not the full nested object
//             const realmRoles = payload.realm_access?.roles || []
//             const clientRoles = payload.resource_access?.['ERP-integerate']?.roles || []
//             token.roles = [...realmRoles, ...clientRoles]
//           } catch (error) {
//             console.error('Error parsing token:', error)
//           }
//         }
//       }
      
//       //  Simple token refresh check
//       if (token.expiresAt && Date.now() < (token.expiresAt * 1000) - 60000) {
//         return token // Token valid for at least 1 more minute
//       }
      
//       return await refreshToken(token)
//     },
    
//     async session({ session, token }) {
//       // ✅ Minimal session data
//       session.accessToken = token.accessToken
//       session.user.roles = token.roles
//       return session
//     }
//   }
// })

// // ✅ Simple token refresh
// async function refreshToken(token: any) {
//   try {
//     const response = await fetch(`${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({
//         client_id: process.env.AUTH_KEYCLOAK_ID!,
//         client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
//         grant_type: 'refresh_token',
//         refresh_token: token.refreshToken,
//       })
//     })

//     if (response.ok) {
//       const refreshed = await response.json()
//       return {
//         ...token,
//         accessToken: refreshed.access_token,
//         expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
//         refreshToken: refreshed.refresh_token ?? token.refreshToken,
//       }
//     }
//   } catch (error) {
//     console.error('Token refresh failed:', error)
//   }
  
//   // If refresh fails, force login
//   return { ...token, error: 'RefreshError' }
// }
