// components/ui/UomSearchableInput.tsx

'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
// import { useGetAllUomsQuery } from '@/store/slice/uomSlice'
import { Search, ChevronDown, X, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

// =============================================
// TYPES
// =============================================

interface UomOption {
  id: number
  uom: string
}

interface UomSearchableInputProps {
  value: number | null | undefined
  onChange: (selectedId: number | null, selectedOption?: UomOption | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  required?: boolean
}

// =============================================
// COMPONENT
// =============================================

const UomSearchableInput: React.FC<UomSearchableInputProps> = ({
  value,
  onChange,
  placeholder = 'Select UOM...',
  label,
  disabled = false,
  error,
  clearable = true,
  size = 'md',
  className,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [displayValue, setDisplayValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: uomList = [], isLoading } = useGetAllUomsQuery()

  // =============================================
  // FILTERED OPTIONS
  // =============================================

  const filteredOptions = useMemo(() => {
    let filtered = uomList

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter((uom: any) => {
        const name = (uom.uom || '').toLowerCase()
        return name.includes(search)
      })
    }

    return filtered.map((uom: any) => ({
      id: uom.id,
      uom: uom.uom || ''
    }))
  }, [uomList, searchTerm])

  // =============================================
  // SET DISPLAY VALUE
  // =============================================

  useEffect(() => {
    if (value && uomList.length > 0) {
      const selected = uomList.find((uom: any) => uom.id === Number(value))
      if (selected) {
        setDisplayValue(selected.uom || '')
      }
    } else if (!value) {
      setDisplayValue('')
    }
  }, [value, uomList])

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

  const handleSelect = useCallback((option: UomOption) => {
    onChange(option.id, option)
    setDisplayValue(option.uom)
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
