










































































































// // components/GRNModal.jsx - COMPLETE & FIXED
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const GRNModal = ({ purchaseOrder, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   // FIXED: Initialize with null checks
//   const [grnData, setGrnData] = useState({
//     Purchase_Order_Number: purchaseOrder?.Number || '',
//     GRN_ID: 'Auto Generated',
//     GRN_Number: 'Auto Generated', 
//     Name_of_Supplier: purchaseOrder?.account?.acName || '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Purchase_Type: 'Local',
//     Batch_No: `BATCH-${Date.now()}`
//   });

//   // ADDED: Order status update functionality
//   const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
//   const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');

//   // ORIGINAL: Received items
//   const [receivedItems, setReceivedItems] = useState([]);

//   useEffect(() => {
//     // FIXED: Add complete null checks
//     if (purchaseOrder && purchaseOrder.details && Array.isArray(purchaseOrder.details)) {
//       const items = purchaseOrder.details.map((detail, index) => ({
//         Line_Id: detail.Line_Id || (index + 1),
//         Batch_Number: '',
//         Item: detail.item?.itemName || 'Unknown Item',
//         Item_ID: detail.Item_ID,

//         // ORIGINAL: What was ordered (from PO)
//         Qty_in_PO: detail.Stock_In_UOM_Qty || detail.uom1_qty || 0,
//         Uom_PO: detail.item?.uom1?.uom || 'Pcs',
//         original_sale_unit: detail.sale_unit || 'uom1',
//         original_price: parseFloat(detail.Price) || 0,

//         // RECEIVING: What we're actually receiving (UomConverter controls this)
//         QTY_Received: 0,
//         UOM_Received: detail.item?.uom1?.uom || 'Pcs',
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 'uom1',
//         Stock_Price: parseFloat(detail.Price) || 0,

//         // Store full item for UomConverter
//         item: detail.item
//       }));
//       setReceivedItems(items);

//       // Update GRN data with order info
//       setGrnData(prev => ({
//         ...prev,
//         Purchase_Order_Number: purchaseOrder.Number || '',
//         Name_of_Supplier: purchaseOrder.account?.acName || ''
//       }));
//     }
//   }, [purchaseOrder]);

//   // ORIGINAL: Handle UOM changes from converter
//   const handleUomChange = (index, values) => {
//     const updated = [...receivedItems];
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0, 
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Received: values.uom1_qty || 0,
//       sale_unit: values.sale_unit || 'uom1',
//       // Update UOM_Received based on sale unit
//       UOM_Received: values.sale_unit === 'uomTwo' ? updated[index].item?.uomTwo?.uom :
//                    values.sale_unit === 'uomThree' ? updated[index].item?.uomThree?.uom :
//                    updated[index].item?.uom1?.uom || 'Pcs'
//     };
//     setReceivedItems(updated);
//   };

//   // Handle item updates
//   const updateReceivedItem = (index, field, value) => {
//     const updated = [...receivedItems];
//     if (field === 'Stock_Price') {
//       updated[index][field] = parseFloat(value) || 0;
//     } else {
//       updated[index][field] = value;
//     }
//     setReceivedItems(updated);
//   };

//   // UPDATED: Handle form submission with all functionality
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!purchaseOrder || !purchaseOrder.ID) {
//       setMessage({ type: 'error', text: 'Invalid purchase order data' });
//       return;
//     }

//     if (receivedItems.length === 0) {
//       setMessage({ type: 'error', text: 'No items to receive' });
//       return;
//     }

//     if (!grnData.Batch_No.trim()) {
//       setMessage({ type: 'error', text: 'Batch number is required' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const baseUrl = `http://${window.location.hostname}:4000/api`;

//       // UPDATED: API payload structure matching your backend
//       const grnPayload = {
//         stockMain: {
//           Stock_Type_ID: 11, // GRN Type  
//           COA_ID: purchaseOrder.COA_ID,
//           Date: grnData.Date,
//           Status: grnData.Status,
//           Purchase_Type: grnData.Purchase_Type,
//           Order_Main_ID: purchaseOrder.ID,
//           batchno: grnData.Batch_No
//         },
//         stockDetails: receivedItems
//           .filter(item => item.QTY_Received > 0) // Only include items with quantity
//           .map(item => ({
//             Line_Id: item.Line_Id,
//             Item_ID: item.Item_ID,
//             batchno: item.Batch_Number || grnData.Batch_No, // Use individual batch or main batch
//             Stock_Price: parseFloat(item.Stock_Price) || 0,
//             Stock_In_UOM_Qty: item.uom1_qty || 0,
//             Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
//             Stock_In_UOM3_Qty: item.uom3_qty || 0
//           }))
//       };

//       console.log('Sending GRN payload:', grnPayload);

//       // Create GRN
//       const response = await fetch(`${baseUrl}/grn`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(grnPayload)
//       });

//       const result = await response.json();
//       console.log('GRN response:', result);

//       if (response.ok && result.success) {

//         // ADDED: Update order status if user selected the option
//         if (updateOrderStatus && purchaseOrder.ID) {
//           try {
//             const statusResponse = await fetch(`${baseUrl}/order/update-status/${purchaseOrder.ID}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: selectedOrderStatus })
//             });

//             const statusResult = await statusResponse.json();
//             if (statusResult.success) {
//               console.log(`✅ Order status updated to ${selectedOrderStatus}`);
//             } else {
//               console.warn('⚠️ Failed to update order status:', statusResult.error);
//             }
//           } catch (statusError) {
//             console.warn('⚠️ Error updating order status:', statusError);
//           }
//         }

//         setMessage({ 
//           type: 'success', 
//           text: `✅ GRN ${result.data?.grnNumber || result.data?.Number || 'created'} successfully!` 
//         });

//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 1500);

//       } else {
//         setMessage({ type: 'error', text: result.error || result.message || 'Failed to create GRN' });
//       }
//     } catch (error) {
//       console.error('GRN creation error:', error);
//       setMessage({ type: 'error', text: 'Network error: Failed to create GRN' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FIXED: Early return with proper error display
//   if (!purchaseOrder) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="text-center">
//             <div className="text-red-500 text-4xl mb-4">⚠️</div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">No Purchase Order Selected</h3>
//             <p className="text-gray-600 mb-4">Please select a purchase order first</p>
//             <button 
//               onClick={onClose} 
//               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!purchaseOrder.details || purchaseOrder.details.length === 0) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="text-center">
//             <div className="text-yellow-500 text-4xl mb-4">📦</div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">No Items in Purchase Order</h3>
//             <p className="text-gray-600 mb-4">This purchase order has no items to receive</p>
//             <button 
//               onClick={onClose} 
//               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">

//         {/* ORIGINAL: Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <div>
//             <h2 className="text-xl font-bold">📦 Create Goods Receiving Note</h2>
//             <p className="text-sm opacity-90">From PO: {purchaseOrder.Number}</p>
//             <p className="text-xs opacity-75">Supplier: {purchaseOrder.account?.acName}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-200 text-2xl font-bold transition-colors hover:bg-white hover:bg-opacity-20 rounded-full p-1"
//           >
//             ×
//           </button>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div className={`m-4 p-4 rounded-lg border ${
//             message.type === 'success' 
//               ? 'bg-green-50 text-green-800 border-green-200' 
//               : 'bg-red-50 text-red-800 border-red-200'
//           }`}>
//             <div className="flex items-center">
//               {message.type === 'success' ? (
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               )}
//               {message.text}
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4">
//           {/* ORIGINAL: GRN Information Section */}
//           <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
//             <h3 className="font-bold text-gray-800 mb-3 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               GRN Information
//             </h3>

//             <div className="grid grid-cols-4 gap-4 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Purchase Order Number</label>
//                 <div className="bg-gray-100 p-2 rounded font-bold text-blue-600">{grnData.Purchase_Order_Number}</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">GRN ID</label>
//                 <div className="bg-gray-100 p-2 rounded text-gray-600">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">GRN Number</label>
//                 <div className="bg-gray-100 p-2 rounded text-gray-600">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Supplier Name</label>
//                 <div className="bg-gray-100 p-2 rounded font-medium text-green-600">{grnData.Name_of_Supplier}</div>
//               </div>
//             </div>

//             <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={grnData.Date}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Status</label>
//                 <select
//                   value={grnData.Status}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Status: e.target.value }))}
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="UnPost">UnPost</option>
//                   <option value="Post">Post</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Purchase Type</label>
//                 <select
//                   value={grnData.Purchase_Type}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Purchase_Type: e.target.value }))}
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="Local">Local</option>
//                   <option value="Foreign">Foreign</option>
//                   <option value="Mfg">Manufacturing</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Batch No</label>
//                 <input
//                   type="text"
//                   value={grnData.Batch_No}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Batch_No: e.target.value }))}
//                   placeholder="Enter batch number"
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ADDED: Order Status Update Option */}
//           <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
//             <div className="flex items-center mb-3">
//               <input
//                 type="checkbox"
//                 id="updateOrderStatus"
//                 checked={updateOrderStatus}
//                 onChange={(e) => setUpdateOrderStatus(e.target.checked)}
//                 className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="updateOrderStatus" className="text-sm font-medium text-gray-700">
//                 📝 Update Purchase Order Status After GRN Creation
//               </label>
//             </div>
//             {updateOrderStatus && (
//               <div className="ml-6">
//                 <select
//                   value={selectedOrderStatus}
//                   onChange={(e) => setSelectedOrderStatus(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                 >
//                   <option value="Partial">🟡 Partial (Some items received)</option>
//                   <option value="Complete">✅ Complete (All items received)</option>
//                   <option value="Incomplete">❌ Incomplete (Nothing received yet)</option>
//                 </select>
//               </div>
//             )}
//           </div>

//           {/* ORIGINAL: Items Table with exact structure */}
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm">
//             <div className="bg-gray-100 p-3 border-b">
//               <h3 className="font-bold text-gray-800 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//                 Items to Receive ({receivedItems.length} items)
//               </h3>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-yellow-200">
//                   <tr>
//                     <th className="px-3 py-2 text-left font-bold text-gray-700">Line_Id</th>
//                     <th className="px-3 py-2 text-left font-bold text-gray-700">Batch Number</th>
//                     <th className="px-3 py-2 text-left font-bold text-gray-700">Item</th>
//                     <th className="px-3 py-2 text-center font-bold bg-yellow-300 text-gray-700">Qty in PO</th>
//                     <th className="px-3 py-2 text-center font-bold bg-yellow-300 text-gray-700">UOM PO</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200 text-gray-700">QTY Received</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200 text-gray-700">UOM Received</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200 text-gray-700">Unit Price</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200 text-gray-700">Line Total</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {receivedItems.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-3 py-3 text-center font-bold text-gray-800">
//                         {item.Line_Id}
//                       </td>
//                       <td className="px-3 py-3">
//                         <input
//                           type="text"
//                           value={item.Batch_Number}
//                           onChange={(e) => updateReceivedItem(index, 'Batch_Number', e.target.value)}
//                           placeholder={`${grnData.Batch_No || 'Batch #'}`}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <div className="text-xs text-gray-500 mt-1">
//                           Default: {grnData.Batch_No}
//                         </div>
//                       </td>
//                       <td className="px-3 py-3">
//                         <div className="font-medium text-gray-900">{item.Item}</div>
//                         <div className="text-xs text-gray-500">ID: {item.Item_ID}</div>
//                       </td>
//                       <td className="px-3 py-3 text-center bg-yellow-50">
//                         <div className="font-bold text-blue-600 text-lg">{item.Qty_in_PO}</div>
//                       </td>
//                       <td className="px-3 py-3 text-center bg-yellow-50">
//                         <div className="font-medium text-blue-800">{item.Uom_PO}</div>
//                       </td>
//                       <td className="px-3 py-3 bg-green-50">
//                         {/* ORIGINAL: UomConverter exactly as you designed */}
//                         <UomConverter
//                           itemId={item.Item_ID}
//                           onChange={(values) => handleUomChange(index, values)}
//                           initialValues={{
//                             uom1_qty: item.uom1_qty?.toString() || '',
//                             uom2_qty: item.uom2_qty?.toString() || '',
//                             uom3_qty: item.uom3_qty?.toString() || '',
//                             sale_unit: item.sale_unit || 'uom1'
//                           }}
//                           isPurchase={true}
//                         />
//                       </td>
//                       <td className="px-3 py-3 text-center bg-green-50">
//                         <div className="font-bold text-green-600 text-lg">
//                           {item.QTY_Received}
//                         </div>
//                         <div className="text-xs text-green-800 font-medium">
//                           {item.UOM_Received}
//                         </div>
//                       </td>
//                       <td className="px-3 py-3 bg-green-50">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.Stock_Price || ''}
//                           onChange={(e) => updateReceivedItem(index, 'Stock_Price', e.target.value)}
//                           className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
//                           placeholder="0.00"
//                         />
//                       </td>
//                       <td className="px-3 py-3 text-center bg-green-50">
//                         <div className="font-bold text-green-800 text-lg">
//                           ${((item.QTY_Received || 0) * (parseFloat(item.Stock_Price) || 0)).toFixed(2)}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 {/* Summary Footer */}
//                 <tfoot className="bg-gray-100 border-t-2 border-gray-300">
//                   <tr>
//                     <td colSpan="5" className="px-3 py-3 text-right font-bold text-gray-700">
//                       📊 Grand Totals:
//                     </td>
//                     <td className="px-3 py-3 text-center">
//                       <div className="font-bold text-green-600 text-lg">
//                         {receivedItems.reduce((sum, item) => sum + (item.QTY_Received || 0), 0)}
//                       </div>
//                       <div className="text-xs text-gray-600">Total Items</div>
//                     </td>
//                     <td className="px-3 py-3 text-center">
//                       <div className="font-bold text-blue-600">
//                         {receivedItems.filter(item => item.QTY_Received > 0).length}
//                       </div>
//                       <div className="text-xs text-gray-600">Items Received</div>
//                     </td>
//                     <td className="px-3 py-3 text-center font-bold text-gray-700">
//                       Total Value:
//                     </td>
//                     <td className="px-3 py-3 text-center">
//                       <div className="font-bold text-green-800 text-xl">
//                         ${receivedItems.reduce((sum, item) => 
//                           sum + ((item.QTY_Received || 0) * (parseFloat(item.Stock_Price) || 0)), 0
//                         ).toFixed(2)}
//                       </div>
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>

//           {/* ORIGINAL: Action Buttons */}
//           <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || receivedItems.length === 0 || !grnData.Batch_No.trim()}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors font-medium shadow-lg hover:shadow-xl"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating GRN...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Create GRN
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default GRNModal;






























































































// this is working good 

// // components/GRNModal.jsx - ULTRA SIMPLE FIX
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const GRNModal = ({ 
//   purchaseOrder = null,    
//   grnId = null,           
//   mode = 'fromOrder',
//   onClose, 
//   onSuccess 
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const [grnData, setGrnData] = useState({
//     Purchase_Order_Number: '',
//     GRN_Number: '',
//     Name_of_Supplier: '',
//     COA_ID: '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Purchase_Type: 'Local',
//     Batch_No: ``
//   });

//   const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
//   const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
//   const [receivedItems, setReceivedItems] = useState([]);

//   const [suppliers, setSuppliers] = useState([]);
//   const [items, setItems] = useState([]);

//   // SIMPLE: Direct flags based on your API structure
//   const [isFromOrder, setIsFromOrder] = useState(false);

//   useEffect(() => {
//     initializeModal();
//     // console.log(purchaseOrder)
//   }, [mode, purchaseOrder, grnId]);

//   const initializeModal = async () => {
//     if (mode === 'fromOrder') {
//       // FROM ORDER: Always readonly
//       setIsFromOrder(true);
//       initializeFromOrder();
//     } else if (mode === 'edit') {
//       // EDIT: Check API response
//       await loadExistingGRN();
//     } else if (mode === 'create') {
//       // CREATE: Always editable  
//       setIsFromOrder(false);
//       await fetchSuppliers();
//       await fetchItems();
//       initializeEmpty();
//     }
//   };

//   const loadExistingGRN = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/grn/${grnId}`);
//       const result = await response.json();

//       if (result.success) {
//         const grn = result.data;
//         alert(' this is the grn data ',grn)
//         // SIMPLE: Direct check from YOUR API response
//         const wasFromOrder = grn.Order_Main_ID !== null;
//         setIsFromOrder(wasFromOrder);

//         console.log(`🔍 GRN ID ${grnId}: Order_Main_ID = ${grn.Order_Main_ID}, Was From Order = ${wasFromOrder}`);

//         setGrnData({
//           Purchase_Order_Number: grn.order?.Number || 'Standalone GRN',
//           GRN_Number: grn.Number,
//           Name_of_Supplier: grn.account?.acName || '',
//           COA_ID: grn.COA_ID,
//           Date: grn.Date.split('T')[0],
//           Status: grn.Status,
//           Purchase_Type: grn.Purchase_Type,
//           Batch_No: grn.batchno || ''
//         });

//         const items = grn.details?.map((detail, index) => ({
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           QTY_Received: detail.Stock_In_UOM_Qty || 0,
//           uom1_qty: detail.Stock_In_UOM_Qty || 0,
//           uom2_qty: detail.Stock_In_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_In_UOM3_Qty || 0,
//           sale_unit: 'uom1',
//           Stock_Price: detail.Stock_Price || 0,
//           item: detail.item
//         })) || [];

//         setReceivedItems(items);

//         // SIMPLE: Only fetch suppliers if it was standalone
//         if (!wasFromOrder) {
//           console.log('✅ Loading suppliers for standalone GRN edit');
//           await fetchSuppliers();
//         } else {
//           console.log('🔒 Skipping suppliers - GRN was from order');
//         }
//         await fetchItems();
//       }

//     } catch (error) {
//       console.error('Error loading GRN:', error);
//       setMessage({ type: 'error', text: 'Failed to load GRN data' });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const initializeFromOrder = () => {
//     console.warn(purchaseOrder)
//     setGrnData({
//       Purchase_Order_Number: purchaseOrder.Number,
//       GRN_Number: 'Auto Generated',
//       Name_of_Supplier: purchaseOrder.account?.acName || '',
//       COA_ID: purchaseOrder.COA_ID,
//       Date: new Date().toISOString().split('T')[0],
//       Status: 'UnPost',
//       Purchase_Type: 'Local',
//       Batch_No: purchaseOrder.account?.batch_no || 'N/A'
//       // Batch_No: `BATCH-${Date.now()}`
//     });

//     const items = purchaseOrder.details.map((detail, index) => ({
//       Line_Id: detail.Line_Id || (index + 1),
//       Batch_Number: '',
//       Item: detail.item?.itemName || '',
//       Item_ID: detail.Item_ID,
//       Qty_in_PO: detail.Stock_In_UOM_Qty || detail.uom1_qty || 0,
//       Uom_PO: detail.item?.uom1?.uom || 'Pcs',
//       QTY_Received: 0,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: parseFloat(detail.Price) || 0,
//       item: detail.item
//     }));
//     setReceivedItems(items);
//   };

//   const initializeEmpty = () => {
//     setReceivedItems([{
//       Line_Id: 1,
//       Batch_Number: '',
//       Item: '',
//       Item_ID: '',
//       QTY_Received: 0,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: 0
//     }]);
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
//       const result = await response.json();
//       if (result.success) {
//         setSuppliers(result.data);
//         console.log(`✅ Loaded ${result.data.length} suppliers`);
//       }
//     } catch (error) {
//       console.error('Error fetching suppliers:', error);
//     }
//   };

//   const fetchItems = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items`);
//       const result = await response.json();
//       if (result.success) setItems(result.data);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//     }
//   };

//   const updateReceivedItem = (index, field, value) => {
//     if (field === 'Batch_Number') {
//       // FIXED: Auto-fill batch to ALL items
//       const updated = receivedItems.map(item => ({
//         ...item,
//         Batch_Number: value
//       }));
//       setReceivedItems(updated);
//       setGrnData(prev => ({ ...prev, Batch_No: value }));
//       return;
//     }

//     const updated = [...receivedItems];

//     if (field === 'Item_ID' && !isFromOrder) {
//       const selectedItem = items.find(item => item.id === parseInt(value));
//       updated[index].Item = selectedItem?.itemName || '';
//       updated[index].Item_ID = value;
//       updated[index].item = selectedItem;
//     } else if (field === 'Stock_Price') {
//       updated[index][field] = parseFloat(value) || 0;
//     } else {
//       updated[index][field] = value;
//     }

//     setReceivedItems(updated);
//   };

//   const handleUomChange = (index, values) => {
//     const updated = [...receivedItems];
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Received: values.uom1_qty || 0,
//       sale_unit: values.sale_unit || 'uom1'
//     };
//     setReceivedItems(updated);
//   };

//   const updateGrnData = (field, value) => {
//     setGrnData(prev => ({ ...prev, [field]: value }));

//     if (field === 'Batch_No') {
//       const updated = receivedItems.map(item => ({
//         ...item,
//         Batch_Number: value
//       }));
//       setReceivedItems(updated);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isFromOrder && !grnData.COA_ID) {
//       setMessage({ type: 'error', text: 'Please select a supplier' });
//       return;
//     }

//     if (!grnData.Batch_No.trim()) {
//       setMessage({ type: 'error', text: 'Batch number is required' });
//       return;
//     }

//     setLoading(true);

//     try {
//       const grnPayload = {
//         stockMain: {
//           Stock_Type_ID: 11,
//           COA_ID: grnData.COA_ID,
//           Date: grnData.Date,
//           Status: grnData.Status,
//           Purchase_Type: grnData.Purchase_Type,
//           Order_Main_ID: purchaseOrder?.ID || null,
//           batchno: grnData.Batch_No
//         },
//         stockDetails: receivedItems
//           .filter(item => item.QTY_Received > 0)
//           .map(item => ({
//             Line_Id: item.Line_Id,
//             Item_ID: item.Item_ID,
//             batchno: item.Batch_Number || grnData.Batch_No,
//             Stock_Price: parseFloat(item.Stock_Price) || 0,
//             Stock_In_UOM_Qty: item.uom1_qty || 0,
//             Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
//             Stock_In_UOM3_Qty: item.uom3_qty || 0
//           }))
//       };

//       const url = mode === 'edit' 
//         ? `http://${window.location.hostname}:4000/api/grn/${grnId}`
//         : `http://${window.location.hostname}:4000/api/grn`;

//       const response = await fetch(url, {
//         method: mode === 'edit' ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(grnPayload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {

//         if (updateOrderStatus && purchaseOrder?.ID) {
//           try {
//             await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${purchaseOrder.ID}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: selectedOrderStatus.trim() })
//             });
//           } catch (statusError) {
//             console.warn('Error updating order status:', statusError);
//           }
//         }

//         setMessage({ type: 'success', text: `GRN ${mode === 'edit' ? 'updated' : 'created'} successfully!` });
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 1500);

//       } else {
//         setMessage({ type: 'error', text: result.error || `Failed to ${mode === 'edit' ? 'update' : 'create'} GRN` });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: `Failed to ${mode === 'edit' ? 'update' : 'create'} GRN` });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">

//         <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <h2 className="text-lg font-bold">
//             {mode === 'edit' ? `Edit GRN ${grnData.GRN_Number}` : 
//              mode === 'create' ? 'Create New GRN' : 
//              'Create GRN from Purchase Order'}
//           </h2>
//           <button onClick={onClose} className="text-white text-xl">×</button>
//         </div>

//         {message.text && (
//           <div className={`m-4 p-3 rounded ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4">
//           <div className="bg-gray-50 p-4 rounded mb-4">
//             <h3 className="font-medium mb-3">GRN Information</h3>

//             <div className="grid grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Purchase Order</label>
//                 <input
//                   type="text"
//                   value={grnData.Purchase_Order_Number || 'Standalone GRN'}
//                   className="w-full p-2 bg-gray-100 border rounded"
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">GRN Number</label>
//                 <input
//                   type="text"
//                   value={grnData.GRN_Number || 'Auto Generated'}
//                   className="w-full p-2 bg-gray-100 border rounded"
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Supplier Name</label>
//                 {/* SIMPLE: Based on your API - Order_Main_ID null = editable, not null = readonly */}
//                 {/* {isFromOrder ? ( */}
//                   <input
//                     type="text"
//                     value={grnData.Name_of_Supplier}
//                     className="w-full p-2 bg-gray-100 border rounded"
//                     disabled
//                   />
//                 {/* // ) : ( */}
//                 {/* //   <select */}
//                 {/* //     value={grnData.COA_ID}
//                 //     onChange={(e) => {
//                 //       const supplier = suppliers.find(s => s.id === parseInt(e.target.value));
//                 //       setGrnData(prev => ({ 
//                 //         ...prev, 
//                 //         COA_ID: e.target.value,
//                 //         Name_of_Supplier: supplier?.acName || '' 
//                 //       }));
//                 //     }}
//                 //     className="w-full p-2 border rounded"
//                 //     required
//                 //   >
//                 //     <option value="">Select Supplier</option>
//                 //     {suppliers.map(supplier => (
//                 //       <option key={supplier.id} value={supplier.id}>
//                 //         {supplier.acName}
//                 //       </option>
//                 //     ))}
//                 //   </select>
//                 // )} */}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={grnData.Date}
//                   onChange={(e) => updateGrnData('Date', e.target.value)}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4 mt-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Status</label>
//                 <select
//                   value={grnData.Status}
//                   onChange={(e) => updateGrnData('Status', e.target.value)}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="UnPost">UnPost</option>
//                   <option value="Post">Post</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Purchase Type</label>
//                 <select
//                   value={grnData.Purchase_Type}
//                   onChange={(e) => updateGrnData('Purchase_Type', e.target.value)}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="Local">Local</option>
//                   <option value="Foreign">Foreign</option>
//                   <option value="Manufacturing">Manufacturing</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Batch No</label>
//                 <input
//                   type="text"
//                   value={grnData.Batch_No}
//                   onChange={(e) => updateGrnData('Batch_No', e.target.value)}
//                   className="w-full p-2 border rounded"
//                   placeholder="Auto-fills to all items"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Order Status Update */}
//           {mode === 'fromOrder' && (
//             <div className="bg-blue-50 p-4 rounded mb-4">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="updateOrderStatus"
//                   checked={updateOrderStatus}
//                   onChange={(e) => setUpdateOrderStatus(e.target.checked)}
//                   className="mr-2 w-4 h-4"
//                 />
//                 <label htmlFor="updateOrderStatus" className="text-sm">
//                   Update Purchase Order Status After GRN
//                 </label>
//                 {updateOrderStatus && (
//                   <select
//                     value={selectedOrderStatus}
//                     onChange={(e) => setSelectedOrderStatus(e.target.value)}
//                     className="ml-4 px-3 py-1 border rounded"
//                   >
//                     <option value="Partial">Partial</option>
//                     <option value="Complete">Complete</option>
//                   </select>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Items Table */}
//           <div className="border rounded mb-4 overflow-hidden">
//             <div className="bg-gray-100 p-3">
//               <h3 className="font-medium">Items to Receive ({receivedItems.length})</h3>
//             </div>

//             <table className="w-full text-sm">
//               <thead className="bg-yellow-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left">Line</th>
//                   <th className="px-3 py-2 text-left">Batch</th>
//                   <th className="px-3 py-2 text-left">Item</th>
//                   {mode === 'fromOrder' && (
//                     <>
//                       <th className="px-3 py-2 text-center bg-blue-100">Qty in PO</th>
//                       <th className="px-3 py-2 text-center bg-blue-100">UOM</th>
//                     </>
//                   )}
//                   <th className="px-3 py-2 text-center bg-green-100">Receiving</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Received</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Price</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {receivedItems.map((item, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-50">
//                     <td className="px-3 py-2 text-center">{item.Line_Id}</td>

//                     <td className="px-3 py-2">
//                       <input
//                         type="text"
//                         value={item.Batch_Number}
//                         onChange={(e) => updateReceivedItem(index, 'Batch_Number', e.target.value)}
//                         className="w-full px-2 py-1 border rounded"
//                         placeholder="Batch number"
//                       />
//                     </td>

//                     <td className="px-3 py-2">
//                       {isFromOrder ? (
//                         <input
//                           type="text"
//                           value={item.Item}
//                           className="w-full px-2 py-1 bg-gray-100 border rounded"
//                           disabled
//                         />
//                       ) : (
//                         <select
//                           value={item.Item_ID}
//                           onChange={(e) => updateReceivedItem(index, 'Item_ID', e.target.value)}
//                           className="w-full px-2 py-1 border rounded"
//                           required
//                         >
//                           <option value="">Select Item</option>
//                           {items.map(itm => (
//                             <option key={itm.id} value={itm.id}>
//                               {itm.itemName}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </td>

//                     {mode === 'fromOrder' && (
//                       <>
//                         <td className="px-3 py-2 text-center bg-blue-50 font-medium text-blue-600">
//                           {item.Qty_in_PO}
//                         </td>
//                         <td className="px-3 py-2 text-center bg-blue-50">
//                           {item.Uom_PO}
//                         </td>
//                       </>
//                     )}

//                     <td className="px-3 py-2 bg-green-50">
//                       <UomConverter
//                         itemId={item.Item_ID}
//                         onChange={(values) => handleUomChange(index, values)}
//                         initialValues={{
//                           uom1_qty: item.uom1_qty?.toString() || '',
//                           uom2_qty: item.uom2_qty?.toString() || '',
//                           uom3_qty: item.uom3_qty?.toString() || '',
//                           sale_unit: item.sale_unit || 'uom1'
//                         }}
//                         isPurchase={true}
//                       />
//                     </td>

//                     <td className="px-3 py-2 text-center bg-green-50 font-medium text-green-600">
//                       {item.QTY_Received}
//                     </td>

//                     <td className="px-3 py-2 bg-green-50">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Stock_Price || ''}
//                         onChange={(e) => updateReceivedItem(index, 'Stock_Price', e.target.value)}
//                         className="w-20 px-2 py-1 border rounded text-center"
//                       />
//                     </td>

//                     <td className="px-3 py-2 text-center bg-green-50 font-medium">
//                       ${((item.QTY_Received || 0) * (parseFloat(item.Stock_Price) || 0)).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-400 text-white rounded">
//               Cancel
//             </button>
//             <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded">
//               {loading ? 'Processing...' : (mode === 'edit' ? 'Update GRN' : 'Create GRN')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default GRNModal;







































































// this is code is about fetch based on coa_Type and than store the coa.id

// components/GRNModal.jsx - UPDATED with COA Type selection for batch
'use client'
import React, { useState, useEffect } from 'react';
import UomConverter from '../UomConverter';

const GRNModal = ({
  purchaseOrder = null,
  grnId = null,
  mode = 'fromOrder',
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [grnData, setGrnData] = useState({
    Purchase_Order_Number: '',
    GRN_ID: 'Auto Generated',
    GRN_Number: 'Auto Generated',
    Name_of_Supplier: '',
    COA_ID: '',
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Purchase_Type: 'Local',
    Batch_No: '', // Will be set from COA Type selection
    Selected_COA_Type: '' // NEW: For COA Type selection
  });

  const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
  const [receivedItems, setReceivedItems] = useState([]);

  // For create/edit modes only
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);

  // NEW: COA Types for batch selection
  const [coaTypes, setCoaTypes] = useState([]);

  useEffect(() => {
    initializeModal();
  }, [mode, purchaseOrder, grnId]);

  const initializeModal = async () => {
    // Always fetch COA types for batch selection
    await fetchCoaTypes();

    if (mode === 'fromOrder' && purchaseOrder) {
      initializeFromOrder();
    } else if (mode === 'edit' && grnId) {
      await loadExistingGRN();
    } else if (mode === 'create') {
      await fetchSuppliers();
      await fetchItems();
      initializeEmpty();
    }
  };

  const initializeFromOrder = () => {
    setGrnData({
      Purchase_Order_Number: purchaseOrder.Number,
      GRN_ID: 'Auto Generated',
      GRN_Number: 'Auto Generated',
      Name_of_Supplier: purchaseOrder.account?.acName || '',
      COA_ID: purchaseOrder.COA_ID,
      Date: new Date().toISOString().split('T')[0],
      Status: 'UnPost',
      Purchase_Type: 'Local',
      Batch_No: '', // Will be set by COA Type selection
      Selected_COA_Type: '' // User will select this
    });

    const items = purchaseOrder.details.map((detail, index) => ({
      Line_Id: detail.Line_Id || (index + 1),
      Batch_Number: '',
      Item: detail.item?.itemName || '',
      Item_ID: detail.Item_ID,
      Qty_in_PO: detail.Stock_In_UOM_Qty || detail.uom1_qty || 0,
      Uom_PO: detail.item?.uom1?.uom || 'Pcs',
      QTY_Received: 0,
      UOM_Received: detail.item?.uom1?.uom || 'Pcs',
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: 'uom1',
      Stock_Price: parseFloat(detail.Price) || 0,
      item: detail.item,
      isReadonly: true
    }));
    setReceivedItems(items);
  };

  const loadExistingGRN = async () => {
    setFetchLoading(true);
    try {
      const grnResponse = await fetch(`http://${window.location.hostname}:4000/api/grn/${grnId}`);
      const grnResult = await grnResponse.json();

      if (grnResult.success) {
        const grn = grnResult.data;

        // NEW: Try to find COA type from batch_no
        const matchingCoaType = coaTypes.find(coa => coa.coaTypeId.toString() === grn.batchno);

        setGrnData({
          Purchase_Order_Number: grn.order?.Number || 'Standalone GRN',
          GRN_ID: grn.ID,
          GRN_Number: grn.Number,
          Name_of_Supplier: grn.account?.acName || '',
          COA_ID: grn.COA_ID,
          Date: grn.Date.split('T')[0],
          Status: grn.Status,
          Purchase_Type: grn.Purchase_Type,
          Batch_No: grn.batchno || '',
          Selected_COA_Type: matchingCoaType ? matchingCoaType.id.toString() : ''
        });

        const items = grn.details?.map((detail, index) => ({
          Line_Id: detail.Line_Id,
          Batch_Number: detail.batchno || '',
          Item: detail.item?.itemName || '',
          Item_ID: detail.Item_ID,
          QTY_Received: detail.Stock_In_UOM_Qty || 0,
          UOM_Received: detail.item?.uom1?.uom || 'Pcs',
          uom1_qty: detail.Stock_In_UOM_Qty || 0,
          uom2_qty: detail.Stock_In_SKU_UOM_Qty || 0,
          uom3_qty: detail.Stock_In_UOM3_Qty || 0,
          sale_unit: 'uom1',
          Stock_Price: detail.Stock_Price || 0,
          item: detail.item,
          isReadonly: grn.Order_Main_ID ? true : false
        })) || [];

        setReceivedItems(items);
      }

      await fetchSuppliers();
      await fetchItems();

    } catch (error) {
      console.error('Error loading GRN:', error);
      setMessage({ type: 'error', text: 'Failed to load GRN data' });
    } finally {
      setFetchLoading(false);
    }
  };

  const initializeEmpty = () => {
    setReceivedItems([{
      Line_Id: 1,
      Batch_Number: '',
      Item: '',
      Item_ID: '',
      QTY_Received: 0,
      UOM_Received: 'Pcs',
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: 'uom1',
      Stock_Price: 0,
      isReadonly: false
    }]);
  };

  // NEW: Fetch COA Types (2, 3, 4) for batch selection
  const fetchCoaTypes = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/by-coa-types`);
      const result = await response.json();
      if (result.success) {
        setCoaTypes(result.data);
        console.log('✅ COA Types loaded:', result.data);
      }
    } catch (error) {
      console.error('Error fetching COA types:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
      const result = await response.json();
      if (result.success) setSuppliers(result.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items`);
      const result = await response.json();
      if (result.success) setItems(result.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleUomChange = (index, values) => {
    const updated = [...receivedItems];
    updated[index] = {
      ...updated[index],
      uom1_qty: values.uom1_qty || 0,
      uom2_qty: values.uom2_qty || 0,
      uom3_qty: values.uom3_qty || 0,
      QTY_Received: values.uom1_qty || 0,
      sale_unit: values.sale_unit || 'uom1'
    };
    setReceivedItems(updated);
  };

  // NEW: Handle COA Type selection and set batch_no to coaTypeId
  const handleCoaTypeSelection = (selectedCoaId) => {
    const selectedCoa = coaTypes.find(coa => coa.id.toString() === selectedCoaId);
    if (selectedCoa) {
      console.log('this is the coa', selectedCoa)
      // const newBatchNo = selectedCoa.coaTypeId.toString();
      const newBatchNo = selectedCoa.id.toString();
      console.error('this is the selcted bathc no', newBatchNo)

      setGrnData(prev => ({
        ...prev,
        Selected_COA_Type: selectedCoaId,
        Batch_No: newBatchNo
      }));

      // Auto-fill batch to all items
      const updatedItems = receivedItems.map(item => ({
        ...item,
        Batch_Number: newBatchNo
      }));
      setReceivedItems(updatedItems);

      console.log(`✅ Selected COA: ${selectedCoa.acName} (Type: ${selectedCoa.ZCOAType?.zType}) - Batch set to: ${newBatchNo}`);
    }
  };

  const updateReceivedItem = (index, field, value) => {
    const updated = [...receivedItems];

    if (field === 'Item_ID' && mode === 'create') {
      const selectedItem = items.find(item => item.id === parseInt(value));
      updated[index].Item = selectedItem?.itemName || '';
      updated[index].Item_ID = value;
      updated[index].item = selectedItem;
    } else if (field === 'Stock_Price') {
      updated[index][field] = parseFloat(value) || 0;
    } else if (field === 'Batch_Number') {
      // Individual batch number update (if needed)
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }

    setReceivedItems(updated);
  };

  const updateGrnData = (field, value) => {
    setGrnData(prev => ({ ...prev, [field]: value }));
  };

  const addNewItem = () => {
    setReceivedItems([
      ...receivedItems,
      {
        Line_Id: receivedItems.length + 1,
        Batch_Number: grnData.Batch_No, // Use current batch
        Item: '',
        Item_ID: '',
        QTY_Received: 0,
        UOM_Received: 'Pcs',
        uom1_qty: 0,
        uom2_qty: 0,
        uom3_qty: 0,
        sale_unit: 'uom1',
        Stock_Price: 0,
        isReadonly: mode === 'fromOrder'
      }
    ]);
  };

  const removeItem = (index) => {
    if (receivedItems.length > 1 && mode === 'create') {
      setReceivedItems(receivedItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (mode === 'create' && !grnData.COA_ID) {
      setMessage({ type: 'error', text: 'Please select a supplier' });
      return;
    }

    if (receivedItems.some(item => !item.Item_ID)) {
      setMessage({ type: 'error', text: 'Please select items for all rows' });
      return;
    }

    if (!grnData.Batch_No.trim()) {
      setMessage({ type: 'error', text: 'Please select a COA Type for batch number' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const grnPayload = {
        stockMain: {
          Stock_Type_ID: 11,
          COA_ID: grnData.COA_ID,
          Date: grnData.Date,
          Status: grnData.Status,
          Purchase_Type: grnData.Purchase_Type,
          Order_Main_ID: purchaseOrder?.ID || null,
          batchno: grnData.Batch_No // This will be the coaTypeId
        },
        stockDetails: receivedItems
          .filter(item => item.QTY_Received > 0)
          .map(item => ({
            Line_Id: item.Line_Id,
            Item_ID: item.Item_ID,
            batchno: item.Batch_Number || grnData.Batch_No,
            Stock_Price: parseFloat(item.Stock_Price) || 0,
            Stock_In_UOM_Qty: item.uom1_qty || 0,
            Stock_In_SKU_UOM_Qty: item.uom2_qty || 0,
            Stock_In_UOM3_Qty: item.uom3_qty || 0
          }))
      };

      const url = mode === 'edit'
        ? `http://${window.location.hostname}:4000/api/grn/${grnId}`
        : `http://${window.location.hostname}:4000/api/grn`;

      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grnPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {

        if (updateOrderStatus && purchaseOrder?.ID) {
          try {
            const statusResponse = await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${purchaseOrder.ID}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: selectedOrderStatus.trim() })
            });

            const statusResult = await statusResponse.json();
            if (statusResult.success) {
              console.log(`✅ Order status updated to ${selectedOrderStatus}`);
            }
          } catch (statusError) {
            console.warn('⚠️ Error updating order status:', statusError);
          }
        }

        setMessage({
          type: 'success',
          text: `GRN ${mode === 'edit' ? 'updated' : 'created'} successfully!`
        });

        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);

      } else {
        setMessage({ type: 'error', text: result.error || `Failed to ${mode === 'edit' ? 'update' : 'create'} GRN` });
      }
    } catch (error) {
      console.error(`GRN ${mode === 'edit' ? 'update' : 'creation'} error:`, error);
      setMessage({ type: 'error', text: `Failed to ${mode === 'edit' ? 'update' : 'create'} GRN` });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
            <span>Loading GRN data...</span>
          </div>
        </div>
      </div>
    );
  }

  // NEW: Get selected COA type info for display
  const selectedCoaType = coaTypes.find(coa => coa.id.toString() === grnData.Selected_COA_Type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold">
              {mode === 'edit' ? `Edit GRN ${grnData.GRN_Number}` :
                mode === 'create' ? 'Create New GRN' :
                  'Create GRN from Purchase Order'}
            </h2>
            {mode === 'fromOrder' && purchaseOrder && (
              <p className="text-sm opacity-90">From PO: {purchaseOrder.Number}</p>
            )}
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">×</button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`m-4 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          {/* GRN Information */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
            <h3 className="font-bold text-gray-800 mb-3">GRN Information</h3>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700 block mb-1">Purchase Order Number</label>
                <div className="bg-gray-100 p-2 rounded font-bold text-blue-600">
                  {grnData.Purchase_Order_Number || (mode === 'create' ? 'Standalone GRN' : 'N/A')}
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">GRN ID</label>
                <div className="bg-gray-100 p-2 rounded text-gray-600">
                  {mode === 'edit' ? grnData.GRN_ID : 'Auto Generated'}
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">GRN Number</label>
                <div className="bg-gray-100 p-2 rounded text-gray-600">
                  {mode === 'edit' ? grnData.GRN_Number : 'Auto Generated'}
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">Supplier Name</label>
                {/* {mode === 'fromOrder' ? ( */}
                  <div className="bg-gray-100 p-2 rounded font-medium text-green-600">
                    {grnData.Name_of_Supplier}
                  </div>
                {/* // ) : (
                //   <select
                //     value={grnData.COA_ID}
                //     onChange={(e) => {
                //       const selectedSupplier = suppliers.find(s => s.id === parseInt(e.target.value));
                //       setGrnData(prev => ({
                //         ...prev,
                //         COA_ID: e.target.value,
                //         Name_of_Supplier: selectedSupplier?.acName || ''
                //       }));
                //     }}
                //     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                //     required
                //   >
                //     <option value="">Select Supplier</option>
                //     {suppliers.map(supplier => (
                //       <option key={supplier.id} value={supplier.id}>
                //         {supplier.acName}
                //       </option>
                //     ))}
                //   </select>
                // )} */}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <label className="font-medium text-gray-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={grnData.Date}
                  onChange={(e) => updateGrnData('Date', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">Status</label>
                <select
                  value={grnData.Status}
                  onChange={(e) => updateGrnData('Status', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UnPost">UnPost</option>
                  <option value="Post">Post</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">Purchase Type</label>
                <select
                  value={grnData.Purchase_Type}
                  onChange={(e) => updateGrnData('Purchase_Type', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Local">Local</option>
                  <option value="Foreign">Foreign</option>
                  <option value="Mfg">Manufacturing</option>
                </select>
              </div>

              {/* NEW: COA Type Selection for Batch */}
              <div>
                <label className="font-medium text-gray-700 block mb-1">COA Type (Batch)</label>
                <select
                  value={grnData.Selected_COA_Type}
                  onChange={(e) => handleCoaTypeSelection(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select COA Type</option>
                  {coaTypes.map(coa => (
                    <option key={coa.id} value={coa.id}>
                      {coa.acName} ({coa.ZCOAType?.zType || 'N/A'})
                    </option>
                  ))}
                </select>
                {selectedCoaType && (
                  <div className="text-xs text-blue-600 mt-1">
                    Batch: {selectedCoaType.coaTypeId} | Type: {selectedCoaType.ZCOAType?.zType}
                  </div>
                )}
              </div>
            </div>

            {/* Display current batch number */}
            {grnData.Batch_No && (
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm font-medium text-blue-800">
                  Current Batch Number: <span className="font-bold text-blue-900">{grnData.Batch_No}</span>
                  {selectedCoaType && (
                    <span className="ml-2 text-blue-600">
                      (from {selectedCoaType.acName} - {selectedCoaType.ZCOAType?.zType})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Status Update - Only for fromOrder mode */}
          {mode === 'fromOrder' && purchaseOrder && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="updateOrderStatus"
                  checked={updateOrderStatus}
                  onChange={(e) => setUpdateOrderStatus(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                <label htmlFor="updateOrderStatus" className="text-sm font-medium text-gray-700">
                  Update Purchase Order Status After GRN Creation
                </label>
              </div>
              {updateOrderStatus && (
                <select
                  value={selectedOrderStatus}
                  onChange={(e) => setSelectedOrderStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ml-6"
                >
                  <option value="Partial">Partial</option>
                  <option value="Complete">Complete</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
              )}
            </div>
          )}

          {/* Items Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Items to Receive ({receivedItems.length})</h3>
              {mode === 'create' && (
                <button
                  type="button"
                  onClick={addNewItem}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  + Add Item
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-yellow-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold">Line</th>
                    <th className="px-3 py-2 text-left font-bold">Batch Number</th>
                    <th className="px-3 py-2 text-left font-bold">Item</th>
                    {mode === 'fromOrder' && (
                      <>
                        <th className="px-3 py-2 text-center font-bold bg-yellow-300">Qty in PO</th>
                        <th className="px-3 py-2 text-center font-bold bg-yellow-300">UOM PO</th>
                      </>
                    )}
                    <th className="px-3 py-2 text-center font-bold bg-green-200">Receiving Quantity</th>
                    <th className="px-3 py-2 text-center font-bold bg-green-200">QTY Received</th>
                    <th className="px-3 py-2 text-center font-bold bg-green-200">Unit Price</th>
                    <th className="px-3 py-2 text-center font-bold bg-green-200">Line Total</th>
                    {mode === 'create' && (
                      <th className="px-3 py-2 text-center font-bold">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {receivedItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-center font-bold text-gray-800">
                        {item.Line_Id}
                      </td>

                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={item.Batch_Number}
                          onChange={(e) => updateReceivedItem(index, 'Batch_Number', e.target.value)}
                          placeholder={grnData.Batch_No}
                          className="w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                        {grnData.Batch_No && !item.Batch_Number && (
                          <div className="text-xs text-blue-600 mt-1">Auto: {grnData.Batch_No}</div>
                        )}
                      </td>

                      <td className="px-3 py-3">
                        {item.isReadonly ? (
                          <div className="font-medium text-gray-900 bg-gray-100 p-2 rounded">
                            {item.Item}
                          </div>
                        ) : (
                          <select
                            value={item.Item_ID}
                            onChange={(e) => updateReceivedItem(index, 'Item_ID', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Item</option>
                            {items.map(itm => (
                              <option key={itm.id} value={itm.id}>
                                {itm.itemName}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {mode === 'fromOrder' && (
                        <>
                          <td className="px-3 py-3 text-center bg-yellow-50 font-bold text-blue-600">
                            {item.Qty_in_PO}
                          </td>
                          <td className="px-3 py-3 text-center bg-yellow-50 font-medium">
                            {item.Uom_PO}
                          </td>
                        </>
                      )}

                      <td className="px-3 py-3 bg-green-50">
                        <UomConverter
                          itemId={item.Item_ID}
                          onChange={(values) => handleUomChange(index, values)}
                          initialValues={{
                            uom1_qty: item.uom1_qty?.toString() || '',
                            uom2_qty: item.uom2_qty?.toString() || '',
                            uom3_qty: item.uom3_qty?.toString() || '',
                            sale_unit: item.sale_unit || 'uom1'
                          }}
                          isPurchase={true}
                        />
                      </td>

                      <td className="px-3 py-3 text-center bg-green-50 font-bold text-green-600">
                        {item.QTY_Received}
                      </td>

                      <td className="px-3 py-3 bg-green-50">
                        <input
                          type="number"
                          step="0.01"
                          value={item.Stock_Price || ''}
                          onChange={(e) => updateReceivedItem(index, 'Stock_Price', e.target.value)}
                          className="w-20 px-2 py-1 border rounded text-sm text-center focus:ring-1 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </td>

                      <td className="px-3 py-3 text-center bg-green-50 font-bold text-green-800">
                        ${((item.QTY_Received || 0) * (parseFloat(item.Stock_Price) || 0)).toFixed(2)}
                      </td>

                      {mode === 'create' && (
                        <td className="px-3 py-3 text-center">
                          {receivedItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {mode === 'edit' ? 'Update GRN' : 'Create GRN'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GRNModal;
