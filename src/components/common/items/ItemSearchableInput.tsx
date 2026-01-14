'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'
import { Package, Search, X, ChevronDown } from 'lucide-react'

interface Item {
  id: number;
  itemName: string;
  uom1?: {
    id: number;
    uom: string;
  };
}

interface ItemSearchableInputProps {
  label?: string;
  value: number | null;
  onChange: (itemId: number | null, item?: Item) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  excludeIds?: number[];
}

export const ItemSearchableInput: React.FC<ItemSearchableInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search items...',
  required = false,
  error,
  disabled = false,
  excludeIds = []
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: itemsData, isLoading } = useGetAllItemsQuery()
  
  const items: Item[] = itemsData?.data || []
  
  // Filter items based on search and exclusions
  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    const notExcluded = !excludeIds.includes(item.id)
    return matchesSearch && notExcluded
  })

  // Get selected item details
  const selectedItem = items.find(item => item.id === value)

  // Close dropdown when clicking outside
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

  const handleSelect = (item: Item) => {
    onChange(item.id, item)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setSearchTerm('')
  }

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Display Selected or Search Input */}
        <div
          onClick={handleInputClick}
          className={`
            flex items-center justify-between w-full rounded-lg border px-4 py-2.5 text-sm cursor-pointer
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isOpen ? 'ring-1 ring-[#509ee3] border-[#509ee3]' : ''}
          `}
        >
          {isOpen ? (
            <div className="flex items-center flex-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="flex-1 outline-none bg-transparent"
                disabled={disabled}
              />
            </div>
          ) : selectedItem ? (
            <div className="flex items-center flex-1">
              <Package className="w-4 h-4 text-[#509ee3] mr-2" />
              <span className="text-gray-900">{selectedItem.itemName}</span>
              {/* {selectedItem.uom1 && (
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {selectedItem.uom1.uom}
                </span>
              )} */}
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          
          <div className="flex items-center">
            {selectedItem && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded mr-1"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Loading items...</div>
            ) : filteredItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No items found</div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`
                    flex items-center px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors
                    ${value === item.id ? 'bg-blue-50' : ''}
                  `}
                >
                  <Package className="w-4 h-4 text-[#509ee3] mr-3" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                    {/* {item.uom1 && (
                      <div className="text-xs text-gray-500">UOM: {item.uom1.uom}</div>
                    )} */}
                  </div>
                  {value === item.id && (
                    <div className="w-2 h-2 bg-[#509ee3] rounded-full"></div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
