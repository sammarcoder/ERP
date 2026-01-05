import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react'

// ✅ Centralized base query that all slices will use
// export const createBaseQueryWithAuth = (baseUrl: string) => {
//   return fetchBaseQuery({
//     baseUrl,
//     prepareHeaders: async (headers, { getState }) => {
//       try {
//         // Get session from NextAuth.js (contains Keycloak token)
//         const session = await getSession()
        
//         if (session?.accessToken) {
//           headers.set('Authorization', `Bearer ${session.accessToken}`)
//           console.log('✅ Token added to request:', session.accessToken.substring(0, 20) + '...')
//         } else {
//           console.warn('⚠️ No access token found in session')
//         }
//       } catch (error) {
//         console.error('❌ Failed to get session token:', error)
//       }
      
//       // Set common headers
//       headers.set('Content-Type', 'application/json')
//       headers.set('Accept', 'application/json')
      
//       return headers
//     },
//     // Optional: Add retry logic for token refresh
//     fetchFn: async (...args) => {
//       const result = await fetch(...args)
      
//       // If 401, could trigger token refresh here
//       if (result.status === 401) {
//         console.warn('🔄 Received 401, token may have expired')
//       }
      
//       return result
//     }
//   })
// }


// Update your baseQuery to handle refresh errors
export const createBaseQueryWithAuth = (baseUrl: string) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const session = await getSession()
      
      // If token refresh failed, redirect to login
      if (session?.error === 'RefreshAccessTokenError') {
        console.log('🚪 Token refresh failed, redirecting to login...')
        window.location.href = '/login'
        return headers
      }
      
      if (session?.accessToken) {
        console.log('✅ Adding token to request')
        headers.set('Authorization', `Bearer ${session.accessToken}`)
      }
      
      headers.set('Content-Type', 'application/json')
      return headers
    },
  })
}


// ✅ Pre-configured base queries for different services
export const currencyBaseQuery = createBaseQueryWithAuth(
  (() => {
    if (typeof window !== 'undefined') {
      return `http://${window.location.hostname}:4000/api/z-currency`
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/z-currency'
  })()
)

export const coaBaseQuery = createBaseQueryWithAuth(
  (() => {
    if (typeof window !== 'undefined') {
      return `http://${window.location.hostname}:4000/api/coa`
    }
    return process.env.NEXT_PUBLIC_COA_API_URL || 'http://localhost:4000/api/coa'
  })()
)

// Add more base queries for other modules
export const userBaseQuery = createBaseQueryWithAuth(
  process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:4000/api/users'
)

export const reportsBaseQuery = createBaseQueryWithAuth(
  process.env.NEXT_PUBLIC_REPORTS_API_URL || 'http://localhost:4000/api/reports'
)
