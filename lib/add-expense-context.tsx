"use client"

import { createContext, useContext, useState } from 'react'

interface AddExpenseContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const AddExpenseContext = createContext<AddExpenseContextType | undefined>(undefined)

export function AddExpenseProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <AddExpenseContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </AddExpenseContext.Provider>
  )
}

export function useAddExpense() {
  const context = useContext(AddExpenseContext)
  if (context === undefined) {
    throw new Error('useAddExpense must be used within an AddExpenseProvider')
  }
  return context
} 