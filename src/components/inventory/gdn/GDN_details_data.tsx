// // components/gdn/GDN_details_data.tsx

// 'use client'
// import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
// import { Trash2, Package, Tag, Truck } from 'lucide-react'
// import UomConverter from '@/components/common/items/UomConverter'

// interface Props {
//   items: any[]
//   onChange: (data: any[]) => void
//   onDelete: (itemId: number) => void
//   globalBatch?: number | null
//   globalBatchName?: string
// }

// export default function GDN_details_data({
//   items,
//   onChange,
//   onDelete,
//   globalBatch,
//   globalBatchName
// }: Props) {
//   const [rowsData, setRowsData] = useState<Map<number, any>>(new Map())
//   const onChangeRef = useRef(onChange)

//   useEffect(() => {
//     onChangeRef.current = onChange
//   }, [onChange])

//   const itemIds = useMemo(() => items.map(i => i.id).sort().join(','), [items])

//   // Initialize/Update rows
//   useEffect(() => {
//     setRowsData(prev => {
//       const newMap = new Map()

//       items.forEach((item, idx) => {
//         const existing = prev.get(item.id)

//         if (existing) {
//           newMap.set(item.id, {
//             ...existing,
//             batchNumber: globalBatch
//           })
//         } else {
//           const defaultSaleUnit = item.orderQty?.sale_unit
//             ? parseInt(item.orderQty.sale_unit)
//             : (item.uomStructure.tertiary ? 3 : item.uomStructure.secondary ? 2 : 1)

//           newMap.set(item.id, {
//             lineIndex: idx,
//             Item_ID: item.id,
//             itemName: item.itemName,
//             unitPrice: item.sellingPrice || 0,  // ✅ Use selling price for GDN
//             uomStructure: item.uomStructure,
//             orderQty: item.orderQty,
//             isOrderItem: item.isOrderItem,
//             batchNumber: globalBatch,
//             gdnQty: {  // ✅ Use gdnQty instead of grnQty
//               uom1_qty: 0,
//               uom2_qty: 0,
//               uom3_qty: 0,
//               sale_unit: defaultSaleUnit,
//               Uom_Id: 0
//             }
//           })
//         }
//       })

//       return newMap
//     })
//   }, [itemIds, globalBatch])

//   const rows = useMemo(() => {
//     return items.map(item => rowsData.get(item.id)).filter(Boolean)
//   }, [items, rowsData])

//   // Notify parent
//   useEffect(() => {
//     if (rowsData.size === 0) return
//     const rowsArray = Array.from(rowsData.values()).map(row => ({
//       ...row,
//       batchNumber: globalBatch
//     }))
//     onChangeRef.current(rowsArray)
//   }, [rowsData, globalBatch])

//   const handleUomChange = useCallback((itemId: number, uomData: any) => {
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       const existing = newMap.get(itemId)
//       if (existing) {
//         newMap.set(itemId, { ...existing, gdnQty: uomData })
//       }
//       return newMap
//     })
//   }, [])

//   const handlePriceChange = useCallback((itemId: number, price: string) => {
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       const existing = newMap.get(itemId)
//       if (existing) {
//         newMap.set(itemId, { ...existing, unitPrice: parseFloat(price) || 0 })
//       }
//       return newMap
//     })
//   }, [])

//   const handleDelete = useCallback((itemId: number) => {
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       newMap.delete(itemId)
//       return newMap
//     })
//     onDelete(itemId)
//   }, [onDelete])

//   const formatOrderQty = (row: any) => {
//     const { orderQty, uomStructure } = row
//     if (!orderQty) return <span className="text-gray-400 italic text-xs">N/A</span>

//     const saleUnit = String(orderQty.sale_unit)
//     if (saleUnit === '3' && uomStructure.tertiary) {
//       return `${orderQty.uom3_qty} ${uomStructure.tertiary.name}`
//     }
//     if (saleUnit === '2' && uomStructure.secondary) {
//       return `${orderQty.uom2_qty} ${uomStructure.secondary.name}`
//     }
//     return `${orderQty.uom1_qty} ${uomStructure.primary.name}`
//   }

//   const grandTotal = useMemo(() => {
//     return rows.reduce((sum, row) => sum + ((row.gdnQty?.uom1_qty || 0) * (row.unitPrice || 0)), 0)
//   }, [rows])

//   // Empty state
//   if (rows.length === 0) {
//     return (
//       <div className="text-center py-16 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
//         <Truck className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
//         <h3 className="text-lg font-medium text-gray-500 mb-1">No Items to Dispatch</h3>
//         <p className="text-sm text-gray-400">Click "Add Items" to start adding products for dispatch</p>
//       </div>
//     )
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200">
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
//               <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">#</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Item</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Order Qty</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Dispatch Qty</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Batch</th>
//               <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Price</th>
//               <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Total</th>
//               <th className="px-4 py-3 w-12"></th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {rows.map((row, index) => (
//               <tr
//                 key={row.Item_ID}
//                 className={`hover:bg-emerald-50/30 transition-colors ${!row.isOrderItem ? 'bg-teal-50/30' : ''}`}
//               >
//                 {/* Line # */}
//                 <td className="px-4 py-4 text-sm text-gray-500 font-medium">
//                   {index + 1}
//                 </td>

//                 {/* Item */}
//                 <td className="px-4 py-4">
//                   <div className="font-medium text-gray-900">{row.itemName}</div>
//                   <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
//                     <span>ID: {row.Item_ID}</span>
//                     {!row.isOrderItem && (
//                       <span className="px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded text-[10px] font-medium">
//                         ADDED
//                       </span>
//                     )}
//                   </div>
//                 </td>

//                 {/* Order Qty */}
//                 <td className="px-4 py-4">
//                   <span className="text-emerald-600 font-medium">
//                     {formatOrderQty(row)}
//                   </span>
//                 </td>

//                 {/* Dispatch Qty - UomConverter */}
//                 <td className="px-4 py-4">
//                   <UomConverter
//                     key={`uom-gdn-${row.Item_ID}`}
//                     uomData={row.uomStructure}
//                     lineIndex={index}
//                     itemId={row.Item_ID}
//                     onChange={(data) => handleUomChange(row.Item_ID, data)}
//                     initialValues={row.orderQty || undefined}
//                   />
//                 </td>

//                 {/* Batch */}
//                 <td className="px-4 py-4">
//                   <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
//                     <Tag className="w-3.5 h-3.5 text-emerald-600" />
//                     <span className="text-emerald-800 font-semibold">{globalBatch || '-'}</span>
//                   </div>
//                 </td>

//                 {/* Price */}
//                 <td className="px-4 py-4 text-right">
//                   <input
//                     type="number"
//                     value={row.unitPrice || ''}
//                     onChange={(e) => handlePriceChange(row.Item_ID, e.target.value)}
//                     className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-right text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                     placeholder="0.00"
//                   />
//                 </td>

//                 {/* Total */}
//                 <td className="px-4 py-4 text-right">
//                   <span className="font-semibold text-gray-900">
//                     {((row.gdnQty?.uom1_qty || 0) * (row.unitPrice || 0)).toLocaleString()}
//                   </span>
//                 </td>

//                 {/* Delete */}
//                 <td className="px-4 py-4">
//                   <button
//                     onClick={() => handleDelete(row.Item_ID)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                     title="Remove item"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr className="bg-gradient-to-r from-emerald-100 to-teal-100 border-t-2 border-emerald-300">
//               <td colSpan={6} className="px-4 py-4 text-right">
//                 <span className="text-emerald-800 font-semibold">Grand Total:</span>
//               </td>
//               <td className="px-4 py-4 text-right">
//                 <span className="text-2xl font-bold text-emerald-700">
//                   {grandTotal.toLocaleString()}
//                 </span>
//               </td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }




















































//working ggod but no tbatch
// components/gdn/GDN_details_data.tsx

// 'use client'
// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { Trash2, Plus, Package, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
// import GDN_Item_Row from './GDN_Item_Row'

// interface Props {
//   items: any[]
//   onChange: (data: any[]) => void
//   onDelete: (itemId: number) => void
//   mode: 'create' | 'edit'
//   dispatchId?: number
// }

// export default function GDN_details_data({
//   items,
//   onChange,
//   onDelete,
//   mode,
//   dispatchId
// }: Props) {
//   // Map of itemId -> array of rows (for batch splitting)
//   const [itemRows, setItemRows] = useState<Map<number, any[]>>(new Map())

//   // Initialize rows from items
//   useEffect(() => {
//     const newMap = new Map<number, any[]>()

//     items.forEach(item => {
//       if (!newMap.has(item.id)) {
//         // Initialize with one empty row per item
//         newMap.set(item.id, [{
//           rowId: `${item.id}-0`,
//           Item_ID: item.id,
//           itemName: item.itemName,
//           uomStructure: item.uomStructure,
//           orderQty: item.orderQty,
//           sellingPrice: item.sellingPrice,
//           batchno: null,
//           availableBatches: [],
//           selectedBatchQty: 0,
//           dispatchQty: {
//             uom1_qty: 0,
//             uom2_qty: 0,
//             uom3_qty: 0,
//             sale_unit: 1
//           },
//           unitPrice: item.sellingPrice || 0
//         }])
//       }
//     })

//     setItemRows(newMap)
//   }, [items])

//   // Handle row update from child
//   const handleRowUpdate = useCallback((itemId: number, rowId: string, updatedRow: any) => {
//     setItemRows(prev => {
//       const newMap = new Map(prev)
//       const rows = newMap.get(itemId) || []
//       const rowIndex = rows.findIndex(r => r.rowId === rowId)

//       if (rowIndex !== -1) {
//         rows[rowIndex] = updatedRow
//         newMap.set(itemId, [...rows])
//       }

//       return newMap
//     })
//   }, [])

//   // Add split row (+ button)
//   const handleAddSplitRow = useCallback((itemId: number, remainingQty: number) => {
//     setItemRows(prev => {
//       const newMap = new Map(prev)
//       const rows = newMap.get(itemId) || []
//       const item = items.find(i => i.id === itemId)

//       if (!item) return prev

//       const newRowId = `${itemId}-${rows.length}`

//       rows.push({
//         rowId: newRowId,
//         Item_ID: itemId,
//         itemName: item.itemName,
//         uomStructure: item.uomStructure,
//         orderQty: null, // No order qty for split rows
//         sellingPrice: item.sellingPrice,
//         batchno: null,
//         availableBatches: [],
//         selectedBatchQty: remainingQty, // Start with remaining qty from previous row
//         dispatchQty: {
//           uom1_qty: 0,
//           uom2_qty: 0,
//           uom3_qty: 0,
//           sale_unit: 1
//         },
//         unitPrice: item.sellingPrice || 0,
//         isSplitRow: true
//       })

//       newMap.set(itemId, [...rows])
//       return newMap
//     })
//   }, [items])

//   // Remove split row
//   const handleRemoveSplitRow = useCallback((itemId: number, rowId: string) => {
//     setItemRows(prev => {
//       const newMap = new Map(prev)
//       const rows = newMap.get(itemId) || []

//       // Don't remove if it's the only row
//       if (rows.length <= 1) return prev

//       const filteredRows = rows.filter(r => r.rowId !== rowId)
//       newMap.set(itemId, filteredRows)
//       return newMap
//     })
//   }, [])

//   // Notify parent of changes
//   useEffect(() => {
//     const allRows: any[] = []

//     itemRows.forEach((rows, itemId) => {
//       rows.forEach(row => {
//         if (row.dispatchQty?.uom1_qty > 0 && row.batchno) {
//           allRows.push(row)
//         }
//       })
//     })

//     onChange(allRows)
//   }, [itemRows, onChange])

//   // Calculate grand total
//   const grandTotal = useMemo(() => {
//     let total = 0
//     itemRows.forEach(rows => {
//       rows.forEach(row => {
//         total += (row.dispatchQty?.uom1_qty || 0) * (row.unitPrice || 0)
//       })
//     })
//     return total
//   }, [itemRows])

//   // Empty state
//   if (items.length === 0) {
//     return (
//       <div className="text-center py-16 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
//         <Package className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
//         <h3 className="text-lg font-medium text-gray-500 mb-1">No Items to Dispatch</h3>
//         <p className="text-sm text-gray-400">Click "Add Items" to start</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {items.map((item, itemIndex) => {
//         const rows = itemRows.get(item.id) || []

//         return (
//           <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
//             {/* Item Header */}
//             <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-medium text-gray-500">#{itemIndex + 1}</span>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{item.itemName}</h3>
//                   <span className="text-xs text-gray-500">ID: {item.id}</span>
//                 </div>
//                 {item.orderQty && (
//                   <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
//                     Order: {item.orderQty.uom1_qty} {item.uomStructure.primary.name}
//                   </span>
//                 )}
//               </div>
//               <button
//                 onClick={() => onDelete(item.id)}
//                 className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Item Rows */}
//             <div className="divide-y divide-gray-100">
//               {rows.map((row, rowIndex) => (
//                 <GDN_Item_Row
//                   key={row.rowId}
//                   row={row}
//                   rowIndex={rowIndex}
//                   totalRows={rows.length}
//                   mode={mode}
//                   dispatchId={dispatchId}
//                   onUpdate={(updatedRow) => handleRowUpdate(item.id, row.rowId, updatedRow)}
//                   onAddSplit={(remainingQty) => handleAddSplitRow(item.id, remainingQty)}
//                   onRemove={() => handleRemoveSplitRow(item.id, row.rowId)}
//                 />
//               ))}
//             </div>
//           </div>
//         )
//       })}

//       {/* Grand Total */}
//       <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 flex justify-between items-center">
//         <span className="font-semibold text-emerald-800">Grand Total:</span>
//         <span className="text-2xl font-bold text-emerald-700">
//           {grandTotal.toLocaleString()}
//         </span>
//       </div>
//     </div>
//   )
// }





























































// components/gdn/GDN_details_data.tsx - WITH DUPLICATE BATCH FEATURE

'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, Package, Copy, Plus } from 'lucide-react'
import GDN_Item_Row from './GDN_Item_Row'

interface Props {
  items: any[]
  onChange: (data: any[]) => void
  onDelete: (itemId: number) => void
  mode: 'create' | 'edit'
  dispatchId?: number
}

export default function GDN_details_data({
  items,
  onChange,
  onDelete,
  mode,
  dispatchId
}: Props) {
  // Map: itemId -> array of rows (supports multiple batches per item)
  const [itemRows, setItemRows] = useState<Map<number, any[]>>(new Map())

  // Initialize rows from items
  useEffect(() => {
    setItemRows(prev => {
      const newMap = new Map<number, any[]>()

      items.forEach(item => {
        const existingRows = prev.get(item.id)

        if (existingRows && existingRows.length > 0) {
          newMap.set(item.id, existingRows)
        } else {
          // Initialize with one empty row
          newMap.set(item.id, [{
            rowId: `${item.id}-${Date.now()}`,
            Item_ID: item.id,
            itemName: item.itemName,
            uomStructure: item.uomStructure,
            orderQty: item.orderQty,
            sellingPrice: item.sellingPrice,
            batchno: null,
            selectedBatchQty: 0,
            dispatchQty: {
              uom1_qty: 0,
              uom2_qty: 0,
              uom3_qty: 0,
              sale_unit: 1
            },
            unitPrice: item.sellingPrice || 0,
            isFirstRow: true
          }])
        }
      })

      return newMap
    })
  }, [items])

  // Handle row update
  const handleRowUpdate = useCallback((itemId: number, rowId: string, updatedRow: any) => {
    setItemRows(prev => {
      const newMap = new Map(prev)
      const rows = [...(newMap.get(itemId) || [])]
      const rowIndex = rows.findIndex(r => r.rowId === rowId)

      if (rowIndex !== -1) {
        rows[rowIndex] = updatedRow
        newMap.set(itemId, rows)
      }

      return newMap
    })
  }, [])

  // ✅ ADD DUPLICATE ROW (Same item, different batch)
  const handleAddDuplicateRow = useCallback((itemId: number) => {
    setItemRows(prev => {
      const newMap = new Map(prev)
      const rows = [...(newMap.get(itemId) || [])]
      const item = items.find(i => i.id === itemId)

      if (!item) return prev

      const newRowId = `${itemId}-${Date.now()}`

      // Create duplicate row with same item info but empty batch/qty
      rows.push({
        rowId: newRowId,
        Item_ID: itemId,
        itemName: item.itemName,
        uomStructure: item.uomStructure,
        orderQty: null, // No order qty for duplicate
        sellingPrice: item.sellingPrice,
        batchno: null,
        selectedBatchQty: 0,
        dispatchQty: {
          uom1_qty: 0,
          uom2_qty: 0,
          uom3_qty: 0,
          sale_unit: 1
        },
        unitPrice: item.sellingPrice || 0,
        isDuplicateRow: true,
        isFirstRow: false
      })

      newMap.set(itemId, rows)
      return newMap
    })
  }, [items])

  // Remove row
  const handleRemoveRow = useCallback((itemId: number, rowId: string) => {
    setItemRows(prev => {
      const newMap = new Map(prev)
      const rows = newMap.get(itemId) || []

      // Don't remove if it's the only row
      if (rows.length <= 1) return prev

      newMap.set(itemId, rows.filter(r => r.rowId !== rowId))
      return newMap
    })
  }, [])

  // Notify parent of all valid rows
  useEffect(() => {
    const allRows: any[] = []

    itemRows.forEach((rows) => {
      rows.forEach(row => {
        if (row.dispatchQty?.uom1_qty > 0 && row.batchno) {
          allRows.push(row)
        }
      })
    })

    onChange(allRows)
  }, [itemRows, onChange])

  // Calculate grand total
  const grandTotal = useMemo(() => {
    let total = 0
    itemRows.forEach(rows => {
      rows.forEach(row => {
        total += (row.dispatchQty?.uom1_qty || 0) * (row.unitPrice || 0)
      })
    })
    return total
  }, [itemRows])

  // Empty state
  if (items.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
        <Package className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-1">No Items to Dispatch</h3>
        <p className="text-sm text-gray-400">Click "Add Items" to start</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-2">
      {items.map((item, itemIndex) => {
        const rows = itemRows.get(item.id) || []

        return (
          <div key={item.id} className="rounded-xl overflow-hidden">
            {/* ══════════ Item Header ══════════ */}
            <div className=" px-4  flex items-center justify-between">
              <div className="flex items-center ">
                <span className="w-8 mr-2 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {itemIndex + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.itemName}</h3>
                  {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>ID: {item.id}</span>
                    {item.orderQty && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                        Order: {item.orderQty.uom1_qty} {item.uomStructure?.primary?.name || 'pcs'}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      {rows.length} batch row{rows.length > 1 ? 's' : ''}
                    </span>
                  </div> */}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* ✅ ADD BATCH BUTTON - Duplicate item for another batch */}
                <button
                  onClick={() => handleAddDuplicateRow(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-medium transition-colors"
                  title="Add another batch for this item"
                >
                  <Copy className="w-4 h-4" />
                  Add Batch
                </button>

                {/* Delete Item */}
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ══════════ Item Rows (Multiple Batches) ══════════ */}
            <div className="divide-y divide-gray-100">
              {rows.map((row, rowIndex) => (
                <GDN_Item_Row
                  key={row.rowId}
                  row={row}
                  rowIndex={rowIndex}
                  totalRows={rows.length}
                  mode={mode}
                  dispatchId={dispatchId}
                  onUpdate={(updatedRow) => handleRowUpdate(item.id, row.rowId, updatedRow)}
                  onRemove={() => handleRemoveRow(item.id, row.rowId)}
                  showRemoveButton={rows.length > 1}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* ══════════ Grand Total ══════════ */}
      {/* <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 flex justify-between items-center">
        <span className="font-semibold text-emerald-800">Grand Total:</span>
        <span className="text-2xl font-bold text-emerald-700">
          {grandTotal.toLocaleString()}
        </span>
      </div> */}
    </div>
  )
}
