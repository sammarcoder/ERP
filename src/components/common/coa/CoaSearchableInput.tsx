// components/ui/CoaSearchableInput.tsx - Context-Based Filtering
'use client'
import React, { useState } from 'react'
import { SearchableInput } from '../SearchableInput'
import { useGetAllCoaQuery, useGetCustomerCoaQuery, useGetSupplierCoaQuery } from '@/store/slice/coaApi'
import { User, Users, Building2 } from 'lucide-react'

interface CoaOption {
  id: string | number
  name: string
  description?: string
  [key: string]: any
}

interface CoaSearchableInputProps {
  orderType?: 'sales' | 'purchase' // ✅ Context for filtering
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
}

export const CoaSearchableInput: React.FC<CoaSearchableInputProps> = ({
  orderType, // ✅ Determines available filter options
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
  showFilter = true
}) => {
  // ✅ Context-based filter options
  const getAvailableFilters = () => {
    if (orderType === 'sales') {
      return ['all', 'customer'] as const
    } else if (orderType === 'purchase') {
      return ['all', 'supplier'] as const
    }
    return ['all', 'customer', 'supplier'] as const // Default for general usage
  }

  const availableFilters = getAvailableFilters()
  // const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>('all')
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>(
  orderType === 'sales'
    ? 'customer'
    : orderType === 'purchase'
    ? 'supplier'
    : 'all'
)


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

  // ✅ Get current data based on selected filter
  const getCurrentData = () => {
    switch (filterType) {
      case 'customer':
        return { data: customerData, loading: customerLoading, error: customerError }
      case 'supplier':
        return { data: supplierData, loading: supplierLoading, error: supplierError }
      default:
        return { data: allData, loading: allLoading, error: allError }
    }
  }

  const { data, loading, error: apiError } = getCurrentData()

  // ✅ Transform data for SearchableInput
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

    return coaList.map((coa: any) => ({
      id: coa.id || coa.Id,
      name: coa.acName || coa.name || 'Unknown Account',
      // description: `${coa.city || ''} ${coa.mobileNo || ''}`.trim() || 'No details',
      originalData: coa
    }))
  }, [data])

  // ✅ Handle filter change
  const handleFilterChange = (newFilter: 'all' | 'customer' | 'supplier') => {
    console.log(`🎛️ Filter changed to: ${newFilter} (Context: ${orderType})`)
    setFilterType(newFilter)
    onChange?.('', {} as CoaOption) // Clear selection when filter changes
  }

  // ✅ Get contextual labels
  const getContextualLabels = () => {
    if (orderType === 'sales') {
      return {
        label: label || 'Customer',
        placeholder: placeholder || 'Search customers...',
        helperText: helperText || 'Select customer for this order'
      }
    } else if (orderType === 'purchase') {
      return {
        label: label || 'Supplier',
        placeholder: placeholder || 'Search suppliers...',
        helperText: helperText || 'Select supplier for this order'
      }
    }
    return {
      label: label || 'Select Account',
      placeholder: placeholder || 'Search accounts...',
      helperText: helperText || 'Select account for this transaction'
    }
  }

  const labels = getContextualLabels()

  // ✅ Get appropriate icon
  const getIcon = () => {
    if (orderType === 'sales') return <User className="w-4 h-4" />
    if (orderType === 'purchase') return <Building2 className="w-4 h-4" />

    switch (filterType) {
      case 'customer': return <User className="w-4 h-4" />
      case 'supplier': return <Building2 className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  return (

    <>
      <div className="space-y-1  pb-10 ">
        {/* ✅ Context-Aware Radio Button Filter */}
        {showFilter && (
          <div className="flex gap-4 text-sm">
            {/* Always show All Accounts */}
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

            {/* Show Customers Only for sales or general usage */}
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

            {/* Show Suppliers Only for purchase or general usage */}
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
                <span className="text-gray-700">Suppliers Only</span>
              </label>
            )}
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
          helperText={`${labels.helperText} (Showing: ${filterType})`}
          variant={variant}
          size={size}
          maxWidth={maxWidth}
          disabled={disabled}
          clearable={clearable}
          loading={loading}
          noResultsText={`No ${filterType === 'all' ? 'accounts' : filterType + 's'} found`}
          icon={getIcon()}
        />
      </div>
    </>

  )
}
