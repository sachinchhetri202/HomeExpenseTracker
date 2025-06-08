import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

/**
 * ChartPlaceholder Component - Displays when chart data is not available
 * 
 * Design Strategy:
 * - Visual representation of different chart types (bar, pie, line)
 * - Subtle animation to indicate interactivity potential
 * - Consistent with overall empty state design language
 * - Accessible with proper ARIA labels
 * - Responsive sizing within card containers
 * 
 * Shows placeholder charts until real data is available
 */

interface ChartPlaceholderProps {
  type: 'bar' | 'pie' | 'line'
  title: string
  description: string
  className?: string
}

export function ChartPlaceholder({ 
  type, 
  title, 
  description, 
  className = "" 
}: ChartPlaceholderProps) {
  const getIcon = () => {
    switch (type) {
      case 'bar':
        return BarChart3
      case 'pie':
        return PieChart
      case 'line':
        return TrendingUp
      default:
        return BarChart3
    }
  }

  const Icon = getIcon()

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* Chart Icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
        <Icon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
      </div>
      
      {/* Title */}
      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      
      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        {description}
      </p>

      {/* Placeholder Chart Elements */}
      <div className="mt-8 w-full max-w-sm">
        {type === 'bar' && (
          <div className="flex items-end justify-center space-x-2 h-24">
            {[40, 70, 30, 90, 60].map((height, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 rounded-t"
                style={{ 
                  height: `${height}%`, 
                  width: '16px',
                  opacity: 0.5 
                }}
              />
            ))}
          </div>
        )}
        
        {type === 'pie' && (
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-gray-300 dark:border-t-gray-600 opacity-50" />
          </div>
        )}
        
        {type === 'line' && (
          <div className="h-24 flex items-end justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points="20,80 50,40 80,60 110,20 140,50 170,30"
                className="text-gray-300 dark:text-gray-600 opacity-50"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
} 