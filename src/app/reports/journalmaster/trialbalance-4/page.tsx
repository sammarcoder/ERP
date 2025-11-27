'use client'

import { useState } from 'react'
import { CalculatorIcon, FunnelIcon, PrinterIcon } from '@heroicons/react/24/outline'
import { useTrialBalanceData } from '@/hooks/reports/journalmaster/trialBalance/useTrialBalanceData'
import { useTrialBalanceCal6 } from '@/hooks/reports/journalmaster/trialBalance/useTrialBalanceCal6'
import TrialBalanceFilters from '@/components/Reports/journalmaster/trialBalance/TrialBalanceFilters'
// import TrialBalanceCal6Table from '@/components/Reports/journalmaster/trialBalance/TrialBalanceCal6Table'
import TrialBalanceCal4Table from '@/components/Reports/journalmaster/trialBalance/TrialBalanceCal4Table'
import { TrialBalanceFilterState } from '@/types/reports/journalmaster/trialbalance/TrialBalanceTypes'

export default function TrialBalanceCal4Page() {
  const { rawData, loading, filterOptions } = useTrialBalanceData() // ✅ Same hook as Cal-6
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<TrialBalanceFilterState>({
    acName: '',
    dateFrom: '',
    dateTo: '',
    description: '',
    entryType: '',
    showZeroBalance: true
  })

  const { records, summary } = useTrialBalanceCal6(rawData, filters) // ✅ Same hook as Cal-6

  const clearFilters = () => {
    setFilters({
      acName: '',
      dateFrom: '',
      dateTo: '',
      description: '',
      entryType: '',
      showZeroBalance: true
    })
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading trial balance data...</span>
      </div>
    )
  }

  const activeFilterCount = Object.values(filters).filter(v => v && v !== true).length
  const hasFilters = activeFilterCount > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CalculatorIcon className="h-6 w-6 mr-2 text-purple-600" />
              Trial Balance Cal-4 (4 Column Format)
            </h2>
            <p className="text-sm text-gray-500">
              Accounts: {summary.recordCount} | 
              Movement Dr: {summary.totalMovementDr.toLocaleString()} | 
              Movement Cr: {summary.totalMovementCr.toLocaleString()} | 
              Net Balance: {summary.totalBalance.toLocaleString()}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              ℹ️ Same functionality as Cal-6, opening columns hidden from display
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters ({activeFilterCount})
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Filter Status */}
      {hasFilters && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-800">
            🔍 <strong>Filters Applied:</strong> Same calculation as Cal-6, opening columns hidden.
            {!filters.showZeroBalance && ' Zero balance accounts are hidden.'}
          </p>
        </div>
      )}

      {/* ✅ Reuse Cal-6 Filters Component */}
      {showFilters && (
        <TrialBalanceFilters
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onClear={clearFilters}
        />
      )}

      {/* ✅ Reuse Cal-6 Table Component with hideOpeningColumns prop */}
      <TrialBalanceCal4Table 
        data={records} 
        summary={summary} 
        showOpeningColumns={false}  // 🎯 ONLY difference - hide opening columns
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Accounts</p>
          <p className="text-lg font-bold text-gray-900">{summary.recordCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-red-500">Movement Debit</p>
          <p className="text-lg font-bold text-red-600">{summary.totalMovementDr.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-green-500">Movement Credit</p>
          <p className="text-lg font-bold text-green-600">{summary.totalMovementCr.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-l-4 border-purple-300">
          <p className="text-sm text-purple-600">💰 Final Balance</p>
          <p className={`text-xl font-bold ${
            summary.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Info Panel */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📋 Cal-4 vs Cal-6 Comparison</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Same calculation logic:</strong> Uses identical useTrialBalanceCal6 hook</li>
          <li>• <strong>Same filters & functionality:</strong> All features work identically</li>
          <li>• <strong>Display difference:</strong> Hides opening Dr/Cr columns (still calculated in background)</li>
          <li>• <strong>4 columns:</strong> Account Name | Movement Debit | Movement Credit | Balance</li>
        </ul>
      </div> */}
    </div>
  )
}
