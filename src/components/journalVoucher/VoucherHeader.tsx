
// 'use client'
// import React from 'react'
// import { Input } from '@/components/ui/Input'
// import SelectableTable from '@/components/SelectableTable'
// import { formatDisplayDate } from '@/utils/formatters'
// import { FileText, Calendar, Building2, AlertCircle } from 'lucide-react'

// interface VoucherHeaderProps {
//   voucherType: 'journal' | 'pettycash'
//   formData: {
//     voucherNo: string
//     date: string
//     coaId: number | null
//     status: boolean
//   }
//   filteredCoaAccounts: Array<{ id: number; label: string; acCode: string; acName: string }>
//   errors: { [key: string]: string }
//   onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   onCoaChange: (name: string, value: number | null) => void
// }

// const VoucherHeader: React.FC<VoucherHeaderProps> = ({
//   voucherType,
//   formData,
//   filteredCoaAccounts,
//   errors,
//   onInputChange,
//   onCoaChange
// }) => {
//   const config = {
//     journal: { 
//       title: 'Journal Voucher', 
//       coaLabel: 'Journal Balance Account',
//       icon: FileText
//     },
//     pettycash: { 
//       title: 'Petty Cash Voucher', 
//       coaLabel: 'Petty Cash Account',
//       icon: Building2
//     }
//   }

//   const IconComponent = config[voucherType].icon

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//       <div className="flex items-center mb-6">
//         <IconComponent className="w-6 h-6 mr-3 text-[#509ee3]" />
//         <h2 className="text-xl font-semibold text-gray-900">
//           {config[voucherType].title} Information
//         </h2>
//         <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//           {filteredCoaAccounts.length} accounts available
//         </div>
//          <div className="flex items-center space-x-2 ml-4">
//             <input
//               type="checkbox"
//               id="opening"
//               // checked={isOpening}
//               // onChange={(e) => setIsOpening(e.target.checked)}
//               className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//             />
//             <label htmlFor="opening" className="text-sm font-medium text-gray-700">
//               Opening
//             </label>
//           </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Input
//           label="Voucher Number"
//           name="voucherNo"
//           value={formData.voucherNo}
//           onChange={onInputChange}
//           placeholder="Enter voucher number"
//           error={errors.voucherNo}
//           icon={<FileText className="w-4 h-4" />}
//           required
//         />

//         <div>
//           <Input
//             label="Date"
//             name="date"
//             type="date"
//             value={formData.date}
//             onChange={onInputChange}
//             error={errors.date}
//             icon={<Calendar className="w-4 h-4" />}
//             required
//           />
//           {formData.date && (
//             <div className="mt-1 text-xs text-gray-500 flex items-center">
//               <Calendar className="w-3 h-3 mr-1" />
//               Display: {formatDisplayDate(formData.date)}
//             </div>
//           )}
//         </div>

//         <SelectableTable
//           label={config[voucherType].coaLabel}
//           name="coaId"
//           value={formData.coaId}
//           onChange={onCoaChange}
//           options={filteredCoaAccounts}
//           placeholder={`Select ${config[voucherType].coaLabel.toLowerCase()}`}
//           displayKey="label"
//           columns={[
//             { key: 'acCode', label: 'Code', width: '30%' },
//             { key: 'acName', label: 'Name', width: '70%' }
//           ]}
//           required
//         />
//       </div>

//       {filteredCoaAccounts.length === 0 && (
//         <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-sm text-red-600 flex items-center">
//             <AlertCircle className="w-4 h-4 mr-2" />
//             No {config[voucherType].coaLabel.toLowerCase()} accounts found. Please check your COA setup.
//           </p>
//         </div>
//       )}

//       {errors.coaId && (
//         <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-sm text-red-600 flex items-center">
//             <AlertCircle className="w-4 h-4 mr-2" />
//             {errors.coaId}
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VoucherHeader






































// // components/vouchers/VoucherHeader.tsx

// 'use client'
// import React from 'react'
// import { Input } from '@/components/ui/Input'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import { JournalSearchableInput } from '@/components/common/journal/JournalSearchableInput'  // ✅ NEW
// import { formatDisplayDate } from '@/utils/formatters'
// import { FileText, Calendar, AlertCircle, Link2 } from 'lucide-react'

// interface VoucherHeaderProps {
//   voucherType: 'journal' | 'pettycash'
//   formData: {
//     voucherNo: string
//     date: string
//     coaId: number | null
//     status: boolean
//   }
//   errors: { [key: string]: string }
//   isOpening: boolean
//   linkedJournalId: number | null  // ✅ NEW
//   onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   onCoaChange: (selectedId: string | number, selectedOption: any) => void
//   onOpeningChange: (checked: boolean) => void
//   onLinkedJournalChange: (selectedId: string | number, selectedOption: any) => void  // ✅ NEW
// }

// const VoucherHeader: React.FC<VoucherHeaderProps> = ({
//   voucherType,
//   formData,
//   errors,
//   isOpening,
//   linkedJournalId,  // ✅ NEW
//   onInputChange,
//   onCoaChange,
//   onOpeningChange,
//   onLinkedJournalChange  // ✅ NEW
// }) => {
//   const config = {
//     journal: {
//       title: 'Journal Voucher',
//       coaLabel: 'Journal Balance Account',
//       prefix: 'JV-'
//     },
//     pettycash: {
//       title: 'Petty Cash Voucher',
//       coaLabel: 'Petty Cash Account',
//       prefix: 'PC-'
//     }
//   }[voucherType]

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//       {/* Header */}
//       <div className="flex items-center mb-6">
//         <FileText className="w-6 h-6 mr-3 text-[#509ee3]" />
//         <h2 className="text-xl font-semibold text-gray-900">
//           {config.title} Information
//         </h2>

//         {/* Opening Checkbox */}
//         <div className="flex items-center space-x-2 ml-auto">
//           <input
//             type="checkbox"
//             id="opening"
//             checked={isOpening}
//             onChange={(e) => onOpeningChange(e.target.checked)}
//             className="h-4 w-4 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//           />
//           <label htmlFor="opening" className="text-sm font-medium text-gray-700">
//             Opening
//           </label>
//         </div>
//       </div>

//       {/* ✅ Link to Journal - ONLY for Petty Cash */}
//       {/* {voucherType === 'pettycash' && (
//         <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <div className="flex items-center gap-2 mb-3">
//             <Link2 className="w-5 h-5 text-blue-600" />
//             <h3 className="font-semibold text-blue-900">Link to Journal Voucher</h3>
//             <span className="text-red-500">*</span>
//           </div>

//           <JournalSearchableInput
//             value={linkedJournalId || ''}
//             onChange={onLinkedJournalChange}
//             placeholder="Search and select a Journal Voucher..."
//             error={errors.linkedJournalId}
//             required
//             clearable
//           />

//           {!linkedJournalId && !errors.linkedJournalId && (
//             <p className="mt-2 text-sm text-blue-600">
//               <AlertCircle className="w-4 h-4 inline mr-1" />
//               Petty Cash must be linked to a Journal Voucher
//             </p>
//           )}
//         </div>
//       )} */}

//       <div className="flex items-start gap-6">
//         {/* Voucher Number */}
//         <div className='mt-2' >
//           <Input
//             label="Voucher Number"
//             name="voucherNo"
//             value={formData.voucherNo}
//             onChange={onInputChange}
//             placeholder={`${config.prefix}001`}
//             error={errors.voucherNo}
//             icon={<FileText className="w-4 h-4" />}
//             required
//           />
//           {/* <p className="mt-1 text-xs text-gray-500">
//             Prefix: <span className="font-mono font-semibold text-blue-600">{config.prefix}</span>
//           </p> */}
//         </div>

//         {/* Date */}
//         <div className='mt-2'>
//           <Input
//             label="Date"
//             name="date"
//             type="date"
//             value={formData.date}
//             onChange={onInputChange}
//             error={errors.date}
//             icon={<Calendar className="w-4 h-4" />}
//             required
//           />
//           {/* {formData.date && (
//             <p className="mt-1 text-xs text-gray-500 flex items-center">
//               <Calendar className="w-3 h-3 mr-1" />
//               Display: {formatDisplayDate(formData.date)}
//             </p>
//           )} */}
//         </div>

//         {/* COA Searchable Input */}
//         <CoaSearchableInput
//           orderType={voucherType}
//           label={config.coaLabel}
//           value={formData.coaId || ''}
//           onChange={onCoaChange}
//           placeholder={`Select ${config.coaLabel.toLowerCase()}`}
//           error={errors.coaId}
//           required
//           showFilter={false}
//           clearable
//         />
//         {voucherType === 'pettycash' && (
//           <div className="rounded-lg">
//             <JournalSearchableInput
//               value={linkedJournalId || ''}
//               onChange={onLinkedJournalChange}
//               placeholder="Search and select a Journal Voucher..."
//               error={errors.linkedJournalId}
//               required
//               clearable
//               filterType="unposted"  // ✅ Only show unposted journals
//             />
//           </div>
//         )}

//       </div>

//       {/* COA Error */}
//       {errors.coaId && (
//         <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-sm text-red-600 flex items-center">
//             <AlertCircle className="w-4 h-4 mr-2" />
//             {errors.coaId}
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VoucherHeader






















































// // components/vouchers/VoucherHeader.tsxbf cf

// 'use client'
// import React from 'react'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import { JournalSearchableInput } from '@/components/common/journal/JournalSearchableInput'
// import { Calendar, FileText, Hash } from 'lucide-react'

// interface VoucherConfig {
//   type: string
//   prefix: string
//   balanceLabel: string
//   title: string
// }

// interface VoucherHeaderProps {
//   voucherType: 'journal' | 'pettycash'
//   formData: {
//     voucherNo: string
//     date: string
//     coaId: number | null
//   }
//   config: VoucherConfig
//   errors: { [key: string]: string }
//   isOpening: boolean
//   linkedJournalId: number | null
//   onFormDataChange: (field: string, value: any) => void
//   onCoaChange: (selectedId: string | number, selectedOption: any) => void
//   onIsOpeningChange: (value: boolean) => void
//   onLinkedJournalChange: (selectedId: string | number, selectedOption: any) => void
//   bf?: number
//   cf?: number
//   bfLoading?: boolean
// }

// const VoucherHeader: React.FC<VoucherHeaderProps> = ({
//   voucherType,
//   formData,
//   config,
//   errors,
//   isOpening,
//   linkedJournalId,
//   onFormDataChange,
//   onCoaChange,
//   onIsOpeningChange,
//   onLinkedJournalChange,
//   bf = 0,
//   cf = 0,
//   bfLoading = false
// }) => {

//   // ✅ Format BF/CF display
//   const formatBFCF = (value: number) => {
//     const absValue = Math.abs(value).toLocaleString('en-US', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     })
//     // if (value < 0) return `(${absValue}) Dr`
//     // if (value > 0) return `${absValue} Cr`
//     if (value < 0) return `(${absValue})`
//     if (value > 0) return `${absValue}`
//     return '0.00'
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//       {/* Title */}
//       <div className="flex items-center mb-6">
//         <FileText className="w-6 h-6 mr-2 text-[#509ee3]" />
//         <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
//       </div>

//       {/* Form Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Voucher Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             <Hash className="w-4 h-4 inline mr-1" />
//             Voucher No <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={formData.voucherNo}
//             onChange={(e) => onFormDataChange('voucherNo', e.target.value)}
//             placeholder={`${config.prefix}XXX`}
//             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] ${
//               errors.voucherNo ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.voucherNo && (
//             <p className="mt-1 text-sm text-red-500">{errors.voucherNo}</p>
//           )}
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             <Calendar className="w-4 h-4 inline mr-1" />
//             Date <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="date"
//             value={formData.date}
//             onChange={(e) => onFormDataChange('date', e.target.value)}
//             className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] ${
//               errors.date ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.date && (
//             <p className="mt-1 text-sm text-red-500">{errors.date}</p>
//           )}
//         </div>

//         {/* Balancing COA */}
//         <div>
//           {/* <label className="block text-sm font-medium text-gray-700 mb-2">
//             {config.balanceLabel} <span className="text-red-500">*</span>
//           </label> */}
//           <CoaSearchableInput
//             orderType={voucherType}
//             value={formData.coaId || ''}
//             onChange={onCoaChange}
//             placeholder={`Select ${config.balanceLabel.toLowerCase()}...`}
//             error={errors.coaId}
//             showFilter={false}
//             clearable
//             size="md"
//           />
//         </div>

//         {/* Is Opening Checkbox */}
//         <div className="flex items-center pt-8">
//           <input
//             type="checkbox"
//             id="isOpening"
//             checked={isOpening}
//             onChange={(e) => onIsOpeningChange(e.target.checked)}
//             className="h-5 w-5 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
//           />
//           <label htmlFor="isOpening" className="ml-2 text-sm font-medium text-gray-700">
//             Opening Entry
//           </label>
//         </div>
//       </div>

//       {/* Linked Journal (Petty Cash Only) */}
//       {voucherType === 'pettycash' && (
//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <JournalSearchableInput
//             value={linkedJournalId || ''}
//             onChange={onLinkedJournalChange}
//             placeholder="Search and select a Journal Voucher..."
//             error={errors.linkedJournalId}
//             required
//             clearable
//             filterType="unposted"
//           />
//         </div>
//       )}

//       {/* ✅ BF & CF Display */}
//       {(voucherType === 'journal' || voucherType === 'pettycash') && formData.coaId && (
//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//             {/* BF Card */}
//             <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   {/* <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
//                     B/F 
//                   </p> */}
//                   {/* <p className="text-xs text-blue-500 mt-1">Opening Balance</p> */}
//                 </div>
//                 <div className="text-right">
//                   {bfLoading ? (
//                     <div className="animate-pulse bg-blue-200 h-8 w-24 rounded"></div>
//                   ) : (
//                     <p className={`text-2xl font-bold ${bf >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
//                       {formatBFCF(bf)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* CF Card */}
//             <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   {/* <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
//                     C/F 
//                   </p> */}
//                   {/* <p className="text-xs text-green-500 mt-1">Closing Balance</p> */}
//                 </div>
//                 <div className="text-right">
//                   {bfLoading ? (
//                     <div className="animate-pulse bg-green-200 h-8 w-24 rounded"></div>
//                   ) : (
//                     <p className={`text-2xl font-bold ${cf >= 0 ? 'text-green-700' : 'text-red-600'}`}>
//                       {formatBFCF(cf)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default VoucherHeader


























































// components/vouchers/VoucherHeader.tsx

'use client'
import React from 'react'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { JournalSearchableInput } from '@/components/common/journal/JournalSearchableInput'
import { Calendar, FileText, Hash } from 'lucide-react'
import { Input } from '@/components/ui/Input'

// =============================================
// TYPES
// =============================================

interface VoucherConfig {
  type: number
  prefix: string
  balanceLabel: string
  title: string
  coaFilter: string
  listPath: string
}

interface VoucherHeaderProps {
  voucherType: 'journal' | 'pettycash'
  formData: {
    voucherNo: string
    date: string
    coaId: number | null
  }
  config: VoucherConfig
  errors: { [key: string]: string }
  isOpening: boolean
  linkedJournalId: number | null
  onFormDataChange: (field: string, value: any) => void
  onCoaChange: (selectedId: string | number, selectedOption: any) => void
  onIsOpeningChange: (value: boolean) => void
  onLinkedJournalChange: (selectedId: string | number, selectedOption: any) => void
  bf?: number
  cf?: number
  bfLoading?: boolean
  allTotals?: { debit: number; credit: number; difference: number }
  coaTotals?: { debit: number; credit: number; difference: number } | null
}

// =============================================
// COMPONENT
// =============================================

const VoucherHeader: React.FC<VoucherHeaderProps> = ({
  voucherType,
  formData,
  config = {
    type: 10,
    prefix: 'JV-',
    balanceLabel: 'Balance Account',
    title: 'Voucher',
    coaFilter: 'isJvBalance',
    listPath: '/vouchers'
  },
  errors = {},
  isOpening = false,
  linkedJournalId = null,
  onFormDataChange,
  onCoaChange,
  onIsOpeningChange,
  onLinkedJournalChange,
  bf = 0,
  cf = 0,
  bfLoading = false,
  allTotals = { debit: 0, credit: 0, difference: 0 },
  coaTotals = null
}) => {

  // ✅ Format BF/CF display
  const formatBFCF = (value: number) => {
    const absValue = Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    if (value < 0) return `(${absValue})`
    if (value > 0) return `${absValue}`
    // if (value < 0) return `(${absValue}) Dr`
    // if (value > 0) return `${absValue} Cr`
    return '0.00'
  }

  // ✅ Format amount display
  const formatAmount = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Title */}
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 mr-2 text-[#509ee3]" />
        <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Voucher Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-3">
            <Hash className="w-4 h-4 inline mr-1" />
            Voucher No <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.voucherNo}
            onChange={(e) => onFormDataChange('voucherNo', e.target.value)}
            placeholder={`${config.prefix}XXX`}

            size="md"
            required
          />
          {errors.voucherNo && (
            <p className="mt-1 text-sm text-red-500">{errors.voucherNo}</p>
          )}
        </div>

        {/* Date */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => onFormDataChange('date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3] ${errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
          )}
        </div> */}
        <div className='mt-2'>
          <Input
            type="date"
            label={`Date *`}
            // value={value.date}
            value={formData.date}
            // onChange={(e) => {
            //   console.log('📅 Date changed:', e.target.value)
            //   updateField('date', e.target.value)
            // }}
            onChange={(e) => onFormDataChange('date', e.target.value)}
            error={errors.date}
            icon={<Calendar className="w-4 h-4" />}
            variant="default"
            size="md"
            required
          />
        </div>


        {/* Balancing COA */}
        <div>
          {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            {config.balanceLabel} <span className="text-red-500">*</span>
          </label> */}
          <CoaSearchableInput
            orderType={voucherType}
            value={formData.coaId || ''}
            onChange={onCoaChange}
            placeholder={`Select ${config.balanceLabel.toLowerCase()}...`}
            error={errors.coaId}
            showFilter={false}
            clearable
            size="md"
          />
        </div>

        {/* Is Opening Checkbox */}
        <div className="flex items-center pt-8">
          <input
            type="checkbox"
            id="isOpening"
            checked={isOpening}
            onChange={(e) => onIsOpeningChange(e.target.checked)}
            className="h-5 w-5 text-[#509ee3] focus:ring-[#509ee3] border-gray-300 rounded"
          />
          <label htmlFor="isOpening" className="ml-2 text-sm font-medium text-gray-700">
            Opening Entry
          </label>
        </div>
      </div>

      {/* Linked Journal (Petty Cash Only) */}
      {voucherType === 'pettycash' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <JournalSearchableInput
            value={linkedJournalId || ''}
            onChange={onLinkedJournalChange}
            placeholder="Search and select a Journal Voucher..."
            error={errors.linkedJournalId}
            required
            clearable
            filterType="unposted"
          />
        </div>
      )}

      {/* ✅ All Totals + COA Totals + BF & CF Display */}
      {(voucherType === 'journal' || voucherType === 'pettycash') && formData.coaId && (
        <div className="mt-6 pt-6 border-t border-gray-200">

          {/* Row 1: All Totals + COA Totals */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  All Vouchers Total
                </p>
                {allTotals.difference === 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Balanced
                  </span>
                )}
              </div>
              {bfLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="bg-gray-200 h-4 w-24 rounded"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Debit</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatAmount(allTotals.debit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Credit</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatAmount(allTotals.credit)}
                    </p>
                  </div>
                </div>
              )}
            </div>

         
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                  {config.balanceLabel} Total
                </p>
                {coaTotals && (
                  <span className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs font-medium">
                    COA #{formData.coaId}
                  </span>
                )}
              </div>
              {bfLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="bg-purple-200 h-4 w-24 rounded"></div>
                  <div className="bg-purple-200 h-4 w-24 rounded"></div>
                </div>
              ) : coaTotals ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-purple-500">Debit</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatAmount(coaTotals.debit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-500">Credit</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatAmount(coaTotals.credit)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No data for this COA</p>
              )}
            </div>
          </div> */}

          {/* Row 2: BF & CF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BF Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    B/F (Brought Forward)
                  </p>
                  <p className="text-xs text-blue-500 mt-1">Opening Balance</p>
                </div>
                <div className="text-right">
                  {bfLoading ? (
                    <div className="animate-pulse bg-blue-200 h-8 w-24 rounded"></div>
                  ) : (
                    <p className={`text-2xl font-bold ${bf >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                      {formatBFCF(bf)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CF Card */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                    C/F (Carried Forward)
                  </p>
                  <p className="text-xs text-green-500 mt-1">Closing Balance</p>
                </div>
                <div className="text-right">
                  {bfLoading ? (
                    <div className="animate-pulse bg-green-200 h-8 w-24 rounded"></div>
                  ) : (
                    <p className={`text-2xl font-bold ${cf >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {formatBFCF(cf)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VoucherHeader
