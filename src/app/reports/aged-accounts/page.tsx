// 'use client'

// import { useState } from 'react'
// import { CalendarIcon } from '@heroicons/react/24/outline'
// import { useAgedAccounts } from '@/hooks/reports/journalmaster/agedreports/useAgedAccounts'
// import AgedAccountsFilters from '@/components/Reports/journalmaster/agedreports/AgedAccountsFilters'
// import AgedAccountsTable from '@/components/Reports/journalmaster/agedreports/AgedAccountsTable'
// import { Transaction } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

// // Mock data for testing
// const mockTransactions: Transaction[] = [
//   // Customer: ABC Company
//   { account_id: 1, account_name: 'ABC Company', date: '2025-11-1', type: 'debit', amount: 200 },
//   { account_id: 1, account_name: 'ABC Company', date: '2025-11-5', type: 'debit', amount: 800 },
//   { account_id: 1, account_name: 'ABC Company', date: '2025-11-19', type: 'debit', amount: 500 },
//   { account_id: 1, account_name: 'ABC Company', date: '2025-11-10', type: 'credit', amount: 600 },
//   { account_id: 1, account_name: 'ABC Company', date: '2025-11-18', type: 'credit', amount: 500 },
//   { account_id: 1, account_name: 'ABC Company', date: '2025-11-18', type: 'credit', amount: 300 },
  
//   // Customer: ABC Ltd  
//   { account_id: 2, account_name: 'ABC Ltd', date: '2025-10-12', type: 'debit', amount: 2000 },
//   { account_id: 2, account_name: 'ABC Ltd', date: '2025-10-28', type: 'debit', amount: 300 },
//   { account_id: 2, account_name: 'ABC Ltd', date: '2025-10-18', type: 'credit', amount: 500 },
//   { account_id: 2, account_name: 'ABC Ltd', date: '2025-10-22', type: 'credit', amount: 1000 },
  
//   // Customer: XYZ Corp (should not match ABC filter)
//   { account_id: 3, account_name: 'XYZ Corp', date: '2025-01-15', type: 'debit', amount: 1500 },
//   { account_id: 3, account_name: 'XYZ Corp', date: '2025-01-20', type: 'credit', amount: 1500 }
// ]

// export default function AgedAccountsPage() {
//   const { loading, result, error, processReport } = useAgedAccounts()
//   const [showMockData, setShowMockData] = useState(true)
  
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 flex items-center">
//               <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
//               Aged Accounts Receivable Report
//             </h2>
//             <p className="text-sm text-gray-500">
//               FIFO payment allocation with phase-wise aging analysis
//             </p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <label className="flex items-center text-sm">
//               <input
//                 type="checkbox"
//                 checked={showMockData}
//                 onChange={(e) => setShowMockData(e.target.checked)}
//                 className="mr-2"
//               />
//               Use Mock Data
//             </label>
//           </div>
//         </div>
//       </div>
      
//       {/* Filters */}
//       <AgedAccountsFilters
//         onFilter={(params) => processReport(mockTransactions, params)}
//         loading={loading}
//       />
      
//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-300 rounded-lg p-4">
//           <p className="text-red-800">Error: {error}</p>
//         </div>
//       )}
      
//       {/* Results */}
//       {loading && (
//         <div className="flex items-center justify-center h-32">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-2 text-gray-600">Processing aged accounts...</span>
//         </div>
//       )}
      
//       {result && !loading && (
//         <AgedAccountsTable result={result} />
//       )}
      
//       {/* Mock Data Display */}
//       {showMockData && (
//         <div className="bg-gray-50 rounded-lg p-4">
//           <h3 className="font-medium text-gray-800 mb-2">Mock Transaction Data:</h3>
//           <div className="text-xs text-gray-600 space-y-1">
//             {mockTransactions.slice(0, 10).map((tx, i) => (
//               <div key={i}>
//                 {tx.account_name} - {tx.date} - {tx.type.toUpperCase()} ${tx.amount}
//               </div>
//             ))}
//             {mockTransactions.length > 10 && (
//               <div>... and {mockTransactions.length - 10} more transactions</div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
































'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { useAgedAccountsData } from '@/hooks/reports/journalmaster/agedreports/useAgedAccountsData'
import { useAgedAccounts } from '@/hooks/reports/journalmaster/agedreports/useAgedAccounts'
import AgedAccountsFilters from '@/components/Reports/journalmaster/agedreports/AgedAccountsFilters'
import AgedAccountsTable from '@/components/Reports/journalmaster/agedreports/AgedAccountsTable'
import { Transaction } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

// Mock data for testing (keeping as requested)
const mockTransactions: Transaction[] = [
  // Customer: ABC Company
  { account_id: 1, account_name: 'ABC Company', date: '2025-01-01', type: 'debit', amount: 1000 },
  { account_id: 1, account_name: 'ABC Company', date: '2025-01-15', type: 'debit', amount: 800 },
  { account_id: 1, account_name: 'ABC Company', date: '2025-01-25', type: 'debit', amount: 500 },
  { account_id: 1, account_name: 'ABC Company', date: '2025-01-10', type: 'credit', amount: 600 },
  { account_id: 1, account_name: 'ABC Company', date: '2025-01-20', type: 'credit', amount: 400 },
  
  // Customer: ABC Ltd  
  { account_id: 2, account_name: 'ABC Ltd', date: '2025-01-12', type: 'debit', amount: 2000 },
  { account_id: 2, account_name: 'ABC Ltd', date: '2025-01-28', type: 'debit', amount: 300 },
  { account_id: 2, account_name: 'ABC Ltd', date: '2025-01-18', type: 'credit', amount: 500 },
  { account_id: 2, account_name: 'ABC Ltd', date: '2025-01-22', type: 'credit', amount: 1000 },
  
  // Customer: XYZ Corp (should not match ABC filter)
  { account_id: 3, account_name: 'XYZ Corp', date: '2025-01-15', type: 'debit', amount: 1500 },
  { account_id: 3, account_name: 'XYZ Corp', date: '2025-01-20', type: 'credit', amount: 1500 },

  // Customer: ABC Industries
  { account_id: 4, account_name: 'ABC Industries', date: '2024-12-01', type: 'debit', amount: 5000 },
  { account_id: 4, account_name: 'ABC Industries', date: '2024-12-15', type: 'debit', amount: 3000 },
  { account_id: 4, account_name: 'ABC Industries', date: '2025-01-05', type: 'credit', amount: 2000 }
]

export default function AgedAccountsPage() {
  const { loading: processingLoading, result, error: processError, processReport } = useAgedAccounts()
  const { 
    transactions: realTransactions, 
    loading: dataLoading, 
    error: dataError, 
    accountNames,
    fetchRealData 
  } = useAgedAccountsData()
  
  const [useMockData, setUseMockData] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)

  // Auto-fetch real data on component mount
  useEffect(() => {
    if (!useMockData && !dataFetched) {
      fetchRealData()
      setDataFetched(true)
    }
  }, [useMockData, dataFetched, fetchRealData])

  // Handle data source toggle
  const handleDataSourceChange = (useMock: boolean) => {
    setUseMockData(useMock)
    if (!useMock && !dataFetched) {
      fetchRealData()
      setDataFetched(true)
    }
  }

  // Get current transactions based on data source
  const currentTransactions = useMockData ? mockTransactions : realTransactions
  const currentAccountNames = useMockData ? 
    [...new Set(mockTransactions.map(tx => tx.account_name))].sort() : 
    accountNames

  // Handle filter submission
  const handleFilterSubmit = (params: any) => {
    processReport(currentTransactions, params)
  }

  const isLoading = processingLoading || (!useMockData && dataLoading)
  const hasError = processError || (!useMockData && dataError)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
              Aged Accounts Receivable Report
            </h2>
            <p className="text-sm text-gray-500">
              FIFO payment allocation with phase-wise aging analysis
            </p>
          </div>
          
          {/* Data Source Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Data Source:</span>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="dataSource"
                  checked={useMockData}
                  onChange={() => handleDataSourceChange(true)}
                  className="mr-1"
                />
                Mock Data ({mockTransactions.length} transactions)
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="dataSource"
                  checked={!useMockData}
                  onChange={() => handleDataSourceChange(false)}
                  className="mr-1"
                />
                Real Data ({realTransactions.length} transactions)
              </label>
            </div>
            
            {/* Refresh Real Data Button */}
            {!useMockData && (
              <button
                onClick={() => fetchRealData()}
                disabled={dataLoading}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
              >
                {dataLoading ? 'Loading...' : 'Refresh Data'}
              </button>
            )}
          </div>
        </div>
        
        {/* Data Status */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <strong className="text-blue-800">Current Data:</strong>
            <div className="text-blue-700">
              {useMockData ? 'Mock Data' : 'Real API Data'} - {currentTransactions.length} transactions
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <strong className="text-green-800">Available Accounts:</strong>
            <div className="text-green-700">{currentAccountNames.length} unique accounts</div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <strong className="text-purple-800">Status:</strong>
            <div className={`${hasError ? 'text-red-700' : 'text-green-700'}`}>
              {hasError ? 'Error' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {hasError && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Error Loading Data</h4>
          <p className="text-red-700">{processError || dataError}</p>
          {!useMockData && (
            <button
              onClick={() => fetchRealData()}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* No Data Warning */}
      {!useMockData && !dataLoading && realTransactions.length === 0 && !dataError && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ No real data available. Switch to Mock Data to test the report functionality.
          </p>
        </div>
      )}

      {/* Filters */}
      {currentTransactions.length > 0 && (
        <AgedAccountsFilters
          onFilter={handleFilterSubmit}
          loading={isLoading}
          availableAccounts={currentAccountNames}
        />
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">
            {dataLoading ? 'Loading data...' : 'Processing aged accounts...'}
          </span>
        </div>
      )}
      
      {/* Results */}
      {result && !isLoading && (
        <AgedAccountsTable result={result} />
      )}
      
      {/* Data Preview (for debugging) */}
      {currentTransactions.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">Data Preview</h3>
            <span className="text-xs text-gray-600">
              Showing first 10 of {currentTransactions.length} transactions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-gray-600">
                  <th className="text-left p-1">Account</th>
                  <th className="text-left p-1">Date</th>
                  <th className="text-left p-1">Type</th>
                  <th className="text-right p-1">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentTransactions.slice(0, 10).map((tx, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="p-1">{tx.account_name}</td>
                    <td className="p-1">{tx.date}</td>
                    <td className="p-1">
                      <span className={`px-1 rounded ${
                        tx.type === 'debit' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-1 text-right">${tx.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
