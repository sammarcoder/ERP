// // components/lc-main/LcCoaSearchableInput.tsx

// 'use client'
// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
// import { useGetAllCoaQuery } from '@/store/slice/coaApi'
// import { Search, ChevronDown, X, Loader2, Landmark } from 'lucide-react'
// import { clsx } from 'clsx'

// // =============================================
// // TYPES
// // =============================================

// interface LcCoaOption {
//   id: number
//   acName: string
//   acCode?: string
//   coaTypeId?: number
//   originalData?: any
// }

// interface LcCoaSearchableInputProps {
//   value: number | null | undefined
//   onChange: (selectedId: number | null, selectedOption?: LcCoaOption | null) => void
//   placeholder?: string
//   label?: string
//   disabled?: boolean
//   error?: string
//   clearable?: boolean
//   size?: 'sm' | 'md' | 'lg'
//   className?: string
//   required?: boolean
//   excludeIds?: number[]
// }

// // =============================================
// // COMPONENT
// // =============================================

// const LcCoaSearchableInput: React.FC<LcCoaSearchableInputProps> = ({
//   value,
//   onChange,
//   placeholder = 'Select LC...',
//   label,
//   disabled = false,
//   error,
//   clearable = true,
//   size = 'md',
//   className,
//   required = false,
//   excludeIds = []
// }) => {
//   // =============================================
//   // STATE
//   // =============================================

//   const [isOpen, setIsOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [displayValue, setDisplayValue] = useState('')
//   const containerRef = useRef<HTMLDivElement>(null)
//   const inputRef = useRef<HTMLInputElement>(null)

//   // =============================================
//   // RTK QUERY
//   // =============================================

//   const { data: allCoaData, isLoading } = useGetAllCoaQuery()

//   // =============================================
//   // GET LC COA LIST (coaTypeId === 2)
//   // =============================================

//   const lcCoaList = useMemo(() => {
//     const allCoas = allCoaData?.zCoaRecords || allCoaData || []

//     // Filter by coaTypeId === 2 (LC type)
//     const lcCoas = allCoas.filter((coa: any) => coa.coaTypeId === 2)

//     console.log('🔍 LC COA Debug:')
//     console.log('  - Total COAs:', allCoas.length)
//     console.log('  - LC COAs (coaTypeId=2):', lcCoas.length)

//     return lcCoas
//   }, [allCoaData])

//   // =============================================
//   // FILTERED OPTIONS
//   // =============================================

//   const filteredOptions = useMemo(() => {
//     let filtered = [...lcCoaList]

//     // Exclude specific IDs
//     if (excludeIds && excludeIds.length > 0) {
//       filtered = filtered.filter((coa: any) => {
//         const coaId = coa.id || coa.Id
//         return !excludeIds.includes(coaId)
//       })
//       console.log('  - After excludeIds:', filtered.length)
//     }

//     // Filter by search term
//     if (searchTerm.trim()) {
//       const search = searchTerm.toLowerCase()
//       filtered = filtered.filter((coa: any) => {
//         const name = (coa.acName || '').toLowerCase()
//         const code = (coa.acCode || '').toLowerCase()
//         return name.includes(search) || code.includes(search)
//       })
//       console.log('  - After search:', filtered.length)
//     }

//     // Map to options
//     const options: LcCoaOption[] = filtered.map((coa: any) => ({
//       id: coa.id || coa.Id,
//       acName: coa.acName || '',
//       acCode: coa.acCode || '',
//       coaTypeId: coa.coaTypeId,
//       originalData: coa
//     }))

//     return options
//   }, [lcCoaList, excludeIds, searchTerm])

//   // =============================================
//   // SET DISPLAY VALUE
//   // =============================================

//   useEffect(() => {
//     if (value && lcCoaList.length > 0) {
//       const selected = lcCoaList.find((coa: any) => {
//         const coaId = coa.id || coa.Id
//         return coaId === Number(value)
//       })
//       if (selected) {
//         const name = selected.acName || ''
//         const code = selected.acCode || ''
//         setDisplayValue(code ? `${code} - ${name}` : name)
//       }
//     } else if (!value) {
//       setDisplayValue('')
//     }
//   }, [value, lcCoaList])

//   // =============================================
//   // CLICK OUTSIDE
//   // =============================================

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//         setSearchTerm('')
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   // =============================================
//   // HANDLERS
//   // =============================================

//   const handleSelect = useCallback((option: LcCoaOption) => {
//     onChange(option.id, option)
//     const display = option.acCode ? `${option.acCode} - ${option.acName}` : option.acName
//     setDisplayValue(display)
//     setIsOpen(false)
//     setSearchTerm('')
//   }, [onChange])

//   const handleClear = useCallback((e: React.MouseEvent) => {
//     e.stopPropagation()
//     onChange(null, null)
//     setDisplayValue('')
//     setSearchTerm('')
//   }, [onChange])

//   const handleInputClick = useCallback(() => {
//     if (!disabled) {
//       setIsOpen(true)
//       inputRef.current?.focus()
//     }
//   }, [disabled])

//   // =============================================
//   // SIZE CLASSES
//   // =============================================

//   const sizeClasses = {
//     sm: 'px-2 py-1.5 text-sm h-9',
//     md: 'px-3 py-2 text-sm h-10',
//     lg: 'px-4 py-2.5 text-base h-12'
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div ref={containerRef} className={clsx('relative', className)}>
//       {/* Label */}
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           <Landmark className="w-4 h-4 inline mr-1" />
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}

//       {/* Input */}
//       <div
//         onClick={handleInputClick}
//         className={clsx(
//           'flex items-center w-full border rounded-lg cursor-pointer transition-colors',
//           sizeClasses[size],
//           disabled && 'bg-gray-100 cursor-not-allowed',
//           error ? 'border-red-500' : isOpen ? 'border-[#509ee3] ring-1 ring-[#509ee3]' : 'border-gray-300',
//           !disabled && 'hover:border-gray-400'
//         )}
//       >
//         <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />

//         {isOpen ? (
//           <input
//             ref={inputRef}
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder={placeholder}
//             className="flex-1 outline-none bg-transparent"
//             autoFocus
//           />
//         ) : (
//           <span className={clsx(
//             'flex-1 truncate',
//             displayValue ? 'text-gray-900' : 'text-gray-400'
//           )}>
//             {displayValue || placeholder}
//           </span>
//         )}

//         {/* Clear Button */}
//         {clearable && value && !disabled && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className="p-1 hover:bg-gray-100 rounded mr-1"
//           >
//             <X className="w-4 h-4 text-gray-400" />
//           </button>
//         )}

//         <ChevronDown className={clsx(
//           'w-4 h-4 text-gray-400 transition-transform',
//           isOpen && 'rotate-180'
//         )} />
//       </div>

//       {/* Error Message */}
//       {error && (
//         <p className="mt-1 text-sm text-red-600">{error}</p>
//       )}

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-4">
//               <Loader2 className="w-5 h-5 animate-spin text-[#509ee3]" />
//             </div>
//           ) : filteredOptions.length === 0 ? (
//             <div className="py-4 text-center text-gray-500 text-sm">
//               No LC accounts found
//             </div>
//           ) : (
//             <ul>
//               {filteredOptions.map((option) => (
//                 <li
//                   key={option.id}
//                   onClick={() => handleSelect(option)}
//                   className={clsx(
//                     'px-3 py-2 cursor-pointer hover:bg-[#509ee3]/10 transition-colors',
//                     Number(value) === option.id && 'bg-[#509ee3]/20'
//                   )}
//                 >
//                   <div className="font-medium text-gray-900">
//                     {option.acCode ? `${option.acCode} - ${option.acName}` : option.acName}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default LcCoaSearchableInput
































// components/lc-main/LcCoaSearchableInput.tsx

'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useGetAllCoaQuery } from '@/store/slice/coaApi'
import { Search, ChevronDown, X, Loader2, Landmark } from 'lucide-react'
import { clsx } from 'clsx'

// =============================================
// TYPES
// =============================================

interface LcCoaOption {
  id: number
  acName: string
  acCode?: string
  coaTypeId?: number
  originalData?: any
}

interface LcCoaSearchableInputProps {
  value: number | null | undefined
  onChange: (selectedId: number | null, selectedOption?: LcCoaOption | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  required?: boolean
  excludeIds?: number[]
}

// =============================================
// COMPONENT
// =============================================

const LcCoaSearchableInput: React.FC<LcCoaSearchableInputProps> = ({
  value,
  onChange,
  placeholder = 'Select LC...',
  label,
  disabled = false,
  error,
  clearable = true,
  size = 'md',
  className,
  required = false,
  excludeIds = []
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [displayValue, setDisplayValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // =============================================
  // RTK QUERY
  // =============================================

  const { data: allCoaData, isLoading } = useGetAllCoaQuery()

  // =============================================
  // GET LC COA LIST (coaTypeId === 2)
  // =============================================

  const lcCoaList = useMemo(() => {
    const allCoas = allCoaData?.zCoaRecords || allCoaData || []

    console.log('🔍 Total COAs from API:', allCoas.length)

    // ✅ FIX: Convert coaTypeId to number for comparison
    const lcCoas = allCoas.filter((coa: any) => {
      const typeId = Number(coa.coaTypeId)
      return typeId === 2
    })

    console.log('🔍 LC COAs (coaTypeId=2):', lcCoas.length)
    lcCoas.forEach((coa: any) => {
      console.log(`  - id: ${coa.id}, name: ${coa.acName}`)
    })

    return lcCoas
  }, [allCoaData])

  // =============================================
  // FILTERED OPTIONS
  // =============================================

  const filteredOptions = useMemo(() => {
    let filtered = [...lcCoaList]

    console.log('🔍 excludeIds received:', excludeIds)
    console.log('🔍 excludeIds type:', typeof excludeIds)
    console.log('🔍 excludeIds length:', excludeIds?.length)


    // Exclude specific IDs
    if (excludeIds && excludeIds.length > 0) {
      filtered = filtered.filter((coa: any) => {
        const coaId = Number(coa.id || coa.Id)  // ✅ Convert to number
        return !excludeIds.includes(coaId)
      })
      console.log('🔍 After excludeIds:', filtered.length)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter((coa: any) => {
        const name = (coa.acName || '').toLowerCase()
        const code = (coa.acCode || '').toLowerCase()
        return name.includes(search) || code.includes(search)
      })
    }

    // Map to options
    const options: LcCoaOption[] = filtered.map((coa: any) => ({
      id: Number(coa.id || coa.Id),  // ✅ Convert to number
      acName: coa.acName || '',
      acCode: coa.acCode || '',
      coaTypeId: Number(coa.coaTypeId),
      originalData: coa
    }))

    return options
  }, [lcCoaList, excludeIds, searchTerm])

  // =============================================
  // SET DISPLAY VALUE
  // =============================================

  useEffect(() => {
    if (value && lcCoaList.length > 0) {
      const selected = lcCoaList.find((coa: any) => {
        const coaId = Number(coa.id || coa.Id)
        return coaId === Number(value)
      })
      if (selected) {
        const name = selected.acName || ''
        const code = selected.acCode || ''
        setDisplayValue(code ? `${code} - ${name}` : name)
      }
    } else if (!value) {
      setDisplayValue('')
    }
  }, [value, lcCoaList])

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

  const handleSelect = useCallback((option: LcCoaOption) => {
    onChange(option.id, option)
    const display = option.acCode ? `${option.acCode} - ${option.acName}` : option.acName
    setDisplayValue(display)
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
          <Landmark className="w-4 h-4 inline mr-1" />
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
            'flex-1 truncate',
            displayValue ? 'text-gray-900' : 'text-gray-400'
          )}>
            {displayValue || placeholder}
          </span>
        )}

        {/* Clear Button */}
        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded mr-1"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        <ChevronDown className={clsx(
          'w-4 h-4 text-gray-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#509ee3]" />
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-gray-500 text-sm">
              No LC accounts found
            </div>
          ) : (
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    'px-3 py-2 cursor-pointer hover:bg-[#509ee3]/10 transition-colors',
                    Number(value) === option.id && 'bg-[#509ee3]/20'
                  )}
                >
                  <div className="font-medium text-gray-900">
                    {option.acCode ? `${option.acCode} - ${option.acName}` : option.acName}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default LcCoaSearchableInput
