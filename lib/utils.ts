import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Expense splitting utilities
export interface SplitResult {
  userId: string
  amount: number
}

export interface CustomSplit {
  userId: string
  amount: number
}

/**
 * Split an expense evenly among users, handling odd cents by adjusting the last user's share
 * @param totalAmount - Total expense amount
 * @param userIds - Array of user IDs to split among
 * @returns Array of split results with exact amounts
 */
export function splitEvenly(totalAmount: number, userIds: string[]): SplitResult[] {
  if (userIds.length === 0) {
    throw new Error('Cannot split expense among zero users')
  }

  const baseAmount = Math.floor((totalAmount * 100) / userIds.length) / 100
  const remainder = Math.round((totalAmount - baseAmount * userIds.length) * 100) / 100

  return userIds.map((userId, index) => ({
    userId,
    amount: index === userIds.length - 1 ? baseAmount + remainder : baseAmount
  }))
}

/**
 * Create custom splits with validation
 * @param totalAmount - Total expense amount
 * @param customSplits - Array of custom split amounts
 * @returns Validated split results
 */
export function splitCustom(totalAmount: number, customSplits: CustomSplit[]): SplitResult[] {
  if (customSplits.length === 0) {
    throw new Error('Cannot create custom split with no users')
  }

  const totalSplit = customSplits.reduce((sum, split) => sum + split.amount, 0)
  const tolerance = 0.01 // Allow 1 cent tolerance for rounding

  if (Math.abs(totalSplit - totalAmount) > tolerance) {
    throw new Error(
      `Custom split total (${totalSplit.toFixed(2)}) does not match expense amount (${totalAmount.toFixed(2)})`
    )
  }

  return customSplits.map(split => ({
    userId: split.userId,
    amount: Math.round(split.amount * 100) / 100 // Round to cents
  }))
}

/**
 * Calculate balance between two users based on their expense splits
 * @param userAExpenses - Expenses paid by user A
 * @param userBExpenses - Expenses paid by user B
 * @param userASplits - Splits owed by user A
 * @param userBSplits - Splits owed by user B
 * @returns Positive if user A owes user B, negative if user B owes user A
 */
export function calculateBalance(
  userAExpenses: number,
  userBExpenses: number,
  userASplits: number,
  userBSplits: number
): number {
  // What user A paid minus what user A owes
  const userANet = userAExpenses - userASplits
  // What user B paid minus what user B owes
  const userBNet = userBExpenses - userBSplits
  
  // If user A has a positive net and user B has negative, user B owes user A
  return userBNet - userANet
}

/**
 * Generate a random household invite code
 * @param length - Length of the invite code
 * @returns Random alphanumeric string
 */
export function generateInviteCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
} 