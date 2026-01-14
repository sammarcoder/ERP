'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'
import { Package, Search, X, ChevronDown, Check } from 'lucide-react'

interface Item {
  id: number;
  itemName: string;
  uom1?: {
    id: number;
    uom: string;
  };
}

interface ItemMultiSelectInputProps {
  label?: string;
  value: number[];
  onChange: (itemIds: number[], items?: Item[]) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  excludeIds?: number[];
}

export const ItemMultiSelectInput: React.FC<ItemMultiSelectInputProps> = ({
  label,
  value = [],
  onChange,
  placeholder = 'Search and select items...',
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

  // Get selected items details
  const selectedItems = items.filter(item => value.includes(item.id))

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

  const handleToggleItem = (item: Item) => {
    let newValue: number[]
    if (value.includes(item.id)) {
      newValue = value.filter(id => id !== item.id)
    } else {
      newValue = [...value, item.id]
    }
    const newSelectedItems = items.filter(i => newValue.includes(i.id))
    onChange(newValue, newSelectedItems)
  }

  const handleRemoveItem = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation()
    const newValue = value.filter(id => id !== itemId)
    const newSelectedItems = items.filter(i => newValue.includes(i.id))
    onChange(newValue, newSelectedItems)
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([], [])
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
        {/* Selected Items Tags */}
        <div
          onClick={handleInputClick}
          className={`
            min-h-[42px] w-full rounded-lg border px-3 py-2 text-sm cursor-pointer
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isOpen ? 'ring-1 ring-[#509ee3] border-[#509ee3]' : ''}
          `}
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* Selected Item Tags */}
            {selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
              >
                <Package className="w-3 h-3" />
                {item.itemName}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveItem(e, item.id)}
                    className="hover:bg-blue-100 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            
            {/* Search Input */}
            {isOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={selectedItems.length === 0 ? placeholder : 'Add more...'}
                className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                disabled={disabled}
              />
            ) : selectedItems.length === 0 ? (
              <span className="text-gray-400 text-sm">{placeholder}</span>
            ) : null}
          </div>

          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {selectedItems.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
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
              filteredItems.map((item) => {
                const isSelected = value.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    className={`
                      flex items-center px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors
                      ${isSelected ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded border mr-3 flex items-center justify-center
                      ${isSelected ? 'bg-[#509ee3] border-[#509ee3]' : 'border-gray-300'}
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <Package className="w-4 h-4 text-[#509ee3] mr-3" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                      {/* {item.uom1 && (
                        <div className="text-xs text-gray-500">UOM: {item.uom1.uom}</div>
                      )} */}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Selected Count */}
      {selectedItems.length > 0 && (
        <p className="text-xs text-gray-500">{selectedItems.length} item(s) selected</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
