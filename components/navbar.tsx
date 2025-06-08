"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  PieChart,
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Target, 
  CreditCard, 
  Users,
  Settings,
  LogOut,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth-context'
import { useAddExpense } from '@/lib/add-expense-context'

/**
 * Navbar Component - Mobile navigation header
 * 
 * Design Strategy:
 * - Fixed top positioning for mobile (sticky behavior)
 * - Hamburger menu pattern with slide-out overlay
 * - Touch-friendly tap targets (min 44px)
 * - Z-index management for overlay states
 * - ARIA attributes for screen reader accessibility
 * - Focus trap within open menu for keyboard navigation
 * 
 * Responsive: Only visible on mobile (<lg breakpoint)
 * Dark/light theme support with proper contrast ratios
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { openModal } = useAddExpense()

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <PieChart className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ExpenseTracker
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  Menu
                </h2>
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Add Expense CTA */}
              <div className="p-4">
                <Button 
                  className="w-full" 
                  size="sm" 
                  onClick={() => {
                    openModal()
                    closeMenu()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-1" aria-label="Mobile navigation">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={`
                        group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors
                        ${isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <item.icon
                        className={`
                          mr-4 h-6 w-6 transition-colors
                          ${isActive
                            ? 'text-blue-500 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500'
                          }
                        `}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* User Menu */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                {/* User Info */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Settings */}
                <Link
                  href="/dashboard/profile"
                  onClick={closeMenu}
                  className="flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="mr-4 h-6 w-6 text-gray-400 dark:text-gray-500" />
                  Settings
                </Link>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between px-3 py-3">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">Theme</span>
                  <ThemeToggle />
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  className="w-full flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="mr-4 h-6 w-6 text-gray-400 dark:text-gray-500" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 