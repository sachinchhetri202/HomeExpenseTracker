import { Target, Plus, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/empty-state'

/**
 * Budgets Page - Set and track spending limits by category
 * 
 * Layout Strategy:
 * - Grid layout for budget cards with progress indicators
 * - Responsive design that stacks on mobile
 * - Color-coded progress bars (green/yellow/red)
 * - ARIA labels for budget progress accessibility
 * - Quick edit functionality for budget amounts
 * 
 * Features:
 * - Category budget setting
 * - Progress tracking with visual indicators
 * - Budget alerts and notifications
 * - Monthly/yearly budget views
 * - Spending vs budget comparisons
 */

export default function BudgetsPage() {
  // Mock data - in real app, this would come from API/database
  const budgets: any[] = []
  const hasBudgets = budgets.length > 0
  const totalBudget = 0
  const totalSpent = 0

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Other'
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Budgets
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Set spending limits and track your progress
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Set Budget
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalBudget.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${(totalBudget - totalSpent).toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>
            Set spending limits for each category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasBudgets ? (
            <div className="space-y-6">
              {/* Budget list would go here */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Budget categories would be rendered here...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Empty state with category setup */}
              <EmptyState
                icon={Target}
                title="No budgets set"
                description="Create budgets for different spending categories to track your limits"
                action={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Budget
                  </Button>
                }
              />

              {/* Quick Setup */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Quick Setup
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">$</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button>Save Budgets</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Insights</CardTitle>
          <CardDescription>Tips and recommendations for your budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Start with the 50/30/20 Rule
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                    Set Realistic Goals
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Base your budgets on your actual spending patterns from the last few months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 