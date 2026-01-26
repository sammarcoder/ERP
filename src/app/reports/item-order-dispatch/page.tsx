// // app/reports/item-order-dispatch/page.tsx

// 'use client'
// import React, { useEffect } from 'react'
// import { useItemOrderDispatchReport } from '@/hooks/reports/orderReport/useItemOrderDispatchReport'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import { ItemMultiSelectInput } from '@/components/common/items/ItemMultiSelectInput'
// import { Input } from '@/components/ui/Input'
// import { Button } from '@/components/ui/Button'
// import { 
//   FileBarChart, Calendar, Filter, RefreshCw, 
//   Package, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Clock,
//   ChevronDown, ChevronRight, Truck, User, MapPin, FileText,
//   ChevronsUpDown, ChevronsDownUp
// } from 'lucide-react'

// export default function ItemOrderDispatchReport() {
//   const {
//     filters,
//     errors,
//     reportData,
//     grandTotals,
//     isLoading,
//     isFetching,
//     hasData,
//     updateFilter,
//     resetFilters,
//     generateReport,
//     toggleOrderExpand,
//     expandAll,
//     collapseAll,
//     isOrderExpanded,
//     getStatusColor,
//     getOrderStatusColor,
//     getUomLabel,
//     formatDate,
//     formatNumber
//   } = useItemOrderDispatchReport();

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//           <FileBarChart className="w-7 h-7 text-emerald-600" />
//           Item Order vs Dispatch Report
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Compare ordered quantities with dispatched quantities - Order wise
//         </p>
//       </div>

//       {/* Filters Card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
//         <div className="flex items-center gap-2 mb-4">
//           <Filter className="w-5 h-5 text-gray-500" />
//           <h2 className="font-semibold text-gray-800">Filters</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Date From */}
//           <Input
//             type="date"
//             label="Date From *"
//             value={filters.dateFrom}
//             onChange={(e) => updateFilter('dateFrom', e.target.value)}
//             error={errors.dateFrom}
//             icon={<Calendar className="w-4 h-4" />}
//           />

//           {/* Date To */}
//           <Input
//             type="date"
//             label="Date To *"
//             value={filters.dateTo}
//             onChange={(e) => updateFilter('dateTo', e.target.value)}
//             error={errors.dateTo}
//             icon={<Calendar className="w-4 h-4" />}
//           />

//           {/* UOM Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               UOM *
//             </label>
//             <select
//               value={filters.uom}
//               onChange={(e) => updateFilter('uom', e.target.value as '1' | '2' | '3')}
//               className={`
//                 w-full px-3 py-2 border rounded-lg text-sm
//                 ${errors.uom ? 'border-red-500' : 'border-gray-300'}
//                 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
//               `}
//             >
//               <option value="1">Primary (Pcs/Pkt)</option>
//               <option value="2">Secondary (Box)</option>
//               <option value="3">Tertiary (Crt)</option>
//             </select>
//             {errors.uom && <p className="text-red-500 text-xs mt-1">{errors.uom}</p>}
//           </div>

//           {/* Customer (Optional) */}
//           <CoaSearchableInput
//             orderType="sales"
//             label="Customer"
//             value={filters.coaId || ''}
//             onChange={(id) => updateFilter('coaId', id ? Number(id) : null)}
//             placeholder="All Customers"
//             showFilter={false}
//             clearable
//           />
//         </div>

//         {/* Item Multi-Select */}
//         <div className="mt-4">
//           <ItemMultiSelectInput
//             label="Items (Optional)"
//             value={filters.itemIds || []}
//             onChange={(ids) => updateFilter('itemIds', ids)}
//             placeholder="All Items - Click to filter specific items..."
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-3 mt-5 pt-4 border-t">
//           <Button
//             variant="success"
//             onClick={generateReport}
//             disabled={isLoading || isFetching}
//             icon={isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileBarChart className="w-4 h-4" />}
//           >
//             {isFetching ? 'Generating...' : 'Generate Report'}
//           </Button>

//           <Button
//             variant="outline"
//             onClick={resetFilters}
//             disabled={isLoading || isFetching}
//             icon={<RefreshCw className="w-4 h-4" />}
//           >
//             Reset
//           </Button>
//         </div>
//       </div>

//       {/* Grand Summary Cards */}
//       {hasData && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           {/* Total Orders */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <FileText className="w-5 h-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-blue-600 font-medium">Total Orders</p>
//                 <p className="text-2xl font-bold text-blue-800">{grandTotals.totalOrders}</p>
//               </div>
//             </div>
//           </div>

//           {/* Total Ordered */}
//           <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <TrendingUp className="w-5 h-5 text-indigo-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-indigo-600 font-medium">Total Ordered</p>
//                 <p className="text-2xl font-bold text-indigo-800">{formatNumber(grandTotals.totalOrderQty)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Total Dispatched */}
//           <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <TrendingDown className="w-5 h-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-emerald-600 font-medium">Total Dispatched</p>
//                 <p className="text-2xl font-bold text-emerald-800">{formatNumber(grandTotals.totalDispatchQty)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Difference */}
//           <div className={`border rounded-xl p-4 ${
//             grandTotals.totalDifference === 0 
//               ? 'bg-green-50 border-green-200' 
//               : grandTotals.totalDifference > 0 
//                 ? 'bg-yellow-50 border-yellow-200'
//                 : 'bg-purple-50 border-purple-200'
//           }`}>
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${
//                 grandTotals.totalDifference === 0 
//                   ? 'bg-green-100' 
//                   : grandTotals.totalDifference > 0 
//                     ? 'bg-yellow-100'
//                     : 'bg-purple-100'
//               }`}>
//                 {grandTotals.totalDifference === 0 ? (
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                 ) : grandTotals.totalDifference > 0 ? (
//                   <Clock className="w-5 h-5 text-yellow-600" />
//                 ) : (
//                   <AlertTriangle className="w-5 h-5 text-purple-600" />
//                 )}
//               </div>
//               <div>
//                 <p className={`text-sm font-medium ${
//                   grandTotals.totalDifference === 0 
//                     ? 'text-green-600' 
//                     : grandTotals.totalDifference > 0 
//                       ? 'text-yellow-600'
//                       : 'text-purple-600'
//                 }`}>Pending</p>
//                 <p className={`text-2xl font-bold ${
//                   grandTotals.totalDifference === 0 
//                     ? 'text-green-800' 
//                     : grandTotals.totalDifference > 0 
//                       ? 'text-yellow-800'
//                       : 'text-purple-800'
//                 }`}>{formatNumber(grandTotals.totalDifference)}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Expand/Collapse All Buttons */}
//       {hasData && (
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <Package className="w-5 h-5 text-gray-500" />
//             <h3 className="font-semibold text-gray-800">Order Details</h3>
//             <span className="text-sm text-gray-500">({reportData.length} orders)</span>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={expandAll}
//               className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <ChevronsUpDown className="w-4 h-4" />
//               Expand All
//             </button>
//             <button
//               onClick={collapseAll}
//               className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <ChevronsDownUp className="w-4 h-4" />
//               Collapse All
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Order-wise Cards */}
//       {hasData && reportData.map((order) => (
//         <div key={order.orderId} className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm overflow-hidden">
//           {/* Order Header - Clickable */}
//           <div 
//             className="px-5 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => toggleOrderExpand(order.orderId)}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 {/* Expand/Collapse Icon */}
//                 {isOrderExpanded(order.orderId) ? (
//                   <ChevronDown className="w-5 h-5 text-gray-500" />
//                 ) : (
//                   <ChevronRight className="w-5 h-5 text-gray-500" />
//                 )}

//                 {/* Order Number & Status */}
//                 <div className="flex items-center gap-3">
//                   <span className="font-bold text-lg text-emerald-700">{order.orderNumber}</span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
//                     {order.orderStatus}
//                   </span>
//                 </div>

//                 {/* Date */}
//                 <div className="flex items-center gap-1 text-gray-600">
//                   <Calendar className="w-4 h-4" />
//                   <span className="text-sm">{formatDate(order.orderDate)}</span>
//                 </div>

//                 {/* Customer */}
//                 <div className="flex items-center gap-1 text-gray-600">
//                   <User className="w-4 h-4" />
//                   <span className="text-sm font-medium">{order.customerName}</span>
//                   {order.customerCity && (
//                     <span className="text-sm text-gray-400">({order.customerCity})</span>
//                   )}
//                 </div>

//                 {/* Sub Customer */}
//                 {order.subCustomer && (
//                   <div className="flex items-center gap-1 text-gray-500">
//                     <MapPin className="w-4 h-4" />
//                     <span className="text-sm">{order.subCustomer}</span>
//                     {order.subCity && <span className="text-sm">- {order.subCity}</span>}
//                   </div>
//                 )}

//                 {/* GDN Numbers */}
//                 {order.gdnNumbers.length > 0 && (
//                   <div className="flex items-center gap-1 text-blue-600">
//                     <Truck className="w-4 h-4" />
//                     <span className="text-sm">{order.gdnNumbers.join(', ')}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Order Totals Summary */}
//               <div className="flex items-center gap-6 text-sm">
//                 <div className="text-right">
//                   <p className="text-gray-500">Ordered</p>
//                   <p className="font-bold text-gray-800">{formatNumber(order.orderTotals.totalOrderQty)}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-500">Dispatched</p>
//                   <p className="font-bold text-emerald-600">{formatNumber(order.orderTotals.totalDispatchQty)}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-500">Pending</p>
//                   <p className={`font-bold ${
//                     order.orderTotals.totalDifference === 0 
//                       ? 'text-green-600' 
//                       : order.orderTotals.totalDifference > 0 
//                         ? 'text-yellow-600' 
//                         : 'text-purple-600'
//                   }`}>{formatNumber(order.orderTotals.totalDifference)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Items Table - Expandable */}
//           {isOrderExpanded(order.orderId) && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700 w-12">#</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Order Qty</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Dispatch Qty</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Difference</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700">UOM</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {order.items.map((item, index) => (
//                     <tr key={item.itemId} className="border-b hover:bg-gray-50">
//                       <td className="px-4 py-3 text-gray-500">{index + 1}</td>
//                       <td className="px-4 py-3 font-medium text-gray-900">
//                         <div className="flex items-center gap-2">
//                           <Package className="w-4 h-4 text-emerald-500" />
//                           {item.itemName}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-right font-mono">
//                         {formatNumber(item.orderQty)}
//                       </td>
//                       <td className="px-4 py-3 text-right font-mono text-emerald-600">
//                         {formatNumber(item.dispatchQty)}
//                       </td>
//                       <td className={`px-4 py-3 text-right font-mono font-medium ${
//                         item.difference === 0 
//                           ? 'text-green-600' 
//                           : item.difference > 0 
//                             ? 'text-yellow-600' 
//                             : 'text-purple-600'
//                       }`}>
//                         {item.difference > 0 ? '+' : ''}{formatNumber(item.difference)}
//                       </td>
//                       <td className="px-4 py-3 text-center text-gray-600">
//                         {item.uomName}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-gray-100 font-semibold">
//                   <tr>
//                     <td colSpan={2} className="px-4 py-3 text-right">Order Totals:</td>
//                     <td className="px-4 py-3 text-right font-mono">{formatNumber(order.orderTotals.totalOrderQty)}</td>
//                     <td className="px-4 py-3 text-right font-mono text-emerald-600">{formatNumber(order.orderTotals.totalDispatchQty)}</td>
//                     <td className={`px-4 py-3 text-right font-mono ${
//                       order.orderTotals.totalDifference === 0 
//                         ? 'text-green-600' 
//                         : order.orderTotals.totalDifference > 0 
//                           ? 'text-yellow-600' 
//                           : 'text-purple-600'
//                     }`}>
//                       {order.orderTotals.totalDifference > 0 ? '+' : ''}{formatNumber(order.orderTotals.totalDifference)}
//                     </td>
//                     <td colSpan={2}></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>
//       ))}

//       {/* Empty State */}
//       {!hasData && !isLoading && !isFetching && (
//         <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
//           <FileBarChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//           <h3 className="text-lg font-medium text-gray-700 mb-2">No Report Generated</h3>
//           <p className="text-gray-500">
//             Select filters and click "Generate Report" to view data
//           </p>
//         </div>
//       )}

//       {/* Loading State */}
//       {(isLoading || isFetching) && (
//         <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
//           <RefreshCw className="w-12 h-12 mx-auto text-emerald-500 animate-spin mb-4" />
//           <h3 className="text-lg font-medium text-gray-700">Generating Report...</h3>
//         </div>
//       )}
//     </div>
//   );
// }











































// // app/reports/item-order-dispatch/page.tsx

// 'use client'
// import React from 'react'
// import { useItemOrderDispatchReport } from '@/hooks/reports/orderReport/useItemOrderDispatchReport'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import { ItemMultiSelectInput } from '@/components/common/items/ItemMultiSelectInput'
// import { Input } from '@/components/ui/Input'
// import { Button } from '@/components/ui/Button'
// import OrderDispatchReportPrint from '@/components/Reports/orderReport/OrderDispatchReportPrint';
// import {
//   FileBarChart, Calendar, Filter, RefreshCw,
//   Package, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Clock,
//   ChevronDown, ChevronRight, User, MapPin, Users,
//   ChevronsUpDown, ChevronsDownUp, FileText
// } from 'lucide-react'

// export default function ItemOrderDispatchReport() {
//   const {
//     filters,
//     errors,
//     reportData,
//     grandTotals,
//     isLoading,
//     isFetching,
//     hasData,
//     updateFilter,
//     resetFilters,
//     generateReport,
//     toggleCustomerExpand,
//     expandAll,
//     collapseAll,
//     isCustomerExpanded,
//     getStatusColor,
//     getUomLabel,
//     getOrderStatusColor,
//     formatDate,
//     formatNumber
//   } = useItemOrderDispatchReport();

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//           <FileBarChart className="w-7 h-7 text-emerald-600" />
//           Item Order vs Dispatch Report
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Compare ordered quantities with dispatched quantities - Customer wise
//         </p>
//       </div>

//       {/* Filters Card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
//         <div className="flex items-center gap-2 mb-4">
//           <Filter className="w-5 h-5 text-gray-500" />
//           <h2 className="font-semibold text-gray-800">Filters</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Date From */}
//           <Input
//             type="date"
//             label="Date From *"
//             value={filters.dateFrom}
//             onChange={(e) => updateFilter('dateFrom', e.target.value)}
//             error={errors.dateFrom}
//             icon={<Calendar className="w-4 h-4" />}
//           />

//           {/* Date To */}
//           <Input
//             type="date"
//             label="Date To *"
//             value={filters.dateTo}
//             onChange={(e) => updateFilter('dateTo', e.target.value)}
//             error={errors.dateTo}
//             icon={<Calendar className="w-4 h-4" />}
//           />

//           {/* UOM Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               UOM *
//             </label>
//             <select
//               value={filters.uom}
//               onChange={(e) => updateFilter('uom', e.target.value as '1' | '2' | '3')}
//               className={`
//                 w-full px-3 py-2 border rounded-lg text-sm
//                 ${errors.uom ? 'border-red-500' : 'border-gray-300'}
//                 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
//               `}
//             >
//               <option value="1">Primary (Pcs/Pkt)</option>
//               <option value="2">Secondary (Box)</option>
//               <option value="3">Tertiary (Crt)</option>
//             </select>
//             {errors.uom && <p className="text-red-500 text-xs mt-1">{errors.uom}</p>}
//           </div>

//           {/* Customer (Optional) */}
//           <CoaSearchableInput
//             orderType="sales"
//             label="Customer"
//             value={filters.coaId || ''}
//             onChange={(id) => updateFilter('coaId', id ? Number(id) : null)}
//             placeholder="All Customers"
//             showFilter={false}
//             clearable
//           />
//         </div>

//         {/* Item Multi-Select */}
//         <div className="mt-4">
//           <ItemMultiSelectInput
//             label="Items (Optional)"
//             value={filters.itemIds || []}
//             onChange={(ids) => updateFilter('itemIds', ids)}
//             placeholder="All Items - Click to filter specific items..."
//           />
//         </div>

//         {/* Action Buttons */}
//         {/* <div className="flex items-center gap-3 mt-5 pt-4 border-t">
//           <Button
//             variant="success"
//             onClick={generateReport}
//             disabled={isLoading || isFetching}
//             icon={isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileBarChart className="w-4 h-4" />}
//           >
//             {isFetching ? 'Generating...' : 'Generate Report'}
//           </Button>





//           <Button
//             variant="outline"
//             onClick={resetFilters}
//             disabled={isLoading || isFetching}
//             icon={<RefreshCw className="w-4 h-4" />}
//           >
//             Reset
//           </Button>
//         </div> */}

//         <div className="flex items-center gap-3 mt-5 pt-4 border-t">
//           <Button
//             variant="success"
//             onClick={generateReport}
//             disabled={isLoading || isFetching}
//             icon={isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileBarChart className="w-4 h-4" />}
//           >
//             {isFetching ? 'Generating...' : 'Generate Report'}
//           </Button>

//           {/* ✅ Print Button */}
//           <OrderDispatchReportPrint
//             reportData={reportData}
//             grandTotals={grandTotals}
//             filters={filters}

//           />

//           <Button
//             variant="outline"
//             onClick={resetFilters}
//             disabled={isLoading || isFetching}
//             icon={<RefreshCw className="w-4 h-4" />}

//           >
//             Reset
//           </Button>
//         </div>
//       </div>

//       {/* Grand Summary Cards */}
//       {hasData && (
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//           {/* Total Customers */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Users className="w-5 h-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-blue-600 font-medium">Customers</p>
//                 <p className="text-2xl font-bold text-blue-800">{grandTotals.totalCustomers}</p>
//               </div>
//             </div>
//           </div>

//           {/* Total Orders */}
//           <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-violet-100 rounded-lg">
//                 <FileText className="w-5 h-5 text-violet-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-violet-600 font-medium">Orders</p>
//                 <p className="text-2xl font-bold text-violet-800">{grandTotals.totalOrders}</p>
//               </div>
//             </div>
//           </div>

//           {/* Total Ordered */}
//           <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <TrendingUp className="w-5 h-5 text-indigo-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-indigo-600 font-medium">Ordered</p>
//                 <p className="text-2xl font-bold text-indigo-800">{formatNumber(grandTotals.totalOrderQty)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Total Dispatched */}
//           <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <TrendingDown className="w-5 h-5 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-emerald-600 font-medium">Dispatched</p>
//                 <p className="text-2xl font-bold text-emerald-800">{formatNumber(grandTotals.totalDispatchQty)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Difference */}
//           <div className={`border rounded-xl p-4 ${grandTotals.totalDifference === 0
//             ? 'bg-green-50 border-green-200'
//             : grandTotals.totalDifference > 0
//               ? 'bg-yellow-50 border-yellow-200'
//               : 'bg-purple-50 border-purple-200'
//             }`}>
//             <div className="flex items-center gap-3">
//               <div className={`p-2 rounded-lg ${grandTotals.totalDifference === 0
//                 ? 'bg-green-100'
//                 : grandTotals.totalDifference > 0
//                   ? 'bg-yellow-100'
//                   : 'bg-purple-100'
//                 }`}>
//                 {grandTotals.totalDifference === 0 ? (
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                 ) : grandTotals.totalDifference > 0 ? (
//                   <Clock className="w-5 h-5 text-yellow-600" />
//                 ) : (
//                   <AlertTriangle className="w-5 h-5 text-purple-600" />
//                 )}
//               </div>
//               <div>
//                 <p className={`text-sm font-medium ${grandTotals.totalDifference === 0
//                   ? 'text-green-600'
//                   : grandTotals.totalDifference > 0
//                     ? 'text-yellow-600'
//                     : 'text-purple-600'
//                   }`}>Pending</p>
//                 <p className={`text-2xl font-bold ${grandTotals.totalDifference === 0
//                   ? 'text-green-800'
//                   : grandTotals.totalDifference > 0
//                     ? 'text-yellow-800'
//                     : 'text-purple-800'
//                   }`}>{formatNumber(grandTotals.totalDifference)}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Expand/Collapse All Buttons */}
//       {hasData && (
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <Users className="w-5 h-5 text-gray-500" />
//             <h3 className="font-semibold text-gray-800">Customer Details</h3>
//             <span className="text-sm text-gray-500">({reportData.length} customers)</span>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={expandAll}
//               className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <ChevronsUpDown className="w-4 h-4" />
//               Expand All
//             </button>
//             <button
//               onClick={collapseAll}
//               className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               <ChevronsDownUp className="w-4 h-4" />
//               Collapse All
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Customer-wise Cards */}
//       {hasData && reportData.map((customer) => (
//         <div key={customer.customerId} className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm overflow-hidden">
//           {/* Customer Header - Clickable */}
//           <div
//             className="px-5 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => toggleCustomerExpand(customer.customerId)}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 {/* Expand/Collapse Icon */}
//                 {isCustomerExpanded(customer.customerId) ? (
//                   <ChevronDown className="w-5 h-5 text-gray-500" />
//                 ) : (
//                   <ChevronRight className="w-5 h-5 text-gray-500" />
//                 )}

//                 {/* Customer Name */}
//                 <div className="flex items-center gap-2">
//                   <User className="w-5 h-5 text-emerald-600" />
//                   <span className="font-bold text-lg text-gray-800">{customer.customerName}</span>
//                 </div>

//                 {/* City */}
//                 {customer.customerCity && (
//                   <div className="flex items-center gap-1 text-gray-500">
//                     <MapPin className="w-4 h-4" />
//                     <span className="text-sm">{customer.customerCity}</span>
//                   </div>
//                 )}

//                 {/* Items count */}
//                 <span className="text-sm text-gray-400">
//                   ({customer.items.length} items)
//                 </span>
//               </div>

//               {/* Customer Totals Summary */}
//               <div className="flex items-center gap-6 text-sm">
//                 <div className="text-right">
//                   <p className="text-gray-500">Ordered</p>
//                   <p className="font-bold text-gray-800">{formatNumber(customer.customerTotals.totalOrderQty)}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-500">Dispatched</p>
//                   <p className="font-bold text-emerald-600">{formatNumber(customer.customerTotals.totalDispatchQty)}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-500">Pending</p>
//                   <p className={`font-bold ${customer.customerTotals.totalDifference === 0
//                     ? 'text-green-600'
//                     : customer.customerTotals.totalDifference > 0
//                       ? 'text-yellow-600'
//                       : 'text-purple-600'
//                     }`}>{formatNumber(customer.customerTotals.totalDifference)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Items Table - Expandable */}
//           {/* {isCustomerExpanded(customer.customerId) && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700 w-12">#</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Order No</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Order Qty</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Dispatch Qty</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Difference</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700">UOM</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customer.items.map((item, index) => (
//                     <tr key={`${item.orderNumber}-${item.itemId}-${index}`} className="border-b hover:bg-gray-50">
//                       <td className="px-4 py-3 text-gray-500">{index + 1}</td>
//                       <td className="px-4 py-3 font-medium text-blue-600">{item.orderNumber}</td>
//                       <td className="px-4 py-3 text-gray-600">{formatDate(item.orderDate)}</td>
//                       <td className="px-4 py-3 font-medium text-gray-900">
//                         <div className="flex items-center gap-2">
//                           <Package className="w-4 h-4 text-emerald-500" />
//                           {item.itemName}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-right font-mono">
//                         {formatNumber(item.orderQty)}
//                       </td>
//                       <td className="px-4 py-3 text-right font-mono text-emerald-600">
//                         {formatNumber(item.dispatchQty)}
//                       </td>
//                       <td className={`px-4 py-3 text-right font-mono font-medium ${
//                         item.difference === 0 
//                           ? 'text-green-600' 
//                           : item.difference > 0 
//                             ? 'text-yellow-600' 
//                             : 'text-purple-600'
//                       }`}>
//                         {item.difference > 0 ? '+' : ''}{formatNumber(item.difference)}
//                       </td>
//                       <td className="px-4 py-3 text-center text-gray-600">
//                         {item.uomName}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-gray-100 font-semibold">
//                   <tr>
//                     <td colSpan={4} className="px-4 py-3 text-right">Customer Total:</td>
//                     <td className="px-4 py-3 text-right font-mono">{formatNumber(customer.customerTotals.totalOrderQty)}</td>
//                     <td className="px-4 py-3 text-right font-mono text-emerald-600">{formatNumber(customer.customerTotals.totalDispatchQty)}</td>
//                     <td className={`px-4 py-3 text-right font-mono ${
//                       customer.customerTotals.totalDifference === 0 
//                         ? 'text-green-600' 
//                         : customer.customerTotals.totalDifference > 0 
//                           ? 'text-yellow-600' 
//                           : 'text-purple-600'
//                     }`}>
//                       {customer.customerTotals.totalDifference > 0 ? '+' : ''}{formatNumber(customer.customerTotals.totalDifference)}
//                     </td>
//                     <td colSpan={2}></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )} */}
//           {/* Items Table - Expandable */}
//           {isCustomerExpanded(customer.customerId) && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700 w-12">#</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Order No</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700">Order Status</th>
//                     <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Order Qty</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Dispatch Qty</th>
//                     <th className="px-4 py-3 text-right font-semibold text-gray-700">Difference</th>
//                     <th className="px-4 py-3 text-center font-semibold text-gray-700">UOM</th>
//                     {/* <th className="px-4 py-3 text-center font-semibold text-gray-700">Item Status</th> */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customer.items.map((item, index) => (
//                     <tr key={`${item.orderNumber}-${item.itemId}-${index}`} className="border-b hover:bg-gray-50">
//                       <td className="px-4 py-3 text-gray-500">{index + 1}</td>
//                       <td className="px-4 py-3 font-medium text-blue-600">{item.orderNumber}</td>
//                       <td className="px-4 py-3 text-gray-600">{formatDate(item.orderDate)}</td>
//                       {/* ✅ Order Status Column */}
//                       <td className="px-4 py-3 text-center">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(item.orderStatus)}`}>
//                           {item.orderStatus}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 font-medium text-gray-900">
//                         <div className="flex items-center gap-2">
//                           <Package className="w-4 h-4 text-emerald-500" />
//                           {item.itemName}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-right font-mono">
//                         {formatNumber(item.orderQty)}
//                       </td>
//                       <td className="px-4 py-3 text-right font-mono text-emerald-600">
//                         {formatNumber(item.dispatchQty)}
//                       </td>
//                       <td className={`px-4 py-3 text-right font-mono font-medium ${item.difference === 0
//                         ? 'text-green-600'
//                         : item.difference > 0
//                           ? 'text-yellow-600'
//                           : 'text-purple-600'
//                         }`}>
//                         {item.difference > 0 ? '+' : ''}{formatNumber(item.difference)}
//                       </td>
//                       <td className="px-4 py-3 text-center text-gray-600">
//                         {item.uomName}
//                       </td>
//                       {/* ✅ Item Status Column */}
//                       {/* <td className="px-4 py-3 text-center">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.itemStatus)}`}>
//                           {item.itemStatus}
//                         </span>
//                       </td> */}
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-gray-100 font-semibold">
//                   <tr>
//                     <td colSpan={5} className="px-4 py-3 text-right">Customer Total:</td>
//                     <td className="px-4 py-3 text-right font-mono">{formatNumber(customer.customerTotals.totalOrderQty)}</td>
//                     <td className="px-4 py-3 text-right font-mono text-emerald-600">{formatNumber(customer.customerTotals.totalDispatchQty)}</td>
//                     <td className={`px-4 py-3 text-right font-mono ${customer.customerTotals.totalDifference === 0
//                       ? 'text-green-600'
//                       : customer.customerTotals.totalDifference > 0
//                         ? 'text-yellow-600'
//                         : 'text-purple-600'
//                       }`}>
//                       {customer.customerTotals.totalDifference > 0 ? '+' : ''}{formatNumber(customer.customerTotals.totalDifference)}
//                     </td>
//                     <td colSpan={2}></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}

//         </div>
//       ))}

//       {/* Empty State */}
//       {!hasData && !isLoading && !isFetching && (
//         <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
//           <FileBarChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//           <h3 className="text-lg font-medium text-gray-700 mb-2">No Report Generated</h3>
//           <p className="text-gray-500">
//             Select filters and click "Generate Report" to view data
//           </p>
//         </div>
//       )}

//       {/* Loading State */}
//       {(isLoading || isFetching) && (
//         <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
//           <RefreshCw className="w-12 h-12 mx-auto text-emerald-500 animate-spin mb-4" />
//           <h3 className="text-lg font-medium text-gray-700">Generating Report...</h3>
//         </div>
//       )}
//     </div>
//   );
// }























































// app/reports/item-order-dispatch/page.tsx

'use client'
import React, { useState } from 'react'  // ✅ Add useState
import { useItemOrderDispatchReport } from '@/hooks/reports/orderReport/useItemOrderDispatchReport'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { ItemMultiSelectInput } from '@/components/common/items/ItemMultiSelectInput'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import OrderDispatchReportPrint from '@/components/Reports/orderReport/OrderDispatchReportPrint';
import {
  FileBarChart, Calendar, Filter, RefreshCw,
  Package, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Clock,
  ChevronDown, ChevronRight, User, MapPin, Users,
  ChevronsUpDown, ChevronsDownUp, FileText, Printer  // ✅ Add Printer icon
} from 'lucide-react'

export default function ItemOrderDispatchReport() {
  // ✅ Add print modal state
  const [showPrintModal, setShowPrintModal] = useState(false);

  const {
    filters,
    errors,
    reportData,
    grandTotals,
    isLoading,
    isFetching,
    hasData,
    updateFilter,
    resetFilters,
    generateReport,
    toggleCustomerExpand,
    expandAll,
    collapseAll,
    isCustomerExpanded,
    getStatusColor,
    getUomLabel,
    getOrderStatusColor,
    formatDate,
    formatNumber
  } = useItemOrderDispatchReport();

  // ✅ Handle print click
  const handlePrint = () => {
    if (hasData) {
      setShowPrintModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileBarChart className="w-7 h-7 text-emerald-600" />
          Item Order vs Dispatch Report
        </h1>
        <p className="text-gray-500 mt-1">
          Compare ordered quantities with dispatched quantities - Customer wise
        </p>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From */}
          <Input
            type="date"
            label="Date From *"
            value={filters.dateFrom}
            onChange={(e) => updateFilter('dateFrom', e.target.value)}
            error={errors.dateFrom}
            icon={<Calendar className="w-4 h-4" />}
          />

          {/* Date To */}
          <Input
            type="date"
            label="Date To *"
            value={filters.dateTo}
            onChange={(e) => updateFilter('dateTo', e.target.value)}
            error={errors.dateTo}
            icon={<Calendar className="w-4 h-4" />}
          />

          {/* UOM Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UOM *
            </label>
            <select
              value={filters.uom}
              onChange={(e) => updateFilter('uom', e.target.value as '1' | '2' | '3')}
              className={`
                w-full px-3 py-2 border rounded-lg text-sm
                ${errors.uom ? 'border-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
              `}
            >
              <option value="1">Primary (Pcs/Pkt)</option>
              <option value="2">Secondary (Box)</option>
              <option value="3">Tertiary (Crt)</option>
            </select>
            {errors.uom && <p className="text-red-500 text-xs mt-1">{errors.uom}</p>}
          </div>

          {/* Customer (Optional) */}
          <CoaSearchableInput
            orderType="sales"
            label="Customer"
            value={filters.coaId || ''}
            onChange={(id) => updateFilter('coaId', id ? Number(id) : null)}
            placeholder="All Customers"
            showFilter={false}
            clearable
          />
        </div>

        {/* Item Multi-Select */}
        <div className="mt-4">
          <ItemMultiSelectInput
            label="Items (Optional)"
            value={filters.itemIds || []}
            onChange={(ids) => updateFilter('itemIds', ids)}
            placeholder="All Items - Click to filter specific items..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t">
          <Button
            variant="success"
            onClick={generateReport}
            disabled={isLoading || isFetching}
            icon={isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileBarChart className="w-4 h-4" />}
          >
            {isFetching ? 'Generating...' : 'Generate Report'}
          </Button>

          {/* ✅ Print Button - Only clickable when hasData */}
          <Button
            variant="primary"
            onClick={handlePrint}
            disabled={!hasData || isLoading || isFetching}
            icon={<Printer className="w-4 h-4" />}
          >
            Print
          </Button>

          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={isLoading || isFetching}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Grand Summary Cards */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Total Customers */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Customers</p>
                <p className="text-2xl font-bold text-blue-800">{grandTotals.totalCustomers}</p>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-violet-600 font-medium">Orders</p>
                <p className="text-2xl font-bold text-violet-800">{grandTotals.totalOrders}</p>
              </div>
            </div>
          </div>

          {/* Total Ordered */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Ordered</p>
                <p className="text-2xl font-bold text-indigo-800">{formatNumber(grandTotals.totalOrderQty)}</p>
              </div>
            </div>
          </div>

          {/* Total Dispatched */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Dispatched</p>
                <p className="text-2xl font-bold text-emerald-800">{formatNumber(grandTotals.totalDispatchQty)}</p>
              </div>
            </div>
          </div>

          {/* Difference */}
          <div className={`border rounded-xl p-4 ${grandTotals.totalDifference === 0
            ? 'bg-green-50 border-green-200'
            : grandTotals.totalDifference > 0
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-purple-50 border-purple-200'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${grandTotals.totalDifference === 0
                ? 'bg-green-100'
                : grandTotals.totalDifference > 0
                  ? 'bg-yellow-100'
                  : 'bg-purple-100'
                }`}>
                {grandTotals.totalDifference === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : grandTotals.totalDifference > 0 ? (
                  <Clock className="w-5 h-5 text-yellow-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${grandTotals.totalDifference === 0
                  ? 'text-green-600'
                  : grandTotals.totalDifference > 0
                    ? 'text-yellow-600'
                    : 'text-purple-600'
                  }`}>Pending</p>
                <p className={`text-2xl font-bold ${grandTotals.totalDifference === 0
                  ? 'text-green-800'
                  : grandTotals.totalDifference > 0
                    ? 'text-yellow-800'
                    : 'text-purple-800'
                  }`}>{formatNumber(grandTotals.totalDifference)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expand/Collapse All Buttons */}
      {hasData && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-800">Customer Details</h3>
            <span className="text-sm text-gray-500">({reportData.length} customers)</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronsUpDown className="w-4 h-4" />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronsDownUp className="w-4 h-4" />
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Customer-wise Cards */}
      {hasData && reportData.map((customer) => (
        <div key={customer.customerId} className="bg-white border border-gray-200 rounded-xl mb-4 shadow-sm overflow-hidden">
          {/* Customer Header - Clickable */}
          <div
            className="px-5 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleCustomerExpand(customer.customerId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isCustomerExpanded(customer.customerId) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}

                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-lg text-gray-800">{customer.customerName}</span>
                </div>

                {customer.customerCity && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{customer.customerCity}</span>
                  </div>
                )}

                <span className="text-sm text-gray-400">
                  ({customer.items.length} items)
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <p className="text-gray-500">Ordered</p>
                  <p className="font-bold text-gray-800">{formatNumber(customer.customerTotals.totalOrderQty)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Dispatched</p>
                  <p className="font-bold text-emerald-600">{formatNumber(customer.customerTotals.totalDispatchQty)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Pending</p>
                  <p className={`font-bold ${customer.customerTotals.totalDifference === 0
                    ? 'text-green-600'
                    : customer.customerTotals.totalDifference > 0
                      ? 'text-yellow-600'
                      : 'text-purple-600'
                    }`}>{formatNumber(customer.customerTotals.totalDifference)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table - Expandable */}
          {isCustomerExpanded(customer.customerId) && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 w-12">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Order No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Order Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Order Qty</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Dispatch Qty</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Difference</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">UOM</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.items.map((item, index) => (
                    <tr key={`${item.orderNumber}-${item.itemId}-${index}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-blue-600">{item.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(item.orderDate)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(item.orderStatus)}`}>
                          {item.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-500" />
                          {item.itemName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {formatNumber(item.orderQty)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-600">
                        {formatNumber(item.dispatchQty)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-medium ${item.difference === 0
                        ? 'text-green-600'
                        : item.difference > 0
                          ? 'text-yellow-600'
                          : 'text-purple-600'
                        }`}>
                        {item.difference > 0 ? '+' : ''}{formatNumber(item.difference)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {item.uomName}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right">Customer Total:</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(customer.customerTotals.totalOrderQty)}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">{formatNumber(customer.customerTotals.totalDispatchQty)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${customer.customerTotals.totalDifference === 0
                      ? 'text-green-600'
                      : customer.customerTotals.totalDifference > 0
                        ? 'text-yellow-600'
                        : 'text-purple-600'
                      }`}>
                      {customer.customerTotals.totalDifference > 0 ? '+' : ''}{formatNumber(customer.customerTotals.totalDifference)}
                    </td>
                    <td colSpan={1}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Empty State */}
      {!hasData && !isLoading && !isFetching && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FileBarChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Report Generated</h3>
          <p className="text-gray-500">
            Select filters and click "Generate Report" to view data
          </p>
        </div>
      )}

      {/* Loading State */}
      {(isLoading || isFetching) && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-emerald-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Generating Report...</h3>
        </div>
      )}

      {/* ✅ Print Modal - Only render when showPrintModal is true */}
      {showPrintModal && (
        <OrderDispatchReportPrint
          reportData={reportData}
          grandTotals={grandTotals}
          filters={filters}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
