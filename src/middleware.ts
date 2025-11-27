// import type { NextRequest } from "next/server";
// import { auth0 } from "../lib/auth0";  // Note: ../ to go up from src to reach lib

// export async function middleware(request: NextRequest) {
//   return await auth0.middleware(request);
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      */
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };





// {
//   "nickname": "sammarabbas114433",
//   "name": "sammarabbas114433@gmail.com",
//   "email": "sammarabbas114433@gmail.com",
//   "email_verified": false,
//   "sub": "auth0|6903110b4dba7df46cb2575d",
//   "https://erp-system-api.com/roles": ["admin"],
//   "https://erp-system-api.com/permissions": ["coa:read", "coa:write", ...]
// }





import type { NextRequest } from "next/server";
import { auth0 } from "../lib/auth0";

export async function middleware(request: NextRequest) {
  const response = await auth0.middleware(request);
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/logout', 
    '/auth/callback',
    '/auth/profile',
    '/auth/access-token',
    '/auth/backchannel-logout'
  ];
  
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Check if user has session
  const session = await auth0.getSession(request);
  
  // Redirect to login if no session and not on public route
  if (!session && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', request.url);
    return Response.redirect(loginUrl);
  }
  
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
