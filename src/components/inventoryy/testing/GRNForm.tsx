

//working 2.0


// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Loader2, Save, AlertCircle } from 'lucide-react'
// import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
// import { useCreateGRNMutation } from '@/store/slice/grnApi'
// import Stk_Header from './Stk_Header'
// import Stk_Detail from './Stk_Detail'

// export default function GRNForm({ orderId }: { orderId: string }) {
//   const router = useRouter()
//   const { data, isLoading, error } = useGetOrderByIdQuery(orderId)
//   const [createGRN, { isLoading: isCreating }] = useCreateGRNMutation()

//   const [finalDetails, setFinalDetails] = useState<any[]>([])
  
//   const [headerForm, setHeaderForm] = useState({
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Purchase_Type: 'Local',
//     COA_ID: null as number | null,
//     COA_Name: '',
//     batchno: null as number | null,
//     remarks: ''
//   })

//   useEffect(() => {
//     console.log('🟢 headerForm:', headerForm)
//   }, [headerForm])

//   const handleSubmit = async () => {
//     // ✅ Validation
//     if (!data?.data || finalDetails.length === 0) {
//       alert('Please add items with quantities!')
//       return
//     }

//     const validItems = finalDetails.filter(item => item.grnQty.uom1_qty > 0)

//     if (validItems.length === 0) {
//       alert('Please enter quantities!')
//       return
//     }

//     if (!headerForm.COA_ID || typeof headerForm.COA_ID !== 'number') {
//       alert('Please select a valid supplier!')
//       return
//     }

//     // ✅ FORCE batchno to be integer from COA_ID
//     const batchnoInt = parseInt(String(headerForm.COA_ID), 10)
    
//     if (isNaN(batchnoInt)) {
//       alert('Invalid batch number. Please reselect supplier.')
//       return
//     }

//     console.log('✅ Batch validation passed:', batchnoInt, typeof batchnoInt)

//     const header = data.data

//     try {
//       const payload = {
//         stockMain: {
//           Stock_Type_ID: 11,
//           Date: headerForm.Date,
//           COA_ID: headerForm.COA_ID,
//           Status: headerForm.Status,
//           Purchase_Type: headerForm.Purchase_Type,
//           Order_Main_ID: parseInt(orderId),
//           Transporter_ID: header.Transporter_ID || null,
//           labour_crt: parseFloat(header.labour_crt) || 0,
//           freight_crt: parseFloat(header.freight_crt) || 0,
//           other_expense: parseFloat(header.other_expense) || 0,
//           remarks: headerForm.remarks
//         },
//         stockDetails: validItems.map((item, idx) => ({
//           Line_Id: idx + 1,
//           Item_ID: item.Item_ID,
//           batchno: batchnoInt,  // ✅ GUARANTEED INTEGER
//           uom1_qty: item.grnQty.uom1_qty,
//           uom2_qty: item.grnQty.uom2_qty,
//           uom3_qty: item.grnQty.uom3_qty,
//           Sale_Unit: item.grnQty.sale_unit,
//           sale_Uom: item.grnQty.Uom_Id,
//           Stock_Price: item.unitPrice,
//           Stock_In_UOM: item.uomStructure?.primary?.id || 1,
//           Stock_In_UOM_Qty: item.grnQty.uom1_qty,
//           Stock_In_SKU_UOM: item.uomStructure?.secondary?.id || null,
//           Stock_In_SKU_UOM_Qty: item.grnQty.uom2_qty,
//           Stock_In_UOM3_Qty: item.grnQty.uom3_qty
//         }))
//       }

//       // ✅ Final check before sending
//       console.log('📤 FINAL PAYLOAD CHECK:')
//       console.log('  - COA_ID:', payload.stockMain.COA_ID, typeof payload.stockMain.COA_ID)
//       console.log('  - First item batchno:', payload.stockDetails[0]?.batchno, typeof payload.stockDetails[0]?.batchno)
      
//       const response = await createGRN(payload).unwrap()
//       alert(`✅ GRN Created: ${response.data?.grnNumber || response.data?.Number}`)
//       router.push('/inventoryy/grn')
//     } catch (err: any) {
//       console.error('GRN Error:', err)
//       alert(`❌ Error: ${err?.data?.error || err.message}`)
//     }
//   }

//   if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>
//   if (error) return <div className="text-red-500 p-4">Error loading order</div>
//   if (!data?.data) return <div className="p-4">Order not found</div>

//   const { details, ...header } = data.data

//   const canSubmit = 
//     finalDetails.length > 0 && 
//     typeof headerForm.COA_ID === 'number' &&
//     headerForm.COA_ID > 0 &&
//     finalDetails.some(item => item.grnQty?.uom1_qty > 0)

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Create GRN - {header.Number}</h1>
//         <button
//           onClick={handleSubmit}
//           disabled={isCreating || !canSubmit}
//           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
//         >
//           {isCreating ? (
//             <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
//           ) : (
//             <><Save className="w-5 h-5" /> Create GRN</>
//           )}
//         </button>
//       </div>

//       {!canSubmit && finalDetails.length > 0 && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
//           <AlertCircle className="w-5 h-5 text-yellow-600" />
//           <span className="text-sm text-yellow-800">
//             {!headerForm.COA_ID ? 'Please select a supplier' : 
//              'Please enter quantities for at least one item'}
//           </span>
//         </div>
//       )}

//       <Stk_Header 
//         data={header} 
//         formData={headerForm}
//         onFormChange={setHeaderForm}
//         isGRN={true}
//       />

//       <Stk_Detail 
//         orderDetails={details} 
//         onDetailChange={setFinalDetails}
//         globalBatch={headerForm.batchno}
//         globalBatchName={headerForm.COA_Name}
//       />

//       {/* Debug Panel */}
//       <div className="mt-6 p-4 bg-gray-100 rounded-lg">
//         <h3 className="font-bold mb-2">Debug Info:</h3>
//         <div className="grid grid-cols-4 gap-4 text-sm">
//           <div>
//             <span className="text-gray-500">COA_ID:</span>
//             <p className="font-mono">{headerForm.COA_ID} ({typeof headerForm.COA_ID})</p>
//           </div>
//           <div>
//             <span className="text-gray-500">batchno:</span>
//             <p className="font-mono">{headerForm.batchno} ({typeof headerForm.batchno})</p>
//           </div>
//           <div>
//             <span className="text-gray-500">COA_Name:</span>
//             <p className="font-medium">{headerForm.COA_Name || '-'}</p>
//           </div>
//           <div>
//             <span className="text-gray-500">Can Submit:</span>
//             <p className={canSubmit ? 'text-green-600' : 'text-red-600'}>{canSubmit ? 'Yes' : 'No'}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


















































































//working 3.0 mena good wokring


// 'use client'
// import { useState, useEffect, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import { Loader2, Save, AlertCircle, Bug, ChevronDown, ChevronUp } from 'lucide-react'
// import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
// import { useCreateGRNMutation } from '@/store/slice/grnApi'
// import Stk_Header from './Stk_Header'
// import Stk_Detail from './Stk_Detail'

// export default function GRNForm({ orderId }: { orderId: string }) {
//   const router = useRouter()
//   const [showDebug, setShowDebug] = useState(true)  // Debug panel visibility
  
//   // =====================================================
//   // 1️⃣ FETCH ORDER DATA
//   // =====================================================
//   const { data: orderResponse, isLoading, error } = useGetOrderByIdQuery(orderId)
//   const [createGRN, { isLoading: isCreating }] = useCreateGRNMutation()

//   // =====================================================
//   // 2️⃣ STATE MANAGEMENT
//   // =====================================================
//   const [finalDetails, setFinalDetails] = useState<any[]>([])
  
//   const [headerForm, setHeaderForm] = useState({
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Purchase_Type: 'Local',
//     COA_ID: null as number | null,
//     COA_Name: '',
//     batchno: null as number | null,
//     remarks: ''
//   })

//   // =====================================================
//   // 3️⃣ EXTRACT ORDER DATA
//   // =====================================================
//   const orderData = useMemo(() => {
//     if (!orderResponse?.data) return null
//     return orderResponse.data
//   }, [orderResponse])

//   const orderHeader = useMemo(() => {
//     if (!orderData) return null
//     const { details, ...header } = orderData
//     return header
//   }, [orderData])

//   const orderDetails = useMemo(() => {
//     return orderData?.details || []
//   }, [orderData])

//   // =====================================================
//   // 4️⃣ CHECK IF GRN ALREADY GENERATED
//   // =====================================================
//   const isNoteAlreadyGenerated = orderHeader?.is_Note_generated === true

//   // =====================================================
//   // 5️⃣ AUTO-SET COA FROM ORDER (on first load)
//   // =====================================================
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

//   // =====================================================
//   // 6️⃣ DEBUG DATA - Shows at each step
//   // =====================================================
//   const debugData = useMemo(() => ({
//     step1_orderFetch: {
//       orderId,
//       isLoading,
//       hasError: !!error,
//       orderDataReceived: !!orderData
//     },
//     step2_orderHeader: orderHeader ? {
//       ID: orderHeader.ID,
//       Number: orderHeader.Number,
//       COA_ID: orderHeader.COA_ID,
//       accountName: orderHeader.account?.acName,
//       is_Note_generated: orderHeader.is_Note_generated,
//       canCreateGRN: !isNoteAlreadyGenerated
//     } : null,
//     step3_orderDetails: orderDetails.map((d: any) => ({
//       Item_ID: d.Item_ID,
//       uom1_qty: d.uom1_qty,
//       uom2_qty: d.uom2_qty,
//       uom3_qty: d.uom3_qty,
//       sale_unit: d.sale_unit,
//       Uom_Id: d.Uom_Id
//     })),
//     step4_headerForm: headerForm,
//     step5_finalDetails: finalDetails.map(item => ({
//       Item_ID: item.Item_ID,
//       itemName: item.itemName,
//       isOrderItem: item.isOrderItem,
//       batchNumber: item.batchNumber,
//       grnQty: item.grnQty
//     })),
//     step6_payload: buildPayload()
//   }), [orderId, isLoading, error, orderData, orderHeader, orderDetails, headerForm, finalDetails])

//   // =====================================================
//   // 7️⃣ BUILD PAYLOAD FOR API
//   // =====================================================
//   function buildPayload() {
//     if (!orderHeader || finalDetails.length === 0) return null
    
//     const validItems = finalDetails.filter(item => item.grnQty?.uom1_qty > 0)
//     if (validItems.length === 0) return null
    
//     const batchnoInt = headerForm.COA_ID ? parseInt(String(headerForm.COA_ID), 10) : null
    
//     return {
//       stockMain: {
//         Stock_Type_ID: 11,
//         Date: headerForm.Date,
//         COA_ID: headerForm.COA_ID,
//         Status: headerForm.Status,
//         Purchase_Type: headerForm.Purchase_Type,
//         Order_Main_ID: parseInt(orderId),
//         Transporter_ID: orderHeader.Transporter_ID || null,
//         labour_crt: parseFloat(orderHeader.labour_crt) || 0,
//         freight_crt: parseFloat(orderHeader.freight_crt) || 0,
//         other_expense: parseFloat(orderHeader.other_expense) || 0,
//         remarks: headerForm.remarks
//       },
//       stockDetails: validItems.map((item, idx) => ({
//         Line_Id: idx + 1,
//         Item_ID: item.Item_ID,
//         batchno: batchnoInt,
//         uom1_qty: item.grnQty.uom1_qty,
//         uom2_qty: item.grnQty.uom2_qty,
//         uom3_qty: item.grnQty.uom3_qty,
//         Sale_Unit: item.grnQty.sale_unit,
//         sale_Uom: item.grnQty.Uom_Id,
//         Stock_Price: item.unitPrice || 0,
//         Stock_In_UOM: item.uomStructure?.primary?.id || 1,
//         Stock_In_UOM_Qty: item.grnQty.uom1_qty,
//         Stock_In_SKU_UOM: item.uomStructure?.secondary?.id || null,
//         Stock_In_SKU_UOM_Qty: item.grnQty.uom2_qty,
//         Stock_In_UOM3_Qty: item.grnQty.uom3_qty
//       }))
//     }
//   }

//   // =====================================================
//   // 8️⃣ SUBMIT HANDLER
//   // =====================================================
//   const handleSubmit = async () => {
//     console.log('═══════════════════════════════════════════════════')
//     console.log('📤 SUBMIT CLICKED')
//     console.log('═══════════════════════════════════════════════════')
    
//     // Check if note already generated
//     if (isNoteAlreadyGenerated) {
//       alert('❌ GRN already generated for this order!')
//       return
//     }
    
//     const payload = buildPayload()
    
//     if (!payload) {
//       alert('Please add items with quantities!')
//       return
//     }
    
//     if (!headerForm.COA_ID) {
//       alert('Please select a supplier!')
//       return
//     }
    
//     console.log('📦 Final Payload:', JSON.stringify(payload, null, 2))
    
//     try {
//       const response = await createGRN(payload).unwrap()
//       console.log('✅ GRN Created:', response)
//       alert(`✅ GRN Created: ${response.data?.grnNumber || response.data?.Number}`)
//       router.push('/inventoryy/grn')
//     } catch (err: any) {
//       console.error('❌ GRN Error:', err)
//       alert(`❌ Error: ${err?.data?.error || err.message}`)
//     }
//   }

//   // =====================================================
//   // 9️⃣ VALIDATION
//   // =====================================================
//   const canSubmit = useMemo(() => {
//     return (
//       !isNoteAlreadyGenerated &&
//       finalDetails.length > 0 &&
//       typeof headerForm.COA_ID === 'number' &&
//       headerForm.COA_ID > 0 &&
//       finalDetails.some(item => item.grnQty?.uom1_qty > 0)
//     )
//   }, [isNoteAlreadyGenerated, finalDetails, headerForm.COA_ID])

//   // =====================================================
//   // LOADING & ERROR STATES
//   // =====================================================
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="animate-spin w-8 h-8" />
//         <span className="ml-2">Loading Order {orderId}...</span>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-red-500">
//         <AlertCircle className="w-6 h-6 inline mr-2" />
//         Error loading order: {(error as any)?.data?.error || 'Unknown error'}
//       </div>
//     )
//   }

//   if (!orderData) {
//     return <div className="p-6">Order not found</div>
//   }

//   // =====================================================
//   // RENDER
//   // =====================================================
//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* ============ HEADER ============ */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Create GRN</h1>
//           <p className="text-gray-500">Order: {orderHeader?.Number}</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setShowDebug(!showDebug)}
//             className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
//           >
//             <Bug className="w-4 h-4" />
//             {showDebug ? 'Hide' : 'Show'} Debug
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isCreating || !canSubmit}
//             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
//           >
//             {isCreating ? (
//               <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
//             ) : (
//               <><Save className="w-5 h-5" /> Create GRN</>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ============ BLOCKED WARNING ============ */}
//       {isNoteAlreadyGenerated && (
//         <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
//           <div className="flex items-center gap-2 text-red-800">
//             <AlertCircle className="w-5 h-5" />
//             <strong>GRN Already Generated!</strong>
//           </div>
//           <p className="text-red-700 mt-1">
//             This order already has a GRN. You cannot create another one.
//           </p>
//         </div>
//       )}

//       {/* ============ VALIDATION WARNING ============ */}
//       {!canSubmit && !isNoteAlreadyGenerated && finalDetails.length > 0 && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
//           <AlertCircle className="w-5 h-5 text-yellow-600" />
//           <span className="text-sm text-yellow-800">
//             {!headerForm.COA_ID ? 'Please select a supplier' : 
//              'Please enter quantities for at least one item'}
//           </span>
//         </div>
//       )}

//       {/* ============ STK HEADER ============ */}
//       <Stk_Header 
//         data={orderHeader} 
//         formData={headerForm}
//         onFormChange={setHeaderForm}
//         isGRN={true}
//       />

//       {/* ============ STK DETAIL ============ */}
//       <Stk_Detail 
//         orderDetails={orderDetails}
//         onDetailChange={setFinalDetails}
//         globalBatch={headerForm.batchno}
//         globalBatchName={headerForm.COA_Name}
//       />

//       {/* ============ DEBUG PANEL ============ */}
//       {showDebug && (
//         <div className="mt-6 border-2 border-purple-300 rounded-lg overflow-hidden">
//           <div className="bg-purple-600 text-white px-4 py-2 flex items-center gap-2">
//             <Bug className="w-4 h-4" />
//             <span className="font-semibold">Data Flow Debug Panel</span>
//           </div>
          
//           <div className="p-4 bg-purple-50 space-y-4">
//             {/* Step 1: Order Fetch */}
//             <DebugSection 
//               title="1️⃣ Order Fetch Status" 
//               data={debugData.step1_orderFetch} 
//             />
            
//             {/* Step 2: Order Header */}
//             <DebugSection 
//               title="2️⃣ Order Header Data" 
//               data={debugData.step2_orderHeader}
//               highlight={debugData.step2_orderHeader?.is_Note_generated ? 'red' : 'green'}
//             />
            
//             {/* Step 3: Order Details */}
//             <DebugSection 
//               title={`3️⃣ Order Details (${debugData.step3_orderDetails.length} items)`}
//               data={debugData.step3_orderDetails}
//             />
            
//             {/* Step 4: Header Form State */}
//             <DebugSection 
//               title="4️⃣ Header Form State (from Stk_Header)" 
//               data={debugData.step4_headerForm}
//             />
            
//             {/* Step 5: Final Details */}
//             <DebugSection 
//               title={`5️⃣ Final Details (${debugData.step5_finalDetails.length} items)`}
//               data={debugData.step5_finalDetails}
//             />
            
//             {/* Step 6: API Payload */}
//             <DebugSection 
//               title="6️⃣ API Payload (Ready to Submit)" 
//               data={debugData.step6_payload}
//               highlight={debugData.step6_payload ? 'green' : 'yellow'}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // =====================================================
// // DEBUG SECTION COMPONENT
// // =====================================================
// function DebugSection({ 
//   title, 
//   data, 
//   highlight 
// }: { 
//   title: string
//   data: any
//   highlight?: 'green' | 'red' | 'yellow'
// }) {
//   const [expanded, setExpanded] = useState(true)
  
//   const bgColor = highlight === 'green' ? 'bg-green-100 border-green-300' :
//                   highlight === 'red' ? 'bg-red-100 border-red-300' :
//                   highlight === 'yellow' ? 'bg-yellow-100 border-yellow-300' :
//                   'bg-white border-gray-300'
  
//   return (
//     <div className={`border rounded-lg overflow-hidden ${bgColor}`}>
//       <button
//         onClick={() => setExpanded(!expanded)}
//         className="w-full px-4 py-2 flex justify-between items-center hover:bg-gray-50"
//       >
//         <span className="font-medium">{title}</span>
//         {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//       </button>
      
//       {expanded && (
//         <div className="p-4 border-t bg-gray-900 text-green-400">
//           <pre className="text-xs overflow-auto max-h-60">
//             {JSON.stringify(data, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   )
// }

















































































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
