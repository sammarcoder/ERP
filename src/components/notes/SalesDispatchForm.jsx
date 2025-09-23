// components/SalesDispatchForm.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SelectableTable from './SelectableTable';
import UomConverter from './UomConverter';

const SalesDispatchForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [dispatchData, setDispatchData] = useState({
    Sales_Order_Number: '',
    Dispatch_ID: 'Auto Generated',
    Dispatch_Number: 'Auto Generated',
    Customer_Name: '',
    Date: new Date().toISOString().split('T')[0],
    Status: 'UnPost',
    Sales_Order_Status: 'Partial',
    COA_ID: null
  });

  const [dispatchDetails, setDispatchDetails] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedSO, setSelectedSO] = useState(null);
  const [customers, setCustomers] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setDataLoading(true);
      const baseUrl = `http://${window.location.hostname}:4000/api`;

      // Fetch Sales Orders
      const soResponse = await fetch(`${baseUrl}/order?stockTypeId=2`);
      const soData = await soResponse.json();
      if (soData.success) {
        setSalesOrders(soData.data);
      }

      // Fetch Customers
      const customerResponse = await fetch(`${baseUrl}/z-coa/get`);
      const customerData = await customerResponse.json();
      if (customerData.zCoaRecords) {
        setCustomers(customerData.zCoaRecords.filter(coa => coa.coaTypeId === 2));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setDataLoading(false);
    }
  };

  // Handle SO selection
  const handleSOSelection = (soId) => {
    const so = salesOrders.find(s => s.ID === soId);
    if (so) {
      setSelectedSO(so);
      setDispatchData(prev => ({
        ...prev,
        Sales_Order_Number: so.Number,
        Customer_Name: so.account?.acName || '',
        COA_ID: so.COA_ID
      }));

      // Convert SO details to Dispatch details
      const dispatchItems = so.details.map(detail => ({
        Line_Id: detail.Line_Id,
        Item_ID: detail.Item_ID,
        Item_Name: detail.item?.itemName || '',
        Batch_Number: '',
        Qty_In_SO: detail.sale_unit === 'uom1' ? detail.uom1_qty :
                   detail.sale_unit === 'uomTwo' ? detail.uom2_qty : 
                   detail.sale_unit === 'uomThree' ? detail.uom3_qty : detail.Stock_out_UOM_Qty,
        UOM_SO: detail.sale_unit === 'uom1' ? detail.item?.uom1?.uom :
                detail.sale_unit === 'uomTwo' ? detail.item?.uomTwo?.uom :
                detail.sale_unit === 'uomThree' ? detail.item?.uomThree?.uom : 'Pcs',
        QTY_Dispatched: 0,
        UOM_Dispatch: detail.sale_unit === 'uom1' ? detail.item?.uom1?.uom : 'Pcs',
        uom1_qty: 0,
        uom2_qty: 0,
        uom3_qty: 0,
        sale_unit: detail.sale_unit || 'uom1',
        Stock_Price: detail.Price || 0
      }));

      setDispatchDetails(dispatchItems);
    }
  };

  // Handle UOM changes for dispatched quantities
  const handleUomChange = (index, values) => {
    const updatedDetails = [...dispatchDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      uom1_qty: values.uom1_qty || 0,
      uom2_qty: values.uom2_qty || 0,
      uom3_qty: values.uom3_qty || 0,
      QTY_Dispatched: values.sale_unit === 'uom1' ? values.uom1_qty :
                      values.sale_unit === 'uomTwo' ? values.uom2_qty :
                      values.sale_unit === 'uomThree' ? values.uom3_qty : values.uom1_qty,
      sale_unit: values.sale_unit || 'uom1'
    };
    setDispatchDetails(updatedDetails);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSO) {
      setMessage({ type: 'error', text: 'Please select a Sales Order' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const baseUrl = `http://${window.location.hostname}:4000/api`;
      
      const dispatchPayload = {
        stockMain: {
          Stock_Type_ID: 2, // Dispatch type
          COA_ID: dispatchData.COA_ID,
          Date: dispatchData.Date,
          Status: dispatchData.Status,
          Order_Main_ID: selectedSO.ID
        },
        stockDetails: dispatchDetails.map(detail => ({
          Item_ID: detail.Item_ID,
          Line_Id: detail.Line_Id,
          Batch_id: detail.Batch_Number || null,
          Stock_Price: detail.Stock_Price,
          Stock_out_UOM_Qty: detail.uom1_qty,
          Stock_out_SKU_UOM_Qty: detail.uom2_qty,
          Stock_out_UOM3_Qty: detail.uom3_qty
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
        setTimeout(() => {
          router.push('/inventory/dispatch');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create dispatch' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ type: 'error', text: 'Failed to submit dispatch' });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-4 text-gray-600">Loading dispatch data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">🚚 Sales Dispatch</h1>
                  <p className="text-sm opacity-90">Dispatch items from Sales Orders</p>
                </div>
                <button
                  onClick={() => router.push('/inventory/dispatch')}
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
              {/* Dispatch Information */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Dispatch Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* SO Selection */}
                  <div>
                    <SelectableTable
                      label="Sales Order"
                      name="Sales_Order_ID"
                      value={selectedSO?.ID}
                      onChange={(name, value) => handleSOSelection(value)}
                      options={salesOrders.map(so => ({
                        id: so.ID,
                        label: so.Number,
                        number: so.Number,
                        customer: so.account?.acName,
                        date: new Date(so.Date).toLocaleDateString(),
                        status: so.Next_Status
                      }))}
                      placeholder="Select Sales Order"
                      required={true}
                      displayKey="label"
                      valueKey="id"
                      columns={[
                        { key: 'number', label: 'SO Number', width: '30%' },
                        { key: 'customer', label: 'Customer', width: '40%' },
                        { key: 'date', label: 'Date', width: '30%' }
                      ]}
                      pageSize={8}
                    />
                  </div>

                  {/* Dispatch Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Number</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      value="Auto Generated"
                      readOnly
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Date</label>
                    <input
                      type="date"
                      value={dispatchData.Date}
                      onChange={(e) => setDispatchData(prev => ({ ...prev, Date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Customer Info */}
                {selectedSO && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Customer:</span> {selectedSO.account?.acName}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {selectedSO.account?.city || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dispatch Items */}
              {selectedSO && dispatchDetails.length > 0 && (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b">
                    <h3 className="text-lg font-medium text-gray-800">Items to Dispatch</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Line</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Item</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">Ordered Qty</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">Dispatch Qty (UOM)</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Batch</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dispatchDetails.map((detail, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-3">
                              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs">
                                {detail.Line_Id}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="font-medium text-gray-900">{detail.Item_Name}</div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                                {detail.Qty_In_SO} {detail.UOM_SO}
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
                                isPurchase={false}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={detail.Batch_Number}
                                onChange={(e) => {
                                  const updated = [...dispatchDetails];
                                  updated[index].Batch_Number = e.target.value;
                                  setDispatchDetails(updated);
                                }}
                                placeholder="Batch #"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                            <td className="px-3 py-3 text-right font-medium">
                              ₹{parseFloat(detail.Stock_Price).toFixed(2)}
                            </td>
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
                  onClick={() => router.push('/inventory/dispatch')}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedSO}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
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
                      Create Dispatch
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

export default SalesDispatchForm;
