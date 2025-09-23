
// 'use client'

// import React, { useState, useEffect, useCallback } from 'react';
// import SelectableTable from './SelectableTable';
// import ClassDropdown from './ClassDropdown';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UomConverter from './UomConverter';
// import { useItemFilter } from './useItemFilter';
// import EnhancedSelectableTable from './EnhancedSelectableTable';
// import MultiSelectItemTable from './MultiSelectItemTable';


// // interface Detail {
// //   Line_Id: number;
// //   Item_ID: number | null;
// //   Price: number;
// //   Stock_In_UOM: number | null;
// //   Stock_In_UOM_Qty: number;
// //   Stock_SKU_Price: number;
// //   Stock_In_SKU_UOM: number | null;
// //   Stock_In_SKU_UOM_Qty: number;
// //   Stock_out_UOM: number | null;
// //   Stock_out_UOM_Qty: number;
// //   Stock_out_SKU_UOM: number | null;
// //   Stock_out_SKU_UOM_Qty: number;
// //   uom1_qty?: number;
// //   uom2_qty?: number;
// //   uom3_qty?: number;
// //   sale_unit?: string;
// //   Discount_A: number;
// //   Discount_B: number;
// //   Discount_C: number;
// //   Goods: string;
// //   Remarks: string;
// //   grossTotal: number;
// //   netTotal: number;
// // }


// interface Detail {
//   Line_Id: number;
//   Item_ID: number | null;
//   Price: number;
//   Stock_In_UOM: number | null;
//   Stock_In_UOM_Qty: number;
//   Stock_SKU_Price: number;
//   Stock_In_SKU_UOM: number | null;
//   Stock_In_SKU_UOM_Qty: number;
//   Stock_In_UOM3_Qty: number;        // ADD THIS
//   Stock_out_UOM: number | null;
//   Stock_out_UOM_Qty: number;
//   Stock_out_SKU_UOM: number | null;
//   Stock_out_SKU_UOM_Qty: number;
//   Stock_out_UOM3_Qty: number;       // ADD THIS
//   uom1_qty?: number;
//   uom2_qty?: number;
//   uom3_qty?: number;
//   sale_unit?: string;
//   Discount_A: number;
//   Discount_B: number;
//   Discount_C: number;
//   Goods: string;
//   Remarks: string;
//   grossTotal: number;
//   netTotal: number;
// }





// interface Item {
//   id: number;
//   itemName: string;
//   itemClass1?: number | null;
//   itemClass2?: number | null;
//   itemClass3?: number | null;
//   itemClass4?: number | null;
//   [key: string]: any;
// }

// interface ClassFilters {
//   itemClass1: number | null;
//   itemClass2: number | null;
//   itemClass3: number | null;
//   itemClass4: number | null;
// }



// const UnifiedOrderForm = ({ orderType }) => {


//   const [formValues, setFormValues] = useState<ClassFilters>({
//     itemClass1: null,
//     itemClass2: null,
//     itemClass3: null,
//     itemClass4: null,
//   })




//   // Add this state for class data
//   const [classData, setClassData] = useState({
//     class1: [],
//     class2: [],
//     class3: [],
//     class4: []
//   })

//   // Add this useEffect to fetch class data
//   useEffect(() => {
//     const fetchClassData = async () => {
//       try {
//         const promises = [1, 2, 3, 4].map(id =>
//           fetch(`http://${window.location.hostname}:4000/api/z-classes/get-by-class-id/${id}`)
//             .then(res => res.json())
//         )
//         const results = await Promise.all(promises)

//         setClassData({
//           class1: results[0]?.getByclassID || [],
//           class2: results[1]?.getByclassID || [],
//           class3: results[2]?.getByclassID || [],
//           class4: results[3]?.getByclassID || []
//         })
//       } catch (error) {
//         console.error('Error fetching class data:', error)
//       }
//     }

//     fetchClassData()
//   }, [])


//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const orderId = searchParams.get('id')
//   const isEditMode = Boolean(orderId)
//   const isPurchase = orderType === 'purchase'

//   const [master, setMaster] = useState({
//     Stock_Type_ID: isPurchase ? 1 : 2,
//     Date: new Date().toISOString().split('T')[0],
//     COA_ID: null,
//     Next_Status: 'Incomplete'
//   })

//   // const [details, setDetails] = useState<Detail[]>([{
//   //   Line_Id: 1,
//   //   Item_ID: null,
//   //   Price: 0,
//   //   Stock_In_UOM: null,
//   //   Stock_In_UOM_Qty: 0,
//   //   Stock_SKU_Price: 0,
//   //   Stock_In_SKU_UOM: null,
//   //   Stock_In_SKU_UOM_Qty: 0,
//   //   Stock_out_UOM: null,
//   //   Stock_out_UOM_Qty: 0,
//   //   Stock_out_SKU_UOM: null,
//   //   Stock_out_SKU_UOM_Qty: 0,
//   //   uom1_qty: 0,
//   //   uom2_qty: 0,
//   //   uom3_qty: 0,
//   //   sale_unit: '',
//   //   Discount_A: 0,
//   //   Discount_B: 0,
//   //   Discount_C: 0,
//   //   Goods: '',
//   //   Remarks: '',
//   //   grossTotal: 0,
//   //   netTotal: 0
//   // }])



//   const [details, setDetails] = useState<Detail[]>([{
//     Line_Id: 1,
//     Item_ID: null,
//     Price: 0,
//     Stock_In_UOM: null,
//     Stock_In_UOM_Qty: 0,
//     Stock_SKU_Price: 0,
//     Stock_In_SKU_UOM: null,
//     Stock_In_SKU_UOM_Qty: 0,
//     Stock_In_UOM3_Qty: 0,            // ADD THIS
//     Stock_out_UOM: null,
//     Stock_out_UOM_Qty: 0,
//     Stock_out_SKU_UOM: null,
//     Stock_out_SKU_UOM_Qty: 0,
//     Stock_out_UOM3_Qty: 0,           // ADD THIS
//     uom1_qty: 0,
//     uom2_qty: 0,
//     uom3_qty: 0,
//     sale_unit: '',
//     Discount_A: 0,
//     Discount_B: 0,
//     Discount_C: 0,
//     Goods: '',
//     Remarks: '',
//     grossTotal: 0,
//     netTotal: 0
//   }])




//   const [expandedRows, setExpandedRows] = useState(new Set<number>())

//   const toggleRowExpanded = (rowIndex: number) => {
//     setExpandedRows(prev => {
//       const next = new Set(prev)
//       if (next.has(rowIndex)) {
//         next.delete(rowIndex)
//       } else {
//         next.add(rowIndex)
//       }
//       return next
//     })
//   }

//   const [items, setItems] = useState([])

//   const [allItems, setAllItems] = useState<Item[]>([])
//   const {
//     filteredItems,
//     activeFilterCount,
//     activeFilters,
//     totalItems,
//     filteredCount
//   } = useItemFilter({
//     items: items,
//     classFilters: formValues
//   })

//   useEffect(() => {
//     console.log('Items data for filtering:', {
//       totalItems: items?.length,
//       sampleItem: items?.[0],
//       classFilters: formValues
//     })
//   }, [items, formValues])


//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`http://${window.location.hostname}:4000/api/items`)
//         const data = await response.json()

//         // Adjust this based on your API response structure
//         const items = data.items || data || []
//         setAllItems(items)
//       } catch (error) {
//         console.error('Error fetching items:', error)
//         setAllItems([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchItems()
//   }, [])

//   const handleClassChange = (name: string, value: number | null) => {
//     setFormValues(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }
//   const handleClassFilterChange = (filters: ClassFilters) => {
//     // This is automatically handled by the state update in handleClassChange
//     // You can add additional logic here if needed
//     console.log('Applied filters:', filters)
//   }
//   const resetFilters = () => {
//     setFormValues({
//       itemClass1: null,
//       itemClass2: null,
//       itemClass3: null,
//       itemClass4: null,
//     })
//   }



//   const [showBulkSelector, setShowBulkSelector] = useState(false)
//   const [uoms, setUoms] = useState([])
//   const [accounts, setAccounts] = useState([])
//   const [selectedAccount, setSelectedAccount] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [dataLoading, setDataLoading] = useState(true)
//   const [message, setMessage] = useState({ type: '', text: '' })
//   const [debug, setDebug] = useState({})



//   // const addBulkItems = (selectedItems: any[]) => {
//   //   const newRows = selectedItems.map((item, index) => {
//   //     const currentLineId = details.length + index + 1

//   //     return {
//   //       Line_Id: currentLineId,
//   //       Item_ID: item.id,
//   //       Price: parseFloat(isPurchase ? item.purchasePrice : item.sellingPrice) || 0,
//   //       Stock_In_UOM: null,
//   //       Stock_In_UOM_Qty: 0,
//   //       Stock_SKU_Price: 0,
//   //       Stock_In_SKU_UOM: null,
//   //       Stock_In_SKU_UOM_Qty: 0,
//   //       Stock_out_UOM: null,
//   //       Stock_out_UOM_Qty: 0,
//   //       Stock_out_SKU_UOM: null,
//   //       Stock_out_SKU_UOM_Qty: 0,
//   //       uom1_qty: 0,
//   //       uom2_qty: 0,
//   //       uom3_qty: 0,
//   //       sale_unit: '',
//   //       Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
//   //       Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
//   //       Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
//   //       Goods: '',
//   //       Remarks: '',
//   //       grossTotal: 0,
//   //       netTotal: 0
//   //     }
//   //   })

//   //   setDetails(prevDetails => [...prevDetails, ...newRows])

//   //   // Auto-expand the newly added rows
//   //   const newRowIndices = newRows.map((_, index) => details.length + index)
//   //   setExpandedRows(prev => {
//   //     const newSet = new Set(prev)
//   //     newRowIndices.forEach(idx => newSet.add(idx))
//   //     return newSet
//   //   })

//   //   // Close the bulk selector
//   //   setShowBulkSelector(false)

//   //   // Show success message
//   //   setMessage({
//   //     type: 'success',
//   //     text: `Successfully added ${selectedItems.length} items to your order`
//   //   })
//   // }








//   const addBulkItems = (selectedItems: any[]) => {
//     const newRows = selectedItems.map((item, index) => {
//       const currentLineId = details.length + index + 1

//       return {
//         Line_Id: currentLineId,
//         Item_ID: item.id,
//         Price: parseFloat(isPurchase ? item.purchasePrice : item.sellingPrice) || 0,
//         Stock_In_UOM: null,
//         Stock_In_UOM_Qty: 0,
//         Stock_SKU_Price: 0,
//         Stock_In_SKU_UOM: null,
//         Stock_In_SKU_UOM_Qty: 0,
//         Stock_In_UOM3_Qty: 0,          // ADD THIS
//         Stock_out_UOM: null,
//         Stock_out_UOM_Qty: 0,
//         Stock_out_SKU_UOM: null,
//         Stock_out_SKU_UOM_Qty: 0,
//         Stock_out_UOM3_Qty: 0,         // ADD THIS
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: '',
//         Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
//         Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
//         Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
//         Goods: '',
//         Remarks: '',
//         grossTotal: 0,
//         netTotal: 0
//       }
//     })

//     setDetails(prevDetails => [...prevDetails, ...newRows])

//     // Auto-expand the newly added rows
//     const newRowIndices = newRows.map((_, index) => details.length + index)
//     setExpandedRows(prev => {
//       const newSet = new Set(prev)
//       newRowIndices.forEach(idx => newSet.add(idx))
//       return newSet
//     })

//     // Close the bulk selector
//     setShowBulkSelector(false)

//     // Show success message
//     setMessage({
//       type: 'success',
//       text: `Successfully added ${selectedItems.length} items to your order`
//     })
//   }











//   // Fetch all data with proper console logging
//   const fetchAllData = useCallback(async () => {
//     try {
//       setDataLoading(true)
//       const baseUrl = `http://${window.location.hostname}:4000/api`

//       console.log(`Fetching data for: ${isPurchase ? "Purchase Order" : "Sales Order"}`)

//       // Fetch Items
//       const itemsRes = await fetch(`${baseUrl}/z-items/items`)
//       const itemsData = await itemsRes.json()
//       if (itemsData.success) {
//         console.log("Items loaded:", itemsData.data?.length || 0)
//         setItems(itemsData.data || [])
//       }

//       // Fetch UOMs
//       const uomsRes = await fetch(`${baseUrl}/z-uom/get`)
//       const uomsData = await uomsRes.json()
//       if (uomsData.data) {
//         console.log("UOMs loaded:", uomsData.data?.length || 0)
//         setUoms(uomsData.data || [])
//       }

//       // Fetch COA accounts - THIS IS THE KEY FIX
//       const coaRes = await fetch(`${baseUrl}/z-coa/get`)
//       const coaData = await coaRes.json()

//       console.log("COA API Response:", coaData)

//       if (coaData && coaData.zCoaRecords) {
//         // Store all COA data for debugging
//         setDebug({
//           allAccounts: coaData.zCoaRecords,
//           success: coaData.success,
//           orderType: orderType
//         })

//         // Properly filter suppliers/customers based on coaTypeId
//         const filtered = coaData.zCoaRecords.filter(coa => {
//           // For purchase orders - get suppliers (coaTypeId: 3,4,5)
//           // if (isPurchase) {
//           //   return [3, 4, 5].includes(Number(coa.coaTypeId))
//           // } 
//           // // For sales orders - get customers (coaTypeId: 1,2)
//           // else {
//           return Number(coa.coaTypeId)
//           // }
//         })

//         console.log(`Filtered ${isPurchase ? 'Suppliers' : 'Customers'}:`, filtered)
//         setAccounts(filtered)
//       } else {
//         console.error("Failed to fetch account data or no accounts available", coaData)
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//       setMessage({ type: 'error', text: 'Failed to load data' })
//     } finally {
//       setDataLoading(false)
//     }
//   }, [isPurchase, orderType])

//   // Load initial data once
//   useEffect(() => {
//     fetchAllData()
//   }, [fetchAllData])

//   // Load order data in edit mode
//   // useEffect(() => {
//   //   if (isEditMode && orderId && accounts.length > 0) {
//   //     const fetchOrderData = async () => {
//   //       try {
//   //         setDataLoading(true)
//   //         const baseUrl = `http://${window.location.hostname}:4000/api`
//   //         const response = await fetch(`${baseUrl}/order/${orderId}`)
//   //         const result = await response.json()

//   //         if (result.success && result.data) {
//   //           const order = result.data

//   //           // Set master data
//   //           setMaster({
//   //             Stock_Type_ID: order.Stock_Type_ID,
//   //             Date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
//   //             COA_ID: order.COA_ID,
//   //             Next_Status: order.Next_Status || 'Incomplete'
//   //           })

//   //           // Set details data
//   //           if (order.details && order.details.length > 0) {
//   //             const orderDetails = order.details.map(detail => ({
//   //               Line_Id: detail.Line_Id,
//   //               Item_ID: detail.Item_ID,
//   //               Price: parseFloat(detail.Price) || 0,
//   //               Stock_In_UOM: detail.Stock_In_UOM,
//   //               Stock_In_UOM_Qty: parseFloat(detail.Stock_In_UOM_Qty) || 0,
//   //               Stock_SKU_Price: parseFloat(detail.Stock_SKU_Price) || 0,
//   //               Stock_In_SKU_UOM: detail.Stock_In_SKU_UOM,
//   //               Stock_In_SKU_UOM_Qty: parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0,
//   //               Stock_out_UOM: detail.Stock_out_UOM,
//   //               Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
//   //               Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
//   //               Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
//   //               uom1_qty: parseFloat(detail.uom1_qty) || 0,
//   //               uom2_qty: parseFloat(detail.uom2_qty) || 0,
//   //               uom3_qty: parseFloat(detail.uom3_qty) || 0,
//   //               sale_unit: detail.sale_unit || '',
//   //               Discount_A: parseFloat(detail.Discount_A) || 0,
//   //               Discount_B: parseFloat(detail.Discount_B) || 0,
//   //               Discount_C: parseFloat(detail.Discount_C) || 0,
//   //               Goods: detail.Goods || '',
//   //               Remarks: detail.Remarks || '',
//   //               grossTotal: 0,
//   //               netTotal: 0
//   //             }))

//   //             // Calculate totals for each detail
//   //             orderDetails.forEach((detail, index) => {
//   //               const price = parseFloat(detail.Price.toString()) || 0
//   //               const qty = isPurchase
//   //                 ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
//   //                 : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

//   //               const discountA = parseFloat(detail.Discount_A.toString()) || 0
//   //               const discountB = parseFloat(detail.Discount_B.toString()) || 0
//   //               const discountC = parseFloat(detail.Discount_C.toString()) || 0

//   //               const grossTotal = price * qty

//   //               // Apply cascading discounts
//   //               let netTotal = grossTotal
//   //               netTotal = netTotal - (netTotal * discountA / 100)
//   //               netTotal = netTotal - (netTotal * discountB / 100)
//   //               netTotal = netTotal - (netTotal * discountC / 100)

//   //               detail.grossTotal = grossTotal
//   //               detail.netTotal = netTotal
//   //             })

//   //             setDetails(orderDetails)
//   //           }
//   //         } else {
//   //           setMessage({ type: 'error', text: 'Order not found' })
//   //         }
//   //       } catch (error) {
//   //         console.error('Error loading order:', error)
//   //         setMessage({ type: 'error', text: 'Failed to load order data' })
//   //       } finally {
//   //         setDataLoading(false)
//   //       }
//   //     }

//   //     fetchOrderData()
//   //   }
//   // }, [isEditMode, orderId, isPurchase, accounts])



//   // Load order data in edit mode - COMPLETE UPDATED VERSION
//   useEffect(() => {
//     if (isEditMode && orderId && accounts.length > 0) {
//       const fetchOrderData = async () => {
//         try {
//           setDataLoading(true)
//           const baseUrl = `http://${window.location.hostname}:4000/api`
//           const response = await fetch(`${baseUrl}/order/${orderId}`)
//           const result = await response.json()

//           if (result.success && result.data) {
//             const order = result.data

//             // Set master data
//             setMaster({
//               Stock_Type_ID: order.Stock_Type_ID,
//               Date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
//               COA_ID: order.COA_ID,
//               Next_Status: order.Next_Status || 'Incomplete'
//             })

//             // Set details data with proper UOM mapping
//             if (order.details && order.details.length > 0) {
//               const orderDetails = order.details.map(detail => ({
//                 Line_Id: detail.Line_Id,
//                 Item_ID: detail.Item_ID,
//                 Price: parseFloat(detail.Price) || 0,
//                 Stock_In_UOM: detail.Stock_In_UOM,
//                 Stock_In_UOM_Qty: parseFloat(detail.Stock_In_UOM_Qty) || 0,
//                 Stock_SKU_Price: parseFloat(detail.Stock_SKU_Price) || 0,
//                 Stock_In_SKU_UOM: detail.Stock_In_SKU_UOM,
//                 Stock_In_SKU_UOM_Qty: parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0,
//                 Stock_In_UOM3_Qty: parseFloat(detail.Stock_In_UOM3_Qty) || 0,    // ADD THIS
//                 Stock_out_UOM: detail.Stock_out_UOM,
//                 Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
//                 Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
//                 Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
//                 Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,  // ADD THIS

//                 // Map stored database values to UOM display values
//                 uom1_qty: parseFloat(detail.uom1_qty) || (isPurchase ? parseFloat(detail.Stock_In_UOM_Qty) || 0 : parseFloat(detail.Stock_out_UOM_Qty) || 0),
//                 uom2_qty: parseFloat(detail.uom2_qty) || (isPurchase ? parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0 : parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0),
//                 uom3_qty: parseFloat(detail.uom3_qty) || (isPurchase ? parseFloat(detail.Stock_In_UOM3_Qty) || 0 : parseFloat(detail.Stock_out_UOM3_Qty) || 0),

//                 sale_unit: detail.sale_unit || '',
//                 Discount_A: parseFloat(detail.Discount_A) || 0,
//                 Discount_B: parseFloat(detail.Discount_B) || 0,
//                 Discount_C: parseFloat(detail.Discount_C) || 0,
//                 Goods: detail.Goods || '',
//                 Remarks: detail.Remarks || '',
//                 grossTotal: 0,
//                 netTotal: 0
//               }))

//               // Calculate totals for each detail
//               orderDetails.forEach((detail, index) => {
//                 const price = parseFloat(detail.Price.toString()) || 0
//                 const qty = isPurchase
//                   ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
//                   : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

//                 const discountA = parseFloat(detail.Discount_A.toString()) || 0
//                 const discountB = parseFloat(detail.Discount_B.toString()) || 0
//                 const discountC = parseFloat(detail.Discount_C.toString()) || 0

//                 const grossTotal = price * qty

//                 // Apply cascading discounts
//                 let netTotal = grossTotal
//                 netTotal = netTotal - (netTotal * discountA / 100)
//                 netTotal = netTotal - (netTotal * discountB / 100)
//                 netTotal = netTotal - (netTotal * discountC / 100)

//                 detail.grossTotal = grossTotal
//                 detail.netTotal = netTotal
//               })

//               setDetails(orderDetails)
//             }
//           } else {
//             setMessage({ type: 'error', text: 'Order not found' })
//           }
//         } catch (error) {
//           console.error('Error loading order:', error)
//           setMessage({ type: 'error', text: 'Failed to load order data' })
//         } finally {
//           setDataLoading(false)
//         }
//       }

//       fetchOrderData()
//     }
//   }, [isEditMode, orderId, isPurchase, accounts])












//   // Update selected account when master COA_ID changes
//   useEffect(() => {
//     if (master.COA_ID) {
//       const account = accounts.find(acc => acc.id === master.COA_ID)
//       console.log('Selected Account Full Data:', account)
//       setSelectedAccount(account || null)

//       // Apply discount values to all detail items when account changes
//       if (account) {
//         const discountA = parseFloat(account.discountA) || 0
//         const discountB = parseFloat(account.discountB) || 0
//         const discountC = parseFloat(account.discountC) || 0

//         console.log('Applying Discounts to All Rows:', { // Debug log
//           discountA,
//           discountB,
//           discountC
//         })


//         // Use functional update to avoid dependency on details
//         setDetails(prevDetails => prevDetails.map(detail => {
//           // Calculate gross total
//           const price = parseFloat(detail.Price.toString()) || 0
//           const qty = isPurchase
//             ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
//             : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

//           const grossTotal = price * qty

//           // Apply cascading discounts
//           let netTotal = grossTotal
//           netTotal = netTotal - (netTotal * discountA / 100)
//           netTotal = netTotal - (netTotal * discountB / 100)
//           netTotal = netTotal - (netTotal * discountC / 100)

//           return {
//             ...detail,
//             Discount_A: discountA,
//             Discount_B: discountB,
//             Discount_C: discountC,
//             grossTotal,
//             netTotal
//           }
//         }))
//       }
//     } else {
//       setSelectedAccount(null)
//     }
//   }, [master.COA_ID, accounts, isPurchase]) // REMOVED details from dependencies








//   // Calculate item totals with discounts
//   const calculateItemTotals = (detailsList, index) => {
//     const detail = detailsList[index]
//     const price = parseFloat(detail.Price.toString()) || 0
//     const qty = isPurchase
//       ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
//       : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

//     const discountA = parseFloat(detail.Discount_A.toString()) || 0
//     const discountB = parseFloat(detail.Discount_B.toString()) || 0
//     const discountC = parseFloat(detail.Discount_C.toString()) || 0

//     const grossTotal = price * qty

//     // Apply cascading discounts
//     let netTotal = grossTotal
//     netTotal = netTotal - (netTotal * discountA / 100)
//     netTotal = netTotal - (netTotal * discountB / 100)
//     netTotal = netTotal - (netTotal * discountC / 100)

//     detailsList[index].grossTotal = grossTotal
//     detailsList[index].netTotal = netTotal
//   }

//   const handleMasterChange = (name, value) => {
//     setMaster(prev => ({ ...prev, [name]: value }))
//   }

//   const handleDetailChange = (index, field, value) => {
//     const updatedDetails = [...details]
//     updatedDetails[index] = {
//       ...updatedDetails[index],
//       [field]: value
//     }

//     // Auto-calculate totals
//     if (['Price', 'Stock_In_UOM_Qty', 'Stock_out_UOM_Qty', 'Discount_A', 'Discount_B', 'Discount_C'].includes(field)) {
//       calculateItemTotals(updatedDetails, index)
//     }

//     setDetails(updatedDetails)
//   }
//   // const handleItemSelect = (index, item) => {
//   //   const updatedDetails = [...details]
//   //   updatedDetails[index] = {
//   //     ...updatedDetails[index],
//   //     Item_ID: item.id,  // This is important - make sure Item_ID is set
//   //     Price: parseFloat(isPurchase ? item.purchasePricePKR : item.sellingPrice) || 0,
//   //     Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
//   //     Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
//   //     Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0
//   //   }

//   //   calculateItemTotals(updatedDetails, index)
//   //   setDetails(updatedDetails)
//   // }


//   const handleItemSelect = (selectedItems: Item[]) => {
//     console.log('Selected items:', selectedItems)
//     // Handle your item selection logic here
//   }




//   // const handleUomChange = (index, values) => {
//   //   const updatedDetails = [...details]
//   //   updatedDetails[index].uom1_qty = values.uom1_qty || 0;
//   //   updatedDetails[index].uom2_qty = values.uom2_qty || 0;
//   //   updatedDetails[index].uom3_qty = values.uom3_qty || 0;
//   //   updatedDetails[index].sale_unit = values.sale_unit || '';
//   //   if (isPurchase) {
//   //     updatedDetails[index].Stock_In_UOM_Qty = values.uom1_qty || 0;
//   //     updatedDetails[index].Stock_In_SKU_UOM_Qty = values.uom2_qty || 0;
//   //   } else {
//   //     updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
//   //     updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
//   //   }
//   //   calculateItemTotals(updatedDetails, index)
//   //   setDetails(updatedDetails)
//   // }


//   // const handleUomChange = (index, values) => {
//   //   const updatedDetails = [...details]

//   //   // Store all UOM quantities
//   //   updatedDetails[index].uom1_qty = values.uom1_qty || 0;
//   //   updatedDetails[index].uom2_qty = values.uom2_qty || 0;
//   //   updatedDetails[index].uom3_qty = values.uom3_qty || 0;
//   //   updatedDetails[index].sale_unit = values.sale_unit || '';

//   //   if (isPurchase) {
//   //     // For purchase orders, store in Stock_In fields
//   //     updatedDetails[index].Stock_In_UOM_Qty = values.uom1_qty || 0;
//   //     updatedDetails[index].Stock_In_SKU_UOM_Qty = values.uom2_qty || 0;
//   //     updatedDetails[index].Stock_In_UOM3_Qty = values.uom3_qty || 0;   // ADD THIS
//   //   } else {
//   //     // For sales orders, store in Stock_out fields
//   //     updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
//   //     updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
//   //     updatedDetails[index].Stock_out_UOM3_Qty = values.uom3_qty || 0;  // ADD THIS
//   //   }

//   //   calculateItemTotals(updatedDetails, index);
//   //   setDetails(updatedDetails);
//   // }












//   const handleUomChange = (index, values) => {
//     const updatedDetails = [...details]

//     // Store all UOM quantities
//     updatedDetails[index].uom1_qty = values.uom1_qty || 0;
//     updatedDetails[index].uom2_qty = values.uom2_qty || 0;
//     updatedDetails[index].uom3_qty = values.uom3_qty || 0;
//     updatedDetails[index].sale_unit = values.sale_unit || '';

//     if (isPurchase) {
//       // For purchase orders, store in Stock_In fields
//       updatedDetails[index].Stock_In_UOM_Qty = values.uom1_qty || 0;
//       updatedDetails[index].Stock_In_SKU_UOM_Qty = values.uom2_qty || 0;
//       updatedDetails[index].Stock_In_UOM3_Qty = values.uom3_qty || 0;   // ADD THIS
//     } else {
//       // For sales orders, store in Stock_out fields
//       updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
//       updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
//       updatedDetails[index].Stock_out_UOM3_Qty = values.uom3_qty || 0;  // ADD THIS
//     }

//     calculateItemTotals(updatedDetails, index);
//     setDetails(updatedDetails);
//   }












//   // const addDetailRow = () => {
//   //   const newRow = {
//   //     Line_Id: details.length + 1,
//   //     Item_ID: null,
//   //     Price: 0,
//   //     Stock_In_UOM: null,
//   //     Stock_In_UOM_Qty: 0,
//   //     Stock_SKU_Price: 0,
//   //     Stock_In_SKU_UOM: null,
//   //     Stock_In_SKU_UOM_Qty: 0,
//   //     Stock_out_UOM: null,
//   //     Stock_out_UOM_Qty: 0,
//   //     Stock_out_SKU_UOM: null,
//   //     Stock_out_SKU_UOM_Qty: 0,
//   //     uom1_qty: 0,
//   //     uom2_qty: 0,
//   //     uom3_qty: 0,
//   //     sale_unit: '',
//   //     Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
//   //     Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
//   //     Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
//   //     Goods: '',
//   //     Remarks: '',
//   //     grossTotal: 0,
//   //     netTotal: 0
//   //   }
//   //   setDetails([...details, newRow])
//   // }





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
//       Stock_In_UOM3_Qty: 0,          // ADD THIS
//       Stock_out_UOM: null,
//       Stock_out_UOM_Qty: 0,
//       Stock_out_SKU_UOM: null,
//       Stock_out_SKU_UOM_Qty: 0,
//       Stock_out_UOM3_Qty: 0,         // ADD THIS
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: '',
//       Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
//       Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
//       Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
//       Goods: '',
//       Remarks: '',
//       grossTotal: 0,
//       netTotal: 0
//     }
//     setDetails([...details, newRow])
//   }





//   const removeDetailRow = (index) => {
//     if (details.length > 1) {
//       const filtered = details.filter((_, i) => i !== index)
//       const updated = filtered.map((item, i) => ({
//         ...item,
//         Line_Id: i + 1
//       }))
//       setDetails(updated)
//     }
//   }

//   const validateForm = () => {
//     if (!master.COA_ID) {
//       setMessage({
//         type: 'error',
//         text: `Please select a ${isPurchase ? 'supplier' : 'customer'}`
//       })
//       return false
//     }

//     for (const detail of details) {
//       if (!detail.Item_ID) {
//         setMessage({ type: 'error', text: 'Please select an item for all rows' })
//         return false
//       }
//       if (isPurchase && detail.Stock_In_UOM_Qty <= 0) {
//         setMessage({ type: 'error', text: 'Purchase quantity must be greater than 0' })
//         return false
//       }
//       if (!isPurchase && detail.Stock_out_UOM_Qty <= 0) {
//         setMessage({ type: 'error', text: 'Sales quantity must be greater than 0' })
//         return false
//       }
//     }

//     return true
//   }

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault()

//   //   if (!validateForm()) return

//   //   setLoading(true)
//   //   setMessage({ type: '', text: '' })

//   //   const baseUrl = `http://${window.location.hostname}:4000/api`

//   //   const orderData = {
//   //     master: {
//   //       ...master,
//   //       COA_ID: Number(master.COA_ID)
//   //     },
//   //     details: details.map(d => ({
//   //       Item_ID: Number(d.Item_ID),
//   //       Price: Number(d.Price),
//   //       Stock_In_UOM: d.Stock_In_UOM ? Number(d.Stock_In_UOM) : null,
//   //       Stock_In_UOM_Qty: Number(d.Stock_In_UOM_Qty),
//   //       Stock_SKU_Price: Number(d.Stock_SKU_Price),
//   //       Stock_In_SKU_UOM: d.Stock_In_SKU_UOM ? Number(d.Stock_In_SKU_UOM) : null,
//   //       Stock_In_SKU_UOM_Qty: Number(d.Stock_In_SKU_UOM_Qty),
//   //       Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
//   //       Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
//   //       Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
//   //       Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
//   //       uom1_qty: d.uom1_qty || 0,
//   //       uom2_qty: d.uom2_qty || 0,
//   //       uom3_qty: d.uom3_qty || 0,
//   //       sale_unit: d.sale_unit || '',
//   //       Discount_A: Number(d.Discount_A) || 0,
//   //       Discount_B: Number(d.Discount_B) || 0,
//   //       Discount_C: Number(d.Discount_C) || 0,
//   //       Goods: d.Goods || '',
//   //       Remarks: d.Remarks || ''
//   //     }))
//   //   }

//   //   try {
//   //     const url = isEditMode ? `${baseUrl}/order/${orderId}` : `${baseUrl}/order`
//   //     const method = isEditMode ? 'PUT' : 'POST'

//   //     const response = await fetch(url, {
//   //       method,
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(orderData)
//   //     })

//   //     const result = await response.json()
//   //     console.log(response.json())
//   //     if (response.ok && result.success) {
//   //       setMessage({
//   //         type: 'success',
//   //         text: `${isPurchase ? 'Purchase' : 'Sales'} order ${isEditMode ? 'updated' : 'created'} successfully!`
//   //       })
//   //       setTimeout(() => {
//   //         router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)
//   //       }, 2000)
//   //     } else {
//   //       setMessage({ type: 'error', text: result.message || `Failed to ${isEditMode ? 'update' : 'create'} order` })
//   //     }
//   //   } catch (error) {
//   //     console.error('Submit error:', error)
//   //     setMessage({ type: 'error', text: `Failed to ${isEditMode ? 'update' : 'submit'} order` })
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }
















//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     setLoading(true)
//     setMessage({ type: '', text: '' })

//     const baseUrl = `http://${window.location.hostname}:4000/api`

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
//         Stock_In_UOM3_Qty: Number(d.Stock_In_UOM3_Qty),                    // ADD THIS
//         Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
//         Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
//         Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
//         Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
//         Stock_out_UOM3_Qty: Number(d.Stock_out_UOM3_Qty),                  // ADD THIS
//         uom1_qty: d.uom1_qty || 0,
//         uom2_qty: d.uom2_qty || 0,
//         uom3_qty: d.uom3_qty || 0,
//         sale_unit: d.sale_unit || '',
//         Discount_A: Number(d.Discount_A) || 0,
//         Discount_B: Number(d.Discount_B) || 0,
//         Discount_C: Number(d.Discount_C) || 0,
//         Goods: d.Goods || '',
//         Remarks: d.Remarks || ''
//       }))
//     }

//     try {
//       const url = isEditMode ? `${baseUrl}/order/${orderId}` : `${baseUrl}/order`
//       const method = isEditMode ? 'PUT' : 'POST'

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData)
//       })

//       const result = await response.json()
//       console.log('Submit result:', result)

//       if (response.ok && result.success) {
//         setMessage({
//           type: 'success',
//           text: `${isPurchase ? 'Purchase' : 'Sales'} order ${isEditMode ? 'updated' : 'created'} successfully!`
//         })
//         setTimeout(() => {
//           router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)
//         }, 2000)
//       } else {
//         setMessage({ type: 'error', text: result.message || `Failed to ${isEditMode ? 'update' : 'create'} order` })
//       }
//     } catch (error) {
//       console.error('Submit error:', error)
//       setMessage({ type: 'error', text: `Failed to ${isEditMode ? 'update' : 'submit'} order` })
//     } finally {
//       setLoading(false)
//     }
//   }



















//   // Calculate grand totals
//   const grandTotals = details.reduce((acc, detail) => ({
//     grossTotal: acc.grossTotal + detail.grossTotal,
//     netTotal: acc.netTotal + detail.netTotal
//   }), { grossTotal: 0, netTotal: 0 })

//   // Prepare table options with additional columns
//   // const itemOptions = items.map(item => ({
//   //   id: item.id,
//   //   label: item.itemName,
//   //   itemName: item.itemName,
//   //   sellingPrice: item.sellingPrice,
//   //   purchasePrice: item.purchasePricePKR
//   // }))




//   const itemOptions = items.map(item => ({
//     id: item.id,
//     label: item.itemName,
//     itemName: item.itemName,
//     sellingPrice: item.sellingPrice,
//     purchasePrice: item.purchasePricePKR,
//     // Make sure these are included for filtering
//     itemClass1: item.itemClass1,
//     itemClass2: item.itemClass2,
//     itemClass3: item.itemClass3,
//     itemClass4: item.itemClass4
//   }))



//   const uomOptions = uoms.map(uom => ({
//     id: uom.id,
//     label: uom.uom,
//     uom: uom.uom
//   }))

//   // This is critical - properly prepare account options for SelectableTable
//   const accountOptions = accounts.map(acc => ({
//     id: acc.id,
//     label: acc.acName,
//     acName: acc.acName,
//     city: acc.city || '',
//     personName: acc.personName || ''
//   }))

//   // Column definitions for tables
//   const itemColumns = [
//     { key: 'itemName', label: 'Item Name', width: '40%' },
//     { key: 'sellingPrice', label: 'Selling Price', width: '30%' },
//     { key: 'purchasePrice', label: 'Purchase Price', width: '30%' }
//   ]

//   const accountColumns = [
//     { key: 'acName', label: 'Account Name', width: '50%' },
//     { key: 'city', label: 'City', width: '25%' },
//     { key: 'personName', label: 'Contact Person', width: '25%' }
//   ]

//   if (dataLoading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
//           <div className="flex justify-center items-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-600">Loading data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//             {/* Enhanced Header */}
//             <div className={`relative ${isPurchase ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'} text-white p-6`}>
//               <div className="absolute inset-0 bg-black opacity-10"></div>
//               <div className="relative flex items-center justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold mb-1">
//                     {isEditMode ? 'Edit' : 'Create'} {isPurchase ? 'Purchase Order' : 'Sales Order'}
//                   </h1>
//                   <p className="text-sm opacity-90">
//                     Fill in the details below to {isEditMode ? 'update' : 'create'} your order
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)}
//                   className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl hover:bg-opacity-30 transition-all duration-200"
//                   title="Go Back"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Message Alert */}
//             {message.text && (
//               <div className={`m-6 p-4 rounded-xl border-2 backdrop-blur-sm ${message.type === 'success'
//                 ? 'bg-green-50 border-green-300 text-green-800'
//                 : 'bg-red-50 border-red-300 text-red-800'
//                 }`}>
//                 <div className="flex items-center">
//                   {message.type === 'success' ? (
//                     <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                       <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//                       </svg>
//                     </div>
//                   ) : (
//                     <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
//                       <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
//                       </svg>
//                     </div>
//                   )}
//                   <div className="flex-1">
//                     <p className="font-medium">{message.text}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="p-6">
//               {/* Order Information Section */}
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner mb-8">
//                 <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Order Information
//                 </h2>
//                 {/* <ClassDropdown
//                   values={formValues}
//                   onChange={handleClassChange}
//                   onClassFilterChange={handleClassFilterChange}
//                 /> */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <span className="flex items-center">
//                         <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
//                         </svg>
//                         Order ID
//                         <span className="ml-2 text-xs text-gray-500 font-normal">(System Generated)</span>
//                       </span>
//                     </label>
//                     <input
//                       className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
//                       value={isEditMode ? orderId : "Auto Generated"}
//                       readOnly
//                       disabled
//                       title="This field is automatically generated"
//                     />
//                   </div>

//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <span className="flex items-center">
//                         <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                         Order Number
//                         <span className="ml-2 text-xs text-gray-500 font-normal">(System Generated)</span>
//                       </span>
//                     </label>
//                     <input
//                       className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
//                       value="Auto Generated"
//                       readOnly
//                       disabled
//                       title="This field is automatically generated"
//                     />
//                   </div>

//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <span className="flex items-center">

//                         Order Date <span className="text-red-500">*</span>
//                         <span className="ml-2 text-xs text-gray-500 font-normal">(Required)</span>
//                       </span>
//                     </label>
//                     <input
//                       type="date"
//                       value={master.Date}
//                       onChange={(e) => handleMasterChange('Date', e.target.value)}
//                       className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       required
//                       title="Select the date for this order"
//                     />
//                   </div>
//                   <div className="group">
//                     <SelectableTable
//                       label={isPurchase ? "Supplier" : "Customer"}
//                       name="COA_ID"
//                       value={master.COA_ID}
//                       onChange={handleMasterChange}
//                       options={accountOptions}
//                       placeholder={`Select ${isPurchase ? 'supplier' : 'customer'}`}
//                       required={true}
//                       displayKey="label"
//                       valueKey="id"
//                       columns={accountColumns}
//                       pageSize={10}
//                     />

//                   </div>
//                 </div>
//               </div>
//               {/* Order Items Section */}
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-1">
//                 {/* Section Header */}
//                 <div className={`px-4 py-2 ${isPurchase ? 'bg-blue-50' : 'bg-green-50'} border-b ${isPurchase ? 'border-blue-200' : 'border-green-200'}`}>
//                   <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                     <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                     Line Items
//                   </h2>
//                 </div>
//                 {/* Detail Items */}
//                 <div className="">
//                   {details.map((detail, index) => (
//                     <div key={index} className="group hover:bg-gray-50 transition-colors duration-200">
//                       {/* Main Row */}
//                       <div className="px-4 py-2">
//                         <div className="grid grid-cols-12 gap-1 items-center">
//                           {/* Line Number */}
//                           <div className="col-span-1">
//                             <label className="text-[11px] text-gray-500 font-semibold mb-1 block">LINE #</label>
//                             <div className={`w-6 h-6 rounded-full ${isPurchase ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center font-bold text-sm`}>
//                               {detail.Line_Id}
//                             </div>
//                           </div>
//                           {/* Item Selection */}
//                           <div className="col-span-3">

//                             {/* Enhanced Item Selection with Integrated Class Filtering */}
//                             <div className="col-span-3">
//                               <label className="text-xs text-gray-500 font-semibold mb-1 block">
//                                 PRODUCT/ITEM *
//                                 <span className="text-xs text-gray-400 ml-1">(select item)</span>
//                               </label>
//                               {/* <EnhancedSelectableTable
//                                 label=""
//                                 name="Item_ID"
//                                 value={detail.Item_ID}
//                                 onChange={(name, value) => {
//                                   handleDetailChange(index, 'Item_ID', value)
//                                   const selectedItem = items.find(i => i.id === value)
//                                   if (selectedItem) {
//                                     const updatedDetails = [...details]
//                                     updatedDetails[index].Price = parseFloat(isPurchase ? selectedItem.purchasePricePKR : selectedItem.sellingPrice) || 0
//                                     setDetails(updatedDetails)
//                                   }
//                                   setExpandedRows(prev => new Set(prev).add(index))
//                                 }}
//                                 options={items.map(item => ({
//                                   id: item.id,
//                                   label: item.itemName,
//                                   itemName: item.itemName,
//                                   sellingPrice: item.sellingPrice,
//                                   purchasePrice: item.purchasePricePKR,
//                                   itemClass1: item.itemClass1,
//                                   itemClass2: item.itemClass2,
//                                   itemClass3: item.itemClass3,
//                                   itemClass4: item.itemClass4
//                                 }))}
//                                 placeholder="select item"
//                                 displayKey="label"
//                                 valueKey="id"
//                                 columns={itemColumns}
//                                 pageSize={6}
//                                 classData={classData}
//                               /> */}







//                               <EnhancedSelectableTable
//                                 label=""
//                                 name="Item_ID"
//                                 value={detail.Item_ID}
//                                 onChange={(name, value) => {
//                                   console.log('Item selected:', { name, value }); // Debug log

//                                   // First, update the Item_ID
//                                   handleDetailChange(index, 'Item_ID', value)

//                                   // Then, find the selected item and update price
//                                   const selectedItem = items.find(i => i.id === value)
//                                   if (selectedItem) {
//                                     console.log('Selected item details:', selectedItem); // Debug log

//                                     // Update the detail with item information
//                                     const updatedDetails = [...details]
//                                     updatedDetails[index] = {
//                                       ...updatedDetails[index],
//                                       Item_ID: value, // Ensure Item_ID is set
//                                       Price: parseFloat(isPurchase ? selectedItem.purchasePricePKR : selectedItem.sellingPrice) || 0,
//                                       // Apply account discounts if available
//                                       Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : updatedDetails[index].Discount_A,
//                                       Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : updatedDetails[index].Discount_B,
//                                       Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : updatedDetails[index].Discount_C
//                                     }

//                                     calculateItemTotals(updatedDetails, index)
//                                     setDetails(updatedDetails)
//                                   }

//                                   // Expand the row to show UOM converter
//                                   setExpandedRows(prev => new Set(prev).add(index))
//                                 }}
//                                 options={items.map(item => ({
//                                   id: item.id,
//                                   label: item.itemName,
//                                   itemName: item.itemName,
//                                   sellingPrice: item.sellingPrice,
//                                   purchasePrice: item.purchasePricePKR,
//                                   itemClass1: item.itemClass1,
//                                   itemClass2: item.itemClass2,
//                                   itemClass3: item.itemClass3,
//                                   itemClass4: item.itemClass4
//                                 }))}
//                                 placeholder="select item"
//                                 displayKey="label"
//                                 valueKey="id"
//                                 columns={itemColumns}
//                                 pageSize={6}
//                                 classData={classData}
//                               />









//                             </div>









//                           </div>
//                           {/* Unit Price (moved to first row) */}
//                           <div className="col-span-2">
//                             <label className=" text-gray-500 font-semibold mb-1 text-[11px] block">UNIT PRICE</label>
//                             <div className="relative">
//                               {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span> */}
//                               <input
//                                 type="number"
//                                 step="0.01"
//                                 value={detail.Price}
//                                 onKeyDown={(e) => {
//                                   if (e.key === 'Enter') {
//                                     setExpandedRows(prev => new Set(prev).add(index))
//                                   }
//                                 }}
//                                 onChange={(e) => handleDetailChange(index, 'Price', e.target.value)}
//                                 className="w-full px-2 py-0.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                 placeholder="0.00"
//                                 title="Enter the unit price for this item"
//                               />
//                             </div>
//                           </div>

//                           {/* Sales Quantities (moved UOMConverter to first row) */}
//                           <div className="col-span-4">
//                             {/* <label className="text-xs font-semibold text-gray-600 block uppercase tracking-wider flex items-center">
//                                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                                 </svg>
//                                 {isPurchase ? 'Purchase Quantities' : 'Sales Quantities'}
//                               </label> */}
//                             <div className="">

//                               {/* <UomConverter
//                                 itemId={detail.Item_ID}
//                                 onChange={(values) => handleUomChange(index, values)}
//                                 initialValues={{
//                                   uom1_qty: detail.uom1_qty?.toString() || '',
//                                   uom2_qty: detail.uom2_qty?.toString() || '',
//                                   uom3_qty: detail.uom3_qty?.toString() || '',
//                                   sale_unit: detail.sale_unit || ''
//                                 }}
//                                 isPurchase={isPurchase}
//                               /> */}




//                               <UomConverter
//                                 itemId={detail.Item_ID}
//                                 onChange={(values) => handleUomChange(index, values)}
//                                 initialValues={{
//                                   // Use the display values from uom fields, fallback to database fields
//                                   uom1_qty: detail.uom1_qty?.toString() || (isPurchase ? detail.Stock_In_UOM_Qty : detail.Stock_out_UOM_Qty)?.toString() || '',
//                                   uom2_qty: detail.uom2_qty?.toString() || (isPurchase ? detail.Stock_In_SKU_UOM_Qty : detail.Stock_out_SKU_UOM_Qty)?.toString() || '',
//                                   uom3_qty: detail.uom3_qty?.toString() || (isPurchase ? detail.Stock_In_UOM3_Qty : detail.Stock_out_UOM3_Qty)?.toString() || '',
//                                   sale_unit: detail.sale_unit || ''
//                                 }}
//                                 isPurchase={isPurchase}
//                               />






//                             </div>
//                           </div>

//                           {/* Delete Action */}
//                           <div className="col-span-1 text-center">
//                             <label className="text-xs text-gray-500 font-semibold mb-1 block">ACTION</label>
//                             <button
//                               type="button"
//                               onClick={() => removeDetailRow(index)}
//                               disabled={details.length === 1}
//                               className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:text-gray-300 disabled:hover:bg-transparent transition-all duration-200"
//                               title={details.length === 1 ? "Cannot delete the last row" : "Delete this row"}
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                             </button>
//                           </div>
//                           <div className="flex items-center justify-end mb-2">
//                             <button
//                               type="button"
//                               onClick={() => toggleRowExpanded(index)}
//                               className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800"
//                               aria-label={expandedRows.has(index) ? 'Collapse' : 'Expand'}
//                               title={expandedRows.has(index) ? 'Collapse' : 'Expand'}
//                             >
//                               {expandedRows.has(index) ? (
//                                 <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                                   <path fillRule="evenodd" d="M5.23 12.79a1 1 0 001.41 0L10 9.41l3.36 3.38a1 1 0 001.42-1.42l-4.07-4.1a1 1 0 00-1.42 0l-4.06 4.1a1 1 0 000 1.42z" clipRule="evenodd" />
//                                 </svg>
//                               ) : (
//                                 <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                                   <path fillRule="evenodd" d="M14.77 7.21a1 1 0 00-1.41 0L10 10.59 6.64 7.21A1 1 0 105.22 8.63l4.07 4.1a1 1 0 001.42 0l4.06-4.1a1 1 0 000-1.42z" clipRule="evenodd" />
//                                 </svg>
//                               )}
//                             </button>
//                           </div>

//                         </div>
//                       </div>

//                       {/* Secondary Row - Discounts, Notes, Totals (collapsible) */}
//                       < div className="px-4" >
//                         {
//                           expandedRows.has(index) && (
//                             <div className="grid grid-cols-12 gap-4 py-2">
//                               <div className="col-span-1"></div>
//                               {/* Discounts */}
//                               <div className="col-span-5">
//                                 <div className="">
//                                   <div className="flex gap-3">
//                                     <div className="flex-1">
//                                       <label className="text-xs text-gray-500 mb-1 block font-medium">TIER A (%)</label>
//                                       <div className="relative">
//                                         <input
//                                           type="number"
//                                           step="0.01"
//                                           value={detail.Discount_A}
//                                           onChange={(e) => handleDetailChange(index, 'Discount_A', e.target.value)}
//                                           className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                           placeholder="0"
//                                           title="First discount tier percentage"
//                                         />
//                                         <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
//                                       </div>
//                                     </div>
//                                     <div className="flex-1">
//                                       <label className="text-xs text-gray-500 mb-1 block font-medium">TIER B (%)</label>
//                                       <div className="relative">
//                                         <input
//                                           type="number"
//                                           step="0.01"
//                                           value={detail.Discount_B}
//                                           onChange={(e) => handleDetailChange(index, 'Discount_B', e.target.value)}
//                                           className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                           placeholder="0"
//                                           title="Second discount tier percentage"
//                                         />
//                                         <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
//                                       </div>
//                                     </div>
//                                     <div className="flex-1">
//                                       <label className="text-xs text-gray-500 mb-1 block font-medium">TIER C (%)</label>
//                                       <div className="relative">
//                                         <input
//                                           type="number"
//                                           step="0.01"
//                                           value={detail.Discount_C}
//                                           onChange={(e) => handleDetailChange(index, 'Discount_C', e.target.value)}
//                                           className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                           placeholder="0"
//                                           title="Third discount tier percentage"
//                                         />
//                                         <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               {/* Notes */}
//                               <div className="col-span-3">
//                                 <label className="text-xs text-gray-500 font-semibold mb-1 block">NOTES</label>
//                                 <input
//                                   type="text"
//                                   value={detail.Remarks}
//                                   onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
//                                   className="w-full px-1 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                   placeholder="Notes"
//                                   title="Add any notes for this line item"
//                                 />
//                               </div>

//                               {/* Totals */}
//                               <div className="col-span-3 grid grid-cols-2 gap-4">
//                                 <div>
//                                   <label className="text-xs text-gray-500 font-semibold mb-1 block">GROSS TOTAL</label>
//                                   <div className="bg-gray-100 px-2 py-1 rounded-lg  text-right font-semibold text-gray-700">
//                                     {detail.grossTotal.toFixed(2)}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <label className="text-xs text-gray-500 font-semibold mb-1 block">NET TOTAL</label>
//                                   <div className={`${isPurchase ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-lg  text-right font-bold`}>
//                                     {detail.netTotal.toFixed(2)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )
//                         }
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Grand Total Footer */}
//                 <div className={`p-3  ${isPurchase ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-gradient-to-r from-green-100 to-green-200'}`}>
//                   <div className="flex items-center justify-between">
//                     <div className="text-lg font-bold text-gray-800">
//                       Order Summary
//                     </div>
//                     <div className="flex items-center gap-6">
//                       <div className="text-sm text-gray-600">
//                         <span className="font-medium">Gross Total:</span>
//                         <span className="ml-2 font-bold text-gray-800">₹ {grandTotals.grossTotal.toFixed(2)}</span>
//                       </div>
//                       <div className={`px-6 py-3 ${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white rounded-xl font-bold text-lg shadow-lg`}>
//                         <span className="text-xs font-normal block">Net Total</span>
//                         {grandTotals.netTotal.toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Action Buttons */}
//               <div className="flex justify-between items-center">
//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={addDetailRow}
//                     className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 flex items-center shadow-lg transform hover:scale-105 transition-all duration-200"
//                     title="Add a single line item to the order"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     Add Single Item
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setShowBulkSelector(true)}
//                     className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center shadow-lg transform hover:scale-105 transition-all duration-200"
//                     title="Select multiple items at once to add to the order"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//                     </svg>
//                     Bulk Add Items
//                   </button>
//                 </div>

//                 <div className="flex gap-4">
//                   <button
//                     type="button"
//                     onClick={() => router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)}
//                     className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow-md transform hover:scale-105 transition-all duration-200"
//                     title="Cancel and go back"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`px-8 py-3 text-white rounded-xl disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all duration-200 ${isPurchase
//                       ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
//                       : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
//                       }`}
//                     title={loading ? "Processing..." : `${isEditMode ? 'Update' : 'Create'} this order`}
//                   >
//                     {loading ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </span>
//                     ) : (
//                       <span className="flex items-center">
//                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         {isEditMode ? 'Update' : 'Create'} Order
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Bulk Item Selector Modal */}
//               {showBulkSelector && (
//                 <MultiSelectItemTable
//                   options={items.map(item => ({
//                     id: item.id,
//                     label: item.itemName,
//                     itemName: item.itemName,
//                     sellingPrice: item.sellingPrice,
//                     purchasePrice: item.purchasePricePKR,
//                     itemClass1: item.itemClass1,
//                     itemClass2: item.itemClass2,
//                     itemClass3: item.itemClass3,
//                     itemClass4: item.itemClass4
//                   }))}
//                   columns={itemColumns}
//                   onSelectionComplete={addBulkItems}
//                   onCancel={() => setShowBulkSelector(false)}
//                   isPurchase={isPurchase}
//                 />
//               )}

//             </form>
//           </div>
//         </div >
//       </div >
//     </div >
//   )
// }

// export default UnifiedOrderForm








































































































'use client'

import React, { useState, useEffect, useCallback } from 'react';
import SelectableTable from './SelectableTable';
import ClassDropdown from './ClassDropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import UomConverter from './UomConverter';
import { useItemFilter } from './useItemFilter';
import EnhancedSelectableTable from './EnhancedSelectableTable';
import MultiSelectItemTable from './MultiSelectItemTable';

interface Detail {
  Line_Id: number;
  Item_ID: number | null;
  Price: number;
  Stock_In_UOM: number | null;
  Stock_In_UOM_Qty: number;
  Stock_SKU_Price: number;
  Stock_In_SKU_UOM: number | null;
  Stock_In_SKU_UOM_Qty: number;
  Stock_In_UOM3_Qty: number;        // ADDED
  Stock_out_UOM: number | null;
  Stock_out_UOM_Qty: number;
  Stock_out_SKU_UOM: number | null;
  Stock_out_SKU_UOM_Qty: number;
  Stock_out_UOM3_Qty: number;       // ADDED
  uom1_qty?: number;
  uom2_qty?: number;
  uom3_qty?: number;
  sale_unit?: string;
  Discount_A: number;
  Discount_B: number;
  Discount_C: number;
  Goods: string;
  Remarks: string;
  grossTotal: number;
  netTotal: number;
}

interface Item {
  id: number;
  itemName: string;
  itemClass1?: number | null;
  itemClass2?: number | null;
  itemClass3?: number | null;
  itemClass4?: number | null;
  [key: string]: any;
}

interface ClassFilters {
  itemClass1: number | null;
  itemClass2: number | null;
  itemClass3: number | null;
  itemClass4: number | null;
}

const UnifiedOrderForm = ({ orderType }) => {
  const [formValues, setFormValues] = useState<ClassFilters>({
    itemClass1: null,
    itemClass2: null,
    itemClass3: null,
    itemClass4: null,
  })

  // Add this state for class data
  const [classData, setClassData] = useState({
    class1: [],
    class2: [],
    class3: [],
    class4: []
  })

  // Add this useEffect to fetch class data
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const promises = [1, 2, 3, 4].map(id =>
          fetch(`http://${window.location.hostname}:4000/api/z-classes/get-by-class-id/${id}`)
            .then(res => res.json())
        )
        const results = await Promise.all(promises)

        setClassData({
          class1: results[0]?.getByclassID || [],
          class2: results[1]?.getByclassID || [],
          class3: results[2]?.getByclassID || [],
          class4: results[3]?.getByclassID || []
        })
      } catch (error) {
        console.error('Error fetching class data:', error)
      }
    }

    fetchClassData()
  }, [])

  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const isEditMode = Boolean(orderId)
  const isPurchase = orderType === 'purchase'

  const [master, setMaster] = useState({
    Stock_Type_ID: isPurchase ? 1 : 2,
    Date: new Date().toISOString().split('T')[0],
    COA_ID: null,
    Next_Status: 'Incomplete'
  })

  // FIXED: Updated initial detail state with UOM3 fields
  const [details, setDetails] = useState<Detail[]>([{
    Line_Id: 1,
    Item_ID: null,
    Price: 0,
    Stock_In_UOM: null,
    Stock_In_UOM_Qty: 0,
    Stock_SKU_Price: 0,
    Stock_In_SKU_UOM: null,
    Stock_In_SKU_UOM_Qty: 0,
    Stock_In_UOM3_Qty: 0,            // ADDED
    Stock_out_UOM: null,
    Stock_out_UOM_Qty: 0,
    Stock_out_SKU_UOM: null,
    Stock_out_SKU_UOM_Qty: 0,
    Stock_out_UOM3_Qty: 0,           // ADDED
    uom1_qty: 0,
    uom2_qty: 0,
    uom3_qty: 0,
    sale_unit: '',
    Discount_A: 0,
    Discount_B: 0,
    Discount_C: 0,
    Goods: '',
    Remarks: '',
    grossTotal: 0,
    netTotal: 0
  }])

  const [expandedRows, setExpandedRows] = useState(new Set<number>())

  const toggleRowExpanded = (rowIndex: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowIndex)) {
        next.delete(rowIndex)
      } else {
        next.add(rowIndex)
      }
      return next
    })
  }

  const [items, setItems] = useState([])
  const [allItems, setAllItems] = useState<Item[]>([])
  const {
    filteredItems,
    activeFilterCount,
    activeFilters,
    totalItems,
    filteredCount
  } = useItemFilter({
    items: items,
    classFilters: formValues
  })

  useEffect(() => {
    console.log('Items data for filtering:', {
      totalItems: items?.length,
      sampleItem: items?.[0],
      classFilters: formValues
    })
  }, [items, formValues])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://${window.location.hostname}:4000/api/items`)
        const data = await response.json()

        // Adjust this based on your API response structure
        const items = data.items || data || []
        setAllItems(items)
      } catch (error) {
        console.error('Error fetching items:', error)
        setAllItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleClassChange = (name: string, value: number | null) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClassFilterChange = (filters: ClassFilters) => {
    console.log('Applied filters:', filters)
  }

  const resetFilters = () => {
    setFormValues({
      itemClass1: null,
      itemClass2: null,
      itemClass3: null,
      itemClass4: null,
    })
  }

  const [showBulkSelector, setShowBulkSelector] = useState(false)
  const [uoms, setUoms] = useState([])
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [debug, setDebug] = useState({})

  // FIXED: Updated addBulkItems with UOM3 fields
  const addBulkItems = (selectedItems: any[]) => {
    const newRows = selectedItems.map((item, index) => {
      const currentLineId = details.length + index + 1

      return {
        Line_Id: currentLineId,
        Item_ID: item.id,
        Price: parseFloat(isPurchase ? item.purchasePrice : item.sellingPrice) || 0,
        Stock_In_UOM: null,
        Stock_In_UOM_Qty: 0,
        Stock_SKU_Price: 0,
        Stock_In_SKU_UOM: null,
        Stock_In_SKU_UOM_Qty: 0,
        Stock_In_UOM3_Qty: 0,          // ADDED
        Stock_out_UOM: null,
        Stock_out_UOM_Qty: 0,
        Stock_out_SKU_UOM: null,
        Stock_out_SKU_UOM_Qty: 0,
        Stock_out_UOM3_Qty: 0,         // ADDED
        uom1_qty: 0,
        uom2_qty: 0,
        uom3_qty: 0,
        sale_unit: '',
        Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
        Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
        Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
        Goods: '',
        Remarks: '',
        grossTotal: 0,
        netTotal: 0
      }
    })

    setDetails(prevDetails => [...prevDetails, ...newRows])

    // Auto-expand the newly added rows
    const newRowIndices = newRows.map((_, index) => details.length + index)
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      newRowIndices.forEach(idx => newSet.add(idx))
      return newSet
    })

    // Close the bulk selector
    setShowBulkSelector(false)

    // Show success message
    setMessage({
      type: 'success',
      text: `Successfully added ${selectedItems.length} items to your order`
    })
  }

  // Fetch all data with proper console logging
  const fetchAllData = useCallback(async () => {
    try {
      setDataLoading(true)
      const baseUrl = `http://${window.location.hostname}:4000/api`

      console.log(`Fetching data for: ${isPurchase ? "Purchase Order" : "Sales Order"}`)

      // Fetch Items
      const itemsRes = await fetch(`${baseUrl}/z-items/items`)
      const itemsData = await itemsRes.json()
      if (itemsData.success) {
        console.log("Items loaded:", itemsData.data?.length || 0)
        setItems(itemsData.data || [])
      }

      // Fetch UOMs
      const uomsRes = await fetch(`${baseUrl}/z-uom/get`)
      const uomsData = await uomsRes.json()
      if (uomsData.data) {
        console.log("UOMs loaded:", uomsData.data?.length || 0)
        setUoms(uomsData.data || [])
      }

      // Fetch COA accounts - THIS IS THE KEY FIX
      const coaRes = await fetch(`${baseUrl}/z-coa/get`)
      const coaData = await coaRes.json()

      console.log("COA API Response:", coaData)

      if (coaData && coaData.zCoaRecords) {
        // Store all COA data for debugging
        setDebug({
          allAccounts: coaData.zCoaRecords,
          success: coaData.success,
          orderType: orderType
        })

        // Properly filter suppliers/customers based on coaTypeId
        const filtered = coaData.zCoaRecords.filter(coa => {
          return Number(coa.coaTypeId)
        })

        console.log(`Filtered ${isPurchase ? 'Suppliers' : 'Customers'}:`, filtered)
        setAccounts(filtered)
      } else {
        console.error("Failed to fetch account data or no accounts available", coaData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage({ type: 'error', text: 'Failed to load data' })
    } finally {
      setDataLoading(false)
    }
  }, [isPurchase, orderType])

  // Load initial data once
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // FIXED: Load order data in edit mode with UOM3 fields
  useEffect(() => {
    if (isEditMode && orderId && accounts.length > 0) {
      const fetchOrderData = async () => {
        try {
          setDataLoading(true)
          const baseUrl = `http://${window.location.hostname}:4000/api`
          const response = await fetch(`${baseUrl}/order/${orderId}`)
          const result = await response.json()

          console.log('Fetched order data:', result); // Debug log

          if (result.success && result.data) {
            const order = result.data

            // Set master data
            setMaster({
              Stock_Type_ID: order.Stock_Type_ID,
              Date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
              COA_ID: order.COA_ID,
              Next_Status: order.Next_Status || 'Incomplete'
            })

            // FIXED: Set details data with UOM3 fields
            if (order.details && order.details.length > 0) {
              const orderDetails = order.details.map(detail => ({
                Line_Id: detail.Line_Id,
                Item_ID: detail.Item_ID,
                Price: parseFloat(detail.Price) || 0,
                Stock_In_UOM: detail.Stock_In_UOM,
                Stock_In_UOM_Qty: parseFloat(detail.Stock_In_UOM_Qty) || 0,
                Stock_SKU_Price: parseFloat(detail.Stock_SKU_Price) || 0,
                Stock_In_SKU_UOM: detail.Stock_In_SKU_UOM,
                Stock_In_SKU_UOM_Qty: parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0,
                Stock_In_UOM3_Qty: parseFloat(detail.Stock_In_UOM3_Qty) || 0,    // ADDED
                Stock_out_UOM: detail.Stock_out_UOM,
                Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
                Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
                Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
                Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,  // ADDED
                uom1_qty: parseFloat(detail.uom1_qty) || 0,
                uom2_qty: parseFloat(detail.uom2_qty) || 0,
                uom3_qty: parseFloat(detail.uom3_qty) || 0,
                sale_unit: detail.sale_unit || '',
                Discount_A: parseFloat(detail.Discount_A) || 0,
                Discount_B: parseFloat(detail.Discount_B) || 0,
                Discount_C: parseFloat(detail.Discount_C) || 0,
                Goods: detail.Goods || '',
                Remarks: detail.Remarks || '',
                grossTotal: 0,
                netTotal: 0
              }))

              // Calculate totals for each detail
              orderDetails.forEach((detail, index) => {
                const price = parseFloat(detail.Price.toString()) || 0
                const qty = isPurchase
                  ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
                  : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

                const discountA = parseFloat(detail.Discount_A.toString()) || 0
                const discountB = parseFloat(detail.Discount_B.toString()) || 0
                const discountC = parseFloat(detail.Discount_C.toString()) || 0

                const grossTotal = price * qty

                // Apply cascading discounts
                let netTotal = grossTotal
                netTotal = netTotal - (netTotal * discountA / 100)
                netTotal = netTotal - (netTotal * discountB / 100)
                netTotal = netTotal - (netTotal * discountC / 100)

                detail.grossTotal = grossTotal
                detail.netTotal = netTotal
              })

              setDetails(orderDetails)
            }
          } else {
            setMessage({ type: 'error', text: 'Order not found' })
          }
        } catch (error) {
          console.error('Error loading order:', error)
          setMessage({ type: 'error', text: 'Failed to load order data' })
        } finally {
          setDataLoading(false)
        }
      }

      fetchOrderData()
    }
  }, [isEditMode, orderId, isPurchase, accounts])

  // Update selected account when master COA_ID changes
  useEffect(() => {
    if (master.COA_ID) {
      const account = accounts.find(acc => acc.id === master.COA_ID)
      console.log('Selected Account Full Data:', account)
      setSelectedAccount(account || null)

      // Apply discount values to all detail items when account changes
      if (account) {
        const discountA = parseFloat(account.discountA) || 0
        const discountB = parseFloat(account.discountB) || 0
        const discountC = parseFloat(account.discountC) || 0

        console.log('Applying Discounts to All Rows:', {
          discountA,
          discountB,
          discountC
        })

        // Use functional update to avoid dependency on details
        setDetails(prevDetails => prevDetails.map(detail => {
          // Calculate gross total
          const price = parseFloat(detail.Price.toString()) || 0
          const qty = isPurchase
            ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
            : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

          const grossTotal = price * qty

          // Apply cascading discounts
          let netTotal = grossTotal
          netTotal = netTotal - (netTotal * discountA / 100)
          netTotal = netTotal - (netTotal * discountB / 100)
          netTotal = netTotal - (netTotal * discountC / 100)

          return {
            ...detail,
            Discount_A: discountA,
            Discount_B: discountB,
            Discount_C: discountC,
            grossTotal,
            netTotal
          }
        }))
      }
    } else {
      setSelectedAccount(null)
    }
  }, [master.COA_ID, accounts, isPurchase])

  // Calculate item totals with discounts
  const calculateItemTotals = (detailsList, index) => {
    const detail = detailsList[index]
    const price = parseFloat(detail.Price.toString()) || 0
    const qty = isPurchase
      ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
      : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

    const discountA = parseFloat(detail.Discount_A.toString()) || 0
    const discountB = parseFloat(detail.Discount_B.toString()) || 0
    const discountC = parseFloat(detail.Discount_C.toString()) || 0

    const grossTotal = price * qty

    // Apply cascading discounts
    let netTotal = grossTotal
    netTotal = netTotal - (netTotal * discountA / 100)
    netTotal = netTotal - (netTotal * discountB / 100)
    netTotal = netTotal - (netTotal * discountC / 100)

    detailsList[index].grossTotal = grossTotal
    detailsList[index].netTotal = netTotal
  }

  const handleMasterChange = (name, value) => {
    setMaster(prev => ({ ...prev, [name]: value }))
  }

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...details]
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value
    }

    // Auto-calculate totals
    if (['Price', 'Stock_In_UOM_Qty', 'Stock_out_UOM_Qty', 'Discount_A', 'Discount_B', 'Discount_C'].includes(field)) {
      calculateItemTotals(updatedDetails, index)
    }

    setDetails(updatedDetails)
  }

  const handleItemSelect = (selectedItems: Item[]) => {
    console.log('Selected items:', selectedItems)
    // Handle your item selection logic here
  }

  // FIXED: Updated handleUomChange with UOM3 support
  const handleUomChange = (index, values) => {
    console.log('UOM change:', { index, values }); // Debug log
    
    const updatedDetails = [...details]
    
    // Store all UOM quantities
    updatedDetails[index].uom1_qty = values.uom1_qty || 0;
    updatedDetails[index].uom2_qty = values.uom2_qty || 0;
    updatedDetails[index].uom3_qty = values.uom3_qty || 0;
    updatedDetails[index].sale_unit = values.sale_unit || '';

    if (isPurchase) {
      // For purchase orders, store in Stock_In fields
      updatedDetails[index].Stock_In_UOM_Qty = values.uom1_qty || 0;
      updatedDetails[index].Stock_In_SKU_UOM_Qty = values.uom2_qty || 0;
      updatedDetails[index].Stock_In_UOM3_Qty = values.uom3_qty || 0;   // ADDED
    } else {
      // For sales orders, store in Stock_out fields
      updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
      updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
      updatedDetails[index].Stock_out_UOM3_Qty = values.uom3_qty || 0;  // ADDED
    }
    
    calculateItemTotals(updatedDetails, index);
    setDetails(updatedDetails);
  }

  // FIXED: Updated addDetailRow with UOM3 fields and proper Line_Id
  const addDetailRow = () => {
    const newRow = {
      Line_Id: details.length + 1, // This will ensure sequential numbering
      Item_ID: null,
      Price: 0,
      Stock_In_UOM: null,
      Stock_In_UOM_Qty: 0,
      Stock_SKU_Price: 0,
      Stock_In_SKU_UOM: null,
      Stock_In_SKU_UOM_Qty: 0,
      Stock_In_UOM3_Qty: 0,          // ADDED
      Stock_out_UOM: null,
      Stock_out_UOM_Qty: 0,
      Stock_out_SKU_UOM: null,
      Stock_out_SKU_UOM_Qty: 0,
      Stock_out_UOM3_Qty: 0,         // ADDED
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: '',
      Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
      Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
      Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
      Goods: '',
      Remarks: '',
      grossTotal: 0,
      netTotal: 0
    }
    setDetails([...details, newRow])
  }

  // FIXED: Updated removeDetailRow with proper Line_Id renumbering
  const removeDetailRow = (index) => {
    if (details.length > 1) {
      const filtered = details.filter((_, i) => i !== index)
      // Renumber Line_Id to be sequential
      const updated = filtered.map((item, i) => ({
        ...item,
        Line_Id: i + 1
      }))
      setDetails(updated)
      
      // Update expanded rows to match new indices
      const newExpandedRows = new Set<number>()
      expandedRows.forEach(expandedIndex => {
        if (expandedIndex < index) {
          newExpandedRows.add(expandedIndex)
        } else if (expandedIndex > index) {
          newExpandedRows.add(expandedIndex - 1)
        }
      })
      setExpandedRows(newExpandedRows)
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

  // FIXED: Updated handleSubmit with UOM3 fields
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    const baseUrl = `http://${window.location.hostname}:4000/api`

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
        Stock_In_UOM3_Qty: Number(d.Stock_In_UOM3_Qty),                    // ADDED
        Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
        Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
        Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
        Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
        Stock_out_UOM3_Qty: Number(d.Stock_out_UOM3_Qty),                  // ADDED
        uom1_qty: d.uom1_qty || 0,
        uom2_qty: d.uom2_qty || 0,
        uom3_qty: d.uom3_qty || 0,
        sale_unit: d.sale_unit || '',
        Discount_A: Number(d.Discount_A) || 0,
        Discount_B: Number(d.Discount_B) || 0,
        Discount_C: Number(d.Discount_C) || 0,
        Goods: d.Goods || '',
        Remarks: d.Remarks || ''
      }))
    }

    try {
      const url = isEditMode ? `${baseUrl}/order/${orderId}` : `${baseUrl}/order`
      const method = isEditMode ? 'PUT' : 'POST'

      console.log('Submitting order data:', orderData); // Debug log

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      console.log('Submit response:', result); // Debug log
      
      if (response.ok && result.success) {
        setMessage({
          type: 'success',
          text: `${isPurchase ? 'Purchase' : 'Sales'} order ${isEditMode ? 'updated' : 'created'} successfully!`
        })
        setTimeout(() => {
          router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)
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

  const itemOptions = items.map(item => ({
    id: item.id,
    label: item.itemName,
    itemName: item.itemName,
    sellingPrice: item.sellingPrice,
    purchasePrice: item.purchasePricePKR,
    // Make sure these are included for filtering
    itemClass1: item.itemClass1,
    itemClass2: item.itemClass2,
    itemClass3: item.itemClass3,
    itemClass4: item.itemClass4
  }))

  const uomOptions = uoms.map(uom => ({
    id: uom.id,
    label: uom.uom,
    uom: uom.uom
  }))

  // This is critical - properly prepare account options for SelectableTable
  const accountOptions = accounts.map(acc => ({
    id: acc.id,
    label: acc.acName,
    acName: acc.acName,
    city: acc.city || '',
    personName: acc.personName || ''
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Enhanced Header */}
            <div className={`relative ${isPurchase ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'} text-white p-6`}>
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    {isEditMode ? 'Edit' : 'Create'} {isPurchase ? 'Purchase Order' : 'Sales Order'}
                  </h1>
                  <p className="text-sm opacity-90">
                    Fill in the details below to {isEditMode ? 'update' : 'create'} your order
                  </p>
                  {isEditMode && (
                    <p className="text-sm opacity-75 mt-1">
                      Order ID: {orderId}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl hover:bg-opacity-30 transition-all duration-200"
                  title="Go Back"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div className={`m-6 p-4 rounded-xl border-2 backdrop-blur-sm ${message.type === 'success'
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{message.text}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6">
              {/* Order Information Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Order ID
                        <span className="ml-2 text-xs text-gray-500 font-normal">(System Generated)</span>
                      </span>
                    </label>
                    <input
                      className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
                      value={isEditMode ? orderId : "Auto Generated"}
                      readOnly
                      disabled
                      title="This field is automatically generated"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Order Number
                        <span className="ml-2 text-xs text-gray-500 font-normal">(System Generated)</span>
                      </span>
                    </label>
                    <input
                      className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
                      value="Auto Generated"
                      readOnly
                      disabled
                      title="This field is automatically generated"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        Order Date <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs text-gray-500 font-normal">(Required)</span>
                      </span>
                    </label>
                    <input
                      type="date"
                      value={master.Date}
                      onChange={(e) => handleMasterChange('Date', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                      title="Select the date for this order"
                    />
                  </div>
                  <div className="group">
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
                </div>
              </div>

              {/* Order Items Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-1">
                {/* Section Header */}
                <div className={`px-4 py-2 ${isPurchase ? 'bg-blue-50' : 'bg-green-50'} border-b ${isPurchase ? 'border-blue-200' : 'border-green-200'}`}>
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Line Items
                  </h2>
                </div>

                {/* Detail Items */}
                <div className="">
                  {details.map((detail, index) => (
                    <div key={index} className="group hover:bg-gray-50 transition-colors duration-200">
                      {/* Main Row */}
                      <div className="px-4 py-2">
                        <div className="grid grid-cols-12 gap-1 items-center">
                          {/* Line Number - FIXED: Shows correct sequential number */}
                          <div className="col-span-1">
                            <label className="text-[11px] text-gray-500 font-semibold mb-1 block">LINE #</label>
                            <div className={`w-6 h-6 rounded-full ${isPurchase ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center font-bold text-sm`}>
                              {detail.Line_Id}
                            </div>
                          </div>

                          {/* Item Selection - FIXED: Now properly sets Item_ID */}
                          <div className="col-span-3">
                            <label className="text-xs text-gray-500 font-semibold mb-1 block">
                              PRODUCT/ITEM *
                              <span className="text-xs text-gray-400 ml-1">(select item)</span>
                            </label>
                            <EnhancedSelectableTable
                              label=""
                              name="Item_ID"
                              value={detail.Item_ID}
                              onChange={(name, value) => {
                                console.log('Item selected:', { name, value, index }); // Debug log
                                
                                // First update Item_ID
                                handleDetailChange(index, 'Item_ID', value)
                                
                                // Then find selected item and update price
                                const selectedItem = items.find(i => i.id === value)
                                if (selectedItem) {
                                  console.log('Selected item details:', selectedItem); // Debug log
                                  
                                  // Update price and expand row
                                  const updatedDetails = [...details]
                                  updatedDetails[index].Item_ID = value // Ensure Item_ID is set
                                  updatedDetails[index].Price = parseFloat(isPurchase ? selectedItem.purchasePricePKR : selectedItem.sellingPrice) || 0
                                  setDetails(updatedDetails)
                                  
                                  // Auto-expand to show UOM converter
                                  setExpandedRows(prev => new Set(prev).add(index))
                                }
                              }}
                              options={items.map(item => ({
                                id: item.id,
                                label: item.itemName,
                                itemName: item.itemName,
                                sellingPrice: item.sellingPrice,
                                purchasePrice: item.purchasePricePKR,
                                itemClass1: item.itemClass1,
                                itemClass2: item.itemClass2,
                                itemClass3: item.itemClass3,
                                itemClass4: item.itemClass4
                              }))}
                              placeholder="select item"
                              displayKey="label"
                              valueKey="id"
                              columns={itemColumns}
                              pageSize={6}
                              classData={classData}
                            />
                          </div>

                          {/* Unit Price (moved to first row) */}
                          <div className="col-span-2">
                            <label className=" text-gray-500 font-semibold mb-1 text-[11px] block">UNIT PRICE</label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.01"
                                value={detail.Price}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setExpandedRows(prev => new Set(prev).add(index))
                                  }
                                }}
                                onChange={(e) => handleDetailChange(index, 'Price', e.target.value)}
                                className="w-full px-2 py-0.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="0.00"
                                title="Enter the unit price for this item"
                              />
                            </div>
                          </div>

                          {/* FIXED: UOM Converter with proper item passing */}
                          <div className="col-span-4">
                            <div className="">
                              <UomConverter
                                itemId={detail.Item_ID}
                                onChange={(values) => handleUomChange(index, values)}
                                initialValues={{
                                  uom1_qty: detail.uom1_qty?.toString() || '',
                                  uom2_qty: detail.uom2_qty?.toString() || '',
                                  uom3_qty: detail.uom3_qty?.toString() || '',
                                  sale_unit: detail.sale_unit || ''
                                }}
                                isPurchase={isPurchase}
                              />
                            </div>
                          </div>

                          {/* Delete Action */}
                          <div className="col-span-1 text-center">
                            <label className="text-xs text-gray-500 font-semibold mb-1 block">ACTION</label>
                            <button
                              type="button"
                              onClick={() => removeDetailRow(index)}
                              disabled={details.length === 1}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:text-gray-300 disabled:hover:bg-transparent transition-all duration-200"
                              title={details.length === 1 ? "Cannot delete the last row" : "Delete this row"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-end mb-2">
                            <button
                              type="button"
                              onClick={() => toggleRowExpanded(index)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                              aria-label={expandedRows.has(index) ? 'Collapse' : 'Expand'}
                              title={expandedRows.has(index) ? 'Collapse' : 'Expand'}
                            >
                              {expandedRows.has(index) ? (
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M5.23 12.79a1 1 0 001.41 0L10 9.41l3.36 3.38a1 1 0 001.42-1.42l-4.07-4.1a1 1 0 00-1.42 0l-4.06 4.1a1 1 0 000 1.42z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M14.77 7.21a1 1 0 00-1.41 0L10 10.59 6.64 7.21A1 1 0 105.22 8.63l4.07 4.1a1 1 0 001.42 0l4.06-4.1a1 1 0 000-1.42z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Row - Discounts, Notes, Totals (collapsible) */}
                      <div className="px-4">
                        {expandedRows.has(index) && (
                          <div className="grid grid-cols-12 gap-4 py-2">
                            <div className="col-span-1"></div>
                            {/* Discounts */}
                            <div className="col-span-5">
                              <div className="">
                                <div className="flex gap-3">
                                  <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block font-medium">TIER A (%)</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={detail.Discount_A}
                                        onChange={(e) => handleDetailChange(index, 'Discount_A', e.target.value)}
                                        className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                        title="First discount tier percentage"
                                      />
                                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block font-medium">TIER B (%)</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={detail.Discount_B}
                                        onChange={(e) => handleDetailChange(index, 'Discount_B', e.target.value)}
                                        className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                        title="Second discount tier percentage"
                                      />
                                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block font-medium">TIER C (%)</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={detail.Discount_C}
                                        onChange={(e) => handleDetailChange(index, 'Discount_C', e.target.value)}
                                        className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                        title="Third discount tier percentage"
                                      />
                                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            <div className="col-span-3">
                              <label className="text-xs text-gray-500 font-semibold mb-1 block">NOTES</label>
                              <input
                                type="text"
                                value={detail.Remarks}
                                onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
                                className="w-full px-1 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Notes"
                                title="Add any notes for this line item"
                              />
                            </div>

                            {/* Totals */}
                            <div className="col-span-3 grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">GROSS TOTAL</label>
                                <div className="bg-gray-100 px-2 py-1 rounded-lg  text-right font-semibold text-gray-700">
                                  {detail.grossTotal.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">NET TOTAL</label>
                                <div className={`${isPurchase ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-lg  text-right font-bold`}>
                                  {detail.netTotal.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand Total Footer */}
                <div className={`p-3  ${isPurchase ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-gradient-to-r from-green-100 to-green-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-800">
                      Order Summary
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Gross Total:</span>
                        <span className="ml-2 font-bold text-gray-800">₹ {grandTotals.grossTotal.toFixed(2)}</span>
                      </div>
                      <div className={`px-6 py-3 ${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white rounded-xl font-bold text-lg shadow-lg`}>
                        <span className="text-xs font-normal block">Net Total</span>
                        {grandTotals.netTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={addDetailRow}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 flex items-center shadow-lg transform hover:scale-105 transition-all duration-200"
                    title="Add a single line item to the order"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Single Item
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBulkSelector(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center shadow-lg transform hover:scale-105 transition-all duration-200"
                    title="Select multiple items at once to add to the order"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Bulk Add Items
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow-md transform hover:scale-105 transition-all duration-200"
                    title="Cancel and go back"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 text-white rounded-xl disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all duration-200 ${isPurchase
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                      }`}
                    title={loading ? "Processing..." : `${isEditMode ? 'Update' : 'Create'} this order`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isEditMode ? 'Update' : 'Create'} Order
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Bulk Item Selector Modal */}
              {showBulkSelector && (
                <MultiSelectItemTable
                  options={items.map(item => ({
                    id: item.id,
                    label: item.itemName,
                    itemName: item.itemName,
                    sellingPrice: item.sellingPrice,
                    purchasePrice: item.purchasePricePKR,
                    itemClass1: item.itemClass1,
                    itemClass2: item.itemClass2,
                    itemClass3: item.itemClass3,
                    itemClass4: item.itemClass4
                  }))}
                  columns={itemColumns}
                  onSelectionComplete={addBulkItems}
                  onCancel={() => setShowBulkSelector(false)}
                  isPurchase={isPurchase}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnifiedOrderForm
