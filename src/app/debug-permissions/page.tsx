'use client';

import DebugPermissions from '@/components/DebugPermissions/DebugPermissions';
import TokenDebug from '@/components/DebugPermissions/TokenDebug';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function DebugPermissionsPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <p>Please <a href="/auth/login" className="text-blue-600 underline">login</a> to see debug information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">RBAC Debug Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Permission Debug</h2>
          <DebugPermissions />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Token Debug</h2>
          <TokenDebug />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Raw User Object from useUser():</h3>
        <pre className="text-sm overflow-auto bg-white p-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
