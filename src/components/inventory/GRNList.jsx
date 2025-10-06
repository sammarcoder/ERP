// components/GRNModal.jsx - FIXED all issues
'use client'
import React, { useState, useEffect } from 'react';
import UomConverter from '../UomConverter';

const GRNModal = ({ 
  purchaseOrder = null,    
  grnId = null,           
  mode = 'fromOrder',     // 'fromOrder', 'create', 'edit'
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
    Batch_No: `BATCH-${Date.now()}`
  });

  const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('Partial');
  const [receivedItems, setReceivedItems] = useState([]);
  
  // For create/edit modes only
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    initializeModal();
  }, [mode, purchaseOrder, grnId]);

  const initializeModal = async () => {
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
      Batch_No: `BATCH-${Date.now()}`
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
      isReadonly: true // FIXED: Mark fields as readonly for order mode
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
        
        setGrnData({
          Purchase_Order_Number: grn.order?.Number || 'Standalone GRN',
          GRN_ID: grn.ID,
          GRN_Number: grn.Number,
          Name_of_Supplier: grn.account?.acName || '',
          COA_ID: grn.COA_ID,
          Date: grn.Date.split('T')[0],
          Status: grn.Status,
          Purchase_Type: grn.Purchase_Type,
          Batch_No: grn.batchno || ''
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
          isReadonly: grn.Order_Main_ID ? true : false // FIXED: Readonly if from order
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
      isReadonly: false // FIXED: Fully editable for create mode
    }]);
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

  // FIXED: Handle batch number changes with auto-fill
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
      // FIXED: Auto-fill batch to all items when changed
      if (mode === 'fromOrder' || mode === 'edit') {
        // Update main batch number
        setGrnData(prev => ({ ...prev, Batch_No: value }));
        
        // Auto-fill to all items if they don't have individual batch numbers
        updated.forEach((item, idx) => {
          if (!item.Batch_Number || idx === index) {
            updated[idx].Batch_Number = value;
          }
        });
        
        console.log(`✅ Auto-filled batch ${value} to all items`);
      } else {
        // Only update current item for create mode
        updated[index][field] = value;
      }
    } else {
      updated[index][field] = value;
    }
    
    setReceivedItems(updated);
  };

  // FIXED: Auto-fill batch when main batch number changes
  const updateGrnData = (field, value) => {
    setGrnData(prev => ({ ...prev, [field]: value }));
    
    // FIXED: Auto-fill batch to all items when main batch changes
    if (field === 'Batch_No' && (mode === 'fromOrder' || mode === 'edit')) {
      const updated = receivedItems.map(item => ({
        ...item,
        Batch_Number: item.Batch_Number || value // Fill only if empty
      }));
      setReceivedItems(updated);
      console.log(`✅ Auto-filled main batch ${value} to all items`);
    }
  };

  const addNewItem = () => {
    setReceivedItems([
      ...receivedItems,
      {
        Line_Id: receivedItems.length + 1,
        Batch_Number: grnData.Batch_No, // FIXED: Use main batch by default
        Item: '',
        Item_ID: '',
        QTY_Received: 0,
        UOM_Received: 'Pcs',
        uom1_qty: 0,
        uom2_qty: 0,
        uom3_qty: 0,
        sale_unit: 'uom1',
        Stock_Price: 0,
        isReadonly: mode === 'fromOrder' // FIXED: Readonly based on mode
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
      setMessage({ type: 'error', text: 'Batch number is required' });
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
          batchno: grnData.Batch_No
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
          <div className={`m-4 p-4 rounded-lg border ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
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
                {/* FIXED: Readonly for order mode, editable for create/edit standalone */}
                {mode === 'fromOrder' ? (
                  <div className="bg-gray-100 p-2 rounded font-medium text-green-600">
                    {grnData.Name_of_Supplier}
                  </div>
                ) : (
                  <select
                    value={grnData.COA_ID}
                    onChange={(e) => {
                      const selectedSupplier = suppliers.find(s => s.id === parseInt(e.target.value));
                      setGrnData(prev => ({ 
                        ...prev, 
                        COA_ID: e.target.value,
                        Name_of_Supplier: selectedSupplier?.acName || '' 
                      }));
                    }}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.acName}
                      </option>
                    ))}
                  </select>
                )}
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
              <div>
                <label className="font-medium text-gray-700 block mb-1">Main Batch No</label>
                <input
                  type="text"
                  value={grnData.Batch_No}
                  onChange={(e) => updateGrnData('Batch_No', e.target.value)}
                  placeholder="Enter batch number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="text-xs text-blue-600 mt-1">Auto-fills to all items</div>
              </div>
            </div>
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
                      </td>
                      
                      <td className="px-3 py-3">
                        {/* FIXED: Item field restrictions */}
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
