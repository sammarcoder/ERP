// import { AdvancedProcessedRecord } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

// interface LedgerByForexTableProps {
//   data: AdvancedProcessedRecord[]
//   systemRowInfo?: {
//     displayBalance: number
//     displayOwnBalance: number
//     calculationBalance: number
//     calculationOwnBalance: number
//     lastHiddenRowIndex: number
//   }
// }

// export default function LedgerByForexTable({ data, systemRowInfo }: LedgerByForexTableProps) {
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Row
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Voucher No
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Description
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Receipt No
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rate
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Credit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Credit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
//                 💰 Balance
//               </th>
//               {/* ✅ NEW: Own Balance Column */}
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">
//                 💱 Own Balance
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {data.map((record, index) => (
//               <tr
//                 key={`${record.id}-${index}`}
//                 className={`hover:bg-gray-50 ${record.isOpening
//                   ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400'
//                   : ''
//                   }`}
//               >
//                 <td className="px-4 py-3 text-sm text-blue-600 font-mono font-bold">
//                   #{record.displayRowIndex || record.rowIndex}
//                   {record.isOpening && (
//                     <div className="text-xs text-orange-600 font-normal"></div>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.voucherNo}
//                 </td>

//                 {/* ✅ FIXED: No date for system row */}
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.isOpening ? (
//                     <span className="text-gray-400 italic">No Date</span>
//                   ) : (
//                     !isNaN(new Date(record.date).getTime())
//                       ? new Date(record.date).toLocaleDateString()
//                       : record.date
//                   )}
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   <div className="flex items-center">
//                     {record.description}
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.isOpening ? '-' : record.receiptNo}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900 flex">
//                   {record.currency} {record.rate}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-red-500 text-right">
//                   {record.ownDb.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-green-500 text-right">
//                   {record.ownCr.toLocaleString()}
//                 </td>

//                 {/* Debit Column with System Row Logic */}
//                 <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
//                     ? (systemRowInfo.calculationBalance < 0
//                       ? Math.abs(systemRowInfo.calculationBalance).toLocaleString()
//                       : '0')
//                     : record.amountDb.toLocaleString()}
//                 </td>

//                 {/* Credit Column with System Row Logic */}
//                 <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
//                     ? (systemRowInfo.calculationBalance > 0
//                       ? systemRowInfo.calculationBalance.toLocaleString()
//                       : '0')
//                     : record.amountCr.toLocaleString()}
//                 </td>

//                 {/* Balance Column */}
//                 <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${record.balance >= 0
//                   ? 'text-green-700 bg-green-50 border-green-200'
//                   : 'text-red-700 bg-red-50 border-red-200'
//                   } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0) ? (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-blue-600 font-medium">
//                         {systemRowInfo.calculationBalance.toLocaleString()}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-blue-600 font-medium">
//                         {record.balance.toLocaleString()}
//                       </div>
//                     </div>
//                   )}
//                 </td>

//                 {/* ✅ NEW: Own Balance Column */}
//                 <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${record.ownBalance >= 0
//                   ? 'text-green-700 bg-green-50 border-green-200'
//                   : 'text-red-700 bg-red-50 border-red-200'
//                   } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0) ? (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-green-600 font-medium">
//                         {systemRowInfo.calculationOwnBalance.toLocaleString()}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-green-600 font-medium">
//                         {record.ownBalance.toLocaleString()}
//                       </div>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {data.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">Select an account to view ledger data</p>
//             <p className="text-gray-400 text-sm mt-2">Account selection is mandatory for this ledger report</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



















































// import { AdvancedProcessedRecord } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

// interface LedgerByForexTableProps {
//   data: AdvancedProcessedRecord[]
//   systemRowInfo?: {
//     displayBalance: number
//     displayOwnBalance: number
//     calculationBalance: number
//     calculationOwnBalance: number
//     lastHiddenRowIndex: number
//   }
// }

// export default function LedgerByForexTable({ data, systemRowInfo }: LedgerByForexTableProps) {
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Row
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Voucher No
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Description
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Receipt No
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rate
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Credit
//               </th>
//               {/* ✅ Moved Own Balance next to Own Credit/Debit */}
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">
//                 💱 Own Balance
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Credit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
//                 💰 Balance
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {data.map((record, index) => (
//               <tr
//                 key={`${record.id}-${index}`}
//                 className={`hover:bg-gray-50 ${record.isOpening
//                   ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400'
//                   : ''
//                   }`}
//               >
//                 <td className="px-4 py-3 text-sm text-blue-600 font-mono font-bold">
//                   #{record.displayRowIndex || record.rowIndex}
//                   {record.isOpening && (
//                     <div className="text-xs text-orange-600 font-normal"></div>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.voucherNo}
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.isOpening ? (
//                     <span className="text-gray-400 italic">No Date</span>
//                   ) : (
//                     !isNaN(new Date(record.date).getTime())
//                       ? new Date(record.date).toLocaleDateString()
//                       : record.date
//                   )}
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   <div className="flex items-center">
//                     {record.description}
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.isOpening ? '-' : record.receiptNo}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900 flex">
//                   {record.currency} {record.rate}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-red-500 text-right">
//                   {record.ownDb.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-green-500 text-right">
//                   {record.ownCr.toLocaleString()}
//                 </td>

//                 {/* ✅ Own Balance Column - Moved next to Own Credit/Debit with same condition */}
//                 <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${record.ownBalance >= 0
//                   ? 'text-green-700 bg-green-50 border-green-200'
//                   : 'text-red-700 bg-red-50 border-red-200'
//                   } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0) ? (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-green-600 font-medium">
//                         {systemRowInfo.calculationOwnBalance.toLocaleString()}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-green-600 font-medium">
//                         {record.ownBalance.toLocaleString()}
//                       </div>
//                     </div>
//                   )}
//                 </td>

//                 {/* Debit Column with System Row Logic */}
//                 <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
//                     ? (systemRowInfo.calculationBalance < 0
//                       ? Math.abs(systemRowInfo.calculationBalance).toLocaleString()
//                       : '0')
//                     : record.amountDb.toLocaleString()}
//                 </td>

//                 {/* Credit Column with System Row Logic */}
//                 <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
//                     ? (systemRowInfo.calculationBalance > 0
//                       ? systemRowInfo.calculationBalance.toLocaleString()
//                       : '0')
//                     : record.amountCr.toLocaleString()}
//                 </td>

//                 {/* Balance Column */}
//                 <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${record.balance >= 0
//                   ? 'text-green-700 bg-green-50 border-green-200'
//                   : 'text-red-700 bg-red-50 border-red-200'
//                   } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  
//                   {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0) ? (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-blue-600 font-medium">
//                         {systemRowInfo.calculationBalance.toLocaleString()}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       <div className="text-blue-600 font-medium">
//                         {record.balance.toLocaleString()}
//                       </div>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {data.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">Select an account to view ledger data</p>
//             <p className="text-gray-400 text-sm mt-2">Account selection is mandatory for this ledger report</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }





















































import { AdvancedProcessedRecord } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

interface LedgerByForexTableProps {
  data: AdvancedProcessedRecord[]
  systemRowInfo?: {
    displayBalance: number
    displayOwnBalance: number
    calculationBalance: number
    calculationOwnBalance: number
    lastHiddenRowIndex: number
  }
}

export default function LedgerByForexTable({ data, systemRowInfo }: LedgerByForexTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Row
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voucher No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receipt No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Own Debit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Own Credit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">
                💱 Own Balance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                💰 Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record, index) => (
              <tr
                key={`${record.id}-${index}`}
                className={`hover:bg-gray-50 ${record.isOpening
                  ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400'
                  : ''
                  }`}
              >
                <td className="px-4 py-3 text-sm text-blue-600 font-mono font-bold">
                  #{record.displayRowIndex || record.rowIndex}
                  {record.isOpening && (
                    <div className="text-xs text-orange-600 font-normal"></div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.voucherNo}
                </td>

                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.isOpening ? (
                    <span className="text-gray-400 italic">No Date</span>
                  ) : (
                    !isNaN(new Date(record.date).getTime())
                      ? new Date(record.date).toLocaleDateString()
                      : record.date
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="flex items-center">
                    {record.description}
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.isOpening ? '-' : record.receiptNo}
                </td>

                <td className="px-4 py-3 text-sm text-gray-900 flex">
                  {record.currency && record.currency !== 'PKR' ? (
                    <span>{record.currency} {record.rate}</span>
                  ) : (
                    <span>{record.rate}</span>
                  )}
                </td>

                {/* ✅ Own Debit Column with System Row Logic */}
                <td className="px-4 py-3 text-sm font-medium text-red-500 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
                    ? (systemRowInfo.calculationOwnBalance < 0
                      ? Math.abs(systemRowInfo.calculationOwnBalance).toLocaleString()
                      : '0')
                    : record.ownDb.toLocaleString()}
                </td>

                {/* ✅ Own Credit Column with System Row Logic */}
                <td className="px-4 py-3 text-sm font-medium text-green-500 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
                    ? (systemRowInfo.calculationOwnBalance > 0
                      ? systemRowInfo.calculationOwnBalance.toLocaleString()
                      : '0')
                    : record.ownCr.toLocaleString()}
                </td>

                {/* Own Balance Column */}
                <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${record.ownBalance >= 0
                  ? 'text-green-700 bg-green-50 border-green-200'
                  : 'text-red-700 bg-red-50 border-red-200'
                  } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0) ? (
                    systemRowInfo.calculationOwnBalance.toLocaleString()
                  ) : (
                    record.ownBalance.toLocaleString()
                  )}
                </td>

                {/* Debit Column with System Row Logic */}
                <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
                    ? (systemRowInfo.calculationBalance < 0
                      ? Math.abs(systemRowInfo.calculationBalance).toLocaleString()
                      : '0')
                    : record.amountDb.toLocaleString()}
                </td>

                {/* Credit Column with System Row Logic */}
                <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
                    ? (systemRowInfo.calculationBalance > 0
                      ? systemRowInfo.calculationBalance.toLocaleString()
                      : '0')
                    : record.amountCr.toLocaleString()}
                </td>

                {/* Balance Column */}
                <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${record.balance >= 0
                  ? 'text-green-700 bg-green-50 border-green-200'
                  : 'text-red-700 bg-red-50 border-red-200'
                  } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0) ? (
                    systemRowInfo.calculationBalance.toLocaleString()
                  ) : (
                    record.balance.toLocaleString()
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Select an account to view ledger data</p>
            <p className="text-gray-400 text-sm mt-2">Account selection is mandatory for this ledger report</p>
          </div>
        )}
      </div>
    </div>
  )
}
