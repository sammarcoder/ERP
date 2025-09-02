// 'use client'

// import React, { useState, useEffect } from 'react'
// import SearchableDropdown from './SearchableDropdown'
// import { useRouter } from 'next/navigation'

// interface UnifiedOrderFormProps {
//   orderType: 'purchase' | 'sales'
// }

// interface ItemData {
//   id: number
//   itemName: string
//   sellingPrice: string
//   purchasePricePKR: string
//   skuUOM: number | null
//   [key: string]: any
// }

// interface UOMData {
//   id: number
//   uom: string
// }

// interface COAData {
//   id: number
//   acName: string
//   coaTypeId: number
//   [key: string]: any
// }

// const UnifiedOrderForm: React.FC<UnifiedOrderFormProps> = ({ orderType }) => {
//   const router = useRouter()
//   const isPurchase = orderType === 'purchase'
  
//   const [master, setMaster] = useState({
//     Stock_Type_ID: isPurchase ? 1 : 2,
//     Date: new Date().toISOString().split('T')[0],
//     COA_ID: null as number | null,
//     Next_Status: 'Incomplete'
//   })

//   const [details, setDetails] = useState([{
//     Line_Id: 1,
//     Item_ID: null as number | null,
//     Price: 0,
//     Stock_In_UOM: null as number | null,
//     Stock_In_UOM_Qty: 0,
//     Stock_SKU_Price: 0,
//     Stock_In_SKU_UOM: null as number | null,
//     Stock_In_SKU_UOM_Qty: 0,
//     Stock_out_UOM: null as number | null,
//     Stock_out_UOM_Qty: 0,
//     Stock_out_SKU_UOM: null as number | null,
//     Stock_out_SKU_UOM_Qty: 0,
//     Discount_A: 0,
//     Discount_B: 0,
//     Discount_C: 0,
//     Goods: '',
//     Remarks: '',
//     grossTotal: 0,
//     netTotal: 0
//   }])

//   const [items, setItems] = useState<ItemData[]>([])
//   const [uoms, setUoms] = useState<UOMData[]>([])
//   const [accounts, setAccounts] = useState<COAData[]>([])
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState({ type: '', text: '' })

//   useEffect(() => {
//     fetchAllData()
//   }, [isPurchase])

//   const fetchAllData = async () => {
//     try {
//       const baseUrl = typeof window !== 'undefined'
//         ? `http://${window.location.hostname}:5000/api`
//         : 'http://localhost:5000/api'

//       // Fetch Items
//       const itemsRes = await fetch(`${baseUrl}/z-items/items`)
//       const itemsData = await itemsRes.json()
//       if (itemsData.success) {
//         setItems(itemsData.data)
//       }

//       // Fetch UOMs
//       const uomsRes = await fetch(`${baseUrl}/z-uom/get`)
//       const uomsData = await uomsRes.json()
//       if (uomsData.data) {
//         setUoms(uomsData.data)
//       }

//       // Fetch COA (Suppliers/Customers)
//       const coaRes = await fetch(`${baseUrl}/z-coa/get`)
//       const coaData = await coaRes.json()
//       if (coaData.sucess && coaData.zCoaRecords) {
//         // Filter based on order type
//         const filtered = coaData.zCoaRecords.filter((coa: COAData) => {
//           if (isPurchase) {
//             // Filter for supplier types
//             return [3, 4, 5].includes(coa.coaTypeId)
//           } else {
//             // Filter for customer types
//             return [1, 2].includes(coa.coaTypeId)
//           }
//         })
//         setAccounts(filtered)
//       }

//     } catch (error) {
//       console.error('Error fetching data:', error)
//       setMessage({ type: 'error', text: 'Failed to load data' })
//     }
//   }

//   const handleMasterChange = (name: string, value: any) => {
//     setMaster(prev => ({ ...prev, [name]: value }))
//   }

//   const handleDetailChange = (index: number, field: string, value: any) => {
//     const updatedDetails = [...details]
//     updatedDetails[index] = {
//       ...updatedDetails[index],
//       [field]: value
//     }

//     // Auto-calculate totals
//     if (['Price', 'Stock_In_UOM_Qty', 'Stock_out_UOM_Qty', 'Discount_A', 'Discount_B', 'Discount_C'].includes(field)) {
//       const price = parseFloat(updatedDetails[index].Price.toString()) || 0
//       const qty = isPurchase 
//         ? parseFloat(updatedDetails[index].Stock_In_UOM_Qty.toString()) || 0
//         : parseFloat(updatedDetails[index].Stock_out_UOM_Qty.toString()) || 0
      
//       const discountA = parseFloat(updatedDetails[index].Discount_A.toString()) || 0
//       const discountB = parseFloat(updatedDetails[index].Discount_B.toString()) || 0
//       const discountC = parseFloat(updatedDetails[index].Discount_C.toString()) || 0

//       const grossTotal = price * qty
      
//       // Apply cascading discounts
//       let netTotal = grossTotal
//       netTotal = netTotal - (netTotal * discountA / 100)
//       netTotal = netTotal - (netTotal * discountB / 100)
//       netTotal = netTotal - (netTotal * discountC / 100)

//       updatedDetails[index].grossTotal = grossTotal
//       updatedDetails[index].netTotal = netTotal
//     }

//     setDetails(updatedDetails)
//   }

//   const handleItemSelect = (index: number, item: ItemData) => {
//     const updatedDetails = [...details]
//     updatedDetails[index] = {
//       ...updatedDetails[index],
//       Item_ID: item.id,
//       Price: parseFloat(isPurchase ? item.purchasePricePKR : item.sellingPrice) || 0,
//       Stock_In_UOM: item.skuUOM,
//       Stock_In_SKU_UOM: item.skuUOM,
//       Stock_out_UOM: item.skuUOM,
//       Stock_out_SKU_UOM: item.skuUOM
//     }
    
//     // Recalculate totals
//     const price = updatedDetails[index].Price
//     const qty = isPurchase 
//       ? updatedDetails[index].Stock_In_UOM_Qty 
//       : updatedDetails[index].Stock_out_UOM_Qty
    
//     updatedDetails[index].grossTotal = price * qty
//     updatedDetails[index].netTotal = price * qty
    
//     setDetails(updatedDetails)
//   }

//   const addDetailRow = () => {
//     const newRow = {
//       Line_Id: details.length + 1,
//       Item_ID: null,
//       Price: 0,
//       Stock_In_UOM: null,
//       Stock_In_UOM_Qty: 0,
//       Stock_SKU_Price: 0,
//       Stock_In_SKU_UOM: null,
//       Stock_In_SKU_UOM_Qty: 0,
//       Stock_out_UOM: null,
//       Stock_out_UOM_Qty: 0,
//       Stock_out_SKU_UOM: null,
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
//       // Recalculate line IDs
//       filtered.forEach((item, i) => {
//         item.Line_Id = i + 1
//       })
//       setDetails(filtered)
//     }
//   }

//   const validateForm = () => {
//     if (!master.COA_ID) {
//       setMessage({ type: 'error', text: `Please select a ${isPurchase ? 'supplier' : 'customer'}` })
//       return false
//     }

//     for (const detail of details) {
//       if (!detail.Item_ID) {
//         setMessage({ type: 'error', text: 'Please select an item for all rows' })
//         return false
//       }
//       if (isPurchase && detail.Stock_In_UOM_Qty <= 0) {
//         setMessage({ type: 'error', text: 'Quantity must be greater than 0' })
//         return false
//       }
//       if (!isPurchase && detail.Stock_out_UOM_Qty <= 0) {
//         setMessage({ type: 'error', text: 'Quantity must be greater than 0' })
//         return false
//       }
//     }

//     return true
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) return

//     setLoading(true)
//     setMessage({ type: '', text: '' })

//     const apiUrl = typeof window !== 'undefined'
//       ? `http://${window.location.hostname}:5000/api/orders`
//       : 'http://localhost:5000/api/orders'

//     const orderData = {
//       master: {
//         ...master,
//         COA_ID: Number(master.COA_ID)
//       },
//       details: details.map(d => ({
//         Item_ID: Number(d.Item_ID),
//         Price: Number(d.Price),
//         Stock_In_UOM: d.Stock_In_UOM ? Number(d.Stock_In_UOM) : null,
//         Stock_In_UOM_Qty: Number(d.Stock_In_UOM_Qty),
//         Stock_SKU_Price: Number(d.Stock_SKU_Price),
//         Stock_In_SKU_UOM: d.Stock_In_SKU_UOM ? Number(d.Stock_In_SKU_UOM) : null,
//         Stock_In_SKU_UOM_Qty: Number(d.Stock_In_SKU_UOM_Qty),
//         Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
//         Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
//         Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
//         Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
//         Discount_A: Number(d.Discount_A) || 0,
//         Discount_B: Number(d.Discount_B) || 0,
//         Discount_C: Number(d.Discount_C) || 0,
//         Goods: d.Goods || '',
//         Remarks: d.Remarks || ''
//       }))
//     }

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData)
//       })

//       const result = await response.json()

//       if (response.ok && result.success) {
//         setMessage({ type: 'success', text: `${isPurchase ? 'Purchase' : 'Sales'} order created successfully!` })
//         setTimeout(() => {
//           router.push(`/orders/${isPurchase ? 'purchase' : 'sales'}`)
//         }, 2000)
//       } else {
//         setMessage({ type: 'error', text: result.message || 'Failed to create order' })
//       }
//     } catch (error) {
//       console.error('Submit error:', error)
//       setMessage({ type: 'error', text: 'Failed to submit order' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Calculate grand totals
//   const grandTotals = details.reduce((acc, detail) => ({
//     grossTotal: acc.grossTotal + detail.grossTotal,
//     netTotal: acc.netTotal + detail.netTotal
//   }), { grossTotal: 0, netTotal: 0 })

//   // Prepare dropdown options
//   const itemOptions = items.map(item => ({
//     id: item.id,
//     label: item.itemName
//   }))

//   const uomOptions = uoms.map(uom => ({
//     id: uom.id,
//     label: uom.uom
//   }))

//   const accountOptions = accounts.map(acc => ({
//     id: acc.id,
//     label: acc.acName
//   }))

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
//         <div className={`${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white p-4 rounded-t-lg`}>
//           <h1 className="text-xl font-bold">{isPurchase ? 'Purchase Order' : 'Sales Order'}</h1>
//         </div>

//         {message.text && (
//           <div className={`m-4 p-3 rounded ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-6">
//           {/* Header Section */}
//           <div className="grid grid-cols-4 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Order ID
//               </label>
//               <input 
//                 className="w-full px-3 py-2 text-gray-600 border border-gray-300 bg-gray-100 rounded-md"
//                 value="Auto Generated"
//                 readOnly
//                 disabled
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Order Number
//               </label>
//               <input 
//                 className="w-full px-3 py-2 text-gray-600 border border-gray-300 bg-gray-100 rounded-md"
//                 value="Auto Generated"
//                 readOnly
//                 disabled
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
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

//             <SearchableDropdown
//               label={isPurchase ? "Supplier" : "Customer"}
//               name="COA_ID"
//               value={master.COA_ID}
//               onChange={handleMasterChange}
//               options={accountOptions}
//               placeholder={`Select ${isPurchase ? 'supplier' : 'customer'}`}
//               required={true}
//               displayKey="label"
//               valueKey="id"
//             />
//           </div>

//           {/* Details Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Line</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Item</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">
//                     {isPurchase ? 'Purchase Qty' : 'Sales Qty'}
//                   </th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">UOM</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Price</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Gross Total</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Disc A%</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Disc B%</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Disc C%</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Net Total</th>
//                   <th className="border border-gray-300 px-2 py-2 text-left text-sm">Remarks</th>
//                   <th className="border border-gray-300 px-2 py-2 text-center text-sm">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {details.map((detail, index) => (
//                   <tr key={index}>
//                     <td className="border border-gray-300 px-2 py-1 text-center">
//                       {detail.Line_Id}
//                     </td>
//                     <td className="border border-gray-300 px-1 py-1">
//                       <SearchableDropdown
//                         label=""
//                         name={`Item_ID_${index}`}
//                         value={detail.Item_ID}
//                         onChange={(name, value) => {
//                           handleDetailChange(index, 'Item_ID', value)
//                           const selectedItem = items.find(i => i.id === value)
//                           if (selectedItem) {
//                             handleItemSelect(index, selectedItem)
//                           }
//                         }}
//                         options={itemOptions}
//                         placeholder="Select item"
//                         displayKey="label"
//                         valueKey="id"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.001"
//                         value={isPurchase ? detail.Stock_In_UOM_Qty : detail.Stock_out_UOM_Qty}
//                         onChange={(e) => handleDetailChange(
//                           index, 
//                           isPurchase ? 'Stock_In_UOM_Qty' : 'Stock_out_UOM_Qty', 
//                           e.target.value
//                         )}
//                         className="w-full px-1 py-1 text-sm border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-1 py-1">
//                       <SearchableDropdown
//                         label=""
//                         name={`UOM_${index}`}
//                         value={isPurchase ? detail.Stock_In_UOM : detail.Stock_out_UOM}
//                         onChange={(name, value) => handleDetailChange(
//                           index, 
//                           isPurchase ? 'Stock_In_UOM' : 'Stock_out_UOM', 
//                           value
//                         )}
//                         options={uomOptions}
//                         placeholder="UOM"
//                         displayKey="label"
//                         valueKey="id"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Price}
//                         onChange={(e) => handleDetailChange(index, 'Price', e.target.value)}
//                         className="w-full px-1 py-1 text-sm border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1 bg-gray-50 text-right">
//                       {detail.grossTotal.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Discount_A}
//                         onChange={(e) => handleDetailChange(index, 'Discount_A', e.target.value)}
//                         className="w-full px-1 py-1 text-sm border rounded"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Discount_B}
//                         onChange={(e) => handleDetailChange(index, 'Discount_B', e.target.value)}
//                         className="w-full px-1 py-1 text-sm border rounded"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={detail.Discount_C}
//                         onChange={(e) => handleDetailChange(index, 'Discount_C', e.target.value)}
//                         className="w-full px-1 py-1 text-sm border rounded"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1 bg-blue-50 font-semibold text-right">
//                       {detail.netTotal.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1">
//                       <input
//                         type="text"
//                         value={detail.Remarks}
//                         onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
//                         className="w-full px-1 py-1 text-sm border rounded"
//                         placeholder="Remarks"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-2 py-1 text-center">
//                       <button
//                         type="button"
//                         onClick={() => removeDetailRow(index)}
//                         disabled={details.length === 1}
//                         className="text-red-600 hover:text-red-800 disabled:text-gray-400 px-2"
//                       >
//                         ✕
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr className="bg-gray-100 font-bold">
//                   <td colSpan={5} className="border border-gray-300 px-2 py-2 text-right">
//                     Grand Total:
//                   </td>
//                   <td className="border border-gray-300 px-2 py-2 text-right">
//                     {grandTotals.grossTotal.toFixed(2)}
//                   </td>
//                   <td colSpan={3} className="border border-gray-300"></td>
//                   <td className="border border-gray-300 px-2 py-2 text-right bg-blue-100">
//                     {grandTotals.netTotal.toFixed(2)}
//                   </td>
//                   <td colSpan={2} className="border border-gray-300"></td>
//                 </tr>
//               </tfoot>
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

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => router.push(`/orders/${isPurchase ? 'purchase' : 'sales'}`)}
//                 className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-6 py-2 text-white rounded disabled:opacity-50 ${
//                   isPurchase 
//                     ? 'bg-blue-600 hover:bg-blue-700' 
//                     : 'bg-green-600 hover:bg-green-700'
//                 }`}
//               >
//                 {loading ? 'Creating...' : `Create ${isPurchase ? 'Purchase' : 'Sales'} Order`}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default UnifiedOrderForm



















































'use client'

import React, { useState, useEffect } from 'react'
import SelectableTable from './SelectableTable'
import { useRouter, useSearchParams } from 'next/navigation'

interface UnifiedOrderFormProps {
  orderType: 'purchase' | 'sales'
}

interface ItemData {
  id: number
  itemName: string
  sellingPrice: string
  purchasePricePKR: string
  skuUOM: number | null
  [key: string]: any
}

interface UOMData {
  id: number
  uom: string
}

interface COAData {
  id: number
  acName: string
  coaTypeId: number
  city: string
  personName: string
  [key: string]: any
}

const UnifiedOrderForm: React.FC<UnifiedOrderFormProps> = ({ orderType }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const isEditMode = Boolean(orderId)
  const isPurchase = orderType === 'purchase'
  
  const [master, setMaster] = useState({
    Stock_Type_ID: isPurchase ? 1 : 2,
    Date: new Date().toISOString().split('T')[0],
    COA_ID: null as number | null,
    Next_Status: 'Incomplete'
  })

  const [details, setDetails] = useState([{
    Line_Id: 1,
    Item_ID: null as number | null,
    Price: 0,
    Stock_In_UOM: null as number | null,
    Stock_In_UOM_Qty: 0,
    Stock_SKU_Price: 0,
    Stock_In_SKU_UOM: null as number | null,
    Stock_In_SKU_UOM_Qty: 0,
    Stock_out_UOM: null as number | null,
    Stock_out_UOM_Qty: 0,
    Stock_out_SKU_UOM: null as number | null,
    Stock_out_SKU_UOM_Qty: 0,
    Discount_A: 0,
    Discount_B: 0,
    Discount_C: 0,
    Goods: '',
    Remarks: '',
    grossTotal: 0,
    netTotal: 0
  }])

  const [items, setItems] = useState<ItemData[]>([])
  const [uoms, setUoms] = useState<UOMData[]>([])
  const [accounts, setAccounts] = useState<COAData[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchAllData()
  }, [isPurchase])

  useEffect(() => {
    if (isEditMode && orderId) {
      fetchOrderData(orderId)
    }
  }, [isEditMode, orderId])

  const fetchAllData = async () => {
    try {
      setDataLoading(true)
      const baseUrl = typeof window !== 'undefined'
        ? `http://${window.location.hostname}:5000/api`
        : 'http://localhost:5000/api'

      // Fetch Items
      const itemsRes = await fetch(`${baseUrl}/z-items/items`)
      const itemsData = await itemsRes.json()
      if (itemsData.success) {
        setItems(itemsData.data)
      }

      // Fetch UOMs
      const uomsRes = await fetch(`${baseUrl}/z-uom/get`)
      const uomsData = await uomsRes.json()
      if (uomsData.data) {
        setUoms(uomsData.data)
      }

      // Fetch COA - FIXED: Using correct URL and proper filtering
      const coaRes = await fetch(`${baseUrl}/z-coa/get`)
      const coaData = await coaRes.json()
      if (coaData.sucess && coaData.zCoaRecords) {
        // CORRECTED FILTERING: Purchase=Suppliers, Sales=Customers
        const filtered = coaData.zCoaRecords.filter((coa: COAData) => {
          if (isPurchase) {
            // Purchase orders need SUPPLIERS (coaTypeId: 3,4,5)
            return [3, 4, 5].includes(coa.coaTypeId)
          } else {
            // Sales orders need CUSTOMERS (coaTypeId: 1,2)
            return [1, 2].includes(coa.coaTypeId)
          }
        })
        setAccounts(filtered)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage({ type: 'error', text: 'Failed to load data' })
    } finally {
      setDataLoading(false)
    }
  }

  const fetchOrderData = async (id: string) => {
    try {
      setDataLoading(true)
      const baseUrl = typeof window !== 'undefined'
        ? `http://${window.location.hostname}:5000/api`
        : 'http://localhost:5000/api'

      const response = await fetch(`${baseUrl}/orders/${id}`)
      const result = await response.json()

      if (result.success && result.data) {
        const orderData = result.data
        
        // Set master data
        setMaster({
          Stock_Type_ID: orderData.Stock_Type_ID,
          Date: orderData.Date.split('T')[0],
          COA_ID: orderData.COA_ID,
          Next_Status: orderData.Next_Status
        })

        // Set details data
        if (orderData.details && orderData.details.length > 0) {
          const formattedDetails = orderData.details.map((detail: any, index: number) => {
            const price = parseFloat(detail.Price) || 0
            const qty = isPurchase 
              ? parseFloat(detail.Stock_In_UOM_Qty) || 0
              : parseFloat(detail.Stock_out_UOM_Qty) || 0
            
            const discountA = parseFloat(detail.Discount_A) || 0
            const discountB = parseFloat(detail.Discount_B) || 0
            const discountC = parseFloat(detail.Discount_C) || 0

            const grossTotal = price * qty
            let netTotal = grossTotal
            netTotal = netTotal - (netTotal * discountA / 100)
            netTotal = netTotal - (netTotal * discountB / 100)
            netTotal = netTotal - (netTotal * discountC / 100)

            return {
              Line_Id: index + 1,
              Item_ID: detail.Item_ID,
              Price: price,
              Stock_In_UOM: detail.Stock_In_UOM,
              Stock_In_UOM_Qty: parseFloat(detail.Stock_In_UOM_Qty) || 0,
              Stock_SKU_Price: parseFloat(detail.Stock_SKU_Price) || 0,
              Stock_In_SKU_UOM: detail.Stock_In_SKU_UOM,
              Stock_In_SKU_UOM_Qty: parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0,
              Stock_out_UOM: detail.Stock_out_UOM,
              Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
              Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
              Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
              Discount_A: discountA,
              Discount_B: discountB,
              Discount_C: discountC,
              Goods: detail.Goods || '',
              Remarks: detail.Remarks || '',
              grossTotal,
              netTotal
            }
          })
          setDetails(formattedDetails)
        }
      }
    } catch (error) {
      console.error('Error fetching order data:', error)
      setMessage({ type: 'error', text: 'Failed to load order data' })
    } finally {
      setDataLoading(false)
    }
  }

  const handleMasterChange = (name: string, value: any) => {
    setMaster(prev => ({ ...prev, [name]: value }))
  }

  const handleDetailChange = (index: number, field: string, value: any) => {
    const updatedDetails = [...details]
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value
    }

    // Auto-calculate totals
    if (['Price', 'Stock_In_UOM_Qty', 'Stock_out_UOM_Qty', 'Discount_A', 'Discount_B', 'Discount_C'].includes(field)) {
      const price = parseFloat(updatedDetails[index].Price.toString()) || 0
      const qty = isPurchase 
        ? parseFloat(updatedDetails[index].Stock_In_UOM_Qty.toString()) || 0
        : parseFloat(updatedDetails[index].Stock_out_UOM_Qty.toString()) || 0
      
      const discountA = parseFloat(updatedDetails[index].Discount_A.toString()) || 0
      const discountB = parseFloat(updatedDetails[index].Discount_B.toString()) || 0
      const discountC = parseFloat(updatedDetails[index].Discount_C.toString()) || 0

      const grossTotal = price * qty
      
      // Apply cascading discounts
      let netTotal = grossTotal
      netTotal = netTotal - (netTotal * discountA / 100)
      netTotal = netTotal - (netTotal * discountB / 100)
      netTotal = netTotal - (netTotal * discountC / 100)

      updatedDetails[index].grossTotal = grossTotal
      updatedDetails[index].netTotal = netTotal
    }

    setDetails(updatedDetails)
  }

  const handleItemSelect = (index: number, item: ItemData) => {
    const updatedDetails = [...details]
    updatedDetails[index] = {
      ...updatedDetails[index],
      Item_ID: item.id,
      Price: parseFloat(isPurchase ? item.purchasePricePKR : item.sellingPrice) || 0,
      Stock_In_UOM: item.skuUOM,
      Stock_In_SKU_UOM: item.skuUOM,
      Stock_out_UOM: item.skuUOM,
      Stock_out_SKU_UOM: item.skuUOM
    }
    
    // Recalculate totals
    const price = updatedDetails[index].Price
    const qty = isPurchase 
      ? updatedDetails[index].Stock_In_UOM_Qty 
      : updatedDetails[index].Stock_out_UOM_Qty
    
    updatedDetails[index].grossTotal = price * qty
    updatedDetails[index].netTotal = price * qty
    
    setDetails(updatedDetails)
  }

  const addDetailRow = () => {
    const newRow = {
      Line_Id: details.length + 1,
      Item_ID: null,
      Price: 0,
      Stock_In_UOM: null,
      Stock_In_UOM_Qty: 0,
      Stock_SKU_Price: 0,
      Stock_In_SKU_UOM: null,
      Stock_In_SKU_UOM_Qty: 0,
      Stock_out_UOM: null,
      Stock_out_UOM_Qty: 0,
      Stock_out_SKU_UOM: null,
      Stock_out_SKU_UOM_Qty: 0,
      Discount_A: 0,
      Discount_B: 0,
      Discount_C: 0,
      Goods: '',
      Remarks: '',
      grossTotal: 0,
      netTotal: 0
    }
    setDetails([...details, newRow])
  }

  const removeDetailRow = (index: number) => {
    if (details.length > 1) {
      const filtered = details.filter((_, i) => i !== index)
      // Recalculate line IDs
      filtered.forEach((item, i) => {
        item.Line_Id = i + 1
      })
      setDetails(filtered)
    }
  }

  const validateForm = () => {
    if (!master.COA_ID) {
      setMessage({ 
        type: 'error', 
        text: `Please select a ${isPurchase ? 'supplier' : 'customer'}` 
      })
      return false
    }

    for (const detail of details) {
      if (!detail.Item_ID) {
        setMessage({ type: 'error', text: 'Please select an item for all rows' })
        return false
      }
      if (isPurchase && detail.Stock_In_UOM_Qty <= 0) {
        setMessage({ type: 'error', text: 'Purchase quantity must be greater than 0' })
        return false
      }
      if (!isPurchase && detail.Stock_out_UOM_Qty <= 0) {
        setMessage({ type: 'error', text: 'Sales quantity must be greater than 0' })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    const baseUrl = typeof window !== 'undefined'
      ? `http://${window.location.hostname}:5000/api`
      : 'http://localhost:5000/api'

    const orderData = {
      master: {
        ...master,
        COA_ID: Number(master.COA_ID)
      },
      details: details.map(d => ({
        Item_ID: Number(d.Item_ID),
        Price: Number(d.Price),
        Stock_In_UOM: d.Stock_In_UOM ? Number(d.Stock_In_UOM) : null,
        Stock_In_UOM_Qty: Number(d.Stock_In_UOM_Qty),
        Stock_SKU_Price: Number(d.Stock_SKU_Price),
        Stock_In_SKU_UOM: d.Stock_In_SKU_UOM ? Number(d.Stock_In_SKU_UOM) : null,
        Stock_In_SKU_UOM_Qty: Number(d.Stock_In_SKU_UOM_Qty),
        Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
        Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
        Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
        Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
        Discount_A: Number(d.Discount_A) || 0,
        Discount_B: Number(d.Discount_B) || 0,
        Discount_C: Number(d.Discount_C) || 0,
        Goods: d.Goods || '',
        Remarks: d.Remarks || ''
      }))
    }

    try {
      const url = isEditMode ? `${baseUrl}/orders/${orderId}` : `${baseUrl}/orders`
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setMessage({ 
          type: 'success', 
          text: `${isPurchase ? 'Purchase' : 'Sales'} order ${isEditMode ? 'updated' : 'created'} successfully!` 
        })
        setTimeout(() => {
          router.push(`/orders/${isPurchase ? 'purchase' : 'sales'}`)
        }, 2000)
      } else {
        setMessage({ type: 'error', text: result.message || `Failed to ${isEditMode ? 'update' : 'create'} order` })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setMessage({ type: 'error', text: `Failed to ${isEditMode ? 'update' : 'submit'} order` })
    } finally {
      setLoading(false)
    }
  }

  // Calculate grand totals
  const grandTotals = details.reduce((acc, detail) => ({
    grossTotal: acc.grossTotal + detail.grossTotal,
    netTotal: acc.netTotal + detail.netTotal
  }), { grossTotal: 0, netTotal: 0 })

  // Prepare table options with additional columns
  const itemOptions = items.map(item => ({
    id: item.id,
    label: item.itemName,
    itemName: item.itemName,
    sellingPrice: item.sellingPrice,
    purchasePrice: item.purchasePricePKR
  }))

  const uomOptions = uoms.map(uom => ({
    id: uom.id,
    label: uom.uom,
    uom: uom.uom
  }))

  const accountOptions = accounts.map(acc => ({
    id: acc.id,
    label: acc.acName,
    acName: acc.acName,
    city: acc.city,
    personName: acc.personName
  }))

  // Column definitions for tables
  const itemColumns = [
    { key: 'itemName', label: 'Item Name', width: '40%' },
    { key: 'sellingPrice', label: 'Selling Price', width: '30%' },
    { key: 'purchasePrice', label: 'Purchase Price', width: '30%' }
  ]

  const accountColumns = [
    { key: 'acName', label: 'Account Name', width: '50%' },
    { key: 'city', label: 'City', width: '25%' },
    { key: 'personName', label: 'Contact Person', width: '25%' }
  ]

  if (dataLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
        <div className={`${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white p-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              {isEditMode ? 'Edit' : 'Create'} {isPurchase ? 'Purchase Order' : 'Sales Order'}
            </h1>
            <button
              onClick={() => router.push(`/orders/${isPurchase ? 'purchase' : 'sales'}`)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`m-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Header Section */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input 
                className="w-full px-3 py-2 text-gray-600 border border-gray-300 bg-gray-100 rounded-md"
                value={isEditMode ? orderId : "Auto Generated"}
                readOnly
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number
              </label>
              <input 
                className="w-full px-3 py-2 text-gray-600 border border-gray-300 bg-gray-100 rounded-md"
                value="Auto Generated"
                readOnly
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={master.Date}
                onChange={(e) => handleMasterChange('Date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* CORRECTED: Proper terminology */}
            <SelectableTable
              label={isPurchase ? "Supplier" : "Customer"}
              name="COA_ID"
              value={master.COA_ID}
              onChange={handleMasterChange}
              options={accountOptions}
              placeholder={`Select ${isPurchase ? 'supplier' : 'customer'}`}
              required={true}
              displayKey="label"
              valueKey="id"
              columns={accountColumns}
              pageSize={10}
            />
          </div>

          {/* Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Line</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Item</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">
                    {isPurchase ? 'Purchase Qty' : 'Sales Qty'}
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">UOM</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Price</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Gross Total</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Disc A%</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Disc B%</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Disc C%</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Net Total</th>
                  <th className="border border-gray-300 px-2 py-2 text-left text-sm">Remarks</th>
                  <th className="border border-gray-300 px-2 py-2 text-center text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {detail.Line_Id}
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <SelectableTable
                        label=""
                        name={`Item_ID_${index}`}
                        value={detail.Item_ID}
                        onChange={(name, value) => {
                          handleDetailChange(index, 'Item_ID', value)
                          const selectedItem = items.find(i => i.id === value)
                          if (selectedItem) {
                            handleItemSelect(index, selectedItem)
                          }
                        }}
                        options={itemOptions}
                        placeholder="Select item"
                        displayKey="label"
                        valueKey="id"
                        columns={itemColumns}
                        pageSize={8}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.001"
                        value={isPurchase ? detail.Stock_In_UOM_Qty : detail.Stock_out_UOM_Qty}
                        onChange={(e) => handleDetailChange(
                          index, 
                          isPurchase ? 'Stock_In_UOM_Qty' : 'Stock_out_UOM_Qty', 
                          e.target.value
                        )}
                        className="w-full px-1 py-1 text-sm border rounded"
                        required
                      />
                    </td>
                    <td className="border border-gray-300 px-1 py-1">
                      <SelectableTable
                        label=""
                        name={`UOM_${index}`}
                        value={isPurchase ? detail.Stock_In_UOM : detail.Stock_out_UOM}
                        onChange={(name, value) => handleDetailChange(
                          index, 
                          isPurchase ? 'Stock_In_UOM' : 'Stock_out_UOM', 
                          value
                        )}
                        options={uomOptions}
                        placeholder="UOM"
                        displayKey="label"
                        valueKey="id"
                        pageSize={6}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        value={detail.Price}
                        onChange={(e) => handleDetailChange(index, 'Price', e.target.value)}
                        className="w-full px-1 py-1 text-sm border rounded"
                        required
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 bg-gray-50 text-right">
                      {detail.grossTotal.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        value={detail.Discount_A}
                        onChange={(e) => handleDetailChange(index, 'Discount_A', e.target.value)}
                        className="w-full px-1 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        value={detail.Discount_B}
                        onChange={(e) => handleDetailChange(index, 'Discount_B', e.target.value)}
                        className="w-full px-1 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        step="0.01"
                        value={detail.Discount_C}
                        onChange={(e) => handleDetailChange(index, 'Discount_C', e.target.value)}
                        className="w-full px-1 py-1 text-sm border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 bg-blue-50 font-semibold text-right">
                      {detail.netTotal.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="text"
                        value={detail.Remarks}
                        onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
                        className="w-full px-1 py-1 text-sm border rounded"
                        placeholder="Remarks"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeDetailRow(index)}
                        disabled={details.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 px-2"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={5} className="border border-gray-300 px-2 py-2 text-right">
                    Grand Total:
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right">
                    {grandTotals.grossTotal.toFixed(2)}
                  </td>
                  <td colSpan={3} className="border border-gray-300"></td>
                  <td className="border border-gray-300 px-2 py-2 text-right bg-blue-100">
                    {grandTotals.netTotal.toFixed(2)}
                  </td>
                  <td colSpan={2} className="border border-gray-300"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={addDetailRow}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Row
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push(`/orders/${isPurchase ? 'purchase' : 'sales'}`)}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-white rounded disabled:opacity-50 ${
                  isPurchase 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : `${isEditMode ? 'Update' : 'Create'} ${isPurchase ? 'Purchase' : 'Sales'} Order`
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UnifiedOrderForm
