// import { useState, useEffect } from 'react'
// import { StockReportFilters } from '@/types/reports/stock/StockReportTypes'

// interface StockReportFiltersProps {
//   filters: StockReportFilters
//   setFilters: React.Dispatch<React.SetStateAction<StockReportFilters>>
//   onApply: () => void
//   loading: boolean
// }

// interface ClassData {
//   class1: any[]
//   class2: any[]
//   class3: any[]
//   class4: any[]
// }

// export default function StockReportFilters({ 
//   filters, 
//   setFilters, 
//   onApply, 
//   loading 
// }: StockReportFiltersProps) {
//   const [classData, setClassData] = useState<ClassData>({
//     class1: [],
//     class2: [],
//     class3: [],
//     class4: []
//   })

//   // Fetch class data (same as your existing logic)
//   useEffect(() => {
//     const fetchClassData = async () => {
//       try {
//         const promises = [1, 2, 3, 4].map(id =>
//           fetch(`/api/z-classes/get-by-class-id/${id}`)
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

//   const hasActiveFilters = filters.itemClass1 || filters.itemClass2 || 
//                           filters.itemClass3 || filters.itemClass4 || 
//                           filters.searchTerm.trim()

//   const clearAllFilters = () => {
//     setFilters({
//       itemClass1: null,
//       itemClass2: null,
//       itemClass3: null,
//       itemClass4: null,
//       selectedUom: 1,
//       searchTerm: ''
//     })
//   }

//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <h3 className="text-lg font-medium mb-4">Stock Report Filters</h3>
      
//       {/* Warning if no filters */}
//       {!hasActiveFilters && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
//           <p className="text-yellow-800 text-sm">
//             ⚠️ At least one filter is required to display stock data
//           </p>
//         </div>
//       )}

//       <div className="space-y-4">
        
//         {/* Search */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Search Items
//           </label>
//           <input
//             type="text"
//             placeholder="Search by item name or number..."
//             value={filters.searchTerm}
//             onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         {/* Class Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Class 1 */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Item Class 1
//             </label>
//             <select
//               value={filters.itemClass1 || ''}
//               onChange={(e) => setFilters(prev => ({ 
//                 ...prev, 
//                 itemClass1: e.target.value ? Number(e.target.value) : null 
//               }))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Any Class 1</option>
//               {classData.class1.map(item => (
//                 <option key={item.id} value={item.id}>
//                   {item.className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Class 2 */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Item Class 2
//             </label>
//             <select
//               value={filters.itemClass2 || ''}
//               onChange={(e) => setFilters(prev => ({ 
//                 ...prev, 
//                 itemClass2: e.target.value ? Number(e.target.value) : null 
//               }))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Any Class 2</option>
//               {classData.class2.map(item => (
//                 <option key={item.id} value={item.id}>
//                   {item.className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Class 3 */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Item Class 3
//             </label>
//             <select
//               value={filters.itemClass3 || ''}
//               onChange={(e) => setFilters(prev => ({ 
//                 ...prev, 
//                 itemClass3: e.target.value ? Number(e.target.value) : null 
//               }))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Any Class 3</option>
//               {classData.class3.map(item => (
//                 <option key={item.id} value={item.id}>
//                   {item.className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Class 4 */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Item Class 4
//             </label>
//             <select
//               value={filters.itemClass4 || ''}
//               onChange={(e) => setFilters(prev => ({ 
//                 ...prev, 
//                 itemClass4: e.target.value ? Number(e.target.value) : null 
//               }))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Any Class 4</option>
//               {classData.class4.map(item => (
//                 <option key={item.id} value={item.id}>
//                   {item.className}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* UOM Selection */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Select Unit of Measure (UOM)
//           </label>
//           <div className="flex space-x-4">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="selectedUom"
//                 value={1}
//                 checked={filters.selectedUom === 1}
//                 onChange={(e) => setFilters(prev => ({ 
//                   ...prev, 
//                   selectedUom: Number(e.target.value) as 1 | 2 | 3 
//                 }))}
//                 className="mr-2"
//               />
//               UOM 1 (Base Unit)
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="selectedUom"
//                 value={2}
//                 checked={filters.selectedUom === 2}
//                 onChange={(e) => setFilters(prev => ({ 
//                   ...prev, 
//                   selectedUom: Number(e.target.value) as 1 | 2 | 3 
//                 }))}
//                 className="mr-2"
//               />
//               UOM 2 (Secondary)
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="selectedUom"
//                 value={3}
//                 checked={filters.selectedUom === 3}
//                 onChange={(e) => setFilters(prev => ({ 
//                   ...prev, 
//                   selectedUom: Number(e.target.value) as 1 | 2 | 3 
//                 }))}
//                 className="mr-2"
//               />
//               UOM 3 (Tertiary)
//             </label>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center">
//           <div className="text-sm text-gray-600">
//             {hasActiveFilters ? (
//               <span className="text-green-600 font-medium">✅ Filters applied</span>
//             ) : (
//               <span className="text-red-600 font-medium">⚠️ No filters applied</span>
//             )}
//           </div>
          
//           <div className="space-x-3">
//             <button
//               onClick={clearAllFilters}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//             >
//               Clear All
//             </button>
//             <button
//               onClick={onApply}
//               disabled={loading || !hasActiveFilters}
//               className={`px-6 py-2 rounded-md font-medium ${
//                 loading || !hasActiveFilters
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-blue-600 text-white hover:bg-blue-700'
//               }`}
//             >
//               {loading ? 'Processing...' : 'Apply Filters'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }















































import { StockReportFilters, ClassOption } from '@/types/reports/stock/StockReportTypes'

interface StockReportFiltersProps {
  filters: StockReportFilters
  setFilters: React.Dispatch<React.SetStateAction<StockReportFilters>>
  classOptions: {
    class1: ClassOption[]
    class2: ClassOption[]
    class3: ClassOption[]
    class4: ClassOption[]
  }
  loading: boolean
}

export default function StockReportFilters({ 
  filters, 
  setFilters, 
  classOptions,
  loading 
}: StockReportFiltersProps) {

  const hasActiveFilters = filters.itemClass1 || filters.itemClass2 || 
                          filters.itemClass3 || filters.itemClass4 || 
                          filters.searchTerm.trim()

  const clearAllFilters = () => {
    setFilters(prev => ({
      ...prev,
      itemClass1: null,
      itemClass2: null,
      itemClass3: null,
      itemClass4: null,
      searchTerm: ''
    }))
  }

  const getUomLabel = () => {
    switch (filters.selectedUom) {
      case 1: return 'UOM 1 (Base Unit)'
      case 2: return 'UOM 2 (Secondary)'  
      case 3: return 'UOM 3 (Tertiary)'
      default: return 'UOM'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Stock Movement Report Filters</h3>
      
      {/* Warning if no filters */}
      {!hasActiveFilters && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-yellow-800 text-sm">
            ⚠️ At least one filter is required to display stock data
          </p>
        </div>
      )}

      <div className="space-y-6">
        
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Search Items
          </label>
          <input
            type="text"
            placeholder="Search by item name or number..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Class Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🏷️ Filter by Item Classification
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Class 1 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Item Class 1</label>
              <select
                value={filters.itemClass1 || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  itemClass1: e.target.value ? Number(e.target.value) : null 
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Class 1</option>
                {classOptions.class1.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Class 2 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Item Class 2</label>
              <select
                value={filters.itemClass2 || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  itemClass2: e.target.value ? Number(e.target.value) : null 
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Class 2</option>
                {classOptions.class2.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Class 3 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Item Class 3</label>
              <select
                value={filters.itemClass3 || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  itemClass3: e.target.value ? Number(e.target.value) : null 
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Class 3</option>
                {classOptions.class3.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Class 4 */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Item Class 4</label>
              <select
                value={filters.itemClass4 || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  itemClass4: e.target.value ? Number(e.target.value) : null 
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Class 4</option>
                {classOptions.class4.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* UOM Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📏 Select Unit of Measure (UOM)
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="selectedUom"
                value={1}
                checked={filters.selectedUom === 1}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  selectedUom: Number(e.target.value) as 1 | 2 | 3 
                }))}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm">UOM 1 (Base Unit)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="selectedUom"
                value={2}
                checked={filters.selectedUom === 2}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  selectedUom: Number(e.target.value) as 1 | 2 | 3 
                }))}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm">UOM 2 (Secondary)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="selectedUom"
                value={3}
                checked={filters.selectedUom === 3}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  selectedUom: Number(e.target.value) as 1 | 2 | 3 
                }))}
                className="mr-2 text-blue-600"
              />
              <span className="text-sm">UOM 3 (Tertiary)</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Currently selected: <strong>{getUomLabel()}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {hasActiveFilters ? (
              <span className="text-green-600 font-medium">✅ Filters applied</span>
            ) : (
              <span className="text-red-600 font-medium">⚠️ No filters applied</span>
            )}
          </div>
          
          <div className="space-x-3">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
