'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CoaRecord {
  id: number;
  acName: string;
  setupName: string;
  city: string;
  personName: string;
  mobileNo: string;
  taxStatus: boolean;
  ntn: string;
  cnic: string;
  salesLimit: string;
  credit: string;
  creditDoys: string;
  salesMan: string;
  isJvBalance: boolean;
  adress: string;
  ch1Id: number;
  ch2Id: number;
  coaTypeId: number;
  discountA: number; // NEW
  discountB: number; // NEW
  discountC: number; // NEW
  ZControlHead2?: {
    zHead2: string;
  };
  ZCOAType?: {
    zType: string;
  };
}

export default function CoaList() {
  const router = useRouter();
  const [coaRecords, setCoaRecords] = useState<CoaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCoaRecords();
  }, []);

  const fetchCoaRecords = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      console.log('Fetching all COA records...');
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch COA records: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('COA records response:', data);
      
      // Updated to handle new API response structure
      const records = data.success ? data.zCoaRecords : (Array.isArray(data) ? data : []);
      setCoaRecords(records);
      
    } catch (error) {
      console.error('Error fetching COA records:', error);
      setMessage({
        type: 'error',
        text: 'Failed to fetch COA records. Please try again.'
      });
      setCoaRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, accountName: string) => {
    // Double confirmation for safety
    const confirmed = window.confirm(
      `Are you sure you want to delete "${accountName}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setDeleting(id);
      setMessage({ type: '', text: '' });
      
      console.log('Deleting COA record with ID:', id);
      
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Delete failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Delete response:', responseData);
      
      // Remove the deleted record from the list immediately
      setCoaRecords(prevRecords => prevRecords.filter(record => record.id !== id));
      
      setMessage({
        type: 'success',
        text: `"${accountName}" deleted successfully!`
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error: any) {
      console.error('Error deleting COA record:', error);
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to delete COA record'
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id: number) => {
    // Navigate to the CoaForm with the ID as query parameter
    router.push(`/coa?id=${id}`);
  };

  const handleCreateNew = () => {
    // Navigate to the CoaForm without ID (create mode)
    router.push('/coa');
  };

  // Filter records based on search term
  const filteredRecords = coaRecords.filter(record =>
    record.acName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.setupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.personName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chart of Accounts</h1>
            <p className="text-gray-600">Manage your chart of accounts records</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Account</span>
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 md:max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchCoaRecords}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading COA records...</p>
            </div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No COA records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new chart of account.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Create New Account
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discounts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{record.acName}</div>
                        <div className="text-gray-500">{record.setupName}</div>
                        <div className="text-gray-400 text-xs">ID: {record.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{record.personName}</div>
                        <div className="text-gray-500">{record.city}</div>
                        <div className="text-gray-500">{record.mobileNo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">Credit: {record.credit}</div>
                        <div className="text-gray-500">Limit: {record.salesLimit}</div>
                        <div className="text-gray-500">Days: {record.creditDoys}</div>
                      </div>
                    </td>
                    {/* NEW: Discount Column */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {record.discountA > 0 && (
                          <div className="text-blue-600">A: {record.discountA}%</div>
                        )}
                        {record.discountB > 0 && (
                          <div className="text-green-600">B: {record.discountB}%</div>
                        )}
                        {record.discountC > 0 && (
                          <div className="text-purple-600">C: {record.discountC}%</div>
                        )}
                        {record.discountA === 0 && record.discountB === 0 && record.discountC === 0 && (
                          <div className="text-gray-400">No discounts</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.taxStatus 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.taxStatus ? 'Tax Registered' : 'Unregistered'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.isJvBalance 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {record.isJvBalance ? 'JV Balance' : 'No JV Balance'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record.id)}
                          disabled={deleting === record.id}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id, record.acName)}
                          disabled={deleting === record.id}
                          className={`text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
                            deleting === record.id
                              ? 'bg-red-200 text-red-500 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          {deleting === record.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      {!loading && filteredRecords.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{coaRecords.length}</div>
              <div className="text-sm text-gray-500">Total Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {coaRecords.filter(record => record.taxStatus).length}
              </div>
              <div className="text-sm text-gray-500">Tax Registered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {coaRecords.filter(record => record.isJvBalance).length}
              </div>
              <div className="text-sm text-gray-500">JV Balance Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {coaRecords.filter(record => record.discountA > 0 || record.discountB > 0 || record.discountC > 0).length}
              </div>
              <div className="text-sm text-gray-500">With Discounts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
