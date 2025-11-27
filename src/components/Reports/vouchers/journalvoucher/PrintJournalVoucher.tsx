// import { JournalVoucherRecord, JournalVoucherHeader, BalanceRow } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

// interface PrintJournalVoucherProps {
//   records: JournalVoucherRecord[]
//   header: JournalVoucherHeader | null
//   balanceRows: BalanceRow[]
//   onClose?: () => void
// }

// export default function PrintJournalVoucher({ 
//   records, 
//   header, 
//   balanceRows,
//   onClose 
// }: PrintJournalVoucherProps) {
  
//   const generatePrintHTML = () => {
//     if (!header) return ''

//     const openingRow = balanceRows.find(row => row.type === 'opening')
//     const closingRow = balanceRows.find(row => row.type === 'closing')

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Journal Voucher - ${header.voucherNo}</title>
//         <meta charset="utf-8">
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           body { 
//             font-family: 'Arial', sans-serif; 
//             font-size: 12px;
//             line-height: 1.3;
//             color: #000;
//             background: #fff;
//             margin: 0;
//             padding: 15px;
//           }
          
//           .voucher-container {
//             max-width: 100%;
//             margin: 0 auto;
//             background: #fff;
//           }
          
//           .voucher-header {
//             text-align: center;
//             padding: 15px 0;
//             border-bottom: 2px solid #000;
//             margin-bottom: 15px;
//           }
          
//           .voucher-title {
//             font-size: 18px;
//             font-weight: bold;
//             margin-bottom: 5px;
//           }
          
//           .voucher-info {
//             font-size: 12px;
//             margin: 3px 0;
//           }
          
//           .voucher-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 10px 0;
//             font-size: 10px;
//             border: 2px solid #000;
//           }
          
//           .voucher-table thead {
//             background: #000;
//             color: #fff;
//           }
          
//           .voucher-table th {
//             padding: 8px 4px;
//             text-align: center;
//             font-weight: bold;
//             font-size: 9px;
//             border: 1px solid #000;
//           }
          
//           .voucher-table td {
//             padding: 4px;
//             border: 1px solid #000;
//             vertical-align: middle;
//           }
          
//           .opening-row {
//             background: #f5f5f5 !important;
//             font-weight: bold;
//             border-top: 2px solid #000;
//           }
          
//           .closing-row {
//             background: #e8e8e8 !important;
//             font-weight: bold;
//             border-top: 2px solid #000;
//           }
          
//           .text-center { text-align: center; }
//           .text-right { text-align: right; }
//           .text-left { text-align: left; }
//           .font-bold { font-weight: bold; }
          
//           .footer-section {
//             margin-top: 20px;
//             text-align: center;
//             font-size: 10px;
//             border-top: 1px solid #000;
//             padding-top: 10px;
//           }
          
//           @media print {
//             body { margin: 0; padding: 10px; font-size: 10px; }
//             .voucher-table { font-size: 9px; }
//             .voucher-table th { font-size: 8px; padding: 3px; }
//             .voucher-table td { padding: 2px; }
//           }
          
//           @page {
//             margin: 0.5in;
//             size: A4 portrait;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="voucher-container">
          
//           <!-- Voucher Header -->
//           <div class="voucher-header">
//             <div class="voucher-title">Your Company Name</div>
//             <div class="voucher-info">${header.voucherTypeName}</div>
//             <div class="voucher-info">Voucher No: <strong>${header.voucherNo}</strong> | Date: <strong>${new Date(header.date).toLocaleDateString()}</strong></div>
//           </div>

//           <!-- Voucher Table -->
//           <table class="voucher-table">
//             <thead>
//               <tr>
//                 <th style="width: 20%">Account</th>
//                 <th style="width: 25%">Description</th>
//                 <th style="width: 10%">Receipt</th>
//                 <th style="width: 10%">Own Dr</th>
//                 <th style="width: 10%">Own Cr</th>
//                 <th style="width: 8%">Rate</th>
//                 <th style="width: 8.5%">Debit</th>
//                 <th style="width: 8.5%">Credit</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${openingRow ? `
//               <tr class="opening-row">
//                 <td class="font-bold">${openingRow.description}</td>
//                 <td class="text-center">B/F</td>
//                 <td class="text-center">-</td>
//                 <td class="text-right">${openingRow.ownDebit > 0 ? openingRow.ownDebit.toLocaleString() : '-'}</td>
//                 <td class="text-right">${openingRow.ownCredit > 0 ? openingRow.ownCredit.toLocaleString() : '-'}</td>
//                 <td class="text-center">-</td>
//                 <td class="text-right">${openingRow.debit > 0 ? openingRow.debit.toLocaleString() : '-'}</td>
//                 <td class="text-right">${openingRow.credit > 0 ? openingRow.credit.toLocaleString() : '-'}</td>
//               </tr>
//               ` : ''}
              
//               ${records.map(record => `
//                 <tr>
//                   <td class="font-bold">${record.acName}</td>
//                   <td>${record.description}</td>
//                   <td class="text-center">${record.receiptNo || '-'}</td>
//                   <td class="text-right">${record.ownDebit > 0 ? record.ownDebit.toLocaleString() : '-'}</td>
//                   <td class="text-right">${record.ownCredit > 0 ? record.ownCredit.toLocaleString() : '-'}</td>
//                   <td class="text-center">${
//                     record.currencyName && record.currencyName !== 'PKR' ? 
//                       `${record.currencyName} ${record.rate.toFixed(2)}` : 
//                       record.rate !== 1 ? record.rate.toFixed(2) : '-'
//                   }</td>
//                   <td class="text-right">${record.debit > 0 ? record.debit.toLocaleString() : '-'}</td>
//                   <td class="text-right">${record.credit > 0 ? record.credit.toLocaleString() : '-'}</td>
//                 </tr>
//               `).join('')}
              
//               ${closingRow ? `
//               <tr class="closing-row">
//                 <td class="font-bold">${closingRow.description}</td>
//                 <td class="text-center">C/F</td>
//                 <td class="text-center">-</td>
//                 <td class="text-right">${closingRow.ownDebit > 0 ? closingRow.ownDebit.toLocaleString() : '-'}</td>
//                 <td class="text-right">${closingRow.ownCredit > 0 ? closingRow.ownCredit.toLocaleString() : '-'}</td>
//                 <td class="text-center">-</td>
//                 <td class="text-right">${closingRow.debit > 0 ? closingRow.debit.toLocaleString() : '-'}</td>
//                 <td class="text-right">${closingRow.credit > 0 ? closingRow.credit.toLocaleString() : '-'}</td>
//               </tr>
//               ` : ''}
//             </tbody>
//           </table>

//           <!-- Footer -->
//           <div class="footer-section">
//             <div>
//               <strong>Total: Dr ${header.totalDebit.toLocaleString()} | Cr ${header.totalCredit.toLocaleString()}</strong>
//             </div>
//             <div>
//               Status: <strong>${header.totalDebit === header.totalCredit ? 'Balanced ✓' : 'Unbalanced ✗'}</strong>
//             </div>
//             <div style="margin-top: 8px; font-size: 9px;">
//               Generated by ERP System | ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   }

//   // Print function
//   const handleDirectPrint = () => {
//     const printContent = generatePrintHTML()
    
//     const printWindow = window.open('', '_blank', 'width=800,height=600')
//     if (printWindow) {
//       printWindow.document.write(printContent)
//       printWindow.document.close()
      
//       printWindow.onload = () => {
//         setTimeout(() => {
//           printWindow.print()
//           printWindow.close()
//         }, 300)
//       }
//     }
//   }

//   const handlePreview = () => {
//     const printContent = generatePrintHTML()
    
//     const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes')
//     if (previewWindow) {
//       previewWindow.document.write(printContent)
//       previewWindow.document.close()
//     }
//   }

//   // ✅ Return JSX instead of object
//   return (
//     <div className="print-controls">
//       <div className="flex space-x-2">
//         <button
//           onClick={handlePreview}
//           className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
//         >
//           Preview
//         </button>
//         <button
//           onClick={handleDirectPrint}
//           className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
//         >
//           Print
//         </button>
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
//           >
//             Close
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }


















































import { JournalVoucherRecord, JournalVoucherHeader, BalanceRow } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

interface PrintJournalVoucherProps {
  records: JournalVoucherRecord[]
  header: JournalVoucherHeader | null
  balanceRows: BalanceRow[]
  onClose?: () => void
}

export default function PrintJournalVoucher({ 
  records, 
  header, 
  balanceRows,
  onClose 
}: PrintJournalVoucherProps) {
  
  const generatePrintHTML = () => {
    if (!header) return ''

    const openingRow = balanceRows.find(row => row.type === 'opening')
    const closingRow = balanceRows.find(row => row.type === 'closing')

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Journal Voucher - ${header.voucherNo}</title>
        <meta charset="utf-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Arial', sans-serif; 
            font-size: 16px;
            line-height: 1.4;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 20px;
          }
          
          .voucher-container {
            max-width: 100%;
            margin: 0 auto;
            background: #fff;
          }
          
          .voucher-header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
          }
          
          .voucher-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .voucher-info {
            font-size: 16px;
            margin: 5px 0;
          }
          
          .voucher-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
            border: 2px solid #000;
          }
          
          .voucher-table thead {
            background: #000;
            color: #fff;
          }
          
          .voucher-table th {
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            border: 1px solid #000;
          }
          
          .voucher-table td {
            padding: 8px;
            border: 1px solid #000;
            vertical-align: middle;
          }
          
          .opening-row {
            background: #f5f5f5 !important;
            font-weight: bold;
            border-top: 2px solid #000;
          }
          
          .closing-row {
            background: #e8e8e8 !important;
            font-weight: bold;
            border-top: 2px solid #000;
          }
          
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .font-bold { font-weight: bold; }
          
          .footer-section {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            border-top: 1px solid #000;
            padding-top: 15px;
          }
          
          @media print {
            body { 
              margin: 0; 
              padding: 15px; 
              font-size: 14px; 
            }
            .voucher-table { 
              font-size: 12px; 
            }
            .voucher-table th { 
              font-size: 12px; 
              padding: 8px 6px; 
            }
            .voucher-table td { 
              padding: 6px; 
            }
            .voucher-title {
              font-size: 20px;
            }
            .voucher-info {
              font-size: 14px;
            }
            .footer-section {
              font-size: 12px;
            }
          }
          
          @page {
            margin: 0.5in;
            size: A4 portrait;
          }
        </style>
      </head>
      <body>
        <div class="voucher-container">
          
          <!-- Voucher Header -->
          <div class="voucher-header">
            <div class="voucher-title">Your Company Name</div>
            <div class="voucher-info">${header.voucherTypeName}</div>
            <div class="voucher-info">Voucher No: <strong>${header.voucherNo}</strong> | Date: <strong>${new Date(header.date).toLocaleDateString()}</strong></div>
          </div>

          <!-- Voucher Table -->
          <table class="voucher-table">
            <thead>
              <tr>
                <th style="width: 20%">Account</th>
                <th style="width: 25%">Description</th>
                <th style="width: 10%">Receipt</th>
                <th style="width: 10%">Own Dr</th>
                <th style="width: 10%">Own Cr</th>
                <th style="width: 8%">Rate</th>
                <th style="width: 8.5%">Debit</th>
                <th style="width: 8.5%">Credit</th>
              </tr>
            </thead>
            <tbody>
              ${openingRow ? `
              <tr class="opening-row">
                <td class="font-bold">${openingRow.description}</td>
                <td class="text-center">B/F</td>
                <td class="text-center">-</td>
                <td class="text-right">${openingRow.ownDebit > 0 ? openingRow.ownDebit.toLocaleString() : '-'}</td>
                <td class="text-right">${openingRow.ownCredit > 0 ? openingRow.ownCredit.toLocaleString() : '-'}</td>
                <td class="text-center">-</td>
                <td class="text-right">${openingRow.debit > 0 ? openingRow.debit.toLocaleString() : '-'}</td>
                <td class="text-right">${openingRow.credit > 0 ? openingRow.credit.toLocaleString() : '-'}</td>
              </tr>
              ` : ''}
              
              ${records.map(record => `
                <tr>
                  <td class="font-bold">${record.acName}</td>
                  <td>${record.description}</td>
                  <td class="text-center">${record.receiptNo || '-'}</td>
                  <td class="text-right">${record.ownDebit > 0 ? record.ownDebit.toLocaleString() : '-'}</td>
                  <td class="text-right">${record.ownCredit > 0 ? record.ownCredit.toLocaleString() : '-'}</td>
                  <td class="text-center">${
                    record.currencyName && record.currencyName !== 'PKR' ? 
                      `${record.currencyName} ${record.rate.toFixed(2)}` : 
                      record.rate !== 1 ? record.rate.toFixed(2) : '-'
                  }</td>
                  <td class="text-right">${record.debit > 0 ? record.debit.toLocaleString() : '-'}</td>
                  <td class="text-right">${record.credit > 0 ? record.credit.toLocaleString() : '-'}</td>
                </tr>
              `).join('')}
              
              ${closingRow ? `
              <tr class="closing-row">
                <td class="font-bold">${closingRow.description}</td>
                <td class="text-center">C/F</td>
                <td class="text-center">-</td>
                <td class="text-right">${closingRow.ownDebit > 0 ? closingRow.ownDebit.toLocaleString() : '-'}</td>
                <td class="text-right">${closingRow.ownCredit > 0 ? closingRow.ownCredit.toLocaleString() : '-'}</td>
                <td class="text-center">-</td>
                <td class="text-right">${closingRow.debit > 0 ? closingRow.debit.toLocaleString() : '-'}</td>
                <td class="text-right">${closingRow.credit > 0 ? closingRow.credit.toLocaleString() : '-'}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>

          <!-- Footer -->
          <div class="footer-section">
            <div>
              <strong>Total: Dr ${header.totalDebit.toLocaleString()} | Cr ${header.totalCredit.toLocaleString()}</strong>
            </div>
            <div>
              Status: <strong>${header.totalDebit === header.totalCredit ? 'Balanced ✓' : 'Unbalanced ✗'}</strong>
            </div>
            <div style="margin-top: 10px; font-size: 12px;">
              Generated by ERP System | ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const handleDirectPrint = () => {
    const printContent = generatePrintHTML()
    
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 300)
      }
    }
  }

  const handlePreview = () => {
    const printContent = generatePrintHTML()
    
    const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes')
    if (previewWindow) {
      previewWindow.document.write(printContent)
      previewWindow.document.close()
    }
  }

  return (
    <div className="print-controls">
      <div className="flex space-x-2">
        <button
          onClick={handlePreview}
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          Preview
        </button>
        <button
          onClick={handleDirectPrint}
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
        >
          Print
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
          >
            Close
          </button>
        )}
      </div>
    </div>
  )
}
