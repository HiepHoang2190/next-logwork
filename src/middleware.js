import NextAuth from 'next-auth'
import { authConfig } from '@/app/authconfig'
import { NextResponse } from 'next/server'
import { auth } from "@/app/auth";

export default NextAuth(authConfig).auth

export async function middleware(request) {
  
  const user = await auth();

  const url = request.nextUrl

  const allCookies = request.cookies.getAll()
  
  const sessionTokenCookie = allCookies.find(cookie =>
    cookie.name.includes('session-token')
  )
  
  const jsessionCookie = request.cookies.get('JSESSIONID')
  const tokenExpiry = user?.user?.tokenExp

  // For demonstration, we assume that if JSESSIONID is missing, the session is invalid.
  // (In a real app, you might verify JSESSIONID against your server-side session store.)
  const isJSessionValid = Boolean(jsessionCookie && tokenExpiry < Date.now())

  // Determine authentication status based on both cookies
  const isAuthenticated = sessionTokenCookie && isJSessionValid

  const authPaths = ['/login']
  const dashboardPath = '/dashboard'

  // Redirect authenticated users away from /login
  if (isAuthenticated && authPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL(dashboardPath, url))
  }

  // Redirect unauthenticated (or expired session) users to /login when accessing /dashboard pages
  if (!isAuthenticated && url.pathname.startsWith(dashboardPath)) {
    return NextResponse.redirect(new URL('/login', url))
  }

  return NextResponse.next()
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
