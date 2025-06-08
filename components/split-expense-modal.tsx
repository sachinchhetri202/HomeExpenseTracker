"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { splitEvenly, splitCustom, formatCurrency, type SplitResult, type CustomSplit } from '@/lib/utils'
import { 
  Users, 
  Calculator, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Divide
} from 'lucide-react'

interface HouseholdMember {
  id: string
  name: string
  email: string
  avatar: string
}

interface SplitExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (splits: SplitResult[]) => void
  totalAmount: number
  householdMembers: HouseholdMember[]
  currentUserId: string
}

export function SplitExpenseModal({
  isOpen,
  onClose,
  onSave,
  totalAmount,
  householdMembers,
  currentUserId
}: SplitExpenseModalProps) {
  const [splitType, setSplitType] = useState<'even' | 'custom'>('even')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUserId])
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({})
  const [splits, setSplits] = useState<SplitResult[]>([])
  const [errors, setErrors] = useState<string[]>([])

  // Calculate splits whenever dependencies change
  useEffect(() => {
    if (selectedMembers.length === 0) {
      setSplits([])
      setErrors(['Please select at least one person to split with'])
      return
    }

    try {
      let newSplits: SplitResult[]

      if (splitType === 'even') {
        newSplits = splitEvenly(totalAmount, selectedMembers)
        setErrors([])
      } else {
        // Custom split
        const customSplits: CustomSplit[] = selectedMembers.map(memberId => ({
          userId: memberId,
          amount: parseFloat(customAmounts[memberId] || '0') || 0
        }))

        newSplits = splitCustom(totalAmount, customSplits)
        setErrors([])
      }

      setSplits(newSplits)
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Invalid split configuration'])
      setSplits([])
    }
  }, [splitType, selectedMembers, customAmounts, totalAmount])

  // Initialize custom amounts when switching to custom split
  useEffect(() => {
    if (splitType === 'custom' && selectedMembers.length > 0) {
      const evenAmount = totalAmount / selectedMembers.length
      const newCustomAmounts: Record<string, string> = {}
      selectedMembers.forEach(memberId => {
        if (!customAmounts[memberId]) {
          newCustomAmounts[memberId] = evenAmount.toFixed(2)
        }
      })
      if (Object.keys(newCustomAmounts).length > 0) {
        setCustomAmounts(prev => ({ ...prev, ...newCustomAmounts }))
      }
    }
  }, [splitType, selectedMembers, totalAmount])

  const handleMemberToggle = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId])
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId))
      // Remove custom amount for unselected member
      setCustomAmounts(prev => {
        const newAmounts = { ...prev }
        delete newAmounts[memberId]
        return newAmounts
      })
    }
  }

  const handleCustomAmountChange = (memberId: string, value: string) => {
    // Allow empty string and valid decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmounts(prev => ({
        ...prev,
        [memberId]: value
      }))
    }
  }

  const handleSave = () => {
    if (splits.length > 0 && errors.length === 0) {
      onSave(splits)
      onClose()
    }
  }

  const handleReset = () => {
    setSplitType('even')
    setSelectedMembers([currentUserId])
    setCustomAmounts({})
    setErrors([])
  }

  const totalCustomAmount = selectedMembers.reduce((sum, memberId) => {
    return sum + (parseFloat(customAmounts[memberId] || '0') || 0)
  }, 0)

  const getMemberName = (memberId: string) => {
    const member = householdMembers.find(m => m.id === memberId)
    return member?.name || 'Unknown'
  }

  const getMemberAvatar = (memberId: string) => {
    const member = householdMembers.find(m => m.id === memberId)
    return member?.avatar || '?'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Divide className="mr-2 h-5 w-5" />
            Split Expense
          </DialogTitle>
          <DialogDescription>
            Choose how to split {formatCurrency(totalAmount)} among your roommates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Split Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Split Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={splitType} onValueChange={(value: 'even' | 'custom') => setSplitType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="even" id="even" />
                  <Label htmlFor="even" className="flex items-center cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    Split Evenly
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="flex items-center cursor-pointer">
                    <Calculator className="mr-2 h-4 w-4" />
                    Custom Amounts
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Member Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select People</CardTitle>
              <CardDescription>Choose who should split this expense</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {householdMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={member.id}
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={(checked) => handleMemberToggle(member.id, checked as boolean)}
                      />
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {member.avatar}
                        </span>
                      </div>
                      <div>
                        <Label htmlFor={member.id} className="font-medium cursor-pointer">
                          {member.name}
                          {member.id === currentUserId && ' (You)'}
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {splitType === 'custom' && selectedMembers.includes(member.id) && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          value={customAmounts[member.id] || ''}
                          onChange={(e) => handleCustomAmountChange(member.id, e.target.value)}
                          placeholder="0.00"
                          className="w-20 text-right"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Split Preview */}
          {splits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Split Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {splits.map((split) => (
                    <div key={split.userId} className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {getMemberAvatar(split.userId)}
                          </span>
                        </div>
                        <span className="font-medium">
                          {getMemberName(split.userId)}
                          {split.userId === currentUserId && ' (You)'}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(split.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                {splitType === 'custom' && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className={`font-semibold ${
                        Math.abs(totalCustomAmount - totalAmount) < 0.01 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(totalCustomAmount)} / {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    {errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between space-x-3">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={splits.length === 0 || errors.length > 0}
              >
                Save Split
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 