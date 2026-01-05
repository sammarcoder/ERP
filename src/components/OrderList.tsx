// components/OrderList.jsx - CLEAN & PROFESSIONAL UI
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrintModal from './PrintModal';
import DispatchModal from './inventory/DispatchModal';
import GRNModal from './inventory/GRNModal';

const OrderList = ({ orderType }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  
  // UPDATED: Default to pending orders only
  const [filters, setFilters] = useState({
    status: 'pending', // Show Partial + Incomplete by default
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });

  const router = useRouter();
  const isPurchase = orderType === 'purchase';

  useEffect(() => {
    fetchOrders();
  }, [orderType]);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${window.location.hostname}:4000/api/order?stockTypeId=${isPurchase ? 11 : 12}`);
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
      console.log(`Fetched ${result.data.length} ${orderType} orders ${result.data}`);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Business logic filtering
  const applyFilters = () => {
    let filtered = [...orders];

    if (filters.status === 'pending') {
      // DEFAULT: Show only Partial and Incomplete orders
      filtered = filtered.filter(order => 
        order.Next_Status === 'Partial' || order.Next_Status === 'Incomplete'
      );
    } else if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.Next_Status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(order => new Date(order.Date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(order => new Date(order.Date) <= new Date(filters.dateTo));
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(order => 
        order.Number?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.account?.acName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
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

  const getDisplayQuantity = (detail) => {
    if (isPurchase) {
      const qty = detail.Stock_In_UOM_Qty || detail.uom1_qty || 0;
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

  const handleEdit = (order) => {
    router.push(`/order/${orderType}/edit?id=${order.ID}`);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Delete this order? This cannot be undone.')) {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/order/${orderId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchOrders();
          alert('Order deleted successfully');
        } else {
          alert('Failed to delete order');
        }
      } catch (error) {
        alert('Delete error');
      }
    }
  };

  // BUSINESS RULE: GRN handler
  const handleGRN = (order) => {
    if (order.Next_Status === 'Complete') {
      alert('Cannot create GRN for Complete orders.');
      return;
    }
    
    if (!order.details || order.details.length === 0) {
      alert('This purchase order has no items');
      return;
    }
    
    setSelectedOrder(order);
    setShowGRNModal(true);
  };

  // BUSINESS RULE: Dispatch handler
  const handleDispatch = (order) => {
    if (order.Next_Status === 'Complete') {
      alert('Cannot create Dispatch for Complete orders.');
      return;
    }
    
    if (!order.details || order.details.length === 0) {
      alert('This sales order has no items');
      return;
    }
    
    setSelectedOrder(order);
    setShowDispatchModal(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.trim() })
      });

      const result = await response.json();
      if (result.success) {
        fetchOrders();
      } else {
        alert('Error updating status: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const canCreateTransaction = (order) => {
    return order.Next_Status === 'Partial' || order.Next_Status === 'Incomplete';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* CLEAN Header */}
      <div className={`${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white p-4 rounded-lg flex justify-between items-center shadow-md`}>
        <div>
          <h1 className="text-xl font-bold">{isPurchase ? 'Purchase Orders' : 'Sales Orders'}</h1>
          <p className="text-sm opacity-90">
            Showing {filteredOrders.length} {filters.status === 'pending' ? 'pending' : ''} orders
          </p>
        </div>
        <button
          onClick={() => router.push(`/order/${orderType}/create`)}
          className="bg-white bg-opacity-20 px-4 py-2 rounded hover:bg-opacity-30 transition-colors font-medium"
        >
          + Create New
        </button>
      </div>

      {/* CLEAN Filters */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg mt-4 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* <option value="pending">Pending Orders</option> */}
              <option value="all">All Orders</option>
              <option value="Incomplete">Incomplete</option>
              <option value="Partial">Partial</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Order # or Customer..."
            />
          </div>
        </div>
        
        {/* Business rule notice */}
        {filters.status === 'pending' && (
          <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Only Partial and Incomplete orders can generate GRN/Dispatch. Complete orders are locked.
            </p>
          </div>
        )}
      </div>

      {/* CLEAN Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg mt-4 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{isPurchase ? 'Supplier' : 'Customer'}</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Items</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <React.Fragment key={order.ID}>
                <tr className={`hover:bg-gray-50 transition-colors ${
                  order.Next_Status === 'Complete' ? 'bg-gray-100 opacity-75' : ''
                }`}>
                  <td className="px-4 py-3 font-medium text-blue-600">
                    #{order.Number}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(order.Date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.Next_Status}
                      onChange={(e) => updateOrderStatus(order.ID, e.target.value)}
                      disabled={order.Next_Status === 'Complete'}
                      className={`px-3 py-1 text-sm rounded-md border focus:outline-none focus:ring-2 ${
                        order.Next_Status === 'Complete' 
                          ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed' 
                          : order.Next_Status === 'Partial'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 focus:ring-yellow-500'
                          : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 focus:ring-red-500'
                      }`}
                    >
                      <option value="Incomplete">Incomplete</option>
                      <option value="Partial">Partial</option>
                      <option value="Complete">Complete</option>
                    </select>
                    {/* {order.Next_Status === 'Complete' && (
                      <div className="text-xs text-gray-500 mt-1">Locked</div>
                    )} */}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="font-medium">{order.account?.acName || 'N/A'}</div>
                    {order.account?.city && (
                      <div className="text-xs text-gray-500">{order.account.city}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {order.details?.length || 0} items
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      {/* Print Button */}
                      <button
                        onClick={() => handlePrint(order)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Print Order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(order)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Edit Order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(order.ID)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* GRN Button (Purchase Orders Only) */}
                      {isPurchase && (
                        <button
                          onClick={() => handleGRN(order)}
                          disabled={!canCreateTransaction(order)}
                          className={`p-2 rounded-md transition-colors ${
                            canCreateTransaction(order)
                              ? 'text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={canCreateTransaction(order) ? "Create GRN" : "Cannot create GRN - Order is Complete"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </button>
                      )}

                      {/* Dispatch Button (Sales Orders Only) */}
                      {!isPurchase && (
                        <button
                          onClick={() => handleDispatch(order)}
                          disabled={!canCreateTransaction(order)}
                          className={`p-2 rounded-md transition-colors ${
                            canCreateTransaction(order)
                              ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50 cursor-pointer'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                          title={canCreateTransaction(order) ? "Create Dispatch" : "Cannot create Dispatch - Order is Complete"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                      )}

                      {/* Expand Button */}
                      <button
                        onClick={() => toggleOrderExpanded(order.ID)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                        title="View Items"
                      >
                        <svg className={`w-4 h-4 transition-transform ${expandedOrders.has(order.ID) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* CLEAN Expanded Items */}
                {expandedOrders.has(order.ID) && order.details && (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 bg-gray-50 border-l-4 border-blue-400">
                      <div>
                        <div className="font-medium text-gray-800 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Order Items ({order.details.length})
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            order.Next_Status === 'Complete' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.Next_Status}
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {order.details.map((detail, index) => (
                            <div key={index} className={`p-3 rounded border flex justify-between items-center ${
                              order.Next_Status === 'Complete' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-blue-200'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-medium ${
                                  isPurchase ? 'bg-blue-500' : 'bg-green-500'
                                }`}>
                                  {index + 1}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {detail.item?.itemName || 'Unknown Item'}
                                </span>
                              </div>
                              <div className="flex space-x-6 text-sm">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Quantity</div>
                                  <div className="font-bold text-blue-600">{getDisplayQuantity(detail)}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Price</div>
                                  <div className="font-medium">${(parseFloat(detail.Price) || 0).toFixed(2)}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Total</div>
                                  <div className="font-bold text-green-600">${((parseFloat(detail.Price) || 0) * (detail.uom1_qty || 0)).toFixed(2)}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Complete order notice */}
                        {order.Next_Status === 'Complete' && (
                          <div className="mt-3 bg-green-50 border border-green-200 p-2 rounded text-sm text-green-700">
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <strong>Order Complete:</strong> No further GRN/Dispatch actions available.
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* CLEAN Results Summary */}
      <div className="bg-white border border-gray-200 border-t-0 px-4 py-2 text-sm text-gray-600 flex justify-between">
        <span>Showing {filteredOrders.length} of {orders.length} orders</span>
        <span>
          Actionable: {filteredOrders.filter(o => canCreateTransaction(o)).length} | 
          Complete: {filteredOrders.filter(o => o.Next_Status === 'Complete').length}
        </span>
      </div>

      {/* Modals */}
      {showPrintModal && selectedOrder && (
        <PrintModal 
          order={selectedOrder} 
          isPurchase={isPurchase}
          onClose={() => setShowPrintModal(false)}
          getDisplayQuantity={getDisplayQuantity}
        />
      )}

      {showGRNModal && selectedOrder && (
        <GRNModal
          purchaseOrder={selectedOrder}
          mode="fromOrder"
          onClose={() => {
            setShowGRNModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={() => {
            fetchOrders();
            setShowGRNModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showDispatchModal && selectedOrder && (
        <DispatchModal
          salesOrder={selectedOrder}
          mode="fromOrder"
          onClose={() => {
            setShowDispatchModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={() => {
            fetchOrders();
            setShowDispatchModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderList;
