


// 'use client'
// import React, { useState } from 'react'
// import { useGetAllOrdersQuery, useDeleteOrderMutation } from '@/store/slice/orderApi'
// import { Button } from '@/components/ui/Button'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Printer, RotateCcw, Send } from 'lucide-react'
// import Link from 'next/link'
// import directPrintOrder from '@/components/orders/PrintModal' // ✅ Import the existing PrintModal component

// export default function SalesOrdersPage() {
//     const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())
//     const [deleteModal, setDeleteModal] = useState<{ open: boolean, orderId: string | null }>({
//         open: false,
//         orderId: null
//     })

//     const {
//         data: ordersResponse,
//         isLoading,
//         error,
//         refetch
//     } = useGetAllOrdersQuery({
//         stockTypeId: '11',  // Sales Orders
//         limit: 50
//     })

//     const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation()

//     // ✅ Simple print handler - just call the existing PrintModal function
//     const handlePrintOrder = (order: any) => {
//         console.log('🖨️ Printing Sales Order:', order.Number)
//         directPrintOrder(order, false) // false = Sales Order
//     }

//     const toggleOrderExpansion = (orderId: number) => {
//         setExpandedOrders(prev => {
//             const newSet = new Set(prev)
//             if (newSet.has(orderId)) {
//                 newSet.delete(orderId)
//             } else {
//                 newSet.add(orderId)
//             }
//             return newSet
//         })
//     }

//     // UOM Logic Helper
//     const getOrderLineDisplay = (detail: any) => {
//         const saleUnit = parseInt(detail.sale_unit)
//         const uomId = detail.Uom_Id
//         let quantity = 0
//         let uomName = 'Unknown'

//         if (saleUnit === 1 && detail.uom1_qty) {
//             quantity = parseFloat(detail.uom1_qty)
//             uomName = detail.item?.uom1?.uom || 'Pkt'
//         } else if (saleUnit === 2 && detail.uom2_qty) {
//             quantity = parseFloat(detail.uom2_qty)
//             uomName = detail.item?.uomTwo?.uom || 'Box'
//         } else if (saleUnit === 3 && detail.uom3_qty) {
//             quantity = parseFloat(detail.uom3_qty)
//             uomName = detail.item?.uomThree?.uom || 'Crt'
//         }

//         if (detail.uom && detail.uom.id === uomId) {
//             uomName = detail.uom.uom
//         }

//         return { quantity, uomName }
//     }

//     const handleDelete = async () => {
//         if (!deleteModal.orderId) return

//         try {
//             await deleteOrder(deleteModal.orderId).unwrap()
//             setDeleteModal({ open: false, orderId: null })
//         } catch (error) {
//             console.error('Failed to delete order:', error)
//         }
//     }

//     if (isLoading) return <div className="p-8 text-center">Loading sales orders...</div>
//     if (error) return <div className="p-8 text-center text-red-600">Error loading orders</div>

//     return (
//         <div className="max-w-7xl mx-auto p-6">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
//                     <p className="text-gray-600 text-sm">
//                         Showing {ordersResponse?.data?.length || 0} of {ordersResponse?.pagination?.total || 0} orders
//                     </p>
//                 </div>
//                 <Link href="/sales/create">
//                     <Button className="text-white px-4 py-2 rounded">Create Sales Order</Button>
//                 </Link>
//             </div>

//             {/* Orders Table */}
//             <div className="bg-white rounded-lg border overflow-hidden">
//                 {ordersResponse?.data?.map((order: any) => (
//                     <div key={order.ID} className="border-b last:border-b-0">
//                         {/* Main Order Row */}
//                         <div className="flex items-center px-4 py-3 hover:bg-gray-50">
//                             {/* Order Number */}
//                             <div className="w-62">
//                                 <Link href={`/orders/purchase/${order.ID}`} className="text-blue-600 hover:text-blue-800 font-medium">
//                                     #{order.Number}
//                                 </Link>
//                             </div>

//                             {/* Date */}
//                             <div className="w-24 text-sm text-gray-700">
//                                 {new Date(order.Date).toLocaleDateString('en-GB')}
//                             </div>

//                             {/* Status */}
//                             <div className="w-32">
//                                 <select
//                                     className="text-xs bg-red-100 text-red-800 border border-red-200 rounded px-2 py-1 cursor-pointer"
//                                     value={order.Next_Status || 'Incomplete'}
//                                     onChange={(e) => console.log('Update status to:', e.target.value)}
//                                 >
//                                     <option value="Incomplete">Incomplete</option>
//                                     <option value="Complete">Complete</option>
//                                     <option value="Pending">Pending</option>
//                                     <option value="Cancelled">Cancelled</option>
//                                 </select>
//                             </div>

//                             {/* Customer Name */}
//                             <div className="flex-1 text-sm text-gray-900 font-medium">
//                                 {order.account?.acName || 'N/A'}
//                             </div>

//                             {/* Items Count */}
//                             <div className="w-20 text-sm text-center text-gray-600">
//                                 {order.details?.length || 0} Items
//                             </div>

//                             {/* Action Icons */}
//                             <div className="w-48 flex items-center justify-end gap-1">
//                                 {/* ✅ Print Button - Uses existing PrintModal component */}
//                                 <button 
//                                     className="p-1 text-gray-400 hover:text-blue-600 transition-colors" 
//                                     title="Print Order"
//                                     onClick={() => handlePrintOrder(order)}
//                                 >
//                                     <Printer className="w-4 h-4" />
//                                 </button>
                                
//                                 <Link href={`/orders/purchase/${order.ID}/edit`}>
//                                     <button className="p-1 text-gray-400 hover:text-blue-600" title="Edit">
//                                         <Edit className="w-4 h-4" />
//                                     </button>
//                                 </Link>
                                
//                                 <button
//                                     className="p-1 text-gray-400 hover:text-red-600"
//                                     title="Delete"
//                                     onClick={() => setDeleteModal({ open: true, orderId: order.ID.toString() })}
//                                 >
//                                     <Trash2 className="w-4 h-4" />
//                                 </button>
                                
//                                 <button className="p-1 text-gray-400 hover:text-gray-600" title="Dispatch">
//                                     <Send className="w-4 h-4" />
//                                 </button>
                                
//                                 <button
//                                     className="p-1 text-gray-400 hover:text-gray-600"
//                                     title="Expand"
//                                     onClick={() => toggleOrderExpansion(order.ID)}
//                                 >
//                                     {expandedOrders.has(order.ID) ?
//                                         <ChevronUp className="w-4 h-4" /> :
//                                         <ChevronDown className="w-4 h-4" />
//                                     }
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Expandable Line Items */}
//                         {expandedOrders.has(order.ID) && (
//                             <div className="bg-gray-50 px-4 py-3 border-t">
//                                 <h4 className="text-sm font-medium text-gray-700 mb-3">Order Line Items:</h4>
//                                 <div className="space-y-2">
//                                     {order.details?.map((detail: any) => {
//                                         const { quantity, uomName } = getOrderLineDisplay(detail)

//                                         return (
//                                             <div key={detail.ID} className="bg-white rounded border p-3">
//                                                 <div className="flex items-center justify-between">
//                                                     <div className="flex items-center gap-4">
//                                                         <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                                                             LINE {detail.Line_Id}
//                                                         </span>
//                                                         <span className="font-medium text-sm">
//                                                             {detail.item?.itemName || 'Unknown Item'}
//                                                         </span>
//                                                     </div>

//                                                     <div className="flex items-center gap-6 text-sm">
//                                                         <div className="text-center">
//                                                             <div className="text-xs text-gray-500">QUANTITY</div>
//                                                             <div className="font-medium">{quantity} {uomName}</div>
//                                                         </div>

//                                                         <div className="text-center">
//                                                             <div className="text-xs text-gray-500">UNIT PRICE</div>
//                                                             <div className="font-medium">
//                                                                 Rs {parseFloat(detail.item?.sellingPrice || 0).toFixed(2)}
//                                                             </div>
//                                                         </div>

//                                                         <div className="text-center">
//                                                             <div className="text-xs text-gray-500">LINE TOTAL</div>
//                                                             <div className="font-medium text-green-600">
//                                                                 Rs {(quantity * parseFloat(detail.item?.sellingPrice || 0)).toFixed(2)}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="mt-2 pt-2 border-t border-gray-100">
//                                                     <div className="text-xs text-gray-500">
//                                                         <span className="font-medium">UOM Data:</span> 
//                                                         Pkt: {detail.uom1_qty} | Box: {detail.uom2_qty} | Crt: {detail.uom3_qty} | 
//                                                         Sale Unit: {detail.sale_unit} | <strong>UOM_ID: {detail.Uom_Id}</strong>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )
//                                     })}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}

//                 {/* Empty State */}
//                 {(!ordersResponse?.data || ordersResponse.data.length === 0) && (
//                     <div className="p-12 text-center text-gray-500">
//                         <p>No sales orders found</p>
//                         <Link href="/sales/create">
//                             <Button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
//                                 Create Your First Sales Order
//                             </Button>
//                         </Link>
//                     </div>
//                 )}
//             </div>

//             {/* Delete Modal */}
//             <ConfirmationModal
//                 isOpen={deleteModal.open}
//                 onClose={() => setDeleteModal({ open: false, orderId: null })}
//                 onConfirm={handleDelete}
//                 title="Delete Sales Order"
//                 message="Are you sure you want to delete this sales order? This action cannot be undone."
//                 confirmText="Delete Order"
//                 cancelText="Cancel"
//                 type="danger"
//                 loading={isDeleting}
//             />
//         </div>
//     )
// }






































// app/orders/purchase/page.tsx
import OrdersListComponent from '@/components/orders/OrdersListComponent'

export default function PurchaseOrdersPage() {
  return (
    <OrdersListComponent 
      orderType="purchase" 
      stockTypeId="11" 
    />
  )
}
