import type { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import {
  Bell, CreditCard, LayoutDashboard, LogOut, ReceiptText,
  Repeat2, Search, Users, Building2, UserCog,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

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
  const location = useLocation()
  const route = role.toLowerCase()
  const { signOut } = useAuth()
  const handleSignOut = async () => {
    await signOut()
    await navigate({ to: '/auth' })
  }

  const links = role === 'CUSTOMER'
    ? [
        { label: 'Overview', icon: LayoutDashboard, path: `/dashboard/${route}` }, 
        { label: 'Subscriptions', icon: Repeat2, path: `/dashboard/${route}/subscriptions` }, 
        { label: 'Invoices', icon: ReceiptText, path: `/dashboard/${route}/invoices` }, 
        { label: 'Payments', icon: CreditCard, path: `/dashboard/${route}/payments` }
      ]
    : role === 'ADMIN'
      ? [
          { label: 'Overview', icon: LayoutDashboard, path: `/dashboard/${route}` }, 
          { label: 'Staff', icon: UserCog, path: '/dashboard/admin-staff' }, 
          { label: 'Customers', icon: Users, path: `/dashboard/${route}/customers` }, 
          { label: 'Subscriptions', icon: Repeat2, path: `/dashboard/${route}/subscriptions` }, 
          { label: 'Invoices', icon: ReceiptText, path: `/dashboard/${route}/invoices` }, 
          { label: 'Payments', icon: CreditCard, path: `/dashboard/${route}/payments` }
        ]
      : [
          { label: 'Overview', icon: LayoutDashboard, path: `/dashboard/${route}` }, 
          { label: 'Customers', icon: Users, path: `/dashboard/${route}/customers` }, 
          { label: 'Subscriptions', icon: Repeat2, path: `/dashboard/${route}/subscriptions` }, 
          { label: 'Invoices', icon: ReceiptText, path: `/dashboard/${route}/invoices` }, 
          { label: 'Payments', icon: CreditCard, path: `/dashboard/${route}/payments` }
        ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card fixed top-0 left-0 right-0 z-30 flex h-16 items-center border-b">
        <div className="hidden h-full w-64 items-center gap-2 border-r px-6 lg:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"><Building2 className="h-5 w-5" /></div>
          <div><p className="font-bold">Brightloop</p><p className="text-xs text-muted-foreground">Subscription hub</p></div>
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Search" placeholder="Search anything..." className="pl-9" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm">BL</div>
          </div>
        </div>
      </header>

      <aside className="bg-card fixed inset-y-0 top-16 left-0 hidden w-64 flex-col border-r lg:flex">
        <nav className="flex-1 space-y-1 p-4">
          {links.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path
            return (
              <Link 
                key={label} 
                to={path} 
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />{label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4 mt-auto">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </aside>

      <div className="lg:pl-34  min-h-screen">
        <main className="mx-auto max-w-[1440px] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
