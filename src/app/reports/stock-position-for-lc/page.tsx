// app/reports/batch-stock-ledger/page.tsx

'use client'
import React, { useState, useCallback } from 'react'
import { 
  FileBarChart, Package, Search, Printer, Filter
} from 'lucide-react'
import {CoaSearchableInput} from '@/components/common/coa/CoaSearchableInput'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { useLazyGetBatchStockLedgerQuery } from '@/store/slice/batchReportSlice'

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const uomLabels: Record<string, string> = {
  '1': 'UOM 1 (Primary)',
  '2': 'UOM 2 (Secondary)',
  '3': 'UOM 3 (Tertiary)'
}

const BatchStockLedgerReport: React.FC = () => {
  // State
  const [batchno, setBatchno] = useState<number | null>(null)
  const [batchName, setBatchName] = useState('')
  const [uomType, setUomType] = useState<'1' | '2' | '3'>('2')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [error, setError] = useState('')

  // RTK Query - Lazy query for manual trigger
  const [fetchReport, { data: reportData, isLoading, isFetching }] = useLazyGetBatchStockLedgerQuery()

  // Handle batch change
  const handleBatchChange = useCallback((id: number | null, data?: any) => {
    setBatchno(id)
    setBatchName(data?.acName || '')
    setError('')
  }, [])

  // Generate report
  const handleGenerateReport = useCallback(async () => {
    if (!batchno) {
      setError('Please select a batch')
      return
    }
    setError('')
    try {
      await fetchReport({ batchno, uom: uomType }).unwrap()
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to fetch report')
    }
  }, [batchno, uomType, fetchReport])

  // Toggle item expansion
  const toggleItemExpansion = (itemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  // Print report
  const handlePrint = () => {
    window.print()
  }

  const loading = isLoading || isFetching

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4d98de] to-[#3a7fc4] rounded-lg p-6 mb-6 text-white print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileBarChart className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Batch Stock Ledger</h1>
              <p className="text-blue-100 mt-1">View stock IN/OUT by batch and item</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 print:hidden">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-[#4d98de]" />
          Report Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Batch Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch <span className="text-red-500">*</span>
            </label>
            <CoaSearchableInput
              value={batchno}
              onChange={handleBatchChange}
              placeholder="Select batch..."
            />
          </div>

          {/* UOM Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display UOM
            </label>
            <select
              value={uomType}
              onChange={(e) => setUomType(e.target.value as '1' | '2' | '3')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d98de] bg-white"
            >
              <option value="1">UOM 1 (Primary)</option>
              <option value="2">UOM 2 (Secondary)</option>
              <option value="3">UOM 3 (Tertiary)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-3">
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              loading={loading}
              icon={<Search className="w-4 h-4" />}
              className="bg-[#4d98de] hover:bg-[#3a7fc4]"
            >
              Generate Report
            </Button>
            {reportData && (
              <Button
                variant="outline"
                onClick={handlePrint}
                icon={<Printer className="w-4 h-4" />}
              >
                Print
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <Loading size="lg" text="Generating report..." />
        </div>
      )}

      {/* Report Content */}
      {reportData && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden print:border-0">
          {/* Report Header */}
          <div className="p-6 border-b border-gray-200 print:border-b-2 print:border-black">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">BATCH STOCK LEDGER</h2>
              <p className="text-lg text-gray-700 mt-1">
                Batch: <span className="font-semibold">{reportData.batch.name}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Display: {uomLabels[reportData.uomType]}
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 print:bg-white">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalItems}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
              <p className="text-sm text-green-600">Total Stock IN</p>
              <p className="text-2xl font-bold text-green-700">{reportData.summary.grandTotalIn.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200 text-center">
              <p className="text-sm text-red-600">Total Stock OUT</p>
              <p className="text-2xl font-bold text-red-700">{reportData.summary.grandTotalOut.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
              <p className="text-sm text-blue-600">Balance</p>
              <p className={`text-2xl font-bold ${reportData.summary.grandBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {reportData.summary.grandBalance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 print:bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-green-600 uppercase">Stock IN</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-red-600 uppercase">Stock OUT</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-blue-600 uppercase">Balance</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">UOM</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase print:hidden">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.items.map((item, index) => (
                  <React.Fragment key={item.item_id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-green-600">{item.totalIn.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-red-600">{item.totalOut.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${item.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {item.balance.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-600">{item.uomName}</span>
                      </td>
                      <td className="px-4 py-3 text-center print:hidden">
                        <button
                          onClick={() => toggleItemExpansion(item.item_id)}
                          className="text-[#4d98de] hover:text-[#3a7fc4] text-sm font-medium"
                        >
                          {expandedItems.has(item.item_id) ? 'Hide' : 'Show'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Transactions */}
                    {expandedItems.has(item.item_id) && (
                      <tr className="print:hidden">
                        <td colSpan={7} className="px-4 py-2 bg-gray-50">
                          <div className="ml-8 overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Document</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Type</th>
                                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Qty</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {item.transactions.map((txn) => (
                                  <tr key={txn.id} className="hover:bg-white">
                                    <td className="px-3 py-2 text-gray-800">{txn.document}</td>
                                    <td className="px-3 py-2 text-gray-600">{formatDate(txn.date)}</td>
                                    <td className="px-3 py-2 text-center">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        txn.type === 'IN'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        {txn.type}
                                      </span>
                                    </td>
                                    <td className={`px-3 py-2 text-right font-medium ${
                                      txn.type === 'IN' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {txn.qty.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 print:bg-gray-200 font-semibold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right text-sm text-gray-700">GRAND TOTAL:</td>
                  <td className="px-4 py-3 text-right text-sm text-green-700">{reportData.summary.grandTotalIn.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-sm text-red-700">{reportData.summary.grandTotalOut.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-sm text-blue-700">{reportData.summary.grandBalance.toFixed(2)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* No Data */}
          {reportData.items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No stock entries found for this batch</p>
            </div>
          )}

          {/* Print Footer */}
          <div className="hidden print:block p-4 border-t border-gray-200 text-center text-sm text-gray-500">
            Generated on: {new Date().toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}

export default BatchStockLedgerReport
