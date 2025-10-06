// 'use client'
// import React, { useState, useEffect } from 'react'
// import SelectableTable from '@/components/SelectableTable'
// import { PurchaseVoucher } from './PurchaseVoucehr'
// import { GrnRecord } from '@/lib/types'

// export function GrnListWithVoucher() {
//   const [grns, setGrns] = useState<GrnRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedGrnId, setSelectedGrnId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [showSelector, setShowSelector] = useState(false)

//   useEffect(() => {
//     loadGrns()
//   }, [])

//   const loadGrns = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/grn?stockTypeId=11`)
//       const result = await response.json()
      
//       if (result.success) {
//         const formattedGrns = result.data.map((grn: any) => ({
//           id: grn.ID,
//           label: grn.Number,
//           number: grn.Number,
//           date: new Date(grn.Date).toLocaleDateString(),
//           supplier: grn.account?.acName || 'N/A',
//           status: grn.Status,
//           total_items: grn.details?.length || 0
//         }))
//         setGrns(formattedGrns)
//       }
//     } catch (error) {
//       console.error('Error loading GRNs:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGrnSelect = (grn: GrnRecord) => {
//     setSelectedGrnId(grn.id)
//     setShowSelector(false)
//     setShowVoucher(true)
//   }

//   const handleCreateVoucher = (grn: GrnRecord) => {
//     setSelectedGrnId(grn.id)
//     setShowVoucher(true)
//   }

//   const columns = [
//     { key: 'number', label: 'GRN No', width: '25%' },
//     { key: 'date', label: 'Date', width: '20%' },
//     { key: 'supplier', label: 'Supplier', width: '30%' },
//     { key: 'status', label: 'Status', width: '15%' },
//     { key: 'total_items', label: 'Items', width: '10%' }
//   ]

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Purchase Voucher Management</h2>
//           <p className="text-gray-600 mt-1">Create vouchers from existing GRNs</p>
//         </div>
//         <button
//           onClick={() => setShowSelector(true)}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
//           disabled={loading}
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//           </svg>
//           <span>Create Purchase Voucher</span>
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-gray-500">Total GRNs</p>
//               <p className="text-lg font-semibold text-gray-900">{grns.length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-gray-500">Posted</p>
//               <p className="text-lg font-semibold text-gray-900">{grns.filter(g => g.status === 'Post').length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-gray-500">UnPost</p>
//               <p className="text-lg font-semibold text-gray-900">{grns.filter(g => g.status === 'UnPost').length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-gray-500">Quick Actions</p>
//               <p className="text-lg font-semibold text-gray-900">Available</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="flex justify-center items-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//           <span className="ml-4 text-gray-600 text-lg">Loading GRNs...</span>
//         </div>
//       ) : (
//         <>
//           {/* Recent GRNs Grid */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent GRNs</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {grns.slice(0, 9).map((grn) => (
//                 <div key={grn.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-green-300">
//                   <div className="flex justify-between items-start mb-3">
//                     <h4 className="font-semibold text-green-600 text-lg">{grn.number}</h4>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       grn.status === 'Post' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {grn.status}
//                     </span>
//                   </div>
//                   <div className="space-y-2 text-sm text-gray-600 mb-4">
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" />
//                       </svg>
//                       <span>{grn.date}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                       <span className="truncate">{grn.supplier}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                       </svg>
//                       <span>{grn.total_items} items</span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleCreateVoucher(grn)}
//                     className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     <span>Create Voucher</span>
//                   </button>
//                 </div>
//               ))}
//             </div>
            
//             {grns.length > 9 && (
//               <div className="mt-6 text-center">
//                 <button
//                   onClick={() => setShowSelector(true)}
//                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
//                 >
//                   View All GRNs ({grns.length})
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* SelectableTable Modal */}
//       {showSelector && (
//         <SelectableTable
//           label="GRN"
//           name="grn_selector"
//           value={selectedGrnId}
//           onChange={() => {}}
//           options={grns}
//           placeholder="Search GRNs by number, supplier, date..."
//           displayKey="label"
//           valueKey="id"
//           onSelect={handleGrnSelect}
//           columns={columns}
//           pageSize={15}
//         />
//       )}

//       {/* Purchase Voucher Modal */}
//       {showVoucher && selectedGrnId && (
//         <PurchaseVoucher
//           grnId={selectedGrnId}
//           onClose={() => {
//             setShowVoucher(false)
//             setSelectedGrnId(null)
//           }}
//           onSuccess={() => {
//             loadGrns()
//           }}
//         />
//       )}
//     </div>
//   )
// }
































































// 'use client'
// import React, { useState, useEffect } from 'react'
// import SelectableTable from '@/components/SelectableTable'
// import { PurchaseVoucher } from './PurchaseVoucehr'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { GrnRecord } from '@/lib/types'

// type FilterType = 'all' | 'generated' | 'not_generated'

// export function GrnListWithVoucher() {
//   const [grns, setGrns] = useState<GrnRecord[]>([])
//   const [filteredGrns, setFilteredGrns] = useState<GrnRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedGrnId, setSelectedGrnId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [showSelector, setShowSelector] = useState(false)
//   const [currentFilter, setCurrentFilter] = useState<FilterType>('all')
//   const [showConfirmation, setShowConfirmation] = useState(false)
//   const [pendingGrn, setPendingGrn] = useState<GrnRecord | null>(null)

//   useEffect(() => {
//     loadGrns()
//   }, [])

//   useEffect(() => {
//     filterGrns()
//   }, [grns, currentFilter])

//   const loadGrns = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/grn?stockTypeId=11`)
//       const result = await response.json()
      
//       if (result.success) {
//         const formattedGrns = result.data.map((grn: any) => {
//           // Check if any items have vouchers generated
//           const hasGeneratedVouchers = grn.details?.some((detail: any) => detail.is_Voucher_Generated) || false
//           const allVouchersGenerated = grn.details?.every((detail: any) => detail.is_Voucher_Generated) || false
          
//           return {
//             id: grn.ID,
//             label: grn.Number,
//             number: grn.Number,
//             date: new Date(grn.Date).toLocaleDateString(),
//             supplier: grn.account?.acName || 'N/A',
//             status: grn.Status,
//             total_items: grn.details?.length || 0,
//             has_vouchers: hasGeneratedVouchers,
//             all_vouchers_generated: allVouchersGenerated
//           }
//         })
//         setGrns(formattedGrns)
//       }
//     } catch (error) {
//       console.error('Error loading GRNs:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterGrns = () => {
//     let filtered = grns
    
//     switch (currentFilter) {
//       case 'generated':
//         filtered = grns.filter(grn => grn.has_vouchers)
//         break
//       case 'not_generated':
//         filtered = grns.filter(grn => !grn.has_vouchers)
//         break
//       default:
//         filtered = grns
//     }
    
//     setFilteredGrns(filtered)
//   }

//   const handleGrnSelect = (grn: GrnRecord) => {
//     if (grn.has_vouchers) {
//       setPendingGrn(grn)
//       setShowConfirmation(true)
//     } else {
//       setSelectedGrnId(grn.id)
//       setShowSelector(false)
//       setShowVoucher(true)
//     }
//   }

//   const handleCreateVoucher = (grn: GrnRecord) => {
//     if (grn.has_vouchers) {
//       setPendingGrn(grn)
//       setShowConfirmation(true)
//     } else {
//       setSelectedGrnId(grn.id)
//       setShowVoucher(true)
//     }
//   }

//   const handleConfirmViewVoucher = () => {
//     if (pendingGrn) {
//       setSelectedGrnId(pendingGrn.id)
//       setShowVoucher(true)
//       setShowSelector(false)
//     }
//     setShowConfirmation(false)
//     setPendingGrn(null)
//   }

//   const columns = [
//     { key: 'number', label: 'GRN No', width: '20%' },
//     { key: 'date', label: 'Date', width: '15%' },
//     { key: 'supplier', label: 'Supplier', width: '25%' },
//     { key: 'status', label: 'Status', width: '10%' },
//     { key: 'total_items', label: 'Items', width: '10%' },
//     { key: 'voucher_status', label: 'Voucher', width: '20%' }
//   ]

//   // Add voucher status to display options
//   const displayOptions = filteredGrns.map(grn => ({
//     ...grn,
//     voucher_status: grn.all_vouchers_generated 
//       ? 'All Generated' 
//       : grn.has_vouchers 
//         ? 'Partially Generated' 
//         : 'Not Generated'
//   }))

//   return (
//     <>
//       <div className="p-6">
//         {/* Header with Filter Tabs */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Purchase Voucher Management</h2>
//             <p className="text-gray-600 mt-1">Create vouchers from existing GRNs</p>
//           </div>
//           <button
//             onClick={() => setShowSelector(true)}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
//             disabled={loading}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             <span>Create Purchase Voucher</span>
//           </button>
//         </div>

//         {/* Filter Tabs */}
//         <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
//           <nav className="flex space-x-1">
//             <button
//               onClick={() => setCurrentFilter('all')}
//               className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
//                 currentFilter === 'all'
//                   ? 'bg-green-600 text-white'
//                   : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
//               }`}
//             >
//               All GRNs ({grns.length})
//             </button>
//             <button
//               onClick={() => setCurrentFilter('not_generated')}
//               className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
//                 currentFilter === 'not_generated'
//                   ? 'bg-yellow-600 text-white'
//                   : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
//               }`}
//             >
//               Not Generated ({grns.filter(g => !g.has_vouchers).length})
//             </button>
//             <button
//               onClick={() => setCurrentFilter('generated')}
//               className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
//                 currentFilter === 'generated'
//                   ? 'bg-blue-600 text-white'
//                   : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
//               }`}
//             >
//               Generated ({grns.filter(g => g.has_vouchers).length})
//             </button>
//           </nav>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Total GRNs</p>
//                 <p className="text-lg font-semibold text-gray-900">{grns.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Vouchers Generated</p>
//                 <p className="text-lg font-semibold text-gray-900">{grns.filter(g => g.has_vouchers).length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Pending Vouchers</p>
//                 <p className="text-lg font-semibold text-gray-900">{grns.filter(g => !g.has_vouchers).length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Completion Rate</p>
//                 <p className="text-lg font-semibold text-gray-900">
//                   {grns.length > 0 ? Math.round((grns.filter(g => g.has_vouchers).length / grns.length) * 100) : 0}%
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//             <span className="ml-4 text-gray-600 text-lg">Loading GRNs...</span>
//           </div>
//         ) : (
//           <>
//             {/* Recent GRNs Grid */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 {currentFilter === 'all' && 'All GRNs'}
//                 {currentFilter === 'generated' && 'Generated Vouchers'}
//                 {currentFilter === 'not_generated' && 'Pending Vouchers'}
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredGrns.slice(0, 9).map((grn) => (
//                   <div key={grn.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-green-300">
//                     <div className="flex justify-between items-start mb-3">
//                       <h4 className="font-semibold text-green-600 text-lg">{grn.number}</h4>
//                       <div className="flex flex-col items-end space-y-1">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           grn.status === 'Post' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {grn.status}
//                         </span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           grn.all_vouchers_generated
//                             ? 'bg-green-100 text-green-800'
//                             : grn.has_vouchers
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-red-100 text-red-800'
//                         }`}>
//                           {grn.all_vouchers_generated 
//                             ? 'All Generated' 
//                             : grn.has_vouchers 
//                               ? 'Partial' 
//                               : 'Not Generated'
//                           }
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-2 text-sm text-gray-600 mb-4">
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" />
//                         </svg>
//                         <span>{grn.date}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                         </svg>
//                         <span className="truncate">{grn.supplier}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                         </svg>
//                         <span>{grn.total_items} items</span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleCreateVoucher(grn)}
//                       className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
//                         grn.has_vouchers
//                           ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                           : 'bg-green-500 text-white hover:bg-green-600'
//                       }`}
//                     >
//                       {grn.has_vouchers ? (
//                         <>
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                           <span>View Voucher</span>
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                           </svg>
//                           <span>Create Voucher</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 ))}
//               </div>
              
//               {filteredGrns.length > 9 && (
//                 <div className="mt-6 text-center">
//                   <button
//                     onClick={() => setShowSelector(true)}
//                     className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
//                   >
//                     View All ({filteredGrns.length})
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* SelectableTable Modal */}
//         {showSelector && (
//           <SelectableTable
//             label="GRN"
//             name="grn_selector"
//             value={selectedGrnId}
//             onChange={() => {}}
//             options={displayOptions}
//             placeholder="Search GRNs by number, supplier, date..."
//             displayKey="label"
//             valueKey="id"
//             onSelect={handleGrnSelect}
//             columns={columns}
//             pageSize={15}
//           />
//         )}

//         {/* Purchase Voucher Modal */}
//         {showVoucher && selectedGrnId && (
//           <PurchaseVoucher
//             grnId={selectedGrnId}
//             onClose={() => {
//               setShowVoucher(false)
//               setSelectedGrnId(null)
//             }}
//             onSuccess={() => {
//               loadGrns()
//             }}
//           />
//         )}
//       </div>

//       {/* Confirmation Modal for Generated Vouchers */}
//       <ConfirmationModal
//         isOpen={showConfirmation}
//         onClose={() => {
//           setShowConfirmation(false)
//           setPendingGrn(null)
//         }}
//         onConfirm={handleConfirmViewVoucher}
//         title="Voucher Already Generated"
//         message={`This GRN (${pendingGrn?.number}) already has vouchers generated. You can view the existing voucher but cannot modify it. Do you want to continue?`}
//         confirmText="Yes, View Voucher"
//         cancelText="Cancel"
//         type="info"
//       />
//     </>
//   )
// }

















































// 'use client'
// import React, { useState, useEffect } from 'react'
// import { PurchaseVoucher } from './PurchaseVoucehr'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'

// interface GrnRecord {
//   ID: number
//   Number: string
//   Date: string
//   account?: { acName: string }
//   Status: string
//   is_Voucher_Generated: boolean
//   details?: any[]
// }

// export function GrnListWithVoucher() {
//   const [grns, setGrns] = useState<GrnRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedGrnId, setSelectedGrnId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [voucherMode, setVoucherMode] = useState<'create' | 'edit'>('create')
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [grnToResetVoucher, setGrnToResetVoucher] = useState<GrnRecord | null>(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [filter, setFilter] = useState<'all' | 'generated' | 'pending'>('all')

//   useEffect(() => {
//     loadGrns()
//   }, [])

//   const loadGrns = async () => {
//     setLoading(true)
//     try {
//       let response
//       let result
      
//       try {
//         response = await fetch(`http://${window.location.hostname}:4000/api/grn`)
//         result = await response.json()
//       } catch (err) {
//         console.log('Trying alternative GRN endpoint...')
//         response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
//         result = await response.json()
//       }
      
//       if (result.success && result.data) {
//         console.log('✅ Loaded GRNs:', result.data)
//         setGrns(result.data)
//       } else {
//         console.error('❌ No data in response:', result)
//       }
//     } catch (error) {
//       console.error('💥 Error loading GRNs:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getFilteredGrns = () => {
//     switch (filter) {
//       case 'generated': return grns.filter(g => g.is_Voucher_Generated)
//       case 'pending': return grns.filter(g => !g.is_Voucher_Generated)
//       default: return grns
//     }
//   }

//   // Create voucher logic
//   const handleCreateVoucher = (grn: GrnRecord) => {
//     setSelectedGrnId(grn.ID)
//     setVoucherMode('create')
//     setShowVoucher(true)
//   }

//   // Edit voucher logic
//   const handleEditVoucher = (grn: GrnRecord) => {
//     setSelectedGrnId(grn.ID)
//     setVoucherMode('edit')
//     setShowVoucher(true)
//   }

//   // Delete voucher = Reset voucher status to 0
//   const handleDeleteVoucherClick = (grn: GrnRecord) => {
//     setGrnToResetVoucher(grn)
//     setShowDeleteConfirm(true)
//   }

//   // Reset voucher status to "not generated"
//   const handleConfirmResetVoucher = async () => {
//     if (!grnToResetVoucher) return
    
//     setDeleteLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${grnToResetVoucher.ID}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ is_Voucher_Generated: false })
//       })
      
//       if (response.ok) {
//         setGrns(prev => 
//           prev.map(g => 
//             g.ID === grnToResetVoucher.ID 
//               ? { ...g, is_Voucher_Generated: false }
//               : g
//           )
//         )
//         setShowDeleteConfirm(false)
//         setGrnToResetVoucher(null)
//       }
//     } catch (error) {
//       console.error('Error resetting voucher:', error)
//     } finally {
//       setDeleteLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//           <span className="ml-4 text-gray-600 text-lg">Loading GRNs...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="p-4">
//         <div className="bg-white rounded-lg shadow">
          
//           {/* Header */}
//           <div className="p-3 border-b flex justify-between items-center">
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">Purchase Voucher Management</h2>
//               <p className="text-sm text-gray-600">Manage vouchers for GRNs</p>
//             </div>
//             <button
//               onClick={loadGrns}
//               className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//             >
//               Refresh
//             </button>
//           </div>

//           {/* Filter Tabs */}
//           <div className="p-3 border-b bg-gray-50">
//             <div className="flex space-x-2">
//               {[
//                 { key: 'all', label: `All (${grns.length})`, color: 'green' },
//                 { key: 'pending', label: `Pending (${grns.filter(g => !g.is_Voucher_Generated).length})`, color: 'yellow' },
//                 { key: 'generated', label: `Generated (${grns.filter(g => g.is_Voucher_Generated).length})`, color: 'blue' }
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setFilter(tab.key as any)}
//                   className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
//                     filter === tab.key 
//                       ? `bg-${tab.color}-600 text-white` 
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* GRN Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-semibold">GRN No</th>
//                   <th className="px-4 py-3 text-left font-semibold">Date</th>
//                   <th className="px-4 py-3 text-left font-semibold">Supplier</th>
//                   <th className="px-4 py-3 text-left font-semibold">Status</th>
//                   <th className="px-4 py-3 text-left font-semibold">Items</th>
//                   <th className="px-4 py-3 text-center font-semibold">Voucher Status</th>
//                   <th className="px-4 py-3 text-center font-semibold">Voucher Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {getFilteredGrns().map((grn) => (
//                   <tr key={grn.ID} className="hover:bg-gray-50 text-sm">
//                     <td className="px-4 py-3 font-medium text-green-600">{grn.Number}</td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {new Date(grn.Date).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {grn.account?.acName || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         grn.Status === 'Post' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {grn.Status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {grn.details?.length || 0}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className={`px-2 py-1 rounded text-xs font-bold ${
//                         grn.is_Voucher_Generated 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {grn.is_Voucher_Generated ? 'Generated' : 'Pending'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex justify-center space-x-1">
//                         {!grn.is_Voucher_Generated ? (
//                           <button
//                             onClick={() => handleCreateVoucher(grn)}
//                             className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
//                             title="Create Voucher"
//                           >
//                             Create
//                           </button>
//                         ) : (
//                           <>
//                             <button
//                               onClick={() => handleEditVoucher(grn)}
//                               className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
//                               title="Edit Voucher"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteVoucherClick(grn)}
//                               className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600"
//                               title="Reset Voucher Status"
//                             >
//                               Reset
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Purchase Voucher Modal */}
//         {showVoucher && selectedGrnId && (
//           <PurchaseVoucher
//             grnId={selectedGrnId}
//             mode={voucherMode}
//             onClose={() => {
//               setShowVoucher(false)
//               setSelectedGrnId(null)
//             }}
//             onSuccess={loadGrns}
//           />
//         )}
//       </div>

//       {/* Reset Voucher Confirmation */}
//       <ConfirmationModal
//         isOpen={showDeleteConfirm}
//         onClose={() => {
//           setShowDeleteConfirm(false)
//           setGrnToResetVoucher(null)
//         }}
//         onConfirm={handleConfirmResetVoucher}
//         title="Reset Voucher Status"
//         message={`Reset voucher status for GRN "${grnToResetVoucher?.Number}"? This will change the status back to "Not Generated" so you can create a new voucher.`}
//         confirmText="Yes, Reset"
//         cancelText="Cancel"
//         type="warning"
//         loading={deleteLoading}
//       />
//     </>
//   )
// }

















































'use client'
import React, { useState, useEffect } from 'react'
import { PurchaseVoucher } from './'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'

interface GrnRecord {
  ID: number
  Number: string
  Date: string
  account?: { acName: string }
  Status: string
  is_Voucher_Generated: boolean
  details?: any[]
  // JOURNAL STATUS FIELDS
  hasJournal?: boolean
  journalStatus?: 'Post' | 'UnPost' | null
  journalId?: number | null
}

export function GrnListWithVoucher() {
  const [grns, setGrns] = useState<GrnRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGrnId, setSelectedGrnId] = useState<number | null>(null)
  const [showVoucher, setShowVoucher] = useState(false)
  const [voucherMode, setVoucherMode] = useState<'create' | 'edit'>('create')
  const [filter, setFilter] = useState<'all' | 'generated' | 'pending' | 'posted'>('all')
  
  // Journal posting states
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [grnToToggle, setGrnToToggle] = useState<GrnRecord | null>(null)
  const [toggleLoading, setToggleLoading] = useState<number | null>(null)
  const [journalSuccess, setJournalSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadGrns()
  }, [])

  // AUTO-HIDE SUCCESS MESSAGE
  useEffect(() => {
    if (journalSuccess) {
      const timer = setTimeout(() => setJournalSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [journalSuccess])

  const loadGrns = async () => {
    setLoading(true)
    try {
      let response
      let result
      
      try {
        response = await fetch(`http://${window.location.hostname}:4000/api/grn`)
        result = await response.json()
      } catch (err) {
        console.log('Trying alternative GRN endpoint...')
        response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
        result = await response.json()
        
        // Filter for GRN records (Stock_Type_ID = 11)
        if (result.success && result.data) {
          result.data = result.data.filter((item: any) => item.Stock_Type_ID === 11)
        }
      }
      
      if (result.success && result.data) {
        console.log('✅ Loaded GRNs:', result.data.length)
        
        // CHECK JOURNAL STATUS FOR EACH GRN
        const grnsWithJournalStatus = await Promise.all(
          result.data.map(async (grn: GrnRecord) => {
            try {
              const journalResponse = await fetch(
                `http://${window.location.hostname}:4000/api/journal-master/check-status/${grn.ID}`
              )
              const journalResult = await journalResponse.json()
              
              return {
                ...grn,
                hasJournal: journalResult.success && journalResult.isPosted,
                journalStatus: journalResult.journalStatus, // 'Post' or 'UnPost' or null
                journalId: journalResult.journalId
              }
            } catch (error) {
              console.log(`⚠️ Could not check journal status for GRN ${grn.ID}`)
              return { 
                ...grn, 
                hasJournal: false, 
                journalStatus: null,
                journalId: null 
              }
            }
          })
        )
        
        setGrns(grnsWithJournalStatus)
        console.log('📊 GRNs with journal status loaded')
      } else {
        console.error('❌ No data in response:', result)
      }
    } catch (error) {
      console.error('💥 Error loading GRNs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredGrns = () => {
    switch (filter) {
      case 'pending': 
        return grns.filter(g => !g.is_Voucher_Generated)
      case 'generated': 
        return grns.filter(g => g.is_Voucher_Generated && g.journalStatus === 'UnPost')
      case 'posted': 
        return grns.filter(g => g.journalStatus === 'Post')
      default: 
        return grns
    }
  }

  const getStatusCounts = () => {
    const total = grns.length
    const pending = grns.filter(g => !g.is_Voucher_Generated).length
    const generated = grns.filter(g => g.is_Voucher_Generated && g.journalStatus === 'UnPost').length
    const posted = grns.filter(g => g.journalStatus === 'Post').length
    
    return { total, pending, generated, posted }
  }

  const handleCreateVoucher = (grn: GrnRecord) => {
    setSelectedGrnId(grn.ID)
    setVoucherMode('create')
    setShowVoucher(true)
  }

  const handleEditVoucher = (grn: GrnRecord) => {
    setSelectedGrnId(grn.ID)
    setVoucherMode('edit')
    setShowVoucher(true)
  }

  // TOGGLE POST/UNPOST FUNCTIONALITY
  const handleToggleJournalClick = (grn: GrnRecord) => {
    setGrnToToggle(grn)
    setShowJournalModal(true)
  }

  const handleConfirmToggleJournal = async () => {
    if (!grnToToggle) return
    
    setShowJournalModal(false)
    setToggleLoading(grnToToggle.ID)
    
    try {
      // TOGGLE POST/UNPOST STATUS
      const response = await fetch(`http://${window.location.hostname}:4000/api/journal-master/post-voucher/${grnToToggle.ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'post' }) // Backend will toggle automatically
      })
      
      const result = await response.json()
      
      if (result.success) {
        const newStatus = result.data.journalMaster.status
        
        // UPDATE GRN STATUS
        setGrns(prev => 
          prev.map(g => 
            g.ID === grnToToggle.ID 
              ? { ...g, journalStatus: newStatus }
              : g
          )
        )
        
        setJournalSuccess(`✅ Journal ${newStatus === 'Post' ? 'Posted' : 'Unposted'} Successfully: ${result.data.journalMaster.voucherNo}`)
      } else {
        alert(`❌ Failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error toggling journal:', error)
      alert('❌ Error toggling journal status')
    } finally {
      setToggleLoading(null)
      setGrnToToggle(null)
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-4 text-gray-600 text-lg">Loading GRNs...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow">
          
          {/* SUCCESS MESSAGE */}
          {journalSuccess && (
            <div className="mx-4 mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 rounded-r-lg flex items-center justify-between animate-slide-down">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {journalSuccess}
              </div>
              <button 
                onClick={() => setJournalSuccess(null)} 
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* ENHANCED HEADER */}
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Purchase Voucher & Journal Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">Manage GRN vouchers, auto-create journals, and toggle post status</p>
            </div>
            <button
              onClick={loadGrns}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* ENHANCED FILTER TABS */}
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex space-x-2 flex-wrap">
              {[
                { key: 'all', label: `All (${statusCounts.total})`, color: 'gray', icon: '📊' },
                { key: 'pending', label: `Pending (${statusCounts.pending})`, color: 'red', icon: '⏳' },
                { key: 'generated', label: `Generated (${statusCounts.generated})`, color: 'yellow', icon: '📄' },
                { key: 'posted', label: `Posted (${statusCounts.posted})`, color: 'green', icon: '✅' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center transform hover:scale-105 ${
                    filter === tab.key 
                      ? `bg-${tab.color}-600 text-white shadow-lg scale-105` 
                      : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ENHANCED TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">GRN No</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Supplier</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Items</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Voucher Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Journal Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredGrns().map((grn) => (
                  <tr key={grn.ID} className="hover:bg-green-50 text-sm transition-colors duration-200">
                    <td className="px-4 py-3 font-bold text-green-700">{grn.Number}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(grn.Date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {grn.account?.acName || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        grn.Status === 'Post' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-orange-100 text-orange-800 border border-orange-300'
                      }`}>
                        {grn.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {grn.details?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        grn.is_Voucher_Generated 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {grn.is_Voucher_Generated ? '✅ Generated' : '❌ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        grn.journalStatus === 'Post'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                          : grn.journalStatus === 'UnPost'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}>
                        {grn.journalStatus === 'Post' 
                          ? '✅ Posted' 
                          : grn.journalStatus === 'UnPost' 
                          ? '📄 UnPost' 
                          : '❌ No Journal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-1">
                        {!grn.is_Voucher_Generated ? (
                          // CREATE VOUCHER BUTTON
                          <button
                            onClick={() => handleCreateVoucher(grn)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create
                          </button>
                        ) : (
                          // VOUCHER GENERATED ACTIONS
                          <>
                            {/* EDIT VOUCHER */}
                            <button
                              onClick={() => handleEditVoucher(grn)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                              </svg>
                              Edit
                            </button>
                            
                            {/* POST/UNPOST TOGGLE BUTTON */}
                            {(grn.journalStatus === 'UnPost' || grn.journalStatus === 'Post') && (
                              <button
                                onClick={() => handleToggleJournalClick(grn)}
                                disabled={toggleLoading === grn.ID}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm disabled:transform-none disabled:cursor-not-allowed ${
                                  grn.journalStatus === 'UnPost' 
                                    ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white'
                                    : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white'
                                }`}
                                title={grn.journalStatus === 'UnPost' ? 'Post to ledger' : 'Unpost from ledger'}
                              >
                                {toggleLoading === grn.ID ? (
                                  <>
                                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                    {grn.journalStatus === 'UnPost' ? 'Posting...' : 'Unposting...'}
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                        grn.journalStatus === 'UnPost' 
                                          ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                          : "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      } />
                                    </svg>
                                    {grn.journalStatus === 'UnPost' ? 'Post' : 'UnPost'}
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* EMPTY STATE */}
            {getFilteredGrns().length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-500 mb-2">No GRNs found</h3>
                <p className="text-gray-400">
                  {filter === 'all' 
                    ? 'No GRNs available' 
                    : `No GRNs match the "${filter}" filter`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PURCHASE VOUCHER MODAL */}
        {showVoucher && selectedGrnId && (
          <PurchaseVoucher
            grnId={selectedGrnId}
            mode={voucherMode}
            onClose={() => {
              setShowVoucher(false)
              setSelectedGrnId(null)
            }}
            onSuccess={loadGrns}
          />
        )}
      </div>

      {/* POST/UNPOST CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showJournalModal}
        onClose={() => {
          setShowJournalModal(false)
          setGrnToToggle(null)
        }}
        onConfirm={handleConfirmToggleJournal}
        title={`${grnToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'} Journal`}
        message={`${grnToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'} journal for GRN "${grnToToggle?.Number}"? This will update the journal status in both master and detail tables.`}
        confirmText={`Yes, ${grnToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'}`}
        cancelText="Cancel"
        type="info"
        loading={toggleLoading !== null}
      />
    </>
  )
}
