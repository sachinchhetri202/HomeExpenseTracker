import jwt from 'jsonwebtoken'
import * as jose from 'jose'
import dotenv from 'dotenv'
import { webcrypto } from 'crypto'

// Polyfill crypto for Node.js
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto
}

// Load environment variables
dotenv.config()

async function testJWT() {
  console.log('🔐 JWT Self-Test Starting...\n')

  // Check JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET not defined in environment')
    process.exit(1)
  }

  const JWT_SECRET = process.env.JWT_SECRET
  console.log('✅ JWT_SECRET loaded, length:', JWT_SECRET.length)
  console.log('✅ JWT_SECRET preview:', JWT_SECRET.substring(0, 10) + '...\n')

  try {
    // 1. Generate token with jsonwebtoken (same as login API)
    console.log('📝 Generating token with jsonwebtoken...')
    const payload = {
      userId: 'test-user-123',
      email: 'test@example.com',
      role: 'user',
      iat: Math.floor(Date.now() / 1000)
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d'
    })

    console.log('✅ Token generated successfully')
    console.log('✅ Token preview:', token.substring(0, 20) + '...')
    console.log('✅ Token structure:', token.split('.').length === 3 ? 'Valid (header.payload.signature)' : 'Invalid')
    console.log()

    // 2. Verify with jsonwebtoken
    console.log('🔍 Verifying with jsonwebtoken...')
    const decoded1 = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
    console.log('✅ jsonwebtoken verification successful')
    console.log('✅ Decoded payload:', decoded1)
    console.log()

    // 3. Verify with jose (same as middleware)
    console.log('🔍 Verifying with jose...')
    const { payload: josePayload, protectedHeader } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
      { 
        algorithms: ['HS256'],
        clockTolerance: '60s'
      }
    )
    console.log('✅ jose verification successful')
    console.log('✅ Protected header:', protectedHeader)
    console.log('✅ Jose payload:', josePayload)
    console.log()

    // 4. Test with invalid secret
    console.log('🧪 Testing with invalid secret...')
    try {
      jwt.verify(token, 'wrong-secret')
      console.log('❌ Should have failed with wrong secret')
    } catch (error) {
      console.log('✅ Correctly rejected invalid secret:', error.message)
    }
    console.log()

    console.log('🎉 All JWT tests passed! Authentication flow should work correctly.')

  } catch (error) {
    console.error('❌ JWT test failed:', error.message)
    console.error('❌ Full error:', error)
    process.exit(1)
  }
}

testJWT() 