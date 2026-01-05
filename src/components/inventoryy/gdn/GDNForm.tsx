// // components/inventory/GDNForm.tsx - FIXED INFINITE LOOP
// 'use client'
// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import StockHeader from '@/components/inventoryy/gdn/StockHeader'
// import StockDetail from '@/components/inventoryy/gdn/StockDetail'
// import { useRouter } from 'next/navigation'
// import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
// import { useCreateGDNMutation } from '@/store/slice/gdnApi'

// export default function GDNForm({ orderId }: { orderId: string }) {
//   const router = useRouter()
  
//   // ✅ Use ref to track if auto-population has been done
//   const hasAutoPopulated = useRef(false)

//   const [headerData, setHeaderData] = useState({
//     Sales_Order_Number: '',
//     Dispatch_Number: 'Auto Generated',
//     Name_of_Customer: '',
//     COA_ID: '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling',
//     Transporter_ID: '',
//     labour_crt: '',
//     freight_crt: '',
//     other_expense: '',
//     sub_customer: '',
//     sub_city: '',
//     remarks: ''
//   })

//   const [detailItems, setDetailItems] = useState([])
//   const [customers, setCustomers] = useState([])

//   const { 
//     data: sourceOrder, 
//     isLoading: orderLoading, 
//     error: orderError,
//     isSuccess
//   } = useGetOrderByIdQuery(orderId, { 
//     skip: !orderId,
//     refetchOnMountOrArgChange: true
//   })

//   const [createGDN, { isLoading: isCreating }] = useCreateGDNMutation()

//   // ✅ Fetch customers once
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`)
//         const result = await response.json()
//         if (result.success && result.zCoaRecords) {
//           const coaRecords = Array.isArray(result.zCoaRecords) ? result.zCoaRecords : [result.zCoaRecords]
//           setCustomers(coaRecords.filter((coa: any) => coa.coaTypeId === 2))
//         }
//       } catch (error) {
//         console.error('❌ Error fetching customers:', error)
//       }
//     }
//     fetchCustomers()
//   }, []) // ✅ Empty dependency array - runs once only

//   // ✅ FIXED: Auto-population with proper guards
//   useEffect(() => {
//     // ✅ Guard against multiple auto-populations
//     if (hasAutoPopulated.current) {
//       console.log('🛑 Auto-population already done, skipping')
//       return
//     }

//     if (sourceOrder?.data && orderId && isSuccess) {
//       const order = sourceOrder.data
//       console.log('🚀 Starting one-time auto-population for order:', order.Number)

//       try {
//         // ✅ Header auto-population
//         const newHeaderData = {
//           Sales_Order_Number: order.Number || '',
//           Name_of_Customer: order.account?.acName || '',
//           COA_ID: order.COA_ID?.toString() || '',
//           Date: new Date().toISOString().split('T')[0],
//           sub_customer: order.sub_customer || '',
//           sub_city: order.sub_city || '',
//           Transporter_ID: order.Transporter_ID?.toString() || '',
//           labour_crt: order.labour_crt?.toString() || '',
//           freight_crt: order.freight_crt?.toString() || '',
//           other_expense: order.other_expense?.toString() || '',
//           Status: 'UnPost',
//           Dispatch_Type: 'Local selling',
//           Dispatch_Number: 'Auto Generated',
//           remarks: ''
//         }

//         setHeaderData(newHeaderData)

//         // ✅ Details auto-population
//         if (order.details && Array.isArray(order.details) && order.details.length > 0) {
//           const newDetailItems = order.details.map((detail, index) => ({
//             Line_Id: index + 1,
//             Batch_Number: '',
//             Item: detail.item?.itemName || 'Unknown Item',
//             Item_ID: detail.Item_ID,
//             Qty_in_SO: parseFloat(
//               detail.sale_unit === '3' ? detail.uom3_qty :
//               detail.sale_unit === '2' ? detail.uom2_qty :
//               detail.uom1_qty || 0
//             ),
//             Uom_SO: detail.uom?.uom || 'Unknown',
//             uom1_qty: parseFloat(detail.uom1_qty || 0),
//             uom2_qty: parseFloat(detail.uom2_qty || 0),
//             uom3_qty: parseFloat(detail.uom3_qty || 0),
//             sale_unit: parseInt(detail.sale_unit) || 3,
//             Uom_Id: detail.Uom_Id || 0,
//             QTY_Dispatched: 0,
//             Stock_Price: parseFloat(detail.item?.sellingPrice || 0),
//             isOriginalRow: true,
//             item: detail.item
//           }))
          
//           console.log('✅ Setting detail items:', newDetailItems.length)
//           setDetailItems(newDetailItems)
          
//           // ✅ Mark as auto-populated to prevent re-runs
//           hasAutoPopulated.current = true
//         }
//       } catch (error) {
//         console.error('❌ Error in auto-population:', error)
//       }
//     }
//   }, [sourceOrder?.data, orderId, isSuccess]) // ✅ Stable dependencies only

//   // ✅ FIXED: Memoized detail change handler to prevent infinite loops
//   const handleDetailChange = useCallback((items) => {
//     console.log('📤 GDNForm - Detail change received:', items.length)
//     // ✅ Only update if the items actually changed
//     if (items.length !== detailItems.length || 
//         JSON.stringify(items) !== JSON.stringify(detailItems)) {
//       setDetailItems(items)
//     }
//   }, [detailItems]) // ✅ Proper dependency

//   // ✅ FIXED: Memoized header change handler
//   const handleHeaderChange = useCallback((field, value) => {
//     console.log(`📤 Header change: ${field} = ${value}`)
//     setHeaderData(prev => ({
//       ...prev,
//       [field]: value
//     }))
//   }, []) // ✅ No dependencies needed

//   const handleSubmitGDN = async () => {
//     try {
//       if (!headerData.COA_ID) {
//         alert('Please select a customer')
//         return
//       }

//       const validItems = detailItems.filter(item => 
//         item.Item_ID && item.Batch_Number && (
//           parseFloat(item.uom1_qty) > 0 || 
//           parseFloat(item.uom2_qty) > 0 || 
//           parseFloat(item.uom3_qty) > 0
//         )
//       )

//       if (validItems.length === 0) {
//         alert('Please select batches and enter dispatch quantities')
//         return
//       }

//       const stockMain = {
//         Stock_Type_ID: 12,
//         Date: headerData.Date,
//         COA_ID: parseInt(headerData.COA_ID),
//         Status: headerData.Status,
//         Purchase_Type: headerData.Dispatch_Type,
//         Order_Main_ID: orderId ? parseInt(orderId) : null,
//         Transporter_ID: headerData.Transporter_ID ? parseInt(headerData.Transporter_ID) : null,
//         labour_crt: parseFloat(headerData.labour_crt) || 0,
//         freight_crt: parseFloat(headerData.freight_crt) || 0,
//         other_expense: parseFloat(headerData.other_expense) || 0,
//         sub_customer: headerData.sub_customer || null,
//         sub_city: headerData.sub_city || null,
//         remarks: headerData.remarks || null
//       }

//       const stockDetails = validItems.map(item => ({
//         Item_ID: item.Item_ID,
//         Line_Id: item.Line_Id,
//         batchno: item.Batch_Number,
//         uom1_qty: parseFloat(item.uom1_qty) || 0,
//         uom2_qty: parseFloat(item.uom2_qty) || 0,
//         uom3_qty: parseFloat(item.uom3_qty) || 0,
//         sale_unit: item.sale_unit,
//         Uom_Id: item.Uom_Id || 0
//       }))

//       const response = await createGDN({ stockMain, stockDetails }).unwrap()
//       alert(`✅ GDN created: ${response.data?.dispatchNumber}`)
//       router.push('/inventoryy/gdn')

//     } catch (error: any) {
//       alert(`❌ Error: ${error?.data?.error || error.message}`)
//     }
//   }

//   if (orderLoading) {
//     return (
//       <div className="p-8 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//         <p>Loading order {orderId}...</p>
//       </div>
//     )
//   }

//   if (orderError) {
//     return (
//       <div className="p-8 text-center text-red-600">
//         <h2>Error Loading Order</h2>
//         <p>Order ID: {orderId}</p>
//         <p>Error: {orderError?.message}</p>
//         <button onClick={() => router.back()}>Go Back</button>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-8">
//       {/* ✅ Simple debug info */}
//       <div className="bg-green-100 p-3 rounded mb-4 text-sm">
//         <strong>✅ Debug:</strong> 
//         Order: {headerData.Sales_Order_Number} | 
//         Customer: {headerData.Name_of_Customer} | 
//         Items: {detailItems.length} | 
//         Auto-populated: {hasAutoPopulated.current ? '✅' : '❌'}
//       </div>

//       <h1 className="text-2xl font-bold mb-6">Create GDN - Order {orderId}</h1>
      
//       <div className="space-y-6">
//         <StockHeader
//           headerData={headerData}
//           onHeaderChange={handleHeaderChange} // ✅ Memoized function
//           mode="fromOrder"
//           sourceOrder={sourceOrder?.data}
//           customers={customers}
//           isFromOrder={!!orderId}
//         />

//         <StockDetail
//           detailItems={detailItems} // ✅ Stable reference
//           onDetailChange={handleDetailChange} // ✅ Memoized function
//           mode="fromOrder"
//           sourceOrder={sourceOrder?.data}
//           isFromOrder={!!orderId}
//         />

//         <div className="flex justify-end">
//           <button
//             onClick={handleSubmitGDN}
//             disabled={!headerData.COA_ID || detailItems.length === 0}
//             className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded disabled:opacity-50"
//           >
//             Create GDN ({detailItems.length} items)
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }









































































// components/inventoryy/gdn/GDNForm.tsx - FIXED DATA FLOW TO STOCKDETAIL
'use client'
import React, { useState, useEffect } from 'react'
import StockHeader from '@/components/inventoryy/gdn/StockHeader'
import StockDetail from '@/components/inventoryy/gdn/StockDetail'
import { useRouter } from 'next/navigation'
import { useGetOrderByIdQuery } from '@/store/slice/orderApi'
import { useCreateGDNMutation } from '@/store/slice/gdnApi'

export default function GDNForm({ orderId }: { orderId: string }) {
  const router = useRouter()

  const [headerData, setHeaderData] = useState({
    Sales_Order_Number: '',
    Name_of_Customer: '',
    COA_ID: '',
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Dispatch_Type: 'Local selling',
    sub_customer: '',
    sub_city: '',
    Transporter_ID: '',
    labour_crt: '',
    freight_crt: '',
    other_expense: '',
    remarks: ''
  })

  const [detailItemsForStockDetail, setDetailItemsForStockDetail] = useState([]) // ✅ Specific state for StockDetail
  const [finalDetailItems, setFinalDetailItems] = useState([]) // ✅ Final items with batches
  const [customers, setCustomers] = useState([])

  const { data: sourceOrder, isLoading, error } = useGetOrderByIdQuery(orderId, { skip: !orderId })
  const [createGDN, { isLoading: isCreating }] = useCreateGDNMutation()

  console.log('🔍 GDNForm Full Debug:', {
    orderId,
    hasSourceOrder: !!sourceOrder,
    hasOrderData: !!sourceOrder?.data,
    orderNumber: sourceOrder?.data?.Number,
    orderDetailsCount: sourceOrder?.data?.details?.length,
    orderDetails: sourceOrder?.data?.details,
    detailItemsForStockDetail: detailItemsForStockDetail.length,
    finalDetailItems: finalDetailItems.length
  })

  // ✅ Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`)
        const result = await response.json()
        if (result.success && result.zCoaRecords) {
          const coaRecords = Array.isArray(result.zCoaRecords) ? result.zCoaRecords : [result.zCoaRecords]
          setCustomers(coaRecords.filter((coa: any) => coa.coaTypeId === 2))
        }
        
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    }
    fetchCustomers()
  }, [])


  // console.log('these are the full customers',customers)
  // ✅ FIXED: Process order data and set for StockDetail
  useEffect(() => {
    if (sourceOrder?.data) {
      const order = sourceOrder.data
      console.log('🚀 Processing order for GDN:', order.Number)
      console.log('📋 Order details to process:', order.details)

      // ✅ Set header data
      setHeaderData({
        Sales_Order_Number: order.Number || '',
        Name_of_Customer: order.account?.acName || '',
        COA_ID: order.COA_ID?.toString() || '',
        Date: new Date().toISOString().split('T')[0],
        sub_customer: order.sub_customer || '',
        sub_city: order.sub_city || '',
        Transporter_ID: order.Transporter_ID?.toString() || '',
        labour_crt: order.labour_crt?.toString() || '',
        freight_crt: order.freight_crt?.toString() || '',
        other_expense: order.other_expense?.toString() || '',
        Status: 'UnPost',
        Dispatch_Type: 'Local selling',
        remarks: ''
      })

      // ✅ CRITICAL: Process order details for StockDetail
      if (order.details && Array.isArray(order.details) && order.details.length > 0) {
        console.log('📦 Processing order details for StockDetail...')
        
        const processedDetails = order.details.map((detail, index) => {
          console.log(`Processing detail ${index + 1}:`, {
            ID: detail.ID,
            Item_ID: detail.Item_ID,
            itemName: detail.item?.itemName,
            quantities: {
              uom1_qty: detail.uom1_qty,
              uom2_qty: detail.uom2_qty,
              uom3_qty: detail.uom3_qty,
              sale_unit: detail.sale_unit
            }
          })

          return {
            Line_Id: index + 1,
            Batch_Number: '',
            Item: detail.item?.itemName || 'Unknown Item',
            Item_ID: detail.Item_ID,
            Qty_in_SO: parseFloat(
              detail.sale_unit === '3' ? detail.uom3_qty :
              detail.sale_unit === '2' ? detail.uom2_qty :
              detail.uom1_qty || 0
            ),
            Uom_SO: detail.uom?.uom || 'Unknown',
            uom1_qty: 0, // User will set dispatch quantities
            uom2_qty: 0,
            uom3_qty: 0,
            sale_unit: parseInt(detail.sale_unit) || 3,
            Uom_Id: detail.Uom_Id || 0,
            QTY_Dispatched: 0,
            Stock_Price: parseFloat(detail.item?.sellingPrice || 0),
            item: detail.item // ✅ Complete item data with UOMs
          }
        })
        
        console.log('✅ Processed details for StockDetail:', processedDetails)
        setDetailItemsForStockDetail(processedDetails) // ✅ This will flow to StockDetail
      } else {
        console.warn('⚠️ No order details found')
        setDetailItemsForStockDetail([])
      }
    }
  }, [sourceOrder?.data]) // ✅ React to order data changes

  const handleSubmitGDN = async () => {
    try {
      if (!headerData.COA_ID) {
        alert('Select customer first!')
        return
      }

      const validItems = finalDetailItems.filter(item => 
        item.Item_ID && item.Batch_Number && item.QTY_Dispatched > 0
      )

      if (validItems.length === 0) {
        alert('Add items with batches and quantities!')
        return
      }

      const stockMain = {
        Stock_Type_ID: 12,
        Date: headerData.Date,
        COA_ID: parseInt(headerData.COA_ID),
        Status: headerData.Status,
        Purchase_Type: headerData.Dispatch_Type,
        Order_Main_ID: orderId ? parseInt(orderId) : null,
        Transporter_ID: headerData.Transporter_ID ? parseInt(headerData.Transporter_ID) : null,
        labour_crt: parseFloat(headerData.labour_crt) || 0,
        freight_crt: parseFloat(headerData.freight_crt) || 0,
        other_expense: parseFloat(headerData.other_expense) || 0,
        sub_customer: headerData.sub_customer || null,
        sub_city: headerData.sub_city || null,
        remarks: headerData.remarks || null
      }

      const stockDetails = validItems.map(item => ({
        Item_ID: item.Item_ID,
        Line_Id: item.Line_Id,
        batchno: item.Batch_Number,
        uom1_qty: parseFloat(item.uom1_qty) || 0,
        uom2_qty: parseFloat(item.uom2_qty) || 0,
        uom3_qty: parseFloat(item.uom3_qty) || 0,
        sale_unit: item.sale_unit,
        Uom_Id: item.Uom_Id || 0
      }))

      const response = await createGDN({ stockMain, stockDetails }).unwrap()
      alert(`✅ GDN created: ${response.data?.dispatchNumber}`)
      router.push('/inventoryy/gdn')

    } catch (error: any) {
      alert(`❌ Error: ${error?.data?.error || error.message}`)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading order {orderId}...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error loading order: {error.message}</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* ✅ DEBUG: Show what GDNForm has */}
      <div className="bg-green-100 p-4 rounded mb-4 text-sm border">
        <strong>🔧 GDNForm Debug:</strong>
        <div>Order ID: {orderId}</div>
        <div>Source Order: {sourceOrder?.data?.Number || 'Not loaded'}</div>
        <div>Order Details Count: {sourceOrder?.data?.details?.length || 0}</div>
        <div>Processed for StockDetail: {detailItemsForStockDetail.length} items</div>
        <div>Final Items (with batches): {finalDetailItems.length} items</div>
        <div>Customer: {headerData.Name_of_Customer}</div>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create GDN - Order {orderId}</h1>
      
      <div className="space-y-6">
        <StockHeader
          headerData={headerData}
          onHeaderChange={(field, value) => {
            setHeaderData(prev => ({ ...prev, [field]: value }))
          }}
          customers={customers}
          isFromOrder={true}
        />

        {/* ✅ CRITICAL: Pass processed order details to StockDetail */}
        <StockDetail
          detailItems={detailItemsForStockDetail} // ✅ Pass processed order details
          onDetailChange={(items) => {
            console.log('📤 StockDetail sent back:', items.length, 'items')
            setFinalDetailItems(items) // ✅ Store final items with batches for submit
          }}
          mode="fromOrder"
          isFromOrder={true}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmitGDN}
            disabled={!headerData.COA_ID || finalDetailItems.length === 0}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            Create GDN ({finalDetailItems.filter(item => item.Batch_Number && item.QTY_Dispatched > 0).length} ready)
          </button>
        </div>
      </div>
    </div>
  )
}














































