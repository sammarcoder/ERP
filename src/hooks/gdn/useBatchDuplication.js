// hooks/useBatchDuplication.js - BATCH MANAGEMENT HOOK
import { useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export const useBatchDuplication = ({ detailItems, setDetailItems, generateLineId }) => {
  
  // ✅ Add duplicate batch row for same item
  const addBatchRow = useCallback((originalIndex) => {
    const originalItem = detailItems[originalIndex]
    const originalLineId = originalItem.Line_Id
    
    // Count existing duplicates for this original item
    const existingDuplicates = detailItems.filter(item => 
      Math.floor(item.Line_Id / 1000) === originalLineId && !item.isOriginalRow
    )
    
    const duplicateCount = existingDuplicates.length + 1
    const newLineId = generateLineId(originalLineId, duplicateCount)
    
    const duplicateRow = {
      Line_Id: newLineId,
      Batch_Number: '',
      Item: `${originalItem.Item} (Batch ${duplicateCount})`,
      Item_ID: originalItem.Item_ID,
      Qty_in_SO: 0,
      Uom_SO: originalItem.Uom_SO,
      QTY_Dispatched: 0,
      UOM_Dispatched: originalItem.UOM_Dispatched,
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: 1, // Default to UOM1
      Uom_Id: originalItem.Uom_Id,
      Stock_Price: originalItem.Stock_Price,
      isOriginalRow: false,
      isAdditionalBatch: true,
      originalLineId: originalLineId,
      item: originalItem.item
    }

    // Insert after the original item and its existing duplicates
    const insertIndex = detailItems.findIndex((_, index) => index > originalIndex && 
      detailItems[index].isOriginalRow) || detailItems.length

    const newItems = [...detailItems]
    newItems.splice(insertIndex, 0, duplicateRow)
    setDetailItems(newItems)

    console.log(`✅ Added duplicate batch for Item ${originalItem.Item_ID}:`, {
      originalLineId,
      newLineId,
      duplicateCount
    })
  }, [detailItems, setDetailItems, generateLineId])

  // ✅ Remove item with validation
  const removeItem = useCallback((index) => {
    const item = detailItems[index]
    
    // If it's an original row, check if duplicates exist
    if (item.isOriginalRow) {
      const duplicates = detailItems.filter(detailItem => 
        Math.floor(detailItem.Line_Id / 1000) === item.Line_Id && !detailItem.isOriginalRow
      )
      
      if (duplicates.length > 0) {
        alert(`Cannot delete original item. Please delete all ${duplicates.length} duplicate batch(es) first.`)
        return
      }
    }
    
    // Remove the item
    const newItems = detailItems.filter((_, i) => i !== index)
    setDetailItems(newItems)

    console.log(`✅ Removed item at index ${index}:`, item.Item)
  }, [detailItems, setDetailItems])

  // ✅ Get action buttons for each row
  const getRowActions = useCallback((item, index) => {
    const actions = []

    // Add Batch button (only for original rows)
    if (item.isOriginalRow) {
      actions.push({
        key: 'addBatch',
        icon: <Plus className="w-4 h-4" />,
        label: '+ Batch',
        onClick: () => addBatchRow(index),
        className: 'bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs',
        disabled: false
      })
    }

    // Delete button with conditional logic
    const canDelete = item.isOriginalRow ? 
      detailItems.filter(detailItem => 
        Math.floor(detailItem.Line_Id / 1000) === item.Line_Id && !detailItem.isOriginalRow
      ).length === 0 : true // Duplicates can always be deleted

    if (detailItems.length > 1) {
      actions.push({
        key: 'delete',
        icon: <Trash2 className="w-4 h-4" />,
        label: item.isAdditionalBatch ? 'Remove' : 'Delete',
        onClick: () => removeItem(index),
        className: `bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`,
        disabled: !canDelete,
        title: !canDelete ? 'Delete all duplicate batches first' : ''
      })
    }

    return actions
  }, [detailItems, addBatchRow, removeItem])

  return {
    addBatchRow,
    removeItem,
    getRowActions
  }
}
