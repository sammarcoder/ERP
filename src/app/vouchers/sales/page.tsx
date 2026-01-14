// import { DispatchListWithVoucher } from '@/components/vouchers'

// export default function SalesVouchersPage() {
//   return <DispatchListWithVoucher />
// }




















































































// // app/gdn/sales-voucher/page.tsx
// 'use client';

// import React, { useState, useMemo } from 'react';
// import {
//   Receipt, Filter, RefreshCw, CheckCircle, XCircle,
//   Plus, RotateCcw, Send, Undo2, Trash2, Calendar, User, Package, Printer
// } from 'lucide-react';

// import { useGetAllGDNsQuery } from '@/store/slice/gdnApi';
// import {
//   useGetSalesVouchersQuery,
//   useUpdateStockMainMutation,
//   useToggleSalesVoucherStatusMutation,
//   useDeleteVoucherMutation
// } from '@/store/slice/salesVoucherApi';

// import SalesVoucher from '@/components/vouchers/sales/SalesVoucher';
// import SalesVoucherPrintModal from '@/components/vouchers/sales/SalesVoucherPrintModal';
// import { ConfirmationModal } from '@/components/common/ConfirmationModal';

// type FilterType = 'not_generated' | 'generated' | 'print';
// type VoucherMode = 'create' | 'edit';

// export default function GDNSalesVoucherPage() {
//   const [filter, setFilter] = useState<FilterType>('not_generated');
//   const [selectedGDN, setSelectedGDN] = useState<any>(null);
//   const [voucherMode, setVoucherMode] = useState<VoucherMode>('create');
//   const [showVoucherModal, setShowVoucherModal] = useState(false);
//   const [showPrintModal, setShowPrintModal] = useState(false);
//   const [printGDN, setPrintGDN] = useState<any>(null);
//   const [printVoucherNo, setPrintVoucherNo] = useState<string>('');
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<any>(null);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const { data: gdnData, isLoading: loadingGDN, refetch: refetchGDN } = useGetAllGDNsQuery(undefined);
//   const { data: voucherData, isLoading: loadingVouchers, refetch: refetchVouchers } = useGetSalesVouchersQuery();

//   const [updateStockMain, { isLoading: updating }] = useUpdateStockMainMutation();
//   const [toggleJournalStatus, { isLoading: toggling }] = useToggleSalesVoucherStatusMutation();
//   const [deleteVoucher, { isLoading: deleting }] = useDeleteVoucherMutation();

//   const notGeneratedGDNs = useMemo(() => {
//     if (!gdnData?.data) return [];
//     return gdnData.data.filter((gdn: any) => {
//       if (gdn.Stock_Type_ID !== 12) return false;
//       if (!gdn.approved) return true;
//       if (gdn.approved && !gdn.is_Voucher_Generated) return true;
//       if (gdn.approved && gdn.is_Voucher_Generated && gdn.Status === 'UnPost') return true;
//       return false;
//     });
//   }, [gdnData]);

//   const generatedVouchers = useMemo(() => {
//     return voucherData?.data || [];
//   }, [voucherData]);

//   const printableGDNs = useMemo(() => {
//     if (!gdnData?.data) return [];
//     return gdnData.data.filter((gdn: any) => {
//       if (gdn.Stock_Type_ID !== 12) return false;
//       return gdn.approved === true && gdn.Status === 'Post' && gdn.is_Voucher_Generated === true;
//     });
//   }, [gdnData]);

//   const handleRefresh = () => {
//     refetchGDN();
//     refetchVouchers();
//   };

//   const handleApprove = (gdnId: number, action: 'approve' | 'reject') => {
//     setConfirmAction({ type: action, gdnId });
//     setShowConfirmModal(true);
//   };

//   const handleGenerate = (gdn: any) => {
//     setSelectedGDN(gdn);
//     setVoucherMode(gdn.is_Voucher_Generated && gdn.Status === 'UnPost' ? 'edit' : 'create');
//     setShowVoucherModal(true);
//   };

//   const handleTogglePost = (journalId: number, isPosted: boolean) => {
//     setConfirmAction({ type: isPosted ? 'unpost' : 'post', journalId });
//     setShowConfirmModal(true);
//   };

//   const handleDelete = (stockMainId: number) => {
//     setConfirmAction({ type: 'delete', stockMainId });
//     setShowConfirmModal(true);
//   };

//   const handlePrint = (gdn: any) => {
//     const voucher = generatedVouchers.find((v: any) => v.stk_Main_ID === gdn.ID);
//     setPrintVoucherNo(voucher?.voucherNo || '');
//     setPrintGDN(gdn);
//     setShowPrintModal(true);
//   };

//   const handleConfirm = async () => {
//     if (!confirmAction) return;
//     try {
//       switch (confirmAction.type) {
//         case 'approve':
//           await updateStockMain({ id: confirmAction.gdnId, data: { approved: true } }).unwrap();
//           setMessage({ type: 'success', text: 'GDN approved!' });
//           break;
//         case 'reject':
//           await updateStockMain({ id: confirmAction.gdnId, data: { approved: false } }).unwrap();
//           setMessage({ type: 'success', text: 'GDN rejected.' });
//           break;
//         case 'post':
//         case 'unpost':
//           await toggleJournalStatus(confirmAction.journalId).unwrap();
//           setMessage({ type: 'success', text: `Voucher ${confirmAction.type}ed!` });
//           break;
//         case 'delete':
//           await deleteVoucher(confirmAction.stockMainId).unwrap();
//           setMessage({ type: 'success', text: 'Voucher deleted.' });
//           break;
//       }
//       handleRefresh();
//     } catch (err: any) {
//       setMessage({ type: 'error', text: err.data?.error || 'Operation failed' });
//     } finally {
//       setShowConfirmModal(false);
//       setConfirmAction(null);
//       setTimeout(() => setMessage(null), 3000);
//     }
//   };

//   const isLoading = loadingGDN || loadingVouchers;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="mb-4">
//         <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//           <Receipt className="w-6 h-6 text-emerald-600" />
//           GDN Sales Voucher
//         </h1>
//       </div>

//       {/* Message */}
//       {message && (
//         <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
//           message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
//         }`}>
//           {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
//           {message.text}
//         </div>
//       )}

//       {/* Filter Tabs */}
//       <div className="bg-white rounded-lg shadow-sm border mb-4">
//         <div className="flex items-center justify-between px-4 py-3 border-b">
//           <div className="flex items-center gap-2 text-sm">
//             <Filter className="w-4 h-4 text-gray-500" />
//             <span className="font-medium">Filter</span>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={isLoading}
//             className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
//           >
//             <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>
//         <div className="flex gap-2 p-2">
//           {[
//             { key: 'not_generated', label: 'Not Generated', count: notGeneratedGDNs.length, color: 'amber' },
//             { key: 'generated', label: 'Generated', count: generatedVouchers.length, color: 'emerald' },
//             { key: 'print', label: 'Print', count: printableGDNs.length, color: 'blue' },
//           ].map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setFilter(tab.key as FilterType)}
//               className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-all ${
//                 filter === tab.key
//                   ? `bg-${tab.color}-100 text-${tab.color}-700 border border-${tab.color}-300`
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               {tab.label} ({tab.count})
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* NOT GENERATED TAB */}
//       {filter === 'not_generated' && (
//         <div className="bg-white rounded-lg shadow-sm border">
//           {loadingGDN ? (
//             <div className="p-8 text-center">
//               <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
//             </div>
//           ) : notGeneratedGDNs.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
//               <p>No GDNs pending</p>
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">GDN #</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
//                   <th className="px-4 py-3 text-center font-medium text-gray-600">Items</th>
//                   <th className="px-4 py-3 text-center font-medium text-gray-600">Status</th>
//                   <th className="px-4 py-3 text-center font-medium text-gray-600">Approved</th>
//                   <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {notGeneratedGDNs.map((gdn: any) => {
//                   const isRegenerate = gdn.is_Voucher_Generated && gdn.Status === 'UnPost';
//                   return (
//                     <tr key={gdn.ID} className="hover:bg-gray-50">
//                       <td className="px-4 py-3">
//                         <span className="font-medium">{gdn.Number}</span>
//                         {isRegenerate && (
//                           <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">RE-GEN</span>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           {new Date(gdn.Date).toLocaleDateString('en-GB')}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <User className="w-4 h-4 text-gray-400" />
//                           {gdn.account?.acName || '-'}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
//                           {gdn.details?.length || 0}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           gdn.Status === 'Post' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
//                         }`}>
//                           {gdn.Status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {gdn.approved ? (
//                           <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
//                         ) : (
//                           <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         {!gdn.approved ? (
//                           <select
//                             className="px-3 py-1.5 text-sm border rounded bg-white"
//                             defaultValue=""
//                             onChange={(e) => {
//                               if (e.target.value) handleApprove(gdn.ID, e.target.value as any);
//                               e.target.value = '';
//                             }}
//                           >
//                             <option value="" disabled>Select</option>
//                             <option value="approve">✓ Approve</option>
//                             <option value="reject">✗ Reject</option>
//                           </select>
//                         ) : (
//                           <button
//                             onClick={() => handleGenerate(gdn)}
//                             className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium text-white ${
//                               isRegenerate ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
//                             }`}
//                           >
//                             {isRegenerate ? <RotateCcw className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                             {isRegenerate ? 'Re-Generate' : 'Generate'}
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* GENERATED TAB */}
//       {filter === 'generated' && (
//         <div className="bg-white rounded-lg shadow-sm border">
//           {loadingVouchers ? (
//             <div className="p-8 text-center">
//               <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
//             </div>
//           ) : generatedVouchers.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               <Receipt className="w-10 h-10 mx-auto mb-2 text-gray-300" />
//               <p>No vouchers generated</p>
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Voucher #</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">GDN #</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
//                   <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {generatedVouchers.map((v: any) => {
//                   const isPosted = v.status === true;
//                   return (
//                     <tr key={v.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 font-semibold text-emerald-700">{v.voucherNo}</td>
//                       <td className="px-4 py-3">{v.stockMain?.Number || v.Voucher?.Number || '-'}</td>
//                       <td className="px-4 py-3 text-gray-600">{new Date(v.date).toLocaleDateString('en-GB')}</td>
//                       <td className="px-4 py-3">{v.stockMain?.account?.acName || v.Voucher?.account?.acName || '-'}</td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2 justify-end">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             isPosted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
//                           }`}>
//                             {isPosted ? 'Post' : 'UnPost'}
//                           </span>
//                           <button
//                             onClick={() => handleTogglePost(v.id, isPosted)}
//                             className={`p-1.5 rounded ${
//                               isPosted ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
//                             }`}
//                             title={isPosted ? 'UnPost' : 'Post'}
//                           >
//                             {isPosted ? <Undo2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
//                           </button>
//                           {!isPosted && (
//                             <button
//                               onClick={() => handleDelete(v.stk_Main_ID)}
//                               className="p-1.5 bg-red-100 text-red-600 rounded"
//                               title="Delete"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* PRINT TAB */}
//       {filter === 'print' && (
//         <div className="bg-white rounded-lg shadow-sm border">
//           {loadingGDN ? (
//             <div className="p-8 text-center">
//               <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
//             </div>
//           ) : printableGDNs.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               <Printer className="w-10 h-10 mx-auto mb-2 text-gray-300" />
//               <p>No vouchers ready for print</p>
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">GDN #</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Voucher #</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
//                   <th className="px-4 py-3 text-left font-medium text-gray-600">City</th>
//                   <th className="px-4 py-3 text-center font-medium text-gray-600">Items</th>
//                   <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {printableGDNs.map((gdn: any) => {
//                   const voucher = generatedVouchers.find((v: any) => v.stk_Main_ID === gdn.ID);
//                   return (
//                     <tr key={gdn.ID} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 font-medium">{gdn.Number}</td>
//                       <td className="px-4 py-3 text-emerald-700 font-medium">{voucher?.voucherNo || '-'}</td>
//                       <td className="px-4 py-3 text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           {new Date(gdn.Date).toLocaleDateString('en-GB')}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <User className="w-4 h-4 text-gray-400" />
//                           {gdn.account?.acName || '-'}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-gray-600">{gdn.account?.city || '-'}</td>
//                       <td className="px-4 py-3 text-center">
//                         <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
//                           {gdn.details?.length || 0}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <button
//                           onClick={() => handlePrint(gdn)}
//                           className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
//                         >
//                           <Printer className="w-4 h-4" />
//                           Print
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       {showVoucherModal && selectedGDN && (
//         <SalesVoucher
//           gdnId={selectedGDN.ID}
//           mode={voucherMode}
//           onClose={() => {
//             setShowVoucherModal(false);
//             setSelectedGDN(null);
//           }}
//           onSuccess={() => {
//             handleRefresh();
//             setShowVoucherModal(false);
//             setSelectedGDN(null);
//             setMessage({ type: 'success', text: voucherMode === 'edit' ? 'Voucher re-generated!' : 'Voucher generated!' });
//           }}
//         />
//       )}

//       {showPrintModal && printGDN && (
//         <SalesVoucherPrintModal
//           gdn={printGDN}
//           voucherNo={printVoucherNo}
//           onClose={() => {
//             setShowPrintModal(false);
//             setPrintGDN(null);
//             setPrintVoucherNo('');
//           }}
//         />
//       )}

//       {showConfirmModal && confirmAction && (
//         <ConfirmationModal
//           isOpen={showConfirmModal}
//           title={`Confirm ${confirmAction.type}`}
//           message={getConfirmMessage(confirmAction.type)}
//           confirmText={confirmAction.type === 'delete' ? 'Delete' : 'Confirm'}
//           type={confirmAction.type === 'delete' ? 'danger' : 'warning'}
//           loading={updating || toggling || deleting}
//           onConfirm={handleConfirm}
//           onClose={() => {
//             setShowConfirmModal(false);
//             setConfirmAction(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// function getConfirmMessage(type: string): string {
//   const msgs: Record<string, string> = {
//     approve: 'Approve this GDN?',
//     reject: 'Reject this GDN?',
//     post: 'Post this voucher?',
//     unpost: 'UnPost this voucher?',
//     delete: 'Delete this voucher?'
//   };
//   return msgs[type] || 'Proceed?';
// }






























































// app/gdn/sales-voucher/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import {
  Receipt, Filter, RefreshCw, CheckCircle, XCircle,
  Plus, RotateCcw, Send, Undo2, Trash2, Calendar, User, Package, Printer, Eye
} from 'lucide-react';

import { useGetAllGDNsQuery, useGetGDNByIdQuery } from '@/store/slice/gdnApi';
import {
  useGetAllSalesVouchersQuery,
  useGetSalesVoucherStatsQuery,
  useUpdateStockMainMutation,
  useToggleSalesVoucherStatusMutation,
  useDeleteVoucherMutation
} from '@/store/slice/salesVoucherApi';

import SalesVoucher from '@/components/vouchers/sales/SalesVoucher';
import SalesVoucherPrintModal from '@/components/vouchers/sales/SalesVoucherPrintModal';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

type FilterType = 'not_generated' | 'generated' | 'print';
type VoucherMode = 'create' | 'edit';

export default function GDNSalesVoucherPage() {
  const [filter, setFilter] = useState<FilterType>('not_generated');
  const [selectedGDN, setSelectedGDN] = useState<any>(null);
  const [voucherMode, setVoucherMode] = useState<VoucherMode>('create');
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printGDNId, setPrintGDNId] = useState<number | null>(null);
  const [printVoucherNo, setPrintVoucherNo] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch data using NEW APIs
  const { data: gdnData, isLoading: loadingGDN, refetch: refetchGDN } = useGetAllGDNsQuery(undefined);
  const { data: voucherData, isLoading: loadingVouchers, refetch: refetchVouchers } = useGetAllSalesVouchersQuery();
  const { data: statsData, refetch: refetchStats } = useGetSalesVoucherStatsQuery();
  
  // Fetch single GDN for print (with transporter)
  const { data: printGDNData } = useGetGDNByIdQuery(printGDNId!, { skip: !printGDNId });

  // Mutations
  const [updateStockMain, { isLoading: updating }] = useUpdateStockMainMutation();
  const [toggleStatus, { isLoading: toggling }] = useToggleSalesVoucherStatusMutation();
  const [deleteVoucher, { isLoading: deleting }] = useDeleteVoucherMutation();

  // Stats
  const stats = statsData?.data || { total: 0, posted: 0, unposted: 0, deleted: 0 };

  // Filter: Not Generated GDNs
  const notGeneratedGDNs = useMemo(() => {
    if (!gdnData?.data) return [];
    return gdnData.data.filter((gdn: any) => {
      if (gdn.Stock_Type_ID !== 12) return false;
      if (!gdn.approved) return true;
      if (gdn.approved && !gdn.is_Voucher_Generated) return true;
      if (gdn.approved && gdn.is_Voucher_Generated && gdn.Status === 'UnPost') return true;
      return false;
    });
  }, [gdnData]);

  // Filter: Generated Vouchers
  const generatedVouchers = useMemo(() => {
    return voucherData?.data || [];
  }, [voucherData]);

  // Filter: Printable GDNs
  const printableGDNs = useMemo(() => {
    if (!gdnData?.data) return [];
    return gdnData.data.filter((gdn: any) => {
      if (gdn.Stock_Type_ID !== 12) return false;
      return gdn.approved === true && gdn.Status === 'Post' && gdn.is_Voucher_Generated === true;
    });
  }, [gdnData]);

  // Refresh all data
  const handleRefresh = () => {
    refetchGDN();
    refetchVouchers();
    refetchStats();
  };

  // Approve/Reject GDN
  const handleApprove = (gdnId: number, action: 'approve' | 'reject') => {
    setConfirmAction({ type: action, gdnId });
    setShowConfirmModal(true);
  };

  // Generate voucher
  const handleGenerate = (gdn: any) => {
    setSelectedGDN(gdn);
    setVoucherMode(gdn.is_Voucher_Generated && gdn.Status === 'UnPost' ? 'edit' : 'create');
    setShowVoucherModal(true);
  };

  // Post/UnPost voucher
  const handleTogglePost = (journalId: number, isPosted: boolean) => {
    setConfirmAction({ type: isPosted ? 'unpost' : 'post', journalId });
    setShowConfirmModal(true);
  };

  // Delete voucher
  const handleDelete = (stockMainId: number) => {
    setConfirmAction({ type: 'delete', stockMainId });
    setShowConfirmModal(true);
  };

  // Print/View voucher
  const [printMode, setPrintMode] = useState<'view' | 'print'>('view');
  
  const handlePrint = (gdn: any, mode: 'view' | 'print') => {
    const voucher = generatedVouchers.find((v: any) => v.stk_Main_ID === gdn.ID);
    setPrintVoucherNo(voucher?.voucherNo || '');
    setPrintGDNId(gdn.ID);
    setPrintMode(mode);
    setShowPrintModal(true);
  };

  // Confirm action
  const handleConfirm = async () => {
    if (!confirmAction) return;
    try {
      switch (confirmAction.type) {
        case 'approve':
          await updateStockMain({ id: confirmAction.gdnId, data: { approved: true } }).unwrap();
          setMessage({ type: 'success', text: 'GDN approved!' });
          break;
        case 'reject':
          await updateStockMain({ id: confirmAction.gdnId, data: { approved: false } }).unwrap();
          setMessage({ type: 'success', text: 'GDN rejected.' });
          break;
        case 'post':
        case 'unpost':
          await toggleStatus(confirmAction.journalId).unwrap();
          setMessage({ type: 'success', text: `Voucher ${confirmAction.type}ed!` });
          break;
        case 'delete':
          await deleteVoucher(confirmAction.stockMainId).unwrap();
          setMessage({ type: 'success', text: 'Voucher deleted.' });
          break;
      }
      handleRefresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.data?.error || 'Operation failed' });
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.toLocaleString('default', { month: 'short' })}/${date.getFullYear().toString().slice(-2)}`;
  };

  const isLoading = loadingGDN || loadingVouchers;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            GDN Sales Voucher
          </h1>
          <p className="text-sm text-gray-500">Manage sales vouchers and journal entries</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Vouchers</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-700">{stats.posted}</p>
          <p className="text-sm text-green-600">Posted</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-amber-700">{stats.unposted}</p>
          <p className="text-sm text-amber-600">UnPosted</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-red-700">{stats.deleted}</p>
          <p className="text-sm text-red-600">Deleted</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filter</span>
        </div>
        <div className="flex gap-2 p-3">
          {[
            { key: 'not_generated', label: 'Not Generated', count: notGeneratedGDNs.length, color: 'amber' },
            { key: 'generated', label: 'Generated', count: generatedVouchers.length, color: 'emerald' },
            { key: 'print', label: 'Print', count: printableGDNs.length, color: 'blue' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as FilterType)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? tab.color === 'amber' ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : tab.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: NOT GENERATED */}
      {filter === 'not_generated' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loadingGDN ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            </div>
          ) : notGeneratedGDNs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>No GDNs pending</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">GDN #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Items</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Approved</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notGeneratedGDNs.map((gdn: any) => {
                  const isRegenerate = gdn.is_Voucher_Generated && gdn.Status === 'UnPost';
                  return (
                    <tr key={gdn.ID} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium">{gdn.Number}</span>
                        {isRegenerate && (
                          <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">RE-GEN</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(gdn.Date)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          {gdn.account?.acName || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {gdn.details?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          gdn.Status === 'Post' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {gdn.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {gdn.approved ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!gdn.approved ? (
                          <select
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white"
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) handleApprove(gdn.ID, e.target.value as any);
                              e.target.value = '';
                            }}
                          >
                            <option value="" disabled>Select</option>
                            <option value="approve">✓ Approve</option>
                            <option value="reject">✗ Reject</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => handleGenerate(gdn)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium text-white ${
                              isRegenerate ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            {isRegenerate ? <RotateCcw className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {isRegenerate ? 'Re-Generate' : 'Generate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: GENERATED */}
      {filter === 'generated' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loadingVouchers ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            </div>
          ) : generatedVouchers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Receipt className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>No vouchers generated</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Voucher #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">GDN #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Entries</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {generatedVouchers.map((v: any) => {
                  const isPosted = v.status === true;
                  return (
                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-emerald-700">{v.voucherNo}</td>
                      <td className="px-4 py-3">{v.Voucher?.Number || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(v.date)}</td>
                      <td className="px-4 py-3">{v.Voucher?.account?.acName || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {v.details?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isPosted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isPosted ? 'Posted' : 'UnPosted'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleTogglePost(v.id, isPosted)}
                            className={`p-1.5 rounded ${
                              isPosted ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                            }`}
                            title={isPosted ? 'UnPost' : 'Post'}
                          >
                            {isPosted ? <Undo2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                          </button>
                          {!isPosted && (
                            <button
                              onClick={() => handleDelete(v.stk_Main_ID)}
                              className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 3: PRINT */}
      {filter === 'print' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loadingGDN ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            </div>
          ) : printableGDNs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Printer className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>No vouchers ready for print</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">GDN #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Voucher #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">City</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Items</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {printableGDNs.map((gdn: any) => {
                  const voucher = generatedVouchers.find((v: any) => v.stk_Main_ID === gdn.ID);
                  return (
                    <tr key={gdn.ID} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{gdn.Number}</td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{voucher?.voucherNo || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(gdn.Date)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          {gdn.account?.acName || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{gdn.account?.city || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {gdn.details?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handlePrint(gdn, 'view')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handlePrint(gdn, 'print')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* MODALS */}
      
      {/* Generate Voucher Modal */}
      {showVoucherModal && selectedGDN && (
        <SalesVoucher
          gdnId={selectedGDN.ID}
          mode={voucherMode}
          onClose={() => {
            setShowVoucherModal(false);
            setSelectedGDN(null);
          }}
          onSuccess={() => {
            handleRefresh();
            setShowVoucherModal(false);
            setSelectedGDN(null);
            setMessage({ type: 'success', text: voucherMode === 'edit' ? 'Voucher re-generated!' : 'Voucher generated!' });
          }}
        />
      )}

      {/* Print/View Modal - Only show for VIEW mode */}
      {showPrintModal && printGDNId && printGDNData?.data && printMode === 'view' && (
        <SalesVoucherPrintModal
          gdn={printGDNData.data}
          voucherNo={printVoucherNo}
          mode="view"
          onClose={() => {
            setShowPrintModal(false);
            setPrintGDNId(null);
            setPrintVoucherNo('');
          }}
        />
      )}
      
      {/* Print Mode - Render hidden, auto-prints and closes */}
      {showPrintModal && printGDNId && printGDNData?.data && printMode === 'print' && (
        <SalesVoucherPrintModal
          gdn={printGDNData.data}
          voucherNo={printVoucherNo}
          mode="print"
          onClose={() => {
            setShowPrintModal(false);
            setPrintGDNId(null);
            setPrintVoucherNo('');
          }}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          title={`Confirm ${confirmAction.type}`}
          message={getConfirmMessage(confirmAction.type)}
          confirmText={confirmAction.type === 'delete' ? 'Delete' : 'Confirm'}
          type={confirmAction.type === 'delete' ? 'danger' : 'warning'}
          loading={updating || toggling || deleting}
          onConfirm={handleConfirm}
          onClose={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
        />
      )}
    </div>
  );
}

function getConfirmMessage(type: string): string {
  const msgs: Record<string, string> = {
    approve: 'Are you sure you want to approve this GDN?',
    reject: 'Are you sure you want to reject this GDN?',
    post: 'Are you sure you want to post this voucher?',
    unpost: 'Are you sure you want to unpost this voucher?',
    delete: 'Are you sure you want to delete this voucher? This action cannot be undone.'
  };
  return msgs[type] || 'Are you sure you want to proceed?';
}
