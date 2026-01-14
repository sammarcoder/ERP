// // components/SalesVoucher.tsx
// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   X, FileText, Save, RefreshCw, AlertCircle, CheckCircle,
//   Package, Truck, BookOpen
// } from 'lucide-react';

// import { useGetGDNByIdQuery } from '@/store/slice/gdnApi';
// import {
//   useUpdateStockDetailMutation,
//   useUpdateStockMainMutation,
//   usePostVoucherToJournalMutation,
//   useGetCarriageAccountsQuery
// } from '@/store/slice/salesVoucherApi';

// import { ConfirmationModal } from '@/components/common/ConfirmationModal';

// interface Props {
//   gdnId: number;
//   mode: 'create' | 'edit';
//   onClose: () => void;
//   onSuccess: () => void;
// }

// type TabType = 'stock' | 'carriage' | 'journal';

// export default function SalesVoucher({ gdnId, mode, onClose, onSuccess }: Props) {
//   const [activeTab, setActiveTab] = useState<TabType>('stock');
//   const [details, setDetails] = useState<any[]>([]);
//   const [carriageId, setCarriageId] = useState<number | null>(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const { data: gdnRes, isLoading: loadingGDN } = useGetGDNByIdQuery(gdnId);
//   const { data: carriageRes } = useGetCarriageAccountsQuery();

//   const [updateDetail, { isLoading: updatingDetail }] = useUpdateStockDetailMutation();
//   const [updateMain, { isLoading: updatingMain }] = useUpdateStockMainMutation();
//   const [postVoucher, { isLoading: posting }] = usePostVoucherToJournalMutation();

//   const gdn = gdnRes?.data;
//   const carriageAccounts = carriageRes?.data || [];
//   const isSubmitting = updatingDetail || updatingMain || posting;

//   useEffect(() => {
//     if (gdn?.details) {
//       const mapped = gdn.details.map((d: any) => ({
//         ID: d.ID,
//         Item_ID: d.Item_ID,
//         Batch_ID: d.Batch_ID,
//         itemName: d.item?.itemName || '-',
//         batchName: d.batchDetails?.acName || '-',
//         uom2_qty: parseFloat(d.uom2_qty) || 0,
//         uom3_qty: parseFloat(d.uom3_qty) || 0,
//         uom2Name: d.item?.uomTwo?.uom || 'Box',
//         uom3Name: d.item?.uomThree?.uom || 'Crt',
//         editedPrice: parseFloat(d.Stock_Price) || 0,
//         editedDiscountA: parseFloat(d.Discount_A) || 0,
//         editedDiscountB: parseFloat(d.Discount_B) || 0,
//         editedDiscountC: parseFloat(d.Discount_C) || 0,
//         editedScheme: parseFloat(d.Scheme_Discount) || 0,
//       }));
//       setDetails(mapped);
//       setCarriageId(gdn.Carriage_ID || null);
//     }
//   }, [gdn]);

//   const calculateGross = (d: any) => d.uom2_qty * d.editedPrice;

//   const calculateNet = (d: any) => {
//     const gross = calculateGross(d);
//     const afterA = gross - (gross * d.editedDiscountA / 100);
//     const afterB = afterA - (afterA * d.editedDiscountB / 100);
//     const afterC = afterB - (afterB * d.editedDiscountC / 100);
//     return afterC - (afterC * d.editedScheme / 100);
//   };

//   const carriageAmount = useMemo(() => {
//     if (!gdn || !carriageId) return 0;
//     const labour = parseFloat(gdn.labour_crt || 0);
//     const freight = parseFloat(gdn.freight_crt || 0);
//     const bility = parseFloat(gdn.bility_expense || 0);
//     const other = parseFloat(gdn.other_expense || 0);
//     const booked = parseFloat(gdn.booked_crt || 0);
//     return (labour * booked) + (freight * booked) + bility + other;
//   }, [gdn, carriageId]);

//   const totals = useMemo(() => {
//     const totalCrt = details.reduce((sum, d) => sum + d.uom3_qty, 0);
//     const totalBox = details.reduce((sum, d) => sum + d.uom2_qty, 0);
//     const totalGross = details.reduce((sum, d) => sum + calculateGross(d), 0);
//     const totalNet = details.reduce((sum, d) => sum + calculateNet(d), 0);
//     const customerDebit = totalNet - carriageAmount;
//     return { totalCrt, totalBox, totalGross, totalNet, carriageAmount, customerDebit };
//   }, [details, carriageAmount]);

//   const batchTotals = useMemo(() => {
//     const grouped: Record<number, { batchName: string; amount: number }> = {};
//     details.forEach(d => {
//       if (!grouped[d.Batch_ID]) {
//         grouped[d.Batch_ID] = { batchName: d.batchName, amount: 0 };
//       }
//       grouped[d.Batch_ID].amount += calculateNet(d);
//     });
//     return grouped;
//   }, [details]);

//   const handleFieldChange = (id: number, field: string, value: number) => {
//     setDetails(prev => prev.map(d => d.ID === id ? { ...d, [field]: value } : d));
//   };

//   // const handleSubmit = async () => {
//   //   setShowConfirm(false);
//   //   setMessage(null);

//   //   try {
//   //     await Promise.all(details.map(d =>
//   //       updateDetail({
//   //         id: d.ID,
//   //         data: {
//   //           Stock_Price: d.editedPrice,
//   //           Discount_A: d.editedDiscountA,
//   //           Discount_B: d.editedDiscountB,
//   //           Discount_C: d.editedDiscountC,
//   //           Scheme_Discount: d.editedScheme,
//   //         }
//   //       }).unwrap()
//   //     ));

//   //     await updateMain({
//   //       id: gdnId,
//   //       data: {
//   //         is_Voucher_Generated: true,
//   //         Status: 'Post',
//   //         Carriage_ID: carriageId,
//   //         Carriage_Amount: carriageAmount,
//   //       }
//   //     }).unwrap();

//   //     await postVoucher({ stockMainId: gdnId, mode }).unwrap();

//   //     setMessage({ type: 'success', text: 'Voucher generated successfully!' });
//   //     setTimeout(onSuccess, 1500);

//   //   } catch (err: any) {
//   //     setMessage({ type: 'error', text: err.data?.error || 'Failed to generate voucher' });
//   //   }
//   // };


//   // Find handleSubmit function and replace with this:

// const handleSubmit = async () => {
//   setShowConfirm(false);
//   setMessage(null);

//   try {
//     // Step 1: Update stock details
//     await Promise.all(details.map(d =>
//       updateDetail({
//         id: d.ID,
//         data: {
//           Stock_Price: d.editedPrice,
//           Discount_A: d.editedDiscountA,
//           Discount_B: d.editedDiscountB,
//           Discount_C: d.editedDiscountC,
//           Scheme_Discount: d.editedScheme,
//         }
//       }).unwrap()
//     ));

//     // Step 2: Update stock main
//     await updateMain({
//       id: gdnId,
//       data: {
//         is_Voucher_Generated: true,
//         Status: 'Post',
//         Carriage_ID: carriageId,
//         Carriage_Amount: carriageAmount,
//       }
//     }).unwrap();

//     // Step 3: Post journal WITH calculatedTotals ✅
//     await postVoucher({
//       stockMainId: gdnId,
//       mode,
//       calculatedTotals: {
//         totalNet: totals.totalNet,
//         carriageAmount: carriageAmount,
//         customerDebit: totals.customerDebit,
//         batchTotals: batchTotals  // { batchId: { batchName, amount } }
//       }
//     }).unwrap();

//     setMessage({ type: 'success', text: 'Voucher generated successfully!' });
//     setTimeout(onSuccess, 1500);

//   } catch (err: any) {
//     setMessage({ type: 'error', text: err.data?.error || 'Failed to generate voucher' });
//   }
// };


//   if (loadingGDN) {
//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8 text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
//           <p className="mt-3 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!gdn) {
//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8 text-center">
//           <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
//           <p className="mt-3">Failed to load GDN</p>
//           <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-100 rounded">Close</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[96vh] overflow-hidden flex flex-col">

//         {/* Header */}
//         <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <FileText className="w-6 h-6 text-white" />
//             <h2 className="text-lg font-semibold text-white">
//               Sales Voucher {mode === 'edit' && '(Re-Generate)'}
//             </h2>
//           </div>
//           <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded">
//             <X className="w-5 h-5 text-white" />
//           </button>
//         </div>

//         {/* Info Bar */}
//         <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-8 text-sm">
//           <div><span className="text-gray-400">GDN:</span> <span className="font-semibold">{gdn.Number}</span></div>
//           <div><span className="text-gray-400">Date:</span> <span className="font-semibold">{new Date(gdn.Date).toLocaleDateString('en-GB')}</span></div>
//           <div><span className="text-gray-400">Customer:</span> <span className="font-semibold">{gdn.account?.acName || '-'}</span></div>
//           <div><span className="text-gray-400">Items:</span> <span className="font-semibold text-emerald-600">{details.length}</span></div>
//         </div>

//         {/* Message */}
//         {message && (
//           <div className={`mx-6 mt-4 px-4 py-3 rounded flex items-center gap-2 ${
//             message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
//           }`}>
//             {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             {message.text}
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="px-6 pt-4 flex gap-1 border-b">
//           {[
//             { key: 'stock', label: 'Stock Details', icon: Package },
//             { key: 'carriage', label: 'Carriage', icon: Truck },
//             { key: 'journal', label: 'Journal', icon: BookOpen },
//           ].map(tab => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key as TabType)}
//               className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t transition-all ${
//                 activeTab === tab.key
//                   ? 'bg-white border-t border-x text-emerald-700 -mb-px'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <tab.icon className="w-4 h-4" />
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-auto p-6">

//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {/* TAB 1: Stock Details */}
//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {activeTab === 'stock' && (
//             <div className="border rounded-lg overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 text-gray-600">
//                   <tr>
//                     <th className="px-3 py-3 text-left font-medium">#</th>
//                     <th className="px-3 py-3 text-left font-medium">Item</th>
//                     <th className="px-3 py-3 text-left font-medium">Batch</th>
//                     <th className="px-3 py-3 text-center font-medium">Crt</th>
//                     <th className="px-3 py-3 text-center font-medium">Box</th>
//                     <th className="px-3 py-3 text-center font-medium">Price</th>
//                     <th className="px-3 py-3 text-center font-medium">Dis A%</th>
//                     <th className="px-3 py-3 text-center font-medium">Dis B%</th>
//                     <th className="px-3 py-3 text-center font-medium">Dis C%</th>
//                     {/* <th className="px-3 py-3 text-center font-medium">Sch%</th> */}
//                     <th className="px-3 py-3 text-right font-medium">Gross</th>
//                     <th className="px-3 py-3 text-right font-medium">Net</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {details.map((d, i) => (
//                     <tr key={d.ID} className="hover:bg-gray-50/50">
//                       <td className="px-3 py-3 text-gray-400">{i + 1}</td>
//                       <td className="px-3 py-3 font-medium text-gray-800">{d.itemName}</td>
//                       <td className="px-3 py-3 text-gray-500">{d.batchName}</td>
//                       <td className="px-3 py-3 text-center">{d.uom3_qty}</td>
//                       <td className="px-3 py-3 text-center">{d.uom2_qty}</td>
//                       <td className="px-3 py-3">
//                         <div className="flex items-center justify-center gap-1">
//                           <input
//                             type="number"
//                             value={d.editedPrice}
//                             onChange={(e) => handleFieldChange(d.ID, 'editedPrice', parseFloat(e.target.value) || 0)}
//                             className="w-20 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
//                           />
//                           <span className="text-gray-400">/{d.uom2Name}</span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3">
//                         <input
//                           type="number"
//                           value={d.editedDiscountA}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedDiscountA', parseFloat(e.target.value) || 0)}
//                           className="w-14 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
//                         />
//                       </td>
//                       <td className="px-3 py-3">
//                         <input
//                           type="number"
//                           value={d.editedDiscountB}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedDiscountB', parseFloat(e.target.value) || 0)}
//                           className="w-14 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
//                         />
//                       </td>
//                       <td className="px-3 py-3">
//                         <input
//                           type="number"
//                           value={d.editedDiscountC}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedDiscountC', parseFloat(e.target.value) || 0)}
//                           className="w-14 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
//                         />
//                       </td>
//                       {/* <td className="px-3 py-3">
//                         <input
//                           type="number"
//                           value={d.editedScheme}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedScheme', parseFloat(e.target.value) || 0)}
//                           className="w-14 px-2 py-1.5 text-center border rounded focus:border-emerald-400 outline-none"
//                         />
//                       </td> */}
//                       <td className="px-3 py-3 text-right text-gray-600">
//                         {calculateGross(d).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="px-3 py-3 text-right font-semibold text-emerald-600">
//                         {calculateNet(d).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 {/* Totals Row */}
//                 <tfoot className="bg-emerald-50 border-t-2 border-emerald-200">
//                   <tr className="font-semibold text-emerald-800">
//                     <td colSpan={3} className="px-3 py-3 text-right">TOTAL</td>
//                     <td className="px-3 py-3 text-center">{totals.totalCrt}</td>
//                     <td className="px-3 py-3 text-center">{totals.totalBox}</td>
//                     <td colSpan={4}></td>
//                     <td className="px-3 py-3 text-right">
//                       {totals.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="px-3 py-3 text-right text-emerald-700">
//                       {totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}

//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {/* TAB 2: Carriage Info */}
//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {activeTab === 'carriage' && (
//             <div className="max-w-md mx-auto space-y-4">
//               {/* Account Select */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Carriage Account</label>
//                 <select
//                   value={carriageId || ''}
//                   onChange={(e) => setCarriageId(e.target.value ? parseInt(e.target.value) : null)}
//                   className="w-full px-3 py-2 border rounded-lg focus:border-emerald-400 outline-none"
//                 >
//                   <option value="">-- No Carriage --</option>
//                   {carriageAccounts.map((acc: any) => (
//                     <option key={acc.id} value={acc.id}>{acc.acName}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Breakdown */}
//               {carriageId && (
//                 <div className="border rounded-lg overflow-hidden">
//                   <table className="w-full text-sm">
//                     <tbody className="divide-y">
//                       <tr>
//                         <td className="px-4 py-2.5 text-gray-500">Labour /Crt</td>
//                         <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.labour_crt || 0).toLocaleString()}</td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2.5 text-gray-500">Freight /Crt</td>
//                         <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.freight_crt || 0).toLocaleString()}</td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2.5 text-gray-500">Bility Expense</td>
//                         <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.bility_expense || 0).toLocaleString()}</td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2.5 text-gray-500">Other Expense</td>
//                         <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.other_expense || 0).toLocaleString()}</td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2.5 text-gray-500">Booked Crt</td>
//                         <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.booked_crt || 0).toLocaleString()}</td>
//                       </tr>
//                       <tr className="bg-emerald-50">
//                         <td className="px-4 py-2.5 font-semibold text-emerald-700">Total Carriage</td>
//                         <td className="px-4 py-2.5 text-right font-bold text-emerald-700">
//                           {carriageAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {!carriageId && (
//                 <p className="text-center text-gray-400 py-8">Select account to view breakdown</p>
//               )}
//             </div>
//           )}

//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {/* TAB 3: Journal Preview */}
//           {/* ═══════════════════════════════════════════════════════════════ */}
//           {activeTab === 'journal' && (
//             <div className="space-y-4">
//               {/* Master Info */}
//               <div className="flex gap-8 text-sm text-gray-600 pb-3 border-b">
//                 <div><span className="text-gray-400">Voucher:</span> SV-{'{auto}'}</div>
//                 <div><span className="text-gray-400">Type:</span> 12 (Sales)</div>
//                 <div><span className="text-gray-400">Status:</span> <span className="text-amber-600">UnPost</span></div>
//               </div>

//               {/* Details Table */}
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50">
//                     <tr className="text-gray-500">
//                       <th className="px-4 py-2.5 text-left font-medium w-12">#</th>
//                       <th className="px-4 py-2.5 text-left font-medium">Account</th>
//                       <th className="px-4 py-2.5 text-left font-medium">Description</th>
//                       <th className="px-4 py-2.5 text-right font-medium w-32">Debit</th>
//                       <th className="px-4 py-2.5 text-right font-medium w-32">Credit</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y">
//                     {/* Customer */}
//                     <tr>
//                       <td className="px-4 py-2.5 text-gray-400">1</td>
//                       <td className="px-4 py-2.5 font-medium">{gdn.account?.acName || 'Customer'}</td>
//                       <td className="px-4 py-2.5 text-gray-500">
//                         S.Inv{gdn.order?.sub_city && `, ${gdn.order.sub_city}`}{gdn.order?.sub_customer && `, ${gdn.order.sub_customer}`}
//                       </td>
//                       <td className="px-4 py-2.5 text-right font-medium">
//                         {totals.customerDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="px-4 py-2.5 text-right text-gray-300">-</td>
//                     </tr>

//                     {/* Carriage */}
//                     {carriageId && carriageAmount > 0 && (
//                       <tr>
//                         <td className="px-4 py-2.5 text-gray-400">2</td>
//                         <td className="px-4 py-2.5 font-medium">
//                           {carriageAccounts.find((a: any) => a.id === carriageId)?.acName || 'Carriage'}
//                         </td>
//                         <td className="px-4 py-2.5 text-gray-500">
//                           S.Inv{gdn.account?.acName && `, ${gdn.account.acName}`}
//                         </td>
//                         <td className="px-4 py-2.5 text-right font-medium">
//                           {carriageAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                         </td>
//                         <td className="px-4 py-2.5 text-right text-gray-300">-</td>
//                       </tr>
//                     )}

//                     {/* Batches */}
//                     {Object.entries(batchTotals).map(([batchId, batchData], idx) => (
//                       <tr key={batchId}>
//                         <td className="px-4 py-2.5 text-gray-400">
//                           {carriageId && carriageAmount > 0 ? idx + 3 : idx + 2}
//                         </td>
//                         <td className="px-4 py-2.5 font-medium">{batchData.batchName}</td>
//                         <td className="px-4 py-2.5 text-gray-500">{batchData.batchName}</td>
//                         <td className="px-4 py-2.5 text-right text-gray-300">-</td>
//                         <td className="px-4 py-2.5 text-right font-medium">
//                           {batchData.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot className="bg-gray-50 border-t">
//                     <tr className="font-semibold">
//                       <td colSpan={3} className="px-4 py-2.5 text-right">TOTAL</td>
//                       <td className="px-4 py-2.5 text-right">
//                         {(totals.customerDebit + (carriageId ? carriageAmount : 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="px-4 py-2.5 text-right">
//                         {totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               {/* Balance Check */}
//               {(() => {
//                 const totalDebit = totals.customerDebit + (carriageId ? carriageAmount : 0);
//                 const isBalanced = totalDebit.toFixed(2) === totals.totalNet.toFixed(2);
//                 return (
//                   <div className={`px-4 py-2.5 rounded flex justify-between text-sm ${isBalanced ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
//                     <span>Balance Check</span>
//                     <span className="font-semibold">{isBalanced ? '✓ Balanced' : '✗ Not Balanced'}</span>
//                   </div>
//                 );
//               })()}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
//           <div className="text-sm">
//             <span className="text-gray-400">Total Net:</span>
//             <span className="ml-2 font-bold text-lg text-emerald-700">
//               Rs. {totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </span>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={onClose} className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
//               Cancel
//             </button>
//             <button
//               onClick={() => setShowConfirm(true)}
//               disabled={isSubmitting}
//               className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
//             >
//               {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//               {mode === 'edit' ? 'Re-Generate' : 'Generate'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {showConfirm && (
//         <ConfirmationModal
//           isOpen={showConfirm}
//           title={mode === 'edit' ? 'Re-Generate?' : 'Generate?'}
//           message={`Create journal entry for ${gdn.Number}`}
//           confirmText={mode === 'edit' ? 'Re-Generate' : 'Generate'}
//           confirmColor="emerald"
//           isLoading={isSubmitting}
//           onConfirm={handleSubmit}
//           onCancel={() => setShowConfirm(false)}
//         />
//       )}
//     </div>
//   );
// }



























































// components/SalesVoucher.tsx

// 'use client';

// import React, { useState, useMemo, useEffect } from 'react';
// import { X, Save, ChevronRight, Package, Truck, FileText, AlertCircle, CheckCircle } from 'lucide-react';
// import { useGetGDNByIdQuery } from '@/store/slice/gdnApi';
// import {
//   useUpdateStockMainMutation,
//   useUpdateStockDetailMutation,
//   usePostVoucherToJournalMutation,
//   useGetCarriageAccountsQuery,
// } from '@/store/slice/salesVoucherApi';

// interface SalesVoucherProps {
//   gdnId: number;
//   mode: 'create' | 'edit';
//   onClose: () => void;
//   onSuccess: () => void;
// }

// type TabType = 'details' | 'carriage' | 'journal';

// export default function SalesVoucher({ gdnId, mode, onClose, onSuccess }: SalesVoucherProps) {
//   const [activeTab, setActiveTab] = useState<TabType>('details');
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   // Carriage state
//   const [carriageId, setCarriageId] = useState<number | null>(null);
//   const [carriageAmount, setCarriageAmount] = useState<number>(0);

//   // Fetch GDN data
//   const { data: gdnData, isLoading: loadingGDN } = useGetGDNByIdQuery(gdnId);
//   const { data: carriageData } = useGetCarriageAccountsQuery();

//   // Mutations
//   const [updateMain] = useUpdateStockMainMutation();
//   const [updateDetail] = useUpdateStockDetailMutation();
//   const [postVoucher, { isLoading: posting }] = usePostVoucherToJournalMutation();

//   const gdn = gdnData?.data;
//   const carriageAccounts = carriageData?.data || [];

//   // Editable details state
//   const [details, setDetails] = useState<any[]>([]);

//   // Initialize details when GDN loads
//   useEffect(() => {
//     if (gdn?.details) {
//       setDetails(gdn.details.map((d: any) => ({
//         ...d,
//         editedPrice: parseFloat(d.Stock_Price) || 0,
//         editedDiscountA: parseFloat(d.Discount_A) || 0,
//         editedDiscountB: parseFloat(d.Discount_B) || 0,
//         editedDiscountC: parseFloat(d.Discount_C) || 0,
//         editedScheme: parseFloat(d.Scheme_Discount) || 0,
//       })));

//       // Set carriage from GDN if exists
//       if (gdn.Carriage_ID) setCarriageId(gdn.Carriage_ID);
//       if (gdn.Carriage_Amount) setCarriageAmount(parseFloat(gdn.Carriage_Amount) || 0);
//     }
//   }, [gdn]);

//   // Update detail field
//   const updateDetailField = (index: number, field: string, value: number) => {
//     setDetails(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d));
//   };

//   // Calculate totals
//   const { totals, batchTotals } = useMemo(() => {
//     let totalGross = 0;
//     let totalNet = 0;
//     const batches: Record<string, { batchName: string; amount: number }> = {};

//     details.forEach(d => {
//       const qty = parseFloat(d.Stock_out_SKU_UOM_Qty) || 0;
//       const price = d.editedPrice || 0;
//       const gross = qty * price;

//       const discA = gross * (d.editedDiscountA || 0) / 100;
//       const afterA = gross - discA;
//       const discB = afterA * (d.editedDiscountB || 0) / 100;
//       const afterB = afterA - discB;
//       const discC = afterB * (d.editedDiscountC || 0) / 100;
//       const net = afterB - discC;

//       totalGross += gross;
//       totalNet += net;

//       // Group by batch
//       const batchId = d.batchno || 'unknown';
//       const batchName = d.batchDetails?.acName || `Batch-${batchId}`;
//       if (!batches[batchId]) {
//         batches[batchId] = { batchName, amount: 0 };
//       }
//       batches[batchId].amount += net;
//     });

//     const customerDebit = totalNet - carriageAmount;

//     return {
//       totals: { totalGross, totalNet, customerDebit },
//       batchTotals: batches
//     };
//   }, [details, carriageAmount]);

//   // Handle submit
//   const handleSubmit = async () => {
//     setShowConfirm(false);
//     setMessage(null);

//     try {
//       console.log('═══════════════════════════════════════');
//       console.log('📤 SUBMITTING SALES VOUCHER');
//       console.log('═══════════════════════════════════════');
//       console.log('gdnId:', gdnId);
//       console.log('mode:', mode);
//       console.log('calculatedTotals:', {
//         totalNet: totals.totalNet,
//         carriageAmount,
//         customerDebit: totals.customerDebit,
//         batchTotals
//       });
//       console.log('═══════════════════════════════════════');

//       // Step 1: Update stock details
//       await Promise.all(details.map(d =>
//         updateDetail({
//           id: d.ID,
//           data: {
//             Stock_Price: d.editedPrice,
//             Discount_A: d.editedDiscountA,
//             Discount_B: d.editedDiscountB,
//             Discount_C: d.editedDiscountC,
//             Scheme_Discount: d.editedScheme,
//           }
//         }).unwrap()
//       ));
//       console.log('✅ Step 1: Stock details updated');

//       // Step 2: Update stock main
//       await updateMain({
//         id: gdnId,
//         data: {
//           is_Voucher_Generated: true,
//           Status: 'Post',
//           Carriage_ID: carriageId,
//           Carriage_Amount: carriageAmount,
//         }
//       }).unwrap();
//       console.log('✅ Step 2: Stock main updated');

//       // Step 3: Post journal with calculated values
//       await postVoucher({
//         stockMainId: gdnId,
//         mode,
//         calculatedTotals: {
//           totalNet: totals.totalNet,
//           carriageAmount,
//           customerDebit: totals.customerDebit,
//           batchTotals
//         }
//       }).unwrap();
//       console.log('✅ Step 3: Journal posted');

//       setMessage({ type: 'success', text: 'Voucher generated successfully!' });
//       setTimeout(onSuccess, 1500);

//     } catch (err: any) {
//       console.error('💥 Error:', err);
//       setMessage({ type: 'error', text: err.data?.error || 'Failed to generate voucher' });
//     }
//   };

//   // Format currency
//   const formatCurrency = (num: number) => num.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   if (loadingGDN) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8">
//           <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold">
//               {mode === 'create' ? 'Generate' : 'Re-Generate'} Sales Voucher
//             </h2>
//             <p className="text-emerald-100 text-sm">
//               GDN: {gdn?.Number} | Customer: {gdn?.account?.acName}
//             </p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white/20 rounded">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Message */}
//         {message && (
//           <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${
//             message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//           }`}>
//             {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             {message.text}
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="flex border-b px-6">
//           {[
//             { id: 'details', label: 'Stock Details', icon: Package },
//             { id: 'carriage', label: 'Carriage Info', icon: Truck },
//             { id: 'journal', label: 'Journal Preview', icon: FileText },
//           ].map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id as TabType)}
//               className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
//                 activeTab === tab.id
//                   ? 'border-emerald-600 text-emerald-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <tab.icon className="w-4 h-4" />
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-auto p-6">
//           {/* Tab 1: Stock Details */}
//           {activeTab === 'details' && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-3 py-2 text-left">Item</th>
//                     <th className="px-3 py-2 text-center">Qty</th>
//                     <th className="px-3 py-2 text-right">Price</th>
//                     <th className="px-3 py-2 text-right">Gross</th>
//                     <th className="px-3 py-2 text-center">Dis%</th>
//                     <th className="px-3 py-2 text-center">Dis2%</th>
//                     <th className="px-3 py-2 text-center">Sch%</th>
//                     <th className="px-3 py-2 text-right">Net</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {details.map((d, idx) => {
//                     const qty = parseFloat(d.Stock_out_SKU_UOM_Qty) || 0;
//                     const gross = qty * d.editedPrice;
//                     const discA = gross * d.editedDiscountA / 100;
//                     const afterA = gross - discA;
//                     const discB = afterA * d.editedDiscountB / 100;
//                     const afterB = afterA - discB;
//                     const discC = afterB * d.editedDiscountC / 100;
//                     const net = afterB - discC;

//                     return (
//                       <tr key={d.ID} className="border-b hover:bg-gray-50">
//                         <td className="px-3 py-2">{d.item?.itemName || '-'}</td>
//                         <td className="px-3 py-2 text-center">{qty}</td>
//                         <td className="px-3 py-2">
//                           <input
//                             type="number"
//                             value={d.editedPrice}
//                             onChange={(e) => updateDetailField(idx, 'editedPrice', parseFloat(e.target.value) || 0)}
//                             className="w-24 px-2 py-1 border rounded text-right"
//                           />
//                         </td>
//                         <td className="px-3 py-2 text-right">{formatCurrency(gross)}</td>
//                         <td className="px-3 py-2">
//                           <input
//                             type="number"
//                             value={d.editedDiscountA}
//                             onChange={(e) => updateDetailField(idx, 'editedDiscountA', parseFloat(e.target.value) || 0)}
//                             className="w-16 px-2 py-1 border rounded text-center"
//                           />
//                         </td>
//                         <td className="px-3 py-2">
//                           <input
//                             type="number"
//                             value={d.editedDiscountB}
//                             onChange={(e) => updateDetailField(idx, 'editedDiscountB', parseFloat(e.target.value) || 0)}
//                             className="w-16 px-2 py-1 border rounded text-center"
//                           />
//                         </td>
//                         <td className="px-3 py-2">
//                           <input
//                             type="number"
//                             value={d.editedScheme}
//                             onChange={(e) => updateDetailField(idx, 'editedScheme', parseFloat(e.target.value) || 0)}
//                             className="w-16 px-2 py-1 border rounded text-center"
//                           />
//                         </td>
//                         <td className="px-3 py-2 text-right font-medium text-emerald-600">
//                           {formatCurrency(net)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot className="bg-gray-100 font-medium">
//                   <tr>
//                     <td colSpan={3} className="px-3 py-2 text-right">Totals:</td>
//                     <td className="px-3 py-2 text-right">{formatCurrency(totals.totalGross)}</td>
//                     <td colSpan={3}></td>
//                     <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(totals.totalNet)}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}

//           {/* Tab 2: Carriage Info */}
//           {activeTab === 'carriage' && (
//             <div className="max-w-md space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Carriage Account</label>
//                 <select
//                   value={carriageId || ''}
//                   onChange={(e) => setCarriageId(e.target.value ? parseInt(e.target.value) : null)}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   <option value="">Select Carriage Account</option>
//                   {carriageAccounts.map((acc: any) => (
//                     <option key={acc.id} value={acc.id}>{acc.acName}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Carriage Amount</label>
//                 <input
//                   type="number"
//                   value={carriageAmount}
//                   onChange={(e) => setCarriageAmount(parseFloat(e.target.value) || 0)}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//               </div>

//               <div className="bg-gray-100 rounded-lg p-4 mt-6">
//                 <div className="flex justify-between mb-2">
//                   <span>Total Net:</span>
//                   <span className="font-medium">{formatCurrency(totals.totalNet)}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Carriage:</span>
//                   <span className="font-medium text-orange-600">- {formatCurrency(carriageAmount)}</span>
//                 </div>
//                 <div className="flex justify-between border-t pt-2">
//                   <span className="font-medium">Customer Debit:</span>
//                   <span className="font-bold text-emerald-600">{formatCurrency(totals.customerDebit)}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Tab 3: Journal Preview */}
//           {activeTab === 'journal' && (
//             <div className="space-y-4">
//               <h3 className="font-medium text-gray-700">Journal Entry Preview</h3>
//               <table className="w-full text-sm border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-2 text-left border">Line</th>
//                     <th className="px-4 py-2 text-left border">Account</th>
//                     <th className="px-4 py-2 text-left border">Description</th>
//                     <th className="px-4 py-2 text-right border">Debit</th>
//                     <th className="px-4 py-2 text-right border">Credit</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Customer Row */}
//                   <tr className="border-b">
//                     <td className="px-4 py-2 border">1</td>
//                     <td className="px-4 py-2 border font-medium">{gdn?.account?.acName}</td>
//                     <td className="px-4 py-2 border text-gray-600">
//                       S.Inv, {gdn?.order?.sub_city || ''}, {gdn?.order?.sub_customer || ''}
//                     </td>
//                     <td className="px-4 py-2 border text-right text-blue-600 font-medium">
//                       {formatCurrency(totals.customerDebit)}
//                     </td>
//                     <td className="px-4 py-2 border text-right">-</td>
//                   </tr>

//                   {/* Carriage Row */}
//                   {carriageAmount > 0 && carriageId && (
//                     <tr className="border-b">
//                       <td className="px-4 py-2 border">2</td>
//                       <td className="px-4 py-2 border font-medium">
//                         {carriageAccounts.find((c: any) => c.id === carriageId)?.acName || 'Carriage'}
//                       </td>
//                       <td className="px-4 py-2 border text-gray-600">
//                         S.Inv, {gdn?.account?.acName}
//                       </td>
//                       <td className="px-4 py-2 border text-right text-orange-600 font-medium">
//                         {formatCurrency(carriageAmount)}
//                       </td>
//                       <td className="px-4 py-2 border text-right">-</td>
//                     </tr>
//                   )}

//                   {/* Batch Rows */}
//                   {Object.entries(batchTotals).map(([batchId, batch], idx) => (
//                     <tr key={batchId} className="border-b">
//                       <td className="px-4 py-2 border">{carriageAmount > 0 ? idx + 3 : idx + 2}</td>
//                       <td className="px-4 py-2 border font-medium">{batch.batchName}</td>
//                       <td className="px-4 py-2 border text-gray-600">Batch-{batchId}</td>
//                       <td className="px-4 py-2 border text-right">-</td>
//                       <td className="px-4 py-2 border text-right text-green-600 font-medium">
//                         {formatCurrency(batch.amount)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-gray-100 font-medium">
//                   <tr>
//                     <td colSpan={3} className="px-4 py-2 border text-right">Total:</td>
//                     <td className="px-4 py-2 border text-right text-blue-600">
//                       {formatCurrency(totals.totalNet)}
//                     </td>
//                     <td className="px-4 py-2 border text-right text-green-600">
//                       {formatCurrency(totals.totalNet)}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>

//               {/* Balance Check */}
//               <div className={`p-3 rounded-lg flex items-center gap-2 ${
//                 Math.abs(totals.customerDebit + carriageAmount - totals.totalNet) < 0.01
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-red-100 text-red-700'
//               }`}>
//                 <CheckCircle className="w-5 h-5" />
//                 <span>
//                   Debit ({formatCurrency(totals.customerDebit + carriageAmount)}) = 
//                   Credit ({formatCurrency(totals.totalNet)}) 
//                   {Math.abs(totals.customerDebit + carriageAmount - totals.totalNet) < 0.01 ? ' ✓ Balanced' : ' ✗ Not Balanced'}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="border-t px-6 py-4 flex items-center justify-between bg-gray-50">
//           <div className="text-sm text-gray-600">
//             Total Net: <span className="font-bold text-emerald-600">{formatCurrency(totals.totalNet)}</span>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             {activeTab !== 'journal' ? (
//               <button
//                 onClick={() => setActiveTab(activeTab === 'details' ? 'carriage' : 'journal')}
//                 className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
//               >
//                 Next <ChevronRight className="w-4 h-4" />
//               </button>
//             ) : (
//               <button
//                 onClick={() => setShowConfirm(true)}
//                 disabled={posting}
//                 className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
//               >
//                 <Save className="w-4 h-4" />
//                 {posting ? 'Generating...' : mode === 'create' ? 'Generate Voucher' : 'Re-Generate Voucher'}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Confirm Modal */}
//         {showConfirm && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6 max-w-md">
//               <h3 className="text-lg font-bold mb-2">Confirm {mode === 'create' ? 'Generate' : 'Re-Generate'}</h3>
//               <p className="text-gray-600 mb-4">
//                 This will {mode === 'create' ? 'create' : 'update'} the journal entry with:
//               </p>
//               <ul className="text-sm space-y-1 mb-4">
//                 <li>• Customer Debit: {formatCurrency(totals.customerDebit)}</li>
//                 {carriageAmount > 0 && <li>• Carriage Debit: {formatCurrency(carriageAmount)}</li>}
//                 <li>• Total Credit: {formatCurrency(totals.totalNet)}</li>
//               </ul>
//               <div className="flex gap-3 justify-end">
//                 <button
//                   onClick={() => setShowConfirm(false)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
















































































// components/SalesVoucher.tsx

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, Save, ChevronRight, ChevronLeft, Package, Truck, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useGetGDNByIdQuery } from '@/store/slice/gdnApi';
import {
  useUpdateStockMainMutation,
  useUpdateStockDetailMutation,
  usePostVoucherToJournalMutation,
  useGetCarriageAccountsQuery,
} from '@/store/slice/salesVoucherApi';

interface SalesVoucherProps {
  gdnId: number;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
}

export default function SalesVoucher({ gdnId, mode, onClose, onSuccess }: SalesVoucherProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'carriage' | 'journal'>('details');
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [carriageConfirmed, setCarriageConfirmed] = useState(false);

  // Carriage fields
  const [carriage, setCarriage] = useState({
    id: null as number | null,
    labourCrt: 0, freightCrt: 0, biltyExpense: 0, otherExpense: 0, bookedCrt: 0
  });

  // APIs
  const { data: gdnData, isLoading } = useGetGDNByIdQuery(gdnId);
  const { data: carriageData } = useGetCarriageAccountsQuery();
  const [updateMain] = useUpdateStockMainMutation();
  const [updateDetail] = useUpdateStockDetailMutation();
  const [postVoucher, { isLoading: posting }] = usePostVoucherToJournalMutation();

  const gdn = gdnData?.data;
  const carriageAccounts = carriageData?.data || [];

  // Initialize
  useEffect(() => {
    if (gdn?.details) {
      setDetails(gdn.details.map((d: any) => ({
        ...d,
        editedPrice: parseFloat(d.Stock_Price) || 0,
        editedDiscountA: parseFloat(d.Discount_A) || 0,
        editedDiscountB: parseFloat(d.Discount_B) || 0,
        editedDiscountC: parseFloat(d.Discount_C) || 0,
        editedScheme: parseFloat(d.Scheme_Discount) || 0,
      })));
      setCarriage({
        id: gdn.Carriage_ID || null,
        labourCrt: parseFloat(gdn.labour_crt) || 0,
        freightCrt: parseFloat(gdn.freight_crt) || 0,
        biltyExpense: parseFloat(gdn.bility_expense) || 0,
        otherExpense: parseFloat(gdn.other_expense) || 0,
        bookedCrt: parseFloat(gdn.booked_crt) || 0,
      });
    }
  }, [gdn]);

  // Reset confirmation when carriage changes
  useEffect(() => { setCarriageConfirmed(false); }, [carriage]);

  // Calculate carriage amount
  const carriageAmount = useMemo(() => {
    const { labourCrt, freightCrt, biltyExpense, otherExpense, bookedCrt } = carriage;
    return (labourCrt * bookedCrt) + (freightCrt * bookedCrt) + biltyExpense + otherExpense;
  }, [carriage]);

  // Calculate totals
  const { totals, batchTotals } = useMemo(() => {
    let totalGross = 0, totalNet = 0;
    const batches: Record<string, { batchName: string; amount: number }> = {};

    details.forEach(d => {
      const qty = parseFloat(d.Stock_out_SKU_UOM_Qty) || 0;
      const gross = qty * (d.editedPrice || 0);
      const afterA = gross - (gross * (d.editedDiscountA || 0) / 100);
      const afterB = afterA - (afterA * (d.editedDiscountB || 0) / 100);
      const net = afterB - (afterB * (d.editedDiscountC || 0) / 100);

      totalGross += gross;
      totalNet += net;

      const batchId = d.batchno || 'unknown';
      if (!batches[batchId]) batches[batchId] = { batchName: d.batchDetails?.acName || `Batch-${batchId}`, amount: 0 };
      batches[batchId].amount += net;
    });

    // ✅ If carriage ID selected, minus carriage from customer
    const customerDebit = carriage.id ? totalNet - carriageAmount : totalNet;

    return { totals: { totalGross, totalNet, customerDebit, carriageAmount: carriage.id ? carriageAmount : 0 }, batchTotals: batches };
  }, [details, carriage.id, carriageAmount]);

  // ✅ Validation: Only checkbox is compulsory
  const canGenerate = carriageConfirmed;

  // Submit
  const handleSubmit = async () => {
    setShowConfirm(false);
    setMessage(null);
    try {
      await Promise.all(details.map(d => updateDetail({
        id: d.ID,
        data: { Stock_Price: d.editedPrice, Discount_A: d.editedDiscountA, Discount_B: d.editedDiscountB, Discount_C: d.editedDiscountC, Scheme_Discount: d.editedScheme }
      }).unwrap()));

      await updateMain({
        id: gdnId,
        data: {
          is_Voucher_Generated: true, Status: 'Post',
          Carriage_ID: carriage.id, Carriage_Amount: totals.carriageAmount,
          labour_crt: carriage.labourCrt, freight_crt: carriage.freightCrt,
          bility_expense: carriage.biltyExpense, other_expense: carriage.otherExpense, booked_crt: carriage.bookedCrt,
        }
      }).unwrap();

      await postVoucher({
        stockMainId: gdnId, mode,
        calculatedTotals: { totalNet: totals.totalNet, carriageAmount: totals.carriageAmount, customerDebit: totals.customerDebit, batchTotals }
      }).unwrap();

      setMessage({ type: 'success', text: 'Voucher generated successfully!' });
      setTimeout(onSuccess, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.data?.error || 'Failed to generate voucher' });
    }
  };

  const fmt = (n: number) => n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const updateCarriage = (field: string, value: any) => setCarriage(prev => ({ ...prev, [field]: value }));

  if (isLoading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div></div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex justify-between">
          <div>
            <h2 className="text-xl font-bold">{mode === 'create' ? 'Generate' : 'Re-Generate'} Sales Voucher</h2>
            <p className="text-emerald-100 text-sm">GDN: {gdn?.Number} | Customer: {gdn?.account?.acName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded"><X className="w-5 h-5" /></button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b px-6">
          {[{ id: 'details', label: 'Stock Details', icon: Package }, { id: 'carriage', label: 'Carriage Info', icon: Truck }, { id: 'journal', label: 'Journal Preview', icon: FileText }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 border-b-2 ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-center">Qty</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 text-right">Gross</th>
                  <th className="px-3 py-2 text-center">Dis%</th>
                  <th className="px-3 py-2 text-center">Dis2%</th>
                  <th className="px-3 py-2 text-center">Sch%</th>
                  <th className="px-3 py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, i) => {
                  const qty = parseFloat(d.Stock_out_SKU_UOM_Qty) || 0;
                  const gross = qty * d.editedPrice;
                  const afterA = gross - (gross * d.editedDiscountA / 100);
                  const afterB = afterA - (afterA * d.editedDiscountB / 100);
                  const net = afterB - (afterB * d.editedDiscountC / 100);
                  return (
                    <tr key={d.ID} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{d.item?.itemName || '-'}</td>
                      <td className="px-3 py-2 text-center">{qty}</td>
                      <td className="px-3 py-2"><input type="number" value={d.editedPrice} onChange={e => setDetails(p => p.map((x, j) => j === i ? { ...x, editedPrice: parseFloat(e.target.value) || 0 } : x))} className="w-24 px-2 py-1 border rounded text-right" /></td>
                      <td className="px-3 py-2 text-right">{fmt(gross)}</td>
                      <td className="px-3 py-2"><input type="number" value={d.editedDiscountA} onChange={e => setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountA: parseFloat(e.target.value) || 0 } : x))} className="w-16 px-2 py-1 border rounded text-center" /></td>
                      <td className="px-3 py-2"><input type="number" value={d.editedDiscountB} onChange={e => setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountB: parseFloat(e.target.value) || 0 } : x))} className="w-16 px-2 py-1 border rounded text-center" /></td>
                      <td className="px-3 py-2"><input type="number" value={d.editedScheme} onChange={e => setDetails(p => p.map((x, j) => j === i ? { ...x, editedScheme: parseFloat(e.target.value) || 0 } : x))} className="w-16 px-2 py-1 border rounded text-center" /></td>
                      <td className="px-3 py-2 text-right font-medium text-emerald-600">{fmt(net)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-100 font-medium">
                <tr><td colSpan={3} className="px-3 py-2 text-right">Totals:</td><td className="px-3 py-2 text-right">{fmt(totals.totalGross)}</td><td colSpan={3}></td><td className="px-3 py-2 text-right text-emerald-600">{fmt(totals.totalNet)}</td></tr>
              </tfoot>
            </table>
          )}

          {/* Tab 2: Carriage */}
          {activeTab === 'carriage' && (
            <div className="max-w-xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carriage Account (Optional)</label>
                <select value={carriage.id || ''} onChange={e => updateCarriage('id', e.target.value ? parseInt(e.target.value) : null)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">No Carriage</option>
                  {carriageAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.acName}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-600 mb-1">Booked Crt</label><input type="number" value={carriage.bookedCrt} onChange={e => updateCarriage('bookedCrt', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div></div>
                <div><label className="block text-sm text-gray-600 mb-1">Labour/Crt</label><input type="number" value={carriage.labourCrt} onChange={e => updateCarriage('labourCrt', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="flex items-end"><span className="w-full px-3 py-2 bg-gray-100 rounded-lg text-right">= Rs {fmt(carriage.labourCrt * carriage.bookedCrt)}</span></div>
                <div><label className="block text-sm text-gray-600 mb-1">Freight/Crt</label><input type="number" value={carriage.freightCrt} onChange={e => updateCarriage('freightCrt', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="flex items-end"><span className="w-full px-3 py-2 bg-gray-100 rounded-lg text-right">= Rs {fmt(carriage.freightCrt * carriage.bookedCrt)}</span></div>
                <div><label className="block text-sm text-gray-600 mb-1">Bilty Expense</label><input type="number" value={carriage.biltyExpense} onChange={e => updateCarriage('biltyExpense', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="flex items-end"><span className="w-full px-3 py-2 bg-gray-100 rounded-lg text-right">= Rs {fmt(carriage.biltyExpense)}</span></div>
                <div><label className="block text-sm text-gray-600 mb-1">Other Expense</label><input type="number" value={carriage.otherExpense} onChange={e => updateCarriage('otherExpense', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="flex items-end"><span className="w-full px-3 py-2 bg-gray-100 rounded-lg text-right">= Rs {fmt(carriage.otherExpense)}</span></div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex justify-between">
                <span className="font-medium text-orange-800">Total Carriage:</span>
                <span className="text-xl font-bold text-orange-600">Rs {fmt(carriageAmount)}</span>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                <div className="flex justify-between"><span>Total Net:</span><span className="font-medium">{fmt(totals.totalNet)}</span></div>
                {carriage.id && <div className="flex justify-between text-orange-600"><span>Carriage:</span><span>- {fmt(totals.carriageAmount)}</span></div>}
                <div className="flex justify-between border-t pt-2"><span className="font-medium">Customer Debit:</span><span className="font-bold text-emerald-600">{fmt(totals.customerDebit)}</span></div>
              </div>

              {/* ✅ Compulsory Checkbox */}
              <div className={`p-4 rounded-lg border-2 ${carriageConfirmed ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={carriageConfirmed} onChange={e => setCarriageConfirmed(e.target.checked)} className="w-5 h-5 rounded text-emerald-600" />
                  <span className={`font-medium ${carriageConfirmed ? 'text-green-700' : 'text-amber-700'}`}>
                    {carriageConfirmed ? '✓ Details confirmed' : '⚠️ Please confirm details to proceed'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Tab 3: Journal */}
          {activeTab === 'journal' && (
            <div className="space-y-4">
              {!carriageConfirmed && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-amber-700"><AlertCircle className="w-5 h-5" />Please confirm carriage details first</div>}

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr><th className="px-4 py-2 text-left border">Line</th><th className="px-4 py-2 text-left border">Account</th><th className="px-4 py-2 text-left border">Description</th><th className="px-4 py-2 text-right border">Debit</th><th className="px-4 py-2 text-right border">Credit</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="px-4 py-2 border">1</td><td className="px-4 py-2 border font-medium">{gdn?.account?.acName}</td><td className="px-4 py-2 border text-gray-600">S.Inv, {gdn?.order?.sub_city}, {gdn?.order?.sub_customer}</td><td className="px-4 py-2 border text-right text-blue-600 font-medium">{fmt(totals.customerDebit)}</td><td className="px-4 py-2 border">-</td></tr>
                  {carriage.id && totals.carriageAmount > 0 && (
                    <tr className="border-b bg-orange-50"><td className="px-4 py-2 border">2</td><td className="px-4 py-2 border font-medium">{carriageAccounts.find((c: any) => c.id === carriage.id)?.acName}</td><td className="px-4 py-2 border text-gray-600">S.Inv, {gdn?.account?.acName}</td><td className="px-4 py-2 border text-right text-orange-600 font-medium">{fmt(totals.carriageAmount)}</td><td className="px-4 py-2 border">-</td></tr>
                  )}
                  {Object.entries(batchTotals).map(([id, b], i) => (
                    <tr key={id} className="border-b"><td className="px-4 py-2 border">{carriage.id && totals.carriageAmount > 0 ? i + 3 : i + 2}</td><td className="px-4 py-2 border font-medium">{b.batchName}</td><td className="px-4 py-2 border text-gray-600">Batch-{id}</td><td className="px-4 py-2 border">-</td><td className="px-4 py-2 border text-right text-green-600 font-medium">{fmt(b.amount)}</td></tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-medium">
                  <tr><td colSpan={3} className="px-4 py-2 border text-right">Total:</td><td className="px-4 py-2 border text-right text-blue-600">{fmt(totals.customerDebit + totals.carriageAmount)}</td><td className="px-4 py-2 border text-right text-green-600">{fmt(totals.totalNet)}</td></tr>
                </tfoot>
              </table>

              <div className="p-3 rounded-lg bg-green-100 text-green-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Debit ({fmt(totals.customerDebit + totals.carriageAmount)}) = Credit ({fmt(totals.totalNet)}) ✓ Balanced
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between bg-gray-50">
          <div className="text-sm">Total: <span className="font-bold text-emerald-600">{fmt(totals.totalNet)}</span>{carriage.id && <span className="ml-3">Customer: <span className="font-bold text-blue-600">{fmt(totals.customerDebit)}</span></span>}</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
            {activeTab === 'details' && <button onClick={() => setActiveTab('carriage')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></button>}
            {activeTab === 'carriage' && (
              <>
                <button onClick={() => setActiveTab('details')} className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => setActiveTab('journal')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></button>
              </>
            )}
            {activeTab === 'journal' && (
              <>
                <button onClick={() => setActiveTab('carriage')} className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => setShowConfirm(true)} disabled={posting || !canGenerate} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${canGenerate ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                  <Save className="w-4 h-4" />{posting ? 'Generating...' : mode === 'create' ? 'Generate' : 'Re-Generate'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-bold mb-2">Confirm</h3>
              <ul className="text-sm space-y-1 mb-4">
                <li>• Customer Debit: Rs {fmt(totals.customerDebit)}</li>
                {carriage.id && totals.carriageAmount > 0 && <li>• Carriage Debit: Rs {fmt(totals.carriageAmount)}</li>}
                <li>• Total Credit: Rs {fmt(totals.totalNet)}</li>
              </ul>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSubmit} disabled={posting} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">{posting ? 'Processing...' : 'Confirm'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
