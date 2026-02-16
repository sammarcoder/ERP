
// app/reports/batch-in-out-summary/page.tsx

'use client'
import React, { useState, useCallback, useMemo } from 'react'
import {
    FileSpreadsheet, Package, Search, Printer, Filter,
    AlertCircle, X, Building2, TrendingUp
} from 'lucide-react'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { useLazyGetBatchInOutSummaryQuery } from '@/store/slice/batchReportSlice'

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

const BatchInOutSummaryReport: React.FC = () => {
    // State
    const [batchno, setBatchno] = useState<number | null>(null)
    const [batchName, setBatchName] = useState('')
    const [uomType, setUomType] = useState<'1' | '2' | '3'>('2')
    const [error, setError] = useState('')

    // RTK Query
    const [fetchReport, { data: reportData, isLoading, isFetching, error: queryError }] = useLazyGetBatchInOutSummaryQuery()

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
            setError(err?.data?.message || err?.message || 'Failed to fetch report')
        }
    }, [batchno, uomType, fetchReport])

    // Calculate running balance for each OUT row
    const stockOutWithBalance = useMemo(() => {
        if (!reportData) return []

        const totalIn = reportData.summary.totalIn
        let runningBalance = totalIn

        return reportData.stockOut.details.map(detail => {
            runningBalance = runningBalance - detail.qty
            return {
                ...detail,
                balance: parseFloat(runningBalance.toFixed(3))
            }
        })
    }, [reportData])

    // Print
    const handlePrint = () => window.print()

    const loading = isLoading || isFetching
    const displayError = error || (queryError ? ((queryError as any)?.data?.message || 'An error occurred') : '')

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className=" rounded-lg p-6 mb-6 print:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FileSpreadsheet className="w-8 h-8 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold">Batch In/Out Summary</h1>
                            <p className=" mt-1">View stock IN, OUT and running balance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 print:hidden">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-[#28a745]" />
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28a745] bg-white"
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
                            // className="bg-[#28a745]"
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
                {displayError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">Error</p>
                            <p className="text-sm text-red-600 mt-1">{displayError}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                            <X className="w-4 h-4" />
                        </button>
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
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

                    {/* Report Title */}
                    <div className="p-6 border-b border-gray-200 print:border-b-2 print:border-black">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900">BATCH IN/OUT SUMMARY</h2>
                            <p className="text-lg text-gray-700 mt-1">
                                Batch: <span className="font-semibold">{reportData.batch.name}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Display: {uomLabels[reportData.uomType]}
                            </p>
                        </div>
                    </div>

                    {/* =============================================
              ROW 1: TOTAL STOCK IN (Simple)
              ============================================= */}
                    <div className=" px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6" />
                                <span className="text-lg font-semibold">TOTAL STOCK IN</span>
                            </div>
                            <span className="text-3xl font-bold">{reportData.summary.totalIn.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* =============================================
              STOCK OUT TABLE WITH RUNNING BALANCE
              ============================================= */}
                    <div className="overflow-x-auto">
                        {stockOutWithBalance.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="font-medium">No Stock Out Transactions</p>
                                <p className="text-sm mt-1">All stock is still available</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-100 print:bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doc #</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                            <Building2 className="w-3 h-3 inline mr-1" />
                                            Account Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-red-600 uppercase">Qty</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">number</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-blue-600 uppercase">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {stockOutWithBalance.map((detail, index) => (
                                        <tr key={detail.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-medium text-gray-900">{detail.document}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(detail.date)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{detail.acName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{detail.itemName}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-sm font-medium text-red-600">-{detail.qty.toFixed(2)}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${detail.stockTypeName === 'GDN'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {detail.stockTypeName}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`text-sm font-bold ${detail.balance >= 0 ? 'text-blue-600' : 'text-red-600'
                                                    }`}>
                                                    {detail.balance.toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100 print:bg-gray-200">
                                    <tr className="font-semibold">
                                        <td colSpan={5} className="px-4 py-3 text-right text-sm text-gray-700">
                                            TOTAL OUT:
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-red-700">
                                            -{reportData.summary.totalOut.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                                            FINAL:
                                        </td>
                                        <td className={`px-4 py-3 text-right text-sm font-bold ${reportData.summary.remaining >= 0 ? 'text-blue-700' : 'text-red-700'
                                            }`}>
                                            {reportData.summary.remaining.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>

                    {/* No OUT but has IN */}
                    {stockOutWithBalance.length === 0 && reportData.summary.totalIn > 0 && (
                        <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-700">Final Balance (No OUT):</span>
                                <span className="text-xl font-bold text-blue-700">{reportData.summary.totalIn.toFixed(2)}</span>
                            </div>
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

export default BatchInOutSummaryReport
