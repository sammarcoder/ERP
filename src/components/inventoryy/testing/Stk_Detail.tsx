// components/inventoryy/gdn/Stk_Detail.tsx
// export default function Stk_Detail({ data }: { data: any[] }) {
//     return (
//         <div className="mt-10">
//             < h2 > Order Details({data?.length} items)</h2 >
//             <pre style={{ background: '#f4f4f4', padding: '1rem', overflow: 'auto' }}>
//                 {JSON.stringify(data, null, 2)}
//             </pre>
//         </div >
//     )
// }




































































































// working good jus need imporivement with ai 
// import { useMemo, useState } from 'react'
// import { Plus, X } from 'lucide-react'
// import { Button } from '@/components/ui/Button'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import Stk_details_data from './Stk_details_data'

// export default function Stk_Detail({ data }: { data: any[] }) {
//   const [selectedItems, setSelectedItems] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [modalSelectedItems, setModalSelectedItems] = useState<any[]>([])
//   // Track IDs removed by the user so we don't show them again as pre-selected
//   const [removedPreselectedIds, setRemovedPreselectedIds] = useState<number[]>([])

//   const extractDetail = (item: any) => ({
//     ID: item.ID,
//     Item_ID: item.Item_ID,
//     Price: item.Price,
//     uom1_qty: item.uom1_qty,
//     uom2_qty: item.uom2_qty,
//     uom3_qty: item.uom3_qty,
//     sale_unit: item.sale_unit,
//     Discount_A: item.Discount_A,
//     Discount_B: item.Discount_B,
//     Discount_C: item.Discount_C,
//     Goods: item.Goods,
//     Remarks: item.Remarks,
//     Uom_Id: item.Uom_Id,
//     itemName: item.item?.itemName,
//     skuUOM: item.item?.skuUOM,
//     uomOne_qyt: item.item?.uom1_qyt,
//     uom2: item.item?.uom2,
//     uomTwo_qty: item.item?.uom2_qty,
//     uom3: item.item?.uom3,
//     uomThree_qty: item.item?.uom3_qty,
//     uom1: item.item?.uom1,
//     uomTwo: item.item?.uomTwo,
//     uomThree: item.item?.uomThree
//   })

//   const extractedDetails = useMemo(() => data?.map(extractDetail), [data])
//   const itemIds = useMemo(() => extractedDetails.map(item => item.Item_ID), [extractedDetails])

//   // active pre-selected ids = original itemIds minus any that the user removed
//   const activeItemIds = useMemo(() => (itemIds || []).filter(id => !removedPreselectedIds.includes(id)), [itemIds, removedPreselectedIds])

//   const modalInitialIds = useMemo(() => {
//     const addedIds = selectedItems.map((it: any) => it.id).filter(Boolean)
//     return Array.from(new Set([...(activeItemIds || []), ...addedIds]))
//   }, [activeItemIds, selectedItems])


//   const filterItemDetails = (extractedDetails) => {
//     return extractedDetails.map(item => ({
//       Item_ID: item.Item_ID,
//       Price: item.Price,
//       uom1_qty: item.uom1_qty,
//       uom2_qty: item.uom2_qty,
//       uom3_qty: item.uom3_qty,
//       sale_unit: item.sale_unit,
//       Uom_Id: item.Uom_Id,
//     }))
//   }


//   const filteredDetails = filterItemDetails(extractedDetails)
//   console.log('these are the fitlered items', filteredDetails)


//   const normalizeSelectedItems = (selectedItems = [], orderDetails = []) => {
//     return selectedItems.map(item => {
//       const order = orderDetails.find(
//         o => o.Item_ID === item.id
//       )

//       // return {

//       //   ...item,

//       //   dvidier: ' fitlered items data here',
//       //   uom1_qty: order?.uom1_qty ?? "",
//       //   uom2_qty: order?.uom2_qty ?? "",
//       //   uom3_qty: order?.uom3_qty ?? "",
//       //   sale_unit: order?.sale_unit ?? "",
//       //   Uom_Id: order?.Uom_Id ?? "",

//       // }



//       return {

//         ...item,

//         dvidier: ' fitlered items data here',
//         uom: {
//           uom1_qty: order?.uom1_qty ?? "",
//           uom2_qty: order?.uom2_qty ?? "",
//           uom3_qty: order?.uom3_qty ?? "",
//           sale_unit: order?.sale_unit ?? "",
//           Uom_Id: order?.Uom_Id ?? "",

//           uom1: item.uom1,
//           uom1_name: item.uom1_name,
//           qyt_1: item.qyt_1,
//           uom2: item.uom2,
//           uom2_name: item.uom2_name,
//           qty_2: item.qty_2,
          
//           uom3: item.uom3,
//           uom3_name: item.uom3_name,
//           qty_3: item.qty_3,

//         }


//       }




//     })
//   }


//   const finalItems = normalizeSelectedItems(selectedItems, filteredDetails)
//   //   console.log('these are the finals items', finalItems)



//   console.log('Extracted Details:', extractedDetails)
//   console.log('Item IDs:', itemIds)
//   console.log('Modal initial IDs:', modalInitialIds)
//   console.log('Selected Items from MultiSelect:', selectedItems)

//   return (
//     <div>
//       <h2>Order Details ({extractedDetails.length} items)</h2>

//       {/* {extractedDetails.map((item, i) => (
//         <pre key={i}>{JSON.stringify(item, null, 2)}</pre>
//       ))}  */}
//       {/* 
//        <pre style={{ background: '#f4f4f4', padding: '1rem', overflow: 'auto' }}>
//                 {JSON.stringify(data, null, 2)}
//              </pre> */}

//       {/* <pre>
//         {JSON.stringify(filteredDetails, null, 2)}
//       </pre> */}
//       <div className='mt-10 bg-gray-200 rounded-lg p-6'>
//         Final Item:
//         <pre>
//           {JSON.stringify(finalItems, null, 2)}
//         </pre>
//       </div>


//       <div className="mt-6">
//         <div className="flex items-center justify-between mb-2">
//           <h3 className="text-lg font-medium">Select Additional Items</h3>
//           <Button onClick={() => { setModalSelectedItems(selectedItems); setIsModalOpen(true) }} className="flex items-center gap-2">
//             <Plus className="w-4 h-4" /> Add Items
//           </Button>
//         </div>

//         {/* inline, read-only view of pre-selected items (also populate parent selectedItems) */}
//         <MultiSelectItemTable
//           isPurchase={false}
//           preSelectedIds={activeItemIds}
//           onSelectionChange={(items) => { console.log('Inline selection sent to parent:', items); setSelectedItems(items) }}
//           editable={false}
//         />

//         {/* show items added via modal */}
//         {selectedItems.length > 0 && (
//           <div className="mt-4">
//             <h4 className="font-medium">Added Items ({selectedItems.length})</h4>
//             <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto text-sm">{JSON.stringify(selectedItems, null, 2)}</pre>
//           </div>
//         )}

//         {/* Modal for adding/removing items */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl">
//               <div className="flex justify-between items-center p-4 border-b">
//                 <h2 className="text-lg font-semibold flex items-center gap-2">
//                   <Plus className="w-5 h-5" /> Select Items (Pre-loaded: {itemIds.length})
//                 </h2>
//                 <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-100 rounded-full p-1">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-auto p-4">
//                 <MultiSelectItemTable
//                   isPurchase={false}
//                   preSelectedIds={modalInitialIds}
//                   onSelectionChange={setModalSelectedItems}
//                   editable={true}
//                 />
//               </div>

//               <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
//                 <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
//                 <Button onClick={() => {
//                   // Apply modal selection to parent
//                   setSelectedItems(modalSelectedItems)
//                   // compute which of original itemIds the user removed and remember them
//                   const removed = itemIds.filter(id => !modalSelectedItems.some((it: any) => it.id === id))
//                   setRemovedPreselectedIds(removed)
//                   setIsModalOpen(false)
//                 }}>Add Selected</Button>
//               </div>
//             </div>
//           </div>
//         )}
//         <Stk_details_data data={finalItems} />
//       </div>
//     </div>
//   )
// }










































// // 3. UPDATED Stk_Detail with bidirectional sync
// import { useMemo, useState } from 'react'
// import { Plus, X } from 'lucide-react'
// import { Button } from '@/components/ui/Button'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import Stk_details_data from './Stk_details_data'

// export default function Stk_Detail({ data }: { data: any[] }) {
//   const [selectedItems, setSelectedItems] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const extractedDetails = useMemo(() => data?.map(item => ({
//     ID: item.ID,
//     Item_ID: item.Item_ID,
//     // ... rest of extraction
//   })), [data])

//   const itemIds = useMemo(() => extractedDetails.map(item => item.Item_ID), [extractedDetails])

//   const normalizeSelectedItems = (selectedItems = [], orderDetails = []) => {
//     return selectedItems.map(item => {
//       const order = orderDetails.find(o => o.Item_ID === item.id)
//       return {
//         ...item,
//         uom: {
//           uom1_qty: order?.uom1_qty ?? "",
//           uom2_qty: order?.uom2_qty ?? "",
//           uom3_qty: order?.uom3_qty ?? "",
//           sale_unit: order?.sale_unit ?? "",
//           Uom_Id: order?.Uom_Id ?? "",
//           // ... rest of UOM data
//         }
//       }
//     })
//   }

//   const finalItems = normalizeSelectedItems(selectedItems, extractedDetails)

//   // ✅ Handle deletion from Stk_details_data
//   const handleItemDelete = (deletedItemId: number) => {
//     setSelectedItems(prev => prev.filter(item => item.id !== deletedItemId))
//   }

//   return (
//     <div>
//       <h2>Order Details ({extractedDetails.length} items)</h2>

//       <div className="mt-6">
//         <Button onClick={() => setIsModalOpen(true)}>
//           <Plus /> Add Items
//         </Button>

//         <MultiSelectItemTable
//           isPurchase={false}
//           preSelectedIds={itemIds}
//           onSelectionChange={setSelectedItems}
//           editable={false}
//         />

//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl w-full max-w-5xl">
//               <div className="p-4 border-b">
//                 <h2>Select Items</h2>
//                 <button onClick={() => setIsModalOpen(false)}>
//                   <X />
//                 </button>
//               </div>
//               <div className="p-4">
//                 <MultiSelectItemTable
//                   isPurchase={false}
//                   preSelectedIds={selectedItems.map(i => i.id)}
//                   onSelectionChange={setSelectedItems}
//                   editable={true}
//                 />
//               </div>
//               <div className="p-4 border-t">
//                 <Button onClick={() => setIsModalOpen(false)}>Done</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ✅ Pass onDelete callback */}
//         <Stk_details_data 
//           data={finalItems} 
//           onDelete={handleItemDelete}
//         />
//       </div>
//     </div>
//   )
// }

















































// // components/inventoryy/gdn/Stk_Detail.tsx - FIXED AUTO-POPULATE
// import { useMemo, useState, useEffect } from 'react'
// import { Plus, X } from 'lucide-react'
// import { Button } from '@/components/ui/Button'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import Stk_details_data from './Stk_details_data'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// export default function Stk_Detail({ data }: { data: any[] }) {
//   const [selectedItems, setSelectedItems] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   // ✅ Fetch all items to match order items
//   const { data: itemsResponse } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems: any[] = itemsResponse?.data || []

//   const extractedDetails = useMemo(() => data?.map(item => ({
//     ID: item.ID,
//     Item_ID: item.Item_ID,
//     uom1_qty: item.uom1_qty,
//     uom2_qty: item.uom2_qty,
//     uom3_qty: item.uom3_qty,
//     sale_unit: item.sale_unit,
//     Uom_Id: item.Uom_Id
//   })), [data])

//   const itemIds = useMemo(() => extractedDetails.map(item => item.Item_ID), [extractedDetails])

//   // ✅ AUTO-POPULATE: Set order items into selectedItems on mount
//   useEffect(() => {
//     if (allItems.length > 0 && itemIds.length > 0 && selectedItems.length === 0) {
//       const orderItems = allItems.filter(item => itemIds.includes(item.id))
//       console.log('🚀 Auto-populating order items:', orderItems.length)
//       setSelectedItems(orderItems)
//     }
//   }, [allItems.length, itemIds.length])

//   const normalizeSelectedItems = (selectedItems = [], orderDetails = []) => {
//     return selectedItems.map(item => {
//       const order = orderDetails.find(o => o.Item_ID === item.id)
//       return {
//         ...item,
//         uom: {
//           uom1_qty: order?.uom1_qty ?? "",
//           uom2_qty: order?.uom2_qty ?? "",
//           uom3_qty: order?.uom3_qty ?? "",
//           sale_unit: order?.sale_unit ?? "",
//           Uom_Id: order?.Uom_Id ?? ""
//         }
//       }
//     })
//   }

//   const finalItems = normalizeSelectedItems(selectedItems, extractedDetails)

//   const handleItemDelete = (deletedItemId: number) => {
//     setSelectedItems(prev => prev.filter(item => item.id !== deletedItemId))
//   }

//   console.log('Stk_Detail State:', {
//     orderItemIds: itemIds,
//     selectedItemsCount: selectedItems.length,
//     finalItemsCount: finalItems.length
//   })

//   return (
//     <div>
//       <h2>Order Details ({extractedDetails.length} items)</h2>

//       <div className="mt-6">
//         <Button onClick={() => setIsModalOpen(true)}>
//           <Plus className="w-4 h-4" /> Add More Items
//         </Button>

//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
//               <div className="p-4 border-b flex justify-between items-center">
//                 <h2>Select Items</h2>
//                 <button onClick={() => setIsModalOpen(false)}>
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <div className="flex-1 overflow-auto p-4">
//                 <MultiSelectItemTable
//                   isPurchase={false}
//                   preSelectedIds={selectedItems.map(i => i.id)}
//                   onSelectionChange={setSelectedItems}
//                 />
//               </div>
//               <div className="p-4 border-t">
//                 <Button onClick={() => setIsModalOpen(false)}>Done ({selectedItems.length} selected)</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         <Stk_details_data 
//           data={finalItems} 
//           onDelete={handleItemDelete}
//         />
//       </div>
//     </div>
//   )
// }

































































// // 1. Stk_Detail.tsx - STABILIZE finalItems with proper dependency
// import { useState, useEffect, useMemo } from 'react'
// import { Plus, X } from 'lucide-react'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import Stk_details_data from './Stk_details_data'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// export default function Stk_Detail({ orderDetails, onDetailChange }: { orderDetails: any[], onDetailChange: (items: any[]) => void }) {
//   const [selectedItems, setSelectedItems] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const { data: itemsResponse } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems = itemsResponse?.data || []

//   const orderItemIds = useMemo(() => orderDetails?.map(d => d.Item_ID) || [], [orderDetails])

//   useEffect(() => {
//     if (allItems.length > 0 && orderItemIds.length > 0 && selectedItems.length === 0) {
//       const matched = allItems.filter(item => orderItemIds.includes(item.id))
//       setSelectedItems(matched)
//     }
//   }, [allItems.length, orderItemIds.length])

//   // ✅ FIX: Stringify dependencies to prevent object reference changes
//   const orderDetailsKey = JSON.stringify(orderDetails?.map(o => ({ id: o.Item_ID, q1: o.uom1_qty, q2: o.uom2_qty, q3: o.uom3_qty })))
//   const selectedItemsKey = JSON.stringify(selectedItems.map(i => i.id).sort())

//   const finalItems = useMemo(() => {
//     return selectedItems.map(item => {
//       const orderItem = orderDetails?.find(o => o.Item_ID === item.id)
//       return {
//         id: item.id,
//         itemName: item.itemName,
//         sellingPrice: item.sellingPrice,
//         uom1: item.skuUOM,
//         uom1_name: item.uom1?.uom,
//         qyt_1: item.uom1_qyt,
//         uom2: item.uom2,
//         uom2_name: item.uomTwo?.uom,
//         qty_2: item.uom2_qty,
//         uom3: item.uom3,
//         uom3_name: item.uomThree?.uom,
//         qty_3: item.uom3_qty,
//         orderQty: {
//           uom1_qty: orderItem?.uom1_qty || '0',
//           uom2_qty: orderItem?.uom2_qty || '0',
//           uom3_qty: orderItem?.uom3_qty || '0',
//           sale_unit: orderItem?.sale_unit || '3'
//         }
//       }
//     })
//   }, [orderDetailsKey, selectedItemsKey]) // ✅ Use stringified keys instead of array refs

//   const handleItemDelete = (itemId: number) => {
//     setSelectedItems(prev => prev.filter(i => i.id !== itemId))
//   }

//   return (
//     <div className="mt-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Items ({finalItems.length})</h2>
//         <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
//           <Plus className="w-4 h-4" /> Add Items
//         </button>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
//             <div className="p-4 border-b flex justify-between">
//               <h2>Select Items</h2>
//               <button onClick={() => setIsModalOpen(false)}><X /></button>
//             </div>
//             <div className="flex-1 overflow-auto p-4">
//               <MultiSelectItemTable preSelectedIds={selectedItems.map(i => i.id)} onSelectionChange={setSelectedItems} />
//             </div>
//             <div className="p-4 border-t">
//               <button onClick={() => setIsModalOpen(false)} className="bg-green-600 text-white px-6 py-2 rounded-lg">Done</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Stk_details_data items={finalItems} onChange={onDetailChange} onDelete={handleItemDelete} />
//     </div>
//   )
// }











































//working good


// 'use client'
// import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
// import { Plus, X, AlertTriangle } from 'lucide-react'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import Stk_details_data from './Stk_details_data'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface Props {
//   orderDetails: any[]
//   onDetailChange: (items: any[]) => void
// }

// export default function Stk_Detail({ orderDetails, onDetailChange }: Props) {
//   const [selectedItems, setSelectedItems] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const initialized = useRef(false)

//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems: any[] = itemsResponse?.data || []

//   const orderItemIds = useMemo(() => {
//     return orderDetails?.map(d => d.Item_ID) || []
//   }, [orderDetails])

//   useEffect(() => {
//     if (initialized.current) return
//     if (allItems.length === 0 || orderItemIds.length === 0) return

//     const matchedItems = allItems.filter(item => orderItemIds.includes(item.id))
//     console.log('🚀 Auto-populating items:', matchedItems.length)
//     setSelectedItems(matchedItems)
//     initialized.current = true
//   }, [allItems, orderItemIds])

//   // ✅ FIX: Better UOM structure extraction with validation
//   const finalItems = useMemo(() => {
//     return selectedItems.map(item => {
//       const orderItem = orderDetails?.find(o => o.Item_ID === item.id)

//       // ✅ Extract UOM conversion factors with proper validation
//       // These values represent: "How many PRIMARY units = 1 of this unit"
//       const secondaryQty = parseFloat(item.uom2_qty) || parseFloat(item.qty_2) || 0
//       const tertiaryQty = parseFloat(item.uom3_qty) || parseFloat(item.qty_3) || 0

//       // ✅ Build UOM structure - only include if conversion factor is valid (> 0)
//       const uomStructure: any = {
//         primary: {
//           id: item.skuUOM || item.uom1?.id || 1,
//           name: item.uom1?.uom || item.uom1_name || 'Pcs',
//           qty: 1 // Base unit is always 1
//         }
//       }

//       // ✅ Only add secondary if it has valid conversion factor
//       if (item.uom2 && secondaryQty > 0) {
//         uomStructure.secondary = {
//           id: item.uom2,
//           name: item.uomTwo?.uom || item.uom2_name || 'Box',
//           qty: secondaryQty
//         }
//       }

//       // ✅ Only add tertiary if it has valid conversion factor
//       if (item.uom3 && tertiaryQty > 0) {
//         uomStructure.tertiary = {
//           id: item.uom3,
//           name: item.uomThree?.uom || item.uom3_name || 'Crt',
//           qty: tertiaryQty
//         }
//       }

//       // ✅ Determine default sale unit based on available UOMs
//       let defaultSaleUnit = '1' // Default to primary
//       if (uomStructure.tertiary) defaultSaleUnit = '3'
//       else if (uomStructure.secondary) defaultSaleUnit = '2'

//       // ✅ DEBUG: Log item UOM data
//       console.log(`📦 Item ${item.id} (${item.itemName}):`, {
//         raw: { uom2_qty: item.uom2_qty, uom3_qty: item.uom3_qty },
//         parsed: { secondaryQty, tertiaryQty },
//         structure: uomStructure
//       })

//       return {
//         id: item.id,
//         itemName: item.itemName,
//         sellingPrice: parseFloat(item.sellingPrice) || 0,
//         uomStructure,
//         orderQty: orderItem ? {
//           uom1_qty: orderItem.uom1_qty || '0',
//           uom2_qty: orderItem.uom2_qty || '0',
//           uom3_qty: orderItem.uom3_qty || '0',
//           sale_unit: String(orderItem.sale_unit || defaultSaleUnit),
//           Uom_Id: orderItem.Uom_Id || 0
//         } : null,
//         isOrderItem: !!orderItem,
//         defaultSaleUnit,
//         // ✅ Flag if item has incomplete UOM setup
//         hasValidUom: secondaryQty > 0 || tertiaryQty > 0
//       }
//     })
//   }, [selectedItems, orderDetails])

//   const handleItemDelete = useCallback((itemId: number) => {
//     setSelectedItems(prev => prev.filter(item => item.id !== itemId))
//   }, [])

//   if (isLoading) {
//     return <div className="text-center py-4">Loading items...</div>
//   }

//   // ✅ Check for items with missing UOM configuration
//   const itemsWithBadUom = finalItems.filter(item => !item.hasValidUom)

//   return (
//     <div className="bg-white border rounded-lg p-4">
//       {/* Warning for items with missing UOM */}
//       {itemsWithBadUom.length > 0 && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
//           <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//           <div>
//             <p className="text-sm font-medium text-yellow-800">
//               {itemsWithBadUom.length} item(s) have missing UOM conversion setup:
//             </p>
//             <p className="text-xs text-yellow-700 mt-1">
//               {itemsWithBadUom.map(i => i.itemName).join(', ')}
//             </p>
//             <p className="text-xs text-yellow-600 mt-1">
//               These items will only allow Primary unit entry.
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Items ({finalItems.length})</h2>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//         >
//           <Plus className="w-4 h-4" /> Add / Remove Items
//         </button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-semibold">Select Items</h2>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-auto p-4">
//               <MultiSelectItemTable
//                 isPurchase={false}
//                 preSelectedIds={selectedItems.map(i => i.id)}
//                 onSelectionChange={setSelectedItems}
//               />
//             </div>
//             <div className="flex justify-end gap-3 p-4 border-t">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg"
//               >
//                 Done ({selectedItems.length})
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Stk_details_data
//         items={finalItems}
//         onChange={onDetailChange}
//         onDelete={handleItemDelete}
//       />
//     </div>
//   )
// }







































// working 2.0




// 'use client'
// import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
// import { Plus, X, AlertTriangle } from 'lucide-react'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import Stk_details_data from './Stk_details_data'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface Props {
//   orderDetails: any[]
//   onDetailChange: (items: any[]) => void
//   globalBatch?: string  // ✅ NEW: Global batch from header
// }

// export default function Stk_Detail({ orderDetails, onDetailChange, globalBatch }: Props) {
//   const [selectedItems, setSelectedItems] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const initialized = useRef(false)

//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems: any[] = itemsResponse?.data || []

//   const orderItemIds = useMemo(() => {
//     return orderDetails?.map(d => d.Item_ID) || []
//   }, [orderDetails])

//   useEffect(() => {
//     if (initialized.current) return
//     if (allItems.length === 0 || orderItemIds.length === 0) return

//     const matchedItems = allItems.filter(item => orderItemIds.includes(item.id))
//     setSelectedItems(matchedItems)
//     initialized.current = true
//   }, [allItems, orderItemIds])

//   const finalItems = useMemo(() => {
//     return selectedItems.map(item => {
//       const orderItem = orderDetails?.find(o => o.Item_ID === item.id)

//       const secondaryQty = parseFloat(item.uom2_qty) || parseFloat(item.qty_2) || 0
//       const tertiaryQty = parseFloat(item.uom3_qty) || parseFloat(item.qty_3) || 0

//       const uomStructure: any = {
//         primary: {
//           id: item.skuUOM || item.uom1?.id || 1,
//           name: item.uom1?.uom || item.uom1_name || 'Pcs',
//           qty: 1
//         }
//       }

//       if (item.uom2 && secondaryQty > 0) {
//         uomStructure.secondary = {
//           id: item.uom2,
//           name: item.uomTwo?.uom || item.uom2_name || 'Box',
//           qty: secondaryQty
//         }
//       }

//       if (item.uom3 && tertiaryQty > 0) {
//         uomStructure.tertiary = {
//           id: item.uom3,
//           name: item.uomThree?.uom || item.uom3_name || 'Crt',
//           qty: tertiaryQty
//         }
//       }

//       let defaultSaleUnit = '1'
//       if (uomStructure.tertiary) defaultSaleUnit = '3'
//       else if (uomStructure.secondary) defaultSaleUnit = '2'

//       return {
//         id: item.id,
//         itemName: item.itemName,
//         sellingPrice: parseFloat(item.sellingPrice) || 0,
//         uomStructure,
//         orderQty: orderItem ? {
//           uom1_qty: orderItem.uom1_qty || '0',
//           uom2_qty: orderItem.uom2_qty || '0',
//           uom3_qty: orderItem.uom3_qty || '0',
//           sale_unit: String(orderItem.sale_unit || defaultSaleUnit),
//           Uom_Id: orderItem.Uom_Id || 0
//         } : null,
//         isOrderItem: !!orderItem,
//         defaultSaleUnit,
//         hasValidUom: secondaryQty > 0 || tertiaryQty > 0
//       }
//     })
//   }, [selectedItems, orderDetails])

//   const handleItemDelete = useCallback((itemId: number) => {
//     setSelectedItems(prev => prev.filter(item => item.id !== itemId))
//   }, [])

//   if (isLoading) {
//     return <div className="text-center py-4">Loading items...</div>
//   }

//   const itemsWithBadUom = finalItems.filter(item => !item.hasValidUom)

//   return (
//     <div className="bg-white border rounded-lg p-4">
//       {/* Global Batch Display */}
//       {globalBatch && (
//         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//           <p className="text-sm text-blue-700">
//             <strong>Batch for all items:</strong> {globalBatch}
//           </p>
//         </div>
//       )}

//       {itemsWithBadUom.length > 0 && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
//           <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//           <div>
//             <p className="text-sm font-medium text-yellow-800">
//               {itemsWithBadUom.length} item(s) have missing UOM conversion setup
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Items ({finalItems.length})</h2>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//         >
//           <Plus className="w-4 h-4" /> Add / Remove Items
//         </button>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-semibold">Select Items</h2>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-auto p-4">
//               <MultiSelectItemTable
//                 isPurchase={false}
//                 preSelectedIds={selectedItems.map(i => i.id)}
//                 onSelectionChange={setSelectedItems}
//               />
//             </div>
//             <div className="flex justify-end gap-3 p-4 border-t">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg"
//               >
//                 Done ({selectedItems.length})
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ Pass globalBatch to details table */}
//       <Stk_details_data
//         items={finalItems}
//         onChange={onDetailChange}
//         onDelete={handleItemDelete}
//         globalBatch={globalBatch}
//       />
//     </div>
//   )
// }






































































// wokring 3.0 mean perfect woking 

// 'use client'
// import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
// import { Plus, X, AlertTriangle, Info } from 'lucide-react'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import Stk_details_data from './Stk_details_data'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface Props {
//   orderDetails: any[]
//   onDetailChange: (items: any[]) => void
//   globalBatch?: number | null
//   globalBatchName?: string
// }

// export default function Stk_Detail({ 
//   orderDetails, 
//   onDetailChange, 
//   globalBatch,
//   globalBatchName 
// }: Props) {
//   const [selectedItems, setSelectedItems] = useState<any[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const initialized = useRef(false)

//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems: any[] = itemsResponse?.data || []

//   // =====================================================
//   // 🔍 DEBUG: Log raw data
//   // =====================================================
//   useEffect(() => {
//     if (allItems.length > 0) {
//       console.log('═══════════════════════════════════════════════════')
//       console.log('🔍 RAW ITEM DATA (first 3):')
//       allItems.slice(0, 3).forEach(item => {
//         console.log(`  Item ${item.id}:`, {
//           uom2: item.uom2,
//           uom2_qty: item.uom2_qty,
//           uom3: item.uom3,
//           uom3_qty: item.uom3_qty,
//           uomTwo: item.uomTwo,
//           uomThree: item.uomThree
//         })
//       })
//       console.log('═══════════════════════════════════════════════════')
//     }
//   }, [allItems])

//   useEffect(() => {
//     console.log('═══════════════════════════════════════════════════')
//     console.log('🔍 ORDER DETAILS:', orderDetails)
//     console.log('═══════════════════════════════════════════════════')
//   }, [orderDetails])

//   // =====================================================
//   // EXTRACT ORDER ITEM IDs - Handle multiple property names
//   // =====================================================
//   const orderItemIds = useMemo(() => {
//     if (!orderDetails || orderDetails.length === 0) {
//       console.log('⚠️ orderDetails is empty or undefined')
//       return []
//     }
    
//     // Try different property names for Item_ID
//     const ids = orderDetails.map(d => {
//       const id = d.Item_ID || d.item_id || d.ItemID || d.itemId
//       console.log('  Order item ID:', id, 'from:', d)
//       return id
//     }).filter(Boolean)
    
//     console.log('📋 Extracted Order Item IDs:', ids)
//     return ids
//   }, [orderDetails])

//   // =====================================================
//   // AUTO-POPULATE from order
//   // =====================================================
//   useEffect(() => {
//     if (initialized.current) return
//     if (allItems.length === 0) return
    
//     // Even if orderItemIds is empty, we should mark as initialized
//     if (orderItemIds.length === 0) {
//       console.log('⚠️ No order items to auto-populate')
//       initialized.current = true
//       return
//     }

//     const matchedItems = allItems.filter(item => {
//       const itemId = item.id || item.ID
//       const isMatch = orderItemIds.includes(itemId)
//       if (isMatch) {
//         console.log(`✅ Matched item: ${itemId} (${item.itemName})`)
//       }
//       return isMatch
//     })
    
//     console.log('🚀 Auto-populating:', matchedItems.length, 'items')
//     setSelectedItems(matchedItems)
//     initialized.current = true
//   }, [allItems, orderItemIds])

//   // =====================================================
//   // BUILD FINAL ITEMS with proper UOM structure
//   // =====================================================
//   const finalItems = useMemo(() => {
//     console.log('═══════════════════════════════════════════════════')
//     console.log('🔧 BUILDING FINAL ITEMS')
    
//     return selectedItems.map(item => {
//       const itemId = item.id || item.ID
      
//       // ✅ Find order item - try multiple property names
//       const orderItem = orderDetails?.find(o => {
//         const orderId = o.Item_ID || o.item_id || o.ItemID || o.itemId
//         return orderId === itemId
//       })

//       // =====================================================
//       // ✅ EXTRACT UOM CONVERSION FACTORS - Try multiple property names
//       // =====================================================
      
//       // Secondary UOM qty (how many primary = 1 secondary)
//       const secondaryQty = parseFloat(
//         item.uom2_qty || 
//         item.qty_2 || 
//         item.uom2Qty ||
//         item.uomTwo?.qty ||
//         0
//       )
      
//       // Tertiary UOM qty (how many primary = 1 tertiary)
//       const tertiaryQty = parseFloat(
//         item.uom3_qty || 
//         item.qty_3 || 
//         item.uom3Qty ||
//         item.uomThree?.qty ||
//         0
//       )

//       console.log(`  Item ${itemId} (${item.itemName}):`)
//       console.log(`    - secondaryQty: ${secondaryQty} (from uom2_qty: ${item.uom2_qty})`)
//       console.log(`    - tertiaryQty: ${tertiaryQty} (from uom3_qty: ${item.uom3_qty})`)
//       console.log(`    - isOrderItem: ${!!orderItem}`)

//       // =====================================================
//       // ✅ BUILD UOM STRUCTURE
//       // =====================================================
//       const uomStructure: any = {
//         primary: {
//           id: item.skuUOM || item.uom1?.id || item.uom1_id || 1,
//           name: item.uom1?.uom || item.uom1_name || item.primaryUom || 'Pcs',
//           qty: 1
//         }
//       }

//       // ✅ Add secondary if exists and has valid conversion
//       const hasSecondaryUom = item.uom2 || item.uom2_id || item.uomTwo
//       if (hasSecondaryUom && secondaryQty > 0) {
//         uomStructure.secondary = {
//           id: item.uom2 || item.uom2_id || item.uomTwo?.id || 2,
//           name: item.uomTwo?.uom || item.uom2_name || item.secondaryUom || 'Box',
//           qty: secondaryQty
//         }
//         console.log(`    - Secondary UOM added: ${uomStructure.secondary.name} (${secondaryQty})`)
//       } else {
//         console.log(`    - Secondary UOM NOT added: hasUom=${!!hasSecondaryUom}, qty=${secondaryQty}`)
//       }

//       // ✅ Add tertiary if exists and has valid conversion
//       const hasTertiaryUom = item.uom3 || item.uom3_id || item.uomThree
//       if (hasTertiaryUom && tertiaryQty > 0) {
//         uomStructure.tertiary = {
//           id: item.uom3 || item.uom3_id || item.uomThree?.id || 6,
//           name: item.uomThree?.uom || item.uom3_name || item.tertiaryUom || 'Crt',
//           qty: tertiaryQty
//         }
//         console.log(`    - Tertiary UOM added: ${uomStructure.tertiary.name} (${tertiaryQty})`)
//       } else {
//         console.log(`    - Tertiary UOM NOT added: hasUom=${!!hasTertiaryUom}, qty=${tertiaryQty}`)
//       }

//       // =====================================================
//       // ✅ BUILD RESULT
//       // =====================================================
//       const result = {
//         id: itemId,
//         itemName: item.itemName,
//         sellingPrice: parseFloat(item.sellingPrice) || 0,
//         purchasePrice: parseFloat(item.purchasePricePKR) || parseFloat(item.purchasePrice) || 0,
//         uomStructure,
//         orderQty: orderItem ? {
//           uom1_qty: orderItem.uom1_qty || '0',
//           uom2_qty: orderItem.uom2_qty || '0',
//           uom3_qty: orderItem.uom3_qty || '0',
//           sale_unit: String(orderItem.sale_unit || orderItem.Sale_Unit || '3'),
//           Uom_Id: orderItem.Uom_Id || orderItem.uom_id || 0
//         } : null,
//         isOrderItem: !!orderItem,
//         hasValidUom: secondaryQty > 0 || tertiaryQty > 0
//       }

//       return result
//     })
//   }, [selectedItems, orderDetails])

//   // Log final items for debugging
//   useEffect(() => {
//     console.log('═══════════════════════════════════════════════════')
//     console.log('📦 FINAL ITEMS BUILT:', finalItems.length)
//     finalItems.forEach(item => {
//       console.log(`  - ${item.id} (${item.itemName}):`, {
//         isOrderItem: item.isOrderItem,
//         hasSecondary: !!item.uomStructure.secondary,
//         hasTertiary: !!item.uomStructure.tertiary,
//         uomStructure: item.uomStructure
//       })
//     })
//     console.log('═══════════════════════════════════════════════════')
//   }, [finalItems])

//   const handleItemDelete = useCallback((itemId: number) => {
//     setSelectedItems(prev => prev.filter(item => (item.id || item.ID) !== itemId))
//   }, [])

//   if (isLoading) {
//     return <div className="text-center py-4">Loading items...</div>
//   }

//   const itemsWithBadUom = finalItems.filter(item => !item.hasValidUom)

//   return (
//     <div className="bg-white border rounded-lg p-4">
//       {/* Global Batch */}
//       {globalBatch && (
//         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-4">
//           <div>
//             <span className="text-xs text-blue-600">Batch No:</span>
//             <p className="font-bold text-blue-800 text-xl">{globalBatch}</p>
//           </div>
//           <div>
//             <span className="text-xs text-blue-600">Source:</span>
//             <p className="font-medium text-blue-700">{globalBatchName || '-'}</p>
//           </div>
//         </div>
//       )}

//       {/* Debug Info */}
//       <div className="mb-4 p-3 bg-gray-100 border rounded-lg text-xs">
//         <div className="flex items-center gap-2 mb-2">
//           <Info className="w-4 h-4" />
//           <strong>Debug Info:</strong>
//         </div>
//         <div className="grid grid-cols-4 gap-2">
//           <div>Order Items: <strong>{orderDetails?.length || 0}</strong></div>
//           <div>Order IDs: <strong>{orderItemIds.join(', ') || 'none'}</strong></div>
//           <div>Selected: <strong>{selectedItems.length}</strong></div>
//           <div>Final Items: <strong>{finalItems.length}</strong></div>
//         </div>
//       </div>

//       {/* UOM Warning */}
//       {itemsWithBadUom.length > 0 && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <div className="flex items-start gap-2">
//             <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
//             <div>
//               <p className="text-sm font-medium text-yellow-800">
//                 {itemsWithBadUom.length} item(s) have no UOM conversion setup:
//               </p>
//               <p className="text-xs text-yellow-700 mt-1">
//                 {itemsWithBadUom.map(i => `${i.itemName} (ID: ${i.id})`).join(', ')}
//               </p>
//               <p className="text-xs text-yellow-600 mt-1">
//                 These items will only show Primary UOM input.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <h2 className="text-lg font-semibold">📦 Items ({finalItems.length})</h2>
//           <p className="text-sm text-gray-500">
//             {finalItems.filter(i => i.isOrderItem).length} from order, 
//             {finalItems.filter(i => !i.isOrderItem).length} added manually
//           </p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//         >
//           <Plus className="w-4 h-4" /> Add / Remove Items
//         </button>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-semibold">Select Items</h2>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-auto p-4">
//               <MultiSelectItemTable
//                 isPurchase={true}
//                 preSelectedIds={selectedItems.map(i => i.id || i.ID)}
//                 onSelectionChange={setSelectedItems}
//               />
//             </div>
//             <div className="flex justify-end gap-3 p-4 border-t">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg"
//               >
//                 Done ({selectedItems.length})
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Details Table */}
//       <Stk_details_data
//         items={finalItems}
//         onChange={onDetailChange}
//         onDelete={handleItemDelete}
//         globalBatch={globalBatch}
//         globalBatchName={globalBatchName}
//       />
//     </div>
//   )
// }






































































// components/grn/Stk_Detail.tsx

'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Plus, X, AlertTriangle, Package, Tag, Info } from 'lucide-react'
import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
import { Button } from '@/components/ui/Button'
import Stk_details_data from './Stk_details_data'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

interface Props {
  orderDetails: any[]
  onDetailChange: (items: any[]) => void
  globalBatch?: number | null
  globalBatchName?: string
}

export default function Stk_Detail({ 
  orderDetails, 
  onDetailChange, 
  globalBatch,
  globalBatchName 
}: Props) {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const initialized = useRef(false)

  const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
  const allItems: any[] = itemsResponse?.data || []

  // Order item IDs
  const orderItemIds = useMemo(() => {
    return orderDetails?.map(d => d.Item_ID) || []
  }, [orderDetails])

  // Auto-populate order items
  useEffect(() => {
    if (initialized.current) return
    if (allItems.length === 0 || orderItemIds.length === 0) return

    const matchedItems = allItems.filter(item => orderItemIds.includes(item.id))
    setSelectedItems(matchedItems)
    initialized.current = true
  }, [allItems, orderItemIds])

  // =====================================================
  // ✅ HELPER: Build UOM Structure from Item
  // =====================================================
  const buildUomStructure = useCallback((item: any) => {
    if (!item) {
      console.warn('⚠️ buildUomStructure called with null/undefined item')
      return {
        primary: { id: 1, name: 'Pcs', qty: 1 }
      }
    }

    // ✅ Debug: Log raw item data
    console.log(`🔧 Building UOM for: ${item.id} (${item.itemName})`)
    console.log('   Raw UOM data:', {
      uom1: item.uom1,
      skuUOM: item.skuUOM,
      uom2: item.uom2,
      uom2_qty: item.uom2_qty,
      qty_2: item.qty_2,
      uomTwo: item.uomTwo,
      uom3: item.uom3,
      uom3_qty: item.uom3_qty,
      qty_3: item.qty_3,
      uomThree: item.uomThree
    })

    // ✅ Try multiple property names for UOM quantities
    const secondaryQty = parseFloat(
      item.uom2_qty || 
      item.qty_2 || 
      item.uom2Qty || 
      item.secondaryQty ||
      item.uomTwo?.qty ||
      0
    )

    const tertiaryQty = parseFloat(
      item.uom3_qty || 
      item.qty_3 || 
      item.uom3Qty || 
      item.tertiaryQty ||
      item.uomThree?.qty ||
      0
    )

    console.log(`   Parsed: secondaryQty=${secondaryQty}, tertiaryQty=${tertiaryQty}`)

    // Build structure
    const uomStructure: any = {
      primary: {
        id: item.skuUOM || item.uom1?.id || item.uom1 || 1,
        name: item.uom1?.uom || item.uom1_name || item.primaryUomName || 'Pcs',
        qty: 1
      }
    }

    // ✅ Add secondary if available
    const hasSecondary = item.uom2 || item.uomTwo || item.uom2_id
    if (hasSecondary && secondaryQty > 0) {
      uomStructure.secondary = {
        id: item.uom2 || item.uomTwo?.id || item.uom2_id || 2,
        name: item.uomTwo?.uom || item.uom2_name || item.secondaryUomName || 'Box',
        qty: secondaryQty
      }
      console.log('   ✅ Secondary added:', uomStructure.secondary)
    } else {
      console.log(`   ❌ Secondary NOT added: hasSecondary=${!!hasSecondary}, qty=${secondaryQty}`)
    }

    // ✅ Add tertiary if available
    const hasTertiary = item.uom3 || item.uomThree || item.uom3_id
    if (hasTertiary && tertiaryQty > 0) {
      uomStructure.tertiary = {
        id: item.uom3 || item.uomThree?.id || item.uom3_id || 6,
        name: item.uomThree?.uom || item.uom3_name || item.tertiaryUomName || 'Crt',
        qty: tertiaryQty
      }
      console.log('   ✅ Tertiary added:', uomStructure.tertiary)
    } else {
      console.log(`   ❌ Tertiary NOT added: hasTertiary=${!!hasTertiary}, qty=${tertiaryQty}`)
    }

    return uomStructure
  }, [])

  // =====================================================
  // ✅ BUILD FINAL ITEMS - Use helper function
  // =====================================================
  const finalItems = useMemo(() => {
    console.log('═══════════════════════════════════════════════════')
    console.log('📦 Building finalItems from', selectedItems.length, 'selected items')

    return selectedItems.map(item => {
      const orderItem = orderDetails?.find(o => o.Item_ID === item.id)

      // ✅ Use the helper function to build UOM structure
      const uomStructure = buildUomStructure(item)

      // Check if UOM is valid
      const hasValidUom = !!uomStructure.secondary || !!uomStructure.tertiary

      return {
        id: item.id,
        itemName: item.itemName,
        sellingPrice: parseFloat(item.sellingPrice) || 0,
        purchasePrice: parseFloat(item.purchasePricePKR) || parseFloat(item.purchasePrice) || 0,
        uomStructure,
        orderQty: orderItem ? {
          uom1_qty: orderItem.uom1_qty || '0',
          uom2_qty: orderItem.uom2_qty || '0',
          uom3_qty: orderItem.uom3_qty || '0',
          sale_unit: String(orderItem.sale_unit || '3'),
          Uom_Id: orderItem.Uom_Id || 0
        } : null,
        isOrderItem: !!orderItem,
        hasValidUom
      }
    })
  }, [selectedItems, orderDetails, buildUomStructure])

  // Debug final items
  useEffect(() => {
    console.log('═══════════════════════════════════════════════════')
    console.log('📋 Final Items Summary:')
    finalItems.forEach(item => {
      console.log(`  - ${item.id} (${item.itemName}):`, {
        isOrderItem: item.isOrderItem,
        hasSecondary: !!item.uomStructure.secondary,
        hasTertiary: !!item.uomStructure.tertiary,
        hasValidUom: item.hasValidUom
      })
    })
    console.log('═══════════════════════════════════════════════════')
  }, [finalItems])

  const handleItemDelete = useCallback((itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const itemsWithBadUom = finalItems.filter(item => !item.hasValidUom)

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <Package className="w-8 h-8 animate-pulse text-[#4c96dc] mx-auto mb-2" />
        <span className="text-gray-500">Loading items...</span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#4c96dc]" />
              Items ({finalItems.length})
            </h2>
            {/* <p className="text-sm text-gray-500 mt-0.5">
              {finalItems.filter(i => i.isOrderItem).length} from order, 
              {' '}{finalItems.filter(i => !i.isOrderItem).length} added manually
            </p> */}
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Items
          </Button>
        </div>
      </div>

      {/* Batch Info */}
      {/* {globalBatch && (
        <div className="px-5 py-3 bg-green-50 border-b border-green-100 flex items-center gap-3">
          <Tag className="w-4 h-4 text-green-600" />
          <span className="text-green-800 text-sm">
            Batch <strong className="text-lg">{globalBatch}</strong> 
            <span className="text-green-600 ml-2">({globalBatchName})</span>
            <span className="text-green-500 ml-2">→ Applied to all items</span>
          </span>
        </div>
      )} */}

      {/* UOM Warning */}
      {itemsWithBadUom.length > 0 && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-amber-800 text-sm font-medium">
              {itemsWithBadUom.length} item(s) missing UOM conversion setup
            </span>
            <p className="text-amber-600 text-xs mt-0.5">
              {itemsWithBadUom.map(i => `${i.itemName} (ID: ${i.id})`).join(', ')}
            </p>
            <p className="text-amber-500 text-xs mt-1">
              💡 Please update these items in Item Master with uom2_qty and uom3_qty values
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <Stk_details_data
          items={finalItems}
          onChange={onDetailChange}
          onDelete={handleItemDelete}
          globalBatch={globalBatch}
          globalBatchName={globalBatchName}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Select Items</h2>
                <p className="text-sm text-gray-500">
                  {selectedItems.length} items selected
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MultiSelectItemTable
                isPurchase={true}
                preSelectedIds={selectedItems.map(i => i.id)}
                onSelectionChange={setSelectedItems}
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={() => setIsModalOpen(false)}>
                Done ({selectedItems.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
