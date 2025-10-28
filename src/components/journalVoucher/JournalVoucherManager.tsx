// 'use client'
// import React, { useState, useMemo } from 'react'
// import {
//   useGetJournalVouchersQuery,
//   useDeleteJournalVoucherMutation,
// } from '@/store/slice/journalVoucherSlice'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { useRouter } from 'next/navigation'
// import { formatDisplayDate, formatAmount } from '@/utils/formatters'

// interface Props {
//   voucherType?: 'journal' | 'pettycash' | 'all'
// }

// export const JournalVoucherManager: React.FC<Props> = ({ voucherType = 'all' }) => {
//   const router = useRouter()
//   const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number }>({ isOpen: false })
//   const [searchTerm, setSearchTerm] = useState('')

//   // RTK Query hooks
//   const { data: vouchers = [], isLoading, error } = useGetJournalVouchersQuery()
//   const [deleteVoucher, { isLoading: isDeleting }] = useDeleteJournalVoucherMutation()

//   // Filter vouchers by type and search
//   const filteredVouchers = useMemo(() => {
//     let filtered = vouchers

//     // Filter by voucher type
//     if (voucherType !== 'all') {
//       const typeId = voucherType === 'journal' ? 10 : 14
//       filtered = filtered.filter(voucher => voucher.voucherTypeId === typeId)
//     }

//     // Filter by search term
//     if (searchTerm.trim()) {
//       filtered = filtered.filter(voucher => 
//         voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         voucher.id.toString().includes(searchTerm) ||
//         (voucher.details && voucher.details.some((detail: any) => 
//           detail.description?.toLowerCase().includes(searchTerm.toLowerCase())
//         ))
//       )
//     }

//     return filtered
//   }, [vouchers, voucherType, searchTerm])

//   // Voucher type configuration
//   const getVoucherTypeConfig = (typeId: number) => {
//     switch (typeId) {
//       case 10:
//         return { name: 'Journal Voucher', color: 'bg-blue-100 text-blue-800', path: 'journal' }
//       case 14:
//         return { name: 'Petty Cash Voucher', color: 'bg-green-100 text-green-800', path: 'petty' }
//       default:
//         return { name: 'Unknown Voucher', color: 'bg-gray-100 text-gray-800', path: 'unknown' }
//     }
//   }

//   // Calculate totals for voucher
//   const calculateVoucherTotals = (details: any[]) => {
//     if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }

//     const debit = details.reduce((sum, detail) => sum + (detail.ownDb || 0), 0)
//     const credit = details.reduce((sum, detail) => sum + (detail.ownCr || 0), 0)
//     return { debit, credit }
//   }

//   // Handle create navigation
//   const handleCreate = (type: 'journal' | 'pettycash') => {
//     router.push(`/vouchers/${type}/create`)
//   }

//   // Handle edit navigation
//   const handleEdit = (voucher: any) => {
//     const config = getVoucherTypeConfig(voucher.voucherTypeId)
//     router.push(`/vouchers/${config.path}/edit/${voucher.id}`)
//   }

//   // Handle delete
//   const handleDeleteClick = (voucherId: number) => {
//     setConfirmModal({ isOpen: true, voucherId })
//   }

//   const handleConfirmDelete = async () => {
//     if (!confirmModal.voucherId) return

//     try {
//       await deleteVoucher(confirmModal.voucherId).unwrap()
//       setConfirmModal({ isOpen: false })
//     } catch (err) {
//       console.error('Failed to delete voucher:', err)
//     }
//   }

//   if (isLoading) {
//     return <Loading size="lg" text="Loading Vouchers..." />
//   }

//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//           <p className="text-red-600">Failed to load vouchers. Please try again.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-900">
//             {voucherType === 'all' ? 'All Vouchers' : 
//              voucherType === 'journal' ? 'Journal Vouchers' : 
//              'Petty Cash Vouchers'} Management
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Manage your voucher entries ({filteredVouchers.length} total)
//           </p>
//         </div>

//         <div className="flex space-x-3">
//           {(voucherType === 'all' || voucherType === 'journal') && (
//             <Button 
//               onClick={() => handleCreate('journal')}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Create Journal Voucher
//             </Button>
//           )}
//           {(voucherType === 'all' || voucherType === 'pettycash') && (
//             <Button 
//               onClick={() => handleCreate('pettycash')}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               Create Petty Cash Voucher
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//           <div className="flex-1">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by voucher number, ID, or description..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           {searchTerm && (
//             <Button
//               variant="secondary"
//               onClick={() => setSearchTerm('')}
//               className="flex items-center space-x-2"
//             >
//               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//               <span>Clear</span>
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Vouchers Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">
//             Vouchers List
//           </h2>
//         </div>

//         {filteredVouchers.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             {searchTerm ? (
//               <div>
//                 <p className="text-lg mb-2">No results found for "{searchTerm}"</p>
//                 <p className="text-sm">Try adjusting your search terms.</p>
//               </div>
//             ) : (
//               'No vouchers found. Create your first voucher above.'
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Voucher Info
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Totals
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredVouchers.map((voucher: any) => {
//                   const config = getVoucherTypeConfig(voucher.voucherTypeId)
//                   const totals = calculateVoucherTotals(voucher.details || [])

//                   return (
//                     <tr key={voucher.id} className="hover:bg-gray-50 transition-colors">
//                       {/* Voucher Info */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
//                             <span className="text-purple-600 font-semibold text-sm">
//                               {voucher.id}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {searchTerm ? (
//                                 <span dangerouslySetInnerHTML={{
//                                   __html: voucher.voucherNo.replace(
//                                     new RegExp(`(${searchTerm})`, 'gi'),
//                                     '<mark class="bg-yellow-200">$1</mark>'
//                                   )
//                                 }} />
//                               ) : (
//                                 voucher.voucherNo
//                               )}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               ID: {voucher.id}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Type */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
//                           {config.name}
//                         </span>
//                       </td>

//                       {/* Date */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {formatDisplayDate(voucher.date)}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {voucher.createdAt && `Created: ${formatDisplayDate(voucher.createdAt)}`}
//                         </div>
//                       </td>

//                       {/* Totals */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           Dr: {formatAmount(totals.debit)}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Cr: {formatAmount(totals.credit)}
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           voucher.status 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {voucher.status ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex items-center justify-end space-x-2">
//                           <Button
//                             variant="secondary"
//                             onClick={() => handleEdit(voucher)}
//                             className="px-3 py-1 text-xs"
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             variant="danger"
//                             onClick={() => handleDeleteClick(voucher.id)}
//                             className="px-3 py-1 text-xs"
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         onClose={() => setConfirmModal({ isOpen: false })}
//         onConfirm={handleConfirmDelete}
//         title="Delete Voucher"
//         message="Are you sure you want to delete this voucher? This action cannot be undone."
//         confirmText="Delete Voucher"
//         cancelText="Cancel"
//         type="danger"
//         loading={isDeleting}
//       />
//     </div>
//   )
// }


























































// 'use client'
// import React, { useState, useMemo } from 'react'
// import {
//   useGetJournalVouchersByTypeQuery,
//   useGetPettyCashVouchersByTypeQuery,
//   useDeleteJournalVoucherMutation,
//   usePostUnpostVoucherMutation,
// } from '@/store/slice/journalVoucherSlice'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { useRouter } from 'next/navigation'
// import { formatDisplayDate, formatAmount, getVoucherStatusInfo, getPostUnpostButtonInfo } from '@/utils/formatters'

// interface Props {
//   voucherType?: 'journal' | 'pettycash' | 'all'
// }

// export const JournalVoucherManager: React.FC<Props> = ({ voucherType = 'all' }) => {
//   const router = useRouter()
//   const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number; type?: string }>({ isOpen: false })
//   const [searchTerm, setSearchTerm] = useState('')

//   // RTK Query hooks - Use new type-specific endpoints
//   const { data: journalVouchers = [], isLoading: journalLoading, error: journalError } = useGetJournalVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'pettycash'
//   })

//   const { data: pettyCashVouchers = [], isLoading: pettyCashLoading, error: pettyCashError } = useGetPettyCashVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'journal'
//   })

//   const [deleteVoucher, { isLoading: isDeleting }] = useDeleteJournalVoucherMutation()
//   const [postUnpostVoucher, { isLoading: isPostingUnposting }] = usePostUnpostVoucherMutation()

//   // Combine vouchers based on type
//   const allVouchers = useMemo(() => {
//     let combined: any[] = []

//     if (voucherType === 'all' || voucherType === 'journal') {
//       combined = [...combined, ...journalVouchers]
//     }

//     if (voucherType === 'all' || voucherType === 'pettycash') {
//       combined = [...combined, ...pettyCashVouchers]
//     }

//     // Sort by creation date (newest first)
//     return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   }, [journalVouchers, pettyCashVouchers, voucherType])

//   // Filter vouchers by search
//   const filteredVouchers = useMemo(() => {
//     if (!searchTerm.trim()) return allVouchers

//     return allVouchers.filter(voucher => 
//       voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       voucher.id.toString().includes(searchTerm) ||
//       (voucher.details && voucher.details.some((detail: any) => 
//         detail.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         detail.coa?.acName?.toLowerCase().includes(searchTerm.toLowerCase())
//       ))
//     )
//   }, [allVouchers, searchTerm])

//   // Get voucher type configuration
//   const getVoucherTypeConfig = (typeId: number) => {
//     switch (typeId) {
//       case 10:
//         return { name: 'Journal Voucher', color: 'bg-blue-100 text-blue-800', path: 'journal' }
//       case 14:
//         return { name: 'Petty Cash Voucher', color: 'bg-green-100 text-green-800', path: 'petty' }
//       default:
//         return { name: 'Unknown Voucher', color: 'bg-gray-100 text-gray-800', path: 'unknown' }
//     }
//   }

//   // Calculate totals for voucher
//   const calculateVoucherTotals = (details: any[]) => {
//     if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }

//     const debit = details.reduce((sum, detail) => sum + (detail.ownDb || 0), 0)
//     const credit = details.reduce((sum, detail) => sum + (detail.ownCr || 0), 0)
//     return { debit, credit }
//   }

//   // Handle create navigation
//   const handleCreate = (type: 'journal' | 'pettycash') => {
//     router.push(`/vouchers/${type}/create`)
//   }

//   // Handle edit navigation
//   const handleEdit = (voucher: any) => {
//     const config = getVoucherTypeConfig(voucher.voucherTypeId)
//     router.push(`/vouchers/${config.path}/edit/${voucher.id}`)
//   }

//   // Handle delete
//   const handleDeleteClick = (voucherId: number) => {
//     setConfirmModal({ isOpen: true, voucherId, type: 'delete' })
//   }

//   // ✅ NEW: Handle post/unpost
//   const handlePostUnpostClick = (voucherId: number, currentStatus: boolean) => {
//     setConfirmModal({ 
//       isOpen: true, 
//       voucherId, 
//       type: currentStatus ? 'unpost' : 'post' 
//     })
//   }

//   const handleConfirmAction = async () => {
//     if (!confirmModal.voucherId || !confirmModal.type) return

//     try {
//       if (confirmModal.type === 'delete') {
//         await deleteVoucher(confirmModal.voucherId).unwrap()
//       } else if (confirmModal.type === 'post' || confirmModal.type === 'unpost') {
//         await postUnpostVoucher(confirmModal.voucherId).unwrap()
//       }
//       setConfirmModal({ isOpen: false })
//     } catch (err) {
//       console.error(`Failed to ${confirmModal.type} voucher:`, err)
//     }
//   }

//   // Loading state
//   const isLoading = journalLoading || pettyCashLoading
//   const error = journalError || pettyCashError

//   if (isLoading) {
//     return <Loading size="lg" text="Loading Vouchers..." />
//   }

//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//           <p className="text-red-600">Failed to load vouchers. Please try again.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4 space-y-6"> {/* ✅ REDUCED: p-6 space-y-8 to p-4 space-y-6 */}
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4"> {/* ✅ REDUCED: pb-6 */}
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900"> {/* ✅ REDUCED: text-3xl */}
//             {voucherType === 'all' ? 'All Vouchers' : 
//              voucherType === 'journal' ? 'Journal Vouchers' : 
//              'Petty Cash Vouchers'} Management
//           </h1>
//           <p className="text-gray-600 mt-1"> {/* ✅ REDUCED: mt-2 */}
//             Manage your voucher entries ({filteredVouchers.length} total)
//           </p>
//         </div>

//         <div className="flex space-x-3">
//           {(voucherType === 'all' || voucherType === 'journal') && (
//             <Button 
//               onClick={() => handleCreate('journal')}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Create Journal
//             </Button>
//           )}
//           {(voucherType === 'all' || voucherType === 'pettycash') && (
//             <Button 
//               onClick={() => handleCreate('pettycash')}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               Create Petty Cash
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4"> {/* ✅ REDUCED: p-6 to p-4 */}
//         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//           <div className="flex-1">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by voucher number, ID, description, or account..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           {searchTerm && (
//             <Button
//               variant="secondary"
//               onClick={() => setSearchTerm('')}
//               className="flex items-center space-x-2"
//             >
//               <span>Clear</span>
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Vouchers Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="px-4 py-3 border-b border-gray-200"> {/* ✅ REDUCED: px-6 py-4 */}
//           <h2 className="text-lg font-medium text-gray-900">
//             Vouchers List
//           </h2>
//         </div>

//         {filteredVouchers.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             {searchTerm ? (
//               <div>
//                 <p className="text-lg mb-2">No results found for "{searchTerm}"</p>
//                 <p className="text-sm">Try adjusting your search terms.</p>
//               </div>
//             ) : (
//               'No vouchers found. Create your first voucher above.'
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* ✅ REDUCED: px-6 */}
//                     Voucher Info
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Totals
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredVouchers.map((voucher: any) => {
//                   const config = getVoucherTypeConfig(voucher.voucherTypeId)
//                   const totals = calculateVoucherTotals(voucher.details || [])
//                   const statusInfo = getVoucherStatusInfo(voucher.status)
//                   const postUnpostInfo = getPostUnpostButtonInfo(voucher.status)

//                   return (
//                     <tr key={voucher.id} className="hover:bg-gray-50 transition-colors">
//                       {/* Voucher Info */}
//                       <td className="px-4 py-3 whitespace-nowrap"> {/* ✅ REDUCED: px-6 py-4 */}
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0"> {/* ✅ REDUCED: w-10 h-10 */}
//                             <span className="text-purple-600 font-semibold text-xs"> {/* ✅ REDUCED: text-sm */}
//                               {voucher.id}
//                             </span>
//                           </div>
//                           <div className="ml-3"> {/* ✅ REDUCED: ml-4 */}
//                             <div className="text-sm font-medium text-gray-900">
//                               {searchTerm ? (
//                                 <span dangerouslySetInnerHTML={{
//                                   __html: voucher.voucherNo.replace(
//                                     new RegExp(`(${searchTerm})`, 'gi'),
//                                     '<mark class="bg-yellow-200">$1</mark>'
//                                   )
//                                 }} />
//                               ) : (
//                                 voucher.voucherNo
//                               )}
//                             </div>
//                             <div className="text-xs text-gray-500"> {/* ✅ REDUCED: text-sm */}
//                               ID: {voucher.id}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Type */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
//                           {config.name}
//                         </span>
//                       </td>

//                       {/* Date */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {formatDisplayDate(voucher.date)} {/* ✅ FIXED: Uses formatDisplayDate for DD/MMM/YY */}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {voucher.createdAt && `Created: ${formatDisplayDate(voucher.createdAt)}`}
//                         </div>
//                       </td>

//                       {/* Totals */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           Dr: {formatAmount(totals.debit)} {/* ✅ FIXED: Uses formatAmount for 10,000.00 */}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Cr: {formatAmount(totals.credit)}
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
//                           {statusInfo.icon} {statusInfo.text}
//                         </span>
//                       </td>

//                       {/* ✅ NEW: Actions with Post/Unpost */}
//                       <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex items-center justify-end space-x-2">
//                           {/* Post/Unpost Button */}
//                           <Button
//                             onClick={() => handlePostUnpostClick(voucher.id, voucher.status)}
//                             className={`px-2 py-1 text-xs ${postUnpostInfo.color}`}
//                             loading={isPostingUnposting}
//                             disabled={isPostingUnposting}
//                           >
//                             {postUnpostInfo.text}
//                           </Button>

//                           {/* Edit Button */}
//                           <Button
//                             variant="secondary"
//                             onClick={() => handleEdit(voucher)}
//                             className="px-2 py-1 text-xs"
//                           >
//                             Edit
//                           </Button>

//                           {/* Delete Button */}
//                           <Button
//                             variant="danger"
//                             onClick={() => handleDeleteClick(voucher.id)}
//                             className="px-2 py-1 text-xs"
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ✅ ENHANCED: Confirmation Modal for Delete/Post/Unpost */}
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         onClose={() => setConfirmModal({ isOpen: false })}
//         onConfirm={handleConfirmAction}
//         title={
//           confirmModal.type === 'delete' ? 'Delete Voucher' :
//           confirmModal.type === 'post' ? 'Post Voucher' :
//           'Unpost Voucher'
//         }
//         message={
//           confirmModal.type === 'delete' 
//             ? 'Are you sure you want to delete this voucher? This action cannot be undone.'
//             : confirmModal.type === 'post'
//             ? 'Are you sure you want to post this voucher? This will make all journal details active.'
//             : 'Are you sure you want to unpost this voucher? This will change it back to draft status.'
//         }
//         confirmText={
//           confirmModal.type === 'delete' ? 'Delete Voucher' :
//           confirmModal.type === 'post' ? 'Post Voucher' :
//           'Unpost Voucher'
//         }
//         cancelText="Cancel"
//         type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
//         loading={isDeleting || isPostingUnposting}
//       />
//     </div>
//   )
// }






































































// 'use client'
// import React, { useState, useMemo } from 'react'
// import {
//   useGetJournalVouchersByTypeQuery,
//   useGetPettyCashVouchersByTypeQuery,
//   useDeleteJournalVoucherMutation,
//   usePostUnpostVoucherMutation,
// } from '@/store/slice/journalVoucherSlice'
// import { Button } from '@/components/ui/Button'
// import { Loading } from '@/components/ui/Loading'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { useRouter } from 'next/navigation'
// import { formatDisplayDate, formatAmount, getVoucherStatusInfo, getPostUnpostButtonInfo } from '@/utils/formatters'
// import { 
//   Search, 
//   Plus, 
//   RefreshCw, 
//   Filter,
//   FileText,
//   DollarSign,
//   ChevronDown,
//   ChevronUp,
//   Edit,
//   Trash2,
//   CheckCircle,
//   XCircle
// } from 'lucide-react'

// interface Props {
//   voucherType?: 'journal' | 'pettycash' | 'all'
// }

// export const JournalVoucherManager: React.FC<Props> = ({ voucherType = 'all' }) => {
//   const router = useRouter()
//   const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number; type?: string }>({ isOpen: false })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'draft'>('all') // ✅ NEW: Status filter
//   const [showFilters, setShowFilters] = useState(false) // ✅ NEW: Expandable filters
//   const [successMessage, setSuccessMessage] = useState<string | null>(null)

//   // RTK Query hooks
//   const { data: journalVouchers = [], isLoading: journalLoading, error: journalError, refetch: refetchJournal } = useGetJournalVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'pettycash'
//   })

//   const { data: pettyCashVouchers = [], isLoading: pettyCashLoading, error: pettyCashError, refetch: refetchPetty } = useGetPettyCashVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'journal'
//   })

//   const [deleteVoucher, { isLoading: isDeleting }] = useDeleteJournalVoucherMutation()
//   const [postUnpostVoucher, { isLoading: isPostingUnposting }] = usePostUnpostVoucherMutation()

//   // Combine vouchers based on type
//   const allVouchers = useMemo(() => {
//     let combined: any[] = []

//     if (voucherType === 'all' || voucherType === 'journal') {
//       combined = [...combined, ...journalVouchers]
//     }

//     if (voucherType === 'all' || voucherType === 'pettycash') {
//       combined = [...combined, ...pettyCashVouchers]
//     }

//     return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   }, [journalVouchers, pettyCashVouchers, voucherType])

//   // ✅ NEW: Filter vouchers by search and status
//   const filteredVouchers = useMemo(() => {
//     let filtered = allVouchers

//     // Status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(voucher => {
//         if (statusFilter === 'posted') return voucher.status === true
//         if (statusFilter === 'draft') return voucher.status === false
//         return true
//       })
//     }

//     // Search filter
//     if (searchTerm.trim()) {
//       filtered = filtered.filter(voucher => 
//         voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         voucher.id.toString().includes(searchTerm) ||
//         (voucher.details && voucher.details.some((detail: any) => 
//           detail.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           detail.coa?.acName?.toLowerCase().includes(searchTerm.toLowerCase())
//         ))
//       )
//     }

//     return filtered
//   }, [allVouchers, searchTerm, statusFilter])

//   // ✅ NEW: Get status counts
//   const getStatusCounts = () => {
//     const total = allVouchers.length
//     const posted = allVouchers.filter(v => v.status === true).length
//     const draft = allVouchers.filter(v => v.status === false).length
//     return { total, posted, draft }
//   }

//   // Get voucher type configuration
//   const getVoucherTypeConfig = (typeId: number) => {
//     switch (typeId) {
//       case 10:
//         return { name: 'Journal', color: 'bg-blue-100 text-blue-800', path: 'journal', icon: FileText }
//       case 14:
//         return { name: 'Petty Cash', color: 'bg-green-100 text-green-800', path: 'petty', icon: DollarSign }
//       default:
//         return { name: 'Unknown', color: 'bg-gray-100 text-gray-800', path: 'unknown', icon: FileText }
//     }
//   }

//   // Calculate totals for voucher
//   const calculateVoucherTotals = (details: any[]) => {
//     if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }

//     const debit = details.reduce((sum, detail) => sum + (detail.ownDb || 0), 0)
//     const credit = details.reduce((sum, detail) => sum + (detail.ownCr || 0), 0)
//     return { debit, credit }
//   }

//   // Handle refresh
//   const handleRefresh = async () => {
//     await Promise.all([
//       voucherType !== 'pettycash' ? refetchJournal() : Promise.resolve(),
//       voucherType !== 'journal' ? refetchPetty() : Promise.resolve()
//     ])
//   }

//   // Handle create navigation
//   const handleCreate = (type: 'journal' | 'pettycash') => {
//     router.push(`/vouchers/${type}/create`)
//   }

//   // Handle edit navigation
//   const handleEdit = (voucher: any) => {
//     const config = getVoucherTypeConfig(voucher.voucherTypeId)
//     router.push(`/vouchers/${config.path}/edit/${voucher.id}`)
//   }

//   // Handle delete
//   const handleDeleteClick = (voucherId: number) => {
//     setConfirmModal({ isOpen: true, voucherId, type: 'delete' })
//   }

//   // Handle post/unpost
//   const handlePostUnpostClick = (voucherId: number, currentStatus: boolean) => {
//     setConfirmModal({ 
//       isOpen: true, 
//       voucherId, 
//       type: currentStatus ? 'unpost' : 'post' 
//     })
//   }

//   const handleConfirmAction = async () => {
//     if (!confirmModal.voucherId || !confirmModal.type) return

//     try {
//       if (confirmModal.type === 'delete') {
//         await deleteVoucher(confirmModal.voucherId).unwrap()
//         setSuccessMessage('Voucher deleted successfully!')
//       } else if (confirmModal.type === 'post' || confirmModal.type === 'unpost') {
//         await postUnpostVoucher(confirmModal.voucherId).unwrap()
//         setSuccessMessage(`Voucher ${confirmModal.type}ed successfully!`)
//       }
//       setConfirmModal({ isOpen: false })

//       // Auto-hide success message
//       setTimeout(() => setSuccessMessage(null), 5000)
//     } catch (err) {
//       console.error(`Failed to ${confirmModal.type} voucher:`, err)
//     }
//   }

//   const statusCounts = getStatusCounts()
//   const isLoading = journalLoading || pettyCashLoading
//   const error = journalError || pettyCashError

//   if (isLoading) {
//     return <Loading size="lg" text="Loading Vouchers..." />
//   }

//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//           <p className="text-red-600">Failed to load vouchers. Please try again.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4 space-y-4">
//       {/* ✅ SUCCESS MESSAGE */}
//       {successMessage && (
//         <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg flex items-center justify-between animate-fade-in">
//           <div className="flex items-center">
//             <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
//             <span className="text-green-800">{successMessage}</span>
//           </div>
//           <button 
//             onClick={() => setSuccessMessage(null)}
//             className="text-green-600 hover:text-green-800"
//           >
//             <XCircle className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* ✅ ENHANCED HEADER */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-4 border-b flex justify-between items-center">
//           <div>
//             <h1 className="text-xl font-bold text-gray-800 flex items-center">
//               <FileText className="w-6 h-6 mr-3 text-blue-600" />
//               {voucherType === 'all' ? 'All Vouchers' : 
//                voucherType === 'journal' ? 'Journal Vouchers' : 
//                'Petty Cash Vouchers'} Management
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Create vouchers and manage post status • {filteredVouchers.length} total
//             </p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             {isLoading ? 'Loading...' : 'Refresh'}
//           </button>
//         </div>

//         {/* ✅ COMPACT CONTROLS ROW */}
//         <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
//           {/* First Row: Search, Filters, Actions */}
//           <div className="flex flex-wrap items-center gap-3 mb-3">
//             {/* Search Bar */}
//             <div className="flex-1 min-w-[300px]">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search vouchers, descriptions, accounts..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <XCircle className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Filter Toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
//             >
//               <Filter className="w-4 h-4 mr-2" />
//               Filters
//               {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
//             </button>

//             {/* Create Buttons */}
//             <div className="flex space-x-2">
//               {(voucherType === 'all' || voucherType === 'journal') && (
//                 <button 
//                   onClick={() => handleCreate('journal')}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
//                 >
//                   <Plus className="w-4 h-4 mr-1" />
//                   Journal
//                 </button>
//               )}
//               {(voucherType === 'all' || voucherType === 'pettycash') && (
//                 <button 
//                   onClick={() => handleCreate('pettycash')}
//                   className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
//                 >
//                   <Plus className="w-4 h-4 mr-1" />
//                   Petty Cash
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* ✅ EXPANDABLE FILTER ROW */}
//           {showFilters && (
//             <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
//               {[
//                 { key: 'all', label: `All (${statusCounts.total})`, color: 'gray', icon: '📋' },
//                 { key: 'draft', label: `Draft (${statusCounts.draft})`, color: 'yellow', icon: '📝' },
//                 { key: 'posted', label: `Posted (${statusCounts.posted})`, color: 'green', icon: '✅' }
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setStatusFilter(tab.key as any)}
//                   className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
//                     statusFilter === tab.key 
//                       ? `bg-${tab.color}-600 text-white shadow-md scale-105` 
//                       : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
//                   }`}
//                 >
//                   <span className="mr-2">{tab.icon}</span>
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ✅ ENHANCED TABLE */}
//         {filteredVouchers.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             {searchTerm || statusFilter !== 'all' ? (
//               <div>
//                 <p className="text-lg mb-2">No results found</p>
//                 <p className="text-sm">Try adjusting your search terms or filters.</p>
//               </div>
//             ) : (
//               'No vouchers found. Create your first voucher above.'
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Voucher Info</th>
//                   <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Type</th>
//                   <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Date</th>
//                   <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Totals</th>
//                   <th className="px-4 py-3 text-left font-semibold text-sm text-gray-800">Status</th>
//                   <th className="px-4 py-3 text-center font-semibold text-sm text-gray-800">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredVouchers.map((voucher: any) => {
//                   const config = getVoucherTypeConfig(voucher.voucherTypeId)
//                   const totals = calculateVoucherTotals(voucher.details || [])
//                   const statusInfo = getVoucherStatusInfo(voucher.status)
//                   const postUnpostInfo = getPostUnpostButtonInfo(voucher.status)
//                   const IconComponent = config.icon

//                   return (
//                     <tr key={voucher.id} className="hover:bg-blue-50 transition-colors duration-200">
//                       {/* Voucher Info */}
//                       <td className="px-4 py-3">
//                         <div className="flex items-center">
//                           <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
//                             <span className="text-purple-600 font-semibold text-xs">
//                               {voucher.id}
//                             </span>
//                           </div>
//                           <div className="ml-3">
//                             <div className="text-sm font-medium text-gray-900">
//                               {voucher.voucherNo}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               ID: {voucher.id}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Type */}
//                       <td className="px-4 py-3">
//                         <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
//                           <IconComponent className="w-3 h-3 mr-1" />
//                           {config.name}
//                         </span>
//                       </td>

//                       {/* Date */}
//                       <td className="px-4 py-3">
//                         <div className="text-sm text-gray-900">
//                           {formatDisplayDate(voucher.date)}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {voucher.createdAt && `Created: ${formatDisplayDate(voucher.createdAt)}`}
//                         </div>
//                       </td>

//                       {/* Totals */}
//                       <td className="px-4 py-3">
//                         <div className="text-sm text-gray-900">
//                           Dr: {formatAmount(totals.debit)}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Cr: {formatAmount(totals.credit)}
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-3">
//                         <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
//                           {voucher.status ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
//                           {statusInfo.text}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-center space-x-1">
//                           {/* Post/Unpost Button */}
//                           <button
//                             onClick={() => handlePostUnpostClick(voucher.id, voucher.status)}
//                             className={`px-2 py-1 text-xs font-medium rounded-lg flex items-center transition-all duration-200 transform hover:scale-105 ${postUnpostInfo.color}`}
//                             disabled={isPostingUnposting}
//                             title={`${postUnpostInfo.action} this voucher`}
//                           >
//                             {voucher.status ? <XCircle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
//                             {postUnpostInfo.text}
//                           </button>

//                           {/* Edit Button */}
//                           <button
//                             onClick={() => handleEdit(voucher)}
//                             className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
//                             title="Edit voucher"
//                           >
//                             <Edit className="w-3 h-3 mr-1" />
//                             Edit
//                           </button>

//                           {/* Delete Button */}
//                           <button
//                             onClick={() => handleDeleteClick(voucher.id)}
//                             className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
//                             title="Delete voucher"
//                           >
//                             <Trash2 className="w-3 h-3 mr-1" />
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         onClose={() => setConfirmModal({ isOpen: false })}
//         onConfirm={handleConfirmAction}
//         title={
//           confirmModal.type === 'delete' ? 'Delete Voucher' :
//           confirmModal.type === 'post' ? 'Post Voucher' :
//           'Unpost Voucher'
//         }
//         message={
//           confirmModal.type === 'delete' 
//             ? 'Are you sure you want to delete this voucher? This action cannot be undone.'
//             : confirmModal.type === 'post'
//             ? 'Are you sure you want to post this voucher? This will make all journal details active.'
//             : 'Are you sure you want to unpost this voucher? This will change it back to draft status.'
//         }
//         confirmText={
//           confirmModal.type === 'delete' ? 'Delete Voucher' :
//           confirmModal.type === 'post' ? 'Post Voucher' :
//           'Unpost Voucher'
//         }
//         cancelText="Cancel"
//         type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
//         loading={isDeleting || isPostingUnposting}
//       />
//     </div>
//   )
// }























































// 'use client'
// import React, { useState, useMemo } from 'react'
// import {
//   useGetJournalVouchersByTypeQuery,
//   useGetPettyCashVouchersByTypeQuery,
//   useDeleteJournalVoucherMutation,
//   usePostUnpostVoucherMutation,
// } from '@/store/slice/journalVoucherSlice'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { Loading } from '@/components/ui/Loading'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { useRouter } from 'next/navigation'
// import { formatDisplayDate, formatAmount } from '@/utils/formatters'
// import { 
//   Search, 
//   Plus, 
//   RefreshCw, 
//   FileText,
//   DollarSign,
//   Edit,
//   Trash2,
//   CheckCircle,
//   Clock,
//   Filter
// } from 'lucide-react'

// interface Props {
//   voucherType?: 'journal' | 'pettycash' | 'all'
// }

// export const JournalVoucherManager: React.FC<Props> = ({ voucherType = 'all' }) => {
//   const router = useRouter()
//   const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number; type?: string }>({ isOpen: false })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'draft'>('all')

//   const { data: journalVouchers = [], isLoading: journalLoading, refetch: refetchJournal } = useGetJournalVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'pettycash'
//   })

//   const { data: pettyCashVouchers = [], isLoading: pettyCashLoading, refetch: refetchPetty } = useGetPettyCashVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'journal'
//   })

//   const [deleteVoucher, { isLoading: isDeleting }] = useDeleteJournalVoucherMutation()
//   const [postUnpostVoucher, { isLoading: isPostingUnposting }] = usePostUnpostVoucherMutation()

//   const allVouchers = useMemo(() => {
//     let combined: any[] = []
//     if (voucherType === 'all' || voucherType === 'journal') {
//       combined = [...combined, ...journalVouchers]
//     }
//     if (voucherType === 'all' || voucherType === 'pettycash') {
//       combined = [...combined, ...pettyCashVouchers]
//     }
//     return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   }, [journalVouchers, pettyCashVouchers, voucherType])

//   const filteredVouchers = useMemo(() => {
//     let filtered = allVouchers

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(voucher => {
//         if (statusFilter === 'posted') return voucher.status === true
//         if (statusFilter === 'draft') return voucher.status === false
//         return true
//       })
//     }

//     if (searchTerm.trim()) {
//       filtered = filtered.filter(voucher => 
//         voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         voucher.id.toString().includes(searchTerm)
//       )
//     }

//     return filtered
//   }, [allVouchers, searchTerm, statusFilter])

//   const getStatusCounts = () => {
//     const total = allVouchers.length
//     const posted = allVouchers.filter(v => v.status === true).length
//     const draft = allVouchers.filter(v => v.status === false).length
//     return { total, posted, draft }
//   }

//   const calculateVoucherTotals = (details: any[]) => {
//     if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }
//     const debit = details.reduce((sum, detail) => sum + (detail.ownDb || 0), 0)
//     const credit = details.reduce((sum, detail) => sum + (detail.ownCr || 0), 0)
//     return { debit, credit }
//   }

//   const handleCreate = (type: 'journal' | 'pettycash') => {
//     router.push(`/vouchers/${type}/create`)
//   }

//   const handleEdit = (voucher: any) => {
//     const path = voucher.voucherTypeId === 10 ? 'journal' : 'petty'
//     router.push(`/vouchers/${path}/edit/${voucher.id}`)
//   }

//   const handleDeleteClick = (voucherId: number) => {
//     setConfirmModal({ isOpen: true, voucherId, type: 'delete' })
//   }

//   const handlePostUnpostClick = (voucherId: number, currentStatus: boolean) => {
//     setConfirmModal({ 
//       isOpen: true, 
//       voucherId, 
//       type: currentStatus ? 'unpost' : 'post' 
//     })
//   }

//   const handleConfirmAction = async () => {
//     if (!confirmModal.voucherId || !confirmModal.type) return

//     try {
//       if (confirmModal.type === 'delete') {
//         await deleteVoucher(confirmModal.voucherId).unwrap()
//       } else if (confirmModal.type === 'post' || confirmModal.type === 'unpost') {
//         await postUnpostVoucher(confirmModal.voucherId).unwrap()
//       }
//       setConfirmModal({ isOpen: false })
//     } catch (err) {
//       console.error(`Failed to ${confirmModal.type} voucher:`, err)
//     }
//   }

//   const statusCounts = getStatusCounts()
//   const isLoading = journalLoading || pettyCashLoading

//   if (isLoading) {
//     return <Loading size="lg" text="Loading Vouchers..." />
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Simple Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">
//             {voucherType === 'all' ? 'All Vouchers' : 
//              voucherType === 'journal' ? 'Journal Vouchers' : 
//              'Petty Cash Vouchers'}
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {filteredVouchers.length} vouchers found
//           </p>
//         </div>

//         <div className="flex space-x-3">
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => Promise.all([refetchJournal(), refetchPetty()])}
//             icon={<RefreshCw className="w-4 h-4" />}
//           >
//             Refresh
//           </Button>
//           {(voucherType === 'all' || voucherType === 'journal') && (
//             <Button 
//               variant="primary"
//               onClick={() => handleCreate('journal')}
//               icon={<Plus className="w-4 h-4" />}
//             >
//               Journal
//             </Button>
//           )}
//           {(voucherType === 'all' || voucherType === 'pettycash') && (
//             <Button 
//               variant="success"
//               onClick={() => handleCreate('pettycash')}
//               icon={<Plus className="w-4 h-4" />}
//             >
//               Petty Cash
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Simple Controls */}
//       <div className="bg-white mb-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex-1 max-w-[300px] ">
//             <Input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search vouchers..."
//               icon={<Search className="w-4 h-4" />}
//             />
//           </div>

//           <div className="flex space-x-2">
//             <Button
//               variant={statusFilter === 'all' ? 'primary' : 'secondary'}
//               size="sm"
//               onClick={() => setStatusFilter('all')}
//             >
//               All ({statusCounts.total})
//             </Button>
//             <Button
//               variant={statusFilter === 'draft' ? 'warning' : 'secondary'}
//               size="sm"
//               onClick={() => setStatusFilter('draft')}
//             >
//               Draft ({statusCounts.draft})
//             </Button>
//             <Button
//               variant={statusFilter === 'posted' ? 'success' : 'secondary'}
//               size="sm"
//               onClick={() => setStatusFilter('posted')}
//             >
//               Posted ({statusCounts.posted})
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Simple Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredVouchers.map((voucher: any) => {
//               const totals = calculateVoucherTotals(voucher.details || [])
//               const isJournal = voucher.voucherTypeId === 10

//               return (
//                 <tr key={voucher.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-[#509ee3] text-white rounded-full flex items-center justify-center text-sm font-semibold">
//                         {voucher.id}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{voucher.voucherNo}</div>
//                         <div className="text-sm text-gray-500">ID: {voucher.id}</div>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                       isJournal 
//                         ? 'bg-blue-100 text-blue-800' 
//                         : 'bg-green-100 text-green-800'
//                     }`}>
//                       {isJournal ? (
//                         <>
//                           <FileText className="w-3 h-3 mr-1" />
//                           Journal
//                         </>
//                       ) : (
//                         <>
//                           <DollarSign className="w-3 h-3 mr-1" />
//                           Petty Cash
//                         </>
//                       )}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {formatDisplayDate(voucher.date)}
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900">
//                       Dr: {formatAmount(totals.debit)} | Cr: {formatAmount(totals.credit)}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
//                       voucher.status 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {voucher.status ? (
//                         <>
//                           <CheckCircle className="w-3 h-3 mr-1" />
//                           Posted
//                         </>
//                       ) : (
//                         <>
//                           <Clock className="w-3 h-3 mr-1" />
//                           Draft
//                         </>
//                       )}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end space-x-2">
//                       <Button
//                         variant={voucher.status ? "warning" : "success"}
//                         size="sm"
//                         onClick={() => handlePostUnpostClick(voucher.id, voucher.status)}
//                         loading={isPostingUnposting}
//                       >
//                         {voucher.status ? 'Unpost' : 'Post'}
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         size="sm"
//                         onClick={() => handleEdit(voucher)}
//                         icon={<Edit className="w-3 h-3" />}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleDeleteClick(voucher.id)}
//                         icon={<Trash2 className="w-3 h-3" />}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Simple Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         onClose={() => setConfirmModal({ isOpen: false })}
//         onConfirm={handleConfirmAction}
//         title={
//           confirmModal.type === 'delete' ? 'Delete Voucher' :
//           confirmModal.type === 'post' ? 'Post Voucher' :
//           'Unpost Voucher'
//         }
//         message={
//           confirmModal.type === 'delete' 
//             ? 'Are you sure you want to delete this voucher?'
//             : confirmModal.type === 'post'
//             ? 'Post this voucher? All details will become active.'
//             : 'Unpost this voucher? It will become draft again.'
//         }
//         confirmText={confirmModal.type === 'delete' ? 'Delete' : confirmModal.type === 'post' ? 'Post' : 'Unpost'}
//         cancelText="Cancel"
//         type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
//         loading={isDeleting || isPostingUnposting}
//       />
//     </div>
//   )
// }




















































































// 'use client'
// import React, { useState, useMemo } from 'react'
// import {
//   useGetJournalVouchersByTypeQuery,
//   useGetPettyCashVouchersByTypeQuery,
//   useDeleteJournalVoucherMutation,
//   usePostUnpostVoucherMutation,
// } from '@/store/slice/journalVoucherSlice'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { Loading } from '@/components/ui/Loading'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { useRouter } from 'next/navigation'
// import { formatDisplayDate, formatAmount } from '@/utils/formatters'
// import { 
//   Search, 
//   Plus, 
//   RefreshCw, 
//   FileText,
//   DollarSign,
//   Edit,
//   Trash2,
//   CheckCircle,
//   Clock,
//   Eye,
//   X,
//   Receipt,
//   Star
// } from 'lucide-react'

// interface Props {
//   voucherType?: 'journal' | 'pettycash' | 'all'
// }

// export const JournalVoucherManager: React.FC<Props> = ({ voucherType = 'all' }) => {
//   const router = useRouter()
//   const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number; type?: string }>({ isOpen: false })
//   const [viewModal, setViewModal] = useState<{ isOpen: boolean; voucher?: any }>({ isOpen: false })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'draft'>('all')

//   const { data: journalVouchers = [], isLoading: journalLoading, refetch: refetchJournal } = useGetJournalVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'pettycash'
//   })

//   const { data: pettyCashVouchers = [], isLoading: pettyCashLoading, refetch: refetchPetty } = useGetPettyCashVouchersByTypeQuery(undefined, {
//     skip: voucherType === 'journal'
//   })

//   const [deleteVoucher, { isLoading: isDeleting }] = useDeleteJournalVoucherMutation()
//   const [postUnpostVoucher, { isLoading: isPostingUnposting }] = usePostUnpostVoucherMutation()

//   const allVouchers = useMemo(() => {
//     let combined: any[] = []
//     if (voucherType === 'all' || voucherType === 'journal') {
//       combined = [...combined, ...journalVouchers]
//     }
//     if (voucherType === 'all' || voucherType === 'pettycash') {
//       combined = [...combined, ...pettyCashVouchers]
//     }
//     return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//   }, [journalVouchers, pettyCashVouchers, voucherType])

//   const filteredVouchers = useMemo(() => {
//     let filtered = allVouchers

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(voucher => {
//         if (statusFilter === 'posted') return voucher.status === true
//         if (statusFilter === 'draft') return voucher.status === false
//         return true
//       })
//     }

//     if (searchTerm.trim()) {
//       filtered = filtered.filter(voucher => 
//         voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         voucher.id.toString().includes(searchTerm)
//       )
//     }

//     return filtered
//   }, [allVouchers, searchTerm, statusFilter])

//   const getStatusCounts = () => {
//     const total = allVouchers.length
//     const posted = allVouchers.filter(v => v.status === true).length
//     const draft = allVouchers.filter(v => v.status === false).length
//     return { total, posted, draft }
//   }

//   const calculateVoucherTotals = (details: any[]) => {
//     if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }
//     const debit = details.reduce((sum, detail) => sum + (detail.ownDb || 0), 0)
//     const credit = details.reduce((sum, detail) => sum + (detail.ownCr || 0), 0)
//     return { debit, credit }
//   }

//   const handleCreate = (type: 'journal' | 'pettycash') => {
//     router.push(`/vouchers/${type}/create`)
//   }

//   const handleEdit = (voucher: any) => {
//     const path = voucher.voucherTypeId === 10 ? 'journal' : 'petty'
//     router.push(`/vouchers/${path}/edit/${voucher.id}`)
//   }

//   const handleView = (voucher: any) => {
//     setViewModal({ isOpen: true, voucher })
//   }

//   const handleDeleteClick = (voucherId: number) => {
//     setConfirmModal({ isOpen: true, voucherId, type: 'delete' })
//   }

//   const handlePostUnpostClick = (voucherId: number, currentStatus: boolean) => {
//     setConfirmModal({ 
//       isOpen: true, 
//       voucherId, 
//       type: currentStatus ? 'unpost' : 'post' 
//     })
//   }

//   const handleConfirmAction = async () => {
//     if (!confirmModal.voucherId || !confirmModal.type) return

//     try {
//       if (confirmModal.type === 'delete') {
//         await deleteVoucher(confirmModal.voucherId).unwrap()
//       } else if (confirmModal.type === 'post' || confirmModal.type === 'unpost') {
//         await postUnpostVoucher(confirmModal.voucherId).unwrap()
//       }
//       setConfirmModal({ isOpen: false })
//     } catch (err) {
//       console.error(`Failed to ${confirmModal.type} voucher:`, err)
//       setConfirmModal({ isOpen: false })
//     }
//   }

//   const statusCounts = getStatusCounts()
//   const isLoading = journalLoading || pettyCashLoading

//   if (isLoading) {
//     return <Loading size="lg" text="Loading Vouchers..." />
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Enhanced Header */}
//       <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center">
//               <Receipt className="w-8 h-8 mr-3" />
//               {voucherType === 'all' ? 'All Vouchers' : 
//                voucherType === 'journal' ? 'Journal Vouchers' : 
//                'Petty Cash Vouchers'} Management
//             </h1>
//             <p className="text-blue-100 mt-2">
//               Manage voucher entries and posting status • {filteredVouchers.length} total vouchers
//             </p>
//           </div>

//           <div className="flex space-x-3">
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={() => Promise.all([refetchJournal(), refetchPetty()])}
//               icon={<RefreshCw className="w-4 h-4" />}
//               className="bg-white text-[#509ee3] hover:bg-gray-100"
//             >
//               Refresh
//             </Button>
//             {(voucherType === 'all' || voucherType === 'journal') && (
//               <Button 
//                 variant="secondary"
//                 onClick={() => handleCreate('journal')}
//                 icon={<Plus className="w-4 h-4" />}
//                 className="bg-white text-[#509ee3] hover:bg-gray-100"
//               >
//                 Journal
//               </Button>
//             )}
//             {(voucherType === 'all' || voucherType === 'pettycash') && (
//               <Button 
//                 variant="success"
//                 onClick={() => handleCreate('pettycash')}
//                 icon={<Plus className="w-4 h-4" />}
//                 className="bg-white text-green-600 hover:bg-gray-100"
//               >
//                 Petty Cash
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex-1 min-w-[300px]">
//             <Input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search vouchers by number or ID..."
//               icon={<Search className="w-4 h-4" />}
//             />
//           </div>

//           <div className="flex space-x-2">
//             <Button
//               variant={statusFilter === 'all' ? 'primary' : 'secondary'}
//               size="sm"
//               onClick={() => setStatusFilter('all')}
//             >
//               All ({statusCounts.total})
//             </Button>
//             <Button
//               variant={statusFilter === 'draft' ? 'warning' : 'secondary'}
//               size="sm"
//               onClick={() => setStatusFilter('draft')}
//             >
//               Draft ({statusCounts.draft})
//             </Button>
//             <Button
//               variant={statusFilter === 'posted' ? 'success' : 'secondary'}
//               size="sm"
//               onClick={() => setStatusFilter('posted')}
//             >
//               Posted ({statusCounts.posted})
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">#</th>
//               <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Voucher Info</th>
//               <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Type</th>
//               <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Date</th>
//               <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Amount</th>
//               <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Status</th>
//               <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredVouchers.map((voucher: any, index: number) => {
//               const totals = calculateVoucherTotals(voucher.details || [])
//               const isJournal = voucher.voucherTypeId === 10
//               const serialNumber = index + 1 // ✅ SERIAL NUMBER starting from 1

//               return (
//                 <tr key={voucher.id} className="hover:bg-blue-50 transition-colors duration-200">
//                   {/* ✅ SERIAL NUMBER instead of ID */}
//                   <td className="px-6 py-4">
//                     <div className="w-8 h-8 bg-gradient-to-r from-[#509ee3] to-[#4990d6] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
//                       {serialNumber}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="ml-4">
//                         <div className="text-sm font-semibold text-gray-900">{voucher.voucherNo}</div>
//                         <div className="text-xs text-gray-500">ID: {voucher.id}</div>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${
//                       isJournal 
//                         ? 'bg-blue-100 text-blue-800 border-blue-300' 
//                         : 'bg-green-100 text-green-800 border-green-300'
//                     }`}>
//                       {isJournal ? (
//                         <>
//                           <FileText className="w-3 h-3 mr-1" />
//                           Journal
//                         </>
//                       ) : (
//                         <>
//                           <DollarSign className="w-3 h-3 mr-1" />
//                           Petty Cash
//                         </>
//                       )}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">
//                       {formatDisplayDate(voucher.date)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Created: {formatDisplayDate(voucher.createdAt)}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex space-x-4">
//                       <div className="text-sm">
//                         <span className="text-green-600 font-medium">Dr:</span> {formatAmount(totals.debit)}
//                       </div>
//                       <div className="text-sm">
//                         <span className="text-blue-600 font-medium">Cr:</span> {formatAmount(totals.credit)}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${
//                       voucher.status 
//                         ? 'bg-green-100 text-green-800 border-green-300' 
//                         : 'bg-red-100 text-red-800 border-red-300'
//                     }`}>
//                       {voucher.status ? (
//                         <>
//                           <CheckCircle className="w-3 h-3 mr-1" />
//                           POSTED
//                         </>
//                       ) : (
//                         <>
//                           <Clock className="w-3 h-3 mr-1" />
//                           DRAFT
//                         </>
//                       )}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex items-center justify-center space-x-2">
//                       {/* View Button */}
//                       <Button
//                         variant="secondary"
//                         size="sm"
//                         onClick={() => handleView(voucher)}
//                         icon={<Eye className="w-3 h-3" />}
//                         className="hover:scale-105 transition-transform duration-200"
//                       >
//                         View
//                       </Button>

//                       <Button
//                         variant={voucher.status ? "warning" : "success"}
//                         size="sm"
//                         onClick={() => handlePostUnpostClick(voucher.id, voucher.status)}
//                         loading={isPostingUnposting}
//                         className="hover:scale-105 transition-transform duration-200"
//                       >
//                         {voucher.status ? 'Unpost' : 'Post'}
//                       </Button>

//                       <Button
//                         variant="primary"
//                         size="sm"
//                         onClick={() => handleEdit(voucher)}
//                         icon={<Edit className="w-3 h-3" />}
//                         className="hover:scale-105 transition-transform duration-200"
//                       >
//                         Edit
//                       </Button>

//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleDeleteClick(voucher.id)}
//                         icon={<Trash2 className="w-3 h-3" />}
//                         className="hover:scale-105 transition-transform duration-200"
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ FIXED: View Modal - No Black Screen */}
//       {viewModal.isOpen && viewModal.voucher && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* Modal Backdrop */}
//           <div 
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={() => setViewModal({ isOpen: false })}
//           ></div>

//           {/* Modal Content */}
//           <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] px-6 py-4 flex justify-between items-center text-white">
//               <div className="flex items-center">
//                 <Receipt className="w-8 h-8 mr-3" />
//                 <div>
//                   <h3 className="text-xl font-bold">Voucher Details</h3>
//                   <p className="text-blue-100">{viewModal.voucher.voucherNo} • ID: {viewModal.voucher.id}</p>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setViewModal({ isOpen: false })}
//                 className="text-white hover:bg-white hover:bg-opacity-20"
//                 icon={<X className="w-5 h-5" />}
//               />
//             </div>

//             {/* Modal Body */}
//             <div className="p-6">
//               {/* Voucher Summary */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
//                   <div className="text-sm text-blue-600 font-medium">Date</div>
//                   <div className="text-lg font-bold text-blue-800">{formatDisplayDate(viewModal.voucher.date)}</div>
//                 </div>
//                 <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
//                   <div className="text-sm text-purple-600 font-medium">Type</div>
//                   <div className="text-lg font-bold text-purple-800">{viewModal.voucher.voucherType?.vType || 'Unknown'}</div>
//                 </div>
//                 <div className={`border-l-4 p-4 rounded-r-lg ${
//                   viewModal.voucher.status 
//                     ? 'bg-green-50 border-green-400' 
//                     : 'bg-red-50 border-red-400'
//                 }`}>
//                   <div className={`text-sm font-medium ${
//                     viewModal.voucher.status ? 'text-green-600' : 'text-red-600'
//                   }`}>Status</div>
//                   <div className={`text-lg font-bold ${
//                     viewModal.voucher.status ? 'text-green-800' : 'text-red-800'
//                   }`}>
//                     {viewModal.voucher.status ? 'POSTED' : 'DRAFT'}
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
//                   <div className="text-sm text-gray-600 font-medium">Entries</div>
//                   <div className="text-lg font-bold text-gray-800">{viewModal.voucher.details?.length || 0}</div>
//                 </div>
//               </div>

//               {/* Details Table */}
//               <div className="border border-gray-200 rounded-lg overflow-hidden">
//                 <table className="min-w-full">
//                   <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Entry</th>
//                       <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Account</th>
//                       <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Description</th>
//                       <th className="px-4 py-3 text-right text-sm font-bold text-gray-800">Debit</th>
//                       <th className="px-4 py-3 text-right text-sm font-bold text-gray-800">Credit</th>
//                       <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {viewModal.voucher.details?.map((detail: any, index: number) => {
//                       const isAutoBalance = detail.description === "Auto Balancing Entry"

//                       return (
//                         <tr 
//                           key={index} 
//                           className={`transition-colors duration-200 ${
//                             isAutoBalance 
//                               ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-l-4 border-yellow-400' 
//                               : 'hover:bg-gray-50'
//                           }`}
//                         >
//                           <td className="px-4 py-4">
//                             <div className="flex items-center">
//                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
//                                 isAutoBalance 
//                                   ? 'bg-yellow-400 text-yellow-900' 
//                                   : 'bg-[#509ee3] text-white'
//                               }`}>
//                                 {isAutoBalance ? '⚡' : detail.lineId}
//                               </div>
//                               {isAutoBalance && (
//                                 <div className="ml-2 flex items-center">
//                                   <Star className="w-4 h-4 text-yellow-500" />
//                                   <span className="text-xs text-yellow-700 font-medium ml-1">AUTO</span>
//                                 </div>
//                               )}
//                             </div>
//                           </td>

//                           <td className="px-4 py-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {detail.coa?.acName || 'N/A'}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               ID: {detail.coaId}
//                             </div>
//                           </td>

//                           <td className="px-4 py-4">
//                             <div className={`text-sm ${
//                               isAutoBalance 
//                                 ? 'font-bold text-yellow-800' 
//                                 : 'text-gray-900'
//                             }`}>
//                               {detail.description || '-'}
//                             </div>
//                             {isAutoBalance && (
//                               <div className="text-xs text-yellow-600 font-medium">
//                                 System Generated Entry
//                               </div>
//                             )}
//                           </td>

//                           <td className="px-4 py-4 text-right">
//                             <div className={`text-sm font-bold ${
//                               detail.ownDb > 0 
//                                 ? (isAutoBalance ? 'text-yellow-700' : 'text-green-600') 
//                                 : 'text-gray-400'
//                             }`}>
//                               {formatAmount(detail.ownDb)}
//                             </div>
//                           </td>

//                           <td className="px-4 py-4 text-right">
//                             <div className={`text-sm font-bold ${
//                               detail.ownCr > 0 
//                                 ? (isAutoBalance ? 'text-yellow-700' : 'text-blue-600') 
//                                 : 'text-gray-400'
//                             }`}>
//                               {formatAmount(detail.ownCr)}
//                             </div>
//                           </td>

//                           <td className="px-4 py-4 text-center">
//                             <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${
//                               detail.status 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-red-100 text-red-800'
//                             }`}>
//                               {detail.status ? 'Active' : 'Inactive'}
//                             </span>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>

//                   {/* Totals in Modal */}
//                   <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200">
//                     <tr>
//                       <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">
//                         TOTALS:
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <div className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
//                           {formatAmount(calculateVoucherTotals(viewModal.voucher.details).debit)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <div className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
//                           {formatAmount(calculateVoucherTotals(viewModal.voucher.details).credit)}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
//                           BALANCED ✓
//                         </span>
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
//               <Button
//                 variant="secondary"
//                 onClick={() => setViewModal({ isOpen: false })}
//                 icon={<X className="w-4 h-4" />}
//               >
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         onClose={() => setConfirmModal({ isOpen: false })}
//         onConfirm={handleConfirmAction}
//         title={
//           confirmModal.type === 'delete' ? 'Delete Voucher' :
//           confirmModal.type === 'post' ? 'Post Voucher' :
//           'Unpost Voucher'
//         }
//         message={
//           confirmModal.type === 'delete' 
//             ? 'Are you sure you want to delete this voucher? This action cannot be undone.'
//             : confirmModal.type === 'post'
//             ? 'Post this voucher? All details will become active.'
//             : 'Unpost this voucher? It will become draft again.'
//         }
//         confirmText={confirmModal.type === 'delete' ? 'Delete' : confirmModal.type === 'post' ? 'Post' : 'Unpost'}
//         cancelText="Cancel"
//         type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
//         loading={isDeleting || isPostingUnposting}
//       />
//     </div>
//   )
// }























































'use client'
import React, { useState, useMemo } from 'react'
import {
  useGetJournalVouchersByTypeQuery,
  useGetPettyCashVouchersByTypeQuery,
  useDeleteJournalVoucherMutation,
  usePostUnpostVoucherMutation,
} from '@/store/slice/journalVoucherSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { useRouter } from 'next/navigation'
import { formatDisplayDate, formatAmount } from '@/utils/formatters'
import {
  Search,
  Plus,
  RefreshCw,
  FileText,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Receipt,
  Star,
  User,
  Building,
  Calendar
} from 'lucide-react'

interface Props {
  voucherType?: 'journal' | 'pettycash' | 'all'
}

export const JournalVoucherManager: React.FC<Props> = ({ voucherType = 'all' }) => {
  const router = useRouter()
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; voucherId?: number; type?: string }>({ isOpen: false })
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set()) // ✅ Track expanded rows
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'draft'>('all')

  const { data: journalVouchers = [], isLoading: journalLoading, refetch: refetchJournal } = useGetJournalVouchersByTypeQuery(undefined, {
    skip: voucherType === 'pettycash'
  })

  const { data: pettyCashVouchers = [], isLoading: pettyCashLoading, refetch: refetchPetty } = useGetPettyCashVouchersByTypeQuery(undefined, {
    skip: voucherType === 'journal'
  })

  const [deleteVoucher, { isLoading: isDeleting }] = useDeleteJournalVoucherMutation()
  const [postUnpostVoucher, { isLoading: isPostingUnposting }] = usePostUnpostVoucherMutation()

  const allVouchers = useMemo(() => {
    let combined: any[] = []
    if (voucherType === 'all' || voucherType === 'journal') {
      combined = [...combined, ...journalVouchers]
    }
    if (voucherType === 'all' || voucherType === 'pettycash') {
      combined = [...combined, ...pettyCashVouchers]
    }
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [journalVouchers, pettyCashVouchers, voucherType])

  const filteredVouchers = useMemo(() => {
    let filtered = allVouchers

    if (statusFilter !== 'all') {
      filtered = filtered.filter(voucher => {
        if (statusFilter === 'posted') return voucher.status === true
        if (statusFilter === 'draft') return voucher.status === false
        return true
      })
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(voucher =>
        voucher.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.id.toString().includes(searchTerm)
      )
    }

    return filtered
  }, [allVouchers, searchTerm, statusFilter])

  // ✅ Toggle row expansion
  const toggleRowExpansion = (voucherId: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(voucherId)) {
      newExpanded.delete(voucherId)
    } else {
      newExpanded.add(voucherId)
    }
    setExpandedRows(newExpanded)
  }

  const getStatusCounts = () => {
    const total = allVouchers.length
    const posted = allVouchers.filter(v => v.status === true).length
    const draft = allVouchers.filter(v => v.status === false).length
    return { total, posted, draft }
  }

  const calculateVoucherTotals = (details: any[]) => {
    if (!details || !Array.isArray(details)) return { debit: 0, credit: 0 }
    const debit = details.reduce((sum, detail) => sum + (detail.amountDb || 0), 0)
    const credit = details.reduce((sum, detail) => sum + (detail.amountCr || 0), 0)
    return { debit, credit }
  }

  const handleCreate = (type: 'journal' | 'petty') => {
    router.push(`/vouchers/${type}/create`)
  }

  const handleEdit = (voucher: any) => {
    const path = voucher.voucherTypeId === 10 ? 'journal' : 'petty'
    router.push(`/vouchers/${path}/edit/${voucher.id}`)
  }

  const handleDeleteClick = (voucherId: number) => {
    setConfirmModal({ isOpen: true, voucherId, type: 'delete' })
  }

  const handlePostUnpostClick = (voucherId: number, currentStatus: boolean) => {
    setConfirmModal({
      isOpen: true,
      voucherId,
      type: currentStatus ? 'unpost' : 'post'
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmModal.voucherId || !confirmModal.type) return

    try {
      if (confirmModal.type === 'delete') {
        await deleteVoucher(confirmModal.voucherId).unwrap()
      } else if (confirmModal.type === 'post' || confirmModal.type === 'unpost') {
        await postUnpostVoucher(confirmModal.voucherId).unwrap()
      }
      setConfirmModal({ isOpen: false })
    } catch (err) {
      console.error(`Failed to ${confirmModal.type} voucher:`, err)
      setConfirmModal({ isOpen: false })
    }
  }

  const statusCounts = getStatusCounts()
  const isLoading = journalLoading || pettyCashLoading

  if (isLoading) {
    return <Loading size="lg" text="Loading Vouchers..." />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Receipt className="w-8 h-8 mr-3" />
              {voucherType === 'all' ? 'All Vouchers' :
                voucherType === 'journal' ? 'Journal Vouchers' :
                  'Petty Cash Vouchers'} Management
            </h1>
            <p className="text-blue-100 mt-2">
              Manage voucher entries and posting status • {filteredVouchers.length} total vouchers
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => Promise.all([refetchJournal(), refetchPetty()])}
              icon={<RefreshCw className="w-4 h-4" />}
              className="bg-white text-[#509ee3] hover:bg-gray-100"
            >
              Refresh
            </Button>
            {(voucherType === 'all' || voucherType === 'journal') && (
              <Button
                variant="secondary"
                onClick={() => handleCreate('journal')}
                icon={<Plus className="w-4 h-4" />}
                className="bg-white text-[#509ee3] hover:bg-gray-100"
              >
                Journal
              </Button>
            )}
            {(voucherType === 'all' || voucherType === 'pettycash') && (
              <Button
                variant="secondary"
                onClick={() => handleCreate('petty')}
                icon={<Plus className="w-4 h-4" />}
                className="bg-white text-[#509ee3] hover:bg-gray-100"
              >
                Petty Cash
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 max-w-[300px] ">
            <Input
              className='w-96 '
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vouchers by number or ID..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex space-x-2 mr-10">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All ({statusCounts.total})
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'warning' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
            >
              Draft ({statusCounts.draft})
            </Button>
            <Button
              variant={statusFilter === 'posted' ? 'success' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter('posted')}
            >
              Posted ({statusCounts.posted})
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ ENHANCED TABLE with Expandable Rows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Serial</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Voucher Info</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Type</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Date</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Amount</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Status</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredVouchers.map((voucher: any, index: number) => {
              const totals = calculateVoucherTotals(voucher.details || [])
              const isJournal = voucher.voucherTypeId === 10
              const serialNumber = index + 1 // ✅ Serial number starting from 1
              const isExpanded = expandedRows.has(voucher.id)

              return (
                <React.Fragment key={voucher.id}>
                  {/* ✅ MAIN ROW */}
                  <tr className={`border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ${isExpanded ? 'bg-blue-50' : ''
                    }`}>
                    {/* Serial Number */}
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#509ee3] to-[#4990d6] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                        {serialNumber}
                      </div>
                    </td>

                    {/* Voucher Info */}
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{voucher.voucherNo}</div>
                        <div className="text-xs text-gray-500">ID: {voucher.id}</div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${isJournal
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-green-100 text-green-800 border-green-300'
                        }`}>
                        {isJournal ? (
                          <>
                            <FileText className="w-3 h-3 mr-1" />
                            Journal
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-3 h-3 mr-1" />
                            Petty Cash
                          </>
                        )}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDisplayDate(voucher.date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {formatDisplayDate(voucher.createdAt)}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4">
                      <div className="flex space-x-4">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">Dr:</span> {formatAmount(totals.debit)}
                        </div>
                        <div className="text-sm">
                          <span className="text-blue-600 font-medium">Cr:</span> {formatAmount(totals.credit)}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${voucher.status
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                        {voucher.status ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            POSTED
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            DRAFT
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* ✅ VIEW BUTTON - Toggles expansion */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleRowExpansion(voucher.id)}
                          icon={isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          {isExpanded ? 'Hide' : 'View'}
                        </Button>

                        <Button
                          variant={voucher.status ? "warning" : "success"}
                          size="sm"
                          onClick={() => handlePostUnpostClick(voucher.id, voucher.status)}
                          loading={isPostingUnposting}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          {voucher.status ? 'Unpost' : 'Post'}
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEdit(voucher)}
                          icon={<Edit className="w-3 h-3" />}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(voucher.id)}
                          icon={<Trash2 className="w-3 h-3" />}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* ✅ EXPANDABLE DETAILS ROW */}
                  {isExpanded && (
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                      <td colSpan={7} className="px-4 py-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                          <div className="flex items-center mb-4">
                            <Receipt className="w-6 h-6 mr-2 text-[#509ee3]" />
                            <h4 className="text-lg font-bold text-gray-900">
                              Voucher Details - {voucher.voucherNo}
                            </h4>
                            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {voucher.details?.length || 0} entries
                            </div>
                          </div>

                          {/* ✅ FIXED: DETAILS TABLE - Use amountDb/amountCr instead of ownDb/ownCr */}
                          <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Account</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Debit</th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Credit</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">ID Card</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Bank</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Bank Date</th>
                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {voucher.details?.map((detail: any, detailIndex: number) => {
                                  const isAutoBalance = detail.description === "Auto Balancing Entry"

                                  return (
                                    <tr
                                      key={detailIndex}
                                      className={`transition-colors duration-200 ${isAutoBalance
                                          ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400'
                                          : 'hover:bg-gray-50'
                                        }`}
                                    >
                                      <td className="px-3 py-3">
                                        <div className="flex items-center">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isAutoBalance
                                              ? 'bg-yellow-400 text-yellow-900'
                                              : 'bg-[#509ee3] text-white'
                                            }`}>
                                            {isAutoBalance ? '⚡' : detail.lineId}
                                          </div>
                                          {isAutoBalance && (
                                            <Star className="w-3 h-3 text-yellow-500 ml-1" />
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3">
                                        <div className="text-sm font-medium text-gray-900">
                                          {detail.coa?.acName || 'N/A'}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3">
                                        <div className={`text-sm ${isAutoBalance ? 'font-bold text-yellow-800' : 'text-gray-900'
                                          }`}>
                                          {detail.description || '-'}
                                        </div>
                                      </td>

                                      {/* ✅ FIXED: Use amountDb instead of ownDb for DEBIT column */}
                                      <td className="px-3 py-3 text-right">
                                        <div className={`text-sm font-bold ${detail.amountDb > 0
                                            ? (isAutoBalance ? 'text-yellow-700' : 'text-green-600')
                                            : 'text-gray-400'
                                          }`}>
                                          {formatAmount(detail.amountDb)}
                                        </div>
                                      </td>

                                      {/* ✅ FIXED: Use amountCr instead of ownCr for CREDIT column */}
                                      <td className="px-3 py-3 text-right">
                                        <div className={`text-sm font-bold ${detail.amountCr > 0
                                            ? (isAutoBalance ? 'text-yellow-700' : 'text-blue-600')
                                            : 'text-gray-400'
                                          }`}>
                                          {formatAmount(detail.amountCr)}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3">
                                        <div className="text-sm text-gray-700 flex items-center">
                                          {detail.idCard ? (
                                            <>
                                              <User className="w-3 h-3 mr-1" />
                                              {detail.idCard}
                                            </>
                                          ) : (
                                            <span className="text-gray-400">-</span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3">
                                        <div className="text-sm text-gray-700 flex items-center">
                                          {detail.bank ? (
                                            <>
                                              <Building className="w-3 h-3 mr-1" />
                                              {detail.bank}
                                            </>
                                          ) : (
                                            <span className="text-gray-400">-</span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3">
                                        <div className="text-sm text-gray-700 flex items-center">
                                          {detail.bankDate ? (
                                            <>
                                              <Calendar className="w-3 h-3 mr-1" />
                                              {formatDisplayDate(detail.bankDate)}
                                            </>
                                          ) : (
                                            <span className="text-gray-400">-</span>
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-3 py-3 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${detail.status
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                          }`}>
                                          {detail.status ? 'Active' : 'Inactive'}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                })}

                                {/* ✅ FIXED: Totals Row - Make sure totals also use amountDb/amountCr */}
                                <tr className="bg-gray-100 font-bold">
                                  <td colSpan={3} className="px-3 py-2 text-right text-gray-900">TOTALS:</td>
                                  <td className="px-3 py-2 text-right text-green-700">{formatAmount(totals.debit)}</td>
                                  <td className="px-3 py-2 text-right text-blue-700">{formatAmount(totals.credit)}</td>
                                  <td colSpan={4} className="px-3 py-2 text-center">
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                                      BALANCED ✓
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}


                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'delete' ? 'Delete Voucher' :
            confirmModal.type === 'post' ? 'Post Voucher' :
              'Unpost Voucher'
        }
        message={
          confirmModal.type === 'delete'
            ? 'Are you sure you want to delete this voucher? This action cannot be undone.'
            : confirmModal.type === 'post'
              ? 'Post this voucher? All details will become active.'
              : 'Unpost this voucher? It will become draft again.'
        }
        confirmText={confirmModal.type === 'delete' ? 'Delete' : confirmModal.type === 'post' ? 'Post' : 'Unpost'}
        cancelText="Cancel"
        type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
        loading={isDeleting || isPostingUnposting}
      />
    </div>
  )
}
