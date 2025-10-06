// app/inventory/grn/create/page.tsx - CREATE GRN PAGE
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GRNModal from '../../../../components/inventory/GRNModal';

const CreateGRNPage = () => {
  const router = useRouter();
  
  return (
    <div>
      {/* Full screen modal for create */}
      <GRNModal
        mode="create"
        onClose={() => router.push('/inventory/grn')}
        onSuccess={() => router.push('/inventory/grn')}
      />
    </div>
  );
};

export default CreateGRNPage;
