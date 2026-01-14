// import { useMemo, useState } from 'react'

// const Stk_details_data = ({ data }: { data: any }) => {

//     const items = (data)=>{
// data.map
//     }
//     return (
//         <div>
//             Stk_details_data
//             <pre>{JSON.stringify(data, null, 2)}</pre>
//         </div>
//     )
// }

// export default Stk_details_data











// // Stk_details_data.tsx
// import { useMemo } from 'react'

// const Stk_details_data = ({ data }: { data: any }) => {
    
//     const extractedData = useMemo(() => 
//         data?.map((item: any) => ({
//             id: item.id,
//             itemName: item.itemName,
//             uom: item.uom
//         })), 
//     [data])

//     console.log('Extracted Data:', extractedData)

//     return (
//         <div>
//             <h2>Stock Details Data</h2>
//             {extractedData?.map((item: any, i: number) => (
//                 <div key={i}>
//                     <p><strong>ID:</strong> {item.id}</p>
//                     <p><strong>Item Name:</strong> {item.itemName}</p>
//                     <p><strong>UOM Data:</strong></p>
//                     <pre>{JSON.stringify(item.uom, null, 2)}</pre>
//                     <hr />
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default Stk_details_data













































// // 2. UPDATED Stk_details_data with DELETE sync to parent
// import { useState, useEffect } from 'react'
// import { Trash2 } from 'lucide-react'
// import UomConverter from '@/components/common/items/UomConverter'

// interface Props {
//   data: any[]
//   onChange?: (extractedData: any[]) => void
//   onDelete?: (itemId: number) => void // ✅ NEW: Notify parent of deletion
// }

// const Stk_details_data = ({ data, onChange, onDelete }: Props) => {
//   const [rows, setRows] = useState<any[]>([])

//   useEffect(() => {
//     const initialRows = data.map((item, index) => ({
//       lineIndex: index,
//       Item_ID: item.id,
//       itemName: item.itemName,
//       uomData: {
//         primary: { id: item.uom1, name: item.uom1_name, qty: item.qyt_1 },
//         secondary: item.uom2 ? { id: item.uom2, name: item.uom2_name, qty: parseFloat(item.qty_2) } : undefined,
//         tertiary: item.uom3 ? { id: item.uom3, name: item.uom3_name, qty: parseFloat(item.qty_3) } : undefined
//       },
//       initialValues: {
//         uom1_qty: item.uom?.uom1_qty || '',
//         uom2_qty: item.uom?.uom2_qty || '',
//         uom3_qty: item.uom?.uom3_qty || '',
//         sale_unit: item.uom?.sale_unit || '3'
//       },
//       uomValues: {}
//     }))
//     setRows(initialRows)
//   }, [data])

//   const handleUomChange = (lineIndex: number, uomData: any) => {
//     setRows(prev => {
//       const updated = prev.map(row => 
//         row.lineIndex === lineIndex ? { ...row, uomValues: uomData } : row
//       )
      
//       const extracted = updated.map(row => ({
//         Item_ID: row.Item_ID,
//         itemName: row.itemName,
//         uom1_qty: row.uomValues.uom1_qty || 0,
//         uom2_qty: row.uomValues.uom2_qty || 0,
//         uom3_qty: row.uomValues.uom3_qty || 0,
//         sale_unit: row.uomValues.sale_unit || 3,
//         Uom_Id: row.uomValues.Uom_Id || 0
//       }))
      
//       onChange?.(extracted)
//       return updated
//     })
//   }

//   const handleDelete = (lineIndex: number, itemId: number) => {
//     // ✅ Notify parent BEFORE updating state
//     onDelete?.(itemId)
    
//     setRows(prev => {
//       const updated = prev.filter(row => row.lineIndex !== lineIndex)
//       const reindexed = updated.map((row, idx) => ({ ...row, lineIndex: idx }))
      
//       const extracted = reindexed.map(row => ({
//         Item_ID: row.Item_ID,
//         itemName: row.itemName,
//         uom1_qty: row.uomValues.uom1_qty || 0,
//         uom2_qty: row.uomValues.uom2_qty || 0,
//         uom3_qty: row.uomValues.uom3_qty || 0,
//         sale_unit: row.uomValues.sale_unit || 3,
//         Uom_Id: row.uomValues.Uom_Id || 0
//       }))
      
//       onChange?.(extracted)
//       return reindexed
//     })
//   }

//   return (
//     <div className="mt-6">
//       <h3>Dispatch Items ({rows.length})</h3>
//       <table className="w-full">
//         <thead>
//           <tr>
//             <th>Item Name</th>
//             <th>UOM Conversions</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row) => (
//             <tr key={row.lineIndex}>
//               <td>
//                 <div>{row.itemName}</div>
//                 <div>ID: {row.Item_ID}</div>
//               </td>
//               <td>
//                 <UomConverter
//                   uomData={row.uomData}
//                   lineIndex={row.lineIndex}
//                   initialValues={row.initialValues}
//                   onChange={(uomData) => handleUomChange(row.lineIndex, uomData)}
//                 />
//               </td>
//               <td>
//                 <button onClick={() => handleDelete(row.lineIndex, row.Item_ID)}>
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default Stk_details_data














































// //workign good

// 'use client'
// import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
// import { Trash2 } from 'lucide-react'
// import UomConverter from './UomConverter'

// interface Props {
//   items: any[]
//   onChange: (data: any[]) => void
//   onDelete: (itemId: number) => void
// }

// export default function Stk_details_data({ items, onChange, onDelete }: Props) {
//   const [rowsData, setRowsData] = useState<Map<number, any>>(new Map())
//   const onChangeRef = useRef(onChange)
  
//   // ✅ Keep onChange ref updated
//   useEffect(() => {
//     onChangeRef.current = onChange
//   }, [onChange])

//   // ✅ Create stable item IDs string for comparison
//   const itemIds = useMemo(() => items.map(i => i.id).sort().join(','), [items])

//   // ✅ Initialize rowsData when items change
//   useEffect(() => {
//     setRowsData(prev => {
//       const newMap = new Map()
      
//       items.forEach((item, idx) => {
//         // ✅ Preserve existing data if item was already in the map
//         const existing = prev.get(item.id)
        
//         if (existing) {
//           newMap.set(item.id, existing)
//         } else {
//           // ✅ Initialize new item
//           newMap.set(item.id, {
//             lineIndex: idx,
//             Item_ID: item.id,
//             itemName: item.itemName,
//             unitPrice: item.sellingPrice || 0,
//             uomStructure: item.uomStructure,
//             orderQty: item.orderQty,
//             isOrderItem: item.isOrderItem,
//             batchNumber: '',
//             grnQty: {
//               uom1_qty: 0,
//               uom2_qty: 0,
//               uom3_qty: 0,
//               sale_unit: item.orderQty?.sale_unit ? parseInt(item.orderQty.sale_unit) : 3,
//               Uom_Id: 0
//             }
//           })
//         }
//       })
      
//       console.log('📋 Rows updated:', newMap.size)
//       return newMap
//     })
//   }, [itemIds]) // ✅ Only depend on itemIds string, not items array

//   // ✅ Convert Map to array for rendering
//   const rows = useMemo(() => {
//     return items.map(item => rowsData.get(item.id)).filter(Boolean)
//   }, [items, rowsData])

//   // ✅ Send data to parent when rowsData changes
//   useEffect(() => {
//     if (rowsData.size === 0) return
//     const rowsArray = Array.from(rowsData.values())
//     onChangeRef.current(rowsArray)
//   }, [rowsData])

//   // ✅ Handle UOM change - uses functional update
//   const handleUomChange = useCallback((itemId: number, uomData: any) => {
//     console.log(`🔄 UOM Change for item ${itemId}:`, uomData)
    
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       const existing = newMap.get(itemId)
      
//       if (existing) {
//         newMap.set(itemId, {
//           ...existing,
//           grnQty: uomData
//         })
//       }
      
//       return newMap
//     })
//   }, [])

//   // ✅ Handle batch change
//   const handleBatchChange = useCallback((itemId: number, value: string) => {
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       const existing = newMap.get(itemId)
      
//       if (existing) {
//         newMap.set(itemId, {
//           ...existing,
//           batchNumber: value
//         })
//       }
      
//       return newMap
//     })
//   }, [])

//   // ✅ Handle delete
//   const handleDelete = useCallback((itemId: number) => {
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       newMap.delete(itemId)
//       return newMap
//     })
//     onDelete(itemId)
//   }, [onDelete])

//   // ✅ Format order quantity for display
//   const formatOrderQty = (row: any) => {
//     const { orderQty, uomStructure } = row
//     if (!orderQty) return <span className="text-gray-400">N/A (new item)</span>

//     const saleUnit = String(orderQty.sale_unit)

//     if (saleUnit === '3' && uomStructure.tertiary) {
//       return `${orderQty.uom3_qty} ${uomStructure.tertiary.name}`
//     }
//     if (saleUnit === '2' && uomStructure.secondary) {
//       return `${orderQty.uom2_qty} ${uomStructure.secondary.name}`
//     }
//     return `${orderQty.uom1_qty} ${uomStructure.primary.name}`
//   }

//   if (rows.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500 border rounded-lg">
//         No items selected. Click "Add / Remove Items" to start.
//       </div>
//     )
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border rounded-lg">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-3 py-3 text-left text-sm font-medium">Item</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Order Qty</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Dispatch Qty</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Batch No.</th>
//             <th className="px-3 py-3 text-right text-sm font-medium">Price</th>
//             <th className="px-3 py-3 text-right text-sm font-medium">Total</th>
//             <th className="px-3 py-3 w-10"></th>
//           </tr>
//         </thead>
//         <tbody className="divide-y">
//           {rows.map((row, index) => (
//             <tr key={row.Item_ID} className="hover:bg-gray-50">
//               {/* Item Name */}
//               <td className="px-3 py-3">
//                 <div className="font-medium">{row.itemName}</div>
//                 <div className="text-xs text-gray-500">
//                   ID: {row.Item_ID}
//                   {!row.isOrderItem && (
//                     <span className="ml-2 text-orange-500">(Added)</span>
//                   )}
//                 </div>
//               </td>

//               {/* Order Quantity */}
//               <td className="px-3 py-3">
//                 <span className="text-blue-600 font-medium">
//                   {formatOrderQty(row)}
//                 </span>
//               </td>

//               {/* Dispatch Quantity - UomConverter */}
//               <td className="px-3 py-3">
//                 <UomConverter
//                   key={`uom-${row.Item_ID}`}  // ✅ Force new instance per item
//                   uomData={row.uomStructure}
//                   lineIndex={index}
//                   itemId={row.Item_ID}  // ✅ Pass itemId for callback
//                   onChange={(data) => handleUomChange(row.Item_ID, data)}
//                   initialValues={row.orderQty || undefined}
//                 />
//               </td>

//               {/* Batch Number */}
//               <td className="px-3 py-3">
//                 <input
//                   type="text"
//                   value={row.batchNumber}
//                   onChange={(e) => handleBatchChange(row.Item_ID, e.target.value)}
//                   placeholder="Enter batch"
//                   className="border rounded px-2 py-1 w-28 text-sm"
//                 />
//               </td>

//               {/* Unit Price */}
//               <td className="px-3 py-3 text-right">
//                 {row.unitPrice.toFixed(2)}
//               </td>

//               {/* Total */}
//               <td className="px-3 py-3 text-right font-medium">
//                 {(row.grnQty.uom1_qty * row.unitPrice).toFixed(2)}
//               </td>

//               {/* Delete */}
//               <td className="px-3 py-3">
//                 <button
//                   onClick={() => handleDelete(row.Item_ID)}
//                   className="text-red-500 hover:bg-red-50 rounded p-1"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//         <tfoot className="bg-gray-50">
//           <tr>
//             <td colSpan={5} className="px-3 py-3 text-right font-semibold">
//               Grand Total:
//             </td>
//             <td className="px-3 py-3 text-right font-bold text-lg">
//               {rows.reduce((sum, row) => sum + (row.grnQty.uom1_qty * row.unitPrice), 0).toFixed(2)}
//             </td>
//             <td></td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   )
// }




























































// working 2.0


// 'use client'
// import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
// import { Trash2, Tag } from 'lucide-react'
// import UomConverter from './UomConverter'

// interface Props {
//   items: any[]
//   onChange: (data: any[]) => void
//   onDelete: (itemId: number) => void
//   globalBatch?: string  // ✅ NEW: Global batch from header
// }

// export default function Stk_details_data({ items, onChange, onDelete, globalBatch }: Props) {
//   const [rowsData, setRowsData] = useState<Map<number, any>>(new Map())
//   const onChangeRef = useRef(onChange)
  
//   useEffect(() => {
//     onChangeRef.current = onChange
//   }, [onChange])

//   const itemIds = useMemo(() => items.map(i => i.id).sort().join(','), [items])

//   useEffect(() => {
//     setRowsData(prev => {
//       const newMap = new Map()
      
//       items.forEach((item, idx) => {
//         const existing = prev.get(item.id)
        
//         if (existing) {
//           newMap.set(item.id, {
//             ...existing,
//             batchNumber: globalBatch || existing.batchNumber  // ✅ Update batch if global changes
//           })
//         } else {
//           newMap.set(item.id, {
//             lineIndex: idx,
//             Item_ID: item.id,
//             itemName: item.itemName,
//             unitPrice: item.sellingPrice || 0,
//             uomStructure: item.uomStructure,
//             orderQty: item.orderQty,
//             isOrderItem: item.isOrderItem,
//             batchNumber: globalBatch || '',  // ✅ Use global batch
//             grnQty: {
//               uom1_qty: 0,
//               uom2_qty: 0,
//               uom3_qty: 0,
//               sale_unit: item.orderQty?.sale_unit ? parseInt(item.orderQty.sale_unit) : 3,
//               Uom_Id: 0
//             }
//           })
//         }
//       })
      
//       return newMap
//     })
//   }, [itemIds, globalBatch])  // ✅ Re-run when globalBatch changes

//   const rows = useMemo(() => {
//     return items.map(item => rowsData.get(item.id)).filter(Boolean)
//   }, [items, rowsData])

//   useEffect(() => {
//     if (rowsData.size === 0) return
    
//     // ✅ Apply global batch to all rows when sending to parent
//     const rowsArray = Array.from(rowsData.values()).map(row => ({
//       ...row,
//       batchNumber: globalBatch || row.batchNumber
//     }))
    
//     onChangeRef.current(rowsArray)
//   }, [rowsData, globalBatch])

//   const handleUomChange = useCallback((itemId: number, uomData: any) => {
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       const existing = newMap.get(itemId)
      
//       if (existing) {
//         newMap.set(itemId, {
//           ...existing,
//           grnQty: uomData
//         })
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
//     if (!orderQty) return <span className="text-gray-400">N/A</span>

//     const saleUnit = String(orderQty.sale_unit)

//     if (saleUnit === '3' && uomStructure.tertiary) {
//       return `${orderQty.uom3_qty} ${uomStructure.tertiary.name}`
//     }
//     if (saleUnit === '2' && uomStructure.secondary) {
//       return `${orderQty.uom2_qty} ${uomStructure.secondary.name}`
//     }
//     return `${orderQty.uom1_qty} ${uomStructure.primary.name}`
//   }

//   if (rows.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500 border rounded-lg">
//         No items selected. Click "Add / Remove Items" to start.
//       </div>
//     )
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border rounded-lg">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-3 py-3 text-left text-sm font-medium">Item</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Order Qty</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">GRN Qty</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Batch</th>
//             <th className="px-3 py-3 text-right text-sm font-medium">Price</th>
//             <th className="px-3 py-3 text-right text-sm font-medium">Total</th>
//             <th className="px-3 py-3 w-10"></th>
//           </tr>
//         </thead>
//         <tbody className="divide-y">
//           {rows.map((row, index) => (
//             <tr key={row.Item_ID} className="hover:bg-gray-50">
//               <td className="px-3 py-3">
//                 <div className="font-medium">{row.itemName}</div>
//                 <div className="text-xs text-gray-500">ID: {row.Item_ID}</div>
//               </td>

//               <td className="px-3 py-3">
//                 <span className="text-blue-600 font-medium">
//                   {formatOrderQty(row)}
//                 </span>
//               </td>

//               <td className="px-3 py-3">
//                 <UomConverter
//                   key={`uom-${row.Item_ID}`}
//                   uomData={row.uomStructure}
//                   lineIndex={index}
//                   itemId={row.Item_ID}
//                   onChange={(data) => handleUomChange(row.Item_ID, data)}
//                   initialValues={row.orderQty || undefined}
//                 />
//               </td>

//               {/* ✅ Batch Column - Shows Global Batch (Read-Only) */}
//               <td className="px-3 py-3">
//                 <div className="flex items-center gap-2 px-2 py-1.5 bg-green-50 border border-green-200 rounded text-sm">
//                   <Tag className="w-3.5 h-3.5 text-green-600" />
//                   <span className="text-green-800 font-medium truncate max-w-[120px]" title={globalBatch}>
//                     {globalBatch || <span className="text-gray-400 italic">Select supplier</span>}
//                   </span>
//                 </div>
//               </td>

//               <td className="px-3 py-3 text-right">
//                 {row.unitPrice.toFixed(2)}
//               </td>

//               <td className="px-3 py-3 text-right font-medium">
//                 {(row.grnQty.uom1_qty * row.unitPrice).toFixed(2)}
//               </td>

//               <td className="px-3 py-3">
//                 <button
//                   onClick={() => handleDelete(row.Item_ID)}
//                   className="text-red-500 hover:bg-red-50 rounded p-1"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//         <tfoot className="bg-gray-50">
//           <tr>
//             <td colSpan={5} className="px-3 py-3 text-right font-semibold">
//               Grand Total:
//             </td>
//             <td className="px-3 py-3 text-right font-bold text-lg">
//               {rows.reduce((sum, row) => sum + (row.grnQty.uom1_qty * row.unitPrice), 0).toFixed(2)}
//             </td>
//             <td></td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   )
// }































































// working 3.0 means perfect working 

// 'use client'
// import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
// import { Trash2, Tag, Package } from 'lucide-react'
// import UomConverter from './UomConverter'

// interface Props {
//   items: any[]
//   onChange: (data: any[]) => void
//   onDelete: (itemId: number) => void
//   globalBatch?: number | null
//   globalBatchName?: string
// }

// export default function Stk_details_data({ 
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

//   // Stable item IDs for comparison
//   const itemIds = useMemo(() => items.map(i => i.id).sort().join(','), [items])

//   // =====================================================
//   // INITIALIZE ROWS when items change
//   // =====================================================
//   useEffect(() => {
//     console.log('═══════════════════════════════════════════════════')
//     console.log('📋 STK_DETAILS_DATA: Initializing rows')
    
//     setRowsData(prev => {
//       const newMap = new Map()
      
//       items.forEach((item, idx) => {
//         const existing = prev.get(item.id)
        
//         if (existing) {
//           // Preserve existing data but update batch
//           newMap.set(item.id, {
//             ...existing,
//             batchNumber: globalBatch
//           })
//           console.log(`  - Item ${item.id}: PRESERVED existing data`)
//         } else {
//           // Initialize new item
//           const defaultSaleUnit = item.orderQty?.sale_unit 
//             ? parseInt(item.orderQty.sale_unit) 
//             : (item.uomStructure.tertiary ? 3 : item.uomStructure.secondary ? 2 : 1)
          
//           newMap.set(item.id, {
//             lineIndex: idx,
//             Item_ID: item.id,
//             itemName: item.itemName,
//             unitPrice: item.purchasePrice || item.sellingPrice || 0,
//             uomStructure: item.uomStructure,
//             orderQty: item.orderQty,
//             isOrderItem: item.isOrderItem,
//             batchNumber: globalBatch,
//             grnQty: {
//               uom1_qty: 0,
//               uom2_qty: 0,
//               uom3_qty: 0,
//               sale_unit: defaultSaleUnit,
//               Uom_Id: 0
//             }
//           })
//           console.log(`  - Item ${item.id}: INITIALIZED new`)
//         }
//       })
      
//       console.log('  - Total rows:', newMap.size)
//       console.log('═══════════════════════════════════════════════════')
//       return newMap
//     })
//   }, [itemIds, globalBatch])

//   // Convert Map to array for rendering
//   const rows = useMemo(() => {
//     return items.map(item => rowsData.get(item.id)).filter(Boolean)
//   }, [items, rowsData])

//   // Send data to parent when rows change
//   useEffect(() => {
//     if (rowsData.size === 0) return
    
//     const rowsArray = Array.from(rowsData.values()).map(row => ({
//       ...row,
//       batchNumber: globalBatch
//     }))
    
//     console.log('📤 Sending to parent:', rowsArray.length, 'items')
//     onChangeRef.current(rowsArray)
//   }, [rowsData, globalBatch])

//   // =====================================================
//   // HANDLE UOM CHANGE from UomConverter
//   // =====================================================
//   const handleUomChange = useCallback((itemId: number, uomData: any) => {
//     console.log(`🔄 UOM Change for item ${itemId}:`, uomData)
    
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       const existing = newMap.get(itemId)
      
//       if (existing) {
//         newMap.set(itemId, {
//           ...existing,
//           grnQty: uomData
//         })
//       }
      
//       return newMap
//     })
//   }, [])

//   // =====================================================
//   // HANDLE DELETE
//   // =====================================================
//   const handleDelete = useCallback((itemId: number) => {
//     console.log('🗑️ Deleting from table:', itemId)
//     setRowsData(prev => {
//       const newMap = new Map(prev)
//       newMap.delete(itemId)
//       return newMap
//     })
//     onDelete(itemId)
//   }, [onDelete])

//   // Format order quantity for display
//   const formatOrderQty = (row: any) => {
//     const { orderQty, uomStructure } = row
//     if (!orderQty) return <span className="text-gray-400 italic">N/A (new)</span>

//     const saleUnit = String(orderQty.sale_unit)

//     if (saleUnit === '3' && uomStructure.tertiary) {
//       return `${orderQty.uom3_qty} ${uomStructure.tertiary.name}`
//     }
//     if (saleUnit === '2' && uomStructure.secondary) {
//       return `${orderQty.uom2_qty} ${uomStructure.secondary.name}`
//     }
//     return `${orderQty.uom1_qty} ${uomStructure.primary.name}`
//   }

//   // =====================================================
//   // EMPTY STATE
//   // =====================================================
//   if (rows.length === 0) {
//     return (
//       <div className="text-center py-12 border rounded-lg bg-gray-50">
//         <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
//         <p className="text-gray-500">No items selected</p>
//         <p className="text-sm text-gray-400">Click "Add / Remove Items" to start</p>
//       </div>
//     )
//   }

//   // =====================================================
//   // RENDER TABLE
//   // =====================================================
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border rounded-lg">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-3 py-3 text-left text-sm font-medium">#</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Item</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Order Qty</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">GRN Qty (Enter Here)</th>
//             <th className="px-3 py-3 text-left text-sm font-medium">Batch</th>
//             <th className="px-3 py-3 text-right text-sm font-medium">Price</th>
//             <th className="px-3 py-3 text-right text-sm font-medium">Total</th>
//             <th className="px-3 py-3 w-10"></th>
//           </tr>
//         </thead>
//         <tbody className="divide-y">
//           {rows.map((row, index) => (
//             <tr key={row.Item_ID} className={`hover:bg-gray-50 ${!row.isOrderItem ? 'bg-blue-50' : ''}`}>
//               {/* Line Number */}
//               <td className="px-3 py-3 text-gray-500">
//                 {index + 1}
//               </td>

//               {/* Item Info */}
//               <td className="px-3 py-3">
//                 <div className="font-medium">{row.itemName}</div>
//                 <div className="text-xs text-gray-500">
//                   ID: {row.Item_ID}
//                   {!row.isOrderItem && (
//                     <span className="ml-2 px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded text-[10px]">
//                       ADDED
//                     </span>
//                   )}
//                 </div>
//               </td>

//               {/* Order Quantity (Read-only) */}
//               <td className="px-3 py-3">
//                 <span className="text-blue-600 font-medium">
//                   {formatOrderQty(row)}
//                 </span>
//               </td>

//               {/* GRN Quantity (UomConverter) */}
//               <td className="px-3 py-3">
//                 <UomConverter
//                   key={`uom-${row.Item_ID}`}
//                   uomData={row.uomStructure}
//                   lineIndex={index}
//                   itemId={row.Item_ID}
//                   onChange={(data) => handleUomChange(row.Item_ID, data)}
//                   initialValues={row.orderQty || undefined}
//                 />
//               </td>

//               {/* Batch */}
//               <td className="px-3 py-3">
//                 <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded text-sm">
//                   <Tag className="w-3 h-3 text-green-600" />
//                   <span className="font-bold text-green-800">{globalBatch || '-'}</span>
//                 </div>
//               </td>

//               {/* Price */}
//               <td className="px-3 py-3 text-right">
//                 {row.unitPrice?.toFixed(2) || '0.00'}
//               </td>

//               {/* Total */}
//               <td className="px-3 py-3 text-right font-medium">
//                 {((row.grnQty?.uom1_qty || 0) * (row.unitPrice || 0)).toFixed(2)}
//               </td>

//               {/* Delete */}
//               <td className="px-3 py-3">
//                 <button
//                   onClick={() => handleDelete(row.Item_ID)}
//                   className="text-red-500 hover:bg-red-50 rounded p-1"
//                   title="Remove item"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>

//         {/* Footer */}
//         <tfoot className="bg-gray-100">
//           <tr>
//             <td colSpan={6} className="px-3 py-3 text-right font-semibold">
//               Grand Total:
//             </td>
//             <td className="px-3 py-3 text-right font-bold text-lg text-green-700">
//               {rows.reduce((sum, row) => sum + ((row.grnQty?.uom1_qty || 0) * (row.unitPrice || 0)), 0).toFixed(2)}
//             </td>
//             <td></td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   )
// }





















































































// components/grn/Stk_details_data.tsx

'use client'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Trash2, Package, Tag, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import UomConverter from './UomConverter'

interface Props {
  items: any[]
  onChange: (data: any[]) => void
  onDelete: (itemId: number) => void
  globalBatch?: number | null
  globalBatchName?: string
}

export default function Stk_details_data({ 
  items, 
  onChange, 
  onDelete, 
  globalBatch,
  globalBatchName 
}: Props) {
  const [rowsData, setRowsData] = useState<Map<number, any>>(new Map())
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const itemIds = useMemo(() => items.map(i => i.id).sort().join(','), [items])

  // Initialize/Update rows
  useEffect(() => {
    setRowsData(prev => {
      const newMap = new Map()

      items.forEach((item, idx) => {
        const existing = prev.get(item.id)

        if (existing) {
          newMap.set(item.id, {
            ...existing,
            batchNumber: globalBatch
          })
        } else {
          const defaultSaleUnit = item.orderQty?.sale_unit
            ? parseInt(item.orderQty.sale_unit)
            : (item.uomStructure.tertiary ? 3 : item.uomStructure.secondary ? 2 : 1)

          newMap.set(item.id, {
            lineIndex: idx,
            Item_ID: item.id,
            itemName: item.itemName,
            unitPrice: item.purchasePrice || item.sellingPrice || 0,
            uomStructure: item.uomStructure,
            orderQty: item.orderQty,
            isOrderItem: item.isOrderItem,
            batchNumber: globalBatch,
            grnQty: {
              uom1_qty: 0,
              uom2_qty: 0,
              uom3_qty: 0,
              sale_unit: defaultSaleUnit,
              Uom_Id: 0
            }
          })
        }
      })

      return newMap
    })
  }, [itemIds, globalBatch])

  const rows = useMemo(() => {
    return items.map(item => rowsData.get(item.id)).filter(Boolean)
  }, [items, rowsData])

  // Notify parent
  useEffect(() => {
    if (rowsData.size === 0) return
    const rowsArray = Array.from(rowsData.values()).map(row => ({
      ...row,
      batchNumber: globalBatch
    }))
    onChangeRef.current(rowsArray)
  }, [rowsData, globalBatch])

  const handleUomChange = useCallback((itemId: number, uomData: any) => {
    setRowsData(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(itemId)
      if (existing) {
        newMap.set(itemId, { ...existing, grnQty: uomData })
      }
      return newMap
    })
  }, [])

  const handlePriceChange = useCallback((itemId: number, price: string) => {
    setRowsData(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(itemId)
      if (existing) {
        newMap.set(itemId, { ...existing, unitPrice: parseFloat(price) || 0 })
      }
      return newMap
    })
  }, [])

  const handleDelete = useCallback((itemId: number) => {
    setRowsData(prev => {
      const newMap = new Map(prev)
      newMap.delete(itemId)
      return newMap
    })
    onDelete(itemId)
  }, [onDelete])

  const formatOrderQty = (row: any) => {
    const { orderQty, uomStructure } = row
    if (!orderQty) return <span className="text-gray-400 italic text-xs">N/A</span>

    const saleUnit = String(orderQty.sale_unit)
    if (saleUnit === '3' && uomStructure.tertiary) {
      return `${orderQty.uom3_qty} ${uomStructure.tertiary.name}`
    }
    if (saleUnit === '2' && uomStructure.secondary) {
      return `${orderQty.uom2_qty} ${uomStructure.secondary.name}`
    }
    return `${orderQty.uom1_qty} ${uomStructure.primary.name}`
  }

  const grandTotal = useMemo(() => {
    return rows.reduce((sum, row) => sum + ((row.grnQty?.uom1_qty || 0) * (row.unitPrice || 0)), 0)
  }, [rows])

  // Empty state
  if (rows.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-1">No Items Selected</h3>
        <p className="text-sm text-gray-400">Click "Add Items" to start adding products</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Qty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GRN Qty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
              {/* <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th> */}
              {/* <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th> */}
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr 
                key={row.Item_ID} 
                className={`hover:bg-gray-50/50 transition-colors ${!row.isOrderItem ? 'bg-blue-50/30' : ''}`}
              >
                {/* Line # */}
                <td className="px-4 py-4 text-sm text-gray-500 font-medium">
                  {index + 1}
                </td>

                {/* Item */}
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{row.itemName}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>ID: {row.Item_ID}</span>
                    {!row.isOrderItem && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                        ADDED
                      </span>
                    )}
                  </div>
                </td>

                {/* Order Qty */}
                <td className="px-4 py-4">
                  <span className="text-[#4c96dc] font-medium">
                    {formatOrderQty(row)}
                  </span>
                </td>

                {/* GRN Qty - UomConverter */}
                <td className="px-4 py-4">
                  <UomConverter
                    key={`uom-${row.Item_ID}`}
                    uomData={row.uomStructure}
                    lineIndex={index}
                    itemId={row.Item_ID}
                    onChange={(data) => handleUomChange(row.Item_ID, data)}
                    initialValues={row.orderQty || undefined}
                  />
                </td>

                {/* Batch */}
                <td className="px-4 py-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <Tag className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-800 font-semibold">{globalBatch || '-'}</span>
                  </div>
                </td>

                {/* Price */}
                {/* <td className="px-4 py-4 text-right">
                  <input
                    type="number"
                    value={row.unitPrice || ''}
                    onChange={(e) => handlePriceChange(row.Item_ID, e.target.value)}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-right text-sm focus:ring-2 focus:ring-[#4c96dc] focus:border-[#4c96dc]"
                    placeholder="0.00"
                  />
                </td> */}

                {/* Total */}
                {/* <td className="px-4 py-4 text-right">
                  <span className="font-semibold text-gray-900">
                    {((row.grnQty?.uom1_qty || 0) * (row.unitPrice || 0)).toLocaleString()}
                  </span>
                </td> */}

                {/* Delete */}
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleDelete(row.Item_ID)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* <tfoot>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
              <td colSpan={6} className="px-4 py-4 text-right">
                <span className="text-gray-600 font-semibold">Grand Total: {grandTotal.toLocaleString()}</span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-2xl font-bold text-emerald-600">
                 
                </span>
              </td>
              <td></td>
            </tr>
          </tfoot> */}
        </table>
      </div>
    </div>
  )
}
