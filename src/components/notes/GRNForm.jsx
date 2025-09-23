// components/GRNForm.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SelectableTable from '../SelectableTable';
import UomConverter from '../UomConverter';

const GRNForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [grnData, setGrnData] = useState({
    Purchase_Order_Number: '',
    GRN_ID: 'Auto Generated',
    GRN_Number: 'Auto Generated',
    Supplier_Name: '',
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Purchase_Type: 'Local',
    Purchase_Order_Status: 'Partial',
    Batch_No: '',
    COA_ID: null
  });

  const [grnDetails, setGrnDetails] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setDataLoading(true);
      const baseUrl = `http://${window.location.hostname}:4000/api`;

      // Fetch Purchase Orders
      const poResponse = await fetch(`${baseUrl}/order?stockTypeId=1`);
      const poData = await poResponse.json();
      if (poData.success) {
        setPurchaseOrders(poData.data);
      }

      // Fetch Suppliers  
      const supplierResponse = await fetch(`${baseUrl}/z-coa/get`);
      const supplierData = await supplierResponse.json();
      if (supplierData.zCoaRecords) {
        setSuppliers(supplierData.zCoaRecords.filter(coa => coa.coaTypeId === 1));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setDataLoading(false);
    }
  };

  // Handle PO selection
  const handlePOSelection = (poId) => {
    const po = purchaseOrders.find(p => p.ID === poId);
    if (po) {
      setSelectedPO(po);
      setGrnData(prev => ({
        ...prev,
        Purchase_Order_Number: po.Number,
        Supplier_Name: po.account?.acName || '',
        COA_ID: po.COA_ID
      }));

      // Convert PO details to GRN details
      const grnItems = po.details.map(detail => ({
        Line_Id: detail.Line_Id,
        Item_ID: detail.Item_ID,
        Item_Name: detail.item?.itemName || '',
        Batch_Number: '',
        Qty_In_PO: detail.Stock_In_UOM_Qty,
        UOM_PO: detail.item?.uom1?.uom || 'Pcs',
        QTY_Received: 0,
        UOM_Received: detail.item?.uom1?.uom || 'Pcs',
        uom1_qty: 0,
        uom2_qty: 0,
        uom3_qty: 0,
        sale_unit: 'uom1',
        Stock_Price: detail.Price || 0
      }));

      setGrnDetails(grnItems);
    }
  };

  // Handle UOM changes for received quantities
  const handleUomChange = (index, values) => {
    const updatedDetails = [...grnDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      uom1_qty: values.uom1_qty || 0,
      uom2_qty: values.uom2_qty || 0,
      uom3_qty: values.uom3_qty || 0,
      QTY_Received: values.uom1_qty || 0, // Default to pieces
      sale_unit: values.sale_unit || 'uom1'
    };
    setGrnDetails(updatedDetails);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPO) {
      setMessage({ type: 'error', text: 'Please select a Purchase Order' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const baseUrl = `http://${window.location.hostname}:4000/api`;
      
      const grnPayload = {
        stockMain: {
          Stock_Type_ID: 1, // GRN type
          COA_ID: grnData.COA_ID,
          Date: grnData.Date,
          Status: grnData.Status,
          Purchase_Type: grnData.Purchase_Type,
          Purchase_Bachno: grnData.Batch_No,
          Order_Main_ID: selectedPO.ID
        },
        stockDetails: grnDetails.map(detail => ({
          Item_ID: detail.Item_ID,
          Line_Id: detail.Line_Id,
          Batch_id: detail.Batch_Number || null,
          Stock_Price: detail.Stock_Price,
          Stock_In_UOM_Qty: detail.uom1_qty,
          Stock_In_SKU_UOM_Qty: detail.uom2_qty,
          Stock_In_UOM3_Qty: detail.uom3_qty
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
        setTimeout(() => {
          router.push('/inventory/grn');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create GRN' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ type: 'error', text: 'Failed to submit GRN' });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Loading GRN data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">📦 Goods Receiving Note (GRN)</h1>
                  <p className="text-sm opacity-90">Receive items from Purchase Orders</p>
                </div>
                <button
                  onClick={() => router.push('/inventory/grn')}
                  className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`m-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6">
              {/* GRN Information */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">GRN Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* PO Selection */}
                  <div>
                    <SelectableTable
                      label="Purchase Order"
                      name="Purchase_Order_ID"
                      value={selectedPO?.ID}
                      onChange={(name, value) => handlePOSelection(value)}
                      options={purchaseOrders.map(po => ({
                        id: po.ID,
                        label: po.Number,
                        number: po.Number,
                        supplier: po.account?.acName,
                        date: new Date(po.Date).toLocaleDateString(),
                        status: po.Next_Status
                      }))}
                      placeholder="Select Purchase Order"
                      required={true}
                      displayKey="label"
                      valueKey="id"
                      columns={[
                        { key: 'number', label: 'PO Number', width: '30%' },
                        { key: 'supplier', label: 'Supplier', width: '40%' },
                        { key: 'date', label: 'Date', width: '30%' }
                      ]}
                      pageSize={8}
                    />
                  </div>

                  {/* GRN Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GRN Number</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      value="Auto Generated"
                      readOnly
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GRN Date</label>
                    <input
                      type="date"
                      value={grnData.Date}
                      onChange={(e) => setGrnData(prev => ({ ...prev, Date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Purchase Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Type</label>
                    <select
                      value={grnData.Purchase_Type}
                      onChange={(e) => setGrnData(prev => ({ ...prev, Purchase_Type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Local">Local</option>
                      <option value="Foreign">Foreign</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                </div>

                {/* Supplier Info */}
                {selectedPO && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Supplier Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Supplier:</span> {selectedPO.account?.acName}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {selectedPO.account?.city || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GRN Items */}
              {selectedPO && grnDetails.length > 0 && (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b">
                    <h3 className="text-lg font-medium text-gray-800">Items to Receive</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Line</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Item</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">Ordered Qty</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">Received Qty (UOM)</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Batch</th>
                          {/* <th className="px-3 py-2 text-right font-medium text-gray-700">Price</th> */}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {grnDetails.map((detail, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-3">
                              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                                {detail.Line_Id}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="font-medium text-gray-900">{detail.Item_Name}</div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                                {detail.Qty_In_PO} {detail.UOM_PO}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <UomConverter
                                itemId={detail.Item_ID}
                                onChange={(values) => handleUomChange(index, values)}
                                initialValues={{
                                  uom1_qty: detail.uom1_qty?.toString() || '',
                                  uom2_qty: detail.uom2_qty?.toString() || '',
                                  uom3_qty: detail.uom3_qty?.toString() || '',
                                  sale_unit: detail.sale_unit || 'uom1'
                                }}
                                isPurchase={true}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={detail.Batch_Number}
                                onChange={(e) => {
                                  const updated = [...grnDetails];
                                  updated[index].Batch_Number = e.target.value;
                                  setGrnDetails(updated);
                                }}
                                placeholder="Batch #"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                            {/* <td className="px-3 py-3 text-right font-medium">
                              {parseFloat(detail.Stock_Price).toFixed(2)}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => router.push('/inventory/grn')}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedPO}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>
    </div>
  );
};

export default GRNForm;
