// app/inventory/dispatch/edit/page.tsx - EDIT DISPATCH PAGE
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DispatchModal from '../../../../components/inventory/DispatchModal';

const EditDispatchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatchId = searchParams.get('id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dispatchId) {
      console.log('❌ No dispatch ID provided, redirecting...');
      router.push('/inventory/dispatch');
    } else {
      console.log(`✏️ Loading edit page for Dispatch ID: ${dispatchId}`);
      setLoading(false);
    }
  }, [dispatchId, router]);

  if (loading || !dispatchId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading dispatch for edit...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Full screen modal for edit dispatch */}
      <DispatchModal
        mode="edit"
        dispatchId={dispatchId}
        onClose={() => router.push('/inventory/dispatch')}
        onSuccess={() => router.push('/inventory/dispatch')}
      />
    </div>
  );
};

export default EditDispatchPage;
