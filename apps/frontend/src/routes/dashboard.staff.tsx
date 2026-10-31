import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, CreditCard, FileClock, RefreshCw, Users } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { followUps, renewals, staffPayments, staffQuotations, staffRegistrations, staffStats, staffSubscriptions } from '@/mocks/staff-dashboard'

export const Route = createFileRoute('/dashboard/staff')({
  component: StaffDashboard,
})

function StaffDashboard() {
  const icons = [Users, RefreshCw, FileClock, CreditCard, AlertTriangle]
  return (
    <DashboardLayout role="STAFF" title="Daily operations" subtitle="Keep subscriptions, quotes, and customer follow-ups moving.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {staffStats.map((stat, index) => <StatCard key={stat.label} {...stat} icon={icons[index]!} />)}
      </section>

      <section className="mt-6 flex flex-wrap gap-3 rounded-xl border bg-card p-4">
        {['View Customers', 'View Subscriptions', 'View Quotations', 'View Invoices', 'View Payments'].map((label) => <Button key={label} variant="outline" size="sm" disabled title="Available after frontend module is connected">{label}</Button>)}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <OperationsCard title="Recent registrations">
          {staffRegistrations.map((item) => <ListRow key={item.name} primary={item.name} secondary={item.plan} meta={item.date} />)}
        </OperationsCard>
        <OperationsCard title="Recent quotations">
          {staffQuotations.map((item) => <ListRow key={item.number} primary={`${item.number} · ${item.customer}`} secondary={`Expires ${item.expires}`} meta={item.amount} />)}
        </OperationsCard>
        <OperationsCard title="Recently created subscriptions">
          {staffSubscriptions.map((item) => <ListRow key={item.number} primary={`${item.number} · ${item.customer}`} secondary={item.plan} meta={item.status} />)}
        </OperationsCard>
        <OperationsCard title="Pending invoice follow-ups">
          {followUps.map((item) => <ListRow key={item.invoice} primary={`${item.invoice} · ${item.customer}`} secondary={`Due ${item.due}`} meta={item.amount} />)}
        </OperationsCard>
        <OperationsCard title="Upcoming renewals">
          {renewals.map((item) => <ListRow key={item.customer} primary={item.customer} secondary={`${item.plan} · ${item.date}`} meta={item.amount} />)}
        </OperationsCard>
        <OperationsCard title="Recent payments">
          {staffPayments.map((item) => <ListRow key={item.invoice} primary={item.customer} secondary={`${item.method} · ${item.invoice}`} meta={item.amount} />)}
        </OperationsCard>
      </section>
    </DashboardLayout>
  )
}

function OperationsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{children}</CardContent></Card>
}

function ListRow({ primary, secondary, meta }: { primary: string; secondary: string; meta: string }) {
  return <div className="flex items-start justify-between gap-3 border-b py-3 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-medium">{primary}</p><p className="mt-1 text-xs text-muted-foreground">{secondary}</p></div><span className="shrink-0 text-xs font-medium text-muted-foreground">{meta}</span></div>
}
