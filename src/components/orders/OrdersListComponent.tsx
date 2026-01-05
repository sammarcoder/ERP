// // components/orders/OrdersListComponent.tsx - FIXED WITH CORRECT MODAL TYPES
// 'use client'
// import React, { useState } from 'react'
// import { useGetAllOrdersQuery, useDeleteOrderMutation, useUpdateOrderApprovalMutation } from '@/store/slice/orderApi'
// import { Button } from '@/components/ui/Button'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Printer, RotateCcw, Send } from 'lucide-react'
// import Link from 'next/link'
// import directPrintOrder from '@/components/orders/PrintModal'

// interface OrdersListProps {
//   orderType: 'sales' | 'purchase'
//   stockTypeId: '11' | '12' // 11 = Purchase, 12 = Sales
// }

// export default function OrdersListComponent({ orderType, stockTypeId }: OrdersListProps) {
//   const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())
//   const [deleteModal, setDeleteModal] = useState<{ open: boolean, orderId: string | null }>({
//     open: false,
//     orderId: null
//   })
//   const [confirmModal, setConfirmModal] = useState({ 
//     show: false, 
//     orderId: null, 
//     action: null, 
//     approvalValue: null 
//   })

//   // ✅ Configuration based on order type
//   const config = {
//     sales: {
//       title: 'Sales Orders',
//       createPath: '/sales/create',
//       editPath: (id: string) => `/orders/sales/${id}/edit`,
//       viewPath: (id: string) => `/orders/sales/${id}`,
//       buttonColor: 'bg-blue-500 hover:bg-blue-600',
//       dispatchLabel: 'Generate GDN',
//       customerLabel: 'Customer',
//       priceField: 'sellingPrice',
//       themeColor: 'blue'
//     },
//     purchase: {
//       title: 'Purchase Orders', 
//       createPath: '/orders/purchase/create',
//       editPath: (id: string) => `/orders/purchase/${id}/edit`,
//       viewPath: (id: string) => `/orders/purchase/${id}`,
//       buttonColor: 'bg-purple-500 hover:bg-purple-600',
//       dispatchLabel: 'Generate GRN',
//       customerLabel: 'Supplier',
//       priceField: 'purchasePricePKR',
//       themeColor: 'purple'
//     }
//   }

//   const currentConfig = config[orderType]

//   // ✅ API hooks
//   const {
//     data: ordersResponse,
//     isLoading,
//     error,
//     refetch
//   } = useGetAllOrdersQuery({
//     stockTypeId,
//     limit: 50
//   })

//   const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation()
//   const [updateOrderApproval, { isLoading: isUpdating }] = useUpdateOrderApprovalMutation()

//   // ✅ Print handler
//   const handlePrintOrder = (order: any) => {
//     console.log(`🖨️ Printing ${orderType} Order:`, order.Number)
//     directPrintOrder(order, orderType === 'purchase')
//   }

//   // ✅ Handle approval change with confirmation
//   const handleApprovalChange = (orderId: any, newApprovalStatus: number) => {
//     const action = newApprovalStatus === 1 ? 'approve' : 'reject'
//     setConfirmModal({
//       show: true,
//       orderId,
//       action,
//       approvalValue: newApprovalStatus
//     })
//   }

//   // ✅ Confirm approval/rejection
//   const confirmApprovalChange = async () => {
//     try {
//       await updateOrderApproval({
//         id: confirmModal.orderId,
//         approved: confirmModal.approvalValue
//       }).unwrap()

//       console.log(`✅ Order ${confirmModal.action}d successfully`)
//       setConfirmModal({ show: false, orderId: null, action: null, approvalValue: null })
      
//     } catch (error) {
//       console.error('❌ Failed to update approval:', error)
//       alert(`Failed to ${confirmModal.action} order: ${error.message}`)
//     }
//   }

//   const toggleOrderExpansion = (orderId: number) => {
//     setExpandedOrders(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(orderId)) {
//         newSet.delete(orderId)
//       } else {
//         newSet.add(orderId)
//       }
//       return newSet
//     })
//   }

//   // ✅ UOM Logic Helper
//   const getOrderLineDisplay = (detail: any) => {
//     const saleUnit = parseInt(detail.sale_unit)
//     const uomId = detail.Uom_Id
//     let quantity = 0
//     let uomName = 'Unknown'

//     if (saleUnit === 1 && detail.uom1_qty) {
//       quantity = parseFloat(detail.uom1_qty)
//       uomName = detail.item?.uom1?.uom || 'Pkt'
//     } else if (saleUnit === 2 && detail.uom2_qty) {
//       quantity = parseFloat(detail.uom2_qty)
//       uomName = detail.item?.uomTwo?.uom || 'Box'
//     } else if (saleUnit === 3 && detail.uom3_qty) {
//       quantity = parseFloat(detail.uom3_qty)
//       uomName = detail.item?.uomThree?.uom || 'Crt'
//     }

//     if (detail.uom && detail.uom.id === uomId) {
//       uomName = detail.uom.uom
//     }

//     return { quantity, uomName }
//   }

//   const handleDelete = async () => {
//     if (!deleteModal.orderId) return

//     try {
//       await deleteOrder(deleteModal.orderId).unwrap()
//       setDeleteModal({ open: false, orderId: null })
//     } catch (error) {
//       console.error('Failed to delete order:', error)
//     }
//   }

//   if (isLoading) return <div className="p-8 text-center">Loading {orderType} orders...</div>
//   if (error) return <div className="p-8 text-center text-red-600">Error loading orders</div>

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* ✅ Dynamic Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{currentConfig.title}</h1>
//           <p className="text-gray-600 text-sm">
//             Showing {ordersResponse?.data?.length || 0} of {ordersResponse?.pagination?.total || 0} orders
//           </p>
//         </div>
//         <Link href={currentConfig.createPath}>
//           <Button className={`${currentConfig.buttonColor} text-white px-4 py-2 rounded`}>
//             Create {orderType === 'sales' ? 'Sales' : 'Purchase'} Order
//           </Button>
//         </Link>
//       </div>

//       {/* ✅ Orders Table */}
//       <div className="bg-white rounded-lg border overflow-hidden">
//         {ordersResponse?.data?.map((order: any) => (
//           <div key={order.ID} className="border-b last:border-b-0">
//             {/* Main Order Row */}
//             <div className="flex items-center px-4 py-3 hover:bg-gray-50">
//               {/* Order Number */}
//               <div className="w-62">
//                 <Link 
//                   href={currentConfig.viewPath(order.ID)} 
//                   className={`${orderType === 'sales' ? 'text-blue-600 hover:text-blue-800' : 'text-purple-600 hover:text-purple-800'} font-medium`}
//                 >
//                   #{order.Number}
//                 </Link>
//               </div>

//               {/* Date */}
//               <div className="w-24 text-sm text-gray-700">
//                 {new Date(order.Date).toLocaleDateString('en-GB')}
//               </div>

//               {/* ✅ Approval Status (Updated) */}
//               <div className="w-32">
//                 <select
//                   className={`text-xs border rounded px-2 py-1 cursor-pointer transition-colors ${
//                     order.approved === 1 
//                       ? 'bg-green-100 text-green-800 border-green-200'
//                       : 'bg-red-100 text-red-800 border-red-200'
//                   }`}
//                   value={order.approved || 0}
//                   onChange={(e) => handleApprovalChange(order.ID, parseInt(e.target.value))}
//                   disabled={isUpdating}
//                 >
//                   <option value={0}>Rejected</option>
//                   <option value={1}>Approved</option>
//                 </select>
//               </div>

//               {/* Customer/Supplier Name */}
//               <div className="flex-1 text-sm text-gray-900 font-medium">
//                 <div>{order.account?.acName || 'N/A'}</div>
//                 <div className="text-xs text-gray-500">{currentConfig.customerLabel}</div>
//               </div>

//               {/* Items Count */}
//               <div className="w-20 text-sm text-center text-gray-600">
//                 {order.details?.length || 0} Items
//               </div>

//               {/* Status Info */}
//               <div className="w-32 text-xs text-gray-600">
//                 <div>Status: {order.Next_Status || 'Incomplete'}</div>
//                 <div>Note: {order.is_Note_generated ? 'Generated' : 'Pending'}</div>
//               </div>

//               {/* Action Icons */}
//               <div className="w-64 flex items-center justify-end gap-1">
//                 {/* ✅ Conditional GRN/GDN Generation Button */}
//                 {order.approved === 1 && 
//                  order.Next_Status === 'Incomplete' && 
//                  order.is_Note_generated === 0 && (
//                   <button 
//                     className={`${currentConfig.buttonColor} text-white px-2 py-1 rounded text-xs`}
//                     onClick={() => console.log(`Generate ${orderType === 'sales' ? 'GDN' : 'GRN'} for order:`, order.ID)}
//                     title={currentConfig.dispatchLabel}
//                   >
//                     {orderType === 'sales' ? 'GDN' : 'GRN'}
//                   </button>
//                 )}

//                 {/* Print Button */}
//                 <button 
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                   title="Print Order"
//                   onClick={() => handlePrintOrder(order)}
//                 >
//                   <Printer className="w-4 h-4" />
//                 </button>
                
//                 {/* Edit Button */}
//                 <Link href={currentConfig.editPath(order.ID)}>
//                   <button 
//                     className="p-1 text-gray-400 hover:text-blue-600" 
//                     title="Edit"
//                   >
//                     <Edit className="w-4 h-4" />
//                   </button>
//                 </Link>
                
//                 {/* Delete Button */}
//                 <button
//                   className="p-1 text-gray-400 hover:text-red-600"
//                   title="Delete"
//                   onClick={() => setDeleteModal({ open: true, orderId: order.ID.toString() })}
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
                
//                 {/* Expand Button */}
//                 <button
//                   className="p-1 text-gray-400 hover:text-gray-600"
//                   title="Expand"
//                   onClick={() => toggleOrderExpansion(order.ID)}
//                 >
//                   {expandedOrders.has(order.ID) ?
//                     <ChevronUp className="w-4 h-4" /> :
//                     <ChevronDown className="w-4 h-4" />
//                   }
//                 </button>
//               </div>
//             </div>

//             {/* ✅ Expandable Line Items */}
//             {expandedOrders.has(order.ID) && (
//               <div className="bg-gray-50 px-4 py-3 border-t">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Order Line Items:</h4>
//                 <div className="space-y-2">
//                   {order.details?.map((detail: any) => {
//                     const { quantity, uomName } = getOrderLineDisplay(detail)
//                     const unitPrice = parseFloat(detail.item?.[currentConfig.priceField] || 0)

//                     return (
//                       <div key={detail.ID} className="bg-white rounded border p-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-4">
//                             <span className={`text-xs px-2 py-1 rounded ${
//                               orderType === 'sales' 
//                                 ? 'bg-blue-100 text-blue-800' 
//                                 : 'bg-purple-100 text-purple-800'
//                             }`}>
//                               LINE {detail.Line_Id}
//                             </span>
//                             <span className="font-medium text-sm">
//                               {detail.item?.itemName || 'Unknown Item'}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-6 text-sm">
//                             <div className="text-center">
//                               <div className="text-xs text-gray-500">QUANTITY</div>
//                               <div className="font-medium">{quantity} {uomName}</div>
//                             </div>

//                             <div className="text-center">
//                               <div className="text-xs text-gray-500">UNIT PRICE</div>
//                               <div className="font-medium">Rs {unitPrice.toFixed(2)}</div>
//                             </div>

//                             <div className="text-center">
//                               <div className="text-xs text-gray-500">LINE TOTAL</div>
//                               <div className={`font-medium ${
//                                 orderType === 'sales' ? 'text-green-600' : 'text-purple-600'
//                               }`}>
//                                 Rs {(quantity * unitPrice).toFixed(2)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="mt-2 pt-2 border-t border-gray-100">
//                           <div className="text-xs text-gray-500">
//                             <span className="font-medium">UOM Data:</span> 
//                             Pkt: {detail.uom1_qty} | Box: {detail.uom2_qty} | Crt: {detail.uom3_qty} | 
//                             Sale Unit: {detail.sale_unit} | <strong>UOM_ID: {detail.Uom_Id}</strong>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Empty State */}
//         {(!ordersResponse?.data || ordersResponse.data.length === 0) && (
//           <div className="p-12 text-center text-gray-500">
//             <p>No {orderType} orders found</p>
//             <Link href={currentConfig.createPath}>
//               <Button className={`mt-4 ${currentConfig.buttonColor} text-white px-4 py-2 rounded`}>
//                 Create Your First {orderType === 'sales' ? 'Sales' : 'Purchase'} Order
//               </Button>
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* ✅ FIXED: Delete Confirmation Modal - Using supported 'danger' type */}
//       <ConfirmationModal
//         isOpen={deleteModal.open}
//         onClose={() => setDeleteModal({ open: false, orderId: null })}
//         onConfirm={handleDelete}
//         title={`Delete ${orderType === 'sales' ? 'Sales' : 'Purchase'} Order`}
//         message={`Are you sure you want to delete this ${orderType} order? This action cannot be undone.`}
//         confirmText="Delete Order"
//         cancelText="Cancel"
//         type="danger" // ✅ FIXED: Using supported type
//         loading={isDeleting}
//       />

//       {/* ✅ FIXED: Approval Confirmation Modal - Using supported types */}
//       <ConfirmationModal
//         isOpen={confirmModal.show}
//         onClose={() => setConfirmModal({ show: false, orderId: null, action: null, approvalValue: null })}
//         onConfirm={confirmApprovalChange}
//         title={`${confirmModal.action === 'approve' ? 'Approve' : 'Reject'} Order`}
//         message={`Are you sure you want to ${confirmModal.action} this ${orderType} order? This action will ${confirmModal.action === 'approve' ? `allow ${orderType === 'sales' ? 'GDN' : 'GRN'} generation` : `prevent ${orderType === 'sales' ? 'GDN' : 'GRN'} generation`}.`}
//         confirmText={confirmModal.action === 'approve' ? 'Approve Order' : 'Reject Order'}
//         cancelText="Cancel"
//         type={confirmModal.action === 'approve' ? 'info' : 'warning'} // ✅ FIXED: Using supported types only
//         loading={isUpdating}
//       />
//     </div>
//   )
// }

























































// components/orders/OrdersListComponent.tsx - FIXED FOR BOOLEAN VALUES
'use client'
import React, { useState } from 'react'
import { useGetAllOrdersQuery, useDeleteOrderMutation, useUpdateOrderApprovalMutation } from '@/store/slice/orderApi'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Printer, RotateCcw, Send, Lock } from 'lucide-react'
import Link from 'next/link'
import directPrintOrder from '@/components/orders/PrintModal'

interface OrdersListProps {
  orderType: 'sales' | 'purchase'
  stockTypeId: '11' | '12' // 11 = Purchase, 12 = Sales
}

export default function OrdersListComponent({ orderType, stockTypeId }: OrdersListProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, orderId: string | null }>({
    open: false,
    orderId: null
  })
  const [confirmModal, setConfirmModal] = useState({ 
    show: false, 
    orderId: null, 
    action: null, 
    approvalValue: null 
  })

  // ✅ Configuration based on order type
  const config = {
    sales: {
      title: 'Sales Orders',
      createPath: '/orders/sales/create',
      editPath: (id: string) => `/orders/sales/${id}/edit`,
      viewPath: (id: string) => `/orders/sales/${id}`,
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      dispatchLabel: 'Generate GDN',
      customerLabel: 'Customer',
      priceField: 'sellingPrice',
      themeColor: 'blue'
    },
    purchase: {
      title: 'Purchase Orders', 
      createPath: '/orders/purchase/create',
      editPath: (id: string) => `/orders/purchase/${id}/edit`,
      viewPath: (id: string) => `/orders/purchase/${id}`,
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      dispatchLabel: 'Generate GRN',
      customerLabel: 'Supplier',
      priceField: 'purchasePricePKR',
      themeColor: 'purple'
    }
  }

  const currentConfig = config[orderType]

  // ✅ API hooks
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch
  } = useGetAllOrdersQuery({
    stockTypeId,
    limit: 50
  })

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation()
  const [updateOrderApproval, { isLoading: isUpdating }] = useUpdateOrderApprovalMutation()

  // ✅ Print handler
  const handlePrintOrder = (order: any) => {
    console.log(`🖨️ Printing ${orderType} Order:`, order.Number)
    directPrintOrder(order, orderType === 'purchase')
  }

  // ✅ FIXED: Handle boolean values from API
  const canChangeApproval = (order: any) => {
    // ✅ FIXED: Check for boolean true, not 1
    if (order.is_Note_generated === true) {
      return false
    }
    return true
  }

  // ✅ FIXED: Convert boolean to number for API
  const handleApprovalChange = (orderId: any, newApprovalStatus: number, order: any) => {
    // ✅ FIXED: Check for boolean true, not 1
    if (order.is_Note_generated === true) {
      alert(`Cannot change approval status. ${orderType === 'sales' ? 'GDN' : 'GRN'} has already been generated for this order.`)
      return
    }

    const action = newApprovalStatus === 1 ? 'approve' : 'reject'
    setConfirmModal({
      show: true,
      orderId,
      action,
      approvalValue: newApprovalStatus
    })
  }

  // ✅ Confirm approval/rejection
  const confirmApprovalChange = async () => {
    try {
      await updateOrderApproval({
        id: confirmModal.orderId,
        approved: confirmModal.approvalValue
      }).unwrap()

      console.log(`✅ Order ${confirmModal.action}d successfully`)
      setConfirmModal({ show: false, orderId: null, action: null, approvalValue: null })
      
    } catch (error) {
      console.error('❌ Failed to update approval:', error)
      alert(`Failed to ${confirmModal.action} order: ${error.message}`)
    }
  }

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  // ✅ UOM Logic Helper
  const getOrderLineDisplay = (detail: any) => {
    const saleUnit = parseInt(detail.sale_unit)
    const uomId = detail.Uom_Id
    let quantity = 0
    let uomName = 'Unknown'

    if (saleUnit === 1 && detail.uom1_qty) {
      quantity = parseFloat(detail.uom1_qty)
      uomName = detail.item?.uom1?.uom || 'Pkt'
    } else if (saleUnit === 2 && detail.uom2_qty) {
      quantity = parseFloat(detail.uom2_qty)
      uomName = detail.item?.uomTwo?.uom || 'Box'
    } else if (saleUnit === 3 && detail.uom3_qty) {
      quantity = parseFloat(detail.uom3_qty)
      uomName = detail.item?.uomThree?.uom || 'Crt'
    }

    if (detail.uom && detail.uom.id === uomId) {
      uomName = detail.uom.uom
    }

    return { quantity, uomName }
  }

  const handleDelete = async () => {
    if (!deleteModal.orderId) return

    try {
      await deleteOrder(deleteModal.orderId).unwrap()
      setDeleteModal({ open: false, orderId: null })
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading {orderType} orders...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error loading orders</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* ✅ Dynamic Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentConfig.title}</h1>
          <p className="text-gray-600 text-sm">
            Showing {ordersResponse?.data?.length || 0} of {ordersResponse?.pagination?.total || 0} orders
          </p>
        </div>
        <Link href={currentConfig.createPath}>
          <Button className={`${currentConfig.buttonColor} text-white px-4 py-2 rounded`}>
            Create {orderType === 'sales' ? 'Sales' : 'Purchase'} Order
          </Button>
        </Link>
      </div>

      {/* ✅ Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {ordersResponse?.data?.map((order: any) => (
          <div key={order.ID} className="border-b last:border-b-0">
            {/* Main Order Row */}
            <div className="flex items-center px-4 py-3 hover:bg-gray-50">
              {/* Order Number */}
              <div className="w-62">
                <Link 
                  href={currentConfig.viewPath(order.ID)} 
                  className={`${orderType === 'sales' ? 'text-blue-600 hover:text-blue-800' : 'text-purple-600 hover:text-purple-800'} font-medium`}
                >
                  #{order.Number}
                </Link>
              </div>

              {/* Date */}
              <div className="w-24 text-sm text-gray-700">
                {new Date(order.Date).toLocaleDateString('en-GB')}
              </div>

              {/* ✅ FIXED: Approval Status with Boolean Values */}
              <div className="w-40">
                <div className="flex items-center gap-2">
                  <select
                    className={`text-xs border rounded px-2 py-1 transition-colors ${
                      order.approved === true  // ✅ FIXED: Check for boolean true
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    } ${
                      !canChangeApproval(order) ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                    }`}
                    value={order.approved === true ? 1 : 0} // ✅ FIXED: Convert boolean to number for select
                    onChange={(e) => handleApprovalChange(order.ID, parseInt(e.target.value), order)}
                    disabled={isUpdating || !canChangeApproval(order)}
                  >
                    <option value={0}>Rejected</option>
                    <option value={1}>Approved</option>
                  </select>
                  
                  {/* ✅ Lock Icon when approval is locked */}
                  {!canChangeApproval(order) && (
                    <Lock 
                      className="w-3 h-3 text-gray-400" 
                      title={`Approval locked - ${orderType === 'sales' ? 'GDN' : 'GRN'} already generated`} 
                    />
                  )}
                </div>
              </div>

              {/* Customer/Supplier Name */}
              <div className="flex-1 text-sm text-gray-900 font-medium">
                <div>{order.account?.acName || 'N/A'}</div>
                <div className="text-xs text-gray-500">{currentConfig.customerLabel}</div>
              </div>

              {/* Items Count */}
              <div className="w-20 text-sm text-center text-gray-600">
                {order.details?.length || 0} Items
              </div>

              {/* ✅ FIXED: Status Info with Boolean Values */}
              <div className="w-36 text-xs text-gray-600">
                <div>Status: {order.Next_Status || 'Incomplete'}</div>
                <div className={`${order.is_Note_generated === true ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                  Note: {order.is_Note_generated === true ? 'Generated ✓' : 'Pending'}
                </div>
              </div>

              {/* Action Icons */}
              <div className="w-64 flex items-center justify-end gap-1">
               
                {order.approved === true &&  
                 order.Next_Status === 'Incomplete' && 
                 order.is_Note_generated === false && ( 
                  <button 
                    className={`${currentConfig.buttonColor} text-white px-2 py-1 rounded text-xs font-medium`}
                    onClick={() => console.log(`Generate ${orderType === 'sales' ? 'GDN' : 'GRN'} for order:`, order.ID)}
                    title={currentConfig.dispatchLabel}
                  >
                    {orderType === 'sales' ? 'GDN' : 'GRN'}
                  </button>
                )}

                {/* ✅ FIXED: Show status when note is generated */}
                {order.is_Note_generated === true && ( 
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                    {orderType === 'sales' ? 'GDN' : 'GRN'} Generated
                  </span>
                )}

                {/* Print Button */}
                <button 
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Print Order"
                  onClick={() => handlePrintOrder(order)}
                >
                  <Printer className="w-4 h-4" />
                </button>
                
                {/* ✅ FIXED: Edit Button - Disabled if note generated */}
                <Link href={currentConfig.editPath(order.ID)}>
                  <button 
                    className={`p-1 transition-colors ${
                      order.is_Note_generated === true  // ✅ FIXED: Check for boolean true
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-blue-600'
                    }`} 
                    title={order.is_Note_generated === true ? 'Cannot edit - Note generated' : 'Edit'}
                    disabled={order.is_Note_generated === true}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
                
                {/* ✅ FIXED: Delete Button - Disabled if note generated */}
                <button
                  className={`p-1 transition-colors ${
                    order.is_Note_generated === true  // ✅ FIXED: Check for boolean true
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-red-600'
                  }`}
                  title={order.is_Note_generated === true ? 'Cannot delete - Note generated' : 'Delete'}
                  onClick={() => {
                    if (order.is_Note_generated === true) { // ✅ FIXED: Check for boolean true
                      alert(`Cannot delete order. ${orderType === 'sales' ? 'GDN' : 'GRN'} has already been generated.`)
                      return
                    }
                    setDeleteModal({ open: true, orderId: order.ID.toString() })
                  }}
                  disabled={order.is_Note_generated === true}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                {/* Expand Button */}
                <button
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Expand"
                  onClick={() => toggleOrderExpansion(order.ID)}
                >
                  {expandedOrders.has(order.ID) ?
                    <ChevronUp className="w-4 h-4" /> :
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* ✅ Expandable Line Items - Same as before */}
            {expandedOrders.has(order.ID) && (
              <div className="bg-gray-50 px-4 py-3 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Order Line Items:</h4>
                <div className="space-y-2">
                  {order.details?.map((detail: any) => {
                    const { quantity, uomName } = getOrderLineDisplay(detail)
                    const unitPrice = parseFloat(detail.item?.[currentConfig.priceField] || 0)

                    return (
                      <div key={detail.ID} className="bg-white rounded border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className={`text-xs px-2 py-1 rounded ${
                              orderType === 'sales' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              LINE {detail.Line_Id}
                            </span>
                            <span className="font-medium text-sm">
                              {detail.item?.itemName || 'Unknown Item'}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">QUANTITY</div>
                              <div className="font-medium">{quantity} {uomName}</div>
                            </div>

                            <div className="text-center">
                              <div className="text-xs text-gray-500">UNIT PRICE</div>
                              <div className="font-medium">Rs {unitPrice.toFixed(2)}</div>
                            </div>

                            <div className="text-center">
                              <div className="text-xs text-gray-500">LINE TOTAL</div>
                              <div className={`font-medium ${
                                orderType === 'sales' ? 'text-green-600' : 'text-purple-600'
                              }`}>
                                Rs {(quantity * unitPrice).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">UOM Data:</span> 
                            Pkt: {detail.uom1_qty} | Box: {detail.uom2_qty} | Crt: {detail.uom3_qty} | 
                            Sale Unit: {detail.sale_unit} | <strong>UOM_ID: {detail.Uom_Id}</strong>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {(!ordersResponse?.data || ordersResponse.data.length === 0) && (
          <div className="p-12 text-center text-gray-500">
            <p>No {orderType} orders found</p>
            <Link href={currentConfig.createPath}>
              <Button className={`mt-4 ${currentConfig.buttonColor} text-white px-4 py-2 rounded`}>
                Create Your First {orderType === 'sales' ? 'Sales' : 'Purchase'} Order
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* ✅ Confirmation Modals - Same as before */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, orderId: null })}
        onConfirm={handleDelete}
        title={`Delete ${orderType === 'sales' ? 'Sales' : 'Purchase'} Order`}
        message={`Are you sure you want to delete this ${orderType} order? This action cannot be undone.`}
        confirmText="Delete Order"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />

      <ConfirmationModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, orderId: null, action: null, approvalValue: null })}
        onConfirm={confirmApprovalChange}
        title={`${confirmModal.action === 'approve' ? 'Approve' : 'Reject'} Order`}
        message={`Are you sure you want to ${confirmModal.action} this ${orderType} order? This action will ${confirmModal.action === 'approve' ? `allow ${orderType === 'sales' ? 'GDN' : 'GRN'} generation` : `prevent ${orderType === 'sales' ? 'GDN' : 'GRN'} generation`}.`}
        confirmText={confirmModal.action === 'approve' ? 'Approve Order' : 'Reject Order'}
        cancelText="Cancel"
        type={confirmModal.action === 'approve' ? 'info' : 'warning'}
        loading={isUpdating}
      />
    </div>
  )
}
