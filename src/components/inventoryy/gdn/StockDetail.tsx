

// // components/inventory/StockDetail.tsx - FULLY FIXED VERSION
// 'use client'
// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
// import { 
//   Package, 
//   Plus, 
//   Trash2, 
//   AlertTriangle, 
//   CheckCircle, 
//   Layers,
//   BarChart3,
//   Target,
//   Clock,
//   Eye
// } from 'lucide-react'
// import UomConverter from '@/components/common/items/UomConverter'
// import { MultiSelectItemTable, type ExtractedItemData } from '@/components/common/items/MultiSelectItemTable'

// interface StockDetailProps {
//   detailItems: any[]
//   onDetailChange: (items: any[]) => void
//   mode?: string
//   sourceOrder?: any
//   dispatchId?: string | null
//   items?: any[]
//   isFromOrder?: boolean
// }

// const StockDetail: React.FC<StockDetailProps> = ({
//   detailItems: initialItems = [],
//   onDetailChange,
//   mode = 'create',
//   sourceOrder = null,
//   dispatchId = null,
//   items = [],
//   isFromOrder = false
// }) => {

//   // ✅ State management
//   const [detailItems, setDetailItems] = useState<any[]>(initialItems)
//   const [availableBatches, setAvailableBatches] = useState<Record<string, any[]>>({})
//   const [batchLoading, setBatchLoading] = useState(false)
//   const [allCOAs, setAllCOAs] = useState<any[]>([])
//   const [message, setMessage] = useState({ type: '', text: '' })
//   const [showItemModal, setShowItemModal] = useState(false)

//   // ✅ Refs to prevent infinite loops
//   const lastInitialItemsRef = useRef<string>('')
//   const lastNotifiedItemsRef = useRef<string>('')

//   // ✅ FIXED: Stable sync with parent's initialItems
//   const memoizedInitialItems = useMemo(() => {
//     const itemsHash = JSON.stringify(initialItems.map(item => ({
//       Line_Id: item.Line_Id,
//       Item_ID: item.Item_ID,
//       Item: item.Item
//     })))
    
//     return { items: initialItems, hash: itemsHash }
//   }, [initialItems.length])

//   // ✅ FIXED: Sync with parent only when actually needed
//   useEffect(() => {
//     if (memoizedInitialItems.hash !== lastInitialItemsRef.current && memoizedInitialItems.items.length > 0) {
//       console.log('🔄 StockDetail - Syncing with parent initialItems:', memoizedInitialItems.items.length)
//       setDetailItems([...memoizedInitialItems.items])
//       lastInitialItemsRef.current = memoizedInitialItems.hash
//     }
//   }, [memoizedInitialItems])

//   // ✅ FIXED: Notify parent only when items actually change
//   const notifyParent = useCallback((items: any[]) => {
//     const itemsHash = JSON.stringify(items.map(item => ({
//       Line_Id: item.Line_Id,
//       Item_ID: item.Item_ID,
//       quantities: {
//         uom1_qty: item.uom1_qty,
//         uom2_qty: item.uom2_qty,
//         uom3_qty: item.uom3_qty
//       }
//     })))

//     if (itemsHash !== lastNotifiedItemsRef.current) {
//       console.log('📤 StockDetail - Notifying parent:', items.length)
//       onDetailChange(items)
//       lastNotifiedItemsRef.current = itemsHash
//     }
//   }, [onDetailChange])

//   // ✅ Notify parent when detailItems change
//   useEffect(() => {
//     notifyParent(detailItems)
//   }, [detailItems, notifyParent])

//   // ✅ Batch fetching functions
//   const fetchBatchesNormal = async (items: any[]) => {
//     setBatchLoading(true)
//     const batchData: Record<string, any[]> = {}
//     try {
//       for (const item of items) {
//         if (item.Item_ID) {
//           const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`)
//           const result = await response.json()
//           if (result.success && result.data) {
//             batchData[item.Item_ID] = result.data
//           }
//         }
//       }
//       setAvailableBatches(batchData)
//     } catch (error) {
//       console.error('Error fetching batches:', error)
//     } finally {
//       setBatchLoading(false)
//     }
//   }

//   const fetchAllCOAs = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`)
//       const result = await response.json()
//       if (result.success && result.zCoaRecords) {
//         setAllCOAs(Array.isArray(result.zCoaRecords) ? result.zCoaRecords : [result.zCoaRecords])
//       }
//     } catch (error) {
//       console.error('Error fetching COAs:', error)
//     }
//   }

//   useEffect(() => {
//     fetchAllCOAs()
//   }, [])

//   useEffect(() => {
//     if (detailItems.length > 0) {
//       fetchBatchesNormal(detailItems)
//     }
//   }, [detailItems.length])

//   // ✅ Helper functions
//   const getCoaNameById = (coaId: any) => {
//     const coa = allCOAs.find(c => c.id === parseInt(coaId))
//     return coa ? coa.acName : `COA-${coaId}`
//   }

//   const getBatchOptions = (itemId: any) => {
//     const batches = availableBatches[itemId] || []
//     return mode === 'edit' ? batches : batches.filter(batch => parseFloat(batch.available_qty_uom1) > 0)
//   }

//   // ✅ REQUIREMENT 3: Real-time stock allocation across duplicates
//   const getTotalAllocatedQty = useCallback((itemId: any, batchNumber: any, excludeIndex = -1) => {
//     return detailItems
//       .filter((item, index) => 
//         item.Item_ID === itemId && 
//         item.Batch_Number === batchNumber && 
//         index !== excludeIndex
//       )
//       .reduce((total, item) => {
//         const qty = item.sale_unit === 1 ? item.uom1_qty :
//                    item.sale_unit === 2 ? item.uom2_qty :
//                    item.sale_unit === 3 ? item.uom3_qty : 0
//         return total + (parseFloat(qty) || 0)
//       }, 0)
//   }, [detailItems])

//   // ✅ REQUIREMENT 4: Real-time UOM conversion for available stock display
//   const getAvailableStockDisplay = useCallback((itemId: any, batchNumber: any, selectedUom: number, itemData: any) => {
//     if (!itemId || !batchNumber || !itemData) return 0

//     const batches = availableBatches[itemId] || []
//     const batch = batches.find((b: any) => b.batchno.toString() === batchNumber.toString())
    
//     if (!batch) return 0

//     // API always returns in smallest UOM (Pcs)
//     const availableInPcs = parseFloat(batch.available_qty_uom1) || 0
    
//     // Subtract already allocated quantities
//     const allocatedQty = getTotalAllocatedQty(itemId, batchNumber)
//     const remainingInPcs = availableInPcs - allocatedQty

//     // ✅ CONVERT based on selected UOM (1M Pcs → 100 Boxes → 2 Cartons)
//     let conversionFactor = 1
//     if (selectedUom === 2 && itemData.uom2_qty) {
//       conversionFactor = parseFloat(itemData.uom2_qty) // e.g., 10000
//     } else if (selectedUom === 3 && itemData.uom3_qty) {
//       conversionFactor = parseFloat(itemData.uom3_qty) // e.g., 500000
//     }

//     const convertedStock = remainingInPcs / conversionFactor
    
//     console.log(`🔄 Stock Conversion for Item ${itemId}:`, {
//       availableInPcs,
//       allocatedQty,
//       remainingInPcs,
//       selectedUom,
//       conversionFactor,
//       convertedStock: convertedStock.toFixed(3)
//     })

//     return Math.max(0, convertedStock)
//   }, [availableBatches, getTotalAllocatedQty])

//   // ✅ REQUIREMENT 1: Line_Id generation (1001, 1002 pattern)
//   const generateLineId = (originalLineId: number, duplicateCount: number = 0) => {
//     if (duplicateCount === 0) {
//       return originalLineId // Original: 1, 2, 3
//     }
//     return originalLineId * 1000 + duplicateCount // Duplicates: 1001, 1002, 2001, 2002
//   }

//   // ✅ REQUIREMENT 2: Proper deletion rules
//   const canDeleteOriginal = (originalLineId: number) => {
//     const duplicates = detailItems.filter(item => 
//       Math.floor(item.Line_Id / 1000) === originalLineId && !item.isOriginalRow
//     )
//     return duplicates.length === 0
//   }

//   // ✅ Real-time UOM change with validation
//   const handleUomChange = (index: number, values: any) => {
//     const updated = [...detailItems]
//     const item = updated[index]

//     let saleUnitNum = parseInt(values.sale_unit) || 1
//     const requestedQty = parseFloat(
//       saleUnitNum === 2 ? values.uom2_qty :
//       saleUnitNum === 3 ? values.uom3_qty :
//       values.uom1_qty
//     ) || 0

//     // ✅ Real-time validation with UOM conversion
//     const availableInSelectedUOM = getAvailableStockDisplay(
//       item.Item_ID, 
//       item.Batch_Number, 
//       saleUnitNum, 
//       item.item
//     )

//     const allocatedQty = getTotalAllocatedQty(item.Item_ID, item.Batch_Number, index)
//     const remainingStock = availableInSelectedUOM - allocatedQty

//     if (item.Batch_Number && requestedQty > remainingStock) {
//       const uomName = saleUnitNum === 1 ? item.item?.uom1?.uom :
//                      saleUnitNum === 2 ? item.item?.uomTwo?.uom :
//                      item.item?.uomThree?.uom || 'Units'
      
//       setMessage({
//         type: 'error',
//         text: `Insufficient stock! Available: ${remainingStock.toFixed(3)} ${uomName}, Requested: ${requestedQty} ${uomName}`
//       })
//       setTimeout(() => setMessage({ type: '', text: '' }), 5000)
//       return
//     }

//     setMessage({ type: '', text: '' })

//     updated[index] = {
//       ...updated[index],
//       uom1_qty: parseFloat(values.uom1_qty) || 0,
//       uom2_qty: parseFloat(values.uom2_qty) || 0,
//       uom3_qty: parseFloat(values.uom3_qty) || 0,
//       QTY_Dispatched: requestedQty,
//       sale_unit: saleUnitNum,
//       Uom_Id: values.Uom_Id || item.Uom_Id,
//       UOM_Dispatched: saleUnitNum === 2 ? item.item?.uomTwo?.uom :
//         saleUnitNum === 3 ? item.item?.uomThree?.uom :
//           item.item?.uom1?.uom || 'Pcs'
//     }
    
//     setDetailItems(updated)
//   }

//   // ✅ Add duplicate batch with proper Line_Id
//   const addBatchRow = (originalIndex: number) => {
//     const originalItem = detailItems[originalIndex]
//     const originalLineId = originalItem.Line_Id
    
//     const existingDuplicates = detailItems.filter(item => 
//       Math.floor(item.Line_Id / 1000) === originalLineId && !item.isOriginalRow
//     )
    
//     const duplicateCount = existingDuplicates.length + 1
//     const newLineId = generateLineId(originalLineId, duplicateCount)
    
//     const duplicateRow = {
//       Line_Id: newLineId, // ✅ Proper integer Line_Id (1001, 1002, etc.)
//       Batch_Number: '',
//       Item: `${originalItem.Item} (Batch ${duplicateCount})`,
//       Item_ID: originalItem.Item_ID,
//       Qty_in_SO: 0,
//       Uom_SO: originalItem.Uom_SO,
//       QTY_Dispatched: 0,
//       UOM_Dispatched: originalItem.UOM_Dispatched,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 1,
//       Uom_Id: originalItem.Uom_Id,
//       Stock_Price: originalItem.Stock_Price,
//       isOriginalRow: false,
//       isAdditionalBatch: true,
//       originalLineId: originalLineId,
//       item: originalItem.item
//     }

//     const newItems = [...detailItems]
//     newItems.splice(originalIndex + 1, 0, duplicateRow)
//     setDetailItems(newItems)

//     console.log(`✅ Added duplicate batch for Item ${originalItem.Item_ID}:`, {
//       originalLineId,
//       newLineId,
//       duplicateCount
//     })
//   }

//   // ✅ Remove item with deletion rules
//   const removeItem = (index: number) => {
//     const item = detailItems[index]
    
//     // Check if original has duplicates
//     if (item.isOriginalRow) {
//       if (!canDeleteOriginal(item.Line_Id)) {
//         setMessage({
//           type: 'error',
//           text: 'Cannot delete original item. Please delete all duplicate batches first.'
//         })
//         setTimeout(() => setMessage({ type: '', text: '' }), 3000)
//         return
//       }
//     }
    
//     const newItems = detailItems.filter((_, i) => i !== index)
//     setDetailItems(newItems)
//   }

//   // ✅ Handle MultiSelectItemTable selections
//   const handleItemsSelected = (selectedItems: ExtractedItemData[]) => {
//     console.log('📦 MultiSelectItemTable - Adding items:', selectedItems.length)
    
//     const newItems = selectedItems.map((extractedItem, index) => ({
//       Line_Id: detailItems.length + index + 1,
//       Batch_Number: '',
//       Item: extractedItem.itemName,
//       Item_ID: extractedItem.id,
//       QTY_Dispatched: 0,
//       UOM_Dispatched: extractedItem.uomData.primary.name,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 1,
//       Uom_Id: extractedItem.uomData.primary.id,
//       Stock_Price: extractedItem.sellingPrice,
//       isOriginalRow: true,
      
//       item: {
//         ...extractedItem.originalItem,
//         uom1: { 
//           id: extractedItem.uomData.primary.id, 
//           uom: extractedItem.uomData.primary.name 
//         },
//         uomTwo: extractedItem.uomData.secondary ? {
//           id: extractedItem.uomData.secondary.id,
//           uom: extractedItem.uomData.secondary.name
//         } : undefined,
//         uomThree: extractedItem.uomData.tertiary ? {
//           id: extractedItem.uomData.tertiary.id,
//           uom: extractedItem.uomData.tertiary.name
//         } : undefined,
//         uom1_qyt: 1,
//         uom2_qty: extractedItem.rawUomData.uom2_qty,
//         uom3_qty: extractedItem.rawUomData.uom3_qty
//       }
//     }))

//     const updatedItems = [...detailItems, ...newItems]
//     setDetailItems(updatedItems)
//     fetchBatchesNormal(newItems)
//   }

//   const getAlreadyAddedItemIds = () => {
//     return detailItems.map(item => item.Item_ID).filter(id => id)
//   }

//   return (
//     <div className="space-y-6">
//       {/* ✅ Debug Panel */}
//       <div className="bg-blue-100 p-3 rounded text-sm border">
//         <strong>🔧 StockDetail Debug:</strong> 
//         Initial: {initialItems.length} | 
//         Current: {detailItems.length} | 
//         Synced: {detailItems.length === initialItems.length || (initialItems.length > 0 && detailItems.length > 0) ? '✅' : '❌'} | 
//         Mode: {mode}
//       </div>

//       {/* ✅ Error/Success Messages */}
//       {message.text && (
//         <div className={`flex items-center gap-2 p-3 rounded-lg border ${
//           message.type === 'success' 
//             ? 'bg-green-50 text-green-800 border-green-200' 
//             : 'bg-red-50 text-red-800 border-red-200'
//         }`}>
//           {message.type === 'error' ? 
//             <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : 
//             <CheckCircle className="w-5 h-5 flex-shrink-0" />
//           }
//           <span className="font-medium">{message.text}</span>
//         </div>
//       )}

//       {/* ✅ Main Items Table */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Package className="w-5 h-5 text-blue-600" />
//               <h3 className="font-semibold text-gray-800">Items to Dispatch</h3>
//               <div className="bg-white px-2 py-1 rounded-full border border-blue-200">
//                 <span className="text-sm font-medium text-blue-600">{detailItems.length}</span>
//               </div>
//             </div>
            
//             <button
//               type="button"
//               onClick={() => setShowItemModal(true)}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//             >
//               <Plus className="w-4 h-4" />
//               Add Items
//             </button>
//           </div>
//         </div>

//         {detailItems.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                     <div className="flex items-center gap-2">
//                       <BarChart3 className="w-4 h-4" />
//                       Line
//                     </div>
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                     <div className="flex items-center gap-2">
//                       <Layers className="w-4 h-4" />
//                       Batch Selection
//                     </div>
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                     <div className="flex items-center gap-2">
//                       <Package className="w-4 h-4" />
//                       Item
//                     </div>
//                   </th>
//                   {mode === 'fromOrder' && (
//                     <th className="px-4 py-3 text-center text-sm font-semibold text-blue-700 bg-blue-50">
//                       <div className="flex items-center justify-center gap-2">
//                         <Target className="w-4 h-4" />
//                         SO Quantity
//                       </div>
//                     </th>
//                   )}
//                   <th className="px-4 py-3 text-center text-sm font-semibold text-orange-700 bg-orange-50">
//                     Available Stock (Auto UOM)
//                   </th>
//                   <th className="px-4 py-3 text-center text-sm font-semibold text-green-700 bg-green-50">
//                     Dispatch Quantity
//                   </th>
//                   <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {detailItems.map((item, index) => {
//                   const itemData = item.item;
//                   const uomData = {
//                     primary: itemData?.uom1 ? {
//                       id: itemData.uom1.id,
//                       name: itemData.uom1.uom,
//                       qty: parseFloat(itemData.uom1_qyt) || 1
//                     } : { id: 1, name: 'Pcs', qty: 1 },
                    
//                     secondary: itemData?.uomTwo ? {
//                       id: itemData.uomTwo.id,
//                       name: itemData.uomTwo.uom,
//                       qty: parseFloat(itemData.uom2_qty) || 10
//                     } : undefined,
                    
//                     tertiary: itemData?.uomThree ? {
//                       id: itemData.uomThree.id,
//                       name: itemData.uomThree.uom,
//                       qty: parseFloat(itemData.uom3_qty) || 100
//                     } : undefined
//                   };

//                   // ✅ Real-time UOM conversion for available stock
//                   const availableStockDisplay = getAvailableStockDisplay(
//                     item.Item_ID, 
//                     item.Batch_Number, 
//                     item.sale_unit, 
//                     itemData
//                   )

//                   const uomName = item.sale_unit === 1 ? itemData?.uom1?.uom :
//                                  item.sale_unit === 2 ? itemData?.uomTwo?.uom :
//                                  itemData?.uomThree?.uom || 'Units'

//                   return (
//                     <tr key={`${item.Item_ID}-${item.Line_Id}`} className={`hover:bg-gray-50 transition-colors ${
//                       item.isAdditionalBatch ? 'bg-yellow-50' : ''
//                     }`}>
                      
//                       {/* Line Number */}
//                       <td className="px-4 py-3">
//                         <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
//                           item.isOriginalRow 
//                             ? 'bg-blue-100 text-blue-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {item.Line_Id}
//                         </div>
//                       </td>

//                       {/* Batch Selection */}
//                       <td className="px-4 py-3">
//                         <div className="space-y-2">
//                           <select
//                             value={item.Batch_Number || ''}
//                             onChange={(e) => {
//                               const updated = [...detailItems]
//                               updated[index].Batch_Number = e.target.value
//                               setDetailItems(updated)
//                             }}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                             required={item.QTY_Dispatched > 0}
//                           >
//                             <option value="">
//                               {batchLoading ? (
//                                 <span className="flex items-center gap-2">
//                                   <Clock className="w-4 h-4" />
//                                   Loading...
//                                 </span>
//                               ) : (
//                                 `Select Batch (${getBatchOptions(item.Item_ID).length})`
//                               )}
//                             </option>
//                             {getBatchOptions(item.Item_ID).map((batch, bIdx) => (
//                               <option key={bIdx} value={batch.batchno}>
//                                 {getCoaNameById(batch.batchno)} (#{batch.batchno}) - Stock: {batch.available_qty_uom1}
//                                 {mode === 'edit' && batch.current_dispatch_uom1 > 0 && ` (+${batch.current_dispatch_uom1} dispatching)`}
//                               </option>
//                             ))}
//                           </select>
//                           {item.Batch_Number && (
//                             <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border">
//                               <strong>Selected:</strong> {getCoaNameById(item.Batch_Number)} (ID: {item.Batch_Number})
//                             </div>
//                           )}
//                         </div>
//                       </td>

//                       {/* Item Name */}
//                       <td className="px-4 py-3">
//                         {isFromOrder ? (
//                           <div className="bg-gray-50 p-3 rounded-lg border">
//                             <div className="font-medium text-sm text-gray-800">
//                               {item.Item}
//                             </div>
//                             <div className="text-xs text-gray-500 mt-1">
//                               Item ID: {item.Item_ID}
//                             </div>
//                           </div>
//                         ) : (
//                           <select
//                             value={item.Item_ID}
//                             onChange={(e) => {
//                               const updated = [...detailItems]
//                               const selectedItem = items.find(itm => itm.id === parseInt(e.target.value))
//                               updated[index].Item = selectedItem?.itemName || ''
//                               updated[index].Item_ID = e.target.value
//                               updated[index].item = selectedItem
//                               setDetailItems(updated)
//                             }}
//                             className="w-full px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500"
//                             required
//                           >
//                             <option value="">Select Item</option>
//                             {items.map(itm => (
//                               <option key={itm.id} value={itm.id}>{itm.itemName}</option>
//                             ))}
//                           </select>
//                         )}
//                       </td>

//                       {/* Sales Order Quantity */}
//                       {mode === 'fromOrder' && (
//                         <td className="px-4 py-3 text-center bg-blue-50">
//                           {item.isOriginalRow ? (
//                             <div className="text-sm">
//                               <div className="font-bold text-blue-800">{item.Qty_in_SO || '0.000'}</div>
//                               <div className="text-xs text-blue-600">{item.Uom_SO || '-'}</div>
//                             </div>
//                           ) : (
//                             <div className="text-gray-400 text-xs">Additional</div>
//                           )}
//                         </td>
//                       )}

//                       {/* ✅ Available Stock with Real-time UOM Conversion */}
//                       <td className="px-4 py-3 text-center bg-orange-50">
//                         <div className="space-y-2">
//                           <div className={`text-2xl font-bold ${
//                             availableStockDisplay > 0 ? 'text-green-600' : 'text-red-600'
//                           }`}>
//                             {item.Batch_Number ? availableStockDisplay.toFixed(3) : '-'}
//                           </div>
//                           {item.Batch_Number && (
//                             <div className="text-xs text-gray-600">
//                               {availableStockDisplay > 0 ? (
//                                 <div className="flex items-center justify-center gap-1">
//                                   <CheckCircle className="w-3 h-3 text-green-500" />
//                                   {uomName} (Auto)
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center justify-center gap-1">
//                                   <AlertTriangle className="w-3 h-3 text-red-500" />
//                                   Out of Stock
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </td>

//                       {/* UOM Converter */}
//                       <td className="px-4 py-3 bg-green-50">
//                         {itemData ? (
//                           <div className="p-3 bg-white border border-green-200 rounded-lg">
//                             <UomConverter
//                               uomData={uomData}
//                               lineIndex={index}
//                               onChange={(values) => handleUomChange(index, values)}
//                               initialValues={{
//                                 uom1_qty: item.uom1_qty?.toString() || '0.000',
//                                 uom2_qty: item.uom2_qty?.toString() || '1.000',
//                                 uom3_qty: item.uom3_qty?.toString() || '0.000',
//                                 sale_unit: item.sale_unit?.toString() || '3'
//                               }}
//                               isPurchase={false}
//                             />
//                             <div className="text-xs text-gray-500 mt-2 text-center">
//                               Ratio: 1:{parseFloat(itemData.uom2_qty || 10)}:{parseFloat(itemData.uom3_qty || 100)}
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-red-500 text-xs p-3 border border-red-200 rounded-lg bg-red-50">
//                             <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
//                             No item data
//                           </div>
//                         )}
//                       </td>

//                       {/* ✅ Actions with proper deletion rules */}
//                       <td className="px-4 py-3">
//                         <div className="flex flex-col gap-1">
//                           {/* Add Batch button for original rows */}
//                           {item.isOriginalRow && (
//                             <button
//                               type="button"
//                               onClick={() => addBatchRow(index)}
//                               className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
//                               title="Add additional batch for same item"
//                             >
//                               <Plus className="w-3 h-3" />
//                               Batch
//                             </button>
//                           )}

//                           {/* Delete/Remove button */}
//                           {(detailItems.length > 1 || !item.isOriginalRow) && (
//                             <button
//                               type="button"
//                               onClick={() => removeItem(index)}
//                               disabled={item.isOriginalRow && !canDeleteOriginal(item.Line_Id)}
//                               className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
//                                 item.isOriginalRow && !canDeleteOriginal(item.Line_Id)
//                                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                   : 'bg-red-600 hover:bg-red-700 text-white'
//                               }`}
//                               title={item.isOriginalRow && !canDeleteOriginal(item.Line_Id) 
//                                 ? 'Delete all duplicate batches first' 
//                                 : 'Remove this item/batch'
//                               }
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               {item.isAdditionalBatch ? 'Remove' : 'Delete'}
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-16 text-gray-500 bg-gray-50">
//             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Package className="w-8 h-8" />
//             </div>
//             <p className="text-lg font-medium mb-2">No Items Added Yet</p>
//             <p className="text-sm mb-4">Add items to dispatch in this GDN</p>
//             <button 
//               type="button" 
//               onClick={() => setShowItemModal(true)}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors flex items-center gap-2 mx-auto"
//             >
//               <Plus className="w-4 h-4" />
//               Add First Item
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ✅ Summary Statistics */}
//       {detailItems.length > 0 && (
//         <div className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-lg p-6 border border-gray-200 shadow-sm">
//           <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//             <BarChart3 className="w-5 h-5" />
//             Dispatch Summary
//           </h4>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center p-3 bg-white rounded-lg border">
//               <div className="text-2xl font-bold text-blue-600">{detailItems.length}</div>
//               <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
//                 <Package className="w-3 h-3" />
//                 Line Items
//               </div>
//             </div>
//             <div className="text-center p-3 bg-white rounded-lg border">
//               <div className="text-2xl font-bold text-orange-600">
//                 {detailItems.filter(item => item.Batch_Number).length}
//               </div>
//               <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
//                 <Layers className="w-3 h-3" />
//                 Batches Selected
//               </div>
//             </div>
//             <div className="text-center p-3 bg-white rounded-lg border">
//               <div className="text-2xl font-bold text-green-600">
//                 {detailItems.filter(item => item.QTY_Dispatched > 0).length}
//               </div>
//               <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
//                 <CheckCircle className="w-3 h-3" />
//                 Ready to Dispatch
//               </div>
//             </div>
//             <div className="text-center p-3 bg-white rounded-lg border">
//               <div className="text-2xl font-bold text-purple-600">
//                 Rs {detailItems.reduce((sum, item) => sum + (item.QTY_Dispatched * (parseFloat(item.Stock_Price) || 0)), 0).toFixed(2)}
//               </div>
//               <div className="text-sm text-gray-600">Total Value</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ MultiSelectItemTable */}
//       {showItemModal && (
//         <MultiSelectItemTable
//           onSelectionComplete={handleItemsSelected}
//           onCancel={() => setShowItemModal(false)}
//           isPurchase={false}
//           alreadyAddedItemIds={getAlreadyAddedItemIds()}
//         />
//       )}
//     </div>
//   )
// }

// export default StockDetail
































































// // components/inventory/StockDetail.tsx - FIXED YELLOW MATERIAL LOGIC
// 'use client'
// import React, { useState, useEffect } from 'react'
// import UomConverter from '@/components/common/items/UomConverter'
// import { MultiSelectItemTable } from '@/components/common/items/MultiSelectItemTable'

// const StockDetail = ({
//   detailItems: initialItems = [],
//   onDetailChange,
//   mode = 'create',
//   isFromOrder = false
// }) => {

//   const [detailItems, setDetailItems] = useState([])
//   const [availableBatches, setAvailableBatches] = useState({})
//   const [allCOAs, setAllCOAs] = useState([])
//   const [message, setMessage] = useState('')
//   const [showItemModal, setShowItemModal] = useState(false)

//   // ✅ Initialize from order
//   useEffect(() => {
//     if (initialItems.length > 0) {
//       const processedItems = initialItems.map((item, index) => ({
//         Line_Id: index + 1,
//         Batch_Number: '',
//         Item: item.item?.itemName || 'Unknown',
//         Item_ID: item.Item_ID,
//         Qty_in_SO: parseFloat(
//           item.sale_unit === '3' ? item.uom3_qty :
//           item.sale_unit === '2' ? item.uom2_qty :
//           item.uom1_qty || 0
//         ),
//         Uom_SO: item.uom?.uom || 'Unknown',
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: parseInt(item.sale_unit) || 3,
//         Uom_Id: item.Uom_Id || 0,
//         QTY_Dispatched: 0,
//         Stock_Price: parseFloat(item.item?.sellingPrice || 0),
//         item: item.item
//       }))
      
//       setDetailItems(processedItems)
//     }
//   }, [initialItems])

//   useEffect(() => {
//     onDetailChange(detailItems)
//   }, [detailItems])

//   // ✅ FIXED: Yellow Material Bag Logic - CORRECT calculation
//   const getTotalUsedFromBatchInPcs = (itemId, batchNumber, excludeIndex = -1) => {
//     let totalUsedPcs = 0
    
//     detailItems.forEach((row, index) => {
//       // Skip current row
//       if (index === excludeIndex) return
//       // Only same item and same batch
//       if (row.Item_ID !== itemId || row.Batch_Number !== batchNumber) return
      
//       const itemData = row.item
//       let usedPcs = 0
      
//       // ✅ FIXED: Convert what user ACTUALLY entered to Pcs
//       if (row.sale_unit === 1 && row.uom1_qty > 0) {
//         // User entered in Pcs
//         usedPcs = parseFloat(row.uom1_qty)
//       } else if (row.sale_unit === 2 && row.uom2_qty > 0 && itemData?.uom2_qty) {
//         // User entered in Boxes → convert to Pcs
//         const userBoxes = parseFloat(row.uom2_qty)
//         const pcsPerBox = parseFloat(itemData.uom2_qty) // e.g., 60
//         usedPcs = userBoxes * pcsPerBox
//       } else if (row.sale_unit === 3 && row.uom3_qty > 0 && itemData?.uom3_qty) {
//         // User entered in Cartons → convert to Pcs
//         const userCartons = parseFloat(row.uom3_qty)
//         const pcsPerCarton = parseFloat(itemData.uom3_qty) // e.g., 3600
//         usedPcs = userCartons * pcsPerCarton
//       }
      
//       totalUsedPcs += usedPcs
//       console.log(`  Row ${index + 1}: Used ${usedPcs} Pcs (User: ${row.QTY_Dispatched} × UOM${row.sale_unit})`)
//     })
    
//     console.log(`📊 BATCH ${batchNumber}: TOTAL used = ${totalUsedPcs} Pcs`)
//     return totalUsedPcs
//   }

//   // ✅ FIXED: Get remaining stock - CORRECT yellow material logic
//   const getRemainingStockInUom = (itemId, batchNumber, displayUom, itemData, currentIndex = -1) => {
//     if (!itemId || !batchNumber || !itemData) return 0

//     const batches = availableBatches[itemId] || []
//     const batch = batches.find(b => b.batchno.toString() === batchNumber.toString())
//     if (!batch) return 0

//     // ✅ STEP 1: Get batch total in Pcs (API always returns in smallest UOM)
//     const batchTotalPcs = parseFloat(batch.available_qty_uom1) || 0
//     console.log(`🎯 BATCH ${batchNumber}: Total = ${batchTotalPcs} Pcs`)
    
//     // ✅ STEP 2: Calculate total used by OTHER rows in Pcs
//     const totalUsedPcs = getTotalUsedFromBatchInPcs(itemId, batchNumber, currentIndex)
//     console.log(`🎯 BATCH ${batchNumber}: Used by others = ${totalUsedPcs} Pcs`)
    
//     // ✅ STEP 3: Calculate remaining in Pcs
//     const remainingPcs = Math.max(0, batchTotalPcs - totalUsedPcs)
//     console.log(`🎯 BATCH ${batchNumber}: Remaining = ${remainingPcs} Pcs`)
    
//     // ✅ STEP 4: Convert remaining Pcs to display UOM
//     let remainingInDisplayUom = remainingPcs // Default: Pcs
//     let uomName = 'Pcs'
    
//     if (displayUom === 2 && itemData.uom2_qty) {
//       // Convert to Boxes
//       const pcsPerBox = parseFloat(itemData.uom2_qty) // e.g., 60
//       remainingInDisplayUom = remainingPcs / pcsPerBox
//       uomName = 'Box'
//       console.log(`🎯 Convert to Box: ${remainingPcs} ÷ ${pcsPerBox} = ${remainingInDisplayUom} Box`)
//     } else if (displayUom === 3 && itemData.uom3_qty) {
//       // Convert to Cartons  
//       const pcsPerCarton = parseFloat(itemData.uom3_qty) // e.g., 3600
//       remainingInDisplayUom = remainingPcs / pcsPerCarton
//       uomName = 'Crt'
//       console.log(`🎯 Convert to Crt: ${remainingPcs} ÷ ${pcsPerCarton} = ${remainingInDisplayUom} Crt`)
//     }

//     console.log(`✅ FINAL RESULT: ${remainingInDisplayUom.toFixed(3)} ${uomName} available for Row ${currentIndex + 1}`)
    
//     return remainingInDisplayUom
//   }

//   // ✅ Fetch functions (unchanged)
//   const fetchBatches = async () => {
//     const batchData = {}
//     for (const item of detailItems) {
//       if (item.Item_ID) {
//         const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`)
//         const result = await response.json()
//         if (result.success && result.data) {
//           batchData[item.Item_ID] = result.data
//         }
//       }
//     }
//     setAvailableBatches(batchData)
//   }

//   const fetchCOAs = async () => {
//     const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`)
//     const result = await response.json()
//     if (result.success && result.zCoaRecords) {
//       setAllCOAs(Array.isArray(result.zCoaRecords) ? result.zCoaRecords : [result.zCoaRecords])
//     }
//   }

//   useEffect(() => {
//     fetchCOAs()
//     if (detailItems.length > 0) {
//       fetchBatches()
//     }
//   }, [detailItems.length])

//   const getCoaName = (coaId) => {
//     const coa = allCOAs.find(c => c.id === parseInt(coaId))
//     return coa ? coa.acName : `COA-${coaId}`
//   }

//   // ✅ FIXED: UOM change - FREE selection, validation only when needed
//   const handleUomChange = (rowIndex, values) => {
//     const item = detailItems[rowIndex]
    
//     const saleUnit = parseInt(values.sale_unit) || 1
//     const requestedQty = parseFloat(
//       saleUnit === 2 ? values.uom2_qty :
//       saleUnit === 3 ? values.uom3_qty :
//       values.uom1_qty
//     ) || 0

//     console.log(`🔄 UOM Change Row ${rowIndex + 1}:`, {
//       saleUnit,
//       requestedQty,
//       batch: item.Batch_Number
//     })

//     // ✅ VALIDATION: Only if batch selected AND quantity entered
//     if (item.Batch_Number && requestedQty > 0) {
//       const remainingStock = getRemainingStockInUom(item.Item_ID, item.Batch_Number, saleUnit, item.item, rowIndex)
      
//       if (requestedQty > remainingStock) {
//         const uomName = saleUnit === 1 ? 'Pcs' : saleUnit === 2 ? 'Box' : 'Crt'
//         setMessage(`❌ Not enough! Available: ${remainingStock.toFixed(3)} ${uomName}, Requested: ${requestedQty} ${uomName}`)
//         setTimeout(() => setMessage(''), 5000)
//         return
//       }
//     }

//     setMessage('')
    
//     // ✅ Update quantities (allow free UOM selection)
//     const updated = [...detailItems]
//     updated[rowIndex] = {
//       ...updated[rowIndex],
//       uom1_qty: parseFloat(values.uom1_qty) || 0,
//       uom2_qty: parseFloat(values.uom2_qty) || 0,
//       uom3_qty: parseFloat(values.uom3_qty) || 0,
//       sale_unit: saleUnit,
//       QTY_Dispatched: requestedQty
//     }
    
//     setDetailItems(updated)
//   }

//   return (
//     <div className="space-y-4">
//       {/* Yellow Material Test Debug */}
//       <div className="bg-blue-100 p-3 rounded text-sm">
//         <strong>🧪 Yellow Material Test:</strong>
//         {detailItems.filter(item => item.Batch_Number === 'LP:222').length > 0 && (
//           <div className="mt-2">
//             <div><strong>LP:222 Batch Usage:</strong></div>
//             {detailItems.map((item, index) => {
//               if (item.Batch_Number !== 'LP:222') return null
              
//               const usedPcs = item.sale_unit === 1 ? item.uom1_qty :
//                            item.sale_unit === 2 ? item.uom2_qty * parseFloat(item.item?.uom2_qty || 60) :
//                            item.sale_unit === 3 ? item.uom3_qty * parseFloat(item.item?.uom3_qty || 3600) : 0
              
//               return (
//                 <div key={index} className="text-xs">
//                   Row {index + 1}: Used {usedPcs} Pcs ({item.QTY_Dispatched} in UOM{item.sale_unit})
//                 </div>
//               )
//             })}
//             <div className="text-xs font-bold">
//               Total Used: {getTotalUsedFromBatchInPcs(detailItems[0]?.Item_ID, 'LP:222')} Pcs
//             </div>
//           </div>
//         )}
//       </div>

//       {message && (
//         <div className="bg-red-100 text-red-800 p-3 rounded">
//           {message}
//         </div>
//       )}

//       <div className="bg-white border rounded">
//         <div className="bg-gray-100 p-3">
//           <h3 className="font-bold">Items to Dispatch ({detailItems.length})</h3>
//         </div>

//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-2 text-left">Line</th>
//               <th className="px-3 py-2 text-left">Batch</th>
//               <th className="px-3 py-2 text-left">Item</th>
//               <th className="px-3 py-2 text-center bg-blue-50">SO Qty</th>
//               <th className="px-3 py-2 text-center bg-orange-50">Available</th>
//               <th className="px-3 py-2 text-center bg-green-50">Dispatch</th>
//               <th className="px-3 py-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {detailItems.map((item, index) => {
//               const itemData = item.item || {}
              
//               // ✅ FIXED: Correct remaining stock calculation
//               const remainingStock = getRemainingStockInUom(item.Item_ID, item.Batch_Number, item.sale_unit, itemData, index)
              
//               const uomData = {
//                 primary: {
//                   id: itemData.uom1?.id || 1,
//                   name: itemData.uom1?.uom || 'Pcs',
//                   qty: 1
//                 },
//                 secondary: itemData.uomTwo ? {
//                   id: itemData.uomTwo.id,
//                   name: itemData.uomTwo.uom,
//                   qty: parseFloat(itemData.uom2_qty) || 10
//                 } : undefined,
//                 tertiary: itemData.uomThree ? {
//                   id: itemData.uomThree.id,
//                   name: itemData.uomThree.uom,
//                   qty: parseFloat(itemData.uom3_qty) || 100
//                 } : undefined
//               }

//               const currentUomName = item.sale_unit === 1 ? 'Pcs' : 
//                                     item.sale_unit === 2 ? 'Box' : 
//                                     'Crt'

//               return (
//                 <tr key={index} className="border-b">
//                   {/* ✅ Line Number */}
//                   <td className="px-3 py-2">
//                     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
//                       {index + 1}
//                     </span>
//                   </td>
                  
//                   <td className="px-3 py-2">
//                     <select
//                       value={item.Batch_Number || ''}
//                       onChange={(e) => {
//                         const updated = [...detailItems]
//                         updated[index] = {
//                           ...updated[index],
//                           Batch_Number: e.target.value
//                           // ✅ Keep user's UOM and quantity selections
//                         }
//                         setDetailItems(updated)
//                       }}
//                       className="w-full px-2 py-1 border rounded text-xs"
//                     >
//                       <option value="">Select Batch</option>
//                       {(availableBatches[item.Item_ID] || []).map((batch, bIdx) => {
//                         // ✅ FIXED: Show actual remaining in batch
//                         const usedFromBatch = getTotalUsedFromBatchInPcs(item.Item_ID, batch.batchno, index)
//                         const batchTotalPcs = parseFloat(batch.available_qty_uom1)
//                         const remainingPcs = batchTotalPcs - usedFromBatch
                        
//                         // Convert to Crt for display in dropdown
//                         const remainingCrt = itemData.uom3_qty ? 
//                           remainingPcs / parseFloat(itemData.uom3_qty) : 
//                           remainingPcs / 3600 // Fallback
                        
//                         return (
//                           <option key={bIdx} value={batch.batchno}>
//                             {getCoaName(batch.batchno)} - Left: {Math.max(0, remainingCrt).toFixed(3)} Crt
//                           </option>
//                         )
//                       })}
//                     </select>
//                   </td>

//                   <td className="px-3 py-2">
//                     <div className="font-medium">{item.Item}</div>
//                     <div className="text-xs text-gray-500">ID: {item.Item_ID}</div>
//                   </td>

//                   <td className="px-3 py-2 text-center bg-blue-50">
//                     <div className="font-medium">{item.Qty_in_SO}</div>
//                     <div className="text-xs">{item.Uom_SO}</div>
//                   </td>

//                   {/* ✅ FIXED: Yellow Material - CORRECT remaining calculation */}
//                   <td className="px-3 py-2 text-center bg-orange-50">
//                     <div className="font-bold text-lg text-green-600">
//                       {item.Batch_Number ? Math.max(0, remainingStock).toFixed(3) : '-'}
//                     </div>
//                     <div className="text-xs text-gray-600">
//                       {currentUomName} Left
//                     </div>
//                   </td>

//                   {/* ✅ FIXED: FREE UOM Selection */}
//                   <td className="px-3 py-2 bg-green-50">
//                     {itemData.uom1 ? (
//                       <div className="p-2 bg-white border rounded">
//                         <UomConverter
//                           uomData={uomData}
//                           lineIndex={index}
//                           onChange={(values) => handleUomChange(index, values)}
//                           initialValues={{
//                             uom1_qty: item.uom1_qty?.toString() || '0',
//                             uom2_qty: item.uom2_qty?.toString() || '0',
//                             uom3_qty: item.uom3_qty?.toString() || '0',
//                             sale_unit: item.sale_unit?.toString() || '3'
//                           }}
//                           isPurchase={false}
//                         />
//                         <div className="text-xs text-center mt-1 text-gray-500">
//                           1 : {itemData.uom2_qty} : {itemData.uom3_qty}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center text-gray-500 py-2 text-xs">
//                         No UOM data
//                       </div>
//                     )}
//                   </td>

//                   <td className="px-3 py-2">
//                     <div className="flex flex-col gap-1">
//                       <button
//                         onClick={() => {
//                           const newRow = {
//                             ...item,
//                             Line_Id: detailItems.length + 1,
//                             Batch_Number: '',
//                             Qty_in_SO: 0,
//                             Uom_SO: '-',
//                             uom1_qty: 0,
//                             uom2_qty: 0,
//                             uom3_qty: 0,
//                             sale_unit: 2, // Default to Box UOM
//                             QTY_Dispatched: 0,
//                             isOriginal: false
//                           }
                          
//                           const updated = [...detailItems, newRow]
//                           // ✅ FIXED: Proper Line_Id resequencing
//                           const resequenced = updated.map((itm, idx) => ({
//                             ...itm,
//                             Line_Id: idx + 1
//                           }))
                          
//                           setDetailItems(resequenced)
//                         }}
//                         className="bg-green-600 text-white px-2 py-1 rounded text-xs"
//                       >
//                         + Batch
//                       </button>
                      
//                       {detailItems.length > 1 && (
//                         <button
//                           onClick={() => {
//                             const filtered = detailItems.filter((_, i) => i !== index)
//                             // ✅ FIXED: Resequence after removal
//                             const resequenced = filtered.map((itm, idx) => ({
//                               ...itm,
//                               Line_Id: idx + 1
//                             }))
//                             setDetailItems(resequenced)
//                           }}
//                           className="bg-red-600 text-white px-2 py-1 rounded text-xs"
//                         >
//                           Remove
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ Real-time batch allocation summary */}
//       {detailItems.length > 0 && (
//         <div className="bg-gray-100 p-3 rounded">
//           <h4 className="font-bold mb-2">🧪 Batch Allocation Test:</h4>
//           {Object.keys(availableBatches).map(itemId => {
//             const batches = availableBatches[itemId] || []
//             return batches.map(batch => {
//               const totalUsed = getTotalUsedFromBatchInPcs(parseInt(itemId), batch.batchno)
//               const batchTotal = parseFloat(batch.available_qty_uom1)
//               const remaining = batchTotal - totalUsed
              
//               return (
//                 <div key={`${itemId}-${batch.batchno}`} className="text-sm">
//                   <strong>{getCoaName(batch.batchno)}:</strong> 
//                   Total {batchTotal} Pcs → Used {totalUsed} Pcs → Remaining {remaining} Pcs
//                 </div>
//               )
//             })
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

// export default StockDetail






























































  // //Can't not select the uom 1 or primary uniy need to be fixed


  // // components/inventory/StockDetail.tsx - YOUR UI DESIGN APPLIED
  // 'use client'
  // import React, { useState, useEffect } from 'react'
  // import UomConverter from '@/components/common/items/UomConverter'
  // import { MultiSelectItemTable } from '@/components/common/items/MultiSelectItemTable'
  // import { Button } from '@/components/ui/Button'
  // import { Plus, Trash2 } from 'lucide-react'

  // const StockDetail = ({
  //   detailItems: initialItems = [],
  //   onDetailChange,
  //   mode = 'create',
  //   isFromOrder = false
  // }) => {

  //   const [detailItems, setDetailItems] = useState([])
  //   const [availableBatches, setAvailableBatches] = useState({})
  //   const [allCOAs, setAllCOAs] = useState([])
  //   const [message, setMessage] = useState('')
  //   const [showItemModal, setShowItemModal] = useState(false)

  //   // ✅ Your existing logic (unchanged)
  //   useEffect(() => {
  //     if (initialItems.length > 0) {
  //       const processedItems = initialItems.map((item, index) => ({
  //         Line_Id: index + 1,
  //         Batch_Number: '',
  //         Item: item.item?.itemName || 'Unknown',
  //         Item_ID: item.Item_ID,
  //         Qty_in_SO: parseFloat(
  //           item.sale_unit === '3' ? item.uom3_qty :
  //           item.sale_unit === '2' ? item.uom2_qty :
  //           item.uom1_qty || 0
  //         ),
  //         Uom_SO: item.uom?.uom || 'Unknown',
  //         uom1_qty: 0,
  //         uom2_qty: 0,
  //         uom3_qty: 0,
  //         sale_unit: parseInt(item.sale_unit) || 3,
  //         Uom_Id: item.Uom_Id || 0,
  //         QTY_Dispatched: 0,
  //         Stock_Price: parseFloat(item.item?.sellingPrice || 0),
  //         item: item.item
  //       }))
  //       setDetailItems(processedItems)
  //     }
  //   }, [initialItems])

  //   useEffect(() => {
  //     onDetailChange(detailItems)
  //   }, [detailItems])

  //   // ✅ Your yellow material logic (unchanged)
  //   const getTotalUsedByOthers = (itemId, batchNumber, excludeIndex = -1) => {
  //     let totalUsedPcs = 0
  //     detailItems.forEach((row, index) => {
  //       if (index === excludeIndex || row.Item_ID !== itemId || row.Batch_Number !== batchNumber) return
  //       const itemData = row.item
  //       let usedPcs = 0
  //       if (row.sale_unit === 1 && row.uom1_qty > 0) {
  //         usedPcs = parseFloat(row.uom1_qty)
  //       } else if (row.sale_unit === 2 && row.uom2_qty > 0 && itemData?.uom2_qty) {
  //         usedPcs = parseFloat(row.uom2_qty) * parseFloat(itemData.uom2_qty)
  //       } else if (row.sale_unit === 3 && row.uom3_qty > 0 && itemData?.uom3_qty) {
  //         usedPcs = parseFloat(row.uom3_qty) * parseFloat(itemData.uom3_qty)
  //       }
  //       totalUsedPcs += usedPcs
  //     })
  //     return totalUsedPcs
  //   }

  //   const getAvailableBefore = (itemId, batchNumber, displayUom, itemData, currentIndex = -1) => {
  //     if (!itemId || !batchNumber || !itemData) return 0
  //     const batches = availableBatches[itemId] || []
  //     const batch = batches.find(b => b.batchno.toString() === batchNumber.toString())
  //     if (!batch) return 0
  //     const batchTotalPcs = parseFloat(batch.available_qty_uom1) || 0
  //     const usedByOthers = getTotalUsedByOthers(itemId, batchNumber, currentIndex)
  //     const availableForThisRowPcs = Math.max(0, batchTotalPcs - usedByOthers)
  //     let conversionFactor = 1
  //     if (displayUom === 2 && itemData.uom2_qty) {
  //       conversionFactor = parseFloat(itemData.uom2_qty)
  //     } else if (displayUom === 3 && itemData.uom3_qty) {
  //       conversionFactor = parseFloat(itemData.uom3_qty)
  //     }
  //     return availableForThisRowPcs / conversionFactor
  //   }

  //   const getCurrentRowUsageInPcs = (item) => {
  //     if (!item.QTY_Dispatched || item.QTY_Dispatched <= 0) return 0
  //     const itemData = item.item
  //     let currentUsagePcs = 0
  //     if (item.sale_unit === 1) {
  //       currentUsagePcs = parseFloat(item.uom1_qty || 0)
  //     } else if (item.sale_unit === 2 && itemData?.uom2_qty) {
  //       currentUsagePcs = parseFloat(item.uom2_qty || 0) * parseFloat(itemData.uom2_qty)
  //     } else if (item.sale_unit === 3 && itemData?.uom3_qty) {
  //       currentUsagePcs = parseFloat(item.uom3_qty || 0) * parseFloat(itemData.uom3_qty)
  //     }
  //     return currentUsagePcs
  //   }

  //   const getAvailableAfter = (item, currentIndex) => {
  //     if (!item.Batch_Number || !item.item) return 0
  //     const batchTotalPcs = availableBatches[item.Item_ID]?.find(b => 
  //       b.batchno.toString() === item.Batch_Number.toString()
  //     )?.available_qty_uom1 || 0
  //     const usedByOthers = getTotalUsedByOthers(item.Item_ID, item.Batch_Number, currentIndex)
  //     const usedByCurrentRow = getCurrentRowUsageInPcs(item)
  //     const totalUsed = usedByOthers + usedByCurrentRow
  //     const remainingAfterPcs = Math.max(0, parseFloat(batchTotalPcs) - totalUsed)
  //     let conversionFactor = 1
  //     if (item.sale_unit === 2 && item.item.uom2_qty) {
  //       conversionFactor = parseFloat(item.item.uom2_qty)
  //     } else if (item.sale_unit === 3 && item.item.uom3_qty) {
  //       conversionFactor = parseFloat(item.item.uom3_qty)
  //     }
  //     return remainingAfterPcs / conversionFactor
  //   }

  //   // ✅ Your existing fetch functions (unchanged)
  //   const fetchBatches = async () => {
  //     const batchData = {}
  //     for (const item of detailItems) {
  //       if (item.Item_ID) {
  //         const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`)
  //         const result = await response.json()
  //         if (result.success && result.data) {
  //           batchData[item.Item_ID] = result.data
  //         }
  //       }
  //     }
  //     setAvailableBatches(batchData)
  //   }

  //   const fetchCOAs = async () => {
  //     const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`)
  //     const result = await response.json()
  //     if (result.success && result.zCoaRecords) {
  //       setAllCOAs(Array.isArray(result.zCoaRecords) ? result.zCoaRecords : [result.zCoaRecords])
  //     }
  //   }

  //   useEffect(() => {
  //     fetchCOAs()
  //     if (detailItems.length > 0) {
  //       fetchBatches()
  //     }
  //   }, [detailItems.length])

  //   const getCoaName = (coaId) => {
  //     const coa = allCOAs.find(c => c.id === parseInt(coaId))
  //     return coa ? coa.acName : `COA-${coaId}`
  //   }

  //   const handleUomChange = (rowIndex, values) => {
  //     const saleUnit = parseInt(values.sale_unit) || 1
  //     const requestedQty = parseFloat(
  //       saleUnit === 2 ? values.uom2_qty :
  //       saleUnit === 3 ? values.uom3_qty :
  //       values.uom1_qty
  //     ) || 0

  //     const updated = [...detailItems]
  //     updated[rowIndex] = {
  //       ...updated[rowIndex],
  //       uom1_qty: parseFloat(values.uom1_qty) || 0,
  //       uom2_qty: parseFloat(values.uom2_qty) || 0,
  //       uom3_qty: parseFloat(values.uom3_qty) || 0,
  //       sale_unit: saleUnit,
  //       QTY_Dispatched: requestedQty
  //     }
  //     setDetailItems(updated)
  //   }

  //   const handleOpenModal = () => setShowItemModal(true)
  //   const handleCloseModal = () => setShowItemModal(false)

  //   return (
  //     <div className="bg-white border border-gray-300 rounded-lg shadow-md">
  //       {/* ✅ YOUR EXACT HEADER DESIGN */}
  //       <div className="flex justify-end p-3">
  //         <div className="flex items-center justify-between">
  //           <Button
  //             variant="primary"
  //             onClick={handleOpenModal}
  //             className="flex items-center gap-2"
  //           >
  //             <Plus className="w-4 h-4" />
  //             {mode === 'edit' ? 'Add More Items' : 'Add Items'}
  //           </Button>
  //         </div>
  //       </div>

  //       {/* ✅ YOUR EXACT TABLE LAYOUT */}
  //       <div className="bg-white overflow-hidden">
  //         {/* Table Header */}
  //         <div className="max-w-7xl bg-gray-100 border-b border-gray-300">
  //           <div className="flex justify-between px-2 py-3 text-sm font-medium text-gray-700">
  //             <div className="text-center w-[5%]">LINE</div>
  //             <div className="text-center w-[12%]">BATCH</div>
  //             <div className="text-center w-[15%]">ITEM</div>
  //             <div className="text-center w-[8%]">SO QTY</div>
  //             <div className="text-center w-[8%]">AVAILABLE</div>
  //             <div className="text-center w-[25%]">DISPATCH QTY</div>
  //             <div className="text-center w-[8%]">AFTER</div>
  //             <div className="text-center w-[5%]">ACTION</div>
  //           </div>
  //         </div>

  //         {/* ✅ YOUR EXACT EMPTY STATE OR TABLE BODY */}
  //         {detailItems.length === 0 ? (
  //           <div className="p-12 text-center text-gray-500">
  //             <p className="text-lg">
  //               {mode === 'edit' ? 'No items in this dispatch' : 'No items added yet'}
  //             </p>
  //             <p className="text-sm mt-2">
  //               {mode === 'edit'
  //                 ? 'Add items to this dispatch using "Add More Items"'
  //                 : 'Click "Add Items" to select products'
  //               }
  //             </p>
  //           </div>
  //         ) : (
  //           <div>
  //             {detailItems.map((item, index) => {
  //               const itemData = item.item || {}
  //               const availableBefore = getAvailableBefore(item.Item_ID, item.Batch_Number, item.sale_unit, itemData, index)
  //               const availableAfter = getAvailableAfter(item, index)
                
  //               const uomData = {
  //                 primary: {
  //                   id: itemData.uom1?.id || 1,
  //                   name: itemData.uom1?.uom || 'Pcs',
  //                   qty: 1
  //                 },
  //                 secondary: itemData.uomTwo ? {
  //                   id: itemData.uomTwo.id,
  //                   name: itemData.uomTwo.uom,
  //                   qty: parseFloat(itemData.uom2_qty) || 10
  //                 } : undefined,
  //                 tertiary: itemData.uomThree ? {
  //                   id: itemData.uomThree.id,
  //                   name: itemData.uomThree.uom,
  //                   qty: parseFloat(itemData.uom3_qty) || 100
  //                 } : undefined
  //               }

  //               const currentUomName = item.sale_unit === 1 ? 'Pcs' : 
  //                                     item.sale_unit === 2 ? 'Box' : 
  //                                     'Crt'

  //               return (
  //                 <div
  //                   key={`line-${item.Line_Id}`}
  //                   className={`flex items-start justify-between px-2 py-3 ${
  //                     index % 2 === 0 ? 'bg-gray-0' : 'bg-gray-200'
  //                   }`}
  //                 >
  //                   {/* Line Number */}
  //                   <div className='w-[5%]'>
  //                     <div className="bg-green-100 text-green-800 rounded-xl flex items-center justify-center w-8 h-8 mx-auto">
  //                       {index + 1}
  //                     </div>
  //                   </div>

  //                   {/* Batch Selection */}
  //                   <div className="w-[12%]">
  //                     <select
  //                       value={item.Batch_Number || ''}
  //                       onChange={(e) => {
  //                         const updated = [...detailItems]
  //                         updated[index] = {
  //                           ...updated[index],
  //                           Batch_Number: e.target.value
  //                         }
  //                         setDetailItems(updated)
  //                       }}
  //                       className="w-full px-2 py-1 border border-gray-300 rounded text-sm h-8"
  //                     >
  //                       <option value="">Select Batch</option>
  //                       {(availableBatches[item.Item_ID] || []).map((batch, bIdx) => {
  //                         const usedFromBatch = getTotalUsedByOthers(item.Item_ID, batch.batchno, index)
  //                         const batchTotalPcs = parseFloat(batch.available_qty_uom1)
  //                         const remainingPcs = batchTotalPcs - usedFromBatch
  //                         const remainingCrt = itemData.uom3_qty ? 
  //                           remainingPcs / parseFloat(itemData.uom3_qty) : 
  //                           remainingPcs / 3600
                          
  //                         return (
  //                           <option key={bIdx} value={batch.batchno}>
  //                             {getCoaName(batch.batchno)} - {Math.max(0, remainingCrt).toFixed(1)} Crt
  //                           </option>
  //                         )
  //                       })}
  //                     </select>
  //                   </div>

  //                   {/* Item Name */}
  //                   <div className="w-[15%]">
  //                     <span className="text-gray-900 text-center font-normal text-sm truncate block">
  //                       {item.Item}
  //                     </span>
  //                     <div className="text-xs text-gray-500 text-center">ID: {item.Item_ID}</div>
  //                   </div>

  //                   {/* SO Quantity */}
  //                   <div className="w-[8%]">
  //                     <div className="text-center">
  //                       <div className="text-sm font-normal text-blue-800">
  //                         {item.Qty_in_SO}
  //                       </div>
  //                       <div className="text-xs text-blue-600">
  //                         {item.Uom_SO}
  //                       </div>
  //                     </div>
  //                   </div>

  //                   {/* Available Stock */}
  //                   <div className="w-[8%]">
  //                     <div className="text-center">
  //                       <div className="text-sm font-bold text-green-600">
  //                         {item.Batch_Number ? availableBefore.toFixed(3) : '-'}
  //                       </div>
  //                       <div className="text-xs text-gray-600">
  //                         {currentUomName}
  //                       </div>
  //                     </div>
  //                   </div>

  //                   {/* ✅ DISPATCH QTY: UOM Selection with your design pattern */}
  //                   <div className="w-[25%]">
  //                     <div>
  //                       {item.Batch_Number && itemData.uom1 ? (
  //                         <UomConverter
  //                           key={`uom-${item.Item_ID}-${index}`}
  //                           uomData={uomData}
  //                           lineIndex={index}
  //                           onChange={(values) => handleUomChange(index, values)}
  //                           initialValues={{
  //                             uom1_qty: item.uom1_qty === '' ? '' : item.uom1_qty.toString(),
  //                             uom2_qty: item.uom2_qty === '' ? '' : item.uom2_qty.toString(),
  //                             uom3_qty: item.uom3_qty === '' ? '' : item.uom3_qty.toString(),
  //                             sale_unit: item.sale_unit.toString()
  //                           }}
  //                           isPurchase={false}
  //                           tableMode={true}
  //                         />
  //                       ) : (
  //                         <div className="text-center text-gray-500 py-2 text-sm">
  //                           Select batch first
  //                         </div>
  //                       )}
  //                     </div>
  //                   </div>

  //                   {/* ✅ AVAILABLE AFTER: Shows remaining after current allocation */}
  //                   <div className="w-[8%]">
  //                     <div className="text-center">
  //                       <div className={`text-sm font-bold ${
  //                         availableAfter >= 0 ? 'text-purple-600' : 'text-red-600'
  //                       }`}>
  //                         {item.Batch_Number && item.QTY_Dispatched > 0 ? availableAfter.toFixed(3) : '-'}
  //                       </div>
  //                       <div className="text-xs text-gray-600">
  //                         {currentUomName} Left
  //                       </div>
  //                     </div>
  //                   </div>

  //                   {/* Actions */}
  //                   <div className="w-[5%]">
  //                     <div className="flex items-center justify-center gap-1">
  //                       <button
  //                         onClick={() => {
  //                           const newRow = {
  //                             ...item,
  //                             Line_Id: detailItems.length + 1,
  //                             Batch_Number: '',
  //                             Qty_in_SO: 0,
  //                             Uom_SO: '-',
  //                             uom1_qty: 0,
  //                             uom2_qty: 0,
  //                             uom3_qty: 0,
  //                             sale_unit: 2,
  //                             QTY_Dispatched: 0
  //                           }
                            
  //                           const updated = [...detailItems, newRow]
  //                           const resequenced = updated.map((itm, idx) => ({
  //                             ...itm,
  //                             Line_Id: idx + 1
  //                           }))
                            
  //                           setDetailItems(resequenced)
  //                         }}
  //                         className="p-1 hover:bg-green-100 rounded text-green-600"
  //                         title="Add batch"
  //                       >
  //                         <Plus className="w-4 h-4" />
  //                       </button>
                        
  //                       {detailItems.length > 1 && (
  //                         <button
  //                           onClick={() => {
  //                             const filtered = detailItems.filter((_, i) => i !== index)
  //                             const resequenced = filtered.map((itm, idx) => ({
  //                               ...itm,
  //                               Line_Id: idx + 1
  //                             }))
  //                             setDetailItems(resequenced)
  //                           }}
  //                           className="p-1 hover:bg-red-100 rounded text-red-600"
  //                           title="Delete line"
  //                         >
  //                           <Trash2 className="w-4 h-4" />
  //                         </button>
  //                       )}
  //                     </div>
  //                   </div>
  //                 </div>
  //               )
  //             })}
  //           </div>
  //         )}
  //       </div>

  //       {/* ✅ YOUR EXACT SUMMARY FOOTER */}
  //       {detailItems.length > 0 && (
  //         <div className="flex items-center justify-end p-2 bg-green-50 border-t">
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center">
  //               <div className="text-center w-30">
  //                 <div className="font-semibold text-blue-600">
  //                   {detailItems.filter(item => item.Batch_Number).length} Batched
  //                 </div>
  //               </div>
                
  //               <div className="text-center w-30">
  //                 <div className="font-semibold text-orange-600">
  //                   {detailItems.filter(item => item.QTY_Dispatched > 0).length} With Qty
  //                 </div>
  //               </div>

  //               <div className="text-center w-30">
  //                 <div className="font-semibold text-green-800 px-4 py-2 rounded-lg">
  //                   {detailItems.filter(item => item.Batch_Number && item.QTY_Dispatched > 0).length} Ready
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* ✅ YOUR EXACT MODAL */}
  //       {showItemModal && (
  //         <MultiSelectItemTable
  //           onSelectionComplete={(selectedItems) => {
  //             const newItems = selectedItems.map((item, index) => ({
  //               Line_Id: detailItems.length + index + 1,
  //               Batch_Number: '',
  //               Item: item.itemName,
  //               Item_ID: item.id,
  //               Qty_in_SO: 0,
  //               Uom_SO: '-',
  //               uom1_qty: 0,
  //               uom2_qty: 0,
  //               uom3_qty: 0,
  //               sale_unit: 1,
  //               QTY_Dispatched: 0,
  //               Stock_Price: item.sellingPrice || 0,
  //               item: item.originalItem
  //             }))
              
  //             setDetailItems([...detailItems, ...newItems])
  //             setShowItemModal(false)
  //           }}
  //           onCancel={handleCloseModal}
  //           isPurchase={false}
  //           alreadyAddedItemIds={detailItems.map(item => item.Item_ID)}
  //         />
  //       )}
  //     </div>
  //   )
  // }

  // export default StockDetail



































































