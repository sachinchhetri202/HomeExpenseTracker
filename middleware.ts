import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

// Environment consistency check
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined')
console.log('Middleware - Loaded JWT_SECRET length:', process.env.JWT_SECRET.length)

const JWT_SECRET = process.env.JWT_SECRET!

// Protected route prefixes that require authentication
const protectedPrefixes = [
  '/dashboard',
  '/admin'
]

// Routes that should redirect to dashboard if user is authenticated
const authRoutes = ['/login', '/register']

/**
 * Middleware function that handles:
 * - Protected route access control using startsWith checks
 * - JWT verification from auth-token cookie
 * - Auth route redirection
 * - Session management
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value
  
  console.log(`Middleware: ${pathname}, token: ${token ? 'present' : 'missing'}`)
  if (token) {
    console.log(`Token preview: ${token.substring(0, 20)}...`)
    console.log(`JWT_SECRET in middleware: ${JWT_SECRET.substring(0, 10)}...`)
  }
  
  // Check if the route is protected using startsWith
  const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix))
  const isAuthRoute = authRoutes.includes(pathname)

  console.log(`Route checks: protected=${isProtectedRoute}, auth=${isAuthRoute}`)

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      console.log('No token for protected route, redirecting to login')
      // No token - redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify token with jose
      const { payload, protectedHeader } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET),
        { 
          algorithms: ['HS256'],
          clockTolerance: '60s'
        }
      )
      console.log('JWT header:', protectedHeader)
      console.log('JWT payload:', payload)
      console.log('Token verified successfully for protected route')
      return NextResponse.next()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.log('JWT verification error:', errorMessage)
      console.log('Token that failed:', token)
      console.log('JWT_SECRET used:', JWT_SECRET.substring(0, 10) + '...')
      // Invalid token - clear it and redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth-token')
      return response
    }
  }

  // Handle auth routes (login/register)
  if (isAuthRoute && token) {
    try {
      // Valid token on auth route - redirect to dashboard
      await jose.jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET),
        { 
          algorithms: ['HS256'],
          clockTolerance: '60s'
        }
      )
      console.log('Valid token on auth route, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.log('Invalid token on auth route, clearing cookie')
      // Invalid token - clear it and continue
      const response = NextResponse.next()
      response.cookies.delete('auth-token')
      return response
    }
  }

  console.log('Middleware: allowing request to continue')
  return NextResponse.next()
}

// Configure middleware matching
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 