import { TrialBalanceRecord, TrialBalanceSummary } from '@/types/reports/journalmaster/trialbalance/TrialBalanceTypes'

interface TrialBalanceCal6TableProps {
  data: TrialBalanceRecord[]
  summary: TrialBalanceSummary
}

export default function TrialBalanceCal6Table({ data, summary }: TrialBalanceCal6TableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Name
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opening Debit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opening Credit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Debit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Credit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                💰 Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record, index) => (
              <tr 
                key={record.acName} 
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {record.acName}
                </td>
                <td className="px-4 py-3 text-sm text-red-600 text-right font-medium">
                  {record.openingDr > 0 ? record.openingDr.toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                  {record.openingCr > 0 ? record.openingCr.toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-red-600 text-right font-medium">
                  {record.movementDr > 0 ? record.movementDr.toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                  {record.movementCr > 0 ? record.movementCr.toLocaleString() : '-'}
                </td>
                <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${
                  record.balance >= 0 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-red-700 bg-red-50 border-red-200'
                }`}>
                  {record.balance.toLocaleString()}
                </td>
              </tr>
            ))}
            
            {/* Totals Row */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                TOTALS ({summary.recordCount} accounts)
              </td>
              <td className="px-4 py-3 text-sm font-bold text-red-700 text-right">
                {summary.totalOpeningDr.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-green-700 text-right">
                {summary.totalOpeningCr.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-red-700 text-right">
                {summary.totalMovementDr.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-green-700 text-right">
                {summary.totalMovementCr.toLocaleString()}
              </td>
              <td className={`px-4 py-3 text-sm font-bold text-right border-l-2 ${
                summary.totalBalance >= 0 
                  ? 'text-green-700 bg-green-100 border-green-200' 
                  : 'text-red-700 bg-red-100 border-red-200'
              }`}>
                {summary.totalBalance.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No accounts found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
