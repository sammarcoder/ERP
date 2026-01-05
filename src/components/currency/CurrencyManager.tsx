// 'use client'
// import React, { useState } from 'react'
// import {
//     useGetCurrenciesQuery,
//     useCreateCurrencyMutation,
//     useUpdateCurrencyMutation,
//     useDeleteCurrencyMutation
// } from '@/store/slice/currencySlice'
// import { Currency } from '@/types/currency'
// import { Button } from '../ui/Button'
// import { Input } from '../ui/Input'
// import { Loading } from '../ui/Loading'
// import { Modal } from '../ui/Modal'
// import { ConfirmationModal } from '../common/ConfirmationModal'

// export const CurrencyManager: React.FC = () => {
//     const [showCreateModal, setShowCreateModal] = useState(false)
//     const [editModal, setEditModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })
//     const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })

//     // Form state
//     const [currencyName, setCurrencyName] = useState('')
//     const [error, setError] = useState('')

//     // RTK Query hooks
//     const { data: currencies = [], isLoading, error: fetchError } = useGetCurrenciesQuery()
//     const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation()
//     const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation()
//     const [deleteCurrency, { isLoading: isDeleting }] = useDeleteCurrencyMutation()

//     // Form validation
//     const validateForm = (name: string) => {
//         if (!name.trim()) {
//             setError('Currency name is required')
//             return false
//         }
//         if (name.length > 10) {
//             setError('Currency name must be 10 characters or less')
//             return false
//         }
//         setError('')
//         return true
//     }

//     const resetForm = () => {
//         setCurrencyName('')
//         setError('')
//     }

//     // Create currency
//     const handleCreate = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!validateForm(currencyName)) return

//         try {
//             await createCurrency({ currencyName: currencyName.trim() }).unwrap()
//             setShowCreateModal(false)
//             resetForm()
//         } catch (err: any) {
//             setError(err?.data?.error || 'Failed to create currency')
//         }
//     }

//     // Edit currency
//     const handleEditClick = (currency: Currency) => {
//         setCurrencyName(currency.currencyName)
//         setEditModal({ isOpen: true, currency })
//     }

//     const handleUpdate = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!editModal.currency || !validateForm(currencyName)) return

//         try {
//             await updateCurrency({
//                 id: editModal.currency.id,
//                 currencyName: currencyName.trim()
//             }).unwrap()
//             setEditModal({ isOpen: false })
//             resetForm()
//         } catch (err: any) {
//             setError(err?.data?.error || 'Failed to update currency')
//         }
//     }

//     // Delete currency
//     const handleDeleteClick = (currency: Currency) => {
//         setConfirmModal({ isOpen: true, currency })
//     }

//     const handleConfirmDelete = async () => {
//         if (!confirmModal.currency) return

//         try {
//             await deleteCurrency(confirmModal.currency.id).unwrap()
//             setConfirmModal({ isOpen: false })
//         } catch (err) {
//             console.error('Failed to delete currency:', err)
//         }
//     }

//     if (isLoading) {
//         return <Loading size="lg" text="Loading Currencies..." />
//     }

//     if (fetchError) {
//         return (
//             <div className="max-w-4xl mx-auto p-6">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//                     <p className="text-red-600">Failed to load currencies. Please try again.</p>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <div className="max-w-xl mx-auto px-4">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">
//                             Currency Management
//                         </h1>
//                         <p className="text-gray-600 mt-2">
//                             Manage your currencies ({currencies.length} total)
//                         </p>
//                     </div>
//                     <Button onClick={() => setShowCreateModal(true)}>
//                         Add New Currency
//                     </Button>
//                 </div>

//                 {/* Currencies Grid */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="px-6 py-4 border-b border-gray-200">
//                         <h2 className="text-lg font-medium text-gray-900">
//                             Currencies
//                         </h2>
//                     </div>

//                     {currencies.length === 0 ? (
//                         <div className="p-8 text-center text-gray-500">
//                             No currencies found. Create your first currency above.
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 gap-6">
//                             {currencies.map((currency) => (
//                                 <div key={currency.id} className="bg-gray-50 flex justify-between items-center px-6 p-1 border border-gray-200 hover:shadow-md transition-shadow">
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center space-x-3 ">
//                                             <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//                                                 <span className="text-yellow-600 font-bold text-lg">
//                                                     {currency.currencyName.charAt(0).toUpperCase()}
//                                                 </span>
//                                             </div>

//                                             <div>
//                                                 <h3 className="text-lg font-semibold text-gray-900">
//                                                     {currency.currencyName}
//                                                 </h3>
//                                                 {/* <p className="text-sm text-gray-500">
//                                                     ID: {currency.id}
//                                                 </p>
//                                                 {currency.createdAt && (
//                                                     <p className="text-xs text-gray-400 mt-1">
//                                                         Created: {new Date(currency.createdAt).toLocaleDateString()}
//                                                     </p>
//                                                 )} */}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center space-x-2 mt-4">
//                                         <Button
//                                             variant="secondary"
//                                             onClick={() => handleEditClick(currency)}
//                                             className="flex-1"
//                                         >
//                                             Edit
//                                         </Button>
//                                         <Button
//                                             variant="danger"
//                                             onClick={() => handleDeleteClick(currency)}
//                                             className="flex-1"
//                                         >
//                                             Delete
//                                         </Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Create Modal */}
//                 <Modal
//                     isOpen={showCreateModal}
//                     onClose={() => {
//                         setShowCreateModal(false)
//                         resetForm()
//                     }}
//                     title="Add New Currency"
//                 >
//                     <form onSubmit={handleCreate} className="space-y-4">
//                         <Input
//                             label="Currency Name"
//                             value={currencyName}
//                             onChange={(e) => setCurrencyName(e.target.value)}
//                             placeholder="Enter currency name (e.g., USD, EUR, PKR)"
//                             error={error}
//                             maxLength={10}
//                             helperText="Maximum 10 characters allowed"
//                             autoFocus
//                         />

//                         <div className="flex space-x-3 pt-4">
//                             <Button
//                                 type="submit"
//                                 loading={isCreating}
//                                 disabled={!currencyName.trim()}
//                                 className="flex-1"
//                             >
//                                 Create Currency
//                             </Button>
//                             <Button
//                                 type="button"
//                                 variant="secondary"
//                                 onClick={() => {
//                                     setShowCreateModal(false)
//                                     resetForm()
//                                 }}
//                                 className="flex-1"
//                             >
//                                 Cancel
//                             </Button>
//                         </div>
//                     </form>
//                 </Modal>

//                 {/* Edit Modal */}
//                 <Modal
//                     isOpen={editModal.isOpen}
//                     onClose={() => {
//                         setEditModal({ isOpen: false })
//                         resetForm()
//                     }}
//                     title="Edit Currency"
//                 >
//                     <form onSubmit={handleUpdate} className="space-y-4">
//                         <Input
//                             label="Currency Name"
//                             value={currencyName}
//                             onChange={(e) => setCurrencyName(e.target.value)}
//                             placeholder="Enter currency name"
//                             error={error}
//                             maxLength={10}
//                             helperText="Maximum 10 characters allowed"
//                             autoFocus
//                         />

//                         <div className="flex space-x-3 pt-4">
//                             <Button
//                                 type="submit"
//                                 loading={isUpdating}
//                                 disabled={!currencyName.trim()}
//                                 className="flex-1"
//                             >
//                                 Update Currency
//                             </Button>
//                             <Button
//                                 type="button"
//                                 variant="secondary"
//                                 onClick={() => {
//                                     setEditModal({ isOpen: false })
//                                     resetForm()
//                                 }}
//                                 className="flex-1"
//                             >
//                                 Cancel
//                             </Button>
//                         </div>
//                     </form>
//                 </Modal>

//                 {/* Delete Confirmation Modal */}
//                 <ConfirmationModal
//                     isOpen={confirmModal.isOpen}
//                     onClose={() => setConfirmModal({ isOpen: false })}
//                     onConfirm={handleConfirmDelete}
//                     title="Delete Currency"
//                     message={`Are you sure you want to delete "${confirmModal.currency?.currencyName}"? This action cannot be undone.`}
//                     confirmText="Delete Currency"
//                     cancelText="Cancel"
//                     type="danger"
//                     loading={isDeleting}
//                 />
//             </div>
//         </div>
//     )
// }




















































// 'use client'
// import React, { useState } from 'react'
// import {
//     useGetCurrenciesQuery,
//     useCreateCurrencyMutation,
//     useUpdateCurrencyMutation,
//     useDeleteCurrencyMutation
// } from '@/store/slice/currencySlice'
// import { Currency } from '@/types/currency'
// import { Button } from '../ui/Button'
// import { Input } from '../ui/Input'
// import { Loading } from '../ui/Loading'
// import { Modal } from '../ui/Modal'
// import { ConfirmationModal } from '../common/ConfirmationModal'
// import { usePermissions } from '@/hooks/usePermissions'

// export const CurrencyManager: React.FC = () => {
//     // ✅ Add RBAC permissions with additional debug data
//     const {
//         canReadCurrency,
//         canWriteCurrency,
//         canDeleteCurrency,
//         isAuthenticated,
//         isLoading: authLoading,
//         permissions, // ✅ Add for debugging
//         roles        // ✅ Add for debugging
//     } = usePermissions()

//     const [showCreateModal, setShowCreateModal] = useState(false)
//     const [editModal, setEditModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })
//     const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })

//     // Form state
//     const [currencyName, setCurrencyName] = useState('')
//     const [error, setError] = useState('')

//     // ✅ Add render-time debug logging
//     console.log('=== CurrencyManager Render Debug ===');
//     console.log('authLoading:', authLoading);
//     console.log('isAuthenticated:', isAuthenticated);
//     console.log('permissions:', permissions);
//     console.log('roles:', roles);
//     console.log('canReadCurrency:', canReadCurrency);
//     console.log('canWriteCurrency:', canWriteCurrency);
//     console.log('canDeleteCurrency:', canDeleteCurrency);
//     console.log('=======================================');

//     // ✅ Wait for permissions to load OR allow access if we have any permissions
//     const hasPermissions = permissions.length > 0;
//     const shouldAllowAccess = hasPermissions && canReadCurrency;

//     // RTK Query hooks - ✅ Only skip if we know for sure user can't read
//     const {
//         data: currencies = [],
//         isLoading,
//         error: fetchError
//     } = useGetCurrenciesQuery(undefined, {
//         skip: !isAuthenticated || (!authLoading && !shouldAllowAccess)
//     })

//     const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation()
//     const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation()
//     const [deleteCurrency, { isLoading: isDeleting }] = useDeleteCurrencyMutation()

//     // Form validation
//     const validateForm = (name: string) => {
//         if (!name.trim()) {
//             setError('Currency name is required')
//             return false
//         }
//         if (name.length > 10) {
//             setError('Currency name must be 10 characters or less')
//             return false
//         }
//         setError('')
//         return true
//     }

//     const resetForm = () => {
//         setCurrencyName('')
//         setError('')
//     }

//     // Create currency
//     const handleCreate = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!canWriteCurrency) {
//             setError('You do not have permission to create currencies')
//             return
//         }
//         if (!validateForm(currencyName)) return

//         try {
//             await createCurrency({ currencyName: currencyName.trim() }).unwrap()
//             setShowCreateModal(false)
//             resetForm()
//         } catch (err: any) {
//             const errorMessage = err?.data?.message || err?.message || 'Failed to create currency'
//             if (errorMessage.includes('Insufficient scope') || errorMessage.includes('UnauthorizedError')) {
//                 setError('You do not have permission to create currencies')
//             } else {
//                 setError(errorMessage)
//             }
//         }
//     }

//     // Edit currency
//     const handleEditClick = (currency: Currency) => {
//         if (!canWriteCurrency) {
//             setError('You do not have permission to edit currencies')
//             return
//         }
//         setCurrencyName(currency.currencyName)
//         setEditModal({ isOpen: true, currency })
//     }

//     const handleUpdate = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!canWriteCurrency) {
//             setError('You do not have permission to update currencies')
//             return
//         }
//         if (!editModal.currency || !validateForm(currencyName)) return

//         try {
//             await updateCurrency({
//                 id: editModal.currency.id,
//                 currencyName: currencyName.trim()
//             }).unwrap()
//             setEditModal({ isOpen: false })
//             resetForm()
//         } catch (err: any) {
//             const errorMessage = err?.data?.message || err?.message || 'Failed to update currency'
//             if (errorMessage.includes('Insufficient scope') || errorMessage.includes('UnauthorizedError')) {
//                 setError('You do not have permission to update currencies')
//             } else {
//                 setError(errorMessage)
//             }
//         }
//     }

//     // Delete currency
//     const handleDeleteClick = (currency: Currency) => {
//         if (!canDeleteCurrency) {
//             setError('You do not have permission to delete currencies')
//             return
//         }
//         setConfirmModal({ isOpen: true, currency })
//     }

//     const handleConfirmDelete = async () => {
//         if (!canDeleteCurrency) {
//             console.error('No permission to delete')
//             return
//         }
//         if (!confirmModal.currency) return

//         try {
//             await deleteCurrency(confirmModal.currency.id).unwrap()
//             setConfirmModal({ isOpen: false })
//         } catch (err: any) {
//             const errorMessage = err?.data?.message || err?.message || 'Failed to delete currency'
//             console.error('Delete failed:', errorMessage)
//         }
//     }

//     // ✅ Loading state - wait for auth AND permissions
//     if (authLoading) {
//         return <Loading size="lg" text="Loading permissions..." />
//     }

//     // ✅ Authentication check
//     if (!isAuthenticated) {
//         return (
//             <div className="min-h-screen bg-gray-50 py-8">
//                 <div className="max-w-xl mx-auto px-4">
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
//                         <h2 className="text-xl font-semibold text-blue-800 mb-2">
//                             Authentication Required
//                         </h2>
//                         <p className="text-blue-600">
//                             Please log in to access currency management.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     // ✅ Permission check - only deny if we have loaded permissions and user doesn't have access
//     if (hasPermissions && !canReadCurrency) {
//         return (
//             <div className="min-h-screen bg-gray-50 py-8">
//                 <div className="max-w-xl mx-auto px-4">
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//                         <h2 className="text-xl font-semibold text-red-800 mb-2">
//                             Access Denied
//                         </h2>
//                         <p className="text-red-600">
//                             You don't have permission to view currencies.
//                         </p>
//                         <p className="text-sm text-red-500 mt-2">
//                             Required permission: <code>currency:read</code>
//                         </p>
//                         <div className="mt-3 text-xs text-red-400">
//                             <p>Your permissions: {JSON.stringify(permissions)}</p>
//                             <p>Your roles: {JSON.stringify(roles)}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     // ✅ If no permissions loaded yet, show loading
//     if (!hasPermissions) {
//         return <Loading size="lg" text="Loading user permissions..." />
//     }

//     if (isLoading) {
//         return <Loading size="lg" text="Loading Currencies..." />
//     }

//     if (fetchError) {
//         const error = fetchError as any
//         const isPermissionError = error?.data?.error?.includes('Insufficient scope') ||
//             error?.data?.error?.includes('UnauthorizedError') ||
//             error?.status === 403

//         return (
//             <div className="max-w-4xl mx-auto p-6">
//                 <div className="border rounded-lg p-4 text-center bg-red-50 border-red-200">
//                     <p className="text-red-600">
//                         {isPermissionError
//                             ? 'You do not have permission to access currencies.'
//                             : 'Failed to load currencies. Please try again.'
//                         }
//                     </p>
//                     {isPermissionError && (
//                         <p className="text-sm text-red-500 mt-1">
//                             Required permission: <code>currency:read</code>
//                         </p>
//                     )}
//                     <div className="mt-2 text-xs text-red-400">
//                         <p>Debug - API Error: {JSON.stringify(error)}</p>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <div className="max-w-xl mx-auto px-4">
//                 {/* ✅ Debug info for development */}
//                 {process.env.NODE_ENV === 'development' && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-xs">
//                         <p><strong>Debug Info:</strong></p>
//                         <p>Permissions: {JSON.stringify(permissions)}</p>
//                         <p>Roles: {JSON.stringify(roles)}</p>
//                         <p>Can Read: {canReadCurrency ? 'YES' : 'NO'}</p>
//                         <p>Can Write: {canWriteCurrency ? 'YES' : 'NO'}</p>
//                         <p>Can Delete: {canDeleteCurrency ? 'YES' : 'NO'}</p>
                      
//                     </div>
//                 )}

//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">
//                             Currency Management
//                         </h1>
//                         <p className="text-gray-600 mt-2">
//                             Manage your currencies ({currencies.length} total)
//                         </p>

//                         {/* Permission indicators */}
//                         <div className="flex gap-2 mt-2">
//                             {canReadCurrency && (
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                     ✓ Read
//                                 </span>
//                             )}
//                             {canWriteCurrency && (
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                     ✓ Write
//                                 </span>
//                             )}
//                             {canDeleteCurrency && (
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                     ✓ Delete
//                                 </span>
//                             )}
//                         </div>
//                     </div>

//                     {/* Show button only if user can write */}
//                     {canWriteCurrency && (
//                         <Button onClick={() => setShowCreateModal(true)}>
//                             Add New Currency
//                         </Button>
//                     )}
//                 </div>

//                 {/* Show permission message if can't write */}
//                 {!canWriteCurrency && hasPermissions && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
//                         <p className="text-sm text-yellow-800">
//                             ℹ️ You have read-only access. Contact administrator for write permissions.
//                         </p>
//                     </div>
//                 )}

//                 {/* Currencies Grid */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="px-6 py-4 border-b border-gray-200">
//                         <h2 className="text-lg font-medium text-gray-900">
//                             Currencies
//                         </h2>
//                     </div>

//                     {currencies.length === 0 ? (
//                         <div className="p-8 text-center text-gray-500">
//                             No currencies found.
//                             {canWriteCurrency && ' Create your first currency above.'}
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 gap-6">
//                             {currencies.map((currency) => (
//                                 <div key={currency.id} className="bg-gray-50 flex justify-between items-center px-6 p-1 border border-gray-200 hover:shadow-md transition-shadow">
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center space-x-3">
//                                             <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//                                                 <span className="text-yellow-600 font-bold text-lg">
//                                                     {currency.currencyName.charAt(0).toUpperCase()}
//                                                 </span>
//                                             </div>
//                                             <div>
//                                                 <h3 className="text-lg font-semibold text-gray-900">
//                                                     {currency.currencyName}
//                                                 </h3>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center space-x-2 mt-4">
//                                         {/* Show edit only if user can write */}
//                                         {canWriteCurrency && (
//                                             <Button
//                                                 variant="secondary"
//                                                 onClick={() => handleEditClick(currency)}
//                                                 className="flex-1"
//                                             >
//                                                 Edit
//                                             </Button>
//                                         )}

//                                         {/* Show delete only if user can delete */}
//                                         {canDeleteCurrency && (
//                                             <Button
//                                                 variant="danger"
//                                                 onClick={() => handleDeleteClick(currency)}
//                                                 className="flex-1"
//                                             >
//                                                 Delete
//                                             </Button>
//                                         )}

//                                         {/* Show message if no actions available */}
//                                         {!canWriteCurrency && !canDeleteCurrency && (
//                                             <span className="text-sm text-gray-500 italic">
//                                                 Read-only access
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Create Modal - Only render if user can write */}
//                 {canWriteCurrency && (
//                     <Modal
//                         isOpen={showCreateModal}
//                         onClose={() => {
//                             setShowCreateModal(false)
//                             resetForm()
//                         }}
//                         title="Add New Currency"
//                     >
//                         <form onSubmit={handleCreate} className="space-y-4">
//                             <Input
//                                 label="Currency Name"
//                                 value={currencyName}
//                                 onChange={(e) => setCurrencyName(e.target.value)}
//                                 placeholder="Enter currency name (e.g., USD, EUR, PKR)"
//                                 error={error}
//                                 maxLength={10}
//                                 helperText="Maximum 10 characters allowed"
//                                 autoFocus
//                             />

//                             <div className="flex space-x-3 pt-4">
//                                 <Button
//                                     type="submit"
//                                     loading={isCreating}
//                                     disabled={!currencyName.trim()}
//                                     className="flex-1"
//                                 >
//                                     Create Currency
//                                 </Button>
//                                 <Button
//                                     type="button"
//                                     variant="secondary"
//                                     onClick={() => {
//                                         setShowCreateModal(false)
//                                         resetForm()
//                                     }}
//                                     className="flex-1"
//                                 >
//                                     Cancel
//                                 </Button>
//                             </div>
//                         </form>
//                     </Modal>
//                 )}

//                 {/* Edit Modal - Only render if user can write */}
//                 {canWriteCurrency && (
//                     <Modal
//                         isOpen={editModal.isOpen}
//                         onClose={() => {
//                             setEditModal({ isOpen: false })
//                             resetForm()
//                         }}
//                         title="Edit Currency"
//                     >
//                         <form onSubmit={handleUpdate} className="space-y-4">
//                             <Input
//                                 label="Currency Name"
//                                 value={currencyName}
//                                 onChange={(e) => setCurrencyName(e.target.value)}
//                                 placeholder="Enter currency name"
//                                 error={error}
//                                 maxLength={10}
//                                 helperText="Maximum 10 characters allowed"
//                                 autoFocus
//                             />

//                             <div className="flex space-x-3 pt-4">
//                                 <Button
//                                     type="submit"
//                                     loading={isUpdating}
//                                     disabled={!currencyName.trim()}
//                                     className="flex-1"
//                                 >
//                                     Update Currency
//                                 </Button>
//                                 <Button
//                                     type="button"
//                                     variant="secondary"
//                                     onClick={() => {
//                                         setEditModal({ isOpen: false })
//                                         resetForm()
//                                     }}
//                                     className="flex-1"
//                                 >
//                                     Cancel
//                                 </Button>
//                             </div>
//                         </form>
//                     </Modal>
//                 )}

//                 {/* Delete Confirmation Modal - Only render if user can delete */}
//                 {canDeleteCurrency && (
//                     <ConfirmationModal
//                         isOpen={confirmModal.isOpen}
//                         onClose={() => setConfirmModal({ isOpen: false })}
//                         onConfirm={handleConfirmDelete}
//                         title="Delete Currency"
//                         message={`Are you sure you want to delete "${confirmModal.currency?.currencyName}"? This action cannot be undone.`}
//                         confirmText="Delete Currency"
//                         cancelText="Cancel"
//                         type="danger"
//                         loading={isDeleting}
//                     />
//                 )}
//             </div>
//         </div>
//     )
// }






















'use client'
import React, { useState } from 'react'
import {
    useGetCurrenciesQuery,
    useCreateCurrencyMutation,
    useUpdateCurrencyMutation,
    useDeleteCurrencyMutation
} from '@/store/slice/currencySlice'
import { Currency } from '@/types/currency'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { Modal } from '../ui/Modal'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { usePermissions } from '@/hooks/keycloack/usePermissions'

export const CurrencyManager: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editModal, setEditModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; currency?: Currency }>({ isOpen: false })

    // Form state
    const [currencyName, setCurrencyName] = useState('')
    const [error, setError] = useState('')

    // Permission hooks
    const { hasPermission, userRoles } = usePermissions()
    const canRead = hasPermission('currency:read')
    const canWrite = hasPermission('currency:write')
    const canDelete = hasPermission('currency:delete')

    // RTK Query hooks
    const { data: currencies = [], isLoading, error: fetchError } = useGetCurrenciesQuery()
    const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation()
    const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation()
    const [deleteCurrency, { isLoading: isDeleting }] = useDeleteCurrencyMutation()

    // Form validation
    const validateForm = (name: string) => {
        if (!name.trim()) {
            setError('Currency name is required')
            return false
        }
        if (name.length > 10) {
            setError('Currency name must be 10 characters or less')
            return false
        }
        setError('')
        return true
    }

    const resetForm = () => {
        setCurrencyName('')
        setError('')
    }

    // Create currency
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm(currencyName)) return

        try {
            await createCurrency({ currencyName: currencyName.trim() }).unwrap()
            setShowCreateModal(false)
            resetForm()
        } catch (err: any) {
            setError(err?.data?.error || 'Failed to create currency')
        }
    }

    // Edit currency
    const handleEditClick = (currency: Currency) => {
        setCurrencyName(currency.currencyName)
        setEditModal({ isOpen: true, currency })
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editModal.currency || !validateForm(currencyName)) return

        try {
            await updateCurrency({
                id: editModal.currency.id,
                currencyName: currencyName.trim()
            }).unwrap()
            setEditModal({ isOpen: false })
            resetForm()
        } catch (err: any) {
            setError(err?.data?.error || 'Failed to update currency')
        }
    }

    // Delete currency
    const handleDeleteClick = (currency: Currency) => {
        setConfirmModal({ isOpen: true, currency })
    }

    const handleConfirmDelete = async () => {
        if (!confirmModal.currency) return

        try {
            await deleteCurrency(confirmModal.currency.id).unwrap()
            setConfirmModal({ isOpen: false })
        } catch (err) {
            console.error('Failed to delete currency:', err)
        }
    }

    // Permission check - deny access if can't read
    if (!canRead) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
                        <p className="text-red-600 mb-4">You don't have permission to view currencies.</p>
                        <p className="text-red-500 text-sm">Your roles: {userRoles.join(', ')}</p>
                        <p className="text-red-500 text-sm mt-2">Required permission: currency:read</p>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <Loading size="lg" text="Loading Currencies..." />
    }

    if (fetchError) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">Failed to load currencies. Please try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Currency Management
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your currencies ({currencies.length} total)
                        </p>
                    </div>
                    {/* Only show Add button if user has write permission */}
                    {canWrite && (
                        <Button onClick={() => setShowCreateModal(true)}>
                            Add New Currency
                        </Button>
                    )}
                </div>

                {/* Permission Info - Debug (you can remove this later) */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Your Permissions:</h3>
                    <div className="text-sm text-blue-800">
                        <p>✅ Read: {canRead ? 'Yes' : 'No'}</p>
                        <p>📝 Write: {canWrite ? 'Yes' : 'No'}</p>
                        <p>🗑️ Delete: {canDelete ? 'Yes' : 'No'}</p>
                        <p className="mt-2 text-blue-600">Roles: {userRoles.join(', ')}</p>
                    </div>
                </div>

                {/* Currencies Grid */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">
                            Currencies
                        </h2>
                    </div>

                    {currencies.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No currencies found. 
                            {canWrite ? ' Create your first currency above.' : ' Contact admin to add currencies.'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {currencies.map((currency) => (
                                <div key={currency.id} className="bg-gray-50 flex justify-between items-center px-6 p-1 border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 ">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                <span className="text-yellow-600 font-bold text-lg">
                                                    {currency.currencyName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {currency.currencyName}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Only show action buttons if user has permissions */}
                                    {(canWrite || canDelete) && (
                                        <div className="flex items-center space-x-2 mt-4">
                                            {canWrite && (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleEditClick(currency)}
                                                    className="flex-1"
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteClick(currency)}
                                                    className="flex-1"
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Modal - Only render if user can write */}
                {canWrite && (
                    <Modal
                        isOpen={showCreateModal}
                        onClose={() => {
                            setShowCreateModal(false)
                            resetForm()
                        }}
                        title="Add New Currency"
                    >
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input
                                label="Currency Name"
                                value={currencyName}
                                onChange={(e) => setCurrencyName(e.target.value)}
                                placeholder="Enter currency name (e.g., USD, EUR, PKR)"
                                error={error}
                                maxLength={10}
                                helperText="Maximum 10 characters allowed"
                                autoFocus
                            />

                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="submit"
                                    loading={isCreating}
                                    disabled={!currencyName.trim()}
                                    className="flex-1"
                                >
                                    Create Currency
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
                )}

                {/* Edit Modal - Only render if user can write */}
                {canWrite && (
                    <Modal
                        isOpen={editModal.isOpen}
                        onClose={() => {
                            setEditModal({ isOpen: false })
                            resetForm()
                        }}
                        title="Edit Currency"
                    >
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <Input
                                label="Currency Name"
                                value={currencyName}
                                onChange={(e) => setCurrencyName(e.target.value)}
                                placeholder="Enter currency name"
                                error={error}
                                maxLength={10}
                                helperText="Maximum 10 characters allowed"
                                autoFocus
                            />

                            <div className="flex space-x-3 pt-4">
                                <Button
                                    type="submit"
                                    loading={isUpdating}
                                    disabled={!currencyName.trim()}
                                    className="flex-1"
                                >
                                    Update Currency
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
                )}

                {/* Delete Confirmation Modal - Only render if user can delete */}
                {canDelete && (
                    <ConfirmationModal
                        isOpen={confirmModal.isOpen}
                        onClose={() => setConfirmModal({ isOpen: false })}
                        onConfirm={handleConfirmDelete}
                        title="Delete Currency"
                        message={`Are you sure you want to delete "${confirmModal.currency?.currencyName}"? This action cannot be undone.`}
                        confirmText="Delete Currency"
                        cancelText="Cancel"
                        type="danger"
                        loading={isDeleting}
                    />
                )}
            </div>
        </div>
    )
}
