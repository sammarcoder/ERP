// 'use client'
// import React, { useState, useMemo } from 'react'
// import {
//   useGetItemClassesQuery,
//   useCreateItemClassMutation,
//   useUpdateItemClassMutation,
//   useDeleteItemClassMutation
// } from '@/store/slice/itemsClassSlice'
// import { ItemClass } from '@/types/itemsClass'
// import { Button } from '../ui/Button'
// import { Input } from '../ui/Input'
// import { Loading } from '../ui/Loading'
// import { Modal } from '../ui/Modal'
// import { ConfirmationModal } from '../common/ConfirmationModal'

// export const ItemClassManager: React.FC = () => {
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [editModal, setEditModal] = useState<{ isOpen: boolean; itemClass?: ItemClass }>({ isOpen: false })
//   const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; itemClass?: ItemClass }>({ isOpen: false })

//   // Form state - matching your original structure
//   const [formData, setFormData] = useState({
//     zHead2: '',
//     zHead1Id: null as number | null
//   })

//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')

//   // 🔍 NEW: Search state
//   const [searchTerm, setSearchTerm] = useState('')

//   // Static options like your original component
//   const classOptions = [1, 2, 3, 4]

//   // RTK Query hooks
//   const { data: itemClasses = [], isLoading, error } = useGetItemClassesQuery()
//   const [createItemClass] = useCreateItemClassMutation()
//   const [updateItemClass] = useUpdateItemClassMutation()
//   const [deleteItemClass, { isLoading: isDeleting }] = useDeleteItemClassMutation()

//   // 🔍 NEW: Filtered items based on search
//   const filteredItemClasses = useMemo(() => {
//     if (!searchTerm.trim()) return itemClasses

//     return itemClasses.filter(itemClass =>
//       itemClass.zHead2.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       itemClass["Control-Head-2"]?.zHead1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       itemClass.zHead1Id.toString().includes(searchTerm) ||
//       itemClass.id.toString().includes(searchTerm)
//     )
//   }, [itemClasses, searchTerm])

//   // Form handler - matching your original logic
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target

//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'zHead1Id' ? (value ? Number(value) : null) : value
//     }))

//     // Clear message when user starts typing
//     if (message) setMessage('')
//   }

//   const resetForm = () => {
//     setFormData({ zHead2: '', zHead1Id: null })
//     setMessage('')
//   }

//   // 🔍 NEW: Clear search
//   const clearSearch = () => {
//     setSearchTerm('')
//   }

//   // Create - matching your original submit logic
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.zHead1Id || !formData.zHead2) {
//       setMessage('Please fill all fields')
//       return
//     }

//     try {
//       setLoading(true)
//       setMessage('')

//       await createItemClass({
//         zHead2: formData.zHead2.trim(),
//         zHead1Id: formData.zHead1Id
//       }).unwrap()

//       setMessage('Data saved successfully!')
//       setFormData({ zHead2: '', zHead1Id: null })
//       setShowCreateModal(false)

//     } catch (err) {
//       console.error('Error:', err)
//       setMessage('Error: Failed to save data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Edit
//   const handleEditClick = (itemClass: ItemClass) => {
//     setFormData({
//       zHead2: itemClass.zHead2,
//       zHead1Id: itemClass.zHead1Id
//     })
//     setEditModal({ isOpen: true, itemClass })
//     setMessage('')
//   }

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!editModal.itemClass || !formData.zHead1Id || !formData.zHead2) {
//       setMessage('Please fill all fields')
//       return
//     }

//     try {
//       setLoading(true)
//       setMessage('')

//       await updateItemClass({
//         id: editModal.itemClass.id,
//         zHead2: formData.zHead2.trim(),
//         zHead1Id: formData.zHead1Id
//       }).unwrap()

//       setMessage('Data updated successfully!')
//       setEditModal({ isOpen: false })
//       resetForm()

//     } catch (err) {
//       console.error('Error:', err)
//       setMessage('Error: Failed to update data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Delete
//   const handleDeleteClick = (itemClass: ItemClass) => {
//     setConfirmModal({ isOpen: true, itemClass })
//   }

//   const handleConfirmDelete = async () => {
//     if (!confirmModal.itemClass) return

//     try {
//       await deleteItemClass(confirmModal.itemClass.id).unwrap()
//       setConfirmModal({ isOpen: false })
//     } catch (err) {
//       console.error('Failed to delete:', err)
//     }
//   }

//   if (isLoading) {
//     return <Loading size="lg" text="Loading Control Head 2s..." />
//   }

//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//           <p className="text-red-600">Failed to load control head 2s. Please try again.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-3 space-y-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-900">
//             Control Head 2 Management
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Manage control head 2 records ({itemClasses.length} total)
//             {searchTerm && (
//               <span className="text-blue-600">
//                 {' '}• {filteredItemClasses.length} filtered results
//               </span>
//             )}
//           </p>
//         </div>

//       </div>

//       {/* 🔍 NEW: Search Bar */}
//       <div className="">
//         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//           <div className="flex justify-between w-full">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by Control Head 2 name, Parent name, or ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <Button onClick={() => setShowCreateModal(true)}>
//               Add New Control Head 2
//             </Button>
//           </div>


//           {searchTerm && (
//             <Button
//               variant="secondary"
//               onClick={clearSearch}
//               className="flex items-center space-x-2"
//             >
//               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//               <span>Clear</span>
//             </Button>
//           )}
//         </div>

//         {searchTerm && (
//           <div className="mt-3 text-sm text-gray-600">
//             <span className="font-medium">{filteredItemClasses.length}</span> results found for
//             <span className="font-medium text-blue-600"> "{searchTerm}"</span>
//           </div>
//         )}
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">
//             Control Head 2 Records
//           </h2>
//         </div>

//         {filteredItemClasses.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             {searchTerm ? (
//               <div>
//                 <p className="text-lg mb-2">No results found for "{searchTerm}"</p>
//                 <p className="text-sm">Try adjusting your search terms or clear the search to see all records.</p>
//                 <Button
//                   variant="secondary"
//                   onClick={clearSearch}
//                   className="mt-4"
//                 >
//                   Clear Search
//                 </Button>
//               </div>
//             ) : (
//               'No control head 2 records found. Add your first record above.'
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Control Head 2
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Parent (Control Head 1)
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredItemClasses.map((itemClass) => (
//                   <tr key={itemClass.id} className="hover:bg-gray-50 transition-colors">
//                     {/* Control Head 2 Column */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-green-600 font-semibold text-sm">
//                             {itemClass.id}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {/* 🔍 Highlight search term */}
//                             {searchTerm ? (
//                               <span dangerouslySetInnerHTML={{
//                                 __html: itemClass.zHead2.replace(
//                                   new RegExp(`(${searchTerm})`, 'gi'),
//                                   '<mark class="bg-yellow-200">$1</mark>'
//                                 )
//                               }} />
//                             ) : (
//                               itemClass.zHead2
//                             )}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             ID: {itemClass.id}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Parent Control Head 1 Column */}
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {/* 🔍 Highlight search term in parent name */}
//                         {searchTerm && itemClass["Control-Head-2"]?.zHead1 ? (
//                           <span dangerouslySetInnerHTML={{
//                             __html: itemClass["Control-Head-2"].zHead1.replace(
//                               new RegExp(`(${searchTerm})`, 'gi'),
//                               '<mark class="bg-yellow-200">$1</mark>'
//                             )
//                           }} />
//                         ) : (
//                           itemClass["Control-Head-2"]?.zHead1 || `Head1 ID: ${itemClass.zHead1Id}`
//                         )}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Parent ID: {itemClass.zHead1Id}
//                       </div>
//                     </td>

//                     {/* Actions Column */}
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex items-center justify-end space-x-2">
//                         <Button
//                           variant="secondary"
//                           onClick={() => handleEditClick(itemClass)}
//                           className="px-3 py-1 text-xs"
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="danger"
//                           onClick={() => handleDeleteClick(itemClass)}
//                           className="px-3 py-1 text-xs"
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Your existing modals remain the same... */}
//       {/* Create Modal */}
//       <Modal
//         isOpen={showCreateModal}
//         onClose={() => {
//           setShowCreateModal(false)
//           resetForm()
//         }}
//         title="Add New Control Head 2"
//       >
//         {/* Your existing create form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Control Head 1 ID <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="zHead1Id"
//               value={formData.zHead1Id ?? ''}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Control Head 1</option>
//               {classOptions.map(id => (
//                 <option key={id} value={id}>
//                   {id}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Control Head 2 Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="zHead2"
//               value={formData.zHead2}
//               onChange={handleChange}
//               placeholder="Enter Control Head 2 name"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
//               ${loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//           >
//             {loading ? 'Saving...' : 'Save Data'}
//           </button>
//         </form>

//         {message && (
//           <div className={`mt-4 p-3 rounded-md text-sm
//             ${message.includes('success')
//               ? 'bg-green-100 text-green-700'
//               : 'bg-red-100 text-red-700'
//             }`}
//           >
//             {message}
//           </div>
//         )}
//       </Modal>

//       {/* Edit Modal - Same as your existing code */}
//       <Modal
//         isOpen={editModal.isOpen}
//         onClose={() => {
//           setEditModal({ isOpen: false })
//           resetForm()
//         }}
//         title="Edit Control Head 2"
//       >
//         {/* Your existing edit form */}
//         <form onSubmit={handleUpdate} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Control Head 1 ID <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="zHead1Id"
//               value={formData.zHead1Id ?? ''}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Control Head 1</option>
//               {classOptions.map(id => (
//                 <option key={id} value={id}>
//                   {id}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Control Head 2 Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="zHead2"
//               value={formData.zHead2}
//               onChange={handleChange}
//               placeholder="Enter Control Head 2 name"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
//               ${loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//           >
//             {loading ? 'Updating...' : 'Update Data'}
//           </button>
//         </form>

//         {message && (
//           <div className={`mt-4 p-3 rounded-md text-sm
//             ${message.includes('success')
//               ? 'bg-green-100 text-green-700'
//               : 'bg-red-100 text-red-700'
//             }`}
//           >
//             {message}
//           </div>
//         )}
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         onClose={() => setConfirmModal({ isOpen: false })}
//         onConfirm={handleConfirmDelete}
//         title="Delete Control Head 2"
//         message={`Are you sure you want to delete "${confirmModal.itemClass?.zHead2}"? This action cannot be undone.`}
//         confirmText="Delete Record"
//         cancelText="Cancel"
//         type="danger"
//         loading={isDeleting}
//       />
//     </div>
//   )
// }





















































'use client'
import React, { useState, useMemo, useCallback } from 'react'
import {
  useGetItemClassesQuery,
  useCreateItemClassMutation,
  useUpdateItemClassMutation,
  useDeleteItemClassMutation
} from '@/store/slice/itemsClassSlice'
import { ItemClass } from '@/types/itemsClass'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Loading } from '../ui/Loading'
import { Modal } from '../ui/Modal'
import { ConfirmationModal } from '../common/ConfirmationModal'
import { Plus } from 'lucide-react'

type SortOption = 'head1' | 'head2' | null

export const ItemClassManager: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editModal, setEditModal] = useState<{ isOpen: boolean; itemClass?: ItemClass }>({ isOpen: false })
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; itemClass?: ItemClass }>({ isOpen: false })

  // Form state - same as original
  const [formData, setFormData] = useState({
    zHead2: '',
    zHead1Id: null as number | null
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>(null) // ✅ NEW: Sort state

  // Account types with names
  const accountTypes = [
    { id: 1, name: 'Assets' },
    { id: 2, name: 'Liability' },
    { id: 3, name: 'Revenue' },
    { id: 4, name: 'Expense' }
  ]

  // RTK Query hooks - same as original
  const { data: itemClasses = [], isLoading, error } = useGetItemClassesQuery()
  const [createItemClass] = useCreateItemClassMutation()
  const [updateItemClass] = useUpdateItemClassMutation()
  const [deleteItemClass, { isLoading: isDeleting }] = useDeleteItemClassMutation()

  // ✅ UPDATED: Filtered AND sorted items
  const processedItemClasses = useMemo(() => {
    // First apply search filter
    let filtered = itemClasses
    if (searchTerm.trim()) {
      filtered = itemClasses.filter(itemClass =>
        itemClass.zHead2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemClass["Control-Head-2"]?.zHead1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemClass.zHead1Id.toString().includes(searchTerm) ||
        itemClass.id.toString().includes(searchTerm)
      )
    }

    // Then apply sorting
    if (!sortBy) return filtered

    return [...filtered].sort((a, b) => {
      if (sortBy === 'head1') {
        // Sort by Control Head 1 (account type name) ascending
        const aName = accountTypes.find(t => t.id === a.zHead1Id)?.name || `ID: ${a.zHead1Id}`
        const bName = accountTypes.find(t => t.id === b.zHead1Id)?.name || `ID: ${b.zHead1Id}`
        return aName.localeCompare(bName)
      } else if (sortBy === 'head2') {
        // Sort by Control Head 2 name ascending
        return a.zHead2.localeCompare(b.zHead2)
      }
      return 0
    })
  }, [itemClasses, searchTerm, sortBy, accountTypes])

  // ✅ NEW: Sort handler
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(current => current === newSort ? null : newSort)
  }, [])

  // Original form handler - exactly the same
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: name === 'zHead1Id' ? (value ? Number(value) : null) : value
    }))

    if (message) setMessage('')
  }, [message])

  // All other original functions - exactly the same
  const resetForm = useCallback(() => {
    setFormData({ zHead2: '', zHead1Id: null })
    setMessage('')
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.zHead1Id || !formData.zHead2) {
      setMessage('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      await createItemClass({
        zHead2: formData.zHead2.trim(),
        zHead1Id: formData.zHead1Id
      }).unwrap()

      setMessage('Data saved successfully!')
      setFormData({ zHead2: '', zHead1Id: null })
      setShowCreateModal(false)

    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Failed to save data')
    } finally {
      setLoading(false)
    }
  }, [formData, createItemClass])

  const handleEditClick = useCallback((itemClass: ItemClass) => {
    setFormData({
      zHead2: itemClass.zHead2,
      zHead1Id: itemClass.zHead1Id
    })
    setEditModal({ isOpen: true, itemClass })
    setMessage('')
  }, [])

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editModal.itemClass || !formData.zHead1Id || !formData.zHead2) {
      setMessage('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      await updateItemClass({
        id: editModal.itemClass.id,
        zHead2: formData.zHead2.trim(),
        zHead1Id: formData.zHead1Id
      }).unwrap()

      setMessage('Data updated successfully!')
      setEditModal({ isOpen: false })
      resetForm()

    } catch (err) {
      console.error('Error:', err)
      setMessage('Error: Failed to update data')
    } finally {
      setLoading(false)
    }
  }, [editModal.itemClass, formData, updateItemClass, resetForm])

  const handleDeleteClick = useCallback((itemClass: ItemClass) => {
    setConfirmModal({ isOpen: true, itemClass })
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmModal.itemClass) return

    try {
      await deleteItemClass(confirmModal.itemClass.id).unwrap()
      setConfirmModal({ isOpen: false })
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }, [confirmModal.itemClass, deleteItemClass])

  if (isLoading) {
    return <Loading size="lg" text="Loading Control Head 2s..." />
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Failed to load control head 2s. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-3 space-y-4">
      {/* Header - same as original */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Control Head 2 Management
          </h1>
          
          {/* <p className="text-gray-600 mt-2">
            Manage control head 2 records ({itemClasses.length} total)
            {searchTerm && (
              <span className="text-blue-600">
                {' '}• {processedItemClasses.length} filtered results
              </span>
            )}
            {sortBy && (
              <span className="text-green-600">
                {' '}• Sorted by {sortBy === 'head1' ? 'Control Head 1' : 'Control Head 2'}
              </span>
            )}
          </p> */}
        </div>
      </div>

      {/* ✅ NEW: Sort Options */}
     
      {/* Search Bar - same as original */}
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
                placeholder="Search by Control Head 2 name, Parent name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-76 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>




 <div className="bg-gray-50 px-2 flex items-center  rounded-lg">
        <div className="flex items-center space-x-2">
          {/* <span className="text-sm font-medium text-gray-700">Sort by:</span> */}
            <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="sortOption"
              checked={sortBy === 'head2'}
              onChange={() => handleSortChange('head2')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">Control Head 2</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="sortOption"
              checked={sortBy === 'head1'}
              onChange={() => handleSortChange('head1')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">Control Head 1</span>
          </label>
          {sortBy && (
            <button
              onClick={() => setSortBy(null)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear Sort
            </button>
          )}
        </div>
      </div>




            <Button onClick={() => setShowCreateModal(true)}>
              Add  <Plus className='pl-1'/>
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
            <span className="font-medium">{processedItemClasses.length}</span> results found for
            <span className="font-medium text-blue-600"> "{searchTerm}"</span>
          </div>
        )}
      </div>

      {/* Table - same as original but using processedItemClasses */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Control Head 2 Records
          </h2>
        </div>

        {processedItemClasses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <p className="text-lg mb-2">No results found for "{searchTerm}"</p>
                <p className="text-sm">Try adjusting your search terms or clear the search to see all records.</p>
                {/* <Button variant="secondary" onClick={clearSearch} className="mt-4">
                  Clear Search
                </Button> */}
              </div>
            ) : (
              'No control head 2 records found. Add your first record above.'
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Control Head 2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Parent (Control Head 1)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedItemClasses.map((itemClass) => (
                  <tr key={itemClass.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-semibold text-sm">
                            {itemClass.id}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {searchTerm ? (
                              <span dangerouslySetInnerHTML={{
                                __html: itemClass.zHead2.replace(
                                  new RegExp(`(${searchTerm})`, 'gi'),
                                  '<mark class="bg-yellow-200">$1</mark>'
                                )
                              }} />
                            ) : (
                              itemClass.zHead2
                            )}
                          </div>
                          {/* <div className="text-sm text-gray-500">
                            ID: {itemClass.id}
                          </div> */}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {(() => {
                          const accountType = accountTypes.find(type => type.id === itemClass.zHead1Id)
                          const displayName = accountType ? `${accountType.id} - ${accountType.name}` : `Head1 ID: ${itemClass.zHead1Id}`
                          
                          return searchTerm ? (
                            <span dangerouslySetInnerHTML={{
                              __html: displayName.replace(
                                new RegExp(`(${searchTerm})`, 'gi'),
                                '<mark class="bg-yellow-200">$1</mark>'
                              )
                            }} />
                          ) : displayName
                        })()}
                      </div>
                      {/* <div className="text-sm text-gray-500">
                        Parent ID: {itemClass.zHead1Id}
                      </div> */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleEditClick(itemClass)}
                          className="px-3 py-1 text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteClick(itemClass)}
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
        )}
      </div>

      {/* Create Modal - updated to show account type names */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          resetForm()
        }}
        title="Add New Control Head 2"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Control Head 1 Type <span className="text-red-500">*</span>
            </label>
            <select
              name="zHead1Id"
              value={formData.zHead1Id ?? ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Control Head 1 Type</option>
              {accountTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.id} - {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Control Head 2 Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="zHead2"
              value={formData.zHead2}
              onChange={handleChange}
              placeholder="Enter Control Head 2 name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Data'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </Modal>

      {/* Edit Modal - updated to show account type names */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          setEditModal({ isOpen: false })
          resetForm()
        }}
        title="Edit Control Head 2"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Control Head 1 Type <span className="text-red-500">*</span>
            </label>
            <select
              name="zHead1Id"
              value={formData.zHead1Id ?? ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Control Head 1 Type</option>
              {accountTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.id} - {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Control Head 2 Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="zHead2"
              value={formData.zHead2}
              onChange={handleChange}
              placeholder="Enter Control Head 2 name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Data'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal - same as original */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Control Head 2"
        message={`Are you sure you want to delete "${confirmModal.itemClass?.zHead2}"? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />
    </div>
  )
}



































// 'use client'
// import React, { useCallback } from 'react'
// import {
//   useGetItemClassesQuery,
// } from '@/store/slice/itemsClassSlice'
// import { Loading } from '../ui/Loading'

// // ✅ Custom Hooks
// import { useItemClassForm } from '@/hooks/controlHead/useItemClassForm'
// import { useItemClassModals } from '@/hooks/controlHead/useItemClassModals'
// import { useItemClassSearch } from '@/hooks/controlHead/useItemClassSearch'
// import { useItemClassSort } from '@/hooks/controlHead/useItemClassSort'
// import { useItemClassOperations } from '@/hooks/controlHead/useItemClassOperations'

// // ✅ Smaller Components
// import { ItemClassSortOptions } from './ItemClassSortOptions'
// import { ItemClassSearchBar } from './ItemClassSearchBar'
// import { ItemClassTable } from './ItemClassTable'
// import { ItemClassModals } from './ItemClassModals'

// export const ItemClassManager: React.FC = () => {
//   // ✅ RTK Query
//   const { data: itemClasses = [], isLoading, error } = useGetItemClassesQuery()

//   // ✅ Custom Hooks (All Logic Extracted)
//   const formHook = useItemClassForm()
//   const modalHook = useItemClassModals()
//   const searchHook = useItemClassSearch(itemClasses)
//   const sortHook = useItemClassSort(searchHook.filteredItemClasses)
//   const operationsHook = useItemClassOperations()

//   // ✅ Memoized Event Handlers (Prevent Unnecessary Re-renders)
//   const handleCreate = useCallback((e: React.FormEvent) => {
//     e.preventDefault()
//     operationsHook.handleCreate(
//       formHook.formData,
//       formHook.setLoading,
//       formHook.setMessage,
//       formHook.resetForm,
//       modalHook.closeCreateModal
//     )
//   }, [formHook.formData, operationsHook, formHook, modalHook])

//   const handleUpdate = useCallback((e: React.FormEvent) => {
//     e.preventDefault()
//     if (modalHook.editModal.itemClass) {
//       operationsHook.handleUpdate(
//         modalHook.editModal.itemClass.id,
//         formHook.formData,
//         formHook.setLoading,
//         formHook.setMessage,
//         formHook.resetForm,
//         modalHook.closeEditModal
//       )
//     }
//   }, [modalHook.editModal.itemClass, formHook.formData, operationsHook, formHook, modalHook])

//   const handleEdit = useCallback((itemClass: any) => {
//     formHook.setFormValues({
//       zHead2: itemClass.zHead2,
//       zHead1Id: itemClass.zHead1Id
//     })
//     modalHook.openEditModal(itemClass)
//   }, [formHook, modalHook])

//   const handleDelete = useCallback(() => {
//     if (modalHook.confirmModal.itemClass) {
//       operationsHook.handleDelete(
//         modalHook.confirmModal.itemClass.id,
//         modalHook.closeConfirmModal
//       )
//     }
//   }, [modalHook.confirmModal.itemClass, operationsHook, modalHook])

//   const handleCreateModalOpen = useCallback(() => {
//     formHook.resetForm()
//     modalHook.openCreateModal()
//   }, [formHook, modalHook])

//   const handleCreateModalClose = useCallback(() => {
//     formHook.resetForm()
//     modalHook.closeCreateModal()
//   }, [formHook, modalHook])

//   const handleEditModalClose = useCallback(() => {
//     formHook.resetForm()
//     modalHook.closeEditModal()
//   }, [formHook, modalHook])

//   // ✅ Loading State
//   if (isLoading) {
//     return <Loading size="lg" text="Loading Control Head 2s..." />
//   }

//   // ✅ Error State
//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//           <p className="text-red-600">Failed to load control head 2s. Please try again.</p>
//         </div>
//       </div>
//     )
//   }

//   // ✅ Main Render (Only HTML/JSX - All Logic in Hooks)
//   return (
//     <div className="max-w-4xl mx-auto p-3 space-y-6">
//       {/* ✅ Header Section */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-900">
//             Control Head 2 Management
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Manage control head 2 records ({itemClasses.length} total)
//             {searchHook.searchTerm && (
//               <span className="text-blue-600">
//                 {' '}• {searchHook.filteredItemClasses.length} filtered results
//               </span>
//             )}
//           </p>
//         </div>
//       </div>

//       {/* ✅ Sort Options (NEW) */}
//       <ItemClassSortOptions
//         sortBy={sortHook.sortBy}
//         onSortChange={sortHook.handleSortChange}
//       />

//       {/* ✅ Search Bar */}
//       <ItemClassSearchBar
//         searchTerm={searchHook.searchTerm}
//         onSearchChange={searchHook.handleSearchChange}
//         onClearSearch={searchHook.clearSearch}
//         filteredCount={sortHook.sortedItemClasses.length}
//         totalCount={itemClasses.length}
//         onAddNew={handleCreateModalOpen}
//       />

//       {/* ✅ Data Table */}
//       <ItemClassTable
//         itemClasses={sortHook.sortedItemClasses}
//         searchTerm={searchHook.searchTerm}
//         onEdit={handleEdit}
//         onDelete={modalHook.openConfirmModal}
//         onClearSearch={searchHook.clearSearch}
//       />

//       {/* ✅ All Modals */}
//       <ItemClassModals
//         // Create Modal Props
//         showCreateModal={modalHook.showCreateModal}
//         onCloseCreateModal={handleCreateModalClose}
        
//         // Edit Modal Props
//         editModal={modalHook.editModal}
//         onCloseEditModal={handleEditModalClose}
        
//         // Confirm Modal Props
//         confirmModal={modalHook.confirmModal}
//         onCloseConfirmModal={modalHook.closeConfirmModal}
//         onConfirmDelete={handleDelete}
//         isDeleting={operationsHook.isDeleting}
        
//         // Form Props
//         formData={formHook.formData}
//         loading={formHook.loading}
//         message={formHook.message}
//         onSubmit={handleCreate}
//         onUpdate={handleUpdate}
//         // onChange={formHook.handleChange}
//          onChange={formHook.handleChange}
//          onClearMessage={formHook.clearMessage}
//       />
//     </div>
//   )
// }




















































