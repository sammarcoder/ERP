
// // components/SalesVoucher.tsx
// 'use client';
// import React, { useState, useMemo, useEffect } from 'react';
// import { X, Save, ChevronRight, ChevronLeft, Package, Truck, FileText, AlertCircle, CheckCircle, User, ReceiptText, CreditCard, DollarSign } from 'lucide-react';
// import { useGetGDNByIdQuery } from '@/store/slice/gdnApi';
// import {
//   useUpdateStockMainMutation,
//   useUpdateStockDetailMutation,
//   usePostVoucherToJournalMutation,
//   useGetCarriageAccountsQuery,
// } from '@/store/slice/salesVoucherApi';

// // ✅ Handle numeric input - only allow numbers and decimal
// const handleNumericInput = (value: string): number | null => {
//   if (value === '' || value === '-') return null;
//   const num = parseFloat(value);
//   return isNaN(num) ? null : num;
// };

// interface SalesVoucherProps {
//   gdnId: number;
//   mode: 'create' | 'edit';
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function SalesVoucher({ gdnId, mode, onClose, onSuccess }: SalesVoucherProps) {
//   const [activeTab, setActiveTab] = useState<'details' | 'carriage' | 'journal'>('details');
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const [details, setDetails] = useState<any[]>([]);
//   const [carriageConfirmed, setCarriageConfirmed] = useState(false);

//   // Carriage fields
//   const [carriage, setCarriage] = useState({
//     id: null as number | null,
//     labourCrt: null as number | null,
//     freightCrt: null as number | null,
//     biltyExpense: null as number | null,
//     otherExpense: null as number | null,
//     bookedCrt: null as number | null
//   });

//   // APIs
//   const { data: gdnData, isLoading } = useGetGDNByIdQuery(gdnId);
//   const { data: carriageData } = useGetCarriageAccountsQuery();
//   const [updateMain] = useUpdateStockMainMutation();
//   const [updateDetail] = useUpdateStockDetailMutation();
//   const [postVoucher, { isLoading: posting }] = usePostVoucherToJournalMutation();

//   const gdn = gdnData?.data;
//   const carriageAccounts = carriageData?.data || [];

//   // Initialize
//   useEffect(() => {
//     if (gdn?.details) {
//       setDetails(gdn.details.map((d: any) => ({
//         ...d,
//         editedPrice: parseFloat(d.Stock_Price) || 0,
//         editedDiscountA: d.Discount_A !== null && d.Discount_A !== undefined ? String(d.Discount_A) : '',
//         editedDiscountB: d.Discount_B !== null && d.Discount_B !== undefined ? String(d.Discount_B) : '',
//         editedDiscountC: d.Discount_C !== null && d.Discount_C !== undefined ? String(d.Discount_C) : '',
//         editedScheme: d.Scheme_Discount !== null && d.Scheme_Discount !== undefined ? parseFloat(d.Scheme_Discount) : null,
//       })));
//       setCarriage({
//         id: gdn.Carriage_ID || null,
//         labourCrt: gdn.labour_crt !== null && gdn.labour_crt !== undefined ? parseFloat(gdn.labour_crt) : null,
//         freightCrt: gdn.freight_crt !== null && gdn.freight_crt !== undefined ? parseFloat(gdn.freight_crt) : null,
//         biltyExpense: gdn.bility_expense !== null && gdn.bility_expense !== undefined ? parseFloat(gdn.bility_expense) : null,
//         otherExpense: gdn.other_expense !== null && gdn.other_expense !== undefined ? parseFloat(gdn.other_expense) : null,
//         bookedCrt: gdn.booked_crt !== null && gdn.booked_crt !== undefined ? parseFloat(gdn.booked_crt) : null,
//       });
//     }
//   }, [gdn]);

//   // Reset confirmation when carriage changes
//   useEffect(() => { setCarriageConfirmed(false); }, [carriage]);

//   // Calculate carriage amount
//   const carriageAmount = useMemo(() => {
//     const labourCrt = carriage.labourCrt || 0;
//     const freightCrt = carriage.freightCrt || 0;
//     const biltyExpense = carriage.biltyExpense || 0;
//     const otherExpense = carriage.otherExpense || 0;
//     const bookedCrt = carriage.bookedCrt || 0;
//     return (labourCrt * bookedCrt) + (freightCrt * bookedCrt) + biltyExpense + otherExpense;
//   }, [carriage]);

//   // Calculate totals
//   const { totals, batchTotals } = useMemo(() => {
//     let totalGross = 0, totalNet = 0;
//     const batches: Record<string, { batchName: string; amount: number }> = {};

//     details.forEach(d => {
//       const qty = parseFloat(d.uom2_qty) || parseFloat(d.Stock_out_SKU_UOM_Qty) || 0;
//       const gross = qty * (d.editedPrice || 0);
//       const discA = parseFloat(d.editedDiscountA) || 0;
//       const discB = parseFloat(d.editedDiscountB) || 0;
//       const discC = parseFloat(d.editedDiscountC) || 0;
//       const afterA = gross - (gross * discA / 100);
//       const afterB = afterA - (afterA * discB / 100);
//       const net = afterB - (afterB * discC / 100);

//       totalGross += gross;
//       totalNet += net;

//       const batchId = d.batchno || 'unknown';
//       if (!batches[batchId]) batches[batchId] = { batchName: d.batchDetails?.acName || `Batch-${batchId}`, amount: 0 };
//       batches[batchId].amount += net;
//     });

//     // Round the totals (except discount fields are not rounded)
//     totalGross = Math.round(totalGross);
//     totalNet = Math.round(totalNet);

//     // Round batch amounts
//     Object.keys(batches).forEach(key => {
//       batches[key].amount = Math.round(batches[key].amount);
//     });

//     // ✅ If carriage ID selected, minus carriage from customer
//     const customerDebit = carriage.id ? totalNet - Math.round(carriageAmount) : totalNet;

//     return { totals: { totalGross, totalNet, customerDebit, carriageAmount: carriage.id ? Math.round(carriageAmount) : 0 }, batchTotals: batches };
//   }, [details, carriage.id, carriageAmount]);

//   // ✅ Validation: Only checkbox is compulsory
//   const canGenerate = carriageConfirmed;

//   // Submit
//   const handleSubmit = async () => {
//     setShowConfirm(false);
//     setMessage(null);
//     try {
//       await Promise.all(details.map(d => updateDetail({
//         id: d.ID,
//         data: {
//           Stock_Price: d.editedPrice || 0,
//           Discount_A: parseFloat(d.editedDiscountA) || 0,
//           Discount_B: parseFloat(d.editedDiscountB) || 0,
//           Discount_C: parseFloat(d.editedDiscountC) || 0,
//           Scheme_Discount: d.editedScheme || 0
//         }
//       }).unwrap()));

//       await updateMain({
//         id: gdnId,
//         data: {
//           is_Voucher_Generated: true, Status: 'Post',
//           Carriage_ID: carriage.id, Carriage_Amount: totals.carriageAmount,
//           labour_crt: carriage.labourCrt || 0, freight_crt: carriage.freightCrt || 0,
//           bility_expense: carriage.biltyExpense || 0, other_expense: carriage.otherExpense || 0, booked_crt: carriage.bookedCrt || 0,
//         }
//       }).unwrap();

//       await postVoucher({
//         stockMainId: gdnId, mode,
//         calculatedTotals: { totalNet: totals.totalNet, carriageAmount: totals.carriageAmount, customerDebit: totals.customerDebit, batchTotals }
//       }).unwrap();

//       setMessage({ type: 'success', text: 'Voucher generated successfully!' });
//       setTimeout(onSuccess, 1500);
//     } catch (err: any) {
//       setMessage({ type: 'error', text: err.data?.error || 'Failed to generate voucher' });
//     }
//   };

//   const fmt = (n: number) => n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   const fmtInt = (n: number) => Math.round(n).toLocaleString('en-PK');
//   const updateCarriage = (field: string, value: any) => setCarriage(prev => ({ ...prev, [field]: value }));

//   if (isLoading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div></div>;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex justify-between">
//           <div>
//             <h2 className="text-xl font-bold">{mode === 'create' ? 'Generate' : 'Re-Generate'} Sales Voucher</h2>
//             <p className="text-emerald-100 text-sm">GDN: {gdn?.Number} | Customer: {gdn?.account?.acName}</p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white/20 rounded"><X className="w-5 h-5" /></button>
//         </div>

//         {/* Message */}
//         {message && (
//           <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//             {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             {message.text}
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="flex border-b px-6">
//           {[{ id: 'details', label: 'Stock Details', icon: Package }, { id: 'carriage', label: 'Carriage Info', icon: Truck }, { id: 'journal', label: 'Journal Preview', icon: FileText }].map(tab => (
//             <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 border-b-2 ${activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
//               <tab.icon className="w-4 h-4" />{tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-auto p-6">
//           {/* Tab 1: Details */}
//           {activeTab === 'details' && (
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-3 py-2 text-center">#</th>
//                   <th className="px-3 py-2 text-left">Batch</th>
//                   <th className="px-3 py-2 text-left">Item Name</th>
//                   <th className="px-3 py-2 text-right">Crt Sold</th>
//                   <th className="px-3 py-2 text-right">Qty Sold</th>
//                   <th className="px-3 py-2 text-left">Price</th>
//                   <th className="px-3 py-2 text-right">Gross Total</th>
//                   <th className="px-3 py-2 text-center">Disc A</th>
//                   <th className="px-3 py-2 text-center">Disc B</th>
//                   <th className="px-3 py-2 text-center">Disc C</th>
//                   <th className="px-3 py-2 text-right">Net Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {details.map((d, i) => {
//                   const qty = d.uom2_qty;
//                   const crtQty = d.uom3_qty;
//                   const uom1Name = d.item?.uom1?.uom || '';
//                   const uom2Name = d.item?.uomTwo?.uom;
//                   const uom3Name = d.item?.uomThree?.uom || '';
//                   const batchName = d.batchDetails?.acName || '-';
//                   const gross = qty * (d.editedPrice || 0);
//                   const discountA = parseFloat(d.editedDiscountA) || 0;
//                   const discountB = parseFloat(d.editedDiscountB) || 0;
//                   const discountC = parseFloat(d.editedDiscountC) || 0;
//                   const afterA = gross - (gross * discountA / 100);
//                   const afterB = afterA - (afterA * discountB / 100);
//                   const net = afterB - (afterB * discountC / 100);
//                   return (
//                     <tr key={d.ID} className="border-b hover:bg-gray-50">
//                       <td className="px-3 py-2 text-center">{d.Line_Id || i + 1}</td>
//                       <td className="px-3 py-2">{batchName}</td>
//                       <td className="px-3 py-2">{d.item?.itemName || '-'}</td>
//                       <td className="px-3 py-2 text-right">{crtQty} {uom3Name}</td>
//                       <td className="px-3 py-2 text-right">{Math.round(qty)} {uom2Name}</td>
//                       <td className="px-3 py-2">
//                         <div className="flex items-center gap-1">
//                           <input type="text" inputMode="decimal" value={d.editedPrice ?? ''} onChange={e => setDetails(p => p.map((x, j) => j === i ? { ...x, editedPrice: handleNumericInput(e.target.value) } : x))} className="w-20 px-2 py-1 border rounded text-right" />
//                           <span className="text-xs text-gray-500">/{uom2Name}</span>
//                         </div>
//                       </td>
//                       <td className="px-3 py-2 text-right">{fmtInt(Math.round(gross))}</td>
//                       <td className="">
//                         <div className="flex items-center justify-center gap-1">
//                           <input type="text" inputMode="decimal" value={d.editedDiscountA} onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountA: v } : x)); }} className="w-14 px-2 py-1 border rounded text-right" />
//                           <span className="text-xs text-gray-500">%</span>
//                         </div>
//                       </td>
//                       <td className="">
//                         <div className="flex items-center justify-center gap-1">
//                           <input type="text" inputMode="decimal" value={d.editedDiscountB} onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountB: v } : x)); }} className="w-14 px-2 py-1 border rounded text-right" />
//                           <span className="text-xs text-gray-500">%</span>
//                         </div>
//                       </td>
//                       <td className="">
//                         <div className="flex items-center justify-center gap-1">
//                           <input type="text" inputMode="decimal" value={d.editedDiscountC} onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountC: v } : x)); }} className="w-14 px-2 py-1 border rounded text-right" />
//                           <span className="text-xs text-gray-500">%</span>
//                         </div>
//                       </td>
//                       <td className="px-3 text-right font-medium text-emerald-600">{fmtInt(net)}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//               <tfoot className="bg-gray-100 font-medium">
//                 <tr><td colSpan={6} className="px-3 py-2 text-right">Totals:</td><td className="px-3 py-2 text-right">{fmtInt(totals.totalGross)}</td><td colSpan={3}></td><td className="px-3 py-2 text-right text-emerald-600">{(totals.totalNet)}</td></tr>
//               </tfoot>
//             </table>
//           )}

//           {/* Tab 2: Carriage */}
//           {activeTab === 'carriage' && (
//             <div className="space-y-2">
//               {/* Cost Breakdown Grid - Like GDN_Header */}
//               <div className="bg-white rounded-xl">
//                 <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
//                   {/* Carriage Account */}
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
//                       <DollarSign className="w-3 h-3" />
//                       Carriage A/C
//                     </label>
//                     <select value={carriage.id || ''} onChange={e => updateCarriage('id', e.target.value ? parseInt(e.target.value) : null)} className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500">
//                       <option value="">No Carriage</option>
//                       {carriageAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.acName}</option>)}
//                     </select>
//                   </div>

//                   {/* Booked Crts */}
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
//                       <Package className="w-3 h-3" />
//                       Booked Crts
//                     </label>
//                     <input type="text" inputMode="decimal" value={carriage.bookedCrt ?? ''} onChange={e => updateCarriage('bookedCrt', handleNumericInput(e.target.value))} placeholder="0" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
//                   </div>

//                   {/* Freight /Crt */}
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
//                       <Truck className="w-3 h-3" />
//                       Freight /Crt
//                     </label>
//                     <input type="text" inputMode="decimal" value={carriage.freightCrt ?? ''} onChange={e => updateCarriage('freightCrt', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
//                     <p className="text-emerald-500 text-xs mt-0.5">{((carriage.freightCrt || 0) * (carriage.bookedCrt || 0)).toLocaleString('en-US')}</p>
//                   </div>

//                   {/* Labour /Crt */}
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
//                       <User className="w-3 h-3" />
//                       Labour /Crt
//                     </label>
//                     <input type="text" inputMode="decimal" value={carriage.labourCrt ?? ''} onChange={e => updateCarriage('labourCrt', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
//                     <p className="text-emerald-500 text-xs mt-0.5">{((carriage.labourCrt || 0) * (carriage.bookedCrt || 0)).toLocaleString('en-US')}</p>
//                   </div>

//                   {/* Bilty Expense */}
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
//                       <ReceiptText className="w-3 h-3" />
//                       Bilty
//                     </label>
//                     <input type="text" inputMode="decimal" value={carriage.biltyExpense ?? ''} onChange={e => updateCarriage('biltyExpense', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
//                     <p className="text-emerald-500 text-xs mt-0.5">{(carriage.biltyExpense || 0).toLocaleString('en-US')}</p>
//                   </div>

//                   {/* Other Expense */}
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
//                       <CreditCard className="w-3 h-3" />
//                       Other
//                     </label>
//                     <input type="text" inputMode="decimal" value={carriage.otherExpense ?? ''} onChange={e => updateCarriage('otherExpense', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
//                     <p className="text-emerald-500 text-xs mt-0.5">{(carriage.otherExpense || 0).toLocaleString('en-US')}</p>
//                   </div>

//                   {/* Summary Card */}
//                   <div className="flex flex-col justify-center">
//                     {/* <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center"> */}
//                     <span className="text-xs text-orange-700">Total</span>
//                     <p className="text-sm font-bold text-orange-600">Rs {fmt(carriageAmount)}</p>
//                     {/* </div> */}
//                   </div>
//                 </div>
//               </div>

//               {/* Summary Section - Compact */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                 <div className="bg-gray-100 rounded-lg p-2 space-y-1 text-sm">
//                   <div className="flex justify-between"><span>Net:</span><span className="font-medium">{fmtInt(totals.totalNet)}</span></div>
//                   {carriage.id && <div className="flex justify-between text-orange-600"><span>Carriage:</span><span>- {fmtInt(totals.carriageAmount)}</span></div>}
//                   <div className="flex justify-between border-t pt-1"><span className="font-medium">Total Net:</span><span className="font-bold text-emerald-600">{fmtInt(totals.customerDebit)}</span></div>
//                 </div>

//                 {/* ✅ Compulsory Checkbox */}
//                 <div className={`p-2 h-10 w-50 rounded-lg border-2 flex items-center ${carriageConfirmed ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
//                   <label className="flex items-center gap-2 cursor-pointer text-sm">
//                     <input type="checkbox" checked={carriageConfirmed} onChange={e => setCarriageConfirmed(e.target.checked)} className="w-4 h-4 rounded text-emerald-600" />
//                     <span className={`font-medium ${carriageConfirmed ? 'text-green-700' : 'text-amber-700'}`}>
//                       {carriageConfirmed ? '✓ Confirmed' : '⚠️ Confirm to proceed'}
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Tab 3: Journal */}
//           {activeTab === 'journal' && (
//             <div className="space-y-4">
//               {!carriageConfirmed && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-amber-700"><AlertCircle className="w-5 h-5" />Please confirm carriage details first</div>}

//               <table className="w-full text-sm border">
//                 <thead className="bg-gray-100">
//                   <tr><th className="px-4 py-2 text-left border">Line</th><th className="px-4 py-2 text-left border">Account</th><th className="px-4 py-2 text-left border">Description</th><th className="px-4 py-2 text-right border">Debit</th><th className="px-4 py-2 text-right border">Credit</th></tr>
//                 </thead>
//                 <tbody>
//                   <tr className="border-b">
//                     <td className="px-4 py-2 border">1</td>
//                     <td className="px-4 py-2 border font-medium">{gdn?.account?.acName}</td>
//                     <td className="px-4 py-2 border text-gray-600">S.Inv, {gdn?.order?.sub_customer}, {gdn?.order?.sub_city}</td>
//                     <td className="px-4 py-2 border text-right text-blue-600 font-medium">{fmtInt(totals.customerDebit)}</td>
//                     <td className="px-4 py-2 border">-</td>
//                   </tr>
//                   {carriage.id && totals.carriageAmount > 0 && (
//                     <tr className="border-b bg-orange-50">
//                       <td className="px-4 py-2 border">2</td>
//                       <td className="px-4 py-2 border font-medium">{carriageAccounts.find((c: any) => c.id === carriage.id)?.acName}</td>
//                       <td className="px-4 py-2 border text-gray-600">{gdn?.account?.acName}{gdn?.account?.city ? `, ${gdn?.account?.city}` : ''}</td>
//                       <td className="px-4 py-2 border text-right text-orange-600 font-medium">{fmtInt(totals.carriageAmount)}</td>
//                       <td className="px-4 py-2 border">-</td>
//                     </tr>
//                   )}
//                   {Object.entries(batchTotals).map(([id, b], i) => (
//                     <tr key={id} className="border-b">
//                       <td className="px-4 py-2 border">{carriage.id && totals.carriageAmount > 0 ? i + 3 : i + 2}</td>
//                       <td className="px-4 py-2 border font-medium">{b.batchName}</td><td className="px-4 py-2 border text-gray-600">{gdn?.account?.acName}</td><td className="px-4 py-2 border">-</td>
//                       <td className="px-4 py-2 border text-right text-green-600 font-medium">{fmtInt(b.amount)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-gray-100 font-medium">
//                   <tr>
//                     <td colSpan={3} className="px-4 py-2 border text-right">Total:</td>
//                     <td className="px-4 py-2 border text-right text-blue-600">{fmtInt(totals.customerDebit + totals.carriageAmount)}</td>
//                     <td className="px-4 py-2 border text-right text-green-600">{fmtInt(totals.totalNet)}</td>
//                   </tr>
//                 </tfoot>
//               </table>

//               <div className="p-3 rounded-lg bg-green-100 text-green-700 flex items-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 Debit ({fmtInt(totals.customerDebit + totals.carriageAmount)}) = Credit ({fmtInt(totals.totalNet)}) ✓ Balanced
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="border-t px-6 py-4 flex justify-between bg-gray-50">
//           <div className="text-sm">Total: <span className="font-bold text-emerald-600">{fmtInt(totals.totalNet)}</span>{carriage.id && <span className="ml-3">After Less: <span className="font-bold text-blue-600">{fmtInt(totals.customerDebit)}</span></span>}</div>
//           <div className="flex gap-3">
//             <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
//             {activeTab === 'details' && <button onClick={() => setActiveTab('carriage')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></button>}
//             {activeTab === 'carriage' && (
//               <>
//                 <button onClick={() => setActiveTab('details')} className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</button>
//                 <button onClick={() => setActiveTab('journal')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></button>
//               </>
//             )}
//             {activeTab === 'journal' && (
//               <>
//                 <button onClick={() => setActiveTab('carriage')} className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</button>
//                 <button onClick={() => setShowConfirm(true)} disabled={posting || !canGenerate} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${canGenerate ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
//                   <Save className="w-4 h-4" />{posting ? 'Generating...' : mode === 'create' ? 'Generate' : 'Re-Generate'}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Confirm Modal */}
//         {showConfirm && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6 max-w-md">
//               <h3 className="text-lg font-bold mb-2">Confirm</h3>
//               <ul className="text-sm space-y-1 mb-4">
//                 <li>• Customer Debit: Rs {fmt(totals.customerDebit)}</li>
//                 {carriage.id && totals.carriageAmount > 0 && <li>• Carriage Debit: Rs {fmt(totals.carriageAmount)}</li>}
//                 <li>• Total Credit: Rs {fmt(totals.totalNet)}</li>
//               </ul>
//               <div className="flex gap-3 justify-end">
//                 <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
//                 <button onClick={handleSubmit} disabled={posting} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">{posting ? 'Processing...' : 'Confirm'}</button>
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
import { X, Save, ChevronRight, ChevronLeft, Package, Truck, FileText, AlertCircle, CheckCircle, User, ReceiptText, CreditCard, DollarSign } from 'lucide-react';
import { useGetGDNByIdQuery } from '@/store/slice/gdnApi';
import {
  useUpdateStockMainMutation,
  useUpdateStockDetailMutation,
  usePostVoucherToJournalMutation,
  useGetCarriageAccountsQuery,
} from '@/store/slice/salesVoucherApi';
import { TransporterSearchableInput } from '@/components/common/transpoter/TransporterSearchableInput';

// ✅ Handle numeric input - only allow numbers and decimal
const handleNumericInput = (value: string): number | null => {
  if (value === '' || value === '-') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

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
  const [transporterId, setTransporterId] = useState<number | null>(null);

  // Carriage fields
  const [carriage, setCarriage] = useState({
    id: null as number | null,
    labourCrt: null as number | null,
    freightCrt: null as number | null,
    biltyExpense: null as number | null,
    otherExpense: null as number | null,
    bookedCrt: null as number | null
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
        editedDiscountA: d.Discount_A !== null && d.Discount_A !== undefined ? String(d.Discount_A) : '',
        editedDiscountB: d.Discount_B !== null && d.Discount_B !== undefined ? String(d.Discount_B) : '',
        editedDiscountC: d.Discount_C !== null && d.Discount_C !== undefined ? String(d.Discount_C) : '',
        editedScheme: d.Scheme_Discount !== null && d.Scheme_Discount !== undefined ? parseFloat(d.Scheme_Discount) : null,
      })));
      setCarriage({
        id: gdn.Carriage_ID || null,
        labourCrt: gdn.labour_crt !== null && gdn.labour_crt !== undefined ? parseFloat(gdn.labour_crt) : null,
        freightCrt: gdn.freight_crt !== null && gdn.freight_crt !== undefined ? parseFloat(gdn.freight_crt) : null,
        biltyExpense: gdn.bility_expense !== null && gdn.bility_expense !== undefined ? parseFloat(gdn.bility_expense) : null,
        otherExpense: gdn.other_expense !== null && gdn.other_expense !== undefined ? parseFloat(gdn.other_expense) : null,
        bookedCrt: gdn.booked_crt !== null && gdn.booked_crt !== undefined ? parseFloat(gdn.booked_crt) : null,
      });
      setTransporterId(gdn.Transporter_ID || null);
    }
  }, [gdn]);

  // Reset confirmation when carriage changes
  useEffect(() => { setCarriageConfirmed(false); }, [carriage]);

  // Calculate carriage amount
  const carriageAmount = useMemo(() => {
    const labourCrt = carriage.labourCrt || 0;
    const freightCrt = carriage.freightCrt || 0;
    const biltyExpense = carriage.biltyExpense || 0;
    const otherExpense = carriage.otherExpense || 0;
    const bookedCrt = carriage.bookedCrt || 0;
    return (labourCrt * bookedCrt) + (freightCrt * bookedCrt) + biltyExpense + otherExpense;
  }, [carriage]);

  // Calculate totals
  // const { totals, batchTotals } = useMemo(() => {
  //   let totalGross = 0, totalNet = 0;
  //   const batches: Record<string, { batchName: string; amount: number }> = {};

  //   details.forEach(d => {
  //     const qty = parseFloat(d.uom2_qty);
  //     const gross = qty * (d.editedPrice || 0);
  //     const discA = parseFloat(d.editedDiscountA) || 0;
  //     const discB = parseFloat(d.editedDiscountB) || 0;
  //     const discC = parseFloat(d.editedDiscountC) || 0;
  //     const afterA = gross - (gross * discA / 100);
  //     const afterB = afterA - (afterA * discB / 100);
  //     const net = afterB - (afterB * discC / 100);

  //     totalGross += gross;
  //     totalNet += net;

  //     const batchId = d.batchno || 'unknown';
  //     if (!batches[batchId]) batches[batchId] = { batchName: d.batchDetails?.acName || `Batch-${batchId}`, amount: 0 };
  //     batches[batchId].amount += net;
  //   });

  //   // ✅ Use Math.trunc to remove decimals (no rounding)
  //   totalGross = Math.trunc(totalGross);
  //   totalNet = Math.trunc(totalNet);

  //   // Trunc batch amounts
  //   Object.keys(batches).forEach(key => {
  //     batches[key].amount = Math.trunc(batches[key].amount);
  //   });

  //   // ✅ If carriage ID selected, minus carriage from customer
  //   const customerDebit = carriage.id ? totalNet - Math.trunc(carriageAmount) : totalNet;

  //   return { totals: { totalGross, totalNet, customerDebit, carriageAmount: carriage.id ? Math.trunc(carriageAmount) : 0 }, batchTotals: batches };
  // }, [details, carriage.id, carriageAmount]);
  // Calculate totals


  const { totals, batchTotals } = useMemo(() => {
    let totalGross = 0, totalNet = 0;
    const batches: Record<string, { batchName: string; amount: number }> = {};

    details.forEach(d => {
      const qty = parseFloat(d.uom2_qty) || 0;
      const price = d.editedPrice || 0;
      const gross = qty * price;

      const discA = parseFloat(d.editedDiscountA) || 0;
      const discB = parseFloat(d.editedDiscountB) || 0;
      const discC = parseFloat(d.editedDiscountC) || 0;

      const afterA = gross - (gross * discA / 100);
      const afterB = afterA - (afterA * discB / 100);
      const netRaw = afterB - (afterB * discC / 100);

      // ✅ Truncate at ROW level FIRST
      const grossTrunc = Math.trunc(gross);
      const netTrunc = Math.trunc(netRaw);

      totalGross += grossTrunc;
      totalNet += netTrunc;

      // ✅ Sum truncated values per batch
      const batchId = d.batchno || 'unknown';
      if (!batches[batchId]) {
        batches[batchId] = {
          batchName: d.batchDetails?.acName || `Batch-${batchId}`,
          amount: 0
        };
      }
      batches[batchId].amount += netTrunc;  // ✅ Add truncated value
    });

    // ✅ No need to truncate again - already truncated per row
    const carriageAmountTrunc = Math.trunc(carriageAmount);
    const customerDebit = carriage.id ? totalNet - carriageAmountTrunc : totalNet;

    return {
      totals: {
        totalGross,
        totalNet,
        customerDebit,
        carriageAmount: carriage.id ? carriageAmountTrunc : 0
      },
      batchTotals: batches
    };
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
        data: {
          Stock_Price: d.editedPrice || 0,
          Discount_A: parseFloat(d.editedDiscountA) || 0,
          Discount_B: parseFloat(d.editedDiscountB) || 0,
          Discount_C: parseFloat(d.editedDiscountC) || 0,
          Scheme_Discount: d.editedScheme || 0
        }
      }).unwrap()));

      await updateMain({
        id: gdnId,
        data: {
          is_Voucher_Generated: true, Status: 'Post',
          Carriage_ID: carriage.id, Carriage_Amount: totals.carriageAmount,
          labour_crt: carriage.labourCrt || 0, freight_crt: carriage.freightCrt || 0,
          bility_expense: carriage.biltyExpense || 0, other_expense: carriage.otherExpense || 0, booked_crt: carriage.bookedCrt || 0,
          Transporter_ID: transporterId,
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

  // ✅ Format functions - use Math.trunc instead of Math.round
  const fmt = (n: number) => Math.trunc(n).toLocaleString('en-PK');
  const fmtInt = (n: number) => Math.trunc(n).toLocaleString('en-PK');

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
          {/* {activeTab === 'details' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-center">#</th>
                  <th className="px-3 py-2 text-left">Batch</th>
                  <th className="px-3 py-2 text-left">Item Name</th>
                  <th className="px-3 py-2 text-right">Crt Sold</th>
                  <th className="px-3 py-2 text-right">Qty Sold</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-right">Gross Total</th>
                  <th className="px-3 py-2 text-center">Disc A</th>
                  <th className="px-3 py-2 text-center">Disc B</th>
                  <th className="px-3 py-2 text-center">Disc C</th>
                  <th className="px-3 py-2 text-right">Net Total</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, i) => {
                  const qty = d.uom2_qty;
                  const crtQty = d.uom3_qty;
                  const uom1Name = d.item?.uom1?.uom || '';
                  const uom2Name = d.item?.uomTwo?.uom;
                  const uom3Name = d.item?.uomThree?.uom || '';
                  const batchName = d.batchDetails?.acName || '-';
                  const gross = qty * (d.editedPrice || 0);
                  const discountA = parseFloat(d.editedDiscountA) || 0;
                  const discountB = parseFloat(d.editedDiscountB) || 0;
                  const discountC = parseFloat(d.editedDiscountC) || 0;
                  const afterA = gross - (gross * discountA / 100);
                  const afterB = afterA - (afterA * discountB / 100);
                  const net = afterB - (afterB * discountC / 100);
                  return (
                    <tr key={d.ID} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-center">{d.Line_Id || i + 1}</td>
                      <td className="px-3 py-2">{batchName}</td>
                      <td className="px-3 py-2">{d.item?.itemName || '-'}</td>
                      <td className="px-3 py-2 text-right">{Math.trunc(crtQty)} {uom3Name}</td>
                      <td className="px-3 py-2 text-right">{Math.trunc(qty)} {uom2Name}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <input type="text" inputMode="decimal" value={d.editedPrice ?? ''} onChange={e => setDetails(p => p.map((x, j) => j === i ? { ...x, editedPrice: handleNumericInput(e.target.value) } : x))} className="w-20 px-2 py-1 border rounded text-right" />
                          <span className="text-xs border-green-40 text-gray-500">/{uom2Name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">{fmtInt(Math.trunc(gross))}</td>
                      <td className="">
                        <div className="flex items-center justify-center gap-1">
                          <input type="text" inputMode="decimal" value={d.editedDiscountA} onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountA: v } : x)); }} className="w-14 px-2 py-1 border border-green-400 rounded text-right" />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="">
                        <div className="flex items-center justify-center gap-1">
                          <input type="text" inputMode="decimal" value={d.editedDiscountB} onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountB: v } : x)); }} className="w-14 px-2 py-1 border border-green-400 rounded text-right" />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="">
                        <div className="flex items-center justify-center gap-1">
                          <input type="text" inputMode="decimal" value={d.editedDiscountC} onChange={e => { const v = e.target.value; if (v === '' || /^\d*\.?\d*$/.test(v)) setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountC: v } : x)); }} className="w-14 px-2 py-1 border border-green-400 rounded text-right" />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="px-3 text-right font-medium text-emerald-600">{fmtInt(Math.trunc(net))}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-100 font-medium">
                <tr><td colSpan={6} className="px-3 py-2 text-right">Totals:</td><td className="px-3 py-2 text-right">{fmtInt(totals.totalGross)}</td><td colSpan={3}></td><td className="px-3 py-2 text-right text-emerald-600">{fmtInt(totals.totalNet)}</td></tr>
              </tfoot>
            </table>
          )} */}




          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-center">#</th>
                  <th className="px-3 py-2 text-left">Batch</th>
                  <th className="px-3 py-2 text-left">Item Name</th>
                  <th className="px-3 py-2 text-right">Crt Sold</th>
                  <th className="px-3 py-2 text-right">Qty Sold</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-right">Gross Total</th>
                  <th className="px-3 py-2 text-center">Disc A</th>
                  <th className="px-3 py-2 text-center">Disc B</th>
                  <th className="px-3 py-2 text-center">Disc C</th>
                  <th className="px-3 py-2 text-right">Net Total</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, i) => {
                  const qty = parseFloat(d.uom2_qty) || 0;
                  const crtQty = parseFloat(d.uom3_qty) || 0;
                  const uom1Name = d.item?.uom1?.uom || '';
                  const uom2Name = d.item?.uomTwo?.uom || '';
                  const uom3Name = d.item?.uomThree?.uom || '';
                  const batchName = d.batchDetails?.acName || '-';

                  // ✅ Calculate gross
                  const gross = qty * (d.editedPrice || 0);

                  // ✅ Calculate discounts
                  const discountA = parseFloat(d.editedDiscountA) || 0;
                  const discountB = parseFloat(d.editedDiscountB) || 0;
                  const discountC = parseFloat(d.editedDiscountC) || 0;

                  const afterA = gross - (gross * discountA / 100);
                  const afterB = afterA - (afterA * discountB / 100);
                  const netRaw = afterB - (afterB * discountC / 100);

                  // ✅ Truncate at ROW level (same as calculation in useMemo)
                  const grossTrunc = Math.trunc(gross);
                  const netTrunc = Math.trunc(netRaw);

                  return (
                    <tr key={d.ID} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-center">{d.Line_Id || i + 1}</td>
                      <td className="px-3 py-2">{batchName}</td>
                      <td className="px-3 py-2">{d.item?.itemName || '-'}</td>
                      <td className="px-3 py-2 text-right">{Math.trunc(crtQty)} {uom3Name}</td>
                      <td className="px-3 py-2 text-right">{Math.trunc(qty)} {uom2Name}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={d.editedPrice ?? ''}
                            onChange={e => setDetails(p => p.map((x, j) => j === i ? { ...x, editedPrice: handleNumericInput(e.target.value) } : x))}
                            className="w-20 px-2 py-1 border rounded text-right"
                          />
                          <span className="text-xs text-gray-500">/{uom2Name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">{fmtInt(grossTrunc)}</td>
                      <td className="">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={d.editedDiscountA}
                            onChange={e => {
                              const v = e.target.value;
                              if (v === '' || /^\d*\.?\d*$/.test(v))
                                setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountA: v } : x));
                            }}
                            className="w-14 px-2 py-1 border border-green-400 rounded text-right"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={d.editedDiscountB}
                            onChange={e => {
                              const v = e.target.value;
                              if (v === '' || /^\d*\.?\d*$/.test(v))
                                setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountB: v } : x));
                            }}
                            className="w-14 px-2 py-1 border border-green-400 rounded text-right"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={d.editedDiscountC}
                            onChange={e => {
                              const v = e.target.value;
                              if (v === '' || /^\d*\.?\d*$/.test(v))
                                setDetails(p => p.map((x, j) => j === i ? { ...x, editedDiscountC: v } : x));
                            }}
                            className="w-14 px-2 py-1 border border-green-400 rounded text-right"
                          />
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="px-3 text-right font-medium text-emerald-600">{fmtInt(netTrunc)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-100 font-medium">
                <tr>
                  <td colSpan={6} className="px-3 py-2 text-right">Totals:</td>
                  <td className="px-3 py-2 text-right">{fmtInt(totals.totalGross)}</td>
                  <td colSpan={3}></td>
                  <td className="px-3 py-2 text-right text-emerald-600">{fmtInt(totals.totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          )}



          {/* Tab 2: Carriage */}
          {activeTab === 'carriage' && (
            <div className="space-y-2">
              {/* Transporter Selection */}


              {/* Cost Breakdown Grid - Like GDN_Header */}
              <div className="bg-white rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-8 gap-2">
                  <div className="bg-white rounded-xl">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <Truck className="w-3 h-3" />
                      Transporter
                    </label>

                    <TransporterSearchableInput
                      value={transporterId || ''}
                      onChange={(id) => setTransporterId(id ? Number(id) : null)}
                      label="Transporter"
                      placeholder="Search transporter..."
                      helperText="Select transporter for delivery"
                      size="sm"
                    />
                  </div>
                  {/* Carriage Account */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                      <DollarSign className="w-3 h-3" />
                      Carriage A/C
                    </label>
                    <select value={carriage.id || ''} onChange={e => updateCarriage('id', e.target.value ? parseInt(e.target.value) : null)} className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500">
                      <option value="">No Carriage</option>
                      {carriageAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.acName}</option>)}
                    </select>
                  </div>

                  {/* Booked Crts */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                      <Package className="w-3 h-3" />
                      Booked Crts
                    </label>
                    <input type="text" inputMode="decimal" value={carriage.bookedCrt ?? ''} onChange={e => updateCarriage('bookedCrt', handleNumericInput(e.target.value))} placeholder="0" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
                  </div>

                  {/* Freight /Crt */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                      <Truck className="w-3 h-3" />
                      Freight /Crt
                    </label>
                    <input type="text" inputMode="decimal" value={carriage.freightCrt ?? ''} onChange={e => updateCarriage('freightCrt', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
                    <p className="text-emerald-500 text-xs mt-0.5">{Math.trunc((carriage.freightCrt || 0) * (carriage.bookedCrt || 0)).toLocaleString('en-US')}</p>
                  </div>

                  {/* Labour /Crt */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                      <User className="w-3 h-3" />
                      Labour /Crt
                    </label>
                    <input type="text" inputMode="decimal" value={carriage.labourCrt ?? ''} onChange={e => updateCarriage('labourCrt', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
                    <p className="text-emerald-500 text-xs mt-0.5">{Math.trunc((carriage.labourCrt || 0) * (carriage.bookedCrt || 0)).toLocaleString('en-US')}</p>
                  </div>

                  {/* Bilty Expense */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                      <ReceiptText className="w-3 h-3" />
                      Bilty
                    </label>
                    <input type="text" inputMode="decimal" value={carriage.biltyExpense ?? ''} onChange={e => updateCarriage('biltyExpense', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
                    <p className="text-emerald-500 text-xs mt-0.5">{Math.trunc(carriage.biltyExpense || 0).toLocaleString('en-US')}</p>
                  </div>

                  {/* Other Expense */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
                      <CreditCard className="w-3 h-3" />
                      Other
                    </label>
                    <input type="text" inputMode="decimal" value={carriage.otherExpense ?? ''} onChange={e => updateCarriage('otherExpense', handleNumericInput(e.target.value))} placeholder="0.00" className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-emerald-500" />
                    <p className="text-emerald-500 text-xs mt-0.5">{Math.trunc(carriage.otherExpense || 0).toLocaleString('en-US')}</p>
                  </div>

                  {/* Summary Card */}
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-orange-700">Total</span>
                    <p className="text-sm font-bold text-orange-600">Rs {fmtInt(carriageAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Summary Section - Compact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-gray-100 rounded-lg p-2 space-y-1 text-sm">
                  <div className="flex justify-between"><span>Net:</span><span className="font-medium">{fmtInt(totals.totalNet)}</span></div>
                  {carriage.id && <div className="flex justify-between text-orange-600"><span>Carriage:</span><span>- {fmtInt(totals.carriageAmount)}</span></div>}
                  <div className="flex justify-between border-t pt-1"><span className="font-medium">Total Net:</span><span className="font-bold text-emerald-600">{fmtInt(totals.customerDebit)}</span></div>
                </div>

                {/* ✅ Compulsory Checkbox */}
                <div className={`p-2 h-10 w-50 rounded-lg border-2 flex items-center ${carriageConfirmed ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={carriageConfirmed} onChange={e => setCarriageConfirmed(e.target.checked)} className="w-4 h-4 rounded text-emerald-600" />
                    <span className={`font-medium ${carriageConfirmed ? 'text-green-700' : 'text-amber-700'}`}>
                      {carriageConfirmed ? '✓ Confirmed' : '⚠️ Confirm to proceed'}
                    </span>
                  </label>
                </div>
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
                  <tr className="border-b">
                    <td className="px-4 py-2 border">1</td>
                    <td className="px-4 py-2 border font-medium">{gdn?.account?.acName}</td>
                    <td className="px-4 py-2 border text-gray-600">S.Inv, {gdn?.order?.sub_customer}, {gdn?.order?.sub_city}</td>
                    <td className="px-4 py-2 border text-right text-blue-600 font-medium">{fmtInt(totals.customerDebit)}</td>
                    <td className="px-4 py-2 border">-</td>
                  </tr>
                  {carriage.id && totals.carriageAmount > 0 && (
                    <tr className="border-b bg-orange-50">
                      <td className="px-4 py-2 border">2</td>
                      <td className="px-4 py-2 border font-medium">{carriageAccounts.find((c: any) => c.id === carriage.id)?.acName}</td>
                      <td className="px-4 py-2 border text-gray-600">{gdn?.account?.acName}{gdn?.account?.city ? `, ${gdn?.account?.city}` : ''}</td>
                      <td className="px-4 py-2 border text-right text-orange-600 font-medium">{fmtInt(totals.carriageAmount)}</td>
                      <td className="px-4 py-2 border">-</td>
                    </tr>
                  )}
                  {Object.entries(batchTotals).map(([id, b], i) => (
                    <tr key={id} className="border-b">
                      <td className="px-4 py-2 border">{carriage.id && totals.carriageAmount > 0 ? i + 3 : i + 2}</td>
                      <td className="px-4 py-2 border font-medium">{b.batchName}</td><td className="px-4 py-2 border text-gray-600">{gdn?.account?.acName}</td><td className="px-4 py-2 border">-</td>
                      <td className="px-4 py-2 border text-right text-green-600 font-medium">{fmtInt(b.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-medium">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 border text-right">Total:</td>
                    <td className="px-4 py-2 border text-right text-blue-600">{fmtInt(totals.customerDebit + totals.carriageAmount)}</td>
                    <td className="px-4 py-2 border text-right text-green-600">{fmtInt(totals.totalNet)}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="p-3 rounded-lg bg-green-100 text-green-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Debit ({fmtInt(totals.customerDebit + totals.carriageAmount)}) = Credit ({fmtInt(totals.totalNet)}) ✓ Balanced
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between bg-gray-50">
          <div className="text-sm">Total: <span className="font-bold text-emerald-600">{fmtInt(totals.totalNet)}</span>{carriage.id && <span className="ml-3">After Less: <span className="font-bold text-blue-600">{fmtInt(totals.customerDebit)}</span></span>}</div>
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
                <li>• Customer Debit: Rs {fmtInt(totals.customerDebit)}</li>
                {carriage.id && totals.carriageAmount > 0 && <li>• Carriage Debit: Rs {fmtInt(totals.carriageAmount)}</li>}
                <li>• Total Credit: Rs {fmtInt(totals.totalNet)}</li>
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
