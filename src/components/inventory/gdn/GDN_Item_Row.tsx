// // components/gdn/GDN_Item_Row.tsx - WITH DEBUGGING
// 'use client'
// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { Plus, Minus, AlertTriangle, CheckCircle, Loader2, Package } from 'lucide-react'
// import { useLazyGetAvailableBatchesQuery, useLazyGetAvailableBatchesForEditQuery } from '@/store/slice/gdnApi'
// import UomConverter from '@/components/inventoryy/testing/UomConverter'

// interface Props {
//   row: any
//   rowIndex: number
//   totalRows: number
//   mode: 'create' | 'edit'
//   dispatchId?: number
//   onUpdate: (updatedRow: any) => void
//   onAddSplit: (remainingQty: number) => void
//   onRemove: () => void
// }

// export default function GDN_Item_Row({
//   row,
//   rowIndex,
//   totalRows,
//   mode,
//   dispatchId,
//   onUpdate,
//   onAddSplit,
//   onRemove
// }: Props) {
//   const [selectedBatch, setSelectedBatch] = useState<number | null>(row.batchno)
//   const [availableBatches, setAvailableBatches] = useState<any[]>([])
//   const [batchQty, setBatchQty] = useState<number>(row.selectedBatchQty || 0)
//   const [dispatchQty, setDispatchQty] = useState(row.dispatchQty)
//   const [unitPrice, setUnitPrice] = useState(row.unitPrice || 0)
//   const [isLoadingBatches, setIsLoadingBatches] = useState(false)
//   const [batchError, setBatchError] = useState<string | null>(null)

//   // API hooks
//   const [fetchBatches, { isLoading: isLoadingCreate }] = useLazyGetAvailableBatchesQuery()
//   const [fetchBatchesForEdit, { isLoading: isLoadingEdit }] = useLazyGetAvailableBatchesForEditQuery()

//   // ✅ Fetch available batches - WITH FULL DEBUG
//   useEffect(() => {
//     const loadBatches = async () => {
//       if (!row.Item_ID) {
//         console.log('❌ No Item_ID, skipping batch fetch')
//         return
//       }

//       console.log('═══════════════════════════════════════════════════')
//       console.log(`🚀 STARTING BATCH FETCH for Item ${row.Item_ID}`)
//       console.log(`   Mode: ${mode}`)
//       console.log(`   DispatchId: ${dispatchId}`)
//       console.log('═══════════════════════════════════════════════════')

//       setIsLoadingBatches(true)
//       setBatchError(null)

//       try {
//         let result

//         if (mode === 'edit' && dispatchId) {
//           console.log(`📡 Calling EDIT API: /dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`)
//           result = await fetchBatchesForEdit({ itemId: row.Item_ID, dispatchId }).unwrap()
//         } else {
//           console.log(`📡 Calling CREATE API: /dispatch/available-batches/${row.Item_ID}`)
//           result = await fetchBatches(row.Item_ID).unwrap()
//         }

//         console.log('📥 RAW API Response:', result)
//         console.log('📥 Response type:', typeof result)
//         console.log('📥 Response keys:', result ? Object.keys(result) : 'null')

//         const batches = result?.data || []

//         console.log('📦 Extracted batches:', batches)
//         console.log('📦 Batches length:', batches.length)

//         if (batches.length > 0) {
//           console.log('✅ SUCCESS! Found batches:')
//           batches.forEach((b: any, i: number) => {
//             console.log(`   [${i}] Batch #${b.batchno}: ${b.available_qty_uom1} available`)
//           })
//         } else {
//           console.log('⚠️ WARNING: No batches returned')
//         }

//         setAvailableBatches(batches)

//       } catch (error: any) {
//         console.log('═══════════════════════════════════════════════════')
//         console.log('❌ BATCH FETCH ERROR!')
//         console.log('Error object:', error)
//         console.log('Error status:', error?.status)
//         console.log('Error data:', error?.data)
//         console.log('Error message:', error?.message)
//         console.log('═══════════════════════════════════════════════════')

//         setBatchError(error?.data?.error || error?.message || 'Failed to load batches')
//         setAvailableBatches([])
//       } finally {
//         setIsLoadingBatches(false)
//       }
//     }

//     loadBatches()
//   }, [row.Item_ID, mode, dispatchId])  // ✅ Removed fetchBatches from deps



//   // Add this INSIDE GDN_Item_Row component, right before the return statement

//   // ✅ DIRECT FETCH TEST - Bypasses RTK Query
//   const testDirectFetch = async () => {
//     const url = `http://localhost:4000/api/dispatch/available-batches/${row.Item_ID}`
//     console.log('🧪 Testing direct fetch to:', url)

//     try {
//       const response = await fetch(url)
//       console.log('🧪 Response status:', response.status)
//       console.log('🧪 Response ok:', response.ok)

//       const data = await response.json()
//       console.log('🧪 Direct fetch result:', data)

//       if (data?.data?.length > 0) {
//         alert(`✅ SUCCESS! Found ${data.data.length} batch(es):\n${JSON.stringify(data.data[0], null, 2)}`)
//         // Set the batches directly
//         setAvailableBatches(data.data)
//       } else {
//         alert('⚠️ API returned empty data')
//       }
//     } catch (err: any) {
//       console.error('🧪 Direct fetch error:', err)
//       alert('❌ Error: ' + err.message)
//     }
//   }





//   // Handle batch selection
//   const handleBatchSelect = useCallback((batchno: number) => {
//     const batch = availableBatches.find(b => b.batchno === batchno)
//     const availableQty = batch?.available_qty_uom1 || 0

//     console.log(`🎯 Selected Batch ${batchno} with ${availableQty} available`)

//     setSelectedBatch(batchno)
//     setBatchQty(availableQty)

//     onUpdate({
//       ...row,
//       batchno,
//       selectedBatchQty: availableQty,
//       dispatchQty,
//       unitPrice
//     })
//   }, [availableBatches, row, dispatchQty, unitPrice, onUpdate])

//   // Handle UOM change
//   const handleUomChange = useCallback((uomData: any) => {
//     setDispatchQty(uomData)

//     onUpdate({
//       ...row,
//       batchno: selectedBatch,
//       selectedBatchQty: batchQty,
//       dispatchQty: uomData,
//       unitPrice
//     })
//   }, [row, selectedBatch, batchQty, unitPrice, onUpdate])

//   // Handle price change
//   const handlePriceChange = useCallback((price: string) => {
//     const priceNum = parseFloat(price) || 0
//     setUnitPrice(priceNum)

//     onUpdate({
//       ...row,
//       batchno: selectedBatch,
//       selectedBatchQty: batchQty,
//       dispatchQty,
//       unitPrice: priceNum
//     })
//   }, [row, selectedBatch, batchQty, dispatchQty, onUpdate])

//   // Calculations
//   const remainingQty = useMemo(() => {
//     return Math.max(0, batchQty - (dispatchQty.uom1_qty || 0))
//   }, [batchQty, dispatchQty])

//   const isOverDispatch = selectedBatch && dispatchQty.uom1_qty > batchQty && batchQty > 0
//   const canAddSplit = selectedBatch && dispatchQty.uom1_qty > 0 && remainingQty > 0
//   const rowTotal = (dispatchQty.uom1_qty || 0) * unitPrice
//   const batchesWithStock = availableBatches.filter(b => b.available_qty_uom1 > 0)

//   return (
//     <div className={`p-4 ${row.isSplitRow ? 'bg-teal-50/50' : 'bg-white'}`}>
//       <div className="grid grid-cols-12 gap-4 items-start">

//         {/* Row Indicator */}
//         <div className="col-span-1 flex flex-col items-center">
//           <span className="text-xs text-gray-400 mb-1">Row</span>
//           <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${row.isSplitRow ? 'bg-teal-100 text-teal-700' : 'bg-emerald-100 text-emerald-700'
//             }`}>
//             {rowIndex + 1}
//           </span>
//         </div>
//         {/* Add this after the batch buttons, inside col-span-3 div */}
//         <button
//           onClick={testDirectFetch}
//           className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"
//         >
//           🧪 Test Direct Fetch
//         </button>

//         {/* Batch Selection */}
//         <div className="col-span-3">
//           <label className="text-xs text-gray-500 mb-1 block font-medium">
//             Select Batch <span className="text-red-500">*</span>
//           </label>

//           {isLoadingBatches ? (
//             <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Loading batches for Item {row.Item_ID}...
//             </div>
//           ) : batchError ? (
//             <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
//               <AlertTriangle className="w-4 h-4 inline mr-1" />
//               {batchError}
//             </div>
//           ) : availableBatches.length === 0 ? (
//             <div className="text-orange-600 text-sm bg-orange-50 px-3 py-2 rounded-lg">
//               <Package className="w-4 h-4 inline mr-1" />
//               No stock available (0 batches found)
//             </div>
//           ) : batchesWithStock.length === 0 ? (
//             <div className="text-orange-600 text-sm bg-orange-50 px-3 py-2 rounded-lg">
//               <Package className="w-4 h-4 inline mr-1" />
//               All batches depleted (0 qty available)
//             </div>
//           ) : (
//             <div className="flex flex-wrap gap-2">
//               {batchesWithStock.map(batch => {
//                 const isSelected = selectedBatch === batch.batchno
//                 return (
//                   <button
//                     key={batch.batchno}
//                     type="button"
//                     onClick={() => handleBatchSelect(batch.batchno)}
//                     className={`
//                       px-3 py-2 rounded-lg border text-sm transition-all min-w-[100px]
//                       ${isSelected
//                         ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500'
//                         : 'border-gray-200 hover:border-emerald-300 bg-white'
//                       }
//                     `}
//                   >
//                     <div className="flex flex-col items-start">
//                       <div className="flex items-center gap-1">
//                         <span className="font-bold">#{batch.batchno}</span>
//                         {isSelected && <CheckCircle className="w-3 h-3 text-emerald-600" />}
//                       </div>
//                       <span className="text-xs text-green-600 font-medium">
//                         Avl: {batch.available_qty_uom1?.toLocaleString()}
//                       </span>
//                     </div>
//                   </button>
//                 )
//               })}
//             </div>
//           )}

//           {/* Debug Info */}
//           <div className="mt-2 text-[10px] text-gray-400">
//             Debug: {availableBatches.length} batches, {batchesWithStock.length} with stock
//           </div>
//         </div>

//         {/* Available Qty */}
//         <div className="col-span-2">
//           <label className="text-xs text-gray-500 mb-1 block">Available</label>
//           <div className={`text-xl font-bold ${batchQty > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
//             {batchQty.toLocaleString()}
//           </div>
//           <span className="text-xs text-gray-400">{row.uomStructure?.primary?.name || 'Pcs'}</span>
//         </div>

//         {/* Dispatch Qty */}
//         <div className="col-span-3">
//           <label className="text-xs text-gray-500 mb-1 block">Dispatch Qty</label>
//           <UomConverter
//             uomData={row.uomStructure}
//             lineIndex={rowIndex}
//             itemId={row.Item_ID}
//             onChange={handleUomChange}
//             initialValues={row.orderQty || undefined}
//           />
//           {isOverDispatch && (
//             <div className="text-red-600 text-xs flex items-center gap-1 mt-1">
//               <AlertTriangle className="w-3 h-3" />
//               Exceeds available!
//             </div>
//           )}
//         </div>

//         {/* Price */}
//         <div className="col-span-2">
//           <label className="text-xs text-gray-500 mb-1 block">Price</label>
//           <input
//             type="number"
//             value={unitPrice || ''}
//             onChange={(e) => handlePriceChange(e.target.value)}
//             className="w-full border rounded-lg px-2 py-1.5 text-right text-sm"
//           />
//           <div className="text-right mt-1">
//             <span className="text-xs text-gray-400">Total: </span>
//             <span className="font-bold text-emerald-700">{rowTotal.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="col-span-1 flex flex-col gap-2 items-center pt-5">
//           {canAddSplit && (
//             <button onClick={() => onAddSplit(remainingQty)} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
//               <Plus className="w-4 h-4" />
//             </button>
//           )}
//           {row.isSplitRow && totalRows > 1 && (
//             <button onClick={onRemove} className="p-2 bg-red-100 text-red-600 rounded-lg">
//               <Minus className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Status Bar */}
//       {selectedBatch && (
//         <div className="mt-3 pt-3 border-t flex items-center gap-4 text-xs">
//           <span className="px-2 py-1 bg-gray-100 rounded">Batch: #{selectedBatch}</span>
//           <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">Avl: {batchQty}</span>
//           <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Dispatch: {dispatchQty.uom1_qty || 0}</span>
//           <span className={`px-2 py-1 rounded ${remainingQty > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
//             Left: {remainingQty}
//           </span>
//         </div>
//       )}
//     </div>
//   )
// }


























































//working god but no batch button
// components/gdn/GDN_Item_Row.tsx - USING NATIVE FETCH (WORKING)

// 'use client'
// import { useState, useEffect, useCallback, useMemo } from 'react'
// import { Plus, Minus, AlertTriangle, CheckCircle, Loader2, Package } from 'lucide-react'
// import UomConverter from '@/components/inventoryy/testing/UomConverter'

// interface Props {
//   row: any
//   rowIndex: number
//   totalRows: number
//   mode: 'create' | 'edit'
//   dispatchId?: number
//   onUpdate: (updatedRow: any) => void
//   onAddSplit: (remainingQty: number) => void
//   onRemove: () => void
// }

// // ✅ API Base URL helper
// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     return `http://${window.location.hostname}:4000/api`
//   }
//   return 'http://localhost:4000/api'
// }

// export default function GDN_Item_Row({
//   row,
//   rowIndex,
//   totalRows,
//   mode,
//   dispatchId,
//   onUpdate,
//   onAddSplit,
//   onRemove
// }: Props) {
//   const [selectedBatch, setSelectedBatch] = useState<number | null>(row.batchno)
//   const [availableBatches, setAvailableBatches] = useState<any[]>([])
//   const [batchQty, setBatchQty] = useState<number>(row.selectedBatchQty || 0)
//   const [dispatchQty, setDispatchQty] = useState(row.dispatchQty)
//   const [unitPrice, setUnitPrice] = useState(row.unitPrice || 0)
//   const [isLoadingBatches, setIsLoadingBatches] = useState(false)
//   const [batchError, setBatchError] = useState<string | null>(null)

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ FETCH BATCHES USING NATIVE FETCH (WORKING!)
//   // ═══════════════════════════════════════════════════════════════
//   useEffect(() => {
//     const fetchBatches = async () => {
//       if (!row.Item_ID) return

//       console.log('═══════════════════════════════════════════════════')
//       console.log(`🚀 Fetching batches for Item ${row.Item_ID}`)
//       console.log(`   Mode: ${mode}, DispatchId: ${dispatchId}`)
//       console.log('═══════════════════════════════════════════════════')

//       setIsLoadingBatches(true)
//       setBatchError(null)

//       try {
//         // ✅ Build URL based on mode
//         const baseUrl = getApiBaseUrl()
//         let url: string

//         if (mode === 'edit' && dispatchId) {
//           url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`
//         } else {
//           url = `${baseUrl}/dispatch/available-batches/${row.Item_ID}`
//         }

//         console.log('📡 Fetching:', url)

//         const response = await fetch(url)

//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//         }

//         const result = await response.json()
//         console.log('📥 API Response:', result)

//         if (result.success && Array.isArray(result.data)) {
//           console.log(`✅ Found ${result.data.length} batch(es)`)
//           setAvailableBatches(result.data)

//           // Show what we found
//           result.data.forEach((b: any, i: number) => {
//             console.log(`   [${i}] Batch #${b.batchno}: ${b.available_qty_uom1} available`)
//           })
//         } else {
//           console.log('⚠️ No batches in response')
//           setAvailableBatches([])
//         }

//       } catch (error: any) {
//         console.error('❌ Fetch error:', error)
//         setBatchError(error.message || 'Failed to load batches')
//         setAvailableBatches([])
//       } finally {
//         setIsLoadingBatches(false)
//       }
//     }

//     fetchBatches()
//   }, [row.Item_ID, mode, dispatchId])

//   // ═══════════════════════════════════════════════════════════════
//   // HANDLERS
//   // ═══════════════════════════════════════════════════════════════

//   // Handle batch selection
//   const handleBatchSelect = useCallback((batchno: number) => {
//     const batch = availableBatches.find(b => b.batchno === batchno)
//     const availableQty = batch?.available_qty_uom1 || 0

//     console.log(`🎯 Selected Batch #${batchno} with ${availableQty} available`)

//     setSelectedBatch(batchno)
//     setBatchQty(availableQty)

//     onUpdate({
//       ...row,
//       batchno,
//       selectedBatchQty: availableQty,
//       dispatchQty,
//       unitPrice
//     })
//   }, [availableBatches, row, dispatchQty, unitPrice, onUpdate])

//   // Handle UOM change
//   const handleUomChange = useCallback((uomData: any) => {
//     setDispatchQty(uomData)

//     onUpdate({
//       ...row,
//       batchno: selectedBatch,
//       selectedBatchQty: batchQty,
//       dispatchQty: uomData,
//       unitPrice
//     })
//   }, [row, selectedBatch, batchQty, unitPrice, onUpdate])

//   // Handle price change
//   const handlePriceChange = useCallback((price: string) => {
//     const priceNum = parseFloat(price) || 0
//     setUnitPrice(priceNum)

//     onUpdate({
//       ...row,
//       batchno: selectedBatch,
//       selectedBatchQty: batchQty,
//       dispatchQty,
//       unitPrice: priceNum
//     })
//   }, [row, selectedBatch, batchQty, dispatchQty, onUpdate])

//   // ═══════════════════════════════════════════════════════════════
//   // CALCULATIONS
//   // ═══════════════════════════════════════════════════════════════

//   const remainingQty = useMemo(() => {
//     return Math.max(0, batchQty - (dispatchQty.uom1_qty || 0))
//   }, [batchQty, dispatchQty])

//   const isOverDispatch = selectedBatch && dispatchQty.uom1_qty > batchQty && batchQty > 0
//   const canAddSplit = selectedBatch && dispatchQty.uom1_qty > 0 && remainingQty > 0
//   const rowTotal = (dispatchQty.uom1_qty || 0) * unitPrice
//   const batchesWithStock = availableBatches.filter(b => b.available_qty_uom1 > 0)

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════

//   return (
//     <div className={`p-4 ${row.isSplitRow ? 'bg-teal-50/50' : 'bg-white'}`}>
//       <div className="grid grid-cols-12 gap-4 items-start">

//         {/* ══════════ Row Indicator ══════════ */}
//         <div className="col-span-1 flex flex-col items-center">
//           <span className="text-xs text-gray-400 mb-1">Row</span>
//           <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
//             row.isSplitRow ? 'bg-teal-100 text-teal-700' : 'bg-emerald-100 text-emerald-700'
//           }`}>
//             {rowIndex + 1}
//           </span>
//           {row.isSplitRow && (
//             <span className="text-[10px] text-teal-600 mt-1">Split</span>
//           )}
//         </div>

//         {/* ══════════ Batch Selection ══════════ */}
//         <div className="col-span-3">
//           <label className="text-xs text-gray-600 mb-1.5 block font-medium">
//             Select Batch <span className="text-red-500">*</span>
//           </label>

//           {isLoadingBatches ? (
//             <div className="flex items-center gap-2 text-emerald-600 text-sm py-3 bg-emerald-50 rounded-lg px-3">
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Loading batches...
//             </div>
//           ) : batchError ? (
//             <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
//               <AlertTriangle className="w-4 h-4 inline mr-1" />
//               {batchError}
//             </div>
//           ) : batchesWithStock.length === 0 ? (
//             <div className="text-orange-700 text-sm bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
//               <Package className="w-4 h-4 inline mr-1" />
//               No stock available for this item
//             </div>
//           ) : (
//             <div className="flex flex-wrap gap-2">
//               {batchesWithStock.map(batch => {
//                 const isSelected = selectedBatch === batch.batchno

//                 return (
//                   <button
//                     key={batch.batchno}
//                     type="button"
//                     onClick={() => handleBatchSelect(batch.batchno)}
//                     className={`
//                       px-3 py-2 rounded-lg border text-sm transition-all min-w-[110px]
//                       ${isSelected 
//                         ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 shadow-sm' 
//                         : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-emerald-50'
//                       }
//                     `}
//                   >
//                     <div className="flex flex-col items-start">
//                       <div className="flex items-center gap-1.5">
//                         <span className="font-bold text-gray-900">#{batch.batchno}</span>
//                         {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
//                       </div>
//                       <span className="text-xs text-green-600 font-semibold mt-0.5">
//                         {batch.available_qty_uom1?.toLocaleString()} avl
//                       </span>
//                     </div>
//                   </button>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* ══════════ Available Qty Display ══════════ */}
//         <div className="col-span-2">
//           <label className="text-xs text-gray-600 mb-1.5 block font-medium">Available Qty</label>
//           <div className={`text-2xl font-bold ${batchQty > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
//             {batchQty.toLocaleString()}
//           </div>
//           <span className="text-xs text-gray-500">{row.uomStructure?.primary?.name || 'Pcs'}</span>
//         </div>

//         {/* ══════════ Dispatch Qty (UomConverter) ══════════ */}
//         <div className="col-span-3">
//           <label className="text-xs text-gray-600 mb-1.5 block font-medium">Dispatch Qty</label>
//           <UomConverter
//             uomData={row.uomStructure}
//             lineIndex={rowIndex}
//             itemId={row.Item_ID}
//             onChange={handleUomChange}
//             initialValues={row.orderQty || undefined}
//           />
//           {isOverDispatch && (
//             <div className="text-red-600 text-xs flex items-center gap-1 mt-1.5 bg-red-50 px-2 py-1 rounded border border-red-200">
//               <AlertTriangle className="w-3 h-3" />
//               Exceeds available qty ({batchQty})!
//             </div>
//           )}
//         </div>

//         {/* ══════════ Price & Total ══════════ */}
//         <div className="col-span-2">
//           <label className="text-xs text-gray-600 mb-1.5 block font-medium">Unit Price</label>
//           <input
//             type="number"
//             value={unitPrice || ''}
//             onChange={(e) => handlePriceChange(e.target.value)}
//             className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-right text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             placeholder="0.00"
//           />
//           <div className="text-right mt-1.5">
//             <span className="text-xs text-gray-500">Total: </span>
//             <span className="font-bold text-emerald-700 text-sm">{rowTotal.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* ══════════ Actions (Split / Remove) ══════════ */}
//         <div className="col-span-1 flex flex-col gap-2 items-center pt-6">
//           {/* Add Split Button */}
//           {canAddSplit && (
//             <button 
//               onClick={() => onAddSplit(remainingQty)} 
//               className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"
//               title={`Add split row (${remainingQty.toLocaleString()} remaining)`}
//             >
//               <Plus className="w-4 h-4" />
//             </button>
//           )}

//           {/* Remove Split Row Button */}
//           {row.isSplitRow && totalRows > 1 && (
//             <button 
//               onClick={onRemove} 
//               className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
//               title="Remove this split row"
//             >
//               <Minus className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ══════════ Status Bar ══════════ */}
//       {selectedBatch && (
//         <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs flex-wrap">
//           <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
//             Batch: <strong>#{selectedBatch}</strong>
//           </span>
//           <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md font-medium">
//             Available: <strong>{batchQty.toLocaleString()}</strong>
//           </span>
//           <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
//             Dispatching: <strong>{(dispatchQty.uom1_qty || 0).toLocaleString()}</strong>
//           </span>
//           <span className={`px-2.5 py-1 rounded-md font-medium ${
//             remainingQty > 0 
//               ? 'bg-orange-100 text-orange-700' 
//               : 'bg-green-100 text-green-700'
//           }`}>
//             Remaining: <strong>{remainingQty.toLocaleString()}</strong>
//           </span>
//           {canAddSplit && (
//             <span className="text-emerald-600 flex items-center gap-1">
//               <Plus className="w-3 h-3" /> Click to split across batches
//             </span>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }



























































// components/gdn/GDN_Item_Row.tsx - COMPLETE WITH NATIVE FETCH

'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, AlertTriangle, CheckCircle, Loader2, Package } from 'lucide-react'
import UomConverter from '@/components/inventoryy/testing/UomConverter'

interface Props {
  row: any
  rowIndex: number
  totalRows: number
  mode: 'create' | 'edit'
  dispatchId?: number
  onUpdate: (updatedRow: any) => void
  onRemove: () => void
  showRemoveButton?: boolean
}

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:4000/api`
  }
  return 'http://localhost:4000/api'
}

export default function GDN_Item_Row({
  row,
  rowIndex,
  totalRows,
  mode,
  dispatchId,
  onUpdate,
  onRemove,
  showRemoveButton = false
}: Props) {
  const [selectedBatch, setSelectedBatch] = useState<number | null>(row.batchno)
  const [availableBatches, setAvailableBatches] = useState<any[]>([])
  const [batchQty, setBatchQty] = useState<number>(row.selectedBatchQty || 0)
  const [dispatchQty, setDispatchQty] = useState(row.dispatchQty)
  const [unitPrice, setUnitPrice] = useState(row.unitPrice || 0)
  const [isLoadingBatches, setIsLoadingBatches] = useState(false)
  const [batchError, setBatchError] = useState<string | null>(null)

  // ═══════════════════════════════════════════════════════════════
  // FETCH BATCHES USING NATIVE FETCH
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchBatches = async () => {
      if (!row.Item_ID) return

      setIsLoadingBatches(true)
      setBatchError(null)

      try {
        const baseUrl = getApiBaseUrl()
        let url: string

        if (mode === 'edit' && dispatchId) {
          url = `${baseUrl}/dispatch/available-batches-edit/${row.Item_ID}/${dispatchId}`
        } else {
          url = `${baseUrl}/dispatch/available-batches/${row.Item_ID}`
        }

        console.log(`📡 Fetching batches for Item ${row.Item_ID}:`, url)

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json()

        if (result.success && Array.isArray(result.data)) {
          console.log(`✅ Found ${result.data.length} batch(es) for Item ${row.Item_ID}`)
          setAvailableBatches(result.data)
        } else {
          setAvailableBatches([])
        }

      } catch (error: any) {
        console.error('❌ Batch fetch error:', error)
        setBatchError(error.message)
        setAvailableBatches([])
      } finally {
        setIsLoadingBatches(false)
      }
    }

    fetchBatches()
  }, [row.Item_ID, mode, dispatchId])

  // Handle batch selection
  const handleBatchSelect = useCallback((batchno: number) => {
    const batch = availableBatches.find(b => b.batchno === batchno)
    const availableQty = batch?.available_qty_uom1 || 0

    setSelectedBatch(batchno)
    setBatchQty(availableQty)

    onUpdate({
      ...row,
      batchno,
      selectedBatchQty: availableQty,
      dispatchQty,
      unitPrice
    })
  }, [availableBatches, row, dispatchQty, unitPrice, onUpdate])

  // Handle UOM change
  const handleUomChange = useCallback((uomData: any) => {
    setDispatchQty(uomData)

    onUpdate({
      ...row,
      batchno: selectedBatch,
      selectedBatchQty: batchQty,
      dispatchQty: uomData,
      unitPrice
    })
  }, [row, selectedBatch, batchQty, unitPrice, onUpdate])






  // Handle price change
  const handlePriceChange = useCallback((price: string) => {
    const priceNum = parseFloat(price) || 0
    setUnitPrice(priceNum)

    onUpdate({
      ...row,
      batchno: selectedBatch,
      selectedBatchQty: batchQty,
      dispatchQty,
      unitPrice: priceNum
    })
  }, [row, selectedBatch, batchQty, dispatchQty, onUpdate])

  // Calculations
  const isOverDispatch = selectedBatch && dispatchQty.uom1_qty > batchQty && batchQty > 0
  const rowTotal = (dispatchQty.uom1_qty || 0) * unitPrice
  const batchesWithStock = availableBatches.filter(b => b.available_qty_uom1 > 0)

  return (
    <div className={`p ${row.isDuplicateRow ? 'bg-teal' : 'bg-white'}`}>
      <div className="grid grid-cols-12 gap-4 items-start">

        {/* Row Indicator */}
        <div className="col-span-1 flex flex-col items-center">
          {/* <span className="text-xs text-gray-400 mb-1">Row</span> */}
          {/* <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${row.isDuplicateRow ? 'bg-teal-100 text-teal-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
            {rowIndex + 1}
          </span> */}
          {/* {row.isDuplicateRow && (
            <span className="text-[10px] text-teal-600 mt-1">Batch</span>
          )} */}
        </div>

        {/* Batch Selection */}
        <div className="col-span-4">
          {/* <label className="text-xs text-gray-600 mb-1.5 block font-medium">
            Select Batch <span className="text-red-500">*</span>
          </label> */}

          {isLoadingBatches ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm py-3 bg-emerald-50 rounded-lg px-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading batches...
            </div>
          ) : batchError ? (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              {batchError}
            </div>
          ) : batchesWithStock.length === 0 ? (
            <div className="text-orange-700 text-sm bg-orange-50 px-3 py-2 rounded-lg">
              <Package className="w-4 h-4 inline mr-1" />
              No stock available
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {batchesWithStock.map(batch => {
                const isSelected = selectedBatch === batch.batchno

                return (
                  <button
                    key={batch.batchno}
                    type="button"
                    onClick={() => handleBatchSelect(batch.batchno)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm transition-all min-w-[110px]
                      ${isSelected
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500'
                        : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }
                    `}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">#{batch.batchName}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      {/* <span className="text-xs text-green-600 font-semibold mt-0.5">
                        {batch.available_qty_uom1?.toLocaleString()} avl
                      </span> */}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Available Qty */}
        <div className="col-span-2">
          {/* <label className="text-xs text-gray-600 mb-1.5 block">Available</label> */}
          <div className={`text-lg font-semibold ${batchQty > 0 ? 'text-emerald-600' : 'text-gray-300'} flex items-baseline gap-1`}>
            <p >{batchQty.toLocaleString()}</p><span className="text-xs text-gray-500">{row.uomStructure?.primary?.name || 'Pcs'}</span>
          </div>
          {/* <span className="text-xs text-gray-500">{row.uomStructure?.primary?.name || 'Pcs'}</span> */}
        </div>

        {/* Dispatch Qty */}
        <div className="col-span-4">
          {/* <label className="text-xs text-gray-600 mb-1.5 block">Dispatch Qty</label> */}
          <UomConverter
            uomData={row.uomStructure}
            lineIndex={rowIndex}
            itemId={row.Item_ID}
            onChange={handleUomChange}
            initialValues={row.orderQty || undefined}
          />
          {isOverDispatch && (
            <div className="text-red-600 text-xs flex items-center gap-1 mt-1.5 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              Exceeds available!
            </div>
          )}
        </div>

        {/* Price */}
        {/* <div className="col-span-2">
          <label className="text-xs text-gray-600 mb-1.5 block">Price</label>
          <input
            type="number"
            value={unitPrice || ''}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-1.5 text-right text-sm focus:ring-2 focus:ring-emerald-500"
          />
          <div className="text-right mt-1.5">
            <span className="text-xs text-gray-500">Total: </span>
            <span className="font-bold text-emerald-700">{rowTotal.toLocaleString()}</span>
          </div>
        </div> */}

        {/* Remove Button */}
        <div className="col-span-1 flex items-center justify-center pt-6">
          {showRemoveButton && (
            <button
              onClick={onRemove}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
              title="Remove this batch row"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      {/* {selectedBatch && (
        <div className="mt-3 pt-3 border-t flex items-center gap-3 text-xs flex-wrap">
          <span className="px-2.5 py-1 bg-gray-100 rounded-md">Batch: <strong>#{selectedBatch}</strong></span>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md">Avl: <strong>{batchQty.toLocaleString()}</strong></span>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md">Dispatch: <strong>{(dispatchQty.uom1_qty || 0).toLocaleString()}</strong></span>
        </div>
      )} */}
    </div>
  )
}
