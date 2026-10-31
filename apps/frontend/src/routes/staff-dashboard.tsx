import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/staff-dashboard')({
  component: StaffDashboard,
});

function StaffDashboard() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Staff Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to the Staff Dashboard! Manage your daily tasks and customer interactions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Customer Support</h3>
              <p className="text-sm text-gray-600">Handle customer inquiries</p>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Tasks</h3>
              <p className="text-sm text-gray-600">View and manage your tasks</p>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Schedule</h3>
              <p className="text-sm text-gray-600">Check your work schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
