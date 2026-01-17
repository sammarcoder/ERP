// components/gdn/GDN_Edit_Details.tsx - HANDLES EXISTING ROWS WITH BATCHES

'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, Package, Copy } from 'lucide-react'
import GDN_Edit_Row from './GDN_Edit_Row'

interface Props {
  initialRows: any[]
  onChange: (data: any[]) => void
  dispatchId: number
}

export default function GDN_Edit_Details({ initialRows, onChange, dispatchId }: Props) {
  const [rows, setRows] = useState<any[]>([])

  // Sync rows with initialRows - detect new items added from modal
  useEffect(() => {
    if (initialRows.length === 0) {
      setRows([])
      return
    }

    // Get current rowIds
    const currentRowIds = new Set(rows.map(r => r.rowId))
    
    // Find new rows that aren't in current rows
    const newRows = initialRows.filter(r => !currentRowIds.has(r.rowId))
    
    if (newRows.length > 0) {
      // Add new rows to existing ones
      setRows(prev => [...prev, ...newRows])
    } else if (rows.length === 0) {
      // Initial load
      setRows(initialRows)
    }
  }, [initialRows])

  // Handle row update
  const handleRowUpdate = useCallback((rowId: string, updatedRow: any) => {
    setRows(prev => {
      const newRows = prev.map(r => r.rowId === rowId ? updatedRow : r)
      return newRows
    })
  }, [])

  // Handle row delete
  const handleRowDelete = useCallback((rowId: string) => {
    setRows(prev => prev.filter(r => r.rowId !== rowId))
  }, [])

  // ✅ Duplicate row (same item, new batch selection)
  const handleDuplicateRow = useCallback((sourceRow: any) => {
    const newRow = {
      ...sourceRow,
      rowId: `dup-${sourceRow.Item_ID}-${Date.now()}`,
      detailId: null, // New row
      batchno: null,  // Need to select new batch
      selectedBatchQty: 0,
      dispatchQty: {
        uom1_qty: 0,
        uom2_qty: 0,
        uom3_qty: 0,
        sale_unit: sourceRow.dispatchQty?.sale_unit || 1
      },
      isExistingRow: false,
      isDuplicate: true
    }
    
    setRows(prev => [...prev, newRow])
  }, [])

  // Notify parent
  useEffect(() => {
    onChange(rows)
  }, [rows, onChange])

  // Group rows by item for display
  const groupedRows = useMemo(() => {
    const groups = new Map<number, any[]>()
    
    rows.forEach(row => {
      const itemId = row.Item_ID
      if (!groups.has(itemId)) {
        groups.set(itemId, [])
      }
      groups.get(itemId)!.push(row)
    })
    
    return groups
  }, [rows])

  // Calculate grand total
  const grandTotal = useMemo(() => {
    return rows.reduce((sum, row) => {
      return sum + ((row.dispatchQty?.uom1_qty || 0) * (row.unitPrice || 0))
    }, 0)
  }, [rows])

  // Empty state
  if (rows.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
        <Package className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-1">No Items</h3>
        <p className="text-sm text-gray-400">Click "Add Items" to start</p>
      </div>
    )
  }

  // Get unique items
  const uniqueItems = Array.from(groupedRows.keys())

  return (
    <div className="space-y-4">
      {uniqueItems.map((itemId, itemIndex) => {
        const itemRows = groupedRows.get(itemId) || []
        const firstRow = itemRows[0]

        return (
          <div key={itemId} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Item Header */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50/30 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {itemIndex + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{firstRow.itemName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>ID: {itemId}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      {itemRows.length} batch row{itemRows.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDuplicateRow(firstRow)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-medium transition-colors"
                title="Add another batch row"
              >
                <Copy className="w-4 h-4" />
                Add Batch
              </button>
            </div>

            {/* Rows for this item */}
            <div className="divide-y divide-gray-100">
              {itemRows.map((row, rowIndex) => (
                <GDN_Edit_Row
                  key={row.rowId}
                  row={row}
                  rowIndex={rowIndex}
                  totalRows={itemRows.length}
                  dispatchId={dispatchId}
                  onUpdate={(updatedRow) => handleRowUpdate(row.rowId, updatedRow)}
                  onDelete={() => handleRowDelete(row.rowId)}
                  showDeleteButton={true}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Grand Total */}
      {/* <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 flex justify-between items-center">
        <span className="font-semibold text-emerald-800">Grand Total:</span>
        <span className="text-2xl font-bold text-emerald-700">
          {grandTotal.toLocaleString()}
        </span>
      </div> */}
    </div>
  )
}
