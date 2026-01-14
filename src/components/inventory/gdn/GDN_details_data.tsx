
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
              sale_unit: 1,
              Uom_Id: item.orderQty?.Uom_Id || null
            },
            unitPrice: item.sellingPrice || 0,
            // Auto-populate discounts from order
            Discount_A: item.discounts?.Discount_A || 0,
            Discount_B: item.discounts?.Discount_B || 0,
            Discount_C: item.discounts?.Discount_C || 0,
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
          sale_unit: 1,
          Uom_Id: item.orderQty?.Uom_Id || null
        },
        unitPrice: item.sellingPrice || 0,
        // Inherit discounts from original item for duplicate rows
        Discount_A: item.discounts?.Discount_A || 0,
        Discount_B: item.discounts?.Discount_B || 0,
        Discount_C: item.discounts?.Discount_C || 0,
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

      
    </div>
  )
}
