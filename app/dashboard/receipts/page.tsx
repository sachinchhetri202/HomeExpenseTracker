import { Upload, Search, Filter, Image, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/empty-state'

/**
 * Receipts Page - Manage uploaded receipt images and documents
 * 
 * Layout Strategy:
 * - Grid layout for receipt thumbnails with responsive columns
 * - Upload area prominently displayed when empty
 * - Search and filter functionality for large collections
 * - ARIA labels for image accessibility
 * - Keyboard navigation for receipt gallery
 * 
 * Features:
 * - Drag & drop receipt upload
 * - OCR text extraction preview
 * - Receipt categorization
 * - Download and export options
 * - Search by date, amount, or merchant
 */

export default function ReceiptsPage() {
  // Mock data - in real app, this would come from API/database
  const receipts: any[] = []
  const hasReceipts = receipts.length > 0

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Receipts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Upload and manage your receipt images
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Receipt
        </Button>
      </div>

      {/* Search and Filters */}
      {hasReceipts && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search receipts..."
                  className="pl-10"
                />
              </div>
              
              {/* Filter Button */}
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              {/* Date Range */}
              <Button variant="outline">
                This Month
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receipts Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Gallery</CardTitle>
          <CardDescription>
            {hasReceipts ? `${receipts.length} receipts uploaded` : 'No receipts uploaded yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasReceipts ? (
            <div className="space-y-6">
              {/* Grid would go here */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Receipt thumbnails would be rendered here */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Receipt thumbnails would be displayed here...
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing 1 to 12 of 0 receipts
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Image}
              title="No receipts uploaded"
              description="Upload receipt images to keep track of your purchases and expenses"
              action={
                <div className="space-y-3">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Receipt
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports JPG, PNG, PDF files up to 10MB
                  </p>
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Upload Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Tips</CardTitle>
          <CardDescription>Get the best results from your receipt uploads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                📸 Photo Quality
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Ensure good lighting and clear text</li>
                <li>• Keep the receipt flat and straight</li>
                <li>• Include all edges of the receipt</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                🔍 Auto-Detection
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Merchant name and date are extracted</li>
                <li>• Total amount is automatically detected</li>
                <li>• Review and edit before saving</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 