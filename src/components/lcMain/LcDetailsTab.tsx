// // components/lc-main/LcDetailsTab.tsx

// 'use client'
// import React, { useMemo } from 'react'
// import { Receipt } from 'lucide-react'
// import { DutyStructureItem } from './LcDutyStructure'
// import { GdnDetailData } from '@/store/slice/lcMainSlice'

// // =============================================
// // TYPES
// // =============================================

// interface LcDetailsTabProps {
//   gdnDetails: GdnDetailData[]  // Real-time from GDN
//   dutyItems: DutyStructureItem[]  // From state (stored)
//   exchangeRateDocuments: number
//   onPriceFCChange: (itemId: number, value: string) => void
//   disabled?: boolean
// }

// // =============================================
// // COMPONENT
// // =============================================

// const LcDetailsTab: React.FC<LcDetailsTabProps> = ({
//   gdnDetails,
//   dutyItems,
//   exchangeRateDocuments,
//   onPriceFCChange,
//   disabled = false
// }) => {

//   const calculatedItems = useMemo(() => {
//     return gdnDetails.map((gdn) => {
//       const itemId = gdn.item?.id || gdn.Item_ID
//       const itemName = gdn.item?.itemName || ''
//       const uom1Qty = parseFloat(gdn.uom1_qty) || 0
//       const uom2Qty = parseFloat(gdn.uom2_qty) || 0
//       const uom3Qty = parseFloat(gdn.uom3_qty) || 0
//       const uom1Name = gdn.item?.uom1?.uom || ''
//       const uom2Name = gdn.item?.uomTwo?.uom || ''
//       const uom3Name = gdn.item?.uomThree?.uom || ''

//       // Get priceFC from dutyItems (stored/editable)
//       const dutyItem = dutyItems.find(d => d.itemId === itemId)
//       const priceFC = parseFloat(dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0') || 0

//       // Calculations
//       const total = uom2Qty * priceFC
//       const totalPkr = total * exchangeRateDocuments

//       // Total Duty from duty structure
//       let totalDuty = 0
//       if (dutyItem) {
//         totalDuty = (parseFloat(dutyItem.cd) || 0) +
//           (parseFloat(dutyItem.acd) || 0) +
//           (parseFloat(dutyItem.rd) || 0) +
//           (parseFloat(dutyItem.salesTax) || 0) +
//           (parseFloat(dutyItem.addSalesTax) || 0) +
//           (parseFloat(dutyItem.itaxImport) || 0) +
//           (parseFloat(dutyItem.furtherTax) || 0) +
//           (parseFloat(dutyItem.incomeTaxWithheld) || 0)
//       }

//       const expense = 0
//       const totalNet = totalPkr + totalDuty + expense

//       return {
//         itemId,
//         itemName,
//         uom1Qty,
//         uom2Qty,
//         uom3Qty,
//         uom1Name,
//         uom2Name,
//         uom3Name,
//         priceFC: dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0',
//         total,
//         totalPkr,
//         totalDuty,
//         expense,
//         totalNet
//       }
//     })
//   }, [gdnDetails, dutyItems, exchangeRateDocuments])

//   const grandTotals = useMemo(() => {
//     return calculatedItems.reduce((acc, item) => ({
//       total: acc.total + item.total,
//       totalPkr: acc.totalPkr + item.totalPkr,
//       totalDuty: acc.totalDuty + item.totalDuty,
//       expense: acc.expense + item.expense,
//       totalNet: acc.totalNet + item.totalNet
//     }), { total: 0, totalPkr: 0, totalDuty: 0, expense: 0, totalNet: 0 })
//   }, [calculatedItems])

//   const formatNumber = (num: number, decimals: number = 2) =>
//     num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

//   if (gdnDetails.length === 0) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-8">
//         <div className="text-center text-gray-500">
//           <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium">No Details Data</p>
//           <p className="text-sm mt-1">Select LC to load GDN items</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200">
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//             <h2 className="text-lg font-semibold text-gray-900">Details</h2>
//             <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//               {gdnDetails.length} item{gdnDetails.length > 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="text-sm text-gray-600">
//             Exchange Rate: <span className="font-semibold">{exchangeRateDocuments}</span>
//           </div>
//         </div>
//       </div>

//       <div className="p-4 overflow-x-auto">
//         <table className="w-full min-w-[1200px]">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Item Name</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM1 Qty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM2 Qty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM3 Qty</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Price FC</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total PKR</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total Duty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">Expense</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total Net</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {calculatedItems.map((item, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
//                 <td className="px-2 py-2">
//                   <div className="text-sm font-medium text-gray-900 truncate">{item.itemName}</div>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(item.uom1Qty, 3)}
//                     {item.uom1Name && <span className="text-xs text-gray-400 ml-1">{item.uom1Name}</span>}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(item.uom2Qty, 3)}
//                     {item.uom2Name && <span className="text-xs text-gray-400 ml-1">{item.uom2Name}</span>}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(item.uom3Qty, 3)}
//                     {item.uom3Name && <span className="text-xs text-gray-400 ml-1">{item.uom3Name}</span>}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2">
//                   <input
//                     type="text"
//                     value={item.priceFC}
//                     onChange={(e) => onPriceFCChange(item.itemId, e.target.value)}
//                     disabled={disabled}
//                     className="w-full px-2 py-1.5 border border-blue-300 bg-blue-50 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
//                   />
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm text-gray-700">{formatNumber(item.total)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-medium text-green-600">{formatNumber(item.totalPkr)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm text-orange-600">{formatNumber(item.totalDuty)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm text-gray-700">{formatNumber(item.expense)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-bold text-[#509ee3]">{formatNumber(item.totalNet)}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-gray-50">
//             <tr>
//               <td colSpan={6} className="px-2 py-3 text-right font-semibold text-gray-900">Grand Totals:</td>
//               <td className="px-2 py-3 text-right font-semibold text-gray-700">{formatNumber(grandTotals.total)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-green-600">{formatNumber(grandTotals.totalPkr)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-orange-600">{formatNumber(grandTotals.totalDuty)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-gray-700">{formatNumber(grandTotals.expense)}</td>
//               <td className="px-2 py-3 text-right font-bold text-[#509ee3] text-base">{formatNumber(grandTotals.totalNet)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default LcDetailsTab

















































// // components/lc-main/LcDetailsTab.tsx

// 'use client'
// import React, { useMemo } from 'react'
// import { Receipt } from 'lucide-react'
// import { DutyStructureItem } from './LcDutyStructure'
// import { GdnDetailData } from '@/store/slice/lcMainSlice'

// // =============================================
// // TYPES
// // =============================================

// interface LcDetailsTabProps {
//   gdnDetails: GdnDetailData[]
//   dutyItems: DutyStructureItem[]
//   exchangeRateDocuments: number
//   totalExp: number  // ✅ NEW
//   landedCost: number  // ✅ NEW
//   onPriceFCChange: (itemId: number, value: string) => void
//   disabled?: boolean
// }

// // =============================================
// // HELPER
// // =============================================

// const safeValue = (val: any): number => {
//   const num = parseFloat(val)
//   return isNaN(num) ? 0 : num
// }

// // =============================================
// // COMPONENT
// // =============================================

// const LcDetailsTab: React.FC<LcDetailsTabProps> = ({
//   gdnDetails,
//   dutyItems,
//   exchangeRateDocuments,
//   totalExp,
//   landedCost,
//   onPriceFCChange,
//   disabled = false
// }) => {

//   // =============================================
//   // CALCULATIONS
//   // =============================================

//   const calculatedItems = useMemo(() => {
//     // First pass: calculate all row totals to get grand total
//     const itemsWithTotals = gdnDetails.map((gdn) => {
//       const itemId = gdn.item?.id || gdn.Item_ID
//       const itemName = gdn.item?.itemName || ''
//       const uom1Qty = parseFloat(gdn.uom1_qty) || 0
//       const uom2Qty = parseFloat(gdn.uom2_qty) || 0
//       const uom3Qty = parseFloat(gdn.uom3_qty) || 0
//       const uom1Name = gdn.item?.uom1?.uom || ''
//       const uom2Name = gdn.item?.uomTwo?.uom || ''
//       const uom3Name = gdn.item?.uomThree?.uom || ''

//       const dutyItem = dutyItems.find(d => d.itemId === itemId)
//       const priceFC = parseFloat(dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0') || 0

//       // Row total
//       const total = uom2Qty * priceFC
//       const totalPkr = total * exchangeRateDocuments

//       // =============================================
//       // CALCULATE Av_total (same as Calculation Tab)
//       // =============================================
//       const assessedPrice = safeValue(dutyItem?.assessedPrice)
//       const assessedQty = safeValue(dutyItem?.assessedQty)
//       const cd = safeValue(dutyItem?.cd)
//       const acd = safeValue(dutyItem?.acd)
//       const rd = safeValue(dutyItem?.rd)
//       const salesTax = safeValue(dutyItem?.salesTax)
//       const addSalesTax = safeValue(dutyItem?.addSalesTax)
//       const itaxImport = safeValue(dutyItem?.itaxImport)

//       const totalAssessableValue = assessedPrice * assessedQty
//       const effectiveLandedCost = landedCost || 1.01
//       const totalAvPkr = exchangeRateDocuments * totalAssessableValue * effectiveLandedCost

//       const Av_customDuty = (totalAvPkr * cd) / 100
//       const Av_acd = (totalAvPkr * acd) / 100
//       const Av_rd = (totalAvPkr * rd) / 100
//       const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
//       const Av_salesTax = (Av_base1 * salesTax) / 100
//       const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
//       const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
//       const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100

//       // Total Duty = Av_total
//       const totalDuty = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport

//       return {
//         itemId,
//         itemName,
//         uom1Qty,
//         uom2Qty,
//         uom3Qty,
//         uom1Name,
//         uom2Name,
//         uom3Name,
//         priceFC: dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0',
//         total,
//         totalPkr,
//         totalDuty
//       }
//     })

//     // Calculate grand total of all rows
//     const grandTotal = itemsWithTotals.reduce((sum, item) => sum + item.total, 0)

//     // Second pass: calculate expense allocation for each row
//     return itemsWithTotals.map(item => {
//       // Expense = (rowTotal / grandTotal) * totalExp
//       const expense = grandTotal > 0 ? (item.total / grandTotal) * totalExp : 0
//       const totalNet = item.totalPkr + item.totalDuty + expense

//       return {
//         ...item,
//         expense,
//         totalNet
//       }
//     })
//   }, [gdnDetails, dutyItems, exchangeRateDocuments, totalExp, landedCost])

//   // =============================================
//   // GRAND TOTALS
//   // =============================================

//   const grandTotals = useMemo(() => {
//     return calculatedItems.reduce((acc, item) => ({
//       total: acc.total + item.total,
//       totalPkr: acc.totalPkr + item.totalPkr,
//       totalDuty: acc.totalDuty + item.totalDuty,
//       expense: acc.expense + item.expense,
//       totalNet: acc.totalNet + item.totalNet
//     }), { total: 0, totalPkr: 0, totalDuty: 0, expense: 0, totalNet: 0 })
//   }, [calculatedItems])

//   const formatNumber = (num: number, decimals: number = 2) =>
//     num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

//   // =============================================
//   // EMPTY STATE
//   // =============================================

//   if (gdnDetails.length === 0) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-8">
//         <div className="text-center text-gray-500">
//           <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium">No Details Data</p>
//           <p className="text-sm mt-1">Select LC to load GDN items</p>
//         </div>
//       </div>
//     )
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="bg-white rounded-lg border border-gray-200">
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//             <h2 className="text-lg font-semibold text-gray-900">Details</h2>
//             <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//               {gdnDetails.length} item{gdnDetails.length > 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="flex gap-6 text-sm">
//             <div>
//               Exchange Rate: <span className="font-semibold text-[#509ee3]">{formatNumber(exchangeRateDocuments)}</span>
//             </div>
//             <div>
//               Total Expense: <span className="font-semibold text-orange-600">{formatNumber(totalExp)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="p-4 overflow-x-auto">
//         <table className="w-full min-w-[1100px]">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[120px]">Item Name</th>
//               {/* <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM1 Qty</th> */}
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-[50px]">UOM2 Qty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-[50px]">UOM3 Qty</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[50px]">Price FC</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-[80px]">Total FC</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-[100px]">Total PKR</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-[100px]">Total Duty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-[100px]">Expense</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-[50px]">Total Net</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {calculatedItems.map((item, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
//                 <td className="px-2 py-2">
//                   <div className="text-sm font-medium text-gray-900 truncate">{item.itemName}</div>
//                 </td>
//                 {/* <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(item.uom1Qty, 3)}
//                     {item.uom1Name && <span className="text-xs text-gray-400 ml-1">{item.uom1Name}</span>}
//                   </div>
//                 </td> */}
//                 <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(item.uom2Qty, 3)}
//                     {item.uom2Name && <span className="text-xs text-gray-400 ml-1">{item.uom2Name}</span>}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(item.uom3Qty, 3)}
//                     {item.uom3Name && <span className="text-xs text-gray-400 ml-1">{item.uom3Name}</span>}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 flex space-x-1 items-center  ">
//                   <input
//                     type="text"
//                     value={item.priceFC}
//                     onChange={(e) => onPriceFCChange(item.itemId, e.target.value)}
//                     disabled={disabled}
//                     className="w-22 px-2 py-1.5 border border-blue-300 bg-blue-50 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
//                   />
//                   <div className='text-gray-500 text-xs'>/{item.uom2Name}</div>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm text-gray-700">{formatNumber(item.total)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-medium text-green-600">{formatNumber(item.totalPkr)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-medium text-purple-600">{formatNumber(item.totalDuty)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-medium text-orange-600">{formatNumber(item.expense)}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-bold text-[#509ee3]">{formatNumber(item.totalNet)}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-gray-50">
//             <tr>
//               <td colSpan={5} className="px-2 py-3 text-right font-semibold text-gray-900">Grand Totals:</td>
//               <td className="px-2 py-3 text-right font-semibold text-gray-700">{formatNumber(grandTotals.total)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-green-600">{formatNumber(grandTotals.totalPkr)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-purple-600">{formatNumber(grandTotals.totalDuty)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-orange-600">{formatNumber(grandTotals.expense)}</td>
//               <td className="px-2 py-3 text-right font-bold text-[#509ee3] text-base">{formatNumber(grandTotals.totalNet)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default LcDetailsTab



















































// // components/lc-main/LcDetailsTab.tsx

// 'use client'
// import React, { useMemo } from 'react'
// import { Receipt } from 'lucide-react'
// import { DutyStructureItem } from './LcDutyStructure'
// import { GdnDetailData } from '@/store/slice/lcMainSlice'

// // =============================================
// // TYPES
// // =============================================

// interface LcDetailsTabProps {
//   gdnDetails: GdnDetailData[]
//   dutyItems: DutyStructureItem[]
//   exchangeRateDocuments: number
//   totalExp: number
//   landedCost: number
//   onPriceFCChange: (itemId: number, value: string) => void
//   disabled?: boolean
// }

// // =============================================
// // HELPER
// // =============================================

// const safeValue = (val: any): number => {
//   const num = parseFloat(val)
//   return isNaN(num) ? 0 : num
// }

// // =============================================
// // COMPONENT
// // =============================================

// const LcDetailsTab: React.FC<LcDetailsTabProps> = ({
//   gdnDetails,
//   dutyItems,
//   exchangeRateDocuments,
//   totalExp,
//   landedCost,
//   onPriceFCChange,
//   disabled = false
// }) => {

//   // =============================================
//   // CALCULATIONS
//   // =============================================

//   const calculatedItems = useMemo(() => {
//     // First pass: calculate all row totals to get grand total
//     const itemsWithTotals = gdnDetails.map((gdn) => {
//       const itemId = gdn.item?.id || gdn.Item_ID
//       const itemName = gdn.item?.itemName || ''
//       const uom1Qty = parseFloat(gdn.uom1_qty) || 0
//       const uom2Qty = parseFloat(gdn.uom2_qty) || 0
//       const uom3Qty = parseFloat(gdn.uom3_qty) || 0
//       const uom1Name = gdn.item?.uom1?.uom || ''
//       const uom2Name = gdn.item?.uomTwo?.uom || ''
//       const uom3Name = gdn.item?.uomThree?.uom || ''

//       const dutyItem = dutyItems.find(d => d.itemId === itemId)
//       const priceFC = parseFloat(dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0') || 0

//       // Row total
//       const total = uom2Qty * priceFC
//       const totalPkr = total * exchangeRateDocuments

//       // =============================================
//       // CALCULATE Av_total (same as Calculation Tab)
//       // =============================================
//       const assessedPrice = safeValue(dutyItem?.assessedPrice)
//       const assessedQty = safeValue(dutyItem?.assessedQty)
//       const cd = safeValue(dutyItem?.cd)
//       const acd = safeValue(dutyItem?.acd)
//       const rd = safeValue(dutyItem?.rd)
//       const salesTax = safeValue(dutyItem?.salesTax)
//       const addSalesTax = safeValue(dutyItem?.addSalesTax)
//       const itaxImport = safeValue(dutyItem?.itaxImport)

//       const totalAssessableValue = assessedPrice * assessedQty
//       const effectiveLandedCost = landedCost || 1.01
//       const totalAvPkr = exchangeRateDocuments * totalAssessableValue * effectiveLandedCost

//       const Av_customDuty = (totalAvPkr * cd) / 100
//       const Av_acd = (totalAvPkr * acd) / 100
//       const Av_rd = (totalAvPkr * rd) / 100
//       const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
//       const Av_salesTax = (Av_base1 * salesTax) / 100
//       const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
//       const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
//       const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100

//       // Total Duty = Av_total
//       const totalDuty = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport

//       return {
//         itemId,
//         itemName,
//         uom1Qty,
//         uom2Qty,
//         uom3Qty,
//         uom1Name,
//         uom2Name,
//         uom3Name,
//         priceFC: dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0',
//         total,
//         totalPkr,
//         totalDuty
//       }
//     })

//     // Calculate grand total of all rows (sum of rounded values)
//     const grandTotal = itemsWithTotals.reduce((sum, item) => {
//       return sum + Math.round(item.total)
//     }, 0)

//     // Second pass: calculate expense allocation for each row
//     return itemsWithTotals.map(item => {
//       // Expense = (rowTotal / grandTotal) * totalExp
//       const expense = grandTotal > 0 ? (Math.round(item.total) / grandTotal) * totalExp : 0
//       const totalNet = Math.round(item.totalPkr) + Math.round(item.totalDuty) + Math.round(expense)

//       return {
//         ...item,
//         expense,
//         totalNet
//       }
//     })
//   }, [gdnDetails, dutyItems, exchangeRateDocuments, totalExp, landedCost])

//   // =============================================
//   // GRAND TOTALS (Sum of rounded values)
//   // =============================================

//   const grandTotals = useMemo(() => {
//     return calculatedItems.reduce((acc, item) => ({
//       total: acc.total + Math.round(item.total),
//       totalPkr: acc.totalPkr + Math.round(item.totalPkr),
//       totalDuty: acc.totalDuty + Math.round(item.totalDuty),
//       expense: acc.expense + Math.round(item.expense),
//       totalNet: acc.totalNet + Math.round(item.totalNet)
//     }), { total: 0, totalPkr: 0, totalDuty: 0, expense: 0, totalNet: 0 })
//   }, [calculatedItems])

//   // ✅ No decimal places
//   const formatNumber = (num: number) =>
//     num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

//   // =============================================
//   // EMPTY STATE
//   // =============================================

//   if (gdnDetails.length === 0) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-8">
//         <div className="text-center text-gray-500">
//           <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium">No Details Data</p>
//           <p className="text-sm mt-1">Select LC to load GDN items</p>
//         </div>
//       </div>
//     )
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div className="bg-white rounded-lg border border-gray-200">
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//             <h2 className="text-lg font-semibold text-gray-900">Details</h2>
//             <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//               {gdnDetails.length} item{gdnDetails.length > 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="flex gap-6 text-sm">
//             <div>
//               Exchange Rate: <span className="font-semibold text-[#509ee3]">{formatNumber(Math.round(exchangeRateDocuments))}</span>
//             </div>
//             <div>
//               Total Expense: <span className="font-semibold text-orange-600">{formatNumber(Math.round(totalExp))}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="p-4 overflow-x-auto">
//         <table className="w-full min-w-[1100px]">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Item Name</th>
//               {/* <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM1 Qty</th> */}
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM2 Qty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM3 Qty</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[130px]">Price FC</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total FC</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total PKR</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total Duty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Expense</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total Net</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {calculatedItems.map((item, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
//                 <td className="px-2 py-2">
//                   <div className="text-sm font-medium text-gray-900 truncate">{item.itemName}</div>
//                 </td>
//                 {/* <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(Math.round(item.uom1Qty))}
//                     {item.uom1Name && <span className="text-xs text-gray-400 ml-1">{item.uom1Name}</span>}
//                   </div>
//                 </td> */}
//                 <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(Math.round(item.uom2Qty))}
//                     {item.uom2Name && <span className="text-xs text-gray-400 ml-1">{item.uom2Name}</span>}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <div className="text-sm text-gray-700">
//                     {formatNumber(Math.round(item.uom3Qty))}
//                     {item.uom3Name && <span className="text-xs text-gray-400 ml-1">{item.uom3Name}</span>}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 flex space-x-1 items-center">
//                   <input
//                     type="text"
//                     value={item.priceFC}
//                     onChange={(e) => onPriceFCChange(item.itemId, e.target.value)}
//                     disabled={disabled}
//                     className="w-full px-2 py-1.5 border border-blue-300 bg-blue-50 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
//                   />
//                   <div className='text-gray-500 text-xs'>/{item.uom2Name }</div>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm text-gray-700">{formatNumber(Math.round(item.total))}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-medium text-green-600">{formatNumber(Math.round(item.totalPkr))}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-medium text-purple-600">{formatNumber(Math.round(item.totalDuty))}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-medium text-orange-600">{formatNumber(Math.round(item.expense))}</span>
//                 </td>
//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-bold text-[#509ee3]">{formatNumber(Math.round(item.totalNet))}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-gray-50">
//             <tr>
//               <td colSpan={5} className="px-2 py-3 text-right font-semibold text-gray-900">Grand Totals:</td>
//               <td className="px-2 py-3 text-right font-semibold text-gray-700">{formatNumber(grandTotals.total)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-green-600">{formatNumber(grandTotals.totalPkr)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-purple-600">{formatNumber(grandTotals.totalDuty)}</td>
//               <td className="px-2 py-3 text-right font-semibold text-orange-600">{formatNumber(grandTotals.expense)}</td>
//               <td className="px-2 py-3 text-right font-bold text-[#509ee3] text-base">{formatNumber(grandTotals.totalNet)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default LcDetailsTab




































// components/lc-main/LcDetailsTab.tsx

'use client'
import React, { useMemo } from 'react'
import { Receipt } from 'lucide-react'
import { DutyStructureItem } from './LcDutyStructure'
import { GdnDetailData } from '@/store/slice/lcMainSlice'

// =============================================
// TYPES
// =============================================

interface LcDetailsTabProps {
  gdnDetails: GdnDetailData[]
  dutyItems: DutyStructureItem[]
  exchangeRateDocuments: number
  exchangeRateDuty: number
  totalExp: number
  landedCost: number
  onPriceFCChange: (itemId: number, value: string) => void
  disabled?: boolean
}

// =============================================
// HELPER
// =============================================

const safeValue = (val: any): number => {
  const num = parseFloat(val)
  return isNaN(num) ? 0 : num
}

// =============================================
// COMPONENT
// =============================================

const LcDetailsTab: React.FC<LcDetailsTabProps> = ({
  gdnDetails,
  dutyItems,
  exchangeRateDocuments,
  exchangeRateDuty,
  totalExp,
  landedCost,
  onPriceFCChange,
  disabled = false
}) => {

  // =============================================
  // CALCULATIONS
  // =============================================

  const calculatedItems = useMemo(() => {
    // First pass: calculate all row totals to get grand total
    const itemsWithTotals = gdnDetails.map((gdn) => {
      const itemId = gdn.item?.id || gdn.Item_ID
      const itemName = gdn.item?.itemName || ''
      const uom1Qty = parseFloat(gdn.uom1_qty) || 0
      const uom2Qty = parseFloat(gdn.uom2_qty) || 0
      const uom3Qty = parseFloat(gdn.uom3_qty) || 0
      const uom1Name = gdn.item?.uom1?.uom || ''
      const uom2Name = gdn.item?.uomTwo?.uom || ''
      const uom3Name = gdn.item?.uomThree?.uom || ''

      const dutyItem = dutyItems.find(d => d.itemId === itemId)
      const priceFC = parseFloat(dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0') || 0



      // Row total
      const total = uom2Qty * priceFC
      const totalPkr = total * exchangeRateDocuments

      // =============================================
      // CALCULATE Av_total (same as Calculation Tab)
      // =============================================
      const assessedPrice = safeValue(dutyItem?.assessedPrice)
      const assessedQty = safeValue(dutyItem?.assessedQty)
      const cd = safeValue(dutyItem?.cd)
      const acd = safeValue(dutyItem?.acd)
      const rd = safeValue(dutyItem?.rd)
      const salesTax = safeValue(dutyItem?.salesTax)
      const addSalesTax = safeValue(dutyItem?.addSalesTax)
      const itaxImport = safeValue(dutyItem?.itaxImport)

      const totalAssessableValue = assessedPrice * assessedQty
      const effectiveLandedCost = landedCost || 1.01
      const totalAvPkr = exchangeRateDuty * totalAssessableValue * effectiveLandedCost
      console.log('Calculating item:', itemName, 'with assessedPrice:', assessedPrice, 'assessedQty:', assessedQty, 'totalAssessableValue:', totalAssessableValue, 'effectiveLandedCost:', effectiveLandedCost, 'ExchangeRate:', exchangeRateDocuments, 'totalAvPkr = exchangeRateDocuments * totalAssessableValue * effectiveLandedCost', 'totalAvPkr:', totalAvPkr);

      const Av_customDuty = (totalAvPkr * cd) / 100
      const Av_acd = (totalAvPkr * acd) / 100
      const Av_rd = (totalAvPkr * rd) / 100
      const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
      const Av_salesTax = (Av_base1 * salesTax) / 100
      const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
      const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
      const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100

      // Total Duty = Av_total
      const totalDuty = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport

      //  console.log('Calculating item:', itemName, 'with priceFC:', priceFC, 'Exchange rate:', exchangeRateDocuments, 'landed cost:',landedCost  , 'total:', total, 'totalPkr:', totalPkr, 'totalDuty:', totalDuty);

      return {
        itemId,
        itemName,
        uom1Qty,
        uom2Qty,
        uom3Qty,
        uom1Name,
        uom2Name,
        uom3Name,
        priceFC: dutyItem?.priceFC || '0',
        total,
        totalPkr,
        totalAvPkr,
        totalDuty
      }
    })

    // Calculate grand total of all rows (sum of rounded values)
    const grandTotal = itemsWithTotals.reduce((sum, item) => {
      return sum + Math.round(item.total)
    }, 0)

    // Second pass: calculate expense allocation for each row
    return itemsWithTotals.map(item => {
      // Expense = (rowTotal / grandTotal) * totalExp
      const expense = grandTotal > 0 ? (Math.round(item.total) / grandTotal) * totalExp : 0
      const totalNet = Math.round(item.totalPkr) + Math.round(item.totalDuty) + Math.round(expense)

      return {
        ...item,
        expense,
        totalNet
      }
    })
  }, [gdnDetails, dutyItems, exchangeRateDocuments, totalExp, landedCost])

  // =============================================
  // GRAND TOTALS (Sum of rounded values)
  // =============================================

  const grandTotals = useMemo(() => {
    return calculatedItems.reduce((acc, item) => ({
      total: acc.total + Math.round(item.total),
      totalPkr: acc.totalPkr + Math.round(item.totalPkr),
      totalDuty: acc.totalDuty + Math.round(item.totalDuty),
      expense: acc.expense + Math.round(item.expense),
      totalNet: acc.totalNet + Math.round(item.totalNet)
    }), { total: 0, totalPkr: 0, totalDuty: 0, expense: 0, totalNet: 0 })
  }, [calculatedItems])

  // ✅ No decimal places
  const formatNumber = (num: number) =>
    num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  // =============================================
  // EMPTY STATE
  // =============================================

  if (gdnDetails.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Details Data</p>
          <p className="text-sm mt-1">Select LC to load GDN items</p>
        </div>
      </div>
    )
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
            <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
              {gdnDetails.length} item{gdnDetails.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              Exchange Rate Document: <span className="font-semibold text-[#509ee3]">{exchangeRateDocuments}</span>
            </div>
            <div>
              Exchange Rate Duty: <span className="font-semibold text-[#509ee3]">{exchangeRateDuty}</span>
            </div>
            <div>
              Total Expense: <span className="font-semibold text-orange-600">{formatNumber(Math.round(totalExp))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Item Name</th>
              {/* <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM1 Qty</th> */}
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM2 Qty</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[80px]">UOM3 Qty</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-[130px]">Price FC</th>
              <th className="px-2 py-3 text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total FC</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total PKR</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total Duty</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Expense</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {calculatedItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
                <td className="px-2 py-2">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.itemName}</div>
                </td>
                {/* <td className="px-2 py-2 text-right">
                  <div className="text-sm text-gray-700">
                    {formatNumber(Math.round(item.uom1Qty))}
                    {item.uom1Name && <span className="text-xs text-gray-400 ml-1">{item.uom1Name}</span>}
                  </div>
                </td> */}
                <td className="px-2 py-2 text-right">
                  <div className="text-sm text-gray-700">
                    {formatNumber(Math.round(item.uom2Qty))}
                    {item.uom2Name && <span className="text-xs text-gray-400 ml-1">{item.uom2Name}
                      
                      </span>}
                  </div>
                </td>
                <td className="px-2 py-2 text-right">
                  <div className="text-sm text-gray-700">
                    {formatNumber(Math.round(item.uom3Qty))}
                    {item.uom3Name && <span className="text-xs text-gray-400 ml-1">{item.uom3Name}</span>}
                  </div>
                </td>
                <td className="px-2 py-2 flex space-x-1 items-center ">
                  <input
                    type="text"
                    value={item.priceFC}
                    onChange={(e) => onPriceFCChange(item.itemId, e.target.value)}
                    disabled={disabled}
                    className="w-full px-2 py-1.5 border border-blue-300 bg-blue-50 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
                  />
                  <div className='text-gray-400 text-xs'> /{item.uom2Name}</div>
                </td>
                <td className="px-2 py-2 text-center">
                  <span className="text-sm text-gray-700">{formatNumber(Math.round(item.total))}</span>
                </td>
                <td className="px-2 py-2 text-right">
                  <span className="text-sm font-medium text-green-600">{formatNumber(Math.round(item.totalPkr))}</span>
                </td>
                <td className="px-2 py-2 text-right">
                  <span className="text-sm font-medium text-purple-600">{formatNumber(Math.round(item.totalDuty))}</span>
                </td>
                <td className="px-2 py-2 text-right">
                  <span className="text-sm font-medium text-orange-600">{formatNumber(Math.round(item.expense))}</span>
                </td>
                <td className="px-2 py-2 text-right">
                  <span className="text-sm font-bold text-[#509ee3]">{formatNumber(Math.round(item.totalNet))}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={5} className="px-2 py-3 text-right font-semibold text-gray-900">Grand Totals:</td>
              <td className="px-2 py-3 text-center font-semibold text-gray-700">{formatNumber(grandTotals.total)}</td>
              <td className="px-2 py-3 text-right font-semibold text-green-600">{formatNumber(grandTotals.totalPkr)}</td>
              <td className="px-2 py-3 text-right font-semibold text-purple-600">{formatNumber(grandTotals.totalDuty)}</td>
              <td className="px-2 py-3 text-right font-semibold text-orange-600">{formatNumber(grandTotals.expense)}</td>
              <td className="px-2 py-3 text-right font-bold text-[#509ee3] text-base">{formatNumber(grandTotals.totalNet)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default LcDetailsTab
