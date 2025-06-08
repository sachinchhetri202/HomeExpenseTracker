"use client"

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAddExpense } from '@/lib/add-expense-context'
import { cn } from '@/lib/utils'

interface AddExpenseButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'sm'
  className?: string
  children?: React.ReactNode
}

export function AddExpenseButton({ 
  variant = 'default', 
  className,
  children 
}: AddExpenseButtonProps) {
  const { openModal } = useAddExpense()

  // Handle the 'sm' variant as a size modifier
  const buttonVariant = variant === 'sm' ? 'default' : variant
  const buttonSize = variant === 'sm' ? 'sm' : 'default'

  return (
    <Button
      variant={buttonVariant as any}
      size={buttonSize}
      onClick={openModal}
      className={cn(className)}
    >
      {children || (
        <>
          <Plus className="h-4 w-4 mr-2" />
          {variant === 'sm' ? 'Add Your First Expense' : 'Add Expense'}
        </>
      )}
    </Button>
  )
} 