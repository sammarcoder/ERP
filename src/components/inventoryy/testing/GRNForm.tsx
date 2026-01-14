// components/grn/GRNForm.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Loader2, Save, ArrowLeft, AlertCircle, Package, 
  FileText, Calendar, User, Hash, CheckCircle, XCircle
} from 'lucide-react'
import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
import { useCreateGRNMutation } from '@/store/slice/grnApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import Stk_Header from './Stk_Header'
import Stk_Detail from './Stk_Detail'

interface Props {
  orderId: string
}

export default function GRNForm({ orderId }: Props) {
  const router = useRouter()

  // =====================================================
  // API HOOKS
  // =====================================================
  const { data: orderResponse, isLoading, error } = useGetOrderByIdQuery(orderId)
  const [createGRN, { isLoading: isCreating }] = useCreateGRNMutation()

  const orderData = orderResponse?.data
  const orderHeader = useMemo(() => {
    if (!orderData) return null
    const { details, ...header } = orderData
    return header
  }, [orderData])
  const orderDetails = orderData?.details || []

  // =====================================================
  // STATE
  // =====================================================
  const [headerForm, setHeaderForm] = useState({
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Purchase_Type: 'Local',
    COA_ID: null as number | null,
    COA_Name: '',
    batchno: null as number | null,
    remarks: ''
  })

  const [finalDetails, setFinalDetails] = useState<any[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdGRNNumber, setCreatedGRNNumber] = useState('')

  // =====================================================
  // AUTO-SET COA FROM ORDER
  // =====================================================
  useEffect(() => {
    if (orderHeader?.COA_ID && !headerForm.COA_ID) {
      setHeaderForm(prev => ({
        ...prev,
        COA_ID: orderHeader.COA_ID,
        COA_Name: orderHeader.account?.acName || '',
        batchno: orderHeader.COA_ID
      }))
    }
  }, [orderHeader])

  // =====================================================
  // VALIDATION
  // =====================================================
  const isOrderApproved = orderHeader?.approved === true || orderHeader?.approved === 1
  const isNoteGenerated = orderHeader?.is_Note_generated === true || orderHeader?.is_Note_generated === 1
  
  const validItems = useMemo(() => {
    return finalDetails.filter(item => item.grnQty?.uom1_qty > 0)
  }, [finalDetails])

  const canSubmit = useMemo(() => {
    return (
      isOrderApproved &&
      !isNoteGenerated &&
      finalDetails.length > 0 &&
      headerForm.COA_ID &&
      validItems.length > 0
    )
  }, [isOrderApproved, isNoteGenerated, finalDetails, headerForm.COA_ID, validItems])

  const grandTotal = useMemo(() => {
    return finalDetails.reduce((sum, item) => {
      return sum + ((item.grnQty?.uom1_qty || 0) * (item.unitPrice || 0))
    }, 0)
  }, [finalDetails])

  // =====================================================
  // SUBMIT HANDLER
  // =====================================================
  const handleSubmit = async () => {
    setShowConfirmModal(false)

    if (!headerForm.COA_ID) {
      alert('Please select a supplier!')
      return
    }

    const batchnoInt = parseInt(String(headerForm.COA_ID), 10)

    try {
      const payload = {
        stockMain: {
          Stock_Type_ID: 11,
          Date: headerForm.Date,
          COA_ID: headerForm.COA_ID,
          Status: headerForm.Status,
          Purchase_Type: headerForm.Purchase_Type,
          Order_Main_ID: parseInt(orderId),
          Transporter_ID: orderHeader?.Transporter_ID || null,
          labour_crt: parseFloat(orderHeader?.labour_crt) || 0,
          freight_crt: parseFloat(orderHeader?.freight_crt) || 0,
          other_expense: parseFloat(orderHeader?.other_expense) || 0,
          remarks: headerForm.remarks
        },
        stockDetails: validItems.map((item, idx) => ({
          Line_Id: idx + 1,
          Item_ID: item.Item_ID,
          batchno: batchnoInt,
          uom1_qty: item.grnQty.uom1_qty,
          uom2_qty: item.grnQty.uom2_qty,
          uom3_qty: item.grnQty.uom3_qty,
          Sale_Unit: item.grnQty.sale_unit,
          sale_Uom: item.grnQty.Uom_Id,
          Stock_Price: item.unitPrice || 0,
          Stock_In_UOM: item.uomStructure?.primary?.id || 1,
          Stock_In_UOM_Qty: item.grnQty.uom1_qty,
          Stock_In_SKU_UOM: item.uomStructure?.secondary?.id || null,
          Stock_In_SKU_UOM_Qty: item.grnQty.uom2_qty,
          Stock_In_UOM3_Qty: item.grnQty.uom3_qty
        }))
      }

      const response = await createGRN(payload).unwrap()
      setCreatedGRNNumber(response.data?.grnNumber || response.data?.Number || '')
      setShowSuccessModal(true)
    } catch (err: any) {
      alert(`❌ Error: ${err?.data?.error || err.message}`)
    }
  }

  // =====================================================
  // LOADING STATE
  // =====================================================
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#4c96dc]" />
        <span className="text-gray-600 font-medium">Loading Order {orderId}...</span>
      </div>
    )
  }

  // =====================================================
  // ERROR STATE
  // =====================================================
  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Order</h2>
          <p className="text-red-600 mb-4">Could not load order data. Please try again.</p>
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Not Found</h2>
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* ============ HEADER ============ */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create GRN</h1>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FileText className="w-4 h-4" />
              Order: <span className="font-medium text-[#4c96dc]">{orderHeader?.Number}</span>
            </p>
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
          Create GRN
        </Button>
      </div>

      {/* ============ VALIDATION ALERTS ============ */}
      {!isOrderApproved && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Order Not Approved</h3>
            <p className="text-sm text-red-600">This order must be approved before creating a GRN.</p>
          </div>
        </div>
      )}

      {isNoteGenerated && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">GRN Already Generated</h3>
            <p className="text-sm text-yellow-600">A GRN has already been created for this order.</p>
          </div>
        </div>
      )}

      {/* ============ ORDER INFO CARD ============ */}
      <div className="bg-gradient-to-r from-[#4c96dc]/10 to-[#4c96dc]/5 border border-[#4c96dc]/20 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-[#4c96dc] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Order Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <InfoItem 
            icon={<Hash className="w-4 h-4" />}
            label="Order #" 
            value={orderHeader?.Number} 
          />
          <InfoItem 
            icon={<Calendar className="w-4 h-4" />}
            label="Order Date" 
            value={new Date(orderHeader?.Date).toLocaleDateString('en-GB')} 
          />
          <InfoItem 
            icon={<User className="w-4 h-4" />}
            label="Supplier" 
            value={orderHeader?.account?.acName} 
          />
          <InfoItem 
            label="Status" 
            value={orderHeader?.Next_Status}
            badge
            badgeColor={orderHeader?.Next_Status === 'Complete' ? 'green' : 'yellow'}
          />
          <InfoItem 
            label="Approved" 
            value={isOrderApproved ? 'Yes' : 'No'}
            badge
            badgeColor={isOrderApproved ? 'green' : 'red'}
          />
          <InfoItem 
            label="Items" 
            value={`${orderDetails.length} items`} 
          />
        </div>
      </div>

      {/* ============ STK HEADER ============ */}
      <Stk_Header
        data={orderHeader}
        formData={headerForm}
        onFormChange={setHeaderForm}
        isGRN={true}
      />

      {/* ============ STK DETAIL ============ */}
      <Stk_Detail
        orderDetails={orderDetails}
        onDetailChange={setFinalDetails}
        globalBatch={headerForm.batchno}
        globalBatchName={headerForm.COA_Name}
      />

      {/* ============ SUMMARY CARD ============ */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Items"
            value={finalDetails.length}
            color="blue"
          />
          <SummaryCard
            label="Items with Qty"
            value={validItems.length}
            color="green"
          />
          <SummaryCard
            label="Batch No"
            value={headerForm.batchno || '-'}
            color="purple"
          />
          <SummaryCard
            label="Grand Total"
            value={grandTotal.toLocaleString()}
            color="emerald"
            large
          />
        </div>
      </div>

      {/* ============ CONFIRM MODAL ============ */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Create GRN"
        message={`You are about to create a GRN for Order ${orderHeader?.Number} with ${validItems.length} items. This will update the order status. Continue?`}
        confirmText="Create GRN"
        cancelText="Cancel"
        type="info"
        loading={isCreating}
      />

      {/* ============ SUCCESS MODAL ============ */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          router.push('/inventoryy/grn')
        }}
        onConfirm={() => {
          setShowSuccessModal(false)
          router.push('/inventoryy/grn')
        }}
        title="GRN Created Successfully"
        message={`GRN ${createdGRNNumber} has been created successfully.`}
        confirmText="View GRN List"
        cancelText="Close"
        type="info"
      />
    </div>
  )
}

// =====================================================
// HELPER COMPONENTS
// =====================================================

function InfoItem({ 
  icon, 
  label, 
  value, 
  badge, 
  badgeColor 
}: { 
  icon?: React.ReactNode
  label: string
  value: any
  badge?: boolean
  badgeColor?: 'green' | 'yellow' | 'red'
}) {
  const badgeColors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800'
  }

  return (
    <div>
      <span className="text-xs text-gray-500 flex items-center gap-1">
        {icon}
        {label}
      </span>
      {badge ? (
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColors[badgeColor || 'yellow']}`}>
          {value || '-'}
        </span>
      ) : (
        <p className="font-medium text-gray-900 mt-1">{value || '-'}</p>
      )}
    </div>
  )
}

function SummaryCard({ 
  label, 
  value, 
  color, 
  large 
}: { 
  label: string
  value: any
  color: 'blue' | 'green' | 'purple' | 'emerald'
  large?: boolean
}) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  }

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <span className="text-xs opacity-80">{label}</span>
      <p className={`font-bold ${large ? 'text-2xl' : 'text-xl'} mt-1`}>{value}</p>
    </div>
  )
}
