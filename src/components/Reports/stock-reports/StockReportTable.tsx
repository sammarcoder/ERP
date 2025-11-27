// import { StockReportResult } from '@/types//reports/stock/StockReportTypes'

// interface StockReportTableProps {
//   result: StockReportResult
// }

// export default function StockReportTable({ result }: StockReportTableProps) {
//   const { items, summary, filters } = result

//   if (items.length === 0) {
//     const hasFilters = filters.itemClass1 || filters.itemClass2 || 
//                       filters.itemClass3 || filters.itemClass4 || 
//                       filters.searchTerm.trim()

//     return (
//       <div className="bg-white rounded-lg shadow p-6 text-center">
//         {!hasFilters ? (
//           <p className="text-gray-500">Apply at least one filter to view stock data</p>
//         ) : (
//           <p className="text-gray-500">No items found matching the applied filters</p>
//         )}
//       </div>
//     )
//   }

//   const getUomLabel = () => {
//     switch (filters.selectedUom) {
//       case 1: return 'UOM 1 (Base)'
//       case 2: return 'UOM 2 (Secondary)'  
//       case 3: return 'UOM 3 (Tertiary)'
//       default: return 'UOM'
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       {/* Header */}
//       <div className="bg-gray-50 px-6 py-4 border-b">
//         <h3 className="text-lg font-medium">Stock Report - {getUomLabel()}</h3>
//         <p className="text-sm text-gray-600 mt-1">
//           Showing {items.length} items with stock movements
//         </p>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Sr No.
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Item Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 UOM
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-green-600 uppercase bg-green-50">
//                 In Quantity
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-red-600 uppercase bg-red-50">
//                 Out Quantity
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-blue-600 uppercase bg-blue-50">
//                 Balance
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {items.map((item, index) => (
//               <tr key={item.itemId} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm font-medium text-blue-600">
//                   {index + 1}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {item.itemName}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-600">
//                   {item.selectedUom}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-green-700 text-right font-medium bg-green-50">
//                   {item.totalInQty.toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-red-700 text-right font-medium bg-red-50">
//                   {item.totalOutQty.toLocaleString()}
//                 </td>
//                 <td className={`px-6 py-4 text-sm text-right font-bold bg-blue-50 ${
//                   item.balance >= 0 ? 'text-blue-700' : 'text-red-700'
//                 }`}>
//                   {item.balance.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
          
//           {/* Summary Row */}
//           <tfoot className="bg-gray-100">
//             <tr className="font-bold">
//               <td className="px-6 py-4 text-sm text-gray-900" colSpan={3}>
//                 TOTAL ({summary.totalItems} items)
//               </td>
//               <td className="px-6 py-4 text-sm text-green-800 text-right bg-green-100">
//                 {summary.totalInQty.toLocaleString()}
//               </td>
//               <td className="px-6 py-4 text-sm text-red-800 text-right bg-red-100">
//                 {summary.totalOutQty.toLocaleString()}
//               </td>
//               <td className={`px-6 py-4 text-sm text-right bg-blue-100 ${
//                 summary.totalBalance >= 0 ? 'text-blue-800' : 'text-red-800'
//               }`}>
//                 {summary.totalBalance.toLocaleString()}
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   )
// }














































import { StockReportResult } from '@/types/reports/stock/StockReportTypes'

interface StockReportTableProps {
  result: StockReportResult
}

export default function StockReportTable({ result }: StockReportTableProps) {
  const { items, summary, filters } = result

  if (items.length === 0) {
    const hasFilters = filters.itemClass1 || filters.itemClass2 || 
                      filters.itemClass3 || filters.itemClass4 || 
                      filters.searchTerm.trim()

    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        {!hasFilters ? (
          <p className="text-gray-500">Apply at least one filter to view stock data</p>
        ) : (
          <p className="text-gray-500">No items found matching the applied filters</p>
        )}
      </div>
    )
  }

  const getUomLabel = () => {
    switch (filters.selectedUom) {
      case 1: return 'UOM 1 (Base)'
      case 2: return 'UOM 2 (Secondary)'  
      case 3: return 'UOM 3 (Tertiary)'
      default: return 'UOM'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h3 className="text-lg font-medium">Stock Movement Report - {getUomLabel()}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Showing {items.length} items with stock movements
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sr No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                UOM
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-green-600 uppercase bg-green-50">
                In Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-red-600 uppercase bg-red-50">
                Out Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-600 uppercase bg-blue-50">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.itemId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.itemName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  {item.selectedUom}
                </td>
                <td className="px-6 py-4 text-sm text-green-700 text-right font-medium bg-green-50">
                  {item.totalInQty.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-red-700 text-right font-medium bg-red-50">
                  {item.totalOutQty.toLocaleString()}
                </td>
                <td className={`px-6 py-4 text-sm text-right font-bold bg-blue-50 ${
                  item.balance >= 0 ? 'text-blue-700' : 'text-red-700'
                }`}>
                  {item.balance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          
          {/* Summary Row */}
          <tfoot className="bg-gray-100">
            <tr className="font-bold">
              <td className="px-6 py-4 text-sm text-gray-900" colSpan={3}>
                TOTAL ({summary.totalItems} items)
              </td>
              <td className="px-6 py-4 text-sm text-green-800 text-right bg-green-100">
                {summary.totalInQty.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-red-800 text-right bg-red-100">
                {summary.totalOutQty.toLocaleString()}
              </td>
              <td className={`px-6 py-4 text-sm text-right bg-blue-100 ${
                summary.totalBalance >= 0 ? 'text-blue-800' : 'text-red-800'
              }`}>
                {summary.totalBalance.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
