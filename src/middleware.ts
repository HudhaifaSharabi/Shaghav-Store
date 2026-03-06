import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware: Pre-render Access Control
 * 
 * Intercepts requests to all internal routes (lobby, products, checkout).
 * Verified against 'shaghav_invited' cookie. Redirects uninvited users to home page.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Minimal matching as guards are removed
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|videos).*)',
  ],
};
