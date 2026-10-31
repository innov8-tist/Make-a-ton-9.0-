export const adminStats = [
  { label: 'Total Customers', value: '1,248', change: '+12.5%', tone: 'blue' },
  { label: 'Active Subscriptions', value: '892', change: '+8.2%', tone: 'violet' },
  { label: 'Total Revenue', value: '$284,920', change: '+16.8%', tone: 'emerald' },
  { label: 'Outstanding Payments', value: '$42,680', change: '-4.1%', tone: 'amber' },
  { label: 'Overdue Invoices', value: '37', change: '-7.3%', tone: 'rose' },
] as const

export const revenueData = [
  { label: 'May', value: 38 }, { label: 'Jun', value: 44 },
  { label: 'Jul', value: 41 }, { label: 'Aug', value: 52 },
  { label: 'Sep', value: 58 }, { label: 'Oct', value: 67 },
]

export const growthData = [
  { label: 'May', value: 64 }, { label: 'Jun', value: 68 },
  { label: 'Jul', value: 73 }, { label: 'Aug', value: 79 },
  { label: 'Sep', value: 84 }, { label: 'Oct', value: 92 },
]

export const adminActivity = [
  { title: 'New subscription created', detail: 'Acme Technologies · Annual Enterprise', time: '12 min ago', tone: 'violet' },
  { title: 'Payment received', detail: 'Northstar Labs paid INV-10482 · $4,800', time: '38 min ago', tone: 'emerald' },
  { title: 'Customer registered', detail: 'Harbor & Pine joined Brightloop', time: '1 hr ago', tone: 'blue' },
  { title: 'Invoice generated', detail: 'INV-10481 for Vertex Studio', time: '2 hrs ago', tone: 'amber' },
  { title: 'Subscription renewed', detail: 'Atlas Commerce · Monthly Growth', time: '3 hrs ago', tone: 'violet' },
]

export const adminTransactions = [
  { invoice: 'INV-10482', customer: 'Northstar Labs', amount: '$4,800.00', status: 'Paid', date: 'Oct 31, 2026' },
  { invoice: 'INV-10481', customer: 'Vertex Studio', amount: '$1,240.00', status: 'Overdue', date: 'Oct 30, 2026' },
  { invoice: 'INV-10480', customer: 'Acme Technologies', amount: '$12,600.00', status: 'Paid', date: 'Oct 29, 2026' },
  { invoice: 'INV-10479', customer: 'Harbor & Pine', amount: '$890.00', status: 'Pending', date: 'Oct 29, 2026' },
  { invoice: 'INV-10478', customer: 'Atlas Commerce', amount: '$2,480.00', status: 'Paid', date: 'Oct 28, 2026' },
]

export const subscriptionStatuses = [
  { label: 'Draft', value: 74, color: 'bg-slate-400' },
  { label: 'Quotation', value: 128, color: 'bg-sky-500' },
  { label: 'Confirmed', value: 96, color: 'bg-amber-500' },
  { label: 'Active', value: 892, color: 'bg-violet-500' },
  { label: 'Closed', value: 310, color: 'bg-slate-300' },
]
