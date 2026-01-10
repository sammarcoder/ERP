//wokring perfect just needs to include the tabs



// // components/SalesVoucher.tsx
// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   X, FileText, Calendar, User, MapPin, Package, Truck,
//   Save, RefreshCw, AlertCircle, CheckCircle
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

// interface EditableDetail {
//   ID: number;
//   Item_ID: number;
//   itemName: string;
//   batchName: string;
//   uom1_qty: number;
//   uom2_qty: number;
//   uom3_qty: number;
//   uom1Name: string;
//   uom2Name: string;
//   uom3Name: string;
//   editedPrice: number;
//   editedDiscountA: number;
//   editedDiscountB: number;
//   editedDiscountC: number;
// }

// export default function SalesVoucher({ gdnId, mode, onClose, onSuccess }: Props) {
//   // ═══════════════════════════════════════════════════════════════
//   // STATE
//   // ═══════════════════════════════════════════════════════════════
//   const [details, setDetails] = useState<EditableDetail[]>([]);
//   const [carriageId, setCarriageId] = useState<number | null>(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   // ═══════════════════════════════════════════════════════════════
//   // RTK QUERY
//   // ═══════════════════════════════════════════════════════════════
//   const { data: gdnRes, isLoading: loadingGDN } = useGetGDNByIdQuery(gdnId);
//   const { data: carriageRes } = useGetCarriageAccountsQuery();

//   const [updateDetail, { isLoading: updatingDetail }] = useUpdateStockDetailMutation();
//   const [updateMain, { isLoading: updatingMain }] = useUpdateStockMainMutation();
//   const [postVoucher, { isLoading: posting }] = usePostVoucherToJournalMutation();

//   const gdn = gdnRes?.data;
//   const carriageAccounts = carriageRes?.data || [];
//   const isSubmitting = updatingDetail || updatingMain || posting;

//   // ═══════════════════════════════════════════════════════════════
//   // INITIALIZE DATA
//   // ═══════════════════════════════════════════════════════════════
//   useEffect(() => {
//     if (gdn?.details) {
//       const mapped = gdn.details.map((d: any) => ({
//         ID: d.ID,
//         Item_ID: d.Item_ID,
//         itemName: d.item?.itemName || '-',
//         batchName: d.batchDetails?.acName || '-',
//         uom1_qty: parseFloat(d.uom1_qty) || 0,
//         uom2_qty: parseFloat(d.uom2_qty) || 0,
//         uom3_qty: parseFloat(d.uom3_qty) || 0,
//         uom1Name: d.item?.uom1?.uom || 'Pcs',
//         uom2Name: d.item?.uomTwo?.uom || 'Box',
//         uom3Name: d.item?.uomThree?.uom || 'Crt',
//         editedPrice: parseFloat(d.Stock_Price) || 0,
//         editedDiscountA: parseFloat(d.Discount_A) || 0,
//         editedDiscountB: parseFloat(d.Discount_B) || 0,
//         editedDiscountC: parseFloat(d.Discount_C) || 0,
//       }));
//       setDetails(mapped);
//       setCarriageId(gdn.Carriage_ID || null);
//     }
//   }, [gdn]);

//   // ═══════════════════════════════════════════════════════════════
//   // CALCULATIONS
//   // ═══════════════════════════════════════════════════════════════
//   const carriageAmount = useMemo(() => {
//     if (!gdn || !carriageId) return 0;

//     const labour = parseFloat(gdn.labour_crt || 0);
//     const freight = parseFloat(gdn.freight_crt || 0);
//     const bility = parseFloat(gdn.bility_expense || 0);
//     const other = parseFloat(gdn.other_expense || 0);
//     const booked = parseFloat(gdn.booked_crt || 0);

//     return (labour * booked) + (freight * booked) + bility + other;
//   }, [gdn, carriageId]);

//   const calculateGross = (d: EditableDetail) => d.uom2_qty * d.editedPrice;

//   const calculateNet = (d: EditableDetail) => {
//     const gross = calculateGross(d);
//     const afterA = gross - (gross * d.editedDiscountA / 100);
//     const afterB = afterA - (afterA * d.editedDiscountB / 100);
//     const afterC = afterB - (afterB * d.editedDiscountC / 100);
//     return afterC;
//   };

//   const totals = useMemo(() => {
//     const totalGross = details.reduce((sum, d) => sum + calculateGross(d), 0);
//     const totalNet = details.reduce((sum, d) => sum + calculateNet(d), 0);
//     return { totalGross, totalNet, carriageAmount, grandTotal: totalNet + carriageAmount };
//   }, [details, carriageAmount]);

//   // ═══════════════════════════════════════════════════════════════
//   // HANDLERS
//   // ═══════════════════════════════════════════════════════════════
//   const handleFieldChange = (id: number, field: string, value: number) => {
//     setDetails(prev => prev.map(d => d.ID === id ? { ...d, [field]: value } : d));
//   };

//   const handleSubmit = async () => {
//     setShowConfirm(false);
//     setMessage(null);

//     try {
//       // Step 1: Update details
//       await Promise.all(details.map(d =>
//         updateDetail({
//           id: d.ID,
//           data: {
//             Stock_Price: d.editedPrice,
//             Discount_A: d.editedDiscountA,
//             Discount_B: d.editedDiscountB,
//             Discount_C: d.editedDiscountC,
//           }
//         }).unwrap()
//       ));

//       // Step 2: Update main
//       await updateMain({
//         id: gdnId,
//         data: {
//           is_Voucher_Generated: true,
//           Status: 'Post',
//           Carriage_ID: carriageId,
//           Carriage_Amount: carriageAmount,
//         }
//       }).unwrap();

//       // Step 3: Post journal
//       await postVoucher({ stockMainId: gdnId, mode }).unwrap();

//       setMessage({ type: 'success', text: 'Voucher generated successfully!' });
//       setTimeout(onSuccess, 1500);

//     } catch (err: any) {
//       setMessage({ type: 'error', text: err.data?.error || 'Failed to generate voucher' });
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // LOADING
//   // ═══════════════════════════════════════════════════════════════
//   if (loadingGDN) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-8 text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
//           <p className="mt-2">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!gdn) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-8 text-center">
//           <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
//           <p className="mt-2">Failed to load GDN</p>
//           <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">

//         {/* Header */}
//         <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <FileText className="w-6 h-6 text-white" />
//             <div>
//               <h2 className="text-xl font-bold text-white">
//                 Sales Voucher {mode === 'edit' && '(Re-Generate)'}
//               </h2>
//               <p className="text-emerald-100 text-sm">{gdn.Number}</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
//             <X className="w-5 h-5 text-white" />
//           </button>
//         </div>

//         {/* Message */}
//         {message && (
//           <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${
//             message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
//           }`}>
//             {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             {message.text}
//           </div>
//         )}

//         {/* Header Info */}
//         <div className="px-6 py-4 bg-gray-50 border-b grid grid-cols-4 gap-4">
//           <div className="text-center">
//             <p className="text-xs text-gray-400 uppercase">GDN #</p>
//             <p className="font-bold">{gdn.Number}</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs text-gray-400 uppercase">Date</p>
//             <p className="font-bold">{new Date(gdn.Date).toLocaleDateString('en-GB')}</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs text-gray-400 uppercase">Customer</p>
//             <p className="font-bold">{gdn.account?.acName || '-'}</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs text-gray-400 uppercase">Items</p>
//             <p className="font-bold">{details.length}</p>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-auto p-6">
//           <div className="flex gap-6">

//             {/* Table */}
//             <div className="flex-1 border rounded-xl overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-3 py-2 text-left">#</th>
//                     <th className="px-3 py-2 text-left">Item</th>
//                     <th className="px-3 py-2 text-right">Price</th>
//                     <th className="px-3 py-2 text-right">UOM2 Qty</th>
//                     <th className="px-3 py-2 text-center">D.A%</th>
//                     <th className="px-3 py-2 text-center">D.B%</th>
//                     <th className="px-3 py-2 text-center">D.C%</th>
//                     <th className="px-3 py-2 text-right">Gross</th>
//                     <th className="px-3 py-2 text-right">Net</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {details.map((d, i) => (
//                     <tr key={d.ID} className="hover:bg-gray-50">
//                       <td className="px-3 py-2">{i + 1}</td>
//                       <td className="px-3 py-2 font-medium">{d.itemName}</td>
//                       <td className="px-3 py-2">
//                         <input
//                           type="number"
//                           value={d.editedPrice}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedPrice', parseFloat(e.target.value) || 0)}
//                           className="w-20 px-2 py-1 text-right border rounded"
//                         />
//                       </td>
//                       <td className="px-3 py-2 text-right">{d.uom2_qty} {d.uom2Name}</td>
//                       <td className="px-3 py-2">
//                         <input
//                           type="number"
//                           value={d.editedDiscountA}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedDiscountA', parseFloat(e.target.value) || 0)}
//                           className="w-14 px-2 py-1 text-center border rounded"
//                         />
//                       </td>
//                       <td className="px-3 py-2">
//                         <input
//                           type="number"
//                           value={d.editedDiscountB}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedDiscountB', parseFloat(e.target.value) || 0)}
//                           className="w-14 px-2 py-1 text-center border rounded"
//                         />
//                       </td>
//                       <td className="px-3 py-2">
//                         <input
//                           type="number"
//                           value={d.editedDiscountC}
//                           onChange={(e) => handleFieldChange(d.ID, 'editedDiscountC', parseFloat(e.target.value) || 0)}
//                           className="w-14 px-2 py-1 text-center border rounded"
//                         />
//                       </td>
//                       <td className="px-3 py-2 text-right">{calculateGross(d).toLocaleString()}</td>
//                       <td className="px-3 py-2 text-right font-bold text-emerald-600">{calculateNet(d).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Summary */}
//             <div className="w-72 space-y-4">
//               {/* Carriage */}
//               <div className="bg-gray-50 rounded-xl p-4 border">
//                 <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
//                   <Truck className="w-4 h-4" /> Carriage
//                 </h4>
//                 <select
//                   value={carriageId || ''}
//                   onChange={(e) => setCarriageId(e.target.value ? parseInt(e.target.value) : null)}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   <option value="">-- No Carriage --</option>
//                   {carriageAccounts.map((acc: any) => (
//                     <option key={acc.id} value={acc.id}>{acc.acName}</option>
//                   ))}
//                 </select>
//                 {carriageId && (
//                   <p className="mt-2 text-right font-bold text-emerald-600">
//                     Rs. {carriageAmount.toLocaleString()}
//                   </p>
//                 )}
//               </div>

//               {/* Totals */}
//               <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
//                 <h4 className="text-sm font-semibold text-emerald-700 mb-3">Summary</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Total Gross:</span>
//                     <span>{totals.totalGross.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Total Net:</span>
//                     <span>{totals.totalNet.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Carriage:</span>
//                     <span>{totals.carriageAmount.toLocaleString()}</span>
//                   </div>
//                   <div className="border-t pt-2 flex justify-between font-bold text-emerald-800">
//                     <span>Grand Total:</span>
//                     <span className="text-lg">{totals.grandTotal.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
//           <button onClick={onClose} className="px-4 py-2 bg-white border rounded-lg">
//             Cancel
//           </button>
//           <button
//             onClick={() => setShowConfirm(true)}
//             disabled={isSubmitting}
//             className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
//           >
//             {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//             {mode === 'edit' ? 'Re-Generate' : 'Generate'} Voucher
//           </button>
//         </div>
//       </div>

//       {/* Confirmation */}
//       {showConfirm && (
//         <ConfirmationModal
//           isOpen={showConfirm}
//           title={mode === 'edit' ? 'Re-Generate Voucher?' : 'Generate Voucher?'}
//           message={`This will ${mode === 'edit' ? 'update' : 'create'} journal entry for ${gdn.Number}`}
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
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X, FileText, Save, RefreshCw, AlertCircle, CheckCircle,
  Package, Truck, BookOpen
} from 'lucide-react';

import { useGetGDNByIdQuery } from '@/store/slice/gdnApi';
import {
  useUpdateStockDetailMutation,
  useUpdateStockMainMutation,
  usePostVoucherToJournalMutation,
  useGetCarriageAccountsQuery
} from '@/store/slice/salesVoucherApi';

import { ConfirmationModal } from '@/components/common/ConfirmationModal';

interface Props {
  gdnId: number;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
}

type TabType = 'stock' | 'carriage' | 'journal';

export default function SalesVoucher({ gdnId, mode, onClose, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('stock');
  const [details, setDetails] = useState<any[]>([]);
  const [carriageId, setCarriageId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: gdnRes, isLoading: loadingGDN } = useGetGDNByIdQuery(gdnId);
  const { data: carriageRes } = useGetCarriageAccountsQuery();

  const [updateDetail, { isLoading: updatingDetail }] = useUpdateStockDetailMutation();
  const [updateMain, { isLoading: updatingMain }] = useUpdateStockMainMutation();
  const [postVoucher, { isLoading: posting }] = usePostVoucherToJournalMutation();

  const gdn = gdnRes?.data;
  const carriageAccounts = carriageRes?.data || [];
  const isSubmitting = updatingDetail || updatingMain || posting;

  useEffect(() => {
    if (gdn?.details) {
      const mapped = gdn.details.map((d: any) => ({
        ID: d.ID,
        Item_ID: d.Item_ID,
        Batch_ID: d.Batch_ID,
        itemName: d.item?.itemName || '-',
        batchName: d.batchDetails?.acName || '-',
        uom2_qty: parseFloat(d.uom2_qty) || 0,
        uom3_qty: parseFloat(d.uom3_qty) || 0,
        uom2Name: d.item?.uomTwo?.uom || 'Box',
        uom3Name: d.item?.uomThree?.uom || 'Crt',
        editedPrice: parseFloat(d.Stock_Price) || 0,
        editedDiscountA: parseFloat(d.Discount_A) || 0,
        editedDiscountB: parseFloat(d.Discount_B) || 0,
        editedDiscountC: parseFloat(d.Discount_C) || 0,
        editedScheme: parseFloat(d.Scheme_Discount) || 0,
      }));
      setDetails(mapped);
      setCarriageId(gdn.Carriage_ID || null);
    }
  }, [gdn]);

  const calculateGross = (d: any) => d.uom2_qty * d.editedPrice;

  const calculateNet = (d: any) => {
    const gross = calculateGross(d);
    const afterA = gross - (gross * d.editedDiscountA / 100);
    const afterB = afterA - (afterA * d.editedDiscountB / 100);
    const afterC = afterB - (afterB * d.editedDiscountC / 100);
    return afterC - (afterC * d.editedScheme / 100);
  };

  const carriageAmount = useMemo(() => {
    if (!gdn || !carriageId) return 0;
    const labour = parseFloat(gdn.labour_crt || 0);
    const freight = parseFloat(gdn.freight_crt || 0);
    const bility = parseFloat(gdn.bility_expense || 0);
    const other = parseFloat(gdn.other_expense || 0);
    const booked = parseFloat(gdn.booked_crt || 0);
    return (labour * booked) + (freight * booked) + bility + other;
  }, [gdn, carriageId]);

  const totals = useMemo(() => {
    const totalCrt = details.reduce((sum, d) => sum + d.uom3_qty, 0);
    const totalBox = details.reduce((sum, d) => sum + d.uom2_qty, 0);
    const totalGross = details.reduce((sum, d) => sum + calculateGross(d), 0);
    const totalNet = details.reduce((sum, d) => sum + calculateNet(d), 0);
    const customerDebit = totalNet - carriageAmount;
    return { totalCrt, totalBox, totalGross, totalNet, carriageAmount, customerDebit };
  }, [details, carriageAmount]);

  const batchTotals = useMemo(() => {
    const grouped: Record<number, { batchName: string; amount: number }> = {};
    details.forEach(d => {
      if (!grouped[d.Batch_ID]) {
        grouped[d.Batch_ID] = { batchName: d.batchName, amount: 0 };
      }
      grouped[d.Batch_ID].amount += calculateNet(d);
    });
    return grouped;
  }, [details]);

  const handleFieldChange = (id: number, field: string, value: number) => {
    setDetails(prev => prev.map(d => d.ID === id ? { ...d, [field]: value } : d));
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setMessage(null);

    try {
      await Promise.all(details.map(d =>
        updateDetail({
          id: d.ID,
          data: {
            Stock_Price: d.editedPrice,
            Discount_A: d.editedDiscountA,
            Discount_B: d.editedDiscountB,
            Discount_C: d.editedDiscountC,
            Scheme_Discount: d.editedScheme,
          }
        }).unwrap()
      ));

      await updateMain({
        id: gdnId,
        data: {
          is_Voucher_Generated: true,
          Status: 'Post',
          Carriage_ID: carriageId,
          Carriage_Amount: carriageAmount,
        }
      }).unwrap();

      await postVoucher({ stockMainId: gdnId, mode }).unwrap();

      setMessage({ type: 'success', text: 'Voucher generated successfully!' });
      setTimeout(onSuccess, 1500);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.data?.error || 'Failed to generate voucher' });
    }
  };

  if (loadingGDN) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!gdn) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="mt-3">Failed to load GDN</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-100 rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[96vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-lg font-semibold text-white">
              Sales Voucher {mode === 'edit' && '(Re-Generate)'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Info Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-8 text-sm">
          <div><span className="text-gray-400">GDN:</span> <span className="font-semibold">{gdn.Number}</span></div>
          <div><span className="text-gray-400">Date:</span> <span className="font-semibold">{new Date(gdn.Date).toLocaleDateString('en-GB')}</span></div>
          <div><span className="text-gray-400">Customer:</span> <span className="font-semibold">{gdn.account?.acName || '-'}</span></div>
          <div><span className="text-gray-400">Items:</span> <span className="font-semibold text-emerald-600">{details.length}</span></div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-1 border-b">
          {[
            { key: 'stock', label: 'Stock Details', icon: Package },
            { key: 'carriage', label: 'Carriage', icon: Truck },
            { key: 'journal', label: 'Journal', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t transition-all ${
                activeTab === tab.key
                  ? 'bg-white border-t border-x text-emerald-700 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: Stock Details */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'stock' && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium">#</th>
                    <th className="px-3 py-3 text-left font-medium">Item</th>
                    <th className="px-3 py-3 text-left font-medium">Batch</th>
                    <th className="px-3 py-3 text-center font-medium">Crt</th>
                    <th className="px-3 py-3 text-center font-medium">Box</th>
                    <th className="px-3 py-3 text-center font-medium">Price</th>
                    <th className="px-3 py-3 text-center font-medium">Dis A%</th>
                    <th className="px-3 py-3 text-center font-medium">Dis B%</th>
                    <th className="px-3 py-3 text-center font-medium">Dis C%</th>
                    {/* <th className="px-3 py-3 text-center font-medium">Sch%</th> */}
                    <th className="px-3 py-3 text-right font-medium">Gross</th>
                    <th className="px-3 py-3 text-right font-medium">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {details.map((d, i) => (
                    <tr key={d.ID} className="hover:bg-gray-50/50">
                      <td className="px-3 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-3 py-3 font-medium text-gray-800">{d.itemName}</td>
                      <td className="px-3 py-3 text-gray-500">{d.batchName}</td>
                      <td className="px-3 py-3 text-center">{d.uom3_qty}</td>
                      <td className="px-3 py-3 text-center">{d.uom2_qty}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={d.editedPrice}
                            onChange={(e) => handleFieldChange(d.ID, 'editedPrice', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
                          />
                          <span className="text-gray-400">/{d.uom2Name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          value={d.editedDiscountA}
                          onChange={(e) => handleFieldChange(d.ID, 'editedDiscountA', parseFloat(e.target.value) || 0)}
                          className="w-14 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          value={d.editedDiscountB}
                          onChange={(e) => handleFieldChange(d.ID, 'editedDiscountB', parseFloat(e.target.value) || 0)}
                          className="w-14 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          value={d.editedDiscountC}
                          onChange={(e) => handleFieldChange(d.ID, 'editedDiscountC', parseFloat(e.target.value) || 0)}
                          className="w-14 px-2 py-1.5 text-right border rounded focus:border-emerald-400 outline-none"
                        />
                      </td>
                      {/* <td className="px-3 py-3">
                        <input
                          type="number"
                          value={d.editedScheme}
                          onChange={(e) => handleFieldChange(d.ID, 'editedScheme', parseFloat(e.target.value) || 0)}
                          className="w-14 px-2 py-1.5 text-center border rounded focus:border-emerald-400 outline-none"
                        />
                      </td> */}
                      <td className="px-3 py-3 text-right text-gray-600">
                        {calculateGross(d).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-emerald-600">
                        {calculateNet(d).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals Row */}
                <tfoot className="bg-emerald-50 border-t-2 border-emerald-200">
                  <tr className="font-semibold text-emerald-800">
                    <td colSpan={3} className="px-3 py-3 text-right">TOTAL</td>
                    <td className="px-3 py-3 text-center">{totals.totalCrt}</td>
                    <td className="px-3 py-3 text-center">{totals.totalBox}</td>
                    <td colSpan={4}></td>
                    <td className="px-3 py-3 text-right">
                      {totals.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 text-right text-emerald-700">
                      {totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 2: Carriage Info */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'carriage' && (
            <div className="max-w-md mx-auto space-y-4">
              {/* Account Select */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Carriage Account</label>
                <select
                  value={carriageId || ''}
                  onChange={(e) => setCarriageId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border rounded-lg focus:border-emerald-400 outline-none"
                >
                  <option value="">-- No Carriage --</option>
                  {carriageAccounts.map((acc: any) => (
                    <option key={acc.id} value={acc.id}>{acc.acName}</option>
                  ))}
                </select>
              </div>

              {/* Breakdown */}
              {carriageId && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2.5 text-gray-500">Labour /Crt</td>
                        <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.labour_crt || 0).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-gray-500">Freight /Crt</td>
                        <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.freight_crt || 0).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-gray-500">Bility Expense</td>
                        <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.bility_expense || 0).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-gray-500">Other Expense</td>
                        <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.other_expense || 0).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-gray-500">Booked Crt</td>
                        <td className="px-4 py-2.5 text-right font-medium">{parseFloat(gdn.booked_crt || 0).toLocaleString()}</td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td className="px-4 py-2.5 font-semibold text-emerald-700">Total Carriage</td>
                        <td className="px-4 py-2.5 text-right font-bold text-emerald-700">
                          {carriageAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {!carriageId && (
                <p className="text-center text-gray-400 py-8">Select account to view breakdown</p>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* TAB 3: Journal Preview */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'journal' && (
            <div className="space-y-4">
              {/* Master Info */}
              <div className="flex gap-8 text-sm text-gray-600 pb-3 border-b">
                <div><span className="text-gray-400">Voucher:</span> SV-{'{auto}'}</div>
                <div><span className="text-gray-400">Type:</span> 12 (Sales)</div>
                <div><span className="text-gray-400">Status:</span> <span className="text-amber-600">UnPost</span></div>
              </div>

              {/* Details Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-500">
                      <th className="px-4 py-2.5 text-left font-medium w-12">#</th>
                      <th className="px-4 py-2.5 text-left font-medium">Account</th>
                      <th className="px-4 py-2.5 text-left font-medium">Description</th>
                      <th className="px-4 py-2.5 text-right font-medium w-32">Debit</th>
                      <th className="px-4 py-2.5 text-right font-medium w-32">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {/* Customer */}
                    <tr>
                      <td className="px-4 py-2.5 text-gray-400">1</td>
                      <td className="px-4 py-2.5 font-medium">{gdn.account?.acName || 'Customer'}</td>
                      <td className="px-4 py-2.5 text-gray-500">
                        S.Inv{gdn.order?.sub_city && `, ${gdn.order.sub_city}`}{gdn.order?.sub_customer && `, ${gdn.order.sub_customer}`}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium">
                        {totals.customerDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-300">-</td>
                    </tr>

                    {/* Carriage */}
                    {carriageId && carriageAmount > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-gray-400">2</td>
                        <td className="px-4 py-2.5 font-medium">
                          {carriageAccounts.find((a: any) => a.id === carriageId)?.acName || 'Carriage'}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500">
                          S.Inv{gdn.account?.acName && `, ${gdn.account.acName}`}
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium">
                          {carriageAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-300">-</td>
                      </tr>
                    )}

                    {/* Batches */}
                    {Object.entries(batchTotals).map(([batchId, batchData], idx) => (
                      <tr key={batchId}>
                        <td className="px-4 py-2.5 text-gray-400">
                          {carriageId && carriageAmount > 0 ? idx + 3 : idx + 2}
                        </td>
                        <td className="px-4 py-2.5 font-medium">{batchData.batchName}</td>
                        <td className="px-4 py-2.5 text-gray-500">{batchData.batchName}</td>
                        <td className="px-4 py-2.5 text-right text-gray-300">-</td>
                        <td className="px-4 py-2.5 text-right font-medium">
                          {batchData.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t">
                    <tr className="font-semibold">
                      <td colSpan={3} className="px-4 py-2.5 text-right">TOTAL</td>
                      <td className="px-4 py-2.5 text-right">
                        {(totals.customerDebit + (carriageId ? carriageAmount : 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Balance Check */}
              {(() => {
                const totalDebit = totals.customerDebit + (carriageId ? carriageAmount : 0);
                const isBalanced = totalDebit.toFixed(2) === totals.totalNet.toFixed(2);
                return (
                  <div className={`px-4 py-2.5 rounded flex justify-between text-sm ${isBalanced ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    <span>Balance Check</span>
                    <span className="font-semibold">{isBalanced ? '✓ Balanced' : '✗ Not Balanced'}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-400">Total Net:</span>
            <span className="ml-2 font-bold text-lg text-emerald-700">
              Rs. {totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {mode === 'edit' ? 'Re-Generate' : 'Generate'}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmationModal
          isOpen={showConfirm}
          title={mode === 'edit' ? 'Re-Generate?' : 'Generate?'}
          message={`Create journal entry for ${gdn.Number}`}
          confirmText={mode === 'edit' ? 'Re-Generate' : 'Generate'}
          confirmColor="emerald"
          isLoading={isSubmitting}
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
