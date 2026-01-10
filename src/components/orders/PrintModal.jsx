// components/PrintModal.js - DIRECT PRINT FUNCTION (NO UI)
import React from 'react';

// ✅ Direct print function - no modal UI, just print logic
const directPrintOrder = (order, isPurchase = false) => {
  
  // ✅ Integrated UOM Display Logic with Uom_Id usage
  const getDisplayQuantity = (detail) => {
    const saleUnit = parseInt(detail.sale_unit)
    const uomId = detail.Uom_Id
    let quantity = 0
    let uomName = 'Unknown'

    // Determine quantity and UOM based on sale_unit
    if (saleUnit === 1 && detail.uom1_qty) {
      quantity = parseFloat(detail.uom1_qty)
      uomName = detail.item?.uom1?.uom || 'Pkt'
    } else if (saleUnit === 2 && detail.uom2_qty) {
      quantity = parseFloat(detail.uom2_qty)  
      uomName = detail.item?.uomTwo?.uom || 'Box'
    } else if (saleUnit === 3 && detail.uom3_qty) {
      quantity = parseFloat(detail.uom3_qty)
      uomName = detail.item?.uomThree?.uom || 'Crt'
    }

    // ✅ Use Uom_Id to get the correct UOM name from the detail.uom object
    if (detail.uom && detail.uom.id === uomId) {
      uomName = detail.uom.uom
    }

    return `${quantity} ${uomName}`
  }



 function formatMyDate(dateString) {
    const parts = dateString.split('/');
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }
  // Auto-populate transporter info from order data
  const transporterInfo = order?.Transporter_ID 
    ? `Freight: ${order.freight_crt || 0},   Labour: ${order.labour_crt || 0}, Bility: ${order.bility_expense || 0},   Other: ${order.other_expense || 0}`
    : ''

  // Create pages - 16 items first page, rest on second page
  const itemsFirstPage = 16;
  const allItems = order.details || [];
  const pages = [];
  
  // First page
  pages.push({
    items: allItems.slice(0, Math.min(itemsFirstPage, allItems.length)),
    startIndex: 0,
    pageNumber: 1,
    isFirst: true
  });
  
  // Second page if needed
  if (allItems.length > itemsFirstPage) {
    pages.push({
      items: allItems.slice(itemsFirstPage),
      startIndex: itemsFirstPage,
      pageNumber: 2,
      isFirst: false
    });
  }

  // Create iframe for isolated printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  
  // Write the content with adjusted height to prevent cutoff
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print ${isPurchase ? 'Purchase Order' : 'Sales Invoice'}</title>
      <style>
        @page {
          size: 4in 7in;
          margin: 0;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          width: 4in;
          margin: 0;
          padding: 0;
        }
        
        .page {
          width: 3.8in;
          height: 6.7in;
          padding: 0.15in;
          padding-top: 0.2in;
          margin: 0 auto;
          page-break-after: always;
          page-break-inside: avoid;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .page:last-child {
          page-break-after: auto;
        }
        
        .header-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 9pt;
        }
        
        .customer-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 10pt;
        }
        .customer-row2 {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 13pt;
        }
        
        .divider {
          border-top: 1px solid #333;
          margin: 6px 0;
        }
        
        .ada-box {
          border: 1px solid #666;
          padding: 4px;
          margin: 6px 0;
        }
        
        .ada-label {
          font-weight: bold;
          font-size: 9pt;
          margin-bottom: 2px;
        }
        
        .ada-value {
          min-height: 16px;
          font-size: 9pt;
          padding: 2px 0;
        }
        
        .table-title {
          background: #f0f0f0;
          border: 1px solid #333;
          text-align: center;
          padding: 4px;
          font-weight: bold;
          font-size: 10pt;
          margin: 6px 0;
        }
        
        .table-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          flex: 1;
        }
        
        th {
          border: 1px solid #000;
          background: #e8e8e8;
          padding: 3px 2px;
          font-size: 9pt;
          font-weight: bold;
          text-align: center;
          height: 22px;
        }
        
        td {
          border: 1px solid #000;
          padding: 3px 2px;
          font-size: 9pt;
          vertical-align: middle;
          height: 20px;
        }
        
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .even { background: white; }
        .odd { background: #f9f9f9; }
        
        .check-box {
          width: 11px;
          height: 11px;
          border: 1px solid #000;
          display: inline-block;
          margin: 0 auto;
        }
        
        .dispatch-value {
          min-height: 12px;
          font-size: 8pt;
          padding: 1px 0;
        }
        
        .footer {
          margin-top: auto;
          text-align: center;
          font-size: 8pt;
          color: #666;
          border-top: 1px solid #999;
          padding-top: 3px;
          padding-bottom: 3px;
        }
        
        .status-complete { color: green; }
        .status-incomplete { color: orange; }
      </style>
    </head>
    <body>
  `);
  
  // Generate pages HTML
  pages.forEach((page, pageIdx) => {
    doc.write('<div class="page">');
    
    if (page.isFirst) {
      // First page header - Full info with integrated order data
      doc.write(`
        <div>
          <div class="header-row">
            <span><strong>Date:</strong> ${formatMyDate(new Date(order.Date).toLocaleDateString('en-GB'))}</span>

            <span><strong></strong> ${order.Number}</span>
            <span class="${order.Next_Status === 'Complete' ? 'status-complete' : 'status-incomplete'}">
              <strong>Status:</strong> ${order.Next_Status}
            </span>
          </div>
          <div class="divider"></div>
          <div class="customer-row">
            <span><strong>Setup Name:</strong> ${order.account?.setupName || 'N/A'}</span>
            <span style="margin-right:20px;"><strong>City:</strong> ${order.account?.city || 'N/A'}</span>
          </div>
           <div class="customer-row">
            <span><strong>${isPurchase ? 'Supplier' : 'Customer'}</strong> ${order.account?.acName || order.account?.AccountTitle || 'N/A'}</span>
           
            
          </div>
          <div class="customer-row2">
            <span><strong>Sub: ${order.sub_customer || order.account?.sub_customer || 'N/A'}</strong></span>
            <span style="margin-right:20px;"><strong>Sub:</strong> ${order.sub_city || order.account?.sub_city || 'N/A'}</span>
          </div>
          <div class="ada-box">
            <div class="ada-label">ADA:${order.transporter.name}</div>
            <div class="ada-value">${transporterInfo || '&nbsp;'}</div>
          </div>
        </div>
      `);
    } else {
      // Subsequent pages - Only customer and city
      doc.write(`
        <div>
          <div class="customer-row" style="font-weight: bold; padding-bottom: 5px; border-bottom: 1px solid #333; margin-bottom: 8px;">
            <span>${isPurchase ? 'Supplier' : 'Customer'}: ${order.account?.acName || order.account?.AccountTitle || 'N/A'}</span>
            <span>City: ${order.account?.city || 'N/A'}</span>
          </div>
        </div>
      `);
    }
    
    // Table with checkbox as separate column
    doc.write(`
      <div class="table-container">
        <div class="table-title">
          ${isPurchase ? 'PURCHASE ORDER ITEMS' : 'ORDER ITEMS'} (Page ${page.pageNumber} of ${pages.length})
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 7%">Sr</th>
              <th style="width: 42%" class="text-left">Item Name</th>
              <th style="width: 23%">Quantity</th>
              <th style="width: 8%">✓</th>
              <th style="width: 20%">Dispatch</th>
            </tr>
          </thead>
          <tbody>
    `);
    
    // Add items with correct quantity display using integrated logic
    page.items.forEach((detail, idx) => {
      const globalIdx = page.startIndex + idx;
      const rowClass = idx % 2 === 0 ? 'even' : 'odd';
      doc.write(`
        <tr class="${rowClass}">
          <td class="text-center"><strong>${globalIdx + 1}</strong></td>
          <td class="text-left">${detail.item?.itemName || 'Unknown'}</td>
         
          <td class="text-center">
            <strong>${getDisplayQuantity(detail)}</strong>
          </td>


 <td class="text-center">
            <span class="check-box"></span>
          </td>


          <td>
            <div class="dispatch-value">&nbsp;</div>
          </td>
        </tr>
      `);
    });
    
    // Fill remaining empty rows to use full page height
    const totalRowsNeeded = page.isFirst ? 16 : 20;
    const emptyRowsNeeded = totalRowsNeeded - page.items.length;
    
    for (let i = 0; i < emptyRowsNeeded; i++) {
      const rowClass = (page.items.length + i) % 2 === 0 ? 'even' : 'odd';
      doc.write(`
        <tr class="${rowClass}">
          <td class="text-center">&nbsp;</td>
          <td>&nbsp;</td>
         
          <td>&nbsp;</td>
           <td class="text-center"><span class="check-box"></span></td>
          <td>&nbsp;</td>
        </tr>
      `);
    }
    
    doc.write(`
          </tbody>
        </table>
      </div>
    `);
    
    // Footer on last page with order summary
    if (pageIdx === pages.length - 1) {
      const totalItems = order.details?.length || 0;
      const totalAmount = order.details?.reduce((sum, detail) => {
        const saleUnit = parseInt(detail.sale_unit);
        let quantity = 0;
        if (saleUnit === 1) quantity = parseFloat(detail.uom1_qty || 0);
        else if (saleUnit === 2) quantity = parseFloat(detail.uom2_qty || 0);
        else if (saleUnit === 3) quantity = parseFloat(detail.uom3_qty || 0);
        
        const unitPrice = parseFloat(detail.item?.sellingPrice || detail.item?.purchasePricePKR || 0);
        return sum + (quantity * unitPrice);
      }, 0) || 0;

      doc.write(`
        <div class="footer">
          <div>
            Print: ${new Date().toLocaleString()} | ${isPurchase ? 'PO' : 'SO'}: ${order.Number}
          </div>
        </div>
      `);
    }
    
    doc.write('</div>');
  });
  
  doc.write(`
    </body>
    </html>
  `);
  doc.close();
  
  // Wait for content to load then print
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    
    // Clean up after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 100);
};

export default directPrintOrder;
