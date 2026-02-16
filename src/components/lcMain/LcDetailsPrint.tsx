// // components/lc-main/LcDetailsPrint.tsx

// 'use client'
// import React, { useMemo, forwardRef } from 'react'
// import { DutyStructureItem } from './LcDutyStructure'
// import { GdnDetailData } from '@/store/slice/lcMainSlice'

// // =============================================
// // TYPES
// // =============================================

// interface LcDetailsPrintProps {
//   lcNumber?: string
//   lcDate?: string
//   partyName?: string
//   gdnDetails: GdnDetailData[]
//   dutyItems: DutyStructureItem[]
//   exchangeRateDocuments: number
//   exchangeRateDuty: number
//   totalExp: number
//   landedCost: number
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

// const LcDetailsPrint = forwardRef<HTMLDivElement, LcDetailsPrintProps>(({
//   lcNumber = '',
//   lcDate = '',
//   partyName = '',
//   gdnDetails,
//   dutyItems,
//   exchangeRateDocuments,
//   exchangeRateDuty,
//   totalExp,
//   landedCost
// }, ref) => {

//   // =============================================
//   // CALCULATIONS
//   // =============================================

//   const calculatedItems = useMemo(() => {
//     const itemsWithTotals = gdnDetails.map((gdn) => {
//       const itemId = gdn.item?.id || gdn.Item_ID
//       const itemName = gdn.item?.itemName || ''
//       const uom2Qty = parseFloat(gdn.uom2_qty) || 0
//       const uom3Qty = parseFloat(gdn.uom3_qty) || 0
//       const uom2Name = gdn.item?.uomTwo?.uom || ''
//       const uom3Name = gdn.item?.uomThree?.uom || ''

//       const dutyItem = dutyItems.find(d => d.itemId === itemId)
//       const priceFC = parseFloat(dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0') || 0

//       const total = uom2Qty * priceFC
//       const totalPkr = total * exchangeRateDocuments

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
//       const totalAvPkr = exchangeRateDuty * totalAssessableValue * effectiveLandedCost

//       const Av_customDuty = (totalAvPkr * cd) / 100
//       const Av_acd = (totalAvPkr * acd) / 100
//       const Av_rd = (totalAvPkr * rd) / 100
//       const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
//       const Av_salesTax = (Av_base1 * salesTax) / 100
//       const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
//       const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
//       const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100

//       const totalDuty = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport

//       return { itemId, itemName, uom2Qty, uom3Qty, uom2Name, uom3Name, priceFC, total, totalPkr, totalDuty }
//     })

//     const grandTotal = itemsWithTotals.reduce((sum, item) => sum + Math.round(item.total), 0)

//     return itemsWithTotals.map(item => {
//       const expense = grandTotal > 0 ? (Math.round(item.total) / grandTotal) * totalExp : 0
//       const totalNet = Math.round(item.totalPkr) + Math.round(item.totalDuty) + Math.round(expense)
//       const percentage = item.totalPkr > 0 ? ((item.totalDuty + expense) / item.totalPkr) * 100 : 0
//       const cost = item.uom2Qty > 0 ? totalNet / item.uom2Qty : 0

//       return { ...item, expense, totalNet, percentage, cost }
//     })
//   }, [gdnDetails, dutyItems, exchangeRateDocuments, exchangeRateDuty, totalExp, landedCost])

//   // =============================================
//   // GRAND TOTALS
//   // =============================================

//   const grandTotals = useMemo(() => {
//     const totals = calculatedItems.reduce((acc, item) => ({
//       uom2Qty: acc.uom2Qty + item.uom2Qty,
//       uom3Qty: acc.uom3Qty + item.uom3Qty,
//       total: acc.total + Math.round(item.total),
//       totalPkr: acc.totalPkr + Math.round(item.totalPkr),
//       totalDuty: acc.totalDuty + Math.round(item.totalDuty),
//       expense: acc.expense + Math.round(item.expense),
//       totalNet: acc.totalNet + Math.round(item.totalNet)
//     }), { uom2Qty: 0, uom3Qty: 0, total: 0, totalPkr: 0, totalDuty: 0, expense: 0, totalNet: 0 })

//     const percentage = totals.totalPkr > 0 ? ((totals.totalDuty + totals.expense) / totals.totalPkr) * 100 : 0
//     const cost = totals.uom2Qty > 0 ? totals.totalNet / totals.uom2Qty : 0

//     return { ...totals, percentage, cost }
//   }, [calculatedItems])

//   // =============================================
//   // FORMATTERS
//   // =============================================

//   const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
//   const formatDecimal = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//   const formatPercentage = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'

//   const formatDate = (date: string) => {
//     if (!date) return '-'
//     return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//   }

//   // =============================================
//   // RENDER
//   // =============================================

//   return (
//     <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#000', fontSize: '14px' }}>
      
//       {/* Header */}
//       {/* <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '3px solid #000', paddingBottom: '15px' }}>
//         <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#000' }}>cal</div>
//       </div> */}

//       {/* Info Row */}
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         marginBottom: '20px', 
//         flexWrap: 'wrap', 
//         gap: '15px',
//         padding: '15px',
//         backgroundColor: '#f0f0f0',
//         borderRadius: '8px',
//         border: '1px solid #000',
//         fontSize: '14px',
//         color: '#000'
//       }}>
//         <div><strong>Calculation Sheet For:</strong> {lcNumber || '-'}</div>
//         <div><strong>Date:</strong> {formatDate(lcDate)}</div>
//         <div><strong>Party:</strong> {partyName || '-'}</div>
//         <div><strong>Ex. Rate Doc:</strong> {formatDecimal(exchangeRateDocuments)}</div>
//         <div><strong>Ex. Rate Duty:</strong> {formatDecimal(exchangeRateDuty)}</div>
//         <div><strong>Total Exp:</strong> {formatNumber(Math.round(totalExp))}</div>
//       </div>

//       {/* Table */}
//       <div style={{ borderRadius: '8px', overflow: 'hidden', border: '2px solid #000' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#000' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#d0d0d0' }}>
//               <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>#</th>
//               <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Item Name</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>UOM2 Qty</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>UOM3 Qty</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Price FC</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total FC</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total PKR</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total Duty</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Expense</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>%</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Cost</th>
//               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total Net</th>
//             </tr>
//           </thead>
//           <tbody>
//             {calculatedItems.map((item, index) => (
//               <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5' }}>
//                 <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #999', color: '#000' }}>{index + 1}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #999', color: '#000', fontWeight: '500' }}>{item.itemName}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.uom2Qty))}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.uom3Qty))}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatDecimal(item.priceFC)}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.total))}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.totalPkr))}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.totalDuty))}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.expense))}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatPercentage(item.percentage)}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatDecimal(item.cost)}</td>
//                 <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000', fontWeight: 'bold' }}>{formatNumber(Math.round(item.totalNet))}</td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr style={{ backgroundColor: '#c0c0c0', fontWeight: 'bold' }}>
//               <td colSpan={2} style={{ padding: '12px 8px', textAlign: 'right', color: '#000', fontSize: '14px' }}>TOTAL:</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(Math.round(grandTotals.uom2Qty))}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(Math.round(grandTotals.uom3Qty))}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>-</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.total)}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.totalPkr)}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.totalDuty)}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.expense)}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatPercentage(grandTotals.percentage)}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatDecimal(grandTotals.totalNet / grandTotals.total)}</td>
//               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000', fontSize: '14px' }}>{formatNumber(grandTotals.totalNet)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>

//       {/* Footer */}
//       <div style={{ 
//         marginTop: '20px', 
//         fontSize: '12px', 
//         color: '#000', 
//         textAlign: 'center',
//         padding: '12px',
//         backgroundColor: '#f0f0f0',
//         borderRadius: '8px',
//         border: '1px solid #000'
//       }}>
//         <strong>Generated:</strong> {new Date().toLocaleString()} | <strong>Items:</strong> {calculatedItems.length}
//       </div>
//     </div>
//   )
// })

// LcDetailsPrint.displayName = 'LcDetailsPrint'

// export default LcDetailsPrint













































// components/lc-main/LcDetailsPrint.tsx

'use client'
import React, { useMemo, forwardRef } from 'react'
import { DutyStructureItem } from './LcDutyStructure'
import { GdnDetailData } from '@/store/slice/lcMainSlice'

// =============================================
// TYPES
// =============================================

interface LcDetailsPrintProps {
  lcNumber?: string
  lcDate?: string
  partyName?: string
  gdnDetails: GdnDetailData[]
  dutyItems: DutyStructureItem[]
  exchangeRateDocuments: number
  exchangeRateDuty: number
  totalExp: number
  landedCost: number
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

const LcDetailsPrint = forwardRef<HTMLDivElement, LcDetailsPrintProps>(({
  lcNumber = '',
  lcDate = '',
  partyName = '',
  gdnDetails,
  dutyItems,
  exchangeRateDocuments,
  exchangeRateDuty,
  totalExp,
  landedCost
}, ref) => {

  // =============================================
  // CALCULATIONS
  // =============================================

  const calculatedItems = useMemo(() => {
    const itemsWithTotals = gdnDetails.map((gdn) => {
      const itemId = gdn.item?.id || gdn.Item_ID
      const itemName = gdn.item?.itemName || ''
      const uom2Qty = parseFloat(gdn.uom2_qty) || 0
      const uom3Qty = parseFloat(gdn.uom3_qty) || 0
      const uom2Name = gdn.item?.uomTwo?.uom || ''
      const uom3Name = gdn.item?.uomThree?.uom || ''

      const dutyItem = dutyItems.find(d => d.itemId === itemId)
      const priceFC = parseFloat(dutyItem?.priceFC || gdn.item?.purchasePriceFC || '0') || 0

      const total = uom2Qty * priceFC
      const totalPkr = total * exchangeRateDocuments

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

      const Av_customDuty = (totalAvPkr * cd) / 100
      const Av_acd = (totalAvPkr * acd) / 100
      const Av_rd = (totalAvPkr * rd) / 100
      const Av_base1 = totalAvPkr + Av_customDuty + Av_acd + Av_rd
      const Av_salesTax = (Av_base1 * salesTax) / 100
      const Av_additionalSalesTax = (Av_base1 * addSalesTax) / 100
      const Av_base2 = Av_base1 + Av_salesTax + Av_additionalSalesTax
      const Av_incomeTaxImport = (Av_base2 * itaxImport) / 100

      const totalDuty = Av_customDuty + Av_acd + Av_rd + Av_salesTax + Av_additionalSalesTax + Av_incomeTaxImport

      return { itemId, itemName, uom2Qty, uom3Qty, uom2Name, uom3Name, priceFC, total, totalPkr, totalDuty }
    })

    const grandTotal = itemsWithTotals.reduce((sum, item) => sum + Math.round(item.total), 0)

    return itemsWithTotals.map(item => {
      const expense = grandTotal > 0 ? (Math.round(item.total) / grandTotal) * totalExp : 0
      const totalNet = Math.round(item.totalPkr) + Math.round(item.totalDuty) + Math.round(expense)
      const percentage = item.totalPkr > 0 ? ((item.totalDuty + expense) / item.totalPkr) * 100 : 0
      const cost = item.uom2Qty > 0 ? totalNet / item.uom2Qty : 0

      return { ...item, expense, totalNet, percentage, cost }
    })
  }, [gdnDetails, dutyItems, exchangeRateDocuments, exchangeRateDuty, totalExp, landedCost])

  // =============================================
  // GRAND TOTALS
  // =============================================

  const grandTotals = useMemo(() => {
    const totals = calculatedItems.reduce((acc, item) => ({
      uom2Qty: acc.uom2Qty + item.uom2Qty,
      uom3Qty: acc.uom3Qty + item.uom3Qty,
      total: acc.total + Math.round(item.total),
      totalPkr: acc.totalPkr + Math.round(item.totalPkr),
      totalDuty: acc.totalDuty + Math.round(item.totalDuty),
      expense: acc.expense + Math.round(item.expense),
      totalNet: acc.totalNet + Math.round(item.totalNet)
    }), { uom2Qty: 0, uom3Qty: 0, total: 0, totalPkr: 0, totalDuty: 0, expense: 0, totalNet: 0 })

    const percentage = totals.totalPkr > 0 ? ((totals.totalDuty + totals.expense) / totals.totalPkr) * 100 : 0
    const cost = totals.uom2Qty > 0 ? totals.totalNet / totals.uom2Qty : 0

    return { ...totals, percentage, cost }
  }, [calculatedItems])

  // =============================================
  // FORMATTERS
  // =============================================

  const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  const formatDecimal = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatPercentage = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#000', fontSize: '14px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '3px solid #000', paddingBottom: '15px' }}>
        <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#000' }}>LC DETAILS REPORT</div>
      </div>

      {/* Info Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px', 
        flexWrap: 'wrap', 
        gap: '15px',
        padding: '15px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        border: '1px solid #000',
        fontSize: '14px',
        color: '#000'
      }}>
        <div><strong>LC:</strong> {lcNumber || '-'}</div>
        <div><strong>Date:</strong> {formatDate(lcDate)}</div>
        <div><strong>Party:</strong> {partyName || '-'}</div>
        <div><strong>Ex. Rate Doc:</strong> {formatDecimal(exchangeRateDocuments)}</div>
        <div><strong>Ex. Rate Duty:</strong> {formatDecimal(exchangeRateDuty)}</div>
        <div><strong>Total Exp:</strong> {formatNumber(Math.round(totalExp))}</div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '2px solid #000' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#000' }}>
          <thead>
            <tr style={{ backgroundColor: '#d0d0d0' }}>
              <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>#</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Item Name</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>UOM3 Qty</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>UOM2 Qty</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Price FC</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total FC</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total PKR</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total Duty</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Expense</th>
               <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total Net</th>
              <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>%</th>
              <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Cost</th>
              {/* <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #000', fontWeight: 'bold', color: '#000' }}>Total Net</th> */}
            </tr>
          </thead>
          <tbody>
            {calculatedItems.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5' }}>
                <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #999', color: '#000' }}>{index + 1}</td>
                <td style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #999', color: '#000', fontWeight: '500' }}>{item.itemName}</td>
                {/* UOM3 Qty with /uom3Name */}
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>
                  {formatNumber(Math.round(item.uom3Qty))}{item.uom3Name ? `/${item.uom3Name}` : ''}
                </td>
                {/* UOM2 Qty with /uom2Name */}
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>
                  {formatNumber(Math.round(item.uom2Qty))}{item.uom2Name ? `/${item.uom2Name}` : ''}
                </td>
                {/* Price FC with /uom2Name */}
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>
                  {formatDecimal(item.priceFC)}{item.uom2Name ? `/${item.uom2Name}` : ''}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.total))}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.totalPkr))}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.totalDuty))}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatNumber(Math.round(item.expense))}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000', fontWeight: 'bold' }}>{formatNumber(Math.round(item.totalNet))}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>{formatPercentage(item.percentage)}</td>
                {/* Cost with /uom2Name */}
                <td style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #999', color: '#000' }}>
                  {formatDecimal(item.cost)}{item.uom2Name ? `/${item.uom2Name}` : ''}
                </td>
                
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#c0c0c0', fontWeight: 'bold' }}>
              <td colSpan={2} style={{ padding: '12px 8px', textAlign: 'right', color: '#000', fontSize: '14px' }}>TOTAL:</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(Math.round(grandTotals.uom3Qty))}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(Math.round(grandTotals.uom2Qty))}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>-</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.total)}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.totalPkr)}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.totalDuty)}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatNumber(grandTotals.expense)}</td>
               <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000', fontSize: '14px' }}>{formatNumber(grandTotals.totalNet)}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>{formatPercentage(grandTotals.percentage)}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', color: '#000' }}>Avg Rate: {formatDecimal(grandTotals.totalNet / grandTotals.total)}</td>
             
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        color: '#000', 
        textAlign: 'center',
        padding: '12px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        border: '1px solid #000'
      }}>
        <strong>Generated:</strong> {new Date().toLocaleString()} | <strong>Items:</strong> {calculatedItems.length}
      </div>
    </div>
  )
})

LcDetailsPrint.displayName = 'LcDetailsPrint'

export default LcDetailsPrint
