"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  CreditCard, 
  BarChart3, 
  Target, 
  Users, 
  Settings,
  Plus,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth-context'
import { useAddExpense } from '@/lib/add-expense-context'

/**
 * Sidebar Component - Primary navigation for desktop dashboard
 * 
 * Design Strategy:
 * - Fixed positioning on desktop (lg:fixed lg:inset-y-0)
 * - Full height with scrollable content area
 * - Visual hierarchy: Logo > Add Expense CTA > Navigation > User Menu > Theme Toggle
 * - Active state indication with background color and icon color changes
 * - ARIA navigation landmarks and proper focus management
 * - Dark/light theme support with consistent color tokens
 * 
 * Responsive behavior handled by parent layout (hidden on mobile)
 */

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Budgets', href: '/dashboard/budgets', icon: Target },
  { name: 'Receipts', href: '/dashboard/receipts', icon: PieChart },
  { name: 'Balances', href: '/dashboard/balances', icon: CreditCard },
  { name: 'Household', href: '/dashboard/household', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { openModal } = useAddExpense()

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <PieChart className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
          ExpenseTracker
        </span>
      </div>

      {/* Add Expense CTA */}
      <div className="p-4">
        <Button className="w-full" size="sm" onClick={openModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 transition-colors
                  ${isActive
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Menu & Settings */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Settings Link */}
        <Link
          href="/dashboard/profile"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          Settings
        </Link>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
          <ThemeToggle />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          Sign Out
        </button>
      </div>
    </div>
  )
} 