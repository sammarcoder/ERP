// // components/inventoryy/gdn/GDNForm.tsx
// 'use client'
// import { Loader2 } from 'lucide-react'
// import { useGetOrderByIdQuery } from '@/store/slice/orderApi'

// export default function GDNForm({ orderId }: { orderId: string }) {
//     const { data, isLoading, error } = useGetOrderByIdQuery(orderId)

//     if (isLoading) return <div><Loader2 className="animate-spin" /> Loading...</div>
//     if (error) return <div>Error loading order</div>
//     if (!data?.data) return <div>No order found</div>

//     const { details, ...header } = data.data

//     return (
//         <div>
//             <div>
//                 <h2>Raw API Response</h2>
//                 <pre style={{ background: '#f4f4f4', padding: '1rem', overflow: 'auto' }}>
//                     {JSON.stringify(data, null, 2)}
//                 </pre>
//             </div>
//             <div className='bg-gray-300 p-10 rounded-lg mt-10'>
//                 <h2>Header Data</h2>
//                 <pre>{JSON.stringify(header, null, 2)}</pre>

//                 <h2>Details Data ({details?.length} items)</h2>
//                 <pre>{JSON.stringify(details, null, 2)}</pre>
//             </div>

//         </div>
//     )
// }




































// 'use client'
// import { Loader2 } from 'lucide-react'
// import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
// import Stk_Header from './Stk_Header'
// import Stk_Detail from './Stk_Detail'

// export default function GDNForm({ orderId }: { orderId: string }) {
//     const { data, isLoading, error } = useGetOrderByIdQuery(orderId)

//     if (isLoading) return <div><Loader2 className="animate-spin" /> Loading...</div>
//     if (error) return <div>Error loading order</div>
//     if (!data?.data) return <div>No order found</div>

//     const { details, ...header } = data.data

//     return (
//         <div>
//             <Stk_Header data={header} />
//             <Stk_Detail data={details} />
//         </div>
//     )
// }











































// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Loader2, Save } from 'lucide-react'
// import Stk_Header from './Stk_Header'
// import Stk_Detail from './Stk_Detail'
// import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
// import { useCreateGDNMutation } from '@/store/slice/gdnApi'

// export default function GDNForm({ orderId }: { orderId: string }) {
//   const router = useRouter()
//   const { data, isLoading } = useGetOrderByIdQuery(orderId)
//   const [createGDN, { isLoading: isCreating }] = useCreateGDNMutation()
  
//   const [headerData, setHeaderData] = useState({
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling',
//     Transporter_ID: '',
//     labour_crt: '',
//     freight_crt: '',
//     other_expense: '',
//     remarks: ''
//   })
  
//   const [detailItems, setDetailItems] = useState([])

//   const handleSubmit = async () => {
//     if (!data?.data || detailItems.length === 0) {
//       alert('Please add items!')
//       return
//     }

//     const validItems = detailItems.filter(item => item.Batch_Number && item.QTY_Dispatched > 0)
    
//     if (validItems.length === 0) {
//       alert('Add batch numbers and quantities!')
//       return
//     }

//     try {
//       const response = await createGDN({
//         stockMain: {
//           Stock_Type_ID: 12,
//           Date: headerData.Date,
//           COA_ID: data.data.COA_ID,
//           Status: headerData.Status,
//           Purchase_Type: headerData.Dispatch_Type,
//           Order_Main_ID: parseInt(orderId),
//           Transporter_ID: headerData.Transporter_ID ? parseInt(headerData.Transporter_ID) : null,
//           labour_crt: parseFloat(headerData.labour_crt) || 0,
//           freight_crt: parseFloat(headerData.freight_crt) || 0,
//           other_expense: parseFloat(headerData.other_expense) || 0,
//           sub_customer: data.data.sub_customer,
//           sub_city: data.data.sub_city,
//           remarks: headerData.remarks
//         },
//         stockDetails: validItems.map(item => ({
//           Item_ID: item.Item_ID,
//           Line_Id: item.Line_Id,
//           batchno: item.Batch_Number,
//           uom1_qty: parseFloat(item.uom1_qty) || 0,
//           uom2_qty: parseFloat(item.uom2_qty) || 0,
//           uom3_qty: parseFloat(item.uom3_qty) || 0,
//           sale_unit: item.sale_unit,
//           Uom_Id: item.Uom_Id
//         }))
//       }).unwrap()
      
//       alert(`✅ GDN: ${response.data?.dispatchNumber}`)
//       router.push('/inventoryy/gdn')
//     } catch (error: any) {
//       alert(`❌ Error: ${error?.data?.error || error.message}`)
//     }
//   }

//   if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>
//   if (!data?.data) return <div>Order not found</div>

//   const { details, ...header } = data.data

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Create GDN - {header.Number}</h1>
//         <button
//           onClick={handleSubmit}
//           disabled={isCreating || !detailItems.length}
//           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
//         >
//           {isCreating ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : <><Save className="w-5 h-5" /> Create GDN</>}
//         </button>
//       </div>

//       <Stk_Header data={header} />
//       <Stk_Detail orderDetails={details} onDetailChange={setDetailItems} />
//     </div>
//   )
// }











































'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
import { useCreateGDNMutation } from '@/store/slice/gdnApi'
import Stk_Header from './Stk_Header'
import Stk_Detail from './Stk_Detail'

export default function GDNForm({ orderId }: { orderId: string }) {
  const router = useRouter()
  const { data, isLoading, error } = useGetOrderByIdQuery(orderId)
  const [createGDN, { isLoading: isCreating }] = useCreateGDNMutation()

  // ✅ Store final details from Stk_Detail
  const [finalDetails, setFinalDetails] = useState<any[]>([])
  
  // ✅ Header form state
  const [headerForm, setHeaderForm] = useState({
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Dispatch_Type: 'Local selling',
    remarks: ''
  })

  const handleSubmit = async () => {
    if (!data?.data || finalDetails.length === 0) {
      alert('Please add items with quantities!')
      return
    }

    // ✅ Filter items with valid batch and quantity
    const validItems = finalDetails.filter(item => 
      item.batchNumber && item.grnQty.uom1_qty > 0
    )

    if (validItems.length === 0) {
      alert('Please enter batch numbers and quantities!')
      return
    }

    const header = data.data

    try {
      const payload = {
        stockMain: {
          Stock_Type_ID: 12,
          Date: headerForm.Date,
          COA_ID: header.COA_ID,
          Status: headerForm.Status,
          Purchase_Type: headerForm.Dispatch_Type,
          Order_Main_ID: parseInt(orderId),
          Transporter_ID: header.Transporter_ID,
          labour_crt: parseFloat(header.labour_crt) || 0,
          freight_crt: parseFloat(header.freight_crt) || 0,
          other_expense: parseFloat(header.other_expense) || 0,
          sub_customer: header.sub_customer,
          sub_city: header.sub_city,
          remarks: headerForm.remarks
        },
        stockDetails: validItems.map((item, idx) => ({
          Line_Id: idx + 1,
          Item_ID: item.Item_ID,
          batchno: item.batchNumber,
          uom1_qty: item.grnQty.uom1_qty,
          uom2_qty: item.grnQty.uom2_qty,
          uom3_qty: item.grnQty.uom3_qty,
          sale_unit: item.grnQty.sale_unit,
          Uom_Id: item.grnQty.Uom_Id,
          Stock_Price: item.unitPrice
        }))
      }

      console.log('📤 Submitting GDN:', payload)
      const response = await createGDN(payload).unwrap()
      alert(`✅ GDN Created: ${response.data?.dispatchNumber}`)
      router.push('/inventoryy/gdn')
    } catch (err: any) {
      alert(`❌ Error: ${err?.data?.error || err.message}`)
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>
  if (error) return <div className="text-red-500 p-4">Error loading order</div>
  if (!data?.data) return <div className="p-4">Order not found</div>

  const { details, ...header } = data.data

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create GDN - {header.Number}</h1>
        <button
          onClick={handleSubmit}
          disabled={isCreating || finalDetails.length === 0}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {isCreating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
          ) : (
            <><Save className="w-5 h-5" /> Create GDN</>
          )}
        </button>
      </div>

      {/* Header Info */}
      <Stk_Header 
        data={header} 
        formData={headerForm}
        onFormChange={setHeaderForm}
      />

      {/* Details - Pass order details */}
      <Stk_Detail 
        orderDetails={details} 
        onDetailChange={setFinalDetails}
      />

      {/* Debug - Remove in production */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Final Details ({finalDetails.length} items):</h3>
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(finalDetails, null, 2)}
        </pre>
      </div>
    </div>
  )
}
