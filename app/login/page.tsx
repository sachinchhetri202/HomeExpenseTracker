import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
import { PieChart } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <PieChart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ExpenseTracker
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Auth Form */}
        <AuthForm type="login" />

        {/* Additional Links */}
        <div className="text-center">
          <Link
            href="/reset-password"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
} 