import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
    
    // Clear all possible auth cookies
    response.cookies.delete('auth-token')
    response.cookies.delete('auth-token-test')
    
    // Also set them to expire immediately as a fallback
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    })
    
    response.cookies.set('auth-token-test', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    })
    
    console.log('Logout: All auth cookies cleared')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 