"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

export interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  notes?: string
  receiptUrl?: string
  splits: ExpenseSplit[]
  createdBy: string
  createdAt: string
}

export interface ExpenseSplit {
  userId: string
  userEmail: string
  userName: string
  amount: number
  isPaid: boolean
}

interface ExpenseContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  getExpensesByCategory: () => Record<string, Expense[]>
  getTotalExpenses: () => number
  getMonthlyTotal: (month?: number, year?: number) => number
  isLoading: boolean
  error: string | null
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load expenses from API when user changes
  useEffect(() => {
    if (!user?.id) {
      setExpenses([])
      setIsLoading(false)
      return
    }

    loadExpenses()
  }, [user?.id])

  const loadExpenses = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/expenses/simple', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to load expenses')
      }

      const data = await response.json()
      
      // Transform API data to match our interface
      const transformedExpenses = data.expenses.map((expense: any) => ({
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        category: expense.category?.name || 'uncategorized',
        date: expense.date,
        notes: expense.notes,
        receiptUrl: expense.receipt?.filePath,
        createdBy: expense.userId,
        createdAt: expense.createdAt,
        splits: expense.splits.map((split: any) => ({
          userId: split.userId,
          userEmail: split.user.email,
          userName: `${split.user.firstName || ''} ${split.user.lastName || ''}`.trim() || split.user.email,
          amount: split.amount,
          isPaid: split.isPaid,
        }))
      }))

      setExpenses(transformedExpenses)
    } catch (err) {
      console.error('Failed to load expenses:', err)
      setError('Failed to load expenses. Using offline data.')
      
      // Fallback to localStorage for offline functionality
      const userStorageKey = `expenses_${user.id}`
      const savedExpenses = localStorage.getItem(userStorageKey)
      if (savedExpenses) {
        try {
          const parsedExpenses = JSON.parse(savedExpenses)
          setExpenses(parsedExpenses.filter((expense: Expense) => expense.createdBy === user.id))
        } catch (parseError) {
          console.error('Failed to parse saved expenses:', parseError)
          setExpenses([])
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Save to localStorage as backup
  const saveToLocalStorage = (expenseList: Expense[]) => {
    if (user?.id) {
      const userStorageKey = `expenses_${user.id}`
      localStorage.setItem(userStorageKey, JSON.stringify(expenseList))
    }
  }

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    // Optimistic update
    const tempExpense: Expense = {
      ...expenseData,
      id: `temp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    }
    
    setExpenses(prev => [tempExpense, ...prev])

    try {
      // Map our interface to API format
      const apiData = {
        amount: expenseData.amount,
        description: expenseData.description,
        category: expenseData.category,
        date: expenseData.date,
        notes: expenseData.notes,
        receiptUrl: expenseData.receiptUrl,
        splits: expenseData.splits.map(split => ({
          userId: split.userId,
          amount: split.amount,
          isPaid: split.isPaid,
        }))
      }

      const response = await fetch('/api/expenses/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error('Failed to save expense')
      }

      const data = await response.json()
      
      // Replace temp expense with real one
      setExpenses(prev => {
        const filtered = prev.filter(e => e.id !== tempExpense.id)
        const realExpense: Expense = {
          id: data.expense.id,
          amount: data.expense.amount,
          description: data.expense.description,
          category: data.expense.category?.name || 'uncategorized',
          date: data.expense.date,
          notes: data.expense.notes,
          receiptUrl: data.expense.receipt?.filePath,
          createdBy: data.expense.userId,
          createdAt: data.expense.createdAt,
          splits: data.expense.splits.map((split: any) => ({
            userId: split.userId,
            userEmail: split.user.email,
            userName: `${split.user.firstName || ''} ${split.user.lastName || ''}`.trim() || split.user.email,
            amount: split.amount,
            isPaid: split.isPaid,
          }))
        }
        const newList = [realExpense, ...filtered]
        saveToLocalStorage(newList)
        return newList
      })

      setError(null)
    } catch (err) {
      console.error('Failed to save expense:', err)
      setError('Failed to save expense. It will be saved locally.')
      
      // Keep the optimistic update but save to localStorage
      setExpenses(prev => {
        saveToLocalStorage(prev)
        return prev
      })
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!user?.id) return

    // Optimistic update
    setExpenses(prev => 
      prev.map(expense => {
        if (expense.id === id && expense.createdBy === user.id) {
          return { ...expense, ...updates }
        }
        return expense
      })
    )

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update expense')
      }

      // Reload to get fresh data
      await loadExpenses()
      setError(null)
    } catch (err) {
      console.error('Failed to update expense:', err)
      setError('Failed to update expense')
      // Revert optimistic update
      await loadExpenses()
    }
  }

  const deleteExpense = async (id: string) => {
    if (!user?.id) return

    // Optimistic update
    const originalExpenses = expenses
    setExpenses(prev => 
      prev.filter(expense => !(expense.id === id && expense.createdBy === user.id))
    )

    try {
      const response = await fetch(`/api/expenses/simple/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }

      setError(null)
      saveToLocalStorage(expenses.filter(e => e.id !== id))
    } catch (err) {
      console.error('Failed to delete expense:', err)
      setError('Failed to delete expense')
      // Revert optimistic update
      setExpenses(originalExpenses)
    }
  }

  const getExpensesByCategory = () => {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = []
      }
      acc[expense.category].push(expense)
      return acc
    }, {} as Record<string, Expense[]>)
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getMonthlyTotal = (month?: number, year?: number) => {
    const now = new Date()
    const targetMonth = month ?? now.getMonth()
    const targetYear = year ?? now.getFullYear()

    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === targetMonth && 
               expenseDate.getFullYear() === targetYear
      })
      .reduce((total, expense) => total + expense.amount, 0)
  }

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpensesByCategory,
      getTotalExpenses,
      getMonthlyTotal,
      isLoading,
      error,
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
} 