import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add cache-busting headers to all responses
  const response = NextResponse.next();
  
  // Add cache-busting headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  // Handle potential 404 issues by redirecting to home page
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Check if the request is for a page that should exist
  const validRoutes = [
    '/',
    '/revenue',
    '/liquidations',
    '/orders',
    '/pools',
    '/users',
    '/wallets'
  ];
  
  // If it's not an API route, static asset, or valid page, redirect to home
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('.') &&
    !validRoutes.includes(pathname) &&
    !validRoutes.some(route => pathname.startsWith(`${route}/`))
  ) {
    console.log(`Redirecting from ${pathname} to /`);
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  return response;
}

// Configure the paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};