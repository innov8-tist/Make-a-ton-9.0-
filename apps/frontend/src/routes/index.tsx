import { createFileRoute } from '@tanstack/react-router'
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: DashboardRedirect,
})

function DashboardRedirect() {
  const role = localStorage.getItem('brightloop-preview-role') ?? 'ADMIN'
  const destination = role === 'STAFF' ? '/dashboard/staff' : role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/admin'
  return <Navigate to={destination} />
}
