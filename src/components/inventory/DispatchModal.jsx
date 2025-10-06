// // components/inventory/DispatchModal.jsx
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const DispatchModal = ({ salesOrder, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [dispatchData, setDispatchData] = useState({
//     Sales_Order_Number: salesOrder.Number,
//     Sales_Dispatch_ID: 'Auto / Prime Key / Disable',
//     Sales_Dispatch_Number: 'Auto as per type Sequence',
//     Name_of_Buyer: salesOrder.account?.acName || '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Sales_Order_Status: 'Partial'
//   });

//   const [availableBatches, setAvailableBatches] = useState({}); // Item_ID -> batches with qty
//   const [dispatchItems, setDispatchItems] = useState([]);

//   // Fetch available batches for all items in SO
//   useEffect(() => {
//     const fetchAvailableBatches = async () => {
//       try {
//         setDataLoading(true);
//         const baseUrl = `http://${window.location.hostname}:4000/api`;
        
//         // Get all unique item IDs from sales order
//         const itemIds = [...new Set(salesOrder.details.map(d => d.Item_ID))];
        
//         const batchPromises = itemIds.map(async (itemId) => {
//           const response = await fetch(`${baseUrl}/stock/batches/available/${itemId}`);
//           const result = await response.json();
//           return { itemId, batches: result.success ? result.data : [] };
//         });

//         const batchResults = await Promise.all(batchPromises);
//         const batchMap = {};
        
//         batchResults.forEach(({ itemId, batches }) => {
//           batchMap[itemId] = batches;
//         });
        
//         setAvailableBatches(batchMap);
        
//         // Initialize dispatch items with batch breakdown
//         initializeDispatchItems();
        
//       } catch (error) {
//         console.error('Error fetching available batches:', error);
//         setMessage({ type: 'error', text: 'Failed to load available stock' });
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     fetchAvailableBatches();
//   }, [salesOrder]);

//   // ADVANCED: Initialize dispatch items with multi-batch logic
//   const initializeDispatchItems = () => {
//     const dispatchRows = [];
    
//     salesOrder.details.forEach(detail => {
//       const requiredQty = detail.sale_unit === 'uom1' ? detail.uom1_qty :
//                          detail.sale_unit === 'uomTwo' ? detail.uom2_qty :
//                          detail.sale_unit === 'uomThree' ? detail.uom3_qty : detail.Stock_out_UOM_Qty;
      
//       const batches = availableBatches[detail.Item_ID] || [];
      
//       if (batches.length === 0) {
//         // No batches available - create single row with zero qty
//         dispatchRows.push({
//           Line_Id: detail.Line_Id,
//           Item_ID: detail.Item_ID,
//           Item: detail.item?.itemName || '',
//           Batch_Number: 'No Stock Available',
//           Available_Qty: 0,
//           Qty_in_SO: requiredQty,
//           Uom_SO: detail.sale_unit === 'uom1' ? detail.item?.uom1?.uom :
//                   detail.sale_unit === 'uomTwo' ? detail.item?.uomTwo?.uom :
//                   detail.sale_unit === 'uomThree' ? detail.item?.uomThree?.uom : 'Pcs',
//           QTY_Dispatched: 0,
//           UOM_Dispatch: detail.item?.uom1?.uom || 'Pcs',
//           uom1_qty: 0,
//           uom2_qty: 0,
//           uom3_qty: 0,
//           sale_unit: detail.sale_unit || 'uom1',
//           Stock_Price: detail.Price || 0,
//           original_line_id: detail.Line_Id,
//           canEdit: false
//         });
//       } else {
//         // ADVANCED: Create rows for each batch with available quantity
//         let remainingQty = requiredQty;
        
//         batches.forEach((batch, batchIndex) => {
//           const availableInBatch = batch.available_qty;
//           const dispatchFromBatch = Math.min(remainingQty, availableInBatch);
          
//           dispatchRows.push({
//             Line_Id: `${detail.Line_Id}.${batchIndex + 1}`,
//             Item_ID: detail.Item_ID,
//             Item: detail.item?.itemName || '',
//             Batch_Number: batch.batch_number,
//             Available_Qty: availableInBatch,
//             Qty_in_SO: batchIndex === 0 ? requiredQty : 0, // Show total only in first row
//             Uom_SO: detail.sale_unit === 'uom1' ? detail.item?.uom1?.uom :
//                     detail.sale_unit === 'uomTwo' ? detail.item?.uomTwo?.uom :
//                     detail.sale_unit === 'uomThree' ? detail.item?.uomThree?.uom : 'Pcs',
//             QTY_Dispatched: dispatchFromBatch,
//             UOM_Dispatch: detail.item?.uom1?.uom || 'Pcs',
//             uom1_qty: dispatchFromBatch,
//             uom2_qty: 0,
//             uom3_qty: 0,
//             sale_unit: 'uom1',
//             Stock_Price: detail.Price || 0,
//             original_line_id: detail.Line_Id,
//             batch_id: batch.batch_id,
//             canEdit: true
//           });
          
//           remainingQty -= dispatchFromBatch;
          
//           // If no more quantity needed, break
//           if (remainingQty <= 0) return;
//         });
//       }
//     });
    
//     setDispatchItems(dispatchRows);
//   };

//   const handleUomChange = (index, values) => {
//     const updated = [...dispatchItems];
//     const maxAvailable = updated[index].Available_Qty;
//     const requestedQty = values.uom1_qty || 0;
    
//     // Don't allow dispatching more than available
//     const actualQty = Math.min(requestedQty, maxAvailable);
    
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: actualQty,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Dispatched: actualQty,
//       sale_unit: values.sale_unit || 'uom1'
//     };
    
//     setDispatchItems(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const baseUrl = `http://${window.location.hostname}:4000/api`;
      
//       const dispatchPayload = {
//         stockMain: {
//           Stock_Type_ID: 2,
//           COA_ID: salesOrder.COA_ID,
//           Date: dispatchData.Date,
//           Status: dispatchData.Status,
//           Order_Main_ID: salesOrder.ID
//         },
//         stockDetails: dispatchItems
//           .filter(item => item.QTY_Dispatched > 0) // Only dispatch items with quantity
//           .map((item, index) => ({
//             Line_Id: index + 1,
//             Item_ID: item.Item_ID,
//             Batch_id: item.batch_id || null,
//             Stock_Price: item.Stock_Price,
//             Stock_out_UOM_Qty: item.uom1_qty,
//             Stock_out_SKU_UOM_Qty: item.uom2_qty,
//             Stock_out_UOM3_Qty: item.uom3_qty
//           }))
//       };

//       const response = await fetch(`${baseUrl}/dispatch`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dispatchPayload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         setMessage({ type: 'success', text: 'Sales Dispatch created successfully!' });
//         setTimeout(() => onSuccess(), 1500);
//       } else {
//         setMessage({ type: 'error', text: result.message || 'Failed to create dispatch' });
//       }
//     } catch (error) {
//       console.error('Dispatch creation error:', error);
//       setMessage({ type: 'error', text: 'Failed to create dispatch' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (dataLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded p-6">
//           <div className="flex items-center">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
//             <span>Loading available stock batches...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-auto">
        
//         {/* Header */}
//         <div className="bg-yellow-400 text-black p-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">🚚 Sales Dispatch</h2>
//             <p className="text-sm">From SO: {salesOrder.Number}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-black hover:text-gray-600 text-2xl font-bold"
//           >
//             ×
//           </button>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div className={`m-4 p-3 rounded ${
//             message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4">
//           {/* Dispatch Information Grid */}
//           <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
//             {/* Row 1 */}
//             <div>
//               <label className="font-bold text-black">Sales Order Number</label>
//               <div className="bg-gray-100 p-2 border rounded font-medium">
//                 🔍 {dispatchData.Sales_Order_Number}
//               </div>
//             </div>
//             <div>
//               <label className="font-bold text-black">Sales Dispatch ID</label>
//               <div className="bg-gray-100 p-2 border rounded text-gray-600">
//                 Auto / Prime Key / Disable
//               </div>
//             </div>
//             <div>
//               <label className="font-bold text-black">Sales Dispatch Number</label>
//               <div className="bg-gray-100 p-2 border rounded text-gray-600">
//                 Auto as per type Sequence
//               </div>
//             </div>
//             <div>
//               <label className="font-bold text-black">Name of Buyer</label>
//               <div className="bg-gray-100 p-2 border rounded font-medium">
//                 {dispatchData.Name_of_Buyer}
//               </div>
//             </div>

//             {/* Row 2 */}
//             <div>
//               <label className="font-bold text-black">Date</label>
//               <input
//                 type="date"
//                 value={dispatchData.Date}
//                 onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="font-bold text-black">Status</label>
//               <select
//                 value={dispatchData.Status}
//                 onChange={(e) => setDispatchData(prev => ({ ...prev, Status: e.target.value }))}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="UnPost">UnPost</option>
//                 <option value="Post">Post</option>
//               </select>
//             </div>
//             <div>
//               <label className="font-bold text-black">Sales Order Status</label>
//               <select
//                 value={dispatchData.Sales_Order_Status}
//                 onChange={(e) => setDispatchData(prev => ({ ...prev, Sales_Order_Status: e.target.value }))}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="Partial">Partial</option>
//                 <option value="Complete">Complete</option>
//               </select>
//             </div>
//             <div></div> {/* Empty cell for alignment */}
//           </div>

//           {/* Items Table with Multi-Batch Support */}
//           <div className="bg-white border rounded-lg overflow-hidden">
//             <div className="bg-yellow-100 p-3 flex justify-between items-center">
//               <h3 className="font-bold text-black">Items to Dispatch (Multi-Batch Support)</h3>
//               <div className="text-xs text-gray-600">
//                 📊 Showing available stock by batch
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr>
//                     <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Line_Id</th>
//                     <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Batch Number</th>
//                     <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Item</th>
//                     <th className="bg-purple-200 px-3 py-2 text-center font-bold border">Available</th>
//                     <th className="bg-yellow-300 px-3 py-2 text-center font-bold border">Qty in SO</th>
//                     <th className="bg-yellow-300 px-3 py-2 text-center font-bold border">Uom SO</th>
//                     <th className="bg-green-200 px-3 py-2 text-center font-bold border">QTY Dispatched</th>
//                     <th className="bg-green-200 px-3 py-2 text-center font-bold border">UOM Dispatch</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dispatchItems.map((item, index) => (
//                     <tr key={index} className={`hover:bg-gray-50 border-b ${
//                       item.Available_Qty === 0 ? 'bg-red-50' : ''
//                     }`}>
//                       <td className="px-3 py-3 text-center font-bold border">
//                         {item.Line_Id}
//                       </td>
                      
//                       {/* Batch Number with Status */}
//                       <td className="px-3 py-3 border">
//                         <div className={`px-2 py-1 rounded text-xs font-bold ${
//                           item.Available_Qty === 0 
//                             ? 'bg-red-100 text-red-800' 
//                             : 'bg-blue-100 text-blue-800'
//                         }`}>
//                           {item.Batch_Number}
//                         </div>
//                       </td>
                      
//                       <td className="px-3 py-3 border">
//                         <div className="font-medium text-black">
//                           {item.Item}
//                         </div>
//                       </td>
                      
//                       {/* Available Stock (Purple) */}
//                       <td className="px-3 py-3 text-center bg-purple-50 border">
//                         <div className={`font-bold px-2 py-1 rounded ${
//                           item.Available_Qty === 0 
//                             ? 'bg-red-200 text-red-800' 
//                             : 'bg-purple-200 text-purple-800'
//                         }`}>
//                           {item.Available_Qty}
//                         </div>
//                       </td>
                      
//                       {/* SO Data (Yellow Background) */}
//                       <td className="px-3 py-3 text-center bg-yellow-50 font-bold border">
//                         {item.Qty_in_SO || '-'}
//                       </td>
//                       <td className="px-3 py-3 text-center bg-yellow-50 font-medium border">
//                         {item.Uom_SO}
//                       </td>
                      
//                       {/* Dispatch Data (Green Background) */}
//                       <td className="px-3 py-3 bg-green-50 border">
//                         {item.canEdit ? (
//                           <UomConverter
//                             itemId={item.Item_ID}
//                             onChange={(values) => handleUomChange(index, values)}
//                             initialValues={{
//                               uom1_qty: item.uom1_qty?.toString() || '',
//                               uom2_qty: item.uom2_qty?.toString() || '',
//                               uom3_qty: item.uom3_qty?.toString() || '',
//                               sale_unit: item.sale_unit || 'uom1'
//                             }}
//                             isPurchase={false}
//                             maxQuantity={item.Available_Qty} // Limit to available stock
//                           />
//                         ) : (
//                           <div className="text-center text-gray-500 font-medium">
//                             No Stock Available
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-3 py-3 text-center bg-green-50 font-bold border">
//                         <div className={`px-2 py-1 rounded ${
//                           item.QTY_Dispatched > 0 
//                             ? 'bg-green-200 text-green-800'
//                             : 'bg-gray-200 text-gray-600'
//                         }`}>
//                           {item.QTY_Dispatched} {item.UOM_Dispatch}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Summary */}
//           <div className="mt-4 p-4 bg-gray-100 rounded">
//             <h4 className="font-bold text-gray-800 mb-2">📊 Dispatch Summary</h4>
//             <div className="grid grid-cols-3 gap-4 text-sm">
//               <div>
//                 <span className="font-medium">Total Items:</span> {dispatchItems.length}
//               </div>
//               <div>
//                 <span className="font-medium">Items with Stock:</span> {dispatchItems.filter(i => i.Available_Qty > 0).length}
//               </div>
//               <div>
//                 <span className="font-medium">Out of Stock:</span> {dispatchItems.filter(i => i.Available_Qty === 0).length}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || dispatchItems.filter(i => i.QTY_Dispatched > 0).length === 0}
//               className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating Dispatch...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Create Dispatch ({dispatchItems.filter(i => i.QTY_Dispatched > 0).length} items)
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DispatchModal;











































































// // components/modals/DispatchModal.jsx
// import React, { useState, useEffect } from 'react';
// import { FiX, FiPlus, FiTrash2, FiTruck } from 'react-icons/fi';

// const DispatchModal = ({ isOpen, onClose, selectedOrder = null, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [availableBatches, setAvailableBatches] = useState({});
//   const [formData, setFormData] = useState({
//     stockMain: {
//       COA_ID: selectedOrder?.COA_ID || '',
//       Date: new Date().toISOString().split('T')[0],
//       Purchase_Type: 'Local selling',
//       Status: 'UnPost',
//       Order_Main_ID: selectedOrder?.ID || null
//     },
//     stockDetails: []
//   });

//   useEffect(() => {
//     if (isOpen) {
//       fetchCustomers();
//       if (selectedOrder) {
//         initializeFromOrder();
//       }
//     }
//   }, [isOpen, selectedOrder]);

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
//       const result = await response.json();
//       if (result.success) {
//         setCustomers(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
//   };

//   const initializeFromOrder = async () => {
//     if (!selectedOrder?.details) return;
    
//     // Initialize stock details from order
//     const initialDetails = [];
    
//     for (const orderDetail of selectedOrder.details) {
//       // Fetch available batches for this item
//       await fetchAvailableBatches(orderDetail.Item_ID);
      
//       initialDetails.push({
//         Item_ID: orderDetail.Item_ID,
//         itemName: orderDetail.item?.itemName || '',
//         batchno: '',
//         Stock_out_UOM_Qty: orderDetail.Stock_out_UOM_Qty || orderDetail.uom1_qty || 0,
//         Stock_out_SKU_UOM_Qty: orderDetail.Stock_out_SKU_UOM_Qty || orderDetail.uom2_qty || 0,
//         Stock_out_UOM3_Qty: orderDetail.Stock_out_UOM3_Qty || orderDetail.uom3_qty || 0,
//         Stock_Price: orderDetail.Price || 0,
//         maxAvailable: 0,
//         availableBatches: []
//       });
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       stockDetails: initialDetails
//     }));
//   };

//   const fetchAvailableBatches = async (itemId) => {
//     try {
//       const response = await fetch(
//         `http://${window.location.hostname}:4000/api/dispatch/available-batches/${itemId}`
//       );
//       const result = await response.json();
      
//       if (result.success) {
//         setAvailableBatches(prev => ({
//           ...prev,
//           [itemId]: result.data
//         }));
//         return result.data;
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching available batches:', error);
//       return [];
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert('Dispatch created successfully!');
//         onSuccess?.();
//         onClose();
//       } else {
//         alert('Error creating dispatch: ' + result.error);
//       }
//     } catch (error) {
//       console.error('Error creating dispatch:', error);
//       alert('Error creating dispatch');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addStockDetail = () => {
//     setFormData(prev => ({
//       ...prev,
//       stockDetails: [
//         ...prev.stockDetails,
//         {
//           Item_ID: '',
//           itemName: '',
//           batchno: '',
//           Stock_out_UOM_Qty: 0,
//           Stock_out_SKU_UOM_Qty: 0,
//           Stock_out_UOM3_Qty: 0,
//           Stock_Price: 0,
//           availableBatches: []
//         }
//       ]
//     }));
//   };

//   const removeStockDetail = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       stockDetails: prev.stockDetails.filter((_, i) => i !== index)
//     }));
//   };

//   const updateStockDetail = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       stockDetails: prev.stockDetails.map((detail, i) => {
//         if (i === index) {
//           const updated = { ...detail, [field]: value };
          
//           // If item changed, fetch available batches
//           if (field === 'Item_ID' && value) {
//             fetchAvailableBatches(value).then(batches => {
//               updated.availableBatches = batches;
//               setFormData(current => ({
//                 ...current,
//                 stockDetails: current.stockDetails.map((d, idx) => 
//                   idx === index ? updated : d
//                 )
//               }));
//             });
//           }
          
//           return updated;
//         }
//         return detail;
//       })
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center text-white rounded-t-xl">
//           <div className="flex items-center gap-3">
//             <FiTruck size={24} />
//             <div>
//               <h3 className="text-xl font-bold">Create Dispatch Note</h3>
//               <p className="text-blue-100 text-sm">
//                 {selectedOrder ? `From Order: ${selectedOrder.Number}` : 'Standalone Dispatch'}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-200 transition-colors"
//           >
//             <FiX size={24} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Main Info */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h4 className="text-lg font-semibold mb-4 text-gray-800">Dispatch Information</h4>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Customer *
//                 </label>
//                 <select
//                   value={formData.stockMain.COA_ID}
//                   onChange={(e) => setFormData(prev => ({
//                     ...prev,
//                     stockMain: { ...prev.stockMain, COA_ID: e.target.value }
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select Customer</option>
//                   {customers.map(customer => (
//                     <option key={customer.id} value={customer.id}>
//                       {customer.acName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date *
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.stockMain.Date}
//                   onChange={(e) => setFormData(prev => ({
//                     ...prev,
//                     stockMain: { ...prev.stockMain, Date: e.target.value }
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Type
//                 </label>
//                 <select
//                   value={formData.stockMain.Purchase_Type}
//                   onChange={(e) => setFormData(prev => ({
//                     ...prev,
//                     stockMain: { ...prev.stockMain, Purchase_Type: e.target.value }
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Local selling">Local Selling</option>
//                   <option value="Local">Local</option>
//                   <option value="Foreign">Foreign</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Items Section */}
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <h4 className="text-lg font-semibold text-gray-800">Dispatch Items</h4>
//               <button
//                 type="button"
//                 onClick={addStockDetail}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//               >
//                 <FiPlus size={16} />
//                 Add Item
//               </button>
//             </div>

//             {formData.stockDetails.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded-lg">
//                 <FiTruck size={48} className="mx-auto mb-4 text-gray-300" />
//                 <p className="text-gray-500">No items added yet</p>
//                 <p className="text-sm text-gray-400">Click "Add Item" to start</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {formData.stockDetails.map((detail, index) => (
//                   <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
//                     <div className="flex justify-between items-start mb-3">
//                       <h5 className="font-medium text-gray-800">Item {index + 1}</h5>
//                       <button
//                         type="button"
//                         onClick={() => removeStockDetail(index)}
//                         className="text-red-500 hover:text-red-700 transition-colors"
//                       >
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           Item ID
//                         </label>
//                         <input
//                           type="number"
//                           placeholder="Item ID"
//                           value={detail.Item_ID}
//                           onChange={(e) => updateStockDetail(index, 'Item_ID', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           Batch No
//                         </label>
//                         <select
//                           value={detail.batchno}
//                           onChange={(e) => updateStockDetail(index, 'batchno', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         >
//                           <option value="">Select Batch</option>
//                           {(availableBatches[detail.Item_ID] || []).map(batch => (
//                             <option key={batch.batchno} value={batch.batchno}>
//                               {batch.batchno} (Available: {batch.available_qty_uom1})
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           UOM1 Qty
//                         </label>
//                         <input
//                           type="number"
//                           step="0.001"
//                           placeholder="0"
//                           value={detail.Stock_out_UOM_Qty}
//                           onChange={(e) => updateStockDetail(index, 'Stock_out_UOM_Qty', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           UOM2 Qty
//                         </label>
//                         <input
//                           type="number"
//                           step="0.001"
//                           placeholder="0"
//                           value={detail.Stock_out_SKU_UOM_Qty}
//                           onChange={(e) => updateStockDetail(index, 'Stock_out_SKU_UOM_Qty', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           UOM3 Qty
//                         </label>
//                         <input
//                           type="number"
//                           step="0.001"
//                           placeholder="0"
//                           value={detail.Stock_out_UOM3_Qty}
//                           onChange={(e) => updateStockDetail(index, 'Stock_out_UOM3_Qty', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           Price
//                         </label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           placeholder="0.00"
//                           value={detail.Stock_Price}
//                           onChange={(e) => updateStockDetail(index, 'Stock_Price', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || formData.stockDetails.length === 0}
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <FiTruck size={16} />
//                   Create Dispatch
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DispatchModal;

















































































































// // this is works perfect 

// // components/DispatchModal.jsx - COMPLETE WITH DEBUGGING
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const DispatchModal = ({ salesOrder, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [dispatchData, setDispatchData] = useState({
//     Sales_Order_Number: salesOrder?.Number || '',
//     Dispatch_ID: 'Auto Generated',
//     Dispatch_Number: 'Auto Generated', 
//     Name_of_Customer: salesOrder?.account?.acName || '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling'
//   });

//   const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
//   const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
//   const [dispatchItems, setDispatchItems] = useState([]);
//   const [availableBatches, setAvailableBatches] = useState({});
//   const [batchLoading, setBatchLoading] = useState(false);

//   useEffect(() => {
//     if (salesOrder && salesOrder.details && Array.isArray(salesOrder.details)) {
//       console.log('🚀 Initializing DispatchModal with salesOrder:', salesOrder);
      
//       const items = salesOrder.details.map((detail, index) => ({
//         Line_Id: detail.Line_Id || (index + 1),
//         Batch_Number: '',
//         Item: detail.item?.itemName || 'Unknown Item',
//         Item_ID: detail.Item_ID,
        
//         // Original order info
//         Qty_in_SO: detail.uom1_qty || detail.Stock_out_UOM_Qty || 0,
//         Uom_SO: detail.item?.uom1?.uom || 'Pcs',
//         original_sale_unit: detail.sale_unit || 'uom1',
//         original_price: parseFloat(detail.Price) || 0,
        
//         // Dispatch info
//         QTY_Dispatched: 0,
//         UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 'uom1',
//         Stock_Price: parseFloat(detail.Price) || 0,
        
//         // Multi-batch support
//         isOriginalRow: true,
//         availableStock: 0,
//         item: detail.item
//       }));
      
//       console.log('📦 Initialized dispatch items:', items);
//       setDispatchItems(items);
      
//       setDispatchData(prev => ({
//         ...prev,
//         Sales_Order_Number: salesOrder.Number || '',
//         Name_of_Customer: salesOrder.account?.acName || ''
//       }));

//       // Fetch batches for all items
//       fetchAvailableBatchesForAllItems(items);
//     }
//   }, [salesOrder]);

//   // FIXED: Batch fetching with complete error handling
//   const fetchAvailableBatchesForAllItems = async (items) => {
//     setBatchLoading(true);
//     console.log('🔄 Starting batch fetch for all items...');
    
//     const batchData = {};
//     let successCount = 0;
//     let errorCount = 0;

//     try {
//       for (const item of items) {
//         try {
//           console.log(`📡 Fetching batches for Item_ID: ${item.Item_ID} (${item.Item})`);
          
//           const response = await fetch(
//             `http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`
//           );
          
//           console.log(`📥 Response status for Item_ID ${item.Item_ID}:`, response.status);
          
//           if (!response.ok) {
//             console.error(`❌ HTTP Error ${response.status} for Item_ID ${item.Item_ID}`);
//             const errorText = await response.text();
//             console.error('Error response:', errorText);
//             batchData[item.Item_ID] = [];
//             errorCount++;
//             continue;
//           }
          
//           const result = await response.json();
//           console.log(`📊 Batch API result for Item_ID ${item.Item_ID}:`, result);
          
//           if (result.success && result.data) {
//             console.log(`✅ Found ${result.data.length} batches for Item_ID ${item.Item_ID}`);
//             batchData[item.Item_ID] = result.data;
//             successCount++;
//           } else {
//             console.warn(`⚠️ No batches found for Item_ID ${item.Item_ID}:`, result.error);
//             batchData[item.Item_ID] = [];
//             errorCount++;
//           }
//         } catch (itemError) {
//           console.error(`❌ Error fetching batches for Item_ID ${item.Item_ID}:`, itemError);
//           batchData[item.Item_ID] = [];
//           errorCount++;
//         }
//       }
      
//       setAvailableBatches(batchData);
//       console.log(`🎉 Batch fetch complete: ${successCount} success, ${errorCount} errors`);
//       console.log('📦 Final batch data:', batchData);
      
//       if (errorCount > 0) {
//         setMessage({ 
//           type: 'error', 
//           text: `⚠️ Failed to load batches for ${errorCount} items. Check console for details.` 
//         });
//         setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//       }
      
//     } catch (error) {
//       console.error('❌ Fatal error in batch fetching:', error);
//       setMessage({ type: 'error', text: 'Failed to load available batches' });
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   const handleUomChange = (index, values) => {
//     const updated = [...dispatchItems];
//     const item = updated[index];
    
//     // Real-time stock validation
//     const requestedQty = values.uom1_qty || 0;
//     const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
    
//     if (requestedQty > availableStock && item.Batch_Number && availableStock >= 0) {
//       setMessage({ 
//         type: 'error', 
//         text: `❌ Cannot dispatch ${requestedQty} from ${item.Batch_Number}. Only ${availableStock} available!` 
//       });
//       setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//       return;
//     }

//     // Update if validation passes
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0, 
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Dispatched: values.uom1_qty || 0,
//       sale_unit: values.sale_unit || 'uom1',
//       UOM_Dispatched: values.sale_unit === 'uomTwo' ? updated[index].item?.uomTwo?.uom :
//                      values.sale_unit === 'uomThree' ? updated[index].item?.uomThree?.uom :
//                      updated[index].item?.uom1?.uom || 'Pcs'
//     };
//     setDispatchItems(updated);
//   };

//   // Multi-batch support
//   const addNewBatchRow = (originalIndex) => {
//     const originalItem = dispatchItems[originalIndex];
//     const newRow = {
//       Line_Id: parseFloat(originalItem.Line_Id) + 0.1 + (Math.random() * 0.01),
//       Batch_Number: '',
//       Item: `${originalItem.Item} (Additional Batch)`,
//       Item_ID: originalItem.Item_ID,
//       Qty_in_SO: 0,
//       Uom_SO: '-',
//       original_sale_unit: originalItem.original_sale_unit,
//       original_price: originalItem.original_price,
//       QTY_Dispatched: 0,
//       UOM_Dispatched: originalItem.UOM_Dispatched,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: originalItem.Stock_Price,
//       isOriginalRow: false,
//       isAdditionalBatch: true,
//       parentItemName: originalItem.Item,
//       availableStock: 0,
//       item: originalItem.item
//     };

//     const newItems = [...dispatchItems];
//     newItems.splice(originalIndex + 1, 0, newRow);
//     setDispatchItems(newItems);
//     console.log(`➕ Added new batch row for Item_ID ${originalItem.Item_ID}`);
//   };

//   const removeRow = (index) => {
//     if (dispatchItems.length > 1 && !dispatchItems[index].isOriginalRow) {
//       const newItems = dispatchItems.filter((_, i) => i !== index);
//       setDispatchItems(newItems);
//       console.log(`➖ Removed batch row at index ${index}`);
//     }
//   };

//   const updateDispatchItem = (index, field, value) => {
//     const updated = [...dispatchItems];
    
//     if (field === 'Stock_Price') {
//       updated[index][field] = parseFloat(value) || 0;
//     } else {
//       updated[index][field] = value;
//     }

//     // Update available stock when batch changes
//     if (field === 'Batch_Number' && value) {
//       const batches = availableBatches[updated[index].Item_ID] || [];
//       const selectedBatch = batches.find(b => b.batchno === value);
      
//       if (selectedBatch) {
//         updated[index].availableStock = parseFloat(selectedBatch.available_qty_uom1) || 0;
//         console.log(`📊 Selected batch ${value} has ${updated[index].availableStock} available`);
//       }
//     }

//     setDispatchItems(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!salesOrder || !salesOrder.ID) {
//       setMessage({ type: 'error', text: 'Invalid sales order data' });
//       return;
//     }

//     const itemsToDispatch = dispatchItems.filter(item => item.QTY_Dispatched > 0);
//     if (itemsToDispatch.length === 0) {
//       setMessage({ type: 'error', text: 'Please add quantities to dispatch' });
//       return;
//     }

//     const missingBatch = itemsToDispatch.find(item => !item.Batch_Number);
//     if (missingBatch) {
//       setMessage({ type: 'error', text: 'Please select batch for all items to dispatch' });
//       return;
//     }
    
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const baseUrl = `http://${window.location.hostname}:4000/api`;
      
//       const dispatchPayload = {
//         stockMain: {
//           Stock_Type_ID: 12,
//           COA_ID: salesOrder.COA_ID,
//           Date: dispatchData.Date,
//           Status: dispatchData.Status,
//           Purchase_Type: dispatchData.Dispatch_Type,
//           Order_Main_ID: salesOrder.ID
//         },
//         stockDetails: itemsToDispatch.map(item => ({
//           Line_Id: item.Line_Id,
//           Item_ID: item.Item_ID,
//           batchno: item.Batch_Number,
//           Stock_Price: parseFloat(item.Stock_Price) || 0,
//           Stock_out_UOM_Qty: item.uom1_qty || 0,
//           Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//           Stock_out_UOM3_Qty: item.uom3_qty || 0
//         }))
//       };

//       console.log('📤 Sending dispatch payload:', dispatchPayload);

//       const response = await fetch(`${baseUrl}/dispatch`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dispatchPayload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
        
//         if (updateOrderStatus && salesOrder.ID) {
//           try {
//             const statusResponse = await fetch(`${baseUrl}/order/update-status/${salesOrder.ID}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: selectedOrderStatus.trim() })
//             });
            
//             const statusResult = await statusResponse.json();
//             if (statusResult.success) {
//               console.log(`✅ Order status updated to ${selectedOrderStatus}`);
//             }
//           } catch (statusError) {
//             console.warn('⚠️ Error updating order status:', statusError);
//           }
//         }

//         setMessage({ 
//           type: 'success', 
//           text: `✅ Dispatch ${result.data?.dispatchNumber} created successfully!` 
//         });
        
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 1500);
        
//       } else {
//         setMessage({ type: 'error', text: result.error || 'Failed to create dispatch' });
//       }
//     } catch (error) {
//       console.error('❌ Dispatch creation error:', error);
//       setMessage({ type: 'error', text: `Network error: ${error.message}` });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FIXED: Get all batch options for an item
//   const getBatchOptions = (itemId) => {
//     const batches = availableBatches[itemId] || [];
//     console.log(`📋 Batch options for Item_ID ${itemId}:`, batches);
//     return batches;
//   };

//   // FIXED: Get available stock with detailed logging
//   const getAvailableStock = (itemId, batchno) => {
//     if (!itemId || !batchno) return 0;
    
//     const batches = getBatchOptions(itemId);
//     const batch = batches.find(b => b.batchno === batchno);
//     const available = batch ? parseFloat(batch.available_qty_uom1) || 0 : 0;
    
//     console.log(`📊 Available stock for Item_ID ${itemId}, Batch ${batchno}: ${available}`);
//     return available;
//   };

//   // Early return checks
//   if (!salesOrder) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="text-center">
//             <div className="text-red-500 text-4xl mb-4">⚠️</div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">No Sales Order Selected</h3>
//             <p className="text-gray-600 mb-4">Please select a sales order first</p>
//             <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
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
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <div>
//             <h2 className="text-xl font-bold">🚚 Create Dispatch Note</h2>
//             <p className="text-sm opacity-90">From SO: {salesOrder.Number}</p>
//             <p className="text-xs opacity-75">Customer: {salesOrder.account?.acName}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
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
//               {message.type === 'success' ? '✅' : '❌'}
//               <span className="ml-2">{message.text}</span>
//             </div>
//           </div>
//         )}

//         {/* Debug Panel */}
//         <div className="bg-gray-50 p-3 m-4 rounded border text-xs text-gray-600">
//           <strong>Debug Info:</strong> 
//           Items: {dispatchItems.length} | 
//           Batches loaded: {Object.keys(availableBatches).length} items | 
//           Total batches: {Object.values(availableBatches).reduce((sum, batches) => sum + batches.length, 0)} | 
//           Loading: {batchLoading ? 'Yes' : 'No'}
//         </div>

//         <form onSubmit={handleSubmit} className="p-4">
//           {/* Dispatch Information */}
//           <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
//             <h3 className="font-bold text-gray-800 mb-3">Dispatch Information</h3>
            
//             <div className="grid grid-cols-4 gap-4 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Sales Order Number</label>
//                 <div className="bg-gray-100 p-2 rounded font-bold text-green-600">{dispatchData.Sales_Order_Number}</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Dispatch ID</label>
//                 <div className="bg-gray-100 p-2 rounded text-gray-600">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Dispatch Number</label>
//                 <div className="bg-gray-100 p-2 rounded text-gray-600">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Customer Name</label>
//                 <div className="bg-gray-100 p-2 rounded font-medium text-blue-600">{dispatchData.Name_of_Customer}</div>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={dispatchData.Date}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Status</label>
//                 <select
//                   value={dispatchData.Status}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Status: e.target.value }))}
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="UnPost">UnPost</option>
//                   <option value="Post">Post</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700 block mb-1">Dispatch Type</label>
//                 <select
//                   value={dispatchData.Dispatch_Type}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Dispatch_Type: e.target.value }))}
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Local selling">Local Selling</option>
//                   <option value="Local">Local</option>
//                   <option value="Foreign">Foreign</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Order Status Update */}
//           <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
//             <div className="flex items-center mb-3">
//               <input
//                 type="checkbox"
//                 id="updateOrderStatus"
//                 checked={updateOrderStatus}
//                 onChange={(e) => setUpdateOrderStatus(e.target.checked)}
//                 className="mr-2 w-4 h-4"
//               />
//               <label htmlFor="updateOrderStatus" className="text-sm font-medium text-gray-700">
//                 📝 Update Sales Order Status After Dispatch Creation
//               </label>
//             </div>
//             {updateOrderStatus && (
//               <select
//                 value={selectedOrderStatus}
//                 onChange={(e) => setSelectedOrderStatus(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white ml-6"
//               >
//                 <option value="Partial">🟡 Partial</option>
//                 <option value="Complete">✅ Complete</option>
//                 <option value="Incomplete">❌ Incomplete</option>
//               </select>
//             )}
//           </div>

//           {/* Multi-Batch Instructions */}
//           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
//             <div className="flex items-start">
//               <div className="text-yellow-400 mr-3">💡</div>
//               <div>
//                 <p className="text-sm text-yellow-700">
//                   <strong>Multi-Batch Dispatch:</strong> Click "+ Batch" to dispatch same item from different batches.
//                   Your database shows Item_ID=2 has stock in multiple batches - you'll see them all in the dropdown.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Batch Loading */}
//           {batchLoading && (
//             <div className="flex items-center justify-center py-4 mb-4 bg-blue-50 rounded-lg border border-blue-200">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
//               <span className="text-blue-700">Loading all available batches for all items...</span>
//             </div>
//           )}

//           {/* Items Table */}
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
//             <div className="bg-gray-100 p-3 border-b">
//               <h3 className="font-bold text-gray-800">Items to Dispatch ({dispatchItems.length} rows)</h3>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-blue-200">
//                   <tr>
//                     <th className="px-3 py-2 text-left font-bold">Line_Id</th>
//                     <th className="px-3 py-2 text-left font-bold">Batch Selection</th>
//                     <th className="px-3 py-2 text-left font-bold">Item</th>
//                     <th className="px-3 py-2 text-center font-bold bg-blue-300">Qty in SO</th>
//                     <th className="px-3 py-2 text-center font-bold bg-blue-300">UOM SO</th>
//                     <th className="px-3 py-2 text-center font-bold bg-orange-200">Available</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200">QTY Dispatched</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200">UOM Dispatched</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200">Unit Price</th>
//                     <th className="px-3 py-2 text-center font-bold bg-green-200">Line Total</th>
//                     <th className="px-3 py-2 text-center font-bold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {dispatchItems.map((item, index) => (
//                     <tr 
//                       key={index} 
//                       className={`hover:bg-gray-50 transition-colors ${
//                         item.isAdditionalBatch ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
//                       }`}
//                     >
//                       <td className="px-3 py-3 text-center font-bold">
//                         {item.Line_Id}
//                         {item.isAdditionalBatch && (
//                           <div className="text-xs text-yellow-600 bg-yellow-200 px-1 rounded mt-1">
//                             Additional
//                           </div>
//                         )}
//                       </td>
                      
//                       <td className="px-3 py-3">
//                         {/* FIXED: Show ALL available batches */}
//                         <select
//                           value={item.Batch_Number}
//                           onChange={(e) => updateDispatchItem(index, 'Batch_Number', e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
//                           required
//                         >
//                           <option value="">
//                             📦 Select Batch ({getBatchOptions(item.Item_ID).length} available)
//                           </option>
//                           {getBatchOptions(item.Item_ID).map((batch, batchIndex) => (
//                             <option key={`${item.Item_ID}-${batch.batchno}-${batchIndex}`} value={batch.batchno}>
//                               📦 {batch.batchno} (Stock: {batch.available_qty_uom1})
//                             </option>
//                           ))}
//                           {getBatchOptions(item.Item_ID).length === 0 && (
//                             <option value="" disabled>❌ No stock available</option>
//                           )}
//                         </select>
                        
//                         <div className="text-xs text-gray-500 mt-1">
//                           Item_ID: {item.Item_ID} | Batches: {getBatchOptions(item.Item_ID).length}
//                         </div>
//                       </td>
                      
//                       <td className="px-3 py-3">
//                         <div className="font-medium text-gray-900">{item.Item}</div>
//                         <div className="text-xs text-gray-500">ID: {item.Item_ID}</div>
//                       </td>
                      
//                       <td className="px-3 py-3 text-center bg-blue-50">
//                         <div className="font-bold text-blue-600 text-lg">
//                           {item.isOriginalRow ? item.Qty_in_SO : '-'}
//                         </div>
//                       </td>
                      
//                       <td className="px-3 py-3 text-center bg-blue-50">
//                         <div className="font-medium text-blue-800">
//                           {item.isOriginalRow ? item.Uom_SO : '-'}
//                         </div>
//                       </td>
                      
//                       <td className="px-3 py-3 text-center bg-orange-50">
//                         <div className={`font-bold text-lg ${
//                           getAvailableStock(item.Item_ID, item.Batch_Number) > 0 ? 'text-green-600' : 'text-red-600'
//                         }`}>
//                           {item.Batch_Number ? getAvailableStock(item.Item_ID, item.Batch_Number) : '-'}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {item.Batch_Number || 'Select batch first'}
//                         </div>
//                       </td>
                      
//                       <td className="px-3 py-3 bg-green-50">
//                         <UomConverter
//                           itemId={item.Item_ID}
//                           onChange={(values) => handleUomChange(index, values)}
//                           initialValues={{
//                             uom1_qty: item.uom1_qty?.toString() || '',
//                             uom2_qty: item.uom2_qty?.toString() || '',
//                             uom3_qty: item.uom3_qty?.toString() || '',
//                             sale_unit: item.sale_unit || 'uom1'
//                           }}
//                           isPurchase={false}
//                         />
//                       </td>
                      
//                       <td className="px-3 py-3 text-center bg-green-50">
//                         <div className="font-bold text-green-600 text-lg">
//                           {item.QTY_Dispatched}
//                         </div>
//                         <div className="text-xs text-green-800 font-medium">
//                           {item.UOM_Dispatched}
//                         </div>
//                       </td>
                      
//                       <td className="px-3 py-3 bg-green-50">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={item.Stock_Price || ''}
//                           onChange={(e) => updateDispatchItem(index, 'Stock_Price', e.target.value)}
//                           className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-green-500"
//                           placeholder="0.00"
//                         />
//                       </td>
                      
//                       <td className="px-3 py-3 text-center bg-green-50">
//                         <div className="font-bold text-green-800 text-lg">
//                           ${((item.QTY_Dispatched || 0) * (parseFloat(item.Stock_Price) || 0)).toFixed(2)}
//                         </div>
//                       </td>
                      
//                       <td className="px-3 py-3 text-center">
//                         <div className="flex flex-col space-y-1">
//                           {item.isOriginalRow && (
//                             <button
//                               type="button"
//                               onClick={() => addNewBatchRow(index)}
//                               className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
//                               title="Add Another Batch for This Item"
//                             >
//                               + Batch
//                             </button>
//                           )}
//                           {item.isAdditionalBatch && (
//                             <button
//                               type="button"
//                               onClick={() => removeRow(index)}
//                               className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || batchLoading}
//               className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
//             >
//               {loading ? 'Creating...' : 'Create Dispatch'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DispatchModal;








































































































// // THIS IS COMPONENT IS WORKING BUT THE ISSUE IS AUTO DELTE IF THE ITEMS QUANTITYT IS ZERO




// // components/DispatchModal.jsx - FIXED with stock logic
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const DispatchModal = ({ 
//   salesOrder = null,      
//   dispatchId = null,      
//   mode = 'fromOrder',
//   onClose, 
//   onSuccess 
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [dispatchData, setDispatchData] = useState({
//     Sales_Order_Number: '',
//     Dispatch_Number: '',
//     Name_of_Customer: '',
//     COA_ID: '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling'
//   });

//   const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
//   const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
//   const [dispatchItems, setDispatchItems] = useState([]);
  
//   // Multi-batch support
//   const [availableBatches, setAvailableBatches] = useState({});
//   const [batchLoading, setBatchLoading] = useState(false);
  
//   // FIXED: Store original quantities for edit mode stock calculation
//   const [originalDispatchQuantities, setOriginalDispatchQuantities] = useState({});
  
//   const [customers, setCustomers] = useState([]);
//   const [items, setItems] = useState([]);
  
//   // SIMPLE: Direct flag
//   const [isFromOrder, setIsFromOrder] = useState(false);

//   useEffect(() => {
//     initializeModal();
//   }, [mode, salesOrder, dispatchId]);

//   const initializeModal = async () => {
//     if (mode === 'fromOrder') {
//       setIsFromOrder(true);
//       initializeFromOrder();
//     } else if (mode === 'edit') {
//       await loadExistingDispatch();
//     } else if (mode === 'create') {
//       setIsFromOrder(false);
//       await fetchCustomers();
//       await fetchItems();
//       initializeEmpty();
//     }
//   };

//   const initializeFromOrder = () => {
//     setDispatchData({
//       Sales_Order_Number: salesOrder.Number,
//       Dispatch_Number: 'Auto Generated',
//       Name_of_Customer: salesOrder.account?.acName || '',
//       COA_ID: salesOrder.COA_ID,
//       Date: new Date().toISOString().split('T')[0],
//       Status: 'UnPost',
//       Dispatch_Type: 'Local selling'
//     });

//     const items = salesOrder.details.map((detail, index) => ({
//       Line_Id: detail.Line_Id || (index + 1),
//       Batch_Number: '',
//       Item: detail.item?.itemName || '',
//       Item_ID: detail.Item_ID,
//       Qty_in_SO: detail.uom1_qty || 0,
//       Uom_SO: detail.item?.uom1?.uom || 'Pcs',
//       QTY_Dispatched: 0,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: parseFloat(detail.Price) || 0,
//       availableStock: 0,
//       isOriginalRow: true,
//       item: detail.item
//     }));
//     setDispatchItems(items);
    
//     fetchAllAvailableBatches(items);
//   };

//   const loadExistingDispatch = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const dispatch = result.data;
        
//         // SIMPLE: Direct check like your API showed
//         const wasFromOrder = dispatch.Order_Main_ID !== null;
//         setIsFromOrder(wasFromOrder);
        
//         console.log(`🔍 Dispatch ID ${dispatchId}: Order_Main_ID = ${dispatch.Order_Main_ID}, Was From Order = ${wasFromOrder}`);
        
//         setDispatchData({
//           Sales_Order_Number: dispatch.order?.Number || 'Standalone Dispatch',
//           Dispatch_Number: dispatch.Number,
//           Name_of_Customer: dispatch.account?.acName || '',
//           COA_ID: dispatch.COA_ID,
//           Date: dispatch.Date.split('T')[0],
//           Status: dispatch.Status,
//           Dispatch_Type: dispatch.Purchase_Type
//         });

//         // FIXED: Store original dispatched quantities for stock calculation
//         const originalQty = {};
//         dispatch.details?.forEach(detail => {
//           const key = `${detail.Item_ID}_${detail.batchno}`;
//           originalQty[key] = parseFloat(detail.Stock_out_UOM_Qty) || 0;
//         });
//         setOriginalDispatchQuantities(originalQty);

//         console.log('📊 Original dispatch quantities stored:', originalQty);

//         const items = dispatch.details?.map((detail, index) => ({
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           QTY_Dispatched: detail.Stock_out_UOM_Qty || 0,
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           sale_unit: 'uom1',
//           Stock_Price: detail.Stock_Price || 0,
//           availableStock: 0,
//           isOriginalRow: true,
//           item: detail.item
//         })) || [];
        
//         setDispatchItems(items);
        
//         // FIXED: Fetch batches with adjusted stock for edit mode
//         await fetchBatchesForEdit(items);

//         // Only fetch customers if standalone
//         if (!wasFromOrder) {
//           await fetchCustomers();
//         }
//         await fetchItems();
//       }
      
//     } catch (error) {
//       console.error('Error loading dispatch:', error);
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const initializeEmpty = () => {
//     setDispatchItems([{
//       Line_Id: 1,
//       Batch_Number: '',
//       Item: '',
//       Item_ID: '',
//       QTY_Dispatched: 0,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: 0,
//       availableStock: 0,
//       isOriginalRow: true
//     }]);
//   };

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
//       const result = await response.json();
//       if (result.success) setCustomers(result.data);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
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

//   const fetchAllAvailableBatches = async (items) => {
//     setBatchLoading(true);
//     const batchData = {};

//     try {
//       for (const item of items) {
//         const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`);
//         const result = await response.json();
        
//         if (result.success) {
//           batchData[item.Item_ID] = result.data;
//           console.log(`✅ Loaded ${result.data.length} batches for Item_ID ${item.Item_ID}`);
//         }
//       }
//       setAvailableBatches(batchData);
//     } catch (error) {
//       console.error('Error fetching batches:', error);
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   // FIXED: Fetch batches for edit mode with adjusted stock
//   // const fetchBatchesForEdit = async (items) => {
//   //   setBatchLoading(true);
//   //   const batchData = {};

//   //   try {
//   //     for (const item of items) {
//   //       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`);
//   //       const result = await response.json();
        
//   //       if (result.success) {
//   //         // FIXED: Adjust available stock = current API stock + original dispatch quantity
//   //         const adjustedBatches = result.data.map(batch => {
//   //           const originalKey = `${item.Item_ID}_${batch.batchno}`;
//   //           const originalQty = originalDispatchQuantities[originalKey] || 0;
//   //           const adjustedStock = (parseFloat(batch.available_qty_uom1) || 0) + originalQty;
            
//   //           return {
//   //             ...batch,
//   //             available_qty_uom1: adjustedStock.toString(),
//   //             original_dispatched: originalQty,
//   //             raw_stock: batch.available_qty_uom1
//   //           };
//   //         });
          
//   //         batchData[item.Item_ID] = adjustedBatches;
//   //         console.log(`📊 Adjusted stock for Item_ID ${item.Item_ID}:`, adjustedBatches);
//   //       }
//   //     }
//   //     setAvailableBatches(batchData);
//   //   } catch (error) {
//   //     console.error('Error fetching batches for edit:', error);
//   //   } finally {
//   //     setBatchLoading(false);
//   //   }
//   // };








// // In loadExistingDispatch function
// const fetchBatchesForEdit = async (items) => {
//   setBatchLoading(true);
//   const batchData = {};

//   for (const item of items) {
//     if (item.Item_ID) {
//       try {
//         // FIXED: Use new edit endpoint
//         const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches-edit/${item.Item_ID}/${dispatchId}`);
//         const result = await response.json();
        
//         if (result.success && result.data) {
//           batchData[item.Item_ID] = result.data;
//           console.log(`✅ EDIT: Item ${item.Item_ID} has ${result.data.length} batches`);
//         }
//       } catch (error) {
//         console.error(`Error fetching edit batches:`, error);
//       }
//     }
//   }
  
//   setAvailableBatches(batchData);
//   setBatchLoading(false);
// };



//   const fetchBatchesForItem = async (itemId) => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${itemId}`);
//       const result = await response.json();
//       if (result.success) {
//         setAvailableBatches(prev => ({ ...prev, [itemId]: result.data }));
//       }
//     } catch (error) {
//       console.error(`Error fetching batches for item ${itemId}:`, error);
//     }
//   };

//   // FIXED: Stock validation with proper error message
//   const handleUomChange = (index, values) => {
//     const updated = [...dispatchItems];
//     const item = updated[index];
    
//     // FIXED: Always validate in UOM1 (base unit) with clear error
//     const requestedQtyUOM1 = parseFloat(values.uom1_qty) || 0;
//     const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
    
//     // FIXED: Show clear error message in UOM1 terms
//     if (item.Batch_Number && requestedQtyUOM1 > availableStock && availableStock >= 0) {
//       setMessage({ 
//         type: 'error', 
//         text: `STOCK ERROR: Cannot dispatch ${requestedQtyUOM1} ${item.item?.uom1?.uom || 'pcs'} from batch "${item.Batch_Number}". Only ${availableStock} ${item.item?.uom1?.uom || 'pcs'} available!` 
//       });
//       setTimeout(() => setMessage({ type: '', text: '' }), 7000);
//       return; // Don't update if exceeds stock
//     }

//     // Clear any existing error if validation passes
//     if (message.type === 'error') {
//       setMessage({ type: '', text: '' });
//     }

//     // Update quantities
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Dispatched: values.uom1_qty || 0,
//       sale_unit: values.sale_unit || 'uom1'
//     };
//     setDispatchItems(updated);
//   };

//   const updateDispatchItem = (index, field, value) => {
//     const updated = [...dispatchItems];
    
//     if (field === 'Item_ID' && !isFromOrder) {
//       const selectedItem = items.find(item => item.id === parseInt(value));
//       updated[index].Item = selectedItem?.itemName || '';
//       updated[index].Item_ID = value;
//       updated[index].item = selectedItem;
      
//       if (selectedItem) {
//         fetchBatchesForItem(selectedItem.id);
//       }
//     } else if (field === 'Stock_Price') {
//       updated[index][field] = parseFloat(value) || 0;
//     } else {
//       updated[index][field] = value;
//     }

//     // Update available stock when batch changes
//     if (field === 'Batch_Number' && value) {
//       const stock = getAvailableStock(updated[index].Item_ID, value);
//       updated[index].availableStock = stock;
//     }

//     setDispatchItems(updated);
//   };

//   // Multi-batch support
//   const addNewBatchRow = (originalIndex) => {
//     const originalItem = dispatchItems[originalIndex];
//     const newRow = {
//       Line_Id: parseFloat(originalItem.Line_Id) + 0.1,
//       Batch_Number: '',
//       Item: `${originalItem.Item} (Additional Batch)`,
//       Item_ID: originalItem.Item_ID,
//       Qty_in_SO: 0,
//       Uom_SO: '-',
//       QTY_Dispatched: 0,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: originalItem.Stock_Price,
//       isOriginalRow: false,
//       isAdditionalBatch: true,
//       availableStock: 0,
//       item: originalItem.item
//     };

//     const newItems = [...dispatchItems];
//     newItems.splice(originalIndex + 1, 0, newRow);
//     setDispatchItems(newItems);
//   };

//   const addNewItem = () => {
//     setDispatchItems([
//       ...dispatchItems,
//       {
//         Line_Id: dispatchItems.length + 1,
//         Batch_Number: '',
//         Item: '',
//         Item_ID: '',
//         QTY_Dispatched: 0,
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 'uom1',
//         Stock_Price: 0,
//         availableStock: 0,
//         isOriginalRow: true
//       }
//     ]);
//   };

//   const removeItem = (index) => {
//     if (dispatchItems.length > 1) {
//       const itemToRemove = dispatchItems[index];
//       if (mode === 'create' || itemToRemove.isAdditionalBatch) {
//         setDispatchItems(dispatchItems.filter((_, i) => i !== index));
//       }
//     }
//   };

//   // FIXED: Get available stock with edit mode logic
//   const getAvailableStock = (itemId, batchno) => {
//     if (!itemId || !batchno) return 0;
    
//     const batches = availableBatches[itemId] || [];
//     const batch = batches.find(b => b.batchno === batchno);
    
//     if (!batch) return 0;
    
//     // FIXED: For edit mode, stock is already adjusted in fetchBatchesForEdit
//     const availableStock = parseFloat(batch.available_qty_uom1) || 0;
    
//     return availableStock;
//   };

//   const getBatchOptions = (itemId) => {
//     return availableBatches[itemId] || [];
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!isFromOrder && !dispatchData.COA_ID) {
//       setMessage({ type: 'error', text: 'Please select a customer' });
//       return;
//     }

//     const itemsToDispatch = dispatchItems.filter(item => item.QTY_Dispatched > 0);
//     if (itemsToDispatch.length === 0) {
//       setMessage({ type: 'error', text: 'Please add quantities to dispatch' });
//       return;
//     }

//     const missingBatch = itemsToDispatch.find(item => !item.Batch_Number);
//     if (missingBatch) {
//       setMessage({ type: 'error', text: `Please select batch for: ${missingBatch.Item}` });
//       return;
//     }

//     // FIXED: Final stock validation before submit
//     for (const item of itemsToDispatch) {
//       const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
//       if (item.QTY_Dispatched > availableStock) {
//         setMessage({ 
//           type: 'error', 
//           text: `FINAL CHECK FAILED: ${item.Item} - Cannot dispatch ${item.QTY_Dispatched} ${item.item?.uom1?.uom || 'pcs'} from batch "${item.Batch_Number}". Only ${availableStock} ${item.item?.uom1?.uom || 'pcs'} available!` 
//         });
//         return;
//       }
//     }
    
//     setLoading(true);

//     try {
//       const dispatchPayload = {
//         stockMain: {
//           Stock_Type_ID: 12,
//           COA_ID: dispatchData.COA_ID,
//           Date: dispatchData.Date,
//           Status: dispatchData.Status,
//           Purchase_Type: dispatchData.Dispatch_Type,
//           Order_Main_ID: salesOrder?.ID || null
//         },
//         stockDetails: itemsToDispatch.map(item => ({
//           Line_Id: item.Line_Id,
//           Item_ID: item.Item_ID,
//           batchno: item.Batch_Number,
//           Stock_Price: parseFloat(item.Stock_Price) || 0,
//           Stock_out_UOM_Qty: item.uom1_qty || 0,
//           Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//           Stock_out_UOM3_Qty: item.uom3_qty || 0
//         }))
//       };

//       const url = mode === 'edit' 
//         ? `http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`
//         : `http://${window.location.hostname}:4000/api/dispatch`;
      
//       const response = await fetch(url, {
//         method: mode === 'edit' ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dispatchPayload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
        
//         if (updateOrderStatus && salesOrder?.ID) {
//           try {
//             await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${salesOrder.ID}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: selectedOrderStatus.trim() })
//             });
//           } catch (statusError) {
//             console.warn('Error updating order status:', statusError);
//           }
//         }

//         setMessage({ 
//           type: 'success', 
//           text: `Dispatch ${mode === 'edit' ? 'updated' : 'created'} successfully!` 
//         });
        
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 1500);
        
//       } else {
//         setMessage({ type: 'error', text: result.error || `Failed to ${mode === 'edit' ? 'update' : 'create'} dispatch` });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: `Failed to ${mode === 'edit' ? 'update' : 'create'} dispatch` });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">
        
//         <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <h2 className="text-lg font-bold">
//             {mode === 'edit' ? `Edit Dispatch ${dispatchData.Dispatch_Number}` : 
//              mode === 'create' ? 'Create New Dispatch' : 
//              'Create Dispatch from Sales Order'}
//           </h2>
//           <button onClick={onClose} className="text-white text-xl">×</button>
//         </div>

//         {/* FIXED: Better error display */}
//         {message.text && (
//           <div className={`m-4 p-4 rounded border-l-4 ${
//             message.type === 'success' 
//               ? 'bg-green-50 text-green-800 border-green-400' 
//               : 'bg-red-50 text-red-800 border-red-400'
//           }`}>
//             <div className="flex items-start">
//               <div className="mr-3">
//                 {message.type === 'success' ? (
//                   <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 ) : (
//                   <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </div>
//               <div className="font-medium">{message.text}</div>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4">
//           <div className="bg-blue-50 p-4 rounded mb-4">
//             <h3 className="font-medium mb-3">Dispatch Information</h3>
            
//             <div className="grid grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Sales Order</label>
//                 <input
//                   type="text"
//                   value={dispatchData.Sales_Order_Number || 'Standalone Dispatch'}
//                   className="w-full p-2 bg-gray-100 border rounded"
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Dispatch Number</label>
//                 <input
//                   type="text"
//                   value={dispatchData.Dispatch_Number || 'Auto Generated'}
//                   className="w-full p-2 bg-gray-100 border rounded"
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Customer Name</label>
//                 {/* SIMPLE: Based on your API - Order_Main_ID null = editable, not null = readonly */}
//                 {isFromOrder ? (
//                   <input
//                     type="text"
//                     value={dispatchData.Name_of_Customer}
//                     className="w-full p-2 bg-gray-100 border rounded"
//                     disabled
//                   />
//                 ) : (
//                   <select
//                     value={dispatchData.COA_ID}
//                     onChange={(e) => {
//                       const customer = customers.find(c => c.id === parseInt(e.target.value));
//                       setDispatchData(prev => ({ 
//                         ...prev, 
//                         COA_ID: e.target.value,
//                         Name_of_Customer: customer?.acName || '' 
//                       }));
//                     }}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     <option value="">Select Customer</option>
//                     {customers.map(customer => (
//                       <option key={customer.id} value={customer.id}>
//                         {customer.acName}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={dispatchData.Date}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Status</label>
//                 <select
//                   value={dispatchData.Status}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Status: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="UnPost">UnPost</option>
//                   <option value="Post">Post</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Dispatch Type</label>
//                 <select
//                   value={dispatchData.Dispatch_Type}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Dispatch_Type: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="Local selling">Local Selling</option>
//                   <option value="Local">Local</option>
//                   <option value="Foreign">Foreign</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Order Status Update */}
//           {mode === 'fromOrder' && (
//             <div className="bg-green-50 p-4 rounded mb-4">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="updateOrderStatus"
//                   checked={updateOrderStatus}
//                   onChange={(e) => setUpdateOrderStatus(e.target.checked)}
//                   className="mr-2 w-4 h-4"
//                 />
//                 <label htmlFor="updateOrderStatus" className="text-sm">
//                   Update Sales Order Status After Dispatch
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

//           {/* FIXED: Stock info display */}
//           {mode === 'edit' && (
//             <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4 rounded">
//               <p className="text-sm text-orange-800">
//                 <strong>Edit Mode:</strong> Available stock includes your current dispatch quantities (Stock + Your Current Dispatch - Other Dispatches).
//               </p>
//             </div>
//           )}

//           {batchLoading && (
//             <div className="bg-blue-100 p-3 mb-4 rounded text-center">
//               <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full inline-block mr-2"></div>
//               <span className="text-blue-700">Loading available stock...</span>
//             </div>
//           )}

//           {/* Items Table */}
//           <div className="border rounded mb-4 overflow-hidden">
//             <div className="bg-gray-100 p-3 flex justify-between items-center">
//               <h3 className="font-medium">Items to Dispatch ({dispatchItems.length})</h3>
//               {mode === 'create' && (
//                 <button
//                   type="button"
//                   onClick={addNewItem}
//                   className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
//                 >
//                   + Add Item
//                 </button>
//               )}
//             </div>
            
//             <table className="w-full text-sm">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left">Line</th>
//                   <th className="px-3 py-2 text-left">Batch</th>
//                   <th className="px-3 py-2 text-left">Item</th>
//                   {mode === 'fromOrder' && (
//                     <>
//                       <th className="px-3 py-2 text-center bg-blue-200">Qty in SO</th>
//                       <th className="px-3 py-2 text-center bg-blue-200">UOM</th>
//                     </>
//                   )}
//                   <th className="px-3 py-2 text-center bg-orange-100">Available</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Dispatching</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Dispatched</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Price</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Total</th>
//                   <th className="px-3 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dispatchItems.map((item, index) => (
//                   <tr key={index} className={`border-b hover:bg-gray-50 ${item.isAdditionalBatch ? 'bg-yellow-50' : ''}`}>
//                     <td className="px-3 py-2 text-center font-medium">{item.Line_Id}</td>
                    
//                     <td className="px-3 py-2">
//                       <select
//                         value={item.Batch_Number}
//                         onChange={(e) => updateDispatchItem(index, 'Batch_Number', e.target.value)}
//                         className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-orange-500"
//                         required
//                       >
//                         <option value="">Select Batch ({getBatchOptions(item.Item_ID).length})</option>
//                         {getBatchOptions(item.Item_ID).map((batch, batchIndex) => (
//                           <option key={`${item.Item_ID}-${batch.batchno}-${batchIndex}`} value={batch.batchno}>
//                             {batch.batchno} (Stock: {batch.available_qty_uom1}{mode === 'edit' && batch.original_dispatched ? ` = ${batch.raw_stock} + ${batch.original_dispatched}` : ''})
//                           </option>
//                         ))}
//                       </select>
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
//                           onChange={(e) => updateDispatchItem(index, 'Item_ID', e.target.value)}
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
//                           {item.isOriginalRow ? item.Qty_in_SO : '-'}
//                         </td>
//                         <td className="px-3 py-2 text-center bg-blue-50">
//                           {item.isOriginalRow ? item.Uom_SO : '-'}
//                         </td>
//                       </>
//                     )}
                    
//                     <td className="px-3 py-2 text-center bg-orange-50">
//                       <div className={`font-bold ${
//                         getAvailableStock(item.Item_ID, item.Batch_Number) > 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {item.Batch_Number ? getAvailableStock(item.Item_ID, item.Batch_Number) : '-'}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {item.item?.uom1?.uom || 'pcs'}
//                       </div>
//                       {mode === 'edit' && item.Batch_Number && (
//                         <div className="text-xs text-blue-600">
//                           (Adjusted for edit)
//                         </div>
//                       )}
//                     </td>
                    
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
//                         isPurchase={false}
//                       />
//                     </td>
                    
//                     <td className="px-3 py-2 text-center bg-green-50 font-medium text-green-600">
//                       {item.QTY_Dispatched}
//                     </td>
                    
//                     <td className="px-3 py-2 bg-green-50">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Stock_Price || ''}
//                         onChange={(e) => updateDispatchItem(index, 'Stock_Price', e.target.value)}
//                         className="w-20 px-2 py-1 border rounded text-center"
//                       />
//                     </td>
                    
//                     <td className="px-3 py-2 text-center bg-green-50 font-medium">
//                       ${((item.QTY_Dispatched || 0) * (parseFloat(item.Stock_Price) || 0)).toFixed(2)}
//                     </td>
                    
//                     <td className="px-3 py-2 text-center">
//                       <div className="flex flex-col space-y-1">
//                         {mode === 'fromOrder' && item.isOriginalRow && (
//                           <button
//                             type="button"
//                             onClick={() => addNewBatchRow(index)}
//                             className="bg-green-600 text-white px-2 py-1 rounded text-xs"
//                           >
//                             + Batch
//                           </button>
//                         )}
                        
//                         {((mode === 'create' && dispatchItems.length > 1) || item.isAdditionalBatch) && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(index)}
//                             className="bg-red-600 text-white px-2 py-1 rounded text-xs"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
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
//             <button type="submit" disabled={loading || batchLoading} className="px-6 py-2 bg-green-600 text-white rounded">
//               {loading ? 'Processing...' : (mode === 'edit' ? 'Update Dispatch' : 'Create Dispatch')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DispatchModal;





















































































































// // THSI IS FULLY WORKING COMPONENT WITHOUT DISOUNT ADDED AD RADIO BUTTON ALWAYS UOM1



// // components/DispatchModal.jsx - COMPLETE WITH ALL MODES WORKING
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const DispatchModal = ({ 
//   salesOrder = null,      
//   dispatchId = null,      
//   mode = 'fromOrder',
//   onClose, 
//   onSuccess 
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [dispatchData, setDispatchData] = useState({
//     Sales_Order_Number: '',
//     Dispatch_ID: 'Auto Generated',
//     Dispatch_Number: 'Auto Generated', 
//     Name_of_Customer: '',
//     COA_ID: '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling'
//   });

//   const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
//   const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
//   const [dispatchItems, setDispatchItems] = useState([]);
  
//   const [availableBatches, setAvailableBatches] = useState({});
//   const [batchLoading, setBatchLoading] = useState(false);
  
//   const [customers, setCustomers] = useState([]);
//   const [items, setItems] = useState([]);
//   const [isFromOrder, setIsFromOrder] = useState(false);

//   useEffect(() => {
//     initializeModal();
//   }, [mode, salesOrder, dispatchId]);

//   const initializeModal = async () => {
//     if (mode === 'fromOrder' && salesOrder) {
//       setIsFromOrder(true);
//       initializeFromOrder();
//     } else if (mode === 'edit' && dispatchId) {
//       await loadExistingDispatch();
//     } else if (mode === 'create') {
//       setIsFromOrder(false);
//       await fetchCustomers();
//       await fetchItems();
//       initializeEmpty();
//     }
//   };

//   const initializeFromOrder = () => {
//     setDispatchData({
//       Sales_Order_Number: salesOrder.Number,
//       Dispatch_ID: 'Auto Generated',
//       Dispatch_Number: 'Auto Generated',
//       Name_of_Customer: salesOrder.account?.acName || '',
//       COA_ID: salesOrder.COA_ID,
//       Date: new Date().toISOString().split('T')[0],
//       Status: 'UnPost',
//       Dispatch_Type: 'Local selling'
//     });

//     const items = salesOrder.details.map((detail, index) => ({
//       Line_Id: detail.Line_Id || (index + 1),
//       Batch_Number: '',
//       Item: detail.item?.itemName || '',
//       Item_ID: detail.Item_ID,
//       Qty_in_SO: detail.uom1_qty || detail.Stock_out_UOM_Qty || 0,
//       Uom_SO: detail.item?.uom1?.uom || 'Pcs',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: parseFloat(detail.Price) || 0,
//       isOriginalRow: true,
//       item: detail.item
//     }));
//     setDispatchItems(items);
    
//     fetchBatchesNormal(items);
//   };

//   const loadExistingDispatch = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const dispatch = result.data;
        
//         const wasFromOrder = dispatch.Order_Main_ID !== null;
//         setIsFromOrder(wasFromOrder);
        
//         setDispatchData({
//           Sales_Order_Number: dispatch.order?.Number || 'Standalone Dispatch',
//           Dispatch_ID: dispatch.ID,
//           Dispatch_Number: dispatch.Number,
//           Name_of_Customer: dispatch.account?.acName || '',
//           COA_ID: dispatch.COA_ID,
//           Date: dispatch.Date.split('T')[0],
//           Status: dispatch.Status,
//           Dispatch_Type: dispatch.Purchase_Type
//         });

//         // FIXED: Show ALL items from dispatch (including 0 stock out)
//         const items = dispatch.details?.map((detail, index) => ({
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           QTY_Dispatched: detail.Stock_out_UOM_Qty || 0,
//           UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           sale_unit: 'uom1',
//           Stock_Price: detail.Stock_Price || 0,
//           isOriginalRow: true,
//           item: detail.item
//         })) || [];
        
//         setDispatchItems(items);
        
//         // Use edit-specific API
//         await fetchBatchesForEdit(items);

//         if (!wasFromOrder) {
//           await fetchCustomers();
//         }
//         await fetchItems();
//       }
      
//     } catch (error) {
//       console.error('Error loading dispatch:', error);
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   // FIXED: Updated create mode initialization
//   const initializeEmpty = () => {
//     setDispatchItems([{
//       Line_Id: 1,
//       Batch_Number: '',
//       Item: '',
//       Item_ID: '',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: 0,
//       isOriginalRow: true
//     }]);
//   };

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
//       const result = await response.json();
//       if (result.success) setCustomers(result.data);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
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

//   // Normal batch fetching for create/fromOrder
//   const fetchBatchesNormal = async (items) => {
//     setBatchLoading(true);
//     const batchData = {};

//     try {
//       for (const item of items) {
//         if (item.Item_ID) {
//           const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`);
//           const result = await response.json();
          
//           if (result.success && result.data) {
//             batchData[item.Item_ID] = result.data;
//           }
//         }
//       }
//       setAvailableBatches(batchData);
//     } catch (error) {
//       console.error('Error fetching batches:', error);
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   // FIXED: Edit mode batch fetching using new API
//   const fetchBatchesForEdit = async (items) => {
//     setBatchLoading(true);
//     const batchData = {};

//     try {
//       for (const item of items) {
//         if (item.Item_ID) {
//           // Use edit-specific API endpoint
//           const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches-edit/${item.Item_ID}/${dispatchId}`);
//           const result = await response.json();
          
//           if (result.success && result.data) {
//             batchData[item.Item_ID] = result.data;
//           }
//         }
//       }
//       setAvailableBatches(batchData);
//     } catch (error) {
//       console.error('Error fetching edit batches:', error);
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   // FIXED: For create mode when item is selected
//   const fetchBatchesForSingleItem = async (itemId) => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${itemId}`);
//       const result = await response.json();
      
//       if (result.success && result.data) {
//         setAvailableBatches(prev => ({ ...prev, [itemId]: result.data }));
//       }
//     } catch (error) {
//       console.error(`Error fetching batches for item ${itemId}:`, error);
//     }
//   };

//   // const handleUomChange = (index, values) => {
//   //   const updated = [...dispatchItems];
//   //   const item = updated[index];
    
//   //   const requestedQty = parseFloat(values.uom1_qty) || 0;
//   //   const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
    
//   //   // FIXED: Only validate for create/fromOrder modes, NOT edit mode
//   //   if (mode !== 'edit' && item.Batch_Number && requestedQty > availableStock && availableStock > 0) {
//   //     setMessage({ 
//   //       type: 'error', 
//   //       text: `Cannot dispatch ${requestedQty} from ${item.Batch_Number}. Available: ${availableStock}` 
//   //     });
//   //     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//   //     return;
//   //   }

//   //   setMessage({ type: '', text: '' });

//   //   updated[index] = {
//   //     ...updated[index],
//   //     uom1_qty: values.uom1_qty || 0,
//   //     uom2_qty: values.uom2_qty || 0,
//   //     uom3_qty: values.uom3_qty || 0,
//   //     QTY_Dispatched: values.uom1_qty || 0,
//   //     sale_unit: values.sale_unit || 'uom1',
//   //     UOM_Dispatched: values.sale_unit === 'uomTwo' ? updated[index].item?.uomTwo?.uom :
//   //                    values.sale_unit === 'uomThree' ? updated[index].item?.uomThree?.uom :
//   //                    updated[index].item?.uom1?.uom || 'Pcs'
//   //   };
//   //   setDispatchItems(updated);
//   // };








// const handleUomChange = (index, values) => {
//   const updated = [...dispatchItems];
//   const item = updated[index];

//   const requestedQty = parseFloat(values.uom1_qty) || 0;
//   const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);

//   if (mode !== 'edit' && item.Batch_Number && requestedQty > availableStock && availableStock > 0) {
//     setMessage({ 
//       type: 'error', 
//       text: `Cannot dispatch ${requestedQty} from ${item.Batch_Number}. Available: ${availableStock}` 
//     });
//     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//     return;
//   }

//   setMessage({ type: '', text: '' });

//   updated[index] = {
//     ...updated[index],
//     uom1_qty: values.uom1_qty || 0,
//     uom2_qty: values.uom2_qty || 0,
//     uom3_qty: values.uom3_qty || 0,
//     QTY_Dispatched: values.uom1_qty || 0,
//     sale_unit: values.sale_unit || 'uom1',  // Save selected sale unit here
//     UOM_Dispatched: values.sale_unit === 'uomTwo' ? updated[index].item?.uomTwo?.uom :
//                    values.sale_unit === 'uomThree' ? updated[index].item?.uomThree?.uom :
//                    updated[index].item?.uom1?.uom || 'Pcs'
//   };
//   setDispatchItems(updated);
// };















//   const updateDispatchItem = (index, field, value) => {
//     const updated = [...dispatchItems];
    
//     if (field === 'Item_ID' && mode === 'create') {
//       const selectedItem = items.find(item => item.id === parseInt(value));
//       updated[index].Item = selectedItem?.itemName || '';
//       updated[index].Item_ID = value;
//       updated[index].item = selectedItem;
      
//       if (selectedItem) {
//         fetchBatchesForSingleItem(selectedItem.id);
//       }
//     } else if (field === 'Stock_Price') {
//       updated[index][field] = parseFloat(value) || 0;
//     } else {
//       updated[index][field] = value;
//     }

//     setDispatchItems(updated);
//   };

//   // FIXED: Add new batch row (works for both fromOrder and edit modes)
//   const addNewBatchRow = (originalIndex) => {
//     const originalItem = dispatchItems[originalIndex];
//     const newRow = {
//       Line_Id: parseFloat(originalItem.Line_Id) + 0.1 + (Math.random() * 0.01),
//       Batch_Number: '',
//       Item: `${originalItem.Item} (Additional Batch)`,
//       Item_ID: originalItem.Item_ID,
//       Qty_in_SO: 0,
//       Uom_SO: '-',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: originalItem.UOM_Dispatched,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: originalItem.Stock_Price,
//       isOriginalRow: false,
//       isAdditionalBatch: true,
//       item: originalItem.item
//     };

//     const newItems = [...dispatchItems];
//     newItems.splice(originalIndex + 1, 0, newRow);
//     setDispatchItems(newItems);
//   };

//   // FIXED: Add new item for create mode
//   const addNewItem = () => {
//     setDispatchItems([
//       ...dispatchItems,
//       {
//         Line_Id: dispatchItems.length + 1,
//         Batch_Number: '',
//         Item: '',
//         Item_ID: '',
//         QTY_Dispatched: 0,
//         UOM_Dispatched: 'Pcs',
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 'uom1',
//         Stock_Price: 0,
//         isOriginalRow: true
//       }
//     ]);
//   };

//   // FIXED: Remove item (works for all applicable cases)
//   const removeItem = (index) => {
//     if (dispatchItems.length > 1) {
//       setDispatchItems(dispatchItems.filter((_, i) => i !== index));
//     }
//   };

//   const getAvailableStock = (itemId, batchno) => {
//     if (!itemId || !batchno) return 0;
//     const batches = availableBatches[itemId] || [];
//     const batch = batches.find(b => b.batchno === batchno);
//     return batch ? parseFloat(batch.available_qty_uom1) || 0 : 0;
//   };

//   const getBatchOptions = (itemId) => {
//     const batches = availableBatches[itemId] || [];
//     // FIXED: For create/fromOrder, filter out 0 stock; for edit, show all
//     if (mode === 'edit') {
//       return batches; // Show all batches in edit mode
//     } else {
//       return batches.filter(batch => parseFloat(batch.available_qty_uom1) > 0);
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
    
//   //   if (mode === 'create' && !dispatchData.COA_ID) {
//   //     setMessage({ type: 'error', text: 'Please select a customer' });
//   //     return;
//   //   }

//   //   // FIXED: Different submission logic for different modes
//   //   let itemsToSubmit;
//   //   if (mode === 'edit') {
//   //     // Edit mode: Submit ALL items (including 0 quantities)
//   //     itemsToSubmit = dispatchItems;
//   //   } else {
//   //     // Create/fromOrder: Only submit items with quantities
//   //     itemsToSubmit = dispatchItems.filter(item => item.QTY_Dispatched > 0);
//   //   }

//   //   if (itemsToSubmit.length === 0) {
//   //     setMessage({ type: 'error', text: 'No items to process' });
//   //     return;
//   //   }

//   //   // Check batch selection for items with quantities
//   //   const itemsWithQuantity = itemsToSubmit.filter(item => item.QTY_Dispatched > 0);
//   //   const missingBatch = itemsWithQuantity.find(item => !item.Batch_Number);
//   //   if (missingBatch) {
//   //     setMessage({ type: 'error', text: `Please select batch for: ${missingBatch.Item}` });
//   //     return;
//   //   }

//   //   // Stock validation only for create/fromOrder
//   //   if (mode !== 'edit') {
//   //     for (const item of itemsWithQuantity) {
//   //       const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
//   //       if (item.QTY_Dispatched > availableStock) {
//   //         setMessage({ 
//   //           type: 'error', 
//   //           text: `${item.Item}: Cannot dispatch ${item.QTY_Dispatched}, only ${availableStock} available in ${item.Batch_Number}` 
//   //         });
//   //         return;
//   //       }
//   //     }
//   //   }
    
//   //   setLoading(true);

//   //   try {
//   //     const dispatchPayload = {
//   //       stockMain: {
//   //         Stock_Type_ID: 12,
//   //         COA_ID: dispatchData.COA_ID,
//   //         Date: dispatchData.Date,
//   //         Status: dispatchData.Status,
//   //         Purchase_Type: dispatchData.Dispatch_Type,
//   //         Order_Main_ID: salesOrder?.ID || null
//   //       },
//   //       stockDetails: itemsToSubmit.map(item => ({
//   //         Line_Id: item.Line_Id,
//   //         Item_ID: item.Item_ID,
//   //         batchno: item.Batch_Number,
//   //         Stock_Price: parseFloat(item.Stock_Price) || 0,
//   //         Stock_out_UOM_Qty: item.uom1_qty || 0,
//   //         Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//   //         Stock_out_UOM3_Qty: item.uom3_qty || 0
//   //       }))
//   //     };

//   //     const url = mode === 'edit' 
//   //       ? `http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`
//   //       : `http://${window.location.hostname}:4000/api/dispatch`;
      
//   //     const response = await fetch(url, {
//   //       method: mode === 'edit' ? 'PUT' : 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(dispatchPayload)
//   //     });

//   //     const result = await response.json();

//   //     if (response.ok && result.success) {
//   //       if (updateOrderStatus && salesOrder?.ID) {
//   //         try {
//   //           await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${salesOrder.ID}`, {
//   //             method: 'PUT',
//   //             headers: { 'Content-Type': 'application/json' },
//   //             body: JSON.stringify({ status: selectedOrderStatus.trim() })
//   //           });
//   //         } catch (statusError) {
//   //           console.warn('Error updating order status:', statusError);
//   //         }
//   //       }

//   //       setMessage({ type: 'success', text: `Dispatch ${mode === 'edit' ? 'updated' : 'created'} successfully!` });
//   //       setTimeout(() => {
//   //         onSuccess();
//   //         onClose();
//   //       }, 1500);
//   //     } else {
//   //       setMessage({ type: 'error', text: result.error || 'Failed to process dispatch' });
//   //     }
//   //   } catch (error) {
//   //     setMessage({ type: 'error', text: 'Failed to process dispatch' });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };














// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (mode === 'create' && !dispatchData.COA_ID) {
//     setMessage({ type: 'error', text: 'Please select a customer' });
//     return;
//   }

//   let itemsToSubmit;
//   if (mode === 'edit') {
//     itemsToSubmit = dispatchItems;
//   } else {
//     itemsToSubmit = dispatchItems.filter(item => item.QTY_Dispatched > 0);
//   }

//   if (itemsToSubmit.length === 0) {
//     setMessage({ type: 'error', text: 'No items to process' });
//     return;
//   }

//   const itemsWithQuantity = itemsToSubmit.filter(item => item.QTY_Dispatched > 0);
//   const missingBatch = itemsWithQuantity.find(item => !item.Batch_Number);
//   if (missingBatch) {
//     setMessage({ type: 'error', text: `Please select batch for: ${missingBatch.Item}` });
//     return;
//   }

//   if (mode !== 'edit') {
//     for (const item of itemsWithQuantity) {
//       const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
//       if (item.QTY_Dispatched > availableStock) {
//         setMessage({ 
//           type: 'error', 
//           text: `${item.Item}: Cannot dispatch ${item.QTY_Dispatched}, only ${availableStock} available in ${item.Batch_Number}` 
//         });
//         return;
//       }
//     }
//   }

//   setLoading(true);

//   try {
//     const dispatchPayload = {
//       stockMain: {
//         Stock_Type_ID: 12,
//         COA_ID: dispatchData.COA_ID,
//         Date: dispatchData.Date,
//         Status: dispatchData.Status,
//         Purchase_Type: dispatchData.Dispatch_Type,
//         Order_Main_ID: salesOrder?.ID || null
//       },
//       stockDetails: itemsToSubmit.map(item => ({
//         Line_Id: item.Line_Id,
//         Item_ID: item.Item_ID,
//         batchno: item.Batch_Number,
//         Stock_Price: parseFloat(item.Stock_Price) || 0,
//         Stock_out_UOM_Qty: item.uom1_qty || 0,
//         Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//         Stock_out_UOM3_Qty: item.uom3_qty || 0,
//         Sale_Unit: item.sale_unit || 'uom1'  // <-- Important: add Sale_Unit here
//       }))
//     };

//     const url = mode === 'edit' 
//       ? `http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`
//       : `http://${window.location.hostname}:4000/api/dispatch`;

//     const response = await fetch(url, {
//       method: mode === 'edit' ? 'PUT' : 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(dispatchPayload)
//     });

//     const result = await response.json();

//     if (response.ok && result.success) {
//       if (updateOrderStatus && salesOrder?.ID) {
//         try {
//           await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${salesOrder.ID}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ status: selectedOrderStatus.trim() })
//           });
//         } catch (statusError) {
//           console.warn('Error updating order status:', statusError);
//         }
//       }

//       setMessage({ type: 'success', text: `Dispatch ${mode === 'edit' ? 'updated' : 'created'} successfully!` });
//       setTimeout(() => {
//         onSuccess();
//         onClose();
//       }, 1500);
//     } else {
//       setMessage({ type: 'error', text: result.error || 'Failed to process dispatch' });
//     }
//   } catch (error) {
//     setMessage({ type: 'error', text: 'Failed to process dispatch' });
//   } finally {
//     setLoading(false);
//   }
// };























  

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full mr-3"></div>
//             <span>Loading dispatch data...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">
        
//         <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <div>
//             <h2 className="text-xl font-bold">
//               {mode === 'edit' ? `Edit Dispatch ${dispatchData.Dispatch_Number}` : 
//                mode === 'create' ? 'Create New Dispatch' : 
//                'Create Dispatch from Sales Order'}
//             </h2>
//             {mode === 'fromOrder' && salesOrder && <p className="text-sm opacity-90">From SO: {salesOrder.Number}</p>}
//             {mode === 'edit' && <p className="text-sm opacity-90">ID: {dispatchId}</p>}
//           </div>
//           <button onClick={onClose} className="text-white text-2xl">×</button>
//         </div>

//         {message.text && (
//           <div className={`m-4 p-3 rounded ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4">
//           {/* Dispatch Info */}
//           <div className="bg-blue-50 p-4 rounded mb-4">
//             <h3 className="font-bold mb-3">Dispatch Information</h3>
            
//             <div className="grid grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Sales Order</label>
//                 <input value={dispatchData.Sales_Order_Number || (mode === 'create' ? 'Standalone' : 'N/A')} className="w-full p-2 bg-gray-100 border rounded" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Dispatch Number</label>
//                 <input value={dispatchData.Dispatch_Number || 'Auto Generated'} className="w-full p-2 bg-gray-100 border rounded" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Customer</label>
//                 {isFromOrder ? (
//                   <input value={dispatchData.Name_of_Customer} className="w-full p-2 bg-gray-100 border rounded" disabled />
//                 ) : (
//                   <select
//                     value={dispatchData.COA_ID}
//                     onChange={(e) => {
//                       const customer = customers.find(c => c.id === parseInt(e.target.value));
//                       setDispatchData(prev => ({ ...prev, COA_ID: e.target.value, Name_of_Customer: customer?.acName || '' }));
//                     }}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     <option value="">Select Customer</option>
//                     {customers.map(customer => (
//                       <option key={customer.id} value={customer.id}>{customer.acName}</option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={dispatchData.Date}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Order Status Update */}
//           {mode === 'fromOrder' && (
//             <div className="bg-green-50 p-4 rounded mb-4">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={updateOrderStatus}
//                   onChange={(e) => setUpdateOrderStatus(e.target.checked)}
//                   className="mr-2"
//                 />
//                 Update Sales Order Status
//                 {updateOrderStatus && (
//                   <select value={selectedOrderStatus} onChange={(e) => setSelectedOrderStatus(e.target.value)} className="ml-4 px-3 py-1 border rounded">
//                     <option value="Partial">Partial</option>
//                     <option value="Complete">Complete</option>
//                   </select>
//                 )}
//               </label>
//             </div>
//           )}

//           {/* Items Table */}
//           <div className="border rounded mb-4 overflow-hidden">
//             <div className="bg-gray-100 p-3 flex justify-between items-center">
//               <h3 className="font-bold">Items to Dispatch ({dispatchItems.length})</h3>
//               {mode === 'create' && (
//                 <button type="button" onClick={addNewItem} className="bg-green-600 text-white px-3 py-1 rounded">
//                   + Add Item
//                 </button>
//               )}
//             </div>
            
//             <table className="w-full text-sm">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left">Line</th>
//                   <th className="px-3 py-2 text-left">Batch</th>
//                   <th className="px-3 py-2 text-left">Item</th>
//                   {mode === 'fromOrder' && (
//                     <>
//                       <th className="px-3 py-2 text-center bg-blue-200">SO Qty</th>
//                       <th className="px-3 py-2 text-center bg-blue-200">UOM</th>
//                     </>
//                   )}
//                   <th className="px-3 py-2 text-center bg-orange-100">Available</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Quantity</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Price</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Total</th>
//                   <th className="px-3 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dispatchItems.map((item, index) => (
//                   <tr key={index} className={`border-b ${item.isAdditionalBatch ? 'bg-yellow-50' : ''}`}>
//                     <td className="px-3 py-2 text-center">{item.Line_Id}</td>
                    
//                     <td className="px-3 py-2">
//                       <select
//                         value={item.Batch_Number}
//                         onChange={(e) => updateDispatchItem(index, 'Batch_Number', e.target.value)}
//                         className="w-full px-2 py-1 border rounded"
//                         required={item.QTY_Dispatched > 0}
//                       >
//                         <option value="">{batchLoading ? 'Loading...' : `Select Batch (${getBatchOptions(item.Item_ID).length})`}</option>
//                         {getBatchOptions(item.Item_ID).map((batch, bIdx) => (
//                           <option key={bIdx} value={batch.batchno}>
//                             {batch.batchno} - Stock: {batch.available_qty_uom1}
//                             {mode === 'edit' && batch.current_dispatch_uom1 > 0 && ` (+${batch.current_dispatch_uom1} current)`}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
                    
//                     <td className="px-3 py-2">
//                       {isFromOrder ? (
//                         <div className="bg-gray-100 p-2 rounded">{item.Item}</div>
//                       ) : (
//                         <select
//                           value={item.Item_ID}
//                           onChange={(e) => updateDispatchItem(index, 'Item_ID', e.target.value)}
//                           className="w-full px-2 py-1 border rounded"
//                           required
//                         >
//                           <option value="">Select Item</option>
//                           {items.map(itm => (
//                             <option key={itm.id} value={itm.id}>{itm.itemName}</option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
                    
//                     {mode === 'fromOrder' && (
//                       <>
//                         <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Qty_in_SO : '-'}</td>
//                         <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Uom_SO : '-'}</td>
//                       </>
//                     )}
                    
//                     <td className="px-3 py-2 text-center bg-orange-50">
//                       <div className={`font-bold ${getAvailableStock(item.Item_ID, item.Batch_Number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                         {item.Batch_Number ? getAvailableStock(item.Item_ID, item.Batch_Number) : '-'}
//                       </div>
//                     </td>
                    
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
//                         isPurchase={false}
//                       />
//                     </td>
                    
//                     <td className="px-3 py-2 bg-green-50">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Stock_Price || ''}
//                         onChange={(e) => updateDispatchItem(index, 'Stock_Price', e.target.value)}
//                         className="w-20 px-2 py-1 border rounded text-center"
//                       />
//                     </td>
                    
//                     <td className="px-3 py-2 text-center bg-green-50 font-bold">
//                       ${((item.QTY_Dispatched || 0) * (parseFloat(item.Stock_Price) || 0)).toFixed(2)}
//                     </td>
                    
//                     <td className="px-3 py-2 text-center">
//                       <div className="flex flex-col space-y-1">
//                         {/* FIXED: Batch+ button for fromOrder AND edit modes */}
//                         {((mode === 'fromOrder' || mode === 'edit') && item.isOriginalRow) && (
//                           <button
//                             type="button"
//                             onClick={() => addNewBatchRow(index)}
//                             className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
//                             title="Add additional batch for same item"
//                           >
//                             + Batch
//                           </button>
//                         )}
                        
//                         {/* FIXED: Delete button for all modes with proper conditions */}
//                         {(
//                           (mode === 'create' && dispatchItems.length > 1) ||
//                           (mode === 'edit' && dispatchItems.length > 1) ||
//                           (mode === 'fromOrder' && item.isAdditionalBatch) ||
//                           item.isAdditionalBatch
//                         ) && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(index)}
//                             className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
//                             title="Remove this item/batch"
//                           >
//                             {item.isAdditionalBatch ? 'Remove' : 'Delete'}
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-400 text-white rounded">
//               Cancel
//             </button>
//             <button type="submit" disabled={loading || batchLoading} className="px-6 py-2 bg-green-600 text-white rounded">
//               {loading ? 'Processing...' : (mode === 'edit' ? 'Update Dispatch' : 'Create Dispatch')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DispatchModal;





























































































// // THIS IS OK BUT  LITTLE ISSUE IN THE TOTAL = PRCIE  * SLECTED


// // components/DispatchModal.jsx - COMPLETE WITH ALL FIXES
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const DispatchModal = ({ 
//   salesOrder = null,      
//   dispatchId = null,      
//   mode = 'fromOrder',
//   onClose, 
//   onSuccess 
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [dispatchData, setDispatchData] = useState({
//     Sales_Order_Number: '',
//     Dispatch_ID: 'Auto Generated',
//     Dispatch_Number: 'Auto Generated', 
//     Name_of_Customer: '',
//     COA_ID: '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling'
//   });

//   const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
//   const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
//   const [dispatchItems, setDispatchItems] = useState([]);
  
//   const [availableBatches, setAvailableBatches] = useState({});
//   const [batchLoading, setBatchLoading] = useState(false);
  
//   const [customers, setCustomers] = useState([]);
//   const [items, setItems] = useState([]);
//   const [isFromOrder, setIsFromOrder] = useState(false);

//   // FIXED: Helper functions to map between UOM IDs and radio button values
//   const getSaleUnitId = (saleUnit, item) => {
//     if (!saleUnit || !item) return null;
//     switch (saleUnit) {
//       case 'uom1': return item?.uom1?.id || null;
//       case 'uomTwo': return item?.uomTwo?.id || null;
//       case 'uomThree': return item?.uomThree?.id || null;
//       default: return item?.uom1?.id || null;
//     }
//   };

//   // FIXED: Map UOM ID back to radio button value (this was missing!)
//   const getSaleUnitRadioValue = (saleUnitId, item) => {
//     if (!saleUnitId || !item) return 'uom1';
//     const id = parseInt(saleUnitId);
//     if (id === item?.uom1?.id) return 'uom1';
//     if (id === item?.uomTwo?.id) return 'uomTwo';
//     if (id === item?.uomThree?.id) return 'uomThree';
//     return 'uom1';
//   };

//   useEffect(() => {
//     initializeModal();
//   }, [mode, salesOrder, dispatchId]);

//   const initializeModal = async () => {
//     if (mode === 'fromOrder' && salesOrder) {
//       setIsFromOrder(true);
//       initializeFromOrder();
//     } else if (mode === 'edit' && dispatchId) {
//       await loadExistingDispatch();
//     } else if (mode === 'create') {
//       setIsFromOrder(false);
//       await fetchCustomers();
//       await fetchItems();
//       initializeEmpty();
//     }
//   };

//   const initializeFromOrder = () => {
//     setDispatchData({
//       Sales_Order_Number: salesOrder.Number,
//       Dispatch_ID: 'Auto Generated',
//       Dispatch_Number: 'Auto Generated',
//       Name_of_Customer: salesOrder.account?.acName || '',
//       COA_ID: salesOrder.COA_ID,
//       Date: new Date().toISOString().split('T')[0],
//       Status: 'UnPost',
//       Dispatch_Type: 'Local selling'
//     });

//     const items = salesOrder.details.map((detail, index) => ({
//       Line_Id: detail.Line_Id || (index + 1),
//       Batch_Number: '',
//       Item: detail.item?.itemName || '',
//       Item_ID: detail.Item_ID,
//       Qty_in_SO: detail.uom1_qty || detail.Stock_out_UOM_Qty || 0,
//       Uom_SO: detail.item?.uom1?.uom || 'Pcs',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: detail.sale_unit || 'uom1',
//       Stock_Price: parseFloat(detail.Price) || 0,
//       isOriginalRow: true,
//       item: detail.item,
//       // FIXED: Add discount fields from order
//       discountA: parseFloat(detail.Discount_A) || 0,
//       discountB: parseFloat(detail.Discount_B) || 0,
//       discountC: parseFloat(detail.Discount_C) || 0
//     }));
//     setDispatchItems(items);
    
//     fetchBatchesNormal(items);
//   };

//   const loadExistingDispatch = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const dispatch = result.data;
        
//         const wasFromOrder = dispatch.Order_Main_ID !== null;
//         setIsFromOrder(wasFromOrder);
        
//         setDispatchData({
//           Sales_Order_Number: dispatch.order?.Number || 'Standalone Dispatch',
//           Dispatch_ID: dispatch.ID,
//           Dispatch_Number: dispatch.Number,
//           Name_of_Customer: dispatch.account?.acName || '',
//           COA_ID: dispatch.COA_ID,
//           Date: dispatch.Date.split('T')[0],
//           Status: dispatch.Status,
//           Dispatch_Type: dispatch.Purchase_Type
//         });

//         // FIXED: Restore correct radio button by mapping UOM ID to radio value
//         const items = dispatch.details?.map((detail, index) => ({
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           QTY_Dispatched: detail.Stock_out_UOM_Qty || 0,
//           UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           // FIXED: Map stored UOM ID (Sale_Unit) back to radio value
//           sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
//           Stock_Price: detail.Stock_Price || 0,
//           isOriginalRow: true,
//           item: detail.item,
//           // FIXED: Add discount fields
//           discountA: parseFloat(detail.Discount_A) || 0,
//           discountB: parseFloat(detail.Discount_B) || 0,
//           discountC: parseFloat(detail.Discount_C) || 0
//         })) || [];
        
//         setDispatchItems(items);
        
//         await fetchBatchesForEdit(items);

//         if (!wasFromOrder) {
//           await fetchCustomers();
//         }
//         await fetchItems();
//       }
      
//     } catch (error) {
//       console.error('Error loading dispatch:', error);
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const initializeEmpty = () => {
//     setDispatchItems([{
//       Line_Id: 1,
//       Batch_Number: '',
//       Item: '',
//       Item_ID: '',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: 0,
//       isOriginalRow: true,
//       discountA: 0,
//       discountB: 0,
//       discountC: 0
//     }]);
//   };

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
//       const result = await response.json();
//       if (result.success) setCustomers(result.data);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
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

//   const fetchBatchesNormal = async (items) => {
//     setBatchLoading(true);
//     const batchData = {};

//     try {
//       for (const item of items) {
//         if (item.Item_ID) {
//           const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`);
//           const result = await response.json();
          
//           if (result.success && result.data) {
//             batchData[item.Item_ID] = result.data;
//           }
//         }
//       }
//       setAvailableBatches(batchData);
//     } catch (error) {
//       console.error('Error fetching batches:', error);
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   const fetchBatchesForEdit = async (items) => {
//     setBatchLoading(true);
//     const batchData = {};

//     try {
//       for (const item of items) {
//         if (item.Item_ID) {
//           const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches-edit/${item.Item_ID}/${dispatchId}`);
//           const result = await response.json();
          
//           if (result.success && result.data) {
//             batchData[item.Item_ID] = result.data;
//           }
//         }
//       }
//       setAvailableBatches(batchData);
//     } catch (error) {
//       console.error('Error fetching edit batches:', error);
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   const fetchBatchesForSingleItem = async (itemId) => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${itemId}`);
//       const result = await response.json();
      
//       if (result.success && result.data) {
//         setAvailableBatches(prev => ({ ...prev, [itemId]: result.data }));
//       }
//     } catch (error) {
//       console.error(`Error fetching batches for item ${itemId}:`, error);
//     }
//   };

//   const handleUomChange = (index, values) => {
//     const updated = [...dispatchItems];
//     const item = updated[index];
    
//     const requestedQty = parseFloat(values.uom1_qty) || 0;
//     const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
    
//     if (mode !== 'edit' && item.Batch_Number && requestedQty > availableStock && availableStock > 0) {
//       setMessage({ 
//         type: 'error', 
//         text: `Cannot dispatch ${requestedQty} from ${item.Batch_Number}. Available: ${availableStock}` 
//       });
//       setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//       return;
//     }

//     setMessage({ type: '', text: '' });

//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Dispatched: values.uom1_qty || 0,
//       sale_unit: values.sale_unit || 'uom1',
//       UOM_Dispatched: values.sale_unit === 'uomTwo' ? updated[index].item?.uomTwo?.uom :
//                      values.sale_unit === 'uomThree' ? updated[index].item?.uomThree?.uom :
//                      updated[index].item?.uom1?.uom || 'Pcs'
//     };
//     setDispatchItems(updated);
//   };

//   const updateDispatchItem = (index, field, value) => {
//     const updated = [...dispatchItems];
    
//     if (field === 'Item_ID' && mode === 'create') {
//       const selectedItem = items.find(item => item.id === parseInt(value));
//       updated[index].Item = selectedItem?.itemName || '';
//       updated[index].Item_ID = value;
//       updated[index].item = selectedItem;
      
//       if (selectedItem) {
//         fetchBatchesForSingleItem(selectedItem.id);
//       }
//     } else if (field === 'Stock_Price') {
//       updated[index][field] = parseFloat(value) || 0;
//     } else {
//       updated[index][field] = value;
//     }

//     setDispatchItems(updated);
//   };

//   const addNewBatchRow = (originalIndex) => {
//     const originalItem = dispatchItems[originalIndex];
//     const newRow = {
//       Line_Id: parseFloat(originalItem.Line_Id) + 0.1 + (Math.random() * 0.01),
//       Batch_Number: '',
//       Item: `${originalItem.Item} (Additional Batch)`,
//       Item_ID: originalItem.Item_ID,
//       Qty_in_SO: 0,
//       Uom_SO: '-',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: originalItem.UOM_Dispatched,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: originalItem.Stock_Price,
//       isOriginalRow: false,
//       isAdditionalBatch: true,
//       item: originalItem.item,
//       discountA: originalItem.discountA || 0,
//       discountB: originalItem.discountB || 0,
//       discountC: originalItem.discountC || 0
//     };

//     const newItems = [...dispatchItems];
//     newItems.splice(originalIndex + 1, 0, newRow);
//     setDispatchItems(newItems);
//   };

//   const addNewItem = () => {
//     setDispatchItems([
//       ...dispatchItems,
//       {
//         Line_Id: dispatchItems.length + 1,
//         Batch_Number: '',
//         Item: '',
//         Item_ID: '',
//         QTY_Dispatched: 0,
//         UOM_Dispatched: 'Pcs',
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 'uom1',
//         Stock_Price: 0,
//         isOriginalRow: true,
//         discountA: 0,
//         discountB: 0,
//         discountC: 0
//       }
//     ]);
//   };

//   const removeItem = (index) => {
//     if (dispatchItems.length > 1) {
//       setDispatchItems(dispatchItems.filter((_, i) => i !== index));
//     }
//   };

//   const getAvailableStock = (itemId, batchno) => {
//     if (!itemId || !batchno) return 0;
//     const batches = availableBatches[itemId] || [];
//     const batch = batches.find(b => b.batchno === batchno);
//     return batch ? parseFloat(batch.available_qty_uom1) || 0 : 0;
//   };

//   const getBatchOptions = (itemId) => {
//     const batches = availableBatches[itemId] || [];
//     if (mode === 'edit') {
//       return batches;
//     } else {
//       return batches.filter(batch => parseFloat(batch.available_qty_uom1) > 0);
//     }
//   };

//   // FIXED: Total calculation based on selected sale unit quantity and price
//   // const calculateTotal = (item) => {
//   //   const price = parseFloat(item.Stock_Price) || 0;
//   //   let quantity = 0;
    
//   //   // Use the quantity based on selected sale unit
//   //   switch (item.sale_unit) {
//   //     case 'uom1':
//   //       quantity = parseFloat(item.uom1_qty) || 0;
//   //       break;
//   //     case 'uomTwo':
//   //       quantity = parseFloat(item.uom2_qty) || 0;
//   //       break;
//   //     case 'uomThree':
//   //       quantity = parseFloat(item.uom3_qty) || 0;
//   //       break;
//   //     default:
//   //       quantity = parseFloat(item.uom1_qty) || 0;
//   //   }
    
//   //   return (price * quantity).toFixed(2);
//   // };



// // FIXED: Total = Price * UOM2 quantity (always use uom2_qty)
// const calculateTotal = (item) => {
//   const price = parseFloat(item.Stock_Price) || 0;
//   const uom2Quantity = parseFloat(item.uom2_qty) || 0;
  
//   return (price * uom2Quantity).toFixed(2);
// };




//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (mode === 'create' && !dispatchData.COA_ID) {
//       setMessage({ type: 'error', text: 'Please select a customer' });
//       return;
//     }

//     let itemsToSubmit;
//     if (mode === 'edit') {
//       itemsToSubmit = dispatchItems;
//     } else {
//       itemsToSubmit = dispatchItems.filter(item => item.QTY_Dispatched > 0);
//     }

//     if (itemsToSubmit.length === 0) {
//       setMessage({ type: 'error', text: 'No items to process' });
//       return;
//     }

//     const itemsWithQuantity = itemsToSubmit.filter(item => item.QTY_Dispatched > 0);
//     const missingBatch = itemsWithQuantity.find(item => !item.Batch_Number);
//     if (missingBatch) {
//       setMessage({ type: 'error', text: `Please select batch for: ${missingBatch.Item}` });
//       return;
//     }

//     if (mode !== 'edit') {
//       for (const item of itemsWithQuantity) {
//         const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
//         if (item.QTY_Dispatched > availableStock) {
//           setMessage({ 
//             type: 'error', 
//             text: `${item.Item}: Cannot dispatch ${item.QTY_Dispatched}, only ${availableStock} available in ${item.Batch_Number}` 
//           });
//           return;
//         }
//       }
//     }
    
//     setLoading(true);

//     try {
//       const dispatchPayload = {
//         stockMain: {
//           Stock_Type_ID: 12,
//           COA_ID: dispatchData.COA_ID,
//           Date: dispatchData.Date,
//           Status: dispatchData.Status,
//           Purchase_Type: dispatchData.Dispatch_Type,
//           Order_Main_ID: salesOrder?.ID || null
//         },
//         stockDetails: itemsToSubmit.map(item => ({
//           Line_Id: item.Line_Id,
//           Item_ID: item.Item_ID,
//           batchno: item.Batch_Number,
//           Stock_Price: parseFloat(item.Stock_Price) || 0,
//           Stock_out_UOM_Qty: item.uom1_qty || 0,
//           Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//           Stock_out_UOM3_Qty: item.uom3_qty || 0,
//           // FIXED: Store UOM ID (not string) in Sale_Unit
//           Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
//           // FIXED: Include discount fields
//           Discount_A: item.discountA || 0,
//           Discount_B: item.discountB || 0,
//           Discount_C: item.discountC || 0
//         }))
//       };

//       console.log('📤 Dispatch Payload with Sale_Unit ID:', dispatchPayload);

//       const url = mode === 'edit' 
//         ? `http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`
//         : `http://${window.location.hostname}:4000/api/dispatch`;
      
//       const response = await fetch(url, {
//         method: mode === 'edit' ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dispatchPayload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         if (updateOrderStatus && salesOrder?.ID) {
//           try {
//             await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${salesOrder.ID}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: selectedOrderStatus.trim() })
//             });
//           } catch (statusError) {
//             console.warn('Error updating order status:', statusError);
//           }
//         }

//         setMessage({ type: 'success', text: `Dispatch ${mode === 'edit' ? 'updated' : 'created'} successfully!` });
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 1500);
//       } else {
//         setMessage({ type: 'error', text: result.error || 'Failed to process dispatch' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to process dispatch' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full mr-3"></div>
//             <span>Loading dispatch data...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">
        
//         <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <div>
//             <h2 className="text-xl font-bold">
//               {mode === 'edit' ? `Edit Dispatch ${dispatchData.Dispatch_Number}` : 
//                mode === 'create' ? 'Create New Dispatch' : 
//                'Create Dispatch from Sales Order'}
//             </h2>
//             {mode === 'fromOrder' && salesOrder && <p className="text-sm opacity-90">From SO: {salesOrder.Number}</p>}
//             {mode === 'edit' && <p className="text-sm opacity-90">ID: {dispatchId}</p>}
//           </div>
//           <button onClick={onClose} className="text-white text-2xl">×</button>
//         </div>

//         {message.text && (
//           <div className={`m-4 p-3 rounded ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4">
//           <div className="bg-blue-50 p-4 rounded mb-4">
//             <h3 className="font-bold mb-3">Dispatch Information</h3>
            
//             <div className="grid grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Sales Order</label>
//                 <input value={dispatchData.Sales_Order_Number || (mode === 'create' ? 'Standalone' : 'N/A')} className="w-full p-2 bg-gray-100 border rounded" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Dispatch Number</label>
//                 <input value={dispatchData.Dispatch_Number || 'Auto Generated'} className="w-full p-2 bg-gray-100 border rounded" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Customer</label>
//                 {isFromOrder ? (
//                   <input value={dispatchData.Name_of_Customer} className="w-full p-2 bg-gray-100 border rounded" disabled />
//                 ) : (
//                   <select
//                     value={dispatchData.COA_ID}
//                     onChange={(e) => {
//                       const customer = customers.find(c => c.id === parseInt(e.target.value));
//                       setDispatchData(prev => ({ ...prev, COA_ID: e.target.value, Name_of_Customer: customer?.acName || '' }));
//                     }}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     <option value="">Select Customer</option>
//                     {customers.map(customer => (
//                       <option key={customer.id} value={customer.id}>{customer.acName}</option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={dispatchData.Date}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {mode === 'fromOrder' && (
//             <div className="bg-green-50 p-4 rounded mb-4">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={updateOrderStatus}
//                   onChange={(e) => setUpdateOrderStatus(e.target.checked)}
//                   className="mr-2"
//                 />
//                 Update Sales Order Status
//                 {updateOrderStatus && (
//                   <select value={selectedOrderStatus} onChange={(e) => setSelectedOrderStatus(e.target.value)} className="ml-4 px-3 py-1 border rounded">
//                     <option value="Partial">Partial</option>
//                     <option value="Complete">Complete</option>
//                   </select>
//                 )}
//               </label>
//             </div>
//           )}

//           <div className="border rounded mb-4 overflow-hidden">
//             <div className="bg-gray-100 p-3 flex justify-between items-center">
//               <h3 className="font-bold">Items to Dispatch ({dispatchItems.length})</h3>
//               {mode === 'create' && (
//                 <button type="button" onClick={addNewItem} className="bg-green-600 text-white px-3 py-1 rounded">
//                   + Add Item
//                 </button>
//               )}
//             </div>
            
//             <table className="w-full text-sm">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left">Line</th>
//                   <th className="px-3 py-2 text-left">Batch</th>
//                   <th className="px-3 py-2 text-left">Item</th>
//                   {mode === 'fromOrder' && (
//                     <>
//                       <th className="px-3 py-2 text-center bg-blue-200">SO Qty</th>
//                       <th className="px-3 py-2 text-center bg-blue-200">UOM</th>
//                     </>
//                   )}
//                   <th className="px-3 py-2 text-center bg-orange-100">Available</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Quantity</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Price</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Total</th>
//                   <th className="px-3 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dispatchItems.map((item, index) => (
//                   <tr key={index} className={`border-b ${item.isAdditionalBatch ? 'bg-yellow-50' : ''}`}>
//                     <td className="px-3 py-2 text-center">{item.Line_Id}</td>
                    
//                     <td className="px-3 py-2">
//                       <select
//                         value={item.Batch_Number}
//                         onChange={(e) => updateDispatchItem(index, 'Batch_Number', e.target.value)}
//                         className="w-full px-2 py-1 border rounded"
//                         required={item.QTY_Dispatched > 0}
//                       >
//                         <option value="">{batchLoading ? 'Loading...' : `Select Batch (${getBatchOptions(item.Item_ID).length})`}</option>
//                         {getBatchOptions(item.Item_ID).map((batch, bIdx) => (
//                           <option key={bIdx} value={batch.batchno}>
//                             {batch.batchno} - Stock: {batch.available_qty_uom1}
//                             {mode === 'edit' && batch.current_dispatch_uom1 > 0 && ` (+${batch.current_dispatch_uom1} current)`}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
                    
//                     <td className="px-3 py-2">
//                       {isFromOrder ? (
//                         <div className="bg-gray-100 p-2 rounded">{item.Item}</div>
//                       ) : (
//                         <select
//                           value={item.Item_ID}
//                           onChange={(e) => updateDispatchItem(index, 'Item_ID', e.target.value)}
//                           className="w-full px-2 py-1 border rounded"
//                           required
//                         >
//                           <option value="">Select Item</option>
//                           {items.map(itm => (
//                             <option key={itm.id} value={itm.id}>{itm.itemName}</option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
                    
//                     {mode === 'fromOrder' && (
//                       <>
//                         <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Qty_in_SO : '-'}</td>
//                         <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Uom_SO : '-'}</td>
//                       </>
//                     )}
                    
//                     <td className="px-3 py-2 text-center bg-orange-50">
//                       <div className={`font-bold ${getAvailableStock(item.Item_ID, item.Batch_Number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                         {item.Batch_Number ? getAvailableStock(item.Item_ID, item.Batch_Number) : '-'}
//                       </div>
//                     </td>
                    
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
//                         isPurchase={false}
//                       />
//                     </td>
                    
//                     <td className="px-3 py-2 bg-green-50">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Stock_Price || ''}
//                         onChange={(e) => updateDispatchItem(index, 'Stock_Price', e.target.value)}
//                         className="w-20 px-2 py-1 border rounded text-center"
//                       />
//                     </td>
                    
//                     {/* FIXED: Total = Price * Selected UOM quantity (no $ sign) */}
//                     <td className="px-3 py-2 text-center bg-green-50 font-bold">
//                       {calculateTotal(item)}
//                     </td>
                    
//                     <td className="px-3 py-2 text-center">
//                       <div className="flex flex-col space-y-1">
//                         {((mode === 'fromOrder' || mode === 'edit') && item.isOriginalRow) && (
//                           <button
//                             type="button"
//                             onClick={() => addNewBatchRow(index)}
//                             className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
//                             title="Add additional batch for same item"
//                           >
//                             + Batch
//                           </button>
//                         )}
                        
//                         {(
//                           (mode === 'create' && dispatchItems.length > 1) ||
//                           (mode === 'edit' && dispatchItems.length > 1) ||
//                           (mode === 'fromOrder' && item.isAdditionalBatch) ||
//                           item.isAdditionalBatch
//                         ) && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(index)}
//                             className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
//                             title="Remove this item/batch"
//                           >
//                             {item.isAdditionalBatch ? 'Remove' : 'Delete'}
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-400 text-white rounded">
//               Cancel
//             </button>
//             <button type="submit" disabled={loading || batchLoading} className="px-6 py-2 bg-green-600 text-white rounded">
//               {loading ? 'Processing...' : (mode === 'edit' ? 'Update Dispatch' : 'Create Dispatch')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DispatchModal;











































































































// // components/DispatchModal.jsx - SIMPLE COA NAME DISPLAY
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const DispatchModal = ({ 
//   salesOrder = null,      
//   dispatchId = null,      
//   mode = 'fromOrder',
//   onClose, 
//   onSuccess 
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [dispatchData, setDispatchData] = useState({
//     Sales_Order_Number: '',
//     Dispatch_ID: 'Auto Generated',
//     Dispatch_Number: 'Auto Generated', 
//     Name_of_Customer: '',
//     COA_ID: '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Dispatch_Type: 'Local selling'
//   });

//   const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
//   const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
//   const [dispatchItems, setDispatchItems] = useState([]);
  
//   const [availableBatches, setAvailableBatches] = useState({});
//   const [batchLoading, setBatchLoading] = useState(false);
  
//   const [customers, setCustomers] = useState([]);
//   const [items, setItems] = useState([]);
//   const [isFromOrder, setIsFromOrder] = useState(false);

//   // NEW: Simple COA data for batch names
//   const [allCOAs, setAllCOAs] = useState([]);

//   // FIXED: Helper functions
//   const getSaleUnitId = (saleUnit, item) => {
//     if (!saleUnit || !item) return null;
//     switch (saleUnit) {
//       case 'uom1': return item?.uom1?.id || null;
//       case 'uomTwo': return item?.uomTwo?.id || null;
//       case 'uomThree': return item?.uomThree?.id || null;
//       default: return item?.uom1?.id || null;
//     }
//   };

//   const getSaleUnitRadioValue = (saleUnitId, item) => {
//     if (!saleUnitId || !item) return 'uom1';
//     const id = parseInt(saleUnitId);
//     if (id === item?.uom1?.id) return 'uom1';
//     if (id === item?.uomTwo?.id) return 'uomTwo';
//     if (id === item?.uomThree?.id) return 'uomThree';
//     return 'uom1';
//   };

//   // NEW: Simple function to get COA name by ID
//   const getCoaNameById = (coaId) => {
//     console.error(coaId)
//     console.log(allCOAs)
//     const coa = allCOAs.find(c => c.id === parseInt(coaId));
//     return coa ? coa.acName : `COA-${coaId}`;
//   };

//   // NEW: Simple function to fetch all COAs
//   const fetchAllCOAs = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`);
//       const result = await response.json();
//       console.log(' ths is  the data ',result.zCoaRecords)
//       if (result.success && result.data) {
//         console.log(' this is array ',result.zCoaRecords)
//         setAllCOAs(result.zCoaRecords) 
//         // ? result.zCoaRecords : [result.zCoaRecords]);
//         console.log('✅ COAs loaded:', result.zCoaRecords);
//       }
//     } catch (error) {
//       console.error('Error fetching COAs:', error);
//       setAllCOAs([]);
//     }
//   };

//   useEffect(() => {
//     initializeModal();
//   }, [mode, salesOrder, dispatchId]);

//   const initializeModal = async () => {
//     // NEW: Fetch COAs first
//     await fetchAllCOAs();
    
//     if (mode === 'fromOrder' && salesOrder) {
//       setIsFromOrder(true);
//       initializeFromOrder();
//     } else if (mode === 'edit' && dispatchId) {
//       await loadExistingDispatch();
//     } else if (mode === 'create') {
//       setIsFromOrder(false);
//       await fetchCustomers();
//       await fetchItems();
//       initializeEmpty();
//     }
//   };

//   const initializeFromOrder = () => {
//     setDispatchData({
//       Sales_Order_Number: salesOrder.Number,
//       Dispatch_ID: 'Auto Generated',
//       Dispatch_Number: 'Auto Generated',
//       Name_of_Customer: salesOrder.account?.acName || '',
//       COA_ID: salesOrder.COA_ID,
//       Date: new Date().toISOString().split('T')[0],
//       Status: 'UnPost',
//       Dispatch_Type: 'Local selling'
//     });

//     const items = salesOrder.details.map((detail, index) => ({
//       Line_Id: detail.Line_Id || (index + 1),
//       Batch_Number: '',
//       Item: detail.item?.itemName || '',
//       Item_ID: detail.Item_ID,
//       Qty_in_SO: detail.uom1_qty || detail.Stock_out_UOM_Qty || 0,
//       Uom_SO: detail.item?.uom1?.uom || 'Pcs',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: detail.sale_unit || 'uom1',
//       Stock_Price: parseFloat(detail.Price) || 0,
//       isOriginalRow: true,
//       item: detail.item,
//       discountA: parseFloat(detail.Discount_A) || 0,
//       discountB: parseFloat(detail.Discount_B) || 0,
//       discountC: parseFloat(detail.Discount_C) || 0
//     }));
//     setDispatchItems(items);
    
//     fetchBatchesNormal(items);
//   };

//   const loadExistingDispatch = async () => {
//     setFetchLoading(true);
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const dispatch = result.data;
        
//         const wasFromOrder = dispatch.Order_Main_ID !== null;
//         setIsFromOrder(wasFromOrder);
        
//         setDispatchData({
//           Sales_Order_Number: dispatch.order?.Number || 'Standalone Dispatch',
//           Dispatch_ID: dispatch.ID,
//           Dispatch_Number: dispatch.Number,
//           Name_of_Customer: dispatch.account?.acName || '',
//           COA_ID: dispatch.COA_ID,
//           Date: dispatch.Date.split('T')[0],
//           Status: dispatch.Status,
//           Dispatch_Type: dispatch.Purchase_Type
//         });

//         const items = dispatch.details?.map((detail, index) => ({
//           Line_Id: detail.Line_Id,
//           Batch_Number: detail.batchno || '',
//           Item: detail.item?.itemName || '',
//           Item_ID: detail.Item_ID,
//           QTY_Dispatched: detail.Stock_out_UOM_Qty || 0,
//           UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
//           uom1_qty: detail.Stock_out_UOM_Qty || 0,
//           uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
//           uom3_qty: detail.Stock_out_UOM3_Qty || 0,
//           sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
//           Stock_Price: detail.Stock_Price || 0,
//           isOriginalRow: true,
//           item: detail.item,
//           discountA: parseFloat(detail.Discount_A) || 0,
//           discountB: parseFloat(detail.Discount_B) || 0,
//           discountC: parseFloat(detail.Discount_C) || 0
//         })) || [];
        
//         setDispatchItems(items);
        
//         await fetchBatchesForEdit(items);

//         if (!wasFromOrder) {
//           await fetchCustomers();
//         }
//         await fetchItems();
//       }
      
//     } catch (error) {
//       console.error('Error loading dispatch:', error);
//       setMessage({ type: 'error', text: 'Failed to load dispatch data' });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const initializeEmpty = () => {
//     setDispatchItems([{
//       Line_Id: 1,
//       Batch_Number: '',
//       Item: '',
//       Item_ID: '',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: 0,
//       isOriginalRow: true,
//       discountA: 0,
//       discountB: 0,
//       discountC: 0
//     }]);
//   };

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
//       const result = await response.json();
//       if (result.success) setCustomers(result.data);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
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

//   const fetchBatchesNormal = async (items) => {
//     setBatchLoading(true);
//     const batchData = {};

//     try {
//       for (const item of items) {
//         if (item.Item_ID) {
//           const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`);
//           const result = await response.json();
          
//           if (result.success && result.data) {
//             batchData[item.Item_ID] = result.data;
//           }
//         }
//       }
//       setAvailableBatches(batchData);
//     } catch (error) {
//       console.error('Error fetching batches:', error);
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   const fetchBatchesForEdit = async (items) => {
//     setBatchLoading(true);
//     const batchData = {};

//     try {
//       for (const item of items) {
//         if (item.Item_ID) {
//           const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches-edit/${item.Item_ID}/${dispatchId}`);
//           const result = await response.json();
          
//           if (result.success && result.data) {
//             batchData[item.Item_ID] = result.data;
//           }
//         }
//       }
//       setAvailableBatches(batchData);
//     } catch (error) {
//       console.error('Error fetching edit batches:', error);
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   const fetchBatchesForSingleItem = async (itemId) => {
//     try {
//       const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${itemId}`);
//       const result = await response.json();
      
//       if (result.success && result.data) {
//         setAvailableBatches(prev => ({ ...prev, [itemId]: result.data }));
//       }
//     } catch (error) {
//       console.error(`Error fetching batches for item ${itemId}:`, error);
//     }
//   };

//   const handleUomChange = (index, values) => {
//     const updated = [...dispatchItems];
//     const item = updated[index];
    
//     const requestedQty = parseFloat(values.uom1_qty) || 0;
//     const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
    
//     if (mode !== 'edit' && item.Batch_Number && requestedQty > availableStock && availableStock > 0) {
//       setMessage({ 
//         type: 'error', 
//         text: `Cannot dispatch ${requestedQty} from ${item.Batch_Number}. Available: ${availableStock}` 
//       });
//       setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//       return;
//     }

//     setMessage({ type: '', text: '' });

//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Dispatched: values.uom1_qty || 0,
//       sale_unit: values.sale_unit || 'uom1',
//       UOM_Dispatched: values.sale_unit === 'uomTwo' ? updated[index].item?.uomTwo?.uom :
//                      values.sale_unit === 'uomThree' ? updated[index].item?.uomThree?.uom :
//                      updated[index].item?.uom1?.uom || 'Pcs'
//     };
//     setDispatchItems(updated);
//   };

//   const updateDispatchItem = (index, field, value) => {
//     const updated = [...dispatchItems];
    
//     if (field === 'Item_ID' && mode === 'create') {
//       const selectedItem = items.find(item => item.id === parseInt(value));
//       updated[index].Item = selectedItem?.itemName || '';
//       updated[index].Item_ID = value;
//       updated[index].item = selectedItem;
      
//       if (selectedItem) {
//         fetchBatchesForSingleItem(selectedItem.id);
//       }
//     } else if (field === 'Stock_Price') {
//       updated[index][field] = parseFloat(value) || 0;
//     } else {
//       updated[index][field] = value;
//     }

//     setDispatchItems(updated);
//   };

//   const addNewBatchRow = (originalIndex) => {
//     const originalItem = dispatchItems[originalIndex];
//     const newRow = {
//       Line_Id: parseFloat(originalItem.Line_Id) + 0.1 + (Math.random() * 0.01),
//       Batch_Number: '',
//       Item: `${originalItem.Item} (Additional Batch)`,
//       Item_ID: originalItem.Item_ID,
//       Qty_in_SO: 0,
//       Uom_SO: '-',
//       QTY_Dispatched: 0,
//       UOM_Dispatched: originalItem.UOM_Dispatched,
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1',
//       Stock_Price: originalItem.Stock_Price,
//       isOriginalRow: false,
//       isAdditionalBatch: true,
//       item: originalItem.item,
//       discountA: originalItem.discountA || 0,
//       discountB: originalItem.discountB || 0,
//       discountC: originalItem.discountC || 0
//     };

//     const newItems = [...dispatchItems];
//     newItems.splice(originalIndex + 1, 0, newRow);
//     setDispatchItems(newItems);
//   };

//   const addNewItem = () => {
//     setDispatchItems([
//       ...dispatchItems,
//       {
//         Line_Id: dispatchItems.length + 1,
//         Batch_Number: '',
//         Item: '',
//         Item_ID: '',
//         QTY_Dispatched: 0,
//         UOM_Dispatched: 'Pcs',
//         uom1_qty: 0,
//         uom2_qty: 0,
//         uom3_qty: 0,
//         sale_unit: 'uom1',
//         Stock_Price: 0,
//         isOriginalRow: true,
//         discountA: 0,
//         discountB: 0,
//         discountC: 0
//       }
//     ]);
//   };

//   const removeItem = (index) => {
//     if (dispatchItems.length > 1) {
//       setDispatchItems(dispatchItems.filter((_, i) => i !== index));
//     }
//   };

//   const getAvailableStock = (itemId, batchno) => {
//     if (!itemId || !batchno) return 0;
//     const batches = availableBatches[itemId] || [];
//     const batch = batches.find(b => b.batchno === batchno);
//     return batch ? parseFloat(batch.available_qty_uom1) || 0 : 0;
//   };

//   const getBatchOptions = (itemId) => {
//     const batches = availableBatches[itemId] || [];
//     if (mode === 'edit') {
//       return batches;
//     } else {
//       return batches.filter(batch => parseFloat(batch.available_qty_uom1) > 0);
//     }
//   };

//   const calculateTotal = (item) => {
//     const price = parseFloat(item.Stock_Price) || 0;
//     const uom2Quantity = parseFloat(item.uom2_qty) || 0;
    
//     return (price * uom2Quantity).toFixed(2);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (mode === 'create' && !dispatchData.COA_ID) {
//       setMessage({ type: 'error', text: 'Please select a customer' });
//       return;
//     }

//     let itemsToSubmit;
//     if (mode === 'edit') {
//       itemsToSubmit = dispatchItems;
//     } else {
//       itemsToSubmit = dispatchItems.filter(item => item.QTY_Dispatched > 0);
//     }

//     if (itemsToSubmit.length === 0) {
//       setMessage({ type: 'error', text: 'No items to process' });
//       return;
//     }

//     const itemsWithQuantity = itemsToSubmit.filter(item => item.QTY_Dispatched > 0);
//     const missingBatch = itemsWithQuantity.find(item => !item.Batch_Number);
//     if (missingBatch) {
//       setMessage({ type: 'error', text: `Please select batch for: ${missingBatch.Item}` });
//       return;
//     }

//     if (mode !== 'edit') {
//       for (const item of itemsWithQuantity) {
//         const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
//         if (item.QTY_Dispatched > availableStock) {
//           setMessage({ 
//             type: 'error', 
//             text: `${item.Item}: Cannot dispatch ${item.QTY_Dispatched}, only ${availableStock} available in ${item.Batch_Number}` 
//           });
//           return;
//         }
//       }
//     }
    
//     setLoading(true);

//     try {
//       const dispatchPayload = {
//         stockMain: {
//           Stock_Type_ID: 12,
//           COA_ID: dispatchData.COA_ID,
//           Date: dispatchData.Date,
//           Status: dispatchData.Status,
//           Purchase_Type: dispatchData.Dispatch_Type,
//           Order_Main_ID: salesOrder?.ID || null
//         },
//         stockDetails: itemsToSubmit.map(item => ({
//           Line_Id: item.Line_Id,
//           Item_ID: item.Item_ID,
//           batchno: item.Batch_Number,
//           Stock_Price: parseFloat(item.Stock_Price) || 0,
//           Stock_out_UOM_Qty: item.uom1_qty || 0,
//           Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
//           Stock_out_UOM3_Qty: item.uom3_qty || 0,
//           Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
//           Discount_A: item.discountA || 0,
//           Discount_B: item.discountB || 0,
//           Discount_C: item.discountC || 0
//         }))
//       };

//       const url = mode === 'edit' 
//         ? `http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`
//         : `http://${window.location.hostname}:4000/api/dispatch`;
      
//       const response = await fetch(url, {
//         method: mode === 'edit' ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dispatchPayload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         if (updateOrderStatus && salesOrder?.ID) {
//           try {
//             await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${salesOrder.ID}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: selectedOrderStatus.trim() })
//             });
//           } catch (statusError) {
//             console.warn('Error updating order status:', statusError);
//           }
//         }

//         setMessage({ type: 'success', text: `Dispatch ${mode === 'edit' ? 'updated' : 'created'} successfully!` });
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 1500);
//       } else {
//         setMessage({ type: 'error', text: result.error || 'Failed to process dispatch' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to process dispatch' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6">
//           <div className="flex items-center">
//             <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full mr-3"></div>
//             <span>Loading dispatch data...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">
        
//         <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
//           <div>
//             <h2 className="text-xl font-bold">
//               {mode === 'edit' ? `Edit Dispatch ${dispatchData.Dispatch_Number}` : 
//                mode === 'create' ? 'Create New Dispatch' : 
//                'Create Dispatch from Sales Order'}
//             </h2>
//             {mode === 'fromOrder' && salesOrder && <p className="text-sm opacity-90">From SO: {salesOrder.Number}</p>}
//             {mode === 'edit' && <p className="text-sm opacity-90">ID: {dispatchId}</p>}
//           </div>
//           <button onClick={onClose} className="text-white text-2xl">×</button>
//         </div>

//         {message.text && (
//           <div className={`m-4 p-3 rounded ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4">
//           <div className="bg-blue-50 p-4 rounded mb-4">
//             <h3 className="font-bold mb-3">Dispatch Information</h3>
            
//             <div className="grid grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Sales Order</label>
//                 <input value={dispatchData.Sales_Order_Number || (mode === 'create' ? 'Standalone' : 'N/A')} className="w-full p-2 bg-gray-100 border rounded" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Dispatch Number</label>
//                 <input value={dispatchData.Dispatch_Number || 'Auto Generated'} className="w-full p-2 bg-gray-100 border rounded" disabled />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Customer</label>
//                 {isFromOrder ? (
//                   <input value={dispatchData.Name_of_Customer} className="w-full p-2 bg-gray-100 border rounded" disabled />
//                 ) : (
//                   <select
//                     value={dispatchData.COA_ID}
//                     onChange={(e) => {
//                       const customer = customers.find(c => c.id === parseInt(e.target.value));
//                       setDispatchData(prev => ({ ...prev, COA_ID: e.target.value, Name_of_Customer: customer?.acName || '' }));
//                     }}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     <option value="">Select Customer</option>
//                     {customers.map(customer => (
//                       <option key={customer.id} value={customer.id}>{customer.acName}</option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date</label>
//                 <input
//                   type="date"
//                   value={dispatchData.Date}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {mode === 'fromOrder' && (
//             <div className="bg-green-50 p-4 rounded mb-4">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={updateOrderStatus}
//                   onChange={(e) => setUpdateOrderStatus(e.target.checked)}
//                   className="mr-2"
//                 />
//                 Update Sales Order Status
//                 {updateOrderStatus && (
//                   <select value={selectedOrderStatus} onChange={(e) => setSelectedOrderStatus(e.target.value)} className="ml-4 px-3 py-1 border rounded">
//                     <option value="Partial">Partial</option>
//                     <option value="Complete">Complete</option>
//                   </select>
//                 )}
//               </label>
//             </div>
//           )}

//           <div className="border rounded mb-4 overflow-hidden">
//             <div className="bg-gray-100 p-3 flex justify-between items-center">
//               <h3 className="font-bold">Items to Dispatch ({dispatchItems.length})</h3>
//               {mode === 'create' && (
//                 <button type="button" onClick={addNewItem} className="bg-green-600 text-white px-3 py-1 rounded">
//                   + Add Item
//                 </button>
//               )}
//             </div>
            
//             <table className="w-full text-sm">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="px-3 py-2 text-left">Line</th>
//                   <th className="px-3 py-2 text-left">Batch</th>
//                   <th className="px-3 py-2 text-left">Item</th>
//                   {mode === 'fromOrder' && (
//                     <>
//                       <th className="px-3 py-2 text-center bg-blue-200">SO Qty</th>
//                       <th className="px-3 py-2 text-center bg-blue-200">UOM</th>
//                     </>
//                   )}
//                   <th className="px-3 py-2 text-center bg-orange-100">Available</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Quantity</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Price</th>
//                   <th className="px-3 py-2 text-center bg-green-100">Total</th>
//                   <th className="px-3 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dispatchItems.map((item, index) => (
//                   <tr key={index} className={`border-b ${item.isAdditionalBatch ? 'bg-yellow-50' : ''}`}>
//                     <td className="px-3 py-2 text-center">{item.Line_Id}</td>
                    
//                     {/* UPDATED: Batch selection with COA names */}
//                     <td className="px-3 py-2">
//                       <select
//                         value={item.Batch_Number}
//                         onChange={(e) => updateDispatchItem(index, 'Batch_Number', e.target.value)}
//                         className="w-full px-2 py-1 border rounded"
//                         required={item.QTY_Dispatched > 0}
//                       >
//                         <option value="">{batchLoading ? 'Loading...' : `Select Batch (${getBatchOptions(item.Item_ID).length})`}</option>
//                         {getBatchOptions(item.Item_ID).map((batch, bIdx) => (
//                           <option key={bIdx} value={batch.batchno}>
//                             {/* UPDATED: Show COA name with batch number */}
//                             {getCoaNameById(batch.batchno)} ({batch.batchno}) - Stock: {batch.available_qty_uom1}
//                             {mode === 'edit' && batch.current_dispatch_uom1 > 0 && ` (+${batch.current_dispatch_uom1} current)`}
//                           </option>
//                         ))}
//                       </select>
//                       {/* Show selected batch info */}
//                       {item.Batch_Number && (
//                         <div className="text-xs text-blue-600 mt-1">
//                           Selected: {getCoaNameById(item.Batch_Number)} (ID: {item.Batch_Number})
//                         </div>
//                       )}
//                     </td>
                    
//                     <td className="px-3 py-2">
//                       {isFromOrder ? (
//                         <div className="bg-gray-100 p-2 rounded">{item.Item}</div>
//                       ) : (
//                         <select
//                           value={item.Item_ID}
//                           onChange={(e) => updateDispatchItem(index, 'Item_ID', e.target.value)}
//                           className="w-full px-2 py-1 border rounded"
//                           required
//                         >
//                           <option value="">Select Item</option>
//                           {items.map(itm => (
//                             <option key={itm.id} value={itm.id}>{itm.itemName}</option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
                    
//                     {mode === 'fromOrder' && (
//                       <>
//                         <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Qty_in_SO : '-'}</td>
//                         <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Uom_SO : '-'}</td>
//                       </>
//                     )}
                    
//                     <td className="px-3 py-2 text-center bg-orange-50">
//                       <div className={`font-bold ${getAvailableStock(item.Item_ID, item.Batch_Number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                         {item.Batch_Number ? getAvailableStock(item.Item_ID, item.Batch_Number) : '-'}
//                       </div>
//                     </td>
                    
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
//                         isPurchase={false}
//                       />
//                     </td>
                    
//                     <td className="px-3 py-2 bg-green-50">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={item.Stock_Price || ''}
//                         onChange={(e) => updateDispatchItem(index, 'Stock_Price', e.target.value)}
//                         className="w-20 px-2 py-1 border rounded text-center"
//                       />
//                     </td>
                    
//                     <td className="px-3 py-2 text-center bg-green-50 font-bold">
//                       {calculateTotal(item)}
//                     </td>
                    
//                     <td className="px-3 py-2 text-center">
//                       <div className="flex flex-col space-y-1">
//                         {((mode === 'fromOrder' || mode === 'edit') && item.isOriginalRow) && (
//                           <button
//                             type="button"
//                             onClick={() => addNewBatchRow(index)}
//                             className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
//                             title="Add additional batch for same item"
//                           >
//                             + Batch
//                           </button>
//                         )}
                        
//                         {(
//                           (mode === 'create' && dispatchItems.length > 1) ||
//                           (mode === 'edit' && dispatchItems.length > 1) ||
//                           (mode === 'fromOrder' && item.isAdditionalBatch) ||
//                           item.isAdditionalBatch
//                         ) && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(index)}
//                             className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
//                             title="Remove this item/batch"
//                           >
//                             {item.isAdditionalBatch ? 'Remove' : 'Delete'}
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-400 text-white rounded">
//               Cancel
//             </button>
//             <button type="submit" disabled={loading || batchLoading} className="px-6 py-2 bg-green-600 text-white rounded">
//               {loading ? 'Processing...' : (mode === 'edit' ? 'Update Dispatch' : 'Create Dispatch')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DispatchModal;























































// components/DispatchModal.jsx - FIXED with correct API response handling
'use client'
import React, { useState, useEffect } from 'react';
import UomConverter from '../UomConverter';

const DispatchModal = ({ 
  salesOrder = null,      
  dispatchId = null,      
  mode = 'fromOrder',
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [dispatchData, setDispatchData] = useState({
    Sales_Order_Number: '',
    Dispatch_ID: 'Auto Generated',
    Dispatch_Number: 'Auto Generated', 
    Name_of_Customer: '',
    COA_ID: '',
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Dispatch_Type: 'Local selling'
  });

  const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
  const [dispatchItems, setDispatchItems] = useState([]);
  
  const [availableBatches, setAvailableBatches] = useState({});
  const [batchLoading, setBatchLoading] = useState(false);
  
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [isFromOrder, setIsFromOrder] = useState(false);

  // NEW: COA data for batch name display
  const [allCOAs, setAllCOAs] = useState([]);

  // Helper functions
  const getSaleUnitId = (saleUnit, item) => {
    if (!saleUnit || !item) return null;
    switch (saleUnit) {
      case 'uom1': return item?.uom1?.id || null;
      case 'uomTwo': return item?.uomTwo?.id || null;
      case 'uomThree': return item?.uomThree?.id || null;
      default: return item?.uom1?.id || null;
    }
  };

  const getSaleUnitRadioValue = (saleUnitId, item) => {
    if (!saleUnitId || !item) return 'uom1';
    const id = parseInt(saleUnitId);
    if (id === item?.uom1?.id) return 'uom1';
    if (id === item?.uomTwo?.id) return 'uomTwo';
    if (id === item?.uomThree?.id) return 'uomThree';
    return 'uom1';
  };

  // NEW: Function to get COA name by ID
  const getCoaNameById = (coaId) => {
    const coa = allCOAs.find(c => c.id === parseInt(coaId));
    return coa ? coa.acName : `COA-${coaId}`;
  };

  // NEW: FIXED function to fetch all COAs
  const fetchAllCOAs = async () => {
    try {
      console.log('🔄 Fetching all COAs...');
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`);
      const result = await response.json();
      
      console.log('📊 COA API Response:', result);
      
      // FIXED: Use zCoaRecords instead of data
      if (result.success && result.zCoaRecords) {
        setAllCOAs(Array.isArray(result.zCoaRecords) ? result.zCoaRecords : [result.zCoaRecords]);
        console.log('✅ COAs loaded:', result.zCoaRecords.length, 'records');
      }
    } catch (error) {
      console.error('❌ Error fetching COAs:', error);
      setAllCOAs([]);
    }
  };

  useEffect(() => {
    initializeModal();
  }, [mode, salesOrder, dispatchId]);

  const initializeModal = async () => {
    // NEW: Fetch COAs first for batch display
    await fetchAllCOAs();
    
    if (mode === 'fromOrder' && salesOrder) {
      setIsFromOrder(true);
      initializeFromOrder();
    } else if (mode === 'edit' && dispatchId) {
      await loadExistingDispatch();
    } else if (mode === 'create') {
      setIsFromOrder(false);
      await fetchCustomers();
      await fetchItems();
      initializeEmpty();
    }
  };

  const initializeFromOrder = () => {
    setDispatchData({
      Sales_Order_Number: salesOrder.Number,
      Dispatch_ID: 'Auto Generated',
      Dispatch_Number: 'Auto Generated',
      Name_of_Customer: salesOrder.account?.acName || '',
      COA_ID: salesOrder.COA_ID,
      Date: new Date().toISOString().split('T')[0],
      Status: 'UnPost',
      Dispatch_Type: 'Local selling'
    });

    const items = salesOrder.details.map((detail, index) => ({
      Line_Id: detail.Line_Id || (index + 1),
      Batch_Number: '',
      Item: detail.item?.itemName || '',
      Item_ID: detail.Item_ID,
      Qty_in_SO: detail.uom1_qty || detail.Stock_out_UOM_Qty || 0,
      Uom_SO: detail.item?.uom1?.uom || 'Pcs',
      QTY_Dispatched: 0,
      UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: detail.sale_unit || 'uom1',
      Stock_Price: parseFloat(detail.Price) || 0,
      isOriginalRow: true,
      item: detail.item,
      discountA: parseFloat(detail.Discount_A) || 0,
      discountB: parseFloat(detail.Discount_B) || 0,
      discountC: parseFloat(detail.Discount_C) || 0
    }));
    setDispatchItems(items);
    
    fetchBatchesNormal(items);
  };

  const loadExistingDispatch = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`);
      const result = await response.json();
      
      if (result.success) {
        const dispatch = result.data;
        
        const wasFromOrder = dispatch.Order_Main_ID !== null;
        setIsFromOrder(wasFromOrder);
        
        setDispatchData({
          Sales_Order_Number: dispatch.order?.Number || 'Standalone Dispatch',
          Dispatch_ID: dispatch.ID,
          Dispatch_Number: dispatch.Number,
          Name_of_Customer: dispatch.account?.acName || '',
          COA_ID: dispatch.COA_ID,
          Date: dispatch.Date.split('T')[0],
          Status: dispatch.Status,
          Dispatch_Type: dispatch.Purchase_Type
        });

        const items = dispatch.details?.map((detail, index) => ({
          Line_Id: detail.Line_Id,
          Batch_Number: detail.batchno || '',
          Item: detail.item?.itemName || '',
          Item_ID: detail.Item_ID,
          QTY_Dispatched: detail.Stock_out_UOM_Qty || 0,
          UOM_Dispatched: detail.item?.uom1?.uom || 'Pcs',
          uom1_qty: detail.Stock_out_UOM_Qty || 0,
          uom2_qty: detail.Stock_out_SKU_UOM_Qty || 0,
          uom3_qty: detail.Stock_out_UOM3_Qty || 0,
          sale_unit: getSaleUnitRadioValue(detail.Sale_Unit, detail.item),
          Stock_Price: detail.Stock_Price || 0,
          isOriginalRow: true,
          item: detail.item,
          discountA: parseFloat(detail.Discount_A) || 0,
          discountB: parseFloat(detail.Discount_B) || 0,
          discountC: parseFloat(detail.Discount_C) || 0
        })) || [];
        
        setDispatchItems(items);
        
        await fetchBatchesForEdit(items);

        if (!wasFromOrder) {
          await fetchCustomers();
        }
        await fetchItems();
      }
      
    } catch (error) {
      console.error('Error loading dispatch:', error);
      setMessage({ type: 'error', text: 'Failed to load dispatch data' });
    } finally {
      setFetchLoading(false);
    }
  };

  const initializeEmpty = () => {
    setDispatchItems([{
      Line_Id: 1,
      Batch_Number: '',
      Item: '',
      Item_ID: '',
      QTY_Dispatched: 0,
      UOM_Dispatched: 'Pcs',
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: 'uom1',
      Stock_Price: 0,
      isOriginalRow: true,
      discountA: 0,
      discountB: 0,
      discountC: 0
    }]);
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa`);
      const result = await response.json();
      if (result.success) setCustomers(result.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
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

  const fetchBatchesNormal = async (items) => {
    setBatchLoading(true);
    const batchData = {};

    try {
      for (const item of items) {
        if (item.Item_ID) {
          const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            batchData[item.Item_ID] = result.data;
          }
        }
      }
      setAvailableBatches(batchData);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setBatchLoading(false);
    }
  };

  const fetchBatchesForEdit = async (items) => {
    setBatchLoading(true);
    const batchData = {};

    try {
      for (const item of items) {
        if (item.Item_ID) {
          const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches-edit/${item.Item_ID}/${dispatchId}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            batchData[item.Item_ID] = result.data;
          }
        }
      }
      setAvailableBatches(batchData);
    } catch (error) {
      console.error('Error fetching edit batches:', error);
    } finally {
      setBatchLoading(false);
    }
  };

  const fetchBatchesForSingleItem = async (itemId) => {
    try {
      const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${itemId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setAvailableBatches(prev => ({ ...prev, [itemId]: result.data }));
      }
    } catch (error) {
      console.error(`Error fetching batches for item ${itemId}:`, error);
    }
  };

  const handleUomChange = (index, values) => {
    const updated = [...dispatchItems];
    const item = updated[index];
    
    const requestedQty = parseFloat(values.uom1_qty) || 0;
    const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
    
    if (mode !== 'edit' && item.Batch_Number && requestedQty > availableStock && availableStock > 0) {
      setMessage({ 
        type: 'error', 
        text: `Cannot dispatch ${requestedQty} from ${item.Batch_Number}. Available: ${availableStock}` 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }

    setMessage({ type: '', text: '' });

    updated[index] = {
      ...updated[index],
      uom1_qty: values.uom1_qty || 0,
      uom2_qty: values.uom2_qty || 0,
      uom3_qty: values.uom3_qty || 0,
      QTY_Dispatched: values.uom1_qty || 0,
      sale_unit: values.sale_unit || 'uom1',
      UOM_Dispatched: values.sale_unit === 'uomTwo' ? updated[index].item?.uomTwo?.uom :
                     values.sale_unit === 'uomThree' ? updated[index].item?.uomThree?.uom :
                     updated[index].item?.uom1?.uom || 'Pcs'
    };
    setDispatchItems(updated);
  };

  const updateDispatchItem = (index, field, value) => {
    const updated = [...dispatchItems];
    
    if (field === 'Item_ID' && mode === 'create') {
      const selectedItem = items.find(item => item.id === parseInt(value));
      updated[index].Item = selectedItem?.itemName || '';
      updated[index].Item_ID = value;
      updated[index].item = selectedItem;
      
      if (selectedItem) {
        fetchBatchesForSingleItem(selectedItem.id);
      }
    } else if (field === 'Stock_Price') {
      updated[index][field] = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }

    setDispatchItems(updated);
  };

  const addNewBatchRow = (originalIndex) => {
    const originalItem = dispatchItems[originalIndex];
    const newRow = {
      Line_Id: parseFloat(originalItem.Line_Id) + 0.1 + (Math.random() * 0.01),
      Batch_Number: '',
      Item: `${originalItem.Item} (Additional Batch)`,
      Item_ID: originalItem.Item_ID,
      Qty_in_SO: 0,
      Uom_SO: '-',
      QTY_Dispatched: 0,
      UOM_Dispatched: originalItem.UOM_Dispatched,
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: 'uom1',
      Stock_Price: originalItem.Stock_Price,
      isOriginalRow: false,
      isAdditionalBatch: true,
      item: originalItem.item,
      discountA: originalItem.discountA || 0,
      discountB: originalItem.discountB || 0,
      discountC: originalItem.discountC || 0
    };

    const newItems = [...dispatchItems];
    newItems.splice(originalIndex + 1, 0, newRow);
    setDispatchItems(newItems);
  };

  const addNewItem = () => {
    setDispatchItems([
      ...dispatchItems,
      {
        Line_Id: dispatchItems.length + 1,
        Batch_Number: '',
        Item: '',
        Item_ID: '',
        QTY_Dispatched: 0,
        UOM_Dispatched: 'Pcs',
        uom1_qty: 0,
        uom2_qty: 0,
        uom3_qty: 0,
        sale_unit: 'uom1',
        Stock_Price: 0,
        isOriginalRow: true,
        discountA: 0,
        discountB: 0,
        discountC: 0
      }
    ]);
  };

  const removeItem = (index) => {
    if (dispatchItems.length > 1) {
      setDispatchItems(dispatchItems.filter((_, i) => i !== index));
    }
  };

  const getAvailableStock = (itemId, batchno) => {
    if (!itemId || !batchno) return 0;
    const batches = availableBatches[itemId] || [];
    const batch = batches.find(b => b.batchno === batchno);
    return batch ? parseFloat(batch.available_qty_uom1) || 0 : 0;
  };

  const getBatchOptions = (itemId) => {
    const batches = availableBatches[itemId] || [];
    if (mode === 'edit') {
      return batches;
    } else {
      return batches.filter(batch => parseFloat(batch.available_qty_uom1) > 0);
    }
  };

  const calculateTotal = (item) => {
    const price = parseFloat(item.Stock_Price) || 0;
    const uom2Quantity = parseFloat(item.uom2_qty) || 0;
    
    return (price * uom2Quantity).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'create' && !dispatchData.COA_ID) {
      setMessage({ type: 'error', text: 'Please select a customer' });
      return;
    }

    let itemsToSubmit;
    if (mode === 'edit') {
      itemsToSubmit = dispatchItems;
    } else {
      itemsToSubmit = dispatchItems.filter(item => item.QTY_Dispatched > 0);
    }

    if (itemsToSubmit.length === 0) {
      setMessage({ type: 'error', text: 'No items to process' });
      return;
    }

    const itemsWithQuantity = itemsToSubmit.filter(item => item.QTY_Dispatched > 0);
    const missingBatch = itemsWithQuantity.find(item => !item.Batch_Number);
    if (missingBatch) {
      setMessage({ type: 'error', text: `Please select batch for: ${missingBatch.Item}` });
      return;
    }

    if (mode !== 'edit') {
      for (const item of itemsWithQuantity) {
        const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
        if (item.QTY_Dispatched > availableStock) {
          setMessage({ 
            type: 'error', 
            text: `${item.Item}: Cannot dispatch ${item.QTY_Dispatched}, only ${availableStock} available in ${item.Batch_Number}` 
          });
          return;
        }
      }
    }
    
    setLoading(true);

    try {
      const dispatchPayload = {
        stockMain: {
          Stock_Type_ID: 12,
          COA_ID: dispatchData.COA_ID,
          Date: dispatchData.Date,
          Status: dispatchData.Status,
          Purchase_Type: dispatchData.Dispatch_Type,
          Order_Main_ID: salesOrder?.ID || null
        },
        stockDetails: itemsToSubmit.map(item => ({
          Line_Id: item.Line_Id,
          Item_ID: item.Item_ID,
          batchno: item.Batch_Number,
          Stock_Price: parseFloat(item.Stock_Price) || 0,
          Stock_out_UOM_Qty: item.uom1_qty || 0,
          Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
          Stock_out_UOM3_Qty: item.uom3_qty || 0,
          Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
          Discount_A: item.discountA || 0,
          Discount_B: item.discountB || 0,
          Discount_C: item.discountC || 0
        }))
      };

      const url = mode === 'edit' 
        ? `http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`
        : `http://${window.location.hostname}:4000/api/dispatch`;
      
      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dispatchPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (updateOrderStatus && salesOrder?.ID) {
          try {
            await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${salesOrder.ID}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: selectedOrderStatus.trim() })
            });
          } catch (statusError) {
            console.warn('Error updating order status:', statusError);
          }
        }

        setMessage({ type: 'success', text: `Dispatch ${mode === 'edit' ? 'updated' : 'created'} successfully!` });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to process dispatch' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process dispatch' });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center">
            <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full mr-3"></div>
            <span>Loading dispatch data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-auto">
        
        <div className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold">
              {mode === 'edit' ? `Edit Dispatch ${dispatchData.Dispatch_Number}` : 
               mode === 'create' ? 'Create New Dispatch' : 
               'Create Dispatch from Sales Order'}
            </h2>
            {mode === 'fromOrder' && salesOrder && <p className="text-sm opacity-90">From SO: {salesOrder.Number}</p>}
            {mode === 'edit' && <p className="text-sm opacity-90">ID: {dispatchId}</p>}
          </div>
          <button onClick={onClose} className="text-white text-2xl">×</button>
        </div>

        {message.text && (
          <div className={`m-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          <div className="bg-blue-50 p-4 rounded mb-4">
            <h3 className="font-bold mb-3">Dispatch Information</h3>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sales Order</label>
                <input value={dispatchData.Sales_Order_Number || (mode === 'create' ? 'Standalone' : 'N/A')} className="w-full p-2 bg-gray-100 border rounded" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dispatch Number</label>
                <input value={dispatchData.Dispatch_Number || 'Auto Generated'} className="w-full p-2 bg-gray-100 border rounded" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                {isFromOrder ? (
                  <input value={dispatchData.Name_of_Customer} className="w-full p-2 bg-gray-100 border rounded" disabled />
                ) : (
                  <select
                    value={dispatchData.COA_ID}
                    onChange={(e) => {
                      const customer = customers.find(c => c.id === parseInt(e.target.value));
                      setDispatchData(prev => ({ ...prev, COA_ID: e.target.value, Name_of_Customer: customer?.acName || '' }));
                    }}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.acName}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={dispatchData.Date}
                  onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          {mode === 'fromOrder' && (
            <div className="bg-green-50 p-4 rounded mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={updateOrderStatus}
                  onChange={(e) => setUpdateOrderStatus(e.target.checked)}
                  className="mr-2"
                />
                Update Sales Order Status
                {updateOrderStatus && (
                  <select value={selectedOrderStatus} onChange={(e) => setSelectedOrderStatus(e.target.value)} className="ml-4 px-3 py-1 border rounded">
                    <option value="Partial">Partial</option>
                    <option value="Complete">Complete</option>
                  </select>
                )}
              </label>
            </div>
          )}

          <div className="border rounded mb-4 overflow-hidden">
            <div className="bg-gray-100 p-3 flex justify-between items-center">
              <h3 className="font-bold">Items to Dispatch ({dispatchItems.length})</h3>
              {mode === 'create' && (
                <button type="button" onClick={addNewItem} className="bg-green-600 text-white px-3 py-1 rounded">
                  + Add Item
                </button>
              )}
            </div>
            
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-3 py-2 text-left">Line</th>
                  <th className="px-3 py-2 text-left">Batch</th>
                  <th className="px-3 py-2 text-left">Item</th>
                  {mode === 'fromOrder' && (
                    <>
                      <th className="px-3 py-2 text-center bg-blue-200">SO Qty</th>
                      <th className="px-3 py-2 text-center bg-blue-200">UOM</th>
                    </>
                  )}
                  <th className="px-3 py-2 text-center bg-orange-100">Available</th>
                  <th className="px-3 py-2 text-center bg-green-100">Quantity</th>
                  <th className="px-3 py-2 text-center bg-green-100">Price</th>
                  <th className="px-3 py-2 text-center bg-green-100">Total</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dispatchItems.map((item, index) => (
                  <tr key={index} className={`border-b ${item.isAdditionalBatch ? 'bg-yellow-50' : ''}`}>
                    <td className="px-3 py-2 text-center">{item.Line_Id}</td>
                    
                    {/* UPDATED: Batch selection with COA names */}
                    <td className="px-3 py-2">
                      <select
                        value={item.Batch_Number}
                        onChange={(e) => updateDispatchItem(index, 'Batch_Number', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        required={item.QTY_Dispatched > 0}
                      >
                        <option value="">{batchLoading ? 'Loading...' : `Select Batch (${getBatchOptions(item.Item_ID).length})`}</option>
                        {getBatchOptions(item.Item_ID).map((batch, bIdx) => (
                          <option key={bIdx} value={batch.batchno}>
                            {/* UPDATED: Show COA name with batch number */}
                            {getCoaNameById(batch.batchno)} ({batch.batchno}) - Stock: {batch.available_qty_uom1}
                            {mode === 'edit' && batch.current_dispatch_uom1 > 0 && ` (+${batch.current_dispatch_uom1} current)`}
                          </option>
                        ))}
                      </select>
                      {/* Show selected batch info */}
                      {item.Batch_Number && (
                        <div className="text-xs text-blue-600 mt-1">
                          Selected: {getCoaNameById(item.Batch_Number)} (ID: {item.Batch_Number})
                        </div>
                      )}
                    </td>
                    
                    <td className="px-3 py-2">
                      {isFromOrder ? (
                        <div className="bg-gray-100 p-2 rounded">{item.Item}</div>
                      ) : (
                        <select
                          value={item.Item_ID}
                          onChange={(e) => updateDispatchItem(index, 'Item_ID', e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                          required
                        >
                          <option value="">Select Item</option>
                          {items.map(itm => (
                            <option key={itm.id} value={itm.id}>{itm.itemName}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    
                    {mode === 'fromOrder' && (
                      <>
                        <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Qty_in_SO : '-'}</td>
                        <td className="px-3 py-2 text-center bg-blue-50">{item.isOriginalRow ? item.Uom_SO : '-'}</td>
                      </>
                    )}
                    
                    <td className="px-3 py-2 text-center bg-orange-50">
                      <div className={`font-bold ${getAvailableStock(item.Item_ID, item.Batch_Number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.Batch_Number ? getAvailableStock(item.Item_ID, item.Batch_Number) : '-'}
                      </div>
                    </td>
                    
                    <td className="px-3 py-2 bg-green-50">
                      <UomConverter
                        itemId={item.Item_ID}
                        onChange={(values) => handleUomChange(index, values)}
                        initialValues={{
                          uom1_qty: item.uom1_qty?.toString() || '',
                          uom2_qty: item.uom2_qty?.toString() || '',
                          uom3_qty: item.uom3_qty?.toString() || '',
                          sale_unit: item.sale_unit || 'uom1'
                        }}
                        isPurchase={false}
                      />
                    </td>
                    
                    <td className="px-3 py-2 bg-green-50">
                      <input
                        type="number"
                        step="0.01"
                        value={item.Stock_Price || ''}
                        onChange={(e) => updateDispatchItem(index, 'Stock_Price', e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-center"
                      />
                    </td>
                    
                    <td className="px-3 py-2 text-center bg-green-50 font-bold">
                      {calculateTotal(item)}
                    </td>
                    
                    <td className="px-3 py-2 text-center">
                      <div className="flex flex-col space-y-1">
                        {((mode === 'fromOrder' || mode === 'edit') && item.isOriginalRow) && (
                          <button
                            type="button"
                            onClick={() => addNewBatchRow(index)}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                            title="Add additional batch for same item"
                          >
                            + Batch
                          </button>
                        )}
                        
                        {(
                          (mode === 'create' && dispatchItems.length > 1) ||
                          (mode === 'edit' && dispatchItems.length > 1) ||
                          (mode === 'fromOrder' && item.isAdditionalBatch) ||
                          item.isAdditionalBatch
                        ) && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            title="Remove this item/batch"
                          >
                            {item.isAdditionalBatch ? 'Remove' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading || batchLoading} className="px-6 py-2 bg-green-600 text-white rounded">
              {loading ? 'Processing...' : (mode === 'edit' ? 'Update Dispatch' : 'Create Dispatch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchModal;
