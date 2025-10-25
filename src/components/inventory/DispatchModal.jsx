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

  // ✅ FUNCTION: Get UOM position number (1, 2, or 3)
  const getUomPositionNumber = (saleUnit, item) => {
    if (saleUnit === 'uom1') return 1;
    if (saleUnit === 'uomTwo') return 2;
    if (saleUnit === 'uomThree') return 3;
    return 1; // default
  };

  // In your stockDetails mapping:

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
    // console.log('this', availableBatches)
    // console.log('this is itemId',items,'122')
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
          // const response = await fetch(`http://${window.location.hostname}:4000/api/dispatch/available-batches/${item.Item_ID}`);
          const result = await response.json();

          if (result.success && result.data) {
            batchData[item.Item_ID] = result.data;
          }
        }
        // else{
        //   // alert('josdfjdgndfjbf no working ')
        // }
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

  // const getAvailableStock = (itemId, batchno) => {
  //   console.warn(itemId,batchno)
  //   if (!itemId || !batchno) return 0;
  //   const batches = availableBatches[itemId] || [];
  //   const batch = batches.find(b => b.batchno === batchno);
  //   return batch ? parseFloat(batch.available_qty_uom1) : 'hi';
  // };





  // ✅ DEBUG VERSION: getAvailableStock function
  const getAvailableStock = (itemId, batchNumber) => {
    console.log('=== getAvailableStock DEBUG ===');
    console.log('Input itemId:', itemId, typeof itemId);
    console.log('Input batchNumber:', batchNumber, typeof batchNumber);
    console.log('availableBatches:', JSON.stringify(availableBatches, null, 2));

    // if (!itemId || !batchNumber)
    if (!itemId )
       {
      console.log('❌ Missing required parameters');
      return 0;
    }

    const batches = availableBatches[itemId];
    console.log(`Batches for item ${itemId}:`, batches);

    if (!batches || batches.length === 0) {
      console.log('❌ No batches found for item');
      return 0;
    }

    // Show all batches with their types
    batches.forEach((b, idx) => {
      console.log(`Batch ${idx}:`, {
        batchno: b.batchno,
        batchno_type: typeof b.batchno,
        available: b.available_qty_uom1,
        matches_string: b.batchno.toString() === batchNumber.toString(),
        matches_number: parseInt(b.batchno) === parseInt(batchNumber)
      });
    });

    const batch = batches.find(b => b.batchno.toString() === batchNumber.toString());
    console.log('Selected batch:', batch);

    if (!batch) {
      console.log('❌ Batch not found after search');
      return 0;
    }

    const available = parseFloat(batch.available_qty_uom1) || 0;
    console.log(`✅ Final available stock: ${available}`);
    console.log('=== END DEBUG ===');

    return available;
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
  
  console.log('🚀 Starting dispatch submission...');
  console.log('📊 Current mode:', mode);
  console.log('📊 Dispatch data:', dispatchData);
  console.log('📊 Sales order:', salesOrder);
  
  // Validation for create mode
  if (mode === 'create' && !dispatchData.COA_ID) {
    console.log('❌ Validation failed: No customer selected');
    setMessage({ type: 'error', text: 'Please select a customer' });
    return;
  }

  // Prepare items to submit
  let itemsToSubmit;
  if (mode === 'edit') {
    itemsToSubmit = dispatchItems;
    console.log('📝 Edit mode: Using all dispatch items:', itemsToSubmit.length);
  } else {
    itemsToSubmit = dispatchItems.filter(item => item.QTY_Dispatched > 0);
    console.log('📝 Create mode: Filtered items with quantity > 0:', itemsToSubmit.length);
  }

  console.log('📋 Items to submit:', itemsToSubmit);

  if (itemsToSubmit.length === 0) {
    console.log('❌ Validation failed: No items to process');
    setMessage({ type: 'error', text: 'No items to process' });
    return;
  }

  // Validate items with quantities have batches selected
  const itemsWithQuantity = itemsToSubmit.filter(item => item.QTY_Dispatched > 0);
  console.log('🔍 Items with quantity:', itemsWithQuantity.length);
  
  const missingBatch = itemsWithQuantity.find(item => !item.Batch_Number);
  if (missingBatch) {
    console.log('❌ Validation failed: Missing batch for item:', missingBatch);
    setMessage({ type: 'error', text: `Please select batch for: ${missingBatch.Item}` });
    return;
  }

  // Stock validation for non-edit mode
  if (mode !== 'edit') {
    console.log('🔍 Performing stock validation...');
    for (const item of itemsWithQuantity) {
      const availableStock = getAvailableStock(item.Item_ID, item.Batch_Number);
      console.log(`📊 Stock check for ${item.Item}: Requested=${item.QTY_Dispatched}, Available=${availableStock}`);
      
      if (item.QTY_Dispatched > availableStock) {
        console.log('❌ Stock validation failed:', item);
        setMessage({ 
          type: 'error', 
          text: `${item.Item}: Cannot dispatch ${item.QTY_Dispatched} units, only ${availableStock} available in batch ${item.Batch_Number}` 
        });
        return;
      }
    }
    console.log('✅ Stock validation passed');
  }
  
  setLoading(true);
  console.log('⏳ Loading state set to true');

  try {
    // ✅ Create stockMain object with debugging
    const stockMainData = {
      Stock_Type_ID: 12,
      COA_ID: parseInt(dispatchData.COA_ID),
      Date: dispatchData.Date,
      Status: dispatchData.Status || 'UnPost',
      Purchase_Type: dispatchData.Dispatch_Type || 'Local selling',
      Order_Main_ID: salesOrder?.ID || null
    };
    
    console.log('📦 Created stockMain:', stockMainData);

    // ✅ Create stockDetails array with debugging
    const stockDetailsData = itemsToSubmit.map((item, index) => {
      console.log(`🔍 Processing item ${index + 1}:`, {
        itemName: item.Item,
        saleUnit: item.sale_unit,
        quantities: {
          uom1: item.uom1_qty,
          uom2: item.uom2_qty,
          uom3: item.uom3_qty
        }
      });

      const detailObject = {
        Line_Id: parseFloat(item.Line_Id),
        Item_ID: parseInt(item.Item_ID),
        batchno: item.Batch_Number,
        Stock_Price: parseFloat(item.Stock_Price) || 0,
        
        // ✅ UOM position numbers (1, 2, 3) - only for selected UOM
        Stock_out_UOM: item.sale_unit === 'uom1' ? 1 : null,
        Stock_out_SKU_UOM: item.sale_unit === 'uomTwo' ? 2 : null,
        Stock_out_UOM3: item.sale_unit === 'uomThree' ? 3 : null,
        
        // Quantities
        Stock_out_UOM_Qty: parseFloat(item.uom1_qty) || 0,
        Stock_out_SKU_UOM_Qty: parseFloat(item.uom2_qty) || 0,
        Stock_out_UOM3_Qty: parseFloat(item.uom3_qty) || 0,
        
        // Selected UOM ID
        Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
        
        // Discounts
        Discount_A: parseFloat(item.discountA) || 0,
        Discount_B: parseFloat(item.discountB) || 0,
        Discount_C: parseFloat(item.discountC) || 0
      };

      console.log(`📋 Created detail object ${index + 1}:`, detailObject);
      return detailObject;
    });

    console.log('📦 Created stockDetails array:', stockDetailsData);

    // ✅ Try multiple payload structures
    const payloadStructures = [
      // Structure 1: Nested stockMain and stockDetails
      {
        name: 'Nested Structure',
        payload: {
          stockMain: stockMainData,
          stockDetails: stockDetailsData
        }
      },
      // Structure 2: Flat structure with stockDetails
      {
        name: 'Flat Structure',
        payload: {
          ...stockMainData,
          stockDetails: stockDetailsData
        }
      },
      // Structure 3: Direct array structure
      {
        name: 'Direct Structure',
        payload: {
          main: stockMainData,
          details: stockDetailsData
        }
      }
    ];

    console.log('🔍 Testing payload structures...');

    // Try each structure
    for (let i = 0; i < payloadStructures.length; i++) {
      const structure = payloadStructures[i];
      console.log(`\n🧪 Trying ${structure.name} (${i + 1}/${payloadStructures.length}):`);
      console.log('📦 Payload:', JSON.stringify(structure.payload, null, 2));

      // Validate payload before sending
      console.log('🔍 Payload validation:');
      console.log('- Has stockMain?', !!structure.payload.stockMain);
      console.log('- Has stockDetails?', !!structure.payload.stockDetails);
      console.log('- Has main?', !!structure.payload.main);
      console.log('- Has details?', !!structure.payload.details);
      console.log('- COA_ID type:', typeof structure.payload.COA_ID || typeof structure.payload.stockMain?.COA_ID);
      console.log('- Details count:', structure.payload.stockDetails?.length || structure.payload.details?.length);

      // Determine API endpoint
      const url = mode === 'edit' 
        ? `http://${window.location.hostname}:4000/api/dispatch/${dispatchId}`
        : `http://${window.location.hostname}:4000/api/dispatch`;
      
      console.log('🌐 API URL:', url);
      console.log('🔧 Method:', mode === 'edit' ? 'PUT' : 'POST');

      try {
        // Submit to API
        const response = await fetch(url, {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(structure.payload)
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        const result = await response.json();
        console.log('📥 API Response:', result);

        if (response.ok && result.success) {
          console.log('✅ SUCCESS with', structure.name);
          
          // Handle order status update if requested
          if (updateOrderStatus && salesOrder?.ID) {
            try {
              console.log('🔄 Updating order status to:', selectedOrderStatus);
              const statusResponse = await fetch(`http://${window.location.hostname}:4000/api/order/update-status/${salesOrder.ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: selectedOrderStatus.trim() })
              });
              const statusResult = await statusResponse.json();
              console.log('📊 Order status update result:', statusResult);
            } catch (statusError) {
              console.warn('⚠️ Error updating order status:', statusError);
            }
          }

          // Success handling
          setMessage({ 
            type: 'success', 
            text: `Dispatch ${mode === 'edit' ? 'updated' : 'created'} successfully!` 
          });
          
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1500);

          return; // Exit the function on success

        } else {
          console.log(`❌ ${structure.name} failed:`, result);
          
          // If this is the last structure and it failed, show the error
          if (i === payloadStructures.length - 1) {
            setMessage({ 
              type: 'error', 
              text: result.error || result.message || 'Failed to process dispatch' 
            });
          }
        }

      } catch (fetchError) {
        console.error(`❌ Network error with ${structure.name}:`, fetchError);
        
        // If this is the last structure and it failed, show the error
        if (i === payloadStructures.length - 1) {
          setMessage({ 
            type: 'error', 
            text: `Network error: ${fetchError.message || 'Failed to process dispatch'}` 
          });
        }
      }
    }

  } catch (error) {
    // Handle unexpected errors
    console.error('❌ Unexpected error:', error);
    console.error('❌ Error stack:', error.stack);
    setMessage({ 
      type: 'error', 
      text: `Unexpected error: ${error.message || 'Failed to process dispatch'}` 
    });
  } finally {
    setLoading(false);
    console.log('⏳ Loading state set to false');
  }
};



  
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
  //       // stockDetails: itemsToSubmit.map(item => ({
  //       //   Line_Id: item.Line_Id,
  //       //   Item_ID: item.Item_ID,
  //       //   batchno: item.Batch_Number,
  //       //   Stock_Price: parseFloat(item.Stock_Price) || 0,
  //       //   Stock_out_UOM_Qty: item.uom1_qty || 0,
  //       //   Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
  //       //   Stock_out_UOM3_Qty: item.uom3_qty || 0,
  //       //   Sale_Unit: getSaleUnitId(item.sale_unit, item.item),
  //       //   Discount_A: item.discountA || 0,
  //       //   Discount_B: item.discountB || 0,
  //       //   Discount_C: item.discountC || 0
  //       // }))










  //       stockDetails: itemsToSubmit.map(item => ({
  //         Line_Id: item.Line_Id,
  //         Item_ID: item.Item_ID,
  //         batchno: item.Batch_Number,
  //         Stock_Price: parseFloat(item.Stock_Price) || 0,

  //         // ✅ FIXED: Store UOM position numbers (1, 2, 3)
  //         Stock_out_UOM: item.sale_unit === 'uom1' ? 1 : null,
  //         Stock_out_SKU_UOM: item.sale_unit === 'uomTwo' ? 2 : null,
  //         Stock_out_UOM3: item.sale_unit === 'uomThree' ? 3 : null,

  //         // Quantities  
  //         Stock_out_UOM_Qty: item.uom1_qty || 0,
  //         Stock_out_SKU_UOM_Qty: item.uom2_qty || 0,
  //         Stock_out_UOM3_Qty: item.uom3_qty || 0,

  //         Sale_Unit: getSaleUnitId(item.sale_unit, item.item),

  //         Discount_A: item.discountA || 0,
  //         Discount_B: item.discountB || 0,
  //         Discount_C: item.discountC || 0
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
          <div className={`m-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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










