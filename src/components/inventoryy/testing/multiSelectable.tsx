// import React, { useState, useMemo, useEffect } from 'react'
// import { Search, Trash2 } from 'lucide-react'
// import { Input } from '@/components/ui/Input'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface Item {
//   id: number
//   itemName: string
//   sellingPrice: number
//   purchasePricePKR: number
//   barCode?: string
//   uom1?: { uom: string }
//   uom2?: number
//   uom2_qty?: string
//   uomTwo?: { uom: string }
//   uom3?: number
//   uom3_qty?: string
//   uomThree?: { uom: string }
//   skuUOM?: number
//   itemClass1?: number
//   itemClass2?: number
//   itemClass3?: number
//   itemClass4?: number
// }

// interface Props {
//   isPurchase?: boolean
//   preSelectedIds?: number[]  // e.g., [1, 2, 66, 78]
//   onSelectionChange?: (selected: Item[]) => void
// }

// export const MultiSelectItemTable: React.FC<Props> = ({
//   isPurchase = false,
//   preSelectedIds = [],
//   onSelectionChange
// }) => {
//   const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
//   const [searchTerm, setSearchTerm] = useState('')
//   const [classFilters, setClassFilters] = useState({ class1: '', class2: '', class3: '', class4: '' })
//   const [classData, setClassData] = useState<any>({})

//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000, includeClasses: true })
//   const allItems: Item[] = itemsResponse?.data || []

//   // ✅ Auto-populate preSelectedIds on mount or when preSelectedIds changes
//   useEffect(() => {
//     if (preSelectedIds.length > 0) {
//       setSelectedIds(new Set(preSelectedIds))
//     }
//   }, [preSelectedIds])

//   // Fetch class data for filters
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const results = await Promise.all([1, 2, 3, 4].map(id =>
//           fetch(`http://${window.location.hostname}:4000/api/z-classes/get-by-class-id/${id}`).then(r => r.json())
//         ))
//         setClassData({
//           class1: results[0]?.getByclassID || [],
//           class2: results[1]?.getByclassID || [],
//           class3: results[2]?.getByclassID || [],
//           class4: results[3]?.getByclassID || []
//         })
//       } catch (error) {
//         // ignore
//       }
//     }
//     fetchClasses()
//   }, [])

//   // Filtered items
//   const filteredItems = useMemo(() => {
//     return allItems.filter(item => {
//       if (searchTerm) {
//         const search = searchTerm.toLowerCase()
//         if (!item.itemName?.toLowerCase().includes(search) &&
//           !item.barCode?.toString().includes(search) &&
//           !item.id.toString().includes(search)) return false
//       }
//       if (classFilters.class1 && item.itemClass1 !== parseInt(classFilters.class1)) return false
//       if (classFilters.class2 && item.itemClass2 !== parseInt(classFilters.class2)) return false
//       if (classFilters.class3 && item.itemClass3 !== parseInt(classFilters.class3)) return false
//       if (classFilters.class4 && item.itemClass4 !== parseInt(classFilters.class4)) return false
//       return true
//     })
//   }, [allItems, searchTerm, classFilters])

//   // ✅ Selected items (full objects) - derived from selectedIds
//   const selectedItems = useMemo(
//     () => allItems.filter(item => selectedIds.has(item.id)),
//     [allItems, selectedIds]
//   )

//   // ✅ Notify parent whenever selection changes
//   useEffect(() => {
//     onSelectionChange?.(selectedItems)
//   }, [selectedItems, onSelectionChange])

//   // Select item
//   const handleSelect = (id: number) => {
//     setSelectedIds(prev => new Set(prev).add(id))
//   }

//   // Remove item
//   const handleRemove = (id: number) => {
//     setSelectedIds(prev => {
//       const newSet = new Set(prev)
//       newSet.delete(id)
//       return newSet
//     })
//   }

//   // Color palette
//   const chipColor = isPurchase ? 'bg-green-100 text-green-700 border-green-300' : 'bg-[#eaf4fb] text-[#509ee3] border-[#509ee3]'
//   const selectedRowColor = isPurchase ? 'bg-green-50' : 'bg-[#f1f7fb]'

//   if (isLoading) {
//     return <div className="text-center py-8 text-gray-500">Loading items...</div>
//   }

//   return (
//     <div className="bg-white rounded-xl border shadow-lg p-4 max-w-5xl mx-auto">

//       {/* ✅ Selected Items as Chips */}
//       {selectedItems.length > 0 && (
//         <div className="mb-4">
//           <div className="font-semibold mb-2">Selected Items ({selectedItems.length}):</div>
//           <div className="flex flex-wrap gap-2">
//             {selectedItems.map(item => (
//               <div
//                 key={item.id}
//                 className={`flex items-center px-3 py-1 rounded-full border ${chipColor} gap-2`}
//               >
//                 <span className="text-sm font-medium">{item.itemName}</span>
//                 <button
//                   onClick={() => handleRemove(item.id)}
//                   className="hover:bg-red-100 rounded-full p-1"
//                   title="Remove"
//                 >
//                   <Trash2 className="w-4 h-4 text-red-500" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//           <Input
//             placeholder="Search items..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         {[1, 2, 3, 4].map(num => (
//           <select
//             key={num}
//             value={classFilters[`class${num}` as keyof typeof classFilters]}
//             onChange={e => setClassFilters(prev => ({ ...prev, [`class${num}`]: e.target.value }))}
//             className="border border-gray-300 rounded px-3 py-2 text-sm"
//           >
//             <option value="">All Class {num}</option>
//             {(classData[`class${num}`] || []).map((cls: any) => (
//               <option key={cls.id} value={cls.id}>{cls.className}</option>
//             ))}
//           </select>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="overflow-auto max-h-[60vh] border rounded">
//         <table className="w-full">
//           <thead className="bg-gray-100 sticky top-0 z-10">
//             <tr>
//               <th className="w-12 px-4 py-3"></th>
//               <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
//               <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
//               <th className="px-4 py-3 text-left text-sm font-medium">UOM Structure</th>
//               <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
//               <th className="px-4 py-3 text-left text-sm font-medium">Barcode</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.map(item => {
//               const isSelected = selectedIds.has(item.id)
//               return (
//                 <tr
//                   key={item.id}
//                   className={`cursor-pointer ${isSelected ? selectedRowColor : 'hover:bg-gray-50'}`}
//                   onClick={() => !isSelected && handleSelect(item.id)}
//                 >
//                   <td className="px-4 py-3">
//                     {isSelected ? (
//                       <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Added</span>
//                     ) : (
//                       <input
//                         type="checkbox"
//                         checked={false}
//                         onChange={() => handleSelect(item.id)}
//                         onClick={e => e.stopPropagation()}
//                         className="accent-[#509ee3] w-4 h-4"
//                       />
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-sm">{item.id}</td>
//                   <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <div className="flex space-x-4">
//                       <div className="font-medium text-blue-600">
//                         1 {item.uom1?.uom || 'Unit'}
//                       </div>
//                       {item.uom2 && item.uomTwo?.uom && (
//                         <div className="text-green-600">
//                           {item.uom2_qty} {item.uomTwo.uom}
//                         </div>
//                       )}
//                       {item.uom3 && item.uomThree?.uom && (
//                         <div className="text-purple-600">
//                           {item.uom3_qty} {item.uomThree.uom}
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     {isPurchase ? (item.purchasePricePKR || '-') : (item.sellingPrice || '-')}
//                   </td>
//                   <td className="px-4 py-3 text-sm">{item.barCode || '-'}</td>
//                 </tr>
//               )
//             })}
//             {filteredItems.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="text-center py-12 text-gray-500">
//                   No items found matching your criteria
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }



































































// import React, { useState, useMemo, useEffect } from 'react'
// import { Search, Trash2 } from 'lucide-react'
// import { Input } from '@/components/ui/Input'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface ExtractedItem {
//   id: number
//   itemName: string
//   sellingPrice: number | null
//   purchasePricePKR: number | null
//   barCode?: string | number
//   uom1?: { uom: string }
//   uom2?: number
//   uom2_qty?: string
//   uomTwo?: { uom: string }
//   uom3?: number
//   uom3_qty?: string
//   uomThree?: { uom: string }
//   skuUOM?: number
//   itemClass1?: number
//   itemClass2?: number
//   itemClass3?: number
//   itemClass4?: number
// }

// interface Props {
//   isPurchase?: boolean
//   preSelectedIds?: number[]
//   onSelectionChange?: (selected: ExtractedItem[]) => void
// }

// export const MultiSelectItemTable: React.FC<Props> = ({
//   isPurchase = false,
//   preSelectedIds = [],
//   onSelectionChange
// }) => {
//   const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(preSelectedIds))
//   const [searchTerm, setSearchTerm] = useState('')

//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems: any[] = itemsResponse?.data || []

//   useEffect(() => {
//     if (preSelectedIds.length > 0) {
//       setSelectedIds(new Set(preSelectedIds))
//     }
//   }, [])

//   const filteredItems = useMemo(() => {
//     if (!searchTerm) return allItems
//     const search = searchTerm.toLowerCase()
//     return allItems.filter(item =>
//       item.itemName?.toLowerCase().includes(search) ||
//       item.barCode?.toString().includes(search) ||
//       item.id.toString().includes(search)
//     )
//   }, [allItems, searchTerm])

//   const selectedItems = useMemo(
//     () => allItems.filter(item => selectedIds.has(item.id)),
//     [allItems, selectedIds]
//   )

//   // ✅ Extract only required fields
//   const extractItemData = (item: any): ExtractedItem => ({
//     id: item.id,
//     itemName: item.itemName,
//     sellingPrice: item.sellingPrice,
//     purchasePricePKR: item.purchasePricePKR,
//     barCode: item.barCode,
//     uom1: item.uom1,
//     uom2: item.uom2,
//     uom2_qty: item.uom2_qty,
//     uomTwo: item.uomTwo,
//     uom3: item.uom3,
//     uom3_qty: item.uom3_qty,
//     uomThree: item.uomThree,
//     skuUOM: item.skuUOM,
//     itemClass1: item.itemClass1,
//     itemClass2: item.itemClass2,
//     itemClass3: item.itemClass3,
//     itemClass4: item.itemClass4
//   })

//   // ✅ Notify parent with extracted fields only
//   useEffect(() => {
//     const extractedItems = selectedItems.map(extractItemData)
//     onSelectionChange?.(extractedItems)
//   }, [selectedItems])

//   const handleSelect = (id: number) => {
//     setSelectedIds(prev => new Set(prev).add(id))
//   }

//   const handleRemove = (id: number) => {
//     setSelectedIds(prev => {
//       const newSet = new Set(prev)
//       newSet.delete(id)
//       return newSet
//     })
//   }

//   const chipColor = isPurchase
//     ? 'bg-green-100 text-green-700 border-green-300'
//     : 'bg-blue-100 text-blue-700 border-blue-300'

//   if (isLoading) {
//     return <div className="text-center py-8 text-gray-500">Loading items...</div>
//   }

//   return (
//     <div>
//       {/* Selected Items Chips */}
//       {selectedItems.length > 0 && (
//         <div className="mb-4">
//           <div className="font-medium mb-2">Selected ({selectedItems.length}):</div>
//           <div className="flex flex-wrap gap-2">
//             {selectedItems.map(item => (
//               <div
//                 key={item.id}
//                 className={`flex items-center px-3 py-1 rounded-full border ${chipColor} gap-2`}
//               >
//                 <span className="text-sm">{item.itemName}</span>
//                 <button onClick={() => handleRemove(item.id)} className="hover:bg-red-100 rounded-full p-1">
//                   <Trash2 className="w-3 h-3 text-red-500" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Search */}
//       <div className="relative mb-4">
//         <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//         <Input
//           placeholder="Search items..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           className="pl-10"
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-auto max-h-[50vh] border rounded">
//         <table className="w-full">
//           <thead className="bg-gray-100 sticky top-0">
//             <tr>
//               <th className="w-12 px-4 py-3"></th>
//               <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
//               <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
//               <th className="px-4 py-3 text-left text-sm font-medium">UOM</th>
//               <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.map(item => {
//               const isSelected = selectedIds.has(item.id)
//               return (
//                 <tr
//                   key={item.id}
//                   className={`cursor-pointer ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
//                   onClick={() => !isSelected && handleSelect(item.id)}
//                 >
//                   <td className="px-4 py-3">
//                     {isSelected ? (
//                       <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Added</span>
//                     ) : (
//                       <input
//                         type="checkbox"
//                         checked={false}
//                         onChange={() => handleSelect(item.id)}
//                         onClick={e => e.stopPropagation()}
//                       />
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-sm">{item.id}</td>
//                   <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
//                   <td className="px-4 py-3 text-sm">{item.uom1?.uom || '-'}</td>
//                   <td className="px-4 py-3 text-sm">
//                     {isPurchase ? item.purchasePricePKR : item.sellingPrice}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }



























































// import React, { useState, useMemo, useEffect } from 'react'
// import { Search, Trash2 } from 'lucide-react'
// import { Input } from '@/components/ui/Input'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface Props {
//   isPurchase?: boolean
//   preSelectedIds?: number[]
//   onSelectionChange?: (selected: any[]) => void
//   editable?: boolean // when false, selection cannot be changed (read-only mode)
// }

// export const MultiSelectItemTable: React.FC<Props> = ({
//   isPurchase = false,
//   preSelectedIds = [],
//   onSelectionChange,
//   editable = true
// }) => {
//   // Start empty and map incoming preSelectedIds to internal ids after items load
//   const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set())
//   const [searchTerm, setSearchTerm] = useState('')
//   // start empty so first-time preSelectedIds mapping runs when items load
//   const appliedPreSelectedKeyRef = React.useRef<string>('')
//   const lastSentRef = React.useRef<string>('') // remember last sent selection to avoid loops
//   console.log('📥 Received preSelectedIds:', preSelectedIds)

//   const queryArg = useMemo(() => ({ limit: 1000 }), [])
//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery(queryArg)
//   const allItems: any[] = itemsResponse?.data || []

//   // ✅ Extract only required fields
//   // const extractItemData = (item: any) => ({
//   //   id: item.id,
//   //   itemName: item.itemName,
//   //   sellingPrice: item.sellingPrice,
//   //   purchasePricePKR: item.purchasePricePKR,
//   //   barCode: item.barCode,
//   //   uom1: item.uom1,
//   //   uom2: item.uom2,
//   //   uom2_qty: item.uom2_qty,
//   //   uomTwo: item.uomTwo,
//   //   uom3: item.uom3,
//   //   uom3_qty: item.uom3_qty,
//   //   uomThree: item.uomThree,
//   //   skuUOM: item.skuUOM,
//   //   itemClass1: item.itemClass1,
//   //   itemClass2: item.itemClass2,
//   //   itemClass3: item.itemClass3,
//   //   itemClass4: item.itemClass4
//   // })







//  const extractItemData = (item: any) => ({
//     id: item.id,
//     itemName: item.itemName,
//     sellingPrice: item.sellingPrice,
//     purchasePricePKR: item.purchasePricePKR,
//     barCode: item.barCode,
//     uom1: item.skuUOM,
//     uom1_name: item.uom1.uom,
//     qyt_1: item.uom1_qyt,
//     uom2: item.uom2,
//     uom2_name:item.uomTwo.uom,
//     qty_2: item.uom2_qty,
//     // uomTwo: item.uomTwo,
//     uom3: item.uom3,
//     uom3_name: item.uomThree.uom,
//     qty_3: item.uom3_qty,
    
//     // skuUOM: item.skuUOM,
//     // itemClass1: item.itemClass1,
//     // itemClass2: item.itemClass2,
//     // itemClass3: item.itemClass3,
//     // itemClass4: item.itemClass4
//   }) 

//   // ✅ Manage preSelectedIds only when they change, and notify parent on selection updates
//   useEffect(() => {
//     // Wait for items to load
//     if (allItems.length === 0) {
//       console.log('⏳ Waiting for items to load...')
//       return
//     }

//     // Apply new preSelectedIds only when their value actually changes (parent intent)
//     const preKey = JSON.stringify(preSelectedIds || [])
//     if (preKey !== appliedPreSelectedKeyRef.current) {
//       appliedPreSelectedKeyRef.current = preKey
//       // Map incoming IDs (might be external Item_IDs, barcodes, or internal ids) to internal item.id
//       const mapped = new Set<number>()
//       ;(preSelectedIds || []).forEach((pre) => {
//         // try matching by different known fields
//         const found = allItems.find(it =>
//           String(it.id) === String(pre) ||
//           String(it.Item_ID) === String(pre) ||
//           (it.barCode !== undefined && String(it.barCode) === String(pre))
//         )
//         if (found) mapped.add(found.id)
//       })
//       console.log('🔀 Mapped preSelectedIds -> internal ids', preSelectedIds, Array.from(mapped))
//       // Only update state if it actually changed to avoid extra renders
//       const currentArray = Array.from(selectedIds).sort()
//       const mappedArray = Array.from(mapped).sort()
//       const isEqual = currentArray.length === mappedArray.length && currentArray.every((v, i) => v === mappedArray[i])
//       if (!isEqual) {
//         setSelectedIds(mapped)
//         // avoid notifying parent with the old (likely empty) selection in the same effect run
//         return
//       }
//     }

//     // Notify parent about current selection (derived only from selectedIds)
//     const selectedArray = Array.from(selectedIds)
//     const extracted = allItems
//       .filter(item => selectedArray.includes(item.id))
//       .map(extractItemData)

//     // Only notify if selection actually changed (prevents parent-child loops)
//     const extractedKey = JSON.stringify(extracted.map(i => i.id).sort())
//     if (extractedKey !== lastSentRef.current) {
//       lastSentRef.current = extractedKey
//       console.log('📤 Sending to parent:', extracted.length, 'items')
//       onSelectionChange?.(extracted)
//     } else {
//       console.log('✋ Skipping notify, selection unchanged')
//     }
//   // include selectedIds snapshot so effect runs whenever selection changes
//   }, [allItems.length, Array.from(selectedIds).join(','), preSelectedIds, onSelectionChange, editable])

//   // Filtered items
//   const filteredItems = useMemo(() => {
//     if (!searchTerm) return allItems
//     const search = searchTerm.toLowerCase()
//     return allItems.filter(item =>
//       item.itemName?.toLowerCase().includes(search) ||
//       item.barCode?.toString().includes(search) ||
//       item.id.toString().includes(search)
//     )
//   }, [allItems, searchTerm])

//   // When editable changes (e.g., modal opens), force re-apply mapping on next effect run
//   useEffect(() => {
//     if (editable) {
//       appliedPreSelectedKeyRef.current = ''
//     }
//   }, [editable])

//   // Selected items for display
//   const selectedItemsList = allItems.filter(item => selectedIds.has(item.id))

//   const handleSelect = (id: number) => {
//     if (!editable) return
//     setSelectedIds(prev => {
//       const s = new Set(prev)
//       s.add(id)
//       return s
//     })
//   }

//   const handleRemove = (id: number) => {
//     if (!editable) return
//     setSelectedIds(prev => {
//       const s = new Set(prev)
//       s.delete(id)
//       return s
//     })
//   }

//   const chipColor = isPurchase
//     ? 'bg-green-100 text-green-700 border-green-300'
//     : 'bg-blue-100 text-blue-700 border-blue-300'

//   if (isLoading) {
//     return <div className="text-center py-8 text-gray-500">Loading items...</div>
//   }

//   return (
//     <div>
//       {/* Selected Chips */}
//       {selectedItemsList.length > 0 && (
//         <div className="mb-4">
//           <div className="font-medium mb-2">Selected ({selectedItemsList.length}):</div>
//           <div className="flex flex-wrap gap-2">
//             {selectedItemsList.map(item => (
//               <div key={item.id} className={`flex items-center px-3 py-1 rounded-full border ${chipColor} gap-2`}>
//                 <span className="text-sm">{item.itemName}</span>
//                 {editable ? (
//                   <button onClick={() => handleRemove(item.id)} className="hover:bg-red-100 rounded-full p-1">
//                     <Trash2 className="w-3 h-3 text-red-500" />
//                   </button>
//                 ) : null}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Search and table: only show when editable (modal) */}
//       {editable ? (
//         <>
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//             <Input
//               placeholder="Search items..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="overflow-auto max-h-[50vh] border rounded">
//             <table className="w-full">
//               <thead className="bg-gray-100 sticky top-0">
//                 <tr>
//                   <th className="w-12 px-4 py-3"></th>
//                   <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium">UOM</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredItems.map(item => {
//                   const isSelected = selectedIds.has(item.id)
//                   return (
//                     <tr
//                       key={item.id}
//                       onClick={() => (isSelected ? handleRemove(item.id) : handleSelect(item.id))}
//                       className={`cursor-pointer ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
//                     >
//                       <td className="px-4 py-3">
//                         {isSelected ? (
//                           <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Added</span>
//                         ) : (
//                           <input
//                             type="checkbox"
//                             checked={isSelected}
//                             onChange={(e) => {
//                               e.stopPropagation()
//                               isSelected ? handleRemove(item.id) : handleSelect(item.id)
//                             }}
//                             onClick={e => e.stopPropagation()}
//                           />
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-sm">{item.id}</td>
//                       <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
//                       <td className="px-4 py-3 text-sm">{item.uom1?.uom || '-'}</td>
//                       <td className="px-4 py-3 text-sm">{isPurchase ? item.purchasePricePKR : item.sellingPrice}</td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </>
//       ) : (
//         // compact read-only summary only
//         selectedItemsList.length === 0 ? (
//           <div className="text-sm text-gray-500">No pre-selected items</div>
//         ) : null
//       )}
//     </div>
//   )
// }




















































// // components/inventoryy/testing/multiSelectable.tsx - WITH CLASS FILTERS
// import React, { useState, useMemo, useEffect } from 'react'
// import { Search, Trash2, Filter } from 'lucide-react'
// import { Input } from '@/components/ui/Input'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface Props {
//   isPurchase?: boolean
//   preSelectedIds?: number[]
//   onSelectionChange?: (selected: any[]) => void
//   editable?: boolean
// }

// export const MultiSelectItemTable: React.FC<Props> = ({
//   isPurchase = false,
//   preSelectedIds = [],
//   onSelectionChange,
//   editable = true
// }) => {
//   const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set())
//   const [searchTerm, setSearchTerm] = useState('')
//   const [classFilters, setClassFilters] = useState({
//     class1: '',
//     class2: '',
//     class3: '',
//     class4: ''
//   })
  
//   const appliedPreSelectedKeyRef = React.useRef<string>('')
//   const lastSentRef = React.useRef<string>('')

//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems: any[] = itemsResponse?.data || []

//   const extractItemData = (item: any) => ({
//     id: item.id,
//     itemName: item.itemName,
//     sellingPrice: item.sellingPrice,
//     purchasePricePKR: item.purchasePricePKR,
//     barCode: item.barCode,
//     uom1: item.skuUOM,
//     uom1_name: item.uom1?.uom,
//     qyt_1: item.uom1_qyt,
//     uom2: item.uom2,
//     uom2_name: item.uomTwo?.uom,
//     qty_2: item.uom2_qty,
//     uom3: item.uom3,
//     uom3_name: item.uomThree?.uom,
//     qty_3: item.uom3_qty,
//     itemClass1: item.itemClass1,
//     itemClass2: item.itemClass2,
//     itemClass3: item.itemClass3,
//     itemClass4: item.itemClass4
//   })

//   // ✅ Extract unique class values for filter dropdowns
//   const classOptions = useMemo(() => ({
//     class1: [...new Set(allItems.map(i => i.itemClass1).filter(Boolean))],
//     class2: [...new Set(allItems.map(i => i.itemClass2).filter(Boolean))],
//     class3: [...new Set(allItems.map(i => i.itemClass3).filter(Boolean))],
//     class4: [...new Set(allItems.map(i => i.itemClass4).filter(Boolean))]
//   }), [allItems])

//   useEffect(() => {
//     if (allItems.length === 0) return

//     const preKey = JSON.stringify(preSelectedIds || [])
//     if (preKey !== appliedPreSelectedKeyRef.current) {
//       appliedPreSelectedKeyRef.current = preKey
//       const mapped = new Set<number>()
//       preSelectedIds?.forEach((pre) => {
//         const found = allItems.find(it =>
//           String(it.id) === String(pre) ||
//           String(it.Item_ID) === String(pre) ||
//           String(it.barCode) === String(pre)
//         )
//         if (found) mapped.add(found.id)
//       })
      
//       const currentArray = Array.from(selectedIds).sort()
//       const mappedArray = Array.from(mapped).sort()
//       const isEqual = currentArray.length === mappedArray.length && currentArray.every((v, i) => v === mappedArray[i])
//       if (!isEqual) {
//         setSelectedIds(mapped)
//         return
//       }
//     }

//     const selectedArray = Array.from(selectedIds)
//     const extracted = allItems
//       .filter(item => selectedArray.includes(item.id))
//       .map(extractItemData)

//     const extractedKey = JSON.stringify(extracted.map(i => i.id).sort())
//     if (extractedKey !== lastSentRef.current) {
//       lastSentRef.current = extractedKey
//       onSelectionChange?.(extracted)
//     }
//   }, [allItems.length, Array.from(selectedIds).join(','), preSelectedIds])

//   // ✅ Combined filtering: Class filters + Search
//   const filteredItems = useMemo(() => {
//     let filtered = allItems

//     // Apply class filters
//     if (classFilters.class1) filtered = filtered.filter(i => i.itemClass1 === parseInt(classFilters.class1))
//     if (classFilters.class2) filtered = filtered.filter(i => i.itemClass2 === parseInt(classFilters.class2))
//     if (classFilters.class3) filtered = filtered.filter(i => i.itemClass3 === parseInt(classFilters.class3))
//     if (classFilters.class4) filtered = filtered.filter(i => i.itemClass4 === parseInt(classFilters.class4))

//     // Apply search
//     if (searchTerm) {
//       const search = searchTerm.toLowerCase()
//       filtered = filtered.filter(item =>
//         item.itemName?.toLowerCase().includes(search) ||
//         item.barCode?.toString().includes(search) ||
//         item.id.toString().includes(search)
//       )
//     }

//     return filtered
//   }, [allItems, searchTerm, classFilters])

//   useEffect(() => {
//     if (editable) appliedPreSelectedKeyRef.current = ''
//   }, [editable])

//   const selectedItemsList = allItems.filter(item => selectedIds.has(item.id))

//   const handleSelect = (id: number) => {
//     if (!editable) return
//     setSelectedIds(prev => new Set([...prev, id]))
//   }

//   const handleRemove = (id: number) => {
//     if (!editable) return
//     setSelectedIds(prev => {
//       const s = new Set(prev)
//       s.delete(id)
//       return s
//     })
//   }

//   const chipColor = isPurchase ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-100 text-blue-700 border-blue-300'

//   if (isLoading) return <div>Loading items...</div>

//   return (
//     <div>
//       {/* {selectedItemsList.length > 0 && (
//         <div className="mb-4">
//           <div className="font-medium mb-2">Selected ({selectedItemsList.length}):</div>
//           <div className="flex flex-wrap gap-2">
//             {selectedItemsList.map(item => (
//               <div key={item.id} className={`flex items-center px-3 py-1 rounded-full border ${chipColor} gap-2`}>
//                 <span className="text-sm">{item.itemName}</span>
//                 {editable && (
//                   <button onClick={() => handleRemove(item.id)}>
//                     <Trash2 className="w-3 h-3 text-red-500" />
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )} */}

//       {editable && (
//         <>
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-3 w-4 h-4" />
//             <Input placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
//           </div>

//           {/* ✅ Class Filter Dropdowns */}
//           <div className="flex gap-2 mb-4 items-center">
//             <Filter className="w-5 h-5 text-gray-500" />
//             {['class1', 'class2', 'class3', 'class4'].map(cls => (
//               <select
//                 key={cls}
//                 value={classFilters[cls as keyof typeof classFilters]}
//                 onChange={(e) => setClassFilters(prev => ({ ...prev, [cls]: e.target.value }))}
//                 className="border rounded px-2 py-1 text-sm"
//               >
//                 <option value="">All {cls}</option>
//                 {classOptions[cls as keyof typeof classOptions].map((val: any) => (
//                   <option key={val} value={val}>{val}</option>
//                 ))}
//               </select>
//             ))}
//           </div>

//           <div className="overflow-auto max-h-[50vh] border rounded">
//             <table className="w-full">
//               <thead className="bg-gray-100 sticky top-0">
//                 <tr>
//                   <th></th>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>UOM</th>
//                   <th>Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredItems.map(item => {
//                   const isSelected = selectedIds.has(item.id)
//                   return (
//                     <tr key={item.id} onClick={() => (isSelected ? handleRemove(item.id) : handleSelect(item.id))} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
//                       <td>
//                         {isSelected ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Added</span> : <input type="checkbox" />}
//                       </td>
//                       <td>{item.id}</td>
//                       <td>{item.itemName}</td>
//                       <td>{item.uom1?.uom || '-'}</td>
//                       <td>{isPurchase ? item.purchasePricePKR : item.sellingPrice}</td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }





















































// components/inventoryy/testing/multiSelectable.tsx - IMPROVED UI
import React, { useState, useMemo, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

interface Props {
  isPurchase?: boolean
  preSelectedIds?: number[]
  onSelectionChange?: (selected: any[]) => void
  editable?: boolean
}

export const MultiSelectItemTable: React.FC<Props> = ({
  isPurchase = false,
  preSelectedIds = [],
  onSelectionChange,
  editable = true
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilters, setClassFilters] = useState({
    class1: '',
    class2: '',
    class3: '',
    class4: ''
  })
  
  const appliedPreSelectedKeyRef = React.useRef<string>('')
  const lastSentRef = React.useRef<string>('')

  const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
  const allItems: any[] = itemsResponse?.data || []

  const extractItemData = (item: any) => ({
    id: item.id,
    itemName: item.itemName,
    sellingPrice: item.sellingPrice,
    purchasePricePKR: item.purchasePricePKR,
    barCode: item.barCode,
    uom1: item.skuUOM,
    uom1_name: item.uom1?.uom,
    qyt_1: item.uom1_qyt,
    uom2: item.uom2,
    uom2_name: item.uomTwo?.uom,
    qty_2: item.uom2_qty,
    uom3: item.uom3,
    uom3_name: item.uomThree?.uom,
    qty_3: item.uom3_qty,
    itemClass1: item.itemClass1,
    itemClass2: item.itemClass2,
    itemClass3: item.itemClass3,
    itemClass4: item.itemClass4
  })

  const classOptions = useMemo(() => ({
    class1: [...new Set(allItems.map(i => i.itemClass1).filter(Boolean))],
    class2: [...new Set(allItems.map(i => i.itemClass2).filter(Boolean))],
    class3: [...new Set(allItems.map(i => i.itemClass3).filter(Boolean))],
    class4: [...new Set(allItems.map(i => i.itemClass4).filter(Boolean))]
  }), [allItems])

  useEffect(() => {
    if (allItems.length === 0) return

    const preKey = JSON.stringify(preSelectedIds || [])
    if (preKey !== appliedPreSelectedKeyRef.current) {
      appliedPreSelectedKeyRef.current = preKey
      const mapped = new Set<number>()
      preSelectedIds?.forEach((pre) => {
        const found = allItems.find(it =>
          String(it.id) === String(pre) ||
          String(it.Item_ID) === String(pre) ||
          String(it.barCode) === String(pre)
        )
        if (found) mapped.add(found.id)
      })
      
      const currentArray = Array.from(selectedIds).sort()
      const mappedArray = Array.from(mapped).sort()
      const isEqual = currentArray.length === mappedArray.length && currentArray.every((v, i) => v === mappedArray[i])
      if (!isEqual) {
        setSelectedIds(mapped)
        return
      }
    }

    const selectedArray = Array.from(selectedIds)
    const extracted = allItems
      .filter(item => selectedArray.includes(item.id))
      .map(extractItemData)

    const extractedKey = JSON.stringify(extracted.map(i => i.id).sort())
    if (extractedKey !== lastSentRef.current) {
      lastSentRef.current = extractedKey
      onSelectionChange?.(extracted)
    }
  }, [allItems.length, Array.from(selectedIds).join(','), preSelectedIds])

  const filteredItems = useMemo(() => {
    let filtered = allItems

    if (classFilters.class1) filtered = filtered.filter(i => i.itemClass1 === parseInt(classFilters.class1))
    if (classFilters.class2) filtered = filtered.filter(i => i.itemClass2 === parseInt(classFilters.class2))
    if (classFilters.class3) filtered = filtered.filter(i => i.itemClass3 === parseInt(classFilters.class3))
    if (classFilters.class4) filtered = filtered.filter(i => i.itemClass4 === parseInt(classFilters.class4))

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        item.itemName?.toLowerCase().includes(search) ||
        item.barCode?.toString().includes(search) ||
        item.id.toString().includes(search)
      )
    }

    return filtered
  }, [allItems, searchTerm, classFilters])

  useEffect(() => {
    if (editable) appliedPreSelectedKeyRef.current = ''
  }, [editable])

  const handleSelect = (id: number) => {
    if (!editable) return
    setSelectedIds(prev => new Set([...prev, id]))
  }

  const handleRemove = (id: number) => {
    if (!editable) return
    setSelectedIds(prev => {
      const s = new Set(prev)
      s.delete(id)
      return s
    })
  }

  if (isLoading) return <div className="text-center py-8">Loading items...</div>

  return (
    <div>
      {editable && (
        <>
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by name, barcode, ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              {['class1', 'class2', 'class3', 'class4'].map(cls => (
                <select
                  key={cls}
                  value={classFilters[cls as keyof typeof classFilters]}
                  onChange={(e) => setClassFilters(prev => ({ ...prev, [cls]: e.target.value }))}
                  className="border rounded px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All {cls.replace('class', 'Class ')}</option>
                  {classOptions[cls as keyof typeof classOptions].map((val: any) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <div className="overflow-auto max-h-[60vh] border rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">UOM Conversions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => {
                  const isSelected = selectedIds.has(item.id)
                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => (isSelected ? handleRemove(item.id) : handleSelect(item.id))} 
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3">
                        {isSelected ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Added
                          </span>
                        ) : (
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            checked={false}
                            readOnly
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        {item.barCode && <div className="text-xs text-gray-500">Barcode: {item.barCode}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-4 items-center">
                          <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="text-sm font-medium text-blue-600">
                              1 {item.uom1?.uom || 'Unit'}
                            </span>
                          </div>
                          {item.uom2 && item.uomTwo?.uom && (
                            <div className="flex items-center space-x-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="text-sm text-green-600">
                                {item.uom2_qty} {item.uom1?.uom} / {item.uomTwo.uom}
                              </span>
                            </div>
                          )}
                          {item.uom3 && item.uomThree?.uom && (
                            <div className="flex items-center space-x-1">
                              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                              <span className="text-sm text-yellow-600">
                                {item.uom3_qty} {item.uom1?.uom} / {item.uomThree.uom}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {isPurchase ? item.purchasePricePKR : item.sellingPrice}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredItems.length} items | Selected: {selectedIds.size}
          </div>
        </>
      )}
    </div>
  )
}
