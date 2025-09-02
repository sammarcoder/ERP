'use client'

import React, { useState, useEffect, useRef } from 'react'

interface SearchableDropdownProps {
  label?: string
  name: string
  value: number | null
  onChange: (name: string, value: number | null) => void
  options: Array<{ id: number; label: string; [key: string]: any }>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  displayKey?: string
  valueKey?: string
  onSelect?: (item: any) => void
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  displayKey = 'label',
  valueKey = 'id',
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, options, displayKey])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt[valueKey] === value)

  const handleSelect = (option: any) => {
    onChange(name, option[valueKey])
    if (onSelect) onSelect(option)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div
        className={`w-full px-3 py-2 border rounded-md cursor-pointer flex justify-between items-center ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-blue-500'
        } ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-white p-2 border-b">
            <input
              type="text"
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option[valueKey]}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option[displayKey]}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableDropdown
