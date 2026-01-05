'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import SelectableTable from '@/components/SelectableTable'
import { JournalDetail } from '@/types/journalVoucher'
import { formatAmount, formatDisplayDate } from '@/utils/formatters'


import { usePermissions } from '@/hooks/keycloack/usePermissions'

import {
  Plus,
  Trash2,
  Receipt,
  AlertCircle
} from 'lucide-react'

interface VoucherDetailsProps {
  journalDetails: JournalDetail[]
  allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
  currencyOptions: Array<{ id: number; label: string; currencyName: string }>
  totals: { debitTotal: number; creditTotal: number; difference: number }
  balancingCoaId: number | null
  onDetailChange: (index: number, field: string, value: any) => void
  onAddRow: () => void
  onRemoveRow: (index: number) => void
}

const VoucherDetails: React.FC<VoucherDetailsProps> = ({
  journalDetails,
  allCoaAccounts,
  currencyOptions,
  totals,
  balancingCoaId,
  onDetailChange,
  onAddRow,
  onRemoveRow
}) => {
  const [isOpening, setIsOpening] = useState(false)
  const [isClosing, setIsClosing] = useState(false)


  const { hasPermission, userRoles } = usePermissions()
  const canRead = hasPermission('currency:read')
  const canWrite = hasPermission('currency:write')
  const canDelete = hasPermission('currency:delete')

  const handleDetailChange = (index: number, field: string, value: any) => {
    onDetailChange(index, field, value)

    if ((field === 'ownDb' || field === 'amountDb') && value > 0) {
      onDetailChange(index, 'ownCr', 0)
      onDetailChange(index, 'amountCr', 0)
    }

    if ((field === 'ownCr' || field === 'amountCr') && value > 0) {
      onDetailChange(index, 'ownDb', 0)
      onDetailChange(index, 'amountDb', 0)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
          <h2 className="text-lg font-semibold text-gray-900">Journal Details</h2>
          <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
            {journalDetails.length} rows
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {canWrite && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAddRow}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Row
          </Button>)}
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
                  Account <span className="text-red-500">*</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
                  Description <span className="text-red-500">*</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Chq/Rct#</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Currency</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">E.Rate</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Debit</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Credit</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
                  Debit <span className="text-red-500">*</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
                  Credit <span className="text-red-500">*</span>
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">CNIC</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK DATE</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-900 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {journalDetails.map((detail, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={detail.status}
                      onChange={(e) => handleDetailChange(index, 'status', e.target.checked)}
                      className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[200px]">
                    <SelectableTable
                      name={`account_${index}`}
                      value={detail.coaId || null}
                      onChange={(name, value) => handleDetailChange(index, 'coaId', value)}
                      options={allCoaAccounts.map(opt => ({
                        ...opt,
                        label: opt.label ? opt.label.slice(0, 15) : ''
                      }))}
                      placeholder="Select account"
                      displayKey="label"
                      columns={[
                        { key: 'acName', label: 'Name', width: '70%' }
                      ]}
                      required={true} // ✅ HTML required
                    />
                  </td>

                  {/* ✅ FIXED: Description with HTML required */}
                  <td className="px-3 py-3 min-w-[150px]">
                    <input
                      type="text"
                      value={detail.description}
                      onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                      placeholder="Description"
                      required // ✅ HTML required
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[100px]">
                    <input
                      type="text"
                      value={detail.recieptNo || ''}
                      onChange={(e) => handleDetailChange(index, 'recieptNo', e.target.value)}
                      placeholder="Rct#"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
                    />
                  </td>

                  {/* ✅ FIXED: Currency - Optional, no required */}
                  <td className="px-3 py-3 min-w-[120px]">
                    <SelectableTable
                      name={`currency_${index}`}
                      value={detail.currencyId || null}
                      onChange={(name, value) => handleDetailChange(index, 'currencyId', value)}
                      options={currencyOptions} // ✅ Only RMB, USD, Pkr (no "Select Currency")
                      placeholder="Currency"
                      displayKey="currencyName"
                      columns={[
                        { key: 'currencyName', label: 'Currency', width: '100%' }
                      ]}
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[100px]">
                    <input
                      type="text"
                      value={detail.rate === 0 ? '' : detail.rate}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        handleDetailChange(index, 'rate', value)
                      }}
                      placeholder="0.00"
                      min="0"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[120px]">
                    <input
                      type="text"
                      value={detail.ownDb || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        handleDetailChange(index, 'ownDb', value)
                      }}
                      placeholder="0.00"
                      min="0"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[120px]">
                    <input
                      type="text"
                      value={detail.ownCr || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        handleDetailChange(index, 'ownCr', value)
                      }}
                      placeholder="0.00"
                      min="0"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
                    />
                  </td>

                  {/* ✅ Note: Debit OR Credit required (handled by form validation) */}
                  <td className="px-3 py-3 min-w-[120px]">
                    <input
                      type="text"
                      value={detail.amountDb || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        handleDetailChange(index, 'amountDb', value)
                      }}
                      placeholder="0.00"
                      min="0"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[120px]">
                    <input
                      type="text"
                      value={detail.amountCr || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        handleDetailChange(index, 'amountCr', value)
                      }}
                      placeholder="0.00"
                      min="0"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[120px]">
                    <input
                      type="text"
                      value={detail.idCard || ''}
                      onChange={(e) => handleDetailChange(index, 'idCard', e.target.value)}
                      placeholder="ID Card"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[120px]">
                    <input
                      type="text"
                      value={detail.bank || ''}
                      onChange={(e) => handleDetailChange(index, 'bank', e.target.value)}
                      placeholder="Bank"
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  <td className="px-3 py-3 min-w-[140px]">
                    <input
                      type="date"
                      value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value || null
                        handleDetailChange(index, 'bankDate', dateValue)
                      }}
                      className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  <td className="px-2 py-3">
                    {journalDetails.length > 1 && (
                      <Button
                        variant="danger"
                        size="md"
                        onClick={() => onRemoveRow(index)}
                        icon={<Trash2 className="w-3 h-3" />}
                      >
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="border-[#dbeafe] rounded rounded-sm w-full">
              <tr>
                <td colSpan={8} className="px-3 py-3 text-right font-semibold text-gray-900">
                  Totals:
                </td>
                <td className="px-3 py-3 text-right font-semibold text-green-600">
                  {formatAmount(totals.debitTotal)}
                </td>
                <td className="px-3 py-3 text-right font-semibold text-blue-600">
                  {formatAmount(totals.creditTotal)}
                </td>
                <td colSpan={4} className="px-3 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${totals.difference === 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {totals.difference === 0 ? 'Balanced' : `Diff: ${formatAmount(totals.difference)}`}
                  </span>
                </td>
              </tr>

              {totals.difference > 0 && balancingCoaId && (
                <tr className="bg-blue-50">
                  <td colSpan={8} className="px-3 py-2 text-right text-sm text-blue-700">
                    Auto-balancing entry:
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
                    {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '0.00'}
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
                    {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '0.00'}
                  </td>
                  <td colSpan={4} className="px-3 py-2 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Auto</span>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VoucherDetails
