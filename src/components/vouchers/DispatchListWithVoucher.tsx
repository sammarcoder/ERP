
// 'use client'
// import React, { useState, useEffect } from 'react'
// import SelectableTable from '@/components/SelectableTable'
// import { SalesVoucher } from './SalesVoucher'
// import { DispatchRecord } from '@/lib/types'

// export function DispatchListWithVoucher() {
//   const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [showSelector, setShowSelector] = useState(false)

//   useEffect(() => {
//     loadDispatches()
//   }, [])

//   const loadDispatches = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch?stockTypeId=12`)
//       const result = await response.json()

//       if (result.success) {
//         const formattedDispatches = result.data.map((dispatch: any) => ({
//           id: dispatch.ID,
//           label: dispatch.Number,
//           number: dispatch.Number,
//           date: new Date(dispatch.Date).toLocaleDateString(),
//           customer: dispatch.account?.acName || 'N/A',
//           status: dispatch.Status,
//           total_items: dispatch.details?.length || 0
//         }))
//         setDispatches(formattedDispatches)
//       }
//     } catch (error) {
//       console.error('Error loading dispatches:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDispatchSelect = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.id)
//     setShowSelector(false)
//     setShowVoucher(true)
//   }

//   const handleCreateVoucher = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.id)
//     setShowVoucher(true)
//   }

//   const columns = [
//     { key: 'number', label: 'Dispatch No', width: '25%' },
//     { key: 'date', label: 'Date', width: '20%' },
//     { key: 'customer', label: 'Customer', width: '30%' },
//     { key: 'status', label: 'Status', width: '15%' },
//     { key: 'total_items', label: 'Items', width: '10%' }
//   ]

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Sales Voucher Management</h2>
//           <p className="text-gray-600 mt-1">Create vouchers from existing dispatches</p>
//         </div>
//         <button
//           onClick={() => setShowSelector(true)}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
//           disabled={loading}
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//           </svg>
//           <span>Create Sales Voucher</span>
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-gray-500">Total Dispatches</p>
//               <p className="text-lg font-semibold text-gray-900">{dispatches.length}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-gray-500">Posted</p>
//               <p className="text-lg font-semibold text-gray-900">{dispatches.filter(d => d.status === 'Post').length}</p>
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
//               <p className="text-lg font-semibold text-gray-900">{dispatches.filter(d => d.status === 'UnPost').length}</p>
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
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <span className="ml-4 text-gray-600 text-lg">Loading dispatches...</span>
//         </div>
//       ) : (
//         <>
//           {/* Recent Dispatches Grid */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Dispatches</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {dispatches.slice(0, 9).map((dispatch) => (
//                 <div key={dispatch.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
//                   <div className="flex justify-between items-start mb-3">
//                     <h4 className="font-semibold text-blue-600 text-lg">{dispatch.number}</h4>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       dispatch.status === 'Post' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {dispatch.status}
//                     </span>
//                   </div>
//                   <div className="space-y-2 text-sm text-gray-600 mb-4">
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" />
//                       </svg>
//                       <span>{dispatch.date}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       <span className="truncate">{dispatch.customer}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                       </svg>
//                       <span>{dispatch.total_items} items</span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleCreateVoucher(dispatch)}
//                     className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     <span>Create Voucher</span>
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {dispatches.length > 9 && (
//               <div className="mt-6 text-center">
//                 <button
//                   onClick={() => setShowSelector(true)}
//                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
//                 >
//                   View All Dispatches ({dispatches.length})
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* SelectableTable Modal */}
//       {showSelector && (
//         <SelectableTable
//           label="Dispatch"
//           name="dispatch_selector"
//           value={selectedDispatchId}
//           onChange={() => {}}
//           options={dispatches}
//           placeholder="Search dispatches by number, customer, date..."
//           displayKey="label"
//           valueKey="id"
//           onSelect={handleDispatchSelect}
//           columns={columns}
//           pageSize={15}
//         />
//       )}

//       {/* Sales Voucher Modal */}
//       {showVoucher && selectedDispatchId && (
//         <SalesVoucher
//           dispatchId={selectedDispatchId}
//           onClose={() => {
//             setShowVoucher(false)
//             setSelectedDispatchId(null)
//           }}
//           onSuccess={() => {
//             loadDispatches()
//           }}
//         />
//       )}
//     </div>
//   )
// }



















































































// // this is working goo but no edit and delte 

// 'use client'
// import React, { useState, useEffect } from 'react'
// import { SalesVoucher } from './SalesVoucher'

// interface DispatchRecord {
//   ID: number
//   Number: string
//   Date: string
//   account?: { acName: string }
//   Status: string
//   is_Voucher_Generated: boolean
//   details?: any[]
// }

// export function DispatchListWithVoucher() {
//   const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [filter, setFilter] = useState<'all' | 'generated' | 'pending'>('all')

//   useEffect(() => {
//     loadDispatches()
//   }, [])

//   const loadDispatches = async () => {
//     setLoading(true)
//     try {
//       // Try multiple possible endpoints
//       let response
//       let result

//       try {
//         response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`)
//         result = await response.json()
//       } catch (err) {
//         console.log('Trying alternative dispatch endpoint...')
//         response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
//         result = await response.json()
//       }

//       if (result.success && result.data) {
//         console.log('✅ Loaded dispatches:', result.data)
//         setDispatches(result.data)
//       } else {
//         console.error('❌ No data in response:', result)
//       }
//     } catch (error) {
//       console.error('💥 Error loading dispatches:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getFilteredDispatches = () => {
//     switch (filter) {
//       case 'generated':
//         return dispatches.filter(d => d.is_Voucher_Generated)
//       case 'pending':
//         return dispatches.filter(d => !d.is_Voucher_Generated)
//       default:
//         return dispatches
//     }
//   }

//   const handleCreateVoucher = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.ID)
//     setShowVoucher(true)
//   }

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <span className="ml-4 text-gray-600 text-lg">Loading dispatches...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-6">
//       <div className="bg-white rounded-lg shadow">
//         {/* Header */}
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold text-gray-800">Dispatch List - Voucher Management</h2>
//           <p className="text-gray-600">Total: {dispatches.length} dispatches</p>
//         </div>

//         {/* Filter Tabs */}
//         <div className="p-4 border-b bg-gray-50">
//           <div className="flex space-x-4">
//             <button
//               onClick={() => setFilter('all')}
//               className={`px-4 py-2 rounded font-medium ${
//                 filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               All ({dispatches.length})
//             </button>
//             <button
//               onClick={() => setFilter('pending')}
//               className={`px-4 py-2 rounded font-medium ${
//                 filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               Pending ({dispatches.filter(d => !d.is_Voucher_Generated).length})
//             </button>
//             <button
//               onClick={() => setFilter('generated')}
//               className={`px-4 py-2 rounded font-medium ${
//                 filter === 'generated' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               Generated ({dispatches.filter(d => d.is_Voucher_Generated).length})
//             </button>
//           </div>
//         </div>

//         {/* Dispatch Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-3 text-left font-semibold">Dispatch No</th>
//                 <th className="px-4 py-3 text-left font-semibold">Date</th>
//                 <th className="px-4 py-3 text-left font-semibold">Customer</th>
//                 <th className="px-4 py-3 text-left font-semibold">Status</th>
//                 <th className="px-4 py-3 text-left font-semibold">Items</th>
//                 <th className="px-4 py-3 text-center font-semibold">Voucher Status</th>
//                 <th className="px-4 py-3 text-center font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {getFilteredDispatches().map((dispatch) => (
//                 <tr key={dispatch.ID} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 font-medium text-blue-600">{dispatch.Number}</td>
//                   <td className="px-4 py-3 text-gray-600">
//                     {new Date(dispatch.Date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-gray-600">
//                     {dispatch.account?.acName || 'N/A'}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={`px-2 py-1 rounded text-xs font-medium ${
//                       dispatch.Status === 'Post' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {dispatch.Status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-gray-600">
//                     {dispatch.details?.length || 0}
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     <span className={`px-2 py-1 rounded text-xs font-bold ${
//                       dispatch.is_Voucher_Generated 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {dispatch.is_Voucher_Generated ? 'Generated' : 'Not Generated'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     <button
//                       onClick={() => handleCreateVoucher(dispatch)}
//                       className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
//                         dispatch.is_Voucher_Generated
//                           ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                           : 'bg-blue-500 text-white hover:bg-blue-600'
//                       }`}
//                     >
//                       {dispatch.is_Voucher_Generated ? 'View Voucher' : 'Create Voucher'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {getFilteredDispatches().length === 0 && (
//           <div className="p-8 text-center text-gray-500">
//             <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <p>No {filter === 'all' ? 'dispatches' : filter === 'generated' ? 'generated vouchers' : 'pending dispatches'} found</p>
//           </div>
//         )}
//       </div>

//       {/* Sales Voucher Modal */}
//       {showVoucher && selectedDispatchId && (
//         <SalesVoucher
//           dispatchId={selectedDispatchId}
//           onClose={() => {
//             setShowVoucher(false)
//             setSelectedDispatchId(null)
//           }}
//           onSuccess={() => {
//             loadDispatches() // Refresh list after voucher generation
//           }}
//         />
//       )}
//     </div>
//   )
// }








































// 'use client'
// import React, { useState, useEffect } from 'react'
// import { SalesVoucher } from './SalesVoucher'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import DispatchModal from '../../components/inventory/DispatchModal' 

// interface DispatchRecord {
//   ID: number
//   Number: string
//   Date: string
//   account?: { acName: string }
//   Status: string
//   is_Voucher_Generated: boolean
//   details?: any[]
// }

// export function DispatchListWithVoucher() {
//   const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [dispatchToDelete, setDispatchToDelete] = useState<DispatchRecord | null>(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [filter, setFilter] = useState<'all' | 'generated' | 'pending'>('all')

//   useEffect(() => {
//     loadDispatches()
//   }, [])

//   const loadDispatches = async () => {
//     setLoading(true)
//     try {
//       let response
//       let result

//       try {
//         response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`)
//         result = await response.json()
//       } catch (err) {
//         console.log('Trying alternative dispatch endpoint...')
//         response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
//         result = await response.json()
//       }

//       if (result.success && result.data) {
//         console.log('✅ Loaded dispatches:', result.data)
//         setDispatches(result.data)
//       } else {
//         console.error('❌ No data in response:', result)
//       }
//     } catch (error) {
//       console.error('💥 Error loading dispatches:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getFilteredDispatches = () => {
//     switch (filter) {
//       case 'generated':
//         return dispatches.filter(d => d.is_Voucher_Generated)
//       case 'pending':
//         return dispatches.filter(d => !d.is_Voucher_Generated)
//       default:
//         return dispatches
//     }
//   }

//   const handleCreateVoucher = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.ID)
//     setShowVoucher(true)
//   }

//   const handleEditDispatch = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.ID)
//     setShowEditModal(true)
//   }

//   const handleDeleteClick = (dispatch: DispatchRecord) => {
//     setDispatchToDelete(dispatch)
//     setShowDeleteConfirm(true)
//   }

//   const handleConfirmDelete = async () => {
//     if (!dispatchToDelete) return

//     setDeleteLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchToDelete.ID}`, {
//         method: 'DELETE'
//       })

//       const result = await response.json()

//       if (response.ok && result.success) {
//         // Remove from local state
//         setDispatches(prev => prev.filter(d => d.ID !== dispatchToDelete.ID))
//         setShowDeleteConfirm(false)
//         setDispatchToDelete(null)
//       } else {
//         console.error('Failed to delete dispatch:', result.error)
//         alert('Failed to delete dispatch: ' + (result.error || 'Unknown error'))
//       }
//     } catch (error) {
//       console.error('Error deleting dispatch:', error)
//       alert('Error deleting dispatch')
//     } finally {
//       setDeleteLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <span className="ml-4 text-gray-600 text-lg">Loading dispatches...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="p-6">
//         <div className="bg-white rounded-lg shadow">
//           {/* Header */}
//           <div className="p-4 border-b flex justify-between items-center">
//             <div>
//               <h2 className="text-xl font-bold text-gray-800">Dispatch List - Voucher Management</h2>
//               <p className="text-gray-600">Total: {dispatches.length} dispatches</p>
//             </div>
//             <button
//               onClick={loadDispatches}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
//             >
//               Refresh
//             </button>
//           </div>

//           {/* Filter Tabs */}
//           <div className="p-4 border-b bg-gray-50">
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setFilter('all')}
//                 className={`px-4 py-2 rounded font-medium ${
//                   filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 All ({dispatches.length})
//               </button>
//               <button
//                 onClick={() => setFilter('pending')}
//                 className={`px-4 py-2 rounded font-medium ${
//                   filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 Pending ({dispatches.filter(d => !d.is_Voucher_Generated).length})
//               </button>
//               <button
//                 onClick={() => setFilter('generated')}
//                 className={`px-4 py-2 rounded font-medium ${
//                   filter === 'generated' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 Generated ({dispatches.filter(d => d.is_Voucher_Generated).length})
//               </button>
//             </div>
//           </div>

//           {/* Dispatch Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-semibold">Dispatch No</th>
//                   <th className="px-4 py-3 text-left font-semibold">Date</th>
//                   <th className="px-4 py-3 text-left font-semibold">Customer</th>
//                   <th className="px-4 py-3 text-left font-semibold">Status</th>
//                   <th className="px-4 py-3 text-left font-semibold">Items</th>
//                   <th className="px-4 py-3 text-center font-semibold">Voucher Status</th>
//                   <th className="px-4 py-3 text-center font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {getFilteredDispatches().map((dispatch) => (
//                   <tr key={dispatch.ID} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 font-medium text-blue-600">{dispatch.Number}</td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {new Date(dispatch.Date).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {dispatch.account?.acName || 'N/A'}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         dispatch.Status === 'Post' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {dispatch.Status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-gray-600">
//                       {dispatch.details?.length || 0}
//                     </td>
//                     <td className="px-4 py-3 text-center">
//                       <span className={`px-2 py-1 rounded text-xs font-bold ${
//                         dispatch.is_Voucher_Generated 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {dispatch.is_Voucher_Generated ? 'Generated' : 'Not Generated'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex justify-center space-x-2">
//                         {/* Edit Button */}
//                         <button
//                           onClick={() => handleEditDispatch(dispatch)}
//                           className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex items-center"
//                           title="Edit Dispatch"
//                         >
//                           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                           Edit
//                         </button>

//                         {/* Delete Button - Only if voucher not generated */}
//                         {!dispatch.is_Voucher_Generated && (
//                           <button
//                             onClick={() => handleDeleteClick(dispatch)}
//                             className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 flex items-center"
//                             title="Delete Dispatch"
//                           >
//                             <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Del
//                           </button>
//                         )}

//                         {/* Voucher Button */}
//                         <button
//                           onClick={() => handleCreateVoucher(dispatch)}
//                           className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center ${
//                             dispatch.is_Voucher_Generated
//                               ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                               : 'bg-yellow-500 text-white hover:bg-yellow-600'
//                           }`}
//                         >
//                           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                           {dispatch.is_Voucher_Generated ? 'View' : 'Voucher'}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {getFilteredDispatches().length === 0 && (
//             <div className="p-8 text-center text-gray-500">
//               <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <p>No {filter === 'all' ? 'dispatches' : filter === 'generated' ? 'generated vouchers' : 'pending dispatches'} found</p>
//             </div>
//           )}
//         </div>

//         {/* Edit Dispatch Modal */}
//         {showEditModal && selectedDispatchId && (
//           <DispatchModal
//             dispatchId={selectedDispatchId}
//             mode="edit"
//             onClose={() => {
//               setShowEditModal(false)
//               setSelectedDispatchId(null)
//             }}
//             onSuccess={() => {
//               loadDispatches()
//             }}
//           />
//         )}

//         {/* Sales Voucher Modal */}
//         {showVoucher && selectedDispatchId && (
//           <SalesVoucher
//             dispatchId={selectedDispatchId}
//             onClose={() => {
//               setShowVoucher(false)
//               setSelectedDispatchId(null)
//             }}
//             onSuccess={() => {
//               loadDispatches()
//             }}
//           />
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showDeleteConfirm}
//         onClose={() => {
//           setShowDeleteConfirm(false)
//           setDispatchToDelete(null)
//         }}
//         onConfirm={handleConfirmDelete}
//         title="Delete Dispatch"
//         message={`Are you sure you want to delete dispatch "${dispatchToDelete?.Number}"? This action cannot be undone and will remove all associated stock details.`}
//         confirmText="Yes, Delete"
//         cancelText="Cancel"
//         type="danger"
//         loading={deleteLoading}
//       />
//     </>
//   )
// }














































































// 'use client'
// import React, { useState, useEffect } from 'react'
// import { SalesVoucher } from './SalesVoucher'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'

// interface DispatchRecord {
//   ID: number
//   Number: string
//   Date: string
//   account?: { acName: string }
//   Status: string
//   is_Voucher_Generated: boolean
//   details?: any[]
// }

// export function DispatchListWithVoucher() {
//   const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [voucherMode, setVoucherMode] = useState<'create' | 'edit'>('create')
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [dispatchToResetVoucher, setDispatchToResetVoucher] = useState<DispatchRecord | null>(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [filter, setFilter] = useState<'all' | 'generated' | 'pending'>('all')

//   useEffect(() => {
//     loadDispatches()
//   }, [])

//   const loadDispatches = async () => {
//     setLoading(true)
//     try {
//       let response
//       let result

//       try {
//         response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`)
//         result = await response.json()
//       } catch (err) {
//         response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
//         result = await response.json()
//       }

//       if (result.success && result.data) {
//         setDispatches(result.data)
//       }
//     } catch (error) {
//       console.error('💥 Error loading dispatches:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getFilteredDispatches = () => {
//     switch (filter) {
//       case 'generated': return dispatches.filter(d => d.is_Voucher_Generated)
//       case 'pending': return dispatches.filter(d => !d.is_Voucher_Generated)
//       default: return dispatches
//     }
//   }

//   // FIXED: Create voucher logic
//   const handleCreateVoucher = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.ID)
//     setVoucherMode('create')
//     setShowVoucher(true)
//   }

//   // FIXED: Edit voucher logic
//   const handleEditVoucher = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.ID)
//     setVoucherMode('edit')
//     setShowVoucher(true)
//   }

//   // FIXED: Delete voucher = Reset voucher status to 0
//   const handleDeleteVoucherClick = (dispatch: DispatchRecord) => {
//     setDispatchToResetVoucher(dispatch)
//     setShowDeleteConfirm(true)
//   }

//   // FIXED: Reset voucher status to "not generated"
//   const handleConfirmResetVoucher = async () => {
//     if (!dispatchToResetVoucher) return

//     setDeleteLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchToResetVoucher.ID}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ is_Voucher_Generated: false })
//       })

//       if (response.ok) {
//         setDispatches(prev => 
//           prev.map(d => 
//             d.ID === dispatchToResetVoucher.ID 
//               ? { ...d, is_Voucher_Generated: false }
//               : d
//           )
//         )
//         setShowDeleteConfirm(false)
//         setDispatchToResetVoucher(null)
//       }
//     } catch (error) {
//       console.error('Error resetting voucher:', error)
//     } finally {
//       setDeleteLoading(false)
//     }
//   }

//   return (
//     <>
//       <div className="p-4">
//         <div className="bg-white rounded shadow">

//           {/* Compact Header */}
//           <div className="p-3 border-b flex justify-between items-center">
//             <div>
//               <h2 className="text-lg font-bold">Sales Voucher Management</h2>
//               <p className="text-sm text-gray-600">{dispatches.length} dispatches</p>
//             </div>
//             <button onClick={loadDispatches} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
//               Refresh
//             </button>
//           </div>

//           {/* Compact Filter Tabs */}
//           <div className="p-3 border-b bg-gray-50">
//             <div className="flex space-x-2">
//               {[
//                 { key: 'all', label: `All (${dispatches.length})`, color: 'blue' },
//                 { key: 'pending', label: `Pending (${dispatches.filter(d => !d.is_Voucher_Generated).length})`, color: 'yellow' },
//                 { key: 'generated', label: `Generated (${dispatches.filter(d => d.is_Voucher_Generated).length})`, color: 'green' }
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setFilter(tab.key as any)}
//                   className={`px-3 py-1 rounded text-sm font-medium ${
//                     filter === tab.key 
//                       ? `bg-${tab.color}-600 text-white` 
//                       : 'bg-gray-200 text-gray-700'
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Compact Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-2 py-2 text-left font-semibold">Dispatch No</th>
//                   <th className="px-2 py-2 text-left font-semibold">Date</th>
//                   <th className="px-2 py-2 text-left font-semibold">Customer</th>
//                   <th className="px-2 py-2 text-center font-semibold">Items</th>
//                   <th className="px-2 py-2 text-center font-semibold">Voucher</th>
//                   <th className="px-2 py-2 text-center font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {getFilteredDispatches().map((dispatch) => (
//                   <tr key={dispatch.ID} className="hover:bg-gray-50 text-sm">
//                     <td className="px-2 py-2 font-medium text-blue-600">{dispatch.Number}</td>
//                     <td className="px-2 py-2 text-gray-600">
//                       {new Date(dispatch.Date).toLocaleDateString()}
//                     </td>
//                     <td className="px-2 py-2 text-gray-600">
//                       {dispatch.account?.acName || 'N/A'}
//                     </td>
//                     <td className="px-2 py-2 text-center text-gray-600">
//                       {dispatch.details?.length || 0}
//                     </td>
//                     <td className="px-2 py-2 text-center">
//                       <span className={`px-2 py-1 rounded text-xs font-bold ${
//                         dispatch.is_Voucher_Generated 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {dispatch.is_Voucher_Generated ? 'Generated' : 'Pending'}
//                       </span>
//                     </td>
//                     <td className="px-2 py-2">
//                       <div className="flex justify-center space-x-1">
//                         {!dispatch.is_Voucher_Generated ? (
//                           // Create Voucher
//                           <button
//                             onClick={() => handleCreateVoucher(dispatch)}
//                             className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
//                             title="Create Voucher"
//                           >
//                             Create
//                           </button>
//                         ) : (
//                           // Edit & Delete Voucher
//                           <>
//                             <button
//                               onClick={() => handleEditVoucher(dispatch)}
//                               className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
//                               title="Edit Voucher"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteVoucherClick(dispatch)}
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

//         {/* Sales Voucher Modal */}
//         {showVoucher && selectedDispatchId && (
//           <SalesVoucher
//             dispatchId={selectedDispatchId}
//             mode={voucherMode}
//             onClose={() => {
//               setShowVoucher(false)
//               setSelectedDispatchId(null)
//             }}
//             onSuccess={loadDispatches}
//           />
//         )}
//       </div>

//       {/* Reset Voucher Confirmation */}
//       <ConfirmationModal
//         isOpen={showDeleteConfirm}
//         onClose={() => {
//           setShowDeleteConfirm(false)
//           setDispatchToResetVoucher(null)
//         }}
//         onConfirm={handleConfirmResetVoucher}
//         title="Reset Voucher Status"
//         message={`Reset voucher status for dispatch "${dispatchToResetVoucher?.Number}"? This will change the status back to "Not Generated" so you can create a new voucher.`}
//         confirmText="Yes, Reset"
//         cancelText="Cancel"
//         type="warning"
//         loading={deleteLoading}
//       />
//     </>
//   )
// }





















































// 'use client'
// import React, { useState, useEffect } from 'react'
// import { SalesVoucher } from './SalesVoucher'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { JournalPostModal } from './JournalPostModal'

// interface DispatchRecord {
//   ID: number
//   Number: string
//   Date: string
//   account?: { acName: string }
//   Status: string
//   is_Voucher_Generated: boolean
//   details?: any[]
// }

// export function DispatchListWithVoucher() {
//   const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
//   const [loading, setLoading] = useState(false)
//   const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null)
//   const [showVoucher, setShowVoucher] = useState(false)
//   const [voucherMode, setVoucherMode] = useState<'create' | 'edit'>('create')
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [dispatchToResetVoucher, setDispatchToResetVoucher] = useState<DispatchRecord | null>(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [filter, setFilter] = useState<'all' | 'generated' | 'pending'>('all')

//   // ADD JOURNAL POSTING STATES
//   const [showJournalModal, setShowJournalModal] = useState(false)
//   const [dispatchToPost, setDispatchToPost] = useState<DispatchRecord | null>(null)
//   const [postLoading, setPostLoading] = useState<number | null>(null)

//   useEffect(() => {
//     loadDispatches()
//   }, [])

//   const loadDispatches = async () => {
//     setLoading(true)
//     try {
//       let response
//       let result

//       try {
//         response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`)
//         result = await response.json()
//       } catch (err) {
//         response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
//         result = await response.json()
//       }

//       if (result.success && result.data) {
//         setDispatches(result.data)
//       }
//     } catch (error) {
//       console.error('💥 Error loading dispatches:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getFilteredDispatches = () => {
//     switch (filter) {
//       case 'generated': return dispatches.filter(d => d.is_Voucher_Generated)
//       case 'pending': return dispatches.filter(d => !d.is_Voucher_Generated)
//       default: return dispatches
//     }
//   }

//   const handleCreateVoucher = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.ID)
//     setVoucherMode('create')
//     setShowVoucher(true)
//   }

//   const handleEditVoucher = (dispatch: DispatchRecord) => {
//     setSelectedDispatchId(dispatch.ID)
//     setVoucherMode('edit')
//     setShowVoucher(true)
//   }

//   const handleDeleteVoucherClick = (dispatch: DispatchRecord) => {
//     setDispatchToResetVoucher(dispatch)
//     setShowDeleteConfirm(true)
//   }

//   const handleConfirmResetVoucher = async () => {
//     if (!dispatchToResetVoucher) return

//     setDeleteLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchToResetVoucher.ID}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ is_Voucher_Generated: false })
//       })

//       if (response.ok) {
//         setDispatches(prev =>
//           prev.map(d =>
//             d.ID === dispatchToResetVoucher.ID
//               ? { ...d, is_Voucher_Generated: false }
//               : d
//           )
//         )
//         setShowDeleteConfirm(false)
//         setDispatchToResetVoucher(null)
//       }
//     } catch (error) {
//       console.error('Error resetting voucher:', error)
//     } finally {
//       setDeleteLoading(false)
//     }
//   }

//   // ADD JOURNAL POSTING FUNCTION
//   const handlePostToJournalClick = (dispatch: DispatchRecord) => {
//     setDispatchToPost(dispatch)
//     setShowJournalModal(true)
//   }

//   const handleConfirmPostToJournal = async () => {
//     if (!dispatchToPost) return

//     setShowJournalModal(false)
//     setPostLoading(dispatchToPost.ID)

//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/journal-master/post-voucher/${dispatchToPost.ID}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' }
//       })

//       const result = await response.json()

//       if (result.success) {
//         // Show success message with details
//         const summary = result.data.summary
//         alert(`✅ Journal Posted Successfully!

// 📋 Journal Details:
// • Journal No: ${result.data.journalMaster.voucherNo}
// • Total Entries: ${summary.totalRows} rows
// • Net Total: ₨${summary.netTotal.toFixed(2)}
// • Carriage: ₨${summary.carriageAmount.toFixed(2)}
// • Customer Amount: ₨${summary.customerAmount.toFixed(2)}
// • Batches: ${summary.batches}

// 💰 Balance Check:
// • Total Dr: ₨${summary.totalDr.toFixed(2)}
// • Total Cr: ₨${summary.totalCr.toFixed(2)}
// • Balanced: ${summary.balanced ? '✅ Yes' : '❌ No'}`)

//         loadDispatches() // Refresh the list
//       } else {
//         alert(`❌ Failed to Post to Journal:\n${result.error}`)
//       }
//     } catch (error) {
//       console.error('Error posting to journal:', error)
//       alert('❌ Error posting to journal')
//     } finally {
//       setPostLoading(null)
//       setDispatchToPost(null)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center py-16">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <span className="ml-4 text-gray-600 text-lg">Loading dispatches...</span>
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
//               <h2 className="text-lg font-bold text-gray-800">Sales Voucher Management</h2>
//               <p className="text-sm text-gray-600">Manage vouchers and post to journal</p>
//             </div>
//             <button
//               onClick={loadDispatches}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
//             >
//               Refresh
//             </button>
//           </div>

//           {/* Filter Tabs */}
//           <div className="p-3 border-b bg-gray-50">
//             <div className="flex space-x-2">
//               {[
//                 { key: 'all', label: `All (${dispatches.length})`, color: 'blue' },
//                 { key: 'pending', label: `Pending (${dispatches.filter(d => !d.is_Voucher_Generated).length})`, color: 'yellow' },
//                 { key: 'generated', label: `Generated (${dispatches.filter(d => d.is_Voucher_Generated).length})`, color: 'green' }
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setFilter(tab.key as any)}
//                   className={`px-3 py-1 rounded text-sm font-medium ${filter === tab.key
//                       ? `bg-${tab.color}-600 text-white`
//                       : 'bg-gray-200 text-gray-700'
//                     }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Dispatch Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left font-semibold text-xs">Dispatch No</th>
//                   <th className="px-3 py-2 text-left font-semibold text-xs">Date</th>
//                   <th className="px-3 py-2 text-left font-semibold text-xs">Customer</th>
//                   <th className="px-3 py-2 text-left font-semibold text-xs">Status</th>
//                   <th className="px-3 py-2 text-left font-semibold text-xs">Items</th>
//                   <th className="px-3 py-2 text-center font-semibold text-xs">Voucher Status</th>
//                   <th className="px-3 py-2 text-center font-semibold text-xs">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {getFilteredDispatches().map((dispatch) => (
//                   <tr key={dispatch.ID} className="hover:bg-gray-50 text-xs">
//                     <td className="px-3 py-2 font-medium text-blue-600">{dispatch.Number}</td>
//                     <td className="px-3 py-2 text-gray-600">
//                       {new Date(dispatch.Date).toLocaleDateString()}
//                     </td>
//                     <td className="px-3 py-2 text-gray-600">
//                       {dispatch.account?.acName || 'N/A'}
//                     </td>
//                     <td className="px-3 py-2">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${dispatch.Status === 'Post'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                         {dispatch.Status}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2 text-gray-600">
//                       {dispatch.details?.length || 0}
//                     </td>
//                     <td className="px-3 py-2 text-center">
//                       <span className={`px-2 py-1 rounded text-xs font-bold ${dispatch.is_Voucher_Generated
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                         }`}>
//                         {dispatch.is_Voucher_Generated ? 'Generated' : 'Pending'}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2">
//                       <div className="flex justify-center space-x-1">
//                         {!dispatch.is_Voucher_Generated ? (
//                           // Create Voucher Button
//                           <button
//                             onClick={() => handleCreateVoucher(dispatch)}
//                             className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
//                           >
//                             Create
//                           </button>
//                         ) : (
//                           // Generated Voucher Actions
//                           <>
//                             <button
//                               onClick={() => handleEditVoucher(dispatch)}
//                               className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 flex items-center"
//                             >
//                               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
//                               </svg>
//                               Edit
//                             </button>

//                             <button
//                               onClick={() => handleDeleteVoucherClick(dispatch)}
//                               className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 flex items-center"
//                             >
//                               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                               </svg>
//                               Reset
//                             </button>

//                             {/* POST TO JOURNAL BUTTON */}
//                             <button
//                               onClick={() => handlePostToJournalClick(dispatch)}
//                               disabled={postLoading === dispatch.ID}
//                               className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                               title="Post to Journal"
//                             >
//                               {postLoading === dispatch.ID ? (
//                                 <>
//                                   <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
//                                   Posting...
//                                 </>
//                               ) : (
//                                 <>
//                                   <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                   </svg>
//                                   Post
//                                 </>
//                               )}
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

//         {/* Sales Voucher Modal */}
//         {showVoucher && selectedDispatchId && (
//           <SalesVoucher
//             dispatchId={selectedDispatchId}
//             mode={voucherMode}
//             onClose={() => {
//               setShowVoucher(false)
//               setSelectedDispatchId(null)
//             }}
//             onSuccess={loadDispatches}
//           />
//         )}
//       </div>

//       {/* Reset Voucher Confirmation */}
//       <ConfirmationModal
//         isOpen={showDeleteConfirm}
//         onClose={() => {
//           setShowDeleteConfirm(false)
//           setDispatchToResetVoucher(null)
//         }}
//         onConfirm={handleConfirmResetVoucher}
//         title="Reset Voucher Status"
//         message={`Reset voucher status for dispatch "${dispatchToResetVoucher?.Number}"?`}
//         confirmText="Yes, Reset"
//         cancelText="Cancel"
//         type="warning"
//         loading={deleteLoading}
//       />

//       {/* Journal Post Confirmation Modal */}
//       <JournalPostModal
//         isOpen={showJournalModal}
//         onClose={() => {
//           setShowJournalModal(false)
//           setDispatchToPost(null)
//         }}
//         onConfirm={handleConfirmPostToJournal}
//         dispatch={dispatchToPost}
//       />
//     </>
//   )
// }












































































'use client'
import React, { useState, useEffect } from 'react'
import { SalesVoucher } from './SalesVoucher'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { JournalPostModal } from './JournalPostModal'

interface DispatchRecord {
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

export function DispatchListWithVoucher() {
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDispatchId, setSelectedDispatchId] = useState<number | null>(null)
  const [showVoucher, setShowVoucher] = useState(false)
  const [voucherMode, setVoucherMode] = useState<'create' | 'edit'>('create')
  
  // COMMENTED OUT RESET FUNCTIONALITY
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // const [dispatchToResetVoucher, setDispatchToResetVoucher] = useState<DispatchRecord | null>(null)
  // const [deleteLoading, setDeleteLoading] = useState(false)
  
  const [filter, setFilter] = useState<'all' | 'generated' | 'pending' | 'posted'>('all')
  
  // Journal posting states
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [dispatchToToggle, setDispatchToToggle] = useState<DispatchRecord | null>(null)
  const [toggleLoading, setToggleLoading] = useState<number | null>(null)
  const [journalSuccess, setJournalSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadDispatches()
  }, [])

  // AUTO-HIDE SUCCESS MESSAGE
  useEffect(() => {
    if (journalSuccess) {
      const timer = setTimeout(() => setJournalSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [journalSuccess])

  const loadDispatches = async () => {
    setLoading(true)
    try {
      let response
      let result
      
      try {
        response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`)
        result = await response.json()
      } catch (err) {
        console.log('Trying alternative dispatch endpoint...')
        response = await fetch(`http://${window.location.hostname}:4000/api/stock-order`)
        result = await response.json()
      }
      
      if (result.success && result.data) {
        console.log('✅ Loaded dispatches:', result.data.length)
        
        // CHECK JOURNAL STATUS FOR EACH DISPATCH
        const dispatchesWithJournalStatus = await Promise.all(
          result.data.map(async (dispatch: DispatchRecord) => {
            try {
              const journalResponse = await fetch(
                `http://${window.location.hostname}:4000/api/journal-master/check-status/${dispatch.ID}`
              )
              const journalResult = await journalResponse.json()
              
              return {
                ...dispatch,
                hasJournal: journalResult.success && journalResult.isPosted,
                journalStatus: journalResult.journalStatus, // 'Post' or 'UnPost' or null
                journalId: journalResult.journalId
              }
            } catch (error) {
              console.log(`⚠️ Could not check journal status for dispatch ${dispatch.ID}`)
              return { 
                ...dispatch, 
                hasJournal: false, 
                journalStatus: null,
                journalId: null 
              }
            }
          })
        )
        
        setDispatches(dispatchesWithJournalStatus)
        console.log('📊 Dispatches with journal status loaded')
      } else {
        console.error('❌ No data in response:', result)
      }
    } catch (error) {
      console.error('💥 Error loading dispatches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredDispatches = () => {
    switch (filter) {
      case 'pending': 
        return dispatches.filter(d => !d.is_Voucher_Generated)
      case 'generated': 
        return dispatches.filter(d => d.is_Voucher_Generated && d.journalStatus === 'UnPost')
      case 'posted': 
        return dispatches.filter(d => d.journalStatus === 'Post')
      default: 
        return dispatches
    }
  }

  const getStatusCounts = () => {
    const total = dispatches.length
    const pending = dispatches.filter(d => !d.is_Voucher_Generated).length
    const generated = dispatches.filter(d => d.is_Voucher_Generated && d.journalStatus === 'UnPost').length
    const posted = dispatches.filter(d => d.journalStatus === 'Post').length
    
    return { total, pending, generated, posted }
  }

  const handleCreateVoucher = (dispatch: DispatchRecord) => {
    setSelectedDispatchId(dispatch.ID)
    setVoucherMode('create')
    setShowVoucher(true)
  }

  const handleEditVoucher = (dispatch: DispatchRecord) => {
    setSelectedDispatchId(dispatch.ID)
    setVoucherMode('edit')
    setShowVoucher(true)
  }

  // COMMENTED OUT RESET FUNCTIONALITY
  /*
  const handleDeleteVoucherClick = (dispatch: DispatchRecord) => {
    setDispatchToResetVoucher(dispatch)
    setShowDeleteConfirm(true)
  }

  const handleConfirmResetVoucher = async () => {
    if (!dispatchToResetVoucher) return
    
    setDeleteLoading(true)
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchToResetVoucher.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_Voucher_Generated: false })
      })
      
      if (response.ok) {
        setDispatches(prev => 
          prev.map(d => 
            d.ID === dispatchToResetVoucher.ID 
              ? { ...d, is_Voucher_Generated: false, journalStatus: null }
              : d
          )
        )
        setShowDeleteConfirm(false)
        setDispatchToResetVoucher(null)
        
        setTimeout(() => loadDispatches(), 500)
      }
    } catch (error) {
      console.error('Error resetting voucher:', error)
      alert('❌ Failed to reset voucher')
    } finally {
      setDeleteLoading(false)
    }
  }
  */

  // TOGGLE POST/UNPOST FUNCTIONALITY
  const handleToggleJournalClick = (dispatch: DispatchRecord) => {
    setDispatchToToggle(dispatch)
    setShowJournalModal(true)
  }

  const handleConfirmToggleJournal = async () => {
    if (!dispatchToToggle) return
    
    setShowJournalModal(false)
    setToggleLoading(dispatchToToggle.ID)
    
    try {
      // TOGGLE POST/UNPOST STATUS
      const response = await fetch(`http://${window.location.hostname}:4000/api/journal-master/post-voucher/${dispatchToToggle.ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'post' }) // Backend will toggle automatically
      })
      
      const result = await response.json()
      
      if (result.success) {
        const newStatus = result.data.journalMaster.status
        
        // UPDATE DISPATCH STATUS
        setDispatches(prev => 
          prev.map(d => 
            d.ID === dispatchToToggle.ID 
              ? { ...d, journalStatus: newStatus }
              : d
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
      setDispatchToToggle(null)
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600 text-lg">Loading dispatches...</span>
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
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Sales Voucher & Journal Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">Create vouchers, auto-create journals, and toggle post status</p>
            </div>
            <button
              onClick={loadDispatches}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
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
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Dispatch No</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Items</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Voucher Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Journal Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredDispatches().map((dispatch) => (
                  <tr key={dispatch.ID} className="hover:bg-blue-50 text-sm transition-colors duration-200">
                    <td className="px-4 py-3 font-bold text-blue-700">{dispatch.Number}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(dispatch.Date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {dispatch.account?.acName || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        dispatch.Status === 'Post' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-orange-100 text-orange-800 border border-orange-300'
                      }`}>
                        {dispatch.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {dispatch.details?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        dispatch.is_Voucher_Generated 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {dispatch.is_Voucher_Generated ? '✅ Generated' : '❌ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        dispatch.journalStatus === 'Post'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                          : dispatch.journalStatus === 'UnPost'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}>
                        {dispatch.journalStatus === 'Post' 
                          ? '✅ Posted' 
                          : dispatch.journalStatus === 'UnPost' 
                          ? '📄 UnPost' 
                          : '❌ No Journal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-1">
                        {!dispatch.is_Voucher_Generated ? (
                          // CREATE VOUCHER BUTTON
                          <button
                            onClick={() => handleCreateVoucher(dispatch)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
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
                              onClick={() => handleEditVoucher(dispatch)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                              </svg>
                              Edit
                            </button>
                            
                            {/* COMMENTED OUT RESET BUTTON */}
                            {/*
                            <button
                              onClick={() => handleDeleteVoucherClick(dispatch)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Reset
                            </button>
                            */}
                            
                            {/* POST/UNPOST TOGGLE BUTTON */}
                            {(dispatch.journalStatus === 'UnPost' || dispatch.journalStatus === 'Post') && (
                              <button
                                onClick={() => handleToggleJournalClick(dispatch)}
                                disabled={toggleLoading === dispatch.ID}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all duration-200 transform hover:scale-105 shadow-sm disabled:transform-none disabled:cursor-not-allowed ${
                                  dispatch.journalStatus === 'UnPost' 
                                    ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white'
                                    : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white'
                                }`}
                                title={dispatch.journalStatus === 'UnPost' ? 'Post to ledger' : 'Unpost from ledger'}
                              >
                                {toggleLoading === dispatch.ID ? (
                                  <>
                                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                    {dispatch.journalStatus === 'UnPost' ? 'Posting...' : 'Unposting...'}
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                        dispatch.journalStatus === 'UnPost' 
                                          ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                          : "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      } />
                                    </svg>
                                    {dispatch.journalStatus === 'UnPost' ? 'Post' : 'UnPost'}
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
          </div>
        </div>

        {/* SALES VOUCHER MODAL */}
        {showVoucher && selectedDispatchId && (
          <SalesVoucher
            dispatchId={selectedDispatchId}
            mode={voucherMode}
            onClose={() => {
              setShowVoucher(false)
              setSelectedDispatchId(null)
            }}
            onSuccess={loadDispatches}
          />
        )}
      </div>
      {/* POST/UNPOST CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showJournalModal}
        onClose={() => {
          setShowJournalModal(false)
          setDispatchToToggle(null)
        }}
        onConfirm={handleConfirmToggleJournal}
        title={`${dispatchToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'} Journal`}
        message={`${dispatchToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'} journal for dispatch "${dispatchToToggle?.Number}"? This will update the journal status in both master and detail tables.`}
        confirmText={`Yes, ${dispatchToToggle?.journalStatus === 'UnPost' ? 'Post' : 'Unpost'}`}
        cancelText="Cancel"
        type="info"
        loading={toggleLoading !== null}
      />
    </>
  )
}
