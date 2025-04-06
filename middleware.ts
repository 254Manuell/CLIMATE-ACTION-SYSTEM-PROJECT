import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup') ||
                    request.nextUrl.pathname.startsWith('/forgot-password')
  
  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access protected pages without auth, redirect to login
  if (!isAuthPage && !authToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ]
}
