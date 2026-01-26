



// // components/reports/ItemOrderDispatchPrintModal.tsx

// 'use client'
// import React, { useEffect } from 'react';
// import { X, Printer } from 'lucide-react';

// interface CustomerItem {
//   orderNumber: string;
//   orderDate: string;
//   orderStatus: string;
//   itemId: number;
//   itemName: string;
//   orderQty: number;
//   dispatchQty: number;
//   difference: number;
//   uomName: string;
//   itemStatus: string;
// }

// interface CustomerTotals {
//   totalOrderQty: number;
//   totalDispatchQty: number;
//   totalDifference: number;
// }

// interface CustomerData {
//   customerId: number;
//   customerName: string;
//   customerCity: string;
//   items: CustomerItem[];
//   customerTotals: CustomerTotals;
// }

// interface GrandTotals {
//   totalCustomers: number;
//   totalOrders: number;
//   totalOrderQty: number;
//   totalDispatchQty: number;
//   totalDifference: number;
// }

// interface PrintFilters {
//   dateFrom: string;
//   dateTo: string;
//   uom: string;
// }

// interface ItemOrderDispatchPrintModalProps {
//   reportData: CustomerData[];
//   grandTotals: GrandTotals;
//   filters: PrintFilters;
//   mode?: 'view' | 'print';
//   onClose: () => void;
// }

// const ItemOrderDispatchPrintModal: React.FC<ItemOrderDispatchPrintModalProps> = ({
//   reportData,
//   grandTotals,
//   filters,
//   mode = 'print',
//   onClose
// }) => {

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatNumber = (num: number) => num.toLocaleString();

//   const getUomLabel = (uom: string) => {
//     switch (uom) {
//       case '1': return 'Primary (Pcs/Pkt)';
//       case '2': return 'Secondary (Box)';
//       case '3': return 'Tertiary (Crt)';
//       default: return 'Unknown';
//     }
//   };

//   const getOrderStatusBg = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'complete': return '#d1fae5';
//       case 'partial': return '#fef3c7';
//       case 'incomplete': return '#ffedd5';
//       case 'pending': return '#fee2e2';
//       default: return '#f3f4f6';
//     }
//   };

//   const getOrderStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'complete': return '#065f46';
//       case 'partial': return '#92400e';
//       case 'incomplete': return '#9a3412';
//       case 'pending': return '#991b1b';
//       default: return '#374151';
//     }
//   };

//   const executePrint = () => {
//     const printWindow = window.open('', '_blank', 'width=1200,height=800');
//     if (!printWindow) {
//       alert('Please allow popups for printing');
//       onClose();
//       return;
//     }

//     // Build all customers - CONTINUOUS FLOW
//     let customerSections = '';
    
//     reportData.forEach((customer, customerIndex) => {
//       let itemRows = '';
//       customer.items.forEach((item, index) => {
//         const diffColor = item.difference === 0 
//           ? '#065f46' 
//           : item.difference > 0 
//             ? '#92400e' 
//             : '#5b21b6';

//         const rowBg = index % 2 === 0 ? '#ffffff' : '#f9fafb';

//         itemRows += `
//           <tr style="background:${rowBg};">
//             <td style="text-align:center;padding:8px 6px;font-size:12px;">${index + 1}</td>
//             <td style="text-align:left;padding:8px 6px;color:#2563eb;font-weight:600;font-size:12px;">${item.orderNumber}</td>
//             <td style="text-align:center;padding:8px 6px;font-size:12px;">${formatDate(item.orderDate)}</td>
           
//             <td style="text-align:left;padding:8px 6px;font-weight:500;font-size:12px;">${item.itemName}</td>
//             <td style="text-align:right;padding:8px 6px;font-family:Consolas,monospace;font-size:12px;">${formatNumber(item.orderQty)}</td>
//             <td style="text-align:right;padding:8px 6px;font-family:Consolas,monospace;color:#059669;font-weight:600;font-size:12px;">${formatNumber(item.dispatchQty)}</td>
//             <td style="text-align:right;padding:8px 6px;font-family:Consolas,monospace;font-weight:700;font-size:12px;color:${diffColor};">${item.difference > 0 ? '+' : ''}${formatNumber(item.difference)}</td>
//             <td style="text-align:center;padding:8px 6px;font-size:12px;">${item.uomName}</td>
//           </tr>
//         `;
//       });

//       const totalDiffColor = customer.customerTotals.totalDifference === 0 
//         ? '#065f46' 
//         : customer.customerTotals.totalDifference > 0 
//           ? '#92400e' 
//           : '#5b21b6';

//       // Customer section - NO forced page break
//       customerSections += `
//         <div class="customer-section">
//           <!-- Customer Header -->
//           <div style="padding:4px 6px;border-radius:8px 8px 0 0;">
//             <div style="display:flex;justify-content:space-between;align-items:center;">
//               <div>
//                 <span style="font-size:16px;font-weight:bold; width:130px; over-flow:hidden">${customer.customerName}</span>
//                 ${customer.customerCity ? `<span style="font-size:13px;margin-left:12px;"> ${customer.customerCity}</span>` : ''}
               
//               </div>
             
//             </div>
//           </div>

//           <!-- Items Table -->
//           <table style="width:100%">
            
//             <tbody>
//               ${itemRows}
//             </tbody>
//           </table>

//           <!-- Customer Total Footer -->
//           <div style="background-color:black;color:white padding:4px 6px; border-radius:0 0 8px 8px;display:flex;justify-content:space-between;align-items:center;">
//             <span style="font-size:13px;font-weight:600; color:white; padding: 2px 10px">Customer Total</span>
//             <div style="display:flex;gap:30px; padding:4px 10px; margin-right:60px;">
//               <div style="text-align:right;">
                
//                 <div style="color:white; font-size:14px;font-weight:bold;font-family:Consolas,monospace;">${formatNumber(customer.customerTotals.totalOrderQty)}</div>
//               </div>
//               <div style="text-align:right;">
               
//                 <div style="color:white; font-size:14px;font-weight:bold;font-family:Consolas,monospace;">${formatNumber(customer.customerTotals.totalDispatchQty)}</div>
//               </div>
//               <div style="text-align:right;">
               
//                 <div style="color:white; font-size:14px;font-weight:bold;font-family:Consolas,monospace;">${customer.customerTotals.totalDifference > 0 ? '+' : ''}${formatNumber(customer.customerTotals.totalDifference)}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       `;
//     });

//     const grandDiffColor = grandTotals.totalDifference === 0 
//       ? '#065f46' 
//       : grandTotals.totalDifference > 0 
//         ? '#92400e' 
//         : '#5b21b6';

//     printWindow.document.write(`
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Item Order vs Dispatch Report</title>
//   <style>
//     @page {
//       size: A4 portrait;
//       margin: 12mm;
//     }
    
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }
    
//     body {
//       font-family: 'Segoe UI', Arial, sans-serif;
//       font-size: 12px;
//       line-height: 1.4;
//       color: #1f2937;
//       background: white;
//     }
    
//     /* Report Header */
//     .report-header {
//       text-align: center;
//       padding: 15px 0;
//       border-bottom: 3px solid #059669;
//       margin-bottom: 15px;
//     }
    
//     .report-title {
//       font-size: 20px;
//       font-weight: bold;
//       color: #059669;
//       margin-bottom: 8px;
//     }
    
//     .report-filters {
//       display: flex;
//       justify-content: center;
//       gap: 30px;
//       font-size: 12px;
//       color: #4b5563;
//     }
    
//     .report-filters strong {
//       color: #059669;
//     }
    
//     /* Grand Summary */
//     .grand-summary {
//       display: flex;
//       justify-content: space-around;
      
//       border-radius: 10px;
//       padding: 12px 20px;
//       margin-bottom: 20px;
//     }
    
//     .summary-item {
//       text-align: center;
//     }
    
//     .summary-item .label {
//       font-size: 10px;
//       color: #6b7280;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }
    
//     .summary-item .value {
//       font-size: 18px;
//       font-weight: bold;
//       color: #059669;
//     }
    
//     /* Customer Section - Continuous Flow */
//     .customer-section {
//       margin-bottom: 20px;
//       border: 1px solid;
//       border-radius: 10px;
//       overflow: hidden;
//       page-break-inside: avoid;
//     }
    
//     /* Print Footer */
//     .print-footer {
//       margin-top: 25px;
//       padding-top: 10px;
//       border-top: 2px solid #e5e7eb;
//       display: flex;
//       justify-content: space-between;
//       font-size: 11px;
//       color: #6b7280;
//     }
    
//     /* Print Media */
//     @media print {
//       body {
//         print-color-adjust: exact;
//         -webkit-print-color-adjust: exact;
//       }
      
//       /* Allow page breaks anywhere - continuous flow */
//       .customer-section {
//         page-break-inside: auto;
//       }
      
//       /* Keep customer header with first few rows */
//       .customer-section > div:first-child {
//         page-break-after: avoid;
//       }
      
//       /* Avoid breaking individual rows */
//       tr {
//         page-break-inside: avoid;
//       }
      
//       /* Keep footer with some content */
//       .customer-section > div:last-child {
//         page-break-before: avoid;
//       }
      
//       /* Repeat table header on each page */
//       thead {
//         display: table-header-group;
//       }
//     }
//   </style>
// </head>
// <body>
//   <!-- Report Header -->
//   <div class="report-header">
  
//     <div class="report-filters">
//       <span><strong>From:</strong> ${formatDate(filters.dateFrom)}</span>
//       <span><strong>To:</strong> ${formatDate(filters.dateTo)}</span>
//       <span><strong>UOM:</strong> ${getUomLabel(filters.uom)}</span>
//     </div>
//   </div>
  
//   <!-- Grand Summary -->
//   <div class="grand-summary">
//     <div class="summary-item">
//       <div class="label">Customers</div>
//       <div class="value">${grandTotals.totalCustomers}</div>
//     </div>
//     <div class="summary-item">
//       <div class="label">Orders</div>
//       <div class="value">${grandTotals.totalOrders}</div>
//     </div>
//     <div class="summary-item">
//       <div class="label">Total Ordered</div>
//       <div class="value">${formatNumber(grandTotals.totalOrderQty)}</div>
//     </div>
//     <div class="summary-item">
//       <div class="label">Total Dispatched</div>
//       <div class="value">${formatNumber(grandTotals.totalDispatchQty)}</div>
//     </div>
//     <div class="summary-item">
//       <div class="label">Total Pending</div>
//       <div class="value" style="color:${grandDiffColor};">${formatNumber(grandTotals.totalDifference)}</div>
//     </div>
//   </div>
  
//   <!-- Customer Sections - Continuous Flow -->
//     <table style="width:100%;font-size:13px;">
//   <thead>
//               <tr style="">
//                 <th style="padding:10px 6px;text-align:center;font-size:11px;font-weight:600;width:6%;">#</th>
//                 <th style="padding:10px 6px;text-align:left;font-size:11px;font-weight:600;width:12%;">Order</th>
//                 <th style="padding:10px 6px;text-align:center;font-size:11px;font-weight:600;width:16%;">Date</th>
               
//                 <th style="padding:10px 6px;text-align:left;font-size:11px;font-weight:600;width:10%;">Item Name</th>
//                 <th style="padding:10px 6px;text-align:right;font-size:11px;font-weight:600;width:10%;">Order Qty</th>
//                 <th style="padding:10px 6px;text-align:right;font-size:11px;font-weight:600;width:10%;">Dispatch</th>
//                 <th style="padding:10px 6px;text-align:right;font-size:11px;font-weight:600;width:8%;">Diff</th>
//                 <th style="padding:10px 6px;text-align:center;font-size:11px;font-weight:600;width:8%;">UOM</th>
//               </tr>
//             </thead>
//             </table>
//   ${customerSections}
  
//   <!-- Print Footer -->
//   <div class="print-footer">
//     <span>Generated: ${new Date().toLocaleString()}</span>
//     <span>Total: ${grandTotals.totalCustomers} Customers | ${grandTotals.totalOrders} Orders</span>
//   </div>
// </body>
// </html>
//     `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//       onClose();
//     }, 400);
//   };

//   useEffect(() => {
//     if (mode === 'print') {
//       executePrint();
//     }
//   }, []);

//   if (mode === 'print') {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
//         <div className="flex justify-between items-center px-6 py-4 border-b bg-emerald-50">
//           <h2 className="text-lg font-bold text-emerald-800">Print Report</h2>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={executePrint}
//               className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-base"
//             >
//               <Printer className="w-5 h-5" />
//               Print Report
//             </button>
//             <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-auto p-8 bg-gray-100">
//           <div className="bg-white p-8 shadow-xl mx-auto rounded-xl" style={{ maxWidth: '500px' }}>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Printer className="w-8 h-8 text-emerald-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Print</h3>
//               <p className="text-gray-500 mb-6">All customers will print continuously</p>
              
//               <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                 <div className="grid grid-cols-2 gap-4 text-left">
//                   <div>
//                     <p className="text-sm text-gray-500">Total Customers</p>
//                     <p className="text-2xl font-bold text-emerald-600">{grandTotals.totalCustomers}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Total Orders</p>
//                     <p className="text-2xl font-bold text-emerald-600">{grandTotals.totalOrders}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Total Ordered</p>
//                     <p className="text-2xl font-bold text-emerald-600">{formatNumber(grandTotals.totalOrderQty)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Total Pending</p>
//                     <p className={`text-2xl font-bold ${
//                       grandTotals.totalDifference === 0 ? 'text-green-600' :
//                       grandTotals.totalDifference > 0 ? 'text-yellow-600' : 'text-purple-600'
//                     }`}>{formatNumber(grandTotals.totalDifference)}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemOrderDispatchPrintModal;



































































'use client'
import React, { useEffect } from 'react';
import { X, Printer } from 'lucide-react';

interface CustomerItem {
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  itemId: number;
  itemName: string;
  orderQty: number;
  dispatchQty: number;
  difference: number;
  uomName: string;
  itemStatus: string;
}

interface CustomerTotals {
  totalOrderQty: number;
  totalDispatchQty: number;
  totalDifference: number;
}

interface CustomerData {
  customerId: number;
  customerName: string;
  customerCity: string;
  items: CustomerItem[];
  customerTotals: CustomerTotals;
}

interface GrandTotals {
  totalCustomers: number;
  totalOrders: number;
  totalOrderQty: number;
  totalDispatchQty: number;
  totalDifference: number;
}

interface PrintFilters {
  dateFrom: string;
  dateTo: string;
  uom: string;
}

interface ItemOrderDispatchPrintModalProps {
  reportData: CustomerData[];
  grandTotals: GrandTotals;
  filters: PrintFilters;
  mode?: 'view' | 'print';
  onClose: () => void;
}

const ItemOrderDispatchPrintModal: React.FC<ItemOrderDispatchPrintModalProps> = ({
  reportData,
  grandTotals,
  filters,
  mode = 'print',
  onClose
}) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const getUomLabel = (uom: string) => {
    switch (uom) {
      case '1': return 'Primary (Pcs/Pkt)';
      case '2': return 'Secondary (Box)';
      case '3': return 'Tertiary (Crt)';
      default: return 'Unknown';
    }
  };

  const executePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert('Please allow popups for printing');
      onClose();
      return;
    }

    // Build ALL rows in ONE table
    let allRows = '';
    
    reportData.forEach((customer) => {
      // Customer Header Row - spans all columns
      allRows += `
        <tr class="customer-header-row">
          <td colspan="8" style="padding:10px 12px;font-size:14px;font-weight:bold;">
            ${customer.customerName}
            ${customer.customerCity ? `<span style="font-weight:normal;opacity:0.9;margin-left:10px;"> ${customer.customerCity}</span>` : ''}
          </td>
        </tr>
      `;

      // Item rows for this customer
      customer.items.forEach((item, index) => {
        const diffColor = item.difference === 0 
          ? '#065f46' 
          : item.difference > 0 
            ? '#b45309' 
            : '#7c3aed';

        const rowBg = index % 2 === 0 ? '#ffffff' : '#f3f4f6';

        allRows += `
          <tr style="background:${rowBg};">
            <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e5e7eb;">${index + 1}</td>
            <td style="text-align:left;padding:10px 8px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600;">${item.orderNumber}</td>
            <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e5e7eb;">${formatDate(item.orderDate)}</td>
            <td style="text-align:left;padding:10px 8px;border-bottom:1px solid #e5e7eb;font-weight:500;">${item.itemName}</td>
            <td style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e7eb;font-family:Consolas,monospace;">${formatNumber(item.orderQty)}</td>
            <td style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e7eb;font-family:Consolas,monospace;color:#059669;font-weight:600;">${formatNumber(item.dispatchQty)}</td>
            <td style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e7eb;font-family:Consolas,monospace;font-weight:700;color:${diffColor};">${item.difference > 0 ? '+' : ''}${formatNumber(item.difference)}</td>
            <td style="text-align:center;padding:10px 8px;border-bottom:1px solid #e5e7eb;">${item.uomName}</td>
          </tr>
        `;
      });

      // Customer Total Row
      const totalDiffColor = customer.customerTotals.totalDifference === 0 
        ? '#86efac' 
        : customer.customerTotals.totalDifference > 0 
          ? '#fcd34d' 
          : '#c4b5fd';

      allRows += `
        <tr class="customer-total-row" style="background:#374151;color:white;">
          <td colspan="4" style="text-align:right;padding:10px 12px;font-weight:600;"></td>
          <td style="text-align:right;padding:10px 12px;font-family:Consolas,monospace;font-weight:bold;">${formatNumber(customer.customerTotals.totalOrderQty)}</td>
          <td style="text-align:right;padding:10px 12px;font-family:Consolas,monospace;font-weight:bold;">${formatNumber(customer.customerTotals.totalDispatchQty)}</td>
          <td style="text-align:right;padding:10px 12px;font-family:Consolas,monospace;font-weight:bold;color:${totalDiffColor};">${customer.customerTotals.totalDifference > 0 ? '+' : ''}${formatNumber(customer.customerTotals.totalDifference)}</td>
          <td style="padding:10px 8px;"></td>
        </tr>
      `;
    });

    const grandDiffColor = grandTotals.totalDifference === 0 
      ? '#065f46' 
      : grandTotals.totalDifference > 0 
        ? '#b45309' 
        : '#7c3aed';

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Item Order vs Dispatch Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #1f2937;
      background: white;
    }
    
    .report-header {
      text-align: center;
      padding: 12px 0;
      border-bottom: 3px solid #059669;
      margin-bottom: 15px;
    }
    
    .report-title {
      font-size: 20px;
      font-weight: bold;
      color: #059669;
      margin-bottom: 8px;
    }
    
    .report-filters {
      display: flex;
      justify-content: center;
      gap: 30px;
      font-size: 12px;
      color: #4b5563;
    }
    
    .report-filters strong {
      color: #059669;
    }
    
    .grand-summary {
      display: flex;
      justify-content: space-around;
      background: #f0fdf4;
      border: 2px solid #86efac;
      border-radius: 8px;
      padding: 12px 20px;
      margin-bottom: 15px;
    }
    
    .summary-item {
      text-align: center;
    }
    
    .summary-item .label {
      font-size: 10px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .summary-item .value {
      font-size: 18px;
      font-weight: bold;
      color: #059669;
    }
    
    /* Main table - SINGLE table for everything */
    .main-table {
      width: 100%;
      border-collapse: collapse;
      
      font-size: 12px;
      table-layout: fixed;
    }
    
    .main-table thead th {
     
      padding: 12px 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #047857;
    }
    
    .main-table colgroup col:nth-child(1) { width: 5%; }
    .main-table colgroup col:nth-child(2) { width: 10%; }
    .main-table colgroup col:nth-child(3) { width: 12%; }
    .main-table colgroup col:nth-child(4) { width: 28%; }
    .main-table colgroup col:nth-child(5) { width: 12%; }
    .main-table colgroup col:nth-child(6) { width: 12%; }
    .main-table colgroup col:nth-child(7) { width: 11%; }
    .main-table colgroup col:nth-child(8) { width: 10%; }
    
    .print-footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 2px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #6b7280;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      thead {
        display: table-header-group;
      }
      
      tr {
        page-break-inside: avoid;
      }
      
      .customer-header-row {
        page-break-after: avoid;
      }
      
      .customer-total-row {
        page-break-before: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="report-header">
   
    <div class="report-filters">
      <span><strong>From:</strong> ${formatDate(filters.dateFrom)}</span>
      <span><strong>To:</strong> ${formatDate(filters.dateTo)}</span>
      <span><strong>UOM:</strong> ${getUomLabel(filters.uom)}</span>
    </div>
  </div>
  
  <div class="grand-summary">
    <div class="summary-item">
      <div class="label">Customers</div>
      <div class="value">${grandTotals.totalCustomers}</div>
    </div>
    <div class="summary-item">
      <div class="label">Orders</div>
      <div class="value">${grandTotals.totalOrders}</div>
    </div>
    <div class="summary-item">
      <div class="label">Total Ordered</div>
      <div class="value">${formatNumber(grandTotals.totalOrderQty)}</div>
    </div>
    <div class="summary-item">
      <div class="label">Total Dispatched</div>
      <div class="value">${formatNumber(grandTotals.totalDispatchQty)}</div>
    </div>
    <div class="summary-item">
      <div class="label">Total Pending</div>
      <div class="value" style="color:${grandDiffColor};">${formatNumber(grandTotals.totalDifference)}</div>
    </div>
  </div>
  
  <!-- SINGLE TABLE FOR EVERYTHING -->
  <table class="main-table" style="">
    <colgroup>
      <col><col><col><col><col><col><col><col>
    </colgroup>
    <thead>
      <tr>
        <th style="text-align:center;">#</th>
        <th style="text-align:left;">Order</th>
        <th style="text-align:center;">Date</th>
        <th style="text-align:left;">Item Name</th>
        <th style="text-align:right;padding-right:12px;">Order Qty</th>
        <th style="text-align:right;padding-right:12px;">Dispatch</th>
        <th style="text-align:right;padding-right:12px;">Remaining</th>
        <th style="text-align:center;">UOM</th>
      </tr>
    </thead>
    <tbody>
      ${allRows}
    </tbody>
  </table>
  
  <div class="print-footer">
    <span>Generated: ${new Date().toLocaleString()}</span>
    <span>Total: ${grandTotals.totalCustomers} Customers | ${grandTotals.totalOrders} Orders</span>
  </div>
</body>
</html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      onClose();
    }, 400);
  };

  useEffect(() => {
    if (mode === 'print') {
      executePrint();
    }
  }, []);

  if (mode === 'print') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-emerald-50">
          <h2 className="text-lg font-bold text-emerald-800">Print Report</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={executePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-base"
            >
              <Printer className="w-5 h-5" />
              Print Report
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-gray-100">
          <div className="bg-white p-8 shadow-xl mx-auto rounded-xl" style={{ maxWidth: '500px' }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Print</h3>
              <p className="text-gray-500 mb-6">All customers in single aligned table</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <p className="text-2xl font-bold text-emerald-600">{grandTotals.totalCustomers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-emerald-600">{grandTotals.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Ordered</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatNumber(grandTotals.totalOrderQty)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Pending</p>
                    <p className={`text-2xl font-bold ${
                      grandTotals.totalDifference === 0 ? 'text-green-600' :
                      grandTotals.totalDifference > 0 ? 'text-yellow-600' : 'text-purple-600'
                    }`}>{formatNumber(grandTotals.totalDifference)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemOrderDispatchPrintModal;
