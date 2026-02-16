// components/ui/SimpleItemSelector.tsx

'use client'
import React, { useState, useMemo } from 'react'
import { useGetAllItemsQuery, Item } from '@/store/slice/itemsApi'
import { Search, X, Check, Loader2, Filter, Package } from 'lucide-react'

// =============================================
// TYPES
// =============================================

interface UomData {
  primary: { id: number; name: string; qty: number }
  secondary?: { id: number; name: string; qty: number }
  tertiary?: { id: number; name: string; qty: number }
}

export interface SelectedItem {
  id: number
  itemName: string
  uomData: UomData
}

interface SimpleItemSelectorProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (items: SelectedItem[]) => void
  excludeIds?: number[]
  title?: string
}

// =============================================
// HELPER: Build UOM Data
// =============================================

const buildUomData = (item: Item): UomData => ({
  primary: {
    id: item.skuUOM || 0,
    name: item.uom1?.uom || 'Unit',
    qty: 1
  },
  secondary: item.uomTwo && item.uom2_qty ? {
    id: item.uom2 || 0,
    name: item.uomTwo?.uom || '',
    qty: Number(item.uom2_qty) || 1
  } : undefined,
  tertiary: item.uomThree && item.uom3_qty ? {
    id: item.uom3 || 0,
    name: item.uomThree?.uom || '',
    qty: Number(item.uom3_qty) || 1
  } : undefined
})

// =============================================
// COMPONENT
// =============================================

const SimpleItemSelector: React.FC<SimpleItemSelectorProps> = ({
  isOpen,
  onClose,
  onAdd,
  excludeIds = [],
  title = 'Select Items'
}) => {
  // State
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Map<number, SelectedItem>>(new Map())
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    class1: '' as string,
    class2: '' as string,
    class3: '' as string,
    class4: '' as string
  })

  // RTK Query
  const { data: itemsResponse, isLoading } = useGetAllItemsQuery({
    page: 1,
    limit: 500,
    includeClasses: true
  })

  // Extract items array from response
  const items: Item[] = itemsResponse?.data || []

  // Extract unique class options from items
  const classOptions = useMemo(() => {
    const class1Set = new Map<number, string>()
    const class2Set = new Map<number, string>()
    const class3Set = new Map<number, string>()
    const class4Set = new Map<number, string>()

    items.forEach((item: Item) => {
      if (item.class1?.id && item.class1?.className) {
        class1Set.set(item.class1.id, item.class1.className)
      }
      if (item.class2?.id && item.class2?.className) {
        class2Set.set(item.class2.id, item.class2.className)
      }
      if (item.class3?.id && item.class3?.className) {
        class3Set.set(item.class3.id, item.class3.className)
      }
      if (item.class4?.id && item.class4?.className) {
        class4Set.set(item.class4.id, item.class4.className)
      }
    })

    return {
      class1: Array.from(class1Set.entries()).map(([id, name]) => ({ id, name })),
      class2: Array.from(class2Set.entries()).map(([id, name]) => ({ id, name })),
      class3: Array.from(class3Set.entries()).map(([id, name]) => ({ id, name })),
      class4: Array.from(class4Set.entries()).map(([id, name]) => ({ id, name }))
    }
  }, [items])

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item: Item) => {
      // Exclude already added items
      if (excludeIds.includes(item.id)) return false

      // Search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        if (!item.itemName?.toLowerCase().includes(searchLower)) return false
      }

      // Class filters
      if (filters.class1 && item.itemClass1 !== parseInt(filters.class1)) return false
      if (filters.class2 && item.itemClass2 !== parseInt(filters.class2)) return false
      if (filters.class3 && item.itemClass3 !== parseInt(filters.class3)) return false
      if (filters.class4 && item.itemClass4 !== parseInt(filters.class4)) return false

      return true
    })
  }, [items, search, excludeIds, filters])

  // Toggle selection
  const toggleSelect = (item: Item) => {
    const newSelected = new Map(selected)
    if (newSelected.has(item.id)) {
      newSelected.delete(item.id)
    } else {
      newSelected.set(item.id, {
        id: item.id,
        itemName: item.itemName,
        uomData: buildUomData(item)
      })
    }
    setSelected(newSelected)
  }

  // Select all visible
  const selectAll = () => {
    const newSelected = new Map(selected)
    filteredItems.forEach((item: Item) => {
      if (!newSelected.has(item.id)) {
        newSelected.set(item.id, {
          id: item.id,
          itemName: item.itemName,
          uomData: buildUomData(item)
        })
      }
    })
    setSelected(newSelected)
  }

  // Clear selection
  const clearSelection = () => {
    setSelected(new Map())
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({ class1: '', class2: '', class3: '', class4: '' })
  }

  // Handle add
  const handleAdd = () => {
    onAdd(Array.from(selected.values()))
    setSelected(new Map())
  }

  // Handle close
  const handleClose = () => {
    setSelected(new Map())
    setSearch('')
    clearFilters()
    onClose()
  }

  // Check if any filter is active
  const hasActiveFilters = filters.class1 || filters.class2 || filters.class3 || filters.class4

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-t-lg text-white">
          <div className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toggle */}
        <div className="p-4 border-b space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
                autoFocus
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
                hasActiveFilters 
                  ? 'bg-[#509ee3] text-white border-[#509ee3]' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-white text-[#509ee3] text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {[filters.class1, filters.class2, filters.class3, filters.class4].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Class Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
              {/* Class 1 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Class 1</label>
                <select
                  value={filters.class1}
                  onChange={(e) => setFilters(prev => ({ ...prev, class1: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                >
                  <option value="">All</option>
                  {classOptions.class1.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>

              {/* Class 2 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Class 2</label>
                <select
                  value={filters.class2}
                  onChange={(e) => setFilters(prev => ({ ...prev, class2: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                >
                  <option value="">All</option>
                  {classOptions.class2.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>

              {/* Class 3 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Class 3</label>
                <select
                  value={filters.class3}
                  onChange={(e) => setFilters(prev => ({ ...prev, class3: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                >
                  <option value="">All</option>
                  {classOptions.class3.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>

              {/* Class 4 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Class 4</label>
                <select
                  value={filters.class4}
                  onChange={(e) => setFilters(prev => ({ ...prev, class4: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#509ee3]"
                >
                  <option value="">All</option>
                  {classOptions.class4.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="col-span-2 md:col-span-4 text-sm text-red-600 hover:text-red-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Selection Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
              {selected.size > 0 && (
                <span className="ml-2 text-[#509ee3] font-medium">
                  • {selected.size} selected
                </span>
              )}
            </span>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-[#509ee3] hover:underline"
                disabled={filteredItems.length === 0}
              >
                Select all
              </button>
              {selected.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-red-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#509ee3]" />
              <span className="ml-2 text-gray-500">Loading items...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No items found</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2 text-[#509ee3] hover:underline text-sm">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item: Item) => {
                const isSelected = selected.has(item.id)
                
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[#509ee3]/10 border border-[#509ee3]' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${
                      isSelected 
                        ? 'bg-[#509ee3] border-[#509ee3]' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{item.itemName}</div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-2">
                        <span>{item.uom1?.uom || 'Unit'}</span>
                        {item.uomTwo?.uom && <span>• {item.uomTwo.uom}</span>}
                        {item.uomThree?.uom && <span>• {item.uomThree.uom}</span>}
                      </div>
                    </div>

                    {/* Class Tags */}
                    <div className="flex gap-1 ml-2 flex-shrink-0 flex-wrap max-w-[150px]">
                      {item.class1?.className && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded truncate max-w-[70px]" title={item.class1.className}>
                          {item.class1.className}
                        </span>
                      )}
                      {item.class2?.className && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded truncate max-w-[70px]" title={item.class2.className}>
                          {item.class2.className}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-600">
            {selected.size > 0 ? (
              <span className="font-medium text-[#509ee3]">{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
            ) : (
              <span>Select items to add</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={selected.size === 0}
              className="px-4 py-2 bg-[#509ee3] text-white rounded-lg hover:bg-[#4990d6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Items {selected.size > 0 && `(${selected.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleItemSelector
