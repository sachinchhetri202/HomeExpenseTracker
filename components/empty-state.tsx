import { LucideIcon } from 'lucide-react'

/**
 * EmptyState Component - Displays when no data is available
 * 
 * Design Strategy:
 * - Centered layout with icon, title, description, and optional action
 * - Consistent spacing and typography hierarchy
 * - Encouraging tone to guide user actions
 * - ARIA-compliant structure for accessibility
 * - Responsive sizing for different container contexts
 * 
 * Used throughout the app for empty lists, no search results, etc.
 */

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        {description}
      </p>
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
} 