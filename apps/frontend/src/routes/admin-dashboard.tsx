import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin-dashboard')({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to the Admin Dashboard! You have full access to all system features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage users and permissions</p>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">System Settings</h3>
              <p className="text-sm text-gray-600">Configure system preferences</p>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Reports</h3>
              <p className="text-sm text-gray-600">View detailed analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
