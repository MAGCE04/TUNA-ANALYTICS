import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware adds cache-busting headers to all API responses
export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }
  
  return NextResponse.next();
}

// Configure the paths this middleware runs on
export const config = {
  matcher: '/api/:path*',
};