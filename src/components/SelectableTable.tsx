// 'use client'

// import React, { useState, useMemo } from 'react'

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
//   options = [],
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

//   // Use useMemo instead of useState + useEffect to prevent infinite loop
//   const filteredOptions = useMemo(() => {
//     if (!options || !Array.isArray(options)) return [];
    
//     return options.filter(option => {
//       if (!option || typeof option !== 'object') return false;
      
//       // Safely check displayKey existence
//       const displayValue = option[displayKey]?.toString().toLowerCase() || '';
//       const searchLower = searchTerm.toLowerCase();
      
//       if (displayValue.includes(searchLower)) return true;
      
//       // Check other column values
//       if (columns.length > 0) {
//         return columns.some(col => {
//           const colValue = option[col.key]?.toString().toLowerCase() || '';
//           return colValue.includes(searchLower);
//         });
//       }
      
//       return false;
//     });
//   }, [searchTerm, options, displayKey, columns]);

//   const selectedOption = useMemo(() => 
//     options?.find(opt => opt[valueKey] === value), 
//     [options, value, valueKey]
//   );

//   // Pagination calculations
//   const totalPages = Math.max(1, Math.ceil(filteredOptions.length / pageSize))
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

//   // Default columns if none provided
//   const defaultColumns = columns.length > 0 ? columns : [
//     { key: displayKey, label: 'Name', width: '100%' }
//   ]
// return (
//   <div className="relative">
//     {label && (
//       <label className="block text-[14px] font-semibold text-gray-700 mb-2">
//         {label} 
//         {/* {required && <span className="text-red-500 ml-1">*</span>} */}
//       </label>
//     )}
    
//     {/* Selected Value Display with Enhanced Design */}
//     <div
//       className={`
//         relative w-full px-2 py-2 
//         bg-white border rounded-lg 
//         cursor-pointer transition-all duration-200
//         flex justify-between items-center
//         ${disabled 
//           ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
//           : isOpen 
//             ? 'border-blue-500 shadow-lg shadow-blue-100 ring-4 ring-blue-50' 
//             : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
//         }
//       `}
//       onClick={() => !disabled && setIsOpen(!isOpen)}
//     >
//       <span className={`${selectedOption ? 'text-gray-900 text-[14px] font-normal' : 'text-gray-400'}`}>
//         {selectedOption ? selectedOption[displayKey] : placeholder}
//       </span>
//       <svg
//         className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//       </svg>
//     </div>

//     {/* Enhanced Table Modal */}
//     {isOpen && (
//       <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
//         <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-5xl max-h-[85vh] flex flex-col animate-slideUp">
//           {/* Enhanced Header */}
//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-t-2xl">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 Select {label || 'Option'}
//               </h3>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             {/* Enhanced Search Bar */}
//             <div className="relative">
//               <input
//                 type="text"
//                 className="w-full px-12 py-3 bg-white/95 backdrop-blur rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
//                 // placeholder={`Search ${label?.toLowerCase() || 'items'}...`}
//                 // placeholder={`Search ${(label?.toLowerCase()) || 'items'}...`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 autoFocus
//               />
//               <svg
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Enhanced Table */}
//           <div className="flex-1 overflow-auto bg-gray-50">
//             {currentOptions.length > 0 ? (
//               <table className="w-full">
//                 <thead className="bg-white sticky top-0 shadow-sm">
//                   <tr className="border-b-2 border-gray-100">
//                     {defaultColumns.map((column, index) => (
//                       <th
//                         key={index}
//                         className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
//                         style={{ width: column.width }}
//                       >
//                         {column.label}
//                       </th>
//                     ))}
//                     <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {currentOptions.map((option, idx) => (
//                     <tr
//                       key={option[valueKey]}
//                       className={`
//                         hover:bg-blue-50 cursor-pointer transition-all duration-150
//                         ${value === option[valueKey] ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
//                         ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
//                       `}
//                       onClick={() => handleSelect(option)}
//                     >
//                       {defaultColumns.map((column, index) => (
//                         <td key={index} className="px-6 py-4 text-sm text-gray-900">
//                           {column.key === displayKey ? (
//                             <span className="font-medium">{option[column.key]}</span>
//                           ) : (
//                             <span className="text-gray-600">{option[column.key] || '-'}</span>
//                           )}
//                         </td>
//                       ))}
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleSelect(option)
//                           }}
//                           className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md"
//                         >
//                           Select
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-64">
//                 <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-gray-500 text-lg">No results found</p>
//                 <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
//               </div>
//             )}
//           </div>

//           {/* Enhanced Pagination */}
//           {totalPages > 1 && (
//             <div className="p-5 bg-white border-t-2 border-gray-100 rounded-b-2xl">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-600">
//                   Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
//                   <span className="font-semibold">{Math.min(endIndex, filteredOptions.length)}</span> of{' '}
//                   <span className="font-semibold">{filteredOptions.length}</span> results
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                     </svg>
//                   </button>
                  
//                   {/* Page numbers with ellipsis */}
//                   <div className="flex items-center space-x-1">
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
//                       return page <= totalPages ? (
//                         <button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           className={`
//                             px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
//                             ${currentPage === page
//                               ? 'bg-blue-500 text-white shadow-lg transform scale-110'
//                               : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
//                             }
//                           `}
//                         >
//                           {page}
//                         </button>
//                       ) : null
//                     })}
//                   </div>
                  
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     )}

//     {/* Add animations */}
//     <style jsx>{`
//       @keyframes fadeIn {
//         from { opacity: 0; }
//         to { opacity: 1; }
//       }
//       @keyframes slideUp {
//         from { 
//           opacity: 0;
//           transform: translateY(20px);
//         }
//         to { 
//           opacity: 1;
//           transform: translateY(0);
//         }
//       }
//       .animate-fadeIn {
//         animation: fadeIn 0.2s ease-out;
//       }
//       .animate-slideUp {
//         animation: slideUp 0.3s ease-out;
//       }
//     `}</style>
//   </div>
// )
// }

// export default SelectableTable





























































'use client'

import React, { useState, useMemo } from 'react'
import { ChevronDown, Search, X, FileText, ArrowLeft, ArrowRight } from 'lucide-react'

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
  options = [],
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

  // Use useMemo instead of useState + useEffect to prevent infinite loop
  const filteredOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];
    
    return options.filter(option => {
      if (!option || typeof option !== 'object') return false;
      
      // Safely check displayKey existence
      const displayValue = option[displayKey]?.toString().toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      if (displayValue.includes(searchLower)) return true;
      
      // Check other column values
      if (columns.length > 0) {
        return columns.some(col => {
          const colValue = option[col.key]?.toString().toLowerCase() || '';
          return colValue.includes(searchLower);
        });
      }
      
      return false;
    });
  }, [searchTerm, options, displayKey, columns]);

  const selectedOption = useMemo(() => 
    options?.find(opt => opt[valueKey] === value), 
    [options, value, valueKey]
  );

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredOptions.length / pageSize))
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

  // ✅ NEW: Clear selected value function
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(name, null)
    if (onSelect) onSelect(null)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Default columns if none provided
  const defaultColumns = columns.length > 0 ? columns : [
    { key: displayKey, label: 'Name', width: '100%' }
  ]

  return (
    <div className="relative">
      {label && (
        <label className="block text-[14px] font-semibold text-gray-700 mb-2">
          {label} 
          {/* {required && <span className="text-red-500 ml-1">*</span>} */}
        </label>
      )}
      
      {/* Selected Value Display with Enhanced Design */}
      <div
        className={`
          relative w-full px-2 py-2 
          bg-white border rounded-lg 
          cursor-pointer transition-all duration-200
          flex justify-between items-center
          ${disabled 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
            : isOpen 
              ? 'border-blue-500 shadow-lg shadow-blue-100 ring-4 ring-blue-50' 
              : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
          }
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`${selectedOption ? 'text-gray-900 text-[14px] font-normal' : 'text-gray-400'}`}>
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        
        {/* ✅ NEW: Clear button and dropdown arrow */}
        <div className="flex items-center space-x-1">
          {selectedOption && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
              title="Clear selection"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
          />
        </div>
      </div>

      {/* Enhanced Table Modal */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-5xl max-h-[85vh] flex flex-col animate-slideUp">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  Select {label || 'Option'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Enhanced Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-12 py-3 bg-white/95 backdrop-blur rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                  placeholder={`Search ${label?.toLowerCase() || 'items'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Table */}
            <div className="flex-1 overflow-auto bg-gray-50">
              {currentOptions.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-white sticky top-0 shadow-sm">
                    <tr className="border-b-2 border-gray-100">
                      {defaultColumns.map((column, index) => (
                        <th
                          key={index}
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                          style={{ width: column.width }}
                        >
                          {column.label}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentOptions.map((option, idx) => (
                      <tr
                        key={option[valueKey]}
                        className={`
                          hover:bg-blue-50 cursor-pointer transition-all duration-150
                          ${value === option[valueKey] ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                          ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                        `}
                        onClick={() => handleSelect(option)}
                      >
                        {defaultColumns.map((column, index) => (
                          <td key={index} className="px-6 py-4 text-sm text-gray-900">
                            {column.key === displayKey ? (
                              <span className="font-medium">{option[column.key]}</span>
                            ) : (
                              <span className="text-gray-600">{option[column.key] || '-'}</span>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelect(option)
                            }}
                            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Search className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No results found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="p-5 bg-white border-t-2 border-gray-100 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold">{Math.min(endIndex, filteredOptions.length)}</span> of{' '}
                    <span className="font-semibold">{filteredOptions.length}</span> results
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Page numbers with ellipsis */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                        return page <= totalPages ? (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`
                              px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                              ${currentPage === page
                                ? 'bg-blue-500 text-white shadow-lg transform scale-110'
                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
                              }
                            `}
                          >
                            {page}
                          </button>
                        ) : null
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default SelectableTable
