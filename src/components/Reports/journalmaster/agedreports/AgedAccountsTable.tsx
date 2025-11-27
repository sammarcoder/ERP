import { AgedAccountsResult } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

interface AgedAccountsTableProps {
  result: AgedAccountsResult
}

export default function AgedAccountsTable({ result }: AgedAccountsTableProps) {
  const { accounts, grandTotals, filterParams } = result
  
  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No accounts found matching filter: "{filterParams.accountPrefix}"</p>
      </div>
    )
  }
  
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       {/* Header */}
//       <div className="bg-gray-50 px-6 py-4 border-b">
//         <h3 className="text-lg font-medium">Aged Accounts Receivable Report</h3>
//         <p className="text-sm text-gray-600 mt-1">
//           Filter: "{filterParams.accountPrefix}" | As of: {new Date(filterParams.asOfDate).toLocaleDateString()} | 
//           Phase Length: {filterParams.phaseDays} days
//         </p>
//       </div>
      
//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Account Name
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Debit
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Credit
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Net Balance
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-red-600 uppercase tracking-wider bg-red-50">
//                 Phase 1 (Oldest)
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-orange-600 uppercase tracking-wider bg-orange-50">
//                 Phase 2 (Middle)
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
//                 Phase 3 (Newest)
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
//                 Advance
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {accounts.map((account) => (
//               <tr key={account.accountId} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                   {account.accountName}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900 text-right">
//                   ${account.totalDebits.toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900 text-right">
//                   ${account.totalCredits.toLocaleString()}
//                 </td>
//                 <td className={`px-6 py-4 text-sm text-right font-medium ${
//                   account.netBalance >= 0 ? 'text-red-600' : 'text-green-600'
//                 }`}>
//                   ${Math.abs(account.netBalance).toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-red-700 text-right font-medium bg-red-50">
//                   ${account.outstanding.phase1.toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-orange-700 text-right font-medium bg-orange-50">
//                   ${account.outstanding.phase2.toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-green-700 text-right font-medium bg-green-50">
//                   ${account.outstanding.phase3.toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-blue-700 text-right font-medium">
//                   ${account.advance.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
          
//           {/* Grand Totals */}
//           <tfoot className="bg-gray-100">
//             <tr className="font-bold">
//               <td className="px-6 py-4 text-sm text-gray-900">
//                 GRAND TOTAL ({accounts.length} accounts)
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-900 text-right">
//                 ${grandTotals.totalDebits.toLocaleString()}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-900 text-right">
//                 ${grandTotals.totalCredits.toLocaleString()}
//               </td>
//               <td className={`px-6 py-4 text-sm text-right ${
//                 grandTotals.netBalance >= 0 ? 'text-red-600' : 'text-green-600'
//               }`}>
//                 ${Math.abs(grandTotals.netBalance).toLocaleString()}
//               </td>
//               <td className="px-6 py-4 text-sm text-red-800 text-right bg-red-100">
//                 ${grandTotals.outstanding.phase1.toLocaleString()}
//               </td>
//               <td className="px-6 py-4 text-sm text-orange-800 text-right bg-orange-100">
//                 ${grandTotals.outstanding.phase2.toLocaleString()}
//               </td>
//               <td className="px-6 py-4 text-sm text-green-800 text-right bg-green-100">
//                 ${grandTotals.outstanding.phase3.toLocaleString()}
//               </td>
//               <td className="px-6 py-4 text-sm text-blue-800 text-right">
//                 ${grandTotals.totalAdvance.toLocaleString()}
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
      
//       {/* Collection Priority Summary */}
//       <div className="bg-gray-50 px-6 py-4 border-t">
//         <h4 className="font-medium text-gray-800 mb-2">Collection Priority:</h4>
//         <div className="grid grid-cols-3 gap-4 text-sm">
//           <div className="bg-red-100 p-2 rounded">
//             <strong className="text-red-800">Phase 1 (Most Urgent):</strong>
//             <div className="text-red-700">${grandTotals.outstanding.phase1.toLocaleString()}</div>
//           </div>
//           <div className="bg-orange-100 p-2 rounded">
//             <strong className="text-orange-800">Phase 2 (Monitor):</strong>
//             <div className="text-orange-700">${grandTotals.outstanding.phase2.toLocaleString()}</div>
//           </div>
//           <div className="bg-green-100 p-2 rounded">
//             <strong className="text-green-800">Phase 3 (Recent):</strong>
//             <div className="text-green-700">${grandTotals.outstanding.phase3.toLocaleString()}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h3 className="text-lg font-medium">Aged Accounts Receivable Report</h3>
        <p className="text-sm text-gray-600 mt-1">
          Filter: "{filterParams.accountPrefix}" | As of: {new Date(filterParams.asOfDate).toLocaleDateString()} | 
          Phase Length: {filterParams.phaseDays} days
        </p>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Debit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Credit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Balance
              </th>
              
              {/* ✅ Phase 1 - Original Debits & Outstanding */}
              <th className="px-6 py-3 text-center text-xs font-medium text-red-600 uppercase tracking-wider bg-red-50" colSpan={2}>
                Phase 1 (Oldest - {filterParams.phaseDays * 2 + 1}+ days)
              </th>
              
              {/* ✅ Phase 2 - Original Debits & Outstanding */}
              <th className="px-6 py-3 text-center text-xs font-medium text-orange-600 uppercase tracking-wider bg-orange-50" colSpan={2}>
                Phase 2 (Middle - {filterParams.phaseDays + 1}-{filterParams.phaseDays * 2} days)
              </th>
              
              {/* ✅ Phase 3 - Original Debits & Outstanding */}
              <th className="px-6 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50" colSpan={2}>
                Phase 3 (Newest - 1-{filterParams.phaseDays} days)
              </th>
              
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
                Advance
              </th>
            </tr>
            
            {/* Sub-headers for Debit/Outstanding columns */}
            <tr className="bg-gray-100">
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              
              {/* Phase 1 Sub-headers */}
              <th className="px-3 py-2 text-right text-xs font-medium text-red-700 bg-red-50">
                Total Debit
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-red-700 bg-red-100">
                Outstanding
              </th>
              
              {/* Phase 2 Sub-headers */}
              <th className="px-3 py-2 text-right text-xs font-medium text-orange-700 bg-orange-50">
                Total Debit
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-orange-700 bg-orange-100">
                Outstanding
              </th>
              
              {/* Phase 3 Sub-headers */}
              <th className="px-3 py-2 text-right text-xs font-medium text-green-700 bg-green-50">
                Total Debit
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-green-700 bg-green-100">
                Outstanding
              </th>
              
              <th></th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.accountId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {account.accountName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  ${account.totalDebits.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  ${account.totalCredits.toLocaleString()}
                </td>
                <td className={`px-6 py-4 text-sm text-right font-medium ${
                  account.netBalance >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${Math.abs(account.netBalance).toLocaleString()}
                </td>
                
                {/* ✅ Phase 1 - Original Debit & Outstanding */}
                <td className="px-3 py-4 text-sm text-red-600 text-right bg-red-50">
                  ${account.phaseDebits.phase1.toLocaleString()}
                </td>
                <td className="px-3 py-4 text-sm text-red-700 text-right font-medium bg-red-100">
                  ${account.outstanding.phase1.toLocaleString()}
                </td>
                
                {/* ✅ Phase 2 - Original Debit & Outstanding */}
                <td className="px-3 py-4 text-sm text-orange-600 text-right bg-orange-50">
                  ${account.phaseDebits.phase2.toLocaleString()}
                </td>
                <td className="px-3 py-4 text-sm text-orange-700 text-right font-medium bg-orange-100">
                  ${account.outstanding.phase2.toLocaleString()}
                </td>
                
                {/* ✅ Phase 3 - Original Debit & Outstanding */}
                <td className="px-3 py-4 text-sm text-green-600 text-right bg-green-50">
                  ${account.phaseDebits.phase3.toLocaleString()}
                </td>
                <td className="px-3 py-4 text-sm text-green-700 text-right font-medium bg-green-100">
                  ${account.outstanding.phase3.toLocaleString()}
                </td>
                
                <td className="px-6 py-4 text-sm text-blue-700 text-right font-medium">
                  ${account.advance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          
          {/* ✅ Updated Grand Totals */}
          <tfoot className="bg-gray-100">
            <tr className="font-bold">
              <td className="px-6 py-4 text-sm text-gray-900">
                GRAND TOTAL ({accounts.length} accounts)
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">
                ${grandTotals.totalDebits.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">
                ${grandTotals.totalCredits.toLocaleString()}
              </td>
              <td className={`px-6 py-4 text-sm text-right ${
                grandTotals.netBalance >= 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ${Math.abs(grandTotals.netBalance).toLocaleString()}
              </td>
              
              {/* Grand Totals - Phase 1 */}
              <td className="px-3 py-4 text-sm text-red-700 text-right bg-red-50">
                ${grandTotals.phaseDebits.phase1.toLocaleString()}
              </td>
              <td className="px-3 py-4 text-sm text-red-800 text-right bg-red-100">
                ${grandTotals.outstanding.phase1.toLocaleString()}
              </td>
              
              {/* Grand Totals - Phase 2 */}
              <td className="px-3 py-4 text-sm text-orange-700 text-right bg-orange-50">
                ${grandTotals.phaseDebits.phase2.toLocaleString()}
              </td>
              <td className="px-3 py-4 text-sm text-orange-800 text-right bg-orange-100">
                ${grandTotals.outstanding.phase2.toLocaleString()}
              </td>
              
              {/* Grand Totals - Phase 3 */}
              <td className="px-3 py-4 text-sm text-green-700 text-right bg-green-50">
                ${grandTotals.phaseDebits.phase3.toLocaleString()}
              </td>
              <td className="px-3 py-4 text-sm text-green-800 text-right bg-green-100">
                ${grandTotals.outstanding.phase3.toLocaleString()}
              </td>
              
              <td className="px-6 py-4 text-sm text-blue-800 text-right">
                ${grandTotals.totalAdvance.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* ✅ Updated Collection Priority Summary */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <h4 className="font-medium text-gray-800 mb-3">Summary Analysis:</h4>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Original Debits by Phase */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Original Debits by Phase:</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-600">Phase 1 (Oldest):</span>
                <span className="font-medium">${grandTotals.phaseDebits.phase1.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">Phase 2 (Middle):</span>
                <span className="font-medium">${grandTotals.phaseDebits.phase2.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Phase 3 (Newest):</span>
                <span className="font-medium">${grandTotals.phaseDebits.phase3.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Collection Priority */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Collection Priority (Outstanding):</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-800 font-medium">Phase 1 (Most Urgent):</span>
                <span className="font-bold text-red-800">${grandTotals.outstanding.phase1.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-800">Phase 2 (Monitor):</span>
                <span className="font-medium text-orange-800">${grandTotals.outstanding.phase2.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Phase 3 (Recent):</span>
                <span className="font-medium text-green-800">${grandTotals.outstanding.phase3.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )





















}
