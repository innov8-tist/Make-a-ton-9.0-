import { createFileRoute, redirect } from '@tanstack/react-router'
import { Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DataTable, StatusBadge } from '@/components/dashboard/DataTable'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { dashboardPathForRole, getStoredUser } from '@/lib/auth-session'
import { staffService, type Staff } from '@/lib/staff-service'

export const Route = createFileRoute('/dashboard/admin-staff')({
  beforeLoad: () => {
    const user = getStoredUser()
    if (!user) throw redirect({ to: '/auth' })
    if (dashboardPathForRole(user.role) !== '/dashboard/admin') {
      throw redirect({
        to: dashboardPathForRole(user.role) as
          '/dashboard/staff' | '/dashboard/customer' | '/dashboard/admin',
      })
    }
  },
  component: AdminStaffManagement,
})

function AdminStaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const data = await staffService.listStaff()
      setStaff(data)
    } catch (err: any) {
      console.error('Failed to fetch staff:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      await staffService.createStaff({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'STAFF',
      })
      setFormData({ name: '', email: '', password: '' })
      setCreateDialogOpen(false)
      fetchStaff()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create staff')
    } finally {
      setCreating(false)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && creating) return
    setCreateDialogOpen(open)
    if (!open) {
      setError('')
      setFormData({ name: '', email: '', password: '' })
    }
  }

  return (
    <DashboardLayout
      role="ADMIN"
      title="Staff Management"
      subtitle="Create and manage staff members."
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-primary h-5 w-5" />
          <h2 className="text-2xl font-bold">Staff Members</h2>
        </div>
        <Button onClick={() => handleDialogOpenChange(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Create a new staff account. They will be able to sign in with the
              email and password you set here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateStaff} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="jane@brightloop.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="Must contain uppercase, lowercase, special char, min 9 chars"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Staff'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DataTable
        title=""
        columns={['Name', 'Email', 'Role', 'Status', 'Created']}
        rows={staff.map((member) => [
          member.name,
          member.email,
          <StatusBadge key={`role-${member.id}`} status={member.role} />,
          <StatusBadge
            key={`status-${member.id}`}
            status={member.isActive ? 'Active' : 'Inactive'}
          />,
          new Date(member.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        ])}
      />
      {staff.length === 0 && !loading && (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No staff members found.
        </p>
      )}
    </DashboardLayout>
  )
}
