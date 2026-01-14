



// // components/orders/OrdersListComponent.tsx - FIXED FOR BOOLEAN VALUES
// 'use client'
// import React, { useState } from 'react'
// import { useGetAllOrdersQuery, useDeleteOrderMutation, useUpdateOrderApprovalMutation } from '@/store/slice/orderApi'
// import { Button } from '@/components/ui/Button'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Printer, RotateCcw, Send, Lock } from 'lucide-react'
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
//       createPath: '/orders/sales/create',
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

//   // ✅ FIXED: Handle boolean values from API
//   const canChangeApproval = (order: any) => {
//     // ✅ FIXED: Check for boolean true, not 1
//     if (order.is_Note_generated === true) {
//       return false
//     }
//     return true
//   }

//   // ✅ FIXED: Convert boolean to number for API
//   const handleApprovalChange = (orderId: any, newApprovalStatus: number, order: any) => {
//     // ✅ FIXED: Check for boolean true, not 1
//     if (order.is_Note_generated === true) {
//       alert(`Cannot change approval status. ${orderType === 'sales' ? 'GDN' : 'GRN'} has already been generated for this order.`)
//       return
//     }

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
//           <p className="text-gray-600 ">
//             Showing {ordersResponse?.data?.length || 0} of {ordersResponse?.pagination?.total || 0} orders
//           </p>
//         </div>
//         <Link href={currentConfig.createPath}>
//           <Button className={`${currentConfig.buttonColor} text-white px-1 py-2 rounded`}>
//             Create {orderType === 'sales' ? 'Sales' : 'Purchase'} Order
//           </Button>
//         </Link>
//       </div>

//       {/* ✅ Orders Table */}
//       <div className="bg-white rounded-lg border overflow-hidden">
//         {ordersResponse?.data?.map((order: any) => (
//           <div key={order.ID} className="border-b last:border-b-0">
//             {/* Main Order Row */}
//             <div className="flex items-center px-1 py-2 space-x-4 hover:bg-gray-50">
//               {/* Order Number */}
//               <div className="">
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

//               {/* Customer/Supplier Name */}
//               <div className="flex-1 text-sm text-gray-900 font-medium">
//                 <div>{order.account?.acName || 'N/A'}</div>
//                 {/* <div className="text-xs text-gray-500">{currentConfig.customerLabel}</div> */}
//               </div>
//               <div className="flex-1 text-sm text-gray-900 font-medium">
//                 <div>{order.sub_customer || 'N/A'}</div>
//                 {/* <div className="text-xs text-gray-500">{currentConfig.customerLabel}</div> */}
//               </div>

//               <div className="flex-1 text-sm text-gray-900 font-medium">
//                 <div>{order.account?.setupName || 'N/A'}</div>
//                 {/* <div className="text-xs text-gray-500">{currentConfig.customerLabel}</div> */}
//               </div>

//               {/* ✅ FIXED: Approval Status with Boolean Values */}
//               <div className="w-28">
//                 <div className="flex items-center gap-2">
//                   <select
//                     className={`text-xs border rounded px-2 py-1 transition-colors ${order.approved === true  // ✅ FIXED: Check for boolean true
//                         ? 'bg-green-100 text-green-800 border-green-200'
//                         : 'bg-red-100 text-red-800 border-red-200'
//                       } ${!canChangeApproval(order) ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
//                       }`}
//                     value={order.approved === true ? 1 : 0} // ✅ FIXED: Convert boolean to number for select
//                     onChange={(e) => handleApprovalChange(order.ID, parseInt(e.target.value), order)}
//                     disabled={isUpdating || !canChangeApproval(order)}
//                   >
//                     <option value={0}>Rejected</option>
//                     <option value={1}>Approved</option>
//                   </select>

//                   {/* ✅ Lock Icon when approval is locked */}
//                   {!canChangeApproval(order) && (
//                     <Lock
//                       className="w-3 h-3 text-gray-400"
//                       title={`Approval locked - ${orderType === 'sales' ? 'GDN' : 'GRN'} already generated`}
//                     />
//                   )}
//                 </div>
//               </div>



//               {/* Items Count */}
//               <div className="w-14 text-sm text-center text-gray-600">
//                 {order.details?.length || 0} Items
//               </div>

//               {/* ✅ FIXED: Status Info with Boolean Values */}
//               <div className="w-26 text-xs text-gray-600">
//                 <div>Status: {order.Next_Status || 'Incomplete'}</div>
//                 <div className={`${order.is_Note_generated === true ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
//                   Note: {order.is_Note_generated === true ? 'Generated ✓' : 'Pending'}
//                 </div>
//               </div>

//               {/* Action Icons */}
//               <div className="flex items-center justify-end gap-1">

//                 {order.approved === true &&
//                   order.Next_Status === 'Incomplete' &&
//                   order.is_Note_generated === false && (
//                     <button
//                       className={`${currentConfig.buttonColor} text-white px-2 py-1 rounded text-xs font-medium`}
//                       onClick={() => console.log(`Generate ${orderType === 'sales' ? 'GDN' : 'GRN'} for order:`, order.ID)}
//                       title={currentConfig.dispatchLabel}
//                     >
//                       {orderType === 'sales' ? 'GDN' : 'GRN'}
//                     </button>
//                   )}

//                 {/* ✅ FIXED: Show status when note is generated */}
//                 {/* {order.is_Note_generated === true && (
//                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
//                     {orderType === 'sales' ? 'GDN' : 'GRN'} Generated
//                   </span>
//                 )} */}

//                 {/* Print Button */}
//                 <button
//                   className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
//                   title="Print Order"
//                   onClick={() => handlePrintOrder(order)}
//                 >
//                   <Printer className="w-4 h-4" />
//                 </button>

//                 {/* ✅ FIXED: Edit Button - Disabled if note generated */}
//                 <Link href={currentConfig.editPath(order.ID)}>
//                   <button
//                     className={`p-1 transition-colors ${order.is_Note_generated === true  // ✅ FIXED: Check for boolean true
//                         ? 'text-gray-300 cursor-not-allowed'
//                         : 'text-gray-400 hover:text-blue-600'
//                       }`}
//                     title={order.is_Note_generated === true ? 'Cannot edit - Note generated' : 'Edit'}
//                     disabled={order.is_Note_generated === true}
//                   >
//                     <Edit className="w-4 h-4" />
//                   </button>
//                 </Link>

//                 {/* ✅ FIXED: Delete Button - Disabled if note generated */}
//                 <button
//                   className={`p-1 transition-colors ${order.is_Note_generated === true  // ✅ FIXED: Check for boolean true
//                       ? 'text-gray-300 cursor-not-allowed'
//                       : 'text-gray-400 hover:text-red-600'
//                     }`}
//                   title={order.is_Note_generated === true ? 'Cannot delete - Note generated' : 'Delete'}
//                   onClick={() => {
//                     if (order.is_Note_generated === true) { // ✅ FIXED: Check for boolean true
//                       alert(`Cannot delete order. ${orderType === 'sales' ? 'GDN' : 'GRN'} has already been generated.`)
//                       return
//                     }
//                     setDeleteModal({ open: true, orderId: order.ID.toString() })
//                   }}
//                   disabled={order.is_Note_generated === true}
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

//             {/* ✅ Expandable Line Items - Same as before */}
//             {expandedOrders.has(order.ID) && (
//               <div className="bg-gray-50 px-1 py-2 border-t">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Order Line Items:</h4>
//                 <div className="space-y-2">
//                   {order.details?.map((detail: any) => {
//                     const { quantity, uomName } = getOrderLineDisplay(detail)
//                     const unitPrice = parseFloat(detail.item?.[currentConfig.priceField] || 0)

//                     return (
//                       <div key={detail.ID} className="bg-white rounded border p-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-4">
//                             <span className={`text-xs px-2 py-1 rounded ${orderType === 'sales'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-purple-100 text-purple-800'
//                               }`}>
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
//                               <div className={`font-medium ${orderType === 'sales' ? 'text-green-600' : 'text-purple-600'
//                                 }`}>
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
//               <Button className={`mt-4 ${currentConfig.buttonColor} text-white px-1 py-2 rounded`}>
//                 Create Your First {orderType === 'sales' ? 'Sales' : 'Purchase'} Order
//               </Button>
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* ✅ Confirmation Modals - Same as before */}
//       <ConfirmationModal
//         isOpen={deleteModal.open}
//         onClose={() => setDeleteModal({ open: false, orderId: null })}
//         onConfirm={handleDelete}
//         title={`Delete ${orderType === 'sales' ? 'Sales' : 'Purchase'} Order`}
//         message={`Are you sure you want to delete this ${orderType} order? This action cannot be undone.`}
//         confirmText="Delete Order"
//         cancelText="Cancel"
//         type="danger"
//         loading={isDeleting}
//       />

//       <ConfirmationModal
//         isOpen={confirmModal.show}
//         onClose={() => setConfirmModal({ show: false, orderId: null, action: null, approvalValue: null })}
//         onConfirm={confirmApprovalChange}
//         title={`${confirmModal.action === 'approve' ? 'Approve' : 'Reject'} Order`}
//         message={`Are you sure you want to ${confirmModal.action} this ${orderType} order? This action will ${confirmModal.action === 'approve' ? `allow ${orderType === 'sales' ? 'GDN' : 'GRN'} generation` : `prevent ${orderType === 'sales' ? 'GDN' : 'GRN'} generation`}.`}
//         confirmText={confirmModal.action === 'approve' ? 'Approve Order' : 'Reject Order'}
//         cancelText="Cancel"
//         type={confirmModal.action === 'approve' ? 'info' : 'warning'}
//         loading={isUpdating}
//       />
//     </div>
//   )
// }




































































































































// components/orders/OrdersListComponent.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderApprovalMutation
} from '@/store/slice/orderApi';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { Pagination } from '@/components/common/Pagination';
import {
  ChevronDown, ChevronUp, Edit, Trash2, Printer, Lock, Search, X
} from 'lucide-react';
import Link from 'next/link';
import directPrintOrder from '@/components/orders/PrintModal';

interface OrdersListProps {
  orderType: 'sales' | 'purchase';
  stockTypeId: '11' | '12';
}

export default function OrdersListComponent({ orderType, stockTypeId }: OrdersListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'rejected'>('all');
  const [noteFilter, setNoteFilter] = useState<'all' | 'generated' | 'pending'>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; orderId: string | null }>({ open: false, orderId: null });
  const [confirmModal, setConfirmModal] = useState({ show: false, orderId: null, action: null, approvalValue: null });

  const config = {
    sales: {
      title: 'Sales Orders',
      createPath: '/orders/sales/create',
      editPath: (id: string) => `/orders/sales/${id}/edit`,
      viewPath: (id: string) => `/orders/sales/${id}`,
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      customerLabel: 'Customer',
      priceField: 'sellingPrice',
      noteLabel: 'GDN'
    },
    purchase: {
      title: 'Purchase Orders',
      createPath: '/orders/purchase/create',
      editPath: (id: string) => `/orders/purchase/${id}/edit`,
      viewPath: (id: string) => `/orders/purchase/${id}`,
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      customerLabel: 'Supplier',
      priceField: 'purchasePricePKR',
      noteLabel: 'GRN'
    }
  };

  const formatMyDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const currentConfig = config[orderType];

  const { data: ordersResponse, isLoading, error, refetch } = useGetAllOrdersQuery({ stockTypeId, limit: 500 });
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [updateOrderApproval, { isLoading: isUpdating }] = useUpdateOrderApprovalMutation();

  const summaryStats = useMemo(() => {
    const orders = ordersResponse?.data || [];
    return {
      total: orders.length,
      approved: orders.filter((o: any) => o.approved === true).length,
      rejected: orders.filter((o: any) => o.approved !== true).length,
      generated: orders.filter((o: any) => o.is_Note_generated === true).length,
      pending: orders.filter((o: any) => o.is_Note_generated !== true).length
    };
  }, [ordersResponse?.data]);

  const uniqueCustomers = useMemo(() => {
    if (!ordersResponse?.data) return [];
    const customers = new Set<string>();
    ordersResponse.data.forEach((order: any) => {
      if (order.account?.acName) customers.add(order.account.acName);
    });
    return Array.from(customers).sort();
  }, [ordersResponse?.data]);

  const filteredOrders = useMemo(() => {
    let orders = ordersResponse?.data || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      orders = orders.filter((order: any) =>
        order.Number?.toLowerCase().includes(query) ||
        order.account?.acName?.toLowerCase().includes(query) ||
        order.sub_customer?.toLowerCase().includes(query) ||
        order.setupName?.toLowerCase().includes(query)
      );
    }

    if (customerFilter) orders = orders.filter((order: any) => order.account?.acName === customerFilter);

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      orders = orders.filter((order: any) => new Date(order.Date) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      orders = orders.filter((order: any) => new Date(order.Date) <= to);
    }

    if (approvalFilter === 'approved') orders = orders.filter((order: any) => order.approved === true);
    else if (approvalFilter === 'rejected') orders = orders.filter((order: any) => order.approved !== true);

    if (noteFilter === 'generated') orders = orders.filter((order: any) => order.is_Note_generated === true);
    else if (noteFilter === 'pending') orders = orders.filter((order: any) => order.is_Note_generated !== true);

    orders = [...orders].sort((a: any, b: any) => {
      const getPriority = (o: any) => {
        if (o.approved !== true && o.is_Note_generated !== true) return 1;
        if (o.approved === true && o.is_Note_generated !== true) return 2;
        if (o.approved === true && o.is_Note_generated === true) return 3;
        return 4;
      };
      const diff = getPriority(a) - getPriority(b);
      return diff !== 0 ? diff : new Date(b.Date).getTime() - new Date(a.Date).getTime();
    });

    return orders;
  }, [ordersResponse?.data, searchQuery, customerFilter, dateFrom, dateTo, approvalFilter, noteFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const resetPage = () => setCurrentPage(1);

  const clearFilters = () => {
    setSearchQuery('');
    setCustomerFilter('');
    setDateFrom('');
    setDateTo('');
    setApprovalFilter('all');
    setNoteFilter('all');
    resetPage();
  };

  const hasActiveFilters = searchQuery || customerFilter || dateFrom || dateTo || approvalFilter !== 'all' || noteFilter !== 'all';

  const handlePrintOrder = (order: any) => directPrintOrder(order, orderType === 'purchase');
  const canChangeApproval = (order: any) => order.is_Note_generated !== true;

  const handleApprovalChange = (orderId: any, newStatus: number, order: any) => {
    if (order.is_Note_generated === true) {
      alert(`Cannot change. ${currentConfig.noteLabel} already generated.`);
      return;
    }
    setConfirmModal({ show: true, orderId, action: newStatus === 1 ? 'approve' : 'reject', approvalValue: newStatus });
  };

  const confirmApprovalChange = async () => {
    try {
      await updateOrderApproval({ id: confirmModal.orderId, approved: confirmModal.approvalValue }).unwrap();
      setConfirmModal({ show: false, orderId: null, action: null, approvalValue: null });
      refetch();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const getLineDisplay = (detail: any) => {
    const unit = parseInt(detail.sale_unit);
    if (unit === 1) return { qty: parseFloat(detail.uom1_qty) || 0, uom: detail.item?.uom1?.uom || 'Pkt' };
    if (unit === 2) return { qty: parseFloat(detail.uom2_qty) || 0, uom: detail.item?.uomTwo?.uom || 'Box' };
    if (unit === 3) return { qty: parseFloat(detail.uom3_qty) || 0, uom: detail.item?.uomThree?.uom || 'Crt' };
    return { qty: 0, uom: 'Unknown' };
  };

  const handleDelete = async () => {
    if (!deleteModal.orderId) return;
    try {
      await deleteOrder(deleteModal.orderId).unwrap();
      setDeleteModal({ open: false, orderId: null });
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getRowBg = (order: any) => {
    if (order.approved !== true && order.is_Note_generated !== true) return 'bg-red-50';
    if (order.approved === true && order.is_Note_generated !== true) return 'bg-white';
    if (order.approved === true && order.is_Note_generated === true) return 'bg-green-50';
    return 'bg-gray-50';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading. <button onClick={() => refetch()} className="underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold text-gray-900">{currentConfig.title}</h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 ">
            <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded">
              <span className="font-bold">{summaryStats.total}</span> Total
            </span>
            <span className="bg-green-100 border border-green-300 px-2 py-1 rounded text-green-700">
              <span className="font-bold">{summaryStats.approved}</span> Approved
            </span>
            <span className="bg-red-100 border border-red-300 px-2 py-1 rounded text-red-700">
              <span className="font-bold">{summaryStats.rejected}</span> Rejected
            </span>
            <span className="bg-blue-100 border border-blue-300 px-2 py-1 rounded text-blue-700">
              <span className="font-bold">{summaryStats.generated}</span> {currentConfig.noteLabel}
            </span>
            <span className="bg-amber-100 border border-amber-300 px-2 py-1 rounded text-amber-700">
              <span className="font-bold">{summaryStats.pending}</span> Pending
            </span>
          </div>

          <Link href={currentConfig.createPath}>
            <Button className={`${currentConfig.buttonColor} text-white px-3 py-1.5 rounded `}>
              + Create
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3"> */}
      <div className="flex flex-wrap items-center gap- mb-3 py-2 space-x-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
            className="w-full pl-9 pr-7 py-2 border border-gray-300 rounded-lg "
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); resetPage(); }} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* <select value={customerFilter} onChange={(e) => { setCustomerFilter(e.target.value); resetPage(); }} className="border border-gray-300 rounded-lg px-2 py-2 ">
          <option value="">All {currentConfig.customerLabel}s</option>
          {uniqueCustomers.map((c) => <option key={c} value={c}>{c}</option>)}
        </select> */}

        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); resetPage(); }} className="border border-gray-300 rounded-lg px-2 py-2 " />
        <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); resetPage(); }} className="border border-gray-300 rounded-lg px-2 py-2 " />

        <select value={approvalFilter} onChange={(e) => { setApprovalFilter(e.target.value as any); resetPage(); }} className="border border-gray-300 rounded-lg px-2 py-2 ">
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={noteFilter} onChange={(e) => { setNoteFilter(e.target.value as any); resetPage(); }} className="border border-gray-300 rounded-lg px-2 py-2 ">
          <option value="all">All Notes</option>
          <option value="generated">{currentConfig.noteLabel} Generated</option>
          <option value="pending">Pending</option>
        </select>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="px-2 py-1.5  text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
            <X className="w-4 h-4 inline" /> Clear
          </button>
        )}
      </div>
      {/* </div> */}

      {/* Table - NO COLUMN BORDERS */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        {paginatedOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {hasActiveFilters ? (
              <>No orders match. <button onClick={clearFilters} className="text-blue-600 underline">Clear</button></>
            ) : <>No orders found.</>}
          </div>
        ) : (
          <>
            <table className="w-full ">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-2 py-2 text-left font-medium text-gray-600 w-5">Order</th>
                  <th className="px-1 py-2 text-left font-medium text-gray-600 w-10">Date</th>
                  <th className="pl-2 py-2 text-left font-medium text-gray-600">{currentConfig.customerLabel}</th>
                  <th className="px-1 py-2 text-left font-medium text-gray-600">Sub Customer</th>
                  <th className="px-1 py-2 text-left font-medium text-gray-600 w-50">Setup</th>
                  <th className="px-1 py-2 text-center font-medium text-gray-600 w-24">Approval</th>
                  <th className="px-1 py-2 text-center font-medium text-gray-600 w-16">Items</th>
                  <th className="px-1 py-2 text-center font-medium text-gray-600 w-20">Status</th>
                  <th className="px-1 py-2 text-center font-medium text-gray-600 w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order: any) => (
                  <React.Fragment key={order.ID}>
                    <tr className={`${getRowBg(order)} border-b border-gray-200 hover:brightness-95`}>
                      <td className="px-2 py-2 ">
                        <Link href={currentConfig.viewPath(order.ID)} className={`font-medium ${orderType === 'sales' ? 'text-blue-600' : 'text-purple-600'}`}>
                          {order.Number}
                        </Link>
                      </td>
                      <td className="px-1 py-2 text-gray-600">{formatMyDate(order.Date)}</td>
                      <td className="pl-2 py-2 font-medium">{order.account?.acName || '-'}</td>
                      <td className="px-1 py-2 text-gray-600">{order.sub_customer || '-'}</td>
                      <td className="px-1 py-2 text-gray-600">{order.setupName || '-'}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          {canChangeApproval(order) ? (
                            <select
                              value={order.approved === true ? '1' : '0'}
                              onChange={(e) => handleApprovalChange(order.ID, parseInt(e.target.value), order)}
                              disabled={isUpdating}
                              className={`text-xs border rounded px-1 py-0.5 w-[80px] ${order.approved === true ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}
                            >
                              <option value="0">Reject</option>
                              <option value="1">Approve</option>
                            </select>
                          ) : (
                            <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${order.approved === true ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {order.approved === true ? 'Approved' : 'Rejected'}
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-1 py-2 text-center">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded ">{order.details?.length || 0}</span>
                      </td>
                      <td className="px-1 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded  ${order.is_Note_generated === true ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {order.is_Note_generated === true ? 'Done' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          {order.approved === true && order.Next_Status === 'Incomplete' && order.is_Note_generated === false && (
                            <button className={`${currentConfig.buttonColor} text-white px-2 py-1 rounded text-xs`}>{currentConfig.noteLabel}</button>
                          )}
                          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" onClick={() => handlePrintOrder(order)}>
                            <Printer className="w-4 h-4" />
                          </button>
                          <Link href={currentConfig.editPath(order.ID)}>
                            <button className={`p-1.5 rounded ${order.is_Note_generated === true ? 'text-gray-300' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`} disabled={order.is_Note_generated === true}>
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            className={`p-1.5 rounded ${order.is_Note_generated === true ? 'text-gray-300' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                            onClick={() => order.is_Note_generated !== true && setDeleteModal({ open: true, orderId: order.ID.toString() })}
                            disabled={order.is_Note_generated === true}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" onClick={() => toggleExpand(order.ID)}>
                            {expandedOrders.has(order.ID) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedOrders.has(order.ID) && (
                      <tr>
                        <td colSpan={9} className="bg-gray-50 px-1 py-2 border-b border-gray-200">
                          <div className="space-y-2">
                            {order.details?.map((d: any) => {
                              const { qty, uom } = getLineDisplay(d);
                              const price = parseFloat(d.item?.[currentConfig.priceField] || 0);
                              return (
                                <div key={d.ID} className="bg-white border border-gray-200 rounded p-3 flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs ${orderType === 'sales' ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'}`}>#{d.Line_Id}</span>
                                    <span className="font-medium">{d.item?.itemName || 'Unknown'}</span>
                                  </div>
                                  <div className="flex items-center gap-6 ">
                                    <span><span className="text-gray-500">Qty:</span> {qty} {uom}</span>
                                    <span><span className="text-gray-500">Price:</span> Rs {price.toFixed(2)}</span>
                                    <span className={`font-medium ${orderType === 'sales' ? 'text-green-600' : 'text-purple-600'}`}>Rs {(qty * price).toFixed(2)}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(n) => { setItemsPerPage(n); resetPage(); }}
            />
          </>
        )}
      </div>

      <ConfirmationModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, orderId: null })} onConfirm={handleDelete} title="Delete Order" message="Are you sure?" confirmText="Delete" type="danger" loading={isDeleting} />
      <ConfirmationModal isOpen={confirmModal.show} onClose={() => setConfirmModal({ show: false, orderId: null, action: null, approvalValue: null })} onConfirm={confirmApprovalChange} title={`${confirmModal.action === 'approve' ? 'Approve' : 'Reject'} Order`} message={`${confirmModal.action} this order?`} confirmText={confirmModal.action === 'approve' ? 'Approve' : 'Reject'} type={confirmModal.action === 'approve' ? 'info' : 'warning'} loading={isUpdating} />
    </div>
  );
}
