'use client'

import React, { useState, useEffect } from 'react'

interface MultiSelectItemTableProps {
  options: any[]
  columns: any[]
  onSelectionComplete: (selectedItems: any[]) => void
  onCancel: () => void
  isPurchase?: boolean
}

const MultiSelectItemTable: React.FC<MultiSelectItemTableProps> = ({
  options,
  columns,
  onSelectionComplete,
  onCancel,
  isPurchase = false
}) => {
  const [classData, setClassData] = useState({
    class1: [],
    class2: [],
    class3: [],
    class4: []
  })
  
  const [classFilters, setClassFilters] = useState({
    itemClass1: null,
    itemClass2: null,
    itemClass3: null,
    itemClass4: null
  })
  
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [selectedItems, setSelectedItems] = useState(new Set<number>())
  const [selectAll, setSelectAll] = useState(false)

  // Fetch class data
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const promises = [1, 2, 3, 4].map(id =>
          fetch(`http://${window.location.hostname}:5000/api/z-classes/get-by-class-id/${id}`)
            .then(res => res.json())
        )
        const results = await Promise.all(promises)

        setClassData({
          class1: results[0]?.getByclassID || [],
          class2: results[1]?.getByclassID || [],
          class3: results[2]?.getByclassID || [],
          class4: results[3]?.getByclassID || []
        })
      } catch (error) {
        console.error('Error fetching class data:', error)
      }
    }

    fetchClassData()
  }, [])

  // Filter options based on class selections
  useEffect(() => {
    let filtered = [...options]

    if (classFilters.itemClass1) {
      filtered = filtered.filter(item => item.itemClass1 === classFilters.itemClass1)
    }
    if (classFilters.itemClass2) {
      filtered = filtered.filter(item => item.itemClass2 === classFilters.itemClass2)
    }
    if (classFilters.itemClass3) {
      filtered = filtered.filter(item => item.itemClass3 === classFilters.itemClass3)
    }
    if (classFilters.itemClass4) {
      filtered = filtered.filter(item => item.itemClass4 === classFilters.itemClass4)
    }

    setFilteredOptions(filtered)
    
    // Clear selections when filters change
    setSelectedItems(new Set())
    setSelectAll(false)
  }, [classFilters, options])

  // Update selectAll state when selectedItems or filteredOptions change
  useEffect(() => {
    setSelectAll(
      filteredOptions.length > 0 && 
      selectedItems.size === filteredOptions.length
    )
  }, [selectedItems, filteredOptions])

  const handleClassChange = (className: string, value: number | null) => {
    setClassFilters(prev => ({
      ...prev,
      [className]: value
    }))
  }

  const resetAllFilters = () => {
    setClassFilters({
      itemClass1: null,
      itemClass2: null,
      itemClass3: null,
      itemClass4: null
    })
  }

  const resetIndividualFilter = (filterName: string) => {
    setClassFilters(prev => ({
      ...prev,
      [filterName]: null
    }))
  }

  const handleItemToggle = (itemId: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredOptions.map(item => item.id)))
    }
  }

  const handleConfirm = () => {
    const selectedItemData = options.filter(item => selectedItems.has(item.id))
    onSelectionComplete(selectedItemData)
  }

  const hasActiveFilters = classFilters.itemClass1 || classFilters.itemClass2 || classFilters.itemClass3 || classFilters.itemClass4

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${isPurchase ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-green-50 to-green-100'}`}>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <svg className={`w-6 h-6 mr-2 ${isPurchase ? 'text-blue-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Bulk Add Items
            {selectedItems.size > 0 && (
              <span className={`ml-2 px-3 py-1 ${isPurchase ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} rounded-full text-sm font-bold`}>
                {selectedItems.size} selected
              </span>
            )}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-[calc(90vh-120px)]">
          
          {/* Class Filters Section - Compact at top */}
          <div className="border-b border-gray-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.586V13.414a1 1 0 00-.293-.707L2.293 6.293A1 1 0 012 5.586V4z" />
                </svg>
                <span className="font-bold text-blue-800">FILTER BY CLASS</span>
                <span className="text-sm text-blue-700">
                  ({filteredOptions.length} of {options.length} items shown)
                </span>
              </div>
              
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>

            {/* Compact Class Dropdowns Grid */}
            <div className="grid grid-cols-4 gap-3">
              {/* Class 1 */}
              <div className="relative">
                <label className="text-xs text-blue-700 mb-1 block font-medium">Class 1</label>
                <div className="relative">
                  <select
                    value={classFilters.itemClass1 || ''}
                    onChange={(e) => handleClassChange('itemClass1', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-2 py-1 pr-8 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Any Class 1</option>
                    {classData?.class1?.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.className}
                      </option>
                    ))}
                  </select>
                  {classFilters.itemClass1 && (
                    <button
                      type="button"
                      onClick={() => resetIndividualFilter('itemClass1')}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                      title="Clear Class 1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Class 2 */}
              <div className="relative">
                <label className="text-xs text-blue-700 mb-1 block font-medium">Class 2</label>
                <div className="relative">
                  <select
                    value={classFilters.itemClass2 || ''}
                    onChange={(e) => handleClassChange('itemClass2', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-2 py-1 pr-8 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Any Class 2</option>
                    {classData?.class2?.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.className}
                      </option>
                    ))}
                  </select>
                  {classFilters.itemClass2 && (
                    <button
                      type="button"
                      onClick={() => resetIndividualFilter('itemClass2')}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                      title="Clear Class 2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Class 3 */}
              <div className="relative">
                <label className="text-xs text-blue-700 mb-1 block font-medium">Class 3</label>
                <div className="relative">
                  <select
                    value={classFilters.itemClass3 || ''}
                    onChange={(e) => handleClassChange('itemClass3', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-2 py-1 pr-8 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Any Class 3</option>
                    {classData?.class3?.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.className}
                      </option>
                    ))}
                  </select>
                  {classFilters.itemClass3 && (
                    <button
                      type="button"
                      onClick={() => resetIndividualFilter('itemClass3')}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                      title="Clear Class 3"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Class 4 */}
              <div className="relative">
                <label className="text-xs text-blue-700 mb-1 block font-medium">Class 4</label>
                <div className="relative">
                  <select
                    value={classFilters.itemClass4 || ''}
                    onChange={(e) => handleClassChange('itemClass4', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-2 py-1 pr-8 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Any Class 4</option>
                    {classData?.class4?.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.className}
                      </option>
                    ))}
                  </select>
                  {classFilters.itemClass4 && (
                    <button
                      type="button"
                      onClick={() => resetIndividualFilter('itemClass4')}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                      title="Clear Class 4"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-1 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-white sticky top-0 shadow-sm border-b">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className={`rounded border-gray-300 ${isPurchase ? 'text-blue-600 focus:ring-blue-500' : 'text-green-600 focus:ring-green-500'}`}
                        title={selectAll ? "Deselect all filtered items" : "Select all filtered items"}
                      />
                    </th>
                    {columns.map((col, idx) => (
                      <th key={idx} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOptions.map((item, idx) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                        selectedItems.has(item.id) 
                          ? isPurchase 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'bg-green-50 border-l-4 border-green-500'
                          : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                      onClick={() => handleItemToggle(item.id)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleItemToggle(item.id)}
                          className={`rounded border-gray-300 ${isPurchase ? 'text-blue-600 focus:ring-blue-500' : 'text-green-600 focus:ring-green-500'}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className="px-4 py-3 text-sm">
                          {col.key === 'itemName' ? (
                            <span className="font-medium text-gray-900">{item[col.key]}</span>
                          ) : (
                            <span className="text-gray-600">{item[col.key] || '-'}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg">No items match current filters</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Footer with action buttons */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{selectedItems.size}</span> items selected from{' '}
                <span className="font-semibold">{filteredOptions.length}</span> shown
                {hasActiveFilters && (
                  <span className="text-blue-600 ml-2">
                    (filtered from {options.length} total)
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={selectedItems.size === 0}
                  className={`px-6 py-2 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPurchase 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Add {selectedItems.size} Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiSelectItemTable
