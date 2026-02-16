// // components/ui/EmployeeSelector.tsx

// 'use client'
// import React, { useState, useMemo, use } from 'react'
// // import { useGetAllEmployeesQuery } from '@/store/slice/employeeSlice'
// import { 
//   useGetEmployeesQuery, 
  
// } from '@/store/slice/employeeApi'
// import { Search, X, Check, Loader2, Users } from 'lucide-react'

// interface EmployeeSelectorProps {
//   isOpen: boolean
//   onClose: () => void
//   onSelect: (employeeIds: number[]) => void
//   selectedIds?: number[]
// }

// const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
//   isOpen,
//   onClose,
//   onSelect,
//   selectedIds = []
// }) => {
//   const [search, setSearch] = useState('')
//   const [selected, setSelected] = useState<Set<number>>(new Set(selectedIds))
//   const { data: employees = [], isLoading } =  useGetEmployeesQuery()

//   const filteredEmployees = useMemo(() => {
//     if (!search.trim()) return employees
//     const searchLower = search.toLowerCase()
//     return employees.filter((emp: any) => 
//       emp.employeeName?.toLowerCase().includes(searchLower)
//     )
//   }, [employees, search])

//   const toggleSelect = (id: number) => {
//     const newSelected = new Set(selected)
//     if (newSelected.has(id)) {
//       newSelected.delete(id)
//     } else {
//       newSelected.add(id)
//     }
//     setSelected(newSelected)
//   }

//   const handleConfirm = () => {
//     onSelect(Array.from(selected))
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
//         {/* Header */}
//         <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-t-lg text-white">
//           <div className="flex items-center">
//             <Users className="w-5 h-5 mr-2" />
//             <h2 className="text-lg font-semibold">Select Employees</h2>
//           </div>
//           <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Search */}
//         <div className="p-4 border-b">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search employees..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
//             />
//           </div>
//           {selected.size > 0 && (
//             <div className="mt-2 text-sm text-[#509ee3]">
//               {selected.size} employee{selected.size > 1 ? 's' : ''} selected
//             </div>
//           )}
//         </div>

//         {/* List */}
//         <div className="flex-1 overflow-y-auto p-2">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="w-6 h-6 animate-spin text-[#509ee3]" />
//             </div>
//           ) : filteredEmployees.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p>No employees found</p>
//             </div>
//           ) : (
//             <div className="space-y-1">
//               {filteredEmployees.map((emp: any) => {
//                 const isSelected = selected.has(emp.id)
//                 return (
//                   <div
//                     key={emp.id}
//                     onClick={() => toggleSelect(emp.id)}
//                     className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
//                       isSelected 
//                         ? 'bg-[#509ee3]/10 border border-[#509ee3]' 
//                         : 'hover:bg-gray-50 border border-transparent'
//                     }`}
//                   >
//                     <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
//                       isSelected ? 'bg-[#509ee3] border-[#509ee3]' : 'border-gray-300'
//                     }`}>
//                       {isSelected && <Check className="w-3 h-3 text-white" />}
//                     </div>
//                     <div className="flex-1">
//                       <div className="font-medium text-gray-900">{emp.employeeName}</div>
//                       {emp.department?.name && (
//                         <div className="text-xs text-gray-500">{emp.department.name}</div>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="px-4 py-2 bg-[#509ee3] text-white rounded-lg hover:bg-[#4990d6]"
//           >
//             Confirm ({selected.size})
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EmployeeSelector





































// components/ui/EmployeeSelector.tsx

'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useGetEmployeesQuery } from '@/store/slice/employeeApi'
import { Search, X, Check, Loader2, Users } from 'lucide-react'

interface EmployeeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (employeeIds: number[]) => void
  selectedIds?: number[]
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedIds = []
}) => {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set(selectedIds))
  
  // ✅ Pass params as required by RTK query
  const { data: response, isLoading } = useGetEmployeesQuery({ page: 1, limit: 500 })
  
  // ✅ Extract employees array from response
  const employees = useMemo(() => {
    if (!response) return []
    // Handle if response is array directly
    if (Array.isArray(response)) return response
    // Handle if response has data property
    if (response.data && Array.isArray(response.data)) return response.data
    return []
  }, [response])

  // ✅ Sync selected when selectedIds prop changes
  useEffect(() => {
    setSelected(new Set(selectedIds))
  }, [selectedIds])

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employees
    const searchLower = search.toLowerCase()
    return employees.filter((emp: any) => 
      emp.employeeName?.toLowerCase().includes(searchLower)
    )
  }, [employees, search])

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const handleConfirm = () => {
    onSelect(Array.from(selected))
    onClose()
  }

  const handleClose = () => {
    setSearch('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-t-lg text-white">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Select Employees</h2>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#509ee3]"
            />
          </div>
          {selected.size > 0 && (
            <div className="mt-2 text-sm text-[#509ee3]">
              {selected.size} employee{selected.size > 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#509ee3]" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredEmployees.map((emp: any) => {
                const isSelected = selected.has(emp.id)
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleSelect(emp.id)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[#509ee3]/10 border border-[#509ee3]' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                      isSelected ? 'bg-[#509ee3] border-[#509ee3]' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{emp.employeeName}</div>
                      {emp.department?.departmentName && (
                        <div className="text-xs text-gray-500">{emp.department.departmentName}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#509ee3] text-white rounded-lg hover:bg-[#4990d6]"
          >
            Confirm ({selected.size})
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeSelector
