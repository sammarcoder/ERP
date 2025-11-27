// 'use client'

// import { useState } from 'react'
// import { 
//   ChartBarIcon, 
//   ChartPieIcon, 
//   PresentationChartLineIcon,
//   TableCellsIcon,
//   DocumentChartBarIcon 
// } from '@heroicons/react/24/outline'

// export default function ReportsLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [activeTab, setActiveTab] = useState('dashboard')

//   const tabs = [
//     { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon, href: '/reports' },
//     { id: 'financial', name: 'Financial', icon: ChartPieIcon, href: '/reports/financial' },
//     { id: 'trends', name: 'Trends', icon: PresentationChartLineIcon, href: '/reports/trends' },
//     { id: 'detailed', name: 'Detailed', icon: TableCellsIcon, href: '/reports/detailed' },
//     { id: 'custom', name: 'Custom', icon: DocumentChartBarIcon, href: '/reports/custom' },
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Reports Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
//               <p className="text-sm text-gray-500">Interactive business intelligence dashboards</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
//                 Export All
//               </button>
//               <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
//                 Schedule Report
//               </button>
//             </div>
//           </div>

//           {/* Navigation Tabs */}
//           <div className="border-t border-gray-200">
//             <nav className="-mb-px flex space-x-8">
//               {tabs.map((tab) => {
//                 const Icon = tab.icon
//                 return (
//                   <a
//                     key={tab.id}
//                     href={tab.href}
//                     className={`${
//                       activeTab === tab.id
//                         ? 'border-blue-500 text-blue-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
//                     onClick={() => setActiveTab(tab.id)}
//                   >
//                     <Icon className="h-5 w-5 mr-2" />
//                     {tab.name}
//                   </a>
//                 )
//               })}
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Reports Content */}
//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {children}
//       </main>
//     </div>
//   )
// }












'use client'

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <div className="flex space-x-6 mt-4">
            <a href="/reports/journalmaster" className="text-blue-600 hover:text-blue-800 font-medium">
              Journal Master
            </a>
            <a href="/reports/coa" className="text-gray-500 hover:text-gray-700">
              COA Report
            </a>
            <a href="/reports/sales" className="text-gray-500 hover:text-gray-700">
              Sales Report
            </a>
            <a href="/reports/purchase" className="text-gray-500 hover:text-gray-700">
              Purchase Report
            </a>
            <a href="/reports/grn" className="text-gray-500 hover:text-gray-700">
              GRN Report
            </a>
            <a href="/reports/dn" className="text-gray-500 hover:text-gray-700">
              DN Report
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
