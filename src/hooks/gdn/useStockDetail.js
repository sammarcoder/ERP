// hooks/useStockDetail.js - FIXED INFINITE LOOP
import { useState, useCallback, useEffect, useRef } from 'react'

export const useStockDetail = ({ initialItems = [] }) => {
  const [detailItems, setDetailItems] = useState(initialItems)
  const [availableBatches, setAvailableBatches] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // ✅ Use ref to track last sync to prevent infinite loops
  const lastSyncRef = useRef(null)

  // ✅ FIXED: Smart sync with initialItems - prevent infinite loops
  useEffect(() => {
    // ✅ Create a stable hash of initialItems to detect real changes
    const initialItemsHash = JSON.stringify(initialItems.map(item => ({
      Line_Id: item.Line_Id,
      Item_ID: item.Item_ID,
      Item: item.Item
    })))

    // ✅ Only sync if the content actually changed
    if (initialItemsHash !== lastSyncRef.current && initialItems.length > 0) {
      console.log('🔄 useStockDetail - Syncing with new initialItems:', initialItems.length)
      setDetailItems([...initialItems])
      lastSyncRef.current = initialItemsHash
    }
  }, [initialItems.length]) // ✅ Only depend on length, not the entire array

  // ✅ All your existing functions (unchanged)
  const generateLineId = useCallback((originalLineId, duplicateCount = 0) => {
    if (duplicateCount === 0) {
      return originalLineId
    }
    return originalLineId * 1000 + duplicateCount
  }, [])

  const getTotalAllocatedQty = useCallback((itemId, batchNumber, excludeIndex = -1) => {
    return detailItems
      .filter((item, index) => 
        item.Item_ID === itemId && 
        item.Batch_Number === batchNumber && 
        index !== excludeIndex
      )
      .reduce((total, item) => {
        const qty = item.sale_unit === 1 ? item.uom1_qty :
                   item.sale_unit === 2 ? item.uom2_qty :
                   item.sale_unit === 3 ? item.uom3_qty : 0
        return total + (parseFloat(qty) || 0)
      }, 0)
  }, [detailItems])

  const getAvailableStockDisplay = useCallback((itemId, batchNumber, selectedUom, itemData) => {
    if (!itemId || !batchNumber || !itemData) return 0

    const batches = availableBatches[itemId] || []
    const batch = batches.find(b => b.batchno.toString() === batchNumber.toString())
    
    if (!batch) return 0

    const availableInPcs = parseFloat(batch.available_qty_uom1) || 0
    const allocatedQty = getTotalAllocatedQty(itemId, batchNumber)
    const remainingInPcs = availableInPcs - allocatedQty

    let conversionFactor = 1
    if (selectedUom === 2 && itemData.uom2_qty) {
      conversionFactor = parseFloat(itemData.uom2_qty)
    } else if (selectedUom === 3 && itemData.uom3_qty) {
      conversionFactor = parseFloat(itemData.uom3_qty)
    }

    return Math.max(0, remainingInPcs / conversionFactor)
  }, [availableBatches, getTotalAllocatedQty])

  const canDeleteOriginal = useCallback((originalLineId) => {
    const duplicates = detailItems.filter(item => 
      Math.floor(item.Line_Id / 1000) === originalLineId && !item.isOriginalRow
    )
    return duplicates.length === 0
  }, [detailItems])

  return {
    detailItems,
    setDetailItems,
    availableBatches,
    setAvailableBatches,
    message,
    setMessage,
    generateLineId,
    getTotalAllocatedQty,
    getAvailableStockDisplay,
    canDeleteOriginal
  }
}
