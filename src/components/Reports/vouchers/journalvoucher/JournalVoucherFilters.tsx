// import { useState, useMemo } from 'react'
// import { JournalVoucherFilterState, JournalVoucherFilterOptions } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

// interface JournalVoucherFiltersProps {
//   filters: JournalVoucherFilterState
//   setFilters: React.Dispatch<React.SetStateAction<JournalVoucherFilterState>>
//   filterOptions: JournalVoucherFilterOptions
//   filteredVoucherNos: string[]
//   onClear: () => void
// }

// export default function JournalVoucherFilters({ 
//   filters, 
//   setFilters, 
//   filterOptions, 
//   filteredVoucherNos,
//   onClear 
// }: JournalVoucherFiltersProps) {
//   const [voucherNoInput, setVoucherNoInput] = useState('')

//   // Filter voucher numbers based on user input
//   const suggestedVoucherNos = useMemo(() => {
//     if (!voucherNoInput) return filteredVoucherNos.slice(0, 10) // Show first 10
//     return filteredVoucherNos.filter(vNo => 
//       vNo.toLowerCase().includes(voucherNoInput.toLowerCase())
//     ).slice(0, 10)
//   }, [voucherNoInput, filteredVoucherNos])

//   const handleVoucherNoSelect = (voucherNo: string) => {
//     setFilters(prev => ({ ...prev, voucherNo }))
//     setVoucherNoInput(voucherNo)
//   }

//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <h3 className="text-lg font-medium mb-4">Journal Voucher Filters (Both Required)</h3>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* Step 1: Voucher Type (Mandatory) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             <span className="text-red-500">*</span> Step 1: Select Voucher Type
//           </label>
//           <select
//             value={filters.voucherTypeId || ''}
//             onChange={(e) => {
//               const voucherTypeId = e.target.value ? parseInt(e.target.value) : null
//               setFilters({ voucherTypeId, voucherNo: '' }) // Reset voucher no when type changes
//               setVoucherNoInput('')
//             }}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">Select Voucher Type...</option>
//             {filterOptions.voucherTypes.map(vType => (
//               <option key={vType.id} value={vType.id}>
//                 {vType.name}
//               </option>
//             ))}
//           </select>
//           {!filters.voucherTypeId && (
//             <p className="text-xs text-red-500 mt-1">Please select voucher type first</p>
//           )}
//         </div>

//         {/* Step 2: Voucher Number (Mandatory, depends on Step 1) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             <span className="text-red-500">*</span> Step 2: Select Voucher Number
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder={filters.voucherTypeId ? "Type voucher number..." : "Select voucher type first"}
//               value={voucherNoInput}
//               onChange={(e) => setVoucherNoInput(e.target.value)}
//               disabled={!filters.voucherTypeId}
//               className={`w-full border rounded-md px-3 py-2 text-sm ${
//                 !filters.voucherTypeId 
//                   ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
//                   : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
//               }`}
//             />
            
//             {/* Voucher Number Suggestions */}
//             {filters.voucherTypeId && voucherNoInput && suggestedVoucherNos.length > 0 && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                 {suggestedVoucherNos.map(vNo => (
//                   <button
//                     key={vNo}
//                     onClick={() => handleVoucherNoSelect(vNo)}
//                     className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
//                   >
//                     {vNo}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {filters.voucherTypeId && (
//             <p className="text-xs text-gray-500 mt-1">
//               {filteredVoucherNos.length} voucher numbers available
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Filter Status */}
//       <div className="mt-4 p-3 bg-gray-50 rounded">
//         <h4 className="text-sm font-medium text-gray-700 mb-2">Filter Status:</h4>
//         <div className="space-y-1 text-sm">
//           <div className="flex items-center">
//             <span className={`w-3 h-3 rounded-full mr-2 ${filters.voucherTypeId ? 'bg-green-500' : 'bg-red-500'}`}></span>
//             Voucher Type: {filters.voucherTypeId ? 
//               filterOptions.voucherTypes.find(vt => vt.id === filters.voucherTypeId)?.name : 'Not Selected'
//             }
//           </div>
//           <div className="flex items-center">
//             <span className={`w-3 h-3 rounded-full mr-2 ${filters.voucherNo ? 'bg-green-500' : 'bg-red-500'}`}></span>
//             Voucher Number: {filters.voucherNo || 'Not Selected'}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end space-x-3 mt-6">
//         <button
//           onClick={onClear}
//           className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//         >
//           Clear All Filters
//         </button>
//       </div>
//     </div>
//   )
// }







































import { useState, useMemo } from 'react'
import { JournalVoucherFilterState, JournalVoucherFilterOptions } from '@/types/reports/journalmaster/vouchers/journalvoucher/JournalVoucherTypes'

interface JournalVoucherFiltersProps {
  filters: JournalVoucherFilterState
  setFilters: React.Dispatch<React.SetStateAction<JournalVoucherFilterState>>
  filterOptions: JournalVoucherFilterOptions
  filteredVoucherNos: string[]
  onClear: () => void
}

export default function JournalVoucherFilters({ 
  filters, 
  setFilters, 
  filterOptions, 
  filteredVoucherNos,
  onClear
}: JournalVoucherFiltersProps) {
  const [voucherNoInput, setVoucherNoInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const suggestedVoucherNos = useMemo(() => {
    if (!filters.voucherTypeId) return []
    if (!voucherNoInput) return filteredVoucherNos
    return filteredVoucherNos.filter(vNo => 
      vNo.toLowerCase().includes(voucherNoInput.toLowerCase())
    )
  }, [voucherNoInput, filteredVoucherNos, filters.voucherTypeId])

  // ✅ Fixed Clear Handler
  const handleClear = () => {
    setVoucherNoInput('')
    setShowDropdown(false)
    onClear() // This will reset the filters in parent component
  }

  return (
    <div className="bg-white rounded shadow p-2">
      <div className="grid grid-cols-3 gap-2 items-end">
        
        {/* Voucher Type */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Voucher Type *</label>
          <select
            value={filters.voucherTypeId || ''}
            onChange={(e) => {
              const voucherTypeId = e.target.value ? parseInt(e.target.value) : null
              setFilters({ voucherTypeId, voucherNo: '' })
              setVoucherNoInput('')
              setShowDropdown(false)
            }}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          >
            <option value="">Select Type...</option>
            {filterOptions.voucherTypes.map(vType => (
              <option key={vType.id} value={vType.id}>{vType.name}</option>
            ))}
          </select>
        </div>

        {/* Voucher Number */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Voucher Number *</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter voucher number..."
              value={voucherNoInput}
              onChange={(e) => {
                setVoucherNoInput(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={!filters.voucherTypeId}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            />
            
            {/* Professional Dropdown - 5-6 items with scroll */}
            {filters.voucherTypeId && showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                {suggestedVoucherNos.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto">
                    {suggestedVoucherNos.map(vNo => (
                      <button
                        key={vNo}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, voucherNo: vNo }))
                          setVoucherNoInput(vNo)
                          setShowDropdown(false)
                        }}
                        className="w-full text-left px-2 py-1 hover:bg-blue-50 text-xs border-b border-gray-100 last:border-b-0"
                      >
                        {vNo}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-2 py-2 text-xs text-gray-500 text-center">
                    No vouchers found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Fixed Clear Filter Button */}
        <div>
          <button
            onClick={handleClear}
            className="w-full px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
