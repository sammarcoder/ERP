
// // components/orders/OrderDetails.tsx - COMPLETE FINAL VERSION
// 'use client'
// import React, { useState, useMemo, useCallback } from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { MultiSelectItemTable, ExtractedItemData } from '@/components/common/items/MultiSelectItemTable'
// import UomConverter from '@/components/common/items/UomConverter'
// import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

// interface OrderHeaderData {
//   date: string
//   COA_ID: string | number
//   Transporter_ID: string | number
//   Stock_Type_ID: number
//   discountA: number
//   discountB: number
//   discountC: number
//   freight_crt: number
//   labour_crt: number
//   bility_expense: number
//   other_expense: number
//   foreign_currency?: string
//   sub_customer?: string
//   sub_city?: string
//   str?: number
// }

// interface OrderLineItem {
//   lineNo: number
//   Item_ID: number
//   itemName: string
//   unitPrice: number

//   // UOM Data
//   uom1_qty: number
//   uom2_qty: number
//   uom3_qty: number
//   sale_unit: number
//   Uom_Id: number

//   // Discount Fields
//   Discount_A: number | string
//   Discount_B: number | string
//   Discount_C: number | string

//   // Calculated fields (UI only)
//   grossTotal: number
//   totalDiscount: number
//   netTotal: number

//   // Reference data
//   extractedUomData: ExtractedItemData['uomData']
//   originalItem: ExtractedItemData
//   isExpanded?: boolean
// }

// interface OrderDetailsProps {
//   headerData: OrderHeaderData
//   isPurchase?: boolean
//   onChange?: (orderDetails: OrderLineItem[]) => void
// }

// export const OrderDetails: React.FC<OrderDetailsProps> = ({
//   headerData,
//   isPurchase = false,
//   onChange
// }) => {
//   const [lineItems, setLineItems] = useState<OrderLineItem[]>([])
//   const [showItemModal, setShowItemModal] = useState(false)
//   const [nextLineNo, setNextLineNo] = useState(1)

//   // Get already added item IDs for duplicate prevention
//   const alreadyAddedItemIds = useMemo(() => lineItems.map(item => item.Item_ID), [lineItems])

//   // ✅ Open modal handler
//   const handleOpenModal = useCallback(() => {
//     console.log('🔓 Opening item selection modal')
//     setShowItemModal(true)
//   }, [])

//   // ✅ Close modal handler
//   const handleCloseModal = useCallback(() => {
//     console.log('❌ Closing item selection modal')
//     setShowItemModal(false)
//   }, [])

//   // ✅ Calculate line totals
//   // const calculateLineTotal = useCallback((lineItem: OrderLineItem): OrderLineItem => {
//   //   const quantity = lineItem.uom3_qty || lineItem.uom2_qty || lineItem.uom1_qty || 0
//   //   // const grossTotal = quantity * lineItem.unitPrice
//   //   const grossTotal = quantity * (typeof lineItem.unitPrice === 'string' ? parseFloat(lineItem.unitPrice) || 0 : lineItem.unitPrice)


//   //   const discountPercent = lineItem.Discount_A + lineItem.Discount_B + lineItem.Discount_C
//   //   const totalDiscount = (grossTotal * discountPercent) / 100
//   //   const netTotal = grossTotal - totalDiscount

//   //   return {
//   //     ...lineItem,
//   //     grossTotal,
//   //     totalDiscount,
//   //     netTotal
//   //   }
//   // }, [])

//   const calculateLineTotal = useCallback((lineItem: OrderLineItem): OrderLineItem => {
//     const quantity = lineItem.uom3_qty || lineItem.uom2_qty || lineItem.uom1_qty || 0
//     const grossTotal = quantity * (typeof lineItem.unitPrice === 'string' ? parseFloat(lineItem.unitPrice) || 0 : lineItem.unitPrice)

//     // ✅ Handle string/empty discount values
//     const discountA = typeof lineItem.Discount_A === 'string' ? parseFloat(lineItem.Discount_A) || 0 : lineItem.Discount_A
//     const discountB = typeof lineItem.Discount_B === 'string' ? parseFloat(lineItem.Discount_B) || 0 : lineItem.Discount_B
//     const discountC = typeof lineItem.Discount_C === 'string' ? parseFloat(lineItem.Discount_C) || 0 : lineItem.Discount_C

//     const discountPercent = discountA + discountB + discountC
//     const totalDiscount = (grossTotal * discountPercent) / 100
//     const netTotal = grossTotal - totalDiscount

//     return {
//       ...lineItem,
//       grossTotal,
//       totalDiscount,
//       netTotal
//     }
//   }, [])



//   // ✅ Handle bulk item selection
//   const handleBulkItemSelection = useCallback((selectedItems: ExtractedItemData[]) => {
//     console.group('📦 Adding Bulk Items to Order')
//     console.log('Selected Items:', selectedItems.length)
//     console.log('Header Discounts:', {
//       discountA: headerData.discountA,
//       discountB: headerData.discountB,
//       discountC: headerData.discountC
//     })

//     const newLineItems: OrderLineItem[] = selectedItems.map((item, index) => {
//       const lineNo = nextLineNo + index

//       const newLineItem: OrderLineItem = {
//         lineNo,
//         Item_ID: item.id,
//         itemName: item.itemName,
//         unitPrice: isPurchase ? item.purchasePricePKR : item.sellingPrice,

//         // Initialize UOM values - empty by default
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 3, // Default to tertiary
//         Uom_Id: item.uomData.tertiary?.id || item.uomData.primary.id,

//         // Apply header discounts as defaults
//         Discount_A: headerData.discountA || 0,
//         Discount_B: headerData.discountB || 0,
//         Discount_C: headerData.discountC || 0,

//         // Initial calculations
//         grossTotal: 0,
//         totalDiscount: 0,
//         netTotal: 0,

//         // Store UOM data for converter
//         extractedUomData: item.uomData,
//         originalItem: item,
//         isExpanded: false
//       }

//       return calculateLineTotal(newLineItem)
//     })

//     console.log('New Line Items Created:', newLineItems.length)
//     console.groupEnd()

//     setLineItems(prev => [...prev, ...newLineItems])
//     setNextLineNo(prev => prev + selectedItems.length)

//     // ✅ Modal stays open - don't close here
//     console.log('✅ Items added! Modal remains open for more selections.')
//   }, [nextLineNo, headerData, isPurchase, calculateLineTotal])

//   // ✅ Handle UOM converter changes
//   const handleUomChange = useCallback((lineIndex: number, uomData: any) => {
//     console.log(`🔄 UOM changed for line ${lineIndex}:`, uomData)

//     setLineItems(prev => prev.map((item, index) => {
//       if (index === lineIndex) {
//         const updatedItem = {
//           ...item,
//           uom1_qty: uomData.uom1_qty || 0,
//           uom2_qty: uomData.uom2_qty || 0,
//           uom3_qty: uomData.uom3_qty || 0,
//           sale_unit: uomData.sale_unit || 3,
//           Uom_Id: uomData.Uom_Id || item.Uom_Id
//         }
//         return calculateLineTotal(updatedItem)
//       }
//       return item
//     }))
//   }, [calculateLineTotal])

//   // ✅ Handle unit price change
//   const handleUnitPriceChange = useCallback((lineIndex: number, newPrice: number) => {
//     setLineItems(prev => prev.map((item, index) => {
//       if (index === lineIndex) {
//         const updatedItem = { ...item, unitPrice: newPrice }
//         return calculateLineTotal(updatedItem)
//       }
//       return item
//     }))
//   }, [calculateLineTotal])

//   // ✅ Handle discount changes
//   const handleDiscountChange = useCallback((lineIndex: number, discountType: 'A' | 'B' | 'C', value: number) => {
//     setLineItems(prev => prev.map((item, index) => {
//       if (index === lineIndex) {
//         const updatedItem = {
//           ...item,
//           [`Discount_${discountType}`]: value || 0
//         }
//         return calculateLineTotal(updatedItem)
//       }
//       return item
//     }))
//   }, [calculateLineTotal])

//   // ✅ Delete line item
//   const deleteLine = useCallback((lineIndex: number) => {
//     setLineItems(prev => prev.filter((_, index) => index !== lineIndex))
//   }, [])

//   // ✅ Toggle line expansion
//   const toggleLineExpansion = useCallback((lineIndex: number) => {
//     setLineItems(prev => prev.map((item, index) =>
//       index === lineIndex ? { ...item, isExpanded: !item.isExpanded } : item
//     ))
//   }, [])

//   // ✅ Calculate order summary
//   const orderSummary = useMemo(() => {
//     const grossTotal = lineItems.reduce((sum, item) => sum + item.grossTotal, 0)
//     const totalDiscount = lineItems.reduce((sum, item) => sum + item.totalDiscount, 0)
//     const netTotal = grossTotal - totalDiscount

//     return { grossTotal, totalDiscount, netTotal }
//   }, [lineItems])

//   // ✅ Notify parent of changes
//   React.useEffect(() => {
//     onChange?.(lineItems)
//   }, [lineItems, onChange])

//   return (
//     <div className="bg-white border border-gray-300 rounded-lg shadow-md">
//       {/* ✅ Header */}
//       <div className=" flex justify-end p-3">
//         <div className="flex items-center justify-between">
//           {/* <div>
//             <h2 className="text-lg font-semibold text-gray-900">
//               Order Details ({lineItems.length} items)
//             </h2>
//             <p className="text-sm text-gray-600">
//               Add items and configure quantities with UOM conversion
//             </p>
//           </div> */}

//           <Button
//             variant="primary"
//             onClick={handleOpenModal}
//             className="flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Bulk Items
//           </Button>
//         </div>
//       </div>
//       {/* ✅ Complete Table Layout with Empty State Check */}
//       <div className="bg-white overflow-hidden">
//         {/* Table Header */}
//         <div className="bg-gray-100 border-b border-gray-300">
//           <div className="flex justify-between gap-2 px-4 py-3 text-sm font-medium text-gray-700">
//             <div className='flex  w-42 justify-between'>
//               <div className="col-span-1">LINE #</div>
//               <div className="col-span-2">(select item)</div>
//             </div>
//             <div><div className="col-span-1 w-26 ">UNIT PRICE</div></div>
//             <div className='w-46'>
//               <div className="col-span-3 text-center">UOM SELECTION</div>
//             </div>
//             <div className="col-span-3 text-center w-86">TIER DISCOUNTS (%)</div>
//             <div className="col-span-1 text-center w-46">GROSS</div>
//             <div className="col-span-1 text-center">ACTION</div>
//           </div>
//         </div>

//         {/* ✅ Empty State or Table Body */}
//         {lineItems.length === 0 ? (
//           <div className="p-12 text-center text-gray-500">
//             <p className="text-lg">No items added yet</p>
//             <p className="text-sm mt-2">Click "Add Bulk Items" to select products</p>
//           </div>
//         ) : (
//           <div>
//             {lineItems.map((lineItem, index) => (
//               <div
//                 key={`line-${lineItem.lineNo}`}
//                 className={`grid grid-cols-12 gap-2 px-4 py-3 border-b items-center ${index % 2 === 0 ? 'bg-gray-0' : 'bg-gray-100'
//                   }`}
//               >
//                 {/* Line Number */}
//                 <div className="bg-green-100 text-green-800  w-10 rounded-xl flex items-center justify-center h-10">
//                   {lineItem.lineNo}
//                 </div>

//                 {/* Item Name */}
//                 <div className="">
//                   <span className="text-gray-900 font-normal text-sm mt-4 ml-[-7] truncate block">
//                     {lineItem.itemName}
//                   </span>
//                 </div>

//                 {/* Unit Price */}
//                 <div className="col-span-1">
//                   <Input
//                     type="number"
//                     value={lineItem.unitPrice}
//                     onChange={(e) => handleUnitPriceChange(index, parseFloat(e.target.value) || 0)}
//                     placeholder="0"
//                     step="0.01"
//                     className="w-full h-8 text-sm mt-4 font-normal p-0"
//                   />
//                 </div>

//                 {/* UOM Selection */}
//                 <div className="col-span-3">
//                   <UomConverter
//                     key={`uom-${lineItem.Item_ID}-${index}`}
//                     uomData={lineItem.extractedUomData}
//                     lineIndex={index}
//                     onChange={(values) => handleUomChange(index, values)}
//                     initialValues={{
//                       uom1_qty: lineItem.uom1_qty.toString(),
//                       uom2_qty: lineItem.uom2_qty.toString(),
//                       uom3_qty: lineItem.uom3_qty.toString(),
//                       sale_unit: lineItem.sale_unit.toString()
//                     }}
//                     isPurchase={isPurchase}
//                     tableMode={true}
//                   />
//                 </div>

//                 {/* Tier Discounts */}
//                 <div className="col-span-3">
//                   <div className="grid grid-cols-3 gap-2">
//                     {/* Tier A */}
//                     <div className="text-center">
//                       <div className="text-xs font-normal text-gray-500 mb-1">TIER A (%)</div>
//                       <Input
//                         type="number"
//                         value={lineItem.Discount_A === 0 ? '' : lineItem.Discount_A}  // ✅ Show empty for 0
//                         onChange={(e) => handleDiscountChange(index, 'A', e.target.value)}  // ✅ Pass raw string
//                         placeholder="0"
//                         step="0.1"
//                         max="100"
//                         className="w-full h-8 text-sm font-normal text-center pr-4"
//                       />
//                     </div>

//                     {/* Tier B */}
//                     <div className="text-center">
//                       <div className="text-xs font-normal text-gray-500 mb-1">TIER B (%)</div>
//                       <Input
//                         type="number"
//                         value={lineItem.Discount_B === 0 ? '' : lineItem.Discount_B}  // ✅ Show empty for 0
//                         onChange={(e) => handleDiscountChange(index, 'B', e.target.value)}  // ✅ Pass raw string
//                         placeholder="0"
//                         step="0.1"
//                         max="100"
//                         className="w-full h-8 text-sm font-normal text-center pr-4"
//                       />
//                     </div>

//                     {/* Tier C */}
//                     <div className="text-center">
//                       <div className="text-xs font-normal text-gray-500 mb-1">TIER C (%)</div>
//                       <Input
//                         type="number"
//                         value={lineItem.Discount_C === 0 ? '' : lineItem.Discount_C}  // ✅ Show empty for 0
//                         onChange={(e) => handleDiscountChange(index, 'C', e.target.value)}  // ✅ Pass raw string
//                         placeholder="0"
//                         step="0.1"
//                         max="100"
//                         className="w-full h-8 text-sm font-normal text-center pr-4"
//                       />
//                     </div>

//                   </div>
//                 </div>

//                 {/* Gross Total */}
//                 <div className='col-span-2'>
//                   <div className="text-center flex items-center space-x-3 pl-6">
//                     <div className="text-xs font-normal text-gray-500">GROSS</div>
//                     <div className="text-sm font-normal text-gray-900 mt-1">
//                       {lineItem.grossTotal.toFixed(2)}
//                     </div>
//                     <div className="text-xs font-normal text-green-700 mt-1">
//                       NET: {lineItem.netTotal.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="col-span-1">
//                   <div className="flex items-center justify-center gap-1">
//                     <button
//                       onClick={() => deleteLine(index)}
//                       className="p-1 hover:bg-red-100 rounded text-red-600"
//                       title="Delete line"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* ✅ Order Summary */}
//       {lineItems.length > 0 && (
//         <div className="p-6 bg-green-50 border-t">
//           <div className="flex items-center justify-between">
//             {/* <div>
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Order Summary ({lineItems.length} items)
//               </h3>
//             </div> */}

//             <div className="flex items-center gap-8">
//               <div className="text-right">
//                 <div className="text-sm text-gray-600">Gross Total:</div>
//                 <div className="font-semibold">Rs {orderSummary.grossTotal.toFixed(2)}</div>
//               </div>

//               <div className="text-right">
//                 <div className="text-sm text-red-600">Total Discount:</div>
//                 <div className="font-semibold text-red-600">Rs {orderSummary.totalDiscount.toFixed(2)}</div>
//               </div>

//               <div className="text-right">
//                 <div className=" font-semibold text-green-800 bg-green-200 px-4 py-2 rounded-lg">
//                   Net Total: Rs {orderSummary.netTotal.toFixed(2)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ MultiSelectItemTable Modal */}
//       {showItemModal && (
//         <MultiSelectItemTable
//           onSelectionComplete={handleBulkItemSelection}
//           onCancel={handleCloseModal}
//           isPurchase={isPurchase}
//           alreadyAddedItemIds={alreadyAddedItemIds}
//         />
//       )}
//     </div>
//   )
// }
// export default OrderDetails

































































































































// // components/orders/OrderDetails.tsx - YOUR EXACT UI + EDIT MODE + FIXED NUMBER INPUTS
// 'use client'
// import React, { useState, useMemo, useCallback, useEffect } from 'react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { MultiSelectItemTable, ExtractedItemData } from '@/components/common/items/MultiSelectItemTable'
// import UomConverter from '@/components/common/items/UomConverter'
// import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

// interface OrderHeaderData {
//   date: string
//   COA_ID: string | number
//   Transporter_ID: string | number
//   Stock_Type_ID: number
//   discountA: number
//   discountB: number
//   discountC: number
//   freight_crt: number
//   labour_crt: number
//   bility_expense: number
//   other_expense: number
//   foreign_currency?: string
//   sub_customer?: string
//   sub_city?: string
//   str?: number
// }

// interface OrderLineItem {
//   lineNo: number
//   Item_ID: number
//   itemName: string
//   unitPrice: number | string           // ✅ ALLOW EMPTY STRING

//   // UOM Data  
//   uom1_qty: number | string            // ✅ ALLOW EMPTY STRING
//   uom2_qty: number | string            // ✅ ALLOW EMPTY STRING
//   uom3_qty: number | string            // ✅ ALLOW EMPTY STRING
//   sale_unit: number
//   Uom_Id: number

//   // Discount Fields
//   Discount_A: number | string          // ✅ ALLOW EMPTY STRING
//   Discount_B: number | string          // ✅ ALLOW EMPTY STRING
//   Discount_C: number | string          // ✅ ALLOW EMPTY STRING

//   // Calculated fields (UI only)
//   grossTotal: number
//   totalDiscount: number
//   netTotal: number

//   // Reference data
//   extractedUomData: ExtractedItemData['uomData']
//   originalItem: ExtractedItemData
//   isExpanded?: boolean
// }

// interface OrderDetailsProps {
//   mode?: 'create' | 'edit'             // ✅ ADD: Mode support
//   headerData: OrderHeaderData
//   isPurchase?: boolean
//   onChange?: (orderDetails: OrderLineItem[]) => void
//   initialLineItems?: any[]             // ✅ ADD: Initial data for edit
// }

// export const OrderDetails: React.FC<OrderDetailsProps> = ({
//   mode = 'create',                     // ✅ ADD: Default to create
//   headerData,
//   isPurchase = false,
//   onChange,
//   initialLineItems = []                // ✅ ADD: Initial data
// }) => {
//   const [lineItems, setLineItems] = useState<OrderLineItem[]>([])
//   const [showItemModal, setShowItemModal] = useState(false)
//   const [nextLineNo, setNextLineNo] = useState(1)

//   // Get already added item IDs for duplicate prevention
//   const alreadyAddedItemIds = useMemo(() => lineItems.map(item => item.Item_ID), [lineItems])

//   // ✅ ADD: Pre-populate data for edit mode
//   useEffect(() => {
//     if (mode === 'edit' && initialLineItems && initialLineItems.length > 0) {
//       console.group('📝 OrderDetails: Edit Mode - Pre-populating line items')
//       console.log('Initial Line Items Count:', initialLineItems.length)

//       const populatedItems = initialLineItems.map((detail: any, index: number) => {
//         console.log(`Pre-populating item ${index + 1}:`, {
//           id: detail.Item_ID,
//           name: detail.item?.itemName,
//           quantities: {
//             uom1: detail.uom1_qty,
//             uom2: detail.uom2_qty,
//             uom3: detail.uom3_qty,
//             saleUnit: detail.sale_unit
//           },
//           discounts: {
//             A: detail.Discount_A,
//             B: detail.Discount_B,
//             C: detail.Discount_C
//           }
//         })

//         return {
//           lineNo: detail.Line_Id || (index + 1),
//           Item_ID: detail.Item_ID,
//           itemName: detail.item?.itemName || '',
//           unitPrice: detail.item?.sellingPrice ? parseFloat(detail.item.sellingPrice) : (detail.item?.purchasePricePKR ? parseFloat(detail.item.purchasePricePKR) : ''),

//           // ✅ FIXED: Keep empty if no value, don't default to 0
//           uom1_qty: detail.uom1_qty ? parseFloat(detail.uom1_qty) : '',
//           uom2_qty: detail.uom2_qty ? parseFloat(detail.uom2_qty) : '',
//           uom3_qty: detail.uom3_qty ? parseFloat(detail.uom3_qty) : '',
//           sale_unit: parseInt(detail.sale_unit || 3),
//           Uom_Id: detail.Uom_Id,

//           // ✅ FIXED: Keep empty if no discount, don't default to 0
//           Discount_A: detail.Discount_A ? parseFloat(detail.Discount_A) : '',
//           Discount_B: detail.Discount_B ? parseFloat(detail.Discount_B) : '',
//           Discount_C: detail.Discount_C ? parseFloat(detail.Discount_C) : '',

//           extractedUomData: {
//             primary: detail.item?.uom1 || { id: 1, name: 'Pkt', qty: 1 },
//             secondary: detail.item?.uomTwo || null,
//             tertiary: detail.item?.uomThree || null
//           },
//           originalItem: detail.item,
//           grossTotal: 0,
//           totalDiscount: 0,
//           netTotal: 0,
//           isExpanded: false
//         }
//       })

//       const calculatedItems = populatedItems.map(item => calculateLineTotal(item))
//       console.log('✅ Pre-populated and calculated items:', calculatedItems.length)
//       console.groupEnd()

//       setLineItems(calculatedItems)
//       setNextLineNo((populatedItems.length || 0) + 1)
//     }
//   }, [mode, initialLineItems])

//   // ✅ Open modal handler
//   const handleOpenModal = useCallback(() => {
//     console.log('🔓 Opening item selection modal')
//     setShowItemModal(true)
//   }, [])

//   // ✅ Close modal handler
//   const handleCloseModal = useCallback(() => {
//     console.log('❌ Closing item selection modal')
//     setShowItemModal(false)
//   }, [])

//   // ✅ FIXED: Calculate line totals with proper empty string handling
//   const calculateLineTotal = useCallback((lineItem: OrderLineItem): OrderLineItem => {
//     // ✅ Get numeric values, treat empty strings as 0 for calculations only
//     const getNumericValue = (val: number | string): number => {
//       if (val === '' || val === null || val === undefined) return 0
//       return typeof val === 'string' ? parseFloat(val) || 0 : val
//     }

//     const quantity = getNumericValue(lineItem.uom3_qty) || getNumericValue(lineItem.uom2_qty) || getNumericValue(lineItem.uom1_qty) || 0
//     const unitPrice = getNumericValue(lineItem.unitPrice)
//     const grossTotal = quantity * unitPrice

//     // ✅ Handle discount calculations with empty strings
//     const discountA = getNumericValue(lineItem.Discount_A)
//     const discountB = getNumericValue(lineItem.Discount_B)
//     const discountC = getNumericValue(lineItem.Discount_C)

//     const discountPercent = discountA + discountB + discountC
//     const totalDiscount = (grossTotal * discountPercent) / 100
//     const netTotal = grossTotal - totalDiscount

//     return {
//       ...lineItem,
//       grossTotal,
//       totalDiscount,
//       netTotal
//     }
//   }, [])

//   // ✅ FIXED: Handle bulk item selection with proper discount application in edit mode
//   const handleBulkItemSelection = useCallback((selectedItems: ExtractedItemData[]) => {
//     console.group('📦 Adding Bulk Items to Order')
//     console.log('Selected Items:', selectedItems.length)
//     console.log('Mode:', mode)
//     console.log('Header Discounts:', {
//       discountA: headerData.discountA,
//       discountB: headerData.discountB,
//       discountC: headerData.discountC
//     })

//     const newLineItems: OrderLineItem[] = selectedItems.map((item, index) => {
//       const lineNo = nextLineNo + index

//       const newLineItem: OrderLineItem = {
//         lineNo,
//         Item_ID: item.id,
//         itemName: item.itemName,
//         unitPrice: isPurchase ? item.purchasePricePKR : item.sellingPrice,

//         // ✅ FIXED: Initialize UOM values as empty strings, not 0
//         uom1_qty: '',
//         uom2_qty: '',
//         uom3_qty: '',
//         sale_unit: 3, // Default to tertiary
//         Uom_Id: item.uomData.tertiary?.id || item.uomData.primary.id,

//         // ✅ CRITICAL: Apply header discounts in BOTH create and edit modes
//         Discount_A: headerData.discountA || '',
//         Discount_B: headerData.discountB || '',
//         Discount_C: headerData.discountC || '',

//         // Initial calculations
//         grossTotal: 0,
//         totalDiscount: 0,
//         netTotal: 0,

//         // Store UOM data for converter
//         extractedUomData: item.uomData,
//         originalItem: item,
//         isExpanded: false
//       }

//       return calculateLineTotal(newLineItem)
//     })

//     console.log('New Line Items Created:', newLineItems.length)
//     console.log('Discounts applied to new items:', {
//       discountA: headerData.discountA || 'empty',
//       discountB: headerData.discountB || 'empty',
//       discountC: headerData.discountC || 'empty'
//     })
//     console.groupEnd()

//     setLineItems(prev => [...prev, ...newLineItems])
//     setNextLineNo(prev => prev + selectedItems.length)

//     // ✅ Modal stays open - don't close here
//     console.log('✅ Items added! Modal remains open for more selections.')
//   }, [nextLineNo, headerData, isPurchase, calculateLineTotal, mode])

//   // ✅ FIXED: Handle UOM converter changes with proper empty string support
//   const handleUomChange = useCallback((lineIndex: number, uomData: any) => {
//     console.log(`🔄 UOM changed for line ${lineIndex}:`, uomData)

//     setLineItems(prev => prev.map((item, index) => {
//       if (index === lineIndex) {
//         const updatedItem = {
//           ...item,
//           // ✅ FIXED: Keep empty strings if no value
//           uom1_qty: uomData.uom1_qty || '',
//           uom2_qty: uomData.uom2_qty || '',
//           uom3_qty: uomData.uom3_qty || '',
//           sale_unit: uomData.sale_unit || 3,
//           Uom_Id: uomData.Uom_Id || item.Uom_Id
//         }
//         return calculateLineTotal(updatedItem)
//       }
//       return item
//     }))
//   }, [calculateLineTotal])

//   // ✅ FIXED: Handle unit price change with empty string support
//   const handleUnitPriceChange = useCallback((lineIndex: number, value: string) => {
//     setLineItems(prev => prev.map((item, index) => {
//       if (index === lineIndex) {
//         // ✅ FIXED: Keep as string if empty, otherwise convert to number
//         const updatedItem = { 
//           ...item, 
//           unitPrice: value === '' ? '' : (parseFloat(value) || '')
//         }
//         return calculateLineTotal(updatedItem)
//       }
//       return item
//     }))
//   }, [calculateLineTotal])

//   // ✅ FIXED: Handle discount changes with proper empty string support
//   const handleDiscountChange = useCallback((lineIndex: number, discountType: 'A' | 'B' | 'C', value: string) => {
//     setLineItems(prev => prev.map((item, index) => {
//       if (index === lineIndex) {
//         const updatedItem = {
//           ...item,
//           // ✅ FIXED: Keep empty string if empty, don't convert to 0
//           [`Discount_${discountType}`]: value === '' ? '' : value
//         }
//         return calculateLineTotal(updatedItem)
//       }
//       return item
//     }))
//   }, [calculateLineTotal])

//   // ✅ Delete line item
//   const deleteLine = useCallback((lineIndex: number) => {
//     setLineItems(prev => prev.filter((_, index) => index !== lineIndex))
//   }, [])

//   // ✅ Toggle line expansion
//   const toggleLineExpansion = useCallback((lineIndex: number) => {
//     setLineItems(prev => prev.map((item, index) =>
//       index === lineIndex ? { ...item, isExpanded: !item.isExpanded } : item
//     ))
//   }, [])

//   // ✅ Calculate order summary
//   const orderSummary = useMemo(() => {
//     const grossTotal = lineItems.reduce((sum, item) => sum + item.grossTotal, 0)
//     const totalDiscount = lineItems.reduce((sum, item) => sum + item.totalDiscount, 0)
//     const netTotal = grossTotal - totalDiscount

//     return { grossTotal, totalDiscount, netTotal }
//   }, [lineItems])

//   // ✅ Notify parent of changes
//   React.useEffect(() => {
//     onChange?.(lineItems)
//   }, [lineItems, onChange])

//   return (
//     <div className="bg-white border border-gray-300 rounded-lg shadow-md">
//       {/* ✅ YOUR EXACT HEADER - NO CHANGES */}
//       <div className=" flex justify-end p-3">
//         <div className="flex items-center justify-between">
//           <Button
//             variant="primary"
//             onClick={handleOpenModal}
//             className="flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             {mode === 'edit' ? 'Add More Items' : 'Add Bulk Items'}
//           </Button>
//         </div>
//       </div>

//       {/* ✅ YOUR EXACT TABLE LAYOUT - NO CHANGES */}
//       <div className="bg-white overflow-hidden">
//         {/* Table Header */}
//         <div className="bg-gray-100 border-b border-gray-300">
//           <div className="flex justify-between gap-2 px-4 py-3 text-sm font-medium text-gray-700">
//             <div className='flex  w-42 justify-between'>
//               <div className="col-span-1">LINE #</div>
//               <div className="col-span-2">(select item)</div>
//             </div>
//             <div><div className="col-span-1 w-26 ">UNIT PRICE</div></div>
//             <div className='w-46'>
//               <div className="col-span-3 text-center">UOM SELECTION</div>
//             </div>
//             <div className="col-span-3 text-center w-86">TIER DISCOUNTS (%)</div>
//             <div className="col-span-1 text-center w-46">GROSS</div>
//             <div className="col-span-1 text-center">ACTION</div>
//           </div>
//         </div>

//         {/* ✅ YOUR EXACT EMPTY STATE OR TABLE BODY */}
//         {lineItems.length === 0 ? (
//           <div className="p-12 text-center text-gray-500">
//             <p className="text-lg">
//               {mode === 'edit' ? 'No items in this order' : 'No items added yet'}
//             </p>
//             <p className="text-sm mt-2">
//               {mode === 'edit' 
//                 ? 'Add items to this order using "Add More Items"'
//                 : 'Click "Add Bulk Items" to select products'
//               }
//             </p>
//           </div>
//         ) : (
//           <div>
//             {lineItems.map((lineItem, index) => (
//               <div
//                 key={`line-${lineItem.lineNo}`}
//                 className={`grid grid-cols-12 gap-2 px-4 py-3 border-b items-center ${index % 2 === 0 ? 'bg-gray-0' : 'bg-gray-100'
//                   }`}
//               >
//                 {/* Line Number */}
//                 <div className="bg-green-100 text-green-800  w-10 rounded-xl flex items-center justify-center h-10">
//                   {lineItem.lineNo}
//                 </div>

//                 {/* Item Name */}
//                 <div className="">
//                   <span className="text-gray-900 font-normal text-sm mt-4 ml-[-7] truncate block">
//                     {lineItem.itemName}
//                   </span>
//                 </div>

//                 {/* ✅ FIXED: Unit Price with proper empty string handling */}
//                 <div className="col-span-1">
//                   <Input
//                     type="number"
//                     value={lineItem.unitPrice}
//                     onChange={(e) => handleUnitPriceChange(index, e.target.value)}
//                     placeholder="0"
//                     step="0.01"
//                     className="w-full h-8 text-sm mt-4 font-normal p-0"
//                   />
//                 </div>

//                 {/* ✅ FIXED: UOM Selection with proper initial values for edit mode */}
//                 <div className="col-span-3">
//                   <UomConverter
//                     key={`uom-${lineItem.Item_ID}-${index}`}
//                     uomData={lineItem.extractedUomData}
//                     lineIndex={index}
//                     onChange={(values) => handleUomChange(index, values)}
//                     initialValues={{
//                       // ✅ FIXED: Convert to string properly, show empty string if empty
//                       uom1_qty: lineItem.uom1_qty === '' ? '' : lineItem.uom1_qty.toString(),
//                       uom2_qty: lineItem.uom2_qty === '' ? '' : lineItem.uom2_qty.toString(),
//                       uom3_qty: lineItem.uom3_qty === '' ? '' : lineItem.uom3_qty.toString(),
//                       sale_unit: lineItem.sale_unit.toString()
//                     }}
//                     isPurchase={isPurchase}
//                     tableMode={true}
//                   />
//                 </div>

//                 {/* ✅ FIXED: Tier Discounts with proper empty string handling */}
//                 <div className="col-span-3">
//                   <div className="grid grid-cols-3 gap-2">
//                     {/* Tier A */}
//                     <div className="text-center">
//                       <div className="text-xs font-normal text-gray-500 mb-1">TIER A (%)</div>
//                       <Input
//                         type="number"
//                         value={lineItem.Discount_A === '' ? '' : lineItem.Discount_A}
//                         onChange={(e) => handleDiscountChange(index, 'A', e.target.value)}
//                         placeholder="0"
//                         step="0.1"
//                         max="100"
//                         className="w-full h-8 text-sm font-normal text-center pr-4"
//                       />
//                     </div>

//                     {/* Tier B */}
//                     <div className="text-center">
//                       <div className="text-xs font-normal text-gray-500 mb-1">TIER B (%)</div>
//                       <Input
//                         type="number"
//                         value={lineItem.Discount_B === '' ? '' : lineItem.Discount_B}
//                         onChange={(e) => handleDiscountChange(index, 'B', e.target.value)}
//                         placeholder="0"
//                         step="0.1"
//                         max="100"
//                         className="w-full h-8 text-sm font-normal text-center pr-4"
//                       />
//                     </div>

//                     {/* Tier C */}
//                     <div className="text-center">
//                       <div className="text-xs font-normal text-gray-500 mb-1">TIER C (%)</div>
//                       <Input
//                         type="number"
//                         value={lineItem.Discount_C === '' ? '' : lineItem.Discount_C}
//                         onChange={(e) => handleDiscountChange(index, 'C', e.target.value)}
//                         placeholder="0"
//                         step="0.1"
//                         max="100"
//                         className="w-full h-8 text-sm font-normal text-center pr-4"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Gross Total */}
//                 <div className='col-span-2'>
//                   <div className="text-center flex items-center space-x-3 pl-6">
//                     <div className="text-xs font-normal text-gray-500">GROSS</div>
//                     <div className="text-sm font-normal text-gray-900 mt-1">
//                       {lineItem.grossTotal.toFixed(2)}
//                     </div>
//                     <div className="text-xs font-normal text-green-700 mt-1">
//                       NET: {lineItem.netTotal.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="col-span-1">
//                   <div className="flex items-center justify-center gap-1">
//                     <button
//                       onClick={() => deleteLine(index)}
//                       className="p-1 hover:bg-red-100 rounded text-red-600"
//                       title="Delete line"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ✅ YOUR EXACT ORDER SUMMARY */}
//       {lineItems.length > 0 && (
//         <div className="p-6 bg-green-50 border-t">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-8">
//               <div className="text-right">
//                 <div className="text-sm text-gray-600">Gross Total:</div>
//                 <div className="font-semibold">Rs {orderSummary.grossTotal.toFixed(2)}</div>
//               </div>

//               <div className="text-right">
//                 <div className="text-sm text-red-600">Total Discount:</div>
//                 <div className="font-semibold text-red-600">Rs {orderSummary.totalDiscount.toFixed(2)}</div>
//               </div>

//               <div className="text-right">
//                 <div className=" font-semibold text-green-800 bg-green-200 px-4 py-2 rounded-lg">
//                   Net Total: Rs {orderSummary.netTotal.toFixed(2)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ YOUR EXACT MODAL */}
//       {showItemModal && (
//         <MultiSelectItemTable
//           onSelectionComplete={handleBulkItemSelection}
//           onCancel={handleCloseModal}
//           isPurchase={isPurchase}
//           alreadyAddedItemIds={alreadyAddedItemIds}
//         />
//       )}
//     </div>
//   )
// }

// export default OrderDetails



















































// components/orders/OrderDetails.tsx - YOUR EXACT UI + FIXED UOM DATA STRUCTURE FOR EDIT
'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MultiSelectItemTable, ExtractedItemData } from '@/components/common/items/MultiSelectItemTable'
import UomConverter from '@/components/common/items/UomConverter'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { formatWithMathRound } from '@/components/common/NumberFormat'

interface OrderHeaderData {
  date: string
  COA_ID: string | number
  Transporter_ID: string | number
  Stock_Type_ID: number
  discountA: number
  discountB: number
  discountC: number
  freight_crt: number
  labour_crt: number
  bility_expense: number
  other_expense: number
  foreign_currency?: string
  sub_customer?: string
  sub_city?: string
  str?: number
}

interface OrderLineItem {
  lineNo: number
  Item_ID: number
  itemName: string
  unitPrice: number | string           // ✅ ALLOW EMPTY STRING

  // UOM Data
  uom1_qty: number | string            // ✅ ALLOW EMPTY STRING
  uom2_qty: number | string            // ✅ ALLOW EMPTY STRING
  uom3_qty: number | string            // ✅ ALLOW EMPTY STRING
  sale_unit: number
  Uom_Id: number

  // Discount Fields
  Discount_A: number | string          // ✅ ALLOW EMPTY STRING
  Discount_B: number | string          // ✅ ALLOW EMPTY STRING
  Discount_C: number | string          // ✅ ALLOW EMPTY STRING

  // Calculated fields (UI only)
  grossTotal: number
  totalDiscount: number
  netTotal: number

  // Reference data
  extractedUomData: ExtractedItemData['uomData']
  originalItem: ExtractedItemData
  isExpanded?: boolean
}

interface OrderDetailsProps {
  mode?: 'create' | 'edit'             // ✅ ADD: Mode support
  headerData: OrderHeaderData
  isPurchase?: boolean
  onChange?: (orderDetails: OrderLineItem[]) => void
  initialLineItems?: any[]             // ✅ ADD: Initial data for edit
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  mode = 'create',                     // ✅ ADD: Default to create
  headerData,
  isPurchase = false,
  onChange,
  initialLineItems = []                // ✅ ADD: Initial data
}) => {
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([])
  const [showItemModal, setShowItemModal] = useState(false)
  const [nextLineNo, setNextLineNo] = useState(1)

  // Get already added item IDs for duplicate prevention
  const alreadyAddedItemIds = useMemo(() => lineItems.map(item => item.Item_ID), [lineItems])

  // ✅ ADD: Pre-populate data for edit mode with FIXED UOM DATA STRUCTURE
  // useEffect(() => {
  //   if (mode === 'edit' && initialLineItems && initialLineItems.length > 0) {
  //     console.group('📝 OrderDetails: Edit Mode - Pre-populating line items with correct UOM structure')
  //     console.log('Initial Line Items Count:', initialLineItems.length)

  //     const populatedItems = initialLineItems.map((detail: any, index: number) => {
  //       console.log(`Pre-populating item ${index + 1}:`, {
  //         id: detail.Item_ID,
  //         name: detail.item?.itemName,
  //         rawUomData: {
  //           uom1: detail.item?.uom1,
  //           uomTwo: detail.item?.uomTwo,
  //           uomThree: detail.item?.uomThree
  //         }
  //       })

  //       // ✅ FIXED: Correctly map API UOM structure to UomConverter expected structure
  //       const extractedUomData = {
  //         primary: {
  //           id: detail.item?.uom1?.id || 1,
  //           name: detail.item?.uom1?.uom || 'Pcs',        // ✅ FIXED: Map 'uom' to 'name'
  //           qty: parseFloat(detail.uom1_qty || 0)
  //         },
  //         secondary: detail.item?.uomTwo ? {
  //           id: detail.item.uomTwo.id,
  //           name: detail.item.uomTwo.uom,                 // ✅ FIXED: Map 'uom' to 'name'
  //           qty: parseFloat(detail.uom2_qty || 0)
  //         } : null,
  //         tertiary: detail.item?.uomThree ? {
  //           id: detail.item.uomThree.id,
  //           name: detail.item.uomThree.uom,               // ✅ FIXED: Map 'uom' to 'name'
  //           qty: parseFloat(detail.uom3_qty || 0)
  //         } : null
  //       }

  //       console.log('✅ Correctly mapped UOM data:', extractedUomData)

  //       return {
  //         lineNo: detail.Line_Id || (index + 1),
  //         Item_ID: detail.Item_ID,
  //         itemName: detail.item?.itemName || '',
  //         unitPrice: detail.item?.sellingPrice ? parseFloat(detail.item.sellingPrice) : (detail.item?.purchasePricePKR ? parseFloat(detail.item.purchasePricePKR) : ''),

  //         // ✅ FIXED: Keep empty if no value, don't default to 0
  //         uom1_qty: detail.uom1_qty ? parseFloat(detail.uom1_qty) : '',
  //         uom2_qty: detail.uom2_qty ? parseFloat(detail.uom2_qty) : '',
  //         uom3_qty: detail.uom3_qty ? parseFloat(detail.uom3_qty) : '',
  //         sale_unit: parseInt(detail.sale_unit || 3),
  //         Uom_Id: detail.Uom_Id,

  //         // ✅ FIXED: Keep empty if no discount, don't default to 0
  //         Discount_A: detail.Discount_A ? parseFloat(detail.Discount_A) : '',
  //         Discount_B: detail.Discount_B ? parseFloat(detail.Discount_B) : '',
  //         Discount_C: detail.Discount_C ? parseFloat(detail.Discount_C) : '',

  //         // ✅ CRITICAL FIX: Use correctly mapped UOM data
  //         extractedUomData: extractedUomData,
  //         originalItem: {
  //           id: detail.Item_ID,
  //           itemName: detail.item?.itemName || '',
  //           sellingPrice: parseFloat(detail.item?.sellingPrice || 0),
  //           purchasePricePKR: parseFloat(detail.item?.purchasePricePKR || 0),
  //           uomData: extractedUomData
  //         },
  //         grossTotal: 0,
  //         totalDiscount: 0,
  //         netTotal: 0,
  //         isExpanded: false
  //       }
  //     })

  //     const calculatedItems = populatedItems.map(item => calculateLineTotal(item))
  //     console.log('✅ Pre-populated items with correct UOM structure:', calculatedItems.length)
  //     console.groupEnd()

  //     setLineItems(calculatedItems)
  //     setNextLineNo((populatedItems.length || 0) + 1)
  //   }
  // }, [mode, initialLineItems])


useEffect(() => {
  if (mode === 'edit' && initialLineItems && initialLineItems.length > 0) {
    console.group('📝 OrderDetails: Edit Mode - Pre-populating line items')

    const populatedItems = initialLineItems.map((detail: any, index: number) => {
      
      // ✅ FIXED: Use ITEM's conversion factors for UOM calculations
      const extractedUomData = {
        primary: {
          id: detail.item?.uom1?.id || 1,
          name: detail.item?.uom1?.uom || 'Pcs',
          qty: parseFloat(detail.item?.uom1_qyt || 1)      // ✅ Item's conversion factor
        },
        secondary: detail.item?.uomTwo ? {
          id: detail.item.uomTwo.id,
          name: detail.item.uomTwo.uom,
          qty: parseFloat(detail.item?.uom2_qty || 1)      // ✅ Item's conversion factor
        } : null,
        tertiary: detail.item?.uomThree ? {
          id: detail.item.uomThree.id,
          name: detail.item.uomThree.uom,
          qty: parseFloat(detail.item?.uom3_qty || 1)      // ✅ Item's conversion factor
        } : null
      }

      return {
        lineNo: detail.Line_Id || (index + 1),
        Item_ID: detail.Item_ID,
        itemName: detail.item?.itemName || '',
        unitPrice: detail.Price ? parseFloat(detail.Price) : '',

        // ✅ These are the ORDER LINE quantities (user-entered values)
        uom1_qty: detail.uom1_qty ? parseFloat(detail.uom1_qty) : '',
        uom2_qty: detail.uom2_qty ? parseFloat(detail.uom2_qty) : '',
        uom3_qty: detail.uom3_qty ? parseFloat(detail.uom3_qty) : '',
        sale_unit: parseInt(detail.sale_unit || 3),
        Uom_Id: detail.Uom_Id,

        Discount_A: detail.Discount_A ? parseFloat(detail.Discount_A) : '',
        Discount_B: detail.Discount_B ? parseFloat(detail.Discount_B) : '',
        Discount_C: detail.Discount_C ? parseFloat(detail.Discount_C) : '',

        // ✅ Pass ITEM's conversion factors to UomConverter
        extractedUomData: extractedUomData,
        originalItem: {
          id: detail.Item_ID,
          itemName: detail.item?.itemName || '',
          sellingPrice: parseFloat(detail.item?.sellingPrice || 0),
          purchasePricePKR: parseFloat(detail.item?.purchasePricePKR || 0),
          uomData: extractedUomData
        },
        grossTotal: 0,
        totalDiscount: 0,
        netTotal: 0,
        isExpanded: false
      }
    })

    const calculatedItems = populatedItems.map(item => calculateLineTotal(item))
    setLineItems(calculatedItems)
    setNextLineNo((populatedItems.length || 0) + 1)
    console.groupEnd()
  }
}, [mode, initialLineItems])












  // ✅ Open modal handler
  const handleOpenModal = useCallback(() => {
    console.log('🔓 Opening item selection modal')
    setShowItemModal(true)
  }, [])

  // ✅ Close modal handler
  const handleCloseModal = useCallback(() => {
    console.log('❌ Closing item selection modal')
    setShowItemModal(false)
  }, [])

  // ✅ FIXED: Calculate line totals with proper empty string handling
  const calculateLineTotal = useCallback((lineItem: OrderLineItem): OrderLineItem => {
    // ✅ Get numeric values, treat empty strings as 0 for calculations only
    const getNumericValue = (val: number | string): number => {
      if (val === '' || val === null || val === undefined) return 0
      return typeof val === 'string' ? parseFloat(val) || 0 : val
    }

    const quantity = getNumericValue(lineItem.uom2_qty) || getNumericValue(lineItem.uom1_qty) || getNumericValue(lineItem.uom3_qty) || 0
    const unitPrice = getNumericValue(lineItem.unitPrice)
    const grossTotal = quantity * unitPrice

    console.log('this is type of goress total', typeof (grossTotal))
    // ✅ Handle discount calculations with empty strings
    const discountA = getNumericValue(lineItem.Discount_A)
    const discountB = getNumericValue(lineItem.Discount_B)
    const discountC = getNumericValue(lineItem.Discount_C)

    const discountPercent = discountA + discountB + discountC
    const totalDiscount = (grossTotal * discountPercent) / 100
    const netTotal = grossTotal - totalDiscount
    console.log(formatWithMathRound(1000.67))

    return {
      ...lineItem,
      grossTotal,
      totalDiscount,
      netTotal
    }
  }, [])

  // ✅ FIXED: Handle bulk item selection with proper discount application in edit mode
  const handleBulkItemSelection = useCallback((selectedItems: ExtractedItemData[]) => {
    console.group('📦 Adding Bulk Items to Order')
    console.log('Selected Items:', selectedItems.length)
    console.log('Mode:', mode)
    console.log('Header Discounts:', {
      discountA: headerData.discountA,
      discountB: headerData.discountB,
      discountC: headerData.discountC
    })

    const newLineItems: OrderLineItem[] = selectedItems.map((item, index) => {
      const lineNo = nextLineNo + index

      const newLineItem: OrderLineItem = {
        lineNo,
        Item_ID: item.id,
        itemName: item.itemName,
        unitPrice: isPurchase ? item.purchasePricePKR : item.sellingPrice,

        // ✅ FIXED: Initialize UOM values as empty strings, not 0
        uom1_qty: '',
        uom2_qty: '',
        uom3_qty: '',
        sale_unit: 3, // Default to tertiary
        Uom_Id: item.uomData.tertiary?.id || item.uomData.primary.id,

        // ✅ CRITICAL: Apply header discounts in BOTH create and edit modes
        // Discount_A: headerData.discountA || '',
        // Discount_B: headerData.discountB || '',
        // Discount_C: headerData.discountC || '',
        Discount_A: headerData.discountA || '',
        Discount_B: isPurchase ? '' : headerData.discountB || '',
        Discount_C: isPurchase ? '' : headerData.discountC || '',


        // Initial calculations
        grossTotal: 0,
        totalDiscount: 0,
        netTotal: 0,

        // Store UOM data for converter
        extractedUomData: item.uomData,
        originalItem: item,
        isExpanded: false
      }

      return calculateLineTotal(newLineItem)
    })

    console.log('New Line Items Created:', newLineItems.length)
    console.log('Discounts applied to new items:', {
      discountA: headerData.discountA || 'empty',
      discountB: headerData.discountB || 'empty',
      discountC: headerData.discountC || 'empty'
    })
    console.groupEnd()

    setLineItems(prev => [...prev, ...newLineItems])
    setNextLineNo(prev => prev + selectedItems.length)

    // ✅ Modal stays open - don't close here
    console.log('✅ Items added! Modal remains open for more selections.')
  }, [nextLineNo, headerData, isPurchase, calculateLineTotal, mode])

  // ✅ FIXED: Handle UOM converter changes with proper empty string support
  const handleUomChange = useCallback((lineIndex: number, uomData: any) => {
    console.log(`🔄 UOM changed for line ${lineIndex}:`, uomData)

    setLineItems(prev => prev.map((item, index) => {
      if (index === lineIndex) {
        const updatedItem = {
          ...item,
          // ✅ FIXED: Keep empty strings if no value
          uom1_qty: uomData.uom1_qty || '',
          uom2_qty: uomData.uom2_qty || '',
          uom3_qty: uomData.uom3_qty || '',
          sale_unit: uomData.sale_unit || 3,
          Uom_Id: uomData.Uom_Id || item.Uom_Id
        }
        return calculateLineTotal(updatedItem)
      }
      return item
    }))
  }, [calculateLineTotal])

  // ✅ FIXED: Handle unit price change with empty string support
  const handleUnitPriceChange = useCallback((lineIndex: number, value: string) => {
    setLineItems(prev => prev.map((item, index) => {
      if (index === lineIndex) {
        // ✅ FIXED: Keep as string if empty, otherwise convert to number
        const updatedItem = {
          ...item,
          unitPrice: value === '' ? '' : (parseFloat(value) || '')
        }
        return calculateLineTotal(updatedItem)
      }
      return item
    }))
  }, [calculateLineTotal])

  // ✅ FIXED: Handle discount changes with proper empty string support
  const handleDiscountChange = useCallback((lineIndex: number, discountType: 'A' | 'B' | 'C', value: string) => {
    setLineItems(prev => prev.map((item, index) => {
      if (index === lineIndex) {
        const updatedItem = {
          ...item,
          // ✅ FIXED: Keep empty string if empty, don't convert to 0
          [`Discount_${discountType}`]: value === '' ? '' : value
        }
        return calculateLineTotal(updatedItem)
      }
      return item
    }))
  }, [calculateLineTotal])

  // ✅ Delete line item
  const deleteLine = useCallback((lineIndex: number) => {
    setLineItems(prev => prev.filter((_, index) => index !== lineIndex))
  }, [])

  // ✅ Toggle line expansion
  const toggleLineExpansion = useCallback((lineIndex: number) => {
    setLineItems(prev => prev.map((item, index) =>
      index === lineIndex ? { ...item, isExpanded: !item.isExpanded } : item
    ))
  }, [])

  // ✅ Calculate order summary
  const orderSummary = useMemo(() => {
    const grossTotal = lineItems.reduce((sum, item) => sum + item.grossTotal, 0)
    const totalDiscount = lineItems.reduce((sum, item) => sum + item.totalDiscount, 0)
    const netTotal = grossTotal - totalDiscount

    return { grossTotal, totalDiscount, netTotal }
  }, [lineItems])

  // ✅ Notify parent of changes
  React.useEffect(() => {
    onChange?.(lineItems)
  }, [lineItems, onChange])

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md">
      {/* ✅ YOUR EXACT HEADER - NO CHANGES */}
      <div className=" flex justify-end p-3">
        <div className="flex items-center justify-between">
          <Button
            variant="primary"
            onClick={handleOpenModal}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {mode === 'edit' ? 'Add More Items' : 'Add Bulk Items'}
          </Button>
        </div>
      </div>

      {/* ✅ YOUR EXACT TABLE LAYOUT - NO CHANGES */}
      <div className="bg-white overflow-hidden">
        {/* Table Header */}
        <div className="max-w-7xl bg-gray-100 border-b border-gray-300">
          <div className="flex justify-between px-2 py-3 text-sm font-medium text-gray-700">
            <div className=" text-center w-[5%]">LINE</div>
            <div className=" text-center w-[15%]">ITEM</div>
            <div className="text-center w-[7%] ">UNIT PRICE</div>
            <div className=" text-center w-[30%]">UOM SELECTION</div>
            <div className=" text-center w-[20%]">TIER DISCOUNTS (%)</div>
            <div className=" text-center w-[7%]">GROSS</div>
            <div className=" text-center w-[7%]">NET</div>
            <div className=" text-center  w-[5%]">ACTION</div>
          </div>
        </div>

        {/* ✅ YOUR EXACT EMPTY STATE OR TABLE BODY */}
        {lineItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">
              {mode === 'edit' ? 'No items in this order' : 'No items added yet'}
            </p>
            <p className="text-sm mt-2">
              {mode === 'edit'
                ? 'Add items to this order using "Add More Items"'
                : 'Click "Add Bulk Items" to select products'
              }
            </p>
          </div>
        ) : (
          <div>
            {lineItems.map((lineItem, index) => (
              <div
                key={`line-${lineItem.lineNo}`}
                className={`flex items-start justify-between px-2 py-3 ${index % 2 === 0 ? 'bg-gray-0' : 'bg-gray-200'
                  }`}
              >
                {/* Line Number */}
                <div className='w-[5%] '>
                  <div className=" bg-green-100 text-green-800   rounded-xl flex items-center justify-center w-8 h-8 mx-auto">
                    {lineItem.lineNo}
                  </div>
                </div>


                {/* Item Name */}
                <div className="w-[15%]">
                  <span className="text-gray-900 text-center font-normal text-sm  truncate block">
                    {lineItem.itemName}
                  </span>
                </div>

                {/* ✅ FIXED: Unit Price with proper empty string handling */}
                <div className="w-[7%]">
                  <Input
                    type="number"
                    value={lineItem.unitPrice}
                    onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                    placeholder="0"
                    step="0.01"
                    className="w-full h-8 text-sm font-normal p-0"
                  />
                </div>

                {/* ✅ CRITICAL FIX: UOM Selection with correctly structured UOM data */}
                <div className="w-[30%]">
                  <div className=''>
                    <UomConverter
                      key={`uom-${lineItem.Item_ID}-${index}`}
                      uomData={lineItem.extractedUomData}
                      lineIndex={index}
                      onChange={(values) => handleUomChange(index, values)}
                      initialValues={{
                        // ✅ FIXED: Convert to string properly, show empty string if empty
                        uom1_qty: lineItem.uom1_qty === '' ? '' : lineItem.uom1_qty.toString(),
                        uom2_qty: lineItem.uom2_qty === '' ? '' : lineItem.uom2_qty.toString(),
                        uom3_qty: lineItem.uom3_qty === '' ? '' : lineItem.uom3_qty.toString(),
                        sale_unit: lineItem.sale_unit.toString()
                      }}
                      isPurchase={isPurchase}
                      tableMode={true}
                    />

                  </div>

                </div>

               



                <div className="w-[20%]">
                  <div className={`grid gap-2 ${isPurchase ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {/* Tier A */}
                    <div className="text-center">
                      {/* <div className="text-xs font-normal text-gray-500 mb-1">TIER A (%)</div> */}
                      <Input
                        type="number"
                        value={lineItem.Discount_A === '' ? '' : lineItem.Discount_A}
                        onChange={(e) => handleDiscountChange(index, 'A', e.target.value)}
                        placeholder="0"
                        step="0.1"
                        max="100"
                        className="w-full h-8 text-sm font-normal text-center pr-4 max-w-20"
                      />
                    </div>

                    {/* Only show B and C if not purchase */}
                    {!isPurchase && (
                      <>
                        <div className="text-center">
                          {/* <div className="text-xs font-normal text-gray-500 mb-1">TIER B (%)</div> */}
                          <Input
                            type="number"
                            value={lineItem.Discount_B === '' ? '' : lineItem.Discount_B}
                            onChange={(e) => handleDiscountChange(index, 'B', e.target.value)}
                            placeholder="0"
                            step="0.1"
                            max="100"
                            className="w-full h-8 text-sm font-normal text-center pr-4 max-w-20"
                          />
                        </div>
                        <div className="text-center">
                          {/* <div className="text-xs font-normal text-gray-500 mb-1">TIER C (%)</div> */}
                          <Input
                            type="number"
                            value={lineItem.Discount_C === '' ? '' : lineItem.Discount_C}
                            onChange={(e) => handleDiscountChange(index, 'C', e.target.value)}
                            placeholder="0"
                            step="0.1"
                            max="100"
                            className="w-full h-8 text-sm font-normal text-center pr-4 max-w-20"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Gross Total */}
                <div className='w-[16%]'>
                  <div className="text-center flex items-center justify-evenly px-1 space-x-7">
                    {/* <div className="text-xs font-normal text-gray-500">GROSS</div> */}
                    <div className="text-sm font-normal text-gray-900 mt-1">
                      {formatWithMathRound(lineItem.grossTotal)}
                    </div>
                    <div className="text-sm font-normal text-green-700 mt-1">
                      {formatWithMathRound(lineItem.netTotal)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-[3%]">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => deleteLine(index)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Delete line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ YOUR EXACT ORDER SUMMARY */}
      {lineItems.length > 0 && (
        <div className=" flex items-center justify-end p-2  bg-green-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-center w-30">
                {/* <div className="text-sm text-red-600">Total Discount:</div> */}
                <div className="font-semibold text-red-600">{formatWithMathRound(orderSummary.totalDiscount)}</div>
              </div>
              <div className="text-center w-30">
                {/* <div className="text-sm text-gray-600">Gross Total:</div> */}
                <div className="font-semibold">{formatWithMathRound(orderSummary.grossTotal)}</div>
              </div>

              <div className="text-center w-30">
                <div className=" font-semibold text-green-800  px-4 py-2 rounded-lg">
                  {formatWithMathRound(orderSummary.netTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ YOUR EXACT MODAL */}
      {showItemModal && (
        <MultiSelectItemTable
          onSelectionComplete={handleBulkItemSelection}
          onCancel={handleCloseModal}
          isPurchase={isPurchase}
          alreadyAddedItemIds={alreadyAddedItemIds}
        />
      )}
    </div>
  )
}

export default OrderDetails
