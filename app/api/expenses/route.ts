import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

async function verifyAuth(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
      clockTolerance: 60,
    })

    return payload as { userId: string; email: string; role: string }
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

// GET /api/expenses - Get user's expenses
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        category: true,
        receipt: true,
        splits: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Failed to fetch expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, description, category, date, notes, receiptUrl, splits } = body

    // Validate required fields
    if (!amount || !description || !category || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find or create category
    let categoryRecord = await prisma.category.findFirst({
      where: {
        name: category,
        userId: user.userId,
      }
    })

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category,
          userId: user.userId,
        }
      })
    }

    // Create expense first
    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        categoryId: categoryRecord.id,
        date: new Date(date),
        notes,
        userId: user.userId,
      }
    })

    // Create splits separately
    const splitData = splits?.map((split: any) => ({
      expenseId: expense.id,
      userId: split.userId,
      amount: parseFloat(split.amount),
      isPaid: split.isPaid || false,
    })) || [{
      expenseId: expense.id,
      userId: user.userId,
      amount: parseFloat(amount),
      isPaid: true,
    }]

    await prisma.split.createMany({
      data: splitData
    })

    // Fetch the complete expense with relations
    const completeExpense = await prisma.expense.findUnique({
      where: { id: expense.id },
      include: {
        category: true,
        receipt: true,
        splits: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ expense: completeExpense }, { status: 201 })
  } catch (error) {
    console.error('Failed to create expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}

// PUT /api/expenses/[id] - Update expense
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const expenseId = url.pathname.split('/').pop()
    
    if (!expenseId) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 })
    }

    const body = await request.json()
    const { amount, description, category, date, notes, receiptUrl } = body

    // Verify expense belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: user.userId,
      }
    })

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        description,
        category,
        date: date ? new Date(date) : undefined,
        notes,
        receiptUrl,
      },
      include: {
        splits: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ expense: updatedExpense })
  } catch (error) {
    console.error('Failed to update expense:', error)
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    )
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const expenseId = url.pathname.split('/').pop()
    
    if (!expenseId) {
      return NextResponse.json({ error: 'Expense ID required' }, { status: 400 })
    }

    // Verify expense belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: user.userId,
      }
    })

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    // Delete expense and its splits (cascade)
    await prisma.expense.delete({
      where: { id: expenseId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete expense:', error)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
} 