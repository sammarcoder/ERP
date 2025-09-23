// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// interface ZItem {
//   id: number;
//   itemName: string;
//   barCode: string;
//   weight_per_pcs: number;
//   sellingPrice: number;
//   purchasePricePKR: number;
//   hsCode: string;
//   wastageItem: boolean;
//   isNonInventory: boolean;
// }

// const ZItemsList = () => {
//   const router = useRouter()
//   const [items, setItems] = useState<ZItem[]>([])
//   const [filteredItems, setFilteredItems] = useState<ZItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')
  
//   // Delete confirmation
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [deleteError, setDeleteError] = useState('')
  
//   // Fetch items on component mount
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(
//           `http://${window.location.hostname}:4000/api/z-items/items`
//         )
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch items: ${response.statusText}`)
//         }
//         const data = await response.json()
//         console.log(data)
//         setItems(data)
//         setFilteredItems(data)
//       } catch (err) {
//         console.error('Error fetching items:', err)
//         setError('Failed to load items. Please try again later.')
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     fetchItems()
//   }, [])
  
//   // Handle search input change
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredItems(items)
//       return
//     }
    
//     const lowercasedSearch = searchTerm.toLowerCase()
//     const results = items.filter(item => 
//       item.itemName.toLowerCase().includes(lowercasedSearch) ||
//       (item.barCode && item.barCode.toLowerCase().includes(lowercasedSearch)) ||
//       (item.hsCode && item.hsCode.toLowerCase().includes(lowercasedSearch))
//     )
    
//     setFilteredItems(results)
//   }, [searchTerm, items])
  
//   // Open delete confirmation modal
//   const confirmDelete = (id: number) => {
//     setItemToDelete(id)
//     setShowDeleteModal(true)
//     setDeleteError('')
//   }
  
//   // Cancel delete
//   const cancelDelete = () => {
//     setShowDeleteModal(false)
//     setItemToDelete(null)
//     setDeleteError('')
//   }
  
//   // Perform delete
//   const handleDelete = async () => {
//     if (!itemToDelete) return
    
//     try {
//       setDeleteLoading(true)
//       setDeleteError('')
      
//       const response = await fetch(
//         `http://${window.location.hostname}:4000/api/z-items/items/${itemToDelete}`,
//         {
//           method: 'DELETE',
//         }
//       )
      
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || 'Failed to delete item')
//       }
      
//       // Remove item from list
//       setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete))
//       setFilteredItems(prevItems => prevItems.filter(item => item.id !== itemToDelete))
      
//       // Close modal
//       setShowDeleteModal(false)
//       setItemToDelete(null)
      
//     } catch (err) {
//       console.error('Error deleting item:', err)
//       setDeleteError(err instanceof Error ? err.message : 'Unknown error')
//     } finally {
//       setDeleteLoading(false)
//     }
//   }
  
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-700">Loading items...</p>
//         </div>
//       </div>
//     )
//   }
  
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }
  
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white shadow-xl rounded-lg p-8 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
//               Inventory Items
//             </h2>
            
//             <button
//               onClick={() => router.push('/items/new')}
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//               </svg>
//               Add New Item
//             </button>
//           </div>
          
//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search items by name, barcode, or HS code..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           {/* Items Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Item Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Barcode
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Weight
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Selling Price
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredItems.length > 0 ? (
//                   filteredItems.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.itemName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.barCode || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.weight_per_pcs ? `${item.weight_per_pcs}g` : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {typeof item.sellingPrice === 'number' 
//                           ? `PKR ${item.sellingPrice.toFixed(2)}`
//                           : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {item.isNonInventory ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             Non-Inventory
//                           </span>
//                         ) : item.wastageItem ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Wastage
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Active
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => router.push(`/items/edit/${item.id}`)}
//                           className="text-blue-600 hover:text-blue-900 mr-4"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => confirmDelete(item.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) 
//                 : (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
//                       {searchTerm ? 'No items found matching your search criteria.' : 'No items available.'}
//                     </td>
//                   </tr>
//                 )
                
//                 }
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
      
//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Are you sure you want to delete this item? This action cannot be undone.
//             </p>
            
//             {deleteError && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
//                 {deleteError}
//               </div>
//             )}
            
//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 disabled={deleteLoading}
//                 onClick={cancelDelete}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 disabled={deleteLoading}
//                 onClick={handleDelete}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
//                   deleteLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {deleteLoading ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ZItemsList





































































// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// interface ZItem {
//   id: number;
//   itemName: string;
//   barCode: string;
//   weight_per_pcs: number;
//   sellingPrice: number;
//   purchasePricePKR: number;
//   hsCode: string;
//   wastageItem: boolean;
//   isNonInventory: boolean;
// }

// const ZItemsList = () => {
//   const router = useRouter()
//   const [items, setItems] = useState<ZItem[]>([])
//   const [filteredItems, setFilteredItems] = useState<ZItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')
  
//   // Delete confirmation
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null)
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [deleteError, setDeleteError] = useState('')
  
//   // Fetch items on component mount
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(
//           `http://${window.location.hostname}:4000/api/z-items/items`
//         )
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch items: ${response.statusText}`)
//         }
        
//         const data = await response.json()
        
//         // Debug logging to check response structure
//         console.log('API Response:', data)
        
//         // Handle different response structures - API may return an array directly
//         // or an object with items property containing the array
//         let itemsArray = Array.isArray(data) ? data : 
//                          data && data.items ? data.items : 
//                          data && data.data ? data.data : [];
        
//         console.log('Processed items array:', itemsArray)
        
//         if (itemsArray.length === 0) {
//           console.log('No items found in the response')
//         }
        
//         setItems(itemsArray)
//         setFilteredItems(itemsArray)
//       } catch (err) {
//         console.error('Error fetching items:', err)
//         setError('Failed to load items. Please try again later.')
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     fetchItems()
//   }, [])
  
//   // Handle search input change
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredItems(items)
//       return
//     }
    
//     const lowercasedSearch = searchTerm.toLowerCase()
//     const results = items.filter(item => 
//       (item.itemName && item.itemName.toLowerCase().includes(lowercasedSearch)) ||
//       (item.barCode && item.barCode.toLowerCase().includes(lowercasedSearch)) ||
//       (item.hsCode && item.hsCode.toLowerCase().includes(lowercasedSearch))
//     )
    
//     setFilteredItems(results)
//   }, [searchTerm, items])
  
//   // Open delete confirmation modal
//   const confirmDelete = (id: number) => {
//     setItemToDelete(id)
//     setShowDeleteModal(true)
//     setDeleteError('')
//   }
  
//   // Cancel delete
//   const cancelDelete = () => {
//     setShowDeleteModal(false)
//     setItemToDelete(null)
//     setDeleteError('')
//   }
  
//   // Perform delete
//   const handleDelete = async () => {
//     if (!itemToDelete) return
    
//     try {
//       setDeleteLoading(true)
//       setDeleteError('')
      
//       const response = await fetch(
//         `http://${window.location.hostname}:4000/api/z-items/items/${itemToDelete}`,
//         {
//           method: 'DELETE',
//         }
//       )
      
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || 'Failed to delete item')
//       }
      
//       // Remove item from list
//       setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete))
//       setFilteredItems(prevItems => prevItems.filter(item => item.id !== itemToDelete))
      
//       // Close modal
//       setShowDeleteModal(false)
//       setItemToDelete(null)
      
//     } catch (err) {
//       console.error('Error deleting item:', err)
//       setDeleteError(err instanceof Error ? err.message : 'Unknown error')
//     } finally {
//       setDeleteLoading(false)
//     }
//   }
  
//   // Show loading indicator while fetching
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-700">Loading items...</p>
//         </div>
//       </div>
//     )
//   }
  
//   // Show error message if fetch failed
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }
  
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white shadow-xl rounded-lg p-8 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
//               Inventory Items
//             </h2>
            
//             <button
//               onClick={() => router.push('/items/new')}
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//               </svg>
//               Add New Item
//             </button>
//           </div>
          
//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search items by name, barcode, or HS code..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           {/* Items Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Item Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Barcode
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Weight
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Selling Price
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredItems && filteredItems.length > 0 ? (
//                   filteredItems.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.itemName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.barCode || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.weight_per_pcs ? `${item.weight_per_pcs}g` : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {typeof item.sellingPrice === 'number' 
//                           ? `PKR ${item.sellingPrice.toFixed(2)}`
//                           : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {item.isNonInventory ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                             Non-Inventory
//                           </span>
//                         ) : item.wastageItem ? (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Wastage
//                           </span>
//                         ) : (
//                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Active
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => router.push(`/items/edit/${item.id}`)}
//                           className="text-blue-600 hover:text-blue-900 mr-4"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => confirmDelete(item.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
//                       {searchTerm ? 'No items found matching your search criteria.' : 'No items available. Click "Add New Item" to create one.'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
      
//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Are you sure you want to delete this item? This action cannot be undone.
//             </p>
            
//             {deleteError && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
//                 {deleteError}
//               </div>
//             )}
            
//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 disabled={deleteLoading}
//                 onClick={cancelDelete}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 disabled={deleteLoading}
//                 onClick={handleDelete}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
//                   deleteLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
//                 }`}
//               >
//                 {deleteLoading ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ZItemsList


































































'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ZItem {
  id: number;
  itemName: string;
  barCode?: string; 
  weight_per_pcs?: number;
  sellingPrice?: number | string; // Allow for both number and string types
  purchasePricePKR?: number | string;
  hsCode?: string;
  wastageItem: boolean;
  isNonInventory: boolean;
}

const ZItemsList = () => {
  const router = useRouter()
  const [items, setItems] = useState<ZItem[]>([])
  const [filteredItems, setFilteredItems] = useState<ZItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  
  // Fetch items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `http://${window.location.hostname}:4000/api/z-items/items`
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('API Response:', data)
        
        let itemsArray = Array.isArray(data) ? data : 
                         data?.items ? data.items : 
                         data?.data ? data.data : [];
        
        setItems(itemsArray)
        setFilteredItems(itemsArray)
      } catch (err) {
        console.error('Error fetching items:', err)
        setError('Failed to load items. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchItems()
  }, [])
  
  // Handle search input change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items)
      return
    }
    
    const lowercasedSearch = searchTerm.toLowerCase()
    const results = items.filter(item => 
      (item.itemName && item.itemName.toLowerCase().includes(lowercasedSearch)) ||
      (item.barCode && typeof item.barCode === 'string' && item.barCode.toLowerCase().includes(lowercasedSearch)) ||
      (item.hsCode && typeof item.hsCode === 'string' && item.hsCode.toLowerCase().includes(lowercasedSearch))
    )
    
    setFilteredItems(results)
  }, [searchTerm, items])
  
  // Delete handlers
  const confirmDelete = (id: number) => {
    setItemToDelete(id)
    setShowDeleteModal(true)
    setDeleteError('')
  }
  
  const cancelDelete = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
  }
  
  const handleDelete = async () => {
    if (!itemToDelete) return
    
    try {
      setDeleteLoading(true)
      
      const response = await fetch(
        `http://${window.location.hostname}:4000/api/z-items/items/${itemToDelete}`,
        { method: 'DELETE' }
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete item')
      }
      
      // Remove item from lists
      setItems(items => items.filter(item => item.id !== itemToDelete))
      setFilteredItems(items => items.filter(item => item.id !== itemToDelete))
      setShowDeleteModal(false)
      
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setDeleteLoading(false)
    }
  }
  
  // Format price safely
  const formatPrice = (price: any): string => {
    if (typeof price === 'number') {
      return `PKR ${price.toFixed(2)}`;
    } else if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      if (!isNaN(numPrice)) {
        return `PKR ${numPrice.toFixed(2)}`;
      }
    }
    return '-';
  }
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-gray-700">Loading items...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <div className="mb-3 text-4xl text-red-500">⚠️</div>
            <h2 className="mb-3 text-xl font-bold text-gray-900">Error</h2>
            <p className="mb-4 text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-50 py-5 px-3">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-lg bg-white p-3 shadow-md">
          {/* Header with more compact spacing */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">
              Inventory Items
            </h2>
            
            <div className="flex space-x-2">
              {/* Ultra compact search */}
              <div className="relative w-48 sm:w-56 md:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-1 pl-7 pr-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={() => router.push('/items/new')}
                className="flex items-center rounded-md bg-blue-600 px-2.5 py-1 text-xs text-white transition-colors hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add
              </button>
            </div>
          </div>
          
          {/* Items Table with reduced spacing */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-1.5 text-left text-xs font-medium uppercase text-gray-500">
                    Item Name
                  </th>
                  <th scope="col" className="px-2 py-1.5 text-left text-xs font-medium uppercase text-gray-500">
                    Barcode
                  </th>
                  <th scope="col" className="px-2 py-1.5 text-left text-xs font-medium uppercase text-gray-500">
                    Weight
                  </th>
                  <th scope="col" className="px-2 py-1.5 text-left text-xs font-medium uppercase text-gray-500">
                    Price
                  </th>
                  {/* <th scope="col" className="px-2 py-1.5 text-left text-xs font-medium uppercase text-gray-500">
                    Status
                  </th> */}
                  <th scope="col" className="px-2 py-1.5 text-right text-xs font-medium uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredItems && filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-2 py-1.5 text-sm font-medium text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5 text-xs text-gray-500">
                        {item.barCode || '-'}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5 text-xs text-gray-500">
                        {item.weight_per_pcs ? `${item.weight_per_pcs}g` : '-'}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5 text-xs text-gray-500">
                        {formatPrice(item.sellingPrice)}
                      </td>
                      {/* <td className="whitespace-nowrap px-2 py-1.5">
                        {item.isNonInventory ? (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-4 text-yellow-800">
                            Non-Inv
                          </span>
                        ) : item.wastageItem ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-4 text-red-800">
                            Wastage
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-4 text-green-800">
                            Active
                          </span>
                        )}
                      </td> */}
                      <td className="whitespace-nowrap px-2 py-1.5 text-right text-xs font-medium">
                        <button
                          onClick={() => router.push(`/items/edit/${item.id}`)}
                          className="mr-2 text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-2 py-3 text-center text-sm text-gray-500">
                      {searchTerm ? 'No items match your search.' : 'No items available.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal - more compact */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="mx-4 w-full max-w-xs rounded-lg bg-white p-4 shadow-xl">
            <h3 className="mb-2 text-base font-medium text-gray-900">Confirm Delete</h3>
            <p className="mb-3 text-xs text-gray-500">
              Are you sure you want to delete this item?
            </p>
            
            {deleteError && (
              <div className="mb-3 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {deleteError}
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button
                disabled={deleteLoading}
                onClick={cancelDelete}
                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                disabled={deleteLoading}
                onClick={handleDelete}
                className={`rounded-md px-2.5 py-1 text-xs font-medium text-white ${
                  deleteLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ZItemsList
