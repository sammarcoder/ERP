// // components/common/JournalSearchableInput.tsx

// 'use client'
// import React, { useMemo } from 'react'
// import { SearchableInput } from '../SearchableInput'
// import { useGetJournalVouchersByTypeQuery } from '@/store/slice/journalVoucherSlice'
// import { FileText } from 'lucide-react'

// interface JournalOption {
//   id: string | number
//   name: string
//   voucherNo: string
//   date: string
//   [key: string]: any
// }

// interface JournalSearchableInputProps {
//   value?: string | number
//   onChange?: (selectedId: string | number, selectedOption: JournalOption) => void
//   label?: string
//   placeholder?: string
//   error?: string
//   helperText?: string
//   variant?: 'default' | 'filled' | 'outlined'
//   size?: 'sm' | 'md' | 'lg'
//   maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '86'
//   required?: boolean
//   disabled?: boolean
//   clearable?: boolean
// }

// export const JournalSearchableInput: React.FC<JournalSearchableInputProps> = ({
//   value,
//   onChange,
//   label = 'Link to Journal Voucher',
//   placeholder = 'Search journal vouchers...',
//   error,
//   helperText = 'Select the Journal Voucher to link this Petty Cash',
//   variant = 'default',
//   size = 'md',
//   maxWidth,
//   required = false,
//   disabled = false,
//   clearable = true
// }) => {
//   // Fetch Journal Vouchers (voucherTypeId = 10)
//   const {
//     data: journalVouchers,
//     isLoading,
//     error: apiError
//   } = useGetJournalVouchersByTypeQuery()

//   // Transform data for SearchableInput
//   const options = useMemo(() => {
//     if (!journalVouchers || !Array.isArray(journalVouchers)) return []

//     return journalVouchers.map((voucher: any) => {
//       const date = voucher.date 
//         ? new Date(voucher.date).toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric'
//           })
//         : ''

//       return {
//         id: voucher.id,
//         name: `${voucher.voucherNo} - ${date}`,
//         voucherNo: voucher.voucherNo,
//         date: voucher.date,
//         description: date,
//         originalData: voucher
//       }
//     })
//   }, [journalVouchers])

//   return (
//     <div className="space-y-1">
//       {/* Badge showing count */}
//       <div className="flex items-center gap-2 mb-2">
//         <FileText className="w-4 h-4 text-blue-600" />
//         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//           {options.length} Journal Vouchers available
//         </span>
//       </div>

//       {/* Searchable Input */}
//       <SearchableInput
//         label={required ? `${label} *` : label}
//         placeholder={placeholder}
//         options={options}
//         value={value}
//         onChange={onChange}
//         error={error || (apiError ? 'Failed to load journal vouchers' : undefined)}
//         helperText={helperText}
//         variant={variant}
//         size={size}
//         maxWidth={maxWidth}
//         disabled={disabled}
//         clearable={clearable}
//         loading={isLoading}
//         noResultsText="No journal vouchers found"
//       />
//     </div>
//   )
// }

// export default JournalSearchableInput


















































// components/common/JournalSearchableInput.tsx

'use client'
import React, { useMemo } from 'react'
import { SearchableInput } from '../SearchableInput'
import { useGetJournalVouchersByTypeQuery } from '@/store/slice/journalVoucherSlice'
import { FileText } from 'lucide-react'

interface JournalOption {
  id: string | number
  name: string
  voucherNo: string
  date: string
  [key: string]: any
}

interface JournalSearchableInputProps {
  value?: string | number
  onChange?: (selectedId: string | number, selectedOption: JournalOption) => void
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '86'
  required?: boolean
  disabled?: boolean
  clearable?: boolean
  filterType?: 'all' | 'unposted'  // ✅ NEW: Filter variant
}

export const JournalSearchableInput: React.FC<JournalSearchableInputProps> = ({
  value,
  onChange,
  label = 'Link to Journal Voucher',
  placeholder = 'Search journal vouchers...',
  error,
  helperText = 'Select the Journal Voucher to link this Petty Cash',
  variant = 'default',
  size = 'md',
  maxWidth,
  required = false,
  disabled = false,
  clearable = true,
  filterType = 'all'  // ✅ Default: show all
}) => {
  // Fetch Journal Vouchers (voucherTypeId = 10)
  const {
    data: journalVouchers,
    isLoading,
    error: apiError
  } = useGetJournalVouchersByTypeQuery()

  // ✅ Transform and filter data for SearchableInput
  const options = useMemo(() => {
    if (!journalVouchers || !Array.isArray(journalVouchers)) return []

    // ✅ Filter based on filterType
    let filteredVouchers = journalVouchers

    if (filterType === 'unposted') {
      // Only show unposted vouchers (status = false or 0)
      filteredVouchers = journalVouchers.filter((voucher: any) => 
        voucher.status === false || voucher.status === 0
      )
    }

    return filteredVouchers.map((voucher: any) => {
      const date = voucher.date 
        ? new Date(voucher.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        : ''

      return {
        id: voucher.id,
        name: `${voucher.voucherNo} - ${date}`,
        voucherNo: voucher.voucherNo,
        date: voucher.date,
        status: voucher.status,
        description: date,
        originalData: voucher
      }
    })
  }, [journalVouchers, filterType])

  // ✅ Dynamic label based on filter
  const badgeLabel = filterType === 'unposted' 
    ? `${options.length} Unposted Journal Vouchers available`
    : `${options.length} Journal Vouchers available`

  return (
    <div className="space-y-1">
      {/* Badge showing count */}
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-blue-600" />
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {badgeLabel}
        </span>
      </div>

      {/* Searchable Input */}
      <SearchableInput
        label={required ? `${label} *` : label}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
        error={error || (apiError ? 'Failed to load journal vouchers' : undefined)}
        helperText={helperText}
        variant={variant}
        size={size}
        maxWidth={maxWidth}
        disabled={disabled}
        clearable={clearable}
        loading={isLoading}
        noResultsText={filterType === 'unposted' 
          ? "No unposted journal vouchers found" 
          : "No journal vouchers found"
        }
      />
    </div>
  )
}

export default JournalSearchableInput
