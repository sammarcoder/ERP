// hooks/useStockAllocation.js - REAL-TIME STOCK ALLOCATION HOOK
import { useCallback } from 'react'

export const useStockAllocation = ({ 
  detailItems, 
  availableBatches, 
  getTotalAllocatedQty 
}) => {

  // ✅ Validate stock allocation in real-time
  const validateStockAllocation = useCallback((itemId, batchNumber, requestedQty, currentIndex) => {
    if (!itemId || !batchNumber || requestedQty <= 0) return { valid: true }

    const batches = availableBatches[itemId] || []
    const batch = batches.find(b => b.batchno.toString() === batchNumber.toString())
    
    if (!batch) {
      return { 
        valid: false, 
        error: 'Batch not found' 
      }
    }

    const availableStock = parseFloat(batch.available_qty_uom1) || 0
    const alreadyAllocated = getTotalAllocatedQty(itemId, currentIndex)
    const remainingStock = availableStock - alreadyAllocated

    if (requestedQty > remainingStock) {
      return {
        valid: false,
        error: `Insufficient stock. Available: ${remainingStock.toFixed(3)}, Requested: ${requestedQty.toFixed(3)}`,
        available: remainingStock,
        requested: requestedQty
      }
    }

    return { 
      valid: true, 
      remaining: remainingStock - requestedQty 
    }
  }, [availableBatches, getTotalAllocatedQty])

  // ✅ Get remaining stock for an item across all batches
  const getRemainingStock = useCallback((itemId, batchNumber, excludeIndex = -1) => {
    if (!itemId || !batchNumber) return 0

    const batches = availableBatches[itemId] || []
    const batch = batches.find(b => b.batchno.toString() === batchNumber.toString())
    
    if (!batch) return 0

    const availableStock = parseFloat(batch.available_qty_uom1) || 0
    const alreadyAllocated = getTotalAllocatedQty(itemId, excludeIndex)
    
    return Math.max(0, availableStock - alreadyAllocated)
  }, [availableBatches, getTotalAllocatedQty])

  // ✅ Get stock allocation summary for display
  const getStockAllocationSummary = useCallback((itemId) => {
    const itemRows = detailItems.filter(item => item.Item_ID === itemId)
    
    if (itemRows.length === 0) return null

    const summary = itemRows.reduce((acc, item, index) => {
      const qty = item.sale_unit === 1 ? item.uom1_qty :
                 item.sale_unit === 2 ? item.uom2_qty :
                 item.sale_unit === 3 ? item.uom3_qty : 0
      
      const allocated = parseFloat(qty) || 0
      
      acc.totalAllocated += allocated
      acc.rows.push({
        lineId: item.Line_Id,
        batchNumber: item.Batch_Number,
        allocated: allocated,
        uom: item.sale_unit === 1 ? item.item?.uom1?.uom :
             item.sale_unit === 2 ? item.item?.uomTwo?.uom :
             item.item?.uomThree?.uom || 'Unknown'
      })

      return acc
    }, { totalAllocated: 0, rows: [] })

    return summary
  }, [detailItems])

  return {
    validateStockAllocation,
    getRemainingStock,
    getStockAllocationSummary
  }
}
