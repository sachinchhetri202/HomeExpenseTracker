import { Users, UserPlus, Settings, Mail, Crown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/empty-state'

/**
 * Household Page - Manage household members and shared settings
 * 
 * Layout Strategy:
 * - Card-based layout for member management
 * - Clear visual hierarchy for member roles
 * - Responsive grid for member cards
 * - ARIA labels for member management accessibility
 * - Proper form validation for invitations
 * 
 * Features:
 * - Household member invitation
 * - Role management (admin/member)
 * - Member removal functionality
 * - Household settings configuration
 * - Invitation link generation
 */

export default function HouseholdPage() {
  // Mock data - in real app, this would come from API/database
  const members: any[] = []
  const hasMembers = members.length > 0
  const isAdmin = true // Current user's role

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Household
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your household members and shared expenses
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Household Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {members.length + 1}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Including you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Shared Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">To be settled</p>
          </CardContent>
        </Card>
      </div>

      {/* Household Members */}
      <Card>
        <CardHeader>
          <CardTitle>Household Members</CardTitle>
          <CardDescription>
            Manage who has access to your shared expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasMembers ? (
            <div className="space-y-4">
              {/* Member list would go here */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Household members would be displayed here...
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No household members yet"
              description="Invite roommates or family members to start sharing expenses"
              action={
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Your First Member
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Invite Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Invite New Member
          </CardTitle>
          <CardDescription>
            Send an invitation to join your household
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteEmail">Email Address</Label>
            <Input
              id="inviteEmail"
              type="email"
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
            <Input
              id="inviteMessage"
              placeholder="Add a personal message to the invitation"
            />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              Send Invitation
            </Button>
            <Button variant="outline">
              Copy Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Household Settings */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Household Settings
            </CardTitle>
            <CardDescription>
              Configure settings for your household
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="householdName">Household Name</Label>
              <Input
                id="householdName"
                defaultValue="My Household"
                placeholder="Enter household name"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Default Split Settings
              </h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Auto-split new expenses
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically split expenses equally among all members
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Require approval for large expenses
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expenses over $100 require approval from other members
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>

            <Button className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 