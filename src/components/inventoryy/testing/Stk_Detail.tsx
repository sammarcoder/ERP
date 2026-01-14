// components/inventoryy/gdn/Stk_Detail.tsx
// export default function Stk_Detail({ data }: { data: any[] }) {
//     return (
//         <div className="mt-10">
//             < h2 > Order Details({data?.length} items)</h2 >
//             <pre style={{ background: '#f4f4f4', padding: '1rem', overflow: 'auto' }}>
//                 {JSON.stringify(data, null, 2)}
//             </pre>
//         </div >
//     )
// }























// components/grn/Stk_Detail.tsx

'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Plus, X, AlertTriangle, Package, Tag, Info } from 'lucide-react'
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
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const initialized = useRef(false)

  const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
  const allItems: any[] = itemsResponse?.data || []

  // Order item IDs
  const orderItemIds = useMemo(() => {
    return orderDetails?.map(d => d.Item_ID) || []
  }, [orderDetails])

  // Auto-populate order items
  useEffect(() => {
    if (initialized.current) return
    if (allItems.length === 0 || orderItemIds.length === 0) return

    const matchedItems = allItems.filter(item => orderItemIds.includes(item.id))
    setSelectedItems(matchedItems)
    initialized.current = true
  }, [allItems, orderItemIds])

  // =====================================================
  // ✅ HELPER: Build UOM Structure from Item
  // =====================================================
  const buildUomStructure = useCallback((item: any) => {
    if (!item) {
      console.warn('⚠️ buildUomStructure called with null/undefined item')
      return {
        primary: { id: 1, name: 'Pcs', qty: 1 }
      }
    }

    // ✅ Debug: Log raw item data
    console.log(`🔧 Building UOM for: ${item.id} (${item.itemName})`)
    console.log('   Raw UOM data:', {
      uom1: item.uom1,
      skuUOM: item.skuUOM,
      uom2: item.uom2,
      uom2_qty: item.uom2_qty,
      qty_2: item.qty_2,
      uomTwo: item.uomTwo,
      uom3: item.uom3,
      uom3_qty: item.uom3_qty,
      qty_3: item.qty_3,
      uomThree: item.uomThree
    })

    // ✅ Try multiple property names for UOM quantities
    const secondaryQty = parseFloat(
      item.uom2_qty || 
      item.qty_2 || 
      item.uom2Qty || 
      item.secondaryQty ||
      item.uomTwo?.qty ||
      0
    )

    const tertiaryQty = parseFloat(
      item.uom3_qty || 
      item.qty_3 || 
      item.uom3Qty || 
      item.tertiaryQty ||
      item.uomThree?.qty ||
      0
    )

    console.log(`   Parsed: secondaryQty=${secondaryQty}, tertiaryQty=${tertiaryQty}`)

    // Build structure
    const uomStructure: any = {
      primary: {
        id: item.skuUOM || item.uom1?.id || item.uom1 || 1,
        name: item.uom1?.uom || item.uom1_name || item.primaryUomName || 'Pcs',
        qty: 1
      }
    }

    // ✅ Add secondary if available
    const hasSecondary = item.uom2 || item.uomTwo || item.uom2_id
    if (hasSecondary && secondaryQty > 0) {
      uomStructure.secondary = {
        id: item.uom2 || item.uomTwo?.id || item.uom2_id || 2,
        name: item.uomTwo?.uom || item.uom2_name || item.secondaryUomName || 'Box',
        qty: secondaryQty
      }
      console.log('   ✅ Secondary added:', uomStructure.secondary)
    } else {
      console.log(`   ❌ Secondary NOT added: hasSecondary=${!!hasSecondary}, qty=${secondaryQty}`)
    }

    // ✅ Add tertiary if available
    const hasTertiary = item.uom3 || item.uomThree || item.uom3_id
    if (hasTertiary && tertiaryQty > 0) {
      uomStructure.tertiary = {
        id: item.uom3 || item.uomThree?.id || item.uom3_id || 6,
        name: item.uomThree?.uom || item.uom3_name || item.tertiaryUomName || 'Crt',
        qty: tertiaryQty
      }
      console.log('   ✅ Tertiary added:', uomStructure.tertiary)
    } else {
      console.log(`   ❌ Tertiary NOT added: hasTertiary=${!!hasTertiary}, qty=${tertiaryQty}`)
    }

    return uomStructure
  }, [])

  // =====================================================
  // ✅ BUILD FINAL ITEMS - Use helper function
  // =====================================================
  const finalItems = useMemo(() => {
    console.log('═══════════════════════════════════════════════════')
    console.log('📦 Building finalItems from', selectedItems.length, 'selected items')

    return selectedItems.map(item => {
      const orderItem = orderDetails?.find(o => o.Item_ID === item.id)

      // ✅ Use the helper function to build UOM structure
      const uomStructure = buildUomStructure(item)

      // Check if UOM is valid
      const hasValidUom = !!uomStructure.secondary || !!uomStructure.tertiary

      return {
        id: item.id,
        itemName: item.itemName,
        sellingPrice: parseFloat(item.sellingPrice) || 0,
        purchasePrice: parseFloat(item.purchasePricePKR) || parseFloat(item.purchasePrice) || 0,
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
    })
  }, [selectedItems, orderDetails, buildUomStructure])

  // Debug final items
  useEffect(() => {
    console.log('═══════════════════════════════════════════════════')
    console.log('📋 Final Items Summary:')
    finalItems.forEach(item => {
      console.log(`  - ${item.id} (${item.itemName}):`, {
        isOrderItem: item.isOrderItem,
        hasSecondary: !!item.uomStructure.secondary,
        hasTertiary: !!item.uomStructure.tertiary,
        hasValidUom: item.hasValidUom
      })
    })
    console.log('═══════════════════════════════════════════════════')
  }, [finalItems])

  const handleItemDelete = useCallback((itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId))
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
            {/* <p className="text-sm text-gray-500 mt-0.5">
              {finalItems.filter(i => i.isOrderItem).length} from order, 
              {' '}{finalItems.filter(i => !i.isOrderItem).length} added manually
            </p> */}
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

      {/* UOM Warning */}
      {itemsWithBadUom.length > 0 && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-amber-800 text-sm font-medium">
              {itemsWithBadUom.length} item(s) missing UOM conversion setup
            </span>
            <p className="text-amber-600 text-xs mt-0.5">
              {itemsWithBadUom.map(i => `${i.itemName} (ID: ${i.id})`).join(', ')}
            </p>
            <p className="text-amber-500 text-xs mt-1">
              💡 Please update these items in Item Master with uom2_qty and uom3_qty values
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
                  {selectedItems.length} items selected
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
                preSelectedIds={selectedItems.map(i => i.id)}
                onSelectionChange={setSelectedItems}
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={() => setIsModalOpen(false)}>
                Done ({selectedItems.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
