"use client"

import { Plus, TrendingUp, DollarSign, Calendar, BarChart3, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { ChartPlaceholder } from '@/components/chart-placeholder'
import { AddExpenseButton } from '@/components/add-expense-button'
import { useExpenses } from '@/lib/expense-context'
import { useAuth } from '@/lib/auth-context'
import { formatCurrency, formatDate } from '@/lib/utils'

/**
 * Dashboard Page - Main overview of user's financial data
 * 
 * Layout Strategy:
 * - CSS Grid for responsive metric cards (1-2-4 columns based on screen size)
 * - Flexbox for content sections with proper spacing
 * - Mobile-first responsive design with progressive enhancement
 * - ARIA landmarks for screen reader navigation
 * - Semantic HTML structure with proper heading hierarchy
 * 
 * Empty State Handling:
 * - All metrics default to $0.00 or 0 for new users
 * - Encouraging CTAs to guide user onboarding
 * - Progressive disclosure of features as data is added
 * - User-specific data isolation
 */

export default function DashboardPage() {
  const { user } = useAuth()
  const { expenses, getTotalExpenses, getMonthlyTotal, isLoading } = useExpenses()

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-500 dark:text-gray-400">Loading your expenses...</p>
        </div>
      </div>
    )
  }

  // Calculate metrics
  const totalExpenses = getTotalExpenses()
  const thisMonthTotal = getMonthlyTotal()
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const lastMonthTotal = getMonthlyTotal(lastMonth.getMonth(), lastMonth.getFullYear())
  
  const transactionCount = expenses.length
  const avgDaily = transactionCount > 0 ? totalExpenses / Math.max(transactionCount, 1) : 0

  // Get recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5)
  const hasExpenses = expenses.length > 0

  // Calculate category breakdown for chart
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.firstName || 'User'}! Here's an overview of your expenses.
          </p>
        </div>
        <AddExpenseButton />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {transactionCount} total transactions
            </p>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(thisMonthTotal)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lastMonthTotal > 0 
                ? `${((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)}% from last month`
                : 'First month tracking'
              }
            </p>
          </CardContent>
        </Card>

        {/* Last Month */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(lastMonthTotal)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Previous month total
            </p>
          </CardContent>
        </Card>

        {/* Avg Per Transaction */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(avgDaily)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Average per expense
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {hasExpenses ? (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {expense.description}
                        </h4>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {expense.category.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(expense.date)}
                        </span>
                      </div>
                      {expense.splits.length > 1 && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Split with {expense.splits.length - 1} other{expense.splits.length > 2 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {expenses.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/dashboard/expenses">View All Expenses</a>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={DollarSign}
                title="No expenses yet"
                description="Start tracking your expenses to see them here"
                action={<AddExpenseButton variant="sm" />}
              />
            )}
          </CardContent>
        </Card>

        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>This month's breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(categoryBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categoryBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => {
                    const percentage = (amount / totalExpenses) * 100
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize text-gray-700 dark:text-gray-300">
                            {category.replace('-', ' ')}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <ChartPlaceholder
                type="bar"
                title="Category Breakdown"
                description="Add expenses to see your spending patterns"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AddExpenseButton variant="outline" className="h-20 flex-col space-y-2">
              <Plus className="h-6 w-6" />
              <span>Add Expense</span>
            </AddExpenseButton>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <a href="/dashboard/receipts">
                <TrendingUp className="h-6 w-6" />
                <span>Upload Receipt</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <a href="/dashboard/budgets">
                <DollarSign className="h-6 w-6" />
                <span>Set Budget</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <a href="/dashboard/analytics">
                <BarChart3 className="h-6 w-6" />
                <span>View Reports</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 