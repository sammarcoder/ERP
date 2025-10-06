// app/inventory/grn/page.tsx - GRN LIST PAGE
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GRNListPage = () => {
  const [grns, setGrns] = useState([]);
  const [filteredGrns, setFilteredGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGrn, setExpandedGrn] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const router = useRouter();

  useEffect(() => {
    fetchGrns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [grns, filters]);

  const fetchGrns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${window.location.hostname}:4000/api/grn`);
      const result = await response.json();
      if (result.success) {
        setGrns(result.data);
        console.log(`✅ Loaded ${result.data.length} GRNs`);
      }
    } catch (error) {
      console.error('❌ Error fetching GRNs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...grns];

    if (filters.status !== 'all') {
      filtered = filtered.filter(grn => grn.Status === filters.status);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(grn => new Date(grn.Date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(grn => new Date(grn.Date) <= new Date(filters.dateTo));
    }
    if (filters.search) {
      filtered = filtered.filter(grn => 
        grn.Number?.toLowerCase().includes(filters.search.toLowerCase()) ||
        grn.account?.acName?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredGrns(filtered);
  };

  const handleView = (grn) => {
    setExpandedGrn(expandedGrn === grn.ID ? null : grn.ID);
  };

  const handleEdit = (grn) => {
    router.push(`/inventory/grn/edit?id=${grn.ID}`);
  };

  const handleDelete = async (grnId) => {
    if (window.confirm('⚠️ Delete this GRN permanently?')) {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/grn/${grnId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchGrns();
          alert('✅ GRN deleted successfully');
        } else {
          alert('❌ Failed to delete GRN');
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
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading GRNs...</span>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t flex justify-between items-center">
        <h1 className="text-xl font-bold">📦 GRN Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/inventory/grn/create')}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
          >
            + Create New GRN
          </button>
          <button
            onClick={() => router.push('/order/purchase')}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            📋 From Purchase Orders
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-3 border-b">
        <div className="grid grid-cols-4 gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="UnPost">UnPost</option>
            <option value="Post">Post</option>
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Search GRN# or Supplier..."
          />
        </div>
      </div>

      {/* GRNs Table */}
      <div className="bg-white border rounded-b">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">GRN#</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Supplier</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Batch</th>
              <th className="px-3 py-2 text-center">Items</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrns.map((grn) => (
              <React.Fragment key={grn.ID}>
                <tr className="hover:bg-blue-50 border-b">
                  <td className="px-3 py-2 font-medium text-blue-600">{grn.Number}</td>
                  <td className="px-3 py-2">{new Date(grn.Date).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{grn.account?.acName || 'N/A'}</td>
                  <td className="px-3 py-2">
                    <span className={getStatusBadge(grn.Status)}>{grn.Status}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {grn.batchno || 'N/A'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {grn.details?.length || 0}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    ${grn.details?.reduce((sum, detail) => 
                      sum + ((detail.Stock_In_UOM_Qty || 0) * (detail.Stock_Price || 0)), 0
                    ).toFixed(2) || '0.00'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={() => handleView(grn)}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEdit(grn)}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(grn.ID)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedGrn === grn.ID && grn.details && (
                  <tr>
                    <td colSpan="8" className="px-3 py-2 bg-blue-50 border-l-2 border-blue-400">
                      <div className="text-sm">
                        <div className="font-medium mb-2">📦 Items Received</div>
                        <div className="space-y-1">
                          {grn.details.map((detail, index) => (
                            <div key={index} className="bg-white p-2 rounded border flex justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">{index + 1}</span>
                                <span className="font-medium">{detail.item?.itemName}</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  📦 {detail.batchno}
                                </span>
                              </div>
                              <div className="flex space-x-3 text-sm">
                                <span>Qty: <b className="text-green-600">{detail.Stock_In_UOM_Qty}</b></span>
                                <span>Price: <b>${detail.Stock_Price}</b></span>
                                <span>Total: <b className="text-blue-600">${(detail.Stock_In_UOM_Qty * detail.Stock_Price).toFixed(2)}</b></span>
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
        Showing {filteredGrns.length} of {grns.length} GRNs
      </div>
    </div>
  );
};

export default GRNListPage;
