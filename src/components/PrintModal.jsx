import React, { useState, useRef, useEffect } from 'react';
const PrintModal = ({ order, isPurchase, onClose, getDisplayQuantity }) => {
  const [dispatchNotes, setDispatchNotes] = useState({});
  const [transporterInfo, setTransporterInfo] = useState('');
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);
  
  const handleDispatchChange = (index, value) => {
    setDispatchNotes(prev => ({ ...prev, [index]: value }));
  };

  // Create pages - 16 items first page, rest on second page
  useEffect(() => {
    if (order?.details && order.details.length > 0) {
      const itemsFirstPage = 16;
      const allItems = order.details;
      const pagesArray = [];
      
      // First page
      pagesArray.push({
        items: allItems.slice(0, Math.min(itemsFirstPage, allItems.length)),
        startIndex: 0,
        pageNumber: 1,
        isFirst: true
      });
      
      // Second page if needed
      if (allItems.length > itemsFirstPage) {
        pagesArray.push({
          items: allItems.slice(itemsFirstPage),
          startIndex: itemsFirstPage,
          pageNumber: 2,
          isFirst: false
        });
      }
      
      setPages(pagesArray);
    }
  }, [order]);

  const handlePrint = () => {
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
        <title>Print Invoice</title>
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
            height: 6.7in;  /* Reduced height to prevent cutoff */
            padding: 0.15in;  /* Increased padding from top */
            padding-top: 0.2in;  /* Extra top padding to prevent header cutoff */
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
        // First page header - Full info
        doc.write(`
          <div>
            <div class="header-row">
              <span><strong>Date:</strong> ${new Date(order.Date).toLocaleDateString()}</span>
              <span><strong>:</strong> ${order.Number}</span>
              <span class="${order.Next_Status === 'Complete' ? 'status-complete' : 'status-incomplete'}">
                <strong>Status</strong> ${order.Next_Status}
              </span>
            </div>
            <div class="divider"></div>
            <div class="customer-row">
              <span><strong>Customer:</strong> ${order.account?.acName || 'N/A'}</span>
              <span><strong>City:</strong> ${order.account?.city || 'N/A'}</span>
            </div>
            <div class="customer-row">
              <span><strong>Sub:</strong> ${order.account?.subCustomer || order.account?.subName || 'N/A'}</span>
              <span><strong>City2:</strong> ${order.account?.city2 || 'N/A'}</span>
            </div>
            <div class="ada-box">
              <div class="ada-label">ADA:</div>
              <div class="ada-value">${transporterInfo || '&nbsp;'}</div>
            </div>
          </div>
        `);
      } else {
        // Subsequent pages - Only customer and city
        doc.write(`
          <div>
            <div class="customer-row" style="font-weight: bold; padding-bottom: 5px; border-bottom: 1px solid #333; margin-bottom: 8px;">
              <span>Customer: ${order.account?.acName || 'N/A'}</span>
              <span>City: ${order.account?.city || 'N/A'}</span>
            </div>
          </div>
        `);
      }
      
      // Table with checkbox as separate column
      doc.write(`
        <div class="table-container">
          <div class="table-title">
            ORDER ITEMS (Page ${page.pageNumber} of ${pages.length})
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 7%">Sr</th>
                <th style="width: 42%" class="text-left">Item Name</th>
                <th style="width: 8%">✓</th>
                <th style="width: 23%">Quantity</th>
                <th style="width: 20%">Dispatch</th>
              </tr>
            </thead>
            <tbody>
      `);
      
      // Add items with checkbox in separate column
      page.items.forEach((detail, idx) => {
        const globalIdx = page.startIndex + idx;
        const rowClass = idx % 2 === 0 ? 'even' : 'odd';
        doc.write(`
          <tr class="${rowClass}">
            <td class="text-center"><strong>${globalIdx + 1}</strong></td>
            <td class="text-left">${detail.item?.itemName || 'Unknown'}</td>
            <td class="text-center">
              <span class="check-box"></span>
            </td>
            <td class="text-center">
              <strong>${getDisplayQuantity(detail)}</strong>
            </td>
            <td>
              <div class="dispatch-value">${dispatchNotes[globalIdx] || '&nbsp;'}</div>
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
            <td class="text-center"><span class="check-box"></span></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        `);
      }
      
      doc.write(`
            </tbody>
          </table>
        </div>
      `);
      
      // Footer on last page
      if (pageIdx === pages.length - 1) {
        doc.write(`
          <div class="footer">
            Print: ${new Date().toLocaleString()}
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-gray-100 to-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Print {isPurchase ? 'Purchase Order' : 'Sales Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
          >
            ×
          </button>
        </div>

        {/* Print Preview */}
        <div className="p-4 bg-gray-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>
            
            {/* Input Section for Dispatch Notes */}
            <div className="mb-4 border border-gray-300 rounded p-3">
              <h4 className="font-semibold mb-2">Add Notes (Optional):</h4>
              
              {/* ADA/Transporter */}
              <div className="mb-3">
                <label className="font-medium">ADA/Transporter:</label>
                <input
                  type="text"
                  placeholder="Enter ADA details..."
                  value={transporterInfo}
                  onChange={(e) => setTransporterInfo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                />
              </div>
              
              {/* Dispatch Notes */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <label className="font-medium">Dispatch Notes:</label>
                {order.details?.slice(0, 5).map((detail, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-8 font-bold">{index + 1}.</span>
                    <span className="flex-1 truncate">{detail.item?.itemName}:</span>
                    <input
                      type="text"
                      placeholder="Note..."
                      value={dispatchNotes[index] || ''}
                      onChange={(e) => handleDispatchChange(index, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                    />
                  </div>
                ))}
                {order.details?.length > 5 && (
                  <p className="text-xs text-gray-500">+ {order.details.length - 5} more items...</p>
                )}
              </div>
            </div>
            
            {/* Preview Info */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              <p className="text-blue-700">
                <strong>Ready to Print:</strong> {order.details?.length || 0} items
                {pages.length > 1 && ` across ${pages.length} pages`}
              </p>
              {pages.map((page, idx) => (
                <p key={idx} className="text-blue-600 text-xs mt-1">
                  Page {page.pageNumber}: Items {page.startIndex + 1}-{page.startIndex + page.items.length}
                </p>
              ))}
              <p className="text-blue-600 text-xs mt-2">
                <strong>Paper Size:</strong> 4" x 7" (Custom)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 p-4 border-t bg-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;


