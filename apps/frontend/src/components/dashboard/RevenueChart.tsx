import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RevenueChart({ title, data, suffix = '%' }: { title: string; data: { label: string; value: number }[]; suffix?: string }) {
  const max = Math.max(...data.map((item) => item.value))
  const points = data.map((item, index) => {
    const x = 28 + index * (544 / Math.max(data.length - 1, 1))
    const y = 170 - (item.value / max) * 130
    return `${x},${y}`
  }).join(' ')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-muted-foreground text-xs">May - October 2026</p>
      </CardHeader>
      <CardContent>
        <div className="h-52 w-full">
          <svg viewBox="0 0 600 190" className="h-full w-full overflow-visible" role="img" aria-label={title}>
            {[40, 80, 120, 160].map((y) => <line key={y} x1="28" x2="572" y1={y} y2={y} stroke="currentColor" className="text-border" strokeDasharray="4 4" />)}
            <polyline points={points} fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" strokeLinejoin="round" />
            {data.map((item, index) => {
              const x = 28 + index * (544 / Math.max(data.length - 1, 1))
              const y = 170 - (item.value / max) * 130
              return <g key={item.label}><circle cx={x} cy={y} r="4" fill="currentColor" className="text-primary" /><text x={x} y="185" textAnchor="middle" className="fill-muted-foreground text-[10px]">{item.label}</text></g>
            })}
          </svg>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>Current period</span><span className="font-medium text-primary">{data[data.length - 1]?.value}{suffix}</span></div>
      </CardContent>
    </Card>
  )
}
