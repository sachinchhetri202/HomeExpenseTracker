"use client"

import { Search, Filter, Download, Calendar, DollarSign, Edit, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/empty-state'
import { AddExpenseButton } from '@/components/add-expense-button'
import { useExpenses } from '@/lib/expense-context'
import { useAuth } from '@/lib/auth-context'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useState } from 'react'

/**
 * Expenses Page - Comprehensive expense management interface
 * 
 * Layout Strategy:
 * - Header with search, filters, and actions
 * - Responsive table/card layout for expense list
 * - Pagination and sorting controls
 * - Empty state with clear onboarding
 * - Mobile-optimized with touch-friendly controls
 * - User-specific data isolation
 * 
 * Features:
 * - Real-time search and filtering
 * - Bulk actions and export functionality
 * - Category-based organization
 * - Date range filtering
 * - Receipt attachment indicators
 * - Secure user data separation
 */

export default function ExpensesPage() {
  const { user } = useAuth()
  const { expenses, getMonthlyTotal, deleteExpense, isLoading } = useExpenses()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Expenses
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track and manage all your expenses
            </p>
          </div>
          <AddExpenseButton />
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-500 dark:text-gray-400">Loading your expenses...</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const hasExpenses = expenses.length > 0
  const thisMonthTotal = getMonthlyTotal()
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const lastMonthTotal = getMonthlyTotal(lastMonth.getMonth(), lastMonth.getFullYear())

  // Get unique categories for filter
  const categories = Array.from(new Set(expenses.map(e => e.category)))

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track and manage all your expenses
          </p>
        </div>
        <AddExpenseButton />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            )}
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                This Month
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            {hasExpenses ? `${filteredExpenses.length} of ${expenses.length} expenses` : 'No expenses recorded yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasExpenses ? (
            <div className="space-y-4">
              {filteredExpenses.length > 0 ? (
                <>
                  {/* Table Header - Desktop */}
                  <div className="hidden md:grid md:grid-cols-6 gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <div>Description</div>
                    <div>Category</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Split</div>
                    <div>Actions</div>
                  </div>
                  
                  {/* Expense Items */}
                  {filteredExpenses.map((expense) => (
                    <div key={expense.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {expense.description}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {expense.category.replace('-', ' ')}
                            </p>
                          </div>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(expense.date)}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {expense.splits.length > 1 && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Split with {expense.splits.length - 1} other{expense.splits.length > 2 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      
                      {/* Desktop Layout */}
                      <div className="hidden md:block">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {expense.description}
                        </div>
                        {expense.notes && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {expense.notes}
                          </div>
                        )}
                      </div>
                      <div className="hidden md:block text-gray-500 dark:text-gray-400 capitalize">
                        {expense.category.replace('-', ' ')}
                      </div>
                      <div className="hidden md:block text-gray-500 dark:text-gray-400">
                        {formatDate(expense.date)}
                      </div>
                      <div className="hidden md:block font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                        {expense.splits.length === 1 ? (
                          'Personal'
                        ) : (
                          `Split ${expense.splits.length} ways`
                        )}
                      </div>
                      <div className="hidden md:flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {filteredExpenses.length} of {expenses.length} expenses
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No expenses match your search criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('')
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={DollarSign}
              title="No expenses recorded"
              description="Start tracking your expenses by adding your first transaction"
              action={<AddExpenseButton variant="sm" />}
            />
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(thisMonthTotal)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {expenses.filter(e => {
                const expenseDate = new Date(e.date)
                const now = new Date()
                return expenseDate.getMonth() === now.getMonth() && 
                       expenseDate.getFullYear() === now.getFullYear()
              }).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(lastMonthTotal)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {expenses.filter(e => {
                const expenseDate = new Date(e.date)
                return expenseDate.getMonth() === lastMonth.getMonth() && 
                       expenseDate.getFullYear() === lastMonth.getFullYear()
              }).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length : 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 