// 'use client'
// import React from 'react'
// import { Button } from '@/components/ui/Button'
// import SelectableTable from '@/components/SelectableTable'
// import { JournalDetail } from '@/types/journalVoucher'

// interface VoucherDetailsProps {
//   journalDetails: JournalDetail[]
//   allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
//   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
//   totals: { debitTotal: number; creditTotal: number; difference: number }
//   balancingCoaId: number | null
//   onDetailChange: (index: number, field: string, value: any) => void
//   onAddRow: () => void
//   onRemoveRow: (index: number) => void
// }

// const VoucherDetails: React.FC<VoucherDetailsProps> = ({
//   journalDetails,
//   allCoaAccounts,
//   currencyOptions,
//   totals,
//   balancingCoaId,
//   onDetailChange,
//   onAddRow,
//   onRemoveRow
// }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-900 flex items-center">
//             <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 012 2v10a2 2 0 01-2 2M9 5V3a2 2 0 012-2h2a2 2 0 012 2v2M7 19h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             Journal Details
//           </h2>
//           <Button
//             type="button"
//             onClick={onAddRow}
//             className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             <span>Add Row</span>
//           </Button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Status</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">Account*</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Description</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">ID Card</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Bank</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Bank Date</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Chk/Rct #</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Currency</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Debit</th>
//               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Credit</th>
//               <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {journalDetails.map((detail, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-4 py-4">
//                   <input
//                     type="checkbox"
//                     checked={detail.status}
//                     onChange={(e) => onDetailChange(index, 'status', e.target.checked)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <SelectableTable
//                     name={`account_${index}`}
//                     value={detail.coaId || null}
//                     onChange={(name, value) => onDetailChange(index, 'coaId', value)}
//                     options={allCoaAccounts}
//                     placeholder="Select account"
//                     displayKey="label"
//                     columns={[
//                       { key: 'acCode', label: 'Code', width: '30%' },
//                       { key: 'acName', label: 'Name', width: '70%' }
//                     ]}
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <input
//                     type="text"
//                     value={detail.description}
//                     onChange={(e) => onDetailChange(index, 'description', e.target.value)}
//                     placeholder="Description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <input
//                     type="text"
//                     value={detail.idCard}
//                     onChange={(e) => onDetailChange(index, 'idCard', e.target.value)}
//                     placeholder="ID Card"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <input
//                     type="text"
//                     value={detail.bank}
//                     onChange={(e) => onDetailChange(index, 'bank', e.target.value)}
//                     placeholder="Bank"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <input
//                     type="date"
//                     value={detail.bankDate}
//                     onChange={(e) => onDetailChange(index, 'bankDate', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <input
//                     type="text"
//                     value={detail.chqNo}
//                     onChange={(e) => onDetailChange(index, 'chqNo', e.target.value)}
//                     placeholder="Chk/Rct #"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <SelectableTable
//                     name={`currency_${index}`}
//                     value={detail.currencyId || null}
//                     onChange={(name, value) => onDetailChange(index, 'currencyId', value)}
//                     options={currencyOptions}
//                     placeholder="Currency"
//                     displayKey="label"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <input
//                     type="number"
//                     value={detail.ownDb}
//                     onChange={(e) => {
//                       const value = parseFloat(e.target.value) || 0
//                       onDetailChange(index, 'ownDb', value)
//                       onDetailChange(index, 'amountDb', value)
//                       if (value > 0) {
//                         onDetailChange(index, 'ownCr', 0)
//                         onDetailChange(index, 'amountCr', 0)
//                       }
//                     }}
//                     placeholder="0.00"
//                     step="0.01"
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
//                   />
//                 </td>

//                 <td className="px-4 py-4">
//                   <input
//                     type="number"
//                     value={detail.ownCr}
//                     onChange={(e) => {
//                       const value = parseFloat(e.target.value) || 0
//                       onDetailChange(index, 'ownCr', value)
//                       onDetailChange(index, 'amountCr', value)
//                       if (value > 0) {
//                         onDetailChange(index, 'ownDb', 0)
//                         onDetailChange(index, 'amountDb', 0)
//                       }
//                     }}
//                     placeholder="0.00"
//                     step="0.01"
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
//                   />
//                 </td>

//                 <td className="px-4 py-4 text-center">
//                   {journalDetails.length > 1 && (
//                     <Button
//                       type="button"
//                       variant="danger"
//                       onClick={() => onRemoveRow(index)}
//                       className="px-3 py-1 text-xs"
//                     >
//                       Remove
//                     </Button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-gray-100">
//             <tr>
//               <td colSpan={8} className="px-4 py-4 text-right font-semibold text-gray-900">
//                 Totals:
//               </td>
//               <td className="px-4 py-4 text-right font-semibold text-gray-900">
//                 {totals.debitTotal.toFixed(2)}
//               </td>
//               <td className="px-4 py-4 text-right font-semibold text-gray-900">
//                 {totals.creditTotal.toFixed(2)}
//               </td>
//               <td className="px-4 py-4 text-center">
//                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   totals.difference === 0 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {totals.difference === 0 ? 'Balanced' : `Diff: ${totals.difference.toFixed(2)}`}
//                 </span>
//               </td>
//             </tr>
//             {/* Auto-balancing preview */}
//             {totals.difference > 0 && balancingCoaId && (
//               <tr className="bg-blue-50">
//                 <td colSpan={8} className="px-4 py-3 text-right text-sm text-blue-700 font-medium">
//                   Auto-balancing entry will be added:
//                 </td>
//                 <td className="px-4 py-3 text-right text-sm font-medium text-blue-700">
//                   {totals.creditTotal > totals.debitTotal ? totals.difference.toFixed(2) : '0.00'}
//                 </td>
//                 <td className="px-4 py-3 text-right text-sm font-medium text-blue-700">
//                   {totals.debitTotal > totals.creditTotal ? totals.difference.toFixed(2) : '0.00'}
//                 </td>
//                 <td className="px-4 py-3 text-center">
//                   <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                     Auto
//                   </span>
//                 </td>
//               </tr>
//             )}
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default VoucherDetails
































































// 'use client'
// import React from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import SelectableTable from '@/components/SelectableTable'
// import { JournalDetail } from '@/types/journalVoucher'
// import { formatAmount, formatDisplayDate } from '@/utils/formatters'
// import {
//   Plus,
//   Trash2,
//   Receipt,
//   DollarSign,
//   Calendar,
//   Building,
//   CreditCard,
//   FileText,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react'

// interface VoucherDetailsProps {
//   journalDetails: JournalDetail[]
//   allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
//   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
//   totals: { debitTotal: number; creditTotal: number; difference: number }
//   balancingCoaId: number | null
//   onDetailChange: (index: number, field: string, value: any) => void
//   onAddRow: () => void
//   onRemoveRow: (index: number) => void
// }

// const VoucherDetails: React.FC<VoucherDetailsProps> = ({
//   journalDetails,
//   allCoaAccounts,
//   currencyOptions,
//   totals,
//   balancingCoaId,
//   onDetailChange,
//   onAddRow,
//   onRemoveRow
// }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 mb-6">
//       {/* Simple Header */}
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center">
//           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//           <h2 className="text-lg font-semibold text-gray-900">Journal Details</h2>
//           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//             {journalDetails.length} rows
//           </span>
//         </div>
//         <Button
//           variant="primary"
//           size="sm"
//           onClick={onAddRow}
//           icon={<Plus className="w-4 h-4" />}
//         >
//           Add Row
//         </Button>
//       </div>

//       {/* Simple Table */}
//       <div className="p-4">
//         <div className="overflow-x-auto">
//           <table className="w-full  rounded-lg ">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Status</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Account</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Description</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Debit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Credit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">CNIC</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK DATE</th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-900 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {journalDetails.map((detail, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="px-3 py-3">
//                     <input
//                       type="checkbox"
//                       checked={detail.status}
//                       onChange={(e) => onDetailChange(index, 'status', e.target.checked)}
//                       className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[200px]">
//                     <SelectableTable
//                       name={`account_${index}`}
//                       value={detail.coaId || null}
//                       onChange={(name, value) => onDetailChange(index, 'coaId', value)}
//                       // options={allCoaAccounts}
//                       options={allCoaAccounts.map(opt => ({
//                         ...opt,
//                         label: opt.label ? opt.label.slice(0, 15) : ''
//                       }))}
//                       placeholder="Select account"
//                       displayKey="label"
//                       columns={[
//                         // { key: 'acCode', label: 'Code', width: '30%' },
//                         { key: 'acName', label: 'Name', width: '70%' }
//                       ]}
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[150px]">
//                     <input
//                       type="text"
//                       value={detail.description}
//                       onChange={(e) => onDetailChange(index, 'description', e.target.value)}
//                       placeholder="Description"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type=""
//                       value={detail.ownDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         onDetailChange(index, 'ownDb', value)
//                         onDetailChange(index, 'amountDb', value)
//                         if (value > 0) {
//                           onDetailChange(index, 'ownCr', 0)
//                           onDetailChange(index, 'amountCr', 0)
//                         }
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                     {/* {detail.ownDb > 0 && (
//                       <div className="text-xs text-gray-500 mt-1">{formatAmount(detail.ownDb)}</div>
//                     )} */}
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type=""
//                       value={detail.ownCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         onDetailChange(index, 'ownCr', value)
//                         onDetailChange(index, 'amountCr', value)
//                         if (value > 0) {
//                           onDetailChange(index, 'ownDb', 0)
//                           onDetailChange(index, 'amountDb', 0)
//                         }
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                     {/* {detail.ownCr > 0 && (
//                       <div className="text-xs text-gray-500 mt-1">{formatAmount(detail.ownCr)}</div>
//                     )} */}
//                   </td>

//                   <td className=" px-3 py-3 min-w-[120px]">

//                     <input
//                       type="text"
//                       value={detail.idCard || ''}
//                       onChange={(e) => onDetailChange(index, 'idCard', e.target.value)}
//                       placeholder="ID Card"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />


//                   </td>
//                   <td className=" px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.bank || ''}
//                       onChange={(e) => onDetailChange(index, 'bank', e.target.value)}
//                       placeholder="Bank"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>
//                   <td className=" px-3 py-3 min-w-[140px]">
//                     <input
//                       type="date"
//                       value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => {
//                         const dateValue = e.target.value || null
//                         onDetailChange(index, 'bankDate', dateValue)
//                       }}
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                     {/* {detail.bankDate && (
//                       <div className="text-xs text-gray-500">{formatDisplayDate(detail.bankDate)}</div>
//                     )} */}

//                   </td>
//                   <td className=" ">
//                     {journalDetails.length > 1 && (
//                       <Button
//                         variant="danger"
//                         size="md"
//                         onClick={() => onRemoveRow(index)}
//                         icon={<Trash2 className="w-3 h-3" />}
//                       >
//                         Del
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>


//             <tfoot className="border-[#dbeafe] rounded rounded-sm w-full">
//               <tr className=''>
//                 <td colSpan={3} className="px-3 py-3 text-right font-semibold text-gray-900">
//                   Totals:
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-green-600">
//                   {formatAmount(totals.debitTotal)}
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-blue-600">
//                   {formatAmount(totals.creditTotal)}
//                 </td>
//                 <td className="px-3 py-3"></td>
//                 <td className="px-3 py-3 text-center">
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${totals.difference === 0
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                     }`}>
//                     {totals.difference === 0 ? 'Balanced' : `Diff: ${formatAmount(totals.difference)}`}
//                   </span>
//                 </td>
//               </tr>
//               {/* Auto-balancing preview */}
//               {totals.difference > 0 && balancingCoaId && (
//                 <tr className="bg-blue-50">
//                   <td colSpan={3} className="px-3 py-2 text-right text-sm text-blue-700">
//                     Auto-balancing entry:
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td className="px-3 py-2"></td>
//                   <td className="px-3 py-2 text-center">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Auto</span>
//                   </td>
//                 </tr>
//               )}
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoucherDetails




















































// 'use client'
// import React, { useState } from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import SelectableTable from '@/components/SelectableTable'
// import { JournalDetail } from '@/types/journalVoucher'
// import { formatAmount, formatDisplayDate } from '@/utils/formatters'
// import {
//   Plus,
//   Trash2,
//   Receipt,
//   DollarSign,
//   Calendar,
//   Building,
//   CreditCard,
//   FileText,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react'

// interface VoucherDetailsProps {
//   journalDetails: JournalDetail[]
//   allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
//   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
//   totals: { debitTotal: number; creditTotal: number; difference: number }
//   balancingCoaId: number | null
//   onDetailChange: (index: number, field: string, value: any) => void
//   onAddRow: () => void
//   onRemoveRow: (index: number) => void
// }

// const VoucherDetails: React.FC<VoucherDetailsProps> = ({
//   journalDetails,
//   allCoaAccounts,
//   currencyOptions,
//   totals,
//   balancingCoaId,
//   onDetailChange,
//   onAddRow,
//   onRemoveRow
// }) => {
//   // ✅ NEW: State for opening/closing checkboxes
//   const [isOpening, setIsOpening] = useState(false)
//   const [isClosing, setIsClosing] = useState(false)

//   // ✅ NEW: Enhanced detail change handler with debit/credit logic
//   const handleDetailChange = (index: number, field: string, value: any) => {
//     // Call original handler
//     onDetailChange(index, field, value)

//     // ✅ NEW: Validation logic - if debit fields entered, clear credit fields
//     if ((field === 'ownDb' || field === 'amountDb') && value > 0) {
//       onDetailChange(index, 'ownCr', 0)
//       onDetailChange(index, 'amountCr', 0)
//     }

//     // ✅ NEW: Validation logic - if credit fields entered, clear debit fields  
//     if ((field === 'ownCr' || field === 'amountCr') && value > 0) {
//       onDetailChange(index, 'ownDb', 0)
//       onDetailChange(index, 'amountDb', 0)
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 mb-6">
//       {/* ✅ UPDATED: Header with Opening/Closing checkboxes */}
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center">
//           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//           <h2 className="text-lg font-semibold text-gray-900">Journal Details</h2>
//           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//             {journalDetails.length} rows
//           </span>
//         </div>

//         {/* ✅ NEW: Opening/Closing checkboxes + Add Row button */}
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="opening"
//               checked={isOpening}
//               onChange={(e) => setIsOpening(e.target.checked)}
//               className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//             />
//             <label htmlFor="opening" className="text-sm font-medium text-gray-700">
//               Opening
//             </label>
//           </div>

//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="closing"
//               checked={isClosing}
//               onChange={(e) => setIsClosing(e.target.checked)}
//               className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//             />
//             <label htmlFor="closing" className="text-sm font-medium text-gray-700">
//               Closing
//             </label>
//           </div>

//           <Button
//             variant="primary"
//             size="sm"
//             onClick={onAddRow}
//             icon={<Plus className="w-4 h-4" />}
//           >
//             Add Row
//           </Button>
//         </div>
//       </div>

//       {/* ✅ UPDATED: Table with new columns */}
//       <div className="p-4">
//         <div className="overflow-x-auto">
//           <table className="w-full rounded-lg">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Status</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Account</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Description</th>
//                 {/* ✅ NEW: Own Debit column */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Debit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Debit</th>
//                 {/* ✅ NEW: Own Credit column */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Credit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Credit</th>
//                 {/* ✅ NEW: E.Rate column */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">E.Rate</th>
//                 {/* ✅ NEW: Currency column */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Currency</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">CNIC</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK DATE</th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-900 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {journalDetails.map((detail, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   {/* Status */}
//                   <td className="px-3 py-3">
//                     <input
//                       type="checkbox"
//                       checked={detail.status}
//                       onChange={(e) => handleDetailChange(index, 'status', e.target.checked)}
//                       className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//                     />
//                   </td>

//                   {/* Account */}
//                   <td className="px-3 py-3 min-w-[200px]">
//                     <SelectableTable
//                       name={`account_${index}`}
//                       value={detail.coaId || null}
//                       onChange={(name, value) => handleDetailChange(index, 'coaId', value)}
//                       options={allCoaAccounts.map(opt => ({
//                         ...opt,
//                         label: opt.label ? opt.label.slice(0, 15) : ''
//                       }))}
//                       placeholder="Select account"
//                       displayKey="label"
//                       columns={[
//                         { key: 'acName', label: 'Name', width: '70%' }
//                       ]}
//                     />
//                   </td>

//                   {/* Description */}
//                   <td className="px-3 py-3 min-w-[150px]">
//                     <input
//                       type="text"
//                       value={detail.description}
//                       onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
//                       placeholder="Description"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td>

//                   {/* ✅ NEW: Own Debit */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownDb', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>
//                    <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownCr', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* Debit */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.amountDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'amountDb', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* ✅ NEW: Own Credit */}


//                   {/* Credit */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.amountCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'amountCr', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* ✅ NEW: E.Rate */}
//                   <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.rate || 1}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 1
//                         handleDetailChange(index, 'rate', value)
//                       }}
//                       placeholder="1.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* ✅ NEW: Currency */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <SelectableTable
//                       name={`currency_${index}`}
//                       value={detail.currencyId || 1}
//                       onChange={(name, value) => handleDetailChange(index, 'currencyId', value)}
//                       options={currencyOptions}
//                       placeholder="Currency"
//                       displayKey="currencyName"
//                       columns={[
//                         { key: 'currencyName', label: 'Currency', width: '100%' }
//                       ]}
//                     />
//                   </td>

//                   {/* CNIC */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.idCard || ''}
//                       onChange={(e) => handleDetailChange(index, 'idCard', e.target.value)}
//                       placeholder="ID Card"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Bank */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.bank || ''}
//                       onChange={(e) => handleDetailChange(index, 'bank', e.target.value)}
//                       placeholder="Bank"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Bank Date */}
//                   <td className="px-3 py-3 min-w-[140px]">
//                     <input
//                       type="date"
//                       value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => {
//                         const dateValue = e.target.value || null
//                         handleDetailChange(index, 'bankDate', dateValue)
//                       }}
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Action */}
//                   <td className="px-3 py-3">
//                     {journalDetails.length > 1 && (
//                       <Button
//                         variant="danger"
//                         size="md"
//                         onClick={() => onRemoveRow(index)}
//                         icon={<Trash2 className="w-3 h-3" />}
//                       >
//                         Del
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//             {/* ✅ UPDATED: Footer with new column spans */}
//             <tfoot className="border-[#dbeafe] rounded rounded-sm w-full">
//               <tr>
//                 <td colSpan={5} className="px-3 py-3 text-right font-semibold text-gray-900">
//                   Totals:
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-green-600">
//                   {formatAmount(totals.debitTotal)}
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-blue-600">
//                   {formatAmount(totals.creditTotal)}
//                 </td>
//                 <td colSpan={5} className="px-3 py-3 text-center">
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${totals.difference === 0
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                     }`}>
//                     {totals.difference === 0 ? 'Balanced' : `Diff: ${formatAmount(totals.difference)}`}
//                   </span>
//                 </td>
//               </tr>

//               {/* Auto-balancing preview */}
//               {totals.difference > 0 && balancingCoaId && (
//                 <tr className="bg-blue-50">
//                   <td colSpan={5} className="px-3 py-2 text-right text-sm text-blue-700">
//                     Auto-balancing entry:
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td colSpan={5} className="px-3 py-2 text-center">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Auto</span>
//                   </td>
//                 </tr>
//               )}
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoucherDetails





























































// 'use client'
// import React, { useState } from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import SelectableTable from '@/components/SelectableTable'
// import { JournalDetail } from '@/types/journalVoucher'
// import { formatAmount, formatDisplayDate } from '@/utils/formatters'
// import {
//   Plus,
//   Trash2,
//   Receipt,
//   DollarSign,
//   Calendar,
//   Building,
//   CreditCard,
//   FileText,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react'

// interface VoucherDetailsProps {
//   journalDetails: JournalDetail[]
//   allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
//   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
//   totals: { debitTotal: number; creditTotal: number; difference: number }
//   balancingCoaId: number | null
//   onDetailChange: (index: number, field: string, value: any) => void
//   onAddRow: () => void
//   onRemoveRow: (index: number) => void
// }

// const VoucherDetails: React.FC<VoucherDetailsProps> = ({
//   journalDetails,
//   allCoaAccounts,
//   currencyOptions,
//   totals,
//   balancingCoaId,
//   onDetailChange,
//   onAddRow,
//   onRemoveRow
// }) => {
//   // ✅ NEW: State for opening/closing checkboxes
//   const [isOpening, setIsOpening] = useState(false)
//   const [isClosing, setIsClosing] = useState(false)

 

//   const handleDetailChange = (index: number, field: string, value: any) => {
//     // Call original handler
//     onDetailChange(index, field, value)

//     // ✅ FIXED LOGIC: Clear opposite side when entering ANY field from either side
//     if ((field === 'ownDb' || field === 'amountDb') && value > 0) {
//       // Entering debit side → clear credit side
//       onDetailChange(index, 'ownCr', 0)
//       onDetailChange(index, 'amountCr', 0)
//     }

//     if ((field === 'ownCr' || field === 'amountCr') && value > 0) {
//       // Entering credit side → clear debit side
//       onDetailChange(index, 'ownDb', 0)
//       onDetailChange(index, 'amountDb', 0)
//     }
//   }


//   return (
//     <div className="bg-white rounded-lg border border-gray-200 mb-6">
//       {/* ✅ UPDATED: Header with Opening/Closing checkboxes */}
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center">
//           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//           <h2 className="text-lg font-semibold text-gray-900">Journal Details</h2>
//           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//             {journalDetails.length} rows
//           </span>
//         </div>

//         {/* ✅ NEW: Opening/Closing checkboxes + Add Row button */}
//         <div className="flex items-center space-x-4">
//           {/* <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="opening"
//               checked={isOpening}
//               onChange={(e) => setIsOpening(e.target.checked)}
//               className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//             />
//             <label htmlFor="opening" className="text-sm font-medium text-gray-700">
//               Opening
//             </label>
//           </div>

//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="closing"
//               checked={isClosing}
//               onChange={(e) => setIsClosing(e.target.checked)}
//               className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//             />
//             <label htmlFor="closing" className="text-sm font-medium text-gray-700">
//               Closing
//             </label>
//           </div> */}

//           <Button
//             variant="primary"
//             size="sm"
//             onClick={onAddRow}
//             icon={<Plus className="w-4 h-4" />}
//           >
//             Add Row
//           </Button>
//         </div>
//       </div>

//       {/* ✅ UPDATED: Table with Chq/Rct# fields added back */}
//       <div className="p-4">
//         <div className="overflow-x-auto">
//           <table className="w-full rounded-lg">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Status</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Account</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Description</th>
//                 {/* ✅ ADDED BACK: Chq/Rct# fields */}
//                 {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Chq#</th> */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 ">Chq/Rct#</th>
//                 {/* ✅ NEW: Own Debit column */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Currency</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">E.Rate</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Debit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase"> Own Credit</th>
//                 {/* ✅ NEW: Own Credit column */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Debit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Credit</th>
//                 {/* ✅ NEW: E.Rate column */}
//                 {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">E.Rate</th> */}
//                 {/* ✅ NEW: Currency column */}
//                 {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Currency</th> */}
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">CNIC</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK DATE</th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-900 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {journalDetails.map((detail, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   {/* Status */}
//                   <td className="px-3 py-3">
//                     <input
//                       type="checkbox"
//                       checked={detail.status}
//                       onChange={(e) => handleDetailChange(index, 'status', e.target.checked)}
//                       className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//                     />
//                   </td>

//                   {/* Account */}
//                   <td className="px-3 py-3 min-w-[200px]">
//                     <SelectableTable
//                       name={`account_${index}`}
//                       value={detail.coaId || null}
//                       onChange={(name, value) => handleDetailChange(index, 'coaId', value)}
//                       options={allCoaAccounts.map(opt => ({
//                         ...opt,
//                         label: opt.label ? opt.label.slice(0, 15) : ''
//                       }))}
//                       placeholder="Select account"
//                       displayKey="label"
//                       columns={[
//                         { key: 'acName', label: 'Name', width: '70%' }
//                       ]}
//                     />
//                   </td>

//                   {/* Description */}
//                   <td className="px-3 py-3 min-w-[150px]">
//                     <input
//                       type="text"
//                       value={detail.description}
//                       onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
//                       placeholder="Description"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td>

//                   {/* ✅ ADDED BACK: Chq# */}
//                   {/* <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.chqNo || ''}
//                       onChange={(e) => handleDetailChange(index, 'chqNo', e.target.value)}
//                       placeholder="Chq#"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td> */}

//                   {/* ✅ ADDED BACK: Rct# */}
//                   <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.recieptNo || ''}
//                       onChange={(e) => handleDetailChange(index, 'recieptNo', e.target.value)}
//                       placeholder="Rct#"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td>

//                   {/* ✅ ADDED BACK: Currency */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <SelectableTable
//                       name={`currency_${index}`}
//                       value={detail.currencyId || 1}
//                       onChange={(name, value) => handleDetailChange(index, 'currencyId', value)}
//                       options={currencyOptions}
//                       placeholder="Currency"
//                       displayKey="currencyName"
//                       columns={[
//                         { key: 'currencyName', label: 'Currency', width: '100%' }
//                       ]}
//                     />
//                   </td>

//                   {/* ✅ NEW: E.Rate */}
//                   <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.rate || 1}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 1
//                         handleDetailChange(index, 'rate', value)
//                       }}
//                       placeholder="1.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>
//                   {/* ✅ NEW: Own Debit */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownDb', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* ✅ NEW: Own Credit */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownCr', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>


//                   {/* Debit */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.amountDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'amountDb', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>


//                   {/* Credit */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.amountCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'amountCr', value)
//                       }}
//                       placeholder="0.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* ✅ NEW: E.Rate */}
//                   {/* <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.rate || 1}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 1
//                         handleDetailChange(index, 'rate', value)
//                       }}
//                       placeholder="1.00"
//                       // step="0.01"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td> */}

//                   {/* ✅ NEW: Currency */}


//                   {/* CNIC */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.idCard || ''}
//                       onChange={(e) => handleDetailChange(index, 'idCard', e.target.value)}
//                       placeholder="ID Card"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Bank */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.bank || ''}
//                       onChange={(e) => handleDetailChange(index, 'bank', e.target.value)}
//                       placeholder="Bank"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Bank Date */}
//                   <td className="px-3 py-3 min-w-[140px]">
//                     <input
//                       type="date"
//                       value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => {
//                         const dateValue = e.target.value || null
//                         handleDetailChange(index, 'bankDate', dateValue)
//                       }}
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Action */}
//                   <td className="px-2 py-3">
//                     {journalDetails.length > 1 && (
//                       <Button
//                         variant="danger"
//                         size="md"
//                         onClick={() => onRemoveRow(index)}
//                         icon={<Trash2 className="w-3 h-3" />}
//                       >

//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//             {/* ✅ UPDATED: Footer with new column spans */}
//             <tfoot className="border-[#dbeafe] rounded rounded-sm w-full">
//               <tr>
//                 <td colSpan={7} className="px-3 py-3 text-right font-semibold text-gray-900">
//                   Totals:
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-green-600">
//                   {formatAmount(totals.debitTotal)}
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-blue-600">
//                   {formatAmount(totals.creditTotal)}
//                 </td>
//                 <td colSpan={5} className="px-3 py-3 text-center">
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${totals.difference === 0
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                     }`}>
//                     {totals.difference === 0 ? 'Balanced' : `Diff: ${formatAmount(totals.difference)}`}
//                   </span>
//                 </td>
//               </tr>

//               {/* Auto-balancing preview */}
//               {totals.difference > 0 && balancingCoaId && (
//                 <tr className="bg-blue-50">
//                   <td colSpan={7} className="px-3 py-2 text-right text-sm text-blue-700">
//                     Auto-balancing entry:
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td colSpan={5} className="px-3 py-2 text-center">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Auto</span>
//                   </td>
//                 </tr>
//               )}
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoucherDetails






























































// 'use client'
// import React, { useState } from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import SelectableTable from '@/components/SelectableTable'
// import { JournalDetail } from '@/types/journalVoucher'
// import { formatAmount, formatDisplayDate } from '@/utils/formatters'
// import {
//   Plus,
//   Trash2,
//   Receipt,
//   DollarSign,
//   Calendar,
//   Building,
//   CreditCard,
//   FileText,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react'

// interface VoucherDetailsProps {
//   journalDetails: JournalDetail[]
//   allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
//   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
//   totals: { debitTotal: number; creditTotal: number; difference: number }
//   balancingCoaId: number | null
//   onDetailChange: (index: number, field: string, value: any) => void
//   onAddRow: () => void
//   onRemoveRow: (index: number) => void
// }

// const VoucherDetails: React.FC<VoucherDetailsProps> = ({
//   journalDetails,
//   allCoaAccounts,
//   currencyOptions,
//   totals,
//   balancingCoaId,
//   onDetailChange,
//   onAddRow,
//   onRemoveRow
// }) => {
//   const [isOpening, setIsOpening] = useState(false)
//   const [isClosing, setIsClosing] = useState(false)

//   const handleDetailChange = (index: number, field: string, value: any) => {
//     // Call original handler
//     onDetailChange(index, field, value)

//     // ✅ FIXED LOGIC: Clear opposite side when entering ANY field from either side
//     if ((field === 'ownDb' || field === 'amountDb') && value > 0) {
//       // Entering debit side → clear credit side
//       onDetailChange(index, 'ownCr', 0)
//       onDetailChange(index, 'amountCr', 0)
//     }

//     if ((field === 'ownCr' || field === 'amountCr') && value > 0) {
//       // Entering credit side → clear debit side
//       onDetailChange(index, 'ownDb', 0)
//       onDetailChange(index, 'amountDb', 0)
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 mb-6">
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center">
//           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//           <h2 className="text-lg font-semibold text-gray-900">Journal Details</h2>
//           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//             {journalDetails.length} rows
//           </span>
//         </div>

//         <div className="flex items-center space-x-4">
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={onAddRow}
//             icon={<Plus className="w-4 h-4" />}
//           >
//             Add Row
//           </Button>
//         </div>
//       </div>

//       <div className="p-4">
//         <div className="overflow-x-auto">
//           <table className="w-full rounded-lg">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Status</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Account</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Description</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 ">Chq/Rct#</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Currency</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">E.Rate</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Debit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase"> Own Credit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Debit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Credit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">CNIC</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK DATE</th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-900 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {journalDetails.map((detail, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   {/* Status */}
//                   <td className="px-3 py-3">
//                     <input
//                       type="checkbox"
//                       checked={detail.status}
//                       onChange={(e) => handleDetailChange(index, 'status', e.target.checked)}
//                       className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//                     />
//                   </td>

//                   {/* Account */}
//                   <td className="px-3 py-3 min-w-[200px]">
//                     <SelectableTable
//                       name={`account_${index}`}
//                       value={detail.coaId || null}
//                       onChange={(name, value) => handleDetailChange(index, 'coaId', value)}
//                       options={allCoaAccounts.map(opt => ({
//                         ...opt,
//                         label: opt.label ? opt.label.slice(0, 15) : ''
//                       }))}
//                       placeholder="Select account"
//                       displayKey="label"
//                       columns={[
//                         { key: 'acName', label: 'Name', width: '70%' }
//                       ]}
//                     />
//                   </td>

//                   {/* ✅ FIXED: Description - Required */}
//                   <td className="px-3 py-3 min-w-[150px]">
//                     <input
//                       type="text"
//                       value={detail.description}
//                       onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
//                       placeholder="Description"
//                       required
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td>

//                   {/* Chq/Rct# */}
//                   <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.recieptNo || ''}
//                       onChange={(e) => handleDetailChange(index, 'recieptNo', e.target.value)}
//                       placeholder="Rct#"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td>

//                   {/* Currency */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <SelectableTable
//                       name={`currency_${index}`}
//                       value={detail.currencyId || 0}
//                       onChange={(name, value) => handleDetailChange(index, 'currencyId', value)}
//                       options={currencyOptions}
//                       placeholder="Currency"
//                       displayKey="currencyName"
//                       columns={[
//                         { key: 'currencyName', label: 'Currency', width: '100%' }
//                       ]}
//                     />
//                   </td>

//                   {/* E.Rate */}
//                   <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.rate || 1}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'rate', value)
//                       }}
//                       placeholder="1.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* Own Debit - Optional */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownDb', value)
//                       }}
//                       placeholder="0.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* Own Credit - Optional */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownCr', value)
//                       }}
//                       placeholder="0.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* ✅ FIXED: Debit - Required (one of debit/credit) */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.amountDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'amountDb', value)
//                       }}
//                       placeholder="0.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* ✅ FIXED: Credit - Required (one of debit/credit) */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.amountCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'amountCr', value)
//                       }}
//                       placeholder="0.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   {/* CNIC */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.idCard || ''}
//                       onChange={(e) => handleDetailChange(index, 'idCard', e.target.value)}
//                       placeholder="ID Card"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Bank */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.bank || ''}
//                       onChange={(e) => handleDetailChange(index, 'bank', e.target.value)}
//                       placeholder="Bank"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Bank Date */}
//                   <td className="px-3 py-3 min-w-[140px]">
//                     <input
//                       type="date"
//                       value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => {
//                         const dateValue = e.target.value || null
//                         handleDetailChange(index, 'bankDate', dateValue)
//                       }}
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   {/* Action */}
//                   <td className="px-2 py-3">
//                     {journalDetails.length > 1 && (
//                       <Button
//                         variant="danger"
//                         size="md"
//                         onClick={() => onRemoveRow(index)}
//                         icon={<Trash2 className="w-3 h-3" />}
//                       >
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//             {/* ✅ FIXED: Footer shows DEBIT and CREDIT totals (columns 9 & 10) */}
//             <tfoot className="border-[#dbeafe] rounded rounded-sm w-full">
//               <tr>
//                 <td colSpan={8} className="px-3 py-3 text-right font-semibold text-gray-900">
//                   Totals:
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-green-600">
//                   {formatAmount(totals.debitTotal)}
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-blue-600">
//                   {formatAmount(totals.creditTotal)}
//                 </td>
//                 <td colSpan={4} className="px-3 py-3 text-center">
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${totals.difference === 0
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                     }`}>
//                     {totals.difference === 0 ? 'Balanced' : `Diff: ${formatAmount(totals.difference)}`}
//                   </span>
//                 </td>
//               </tr>

//               {/* Auto-balancing preview - Based on DEBIT vs CREDIT */}
//               {totals.difference > 0 && balancingCoaId && (
//                 <tr className="bg-blue-50">
//                   <td colSpan={8} className="px-3 py-2 text-right text-sm text-blue-700">
//                     Auto-balancing entry:
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td colSpan={4} className="px-3 py-2 text-center">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Auto</span>
//                   </td>
//                 </tr>
//               )}
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoucherDetails



















































































// 'use client'
// import React, { useState } from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import SelectableTable from '@/components/SelectableTable'
// import { JournalDetail } from '@/types/journalVoucher'
// import { formatAmount, formatDisplayDate } from '@/utils/formatters'
// import {
//   Plus,
//   Trash2,
//   Receipt,
//   AlertCircle
// } from 'lucide-react'

// interface VoucherDetailsProps {
//   journalDetails: JournalDetail[]
//   allCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
//   currencyOptions: Array<{ id: number; label: string; currencyName: string }>
//   totals: { debitTotal: number; creditTotal: number; difference: number }
//   balancingCoaId: number | null
//   onDetailChange: (index: number, field: string, value: any) => void
//   onAddRow: () => void
//   onRemoveRow: (index: number) => void
// }

// const VoucherDetails: React.FC<VoucherDetailsProps> = ({
//   journalDetails,
//   allCoaAccounts,
//   currencyOptions,
//   totals,
//   balancingCoaId,
//   onDetailChange,
//   onAddRow,
//   onRemoveRow
// }) => {
//   const [isOpening, setIsOpening] = useState(false)
//   const [isClosing, setIsClosing] = useState(false)
  
//   // ✅ FIXED: Add currency to validation
//   const [rowErrors, setRowErrors] = useState<{[key: number]: {coa?: boolean, description?: boolean, amount?: boolean, currency?: boolean}}>({})

//   const handleDetailChange = (index: number, field: string, value: any) => {
//     onDetailChange(index, field, value)

//     // ✅ FIXED: Add currency to validation clearing
//     if (field === 'coaId' || field === 'description' || field === 'amountDb' || field === 'amountCr' || field === 'currencyId') {
//       setRowErrors(prev => ({
//         ...prev,
//         [index]: {
//           ...prev[index],
//           ...(field === 'coaId' && { coa: false }),
//           ...(field === 'description' && { description: false }),
//           ...(field === 'currencyId' && { currency: false }),
//           ...((field === 'amountDb' || field === 'amountCr') && { amount: false })
//         }
//       }))
//     }

//     if ((field === 'ownDb' || field === 'amountDb') && value > 0) {
//       onDetailChange(index, 'ownCr', 0)
//       onDetailChange(index, 'amountCr', 0)
//     }

//     if ((field === 'ownCr' || field === 'amountCr') && value > 0) {
//       onDetailChange(index, 'ownDb', 0)
//       onDetailChange(index, 'amountDb', 0)
//     }
//   }

//   // ✅ FIXED: Add currency to validation
//   const validateRow = (detail: JournalDetail, index: number) => {
//     const errors: {coa?: boolean, description?: boolean, amount?: boolean, currency?: boolean} = {}
    
//     if (!detail.coaId || detail.coaId === 0) {
//       errors.coa = true
//     }
    
//     if (!detail.description || detail.description.trim() === '') {
//       errors.description = true
//     }
    
//     if ((!detail.amountDb || detail.amountDb === 0) && (!detail.amountCr || detail.amountCr === 0)) {
//       errors.amount = true
//     }
    
//     // ✅ NEW: Currency is required
//     if (!detail.currencyId) {
//       errors.currency = true
//     }
    
//     setRowErrors(prev => ({
//       ...prev,
//       [index]: errors
//     }))
    
//     return Object.keys(errors).length === 0
//   }

//   // ✅ FIXED: Add currency to error checking
//   const getRowError = (index: number, field: 'coa' | 'description' | 'amount' | 'currency') => {
//     return rowErrors[index]?.[field] || false
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 mb-6">
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center">
//           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//           <h2 className="text-lg font-semibold text-gray-900">Journal Details</h2>
//           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//             {journalDetails.length} rows
//           </span>
//         </div>

//         <div className="flex items-center space-x-4">
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={onAddRow}
//             icon={<Plus className="w-4 h-4" />}
//           >
//             Add Row
//           </Button>
//         </div>
//       </div>

//       <div className="p-4">
//         <div className="overflow-x-auto">
//           <table className="w-full rounded-lg">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Status</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
//                   Account <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
//                   Description <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 ">Chq/Rct#</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
//                   Currency <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">E.Rate</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Debit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">Own Credit</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
//                   Debit <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">
//                   Credit <span className="text-red-500">*</span>
//                 </th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">CNIC</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK</th>
//                 <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase">BANK DATE</th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-900 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {journalDetails.map((detail, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="px-3 py-3">
//                     <input
//                       type="checkbox"
//                       checked={detail.status}
//                       onChange={(e) => handleDetailChange(index, 'status', e.target.checked)}
//                       className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[200px]">
//                     <div className="relative">
//                       <SelectableTable
//                         name={`account_${index}`}
//                         value={detail.coaId || null}
//                         onChange={(name, value) => handleDetailChange(index, 'coaId', value)}
//                         options={allCoaAccounts.map(opt => ({
//                           ...opt,
//                           label: opt.label ? opt.label.slice(0, 15) : ''
//                         }))}
//                         placeholder="Select account"
//                         displayKey="label"
//                         columns={[
//                           { key: 'acName', label: 'Name', width: '70%' }
//                         ]}
//                         className={getRowError(index, 'coa') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
//                       />
//                       {getRowError(index, 'coa') && (
//                         <div className="flex items-center mt-1 text-red-500 text-xs">
//                           <AlertCircle className="w-3 h-3 mr-1" />
//                           <span>Account is required</span>
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   <td className="px-3 py-3 min-w-[150px]">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={detail.description}
//                         onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
//                         onBlur={() => validateRow(detail, index)}
//                         placeholder="Description"
//                         className={`w-full px-2 h-9 py-1 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
//                           getRowError(index, 'description') 
//                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
//                             : 'border-gray-300 focus:ring-[#509ee3] focus:border-[#509ee3]'
//                         }`}
//                       />
//                       {getRowError(index, 'description') && (
//                         <div className="flex items-center mt-1 text-red-500 text-xs">
//                           {/* <AlertCircle className="w-3 h-3 mr-1" /> */}
//                           {/* <span>Description is required</span> */}
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.recieptNo || ''}
//                       onChange={(e) => handleDetailChange(index, 'recieptNo', e.target.value)}
//                       placeholder="Rct#"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//                     />
//                   </td>

//                   {/* ✅ FIXED: Currency - Required with validation */}
//                   <td className="px-3 py-3 min-w-[120px]">
//                     <div className="relative">
//                       <SelectableTable
//                         name={`currency_${index}`}
//                         value={detail.currencyId || null}
//                         onChange={(name, value) => handleDetailChange(index, 'currencyId', value)}
//                         options={currencyOptions} // ✅ Only RMB, USD, Pkr (no "Select Currency")
//                         placeholder="Currency"
//                         displayKey="currencyName"
//                         columns={[
//                           { key: 'currencyName', label: 'Currency', width: '100%' }
//                         ]}
//                         className={getRowError(index, 'currency') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
//                       />
//                       {getRowError(index, 'currency') && (
//                         <div className="flex items-center mt-1 text-red-500 text-xs">
//                           {/* <AlertCircle className="w-3 h-3 mr-1" />
//                           <span>Currency is required</span> */}
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   <td className="px-3 py-3 min-w-[100px]">
//                     <input
//                       type="text"
//                       value={detail.rate === 0 ? '' : detail.rate}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'rate', value)
//                       }}
//                       placeholder="0.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownDb || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownDb', value)
//                       }}
//                       placeholder="0.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.ownCr || ''}
//                       onChange={(e) => {
//                         const value = parseFloat(e.target.value) || 0
//                         handleDetailChange(index, 'ownCr', value)
//                       }}
//                       placeholder="0.00"
//                       min="0"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3] text-right"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={detail.amountDb || ''}
//                         onChange={(e) => {
//                           const value = parseFloat(e.target.value) || 0
//                           handleDetailChange(index, 'amountDb', value)
//                         }}
//                         onBlur={() => validateRow(detail, index)}
//                         placeholder="0.00"
//                         min="0"
//                         className={`w-full px-2 h-9 py-1 border rounded-lg text-sm focus:outline-none focus:ring-1 text-right ${
//                           getRowError(index, 'amount') 
//                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
//                             : 'border-gray-300 focus:ring-[#509ee3] focus:border-[#509ee3]'
//                         }`}
//                       />
//                     </div>
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={detail.amountCr || ''}
//                         onChange={(e) => {
//                           const value = parseFloat(e.target.value) || 0
//                           handleDetailChange(index, 'amountCr', value)
//                         }}
//                         onBlur={() => validateRow(detail, index)}
//                         placeholder="0.00"
//                         min="0"
//                         className={`w-full px-2 h-9 py-1 border rounded-lg text-sm focus:outline-none focus:ring-1 text-right ${
//                           getRowError(index, 'amount') 
//                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
//                             : 'border-gray-300 focus:ring-[#509ee3] focus:border-[#509ee3]'
//                         }`}
//                       />
//                       {getRowError(index, 'amount') && (
//                         <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
//                           {/* <AlertCircle className="w-3 h-3 mr-1" />
//                           <span>Either Debit or Credit required</span> */}
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.idCard || ''}
//                       onChange={(e) => handleDetailChange(index, 'idCard', e.target.value)}
//                       placeholder="ID Card"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[120px]">
//                     <input
//                       type="text"
//                       value={detail.bank || ''}
//                       onChange={(e) => handleDetailChange(index, 'bank', e.target.value)}
//                       placeholder="Bank"
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   <td className="px-3 py-3 min-w-[140px]">
//                     <input
//                       type="date"
//                       value={detail.bankDate ? new Date(detail.bankDate).toISOString().split('T')[0] : ''}
//                       onChange={(e) => {
//                         const dateValue = e.target.value || null
//                         handleDetailChange(index, 'bankDate', dateValue)
//                       }}
//                       className="w-full px-2 h-9 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
//                     />
//                   </td>

//                   <td className="px-2 py-3">
//                     {journalDetails.length > 1 && (
//                       <Button
//                         variant="danger"
//                         size="md"
//                         onClick={() => onRemoveRow(index)}
//                         icon={<Trash2 className="w-3 h-3" />}
//                       >
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//             <tfoot className="border-[#dbeafe] rounded rounded-sm w-full">
//               <tr>
//                 <td colSpan={8} className="px-3 py-3 text-right font-semibold text-gray-900">
//                   Totals:
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-green-600">
//                   {formatAmount(totals.debitTotal)}
//                 </td>
//                 <td className="px-3 py-3 text-right font-semibold text-blue-600">
//                   {formatAmount(totals.creditTotal)}
//                 </td>
//                 <td colSpan={4} className="px-3 py-3 text-center">
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${totals.difference === 0
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                     }`}>
//                     {totals.difference === 0 ? 'Balanced' : `Diff: ${formatAmount(totals.difference)}`}
//                   </span>
//                 </td>
//               </tr>

//               {totals.difference > 0 && balancingCoaId && (
//                 <tr className="bg-blue-50">
//                   <td colSpan={8} className="px-3 py-2 text-right text-sm text-blue-700">
//                     Auto-balancing entry:
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.creditTotal > totals.debitTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td className="px-3 py-2 text-right text-sm font-medium text-blue-700">
//                     {totals.debitTotal > totals.creditTotal ? formatAmount(totals.difference) : '0.00'}
//                   </td>
//                   <td colSpan={4} className="px-3 py-2 text-center">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Auto</span>
//                   </td>
//                 </tr>
//               )}
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoucherDetails







































































'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import SelectableTable from '@/components/SelectableTable'
import { JournalDetail } from '@/types/journalVoucher'
import { formatAmount, formatDisplayDate } from '@/utils/formatters'
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
          <Button
            variant="primary"
            size="sm"
            onClick={onAddRow}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Row
          </Button>
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
