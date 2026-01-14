module.exports = {
  development: {
    username: 'root',
    password: '@mysql123',
    database: 'newschema_check',
    host: 'localhost',
    dialect: 'mysql'
  }
};





























// import React from 'react';

// function DispatchPrintModal({ dispatch, onClose }) {

//   const formatMyDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.getDate()}/${date.toLocaleString('default', { month: 'short' })}/${date.getFullYear().toString().slice(-2)}`;
//   };

//   const labourCrt = parseFloat(dispatch.labour_crt || 0);
//   const freightCrt = parseFloat(dispatch.freight_crt || 0);
//   const bilityExpense = parseFloat(dispatch.bility_expense || 0);
//   const otherExpense = parseFloat(dispatch.other_expense || 0);
//   const bookedCrt = parseFloat(dispatch.booked_crt || 0);

//   const totalLabourCost = labourCrt * bookedCrt;
//   const totalFreightCost = freightCrt * bookedCrt;
//   const totalCarriage = totalLabourCost + totalFreightCost + bilityExpense + otherExpense;

//   const getSelectedUomAndQuantity = (detail) => {
//     const stockOutUom = parseInt(detail.Stock_out_UOM) || parseInt(detail.Sale_Unit);
//     if (stockOutUom === 1) return { quantity: parseFloat(detail.Stock_out_UOM_Qty) || 0, uom: detail.item?.uom1?.uom || 'Pkt' };
//     if (stockOutUom === 2) return { quantity: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0, uom: detail.item?.uomTwo?.uom || 'Box' };
//     if (stockOutUom === 3) return { quantity: parseFloat(detail.Stock_out_UOM3_Qty) || 0, uom: detail.item?.uomThree?.uom || 'Crt' };
//     return { quantity: parseFloat(detail.Stock_out_UOM_Qty) || 0, uom: detail.item?.uom1?.uom || 'Unit' };
//   };

//   const sortedDetails = [...(dispatch.details || [])].sort((a, b) => {
//     const batchA = a.batchDetails?.acName || '';
//     const batchB = b.batchDetails?.acName || '';
//     return batchA.localeCompare(batchB);
//   });

//   const uomTotals = {};
//   sortedDetails.forEach(d => {
//     const { quantity, uom } = getSelectedUomAndQuantity(d);
//     uomTotals[uom] = (uomTotals[uom] || 0) + quantity;
//   });
//   const totalDisplay = Object.entries(uomTotals).map(([u, q]) => `${q} ${u}`).join(', ');

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return;

//     let rows = '';
//     for (let i = 0; i < sortedDetails.length; i++) {
//       const d = sortedDetails[i];
//       const q = getSelectedUomAndQuantity(d);
//       rows += '<tr><td class="c">' + (i + 1) + '</td><td class="batch">' + (d.batchDetails?.acName || 'N/A') + '</td><td>' + (d.item?.itemName || '') + '</td><td class="r">' + q.quantity + ' ' + q.uom + '</td></tr>';
//     }

//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
// <style>
// @page { size: A4; margin: 10mm; }
// @media print {
//   html, body { height: 100%; }
//   .wrapper { min-height: 100%; display: flex; flex-direction: column; }
//   .content { flex: 1; }
//   .footer { margin-top: auto; }
//   thead { display: table-header-group; }
//   tr { page-break-inside: avoid; }
// }
// * { margin: 0; padding: 0; box-sizing: border-box; }
// body { font-family: Arial, sans-serif; font-size: 13px; }

// .wrapper { min-height: 100vh; display: flex; flex-direction: column;  }
// .content { flex: 1; border-raduis:10px }
// .footer { margin-top: auto; padding-top: 12px; }

// .title-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #155724; padding-bottom: 6px; margin-bottom: 8px; }
// .gdn { font-size: 22px; font-weight: bold; color: #155724; background: #d4edda; padding: 4px 12px; border-radius: 6px; }
// .info-row { display: flex; gap: 15px; margin-bottom: 6px; font-size: 13px; flex-wrap: wrap; }

// /* ✅ Transport & Cost Grid - Same as GDN_Header */
// .cost-grid {
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   gap: 8px;
//   background: #f8f9fa;
//   padding: 8px 10px;
//   border-radius: 6px;
//   margin-bottom: 8px;
//   font-size: 11px;
// }
// .cost-item { }
// .cost-label { font-weight: bold; color: #555; font-size: 10px; text-transform: uppercase; }
// .cost-value { font-size: 13px; font-weight: 600; color: #333; }
// .cost-total { color: #059669; font-size: 11px; margin-top: 2px; }

// /* ✅ Totals Row */
// .totals-row {
//   display: flex;
//   gap: 15px;
//   background: #e8e8e8;
//   padding: 8px 12px;
//   border-radius: 6px;
//   margin-bottom: 10px;
//   font-size: 12px;
//   align-items: center;
//   flex-wrap: wrap;
// }
// .total-badge { 
//   background: #155724; 
//   color: #fff; 
//   padding: 5px 12px; 
//   border-radius: 5px; 
//   font-weight: bold;
//   margin-left: auto;
// }
// /* ✅ Table with rounded corners */
// table { 
//   width: 100%; 
//   border-collapse: separate;
//   border-spacing: 0;
//   border: 2px solid #333;
//   border-radius: 10px;
//   overflow: hidden;
// }

// th { 
//   background: #e0e0e0; 
//   padding: 10px 8px; 
//   font-size: 12px; 
//   text-transform: uppercase; 
//   border-bottom: 2px solid #333;
//   text-align: center; 
//   font-weight: bold; 
// }

// th:not(:last-child) {
//   border-right: 1px solid #ccc;
// }

// td { 
//   padding: 8px; 
//   font-size: 13px; 
//   border-bottom: 1px solid #ccc;
// }

// td:not(:last-child) {
//   border-right: 1px solid #ccc;
// }

// tr:last-child td {
//   border-bottom: none;
// }

// .c { text-align: center; }
// .r { text-align: right; }
// .batch { font-weight: 600; color: #0066cc; font-size: 14px; }

// .total-row { background: #d4edda; }
// .total-row td { 
//   font-weight: bold; 
//   padding: 12px 8px; 
//   font-size: 14px; 
// }


// /* ✅ Footer */
// .remarks { border: 2px solid #333; border-radius: 8px; min-height: 55px; padding: 8px 12px; margin-bottom: 12px; font-size: 12px; }
// .sigs { display: flex; gap: 20px; }
// .sig { flex: 1; border: 2px solid #333; border-radius: 8px; min-height: 35px; padding: 8px 12px; font-size: 12px; font-weight: bold; }
// </style>
// </head>
// <body>

// <div class="wrapper">
//   <div class="content">
//     <!-- Title Row -->
//     <div class="title-row">
//       <div style="display:flex;gap:20px;font-size:14px;">
//         <span><b>Date:</b> ${formatMyDate(dispatch.Date)}</span>
//         <span><b>S.O:</b> ${dispatch.order?.Number || 'N/A'}</span>
//       </div>
//       <div class="gdn">${dispatch.Number}</div>
//     </div>

//     <!-- Customer Info -->
//     <div class="info-row">
//       <span><b>Customer:</b> ${dispatch.account?.acName || 'N/A'}</span>
//       <span><b>Setup:</b> ${dispatch.account?.setupName || 'N/A'}</span>
//       <span><b>City:</b> ${dispatch.account?.city || 'N/A'}</span>
//     </div>
//     <div class="info-row">
//       <span><b>Sub Cust:</b> ${dispatch.order?.sub_customer || 'N/A'}</span>
//       <span><b>Sub City:</b> ${dispatch.order?.sub_city || 'N/A'}</span>
//     </div>

//     <!-- ✅ Cost Grid - Same Layout as GDN_Header -->
//     <div class="cost-grid">
//       <div class="cost-item">
//         <div class="cost-label">Transporter</div>
//         <div class="cost-value">${dispatch.transporter?.name || 'N/A'}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Booked Crts</div>
//         <div class="cost-value">${Math.round(bookedCrt)}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Freight /Crt</div>
//         <div class="cost-value">${freightCrt.toLocaleString()}</div>
//         <div class="cost-total">= ${totalFreightCost.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Labour /Crt</div>
//         <div class="cost-value">${labourCrt.toLocaleString()}</div>
//         <div class="cost-total">= ${totalLabourCost.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Bilty</div>
//         <div class="cost-value">${bilityExpense.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Other</div>
//         <div class="cost-value">${otherExpense.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//       <div class="cost-label">Total Carriage</div>
//          <span class="cost-value"> ${totalCarriage.toLocaleString()}</span>
//       </div>
//     </div>

//     <!-- Totals Row -->
   

//     <!-- Table -->
//     <table>
//       <thead>
//         <tr>
//           <th style="width:6%">SR#</th>
//           <th style="width:34%">BATCH</th>
//           <th style="width:40%">ITEM NAME</th>
//           <th style="width:30%">QTY</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${rows}
//         <tr class="total-row">
//           <td colspan="2"><b>TOTAL QUANTITY</b></td>
//           <td colspan="2" class="r"><b>${totalDisplay}</b></td>
//         </tr>
//       </tbody>
//     </table>
//   </div>

//   <div class="footer">
//     <div class="remarks"><b>Remarks:</b></div>
//     <div class="sigs">
//       <div class="sig">Discharged by:</div>
//       <div class="sig">Entered by:</div>
//     </div>
//   </div>
// </div>

// </body>
// </html>`;

//     printWindow.document.write(html);
//     printWindow.document.close();
//     setTimeout(function() {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     }, 300);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-96">
//         <div className="p-6">
//           <h3 className="text-xl font-bold mb-2">Print Dispatch</h3>
//           <div className="mb-4 p-3 bg-gray-100 rounded-lg">
//             <p className="font-semibold text-green-700">{dispatch.Number}</p>
//             <p className="text-gray-600 text-sm">{dispatch.account?.acName}</p>
//             <p className="text-gray-500 text-xs mt-1">{sortedDetails.length} items</p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium">Cancel</button>
//             <button onClick={handlePrint} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Print</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DispatchPrintModal;























































// issue

// import React from 'react';

// const DispatchPrintModal = ({ dispatch, onClose }) => {

//   const formatMyDate = (dateString) => {
//     const parts = dateString.split('/');
//     const date = new Date(parts[2], parts[1] - 1, parts[0]);
//     const day = date.getDate();
//     const month = date.toLocaleString('default', { month: 'short' });
//     const year = date.getFullYear().toString().slice(-2);
//     return `${day}/${month}/${year}`;
//   };

//   const date = new Date(dispatch.Date).toLocaleDateString();

//   // Calculate totals
//   const labourCrt = parseFloat(dispatch.labour_crt || 0);
//   const freightCrt = parseFloat(dispatch.freight_crt || 0);
//   const bilityExpense = parseFloat(dispatch.bility_expense || 0);
//   const otherExpense = parseFloat(dispatch.other_expense || 0);
//   const bookedCrt = parseFloat(dispatch.booked_crt || 0);

//   const totalLabourCost = labourCrt * bookedCrt;
//   const totalFreightCost = freightCrt * bookedCrt;
//   const totalCarriage = totalLabourCost + totalFreightCost + bilityExpense + otherExpense;

//   const getSelectedUomAndQuantity = (detail) => {
//     const stockOutUom = parseInt(detail.Stock_out_UOM) || parseInt(detail.Sale_Unit);
//     if (stockOutUom === 1) return { quantity: parseFloat(detail.Stock_out_UOM_Qty) || parseFloat(detail.uom1_qty) || 0, uom: detail.item?.uom1?.uom || 'Pkt' };
//     if (stockOutUom === 2) return { quantity: parseFloat(detail.Stock_out_SKU_UOM_Qty) || parseFloat(detail.uom2_qty) || 0, uom: detail.item?.uomTwo?.uom || 'Box' };
//     if (stockOutUom === 3) return { quantity: parseFloat(detail.Stock_out_UOM3_Qty) || parseFloat(detail.uom3_qty) || 0, uom: detail.item?.uomThree?.uom || 'Crt' };
//     return { quantity: parseFloat(detail.Stock_out_UOM_Qty) || parseFloat(detail.uom1_qty) || 0, uom: detail.item?.uom1?.uom || 'Unit' };
//   };

//   // Sort details by batch name
//   const sortedDetails = [...(dispatch.details || [])].sort((a, b) => {
//     const batchA = a.batchDetails?.acName || a.batchno || '';
//     const batchB = b.batchDetails?.acName || b.batchno || '';
//     return batchA.localeCompare(batchB);
//   });

//   // ✅ Calculate page configuration
//   const getPageConfig = (totalItems) => {
//     const SINGLE_PAGE = 16;
//     const FIRST_MIDDLE_PAGE = 20;
//     const LAST_PAGE = 16;

//     if (totalItems <= SINGLE_PAGE) {
//       return [SINGLE_PAGE]; // Single page: 16 rows
//     }

//     // Multi-page: first/middle = 25, last = 16
//     const numPages = Math.ceil((totalItems - LAST_PAGE) / FIRST_MIDDLE_PAGE) + 1;
//     const pages = [];
//     for (let i = 0; i < numPages - 1; i++) pages.push(FIRST_MIDDLE_PAGE);
//     pages.push(LAST_PAGE);
//     return pages;
//   };

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank', 'width=800,height=600');
//     const totalItems = sortedDetails.length;
//     const pageConfig = getPageConfig(totalItems);
//     const uomTotals = {};
//     let currentItemIndex = 0;

//     // Start HTML
//     printWindow.document.write(`
// <!DOCTYPE html>
// <html>
// <head>
// <style>
// @page { size: A4; margin: 12mm; }
// * { margin: 0; padding: 0; }
// body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.3; }
// .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
// .header-left { display: flex; gap: 15px; }
// .gdn-number { font-size: 20px; font-weight: bold; color: #155724; }
// .info { display: flex; gap: 8px; margin-bottom: 8px; }
// .info-row { padding: 2px; font-size: 16px; font-weight: 500; }
// .totals-row { background: #f8f9fa; border-radius: 4px; padding: 6px 10px; margin-bottom: 10px; display: flex; gap: 20px; font-size: 14px; }
// .total-highlight { background: #d4edda; padding: 4px 10px; border-radius: 4px; font-weight: bold; color: #155724; }
// table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #000; border-radius: 6px; overflow: hidden; }
// th, td { border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 7px 5px; }
// th:last-child, td:last-child { border-right: none; }
// tr:last-child td { border-bottom: none; }
// th { background-color: #f0f0f0; text-align: center; font-weight: bold; font-size: 12px; }
// .text-center { text-align: center; }
// .text-right { text-align: right; padding-right: 6px; }
// .total-row { font-weight: bold; font-size: 13px; border-top: 2px solid #155724; }
// .page-break { page-break-before: always; }
// .footer-section { margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
// .signature-column { border: 1px solid #000; border-radius: 6px; height: 35px; padding: 8px; }
// .signature-title { font-weight: bold; font-size: 14px; }
// </style>
// </head>
// <body>

// <div class="header-row">
//   <div class="header-left">
//     <div class="info-row"><strong>Date:</strong> ${formatMyDate(date)}</div>
//     <div class="info-row"><strong>Sale Order:</strong> ${dispatch.order?.Number || 'N/A'}</div>
//   </div>
//   <div class="gdn-number">${dispatch.Number}</div>
// </div>

// <div class="info">
//   <div class="info-row"><strong>Customer:</strong> ${dispatch.account?.acName || 'N/A'}</div>
//   <div class="info-row"><strong>Setup Name:</strong> ${dispatch.account?.setupName || 'N/A'}</div>
//   <div class="info-row"><strong>City:</strong> ${dispatch.account?.city || 'N/A'}</div>
// </div>

// <div class="info">
//   <div class="info-row"><strong>Sub Customer:</strong> ${dispatch.order?.sub_customer || 'N/A'}</div>
//   <div class="info-row"><strong>Sub City:</strong> ${dispatch.order?.sub_city || 'N/A'}</div>
// </div>

// <div class="info">
//   <div class="info-row"><strong>Trans:</strong> ${dispatch.transporter?.name || 'N/A'}</div>
//   <div class="info-row"><strong>Booked Crt:</strong> ${Math.round(bookedCrt) || 0}</div>
//   <div class="info-row"><strong>Freight:</strong> ${Math.round(freightCrt) || 0}</div>
//   <div class="info-row"><strong>Labour:</strong> ${Math.round(labourCrt) || 0}</div>
//   <div class="info-row"><strong>Bilty:</strong> ${Math.round(bilityExpense) || 0}</div>
//   <div class="info-row"><strong>Other:</strong> ${Math.round(otherExpense) || 0}</div>
// </div>

// <div class="totals-row">
//   <div><strong>Total Labour:</strong> ${totalLabourCost.toLocaleString()}</div>
//   <div><strong>Total Freight:</strong> ${totalFreightCost.toLocaleString()}</div>
//   <div><strong>Bilty:</strong> ${bilityExpense.toLocaleString()}</div>
//   <div><strong>Other:</strong> ${otherExpense.toLocaleString()}</div>
//   <div class="total-highlight"><strong>Total Carriage:</strong> ${totalCarriage.toLocaleString()}</div>
// </div>

// <table>
// <thead><tr><th>Sr#</th><th>Batch</th><th>Item Name</th><th>Quantity</th></tr></thead>
// <tbody>
// `);

//     // ✅ Generate pages based on config
//     pageConfig.forEach((rowsOnPage, pageIndex) => {
//       if (pageIndex > 0) {
//         printWindow.document.write(`
// </tbody></table>
// <div class="page-break"></div>
// <table>
// <thead><tr><th>Sr#</th><th>Batch</th><th>Item Name</th><th>Quantity</th></tr></thead>
// <tbody>
// `);
//       }

//       for (let row = 0; row < rowsOnPage; row++) {
//         if (currentItemIndex < totalItems) {
//           const detail = sortedDetails[currentItemIndex];
//           const { quantity, uom } = getSelectedUomAndQuantity(detail);
//           uomTotals[uom] = (uomTotals[uom] || 0) + quantity;

//           printWindow.document.write(`
// <tr>
//   <td class="text-center">${currentItemIndex + 1}</td>
//   <td style="font-weight:700; font-size:16px;">${detail.batchDetails?.acName || 'N/A'}</td>
//   <td>${detail.item?.itemName || ''}</td>
//   <td class="text-right">${quantity} ${uom}</td>
// </tr>
// `);
//           currentItemIndex++;
//         } else {
//           printWindow.document.write(`<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>`);
//         }
//       }
//     });

//     const totalDisplay = Object.entries(uomTotals).map(([u, q]) => `${q} ${u}`).join(', ');

//     printWindow.document.write(`
// <tr class="total-row">
//   <td colspan="2">TOTAL QUANTITY</td>
//   <td colspan="2">${totalDisplay}</td>
// </tr>
// </tbody>
// </table>

// <div style="padding:10px; border:1px solid; height:70px; margin-top:15px; border-radius:5px">Remarks:</div>

// <div class="footer-section">
//   <div class="signature-column"><div class="signature-title">Discharged by</div></div>
//   <div class="signature-column"><div class="signature-title">Enter by</div></div>
// </div>

// </body>
// </html>
// `);

//     printWindow.document.close();
//     setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-80">
//         <div className="p-6">
//           <h3 className="text-lg font-bold mb-4">Print Dispatch</h3>
//           <p className="mb-4">{dispatch.Number} - {dispatch.account?.acName}</p>
//           <div className="flex space-x-3">
//             <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//             <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">Print</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DispatchPrintModal;






































// import React from 'react';

// function DispatchPrintModal({ dispatch, onClose }) {

//   const formatMyDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.getDate()}/${date.toLocaleString('default', { month: 'short' })}/${date.getFullYear().toString().slice(-2)}`;
//   };

//   const labourCrt = parseFloat(dispatch.labour_crt || 0);
//   const freightCrt = parseFloat(dispatch.freight_crt || 0);
//   const bilityExpense = parseFloat(dispatch.bility_expense || 0);
//   const otherExpense = parseFloat(dispatch.other_expense || 0);
//   const bookedCrt = parseFloat(dispatch.booked_crt || 0);

//   const totalLabourCost = labourCrt * bookedCrt;
//   const totalFreightCost = freightCrt * bookedCrt;
//   const totalCarriage = totalLabourCost + totalFreightCost + bilityExpense + otherExpense;

//   const getSelectedUomAndQuantity = (detail) => {
//     const stockOutUom = parseInt(detail.Stock_out_UOM) || parseInt(detail.Sale_Unit);
//     if (stockOutUom === 1) return { quantity: parseFloat(detail.Stock_out_UOM_Qty) || 0, uom: detail.item?.uom1?.uom || 'Pkt' };
//     if (stockOutUom === 2) return { quantity: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0, uom: detail.item?.uomTwo?.uom || 'Box' };
//     if (stockOutUom === 3) return { quantity: parseFloat(detail.Stock_out_UOM3_Qty) || 0, uom: detail.item?.uomThree?.uom || 'Crt' };
//     return { quantity: parseFloat(detail.Stock_out_UOM_Qty) || 0, uom: detail.item?.uom1?.uom || 'Unit' };
//   };

//   const sortedDetails = [...(dispatch.details || [])].sort((a, b) => {
//     const batchA = a.batchDetails?.acName || '';
//     const batchB = b.batchDetails?.acName || '';
//     return batchA.localeCompare(batchB);
//   });

//   const uomTotals = {};
//   sortedDetails.forEach(d => {
//     const { quantity, uom } = getSelectedUomAndQuantity(d);
//     uomTotals[uom] = (uomTotals[uom] || 0) + quantity;
//   });
//   const totalDisplay = Object.entries(uomTotals).map(([u, q]) => `${q} ${u}`).join(', ');

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return;

//     let rows = '';
//     for (let i = 0; i < sortedDetails.length; i++) {
//       const d = sortedDetails[i];
//       const q = getSelectedUomAndQuantity(d);
//       rows += '<tr><td class="c">' + (i + 1) + '</td><td class="batch">' + (d.batchDetails?.acName || 'N/A') + '</td><td>' + (d.item?.itemName || '') + '</td><td class="r">' + q.quantity + ' ' + q.uom + '</td></tr>';
//     }

//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
// <style>
// @page { size: A4; margin: 10mm; }
// @media print {
//   html, body { height: 100%; }
//   .wrapper { min-height: 100%; display: flex; flex-direction: column; }
//   .content { flex: 1; }
//   .footer { margin-top: auto; }
//   thead { display: table-header-group; }
//   tr { page-break-inside: avoid; }
// }
// * { margin: 0; padding: 0; box-sizing: border-box; }
// body { font-family: Arial, sans-serif; font-size: 13px; }

// .wrapper { min-height: 100vh; display: flex; flex-direction: column;  }
// .content { flex: 1; border-raduis:10px }
// .footer { margin-top: auto; padding-top: 12px; }

// .title-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #155724; padding-bottom: 6px; margin-bottom: 8px; }
// .gdn { font-size: 22px; font-weight: bold; color: #155724; background: #d4edda; padding: 4px 12px; border-radius: 6px; }
// .info-row { display: flex; gap: 15px; margin-bottom: 6px; font-size: 13px; flex-wrap: wrap; }

// /* ✅ Transport & Cost Grid - Same as GDN_Header */
// .cost-grid {
//   display: grid;
//   grid-template-columns: repeat(7, 1fr);
//   gap: 8px;
//   background: #f8f9fa;
//   padding: 8px 10px;
//   border-radius: 6px;
//   margin-bottom: 8px;
//   font-size: 11px;
// }
// .cost-item { }
// .cost-label { font-weight: bold; color: #555; font-size: 10px; text-transform: uppercase; }
// .cost-value { font-size: 13px; font-weight: 600; color: #333; }
// .cost-total { color: #059669; font-size: 11px; margin-top: 2px; }

// /* ✅ Totals Row */
// .totals-row {
//   display: flex;
//   gap: 15px;
//   background: #e8e8e8;
//   padding: 8px 12px;
//   border-radius: 6px;
//   margin-bottom: 10px;
//   font-size: 12px;
//   align-items: center;
//   flex-wrap: wrap;
// }
// .total-badge { 
//   background: #155724; 
//   color: #fff; 
//   padding: 5px 12px; 
//   border-radius: 5px; 
//   font-weight: bold;
//   margin-left: auto;
// }
// /* ✅ Table with rounded corners */
// table { 
//   width: 100%; 
//   border-collapse: separate;
//   border-spacing: 0;
//   border: 2px solid #333;
//   border-radius: 10px;
//   overflow: hidden;
// }

// th { 
//   background: #e0e0e0; 
//   padding: 10px 8px; 
//   font-size: 12px; 
//   text-transform: uppercase; 
//   border-bottom: 2px solid #333;
//   text-align: center; 
//   font-weight: bold; 
// }

// th:not(:last-child) {
//   border-right: 1px solid #ccc;
// }

// td { 
//   padding: 8px; 
//   font-size: 13px; 
//   border-bottom: 1px solid #ccc;
// }

// td:not(:last-child) {
//   border-right: 1px solid #ccc;
// }

// tr:last-child td {
//   border-bottom: none;
// }

// .c { text-align: center; }
// .r { text-align: right; }
// .batch { font-weight: 600; color: #0066cc; font-size: 14px; }

// .total-row { background: #d4edda; }
// .total-row td { 
//   font-weight: bold; 
//   padding: 12px 8px; 
//   font-size: 14px; 
// }


// /* ✅ Footer */
// .remarks { border: 2px solid #333; border-radius: 8px; min-height: 55px; padding: 8px 12px; margin-bottom: 12px; font-size: 12px; }
// .sigs { display: flex; gap: 20px; }
// .sig { flex: 1; border: 2px solid #333; border-radius: 8px; min-height: 35px; padding: 8px 12px; font-size: 12px; font-weight: bold; }
// </style>
// </head>
// <body>

// <div class="wrapper">
//   <div class="content">
//     <!-- Title Row -->
//     <div class="title-row">
//       <div style="display:flex;gap:20px;font-size:14px;">
//         <span><b>Date:</b> ${formatMyDate(dispatch.Date)}</span>
//         <span><b>S.O:</b> ${dispatch.order?.Number || 'N/A'}</span>
//       </div>
//       <div class="gdn">${dispatch.Number}</div>
//     </div>

//     <!-- Customer Info -->
//     <div class="info-row">
//       <span><b>Customer:</b> ${dispatch.account?.acName || 'N/A'}</span>
//       <span><b>Setup:</b> ${dispatch.account?.setupName || 'N/A'}</span>
//       <span><b>City:</b> ${dispatch.account?.city || 'N/A'}</span>
//     </div>
//     <div class="info-row">
//       <span><b>Sub Cust:</b> ${dispatch.order?.sub_customer || 'N/A'}</span>
//       <span><b>Sub City:</b> ${dispatch.order?.sub_city || 'N/A'}</span>
//     </div>

//     <!-- ✅ Cost Grid - Same Layout as GDN_Header -->
//     <div class="cost-grid">
//       <div class="cost-item">
//         <div class="cost-label">Transporter</div>
//         <div class="cost-value">${dispatch.transporter?.name || 'N/A'}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Booked Crts</div>
//         <div class="cost-value">${Math.round(bookedCrt)}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Freight /Crt</div>
//         <div class="cost-value">${freightCrt.toLocaleString()}</div>
//         <div class="cost-total">= ${totalFreightCost.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Labour /Crt</div>
//         <div class="cost-value">${labourCrt.toLocaleString()}</div>
//         <div class="cost-total">= ${totalLabourCost.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Bilty</div>
//         <div class="cost-value">${bilityExpense.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//         <div class="cost-label">Other</div>
//         <div class="cost-value">${otherExpense.toLocaleString()}</div>
//       </div>
//       <div class="cost-item">
//       <div class="cost-label">Total Carriage</div>
//          <span class="cost-value"> ${totalCarriage.toLocaleString()}</span>
//       </div>
//     </div>

//     <!-- Totals Row -->
   

//     <!-- Table -->
//     <table>
//       <thead>
//         <tr>
//           <th style="width:6%">SR#</th>
//           <th style="width:34%">BATCH</th>
//           <th style="width:40%">ITEM NAME</th>
//           <th style="width:30%">QTY</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${rows}
//         <tr class="total-row">
//           <td colspan="2"><b>TOTAL QUANTITY</b></td>
//           <td colspan="2" class="r"><b>${totalDisplay}</b></td>
//         </tr>
//       </tbody>
//     </table>
//   </div>

//   <div class="footer">
//     <div class="remarks"><b>Remarks:</b></div>
//     <div class="sigs">
//       <div class="sig">Discharged by:</div>
//       <div class="sig">Entered by:</div>
//     </div>
//   </div>
// </div>

// </body>
// </html>`;

//     printWindow.document.write(html);
//     printWindow.document.close();
//     setTimeout(function() {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     }, 300);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-96">
//         <div className="p-6">
//           <h3 className="text-xl font-bold mb-2">Print Dispatch</h3>
//           <div className="mb-4 p-3 bg-gray-100 rounded-lg">
//             <p className="font-semibold text-green-700">{dispatch.Number}</p>
//             <p className="text-gray-600 text-sm">{dispatch.account?.acName}</p>
//             <p className="text-gray-500 text-xs mt-1">{sortedDetails.length} items</p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium">Cancel</button>
//             <button onClick={handlePrint} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Print</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DispatchPrintModal;



























































  // <div class="totals-row">
  //     <span><b>Total Freight:</b> ${totalFreightCost.toLocaleString()}</span>
  //     <span><b>Total Labour:</b> ${totalLabourCost.toLocaleString()}</span>
  //     <span><b>Bilty:</b> ${bilityExpense.toLocaleString()}</span>
  //     <span><b>Other:</b> ${otherExpense.toLocaleString()}</span>
  //     <span class="total-badge">Total Carriage: ${totalCarriage.toLocaleString()}</span>
  //   </div>





























  


// Working Perfect jsut need to upgrade

// import React from 'react';

// const DispatchPrintModal = ({ dispatch, onClose }) => {

//   function formatMyDate(dateString) {
//     const parts = dateString.split('/');
//     const date = new Date(parts[2], parts[1] - 1, parts[0]);
//     const day = date.getDate();
//     const month = date.toLocaleString('default', { month: 'short' });
//     const year = date.getFullYear().toString().slice(-2);
//     return `${day}/${month}/${year}`;
//   }

//   let inputDate = "21/11/2025";
//   let formattedDate = formatMyDate(inputDate); // Output: "21/Nov/25"
//   console.log(formattedDate);

//   const date = new Date(dispatch.Date).toLocaleDateString()

//   const getSelectedUomAndQuantity = (detail) => {
//     // ✅ FIXED: Check both Stock_out_UOM and Sale_Unit fields
//     const stockOutUom = parseInt(detail.Stock_out_UOM) || parseInt(detail.Sale_Unit);

//     if (stockOutUom === 1) {
//       return {
//         quantity: parseFloat(detail.Stock_out_UOM_Qty) || parseFloat(detail.uom1_qty) || 0,
//         uom: detail.item?.uom1?.uom || 'Pkt'
//       };
//     } else if (stockOutUom === 2) {
//       return {
//         quantity: parseFloat(detail.Stock_out_SKU_UOM_Qty) || parseFloat(detail.uom2_qty) || 0,
//         uom: detail.item?.uomTwo?.uom || 'Box'
//       };
//     } else if (stockOutUom === 3) {
//       return {
//         quantity: parseFloat(detail.Stock_out_UOM3_Qty) || parseFloat(detail.uom3_qty) || 0,
//         uom: detail.item?.uomThree?.uom || 'Crt'
//       };
//     }

//     // Fallback to UOM1
//     return {
//       quantity: parseFloat(detail.Stock_out_UOM_Qty) || parseFloat(detail.uom1_qty) || 0,
//       uom: detail.item?.uom1?.uom || 'Unit'
//     };
//   };

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank', 'width=800,height=600');

//     printWindow.document.write(`
// <!DOCTYPE html>
// <html>
// <head>
// <style>
// @page { size: A4; margin: 12mm; }

// * { margin: 0; padding: 0; }

// body {
//   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//   font-size: 14px;
//   line-height: 1.3;
// }

// .info {
//   display: flex;
//   gap: 8px;
//   margin-bottom: 8px;
// }

// .info-row {
//   padding: 2px;
//   font-size: 16px;
//   font-weight: 500;
// }

// table {
//   width: 100%;
//   border-collapse: separate;
//   border-spacing: 0;
//   border: 1px solid #000;
//   border-radius: 6px;
//   overflow: hidden;
// }

// /* ✅ ONLY slight row height increase */
// th, td {
//   border-right: 1px solid #000;
//   border-bottom: 1px solid #000;
//   padding: 7px 5px;
// }

// th:last-child,
// td:last-child { border-right: none; }

// tr:last-child td { border-bottom: none; }

// th {
//   background-color: #f0f0f0;
//   text-align: center;
//   font-weight: bold;
//   font-size: 12px;
// }

// .text-center { text-align: center; }
// .text-right { text-align: right; padding-right: 6px; }

// .total-row {
//   font-weight: bold;
//   font-size: 13px;
//   border-top: 2px solid #155724;
// }

// .page-break { page-break-before: always; }

// .footer-section {
//   margin-top: 10px;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 30px;
// }

// .signature-column {
//   border: 1px solid #000;
//   border-radius: 6px;
//   height: 35px;
//   padding: 8px;
// }

// .signature-title {
//   font-weight: bold;
//   font-size: 14px;
// }
// </style>
// </head>

// <body>

// <div class="info" style="margin-top:0px;">
//   <div class="info-row"><strong>Date:</strong> ${formatMyDate(date)}</div>
//   <div class="info-row"><strong>Sale Order:</strong> ${dispatch.order?.Number || 'N/A'}</div>
//   <div class=""><strong>No:</strong> ${dispatch.Number}</div>
// </div>

// <div class="info">
//   <div class="info-row"><strong>Customer:</strong> ${dispatch.account?.acName || 'N/A'}</div>
//   <div class="info-row"><strong>Setup Name:</strong> ${dispatch.account?.setupName || 'N/A'}</div>
//   <div class="info-row"><strong>City:</strong> ${dispatch.account?.city || 'N/A'}</div>
// </div>

// <div class="info" style="margin-top:0px;">
//   <div class="info-row"><strong>Sub Customer:</strong> ${dispatch.order?.sub_customer || 'N/A'}</div>
//   <div class="info-row"><strong>Sub City:</strong> ${dispatch.order?.sub_city || 'N/A'}</div>
// </div>

// <div class="info" style="margin-top:0px;">
//   <div class="info-row"><strong>Transporter:</strong> ${dispatch.transporter?.name || 'N/A'}</div>
//   <div class="info-row" ><strong>Booked crt:</strong> ${Math.round(dispatch.booked_crt) || 'N/A'}</div>
//   <div class="info-row" ><strong>Freight:</strong> ${Math.round(dispatch.freight_crt) || 'N/A'}</div>
//   <div class="info-row" ><strong>Labour:</strong> ${Math.round(dispatch.labour_crt) || 'N/A'}</div>
//   <div class="info-row" ><strong>Billing:</strong> ${Math.round(dispatch.bility_expense) || 'N/A'}</div>
//   <div class="info-row" ><strong>Other:</strong> ${Math.round(dispatch.other_expense) || 'N/A'}</div>
// </div>


// <table>
// <thead>
// <tr>
//   <th style="width:5%">Sr#</th>
//   <th style="width:50%">Batch</th>
//   <th style="width:40%">Item Name</th>
//   <th style="width:5%">Quantity</th>
// </tr>
// </thead>
// <tbody>
// `);

//     const uomTotals = {};
//     const itemsPerPage = 18;
//     const totalItems = dispatch.details?.length || 0;
//     const totalPages = Math.ceil(Math.max(totalItems, itemsPerPage) / itemsPerPage);
//     let currentItemIndex = 0;

//     for (let page = 0; page < totalPages; page++) {
//       if (page > 0) {
//         printWindow.document.write(`
// </tbody></table>
// <div class="page-break"></div>
// <table>
// <thead>
// <tr>
//   <th>Sr#</th>
//   <th>Batch</th>
//   <th>Item Name</th>
//   <th>Quantity</th>
// </tr>
// </thead>
// <tbody>
// `);
//       }

//       for (let row = 0; row < itemsPerPage; row++) {
//         if (currentItemIndex < totalItems) {
//           const detail = dispatch.details[currentItemIndex];
//           const { quantity, uom } = getSelectedUomAndQuantity(detail);

//           uomTotals[uom] = (uomTotals[uom] || 0) + quantity;

//           printWindow.document.write(`
// <tr>
//   <td class="text-center">${currentItemIndex + 1}</td>
//   <td style="font-weight:700; font-size:16px; ">${detail.batchDetails?.acName || 'N/A'}</td>
//   <td>${detail.item?.itemName || ''}</td>
//   <td class="text-right">${quantity} ${uom}</td>
// </tr>
// `);
//           currentItemIndex++;
//         } else {
//           printWindow.document.write(`
// <tr>
//   <td>&nbsp;</td><td></td><td></td><td></td>
// </tr>
// `);
//         }
//       }
//     }

//     const totalDisplay = Object.entries(uomTotals)
//       .map(([u, q]) => `${q} ${u}`)
//       .join(', ');

//     printWindow.document.write(`
// <tr class="total-row">
//   <td colspan="2">TOTAL QUANTITY</td>
//   <td colspan="2">${totalDisplay}</td>
// </tr>
// </tbody>
// </table>

// <!-- ✅ RESTORED BOX (UNCHANGED) -->
// <div style="padding:10px; border:1px solid; height:70px; margin-top:15px; border-radius:5px">Remarks:</div>

// <div class="footer-section">
//   <div class="signature-column">
//     <div class="signature-title">Discharged by</div>
//   </div>
//   <div class="signature-column">
//     <div class="signature-title">Enter by</div>
//   </div>
// </div>

// </body>
// </html>
// `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 250);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-80">
//         <div className="p-6">
//           <h3 className="text-lg font-bold mb-4">Print Dispatch</h3>
//           <p className="mb-4">{dispatch.Number} - {dispatch.account?.acName}</p>
//           <div className="flex space-x-3">
//             <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//             <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">Print</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DispatchPrintModal;
