import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, BarChart3, PieChart, Receipt, Shield } from 'lucide-react'

export default function HomePage() {
  // In a real app, you'd check authentication status here
  // For now, we'll show the landing page
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PieChart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ExpenseTracker
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your
            <span className="text-blue-600 block">Home Expenses</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track, analyze, and optimize your spending with our comprehensive expense management system. 
            Get insights that help you save money and reach your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Tracking Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <Receipt className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Receipt Scanning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload receipts and automatically extract expense data with OCR technology.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize your spending patterns with interactive charts and reports.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Budget Management</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Set budgets, track progress, and get alerts when you're overspending.
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your financial data is encrypted and stored securely with full privacy protection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 ExpenseTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 