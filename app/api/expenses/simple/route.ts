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

// GET /api/expenses/simple - Get user's expenses
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get expenses from database with a simpler approach
    const dbExpenses = await prisma.expense.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get categories for these expenses
    const categoryIds = Array.from(new Set(dbExpenses.map(e => e.categoryId)))
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds }
      }
    })
    const categoryMap = new Map(categories.map(c => [c.id, c.name]))

    // Get splits for these expenses
    const expenseIds = dbExpenses.map(e => e.id)
    const splits = await (prisma as any).split.findMany({
      where: {
        expenseId: { in: expenseIds }
      },
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
    })
    const splitsMap = new Map<string, any[]>()
    splits.forEach((split: any) => {
      if (!splitsMap.has(split.expenseId)) {
        splitsMap.set(split.expenseId, [])
      }
      splitsMap.get(split.expenseId)!.push({
        userId: split.userId,
        userEmail: split.user.email,
        userName: `${split.user.firstName || ''} ${split.user.lastName || ''}`.trim() || split.user.email,
        amount: split.amount,
        isPaid: split.isPaid,
        user: {
          id: split.user.id,
          email: split.user.email,
          firstName: split.user.firstName || '',
          lastName: split.user.lastName || '',
        }
      })
    })

    // Transform to match our interface
    const expenses = dbExpenses.map(expense => ({
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      category: { name: categoryMap.get(expense.categoryId) || 'uncategorized' },
      date: expense.date.toISOString().split('T')[0],
      notes: expense.notes,
      receiptUrl: null,
      userId: expense.userId,
      createdAt: expense.createdAt.toISOString(),
      splits: splitsMap.get(expense.id) || []
    }))

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Failed to fetch expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST /api/expenses/simple - Create new expense
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

    // Create expense in database
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

    // Create splits in database
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

    await (prisma as any).split.createMany({
      data: splitData
    })

    // Return expense in expected format
    const responseExpense = {
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      category: { name: category },
      date: expense.date.toISOString().split('T')[0],
      notes: expense.notes,
      receiptUrl: null,
      userId: expense.userId,
      createdAt: expense.createdAt.toISOString(),
      splits: splits?.map((split: any) => ({
        userId: split.userId,
        userEmail: split.userEmail,
        userName: split.userName,
        amount: parseFloat(split.amount),
        isPaid: split.isPaid || false,
        user: {
          id: split.userId,
          email: split.userEmail,
          firstName: split.userName?.split(' ')[0] || '',
          lastName: split.userName?.split(' ').slice(1).join(' ') || '',
        }
      })) || [{
        userId: user.userId,
        userEmail: user.email,
        userName: user.email,
        amount: parseFloat(amount),
        isPaid: true,
        user: {
          id: user.userId,
          email: user.email,
          firstName: '',
          lastName: '',
        }
      }]
    }

    return NextResponse.json({ expense: responseExpense }, { status: 201 })
  } catch (error) {
    console.error('Failed to create expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}

 