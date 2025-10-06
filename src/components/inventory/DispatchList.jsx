// components/DispatchList.jsx - PROFESSIONAL & SIMPLE
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DispatchList = () => {
  const [dispatches, setDispatches] = useState([]);
  const [filteredDispatches, setFilteredDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDispatch, setExpandedDispatch] = useState(null);
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
      }
    } catch (error) {
      console.error('❌ Error fetching dispatches:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...dispatches];

    if (filters.status !== 'all') {
      filtered = filtered.filter(dispatch => dispatch.Status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(dispatch => new Date(dispatch.Date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(dispatch => new Date(dispatch.Date) <= new Date(filters.dateTo));
    }

    if (filters.search) {
      filtered = filtered.filter(dispatch => 
        dispatch.Number?.toLowerCase().includes(filters.search.toLowerCase()) ||
        dispatch.account?.acName?.toLowerCase().includes(filters.search.toLowerCase())
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

  const handleDelete = async (dispatchId) => {
    if (window.confirm('⚠️ Delete this Dispatch? This cannot be undone.')) {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchDispatches();
          alert('✅ Dispatch deleted successfully');
        } else {
          alert('❌ Failed to delete dispatch');
        }
      } catch (error) {
        console.error('Error deleting dispatch:', error);
        alert('❌ Error deleting dispatch');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'UnPost': 'bg-yellow-100 text-yellow-800',
      'Post': 'bg-green-100 text-green-800'
    };
    return `px-2 py-1 text-xs font-medium rounded ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-600">Loading Dispatches...</span>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="bg-green-600 text-white p-3 rounded-t flex justify-between items-center">
        <h1 className="text-lg font-bold">🚚 Dispatch Notes</h1>
        <button
          onClick={() => router.push('/inventory/dispatch/create')}
          className="bg-green-500 px-3 py-1 rounded text-sm hover:bg-green-400"
        >
          + New Dispatch
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-2 border-b">
        <div className="grid grid-cols-4 gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="all">All Status</option>
            <option value="UnPost">UnPost</option>
            <option value="Post">Post</option>
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            className="px-2 py-1 border rounded text-sm"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            className="px-2 py-1 border rounded text-sm"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-2 py-1 border rounded text-sm"
            placeholder="Search Dispatch# or Customer..."
          />
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white border rounded-b overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 text-left font-medium">Dispatch#</th>
              <th className="px-2 py-2 text-left font-medium">Date</th>
              <th className="px-2 py-2 text-left font-medium">Customer</th>
              <th className="px-2 py-2 text-left font-medium">Status</th>
              <th className="px-2 py-2 text-left font-medium">Type</th>
              <th className="px-2 py-2 text-center font-medium">Items</th>
              <th className="px-2 py-2 text-center font-medium">Batches</th>
              <th className="px-2 py-2 text-right font-medium">Total</th>
              <th className="px-2 py-2 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDispatches.map((dispatch) => (
              <React.Fragment key={dispatch.ID}>
                <tr className="hover:bg-gray-50 border-b">
                  <td className="px-2 py-2 font-medium text-green-600">{dispatch.Number}</td>
                  <td className="px-2 py-2">{new Date(dispatch.Date).toLocaleDateString()}</td>
                  <td className="px-2 py-2">{dispatch.account?.acName || 'N/A'}</td>
                  <td className="px-2 py-2">
                    <span className={getStatusBadge(dispatch.Status)}>{dispatch.Status}</span>
                  </td>
                  <td className="px-2 py-2">{dispatch.Purchase_Type}</td>
                  <td className="px-2 py-2 text-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {dispatch.details?.length || 0}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      {[...new Set(dispatch.details?.map(d => d.batchno) || [])].length}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right font-medium">
                    ${dispatch.details?.reduce((sum, detail) => 
                      sum + ((detail.Stock_out_UOM_Qty || 0) * (detail.Stock_Price || 0)), 0
                    ).toFixed(2) || '0.00'}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={() => handleView(dispatch)}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEdit(dispatch)}
                        className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200"
                        title="Edit Dispatch"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(dispatch.ID)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                        title="Delete Dispatch"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedDispatch === dispatch.ID && dispatch.details && (
                  <tr>
                    <td colSpan="9" className="px-2 py-2 bg-green-50 border-l-2 border-green-400">
                      <div className="text-xs">
                        <div className="font-medium mb-1">🚚 Dispatched Items ({dispatch.details.length})</div>
                        <div className="grid grid-cols-1 gap-1">
                          {dispatch.details.map((detail, index) => (
                            <div key={index} className="bg-white p-2 rounded border flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <span className="bg-green-500 text-white text-xs px-1 rounded">{index + 1}</span>
                                <span className="font-medium">{detail.item?.itemName}</span>
                                <span className="text-orange-600 bg-orange-100 px-1 rounded">📦 {detail.batchno}</span>
                              </div>
                              <div className="flex space-x-4 text-xs">
                                <div>Qty: <span className="font-medium text-green-600">{detail.Stock_out_UOM_Qty}</span></div>
                                <div>Price: <span className="font-medium">${detail.Stock_Price}</span></div>
                                <div>Total: <span className="font-medium text-blue-600">${(detail.Stock_out_UOM_Qty * detail.Stock_Price).toFixed(2)}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Batch Summary */}
                        <div className="mt-2 bg-orange-50 p-2 rounded border">
                          <div className="font-medium text-orange-800 mb-1">📦 Batches Used:</div>
                          <div className="flex flex-wrap gap-1">
                            {[...new Set(dispatch.details.map(d => d.batchno))].map((batch, index) => (
                              <span key={index} className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">
                                {batch} ({dispatch.details.filter(d => d.batchno === batch).length} items)
                              </span>
                            ))}
                          </div>
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

      {/* Footer */}
      <div className="bg-gray-100 px-2 py-1 text-xs text-gray-600 border-t">
        Showing {filteredDispatches.length} of {dispatches.length} Dispatches
      </div>
    </div>
  );
};

export default DispatchList;
