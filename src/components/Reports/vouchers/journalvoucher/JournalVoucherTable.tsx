// import { JournalVoucherRecord, JournalVoucherHeader, BalanceRow } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

// interface JournalVoucherTableProps {
//   records: JournalVoucherRecord[]
//   header: JournalVoucherHeader | null
//   balanceRows: BalanceRow[]
// }

// export default function JournalVoucherTable({ records, header, balanceRows }: JournalVoucherTableProps) {
//   if (!header) {
//     return (
//       <div className="bg-white rounded-lg shadow p-8 text-center">
//         <p className="text-gray-500 text-lg">Please select both Voucher Type and Voucher Number to view voucher details</p>
//         <p className="text-gray-400 text-sm mt-2">Both filters are mandatory and must be applied in order</p>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       {/* Voucher Header */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">
//               {header.voucherTypeName} - {header.voucherNo}
//             </h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Date: {new Date(header.date).toLocaleDateString()} | 
//               Total Debit: {header.totalDebit.toLocaleString()} | 
//               Total Credit: {header.totalCredit.toLocaleString()}
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-sm text-gray-500">Own Currency</div>
//             <div className="font-medium">
//               Dr: {header.totalOwnDebit.toLocaleString()} | 
//               Cr: {header.totalOwnCredit.toLocaleString()}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Voucher Details Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Account Name
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Description
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Receipt No
//               </th>
//               <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Debit
//               </th>
//               <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Own Credit
//               </th>
//               <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rate
//               </th>
//               <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Debit
//               </th>
//               <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Credit
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {records.map((record, index) => (
//               <tr key={record.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                 <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                   {record.acName}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.description}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-900">
//                   {record.receiptNo || '-'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-red-600 text-right font-medium">
//                   {record.ownDebit > 0 ? record.ownDebit.toLocaleString() : '-'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
//                   {record.ownCredit > 0 ? record.ownCredit.toLocaleString() : '-'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-center text-gray-900">
//                   <div className="flex flex-col">
//                     <span className="text-xs text-gray-500">{record.currencyName}</span>
//                     <span className="font-medium">{record.rate.toFixed(2)}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 text-sm text-red-600 text-right font-medium">
//                   {record.debit > 0 ? record.debit.toLocaleString() : '-'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
//                   {record.credit > 0 ? record.credit.toLocaleString() : '-'}
//                 </td>
//               </tr>
//             ))}
            
//             {/* Balance Rows */}
//             {balanceRows.map((balanceRow, index) => (
//               <tr key={`balance-${index}`} className={`${
//                 balanceRow.type === 'opening' 
//                   ? 'bg-blue-50 border-t-2 border-blue-200' 
//                   : 'bg-green-50 border-t-2 border-green-200'
//               }`}>
//                 <td className="px-4 py-3 text-sm font-bold text-gray-900">
//                   {balanceRow.description}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-500">
//                   {balanceRow.type === 'opening' ? 'Balance B/F' : 'Balance C/F'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-500">-</td>
//                 <td className="px-4 py-3 text-sm text-red-600 text-right font-bold">
//                   {balanceRow.ownDebit > 0 ? balanceRow.ownDebit.toLocaleString() : '-'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-green-600 text-right font-bold">
//                   {balanceRow.ownCredit > 0 ? balanceRow.ownCredit.toLocaleString() : '-'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-center text-gray-500">-</td>
//                 <td className="px-4 py-3 text-sm text-red-600 text-right font-bold">
//                   {balanceRow.debit > 0 ? balanceRow.debit.toLocaleString() : '-'}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-green-600 text-right font-bold">
//                   {balanceRow.credit > 0 ? balanceRow.credit.toLocaleString() : '-'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }


















































import { JournalVoucherRecord, JournalVoucherHeader, BalanceRow } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

interface JournalVoucherTableProps {
  records: JournalVoucherRecord[]
  header: JournalVoucherHeader | null
  balanceRows: BalanceRow[]
}

export default function JournalVoucherTable({ records, header, balanceRows }: JournalVoucherTableProps) {
  if (!header) {
    return (
      <div className="bg-white rounded shadow p-4 text-center">
        <p className="text-gray-500 text-sm">Select voucher type and number</p>
      </div>
    )
  }

  const openingRow = balanceRows.find(row => row.type === 'opening')
  const closingRow = balanceRows.find(row => row.type === 'closing')

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {/* Minimal Header */}
      <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium">{header.voucherTypeName} - {header.voucherNo}</h3>
          <p className="text-xs text-gray-500">Date: {new Date(header.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right text-xs">
          <div>Dr: {header.totalDebit.toLocaleString()} | Cr: {header.totalCredit.toLocaleString()}</div>
        </div>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-left font-medium text-gray-600">Account</th>
              <th className="px-2 py-1 text-left font-medium text-gray-600">Description</th>
              <th className="px-2 py-1 text-left font-medium text-gray-600">Receipt</th>
              <th className="px-2 py-1 text-right font-medium text-gray-600">Own Dr</th>
              <th className="px-2 py-1 text-right font-medium text-gray-600">Own Cr</th>
              <th className="px-2 py-1 text-center font-medium text-gray-600">Rate</th>
              <th className="px-2 py-1 text-right font-medium text-gray-600">Debit</th>
              <th className="px-2 py-1 text-right font-medium text-gray-600">Credit</th>
            </tr>
          </thead>
          <tbody>
            {/* Opening Balance Row - At Top */}
            {openingRow && (
              <tr className="bg-blue-50 font-medium border-t-2 border-blue-300">
                <td className="px-2 py-1 font-semibold">{openingRow.description}</td>
                <td className="px-2 py-1 text-gray-600">B/F</td>
                <td className="px-2 py-1 text-center">-</td>
                <td className="px-2 py-1 text-right text-red-600">
                  {openingRow.ownDebit > 0 ? openingRow.ownDebit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-right text-green-600">
                  {openingRow.ownCredit > 0 ? openingRow.ownCredit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-center">-</td>
                <td className="px-2 py-1 text-right text-red-600">
                  {openingRow.debit > 0 ? openingRow.debit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-right text-green-600">
                  {openingRow.credit > 0 ? openingRow.credit.toLocaleString() : '-'}
                </td>
              </tr>
            )}

            {/* Data Rows - In Center */}
            {records.map((record, index) => (
              <tr key={record.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                <td className="px-2 py-1 font-medium">{record.acName}</td>
                <td className="px-2 py-1">{record.description}</td>
                <td className="px-2 py-1">{record.receiptNo || '-'}</td>
                <td className="px-2 py-1 text-right text-red-600">
                  {record.ownDebit > 0 ? record.ownDebit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-right text-green-600">
                  {record.ownCredit > 0 ? record.ownCredit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-center">
                  {/* Only show currency and rate if currency exists and is not default */}
                  {record.currencyName && record.currencyName !== 'PKR' ? (
                    <div>{record.currencyName} {record.rate.toFixed(2)}</div>
                  ) : record.rate !== 1 ? (
                    <div>{record.rate.toFixed(2)}</div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-2 py-1 text-right text-red-600">
                  {record.debit > 0 ? record.debit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-right text-green-600">
                  {record.credit > 0 ? record.credit.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
            
            {/* Closing Balance Row - At Bottom */}
            {closingRow && (
              <tr className="bg-green-50 font-medium border-t-2 border-green-300">
                <td className="px-2 py-1 font-semibold">{closingRow.description}</td>
                <td className="px-2 py-1 text-gray-600">C/F</td>
                <td className="px-2 py-1 text-center">-</td>
                <td className="px-2 py-1 text-right text-red-600">
                  {closingRow.ownDebit > 0 ? closingRow.ownDebit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-right text-green-600">
                  {closingRow.ownCredit > 0 ? closingRow.ownCredit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-center">-</td>
                <td className="px-2 py-1 text-right text-red-600">
                  {closingRow.debit > 0 ? closingRow.debit.toLocaleString() : '-'}
                </td>
                <td className="px-2 py-1 text-right text-green-600">
                  {closingRow.credit > 0 ? closingRow.credit.toLocaleString() : '-'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
