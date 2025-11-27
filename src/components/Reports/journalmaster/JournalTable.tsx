// import { ProcessedRecord } from '@/types/reports/journalmaster/JournalTypes'

// interface JournalTableProps {
//   data: ProcessedRecord[]
// }

// export default function JournalTable({ data }: JournalTableProps) {
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Filtered Row
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
//                 Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Credit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Credit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rate
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Receipt No
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
//                 💰 Running Balance
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {data.map((record, index) => (
//               <tr 
//                 key={`${record.id}-${index}`} 
//                 className={`hover:bg-gray-50 ${record.isOpening ? 'bg-orange-50' : ''}`}
//               >
//                 <td className="px-4 py-3 text-sm text-blue-600 font-mono font-bold">
//                   #{record.rowIndex}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.voucherNo}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {!isNaN(new Date(record.date).getTime()) 
//                     ? new Date(record.date).toLocaleDateString() 
//                     : record.date}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.description}
//                   {record.isOpening && <span className="ml-2 text-orange-500">🔶</span>}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
//                   {record.amountDb.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
//                   {record.amountCr.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-red-500 text-right">
//                   {record.ownDb.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-green-500 text-right">
//                   {record.ownCr.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900 text-center">
//                   {Number(record.rate).toFixed(2)}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.receiptNo}
//                 </td>
//                 <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${
//                   record.balance >= 0 
//                     ? 'text-green-700 bg-green-50 border-green-200' 
//                     : 'text-red-700 bg-red-50 border-red-200'
//                 }`}>
//                   {record.balance.toLocaleString()}
//                   <div className="text-xs text-gray-400 mt-1">
//                     {record.amountCr} - {record.amountDb}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {data.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No records found matching your filters</p>
//             <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }






















































// import { ProcessedRecord } from '@/types/reports/journalmaster/JournalTypes'

// interface JournalTableProps {
//   data: ProcessedRecord[]
// }

// export default function JournalTable({ data }: JournalTableProps) {
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Filtered Row
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
//                 Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Credit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Debit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Credit
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rate
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Receipt No
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
//                 💰 Running Balance
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {data.map((record, index) => (
//               <tr 
//                 key={`${record.id}-${index}`} 
//                 className={`hover:bg-gray-50 ${
//                   record.isOpening 
//                     ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400' 
//                     : ''
//                 }`}
//               >
//                 <td className="px-4 py-3 text-sm text-blue-600 font-mono font-bold">
//                   #{record.rowIndex}
//                   {record.isOpening && (
//                     <div className="text-xs text-orange-600 font-normal">Opening</div>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.voucherNo}
//                   {record.isOpening && (
//                     <div className="text-xs text-orange-600">(Combined)</div>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {!isNaN(new Date(record.date).getTime()) 
//                     ? new Date(record.date).toLocaleDateString() 
//                     : record.date}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   <div className="flex items-center">
//                     {record.isOpening && (
//                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
//                         🔶 Opening Balance
//                       </span>
//                     )}
//                     {record.description}
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
//                   {record.amountDb.toLocaleString()}
//                   {record.isOpening && (
//                     <div className="text-xs text-orange-600">(Combined)</div>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
//                   {record.amountCr.toLocaleString()}
//                   {record.isOpening && (
//                     <div className="text-xs text-orange-600">(Combined)</div>
//                   )}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-red-500 text-right">
//                   {record.ownDb.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm font-medium text-green-500 text-right">
//                   {record.ownCr.toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900 text-center">
//                   {record.isOpening ? '-' : Number(record.rate).toFixed(2)}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.isOpening ? '-' : record.receiptNo}
//                 </td>
//                 <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${
//                   record.balance >= 0 
//                     ? 'text-green-700 bg-green-50 border-green-200' 
//                     : 'text-red-700 bg-red-50 border-red-200'
//                 } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
//                   {record.balance.toLocaleString()}
//                   <div className="text-xs text-gray-400 mt-1">
//                     {record.amountCr} - {record.amountDb}
//                     {record.isOpening && <span className="text-orange-500"> (Opening)</span>}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {data.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No records found matching your filters</p>
//             <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }





























import { ProcessedRecord } from '@/types/reports/journalmaster/JournalTypes'

interface JournalTableProps {
  data: ProcessedRecord[]
  systemRowInfo?: {
    displayBalance: number
    calculationBalance: number
    aboveRowBalance: number
    lastHiddenRowIndex: number
  }
}

export default function JournalTable({ data, systemRowInfo }: JournalTableProps) {
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

                  {/* {record.isOpening && (
                    <div className="text-xs text-orange-600">Always Shows</div>
                  )} */}
                </td>

                {/* ✅ FIXED: No date for system row */}
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
                <td className="px-4 py-3 text-sm text-gray-900  flex ">
                  {record.currency} {record.rate}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-red-500 text-right">
                  {record.ownDb.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-500 text-right">
                  {record.ownCr.toLocaleString()}
                </td>

                {/* <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0 && systemRowInfo.calculationBalance < 0) ?
                    (systemRowInfo.calculationBalance.toLocaleString()) :
                    (record.amountDb.toLocaleString())}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0 && systemRowInfo.calculationBalance > 0) ?
                    (systemRowInfo.calculationBalance.toLocaleString()) :
                      (record.amountCr.toLocaleString())}
                </td> */}
                <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
                    ? (systemRowInfo.calculationBalance < 0
                      ? Math.abs(systemRowInfo.calculationBalance).toLocaleString()
                      : '0')
                    : record.amountDb.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0)
                    ? (systemRowInfo.calculationBalance > 0
                      ? systemRowInfo.calculationBalance.toLocaleString()
                      : '0')
                    : record.amountCr.toLocaleString()}
                </td>


                <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${record.balance >= 0
                  ? 'text-green-700 bg-green-50 border-green-200'
                  : 'text-red-700 bg-red-50 border-red-200'
                  } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  {/* {record.balance.toLocaleString()} */}


                  {/* The main conditional block using the ternary operator */}
                  {(record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0) ? (

                    // IF the condition is TRUE, render this block (the 'then' part)
                    <div className="text-xs mt-1 space-y-1 pt-1">
                      <div className="text-blue-600 font-medium">
                        {/* This is the first value you wanted */}
                        {systemRowInfo.calculationBalance.toLocaleString()}
                      </div>
                    </div>

                  ) : (

                    // ELSE the condition is FALSE, render this block (the 'else' part)
                    <div className="text-xs mt-1 space-y-1 pt-1">
                      <div className="text-blue-600 font-medium">
                        {/* This is the second value you wanted */}
                        {record.balance.toLocaleString()}
                      </div>
                    </div>

                  )}


                  {/* {!record.isOpening && (
                    <div className="text-xs text-gray-400 mt-1">
                      {record.amountCr} - {record.amountDb}
                    </div>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}












//  {record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0 && (
//                     <div className="text-xs mt-1 space-y-1 pt-1">
//                       {/* <div className="text-orange-600 font-medium">
//                         📊 Opening: {systemRowInfo.displayBalance.toLocaleString()}
//                       </div> */}
//                       <div className="text-blue-600 font-medium">
//                         {systemRowInfo.calculationBalance.toLocaleString()}
//                         {/* 🧮 Calculation: {systemRowInfo.calculationBalance.toLocaleString()} */}
//                       </div>
//                       {/* <div className="text-gray-500 text-xs">
//                         (From hidden row #{systemRowInfo.lastHiddenRowIndex})
//                       </div> */}
//                     </div>
//                   )}