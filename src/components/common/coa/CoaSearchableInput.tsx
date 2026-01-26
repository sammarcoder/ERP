// // components/ui/CoaSearchableInput.tsx - Context-Based Filtering
// 'use client'
// import React, { useState } from 'react'
// import { SearchableInput } from '../SearchableInput'
// import { useGetAllCoaQuery, useGetCustomerCoaQuery, useGetSupplierCoaQuery,  useGetCoaByCarriageQuery, } from '@/store/slice/coaApi'
// import { User, Users, Building2 } from 'lucide-react'

// interface CoaOption {
//   id: string | number
//   name: string
//   description?: string
//   [key: string]: any
// }

// interface CoaSearchableInputProps {
//   orderType?: 'sales' | 'purchase' // ✅ Context for filtering
//   value?: string | number
//   onChange?: (selectedId: string | number, selectedOption: CoaOption) => void
//   onSearch?: (searchTerm: string) => void
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
//   showFilter?: boolean
// }

// export const CoaSearchableInput: React.FC<CoaSearchableInputProps> = ({
//   orderType, // ✅ Determines available filter options
//   value,
//   onChange,
//   onSearch,
//   label,
//   placeholder,
//   error,
//   helperText,
//   variant = 'default',
//   size = 'md',
//   maxWidth,
//   required = false,
//   disabled = false,
//   clearable = true,
//   showFilter = true
// }) => {
//   // ✅ Context-based filter options
//   const getAvailableFilters = () => {
//     if (orderType === 'sales') {
//       return ['all', 'customer'] as const
//     } else if (orderType === 'purchase') {
//       return ['all', 'supplier'] as const
//     }
//     return ['all', 'customer', 'supplier'] as const // Default for general usage
//   }

//   const availableFilters = getAvailableFilters()
//   // const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>('all')
//   const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>(
//   orderType === 'sales'
//     ? 'customer'
//     : orderType === 'purchase'
//     ? 'supplier'
//     : 'all'
// )


//   // ✅ API calls based on filter selection
//   const {
//     data: allData,
//     isLoading: allLoading,
//     error: allError
//   } = useGetAllCoaQuery(undefined, {
//     skip: filterType !== 'all'
//   })

//   const {
//     data: customerData,
//     isLoading: customerLoading,
//     error: customerError
//   } = useGetCustomerCoaQuery(undefined, {
//     skip: filterType !== 'customer'
//   })

//   const {
//     data: supplierData,
//     isLoading: supplierLoading,
//     error: supplierError
//   } = useGetSupplierCoaQuery(undefined, {
//     skip: filterType !== 'supplier'
//   })

//   // ✅ Get current data based on selected filter
//   const getCurrentData = () => {
//     switch (filterType) {
//       case 'customer':
//         return { data: customerData, loading: customerLoading, error: customerError }
//       case 'supplier':
//         return { data: supplierData, loading: supplierLoading, error: supplierError }
//       default:
//         return { data: allData, loading: allLoading, error: allError }
//     }
//   }

//   const { data, loading, error: apiError } = getCurrentData()

//   // ✅ Transform data for SearchableInput
//   const options = React.useMemo(() => {
//     if (!data) return []

//     let coaList = data
//     if (!Array.isArray(data)) {
//       coaList = data.data || data.zCoaRecords || []
//     }

//     if (!Array.isArray(coaList)) {
//       console.warn('❌ COA data is not an array:', coaList)
//       return []
//     }

//     return coaList.map((coa: any) => ({
//       id: coa.id || coa.Id,
//       name: coa.acName || coa.name || 'Unknown Account',
//       // description: `${coa.city || ''} ${coa.mobileNo || ''}`.trim() || 'No details',
//       originalData: coa
//     }))
//   }, [data])

//   // ✅ Handle filter change
//   const handleFilterChange = (newFilter: 'all' | 'customer' | 'supplier') => {
//     console.log(`🎛️ Filter changed to: ${newFilter} (Context: ${orderType})`)
//     setFilterType(newFilter)
//     onChange?.('', {} as CoaOption) // Clear selection when filter changes
//   }

//   // ✅ Get contextual labels
//   const getContextualLabels = () => {
//     if (orderType === 'sales') {
//       return {
//         label: label || 'Customer',
//         placeholder: placeholder || 'Search customers...',
//         helperText: helperText || 'Select customer for this order'
//       }
//     } else if (orderType === 'purchase') {
//       return {
//         label: label || 'Supplier',
//         placeholder: placeholder || 'Search suppliers...',
//         helperText: helperText || 'Select supplier for this order'
//       }
//     }
//     return {
//       label: label || 'Select Account',
//       placeholder: placeholder || 'Search accounts...',
//       helperText: helperText || 'Select account for this transaction'
//     }
//   }

//   const labels = getContextualLabels()

//   // ✅ Get appropriate icon
//   const getIcon = () => {
//     if (orderType === 'sales') return <User className="w-4 h-4" />
//     if (orderType === 'purchase') return <Building2 className="w-4 h-4" />

//     switch (filterType) {
//       case 'customer': return <User className="w-4 h-4" />
//       case 'supplier': return <Building2 className="w-4 h-4" />
//       default: return <Users className="w-4 h-4" />
//     }
//   }

//   return (

//     <>
//       <div className="space-y-1  pb-10 ">
//         {/* ✅ Context-Aware Radio Button Filter */}
//         {showFilter && (
//           <div className="flex gap-4 text-sm">
//             {/* Always show All Accounts */}
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="coaFilter"
//                 value="all"
//                 checked={filterType === 'all'}
//                 onChange={() => handleFilterChange('all')}
//                 className="text-[#509ee3] focus:ring-[#509ee3]"
//               />
//               <span className="text-gray-700">All Accounts</span>
//             </label>

//             {/* Show Customers Only for sales or general usage */}
//             {availableFilters.includes('customer') && (
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="coaFilter"
//                   value="customer"
//                   checked={filterType === 'customer'}
//                   onChange={() => handleFilterChange('customer')}
//                   className="text-[#509ee3] focus:ring-[#509ee3]"
//                 />
//                 <span className="text-gray-700">Customers</span>
//               </label>
//             )}

//             {/* Show Suppliers Only for purchase or general usage */}
//             {availableFilters.includes('supplier') && (
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="coaFilter"
//                   value="supplier"
//                   checked={filterType === 'supplier'}
//                   onChange={() => handleFilterChange('supplier')}
//                   className="text-[#509ee3] focus:ring-[#509ee3]"
//                 />
//                 <span className="text-gray-700">Suppliers Only</span>
//               </label>
//             )}
//           </div>
//         )}

//         {/* ✅ Searchable Input */}
//         <SearchableInput
//           label={required ? `${labels.label} *` : labels.label}
//           placeholder={labels.placeholder}
//           options={options}
//           value={value}
//           onChange={onChange}
//           onSearch={onSearch}
//           error={error || (apiError ? 'Failed to load accounts' : undefined)}
//           helperText={`${labels.helperText} (Showing: ${filterType})`}
//           variant={variant}
//           size={size}
//           maxWidth={maxWidth}
//           disabled={disabled}
//           clearable={clearable}
//           loading={loading}
//           noResultsText={`No ${filterType === 'all' ? 'accounts' : filterType + 's'} found`}
//           icon={getIcon()}
//         />
//       </div>
//     </>

//   )
// }




























































// // components/ui/CoaSearchableInput.tsx - WITH CARRIAGE SUPPORT
// 'use client'
// import React, { useState } from 'react'
// import { SearchableInput } from '../SearchableInput'
// import { 
//   useGetAllCoaQuery, 
//   useGetCustomerCoaQuery, 
//   useGetSupplierCoaQuery,
//   useGetCoaByCarriageQuery 
// } from '@/store/slice/coaApi'
// import { User, Users, Building2, Truck } from 'lucide-react'

// interface CoaOption {
//   id: string | number
//   name: string
//   description?: string
//   [key: string]: any
// }

// interface CoaSearchableInputProps {
//   orderType?: 'sales' | 'purchase' | 'carriage' // ✅ Added carriage
//   value?: string | number
//   onChange?: (selectedId: string | number, selectedOption: CoaOption) => void
//   onSearch?: (searchTerm: string) => void
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
//   showFilter?: boolean
// }

// export const CoaSearchableInput: React.FC<CoaSearchableInputProps> = ({
//   orderType,
//   value,
//   onChange,
//   onSearch,
//   label,
//   placeholder,
//   error,
//   helperText,
//   variant = 'default',
//   size = 'md',
//   maxWidth,
//   required = false,
//   disabled = false,
//   clearable = true,
//   showFilter = true
// }) => {
//   // ✅ Context-based filter options
//   const getAvailableFilters = () => {
//     if (orderType === 'sales') {
//       return ['all', 'customer'] as const
//     } else if (orderType === 'purchase') {
//       return ['all', 'supplier'] as const
//     } else if (orderType === 'carriage') {
//       return ['carriage'] as const // ✅ Only carriage filter for carriage context
//     }
//     return ['all', 'customer', 'supplier'] as const
//   }

//   const availableFilters = getAvailableFilters()
  
//   const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier' | 'carriage'>(
//     orderType === 'sales'
//       ? 'customer'
//       : orderType === 'purchase'
//       ? 'supplier'
//       : orderType === 'carriage'
//       ? 'carriage' // ✅ Auto-select carriage filter
//       : 'all'
//   )

//   // ✅ API calls based on filter selection
//   const {
//     data: allData,
//     isLoading: allLoading,
//     error: allError
//   } = useGetAllCoaQuery(undefined, {
//     skip: filterType !== 'all'
//   })

//   const {
//     data: customerData,
//     isLoading: customerLoading,
//     error: customerError
//   } = useGetCustomerCoaQuery(undefined, {
//     skip: filterType !== 'customer'
//   })

//   const {
//     data: supplierData,
//     isLoading: supplierLoading,
//     error: supplierError
//   } = useGetSupplierCoaQuery(undefined, {
//     skip: filterType !== 'supplier'
//   })

//   // ✅ NEW: Carriage API call
//   const {
//     data: carriageData,
//     isLoading: carriageLoading,
//     error: carriageError
//   } = useGetCoaByCarriageQuery(undefined, {
//     skip: filterType !== 'carriage'
//   })

//   // ✅ Get current data based on selected filter
//   const getCurrentData = () => {
//     switch (filterType) {
//       case 'customer':
//         return { data: customerData, loading: customerLoading, error: customerError }
//       case 'supplier':
//         return { data: supplierData, loading: supplierLoading, error: supplierError }
//       case 'carriage': // ✅ NEW: Handle carriage data
//         return { data: carriageData, loading: carriageLoading, error: carriageError }
//       default:
//         return { data: allData, loading: allLoading, error: allError }
//     }
//   }

//   const { data, loading, error: apiError } = getCurrentData()

//   // ✅ Transform data for SearchableInput
//   const options = React.useMemo(() => {
//     if (!data) return []

//     let coaList = data
//     if (!Array.isArray(data)) {
//       coaList = data.data || data.zCoaRecords || []
//     }

//     if (!Array.isArray(coaList)) {
//       console.warn('❌ COA data is not an array:', coaList)
//       return []
//     }

//     return coaList.map((coa: any) => ({
//       id: coa.id || coa.Id,
//       name: coa.acName || coa.name || 'Unknown Account',
//       originalData: coa
//     }))
//   }, [data])

//   // ✅ Handle filter change
//   const handleFilterChange = (newFilter: 'all' | 'customer' | 'supplier' | 'carriage') => {
//     console.log(`🎛️ Filter changed to: ${newFilter} (Context: ${orderType})`)
//     setFilterType(newFilter)
//     onChange?.('', {} as CoaOption)
//   }

//   // ✅ Get contextual labels
//   const getContextualLabels = () => {
//     if (orderType === 'sales') {
//       return {
//         label: label || 'Customer',
//         placeholder: placeholder || 'Search customers...',
//         helperText: helperText || 'Select customer for this order'
//       }
//     } else if (orderType === 'purchase') {
//       return {
//         label: label || 'Supplier',
//         placeholder: placeholder || 'Search suppliers...',
//         helperText: helperText || 'Select supplier for this order'
//       }
//     } else if (orderType === 'carriage') { // ✅ NEW: Carriage labels
//       return {
//         label: label || 'Transporter',
//         placeholder: placeholder || 'Search transporters...',
//         helperText: helperText || 'Select transporter for carriage'
//       }
//     }
//     return {
//       label: label || 'Select Account',
//       placeholder: placeholder || 'Search accounts...',
//       helperText: helperText || 'Select account for this transaction'
//     }
//   }

//   const labels = getContextualLabels()

//   // ✅ Get appropriate icon
//   const getIcon = () => {
//     if (orderType === 'sales') return <User className="w-4 h-4" />
//     if (orderType === 'purchase') return <Building2 className="w-4 h-4" />
//     if (orderType === 'carriage') return <Truck className="w-4 h-4" /> // ✅ NEW: Truck icon

//     switch (filterType) {
//       case 'customer': return <User className="w-4 h-4" />
//       case 'supplier': return <Building2 className="w-4 h-4" />
//       case 'carriage': return <Truck className="w-4 h-4" />
//       default: return <Users className="w-4 h-4" />
//     }
//   }

//   return (
//     <div className="space-y-1 pb-10">
//       {/* ✅ Context-Aware Radio Button Filter */}
//       {showFilter && availableFilters.length > 1 && ( // Hide filter if only one option
//         <div className="flex gap-4 text-sm">
//           {availableFilters.includes('all') && (
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="coaFilter"
//                 value="all"
//                 checked={filterType === 'all'}
//                 onChange={() => handleFilterChange('all')}
//                 className="text-[#509ee3] focus:ring-[#509ee3]"
//               />
//               <span className="text-gray-700">All Accounts</span>
//             </label>
//           )}

//           {availableFilters.includes('customer') && (
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="coaFilter"
//                 value="customer"
//                 checked={filterType === 'customer'}
//                 onChange={() => handleFilterChange('customer')}
//                 className="text-[#509ee3] focus:ring-[#509ee3]"
//               />
//               <span className="text-gray-700">Customers</span>
//             </label>
//           )}

//           {availableFilters.includes('supplier') && (
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="coaFilter"
//                 value="supplier"
//                 checked={filterType === 'supplier'}
//                 onChange={() => handleFilterChange('supplier')}
//                 className="text-[#509ee3] focus:ring-[#509ee3]"
//               />
//               <span className="text-gray-700">Suppliers</span>
//             </label>
//           )}

//           {/* ✅ NEW: Carriage filter (only shows when orderType='carriage') */}
//           {availableFilters.includes('carriage') && (
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="coaFilter"
//                 value="carriage"
//                 checked={filterType === 'carriage'}
//                 onChange={() => handleFilterChange('carriage')}
//                 className="text-[#509ee3] focus:ring-[#509ee3]"
//               />
//               <span className="text-gray-700">Transporters</span>
//             </label>
//           )}
//         </div>
//       )}

//       {/* ✅ Searchable Input */}
//       <SearchableInput
//         label={required ? `${labels.label} *` : labels.label}
//         placeholder={labels.placeholder}
//         options={options}
//         value={value}
//         onChange={onChange}
//         onSearch={onSearch}
//         error={error || (apiError ? 'Failed to load accounts' : undefined)}
//         helperText={`${labels.helperText} (Showing: ${filterType})`}
//         variant={variant}
//         size={size}
//         maxWidth={maxWidth}
//         disabled={disabled}
//         clearable={clearable}
//         loading={loading}
//         noResultsText={`No ${filterType === 'carriage' ? 'transporters' : filterType === 'all' ? 'accounts' : filterType + 's'} found`}
//         icon={getIcon()}
//       />
//     </div>
//   )
// }
































































// components/ui/CoaSearchableInput.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { SearchableInput } from '../SearchableInput'
import { 
  useGetAllCoaQuery, 
  useGetCustomerCoaQuery, 
  useGetSupplierCoaQuery,
  useGetCoaByCarriageQuery 
} from '@/store/slice/coaApi'
import { useGetCoaAccountsQuery } from '@/store/slice/journalVoucherSlice'  
import { User, Users, Building2, Truck, FileText, Wallet } from 'lucide-react'

interface CoaOption {
  id: string | number
  name: string
  description?: string
  [key: string]: any
}

interface CoaSearchableInputProps {
  orderType?: 'sales' | 'purchase' | 'carriage' | 'journal' | 'pettycash'  // ✅ Added journal & pettycash
  value?: string | number
  onChange?: (selectedId: string | number, selectedOption: CoaOption) => void
  onSearch?: (searchTerm: string) => void
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
  showFilter?: boolean
  autoSelectFirst?: boolean  // ✅ New prop
}

export const CoaSearchableInput: React.FC<CoaSearchableInputProps> = ({
  orderType,
  value,
  onChange,
  onSearch,
  label,
  placeholder,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  maxWidth,
  required = false,
  disabled = false,
  clearable = true,
  showFilter = true,
  autoSelectFirst = false  // ✅ Default false
}) => {
  // ✅ Auto-select first for journal & pettycash
  const shouldAutoSelect = autoSelectFirst || orderType === 'journal' || orderType === 'pettycash'

  // ✅ Context-based filter options
  const getAvailableFilters = () => {
    if (orderType === 'sales') {
      return ['all', 'customer'] as const
    } else if (orderType === 'purchase') {
      return ['all', 'supplier'] as const
    } else if (orderType === 'carriage') {
      return ['carriage'] as const
    } else if (orderType === 'journal') {
      return ['journal'] as const  // ✅ Only journal filter
    } else if (orderType === 'pettycash') {
      return ['pettycash'] as const  // ✅ Only pettycash filter
    }
    return ['all', 'customer', 'supplier'] as const
  }

  const availableFilters = getAvailableFilters()
  
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier' | 'carriage' | 'journal' | 'pettycash'>(
    orderType === 'sales'
      ? 'customer'
      : orderType === 'purchase'
      ? 'supplier'
      : orderType === 'carriage'
      ? 'carriage'
      : orderType === 'journal'
      ? 'journal'  // ✅ Auto-select journal filter
      : orderType === 'pettycash'
      ? 'pettycash'  // ✅ Auto-select pettycash filter
      : 'all'
  )

  // ✅ Track if auto-select has been done
  const [hasAutoSelected, setHasAutoSelected] = useState(false)

  // ✅ API calls based on filter selection
  const {
    data: allData,
    isLoading: allLoading,
    error: allError
  } = useGetAllCoaQuery(undefined, {
    skip: filterType !== 'all'
  })

  const {
    data: customerData,
    isLoading: customerLoading,
    error: customerError
  } = useGetCustomerCoaQuery(undefined, {
    skip: filterType !== 'customer'
  })

  const {
    data: supplierData,
    isLoading: supplierLoading,
    error: supplierError
  } = useGetSupplierCoaQuery(undefined, {
    skip: filterType !== 'supplier'
  })

  const {
    data: carriageData,
    isLoading: carriageLoading,
    error: carriageError
  } = useGetCoaByCarriageQuery(undefined, {
    skip: filterType !== 'carriage'
  })

  // ✅ NEW: COA API for Journal & Petty Cash (uses existing journalVoucherApi)
  const {
    data: coaAccountsData,
    isLoading: coaAccountsLoading,
    error: coaAccountsError
  } = useGetCoaAccountsQuery(undefined, {
    skip: filterType !== 'journal' && filterType !== 'pettycash'
  })

  // ✅ Get current data based on selected filter
  const getCurrentData = () => {
    switch (filterType) {
      case 'customer':
        return { data: customerData, loading: customerLoading, error: customerError }
      case 'supplier':
        return { data: supplierData, loading: supplierLoading, error: supplierError }
      case 'carriage':
        return { data: carriageData, loading: carriageLoading, error: carriageError }
      case 'journal':
        return { data: coaAccountsData, loading: coaAccountsLoading, error: coaAccountsError }
      case 'pettycash':
        return { data: coaAccountsData, loading: coaAccountsLoading, error: coaAccountsError }
      default:
        return { data: allData, loading: allLoading, error: allError }
    }
  }

  const { data, loading, error: apiError } = getCurrentData()

  // ✅ Transform and filter data for SearchableInput
  const options = React.useMemo(() => {
    if (!data) return []

    let coaList = data
    if (!Array.isArray(data)) {
      coaList = data.data || data.zCoaRecords || []
    }

    if (!Array.isArray(coaList)) {
      console.warn('❌ COA data is not an array:', coaList)
      return []
    }

    // ✅ Filter based on filterType for journal & pettycash
    let filteredList = coaList
    
    if (filterType === 'journal') {
      filteredList = coaList.filter((coa: any) => coa.isJvBalance === true)
      console.log(`✅ Journal Balance Accounts: ${filteredList.length}`)
    } else if (filterType === 'pettycash') {
      filteredList = coaList.filter((coa: any) => coa.isPettyCash === true)
      console.log(`✅ Petty Cash Accounts: ${filteredList.length}`)
    }

    return filteredList.map((coa: any) => ({
      id: coa.id || coa.Id,
      name: coa.acName || coa.name || 'Unknown Account',
      acCode: coa.acCode || '',
      originalData: coa
    }))
  }, [data, filterType])

  // ✅ Auto-select first record for journal & pettycash
  useEffect(() => {
    if (shouldAutoSelect && options.length > 0 && !value && !hasAutoSelected) {
      console.log(`✅ Auto-selecting first ${filterType} account:`, options[0].name)
      onChange?.(options[0].id, options[0])
      setHasAutoSelected(true)
    }
  }, [options, value, shouldAutoSelect, hasAutoSelected, filterType, onChange])

  // ✅ Reset auto-select flag when orderType changes
  useEffect(() => {
    setHasAutoSelected(false)
  }, [orderType])

  // ✅ Handle filter change
  const handleFilterChange = (newFilter: 'all' | 'customer' | 'supplier' | 'carriage' | 'journal' | 'pettycash') => {
    console.log(`🎛️ Filter changed to: ${newFilter} (Context: ${orderType})`)
    setFilterType(newFilter)
    setHasAutoSelected(false)  // ✅ Reset auto-select on filter change
    onChange?.('', {} as CoaOption)
  }

  // ✅ Get contextual labels
  const getContextualLabels = () => {
    switch (orderType) {
      case 'sales':
        return {
          label: label || 'Customer',
          placeholder: placeholder || 'Search customers...',
          helperText: helperText || 'Select customer for this order'
        }
      case 'purchase':
        return {
          label: label || 'Supplier',
          placeholder: placeholder || 'Search suppliers...',
          helperText: helperText || 'Select supplier for this order'
        }
      case 'carriage':
        return {
          label: label || 'Transporter',
          placeholder: placeholder || 'Search transporters...',
          helperText: helperText || 'Select transporter for carriage'
        }
      case 'journal':  // ✅ NEW
        return {
          label: label || 'Journal Balance Account',
          placeholder: placeholder || 'Search journal accounts...',
          helperText: helperText || 'Select journal balance account'
        }
      case 'pettycash':  // ✅ NEW
        return {
          label: label || 'Petty Cash Account',
          placeholder: placeholder || 'Search petty cash accounts...',
          helperText: helperText || 'Select petty cash account'
        }
      default:
        return {
          label: label || 'Select Account',
          placeholder: placeholder || 'Search accounts...',
          helperText: helperText || 'Select account for this transaction'
        }
    }
  }

  const labels = getContextualLabels()

  // ✅ Get appropriate icon
  const getIcon = () => {
    switch (orderType) {
      case 'sales': return <User className="w-4 h-4" />
      case 'purchase': return <Building2 className="w-4 h-4" />
      case 'carriage': return <Truck className="w-4 h-4" />
      case 'journal': return <FileText className="w-4 h-4" />  // ✅ NEW
      case 'pettycash': return <Wallet className="w-4 h-4" />  // ✅ NEW
      default:
        switch (filterType) {
          case 'customer': return <User className="w-4 h-4" />
          case 'supplier': return <Building2 className="w-4 h-4" />
          case 'carriage': return <Truck className="w-4 h-4" />
          case 'journal': return <FileText className="w-4 h-4" />
          case 'pettycash': return <Wallet className="w-4 h-4" />
          default: return <Users className="w-4 h-4" />
        }
    }
  }

  // ✅ Get no results text
  const getNoResultsText = () => {
    switch (filterType) {
      case 'carriage': return 'No transporters found'
      case 'journal': return 'No journal balance accounts found'
      case 'pettycash': return 'No petty cash accounts found'
      case 'customer': return 'No customers found'
      case 'supplier': return 'No suppliers found'
      default: return 'No accounts found'
    }
  }

  return (
    <div className="space-y-1">
      {/* ✅ Context-Aware Radio Button Filter - Hidden for journal/pettycash since only one option */}
      {showFilter && availableFilters.length > 1 && (
        <div className="flex gap-4 text-sm mb-2">
          {availableFilters.includes('all') && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="coaFilter"
                value="all"
                checked={filterType === 'all'}
                onChange={() => handleFilterChange('all')}
                className="text-[#509ee3] focus:ring-[#509ee3]"
              />
              <span className="text-gray-700">All Accounts</span>
            </label>
          )}

          {availableFilters.includes('customer') && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="coaFilter"
                value="customer"
                checked={filterType === 'customer'}
                onChange={() => handleFilterChange('customer')}
                className="text-[#509ee3] focus:ring-[#509ee3]"
              />
              <span className="text-gray-700">Customers</span>
            </label>
          )}

          {availableFilters.includes('supplier') && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="coaFilter"
                value="supplier"
                checked={filterType === 'supplier'}
                onChange={() => handleFilterChange('supplier')}
                className="text-[#509ee3] focus:ring-[#509ee3]"
              />
              <span className="text-gray-700">Suppliers</span>
            </label>
          )}

          {availableFilters.includes('carriage') && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="coaFilter"
                value="carriage"
                checked={filterType === 'carriage'}
                onChange={() => handleFilterChange('carriage')}
                className="text-[#509ee3] focus:ring-[#509ee3]"
              />
              <span className="text-gray-700">Transporters</span>
            </label>
          )}
        </div>
      )}

      {/* ✅ Account count badge for journal/pettycash */}
      {(orderType === 'journal' || orderType === 'pettycash') && (
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {options.length} {orderType === 'journal' ? 'JV balance' : 'petty cash'} accounts
          </span>
        </div>
      )}

      {/* ✅ Searchable Input */}
      <SearchableInput
        label={required ? `${labels.label} *` : labels.label}
        placeholder={labels.placeholder}
        options={options}
        value={value}
        onChange={onChange}
        onSearch={onSearch}
        error={error || (apiError ? 'Failed to load accounts' : undefined)}
        helperText={helperText}
        variant={variant}
        size={size}
        maxWidth={maxWidth}
        disabled={disabled}
        clearable={clearable}
        loading={loading}
        noResultsText={getNoResultsText()}
      />
    </div>
  )
}
