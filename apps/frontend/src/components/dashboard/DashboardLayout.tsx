import type { ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Bell, CreditCard, LayoutDashboard, LogOut, ReceiptText,
  Repeat2, Search, Settings, Users, Building2,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export type DashboardRole = 'ADMIN' | 'STAFF' | 'CUSTOMER'

const roleNames: Record<DashboardRole, string> = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
  CUSTOMER: 'Customer',
}

export function DashboardLayout({
  role, title, subtitle, children,
}: { role: DashboardRole; title: string; subtitle: string; children: ReactNode }) {
  const navigate = useNavigate()
  const route = role.toLowerCase()
  const changeRole = (nextRole: DashboardRole) => {
    localStorage.setItem('brightloop-preview-role', nextRole)
    navigate({ to: `/dashboard/${nextRole.toLowerCase()}` })
  }

  const links = role === 'CUSTOMER'
    ? [{ label: 'Overview', icon: LayoutDashboard }, { label: 'Subscriptions', icon: Repeat2 }, { label: 'Invoices', icon: ReceiptText }, { label: 'Payments', icon: CreditCard }]
    : [{ label: 'Overview', icon: LayoutDashboard }, { label: 'Customers', icon: Users }, { label: 'Subscriptions', icon: Repeat2 }, { label: 'Invoices', icon: ReceiptText }, { label: 'Payments', icon: CreditCard }]

  return (
    <div className="min-h-screen bg-background">
      <aside className="bg-card fixed inset-y-0 left-0 hidden w-64 flex-col border-r lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"><Building2 className="h-5 w-5" /></div>
          <div><p className="font-bold">Brightloop</p><p className="text-xs text-muted-foreground">Subscription hub</p></div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
          {links.map(({ label, icon: Icon }, index) => (
            <Link key={label} to={`/dashboard/${route}`} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${index === 0 ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
              <Icon className="h-4.5 w-4.5" />{label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 rounded-md border bg-muted/50 p-3 text-xs"><p className="font-semibold text-primary">Preview mode</p><p className="mt-1 text-muted-foreground">Role data is mocked locally.</p></div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground"><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="bg-card/95 sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-8">
          <div className="hidden items-center gap-2 md:flex md:w-72">
            <div className="relative w-full"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search" placeholder="Search anything..." className="pl-9" /></div>
          </div>
          <div className="flex items-center gap-2 md:ml-auto">
            <Select
              aria-label="Preview role"
              value={role}
              onChange={(event) => changeRole(event.target.value as DashboardRole)}
            >
              <option value="ADMIN">Admin preview</option>
              <option value="STAFF">Staff preview</option>
              <option value="CUSTOMER">Customer preview</option>
            </Select>
            <ThemeToggle />
            <Button variant="outline" size="icon" aria-label="Notifications" className="relative"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" /></Button>
            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm">BL</div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-4 md:p-8">
          <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
            <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{roleNames[role]} workspace</p><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>
            <Button variant="outline" size="icon" aria-label="Settings"><Settings className="h-4 w-4" /></Button>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
