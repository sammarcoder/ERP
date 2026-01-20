// import { auth } from "./auth"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// export default auth(async (request: NextRequest) => {
//   // Public routes that don't require authentication (same pattern as Auth0)
//   const publicRoutes = [
//     '/login',
//     '/api/auth'  // All Auth.js routes
//   ]
  
//   const isPublicRoute = publicRoutes.some(route => 
//     request.nextUrl.pathname.startsWith(route)
//   )
  
//   // Check if user has session (equivalent to auth0.getSession)
//   const session = request.auth
  
//   // Redirect to login if no session and not on public route
//   if (!session && !isPublicRoute) {
//     const loginUrl = new URL('/login', request.url)
//     loginUrl.searchParams.set('returnTo', request.url) // Same as Auth0
//     return NextResponse.redirect(loginUrl)
//   }
  
//   // If authenticated and on login page, redirect to home
//   if (session && request.nextUrl.pathname === '/login') {
//     return NextResponse.redirect(new URL('/', request.url))
//   }
  
//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     // Exact same pattern as your Auth0
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// }


























const auth = () => { 
  
}

export default auth;