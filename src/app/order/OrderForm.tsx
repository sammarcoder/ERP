
// // OrderForm.tsx
// 'use client'

// import React, { useState, useEffect } from 'react'
// import Dropdown from '../../components/Dropdown'

// interface COAData {
//   id: number
//   acName: string
//   ch1Id: number
//   ch2Id: number
//   coaTypeId: number
//   setupName: string
//   adress: string
//   city: string
//   personName: string
//   mobileNo: string
//   taxStatus: boolean
//   ntn: string
//   cnic: string
//   salesLimit: string
//   credit: string
//   creditDoys: string
//   salesMan: string
//   isJvBalance: boolean
//   createdAt: string
//   updatedAt: string
// }

// const OrderForm: React.FC = () => {
//   const [master, setMaster] = useState({
//     Stock_Type_ID: 1,
//     Date: new Date().toISOString().split('T')[0],
//     Number: 1001,
//     COA_ID: null as number | null,
//     Next_Status: 'Incomplete'
//   })

//   const [details, setDetails] = useState([
//     {
//       Line_Id: 1,
//       Item_ID: 101,
//       Price: 0,
//       Stock_In_UOM: 1,
//       Stock_In_UOM_Qty: 0,
//       Stock_SKU_Price: 0,
//       Stock_In_SKU_UOM: 1,
//       Stock_In_SKU_UOM_Qty: 0,
//       Stock_out_UOM: 1,
//       Stock_out_UOM_Qty: 0,
//       Stock_out_SKU_UOM: 1,
//       Stock_out_SKU_UOM_Qty: 0,
//       Discount_A: 0,
//       Discount_B: 0,
//       Discount_C: 0,
//       Goods: '',
//       Remarks: '',
//       grossTotal: 0,
//       netTotal: 0
//     }
//   ])

//   const [coaList, setCoaList] = useState<COAData[]>([])
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')

//   useEffect(() => {
//     fetchCOAData()
//   }, [])

//   const fetchCOAData = async () => {
//     try {
//       const apiUrl = typeof window !== 'undefined'
//         ? `http://${window.location.hostname}:5000/api/z-coa/get`
//         : 'http://localhost:5000/api/z-coa/get'

//       const response = await fetch(apiUrl)
//       const data = await response.json()

//       console.log('COA API Response:', data)

//       // Access the zCoaRecords array from the response
//       if (data.sucess && data.zCoaRecords && Array.isArray(data.zCoaRecords)) {
//         // Filter for supplier types: LC (3), LP (4), Local Mfg (5)
//         // Based on your data, coaTypeId 3 is "Bank" - adjust these IDs based on your actual supplier type IDs
//         const suppliers = data.zCoaRecords.filter((coa: COAData) => {
//           // You might need to adjust these IDs based on your actual COA types
//           // For now, showing all records since we need to know the correct type IDs
//           return true // Show all for now
//         })

//         console.log('Available COA records:', suppliers)
//         setCoaList(suppliers)
//       } else {
//         console.error('Unexpected API response structure')
//         setMessage('Failed to load supplier data')
//       }

//     } catch (error) {
//       console.error('Error fetching COA data:', error)
//       setMessage('Failed to load supplier data')
//     }
//   }

//   const handleMasterChange = (name: string, value: any) => {
//     setMaster(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleDetailChange = (index: number, field: string, value: any) => {
//     const updatedDetails = [...details]
//     updatedDetails[index] = {
//       ...updatedDetails[index],
//       [field]: value
//     }

//     // Calculate totals
//     if (['Price', 'Stock_In_UOM_Qty', 'Discount_A', 'Discount_B', 'Discount_C'].includes(field)) {
//       const price = parseFloat(updatedDetails[index].Price.toString()) || 0
//       const qty = parseFloat(updatedDetails[index].Stock_In_UOM_Qty.toString()) || 0
//       const discountA = parseFloat(updatedDetails[index].Discount_A.toString()) || 0
//       const discountB = parseFloat(updatedDetails[index].Discount_B.toString()) || 0
//       const discountC = parseFloat(updatedDetails[index].Discount_C.toString()) || 0

//       const grossTotal = price * qty
//       const totalDiscountPercent = discountA + discountB + discountC
//       const discountAmount = grossTotal * (totalDiscountPercent / 100)
//       const netTotal = grossTotal - discountAmount

//       updatedDetails[index].grossTotal = grossTotal
//       updatedDetails[index].netTotal = netTotal
//     }

//     setDetails(updatedDetails)
//   }

//   const addDetailRow = () => {
//     const newRow = {
//       Line_Id: details.length + 1,
//       Item_ID: 101,
//       Price: 0,
//       Stock_In_UOM: 1,
//       Stock_In_UOM_Qty: 0,
//       Stock_SKU_Price: 0,
//       Stock_In_SKU_UOM: 1,
//       Stock_In_SKU_UOM_Qty: 0,
//       Stock_out_UOM: 1,
//       Stock_out_UOM_Qty: 0,
//       Stock_out_SKU_UOM: 1,
//       Stock_out_SKU_UOM_Qty: 0,
//       Discount_A: 0,
//       Discount_B: 0,
//       Discount_C: 0,
//       Goods: '',
//       Remarks: '',
//       grossTotal: 0,
//       netTotal: 0
//     }
//     setDetails([...details, newRow])
//   }

//   const removeDetailRow = (index: number) => {
//     if (details.length > 1) {
//       const filtered = details.filter((_, i) => i !== index)
//       filtered.forEach((item, i) => {
//         item.Line_Id = i + 1
//       })
//       setDetails(filtered)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage('')

//     if (!master.COA_ID) {
//       setMessage('Please select a supplier')
//       setLoading(false)
//       return
//     }

//     const apiUrl = typeof window !== 'undefined'
//       ? `http://${window.location.hostname}:5000/api/order`
//       : 'http://localhost:5000/api/order'

//     const orderData = {
//       master: {
//         ...master,
//         COA_ID: Number(master.COA_ID)
//       },
//       details: details.map(d => ({
//         Item_ID: Number(d.Item_ID),
//         Price: Number(d.Price),
//         Stock_In_UOM: Number(d.Stock_In_UOM),
//         Stock_In_UOM_Qty: Number(d.Stock_In_UOM_Qty),
//         Stock_SKU_Price: Number(d.Stock_SKU_Price),
//         Stock_In_SKU_UOM: Number(d.Stock_In_SKU_UOM),
//         Stock_In_SKU_UOM_Qty: Number(d.Stock_In_SKU_UOM_Qty),
//         Stock_out_UOM: Number(d.Stock_out_UOM),
//         Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
//         Stock_out_SKU_UOM: Number(d.Stock_out_SKU_UOM),
//         Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
//         Discount_A: Number(d.Discount_A) || 0,
//         Discount_B: Number(d.Discount_B) || 0,
//         Discount_C: Number(d.Discount_C) || 0,
//         Goods: d.Goods,
//         Remarks: d.Remarks
//       }))
//     }

//     console.log('Submitting order:', orderData)

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData)
//       })

//       const result = await response.json()

//       if (response.ok) {
//         setMessage('Order created successfully!')
//         setTimeout(() => {
//           window.location.reload()
//         }, 2000)
//       } else {
//         setMessage(result.message || 'Failed to create order')
//       }
//     } catch (error) {
//       console.error('Submit error:', error)
//       setMessage('Failed to submit order')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Prepare dropdown options
//   const supplierOptions = coaList.map(coa => ({
//     id: coa.id,
//     label: coa.acName
//   }))

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
//         <div className="bg-blue-600 text-white p-4 rounded-t-lg">
//           <h1 className="text-xl font-bold">Purchase Order</h1>
//         </div>

//         {message && (
//           <div className={`m-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-6">
//           {/* Header Section */}
//           <div className="grid grid-cols-4 gap-4 mb-6">
//             <div>
//             <label>
//               Purchase Order Id 
//             </label>
            
//             <input id='Id' className="w-full px-3 py-2 text-gray-600 border border-gray-300 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value='Auto Id'
//               readOnly
//               disabled
//             />
//           </div>
//           <div>
//             <lable>Purchase Order</lable>
//             <input className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly disabled  />
//           </div>
           

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={master.Date}
//                 onChange={(e) => handleMasterChange('Date', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//              <Dropdown
//               label="Name of Supplier"
//               name="COA_ID"
//               value={master.COA_ID}
//               onChange={handleMasterChange}
//               options={supplierOptions}
//               placeholder="select"
//               required={true}
//             />
//           </div>

//           {/* Details Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Line_Id</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Item</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Qty</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Uom</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Price</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Gross Total</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Discount A</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Discount B</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Discount C</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Net Total</th>
//                   <th className="border border-gray-300 px-2 py-2 text-center text-sm">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {details.map((detail, index) => (
//                   <tr key={index}>
//                     <td className="border border-gray-300 px-2 py-1">{detail.Line_Id}</td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         value={detail.Item_ID}
//                         onChange={(e) => handleDetailChange(index, 'Item_ID', e.target.value)}
//                         className="w-full px-1 py-1 text-sm"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.001"
//                         value={detail.Stock_In_UOM_Qty}
//                         onChange={(e) => handleDetailChange(index, 'Stock_In_UOM_Qty', e.target.value)}
//                         className="w-full px-1 py-1 text-sm"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         value={detail.Stock_In_UOM}
//                         onChange={(e) => handleDetailChange(index, 'Stock_In_UOM', e.target.value)}
//                         className="w-full px-1 py-1 text-sm"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Price}
//                         onChange={(e) => handleDetailChange(index, 'Price', e.target.value)}
//                         className="w-full px-1 py-1 text-sm"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1 bg-gray-50 text-sm">
//                       {detail.grossTotal.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Discount_A}
//                         onChange={(e) => handleDetailChange(index, 'Discount_A', e.target.value)}
//                         className="w-full px-1 py-1 text-sm"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Discount_B}
//                         onChange={(e) => handleDetailChange(index, 'Discount_B', e.target.value)}
//                         className="w-full px-1 py-1 text-sm"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Discount_C}
//                         onChange={(e) => handleDetailChange(index, 'Discount_C', e.target.value)}
//                         className="w-full px-1 py-1 text-sm"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1 bg-blue-50 font-semibold text-sm">
//                       {detail.netTotal.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1 text-center">
//                       <button
//                         type="button"
//                         onClick={() => removeDetailRow(index)}
//                         disabled={details.length === 1}
//                         className="text-red-600 hover:text-red-800 disabled:text-gray-400"
//                       >
//                         ✕
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4 flex justify-between">
//             <button
//               type="button"
//               onClick={addDetailRow}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               + Add Row
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? 'Creating...' : 'Create Order'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default OrderForm
