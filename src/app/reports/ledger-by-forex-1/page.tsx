// 'use client'

// import { useState } from 'react'
// import { CalculatorIcon, FunnelIcon, PrinterIcon } from '@heroicons/react/24/outline'
// import { useJournalMasterAdvancedData } from '@/hooks/reports/ledgerbyforex1/useJournalMasterAdvancedData'
// import { useAdvancedComplexFiltering } from '@/hooks/reports/ledgerbyforex1/useAdvancedComplexFiltering'
// import AdvancedJournalFilters from '@/components/Reports/ledgerbyforex1/AdvancedJournalFilters'
// import AdvancedJournalTable from '@/components/Reports/ledgerbyforex1/AdvancedJournalTable'
// import { AdvancedFilterState } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

// export default function JournalMasterAdvancedPage() {
//   const { rawData, loading, filterOptions } = useJournalMasterAdvancedData()
//   const [showFilters, setShowFilters] = useState(false)
  
//   const [filters, setFilters] = useState<AdvancedFilterState>({
//     acName: '', // ✅ MANDATORY - empty by default
//     dateFrom: '',
//     dateTo: '',
//     description: '',
//     minCredit: '',
//     maxCredit: '',
//     minDebit: '',
//     maxDebit: '',
//     receiptNo: '',
//     entryType: '',
//     showOpeningOnly: false
//   })

//   const { displayData, systemRowInfo, filteringStats } = useAdvancedComplexFiltering(rawData, filters)

//   const clearFilters = () => {
//     setFilters({
//       acName: '', // Reset to mandatory empty state
//       dateFrom: '',
//       dateTo: '',
//       description: '',
//       minCredit: '',
//       maxCredit: '',
//       minDebit: '',
//       maxDebit: '',
//       receiptNo: '',
//       entryType: '',
//       showOpeningOnly: false
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading advanced journal data...</span>
//       </div>
//     )
//   }

//   const hasRequiredFilter = filters.acName
//   const activeFilterCount = Object.values(filters).filter(v => v).length

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 flex items-center">
//               <CalculatorIcon className="h-6 w-6 mr-2 text-purple-600" />
//               Advanced Journal Master - Dual Balance Tracking
//             </h2>
//             <p className="text-sm text-gray-500">
//               {hasRequiredFilter ? (
//                 <>
//                   Account: {filters.acName} | Records: {displayData.length} | 
//                   Final Balance: {displayData[displayData.length - 1]?.balance.toLocaleString() || '0'} | 
//                   Own Balance: {displayData[displayData.length - 1]?.ownBalance.toLocaleString() || '0'}
//                 </>
//               ) : (
//                 <>Select an account to enable advanced processing with dual balance calculations</>
//               )}
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               Filters ({activeFilterCount})
//             </button>
//             <button
//               onClick={() => window.print()}
//               disabled={!hasRequiredFilter}
//               className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
//                 hasRequiredFilter 
//                   ? 'bg-green-600 text-white hover:bg-green-700' 
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mandatory Filter Notice */}
//       {!hasRequiredFilter && (
//         <div className="bg-red-50 border border-red-300 rounded-lg p-4">
//           <p className="text-sm text-red-800">
//             ⚠️ <strong>Account Selection Required:</strong> This advanced report requires account selection to enable dual balance processing and complex filtering logic.
//           </p>
//         </div>
//       )}

//       {/* Filters Panel */}
//       {showFilters && (
//         <AdvancedJournalFilters
//           filters={filters}
//           setFilters={setFilters}
//           filterOptions={filterOptions}
//           onClear={clearFilters}
//         />
//       )}

//       {/* Advanced Data Table */}
//       <AdvancedJournalTable 
//         data={displayData}
//         systemRowInfo={{
//           displayBalance: systemRowInfo.displayBalance,
//           displayOwnBalance: systemRowInfo.displayOwnBalance,
//           calculationBalance: systemRowInfo.calculationBalance,
//           calculationOwnBalance: systemRowInfo.calculationOwnBalance,
//           lastHiddenRowIndex: systemRowInfo.lastHiddenRowIndex
//         }}
//       />

//       {/* Enhanced Summary */}
//       {hasRequiredFilter && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-3">Advanced Processing Summary</h3>
//           <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//             <div className="text-center p-3 bg-gray-50 rounded">
//               <p className="text-sm text-gray-500">Records</p>
//               <p className="text-lg font-bold text-gray-900">{displayData.length}</p>
//             </div>
//             <div className="text-center p-3 bg-orange-50 rounded">
//               <p className="text-sm text-orange-600">Opening Records</p>
//               <p className="text-lg font-bold text-orange-700">{systemRowInfo.totalOpeningRecords}</p>
//             </div>
//             <div className="text-center p-3 bg-blue-50 rounded">
//               <p className="text-sm text-blue-600">Final Balance</p>
//               <p className={`text-lg font-bold ${
//                 displayData[displayData.length - 1]?.balance >= 0 ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {displayData[displayData.length - 1]?.balance.toLocaleString() || '0'}
//               </p>
//             </div>
//             <div className="text-center p-3 bg-green-50 rounded border-l-4 border-green-300">
//               <p className="text-sm text-green-600">💱 Own Balance</p>
//               <p className={`text-lg font-bold ${
//                 displayData[displayData.length - 1]?.ownBalance >= 0 ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {displayData[displayData.length - 1]?.ownBalance.toLocaleString() || '0'}
//               </p>
//             </div>
//             <div className="text-center p-3 bg-purple-50 rounded">
//               <p className="text-sm text-purple-600">System Row</p>
//               <p className="text-lg font-bold text-purple-700">
//                 {systemRowInfo.systemRowGenerated ? '✅ Generated' : '❌ None'}
//               </p>
//             </div>
//             <div className="text-center p-3 bg-yellow-50 rounded">
//               <p className="text-sm text-yellow-600">Hidden by Date</p>
//               <p className="text-lg font-bold text-yellow-700">{filteringStats.hiddenByDate}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }














































'use client'

import { useState } from 'react'
import { CurrencyDollarIcon, FunnelIcon, PrinterIcon } from '@heroicons/react/24/outline'
import { useLedgerByForexData } from '@/hooks/reports/ledgerbyforex1/useLedgerByForexData'
import { useLedgerByForexFiltering } from '@/hooks/reports/ledgerbyforex1/useLedgerByForexFiltering'
import LedgerByForexFilters from '@/components/Reports/ledgerbyforex1/AdvancedJournalFilters'
import LedgerByForexTable from '@/components/Reports/ledgerbyforex1/LedgerByForexTable'
import { AdvancedFilterState } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

export default function LedgerByForexPage() {
  const { rawData, loading, filterOptions } = useLedgerByForexData()
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<AdvancedFilterState>({
    acName: '', // ✅ MANDATORY - empty by default
    dateFrom: '',
    dateTo: '',
    description: '',
    minCredit: '',
    maxCredit: '',
    minDebit: '',
    maxDebit: '',
    receiptNo: '',
    entryType: '',
    showOpeningOnly: false
  })

  const { displayData, systemRowInfo, filteringStats } = useLedgerByForexFiltering(rawData, filters)

  const clearFilters = () => {
    setFilters({
      acName: '', // Reset to mandatory empty state
      dateFrom: '',
      dateTo: '',
      description: '',
      minCredit: '',
      maxCredit: '',
      minDebit: '',
      maxDebit: '',
      receiptNo: '',
      entryType: '',
      showOpeningOnly: false
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading ledger by forex data...</span>
      </div>
    )
  }

  const hasRequiredFilter = filters.acName
  const activeFilterCount = Object.values(filters).filter(v => v).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
              Ledger by Forex -1 (Dual Balance Tracking)
            </h2>
            <p className="text-sm text-gray-500">
              {hasRequiredFilter ? (
                <>
                  Account: {filters.acName} | Records: {displayData.length} | 
                  Final Balance: {displayData[displayData.length - 1]?.balance.toLocaleString() || '0'} | 
                  Own Balance: {displayData[displayData.length - 1]?.ownBalance.toLocaleString() || '0'}
                </>
              ) : (
                <>Select an account to enable ledger processing with dual balance calculations</>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters ({activeFilterCount})
            </button>
            <button
              onClick={() => window.print()}
              disabled={!hasRequiredFilter}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                hasRequiredFilter 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Filter Notice */}
      {!hasRequiredFilter && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-800">
            ⚠️ <strong>Account Selection Required:</strong> This ledger report requires account selection to enable dual balance processing and forex calculations.
          </p>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <LedgerByForexFilters
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onClear={clearFilters}
        />
      )}

      {/* Ledger by Forex Table */}
      <LedgerByForexTable 
        data={displayData}
        systemRowInfo={{
          displayBalance: systemRowInfo.displayBalance,
          displayOwnBalance: systemRowInfo.displayOwnBalance,
          calculationBalance: systemRowInfo.calculationBalance,
          calculationOwnBalance: systemRowInfo.calculationOwnBalance,
          lastHiddenRowIndex: systemRowInfo.lastHiddenRowIndex
        }}
      />

      {/* Enhanced Summary */}
      {hasRequiredFilter && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Ledger by Forex Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Records</p>
              <p className="text-lg font-bold text-gray-900">{displayData.length}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <p className="text-sm text-orange-600">Opening Records</p>
              <p className="text-lg font-bold text-orange-700">{systemRowInfo.totalOpeningRecords}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-600">Final Balance</p>
              <p className={`text-lg font-bold ${
                displayData[displayData.length - 1]?.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {displayData[displayData.length - 1]?.balance.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded border-l-4 border-green-300">
              <p className="text-sm text-green-600">💱 Own Balance</p>
              <p className={`text-lg font-bold ${
                displayData[displayData.length - 1]?.ownBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {displayData[displayData.length - 1]?.ownBalance.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <p className="text-sm text-purple-600">System Row</p>
              <p className="text-lg font-bold text-purple-700">
                {systemRowInfo.systemRowGenerated ? '✅ Generated' : '❌ None'}
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded">
              <p className="text-sm text-yellow-600">Hidden by Date</p>
              <p className="text-lg font-bold text-yellow-700">{filteringStats.hiddenByDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
