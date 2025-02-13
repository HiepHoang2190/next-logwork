import NextAuth from 'next-auth'
import { authConfig } from '@/app/authconfig'
import { NextResponse } from 'next/server'

export default NextAuth(authConfig).auth

export function middleware(request) {
  const url = request.nextUrl;

  // Check for existing cookie to avoid infinite redirects
  const existingToken = request.cookies.get('JSESSIONID');

  const authPaths = ['/login'];
  const dashboardPath = '/dashboard';

  // Redirect authenticated users away from auth pages
  if (existingToken && authPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL(dashboardPath, url));
  }

  // Redirect unauthenticated users to login when accessing protected routes
  if (!existingToken && url.pathname.startsWith(dashboardPath)) {
    return NextResponse.redirect(new URL('/login', url));
  }

  return NextResponse.next();
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)', '/', '/dashboard/:path*', '/login']
}
