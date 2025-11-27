import { AdvancedProcessedRecord } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

interface AdvancedJournalTableProps {
  data: AdvancedProcessedRecord[]
  systemRowInfo?: {
    displayBalance: number
    displayOwnBalance: number
    calculationBalance: number
    calculationOwnBalance: number
    lastHiddenRowIndex: number
  }
}

export default function AdvancedJournalTable({ data, systemRowInfo }: AdvancedJournalTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Own Debit</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Own Credit</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-blue-50">💰 Balance</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-green-50">💱 Own Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record, index) => (
              <tr 
                key={`${record.id}-${index}`} 
                className={`hover:bg-gray-50 ${
                  record.isOpening 
                    ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400' 
                    : ''
                }`}
              >
                <td className="px-4 py-3 text-sm text-blue-600 font-mono font-bold">
                  #{record.displayRowIndex || record.rowIndex}
                  {record.isOpening && <div className="text-xs text-orange-600 font-normal">SYSTEM</div>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.voucherNo}
                  {record.isOpening && <div className="text-xs text-orange-600">Always Shows</div>}
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
                    {record.isOpening && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                        🔶 Always Shows
                      </span>
                    )}
                    {record.description}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
                  {record.amountDb.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
                  {record.amountCr.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-red-500 text-right">
                  {record.ownDb.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-500 text-right">
                  {record.ownCr.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  {record.isOpening ? '-' : Number(record.rate).toFixed(2)}
                </td>
                
                {/* Regular Balance */}
                <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${
                  record.balance >= 0 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-red-700 bg-red-50 border-red-200'
                } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  {record.balance.toLocaleString()}
                  
                  {record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0 && (
                    <div className="text-xs mt-1 space-y-1 border-t border-orange-200 pt-1">
                      <div className="text-orange-600 font-medium">
                        📊 Opening: {systemRowInfo.displayBalance.toLocaleString()}
                      </div>
                      <div className="text-blue-600 font-medium">
                        🧮 Calculation: {systemRowInfo.calculationBalance.toLocaleString()}
                      </div>
                    </div>
                  )}
                </td>

                {/* ✅ NEW: Own Balance Column */}
                <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${
                  record.ownBalance >= 0 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-red-700 bg-red-50 border-red-200'
                } ${record.isOpening ? 'border-orange-300 bg-orange-50' : ''}`}>
                  {record.ownBalance.toLocaleString()}
                  
                  {record.isOpening && systemRowInfo && systemRowInfo.lastHiddenRowIndex > 0 && (
                    <div className="text-xs mt-1 space-y-1 border-t border-orange-200 pt-1">
                      <div className="text-orange-600 font-medium">
                        📊 Own Opening: {systemRowInfo.displayOwnBalance.toLocaleString()}
                      </div>
                      <div className="text-blue-600 font-medium">
                        🧮 Own Calc: {systemRowInfo.calculationOwnBalance.toLocaleString()}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Select an account to view journal data</p>
            <p className="text-gray-400 text-sm mt-2">Account selection is mandatory for this advanced report</p>
          </div>
        )}
      </div>
    </div>
  )
}
