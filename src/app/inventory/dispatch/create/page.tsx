// app/inventory/dispatch/create/page.tsx - CREATE DISPATCH PAGE
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import DispatchModal from '../../../../components/inventory/DispatchModal';

const CreateDispatchPage = () => {
  const router = useRouter();
  
  return (
    <div>
      {/* Full screen modal for create dispatch */}
      <DispatchModal
        mode="create"
        onClose={() => router.push('/inventory/dispatch')}
        onSuccess={() => router.push('/inventory/dispatch')}
      />
    </div>
  );
};

export default CreateDispatchPage;
