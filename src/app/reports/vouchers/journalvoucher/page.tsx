// 'use client'

// import { useState } from 'react'
// import { DocumentTextIcon, FunnelIcon, PrinterIcon } from '@heroicons/react/24/outline'
// import { useJournalVoucherData } from '@/hooks/reports/vouchers/journalVoucher/useJournalVoucherData'
// import { useJournalVoucher } from '@/hooks/reports/vouchers/journalVoucher/useJournalVoucher'
// import JournalVoucherFilters from '@/components/Reports/vouchers/journalvoucher/JournalVoucherFilters'
// import JournalVoucherTable from '@/components/Reports/vouchers/journalvoucher/JournalVoucherTable'
// import { JournalVoucherFilterState } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

// export default function JournalVoucherPage() {
//   const { rawData, loading, filterOptions } = useJournalVoucherData()
//   const [showFilters, setShowFilters] = useState(true) // Show filters by default

//   const [filters, setFilters] = useState<JournalVoucherFilterState>({
//     voucherTypeId: null,
//     voucherNo: ''
//   })

//   const { records, header, balanceRows, filteredVoucherNos } = useJournalVoucher(rawData, filters)

//   const clearFilters = () => {
//     setFilters({
//       voucherTypeId: null,
//       voucherNo: ''
//     })
//   }

//   const handlePrint = () => {
//     if (!header) {
//       alert('Please select a voucher to print')
//       return
//     }
//     window.print()
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading journal voucher data...</span>
//       </div>
//     )
//   }

//   const isFiltersComplete = filters.voucherTypeId && filters.voucherNo
//   const selectedVoucherType = filterOptions.voucherTypes.find(vt => vt.id === filters.voucherTypeId)

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 flex items-center">
//               <DocumentTextIcon className="h-6 w-6 mr-2 text-purple-600" />
//               Journal Voucher Report
//             </h2>
//             <p className="text-sm text-gray-500">
//               {isFiltersComplete ? (
//                 <>Showing: {selectedVoucherType?.name} - {filters.voucherNo} | Records: {records.length}</>
//               ) : (
//                 <>Select voucher type and voucher number to view details</>
//               )}
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               {showFilters ? 'Hide' : 'Show'} Filters
//             </button>
//             <button
//               onClick={handlePrint}
//               disabled={!isFiltersComplete}
//               className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
//                 isFiltersComplete 
//                   ? 'bg-green-600 text-white hover:bg-green-700' 
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Voucher
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filter Instructions */}
//       <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//         <h4 className="font-medium text-amber-800 mb-2">📋 Filter Instructions</h4>
//         <ol className="text-sm text-amber-700 space-y-1">
//           <li><strong>Step 1:</strong> Select Voucher Type (mandatory) - This will filter available voucher numbers</li>
//           <li><strong>Step 2:</strong> Enter/Select Voucher Number (mandatory) - Type to search and select from suggestions</li>
//           <li><strong>Result:</strong> View complete voucher details with opening and closing balance rows</li>
//         </ol>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <JournalVoucherFilters
//           filters={filters}
//           setFilters={setFilters}
//           filterOptions={filterOptions}
//           filteredVoucherNos={filteredVoucherNos}
//           onClear={clearFilters}
//         />
//       )}

//       {/* Journal Voucher Table */}
//       <JournalVoucherTable 
//         records={records} 
//         header={header} 
//         balanceRows={balanceRows}
//       />

//       {/* Summary */}
//       {isFiltersComplete && header && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-3">Voucher Summary</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center p-3 bg-gray-50 rounded">
//               <p className="text-sm text-gray-500">Total Entries</p>
//               <p className="text-lg font-bold text-gray-900">{records.length}</p>
//             </div>
//             <div className="text-center p-3 bg-red-50 rounded">
//               <p className="text-sm text-red-500">Total Debit</p>
//               <p className="text-lg font-bold text-red-600">{header.totalDebit.toLocaleString()}</p>
//             </div>
//             <div className="text-center p-3 bg-green-50 rounded">
//               <p className="text-sm text-green-500">Total Credit</p>
//               <p className="text-lg font-bold text-green-600">{header.totalCredit.toLocaleString()}</p>
//             </div>
//             <div className="text-center p-3 bg-blue-50 rounded border-l-4 border-blue-300">
//               <p className="text-sm text-blue-600">Balance Status</p>
//               <p className={`text-lg font-bold ${
//                 header.totalDebit === header.totalCredit ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {header.totalDebit === header.totalCredit ? 'Balanced' : 'Unbalanced'}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



















































'use client'

import { useState,useEffect } from 'react'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { useJournalVoucherData } from '@/hooks/reports/vouchers/journalVoucher/useJournalVoucherData'
import { useJournalVoucher } from '@/hooks/reports/vouchers/journalVoucher/useJournalVoucher'
import JournalVoucherFilters from '@/components/Reports/vouchers/journalvoucher/JournalVoucherFilters'
import JournalVoucherTable from '@/components/Reports/vouchers/journalvoucher/JournalVoucherTable'
import PrintJournalVoucher from '@/components/Reports/vouchers/journalvoucher/PrintJournalVoucher'
import { JournalVoucherFilterState } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

export default function JournalVoucherPage() {
  const { rawData, loading, filterOptions } = useJournalVoucherData()
  const [showPrintOptions, setShowPrintOptions] = useState(false)

  const [filters, setFilters] = useState<JournalVoucherFilterState>({
    voucherTypeId: null,
    voucherNo: ''
  })





  // Add this after useJournalVoucherData call to debug
  useEffect(() => {
    if (!loading && rawData.length > 0) {
      console.log('🐛 DEBUG: Raw data sample descriptions:',
        rawData.slice(0, 10).map((r, i) => `${i}: "${r.description}"`)
      )

      const autoBalancingRecords = rawData.filter(r =>
        r.description && r.description.toLowerCase().includes('auto balancing')
      )

      console.log('🐛 DEBUG: Found auto balancing records:', autoBalancingRecords.length)
      autoBalancingRecords.forEach(r =>
        console.log(`🐛 Auto balancing record: "${r.description}"`)
      )
    }
  }, [rawData, loading])





  const { records, header, balanceRows, filteredVoucherNos } = useJournalVoucher(rawData, filters)

  const clearFilters = () => {
    setFilters({
      voucherTypeId: null,
      voucherNo: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    )
  }

  const isComplete = filters.voucherTypeId && filters.voucherNo

  return (
    <div className="space-y-2">
      {/* Minimal Header */}
      <div className="bg-white rounded shadow p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
            <h2 className="text-base font-medium">Journal Voucher</h2>
          </div>
          {/* ✅ Toggle Print Options */}
          <button
            onClick={() => setShowPrintOptions(!showPrintOptions)}
            disabled={!isComplete}
            className={`px-3 py-1 rounded text-xs ${isComplete
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Print Options
          </button>
        </div>
      </div>

      {/* ✅ Show Print Component when toggled */}
      {showPrintOptions && isComplete && (
        <div className="bg-white rounded shadow p-2">
          <PrintJournalVoucher
            records={records}
            header={header}
            balanceRows={balanceRows}
            onClose={() => setShowPrintOptions(false)}
          />
        </div>
      )}

      {/* Filters */}
      <JournalVoucherFilters
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        filteredVoucherNos={filteredVoucherNos}
        onClear={clearFilters}
      />

      {/* Table */}
      <JournalVoucherTable
        records={records}
        header={header}
        balanceRows={balanceRows}
      />

      {/* Minimal Summary */}
      {isComplete && header && (
        <div className="bg-white rounded shadow p-2">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xs text-gray-500">Entries</div>
              <div className="text-xs font-medium">{records.length}</div>
            </div>
            <div>
              <div className="text-xs text-red-500">Debit</div>
              <div className="text-xs font-medium">{header.totalDebit.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-green-500">Credit</div>
              <div className="text-xs font-medium">{header.totalCredit.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-blue-500">Status</div>
              <div className={`text-xs font-medium ${header.totalDebit === header.totalCredit ? 'text-green-600' : 'text-red-600'
                }`}>
                {header.totalDebit === header.totalCredit ? 'Balanced' : 'Unbalanced'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
