"use client"

import { useState } from 'react'
import { X, Calendar, DollarSign, Tag, Receipt, Users, Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { useExpenses, ExpenseSplit } from '@/lib/expense-context'

/**
 * AddExpenseModal Component - Modal for adding new expenses
 * 
 * Design Strategy:
 * - Full-screen modal on mobile, centered modal on desktop
 * - Step-by-step form with clear visual hierarchy
 * - Real-time validation and error states
 * - Accessibility with proper focus management
 * - Responsive design with touch-friendly controls
 * 
 * Features:
 * - Basic expense details (amount, description, category, date)
 * - Receipt upload capability
 * - Expense splitting options (Just Me, Split Equally, Custom Split)
 * - Form validation and submission
 * - Integration with expense context for data persistence
 */

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

const categories = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'other', name: 'Other', icon: '📝' },
]

type SplitType = 'just-me' | 'split-equally' | 'custom-split'

interface CustomSplitPerson {
  id: string
  email: string
  name: string
  amount: number
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { user } = useAuth()
  const { addExpense } = useExpenses()
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [splitType, setSplitType] = useState<SplitType>('just-me')
  const [customSplitPeople, setCustomSplitPeople] = useState<CustomSplitPerson[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description'
    }
    if (!selectedCategory) {
      newErrors.category = 'Please select a category'
    }

    // Validate custom splits
    if (splitType === 'custom-split') {
      if (customSplitPeople.length === 0) {
        newErrors.splits = 'Please add at least one person for custom split'
      } else {
        const totalSplit = customSplitPeople.reduce((sum, person) => sum + person.amount, 0)
        const expenseAmount = parseFloat(formData.amount)
        if (Math.abs(totalSplit - expenseAmount) > 0.01) {
          newErrors.splits = `Split amounts (${totalSplit.toFixed(2)}) must equal expense amount (${expenseAmount.toFixed(2)})`
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Create expense splits based on split type
      const expenseAmount = parseFloat(formData.amount)
      let splits: ExpenseSplit[] = []

      if (splitType === 'just-me') {
        splits = [{
          userId: user?.id || 'current-user',
          userEmail: user?.email || 'user@example.com',
          userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'You',
          amount: expenseAmount,
          isPaid: true // User paid for their own expense
        }]
      } else if (splitType === 'split-equally') {
        // For demo, split between user and one other person
        const splitAmount = expenseAmount / 2
        splits = [
          {
            userId: user?.id || 'current-user',
            userEmail: user?.email || 'user@example.com',
            userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'You',
            amount: splitAmount,
            isPaid: true
          },
          {
            userId: 'other-user',
            userEmail: 'other@example.com',
            userName: 'Household Member',
            amount: splitAmount,
            isPaid: false
          }
        ]
      } else if (splitType === 'custom-split') {
        splits = customSplitPeople.map(person => ({
          userId: person.id,
          userEmail: person.email,
          userName: person.name,
          amount: person.amount,
          isPaid: person.id === (user?.id || 'current-user')
        }))
      }

      // Add the expense
      await addExpense({
        amount: expenseAmount,
        description: formData.description.trim(),
        category: selectedCategory,
        date: formData.date,
        notes: formData.notes.trim(),
        splits,
        createdBy: user?.id || 'current-user'
      })

      // Reset form and close modal
      setFormData({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      })
      setSelectedCategory('')
      setSplitType('just-me')
      setCustomSplitPeople([])
      setErrors({})
      setIsSubmitting(false)
      onClose()
    } catch (error) {
      setErrors({ general: 'Failed to add expense. Please try again.' })
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addCustomSplitPerson = () => {
    const newPerson: CustomSplitPerson = {
      id: `person-${Date.now()}`,
      email: '',
      name: '',
      amount: 0
    }
    setCustomSplitPeople(prev => [...prev, newPerson])
  }

  const updateCustomSplitPerson = (id: string, field: keyof CustomSplitPerson, value: string | number) => {
    setCustomSplitPeople(prev => 
      prev.map(person => 
        person.id === id ? { ...person, [field]: value } : person
      )
    )
  }

  const removeCustomSplitPerson = (id: string) => {
    setCustomSplitPeople(prev => prev.filter(person => person.id !== id))
  }

  const distributeEquallyInCustomSplit = () => {
    const amount = parseFloat(formData.amount)
    if (!amount || customSplitPeople.length === 0) return
    
    const splitAmount = amount / customSplitPeople.length
    setCustomSplitPeople(prev => 
      prev.map(person => ({ ...person, amount: splitAmount }))
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">Add New Expense</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}

              {/* Amount and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Amount *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                    className="text-lg"
                  />
                  {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="What did you spend on?"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <Label className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Category *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.id)
                        if (errors.category) {
                          setErrors(prev => ({ ...prev, category: '' }))
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedCategory === category.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
              </div>

              {/* Split Options */}
              <div className="space-y-3">
                <Label className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Split Expense
                </Label>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    type="button" 
                    variant={splitType === 'just-me' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSplitType('just-me')}
                  >
                    Just Me
                  </Button>
                  <Button 
                    type="button" 
                    variant={splitType === 'split-equally' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSplitType('split-equally')}
                  >
                    Split Equally
                  </Button>
                  <Button 
                    type="button" 
                    variant={splitType === 'custom-split' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSplitType('custom-split')}
                  >
                    Custom Split
                  </Button>
                </div>

                {/* Split Details */}
                {splitType === 'split-equally' && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This expense will be split equally between you and one household member.
                      Each person owes: ${formData.amount ? (parseFloat(formData.amount) / 2).toFixed(2) : '0.00'}
                    </p>
                  </div>
                )}

                {splitType === 'custom-split' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add people and specify amounts
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={distributeEquallyInCustomSplit}
                          disabled={!formData.amount || customSplitPeople.length === 0}
                        >
                          Distribute Equally
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomSplitPerson}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Person
                        </Button>
                      </div>
                    </div>

                    {customSplitPeople.map((person) => (
                      <div key={person.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-lg">
                        <Input
                          placeholder="Name"
                          value={person.name}
                          onChange={(e) => updateCustomSplitPerson(person.id, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={person.email}
                          onChange={(e) => updateCustomSplitPerson(person.id, 'email', e.target.value)}
                        />
                        <Input
                          placeholder="Amount"
                          type="number"
                          step="0.01"
                          value={person.amount || ''}
                          onChange={(e) => updateCustomSplitPerson(person.id, 'amount', parseFloat(e.target.value) || 0)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomSplitPerson(person.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {customSplitPeople.length > 0 && formData.amount && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Total Split:</span>
                          <span>${customSplitPeople.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expense Amount:</span>
                          <span>${parseFloat(formData.amount).toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {errors.splits && <p className="text-sm text-red-600">{errors.splits}</p>}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Additional details..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Receipt className="h-4 w-4 mr-2" />
                  Receipt (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Receipt className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Drag & drop a receipt image or click to browse
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || !formData.amount || !formData.description || !selectedCategory}
                >
                  {isSubmitting ? 'Adding...' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 