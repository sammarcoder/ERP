// // components/inventory/DispatchModal.jsx
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const DispatchModal = ({ salesOrder, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [dispatchData, setDispatchData] = useState({
//     Sales_Order_Number: salesOrder.Number,
//     Sales_Dispatch_ID: 'Auto Generated',
//     Sales_Dispatch_Number: 'Auto Generated',
//     Name_of_Buyer: salesOrder.account?.acName || '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Sales_Order_Status: 'Partial'
//   });

//   const [dispatchItems, setDispatchItems] = useState([]);

//   useEffect(() => {
//     // Initialize dispatch items from SO
//     const items = salesOrder.details.map(detail => ({
//       Line_Id: detail.Line_Id,
//       Batch_Number: '',
//       Item: detail.item?.itemName || '',
//       Item_ID: detail.Item_ID,
//       Qty_in_SO: detail.sale_unit === 'uom1' ? detail.uom1_qty :
//                  detail.sale_unit === 'uomTwo' ? detail.uom2_qty :
//                  detail.sale_unit === 'uomThree' ? detail.uom3_qty : detail.Stock_out_UOM_Qty,
//       Uom_SO: detail.sale_unit === 'uom1' ? detail.item?.uom1?.uom :
//               detail.sale_unit === 'uomTwo' ? detail.item?.uomTwo?.uom :
//               detail.sale_unit === 'uomThree' ? detail.item?.uomThree?.uom : 'Pcs',
//       QTY_Dispatched: 0,
//       UOM_Dispatch: detail.item?.uom1?.uom || 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: detail.sale_unit || 'uom1'
//     }));
//     setDispatchItems(items);
//   }, [salesOrder]);

//   const handleUomChange = (index, values) => {
//     const updated = [...dispatchItems];
//     updated[index] = {
//       ...updated[index],
//       uom1_qty: values.uom1_qty || 0,
//       uom2_qty: values.uom2_qty || 0,
//       uom3_qty: values.uom3_qty || 0,
//       QTY_Dispatched: values.sale_unit === 'uom1' ? values.uom1_qty :
//                       values.sale_unit === 'uomTwo' ? values.uom2_qty :
//                       values.sale_unit === 'uomThree' ? values.uom3_qty : values.uom1_qty,
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
//           Stock_Type_ID: 2, // Dispatch Type
//           COA_ID: salesOrder.COA_ID,
//           Date: dispatchData.Date,
//           Status: dispatchData.Status,
//           Order_Main_ID: salesOrder.ID
//         },
//         stockDetails: dispatchItems.map(item => ({
//           Line_Id: item.Line_Id,
//           Item_ID: item.Item_ID,
//           Batch_id: item.Batch_Number || null,
//           Stock_Price: 0,
//           Stock_out_UOM_Qty: item.uom1_qty,
//           Stock_out_SKU_UOM_Qty: item.uom2_qty,
//           Stock_out_UOM3_Qty: item.uom3_qty
//         }))
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

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-auto">
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">🚚 Create Sales Dispatch</h2>
//             <p className="text-sm opacity-90">From SO: {salesOrder.Number}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-200 text-2xl font-bold"
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
//           {/* Dispatch Information */}
//           <div className="bg-yellow-50 p-4 rounded-lg mb-4">
//             <h3 className="font-bold text-gray-800 mb-3">Sales Dispatch Information</h3>
            
//             <div className="grid grid-cols-4 gap-4 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700">Sales Order Number</label>
//                 <div className="bg-gray-100 p-2 rounded font-bold">{dispatchData.Sales_Order_Number}</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Dispatch ID</label>
//                 <div className="bg-gray-100 p-2 rounded">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Dispatch Number</label>
//                 <div className="bg-gray-100 p-2 rounded">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Customer Name</label>
//                 <div className="bg-gray-100 p-2 rounded font-medium">{dispatchData.Name_of_Buyer}</div>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700">Date</label>
//                 <input
//                   type="date"
//                   value={dispatchData.Date}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Status</label>
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
//                 <label className="font-medium text-gray-700">SO Status</label>
//                 <select
//                   value={dispatchData.Sales_Order_Status}
//                   onChange={(e) => setDispatchData(prev => ({ ...prev, Sales_Order_Status: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="Partial">Partial</option>
//                   <option value="Complete">Complete</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Items Table */}
//           <div className="bg-white border rounded-lg overflow-hidden mb-4">
//             <div className="bg-gray-100 p-3">
//               <h3 className="font-bold text-gray-800">Items to Dispatch</h3>
//             </div>
            
//             <table className="w-full text-sm">
//               <thead className="bg-yellow-200">
//                 <tr>
//                   <th className="px-3 py-2 text-left font-bold">Line_Id</th>
//                   <th className="px-3 py-2 text-left font-bold">Batch Number</th>
//                   <th className="px-3 py-2 text-left font-bold">Item</th>
//                   <th className="px-3 py-2 text-center font-bold bg-yellow-300">Qty in SO</th>
//                   <th className="px-3 py-2 text-center font-bold bg-yellow-300">Uom SO</th>
//                   <th className="px-3 py-2 text-center font-bold bg-green-200">QTY Dispatched</th>
//                   <th className="px-3 py-2 text-center font-bold bg-green-200">UOM Dispatch</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {dispatchItems.map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-3 py-3 text-center font-bold">
//                       {item.Line_Id}
//                     </td>
//                     <td className="px-3 py-3">
//                       <input
//                         type="text"
//                         value={item.Batch_Number}
//                         onChange={(e) => {
//                           const updated = [...dispatchItems];
//                           updated[index].Batch_Number = e.target.value;
//                           setDispatchItems(updated);
//                         }}
//                         placeholder="Batch #"
//                         className="w-full px-2 py-1 border rounded text-sm"
//                       />
//                     </td>
//                     <td className="px-3 py-3 font-medium">
//                       {item.Item}
//                     </td>
//                     <td className="px-3 py-3 text-center bg-yellow-50 font-bold">
//                       {item.Qty_in_SO}
//                     </td>
//                     <td className="px-3 py-3 text-center bg-yellow-50 font-medium">
//                       {item.Uom_SO}
//                     </td>
//                     <td className="px-3 py-3 bg-green-50">
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
//                     <td className="px-3 py-3 text-center bg-green-50 font-bold">
//                       {item.QTY_Dispatched} {item.UOM_Dispatch}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
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
//               disabled={loading}
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




































































// components/inventory/DispatchModal.jsx
'use client'
import React, { useState, useEffect } from 'react';
import UomConverter from '../UomConverter';

const DispatchModal = ({ salesOrder, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [dispatchData, setDispatchData] = useState({
    Sales_Order_Number: salesOrder.Number,
    Sales_Dispatch_ID: 'Auto / Prime Key / Disable',
    Sales_Dispatch_Number: 'Auto as per type Sequence',
    Name_of_Buyer: salesOrder.account?.acName || '',
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Sales_Order_Status: 'Partial'
  });

  const [availableBatches, setAvailableBatches] = useState({}); // Item_ID -> batches with qty
  const [dispatchItems, setDispatchItems] = useState([]);

  // Fetch available batches for all items in SO
  useEffect(() => {
    const fetchAvailableBatches = async () => {
      try {
        setDataLoading(true);
        const baseUrl = `http://${window.location.hostname}:4000/api`;
        
        // Get all unique item IDs from sales order
        const itemIds = [...new Set(salesOrder.details.map(d => d.Item_ID))];
        
        const batchPromises = itemIds.map(async (itemId) => {
          const response = await fetch(`${baseUrl}/stock/batches/available/${itemId}`);
          const result = await response.json();
          return { itemId, batches: result.success ? result.data : [] };
        });

        const batchResults = await Promise.all(batchPromises);
        const batchMap = {};
        
        batchResults.forEach(({ itemId, batches }) => {
          batchMap[itemId] = batches;
        });
        
        setAvailableBatches(batchMap);
        
        // Initialize dispatch items with batch breakdown
        initializeDispatchItems();
        
      } catch (error) {
        console.error('Error fetching available batches:', error);
        setMessage({ type: 'error', text: 'Failed to load available stock' });
      } finally {
        setDataLoading(false);
      }
    };

    fetchAvailableBatches();
  }, [salesOrder]);

  // ADVANCED: Initialize dispatch items with multi-batch logic
  const initializeDispatchItems = () => {
    const dispatchRows = [];
    
    salesOrder.details.forEach(detail => {
      const requiredQty = detail.sale_unit === 'uom1' ? detail.uom1_qty :
                         detail.sale_unit === 'uomTwo' ? detail.uom2_qty :
                         detail.sale_unit === 'uomThree' ? detail.uom3_qty : detail.Stock_out_UOM_Qty;
      
      const batches = availableBatches[detail.Item_ID] || [];
      
      if (batches.length === 0) {
        // No batches available - create single row with zero qty
        dispatchRows.push({
          Line_Id: detail.Line_Id,
          Item_ID: detail.Item_ID,
          Item: detail.item?.itemName || '',
          Batch_Number: 'No Stock Available',
          Available_Qty: 0,
          Qty_in_SO: requiredQty,
          Uom_SO: detail.sale_unit === 'uom1' ? detail.item?.uom1?.uom :
                  detail.sale_unit === 'uomTwo' ? detail.item?.uomTwo?.uom :
                  detail.sale_unit === 'uomThree' ? detail.item?.uomThree?.uom : 'Pcs',
          QTY_Dispatched: 0,
          UOM_Dispatch: detail.item?.uom1?.uom || 'Pcs',
          uom1_qty: 0,
          uom2_qty: 0,
          uom3_qty: 0,
          sale_unit: detail.sale_unit || 'uom1',
          Stock_Price: detail.Price || 0,
          original_line_id: detail.Line_Id,
          canEdit: false
        });
      } else {
        // ADVANCED: Create rows for each batch with available quantity
        let remainingQty = requiredQty;
        
        batches.forEach((batch, batchIndex) => {
          const availableInBatch = batch.available_qty;
          const dispatchFromBatch = Math.min(remainingQty, availableInBatch);
          
          dispatchRows.push({
            Line_Id: `${detail.Line_Id}.${batchIndex + 1}`,
            Item_ID: detail.Item_ID,
            Item: detail.item?.itemName || '',
            Batch_Number: batch.batch_number,
            Available_Qty: availableInBatch,
            Qty_in_SO: batchIndex === 0 ? requiredQty : 0, // Show total only in first row
            Uom_SO: detail.sale_unit === 'uom1' ? detail.item?.uom1?.uom :
                    detail.sale_unit === 'uomTwo' ? detail.item?.uomTwo?.uom :
                    detail.sale_unit === 'uomThree' ? detail.item?.uomThree?.uom : 'Pcs',
            QTY_Dispatched: dispatchFromBatch,
            UOM_Dispatch: detail.item?.uom1?.uom || 'Pcs',
            uom1_qty: dispatchFromBatch,
            uom2_qty: 0,
            uom3_qty: 0,
            sale_unit: 'uom1',
            Stock_Price: detail.Price || 0,
            original_line_id: detail.Line_Id,
            batch_id: batch.batch_id,
            canEdit: true
          });
          
          remainingQty -= dispatchFromBatch;
          
          // If no more quantity needed, break
          if (remainingQty <= 0) return;
        });
      }
    });
    
    setDispatchItems(dispatchRows);
  };

  const handleUomChange = (index, values) => {
    const updated = [...dispatchItems];
    const maxAvailable = updated[index].Available_Qty;
    const requestedQty = values.uom1_qty || 0;
    
    // Don't allow dispatching more than available
    const actualQty = Math.min(requestedQty, maxAvailable);
    
    updated[index] = {
      ...updated[index],
      uom1_qty: actualQty,
      uom2_qty: values.uom2_qty || 0,
      uom3_qty: values.uom3_qty || 0,
      QTY_Dispatched: actualQty,
      sale_unit: values.sale_unit || 'uom1'
    };
    
    setDispatchItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const baseUrl = `http://${window.location.hostname}:4000/api`;
      
      const dispatchPayload = {
        stockMain: {
          Stock_Type_ID: 2,
          COA_ID: salesOrder.COA_ID,
          Date: dispatchData.Date,
          Status: dispatchData.Status,
          Order_Main_ID: salesOrder.ID
        },
        stockDetails: dispatchItems
          .filter(item => item.QTY_Dispatched > 0) // Only dispatch items with quantity
          .map((item, index) => ({
            Line_Id: index + 1,
            Item_ID: item.Item_ID,
            Batch_id: item.batch_id || null,
            Stock_Price: item.Stock_Price,
            Stock_out_UOM_Qty: item.uom1_qty,
            Stock_out_SKU_UOM_Qty: item.uom2_qty,
            Stock_out_UOM3_Qty: item.uom3_qty
          }))
      };

      const response = await fetch(`${baseUrl}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dispatchPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: 'Sales Dispatch created successfully!' });
        setTimeout(() => onSuccess(), 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create dispatch' });
      }
    } catch (error) {
      console.error('Dispatch creation error:', error);
      setMessage({ type: 'error', text: 'Failed to create dispatch' });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
            <span>Loading available stock batches...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-auto">
        
        {/* Header */}
        <div className="bg-yellow-400 text-black p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">🚚 Sales Dispatch</h2>
            <p className="text-sm">From SO: {salesOrder.Number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`m-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          {/* Dispatch Information Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
            {/* Row 1 */}
            <div>
              <label className="font-bold text-black">Sales Order Number</label>
              <div className="bg-gray-100 p-2 border rounded font-medium">
                🔍 {dispatchData.Sales_Order_Number}
              </div>
            </div>
            <div>
              <label className="font-bold text-black">Sales Dispatch ID</label>
              <div className="bg-gray-100 p-2 border rounded text-gray-600">
                Auto / Prime Key / Disable
              </div>
            </div>
            <div>
              <label className="font-bold text-black">Sales Dispatch Number</label>
              <div className="bg-gray-100 p-2 border rounded text-gray-600">
                Auto as per type Sequence
              </div>
            </div>
            <div>
              <label className="font-bold text-black">Name of Buyer</label>
              <div className="bg-gray-100 p-2 border rounded font-medium">
                {dispatchData.Name_of_Buyer}
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <label className="font-bold text-black">Date</label>
              <input
                type="date"
                value={dispatchData.Date}
                onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold text-black">Status</label>
              <select
                value={dispatchData.Status}
                onChange={(e) => setDispatchData(prev => ({ ...prev, Status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="UnPost">UnPost</option>
                <option value="Post">Post</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-black">Sales Order Status</label>
              <select
                value={dispatchData.Sales_Order_Status}
                onChange={(e) => setDispatchData(prev => ({ ...prev, Sales_Order_Status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="Partial">Partial</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div></div> {/* Empty cell for alignment */}
          </div>

          {/* Items Table with Multi-Batch Support */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-yellow-100 p-3 flex justify-between items-center">
              <h3 className="font-bold text-black">Items to Dispatch (Multi-Batch Support)</h3>
              <div className="text-xs text-gray-600">
                📊 Showing available stock by batch
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Line_Id</th>
                    <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Batch Number</th>
                    <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Item</th>
                    <th className="bg-purple-200 px-3 py-2 text-center font-bold border">Available</th>
                    <th className="bg-yellow-300 px-3 py-2 text-center font-bold border">Qty in SO</th>
                    <th className="bg-yellow-300 px-3 py-2 text-center font-bold border">Uom SO</th>
                    <th className="bg-green-200 px-3 py-2 text-center font-bold border">QTY Dispatched</th>
                    <th className="bg-green-200 px-3 py-2 text-center font-bold border">UOM Dispatch</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatchItems.map((item, index) => (
                    <tr key={index} className={`hover:bg-gray-50 border-b ${
                      item.Available_Qty === 0 ? 'bg-red-50' : ''
                    }`}>
                      <td className="px-3 py-3 text-center font-bold border">
                        {item.Line_Id}
                      </td>
                      
                      {/* Batch Number with Status */}
                      <td className="px-3 py-3 border">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          item.Available_Qty === 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.Batch_Number}
                        </div>
                      </td>
                      
                      <td className="px-3 py-3 border">
                        <div className="font-medium text-black">
                          {item.Item}
                        </div>
                      </td>
                      
                      {/* Available Stock (Purple) */}
                      <td className="px-3 py-3 text-center bg-purple-50 border">
                        <div className={`font-bold px-2 py-1 rounded ${
                          item.Available_Qty === 0 
                            ? 'bg-red-200 text-red-800' 
                            : 'bg-purple-200 text-purple-800'
                        }`}>
                          {item.Available_Qty}
                        </div>
                      </td>
                      
                      {/* SO Data (Yellow Background) */}
                      <td className="px-3 py-3 text-center bg-yellow-50 font-bold border">
                        {item.Qty_in_SO || '-'}
                      </td>
                      <td className="px-3 py-3 text-center bg-yellow-50 font-medium border">
                        {item.Uom_SO}
                      </td>
                      
                      {/* Dispatch Data (Green Background) */}
                      <td className="px-3 py-3 bg-green-50 border">
                        {item.canEdit ? (
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
                            maxQuantity={item.Available_Qty} // Limit to available stock
                          />
                        ) : (
                          <div className="text-center text-gray-500 font-medium">
                            No Stock Available
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center bg-green-50 font-bold border">
                        <div className={`px-2 py-1 rounded ${
                          item.QTY_Dispatched > 0 
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.QTY_Dispatched} {item.UOM_Dispatch}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="font-bold text-gray-800 mb-2">📊 Dispatch Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Items:</span> {dispatchItems.length}
              </div>
              <div>
                <span className="font-medium">Items with Stock:</span> {dispatchItems.filter(i => i.Available_Qty > 0).length}
              </div>
              <div>
                <span className="font-medium">Out of Stock:</span> {dispatchItems.filter(i => i.Available_Qty === 0).length}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || dispatchItems.filter(i => i.QTY_Dispatched > 0).length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Dispatch...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Dispatch ({dispatchItems.filter(i => i.QTY_Dispatched > 0).length} items)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchModal;
