
























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
