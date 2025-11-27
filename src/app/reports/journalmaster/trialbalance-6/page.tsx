'use client'

import { useState } from 'react'
import { CalculatorIcon, FunnelIcon, PrinterIcon } from '@heroicons/react/24/outline'
import { useTrialBalanceData } from '@/hooks/reports/journalmaster/trialBalance/useTrialBalanceData'
import { useTrialBalanceCal6 } from '@/hooks/reports/journalmaster/trialBalance/useTrialBalanceCal6'
import TrialBalanceFilters from '@/components/Reports/journalmaster/trialBalance/TrialBalanceFilters'
import TrialBalanceCal6Table from '@/components/Reports/journalmaster/trialBalance/TrialBalanceCal6Table'
import { TrialBalanceFilterState } from '@/types/reports/journalmaster/trialbalance/TrialBalanceTypes'

export default function TrialBalanceCal6Page() {
  const { rawData, loading, filterOptions } = useTrialBalanceData()
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<TrialBalanceFilterState>({
    acName: '',
    dateFrom: '',
    dateTo: '',
    description: '',
    entryType: '',
    showZeroBalance: true
  })

  const { records, summary } = useTrialBalanceCal6(rawData, filters)

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
    // Simple print functionality
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <CalculatorIcon className="h-6 w-6 mr-2 text-blue-600" />
              Trial Balance Cal-6 (6 Column Format)
            </h2>
            <p className="text-sm text-gray-500">
              Accounts: {summary.recordCount} | 
              Total Opening Dr: {summary.totalOpeningDr.toLocaleString()} | 
              Total Opening Cr: {summary.totalOpeningCr.toLocaleString()} | 
              Net Balance: {summary.totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            🔍 <strong>Filters Applied:</strong> Trial balance calculated from filtered data only.
            {!filters.showZeroBalance && ' Zero balance accounts are hidden.'}
          </p>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <TrialBalanceFilters
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onClear={clearFilters}
        />
      )}

      {/* Trial Balance Table */}
      <TrialBalanceCal6Table data={records} summary={summary} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Accounts</p>
          <p className="text-lg font-bold text-gray-900">{summary.recordCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-red-500">Total Opening Dr</p>
          <p className="text-lg font-bold text-red-600">{summary.totalOpeningDr.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-green-500">Total Opening Cr</p>
          <p className="text-lg font-bold text-green-600">{summary.totalOpeningCr.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-blue-500">Movement Net</p>
          <p className="text-lg font-bold text-blue-600">
            {(summary.totalMovementCr - summary.totalMovementDr).toLocaleString()}
          </p>
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
    </div>
  )
}
