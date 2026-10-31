export const customerStats = [
  { label: 'Active Subscriptions', value: '3', change: 'All running normally', tone: 'violet' },
  { label: 'Upcoming Renewals', value: '1', change: 'November 8, 2026', tone: 'blue' },
  { label: 'Unpaid Invoices', value: '2', change: '$1,860 due', tone: 'amber' },
  { label: 'Total Payments Made', value: '$18,240', change: 'This year', tone: 'emerald' },
] as const

export const customerSubscriptions = [
  { number: 'SUB-8841', plan: 'Annual Enterprise', status: 'Active', start: 'Nov 8, 2025', renewal: 'Nov 8, 2026', amount: '$4,800.00' },
  { number: 'SUB-8620', plan: 'Business Management', status: 'Active', start: 'Mar 15, 2026', renewal: 'Nov 15, 2026', amount: '$960.00' },
  { number: 'SUB-8513', plan: 'Priority Support Add-on', status: 'Active', start: 'Jan 10, 2026', renewal: 'Nov 10, 2026', amount: '$360.00' },
]

export const customerInvoices = [
  { number: 'INV-10480', date: 'Oct 29, 2026', due: 'Nov 28, 2026', amount: '$1,240.00', status: 'Pending' },
  { number: 'INV-10451', date: 'Sep 29, 2026', due: 'Oct 29, 2026', amount: '$620.00', status: 'Overdue' },
  { number: 'INV-10412', date: 'Aug 29, 2026', due: 'Sep 28, 2026', amount: '$1,240.00', status: 'Paid' },
]

export const customerPayments = [
  { date: 'Sep 28, 2026', invoice: 'INV-10412', method: 'Credit card', amount: '$1,240.00' },
  { date: 'Aug 28, 2026', invoice: 'INV-10382', method: 'Bank transfer', amount: '$1,240.00' },
  { date: 'Jul 28, 2026', invoice: 'INV-10344', method: 'Credit card', amount: '$1,240.00' },
]
