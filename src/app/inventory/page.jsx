// pages/inventory/index.jsx - COMBINED MANAGEMENT
'use client'
import React, { useState } from 'react';
import GRNList from '../../components/inventory/GRNList';
import DispatchList from '../../components/inventory/DispatchList';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('grn');

  return (
    <div className="p-2">
      {/* Tab Headers */}
      <div className="bg-white border rounded-t">
        <div className="flex">
          <button
            onClick={() => setActiveTab('grn')}
            className={`px-4 py-2 font-medium text-sm border-r ${
              activeTab === 'grn' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📦 GRN Management
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'dispatch' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🚚 Dispatch Management
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="border-x border-b rounded-b">
        {activeTab === 'grn' && <GRNList />}
        {activeTab === 'dispatch' && <DispatchList />}
      </div>
    </div>
  );
};

export default InventoryManagement;
