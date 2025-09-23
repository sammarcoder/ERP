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
//       <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[95vh] overflow-auto">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-3 border-b bg-gray-100">
//           <h2 className="text-lg font-bold text-gray-800">
//             Print {isPurchase ? 'Purchase Order' : 'Sales Invoice'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-xl font-bold"
//           >
//             ×
//           </button>
//         </div>

//         {/* Print Content - Exactly 5 inches wide */}
//         <div id="print-content" className="print-content p-4">
//           <div className="w-full" style={{ width: '5in', fontSize: '14px' }}>

//             {/* Company Header */}
//             <div className="text-center mb-4 pb-3 border-b-2 border-black">
//               <h1 className="text-xl font-bold text-black mb-1">YOUR COMPANY NAME</h1>
//               <p className="text-sm text-gray-700">Address, City, Phone: (123) 456-7890</p>
//             </div>

//             {/* Order Information Section */}
//             <div className="mb-4 pb-3">
//               <div className="grid grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <span className="font-bold text-black">Order Date:</span>
//                   <div className="mt-1 font-medium">
//                     {new Date(order.Date).toLocaleDateString()}
//                   </div>
//                 </div>
//                 <div>
//                   <span className="font-bold text-black">Order ID:</span>
//                   <div className="mt-1 font-bold text-lg">
//                     {order.Number}
//                   </div>
//                 </div>
//                 <div>
//                   <span className="font-bold text-black">Status:</span>
//                   <div className={`mt-1 font-bold ${order.Next_Status === 'Complete' ? 'text-green-600' : 'text-orange-600'
//                     }`}>
//                     {order.Next_Status}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Divider Line */}
//             <hr className="border-t-2 border-gray-400 my-4" />

//             {/* Customer Information */}
//             <div className="mb-4 pb-3">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="font-bold text-black">Customer:</span>
//                   <div className="mt-1 font-semibold text-base">
//                     {order.account?.acName || 'N/A'}
//                   </div>
//                 </div>
//                 <div>
//                   <span className="font-bold text-black">City:</span>
//                   <div className="mt-1 font-medium">
//                     {order.account?.city || 'N/A'}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Transporter Section - Blank for Manual Entry */}
//             <div className="mb-4 pb-3 border border-gray-300 rounded p-3">
//               <div className="font-bold text-black mb-2">TRANSPORTER:</div>
//               <input
//                 type="text"
//                 value={transporterInfo}
//                 onChange={(e) => setTransporterInfo(e.target.value)}
//                 // placeholder="Enter transporter details..."
//                 className="w-full border-b-2 border-gray-400 py-2 px-1 text-sm focus:outline-none focus:border-gray-600 no-print-border"
//               />
//               {/* <div className="text-xs text-gray-500 mt-1 italic">
//                 (Fill manually before printing)
//               </div> */}
//             </div>

//             {/* Items Section */}
//             <div className="mb-4">
//               <h3 className="font-bold text-black mb-3 text-center bg-gray-100 py-2 border">
//                 ORDER ITEMS
//               </h3>

//               {/* Table */}
//               <table className="w-full border-collapse border border-gray-400">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="border border-gray-400 px-2 py-2 text-xs font-bold text-center">
//                       Sr No
//                     </th>
//                     <th className="border border-gray-400 px-2 py-2 text-xs font-bold text-left">
//                       Item Name
//                     </th>
//                     <th className="border border-gray-400 px-2 py-2 text-xs font-bold text-center">
//                       Qty & UOM
//                     </th>
//                     <th className="border border-gray-400 px-2 py-2 text-xs font-bold text-center">
//                       Dispatch
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {order.details.map((detail, index) => (
//                     <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="border border-gray-400 px-2 py-3 text-center font-bold">
//                         {index + 1}
//                       </td>
//                       <td className="border border-gray-400 px-2 py-3 text-sm">
//                         <div className="font-medium text-black">
//                           {detail.item?.itemName || 'Unknown Item'}
//                         </div>
//                         {detail.Remarks && (
//                           <div className="text-xs text-gray-600 mt-1 italic">
//                             Note: {detail.Remarks}
//                           </div>
//                         )}
//                       </td>
//                       <td className="border border-gray-400 px-2 py-3 text-center">
//                         <div className="font-bold text-sm">
//                           {getDisplayQuantity(detail)}
//                         </div>
//                       </td>
//                       <td className="border border-gray-400 px-2 py-3">
//                         <input
//                           type="text"
//                           value={dispatchNotes[index] || ''}
//                           onChange={(e) => handleDispatchChange(index, e.target.value)}
//                           placeholder="Dispatch info..."
//                           className="w-full border-none bg-transparent text-xs focus:outline-none focus:bg-yellow-50 no-print-border"
//                         />
//                         <div className="border-b border-gray-300 mt-1"></div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Summary */}
//             {/* <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
//               <div>
//                 <div className="font-bold text-black">Total Items: {order.details.length}</div>
//                 <div className="font-bold text-black">Order Date: {new Date(order.Date).toLocaleDateString()}</div>
//               </div>
//               <div>
//                 <div className="font-bold text-black">Order ID: {order.ID}</div>
//                 <div className="font-bold text-black">Status: {order.Next_Status}</div>
//               </div>
//             </div> */}

//             {/* Signature Section */}
//             {/* <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t-2 border-gray-400">
//               <div className="text-center">
//                 <div className="border-b-2 border-gray-400 mb-2 h-8"></div>
//                 <p className="text-xs font-bold">Customer Signature</p>
//               </div>
//               <div className="text-center">
//                 <div className="border-b-2 border-gray-400 mb-2 h-8"></div>
//                 <p className="text-xs font-bold">Authorized Signature</p>
//               </div>
//             </div> */}

//             {/* Footer */}
//             <div className="text-center mt-4 pt-2 border-t border-gray-300">
//               <p className="text-xs text-gray-600">
//                 Generated: {new Date().toLocaleString()}
//               </p>
//               <p className="text-xs font-bold mt-1">
//                 Thank you for your business!
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-3 p-3 border-t bg-gray-100">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handlePrint}
//             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             Print Bill
//           </button>
//         </div>
//       </div>

//       {/* Print Styles */}
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
//             width: 5in !important;
//             margin: 0;
//             padding: 0.25in;
//             font-family: Arial, sans-serif;
//             font-size: 12px;
//             line-height: 1.4;
//             color: #000;
//             background: white;
//           }
          
//           .print-content table {
//             border-collapse: collapse !important;
//             width: 100% !important;
//           }
          
//           .print-content th, .print-content td {
//             border: 1px solid #000 !important;
//             padding: 6px !important;
//           }
          
//           .print-content .bg-gray-200 {
//             background-color: #f0f0f0 !important;
//           }
          
//           .print-content .bg-gray-50 {
//             background-color: #f8f8f8 !important;
//           }
          
//           .print-content input.no-print-border {
//             border: none !important;
//             border-bottom: 1px solid #000 !important;
//             background: transparent !important;
//           }
          
//           .print-content .border-t-2,
//           .print-content .border-b-2 {
//             border-color: #000 !important;
//           }
          
//           @page {
//             size: 5.5in 8.5in;
//             margin: 0.25in;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PrintModal;









































// components/PrintModal.jsx
import React, { useState } from 'react';

const PrintModal = ({ order, isPurchase, onClose, getDisplayQuantity }) => {
  const [dispatchNotes, setDispatchNotes] = useState({});
  const [transporterInfo, setTransporterInfo] = useState('');
  
  console.log(order)
  
  const handleDispatchChange = (index, value) => {
    setDispatchNotes(prev => ({ ...prev, [index]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* FIXED: Much wider modal to show proper preview */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-100 to-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print {isPurchase ? 'Purchase Order' : 'Sales Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
          >
            ×
          </button>
        </div>

        {/* Print Preview */}
        <div className="p-6 bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow-lg mx-auto max-w-2xl">
            
            {/* Print Content - FIXED: Proper half A4 size */}
            <div id="print-content" className="print-content">
              <div className="w-full mx-auto bg-white">
                
                {/* Company Header */}
                <div className="text-center mb-6 pb-4 border-b-2 border-black">
                  <h1 className="text-2xl font-bold text-black mb-2">YOUR COMPANY NAME</h1>
                  <p className="text-base text-gray-700">123 Business Street, City, State 12345</p>
                  <p className="text-base text-gray-700">Phone: (123) 456-7890 | Email: info@company.com</p>
                </div>

                {/* Order Information Section */}
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-4 text-base">
                    <div>
                      <span className="font-bold text-black">Order Date:</span>
                      <div className="mt-1 font-medium text-lg">
                        {new Date(order.Date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-black">Order ID:</span>
                      <div className="mt-1 font-bold text-lg">
                        {order.Number}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-black">Status:</span>
                      <div className={`mt-1 font-bold text-lg ${
                        order.Next_Status === 'Complete' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {order.Next_Status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <hr className="border-t-2 border-gray-400 my-4" />

                {/* Customer Information */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <div>
                      <span className="font-bold text-black">Customer:</span>
                      <div className="mt-1 font-semibold text-lg">
                        {order.account?.acName || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-black">City:</span>
                      <div className="mt-1 font-medium text-lg">
                        {order.account?.city || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transporter Section */}
                <div className="mb-6 border border-gray-300 rounded p-4">
                  <div className="font-bold text-black mb-3 text-lg">TRANSPORTER:</div>
                  <input
                    type="text"
                    value={transporterInfo}
                    onChange={(e) => setTransporterInfo(e.target.value)}
                    placeholder="Enter transporter details..."
                    className="w-full border-b-2 border-gray-400 py-2 px-1 text-base focus:outline-none focus:border-gray-600 no-print-border"
                    style={{ minHeight: '35px' }}
                  />
                </div>

                {/* Items Section */}
                <div className="mb-6">
                  <h3 className="font-bold text-black mb-4 text-center bg-gray-100 py-3 border text-lg">
                    ORDER ITEMS
                  </h3>
                  
                  {/* Table */}
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-3 py-3 text-sm font-bold text-center">
                          Sr No
                        </th>
                        <th className="border border-gray-400 px-4 py-3 text-sm font-bold text-left">
                          Item Name
                        </th>
                        <th className="border border-gray-400 px-4 py-3 text-sm font-bold text-center">
                          Qty
                        </th>
                        <th className="border border-gray-400 px-4 py-3 text-sm font-bold text-center">
                          Dispatch
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.details.map((detail, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-400 px-3 py-3 text-center font-bold text-base">
                            {index + 1}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            <div className="font-medium text-black text-base">
                              {detail.item?.itemName || 'Unknown Item'}
                            </div>
                            {/* {detail.Remarks && (
                              <div className="text-sm text-gray-600 mt-1 italic">
                                Note: {detail.Remarks}
                              </div>
                            )} */}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 text-center">
                            <div className="font-bold text-base flex items-center justify-evenly">
                              {getDisplayQuantity(detail)}
                              <input className='border w-5 h-5 ml-3 '/>
                            </div>
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            <input
                              type="text"
                              value={dispatchNotes[index] || ''}
                              onChange={(e) => handleDispatchChange(index, e.target.value)}
                              // placeholder="Dispatch info..."
                              className="w-full border-none bg-transparent text-sm focus:outline-none focus:bg-yellow-50 no-print-border"
                              style={{ minHeight: '25px' }}
                            />
                            <div className="border-b border-gray-300 mt-1"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="text-center mt-4 pt-3 border-t border-gray-300">
                  <p className="text-sm text-gray-600">
                    Print: {new Date().toLocaleString()}
                  </p>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 p-6 border-t bg-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-base font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base flex items-center font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
        </div>
      </div>

      {/* FIXED: Print Styles - Normal Readable Text Size */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-content, .print-content * {
            visibility: visible;
          }
          
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: none !important;
            margin: 0;
            padding: 1in;
            font-family: Arial, sans-serif;
            font-size: 14pt !important;
            line-height: 1.5;
            color: #000;
            background: white;
          }
          
          .print-content h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            margin: 0 0 12pt 0 !important;
          }
          
          .print-content h3 {
            font-size: 18pt !important;
            font-weight: bold !important;
            margin: 0 0 8pt 0 !important;
          }
          
          .print-content .text-2xl {
            font-size: 20pt !important;
          }
          
          .print-content .text-xl {
            font-size: 18pt !important;
          }
          
          .print-content .text-lg {
            font-size: 16pt !important;
          }
          
          .print-content .text-base {
            font-size: 14pt !important;
          }
          
          .print-content .text-sm {
            font-size: 12pt !important;
          }
          
          .print-content table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 12pt 0 !important;
          }
          
          .print-content th {
            border: 1pt solid #000 !important;
            padding: 8pt !important;
            background-color: #f0f0f0 !important;
            font-weight: bold !important;
            font-size: 14pt !important;
          }
          
          .print-content td {
            border: 1pt solid #000 !important;
            padding: 8pt !important;
            font-size: 14pt !important;
            line-height: 1.4;
          }
          
          .print-content .bg-gray-200 {
            background-color: #f0f0f0 !important;
          }
          
          .print-content .bg-gray-100 {
            background-color: #f5f5f5 !important;
          }
          
          .print-content .bg-gray-50 {
            background-color: #f8f8f8 !important;
          }
          
          .print-content input.no-print-border {
            border: none !important;
            border-bottom: 1pt solid #000 !important;
            background: transparent !important;
            font-size: 14pt !important;
            padding: 2pt 0 !important;
            min-height: 24pt !important;
          }
          
          .print-content .border-t-2 {
            border-top: 2pt solid #000 !important;
          }
          
          .print-content .border-b-2 {
            border-bottom: 2pt solid #000 !important;
          }
          
          .print-content .mb-6 {
            margin-bottom: 16pt !important;
          }
          
          .print-content .mb-4 {
            margin-bottom: 12pt !important;
          }
          
          .print-content .py-3 {
            padding-top: 8pt !important;
            padding-bottom: 8pt !important;
          }
          
          .print-content .px-4 {
            padding-left: 8pt !important;
            padding-right: 8pt !important;
          }
          
          @page {
            size: A4;
            margin: 1in;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintModal;
