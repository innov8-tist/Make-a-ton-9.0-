export const staffStats = [
  { label: 'Total Customers', value: '1,248', change: '+24 this month', tone: 'blue' },
  { label: 'Active Subscriptions', value: '892', change: '+31 this month', tone: 'violet' },
  { label: 'Pending Quotations', value: '128', change: '18 need review', tone: 'amber' },
  { label: 'Unpaid Invoices', value: '114', change: '$42,680 outstanding', tone: 'rose' },
  { label: 'Overdue Invoices', value: '37', change: '$18,920 overdue', tone: 'rose' },
] as const

export const staffRegistrations = [
  { name: 'Harbor & Pine', plan: 'Monthly Starter', date: 'Today, 9:42 AM' },
  { name: 'Redwood Digital', plan: 'Annual Growth', date: 'Yesterday' },
  { name: 'Canvas Works', plan: 'Monthly Growth', date: 'Oct 29' },
]

export const staffQuotations = [
  { number: 'QT-2086', customer: 'Acme Technologies', amount: '$12,600', expires: 'Nov 4' },
  { number: 'QT-2085', customer: 'Northstar Labs', amount: '$4,800', expires: 'Nov 5' },
  { number: 'QT-2082', customer: 'Vertex Studio', amount: '$1,240', expires: 'Nov 7' },
]

export const staffSubscriptions = [
  { number: 'SUB-8842', customer: 'Atlas Commerce', plan: 'Monthly Growth', status: 'Active' },
  { number: 'SUB-8841', customer: 'Acme Technologies', plan: 'Annual Enterprise', status: 'Confirmed' },
  { number: 'SUB-8838', customer: 'Summit Cloud', plan: 'Monthly Starter', status: 'Active' },
]

export const followUps = [
  { invoice: 'INV-10481', customer: 'Vertex Studio', due: '3 days ago', amount: '$1,240' },
  { invoice: 'INV-10476', customer: 'Greenline Foods', due: 'Today', amount: '$3,560' },
  { invoice: 'INV-10474', customer: 'Mosaic Agency', due: 'Tomorrow', amount: '$980' },
]

export const renewals = [
  { customer: 'Atlas Commerce', plan: 'Monthly Growth', date: 'Nov 3', amount: '$2,480' },
  { customer: 'Northstar Labs', plan: 'Annual Enterprise', date: 'Nov 8', amount: '$4,800' },
  { customer: 'Summit Cloud', plan: 'Monthly Starter', date: 'Nov 12', amount: '$640' },
]

export const staffPayments = [
  { customer: 'Northstar Labs', invoice: 'INV-10482', method: 'Bank transfer', amount: '$4,800' },
  { customer: 'Acme Technologies', invoice: 'INV-10480', method: 'Card', amount: '$12,600' },
  { customer: 'Atlas Commerce', invoice: 'INV-10478', method: 'UPI', amount: '$2,480' },
]
