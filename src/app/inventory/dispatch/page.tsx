// app/inventory/dispatch/page.tsx - DISPATCH LIST PAGE
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DispatchListPage = () => {
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
    if (window.confirm('⚠️ Delete this Dispatch permanently?')) {
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
        alert('❌ Delete error');
      }
    }
  };

  const getStatusBadge = (status) => {
    return `px-2 py-1 text-xs rounded ${
      status === 'Post' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading dispatches...</span>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t flex justify-between items-center">
        <h1 className="text-xl font-bold">🚚 Dispatch Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/inventory/dispatch/create')}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-400"
          >
            + Create New Dispatch
          </button>
          <button
            onClick={() => router.push('/order/sales')}
            className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            📋 From Sales Orders
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-3 border-b">
        <div className="grid grid-cols-4 gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="UnPost">UnPost</option>
            <option value="Post">Post</option>
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white border rounded-b">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Dispatch#</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-center">Items</th>
              <th className="px-3 py-2 text-center">Batches</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDispatches.map((dispatch) => (
              <React.Fragment key={dispatch.ID}>
                <tr className="hover:bg-green-50 border-b">
                  <td className="px-3 py-2 font-medium text-green-600">{dispatch.Number}</td>
                  <td className="px-3 py-2">{new Date(dispatch.Date).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{dispatch.account?.acName || 'N/A'}</td>
                  <td className="px-3 py-2">
                    <span className={getStatusBadge(dispatch.Status)}>{dispatch.Status}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {dispatch.details?.length || 0}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      {[...new Set(dispatch.details?.map(d => d.batchno) || [])].filter(b => b).length}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    ${dispatch.details?.reduce((sum, detail) => 
                      sum + ((detail.Stock_out_UOM_Qty || 0) * (detail.Stock_Price || 0)), 0
                    ).toFixed(2) || '0.00'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={() => handleView(dispatch)}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEdit(dispatch)}
                        className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(dispatch.ID)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedDispatch === dispatch.ID && dispatch.details && (
                  <tr>
                    <td colSpan="8" className="px-3 py-2 bg-green-50 border-l-2 border-green-400">
                      <div className="text-sm">
                        <div className="font-medium mb-2">🚚 Items Dispatched</div>
                        <div className="space-y-1">
                          {dispatch.details.map((detail, index) => (
                            <div key={index} className="bg-white p-2 rounded border flex justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{index + 1}</span>
                                <span className="font-medium">{detail.item?.itemName}</span>
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                  📦 {detail.batchno}
                                </span>
                              </div>
                              <div className="flex space-x-3 text-sm">
                                <span>Qty: <b className="text-green-600">{detail.Stock_out_UOM_Qty}</b></span>
                                <span>Price: <b>${detail.Stock_Price}</b></span>
                                <span>Total: <b className="text-blue-600">${(detail.Stock_out_UOM_Qty * detail.Stock_Price).toFixed(2)}</b></span>
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

      {/* Footer */}
      <div className="bg-gray-100 px-3 py-2 text-sm text-gray-600">
        Showing {filteredDispatches.length} of {dispatches.length} Dispatches
      </div>
    </div>
  );
};

export default DispatchListPage;
