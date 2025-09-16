// 'use client'

// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'

// const OrderList = () => {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [message, setMessage] = useState({ type: '', text: '' })

//   const pathname = usePathname()
//   const orderType = pathname.includes('purchase') ? 'purchase' : 'sales'
//   const stockTypeId = orderType === 'purchase' ? 1 : 2
// console.log()
//   useEffect(() => {
//     fetchOrders()
//   }, [page, stockTypeId])
// console.log(`http://${window.location.hostname}:4000/api`,'this is current url')
//   const fetchOrders = async () => {
//     try {
//       setLoading(true)
//       const baseUrl = typeof window !== 'undefined'
//         ? `http://${window.location.hostname}:5000/api`
//         : 'http://localhost:5000/api/'

//       const response = await fetch(
//         `${baseUrl}/order`
//       )
//       const result = await response.json()

//       if (result.success) {
//         setOrders(result.data)
//         setTotalPages(result.pagination.totalPages)
//       } else {
//         setMessage({ type: 'error', text: 'Failed to load orders' })
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//       setMessage({ type: 'error', text: 'Error fetching orders' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this order?')) return

//     try {
//       setLoading(true)
//       const baseUrl = typeof window !== 'undefined'
//         ? `http://${window.location.hostname}:5000/api`
//         : 'http://localhost:5000/api'

//       const response = await fetch(`${baseUrl}/orders/${id}`, {
//         method: 'DELETE'
//       })
//       const result = await response.json()

//       if (result.success) {
//         setMessage({ type: 'success', text: 'Order deleted successfully' })
//         fetchOrders()
//       } else {
//         setMessage({ type: 'error', text: result.message || 'Failed to delete order' })
//       }
//     } catch (error) {
//       console.error('Error deleting order:', error)
//       setMessage({ type: 'error', text: 'Error deleting order' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
//         <div className={`${orderType === 'purchase' ? 'bg-blue-600' : 'bg-green-600'} text-white p-5 rounded-t-lg`}>
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold">{orderType === 'purchase' ? 'Purchase Orders' : 'Sales Orders'}</h1>
//             <Link
//               href={`/order/${orderType}/create`}
//               className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 shadow-sm"
//             >
//               + Create New
//             </Link>
//           </div>
//         </div>

//         {message.text && (
//           <div className={`m-4 p-3 rounded ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-600">Loading orders...</p>
//             </div>
//           </div>
//         ) : orders.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 border border-gray-300 text-left">Order #</th>
//                   <th className="px-4 py-2 border border-gray-300 text-left">Date</th>
//                   <th className="px-4 py-2 border border-gray-300 text-left">
//                     {orderType === 'purchase' ? 'Supplier' : 'Customer'}
//                   </th>
//                   <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
//                   <th className="px-4 py-2 border border-gray-300 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.ID} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 border border-gray-300">{order.Number}</td>
//                     <td className="px-4 py-2 border border-gray-300">{formatDate(order.Date)}</td>
//                     <td className="px-4 py-2 border border-gray-300">{order.account?.acName}</td>
//                     <td className="px-4 py-2 border border-gray-300">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         order.Next_Status === 'Complete' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {order.Next_Status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2 border border-gray-300 text-center">
//                       <div className="flex justify-center space-x-2">
//                         <Link
//                           href={`/order/${orderType}/edit?id=${order.ID}`}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           Edit
//                         </Link>
//                         <button
//                           onClick={() => handleDelete(order.ID)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="flex justify-center items-center h-64">
//             <p className="text-gray-500">No orders found. Create your first order.</p>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="p-4 border-t border-gray-200 flex justify-center">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setPage(p => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Previous
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   className={`px-3 py-1 border rounded ${
//                     p === page ? 'bg-blue-500 text-white' : ''
//                   }`}
//                 >
//                   {p}
//                 </button>
//               ))}

//               <button
//                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default OrderList






















'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [printingOrderId, setPrintingOrderId] = useState(null)

  const pathname = usePathname()
  const router = useRouter()
  const orderType = pathname.includes('purchase') ? 'purchase' : 'sales'
  const stockTypeId = orderType === 'purchase' ? 1 : 2

  useEffect(() => {
    fetchOrders()
  }, [page, stockTypeId])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const baseUrl = `http://${window.location.hostname}:4000/api`

      const response = await fetch(`${baseUrl}/order?stockTypeId=${stockTypeId}&page=${page}&limit=10`)
      const result = await response.json()

      if (result.success) {
        setOrders(result.data || [])
        setTotalPages(result.pagination?.totalPages || 1)
      } else {
        setMessage({ type: 'error', text: 'Failed to load orders' })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setMessage({ type: 'error', text: 'Error fetching orders' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return

    try {
      setLoading(true)
      const baseUrl = `http://${window.location.hostname}:4000/api`

      // Fixed delete endpoint URL
      const response = await fetch(`${baseUrl}/order/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: 'Order deleted successfully' })
        fetchOrders() // Refresh the list
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete order' })
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      setMessage({ type: 'error', text: 'Error deleting order' })
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = async (orderId) => {
    try {
      setPrintingOrderId(orderId)
      const baseUrl = `http://${window.location.hostname}:4000/api`

      // Fetch the complete order data
      const response = await fetch(`${baseUrl}/order/${orderId}`)
      const result = await response.json()

      if (result.success && result.data) {
        // Open print window
        const printWindow = window.open('', '_blank', 'width=800,height=600')
        printWindow.document.write(generatePrintHTML(result.data, orderType))
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      } else {
        setMessage({ type: 'error', text: 'Failed to load order details for printing' })
      }
    } catch (error) {
      console.error('Error printing order:', error)
      setMessage({ type: 'error', text: 'Error printing order' })
    } finally {
      setPrintingOrderId(null)
    }
  }

  const generatePrintHTML = (orderData, type) => {
    const isPurchase = type === 'purchase'
    const details = orderData.details || []

    // Calculate totals
    const totals = details.reduce((acc, detail) => ({
      grossTotal: acc.grossTotal + (detail.grossTotal || 0),
      netTotal: acc.netTotal + (detail.netTotal || 0)
    }), { grossTotal: 0, netTotal: 0 })

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${isPurchase ? 'Purchase' : 'Sales'} Order #${orderData.Number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .container { max-width: 350px; margin: auto; padding:10px;  border:1px solid }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .order-title { font-size: 18px; color: ${isPurchase ? '#2563eb' : '#16a34a'}; margin-bottom: 10px; }
        .order-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .info-section { flex: 1; }
        .info-title { font-weight: bold; margin-bottom: 10px; padding: 8px; background: #f3f4f6; }
        .info-content { padding: 8px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f8f9fa; font-weight: bold; }
        .table .number-cell { text-align: right; }
        .totals { margin-top: 20px; float: right; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; min-width: 200px; }
        .grand-total { font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body >

<div class="container">
<div class="header">
        <div class="company-name">Your Company Name</div>
        <div class="order-title">${isPurchase ? 'Purchase Order' : 'Sales Order'}</div>
        <div>Order #: ${orderData.Number || 'N/A'}</div>
      </div>

      <div class="order-info">
        <div class="info-section">
          <div class="info-title">Order Information</div>
          <div class="info-content">
            <strong>Date:</strong> ${new Date(orderData.Date).toLocaleDateString()}<br>
            <strong>Order ID:</strong> ${orderData.ID}<br>
            <strong>Status:</strong> ${orderData.Next_Status || 'Pending'}
          </div>
        </div>
        <div class="info-section">
          <div class="info-title">${isPurchase ? 'Supplier' : 'Customer'} Information</div>
          <div class="info-content">
            <strong>Name:</strong> ${orderData.account?.acName || 'N/A'}<br>
            <strong>City:</strong> ${orderData.account?.city || 'N/A'}<br>
            <strong>Contact:</strong> ${orderData.account?.personName || 'N/A'}
          </div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th style="width: 5% ">#</th>
            <th style="width: 25%; font-weight:300; font-size:13px">Item Name</th>
            <th style="width: 10%; font-weight:300; font-size:13px " >Unit Price</th>
            <th style="width: 10%; font-weight:300; font-size:13px">Quantity</th>
           
           
          </tr>
        </thead>
        <tbody>
          ${details.map((detail, index) => `
            <tr>
              <td>${index + 1}</td>
              <td class="">${detail.item?.itemName || 'N/A'}</td>
              <td class="number-cell">${parseFloat(detail.Price || 0).toFixed(2)}</td>
              <td class="number-cell">${isPurchase ?
        (parseFloat(detail.Stock_In_UOM_Qty || 0).toFixed(0)) :
        (parseFloat(detail.Stock_out_UOM_Qty || 0).toFixed(0))}</td>
              
            
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Gross Total:</span>
          <span>${totals.grossTotal.toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Net Total:</span>
          <span>${totals.netTotal.toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>This is a computer-generated document.</p>
      </div>
</div>
      
      <script>
        // Auto print when page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      </script>


    </body>
    </html>
    `
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        <div className={`${orderType === 'purchase' ? 'bg-blue-600' : 'bg-green-600'} text-white p-5 rounded-t-lg`}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{orderType === 'purchase' ? 'Purchase Orders' : 'Sales Orders'}</h1>
            <Link
              href={`/order/${orderType}/create`}
              className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 shadow-sm transition-colors"
            >
              + Create New Order
            </Link>
          </div>
        </div>

        {message.text && (
          <div className={`m-4 p-4 rounded-lg border ${message.type === 'success'
            ? 'bg-green-50 border-green-300 text-green-800'
            : 'bg-red-50 border-red-300 text-red-800'
            }`}>
            <div className="flex items-center">
              <div className={`w-5 h-5 mr-3 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.type === 'success' ? (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {message.text}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border border-gray-300 text-left font-semibold">Order #</th>
                  <th className="px-4 py-3 border border-gray-300 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 border border-gray-300 text-left font-semibold">
                    {orderType === 'purchase' ? 'Supplier' : 'Customer'}
                  </th>
                  <th className="px-4 py-3 border border-gray-300 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 border border-gray-300 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.ID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border border-gray-300 font-medium">{order.Number || order.ID}</td>
                    <td className="px-4 py-3 border border-gray-300">{formatDate(order.Date)}</td>
                    <td className="px-4 py-3 border border-gray-300">{order.account?.acName || 'N/A'}</td>
                    <td className="px-4 py-3 border border-gray-300">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${order.Next_Status === 'Complete'
                        ? 'bg-green-100 text-green-800'
                        : order.Next_Status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}>
                        {order.Next_Status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <div className="flex justify-center items-center space-x-2">
                        {/* Print Button */}
                        <button
                          onClick={() => handlePrint(order.ID)}
                          disabled={printingOrderId === order.ID}
                          className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Print Order"
                        >
                          {printingOrderId === order.ID ? (
                            <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          )}
                        </button>

                        {/* Edit Button */}
                        <Link
                          href={`/order/${orderType}/edit/${order.ID}`}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit Order"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(order.ID)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Order"
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
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No orders found</p>
            <p className="text-gray-400 text-sm mb-4">Create your first {orderType} order to get started</p>
            <Link
              href={`/order/${orderType}/create`}
              className={`px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity ${orderType === 'purchase' ? 'bg-blue-600' : 'bg-green-600'
                }`}
            >
              Create New Order
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 7) {
                  pageNum = i + 1
                } else if (page <= 4) {
                  pageNum = i + 1
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i
                } else {
                  pageNum = page - 3 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-md transition-colors ${pageNum === page
                      ? `${orderType === 'purchase' ? 'bg-blue-500 text-white border-blue-500' : 'bg-green-500 text-white border-green-500'}`
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderList