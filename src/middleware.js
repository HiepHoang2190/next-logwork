import { authConfig } from '@/app/authconfig'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  
  const url = request.nextUrl

  const existingToken = request.cookies.get('JSESSIONID');

  const authPaths = ['/login']
  const dashboardPath = '/dashboard'

  // Redirect authenticated users away from auth pages
  if (existingToken && authPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // Redirect unauthenticated users to login when accessing protected routes
  if (!existingToken && url.pathname.startsWith(dashboardPath)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Use a matcher that applies to your desired routes
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    '/',
    '/dashboard/:path*',
    '/login'
  ]
}
