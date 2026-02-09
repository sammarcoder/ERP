// // components/lc-main/LcDutyStructure.tsx

// 'use client'
// import React from 'react'
// import { Receipt } from 'lucide-react'

// // =============================================
// // TYPES (Stored fields only)
// // =============================================

// export interface DutyStructureItem {
//   id?: number
//   itemId: number
//   itemName: string
//   cd: string
//   acd: string
//   rd: string
//   salesTax: string
//   addSalesTax: string
//   itaxImport: string
//   furtherTax: string
//   incomeTaxWithheld: string
//   assessedPrice: string
//   assessedQty: string
//   priceFC?: string 
// }

// interface LcDutyStructureProps {
//   items: DutyStructureItem[]
//   onItemChange: (index: number, field: string, value: string) => void
//   disabled?: boolean
// }

// // =============================================
// // COMPONENT
// // =============================================

// const LcDutyStructure: React.FC<LcDutyStructureProps> = ({
//   items,
//   onItemChange,
//   disabled = false
// }) => {

//   const calculateRowTotal = (item: DutyStructureItem): number => {
//     // return (parseFloat(item.cd) || 0) +
//     //   (parseFloat(item.acd) || 0) +
//     //   (parseFloat(item.rd) || 0) +
//     //   (parseFloat(item.salesTax) || 0) +
//     //   (parseFloat(item.addSalesTax) || 0) +
//     //   (parseFloat(item.itaxImport) || 0) +
//     //   (parseFloat(item.furtherTax) || 0) +
//     //   (parseFloat(item.incomeTaxWithheld) || 0)
//     return ((parseFloat(item.assessedPrice) || 0) * (parseFloat(item.assessedQty) || 0))
//   }

//   const grandTotal = items.reduce((sum, item) => sum + calculateRowTotal(item), 0)

//   const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

//   if (items.length === 0) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-8">
//         <div className="text-center text-gray-500">
//           <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium">No Duty Structure Data</p>
//           <p className="text-sm mt-1">Select LC to load GDN items</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200">
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center">
//           <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
//           <h2 className="text-lg font-semibold text-gray-900">Duty Structure</h2>
//           <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
//             {items.length} item{items.length > 1 ? 's' : ''}
//           </span>
//         </div>
//       </div>

//       <div className="p-4 overflow-x-auto">
//         <table className="w-full min-w-[1400px]">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Item Name</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">CD</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">ACD</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">RD</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Sales Tax</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Add S.Tax</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">I.Tax Imp</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Further Tax</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">I.Tax W/H</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Assessed Price</th>
//               <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Assessed Qty</th>
//               <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {items.map((item, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
//                 <td className="px-2 py-2">
//                   <div className="text-sm font-medium text-gray-900 truncate">{item.itemName}</div>
//                 </td>

//                 {['cd', 'acd', 'rd', 'salesTax', 'addSalesTax', 'itaxImport', 'furtherTax', 'incomeTaxWithheld', 'assessedPrice', 'assessedQty'].map((field) => (
//                   <td key={field} className="px-2 py-2">
//                     <input
//                       type="text"
//                       value={item[field as keyof DutyStructureItem] as string}
//                       onChange={(e) => onItemChange(index, field, e.target.value)}
//                       disabled={disabled}
//                       className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
//                     />
//                   </td>
//                 ))}

//                 <td className="px-2 py-2 text-right">
//                   <span className="text-sm font-semibold text-gray-900">
//                     {formatNumber(calculateRowTotal(item))}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-gray-50">
//             <tr>
//               <td colSpan={12} className="px-2 py-3 text-right font-semibold text-gray-900">Grand Total:</td>
//               <td className="px-2 py-3 text-right font-bold text-[#509ee3] text-base">
//                 {formatNumber(grandTotal)}
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default LcDutyStructure






















// components/lc-main/LcDutyStructure.tsx

'use client'
import React from 'react'
import { Receipt } from 'lucide-react'

// =============================================
// TYPES
// =============================================

export interface DutyStructureItem {
  id?: number
  itemId: number
  itemName: string
  cd: string
  acd: string
  rd: string
  salesTax: string
  addSalesTax: string
  itaxImport: string
  furtherTax: string
  incomeTaxWithheld: string
  assessedPrice: string
  assessedQty: string
  priceFC?: string
}

interface LcDutyStructureProps {
  items: DutyStructureItem[]
  onItemChange: (index: number, field: string, value: string) => void
  disabled?: boolean
}

// =============================================
// COMPONENT
// =============================================

const LcDutyStructure: React.FC<LcDutyStructureProps> = ({
  items,
  onItemChange,
  disabled = false
}) => {

  // ✅ UPDATED: Total = assessedPrice × assessedQty
  const calculateRowTotal = (item: DutyStructureItem): number => {
    return (parseFloat(item.assessedPrice) || 0) * (parseFloat(item.assessedQty) || 0)
  }

  // ✅ UPDATED: Grand Total = sum of all row totals
  // const grandTotal = items.reduce((sum, item) => sum + calculateRowTotal(item), 0)
  const grandTotal = items.reduce((sum, item) => {
  const rowTotal = Math.round(calculateRowTotal(item))  // Round each row first
  return sum + rowTotal
}, 0)

  // ✅ UPDATED: No decimal places
  const formatNumber = (num: number) => 
    num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Duty Structure Data</p>
          <p className="text-sm mt-1">Select LC to load GDN items</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Receipt className="w-5 h-5 mr-2 text-[#509ee3]" />
          <h2 className="text-lg font-semibold text-gray-900">Duty Structure</h2>
          <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
            {items.length} item{items.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[150px]">Item Name</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">CD</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">ACD</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">RD</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Sales Tax</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Add S.Tax</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">I.Tax Imp</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Further Tax</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">I.Tax W/H</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Assessed Price</th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">Assessed Qty</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-700 uppercase min-w-[100px]">Total AV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-sm text-gray-500 font-medium">{index + 1}</td>
                <td className="px-2 py-2">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.itemName}</div>
                </td>

                {['cd', 'acd', 'rd', 'salesTax', 'addSalesTax', 'itaxImport', 'furtherTax', 'incomeTaxWithheld', 'assessedPrice', 'assessedQty'].map((field) => (
                  <td key={field} className="px-2 py-2">
                    <input
                      type="text"
                      value={item[field as keyof DutyStructureItem] as string}
                      onChange={(e) => onItemChange(index, field, e.target.value)}
                      disabled={disabled}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#509ee3] disabled:bg-gray-100"
                    />
                  </td>
                ))}

                <td className="px-2 py-2 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(calculateRowTotal(item))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={12} className="px-2 py-3 text-right font-semibold text-gray-900">Grand Total:</td>
              <td className="px-2 py-3 text-right font-bold text-[#509ee3] text-base">
                {formatNumber(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default LcDutyStructure
