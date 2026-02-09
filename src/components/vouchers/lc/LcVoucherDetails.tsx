// // components/lc-voucher/LcVoucherDetails.tsx

// 'use client'
// import React, { useCallback } from 'react'
// import { Button } from '@/components/ui/Button'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import SelectableTable from '@/components/SelectableTable'
// import { formatAmount } from '@/utils/formatters'
// import { Plus, Receipt, Copy, Trash2, Lock } from 'lucide-react'

// // =============================================
// // TYPES
// // =============================================

// interface LcVoucherDetail {
//   lineId: number
//   coaId: number | null
//   description: string
//   recieptNo?: string
//   currencyId?: number | null
//   rate?: number
//   ownDb?: number
//   ownCr?: number
//   amountDb: number
//   amountCr: number
//   idCard?: string
//   bank?: string
//   bankDate?: string | null
//   status: boolean
//   isCost: boolean
//   isDb: boolean
//   rate_raw?: string
//   ownDb_raw?: string
//   ownCr_raw?: string
//   amountDb_raw?: string
//   amountCr_raw?: string
//   isCurrencyLocked?: boolean
//   coaTypeId?: number | string
// }

// interface LcVoucherDetailsProps {
//   details: LcVoucherDetail[]
//   headerCoaId: number | null
//   headerCoaName?: string
//   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
//   totals: { debitTotal: number; creditTotal: number; difference: number }
//   onDetailChange: (index: number, field: string, value: any) => void
//   onAddRow: () => void
//   onRemoveRow: (index: number) => void
//   onCloneRow: (index: number) => void
// }

// // =============================================
// // COMPONENT
// // =============================================

// const LcVoucherDetails: React.FC<LcVoucherDetailsProps> = ({
//   details = [],
//   headerCoaId,
//   headerCoaName = '',
//   currencyOptions = [],
//   totals = { debitTotal: 0, creditTotal: 0, difference: 0 },
//   onDetailChange,
//   onAddRow,
//   onRemoveRow,
//   onCloneRow
// }) => {

//   // =============================================
//   // ✅ CHECK IF ROW IS DEBIT TYPE
//   // Simple rule: coaId === headerCoaId → DEBIT
//   // =============================================

//   const isDebitType = (detail: LcVoucherDetail): boolean => {
//     return detail.coaId !== null && detail.coaId === headerCoaId
//   }

//   // =============================================
//   // DISPLAY VALUE
//   // =============================================

//   const getDecimalDisplayValue = (detail: LcVoucherDetail, field: string): string => {
//     const rawKey = `${field}_raw` as keyof LcVoucherDetail
//     const rawValue = detail[rawKey]

//     if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
//       return String(rawValue)
//     }

//     const value = detail[field as keyof LcVoucherDetail] as number
//     if (!value || value === 0) return ''
//     return String(value)
//   }

//   // =============================================
//   // FORMAT ON BLUR
//   // =============================================

//   const formatOnBlur = (index: number, field: string, decimals: number = 2) => {
//     return (e: React.FocusEvent<HTMLInputElement>) => {
//       const value = e.target.value

//       if (!value || value === '') {
//         onDetailChange(index, `${field}_raw`, '')
//         onDetailChange(index, field, 0)
//         return
//       }

//       const num = parseFloat(value.replace(/,/g, ''))

//       if (!isNaN(num) && num > 0) {
//         const fixedNum = parseFloat(num.toFixed(decimals))
//         onDetailChange(index, field, fixedNum)

//         const formatted = num.toLocaleString('en-US', {
//           minimumFractionDigits: decimals,
//           maximumFractionDigits: decimals
//         })
//         onDetailChange(index, `${field}_raw`, formatted)
//       } else {
//         onDetailChange(index, `${field}_raw`, '')
//         onDetailChange(index, field, 0)
//       }
//     }
//   }

//   // =============================================
//   // HANDLE INPUT
//   // =============================================

//   const handleAmountInput = (index: number, field: string, value: string) => {
//     const cleanValue = value.replace(/,/g, '').replace(/^0+(?=\d)/, '')
//     onDetailChange(index, `${field}_raw`, cleanValue)
//     onDetailChange(index, field, parseFloat(cleanValue) || 0)
//   }

//   // =============================================
//   // ✅ DEBIT CHANGE - Auto set header COA
//   // =============================================

//   const handleAmountDbChange = useCallback((index: number, inputValue: string) => {
//     handleAmountInput(index, 'amountDb', inputValue)

//     const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
//     if (numericValue > 0) {
//       // Auto-populate header COA for debit
//       if (headerCoaId) {
//         onDetailChange(index, 'coaId', headerCoaId)
//       }
//       // Clear credit values
//       onDetailChange(index, 'amountCr', 0)
//       onDetailChange(index, 'amountCr_raw', '')
//       onDetailChange(index, 'ownCr', 0)
//       onDetailChange(index, 'ownCr_raw', '')
//     }
//   }, [headerCoaId, onDetailChange])

//   // =============================================
//   // ✅ CREDIT CHANGE - Set isCost to false
//   // =============================================

//   const handleAmountCrChange = useCallback((index: number, inputValue: string) => {
//     handleAmountInput(index, 'amountCr', inputValue)

//     const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
//     if (numericValue > 0) {
//       // Clear debit values
//       onDetailChange(index, 'amountDb', 0)
//       onDetailChange(index, 'amountDb_raw', '')
//       onDetailChange(index, 'ownDb', 0)
//       onDetailChange(index, 'ownDb_raw', '')
//       // Set isCost to false for credit
//       onDetailChange(index, 'isCost', false)
//     }
//   }, [onDetailChange])

//   // =============================================
//   // OWN DEBIT CHANGE
//   // =============================================

//   const handleOwnDbChange = useCallback((index: number, inputValue: string) => {
//     handleAmountInput(index, 'ownDb', inputValue)

//     const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
//     if (numericValue > 0) {
//       onDetailChange(index, 'ownCr', 0)
//       onDetailChange(index, 'ownCr_raw', '')
//     }
//   }, [onDetailChange])

//   // =============================================
//   // OWN CREDIT CHANGE
//   // =============================================

//   const handleOwnCrChange = useCallback((index: number, inputValue: string) => {
//     handleAmountInput(index, 'ownCr', inputValue)

//     const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
//     if (numericValue > 0) {
//       onDetailChange(index, 'ownDb', 0)
//       onDetailChange(index, 'ownDb_raw', '')
//     }
//   }, [onDetailChange])

//   // =============================================
//   // RATE CHANGE
//   // =============================================

//   const handleRateChange = useCallback((index: number, inputValue: string) => {
//     const cleanValue = inputValue.replace(/,/g, '').replace(/^0+(?=\d)/, '')
//     onDetailChange(index, 'rate_raw', inputValue)
//     onDetailChange(index, 'rate', parseFloat(cleanValue) || 0)
//   }, [onDetailChange])

//   // =============================================
//   // ✅ COA SELECTION - Determines Debit/Credit type
//   // =============================================

//   const handleCoaSelect = useCallback((index: number, selectedId: string | number, selectedOption: any) => {
//     const numericId = selectedId ? Number(selectedId) : null
//     onDetailChange(index, 'coaId', numericId)

//     // ✅ If user selects header COA → DEBIT type
//     if (numericId === headerCoaId) {
//       // Clear credit values
//       onDetailChange(index, 'amountCr', 0)
//       onDetailChange(index, 'amountCr_raw', '')
//       onDetailChange(index, 'ownCr', 0)
//       onDetailChange(index, 'ownCr_raw', '')
//     } 
//     // ✅ If user selects other COA → CREDIT type
//     else if (numericId && numericId !== headerCoaId) {
//       // Clear debit values
//       onDetailChange(index, 'amountDb', 0)
//       onDetailChange(index, 'amountDb_raw', '')
//       onDetailChange(index, 'ownDb', 0)
//       onDetailChange(index, 'ownDb_raw', '')
//       // Set isCost to false
//       onDetailChange(index, 'isCost', false)
//     }

//     // Handle currency lock
//     const coaTypeId = selectedOption?.originalData?.coaTypeId
//     const foreignCurrency = selectedOption?.originalData?.foreign_currency

//     if (coaTypeId == 7) {
//       onDetailChange(index, 'currencyId', foreignCurrency ? Number(foreignCurrency) : null)
//       onDetailChange(index, 'isCurrencyLocked', true)
//     } else {
//       onDetailChange(index, 'isCurrencyLocked', false)
//     }
//     onDetailChange(index, 'coaTypeId', coaTypeId)
//   }, [headerCoaId, onDetailChange])

//   // =============================================
//   // DISABLE CHECKS
//   // =============================================

//   const isRowLocked = (detail: LcVoucherDetail): boolean => {
//     return detail.status === true
//   }

//   // ✅ Debit disabled if: Row locked OR NOT debit type (coaId !== headerCoaId)
//   const isAmountDbDisabled = (detail: LcVoucherDetail): boolean => {
//     if (isRowLocked(detail)) return true
//     // If COA is selected and it's NOT header COA → Disable debit
//     if (detail.coaId && detail.coaId !== headerCoaId) return true
//     return false
//   }

//   // ✅ Credit disabled if: Row locked OR IS debit type (coaId === headerCoaId)
//   const isAmountCrDisabled = (detail: LcVoucherDetail): boolean => {
//     if (isRowLocked(detail)) return true
//     // If COA is header COA → Disable credit
//     if (detail.coaId === headerCoaId) return true
//     return false
//   }

//   // ✅ Own Debit disabled same as Debit
//   const isOwnDbDisabled = (detail: LcVoucherDetail): boolean => {
//     return isAmountDbDisabled(detail)
//   }

//   // ✅ Own Credit disabled same as Credit
//   const isOwnCrDisabled = (detail: LcVoucherDetail): boolean => {
//     return isAmountCrDisabled(detail)
//   }

//   // Status checkbox disabled until required fields filled
//   const isStatusDisabled = (detail: LcVoucherDetail): boolean => {
//     const hasAccount = detail.coaId && detail.coaId > 0
//     const hasDescription = detail.description && detail.description.trim() !== ''
//     const hasAmount = (parseFloat(String(detail.amountDb)) || 0) > 0 ||
//       (parseFloat(String(detail.amountCr)) || 0) > 0

//     return !(hasAccount && hasDescription && hasAmount)
//   }

//   // ✅ isCost disabled for Credit type (coaId !== headerCoaId) or locked rows
//   const isIsCostDisabled = (detail: LcVoucherDetail): boolean => {
//     if (isRowLocked(detail)) return true
//     // If COA is NOT header COA → Credit type → isCost disabled
//     if (detail.coaId && detail.coaId !== headerCoaId) return true
//     return false
//   }

//   // =============================================
//   // CURRENCY HELPERS
//   // =============================================

//   const isCurrencyLocked = (detail: LcVoucherDetail): boolean => {
//     return detail.isCurrencyLocked === true || detail.coaTypeId == 7
//   }

//   const getCurrencyName = (currencyId: number | null | undefined): string => {
//     if (!currencyId) return '-'
//     const currency = currencyOptions.find(c => c.id === currencyId)
//     return currency?.currencyName || currency?.label || '-'
//   }

//   // =============================================
//   // ROW CLASS
//   // =============================================

//   const getRowClassName = (detail: LcVoucherDetail): string => {
//     if (isRowLocked(detail)) {
//       return 'bg-gray-100'
//     }
//     // ✅ Color based on type
//     if (isDebitType(detail)) {
//       return 'bg-red-50/30 hover:bg-red-50/50'
//     }
//     if (detail.coaId && detail.coaId !== headerCoaId) {
//       return 'bg-green-50/30 hover:bg-green-50/50'
//     }
//     return 'hover:bg-gray-50'
//   }

//   // =============================================
//   // RENDER - NO DETAILS
//   // =============================================

//   if (details.length === 0) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
//         <div className="text-center text-gray-500">
//           <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium">No Details</p>
//           <p className="text-sm mt-1">Select a Balance Account and click "Get Template" to load details</p>
//         </div>
//       </div>
//     )
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 mb-6">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center">
//           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//           <h2 className="text-lg font-semibold text-gray-900">LC Voucher Details</h2>
//           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//             {details.length} row{details.length > 1 ? 's' : ''}
//           </span>
//         </div>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={(e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             onAddRow()
//           }}
//           icon={<Plus className="w-4 h-4" />}
//         >
//           Add Row
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="p-4">
//         <div className="overflow-x-auto overflow-y-hidden">
//           <table className="w-full rounded-lg">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10">#</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10"></th>
//                 {/* ✅ Cost moved next to Status */}
//                 <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-16">Cost</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">
//                   Account <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">
//                   Description <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Receipt #</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">Currency</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[80px]">E.Rate</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Own Dr</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Own Cr</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">
//                   Debit <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">
//                   Credit <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">CNIC</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Bank</th>
//                 <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">Bank Date</th>
//                 <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-24">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {details.map((detail, index) => (
//                 <tr key={index} className={getRowClassName(detail)}>
//                   {/* Row Number */}
//                   <td className="px-2 text-sm text-gray-500 font-medium">{index + 1}</td>

//                   {/* Status Checkbox */}
//                   <td className="px-2">
//                     <input
//                       type="checkbox"
//                       checked={detail.status}
//                       onChange={(e) => onDetailChange(index, 'status', e.target.checked)}
//                       disabled={isStatusDisabled(detail)}
//                       title={isStatusDisabled(detail) ? 'Fill required fields first' : 'Mark as complete'}
//                       className={`h-4 w-4 border-gray-300 rounded ${isStatusDisabled(detail)
//                         ? 'text-gray-300 cursor-not-allowed'
//                         : 'text-[#509ee3] focus:ring-[#509ee3] cursor-pointer'
//                       }`}
//                     />
//                   </td>

//                   {/* ✅ isCost Checkbox - Moved next to Status */}
//                   <td className="px-2 text-center">
//                     <input
//                       type="checkbox"
//                       checked={detail.isCost}
//                       onChange={(e) => onDetailChange(index, 'isCost', e.target.checked)}
//                       disabled={isIsCostDisabled(detail)}
//                       title={
//                         isIsCostDisabled(detail)
//                           ? isRowLocked(detail)
//                             ? 'Row is locked'
//                             : 'Cost is always false for Credit'
//                           : 'Toggle cost'
//                       }
//                       className={`h-4 w-4 border-gray-300 rounded ${
//                         isIsCostDisabled(detail)
//                           ? 'text-gray-300 cursor-not-allowed'
//                           : 'text-green-600 focus:ring-green-500 cursor-pointer'
//                       }`}
//                     />
//                   </td>

//                   {/* Account */}
//                   <td className="px-1">
//                     <CoaSearchableInput
//                       orderType="simple"
//                       value={detail.coaId || ''}
//                       onChange={(selectedId, selectedOption) => handleCoaSelect(index, selectedId, selectedOption)}
//                       placeholder="Select account..."
//                       clearable
//                       size="sm"
//                       showFilter={false}
//                       disabled={isRowLocked(detail)}
//                     />
//                     {/* Show type indicator */}
//                     {detail.coaId && (
//                       <span className={`text-xs mt-1 inline-block px-1.5 py-0.5 rounded ${
//                         isDebitType(detail) 
//                           ? 'bg-red-100 text-red-700' 
//                           : 'bg-green-100 text-green-700'
//                       }`}>
//                         {isDebitType(detail) ? 'Dr' : 'Cr'}
//                       </span>
//                     )}
//                   </td>

//                   {/* Description */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       value={detail.description || ''}
//                       onChange={(e) => onDetailChange(index, 'description', e.target.value)}
//                       placeholder="Description"
//                       disabled={isRowLocked(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isRowLocked(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* Receipt # */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       value={detail.recieptNo || ''}
//                       onChange={(e) => onDetailChange(index, 'recieptNo', e.target.value)}
//                       placeholder="Receipt #"
//                       disabled={isRowLocked(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isRowLocked(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* Currency */}
//                   <td className="px-1">
//                     {isCurrencyLocked(detail) || isRowLocked(detail) ? (
//                       <div className={`px-1 h-9 py-2 border rounded-lg text-sm flex items-center justify-between ${
//                         isRowLocked(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-500'
//                           : 'bg-gray-100 border-gray-200 text-gray-600'
//                       }`}>
//                         <span>{getCurrencyName(detail.currencyId)}</span>
//                         <Lock className="w-3 h-3 text-gray-400" />
//                       </div>
//                     ) : (
//                       <SelectableTable
//                         name={`currency_${index}`}
//                         value={detail.currencyId || null}
//                         onChange={(_, value) => onDetailChange(index, 'currencyId', value)}
//                         options={currencyOptions}
//                         placeholder="Select"
//                         displayKey="currencyName"
//                         columns={[{ key: 'currencyName', label: 'Currency', width: '100%' }]}
//                       />
//                     )}
//                   </td>

//                   {/* E.Rate - 4 decimals */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       inputMode="decimal"
//                       value={getDecimalDisplayValue(detail, 'rate')}
//                       onChange={(e) => handleRateChange(index, e.target.value)}
//                       onBlur={formatOnBlur(index, 'rate', 4)}
//                       placeholder="0.0000"
//                       disabled={isRowLocked(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isRowLocked(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* ✅ Own Debit - Enabled only for Debit type */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       inputMode="decimal"
//                       value={getDecimalDisplayValue(detail, 'ownDb')}
//                       onChange={(e) => handleOwnDbChange(index, e.target.value)}
//                       onBlur={formatOnBlur(index, 'ownDb', 2)}
//                       placeholder="0.00"
//                       disabled={isOwnDbDisabled(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isOwnDbDisabled(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* ✅ Own Credit - Enabled only for Credit type */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       inputMode="decimal"
//                       value={getDecimalDisplayValue(detail, 'ownCr')}
//                       onChange={(e) => handleOwnCrChange(index, e.target.value)}
//                       onBlur={formatOnBlur(index, 'ownCr', 2)}
//                       placeholder="0.00"
//                       disabled={isOwnCrDisabled(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isOwnCrDisabled(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* ✅ Debit - Enabled only for Debit type (coaId === headerCoaId) */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       inputMode="decimal"
//                       value={getDecimalDisplayValue(detail, 'amountDb')}
//                       onChange={(e) => handleAmountDbChange(index, e.target.value)}
//                       onBlur={formatOnBlur(index, 'amountDb', 2)}
//                       placeholder="0.00"
//                       disabled={isAmountDbDisabled(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-red-400 ${
//                         isAmountDbDisabled(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
//                           : 'bg-red-50 border-red-300'
//                       }`}
//                     />
//                   </td>

//                   {/* ✅ Credit - Enabled only for Credit type (coaId !== headerCoaId) */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       inputMode="decimal"
//                       value={getDecimalDisplayValue(detail, 'amountCr')}
//                       onChange={(e) => handleAmountCrChange(index, e.target.value)}
//                       onBlur={formatOnBlur(index, 'amountCr', 2)}
//                       placeholder="0.00"
//                       disabled={isAmountCrDisabled(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-green-400 ${
//                         isAmountCrDisabled(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
//                           : 'bg-green-50 border-green-300'
//                       }`}
//                     />
//                   </td>

//                   {/* CNIC */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       value={detail.idCard || ''}
//                       onChange={(e) => onDetailChange(index, 'idCard', e.target.value)}
//                       placeholder="CNIC"
//                       disabled={isRowLocked(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isRowLocked(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* Bank */}
//                   <td className="px-1">
//                     <input
//                       type="text"
//                       value={detail.bank || ''}
//                       onChange={(e) => onDetailChange(index, 'bank', e.target.value)}
//                       placeholder="Bank"
//                       disabled={isRowLocked(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isRowLocked(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* Bank Date */}
//                   <td className="px-1">
//                     <input
//                       type="date"
//                       value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => onDetailChange(index, 'bankDate', e.target.value || null)}
//                       disabled={isRowLocked(detail)}
//                       className={`w-full px-1 h-9 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
//                         isRowLocked(detail)
//                           ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
//                           : 'border-gray-300'
//                       }`}
//                     />
//                   </td>

//                   {/* Actions */}
//                   <td className="px-1 py-3">
//                     <div className="flex items-center justify-center gap-1">
//                       <button
//                         type="button"
//                         onClick={() => onCloneRow(index)}
//                         disabled={isRowLocked(detail)}
//                         className={`p-1.5 rounded-lg transition-colors ${
//                           isRowLocked(detail)
//                             ? 'text-gray-300 cursor-not-allowed'
//                             : 'text-blue-600 hover:bg-blue-100'
//                         }`}
//                         title="Clone row"
//                       >
//                         <Copy className="w-4 h-4" />
//                       </button>
//                       {details.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => onRemoveRow(index)}
//                           disabled={isRowLocked(detail)}
//                           className={`p-1.5 rounded-lg transition-colors ${
//                             isRowLocked(detail)
//                               ? 'text-gray-300 cursor-not-allowed'
//                               : 'text-red-600 hover:bg-red-100'
//                           }`}
//                           title="Delete row"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//             {/* Totals Footer */}
//             <tfoot className="bg-gray-50">
//               <tr>
//                 <td colSpan={10} className="px-2 py-3 text-right font-semibold text-gray-900">Totals:</td>
//                 <td className="px-2 py-3 text-right font-bold text-red-600 text-base">{formatAmount(totals.debitTotal)}</td>
//                 <td className="px-2 py-3 text-right font-bold text-green-600 text-base">{formatAmount(totals.creditTotal)}</td>
//                 <td colSpan={4} className="px-2 py-3 text-center">
//                   <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
//                     totals.difference === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {totals.difference === 0 ? '✓ Balanced' : `Diff: ${formatAmount(totals.difference)}`}
//                   </span>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LcVoucherDetails












































// components/lc-voucher/LcVoucherDetails.tsx

'use client'
import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { CurrencySearchableInput } from '@/components/common/SearchableInput/CurrencySearchableInput'
import { formatAmount } from '@/utils/formatters'
import { Plus, Receipt, Copy, Trash2, Lock } from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface LcVoucherDetail {
  lineId: number
  coaId: number | null
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
  isCost: boolean
  isDb: boolean
  rate_raw?: string
  ownDb_raw?: string
  ownCr_raw?: string
  amountDb_raw?: string
  amountCr_raw?: string
  isCurrencyLocked?: boolean
  coaTypeId?: number | string
}

interface LcVoucherDetailsProps {
  details: LcVoucherDetail[]
  headerCoaId: number | null
  headerCoaName?: string
  totals: { debitTotal: number; creditTotal: number; difference: number }
  onDetailChange: (index: number, field: string, value: any) => void
  onAddRow: () => void
  onRemoveRow: (index: number) => void
  onCloneRow: (index: number) => void
}

// =============================================
// COMPONENT
// =============================================

const LcVoucherDetails: React.FC<LcVoucherDetailsProps> = ({
  details = [],
  headerCoaId,
  headerCoaName = '',
  totals = { debitTotal: 0, creditTotal: 0, difference: 0 },
  onDetailChange,
  onAddRow,
  onRemoveRow,
  onCloneRow
}) => {

  // =============================================
  // ✅ TRACK FOCUSED FIELD
  // =============================================
  
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // =============================================
  // ✅ CHECK IF ROW IS DEBIT TYPE
  // =============================================

  const isDebitType = (detail: LcVoucherDetail): boolean => {
    return detail.coaId !== null && detail.coaId === headerCoaId
  }

  // =============================================
  // ✅ DISPLAY VALUE - Shows formatted when not focused
  // =============================================

  const getDisplayValue = (detail: LcVoucherDetail, field: string, index: number, decimals: number = 2): string => {
    const fieldKey = `${index}_${field}`
    const value = detail[field as keyof LcVoucherDetail] as number
    const rawKey = `${field}_raw` as keyof LcVoucherDetail
    const rawValue = detail[rawKey] as string

    // If this field is focused, show raw value for editing
    if (focusedField === fieldKey) {
      if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
        return String(rawValue)
      }
      if (!value || value === 0) return ''
      return String(value)
    }

    // Not focused - show formatted value
    if (!value || value === 0) return ''
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  // =============================================
  // ✅ HANDLE FOCUS
  // =============================================

  const handleFocus = (index: number, field: string) => {
    setFocusedField(`${index}_${field}`)
  }

  // =============================================
  // ✅ HANDLE BLUR - Format and clear focus
  // =============================================

  const handleBlur = (index: number, field: string, decimals: number = 2) => {
    return (e: React.FocusEvent<HTMLInputElement>) => {
      setFocusedField(null)
      
      const value = e.target.value

      if (!value || value === '') {
        onDetailChange(index, `${field}_raw`, '')
        onDetailChange(index, field, 0)
        return
      }

      const num = parseFloat(value.replace(/,/g, ''))

      if (!isNaN(num) && num > 0) {
        const fixedNum = parseFloat(num.toFixed(decimals))
        onDetailChange(index, field, fixedNum)
        onDetailChange(index, `${field}_raw`, String(fixedNum))
      } else {
        onDetailChange(index, `${field}_raw`, '')
        onDetailChange(index, field, 0)
      }
    }
  }

  // =============================================
  // HANDLE INPUT
  // =============================================

  const handleAmountInput = (index: number, field: string, value: string) => {
    const cleanValue = value.replace(/,/g, '').replace(/^0+(?=\d)/, '')
    onDetailChange(index, `${field}_raw`, cleanValue)
    onDetailChange(index, field, parseFloat(cleanValue) || 0)
  }

  // =============================================
  // ✅ DEBIT CHANGE - Auto set header COA
  // =============================================

  const handleAmountDbChange = useCallback((index: number, inputValue: string) => {
    handleAmountInput(index, 'amountDb', inputValue)

    const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
    if (numericValue > 0) {
      if (headerCoaId) {
        onDetailChange(index, 'coaId', headerCoaId)
      }
      onDetailChange(index, 'amountCr', 0)
      onDetailChange(index, 'amountCr_raw', '')
      onDetailChange(index, 'ownCr', 0)
      onDetailChange(index, 'ownCr_raw', '')
    }
  }, [headerCoaId, onDetailChange])

  // =============================================
  // ✅ CREDIT CHANGE - Set isCost to false
  // =============================================

  const handleAmountCrChange = useCallback((index: number, inputValue: string) => {
    handleAmountInput(index, 'amountCr', inputValue)

    const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
    if (numericValue > 0) {
      onDetailChange(index, 'amountDb', 0)
      onDetailChange(index, 'amountDb_raw', '')
      onDetailChange(index, 'ownDb', 0)
      onDetailChange(index, 'ownDb_raw', '')
      onDetailChange(index, 'isCost', false)
    }
  }, [onDetailChange])

  // =============================================
  // OWN DEBIT CHANGE
  // =============================================

  const handleOwnDbChange = useCallback((index: number, inputValue: string) => {
    handleAmountInput(index, 'ownDb', inputValue)

    const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
    if (numericValue > 0) {
      onDetailChange(index, 'ownCr', 0)
      onDetailChange(index, 'ownCr_raw', '')
    }
  }, [onDetailChange])

  // =============================================
  // OWN CREDIT CHANGE
  // =============================================

  const handleOwnCrChange = useCallback((index: number, inputValue: string) => {
    handleAmountInput(index, 'ownCr', inputValue)

    const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0
    if (numericValue > 0) {
      onDetailChange(index, 'ownDb', 0)
      onDetailChange(index, 'ownDb_raw', '')
    }
  }, [onDetailChange])

  // =============================================
  // RATE CHANGE
  // =============================================

  const handleRateChange = useCallback((index: number, inputValue: string) => {
    const cleanValue = inputValue.replace(/,/g, '').replace(/^0+(?=\d)/, '')
    onDetailChange(index, 'rate_raw', cleanValue)
    onDetailChange(index, 'rate', parseFloat(cleanValue) || 0)
  }, [onDetailChange])

  // =============================================
  // ✅ COA SELECTION - Determines Debit/Credit type
  // =============================================

  const handleCoaSelect = useCallback((index: number, selectedId: string | number, selectedOption: any) => {
    const numericId = selectedId ? Number(selectedId) : null
    onDetailChange(index, 'coaId', numericId)

    if (numericId === headerCoaId) {
      onDetailChange(index, 'amountCr', 0)
      onDetailChange(index, 'amountCr_raw', '')
      onDetailChange(index, 'ownCr', 0)
      onDetailChange(index, 'ownCr_raw', '')
    } else if (numericId && numericId !== headerCoaId) {
      onDetailChange(index, 'amountDb', 0)
      onDetailChange(index, 'amountDb_raw', '')
      onDetailChange(index, 'ownDb', 0)
      onDetailChange(index, 'ownDb_raw', '')
      onDetailChange(index, 'isCost', false)
    }

    const coaTypeId = selectedOption?.originalData?.coaTypeId
    const foreignCurrency = selectedOption?.originalData?.foreign_currency

    if (coaTypeId == 7) {
      onDetailChange(index, 'currencyId', foreignCurrency ? Number(foreignCurrency) : null)
      onDetailChange(index, 'isCurrencyLocked', true)
    } else {
      onDetailChange(index, 'isCurrencyLocked', false)
    }
    onDetailChange(index, 'coaTypeId', coaTypeId)
  }, [headerCoaId, onDetailChange])

  // =============================================
  // ✅ CURRENCY SELECTION
  // =============================================

  const handleCurrencySelect = useCallback((index: number, currencyId: number | null) => {
    onDetailChange(index, 'currencyId', currencyId)
  }, [onDetailChange])

  // =============================================
  // DISABLE CHECKS
  // =============================================

  const isRowLocked = (detail: LcVoucherDetail): boolean => {
    return detail.status === true
  }

  const isAmountDbDisabled = (detail: LcVoucherDetail): boolean => {
    if (isRowLocked(detail)) return true
    if (detail.coaId && detail.coaId !== headerCoaId) return true
    return false
  }

  const isAmountCrDisabled = (detail: LcVoucherDetail): boolean => {
    if (isRowLocked(detail)) return true
    if (detail.coaId === headerCoaId) return true
    return false
  }

  const isOwnDbDisabled = (detail: LcVoucherDetail): boolean => {
    return isAmountDbDisabled(detail)
  }

  const isOwnCrDisabled = (detail: LcVoucherDetail): boolean => {
    return isAmountCrDisabled(detail)
  }

  const isStatusDisabled = (detail: LcVoucherDetail): boolean => {
    const hasAccount = detail.coaId && detail.coaId > 0
    const hasDescription = detail.description && detail.description.trim() !== ''
    const hasAmount = (parseFloat(String(detail.amountDb)) || 0) > 0 ||
      (parseFloat(String(detail.amountCr)) || 0) > 0

    return !(hasAccount && hasDescription && hasAmount)
  }

  const isIsCostDisabled = (detail: LcVoucherDetail): boolean => {
    if (isRowLocked(detail)) return true
    if (detail.coaId && detail.coaId !== headerCoaId) return true
    return false
  }

  // =============================================
  // CURRENCY HELPERS
  // =============================================

  const isCurrencyLocked = (detail: LcVoucherDetail): boolean => {
    return detail.isCurrencyLocked === true || detail.coaTypeId == 7
  }

  // =============================================
  // ROW CLASS
  // =============================================

  const getRowClassName = (detail: LcVoucherDetail): string => {
    if (isRowLocked(detail)) {
      return 'bg-gray-100'
    }
    if (isDebitType(detail)) {
      return 'bg-red-50/30 hover:bg-red-50/50'
    }
    if (detail.coaId && detail.coaId !== headerCoaId) {
      return 'bg-green-50/30 hover:bg-green-50/50'
    }
    return 'hover:bg-gray-50'
  }

  // =============================================
  // RENDER - NO DETAILS
  // =============================================

  if (details.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="text-center text-gray-500">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Details</p>
          <p className="text-sm mt-1">Select a Balance Account and click "Get Template" to load details</p>
        </div>
      </div>
    )
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
          <h2 className="text-lg font-semibold text-gray-900">LC Voucher Details</h2>
          <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
            {details.length} row{details.length > 1 ? 's' : ''}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAddRow()
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Row
        </Button>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10">#</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10"></th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-16">Cost</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[200px]">
                  Account <span className="text-red-500">*</span>
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">
                  Description <span className="text-red-500">*</span>
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Receipt #</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[140px]">Currency</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[80px]">E.Rate</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Own Dr</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Own Cr</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[110px]">
                  Debit <span className="text-red-500">*</span>
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[110px]">
                  Credit <span className="text-red-500">*</span>
                </th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">CNIC</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Bank</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">Bank Date</th>
                <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {details.map((detail, index) => (
                <tr key={index} className={getRowClassName(detail)}>
                  {/* Row Number */}
                  <td className="px-2 text-sm text-gray-500 font-medium">{index + 1}</td>

                  {/* Status Checkbox */}
                  <td className="px-2">
                    <input
                      type="checkbox"
                      checked={detail.status}
                      onChange={(e) => onDetailChange(index, 'status', e.target.checked)}
                      disabled={isStatusDisabled(detail)}
                      title={isStatusDisabled(detail) ? 'Fill required fields first' : 'Mark as complete'}
                      className={`h-4 w-4 border-gray-300 rounded ${isStatusDisabled(detail)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#509ee3] focus:ring-[#509ee3] cursor-pointer'
                      }`}
                    />
                  </td>

                  {/* isCost Checkbox */}
                  <td className="px-2 text-center">
                    <input
                      type="checkbox"
                      checked={detail.isCost}
                      onChange={(e) => onDetailChange(index, 'isCost', e.target.checked)}
                      disabled={isIsCostDisabled(detail)}
                      title={
                        isIsCostDisabled(detail)
                          ? isRowLocked(detail)
                            ? 'Row is locked'
                            : 'Cost is always false for Credit'
                          : 'Toggle cost'
                      }
                      className={`h-4 w-4 border-gray-300 rounded ${
                        isIsCostDisabled(detail)
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-green-600 focus:ring-green-500 cursor-pointer'
                      }`}
                    />
                  </td>

                  {/* Account */}
                  <td className="px-1">
                    <CoaSearchableInput
                      orderType="simple"
                      value={detail.coaId || ''}
                      onChange={(selectedId, selectedOption) => handleCoaSelect(index, selectedId, selectedOption)}
                      placeholder="Select account..."
                      clearable
                      size="sm"
                      showFilter={false}
                      disabled={isRowLocked(detail)}
                    />
                    {detail.coaId && (
                      <span className={`text-xs mt-1 inline-block px-1.5 py-0.5 rounded ${
                        isDebitType(detail) 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {isDebitType(detail) ? 'Dr' : 'Cr'}
                      </span>
                    )}
                  </td>

                  {/* Description */}
                  <td className="px-1">
                    <input
                      type="text"
                      value={detail.description || ''}
                      onChange={(e) => onDetailChange(index, 'description', e.target.value)}
                      placeholder="Description"
                      disabled={isRowLocked(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isRowLocked(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* Receipt # */}
                  <td className="px-1">
                    <input
                      type="text"
                      value={detail.recieptNo || ''}
                      onChange={(e) => onDetailChange(index, 'recieptNo', e.target.value)}
                      placeholder="Receipt #"
                      disabled={isRowLocked(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isRowLocked(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* ✅ Currency - Using CurrencySearchableInput */}
                  <td className="px-1">
                    {isCurrencyLocked(detail) || isRowLocked(detail) ? (
                      <div className="px-2 h-9 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm flex items-center justify-between">
                        <span className="truncate">{detail.currencyId ? `Currency #${detail.currencyId}` : '-'}</span>
                        <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      </div>
                    ) : (
                      <CurrencySearchableInput
                        value={detail.currencyId}
                        onChange={(id) => handleCurrencySelect(index, id)}
                        placeholder="Select..."
                        size="sm"
                        clearable
                      />
                    )}
                  </td>

                  {/* E.Rate - 4 decimals */}
                  <td className="px-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDisplayValue(detail, 'rate', index, 4)}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                      onFocus={() => handleFocus(index, 'rate')}
                      onBlur={handleBlur(index, 'rate', 4)}
                      placeholder="0.0000"
                      disabled={isRowLocked(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isRowLocked(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* Own Debit */}
                  <td className="px-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDisplayValue(detail, 'ownDb', index, 2)}
                      onChange={(e) => handleOwnDbChange(index, e.target.value)}
                      onFocus={() => handleFocus(index, 'ownDb')}
                      onBlur={handleBlur(index, 'ownDb', 2)}
                      placeholder="0.00"
                      disabled={isOwnDbDisabled(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isOwnDbDisabled(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* Own Credit */}
                  <td className="px-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDisplayValue(detail, 'ownCr', index, 2)}
                      onChange={(e) => handleOwnCrChange(index, e.target.value)}
                      onFocus={() => handleFocus(index, 'ownCr')}
                      onBlur={handleBlur(index, 'ownCr', 2)}
                      placeholder="0.00"
                      disabled={isOwnCrDisabled(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isOwnCrDisabled(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* ✅ Debit - Shows formatted when not focused */}
                  <td className="px-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDisplayValue(detail, 'amountDb', index, 2)}
                      onChange={(e) => handleAmountDbChange(index, e.target.value)}
                      onFocus={() => handleFocus(index, 'amountDb')}
                      onBlur={handleBlur(index, 'amountDb', 2)}
                      placeholder="0.00"
                      disabled={isAmountDbDisabled(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-red-400 ${
                        isAmountDbDisabled(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-50 border-red-300'
                      }`}
                    />
                  </td>

                  {/* ✅ Credit - Shows formatted when not focused */}
                  <td className="px-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={getDisplayValue(detail, 'amountCr', index, 2)}
                      onChange={(e) => handleAmountCrChange(index, e.target.value)}
                      onFocus={() => handleFocus(index, 'amountCr')}
                      onBlur={handleBlur(index, 'amountCr', 2)}
                      placeholder="0.00"
                      disabled={isAmountCrDisabled(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-green-400 ${
                        isAmountCrDisabled(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-50 border-green-300'
                      }`}
                    />
                  </td>

                  {/* CNIC */}
                  <td className="px-1">
                    <input
                      type="text"
                      value={detail.idCard || ''}
                      onChange={(e) => onDetailChange(index, 'idCard', e.target.value)}
                      placeholder="CNIC"
                      disabled={isRowLocked(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isRowLocked(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* Bank */}
                  <td className="px-1">
                    <input
                      type="text"
                      value={detail.bank || ''}
                      onChange={(e) => onDetailChange(index, 'bank', e.target.value)}
                      placeholder="Bank"
                      disabled={isRowLocked(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isRowLocked(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* Bank Date */}
                  <td className="px-1">
                    <input
                      type="date"
                      value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => onDetailChange(index, 'bankDate', e.target.value || null)}
                      disabled={isRowLocked(detail)}
                      className={`w-full px-2 h-9 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3] ${
                        isRowLocked(detail)
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-1 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onCloneRow(index)}
                        disabled={isRowLocked(detail)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isRowLocked(detail)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-100'
                        }`}
                        title="Clone row"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {details.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveRow(index)}
                          disabled={isRowLocked(detail)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isRowLocked(detail)
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-100'
                          }`}
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
                <td colSpan={10} className="px-2 py-3 text-right font-semibold text-gray-900">Totals:</td>
                <td className="px-2 py-3 text-right font-bold text-red-600 text-base">{formatAmount(totals.debitTotal)}</td>
                <td className="px-2 py-3 text-right font-bold text-green-600 text-base">{formatAmount(totals.creditTotal)}</td>
                <td colSpan={4} className="px-2 py-3 text-center">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    totals.difference === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {totals.difference === 0 ? '✓ Balanced' : `Diff: ${formatAmount(totals.difference)}`}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LcVoucherDetails
