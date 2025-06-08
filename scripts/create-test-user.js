const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        role: 'USER'
      }
    })
    
    console.log('Test user created successfully:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
    
    // Verify the password works
    const isValid = await bcrypt.compare('password123', user.password)
    console.log('Password verification test:', isValid ? 'PASSED' : 'FAILED')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Test user already exists')
      
      // Try to find and verify existing user
      const existingUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      })
      
      if (existingUser) {
        const isValid = await bcrypt.compare('password123', existingUser.password)
        console.log('Existing user password verification:', isValid ? 'PASSED' : 'FAILED')
        console.log('Existing user details:', {
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName
        })
      }
    } else {
      console.error('Error creating test user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 