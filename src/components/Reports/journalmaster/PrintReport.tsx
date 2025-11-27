// import { ProcessedRecord } from '@/types/reports/journalmaster/JournalTypes'

// interface PrintReportProps {
//     data: ProcessedRecord[]
//     systemRowInfo: {
//         totalOpeningRecords: number
//         openingBalance: number
//         systemRowGenerated: boolean
//         displayBalance: number
//         calculationBalance: number
//         lastHiddenRowIndex: number
//         aboveRowBalance: number
//     }
//     filteringStats: {
//         originalCount: number
//         afterDataFilters: number
//         afterDateFilter: number
//         hiddenByDate: number
//         firstDisplayRowIndex: number
//     }
//     filters: any
//     onClose?: () => void
// }

// export default function PrintReport({
//     data,
//     systemRowInfo,
//     filteringStats,
//     filters,
//     onClose
// }: PrintReportProps) {

//     const generatePrintHTML = () => {
//         const totalCredit = data.reduce((sum, record) => sum + record.amountCr, 0)
//         const totalDebit = data.reduce((sum, record) => sum + record.amountDb, 0)
//         const totalOwnCredit = data.reduce((sum, record) => sum + record.ownCr, 0)
//         const totalOwnDebit = data.reduce((sum, record) => sum + record.ownDb, 0)
//         const netMovement = totalCredit - totalDebit
//         const finalBalance = data[data.length - 1]?.balance || 0
//         const hasDateFilter = filters.dateFrom || filters.dateTo
//         const hasActiveFilters = Object.values(filters).some(v => v)

//         return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Journal Master Report</title>
//         <meta charset="utf-8">
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           body { 
//             font-family: 'Arial', 'Helvetica', sans-serif; 
//             font-size: 11px;
//             line-height: 1.4;
//             color: #333;
//             background: #fff;
//             margin: 0;
//             padding: 20px;
//           }
          
//           .report-container {
//             max-width: 1200px;
//             margin: 0 auto;
//             background: #fff;
//             box-shadow: 0 0 10px rgba(0,0,0,0.1);
//             border-radius: 8px;
//             overflow: hidden;
//           }
          
//           .report-header {
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 30px;
//             text-align: center;
//             position: relative;
//           }
          
//           .company-name {
//             font-size: 28px;
//             font-weight: bold;
//             margin-bottom: 8px;
//             letter-spacing: 1px;
//           }
          
//           .report-title {
//             font-size: 18px;
//             font-weight: 300;
//             opacity: 0.9;
//             margin-bottom: 15px;
//           }
          
//           .report-date {
//             font-size: 12px;
//             opacity: 0.8;
//             border-top: 1px solid rgba(255,255,255,0.2);
//             padding-top: 15px;
//             margin-top: 15px;
//           }
          
//           .summary-section {
//             background: #f8f9fa;
//             padding: 25px;
//             border-bottom: 2px solid #e9ecef;
//           }
          
//           .summary-grid {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//             gap: 20px;
//             margin-bottom: 20px;
//           }
          
//           .summary-card {
//             background: white;
//             padding: 15px;
//             border-radius: 6px;
//             border-left: 4px solid #007bff;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           }
          
//           .summary-card.credit { border-left-color: #28a745; }
//           .summary-card.debit { border-left-color: #dc3545; }
//           .summary-card.balance { border-left-color: #17a2b8; }
//           .summary-card.opening { border-left-color: #fd7e14; }
          
//           .summary-label {
//             font-size: 10px;
//             color: #6c757d;
//             text-transform: uppercase;
//             font-weight: 600;
//             letter-spacing: 0.5px;
//             margin-bottom: 5px;
//           }
          
//           .summary-value {
//             font-size: 16px;
//             font-weight: bold;
//             color: #212529;
//           }
          
//           .summary-value.positive { color: #28a745; }
//           .summary-value.negative { color: #dc3545; }
          
//           .filter-info {
//             background: linear-gradient(90deg, #e3f2fd 0%, #f3e5f5 100%);
//             padding: 20px;
//             margin: 20px 0;
//             border-radius: 6px;
//             border: 1px solid #e1f5fe;
//           }
          
//           .filter-info h4 {
//             color: #1565c0;
//             margin-bottom: 10px;
//             font-size: 12px;
//             font-weight: 600;
//             text-transform: uppercase;
//           }
          
//           .filter-list {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//             gap: 10px;
//             font-size: 10px;
//             color: #37474f;
//           }
          
//           .data-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 20px 0;
//             font-size: 9px;
//             background: white;
//           }
          
//           .data-table thead {
//             background: linear-gradient(135deg, #37474f 0%, #263238 100%);
//             color: white;
//           }
          
//           .data-table th {
//             padding: 12px 8px;
//             text-align: center;
//             font-weight: 600;
//             font-size: 8px;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             border-right: 1px solid rgba(255,255,255,0.1);
//           }
          
//           .data-table th:last-child {
//             border-right: none;
//           }
          
//           .data-table td {
//             padding: 8px;
//             border-bottom: 1px solid #e9ecef;
//             border-right: 1px solid #f8f9fa;
//             vertical-align: middle;
//           }
          
//           .data-table td:last-child {
//             border-right: none;
//           }
          
//           .data-table tbody tr:nth-child(even) {
//             background: #f8f9fa;
//           }
          
//           .data-table tbody tr:hover {
//             background: #e3f2fd;
//           }
          
//           .system-row {
//             background: linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%) !important;
//             border-left: 4px solid #ff9800;
//             font-weight: 600;
//           }
          
//           .system-row td {
//             border-bottom: 2px solid #ffcc02;
//           }
          
//           .total-row {
//             background: linear-gradient(90deg, #e8f5e8 0%, #c8e6c9 100%) !important;
//             border-top: 2px solid #4caf50;
//             font-weight: bold;
//             font-size: 10px;
//           }
          
//           .amount-dr { 
//             color: #d32f2f; 
//             font-weight: 600;
//             text-align: right;
//           }
          
//           .amount-cr { 
//             color: #388e3c; 
//             font-weight: 600;
//             text-align: right;
//           }
          
//           .balance-positive { 
//             color: #2e7d32; 
//             font-weight: bold;
//             text-align: right;
//           }
          
//           .balance-negative { 
//             color: #c62828; 
//             font-weight: bold;
//             text-align: right;
//           }
          
//           .text-center { text-align: center; }
//           .text-right { text-align: right; }
//           .text-left { text-align: left; }
          
//           .dual-balance {
//             font-size: 7px;
//             margin-top: 3px;
//             padding-top: 3px;
//             border-top: 1px solid rgba(255,152,0,0.3);
//           }
          
//           .dual-balance div {
//             margin: 1px 0;
//           }
          
//           .footer-section {
//             background: #f8f9fa;
//             padding: 20px;
//             text-align: center;
//             border-top: 2px solid #e9ecef;
//             color: #6c757d;
//             font-size: 9px;
//           }
          
//           .footer-section .company-info {
//             margin-bottom: 10px;
//             font-weight: 600;
//           }
          
//           .page-break {
//             page-break-before: always;
//           }
          
//           /* Print Styles */
//           @media print {
//             body {
//               font-size: 8px;
//               margin: 0;
//               padding: 0;
//             }
            
//             .report-container {
//               box-shadow: none;
//               border-radius: 0;
//             }
            
//             .data-table {
//               font-size: 7px;
//             }
            
//             .data-table th {
//               font-size: 6px;
//               padding: 8px 4px;
//             }
            
//             .data-table td {
//               padding: 4px;
//             }
            
//             .summary-section {
//               padding: 15px;
//             }
            
//             .report-header {
//               padding: 20px;
//             }
            
//             .company-name {
//               font-size: 22px;
//             }
            
//             .report-title {
//               font-size: 14px;
//             }
//           }
          
//           @page {
//             margin: 0.5in;
//             size: A4 landscape;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="report-container">
//           <!-- Professional Header -->
//           <div class="">
          
//             <div class="report-date">
//               Generated on ${new Date().toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         })}
//             </div>
//           </div>

         

//           ${hasActiveFilters ? `
//           <!-- Filter Information -->
//           <div class="filter-info">
//             <h4>Applied Filters & Processing Information</h4>
//             <div class="filter-list">
//               ${filters.acName ? `<div><strong>Ledger:</strong> ${filters.acName}</div>` : ''}
//               ${filters.description ? `<div><strong>Description:</strong> ${filters.description}</div>` : ''}
//               ${filters.entryType ? `<div><strong>Entry Type:</strong> ${filters.entryType}</div>` : ''}
//               ${filters.dateFrom ? `<div><strong>Date From:</strong> ${filters.dateFrom}</div>` : ''}
//               ${filters.dateTo ? `<div><strong>Date To:</strong> ${filters.dateTo}</div>` : ''}
//               ${systemRowInfo.lastHiddenRowIndex > 0 ? `<div><strong>Hidden Rows:</strong> ${filteringStats.hiddenByDate} (Balance includes calculation from hidden rows)</div>` : ''}
//             </div>
//           </div>
//           ` : ''}

//           <!-- Data Table -->
//           <table class="data-table">
//             <thead>
//               <tr>
//                 <th style="width: 6%">Row #</th>
//                 <th style="width: 12%">Voucher No</th>
//                 <th style="width: 10%">Date</th>
//                 <th style="width: 18%">Description</th>
//                 <th style="width: 10%">Debit</th>
//                 <th style="width: 10%">Credit</th>
//                 <th style="width: 8%">Own Debit</th>
//                 <th style="width: 8%">Own Credit</th>
//                 <th style="width: 6%">Rate</th>
//                 <th style="width: 12%">Balance</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${data.map(record => `
//                 <tr class="${record.isOpening ? 'system-row' : ''}">
//                   <td class="text-center">
//                     ${record.displayRowIndex || record.rowIndex}
//                     ${record.isOpening ? '<br><small style="color: #f57c00;">SYSTEM</small>' : ''}
//                   </td>
//                   <td class="text-center">
//                     ${record.voucherNo}
//                     ${record.isOpening ? '<br><small style="color: #f57c00;">Auto Generated</small>' : ''}
//                   </td>
//                   <td class="text-center">
//                     ${record.isOpening ? '<em style="color: #757575;">No Date</em>' : (
//                 !isNaN(new Date(record.date).getTime())
//                     ? new Date(record.date).toLocaleDateString()
//                     : record.date
//             )}
//                   </td>
//                   <td class="text-left">
//                     ${record.isOpening ? '🔶 ' : ''}${record.description}
//                   </td>
//                   <td class="amount-dr">${record.amountDb.toLocaleString()}</td>
//                   <td class="amount-cr">${record.amountCr.toLocaleString()}</td>
//                   <td class="amount-dr">${record.ownDb.toLocaleString()}</td>
//                   <td class="amount-cr">${record.ownCr.toLocaleString()}</td>
//                   <td class="text-center">${record.isOpening ? '-' : Number(record.rate).toFixed(2)}</td>
//                   <td class="${record.balance >= 0 ? 'balance-positive' : 'balance-negative'}">
//                     ${record.balance.toLocaleString()}
//                     ${record.isOpening && systemRowInfo.lastHiddenRowIndex > 0 ? `
//                       <div class="dual-balance">
//                         <div style="color: #f57c00;"><strong>Display:</strong> ${systemRowInfo.displayBalance.toLocaleString()}</div>
//                         <div style="color: #1976d2;"><strong>Calculation:</strong> ${systemRowInfo.calculationBalance.toLocaleString()}</div>
//                         <div style="color: #757575;">From Row #${systemRowInfo.lastHiddenRowIndex}</div>
//                       </div>
//                     ` : ''}
//                   </td>
//                 </tr>
//               `).join('')}
              
//               <!-- Totals Row -->
//               <tr class="total-row">
//                 <td colspan="4" class="text-center"><strong>REPORT TOTALS</strong></td>
//                 <td class="amount-dr"><strong>${totalDebit.toLocaleString()}</strong></td>
//                 <td class="amount-cr"><strong>${totalCredit.toLocaleString()}</strong></td>
//                 <td class="amount-dr"><strong>${totalOwnDebit.toLocaleString()}</strong></td>
//                 <td class="amount-cr"><strong>${totalOwnCredit.toLocaleString()}</strong></td>
//                 <td class="text-center"><strong>-</strong></td>
//                 <td class="${finalBalance >= 0 ? 'balance-positive' : 'balance-negative'}">
//                   <strong>${finalBalance.toLocaleString()}</strong>
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           <!-- Professional Footer -->
//           <div class="footer-section">
//             <div class="company-info">
//               Your Company Name | Journal Master Report | Confidential
//             </div>
//             <div>
//               Report generated automatically by ERP System • 
//               ${hasDateFilter ? '⚠️ Date filter applied - Balance calculation includes all filtered data' : ''} •
//               Page 1 of 1
//             </div>
//             ${systemRowInfo.systemRowGenerated ?
//                 '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #dee2e6;">🔶 System Generated Row: Always displayed for consistent reporting structure</div>' : ''
//             }
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//     }

//     const handlePrint = () => {
//         const printContent = generatePrintHTML()

//         const printWindow = window.open('', '_blank', 'width=1200,height=800')
//         if (printWindow) {
//             printWindow.document.write(printContent)
//             printWindow.document.close()

//             // Wait for content to load then print
//             printWindow.onload = () => {
//                 setTimeout(() => {
//                     printWindow.print()
//                 }, 250)
//             }
//         }
//     }

//     const handlePreview = () => {
//         const printContent = generatePrintHTML()

//         const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes')
//         if (previewWindow) {
//             previewWindow.document.write(printContent)
//             previewWindow.document.close()
//         }
//     }

//     return (
//         <div className="print-report-controls">
//             <div className="flex space-x-3">
//                 <button
//                     onClick={handlePreview}
//                     className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                     <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                     Preview Report
//                 </button>
//                 <button
//                     onClick={handlePrint}
//                     className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                     <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                     </svg>
//                     Print Report
//                 </button>
//                 {onClose && (
//                     <button
//                         onClick={onClose}
//                         className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                     >
//                         <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Close
//                     </button>
//                 )}
//             </div>
//         </div>
//     )
// }





















































import { ProcessedRecord } from '@/types/reports/journalmaster/JournalTypes'

interface PrintReportProps {
  data: ProcessedRecord[]
  systemRowInfo: {
    totalOpeningRecords: number
    openingBalance: number
    systemRowGenerated: boolean
    displayBalance: number
    calculationBalance: number
    lastHiddenRowIndex: number
    aboveRowBalance: number
  }
  filteringStats: {
    originalCount: number
    afterDataFilters: number
    afterDateFilter: number
    hiddenByDate: number
    firstDisplayRowIndex: number
  }
  filters: any
  onClose?: () => void
}

export default function PrintReport({ 
  data, 
  systemRowInfo, 
  filteringStats, 
  filters,
  onClose 
}: PrintReportProps) {
  
  const generatePrintHTML = () => {
    const totalCredit = data.reduce((sum, record) => sum + record.amountCr, 0)
    const totalDebit = data.reduce((sum, record) => sum + record.amountDb, 0)
    const totalOwnCredit = data.reduce((sum, record) => sum + record.ownCr, 0)
    const totalOwnDebit = data.reduce((sum, record) => sum + record.ownDb, 0)
    const finalBalance = data[data.length - 1]?.balance || 0
    const hasActiveFilters = Object.values(filters).some(v => v)
    const hasDateFilter = filters.dateFrom || filters.dateTo

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Journal Master Report</title>
        <meta charset="utf-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Arial', sans-serif; 
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 20px;
          }
          
          .report-container {
            max-width: 100%;
            margin: 0 auto;
            background: #fff;
          }
          
          .report-date {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: bold;
          }
          
          .filter-info {
            background: #f8f8f8;
            padding: 15px;
            margin: 20px 0;
            border: 1px solid #ddd;
          }
          
          .filter-info h4 {
            color: #000;
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .filter-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 11px;
            color: #333;
            text-align: left;
            margin-left: 15px;
          }
          
          .filter-list div {
            padding: 2px 0;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 10px;
            border: 2px solid #000;
          }
          
          .data-table thead {
            background: #000;
            color: #fff;
          }
          
          .data-table th {
            padding: 10px 6px;
            text-align: center;
            font-weight: bold;
            font-size: 9px;
            text-transform: uppercase;
            border: 1px solid #000;
          }
          
          .data-table td {
            padding: 6px;
            border: 1px solid #ccc;
            vertical-align: middle;
          }
          
          .data-table tbody tr:nth-child(even) {
            background: #f9f9f9;
          }
          
          .system-row {
            background: #e0e0e0 !important;
            font-weight: bold;
          }
          
          .system-row td {
            border: 1px solid #000;
          }
          
          .total-row {
           
            border-top: 2px solid #000;
            font-weight: bold;
            font-size: 11px;
          }
          
          .total-row td {
            border: 1px solid #000;
          }
          
          .amount-dr { 
            text-align: right;
            font-weight: 600;
          }
          
          .amount-cr { 
            text-align: right;
            font-weight: 600;
          }
          
          .balance-positive { 
            text-align: right;
            font-weight: bold;
          }
          
          .balance-negative { 
            text-align: right;
            font-weight: bold;
          }
          
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          
          .dual-balance {
            font-size: 8px;
            margin-top: 3px;
            padding-top: 3px;
            border-top: 1px solid #ccc;
          }
          
          .dual-balance div {
            margin: 1px 0;
          }
          
          .footer-section {
            background: #f0f0f0;
            padding: 15px;
            text-align: center;
            border-top: 2px solid #000;
            margin-top: 20px;
            font-size: 10px;
          }
          
          .footer-section .company-info {
            margin-bottom: 8px;
            font-weight: bold;
          }
          
          @media print {
            body {
              font-size: 10px;
              margin: 0;
              padding: 10px;
            }
            
            .data-table {
              font-size: 8px;
            }
            
            .data-table th {
              font-size: 7px;
              padding: 6px 4px;
            }
            
            .data-table td {
              padding: 4px;
            }
            
            .filter-info {
              padding: 10px;
            }
            
            .filter-list {
              font-size: 9px;
              margin-left: 10px;
            }
            
            .report-date {
              padding: 15px 0;
            }
          }
          
          @page {
            margin: 0.5in;
            size: A4 landscape;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          
          <div class="report-date">
            Generated on ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          ${hasActiveFilters ? `
          <!-- Filter Information -->
          <div class="filter-info">
            <h4>Applied Filters & Processing Information</h4>
            <div class="filter-list">
              ${filters.acName ? `<div><strong>Ledger:</strong> ${filters.acName}</div>` : ''}
              ${filters.description ? `<div><strong>Description:</strong> ${filters.description}</div>` : ''}
              ${filters.entryType ? `<div><strong>Entry Type:</strong> ${filters.entryType}</div>` : ''}
              ${filters.dateFrom ? `<div><strong>Date From:</strong> ${filters.dateFrom}</div>` : ''}
              ${filters.dateTo ? `<div><strong>Date To:</strong> ${filters.dateTo}</div>` : ''}
              ${systemRowInfo.lastHiddenRowIndex > 0 ? `<div><strong>Hidden Rows:</strong> ${filteringStats.hiddenByDate} (Balance includes calculation from hidden rows)</div>` : ''}
            </div>
          </div>
          ` : ''}

          <!-- Data Table -->
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 6%">Row #</th>
                <th style="width: 12%">Voucher No</th>
                <th style="width: 10%">Date</th>
                <th style="width: 18%">Description</th>
                <th style="width: 10%">Debit</th>
                <th style="width: 10%">Credit</th>
                <th style="width: 8%">Own Debit</th>
                <th style="width: 8%">Own Credit</th>
                <th style="width: 6%">Rate</th>
                <th style="width: 12%">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(record => `
                <tr class="${record.isOpening ? 'system-row' : ''}">
                  <td class="text-center">
                    ${record.displayRowIndex || record.rowIndex}
                    ${record.isOpening ? '<br><small>SYSTEM</small>' : ''}
                  </td>
                  <td class="text-center">
                    ${record.voucherNo}
                    ${record.isOpening ? '<br><small>Auto Generated</small>' : ''}
                  </td>
                  <td class="text-center">
                    ${record.isOpening ? '<em>No Date</em>' : (
                      !isNaN(new Date(record.date).getTime()) 
                        ? new Date(record.date).toLocaleDateString() 
                        : record.date
                    )}
                  </td>
                  <td class="text-left">
                    ${record.description}
                  </td>
                  <td class="amount-dr">${record.amountDb.toLocaleString()}</td>
                  <td class="amount-cr">${record.amountCr.toLocaleString()}</td>
                  <td class="amount-dr">${record.ownDb.toLocaleString()}</td>
                  <td class="amount-cr">${record.ownCr.toLocaleString()}</td>
                  <td class="text-center">${record.isOpening ? '-' : Number(record.rate).toFixed(2)}</td>
                  <td class="${record.balance >= 0 ? 'balance-positive' : 'balance-negative'}">
                    ${record.balance.toLocaleString()}
                    ${record.isOpening && systemRowInfo.lastHiddenRowIndex > 0 ? `
                      <div class="dual-balance">
                        <div><strong>Display:</strong> ${systemRowInfo.displayBalance.toLocaleString()}</div>
                        <div><strong>Calculation:</strong> ${systemRowInfo.calculationBalance.toLocaleString()}</div>
                        <div>From Row #${systemRowInfo.lastHiddenRowIndex}</div>
                      </div>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
              
              <!-- Totals Row -->
              <tr class="total-row">
                <td colspan="4" class="text-center"><strong>REPORT TOTALS</strong></td>
                <td class="amount-dr"><strong>${totalDebit.toLocaleString()}</strong></td>
                <td class="amount-cr"><strong>${totalCredit.toLocaleString()}</strong></td>
                <td class="amount-dr"><strong>${totalOwnDebit.toLocaleString()}</strong></td>
                <td class="amount-cr"><strong>${totalOwnCredit.toLocaleString()}</strong></td>
                <td class="text-center"><strong>-</strong></td>
                <td class="${finalBalance >= 0 ? 'balance-positive' : 'balance-negative'}">
                  <strong>${finalBalance.toLocaleString()}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `
  }

  // Direct print function - no preview, just print
  const handleDirectPrint = () => {
    const printContent = generatePrintHTML()
    
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      // Wait for content to load then automatically print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close() // Close after printing
        }, 300)
      }
    }
  }

  const handlePreview = () => {
    const printContent = generatePrintHTML()
    
    const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes')
    if (previewWindow) {
      previewWindow.document.write(printContent)
      previewWindow.document.close()
    }
  }

  return (
    <div className="print-report-controls">
      <div className="flex space-x-3">
        <button
          onClick={handlePreview}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview Report
        </button>
        <button
          onClick={handleDirectPrint}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        )}
      </div>
    </div>
  )
}
