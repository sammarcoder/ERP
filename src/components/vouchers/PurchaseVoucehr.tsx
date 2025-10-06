// 'use client'
// import React, { useState, useEffect } from 'react'
// import UomConverter from '@/components/UomConverter'
// import { VoucherData, VoucherItem } from '@/lib/types'

// interface PurchaseVoucherProps {
//   grnId: number
//   onClose: () => void
//   onSuccess: () => void
// }

// export function PurchaseVoucher({ grnId, onClose, onSuccess }: PurchaseVoucherProps) {
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
  
//   const [voucherData, setVoucherData] = useState<VoucherData>({
//     Number: '',
//     Date: '',
//     Supplier: '',
//     Status: ''
//   })

//   const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])

//   useEffect(() => {
//     if (grnId) {
//       loadGrnData()
//     }
//   }, [grnId])

//   const loadGrnData = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/grn/${grnId}`)
//       const result = await response.json()
      
//       if (result.success) {
//         const grn = result.data
        
//         setVoucherData({
//           Number: grn.Number,
//           Date: grn.Date.split('T')[0],
//           Supplier: grn.account?.acName || '',
//           Status: grn.Status
//         })

//         const items = grn.details?.map((detail: any) => ({
//           ID: detail.ID,
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item_Name: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           uom1_qty: detail.Stock_In_UOM_Qty || 0,
//           uom2_qty: detail.Stock_In_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_In_UOM3_Qty || 0,
//           sale_unit: 'uom1', // Default for purchase
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item,
//           originalPrice: detail.Stock_Price || 0
//         })) || []
        
//         setVoucherItems(items)
//       }
//     } catch (error) {
//       console.error('Error loading GRN:', error)
//       setMessage({ type: 'error', text: 'Failed to load GRN data' })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const handleUomChange = (index: number, values: any) => {
//     const updated = [...voucherItems]
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       sale_unit: values.sale_unit || 'uom1'
//     }
//     setVoucherItems(updated)
//   }

//   const updatePrice = (index: number, value: string) => {
//     const updated = [...voucherItems]
//     updated[index].Stock_Price = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   // Calculate total based on selected sale unit quantity
//   const calculateTotal = (item: VoucherItem): number => {
//     const price = parseFloat(item.Stock_Price.toString()) || 0
//     let quantity = 0
    
//     switch (item.sale_unit) {
//       case 'uom1':
//         quantity = parseFloat(item.uom1_qty.toString()) || 0
//         break
//       case 'uomTwo':
//         quantity = parseFloat(item.uom2_qty.toString()) || 0
//         break
//       case 'uomThree':
//         quantity = parseFloat(item.uom3_qty.toString()) || 0
//         break
//       default:
//         quantity = parseFloat(item.uom1_qty.toString()) || 0
//     }
    
//     return price * quantity
//   }

//   // Calculate net amount and grand total
//   const calculateNetAmount = (): number => {
//     return voucherItems.reduce((total, item) => total + calculateTotal(item), 0)
//   }

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   setLoading(true)

//   //   try {
//   //     // Update each stock detail record
//   //     const updatePromises = voucherItems.map(async (item) => {
//   //       const updatePayload = {
//   //         Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
//   //         Stock_In_UOM_Qty: item.uom1_qty || 0,
//   //         Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
//   //         Stock_In_UOM3_Qty: item.uom3_qty || 0
//   //       }

//   //       return fetch(`http://${window.location.hostname}:4000/api/stock-detail/${item.ID}`, {
//   //         method: 'PUT',
//   //         headers: { 'Content-Type': 'application/json' },
//   //         body: JSON.stringify(updatePayload)
//   //       })
//   //     })

//   //     const responses = await Promise.all(updatePromises)
//   //     const allSuccessful = responses.every(response => response.ok)

//   //     if (allSuccessful) {
//   //       setMessage({ type: 'success', text: 'Purchase voucher updated successfully!' })
//   //       setTimeout(() => {
//   //         onSuccess()
//   //         onClose()
//   //       }, 1500)
//   //     } else {
//   //       setMessage({ type: 'error', text: 'Failed to update some items' })
//   //     }
//   //   } catch (error) {
//   //     setMessage({ type: 'error', text: 'Failed to update purchase voucher' })
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }







// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault()
//   setLoading(true)

//   try {
//     const updatePromises = voucherItems.map(async (item) => {
//       const updatePayload = {
//         Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
//         Stock_In_UOM_Qty: item.uom1_qty || 0,
//         Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
//         Stock_In_UOM3_Qty: item.uom3_qty || 0
//         // Note: Purchase vouchers typically don't have Sale_Unit or discounts
//       }

//       // FIXED: Use correct API path
//       return fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatePayload)
//       })
//     })

//     const responses = await Promise.all(updatePromises)
//     const allSuccessful = responses.every(response => response.ok)

//     if (allSuccessful) {
//       setMessage({ type: 'success', text: 'Purchase voucher updated successfully!' })
//       setTimeout(() => {
//         onSuccess()
//         onClose()
//       }, 1500)
//     } else {
//       setMessage({ type: 'error', text: 'Failed to update some items' })
//     }
//   } catch (error) {
//     setMessage({ type: 'error', text: 'Failed to update purchase voucher' })
//   } finally {
//     setLoading(false)
//   }
// }











//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 flex items-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
//           <span>Loading purchase voucher...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        
//         {/* Header */}
//         <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <div>
//             <h2 className="text-xl font-bold">Purchase Voucher</h2>
//             <p className="text-sm opacity-90">Edit GRN: {voucherData.Number}</p>
//           </div>
//           <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">
//             ×
//           </button>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div className={`m-4 p-3 rounded-lg ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-6">
//           {/* Voucher Header - Read Only */}
//           <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
//             <h3 className="font-bold text-gray-800 mb-3">Voucher Information (Read Only)</h3>
//             <div className="grid grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">GRN No</label>
//                 <input value={voucherData.Number} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input value={voucherData.Date} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
//                 <input value={voucherData.Supplier} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <input value={voucherData.Status} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//             </div>
//           </div>

//           {/* Items Table */}
//           <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
//             <div className="bg-gray-50 p-3 border-b">
//               <h3 className="font-bold text-gray-800">Purchase Voucher Items ({voucherItems.length})</h3>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-blue-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Line</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Batch No</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700 bg-green-50">Quantity</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700 bg-yellow-50">Price</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700 bg-green-50">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {voucherItems.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-center font-medium">{item.Line_Id}</td>
                      
//                       <td className="px-4 py-3">
//                         <input 
//                           value={item.Batch_Number} 
//                           className="w-full p-2 bg-gray-100 border rounded-md text-sm" 
//                           disabled 
//                         />
//                       </td>
                      
//                       <td className="px-4 py-3">
//                         <input 
//                           value={item.Item_Name} 
//                           className="w-full p-2 bg-gray-100 border rounded-md text-sm" 
//                           disabled 
//                         />
//                       </td>
                      
//                       <td className="px-4 py-3 bg-green-50">
//                         <UomConverter
//                           itemId={item.Item_ID}
//                           onChange={(values) => handleUomChange(index, values)}
//                           initialValues={{
//                             uom1_qty: item.uom1_qty.toString(),
//                             uom2_qty: item.uom2_qty.toString(),
//                             uom3_qty: item.uom3_qty.toString(),
//                             sale_unit: item.sale_unit
//                           }}
//                           isPurchase={true}
//                         />
//                       </td>
                      
//                       <td className="px-4 py-3 bg-yellow-50">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.Stock_Price || ''}
//                           onChange={(e) => updatePrice(index, e.target.value)}
//                           className="w-24 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                         />
//                         {item.originalPrice !== item.Stock_Price && (
//                           <div className="text-xs text-green-600 mt-1">
//                             Was: {item.originalPrice}
//                           </div>
//                         )}
//                       </td>
                      
//                       <td className="px-4 py-3 text-center bg-green-50 font-bold text-green-700">
//                         {calculateTotal(item).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Net Amount Summary */}
//           <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
//             <div className="flex justify-end">
//               <div className="text-right">
//                 <div className="text-lg font-semibold text-gray-700 mb-1">
//                   Net Amount: <span className="text-green-600">{calculateNetAmount().toFixed(2)}</span>
//                 </div>
//                 <div className="text-xl font-bold text-green-600">
//                   Grand Total: {calculateNetAmount().toFixed(2)}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3">
//             <button 
//               type="button" 
//               onClick={onClose} 
//               className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={loading} 
//               className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
//             >
//               {loading ? 'Updating...' : 'Update Purchase Voucher'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }








































































// 'use client'
// import React, { useState, useEffect } from 'react'
// import UomConverter from '@/components/UomConverter'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { VoucherData, VoucherItem } from '@/lib/types'

// interface PurchaseVoucherProps {
//   grnId: number
//   onClose: () => void
//   onSuccess: () => void
// }

// export function PurchaseVoucher({ grnId, onClose, onSuccess }: PurchaseVoucherProps) {
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
//   const [showConfirmation, setShowConfirmation] = useState(false)
  
//   const [voucherData, setVoucherData] = useState<VoucherData>({
//     Number: '',
//     Date: '',
//     Supplier: '',
//     Status: ''
//   })

//   const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])
//   const [canEdit, setCanEdit] = useState(true)
//   const [hasGeneratedVouchers, setHasGeneratedVouchers] = useState(false)

//   useEffect(() => {
//     if (grnId) {
//       loadGrnData()
//     }
//   }, [grnId])

//   const loadGrnData = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/grn/${grnId}`)
//       const result = await response.json()
      
//       if (result.success) {
//         const grn = result.data
        
//         setVoucherData({
//           Number: grn.Number,
//           Date: grn.Date.split('T')[0],
//           Supplier: grn.account?.acName || '',
//           Status: grn.Status
//         })

//         const items = grn.details?.map((detail: any) => ({
//           ID: detail.ID,
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item_Name: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           uom1_qty: detail.Stock_In_UOM_Qty || 0,
//           uom2_qty: detail.Stock_In_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_In_UOM3_Qty || 0,
//           sale_unit: 'uom1', // Default for purchase
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item,
//           originalPrice: detail.Stock_Price || 0,
//           // Purchase vouchers typically don't have discounts, but we'll include them
//           Discount_A: parseFloat(detail.Discount_A) || 0,
//           Discount_B: parseFloat(detail.Discount_B) || 0,
//           Discount_C: parseFloat(detail.Discount_C) || 0,
//           originalDiscountA: parseFloat(detail.Discount_A) || 0,
//           originalDiscountB: parseFloat(detail.Discount_B) || 0,
//           originalDiscountC: parseFloat(detail.Discount_C) || 0,
//           // FIXED: Add voucher generation tracking
//           is_Voucher_Generated: detail.is_Voucher_Generated || false
//         })) || []
        
//         setVoucherItems(items)
        
//         // Check if any vouchers are already generated
//         const hasGenerated = items.some(item => item.is_Voucher_Generated)
//         setHasGeneratedVouchers(hasGenerated)
//         setCanEdit(!hasGenerated)
//       }
//     } catch (error) {
//       console.error('Error loading GRN:', error)
//       setMessage({ type: 'error', text: 'Failed to load GRN data' })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const handleUomChange = (index: number, values: any) => {
//     if (!canEdit) return
    
//     const updated = [...voucherItems]
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       sale_unit: values.sale_unit || 'uom1'
//     }
//     setVoucherItems(updated)
//   }

//   const updatePrice = (index: number, value: string) => {
//     if (!canEdit) return
//     const updated = [...voucherItems]
//     updated[index].Stock_Price = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   // Calculate total based on selected sale unit quantity
//   const calculateTotal = (item: VoucherItem): number => {
//     const price = parseFloat(item.Stock_Price.toString()) || 0
//     let quantity = 0
    
//     switch (item.sale_unit) {
//       case 'uom1':
//         quantity = parseFloat(item.uom1_qty.toString()) || 0
//         break
//       case 'uomTwo':
//         quantity = parseFloat(item.uom2_qty.toString()) || 0
//         break
//       case 'uomThree':
//         quantity = parseFloat(item.uom3_qty.toString()) || 0
//         break
//       default:
//         quantity = parseFloat(item.uom1_qty.toString()) || 0
//     }
    
//     return price * quantity
//   }

//   const calculateNetAmount = (): number => {
//     return voucherItems.reduce((total, item) => total + calculateTotal(item), 0)
//   }

//   const handleSubmitClick = () => {
//     if (!canEdit) {
//       setMessage({ type: 'error', text: 'Cannot update voucher - already generated!' })
//       return
//     }
//     setShowConfirmation(true)
//   }

//   const handleConfirmSubmit = async () => {
//     setShowConfirmation(false)
//     setLoading(true)

//     try {
//       const updatePromises = voucherItems.map(async (item) => {
//         const updatePayload = {
//           Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
//           Stock_In_UOM_Qty: item.uom1_qty || 0,
//           Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
//           Stock_In_UOM3_Qty: item.uom3_qty || 0,
//           // FIXED: Mark voucher as generated
//           is_Voucher_Generated: true
//         }

//         return fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(updatePayload)
//         })
//       })

//       const responses = await Promise.all(updatePromises)
//       const allSuccessful = responses.every(response => response.ok)

//       if (allSuccessful) {
//         setMessage({ type: 'success', text: 'Purchase voucher generated successfully!' })
//         setTimeout(() => {
//           onSuccess()
//           onClose()
//         }, 1500)
//       } else {
//         setMessage({ type: 'error', text: 'Failed to generate some voucher items' })
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to generate purchase voucher' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 flex items-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
//           <span>Loading purchase voucher...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] overflow-auto">
          
//           {/* Header with Status Indicator */}
//           <div className={`text-white p-4 flex justify-between items-center rounded-t-xl ${
//             hasGeneratedVouchers ? 'bg-green-600' : 'bg-green-600'
//           }`}>
//             <div>
//               <div className="flex items-center">
//                 <h2 className="text-xl font-bold">Purchase Voucher</h2>
//                 {hasGeneratedVouchers && (
//                   <span className="ml-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
//                     GENERATED
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm opacity-90">GRN: {voucherData.Number}</p>
//             </div>
//             <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">
//               ×
//             </button>
//           </div>

//           {/* Message */}
//           {message.text && (
//             <div className={`m-4 p-3 rounded-lg ${
//               message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//               {message.text}
//             </div>
//           )}

//           {!canEdit && (
//             <div className="m-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//                 <span className="text-yellow-800 font-medium">
//                   This voucher has already been generated and cannot be modified.
//                 </span>
//               </div>
//             </div>
//           )}

//           <form onSubmit={(e) => { e.preventDefault(); handleSubmitClick(); }} className="p-6">
//             {/* Voucher Header - Read Only */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
//               <h3 className="font-bold text-gray-800 mb-3">Voucher Information (Read Only)</h3>
//               <div className="grid grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">GRN No</label>
//                   <input value={voucherData.Number} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input value={voucherData.Date} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
//                   <input value={voucherData.Supplier} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <input value={voucherData.Status} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//               </div>
//             </div>

//             {/* Items Table */}
//             <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
//               <div className="bg-gray-50 p-3 border-b">
//                 <h3 className="font-bold text-gray-800">Purchase Voucher Items ({voucherItems.length})</h3>
//               </div>
              
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-green-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left font-semibold text-gray-700">Line</th>
//                       <th className="px-4 py-3 text-left font-semibold text-gray-700">Batch No</th>
//                       <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
//                       <th className="px-4 py-3 text-center font-semibold text-gray-700 bg-green-100">Quantity</th>
//                       <th className="px-4 py-3 text-center font-semibold text-gray-700 bg-yellow-50">Price</th>
//                       <th className="px-4 py-3 text-center font-semibold text-gray-700 bg-green-100">Total</th>
//                       <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {voucherItems.map((item, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 text-center font-medium">{item.Line_Id}</td>
                        
//                         <td className="px-4 py-3">
//                           <input 
//                             value={item.Batch_Number} 
//                             className="w-full p-2 bg-gray-100 border rounded-md text-sm" 
//                             disabled 
//                           />
//                         </td>
                        
//                         <td className="px-4 py-3">
//                           <input 
//                             value={item.Item_Name} 
//                             className="w-full p-2 bg-gray-100 border rounded-md text-sm" 
//                             disabled 
//                           />
//                         </td>
                        
//                         <td className="px-4 py-3 bg-green-100">
//                           <UomConverter
//                             itemId={item.Item_ID}
//                             onChange={(values) => handleUomChange(index, values)}
//                             initialValues={{
//                               uom1_qty: item.uom1_qty.toString(),
//                               uom2_qty: item.uom2_qty.toString(),
//                               uom3_qty: item.uom3_qty.toString(),
//                               sale_unit: item.sale_unit
//                             }}
//                             isPurchase={true}
//                             disabled={!canEdit}
//                           />
//                         </td>
                        
//                         <td className="px-4 py-3 bg-yellow-50">
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={item.Stock_Price || ''}
//                             onChange={(e) => updatePrice(index, e.target.value)}
//                             className={`w-24 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
//                               !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
//                             }`}
//                             disabled={!canEdit}
//                           />
//                           {item.originalPrice !== item.Stock_Price && (
//                             <div className="text-xs text-green-600 mt-1">
//                               Was: {item.originalPrice}
//                             </div>
//                           )}
//                         </td>
                        
//                         <td className="px-4 py-3 text-center bg-green-100 font-bold text-green-700">
//                           {calculateTotal(item).toFixed(2)}
//                         </td>

//                         <td className="px-4 py-3 text-center">
//                           <span className={`px-2 py-1 rounded text-xs font-bold ${
//                             item.is_Voucher_Generated 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {item.is_Voucher_Generated ? 'Generated' : 'Pending'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Net Amount Summary */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
//               <div className="flex justify-end">
//                 <div className="text-right">
//                   <div className="text-lg font-semibold text-gray-700 mb-1">
//                     Net Amount: <span className="text-green-600">{calculateNetAmount().toFixed(2)}</span>
//                   </div>
//                   <div className="text-2xl font-bold text-green-600">
//                     Grand Total: {calculateNetAmount().toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-3">
//               <button 
//                 type="button" 
//                 onClick={onClose} 
//                 className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
//               >
//                 {canEdit ? 'Cancel' : 'Close'}
//               </button>
//               {canEdit && (
//                 <button 
//                   type="submit" 
//                   disabled={loading} 
//                   className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                       Generate Purchase Voucher
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showConfirmation}
//         onClose={() => setShowConfirmation(false)}
//         onConfirm={handleConfirmSubmit}
//         title="Generate Purchase Voucher"
//         message="Are you sure you want to generate this purchase voucher? This action will mark all items as voucher generated and cannot be undone."
//         confirmText="Yes, Generate Voucher"
//         cancelText="Cancel"
//         type="info"
//         loading={loading}
//       />
//     </>
//   )
// }































































// 'use client'
// import React, { useState, useEffect } from 'react'
// import UomConverter from '@/components/UomConverter'
// import { ConfirmationModal } from '@/components/common/ConfirmationModal'
// import { VoucherData, VoucherItem, CarriageAccount } from '@/lib/types'

// interface PurchaseVoucherProps {
//   grnId: number
//   mode: 'create' | 'edit'
//   onClose: () => void
//   onSuccess: () => void
// }

// export function PurchaseVoucher({ grnId, mode, onClose, onSuccess }: PurchaseVoucherProps) {
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
//   const [showConfirmation, setShowConfirmation] = useState(false)
  
//   const [voucherData, setVoucherData] = useState<VoucherData>({
//     Number: '',
//     Date: '',
//     Supplier: '',
//     Status: '',
//     Carriage_Amount: 0,
//     Carriage_ID: undefined
//   })
  
//   const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])
//   const [batchGroups, setBatchGroups] = useState<any>({})
//   const [carriageAccounts, setCarriageAccounts] = useState<CarriageAccount[]>([])

//   useEffect(() => {
//     if (grnId) {
//       loadGrnData()
//       loadCarriageAccounts()
//     }
//   }, [grnId])

//   // Load carriage accounts
//   const loadCarriageAccounts = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/by-coa-type-carriage`)
//       const result = await response.json()
      
//       if (result.success && result.data) {
//         console.log('🚚 Loaded carriage accounts:', result.data)
//         setCarriageAccounts(result.data)
//       }
//     } catch (error) {
//       console.error('Error loading carriage accounts:', error)
//     }
//   }

//   const loadGrnData = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/grn/${grnId}`)
//       const result = await response.json()
      
//       if (result.success) {
//         const grn = result.data
        
//         setVoucherData({
//           Number: grn.Number,
//           Date: grn.Date.split('T')[0],
//           Supplier: grn.account?.acName || '',
//           Status: grn.Status,
//           Carriage_Amount: parseFloat(grn.Carriage_Amount) || 0,
//           Carriage_ID: grn.Carriage_ID || undefined
//         })

//         const items: VoucherItem[] = grn.details?.map((detail: any) => ({
//           ID: detail.ID,
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item_Name: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           // PURCHASE: Use Stock_In_* fields
//           uom1_qty: detail.Stock_In_UOM_Qty || 0,
//           uom2_qty: detail.Stock_In_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_In_UOM3_Qty || 0,
//           sale_unit: 'uom1', // Default for purchase
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item,
//           originalPrice: detail.Stock_Price || 0,
//           Discount_A: parseFloat(detail.Discount_A) || 0,
//           Discount_B: parseFloat(detail.Discount_B) || 0,
//           Discount_C: parseFloat(detail.Discount_C) || 0,
//           originalDiscountA: parseFloat(detail.Discount_A) || 0,
//           originalDiscountB: parseFloat(detail.Discount_B) || 0,
//           originalDiscountC: parseFloat(detail.Discount_C) || 0,
//           is_Voucher_Generated: grn.is_Voucher_Generated || false
//         })) || []
        
//         setVoucherItems(items)
//         groupItemsByBatch(items)
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to load GRN data' })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const groupItemsByBatch = (items: VoucherItem[]) => {
//     const groups = items.reduce((acc: any, item) => {
//       const batch = item.Batch_Number || 'No Batch'
//       if (!acc[batch]) acc[batch] = []
//       acc[batch].push(item)
//       return acc
//     }, {})
//     setBatchGroups(groups)
//   }

//   const handleUomChange = (itemId: number, values: any) => {
//     const updated = voucherItems.map(item =>
//       item.ID === itemId ? { ...item, ...values } : item
//     )
//     setVoucherItems(updated)
//     groupItemsByBatch(updated)
//   }

//   const updateField = (itemId: number, field: string, value: any) => {
//     const updated = voucherItems.map(item =>
//       item.ID === itemId 
//         ? { ...item, [field]: parseFloat(value) || 0 }
//         : item
//     )
//     setVoucherItems(updated)
//     groupItemsByBatch(updated)
//   }

//   const calculateItemGross = (item: VoucherItem): number => {
//     const price = parseFloat(item.Stock_Price.toString()) || 0
//     let qty = 0
    
//     switch (item.sale_unit) {
//       case 'uom1': qty = parseFloat(item.uom1_qty.toString()) || 0; break
//       case 'uomTwo': qty = parseFloat(item.uom2_qty.toString()) || 0; break
//       case 'uomThree': qty = parseFloat(item.uom3_qty.toString()) || 0; break
//       default: qty = parseFloat(item.uom1_qty.toString()) || 0
//     }
    
//     return price * qty
//   }

//   const calculateItemNet = (item: VoucherItem): number => {
//     const gross = calculateItemGross(item)
//     const discA = gross * (item.Discount_A || 0) / 100
//     const afterA = gross - discA
//     const discB = afterA * (item.Discount_B || 0) / 100
//     const afterB = afterA - discB
//     const discC = afterB * (item.Discount_C || 0) / 100
//     return afterB - discC
//   }

//   const calculateBatchGross = (batchItems: VoucherItem[]): number => {
//     return batchItems.reduce((sum, item) => sum + calculateItemGross(item), 0)
//   }

//   const calculateBatchNet = (batchItems: VoucherItem[]): number => {
//     return batchItems.reduce((sum, item) => sum + calculateItemNet(item), 0)
//   }

//   const calculateGrandGross = (): number => {
//     return Object.values(batchGroups).reduce((total: number, batchItems: any) => 
//       total + calculateBatchGross(batchItems), 0)
//   }

//   const calculateGrandNet = (): number => {
//     return Object.values(batchGroups).reduce((total: number, batchItems: any) => 
//       total + calculateBatchNet(batchItems), 0)
//   }

//   const calculateFinalTotal = (): number => {
//     return calculateGrandNet() + (parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0)
//   }

//   const handleSubmitClick = () => setShowConfirmation(true)

//   const handleConfirmSubmit = async () => {
//     setShowConfirmation(false)
//     setLoading(true)

//     try {
//       // Update stock details (PURCHASE uses Stock_In_* fields)
//       await Promise.all(voucherItems.map(item =>
//         fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
//             // PURCHASE: Use Stock_In_* fields
//             Stock_In_UOM_Qty: item.uom1_qty || 0,
//             Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
//             Stock_In_UOM3_Qty: item.uom3_qty || 0,
//             Discount_A: parseFloat(item.Discount_A.toString()) || 0,
//             Discount_B: parseFloat(item.Discount_B.toString()) || 0,
//             Discount_C: parseFloat(item.Discount_C.toString()) || 0
//           })
//         })
//       ))

//       // Update stock main with carriage
//       await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${grnId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           is_Voucher_Generated: mode === 'create' ? true : undefined,
//           Carriage_Amount: parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0,
//           Carriage_ID: voucherData.Carriage_ID || null
//         })
//       })

//       setMessage({ 
//         type: 'success', 
//         text: mode === 'create' ? 'Purchase voucher generated successfully!' : 'Purchase voucher updated successfully!' 
//       })
//       setTimeout(() => { onSuccess(); onClose() }, 1500)

//     } catch (error) {
//       console.error('Purchase voucher operation error:', error)
//       setMessage({ type: 'error', text: 'Operation failed' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center">
//           <div className="animate-spin h-6 w-6 border-3 border-green-500 border-t-transparent rounded-full mr-3"></div>
//           <span className="text-gray-700 font-medium">Loading purchase voucher...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
          
//           {/* Header */}
//           <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-xl flex-shrink-0">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-white bg-opacity-20 rounded-lg p-2">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-bold">Purchase Voucher</h2>
//                   <div className="flex items-center space-x-4 text-sm text-green-100">
//                     <span>#{voucherData.Number}</span>
//                     <span>{voucherData.Date}</span>
//                     <span>{voucherData.Supplier}</span>
//                   </div>
//                 </div>
//               </div>
//               <button onClick={onClose} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           {message.text && (
//             <div className={`mx-4 mt-3 p-3 rounded-lg border-l-4 flex items-center flex-shrink-0 ${
//               message.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'
//             }`}>
//               {message.text}
//             </div>
//           )}

//           {/* Main Content */}
//           <div className="flex-1 flex overflow-hidden">
            
//             {/* Left: Items (70%) */}
//             <div className="flex-1 p-4 overflow-y-auto">
//               <div className="space-y-3">
//                 {Object.entries(batchGroups).map(([batchNumber, batchItems]: [string, any]) => (
//                   <div key={batchNumber} className="bg-white border border-gray-300 rounded-lg shadow-sm">
                    
//                     {/* Batch Header */}
//                     <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
//                       <div className="flex items-center space-x-2">
//                         <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
//                           {batchNumber}
//                         </span>
//                         <span className="text-sm text-gray-700">{batchItems.length} items</span>
//                       </div>
//                       <div className="flex space-x-3 text-sm">
//                         <span>Gross: <strong>{calculateBatchGross(batchItems).toFixed(2)}</strong></span>
//                         <span className="text-green-600">Net: <strong>{calculateBatchNet(batchItems).toFixed(2)}</strong></span>
//                       </div>
//                     </div>
                    
//                     {/* Items */}
//                     <div className="p-3 space-y-3">
//                       {batchItems.map((item: VoucherItem) => (
//                         <div key={item.ID} className="bg-gray-50 rounded-lg p-3 border">
                          
//                           {/* Item Header with Net/Gross */}
//                           <div className="flex justify-between items-center mb-3">
//                             <div className="flex items-center space-x-2">
//                               <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">#{item.Line_Id}</span>
//                               <span className="font-medium text-gray-800">{item.Item_Name}</span>
//                             </div>
//                             <div className="flex space-x-3 text-sm">
//                               <span>Gross: <strong>{calculateItemGross(item).toFixed(2)}</strong></span>
//                               <span className="text-green-600">Net: <strong>{calculateItemNet(item).toFixed(2)}</strong></span>
//                             </div>
//                           </div>

//                           {/* Controls */}
//                           <div className="grid grid-cols-10 gap-3 items-end">
                            
//                             {/* UOM - 5 cols */}
//                             <div className="col-span-5">
//                               <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity & Unit</label>
//                               <UomConverter
//                                 itemId={item.Item_ID}
//                                 onChange={(values) => handleUomChange(item.ID, values)}
//                                 initialValues={{
//                                   uom1_qty: item.uom1_qty.toString(),
//                                   uom2_qty: item.uom2_qty.toString(),
//                                   uom3_qty: item.uom3_qty.toString(),
//                                   sale_unit: item.sale_unit
//                                 }}
//                                 isPurchase={true}
//                               />
//                             </div>
                            
//                             {/* Price - 2 cols */}
//                             <div className="col-span-2">
//                               <label className="block text-xs font-semibold text-gray-700 mb-1">Price</label>
//                               <div className="relative">
//                                 <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
//                                 <input
//                                   type="number"
//                                   step="0.01"
//                                   value={item.Stock_Price || ''}
//                                   onChange={(e) => updateField(item.ID, 'Stock_Price', e.target.value)}
//                                   className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500"
//                                   placeholder="0.00"
//                                 />
//                               </div>
//                             </div>
                            
//                             {/* Discounts - 3 cols */}
//                             <div className="col-span-3">
//                               <label className="block text-xs font-semibold text-gray-700 mb-1">Discounts (%)</label>
//                               <div className="grid grid-cols-3 gap-1">
//                                 <input
//                                   type="number"
//                                   step="0.01"
//                                   value={item.Discount_A || ''}
//                                   onChange={(e) => updateField(item.ID, 'Discount_A', e.target.value)}
//                                   className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-green-500"
//                                   placeholder="A%"
//                                 />
//                                 <input
//                                   type="number"
//                                   step="0.01"
//                                   value={item.Discount_B || ''}
//                                   onChange={(e) => updateField(item.ID, 'Discount_B', e.target.value)}
//                                   className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-green-500"
//                                   placeholder="B%"
//                                 />
//                                 <input
//                                   type="number"
//                                   step="0.01"
//                                   value={item.Discount_C || ''}
//                                   onChange={(e) => updateField(item.ID, 'Discount_C', e.target.value)}
//                                   className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-green-500"
//                                   placeholder="C%"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right: Summary & Carriage (30%) */}
//             <div className="w-96 bg-gray-50 border-l p-4 overflow-y-auto">
              
//               {/* Carriage Section */}
//               <div className="bg-white rounded-lg border p-4 mb-4">
//                 <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center">
//                   <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
//                   </svg>
//                   Carriage & Transport
//                 </h4>
                
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Transporter</label>
//                     <select
//                       value={voucherData.Carriage_ID || ''}
//                       onChange={(e) => {
//                         setVoucherData(prev => ({
//                           ...prev,
//                           Carriage_ID: parseInt(e.target.value) || undefined
//                         }))
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
//                     >
//                       <option value="">Select Transporter</option>
//                       {carriageAccounts.map((account) => (
//                         <option key={account.id} value={account.id}>
//                           {account.acName} - {account.city}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-xs font-semibold text-gray-700 mb-1">Carriage Amount</label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={voucherData.Carriage_Amount || ''}
//                         onChange={(e) => setVoucherData(prev => ({
//                           ...prev,
//                           Carriage_Amount: parseFloat(e.target.value) || 0
//                         }))}
//                         className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500"
//                         placeholder="0.00"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Batch Summary */}
//               <div className="bg-white rounded-lg border p-4 mb-4">
//                 <h4 className="font-bold text-sm text-gray-800 mb-3">Batch Summary</h4>
//                 <div className="space-y-2">
//                   {Object.entries(batchGroups).map(([batch, items]: [string, any]) => (
//                     <div key={batch} className="bg-gray-50 rounded p-2">
//                       <div className="flex justify-between items-center text-xs">
//                         <span className="font-medium">{batch} ({items.length})</span>
//                         <div className="flex space-x-2">
//                           <span>G: <strong>{calculateBatchGross(items).toFixed(2)}</strong></span>
//                           <span className="text-green-600">N: <strong>{calculateBatchNet(items).toFixed(2)}</strong></span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Grand Total Card */}
//               <div className="bg-white rounded-lg border-2 border-green-200 p-4">
//                 <h4 className="font-bold text-sm text-gray-800 mb-3">Total Summary</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Items:</span>
//                     <span className="font-bold">{voucherItems.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Batches:</span>
//                     <span className="font-bold">{Object.keys(batchGroups).length}</span>
//                   </div>
//                   <hr />
//                   <div className="flex justify-between">
//                     <span>Gross Amount:</span>
//                     <span className="font-bold">₨ {calculateGrandGross().toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Net Amount:</span>
//                     <span className="font-bold text-green-600">₨ {calculateGrandNet().toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Carriage:</span>
//                     <span className="font-bold text-orange-600">₨ {(voucherData.Carriage_Amount || 0).toFixed(2)}</span>
//                   </div>
//                   <hr className="border-2 border-green-200" />
//                   <div className="flex justify-between text-lg bg-green-50 p-2 rounded">
//                     <span className="font-bold">Final Total:</span>
//                     <span className="font-bold text-green-700">₨ {calculateFinalTotal().toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="bg-gray-100 border-t p-4 flex justify-end space-x-3 flex-shrink-0">
//             <button 
//               onClick={onClose} 
//               className="px-6 py-2 bg-white border hover:bg-gray-50 text-gray-700 rounded-lg font-medium"
//             >
//               Cancel
//             </button>
//             <button 
//               onClick={handleSubmitClick}
//               disabled={loading} 
//               className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   {mode === 'create' ? 'Generate Voucher' : 'Update Voucher'}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={showConfirmation}
//         onClose={() => setShowConfirmation(false)}
//         onConfirm={handleConfirmSubmit}
//         title={mode === 'create' ? 'Generate Purchase Voucher' : 'Update Purchase Voucher'}
//         message={`${mode === 'create' ? 'Generate' : 'Update'} purchase voucher with Final Total: ₨${calculateFinalTotal().toFixed(2)} (including carriage)?`}
//         confirmText={mode === 'create' ? 'Generate Voucher' : 'Update Voucher'}
//         type="info"
//         loading={loading}
//       />
//     </>
//   )
// }





























































'use client'
import React, { useState, useEffect } from 'react'
import UomConverter from '@/components/UomConverter'
import { ConfirmationModal } from '@/components/common/ConfirmationModal'

interface VoucherData {
  Number: string
  Date: string
  Supplier: string
  Status: string
  Carriage_Amount: number
  Carriage_ID?: number
}

interface VoucherItem {
  ID: number
  Line_Id: number
  Batch_Number: string
  Item_Name: string
  Item_ID: number
  // PURCHASE: Use Stock_In_* fields
  uom1_qty: number
  uom2_qty: number
  uom3_qty: number
  sale_unit: string
  Stock_Price: number
  item: any
  originalPrice: number
  Discount_A: number
  Discount_B: number
  Discount_C: number
  originalDiscountA: number
  originalDiscountB: number
  originalDiscountC: number
  is_Voucher_Generated: boolean
}

interface CarriageAccount {
  id: number
  acName: string
  city: string
}

interface PurchaseVoucherProps {
  grnId: number
  mode: 'create' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

export function PurchaseVoucher({ grnId, mode, onClose, onSuccess }: PurchaseVoucherProps) {
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const [voucherData, setVoucherData] = useState<VoucherData>({
    Number: '',
    Date: '',
    Supplier: '',
    Status: '',
    Carriage_Amount: 0,
    Carriage_ID: undefined
  })
  
  const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])
  const [batchGroups, setBatchGroups] = useState<any>({})
  const [carriageAccounts, setCarriageAccounts] = useState<CarriageAccount[]>([])

  useEffect(() => {
    if (grnId) {
      loadGrnData()
      loadCarriageAccounts()
    }
  }, [grnId])

  // Load carriage accounts
  const loadCarriageAccounts = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/by-coa-type-carriage`)
      const result = await response.json()
      
      if (result.success && result.data) {
        console.log('🚚 Loaded carriage accounts:', result.data)
        setCarriageAccounts(result.data)
      }
    } catch (error) {
      console.error('Error loading carriage accounts:', error)
    }
  }

  const loadGrnData = async () => {
    setFetchLoading(true)
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/grn/${grnId}`)
      const result = await response.json()
      
      if (result.success) {
        const grn = result.data
        
        setVoucherData({
          Number: grn.Number,
          Date: grn.Date.split('T')[0],
          Supplier: grn.account?.acName || '',
          Status: grn.Status,
          Carriage_Amount: parseFloat(grn.Carriage_Amount) || 0,
          Carriage_ID: grn.Carriage_ID || undefined
        })

        const items: VoucherItem[] = grn.details?.map((detail: any) => ({
          ID: detail.ID,
          Line_Id: detail.Line_Id,
          Batch_Number: detail.batchno || '',
          Item_Name: detail.item?.itemName || '',
          Item_ID: detail.Item_ID,
          // PURCHASE: Use Stock_In_* fields
          uom1_qty: detail.Stock_In_UOM_Qty || 0,
          uom2_qty: detail.Stock_In_SKU_UOM_Qty || 0,
          uom3_qty: detail.Stock_In_UOM3_Qty || 0,
          sale_unit: 'uom1', // Default for purchase
          Stock_Price: detail.Stock_Price || 0,
          item: detail.item,
          originalPrice: detail.Stock_Price || 0,
          Discount_A: parseFloat(detail.Discount_A) || 0,
          Discount_B: parseFloat(detail.Discount_B) || 0,
          Discount_C: parseFloat(detail.Discount_C) || 0,
          originalDiscountA: parseFloat(detail.Discount_A) || 0,
          originalDiscountB: parseFloat(detail.Discount_B) || 0,
          originalDiscountC: parseFloat(detail.Discount_C) || 0,
          is_Voucher_Generated: grn.is_Voucher_Generated || false
        })) || []
        
        setVoucherItems(items)
        groupItemsByBatch(items)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load GRN data' })
    } finally {
      setFetchLoading(false)
    }
  }

  const groupItemsByBatch = (items: VoucherItem[]) => {
    const groups = items.reduce((acc: any, item) => {
      const batch = item.Batch_Number || 'No Batch'
      if (!acc[batch]) acc[batch] = []
      acc[batch].push(item)
      return acc
    }, {})
    setBatchGroups(groups)
  }

  const handleUomChange = (itemId: number, values: any) => {
    const updated = voucherItems.map(item =>
      item.ID === itemId ? { ...item, ...values } : item
    )
    setVoucherItems(updated)
    groupItemsByBatch(updated)
  }

  const updateField = (itemId: number, field: string, value: any) => {
    const updated = voucherItems.map(item =>
      item.ID === itemId 
        ? { ...item, [field]: parseFloat(value) || 0 }
        : item
    )
    setVoucherItems(updated)
    groupItemsByBatch(updated)
  }

  const calculateItemGross = (item: VoucherItem): number => {
    const price = parseFloat(item.Stock_Price.toString()) || 0
    let qty = 0
    
    switch (item.sale_unit) {
      case 'uom1': qty = parseFloat(item.uom1_qty.toString()) || 0; break
      case 'uomTwo': qty = parseFloat(item.uom2_qty.toString()) || 0; break
      case 'uomThree': qty = parseFloat(item.uom3_qty.toString()) || 0; break
      default: qty = parseFloat(item.uom1_qty.toString()) || 0
    }
    
    return price * qty
  }

  const calculateItemNet = (item: VoucherItem): number => {
    const gross = calculateItemGross(item)
    const discA = gross * (item.Discount_A || 0) / 100
    const afterA = gross - discA
    const discB = afterA * (item.Discount_B || 0) / 100
    const afterB = afterA - discB
    const discC = afterB * (item.Discount_C || 0) / 100
    return afterB - discC
  }

  const calculateBatchGross = (batchItems: VoucherItem[]): number => {
    return batchItems.reduce((sum, item) => sum + calculateItemGross(item), 0)
  }

  const calculateBatchNet = (batchItems: VoucherItem[]): number => {
    return batchItems.reduce((sum, item) => sum + calculateItemNet(item), 0)
  }

  const calculateGrandGross = (): number => {
    return Object.values(batchGroups).reduce((total: number, batchItems: any) => 
      total + calculateBatchGross(batchItems), 0)
  }

  const calculateGrandNet = (): number => {
    return Object.values(batchGroups).reduce((total: number, batchItems: any) => 
      total + calculateBatchNet(batchItems), 0)
  }

  const calculateFinalTotal = (): number => {
    return calculateGrandNet() + (parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0)
  }

  const handleSubmitClick = () => setShowConfirmation(true)

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false)
    setLoading(true)

    try {
      // STEP 1: Update stock details (PURCHASE uses Stock_In_* fields)
      await Promise.all(voucherItems.map(item =>
        fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
            // PURCHASE: Use Stock_In_* fields
            Stock_In_UOM_Qty: item.uom1_qty || 0,
            Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
            Stock_In_UOM3_Qty: item.uom3_qty || 0,
            Discount_A: parseFloat(item.Discount_A.toString()) || 0,
            Discount_B: parseFloat(item.Discount_B.toString()) || 0,
            Discount_C: parseFloat(item.Discount_C.toString()) || 0
          })
        })
      ))

      // STEP 2: Update stock main with carriage
      await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${grnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_Voucher_Generated: mode === 'create' ? true : undefined,
          Carriage_Amount: parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0,
          Carriage_ID: voucherData.Carriage_ID || null
        })
      })

      // STEP 3: AUTO CREATE/EDIT JOURNAL
      const journalMode = mode === 'create' ? 'create' : 'edit';
      const journalResponse = await fetch(`http://${window.location.hostname}:4000/api/journal-master/post-voucher/${grnId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: journalMode })
      })

      const journalResult = await journalResponse.json()

      if (journalResult.success) {
        setMessage({ 
          type: 'success', 
          text: mode === 'create' 
            ? 'Purchase voucher generated & journal created (UnPost)!' 
            : 'Purchase voucher & journal updated successfully!' 
        })
      } else {
        setMessage({ 
          type: 'success', 
          text: mode === 'create' ? 'Purchase voucher generated (journal warning)!' : 'Purchase voucher updated (journal warning)!' 
        })
        console.warn('Journal warning:', journalResult.error)
      }

      setTimeout(() => { onSuccess(); onClose() }, 1500)

    } catch (error) {
      console.error('Purchase voucher operation error:', error)
      setMessage({ type: 'error', text: 'Operation failed' })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center">
          <div className="animate-spin h-6 w-6 border-3 border-green-500 border-t-transparent rounded-full mr-3"></div>
          <span className="text-gray-700 font-medium">Loading purchase voucher...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-xl flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Purchase Voucher</h2>
                  <div className="flex items-center space-x-4 text-sm text-green-100">
                    <span>#{voucherData.Number}</span>
                    <span>{voucherData.Date}</span>
                    <span>{voucherData.Supplier}</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`mx-4 mt-3 p-3 rounded-lg border-l-4 flex items-center flex-shrink-0 ${
              message.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left: Items (70%) */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {Object.entries(batchGroups).map(([batchNumber, batchItems]: [string, any]) => (
                  <div key={batchNumber} className="bg-white border border-gray-300 rounded-lg shadow-sm">
                    
                    {/* Batch Header */}
                    <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {batchNumber}
                        </span>
                        <span className="text-sm text-gray-700">{batchItems.length} items</span>
                      </div>
                      <div className="flex space-x-3 text-sm">
                        <span>Gross: <strong>{calculateBatchGross(batchItems).toFixed(2)}</strong></span>
                        <span className="text-green-600">Net: <strong>{calculateBatchNet(batchItems).toFixed(2)}</strong></span>
                      </div>
                    </div>
                    
                    {/* Items */}
                    <div className="p-3 space-y-3">
                      {batchItems.map((item: VoucherItem) => (
                        <div key={item.ID} className="bg-gray-50 rounded-lg p-3 border">
                          
                          {/* Item Header with Net/Gross */}
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">#{item.Line_Id}</span>
                              <span className="font-medium text-gray-800">{item.Item_Name}</span>
                            </div>
                            <div className="flex space-x-3 text-sm">
                              <span>Gross: <strong>{calculateItemGross(item).toFixed(2)}</strong></span>
                              <span className="text-green-600">Net: <strong>{calculateItemNet(item).toFixed(2)}</strong></span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="grid grid-cols-10 gap-3 items-end">
                            
                            {/* UOM - 5 cols */}
                            <div className="col-span-5">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity & Unit</label>
                              <UomConverter
                                itemId={item.Item_ID}
                                onChange={(values) => handleUomChange(item.ID, values)}
                                initialValues={{
                                  uom1_qty: item.uom1_qty.toString(),
                                  uom2_qty: item.uom2_qty.toString(),
                                  uom3_qty: item.uom3_qty.toString(),
                                  sale_unit: item.sale_unit
                                }}
                                isPurchase={true}
                              />
                            </div>
                            
                            {/* Price - 2 cols */}
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Price</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Stock_Price || ''}
                                  onChange={(e) => updateField(item.ID, 'Stock_Price', e.target.value)}
                                  className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            
                            {/* Discounts - 3 cols */}
                            <div className="col-span-3">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Discounts (%)</label>
                              <div className="grid grid-cols-3 gap-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_A || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_A', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-green-500"
                                  placeholder="A%"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_B || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_B', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-green-500"
                                  placeholder="B%"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_C || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_C', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-green-500"
                                  placeholder="C%"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary & Carriage (30%) */}
            <div className="w-96 bg-gray-50 border-l p-4 overflow-y-auto">
              
              {/* Carriage Section */}
              <div className="bg-white rounded-lg border p-4 mb-4">
                <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  Carriage & Transport
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Transporter</label>
                    <select
                      value={voucherData.Carriage_ID || ''}
                      onChange={(e) => {
                        setVoucherData(prev => ({
                          ...prev,
                          Carriage_ID: parseInt(e.target.value) || undefined
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Transporter</option>
                      {carriageAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.acName} - {account.city}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Carriage Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        value={voucherData.Carriage_Amount || ''}
                        onChange={(e) => setVoucherData(prev => ({
                          ...prev,
                          Carriage_Amount: parseFloat(e.target.value) || 0
                        }))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grand Total Card */}
              <div className="bg-white rounded-lg border-2 border-green-200 p-4">
                <h4 className="font-bold text-sm text-gray-800 mb-3">Total Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-bold">{voucherItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batches:</span>
                    <span className="font-bold">{Object.keys(batchGroups).length}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span>Gross Amount:</span>
                    <span className="font-bold">₨ {calculateGrandGross().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Amount:</span>
                    <span className="font-bold text-green-600">₨ {calculateGrandNet().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carriage:</span>
                    <span className="font-bold text-orange-600">₨ {(voucherData.Carriage_Amount || 0).toFixed(2)}</span>
                  </div>
                  <hr className="border-2 border-green-200" />
                  <div className="flex justify-between text-lg bg-green-50 p-2 rounded">
                    <span className="font-bold">Final Total:</span>
                    <span className="font-bold text-green-700">₨ {calculateFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t p-4 flex justify-end space-x-3 flex-shrink-0">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-white border hover:bg-gray-50 text-gray-700 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmitClick}
              disabled={loading} 
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {mode === 'create' ? 'Generate Voucher' : 'Update Voucher'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmit}
        title={mode === 'create' ? 'Generate Purchase Voucher' : 'Update Purchase Voucher'}
        message={`${mode === 'create' ? 'Generate' : 'Update'} purchase voucher with Final Total: ₨${calculateFinalTotal().toFixed(2)} (including carriage)?`}
        confirmText={mode === 'create' ? 'Generate Voucher' : 'Update Voucher'}
        type="info"
        loading={loading}
      />
    </>
  )
}
