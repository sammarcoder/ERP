// import React from 'react';

// const DispatchPrintModal = ({ dispatch, onClose }) => {

//   // ✅ PERFECT: Use Stock_out_UOM field to determine selected UOM and quantity
//   const getSelectedUomAndQuantity = (detail) => {
//     const stockOutUom = parseInt(detail.Stock_out_UOM);

//     console.log(`📊 Item ${detail.item?.itemName}:`, {
//       stockOutUom,
//       quantities: {
//         uom1: detail.Stock_out_UOM_Qty,
//         uom2: detail.Stock_out_SKU_UOM_Qty,
//         uom3: detail.Stock_out_UOM3_Qty
//       },
//       uoms: {
//         uom1: detail.item?.uom1?.uom,
//         uom2: detail.item?.uomTwo?.uom,
//         uom3: detail.item?.uomThree?.uom
//       }
//     });

//     // Use Stock_out_UOM to determine which UOM was selected
//     if (stockOutUom === 1) {
//       return {
//         quantity: parseFloat(detail.Stock_out_UOM_Qty) || 0,
//         uom: detail.item?.uom1?.uom || 'Pkt'
//       };
//     } else if (stockOutUom === 2) {
//       return {
//         quantity: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
//         uom: detail.item?.uomTwo?.uom || 'Box'
//       };
//     } else if (stockOutUom === 3) {
//       return {
//         quantity: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
//         uom: detail.item?.uomThree?.uom || 'Crt'
//       };
//     }

//     // Fallback to UOM1
//     return {
//       quantity: parseFloat(detail.Stock_out_UOM_Qty) || 0,
//       uom: detail.item?.uom1?.uom || 'Unit'
//     };
//   };

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=no,toolbar=no,menubar=no');
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           @page { 
//             size: A4; 
//             margin: 12mm; 
//           }

//           @media print {
//             body { -webkit-print-color-adjust: exact; }
//           }

//           * { margin: 0; padding: 0; }
//           body { 
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
//             font-size: 14px; 
//             line-height: 1.3;
//           }

//           .info { 
//             display: flex;

//             margin-bottom: 8px; 
//             padding: 2px; 
//             gap: 8px;
//           }
//           .info-row { 
//             margin-bottom: 3px; 
//             font-size: 16px; 
//             font-weight: 500;
//             border: 1px solid black;
//             border-radius: 4px;
//             padding: 6px;


//           }

//           table { 
//             width: 100%; 
//             border-collapse: separate;
//             border-spacing: 0;
//             border-radius: 6px;
//             border: 1px solid #000;
//             overflow: hidden;
//           }
//           th, td { 
//             border-right: 1px solid #000;
//             border-bottom: 1px solid #000; 
//             padding: 5px; 
//           }
//           th:last-child, td:last-child {
//             border-right: none;
//           }
//           tr:last-child td {
//             border-bottom: none;
//           }
//           th { 
//             background-color: #f0f0f0; 
//             text-align: center; 
//             font-weight: bold; 
//             font-size: 12px;
//             border-top: none;
//           }
//           .text-center { text-align: center; }
//           .text-right { text-align: right; padding-right: 6px }

//           .total-row {

//             font-weight: bold !important;
//             font-size: 13px !important;
//             border-top: 2px solid #155724 !important;
//           }

//           .page-break { page-break-before: always; }

//           .footer-section { 
//             margin-top: 10px; 
//             display: grid; 
//             grid-template-columns: 1fr 1fr; 
//             gap: 30px; 
//           }
//           .signature-column { 
//             padding: 8px; 
//             height: 35px; 
//             border: 1px solid black;
//             border-radius: 6px;
//           }
//           .signature-title { 
//             font-weight: bold; 
//             margin-bottom: 20px; 
//             font-size: 14px;
//           }
//           .signature-line { 
//             border-top: 1px solid #000; 
//             padding-top: 3px; 
//             font-size: 11px; 
//           }
//         </style>
//       </head>
//       <body>
//         <!-- First Row: Date, S/O, No -->
//         <div class="info">
//           <div class="info-row"><strong>Date:</strong> ${new Date(dispatch.Date).toLocaleDateString()}</div>
//           <div class="info-row"><strong>Sale Order:</strong> ${dispatch.order?.Number || 'N/A'}</div>
//           <div class="info-row"><strong>No:</strong> ${dispatch.Number}</div>
//            <div class="info-row"><strong>Transporter:</strong> ${dispatch.transporter?.name || 'N/A'}</div>
//         </div>

//         <!-- Second Row: Customer, Sub Customer, Setup Name, City, Transporter -->
//         <div class="info">
//           <div class="info-row"><strong>Customer:</strong> ${dispatch.account?.acName || 'N/A'}</div>
//                     <div class="info-row"><strong>Setup Name:</strong> ${dispatch.account?.setupName || 'N/A'}</div>
//                               <div class="info-row"><strong>City:</strong> ${dispatch.account?.city || 'N/A'}</div>
//           <div class="info-row"><strong>Sub Customer:</strong> ${dispatch.order?.subAccount || 'N/A'}</div>



//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th style="width: 8%;">Sr#</th>
//               <th style="width: 25%;">Batch</th>
//               <th style="width: 45%;">Item Name</th>
//               <th style="width: 22%;">Quantity</th>
//             </tr>
//           </thead>
//           <tbody>
//     `);

//     // Calculate UOM totals while processing items
//     const uomTotals = {};

//     // 26 rows per page (save 1 row for total)
//     const itemsPerPage = 26;
//     const totalItems = dispatch.details?.length || 0;
//     const totalPages = Math.ceil(Math.max(totalItems, itemsPerPage) / itemsPerPage);

//     let currentItemIndex = 0;

//     // Generate pages with 26 rows each
//     for (let page = 0; page < totalPages; page++) {
//       if (page > 0) {
//         printWindow.document.write(`
//           </tbody>
//         </table>
//         <div class="page-break"></div>
//         <table>
//           <thead style="font-size: 14px;">
//             <tr>
//               <th style="width: 8%;">Sr#</th>
//               <th style="width: 25%;">Batch</th>
//               <th style="width: 45%;">Item Name</th>
//               <th style="width: 22%;">Quantity</th>
//             </tr>
//           </thead>
//           <tbody>
//         `);
//       }

//       // Fill this page with exactly 26 rows
//       for (let row = 0; row < itemsPerPage; row++) {
//         if (currentItemIndex < totalItems) {
//           // ✅ PERFECT: Get correct UOM and quantity using Stock_out_UOM field
//           const detail = dispatch.details[currentItemIndex];
//           const result = getSelectedUomAndQuantity(detail);
//           const quantity = result.quantity;
//           const uom = result.uom;

//           console.log(`✅ Item ${currentItemIndex + 1}: ${quantity} ${uom}`);

//           // Add to UOM totals
//           if (uomTotals[uom]) {
//             uomTotals[uom] += quantity;
//           } else {
//             uomTotals[uom] = quantity;
//           }

//           printWindow.document.write(`
//             <tr>
//               <td class="text-center">${currentItemIndex + 1}</td>
//               <td>${detail.batchDetails?.acName || 'N/A'} (${detail.batchno})</td>
//               <td>${detail.item?.itemName || ''}</td>
//               <td class="text-right">${quantity} ${uom}</td>
//             </tr>
//           `);
//           currentItemIndex++;
//         } else {
//           // Empty row to fill the page
//           printWindow.document.write(`
//             <tr>
//               <td class="text-center">&nbsp;</td>
//               <td>&nbsp;</td>
//               <td>&nbsp;</td>
//               <td class="text-center">&nbsp;</td>
//             </tr>
//           `);
//         }
//       }
//     }

//     // Create UOM totals display string
//     let totalDisplay = '';
//     Object.entries(uomTotals).forEach(([uom, total], index) => {
//       if (index > 0) totalDisplay += ', ';
//       totalDisplay += `${total} ${uom}`;
//     });

//     // Add UOM totals row
//     printWindow.document.write(`
//       <tr class="total-row">
//         <td colspan="3" class="text-right" >
//           TOTAL QUANTITY:
//         </td>
//         <td class="text-right" style="font-weight: bold; color: #155724;">
//           ${totalDisplay}
//         </td>
//       </tr>
//     `);

//     // Add two-column footer at the end
//     printWindow.document.write(`
//           </tbody>
//         </table>

//         <div class="footer-section">
//           <div class="signature-column">
//             <div class="signature-title">Discharged by</div>

//           </div>
//           <div class="signature-column">
//             <div class="signature-title">Enter by</div>

//           </div>
//         </div>

//       </body>
//       </html>
//     `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     }, 250);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-80 resize-none">
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


// //  style="padding-right: 10px; font-weight: bold; color: #155724;"


































































import React from 'react';

const DispatchPrintModal = ({ dispatch, onClose }) => {

  function formatMyDate(dateString) {
    const parts = dateString.split('/');
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }

  let inputDate = "21/11/2025";
  let formattedDate = formatMyDate(inputDate); // Output: "21/Nov/25"
  console.log(formattedDate);

  const date = new Date(dispatch.Date).toLocaleDateString()

  const getSelectedUomAndQuantity = (detail) => {
    // ✅ FIXED: Check both Stock_out_UOM and Sale_Unit fields
    const stockOutUom = parseInt(detail.Stock_out_UOM) || parseInt(detail.Sale_Unit);

    if (stockOutUom === 1) {
      return {
        quantity: parseFloat(detail.Stock_out_UOM_Qty) || parseFloat(detail.uom1_qty) || 0,
        uom: detail.item?.uom1?.uom || 'Pkt'
      };
    } else if (stockOutUom === 2) {
      return {
        quantity: parseFloat(detail.Stock_out_SKU_UOM_Qty) || parseFloat(detail.uom2_qty) || 0,
        uom: detail.item?.uomTwo?.uom || 'Box'
      };
    } else if (stockOutUom === 3) {
      return {
        quantity: parseFloat(detail.Stock_out_UOM3_Qty) || parseFloat(detail.uom3_qty) || 0,
        uom: detail.item?.uomThree?.uom || 'Crt'
      };
    }

    // Fallback to UOM1
    return {
      quantity: parseFloat(detail.Stock_out_UOM_Qty) || parseFloat(detail.uom1_qty) || 0,
      uom: detail.item?.uom1?.uom || 'Unit'
    };
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<style>
@page { size: A4; margin: 12mm; }

* { margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.3;
}

.info {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.info-row {
  padding: 2px;
  font-size: 16px;
  font-weight: 500;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #000;
  border-radius: 6px;
  overflow: hidden;
}

/* ✅ ONLY slight row height increase */
th, td {
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 7px 5px;
}

th:last-child,
td:last-child { border-right: none; }

tr:last-child td { border-bottom: none; }

th {
  background-color: #f0f0f0;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
}

.text-center { text-align: center; }
.text-right { text-align: right; padding-right: 6px; }

.total-row {
  font-weight: bold;
  font-size: 13px;
  border-top: 2px solid #155724;
}

.page-break { page-break-before: always; }

.footer-section {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.signature-column {
  border: 1px solid #000;
  border-radius: 6px;
  height: 35px;
  padding: 8px;
}

.signature-title {
  font-weight: bold;
  font-size: 14px;
}
</style>
</head>

<body>

<div class="info" style="margin-top:0px;">
  <div class="info-row"><strong>Date:</strong> ${formatMyDate(date)}</div>
  <div class="info-row"><strong>Sale Order:</strong> ${dispatch.order?.Number || 'N/A'}</div>
  <div class="info-row"><strong>No:</strong> ${dispatch.Number}</div>
</div>

<div class="info">
  <div class="info-row"><strong>Customer:</strong> ${dispatch.account?.acName || 'N/A'}</div>
  <div class="info-row"><strong>Setup Name:</strong> ${dispatch.account?.setupName || 'N/A'}</div>
  <div class="info-row"><strong>City:</strong> ${dispatch.account?.city || 'N/A'}</div>
</div>

<div class="info" style="margin-top:0px;">
  <div class="info-row"><strong>Sub Customer:</strong> ${dispatch.order?.subAccount || 'N/A'}</div>
  <div class="info-row"><strong>Sub City:</strong> ${dispatch.order?.name || 'N/A'}</div>
</div>

<div class="info" style="margin-top:0px;">
  <div class="info-row"><strong>Transporter:</strong> ${dispatch.transporter?.name || 'N/A'}</div>
  <div style="border-bottom: 1px solid; width: 80px; margin-left:10px;"><strong></strong> </div>
  <div style="border-bottom: 1px solid; width: 80px; margin-left:10px;"><strong></strong></div>
  <div style="border-bottom: 1px solid; width: 80px; margin-left:10px;"><strong></strong></div>
</div>


<table>
<thead>
<tr>
  <th style="width:5%">Sr#</th>
  <th style="width:50%">Batch</th>
  <th style="width:40%">Item Name</th>
  <th style="width:5%">Quantity</th>
</tr>
</thead>
<tbody>
`);

    const uomTotals = {};
    const itemsPerPage = 19;
    const totalItems = dispatch.details?.length || 0;
    const totalPages = Math.ceil(Math.max(totalItems, itemsPerPage) / itemsPerPage);
    let currentItemIndex = 0;

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        printWindow.document.write(`
</tbody></table>
<div class="page-break"></div>
<table>
<thead>
<tr>
  <th>Sr#</th>
  <th>Batch</th>
  <th>Item Name</th>
  <th>Quantity</th>
</tr>
</thead>
<tbody>
`);
      }

      for (let row = 0; row < itemsPerPage; row++) {
        if (currentItemIndex < totalItems) {
          const detail = dispatch.details[currentItemIndex];
          const { quantity, uom } = getSelectedUomAndQuantity(detail);

          uomTotals[uom] = (uomTotals[uom] || 0) + quantity;

          printWindow.document.write(`
<tr>
  <td class="text-center">${currentItemIndex + 1}</td>
  <td style="font-weight:700; font-size:16px; ">${detail.batchDetails?.acName || 'N/A'}</td>
  <td>${detail.item?.itemName || ''}</td>
  <td class="text-right">${quantity} ${uom}</td>
</tr>
`);
          currentItemIndex++;
        } else {
          printWindow.document.write(`
<tr>
  <td>&nbsp;</td><td></td><td></td><td></td>
</tr>
`);
        }
      }
    }

    const totalDisplay = Object.entries(uomTotals)
      .map(([u, q]) => `${q} ${u}`)
      .join(', ');

    printWindow.document.write(`
<tr class="total-row">
  <td colspan="2">TOTAL QUANTITY</td>
  <td colspan="2">${totalDisplay}</td>
</tr>
</tbody>
</table>

<!-- ✅ RESTORED BOX (UNCHANGED) -->
<div style="padding:10px; border:1px solid; height:70px; margin-top:15px; border-radius:5px">Remarks:</div>

<div class="footer-section">
  <div class="signature-column">
    <div class="signature-title">Discharged by</div>
  </div>
  <div class="signature-column">
    <div class="signature-title">Enter by</div>
  </div>
</div>

</body>
</html>
`);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-80">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Print Dispatch</h3>
          <p className="mb-4">{dispatch.Number} - {dispatch.account?.acName}</p>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">Print</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchPrintModal;
