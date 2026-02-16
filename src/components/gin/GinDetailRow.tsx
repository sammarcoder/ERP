

// // components/gin/GinDetailRow.tsx

// 'use client'
// import React, { useState, useEffect, useCallback } from 'react'
// import { Trash2, AlertTriangle, CheckCircle, Loader2, Package, RefreshCw } from 'lucide-react'
// import { useLazyGetAvailableBatchesQuery, useLazyGetAvailableBatchesForEditQuery } from '@/store/slice/ginSlice'

// interface GinDetailRowProps {
//   detail: any
//   index: number
//   mode: 'create' | 'edit'
//   ginId?: number
//   onUpdate: (index: number, data: any) => void
//   onRemove: (index: number) => void
// }

// const toNumber = (value: any): number => {
//   const num = Number(value)
//   return isNaN(num) ? 0 : num
// }

// const GinDetailRow: React.FC<GinDetailRowProps> = ({
//   detail,
//   index,
//   mode,
//   ginId,
//   onUpdate,
//   onRemove
// }) => {
//   // State
//   const [availableBatches, setAvailableBatches] = useState<any[]>([])
//   const [selectedBatch, setSelectedBatch] = useState<number | null>(detail.batchno || null)
//   const [batchAvailableQty, setBatchAvailableQty] = useState<number>(0)
//   const [batchError, setBatchError] = useState<string | null>(null)

//   // Local values
//   const [issueQty, setIssueQty] = useState<number>(toNumber(detail.issue_qty))
//   const [unusedQty, setUnusedQty] = useState<number>(toNumber(detail.remained_unused))
//   const [wastageQty, setWastageQty] = useState<number>(toNumber(detail.wastage))

//   // Calculate actual used (in UOM2) = Issue - Unused
//   const actualUsed = Math.max(0, issueQty - unusedQty)

//   // =============================================
//   // RTK QUERY HOOKS
//   // =============================================
//   const [triggerGetBatches, { isLoading: isLoadingCreate }] = useLazyGetAvailableBatchesQuery()
//   const [triggerGetBatchesEdit, { isLoading: isLoadingEdit }] = useLazyGetAvailableBatchesForEditQuery()

//   const isLoadingBatches = isLoadingCreate || isLoadingEdit

//   // =============================================
//   // FETCH AVAILABLE BATCHES
//   // =============================================
//   const fetchBatches = useCallback(async () => {
//     if (!detail.item_id) return

//     setBatchError(null)

//     try {
//       let result;

//       if (mode === 'edit' && ginId) {
//         result = await triggerGetBatchesEdit({ itemId: detail.item_id, ginId }).unwrap()
//       } else {
//         result = await triggerGetBatches(detail.item_id).unwrap()
//       }

//       if (Array.isArray(result)) {
//         console.log(`✅ Found ${result.length} batches for Item ${detail.item_id}`)
//         setAvailableBatches(result)

//         // If batch already selected, update available qty
//         if (selectedBatch) {
//           const batch = result.find((b) => b.batchno === selectedBatch)
//           if (batch) {
//             setBatchAvailableQty(toNumber(batch.available_qty_uom2))
//           }
//         }
//       } else {
//         setAvailableBatches([])
//       }
//     } catch (error: any) {
//       console.error('❌ Batch fetch error:', error)
//       setBatchError(error?.message || error?.data?.message || 'Failed to fetch batches')
//       setAvailableBatches([])
//     }
//   }, [detail.item_id, mode, ginId, selectedBatch, triggerGetBatches, triggerGetBatchesEdit])

//   // Fetch batches on mount
//   useEffect(() => {
//     fetchBatches()
//   }, [detail.item_id])

//   // Sync local state when detail prop changes (edit mode)
//   useEffect(() => {
//     setSelectedBatch(detail.batchno || null)
//     setIssueQty(toNumber(detail.issue_qty))
//     setUnusedQty(toNumber(detail.remained_unused))
//     setWastageQty(toNumber(detail.wastage))
//   }, [detail.batchno, detail.issue_qty, detail.remained_unused, detail.wastage])

//   // =============================================
//   // HANDLE BATCH SELECTION
//   // =============================================
//   const handleBatchSelect = useCallback((batchno: number) => {
//     const batch = availableBatches.find(b => b.batchno === batchno)
//     const availableQty = toNumber(batch?.available_qty_uom2)

//     setSelectedBatch(batchno)
//     setBatchAvailableQty(availableQty)

//     onUpdate(index, {
//       ...detail,
//       batchno,
//       available_qty: availableQty
//     })
//   }, [availableBatches, detail, index, onUpdate])

//   // =============================================
//   // HANDLE ISSUE QTY CHANGE (Direct Input)
//   // =============================================
//   const handleIssueQtyChange = useCallback((value: string) => {
//     const newIssueQty = toNumber(value)
//     setIssueQty(newIssueQty)

//     const newActualUsed = Math.max(0, newIssueQty - unusedQty)

//     // Calculate UOM conversions
//     const uom2Qty = detail.uomData?.secondary?.qty || 1
//     const uom3Qty = detail.uomData?.tertiary?.qty || 1

//     const issueUom1 = newIssueQty * uom2Qty
//     const issueUom3 = newIssueQty / (uom3Qty / uom2Qty)

//     const actualUsedUom1 = newActualUsed * uom2Qty
//     const actualUsedUom3 = newActualUsed / (uom3Qty / uom2Qty)

//     onUpdate(index, {
//       ...detail,
//       batchno: selectedBatch,
//       available_qty: batchAvailableQty,
//       issue_qty: newIssueQty,
//       issue_uom1_qty: issueUom1,
//       issue_uom2_qty: newIssueQty,
//       issue_uom3_qty: issueUom3,
//       issue_uom_id: detail.uomData?.secondary?.id || detail.issue_uom_id,
//       remained_unused: unusedQty,
//       wastage: wastageQty,
//       actual_used: newActualUsed,
//       actual_used_uom1: actualUsedUom1,
//       actual_used_uom2: newActualUsed,
//       actual_used_uom3: actualUsedUom3
//     })
//   }, [detail, index, selectedBatch, batchAvailableQty, unusedQty, wastageQty, onUpdate])

//   // =============================================
//   // HANDLE UNUSED CHANGE
//   // =============================================
//   const handleUnusedChange = useCallback((value: string) => {
//     const newUnused = toNumber(value)
//     setUnusedQty(newUnused)

//     const newActualUsed = Math.max(0, issueQty - newUnused)

//     // Calculate UOM conversions
//     const uom2Qty = detail.uomData?.secondary?.qty || 1
//     const uom3Qty = detail.uomData?.tertiary?.qty || 1

//     const actualUsedUom1 = newActualUsed * uom2Qty
//     const actualUsedUom3 = newActualUsed / (uom3Qty / uom2Qty)

//     onUpdate(index, {
//       ...detail,
//       batchno: selectedBatch,
//       available_qty: batchAvailableQty,
//       issue_qty: issueQty,
//       remained_unused: newUnused,
//       wastage: wastageQty,
//       actual_used: newActualUsed,
//       actual_used_uom1: actualUsedUom1,
//       actual_used_uom2: newActualUsed,
//       actual_used_uom3: actualUsedUom3
//     })
//   }, [detail, index, selectedBatch, batchAvailableQty, issueQty, wastageQty, onUpdate])

//   // =============================================
//   // HANDLE WASTAGE CHANGE
//   // =============================================
//   const handleWastageChange = useCallback((value: string) => {
//     const newWastage = toNumber(value)
//     setWastageQty(newWastage)

//     onUpdate(index, {
//       ...detail,
//       batchno: selectedBatch,
//       available_qty: batchAvailableQty,
//       issue_qty: issueQty,
//       remained_unused: unusedQty,
//       wastage: newWastage,
//       actual_used: actualUsed
//     })
//   }, [detail, index, selectedBatch, batchAvailableQty, issueQty, unusedQty, actualUsed, onUpdate])

//   // =============================================
//   // VALIDATION
//   // =============================================
//   const isOverIssue = selectedBatch && issueQty > batchAvailableQty && batchAvailableQty > 0
//   const batchesWithStock = availableBatches.filter(b => toNumber(b.available_qty_uom2) > 0)

//   // =============================================
//   // RENDER
//   // =============================================
//   return (
//     <tr className="hover:bg-gray-50 border-b border-gray-200">
//       {/* # */}
//       <td className="px-3 py-3 text-sm text-gray-500 font-medium">{index + 1}</td>

//       {/* Item Name */}
//       <td className="px-3 py-3">
//         <span className="text-sm font-medium text-gray-900">{detail.itemName}</span>
//       </td>

//       {/* Suggested Qty */}
//       <td className="px-3 py-3 text-right">
//         <span className="text-sm text-gray-600">{toNumber(detail.suggested_qty).toFixed(2)}</span>
//       </td>

//       {/* Batch Selection */}
//       <td className="px-3 py-3 min-w-[220px]">
//         {/* Refresh Button */}
//         <div className="flex items-center gap-2 mb-2">
//           <button
//             type="button"
//             onClick={fetchBatches}
//             disabled={isLoadingBatches}
//             className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
//             title="Refresh available batches"
//           >
//             <RefreshCw className={`w-3 h-3 ${isLoadingBatches ? 'animate-spin' : ''}`} />
//             {isLoadingBatches ? 'Loading...' : 'Refresh'}
//           </button>
//         </div>

//         {/* Batch List */}
//         {isLoadingBatches ? (
//           <div className="flex items-center gap-2 text-emerald-600 text-xs py-2 bg-emerald-50 rounded px-2">
//             <Loader2 className="w-3 h-3 animate-spin" />
//             Loading batches...
//           </div>
//         ) : batchError ? (
//           <div className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
//             <AlertTriangle className="w-3 h-3 inline mr-1" />
//             {batchError}
//           </div>
//         ) : batchesWithStock.length === 0 ? (
//           <div className="text-orange-700 text-xs bg-orange-50 px-2 py-1 rounded">
//             <Package className="w-3 h-3 inline mr-1" />
//             No stock available
//           </div>
//         ) : (
//           <div className="flex flex-wrap gap-1">
//             {batchesWithStock.map(batch => {
//               const isSelected = selectedBatch === batch.batchno
//               return (
//                 <button
//                   key={batch.batchno}
//                   type="button"
//                   onClick={() => handleBatchSelect(batch.batchno)}
//                   className={`px-2 py-1 rounded border text-xs transition-all ${
//                     isSelected
//                       ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
//                       : 'border-gray-200 hover:border-emerald-300 bg-white'
//                   }`}
//                 >
//                   <div className="flex items-center gap-1">
//                     <span className="font-medium">#{batch.batchName}</span>
//                     {isSelected && <CheckCircle className="w-3 h-3 text-emerald-600" />}
//                   </div>
//                   <div className="text-[10px] text-gray-500">
//                     Qty: {toNumber(batch.available_qty_uom2).toFixed(2)}
//                   </div>
//                 </button>
//               )
//             })}
//           </div>
//         )}
//       </td>

//       {/* Available Qty (from selected batch) */}
//       <td className="px-3 py-3 text-right">
//         <span className={`text-sm font-medium ${batchAvailableQty > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
//           {batchAvailableQty.toFixed(2)}
//         </span>
//       </td>

//       {/* Issue Qty (Direct Input - NOT using UomConverterSimple) */}
//       <td className="px-3 py-3">
//         <div>
//           <input
//             type="number"
//             value={issueQty || ''}
//             onChange={(e) => handleIssueQtyChange(e.target.value)}
//             placeholder="0"
//             className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//             step="0.01"
//             min="0"
//           />
//           {detail.uomData?.secondary?.name && (
//             <span className="ml-1 text-xs text-gray-500">{detail.uomData.secondary.name}</span>
//           )}
//           {isOverIssue && (
//             <div className="text-red-600 text-xs flex items-center gap-1 mt-1 bg-red-50 px-2 py-1 rounded">
//               <AlertTriangle className="w-3 h-3" />
//               Exceeds available!
//             </div>
//           )}
//         </div>
//       </td>

//       {/* Unused */}
//       <td className="px-3 py-3">
//         <input
//           type="number"
//           value={unusedQty || ''}
//           onChange={(e) => handleUnusedChange(e.target.value)}
//           placeholder="0"
//           className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//           step="0.01"
//           min="0"
//           max={issueQty}
//         />
//       </td>

//       {/* Wastage */}
//       <td className="px-3 py-3">
//         <input
//           type="number"
//           value={wastageQty || ''}
//           onChange={(e) => handleWastageChange(e.target.value)}
//           placeholder="0"
//           className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
//           step="0.01"
//           min="0"
//         />
//       </td>

//       {/* Actual Used = Issue - Unused */}
//       <td className="px-3 py-3 text-right">
//         <span className={`text-sm font-medium ${actualUsed > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
//           {actualUsed.toFixed(2)}
//         </span>
//       </td>

//       {/* Remove Button */}
//       <td className="px-3 py-3 text-center">
//         <button
//           type="button"
//           onClick={() => onRemove(index)}
//           className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//           title="Remove item"
//         >
//           <Trash2 className="w-4 h-4" />
//         </button>
//       </td>
//     </tr>
//   )
// }

// export default GinDetailRow



















































// components/gin/GinDetailRow.tsx

'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Trash2, AlertTriangle, CheckCircle, Loader2, Package, RefreshCw } from 'lucide-react'
import { useLazyGetAvailableBatchesQuery, useLazyGetAvailableBatchesForEditQuery } from '@/store/slice/ginSlice'

interface GinDetailRowProps {
  detail: any
  index: number
  mode: 'create' | 'edit'
  ginId?: number
  onUpdate: (index: number, data: any) => void
  onRemove: (index: number) => void
}

const toNumber = (value: any): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const GinDetailRow: React.FC<GinDetailRowProps> = ({
  detail,
  index,
  mode,
  ginId,
  onUpdate,
  onRemove
}) => {
  // State
  const [availableBatches, setAvailableBatches] = useState<any[]>([])
  const [selectedBatch, setSelectedBatch] = useState<number | null>(detail.batchno || null)
  const [batchAvailableQty, setBatchAvailableQty] = useState<number>(0)
  const [batchError, setBatchError] = useState<string | null>(null)

  // Local values
  const [issueQty, setIssueQty] = useState<number>(toNumber(detail.issue_qty))
  const [unusedQty, setUnusedQty] = useState<number>(toNumber(detail.remained_unused))
  const [wastageQty, setWastageQty] = useState<number>(toNumber(detail.wastage))

  // Calculate actual used (in UOM2) = Issue - Unused
  const actualUsed = Math.max(0, issueQty - unusedQty)

  // =============================================
  // GET UOM CONVERSION FACTORS
  // =============================================
  const getUomConversionFactors = useCallback(() => {
    // Try multiple sources for UOM conversion values
    let uom2Qty = 1
    let uom3Qty = 1

    // Source 1: From uomData (built by buildUomData)
    if (detail.uomData?.secondary?.qty) {
      uom2Qty = toNumber(detail.uomData.secondary.qty)
    }
    if (detail.uomData?.tertiary?.qty) {
      uom3Qty = toNumber(detail.uomData.tertiary.qty)
    }

    // Source 2: From item directly (fallback)
    if (uom2Qty === 1 && detail.item?.uom2_qty) {
      uom2Qty = toNumber(detail.item.uom2_qty)
    }
    if (uom3Qty === 1 && detail.item?.uom3_qty) {
      uom3Qty = toNumber(detail.item.uom3_qty)
    }

    // Source 3: From detail directly (another fallback)
    if (uom2Qty === 1 && detail.uom2_qty) {
      uom2Qty = toNumber(detail.uom2_qty)
    }
    if (uom3Qty === 1 && detail.uom3_qty) {
      uom3Qty = toNumber(detail.uom3_qty)
    }

    return { uom2Qty, uom3Qty }
  }, [detail])

  // =============================================
  // CALCULATE UOM CONVERSIONS
  // =============================================
  const calculateUomConversions = useCallback((qtyInUom2: number) => {
    const { uom2Qty, uom3Qty } = getUomConversionFactors()

    // User enters in UOM2
    // UOM1 = UOM2 * uom2_qty (e.g., 100 * 1 = 100 Pcs)
    // UOM3 = UOM1 / uom3_qty (e.g., 100 / 96 = 1.04 Crt)
    const uom1Value = qtyInUom2 * uom2Qty
    const uom3Value = uom3Qty > 0 ? uom1Value / uom3Qty : 0

    console.log(`📊 UOM Conversion: UOM2=${qtyInUom2}, uom2Qty=${uom2Qty}, uom3Qty=${uom3Qty}`)
    console.log(`   → UOM1=${uom1Value}, UOM3=${uom3Value}`)

    return {
      uom1: uom1Value,
      uom2: qtyInUom2,
      uom3: uom3Value
    }
  }, [getUomConversionFactors])

  // =============================================
  // RTK QUERY HOOKS
  // =============================================
  const [triggerGetBatches, { isLoading: isLoadingCreate }] = useLazyGetAvailableBatchesQuery()
  const [triggerGetBatchesEdit, { isLoading: isLoadingEdit }] = useLazyGetAvailableBatchesForEditQuery()

  const isLoadingBatches = isLoadingCreate || isLoadingEdit

  // =============================================
  // FETCH AVAILABLE BATCHES
  // =============================================
  const fetchBatches = useCallback(async () => {
    if (!detail.item_id) return

    setBatchError(null)

    try {
      let result;

      if (mode === 'edit' && ginId) {
        result = await triggerGetBatchesEdit({ itemId: detail.item_id, ginId }).unwrap()
      } else {
        result = await triggerGetBatches(detail.item_id).unwrap()
      }

      if (Array.isArray(result)) {
        console.log(`✅ Found ${result.length} batches for Item ${detail.item_id}`)
        setAvailableBatches(result)

        if (selectedBatch) {
          const batch = result.find((b) => b.batchno === selectedBatch)
          if (batch) {
            setBatchAvailableQty(toNumber(batch.available_qty_uom2))
          }
        }
      } else {
        setAvailableBatches([])
      }
    } catch (error: any) {
      console.error('❌ Batch fetch error:', error)
      setBatchError(error?.message || error?.data?.message || 'Failed to fetch batches')
      setAvailableBatches([])
    }
  }, [detail.item_id, mode, ginId, selectedBatch, triggerGetBatches, triggerGetBatchesEdit])

  // Fetch batches on mount
  useEffect(() => {
    fetchBatches()
  }, [detail.item_id])

  // Sync local state when detail prop changes
  useEffect(() => {
    setSelectedBatch(detail.batchno || null)
    setIssueQty(toNumber(detail.issue_qty))
    setUnusedQty(toNumber(detail.remained_unused))
    setWastageQty(toNumber(detail.wastage))
  }, [detail.batchno, detail.issue_qty, detail.remained_unused, detail.wastage])

  // =============================================
  // HANDLE BATCH SELECTION
  // =============================================
  const handleBatchSelect = useCallback((batchno: number) => {
    const batch = availableBatches.find(b => b.batchno === batchno)
    const availableQty = toNumber(batch?.available_qty_uom2)

    setSelectedBatch(batchno)
    setBatchAvailableQty(availableQty)

    onUpdate(index, {
      ...detail,
      batchno,
      available_qty: availableQty
    })
  }, [availableBatches, detail, index, onUpdate])

  // =============================================
  // HANDLE ISSUE QTY CHANGE
  // =============================================
  const handleIssueQtyChange = useCallback((value: string) => {
    const newIssueQty = toNumber(value)
    setIssueQty(newIssueQty)

    const newActualUsed = Math.max(0, newIssueQty - unusedQty)

    // Calculate conversions for issue qty
    const issueConverted = calculateUomConversions(newIssueQty)
    
    // Calculate conversions for actual used
    const actualUsedConverted = calculateUomConversions(newActualUsed)

    onUpdate(index, {
      ...detail,
      batchno: selectedBatch,
      available_qty: batchAvailableQty,
      issue_qty: newIssueQty,
      issue_uom1_qty: issueConverted.uom1,
      issue_uom2_qty: issueConverted.uom2,
      issue_uom3_qty: issueConverted.uom3,
      issue_uom_id: detail.uomData?.secondary?.id || detail.issue_uom_id,
      remained_unused: unusedQty,
      wastage: wastageQty,
      actual_used: newActualUsed,
      actual_used_uom1: actualUsedConverted.uom1,
      actual_used_uom2: actualUsedConverted.uom2,
      actual_used_uom3: actualUsedConverted.uom3
    })
  }, [detail, index, selectedBatch, batchAvailableQty, unusedQty, wastageQty, calculateUomConversions, onUpdate])

  // =============================================
  // HANDLE UNUSED CHANGE
  // =============================================
  const handleUnusedChange = useCallback((value: string) => {
    const newUnused = toNumber(value)
    setUnusedQty(newUnused)

    const newActualUsed = Math.max(0, issueQty - newUnused)

    // Calculate conversions for actual used
    const actualUsedConverted = calculateUomConversions(newActualUsed)

    onUpdate(index, {
      ...detail,
      batchno: selectedBatch,
      available_qty: batchAvailableQty,
      issue_qty: issueQty,
      remained_unused: newUnused,
      wastage: wastageQty,
      actual_used: newActualUsed,
      actual_used_uom1: actualUsedConverted.uom1,
      actual_used_uom2: actualUsedConverted.uom2,
      actual_used_uom3: actualUsedConverted.uom3
    })
  }, [detail, index, selectedBatch, batchAvailableQty, issueQty, wastageQty, calculateUomConversions, onUpdate])

  // =============================================
  // HANDLE WASTAGE CHANGE
  // =============================================
  const handleWastageChange = useCallback((value: string) => {
    const newWastage = toNumber(value)
    setWastageQty(newWastage)

    onUpdate(index, {
      ...detail,
      batchno: selectedBatch,
      available_qty: batchAvailableQty,
      issue_qty: issueQty,
      remained_unused: unusedQty,
      wastage: newWastage,
      actual_used: actualUsed
    })
  }, [detail, index, selectedBatch, batchAvailableQty, issueQty, unusedQty, actualUsed, onUpdate])

  // Validation
  const isOverIssue = selectedBatch && issueQty > batchAvailableQty && batchAvailableQty > 0
  const batchesWithStock = availableBatches.filter(b => toNumber(b.available_qty_uom2) > 0)

  // Get UOM name for display
  const uomName = detail.uomData?.secondary?.name || detail.item?.uomTwo?.uom || ''

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      {/* # */}
      <td className="px-3 py-3 text-sm text-gray-500 font-medium">{index + 1}</td>

      {/* Item Name */}
      <td className="px-3 py-3">
        <span className="text-sm font-medium text-gray-900">{detail.itemName}</span>
      </td>

      {/* Suggested Qty */}
      <td className="px-3 py-3 text-right">
        <span className="text-sm text-gray-600">{toNumber(detail.suggested_qty).toFixed(2)}</span>
      </td>

      {/* Batch Selection */}
      <td className="px-3 py-3 min-w-[220px]">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={fetchBatches}
            disabled={isLoadingBatches}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingBatches ? 'animate-spin' : ''}`} />
            {isLoadingBatches ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {isLoadingBatches ? (
          <div className="flex items-center gap-2 text-emerald-600 text-xs py-2 bg-emerald-50 rounded px-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Loading...
          </div>
        ) : batchError ? (
          <div className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            {batchError}
          </div>
        ) : batchesWithStock.length === 0 ? (
          <div className="text-orange-700 text-xs bg-orange-50 px-2 py-1 rounded">
            <Package className="w-3 h-3 inline mr-1" />
            No stock available
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {batchesWithStock.map(batch => {
              const isSelected = selectedBatch === batch.batchno
              return (
                <button
                  key={batch.batchno}
                  type="button"
                  onClick={() => handleBatchSelect(batch.batchno)}
                  className={`px-2 py-1 rounded border text-xs transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                      : 'border-gray-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-medium">#{batch.batchName}</span>
                    {isSelected && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Qty: {toNumber(batch.available_qty_uom2).toFixed(2)}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </td>

      {/* Available Qty */}
      <td className="px-3 py-3 text-right">
        <span className={`text-sm font-medium ${batchAvailableQty > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
          {batchAvailableQty.toFixed(2)}
        </span>
      </td>

      {/* Issue Qty */}
      <td className="px-3 py-3">
        <div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={issueQty || ''}
              onChange={(e) => handleIssueQtyChange(e.target.value)}
              placeholder="0"
              className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
              step="0.01"
              min="0"
            />
            {uomName && (
              <span className="text-xs text-gray-500">{uomName}</span>
            )}
          </div>
          {isOverIssue && (
            <div className="text-red-600 text-xs flex items-center gap-1 mt-1 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              Exceeds!
            </div>
          )}
        </div>
      </td>

      {/* Unused */}
      <td className="px-3 py-3">
        <input
          type="number"
          value={unusedQty || ''}
          onChange={(e) => handleUnusedChange(e.target.value)}
          placeholder="0"
          className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
          step="0.01"
          min="0"
          max={issueQty}
        />
      </td>

      {/* Wastage */}
      <td className="px-3 py-3">
        <input
          type="number"
          value={wastageQty || ''}
          onChange={(e) => handleWastageChange(e.target.value)}
          placeholder="0"
          className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] focus:border-[#509ee3]"
          step="0.01"
          min="0"
        />
      </td>

      {/* Actual Used */}
      <td className="px-3 py-3 text-right">
        <span className={`text-sm font-medium ${actualUsed > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
          {actualUsed.toFixed(2)}
        </span>
      </td>

      {/* Remove */}
      <td className="px-3 py-3 text-center">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  )
}

export default GinDetailRow
