'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { ChevronDown, X, Search } from 'lucide-react'

interface Option {
  id: string | number
  name: string
  [key: string]: any // For additional data
}

interface SearchableInputProps {
  label?: string
  placeholder?: string
  options: Option[]
  value?: string | number
  onChange?: (selectedId: string | number, selectedOption: Option) => void
  onSearch?: (searchTerm: string) => void
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '86'
  disabled?: boolean
  clearable?: boolean
  loading?: boolean
  noResultsText?: string
  maxHeight?: string
}

export const SearchableInput: React.FC<SearchableInputProps> = ({
  label,
  placeholder = 'Search...',
  options = [],
  value,
  onChange,
  onSearch,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  maxWidth,
  disabled = false,
  clearable = true,
  loading = false,
  noResultsText = 'No results found',
  maxHeight = 'max-h-60'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ✅ Variants (same as Input component)
  const variants = {
    default: 'bg-white border border-gray-300',
    filled: 'bg-gray-50 border-0',
    outlined: 'bg-transparent border-2 border-gray-300'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm', 
    lg: 'px-6 py-3 text-base'
  }

  const maxWidths = {
    sm: 'max-w-xs',
    md: 'max-w-sm', 
    lg: 'max-w-md',
    xl: 'max-w-lg',
    '86': 'max-w-86'
  }

  // ✅ Get selected option for display
  const selectedOption = options.find(option => option.id === value)
  const displayValue = selectedOption ? selectedOption.name : searchTerm

  // ✅ Filter options based on search term
  const filteredOptions = searchTerm 
    ? options.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  // ✅ Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    setIsOpen(true)
    setFocusedIndex(-1)
    onSearch?.(newSearchTerm)
  }

  // ✅ Handle option selection
  const handleOptionSelect = (option: Option) => {
    onChange?.(option.id, option)
    setSearchTerm('')
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  // ✅ Handle clear
  const handleClear = () => {
    setSearchTerm('')
    onChange?.('', {} as Option)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // ✅ Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true)
        return
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionSelect(filteredOptions[focusedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentStatus = error ? 'error' : 'default'
  const statusClasses = {
    default: 'focus:ring-[#509ee3] focus:border-[#509ee3]',
    error: 'focus:ring-red-500 focus:border-red-500 border-red-300'
  }

  return (
    <div className={clsx('relative', maxWidth && maxWidths[maxWidth])} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {/* {label} */}
        </label>
      )}
      
      <div className="relative">
        {/* ✅ Search input */}
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'w-full rounded-lg shadow-sm transition-colors duration-200',
            'placeholder-gray-400 focus:outline-none focus:ring-2',
            'pl-10 pr-12', // Space for icons
            variants[variant],
            statusClasses[currentStatus],
            sizes[size],
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        {/* ✅ Search icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        {/* ✅ Right side icons */}
        <div className="absolute inset-y-0 right-0 flex items-center">
          {clearable && (value || searchTerm) && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronDown className={clsx(
              'w-4 h-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </button>
        </div>

        {/* ✅ Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={clsx(
                'absolute z-50 w-full mt-1 bg-white border border-gray-200',
                'rounded-lg shadow-lg overflow-hidden',
                maxHeight,
                'overflow-y-auto'
              )}
            >
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Loading...
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={clsx(
                      'w-full px-4 py-2 text-left text-sm transition-colors',
                      'hover:bg-gray-50 focus:bg-gray-50',
                      'focus:outline-none border-b border-gray-100 last:border-b-0',
                      index === focusedIndex && 'bg-[#509ee3] text-white hover:bg-[#4990d6]',
                      option.id === value && 'bg-blue-50 text-blue-900 font-medium'
                    )}
                  >
                    <div className="truncate">{option.name}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {option.description}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {noResultsText}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Error and helper text */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
      
      {/* {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )} */}
    </div>
  )
}
