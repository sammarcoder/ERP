// 'use client'

// import React, { useState, useEffect } from 'react'

// interface SelectableTableProps {
//   label?: string
//   name: string
//   value: number | null
//   onChange: (name: string, value: number | null) => void
//   options: Array<{ id: number; label: string; [key: string]: any }>
//   placeholder?: string
//   required?: boolean
//   disabled?: boolean
//   displayKey?: string
//   valueKey?: string
//   onSelect?: (item: any) => void
//   columns?: Array<{ key: string; label: string; width?: string }>
//   pageSize?: number
// }

// const SelectableTable: React.FC<SelectableTableProps> = ({
//   label,
//   name,
//   value,
//   onChange,
//   options,
//   placeholder = "Select an option",
//   required = false,
//   disabled = false,
//   displayKey = 'label',
//   valueKey = 'id',
//   onSelect,
//   columns = [],
//   pageSize = 10
// }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [filteredOptions, setFilteredOptions] = useState(options)

//   // Default columns if none provided
//   const defaultColumns = columns.length > 0 ? columns : [
//     { key: displayKey, label: 'Name', width: '100%' }
//   ]

//   useEffect(() => {
//     const filtered = options.filter(option =>
//       option[displayKey].toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (columns.length > 0 && columns.some(col => 
//         option[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       ))
//     )
//     setFilteredOptions(filtered)
//     setCurrentPage(1)
//   }, [searchTerm, options, displayKey, columns])

//   const selectedOption = options.find(opt => opt[valueKey] === value)

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredOptions.length / pageSize)
//   const startIndex = (currentPage - 1) * pageSize
//   const endIndex = startIndex + pageSize
//   const currentOptions = filteredOptions.slice(startIndex, endIndex)

//   const handleSelect = (option: any) => {
//     onChange(name, option[valueKey])
//     if (onSelect) onSelect(option)
//     setIsOpen(false)
//     setSearchTerm('')
//     setCurrentPage(1)
//   }

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page)
//     }
//   }

//   return (
//     <div className="relative">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
      
//       {/* Selected Value Display */}
//       <div
//         className={`w-full px-3 py-2 border rounded-md cursor-pointer flex justify-between items-center ${
//           disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-blue-500'
//         } ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//       >
//         <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
//           {selectedOption ? selectedOption[displayKey] : placeholder}
//         </span>
//         <svg
//           className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </div>

//       {/* Table Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-5/6 flex flex-col">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Select {label || 'Option'}
//                 </h3>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
              
//               {/* Search */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <svg
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="flex-1 overflow-auto">
//               {currentOptions.length > 0 ? (
//                 <table className="w-full">
//                   <thead className="bg-gray-50 sticky top-0">
//                     <tr>
//                       {defaultColumns.map((column, index) => (
//                         <th
//                           key={index}
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           style={{ width: column.width }}
//                         >
//                           {column.label}
//                         </th>
//                       ))}
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentOptions.map((option) => (
//                       <tr
//                         key={option[valueKey]}
//                         className={`hover:bg-blue-50 cursor-pointer ${
//                           value === option[valueKey] ? 'bg-blue-100' : ''
//                         }`}
//                         onClick={() => handleSelect(option)}
//                       >
//                         {defaultColumns.map((column, index) => (
//                           <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {option[column.key]}
//                           </td>
//                         ))}
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleSelect(option)
//                             }}
//                             className="text-blue-600 hover:text-blue-900 font-medium"
//                           >
//                             Select
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="flex items-center justify-center h-32">
//                   <p className="text-gray-500">No options found</p>
//                 </div>
//               )}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="p-4 border-t border-gray-200 flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Showing {startIndex + 1} to {Math.min(endIndex, filteredOptions.length)} of {filteredOptions.length} results
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
                  
//                   {/* Page numbers */}
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => handlePageChange(page)}
//                         className={`px-3 py-1 text-sm border rounded-md ${
//                           currentPage === page
//                             ? 'bg-blue-500 text-white border-blue-500'
//                             : 'border-gray-300 hover:bg-gray-50'
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   })}
                  
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SelectableTable














































'use client'

import React, { useState, useEffect } from 'react'

interface SelectableTableProps {
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
  columns?: Array<{ key: string; label: string; width?: string }>
  pageSize?: number
}

const SelectableTable: React.FC<SelectableTableProps> = ({
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
  onSelect,
  columns = [],
  pageSize = 10
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredOptions, setFilteredOptions] = useState(options)

  // Default columns if none provided
  const defaultColumns = columns.length > 0 ? columns : [
    { key: displayKey, label: 'Name', width: '100%' }
  ]

  useEffect(() => {
    const filtered = options.filter(option =>
      option[displayKey].toLowerCase().includes(searchTerm.toLowerCase()) ||
      (columns.length > 0 && columns.some(col => 
        option[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
    setFilteredOptions(filtered)
    setCurrentPage(1)
  }, [searchTerm, options, displayKey, columns])

  const selectedOption = options.find(opt => opt[valueKey] === value)

  // Pagination calculations
  const totalPages = Math.ceil(filteredOptions.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentOptions = filteredOptions.slice(startIndex, endIndex)

  const handleSelect = (option: any) => {
    onChange(name, option[valueKey])
    if (onSelect) onSelect(option)
    setIsOpen(false)
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Selected Value Display */}
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

      {/* Table Modal with blur-sm instead of bg-black */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-5/6 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Select {label || 'Option'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              {currentOptions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {defaultColumns.map((column, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ width: column.width }}
                        >
                          {column.label}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOptions.map((option) => (
                      <tr
                        key={option[valueKey]}
                        className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                          value === option[valueKey] ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleSelect(option)}
                      >
                        {defaultColumns.map((column, index) => (
                          <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {option[column.key]}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelect(option)
                            }}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-500">No options found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredOptions.length)} of {filteredOptions.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === page
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectableTable
