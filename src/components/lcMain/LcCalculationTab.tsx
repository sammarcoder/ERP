// // components/lc-main/LcCalculationTab.tsx

// 'use client'
// import React, { useMemo } from 'react'
// import { Calculator } from 'lucide-react'
// import { DutyStructureItem } from './LcDutyStructure'
// import { GdnDetailData } from '@/store/slice/lcMainSlice'

// // =============================================
// // TYPES
// // =============================================

// interface LcCalculationTabProps {
//   gdnDetails: GdnDetailData[]
//   dutyItems: DutyStructureItem[]
//   exchangeRate: number
//   landedCost: number
// }

// interface CalculatedItem {
//   itemId: number
//   itemName: string
//   totalAssessableValue: number
//   totalDeclaredValue: number
//   totalAvPkr: number
//   totalDvPkr: number
//   Av_customDuty: number
//   Av_acd: number
//   Av_rd: number
//   Av_salesTax: number
//   Av_additionalSalesTax: number
//   Av_incomeTaxImport: number
//   Av_furtherTax: number
//   Av_incomeTaxWithheld: number
//   Av_total: number
//   Av_GrandTotal: number
//   Dv_customDuty: number
//   Dv_acd: number
//   Dv_rd: number
//   Dv_salesTax: number
//   Dv_additionalSalesTax: number
//   Dv_incomeTaxImport: number
//   Dv_furtherTax: number
//   Dv_incomeTaxWithheld: number
//   Dv_total: number
//   Dv_GrandTotal: number
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

// const LcCalculationTab: React.FC<LcCalculationTabProps> = ({
//   gdnDetails,
//   dutyItems,
//   exchangeRate,
//   landedCost
// }) => {

//   const calculatedItems = useMemo((): CalculatedItem[] => {
//     return gdnDetails.map((gdn) => {
//       const itemId = gdn.item?.id || gdn.Item_ID
//       const itemName = gdn.item?.itemName || ''
//       const uom2Qty = safeValue(gdn.uom2_qty)

//       const dutyItem = dutyItems.find(d => d.itemId === itemId)

//       const assessedPrice = safeValue(dutyItem?.assessedPrice)
//       const assessedQty = safeValue(dutyItem?.assessedQty)
//       const priceFC = safeValue(dutyItem?.priceFC || gdn.item?.purchasePriceFC)

//       const cd = safeValue(dutyItem?.cd)
//       const acd = safeValue(dutyItem?.acd)
//       const rd = safeValue(dutyItem?.rd)
//       const salesTax = safeValue(dutyItem?.salesTax)
//       const addSalesTax = safeValue(dutyItem?.addSalesTax)
//       const itaxImport = safeValue(dutyItem?.itaxImport)
//       const furtherTax = safeValue(dutyItem?.furtherTax)
//       const incomeTaxWithheld = safeValue(dutyItem?.incomeTaxWithheld)

//       const totalAssessableValue = assessedPrice * assessedQty
//       const totalDeclaredValue = priceFC * uom2Qty

//       const effectiveLandedCost = landedCost || 1.01
//       const effectiveExchangeRate = exchangeRate || 1

//       const totalAvPkr = effectiveExchangeRate * totalAssessableValue * effectiveLandedCost
//       const totalDvPkr = effectiveExchangeRate * totalDeclaredValue * effectiveLandedCost

//       // AV Calculations
//       const Av_customDuty = (totalAvPkr * cd) / 100
//       const Av_acd = (totalAvPkr * acd) / 100
//       const Av_rd = (totalAvPkr * rd) / 100
//       const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
//       const Av_salesTax = (Av_base1 * salesTax) / 100
//       const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
//       const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
//       const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100
//       const astSalesTaxRatio = salesTax > 0 ? (1 + (addSalesTax / salesTax)) : 1
//       const Av_furtherTax = astSalesTaxRatio * Av_base1 * (furtherTax / 100)
//       const Av_incomeTaxWithheld = astSalesTaxRatio * Av_base2 * (incomeTaxWithheld / 100)
//       const Av_total = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport
//       const Av_GrandTotal = Av_total + Av_furtherTax + Av_incomeTaxWithheld

//       // DV Calculations
//       const Dv_customDuty = (totalDvPkr * cd) / 100
//       const Dv_acd = (totalDvPkr * acd) / 100
//       const Dv_rd = (totalDvPkr * rd) / 100
//       const Dv_base1 = totalDvPkr + Dv_customDuty + Dv_acd + Dv_rd
//       const Dv_salesTax = (Dv_base1 * salesTax) / 100
//       const Dv_additionalSalesTax = (Dv_base1 * addSalesTax) / 100
//       const Dv_base2 = Dv_base1 + Dv_salesTax + Dv_additionalSalesTax
//       const Dv_incomeTaxImport = (Dv_base2 * itaxImport) / 100
//       const Dv_furtherTax = astSalesTaxRatio * Dv_base1 * (furtherTax / 100)
//       const Dv_incomeTaxWithheld = astSalesTaxRatio * Dv_base2 * (incomeTaxWithheld / 100)
//       const Dv_total = Dv_customDuty + Dv_acd + Dv_rd + Dv_salesTax + Dv_additionalSalesTax + Dv_incomeTaxImport
//       const Dv_GrandTotal = Dv_total + Dv_furtherTax + Dv_incomeTaxWithheld

//       return {
//         itemId, itemName, totalAssessableValue, totalDeclaredValue, totalAvPkr, totalDvPkr,
//         Av_customDuty, Av_acd, Av_rd, Av_salesTax, Av_additionalSalesTax, Av_incomeTaxImport,
//         Av_furtherTax, Av_incomeTaxWithheld, Av_total, Av_GrandTotal,
//         Dv_customDuty, Dv_acd, Dv_rd, Dv_salesTax, Dv_additionalSalesTax, Dv_incomeTaxImport,
//         Dv_furtherTax, Dv_incomeTaxWithheld, Dv_total, Dv_GrandTotal
//       }
//     })
//   }, [gdnDetails, dutyItems, exchangeRate, landedCost])

//   const grandTotals = useMemo(() => {
//     return calculatedItems.reduce((acc, item) => ({
//       totalAvPkr: acc.totalAvPkr + item.totalAvPkr,
//       totalDvPkr: acc.totalDvPkr + item.totalDvPkr,
//       Av_customDuty: acc.Av_customDuty + item.Av_customDuty,
//       Av_acd: acc.Av_acd + item.Av_acd,
//       Av_rd: acc.Av_rd + item.Av_rd,
//       Av_salesTax: acc.Av_salesTax + item.Av_salesTax,
//       Av_additionalSalesTax: acc.Av_additionalSalesTax + item.Av_additionalSalesTax,
//       Av_incomeTaxImport: acc.Av_incomeTaxImport + item.Av_incomeTaxImport,
//       Av_furtherTax: acc.Av_furtherTax + item.Av_furtherTax,
//       Av_incomeTaxWithheld: acc.Av_incomeTaxWithheld + item.Av_incomeTaxWithheld,
//       Av_total: acc.Av_total + item.Av_total,
//       Av_GrandTotal: acc.Av_GrandTotal + item.Av_GrandTotal,
//       Dv_customDuty: acc.Dv_customDuty + item.Dv_customDuty,
//       Dv_acd: acc.Dv_acd + item.Dv_acd,
//       Dv_rd: acc.Dv_rd + item.Dv_rd,
//       Dv_salesTax: acc.Dv_salesTax + item.Dv_salesTax,
//       Dv_additionalSalesTax: acc.Dv_additionalSalesTax + item.Dv_additionalSalesTax,
//       Dv_incomeTaxImport: acc.Dv_incomeTaxImport + item.Dv_incomeTaxImport,
//       Dv_furtherTax: acc.Dv_furtherTax + item.Dv_furtherTax,
//       Dv_incomeTaxWithheld: acc.Dv_incomeTaxWithheld + item.Dv_incomeTaxWithheld,
//       Dv_total: acc.Dv_total + item.Dv_total,
//       Dv_GrandTotal: acc.Dv_GrandTotal + item.Dv_GrandTotal
//     }), {
//       totalAvPkr: 0, totalDvPkr: 0,
//       Av_customDuty: 0, Av_acd: 0, Av_rd: 0, Av_salesTax: 0, Av_additionalSalesTax: 0,
//       Av_incomeTaxImport: 0, Av_furtherTax: 0, Av_incomeTaxWithheld: 0, Av_total: 0, Av_GrandTotal: 0,
//       Dv_customDuty: 0, Dv_acd: 0, Dv_rd: 0, Dv_salesTax: 0, Dv_additionalSalesTax: 0,
//       Dv_incomeTaxImport: 0, Dv_furtherTax: 0, Dv_incomeTaxWithheld: 0, Dv_total: 0, Dv_GrandTotal: 0
//     })
//   }, [calculatedItems])

//   const formatNumber = (num: number) =>
//     num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

//   if (gdnDetails.length === 0) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-8">
//         <div className="text-center text-gray-500">
//           <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium">No Calculation Data</p>
//           <p className="text-sm mt-1">Select LC to load GDN items</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header Info */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Calculator className="w-5 h-5 mr-2 text-[#509ee3]" />
//             <h2 className="text-lg font-semibold text-gray-900">Calculation Summary</h2>
//           </div>
//           <div className="flex gap-6 text-sm">
//             <div>Exchange Rate: <span className="font-semibold text-[#509ee3]">{exchangeRate || 0}</span></div>
//             <div>Landed Cost: <span className="font-semibold text-[#509ee3]">{landedCost || 1.01}</span></div>
//           </div>
//         </div>
//       </div>

//       {/* Per Item Calculations */}
//       {calculatedItems.map((item, index) => (
//         <div key={item.itemId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
//             <div className="flex items-center">
//               <span className="w-8 h-8 bg-gradient-to-r from-[#509ee3] to-[#4990d6] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">
//                 {index + 1}
//               </span>
//               <span className="font-semibold text-gray-900">{item.itemName}</span>
//             </div>
//           </div>

//           <div className="p-4">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
//                   <th className="px-3 py-2 text-right text-xs font-semibold text-blue-700 uppercase">AV (Assessed)</th>
//                   <th className="px-3 py-2 text-right text-xs font-semibold text-green-700 uppercase">DV (Declared)</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 <tr className="bg-blue-50/30">
//                   <td className="px-3 py-2 text-sm font-medium text-gray-700">Total Value (FC)</td>
//                   <td className="px-3 py-2 text-sm text-right text-blue-600">{formatNumber(item.totalAssessableValue)}</td>
//                   <td className="px-3 py-2 text-sm text-right text-green-600">{formatNumber(item.totalDeclaredValue)}</td>
//                 </tr>
//                 <tr className="bg-blue-50/50">
//                   <td className="px-3 py-2 text-sm font-medium text-gray-700">Total Value (PKR)</td>
//                   <td className="px-3 py-2 text-sm text-right font-semibold text-blue-600">{formatNumber(item.totalAvPkr)}</td>
//                   <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">{formatNumber(item.totalDvPkr)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Custom Duty (CD)</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_customDuty)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_customDuty)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Additional Custom Duty (ACD)</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_acd)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_acd)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Regulatory Duty (RD)</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_rd)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_rd)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Sales Tax</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_salesTax)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_salesTax)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Additional Sales Tax</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_additionalSalesTax)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_additionalSalesTax)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Income Tax Import</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_incomeTaxImport)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_incomeTaxImport)}</td>
//                 </tr>
//                 <tr className="bg-orange-50">
//                   <td className="px-3 py-2 text-sm font-semibold text-gray-700">Sub Total</td>
//                   <td className="px-3 py-2 text-sm text-right font-semibold text-blue-600">{formatNumber(item.Av_total)}</td>
//                   <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">{formatNumber(item.Dv_total)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Further Tax</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_furtherTax)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_furtherTax)}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-600">Income Tax Withheld</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Av_incomeTaxWithheld)}</td>
//                   <td className="px-3 py-2 text-sm text-right">{formatNumber(item.Dv_incomeTaxWithheld)}</td>
//                 </tr>
//                 <tr className="bg-gradient-to-r from-blue-100 to-green-100">
//                   <td className="px-3 py-3 text-sm font-bold text-gray-900">GRAND TOTAL</td>
//                   <td className="px-3 py-3 text-sm text-right font-bold text-blue-700">{formatNumber(item.Av_GrandTotal)}</td>
//                   <td className="px-3 py-3 text-sm text-right font-bold text-green-700">{formatNumber(item.Dv_GrandTotal)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}

//       {/* Overall Grand Totals */}
//       <div className="bg-gradient-to-r from-[#509ee3] to-[#4990d6] rounded-lg p-6 text-white">
//         <h3 className="text-lg font-bold mb-4 flex items-center">
//           <Calculator className="w-5 h-5 mr-2" />
//           Overall Grand Totals ({calculatedItems.length} items)
//         </h3>

//         <div className="grid grid-cols-2 gap-6">
//           {/* AV Column */}
//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-100 mb-3">Assessed Value (AV)</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between"><span>Total PKR:</span><span className="font-semibold">{formatNumber(grandTotals.totalAvPkr)}</span></div>
//               <div className="flex justify-between"><span>Custom Duty:</span><span>{formatNumber(grandTotals.Av_customDuty)}</span></div>
//               <div className="flex justify-between"><span>ACD:</span><span>{formatNumber(grandTotals.Av_acd)}</span></div>
//               <div className="flex justify-between"><span>RD:</span><span>{formatNumber(grandTotals.Av_rd)}</span></div>
//               <div className="flex justify-between"><span>Sales Tax:</span><span>{formatNumber(grandTotals.Av_salesTax)}</span></div>
//               <div className="flex justify-between"><span>Add. Sales Tax:</span><span>{formatNumber(grandTotals.Av_additionalSalesTax)}</span></div>
//               <div className="flex justify-between"><span>I.Tax Import:</span><span>{formatNumber(grandTotals.Av_incomeTaxImport)}</span></div>
//               <div className="flex justify-between border-t border-white/20 pt-2 mt-2"><span>Sub Total:</span><span className="font-semibold">{formatNumber(grandTotals.Av_total)}</span></div>
//               <div className="flex justify-between"><span>Further Tax:</span><span>{formatNumber(grandTotals.Av_furtherTax)}</span></div>
//               <div className="flex justify-between"><span>I.Tax Withheld:</span><span>{formatNumber(grandTotals.Av_incomeTaxWithheld)}</span></div>
//               <div className="flex justify-between border-t border-white/30 pt-2 mt-2 text-base"><span className="font-bold">GRAND TOTAL:</span><span className="font-bold text-yellow-300">{formatNumber(grandTotals.Av_GrandTotal)}</span></div>
//             </div>
//           </div>

//           {/* DV Column */}
//           <div className="bg-white/10 rounded-lg p-4">
//             <h4 className="font-semibold text-green-100 mb-3">Declared Value (DV)</h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between"><span>Total PKR:</span><span className="font-semibold">{formatNumber(grandTotals.totalDvPkr)}</span></div>
//               <div className="flex justify-between"><span>Custom Duty:</span><span>{formatNumber(grandTotals.Dv_customDuty)}</span></div>
//               <div className="flex justify-between"><span>ACD:</span><span>{formatNumber(grandTotals.Dv_acd)}</span></div>
//               <div className="flex justify-between"><span>RD:</span><span>{formatNumber(grandTotals.Dv_rd)}</span></div>
//               <div className="flex justify-between"><span>Sales Tax:</span><span>{formatNumber(grandTotals.Dv_salesTax)}</span></div>
//               <div className="flex justify-between"><span>Add. Sales Tax:</span><span>{formatNumber(grandTotals.Dv_additionalSalesTax)}</span></div>
//               <div className="flex justify-between"><span>I.Tax Import:</span><span>{formatNumber(grandTotals.Dv_incomeTaxImport)}</span></div>
//               <div className="flex justify-between border-t border-white/20 pt-2 mt-2"><span>Sub Total:</span><span className="font-semibold">{formatNumber(grandTotals.Dv_total)}</span></div>
//               <div className="flex justify-between"><span>Further Tax:</span><span>{formatNumber(grandTotals.Dv_furtherTax)}</span></div>
//               <div className="flex justify-between"><span>I.Tax Withheld:</span><span>{formatNumber(grandTotals.Dv_incomeTaxWithheld)}</span></div>
//               <div className="flex justify-between border-t border-white/30 pt-2 mt-2 text-base"><span className="font-bold">GRAND TOTAL:</span><span className="font-bold text-yellow-300">{formatNumber(grandTotals.Dv_GrandTotal)}</span></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LcCalculationTab






























































// // components/lc-main/LcCalculationTab.tsx

// 'use client'
// import React, { useMemo } from 'react'
// import { Calculator } from 'lucide-react'
// import { DutyStructureItem } from './LcDutyStructure'
// import { GdnDetailData } from '@/store/slice/lcMainSlice'

// // =============================================
// // TYPES
// // =============================================

// interface LcCalculationTabProps {
//   gdnDetails: GdnDetailData[]
//   dutyItems: DutyStructureItem[]
//   exchangeRate: number
//   exchangeRateDuty: number
//   landedCost: number
// }

// interface CalculatedItem {
//   itemId: number
//   itemName: string
//   totalAssessableValue: number  // ✅ FC Value
//   totalAvPkr: number
//   Av_customDuty: number
//   Av_acd: number
//   Av_rd: number
//   Av_salesTax: number
//   Av_additionalSalesTax: number
//   Av_incomeTaxImport: number
//   Av_furtherTax: number
//   Av_incomeTaxWithheld: number
//   Av_total: number
//   Av_GrandTotal: number
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

// const LcCalculationTab: React.FC<LcCalculationTabProps> = ({
//   gdnDetails,
//   dutyItems,
//   exchangeRate,
//   exchangeRateDuty,
//   landedCost
// }) => {

//   const calculatedItems = useMemo((): CalculatedItem[] => {
//     return gdnDetails.map((gdn) => {
//       const itemId = gdn.item?.id || gdn.Item_ID
//       const itemName = gdn.item?.itemName || ''

//       const dutyItem = dutyItems.find(d => d.itemId === itemId)

//       const assessedPrice = safeValue(dutyItem?.assessedPrice)
//       const assessedQty = safeValue(dutyItem?.assessedQty)

//       const cd = safeValue(dutyItem?.cd)
//       const acd = safeValue(dutyItem?.acd)
//       const rd = safeValue(dutyItem?.rd)
//       const salesTax = safeValue(dutyItem?.salesTax)
//       const addSalesTax = safeValue(dutyItem?.addSalesTax)
//       const itaxImport = safeValue(dutyItem?.itaxImport)
//       const furtherTax = safeValue(dutyItem?.furtherTax)
//       const incomeTaxWithheld = safeValue(dutyItem?.incomeTaxWithheld)

//       // ✅ Total FC Value
//       const totalAssessableValue = assessedPrice * assessedQty

//       const effectiveLandedCost = landedCost || 1.01
//       const effectiveExchangeRate = exchangeRate || 1

//       const totalAvPkr = effectiveExchangeRate * totalAssessableValue 

//       const exchangeRateForDuty = exchangeRateDuty || 11

//       // AV Calculations
//       const Av_customDuty = (totalAvPkr * cd) / 100
//       const Av_acd = (totalAvPkr * acd) / 100
//       const Av_rd = (totalAvPkr * rd) / 100
//       const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
//       const Av_salesTax = (Av_base1 * salesTax) / 100
//       const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
//       const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
//       const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100
//       const astSalesTaxRatio = salesTax > 0 ? (1 + (addSalesTax / salesTax)) : 1
//       const Av_furtherTax = astSalesTaxRatio * Av_base1 * (furtherTax / 100)
//       const Av_incomeTaxWithheld = astSalesTaxRatio * Av_base2 * (incomeTaxWithheld / 100)
//       const Av_total = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport
//       const Av_GrandTotal = Av_total + Av_furtherTax + Av_incomeTaxWithheld

//       return {
//         itemId,
//         itemName,
//         totalAssessableValue,  // ✅ FC Value
//         totalAvPkr,
//         Av_customDuty,
//         Av_acd,
//         Av_rd,
//         Av_salesTax,
//         Av_additionalSalesTax,
//         Av_incomeTaxImport,
//         Av_furtherTax,
//         Av_incomeTaxWithheld,
//         Av_total,
//         Av_GrandTotal
//       }
//     })
//   }, [gdnDetails, dutyItems, exchangeRate, landedCost])

//   const grandTotals = useMemo(() => {
//     return calculatedItems.reduce((acc, item) => ({
//       totalAssessableValue: acc.totalAssessableValue + Math.round(item.totalAssessableValue),  // ✅ Added
//       totalAvPkr: acc.totalAvPkr + Math.round(item.totalAvPkr),
//       Av_customDuty: acc.Av_customDuty + Math.round(item.Av_customDuty),
//       Av_acd: acc.Av_acd + Math.round(item.Av_acd),
//       Av_rd: acc.Av_rd + Math.round(item.Av_rd),
//       Av_salesTax: acc.Av_salesTax + Math.round(item.Av_salesTax),
//       Av_additionalSalesTax: acc.Av_additionalSalesTax + Math.round(item.Av_additionalSalesTax),
//       Av_incomeTaxImport: acc.Av_incomeTaxImport + Math.round(item.Av_incomeTaxImport),
//       Av_furtherTax: acc.Av_furtherTax + Math.round(item.Av_furtherTax),
//       Av_incomeTaxWithheld: acc.Av_incomeTaxWithheld + Math.round(item.Av_incomeTaxWithheld),
//       Av_total: acc.Av_total + Math.round(item.Av_total),
//       Av_GrandTotal: acc.Av_GrandTotal + Math.round(item.Av_GrandTotal)
//     }), {
//       totalAssessableValue: 0,  // ✅ Added
//       totalAvPkr: 0,
//       Av_customDuty: 0,
//       Av_acd: 0,
//       Av_rd: 0,
//       Av_salesTax: 0,
//       Av_additionalSalesTax: 0,
//       Av_incomeTaxImport: 0,
//       Av_furtherTax: 0,
//       Av_incomeTaxWithheld: 0,
//       Av_total: 0,
//       Av_GrandTotal: 0
//     })
//   }, [calculatedItems])

//   // ✅ No decimal places
//   const formatNumber = (num: number) =>
//     num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

//   if (gdnDetails.length === 0) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-8">
//         <div className="text-center text-gray-500">
//           <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium">No Calculation Data</p>
//           <p className="text-sm mt-1">Select LC to load GDN items</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Calculator className="w-5 h-5 mr-2 text-[#509ee3]" />
//             <h2 className="text-lg font-semibold text-gray-900">Calculation Summary (Assessed Value)</h2>
//             <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//               {calculatedItems.length} item{calculatedItems.length > 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="flex gap-6 text-sm">
//             <div>Ex. Rate: <span className="font-semibold text-[#509ee3]">{exchangeRate || 0}</span></div>
//             <div>Landed Cost: <span className="font-semibold text-[#509ee3]">{landedCost || 1.01}</span></div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="p-4 overflow-x-auto">
//         <table className="w-full min-w-[1100px]">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10">#</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[140px]">Item</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-green-700 uppercase bg-green-50">Value FC</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Value PKR</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">CD</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">ACD</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">RD</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">S.Tax</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Add S.Tax</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">I.Tax Imp</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-blue-700 uppercase bg-blue-50">Sub Total</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Further Tax</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">I.Tax W/H</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-[#509ee3] uppercase bg-blue-50">Grand Total</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {calculatedItems.map((item, index) => (
//               <tr key={item.itemId} className="hover:bg-gray-50">
//                 <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
//                 <td className="px-2 py-2">
//                   <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]" title={item.itemName}>
//                     {item.itemName}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 text-sm text-right font-medium text-green-600 bg-green-50/50">
//                   {formatNumber(Math.round(item.totalAssessableValue))}
//                 </td>
//                 <td className="px-2 py-2 text-sm text-right text-gray-700">{formatNumber(Math.round(item.totalAvPkr))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_customDuty))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_acd))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_rd))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_salesTax))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_additionalSalesTax))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_incomeTaxImport))}</td>
//                 <td className="px-2 py-2 text-sm text-right font-semibold text-blue-600 bg-blue-50/50">{formatNumber(Math.round(item.Av_total))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-orange-600">{formatNumber(Math.round(item.Av_furtherTax))}</td>
//                 <td className="px-2 py-2 text-sm text-right text-orange-600">{formatNumber(Math.round(item.Av_incomeTaxWithheld))}</td>
//                 <td className="px-2 py-2 text-sm text-right font-bold text-[#509ee3] bg-blue-50/50">{formatNumber(Math.round(item.Av_GrandTotal))}</td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-gray-100">
//             <tr className="font-semibold">
//               <td colSpan={2} className="px-2 py-3 text-sm text-right text-gray-900">Grand Totals:</td>
//               <td className="px-2 py-3 text-sm text-right font-bold text-green-700 bg-green-100">{formatNumber(grandTotals.totalAssessableValue)}</td>
//               <td className="px-2 py-3 text-sm text-right text-gray-900">{formatNumber(grandTotals.totalAvPkr)}</td>
//               <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_customDuty)}</td>
//               <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_acd)}</td>
//               <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_rd)}</td>
//               <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_salesTax)}</td>
//               <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_additionalSalesTax)}</td>
//               <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_incomeTaxImport)}</td>
//               <td className="px-2 py-3 text-sm text-right font-bold text-blue-700 bg-blue-100">{formatNumber(grandTotals.Av_total)}</td>
//               <td className="px-2 py-3 text-sm text-right text-orange-700">{formatNumber(grandTotals.Av_furtherTax)}</td>
//               <td className="px-2 py-3 text-sm text-right text-orange-700">{formatNumber(grandTotals.Av_incomeTaxWithheld)}</td>
//               <td className="px-2 py-3 text-sm text-right font-bold text-[#509ee3] bg-blue-100 text-base">{formatNumber(grandTotals.Av_GrandTotal)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default LcCalculationTab






















































// components/lc-main/LcCalculationTab.tsx

'use client'
import React, { useMemo } from 'react'
import { Calculator } from 'lucide-react'
import { DutyStructureItem } from './LcDutyStructure'
import { GdnDetailData } from '@/store/slice/lcMainSlice'

// =============================================
// TYPES
// =============================================

interface LcCalculationTabProps {
  gdnDetails: GdnDetailData[]
  dutyItems: DutyStructureItem[]
  exchangeRate: number
  exchangeRateDuty: number
  landedCost: number
}

interface CalculatedItem {
  itemId: number
  itemName: string
  totalAssessableValue: number  // ✅ FC Value
  totalAvPkr: number
  Av_customDuty: number
  Av_acd: number
  Av_rd: number
  Av_salesTax: number
  Av_additionalSalesTax: number
  Av_incomeTaxImport: number
  Av_furtherTax: number
  Av_incomeTaxWithheld: number
  Av_total: number
  Av_GrandTotal: number
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

const LcCalculationTab: React.FC<LcCalculationTabProps> = ({
  gdnDetails,
  dutyItems,
  exchangeRate,
  exchangeRateDuty,
  landedCost
}) => {

  const calculatedItems = useMemo((): CalculatedItem[] => {
    return gdnDetails.map((gdn) => {
      const itemId = gdn.item?.id || gdn.Item_ID
      const itemName = gdn.item?.itemName || ''

      const dutyItem = dutyItems.find(d => d.itemId === itemId)

      const assessedPrice = safeValue(dutyItem?.assessedPrice)
      const assessedQty = safeValue(dutyItem?.assessedQty)

      const cd = safeValue(dutyItem?.cd)
      const acd = safeValue(dutyItem?.acd)
      const rd = safeValue(dutyItem?.rd)
      const salesTax = safeValue(dutyItem?.salesTax)
      const addSalesTax = safeValue(dutyItem?.addSalesTax)
      const itaxImport = safeValue(dutyItem?.itaxImport)
      const furtherTax = safeValue(dutyItem?.furtherTax)
      const incomeTaxWithheld = safeValue(dutyItem?.incomeTaxWithheld)

      // ✅ Total FC Value
      const totalAssessableValue = assessedPrice * assessedQty

      const effectiveLandedCost = landedCost || 1.01
      const effectiveExchangeRate = exchangeRate || 1

      const totalAvPkr = exchangeRateDuty * totalAssessableValue * effectiveLandedCost

      // AV Calculations
      const Av_customDuty = (totalAvPkr * cd) / 100
      const Av_acd = (totalAvPkr * acd) / 100
      const Av_rd = (totalAvPkr * rd) / 100
      const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
      const Av_salesTax = (Av_base1 * salesTax) / 100
      const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
      const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
      const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100
      const astSalesTaxRatio = salesTax > 0 ? (1 + (addSalesTax / salesTax)) : 1
      const Av_furtherTax = astSalesTaxRatio * Av_base1 * (furtherTax / 100)
      const Av_incomeTaxWithheld = astSalesTaxRatio * Av_base2 * (incomeTaxWithheld / 100)
      const Av_total = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport

      console.log('Calculating item:',itemName , 'with priceFC:', assessedPrice, 'qty:', assessedQty, 'totalAssessableValue:', totalAssessableValue, 'Exchange rate:', effectiveExchangeRate, 'landed Cost:', effectiveLandedCost,'totalAvPkr = effectiveExchangeRate * totalAssessableValue * effectiveLandedCost' , 'totalAvPkr:', totalAvPkr);
      const Av_GrandTotal = Av_total + Av_furtherTax + Av_incomeTaxWithheld

      return {
        itemId,
        itemName,
        totalAssessableValue,  // ✅ FC Value
        totalAvPkr,
        Av_customDuty,
        Av_acd,
        Av_rd,
        Av_salesTax,
        Av_additionalSalesTax,
        Av_incomeTaxImport,
        Av_furtherTax,
        Av_incomeTaxWithheld,
        Av_total,
        Av_GrandTotal
      }
    })
  }, [gdnDetails, dutyItems, exchangeRate, landedCost])

  const grandTotals = useMemo(() => {
    return calculatedItems.reduce((acc, item) => ({
      totalAssessableValue: acc.totalAssessableValue + Math.round(item.totalAssessableValue),  // ✅ Added
      totalAvPkr: acc.totalAvPkr + Math.round(item.totalAvPkr),
      Av_customDuty: acc.Av_customDuty + Math.round(item.Av_customDuty),
      Av_acd: acc.Av_acd + Math.round(item.Av_acd),
      Av_rd: acc.Av_rd + Math.round(item.Av_rd),
      Av_salesTax: acc.Av_salesTax + Math.round(item.Av_salesTax),
      Av_additionalSalesTax: acc.Av_additionalSalesTax + Math.round(item.Av_additionalSalesTax),
      Av_incomeTaxImport: acc.Av_incomeTaxImport + Math.round(item.Av_incomeTaxImport),
      Av_furtherTax: acc.Av_furtherTax + Math.round(item.Av_furtherTax),
      Av_incomeTaxWithheld: acc.Av_incomeTaxWithheld + Math.round(item.Av_incomeTaxWithheld),
      Av_total: acc.Av_total + Math.round(item.Av_total),
      Av_GrandTotal: acc.Av_GrandTotal + Math.round(item.Av_GrandTotal)
    }), {
      totalAssessableValue: 0,  // ✅ Added
      totalAvPkr: 0,
      Av_customDuty: 0,
      Av_acd: 0,
      Av_rd: 0,
      Av_salesTax: 0,
      Av_additionalSalesTax: 0,
      Av_incomeTaxImport: 0,
      Av_furtherTax: 0,
      Av_incomeTaxWithheld: 0,
      Av_total: 0,
      Av_GrandTotal: 0
    })
  }, [calculatedItems])

  // ✅ No decimal places
  const formatNumber = (num: number) =>
    num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  if (gdnDetails.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Calculation Data</p>
          <p className="text-sm mt-1">Select LC to load GDN items</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-[#509ee3]" />
            <h2 className="text-lg font-semibold text-gray-900">Calculation Summary (Assessed Value)</h2>
            <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
              {calculatedItems.length} item{calculatedItems.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            <div>Ex. Rate: <span className="font-semibold text-[#509ee3]">{exchangeRate || 0}</span></div>
            <div>Landed Cost: <span className="font-semibold text-[#509ee3]">{landedCost || 1.01}</span></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-10">#</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[140px]">Item</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-green-700 uppercase bg-green-50">Total AV </th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Value PKR</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">CD</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">ACD</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">RD</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">S.Tax</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Add S.Tax</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">I.Tax Imp</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-blue-700 uppercase bg-blue-50">Sub Total</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Further Tax</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase">I.Tax W/H</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-[#509ee3] uppercase bg-blue-50">Grand Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {calculatedItems.map((item, index) => (
              <tr key={item.itemId} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
                <td className="px-2 py-2">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]" title={item.itemName}>
                    {item.itemName}
                  </div>
                </td>
                <td className="px-2 py-2 text-sm text-right font-medium text-green-600 bg-green-50/50">
                  {formatNumber(Math.round(item.totalAssessableValue))}
                </td>
                <td className="px-2 py-2 text-sm text-right text-gray-700">{formatNumber(Math.round(item.totalAvPkr))}</td>
                <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_customDuty))}</td>
                <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_acd))}</td>
                <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_rd))}</td>
                <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_salesTax))}</td>
                <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_additionalSalesTax))}</td>
                <td className="px-2 py-2 text-sm text-right text-gray-600">{formatNumber(Math.round(item.Av_incomeTaxImport))}</td>
                <td className="px-2 py-2 text-sm text-right font-semibold text-blue-600 bg-blue-50/50">{formatNumber(Math.round(item.Av_total))}</td>
                <td className="px-2 py-2 text-sm text-right text-orange-600">{formatNumber(Math.round(item.Av_furtherTax))}</td>
                <td className="px-2 py-2 text-sm text-right text-orange-600">{formatNumber(Math.round(item.Av_incomeTaxWithheld))}</td>
                <td className="px-2 py-2 text-sm text-right font-bold text-[#509ee3] bg-blue-50/50">{formatNumber(Math.round(item.Av_GrandTotal))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr className="font-semibold">
              <td colSpan={2} className="px-2 py-3 text-sm text-right text-gray-900">Grand Totals:</td>
              <td className="px-2 py-3 text-sm text-right font-bold text-green-700 bg-green-100">{formatNumber(grandTotals.totalAssessableValue)}</td>
              <td className="px-2 py-3 text-sm text-right text-gray-900">{formatNumber(grandTotals.totalAvPkr)}</td>
              <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_customDuty)}</td>
              <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_acd)}</td>
              <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_rd)}</td>
              <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_salesTax)}</td>
              <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_additionalSalesTax)}</td>
              <td className="px-2 py-3 text-sm text-right text-gray-700">{formatNumber(grandTotals.Av_incomeTaxImport)}</td>
              <td className="px-2 py-3 text-sm text-right font-bold text-blue-700 bg-blue-100">{formatNumber(grandTotals.Av_total)}</td>
              <td className="px-2 py-3 text-sm text-right text-orange-700">{formatNumber(grandTotals.Av_furtherTax)}</td>
              <td className="px-2 py-3 text-sm text-right text-orange-700">{formatNumber(grandTotals.Av_incomeTaxWithheld)}</td>
              <td className="px-2 py-3 text-sm text-right font-bold text-[#509ee3] bg-blue-100 text-base">{formatNumber(grandTotals.Av_GrandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default LcCalculationTab
