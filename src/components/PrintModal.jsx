// // components/PrintModal.jsx
// import React, { useState } from 'react';

// const PrintModal = ({ order, isPurchase, onClose, getDisplayQuantity }) => {
//   const [dispatchNotes, setDispatchNotes] = useState({});
//   const [transporterInfo, setTransporterInfo] = useState('');
  
//   console.log(order)
  
//   const handleDispatchChange = (index, value) => {
//     setDispatchNotes(prev => ({ ...prev, [index]: value }));
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       {/* FIXED: Much wider modal to show proper preview */}
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-auto">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-100 to-gray-200">
//           <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//             <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             Print {isPurchase ? 'Purchase Order' : 'Sales Invoice'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
//           >
//             ×
//           </button>
//         </div>

//         {/* Print Preview */}
//         <div className="p-6 bg-gray-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg mx-auto max-w-2xl">
            
//             {/* Print Content - FIXED: Proper half A4 size */}
//             <div id="print-content" className="print-content">
//               <div className="w-full mx-auto bg-white">
                
//                 {/* Company Header */}
//                 <div className="text-center mb-6 pb-4 border-b-2 border-black">
//                   <h1 className="text-2xl font-bold text-black mb-2">YOUR COMPANY NAME</h1>
//                   <p className="text-base text-gray-700">123 Business Street, City, State 12345</p>
//                   <p className="text-base text-gray-700">Phone: (123) 456-7890 | Email: info@company.com</p>
//                 </div>

//                 {/* Order Information Section */}
//                 <div className="mb-6">
//                   <div className="grid grid-cols-3 gap-4 text-base">
//                     <div>
//                       <span className="font-bold text-black">Order Date:</span>
//                       <div className="mt-1 font-medium text-lg">
//                         {new Date(order.Date).toLocaleDateString()}
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-bold text-black">Order ID:</span>
//                       <div className="mt-1 font-bold text-lg">
//                         {order.Number}
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-bold text-black">Status:</span>
//                       <div className={`mt-1 font-bold text-lg ${
//                         order.Next_Status === 'Complete' ? 'text-green-600' : 'text-orange-600'
//                       }`}>
//                         {order.Next_Status}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Divider Line */}
//                 <hr className="border-t-2 border-gray-400 my-4" />

//                 {/* Customer Information */}
//                 <div className="mb-6">
//                   <div className="grid grid-cols-2 gap-4 text-base">
//                     <div>
//                       <span className="font-bold text-black">Customer:</span>
//                       <div className="mt-1 font-semibold text-lg">
//                         {order.account?.acName || 'N/A'}
//                       </div>
//                     </div>
//                     <div>
//                       <span className="font-bold text-black">City:</span>
//                       <div className="mt-1 font-medium text-lg">
//                         {order.account?.city || 'N/A'}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transporter Section */}
//                 <div className="mb-6 border border-gray-300 rounded p-4">
//                   <div className="font-bold text-black mb-3 text-lg">TRANSPORTER:</div>
//                   <input
//                     type="text"
//                     value={transporterInfo}
//                     onChange={(e) => setTransporterInfo(e.target.value)}
//                     placeholder="Enter transporter details..."
//                     className="w-full border-b-2 border-gray-400 py-2 px-1 text-base focus:outline-none focus:border-gray-600 no-print-border"
//                     style={{ minHeight: '35px' }}
//                   />
//                 </div>

//                 {/* Items Section */}
//                 <div className="mb-6">
//                   <h3 className="font-bold text-black mb-4 text-center bg-gray-100 py-3 border text-lg">
//                     ORDER ITEMS
//                   </h3>
                  
//                   {/* Table */}
//                   <table className="w-full border-collapse border border-gray-400">
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th className="border border-gray-400 px-3 py-3 text-sm font-bold text-center">
//                           Sr No
//                         </th>
//                         <th className="border border-gray-400 px-4 py-3 text-sm font-bold text-left">
//                           Item Name
//                         </th>
//                         <th className="border border-gray-400 px-4 py-3 text-sm font-bold text-center">
//                           Qty
//                         </th>
//                         <th className="border border-gray-400 px-4 py-3 text-sm font-bold text-center">
//                           Dispatch
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {order.details.map((detail, index) => (
//                         <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                           <td className="border border-gray-400 px-3 py-3 text-center font-bold text-base">
//                             {index + 1}
//                           </td>
//                           <td className="border border-gray-400 px-4 py-3">
//                             <div className="font-medium text-black text-base">
//                               {detail.item?.itemName || 'Unknown Item'}
//                             </div>
//                             {/* {detail.Remarks && (
//                               <div className="text-sm text-gray-600 mt-1 italic">
//                                 Note: {detail.Remarks}
//                               </div>
//                             )} */}
//                           </td>
//                           <td className="border border-gray-400 px-4 py-3 text-center">
//                             <div className="font-bold text-base flex items-center justify-evenly">
//                               {getDisplayQuantity(detail)}
//                               <input className='border w-5 h-5 ml-3 '/>
//                             </div>
//                           </td>
//                           <td className="border border-gray-400 px-4 py-3">
//                             <input
//                               type="text"
//                               value={dispatchNotes[index] || ''}
//                               onChange={(e) => handleDispatchChange(index, e.target.value)}
//                               // placeholder="Dispatch info..."
//                               className="w-full border-none bg-transparent text-sm focus:outline-none focus:bg-yellow-50 no-print-border"
//                               style={{ minHeight: '25px' }}
//                             />
//                             <div className="border-b border-gray-300 mt-1"></div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Footer */}
//                 <div className="text-center mt-4 pt-3 border-t border-gray-300">
//                   <p className="text-sm text-gray-600">
//                     Print: {new Date().toLocaleString()}
//                   </p>

//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 p-6 border-t bg-gray-100">
//           <button
//             onClick={onClose}
//             className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-base font-medium flex items-center"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             Cancel
//           </button>
//           <button
//             onClick={handlePrint}
//             className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base flex items-center font-medium"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             Print Invoice
//           </button>
//         </div>
//       </div>

//       {/* FIXED: Print Styles - Normal Readable Text Size */}
//       <style jsx global>{`
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             color-adjust: exact !important;
//           }
          
//           body * {
//             visibility: hidden;
//           }
          
//           .print-content, .print-content * {
//             visibility: visible;
//           }
          
//           .print-content {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100% !important;
//             max-width: none !important;
//             margin: 0;
//             padding: 1in;
//             font-family: Arial, sans-serif;
//             font-size: 14pt !important;
//             line-height: 1.5;
//             color: #000;
//             background: white;
//           }
          
//           .print-content h1 {
//             font-size: 24pt !important;
//             font-weight: bold !important;
//             margin: 0 0 12pt 0 !important;
//           }
          
//           .print-content h3 {
//             font-size: 18pt !important;
//             font-weight: bold !important;
//             margin: 0 0 8pt 0 !important;
//           }
          
//           .print-content .text-2xl {
//             font-size: 20pt !important;
//           }
          
//           .print-content .text-xl {
//             font-size: 18pt !important;
//           }
          
//           .print-content .text-lg {
//             font-size: 16pt !important;
//           }
          
//           .print-content .text-base {
//             font-size: 14pt !important;
//           }
          
//           .print-content .text-sm {
//             font-size: 12pt !important;
//           }
          
//           .print-content table {
//             border-collapse: collapse !important;
//             width: 100% !important;
//             margin: 12pt 0 !important;
//           }
          
//           .print-content th {
//             border: 1pt solid #000 !important;
//             padding: 8pt !important;
//             background-color: #f0f0f0 !important;
//             font-weight: bold !important;
//             font-size: 14pt !important;
//           }
          
//           .print-content td {
//             border: 1pt solid #000 !important;
//             padding: 8pt !important;
//             font-size: 14pt !important;
//             line-height: 1.4;
//           }
          
//           .print-content .bg-gray-200 {
//             background-color: #f0f0f0 !important;
//           }
          
//           .print-content .bg-gray-100 {
//             background-color: #f5f5f5 !important;
//           }
          
//           .print-content .bg-gray-50 {
//             background-color: #f8f8f8 !important;
//           }
          
//           .print-content input.no-print-border {
//             border: none !important;
//             border-bottom: 1pt solid #000 !important;
//             background: transparent !important;
//             font-size: 14pt !important;
//             padding: 2pt 0 !important;
//             min-height: 24pt !important;
//           }
          
//           .print-content .border-t-2 {
//             border-top: 2pt solid #000 !important;
//           }
          
//           .print-content .border-b-2 {
//             border-bottom: 2pt solid #000 !important;
//           }
          
//           .print-content .mb-6 {
//             margin-bottom: 16pt !important;
//           }
          
//           .print-content .mb-4 {
//             margin-bottom: 12pt !important;
//           }
          
//           .print-content .py-3 {
//             padding-top: 8pt !important;
//             padding-bottom: 8pt !important;
//           }
          
//           .print-content .px-4 {
//             padding-left: 8pt !important;
//             padding-right: 8pt !important;
//           }
          
//           @page {
//             size: A4;
//             margin: 1in;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PrintModal;















































































// // components/PrintModal.jsx
// import React, { useState, useRef, useEffect } from 'react';

// const PrintModal = ({ order, isPurchase, onClose, getDisplayQuantity }) => {
//   const [dispatchNotes, setDispatchNotes] = useState({});
//   const [transporterInfo, setTransporterInfo] = useState('');
//   const [pages, setPages] = useState([]);
//   const contentRef = useRef(null);
  
//   const handleDispatchChange = (index, value) => {
//     setDispatchNotes(prev => ({ ...prev, [index]: value }));
//   };

//   // Pagination logic - split items across pages if needed
//   useEffect(() => {
//     if (order?.details) {
//       const itemsPerPage = 8; // Adjust based on your 7" height requirement
//       const totalItems = order.details.length;
//       const totalPages = Math.ceil(totalItems / itemsPerPage);
      
//       const newPages = [];
//       for (let i = 0; i < totalPages; i++) {
//         const startIndex = i * itemsPerPage;
//         const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//         newPages.push({
//           pageNumber: i + 1,
//           totalPages: totalPages,
//           items: order.details.slice(startIndex, endIndex)
//         });
//       }
//       setPages(newPages);
//     }
//   }, [order]);

//   const handlePrint = () => {
//     window.print();
//   };

//   const CustomerInfo = () => (
//     <div className="mb-4">
//       <div className="grid grid-cols-2 gap-2 text-sm">
//         <div>
//           <span className="font-bold text-black">Customer:</span>
//           <div className="mt-1 font-semibold">
//             {order.account?.acName || 'N/A'}
//           </div>
//         </div>
//         <div>
//           <span className="font-bold text-black">City:</span>
//           <div className="mt-1 font-medium">
//             {order.account?.city || 'N/A'}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-auto">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-gray-100 to-gray-200">
//           <h2 className="text-xl font-bold text-gray-800">
//             Print {isPurchase ? 'Purchase Order' : 'Sales Invoice'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
//           >
//             ×
//           </button>
//         </div>

//         {/* Print Preview */}
//         <div className="p-4 bg-gray-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
            
//             {/* Print Content */}
//             <div id="print-content" className="print-content" ref={contentRef}>
//               {pages.map((page, pageIndex) => (
//                 <div key={pageIndex} className={`page ${pageIndex > 0 ? 'page-break' : ''}`}>
                  
//                   {/* Page 1 Header - Full info */}
//                   {pageIndex === 0 && (
//                     <>
//                       {/* Order Information Section */}
//                       <div className="mb-3">
//                         <div className="grid grid-cols-3 gap-2 text-sm">
//                           <div>
//                             <span className="font-bold text-black">Date:</span>
//                             <div className="mt-1 font-medium">
//                               {new Date(order.Date).toLocaleDateString()}
//                             </div>
//                           </div>
//                           <div>
//                             <span className="font-bold text-black">Order ID:</span>
//                             <div className="mt-1 font-bold">
//                               {order.Number}
//                             </div>
//                           </div>
//                           <div>
//                             <span className="font-bold text-black">Status:</span>
//                             <div className={`mt-1 font-bold ${
//                               order.Next_Status === 'Complete' ? 'text-green-600' : 'text-orange-600'
//                             }`}>
//                               {order.Next_Status}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <hr className="border-t border-gray-400 my-2" />

//                       {/* Customer Information */}
//                       <CustomerInfo />

//                       {/* Transporter Section */}
//                       <div className="mb-3 border border-gray-300 rounded p-2">
//                         <div className="font-bold text-black mb-2 text-sm">TRANSPORTER:</div>
//                         <input
//                           type="text"
//                           value={transporterInfo}
//                           onChange={(e) => setTransporterInfo(e.target.value)}
//                           placeholder="Enter transporter details..."
//                           className="w-full border-b border-gray-400 py-1 px-1 text-sm focus:outline-none focus:border-gray-600 no-print-border"
//                         />
//                       </div>
//                     </>
//                   )}

//                   {/* Subsequent Pages Header - Customer info only */}
//                   {pageIndex > 0 && (
//                     <>
//                       <CustomerInfo />
//                       <hr className="border-t border-gray-400 my-2" />
//                     </>
//                   )}

//                   {/* Items Section */}
//                   <div className="mb-3">
//                     <h3 className="font-bold text-black mb-2 text-center bg-gray-100 py-2 border text-sm">
//                       ORDER ITEMS {page.totalPages > 1 ? `(Page ${page.pageNumber} of ${page.totalPages})` : ''}
//                     </h3>
                    
//                     {/* Table */}
//                     <table className="w-full border-collapse border border-gray-400">
//                       <thead>
//                         <tr className="bg-gray-200">
//                           <th className="border border-gray-400 px-1 py-2 text-xs font-bold text-center">Sr</th>
//                           <th className="border border-gray-400 px-2 py-2 text-xs font-bold text-left">Item Name</th>
//                           <th className="border border-gray-400 px-2 py-2 text-xs font-bold text-center">Qty</th>
//                           <th className="border border-gray-400 px-2 py-2 text-xs font-bold text-center">Dispatch</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {page.items.map((detail, index) => {
//                           const globalIndex = pageIndex * 8 + index; // Adjust based on itemsPerPage
//                           return (
//                             <tr key={globalIndex} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                               <td className="border border-gray-400 px-1 py-2 text-center font-bold text-xs">
//                                 {globalIndex + 1}
//                               </td>
//                               <td className="border border-gray-400 px-2 py-2">
//                                 <div className="font-medium text-black text-xs">
//                                   {detail.item?.itemName || 'Unknown Item'}
//                                 </div>
//                               </td>
//                               <td className="border border-gray-400 px-2 py-2 text-center">
//                                 <div className="font-bold text-xs flex items-center justify-center">
//                                   {getDisplayQuantity(detail)}
//                                   <input className='border w-4 h-4 ml-2' />
//                                 </div>
//                               </td>
//                               <td className="border border-gray-400 px-2 py-2">
//                                 <input
//                                   type="text"
//                                   value={dispatchNotes[globalIndex] || ''}
//                                   onChange={(e) => handleDispatchChange(globalIndex, e.target.value)}
//                                   className="w-full border-none bg-transparent text-xs focus:outline-none no-print-border"
//                                 />
//                                 <div className="border-b border-gray-300 mt-1"></div>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Footer - Only on last page */}
//                   {pageIndex === pages.length - 1 && (
//                     <div className="text-center mt-2 pt-2 border-t border-gray-300">
//                       <p className="text-xs text-gray-600">
//                         Print: {new Date().toLocaleString()}
//                       </p>
//                     </div>
//                   )}

//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 p-4 border-t bg-gray-100">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handlePrint}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//           >
//             Print Invoice
//           </button>
//         </div>
//       </div>

//       {/* Custom 4" x 7" Print Styles */}
//       <style jsx global>{`
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             color-adjust: exact !important;
//           }
          
//           body * {
//             visibility: hidden;
//           }
          
//           .print-content, .print-content * {
//             visibility: visible;
//           }
          
//           .print-content {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100% !important;
//             max-width: none !important;
//             margin: 0;
//             padding: 0.2in;
//             font-family: Arial, sans-serif;
//             font-size: 9pt !important;
//             line-height: 1.2;
//             color: #000;
//             background: white;
//           }
          
//           .page-break {
//             page-break-before: always !important;
//           }
          
//           .print-content h3 {
//             font-size: 10pt !important;
//             font-weight: bold !important;
//             margin: 0 0 4pt 0 !important;
//           }
          
//           .print-content .text-sm {
//             font-size: 8pt !important;
//           }
          
//           .print-content .text-xs {
//             font-size: 7pt !important;
//           }
          
//           .print-content table {
//             border-collapse: collapse !important;
//             width: 100% !important;
//             margin: 4pt 0 !important;
//           }
          
//           .print-content th {
//             border: 0.5pt solid #000 !important;
//             padding: 2pt !important;
//             background-color: #f0f0f0 !important;
//             font-weight: bold !important;
//             font-size: 8pt !important;
//           }
          
//           .print-content td {
//             border: 0.5pt solid #000 !important;
//             padding: 2pt !important;
//             font-size: 8pt !important;
//             line-height: 1.1;
//           }
          
//           .print-content .bg-gray-200 {
//             background-color: #f0f0f0 !important;
//           }
          
//           .print-content .bg-gray-100 {
//             background-color: #f5f5f5 !important;
//           }
          
//           .print-content .bg-gray-50 {
//             background-color: #f8f8f8 !important;
//           }
          
//           .print-content input.no-print-border {
//             border: none !important;
//             border-bottom: 0.5pt solid #000 !important;
//             background: transparent !important;
//             font-size: 8pt !important;
//             padding: 1pt 0 !important;
//             min-height: 12pt !important;
//           }
          
//           .print-content .border-t {
//             border-top: 0.5pt solid #000 !important;
//           }
          
//           .print-content .border-b {
//             border-bottom: 0.5pt solid #000 !important;
//           }
          
//           .print-content .mb-3 {
//             margin-bottom: 8pt !important;
//           }
          
//           .print-content .mb-2 {
//             margin-bottom: 4pt !important;
//           }
          
//           .print-content .py-2 {
//             padding-top: 4pt !important;
//             padding-bottom: 4pt !important;
//           }
          
//           .print-content .px-2 {
//             padding-left: 4pt !important;
//             padding-right: 4pt !important;
//           }
          
//           @page {
//             size: 4in 7in;
//             margin: 0.1in;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PrintModal;



































































// // components/PrintModal.jsx
// import React, { useState, useRef, useEffect } from 'react';

// const PrintModal = ({ order, isPurchase, onClose, getDisplayQuantity }) => {
//   const [dispatchNotes, setDispatchNotes] = useState({});
//   const [transporterInfo, setTransporterInfo] = useState('');
//   const [pages, setPages] = useState([]);
//   const contentRef = useRef(null);
  
//   const handleDispatchChange = (index, value) => {
//     setDispatchNotes(prev => ({ ...prev, [index]: value }));
//   };

//   // Pagination logic - split items across pages if needed
//   useEffect(() => {
//     if (order?.details) {
//       const itemsPerPage = 10; // Adjust based on 7" height
//       const totalItems = order.details.length;
//       const totalPages = Math.ceil(totalItems / itemsPerPage);
      
//       const newPages = [];
//       for (let i = 0; i < totalPages; i++) {
//         const startIndex = i * itemsPerPage;
//         const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//         newPages.push({
//           pageNumber: i + 1,
//           totalPages: totalPages,
//           items: order.details.slice(startIndex, endIndex)
//         });
//       }
//       setPages(newPages);
//     }
//   }, [order]);

//   const handlePrint = () => {
//     window.print();
//   };

//   const CustomerInfo = () => (
//     <div className="mb-4">
//       <div className="grid grid-cols-2 gap-3 text-base">
//         <div>
//           {/* <span className="font-bold text-black">Customer:</span> */}
//           <div className="mt-1 font-semibold text-lg">
//            Customer: {order.account?.acName || 'N/A'}
//           </div>
//         </div>
//         <div>
//           {/* <span className="font-bold text-black">City:</span> */}
//           <div className="mt-1 font-medium text-lg">
//             City: {order.account?.city || 'N/A'}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-auto">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-gray-100 to-gray-200">
//           <h2 className="text-xl font-bold text-gray-800">
//             Print {isPurchase ? 'Purchase Order' : 'Sales Invoice'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
//           >
//             ×
//           </button>
//         </div>

//         {/* Print Preview */}
//         <div className="p-4 bg-gray-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg">
            
//             {/* Print Content */}
//             <div id="print-content" className="print-content" ref={contentRef}>
//               {pages.map((page, pageIndex) => (
//                 <div key={pageIndex} className={`page ${pageIndex > 0 ? 'page-break' : ''}`}>
                  
//                   {/* Page 1 Header - Full info */}
//                   {pageIndex === 0 && (
//                     <>
//                       {/* Order Information Section */}
//                       <div className="mb-4">
//                         <div className="grid grid-cols-3 gap-3 text-base">
//                           <div>
//                             <span className="font-bold text-black">Date: {new Date(order.Date).toLocaleDateString()}</span>
//                             <div className="mt-1 font-medium text-lg">
//                               {/* {new Date(order.Date).toLocaleDateString()} */}
//                             </div>
//                           </div>
//                           <div>
//                             <span className="font-bold text-black">Order ID: {order.Number}</span>
//                             <div className="mt-1 font-bold text-lg">
//                               {/* {order.Number} */}
//                             </div>
//                           </div>
//                           <div>
//                             {/* <span className="font-bold text-black">Status:</span> */}
//                             <div className={`mt-1 font-bold text-lg ${
//                               order.Next_Status === 'Complete' ? 'text-green-600' : 'text-orange-600'
//                             }`}>
//                               Status: {order.Next_Status}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <hr className="border-t-2 border-gray-400 my-3" />

//                       {/* Customer Information */}
//                       <CustomerInfo />

//                       {/* Transporter Section */}
//                       <div className="mb-4 border border-gray-300 rounded p-3">
//                         <div className="font-bold text-black mb-2 text-base">TRANSPORTER:</div>
//                         <input
//                           type="text"
//                           value={transporterInfo}
//                           onChange={(e) => setTransporterInfo(e.target.value)}
//                           // placeholder="Enter transporter details..."
//                           className="w-full  border-gray-400 py-1 px-1 text-base focus:outline-none focus:border-gray-600 no-print-border"
//                         />
//                       </div>
//                     </>
//                   )}

//                   {/* Subsequent Pages Header - Customer info only */}
//                   {pageIndex > 0 && (
//                     <>
//                       <CustomerInfo />
//                       <hr className="border-t-2 border-gray-400 my-3" />
//                     </>
//                   )}

//                   {/* Items Section */}
//                   <div className="mb-4">
//                     <h3 className="font-bold text-black mb-3 text-center bg-gray-100 py-2 border text-lg">
//                       ORDER ITEMS {page.totalPages > 1 ? `(Page ${page.pageNumber} of ${page.totalPages})` : ''}
//                     </h3>
                    
//                     {/* Table with Custom Column Widths */}
//                     <table className="w-full border-collapse border border-gray-400">
//                       <thead>
//                         <tr className="bg-gray-200">
//                           <th className="border border-gray-400 px-2 py-3 text-base font-bold text-center" style={{width: '8%'}}>
//                             Sr
//                           </th>
//                           <th className="border border-gray-400 px-3 py-3 text-base font-bold text-left" style={{width: '45%'}}>
//                             Item Name
//                           </th>
//                           <th className="border border-gray-400 px-3 py-3 text-base font-bold text-center" style={{width: '27%'}}>
//                             Quantity
//                           </th>
//                           <th className="border border-gray-400 px-2 py-3 text-base font-bold text-center" style={{width: '20%'}}>
//                             Dispatch
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {page.items.map((detail, index) => {
//                           const globalIndex = pageIndex * 10 + index; // Adjust based on itemsPerPage
//                           return (
//                             <tr key={globalIndex} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                               <td className="border border-gray-400 px-2 py-3 text-center font-bold text-base">
//                                 {globalIndex + 1}
//                               </td>
//                               <td className="border border-gray-400 px-3 py-3">
//                                 <div className="font-medium text-black text-base">
//                                   {detail.item?.itemName || 'Unknown Item'}
//                                 </div>
//                               </td>
//                               <td className="border border-gray-400 px-3 py-3 text-center">
//                                 <div className="font-bold text-base flex items-center justify-center gap-3">
//                                   <span>{getDisplayQuantity(detail)}</span>
//                                   <input className='border-2 border-gray-400 w-5 h-5 rounded' type="checkbox" />
//                                 </div>
//                               </td>
//                               <td className="border border-gray-400 px-2 py-3">
//                                 <input
//                                   type="text"
//                                   value={dispatchNotes[globalIndex] || ''}
//                                   onChange={(e) => handleDispatchChange(globalIndex, e.target.value)}
//                                   className="w-full border-none bg-transparent text-sm focus:outline-none no-print-border"
//                                 />
//                                 <div className="border-b border-gray-300 mt-1"></div>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Footer - Only on last page */}
//                   {pageIndex === pages.length - 1 && (
//                     <div className="text-center mt-4 pt-2 border-t border-gray-300">
//                       <p className="text-sm text-gray-600">
//                         Print: {new Date().toLocaleString()}
//                       </p>
//                     </div>
//                   )}

//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 p-4 border-t bg-gray-100">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handlePrint}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//           >
//             Print Invoice
//           </button>
//         </div>
//       </div>

//       {/* Custom 4" x 7" Print Styles with Normal Text Sizes */}
//       <style jsx global>{`
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             color-adjust: exact !important;
//           }
          
//           body * {
//             visibility: hidden;
//           }
          
//           .print-content, .print-content * {
//             visibility: visible;
//           }
          
//           .print-content {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100% !important;
//             max-width: none !important;
//             margin: 0;
//             padding: 0.15in;
//             font-family: Arial, sans-serif;
//             font-size: 12pt !important;
//             line-height: 1.3;
//             color: #000;
//             background: white;
//           }
          
//           .page-break {
//             page-break-before: always !important;
//           }
          
//           .print-content h3 {
//             font-size: 14pt !important;
//             font-weight: bold !important;
//             margin: 0 0 6pt 0 !important;
//           }
          
//           .print-content .text-lg {
//             font-size: 13pt !important;
//           }
          
//           .print-content .text-base {
//             font-size: 12pt !important;
//           }
          
//           .print-content .text-sm {
//             font-size: 10pt !important;
//           }
          
//           .print-content table {
//             border-collapse: collapse !important;
//             width: 100% !important;
//             margin: 6pt 0 !important;
//           }
          
//           .print-content th {
//             border: 1pt solid #000 !important;
//             padding: 4pt !important;
//             background-color: #f0f0f0 !important;
//             font-weight: bold !important;
//             font-size: 11pt !important;
//           }
          
//           .print-content td {
//             border: 1pt solid #000 !important;
//             padding: 4pt !important;
//             font-size: 11pt !important;
//             line-height: 1.2;
//             vertical-align: middle !important;
//           }
          
//           .print-content .bg-gray-200 {
//             background-color: #f0f0f0 !important;
//           }
          
//           .print-content .bg-gray-100 {
//             background-color: #f5f5f5 !important;
//           }
          
//           .print-content .bg-gray-50 {
//             background-color: #f8f8f8 !important;
//           }
          
//           .print-content input[type="checkbox"] {
//             width: 12pt !important;
//             height: 12pt !important;
//             border: 1pt solid #000 !important;
//           }
          
//           .print-content input.no-print-border {
//             border: none !important;
//             border-bottom: 1pt solid #000 !important;
//             background: transparent !important;
//             font-size: 10pt !important;
//             padding: 1pt 0 !important;
//             min-height: 14pt !important;
//           }
          
//           .print-content .border-t-2 {
//             border-top: 1pt solid #000 !important;
//           }
          
//           .print-content .mb-4 {
//             margin-bottom: 8pt !important;
//           }
          
//           .print-content .mb-3 {
//             margin-bottom: 6pt !important;
//           }
          
//           .print-content .py-3 {
//             padding-top: 6pt !important;
//             padding-bottom: 6pt !important;
//           }
          
//           .print-content .py-2 {
//             padding-top: 4pt !important;
//             padding-bottom: 4pt !important;
//           }
          
//           .print-content .px-3 {
//             padding-left: 6pt !important;
//             padding-right: 6pt !important;
//           }
          
//           .print-content .px-2 {
//             padding-left: 4pt !important;
//             padding-right: 4pt !important;
//           }
          
//           @page {
//             size: 4in 7in;
//             margin: 0.1in;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PrintModal;































































// components/PrintModal.jsx
import React, { useState, useRef, useEffect } from 'react';

const PrintModal = ({ order, isPurchase, onClose, getDisplayQuantity }) => {
  const [dispatchNotes, setDispatchNotes] = useState({});
  const [transporterInfo, setTransporterInfo] = useState('');
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);
  
  const handleDispatchChange = (index, value) => {
    setDispatchNotes(prev => ({ ...prev, [index]: value }));
  };

  // Create pages - 16 items first page, rest on second page
  useEffect(() => {
    if (order?.details && order.details.length > 0) {
      const itemsFirstPage = 16;
      const allItems = order.details;
      const pagesArray = [];
      
      // First page
      pagesArray.push({
        items: allItems.slice(0, Math.min(itemsFirstPage, allItems.length)),
        startIndex: 0,
        pageNumber: 1,
        isFirst: true
      });
      
      // Second page if needed
      if (allItems.length > itemsFirstPage) {
        pagesArray.push({
          items: allItems.slice(itemsFirstPage),
          startIndex: itemsFirstPage,
          pageNumber: 2,
          isFirst: false
        });
      }
      
      setPages(pagesArray);
    }
  }, [order]);

  const handlePrint = () => {
    // Create iframe for isolated printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    
    // Write the content with adjusted height to prevent cutoff
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Invoice</title>
        <style>
          @page {
            size: 4in 7in;
            margin: 0;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            width: 4in;
            margin: 0;
            padding: 0;
          }
          
          .page {
            width: 3.8in;
            height: 6.7in;  /* Reduced height to prevent cutoff */
            padding: 0.15in;  /* Increased padding from top */
            padding-top: 0.2in;  /* Extra top padding to prevent header cutoff */
            margin: 0 auto;
            page-break-after: always;
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          
          .page:last-child {
            page-break-after: auto;
          }
          
          .header-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 9pt;
          }
          
          .customer-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 10pt;
          }
          
          .divider {
            border-top: 1px solid #333;
            margin: 6px 0;
          }
          
          .ada-box {
            border: 1px solid #666;
            padding: 4px;
            margin: 6px 0;
          }
          
          .ada-label {
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 2px;
          }
          
          .ada-value {
            min-height: 16px;
            font-size: 9pt;
            padding: 2px 0;
          }
          
          .table-title {
            background: #f0f0f0;
            border: 1px solid #333;
            text-align: center;
            padding: 4px;
            font-weight: bold;
            font-size: 10pt;
            margin: 6px 0;
          }
          
          .table-container {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            flex: 1;
          }
          
          th {
            border: 1px solid #000;
            background: #e8e8e8;
            padding: 3px 2px;
            font-size: 9pt;
            font-weight: bold;
            text-align: center;
            height: 22px;
          }
          
          td {
            border: 1px solid #000;
            padding: 3px 2px;
            font-size: 9pt;
            vertical-align: middle;
            height: 20px;
          }
          
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .even { background: white; }
          .odd { background: #f9f9f9; }
          
          .check-box {
            width: 11px;
            height: 11px;
            border: 1px solid #000;
            display: inline-block;
            margin: 0 auto;
          }
          
          .dispatch-value {
            min-height: 12px;
            font-size: 8pt;
            padding: 1px 0;
          }
          
          .footer {
            margin-top: auto;
            text-align: center;
            font-size: 8pt;
            color: #666;
            border-top: 1px solid #999;
            padding-top: 3px;
            padding-bottom: 3px;
          }
          
          .status-complete { color: green; }
          .status-incomplete { color: orange; }
        </style>
      </head>
      <body>
    `);
    
    // Generate pages HTML
    pages.forEach((page, pageIdx) => {
      doc.write('<div class="page">');
      
      if (page.isFirst) {
        // First page header - Full info
        doc.write(`
          <div>
            <div class="header-row">
              <span><strong>Date:</strong> ${new Date(order.Date).toLocaleDateString()}</span>
              <span><strong>:</strong> ${order.Number}</span>
              <span class="${order.Next_Status === 'Complete' ? 'status-complete' : 'status-incomplete'}">
                <strong>Status:</strong> ${order.Next_Status}
              </span>
            </div>
            <div class="divider"></div>
            <div class="customer-row">
              <span><strong>Customer:</strong> ${order.account?.acName || 'N/A'}</span>
              <span><strong>City:</strong> ${order.account?.city || 'N/A'}</span>
            </div>
            <div class="customer-row">
              <span><strong>Sub:</strong> ${order.account?.subCustomer || order.account?.subName || 'N/A'}</span>
              <span><strong>City2:</strong> ${order.account?.city2 || 'N/A'}</span>
            </div>
            <div class="ada-box">
              <div class="ada-label">ADA:</div>
              <div class="ada-value">${transporterInfo || '&nbsp;'}</div>
            </div>
          </div>
        `);
      } else {
        // Subsequent pages - Only customer and city
        doc.write(`
          <div>
            <div class="customer-row" style="font-weight: bold; padding-bottom: 5px; border-bottom: 1px solid #333; margin-bottom: 8px;">
              <span>Customer: ${order.account?.acName || 'N/A'}</span>
              <span>City: ${order.account?.city || 'N/A'}</span>
            </div>
          </div>
        `);
      }
      
      // Table with checkbox as separate column
      doc.write(`
        <div class="table-container">
          <div class="table-title">
            ORDER ITEMS (Page ${page.pageNumber} of ${pages.length})
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 7%">Sr</th>
                <th style="width: 42%" class="text-left">Item Name</th>
                <th style="width: 8%">✓</th>
                <th style="width: 23%">Quantity</th>
                <th style="width: 20%">Dispatch</th>
              </tr>
            </thead>
            <tbody>
      `);
      
      // Add items with checkbox in separate column
      page.items.forEach((detail, idx) => {
        const globalIdx = page.startIndex + idx;
        const rowClass = idx % 2 === 0 ? 'even' : 'odd';
        doc.write(`
          <tr class="${rowClass}">
            <td class="text-center"><strong>${globalIdx + 1}</strong></td>
            <td class="text-left">${detail.item?.itemName || 'Unknown'}</td>
            <td class="text-center">
              <span class="check-box"></span>
            </td>
            <td class="text-center">
              <strong>${getDisplayQuantity(detail)}</strong>
            </td>
            <td>
              <div class="dispatch-value">${dispatchNotes[globalIdx] || '&nbsp;'}</div>
            </td>
          </tr>
        `);
      });
      
      // Fill remaining empty rows to use full page height
      const totalRowsNeeded = page.isFirst ? 16 : 20;
      const emptyRowsNeeded = totalRowsNeeded - page.items.length;
      
      for (let i = 0; i < emptyRowsNeeded; i++) {
        const rowClass = (page.items.length + i) % 2 === 0 ? 'even' : 'odd';
        doc.write(`
          <tr class="${rowClass}">
            <td class="text-center">&nbsp;</td>
            <td>&nbsp;</td>
            <td class="text-center"><span class="check-box"></span></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        `);
      }
      
      doc.write(`
            </tbody>
          </table>
        </div>
      `);
      
      // Footer on last page
      if (pageIdx === pages.length - 1) {
        doc.write(`
          <div class="footer">
            Print: ${new Date().toLocaleString()}
          </div>
        `);
      }
      
      doc.write('</div>');
    });
    
    doc.write(`
      </body>
      </html>
    `);
    doc.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Clean up after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-gray-100 to-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Print {isPurchase ? 'Purchase Order' : 'Sales Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
          >
            ×
          </button>
        </div>

        {/* Print Preview */}
        <div className="p-4 bg-gray-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>
            
            {/* Input Section for Dispatch Notes */}
            <div className="mb-4 border border-gray-300 rounded p-3">
              <h4 className="font-semibold mb-2">Add Notes (Optional):</h4>
              
              {/* ADA/Transporter */}
              <div className="mb-3">
                <label className="font-medium">ADA/Transporter:</label>
                <input
                  type="text"
                  placeholder="Enter ADA details..."
                  value={transporterInfo}
                  onChange={(e) => setTransporterInfo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                />
              </div>
              
              {/* Dispatch Notes */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <label className="font-medium">Dispatch Notes:</label>
                {order.details?.slice(0, 5).map((detail, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-8 font-bold">{index + 1}.</span>
                    <span className="flex-1 truncate">{detail.item?.itemName}:</span>
                    <input
                      type="text"
                      placeholder="Note..."
                      value={dispatchNotes[index] || ''}
                      onChange={(e) => handleDispatchChange(index, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                    />
                  </div>
                ))}
                {order.details?.length > 5 && (
                  <p className="text-xs text-gray-500">+ {order.details.length - 5} more items...</p>
                )}
              </div>
            </div>
            
            {/* Preview Info */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              <p className="text-blue-700">
                <strong>Ready to Print:</strong> {order.details?.length || 0} items
                {pages.length > 1 && ` across ${pages.length} pages`}
              </p>
              {pages.map((page, idx) => (
                <p key={idx} className="text-blue-600 text-xs mt-1">
                  Page {page.pageNumber}: Items {page.startIndex + 1}-{page.startIndex + page.items.length}
                </p>
              ))}
              <p className="text-blue-600 text-xs mt-2">
                <strong>Paper Size:</strong> 4" x 7" (Custom)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 p-4 border-t bg-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
