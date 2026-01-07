// // components/gdn/GDN_Detail.tsx

// 'use client'
// import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
// import { Plus, X, AlertTriangle, Package, Tag, Truck } from 'lucide-react'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import { Button } from '@/components/ui/Button'
// import GDN_details_data from './GDN_details_data'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

// interface Props {
//   orderDetails: any[]
//   onDetailChange: (items: any[]) => void
//   globalBatch?: number | null
//   globalBatchName?: string
// }

// export default function GDN_Detail({
//   orderDetails,
//   onDetailChange,
//   globalBatch,
//   globalBatchName
// }: Props) {
//   const [selectedItemIds, setSelectedItemIds] = useState<number[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const initialized = useRef(false)

//   // Fetch ALL items with complete UOM data
//   const { data: itemsResponse, isLoading } = useGetAllItemsQuery({ limit: 1000 })
//   const allItems: any[] = itemsResponse?.data || []

//   // Order item IDs for auto-populate
//   const orderItemIds = useMemo(() => {
//     return orderDetails?.map(d => d.Item_ID) || []
//   }, [orderDetails])

//   // Auto-populate with order item IDs
//   useEffect(() => {
//     if (initialized.current) return
//     if (allItems.length === 0 || orderItemIds.length === 0) return

//     console.log('🚀 GDN Auto-populating order item IDs:', orderItemIds)
//     setSelectedItemIds(orderItemIds)
//     initialized.current = true
//   }, [allItems, orderItemIds])

//   // Build UOM Structure from Item
//   const buildUomStructure = useCallback((item: any) => {
//     if (!item) return { primary: { id: 1, name: 'Pcs', qty: 1 } }

//     const secondaryQty = parseFloat(item.uom2_qty || item.qty_2 || 0)
//     const tertiaryQty = parseFloat(item.uom3_qty || item.qty_3 || 0)

//     const uomStructure: any = {
//       primary: {
//         id: item.skuUOM || item.uom1?.id || 1,
//         name: item.uom1?.uom || 'Pcs',
//         qty: 1
//       }
//     }

//     if (item.uom2 && secondaryQty > 0) {
//       uomStructure.secondary = {
//         id: item.uom2,
//         name: item.uomTwo?.uom || 'Box',
//         qty: secondaryQty
//       }
//     }

//     if (item.uom3 && tertiaryQty > 0) {
//       uomStructure.tertiary = {
//         id: item.uom3,
//         name: item.uomThree?.uom || 'Crt',
//         qty: tertiaryQty
//       }
//     }

//     return uomStructure
//   }, [])

//   // Build Final Items from allItems using IDs
//   const finalItems = useMemo(() => {
//     return selectedItemIds.map(itemId => {
//       const fullItem = allItems.find(item => item.id === itemId)
//       if (!fullItem) return null

//       const orderItem = orderDetails?.find(o => o.Item_ID === itemId)
//       const uomStructure = buildUomStructure(fullItem)
//       const hasValidUom = !!uomStructure.secondary || !!uomStructure.tertiary

//       return {
//         id: fullItem.id,
//         itemName: fullItem.itemName,
//         sellingPrice: parseFloat(fullItem.sellingPrice) || 0,
//         purchasePrice: parseFloat(fullItem.purchasePricePKR) || 0,
//         uomStructure,
//         orderQty: orderItem ? {
//           uom1_qty: orderItem.uom1_qty || '0',
//           uom2_qty: orderItem.uom2_qty || '0',
//           uom3_qty: orderItem.uom3_qty || '0',
//           sale_unit: String(orderItem.sale_unit || '3'),
//           Uom_Id: orderItem.Uom_Id || 0
//         } : null,
//         isOrderItem: !!orderItem,
//         hasValidUom
//       }
//     }).filter(Boolean)
//   }, [selectedItemIds, allItems, orderDetails, buildUomStructure])

//   // Handle Modal Selection
//   const handleModalSelectionChange = useCallback((selectedItems: any[]) => {
//     const ids = selectedItems.map(item => item.id || item.ID).filter(Boolean)
//     setSelectedItemIds(ids)
//   }, [])

//   const handleItemDelete = useCallback((itemId: number) => {
//     setSelectedItemIds(prev => prev.filter(id => id !== itemId))
//   }, [])

//   const itemsWithBadUom = finalItems.filter(item => !item.hasValidUom)

//   if (isLoading) {
//     return (
//       <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
//         <Package className="w-8 h-8 animate-pulse text-emerald-600 mx-auto mb-2" />
//         <span className="text-gray-500">Loading items...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <Truck className="w-5 h-5 text-emerald-600" />
//               Dispatch Items ({finalItems.length})
//             </h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               {finalItems.filter(i => i.isOrderItem).length} from order,
//               {' '}{finalItems.filter(i => !i.isOrderItem).length} added manually
//             </p>
//           </div>
//           <Button
//             variant="success"
//             size="md"
//             onClick={() => setIsModalOpen(true)}
//             icon={<Plus className="w-4 h-4" />}
//           >
//             Add Items
//           </Button>
//         </div>
//       </div>

//       {/* Batch Info */}
//       {globalBatch && (
//         <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
//           <Tag className="w-4 h-4 text-emerald-600" />
//           <span className="text-emerald-800 text-sm">
//             Batch <strong className="text-lg">{globalBatch}</strong>
//             <span className="text-emerald-600 ml-2">({globalBatchName})</span>
//             <span className="text-emerald-500 ml-2">→ Applied to all dispatch items</span>
//           </span>
//         </div>
//       )}

//       {/* UOM Warning */}
//       {itemsWithBadUom.length > 0 && (
//         <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
//           <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
//           <div>
//             <span className="text-amber-800 text-sm font-medium">
//               {itemsWithBadUom.length} item(s) missing UOM conversion setup
//             </span>
//             <p className="text-amber-600 text-xs mt-0.5">
//               {itemsWithBadUom.map(i => `${i.itemName} (ID: ${i.id})`).join(', ')}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       <div className="p-5">
//         <GDN_details_data
//           items={finalItems}
//           onChange={onDetailChange}
//           onDelete={handleItemDelete}
//           globalBatch={globalBatch}
//           globalBatchName={globalBatchName}
//         />
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
//             <div className="flex justify-between items-center px-6 py-4 border-b bg-emerald-50">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Select Items for Dispatch</h2>
//                 <p className="text-sm text-gray-500">
//                   {selectedItemIds.length} items selected
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-auto p-4">
//               <MultiSelectItemTable
//                 isPurchase={false}  // ✅ Sales mode
//                 preSelectedIds={selectedItemIds}
//                 onSelectionChange={handleModalSelectionChange}
//               />
//             </div>
//             <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
//               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button variant="success" onClick={() => setIsModalOpen(false)}>
//                 Done ({selectedItemIds.length})
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
















































//workign  good

// components/gdn/GDN_Detail.tsx

'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Plus, X, AlertTriangle, Package, Truck } from 'lucide-react'
import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
import { Button } from '@/components/ui/Button'
import GDN_details_data from './GDN_details_data'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'

interface Props {
  orderDetails: any[]
  onDetailChange: (items: any[]) => void
  mode: 'create' | 'edit'
  dispatchId?: number  // Required for edit mode
}

export default function GDN_Detail({
  orderDetails,
  onDetailChange,
  mode,
  dispatchId
}: Props) {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const initialized = useRef(false)

  // Fetch ALL items
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

    setSelectedItemIds(orderItemIds)
    initialized.current = true
  }, [allItems, orderItemIds])

  // Build UOM Structure
  const buildUomStructure = useCallback((item: any) => {
    if (!item) return { primary: { id: 1, name: 'Pcs', qty: 1 } }

    const secondaryQty = parseFloat(item.uom2_qty || 0)
    const tertiaryQty = parseFloat(item.uom3_qty || 0)

    const uomStructure: any = {
      primary: {
        id: item.skuUOM || item.uom1?.id || 1,
        name: item.uom1?.uom || 'Pcs',
        qty: 1
      }
    }

    if (item.uom2 && secondaryQty > 0) {
      uomStructure.secondary = {
        id: item.uom2,
        name: item.uomTwo?.uom || 'Box',
        qty: secondaryQty
      }
    }

    if (item.uom3 && tertiaryQty > 0) {
      uomStructure.tertiary = {
        id: item.uom3,
        name: item.uomThree?.uom || 'Crt',
        qty: tertiaryQty
      }
    }

    return uomStructure
  }, [])

  // Build Final Items
  const finalItems = useMemo(() => {
    return selectedItemIds.map(itemId => {
      const fullItem = allItems.find(item => item.id === itemId)
      if (!fullItem) return null

      const orderItem = orderDetails?.find(o => o.Item_ID === itemId)
      const uomStructure = buildUomStructure(fullItem)

      return {
        id: fullItem.id,
        itemName: fullItem.itemName,
        sellingPrice: parseFloat(fullItem.sellingPrice) || 0,
        uomStructure,
        orderQty: orderItem ? {
          uom1_qty: orderItem.uom1_qty || '0',
          uom2_qty: orderItem.uom2_qty || '0',
          uom3_qty: orderItem.uom3_qty || '0',
          sale_unit: String(orderItem.sale_unit || '1'),
        } : null,
        isOrderItem: !!orderItem
      }
    }).filter(Boolean)
  }, [selectedItemIds, allItems, orderDetails, buildUomStructure])

  const handleModalSelectionChange = useCallback((selectedItems: any[]) => {
    setSelectedItemIds(selectedItems.map(item => item.id).filter(Boolean))
  }, [])

  const handleItemDelete = useCallback((itemId: number) => {
    setSelectedItemIds(prev => prev.filter(id => id !== itemId))
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white border rounded-xl p-8 text-center">
        <Package className="w-8 h-8 animate-pulse text-emerald-600 mx-auto mb-2" />
        <span className="text-gray-500">Loading items...</span>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-emerald-300 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-emerald-50/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Dispatch Items ({finalItems.length})
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Mode: <span className="font-medium">{mode === 'edit' ? 'Edit' : 'Create'}</span>
            </p>
          </div>
          <Button
            variant="success"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Items
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className=" ">
        <div className='px-6 border border-emerald-300  flex justify-between items-center mb-6 px-12'>
          <div className='flex justify-between py-2 w-[20%]'>
            <div className='text-emerald-800'>item</div>
            <div className='text-emerald-800'>Stock</div>
          </div>

          <div className='text-emerald-800'>Available Qty</div>
          <div className='text-emerald-800'>Uom</div>
          <div className='text-emerald-800'>Actions</div>
        </div>
        <GDN_details_data
          items={finalItems}
          onChange={onDetailChange}
          onDelete={handleItemDelete}
          mode={mode}
          dispatchId={dispatchId}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-emerald-50">
              <h2 className="text-lg font-semibold">Select Items</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MultiSelectItemTable
                isPurchase={false}
                preSelectedIds={selectedItemIds}
                onSelectionChange={handleModalSelectionChange}
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
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
