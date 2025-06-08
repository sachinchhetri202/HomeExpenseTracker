"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Users, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowDownRight
} from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

/**
 * Balances Page - Track shared expenses and settlements
 * 
 * Layout Strategy:
 * - Two-column layout for "You Owe" vs "Owed To You"
 * - Clear visual distinction between debt and credit
 * - User avatars and names for easy identification
 * - Settlement action buttons prominently placed
 * - ARIA labels for financial accessibility
 * 
 * Features:
 * - Balance overview cards
 * - Individual user balance breakdown
 * - Settlement tracking
 * - Payment request functionality
 * - Balance history
 */

// Mock data - in a real app, this would come from your database
const mockBalanceData = {
  currentUser: {
    id: 'user-1',
    name: 'John Doe',
    totalPaid: 1250.75,
    totalOwed: 987.50,
    netBalance: 263.25 // Positive means others owe you, negative means you owe others
  },
  balances: [
    {
      userId: 'user-2',
      userName: 'Jane Smith',
      userAvatar: 'J',
      amount: 125.50, // Positive means they owe you, negative means you owe them
      lastActivity: '2024-01-15',
      status: 'pending' // pending, settled
    },
    {
      userId: 'user-3',
      userName: 'Bob Wilson',
      userAvatar: 'B',
      amount: 87.25,
      lastActivity: '2024-01-14',
      status: 'pending'
    },
    {
      userId: 'user-4',
      userName: 'Alice Johnson',
      userAvatar: 'A',
      amount: -45.75, // You owe Alice
      lastActivity: '2024-01-13',
      status: 'pending'
    },
    {
      userId: 'user-5',
      userName: 'Charlie Brown',
      userAvatar: 'C',
      amount: 96.25,
      lastActivity: '2024-01-12',
      status: 'settled'
    }
  ],
  recentTransactions: [
    {
      id: 'txn-1',
      description: 'Grocery Shopping',
      amount: 127.50,
      paidBy: 'John Doe',
      splitAmong: ['Jane Smith', 'Bob Wilson'],
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: 'txn-2',
      description: 'Utilities Bill',
      amount: 89.32,
      paidBy: 'Jane Smith',
      splitAmong: ['John Doe', 'Bob Wilson'],
      date: '2024-01-14',
      type: 'expense'
    },
    {
      id: 'txn-3',
      description: 'Settlement Payment',
      amount: 50.00,
      paidBy: 'Bob Wilson',
      paidTo: 'John Doe',
      date: '2024-01-13',
      type: 'settlement'
    }
  ]
}

export default function BalancesPage() {
  // Mock data - in real app, this would come from API/database
  const balances: any[] = []
  const hasBalances = balances.length > 0
  const totalOwedToYou = 0
  const totalYouOwe = 0

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Balances
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track shared expenses and settlements
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Settle Up
        </Button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* You Owe */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-600 dark:text-red-400">
              <ArrowUpRight className="h-5 w-5 mr-2" />
              You Owe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              ${totalYouOwe.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total amount you owe
            </p>
          </CardContent>
        </Card>

        {/* Owed To You */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-600 dark:text-green-400">
              <ArrowDownRight className="h-5 w-5 mr-2" />
              Owed To You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${totalOwedToYou.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total amount owed to you
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Details</CardTitle>
          <CardDescription>
            Individual balances with household members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasBalances ? (
            <div className="space-y-4">
              {/* Balance list would go here */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Balance details would be rendered here...
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No balances yet"
              description="Start splitting expenses with household members to track balances"
              action={
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Invite Household Members
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest balance changes and settlements</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={DollarSign}
            title="No recent activity"
            description="Balance changes and settlements will appear here"
            className="py-8"
          />
        </CardContent>
      </Card>
    </div>
  )
} 