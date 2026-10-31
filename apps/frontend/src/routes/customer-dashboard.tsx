import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer-dashboard')({
  component: CustomerDashboard,
});

function CustomerDashboard() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg text-gray-700 mb-4">
            Welcome to your Customer Dashboard! Manage your account and view your services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">My Orders</h3>
              <p className="text-sm text-gray-600">View your order history</p>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Account Settings</h3>
              <p className="text-sm text-gray-600">Update your profile</p>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Support</h3>
              <p className="text-sm text-gray-600">Get help and support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
