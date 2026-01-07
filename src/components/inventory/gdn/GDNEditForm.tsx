// // components/gdn/GDNEditForm.tsx

// 'use client'
// import { useState, useEffect, useMemo, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { 
//   Loader2, Save, ArrowLeft, AlertCircle, Package, 
//   Trash2, Plus, X, Tag, FileText, Truck
// } from 'lucide-react'
// import { useGetGDNByIdQuery, useUpdateGDNMutation } from '@/store/slice/gdnApi'
// import { useGetAllItemsQuery } from '@/store/slice/itemsApi'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
// import UomConverter from '@/components/inventoryy/testing/UomConverter'

// interface Props {
//   gdnId: string
// }

// export default function GDNEditForm({ gdnId }: Props) {
//   const router = useRouter()

//   // API Hooks
//   const { data: gdnResponse, isLoading, error } = useGetGDNByIdQuery(gdnId)
//   const [updateGDN, { isLoading: isUpdating }] = useUpdateGDNMutation()
//   const { data: itemsResponse, isLoading: itemsLoading } = useGetAllItemsQuery({ limit: 1000 })

//   const gdnData = gdnResponse?.data
//   const allItems = itemsResponse?.data || []

//   // State
//   const [headerForm, setHeaderForm] = useState({
//     Date: '',
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling',
//     COA_ID: null as number | null,
//     COA_Name: '',
//     batchno: null as number | null,
//     remarks: ''
//   })

//   const [detailRows, setDetailRows] = useState<any[]>([])
//   const [isInitialized, setIsInitialized] = useState(false)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedItemsForModal, setSelectedItemsForModal] = useState<any[]>([])
//   const [showConfirmModal, setShowConfirmModal] = useState(false)

//   // Build UOM Structure Helper
//   const buildUomStructure = useCallback((item: any) => {
//     const secondaryQty = parseFloat(item?.uom2_qty || item?.qty_2 || 0)
//     const tertiaryQty = parseFloat(item?.uom3_qty || item?.qty_3 || 0)

//     const uomStructure: any = {
//       primary: {
//         id: item?.skuUOM || item?.uom1?.id || 1,
//         name: item?.uom1?.uom || 'Pcs',
//         qty: 1
//       }
//     }

//     if ((item?.uom2 || item?.uomTwo) && secondaryQty > 0) {
//       uomStructure.secondary = {
//         id: item?.uom2 || item?.uomTwo?.id || 2,
//         name: item?.uomTwo?.uom || 'Box',
//         qty: secondaryQty
//       }
//     }

//     if ((item?.uom3 || item?.uomThree) && tertiaryQty > 0) {
//       uomStructure.tertiary = {
//         id: item?.uom3 || item?.uomThree?.id || 6,
//         name: item?.uomThree?.uom || 'Crt',
//         qty: tertiaryQty
//       }
//     }

//     return uomStructure
//   }, [])

//   // Initialize form
//   useEffect(() => {
//     if (gdnData && allItems.length > 0 && !isInitialized) {
//       setHeaderForm({
//         Date: gdnData.Date?.split('T')[0] || new Date().toISOString().split('T')[0],
//         Status: gdnData.Status || 'UnPost',
//         Dispatch_Type: gdnData.Purchase_Type || 'Local selling',
//         COA_ID: gdnData.COA_ID,
//         COA_Name: gdnData.account?.acName || '',
//         batchno: gdnData.COA_ID,
//         remarks: gdnData.remarks || ''
//       })

//       if (gdnData.details?.length > 0) {
//         const rows = gdnData.details.map((detail: any, idx: number) => {
//           const fullItem = allItems.find((item: any) => item.id === detail.Item_ID)
//           const itemForUom = fullItem || detail.item || {}
//           const uomStructure = buildUomStructure(itemForUom)

//           return {
//             lineIndex: idx,
//             Item_ID: detail.Item_ID,
//             itemName: fullItem?.itemName || detail.item?.itemName || `Item ${detail.Item_ID}`,
//             unitPrice: parseFloat(detail.Stock_Price) || 0,
//             uomStructure,
//             batchNumber: detail.batchno,
//             gdnQty: {
//               uom1_qty: parseFloat(detail.Stock_out_UOM_Qty || detail.uom1_qty) || 0,
//               uom2_qty: parseFloat(detail.Stock_out_SKU_UOM_Qty || detail.uom2_qty) || 0,
//               uom3_qty: parseFloat(detail.Stock_out_UOM3_Qty || detail.uom3_qty) || 0,
//               sale_unit: parseInt(detail.Sale_Unit) || 1,
//               Uom_Id: detail.sale_Uom || 0
//             }
//           }
//         })

//         setDetailRows(rows)
//         const selectedIds = gdnData.details.map((d: any) => d.Item_ID)
//         setSelectedItemsForModal(allItems.filter((item: any) => selectedIds.includes(item.id)))
//       }

//       setIsInitialized(true)
//     }
//   }, [gdnData, allItems, isInitialized, buildUomStructure])

//   // Handlers
//   const handleCoaChange = useCallback((selectedId: string | number, selectedOption: any) => {
//     const coaIdInt = selectedId ? parseInt(String(selectedId), 10) : null
//     setHeaderForm(prev => ({
//       ...prev,
//       COA_ID: coaIdInt,
//       COA_Name: selectedOption?.name || '',
//       batchno: coaIdInt
//     }))
//   }, [])

//   const handleUomChange = useCallback((itemId: number, uomData: any) => {
//     setDetailRows(prev => prev.map(row =>
//       row.Item_ID === itemId ? { ...row, gdnQty: uomData } : row
//     ))
//   }, [])

//   const handlePriceChange = useCallback((itemId: number, price: string) => {
//     setDetailRows(prev => prev.map(row =>
//       row.Item_ID === itemId ? { ...row, unitPrice: parseFloat(price) || 0 } : row
//     ))
//   }, [])

//   const handleDeleteRow = useCallback((itemId: number) => {
//     setDetailRows(prev => prev.filter(row => row.Item_ID !== itemId))
//     setSelectedItemsForModal(prev => prev.filter(item => item.id !== itemId))
//   }, [])

//   const handleAddItemsFromModal = useCallback(() => {
//     const existingIds = detailRows.map(r => r.Item_ID)
//     const newItems = selectedItemsForModal.filter(item => !existingIds.includes(item.id))

//     const newRows = newItems.map((item, idx) => {
//       const uomStructure = buildUomStructure(item)

//       return {
//         lineIndex: detailRows.length + idx,
//         Item_ID: item.id,
//         itemName: item.itemName,
//         unitPrice: parseFloat(item.sellingPrice) || 0,
//         uomStructure,
//         batchNumber: headerForm.batchno,
//         gdnQty: {
//           uom1_qty: 0,
//           uom2_qty: 0,
//           uom3_qty: 0,
//           sale_unit: uomStructure.tertiary ? 3 : uomStructure.secondary ? 2 : 1,
//           Uom_Id: 0
//         }
//       }
//     })

//     setDetailRows(prev => [...prev, ...newRows])
//     setIsModalOpen(false)
//   }, [detailRows, selectedItemsForModal, headerForm.batchno, buildUomStructure])

//   // Submit
//   const handleSubmit = async () => {
//     setShowConfirmModal(false)

//     const validItems = detailRows.filter(row => row.gdnQty?.uom1_qty > 0)
//     if (validItems.length === 0) {
//       alert('Please enter quantities!')
//       return
//     }

//     if (!headerForm.COA_ID) {
//       alert('Please select a customer!')
//       return
//     }

//     const batchnoInt = parseInt(String(headerForm.COA_ID), 10)

//     try {
//       const payload = {
//         id: gdnId,
//         stockMain: {
//           COA_ID: headerForm.COA_ID,
//           Date: headerForm.Date,
//           Status: headerForm.Status,
//           Purchase_Type: headerForm.Dispatch_Type,
//           remarks: headerForm.remarks
//         },
//         stockDetails: validItems.map((row, idx) => ({
//           Line_Id: idx + 1,
//           Item_ID: row.Item_ID,
//           batchno: batchnoInt,
//           uom1_qty: row.gdnQty.uom1_qty,
//           uom2_qty: row.gdnQty.uom2_qty,
//           uom3_qty: row.gdnQty.uom3_qty,
//           Sale_Unit: row.gdnQty.sale_unit,
//           sale_Uom: row.gdnQty.Uom_Id,
//           Stock_Price: row.unitPrice || 0,
//           Stock_In_UOM: row.uomStructure?.primary?.id || 1,
//           Stock_In_UOM_Qty: row.gdnQty.uom1_qty,
//           Stock_In_SKU_UOM: row.uomStructure?.secondary?.id || null,
//           Stock_In_SKU_UOM_Qty: row.gdnQty.uom2_qty,
//           Stock_In_UOM3_Qty: row.gdnQty.uom3_qty
//         }))
//       }

//       await updateGDN(payload).unwrap()
//       alert('✅ GDN updated successfully!')
//       router.push('/inventoryy/gdn')
//     } catch (err: any) {
//       alert(`❌ Error: ${err?.data?.error || err.message}`)
//     }
//   }

//   // Calculations
//   const grandTotal = useMemo(() => {
//     return detailRows.reduce((sum, row) => sum + ((row.gdnQty?.uom1_qty || 0) * (row.unitPrice || 0)), 0)
//   }, [detailRows])

//   const canSubmit = useMemo(() => {
//     return detailRows.length > 0 && headerForm.COA_ID && detailRows.some(row => row.gdnQty?.uom1_qty > 0)
//   }, [detailRows, headerForm.COA_ID])

//   // Loading
//   if (isLoading || itemsLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen gap-3">
//         <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
//         <span className="text-gray-600">{isLoading ? 'Loading GDN...' : 'Loading items...'}</span>
//       </div>
//     )
//   }

//   // Error
//   if (error) {
//     return (
//       <div className="p-6 max-w-2xl mx-auto">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
//           <h2 className="font-semibold text-red-800 mb-2">Error Loading GDN</h2>
//           <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
//         </div>
//       </div>
//     )
//   }

//   // Posted - Cannot Edit
//   if (gdnData?.Status === 'Post') {
//     return (
//       <div className="p-6 max-w-2xl mx-auto">
//         <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
//           <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
//           <h2 className="text-lg font-semibold text-amber-800 text-center mb-2">Cannot Edit Posted GDN</h2>
//           <p className="text-amber-700 text-center text-sm mb-4">
//             GDN <strong>{gdnData.Number}</strong> is Posted. Please UnPost first to edit.
//           </p>
//           <div className="text-center">
//             <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-4">
//           <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <Truck className="w-6 h-6 text-emerald-600" />
//               Edit GDN
//             </h1>
//             <p className="text-gray-500">{gdnData?.Number}</p>
//           </div>
//         </div>
//         <Button
//           variant="success"
//           size="lg"
//           onClick={() => setShowConfirmModal(true)}
//           disabled={!canSubmit}
//           loading={isUpdating}
//           icon={<Save className="w-5 h-5" />}
//         >
//           Save Changes
//         </Button>
//       </div>

//       {/* Order Info */}
//       {gdnData?.order && (
//         <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
//           <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
//             <FileText className="w-4 h-4" /> Linked Sales Order
//           </h3>
//           <div className="grid grid-cols-4 gap-4 text-sm">
//             <div>
//               <span className="text-emerald-600">Order #:</span>
//               <p className="font-medium">{gdnData.order.Number}</p>
//             </div>
//             <div>
//               <span className="text-emerald-600">Status:</span>
//               <p className="font-medium">{gdnData.order.Next_Status}</p>
//             </div>
//             <div>
//               <span className="text-emerald-600">Approved:</span>
//               <p className="font-medium">{gdnData.order.approved ? '✅ Yes' : '❌ No'}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header Form */}
//       <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           <Truck className="w-5 h-5 text-emerald-600" />
//           GDN Details
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="lg:col-span-2">
//             <CoaSearchableInput
//               orderType="sales"
//               value={headerForm.COA_ID || ''}
//               onChange={handleCoaChange}
//               label="Customer"
//               required
//               showFilter={true}
//             />
//           </div>
//           <div className="lg:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
//             <label className="text-sm text-emerald-700">Batch Reference</label>
//             <div className="flex items-center gap-3 mt-1">
//               <span className="text-3xl font-bold text-emerald-800">{headerForm.batchno || '-'}</span>
//               <span className="text-emerald-600">{headerForm.COA_Name}</span>
//             </div>
//           </div>
//           <Input
//             type="date"
//             label="Date"
//             value={headerForm.Date}
//             onChange={(e) => setHeaderForm({ ...headerForm, Date: e.target.value })}
//           />
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={headerForm.Status}
//               onChange={(e) => setHeaderForm({ ...headerForm, Status: e.target.value })}
//               className="w-full border rounded-lg px-3 py-2"
//             >
//               <option value="UnPost">UnPost</option>
//               <option value="Post">Posted</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Type</label>
//             <select
//               value={headerForm.Dispatch_Type}
//               onChange={(e) => setHeaderForm({ ...headerForm, Dispatch_Type: e.target.value })}
//               className="w-full border rounded-lg px-3 py-2"
//             >
//               <option value="Local selling">Local Selling</option>
//               <option value="Export">Export</option>
//               <option value="Inter-branch">Inter-Branch</option>
//             </select>
//           </div>
//           <Input
//             label="Remarks"
//             value={headerForm.remarks}
//             onChange={(e) => setHeaderForm({ ...headerForm, remarks: e.target.value })}
//             placeholder="Optional..."
//           />
//         </div>
//       </div>

//       {/* Items Table */}
//       <div className="bg-white border rounded-xl overflow-hidden">
//         <div className="px-5 py-4 border-b bg-emerald-50 flex justify-between items-center">
//           <h2 className="font-semibold flex items-center gap-2">
//             <Truck className="w-5 h-5 text-emerald-600" />
//             Dispatch Items ({detailRows.length})
//           </h2>
//           <Button variant="success" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
//             Add Items
//           </Button>
//         </div>

//         {headerForm.batchno && (
//           <div className="px-5 py-3 bg-emerald-50/50 border-b flex items-center gap-2">
//             <Tag className="w-4 h-4 text-emerald-600" />
//             <span className="text-emerald-800 text-sm">
//               Batch <strong>{headerForm.batchno}</strong> ({headerForm.COA_Name})
//             </span>
//           </div>
//         )}

//         <div className="p-5">
//           {detailRows.length === 0 ? (
//             <div className="text-center py-12 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
//               <Truck className="w-12 h-12 mx-auto text-emerald-300 mb-2" />
//               <p className="text-gray-500">No items</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-emerald-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700">#</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700">Item</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700">Quantity</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700">Batch</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-700">Price</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-700">Total</th>
//                     <th className="px-4 py-3 w-12"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {detailRows.map((row, index) => (
//                     <tr key={row.Item_ID} className="hover:bg-emerald-50/30">
//                       <td className="px-4 py-3 text-gray-500">{index + 1}</td>
//                       <td className="px-4 py-3">
//                         <div className="font-medium">{row.itemName}</div>
//                         <div className="text-xs text-gray-500">ID: {row.Item_ID}</div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <UomConverter
//                           key={`uom-gdn-edit-${row.Item_ID}`}
//                           uomData={row.uomStructure}
//                           lineIndex={index}
//                           itemId={row.Item_ID}
//                           onChange={(data) => handleUomChange(row.Item_ID, data)}
//                           initialValues={{
//                             uom1_qty: String(row.gdnQty?.uom1_qty || ''),
//                             uom2_qty: String(row.gdnQty?.uom2_qty || ''),
//                             uom3_qty: String(row.gdnQty?.uom3_qty || ''),
//                             sale_unit: String(row.gdnQty?.sale_unit || '1')
//                           }}
//                         />
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-sm">
//                           {headerForm.batchno || '-'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-right">
//                         <input
//                           type="number"
//                           value={row.unitPrice || ''}
//                           onChange={(e) => handlePriceChange(row.Item_ID, e.target.value)}
//                           className="w-24 border rounded px-2 py-1 text-right"
//                         />
//                       </td>
//                       <td className="px-4 py-3 text-right font-semibold">
//                         {((row.gdnQty?.uom1_qty || 0) * (row.unitPrice || 0)).toLocaleString()}
//                       </td>
//                       <td className="px-4 py-3">
//                         <button onClick={() => handleDeleteRow(row.Item_ID)} className="p-1 text-red-500 hover:bg-red-50 rounded">
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-emerald-100">
//                   <tr>
//                     <td colSpan={5} className="px-4 py-3 text-right font-semibold text-emerald-800">Grand Total:</td>
//                     <td className="px-4 py-3 text-right font-bold text-xl text-emerald-700">
//                       {grandTotal.toLocaleString()}
//                     </td>
//                     <td></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b bg-emerald-50">
//               <h2 className="font-semibold">Select Items</h2>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-auto p-4">
//               <MultiSelectItemTable
//                 isPurchase={false}
//                 preSelectedIds={detailRows.map(r => r.Item_ID)}
//                 onSelectionChange={setSelectedItemsForModal}
//               />
//             </div>
//             <div className="flex justify-end gap-3 p-4 border-t">
//               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
//               <Button variant="success" onClick={handleAddItemsFromModal}>
//                 Add Selected ({selectedItemsForModal.length})
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Modal */}
//       <ConfirmationModal
//         isOpen={showConfirmModal}
//         onClose={() => setShowConfirmModal(false)}
//         onConfirm={handleSubmit}
//         title="Save Changes"
//         message={`Save changes to GDN ${gdnData?.Number}?`}
//         confirmText="Save"
//         type="warning"
//         loading={isUpdating}
//       />
//     </div>
//   )
// }



























































// components/gdn/GDNEditForm.tsx - FIXED MODAL

'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Loader2, Save, ArrowLeft, AlertCircle, Package, 
  Plus, X, FileText, Truck
} from 'lucide-react'
import { useGetGDNByIdQuery, useUpdateGDNMutation } from '@/store/slice/gdnApi'
import { useGetAllItemsQuery } from '@/store/slice/itemsApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { MultiSelectItemTable } from '@/components/inventoryy/testing/multiSelectable'
import GDN_Edit_Details from './GDN_Edit_Details'

interface Props {
  gdnId: string
}

export default function GDNEditForm({ gdnId }: Props) {
  const router = useRouter()

  // API Hooks
  const { data: gdnResponse, isLoading, error } = useGetGDNByIdQuery(gdnId)
  const [updateGDN, { isLoading: isUpdating }] = useUpdateGDNMutation()
  const { data: itemsResponse, isLoading: itemsLoading } = useGetAllItemsQuery({ limit: 1000 })

  const gdnData = gdnResponse?.data
  const allItems = itemsResponse?.data || []

  // State
  const [headerForm, setHeaderForm] = useState({
    Date: '',
    Status: 'UnPost',
    Dispatch_Type: 'Local selling',
    COA_ID: null as number | null,
    COA_Name: '',
    remarks: '',
    sub_customer: '',
    sub_city: '',
    labour_crt: '',
    freight_crt: '',
    other_expense: '',
    Transporter_ID: null as number | null
  })

  const [existingDetails, setExistingDetails] = useState<any[]>([])
  const [finalDetails, setFinalDetails] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingModalItems, setPendingModalItems] = useState<any[]>([]) // Store selections until Done is clicked

  // Build UOM Structure - handles both original item format AND extractItemData format from modal
  const buildUomStructure = useCallback((item: any) => {
    // Handle both formats: qty_2 (from modal) or uom2_qty (from original)
    const secondaryQty = parseFloat(item?.qty_2 || item?.uom2_qty || 0)
    const tertiaryQty = parseFloat(item?.qty_3 || item?.uom3_qty || 0)

    const uomStructure: any = {
      primary: {
        id: item?.uom1 || item?.skuUOM || item?.uom1?.id || 1,
        name: item?.uom1_name || item?.uom1?.uom || 'Pcs',
        qty: 1
      }
    }

    // Handle both: uom2_name (from modal) or uomTwo.uom (from original)
    if (item?.uom2 && secondaryQty > 0) {
      uomStructure.secondary = {
        id: item.uom2,
        name: item.uom2_name || item.uomTwo?.uom || 'Box',
        qty: secondaryQty
      }
    }

    // Handle both: uom3_name (from modal) or uomThree.uom (from original)
    if (item?.uom3 && tertiaryQty > 0) {
      uomStructure.tertiary = {
        id: item.uom3,
        name: item.uom3_name || item.uomThree?.uom || 'Crt',
        qty: tertiaryQty
      }
    }

    return uomStructure
  }, [])

  // Initialize from existing GDN
  useEffect(() => {
    if (gdnData && allItems.length > 0 && !isInitialized) {
      console.log('📋 Initializing GDN Edit Form:', gdnData.Number)

      setHeaderForm({
        Date: gdnData.Date?.split('T')[0] || new Date().toISOString().split('T')[0],
        Status: gdnData.Status || 'UnPost',
        Dispatch_Type: gdnData.Purchase_Type || 'Local selling',
        COA_ID: gdnData.COA_ID,
        COA_Name: gdnData.account?.acName || '',
        remarks: gdnData.remarks || '',
        sub_customer: gdnData.sub_customer || '',
        sub_city: gdnData.sub_city || '',
        labour_crt: gdnData.labour_crt?.toString() || '',
        freight_crt: gdnData.freight_crt?.toString() || '',
        other_expense: gdnData.other_expense?.toString() || '',
        Transporter_ID: gdnData.Transporter_ID || null
      })

      if (gdnData.details?.length > 0) {
        const rows = gdnData.details.map((detail: any, idx: number) => {
          const fullItem = allItems.find((item: any) => item.id === detail.Item_ID) || detail.item
          const uomStructure = buildUomStructure(fullItem)

          return {
            rowId: `edit-${detail.ID}-${idx}`,
            detailId: detail.ID,
            Item_ID: detail.Item_ID,
            itemName: fullItem?.itemName || detail.item?.itemName || `Item ${detail.Item_ID}`,
            uomStructure,
            sellingPrice: parseFloat(detail.Stock_Price) || parseFloat(fullItem?.sellingPrice) || 0,
            batchno: detail.batchno,
            selectedBatchQty: 0,
            dispatchQty: {
              uom1_qty: parseFloat(detail.uom1_qty) || 0,
              uom2_qty: parseFloat(detail.uom2_qty) || 0,
              uom3_qty: parseFloat(detail.uom3_qty) || 0,
              sale_unit: parseInt(detail.Sale_Unit) || 1
            },
            unitPrice: parseFloat(detail.Stock_Price) || 0,
            isExistingRow: true
          }
        })

        setExistingDetails(rows)
      }

      setIsInitialized(true)
    }
  }, [gdnData, allItems, isInitialized, buildUomStructure])

  // Open modal handler
  const handleOpenModal = useCallback(() => {
    setPendingModalItems([]) // Reset pending items when opening
    setModalOpen(true)
  }, [])

  // Handle item selection from modal - just store temporarily, don't update existingDetails
  const handleItemsSelected = useCallback((selectedItems: any[]) => {
    setPendingModalItems(selectedItems)
  }, [])

  // Apply selected items when clicking Done
  const handleModalDone = useCallback(() => {
    const existingItemIds = existingDetails.map(d => d.Item_ID)
    const newItems = pendingModalItems.filter(item => !existingItemIds.includes(item.id))

    if (newItems.length > 0) {
      const newRows = newItems.map((item, idx) => {
        const uomStructure = buildUomStructure(item)
        
        return {
          rowId: `new-${item.id}-${Date.now()}-${idx}`,
          Item_ID: item.id,
          itemName: item.itemName,
          uomStructure,
          sellingPrice: parseFloat(item.sellingPrice) || 0,
          batchno: null,
          selectedBatchQty: 0,
          dispatchQty: {
            uom1_qty: 0,
            uom2_qty: 0,
            uom3_qty: 0,
            sale_unit: 1
          },
          unitPrice: parseFloat(item.sellingPrice) || 0,
          isExistingRow: false
        }
      })

      setExistingDetails(prev => [...prev, ...newRows])
    }

    setPendingModalItems([])
    setModalOpen(false)
  }, [existingDetails, pendingModalItems, buildUomStructure])

  // Close modal without applying
  const handleCloseModal = useCallback(() => {
    setPendingModalItems([])
    setModalOpen(false)
  }, [])

  // Get selected item IDs for modal
  const selectedItemIds = useMemo(() => {
    const ids = existingDetails.map(d => d.Item_ID)
    return [...new Set(ids)]
  }, [existingDetails])

  // Validation
  const validItems = useMemo(() => {
    return finalDetails.filter(item => item.dispatchQty?.uom1_qty > 0 && item.batchno && !item.isOverDispatch)
  }, [finalDetails])

  // Check if any item exceeds available stock
  const hasOverDispatch = useMemo(() => {
    return finalDetails.some(item => item.isOverDispatch === true)
  }, [finalDetails])

  const canSubmit = useMemo(() => {
    return headerForm.COA_ID && validItems.length > 0 && !hasOverDispatch
  }, [headerForm.COA_ID, validItems, hasOverDispatch])

  const grandTotal = useMemo(() => {
    return finalDetails.reduce((sum, item) => {
      return sum + ((item.dispatchQty?.uom1_qty || 0) * (item.unitPrice || 0))
    }, 0)
  }, [finalDetails])

  // Submit
  const handleSubmit = async () => {
    setShowConfirmModal(false)

    if (validItems.length === 0) {
      alert('Please enter quantities and select batches!')
      return
    }

    try {
      const payload = {
        id: gdnId,
        stockMain: {
          COA_ID: headerForm.COA_ID,
          Date: headerForm.Date,
          Status: headerForm.Status,
          Purchase_Type: headerForm.Dispatch_Type,
          remarks: headerForm.remarks,
          sub_customer: headerForm.sub_customer,
          sub_city: headerForm.sub_city,
          Transporter_ID: headerForm.Transporter_ID,
          labour_crt: parseFloat(headerForm.labour_crt) || 0,
          freight_crt: parseFloat(headerForm.freight_crt) || 0,
          other_expense: parseFloat(headerForm.other_expense) || 0
        },
        stockDetails: validItems.map((item, idx) => ({
          Line_Id: idx + 1,
          Item_ID: item.Item_ID,
          batchno: parseInt(item.batchno),
          uom1_qty: item.dispatchQty.uom1_qty,
          uom2_qty: item.dispatchQty.uom2_qty || 0,
          uom3_qty: item.dispatchQty.uom3_qty || 0,
          Sale_Unit: item.dispatchQty.sale_unit || 1,
          sale_Uom: item.dispatchQty.Uom_Id || 0,
          Stock_Price: item.unitPrice || 0,
          Stock_out_UOM: item.uomStructure?.primary?.id || 1,
          Stock_out_UOM_Qty: item.dispatchQty.uom1_qty,
          Stock_out_SKU_UOM: item.uomStructure?.secondary?.id || null,
          Stock_out_SKU_UOM_Qty: item.dispatchQty.uom2_qty || 0,
          Stock_out_UOM3_Qty: item.dispatchQty.uom3_qty || 0
        }))
      }

      console.log('📤 GDN Update Payload:', JSON.stringify(payload, null, 2))

      await updateGDN(payload).unwrap()
      alert('✅ GDN updated successfully!')
      router.push('/inventory/gdn')
    } catch (err: any) {
      console.error('❌ Update error:', err)
      alert(`❌ Error: ${err?.data?.error || err.message}`)
    }
  }

  // Loading
  if (isLoading || itemsLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <span className="text-gray-600">{isLoading ? 'Loading GDN...' : 'Loading items...'}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-semibold text-red-800 mb-2">Error Loading GDN</h2>
          <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  if (gdnData?.Status === 'Post') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h2 className="font-semibold text-amber-800 mb-2">Cannot Edit Posted GDN</h2>
          <p className="text-amber-700 text-sm mb-4">GDN {gdnData.Number} is Posted.</p>
          <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-6 h-6 text-emerald-600" />
              Edit GDN
            </h1>
            <p className="text-gray-500">{gdnData?.Number}</p>
          </div>
        </div>
        <Button
          variant="success"
          size="lg"
          onClick={() => setShowConfirmModal(true)}
          disabled={!canSubmit}
          loading={isUpdating}
          icon={<Save className="w-5 h-5" />}
        >
          Save Changes
        </Button>
      </div>

      {/* Order Info */}
      {gdnData?.order && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Linked Sales Order
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-emerald-600">Order #:</span>
              <p className="font-medium">{gdnData.order.Number}</p>
            </div>
            <div>
              <span className="text-emerald-600">Customer:</span>
              <p className="font-medium">{gdnData.account?.acName || '-'}</p>
            </div>
            <div>
              <span className="text-emerald-600">Status:</span>
              <p className="font-medium">{gdnData.order.Next_Status}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Form */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          GDN Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Customer</label>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              <span className="font-semibold text-emerald-800">{headerForm.COA_Name || '-'}</span>
              <span className="text-xs text-emerald-600 ml-2">(ID: {headerForm.COA_ID})</span>
            </div>
          </div>
          <Input
            type="date"
            label="Date"
            value={headerForm.Date}
            onChange={(e) => setHeaderForm(prev => ({ ...prev, Date: e.target.value }))}
          />
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              value={headerForm.Status}
              onChange={(e) => setHeaderForm(prev => ({ ...prev, Status: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="UnPost">UnPost</option>
              <option value="Post">Posted</option>
            </select>
          </div>
          <Input
            label="Remarks"
            value={headerForm.remarks}
            onChange={(e) => setHeaderForm(prev => ({ ...prev, remarks: e.target.value }))}
          />
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b bg-emerald-50/50 flex justify-between items-center">
          <h2 className="font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            Dispatch Items ({existingDetails.length} rows)
          </h2>
          {/* ✅ FIXED: Use handleOpenModal */}
          <Button 
            variant="success" 
            onClick={handleOpenModal} 
            icon={<Plus className="w-4 h-4" />}
          >
            Add Items
          </Button>
        </div>

        <div className="p-5">
          <GDN_Edit_Details
            initialRows={existingDetails}
            onChange={setFinalDetails}
            dispatchId={parseInt(gdnId)}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <span className="text-xs text-emerald-600">Total Rows</span>
          <p className="text-xl font-bold text-emerald-700">{existingDetails.length}</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <span className="text-xs text-teal-600">Valid Rows</span>
          <p className="text-xl font-bold text-teal-700">{validItems.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <span className="text-xs text-green-600">Grand Total</span>
          <p className="text-2xl font-bold text-green-700">{grandTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* ✅ FIXED: Modal with proper state management */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            // Only close if clicking backdrop
            if (e.target === e.currentTarget) {
              handleCloseModal()
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent close on content click
          >
            <div className="flex justify-between items-center p-4 border-b bg-emerald-50 rounded-t-2xl">
              <h2 className="font-semibold text-lg">Add More Items</h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <MultiSelectItemTable
                isPurchase={false}
                preSelectedIds={selectedItemIds}
                onSelectionChange={handleItemsSelected}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-2xl">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleModalDone}>
                Add Selected ({pendingModalItems.filter(item => !existingDetails.map(d => d.Item_ID).includes(item.id)).length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Save GDN Changes"
        message={`Update GDN ${gdnData?.Number} with ${validItems.length} dispatch rows?`}
        confirmText="Save"
        type="warning"
        loading={isUpdating}
      />
    </div>
  )
}
