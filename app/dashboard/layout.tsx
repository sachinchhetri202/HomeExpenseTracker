import { DashboardWrapper } from '@/components/dashboard-wrapper'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { AddExpenseProvider } from '@/lib/add-expense-context'
import { ExpenseProvider } from '@/lib/expense-context'
import { AddExpenseModal } from '@/components/add-expense-modal'
import { AddExpenseModalWrapper } from '@/components/add-expense-modal-wrapper'

/**
 * DashboardLayout provides the main structure for all authenticated pages.
 * 
 * Layout Strategy:
 * - Uses CSS Grid for desktop (sidebar + main content)
 * - Flexbox for mobile with collapsible sidebar
 * - Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
 * - Dark/light theme support via CSS custom properties
 * - ARIA landmarks for accessibility (navigation, main, complementary)
 * 
 * The layout ensures consistent navigation, user context, and theme persistence
 * across all dashboard pages while maintaining responsive behavior.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardWrapper>
      <ExpenseProvider>
        <AddExpenseProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <Navbar />
            </div>

            {/* Desktop Layout */}
            <div className="lg:flex">
              {/* Sidebar - Fixed on desktop, overlay on mobile */}
              <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <Sidebar />
              </div>

              {/* Main Content Area */}
              <div className="lg:pl-64 flex flex-col flex-1">
                <main 
                  className="flex-1"
                  role="main"
                  aria-label="Dashboard content"
                >
                  <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      {children}
                    </div>
                  </div>
                </main>
              </div>
            </div>

            {/* Add Expense Modal */}
            <AddExpenseModalWrapper />
          </div>
        </AddExpenseProvider>
      </ExpenseProvider>
    </DashboardWrapper>
  )
} 