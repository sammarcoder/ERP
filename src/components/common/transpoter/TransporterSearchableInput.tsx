// components/ui/TransporterSearchableInput.tsx
'use client'
import React from 'react'
import { SearchableInput } from '@/components/common/SearchableInput'
import { useGetAllTransportersQuery } from '@/store/slice/transporterApi'
import { Truck } from 'lucide-react'

interface TransporterSearchableInputProps {
  value?: string | number
  onChange?: (selectedId: string | number, selectedOption: any) => void
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '86'
  required?: boolean
}

export const TransporterSearchableInput: React.FC<TransporterSearchableInputProps> = ({
  value,
  onChange,
  label = 'Select Transporter',
  placeholder = 'Search transporters...',
  error,
  helperText = 'Optional - for delivery',
  variant = 'default',
  size = 'md',
  maxWidth,
  required = false
}) => {
  // ✅ Fetch all transporters
  const {
    data: transportersData,
    isLoading,
    error: apiError
  } = useGetAllTransportersQuery({ limit: 100 }) // Get more transporters

  // ✅ Transform API data to SearchableInput format
  const options = transportersData?.data?.map(transporter => ({
    id: transporter.id,
    name: transporter.name,
    description: `${transporter.contactPerson || ''} - ${transporter.phone || ''}`.trim()
  })) || []

  return (
    <SearchableInput
      label={required ? `${label} *` : label}
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={onChange}
      error={error || (apiError ? 'Failed to load transporters' : undefined)}
      helperText={helperText}
      variant={variant}
      size={size}
      maxWidth={maxWidth}
      loading={isLoading}
      noResultsText="No transporters found"
      icon={<Truck className="w-4 h-4" />}
    />
  )
}
