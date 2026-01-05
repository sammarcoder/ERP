// components/grn/Stk_Detail.tsx

'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Plus, X, AlertTriangle, Package, Tag } from 'lucide-react'
import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
import { Button } from '@/components/ui/Button'
import Stk_details_data from './Stk_details_data'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

interface Props {
  orderDetails: any[]
  onDetailChange: (items: any[]) => void
  globalBatch?: number | null
  globalBatchName?: string
}

export default function Stk_Detail({ 
  orderDetails, 
  onDetailChange, 
  globalBatch,
  globalBatchName 
}: Props) {
  // ✅ Selected Item IDs only (not full objects)
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const initialized = useRef(false)

  // ✅ Fetch ALL items with complete UOM data
  const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
  const allItems: any[] = itemsResponse?.data || []

  // Order item IDs for auto-populate
  const orderItemIds = useMemo(() => {
    return orderDetails?.map(d => d.Item_ID) || []
  }, [orderDetails])

  // ✅ Auto-populate with order item IDs
  useEffect(() => {
    if (initialized.current) return
    if (allItems.length === 0 || orderItemIds.length === 0) return

    console.log('🚀 Auto-populating order item IDs:', orderItemIds)
    setSelectedItemIds(orderItemIds)
    initialized.current = true
  }, [allItems, orderItemIds])

  // =====================================================
  // ✅ HELPER: Build UOM Structure from FULL Item Data
  // =====================================================
  const buildUomStructure = useCallback((item: any) => {
    if (!item) {
      return { primary: { id: 1, name: 'Pcs', qty: 1 } }
    }

    console.log(`🔧 Building UOM for: ${item.id} (${item.itemName})`)
    console.log('   Full item data:', {
      uom1: item.uom1,
      uom2: item.uom2,
      uom2_qty: item.uom2_qty,
      uom3: item.uom3,
      uom3_qty: item.uom3_qty,
      uomTwo: item.uomTwo,
      uomThree: item.uomThree
    })

    // Parse UOM quantities
    const secondaryQty = parseFloat(item.uom2_qty || item.qty_2 || 0)
    const tertiaryQty = parseFloat(item.uom3_qty || item.qty_3 || 0)

    console.log(`   Parsed: secondary=${secondaryQty}, tertiary=${tertiaryQty}`)

    // Build structure
    const uomStructure: any = {
      primary: {
        id: item.skuUOM || item.uom1?.id || 1,
        name: item.uom1?.uom || 'Pcs',
        qty: 1
      }
    }

    // Add secondary
    if (item.uom2 && secondaryQty > 0) {
      uomStructure.secondary = {
        id: item.uom2,
        name: item.uomTwo?.uom || 'Box',
        qty: secondaryQty
      }
      console.log('   ✅ Secondary:', uomStructure.secondary)
    }

    // Add tertiary
    if (item.uom3 && tertiaryQty > 0) {
      uomStructure.tertiary = {
        id: item.uom3,
        name: item.uomThree?.uom || 'Crt',
        qty: tertiaryQty
      }
      console.log('   ✅ Tertiary:', uomStructure.tertiary)
    }

    return uomStructure
  }, [])

  // =====================================================
  // ✅ BUILD FINAL ITEMS FROM allItems (not selectedItems)
  // =====================================================
  const finalItems = useMemo(() => {
    console.log('═══════════════════════════════════════════════════')
    console.log('📦 Building finalItems')
    console.log('   selectedItemIds:', selectedItemIds)
    console.log('   allItems count:', allItems.length)

    // ✅ KEY FIX: Get FULL item data from allItems using IDs
    return selectedItemIds.map(itemId => {
      // ✅ Always get from allItems (has complete UOM data)
      const fullItem = allItems.find(item => item.id === itemId)

      if (!fullItem) {
        console.warn(`   ⚠️ Item ${itemId} not found in allItems`)
        return null
      }

      console.log(`   Processing item ${itemId}: ${fullItem.itemName}`)

      // Find order details for this item
      const orderItem = orderDetails?.find(o => o.Item_ID === itemId)

      // Build UOM from FULL item data
      const uomStructure = buildUomStructure(fullItem)

      const hasValidUom = !!uomStructure.secondary || !!uomStructure.tertiary

      return {
        id: fullItem.id,
        itemName: fullItem.itemName,
        sellingPrice: parseFloat(fullItem.sellingPrice) || 0,
        purchasePrice: parseFloat(fullItem.purchasePricePKR) || parseFloat(fullItem.purchasePrice) || 0,
        uomStructure,
        orderQty: orderItem ? {
          uom1_qty: orderItem.uom1_qty || '0',
          uom2_qty: orderItem.uom2_qty || '0',
          uom3_qty: orderItem.uom3_qty || '0',
          sale_unit: String(orderItem.sale_unit || '3'),
          Uom_Id: orderItem.Uom_Id || 0
        } : null,
        isOrderItem: !!orderItem,
        hasValidUom
      }
    }).filter(Boolean) // Remove nulls
  }, [selectedItemIds, allItems, orderDetails, buildUomStructure])

  // Debug
  useEffect(() => {
    console.log('═══════════════════════════════════════════════════')
    console.log('📋 Final Items Summary:')
    finalItems.forEach(item => {
      console.log(`  - ${item.id} (${item.itemName}):`, {
        hasSecondary: !!item.uomStructure.secondary,
        hasTertiary: !!item.uomStructure.tertiary
      })
    })
  }, [finalItems])

  // =====================================================
  // ✅ HANDLE MODAL SELECTION - Store IDs only
  // =====================================================
  const handleModalSelectionChange = useCallback((selectedItems: any[]) => {
    // ✅ Extract IDs from selected items
    const ids = selectedItems.map(item => item.id || item.ID).filter(Boolean)
    console.log('📝 Modal selection changed, IDs:', ids)
    setSelectedItemIds(ids)
  }, [])

  const handleItemDelete = useCallback((itemId: number) => {
    setSelectedItemIds(prev => prev.filter(id => id !== itemId))
  }, [])

  const itemsWithBadUom = finalItems.filter(item => !item.hasValidUom)

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <Package className="w-8 h-8 animate-pulse text-[#4c96dc] mx-auto mb-2" />
        <span className="text-gray-500">Loading items...</span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#4c96dc]" />
              Items ({finalItems.length})
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {finalItems.filter(i => i.isOrderItem).length} from order, 
              {' '}{finalItems.filter(i => !i.isOrderItem).length} added manually
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Items
          </Button>
        </div>
      </div>

      {/* Batch Info */}
      {globalBatch && (
        <div className="px-5 py-3 bg-green-50 border-b border-green-100 flex items-center gap-3">
          <Tag className="w-4 h-4 text-green-600" />
          <span className="text-green-800 text-sm">
            Batch <strong className="text-lg">{globalBatch}</strong> 
            <span className="text-green-600 ml-2">({globalBatchName})</span>
            <span className="text-green-500 ml-2">→ Applied to all items</span>
          </span>
        </div>
      )}

      {/* UOM Warning */}
      {itemsWithBadUom.length > 0 && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-amber-800 text-sm font-medium">
              {itemsWithBadUom.length} item(s) missing UOM setup
            </span>
            <p className="text-amber-600 text-xs mt-0.5">
              {itemsWithBadUom.map(i => `${i.itemName} (ID: ${i.id})`).join(', ')}
            </p>
            <p className="text-amber-500 text-xs mt-1">
              💡 Update these items in Item Master with uom2_qty and uom3_qty
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <Stk_details_data
          items={finalItems}
          onChange={onDetailChange}
          onDelete={handleItemDelete}
          globalBatch={globalBatch}
          globalBatchName={globalBatchName}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Select Items</h2>
                <p className="text-sm text-gray-500">
                  {selectedItemIds.length} items selected
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MultiSelectItemTable
                isPurchase={true}
                preSelectedIds={selectedItemIds}
                onSelectionChange={handleModalSelectionChange}
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={() => setIsModalOpen(false)}>
                Done ({selectedItemIds.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
