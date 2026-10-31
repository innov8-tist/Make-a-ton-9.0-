import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function StatusBadge({ status }: { status: string }) {
  const variants = {
    Paid: 'success', Active: 'success', Pending: 'warning',
    Overdue: 'destructive', Confirmed: 'info',
  } as const
  return <Badge variant={variants[status as keyof typeof variants] ?? 'secondary'}>{status}</Badge>
}

export function DataTable({ title, columns, rows }: { title: string; columns: string[]; rows: ReactNode[][] }) {
  return (
    <Card>
      <CardHeader className="pb-4"><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50"><TableRow>{columns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{rows.map((row, rowIndex) => <TableRow key={rowIndex}>{row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)}</TableRow>)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
