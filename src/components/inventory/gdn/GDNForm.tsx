// // components/gdn/GDNForm.tsx

// 'use client'
// import { useState, useEffect, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import { 
//   Loader2, Save, ArrowLeft, AlertCircle, Package, 
//   FileText, Calendar, User, Hash, XCircle, Truck, ShoppingCart
// } from 'lucide-react'
// import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
// import { useCreateGDNMutation } from '@/store/test/gdnApi'
// import { Button } from '@/components/ui/Button'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import GDN_Header from './GDN_Header'
// import GDN_Detail from './GDN_Detail'

// interface Props {
//   orderId: string
// }

// export default function GDNForm({ orderId }: Props) {
//   const router = useRouter()

//   // API Hooks
//   const { data: orderResponse, isLoading, error } = useGetOrderByIdQuery(orderId)
//   const [createGDN, { isLoading: isCreating }] = useCreateGDNMutation()

//   const orderData = orderResponse?.data
//   const orderHeader = useMemo(() => {
//     if (!orderData) return null
//     const { details, ...header } = orderData
//     return header
//   }, [orderData])
//   const orderDetails = orderData?.details || []

//   // State
//   const [headerForm, setHeaderForm] = useState({
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling',
//     COA_ID: null as number | null,
//     COA_Name: '',
//     batchno: null as number | null,
//     remarks: ''
//   })

//   const [finalDetails, setFinalDetails] = useState<any[]>([])
//   const [showConfirmModal, setShowConfirmModal] = useState(false)
//   const [showSuccessModal, setShowSuccessModal] = useState(false)
//   const [createdGDNNumber, setCreatedGDNNumber] = useState('')

//   // Auto-set Customer from Order
//   useEffect(() => {
//     if (orderHeader?.COA_ID && !headerForm.COA_ID) {
//       setHeaderForm(prev => ({
//         ...prev,
//         COA_ID: orderHeader.COA_ID,
//         COA_Name: orderHeader.account?.acName || '',
//         batchno: orderHeader.COA_ID
//       }))
//     }
//   }, [orderHeader])

//   // Validation
//   const isOrderApproved = orderHeader?.approved === true || orderHeader?.approved === 1
//   const isNoteGenerated = orderHeader?.is_Note_generated === true || orderHeader?.is_Note_generated === 1

//   const validItems = useMemo(() => {
//     return finalDetails.filter(item => item.gdnQty?.uom1_qty > 0)
//   }, [finalDetails])

//   const canSubmit = useMemo(() => {
//     return (
//       isOrderApproved &&
//       !isNoteGenerated &&
//       finalDetails.length > 0 &&
//       headerForm.COA_ID &&
//       validItems.length > 0
//     )
//   }, [isOrderApproved, isNoteGenerated, finalDetails, headerForm.COA_ID, validItems])

//   const grandTotal = useMemo(() => {
//     return finalDetails.reduce((sum, item) => {
//       return sum + ((item.gdnQty?.uom1_qty || 0) * (item.unitPrice || 0))
//     }, 0)
//   }, [finalDetails])

//   // Submit Handler
//   const handleSubmit = async () => {
//     setShowConfirmModal(false)

//     if (!headerForm.COA_ID) {
//       alert('Please select a customer!')
//       return
//     }

//     const batchnoInt = parseInt(String(headerForm.COA_ID), 10)

//     try {
//       const payload = {
//         stockMain: {
//           Stock_Type_ID: 12,  // ✅ GDN
//           Date: headerForm.Date,
//           COA_ID: headerForm.COA_ID,
//           Status: headerForm.Status,
//           Purchase_Type: headerForm.Dispatch_Type,
//           Order_Main_ID: parseInt(orderId),
//           Transporter_ID: orderHeader?.Transporter_ID || null,
//           labour_crt: parseFloat(orderHeader?.labour_crt) || 0,
//           freight_crt: parseFloat(orderHeader?.freight_crt) || 0,
//           other_expense: parseFloat(orderHeader?.other_expense) || 0,
//           remarks: headerForm.remarks
//         },
//         stockDetails: validItems.map((item, idx) => ({
//           Line_Id: idx + 1,
//           Item_ID: item.Item_ID,
//           batchno: batchnoInt,
//           uom1_qty: item.gdnQty.uom1_qty,
//           uom2_qty: item.gdnQty.uom2_qty,
//           uom3_qty: item.gdnQty.uom3_qty,
//           Sale_Unit: item.gdnQty.sale_unit,
//           sale_Uom: item.gdnQty.Uom_Id,
//           Stock_Price: item.unitPrice || 0,
//           // GDN uses Stock_In fields in payload (backend converts to Stock_out)
//           Stock_In_UOM: item.uomStructure?.primary?.id || 1,
//           Stock_In_UOM_Qty: item.gdnQty.uom1_qty,
//           Stock_In_SKU_UOM: item.uomStructure?.secondary?.id || null,
//           Stock_In_SKU_UOM_Qty: item.gdnQty.uom2_qty,
//           Stock_In_UOM3_Qty: item.gdnQty.uom3_qty
//         }))
//       }

//       console.log('📤 GDN Payload:', JSON.stringify(payload, null, 2))

//       const response = await createGDN(payload).unwrap()
//       setCreatedGDNNumber(response.data?.gdnNumber || response.data?.Number || '')
//       setShowSuccessModal(true)
//     } catch (err: any) {
//       alert(`❌ Error: ${err?.data?.error || err.message}`)
//     }
//   }

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen gap-3">
//         <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
//         <span className="text-gray-600 font-medium">Loading Sales Order {orderId}...</span>
//       </div>
//     )
//   }

//   // Error State
//   if (error || !orderData) {
//     return (
//       <div className="p-6 max-w-2xl mx-auto">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//           <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
//           <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Order</h2>
//           <p className="text-red-600 mb-4">Could not load order data.</p>
//           <Button variant="secondary" onClick={() => router.back()}>
//             Go Back
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => router.back()}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 text-gray-600" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <Truck className="w-7 h-7 text-emerald-600" />
//               Create GDN (Goods Dispatch)
//             </h1>
//             <p className="text-gray-500 flex items-center gap-2 mt-1">
//               <ShoppingCart className="w-4 h-4" />
//               Sales Order: <span className="font-medium text-emerald-600">{orderHeader?.Number}</span>
//             </p>
//           </div>
//         </div>

//         <Button
//           variant="success"
//           size="lg"
//           onClick={() => setShowConfirmModal(true)}
//           disabled={!canSubmit}
//           loading={isCreating}
//           icon={<Save className="w-5 h-5" />}
//         >
//           Create GDN
//         </Button>
//       </div>

//       {/* Validation Alerts */}
//       {!isOrderApproved && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
//           <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//           <div>
//             <h3 className="font-semibold text-red-800">Order Not Approved</h3>
//             <p className="text-sm text-red-600">This sales order must be approved before creating a GDN.</p>
//           </div>
//         </div>
//       )}

//       {isNoteGenerated && (
//         <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
//           <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
//           <div>
//             <h3 className="font-semibold text-amber-800">GDN Already Generated</h3>
//             <p className="text-sm text-amber-600">A GDN has already been created for this sales order.</p>
//           </div>
//         </div>
//       )}

//       {/* Order Info Card */}
//       <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 mb-6">
//         <h3 className="font-semibold text-emerald-700 mb-4 flex items-center gap-2">
//           <ShoppingCart className="w-5 h-5" />
//           Sales Order Information
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           <InfoItem
//             icon={<Hash className="w-4 h-4" />}
//             label="Order #"
//             value={orderHeader?.Number}
//           />
//           <InfoItem
//             icon={<Calendar className="w-4 h-4" />}
//             label="Order Date"
//             value={new Date(orderHeader?.Date).toLocaleDateString('en-GB')}
//           />
//           <InfoItem
//             icon={<User className="w-4 h-4" />}
//             label="Customer"
//             value={orderHeader?.account?.acName}
//           />
//           <InfoItem
//             label="City"
//             value={orderHeader?.account?.city || orderHeader?.sub_city || '-'}
//           />
//           <InfoItem
//             label="Status"
//             value={orderHeader?.Next_Status}
//             badge
//             badgeColor={orderHeader?.Next_Status === 'Complete' ? 'green' : 'yellow'}
//           />
//           <InfoItem
//             label="Approved"
//             value={isOrderApproved ? 'Yes' : 'No'}
//             badge
//             badgeColor={isOrderApproved ? 'green' : 'red'}
//           />
//         </div>
//       </div>

//       {/* GDN Header Form */}
//       <GDN_Header
//         data={orderHeader}
//         formData={headerForm}
//         onFormChange={setHeaderForm}
//       />

//       {/* GDN Detail Items */}
//       <GDN_Detail
//         orderDetails={orderDetails}
//         onDetailChange={setFinalDetails}
//         globalBatch={headerForm.batchno}
//         globalBatchName={headerForm.COA_Name}
//       />

//       {/* Summary Card */}
//       <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
//         <h3 className="font-semibold text-gray-900 mb-4">Dispatch Summary</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <SummaryCard
//             label="Total Items"
//             value={finalDetails.length}
//             color="emerald"
//           />
//           <SummaryCard
//             label="Items with Qty"
//             value={validItems.length}
//             color="teal"
//           />
//           <SummaryCard
//             label="Batch No"
//             value={headerForm.batchno || '-'}
//             color="cyan"
//           />
//           <SummaryCard
//             label="Grand Total"
//             value={grandTotal.toLocaleString()}
//             color="green"
//             large
//           />
//         </div>
//       </div>

//       {/* Confirm Modal */}
//       <ConfirmationModal
//         isOpen={showConfirmModal}
//         onClose={() => setShowConfirmModal(false)}
//         onConfirm={handleSubmit}
//         title="Create GDN (Dispatch)"
//         message={`You are about to dispatch ${validItems.length} items for Sales Order ${orderHeader?.Number}. Stock will be deducted. Continue?`}
//         confirmText="Create GDN"
//         cancelText="Cancel"
//         type="warning"
//         loading={isCreating}
//       />

//       {/* Success Modal */}
//       <ConfirmationModal
//         isOpen={showSuccessModal}
//         onClose={() => {
//           setShowSuccessModal(false)
//           router.push('/inventoryy/gdn')
//         }}
//         onConfirm={() => {
//           setShowSuccessModal(false)
//           router.push('/inventoryy/gdn')
//         }}
//         title="GDN Created Successfully!"
//         message={`GDN ${createdGDNNumber} has been created. Stock has been dispatched.`}
//         confirmText="View GDN List"
//         cancelText="Close"
//         type="info"
//       />
//     </div>
//   )
// }

// // Helper Components
// function InfoItem({
//   icon,
//   label,
//   value,
//   badge,
//   badgeColor
// }: {
//   icon?: React.ReactNode
//   label: string
//   value: any
//   badge?: boolean
//   badgeColor?: 'green' | 'yellow' | 'red'
// }) {
//   const badgeColors = {
//     green: 'bg-green-100 text-green-800',
//     yellow: 'bg-yellow-100 text-yellow-800',
//     red: 'bg-red-100 text-red-800'
//   }

//   return (
//     <div>
//       <span className="text-xs text-gray-500 flex items-center gap-1">
//         {icon}
//         {label}
//       </span>
//       {badge ? (
//         <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColors[badgeColor || 'yellow']}`}>
//           {value || '-'}
//         </span>
//       ) : (
//         <p className="font-medium text-gray-900 mt-1">{value || '-'}</p>
//       )}
//     </div>
//   )
// }

// function SummaryCard({
//   label,
//   value,
//   color,
//   large
// }: {
//   label: string
//   value: any
//   color: 'emerald' | 'teal' | 'cyan' | 'green'
//   large?: boolean
// }) {
//   const colors = {
//     emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
//     teal: 'bg-teal-50 border-teal-200 text-teal-700',
//     cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
//     green: 'bg-green-50 border-green-200 text-green-700'
//   }

//   return (
//     <div className={`rounded-xl border p-4 ${colors[color]}`}>
//       <span className="text-xs opacity-80">{label}</span>
//       <p className={`font-bold ${large ? 'text-2xl' : 'text-xl'} mt-1`}>{value}</p>
//     </div>
//   )
// }




























































// components/gdn/GDNForm.tsx

'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Loader2, Save, ArrowLeft, AlertCircle, 
  FileText, Truck, XCircle, ShoppingCart
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
    remarks: ''
  })

  const [finalDetails, setFinalDetails] = useState<any[]>([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdGDNNumber, setCreatedGDNNumber] = useState('')

  // Auto-set Customer from Order
  useEffect(() => {
    if (orderHeader?.COA_ID && !headerForm.COA_ID) {
      setHeaderForm(prev => ({
        ...prev,
        COA_ID: orderHeader.COA_ID,
        COA_Name: orderHeader.account?.acName || ''
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
          Stock_Price: item.unitPrice || 0,
          Stock_out_UOM: item.uomStructure?.primary?.id || 1,
          Stock_out_UOM_Qty: item.dispatchQty.uom1_qty,
          Stock_out_SKU_UOM: item.uomStructure?.secondary?.id || null,
          Stock_out_SKU_UOM_Qty: item.dispatchQty.uom2_qty,
          Stock_out_UOM3_Qty: item.dispatchQty.uom3_qty
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-7 h-7 text-emerald-600" />
              Create GDN (Dispatch)
            </h1>
            <p className="text-gray-500">
              <ShoppingCart className="w-4 h-4 inline mr-1" />
              Sales Order: <span className="font-medium text-emerald-600">{orderHeader?.Number}</span>
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
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-emerald-700 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Sales Order Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Order #</span>
            <p className="font-medium">{orderHeader?.Number}</p>
          </div>
          <div>
            <span className="text-gray-500">Date</span>
            <p className="font-medium">{new Date(orderHeader?.Date).toLocaleDateString('en-GB')}</p>
          </div>
          <div>
            <span className="text-gray-500">Customer</span>
            <p className="font-medium">{orderHeader?.account?.acName}</p>
          </div>
          <div>
            <span className="text-gray-500">Items</span>
            <p className="font-medium">{orderDetails.length}</p>
          </div>
        </div>
      </div>

      {/* Header Form */}
      <GDN_Header
        data={orderHeader}
        formData={headerForm}
        onFormChange={setHeaderForm}
      />

      {/* Detail Items - CREATE MODE */}
      <GDN_Detail
        orderDetails={orderDetails}
        onDetailChange={setFinalDetails}
        mode="create"
      />

      {/* Summary */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <span className="text-xs text-emerald-600">Total Items</span>
          <p className="text-xl font-bold text-emerald-700">{finalDetails.length}</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <span className="text-xs text-teal-600">Valid Items</span>
          <p className="text-xl font-bold text-teal-700">{validItems.length}</p>
        </div>
        <div className={`border rounded-xl p-4 ${hasStockErrors ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <span className={`text-xs ${hasStockErrors ? 'text-red-600' : 'text-gray-600'}`}>Stock Issues</span>
          <p className={`text-xl font-bold ${hasStockErrors ? 'text-red-700' : 'text-gray-700'}`}>
            {hasStockErrors ? 'Yes' : 'None'}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <span className="text-xs text-green-600">Grand Total</span>
          <p className="text-2xl font-bold text-green-700">{grandTotal.toLocaleString()}</p>
        </div>
      </div>

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
        onClose={() => { setShowSuccessModal(false); router.push('/inventoryy/gdn') }}
        onConfirm={() => { setShowSuccessModal(false); router.push('/inventoryy/gdn') }}
        title="GDN Created!"
        message={`GDN ${createdGDNNumber} created successfully.`}
        confirmText="View GDN List"
        type="info"
      />
    </div>
  )
}
