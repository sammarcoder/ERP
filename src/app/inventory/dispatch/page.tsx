// // app/inventory/dispatch/page.tsx - DISPATCH LIST PAGE
// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const DispatchListPage = () => {
//   const [dispatches, setDispatches] = useState([]);
//   const [filteredDispatches, setFilteredDispatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedDispatch, setExpandedDispatch] = useState(null);
//   const [filters, setFilters] = useState({
//     status: 'all',
//     dateFrom: '',
//     dateTo: '',
//     search: ''
//   });

//   const router = useRouter();

//   useEffect(() => {
//     fetchDispatches();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [dispatches, filters]);

//   const fetchDispatches = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`);
//       const result = await response.json();
//       if (result.success) {
//         setDispatches(result.data);
//         console.log(`✅ Loaded ${result.data.length} Dispatches`);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching dispatches:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...dispatches];

//     if (filters.status !== 'all') {
//       filtered = filtered.filter(dispatch => dispatch.Status === filters.status);
//     }
//     if (filters.dateFrom) {
//       filtered = filtered.filter(dispatch => new Date(dispatch.Date) >= new Date(filters.dateFrom));
//     }
//     if (filters.dateTo) {
//       filtered = filtered.filter(dispatch => new Date(dispatch.Date) <= new Date(filters.dateTo));
//     }
//     if (filters.search) {
//       filtered = filtered.filter(dispatch => 
//         dispatch.Number?.toLowerCase().includes(filters.search.toLowerCase()) ||
//         dispatch.account?.acName?.toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }

//     setFilteredDispatches(filtered);
//   };

//   const handleView = (dispatch) => {
//     setExpandedDispatch(expandedDispatch === dispatch.ID ? null : dispatch.ID);
//   };

//   const handleEdit = (dispatch) => {
//     router.push(`/inventory/dispatch/edit?id=${dispatch.ID}`);
//   };

//   const handleDelete = async (dispatchId) => {
//     if (window.confirm('⚠️ Delete this Dispatch permanently?')) {
//       try {
//         const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`, {
//           method: 'DELETE'
//         });
//         if (response.ok) {
//           fetchDispatches();
//           alert('✅ Dispatch deleted successfully');
//         } else {
//           alert('❌ Failed to delete dispatch');
//         }
//       } catch (error) {
//         alert('❌ Delete error');
//       }
//     }
//   };

//   const getStatusBadge = (status) => {
//     return `px-2 py-1 text-xs rounded ${
//       status === 'Post' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//     }`;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
//         <span className="ml-3">Loading dispatches...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="p-3">
//       {/* Header */}
//       <div className="bg-green-600 text-white p-4 rounded-t flex justify-between items-center">
//         <h1 className="text-xl font-bold">🚚 Dispatch Management</h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => router.push('/inventory/dispatch/create')}
//             className="bg-green-500 px-4 py-2 rounded hover:bg-green-400"
//           >
//             + Create New Dispatch
//           </button>
//           <button
//             onClick={() => router.push('/order/sales')}
//             className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100"
//           >
//             📋 From Sales Orders
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-gray-50 p-3 border-b">
//         <div className="grid grid-cols-4 gap-3">
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({...filters, status: e.target.value})}
//             className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
//           >
//             <option value="all">All Status</option>
//             <option value="UnPost">UnPost</option>
//             <option value="Post">Post</option>
//           </select>
//           <input
//             type="date"
//             value={filters.dateFrom}
//             onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
//             className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
//           />
//           <input
//             type="date"
//             value={filters.dateTo}
//             onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
//             className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
//           />
//           <input
//             type="text"
//             value={filters.search}
//             onChange={(e) => setFilters({...filters, search: e.target.value})}
//             className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
//             placeholder="Search..."
//           />
//         </div>
//       </div>

//       {/* Dispatches Table */}
//       <div className="bg-white border rounded-b">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-3 py-2 text-left">Dispatch#</th>
//               <th className="px-3 py-2 text-left">Date</th>
//               <th className="px-3 py-2 text-left">Customer</th>
//               <th className="px-3 py-2 text-left">Status</th>
//               <th className="px-3 py-2 text-center">Items</th>
//               <th className="px-3 py-2 text-center">Batches</th>
//               <th className="px-3 py-2 text-right">Total</th>
//               <th className="px-3 py-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDispatches.map((dispatch) => (
//               <React.Fragment key={dispatch.ID}>
//                 <tr className="hover:bg-green-50 border-b">
//                   <td className="px-3 py-2 font-medium text-green-600">{dispatch.Number}</td>
//                   <td className="px-3 py-2">{new Date(dispatch.Date).toLocaleDateString()}</td>
//                   <td className="px-3 py-2">{dispatch.account?.acName || 'N/A'}</td>
//                   <td className="px-3 py-2">
//                     <span className={getStatusBadge(dispatch.Status)}>{dispatch.Status}</span>
//                   </td>
//                   <td className="px-3 py-2 text-center">
//                     <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                       {dispatch.details?.length || 0}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2 text-center">
//                     <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
//                       {[...new Set(dispatch.details?.map(d => d.batchno) || [])].filter(b => b).length}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2 text-right font-medium">
//                     ${dispatch.details?.reduce((sum, detail) => 
//                       sum + ((detail.Stock_out_UOM_Qty || 0) * (detail.Stock_Price || 0)), 0
//                     ).toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-3 py-2">
//                     <div className="flex justify-center space-x-1">
//                       <button
//                         onClick={() => handleView(dispatch)}
//                         className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
//                       >
//                         👁️
//                       </button>
//                       <button
//                         onClick={() => handleEdit(dispatch)}
//                         className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200"
//                       >
//                         ✏️
//                       </button>
//                       <button
//                         onClick={() => handleDelete(dispatch.ID)}
//                         className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   </td>
//                 </tr>

//                 {/* Expanded Details */}
//                 {expandedDispatch === dispatch.ID && dispatch.details && (
//                   <tr>
//                     <td colSpan="8" className="px-3 py-2 bg-green-50 border-l-2 border-green-400">
//                       <div className="text-sm">
//                         <div className="font-medium mb-2">🚚 Items Dispatched</div>
//                         <div className="space-y-1">
//                           {dispatch.details.map((detail, index) => (
//                             <div key={index} className="bg-white p-2 rounded border flex justify-between">
//                               <div className="flex items-center space-x-2">
//                                 <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{index + 1}</span>
//                                 <span className="font-medium">{detail.item?.itemName}</span>
//                                 <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
//                                   📦 {detail.batchno}
//                                 </span>
//                               </div>
//                               <div className="flex space-x-3 text-sm">
//                                 <span>Qty: <b className="text-green-600">{detail.Stock_out_UOM_Qty}</b></span>
//                                 <span>Price: <b>${detail.Stock_Price}</b></span>
//                                 <span>Total: <b className="text-blue-600">${(detail.Stock_out_UOM_Qty * detail.Stock_Price).toFixed(2)}</b></span>
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

//       {/* Footer */}
//       <div className="bg-gray-100 px-3 py-2 text-sm text-gray-600">
//         Showing {filteredDispatches.length} of {dispatches.length} Dispatches
//       </div>
//     </div>
//   );
// };

// export default DispatchListPage;







// app/inventory/dispatch/page.tsx - COMPLETE DISPATCH LIST PAGE
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DispatchPrintModal from '@/components/DispatchPrintModal';

const DispatchListPage = () => {
  const [dispatches, setDispatches] = useState([]);
  const [filteredDispatches, setFilteredDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDispatch, setExpandedDispatch] = useState(null);
  
  // Print modal state
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const router = useRouter();

  useEffect(() => {
    fetchDispatches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dispatches, filters]);

  const fetchDispatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`);
      const result = await response.json();
      if (result.success) {
        setDispatches(result.data);
        console.log(`✅ Loaded ${result.data.length} Dispatches`);
      } else {
        console.error('❌ API Error:', result.message);
      }
    } catch (error) {
      console.error('❌ Error fetching dispatches:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...dispatches];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(dispatch => dispatch.Status === filters.status);
    }
    
    // Date range filters
    if (filters.dateFrom) {
      filtered = filtered.filter(dispatch => new Date(dispatch.Date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(dispatch => new Date(dispatch.Date) <= new Date(filters.dateTo));
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(dispatch => 
        dispatch.Number?.toLowerCase().includes(searchLower) ||
        dispatch.account?.acName?.toLowerCase().includes(searchLower) ||
        dispatch.order?.Number?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDispatches(filtered);
  };

  const handleView = (dispatch) => {
    setExpandedDispatch(expandedDispatch === dispatch.ID ? null : dispatch.ID);
  };

  const handleEdit = (dispatch) => {
    router.push(`/inventory/dispatch/edit?id=${dispatch.ID}`);
  };

  const handlePrint = (dispatch) => {
    setSelectedDispatch(dispatch);
    setPrintModalOpen(true);
  };

  const handleDelete = async (dispatchId) => {
    if (window.confirm('⚠️ Are you sure you want to delete this dispatch? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          fetchDispatches(); // Refresh the list
          alert('✅ Dispatch deleted successfully');
        } else {
          alert(`❌ Failed to delete dispatch: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Network error occurred while deleting');
      }
    }
  };

  const handleCreateNew = () => {
    router.push('/inventory/dispatch/create');
  };

  const handleFromSalesOrder = () => {
    router.push('/order/sales');
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 text-xs rounded font-medium';
    switch(status) {
      case 'Post':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'UnPost':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const calculateDispatchTotal = (details) => {
    if (!details || !Array.isArray(details)) return 0;
    return details.reduce((sum, detail) => 
      sum + ((parseFloat(detail.Stock_out_UOM_Qty) || 0) * (parseFloat(detail.Stock_Price) || 0)), 0
    );
  };

  const getUniqueBatchCount = (details) => {
    if (!details || !Array.isArray(details)) return 0;
    const uniqueBatches = [...new Set(details.map(d => d.batchno).filter(b => b))];
    return uniqueBatches.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading dispatches...</span>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">🚚 Dispatch Management</h1>
          <p className="text-sm opacity-90">Manage and track dispatch operations</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCreateNew}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-400 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Dispatch
          </button>
          <button
            onClick={handleFromSalesOrder}
            className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            From Sales Orders
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-3 border-b">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="UnPost">UnPost</option>
            <option value="Post">Post</option>
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="From Date"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="To Date"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search dispatch, customer, order..."
          />
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white border rounded-b overflow-hidden">
        {filteredDispatches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2m16-7H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2"></path>
            </svg>
            <p className="text-lg font-medium">No dispatches found</p>
            <p className="text-sm">Try adjusting your filters or create a new dispatch</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 text-left font-semibold">Dispatch#</th>
                <th className="px-3 py-3 text-left font-semibold">Date</th>
                <th className="px-3 py-3 text-left font-semibold">Customer</th>
                <th className="px-3 py-3 text-left font-semibold">Sales Order</th>
                <th className="px-3 py-3 text-left font-semibold">Status</th>
                <th className="px-3 py-3 text-center font-semibold">Items</th>
                <th className="px-3 py-3 text-center font-semibold">Batches</th>
                <th className="px-3 py-3 text-right font-semibold">Total</th>
                <th className="px-3 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDispatches.map((dispatch) => (
                <React.Fragment key={dispatch.ID}>
                  <tr className="hover:bg-green-50 border-b transition-colors">
                    <td className="px-3 py-3 font-medium text-green-600">
                      {dispatch.Number}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(dispatch.Date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{dispatch.account?.acName || 'N/A'}</div>
                      {dispatch.account?.city && (
                        <div className="text-xs text-gray-500">{dispatch.account.city}</div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {dispatch.order?.Number ? (
                        <span className="text-blue-600 font-medium">{dispatch.order.Number}</span>
                      ) : (
                        <span className="text-gray-400 italic">Standalone</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={getStatusBadge(dispatch.Status)}>{dispatch.Status}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        {dispatch.details?.length || 0}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                        {getUniqueBatchCount(dispatch.details)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold">
                      Rs. {calculateDispatchTotal(dispatch.details).toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => handleView(dispatch)}
                          className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(dispatch)}
                          className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                          title="Edit Dispatch"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handlePrint(dispatch)}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          title="Print Dispatch"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(dispatch.ID)}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          title="Delete Dispatch"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {expandedDispatch === dispatch.ID && dispatch.details && (
                    <tr>
                      <td colSpan="9" className="px-0 py-0 bg-green-50 border-l-4 border-green-400">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-800 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2m16-7H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2"></path>
                              </svg>
                              Items Dispatched ({dispatch.details.length})
                            </h4>
                            <div className="text-sm text-gray-600">
                              Total Value: <span className="font-semibold">Rs. {calculateDispatchTotal(dispatch.details).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            {dispatch.details.map((detail, index) => (
                              <div key={index} className="bg-white p-3 rounded border shadow-sm">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-3">
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                      {index + 1}
                                    </span>
                                    <div>
                                      <div className="font-medium text-gray-900">{detail.item?.itemName || 'Unknown Item'}</div>
                                      <div className="text-sm text-gray-500">Line ID: {detail.Line_Id}</div>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                                      <span className="font-medium">
                                        {detail.batchDetails?.acName || 'Unknown Batch'}
                                      </span>
                                      <span className="ml-1 text-blue-600">({detail.batchno})</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-4 text-sm">
                                    <div className="text-center">
                                      <div className="text-xs text-gray-500">Quantity</div>
                                      <div className="font-semibold text-green-600">{detail.Stock_out_UOM_Qty}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-gray-500">Unit Price</div>
                                      <div className="font-semibold">Rs. {parseFloat(detail.Stock_Price || 0).toFixed(2)}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs text-gray-500">Line Total</div>
                                      <div className="font-semibold text-blue-600">
                                        Rs. {(parseFloat(detail.Stock_out_UOM_Qty || 0) * parseFloat(detail.Stock_Price || 0)).toFixed(2)}
                                      </div>
                                    </div>
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
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-100 px-4 py-3 text-sm text-gray-600 flex justify-between items-center">
        <div>
          Showing <span className="font-semibold">{filteredDispatches.length}</span> of <span className="font-semibold">{dispatches.length}</span> dispatches
        </div>
        <div>
          Total Value: <span className="font-semibold">Rs. {filteredDispatches.reduce((sum, d) => sum + calculateDispatchTotal(d.details), 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Print Modal */}
      {printModalOpen && selectedDispatch && (
        <DispatchPrintModal
          dispatch={selectedDispatch}
          onClose={() => {
            setPrintModalOpen(false);
            setSelectedDispatch(null);
          }}
        />
      )}
    </div>
  );
};

export default DispatchListPage;
