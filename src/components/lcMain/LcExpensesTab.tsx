// components/lc-main/LcExpensesTab.tsx

'use client'
import React from 'react'
import { Receipt, DollarSign } from 'lucide-react'

// =============================================
// TYPES
// =============================================

export interface ExpenseItem {
  id: number
  jmId: number
  lineId: number
  coaId: number
  description: string
  rate: string
  ownDb: string
  amountDb: number
  isCost: boolean
}

interface LcExpensesTabProps {
  items: ExpenseItem[]
  onItemChange: (index: number, field: string, value: string | boolean) => void
  disabled?: boolean
}

// =============================================
// COMPONENT
// =============================================

const LcExpensesTab: React.FC<LcExpensesTabProps> = ({
  items,
  onItemChange,
  disabled = false
}) => {

  // Calculate totals
  const totalOwnDb = items.reduce((sum, item) => sum + (parseFloat(item.ownDb) || 0), 0)
  const totalAmountDb = items.reduce((sum, item) => sum + (item.amountDb || 0), 0)
  const totalCostItems = items.filter(item => item.isCost).length

  const formatNumber = (num: number) =>
    num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // =============================================
  // EMPTY STATE
  // =============================================

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Expenses Found</p>
          <p className="text-sm mt-1">Select LC to load journal details</p>
        </div>
      </div>
    )
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[#509ee3]" />
            <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
            <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
              {items.length} item{items.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">
              Cost Items: <span className="font-semibold text-orange-600">{totalCostItems}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-12">#</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[250px]">Description</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">Rate</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Own Debit</th>
              <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Amount Db</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-20">Is Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {/* # */}
                <td className="px-3 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>

                {/* Description - Editable */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => onItemChange(index, 'description', e.target.value)}
                    disabled={disabled}
                    placeholder="Enter description..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
                  />
                </td>

                {/* Rate - Editable */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.rate}
                    onChange={(e) => onItemChange(index, 'rate', e.target.value)}
                    disabled={disabled}
                    placeholder="0.0000"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
                  />
                </td>

                {/* Own Debit - Editable */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.ownDb}
                    onChange={(e) => onItemChange(index, 'ownDb', e.target.value)}
                    disabled={disabled}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 border border-blue-300 bg-blue-50 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
                  />
                </td>

                {/* Amount Db - Read Only */}
                <td className="px-3 py-2 text-right">
                  <span className="text-sm font-medium text-red-500">
                    {formatNumber(item.amountDb)}
                  </span>
                </td>

                {/* Is Cost - Checkbox */}
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.isCost}
                    onChange={(e) => onItemChange(index, 'isCost', e.target.checked)}
                    disabled={disabled}
                    className="w-5 h-5 text-[#509ee3] border-gray-300 rounded focus:ring-[#509ee3] cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-3 py-3 text-right font-semibold text-gray-900">Totals:</td>
              <td className="px-3 py-3 text-right font-bold text-blue-600">{formatNumber(totalOwnDb)}</td>
              <td className="px-3 py-3 text-right font-bold text-red-500">{formatNumber(totalAmountDb)}</td>
              <td className="px-3 py-3 text-center font-semibold text-orange-600">{totalCostItems}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default LcExpensesTab
