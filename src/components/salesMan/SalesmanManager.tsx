// 'use client'
// import React, { useState } from 'react'
// import {
//     useGetSalesmenQuery,
//     useCreateSalesmanMutation,
//     useUpdateSalesmanMutation,
//     useDeleteSalesmanMutation
// } from '@/store/slice/salesmanSlice'
// import { Salesman } from '@/types/salesman'
// import { Button } from '../ui/Button'
// import { Input } from '../ui/Input'
// import { Loading } from '../ui/Loading'
// import { Modal } from '../ui/Modal'
// import { ConfirmationModal } from '../common/ConfirmationModal'

// export const SalesmanManager: React.FC = () => {
//     const [page, setPage] = useState(1)
//     const [showCreateModal, setShowCreateModal] = useState(false)
//     const [editModal, setEditModal] = useState<{ isOpen: boolean; salesman?: Salesman }>({ isOpen: false })
//     const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; salesman?: Salesman }>({ isOpen: false })

//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         city: '',
//         adress: '', // Note: keeping your backend spelling
//         telephone: ''
//     })

//     // RTK Query hooks
//     const { data: salesmenData, isLoading, error } = useGetSalesmenQuery({ page, limit: 10 })
//     const [createSalesman, { isLoading: isCreating }] = useCreateSalesmanMutation()
//     const [updateSalesman, { isLoading: isUpdating }] = useUpdateSalesmanMutation()
//     const [deleteSalesman, { isLoading: isDeleting }] = useDeleteSalesmanMutation()

//     const salesmen = salesmenData?.data || []
//     const pagination = {
//         total: salesmenData?.total || 0,
//         page: salesmenData?.page || 1,
//         totalPages: salesmenData?.totalPages || 1
//     }

//     // Form handlers
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData(prev => ({
//             ...prev,
//             [e.target.name]: e.target.value
//         }))
//     }

//     const resetForm = () => {
//         setFormData({ name: '', city: '', adress: '', telephone: '' })
//     }

//     // Create salesman
//     const handleCreate = async (e: React.FormEvent) => {
//         e.preventDefault()
//         try {
//             await createSalesman(formData).unwrap()
//             setShowCreateModal(false)
//             resetForm()
//         } catch (err) {
//             console.error('Failed to create salesman:', err)
//         }
//     }

//     // Edit salesman
//     const handleEditClick = (salesman: Salesman) => {
//         setFormData({
//             name: salesman.name,
//             city: salesman.city,
//             adress: salesman.adress,
//             telephone: salesman.telephone
//         })
//         setEditModal({ isOpen: true, salesman })
//     }

//     const handleUpdate = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!editModal.salesman) return

//         try {
//             await updateSalesman({
//                 id: editModal.salesman.id,
//                 ...formData
//             }).unwrap()
//             setEditModal({ isOpen: false })
//             resetForm()
//         } catch (err) {
//             console.error('Failed to update salesman:', err)
//         }
//     }

//     // Delete salesman
//     const handleDeleteClick = (salesman: Salesman) => {
//         setConfirmModal({ isOpen: true, salesman })
//     }

//     const handleConfirmDelete = async () => {
//         if (!confirmModal.salesman) return

//         try {
//             await deleteSalesman(confirmModal.salesman.id).unwrap()
//             setConfirmModal({ isOpen: false })
//         } catch (err) {
//             console.error('Failed to delete salesman:', err)
//         }
//     }

//     if (isLoading) {
//         return <Loading size="lg" text="Loading Salesmen..." />
//     }

//     if (error) {
//         return (
//             <div className="max-w-6xl mx-auto p-6">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//                     <p className="text-red-600">Failed to load salesmen. Please try again.</p>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-6 space-y-8">
//             {/* Header */}
//             <div className="flex justify-between items-center border-b border-gray-200 pb-6">
//                 <div>
//                     <h1 className="text-3xl font-semibold text-gray-900">
//                         Salesmen Management
//                     </h1>
//                     <p className="text-gray-600 mt-2">
//                         Manage your sales team ({pagination.total} total)
//                     </p>
//                 </div>
//                 <Button onClick={() => setShowCreateModal(true)}>
//                     Add New Salesman
//                 </Button>
//             </div>

//             {/* Salesmen Table */}
//             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                     <h2 className="text-lg font-medium text-gray-900">
//                         Salesmen List
//                     </h2>
//                 </div>

//                 {salesmen.length === 0 ? (
//                     <div className="p-8 text-center text-gray-500">
//                         No salesmen found. Add your first salesman above.
//                     </div>
//                 ) : (
//                     <>
//                         {/* Table */}
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Salesman
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Contact Info
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Location
//                                         </th>
//                                         {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Created Date
//                                         </th> */}
//                                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {salesmen.map((salesman) => (
//                                         <tr key={salesman.id} className="hover:bg-gray-50 transition-colors">
//                                             {/* Salesman Column */}
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                                         <span className="text-blue-600 font-semibold text-sm">
//                                                             {salesman.name.charAt(0).toUpperCase()}
//                                                         </span>
//                                                     </div>
//                                                     <div className="ml-4">
//                                                         <div className="text-sm font-medium text-gray-900">
//                                                             {salesman.name}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             ID: {salesman.id}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>

//                                             {/* Contact Info Column */}
//                                             <td className="px-6 py-4">
//                                                 <div className="space-y-1">
//                                                     <div className="text-sm text-gray-900 flex items-center">
//                                                         <span className="mr-2">📞</span>
//                                                         {salesman.telephone}
//                                                     </div>
//                                                     <div className="text-sm text-gray-500 flex items-center">
//                                                         <span className="mr-2">📧</span>
//                                                         {salesman.adress}
//                                                     </div>
//                                                 </div>
//                                             </td>

//                                             {/* Location Column */}
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900 flex items-center">
//                                                     <span className="mr-2">📍</span>
//                                                     {salesman.city}
//                                                 </div>
//                                             </td>

//                                             {/* Created Date Column */}
//                                             {/* <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900">
//                                                     {salesman.createdAt
//                                                         ? new Date(salesman.createdAt).toLocaleDateString()
//                                                         : 'N/A'
//                                                     }
//                                                 </div>
//                                             </td> */}

//                                             {/* Actions Column */}
//                                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                 <div className="flex items-center justify-end space-x-2">
//                                                     <Button
//                                                         variant="secondary"
//                                                         onClick={() => handleEditClick(salesman)}
//                                                         className="px-3 py-1 text-xs"
//                                                     >
//                                                         Edit
//                                                     </Button>
//                                                     <Button
//                                                         variant="danger"
//                                                         onClick={() => handleDeleteClick(salesman)}
//                                                         className="px-3 py-1 text-xs"
//                                                     >
//                                                         Delete
//                                                     </Button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Enhanced Pagination */}
//                         {pagination.totalPages > 1 && (
//                             <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//                                 <div className="flex-1 flex justify-between sm:hidden">
//                                     <Button
//                                         variant="secondary"
//                                         onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//                                         disabled={page === 1}
//                                         className="relative inline-flex items-center px-4 py-2 text-sm"
//                                     >
//                                         Previous
//                                     </Button>
//                                     <Button
//                                         variant="secondary"
//                                         onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                                         disabled={page === pagination.totalPages}
//                                         className="ml-3 relative inline-flex items-center px-4 py-2 text-sm"
//                                     >
//                                         Next
//                                     </Button>
//                                 </div>

//                                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-700">
//                                             Showing{' '}
//                                             <span className="font-medium">{((page - 1) * 10) + 1}</span>{' '}
//                                             to{' '}
//                                             <span className="font-medium">
//                                                 {Math.min(page * 10, pagination.total)}
//                                             </span>{' '}
//                                             of{' '}
//                                             <span className="font-medium">{pagination.total}</span>{' '}
//                                             results
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                                             <Button
//                                                 variant="secondary"
//                                                 onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//                                                 disabled={page === 1}
//                                                 className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm"
//                                             >
//                                                 Previous
//                                             </Button>

//                                             {/* Page Numbers */}
//                                             {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                                                 const pageNum = Math.max(1, Math.min(
//                                                     pagination.totalPages - 4,
//                                                     Math.max(1, page - 2)
//                                                 )) + i;

//                                                 if (pageNum <= pagination.totalPages) {
//                                                     return (
//                                                         <button
//                                                             key={pageNum}
//                                                             onClick={() => setPage(pageNum)}
//                                                             className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${page === pageNum
//                                                                     ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                                                                     : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                                                                 }`}
//                                                         >
//                                                             {pageNum}
//                                                         </button>
//                                                     );
//                                                 }
//                                                 return null;
//                                             })}

//                                             <Button
//                                                 variant="secondary"
//                                                 onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                                                 disabled={page === pagination.totalPages}
//                                                 className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm"
//                                             >
//                                                 Next
//                                             </Button>
//                                         </nav>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>

//             {/* Create Modal */}
//             <Modal
//                 isOpen={showCreateModal}
//                 onClose={() => {
//                     setShowCreateModal(false)
//                     resetForm()
//                 }}
//                 title="Add New Salesman"
//             >
//                 <form onSubmit={handleCreate} className="space-y-4">
//                     <Input
//                         label="Full Name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="Enter salesman's full name"
//                         required
//                     />
//                     <Input
//                         label="City"
//                         name="city"
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         placeholder="Enter city"
//                         required
//                     />
//                     <Input
//                         label="Address"
//                         name="adress"
//                         value={formData.adress}
//                         onChange={handleInputChange}
//                         placeholder="Enter address"
//                         required
//                     />
//                     <Input
//                         label="Telephone"
//                         name="telephone"
//                         value={formData.telephone}
//                         onChange={handleInputChange}
//                         placeholder="Enter telephone number"
//                         required
//                     />

//                     <div className="flex space-x-3 pt-4">
//                         <Button
//                             type="submit"
//                             loading={isCreating}
//                             className="flex-1"
//                         >
//                             Create Salesman
//                         </Button>
//                         <Button
//                             type="button"
//                             variant="secondary"
//                             onClick={() => {
//                                 setShowCreateModal(false)
//                                 resetForm()
//                             }}
//                             className="flex-1"
//                         >
//                             Cancel
//                         </Button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* Edit Modal */}
//             <Modal
//                 isOpen={editModal.isOpen}
//                 onClose={() => {
//                     setEditModal({ isOpen: false })
//                     resetForm()
//                 }}
//                 title="Edit Salesman"
//             >
//                 <form onSubmit={handleUpdate} className="space-y-4">
//                     <Input
//                         label="Full Name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="Enter salesman's full name"
//                         required
//                     />
//                     <Input
//                         label="City"
//                         name="city"
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         placeholder="Enter city"
//                         required
//                     />
//                     <Input
//                         label="Address"
//                         name="adress"
//                         value={formData.adress}
//                         onChange={handleInputChange}
//                         placeholder="Enter address"
//                         required
//                     />
//                     <Input
//                         label="Telephone"
//                         name="telephone"
//                         value={formData.telephone}
//                         onChange={handleInputChange}
//                         placeholder="Enter telephone number"
//                         required
//                     />

//                     <div className="flex space-x-3 pt-4">
//                         <Button
//                             type="submit"
//                             loading={isUpdating}
//                             className="flex-1"
//                         >
//                             Update Salesman
//                         </Button>
//                         <Button
//                             type="button"
//                             variant="secondary"
//                             onClick={() => {
//                                 setEditModal({ isOpen: false })
//                                 resetForm()
//                             }}
//                             className="flex-1"
//                         >
//                             Cancel
//                         </Button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* Delete Confirmation Modal */}
//             <ConfirmationModal
//                 isOpen={confirmModal.isOpen}
//                 onClose={() => setConfirmModal({ isOpen: false })}
//                 onConfirm={handleConfirmDelete}
//                 title="Delete Salesman"
//                 message={`Are you sure you want to delete "${confirmModal.salesman?.name}"? This action cannot be undone.`}
//                 confirmText="Delete Salesman"
//                 cancelText="Cancel"
//                 type="danger"
//                 loading={isDeleting}
//             />
//         </div>
//     )
// }










































































'use client'
import React, { useState, useMemo } from 'react'
import {
    useGetSalesmenQuery,
    useCreateSalesmanMutation,
    useUpdateSalesmanMutation,
    useDeleteSalesmanMutation
} from '@/store/slice/salesmanSlice'
import { Salesman } from '@/types/salesman'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { Modal } from '../ui/Modal'
import { ConfirmationModal } from '../common/ConfirmationModal'

export const SalesmanManager: React.FC = () => {
    const [page, setPage] = useState(1)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editModal, setEditModal] = useState<{ isOpen: boolean; salesman?: Salesman }>({ isOpen: false })
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; salesman?: Salesman }>({ isOpen: false })

    // 🔍 NEW: Search state
    const [searchTerm, setSearchTerm] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        adress: '', // Note: keeping your backend spelling
        telephone: ''
    })

    // RTK Query hooks
    const { data: salesmenData, isLoading, error } = useGetSalesmenQuery({ page, limit: 10 })
    const [createSalesman, { isLoading: isCreating }] = useCreateSalesmanMutation()
    const [updateSalesman, { isLoading: isUpdating }] = useUpdateSalesmanMutation()
    const [deleteSalesman, { isLoading: isDeleting }] = useDeleteSalesmanMutation()

    const salesmen = salesmenData?.data || []
    const pagination = {
        total: salesmenData?.total || 0,
        page: salesmenData?.page || 1,
        totalPages: salesmenData?.totalPages || 1
    }

    // 🔍 NEW: Filtered salesmen based on search
    const filteredSalesmen = useMemo(() => {
        if (!searchTerm.trim()) return salesmen

        return salesmen.filter(salesman =>
            salesman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salesman.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salesman.adress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salesman.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            salesman.id.toString().includes(searchTerm)
        )
    }, [salesmen, searchTerm])

    // Form handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const resetForm = () => {
        setFormData({ name: '', city: '', adress: '', telephone: '' })
    }

    // 🔍 NEW: Clear search
    const clearSearch = () => {
        setSearchTerm('')
    }

    // Create salesman
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createSalesman(formData).unwrap()
            setShowCreateModal(false)
            resetForm()
        } catch (err) {
            console.error('Failed to create salesman:', err)
        }
    }

    // Edit salesman
    const handleEditClick = (salesman: Salesman) => {
        setFormData({
            name: salesman.name,
            city: salesman.city,
            adress: salesman.adress,
            telephone: salesman.telephone
        })
        setEditModal({ isOpen: true, salesman })
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editModal.salesman) return

        try {
            await updateSalesman({
                id: editModal.salesman.id,
                ...formData
            }).unwrap()
            setEditModal({ isOpen: false })
            resetForm()
        } catch (err) {
            console.error('Failed to update salesman:', err)
        }
    }

    // Delete salesman
    const handleDeleteClick = (salesman: Salesman) => {
        setConfirmModal({ isOpen: true, salesman })
    }

    const handleConfirmDelete = async () => {
        if (!confirmModal.salesman) return

        try {
            await deleteSalesman(confirmModal.salesman.id).unwrap()
            setConfirmModal({ isOpen: false })
        } catch (err) {
            console.error('Failed to delete salesman:', err)
        }
    }

    if (isLoading) {
        return <Loading size="lg" text="Loading Salesmen..." />
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">Failed to load salesmen. Please try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Salesmen Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your sales team ({pagination.total} total)
                        {searchTerm && (
                            <span className="text-blue-600">
                                {' '}• {filteredSalesmen.length} filtered results
                            </span>
                        )}
                    </p>
                </div>

            </div>

            {/* 🔍 NEW: Search Bar */}
            <div className="">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex justify-between w-full">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, city, address, phone, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <Button onClick={() => setShowCreateModal(true)}>
                            Add New Salesman
                        </Button>
                    </div>

                    {searchTerm && (
                        <Button
                            variant="secondary"
                            onClick={clearSearch}
                            className="flex items-center space-x-2"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Clear</span>
                        </Button>
                    )}
                </div>

                {searchTerm && (
                    <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">{filteredSalesmen.length}</span> results found for
                        <span className="font-medium text-blue-600"> "{searchTerm}"</span>
                    </div>
                )}
            </div>

            {/* Salesmen Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                        Salesmen List
                    </h2>
                </div>

                {filteredSalesmen.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? (
                            <div>
                                <p className="text-lg mb-2">No results found for "{searchTerm}"</p>
                                <p className="text-sm">Try adjusting your search terms or clear the search to see all salesmen.</p>
                                <Button
                                    variant="secondary"
                                    onClick={clearSearch}
                                    className="mt-4"
                                >
                                    Clear Search
                                </Button>
                            </div>
                        ) : (
                            'No salesmen found. Add your first salesman above.'
                        )}
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salesman
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSalesmen.map((salesman) => (
                                        <tr key={salesman.id} className="hover:bg-gray-50 transition-colors">
                                            {/* Salesman Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {salesman.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {/* 🔍 Highlight search term */}
                                                            {searchTerm ? (
                                                                <span dangerouslySetInnerHTML={{
                                                                    __html: salesman.name.replace(
                                                                        new RegExp(`(${searchTerm})`, 'gi'),
                                                                        '<mark class="bg-yellow-200">$1</mark>'
                                                                    )
                                                                }} />
                                                            ) : (
                                                                salesman.name
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {salesman.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Info Column */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-900 flex items-center">
                                                        <span className="mr-2">📞</span>
                                                        {/* 🔍 Highlight search term */}
                                                        {searchTerm ? (
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: salesman.telephone.replace(
                                                                    new RegExp(`(${searchTerm})`, 'gi'),
                                                                    '<mark class="bg-yellow-200">$1</mark>'
                                                                )
                                                            }} />
                                                        ) : (
                                                            salesman.telephone
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <span className="mr-2">📧</span>
                                                        {/* 🔍 Highlight search term */}
                                                        {searchTerm ? (
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: salesman.adress.replace(
                                                                    new RegExp(`(${searchTerm})`, 'gi'),
                                                                    '<mark class="bg-yellow-200">$1</mark>'
                                                                )
                                                            }} />
                                                        ) : (
                                                            salesman.adress
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Location Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center">
                                                    <span className="mr-2">📍</span>
                                                    {/* 🔍 Highlight search term */}
                                                    {searchTerm ? (
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: salesman.city.replace(
                                                                new RegExp(`(${searchTerm})`, 'gi'),
                                                                '<mark class="bg-yellow-200">$1</mark>'
                                                            )
                                                        }} />
                                                    ) : (
                                                        salesman.city
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleEditClick(salesman)}
                                                        className="px-3 py-1 text-xs"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteClick(salesman)}
                                                        className="px-3 py-1 text-xs"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Pagination - Only show if no search or results exist */}
                        {!searchTerm && pagination.totalPages > 1 && (
                            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-4 py-2 text-sm"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                        disabled={page === pagination.totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 text-sm"
                                    >
                                        Next
                                    </Button>
                                </div>

                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{' '}
                                            <span className="font-medium">{((page - 1) * 10) + 1}</span>{' '}
                                            to{' '}
                                            <span className="font-medium">
                                                {Math.min(page * 10, pagination.total)}
                                            </span>{' '}
                                            of{' '}
                                            <span className="font-medium">{pagination.total}</span>{' '}
                                            results
                                        </p>
                                    </div>

                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm"
                                            >
                                                Previous
                                            </Button>

                                            {/* Page Numbers */}
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                const pageNum = Math.max(1, Math.min(
                                                    pagination.totalPages - 4,
                                                    Math.max(1, page - 2)
                                                )) + i;

                                                if (pageNum <= pagination.totalPages) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setPage(pageNum)}
                                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${page === pageNum
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })}

                                            <Button
                                                variant="secondary"
                                                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                                disabled={page === pagination.totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm"
                                            >
                                                Next
                                            </Button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Your existing modals remain the same... */}
            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false)
                    resetForm()
                }}
                title="Add New Salesman"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter salesman's full name"
                        required
                    />
                    <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                    />
                    <Input
                        label="Address"
                        name="adress"
                        value={formData.adress}
                        onChange={handleInputChange}
                        placeholder="Enter address"
                        required
                    />
                    <Input
                        label="Telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="Enter telephone number"
                        required
                    />

                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="submit"
                            loading={isCreating}
                            className="flex-1"
                        >
                            Create Salesman
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowCreateModal(false)
                                resetForm()
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => {
                    setEditModal({ isOpen: false })
                    resetForm()
                }}
                title="Edit Salesman"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter salesman's full name"
                        required
                    />
                    <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                    />
                    <Input
                        label="Address"
                        name="adress"
                        value={formData.adress}
                        onChange={handleInputChange}
                        placeholder="Enter address"
                        required
                    />
                    <Input
                        label="Telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="Enter telephone number"
                        required
                    />

                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="submit"
                            loading={isUpdating}
                            className="flex-1"
                        >
                            Update Salesman
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setEditModal({ isOpen: false })
                                resetForm()
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={handleConfirmDelete}
                title="Delete Salesman"
                message={`Are you sure you want to delete "${confirmModal.salesman?.name}"? This action cannot be undone.`}
                confirmText="Delete Salesman"
                cancelText="Cancel"
                type="danger"
                loading={isDeleting}
            />
        </div>
    )
}
