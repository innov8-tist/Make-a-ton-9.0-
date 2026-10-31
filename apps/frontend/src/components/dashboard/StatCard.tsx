import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export type StatTone = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose'

const tones: Record<StatTone, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  violet: 'bg-primary/10 text-primary',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
}

export function StatCard({
  label, value, change, tone = 'blue', icon: Icon,
}: {
  label: string
  value: string
  change: string
  tone?: StatTone
  icon: LucideIcon
}) {
  const isNegative = change.startsWith('-')
  return (
    <Card className="border-border/70 shadow-xs transition-shadow hover:shadow-md">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            {change.includes('%') && (isNegative ? <ArrowDownRight className="h-3.5 w-3.5 text-primary" /> : <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />)}
            {change}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
      </CardContent>
    </Card>
  )
}
