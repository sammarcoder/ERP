// 'use client'

// import { useState, useEffect } from 'react'
// import { PrinterIcon, FunnelIcon } from '@heroicons/react/24/outline'

// interface JournalRecord {
//   'ID': number
//   'VoucherNo': string
//   'Date': string
//   'Status': boolean
//   'Zcoas - CoaId → AcName': string
//   'Zvouchertype - VoucherTypeId → VType': string
//   'Journaldetail → Description': string
//   'Journaldetail → AmountDb': number
//   'Journaldetail → AmountCr': number
//   'Zcurrencies - CurrencyId → CurrencyName': string
// }

// export default function JournalMasterReportPage() {
//   const [data, setData] = useState<JournalRecord[]>([])
//   const [filteredData, setFilteredData] = useState<JournalRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showFilters, setShowFilters] = useState(false)

//   // Filter states
//   const [filters, setFilters] = useState({
//     acName: '',
//     dateFrom: '',
//     dateTo: '',
//     description: '',
//     minCredit: '',
//     maxCredit: '',
//     minDebit: '',
//     maxDebit: ''
//   })

//   // Filter options
//   const [filterOptions, setFilterOptions] = useState({
//     acNames: [] as string[]
//   })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   useEffect(() => {
//     applyFilters()
//   }, [filters, data])

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('/api/journalmaster')
//       const result = await response.json()

//       if (result.success) {
//         setData(result.data)
//         setFilteredData(result.data)

//         // Extract unique account names for dropdown
//         const uniqueAcNames = [...new Set(
//           result.data.map((record: any) => record['Zcoas - CoaId → AcName'])
//         )].filter(Boolean).sort()

//         setFilterOptions({ acNames: uniqueAcNames })
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const applyFilters = () => {
//     let filtered = [...data]

//     // Account Name filter
//     if (filters.acName) {
//       filtered = filtered.filter(record => 
//         record['Zcoas - CoaId → AcName'] === filters.acName
//       )
//     }

//     // Date filters
//     if (filters.dateFrom) {
//       filtered = filtered.filter(record => 
//         new Date(record.Date) >= new Date(filters.dateFrom)
//       )
//     }

//     if (filters.dateTo) {
//       filtered = filtered.filter(record => 
//         new Date(record.Date) <= new Date(filters.dateTo)
//       )
//     }

//     // Description filter
//     if (filters.description) {
//       filtered = filtered.filter(record => 
//         record['Journaldetail → Description']?.toLowerCase().includes(filters.description.toLowerCase())
//       )
//     }

//     // Credit filters
//     if (filters.minCredit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountCr'] || 0) >= parseFloat(filters.minCredit)
//       )
//     }

//     if (filters.maxCredit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountCr'] || 0) <= parseFloat(filters.maxCredit)
//       )
//     }

//     // Debit filters
//     if (filters.minDebit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountDb'] || 0) >= parseFloat(filters.minDebit)
//       )
//     }

//     if (filters.maxDebit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountDb'] || 0) <= parseFloat(filters.maxDebit)
//       )
//     }

//     setFilteredData(filtered)
//   }

//   const handlePrint = () => {
//     const printContent = generatePrintHTML()

//     const printWindow = window.open('', '_blank')
//     if (printWindow) {
//       printWindow.document.write(printContent)
//       printWindow.document.close()
//       printWindow.print()
//     }
//   }

//   const generatePrintHTML = () => {
//     const totalCredit = filteredData.reduce((sum, record) => sum + (record['Journaldetail → AmountCr'] || 0), 0)
//     const totalDebit = filteredData.reduce((sum, record) => sum + (record['Journaldetail → AmountDb'] || 0), 0)

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Journal Master Report</title>
//         <style>
//           body { 
//             font-family: Arial, sans-serif; 
//             margin: 20px; 
//             font-size: 12px;
//           }
//           h1 { 
//             text-align: center; 
//             color: #333; 
//             border-bottom: 2px solid #ccc; 
//             padding-bottom: 10px;
//           }
//           .header-info {
//             margin-bottom: 20px;
//             padding: 10px;
//             background-color: #f5f5f5;
//             border-radius: 5px;
//           }
//           table { 
//             width: 100%; 
//             border-collapse: collapse; 
//             margin-bottom: 20px;
//             font-size: 10px;
//           }
//           th, td { 
//             border: 1px solid #ddd; 
//             padding: 6px; 
//             text-align: left; 
//           }
//           th { 
//             background-color: #f2f2f2; 
//             font-weight: bold;
//             font-size: 9px;
//           }
//           .total-row {
//             background-color: #e8f4fd;
//             font-weight: bold;
//           }
//           .amount-dr { color: #dc3545; }
//           .amount-cr { color: #28a745; }
//           @media print {
//             body { margin: 0; }
//             .no-print { display: none; }
//           }
//           @page {
//             margin: 0.5in;
//             size: A4;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Journal Master Report</h1>

//         <div class="header-info">
//           <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
//           <p><strong>Total Records:</strong> ${filteredData.length}</p>
//           <p><strong>Filters Applied:</strong> ${Object.entries(filters).filter(([_, value]) => value).map(([key, value]) => `${key}: ${value}`).join(', ') || 'None'}</p>
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>Voucher No</th>
//               <th>Date</th>
//               <th>Account Name</th>
//               <th>Description</th>
//               <th>Debit</th>
//               <th>Credit</th>
//               <th>Type</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredData.map(record => `
//               <tr>
//                 <td>${record.VoucherNo || ''}</td>
//                 <td>${new Date(record.Date).toLocaleDateString()}</td>
//                 <td>${record['Zcoas - CoaId → AcName'] || ''}</td>
//                 <td>${record['Journaldetail → Description'] || ''}</td>
//                 <td class="amount-dr">${(record['Journaldetail → AmountDb'] || 0).toLocaleString()}</td>
//                 <td class="amount-cr">${(record['Journaldetail → AmountCr'] || 0).toLocaleString()}</td>
//                 <td>${record['Zvouchertype - VoucherTypeId → VType'] || ''}</td>
//                 <td>${record.Status ? 'Active' : 'Inactive'}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td colspan="4"><strong>TOTALS</strong></td>
//               <td class="amount-dr"><strong>${totalDebit.toLocaleString()}</strong></td>
//               <td class="amount-cr"><strong>${totalCredit.toLocaleString()}</strong></td>
//               <td colspan="2"><strong>Net: ${(totalCredit - totalDebit).toLocaleString()}</strong></td>
//             </tr>
//           </tbody>
//         </table>

//         <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #666;">
//           <p>Generated by ERP System - Page will automatically break for pagination</p>
//         </div>
//       </body>
//       </html>
//     `
//   }

//   const clearFilters = () => {
//     setFilters({
//       acName: '',
//       dateFrom: '',
//       dateTo: '',
//       description: '',
//       minCredit: '',
//       maxCredit: '',
//       minDebit: '',
//       maxDebit: ''
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading journal data...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Journal Master Report</h2>
//             <p className="text-sm text-gray-500">
//               Showing {filteredData.length} of {data.length} records
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               Filters
//               {Object.values(filters).some(v => v) && (
//                 <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
//                   Active
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium mb-4">Filter Options</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

//             {/* Account Name Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Account Name
//               </label>
//               <select
//                 value={filters.acName}
//                 onChange={(e) => setFilters(prev => ({ ...prev, acName: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               >
//                 <option value="">All Accounts</option>
//                 {filterOptions.acNames.map(name => (
//                   <option key={name} value={name}>{name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Date From */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date From
//               </label>
//               <input
//                 type="date"
//                 value={filters.dateFrom}
//                 onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             {/* Date To */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date To
//               </label>
//               <input
//                 type="date"
//                 value={filters.dateTo}
//                 onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 placeholder="Search description..."
//                 value={filters.description}
//                 onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             {/* Credit Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Credit Range
//               </label>
//               <div className="flex space-x-2">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   value={filters.minCredit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, minCredit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   value={filters.maxCredit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, maxCredit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//               </div>
//             </div>

//             {/* Debit Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Debit Range
//               </label>
//               <div className="flex space-x-2">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   value={filters.minDebit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, minDebit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   value={filters.maxDebit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, maxDebit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 mt-4">
//             <button
//               onClick={clearFilters}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Data Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Voucher No
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Date
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Account Name
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Description
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Debit
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Credit
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Type
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredData.map((record, index) => (
//                 <tr key={`${record.ID}-${index}`} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {record.VoucherNo}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {new Date(record.Date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {record['Zcoas - CoaId → AcName']}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {record['Journaldetail → Description']}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-red-600">
//                     {(record['Journaldetail → AmountDb'] || 0).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-green-600">
//                     {(record['Journaldetail → AmountCr'] || 0).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900 capitalize">
//                     {record['Zvouchertype - VoucherTypeId → VType']}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       record.Status 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {record.Status ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredData.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-gray-500">No records found matching your filters</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }




































// 'use client'

// import { useState, useEffect } from 'react'
// import { PrinterIcon, FunnelIcon } from '@heroicons/react/24/outline'

// interface JournalRecord {
//   'ID': number
//   'VoucherNo': string
//   'Date': string
//   'Zcoas - CoaId → AcName': string
//   'Zvouchertype - VoucherTypeId → VType': string
//   'Journaldetail → Description': string
//   'Journaldetail → AmountDb': number
//   'Journaldetail → AmountCr': number
//   'Journaldetail → OwnDb': number
//   'Journaldetail → OwnCr': number
//   'Journaldetail → Rate': number
//   'Journaldetail → RecieptNo': string
//   'Zcurrencies - CurrencyId → CurrencyName': string
//   'Status': boolean
// }

// export default function JournalMasterReportPage() {
//   const [data, setData] = useState<JournalRecord[]>([])
//   const [filteredData, setFilteredData] = useState<JournalRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showFilters, setShowFilters] = useState(false)

//   // Filter states
//   const [filters, setFilters] = useState({
//     acName: '', // Keep this filter even though column is hidden
//     dateFrom: '',
//     dateTo: '',
//     description: '',
//     minCredit: '',
//     maxCredit: '',
//     minDebit: '',
//     maxDebit: '',
//     receiptNo: '',
//     entryType: '' // 'credit_only', 'debit_only', or 'all'
//   })

//   // Filter options
//   const [filterOptions, setFilterOptions] = useState({
//     acNames: [] as string[]
//   })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   useEffect(() => {
//     applyFilters()
//   }, [filters, data])

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('/api/journalmaster')
//       const result = await response.json()

//       if (result.success) {
//         setData(result.data)
//         setFilteredData(result.data)

//         // Extract unique account names for dropdown filter
//         const uniqueAcNames = [...new Set(
//           result.data.map((record: any) => record['Zcoas - CoaId → AcName'])
//         )].filter(Boolean).sort()

//         setFilterOptions({ acNames: uniqueAcNames })
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const applyFilters = () => {
//     let filtered = [...data]

//     // Account Name filter (keep this even though column is hidden)
//     if (filters.acName) {
//       filtered = filtered.filter(record => 
//         record['Zcoas - CoaId → AcName'] === filters.acName
//       )
//     }

//     // Date filters
//     if (filters.dateFrom) {
//       filtered = filtered.filter(record => 
//         new Date(record.Date) >= new Date(filters.dateFrom)
//       )
//     }

//     if (filters.dateTo) {
//       filtered = filtered.filter(record => 
//         new Date(record.Date) <= new Date(filters.dateTo)
//       )
//     }

//     // Description filter
//     if (filters.description) {
//       filtered = filtered.filter(record => 
//         record['Journaldetail → Description']?.toLowerCase().includes(filters.description.toLowerCase())
//       )
//     }

//     // Credit filters
//     if (filters.minCredit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountCr'] || 0) >= parseFloat(filters.minCredit)
//       )
//     }

//     if (filters.maxCredit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountCr'] || 0) <= parseFloat(filters.maxCredit)
//       )
//     }

//     // Debit filters
//     if (filters.minDebit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountDb'] || 0) >= parseFloat(filters.minDebit)
//       )
//     }

//     if (filters.maxDebit) {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountDb'] || 0) <= parseFloat(filters.maxDebit)
//       )
//     }

//     // Receipt filter
//     if (filters.receiptNo) {
//       filtered = filtered.filter(record => 
//         record['Journaldetail → RecieptNo']?.toLowerCase().includes(filters.receiptNo.toLowerCase())
//       )
//     }

//     // Entry Type filter - NEW
//     if (filters.entryType === 'credit_only') {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountCr'] || 0) > 0
//       )
//     } else if (filters.entryType === 'debit_only') {
//       filtered = filtered.filter(record => 
//         (record['Journaldetail → AmountDb'] || 0) > 0
//       )
//     }

//     setFilteredData(filtered)
//   }

//   const handlePrint = () => {
//     const printContent = generatePrintHTML()

//     const printWindow = window.open('', '_blank')
//     if (printWindow) {
//       printWindow.document.write(printContent)
//       printWindow.document.close()
//       printWindow.print()
//     }
//   }

//   const generatePrintHTML = () => {
//     const totalCredit = filteredData.reduce((sum, record) => sum + (record['Journaldetail → AmountCr'] || 0), 0)
//     const totalDebit = filteredData.reduce((sum, record) => sum + (record['Journaldetail → AmountDb'] || 0), 0)
//     const totalOwnCredit = filteredData.reduce((sum, record) => sum + (record['Journaldetail → OwnCr'] || 0), 0)
//     const totalOwnDebit = filteredData.reduce((sum, record) => sum + (record['Journaldetail → OwnDb'] || 0), 0)

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Journal Master Report</title>
//         <style>
//           body { 
//             font-family: Arial, sans-serif; 
//             margin: 20px; 
//             font-size: 11px;
//           }
//           h1 { 
//             text-align: center; 
//             color: #333; 
//             border-bottom: 2px solid #ccc; 
//             padding-bottom: 10px;
//             margin-bottom: 20px;
//           }
//           .header-info {
//             margin-bottom: 20px;
//             padding: 10px;
//             background-color: #f5f5f5;
//             border-radius: 5px;
//           }
//           table { 
//             width: 100%; 
//             border-collapse: collapse; 
//             margin-bottom: 20px;
//             font-size: 9px;
//           }
//           th, td { 
//             border: 1px solid #ddd; 
//             padding: 4px; 
//             text-align: left; 
//           }
//           th { 
//             background-color: #f2f2f2; 
//             font-weight: bold;
//             font-size: 8px;
//             text-align: center;
//           }
//           .total-row {
//             background-color: #e8f4fd;
//             font-weight: bold;
//           }
//           .amount-dr { color: #dc3545; font-weight: 500; }
//           .amount-cr { color: #28a745; font-weight: 500; }
//           .text-center { text-align: center; }
//           .text-right { text-align: right; }
//           @media print {
//             body { margin: 0; font-size: 10px; }
//             .no-print { display: none; }
//             table { font-size: 8px; }
//           }
//           @page {
//             margin: 0.4in;
//             size: A4;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Journal Master Report</h1>

//         <div class="header-info">
//           <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
//           <p><strong>Total Records:</strong> ${filteredData.length}</p>
//           <p><strong>Entry Type:</strong> ${
//             filters.entryType === 'credit_only' ? 'Credit Entries Only' :
//             filters.entryType === 'debit_only' ? 'Debit Entries Only' : 'All Entries'
//           }</p>
//           ${filters.acName ? `<p><strong>Account Filter:</strong> ${filters.acName}</p>` : ''}
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th style="width: 15%">Voucher No</th>
//               <th style="width: 10%">Date</th>
//               <th style="width: 25%">Description</th>
//               <th style="width: 10%">Debit</th>
//               <th style="width: 10%">Credit</th>
//               <th style="width: 10%">Own Debit</th>
//               <th style="width: 10%">Own Credit</th>
//               <th style="width: 6%">Rate</th>
//               <th style="width: 14%">Receipt No</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredData.map(record => `
//               <tr>
//                 <td>${record.VoucherNo || ''}</td>
//                 <td class="text-center">${new Date(record.Date).toLocaleDateString()}</td>
//                 <td>${record['Journaldetail → Description'] || ''}</td>
//                 <td class="amount-dr text-right">${(record['Journaldetail → AmountDb'] || 0).toLocaleString()}</td>
//                 <td class="amount-cr text-right">${(record['Journaldetail → AmountCr'] || 0).toLocaleString()}</td>
//                 <td class="amount-dr text-right">${(record['Journaldetail → OwnDb'] || 0).toLocaleString()}</td>
//                 <td class="amount-cr text-right">${(record['Journaldetail → OwnCr'] || 0).toLocaleString()}</td>
//                 <td class="text-center">${(record['Journaldetail → Rate'] || 0).toFixed(2)}</td>
//                 <td class="text-center">${record['Journaldetail → RecieptNo'] || ''}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td colspan="3"><strong>TOTALS</strong></td>
//               <td class="amount-dr text-right"><strong>${totalDebit.toLocaleString()}</strong></td>
//               <td class="amount-cr text-right"><strong>${totalCredit.toLocaleString()}</strong></td>
//               <td class="amount-dr text-right"><strong>${totalOwnDebit.toLocaleString()}</strong></td>
//               <td class="amount-cr text-right"><strong>${totalOwnCredit.toLocaleString()}</strong></td>
//               <td colspan="2" class="text-center"><strong>Net: ${(totalCredit - totalDebit).toLocaleString()}</strong></td>
//             </tr>
//           </tbody>
//         </table>

//         <div style="text-align: center; margin-top: 30px; font-size: 9px; color: #666;">
//           <p>Generated by ERP System</p>
//         </div>
//       </body>
//       </html>
//     `
//   }

//   const clearFilters = () => {
//     setFilters({
//       acName: '',
//       dateFrom: '',
//       dateTo: '',
//       description: '',
//       minCredit: '',
//       maxCredit: '',
//       minDebit: '',
//       maxDebit: '',
//       receiptNo: '',
//       entryType: ''
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading journal data...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Journal Master Report</h2>
//             <p className="text-sm text-gray-500">
//               Showing {filteredData.length} of {data.length} records
//               {filters.entryType && (
//                 <span className="ml-2 text-blue-600">
//                   ({filters.entryType === 'credit_only' ? 'Credit Entries Only' : 'Debit Entries Only'})
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               Filters
//               {Object.values(filters).some(v => v) && (
//                 <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
//                   Active
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium mb-4">Filter Options</h3>

//           {/* Entry Type Filter - NEW */}
//           <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Entry Type Filter
//             </label>
//             <div className="flex space-x-4">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="entryType"
//                   value=""
//                   checked={filters.entryType === ''}
//                   onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
//                   className="mr-2"
//                 />
//                 <span className="text-sm">All Entries</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="entryType"
//                   value="credit_only"
//                   checked={filters.entryType === 'credit_only'}
//                   onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
//                   className="mr-2"
//                 />
//                 <span className="text-sm text-green-600 font-medium">Credit Entries Only</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="entryType"
//                   value="debit_only"
//                   checked={filters.entryType === 'debit_only'}
//                   onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
//                   className="mr-2"
//                 />
//                 <span className="text-sm text-red-600 font-medium">Debit Entries Only</span>
//               </label>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

//             {/* Account Name Filter (keep this even though column is hidden) */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Account Name Filter
//               </label>
//               <select
//                 value={filters.acName}
//                 onChange={(e) => setFilters(prev => ({ ...prev, acName: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               >
//                 <option value="">All Accounts</option>
//                 {filterOptions.acNames.map(name => (
//                   <option key={name} value={name}>{name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Date From */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
//               <input
//                 type="date"
//                 value={filters.dateFrom}
//                 onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             {/* Date To */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
//               <input
//                 type="date"
//                 value={filters.dateTo}
//                 onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <input
//                 type="text"
//                 placeholder="Search description..."
//                 value={filters.description}
//                 onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             {/* Receipt No */}
//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Receipt No</label>
//               <input
//                 type="text"
//                 placeholder="Search receipt..."
//                 value={filters.receiptNo}
//                 onChange={(e) => setFilters(prev => ({ ...prev, receiptNo: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div> */}

//             {/* Credit Range */}
//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Credit Range</label>
//               <div className="flex space-x-2">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   value={filters.minCredit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, minCredit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   value={filters.maxCredit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, maxCredit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//               </div>
//             </div> */}

//             {/* Debit Range */}
//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Debit Range</label>
//               <div className="flex space-x-2">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   value={filters.minDebit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, minDebit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   value={filters.maxDebit}
//                   onChange={(e) => setFilters(prev => ({ ...prev, maxDebit: e.target.value }))}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 />
//               </div>
//             </div> */}
//           </div>

//           <div className="flex justify-end space-x-3 mt-4">
//             <button
//               onClick={clearFilters}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Data Table - Updated columns */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Voucher No
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Date
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Description
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Debit
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Credit
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Own Debit
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Own Credit
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Rate
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Receipt No
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredData.map((record, index) => (
//                 <tr key={`${record.ID}-${index}`} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {record.VoucherNo}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {new Date(record.Date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {record['Journaldetail → Description']}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-red-600">
//                     {(record['Journaldetail → AmountDb'] || 0).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-green-600">
//                     {(record['Journaldetail → AmountCr'] || 0).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-red-500">
//                     {(record['Journaldetail → OwnDb'] || 0).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-green-500">
//                     {(record['Journaldetail → OwnCr'] || 0).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900 text-center">
//                     {(record['Journaldetail → Rate'] || 0).toFixed(2)}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {record['Journaldetail → RecieptNo']}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredData.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-gray-500">No records found matching your filters</p>
//               {filters.entryType && (
//                 <p className="text-gray-400 text-sm mt-2">
//                   Try switching entry type or clearing filters
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Summary */}
//       {filteredData.length > 0 && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Total Debit</p>
//               <p className="text-lg font-bold text-red-600">
//                 {filteredData.reduce((sum, r) => sum + (r['Journaldetail → AmountDb'] || 0), 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Total Credit</p>
//               <p className="text-lg font-bold text-green-600">
//                 {filteredData.reduce((sum, r) => sum + (r['Journaldetail → AmountCr'] || 0), 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Own Debit</p>
//               <p className="text-lg font-bold text-red-500">
//                 {filteredData.reduce((sum, r) => sum + (r['Journaldetail → OwnDb'] || 0), 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Own Credit</p>
//               <p className="text-lg font-bold text-green-500">
//                 {filteredData.reduce((sum, r) => sum + (r['Journaldetail → OwnCr'] || 0), 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Records</p>
//               <p className="text-lg font-bold text-blue-600">
//                 {filteredData.length}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
































// isOpening working but not balance field








// 'use client'

// import { useState, useEffect } from 'react'
// import { PrinterIcon, FunnelIcon } from '@heroicons/react/24/outline'

// interface JournalRecord {
//   'id': number
//   'voucherNo': string
//   'date': string
//   'status': boolean
//   'isOpening': boolean
//   'Zcoas - CoaId__acName': string
//   'Zvouchertype - VoucherTypeId__vType': string
//   'Journaldetail__id': number
//   'Journaldetail__description': string
//   'Journaldetail__amountDb': number
//   'Journaldetail__amountCr': number
//   'Journaldetail__ownDb': number
//   'Journaldetail__ownCr': number
//   'Journaldetail__rate': number
//   'Journaldetail__recieptNo': string
//   'Zcurrencies - CurrencyId__currencyName': string
// }

// interface ProcessedRecord {
//   id: number
//   voucherNo: string
//   date: string
//   description: string
//   amountDb: number
//   amountCr: number
//   ownDb: number
//   ownCr: number
//   rate: number | string
//   receiptNo: string
//   currency: string
//   isOpening: boolean
//   acName: string
// }

// export default function JournalMasterReportPage() {
//   const [data, setData] = useState<JournalRecord[]>([])
//   const [processedData, setProcessedData] = useState<ProcessedRecord[]>([])
//   const [filteredData, setFilteredData] = useState<ProcessedRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showFilters, setShowFilters] = useState(false)

//   // Filter states
//   const [filters, setFilters] = useState({
//     acName: '',
//     dateFrom: '',
//     dateTo: '',
//     description: '',
//     minCredit: '',
//     maxCredit: '',
//     minDebit: '',
//     maxDebit: '',
//     receiptNo: '',
//     entryType: '',
//     showOpeningOnly: false
//   })

//   // Filter options
//   const [filterOptions, setFilterOptions] = useState({
//     acNames: [] as string[]
//   })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   useEffect(() => {
//     processOpeningBalances()
//   }, [data])

//   useEffect(() => {
//     applyFilters()
//   }, [filters, processedData])

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('/api/journalmaster')
//       const result = await response.json()

//       if (result.success) {
//         setData(result.data)

//         // Extract unique account names for dropdown filter
//         const uniqueAcNames = [...new Set(
//           result.data.map((record: any) => record['Zcoas - CoaId__acName'])
//         )].filter(Boolean).sort()

//         setFilterOptions({ acNames: uniqueAcNames })
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const processOpeningBalances = () => {
//     const processedRecords: ProcessedRecord[] = []

//     // Group records by voucher number
//     const groupedByVoucher = data.reduce((acc, record) => {
//       const voucherNo = record.voucherNo
//       if (!acc[voucherNo]) {
//         acc[voucherNo] = []
//       }
//       acc[voucherNo].push(record)
//       return acc
//     }, {} as Record<string, JournalRecord[]>)

//     Object.keys(groupedByVoucher).forEach(voucherNo => {
//       const voucherRecords = groupedByVoucher[voucherNo]
//       const firstRecord = voucherRecords[0]

//       if (firstRecord.isOpening) {
//         // ✅ Opening Balance: Combine all debits and credits
//         const totalDebit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__amountDb'] || 0), 0)
//         const totalCredit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__amountCr'] || 0), 0)
//         const totalOwnDebit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__ownDb'] || 0), 0)
//         const totalOwnCredit = voucherRecords.reduce((sum, r) => sum + (r['Journaldetail__ownCr'] || 0), 0)

//         // Create single combined opening balance record
//         processedRecords.push({
//           id: firstRecord.id,
//           voucherNo: firstRecord.voucherNo,
//           date: firstRecord.date,
//           description: 'Balance B/F', // ✅ Fixed description for opening
//           amountDb: totalDebit,
//           amountCr: totalCredit,
//           ownDb: totalOwnDebit,
//           ownCr: totalOwnCredit,
//           rate: '', // ✅ Empty for opening
//           receiptNo: '', // ✅ Empty for opening
//           currency: voucherRecords.find(r => r['Zcurrencies - CurrencyId__currencyName'])?.['Zcurrencies - CurrencyId__currencyName'] || '',
//           isOpening: true,
//           acName: 'Opening Balance Entry'
//         })
//       } else {
//         // ✅ Regular entries: Process individually
//         voucherRecords.forEach(record => {
//           processedRecords.push({
//             id: record.id,
//             voucherNo: record.voucherNo,
//             date: record.date,
//             description: record['Journaldetail__description'] || '',
//             amountDb: record['Journaldetail__amountDb'] || 0,
//             amountCr: record['Journaldetail__amountCr'] || 0,
//             ownDb: record['Journaldetail__ownDb'] || 0,
//             ownCr: record['Journaldetail__ownCr'] || 0,
//             rate: record['Journaldetail__rate'] || 0,
//             receiptNo: record['Journaldetail__recieptNo'] || '',
//             currency: record['Zcurrencies - CurrencyId__currencyName'] || '',
//             isOpening: false,
//             acName: record['Zcoas - CoaId__acName'] || ''
//           })
//         })
//       }
//     })

//     setProcessedData(processedRecords)
//   }

//   const applyFilters = () => {
//     let filtered = [...processedData]

//     // Account Name filter
//     if (filters.acName) {
//       filtered = filtered.filter(record => 
//         record.acName === filters.acName
//       )
//     }

//     // Show opening only filter
//     if (filters.showOpeningOnly) {
//       filtered = filtered.filter(record => record.isOpening)
//     }

//     // Date filters
//     if (filters.dateFrom) {
//       filtered = filtered.filter(record => 
//         new Date(record.date) >= new Date(filters.dateFrom)
//       )
//     }

//     if (filters.dateTo) {
//       filtered = filtered.filter(record => 
//         new Date(record.date) <= new Date(filters.dateTo)
//       )
//     }

//     // Description filter
//     if (filters.description) {
//       filtered = filtered.filter(record => 
//         record.description?.toLowerCase().includes(filters.description.toLowerCase())
//       )
//     }

//     // Credit filters
//     if (filters.minCredit) {
//       filtered = filtered.filter(record => 
//         record.amountCr >= parseFloat(filters.minCredit)
//       )
//     }

//     if (filters.maxCredit) {
//       filtered = filtered.filter(record => 
//         record.amountCr <= parseFloat(filters.maxCredit)
//       )
//     }

//     // Debit filters
//     if (filters.minDebit) {
//       filtered = filtered.filter(record => 
//         record.amountDb >= parseFloat(filters.minDebit)
//       )
//     }

//     if (filters.maxDebit) {
//       filtered = filtered.filter(record => 
//         record.amountDb <= parseFloat(filters.maxDebit)
//       )
//     }

//     // Receipt filter
//     if (filters.receiptNo) {
//       filtered = filtered.filter(record => 
//         record.receiptNo?.toLowerCase().includes(filters.receiptNo.toLowerCase())
//       )
//     }

//     // Entry Type filter
//     if (filters.entryType === 'credit_only') {
//       filtered = filtered.filter(record => record.amountCr > 0)
//     } else if (filters.entryType === 'debit_only') {
//       filtered = filtered.filter(record => record.amountDb > 0)
//     }

//     setFilteredData(filtered)
//   }

//   const handlePrint = () => {
//     const printContent = generatePrintHTML()

//     const printWindow = window.open('', '_blank')
//     if (printWindow) {
//       printWindow.document.write(printContent)
//       printWindow.document.close()
//       printWindow.print()
//     }
//   }

//   const generatePrintHTML = () => {
//     const totalCredit = filteredData.reduce((sum, record) => sum + record.amountCr, 0)
//     const totalDebit = filteredData.reduce((sum, record) => sum + record.amountDb, 0)
//     const totalOwnCredit = filteredData.reduce((sum, record) => sum + record.ownCr, 0)
//     const totalOwnDebit = filteredData.reduce((sum, record) => sum + record.ownDb, 0)
//     const openingEntries = filteredData.filter(r => r.isOpening).length

//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Journal Master Report</title>
//         <style>
//           body { 
//             font-family: Arial, sans-serif; 
//             margin: 20px; 
//             font-size: 11px;
//           }
//           h1 { 
//             text-align: center; 
//             color: #333; 
//             border-bottom: 2px solid #ccc; 
//             padding-bottom: 10px;
//             margin-bottom: 20px;
//           }
//           .header-info {
//             margin-bottom: 20px;
//             padding: 10px;
//             background-color: #f5f5f5;
//             border-radius: 5px;
//           }
//           table { 
//             width: 100%; 
//             border-collapse: collapse; 
//             margin-bottom: 20px;
//             font-size: 9px;
//           }
//           th, td { 
//             border: 1px solid #ddd; 
//             padding: 4px; 
//             text-align: left; 
//           }
//           th { 
//             background-color: #f2f2f2; 
//             font-weight: bold;
//             font-size: 8px;
//             text-align: center;
//           }
//           .total-row {
//             background-color: #e8f4fd;
//             font-weight: bold;
//           }
//           .opening-row {
//             background-color: #fff3cd;
//             font-style: italic;
//           }
//           .amount-dr { color: #dc3545; font-weight: 500; }
//           .amount-cr { color: #28a745; font-weight: 500; }
//           .text-center { text-align: center; }
//           .text-right { text-align: right; }
//           @media print {
//             body { margin: 0; font-size: 10px; }
//             .no-print { display: none; }
//             table { font-size: 8px; }
//           }
//           @page {
//             margin: 0.4in;
//             size: A4;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Journal Master Report</h1>

//         <div class="header-info">
//           <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
//           <p><strong>Total Records:</strong> ${filteredData.length} (${openingEntries} Opening Balance entries)</p>
//           <p><strong>Entry Type:</strong> ${
//             filters.entryType === 'credit_only' ? 'Credit Entries Only' :
//             filters.entryType === 'debit_only' ? 'Debit Entries Only' : 'All Entries'
//           }</p>
//           ${filters.showOpeningOnly ? '<p><strong>Filter:</strong> Opening Balances Only</p>' : ''}
//           ${filters.acName ? `<p><strong>Account Filter:</strong> ${filters.acName}</p>` : ''}
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th style="width: 12%">Voucher No</th>
//               <th style="width: 10%">Date</th>
//               <th style="width: 25%">Description</th>
//               <th style="width: 10%">Debit</th>
//               <th style="width: 10%">Credit</th>
//               <th style="width: 8%">Own Debit</th>
//               <th style="width: 8%">Own Credit</th>
//               <th style="width: 6%">Rate</th>
//               <th style="width: 11%">Receipt No</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredData.map(record => `
//               <tr class="${record.isOpening ? 'opening-row' : ''}">
//                 <td>${record.voucherNo || ''}</td>
//                 <td class="text-center">${new Date(record.date).toLocaleDateString()}</td>
//                 <td>${record.description}${record.isOpening ? ' 🔶' : ''}</td>
//                 <td class="amount-dr text-right">${record.amountDb.toLocaleString()}</td>
//                 <td class="amount-cr text-right">${record.amountCr.toLocaleString()}</td>
//                 <td class="amount-dr text-right">${record.ownDb.toLocaleString()}</td>
//                 <td class="amount-cr text-right">${record.ownCr.toLocaleString()}</td>
//                 <td class="text-center">${typeof record.rate === 'number' ? record.rate.toFixed(2) : record.rate}</td>
//                 <td class="text-center">${record.receiptNo}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td colspan="3"><strong>TOTALS</strong></td>
//               <td class="amount-dr text-right"><strong>${totalDebit.toLocaleString()}</strong></td>
//               <td class="amount-cr text-right"><strong>${totalCredit.toLocaleString()}</strong></td>
//               <td class="amount-dr text-right"><strong>${totalOwnDebit.toLocaleString()}</strong></td>
//               <td class="amount-cr text-right"><strong>${totalOwnCredit.toLocaleString()}</strong></td>
//               <td colspan="2" class="text-center"><strong>Net: ${(totalCredit - totalDebit).toLocaleString()}</strong></td>
//             </tr>
//           </tbody>
//         </table>

//         <div style="text-align: center; margin-top: 30px; font-size: 9px; color: #666;">
//           <p>Generated by ERP System - 🔶 indicates Opening Balance entries</p>
//         </div>
//       </body>
//       </html>
//     `
//   }

//   const clearFilters = () => {
//     setFilters({
//       acName: '',
//       dateFrom: '',
//       dateTo: '',
//       description: '',
//       minCredit: '',
//       maxCredit: '',
//       minDebit: '',
//       maxDebit: '',
//       receiptNo: '',
//       entryType: '',
//       showOpeningOnly: false
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading journal data...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Journal Master Report</h2>
//             <p className="text-sm text-gray-500">
//               Showing {filteredData.length} of {processedData.length} processed records
//               {filteredData.some(r => r.isOpening) && (
//                 <span className="ml-2 text-orange-600">
//                   (🔶 {filteredData.filter(r => r.isOpening).length} Opening Balance entries)
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               Filters
//               {Object.values(filters).some(v => v) && (
//                 <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
//                   Active
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium mb-4">Filter Options</h3>

//           {/* Opening Balance Filter - NEW */}
//           <div className="mb-4 p-3 bg-orange-50 rounded-lg">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={filters.showOpeningOnly}
//                 onChange={(e) => setFilters(prev => ({ ...prev, showOpeningOnly: e.target.checked }))}
//                 className="mr-2"
//               />
//               <span className="text-sm font-medium text-orange-700">🔶 Show Opening Balance Entries Only</span>
//             </label>
//           </div>

//           {/* Entry Type Filter */}
//           <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type Filter</label>
//             <div className="flex space-x-4">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="entryType"
//                   value=""
//                   checked={filters.entryType === ''}
//                   onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
//                   className="mr-2"
//                 />
//                 <span className="text-sm">All Entries</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="entryType"
//                   value="credit_only"
//                   checked={filters.entryType === 'credit_only'}
//                   onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
//                   className="mr-2"
//                 />
//                 <span className="text-sm text-green-600 font-medium">Credit Entries Only</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="entryType"
//                   value="debit_only"
//                   checked={filters.entryType === 'debit_only'}
//                   onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
//                   className="mr-2"
//                 />
//                 <span className="text-sm text-red-600 font-medium">Debit Entries Only</span>
//               </label>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

//             {/* Account Name Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Account Name Filter</label>
//               <select
//                 value={filters.acName}
//                 onChange={(e) => setFilters(prev => ({ ...prev, acName: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               >
//                 <option value="">All Accounts</option>
//                 {filterOptions.acNames.map(name => (
//                   <option key={name} value={name}>{name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Other filters remain the same... */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
//               <input
//                 type="date"
//                 value={filters.dateFrom}
//                 onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
//               <input
//                 type="date"
//                 value={filters.dateTo}
//                 onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <input
//                 type="text"
//                 placeholder="Search description..."
//                 value={filters.description}
//                 onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 mt-4">
//             <button
//               onClick={clearFilters}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Data Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Own Debit</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Own Credit</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt No</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredData.map((record, index) => (
//                 <tr 
//                   key={`${record.id}-${index}`} 
//                   className={`hover:bg-gray-50 ${record.isOpening ? 'bg-orange-50' : ''}`}
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-900">{record.voucherNo}</td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {new Date(record.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     {record.description}
//                     {record.isOpening && <span className="ml-2 text-orange-500">🔶</span>}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-red-600">
//                     {record.amountDb.toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-green-600">
//                     {record.amountCr.toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-red-500">
//                     {record.ownDb.toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-green-500">
//                     {record.ownCr.toLocaleString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900 text-center">
//                     {typeof record.rate === 'number' ? record.rate.toFixed(2) : record.rate}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">{record.receiptNo}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredData.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-gray-500">No records found matching your filters</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
























































// start fomr the top and go all the way down calculation




















































































// 'use client'

// import { useState, useMemo } from 'react'
// import { PrinterIcon, FunnelIcon } from '@heroicons/react/24/outline'
// import { useJournalData } from '@/hooks/reports/journalmaster/useJournalData'
// import { useBalanceCalculation } from '@/hooks/reports/journalmaster/useBalanceCalculation'
// import FilterPanel from '@/components/Reports/journalmaster/FilterPanel'
// import JournalTable from '@/components/Reports/journalmaster/JournalTable'
// import { FilterState } from '@/types/reports/journalmaster/JournalTypes'

// export default function JournalMasterReportPage() {
//   const { processedData, loading, filterOptions } = useJournalData()
//   const [showFilters, setShowFilters] = useState(false)

//   // Filter states
//   const [filters, setFilters] = useState<FilterState>({
//     acName: '',
//     dateFrom: '',
//     dateTo: '',
//     description: '',
//     minCredit: '',
//     maxCredit: '',
//     minDebit: '',
//     maxDebit: '',
//     receiptNo: '',
//     entryType: '',
//     showOpeningOnly: false
//   })

//   // Apply filters FIRST
//   const filteredData = useMemo(() => {
//     console.log('🔍 Applying filters...')
//     let filtered = [...processedData]

//     if (filters.acName) {
//       filtered = filtered.filter(record => record.acName === filters.acName)
//       console.log(`After account filter (${filters.acName}): ${filtered.length} records`)
//     }

//     if (filters.dateFrom) {
//       filtered = filtered.filter(record => 
//         new Date(record.date) >= new Date(filters.dateFrom)
//       )
//     }

//     if (filters.dateTo) {
//       filtered = filtered.filter(record => 
//         new Date(record.date) <= new Date(filters.dateTo)
//       )
//     }

//     if (filters.description) {
//       filtered = filtered.filter(record => 
//         record.description.toLowerCase().includes(filters.description.toLowerCase())
//       )
//     }

//     if (filters.entryType === 'credit_only') {
//       filtered = filtered.filter(record => record.amountCr > 0)
//     } else if (filters.entryType === 'debit_only') {
//       filtered = filtered.filter(record => record.amountDb > 0)
//     }

//     console.log(`✅ Filtered: ${filtered.length} records`)
//     return filtered
//   }, [processedData, filters])

//   // Calculate balance on FILTERED data
//   const finalData = useBalanceCalculation(filteredData)

//   const clearFilters = () => {
//     setFilters({
//       acName: '',
//       dateFrom: '',
//       dateTo: '',
//       description: '',
//       minCredit: '',
//       maxCredit: '',
//       minDebit: '',
//       maxDebit: '',
//       receiptNo: '',
//       entryType: '',
//       showOpeningOnly: false
//     })
//   }

//   const handlePrint = () => {
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Journal Master Report</title>
//         <style>
//           body { font-family: Arial; margin: 20px; font-size: 11px; }
//           h1 { text-align: center; color: #333; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
//           th { background-color: #f2f2f2; font-size: 9px; }
//           .text-right { text-align: right; }
//           .text-center { text-align: center; }
//           .balance-positive { color: #16a34a; font-weight: bold; }
//           .balance-negative { color: #dc2626; font-weight: bold; }
//           @page { margin: 0.5in; size: A4 landscape; }
//         </style>
//       </head>
//       <body>
//         <h1>Journal Master Report</h1>
//         <p><strong>Records:</strong> ${finalData.length}</p>
//         <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

//         <table>
//           <thead>
//             <tr>
//               <th>Row</th><th>Voucher</th><th>Date</th><th>Description</th>
//               <th>Debit</th><th>Credit</th><th>Own Debit</th><th>Own Credit</th>
//               <th>Rate</th><th>Receipt</th><th>Balance</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${finalData.map(record => `
//               <tr>
//                 <td class="text-center">${record.rowIndex}</td>
//                 <td>${record.voucherNo}</td>
//                 <td class="text-center">${new Date(record.date).toLocaleDateString()}</td>
//                 <td>${record.description}</td>
//                 <td class="text-right">${record.amountDb.toLocaleString()}</td>
//                 <td class="text-right">${record.amountCr.toLocaleString()}</td>
//                 <td class="text-right">${record.ownDb.toLocaleString()}</td>
//                 <td class="text-right">${record.ownCr.toLocaleString()}</td>
//                 <td class="text-center">${record.rate.toFixed(2)}</td>
//                 <td>${record.receiptNo}</td>
//                 <td class="text-right ${record.balance >= 0 ? 'balance-positive' : 'balance-negative'}">${record.balance.toLocaleString()}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `

//     const printWindow = window.open('', '_blank')
//     if (printWindow) {
//       printWindow.document.write(printContent)
//       printWindow.document.close()
//       printWindow.print()
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2">Loading...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Journal Master Report</h2>
//             <p className="text-sm text-gray-500">
//               Total: {processedData.length} | Filtered: {finalData.length} | 
//               Balance calculated from first filtered row
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               Filters
//               {Object.values(filters).some(v => v) && (
//                 <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
//                   Active
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <FilterPanel
//           filters={filters}
//           setFilters={setFilters}
//           filterOptions={filterOptions}
//           onClear={clearFilters}
//         />
//       )}

//       {/* Data Table */}
//       <JournalTable data={finalData} />

//       {/* Summary */}
//       {finalData.length > 0 && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Total Debit</p>
//               <p className="text-lg font-bold text-red-600">
//                 {finalData.reduce((sum, r) => sum + r.amountDb, 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Total Credit</p>
//               <p className="text-lg font-bold text-green-600">
//                 {finalData.reduce((sum, r) => sum + r.amountCr, 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Net Movement</p>
//               <p className="text-lg font-bold text-blue-600">
//                 {(finalData.reduce((sum, r) => sum + r.amountCr, 0) - finalData.reduce((sum, r) => sum + r.amountDb, 0)).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Records</p>
//               <p className="text-lg font-bold text-purple-600">
//                 {finalData.length}
//               </p>
//             </div>
//             <div className="text-center border-l-2 border-blue-200 pl-4">
//               <p className="text-sm text-gray-500">💰 Final Balance</p>
//               <p className={`text-xl font-bold ${
//                 finalData[finalData.length - 1]?.balance >= 0 ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {finalData[finalData.length - 1]?.balance.toLocaleString() || '0'}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }










































// start fomr the top and go all the way down calculation





// 'use client'

// import { useState, useMemo } from 'react'
// import { PrinterIcon, FunnelIcon, CalculatorIcon } from '@heroicons/react/24/outline'
// // import { useJournalData } from './hooks/useJournalData'
// // import { useBalanceCalculation } from './hooks/useBalanceCalculation'
// // import FilterPanel from './components/FilterPanel'
// // import JournalTable from './components/JournalTable'
// // import { FilterState } from './types/JournalTypes'

// import { useJournalData } from '@/hooks/reports/journalmaster/useJournalData'
// import { useBalanceCalculation } from '@/hooks/reports/journalmaster/useBalanceCalculation'
// import FilterPanel from '@/components/Reports/journalmaster/FilterPanel'
// import JournalTable from '@/components/Reports/journalmaster/JournalTable'
// import { FilterState } from '@/types/reports/journalmaster/JournalTypes'

// export default function JournalMasterReportPage() {
//   const { processedData, loading, filterOptions } = useJournalData()
//   const [showFilters, setShowFilters] = useState(false)

//   // Filter states
//   const [filters, setFilters] = useState<FilterState>({
//     acName: '',
//     dateFrom: '',
//     dateTo: '',
//     description: '',
//     minCredit: '',
//     maxCredit: '',
//     minDebit: '',
//     maxDebit: '',
//     receiptNo: '',
//     entryType: '',
//     showOpeningOnly: false
//   })

//   // ⚡ STEP 1: Apply filters FIRST
//   const filteredData = useMemo(() => {
//     console.log('🔍 STEP 1: Applying filters to', processedData.length, 'records')

//     let filtered = [...processedData]

//     // Account Name filter
//     if (filters.acName) {
//       filtered = filtered.filter(record => record.acName === filters.acName)
//       console.log(`After account filter (${filters.acName}): ${filtered.length} records`)
//     }

//     // Date range filters
//     if (filters.dateFrom) {
//       filtered = filtered.filter(record => 
//         new Date(record.date) >= new Date(filters.dateFrom)
//       )
//       console.log(`After date from filter: ${filtered.length} records`)
//     }

//     if (filters.dateTo) {
//       filtered = filtered.filter(record => 
//         new Date(record.date) <= new Date(filters.dateTo)
//       )
//       console.log(`After date to filter: ${filtered.length} records`)
//     }

//     // Description filter
//     if (filters.description) {
//       filtered = filtered.filter(record => 
//         record.description.toLowerCase().includes(filters.description.toLowerCase())
//       )
//       console.log(`After description filter: ${filtered.length} records`)
//     }

//     // Receipt number filter
//     if (filters.receiptNo) {
//       filtered = filtered.filter(record => 
//         record.receiptNo.toLowerCase().includes(filters.receiptNo.toLowerCase())
//       )
//     }

//     // Entry Type filter
//     if (filters.entryType === 'credit_only') {
//       filtered = filtered.filter(record => record.amountCr > 0)
//       console.log(`After credit only filter: ${filtered.length} records`)
//     } else if (filters.entryType === 'debit_only') {
//       filtered = filtered.filter(record => record.amountDb > 0)
//       console.log(`After debit only filter: ${filtered.length} records`)
//     }

//     // Opening balance filter
//     if (filters.showOpeningOnly) {
//       filtered = filtered.filter(record => record.isOpening)
//     }

//     console.log('✅ STEP 1 Complete: Final filtered data has', filtered.length, 'records')
//     return filtered
//   }, [processedData, filters])

//   // ⚡ STEP 2: Calculate balance on filtered data (starts from 0)
//   const finalData = useBalanceCalculation(filteredData)

//   const clearFilters = () => {
//     setFilters({
//       acName: '',
//       dateFrom: '',
//       dateTo: '',
//       description: '',
//       minCredit: '',
//       maxCredit: '',
//       minDebit: '',
//       maxDebit: '',
//       receiptNo: '',
//       entryType: '',
//       showOpeningOnly: false
//     })
//   }

//   const handlePrint = () => {
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Journal Master Report</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; font-size: 10px; }
//           h1 { text-align: center; color: #333; border-bottom: 2px solid #ccc; padding-bottom: 10px; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 9px; }
//           th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
//           th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
//           .text-right { text-align: right; }
//           .text-center { text-align: center; }
//           .balance-positive { color: #16a34a; font-weight: bold; }
//           .balance-negative { color: #dc2626; font-weight: bold; }
//           @page { margin: 0.5in; size: A4 landscape; }
//         </style>
//       </head>
//       <body>
//         <h1>Journal Master Report</h1>
//         <p><strong>Records:</strong> ${finalData.length} | <strong>Generated:</strong> ${new Date().toLocaleString()}</p>
//         ${Object.values(filters).some(v => v) ? `<p><strong>Filters Applied:</strong> Balance calculated on filtered data only</p>` : ''}

//         <table>
//           <thead>
//             <tr>
//               <th>Row</th><th>Voucher</th><th>Date</th><th>Description</th>
//               <th>Debit</th><th>Credit</th><th>Own Debit</th><th>Own Credit</th>
//               <th>Rate</th><th>Receipt</th><th>Balance</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${finalData.map(record => `
//               <tr>
//                 <td class="text-center">${record.rowIndex}</td>
//                 <td>${record.voucherNo}</td>
//                 <td class="text-center">${new Date(record.date).toLocaleDateString()}</td>
//                 <td>${record.description}</td>
//                 <td class="text-right">${record.amountDb.toLocaleString()}</td>
//                 <td class="text-right">${record.amountCr.toLocaleString()}</td>
//                 <td class="text-right">${record.ownDb.toLocaleString()}</td>
//                 <td class="text-right">${record.ownCr.toLocaleString()}</td>
//                 <td class="text-center">${Number(record.rate).toFixed(2)}</td>
//                 <td>${record.receiptNo}</td>
//                 <td class="text-right ${record.balance >= 0 ? 'balance-positive' : 'balance-negative'}">${record.balance.toLocaleString()}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `

//     const printWindow = window.open('', '_blank')
//     if (printWindow) {
//       printWindow.document.write(printContent)
//       printWindow.document.close()
//       printWindow.print()
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading journal data...</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 flex items-center">
//               <CalculatorIcon className="h-6 w-6 mr-2 text-blue-600" />
//               Journal Master Report - Filter First Logic
//             </h2>
//             <p className="text-sm text-gray-500">
//               Total Records: {processedData.length} → Filtered: {finalData.length} → 
//               Balance calculated on filtered data starting from 0
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               Filters
//               {Object.values(filters).some(v => v) && (
//                 <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
//                   Active
//                 </span>
//               )}
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Flow Explanation */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <h3 className="font-bold text-blue-800 flex items-center">
//           ⚡ Correct Flow: Filter First → Calculate Balance
//         </h3>
//         <div className="text-blue-700 text-sm mt-2 space-y-1">
//           <p>✅ Step 1: Apply filters to {processedData.length} records → Get {filteredData.length} filtered records</p>
//           <p>✅ Step 2: Calculate running balance on {filteredData.length} filtered records starting from 0</p>
//           <p>🎯 Balance resets to 0 when filters change (as requested)</p>
//         </div>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <FilterPanel
//           filters={filters}
//           setFilters={setFilters}
//           filterOptions={filterOptions}
//           onClear={clearFilters}
//         />
//       )}

//       {/* Data Table */}
//       <JournalTable data={finalData} />

//       {/* Summary */}
//       {finalData.length > 0 && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-3">Summary (Filtered Data)</h3>
//           <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Total Debit</p>
//               <p className="text-lg font-bold text-red-600">
//                 {finalData.reduce((sum, r) => sum + r.amountDb, 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Total Credit</p>
//               <p className="text-lg font-bold text-green-600">
//                 {finalData.reduce((sum, r) => sum + r.amountCr, 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Own Debit</p>
//               <p className="text-lg font-bold text-red-500">
//                 {finalData.reduce((sum, r) => sum + r.ownDb, 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Own Credit</p>
//               <p className="text-lg font-bold text-green-500">
//                 {finalData.reduce((sum, r) => sum + r.ownCr, 0).toLocaleString()}
//               </p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-500">Records</p>
//               <p className="text-lg font-bold text-purple-600">
//                 {finalData.length}
//               </p>
//             </div>
//             <div className="text-center border-l-2 border-blue-200 pl-4">
//               <p className="text-sm text-gray-500">💰 Final Balance</p>
//               <p className={`text-xl font-bold ${
//                 finalData[finalData.length - 1]?.balance >= 0 ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {finalData[finalData.length - 1]?.balance.toLocaleString() || '0'}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
































// 'use client'

// import { useState } from 'react'
// import { PrinterIcon, FunnelIcon, CalculatorIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
// // import { useJournalData } from './hooks/useJournalData'
// import { useComplexFiltering } from '@/hooks/reports/journalmaster/useComplexFiltering'
// // import FilterPanel from './components/FilterPanel'
// // import JournalTable from './components/JournalTable'
// // import { FilterState } from './types/JournalTypes'
// import { useJournalData } from '@/hooks/reports/journalmaster/useJournalData'
// // import { useBalanceCalculation } from '@/hooks/reports/journalmaster/useBalanceCalculation'
// import FilterPanel from '@/components/Reports/journalmaster/FilterPanel'
// import JournalTable from '@/components/Reports/journalmaster/JournalTable'
// import { FilterState } from '@/types/reports/journalmaster/JournalTypes'

// export default function JournalMasterReportPage() {
//   const { processedData, loading, filterOptions } = useJournalData()
//   const [showFilters, setShowFilters] = useState(false)

//   const [filters, setFilters] = useState<FilterState>({
//     acName: '',
//     dateFrom: '',
//     dateTo: '',
//     description: '',
//     minCredit: '',
//     maxCredit: '',
//     minDebit: '',
//     maxDebit: '',
//     receiptNo: '',
//     entryType: '',
//     showOpeningOnly: false
//   })

//   // Apply complex filtering with complete re-processing
//   const { calculationData, displayData, systemRowInfo, filteringStats } = useComplexFiltering(processedData, filters)

//   const clearFilters = () => {
//     setFilters({
//       acName: '',
//       dateFrom: '',
//       dateTo: '',
//       description: '',
//       minCredit: '',
//       maxCredit: '',
//       minDebit: '',
//       maxDebit: '',
//       receiptNo: '',
//       entryType: '',
//       showOpeningOnly: false
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading complex journal data...</span>
//       </div>
//     )
//   }

//   const hasNonDateFilters = filters.acName || filters.description || filters.entryType
//   const hasDateFilters = filters.dateFrom || filters.dateTo
//   const activeFilterCount = Object.values(filters).filter(v => v).length

//   return (
//     <div className="space-y-6">
//       {/* Header with Re-processing Indicator */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 flex items-center">
//               <ArrowPathIcon className="h-6 w-6 mr-2 text-green-600 animate-spin-slow" />
//               Journal Master - Complete Re-processing Logic
//             </h2>
//             <p className="text-sm text-gray-500">
//               🔄 Original: {filteringStats.originalCount} →
//               📊 After Data Filters: {filteringStats.afterDataFilters} →
//               📅 Display: {filteringStats.afterDateFilter}
//               {filteringStats.hiddenByDate > 0 && (
//                 <span className="text-orange-600 ml-2">
//                   ({filteringStats.hiddenByDate} hidden by date filter)
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               Filters ({activeFilterCount})
//             </button>
//             <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
//               <PrinterIcon className="h-4 w-4 mr-2" />
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Re-processing Flow Visualization */}
//       {/* <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
//         <h3 className="font-bold text-green-800 flex items-center mb-3">
//           🔄 Complete Re-processing Flow (Every Filter Change Triggers Full Restart)
//         </h3>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
//           <div>
//             <h4 className="font-semibold text-green-700 mb-3">📋 Current Filter Chain:</h4>
//             <div className="space-y-2">
//               <div className={`p-2 rounded ${filters.acName ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100'}`}>
//                 <span className="text-sm font-medium">1. Account:</span>
//                 <span className="text-sm ml-2">{filters.acName || 'All Accounts'}</span>
//                 {filters.acName && <span className="text-xs text-blue-600 ml-2">✓ Active</span>}
//               </div>
//               <div className={`p-2 rounded ${filters.description ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100'}`}>
//                 <span className="text-sm font-medium">2. Description:</span>
//                 <span className="text-sm ml-2">{filters.description || 'All Descriptions'}</span>
//                 {filters.description && <span className="text-xs text-blue-600 ml-2">✓ Active</span>}
//               </div>
//               <div className={`p-2 rounded ${filters.entryType ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100'}`}>
//                 <span className="text-sm font-medium">3. Entry Type:</span>
//                 <span className="text-sm ml-2">{filters.entryType || 'All Entries'}</span>
//                 {filters.entryType && <span className="text-xs text-blue-600 ml-2">✓ Active</span>}
//               </div>
//               <div className={`p-2 rounded ${hasDateFilters ? 'bg-orange-100 border border-orange-300' : 'bg-gray-100'}`}>
//                 <span className="text-sm font-medium">4. Date (Display Only):</span>
//                 <span className="text-sm ml-2">
//                   {filters.dateFrom || 'No Start'} → {filters.dateTo || 'No End'}
//                 </span>
//                 {hasDateFilters && <span className="text-xs text-orange-600 ml-2">📅 Display Only</span>}
//               </div>
//             </div>
//           </div>

          
//           <div>
//             <h4 className="font-semibold text-purple-700 mb-3">🔶 System Generated Row Info:</h4>
//             <div className="bg-purple-50 p-3 rounded border border-purple-200">
//               {systemRowInfo.systemRowGenerated ? (
//                 <div className="space-y-2">
//                   <p className="text-sm">✅ <strong>System row generated</strong></p>
//                   <p className="text-sm">📊 From {systemRowInfo.totalOpeningRecords} opening records</p>
//                   <p className="text-sm">💰 Opening Balance:
//                     <span className={`font-bold ml-1 ${systemRowInfo.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                       {systemRowInfo.openingBalance.toLocaleString()}
//                     </span>
//                   </p>
//                   <p className="text-xs text-purple-600">
//                     ⚠️ This balance is calculated from opening records in FILTERED data
//                   </p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-sm text-gray-600">❌ No system row generated</p>
//                   <p className="text-xs text-gray-500">No opening balance records found in filtered data</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

        
//         {hasNonDateFilters && (
//           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
//             <p className="text-sm text-yellow-800">
//               ⚠️ <strong>Re-processing Active:</strong> Any filter change triggers complete restart from original {filteringStats.originalCount} records.
//               Opening balance recalculated from {systemRowInfo.totalOpeningRecords} filtered opening records.
//             </p>
//           </div>
//         )}

    
//         {hasDateFilters && (
//           <div className="mt-4 p-3 bg-orange-50 border border-orange-300 rounded">
//             <p className="text-sm text-orange-800">
//               📅 <strong>Date Filter Special Behavior:</strong> Balance calculated on all {calculationData.length} filtered records,
//               but only displaying {displayData.length} records within date range.
//               {filteringStats.hiddenByDate > 0 && `${filteringStats.hiddenByDate} records hidden but included in balance calculation.`}
//             </p>
//           </div>
//         )}
//       </div> */}

//       {/* Filters Panel */}
//       {showFilters && (
//         <FilterPanel
//           filters={filters}
//           setFilters={setFilters}
//           filterOptions={filterOptions}
//           onClear={clearFilters}
//         />
//       )}

//       {/* Data Table */}
//       {/* <JournalTable data={displayData} /> */}

//       {/* Data Table with Complete System Row Info */}
//       <JournalTable
//         data={displayData}
//         systemRowInfo={{
//           displayBalance: systemRowInfo.displayBalance,
//           calculationBalance: systemRowInfo.calculationBalance,
//           aboveRowBalance: systemRowInfo.aboveRowBalance,
//           lastHiddenRowIndex: systemRowInfo.lastHiddenRowIndex
//         }}
//       />


//       {/* Enhanced Summary with Re-processing Stats */}
//       {displayData.length > 0 && (
//         <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-medium text-gray-900 mb-3">Complete Re-processing Summary</h3>

//           {/* Processing Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
//             <div className="text-center p-3 bg-gray-50 rounded">
//               <p className="text-sm text-gray-500">Original Data</p>
//               <p className="text-lg font-bold text-gray-700">{filteringStats.originalCount}</p>
//             </div>
//             <div className="text-center p-3 bg-blue-50 rounded">
//               <p className="text-sm text-blue-600">After Filters</p>
//               <p className="text-lg font-bold text-blue-700">{filteringStats.afterDataFilters}</p>
//             </div>
//             <div className="text-center p-3 bg-green-50 rounded">
//               <p className="text-sm text-green-600">For Calculation</p>
//               <p className="text-lg font-bold text-green-700">{calculationData.length}</p>
//             </div>
//             <div className="text-center p-3 bg-purple-50 rounded">
//               <p className="text-sm text-purple-600">Display Records</p>
//               <p className="text-lg font-bold text-purple-700">{displayData.length}</p>
//             </div>
//             <div className="text-center p-3 bg-orange-50 rounded">
//               <p className="text-sm text-orange-600">Opening Records</p>
//               <p className="text-lg font-bold text-orange-700">{systemRowInfo.totalOpeningRecords}</p>
//             </div>
//             <div className="text-center p-3 bg-red-50 rounded border-l-4 border-red-300">
//               <p className="text-sm text-red-600">💰 Final Balance</p>
//               <p className={`text-xl font-bold ${displayData[displayData.length - 1]?.balance >= 0 ? 'text-green-600' : 'text-red-600'
//                 }`}>
//                 {displayData[displayData.length - 1]?.balance.toLocaleString() || '0'}
//               </p>
//             </div>
//           </div>

//           {/* Financial Summary */}
//           <div className="border-t pt-4">
//             <h4 className="font-medium text-gray-800 mb-3">Financial Summary (Display Data)</h4>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="text-center">
//                 <p className="text-sm text-red-500">Total Debit</p>
//                 <p className="text-lg font-bold text-red-600">
//                   {displayData.reduce((sum, r) => sum + r.amountDb, 0).toLocaleString()}
//                 </p>
//               </div>
//               <div className="text-center">
//                 <p className="text-sm text-green-500">Total Credit</p>
//                 <p className="text-lg font-bold text-green-600">
//                   {displayData.reduce((sum, r) => sum + r.amountCr, 0).toLocaleString()}
//                 </p>
//               </div>
//               <div className="text-center">
//                 <p className="text-sm text-blue-500">Net Movement</p>
//                 <p className="text-lg font-bold text-blue-600">
//                   {(displayData.reduce((sum, r) => sum + r.amountCr, 0) - displayData.reduce((sum, r) => sum + r.amountDb, 0)).toLocaleString()}
//                 </p>
//               </div>
//               <div className="text-center">
//                 <p className="text-sm text-orange-500">Opening Balance</p>
//                 <p className="text-lg font-bold text-orange-600">
//                   {systemRowInfo.openingBalance.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }































































'use client'

import { useState } from 'react'
import { 
  PrinterIcon, 
  FunnelIcon, 
  CalculatorIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
// import { useJournalData } from './hooks/useJournalData'
// import { useComplexFiltering } from './hooks/useComplexFiltering'
// import FilterPanel from './components/FilterPanel'
// import JournalTable from './components/JournalTable'
// import PrintReport from './components/PrintReport'
// import { FilterState } from './types/JournalTypes'






import { useComplexFiltering } from '@/hooks/reports/journalmaster/useComplexFiltering'
import { useJournalData } from '@/hooks/reports/journalmaster/useJournalData'
import FilterPanel from '@/components/Reports/journalmaster/FilterPanel'
import JournalTable from '@/components/Reports/journalmaster/JournalTable'
import { FilterState } from '@/types/reports/journalmaster/JournalTypes'
import PrintReport from '@/components/Reports/journalmaster/PrintReport'

export default function JournalMasterReportPage() {
  const { processedData, loading, filterOptions } = useJournalData()
  const [showFilters, setShowFilters] = useState(false)
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  
  // Collapsible section state (only for processing summary now)
  const [showProcessingSummary, setShowProcessingSummary] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    acName: '',
    dateFrom: '',
    dateTo: '',
    description: '',
    minCredit: '',
    maxCredit: '',
    minDebit: '',
    maxDebit: '',
    receiptNo: '',
    entryType: '',
    showOpeningOnly: false
  })

  const { calculationData, displayData, systemRowInfo, filteringStats } = useComplexFiltering(processedData, filters)

  const clearFilters = () => {
    setFilters({
      acName: '',
      dateFrom: '',
      dateTo: '',
      description: '',
      minCredit: '',
      maxCredit: '',
      minDebit: '',
      maxDebit: '',
      receiptNo: '',
      entryType: '',
      showOpeningOnly: false
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading journal data...</span>
      </div>
    )
  }

  const hasNonDateFilters = filters.acName || filters.description || filters.entryType
  const hasDateFilters = filters.dateFrom || filters.dateTo
  const activeFilterCount = Object.values(filters).filter(v => v).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CalculatorIcon className="h-6 w-6 mr-2 text-blue-600" />
              Journal Master Report - Simplified
            </h2>
            <p className="text-sm text-gray-500">
              Original: {filteringStats.originalCount} → 
              Filtered: {filteringStats.afterDataFilters} → 
              Display: {filteringStats.afterDateFilter}
              {filteringStats.hiddenByDate > 0 && (
                <span className="text-orange-600 ml-2">
                  ({filteringStats.hiddenByDate} hidden by date filter)
                </span>
              )}
              {systemRowInfo.systemRowGenerated && (
                <span className="text-green-600 ml-2">
                  | System row generated from {systemRowInfo.totalOpeningRecords} opening records
                </span>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters ({activeFilterCount})
            </button>
            <button
              onClick={() => setShowPrintOptions(!showPrintOptions)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Options
            </button>
          </div>
        </div>
      </div>

      {/* Print Options Panel */}
      {showPrintOptions && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Print Report</h3>
          <PrintReport
            data={displayData}
            systemRowInfo={systemRowInfo}
            filteringStats={filteringStats}
            filters={filters}
            onClose={() => setShowPrintOptions(false)}
          />
        </div>
      )}

      {/* Filter Warnings */}
      {hasNonDateFilters && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Active Filters:</strong> Data filtered and opening balance recalculated from {filteringStats.afterDataFilters} records.
            {systemRowInfo.systemRowGenerated && ` Opening balance: ${systemRowInfo.openingBalance.toLocaleString()}`}
          </p>
        </div>
      )}

      {hasDateFilters && (
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            📅 <strong>Date Filter Active:</strong> Balance calculated on all {calculationData.length} filtered records, 
            displaying {displayData.length} records within date range. 
            {filteringStats.hiddenByDate > 0 && `${filteringStats.hiddenByDate} records hidden but included in calculation.`}
          </p>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onClear={clearFilters}
        />
      )}

      {/* Data Table */}
      <JournalTable 
        data={displayData}
        systemRowInfo={{
          displayBalance: systemRowInfo.displayBalance,
          calculationBalance: systemRowInfo.calculationBalance,
          aboveRowBalance: systemRowInfo.aboveRowBalance,
          lastHiddenRowIndex: systemRowInfo.lastHiddenRowIndex
        }}
      />

      {/* Collapsible: Processing Summary Only */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Processing Summary</h3>
            <button
              onClick={() => setShowProcessingSummary(!showProcessingSummary)}
              className="flex items-center px-3 py-1 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              {showProcessingSummary ? (
                <>
                  <EyeSlashIcon className="h-4 w-4 mr-1" />
                  Hide Details
                  <ChevronUpIcon className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Show Details
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Always visible key metrics */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-500">Display Records</p>
              <p className="text-lg font-bold text-gray-700">{displayData.length}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <p className="text-sm text-orange-600">Opening Records</p>
              <p className="text-lg font-bold text-orange-700">{systemRowInfo.totalOpeningRecords}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <p className="text-sm text-green-600">System Row</p>
              <p className="text-lg font-bold text-green-700">
                {systemRowInfo.systemRowGenerated ? '✅ Always' : '❌ No'}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded border-l-4 border-blue-300">
              <p className="text-sm text-blue-600">💰 Final Balance</p>
              <p className={`text-xl font-bold ${
                displayData[displayData.length - 1]?.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {displayData[displayData.length - 1]?.balance.toLocaleString() || '0'}
              </p>
            </div>
          </div>

          {/* Detailed summary - collapsible */}
          {showProcessingSummary && (
            <div className="mt-6 space-y-4">
              {/* Processing Stats */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Processing Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500">Original Data</p>
                    <p className="text-lg font-bold text-gray-700">{filteringStats.originalCount}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-600">After Data Filters</p>
                    <p className="text-lg font-bold text-blue-700">{filteringStats.afterDataFilters}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm text-green-600">For Calculation</p>
                    <p className="text-lg font-bold text-green-700">{calculationData.length}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-sm text-purple-600">After Date Filter</p>
                    <p className="text-lg font-bold text-purple-700">{displayData.length}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <p className="text-sm text-red-600">Hidden by Date</p>
                    <p className="text-lg font-bold text-red-700">{filteringStats.hiddenByDate}</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <p className="text-sm text-yellow-600">First Display Row</p>
                    <p className="text-lg font-bold text-yellow-700">{filteringStats.firstDisplayRowIndex || 1}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">Financial Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-red-500">Total Debit</p>
                    <p className="text-lg font-bold text-red-600">
                      {displayData.reduce((sum, r) => sum + r.amountDb, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-500">Total Credit</p>
                    <p className="text-lg font-bold text-green-600">
                      {displayData.reduce((sum, r) => sum + r.amountCr, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-500">Net Movement</p>
                    <p className="text-lg font-bold text-blue-600">
                      {(displayData.reduce((sum, r) => sum + r.amountCr, 0) - displayData.reduce((sum, r) => sum + r.amountDb, 0)).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-orange-500">Opening Balance</p>
                    <p className="text-lg font-bold text-orange-600">
                      {systemRowInfo.openingBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
