// // export default UnifiedOrderForm

// 'use client'

// import React, { useState, useEffect, useCallback } from 'react';
// import SelectableTable from './SelectableTable';
// import ClassDropdown from './ClassDropdown';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UomConverter from './UomConverter';
// import { useItemFilter } from './useItemFilter';
// import EnhancedSelectableTable from './EnhancedSelectableTable';
// import MultiSelectItemTable from './MultiSelectItemTable';

// interface Detail {
//   Line_Id: number;
//   Item_ID: number | null;
//   Price: number;
//   Stock_In_UOM: number | null;
//   Stock_In_UOM_Qty: number;
//   Stock_SKU_Price: number;
//   Stock_In_SKU_UOM: number | null;
//   Stock_In_SKU_UOM_Qty: number;
//   Stock_In_UOM3_Qty: number;        // ADDED
//   Stock_out_UOM: number | null;
//   Stock_out_UOM_Qty: number;
//   Stock_out_SKU_UOM: number | null;
//   Stock_out_SKU_UOM_Qty: number;
//   Stock_out_UOM3_Qty: number;       // ADDED
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
//     Stock_Type_ID: isPurchase ? 11 : 12,
//     Date: new Date().toISOString().split('T')[0],
//     COA_ID: null,
//     Next_Status: 'Incomplete'
//   })

//   // FIXED: Updated initial detail state with UOM3 fields
//   const [details, setDetails] = useState<Detail[]>([{
//     Line_Id: 1,
//     Item_ID: null,
//     Price: 0,
//     Stock_In_UOM: null,
//     Stock_In_UOM_Qty: 0,
//     Stock_SKU_Price: 0,
//     Stock_In_SKU_UOM: null,
//     Stock_In_SKU_UOM_Qty: 0,
//     Stock_In_UOM3_Qty: 0,            // ADDED
//     Stock_out_UOM: null,
//     Stock_out_UOM_Qty: 0,
//     Stock_out_SKU_UOM: null,
//     Stock_out_SKU_UOM_Qty: 0,
//     Stock_out_UOM3_Qty: 0,           // ADDED
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

//   // FIXED: Updated addBulkItems with UOM3 fields
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
//         Stock_In_UOM3_Qty: 0,          // ADDED
//         Stock_out_UOM: null,
//         Stock_out_UOM_Qty: 0,
//         Stock_out_SKU_UOM: null,
//         Stock_out_SKU_UOM_Qty: 0,
//         Stock_out_UOM3_Qty: 0,         // ADDED
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
//           return Number(coa.coaTypeId)
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

//   // FIXED: Load order data in edit mode with UOM3 fields
//   useEffect(() => {
//     if (isEditMode && orderId && accounts.length > 0) {
//       const fetchOrderData = async () => {
//         try {
//           setDataLoading(true)
//           const baseUrl = `http://${window.location.hostname}:4000/api`
//           const response = await fetch(`${baseUrl}/order/${orderId}`)
//           const result = await response.json()

//           console.log('Fetched order data:', result); // Debug log

//           if (result.success && result.data) {
//             const order = result.data

//             // Set master data
//             setMaster({
//               Stock_Type_ID: order.Stock_Type_ID,
//               Date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
//               COA_ID: order.COA_ID,
//               Next_Status: order.Next_Status || 'Incomplete'
//             })

//             // FIXED: Set details data with UOM3 fields
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
//                 Stock_In_UOM3_Qty: parseFloat(detail.Stock_In_UOM3_Qty) || 0,    // ADDED
//                 Stock_out_UOM: detail.Stock_out_UOM,
//                 Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
//                 Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
//                 Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
//                 Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,  // ADDED
//                 uom1_qty: parseFloat(detail.uom1_qty) || 0,
//                 uom2_qty: parseFloat(detail.uom2_qty) || 0,
//                 uom3_qty: parseFloat(detail.uom3_qty) || 0,
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

//         console.log('Applying Discounts to All Rows:', {
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
//   }, [master.COA_ID, accounts, isPurchase])

//   // Calculate item totals with discounts
//   const calculateItemTotals = (detailsList, index) => {
//     const detail = detailsList[index]
//     const price = parseFloat(detail.Price.toString()) || 0
//     const qty = parseFloat(detail.uom2_qty?.toString()) || 0
//     // const qty = isPurchase
//     console.log(qty)
//     //   ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
//     //   : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

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

//   const handleItemSelect = (selectedItems: Item[]) => {
//     console.log('Selected items:', selectedItems)
//     // Handle your item selection logic here
//   }

//   // FIXED: Updated handleUomChange with UOM3 support
//   const handleUomChange = (index, values) => {
//     console.log('UOM change:', { index, values }); // Debug log

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
//       updatedDetails[index].Stock_In_UOM3_Qty = values.uom3_qty || 0;   // ADDED
//     } else {
//       // For sales orders, store in Stock_out fields
//       updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
//       updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
//       updatedDetails[index].Stock_out_UOM3_Qty = values.uom3_qty || 0;  // ADDED
//     }

//     calculateItemTotals(updatedDetails, index);
//     setDetails(updatedDetails);
//   }

//   // FIXED: Updated addDetailRow with UOM3 fields and proper Line_Id
//   const addDetailRow = () => {
//     const newRow = {
//       Line_Id: details.length + 1, // This will ensure sequential numbering
//       Item_ID: null,
//       Price: 0,
//       Stock_In_UOM: null,
//       Stock_In_UOM_Qty: 0,
//       Stock_SKU_Price: 0,
//       Stock_In_SKU_UOM: null,
//       Stock_In_SKU_UOM_Qty: 0,
//       Stock_In_UOM3_Qty: 0,          // ADDED
//       Stock_out_UOM: null,
//       Stock_out_UOM_Qty: 0,
//       Stock_out_SKU_UOM: null,
//       Stock_out_SKU_UOM_Qty: 0,
//       Stock_out_UOM3_Qty: 0,         // ADDED
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

//   // FIXED: Updated removeDetailRow with proper Line_Id renumbering
//   const removeDetailRow = (index) => {
//     if (details.length > 1) {
//       const filtered = details.filter((_, i) => i !== index)
//       // Renumber Line_Id to be sequential
//       const updated = filtered.map((item, i) => ({
//         ...item,
//         Line_Id: i + 1
//       }))
//       setDetails(updated)

//       // Update expanded rows to match new indices
//       const newExpandedRows = new Set<number>()
//       expandedRows.forEach(expandedIndex => {
//         if (expandedIndex < index) {
//           newExpandedRows.add(expandedIndex)
//         } else if (expandedIndex > index) {
//           newExpandedRows.add(expandedIndex - 1)
//         }
//       })
//       setExpandedRows(newExpandedRows)
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

//   // FIXED: Updated handleSubmit with UOM3 fields
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
//         Stock_In_UOM3_Qty: Number(d.Stock_In_UOM3_Qty),                    // ADDED
//         Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
//         Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
//         Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
//         Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
//         Stock_out_UOM3_Qty: Number(d.Stock_out_UOM3_Qty),                  // ADDED
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

//       console.log('Submitting order data:', orderData); // Debug log

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData)
//       })

//       const result = await response.json()
//       console.log('Submit response:', result); // Debug log

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
//                   {isEditMode && (
//                     <p className="text-sm opacity-75 mt-1">
//                       Order ID: {orderId}
//                     </p>
//                   )}
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
//                           {/* Line Number - FIXED: Shows correct sequential number */}
//                           <div className="col-span-1">
//                             <label className="text-[11px] text-gray-500 font-semibold mb-1 block">LINE #</label>
//                             <div className={`w-6 h-6 rounded-full ${isPurchase ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center font-bold text-sm`}>
//                               {detail.Line_Id}
//                             </div>
//                           </div>

//                           {/* Item Selection - FIXED: Now properly sets Item_ID */}
//                           <div className="col-span-3">
//                             <label className="text-xs text-gray-500 font-semibold mb-1 block">
//                               PRODUCT/ITEM *
//                               <span className="text-xs text-gray-400 ml-1">(select item)</span>
//                             </label>
//                             <EnhancedSelectableTable
//                               label=""
//                               name="Item_ID"
//                               value={detail.Item_ID}
//                               onChange={(name, value) => {
//                                 console.log('Item selected:', { name, value, index }); // Debug log

//                                 // First update Item_ID
//                                 handleDetailChange(index, 'Item_ID', value)

//                                 // Then find selected item and update price
//                                 const selectedItem = items.find(i => i.id === value)
//                                 if (selectedItem) {
//                                   console.log('Selected item details:', selectedItem); // Debug log

//                                   // Update price and expand row
//                                   const updatedDetails = [...details]
//                                   updatedDetails[index].Item_ID = value // Ensure Item_ID is set
//                                   updatedDetails[index].Price = parseFloat(isPurchase ? selectedItem.purchasePricePKR : selectedItem.sellingPrice) || 0
//                                   setDetails(updatedDetails)

//                                   // Auto-expand to show UOM converter
//                                   setExpandedRows(prev => new Set(prev).add(index))
//                                 }
//                               }}
//                               options={items.map(item => ({
//                                 id: item.id,
//                                 label: item.itemName,
//                                 itemName: item.itemName,
//                                 sellingPrice: item.sellingPrice,
//                                 purchasePrice: item.purchasePricePKR,
//                                 itemClass1: item.itemClass1,
//                                 itemClass2: item.itemClass2,
//                                 itemClass3: item.itemClass3,
//                                 itemClass4: item.itemClass4
//                               }))}
//                               placeholder="select item"
//                               displayKey="label"
//                               valueKey="id"
//                               columns={itemColumns}
//                               pageSize={6}
//                               classData={classData}
//                             />
//                           </div>

//                           {/* Unit Price (moved to first row) */}
//                           <div className="col-span-2">
//                             <label className=" text-gray-500 font-semibold mb-1 text-[11px] block">UNIT PRICE</label>
//                             <div className="relative">
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

//                           {/* FIXED: UOM Converter with proper item passing */}
//                           <div className="col-span-4">
//                             <div className="">
//                               <UomConverter
//                                 itemId={detail.Item_ID}
//                                 onChange={(values) => handleUomChange(index, values)}
//                                 initialValues={{
//                                   uom1_qty: detail.uom1_qty?.toString() || '',
//                                   uom2_qty: detail.uom2_qty?.toString() || '',
//                                   uom3_qty: detail.uom3_qty?.toString() || '',
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
//                       <div className="px-4">
//                         {expandedRows.has(index) && (
//                           <div className="grid grid-cols-12 gap-4 py-2">
//                             <div className="col-span-1"></div>
//                             {/* Discounts */}
//                             <div className="col-span-5">
//                               <div className="">
//                                 <div className="flex gap-3">
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER A (%)</label>
//                                     <div className="relative">
//                                       <input
//                                         type="number"
//                                         step="0.01"
//                                         value={detail.Discount_A}
//                                         onChange={(e) => handleDetailChange(index, 'Discount_A', e.target.value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         title="First discount tier percentage"
//                                       />
//                                       <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
//                                     </div>
//                                   </div>
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER B (%)</label>
//                                     <div className="relative">
//                                       <input
//                                         type="number"
//                                         step="0.01"
//                                         value={detail.Discount_B}
//                                         onChange={(e) => handleDetailChange(index, 'Discount_B', e.target.value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         title="Second discount tier percentage"
//                                       />
//                                       <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
//                                     </div>
//                                   </div>
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER C (%)</label>
//                                     <div className="relative">
//                                       <input
//                                         type="number"
//                                         step="0.01"
//                                         value={detail.Discount_C}
//                                         onChange={(e) => handleDetailChange(index, 'Discount_C', e.target.value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         title="Third discount tier percentage"
//                                       />
//                                       <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Notes */}
//                             <div className="col-span-3">
//                               <label className="text-xs text-gray-500 font-semibold mb-1 block">NOTES</label>
//                               <input
//                                 type="text"
//                                 value={detail.Remarks}
//                                 onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
//                                 className="w-full px-1 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 placeholder="Notes"
//                                 title="Add any notes for this line item"
//                               />
//                             </div>

//                             {/* Totals */}
//                             <div className="col-span-3 grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="text-xs text-gray-500 font-semibold mb-1 block">GROSS TOTAL</label>
//                                 <div className="bg-gray-100 px-2 py-1 rounded-lg  text-right font-semibold text-gray-700">
//                                   {detail.grossTotal.toFixed(2)}
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-xs text-gray-500 font-semibold mb-1 block">NET TOTAL</label>
//                                 <div className={`${isPurchase ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-lg  text-right font-bold`}>
//                                   {detail.netTotal.toFixed(2)}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
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
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UnifiedOrderForm















































































































// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// // ✅ Added imports for your requested components
// import { DateFormat } from './common/DateFormat';
// import { CurrencyFormat, NumberInput } from './common/NumberFormat';
// import { ConfirmationModal } from './common/ConfirmationModal';

// import SelectableTable from './SelectableTable';
// import EnhancedSelectableTable from './EnhancedSelectableTable';
// import UomConverter from './UomConverter';
// import MultiSelectItemTable from './MultiSelectItemTable';

// interface UnifiedFormProps {
//   orderType: 'sales' | 'purchase';
//   orderId?: string;
// }

// const UnifiedOrderForm: React.FC<UnifiedFormProps> = ({ orderType, orderId }) => {
//   const router = useRouter();

//   // Keep all your existing state + add showAllAccounts
//   const [master, setMaster] = useState({
//     Stock_Type_ID: 1,
//     Date: new Date().toISOString().split('T')[0],
//     COA_ID: null,
//     Status: 'Draft',
//     orderType: orderType,
//     carriageAmount: 0,
//     carriageAccountId: null,
//   });

//   const [details, setDetails] = useState([{
//     Line_Id: 1,
//     Item_ID: null,
//     Price: 0,
//     Stock_In_UOM: null,
//     Stock_In_UOM_Qty: 0,
//     Stock_SKU_Price: 0,
//     Stock_In_SKU_UOM: null,
//     Stock_In_SKU_UOM_Qty: 0,
//     Stock_In_UOM3_Qty: 0,
//     Stock_out_UOM: null,
//     Stock_out_UOM_Qty: 0,
//     Stock_out_SKU_UOM: null,
//     Stock_out_SKU_UOM_Qty: 0,
//     Stock_out_UOM3_Qty: 0,
//     uom1_qty: 0,
//     uom2_qty: 0,
//     uom3_qty: 0,
//     sale_unit: 'uomTwo', // ✅ Default UOM2
//     Discount_A: 0,
//     Discount_B: 0,
//     Discount_C: 0,
//     Goods: '',
//     Remarks: '',
//     grossTotal: 0,
//     netTotal: 0,
//   }]);

//   // Keep all your existing state
//   const [message, setMessage] = useState({ text: '', type: 'success' });
//   const [loading, setLoading] = useState(false);
//   const [showBulkSelector, setShowBulkSelector] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteIndex, setDeleteIndex] = useState(null);
//   const [accounts, setAccounts] = useState([]);
//   const [items, setItems] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [expandedRows, setExpandedRows] = useState(new Set([0]));

//   // ✅ ADDED: Show All Accounts state
//   const [showAllAccounts, setShowAllAccounts] = useState(false);

//   const isPurchase = orderType === 'purchase';
//   const isEditMode = !!orderId;

//   // Keep all your existing data fetching
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch items
//         const itemsRes = await fetch(`http://${window.location.hostname}:4000/api/z-items/items`);
//         const itemsData = await itemsRes.json();
//         if (itemsData.success) setItems(itemsData.data);

//         // Fetch accounts
//         await fetchAccounts(orderType);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, [orderType]);

//   const fetchAccounts = async (type) => {
//     try {
//       const endpoint = type === 'purchase' ? 'by-coa-type-supplier' : 'by-coa-type-customer';
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/${endpoint}`);
//       const result = await response.json();
//       if (result.success) {
//         setAccounts(result.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//     }
//   };

//   // ✅ ADDED: Fetch All COA function
//   const fetchAllCOA = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`);
//       const result = await response.json();
//       if (result.success) {
//         setAccounts(result.zCoaRecords || []);
//       }
//     } catch (error) {
//       console.error('Error fetching all COA:', error);
//     }
//   };

//   // Keep all your existing handlers
//   const handleMasterChange = (field, value) => {
//     setMaster(prev => ({ ...prev, [field]: value }));
//   };

//   const handleDetailChange = (index, field, value) => {
//     const newDetails = [...details];
//     newDetails[index] = { ...newDetails[index], [field]: value };
//     setDetails(newDetails);
//     calculateTotals(newDetails);
//   };

//   // ✅ UPDATED: Calculate totals only when UOM > 0
//   const calculateTotals = (currentDetails = details) => {
//     const updatedDetails = currentDetails.map(detail => {
//       if (detail.Item_ID !== null && (detail.uom1_qty > 0 || detail.uom2_qty > 0 || detail.uom3_qty > 0)) {
//         const baseQty = detail.uom2_qty || detail.uom1_qty || detail.uom3_qty;
//         const gross = detail.Price * baseQty;
//         let net = gross;

//         // Cascading discounts
//         if (detail.Discount_A > 0) net = net * (1 - detail.Discount_A / 100);
//         if (detail.Discount_B > 0) net = net * (1 - detail.Discount_B / 100);
//         if (detail.Discount_C > 0) net = net * (1 - detail.Discount_C / 100);

//         return {
//           ...detail,
//           grossTotal: Math.ceil(gross * 100) / 100,
//           netTotal: Math.ceil(net * 100) / 100,
//         };
//       } else {
//         return {
//           ...detail,
//           grossTotal: 0,
//           netTotal: 0,
//         };
//       }
//     });

//     if (currentDetails === details) {
//       setDetails(updatedDetails);
//     }
//     return updatedDetails;
//   };

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
//       Stock_In_UOM3_Qty: 0,
//       Stock_out_UOM: null,
//       Stock_out_UOM_Qty: 0,
//       Stock_out_SKU_UOM: null,
//       Stock_out_SKU_UOM_Qty: 0,
//       Stock_out_UOM3_Qty: 0,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uomTwo',
//       Discount_A: 0,
//       Discount_B: 0,
//       Discount_C: 0,
//       Goods: '',
//       Remarks: '',
//       grossTotal: 0,
//       netTotal: 0,
//     };
//     setDetails([...details, newRow]);
//     setExpandedRows(prev => new Set([...prev, details.length]));
//   };

//   const removeDetailRow = (index) => {
//     if (details.length > 1) {
//       setDeleteIndex(index);
//       setShowDeleteConfirm(true);
//     }
//   };

//   const confirmDelete = () => {
//     if (deleteIndex !== null) {
//       const newDetails = details.filter((_, i) => i !== deleteIndex);
//       const reindexed = newDetails.map((detail, index) => ({
//         ...detail,
//         Line_Id: index + 1
//       }));
//       setDetails(reindexed);
//       calculateTotals(reindexed);

//       setExpandedRows(prev => {
//         const newSet = new Set([...prev]);
//         newSet.delete(deleteIndex);
//         return newSet;
//       });
//     }
//     setShowDeleteConfirm(false);
//     setDeleteIndex(null);
//   };

//   // ✅ UPDATED: Bulk add with UOM2 default
//   const addBulkItems = (selectedItems) => {
//     if (selectedItems.length > 0) {
//       const firstRowEmpty = details.length === 1 && details[0].Item_ID === null;

//       const newRows = selectedItems.map((item, index) => ({
//         Line_Id: firstRowEmpty ? index + 1 : details.length + index + 1,
//         Item_ID: item.id,
//         Price: parseFloat(isPurchase ? item.purchasePrice : item.sellingPrice) || 0,
//         Stock_In_UOM: null,
//         Stock_In_UOM_Qty: 0,
//         Stock_SKU_Price: 0,
//         Stock_In_SKU_UOM: null,
//         Stock_In_SKU_UOM_Qty: 0,
//         Stock_In_UOM3_Qty: 0,
//         Stock_out_UOM: null,
//         Stock_out_UOM_Qty: 0,
//         Stock_out_SKU_UOM: null,
//         Stock_out_SKU_UOM_Qty: 0,
//         Stock_out_UOM3_Qty: 0,
//         uom1_qty: 0,
//         uom2_qty: 1, // ✅ Default UOM2 quantity
//         uom3_qty: 0,
//         sale_unit: 'uomTwo', // ✅ Default UOM2
//         Discount_A: selectedAccount?.discountA || 0,
//         Discount_B: selectedAccount?.discountB || 0,
//         Discount_C: selectedAccount?.discountC || 0,
//         Goods: '',
//         Remarks: '',
//         grossTotal: 0,
//         netTotal: 0,
//       }));

//       if (firstRowEmpty) {
//         setDetails(newRows);
//         setExpandedRows(new Set(newRows.map((_, index) => index)));
//       } else {
//         setDetails([...details, ...newRows]);
//         const newIndices = newRows.map((_, index) => details.length + index);
//         setExpandedRows(prev => new Set([...prev, ...newIndices]));
//       }

//       setMessage({ 
//         text: `${selectedItems.length} items added successfully!`, 
//         type: 'success' 
//       });

//       setTimeout(() => setMessage({ text: '', type: 'success' }), 3000);
//     }
//   };

//   const handleUomChange = (index, values) => {
//     const newDetails = [...details];
//     newDetails[index] = {
//       ...newDetails[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       sale_unit: values.sale_unit || 'uomTwo'
//     };
//     setDetails(newDetails);
//     calculateTotals(newDetails);
//   };

//   const toggleRowExpanded = (index) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(index)) {
//       newExpanded.delete(index);
//     } else {
//       newExpanded.add(index);
//     }
//     setExpandedRows(newExpanded);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (!selectedAccount && !master.COA_ID) {
//         throw new Error('Please select a customer/supplier');
//       }

//       const hasItems = details.some(d => 
//         d.Item_ID !== null && 
//         (d.uom1_qty > 0 || d.uom2_qty > 0 || d.uom3_qty > 0)
//       );

//       if (!hasItems) {
//         throw new Error('Please add at least one item with quantity');
//       }

//       const finalDetails = calculateTotals();
//       const grandTotal = finalDetails.reduce((sum, detail) => sum + detail.netTotal, 0);

//       const orderData = {
//         master: {
//           ...master,
//           COA_ID: selectedAccount?.id || master.COA_ID,
//         },
//         details: finalDetails.filter(detail => 
//           detail.Item_ID !== null && 
//           (detail.uom1_qty > 0 || detail.uom2_qty > 0 || detail.uom3_qty > 0)
//         ),
//         orderType: orderType,
//         totalAmount: grandTotal
//       };

//       console.log('📝 Order Data:', orderData);

//       // Demo success - replace with your actual API call
//       setMessage({ 
//         text: `${orderType} order created successfully! Total: ₨${grandTotal.toFixed(2)}`, 
//         type: 'success' 
//       });

//       setTimeout(() => {
//         router.push(`/order/${orderType}`);
//       }, 2000);

//     } catch (error) {
//       setMessage({ 
//         text: error.message, 
//         type: 'error' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Date formatting function
//   const formatDateDisplay = (dateStr) => {
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, '0');
//     const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
//     const month = months[date.getMonth()];
//     const year = String(date.getFullYear()).slice(-2);
//     return `${day}/${month}/${year}`;
//   };

//   // Calculate totals for display
//   const grandTotals = details.reduce((acc, detail) => {
//     acc.grossTotal += detail.grossTotal || 0;
//     acc.netTotal += detail.netTotal || 0;
//     return acc;
//   }, { grossTotal: 0, netTotal: 0, totalDiscount: 0, itemCount: 0 });

//   grandTotals.totalDiscount = grandTotals.grossTotal - grandTotals.netTotal;
//   grandTotals.itemCount = details.filter(d => d.Item_ID !== null).length;

//   const accountOptions = accounts.map(account => ({
//     id: account.id,
//     label: account.acName,
//     acName: account.acName,
//     city: account.city || '',
//     coaType: account.coaTypeId,
//   }));

//   const itemColumns = [
//     { key: 'itemName', label: 'Item Name', width: '40%' },
//     { key: isPurchase ? 'purchasePrice' : 'sellingPrice', label: 'Price', width: '20%' },
//     { key: 'itemClass1', label: 'Class 1', width: '20%' },
//     { key: 'itemClass2', label: 'Class 2', width: '20%' },
//   ];

//   const accountColumns = [
//     { key: 'acName', label: 'Account Name', width: '50%' },
//     { key: 'city', label: 'City', width: '30%' },
//     { key: 'coaType', label: 'Type', width: '20%' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

//             {/* Header */}
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
//                   {isEditMode && (
//                     <p className="text-sm opacity-75 mt-1">Order ID: {orderId}</p>
//                   )}
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

//                   {/* ✅ UPDATED: Date input with custom format */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <span className="flex items-center">
//                         Order Date <span className="text-red-500">*</span>
//                         <span className="ml-2 text-xs text-gray-500 font-normal">(Required)</span>
//                       </span>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={master.Date}
//                         onChange={(e) => handleMasterChange('Date', e.target.value)}
//                         className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         required
//                         style={{ color: 'transparent' }}
//                       />
//                       <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium pointer-events-none z-10">
//                         {master.Date ? formatDateDisplay(master.Date) : 'Select date'}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <span className="flex items-center">
//                         Stock Type
//                       </span>
//                     </label>
//                     <select
//                       value={master.Stock_Type_ID}
//                       onChange={(e) => handleMasterChange('Stock_Type_ID', parseInt(e.target.value))}
//                       className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                     >
//                       <option value={1}>Regular Stock</option>
//                       <option value={2}>Consignment</option>
//                       <option value={3}>Sample</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Customer/Supplier Selection */}
//                 <div className="mt-6">
//                   <SelectableTable
//                     label={isPurchase ? "Supplier" : "Customer"}
//                     name="COA_ID"
//                     value={master.COA_ID}
//                     onChange={(field, value) => {
//                       handleMasterChange(field, value);
//                       const selected = accounts.find(acc => acc.id === value);
//                       setSelectedAccount(selected);
//                     }}
//                     options={accountOptions}
//                     placeholder={`Select ${isPurchase ? 'supplier' : 'customer'}`}
//                     required={true}
//                     displayKey="label"
//                     valueKey="id"
//                     columns={accountColumns}
//                     pageSize={10}
//                   />
//                 </div>

//                 {/* ✅ ADDED: Show All COA Radio Buttons */}
//                 <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm font-medium text-gray-700">Account Filter:</span>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="accountFilter"
//                         checked={!showAllAccounts}
//                         onChange={() => {
//                           setShowAllAccounts(false);
//                           fetchAccounts(orderType);
//                         }}
//                         className="mr-2"
//                       />
//                       <span className="text-sm">
//                         {isPurchase ? 'Suppliers Only' : 'Customers Only'}
//                       </span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="accountFilter"
//                         checked={showAllAccounts}
//                         onChange={() => {
//                           setShowAllAccounts(true);
//                           fetchAllCOA();
//                         }}
//                         className="mr-2"
//                       />
//                       <span className="text-sm">Show All COA</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items Section */}
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-1">
//                 <div className={`px-4 py-2 ${isPurchase ? 'bg-blue-50' : 'bg-green-50'} border-b ${isPurchase ? 'border-blue-200' : 'border-green-200'}`}>
//                   <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                     <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                     Line Items
//                   </h2>
//                 </div>

//                 <div className="">
//                   {details.map((detail, index) => (
//                     <div 
//                       key={index} 
//                       className={`group hover:bg-gray-50 transition-colors duration-200 ${
//                         index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
//                       }`}
//                     >
//                       <div className="px-4 py-2">
//                         <div className="grid grid-cols-12 gap-1 items-center">
//                           <div className="col-span-1">
//                             <label className="text-[11px] text-gray-500 font-semibold mb-1 block">LINE #</label>
//                             <div className={`w-6 h-6 rounded-full ${isPurchase ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center font-bold text-sm`}>
//                               {detail.Line_Id}
//                             </div>
//                           </div>

//                           <div className="col-span-3">
//                             <label className="text-xs text-gray-500 font-semibold mb-1 block">
//                               PRODUCT/ITEM *
//                               <span className="text-xs text-gray-400 ml-1">(select item)</span>
//                             </label>
//                             <EnhancedSelectableTable
//                               label=""
//                               name="Item_ID"
//                               value={detail.Item_ID}
//                               onChange={(name, value) => {
//                                 handleDetailChange(index, 'Item_ID', value);

//                                 const selectedItem = items.find(i => i.id === value);
//                                 if (selectedItem) {
//                                   handleDetailChange(index, 'Price', parseFloat(isPurchase ? selectedItem.purchasePricePKR : selectedItem.sellingPrice) || 0);

//                                   // ✅ FIXED: Default UOM2 selection
//                                   handleDetailChange(index, 'sale_unit', 'uomTwo');
//                                   handleDetailChange(index, 'uom2_qty', 1);

//                                   // Apply discounts if available
//                                   if (selectedAccount) {
//                                     handleDetailChange(index, 'Discount_A', selectedAccount.discountA || 0);
//                                     handleDetailChange(index, 'Discount_B', selectedAccount.discountB || 0);
//                                     handleDetailChange(index, 'Discount_C', selectedAccount.discountC || 0);
//                                   }

//                                   toggleRowExpanded(index);
//                                 }
//                               }}
//                               options={items.map(item => ({
//                                 id: item.id,
//                                 label: item.itemName,
//                                 itemName: item.itemName,
//                                 sellingPrice: item.sellingPrice,
//                                 purchasePrice: item.purchasePricePKR,
//                                 itemClass1: item.itemClass1,
//                                 itemClass2: item.itemClass2,
//                                 itemClass3: item.itemClass3,
//                                 itemClass4: item.itemClass4
//                               }))}
//                               placeholder="select item"
//                               displayKey="label"
//                               valueKey="id"
//                               columns={itemColumns}
//                               pageSize={6}
//                               classData={{}}
//                             />
//                           </div>

//                           <div className="col-span-2">
//                             <label className=" text-gray-500 font-semibold mb-1 text-[11px] block">UNIT PRICE</label>
//                             <div className="relative">
//                               {/* ✅ UPDATED: NumberInput component */}
//                               <NumberInput
//                                 value={detail.Price}
//                                 onChange={(value) => handleDetailChange(index, 'Price', value)}
//                                 onKeyDown={(e) => {
//                                   if (e.key === 'Enter') {
//                                     toggleRowExpanded(index);
//                                   }
//                                 }}
//                                 className="w-full px-2 py-0.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                 placeholder="0.00"
//                                 step={0.01}
//                                 min={0}
//                               />
//                             </div>
//                           </div>

//                           <div className="col-span-4">
//                             <div className="">
//                               <UomConverter
//                                 itemId={detail.Item_ID}
//                                 onChange={(values) => handleUomChange(index, values)}
//                                 initialValues={{
//                                   uom1_qty: detail.uom1_qty?.toString() || '',
//                                   uom2_qty: detail.uom2_qty?.toString() || (detail.Item_ID ? '1' : ''),
//                                   uom3_qty: detail.uom3_qty?.toString() || '',
//                                   sale_unit: detail.sale_unit || (detail.Item_ID ? 'uomTwo' : '')
//                                 }}
//                                 isPurchase={isPurchase}
//                               />
//                             </div>
//                           </div>

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

//                       <div className="px-4">
//                         {expandedRows.has(index) && (
//                           <div className="grid grid-cols-12 gap-4 py-2">
//                             <div className="col-span-1"></div>

//                             <div className="col-span-5">
//                               <div className="">
//                                 <div className="flex gap-3">
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER A (%)</label>
//                                     <div className="relative">
//                                       <NumberInput
//                                         value={detail.Discount_A}
//                                         onChange={(value) => handleDetailChange(index, 'Discount_A', value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         suffix="%"
//                                         min={0}
//                                         max={100}
//                                         step={0.01}
//                                       />
//                                     </div>
//                                   </div>
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER B (%)</label>
//                                     <div className="relative">
//                                       <NumberInput
//                                         value={detail.Discount_B}
//                                         onChange={(value) => handleDetailChange(index, 'Discount_B', value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         suffix="%"
//                                         min={0}
//                                         max={100}
//                                         step={0.01}
//                                       />
//                                     </div>
//                                   </div>
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER C (%)</label>
//                                     <div className="relative">
//                                       <NumberInput
//                                         value={detail.Discount_C}
//                                         onChange={(value) => handleDetailChange(index, 'Discount_C', value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         suffix="%"
//                                         min={0}
//                                         max={100}
//                                         step={0.01}
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="col-span-3">
//                               <label className="text-xs text-gray-500 font-semibold mb-1 block">NOTES</label>
//                               <input
//                                 type="text"
//                                 value={detail.Remarks}
//                                 onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
//                                 className="w-full px-1 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 placeholder="Notes"
//                                 title="Add any notes for this line item"
//                               />
//                             </div>

//                             <div className="col-span-3 grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="text-xs text-gray-500 font-semibold mb-1 block">GROSS TOTAL</label>
//                                 {/* ✅ UPDATED: CurrencyFormat component */}
//                                 <div className="bg-gray-100 px-2 py-1 rounded-lg text-right font-semibold text-gray-700">
//                                   <CurrencyFormat value={detail.grossTotal} showCurrency={false} />
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-xs text-gray-500 font-semibold mb-1 block">NET TOTAL</label>
//                                 {/* ✅ UPDATED: CurrencyFormat component */}
//                                 <div className={`${isPurchase ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-lg text-right font-bold`}>
//                                   <CurrencyFormat value={detail.netTotal} showCurrency={false} />
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className={`p-3 ${isPurchase ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-gradient-to-r from-green-100 to-green-200'}`}>
//                   <div className="flex items-center justify-between">
//                     <div className="text-lg font-bold text-gray-800">Order Summary</div>
//                     <div className="flex items-center gap-6">
//                       <div className="text-sm text-gray-600">
//                         <span className="font-medium">Gross Total:</span>
//                         <span className="ml-2 font-bold text-gray-800">
//                           ₨ <CurrencyFormat value={grandTotals.grossTotal} showCurrency={false} />
//                         </span>
//                       </div>
//                       <div className={`px-6 py-3 ${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white rounded-xl font-bold text-lg shadow-lg`}>
//                         <span className="text-xs font-normal block">Net Total</span>
//                         <CurrencyFormat value={grandTotals.netTotal} showCurrency={false} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
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

//               {/* Bulk Modal */}
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

//               <ConfirmationModal
//                 isOpen={showDeleteConfirm}
//                 onClose={() => setShowDeleteConfirm(false)}
//                 onConfirm={confirmDelete}
//                 title="Delete Line Item"
//                 message="Are you sure you want to delete this line item? This action cannot be undone."
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 type="danger"
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnifiedOrderForm;

































































































































// 'use client'

// import React, { useState, useEffect, useCallback } from 'react';
// import SelectableTable from './SelectableTable';
// import ClassDropdown from './ClassDropdown';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UomConverter from './UomConverter';
// import { useItemFilter } from './useItemFilter';
// import EnhancedSelectableTable from './EnhancedSelectableTable';
// import MultiSelectItemTable from './MultiSelectItemTable';

// // ✅ ADDED: Import the components you wanted
// import { DateFormat } from './common/DateFormat';
// import { CurrencyFormat, NumberInput } from './common/NumberFormat';
// import { ConfirmationModal } from './common/ConfirmationModal';

// interface Detail {
//   Line_Id: number;
//   Item_ID: number | null;
//   Price: number;
//   Stock_In_UOM: number | null;
//   Stock_In_UOM_Qty: number;
//   Stock_SKU_Price: number;
//   Stock_In_SKU_UOM: number | null;
//   Stock_In_SKU_UOM_Qty: number;
//   Stock_In_UOM3_Qty: number;
//   Stock_out_UOM: number | null;
//   Stock_out_UOM_Qty: number;
//   Stock_out_SKU_UOM: number | null;
//   Stock_out_SKU_UOM_Qty: number;
//   Stock_out_UOM3_Qty: number;
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

//   const [classData, setClassData] = useState({
//     class1: [],
//     class2: [],
//     class3: [],
//     class4: []
//   })

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
//     Stock_Type_ID: isPurchase ? 11 : 12,
//     Date: new Date().toISOString().split('T')[0],
//     COA_ID: null,
//     Next_Status: 'Incomplete'
//   })

//   const [details, setDetails] = useState<Detail[]>([{
//     Line_Id: 1,
//     Item_ID: null,
//     Price: 0,
//     Stock_In_UOM: null,
//     Stock_In_UOM_Qty: 0,
//     Stock_SKU_Price: 0,
//     Stock_In_SKU_UOM: null,
//     Stock_In_SKU_UOM_Qty: 0,
//     Stock_In_UOM3_Qty: 0,
//     Stock_out_UOM: null,
//     Stock_out_UOM_Qty: 0,
//     Stock_out_SKU_UOM: null,
//     Stock_out_SKU_UOM_Qty: 0,
//     Stock_out_UOM3_Qty: 0,
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

//   // ✅ ADDED: Show All Accounts state
//   const [showAllAccounts, setShowAllAccounts] = useState(false)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [deleteIndex, setDeleteIndex] = useState(null)

//   // Your existing useEffect for account selection - KEEP AS IS
//   useEffect(() => {
//     if (master.COA_ID) {
//       const account = accounts.find(acc => acc.id === master.COA_ID)
//       console.log('Selected Account Full Data:', account)
//       setSelectedAccount(account || null)

//       if (account) {
//         const discountA = parseFloat(account.discountA) || 0
//         const discountB = parseFloat(account.discountB) || 0
//         const discountC = parseFloat(account.discountC) || 0

//         console.log('Applying Discounts to All Rows:', {
//           discountA,
//           discountB,
//           discountC
//         })

//         setDetails(prevDetails => prevDetails.map(detail => {
//           const price = parseFloat(detail.Price.toString()) || 0
//           const qty = isPurchase
//             ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
//             : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

//           const grossTotal = price * qty

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
//   }, [master.COA_ID, accounts, isPurchase])

//   // ✅ UPDATED: calculateItemTotals - Only calculate when UOM values > 0
//   const calculateItemTotals = (detailsList, index) => {
//     const detail = detailsList[index]
//     const price = parseFloat(detail.Price.toString()) || 0
//     const qty = parseFloat(detail.uom2_qty?.toString()) || 0

//     // ✅ FIXED: Only calculate if UOM quantity > 0
//     if (qty > 0) {
//       const discountA = parseFloat(detail.Discount_A.toString()) || 0
//       const discountB = parseFloat(detail.Discount_B.toString()) || 0
//       const discountC = parseFloat(detail.Discount_C.toString()) || 0

//       const grossTotal = price * qty

//       let netTotal = grossTotal
//       netTotal = netTotal - (netTotal * discountA / 100)
//       netTotal = netTotal - (netTotal * discountB / 100)
//       netTotal = netTotal - (netTotal * discountC / 100)

//       detailsList[index].grossTotal = grossTotal
//       detailsList[index].netTotal = netTotal
//     } else {
//       // Reset totals when no quantity
//       detailsList[index].grossTotal = 0
//       detailsList[index].netTotal = 0
//     }
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
//     if (['Price', 'Stock_In_UOM_Qty', 'Stock_out_UOM_Qty', 'Discount_A', 'Discount_B', 'Discount_C', 'uom2_qty'].includes(field)) {
//       calculateItemTotals(updatedDetails, index)
//     }

//     setDetails(updatedDetails)
//   }

//   const handleItemSelect = (selectedItems: Item[]) => {
//     console.log('Selected items:', selectedItems)
//   }

//   const handleUomChange = (index, values) => {
//     console.log('UOM change:', { index, values });

//     const updatedDetails = [...details]

//     updatedDetails[index].uom1_qty = values.uom1_qty || 0;
//     updatedDetails[index].uom2_qty = values.uom2_qty || 0;
//     updatedDetails[index].uom3_qty = values.uom3_qty || 0;
//     updatedDetails[index].sale_unit = values.sale_unit || '';

//     if (isPurchase) {
//       updatedDetails[index].Stock_In_UOM_Qty = values.uom1_qty || 0;
//       updatedDetails[index].Stock_In_SKU_UOM_Qty = values.uom2_qty || 0;
//       updatedDetails[index].Stock_In_UOM3_Qty = values.uom3_qty || 0;
//     } else {
//       updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
//       updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
//       updatedDetails[index].Stock_out_UOM3_Qty = values.uom3_qty || 0;
//     }

//     calculateItemTotals(updatedDetails, index);
//     setDetails(updatedDetails);
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
//       Stock_In_UOM3_Qty: 0,
//       Stock_out_UOM: null,
//       Stock_out_UOM_Qty: 0,
//       Stock_out_SKU_UOM: null,
//       Stock_out_SKU_UOM_Qty: 0,
//       Stock_out_UOM3_Qty: 0,
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

//   // ✅ UPDATED: removeDetailRow with confirmation modal
//   const removeDetailRow = (index) => {
//     if (details.length > 1) {
//       setDeleteIndex(index)
//       setShowDeleteConfirm(true)
//     }
//   }

//   const confirmDelete = () => {
//     if (deleteIndex !== null && details.length > 1) {
//       const filtered = details.filter((_, i) => i !== deleteIndex)
//       const updated = filtered.map((item, i) => ({
//         ...item,
//         Line_Id: i + 1
//       }))
//       setDetails(updated)

//       const newExpandedRows = new Set<number>()
//       expandedRows.forEach(expandedIndex => {
//         if (expandedIndex < deleteIndex) {
//           newExpandedRows.add(expandedIndex)
//         } else if (expandedIndex > deleteIndex) {
//           newExpandedRows.add(expandedIndex - 1)
//         }
//       })
//       setExpandedRows(newExpandedRows)
//     }
//     setShowDeleteConfirm(false)
//     setDeleteIndex(null)
//   }

//   // ✅ UPDATED: addBulkItems - Force UOM2 default
//   const addBulkItems = (selectedItems: any[]) => {
//     const firstRowEmpty = details.length === 1 && details[0].Item_ID === null;

//     const newRows = selectedItems.map((item, index) => {
//       const currentLineId = firstRowEmpty ? index + 1 : details.length + index + 1

//       return {
//         Line_Id: currentLineId,
//         Item_ID: item.id,
//         Price: parseFloat(isPurchase ? item.purchasePrice : item.sellingPrice) || 0,
//         Stock_In_UOM: null,
//         Stock_In_UOM_Qty: 0,
//         Stock_SKU_Price: 0,
//         Stock_In_SKU_UOM: null,
//         Stock_In_SKU_UOM_Qty: 0,
//         Stock_In_UOM3_Qty: 0,
//         Stock_out_UOM: null,
//         Stock_out_UOM_Qty: 0,
//         Stock_out_SKU_UOM: null,
//         Stock_out_SKU_UOM_Qty: 0,
//         Stock_out_UOM3_Qty: 0,
//         uom1_qty: 0,
//         uom2_qty: 1, // ✅ FIXED: Default UOM2 quantity
//         uom3_qty: 0,
//         sale_unit: 'uomTwo', // ✅ FIXED: Default UOM2
//         Discount_A: selectedAccount?.discountA ? parseFloat(selectedAccount.discountA) : 0,
//         Discount_B: selectedAccount?.discountB ? parseFloat(selectedAccount.discountB) : 0,
//         Discount_C: selectedAccount?.discountC ? parseFloat(selectedAccount.discountC) : 0,
//         Goods: '',
//         Remarks: '',
//         grossTotal: 0,
//         netTotal: 0
//       }
//     })

//     if (firstRowEmpty) {
//       setDetails(newRows)
//       setExpandedRows(new Set(newRows.map((_, index) => index)))
//     } else {
//       setDetails(prevDetails => [...prevDetails, ...newRows])
//       const newRowIndices = newRows.map((_, index) => details.length + index)
//       setExpandedRows(prev => {
//         const newSet = new Set(prev)
//         newRowIndices.forEach(idx => newSet.add(idx))
//         return newSet
//       })
//     }

//     setMessage({
//       type: 'success',
//       text: `Successfully added ${selectedItems.length} items to your order`
//     })

//     setTimeout(() => setMessage({ type: '', text: '' }), 3000)
//   }

//   // ✅ ADDED: Fetch All COA function
//   const fetchAllCOA = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`)
//       const result = await response.json()
//       if (result.success) {
//         setAccounts(result.zCoaRecords || [])
//       }
//     } catch (error) {
//       console.error('Error fetching all COA:', error)
//     }
//   }

//   const fetchAccounts = async (type) => {
//     try {
//       const endpoint = type === 'purchase' ? 'by-coa-type-supplier' : 'by-coa-type-customer'
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/${endpoint}`)
//       const result = await response.json()
//       if (result.success) {
//         setAccounts(result.data || [])
//       }
//     } catch (error) {
//       console.error('Error fetching accounts:', error)
//     }
//   }

//   // Your existing fetchAllData function - KEEP AS IS
//   const fetchAllData = useCallback(async () => {
//     try {
//       setDataLoading(true)
//       const baseUrl = `http://${window.location.hostname}:4000/api`

//       console.log(`Fetching data for: ${isPurchase ? "Purchase Order" : "Sales Order"}`)

//       const itemsRes = await fetch(`${baseUrl}/z-items/items`)
//       const itemsData = await itemsRes.json()
//       if (itemsData.success) {
//         console.log("Items loaded:", itemsData.data?.length || 0)
//         setItems(itemsData.data || [])
//       }

//       const uomsRes = await fetch(`${baseUrl}/z-uom/get`)
//       const uomsData = await uomsRes.json()
//       if (uomsData.data) {
//         console.log("UOMs loaded:", uomsData.data?.length || 0)
//         setUoms(uomsData.data || [])
//       }

//       // Fetch accounts initially as customers/suppliers only
//       await fetchAccounts(orderType)

//     } catch (error) {
//       console.error('Error fetching data:', error)
//       setMessage({ type: 'error', text: 'Failed to load data' })
//     } finally {
//       setDataLoading(false)
//     }
//   }, [isPurchase, orderType])

//   useEffect(() => {
//     fetchAllData()
//   }, [fetchAllData])

//   // Your existing useEffect for edit mode - KEEP AS IS
//   useEffect(() => {
//     if (isEditMode && orderId && accounts.length > 0) {
//       const fetchOrderData = async () => {
//         try {
//           setDataLoading(true)
//           const baseUrl = `http://${window.location.hostname}:4000/api`
//           const response = await fetch(`${baseUrl}/order/${orderId}`)
//           const result = await response.json()

//           console.log('Fetched order data:', result);

//           if (result.success && result.data) {
//             const order = result.data

//             setMaster({
//               Stock_Type_ID: order.Stock_Type_ID,
//               Date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
//               COA_ID: order.COA_ID,
//               Next_Status: order.Next_Status || 'Incomplete'
//             })

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
//                 Stock_In_UOM3_Qty: parseFloat(detail.Stock_In_UOM3_Qty) || 0,
//                 Stock_out_UOM: detail.Stock_out_UOM,
//                 Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
//                 Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
//                 Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
//                 Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
//                 uom1_qty: parseFloat(detail.uom1_qty) || 0,
//                 uom2_qty: parseFloat(detail.uom2_qty) || 0,
//                 uom3_qty: parseFloat(detail.uom3_qty) || 0,
//                 sale_unit: detail.sale_unit || '',
//                 Discount_A: parseFloat(detail.Discount_A) || 0,
//                 Discount_B: parseFloat(detail.Discount_B) || 0,
//                 Discount_C: parseFloat(detail.Discount_C) || 0,
//                 Goods: detail.Goods || '',
//                 Remarks: detail.Remarks || '',
//                 grossTotal: 0,
//                 netTotal: 0
//               }))

//               orderDetails.forEach((detail, index) => {
//                 const price = parseFloat(detail.Price.toString()) || 0
//                 const qty = isPurchase
//                   ? parseFloat(detail.Stock_In_UOM_Qty.toString()) || 0
//                   : parseFloat(detail.Stock_out_UOM_Qty.toString()) || 0

//                 const discountA = parseFloat(detail.Discount_A.toString()) || 0
//                 const discountB = parseFloat(detail.Discount_B.toString()) || 0
//                 const discountC = parseFloat(detail.Discount_C.toString()) || 0

//                 const grossTotal = price * qty

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
//       // ✅ UPDATED: Check UOM quantities instead of old fields
//       const hasQuantity = detail.uom1_qty > 0 || detail.uom2_qty > 0 || detail.uom3_qty > 0
//       if (!hasQuantity) {
//         setMessage({ type: 'error', text: 'Please enter quantity for all items' })
//         return false
//       }
//     }

//     return true
//   }

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
//         Stock_In_UOM3_Qty: Number(d.Stock_In_UOM3_Qty),
//         Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
//         Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
//         Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
//         Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
//         Stock_out_UOM3_Qty: Number(d.Stock_out_UOM3_Qty),
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

//       console.log('Submitting order data:', orderData);

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderData)
//       })

//       const result = await response.json()
//       console.log('Submit response:', result);

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

//   // Your existing grandTotals calculation - KEEP AS IS
//   const grandTotals = details.reduce((acc, detail) => ({
//     grossTotal: acc.grossTotal + detail.grossTotal,
//     netTotal: acc.netTotal + detail.netTotal
//   }), { grossTotal: 0, netTotal: 0 })

//   const itemOptions = items.map(item => ({
//     id: item.id,
//     label: item.itemName,
//     itemName: item.itemName,
//     sellingPrice: item.sellingPrice,
//     purchasePrice: item.purchasePricePKR,
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

//   const accountOptions = accounts.map(acc => ({
//     id: acc.id,
//     label: acc.acName,
//     acName: acc.acName,
//     city: acc.city || '',
//     personName: acc.personName || ''
//   }))

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

//   // ✅ ADDED: Date formatting function
//   const formatDateDisplay = (dateStr: string): string => {
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, '0');
//     const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
//     const month = months[date.getMonth()];
//     const year = String(date.getFullYear()).slice(-2);
//     return `${day}/${month}/${year}`;
//   };

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
//                   {isEditMode && (
//                     <p className="text-sm opacity-75 mt-1">
//                       Order ID: {orderId}
//                     </p>
//                   )}
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

//                   {/* ✅ UPDATED: Date input with custom format */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <span className="flex items-center">
//                         Order Date <span className="text-red-500">*</span>
//                         <span className="ml-2 text-xs text-gray-500 font-normal">(Required)</span>
//                       </span>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={master.Date}
//                         onChange={(e) => handleMasterChange('Date', e.target.value)}
//                         className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         required
//                         style={{ color: 'transparent' }}
//                         title="Select the date for this order"
//                       />
//                       <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium pointer-events-none z-10">
//                         {master.Date ? formatDateDisplay(master.Date) : 'Select date'}
//                       </div>
//                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <span className="flex items-center">
//                         Stock Type
//                       </span>
//                     </label>
//                     <select
//                       value={master.Stock_Type_ID}
//                       onChange={(e) => handleMasterChange('Stock_Type_ID', parseInt(e.target.value))}
//                       className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       title="Select the type of stock for this order"
//                     >
//                       <option value={isPurchase ? 11 : 12}>
//                         {isPurchase ? 'Purchase Stock' : 'Sales Stock'}
//                       </option>
//                       <option value={1}>Regular Stock</option>
//                       <option value={2}>Consignment</option>
//                       <option value={3}>Sample</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Customer/Supplier Selection */}
//                 <div className="mt-6">
//                   <SelectableTable
//                     label={isPurchase ? "Supplier" : "Customer"}
//                     name="COA_ID"
//                     value={master.COA_ID}
//                     onChange={handleMasterChange}
//                     options={accountOptions}
//                     placeholder={`Select ${isPurchase ? 'supplier' : 'customer'}`}
//                     required={true}
//                     displayKey="label"
//                     valueKey="id"
//                     columns={accountColumns}
//                     pageSize={10}
//                   />
//                 </div>

//                 {/* ✅ ADDED: Show All COA Radio Buttons */}
//                 <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm font-medium text-gray-700">Account Filter:</span>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="accountFilter"
//                         checked={!showAllAccounts}
//                         onChange={() => {
//                           setShowAllAccounts(false);
//                           fetchAccounts(orderType);
//                         }}
//                         className="mr-2"
//                       />
//                       <span className="text-sm">
//                         {isPurchase ? 'Suppliers Only' : 'Customers Only'}
//                       </span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="accountFilter"
//                         checked={showAllAccounts}
//                         onChange={() => {
//                           setShowAllAccounts(true);
//                           fetchAllCOA();
//                         }}
//                         className="mr-2"
//                       />
//                       <span className="text-sm">Show All COA</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items Section */}
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-1">
//                 <div className={`px-4 py-2 ${isPurchase ? 'bg-blue-50' : 'bg-green-50'} border-b ${isPurchase ? 'border-blue-200' : 'border-green-200'}`}>
//                   <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                     <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                     Line Items
//                   </h2>
//                 </div>

//                 <div className="">
//                   {details.map((detail, index) => (
//                     <div 
//                       key={index} 
//                       className={`group hover:bg-gray-50 transition-colors duration-200 ${
//                         // ✅ ADDED: Even/odd row styling
//                         index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
//                       }`}
//                     >
//                       <div className="px-4 py-2">
//                         <div className="grid grid-cols-12 gap-1 items-center">
//                           <div className="col-span-1">
//                             <label className="text-[11px] text-gray-500 font-semibold mb-1 block">LINE #</label>
//                             <div className={`w-6 h-6 rounded-full ${isPurchase ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center font-bold text-sm`}>
//                               {detail.Line_Id}
//                             </div>
//                           </div>

//                           <div className="col-span-3">
//                             <label className="text-xs text-gray-500 font-semibold mb-1 block">
//                               PRODUCT/ITEM *
//                               <span className="text-xs text-gray-400 ml-1">(select item)</span>
//                             </label>
//                             <EnhancedSelectableTable
//                               label=""
//                               name="Item_ID"
//                               value={detail.Item_ID}
//                               onChange={(name, value) => {
//                                 console.log('Item selected:', { name, value, index });

//                                 handleDetailChange(index, 'Item_ID', value);

//                                 const selectedItem = items.find(i => i.id === value);
//                                 if (selectedItem) {
//                                   console.log('Selected item details:', selectedItem);

//                                   handleDetailChange(index, 'Price', parseFloat(isPurchase ? selectedItem.purchasePricePKR : selectedItem.sellingPrice) || 0);

//                                   // ✅ FIXED: Default UOM2 selection
//                                   handleDetailChange(index, 'sale_unit', 'uomTwo');
//                                   handleDetailChange(index, 'uom2_qty', 1);

//                                   // Apply account discounts
//                                   if (selectedAccount) {
//                                     handleDetailChange(index, 'Discount_A', selectedAccount.discountA || 0);
//                                     handleDetailChange(index, 'Discount_B', selectedAccount.discountB || 0);
//                                     handleDetailChange(index, 'Discount_C', selectedAccount.discountC || 0);
//                                   }

//                                   toggleRowExpanded(index);
//                                 }
//                               }}
//                               options={itemOptions}
//                               placeholder="select item"
//                               displayKey="label"
//                               valueKey="id"
//                               columns={itemColumns}
//                               pageSize={6}
//                               classData={classData}
//                             />
//                           </div>

//                           <div className="col-span-2">
//                             <label className=" text-gray-500 font-semibold mb-1 text-[11px] block">UNIT PRICE</label>
//                             <div className="relative">
//                               {/* ✅ UPDATED: NumberInput component */}
//                               <NumberInput
//                                 value={detail.Price}
//                                 onChange={(value) => handleDetailChange(index, 'Price', value)}
//                                 onKeyDown={(e) => {
//                                   if (e.key === 'Enter') {
//                                     toggleRowExpanded(index);
//                                   }
//                                 }}
//                                 className="w-full px-2 py-0.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                 placeholder="0.00"
//                                 step={0.01}
//                                 min={0}
//                               />
//                             </div>
//                           </div>

//                           <div className="col-span-4">
//                             <div className="">
//                               <UomConverter
//                                 itemId={detail.Item_ID}
//                                 onChange={(values) => handleUomChange(index, values)}
//                                 initialValues={{
//                                   uom1_qty: detail.uom1_qty?.toString() || '',
//                                   uom2_qty: detail.uom2_qty?.toString() || (detail.Item_ID ? '1' : ''),
//                                   uom3_qty: detail.uom3_qty?.toString() || '',
//                                   sale_unit: detail.sale_unit || (detail.Item_ID ? 'uomTwo' : '')
//                                 }}
//                                 isPurchase={isPurchase}
//                               />
//                             </div>
//                           </div>

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

//                       <div className="px-4">
//                         {expandedRows.has(index) && (
//                           <div className="grid grid-cols-12 gap-4 py-2">
//                             <div className="col-span-1"></div>

//                             <div className="col-span-5">
//                               <div className="">
//                                 <div className="flex gap-3">
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER A (%)</label>
//                                     <div className="relative">
//                                       {/* ✅ UPDATED: NumberInput component */}
//                                       <NumberInput
//                                         value={detail.Discount_A}
//                                         onChange={(value) => handleDetailChange(index, 'Discount_A', value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         suffix="%"
//                                         min={0}
//                                         max={100}
//                                         step={0.01}
//                                       />
//                                     </div>
//                                   </div>
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER B (%)</label>
//                                     <div className="relative">
//                                       <NumberInput
//                                         value={detail.Discount_B}
//                                         onChange={(value) => handleDetailChange(index, 'Discount_B', value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         suffix="%"
//                                         min={0}
//                                         max={100}
//                                         step={0.01}
//                                       />
//                                     </div>
//                                   </div>
//                                   <div className="flex-1">
//                                     <label className="text-xs text-gray-500 mb-1 block font-medium">TIER C (%)</label>
//                                     <div className="relative">
//                                       <NumberInput
//                                         value={detail.Discount_C}
//                                         onChange={(value) => handleDetailChange(index, 'Discount_C', value)}
//                                         className="w-full px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="0"
//                                         suffix="%"
//                                         min={0}
//                                         max={100}
//                                         step={0.01}
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="col-span-3">
//                               <label className="text-xs text-gray-500 font-semibold mb-1 block">NOTES</label>
//                               <input
//                                 type="text"
//                                 value={detail.Remarks}
//                                 onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
//                                 className="w-full px-1 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 placeholder="Notes"
//                                 title="Add any notes for this line item"
//                               />
//                             </div>

//                             <div className="col-span-3 grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="text-xs text-gray-500 font-semibold mb-1 block">GROSS TOTAL</label>
//                                 {/* ✅ UPDATED: CurrencyFormat component */}
//                                 <div className="bg-gray-100 px-2 py-1 rounded-lg text-right font-semibold text-gray-700">
//                                   <CurrencyFormat value={detail.grossTotal} showCurrency={false} />
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-xs text-gray-500 font-semibold mb-1 block">NET TOTAL</label>
//                                 {/* ✅ UPDATED: CurrencyFormat component */}
//                                 <div className={`${isPurchase ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-lg text-right font-bold`}>
//                                   <CurrencyFormat value={detail.netTotal} showCurrency={false} />
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className={`p-3  ${isPurchase ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-gradient-to-r from-green-100 to-green-200'}`}>
//                   <div className="flex items-center justify-between">
//                     <div className="text-lg font-bold text-gray-800">
//                       Order Summary
//                     </div>
//                     <div className="flex items-center gap-6">
//                       <div className="text-sm text-gray-600">
//                         <span className="font-medium">Gross Total:</span>
//                         <span className="ml-2 font-bold text-gray-800">
//                           ₨ <CurrencyFormat value={grandTotals.grossTotal} showCurrency={false} />
//                         </span>
//                       </div>
//                       <div className={`px-6 py-3 ${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white rounded-xl font-bold text-lg shadow-lg`}>
//                         <span className="text-xs font-normal block">Net Total</span>
//                         <CurrencyFormat value={grandTotals.netTotal} showCurrency={false} />
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

//               {/* Your existing Bulk Item Selector Modal */}
//               {showBulkSelector && (
//                 <MultiSelectItemTable
//                   options={itemOptions}
//                   columns={itemColumns}
//                   onSelectionComplete={addBulkItems}
//                   onCancel={() => setShowBulkSelector(false)}
//                   isPurchase={isPurchase}
//                 />
//               )}

//               {/* ✅ ADDED: Confirmation Modal */}
//               <ConfirmationModal
//                 isOpen={showDeleteConfirm}
//                 onClose={() => setShowDeleteConfirm(false)}
//                 onConfirm={confirmDelete}
//                 title="Delete Line Item"
//                 message="Are you sure you want to delete this line item? This action cannot be undone."
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 type="danger"
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UnifiedOrderForm;






















































































































































































// 'use client'

// import React, { useState, useEffect, useCallback } from 'react';
// import SelectableTable from './SelectableTable';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UomConverter from './UomConverter';
// import { useItemFilter } from './useItemFilter';
// import EnhancedSelectableTable from './EnhancedSelectableTable';
// import MultiSelectItemTable from './MultiSelectItemTable';

// import { DateFormat } from './common/DateFormat';
// import { CurrencyFormat, NumberInput } from './common/NumberFormat';
// import { ConfirmationModal } from './common/ConfirmationModal';

// // ✅ IMPORT: API logic
// import { OrderAPI } from '../utils/OrderAPI';
// import { OrderLogic, Detail } from '../utils/OrderLogic';

// const UnifiedOrderForm = ({ orderType }: { orderType: string }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get('id');
//   const isEditMode = Boolean(orderId);
//   const isPurchase = orderType === 'purchase';

//   const [master, setMaster] = useState({
//     Date: new Date().toISOString().split('T')[0],
//     COA_ID: null,
//     Next_Status: 'Incomplete'
//   });

//   const [details, setDetails] = useState<Detail[]>([
//     OrderLogic.createNewRow(1, null)
//   ]);

//   const [formValues, setFormValues] = useState({
//     itemClass1: null, itemClass2: null, itemClass3: null, itemClass4: null
//   });

//   const [classData, setClassData] = useState({
//     class1: [], class2: [], class3: [], class4: []
//   });

//   const [expandedRows, setExpandedRows] = useState(new Set<number>());
//   const [items, setItems] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [uoms, setUoms] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [showAllAccounts, setShowAllAccounts] = useState(false);
//   const [showBulkSelector, setShowBulkSelector] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

//   const { filteredItems } = useItemFilter({ items, classFilters: formValues });

//   // ✅ FIXED: Load all data including order data for edit mode
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setDataLoading(true);

//         // Load master data
//         const { items, accounts, uoms } = await OrderAPI.fetchAllData(orderType);
//         setItems(items);
//         setAccounts(accounts);
//         setUoms(uoms);

//         // ✅ FIXED: Load order data in edit mode
//         if (isEditMode && orderId) {
//           console.log('📋 Loading order data for edit mode, ID:', orderId);

//           const orderResult = await OrderAPI.fetchOrder(orderId);

//           if (orderResult.success && orderResult.data) {
//             const order = orderResult.data;
//             console.log('✅ Order data loaded:', order);

//             // Set master data
//             setMaster({
//               Date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
//               COA_ID: order.COA_ID,
//               Next_Status: order.Next_Status || 'Incomplete'
//             });

//             // Set details data
//             if (order.details && order.details.length > 0) {
//               const orderDetails = order.details.map((detail: any) => ({
//                 Line_Id: detail.Line_Id,
//                 Item_ID: detail.Item_ID,
//                 Price: parseFloat(detail.Price) || 0,
//                 Stock_In_UOM: detail.Stock_In_UOM,
//                 Stock_In_UOM_Qty: parseFloat(detail.Stock_In_UOM_Qty) || 0,
//                 Stock_SKU_Price: parseFloat(detail.Stock_SKU_Price) || 0,
//                 Stock_In_SKU_UOM: detail.Stock_In_SKU_UOM,
//                 Stock_In_SKU_UOM_Qty: parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0,
//                 Stock_In_UOM3_Qty: parseFloat(detail.Stock_In_UOM3_Qty) || 0,
//                 Stock_out_UOM: detail.Stock_out_UOM,
//                 Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
//                 Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
//                 Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
//                 Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
//                 uom1_qty: parseFloat(detail.uom1_qty) || 0,
//                 uom2_qty: parseFloat(detail.uom2_qty) || 0,
//                 uom3_qty: parseFloat(detail.uom3_qty) || 0,
//                 sale_unit: detail.sale_unit || '',
//                 Discount_A: parseFloat(detail.Discount_A) || 0,
//                 Discount_B: parseFloat(detail.Discount_B) || 0,
//                 Discount_C: parseFloat(detail.Discount_C) || 0,
//                 Goods: detail.Goods || '',
//                 Remarks: detail.Remarks || '',
//                 grossTotal: 0,
//                 netTotal: 0
//               }));

//               // Calculate totals for loaded data
//               const calculatedDetails = orderDetails.map(detail => OrderLogic.calculateItemTotals(detail));
//               setDetails(calculatedDetails);

//               // Expand all rows in edit mode
//               setExpandedRows(new Set(calculatedDetails.map((_, index) => index)));

//               console.log('✅ Order details loaded and calculated:', calculatedDetails.length, 'items');
//             }
//           } else {
//             setMessage({ type: 'error', text: 'Order not found or failed to load' });
//           }
//         }

//       } catch (error) {
//         console.error('Error loading data:', error);
//         setMessage({ type: 'error', text: 'Failed to load data' });
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     loadData();
//   }, [orderType, isEditMode, orderId]);

//   // Account selection effect
//   useEffect(() => {
//     if (master.COA_ID) {
//       const account = accounts.find((acc: any) => acc.id === master.COA_ID);
//       setSelectedAccount(account || null);
//     }
//   }, [master.COA_ID, accounts]);

//   // Handlers
//   const handleDetailChange = (index: number, field: string, value: any) => {
//     const updatedDetails = [...details];
//     updatedDetails[index] = { ...updatedDetails[index], [field]: value };

//     if (['Price', 'uom2_qty', 'Discount_A', 'Discount_B', 'Discount_C'].includes(field)) {
//       updatedDetails[index] = OrderLogic.calculateItemTotals(updatedDetails[index]);
//     }

//     setDetails(updatedDetails);
//   };

//   const handleUomChange = (index: number, values: any) => {
//     console.log('🔄 UOM change for row', index, ':', values);

//     const updatedDetails = [...details];

//     updatedDetails[index].uom1_qty = values.uom1_qty || 0;
//     updatedDetails[index].uom2_qty = values.uom2_qty || 0;
//     updatedDetails[index].uom3_qty = values.uom3_qty || 0;
//     updatedDetails[index].sale_unit = values.sale_unit || 'uomTwo';

//     // Update stock fields
//     if (isPurchase) {
//       updatedDetails[index].Stock_In_UOM_Qty = values.uom1_qty || 0;
//       updatedDetails[index].Stock_In_SKU_UOM_Qty = values.uom2_qty || 0;
//       updatedDetails[index].Stock_In_UOM3_Qty = values.uom3_qty || 0;
//     } else {
//       updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
//       updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
//       updatedDetails[index].Stock_out_UOM3_Qty = values.uom3_qty || 0;
//     }

//     updatedDetails[index] = OrderLogic.calculateItemTotals(updatedDetails[index]);
//     setDetails(updatedDetails);
//   };

//   // ✅ FIXED: Item selection with proper itemId passing
//   const handleItemSelection = (index: number, name: string, value: any) => {
//     console.log('🎯 Item selected for row', index, ':', { name, value });

//     const selectedItem = items.find((i: any) => i.id === value);
//     if (selectedItem) {
//       console.log('✅ Item found:', selectedItem.itemName, 'ID:', selectedItem.id);

//       const updatedDetails = [...details];
//       updatedDetails[index] = OrderLogic.setupItemDefaults(
//         updatedDetails[index], 
//         selectedItem, 
//         selectedAccount, 
//         isPurchase
//       );

//       setDetails(updatedDetails);

//       // Expand row to show UOM converter
//       setExpandedRows(prev => new Set([...prev, index]));

//       console.log('✅ Item setup complete for row', index, {
//         itemId: updatedDetails[index].Item_ID,
//         sale_unit: updatedDetails[index].sale_unit,
//         uom2_qty: updatedDetails[index].uom2_qty,
//         grossTotal: updatedDetails[index].grossTotal
//       });
//     } else {
//       console.error('❌ Item not found for value:', value);
//     }
//   };

//   // ✅ FIXED: addBulkItems with first row UOM2 fix
//   const addBulkItems = (selectedItems: any[]) => {
//     console.log('🔍 Bulk add started with', selectedItems.length, 'items');

//     const newDetails = OrderLogic.createBulkItems(selectedItems, details, selectedAccount, isPurchase);

//     console.log('✅ Bulk add result:', {
//       oldCount: details.length,
//       newCount: newDetails.length,
//       allRowsWithUOM2: newDetails.filter(d => d.sale_unit === 'uomTwo').length,
//       firstRowDetails: {
//         itemId: newDetails[0]?.Item_ID,
//         sale_unit: newDetails[0]?.sale_unit,
//         uom2_qty: newDetails[0]?.uom2_qty
//       }
//     });

//     setDetails(newDetails);

//     // Expand all rows
//     const firstRowEmpty = details.length === 1 && details[0].Item_ID === null;
//     if (firstRowEmpty) {
//       setExpandedRows(new Set(selectedItems.map((_, index) => index)));
//     } else {
//       const newIndices = selectedItems.map((_, index) => details.length + index);
//       setExpandedRows(prev => new Set([...prev, ...newIndices]));
//     }

//     setMessage({
//       type: 'success',
//       text: `Successfully added ${selectedItems.length} items - all with UOM2 selected`
//     });

//     setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//   };

//   const addDetailRow = () => {
//     const newRow = OrderLogic.createNewRow(details.length + 1, selectedAccount);
//     setDetails([...details, newRow]);
//   };

//   // ✅ FIXED: Submit with proper API handling
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const validation = OrderLogic.validateForm(master, details);
//     if (!validation.isValid) {
//       setMessage({ type: 'error', text: validation.message });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     // ✅ FIXED: Prepare order data in expected format
//     const orderData = {
//       master: {
//         Date: master.Date,
//         COA_ID: Number(master.COA_ID),
//         Next_Status: master.Next_Status,
//         orderType: orderType,
//         // Add additional master fields that backend might expect
//         userId: 1, // You might need to get this from auth
//         branchId: 1,
//         totalGross: details.reduce((sum, d) => sum + (d.grossTotal || 0), 0),
//         totalNet: details.reduce((sum, d) => sum + (d.netTotal || 0), 0)
//       },
//       details: details
//         .filter(d => d.Item_ID && d.uom2_qty > 0) // Only items with selection and quantity
//         .map(d => ({
//           Item_ID: Number(d.Item_ID),
//           Price: Number(d.Price),
//           // Stock In fields
//           Stock_In_UOM: d.Stock_In_UOM ? Number(d.Stock_In_UOM) : null,
//           Stock_In_UOM_Qty: Number(d.Stock_In_UOM_Qty),
//           Stock_SKU_Price: Number(d.Stock_SKU_Price),
//           Stock_In_SKU_UOM: d.Stock_In_SKU_UOM ? Number(d.Stock_In_SKU_UOM) : null,
//           Stock_In_SKU_UOM_Qty: Number(d.Stock_In_SKU_UOM_Qty),
//           Stock_In_UOM3_Qty: Number(d.Stock_In_UOM3_Qty),
//           // Stock Out fields  
//           Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
//           Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
//           Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
//           Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
//           Stock_out_UOM3_Qty: Number(d.Stock_out_UOM3_Qty),
//           // UOM fields
//           uom1_qty: Number(d.uom1_qty || 0),
//           uom2_qty: Number(d.uom2_qty || 0),
//           uom3_qty: Number(d.uom3_qty || 0),
//           sale_unit: d.sale_unit || 'uomTwo',
//           // Discount fields
//           Discount_A: Number(d.Discount_A || 0),
//           Discount_B: Number(d.Discount_B || 0),
//           Discount_C: Number(d.Discount_C || 0),
//           // Other fields
//           Goods: d.Goods || '',
//           Remarks: d.Remarks || '',
//           // Calculated fields
//           grossTotal: Number(d.grossTotal || 0),
//           netTotal: Number(d.netTotal || 0)
//         }))
//     };

//     console.log('📝 Submitting order data:', {
//       masterFields: Object.keys(orderData.master),
//       detailsCount: orderData.details.length,
//       sampleDetail: orderData.details[0],
//       totalAmount: orderData.details.reduce((sum, d) => sum + d.netTotal, 0)
//     });

//     try {
//       const result = await OrderAPI.createOrder(orderData, orderType);

//       setMessage({
//         type: result.success ? 'success' : 'error',
//         text: result.message
//       });

//       if (result.success) {
//         console.log('✅ Order created successfully, redirecting...');
//         setTimeout(() => {
//           router.push(`/order/${orderType}`);
//         }, 2000);
//       } else {
//         console.error('❌ Order creation failed:', result.message);
//       }
//     } catch (error) {
//       console.error('❌ Submit error:', error);
//       setMessage({ type: 'error', text: 'Failed to submit order' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper functions
//   const toggleRowExpanded = (rowIndex: number) => {
//     setExpandedRows(prev => {
//       const next = new Set(prev);
//       if (next.has(rowIndex)) {
//         next.delete(rowIndex);
//       } else {
//         next.add(rowIndex);
//       }
//       return next;
//     });
//   };

//   // Calculate totals
//   const grandTotals = details.reduce((acc, detail) => ({
//     grossTotal: acc.grossTotal + (detail.grossTotal || 0),
//     netTotal: acc.netTotal + (detail.netTotal || 0)
//   }), { grossTotal: 0, netTotal: 0 });

//   // Prepare options
//   const itemOptions = items.map((item: any) => ({
//     id: item.id,
//     label: item.itemName,
//     itemName: item.itemName,
//     sellingPrice: item.sellingPrice,
//     purchasePrice: item.purchasePricePKR,
//     itemClass1: item.itemClass1,
//     itemClass2: item.itemClass2,
//     itemClass3: item.itemClass3,
//     itemClass4: item.itemClass4
//   }));

//   const accountOptions = accounts.map((acc: any) => ({
//     id: acc.id,
//     label: acc.acName,
//     acName: acc.acName,
//     city: acc.city || '',
//     personName: acc.personName || ''
//   }));

//   const itemColumns = [
//     { key: 'itemName', label: 'Item Name', width: '40%' },
//     { key: 'sellingPrice', label: 'Selling Price', width: '30%' },
//     { key: 'purchasePrice', label: 'Purchase Price', width: '30%' }
//   ];

//   const accountColumns = [
//     { key: 'acName', label: 'Account Name', width: '50%' },
//     { key: 'city', label: 'City', width: '25%' },
//     { key: 'personName', label: 'Contact Person', width: '25%' }
//   ];

//   if (dataLoading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-gray-600 ml-4">
//               {isEditMode ? 'Loading order data...' : 'Loading data...'}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

//             {/* Header */}
//             <div className={`relative ${isPurchase ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'} text-white p-6`}>
//               <div className="relative flex items-center justify-between">
//                 <div>
//                   <h1 className="text-3xl font-bold mb-1">
//                     {isEditMode ? 'Edit' : 'Create'} {isPurchase ? 'Purchase Order' : 'Sales Order'}
//                   </h1>
//                   <p className="text-sm opacity-90">
//                     {isEditMode ? `Editing order ${orderId}` : 'Fill in the details to create your order'}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)}
//                   className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl hover:bg-opacity-30 transition-all duration-200"
//                 >
//                   ←
//                 </button>
//               </div>
//             </div>

//             {/* Message Alert */}
//             {message.text && (
//               <div className={`m-6 p-4 rounded-xl border-2 ${message.type === 'success'
//                 ? 'bg-green-50 border-green-300 text-green-800'
//                 : 'bg-red-50 border-red-300 text-red-800'
//                 }`}>
//                 <p className="font-medium">{message.text}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="p-6">
//               {/* Order Information */}
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl mb-8">
//                 <h2 className="text-lg font-bold text-gray-800 mb-4">Order Information</h2>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID</label>
//                     <input
//                       className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
//                       value={isEditMode ? orderId : "Auto Generated"}
//                       readOnly
//                       disabled
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Order Number</label>
//                     <input
//                       className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
//                       value="Auto Generated"
//                       readOnly
//                       disabled
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Order Date <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={master.Date}
//                         onChange={(e) => setMaster(prev => ({ ...prev, Date: e.target.value }))}
//                         className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                         style={{ color: 'transparent' }}
//                       />
//                       <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium pointer-events-none z-10">
//                         {master.Date ? OrderLogic.formatDateDisplay(master.Date) : 'Select date'}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Customer Selection */}
//                 <div className="mt-6">
//                   <SelectableTable
//                     label={isPurchase ? "Supplier" : "Customer"}
//                     name="COA_ID"
//                     value={master.COA_ID}
//                     onChange={(name, value) => setMaster(prev => ({ ...prev, [name]: value }))}
//                     options={accountOptions}
//                     placeholder={`Select ${isPurchase ? 'supplier' : 'customer'}`}
//                     required={true}
//                     displayKey="label"
//                     valueKey="id"
//                     columns={accountColumns}
//                     pageSize={10}
//                   />
//                 </div>
//               </div>

//               {/* Line Items */}
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
//                 <div className={`px-4 py-2 ${isPurchase ? 'bg-blue-50' : 'bg-green-50'} border-b`}>
//                   <h2 className="text-sm font-semibold text-gray-700">Line Items</h2>
//                 </div>

//                 <div>
//                   {details.map((detail, index) => (
//                     <div 
//                       key={`${detail.Line_Id}-${index}`} // ✅ Better key for re-renders
//                       className={`p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
//                     >
//                       <div className="grid grid-cols-12 gap-4 items-center">
//                         <div className="col-span-1">
//                           <div className={`w-6 h-6 rounded-full ${isPurchase ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center font-bold text-sm`}>
//                             {detail.Line_Id}
//                           </div>
//                         </div>

//                         <div className="col-span-3">
//                           <label className="text-xs text-gray-500 font-semibold mb-1 block">PRODUCT/ITEM *</label>
//                           <EnhancedSelectableTable
//                             label=""
//                             name="Item_ID"
//                             value={detail.Item_ID}
//                             onChange={(name, value) => handleItemSelection(index, name, value)}
//                             options={itemOptions}
//                             placeholder="select item"
//                             displayKey="label"
//                             valueKey="id"
//                             columns={itemColumns}
//                             pageSize={6}
//                             classData={classData}
//                           />
//                         </div>

//                         <div className="col-span-2">
//                           <label className="text-xs text-gray-500 font-semibold mb-1 block">UNIT PRICE</label>
//                           <NumberInput
//                             value={detail.Price}
//                             onChange={(value) => handleDetailChange(index, 'Price', value)}
//                             className="w-full px-2 py-1 border border-gray-200 rounded-lg"
//                             placeholder="0.00"
//                             step={0.01}
//                             min={0}
//                           />
//                         </div>

//                         <div className="col-span-4">
//                           {/* ✅ FIXED: Pass itemId correctly and force re-render when item changes */}
//                           <UomConverter
//                             key={`uom-${detail.Item_ID}-${index}`} // ✅ Force re-render when item changes
//                             itemId={detail.Item_ID} // ✅ This should be the actual item ID, not null
//                             onChange={(values) => handleUomChange(index, values)}
//                             initialValues={{
//                               uom1_qty: detail.uom1_qty?.toString() || '',
//                               uom2_qty: detail.uom2_qty?.toString() || '',
//                               uom3_qty: detail.uom3_qty?.toString() || '',
//                               sale_unit: detail.sale_unit || ''
//                             }}
//                             isPurchase={isPurchase}
//                           />
//                         </div>

//                         <div className="col-span-1 text-center">
//                           <button
//                             type="button"
//                             onClick={() => {
//                               if (details.length > 1) {
//                                 setDeleteIndex(index);
//                                 setShowDeleteConfirm(true);
//                               }
//                             }}
//                             disabled={details.length === 1}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:text-gray-300"
//                           >
//                             🗑️
//                           </button>
//                         </div>

//                         <div className="col-span-1 text-center">
//                           <button
//                             type="button"
//                             onClick={() => toggleRowExpanded(index)}
//                             className="w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
//                           >
//                             {expandedRows.has(index) ? '▲' : '▼'}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Expanded Section */}
//                       {expandedRows.has(index) && (
//                         <div className="mt-4 pt-4 border-t">
//                           <div className="grid grid-cols-12 gap-4">
//                             <div className="col-span-1"></div>

//                             <div className="col-span-5 flex gap-3">
//                               <div className="flex-1">
//                                 <label className="text-xs text-gray-500 mb-1 block">TIER A (%)</label>
//                                 <NumberInput
//                                   value={detail.Discount_A}
//                                   onChange={(value) => handleDetailChange(index, 'Discount_A', value)}
//                                   className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
//                                   placeholder="0"
//                                   suffix="%"
//                                   min={0}
//                                   max={100}
//                                 />
//                               </div>
//                               <div className="flex-1">
//                                 <label className="text-xs text-gray-500 mb-1 block">TIER B (%)</label>
//                                 <NumberInput
//                                   value={detail.Discount_B}
//                                   onChange={(value) => handleDetailChange(index, 'Discount_B', value)}
//                                   className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
//                                   placeholder="0"
//                                   suffix="%"
//                                   min={0}
//                                   max={100}
//                                 />
//                               </div>
//                               <div className="flex-1">
//                                 <label className="text-xs text-gray-500 mb-1 block">TIER C (%)</label>
//                                 <NumberInput
//                                   value={detail.Discount_C}
//                                   onChange={(value) => handleDetailChange(index, 'Discount_C', value)}
//                                   className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
//                                   placeholder="0"
//                                   suffix="%"
//                                   min={0}
//                                   max={100}
//                                 />
//                               </div>
//                             </div>

//                             <div className="col-span-3">
//                               <label className="text-xs text-gray-500 mb-1 block">NOTES</label>
//                               <input
//                                 type="text"
//                                 value={detail.Remarks}
//                                 onChange={(e) => handleDetailChange(index, 'Remarks', e.target.value)}
//                                 className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
//                                 placeholder="Notes"
//                               />
//                             </div>

//                             <div className="col-span-3 grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="text-xs text-gray-500 mb-1 block">GROSS</label>
//                                 <div className="bg-gray-100 px-2 py-1 rounded-lg text-right font-semibold">
//                                   <CurrencyFormat value={detail.grossTotal} showCurrency={false} />
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="text-xs text-gray-500 mb-1 block">NET</label>
//                                 <div className={`${isPurchase ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-lg text-right font-bold`}>
//                                   <CurrencyFormat value={detail.netTotal} showCurrency={false} />
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Summary */}
//                 <div className={`p-3 ${isPurchase ? 'bg-blue-100' : 'bg-green-100'}`}>
//                   <div className="flex justify-between items-center">
//                     <div className="text-lg font-bold">Order Summary</div>
//                     <div className="text-right">
//                       <div className="text-sm">Gross: ₨<CurrencyFormat value={grandTotals.grossTotal} showCurrency={false} /></div>
//                       <div className="text-lg font-bold text-green-600">Net: ₨<CurrencyFormat value={grandTotals.netTotal} showCurrency={false} /></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-between">
//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={addDetailRow}
//                     className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
//                   >
//                     Add Item
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowBulkSelector(true)}
//                     className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
//                   >
//                     Bulk Add Items
//                   </button>
//                 </div>

//                 <div className="flex gap-4">
//                   <button
//                     type="button"
//                     onClick={() => router.push(`/order/${orderType}`)}
//                     className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`px-8 py-3 text-white rounded-xl disabled:opacity-50 ${isPurchase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
//                   >
//                     {loading ? 'Processing...' : `${isEditMode ? 'Update' : 'Create'} Order`}
//                   </button>
//                 </div>
//               </div>

//               {/* Modals */}
//               {showBulkSelector && (
//                 <MultiSelectItemTable
//                   options={itemOptions}
//                   columns={itemColumns}
//                   onSelectionComplete={addBulkItems}
//                   onCancel={() => setShowBulkSelector(false)}
//                   isPurchase={isPurchase}
//                 />
//               )}

//               <ConfirmationModal
//                 isOpen={showDeleteConfirm}
//                 onClose={() => setShowDeleteConfirm(false)}
//                 onConfirm={() => {
//                   if (deleteIndex !== null && details.length > 1) {
//                     const filtered = details.filter((_, i) => i !== deleteIndex);
//                     const updated = filtered.map((item, i) => ({ ...item, Line_Id: i + 1 }));
//                     setDetails(updated);
//                   }
//                   setShowDeleteConfirm(false);
//                   setDeleteIndex(null);
//                 }}
//                 title="Delete Line Item"
//                 message="Are you sure?"
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 type="danger"
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnifiedOrderForm;



































































































































































'use client'

import React, { useState, useEffect, useCallback } from 'react';
import SelectableTable from './SelectableTable';
import ClassDropdown from './ClassDropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import UomConverter from './UomConverter';
import { useItemFilter } from './useItemFilter';
import EnhancedSelectableTable from './EnhancedSelectableTable';
import MultiSelectItemTable from './MultiSelectItemTable';

// ✅ Your requested components
// import { DateFormat } from './common/DateFormat';
import { CurrencyFormat, NumberInput } from './common/NumberFormat';
import { ConfirmationModal } from './common/ConfirmationModal';

// ✅ Import the logic files as requested
import { OrderAPI } from '../utils/OrderAPI';
import { OrderLogic, Detail } from '../utils/OrderLogic';

interface Item {
  id: number;
  itemName: string;
  itemClass1?: number | null;
  itemClass2?: number | null;
  itemClass3?: number | null;
  itemClass4?: number | null;
  sellingPrice?: string;
  purchasePricePKR?: string;
  [key: string]: any;
}

interface ClassFilters {
  itemClass1: number | null;
  itemClass2: number | null;
  itemClass3: number | null;
  itemClass4: number | null;
}

const UnifiedOrderForm = ({ orderType }: { orderType: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const isEditMode = Boolean(orderId);
  const isPurchase = orderType === 'purchase';

  // ✅ Master state - back to your original structure
  const [master, setMaster] = useState({
    Date: new Date().toISOString().split('T')[0],
    COA_ID: null,
    Next_Status: 'Incomplete'
  });

  // ✅ Details state using OrderLogic
  const [details, setDetails] = useState<Detail[]>([
    OrderLogic.createNewRow(1, null)
  ]);

  // Other state
  const [formValues, setFormValues] = useState<ClassFilters>({
    itemClass1: null,
    itemClass2: null,
    itemClass3: null,
    itemClass4: null,
  });

  const [classData, setClassData] = useState({
    class1: [],
    class2: [],
    class3: [],
    class4: []
  });

  const [expandedRows, setExpandedRows] = useState(new Set<number>());
  const [items, setItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [showBulkSelector, setShowBulkSelector] = useState(false);
  const [uoms, setUoms] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [debug, setDebug] = useState({});

  // Modal state
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // ✅ Item filtering
  const {
    filteredItems,
    activeFilterCount,
    activeFilters,
    totalItems,
    filteredCount
  } = useItemFilter({
    items: items,
    classFilters: formValues
  });

  // ✅ FIXED: Load all data including order data for edit mode
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setDataLoading(true);

        // Load class data
        const classPromises = [1, 2, 3, 4].map(id =>
          fetch(`http://${window.location.hostname}:4000/api/z-classes/get-by-class-id/${id}`)
            .then(res => res.json())
        );
        const classResults = await Promise.all(classPromises);
        setClassData({
          class1: classResults[0]?.getByclassID || [],
          class2: classResults[1]?.getByclassID || [],
          class3: classResults[2]?.getByclassID || [],
          class4: classResults[3]?.getByclassID || []
        });

        // Load master data using OrderAPI
        const { items, accounts, uoms } = await OrderAPI.fetchAllData(orderType);
        setItems(items);
        setAllItems(items);
        setAccounts(accounts);
        setUoms(uoms);

        console.log('✅ Master data loaded:', {
          items: items.length,
          accounts: accounts.length,
          uoms: uoms.length
        });

        // ✅ FIXED: Load order data for edit mode
        if (isEditMode && orderId && items.length > 0) {
          console.log('📋 Loading order for edit mode, ID:', orderId);

          const orderResult = await OrderAPI.fetchOrder(orderId);

          if (orderResult.success && orderResult.data) {
            const order = orderResult.data;
            console.log('✅ Order data loaded:', order);

            // Set master data
            setMaster({
              Date: order.Date ? order.Date.split('T')[0] : new Date().toISOString().split('T')[0],
              COA_ID: order.COA_ID,
              Next_Status: order.Next_Status || 'Incomplete'
            });
            console.warn(' ths is the master data ', master)
            // Set details data with proper calculation
            if (order.details && order.details.length > 0) {
              const loadedDetails = order.details.map((detail: any, idx: number) => {
                const detailRow: Detail = {
                  Line_Id: idx + 1,
                  Item_ID: detail.Item_ID,
                  Price: parseFloat(detail.Price) || 0,
                  Stock_In_UOM: detail.Stock_In_UOM,
                  Stock_In_UOM_Qty: parseFloat(detail.Stock_In_UOM_Qty) || 0,
                  Stock_SKU_Price: parseFloat(detail.Stock_SKU_Price) || 0,
                  Stock_In_SKU_UOM: detail.Stock_In_SKU_UOM,
                  Stock_In_SKU_UOM_Qty: parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0,
                  Stock_In_UOM3_Qty: parseFloat(detail.Stock_In_UOM3_Qty) || 0,
                  Stock_out_UOM: detail.Stock_out_UOM,
                  Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
                  Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM,
                  Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
                  Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
                  uom1_qty: parseFloat(detail.uom1_qty) || 0,
                  uom2_qty: parseFloat(detail.uom2_qty) || 0,
                  uom3_qty: parseFloat(detail.uom3_qty) || 0,
                  sale_unit: detail.sale_unit || 'uomThree',
                  Discount_A: parseFloat(detail.Discount_A) || 0,
                  Discount_B: parseFloat(detail.Discount_B) || 0,
                  Discount_C: parseFloat(detail.Discount_C) || 0,
                  Goods: detail.Goods || '',
                  Remarks: detail.Remarks || '',
                  grossTotal: 0,
                  netTotal: 0
                };

                // Calculate totals using OrderLogic
                return OrderLogic.calculateItemTotals(detailRow);
              });

              setDetails(loadedDetails);
              setExpandedRows(new Set(loadedDetails.map((_, index) => index)));

              console.log('✅ Order details loaded and calculated:', loadedDetails.length, 'items');
            }
          } else {
            console.error('❌ Failed to load order:', orderResult.message);
            setMessage({ type: 'error', text: orderResult.message });
          }
        }

      } catch (error) {
        console.error('Error loading data:', error);
        setMessage({ type: 'error', text: 'Failed to load application data' });
      } finally {
        setDataLoading(false);
      }
    };

    loadAllData();
  }, [orderType, isEditMode, orderId]);

  // ✅ Account selection effect
  useEffect(() => {
    if (master.COA_ID) {
      const account = accounts.find((acc: any) => acc.id === master.COA_ID);
      console.log('Selected Account Full Data:', account);
      setSelectedAccount(account || null);

      // Apply discount values to all items when account changes
      if (account) {
        const discountA = parseFloat(account.discountA) || 0;
        const discountB = parseFloat(account.discountB) || 0;
        const discountC = parseFloat(account.discountC) || 0;

        console.log('Applying Discounts to All Rows:', { discountA, discountB, discountC });

        setDetails(prevDetails => prevDetails.map(detail => {
          const updatedDetail = {
            ...detail,
            Discount_A: discountA,
            Discount_B: discountB,
            Discount_C: discountC,
          };
          return OrderLogic.calculateItemTotals(updatedDetail);
        }));
      }
    } else {
      setSelectedAccount(null);
    }
  }, [master.COA_ID, accounts]);

  // ✅ FIXED: handleDetailChange using OrderLogic
  const handleDetailChange = (index: number, field: string, value: any) => {
    const updatedDetails = [...details];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value
    };

    // Auto-calculate totals when relevant fields change
    if (['Price', 'uom2_qty', 'Discount_A', 'Discount_B', 'Discount_C'].includes(field)) {
      updatedDetails[index] = OrderLogic.calculateItemTotals(updatedDetails[index]);
    }

    setDetails(updatedDetails);
  };

  // ✅ FIXED: handleUomChange with proper calculation
  const handleUomChange = (index: number, values: any) => {
    console.log('🔄 UOM change for row', index, ':', values);

    const updatedDetails = [...details];

    // Store all UOM quantities
    updatedDetails[index].uom1_qty = values.uom1_qty || 0;
    updatedDetails[index].uom2_qty = values.uom2_qty || 0;
    updatedDetails[index].uom3_qty = values.uom3_qty || 0;
    updatedDetails[index].sale_unit = values.sale_unit || '';

    // Update stock fields based on purchase/sales
    if (isPurchase) {
      updatedDetails[index].Stock_In_UOM_Qty = values.uom1_qty || 0;
      updatedDetails[index].Stock_In_SKU_UOM_Qty = values.uom2_qty || 0;
      updatedDetails[index].Stock_In_UOM3_Qty = values.uom3_qty || 0;
    } else {
      updatedDetails[index].Stock_out_UOM_Qty = values.uom1_qty || 0;
      updatedDetails[index].Stock_out_SKU_UOM_Qty = values.uom2_qty || 0;
      updatedDetails[index].Stock_out_UOM3_Qty = values.uom3_qty || 0;
    }

    // ✅ ALWAYS calculate based on uom2_qty using OrderLogic
    updatedDetails[index] = OrderLogic.calculateItemTotals(updatedDetails[index]);
    setDetails(updatedDetails);
  };

  // ✅ FIXED: Item selection handler (fixes manual selection UomConverter issue)
  const handleItemSelection = (name: string, value: any, index?: number) => {
    // ✅ If EnhancedSelectableTable doesn't provide index, we need to find it
    let rowIndex = index;
    if (rowIndex === undefined) {
      // Find which row this belongs to by looking at the name pattern or other method
      // For now, let's extract it from the calling context
      console.warn('⚠️ Index not provided, using fallback method');
      // This is a fallback - ideally the component should provide the index
    }

    console.log('🎯 Item selection:', { name, value, rowIndex });

    if (value && rowIndex !== undefined) {
      const selectedItem = items.find((i: any) => i.id === value);
      if (selectedItem) {
        console.log('✅ Item found:', selectedItem.itemName, 'ID:', selectedItem.id);

        const updatedDetails = [...details];
        updatedDetails[rowIndex] = OrderLogic.setupItemDefaults(
          updatedDetails[rowIndex],
          selectedItem,
          selectedAccount,
          isPurchase
        );

        setDetails(updatedDetails);
        setExpandedRows(prev => new Set([...prev, rowIndex]));

        console.log('✅ Manual item setup complete for row', rowIndex);
      } else {
        console.error('❌ Item not found for value:', value);
      }
    } else {
      console.error('❌ Invalid parameters:', { name, value, rowIndex });
    }
  };

  // ✅ BETTER FIX: Create wrapper function for each row
  const createItemSelectionHandler = (rowIndex: number) => {
    return (name: string, value: any) => {
      console.log('🎯 Item selection for row', rowIndex, ':', { name, value });

      if (!value) {
        console.error('❌ No value provided for item selection');
        return;
      }

      const selectedItem = items.find((i: any) => i.id === value);
      if (selectedItem) {
        console.log('✅ Item found:', selectedItem.itemName, 'ID:', selectedItem.id);

        const updatedDetails = [...details];
        updatedDetails[rowIndex] = OrderLogic.setupItemDefaults(
          updatedDetails[rowIndex],
          selectedItem,
          selectedAccount,
          isPurchase
        );

        setDetails(updatedDetails);

        // Force UomConverter re-render and expand
        setTimeout(() => {
          setExpandedRows(prev => new Set([...prev, rowIndex]));
        }, 100);

        console.log('✅ Manual item setup complete:', {
          row: rowIndex,
          itemId: updatedDetails[rowIndex].Item_ID,
          sale_unit: updatedDetails[rowIndex].sale_unit,
          uom2_qty: updatedDetails[rowIndex].uom2_qty,
          grossTotal: updatedDetails[rowIndex].grossTotal
        });
      } else {
        console.error('❌ Item not found for value:', value, 'Available items:', items.length);
      }
    };
  };


  // ✅ FIXED: handleSubmit with correct backend data format
  // (Duplicate handleSubmit function removed. Only one definition should exist in the file.)



  // ✅ FIXED: addBulkItems using OrderLogic (fixes first row UOM2 issue)
  const addBulkItems = (selectedItems: any[]) => {
    console.log('🔍 Bulk add started with', selectedItems.length, 'items');

    if (!selectedItems || selectedItems.length === 0) {
      console.error('❌ No items provided for bulk add');
      return;
    }

    const newDetails = OrderLogic.createBulkItems(selectedItems, details, selectedAccount, isPurchase);

    console.log('✅ Bulk add result - checking first row:', {
      totalRows: newDetails.length,
      firstRowItemId: newDetails[0]?.Item_ID,
      firstRowSaleUnit: newDetails[0]?.sale_unit,
      firstRowUom2Qty: newDetails[0]?.uom2_qty,
      firstRowGrossTotal: newDetails[0]?.grossTotal,
      allRowsWithUOM2: newDetails.filter(d => d.sale_unit === 'uomTwo').length
    });

    setDetails(newDetails);

    // Expand all new rows
    const firstRowEmpty = details.length === 1 && details[0].Item_ID === null;
    if (firstRowEmpty) {
      setExpandedRows(new Set(selectedItems.map((_, index) => index)));
    } else {
      const newIndices = selectedItems.map((_, index) => details.length + index);
      setExpandedRows(prev => new Set([...prev, ...newIndices]));
    }

    setMessage({
      type: 'success',
      text: `Successfully added ${selectedItems.length} items - ALL with UOM2 selected including first row`
    });

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const addDetailRow = () => {
    const newRow = OrderLogic.createNewRow(details.length + 1, selectedAccount);
    setDetails([...details, newRow]);
  };

  const removeDetailRow = (index: number) => {
    if (details.length > 1) {
      setDeleteIndex(index);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    if (deleteIndex !== null && details.length > 1) {
      const filtered = details.filter((_, i) => i !== deleteIndex);
      const updated = filtered.map((item, i) => ({ ...item, Line_Id: i + 1 }));
      setDetails(updated);

      // Update expanded rows
      const newExpandedRows = new Set<number>();
      expandedRows.forEach(expandedIndex => {
        if (expandedIndex < deleteIndex) {
          newExpandedRows.add(expandedIndex);
        } else if (expandedIndex > deleteIndex) {
          newExpandedRows.add(expandedIndex - 1);
        }
      });
      setExpandedRows(newExpandedRows);
    }
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  // ✅ ADDED: Fetch All COA function
  const fetchAllCOA = async () => {
    try {
      const allAccounts = await OrderAPI.fetchAllCOA();
      setAccounts(allAccounts);
      console.log('✅ All COA accounts loaded:', allAccounts.length);
    } catch (error) {
      console.error('Error fetching all COA:', error);
    }
  };

  const fetchAccounts = async (type: string) => {
    try {
      const { accounts } = await OrderAPI.fetchAllData(type);
      setAccounts(accounts);
      console.log('✅ Filtered accounts loaded:', accounts.length);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const toggleRowExpanded = (rowIndex: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      return next;
    });
  };

  const handleMasterChange = (name: string, value: any) => {
    setMaster(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = OrderLogic.validateForm(master, details);
    if (!validation.isValid) {
      setMessage({ type: 'error', text: validation.message });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    // ✅ FIXED: Prepare data in the format YOUR BACKEND expects
    const orderData = {
      master: {
        Date: master.Date,
        COA_ID: Number(master.COA_ID),
        Next_Status: master.Next_Status,
        // ✅ CRITICAL: Add the fields your backend needs
        Stock_Type_ID: isPurchase ? 11 : 12, // ✅ This was causing the error!
        sales_type_Id: isPurchase ? 11 : 12,  // ✅ Your backend expects this
        orderType: orderType // Keep this for frontend reference
      },
      details: details
        .filter(d => d.Item_ID && d.uom2_qty > 0)
        .map((d, idx) => ({
          Line_Id: idx + 1,
          Item_ID: Number(d.Item_ID),
          Price: Number(d.Price),
          Stock_In_UOM: d.Stock_In_UOM ? Number(d.Stock_In_UOM) : null,
          Stock_In_UOM_Qty: Number(d.Stock_In_UOM_Qty),
          Stock_SKU_Price: Number(d.Stock_SKU_Price),
          Stock_In_SKU_UOM: d.Stock_In_SKU_UOM ? Number(d.Stock_In_SKU_UOM) : null,
          Stock_In_SKU_UOM_Qty: Number(d.Stock_In_SKU_UOM_Qty),
          Stock_In_UOM3_Qty: Number(d.Stock_In_UOM3_Qty),
          Stock_out_UOM: d.Stock_out_UOM ? Number(d.Stock_out_UOM) : null,
          Stock_out_UOM_Qty: Number(d.Stock_out_UOM_Qty),
          Stock_out_SKU_UOM: d.Stock_out_SKU_UOM ? Number(d.Stock_out_SKU_UOM) : null,
          Stock_out_SKU_UOM_Qty: Number(d.Stock_out_SKU_UOM_Qty),
          Stock_out_UOM3_Qty: Number(d.Stock_out_UOM3_Qty),
          // ✅ CRITICAL: UOM fields your backend now expects
          uom1_qty: Number(d.uom1_qty || 0),
          uom2_qty: Number(d.uom2_qty || 0),
          uom3_qty: Number(d.uom3_qty || 0),
          sale_unit: d.sale_unit || 'uomTwo',
          Discount_A: Number(d.Discount_A || 0),
          Discount_B: Number(d.Discount_B || 0),
          Discount_C: Number(d.Discount_C || 0),
          Goods: d.Goods || '',
          Remarks: d.Remarks || ''
        }))
    };

    console.log('📝 Final order data for YOUR backend:', {
      Stock_Type_ID: orderData.master.Stock_Type_ID,
      sales_type_Id: orderData.master.sales_type_Id,
      detailsCount: orderData.details.length,
      allHaveUOM2: orderData.details.every(d => d.sale_unit === 'uomTwo')
    });

    try {
      const result = isEditMode
        ? await OrderAPI.updateOrder(orderData, orderId!)
        : await OrderAPI.createOrder(orderData, orderType);

      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });

      if (result.success) {
        setTimeout(() => router.push(`/order/${orderType}`), 2000);
      }
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      setMessage({ type: 'error', text: 'Failed to submit order' });
    } finally {
      setLoading(false);
    }
  };








  const handleClassChange = (name: string, value: number | null) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFormValues({
      itemClass1: null,
      itemClass2: null,
      itemClass3: null,
      itemClass4: null,
    });
  };

  // Calculate grand totals
  const grandTotals = details.reduce((acc, detail) => ({
    grossTotal: acc.grossTotal + (detail.grossTotal || 0),
    netTotal: acc.netTotal + (detail.netTotal || 0)
  }), { grossTotal: 0, netTotal: 0 });

  // Prepare options for components
  const itemOptions = items.map(item => ({
    id: item.id,
    label: item.itemName,
    itemName: item.itemName,
    sellingPrice: item.sellingPrice,
    purchasePrice: item.purchasePricePKR,
    itemClass1: item.itemClass1,
    itemClass2: item.itemClass2,
    itemClass3: item.itemClass3,
    itemClass4: item.itemClass4
  }));

  const accountOptions = accounts.map((acc: any) => ({
    id: acc.id,
    label: acc.acName,
    acName: acc.acName,
    city: acc.city || '',
    personName: acc.personName || ''
  }));

  const itemColumns = [
    { key: 'itemName', label: 'Item Name', width: '40%' },
    { key: 'sellingPrice', label: 'Selling Price', width: '30%' },
    { key: 'purchasePrice', label: 'Purchase Price', width: '30%' }
  ];

  const accountColumns = [
    { key: 'acName', label: 'Account Name', width: '50%' },
    { key: 'city', label: 'City', width: '25%' },
    { key: 'personName', label: 'Contact Person', width: '25%' }
  ];

  if (dataLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isEditMode ? `Loading order ${orderId} for editing...` : 'Loading application data...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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
                    {isEditMode
                      ? `Editing order ${orderId} - Make changes and click update`
                      : 'Fill in the details below to create your order'
                    }
                  </p>
                  {selectedAccount && (
                    <p className="text-sm opacity-75 mt-1">
                      Customer: {selectedAccount.acName} | Items: {details.filter(d => d.Item_ID).length}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/order/${isPurchase ? 'purchase' : 'sales'}`)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl hover:bg-opacity-30 transition-all duration-200 text-black"
                  title="Go Back"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Enhanced Message Alert */}
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

                {/* ✅ FIXED: Back to 3 columns (no Stock Type field) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Order ID
                        <span className="ml-2 text-xs text-gray-500 font-normal">(Auto Generated)</span>
                      </span>
                    </label>
                    <input
                      className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
                      value={isEditMode ? orderId : "Auto Generated"}
                      readOnly
                      disabled
                      title="This field is automatically generated by the system"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Order Number
                        <span className="ml-2 text-xs text-gray-500 font-normal">(Auto Generated)</span>
                      </span>
                    </label>
                    <input
                      className="w-full px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl cursor-not-allowed"
                      value="Auto Generated"
                      readOnly
                      disabled
                      title="This field is automatically generated by the system"
                    />
                  </div>

                  {/* ✅ UPDATED: Date input with custom format using OrderLogic */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        Order Date <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs text-gray-500 font-normal">(Required)</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={master.Date}
                        onChange={(e) => handleMasterChange('Date', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        style={{ color: 'transparent' }}
                        title="Select the date for this order"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium pointer-events-none z-10">
                        {master.Date ? OrderLogic.formatDateDisplay(master.Date) : 'Select date'}
                      </div>

                    </div>


                  </div>
                  {/* Customer/Supplier Selection */}
                  <div>
                    <div className="">
                      <div className="mt-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {/* <span className="text-sm font-medium text-gray-700">Account Filter:</span> */}
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="accountFilter"
                              checked={!showAllAccounts}
                              onChange={() => {
                                setShowAllAccounts(false);
                                fetchAccounts(orderType);
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">
                              {isPurchase ? 'Suppliers' : 'Customers'}
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="accountFilter"
                              checked={showAllAccounts}
                              onChange={() => {
                                setShowAllAccounts(true);
                                fetchAllCOA();
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm"> All COA</span>
                          </label>
                        </div>
                        <SelectableTable
                          // label={isPurchase ? "Supplier" : "Customer"}
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

                      {/* ✅ ADDED: Show All COA Radio Buttons */}

                    </div>
                  </div>
                </div>


              </div>

              {/* Order Items Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-1">
                <div className={`px-4 py-2 ${isPurchase ? 'bg-blue-50' : 'bg-green-50'} border-b ${isPurchase ? 'border-blue-200' : 'border-green-200'}`}>
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Line Items ({details.filter(d => d.Item_ID).length} items selected)
                  </h2>
                </div>

                <div className="">
                  {details.map((detail, index) => (
                    <div
                      key={`row-${detail.Line_Id}-${detail.Item_ID || 'empty'}-${index}`}
                      className={`group hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200/75'
                        }`}
                    >
                      <div className="px-4 py-2">
                        <div className="flex flex-wrap justify-between gap-1 items-center">
                          {/* Line Number */}
                          <div className="col-span-1">
                            <label className="text-[11px] text-gray-500 font-semibold mb-1 block">LINE #</label>
                            <div className={`w-6 h-6 rounded-full ${isPurchase ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center font-bold text-sm`}>
                              {detail.Line_Id}
                            </div>
                          </div>

                          {/* Item Selection */}
                          <div className="col-span-3 w-50">
                            <label className="text-xs text-gray-500 font-semibold mb-1 block">
                              {/* PRODUCT/ITEM * */}
                              <span className="text-xs text-gray-400 ml-1">(select item)</span>
                            </label>

                            <EnhancedSelectableTable
                              label=""
                              name="Item_ID"
                              value={detail.Item_ID}
                              onChange={createItemSelectionHandler(index)} // ✅ Use wrapper with index
                              options={itemOptions}
                              placeholder="select item"
                              displayKey="label"
                              valueKey="id"
                              columns={itemColumns}
                              pageSize={6}
                              classData={classData}
                            // className="w-10 h-20 border"
                            />
                          </div>

                          {/* Unit Price */}
                          <div className="col-span-2 w-22">
                            <label className="text-gray-500 w-22 font-semibold mb-1  text-[11px] block">UNIT PRICE</label>
                            <div className="relative">
                              <NumberInput
                                value={detail.Price}
                                onChange={(value) => handleDetailChange(index, 'Price', value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    toggleRowExpanded(index);
                                  }
                                }}
                                className="w-22 h-10 px-2 py-0.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="0.00"
                                step={0.01}
                                min={0}
                              />
                            </div>
                          </div>

                          {/* UOM Converter */}
                          <div className="col-span-4">
                            <div className="">
                              {/* ✅ FIXED: Force UomConverter re-render with proper itemId */}
                              <UomConverter
                                key={`uom-${detail.Item_ID || 'empty'}-${index}`}
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


                          <div className="col-span-5">
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block font-medium">TIER A (%)</label>
                                <div className="relative">
                                  <NumberInput
                                    value={detail.Discount_A}
                                    onChange={(value) => handleDetailChange(index, 'Discount_A', value)}
                                    className="w-20 h-10 px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    suffix="%"
                                    min={0}
                                    max={100}
                                    step={0.01}
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block font-medium">TIER B (%)</label>
                                <div className="relative">
                                  <NumberInput
                                    value={detail.Discount_B}
                                    onChange={(value) => handleDetailChange(index, 'Discount_B', value)}
                                    className="w-20 h-10 px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    suffix="%"
                                    min={0}
                                    max={100}
                                    step={0.01}
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block font-medium">TIER C (%)</label>
                                <div className="relative">
                                  <NumberInput
                                    value={detail.Discount_C}
                                    onChange={(value) => handleDetailChange(index, 'Discount_C', value)}
                                    className="w-20 h-10 px-2 py-1 pr-8 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    suffix="%"
                                    min={0}
                                    max={100}
                                    step={0.01}
                                  />
                                </div>
                              </div>
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

                          {/* Expand/Collapse */}
                          <div className="flex items-center justify-end mb-2  mt-6">
                            <button
                              type="button"
                              onClick={() => toggleRowExpanded(index)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                              aria-label={expandedRows.has(index) ? 'Collapse' : 'Expand'}
                              title={expandedRows.has(index) ? 'Collapse details' : 'Expand details'}
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

                      {/* Expanded Details Section */}
                      <div className="px-4">
                        {expandedRows.has(index) && (
                          <div className=" w-70 grid grid-cols-12 gap-4 py-2 bg-white rounded-lg border-gray-200 mx-2 mb-2 shadow-sm">
                            <div className="col-span-1"></div>


                            {/* Totals Display */}
                            <div className="col-span-3 grid grid-cols-2 gap-4 w-60">
                              <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">GROSS TOTAL</label>
                                <div className="bg-gray-100 px-2 py-1 rounded-lg text-right font-semibold text-gray-700">
                                  <CurrencyFormat value={detail.grossTotal} showCurrency={false} />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 font-semibold mb-1 block">NET TOTAL</label>
                                <div className={`${isPurchase ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} px-2 py-1 rounded-lg text-right font-bold`}>
                                  <CurrencyFormat value={detail.netTotal} showCurrency={false} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className={`p-3 ${isPurchase ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-gradient-to-r from-green-100 to-green-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-800">
                      Order Summary
                      <span className="text-sm font-normal ml-2 text-gray-600">
                        ({details.filter(d => d.Item_ID).length} items)
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Gross Total:</span>
                        <span className="ml-2 font-bold text-gray-800">
                          ₨ <CurrencyFormat value={grandTotals.grossTotal} showCurrency={false} />
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Total Discount:</span>
                        <span className="ml-2 font-bold text-red-600">
                          ₨ <CurrencyFormat value={grandTotals.grossTotal - grandTotals.netTotal} showCurrency={false} />
                        </span>
                      </div>
                      <div className={`p-2 px-4 ${isPurchase ? 'bg-blue-600' : 'bg-green-600'} text-white rounded-xl flex gap-3 font-bold text-lg shadow-lg`}>
                        <span className="text- font-normal block">Net Total</span>
                        <CurrencyFormat value={grandTotals.netTotal} showCurrency={false} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={addDetailRow}
                    className="p-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 flex items-center shadow-lg transform hover:scale-105 transition-all duration-200"
                    title="Add a single line item to the order"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Single Item
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      console.log('🔍 Opening bulk selector with', items.length, 'available items');
                      setShowBulkSelector(true);
                    }}
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
                    title="Cancel and go back to order list"
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
                    title={loading ? "Processing your order..." : `${isEditMode ? 'Update' : 'Create'} this order`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isEditMode ? 'Update Order' : 'Create Order'}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Bulk Item Selector Modal */}
              {showBulkSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800">
                        Select Multiple Items for Bulk Add
                      </h3>
                      <p className="text-sm text-gray-600">
                        Choose multiple items to add to your order at once
                      </p>
                    </div>

                    <MultiSelectItemTable
                      options={itemOptions}
                      columns={itemColumns}
                      onSelectionComplete={(selectedItems) => {
                        console.log('🔍 Bulk selection completed:', selectedItems.length, 'items selected');
                        addBulkItems(selectedItems);
                        setShowBulkSelector(false);
                      }}
                      onCancel={() => {
                        console.log('❌ Bulk selection cancelled');
                        setShowBulkSelector(false);
                      }}
                      isPurchase={isPurchase}
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Confirmation Modal */}
              <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Line Item"
                message="Are you sure you want to delete this line item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedOrderForm;
