// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// interface OrderRecord {
//   ID: number
//   Number: string
//   Date: string
//   Stock_Type_ID: number
//   COA_ID: number
//   Next_Status: string
//   account?: {
//     id: number
//     acName: string
//   }
//   createdAt: string
// }

// interface OrderListProps {
//   orderType: 'purchase' | 'sales'
// }

// const OrderList: React.FC<OrderListProps> = ({ orderType }) => {
//   const router = useRouter()
//   const isPurchase = orderType === 'purchase'
//   const stockTypeId = isPurchase ? 1 : 2

//   const [orders, setOrders] = useState<OrderRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [deleting, setDeleting] = useState<number | null>(null)
//   const [message, setMessage] = useState({ type: '', text: '' })
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(0)
//   const [totalOrders, setTotalOrders] = useState(0)
//   const pageSize = 10

//   useEffect(() => {
//     fetchOrders()
//   }, [currentPage, stockTypeId])

//   const fetchOrders = async () => {
//     try {
//       setLoading(true)
//       setMessage({ type: '', text: '' })
      
//       const baseUrl = typeof window !== 'undefined'
//         ? `http://${window.location.hostname}:5000/api`
//         : 'http://localhost:5000/api'

//       const response = await fetch(
//         `${baseUrl}/orders?stockTypeId=${stockTypeId}&page=${currentPage}&limit=${pageSize}`
//       )
      
//       const result = await response.json()
      
//       if (result.success) {
//         setOrders(result.data)
//         setTotalPages(result.pagination.totalPages)
//         setTotalOrders(result.pagination.total)
//       } else {
//         setMessage({ type: 'error', text: 'Failed to fetch orders' })
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//       setMessage({ type: 'error', text: 'Failed to fetch orders' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: number, orderNumber: string) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete order "${orderNumber}"?\n\nThis action cannot be undone.`
//     )
    
//     if (!confirmed) return

//     try {
//       setDeleting(id)
//       setMessage({ type: '', text: '' })
      
//       const baseUrl = typeof window !== 'undefined'
//         ? `http://${window.location.hostname}:5000/api`
//         : 'http://localhost:5000/api'
      
//       const response = await fetch(`${baseUrl}/orders/${id}`, {
//         method: 'DELETE'
//       })
      
//       const result = await response.json()
      
//       if (result.success) {
//         setMessage({ type: 'success', text: 'Order deleted successfully!' })
//         // Remove from local state
//         setOrders(prevOrders => prevOrders.filter(order => order.ID !== id))
//         setTotalOrders(prev => prev - 1)
        
//         // Clear success message after 3 seconds
//         setTimeout(() => {
//           setMessage({ type: '', text: '' })
//         }, 3000)
//       } else {
//         setMessage({ type: 'error', text: result.message || 'Failed to delete order' })
//       }
//     } catch (error) {
//       console.error('Error deleting order:', error)
//       setMessage({ type: 'error', text: 'Failed to delete order' })
//     } finally {
//       setDeleting(null)
//     }
//   }

//   const handleEdit = (id: number) => {
//     router.push(`/orders/${orderType}/edit?id=${id}`)
//   }

//   const handleView = (id: number) => {
//     router.push(`/orders/${orderType}/view/${id}`)
//   }

//   const handleCreateNew = () => {
//     router.push(`/orders/${orderType}/create`)
//   }

//   // Filter orders based on search term
//   const filteredOrders = orders.filter(order =>
//     order.Number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.account?.acName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.Next_Status.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: '2-digit'
//     })
//   }

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'complete':
//         return 'bg-green-100 text-green-800'
//       case 'incomplete':
//         return 'bg-yellow-100 text-yellow-800'
//       case 'cancelled':
//         return 'bg-red-100 text-red-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {isPurchase ? 'Purchase Orders' : 'Sales Orders'}
//             </h1>
//             <p className="text-gray-600">
//               Manage your {isPurchase ? 'purchase' : 'sales'} orders
//             </p>
//           </div>
//           <button
//             onClick={handleCreateNew}
//             className={`mt-4 md:mt-0 px-6 py-3 text-white rounded-lg font-medium shadow-md transition-colors duration-200 flex items-center space-x-2 ${
//               isPurchase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             <span>Create New Order</span>
//           </button>
//         </div>
//       </div>

//       {/* Message Display */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg border ${
//           message.type === 'success' 
//             ? 'bg-green-50 text-green-800 border-green-200' 
//             : 'bg-red-50 text-red-800 border-red-200'
//         }`}>
//           <div className="flex items-center">
//             {message.type === 'success' ? (
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             )}
//             {message.text}
//           </div>
//         </div>
//       )}

//       {/* Controls */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//             {/* Search */}
//             <div className="flex-1 md:max-w-md">
//               <div className="relative">
//                 <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search orders..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="text-sm text-gray-600">
//               Total Orders: {totalOrders}
//             </div>

//             {/* Refresh Button */}
//             <button
//               onClick={fetchOrders}
//               disabled={loading}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
//             >
//               <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               <span>{loading ? 'Loading...' : 'Refresh'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-600">Loading orders...</p>
//             </div>
//           </div>
//         ) : filteredOrders.length === 0 ? (
//           <div className="text-center py-12">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchTerm ? 'Try adjusting your search terms.' : `Get started by creating a new ${orderType} order.`}
//             </p>
//             {!searchTerm && (
//               <div className="mt-6">
//                 <button
//                   onClick={handleCreateNew}
//                   className={`px-4 py-2 text-white rounded-lg font-medium ${
//                     isPurchase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
//                   }`}
//                 >
//                   Create New Order
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Order Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {isPurchase ? 'Supplier' : 'Customer'}
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredOrders.map((order) => (
//                   <tr key={order.ID} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="text-sm">
//                         <div className="font-medium text-gray-900">{order.Number}</div>
//                         <div className="text-gray-500">ID: {order.ID}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {order.account?.acName || 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {formatDate(order.Date)}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         Created: {formatDate(order.createdAt)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.Next_Status)}`}>
//                         {order.Next_Status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleView(order.ID)}
//                           className="text-indigo-600 hover:text-indigo-900 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-200"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleEdit(order.ID)}
//                           disabled={deleting === order.ID}
//                           className="text-blue-600 hover:text-blue-900 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(order.ID, order.Number)}
//                           disabled={deleting === order.ID}
//                           className={`text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
//                             deleting === order.ID
//                               ? 'bg-red-200 text-red-500 cursor-not-allowed'
//                               : 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
//                           }`}
//                         >
//                           {deleting === order.ID ? 'Deleting...' : 'Delete'}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {!loading && filteredOrders.length > 0 && totalPages > 1 && (
//         <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Page {currentPage} of {totalPages}
//             </div>
            
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
              
//               {/* Page numbers */}
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
//                 return (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-3 py-1 text-sm border rounded-md ${
//                       currentPage === page
//                         ? 'bg-blue-500 text-white border-blue-500'
//                         : 'border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               })}
              
//               <button
//                 onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default OrderList



































































'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface OrderRecord {
  ID: number
  Number: string
  Date: string
  Stock_Type_ID: number
  COA_ID: number
  Next_Status: string
  account?: {
    id: number
    acName: string
  }
  createdAt: string
}

interface OrderListProps {
  orderType: 'purchase' | 'sales'
}

const OrderList: React.FC<OrderListProps> = ({ orderType }) => {
  const router = useRouter()
  const isPurchase = orderType === 'purchase'
  const stockTypeId = isPurchase ? 1 : 2

  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchOrders()
  }, [currentPage, stockTypeId])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      
      const baseUrl = typeof window !== 'undefined'
        ? `http://${window.location.hostname}:5000/api`
        : 'http://localhost:5000/api'

      const response = await fetch(
        `${baseUrl}/orders?stockTypeId=${stockTypeId}&page=${currentPage}&limit=${pageSize}`
      )
      
      const result = await response.json()
      
      if (result.success) {
        setOrders(result.data)
        setTotalPages(result.pagination.totalPages)
        setTotalOrders(result.pagination.total)
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch orders' })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setMessage({ type: 'error', text: 'Failed to fetch orders' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, orderNumber: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order "${orderNumber}"?\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      setDeleting(id)
      setMessage({ type: '', text: '' })
      
      const baseUrl = typeof window !== 'undefined'
        ? `http://${window.location.hostname}:5000/api`
        : 'http://localhost:5000/api'
      
      const response = await fetch(`${baseUrl}/orders/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Order deleted successfully!' })
        // Remove from local state
        setOrders(prevOrders => prevOrders.filter(order => order.ID !== id))
        setTotalOrders(prev => prev - 1)
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete order' })
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      setMessage({ type: 'error', text: 'Failed to delete order' })
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/orders/${orderType}/edit?id=${id}`)
  }

  const handleView = (id: number) => {
    router.push(`/orders/${orderType}/view/${id}`)
  }

  const handleCreateNew = () => {
    router.push(`/orders/${orderType}/create`)
  }

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.Number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.account?.acName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.Next_Status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800'
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isPurchase ? 'Purchase Orders' : 'Sales Orders'}
            </h1>
            <p className="text-gray-600">
              Manage your {isPurchase ? 'purchase' : 'sales'} orders
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className={`mt-4 md:mt-0 px-6 py-3 text-white rounded-lg font-medium shadow-md transition-colors duration-200 flex items-center space-x-2 ${
              isPurchase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Order</span>
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
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-600">
              Total Orders: {totalOrders}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchOrders}
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
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : `Get started by creating a new ${orderType} order.`}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleCreateNew}
                  className={`px-4 py-2 text-white rounded-lg font-medium ${
                    isPurchase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Create New Order
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
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isPurchase ? 'Supplier' : 'Customer'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                {filteredOrders.map((order) => (
                  <tr key={order.ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.Number}</div>
                        <div className="text-gray-500">ID: {order.ID}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.account?.acName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.Date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.Next_Status)}`}>
                        {order.Next_Status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(order.ID)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(order.ID)}
                          disabled={deleting === order.ID}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.ID, order.Number)}
                          disabled={deleting === order.ID}
                          className={`text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
                            deleting === order.ID
                              ? 'bg-red-200 text-red-500 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          {deleting === order.ID ? 'Deleting...' : 'Delete'}
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

      {/* Pagination */}
      {!loading && filteredOrders.length > 0 && totalPages > 1 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderList
