// import React from 'react'
// import { StockReportResult } from '@/types/reports/stock/StockReportTypes'

// interface StockReportPrintProps {
//   result: StockReportResult
//   onClose: () => void
// }

// export default function StockReportPrint({ result, onClose }: StockReportPrintProps) {
//   const { items, summary, filters } = result

//   const getUomLabel = () => {
//     switch (filters.selectedUom) {
//       case 1: return 'UOM 1 (Base Unit)'
//       case 2: return 'UOM 2 (Secondary Unit)'  
//       case 3: return 'UOM 3 (Tertiary Unit)'
//       default: return 'UOM'
//     }
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto">
        
//         {/* Print Controls (hidden in print) */}
//         <div className="flex justify-between items-center p-4 border-b print:hidden">
//           <h3 className="text-lg font-medium">Stock Report - Print Preview</h3>
//           <div className="space-x-2">
//             <button
//               onClick={handlePrint}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Print Report
//             </button>
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//             >
//               Close
//             </button>
//           </div>
//         </div>

//         {/* Printable Content */}
//         <div className="p-8 print:p-4">
          
//           {/* Report Header */}
//           <div className="text-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">STOCK MOVEMENT REPORT</h1>
//             <p className="text-sm text-gray-600">Unit of Measure: {getUomLabel()}</p>
//             <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
//           </div>

//           {/* Filter Summary */}
//           <div className="mb-6 text-sm">
//             <h3 className="font-semibold mb-2">Applied Filters:</h3>
//             <div className="grid grid-cols-2 gap-2 text-gray-600">
//               {filters.itemClass1 && <div>Class 1: Applied</div>}
//               {filters.itemClass2 && <div>Class 2: Applied</div>}
//               {filters.itemClass3 && <div>Class 3: Applied</div>}
//               {filters.itemClass4 && <div>Class 4: Applied</div>}
//               {filters.searchTerm && <div>Search: "{filters.searchTerm}"</div>}
//             </div>
//           </div>

//           {/* Data Table */}
//           <table className="w-full border-collapse border border-gray-300 text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
//                   Sr No.
//                 </th>
//                 <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
//                   Item Name
//                 </th>
//                 <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
//                   UOM
//                 </th>
//                 <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
//                   In Qty
//                 </th>
//                 <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
//                   Out Qty
//                 </th>
//                 <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
//                   Balance
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={item.itemId}>
//                   <td className="border border-gray-300 px-3 py-2 text-center">
//                     {index + 1}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     {item.itemName}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2 text-center">
//                     {item.selectedUom}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2 text-right">
//                     {item.totalInQty.toLocaleString()}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2 text-right">
//                     {item.totalOutQty.toLocaleString()}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
//                     {item.balance.toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
              
//               {/* Summary Row */}
//               <tr className="bg-gray-100 font-bold">
//                 <td className="border border-gray-300 px-3 py-2" colSpan={3}>
//                   TOTAL ({summary.totalItems} Items)
//                 </td>
//                 <td className="border border-gray-300 px-3 py-2 text-right">
//                   {summary.totalInQty.toLocaleString()}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-2 text-right">
//                   {summary.totalOutQty.toLocaleString()}
//                 </td>
//                 <td className="border border-gray-300 px-3 py-2 text-right">
//                   {summary.totalBalance.toLocaleString()}
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           {/* Report Footer */}
//           <div className="mt-6 text-xs text-gray-500 text-center">
//             <p>This is a computer-generated report. No signature required.</p>
//             <p>Stock Movement Report - Page 1 of 1</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }































































import React from 'react'
import { StockReportResult } from '@/types/reports/stock/StockReportTypes'

interface StockReportPrintProps {
  result: StockReportResult
  onClose: () => void
}

export default function StockReportPrint({ result, onClose }: StockReportPrintProps) {
  const { items, summary, filters } = result

  const getUomLabel = () => {
    switch (filters.selectedUom) {
      case 1: return 'UOM 1 (Base Unit)'
      case 2: return 'UOM 2 (Secondary Unit)'  
      case 3: return 'UOM 3 (Tertiary Unit)'
      default: return 'UOM'
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        
        {/* Print Controls */}
        <div className="flex justify-between items-center p-4 border-b print:hidden">
          <h3 className="text-lg font-medium">Stock Movement Report - Print Preview</h3>
          <div className="space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print Report
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-6 print:p-4">
          
          {/* Report Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">STOCK MOVEMENT REPORT</h1>
            <p className="text-sm text-gray-600">Unit of Measure: {getUomLabel()}</p>
            <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Data Table */}
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold w-12">
                  Sr No.
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                  Item Name
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold w-16">
                  UOM
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold w-20">
                  In Qty
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold w-20">
                  Out Qty
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold w-20">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.itemId}>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.itemName}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center text-xs">
                    {item.selectedUom}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {item.totalInQty.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right">
                    {item.totalOutQty.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-semibold">
                    {item.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {/* Summary Row */}
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 px-2 py-2" colSpan={3}>
                  TOTAL ({summary.totalItems} Items)
                </td>
                <td className="border border-gray-300 px-2 py-2 text-right">
                  {summary.totalInQty.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-right">
                  {summary.totalOutQty.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-right">
                  {summary.totalBalance.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Report Footer */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>This is a computer-generated report.</p>
            <p>Stock Movement Report - Generated at {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
