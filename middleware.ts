import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitState {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per duration
const LOGIN_MAX_ATTEMPTS = 5; // Maximum login attempts
const LOGIN_BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

const rateLimitMap = new Map<string, RateLimitState>();
const loginAttemptsMap = new Map<string, RateLimitState>();
 
function getRateLimitState(ip: string): RateLimitState {
  const now = Date.now();
  let state = rateLimitMap.get(ip);

  if (!state || now > state.resetTime) {
    state = { count: 0, resetTime: now + RATE_LIMIT_DURATION };
    rateLimitMap.set(ip, state);
  }

  return state;
}

function getLoginAttempts(ip: string): RateLimitState {
  const now = Date.now();
  let state = loginAttemptsMap.get(ip);

  if (!state || now > state.resetTime) {
    state = { count: 0, resetTime: now + LOGIN_BLOCK_DURATION };
    loginAttemptsMap.set(ip, state);
  }

  return state;
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup') ||
                    request.nextUrl.pathname.startsWith('/forgot-password');
  
  // Apply rate limiting
  const rateLimitState = getRateLimitState(ip);
  rateLimitState.count++;

  if (rateLimitState.count > MAX_REQUESTS) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((rateLimitState.resetTime - Date.now()) / 1000))
      }
    });
  }

  // Apply login attempt limiting
  if (request.nextUrl.pathname === '/login' && request.method === 'POST') {
    const loginState = getLoginAttempts(ip);
    loginState.count++;

    if (loginState.count > LOGIN_MAX_ATTEMPTS) {
      return new NextResponse('Too Many Login Attempts', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((loginState.resetTime - Date.now()) / 1000))
        }
      });
    }
  }
  
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
    '/profile/:path*',
    '/api/:path*'
  ]
}
