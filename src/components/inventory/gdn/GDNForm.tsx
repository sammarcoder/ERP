

// components/gdn/GDNForm.tsx

'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2, Save, ArrowLeft, AlertCircle,
  FileText, Truck, XCircle, ShoppingCart,
  Package,
  Calendar,
  User,
  MapPin,
  Users,
  Building2
} from 'lucide-react'
import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
import { useCreateGDNMutation } from '@/store/slice/gdnApi'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import GDN_Header from './GDN_Header'
import GDN_Detail from './GDN_Detail'

interface Props {
  orderId: string
}

export default function GDNForm({ orderId }: Props) {
  const router = useRouter()

  const { data: orderResponse, isLoading, error } = useGetOrderByIdQuery(orderId)
  const [createGDN, { isLoading: isCreating }] = useCreateGDNMutation()

  const orderData = orderResponse?.data
  const orderHeader = useMemo(() => {
    if (!orderData) return null
    const { details, ...header } = orderData
    return header
  }, [orderData])
  const orderDetails = orderData?.details || []

  const [headerForm, setHeaderForm] = useState({
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Dispatch_Type: 'Local selling',
    COA_ID: null as number | null,
    COA_Name: '',
    remarks: '',
    // Cost fields - will be auto-populated from order
    labour_crt: null as number | null,
    freight_crt: null as number | null,
    bility_expense: null as number | null,
    other_expense: null as number | null,
    booked_crt: null as number | null,
    Transporter_ID: null as number | null,
    Transporter_Name: ''
  })

  const [finalDetails, setFinalDetails] = useState<any[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdGDNNumber, setCreatedGDNNumber] = useState('')

  // Auto-set Customer and Cost fields from Order
  useEffect(() => {
    if (orderHeader?.COA_ID && !headerForm.COA_ID) {
      setHeaderForm(prev => ({
        ...prev,
        COA_ID: orderHeader.COA_ID,
        COA_Name: orderHeader.account?.acName || '',
        // Auto-populate cost fields from order
        labour_crt: parseFloat(orderHeader.labour_crt) || null,
        freight_crt: parseFloat(orderHeader.freight_crt) || null,
        bility_expense: parseFloat(orderHeader.bility_expense) || null,
        other_expense: parseFloat(orderHeader.other_expense) || null,
        booked_crt: parseFloat(orderHeader.booked_crt) || null,
        Transporter_ID: orderHeader.Transporter_ID || null,
        Transporter_Name: orderHeader.transporter?.name || ''
      }))
    }
  }, [orderHeader])

  // Validation
  const isOrderApproved = orderHeader?.approved === true || orderHeader?.approved === 1
  const isNoteGenerated = orderHeader?.is_Note_generated === true

  const validItems = useMemo(() => {
    return finalDetails.filter(item =>
      item.dispatchQty?.uom1_qty > 0 &&
      item.batchno &&
      item.dispatchQty.uom1_qty <= item.selectedBatchQty
    )
  }, [finalDetails])

  const hasStockErrors = useMemo(() => {
    return finalDetails.some(item =>
      item.batchno &&
      item.dispatchQty?.uom1_qty > item.selectedBatchQty
    )
  }, [finalDetails])

  const canSubmit = useMemo(() => {
    return (
      isOrderApproved &&
      !isNoteGenerated &&
      headerForm.COA_ID &&
      validItems.length > 0 &&
      !hasStockErrors
    )
  }, [isOrderApproved, isNoteGenerated, headerForm.COA_ID, validItems, hasStockErrors])

  const grandTotal = useMemo(() => {
    return finalDetails.reduce((sum, item) => {
      return sum + ((item.dispatchQty?.uom1_qty || 0) * (item.unitPrice || 0))
    }, 0)
  }, [finalDetails])

  // Submit
  const handleSubmit = async () => {
    setShowConfirmModal(false)

    try {
      const payload = {
        stockMain: {
          Stock_Type_ID: 12,
          Date: headerForm.Date,
          COA_ID: headerForm.COA_ID,
          Status: headerForm.Status,
          Purchase_Type: headerForm.Dispatch_Type,
          Order_Main_ID: parseInt(orderId),
          Transporter_ID: headerForm.Transporter_ID || null,
          // ✅ Cost fields
          freight_crt: headerForm.freight_crt || 0,
          labour_crt: headerForm.labour_crt || 0,
          bility_expense: headerForm.bility_expense || 0,
          other_expense: headerForm.other_expense || 0,
          booked_crt: headerForm.booked_crt || 0,
          remarks: headerForm.remarks
        },
        stockDetails: validItems.map((item, idx) => ({
          Line_Id: idx + 1,
          Item_ID: item.Item_ID,
          batchno: item.batchno,
          uom1_qty: item.dispatchQty.uom1_qty,
          uom2_qty: item.dispatchQty.uom2_qty,
          uom3_qty: item.dispatchQty.uom3_qty,
          Sale_Unit: item.dispatchQty.sale_unit,
          // sale_Uom: item.dispatchQty.uomId,
          sale_Uom: item.dispatchQty.Uom_Id || 0,
          Stock_Price: item.unitPrice || 0,
          Stock_out_UOM: item.uomStructure?.primary?.id || 1,
          Stock_out_UOM_Qty: item.dispatchQty.uom1_qty,
          Stock_out_SKU_UOM: item.uomStructure?.secondary?.id || null,
          Stock_out_SKU_UOM_Qty: item.dispatchQty.uom2_qty,
          Stock_out_UOM3_Qty: item.dispatchQty.uom3_qty,
          // Discount fields from order (editable)
          Discount_A: item.Discount_A || 0,
          Discount_B: item.Discount_B || 0,
          Discount_C: item.Discount_C || 0
        }))
      }

      console.log('📤 GDN Payload:', JSON.stringify(payload, null, 2))

      const response = await createGDN(payload).unwrap()
      setCreatedGDNNumber(response.data?.gdnNumber || response.data?.Number || '')
      setShowSuccessModal(true)
    } catch (err: any) {
      alert(`❌ Error: ${err?.data?.error || err.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <span className="text-gray-600">Loading Sales Order...</span>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-semibold text-red-800 mb-2">Error Loading Order</h2>
          <Button variant="secondary" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-7 h-7 text-emerald-600" />
              Create GDN
            </h1>
          </div>
        </div>

        <Button
          variant="success"
          size="lg"
          onClick={() => setShowConfirmModal(true)}
          disabled={!canSubmit}
          loading={isCreating}
          icon={<Save className="w-5 h-5" />}
        >
          Create GDN
        </Button>
      </div>

      {/* Alerts */}
      {!isOrderApproved && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-500" />
          <div>
            <strong className="text-red-800">Order Not Approved</strong>
            <p className="text-sm text-red-600">Approve this order first.</p>
          </div>
        </div>
      )}

      {hasStockErrors && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <div>
            <strong className="text-orange-800">Stock Exceeded</strong>
            <p className="text-sm text-orange-600">Some items exceed available stock.</p>
          </div>
        </div>
      )}

      {/* Order Info */}
      <div className='border-2 border-emerald-200 rounded-xl p-5 mb-6'>
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between flex-wrap gap-6 ">

            {/* Order Number */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Order</span>
                <p className="text-base font-semibold text-gray-900">{orderHeader?.Number || '-'}</p>
              </div>
            </div>

            {/* Items Count */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Items</span>
                <p className="text-base font-semibold text-gray-900">{orderDetails.length}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</span>
                <p className="text-base font-semibold text-gray-900">
                  {orderHeader?.Date ? new Date(orderHeader.Date).toLocaleDateString('en-GB') : '-'}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <User className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Customer</span>
                <p className="text-base font-semibold text-gray-900">{orderHeader?.account?.acName || '-'}</p>
              </div>
            </div>

            {/* City */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <MapPin className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">City</span>
                <p className="text-base font-semibold text-gray-900">{orderHeader?.account?.city || '-'}</p>
              </div>
            </div>

            {/* Sub Customer */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Users className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sub Customer</span>
                <p className="text-base font-semibold text-gray-900">{orderHeader?.sub_customer || '-'}</p>
              </div>
            </div>

            {/* Sub City */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sub City</span>
                <p className="text-base font-semibold text-gray-900">{orderHeader?.sub_city || '-'}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Header Form */}
        <GDN_Header
          data={orderHeader}
          formData={headerForm}
          onFormChange={setHeaderForm}
        />
      </div>


      {/* Detail Items - CREATE MODE */}
      <GDN_Detail
        orderDetails={orderDetails}
        onDetailChange={setFinalDetails}
        mode="create"
      />
      {/* Modals */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Create GDN"
        message={`Dispatch ${validItems.length} items? Stock will be deducted.`}
        confirmText="Create GDN"
        type="warning"
        loading={isCreating}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => { setShowSuccessModal(false); router.push('/inventory/gdn') }}
        onConfirm={() => { setShowSuccessModal(false); router.push('/inventory/gdn') }}
        title="GDN Created!"
        message={`GDN ${createdGDNNumber} created successfully.`}
        confirmText="View GDN List"
        type="info"
      />
    </div>
  )
}
