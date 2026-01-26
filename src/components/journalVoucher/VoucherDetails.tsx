// // 'use client'
// // import React, { useState } from 'react'
// // import { Button } from '@/components/ui/Button'
// // import { Input } from '@/components/ui/Input'
// // import SelectableTable from '@/components/SelectableTable'
// // import { JournalDetail } from '@/types/journalVoucher'
// // import { formatAmount, formatDisplayDate } from '@/utils/formatters'


// // import { usePermissions } from '@/hooks/keycloack/usePermissions'

// // import {
// //   Plus,
// //   Trash2,
// //   Receipt,
// //   AlertCircle
// // } from 'lucide-react'

// // interface VoucherDetailsProps {
// //   journalDetails: JournalDetail[]
// //   allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
// //   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
// //   totals: { debitTotal: number; creditTotal: number; difference: number }
// //   balancingCoaId: number | null
// //   onDetailChange: (index: number, field: string, value: any) => void
// //   onAddRow: () => void
// //   onRemoveRow: (index: number) => void
// // }

// // const VoucherDetails: React.FC<VoucherDetailsProps> = ({
// //   journalDetails,
// //   allCoaAccounts,
// //   currencyOptions,
// //   totals,
// //   balancingCoaId,
// //   onDetailChange,
// //   onAddRow,
// //   onRemoveRow
// // }) => {
// //   const [isOpening, setIsOpening] = useState(false)
// //   const [isClosing, setIsClosing] = useState(false)


// //   const { hasPermission, userRoles } = usePermissions()
// //   const canRead = hasPermission('currency:read')
// //   const canWrite = hasPermission('currency:write')
// //   const canDelete = hasPermission('currency:delete')

// //   const handleDetailChange = (index: number, field: string, value: any) => {
// //     onDetailChange(index, field, value)

// //     if ((field === 'ownDb' || field === 'amountDb') && value > 0) {
// //       onDetailChange(index, 'ownCr', 0)
// //       onDetailChange(index, 'amountCr', 0)
// //     }

// //     if ((field === 'ownCr' || field === 'amountCr') && value > 0) {
// //       onDetailChange(index, 'ownDb', 0)
// //       onDetailChange(index, 'amountDb', 0)
// //     }
// //   }

// //   return (
// //     <div className="bg-white rounded-lg border border-gray-200 mb-6">
// //       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
// //         <div className="flex items-center">
// //           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
// //           <h2 className="text-lg font-semibold text-gray-900">Journal Details</h2>
// //           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
// //             {journalDetails.length} rows
// //           </span>
// //         </div>

// //         <div className="flex items-center space-x-4">
// //           {canWrite && (
// //           <Button
// //             variant="primary"
// //             size="sm"
// //             onClick={onAddRow}
// //             icon={<Plus className="w-4 h-4" />}
// //           >
// //             Add Row
// //           </Button>)}
// //         </div>
// //       </div>

// //       <div className="p-4">
// //         <div className="overflow-x-auto">
// //           <table className="w-full rounded-lg">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Status</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
// //                   Account <span className="text-red-500">*</span>
// //                 </th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
// //                   Description <span className="text-red-500">*</span>
// //                 </th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Chq/Rct#</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Currency</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">E.Rate</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Debit</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Credit</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
// //                   Debit <span className="text-red-500">*</span>
// //                 </th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
// //                   Credit <span className="text-red-500">*</span>
// //                 </th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">CNIC</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK</th>
// //                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK DATE</th>
// //                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-900 uppercase">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200">
// //               {journalDetails.map((detail, index) => (
// //                 <tr key={index} className="hover:bg-gray-50">
// //                   <td className="px-3 py-3">
// //                     <input
// //                       type="checkbox"
// //                       checked={detail.status}
// //                       onChange={(e) => handleDetailChange(index, 'status', e.target.checked)}
// //                       className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[200px]">
// //                     <SelectableTable
// //                       name={`account_${index}`}
// //                       value={detail.coaId || null}
// //                       onChange={(name, value) => handleDetailChange(index, 'coaId', value)}
// //                       options={allCoaAccounts.map(opt => ({
// //                         ...opt,
// //                         label: opt.label ? opt.label.slice(0, 15) : ''
// //                       }))}
// //                       placeholder="Select account"
// //                       displayKey="label"
// //                       columns={[
// //                         { key: 'acName', label: 'Name', width: '70%' }
// //                       ]}
// //                       required={true} // ✅ HTML required
// //                     />
// //                   </td>

// //                   {/* ✅ FIXED: Description with HTML required */}
// //                   <td className="px-3 py-3 min-w-[150px]">
// //                     <input
// //                       type="text"
// //                       value={detail.description}
// //                       onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
// //                       placeholder="Description"
// //                       required // ✅ HTML required
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[100px]">
// //                     <input
// //                       type="text"
// //                       value={detail.recieptNo || ''}
// //                       onChange={(e) => handleDetailChange(index, 'recieptNo', e.target.value)}
// //                       placeholder="Rct#"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
// //                     />
// //                   </td>

// //                   {/* ✅ FIXED: Currency - Optional, no required */}
// //                   <td className="px-3 py-3 min-w-[120px]">
// //                     <SelectableTable
// //                       name={`currency_${index}`}
// //                       value={detail.currencyId || null}
// //                       onChange={(name, value) => handleDetailChange(index, 'currencyId', value)}
// //                       options={currencyOptions} // ✅ Only RMB, USD, Pkr (no "Select Currency")
// //                       placeholder="Currency"
// //                       displayKey="currencyName"
// //                       columns={[
// //                         { key: 'currencyName', label: 'Currency', width: '100%' }
// //                       ]}
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[100px]">
// //                     <input
// //                       type="text"
// //                       value={detail.rate === 0 ? '' : detail.rate}
// //                       onChange={(e) => {
// //                         const value = parseFloat(e.target.value) || 0
// //                         handleDetailChange(index, 'rate', value)
// //                       }}
// //                       placeholder="0.00"
// //                       min="0"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[120px]">
// //                     <input
// //                       type="text"
// //                       value={detail.ownDb || ''}
// //                       onChange={(e) => {
// //                         const value = parseFloat(e.target.value) || 0
// //                         handleDetailChange(index, 'ownDb', value)
// //                       }}
// //                       placeholder="0.00"
// //                       min="0"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[120px]">
// //                     <input
// //                       type="text"
// //                       value={detail.ownCr || ''}
// //                       onChange={(e) => {
// //                         const value = parseFloat(e.target.value) || 0
// //                         handleDetailChange(index, 'ownCr', value)
// //                       }}
// //                       placeholder="0.00"
// //                       min="0"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
// //                     />
// //                   </td>

// //                   {/* ✅ Note: Debit OR Credit required (handled by form validation) */}
// //                   <td className="px-3 py-3 min-w-[120px]">
// //                     <input
// //                       type="text"
// //                       value={detail.amountDb || ''}
// //                       onChange={(e) => {
// //                         const value = parseFloat(e.target.value) || 0
// //                         handleDetailChange(index, 'amountDb', value)
// //                       }}
// //                       placeholder="0.00"
// //                       min="0"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[120px]">
// //                     <input
// //                       type="text"
// //                       value={detail.amountCr || ''}
// //                       onChange={(e) => {
// //                         const value = parseFloat(e.target.value) || 0
// //                         handleDetailChange(index, 'amountCr', value)
// //                       }}
// //                       placeholder="0.00"
// //                       min="0"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[120px]">
// //                     <input
// //                       type="text"
// //                       value={detail.idCard || ''}
// //                       onChange={(e) => handleDetailChange(index, 'idCard', e.target.value)}
// //                       placeholder="ID Card"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[120px]">
// //                     <input
// //                       type="text"
// //                       value={detail.bank || ''}
// //                       onChange={(e) => handleDetailChange(index, 'bank', e.target.value)}
// //                       placeholder="Bank"
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
// //                     />
// //                   </td>

// //                   <td className="px-3 py-3 min-w-[140px]">
// //                     <input
// //                       type="date"
// //                       value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
// //                       onChange={(e) => {
// //                         const dateValue = e.target.value || null
// //                         handleDetailChange(index, 'bankDate', dateValue)
// //                       }}
// //                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
// //                     />
// //                   </td>

// //                   <td className="px-2 py-3">
// //                     {journalDetails.length > 1 && (
// //                       <Button
// //                         variant="danger"
// //                         size="md"
// //                         onClick={() => onRemoveRow(index)}
// //                         icon={<Trash2 className="w-3 h-3" />}
// //                       >
// //                       </Button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>

// //             <tfoot className="border-[#dbeafe] rounded rounded-sm w-full">
// //               <tr>
// //                 <td colSpan={8} className="px-3 py-3 text-right font-semibold text-gray-900">
// //                   Totals:
// //                 </td>
// //                 <td className="px-3 py-3 text-right font-semibold text-green-600">
// //                   {formatAmount(totals.debitTotal)}
// //                 </td>
// //                 <td className="px-3 py-3 text-right font-semibold text-blue-600">
// //                   {formatAmount(totals.creditTotal)}
// //                 </td>
// //                 <td colSpan={4} className="px-3 py-3 text-center">
// //                   <span className={`px-2 py-1 rounded text-xs font-medium ${totals.difference === 0
// //                     ? 'bg-green-100 text-green-800'
// //                     : 'bg-red-100 text-red-800'
// //                     }`}>
// //                     {totals.difference === 0 ? 'Balanced' : `Diff: ${formatAmount(totals.difference)}`}
// //                   </span>
// //                 </td>
// //               </tr>

// //               {totals.difference > 0 && balancingCoaId && (
// //                 <tr className="bg-blue-50">
// //                   <td colSpan={8} className="px-3 py-2 text-right text-sm text-blue-700">
// //                     Auto-balancing entry:
// //                   </td>
// //                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
// //                     {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '0.00'}
// //                   </td>
// //                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
// //                     {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '0.00'}
// //                   </td>
// //                   <td colSpan={4} className="px-3 py-2 text-center">
// //                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Auto</span>
// //                   </td>
// //                 </tr>
// //               )}
// //             </tfoot>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default VoucherDetails

































































































// components/vouchers/VoucherDetails.tsx

'use client'
import React from 'react'
import { Button } from '@/components/ui/Button'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import SelectableTable from '@/components/SelectableTable'
import { formatAmount } from '@/utils/formatters'
import { usePermissions } from '@/hooks/keycloack/usePermissions'
import { Plus, Trash2, Receipt, Copy, AlertCircle, Lock } from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface JournalDetail {
  lineId: number
  coaId: number
  description: string
  recieptNo?: string
  currencyId?: number | null
  rate?: number
  ownDb?: number
  ownCr?: number
  amountDb: number
  amountCr: number
  idCard?: string
  bank?: string
  bankDate?: string | null
  status: boolean
  // Raw values for decimal input
  rate_raw?: string
  ownDb_raw?: string
  ownCr_raw?: string
  amountDb_raw?: string
  amountCr_raw?: string
  // Currency lock fields
  isCurrencyLocked?: boolean
  coaTypeId?: number | string
}

interface VoucherDetailsProps {
  voucherType: 'journal' | 'pettycash'
  journalDetails: JournalDetail[]
  currencyOptions: Array<{ id: number; label: string; currencyName: string }>
  totals: { debitTotal: number; creditTotal: number; difference: number }
  balancingCoaId: number | null
  duplicateReceipts: string[]
  onDetailChange: (index: number, field: string, value: any) => void
  onAddRow: () => void
  onRemoveRow: (index: number) => void
  onCloneRow: (index: number) => void
}

// =============================================
// COMPONENT
// =============================================

const VoucherDetails: React.FC<VoucherDetailsProps> = ({
  voucherType,
  journalDetails,
  currencyOptions,
  totals,
  balancingCoaId,
  duplicateReceipts = [],
  onDetailChange,
  onAddRow,
  onRemoveRow,
  onCloneRow
}) => {
  const { hasPermission } = usePermissions()
  const canWrite = hasPermission('voucher:write')

  // =============================================
  // DECIMAL INPUT HANDLER
  // =============================================

  const handleDecimalInput = (
    index: number,
    field: string,
    inputValue: string,
    maxDecimals: number = 2
  ) => {
    if (inputValue === '') {
      onDetailChange(index, field, 0)
      onDetailChange(index, `${field}_raw`, '')
      return
    }

    const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${maxDecimals}}$`)

    if (decimalRegex.test(inputValue)) {
      const numericValue = parseFloat(inputValue) || 0
      onDetailChange(index, field, numericValue)
      onDetailChange(index, `${field}_raw`, inputValue)
    }
  }

  // =============================================
  // GET DISPLAY VALUE FOR DECIMAL FIELDS
  // =============================================

  const getDecimalDisplayValue = (detail: JournalDetail, field: string): string => {
    const rawKey = `${field}_raw` as keyof JournalDetail
    const rawValue = detail[rawKey]

    if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
      return String(rawValue)
    }

    const value = detail[field as keyof JournalDetail]
    if (value === 0 || value === null || value === undefined) {
      return ''
    }
    return String(value)
  }

  // =============================================
  // COA SELECTION - AUTO-FILL CURRENCY FOR TYPE 7 (ONLY FOR JOURNAL/PETTYCASH)
  // =============================================

  const handleCoaSelect = (index: number, selectedId: string | number, selectedOption: any) => {
    console.log('📌 COA Selected:', selectedId)

    // Set COA ID
    onDetailChange(index, 'coaId', selectedId ? Number(selectedId) : 0)

    // ✅ Only auto-fill currency for Journal & Petty Cash vouchers
    if (voucherType === 'journal' || voucherType === 'pettycash') {
      const coaTypeId = selectedOption?.originalData?.coaTypeId
      const foreignCurrency = selectedOption?.originalData?.foreign_currency

      console.log('📌 COA Type ID:', coaTypeId)
      console.log('📌 Foreign Currency:', foreignCurrency)

      // If coaTypeId === 7 (Foreign Supplier) → auto-fill currencyId
      if (coaTypeId == 7) {
        const currencyValue = foreignCurrency ? Number(foreignCurrency) : null
        onDetailChange(index, 'currencyId', currencyValue)
        onDetailChange(index, 'isCurrencyLocked', true)
        console.log('✅ Auto-filled currencyId:', currencyValue, '(LOCKED)')
      } else {
        onDetailChange(index, 'isCurrencyLocked', false)
        console.log('✅ Currency field UNLOCKED')
      }

      onDetailChange(index, 'coaTypeId', coaTypeId)
    }
  }

  // =============================================
  // DEBIT CHANGE - CLEAR CREDIT WHEN DEBIT > 0
  // =============================================

  const handleAmountDbChange = (index: number, inputValue: string) => {
    handleDecimalInput(index, 'amountDb', inputValue, 2)

    const numericValue = parseFloat(inputValue) || 0

    // Only clear Credit fields if Debit has actual value
    if (numericValue > 0) {
      onDetailChange(index, 'amountCr', 0)
      onDetailChange(index, 'amountCr_raw', '')
      onDetailChange(index, 'ownCr', 0)
      onDetailChange(index, 'ownCr_raw', '')
    }
  }

  // =============================================
  // CREDIT CHANGE - CLEAR DEBIT WHEN CREDIT > 0
  // =============================================

  const handleAmountCrChange = (index: number, inputValue: string) => {
    handleDecimalInput(index, 'amountCr', inputValue, 2)

    const numericValue = parseFloat(inputValue) || 0

    // Only clear Debit fields if Credit has actual value
    if (numericValue > 0) {
      onDetailChange(index, 'amountDb', 0)
      onDetailChange(index, 'amountDb_raw', '')
      onDetailChange(index, 'ownDb', 0)
      onDetailChange(index, 'ownDb_raw', '')
    }
  }

  // =============================================
  // OWN DEBIT CHANGE
  // =============================================

  const handleOwnDbChange = (index: number, inputValue: string) => {
    handleDecimalInput(index, 'ownDb', inputValue, 2)

    const numericValue = parseFloat(inputValue) || 0

    if (numericValue > 0) {
      onDetailChange(index, 'ownCr', 0)
      onDetailChange(index, 'ownCr_raw', '')
    }
  }

  // =============================================
  // OWN CREDIT CHANGE
  // =============================================

  const handleOwnCrChange = (index: number, inputValue: string) => {
    handleDecimalInput(index, 'ownCr', inputValue, 2)

    const numericValue = parseFloat(inputValue) || 0

    if (numericValue > 0) {
      onDetailChange(index, 'ownDb', 0)
      onDetailChange(index, 'ownDb_raw', '')
    }
  }

  // =============================================
  // DISABLE CHECKS
  // =============================================

  // Debit is DISABLED only when Credit > 0
  const isAmountDbDisabled = (detail: JournalDetail): boolean => {
    const creditValue = parseFloat(String(detail.amountCr)) || 0
    return creditValue > 0
  }

  // Credit is DISABLED only when Debit > 0
  const isAmountCrDisabled = (detail: JournalDetail): boolean => {
    const debitValue = parseFloat(String(detail.amountDb)) || 0
    return debitValue > 0
  }

  // Own Debit is DISABLED when Credit path (amountCr > 0)
  const isOwnDbDisabled = (detail: JournalDetail): boolean => {
    const creditValue = parseFloat(String(detail.amountCr)) || 0
    return creditValue > 0
  }

  // Own Credit is DISABLED when Debit path (amountDb > 0)
  const isOwnCrDisabled = (detail: JournalDetail): boolean => {
    const debitValue = parseFloat(String(detail.amountDb)) || 0
    return debitValue > 0
  }

  // =============================================
  // CURRENCY LOCK CHECK - ONLY FOR JOURNAL/PETTYCASH
  // =============================================

  const isCurrencyLocked = (detail: JournalDetail): boolean => {
    if (voucherType !== 'journal' && voucherType !== 'pettycash') {
      return false
    }
    return detail.isCurrencyLocked === true || detail.coaTypeId == 7
  }

  // =============================================
  // DUPLICATE RECEIPT CHECK
  // =============================================

  const isReceiptDuplicate = (receiptNo: string | undefined): boolean => {
    return !!receiptNo && duplicateReceipts.includes(receiptNo)
  }

  // =============================================
  // GET CURRENCY NAME BY ID
  // =============================================

  const getCurrencyName = (currencyId: number | null | undefined): string => {
    if (!currencyId) return '-'
    const currency = currencyOptions.find(c => c.id === currencyId)
    return currency?.currencyName || currency?.label || '-'
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
          <h2 className="text-lg font-semibold text-gray-900">
            {voucherType === 'journal' ? 'Journal' : 'Petty Cash'} Details
          </h2>
          <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
            {journalDetails.length} row{journalDetails.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Add Row Button */}
        {/* {canWrite && ( */}
        <Button
          variant="primary"
          size="sm"
          onClick={onAddRow}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Row
        </Button>
        {/* )} */}
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10">#</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10"></th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">
                  Account <span className="text-red-500">*</span>
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">
                  Description <span className="text-red-500">*</span>
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">
                  Receipt #
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">Currency</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[80px]">E.Rate</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Own Dr</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Own Cr</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">
                  Debit <span className="text-red-500">*</span>
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">
                  Credit <span className="text-red-500">*</span>
                </th>

                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">CNIC</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Bank</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">Bank Date</th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {journalDetails.map((detail, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* Row Number */}
                  <td className="px-2  text-sm text-gray-500 font-medium">
                    {index + 1}
                  </td>

                  {/* Status */}
                  <td className="px-2">
                    <input
                      type="checkbox"
                      checked={detail.status}
                      onChange={(e) => onDetailChange(index, 'status', e.target.checked)}
                      className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
                    />
                  </td>

                  {/* Account */}
                  <td className="px-">
                    <CoaSearchableInput
                      value={detail.coaId || ''}
                      onChange={(selectedId, selectedOption) => handleCoaSelect(index, selectedId, selectedOption)}
                      placeholder="Select account"
                      showFilter={false}
                      clearable
                      size="sm"
                    />
                  </td>

                  {/* Description */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      value={detail.description || ''}
                      onChange={(e) => onDetailChange(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-1 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  {/* Receipt # */}
                  <td className="px-1 ">
                    <div className="relative">
                      <input
                        type="text"
                        value={detail.recieptNo || ''}
                        onChange={(e) => onDetailChange(index, 'recieptNo', e.target.value)}
                        placeholder="Receipt #"
                        className={`w-full px-1 h-9 py-1 pr-8 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${isReceiptDuplicate(detail.recieptNo)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                          }`}
                      />
                      {isReceiptDuplicate(detail.recieptNo) && (
                        <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>

                  {/* Currency - LOCKED for coaTypeId=7, EDITABLE for others */}
                  <td className="px-1 ">
                    {isCurrencyLocked(detail) ? (
                      <div className="px-1 h-9 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center justify-between">
                        <span>{getCurrencyName(detail.currencyId)}</span>
                        <Lock className="w-3 h-3 text-gray-400" title="Currency locked " />
                      </div>
                    ) : (
                      <SelectableTable
                        name={`currency_${index}`}
                        value={detail.currencyId || null}
                        onChange={(_, value) => onDetailChange(index, 'currencyId', value)}
                        options={currencyOptions}
                        placeholder="Select"
                        displayKey="currencyName"
                        columns={[{ key: 'currencyName', label: 'Currency', width: '100%' }]}
                      />
                    )}
                  </td>

                  {/* E.Rate */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDecimalDisplayValue(detail, 'rate')}
                      onChange={(e) => handleDecimalInput(index, 'rate', e.target.value, 4)}
                      placeholder="0.0000"
                      className="w-full px-1 h-9 py-1 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  {/* Own Debit - Disabled when amountCr > 0 */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDecimalDisplayValue(detail, 'ownDb')}
                      onChange={(e) => handleOwnDbChange(index, e.target.value)}
                      placeholder="0.00"
                      disabled={isOwnDbDisabled(detail)}
                      className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${isOwnDbDisabled(detail)
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300'
                        }`}
                    />
                  </td>

                  {/* Own Credit - Disabled when amountDb > 0 */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDecimalDisplayValue(detail, 'ownCr')}
                      onChange={(e) => handleOwnCrChange(index, e.target.value)}
                      placeholder="0.00"
                      disabled={isOwnCrDisabled(detail)}
                      className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${isOwnCrDisabled(detail)
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300'
                        }`}
                    />
                  </td>

                  {/* Debit - Disabled ONLY when Credit > 0 */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDecimalDisplayValue(detail, 'amountDb')}
                      onChange={(e) => handleAmountDbChange(index, e.target.value)}
                      placeholder="0.00"
                      disabled={isAmountDbDisabled(detail)}
                      className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-red-400 ${isAmountDbDisabled(detail)
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 border-red-300'
                        }`}
                    />
                  </td>

                  {/* Credit - Disabled ONLY when Debit > 0 */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDecimalDisplayValue(detail, 'amountCr')}
                      onChange={(e) => handleAmountCrChange(index, e.target.value)}
                      placeholder="0.00"
                      disabled={isAmountCrDisabled(detail)}
                      className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-green-400 ${isAmountCrDisabled(detail)
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-50 border-green-300'
                        }`}
                    />
                  </td>



                  {/* CNIC */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      value={detail.idCard || ''}
                      onChange={(e) => onDetailChange(index, 'idCard', e.target.value)}
                      placeholder="CNIC"
                      className="w-full px-1 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  {/* Bank */}
                  <td className="px-1 ">
                    <input
                      type="text"
                      value={detail.bank || ''}
                      onChange={(e) => onDetailChange(index, 'bank', e.target.value)}
                      placeholder="Bank"
                      className="w-full px-1 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  {/* Bank Date */}
                  <td className="px-1 ">
                    <input
                      type="date"
                      value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => onDetailChange(index, 'bankDate', e.target.value || null)}
                      className="w-full px-1 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                    />
                  </td>

                  {/* Actions - Clone + Delete */}
                  <td className="px-1 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {/* Clone Button */}
                      <button
                        type="button"
                        onClick={() => onCloneRow(index)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Clone row (reverse Debit/Credit, add R to receipt)"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete Button - Only if more than 1 row */}
                      {journalDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveRow(index)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Totals Footer */}
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={9} className="px-2 py-3 text-right font-semibold text-gray-900">
                  Totals:
                </td>
                <td className="px-2 py-3 text-right font-bold text-red-600 text-base">
                  {formatAmount(totals.debitTotal)}
                </td>
                <td className="px-2 py-3 text-right font-bold text-green-600 text-base">
                  {formatAmount(totals.creditTotal)}
                </td>
                <td colSpan={6} className="px-2 py-3 text-center">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${totals.difference === 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {totals.difference === 0 ? '✓ Balanced' : `Diff: ${formatAmount(totals.difference)}`}
                  </span>
                </td>
              </tr>

              {/* Auto-balance preview */}
              {totals.difference > 0 && balancingCoaId && (
                <tr className="bg-blue-50 border-t-2 border-blue-300">
                  <td colSpan={7} className="px-2 py-3 text-right text-sm text-blue-700 font-medium">
                    Auto-balancing entry will be added:
                  </td>
                  <td className="px-2 py-3 text-right text-sm font-bold text-blue-700">
                    {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '-'}
                  </td>
                  <td className="px-2 py-3 text-right text-sm font-bold text-blue-700">
                    {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '-'}
                  </td>
                  <td colSpan={6} className="px-2 py-3 text-center">
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-bold">
                      AUTO
                    </span>
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
