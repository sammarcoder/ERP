// components/InventoryDashboard.jsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const InventoryDashboard = () => {
  const router = useRouter();

  const modules = [
    {
      title: 'Purchase Orders',
      description: 'Create and manage purchase orders',
      icon: '📋',
      color: 'blue',
      path: '/order/purchase',
      actions: ['Create PO', 'View POs', 'Edit PO']
    },
    {
      title: 'Goods Receiving Note',
      description: 'Receive items from purchase orders',
      icon: '📦',
      color: 'indigo',
      path: '/inventory/grn',
      actions: ['Create GRN', 'View GRNs', 'Receive Items']
    },
    {
      title: 'Sales Orders',
      description: 'Create and manage sales orders',
      icon: '🛒',
      color: 'green',
      path: '/order/sales',
      actions: ['Create SO', 'View SOs', 'Edit SO']
    },
    {
      title: 'Sales Dispatch',
      description: 'Dispatch items from sales orders',
      icon: '🚚',
      color: 'emerald',
      path: '/inventory/dispatch',
      actions: ['Create Dispatch', 'View Dispatches', 'Ship Items']
    },
    {
      title: 'Stock Management',
      description: 'Monitor inventory levels and stock',
      icon: '📊',
      color: 'purple',
      path: '/inventory/stock',
      actions: ['View Stock', 'Stock Reports', 'Adjustments']
    },
    {
      title: 'Items Master',
      description: 'Manage product catalog and UOMs',
      icon: '🏷️',
      color: 'orange',
      path: '/master/items',
      actions: ['Add Items', 'Edit Items', 'UOM Setup']
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Inventory Management System</h1>
            <p className="text-lg text-gray-600">Complete Order → Receive → Dispatch → Stock Workflow</p>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <div
                key={index}
                onClick={() => router.push(module.path)}
                className={`bg-gradient-to-r ${getColorClasses(module.color)} p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{module.icon}</div>
                  <svg className="w-6 h-6 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-sm opacity-90 mb-4">{module.description}</p>
                
                <div className="space-y-1">
                  {module.actions.map((action, idx) => (
                    <div key={idx} className="text-xs opacity-80 flex items-center">
                      <div className="w-1 h-1 bg-white rounded-full mr-2"></div>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Pending Orders</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Items in Stock</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Low Stock Items</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Urgent Orders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
