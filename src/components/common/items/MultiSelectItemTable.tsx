// // components/ui/MultiSelectItemTable.tsx - KEEP OPEN AFTER ADDING
// 'use client'
// import React, { useState, useMemo, useEffect } from 'react'
// import { Search, X, Loader2, Check, Plus } from 'lucide-react'
// import { Button } from '../../ui/Button'
// import { Input } from '../../ui/Input'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'
// import type { Item } from '@/store/slice/itemsApi'

// // ✅ ADD THIS MISSING INTERFACE:
// export interface ExtractedItemData {
//   id: number
//   itemName: string
//   sellingPrice: number
//   purchasePricePKR: number
//   uomData: {
//     primary: {
//       id: number
//       name: string
//       qty: number
//     }
//     secondary?: {
//       id: number
//       name: string
//       qty: number
//     }
//     tertiary?: {
//       id: number
//       name: string
//       qty: number
//     }
//   }
//   rawUomData: {
//     skuUOM: number
//     uom1_qty: number
//     uom2?: number
//     uom2_qty?: string
//     uom3?: number
//     uom3_qty?: string
//   }
//   originalItem: Item
// }

// interface MultiSelectItemTableProps {
//   onSelectionComplete: (selectedItems: ExtractedItemData[]) => void
//   onCancel: () => void
//   isPurchase?: boolean
//   alreadyAddedItemIds?: number[]
// }


// interface MultiSelectItemTableProps {
//   onSelectionComplete: (selectedItems: ExtractedItemData[]) => void
//   onCancel: () => void
//   isPurchase?: boolean
//   alreadyAddedItemIds?: number[]
// }

// export const MultiSelectItemTable: React.FC<MultiSelectItemTableProps> = ({
//   onSelectionComplete,
//   onCancel,
//   isPurchase = false,
//   alreadyAddedItemIds = []
// }) => {
//   const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
//   const [searchTerm, setSearchTerm] = useState('')
//   const [classFilters, setClassFilters] = useState({ class1: '', class2: '', class3: '', class4: '' })
//   const [classData, setClassData] = useState<any>({})
//   const [addedCount, setAddedCount] = useState(0) // ✅ Track how many times items were added

//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000, includeClasses: true })
//   const allItems = itemsResponse?.data || []

//   const alreadyAddedSet = useMemo(() => new Set(alreadyAddedItemIds), [alreadyAddedItemIds])

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
//         console.error('Error loading classes:', error)
//       }
//     }
//     fetchClasses()
//   }, [])

//   const filteredItems = useMemo(() => {
//     return allItems.filter(item => {
//       if (searchTerm) {
//         const search = searchTerm.toLowerCase()
//         if (!item.itemName?.toLowerCase().includes(search) && 
//             !item.barCode?.toString().includes(search) && 
//             !item.id.toString().includes(search)) return false
//       }
//       if (classFilters.class1 && item.itemClass1 !== parseInt(classFilters.class1)) return false
//       if (classFilters.class2 && item.itemClass2 !== parseInt(classFilters.class2)) return false
//       if (classFilters.class3 && item.itemClass3 !== parseInt(classFilters.class3)) return false
//       if (classFilters.class4 && item.itemClass4 !== parseInt(classFilters.class4)) return false
//       return true
//     })
//   }, [allItems, searchTerm, classFilters])

//   const toggleItem = (id: number) => {
//     if (alreadyAddedSet.has(id)) {
//       console.log(`⚠️ Item ${id} is already added to the order`)
//       return
//     }

//     const newSelected = new Set(selectedItems)
//     if (newSelected.has(id)) {
//       newSelected.delete(id)
//       console.log(`❌ Item ${id} deselected`)
//     } else {
//       newSelected.add(id)
//       console.log(`✅ Item ${id} selected`)
//     }
//     setSelectedItems(newSelected)
//   }

//   const selectAll = () => {
//     const availableItems = filteredItems.filter(item => !alreadyAddedSet.has(item.id))

//     if (selectedItems.size === availableItems.length) {
//       setSelectedItems(new Set())
//       console.log('❌ All available items deselected')
//     } else {
//       const allAvailableIds = new Set(availableItems.map(item => item.id))
//       setSelectedItems(allAvailableIds)
//       console.log(`✅ ${availableItems.length} available items selected`)
//     }
//   }

//   const extractUomData = (item: Item): ExtractedItemData => {
//     const extractedData: ExtractedItemData = {
//       id: item.id,
//       itemName: item.itemName,
//       sellingPrice: parseFloat(item.sellingPrice?.toString() || '0'),
//       purchasePricePKR: parseFloat(item.purchasePricePKR?.toString() || '0'),

//       uomData: {
//         primary: {
//           id: item.skuUOM || 0,
//           name: item.uom1?.uom || 'Unknown',
//           qty: 1
//         }
//       },

//       rawUomData: {
//         skuUOM: item.skuUOM || 0,
//         uom1_qty: 1,
//         uom2: item.uom2 || undefined,
//         uom2_qty: item.uom2_qty || undefined,
//         uom3: item.uom3 || undefined,
//         uom3_qty: item.uom3_qty || undefined
//       },

//       originalItem: item
//     }

//     if (item.uom2 && item.uomTwo?.uom && item.uom2_qty) {
//       extractedData.uomData.secondary = {
//         id: item.uom2,
//         name: item.uomTwo.uom,
//         qty: parseFloat(item.uom2_qty)
//       }
//     }

//     if (item.uom3 && item.uomThree?.uom && item.uom3_qty) {
//       extractedData.uomData.tertiary = {
//         id: item.uom3,
//         name: item.uomThree.uom,
//         qty: parseFloat(item.uom3_qty)
//       }
//     }

//     return extractedData
//   }

//   // ✅ FIX: Don't close modal, just clear selection and increment counter
//   const addItems = () => {
//     const selectedItemsArray = allItems.filter(item => selectedItems.has(item.id))
//     const extractedItems = selectedItemsArray.map(item => extractUomData(item))

//     console.group(`📦 Adding Items (Batch #${addedCount + 1})`)
//     console.log('Selected Items Count:', extractedItems.length)
//     console.log('Items Added This Session:', addedCount + 1)
//     console.log('Modal Status: STAYING OPEN for more selections')
//     console.groupEnd()

//     onSelectionComplete(extractedItems)

//     // ✅ FIX: Clear selection but keep modal open
//     setSelectedItems(new Set())
//     setAddedCount(prev => prev + 1)

//     console.log('✅ Items added! Modal remains open for more selections.')
//   }

//   const availableItemsCount = filteredItems.filter(item => !alreadyAddedSet.has(item.id)).length
//   const alreadyAddedCount = filteredItems.filter(item => alreadyAddedSet.has(item.id)).length

//   const theme = isPurchase ? 'green' : 'blue'

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-8 flex items-center gap-4">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>Loading items...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
//       <div className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

//         {/* ✅ Enhanced header with session info */}
//         <div className={`bg-${theme}-500 text-white p-4 rounded-t-xl flex justify-between items-center`}>
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-bold">Select Items</h2>
//             <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
//               {selectedItems.size} selected
//             </span>
//             {addedCount > 0 && (
//               <span className="bg-green-500 bg-opacity-80 px-3 py-1 rounded-full text-sm">
//                 {addedCount} batches added
//               </span>
//             )}
//             {alreadyAddedCount > 0 && (
//               <span className="bg-red-500 bg-opacity-80 px-3 py-1 rounded-full text-sm">
//                 {alreadyAddedCount} already added
//               </span>
//             )}
//           </div>
//           <button onClick={onCancel}><X className="w-5 h-5" /></button>
//         </div>

//         {/* ✅ Enhanced info banner */}
//         {addedCount > 0 && (
//           <div className="bg-green-50 border-b border-green-200 px-6 py-3">
//             <p className="text-green-800 text-sm">
//               ✅ <strong>{addedCount} batch(es) added successfully!</strong> 
//               You can continue selecting more items or close the modal when finished.
//             </p>
//           </div>
//         )}

//         <div className="p-4 border-b space-y-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//             <Input
//               placeholder="Search items..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="grid grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map(num => (
//               <select
//                 key={num}
//                 value={classFilters[`class${num}` as keyof typeof classFilters]}
//                 onChange={e => setClassFilters(prev => ({ ...prev, [`class${num}`]: e.target.value }))}
//                 className="border border-gray-300 rounded px-3 py-2 text-sm"
//               >
//                 <option value="">All Class {num}</option>
//                 {(classData[`class${num}`] || []).map((cls: any) => (
//                   <option key={cls.id} value={cls.id}>{cls.className}</option>
//                 ))}
//               </select>
//             ))}
//           </div>

//           <div className="flex justify-between text-sm text-gray-600">
//             <div>
//               Showing {filteredItems.length} items 
//               ({availableItemsCount} available, {alreadyAddedCount} already added)
//             </div>
//             {availableItemsCount > 0 && (
//               <button onClick={selectAll} className={`text-${theme}-600 hover:underline`}>
//                 {selectedItems.size === availableItemsCount ? 'Deselect All' : 'Select All Available'}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex-1 overflow-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 sticky top-0">
//               <tr>
//                 <th className="w-12 px-4 py-3">
//                   <input 
//                     type="checkbox" 
//                     checked={availableItemsCount > 0 && selectedItems.size === availableItemsCount} 
//                     onChange={selectAll}
//                     disabled={availableItemsCount === 0}
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium">UOM Structure</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium">Barcode</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredItems.map(item => {
//                 const isAlreadyAdded = alreadyAddedSet.has(item.id)
//                 const isSelected = selectedItems.has(item.id)

//                 return (
//                   <tr
//                     key={item.id}
//                     className={`cursor-pointer ${
//                       isAlreadyAdded 
//                         ? 'bg-red-50 text-gray-500' 
//                         : isSelected 
//                           ? `bg-${theme}-50` 
//                           : 'hover:bg-gray-50'
//                     }`}
//                     onClick={() => !isAlreadyAdded && toggleItem(item.id)}
//                   >
//                     <td className="px-4 py-3">
//                       {isAlreadyAdded ? (
//                         <Check className="w-4 h-4 text-red-500" />
//                       ) : (
//                         <input 
//                           type="checkbox" 
//                           checked={isSelected} 
//                           onChange={() => toggleItem(item.id)}
//                         />
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       {isAlreadyAdded ? (
//                         <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
//                           Already Added
//                         </span>
//                       ) : isSelected ? (
//                         <span className={`text-xs bg-${theme}-100 text-${theme}-700 px-2 py-1 rounded-full`}>
//                           Selected
//                         </span>
//                       ) : (
//                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                           Available
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-sm">{item.id}</td>
//                     <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
//                     <td className="px-4 py-3 text-sm">
//                       <div className="space-y-1">
//                         <div className="font-medium text-blue-600">
//                           1 {item.uom1?.uom || 'Unit'}
//                         </div>
//                         {item.uom2 && item.uomTwo?.uom && (
//                           <div className="text-green-600">
//                             {item.uom2_qty} {item.uomTwo.uom}
//                           </div>
//                         )}
//                         {item.uom3 && item.uomThree?.uom && (
//                           <div className="text-purple-600">
//                             {item.uom3_qty} {item.uomThree.uom}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-sm">
//                       {isPurchase ? (item.purchasePricePKR || '-') : (item.sellingPrice || '-')}
//                     </td>
//                     <td className="px-4 py-3 text-sm">{item.barCode || '-'}</td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>

//           {filteredItems.length === 0 && (
//             <div className="text-center py-12 text-gray-500">
//               No items found matching your criteria
//             </div>
//           )}
//         </div>

//         {/* ✅ Enhanced footer with continuous selection info */}
//         <div className="border-t p-4 flex justify-between items-center">
//           <div className="text-sm text-gray-600">
//             <div>{selectedItems.size} items selected</div>
//             <div className="text-xs mt-1">
//               {alreadyAddedItemIds.length} total items in order • {addedCount} batches added this session
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <Button variant="ghost" onClick={onCancel}>
//               Close & Finish
//             </Button>
//             <Button
//               variant="primary"
//               onClick={addItems}
//               disabled={selectedItems.size === 0}
//               className={`${theme === 'green' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} flex items-center gap-2`}
//             >
//               <Plus className="w-4 h-4" />
//               Add Selected Items ({selectedItems.size})
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




























































// components/ui/MultiSelectItemTable.tsx
'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Search, X, Loader2, Check, Plus } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'
import type { Item } from '@/store/slice/itemsApi'

export interface ExtractedItemData {
  id: number
  itemName: string
  price: number
  uomData: {
    primary: { id: number; name: string; qty: number }
    secondary?: { id: number; name: string; qty: number }
    tertiary?: { id: number; name: string; qty: number }
  }
  rawUomData: {
    skuUOM: number
    uom1_qty: number
    uom2?: number
    uom2_qty?: string
    uom3?: number
    uom3_qty?: string
  }
  originalItem: Item
}

interface MultiSelectItemTableProps {
  onSelectionComplete: (selectedItems: ExtractedItemData[]) => void
  onCancel: () => void
  isPurchase?: boolean
  alreadyAddedItemIds?: number[]
}

export const MultiSelectItemTable: React.FC<MultiSelectItemTableProps> = ({
  onSelectionComplete,
  onCancel,
  isPurchase = false,
  alreadyAddedItemIds = []
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilters, setClassFilters] = useState({ class1: '', class2: '', class3: '', class4: '' })
  const [classData, setClassData] = useState<any>({})
  const [addedCount, setAddedCount] = useState(0)

  const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000, includeClasses: true })
  const allItems = itemsResponse?.data || []

  const alreadyAddedSet = useMemo(() => new Set(alreadyAddedItemIds), [alreadyAddedItemIds])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const results = await Promise.all([1, 2, 3, 4].map(id =>
          fetch(`http://${window.location.hostname}:4000/api/z-classes/get-by-class-id/${id}`).then(r => r.json())
        ))
        setClassData({
          class1: results[0]?.getByclassID || [],
          class2: results[1]?.getByclassID || [],
          class3: results[2]?.getByclassID || [],
          class4: results[3]?.getByclassID || []
        })
      } catch (error) {
        console.error('Error loading classes:', error)
      }
    }
    fetchClasses()
  }, [])

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        if (!item.itemName?.toLowerCase().includes(search) &&
          !item.barCode?.toString().includes(search) &&
          !item.id.toString().includes(search)) return false
      }
      if (classFilters.class1 && item.itemClass1 !== parseInt(classFilters.class1)) return false
      if (classFilters.class2 && item.itemClass2 !== parseInt(classFilters.class2)) return false
      if (classFilters.class3 && item.itemClass3 !== parseInt(classFilters.class3)) return false
      if (classFilters.class4 && item.itemClass4 !== parseInt(classFilters.class4)) return false
      return true
    })
  }, [allItems, searchTerm, classFilters])

  const toggleItem = (id: number) => {
    if (alreadyAddedSet.has(id)) return
    const newSelected = new Set(selectedItems)
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
    setSelectedItems(newSelected)
  }

  const selectAll = () => {
    const availableItems = filteredItems.filter(item => !alreadyAddedSet.has(item.id))
    if (selectedItems.size === availableItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(availableItems.map(item => item.id)))
    }
  }

  const extractUomData = (item: Item): ExtractedItemData => {
    return {
      id: item.id,
      itemName: item.itemName,
      price: isPurchase
        ? parseFloat(item.purchasePricePKR?.toString() || '0')
        : parseFloat(item.sellingPrice?.toString() || '0'),
      uomData: {
        primary: {
          id: item.skuUOM || 0,
          name: item.uom1?.uom || 'Unknown',
          qty: 1
        },
        ...(item.uom2 && item.uomTwo?.uom && item.uom2_qty
          ? {
            secondary: {
              id: item.uom2,
              name: item.uomTwo.uom,
              qty: parseFloat(item.uom2_qty)
            }
          }
          : {}),
        ...(item.uom3 && item.uomThree?.uom && item.uom3_qty
          ? {
            tertiary: {
              id: item.uom3,
              name: item.uomThree.uom,
              qty: parseFloat(item.uom3_qty)
            }
          }
          : {})
      },
      rawUomData: {
        skuUOM: item.skuUOM || 0,
        uom1_qty: 1,
        uom2: item.uom2 || undefined,
        uom2_qty: item.uom2_qty || undefined,
        uom3: item.uom3 || undefined,
        uom3_qty: item.uom3_qty || undefined
      },
      originalItem: item
    }
  }

  // Don't close modal, just clear selection and increment counter
  const addItems = () => {
    const selectedItemsArray = allItems.filter(item => selectedItems.has(item.id))
    const extractedItems = selectedItemsArray.map(item => extractUomData(item))
    onSelectionComplete(extractedItems)
    setSelectedItems(new Set())
    setAddedCount(prev => prev + 1)
  }

  const availableItemsCount = filteredItems.filter(item => !alreadyAddedSet.has(item.id)).length
  const alreadyAddedCount = filteredItems.filter(item => alreadyAddedSet.has(item.id)).length

  // Color palette
  const colorHex = isPurchase ? '#509ee3' : '#509ee3'
  const colorHover = isPurchase ? '#509ee3' : '#4990d6'

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 flex items-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading items...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl " onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div
          className="p-4 rounded-t-xl flex justify-between items-center "
          style={{ background: colorHex, color: 'white' }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Select Items
            </h2>
            <span className="bg-white text-[#509ee3] bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {selectedItems.size} selected
            </span>
            {/* {addedCount > 0 && (
              <span className="bg-green-500 bg-opacity-80 px-3 py-1 rounded-full text-sm">
                {addedCount} batches added
              </span>
            )} */}
            {/* {alreadyAddedCount > 0 && (
              <span className="bg-red-500 bg-opacity-80 px-3 py-1 rounded-full text-sm">
                {alreadyAddedCount} already added
              </span>
            )} */}
          </div>
          <button onClick={onCancel} className="hover:bg-red-100 rounded p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        {/* {addedCount > 0 && (
          <div className="bg-green-50 border-b border-green-200 px-6 py-3">
            <p className="text-green-800 text-sm">
              ✅ <strong>{addedCount} batch(es) added successfully!</strong>
              You can continue selecting more items or close the modal when finished.
            </p>
          </div>
        )} */}

        {/* Filters */}
        <div className="p-4  space-y-4 bg-gray-50">
         
          <div className="grid grid-cols-5 gap-4">
             <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
            {[1, 2, 3, 4].map(num => (
              <select
                key={num}
                value={classFilters[`class${num}` as keyof typeof classFilters]}
                onChange={e => setClassFilters(prev => ({ ...prev, [`class${num}`]: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">All Class {num}</option>
                {(classData[`class${num}`] || []).map((cls: any) => (
                  <option key={cls.id} value={cls.id}>{cls.className}</option>
                ))}
              </select>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              Showing {filteredItems.length} items
              ({availableItemsCount} available, {alreadyAddedCount} already added)
            </div>
            {availableItemsCount > 0 && (
              <button
                onClick={selectAll}
                style={{ color: colorHex }}
                className="hover:underline"
              >
                {selectedItems.size === availableItemsCount ? 'Deselect All' : 'Select All Available'}
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={availableItemsCount > 0 && selectedItems.size === availableItemsCount}
                    onChange={selectAll}
                    disabled={availableItemsCount === 0}
                  />
                </th>
                {/* <th className="px-4 py-3 text-left text-sm font-medium">Status</th> */}
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">UOM Structure</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                {/* <th className="px-4 py-3 text-left text-sm font-medium">Barcode</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const isAlreadyAdded = alreadyAddedSet.has(item.id)
                const isSelected = selectedItems.has(item.id)
                return (
                  <tr
                    key={item.id}
                    className={`cursor-pointer transition ${isAlreadyAdded
                        ? 'bg-red-50 text-gray-500'
                        : isSelected
                          ? (isPurchase ? 'bg-green-50' : 'bg-[#eaf4fb]')
                          : 'hover:bg-gray-50'
                      }`}
                    onClick={() => !isAlreadyAdded && toggleItem(item.id)}
                  >
                    <td className="px-4 py-3">
                      {isAlreadyAdded ? (
                        <Check className="w-4 h-4 text-red-500" />
                      ) : (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItem(item.id)}
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </td>
                    {/* <td className="px-4 py-3">
                      {isAlreadyAdded ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          Already Added
                        </span>
                      ) : isSelected ? (
                        <span className={`text-xs ${isPurchase ? 'bg-green-100 text-green-700' : 'bg-[#509ee3] text-white'} px-2 py-1 rounded-full`}>
                          Selected
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </td> */}
                    <td className="px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="space-y-1 flex space-x-4">
                        <div className="font-medium text-blue-400">
                          1 {item.uom1?.uom || 'Unit'}
                        </div>
                        {item.uom2 && item.uomTwo?.uom && (
                          <div className="text-green-600 w-[150px]">
                            {item.uom2_qty} {item.uom1?.uom}/ {item.uomTwo.uom}
                          </div>
                        )}
                        {item.uom3 && item.uomThree?.uom && (
                          <div className="text-[#fdc700]">
                            {item.uom3_qty} {item.uom1?.uom}/ {item.uomThree.uom}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {isPurchase ? (item.purchasePricePKR || '-') : (item.sellingPrice || '-')}
                    </td>
                    {/* <td className="px-4 py-3 text-sm">{item.barCode || '-'}</td> */}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No items found matching your criteria
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4 flex justify-between items-center bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-600">
            {/* <div>{selectedItems.size} items selected</div>
            <div className="text-xs mt-1">
              {alreadyAddedItemIds.length} total items in order • {addedCount} batches added this session
            </div> */}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel}>
              Close & Finish
            </Button>
            <Button
              variant={'primary'}
              onClick={addItems}
              disabled={selectedItems.size === 0}
              className="flex items-center gap-2"
              style={{
                background: selectedItems.size === 0 ? undefined : colorHex,
                color: selectedItems.size === 0 ? undefined : 'white',
                border: 'none'
              }}
            >
              <Plus className="w-4 h-4" />
              Add  Items {selectedItems.size}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
