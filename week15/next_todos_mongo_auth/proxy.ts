import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';

// Wrap next-auth's auth() so it runs before every matched route.
// request.auth is null when the user has no valid session.
export const proxy = auth((request: NextAuthRequest) => {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/login';

  // Unauthenticated user hitting a protected page → send to /login
  if (!request.auth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Authenticated user hitting /login → send home
  if (request.auth && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
});

export const config = {
  // Run on every route except Next.js internals and static assets.
  // The login page itself is included so authenticated users get redirected away.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
