"use client"

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * DashboardWrapper Component - Authentication wrapper for dashboard pages
 * 
 * Design Strategy:
 * - Client-side authentication check for dashboard routes
 * - Automatic redirect to login if not authenticated
 * - Loading state management during auth verification
 * - Seamless integration with auth context
 * 
 * This wrapper ensures that dashboard pages are only accessible
 * to authenticated users and provides a consistent auth experience.
 */

interface DashboardWrapperProps {
  children: React.ReactNode
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard content if user is not authenticated
  if (!user) {
    return null
  }

  // Render dashboard content for authenticated users
  return <>{children}</>
} 