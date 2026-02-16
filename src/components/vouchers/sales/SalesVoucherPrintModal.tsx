


// // components/SalesVoucherPrintModal.tsx
// import React, { useEffect } from 'react';
// import { X, Printer } from 'lucide-react';

// interface SalesVoucherPrintModalProps {
//   gdn: any;
//   voucherNo?: string;
//   mode?: 'view' | 'print';
//   onClose: () => void;
// }

// const SalesVoucherPrintModal: React.FC<SalesVoucherPrintModalProps> = ({ gdn, voucherNo, mode = 'print', onClose }) => {

//   // PRINT MODE - Handle print immediately
//   useEffect(() => {
//     if (mode === 'print') {
//       executePrint();
//     }
//   }, []);

//   const executePrint = () => {
//     const details = gdn.details || [];

//     let totalCrtSold = 0;
//     let totalPayableGross = 0;
//     let totalDisAmount = 0;
//     let totalDis2Amount = 0;
//     let totalSchAmount = 0;
//     let totalNetPayable = 0;

//     const formatDatePrint = (dateString: string) => {
//       const date = new Date(dateString);
//       const day = date.getDate();
//       const month = date.toLocaleString('default', { month: 'short' });
//       const year = date.getFullYear().toString().slice(-2);
//       return `${day}/${month}/${year}`;
//     };
//     //  console.log(` uom 2 is $ {details[0]?.item?.uomTwo?.uom} and uom 3 is ${details[0]?.item?.uomThree?.uom}`)
//     const getCrtPackagingPrint = (detail: any) => {
//       const uom2Qty = parseFloat(detail.item?.uom2_qty) || 0;
//       const uom3Qty = parseFloat(detail.item?.uom3_qty) || 0;
//       const uom2Name = detail.item?.uomTwo?.uom;
//       const uom3Name = detail.item?.uomThree?.uom;
//       return `${uom3Qty / uom2Qty} ${uom2Name}/${uom3Name}`;
//     };

//     const getActualSoldQtyPrint = (detail: any) => {
//       const qty = parseFloat(detail.uom2_qty) || 0;
//       const uom = detail.item?.uomTwo?.uom || 'Box';
//       return `${Math.trunc(qty).toLocaleString()} ${uom}`;
//     };

//     // ✅ Returns TRUNCATED values at row level
//     const calculateRowPrint = (detail: any) => {
//       const crtSold = parseFloat(detail.uom3_qty) || 0;
//       const tradePrice = parseFloat(detail.Stock_Price) || 0;
//       const uom2Qty = parseFloat(detail.uom2_qty) || 0;
//       const disPercent = parseFloat(detail.Discount_A) || 0;
//       const dis2Percent = parseFloat(detail.Discount_B) || 0;
//       const schPercent = parseFloat(detail.Discount_C) || 0;

//       const payableGrossRaw = uom2Qty * tradePrice;
//       const disAmountRaw = payableGrossRaw * (disPercent / 100);
//       const afterDis = payableGrossRaw - disAmountRaw;
//       const dis2AmountRaw = afterDis * (dis2Percent / 100);
//       const afterDis2 = afterDis - dis2AmountRaw;
//       const schAmountRaw = afterDis2 * (schPercent / 100);
//       const netPayableRaw = afterDis2 - schAmountRaw;

//       // ✅ Truncate at ROW level
//       return {
//         crtSold: Math.trunc(crtSold),
//         tradePrice,
//         payableGross: Math.trunc(payableGrossRaw),
//         disPercent,
//         disAmount: Math.trunc(disAmountRaw),
//         dis2Percent,
//         dis2Amount: Math.trunc(dis2AmountRaw),
//         schPercent,
//         schAmount: Math.trunc(schAmountRaw),
//         netPayable: Math.trunc(netPayableRaw)
//       };
//     };

//     const calculateCarriagePrint = () => {
//       if (!gdn.Carriage_ID) return 0;
//       const labour = parseFloat(gdn.labour_crt || 0);
//       const freight = parseFloat(gdn.freight_crt || 0);
//       const bility = parseFloat(gdn.bility_expense || 0);
//       const other = parseFloat(gdn.other_expense || 0);
//       const booked = parseFloat(gdn.booked_crt || 0);
//       return Math.trunc((labour * booked) + (freight * booked) + bility + other);
//     };

//     // ✅ Sum already-truncated values
//     details.forEach((detail: any) => {
//       const row = calculateRowPrint(detail);
//       totalCrtSold += row.crtSold;
//       totalPayableGross += row.payableGross;
//       totalDisAmount += row.disAmount;
//       totalDis2Amount += row.dis2Amount;
//       totalSchAmount += row.schAmount;
//       totalNetPayable += row.netPayable;
//     });

//     const carriageAmount = calculateCarriagePrint();
//     const grandTotal = totalNetPayable - carriageAmount;

//     const printWindow = window.open('', '_blank', 'width=1200,height=800');
//     if (!printWindow) {
//       alert('Please allow popups for printing');
//       onClose();
//       return;
//     }

//     let tableRows = '';
//     details.forEach((detail: any, index: number) => {
//       const row = calculateRowPrint(detail);
//       const crtPackaging = getCrtPackagingPrint(detail);
//       const actualSoldQty = getActualSoldQtyPrint(detail);
//       const uom3Name = detail.item?.uomThree?.uom || 'Crt';
//       const uom2 = detail.item?.uomTwo?.uom || 'n/a';
//       // alert(`the uom 2 are ${uom2}`)
//       tableRows += `
//         <tr>
//           <td>${index + 1}</td>
//           <td class="text-left item-name">${detail.item?.itemName || '-'}</td>
//           <td class="pkg-col">${crtPackaging}</td>
//           <td class="number-col">${row.crtSold} ${uom3Name}</td>
//           <td class="number-col">${actualSoldQty}</td>
//           <td class="">${row.tradePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} / ${uom2}</td>
//           <td class="text-right number-col">${row.payableGross.toLocaleString()}</td>
//           <td class="number-col">${row.disPercent}</td>
//           <td class="text-right discount-col">${row.disAmount.toLocaleString()}</td>
//           <td class="number-col">${row.dis2Percent}</td>
//           <td class="text-right discount-col">${row.dis2Amount.toLocaleString()}</td>
//           <td class="number-col">${row.schPercent}</td>
//           <td class="text-right discount-col">${row.schAmount.toLocaleString()}</td>
//           <td class="text-right net-col">${row.netPayable.toLocaleString()}</td>
//         </tr>
//       `;
//     });

//     printWindow.document.write(`
// <!DOCTYPE html>
// <html>
// <head>
// <title>Sales Voucher - ${gdn.Number}</title>
// <style>
// @page { size: A4 landscape; margin: 8mm; }
// * { margin: 0; padding: 0; box-sizing: border-box; }
// body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.4; color: #333; }
// .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2d5a27; padding-bottom: 10px; margin-bottom: 12px; }
// .header-info { display: flex; gap: 25px; font-size: 14px; }
// .header-info div { display: flex; gap: 6px; }
// .header-info strong { color: #2d5a27; }
// .customer-section { display: flex; justify-content: space-between; background: #f5f5f5; padding: 8px 12px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 12px; font-size: 14px; }
// .customer-left, .customer-right { display: flex; gap: 30px; }
// .customer-item strong { color: #2d5a27; }
// .customer-item2 { color: #2d5a27; font-weight: bold; font-size: 16px; }
// table { width: 99%; border-collapse: collapse; font-size: 12px; }
// th, td { border: 1px solid #888; padding: 8px 5px; text-align: center; }
// th { background: #2d5a27; color: white; font-weight: 700; font-size: 11px; text-transform: uppercase; }
// .text-left { text-align: left; padding-left: 6px; }
// .text-right { text-align: right; padding-right: 6px; }
// tr:nth-child(even) { background: #f9f9f9; }
// .item-name { font-weight: 600; font-size: 12px; }
// .pkg-col { font-size: 11px; color: #444; }
// .number-col { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; }
// .discount-col { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; color: #c0392b; }
// .net-col { font-weight: 700; color: #2d5a27; font-size: 12px; }
// .totals-row td { background: #d4edda; font-weight: 700; font-size: 12px; border-top: 3px solid #2d5a27; }
// .totals-row .label { text-align: right; padding-right: 10px; font-weight: 700; }
// .totals-row .discount-total { color: #c0392b; }
// .summary-section { display: flex; justify-content: flex-end; margin-top: 12px; margin-right:13px }
// .summary-box { width: 320px; border: 2px solid #2d5a27; border-radius: 6px; overflow: hidden; font-size: 14px; }
// .summary-row { display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #ddd; }
// .summary-row:last-child { border-bottom: none; background: #2d5a27; color: white; font-weight: bold; font-size: 16px; }
// .summary-row .value { font-weight: 700; font-family: 'Consolas', 'Courier New', monospace; }
// </style>
// </head>
// <body>
// <div class="header">
//   <div class="header-info">
//     <div><strong>Voucher:</strong> ${voucherNo || 'N/A'}</div>
//     <div><strong>Date:</strong> ${formatDatePrint(gdn.Date)}</div>
//     <div><strong>GDN:</strong> ${gdn.Number}</div>
//     <div><strong>Transporter:</strong> ${gdn.transporter?.name || 'N/A'}</div>
//     <div><strong>Bility No:</strong> ${gdn.bility_no || gdn.biltyNo || 'N/A'}</div>
//     <div><strong>Booked Crt:</strong> ${gdn.booked_crt || '0'}</div>
//   </div>
// </div>
// <div class="customer-section">
//   <div class="customer-left">
//     <div class="customer-item2"><strong>Customer:</strong> ${gdn.account?.acName || 'N/A'}</div>
//     <div class="customer-item2"><strong>City:</strong> ${gdn.account?.city || 'N/A'}</div>
//   </div>
//   <div class="customer-right">
//     <div class="customer-item2"><strong>Sub Customer:</strong> ${gdn.order?.sub_customer || 'N/A'}</div>
//     <div class="customer-item2"><strong>Sub City:</strong> ${gdn.order?.sub_city || 'N/A'}</div>
//   </div>
// </div>
// <table>
//   <thead>
//     <tr>
//       <th style="width:2%; color:black">SR</th>
//       <th style="width:12%; color:black " class="text-left">ITEM NAME</th>
//       <th style="width:8%; color:black  ">CRT PKG</th>
//       <th style="width:6%; color:black  ">CRT SOLD</th>
//       <th style="width:7%; color:black  ">Unit Sold</th>
//       <th style="width:12%; color:black ">PRICE</th>
//       <th style="width:11%; color:black ">PAYABLE GROSS</th>
//       <th style="width:4%; color:black  ">W/S%</th>
//       <th style="width:5%; color:black  ">W/S</th>
//       <th style="width:4%; color:black  ">DIS2%</th>
//       <th style="width:5%; color:black  ">DIST2</th>
//       <th style="width:4%; color:black  ">SCH%</th>
//       <th style="width:5%; color:black  ">SCH</th>
//       <th style="width:10%; color:black ">NET PAYABLE</th>
//     </tr>
//   </thead>
//   <tbody>
//     ${tableRows}
//     <tr class="totals-row">
//       <td colspan="3" class="label">TOTALS:</td>
//       <td class="text-right number-col">${totalCrtSold}</td>
//       <td></td>
//       <td></td>
//       <td class="text-right number-col">${totalPayableGross.toLocaleString()}</td>
//       <td></td>
//       <td class="text-right discount-total">${totalDisAmount.toLocaleString()}</td>
//       <td></td>
//       <td class="text-right discount-total">${totalDis2Amount.toLocaleString()}</td>
//       <td></td>
//       <td class="text-right discount-total">${totalSchAmount.toLocaleString()}</td>
//       <td class="text-right net-col">${totalNetPayable.toLocaleString()}</td>
//     </tr>
//   </tbody>
// </table>
// <div class="summary-section">
//   <div class="summary-box">
//     <div class="summary-row">
//         <span>Payable:</span><span class="value">${totalNetPayable.toLocaleString()}</span>
//     </div>
//     ${carriageAmount > 0 ? `<div class="summary-row"><span>Less:</span><span class="value">${carriageAmount.toLocaleString()}</span></div>` : ''}

//     <div class="summary-row" style="color:black">
//         <span>TOTAL NET Payable:</span><span class="value">${grandTotal.toLocaleString()}</span>
//     </div>
//   </div>
// </div>
// </body>
// </html>
//     `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//       onClose();
//     }, 300);
//   };

//   // PRINT MODE - Return null immediately
//   if (mode === 'print') {
//     return null;
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // VIEW MODE FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.toLocaleString('default', { month: 'short' });
//     const year = date.getFullYear().toString().slice(-2);
//     return `${day}/${month}/${year}`;
//   };

//   const getCrtPackaging = (detail: any) => {
//     const uom2Qty = parseFloat(detail.item?.uom2_qty) || 0;
//     const uom2Name = detail.item?.uomTwo?.uom;
//     const uom3Name = detail.item?.uomThree?.uom;
//     const uom3Qty = parseFloat(detail.item?.uom3_qty) || 0;
//     return `${uom3Qty / uom2Qty} ${uom2Name}/${uom3Name}`;
//   };

//   const getActualSoldQty = (detail: any) => {
//     const qty = parseFloat(detail.uom2_qty) || 0;
//     const uom = detail.item?.uomTwo?.uom || 'Box';
//     return `${Math.trunc(qty).toLocaleString()} ${uom}`;
//   };

//   // ✅ Returns TRUNCATED values at row level
//   const calculateRow = (detail: any) => {
//     const crtSold = parseFloat(detail.uom3_qty) || 0;
//     const tradePrice = parseFloat(detail.Stock_Price) || 0;
//     const uom2Qty = parseFloat(detail.uom2_qty) || 0;

//     const disPercent = parseFloat(detail.Discount_A) || 0;
//     const dis2Percent = parseFloat(detail.Discount_B) || 0;
//     const schPercent = parseFloat(detail.Discount_C) || 0;

//     const payableGrossRaw = uom2Qty * tradePrice;
//     const disAmountRaw = payableGrossRaw * (disPercent / 100);
//     const afterDis = payableGrossRaw - disAmountRaw;
//     const dis2AmountRaw = afterDis * (dis2Percent / 100);
//     const afterDis2 = afterDis - dis2AmountRaw;
//     const schAmountRaw = afterDis2 * (schPercent / 100);
//     const netPayableRaw = afterDis2 - schAmountRaw;

//     // ✅ Truncate at ROW level
//     return {
//       crtSold: Math.trunc(crtSold),
//       tradePrice,
//       payableGross: Math.trunc(payableGrossRaw),
//       disPercent,
//       disAmount: Math.trunc(disAmountRaw),
//       dis2Percent,
//       dis2Amount: Math.trunc(dis2AmountRaw),
//       schPercent,
//       schAmount: Math.trunc(schAmountRaw),
//       netPayable: Math.trunc(netPayableRaw)
//     };
//   };

//   const calculateCarriage = () => {
//     if (!gdn.Carriage_ID) return 0;
//     const labour = parseFloat(gdn.labour_crt || 0);
//     const freight = parseFloat(gdn.freight_crt || 0);
//     const bility = parseFloat(gdn.bility_expense || 0);
//     const other = parseFloat(gdn.other_expense || 0);
//     const booked = parseFloat(gdn.booked_crt || 0);
//     return Math.trunc((labour * booked) + (freight * booked) + bility + other);
//   };

//   const details = gdn.details || [];

//   let totalCrtSold = 0;
//   let totalPayableGross = 0;
//   let totalDisAmount = 0;
//   let totalDis2Amount = 0;
//   let totalSchAmount = 0;
//   let totalNetPayable = 0;

//   // ✅ Sum already-truncated values
//   details.forEach((detail: any) => {
//     const row = calculateRow(detail);
//     totalCrtSold += row.crtSold;
//     totalPayableGross += row.payableGross;
//     totalDisAmount += row.disAmount;
//     totalDis2Amount += row.dis2Amount;
//     totalSchAmount += row.schAmount;
//     totalNetPayable += row.netPayable;
//   });

//   const carriageAmount = calculateCarriage();
//   const grandTotal = totalNetPayable - carriageAmount;

//   // VIEW MODE - Render modal with voucher preview
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center px-6 py-4 border-b bg-emerald-50">
//           <h2 className="text-lg font-bold text-emerald-800">Sales Voucher Preview</h2>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={executePrint}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//             >
//               <Printer className="w-4 h-4" />
//               Print
//             </button>
//             <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div>

//         {/* Modal Content - Scrollable */}
//         <div className="flex-1 overflow-auto p-6 bg-gray-50">
//           {/* Header Info */}
//           <div className="flex justify-between items-center border-b-4 border-emerald-700 pb-3 mb-4">
//             <div className="flex gap-6 text-sm">
//               <div><span className="font-semibold text-emerald-700">Voucher:</span> {voucherNo || 'N/A'}</div>
//               <div><span className="font-semibold text-emerald-700">Date:</span> {formatDate(gdn.Date)}</div>
//               <div><span className="font-semibold text-emerald-700">GDN:</span> {gdn.Number}</div>
//               <div><span className="font-semibold text-emerald-700">Transporter:</span> {gdn.transporter?.name || 'N/A'}</div>
//               <div><span className="font-semibold text-emerald-700">Bility No:</span> {gdn.bility_no || gdn.biltyNo || 'N/A'}</div>
//             </div>
//           </div>

//           {/* Customer Info */}
//           <div className="flex justify-between bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4">
//             <div className="flex gap-8">
//               <div className="font-bold text-emerald-800">
//                 <span className="font-semibold">Customer:</span> {gdn.account?.acName || 'N/A'}
//               </div>
//               <div className="font-bold text-emerald-800">
//                 <span className="font-semibold">City:</span> {gdn.account?.city || 'N/A'}
//               </div>
//             </div>
//             <div className="flex gap-8">
//               <div className="font-bold text-emerald-800">
//                 <span className="font-semibold">Sub Customer:</span> {gdn.order?.sub_customer || 'N/A'}
//               </div>
//               <div className="font-bold text-emerald-800">
//                 <span className="font-semibold">Sub City:</span> {gdn.order?.sub_city || 'N/A'}
//               </div>
//             </div>
//           </div>

//           {/* Items Table */}
//           <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-4">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-emerald-700 text-white">
//                   <th className="px-3 py-2 text-center w-[3%]">SR</th>
//                   <th className="px-3 py-2 text-left w-[14%]">ITEM NAME</th>
//                   <th className="px-3 py-2 text-center w-[8%]">CRT PKG</th>
//                   <th className="px-3 py-2 text-center w-[7%]">CRT SOLD</th>
//                   <th className="px-3 py-2 text-center w-[8%]">UNIT SOLD</th>
//                   <th className="px-3 py-2 text-right w-[7%]">PRICE</th>
//                   <th className="px-3 py-2 text-right w-[9%]">PAYABLE GROSS</th>
//                   <th className="px-3 py-2 text-center w-[4%]">W/S%</th>
//                   <th className="px-3 py-2 text-right w-[6%]">W/S</th>
//                   <th className="px-3 py-2 text-center w-[4%]">DIS2%</th>
//                   <th className="px-3 py-2 text-right w-[6%]">DIST2</th>
//                   <th className="px-3 py-2 text-center w-[4%]">SCH%</th>
//                   <th className="px-3 py-2 text-right w-[6%]">SCH</th>
//                   <th className="px-3 py-2 text-right w-[10%]">NET PAYABLE</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {details.map((detail: any, index: number) => {
//                   const row = calculateRow(detail);
//                   const crtPackaging = getCrtPackaging(detail);
//                   const actualSoldQty = getActualSoldQty(detail);
//                   const uom3Name = detail.item?.uomThree?.uom || 'Crt';

//                   return (
//                     <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-3 py-2 text-center border-b">{index + 1}</td>
//                       <td className="px-3 py-2 text-left font-semibold border-b">{detail.item?.itemName || '-'}</td>
//                       <td className="px-3 py-2 text-center text-gray-600 border-b">{crtPackaging}</td>
//                       <td className="px-3 py-2 text-center font-mono border-b">{row.crtSold} {uom3Name}</td>
//                       <td className="px-3 py-2 text-center font-mono border-b">{actualSoldQty}</td>
//                       <td className="px-3 py-2 text-right font-mono border-b">{row.tradePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
//                       <td className="px-3 py-2 text-right font-mono border-b">{row.payableGross.toLocaleString()}</td>
//                       <td className="px-3 py-2 text-center font-mono border-b">{row.disPercent}</td>
//                       <td className="px-3 py-2 text-right font-mono text-red-600 border-b">{row.disAmount.toLocaleString()}</td>
//                       <td className="px-3 py-2 text-center font-mono border-b">{row.dis2Percent}</td>
//                       <td className="px-3 py-2 text-right font-mono text-red-600 border-b">{row.dis2Amount.toLocaleString()}</td>
//                       <td className="px-3 py-2 text-center font-mono border-b">{row.schPercent}</td>
//                       <td className="px-3 py-2 text-right font-mono text-red-600 border-b">{row.schAmount.toLocaleString()}</td>
//                       <td className="px-3 py-2 text-right font-mono font-bold text-emerald-700 border-b">{row.netPayable.toLocaleString()}</td>
//                     </tr>
//                   );
//                 })}
//                 {/* Totals Row */}
//                 <tr className="bg-green-100 font-bold border-t-4 border-emerald-700">
//                   <td colSpan={3} className="px-3 py-3 text-right">TOTALS:</td>
//                   <td className="px-3 py-3 text-center font-mono">{totalCrtSold}</td>
//                   <td></td>
//                   <td></td>
//                   <td className="px-3 py-3 text-right font-mono">{totalPayableGross.toLocaleString()}</td>
//                   <td></td>
//                   <td className="px-3 py-3 text-right font-mono text-red-600">{totalDisAmount.toLocaleString()}</td>
//                   <td></td>
//                   <td className="px-3 py-3 text-right font-mono text-red-600">{totalDis2Amount.toLocaleString()}</td>
//                   <td></td>
//                   <td className="px-3 py-3 text-right font-mono text-red-600">{totalSchAmount.toLocaleString()}</td>
//                   <td className="px-3 py-3 text-right font-mono text-emerald-700">{totalNetPayable.toLocaleString()}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Summary Box */}
//           <div className="flex justify-start">
//             <div className="w-80 border-2 border-emerald-700 rounded-lg overflow-hidden">
//               <div className="flex justify-between px-4 py-3 border-b border-gray-200">
//                 <span>Payable:</span>
//                 <span className="font-bold font-mono">{totalNetPayable.toLocaleString()}</span>
//               </div>
//               {carriageAmount > 0 && (
//                 <div className="flex justify-between px-4 py-3 border-b border-gray-200">
//                   <span>Less:</span>
//                   <span className="font-bold font-mono">{carriageAmount.toLocaleString()}</span>
//                 </div>
//               )}
//               <div className="flex justify-between px-4 py-3 bg-emerald-700 text-white font-bold text-lg">
//                 <span>TOTAL NET Payable:</span>
//                 <span className="font-mono">{grandTotal.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesVoucherPrintModal;

















































































































// components/SalesVoucherPrintModal.tsx
import React, { useEffect } from 'react';
import { X, Printer } from 'lucide-react';

interface SalesVoucherPrintModalProps {
  gdn: any;
  voucherNo?: string;
  mode?: 'view' | 'print';
  onClose: () => void;
}

const SalesVoucherPrintModal: React.FC<SalesVoucherPrintModalProps> = ({ gdn, voucherNo, mode = 'print', onClose }) => {

  // PRINT MODE - Handle print immediately
  useEffect(() => {
    if (mode === 'print') {
      executePrint();
    }
  }, []);

  const executePrint = () => {
    const details = gdn.details || [];

    let totalCrtSold = 0;
    let totalPayableGross = 0;
    let totalDisAmount = 0;
    let totalDis2Amount = 0;
    let totalSchAmount = 0;
    let totalNetPayable = 0;

    const formatDatePrint = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      return `${day}/${month}/${year}`;
    };

    const getCrtPackagingPrint = (detail: any) => {
      const uom2Qty = parseFloat(detail.item?.uom2_qty) || 0;
      const uom3Qty = parseFloat(detail.item?.uom3_qty) || 0;
      const uom2Name = detail.item?.uomTwo?.uom;
      const uom3Name = detail.item?.uomThree?.uom;
      return `${uom3Qty / uom2Qty} ${uom2Name}/${uom3Name}`;
    };

    const getActualSoldQtyPrint = (detail: any) => {
      const qty = parseFloat(detail.uom2_qty) || 0;
      const uom = detail.item?.uomTwo?.uom || 'Box';
      return `${Math.trunc(qty).toLocaleString()} ${uom}`;
    };

    const calculateRowPrint = (detail: any) => {
      const crtSold = parseFloat(detail.uom3_qty) || 0;
      const tradePrice = parseFloat(detail.Stock_Price) || 0;
      const uom2Qty = parseFloat(detail.uom2_qty) || 0;
      const disPercent = parseFloat(detail.Discount_A) || 0;
      const dis2Percent = parseFloat(detail.Discount_B) || 0;
      const schPercent = parseFloat(detail.Discount_C) || 0;

      const payableGrossRaw = uom2Qty * tradePrice;
      const disAmountRaw = payableGrossRaw * (disPercent / 100);
      const afterDis = payableGrossRaw - disAmountRaw;
      const dis2AmountRaw = afterDis * (dis2Percent / 100);
      const afterDis2 = afterDis - dis2AmountRaw;
      const schAmountRaw = afterDis2 * (schPercent / 100);
      const netPayableRaw = afterDis2 - schAmountRaw;

      return {
        crtSold: Math.trunc(crtSold),
        tradePrice,
        payableGross: Math.trunc(payableGrossRaw),
        disPercent,
        disAmount: Math.trunc(disAmountRaw),
        dis2Percent,
        dis2Amount: Math.trunc(dis2AmountRaw),
        schPercent,
        schAmount: Math.trunc(schAmountRaw),
        netPayable: Math.trunc(netPayableRaw)
      };
    };

    const calculateCarriagePrint = () => {
      if (!gdn.Carriage_ID) return 0;
      const labour = parseFloat(gdn.labour_crt || 0);
      const freight = parseFloat(gdn.freight_crt || 0);
      const bility = parseFloat(gdn.bility_expense || 0);
      const other = parseFloat(gdn.other_expense || 0);
      const booked = parseFloat(gdn.booked_crt || 0);
      return Math.trunc((labour * booked) + (freight * booked) + bility + other);
    };

    details.forEach((detail: any) => {
      const row = calculateRowPrint(detail);
      totalCrtSold += row.crtSold;
      totalPayableGross += row.payableGross;
      totalDisAmount += row.disAmount;
      totalDis2Amount += row.dis2Amount;
      totalSchAmount += row.schAmount;
      totalNetPayable += row.netPayable;
    });

    const carriageAmount = calculateCarriagePrint();
    const grandTotal = totalNetPayable - carriageAmount;

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert('Please allow popups for printing');
      onClose();
      return;
    }

    let tableRows = '';
    details.forEach((detail: any, index: number) => {
      const row = calculateRowPrint(detail);
      const crtPackaging = getCrtPackagingPrint(detail);
      const actualSoldQty = getActualSoldQtyPrint(detail);
      const uom3Name = detail.item?.uomThree?.uom || 'Crt';
      const uom2 = detail.item?.uomTwo?.uom || 'n/a';

      tableRows += `
        <tr style="background-color: ${index % 2 === 0 ? '#fff' : '#f5f5f5'};">
          <td>${index + 1}</td>
          <td class="text-left item-name">${detail.item?.itemName || '-'}</td>
          <td class="pkg-col">${crtPackaging}</td>
          <td class="number-col">${row.crtSold} ${uom3Name}</td>
          <td class="number-col">${actualSoldQty}</td>
          <td class="">${row.tradePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} / ${uom2}</td>
          <td class="text-right number-col">${row.payableGross.toLocaleString()}</td>
          <td class="number-col">${row.disPercent}</td>
          <td class="text-right number-col">${row.disAmount.toLocaleString()}</td>
          <td class="number-col">${row.dis2Percent}</td>
          <td class="text-right number-col">${row.dis2Amount.toLocaleString()}</td>
          <td class="number-col">${row.schPercent}</td>
          <td class="text-right number-col">${row.schAmount.toLocaleString()}</td>
          <td class="text-right net-col">${row.netPayable.toLocaleString()}</td>
        </tr>
      `;
    });

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Sales Voucher - ${gdn.Number}</title>
<style>
@page { size: A4 landscape; margin: 8mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.4; color: #000; }

.header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  border-bottom: 3px solid #000; 
  padding-bottom: 12px; 
  margin-bottom: 15px; 
}
.header-info { display: flex; gap: 25px; font-size: 14px; color: #000; }
.header-info div { display: flex; gap: 6px; }
.header-info strong { color: #000; font-weight: 700; }

.customer-section { 
  display: flex; 
  justify-content: space-between; 
  background: #f0f0f0; 
  padding: 12px 15px; 
  border: 2px solid #000; 
  border-radius: 10px; 
  margin-bottom: 15px; 
  font-size: 14px; 
}
.customer-left, .customer-right { display: flex; gap: 30px; }
.customer-item strong { color: #000; font-weight: 700; }
.customer-item2 { color: #000; font-weight: bold; font-size: 15px; }

.table-container { 
  border-radius: 10px; 
  overflow: hidden; 
  border: 2px solid #000; 
}
table { width: 100%; border-collapse: collapse; font-size: 13px; color: #000; }
th, td { border-bottom: 1px solid #999; padding: 10px 6px; text-align: center; }
th { 
  background: #d0d0d0; 
  color: #000; 
  font-weight: 700; 
  font-size: 11px; 
  text-transform: uppercase; 
  border-bottom: 2px solid #000;
}
.text-left { text-align: left; padding-left: 8px; }
.text-right { text-align: right; padding-right: 8px; }
.item-name { font-weight: 600; font-size: 13px; color: #000; }
.pkg-col { font-size: 12px; color: #000; }
.number-col { font-family: 'Consolas', 'Courier New', monospace; font-size: 13px; color: #000; }
.net-col { font-weight: 700; color: #000; font-size: 13px; }

.totals-row td { 
  background: #c0c0c0; 
  font-weight: 700; 
  font-size: 13px; 
  border-top: 3px solid #000; 
  color: #000; 
}
.totals-row .label { text-align: right; padding-right: 10px; font-weight: 700; }

.summary-section { display: flex; justify-content: flex-end; margin-top: 15px; margin-right: 13px; }
.summary-box { 
  width: 340px; 
  border: 2px solid #000; 
  border-radius: 10px; 
  overflow: hidden; 
  font-size: 14px; 
}
.summary-row { 
  display: flex; 
  justify-content: space-between; 
  padding: 10px 18px; 
  border-bottom: 1px solid #999; 
  color: #000; 
}
.summary-row:last-child { 
  border-bottom: none; 
  background: #c0c0c0; 
  color: #000; 
  font-weight: bold; 
  font-size: 16px; 
}
.summary-row .value { font-weight: 700; font-family: 'Consolas', 'Courier New', monospace; }
</style>
</head>
<body>
<div class="header">
  <div class="header-info">
    <div><strong>Voucher:</strong> ${voucherNo || 'N/A'}</div>
    <div><strong>Date:</strong> ${formatDatePrint(gdn.Date)}</div>
    <div><strong>GDN:</strong> ${gdn.Number}</div>
    <div><strong>Transporter:</strong> ${gdn.transporter?.name || 'N/A'}</div>
    <div><strong>Bility No:</strong> ${gdn.bility_no || gdn.biltyNo || 'N/A'}</div>
    <div><strong>Booked Crt:</strong> ${gdn.booked_crt || '0'}</div>
  </div>
</div>
<div class="customer-section">
  <div class="customer-left">
    <div class="customer-item2"><strong>Customer:</strong> ${gdn.account?.acName || 'N/A'}</div>
    <div class="customer-item2"><strong>City:</strong> ${gdn.account?.city || 'N/A'}</div>
  </div>
  <div class="customer-right">
    <div class="customer-item2"><strong>Sub Customer:</strong> ${gdn.order?.sub_customer || 'N/A'}</div>
    <div class="customer-item2"><strong>Sub City:</strong> ${gdn.order?.sub_city || 'N/A'}</div>
  </div>
</div>
<div class="table-container">
<table>
  <thead>
    <tr>
      <th style="width:2%">SR</th>
      <th style="width:12%" class="text-left">ITEM NAME</th>
      <th style="width:8%">CRT PKG</th>
      <th style="width:6%">CRT SOLD</th>
      <th style="width:7%">Unit Sold</th>
      <th style="width:12%">PRICE</th>
      <th style="width:11%">PAYABLE GROSS</th>
      <th style="width:4%">W/S%</th>
      <th style="width:5%">W/S</th>
      <th style="width:4%">DIS2%</th>
      <th style="width:5%">DIST2</th>
      <th style="width:4%">SCH%</th>
      <th style="width:5%">SCH</th>
      <th style="width:10%">NET PAYABLE</th>
    </tr>
  </thead>
  <tbody>
    ${tableRows}
    <tr class="totals-row">
      <td colspan="3" class="label">TOTALS:</td>
      <td class="text-right number-col">${totalCrtSold}</td>
      <td></td>
      <td></td>
      <td class="text-right number-col">${totalPayableGross.toLocaleString()}</td>
      <td></td>
      <td class="text-right">${totalDisAmount.toLocaleString()}</td>
      <td></td>
      <td class="text-right">${totalDis2Amount.toLocaleString()}</td>
      <td></td>
      <td class="text-right">${totalSchAmount.toLocaleString()}</td>
      <td class="text-right net-col">${totalNetPayable.toLocaleString()}</td>
    </tr>
  </tbody>
</table>
</div>
<div class="summary-section">
  <div class="summary-box">
    <div class="summary-row">
        <span>Payable:</span><span class="value">${totalNetPayable.toLocaleString()}</span>
    </div>
    ${carriageAmount > 0 ? `<div class="summary-row"><span>Less:</span><span class="value">${carriageAmount.toLocaleString()}</span></div>` : ''}
    <div class="summary-row">
        <span>TOTAL NET Payable:</span><span class="value">${grandTotal.toLocaleString()}</span>
    </div>
  </div>
</div>
</body>
</html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      onClose();
    }, 300);
  };

  // PRINT MODE - Return null immediately
  if (mode === 'print') {
    return null;
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW MODE FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getCrtPackaging = (detail: any) => {
    const uom2Qty = parseFloat(detail.item?.uom2_qty) || 0;
    const uom2Name = detail.item?.uomTwo?.uom;
    const uom3Name = detail.item?.uomThree?.uom;
    const uom3Qty = parseFloat(detail.item?.uom3_qty) || 0;
    return `${uom3Qty / uom2Qty} ${uom2Name}/${uom3Name}`;
  };

  const getActualSoldQty = (detail: any) => {
    const qty = parseFloat(detail.uom2_qty) || 0;
    const uom = detail.item?.uomTwo?.uom || 'Box';
    return `${Math.trunc(qty).toLocaleString()} ${uom}`;
  };

  const calculateRow = (detail: any) => {
    const crtSold = parseFloat(detail.uom3_qty) || 0;
    const tradePrice = parseFloat(detail.Stock_Price) || 0;
    const uom2Qty = parseFloat(detail.uom2_qty) || 0;

    const disPercent = parseFloat(detail.Discount_A) || 0;
    const dis2Percent = parseFloat(detail.Discount_B) || 0;
    const schPercent = parseFloat(detail.Discount_C) || 0;

    const payableGrossRaw = uom2Qty * tradePrice;
    const disAmountRaw = payableGrossRaw * (disPercent / 100);
    const afterDis = payableGrossRaw - disAmountRaw;
    const dis2AmountRaw = afterDis * (dis2Percent / 100);
    const afterDis2 = afterDis - dis2AmountRaw;
    const schAmountRaw = afterDis2 * (schPercent / 100);
    const netPayableRaw = afterDis2 - schAmountRaw;

    return {
      crtSold: Math.trunc(crtSold),
      tradePrice,
      payableGross: Math.trunc(payableGrossRaw),
      disPercent,
      disAmount: Math.trunc(disAmountRaw),
      dis2Percent,
      dis2Amount: Math.trunc(dis2AmountRaw),
      schPercent,
      schAmount: Math.trunc(schAmountRaw),
      netPayable: Math.trunc(netPayableRaw)
    };
  };

  const calculateCarriage = () => {
    if (!gdn.Carriage_ID) return 0;
    const labour = parseFloat(gdn.labour_crt || 0);
    const freight = parseFloat(gdn.freight_crt || 0);
    const bility = parseFloat(gdn.bility_expense || 0);
    const other = parseFloat(gdn.other_expense || 0);
    const booked = parseFloat(gdn.booked_crt || 0);
    return Math.trunc((labour * booked) + (freight * booked) + bility + other);
  };

  const details = gdn.details || [];

  let totalCrtSold = 0;
  let totalPayableGross = 0;
  let totalDisAmount = 0;
  let totalDis2Amount = 0;
  let totalSchAmount = 0;
  let totalNetPayable = 0;

  details.forEach((detail: any) => {
    const row = calculateRow(detail);
    totalCrtSold += row.crtSold;
    totalPayableGross += row.payableGross;
    totalDisAmount += row.disAmount;
    totalDis2Amount += row.dis2Amount;
    totalSchAmount += row.schAmount;
    totalNetPayable += row.netPayable;
  });

  const carriageAmount = calculateCarriage();
  const grandTotal = totalNetPayable - carriageAmount;

  // VIEW MODE - Render modal with voucher preview
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-black bg-gray-100">
          <h2 className="text-xl font-bold text-black">Sales Voucher Preview</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={executePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-semibold transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-300 rounded-xl transition-colors">
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {/* Header Info */}
          <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-5">
            <div className="flex gap-6 text-sm">
              <div className="text-black"><span className="font-bold">Voucher:</span> {voucherNo || 'N/A'}</div>
              <div className="text-black"><span className="font-bold">Date:</span> {formatDate(gdn.Date)}</div>
              <div className="text-black"><span className="font-bold">GDN:</span> {gdn.Number}</div>
              <div className="text-black"><span className="font-bold">Transporter:</span> {gdn.transporter?.name || 'N/A'}</div>
              <div className="text-black"><span className="font-bold">Bility No:</span> {gdn.bility_no || gdn.biltyNo || 'N/A'}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex justify-between bg-gray-200 border-2 border-black rounded-xl px-5 py-4 mb-5">
            <div className="flex gap-10">
              <div className="font-bold text-black text-base">
                <span className="font-bold">Customer:</span> {gdn.account?.acName || 'N/A'}
              </div>
              <div className="font-bold text-black text-base">
                <span className="font-bold">City:</span> {gdn.account?.city || 'N/A'}
              </div>
            </div>
            <div className="flex gap-10">
              <div className="font-bold text-black text-base">
                <span className="font-bold">Sub Customer:</span> {gdn.order?.sub_customer || 'N/A'}
              </div>
              <div className="font-bold text-black text-base">
                <span className="font-bold">Sub City:</span> {gdn.order?.sub_city || 'N/A'}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white border-2 border-black rounded-xl overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-300">
                  <th className="px-3 py-3 text-center w-[3%] text-black font-bold border-b-2 border-black">SR</th>
                  <th className="px-3 py-3 text-left w-[14%] text-black font-bold border-b-2 border-black">ITEM NAME</th>
                  <th className="px-3 py-3 text-center w-[8%] text-black font-bold border-b-2 border-black">CRT PKG</th>
                  <th className="px-3 py-3 text-center w-[7%] text-black font-bold border-b-2 border-black">CRT SOLD</th>
                  <th className="px-3 py-3 text-center w-[8%] text-black font-bold border-b-2 border-black">UNIT SOLD</th>
                  <th className="px-3 py-3 text-right w-[7%] text-black font-bold border-b-2 border-black">PRICE</th>
                  <th className="px-3 py-3 text-right w-[9%] text-black font-bold border-b-2 border-black">PAYABLE GROSS</th>
                  <th className="px-3 py-3 text-center w-[4%] text-black font-bold border-b-2 border-black">W/S%</th>
                  <th className="px-3 py-3 text-right w-[6%] text-black font-bold border-b-2 border-black">W/S</th>
                  <th className="px-3 py-3 text-center w-[4%] text-black font-bold border-b-2 border-black">DIS2%</th>
                  <th className="px-3 py-3 text-right w-[6%] text-black font-bold border-b-2 border-black">DIST2</th>
                  <th className="px-3 py-3 text-center w-[4%] text-black font-bold border-b-2 border-black">SCH%</th>
                  <th className="px-3 py-3 text-right w-[6%] text-black font-bold border-b-2 border-black">SCH</th>
                  <th className="px-3 py-3 text-right w-[10%] text-black font-bold border-b-2 border-black">NET PAYABLE</th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail: any, index: number) => {
                  const row = calculateRow(detail);
                  const crtPackaging = getCrtPackaging(detail);
                  const actualSoldQty = getActualSoldQty(detail);
                  const uom3Name = detail.item?.uomThree?.uom || 'Crt';

                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="px-3 py-3 text-center border-b border-gray-400 text-black">{index + 1}</td>
                      <td className="px-3 py-3 text-left font-semibold border-b border-gray-400 text-black">{detail.item?.itemName || '-'}</td>
                      <td className="px-3 py-3 text-center border-b border-gray-400 text-black">{crtPackaging}</td>
                      <td className="px-3 py-3 text-center font-mono border-b border-gray-400 text-black">{row.crtSold} {uom3Name}</td>
                      <td className="px-3 py-3 text-center font-mono border-b border-gray-400 text-black">{actualSoldQty}</td>
                      <td className="px-3 py-3 text-right font-mono border-b border-gray-400 text-black">{row.tradePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-3 text-right font-mono border-b border-gray-400 text-black">{row.payableGross.toLocaleString()}</td>
                      <td className="px-3 py-3 text-center font-mono border-b border-gray-400 text-black">{row.disPercent}</td>
                      <td className="px-3 py-3 text-right font-mono border-b border-gray-400 text-black">{row.disAmount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-center font-mono border-b border-gray-400 text-black">{row.dis2Percent}</td>
                      <td className="px-3 py-3 text-right font-mono border-b border-gray-400 text-black">{row.dis2Amount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-center font-mono border-b border-gray-400 text-black">{row.schPercent}</td>
                      <td className="px-3 py-3 text-right font-mono border-b border-gray-400 text-black">{row.schAmount.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold border-b border-gray-400 text-black">{row.netPayable.toLocaleString()}</td>
                    </tr>
                  );
                })}
                {/* Totals Row */}
                <tr className="bg-gray-300 font-bold border-t-4 border-black">
                  <td colSpan={3} className="px-3 py-4 text-right text-black text-base">TOTALS:</td>
                  <td className="px-3 py-4 text-center font-mono text-black">{totalCrtSold}</td>
                  <td></td>
                  <td></td>
                  <td className="px-3 py-4 text-right font-mono text-black">{totalPayableGross.toLocaleString()}</td>
                  <td></td>
                  <td className="px-3 py-4 text-right font-mono text-black">{totalDisAmount.toLocaleString()}</td>
                  <td></td>
                  <td className="px-3 py-4 text-right font-mono text-black">{totalDis2Amount.toLocaleString()}</td>
                  <td></td>
                  <td className="px-3 py-4 text-right font-mono text-black">{totalSchAmount.toLocaleString()}</td>
                  <td className="px-3 py-4 text-right font-mono text-black font-bold">{totalNetPayable.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div className="flex justify-end">
            <div className="w-96 border-2 border-black rounded-xl overflow-hidden">
              <div className="flex justify-between px-5 py-4 border-b border-gray-400 text-black">
                <span className="font-semibold">Payable:</span>
                <span className="font-bold font-mono">{totalNetPayable.toLocaleString()}</span>
              </div>
              {carriageAmount > 0 && (
                <div className="flex justify-between px-5 py-4 border-b border-gray-400 text-black">
                  <span className="font-semibold">Less:</span>
                  <span className="font-bold font-mono">{carriageAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between px-5 py-4 bg-gray-300 text-black font-bold text-lg">
                <span>TOTAL NET Payable:</span>
                <span className="font-mono">{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesVoucherPrintModal;
