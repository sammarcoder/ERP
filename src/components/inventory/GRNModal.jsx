// // components/inventory/GRNModal.jsx
// 'use client'
// import React, { useState, useEffect } from 'react';
// import UomConverter from '../UomConverter';

// const GRNModal = ({ purchaseOrder, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   const [grnData, setGrnData] = useState({
//     Purchase_Order_Number: purchaseOrder.Number,
//     GRN_ID: 'Auto Generated',
//     GRN_Number: 'Auto Generated', 
//     Name_of_Supplier: purchaseOrder.account?.acName || '',
//     Date: new Date().toISOString().split('T')[0],
//     Status: 'UnPost',
//     Purchase_Type: 'Local',
//     Purchase_Order_Status: 'Partial',
//     Batch_No: ''
//   });

//   const [receivedItems, setReceivedItems] = useState([]);

//   useEffect(() => {
//     // Initialize received items from PO
//     const items = purchaseOrder.details.map(detail => ({
//       Line_Id: detail.Line_Id,
//       Batch_Number: '',
//       Item: detail.item?.itemName || '',
//       Item_ID: detail.Item_ID,
//       Qty_in_PO: detail.Stock_In_UOM_Qty,
//       Uom_PO: detail.item?.uom1?.uom || 'Pcs',
//       QTY_Received: 0,
//       UOM_Received: detail.item?.uom1?.uom || 'Pcs',
//       uom1_qty: 0,
//       uom2_qty: 0,
//       uom3_qty: 0,
//       sale_unit: 'uom1'
//     }));
//     setReceivedItems(items);
//   }, [purchaseOrder]);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const baseUrl = `http://${window.location.hostname}:4000/api`;
      
//       const grnPayload = {
//         stockMain: {
//           Stock_Type_ID: 1, // GRN Type  
//           COA_ID: purchaseOrder.COA_ID,
//           Date: grnData.Date,
//           Status: grnData.Status,
//           Purchase_Type: grnData.Purchase_Type,
//           Purchase_Bachno: grnData.Batch_No,
//           Order_Main_ID: purchaseOrder.ID
//         },
//         stockDetails: receivedItems.map(item => ({
//           Line_Id: item.Line_Id,
//           Item_ID: item.Item_ID,
//           Batch_id: item.Batch_Number || null,
//           Stock_Price: 0,
//           Stock_In_UOM_Qty: item.uom1_qty,
//           Stock_In_SKU_UOM_Qty: item.uom2_qty,
//           Stock_In_UOM3_Qty: item.uom3_qty
//         }))
//       };

//       const response = await fetch(`${baseUrl}/grn`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(grnPayload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         setMessage({ type: 'success', text: 'GRN created successfully!' });
//         setTimeout(() => onSuccess(), 1500);
//       } else {
//         setMessage({ type: 'error', text: result.message || 'Failed to create GRN' });
//       }
//     } catch (error) {
//       console.error('GRN creation error:', error);
//       setMessage({ type: 'error', text: 'Failed to create GRN' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-auto">
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">📦 Create Goods Receiving Note</h2>
//             <p className="text-sm opacity-90">From PO: {purchaseOrder.Number}</p>
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
//           {/* GRN Information */}
//           <div className="bg-yellow-50 p-4 rounded-lg mb-4">
//             <h3 className="font-bold text-gray-800 mb-3">GRN Information</h3>
            
//             <div className="grid grid-cols-4 gap-4 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700">Purchase Order Number</label>
//                 <div className="bg-gray-100 p-2 rounded font-bold">{grnData.Purchase_Order_Number}</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">GRN ID</label>
//                 <div className="bg-gray-100 p-2 rounded">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">GRN Number</label>
//                 <div className="bg-gray-100 p-2 rounded">Auto Generated</div>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Supplier Name</label>
//                 <div className="bg-gray-100 p-2 rounded font-medium">{grnData.Name_of_Supplier}</div>
//               </div>
//             </div>

//             <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
//               <div>
//                 <label className="font-medium text-gray-700">Date</label>
//                 <input
//                   type="date"
//                   value={grnData.Date}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Date: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Status</label>
//                 <select
//                   value={grnData.Status}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Status: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="UnPost">UnPost</option>
//                   <option value="Post">Post</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Purchase Type</label>
//                 <select
//                   value={grnData.Purchase_Type}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Purchase_Type: e.target.value }))}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="Local">Local</option>
//                   <option value="Foreign">Foreign</option>
//                   <option value="Manufacturing">Manufacturing</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="font-medium text-gray-700">Batch No</label>
//                 <input
//                   type="text"
//                   value={grnData.Batch_No}
//                   onChange={(e) => setGrnData(prev => ({ ...prev, Batch_No: e.target.value }))}
//                   placeholder="Enter batch number"
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Items Table */}
//           <div className="bg-white border rounded-lg overflow-hidden mb-4">
//             <div className="bg-gray-100 p-3">
//               <h3 className="font-bold text-gray-800">Items to Receive</h3>
//             </div>
            
//             <table className="w-full text-sm">
//               <thead className="bg-yellow-200">
//                 <tr>
//                   <th className="px-3 py-2 text-left font-bold">Line_Id</th>
//                   <th className="px-3 py-2 text-left font-bold">Batch Number</th>
//                   <th className="px-3 py-2 text-left font-bold">Item</th>
//                   <th className="px-3 py-2 text-center font-bold bg-yellow-300">Qty in PO</th>
//                   <th className="px-3 py-2 text-center font-bold bg-yellow-300">Uom PO</th>
//                   <th className="px-3 py-2 text-center font-bold bg-green-200">QTY Received</th>
//                   <th className="px-3 py-2 text-center font-bold bg-green-200">UOM Received</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {receivedItems.map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-3 py-3 text-center font-bold">
//                       {item.Line_Id}
//                     </td>
//                     <td className="px-3 py-3">
//                       <input
//                         type="text"
//                         value={item.Batch_Number}
//                         onChange={(e) => {
//                           const updated = [...receivedItems];
//                           updated[index].Batch_Number = e.target.value;
//                           setReceivedItems(updated);
//                         }}
//                         placeholder="Batch #"
//                         className="w-full px-2 py-1 border rounded text-sm"
//                       />
//                     </td>
//                     <td className="px-3 py-3 font-medium">
//                       {item.Item}
//                     </td>
//                     <td className="px-3 py-3 text-center bg-yellow-50 font-bold">
//                       {item.Qty_in_PO}
//                     </td>
//                     <td className="px-3 py-3 text-center bg-yellow-50 font-medium">
//                       {item.Uom_PO}
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
//                         isPurchase={true}
//                       />
//                     </td>
//                     <td className="px-3 py-3 text-center bg-green-50 font-bold">
//                       {item.QTY_Received} {item.UOM_Received}
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
//               className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
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



















































































// components/inventory/GRNModal.jsx
'use client'
import React, { useState, useEffect } from 'react';
import UomConverter from '../UomConverter';

const GRNModal = ({ purchaseOrder, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [grnData, setGrnData] = useState({
    Purchase_Order_Number: purchaseOrder.Number,
    GRN_ID: 'Auto / Prime Key / Disable',
    GRN_Number: 'Auto as per type Sequence',
    Name_of_Supplier: purchaseOrder.account?.acName || '',
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Purchase_Type: 'Local',
    Purchase_Order_Status: 'Partial',
    Batch_No: '' // MAIN BATCH NUMBER
  });

  const [receivedItems, setReceivedItems] = useState([]);

  useEffect(() => {
    // Initialize received items from PO
    const items = purchaseOrder.details.map(detail => ({
      Line_Id: detail.Line_Id,
      Batch_Number: '', // Will be populated from main batch
      Item: detail.item?.itemName || '',
      Item_ID: detail.Item_ID,
      Qty_in_PO: detail.Stock_In_UOM_Qty,
      Uom_PO: detail.item?.uom1?.uom || 'Pcs',
      QTY_Received: 0,
      UOM_Received: detail.item?.uom1?.uom || 'Pcs',
      uom1_qty: 0,
      uom2_qty: 0,
      uom3_qty: 0,
      sale_unit: 'uom1'
    }));
    setReceivedItems(items);
  }, [purchaseOrder]);

  // FIXED: Update all items' batch numbers when main batch changes
  const handleMainBatchChange = (batchNo) => {
    setGrnData(prev => ({ ...prev, Batch_No: batchNo }));
    
    // Update all items with the same batch number
    const updatedItems = receivedItems.map(item => ({
      ...item,
      Batch_Number: batchNo
    }));
    setReceivedItems(updatedItems);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate batch number
    if (!grnData.Batch_No.trim()) {
      setMessage({ type: 'error', text: 'Please enter batch number' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const baseUrl = `http://${window.location.hostname}:4000/api`;
      
      const grnPayload = {
        stockMain: {
          Stock_Type_ID: 1,
          COA_ID: purchaseOrder.COA_ID,
          Date: grnData.Date,
          Status: grnData.Status,
          Purchase_Type: grnData.Purchase_Type,
          Purchase_Bachno: grnData.Batch_No, // Main batch number
          Order_Main_ID: purchaseOrder.ID
        },
        stockDetails: receivedItems.map(item => ({
          Line_Id: item.Line_Id,
          Item_ID: item.Item_ID,
          Batch_id: grnData.Batch_No, // Same batch for all items
          Stock_Price: 0,
          Stock_In_UOM_Qty: item.uom1_qty,
          Stock_In_SKU_UOM_Qty: item.uom2_qty,
          Stock_In_UOM3_Qty: item.uom3_qty
        }))
      };

      const response = await fetch(`${baseUrl}/grn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grnPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: 'GRN created successfully!' });
        setTimeout(() => onSuccess(), 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create GRN' });
      }
    } catch (error) {
      console.error('GRN creation error:', error);
      setMessage({ type: 'error', text: 'Failed to create GRN' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-auto">
        
        {/* Header */}
        <div className="bg-yellow-400 text-black p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">📦 Goods Receiving Note</h2>
            <p className="text-sm">From PO: {purchaseOrder.Number}</p>
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
          {/* GRN Information Grid - Based on Your Design */}
          <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
            {/* Row 1 */}
            <div>
              <label className="font-bold text-black">Purchase Order Number</label>
              <div className="bg-gray-100 p-2 border rounded font-medium">
                🔍 {grnData.Purchase_Order_Number}
              </div>
            </div>
            <div>
              <label className="font-bold text-black">GRN ID</label>
              <div className="bg-gray-100 p-2 border rounded text-gray-600">
                Auto / Prime Key / Disable
              </div>
            </div>
            <div>
              <label className="font-bold text-black">GRN Number</label>
              <div className="bg-gray-100 p-2 border rounded text-gray-600">
                Auto as per type Sequence
              </div>
            </div>
            <div>
              <label className="font-bold text-black">Name of Supplier</label>
              <div className="bg-gray-100 p-2 border rounded font-medium">
                {grnData.Name_of_Supplier}
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <label className="font-bold text-black">Date</label>
              <input
                type="date"
                value={grnData.Date}
                onChange={(e) => setGrnData(prev => ({ ...prev, Date: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold text-black">Status</label>
              <select
                value={grnData.Status}
                onChange={(e) => setGrnData(prev => ({ ...prev, Status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="UnPost">UnPost</option>
                <option value="Post">Post</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-black">Local / Foreign / Mfg</label>
              <select
                value={grnData.Purchase_Type}
                onChange={(e) => setGrnData(prev => ({ ...prev, Purchase_Type: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="Local">Local</option>
                <option value="Foreign">Foreign</option>
                <option value="Mfg">Manufacturing</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-black">Purchase Order Status</label>
              <select
                value={grnData.Purchase_Order_Status}
                onChange={(e) => setGrnData(prev => ({ ...prev, Purchase_Order_Status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="Partial">Partial</option>
                <option value="Complete">Complete</option>
              </select>
            </div>

            {/* Row 3 - MAIN BATCH NUMBER */}
            <div className="col-span-4">
              <label className="font-bold text-black">🏷️ Batch No (applies to all items)</label>
              <input
                type="text"
                value={grnData.Batch_No}
                onChange={(e) => handleMainBatchChange(e.target.value)}
                placeholder="Enter batch number for this shipment"
                className="w-full p-3 border-2 border-blue-300 rounded-lg font-bold text-lg bg-blue-50"
                required
              />
              <p className="text-xs text-gray-600 mt-1">This batch number will apply to all received items</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-yellow-100 p-3">
              <h3 className="font-bold text-black">Items to Receive</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Line_Id</th>
                    <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Batch Number</th>
                    <th className="bg-yellow-200 px-3 py-2 text-left font-bold border">Item</th>
                    <th className="bg-yellow-300 px-3 py-2 text-center font-bold border">Qty in PO</th>
                    <th className="bg-yellow-300 px-3 py-2 text-center font-bold border">Uom PO</th>
                    <th className="bg-green-200 px-3 py-2 text-center font-bold border">QTY Received</th>
                    <th className="bg-green-200 px-3 py-2 text-center font-bold border">UOM Received</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-b">
                      <td className="px-3 py-3 text-center font-bold border">
                        {item.Line_Id}
                      </td>
                      
                      {/* FIXED: Non-editable batch number - inherits from main */}
                      <td className="px-3 py-3 border">
                        <input
                          type="text"
                          value={item.Batch_Number}
                          readOnly
                          className="w-full px-2 py-1 bg-gray-100 border rounded text-sm cursor-not-allowed"
                          title="Batch number inherited from main batch"
                        />
                        {!grnData.Batch_No && (
                          <p className="text-xs text-gray-500 mt-1">Set main batch number first</p>
                        )}
                      </td>
                      
                      <td className="px-3 py-3 border">
                        <div className="font-medium text-black">
                          {item.Item}
                        </div>
                      </td>
                      
                      {/* PO Data (Yellow Background) */}
                      <td className="px-3 py-3 text-center bg-yellow-50 font-bold border">
                        {item.Qty_in_PO}
                      </td>
                      <td className="px-3 py-3 text-center bg-yellow-50 font-medium border">
                        {item.Uom_PO}
                      </td>
                      
                      {/* Received Data (Green Background) */}
                      <td className="px-3 py-3 bg-green-50 border">
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
                      <td className="px-3 py-3 text-center bg-green-50 font-bold border">
                        <div className="bg-green-100 px-2 py-1 rounded">
                          {item.QTY_Received} {item.UOM_Received}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              disabled={loading || !grnData.Batch_No}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating GRN...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create GRN
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
