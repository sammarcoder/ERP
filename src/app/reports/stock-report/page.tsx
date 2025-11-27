// 'use client'

// import { useState } from 'react'
// import { ArchiveBoxIcon, FunnelIcon, PrinterIcon } from '@heroicons/react/24/outline'
// import { useStockReportData } from '@/hooks/reports/stock-reports/useStockReportData'
// import { useStockReportProcessing } from '@/hooks/reports/stock-reports/useStockReportProcessing'
// import StockReportFilters from '@/components/Reports/stock-reports/StockReportFilters'
// import StockReportTable from '@/components/Reports/stock-reports/StockReportTable'
// import StockReportPrint from '@/components/Reports/stock-reports/StockReportPrint'
// import { StockReportFilters as FilterType } from '@/types/reports/stock/StockReportTypes'

// export default function StockMovementReportPage() {
//   const { rawData, loading, error, refetch } = useStockReportData()
//   const [showFilters, setShowFilters] = useState(true)
//   const [showPrint, setShowPrint] = useState(false)
  
//   const [filters, setFilters] = useState<FilterType>({
//     itemClass1: null,  
//     itemClass2: null,
//     itemClass3: null,
//     itemClass4: null,
//     selectedUom: 1, // Default to UOM1
//     searchTerm: ''
//   })

//   const result = useStockReportProcessing(rawData, filters)

//   const handleApplyFilters = () => {
//     // Filters are automatically applied via useStockReportProcessing
//     console.log('Filters applied:', filters)
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading stock data...</span>
//       </div>
//     )
//   }

//   const hasActiveFilters = filters.itemClass1 || filters.itemClass2 || 
//                           filters.itemClass3 || filters.itemClass4 || 
//                           filters.searchTerm.trim()

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 flex items-center">
//               <ArchiveBoxIcon className="h-6 w-6 mr-2 text-blue-600" />
//               Stock Movement Report
//             </h2>
//             <p className="text-sm text-gray-500">
//               View stock in/out quantities and balances by UOM
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               {showFilters ? 'Hide' : 'Show'} Filters
//             </button>
//             <button
//               onClick={() => setShowPrint(true)}
//               disabled={!hasActiveFilters || result.items.length === 0}
//               className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
//                 hasActiveFilters && result.items.length > 0
//                   ? 'bg-green-600 text-white hover:bg-green-700' 
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//             <button
//               onClick={refetch}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Refresh Data
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-300 rounded-lg p-4">
//           <p className="text-red-800">Error: {error}</p>
//         </div>
//       )}

//       {/* Filters */}
//       {showFilters && (
//         <StockReportFilters
//           filters={filters}
//           setFilters={setFilters}
//           onApply={handleApplyFilters}
//           loading={loading}
//         />
//       )}

//       {/* Results */}
//       <StockReportTable result={result} />

//       {/* Print Modal */}
//       {showPrint && (
//         <StockReportPrint
//           result={result}
//           onClose={() => setShowPrint(false)}
//         />
//       )}
//     </div>
//   )
// }





// import { useStockReportData } from '@/hooks/reports/stock-reports/useStockReportData'
// import { useStockReportProcessing } from '@/hooks/reports/stock-reports/useStockReportProcessing'
// import StockReportFilters from '@/components/Reports/stock-reports/StockReportFilters'
// import StockReportTable from '@/components/Reports/stock-reports/StockReportTable'
// import StockReportPrint from '@/components/Reports/stock-reports/StockReportPrint'
// import { StockReportFilters as FilterType } from '@/types/reports/stock/StockReportTypes'









'use client'

import { useState } from 'react'
import { ArchiveBoxIcon, FunnelIcon, PrinterIcon } from '@heroicons/react/24/outline'
// import { useStockReportData } from './hooks/useStockReportData'
// import { useStockReportProcessing } from './hooks/useStockReportProcessing'
// import StockReportFilters from './components/StockReportFilters'
// import StockReportTable from './components/StockReportTable'
// import StockReportPrint from './components/StockReportPrint'

import { useStockReportData } from '@/hooks/reports/stock-reports/useStockReportData'
import { useStockReportProcessing } from '@/hooks/reports/stock-reports/useStockReportProcessing'
import StockReportFilters from '@/components/Reports/stock-reports/StockReportFilters'
import StockReportTable from '@/components/Reports/stock-reports/StockReportTable'
import StockReportPrint from '@/components/Reports/stock-reports/StockReportPrint'
import { StockReportFilters as FilterType } from '@/types/reports/stock/StockReportTypes'




export default function StockMovementReportPage() {
  const { rawData, loading, error, refetch } = useStockReportData()
  const [showFilters, setShowFilters] = useState(true)
  const [showPrint, setShowPrint] = useState(false)
  
  const [filters, setFilters] = useState<FilterType>({
    itemClass1: null,  
    itemClass2: null,
    itemClass3: null,
    itemClass4: null,
    selectedUom: 1, // Default to UOM1
    searchTerm: ''
  })

  const result = useStockReportProcessing(rawData, filters)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading stock data...</span>
      </div>
    )
  }

  const hasActiveFilters = filters.itemClass1 || filters.itemClass2 || 
                          filters.itemClass3 || filters.itemClass4 || 
                          filters.searchTerm.trim()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ArchiveBoxIcon className="h-6 w-6 mr-2 text-blue-600" />
              Stock Movement Report
            </h2>
            <p className="text-sm text-gray-500">
              View stock in/out quantities and balances by UOM
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <button
              onClick={() => setShowPrint(true)}
              disabled={!hasActiveFilters || result.items.length === 0}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                hasActiveFilters && result.items.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Report
            </button>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <StockReportFilters
          filters={filters}
          setFilters={setFilters}
          classOptions={result.classOptions}
          loading={loading}
        />
      )}

      {/* Results */}
      <StockReportTable result={result} />

      {/* Print Modal */}
      {showPrint && (
        <StockReportPrint
          result={result}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  )
}
