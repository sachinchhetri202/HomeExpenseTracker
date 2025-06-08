import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

// Environment consistency check
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined')
console.log('Login API - Loaded JWT_SECRET length:', process.env.JWT_SECRET.length)

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!

/**
 * Login route handler that implements secure session management
 * - Validates credentials
 * - Creates JWT with user claims
 * - Sets httpOnly cookie with secure flags
 * - Redirects to dashboard with HTTP 307
 */
export async function POST(request: NextRequest) {
  try {
    let email: string
    let password: string

    // Handle both JSON and form data
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      // JSON request (from fetch)
      const body = await request.json()
      email = body.email
      password = body.password
    } else {
      // Form data request (from form submission)
      const formData = await request.formData()
      email = formData.get('email') as string
      password = formData.get('password') as string
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        username: true,
        role: true,
        createdAt: true,
      }
    })

    console.log('Login attempt for:', email)
    console.log('User found:', !!user)

    if (!user) {
      console.log('User not found for email:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('Verifying password for user:', user.email)
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValidPassword)

    if (!isValidPassword) {
      console.log('Invalid password for user:', user.email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT with user claims
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { 
        algorithm: 'HS256',
        expiresIn: '7d' 
      }
    )

    console.log('JWT_SECRET in login API:', JWT_SECRET.substring(0, 10) + '...')
    console.log('Generated token preview:', token.substring(0, 20) + '...')
    console.log('Full token structure check:', token.split('.').length === 3 ? 'Valid (header.payload.signature)' : 'Invalid structure')

    // Prepare sanitized user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    }

    // Create HTTP 307 redirect response to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url), 307)
    
    // Set secure auth cookie with all required flags
    response.cookies.set('auth-token', token, {
      httpOnly: true,                                    // Prevents JavaScript access to mitigate XSS
      secure: process.env.NODE_ENV === 'production',     // Requires HTTPS in production
      sameSite: 'lax',                                   // Protects against CSRF while allowing normal navigation
      path: '/',                                         // Make cookie available across all routes
      maxAge: 7 * 24 * 60 * 60                          // 7 days in seconds
    })

    console.log('Login successful for:', email)
    console.log('Redirecting to dashboard with auth cookie')

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 