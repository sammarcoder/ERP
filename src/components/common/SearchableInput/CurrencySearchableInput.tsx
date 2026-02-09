// components/ui/CurrencySearchableInput.tsx

'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useGetCurrenciesQuery } from '@/store/slice/currencySlice'
import { Search, ChevronDown, X, Loader2, DollarSign } from 'lucide-react'
import { clsx } from 'clsx'

// =============================================
// TYPES
// =============================================

interface CurrencyOption {
  id: number
  currencyName: string  // ✅ Fixed: was 'name'
  originalData?: any
}

interface CurrencySearchableInputProps {
  value: number | null | undefined
  onChange: (selectedId: number | null, selectedOption?: CurrencyOption | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  required?: boolean
  excludeIds?: number[]
}

// =============================================
// COMPONENT
// =============================================

export const CurrencySearchableInput: React.FC<CurrencySearchableInputProps> = ({
  value,
  onChange,
  placeholder = 'Select currency...',
  label,
  disabled = false,
  error,
  clearable = true,
  size = 'md',
  className,
  required = false,
  excludeIds = []
}) => {
  // =============================================
  // STATE
  // =============================================

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [displayValue, setDisplayValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: currencies = [], isLoading } = useGetCurrenciesQuery()

  // =============================================
  // FILTER OPTIONS
  // =============================================

  const filteredOptions = useMemo(() => {
    let options = currencies

    // Exclude specific IDs
    if (excludeIds.length > 0) {
      options = options.filter(c => !excludeIds.includes(c.id))
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      options = options.filter(c =>
        c.currencyName?.toLowerCase().includes(search)  // ✅ Fixed: was c.name, c.code
      )
    }

    return options.map(currency => ({
      id: currency.id,
      currencyName: currency.currencyName,  // ✅ Fixed
      originalData: currency
    }))
  }, [currencies, searchTerm, excludeIds])

  // =============================================
  // SET DISPLAY VALUE WHEN VALUE CHANGES
  // =============================================

  useEffect(() => {
    if (value && currencies.length > 0) {
      const selected = currencies.find(c => c.id === Number(value))
      if (selected) {
        setDisplayValue(selected.currencyName)  // ✅ Fixed: was `${code} - ${name}`
      }
    } else if (!value) {
      setDisplayValue('')
    }
  }, [value, currencies])

  // =============================================
  // CLICK OUTSIDE
  // =============================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // =============================================
  // HANDLERS
  // =============================================

  const handleSelect = useCallback((option: CurrencyOption) => {
    onChange(option.id, option)
    setDisplayValue(option.currencyName)  // ✅ Fixed
    setIsOpen(false)
    setSearchTerm('')
  }, [onChange])

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null, null)
    setDisplayValue('')
    setSearchTerm('')
  }, [onChange])

  const handleInputClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(true)
      inputRef.current?.focus()
    }
  }, [disabled])

  // =============================================
  // SIZE CLASSES
  // =============================================

  const sizeClasses = {
    sm: 'px-2 py-1.5 text-sm h-9',
    md: 'px-3 py-2 text-sm h-10',
    lg: 'px-4 py-2.5 text-base h-12'
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input */}
      <div
        onClick={handleInputClick}
        className={clsx(
          'flex items-center w-full border rounded-lg cursor-pointer transition-colors',
          sizeClasses[size],
          disabled && 'bg-gray-100 cursor-not-allowed',
          error ? 'border-red-500' : isOpen ? 'border-[#509ee3] ring-1 ring-[#509ee3]' : 'border-gray-300',
          !disabled && 'hover:border-gray-400'
        )}
      >
        <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />

        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="flex-1 outline-none bg-transparent"
            autoFocus
          />
        ) : (
          <span className={clsx(
            'flex-1 truncate',
            displayValue ? 'text-gray-900' : 'text-gray-400'
          )}>
            {displayValue || placeholder}
          </span>
        )}

        {/* Clear Button */}
        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded mr-1"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        <ChevronDown className={clsx(
          'w-4 h-4 text-gray-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#509ee3]" />
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-gray-500 text-sm">
              No currencies found
            </div>
          ) : (
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    'px-3 py-2 cursor-pointer hover:bg-[#509ee3]/10 transition-colors',
                    Number(value) === option.id && 'bg-[#509ee3]/20'
                  )}
                >
                  <div className="font-medium text-gray-900">
                    {option.currencyName}  {/* ✅ Fixed */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default CurrencySearchableInput
