// 'use client'

// import React, { useState, useEffect } from 'react'
// import SelectableTable from './SelectableTable'

// interface EnhancedSelectableTableProps {
//   label?: string
//   name: string
//   value: any
//   onChange: (name: string, value: any) => void
//   options: any[]
//   placeholder?: string
//   displayKey: string
//   valueKey: string
//   columns: any[]
//   pageSize?: number
//   onItemSelect?: (item: any) => void
//   lineIndex?: number
// }

// const EnhancedSelectableTable: React.FC<EnhancedSelectableTableProps> = ({
//   label,
//   name,
//   value,
//   onChange,
//   options,
//   placeholder,
//   displayKey,
//   valueKey,
//   columns,
//   pageSize = 8,
//   onItemSelect,
//   lineIndex
// }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   // Track local selection to avoid display mismatch on type differences and ensure immediate UI feedback
//   const [localValue, setLocalValue] = useState<any>(value)
//   const [classData, setClassData] = useState({
//     class1: [],
//     class2: [],
//     class3: [],
//     class4: []
//   })
  
//   const [classFilters, setClassFilters] = useState({
//     itemClass1: null,
//     itemClass2: null,
//     itemClass3: null,
//     itemClass4: null
//   })
  
//   const [filteredOptions, setFilteredOptions] = useState(options)

//   // Fetch class data
//   useEffect(() => {
//     const fetchClassData = async () => {
//       try {
//         const promises = [1, 2, 3, 4].map(id =>
//           fetch(`http://${window.location.hostname}:4000/api/z-classes/get-by-class-id/${id}`)
//             .then(res => res.json())
//         )
//         const results = await Promise.all(promises)

//         setClassData({
//           class1: results[0]?.getByclassID || [],
//           class2: results[1]?.getByclassID || [],
//           class3: results[2]?.getByclassID || [],
//           class4: results[3]?.getByclassID || []
//         })
//       } catch (error) {
//         console.error('Error fetching class data:', error)
//       }
//     }

//     fetchClassData()
//   }, [])

//   // Filter options based on class selections - START WITH ALL ITEMS
//   useEffect(() => {
//     let filtered = [...options] // Start with all items

//     // Apply class filters only if they are selected
//     if (classFilters.itemClass1) {
//       filtered = filtered.filter(item => item.itemClass1 === classFilters.itemClass1)
//     }
//     if (classFilters.itemClass2) {
//       filtered = filtered.filter(item => item.itemClass2 === classFilters.itemClass2)
//     }
//     if (classFilters.itemClass3) {
//       filtered = filtered.filter(item => item.itemClass3 === classFilters.itemClass3)
//     }
//     if (classFilters.itemClass4) {
//       filtered = filtered.filter(item => item.itemClass4 === classFilters.itemClass4)
//     }

//     setFilteredOptions(filtered)
//   }, [classFilters, options])

//   const handleClassChange = (className: string, value: number | null) => {
//     setClassFilters(prev => ({
//       ...prev,
//       [className]: value
//     }))
//   }

//   const resetAllFilters = () => {
//     setClassFilters({
//       itemClass1: null,
//       itemClass2: null,
//       itemClass3: null,
//       itemClass4: null
//     })
//   }

//   const resetIndividualFilter = (filterName: string) => {
//     setClassFilters(prev => ({
//       ...prev,
//       [filterName]: null
//     }))
//   }

//   const handleItemSelection = (name: string, value: any) => {
//     setLocalValue(value)
//     onChange(name, value)
    
//     // Call the onItemSelect callback if provided
//     if (onItemSelect) {
//       const selectedItem = options.find(item => item[valueKey] === value)
//       if (selectedItem) {
//         onItemSelect(selectedItem)
//       }
//     }
    
//     setIsOpen(false) // Close popup after selection
//   }

//   // Match by provided value or fallback to localValue without forcing number conversion
//   const selectedItem = options.find(item => item[valueKey] == (value ?? localValue))
//   const hasActiveFilters = classFilters.itemClass1 || classFilters.itemClass2 || classFilters.itemClass3 || classFilters.itemClass4

//   return (
//     <div className="relative">
//       {/* Trigger Button */}
//       <button
//         type="button"
//         onClick={() => setIsOpen(true)}
//         className="w-full px-3 py-0.5 text-left border border-gray-200 rounded-lg bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//       >
//         <div className="flex items-center justify-between">
//           <span className={`text-sm ${selectedItem ? 'text-gray-900' : 'text-gray-500'}`}>
//             {selectedItem ? selectedItem[displayKey] : placeholder}
//           </span>
//           <div className="flex items-center space-x-2">
//             {/* Show filter status or total count */}
//             <div className={`text-xs px-2 py-1 rounded ${hasActiveFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
//               {hasActiveFilters ? `${filteredOptions.length} filtered` : `${options.length} items`}
//             </div>
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </div>
//         </div>
//       </button>

//       {/* Enhanced Popup Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
//               <h3 className="text-xl font-bold text-gray-900 flex items-center">
//                 <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 Select Product/Item
//               </h3>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//               >
//                 <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              
//               {/* Class Filters Section */}
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4">
//                 {/* Filters Header */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.586V13.414a1 1 0 00-.293-.707L2.293 6.293A1 1 0 012 5.586V4z" />
//                     </svg>
//                     <span className="text-lg font-bold text-blue-800">FILTER BY CLASS</span>
//                   </div>
                  
//                   <div className="flex items-center space-x-3">
//                     {/* Show filter status */}
//                     <div className="text-sm text-blue-700">
//                       Showing <span className="font-bold">{filteredOptions.length}</span> of <span className="font-bold">{options.length}</span> items
//                     </div>
//                     {hasActiveFilters && (
//                       <button
//                         type="button"
//                         onClick={resetAllFilters}
//                         className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         <span>Reset All Filters</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Class Dropdowns Grid */}
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* Class 1 */}
//                   <div className="relative">
//                     <label className="text-sm text-blue-700 mb-2 block font-bold">Class 1</label>
//                     <div className="relative">
//                       <select
//                         value={classFilters.itemClass1 || ''}
//                         onChange={(e) => handleClassChange('itemClass1', e.target.value ? Number(e.target.value) : null)}
//                         className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//                       >
//                         <option value="">Any Class 1</option>
//                         {classData?.class1?.map(item => (
//                           <option key={item.id} value={item.id}>
//                             {item.className}
//                           </option>
//                         ))}
//                       </select>
//                       {classFilters.itemClass1 && (
//                         <button
//                           type="button"
//                           onClick={() => resetIndividualFilter('itemClass1')}
//                           className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
//                           title="Clear Class 1"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       )}
//                       <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>

//                   {/* Class 2 */}
//                   <div className="relative">
//                     <label className="text-sm text-blue-700 mb-2 block font-bold">Class 2</label>
//                     <div className="relative">
//                       <select
//                         value={classFilters.itemClass2 || ''}
//                         onChange={(e) => handleClassChange('itemClass2', e.target.value ? Number(e.target.value) : null)}
//                         className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//                       >
//                         <option value="">Any Class 2</option>
//                         {classData?.class2?.map(item => (
//                           <option key={item.id} value={item.id}>
//                             {item.className}
//                           </option>
//                         ))}
//                       </select>
//                       {classFilters.itemClass2 && (
//                         <button
//                           type="button"
//                           onClick={() => resetIndividualFilter('itemClass2')}
//                           className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
//                           title="Clear Class 2"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       )}
//                       <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>

//                   {/* Class 3 */}
//                   <div className="relative">
//                     <label className="text-sm text-blue-700 mb-2 block font-bold">Class 3</label>
//                     <div className="relative">
//                       <select
//                         value={classFilters.itemClass3 || ''}
//                         onChange={(e) => handleClassChange('itemClass3', e.target.value ? Number(e.target.value) : null)}
//                         className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//                       >
//                         <option value="">Any Class 3</option>
//                         {classData?.class3?.map(item => (
//                           <option key={item.id} value={item.id}>
//                             {item.className}
//                           </option>
//                         ))}
//                       </select>
//                       {classFilters.itemClass3 && (
//                         <button
//                           type="button"
//                           onClick={() => resetIndividualFilter('itemClass3')}
//                           className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
//                           title="Clear Class 3"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       )}
//                       <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>

//                   {/* Class 4 */}
//                   <div className="relative">
//                     <label className="text-sm text-blue-700 mb-2 block font-bold">Class 4</label>
//                     <div className="relative">
//                       <select
//                         value={classFilters.itemClass4 || ''}
//                         onChange={(e) => handleClassChange('itemClass4', e.target.value ? Number(e.target.value) : null)}
//                         className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
//                       >
//                         <option value="">Any Class 4</option>
//                         {classData?.class4?.map(item => (
//                           <option key={item.id} value={item.id}>
//                             {item.className}
//                           </option>
//                         ))}
//                       </select>
//                       {classFilters.itemClass4 && (
//                         <button
//                           type="button"
//                           onClick={() => resetIndividualFilter('itemClass4')}
//                           className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
//                           title="Clear Class 4"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       )}
//                       <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Item Selection - Inline table (no nested dropdown) */}
//               <div className="border-t border-gray-200 pt-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <label className="text-lg font-bold text-gray-700 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                     SELECT ITEM
//                   </label>
//                   {value && (
//                     <button
//                       type="button"
//                       onClick={() => handleItemSelection(name, null)}
//                       className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                       <span>Clear Selection</span>
//                     </button>
//                   )}
//                 </div>
//                 <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
//                   {filteredOptions.length > 0 ? (
//                     <table className="w-full">
//                       <thead className="bg-white sticky top-0 shadow-sm">
//                         <tr className="border-b-2 border-gray-100">
//                           {(columns && columns.length > 0 ? columns : [{ key: displayKey, label: 'Name', width: '100%' }]).map((column, index) => (
//                             <th
//                               key={index}
//                               className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
//                               style={{ width: column.width }}
//                             >
//                               {column.label}
//                             </th>
//                           ))}
//                           <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-100">
//                         {filteredOptions.map((option, idx) => (
//                           <tr
//                             key={option[valueKey]}
//                             className={`hover:bg-blue-50 cursor-pointer transition-all duration-150 ${value === option[valueKey] ? 'bg-blue-50 border-l-4 border-blue-500' : ''} ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
//                             onClick={() => handleItemSelection(name, option[valueKey])}
//                           >
//                             {(columns && columns.length > 0 ? columns : [{ key: displayKey, label: 'Name', width: '100%' }]).map((column, index) => (
//                               <td key={index} className="px-6 py-3 text-sm text-gray-900">
//                                 {column.key === displayKey ? (
//                                   <span className="font-medium">{option[column.key]}</span>
//                                 ) : (
//                                   <span className="text-gray-600">{option[column.key] ?? '-'}</span>
//                                 )}
//                               </td>
//                             ))}
//                             <td className="px-6 py-3 text-center">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   handleItemSelection(name, option[valueKey])
//                                 }}
//                                 className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md"
//                               >
//                                 Select
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-40">
//                       <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <p className="text-gray-500 text-sm">
//                         {hasActiveFilters ? 'No items match current filters' : 'No items available'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default EnhancedSelectableTable














































'use client'

import React, { useState, useEffect } from 'react'
import SelectableTable from './SelectableTable'

interface EnhancedSelectableTableProps {
  label?: string
  name: string
  value: any
  onChange: (name: string, value: any) => void
  options: any[]
  placeholder?: string
  displayKey: string
  valueKey: string
  columns: any[]
  pageSize?: number
  onItemSelect?: (item: any) => void
  lineIndex?: number
}

const EnhancedSelectableTable: React.FC<EnhancedSelectableTableProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  displayKey,
  valueKey,
  columns,
  pageSize = 8,
  onItemSelect,
  lineIndex
}) => {
  const [isOpen, setIsOpen] = useState(false)
  // Track local selection to avoid display mismatch on type differences and ensure immediate UI feedback
  const [localValue, setLocalValue] = useState<any>(value)
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
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)

  // Fetch class data
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const promises = [1, 2, 3, 4].map(id =>
          fetch(`http://${window.location.hostname}:4000/api/z-classes/get-by-class-id/${id}`)
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

  // Filter options based on class selections AND search term
  useEffect(() => {
    let filtered = [...options] // Start with all items

    // Apply class filters only if they are selected
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

    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(item => {
        // Search through all column values
        return columns.some(column => {
          const value = item[column.key]
          if (value && typeof value === 'string') {
            return value.toLowerCase().includes(term)
          }
          if (value && typeof value === 'number') {
            return value.toString().includes(term)
          }
          return false
        })
      })
    }

    setFilteredOptions(filtered)
  }, [classFilters, options, searchTerm, columns])

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
    setSearchTerm('') // Also clear search when resetting all filters
  }

  const resetIndividualFilter = (filterName: string) => {
    setClassFilters(prev => ({
      ...prev,
      [filterName]: null
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const handleItemSelection = (name: string, value: any) => {
    setLocalValue(value)
    onChange(name, value)
    
    // Call the onItemSelect callback if provided
    if (onItemSelect) {
      const selectedItem = options.find(item => item[valueKey] === value)
      if (selectedItem) {
        onItemSelect(selectedItem)
      }
    }
    
    setIsOpen(false) // Close popup after selection
  }

  // Match by provided value or fallback to localValue without forcing number conversion
  const selectedItem = options.find(item => item[valueKey] == (value ?? localValue))
  const hasActiveFilters = classFilters.itemClass1 || classFilters.itemClass2 || classFilters.itemClass3 || classFilters.itemClass4 || searchTerm

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full h-10 px-3 py-1 text-left border border-gray-200 rounded-lg bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${selectedItem ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedItem ? selectedItem[displayKey] : placeholder}
          </span>
          <div className="flex items-center space-x-2">
            {/* Show filter status or total count */}
            {/* <div className={`text-xs px-2 py-1 rounded ${hasActiveFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {hasActiveFilters ? `${filteredOptions.length} filtered` : `${options.length} items`}
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg> */}
          </div>
        </div>
      </button>

      {/* Enhanced Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Select Product/Item
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              
              {/* Search Bar */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    SEARCH ITEMS
                  </label>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 hover:bg-red-50 px-2 py-1 rounded transition-all duration-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Clear Search</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by item name, code, or any other field..."
                    className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Class Filters Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4">
                {/* Filters Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.586V13.414a1 1 0 00-.293-.707L2.293 6.293A1 1 0 012 5.586V4z" />
                    </svg>
                    <span className="text-lg font-bold text-blue-800">FILTER BY CLASS</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Show filter status */}
                    <div className="text-sm text-blue-700">
                      Showing <span className="font-bold">{filteredOptions.length}</span> of <span className="font-bold">{options.length}</span> items
                    </div>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Reset All Filters</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Class Dropdowns Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Class 1 */}
                  <div className="relative">
                    <label className="text-sm text-blue-700 mb-2 block font-bold">Class 1</label>
                    <div className="relative">
                      <select
                        value={classFilters.itemClass1 || ''}
                        onChange={(e) => handleClassChange('itemClass1', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
                          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                          title="Clear Class 1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Class 2 */}
                  <div className="relative">
                    <label className="text-sm text-blue-700 mb-2 block font-bold">Class 2</label>
                    <div className="relative">
                      <select
                        value={classFilters.itemClass2 || ''}
                        onChange={(e) => handleClassChange('itemClass2', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
                          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                          title="Clear Class 2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Class 3 */}
                  <div className="relative">
                    <label className="text-sm text-blue-700 mb-2 block font-bold">Class 3</label>
                    <div className="relative">
                      <select
                        value={classFilters.itemClass3 || ''}
                        onChange={(e) => handleClassChange('itemClass3', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
                          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                          title="Clear Class 3"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Class 4 */}
                  <div className="relative">
                    <label className="text-sm text-blue-700 mb-2 block font-bold">Class 4</label>
                    <div className="relative">
                      <select
                        value={classFilters.itemClass4 || ''}
                        onChange={(e) => handleClassChange('itemClass4', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 pr-10 border-2 border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
                          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 z-10"
                          title="Clear Class 4"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Selection - Inline table (no nested dropdown) */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-bold text-gray-700 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    SELECT ITEM
                  </label>
                  {value && (
                    <button
                      type="button"
                      onClick={() => handleItemSelection(name, null)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Clear Selection</span>
                    </button>
                  )}
                </div>
                <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-white sticky top-0 shadow-sm">
                        <tr className="border-b-2 border-gray-100">
                          {(columns && columns.length > 0 ? columns : [{ key: displayKey, label: 'Name', width: '100%' }]).map((column, index) => (
                            <th
                              key={index}
                              className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                              style={{ width: column.width }}
                            >
                              {column.label}
                            </th>
                          ))}
                          <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredOptions.map((option, idx) => (
                          <tr
                            key={option[valueKey]}
                            className={`hover:bg-blue-50 cursor-pointer transition-all duration-150 ${value === option[valueKey] ? 'bg-blue-50 border-l-4 border-blue-500' : ''} ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            onClick={() => handleItemSelection(name, option[valueKey])}
                          >
                            {(columns && columns.length > 0 ? columns : [{ key: displayKey, label: 'Name', width: '100%' }]).map((column, index) => (
                              <td key={index} className="px-6 py-3 text-sm text-gray-900">
                                {column.key === displayKey ? (
                                  <span className="font-medium">{option[column.key]}</span>
                                ) : (
                                  <span className="text-gray-600">{option[column.key] ?? '-'}</span>
                                )}
                              </td>
                            ))}
                            <td className="px-6 py-3 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleItemSelection(name, option[valueKey])
                                }}
                                className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-sm">
                        {hasActiveFilters ? 'No items match current filters' : 'No items available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedSelectableTable