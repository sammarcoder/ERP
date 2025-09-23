
// // components/OrderList.jsx
// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import PrintModal from './PrintModal';

// const OrderList = ({ orderType }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showPrintModal, setShowPrintModal] = useState(false);
//   const [expandedOrders, setExpandedOrders] = useState(new Set());
//   const router = useRouter();
//   const isPurchase = orderType === 'purchase';

//   useEffect(() => {
//     fetchOrders();
//   }, [orderType]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://${window.location.hostname}:4000/api/order?stockTypeId=${isPurchase ? 1 : 2}`);
//       const result = await response.json();
//       if (result.success) {
//         setOrders(result.data);
//       }
//       console.log(result)
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleOrderExpanded = (orderId) => {
//     setExpandedOrders(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(orderId)) {
//         newSet.delete(orderId);
//       } else {
//         newSet.add(orderId);
//       }
//       return newSet;
//     });
//   };

//   // FIXED: Function to get correct quantity and UOM based on sale_unit
//   const getDisplayQuantity = (detail) => {
//     if (isPurchase) {
//       const qty = detail.Stock_In_UOM_Qty || 0;
//       const uom = detail.item?.uom1?.uom || 'Pcs';
//       return `${parseFloat(qty).toFixed(0)} ${uom}`;
//     } else {
//       let qty = 0;
//       let uom = '';
      
//       if (detail.sale_unit === 'uom1') {
//         qty = detail.uom1_qty || detail.Stock_out_UOM_Qty || 0;
//         uom = detail.item?.uom1?.uom || 'Pcs';
//       } else if (detail.sale_unit === 'uomTwo') {
//         qty = detail.uom2_qty || detail.Stock_out_SKU_UOM_Qty || 0;
//         uom = detail.item?.uomTwo?.uom || 'Doz';
//       } else if (detail.sale_unit === 'uomThree') {
//         qty = detail.uom3_qty || detail.Stock_out_UOM3_Qty || 0;
//         uom = detail.item?.uomThree?.uom || 'Box';
//       } else {
//         qty = detail.uom1_qty || detail.Stock_out_UOM_Qty || 0;
//         uom = detail.item?.uom1?.uom || 'Pcs';
//       }
      
//       return `${parseFloat(qty).toFixed(0)} ${uom}`;
//     }
//   };

//   const handlePrint = (order) => {
//     setSelectedOrder(order);
//     setShowPrintModal(true);
//   };

//   // FIXED: Edit navigation
//   const handleEdit = (order) => {
//     console.log('Editing order:', order.ID); // Debug log
//     router.push(`/order/${orderType}/edit?id=${order.ID}`);
//   };

//   const handleDelete = async (orderId) => {
//     if (window.confirm('Are you sure you want to delete this order?')) {
//       try {
//         const response = await fetch(`http://${window.location.hostname}:4000/api/order/${orderId}`, {
//           method: 'DELETE'
//         });
//         if (response.ok) {
//           fetchOrders();
//         }
//       } catch (error) {
//         console.error('Error deleting order:', error);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-32">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         <span className="ml-2 text-gray-600">Loading...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className={`${isPurchase ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'} text-white p-4 rounded-t flex justify-between items-center shadow-lg`}>
//         <h1 className="text-xl font-bold">{isPurchase ? 'Purchase' : 'Sales'} Orders</h1>
//         <button
//           onClick={() => router.push(`/order/${orderType}/create`)}
//           className="bg-white bg-opacity-20 px-4 py-2 rounded hover:bg-opacity-30 transition-all duration-200 hover:scale-105 transform text-black"
//         >
//           + Create New
//         </button>
//       </div>

//       {/* Enhanced Table with Hover Effects */}
//       <div className="bg-white rounded-b shadow-lg overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-3 py-2 text-left font-medium text-gray-700">Order #</th>
//               <th className="px-3 py-2 text-left font-medium text-gray-700">Order ID</th>
//               <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
//               <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
//               <th className="px-3 py-2 text-left font-medium text-gray-700">{isPurchase ? 'Supplier' : 'Customer'}</th>
//               <th className="px-3 py-2 text-center font-medium text-gray-700">Items</th>
//               <th className="px-3 py-2 text-center font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {orders.map((order) => (
//               <React.Fragment key={order.ID}>
//                 {/* Main Order Row with Enhanced Hover Effects */}
//                 <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 hover:shadow-md cursor-pointer group">
//                   <td className="px-3 py-3 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
//                     {order.Number}
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 group-hover:text-gray-800 transition-colors">
//                     #{order.ID}
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 group-hover:text-gray-800 transition-colors">
//                     {new Date(order.Date).toLocaleDateString()}
//                   </td>
//                   <td className="px-3 py-3">
//                     <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
//                       order.Next_Status === 'Complete' 
//                         ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
//                         : 'bg-orange-100 text-orange-800 group-hover:bg-orange-200'
//                     }`}>
//                        {order.Next_Status}
//                     </span>
//                   </td>
//                   <td className="px-3 py-3 text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
//                     {order.account?.acName || 'N/A'}
//                     {order.account?.city && (
//                       <div className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
//                        {order.account.city}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-3 py-3 text-center">
//                     <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
//                       isPurchase ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                     } group-hover:scale-110 transition-transform duration-200`}>
//                        {order.details.length} items
//                     </span>
//                   </td>
//                   <td className="px-3 py-3">
//                     <div className="flex justify-center space-x-1">
//                       {/* Print Button with Hover Effect */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePrint(order);
//                         }}
//                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 transform"
//                         title="Print Order"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                         </svg>
//                       </button>

//                       {/* Edit Button with Enhanced Hover */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEdit(order);
//                         }}
//                         className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110 transform hover:rotate-12"
//                         title="Edit Order"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                       </button>

//                       {/* Delete Button with Shake Effect */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(order.ID);
//                         }}
//                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 transform hover:animate-pulse"
//                         title="Delete Order"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>

//                       {/* Expand/Collapse with Rotation Effect */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleOrderExpanded(order.ID);
//                         }}
//                         className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 transform ${
//                           expandedOrders.has(order.ID)
//                             ? 'text-blue-600 bg-blue-100 rotate-180'
//                             : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'
//                         }`}
//                         title={expandedOrders.has(order.ID) ? 'Hide Items' : 'Show Items'}
//                       >
//                         <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>

//                 {/* Expanded Items - Smooth Animation */}
//                 {expandedOrders.has(order.ID) && (
//                   <tr className="animate-fadeIn">
//                     <td colSpan="7" className="px-3 py-2 bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-blue-400">
//                       <div className="text-xs">
//                         {/* <div className="font-semibold text-gray-700 mb-2 flex items-center">
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                           </svg>
//                           Order Items ({order.details.length})
//                         </div> */}
//                         <div className="grid grid-cols-1 gap-1">
//                           {order.details.map((detail, index) => (
//                             <div key={index} className="bg-white rounded p-2 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm border-l-2 hover:border-l-blue-400">
//                               <div className="grid grid-cols-4 gap-3 items-center">
//                                 <div className="flex items-center">
//                                   <span className={`w-5 h-5 rounded-full ${isPurchase ? 'bg-blue-500' : 'bg-green-500'} text-white text-xs flex items-center justify-center font-bold mr-2`}>
//                                     {index + 1}
//                                   </span>
//                                   <span className="font-medium text-gray-900">
//                                     {detail.item?.itemName || 'Unknown Item'}
//                                   </span>
//                                 </div>
//                                 <div className="text-center">
//                                   <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
//                                     {getDisplayQuantity(detail)}
//                                   </span>
//                                 </div>
//                                 <div className="text-center text-gray-600">
//                                   {parseFloat(detail.Price || 0).toFixed(2)}
//                                 </div>
//                                 <div className="text-gray-500 text-xs">
//                                   {detail.Remarks || '-'}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Print Modal */}
//       {showPrintModal && selectedOrder && (
//         <PrintModal 
//           order={selectedOrder} 
//           isPurchase={isPurchase}
//           onClose={() => setShowPrintModal(false)}
//           getDisplayQuantity={getDisplayQuantity}
//         />
//       )}

//       {/* Add Custom Animations */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-in-out;
//         }
        
//         .hover-glow:hover {
//           box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
//         }
        
//         .hover-lift:hover {
//           transform: translateY(-2px);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OrderList;



















































































// components/OrderList.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrintModal from './PrintModal';
import GRNModal from './inventory/GRNModal'; // NEW
import DispatchModal from './inventory/DispatchModal'; // NEW

const OrderList = ({ orderType }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState(false); // NEW
  const [showDispatchModal, setShowDispatchModal] = useState(false); // NEW
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const router = useRouter();
  const isPurchase = orderType === 'purchase';

  useEffect(() => {
    fetchOrders();
  }, [orderType]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${window.location.hostname}:4000/api/order?stockTypeId=${isPurchase ? 1 : 2}`);
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // FIXED: Function to get correct quantity and UOM based on sale_unit
  const getDisplayQuantity = (detail) => {
    if (isPurchase) {
      const qty = detail.Stock_In_UOM_Qty || 0;
      const uom = detail.item?.uom1?.uom || 'Pcs';
      return `${parseFloat(qty).toFixed(0)} ${uom}`;
    } else {
      let qty = 0;
      let uom = '';
      
      if (detail.sale_unit === 'uom1') {
        qty = detail.uom1_qty || detail.Stock_out_UOM_Qty || 0;
        uom = detail.item?.uom1?.uom || 'Pcs';
      } else if (detail.sale_unit === 'uomTwo') {
        qty = detail.uom2_qty || detail.Stock_out_SKU_UOM_Qty || 0;
        uom = detail.item?.uomTwo?.uom || 'Doz';
      } else if (detail.sale_unit === 'uomThree') {
        qty = detail.uom3_qty || detail.Stock_out_UOM3_Qty || 0;
        uom = detail.item?.uomThree?.uom || 'Box';
      } else {
        qty = detail.uom1_qty || detail.Stock_out_UOM_Qty || 0;
        uom = detail.item?.uom1?.uom || 'Pcs';
      }
      
      return `${parseFloat(qty).toFixed(0)} ${uom}`;
    }
  };

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setShowPrintModal(true);
  };

  // NEW: Handle GRN creation
  const handleCreateGRN = (order) => {
    setSelectedOrder(order);
    setShowGRNModal(true);
  };

  // NEW: Handle Dispatch creation
  const handleCreateDispatch = (order) => {
    setSelectedOrder(order);
    setShowDispatchModal(true);
  };

  const handleEdit = (order) => {
    router.push(`/order/${orderType}/edit?id=${order.ID}`);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/order/${orderId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchOrders();
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className={`${isPurchase ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'} text-white p-4 rounded-t flex justify-between items-center shadow-lg`}>
        <h1 className="text-xl font-bold">{isPurchase ? 'Purchase' : 'Sales'} Orders</h1>
        <button
          onClick={() => router.push(`/order/${orderType}/create`)}
          className="bg-white bg-opacity-20 px-4 py-2 rounded hover:bg-opacity-30 transition-all duration-200 hover:scale-105 transform"
        >
          + Create New
        </button>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-b shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Order #</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">ID</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">{isPurchase ? 'Supplier' : 'Customer'}</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Items</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Process</th> {/* NEW COLUMN */}
              <th className="px-3 py-2 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <React.Fragment key={order.ID}>
                {/* Main Order Row */}
                <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 hover:shadow-sm group">
                  <td className="px-3 py-3 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {order.Number}
                  </td>
                  <td className="px-3 py-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                    #{order.ID}
                  </td>
                  <td className="px-3 py-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                    {new Date(order.Date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                      order.Next_Status === 'Complete' 
                        ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
                        : 'bg-orange-100 text-orange-800 group-hover:bg-orange-200'
                    }`}>
                      {order.Next_Status === 'Complete' ? '✅' : '⏳'} {order.Next_Status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                    {order.account?.acName || 'N/A'}
                    {order.account?.city && (
                      <div className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                        📍 {order.account.city}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      isPurchase ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    } group-hover:scale-110 transition-transform duration-200`}>
                      📦 {order.details.length} items
                    </span>
                  </td>

                  {/* NEW: Process Column - GRN/Dispatch Button */}
                  <td className="px-3 py-3 text-center">
                    {isPurchase ? (
                      /* GRN Button for Purchase Orders */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateGRN(order);
                        }}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 transform shadow-md"
                        title="Create Goods Receiving Note"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        📦 GRN
                      </button>
                    ) : (
                      /* Dispatch Button for Sales Orders */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateDispatch(order);
                        }}
                        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 transform shadow-md"
                        title="Create Sales Dispatch"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        🚚 Dispatch
                      </button>
                    )}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex justify-center space-x-1">
                      {/* Print Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(order);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 transform"
                        title="Print Order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(order);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110 transform hover:rotate-12"
                        title="Edit Order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order.ID);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 transform hover:animate-pulse"
                        title="Delete Order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* Expand/Collapse */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOrderExpanded(order.ID);
                        }}
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 transform ${
                          expandedOrders.has(order.ID)
                            ? 'text-blue-600 bg-blue-100 rotate-180'
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'
                        }`}
                        title={expandedOrders.has(order.ID) ? 'Hide Items' : 'Show Items'}
                      >
                        <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Items */}
                {expandedOrders.has(order.ID) && (
                  <tr className="animate-fadeIn">
                    <td colSpan="8" className="px-3 py-2 bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-blue-400">
                      <div className="text-xs">
                        <div className="font-semibold text-gray-700 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Order Items ({order.details.length})
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {order.details.map((detail, index) => (
                            <div key={index} className="bg-white rounded p-2 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm border-l-2 hover:border-l-blue-400">
                              <div className="grid grid-cols-4 gap-3 items-center">
                                <div className="flex items-center">
                                  <span className={`w-5 h-5 rounded-full ${isPurchase ? 'bg-blue-500' : 'bg-green-500'} text-white text-xs flex items-center justify-center font-bold mr-2`}>
                                    {index + 1}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {detail.item?.itemName || 'Unknown Item'}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    {getDisplayQuantity(detail)}
                                  </span>
                                </div>
                                <div className="text-center text-gray-600">
                                  ₹{parseFloat(detail.Price || 0).toFixed(2)}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {detail.Remarks || '-'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Print Modal */}
      {showPrintModal && selectedOrder && (
        <PrintModal 
          order={selectedOrder} 
          isPurchase={isPurchase}
          onClose={() => setShowPrintModal(false)}
          getDisplayQuantity={getDisplayQuantity}
        />
      )}

      {/* NEW: GRN Modal */}
      {showGRNModal && selectedOrder && (
        <GRNModal
          purchaseOrder={selectedOrder}
          onClose={() => setShowGRNModal(false)}
          onSuccess={() => {
            setShowGRNModal(false);
            fetchOrders(); // Refresh orders
          }}
        />
      )}

      {/* NEW: Dispatch Modal */}
      {showDispatchModal && selectedOrder && (
        <DispatchModal
          salesOrder={selectedOrder}
          onClose={() => setShowDispatchModal(false)}
          onSuccess={() => {
            setShowDispatchModal(false);
            fetchOrders(); // Refresh orders
          }}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default OrderList;
