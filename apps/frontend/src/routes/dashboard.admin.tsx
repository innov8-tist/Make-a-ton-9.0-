import { createFileRoute, redirect } from '@tanstack/react-router'
import { dashboardPathForRole, getStoredUser } from '@/lib/auth-session'
import { AlertTriangle, Banknote, CreditCard, RefreshCw, Users } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { DataTable, StatusBadge } from '@/components/dashboard/DataTable'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminActivity, adminStats, adminTransactions, growthData, revenueData, subscriptionStatuses } from '@/mocks/admin-dashboard'

export const Route = createFileRoute('/dashboard/admin')({
  beforeLoad: () => {
    const user = getStoredUser()
    if (!user) throw redirect({ to: '/auth' })
    if (dashboardPathForRole(user.role) !== '/dashboard/admin') {
      throw redirect({ to: dashboardPathForRole(user.role) as '/dashboard/staff' | '/dashboard/customer' | '/dashboard/admin' })
    }
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const icons = [Users, RefreshCw, Banknote, CreditCard, AlertTriangle]
  return (
    <DashboardLayout role="ADMIN" title="Business overview" subtitle="Here is what is happening across your subscription business.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {adminStats.map((stat, index) => <StatCard key={stat.label} {...stat} icon={icons[index]!} />)}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <RevenueChart title="Monthly revenue" data={revenueData} suffix="k" />
        <RevenueChart title="Subscription growth" data={growthData} suffix="%" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Subscription overview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {subscriptionStatuses.map((status) => (
              <div key={status.label}>
                <div className="mb-1.5 flex justify-between text-sm"><span className="text-muted-foreground">{status.label}</span><span className="font-medium">{status.value}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full ${status.color}`} style={{ width: `${Math.max(9, status.value / 892 * 100)}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
          <CardContent>
            {adminActivity.map((item) => (
              <div key={item.title} className="flex gap-3 border-b py-3 last:border-0">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.tone === 'emerald' ? 'bg-emerald-500' : item.tone === 'blue' ? 'bg-blue-500' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-primary'}`} />
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">{item.title}</p><p className="truncate text-xs text-muted-foreground">{item.detail}</p></div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <DataTable
          title="Recent transactions"
          columns={['Invoice number', 'Customer', 'Amount', 'Payment status', 'Invoice date']}
          rows={adminTransactions.map((row) => [row.invoice, row.customer, row.amount, <StatusBadge key={row.invoice} status={row.status} />, row.date])}
        />
      </section>
    </DashboardLayout>
  )
}
