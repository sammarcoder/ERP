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
import GDN_Header from './GDN_Header'

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
  // const [headerForm, setHeaderForm] = useState({
  //   Date: '',
  //   Status: 'UnPost',
  //   Dispatch_Type: 'Local selling',
  //   COA_ID: null as number | null,
  //   COA_Name: '',
  //   remarks: '',
  //   sub_customer: '',
  //   sub_city: '',
  //   labour_crt: '',
  //   freight_crt: '',
  //   other_expense: '',
  //   Transporter_ID: null as number | null
  // })
  const [headerForm, setHeaderForm] = useState({
    Date: '',
    Status: 'UnPost',
    Dispatch_Type: 'Local selling',
    COA_ID: null as number | null,
    COA_Name: '',
    remarks: '',
    sub_customer: '',
    sub_city: '',
    labour_crt: null as number | null,
    freight_crt: null as number | null,
    bility_expense: null as number | null,
    other_expense: null as number | null,
    booked_crt: null as number | null,
    Transporter_ID: null as number | null,
    Transporter_Name: ''
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

      // setHeaderForm({
      //   Date: gdnData.Date?.split('T')[0] || new Date().toISOString().split('T')[0],
      //   Status: gdnData.Status || 'UnPost',
      //   Dispatch_Type: gdnData.Purchase_Type || 'Local selling',
      //   COA_ID: gdnData.COA_ID,
      //   COA_Name: gdnData.account?.acName || '',
      //   remarks: gdnData.remarks || '',
      //   sub_customer: gdnData.sub_customer || '',
      //   sub_city: gdnData.sub_city || '',
      //   labour_crt: gdnData.labour_crt?.toString() || '',
      //   freight_crt: gdnData.freight_crt?.toString() || '',
      //   other_expense: gdnData.other_expense?.toString() || '',
      //   Transporter_ID: gdnData.Transporter_ID || null
      // })
      // Find where you set headerForm from gdnData and replace with:
      setHeaderForm({
        Date: gdnData.Date?.split('T')[0] || '',
        Status: gdnData.Status || 'UnPost',
        Dispatch_Type: gdnData.Purchase_Type || 'Local selling',
        COA_ID: gdnData.COA_ID || null,
        COA_Name: gdnData.account?.acName || '',
        remarks: gdnData.remarks || '',
        sub_customer: gdnData.sub_customer || '',
        sub_city: gdnData.sub_city || '',
        labour_crt: gdnData.labour_crt ? parseFloat(gdnData.labour_crt) : null,
        freight_crt: gdnData.freight_crt ? parseFloat(gdnData.freight_crt) : null,
        bility_expense: gdnData.bility_expense ? parseFloat(gdnData.bility_expense) : null,
        other_expense: gdnData.other_expense ? parseFloat(gdnData.other_expense) : null,
        booked_crt: gdnData.booked_crt ? parseFloat(gdnData.booked_crt) : null,
        Transporter_ID: gdnData.Transporter_ID || null,
        Transporter_Name: gdnData.transporter?.name || ''
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
              sale_unit: parseInt(detail.Sale_Unit) || 1,
              Uom_Id: parseInt(detail.sale_Uom) || 0,
              sale_Uom: parseInt(detail.sale_Uom) || 0
            },
            unitPrice: parseFloat(detail.Stock_Price) || 0,
            // ✅ Include discount fields from existing GDN detail
            Discount_A: parseFloat(detail.Discount_A) || 0,
            Discount_B: parseFloat(detail.Discount_B) || 0,
            Discount_C: parseFloat(detail.Discount_C) || 0,
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
          labour_crt: headerForm.labour_crt ?? 0,
          freight_crt: headerForm.freight_crt ?? 0,
          bility_expense: headerForm.bility_expense ?? 0,
          other_expense: headerForm.other_expense ?? 0,
          booked_crt: headerForm.booked_crt ?? 0
        },
        stockDetails: validItems.map((item, idx) => ({
          Line_Id: idx + 1,
          Item_ID: item.Item_ID,
          batchno: parseInt(item.batchno),
          uom1_qty: item.dispatchQty.uom1_qty,
          uom2_qty: item.dispatchQty.uom2_qty || 0,
          uom3_qty: item.dispatchQty.uom3_qty || 0,
          Sale_Unit: item.dispatchQty.sale_unit || 1,
          sale_Uom: item.dispatchQty?.sale_Uom?.id || item.dispatchQty?.sale_Uom || item.dispatchQty?.Uom_Id || 0,

          Stock_out_UOM: item.uomStructure?.primary?.id || 1,

          Stock_Price: item.unitPrice || 0,
          Stock_out_UOM_Qty: item.dispatchQty.uom1_qty,
          Stock_out_SKU_UOM: item.uomStructure?.secondary?.id || null,
          Stock_out_SKU_UOM_Qty: item.dispatchQty.uom2_qty || 0,
          Stock_out_UOM3_Qty: item.dispatchQty.uom3_qty || 0,
          // ✅ Include discount fields
          Discount_A: item.Discount_A || 0,
          Discount_B: item.Discount_B || 0,
          Discount_C: item.Discount_C || 0
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
            {/* <FileText className="w-4 h-4" /> Linked Sales Order */}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
             <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Order</span>
              <p className="text-base font-semibold text-gray-900">{gdnData.order.Number}</p>
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

        {/* Header - Customer Info (Read-only) */}
        <div className="bg-white border-2 border-emerald-300 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              {/* <User className="w-5 h-5 text-emerald-600" /> */}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{headerForm.COA_Name}</h3>
              <p className="text-sm text-gray-500">Customer (from order)</p>
            </div>
          </div>

          {/* GDN Header Component */}
          <GDN_Header
            data={gdnData?.order || {}}
            formData={headerForm}
            onFormChange={setHeaderForm}
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
