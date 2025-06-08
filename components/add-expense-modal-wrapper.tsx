"use client"

import { AddExpenseModal } from '@/components/add-expense-modal'
import { useAddExpense } from '@/lib/add-expense-context'

export function AddExpenseModalWrapper() {
  const { isOpen, closeModal } = useAddExpense()
  
  return <AddExpenseModal isOpen={isOpen} onClose={closeModal} />
} 