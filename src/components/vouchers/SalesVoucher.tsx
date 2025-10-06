// 'use client'
// import React, { useState, useEffect } from 'react'
// import UomConverter from '@/components/UomConverter'
// import { VoucherData, VoucherItem } from '@/lib/types'

// interface SalesVoucherProps {
//   dispatchId: number
//   onClose: () => void
//   onSuccess: () => void
// }

// export function SalesVoucher({ dispatchId, onClose, onSuccess }: SalesVoucherProps) {
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })

//   const [voucherData, setVoucherData] = useState<VoucherData>({
//     Number: '',
//     Date: '',
//     Customer: '',
//     Status: ''
//   })

//   const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])

//   useEffect(() => {
//     if (dispatchId) {
//       loadDispatchData()
//     }
//   }, [dispatchId])

//   const loadDispatchData = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`)
//       const result = await response.json()

//       if (result.success) {
//         const dispatch = result.data

//         setVoucherData({
//           Number: dispatch.Number,
//           Date: dispatch.Date.split('T')[0],
//           Customer: dispatch.account?.acName || '',
//           Status: dispatch.Status
//         })

//         const items = dispatch.details?.map((detail: any) => ({
//           ID: detail.ID,
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item_Name: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item,
//           originalPrice: detail.Stock_Price || 0,
//           // FIXED: Add discount fields
//           Discount_A: parseFloat(detail.Discount_A) || 0,
//           Discount_B: parseFloat(detail.Discount_B) || 0,
//           Discount_C: parseFloat(detail.Discount_C) || 0,
//           originalDiscountA: parseFloat(detail.Discount_A) || 0,
//           originalDiscountB: parseFloat(detail.Discount_B) || 0,
//           originalDiscountC: parseFloat(detail.Discount_C) || 0
//         })) || []

//         setVoucherItems(items)
//       }
//     } catch (error) {
//       console.error('Error loading dispatch:', error)
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const getSaleUnitRadioValue = (saleUnitId: string, item: any) => {
//     if (!saleUnitId || !item) return 'uom1'
//     const id = parseInt(saleUnitId)
//     if (id === item?.uom1?.id) return 'uom1'
//     if (id === item?.uomTwo?.id) return 'uomTwo'
//     if (id === item?.uomThree?.id) return 'uomThree'
//     return 'uom1'
//   }

//   const getSaleUnitId = (saleUnit: string, item: any) => {
//     if (!saleUnit || !item) return null
//     switch (saleUnit) {
//       case 'uom1': return item?.uom1?.id || null
//       case 'uomTwo': return item?.uomTwo?.id || null
//       case 'uomThree': return item?.uomThree?.id || null
//       default: return item?.uom1?.id || null
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

//   // FIXED: Add discount update functions
//   const updateDiscountA = (index: number, value: string) => {
//     const updated = [...voucherItems]
//     updated[index].Discount_A = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   const updateDiscountB = (index: number, value: string) => {
//     const updated = [...voucherItems]
//     updated[index].Discount_B = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   const updateDiscountC = (index: number, value: string) => {
//     const updated = [...voucherItems]
//     updated[index].Discount_C = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   // FIXED: Calculate total with discounts applied
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

//     const grossAmount = price * quantity
//     const discountA = parseFloat(item.Discount_A.toString()) || 0
//     const discountB = parseFloat(item.Discount_B.toString()) || 0
//     const discountC = parseFloat(item.Discount_C.toString()) || 0

//     // Apply discounts (assuming they are percentage discounts)
//     const afterDiscountA = grossAmount - (grossAmount * discountA / 100)
//     const afterDiscountB = afterDiscountA - (afterDiscountA * discountB / 100)
//     const finalAmount = afterDiscountB - (afterDiscountB * discountC / 100)

//     return finalAmount
//   }

//   // Calculate gross amount (before discounts)
//   const calculateGrossAmount = (item: VoucherItem): number => {
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

//   const calculateGrossTotal = (): number => {
//     return voucherItems.reduce((total, item) => total + calculateGrossAmount(item), 0)
//   }

//   const calculateTotalDiscounts = (): number => {
//     return calculateGrossTotal() - calculateNetAmount()
//   }

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   setLoading(true)

//   //   try {
//   //     const updatePromises = voucherItems.map(async (item) => {
//   //       const updatePayload = {
//   //         Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
//   //         Stock_out_UOM_Qty: item.uom1_qty || 0,
//   //         Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//   //         Stock_out_UOM3_Qty: item.uom3_qty || 0,
//   //         Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
//   //         // FIXED: Include discount fields in update
//   //         Discount_A: parseFloat(item.Discount_A.toString()) || 0,
//   //         Discount_B: parseFloat(item.Discount_B.toString()) || 0,
//   //         Discount_C: parseFloat(item.Discount_C.toString()) || 0
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
//   //       setMessage({ type: 'success', text: 'Sales voucher updated successfully!' })
//   //       setTimeout(() => {
//   //         onSuccess()
//   //         onClose()
//   //       }, 1500)
//   //     } else {
//   //       setMessage({ type: 'error', text: 'Failed to update some items' })
//   //     }
//   //   } catch (error) {
//   //     setMessage({ type: 'error', text: 'Failed to update sales voucher' })
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
//         Stock_out_UOM_Qty: item.uom1_qty || 0,
//         Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//         Stock_out_UOM3_Qty: item.uom3_qty || 0,
//         Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
//         Discount_A: parseFloat(item.Discount_A.toString()) || 0,
//         Discount_B: parseFloat(item.Discount_B.toString()) || 0,
//         Discount_C: parseFloat(item.Discount_C.toString()) || 0
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
//       setMessage({ type: 'success', text: 'Sales voucher updated successfully!' })
//       setTimeout(() => {
//         onSuccess()
//         onClose()
//       }, 1500)
//     } else {
//       setMessage({ type: 'error', text: 'Failed to update some items' })
//     }
//   } catch (error) {
//     setMessage({ type: 'error', text: 'Failed to update sales voucher' })
//   } finally {
//     setLoading(false)
//   }
// }





//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 flex items-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
//           <span>Loading sales voucher...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] overflow-auto">

//         {/* Header */}
//         <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <div>
//             <h2 className="text-xl font-bold">Sales Voucher</h2>
//             <p className="text-sm opacity-90">Edit Dispatch: {voucherData.Number}</p>
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
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch No</label>
//                 <input value={voucherData.Number} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input value={voucherData.Date} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
//                 <input value={voucherData.Customer} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <input value={voucherData.Status} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//               </div>
//             </div>
//           </div>

//           {/* Items Table with Discounts */}
//           <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
//             <div className="bg-gray-50 p-3 border-b">
//               <h3 className="font-bold text-gray-800">Sales Voucher Items ({voucherItems.length})</h3>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-xs">
//                 <thead className="bg-blue-50">
//                   <tr>
//                     <th className="px-2 py-3 text-left font-semibold text-gray-700 min-w-[60px]">Line</th>
//                     <th className="px-2 py-3 text-left font-semibold text-gray-700 min-w-[100px]">Batch No</th>
//                     <th className="px-2 py-3 text-left font-semibold text-gray-700 min-w-[150px]">Item Name</th>
//                     <th className="px-2 py-3 text-center font-semibold text-gray-700 bg-green-50 min-w-[200px]">Quantity</th>
//                     <th className="px-2 py-3 text-center font-semibold text-gray-700 bg-yellow-50 min-w-[80px]">Price</th>
//                     <th className="px-2 py-3 text-center font-semibold text-gray-700 bg-orange-50 min-w-[80px]">Disc A%</th>
//                     <th className="px-2 py-3 text-center font-semibold text-gray-700 bg-orange-50 min-w-[80px]">Disc B%</th>
//                     <th className="px-2 py-3 text-center font-semibold text-gray-700 bg-orange-50 min-w-[80px]">Disc C%</th>
//                     <th className="px-2 py-3 text-center font-semibold text-gray-700 bg-gray-100 min-w-[80px]">Gross</th>
//                     <th className="px-2 py-3 text-center font-semibold text-gray-700 bg-green-50 min-w-[80px]">Net Total</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {voucherItems.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-2 py-3 text-center font-medium">{item.Line_Id}</td>

//                       <td className="px-2 py-3">
//                         <input 
//                           value={item.Batch_Number} 
//                           className="w-full p-1 bg-gray-100 border rounded text-xs" 
//                           disabled 
//                         />
//                       </td>

//                       <td className="px-2 py-3">
//                         <input 
//                           value={item.Item_Name} 
//                           className="w-full p-1 bg-gray-100 border rounded text-xs" 
//                           disabled 
//                         />
//                       </td>

//                       <td className="px-2 py-3 bg-green-50">
//                         <UomConverter
//                           itemId={item.Item_ID}
//                           onChange={(values) => handleUomChange(index, values)}
//                           initialValues={{
//                             uom1_qty: item.uom1_qty.toString(),
//                             uom2_qty: item.uom2_qty.toString(),
//                             uom3_qty: item.uom3_qty.toString(),
//                             sale_unit: item.sale_unit
//                           }}
//                           isPurchase={false}
//                         />
//                       </td>

//                       <td className="px-2 py-3 bg-yellow-50">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.Stock_Price || ''}
//                           onChange={(e) => updatePrice(index, e.target.value)}
//                           className="w-full px-1 py-1 border rounded text-center text-xs focus:ring-1 focus:ring-blue-500"
//                         />
//                         {item.originalPrice !== item.Stock_Price && (
//                           <div className="text-xs text-blue-600 mt-1">
//                             Was: {item.originalPrice}
//                           </div>
//                         )}
//                       </td>

//                       {/* FIXED: Discount A */}
//                       <td className="px-2 py-3 bg-orange-50">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.Discount_A || ''}
//                           onChange={(e) => updateDiscountA(index, e.target.value)}
//                           className="w-full px-1 py-1 border rounded text-center text-xs focus:ring-1 focus:ring-orange-500"
//                           placeholder="0.00"
//                         />
//                         {item.originalDiscountA !== item.Discount_A && (
//                           <div className="text-xs text-orange-600 mt-1">
//                             Was: {item.originalDiscountA}%
//                           </div>
//                         )}
//                       </td>

//                       {/* FIXED: Discount B */}
//                       <td className="px-2 py-3 bg-orange-50">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.Discount_B || ''}
//                           onChange={(e) => updateDiscountB(index, e.target.value)}
//                           className="w-full px-1 py-1 border rounded text-center text-xs focus:ring-1 focus:ring-orange-500"
//                           placeholder="0.00"
//                         />
//                         {item.originalDiscountB !== item.Discount_B && (
//                           <div className="text-xs text-orange-600 mt-1">
//                             Was: {item.originalDiscountB}%
//                           </div>
//                         )}
//                       </td>

//                       {/* FIXED: Discount C */}
//                       <td className="px-2 py-3 bg-orange-50">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.Discount_C || ''}
//                           onChange={(e) => updateDiscountC(index, e.target.value)}
//                           className="w-full px-1 py-1 border rounded text-center text-xs focus:ring-1 focus:ring-orange-500"
//                           placeholder="0.00"
//                         />
//                         {item.originalDiscountC !== item.Discount_C && (
//                           <div className="text-xs text-orange-600 mt-1">
//                             Was: {item.originalDiscountC}%
//                           </div>
//                         )}
//                       </td>

//                       {/* Gross Amount */}
//                       <td className="px-2 py-3 text-center bg-gray-100 font-medium text-gray-600">
//                         {calculateGrossAmount(item).toFixed(2)}
//                       </td>

//                       {/* Net Total (after discounts) */}
//                       <td className="px-2 py-3 text-center bg-green-50 font-bold text-green-700">
//                         {calculateTotal(item).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Enhanced Net Amount Summary with Discount Breakdown */}
//           <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* <div>
//                 <h4 className="font-semibold text-gray-800 mb-3">Discount Summary</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Total Discount A:</span>
//                     <span className="font-medium">
//                       {voucherItems.reduce((total, item) => total + (item.Discount_A || 0), 0).toFixed(2)}%
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Total Discount B:</span>
//                     <span className="font-medium">
//                       {voucherItems.reduce((total, item) => total + (item.Discount_B || 0), 0).toFixed(2)}%
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Total Discount C:</span>
//                     <span className="font-medium">
//                       {voucherItems.reduce((total, item) => total + (item.Discount_C || 0), 0).toFixed(2)}%
//                     </span>
//                   </div>
//                 </div>
//               </div> */}

//               <div className="text-right">
//                 <div className="space-y-2">
//                   {/* <div className="flex justify-between text-lg">
//                     <span className="font-semibold text-gray-700">Gross Amount:</span>
//                     <span className="font-bold text-gray-800">{calculateGrossTotal().toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-lg text-red-600">
//                     <span className="font-semibold">Total Discounts:</span>
//                     <span className="font-bold">-{calculateTotalDiscounts().toFixed(2)}</span>
//                   </div> */}
//                   <div className="border-t-2 border-gray-300 pt-2">
//                     <div className="flex justify-between text-xl">
//                       <span className="font-bold text-gray-700">Net Amount:</span>
//                       <span className="font-bold text-blue-600">{calculateNetAmount().toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-2xl mt-2">
//                       <span className="font-bold text-gray-800">Grand Total:</span>
//                       <span className="font-bold text-blue-600">{calculateNetAmount().toFixed(2)}</span>
//                     </div>
//                   </div>
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
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Update Sales Voucher
//                 </>
//               )}
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

// interface SalesVoucherProps {
//   dispatchId: number
//   onClose: () => void
//   onSuccess: () => void
// }

// export function SalesVoucher({ dispatchId, onClose, onSuccess }: SalesVoucherProps) {
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
//   const [showConfirmation, setShowConfirmation] = useState(false)

//   const [voucherData, setVoucherData] = useState<VoucherData>({
//     Number: '',
//     Date: '',
//     Customer: '',
//     Status: ''
//   })

//   const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])
//   const [canEdit, setCanEdit] = useState(true)
//   const [isVoucherGenerated, setIsVoucherGenerated] = useState(false)

//   useEffect(() => {
//     if (dispatchId) {
//       loadDispatchData()
//     }
//   }, [dispatchId])

//   const loadDispatchData = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`)
//       const result = await response.json()

//       if (result.success) {
//         const dispatch = result.data

//         // FIXED: Check voucher status from stk_main
//         const voucherGenerated = dispatch.is_Voucher_Generated || false
//         setIsVoucherGenerated(voucherGenerated)
//         setCanEdit(!voucherGenerated)

//         setVoucherData({
//           Number: dispatch.Number,
//           Date: dispatch.Date.split('T')[0],
//           Customer: dispatch.account?.acName || '',
//           Status: dispatch.Status
//         })

//         const items = dispatch.details?.map((detail: any) => ({
//           ID: detail.ID,
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item_Name: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item,
//           originalPrice: detail.Stock_Price || 0,
//           Discount_A: parseFloat(detail.Discount_A) || 0,
//           Discount_B: parseFloat(detail.Discount_B) || 0,
//           Discount_C: parseFloat(detail.Discount_C) || 0,
//           originalDiscountA: parseFloat(detail.Discount_A) || 0,
//           originalDiscountB: parseFloat(detail.Discount_B) || 0,
//           originalDiscountC: parseFloat(detail.Discount_C) || 0,
//           is_Voucher_Generated: voucherGenerated
//         })) || []

//         setVoucherItems(items)
//       }
//     } catch (error) {
//       console.error('Error loading dispatch:', error)
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const getSaleUnitRadioValue = (saleUnitId: string, item: any) => {
//     if (!saleUnitId || !item) return 'uom1'
//     const id = parseInt(saleUnitId)
//     if (id === item?.uom1?.id) return 'uom1'
//     if (id === item?.uomTwo?.id) return 'uomTwo'
//     if (id === item?.uomThree?.id) return 'uomThree'
//     return 'uom1'
//   }

//   const getSaleUnitId = (saleUnit: string, item: any) => {
//     if (!saleUnit || !item) return null
//     switch (saleUnit) {
//       case 'uom1': return item?.uom1?.id || null
//       case 'uomTwo': return item?.uomTwo?.id || null
//       case 'uomThree': return item?.uomThree?.id || null
//       default: return item?.uom1?.id || null
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

//   const updateDiscountA = (index: number, value: string) => {
//     if (!canEdit) return
//     const updated = [...voucherItems]
//     updated[index].Discount_A = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   const updateDiscountB = (index: number, value: string) => {
//     if (!canEdit) return
//     const updated = [...voucherItems]
//     updated[index].Discount_B = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   const updateDiscountC = (index: number, value: string) => {
//     if (!canEdit) return
//     const updated = [...voucherItems]
//     updated[index].Discount_C = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

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

//     const grossAmount = price * quantity
//     const discountA = parseFloat(item.Discount_A.toString()) || 0
//     const discountB = parseFloat(item.Discount_B.toString()) || 0
//     const discountC = parseFloat(item.Discount_C.toString()) || 0

//     const afterDiscountA = grossAmount - (grossAmount * discountA / 100)
//     const afterDiscountB = afterDiscountA - (afterDiscountA * discountB / 100)
//     const finalAmount = afterDiscountB - (afterDiscountB * discountC / 100)

//     return finalAmount
//   }

//   const calculateGrossAmount = (item: VoucherItem): number => {
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

//   const calculateGrossTotal = (): number => {
//     return voucherItems.reduce((total, item) => total + calculateGrossAmount(item), 0)
//   }

//   const calculateTotalDiscounts = (): number => {
//     return calculateGrossTotal() - calculateNetAmount()
//   }

//   const handleSubmitClick = () => {
//     if (!canEdit) {
//       setMessage({ type: 'error', text: 'Cannot modify voucher - already generated!' })
//       return
//     }
//     setShowConfirmation(true)
//   }

//   const handleConfirmSubmit = async () => {
//     setShowConfirmation(false)
//     setLoading(true)

//     try {
//       // STEP 1: Update all stock details (prices, quantities, discounts)
//       const detailUpdatePromises = voucherItems.map(async (item) => {
//         const updatePayload = {
//           Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
//           Stock_out_UOM_Qty: item.uom1_qty || 0,
//           Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//           Stock_out_UOM3_Qty: item.uom3_qty || 0,
//           Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
//           Discount_A: parseFloat(item.Discount_A.toString()) || 0,
//           Discount_B: parseFloat(item.Discount_B.toString()) || 0,
//           Discount_C: parseFloat(item.Discount_C.toString()) || 0
//         }

//         return fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(updatePayload)
//         })
//       })

//       const detailResponses = await Promise.all(detailUpdatePromises)
//       const allDetailsSuccess = detailResponses.every(response => response.ok)

//       if (!allDetailsSuccess) {
//         throw new Error('Failed to update some stock details')
//       }

//       // STEP 2: Update stock main to mark voucher as generated
//       const mainUpdateResponse = await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           is_Voucher_Generated: true
//         })
//       })

//       const mainResult = await mainUpdateResponse.json()

//       if (mainUpdateResponse.ok && mainResult.success) {
//         // STEP 3: Update local state
//         setIsVoucherGenerated(true)
//         setCanEdit(false)

//         setMessage({ type: 'success', text: 'Sales voucher generated successfully!' })
//         setTimeout(() => {
//           onSuccess()
//           onClose()
//         }, 1500)
//       } else {
//         throw new Error('Failed to mark voucher as generated')
//       }

//     } catch (error) {
//       console.error('Error generating voucher:', error)
//       setMessage({ type: 'error', text: 'Failed to generate sales voucher' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 flex items-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
//           <span>Loading sales voucher...</span>
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
//             isVoucherGenerated ? 'bg-green-600' : 'bg-blue-600'
//           }`}>
//             <div>
//               <div className="flex items-center">
//                 <h2 className="text-xl font-bold">Sales Voucher</h2>
//                 {isVoucherGenerated && (
//                   <span className="ml-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
//                     GENERATED
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm opacity-90">Dispatch: {voucherData.Number}</p>
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
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch No</label>
//                   <input value={voucherData.Number} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input value={voucherData.Date} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
//                   <input value={voucherData.Customer} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <input value={voucherData.Status} className="w-full p-2 bg-gray-100 border rounded-md" disabled />
//                 </div>
//               </div>
//             </div>

//             {/* FIXED: Items in Container/Card Layout instead of table rows */}
//             <div className="mb-6">
//               <div className="bg-gray-50 p-3 border-b">
//                 <h3 className="font-bold text-gray-800">Sales Voucher Items ({voucherItems.length})</h3>
//               </div>

//               <div className="grid grid-cols-1 gap-4 p-4 max-h-96 overflow-y-auto">
//                 {voucherItems.map((item, index) => (
//                   <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
//                     {/* Item Header */}
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h4 className="font-semibold text-gray-800">{item.Item_Name}</h4>
//                         <p className="text-sm text-gray-600">Line {item.Line_Id} • Batch: {item.Batch_Number}</p>
//                       </div>
//                       <span className={`px-2 py-1 rounded text-xs font-bold ${
//                         isVoucherGenerated 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {isVoucherGenerated ? 'Generated' : 'Pending'}
//                       </span>
//                     </div>

//                     {/* Item Details Grid */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                       {/* Quantity Section */}
//                       <div className="bg-green-50 p-3 rounded-lg">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
//                         <UomConverter
//                           itemId={item.Item_ID}
//                           onChange={(values) => handleUomChange(index, values)}
//                           initialValues={{
//                             uom1_qty: item.uom1_qty.toString(),
//                             uom2_qty: item.uom2_qty.toString(),
//                             uom3_qty: item.uom3_qty.toString(),
//                             sale_unit: item.sale_unit
//                           }}
//                           isPurchase={false}
//                           disabled={!canEdit}
//                         />
//                       </div>

//                       {/* Price & Discounts Section */}
//                       <div className="bg-yellow-50 p-3 rounded-lg">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Price & Discounts</label>
//                         <div className="space-y-2">
//                           <div>
//                             <label className="block text-xs text-gray-600">Price</label>
//                             <input
//                               type="number"
//                               step="0.01"
//                               value={item.Stock_Price || ''}
//                               onChange={(e) => updatePrice(index, e.target.value)}
//                               className={`w-full px-2 py-1 border rounded text-sm ${
//                                 !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
//                               }`}
//                               disabled={!canEdit}
//                             />
//                             {item.originalPrice !== item.Stock_Price && (
//                               <span className="text-xs text-blue-600">Was: {item.originalPrice}</span>
//                             )}
//                           </div>

//                           <div className="grid grid-cols-3 gap-2">
//                             <div>
//                               <label className="block text-xs text-gray-600">Disc A%</label>
//                               <input
//                                 type="number"
//                                 step="0.01"
//                                 value={item.Discount_A || ''}
//                                 onChange={(e) => updateDiscountA(index, e.target.value)}
//                                 className={`w-full px-1 py-1 border rounded text-xs ${
//                                   !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
//                                 }`}
//                                 disabled={!canEdit}
//                                 placeholder="0.00"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs text-gray-600">Disc B%</label>
//                               <input
//                                 type="number"
//                                 step="0.01"
//                                 value={item.Discount_B || ''}
//                                 onChange={(e) => updateDiscountB(index, e.target.value)}
//                                 className={`w-full px-1 py-1 border rounded text-xs ${
//                                   !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
//                                 }`}
//                                 disabled={!canEdit}
//                                 placeholder="0.00"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs text-gray-600">Disc C%</label>
//                               <input
//                                 type="number"
//                                 step="0.01"
//                                 value={item.Discount_C || ''}
//                                 onChange={(e) => updateDiscountC(index, e.target.value)}
//                                 className={`w-full px-1 py-1 border rounded text-xs ${
//                                   !canEdit ? 'bg-gray-100 cursor-not-allowed' : ''
//                                 }`}
//                                 disabled={!canEdit}
//                                 placeholder="0.00"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Totals Section */}
//                       <div className="bg-gray-50 p-3 rounded-lg">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Totals</label>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span>Gross:</span>
//                             <span className="font-medium">{calculateGrossAmount(item).toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between text-green-600">
//                             <span>Net Total:</span>
//                             <span className="font-bold">{calculateTotal(item).toFixed(2)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Enhanced Net Amount Summary */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-semibold text-gray-800 mb-3">Discount Summary</h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Total Discount A:</span>
//                       <span className="font-medium">
//                         {voucherItems.reduce((total, item) => total + (item.Discount_A || 0), 0).toFixed(2)}%
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Total Discount B:</span>
//                       <span className="font-medium">
//                         {voucherItems.reduce((total, item) => total + (item.Discount_B || 0), 0).toFixed(2)}%
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Total Discount C:</span>
//                       <span className="font-medium">
//                         {voucherItems.reduce((total, item) => total + (item.Discount_C || 0), 0).toFixed(2)}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-lg">
//                       <span className="font-semibold text-gray-700">Gross Amount:</span>
//                       <span className="font-bold text-gray-800">{calculateGrossTotal().toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-lg text-red-600">
//                       <span className="font-semibold">Total Discounts:</span>
//                       <span className="font-bold">-{calculateTotalDiscounts().toFixed(2)}</span>
//                     </div>
//                     <div className="border-t-2 border-gray-300 pt-2">
//                       <div className="flex justify-between text-2xl">
//                         <span className="font-bold text-gray-800">Grand Total:</span>
//                         <span className="font-bold text-blue-600">{calculateNetAmount().toFixed(2)}</span>
//                       </div>
//                     </div>
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
//                   className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center"
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
//                       Generate Sales Voucher
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
//         title="Generate Sales Voucher"
//         message="Are you sure you want to generate this sales voucher? This action will mark the dispatch as voucher generated and cannot be undone."
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

// interface SalesVoucherProps {
//   dispatchId: number
//   onClose: () => void
//   onSuccess: () => void
// }

// export function SalesVoucher({ dispatchId, onClose, onSuccess }: SalesVoucherProps) {
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
//   const [showConfirmation, setShowConfirmation] = useState(false)

//   const [voucherData, setVoucherData] = useState({
//     Number: '', Date: '', Customer: '', Status: ''
//   })

//   const [voucherItems, setVoucherItems] = useState<any[]>([])
//   const [canEdit, setCanEdit] = useState(true)

//   useEffect(() => {
//     if (dispatchId) loadDispatchData()
//   }, [dispatchId])

//   const loadDispatchData = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`)
//       const result = await response.json()

//       if (result.success) {
//         const dispatch = result.data

//         setCanEdit(!dispatch.is_Voucher_Generated)
//         setVoucherData({
//           Number: dispatch.Number,
//           Date: dispatch.Date.split('T')[0],
//           Customer: dispatch.account?.acName || '',
//           Status: dispatch.Status
//         })

//         const items = dispatch.details?.map((detail: any) => ({
//           ID: detail.ID,
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item_Name: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item,
//           Discount_A: parseFloat(detail.Discount_A) || 0,
//           Discount_B: parseFloat(detail.Discount_B) || 0,
//           Discount_C: parseFloat(detail.Discount_C) || 0
//         })) || []

//         setVoucherItems(items)
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const getSaleUnitRadioValue = (saleUnitId: string, item: any) => {
//     if (!saleUnitId || !item) return 'uom1'
//     const id = parseInt(saleUnitId)
//     if (id === item?.uom1?.id) return 'uom1'
//     if (id === item?.uomTwo?.id) return 'uomTwo'
//     if (id === item?.uomThree?.id) return 'uomThree'
//     return 'uom1'
//   }

//   const getSaleUnitId = (saleUnit: string, item: any) => {
//     if (!saleUnit || !item) return null
//     switch (saleUnit) {
//       case 'uom1': return item?.uom1?.id || null
//       case 'uomTwo': return item?.uomTwo?.id || null
//       case 'uomThree': return item?.uomThree?.id || null
//       default: return item?.uom1?.id || null
//     }
//   }

//   const handleUomChange = (index: number, values: any) => {
//     if (!canEdit) return
//     const updated = [...voucherItems]
//     updated[index] = { ...updated[index], ...values }
//     setVoucherItems(updated)
//   }

//   const updateField = (index: number, field: string, value: any) => {
//     if (!canEdit) return
//     const updated = [...voucherItems]
//     updated[index][field] = parseFloat(value) || 0
//     setVoucherItems(updated)
//   }

//   const calculateTotal = (item: any): number => {
//     const price = parseFloat(item.Stock_Price) || 0
//     let quantity = 0

//     switch (item.sale_unit) {
//       case 'uom1': quantity = parseFloat(item.uom1_qty) || 0; break
//       case 'uomTwo': quantity = parseFloat(item.uom2_qty) || 0; break
//       case 'uomThree': quantity = parseFloat(item.uom3_qty) || 0; break
//       default: quantity = parseFloat(item.uom1_qty) || 0
//     }

//     const gross = price * quantity
//     const discA = gross * (item.Discount_A || 0) / 100
//     const afterA = gross - discA
//     const discB = afterA * (item.Discount_B || 0) / 100
//     const afterB = afterA - discB
//     const discC = afterB * (item.Discount_C || 0) / 100

//     return afterB - discC
//   }

//   const calculateGrandTotal = (): number => {
//     return voucherItems.reduce((total, item) => total + calculateTotal(item), 0)
//   }

//   const handleSubmitClick = () => {
//     if (!canEdit) {
//       setMessage({ type: 'error', text: 'Cannot modify generated voucher!' })
//       return
//     }
//     setShowConfirmation(true)
//   }

//   const handleConfirmSubmit = async () => {
//     setShowConfirmation(false)
//     setLoading(true)

//     try {
//       // Update all stock details
//       const detailUpdates = voucherItems.map(async (item) => {
//         return fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             Stock_Price: parseFloat(item.Stock_Price) || 0,
//             Stock_out_UOM_Qty: item.uom1_qty || 0,
//             Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//             Stock_out_UOM3_Qty: item.uom3_qty || 0,
//             Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
//             Discount_A: parseFloat(item.Discount_A) || 0,
//             Discount_B: parseFloat(item.Discount_B) || 0,
//             Discount_C: parseFloat(item.Discount_C) || 0
//           })
//         })
//       })

//       await Promise.all(detailUpdates)

//       // Update stock main
//       const mainResponse = await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ is_Voucher_Generated: true })
//       })

//       if (mainResponse.ok) {
//         setMessage({ type: 'success', text: 'Sales voucher generated successfully!' })
//         setTimeout(() => {
//           onSuccess()
//           onClose()
//         }, 1500)
//       } else {
//         throw new Error('Failed to mark voucher as generated')
//       }

//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to generate voucher' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-4 flex items-center">
//           <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
//           <span>Loading...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg w-full max-w-5xl max-h-[85vh] overflow-auto">

//           {/* Compact Header */}
//           <div className={`p-3 flex justify-between items-center ${canEdit ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
//             <div>
//               <h3 className="text-lg font-bold">Sales Voucher - {voucherData.Number}</h3>
//               <p className="text-sm opacity-90">{voucherData.Customer} • {voucherData.Date}</p>
//             </div>
//             <button onClick={onClose} className="text-xl font-bold hover:bg-white/20 px-2 rounded">×</button>
//           </div>

//           {/* Message */}
//           {message.text && (
//             <div className={`m-3 p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//               {message.text}
//             </div>
//           )}

//           {/* Warning */}
//           {!canEdit && (
//             <div className="m-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm">
//               <span className="text-yellow-800 font-medium">⚠️ Voucher already generated - View only</span>
//             </div>
//           )}

//           <form onSubmit={(e) => { e.preventDefault(); handleSubmitClick(); }} className="p-3">

//             {/* Compact Items List */}
//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {voucherItems.map((item, index) => (
//                 <div key={index} className="border rounded-lg p-3 bg-gray-50">
//                   <div className="grid grid-cols-12 gap-2 items-center text-sm">

//                     {/* Item Info - 3 cols */}
//                     <div className="col-span-3">
//                       <div className="font-medium text-gray-800">{item.Item_Name}</div>
//                       <div className="text-xs text-gray-600">Line {item.Line_Id} • {item.Batch_Number}</div>
//                     </div>

//                     {/* UOM Converter - 4 cols */}
//                     <div className="col-span-4">
//                       <UomConverter
//                         itemId={item.Item_ID}
//                         onChange={(values) => handleUomChange(index, values)}
//                         initialValues={{
//                           uom1_qty: item.uom1_qty.toString(),
//                           uom2_qty: item.uom2_qty.toString(),
//                           uom3_qty: item.uom3_qty.toString(),
//                           sale_unit: item.sale_unit
//                         }}
//                         isPurchase={false}
//                       />
//                     </div>

//                     {/* Price - 1 col */}
//                     <div className="col-span-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Stock_Price || ''}
//                         onChange={(e) => updateField(index, 'Stock_Price', e.target.value)}
//                         className="w-full px-1 py-1 border rounded text-xs text-center"
//                         disabled={!canEdit}
//                         placeholder="Price"
//                       />
//                     </div>

//                     {/* Discounts - 2 cols */}
//                     <div className="col-span-2 grid grid-cols-3 gap-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Discount_A || ''}
//                         onChange={(e) => updateField(index, 'Discount_A', e.target.value)}
//                         className="w-full px-1 py-1 border rounded text-xs text-center"
//                         disabled={!canEdit}
//                         placeholder="A%"
//                       />
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Discount_B || ''}
//                         onChange={(e) => updateField(index, 'Discount_B', e.target.value)}
//                         className="w-full px-1 py-1 border rounded text-xs text-center"
//                         disabled={!canEdit}
//                         placeholder="B%"
//                       />
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Discount_C || ''}
//                         onChange={(e) => updateField(index, 'Discount_C', e.target.value)}
//                         className="w-full px-1 py-1 border rounded text-xs text-center"
//                         disabled={!canEdit}
//                         placeholder="C%"
//                       />
//                     </div>

//                     {/* Total - 2 cols */}
//                     <div className="col-span-2 text-right">
//                       <div className="text-lg font-bold text-green-600">
//                         {calculateTotal(item).toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Compact Summary */}
//             <div className="mt-4 bg-gray-100 p-3 rounded-lg">
//               <div className="flex justify-between items-center">
//                 <div className="text-sm text-gray-600">
//                   Items: {voucherItems.length} | 
//                   Status: {canEdit ? 'Editable' : 'Generated'}
//                 </div>
//                 <div className="text-xl font-bold text-blue-600">
//                   Grand Total: {calculateGrandTotal().toFixed(2)}
//                 </div>
//               </div>
//             </div>

//             {/* Compact Buttons */}
//             <div className="flex justify-end space-x-2 mt-4">
//               <button 
//                 type="button" 
//                 onClick={onClose} 
//                 className="px-4 py-2 bg-gray-500 text-white rounded text-sm"
//               >
//                 {canEdit ? 'Cancel' : 'Close'}
//               </button>
//               {canEdit && (
//                 <button 
//                   type="submit" 
//                   disabled={loading} 
//                   className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50 flex items-center"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-2"></div>
//                       Generating...
//                     </>
//                   ) : (
//                     'Generate Voucher'
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
//         title="Generate Sales Voucher"
//         message="Generate voucher with current prices and discounts? This cannot be undone."
//         confirmText="Yes, Generate"
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

// interface SalesVoucherProps {
//   dispatchId: number
//   mode: 'create' | 'edit'
//   onClose: () => void
//   onSuccess: () => void
// }

// export function SalesVoucher({ dispatchId, mode, onClose, onSuccess }: SalesVoucherProps) {
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
//   const [showConfirmation, setShowConfirmation] = useState(false)

//   const [voucherData, setVoucherData] = useState({
//     Number: '', Date: '', Customer: '', Status: ''
//   })
//   const [voucherItems, setVoucherItems] = useState<any[]>([])
//   const [batchGroups, setBatchGroups] = useState<any>({})

//   useEffect(() => {
//     if (dispatchId) loadDispatchData()
//   }, [dispatchId])

//   const loadDispatchData = async () => {
//     setFetchLoading(true)
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`)
//       const result = await response.json()

//       if (result.success) {
//         const dispatch = result.data

//         setVoucherData({
//           Number: dispatch.Number,
//           Date: dispatch.Date.split('T')[0],
//           Customer: dispatch.account?.acName || '',
//           Status: dispatch.Status
//         })

//         const items = dispatch.details?.map((detail: any) => ({
//           ID: detail.ID,
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item_Name: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item,
//           Discount_A: parseFloat(detail.Discount_A) || 0,
//           Discount_B: parseFloat(detail.Discount_B) || 0,
//           Discount_C: parseFloat(detail.Discount_C) || 0
//         })) || []

//         setVoucherItems(items)
//         groupItemsByBatch(items)
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' })
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const groupItemsByBatch = (items: any[]) => {
//     const groups = items.reduce((acc, item) => {
//       const batch = item.Batch_Number || 'No Batch'
//       if (!acc[batch]) acc[batch] = []
//       acc[batch].push(item)
//       return acc
//     }, {})
//     setBatchGroups(groups)
//   }

//   const getSaleUnitRadioValue = (saleUnitId: string, item: any) => {
//     if (!saleUnitId || !item) return 'uom1'
//     const id = parseInt(saleUnitId)
//     if (id === item?.uom1?.id) return 'uom1'
//     if (id === item?.uomTwo?.id) return 'uomTwo'
//     if (id === item?.uomThree?.id) return 'uomThree'
//     return 'uom1'
//   }

//   const getSaleUnitId = (saleUnit: string, item: any) => {
//     if (!saleUnit || !item) return null
//     switch (saleUnit) {
//       case 'uom1': return item?.uom1?.id || null
//       case 'uomTwo': return item?.uomTwo?.id || null
//       case 'uomThree': return item?.uomThree?.id || null
//       default: return item?.uom1?.id || null
//     }
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

//   const calculateItemGross = (item: any): number => {
//     const price = parseFloat(item.Stock_Price) || 0
//     let qty = 0

//     switch (item.sale_unit) {
//       case 'uom1': qty = parseFloat(item.uom1_qty) || 0; break
//       case 'uomTwo': qty = parseFloat(item.uom2_qty) || 0; break
//       case 'uomThree': qty = parseFloat(item.uom3_qty) || 0; break
//       default: qty = parseFloat(item.uom1_qty) || 0
//     }

//     return price * qty
//   }

//   const calculateItemNet = (item: any): number => {
//     const gross = calculateItemGross(item)
//     const discA = gross * (item.Discount_A || 0) / 100
//     const afterA = gross - discA
//     const discB = afterA * (item.Discount_B || 0) / 100
//     const afterB = afterA - discB
//     const discC = afterB * (item.Discount_C || 0) / 100
//     return afterB - discC
//   }

//   const calculateBatchGross = (batchItems: any[]): number => {
//     return batchItems.reduce((sum, item) => sum + calculateItemGross(item), 0)
//   }

//   const calculateBatchNet = (batchItems: any[]): number => {
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

//   const handleSubmitClick = () => setShowConfirmation(true)

//   const handleConfirmSubmit = async () => {
//     setShowConfirmation(false)
//     setLoading(true)

//     try {
//       await Promise.all(voucherItems.map(item =>
//         fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             Stock_Price: parseFloat(item.Stock_Price) || 0,
//             Stock_out_UOM_Qty: item.uom1_qty || 0,
//             Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//             Stock_out_UOM3_Qty: item.uom3_qty || 0,
//             Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
//             Discount_A: parseFloat(item.Discount_A) || 0,
//             Discount_B: parseFloat(item.Discount_B) || 0,
//             Discount_C: parseFloat(item.Discount_C) || 0
//           })
//         })
//       ))

//       if (mode === 'create') {
//         await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ is_Voucher_Generated: true })
//         })
//       }

//       setMessage({ 
//         type: 'success', 
//         text: mode === 'create' ? 'Voucher generated successfully!' : 'Voucher updated successfully!' 
//       })
//       setTimeout(() => { onSuccess(); onClose() }, 1500)

//     } catch (error) {
//       setMessage({ type: 'error', text: 'Operation failed' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
//           <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
//           <span className="text-gray-700 font-medium">Loading voucher data...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">

//           {/* Professional Header - Fixed Height */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex-shrink-0">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-white bg-opacity-20 rounded-xl p-2">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold">Sales Voucher</h2>
//                   <div className="flex items-center space-x-4 text-sm text-blue-100">
//                     <span>#{voucherData.Number}</span>
//                     <span>{voucherData.Date}</span>
//                     <span>{voucherData.Customer}</span>
//                   </div>
//                 </div>
//               </div>
//               <button 
//                 onClick={onClose} 
//                 className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-2 transition-all duration-200"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Alert Messages */}
//           {message.text && (
//             <div className={`mx-4 mt-3 p-3 rounded-lg border-l-4 flex items-center ${
//               message.type === 'success' 
//                 ? 'bg-green-50 border-green-400 text-green-800' 
//                 : 'bg-red-50 border-red-400 text-red-800'
//             }`}>
//               <svg className={`w-5 h-5 mr-3 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`} 
//                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {message.type === 'success' ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 )}
//               </svg>
//               {message.text}
//             </div>
//           )}

//           {/* Main Content Area - Flex Layout */}
//           <div className="flex-1 flex overflow-hidden">

//             {/* Left Side - Items (70% width) */}
//             <div className="flex-1 overflow-y-auto p-4">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//                 Voucher Items
//               </h3>

//               {/* FIXED: Professional Items Layout */}
//               <div className="space-y-4">
//                 {Object.entries(batchGroups).map(([batchNumber, batchItems]: [string, any]) => (
//                   <div key={batchNumber} className="bg-white border-2 border-gray-200 rounded-xl shadow-sm">

//                     {/* Batch Header */}
//                     <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 border-b border-gray-200">
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center space-x-3">
//                           <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
//                             {batchNumber}
//                           </div>
//                           <span className="text-gray-700 font-medium">
//                             {batchItems.length} item{batchItems.length > 1 ? 's' : ''}
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-4 text-sm">
//                           <div className="text-gray-600">
//                             Gross: <span className="font-bold text-gray-800">{calculateBatchGross(batchItems).toFixed(2)}</span>
//                           </div>
//                           <div className="text-green-600">
//                             Net: <span className="font-bold">{calculateBatchNet(batchItems).toFixed(2)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Batch Items */}
//                     <div className="p-4">
//                       {batchItems.map((item: any, idx: number) => (
//                         <div key={item.ID} className={`${idx > 0 ? 'border-t border-gray-100 pt-4 mt-4' : ''}`}>

//                           {/* Item Header */}
//                           <div className="flex justify-between items-center mb-3">
//                             <div className="flex items-center space-x-3">
//                               <div className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">
//                                 #{item.Line_Id}
//                               </div>
//                               <h4 className="font-semibold text-gray-800">{item.Item_Name}</h4>
//                             </div>
//                             <div className="flex items-center space-x-4 text-sm">
//                               <div className="text-right">
//                                 <div className="text-xs text-gray-500">Gross</div>
//                                 <div className="font-bold text-gray-700">{calculateItemGross(item).toFixed(2)}</div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-xs text-gray-500">Net</div>
//                                 <div className="font-bold text-green-600">{calculateItemNet(item).toFixed(2)}</div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* FIXED: Professional Input Layout */}
//                           <div className="grid grid-cols-12 gap-4 items-end">

//                             {/* UOM Converter - 5 columns */}
//                             <div className="col-span-5">
//                               <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
//                                 Quantity & Unit
//                               </label>
//                               <UomConverter
//                                 itemId={item.Item_ID}
//                                 onChange={(values) => handleUomChange(item.ID, values)}
//                                 initialValues={{
//                                   uom1_qty: item.uom1_qty.toString(),
//                                   uom2_qty: item.uom2_qty.toString(),
//                                   uom3_qty: item.uom3_qty.toString(),
//                                   sale_unit: item.sale_unit
//                                 }}
//                                 isPurchase={false}
//                               />
//                             </div>

//                             {/* Price - 2 columns */}
//                             <div className="col-span-2">
//                               <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
//                                 Unit Price
//                               </label>
//                               <div className="relative">
//                                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
//                                 <input
//                                   type="number"
//                                   step="0.01"
//                                   value={item.Stock_Price || ''}
//                                   onChange={(e) => updateField(item.ID, 'Stock_Price', e.target.value)}
//                                   className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                   placeholder="0.00"
//                                 />
//                               </div>
//                             </div>

//                             {/* Discounts - 5 columns */}
//                             <div className="col-span-5">
//                               <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
//                                 Discounts (%)
//                               </label>
//                               <div className="grid grid-cols-3 gap-2">
//                                 <div className="relative">
//                                   <input
//                                     type="number"
//                                     step="0.01"
//                                     value={item.Discount_A || ''}
//                                     onChange={(e) => updateField(item.ID, 'Discount_A', e.target.value)}
//                                     className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                     placeholder="0"
//                                   />
//                                   <label className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
//                                     Discount A
//                                   </label>
//                                 </div>
//                                 <div className="relative">
//                                   <input
//                                     type="number"
//                                     step="0.01"
//                                     value={item.Discount_B || ''}
//                                     onChange={(e) => updateField(item.ID, 'Discount_B', e.target.value)}
//                                     className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                     placeholder="0"
//                                   />
//                                   <label className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
//                                     Discount B
//                                   </label>
//                                 </div>
//                                 <div className="relative">
//                                   <input
//                                     type="number"
//                                     step="0.01"
//                                     value={item.Discount_C || ''}
//                                     onChange={(e) => updateField(item.ID, 'Discount_C', e.target.value)}
//                                     className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                                     placeholder="0"
//                                   />
//                                   <label className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
//                                     Discount C
//                                   </label>
//                                 </div>
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

//             {/* Right Side - Summary Dashboard (30% width) */}
//             <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">

//               {/* Summary Header */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-bold text-gray-800 flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                   Summary
//                 </h3>
//               </div>

//               {/* Batch Summary Cards */}
//               <div className="space-y-3 mb-6">
//                 <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Batch Totals</h4>
//                 {Object.entries(batchGroups).map(([batch, items]: [string, any]) => (
//                   <div key={batch} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="font-medium text-gray-800 text-sm">{batch}</span>
//                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                         {items.length} items
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="text-center bg-gray-50 rounded p-2">
//                         <div className="text-xs text-gray-500">Gross</div>
//                         <div className="font-bold text-gray-800">{calculateBatchGross(items).toFixed(2)}</div>
//                       </div>
//                       <div className="text-center bg-green-50 rounded p-2">
//                         <div className="text-xs text-gray-500">Net</div>
//                         <div className="font-bold text-green-600">{calculateBatchNet(items).toFixed(2)}</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Grand Total Card */}
//               <div className="bg-white rounded-xl border-2 border-blue-200 p-4 shadow-lg">
//                 <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Grand Totals</h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Total Items:</span>
//                     <span className="font-bold">{voucherItems.length}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Total Batches:</span>
//                     <span className="font-bold">{Object.keys(batchGroups).length}</span>
//                   </div>
//                   <hr className="border-gray-300" />
//                   <div className="bg-gray-50 rounded-lg p-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">Gross Amount:</span>
//                       <span className="text-lg font-bold text-gray-800">
//                         ₨ {calculateGrandGross().toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="bg-green-50 rounded-lg p-3 border border-green-200">
//                     <div className="flex justify-between items-center">
//                       <span className="text-green-600">Net Amount:</span>
//                       <span className="text-2xl font-bold text-green-700">
//                         ₨ {calculateGrandNet().toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* FIXED: Action Buttons - Fixed at Bottom */}
//           <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end space-x-3 flex-shrink-0">
//             <button 
//               type="button" 
//               onClick={onClose} 
//               className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//               Cancel
//             </button>
//             <button 
//               onClick={handleSubmitClick}
//               disabled={loading} 
//               className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
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
//         title={mode === 'create' ? 'Generate Sales Voucher' : 'Update Sales Voucher'}
//         message={`${mode === 'create' ? 'Generate' : 'Update'} sales voucher with current data?`}
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
import { VoucherData, VoucherItem, CarriageAccount } from '@/lib/types'

interface SalesVoucherProps {
  dispatchId: number
  mode: 'create' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

export function SalesVoucher({ dispatchId, mode, onClose, onSuccess }: SalesVoucherProps) {
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>({ type: 'success', text: '' })
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [voucherData, setVoucherData] = useState<VoucherData>({
    Number: '',
    Date: '',
    Customer: '',
    Status: '',
    Carriage_Amount: 0,
    Carriage_ID: undefined,
    Transporter: ''
  })

  const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([])
  const [batchGroups, setBatchGroups] = useState<any>({})
  const [carriageAccounts, setCarriageAccounts] = useState<CarriageAccount[]>([])

  useEffect(() => {
    if (dispatchId) {
      loadDispatchData()
      loadCarriageAccounts()
    }
  }, [dispatchId])

  // LOAD CARRIAGE ACCOUNTS
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

  const loadDispatchData = async () => {
    setFetchLoading(true)
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`)
      const result = await response.json()

      if (result.success) {
        const dispatch = result.data

        setVoucherData({
          Number: dispatch.Number,
          Date: dispatch.Date.split('T')[0],
          Customer: dispatch.account?.acName || '',
          Status: dispatch.Status,
          Carriage_Amount: parseFloat(dispatch.Carriage_Amount) || 0,
          Carriage_ID: dispatch.Carriage_ID || undefined,
          Transporter: dispatch.Transporter || ''
        })

        const items: VoucherItem[] = dispatch.details?.map((detail: any) => ({
          ID: detail.ID,
          Line_Id: detail.Line_Id,
          Batch_Number: detail.batchno || '',
          Item_Name: detail.item?.itemName || '',
          Item_ID: detail.Item_ID,
          uom1_qty: detail.Stock_out_UOM_Qty || 0,
          uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
          uom3_qty: detail.Stock_out_UOM3_Qty || 0,
          sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
          Stock_Price: detail.Stock_Price || 0,
          item: detail.item,
          originalPrice: detail.Stock_Price || 0,
          Discount_A: parseFloat(detail.Discount_A) || 0,
          Discount_B: parseFloat(detail.Discount_B) || 0,
          Discount_C: parseFloat(detail.Discount_C) || 0,
          originalDiscountA: parseFloat(detail.Discount_A) || 0,
          originalDiscountB: parseFloat(detail.Discount_B) || 0,
          originalDiscountC: parseFloat(detail.Discount_C) || 0,
          is_Voucher_Generated: dispatch.is_Voucher_Generated || false,
          Carriage_ID: detail.Carriage_ID || undefined,
          Carriage_Amount: parseFloat(detail.Carriage_Amount) || 0
        })) || []

        setVoucherItems(items)
        groupItemsByBatch(items)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load dispatch data' })
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

  const getSaleUnitRadioValue = (saleUnitId: string, item: any) => {
    if (!saleUnitId || !item) return 'uom1'
    const id = parseInt(saleUnitId)
    if (id === item?.uom1?.id) return 'uom1'
    if (id === item?.uomTwo?.id) return 'uomTwo'
    if (id === item?.uomThree?.id) return 'uomThree'
    return 'uom1'
  }

  const getSaleUnitId = (saleUnit: string, item: any) => {
    if (!saleUnit || !item) return null
    switch (saleUnit) {
      case 'uom1': return item?.uom1?.id || null
      case 'uomTwo': return item?.uomTwo?.id || null
      case 'uomThree': return item?.uomThree?.id || null
      default: return item?.uom1?.id || null
    }
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

  // FINAL TOTAL WITH CARRIAGE
  const calculateFinalTotal = (): number => {
    return calculateGrandNet() + (parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0)
  }

  const handleSubmitClick = () => setShowConfirmation(true)

  // const handleConfirmSubmit = async () => {
  //   setShowConfirmation(false)
  //   setLoading(true)

  //   try {
  //     // STEP 1: Update all stock details
  //     await Promise.all(voucherItems.map(item =>
  //       fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
  //         method: 'PUT',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
  //           Stock_out_UOM_Qty: item.uom1_qty || 0,
  //           Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
  //           Stock_out_UOM3_Qty: item.uom3_qty || 0,
  //           Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
  //           Discount_A: parseFloat(item.Discount_A.toString()) || 0,
  //           Discount_B: parseFloat(item.Discount_B.toString()) || 0,
  //           Discount_C: parseFloat(item.Discount_C.toString()) || 0,
  //           // ADD CARRIAGE TO EACH DETAIL
  //           Carriage_ID: voucherData.Carriage_ID || null,
  //           Carriage_Amount: parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0
  //         })
  //       })
  //     ))

  //     // STEP 2: Update stock main with carriage and voucher status
  //     await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchId}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         is_Voucher_Generated: mode === 'create' ? true : undefined,
  //         Carriage_Amount: parseFloat(voucherData.Carriage_Amount?.toString() || '0') || 0,
  //         Carriage_ID: voucherData.Carriage_ID || null
  //         // REMOVED: Transporter - we only store Carriage_ID
  //       })
  //     })

  //     setMessage({
  //       type: 'success',
  //       text: mode === 'create' ? 'Voucher generated successfully!' : 'Voucher updated successfully!'
  //     })
  //     setTimeout(() => { onSuccess(); onClose() }, 1500)

  //   } catch (error) {
  //     console.error('Voucher operation error:', error)
  //     setMessage({ type: 'error', text: 'Operation failed' })
  //   } finally {
  //     setLoading(false)
  //   }
  // }












// In the handleConfirmSubmit function - ADD JOURNAL CALLS

const handleConfirmSubmit = async () => {
  setShowConfirmation(false)
  setLoading(true)

  try {
    // STEP 1: Update stock details
    await Promise.all(voucherItems.map(item =>
      fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-detail/${item.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Stock_Price: parseFloat(item.Stock_Price.toString()) || 0,
          Stock_out_UOM_Qty: item.uom1_qty || 0,
          Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
          Stock_out_UOM3_Qty: item.uom3_qty || 0,
          Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
          Discount_A: parseFloat(item.Discount_A.toString()) || 0,
          Discount_B: parseFloat(item.Discount_B.toString()) || 0,
          Discount_C: parseFloat(item.Discount_C.toString()) || 0
        })
      })
    ))

    // STEP 2: Update stock main
    await fetch(`http://${window.location.hostname}:4000/api/stock-order/stock-main/${dispatchId}`, {
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
    const journalResponse = await fetch(`http://${window.location.hostname}:4000/api/journal-master/post-voucher/${dispatchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: journalMode })
    })

    const journalResult = await journalResponse.json()

    if (journalResult.success) {
      setMessage({ 
        type: 'success', 
        text: mode === 'create' 
          ? 'Voucher generated & journal created (UnPost)!' 
          : 'Voucher & journal updated successfully!' 
      })
    } else {
      setMessage({ 
        type: 'success', 
        text: mode === 'create' ? 'Voucher generated (journal warning)!' : 'Voucher updated (journal warning)!' 
      })
      console.warn('Journal warning:', journalResult.error)
    }

    setTimeout(() => { onSuccess(); onClose() }, 1500)

  } catch (error) {
    console.error('Voucher operation error:', error)
    setMessage({ type: 'error', text: 'Operation failed' })
  } finally {
    setLoading(false)
  }
}
















  
  if (fetchLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center">
          <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full mr-3"></div>
          <span className="text-gray-700 font-medium">Loading voucher data...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Sales Voucher</h2>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span>#{voucherData.Number}</span>
                    <span>{voucherData.Date}</span>
                    <span>{voucherData.Customer}</span>
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
            <div className={`mx-4 mt-3 p-3 rounded-lg border-l-4 flex items-center flex-shrink-0 ${message.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'
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
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
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
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">#{item.Line_Id}</span>
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
                                isPurchase={false}
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
                                  className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
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
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500"
                                  placeholder="A%"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_B || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_B', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500"
                                  placeholder="B%"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.Discount_C || ''}
                                  onChange={(e) => updateField(item.ID, 'Discount_C', e.target.value)}
                                  className="w-full px-1 py-2 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500"
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

              {/* CARRIAGE SECTION */}
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
                        const selectedAccount = carriageAccounts.find(acc => acc.id === parseInt(e.target.value))
                        setVoucherData(prev => ({
                          ...prev,
                          Carriage_ID: parseInt(e.target.value) || undefined,
                          Transporter: selectedAccount?.acName || ''
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
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
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch Summary */}
              <div className="bg-white rounded-lg border p-4 mb-4">
                <h4 className="font-bold text-sm text-gray-800 mb-3">Batch Summary</h4>
                <div className="space-y-2">
                  {Object.entries(batchGroups).map(([batch, items]: [string, any]) => (
                    <div key={batch} className="bg-gray-50 rounded p-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">{batch} ({items.length})</span>
                        <div className="flex space-x-2">
                          <span>G: <strong>{calculateBatchGross(items).toFixed(2)}</strong></span>
                          <span className="text-green-600">N: <strong>{calculateBatchNet(items).toFixed(2)}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total Card */}
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
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
                  <hr className="border-2 border-blue-200" />
                  <div className="flex justify-between text-lg bg-blue-50 p-2 rounded">
                    <span className="font-bold">Final Total:</span>
                    <span className="font-bold text-blue-700">₨ {calculateFinalTotal().toFixed(2)}</span>
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
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center"
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
        title={mode === 'create' ? 'Generate Sales Voucher' : 'Update Sales Voucher'}
        message={`${mode === 'create' ? 'Generate' : 'Update'} voucher with Final Total: ₨${calculateFinalTotal().toFixed(2)} (including carriage)?`}
        confirmText={mode === 'create' ? 'Generate Voucher' : 'Update Voucher'}
        type="info"
        loading={loading}
      />
    </>
  )
}
