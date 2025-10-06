// app/inventory/grn/edit/page.tsx - EDIT GRN PAGE
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GRNModal from '../../../../components/inventory/GRNModal';

const EditGRNPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const grnId = searchParams.get('id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!grnId) {
      router.push('/inventory/grn');
    } else {
      setLoading(false);
    }
  }, [grnId, router]);

  if (loading || !grnId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Full screen modal for edit */}
      <GRNModal
        mode="edit"
        grnId={grnId}
        onClose={() => router.push('/inventory/grn')}
        onSuccess={() => router.push('/inventory/grn')}
      />
    </div>
  );
};

export default EditGRNPage;
