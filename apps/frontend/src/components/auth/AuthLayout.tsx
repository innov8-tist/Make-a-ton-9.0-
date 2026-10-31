import React from 'react';
import { Building2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 to-transparent" />
      <header className="relative flex h-16 items-center justify-between border-b px-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold leading-tight">Brightloop</p>
            <p className="text-xs text-muted-foreground">Subscription hub</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-10 md:p-8">
        <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Secure workspace</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
