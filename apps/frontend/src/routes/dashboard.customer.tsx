import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, CreditCard, RefreshCw, ReceiptText } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { DataTable, StatusBadge } from '@/components/dashboard/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { customerInvoices, customerPayments, customerStats, customerSubscriptions } from '@/mocks/customer-dashboard'

export const Route = createFileRoute('/dashboard/customer')({
  component: CustomerDashboard,
})

function CustomerDashboard() {
  const icons = [RefreshCw, CalendarClock, ReceiptText, CreditCard]
  return (
    <DashboardLayout role="CUSTOMER" title="Welcome back, Acme Technologies" subtitle="Manage your subscriptions, invoices, and payments.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {customerStats.map((stat, index) => <StatCard key={stat.label} {...stat} icon={icons[index]!} />)}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Account status</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span className="font-semibold">All subscriptions active</span></div><p className="mt-2 text-sm text-muted-foreground">Your Annual Enterprise plan renews on November 8, 2026.</p></div>
            <div className="rounded-lg border bg-muted/30 px-5 py-3 text-sm"><p className="text-muted-foreground">Annual subscription value</p><p className="mt-1 text-xl font-bold">$4,800</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Renewal reminder</CardTitle></CardHeader>
          <CardContent><p className="text-sm font-medium">Annual Enterprise</p><p className="mt-2 text-sm text-muted-foreground">Renews in 8 days</p><p className="mt-4 text-lg font-bold">$4,800.00</p></CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <DataTable title="My subscriptions" columns={['Subscription', 'Plan', 'Status', 'Start date', 'Renewal / expiry', 'Amount']} rows={customerSubscriptions.map((row) => [row.number, row.plan, <StatusBadge key={row.number} status={row.status} />, row.start, row.renewal, row.amount])} />
      </section>
      <section className="mt-6">
        <DataTable title="My invoices" columns={['Invoice', 'Invoice date', 'Due date', 'Total', 'Status', 'Action']} rows={customerInvoices.map((row) => [row.number, row.date, row.due, row.amount, <StatusBadge key={row.number} status={row.status} />, <Button key={`${row.number}-action`} variant="link" size="sm" className="px-0">View</Button>])} />
      </section>
      <section className="mt-6">
        <DataTable title="Recent payments" columns={['Payment date', 'Invoice number', 'Payment method', 'Amount paid']} rows={customerPayments.map((row) => [row.date, row.invoice, row.method, row.amount])} />
      </section>
    </DashboardLayout>
  )
}
