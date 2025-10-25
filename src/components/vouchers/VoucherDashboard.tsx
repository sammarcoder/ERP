// 'use client'
// import React, { useState } from 'react'
// import { DispatchListWithVoucher}  from './DispatchListWithVoucher'
// import { GrnListWithVoucher } from './GrnListWithVoucher'

// type TabType = 'sales' | 'purchase'

// export function VoucherDashboard() {
//   const [activeTab, setActiveTab] = useState<TabType>('sales')

//   const tabs = [
//     {
//       id: 'sales' as const,
//       name: 'Sales Vouchers',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//         </svg>
//       ),
//       color: 'blue'
//     },
//     {
//       id: 'purchase' as const,
//       name: 'Purchase Vouchers',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//         </svg>
//       ),
//       color: 'green'
//     }
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Tab Navigation */}
//       <div className="bg-white rounded-lg shadow-sm p-1">
//         <nav className="flex space-x-1" aria-label="Tabs">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.id
//             const colorClasses = isActive 
//               ? `bg-${tab.color}-600 text-white` 
//               : `text-gray-700 hover:text-${tab.color}-600 hover:bg-${tab.color}-50`
            
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`${colorClasses} rounded-md px-3 py-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2`}
//               >
//                 {tab.icon}
//                 <span>{tab.name}</span>
//               </button>
//             )
//           })}
//         </nav>
//       </div>

//       {/* Tab Content */}
//       <div className="bg-white rounded-lg shadow-sm">
//         {activeTab === 'sales' && <DispatchListWithVoucher />}
//         {activeTab === 'purchase' && <GrnListWithVoucher />}
//       </div>
//     </div>
//   )
// }
