// 'use client'
// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/hooks/redux';
// import {
//   fetchTransporters,
//   deleteTransporter,
//   restoreTransporter,
//   setSearchTerm,
//   setFilterActive,
//   clearError,
//   type Transporter
// } from '@/store/slice/transporterSlice';
// import { TransporterForm } from './TransporterForm';
// import { ConfirmationModal } from '@/components/common/ConfirmationModal';

// export function TransporterList() {
//   const dispatch = useAppDispatch();
//   const {
//     transporters,
//     loading,
//     error,
//     pagination,
//     searchTerm,
//     filterActive
//   } = useAppSelector((state) => state.transporter);

//   const [showForm, setShowForm] = useState(false);
//   const [editingTransporter, setEditingTransporter] = useState<Transporter | null>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [transporterToDelete, setTransporterToDelete] = useState<{ transporter: Transporter; permanent: boolean } | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     loadTransporters();
//   }, [currentPage, filterActive]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchTerm.trim() !== '') {
//         loadTransporters();
//       }
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [searchTerm]);

//   const loadTransporters = () => {
//     const isActive = filterActive === 'all' ? undefined : filterActive === 'active';
    
//     dispatch(fetchTransporters({
//       page: currentPage,
//       limit: 10,
//       search: searchTerm,
//       isActive
//     }));
//   };

//   const handleSearch = (value: string) => {
//     dispatch(setSearchTerm(value));
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
//     dispatch(setFilterActive(filter));
//     setCurrentPage(1);
//   };

//   const handleCreateClick = () => {
//     setEditingTransporter(null);
//     setShowForm(true);
//   };

//   const handleEditClick = (transporter: Transporter) => {
//     setEditingTransporter(transporter);
//     setShowForm(true);
//   };

//   const handleDeleteClick = (transporter: Transporter, permanent = false) => {
//     setTransporterToDelete({ transporter, permanent });
//     setShowDeleteConfirm(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!transporterToDelete) return;

//     try {
//       await dispatch(deleteTransporter({
//         id: transporterToDelete.transporter.id,
//         permanent: transporterToDelete.permanent
//       })).unwrap();

//       setShowDeleteConfirm(false);
//       setTransporterToDelete(null);
      
//       if (transporterToDelete.permanent) {
//         // Reload data after permanent delete
//         loadTransporters();
//       }
//     } catch (error) {
//       console.error('Delete failed:', error);
//     }
//   };

//   const handleRestoreClick = async (transporter: Transporter) => {
//     try {
//       await dispatch(restoreTransporter(transporter.id)).unwrap();
//     } catch (error) {
//       console.error('Restore failed:', error);
//     }
//   };

//   const handleFormSuccess = () => {
//     setShowForm(false);
//     setEditingTransporter(null);
//     loadTransporters();
//   };

//   const getStatusCounts = () => {
//     const total = transporters.length;
//     const active = transporters.filter(t => t.isActive).length;
//     const inactive = transporters.filter(t => !t.isActive).length;
//     return { total, active, inactive };
//   };

//   const statusCounts = getStatusCounts();

//   return (
//     <div className="p-6">
//       <div className="bg-white rounded-lg shadow-lg">
        
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//                 <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
//                 </svg>
//                 Transporter Management
//               </h1>
//               <p className="text-gray-600 mt-1">Manage transport companies and logistics providers</p>
//             </div>
//             <button
//               onClick={handleCreateClick}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Transporter
//             </button>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 flex justify-between items-center">
//             <span>{error}</span>
//             <button
//               onClick={() => dispatch(clearError())}
//               className="text-red-600 hover:text-red-800"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         )}

//         {/* Filters & Search */}
//         <div className="p-6 border-b border-gray-200 bg-gray-50">
//           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            
//             {/* Search */}
//             <div className="relative flex-1 max-w-md">
//               <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search by name, contact person, or phone..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* Filter Tabs */}
//             <div className="flex space-x-2">
//               {[
//                 { key: 'all', label: `All (${statusCounts.total})`, color: 'gray' },
//                 { key: 'active', label: `Active (${statusCounts.active})`, color: 'green' },
//                 { key: 'inactive', label: `Inactive (${statusCounts.inactive})`, color: 'red' }
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => handleFilterChange(tab.key as any)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     filterActive === tab.key
//                       ? `bg-${tab.color}-600 text-white`
//                       : `bg-gray-200 text-gray-700 hover:bg-${tab.color}-100`
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//               <span className="ml-3 text-gray-600">Loading transporters...</span>
//             </div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact Person</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Address</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {transporters.map((transporter) => (
//                   <tr key={transporter.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className={`w-3 h-3 rounded-full mr-3 ${transporter.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                         <span className="font-medium text-gray-900">{transporter.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">
//                       {transporter.contactPerson || '-'}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">
//                       {transporter.phone || '-'}
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">
//                       <div className="max-w-xs truncate" title={transporter.address || ''}>
//                         {transporter.address || '-'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         transporter.isActive
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {transporter.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <div className="flex justify-center space-x-2">
                        
//                         {/* Edit Button */}
//                         <button
//                           onClick={() => handleEditClick(transporter)}
//                           className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
//                           title="Edit"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
//                           </svg>
//                         </button>

//                         {transporter.isActive ? (
//                           // Deactivate Button
//                           <button
//                             onClick={() => handleDeleteClick(transporter, false)}
//                             className="text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-50 transition-colors"
//                             title="Deactivate"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
//                             </svg>
//                           </button>
//                         ) : (
//                           // Restore Button
//                           <button
//                             onClick={() => handleRestoreClick(transporter)}
//                             className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
//                             title="Restore"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                             </svg>
//                           </button>
//                         )}

//                         {/* Delete Button */}
//                         <button
//                           onClick={() => handleDeleteClick(transporter, true)}
//                           className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                           title="Delete Permanently"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
//             <div className="text-sm text-gray-600">
//               Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} transporters
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//               >
//                 Previous
//               </button>
              
//               {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-3 py-2 border rounded-lg text-sm ${
//                     currentPage === page
//                       ? 'bg-blue-600 text-white border-blue-600'
//                       : 'border-gray-300 hover:bg-gray-100'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                 disabled={currentPage === pagination.totalPages}
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Form Modal */}
//       {showForm && (
//         <TransporterForm
//           transporter={editingTransporter}
//           onClose={() => setShowForm(false)}
//           onSuccess={handleFormSuccess}
//         />
//       )}

//       {/* Delete Confirmation */}
//       <ConfirmationModal
//         isOpen={showDeleteConfirm}
//         onClose={() => {
//           setShowDeleteConfirm(false);
//           setTransporterToDelete(null);
//         }}
//         onConfirm={handleConfirmDelete}
//         title={`${transporterToDelete?.permanent ? 'Delete' : 'Deactivate'} Transporter`}
//         message={`Are you sure you want to ${transporterToDelete?.permanent ? 'permanently delete' : 'deactivate'} "${transporterToDelete?.transporter.name}"?`}
//         confirmText={transporterToDelete?.permanent ? 'Delete Permanently' : 'Deactivate'}
//         type={transporterToDelete?.permanent ? 'danger' : 'warning'}
//         loading={loading}
//       />
//     </div>
//   );
// }






























































'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchTransporters,
  deleteTransporter,
  restoreTransporter,
  clearError,
  type Transporter
} from '@/store/slice/transporterSlice';
import { TransporterForm } from './TransporterForm';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

const ITEMS_PER_PAGE = 10;

export function TransporterList() {
  const dispatch = useAppDispatch();
  const {
    transporters,
    loading,
    error,
  } = useAppSelector((state) => state.transporter);

  const [showForm, setShowForm] = useState(false);
  const [editingTransporter, setEditingTransporter] = useState<Transporter | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transporterToDelete, setTransporterToDelete] = useState<{ transporter: Transporter; permanent: boolean } | null>(null);
  
  // Client-side state for search, filter, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all transporters on mount
  useEffect(() => {
    dispatch(fetchTransporters({}));
  }, [dispatch]);

  // Client-side filtering and search
  const filteredTransporters = useMemo(() => {
    let result = [...transporters];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.name?.toLowerCase().includes(search) ||
        t.contactPerson?.toLowerCase().includes(search) ||
        t.phone?.toLowerCase().includes(search) ||
        t.address?.toLowerCase().includes(search)
      );
    }

    // Apply active/inactive filter
    if (filterActive === 'active') {
      result = result.filter(t => t.isActive);
    } else if (filterActive === 'inactive') {
      result = result.filter(t => !t.isActive);
    }

    return result;
  }, [transporters, searchTerm, filterActive]);

  // Client-side pagination
  const paginatedTransporters = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTransporters.slice(startIndex, endIndex);
  }, [filteredTransporters, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransporters.length / ITEMS_PER_PAGE);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterActive]);

  // Status counts for filter tabs
  const statusCounts = useMemo(() => {
    const total = transporters.length;
    const active = transporters.filter(t => t.isActive).length;
    const inactive = transporters.filter(t => !t.isActive).length;
    return { total, active, inactive };
  }, [transporters]);

  // Filtered counts (for showing in results)
  const filteredCounts = useMemo(() => {
    return {
      showing: filteredTransporters.length,
      total: transporters.length
    };
  }, [filteredTransporters, transporters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setFilterActive(filter);
  };

  const handleCreateClick = () => {
    setEditingTransporter(null);
    setShowForm(true);
  };

  const handleEditClick = (transporter: Transporter) => {
    setEditingTransporter(transporter);
    setShowForm(true);
  };

  const handleDeleteClick = (transporter: Transporter, permanent = false) => {
    setTransporterToDelete({ transporter, permanent });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!transporterToDelete) return;

    try {
      await dispatch(deleteTransporter({
        id: transporterToDelete.transporter.id,
        permanent: transporterToDelete.permanent
      })).unwrap();

      setShowDeleteConfirm(false);
      setTransporterToDelete(null);
      
      // Reload data after delete
      dispatch(fetchTransporters({}));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleRestoreClick = async (transporter: Transporter) => {
    try {
      await dispatch(restoreTransporter(transporter.id)).unwrap();
      // Reload data after restore
      dispatch(fetchTransporters({}));
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransporter(null);
    dispatch(fetchTransporters({}));
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                Transporter Management
              </h1>
              <p className="text-gray-600 mt-1">Manage transport companies and logistics providers</p>
            </div>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transporter
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Filters & Search */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, contact person, phone, or address..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === 'all'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({statusCounts.total})
              </button>
              <button
                onClick={() => handleFilterChange('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                }`}
              >
                Active ({statusCounts.active})
              </button>
              <button
                onClick={() => handleFilterChange('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterActive === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                }`}
              >
                Inactive ({statusCounts.inactive})
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {(searchTerm || filterActive !== 'all') && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredCounts.showing} of {filteredCounts.total} transporters
              {searchTerm && <span className="ml-1">matching "<strong>{searchTerm}</strong>"</span>}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading transporters...</span>
            </div>
          ) : paginatedTransporters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No transporters found</p>
              <p className="text-sm">
                {searchTerm || filterActive !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Create your first transporter to get started'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact Person</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Address</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTransporters.map((transporter) => (
                  <tr key={transporter.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${transporter.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-gray-900">{transporter.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {transporter.contactPerson || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {transporter.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="max-w-xs truncate" title={transporter.address || ''}>
                        {transporter.address || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transporter.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transporter.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditClick(transporter)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {transporter.isActive ? (
                          // Deactivate Button
                          <button
                            onClick={() => handleDeleteClick(transporter, false)}
                            className="text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                            title="Deactivate"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        ) : (
                          // Restore Button
                          <button
                            onClick={() => handleRestoreClick(transporter)}
                            className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            title="Restore"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(transporter, true)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Permanently"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransporters.length)} of {filteredTransporters.length} transporters
            </div>
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg text-sm min-w-[40px] transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-2 text-gray-400">...</span>
                )
              ))}
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <TransporterForm
          transporter={editingTransporter}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTransporterToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`${transporterToDelete?.permanent ? 'Delete' : 'Deactivate'} Transporter`}
        message={`Are you sure you want to ${transporterToDelete?.permanent ? 'permanently delete' : 'deactivate'} "${transporterToDelete?.transporter.name}"?`}
        confirmText={transporterToDelete?.permanent ? 'Delete Permanently' : 'Deactivate'}
        type={transporterToDelete?.permanent ? 'danger' : 'warning'}
        loading={loading}
      />
    </div>
  );
}
