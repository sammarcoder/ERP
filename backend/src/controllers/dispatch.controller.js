

// controllers/dispatch.controller.js - COMPLETE FIX
const { Disc } = require('lucide-react');
const db = require('../models');
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Uom } = db;
const { Op } = require('sequelize');
const sequelize = db.sequelize;


// controllers/dispatchController.js - COMPLETE API WITH CREATE AND EDIT
const getAvailableBatchesForEdit = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const dispatchId = req.params.dispatchId;

    console.log(`🔍 EDIT MODE: Item_ID: ${itemId}, Dispatch_ID: ${dispatchId}`);

    if (!itemId || !dispatchId) {
      return res.status(400).json({
        success: false,
        error: 'Item ID and Dispatch ID are required for edit mode'
      });
    }

    // FIXED: SQL for edit mode - excludes current dispatch
    const batches = await sequelize.query(`
      SELECT 
        sd.batchno,
        sd.Item_ID,
        zi.itemName,
        
        -- Total received from GRN
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) as total_received_uom1,
        
        -- Other dispatches (excluding current dispatch)
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 AND sm.ID != :dispatchId 
          THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END) as total_other_dispatched_uom1,
        
        -- Current dispatch being edited
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 AND sm.ID = :dispatchId 
          THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END) as current_dispatch_uom1,
        
        -- Available = Received - Other Dispatches (excludes current)
        (SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 AND sm.ID != :dispatchId 
          THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom1
        
      FROM stk_detail sd
      INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
      INNER JOIN zitems zi ON sd.Item_ID = zi.id
      WHERE sd.Item_ID = :itemId 
        AND sd.batchno IS NOT NULL 
        AND sd.batchno != ''
      GROUP BY sd.batchno, sd.Item_ID, zi.itemName
      ORDER BY sd.batchno ASC
    `, {
      replacements: { itemId, dispatchId },
      type: sequelize.QueryTypes.SELECT
    });

    const processedBatches = batches.map(batch => ({
      batchno: batch.batchno,
      item_id: batch.Item_ID,
      item_name: batch.itemName,
      total_received_uom1: parseFloat(batch.total_received_uom1) || 0,
      total_other_dispatched_uom1: parseFloat(batch.total_other_dispatched_uom1) || 0,
      current_dispatch_uom1: parseFloat(batch.current_dispatch_uom1) || 0,
      available_qty_uom1: parseFloat(batch.available_qty_uom1) || 0,
      edit_mode: true
    }));

    console.log(`✅ EDIT MODE: ${processedBatches.length} batches for Item_ID ${itemId}`);

    res.json({
      success: true,
      data: processedBatches,
      mode: 'edit'
    });

  } catch (error) {
    console.error(`❌ EDIT API ERROR:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// EXISTING: Keep your current function for create/fromOrder (modify HAVING clause)
const getAvailableBatchesForItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    console.log(`🔍 CREATE/FROM_ORDER MODE: Item_ID: ${itemId}`);

    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
    }

    // FIXED: Remove HAVING clause to show ALL batches (let frontend decide)
    // ADDED: LEFT JOIN with zcoa to get batchName (acName)
    const availableBatches = await sequelize.query(`
      SELECT 
        sd.batchno,
        sd.Item_ID,
        zi.itemName,
        zc.acName as batchName,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) as total_received_uom1,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END) as total_dispatched_uom1,
        
        (SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom1
        
      FROM stk_detail sd
      INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
      INNER JOIN zitems zi ON sd.Item_ID = zi.id
      LEFT JOIN zcoas zc ON sd.batchno = zc.id
      WHERE sd.Item_ID = :itemId 
        AND sd.batchno IS NOT NULL 
        AND sd.batchno != ''
      GROUP BY sd.batchno, sd.Item_ID, zi.itemName, zc.acName
      -- FIXED: No HAVING clause - show all batches
      ORDER BY sd.batchno ASC
    `, {
      replacements: { itemId },
      type: sequelize.QueryTypes.SELECT
    });

    const processedBatches = availableBatches.map(batch => ({
      batchno: batch.batchno,
      batchName: batch.batchName || batch.batchno, // Fallback to batchno if no name found
      item_id: batch.Item_ID,
      item_name: batch.itemName,
      total_received_uom1: parseFloat(batch.total_received_uom1) || 0,
      total_dispatched_uom1: parseFloat(batch.total_dispatched_uom1) || 0,
      available_qty_uom1: parseFloat(batch.available_qty_uom1) || 0,
      edit_mode: false
    }));

    // console.log(`✅ CREATE MODE: ${processedBatches.length} batches for Item_ID ${itemId}`);
    console.log(  `Batches:`, processedBatches);

    res.json({
      success: true,
      data: processedBatches,
      mode: 'create'
    });

  } catch (error) {
    console.error(`❌ CREATE API ERROR:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const createDispatch = async (req, res) => {
  const { stockMain, stockDetails, updateOrderStatus, selectedOrderStatus } = req.body;

  console.log('📥 === CREATING DISPATCH ===');
  console.log('Stock Main:', stockMain);
  console.log('Stock Details:', stockDetails);
  console.log('Update Order Status:', updateOrderStatus);
  console.log('Selected Order Status:', selectedOrderStatus);

  if (!stockMain || !stockDetails || stockDetails.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Stock issue'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Generate dispatch number
    const dispatchNumber = await generateDispatchNumber();
    console.log(`🔢 Generated dispatch number: ${dispatchNumber}`);

    // Create stock main with proper Stock_Type_ID
    const stockMainData = await Stk_main.create({
      Stock_Type_ID: 12, // Dispatch type
      COA_ID: stockMain.COA_ID,
      Date: stockMain.Date,
      Status: stockMain.Status || 'UnPost',
      Purchase_Type: stockMain.Purchase_Type || 'Local selling',
      Order_Main_ID: stockMain.Order_Main_ID,
      Transporter_ID: stockMain.Transporter_ID,
      labour_crt: stockMain.labour_crt || 0,
      freight_crt: stockMain.freight_crt || 0,
      other_expense: stockMain.other_expense || 0,
      Number: dispatchNumber,
      remarks: stockMain.remarks || ''
    }, { transaction });

    console.log(`✅ Created Stk_main record with ID: ${stockMainData.ID}`);

    // Validate batch availability before creating details
    for (const detail of stockDetails) {
      if (!detail.batchno) {
        throw new Error(`Batch number is required for Item_ID ${detail.Item_ID}`);
      }

      // Check if batch has enough stock
      const batchCheck = await sequelize.query(`
        SELECT 
          (SUM(CASE WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.Stock_In_UOM_Qty, 0) ELSE 0 END) - 
           SUM(CASE WHEN sm.Stock_Type_ID = 12 THEN COALESCE(sd.Stock_out_UOM_Qty, 0) ELSE 0 END)) as available
        FROM stk_detail sd
        INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
        WHERE sd.Item_ID = :itemId AND sd.batchno = :batchno
        GROUP BY sd.Item_ID, sd.batchno
      `, {
        replacements: { itemId: detail.Item_ID, batchno: detail.batchno },
        type: sequelize.QueryTypes.SELECT,
        transaction
      });

      const availableStock = batchCheck[0]?.available || 0;
      
      // ✅ FIXED: Calculate requested quantity based on sale_unit
      let requestedQty = 0;
      if (detail.sale_unit === 1) {
        requestedQty = parseFloat(detail.uom1_qty) || 0;
      } else if (detail.sale_unit === 2) {
        requestedQty = parseFloat(detail.uom2_qty) || 0;
      } else if (detail.sale_unit === 3) {
        requestedQty = parseFloat(detail.uom3_qty) || 0;
      }

      console.log(`🔍 Stock check for Item ${detail.Item_ID}, Batch ${detail.batchno}:`, {
        available: availableStock,
        requested: requestedQty,
        sale_unit: detail.sale_unit
      });

      if (requestedQty > availableStock) {
        throw new Error(`Insufficient stock for Item_ID ${detail.Item_ID} in batch ${detail.batchno}. Available: ${availableStock}, Requested: ${requestedQty}`);
      }
    }

    // ✅ FIXED: Create stock details with proper field mapping
    const stockDetailsWithMainId = stockDetails.map((detail, index) => {
      console.log(`📊 Processing detail ${index + 1}:`, {
        Item_ID: detail.Item_ID,
        batchno: detail.batchno,
        sale_unit: detail.sale_unit,
        uom1_qty: detail.uom1_qty,
        uom2_qty: detail.uom2_qty,
        uom3_qty: detail.uom3_qty
      });

      // ✅ Calculate Stock_out_UOM_Qty based on selected sale_unit
      let stockOutQty = 0;
      if (detail.sale_unit === 1) {
        stockOutQty = parseFloat(detail.uom1_qty) || 0;
      } else if (detail.sale_unit === 2) {
        stockOutQty = parseFloat(detail.uom2_qty) || 0;
      } else if (detail.sale_unit === 3) {
        stockOutQty = parseFloat(detail.uom3_qty) || 0;
      }

      return {
        STK_Main_ID: stockMainData.ID,
        Line_Id: detail.Line_Id || (index + 1),
        Item_ID: detail.Item_ID,
        batchno: detail.batchno,
        Uom_Id: detail.Uom_Id || 0,
        
        // ✅ FIXED: Map quantities properly
        uom1_qty: parseFloat(detail.uom1_qty) || 0,
        uom2_qty: parseFloat(detail.uom2_qty) || 0,
        uom3_qty: parseFloat(detail.uom3_qty) || 0,
        sale_unit: detail.sale_unit || 1,
        
        // ✅ Set stock out quantity
        Stock_out_UOM_Qty: stockOutQty,
        Stock_out_SKU_UOM_Qty: 0,
        
        // Set Stock_In quantities to 0 for dispatch
        Stock_In_UOM_Qty: 0,
        Stock_In_SKU_UOM_Qty: 0,
        
        Stock_Price: parseFloat(detail.Stock_Price) || 0,
        Discount_A: parseFloat(detail.Discount_A) || 0,
        Discount_B: parseFloat(detail.Discount_B) || 0,
        Discount_C: parseFloat(detail.Discount_C) || 0,
        Remarks: detail.Remarks || ''
      };
    });

    const createdDetails = await Stk_Detail.bulkCreate(stockDetailsWithMainId, {
      transaction,
      validate: true
    });

    console.log(`✅ Created ${createdDetails.length} Stk_Detail records`);

    // ✅ NEW: Update source order status if Order_Main_ID exists
    if (stockMain.Order_Main_ID) {
      console.log(`🔄 Updating source order ${stockMain.Order_Main_ID}...`);
      
      try {
        const orderUpdateData = {
          is_Note_generated: true, // ✅ CRITICAL: Set to true when dispatch is created
          updatedAt: new Date()
        };

        // ✅ Also update Next_Status if requested
        if (updateOrderStatus && selectedOrderStatus) {
          orderUpdateData.Next_Status = selectedOrderStatus; // 'Partial' or 'Complete'
          console.log(`📊 Setting order status to: ${selectedOrderStatus}`);
        }

        const [updatedRows] = await sequelize.query(`
          UPDATE order_main 
          SET is_Note_generated = :is_Note_generated, 
              Next_Status = COALESCE(:Next_Status, Next_Status),
              updatedAt = :updatedAt
          WHERE ID = :orderId
        `, {
          replacements: {
            is_Note_generated: true,
            Next_Status: selectedOrderStatus || null,
            updatedAt: new Date(),
            orderId: stockMain.Order_Main_ID
          },
          type: sequelize.QueryTypes.UPDATE,
          transaction
        });

        console.log(`✅ Updated source order ${stockMain.Order_Main_ID}:`, {
          is_Note_generated: true,
          Next_Status: selectedOrderStatus || 'unchanged',
          rowsAffected: updatedRows
        });

        // ✅ Verify the update worked
        const verifyOrder = await sequelize.query(`
          SELECT ID, Number, is_Note_generated, Next_Status 
          FROM order_main 
          WHERE ID = :orderId
        `, {
          replacements: { orderId: stockMain.Order_Main_ID },
          type: sequelize.QueryTypes.SELECT,
          transaction
        });

        console.log(`🔍 Order verification after update:`, verifyOrder[0]);

      } catch (orderUpdateError) {
        console.error(`❌ Error updating source order ${stockMain.Order_Main_ID}:`, orderUpdateError);
        throw new Error(`Failed to update source order: ${orderUpdateError.message}`);
      }
    } else {
      console.log(`ℹ️ No source order to update (standalone dispatch)`);
    }

    await transaction.commit();
    console.log(`✅ Transaction committed successfully`);

    // Fetch complete dispatch with associations for response
    const completeDispatch = await Stk_main.findByPk(stockMainData.ID, {
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              include: [
                { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
              ]
            }
          ]
        },
        { model: ZCoa, as: 'account' }
      ]
    });

    console.log(`🎉 === DISPATCH CREATED SUCCESSFULLY ===`);
    console.log(`Dispatch Number: ${dispatchNumber}`);
    console.log(`Dispatch ID: ${stockMainData.ID}`);
    console.log(`Total Items Dispatched: ${createdDetails.length}`);
    console.log(`Source Order Updated: ${stockMain.Order_Main_ID ? 'Yes' : 'No'}`);

    res.json({
      success: true,
      message: 'Dispatch created successfully',
      data: {
        dispatchId: stockMainData.ID,
        dispatchNumber: dispatchNumber,
        dispatch: completeDispatch,
        itemsDispatched: createdDetails.length,
        orderUpdated: !!stockMain.Order_Main_ID,
        orderStatus: {
          is_Note_generated: true,
          Next_Status: selectedOrderStatus || 'unchanged'
        }
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ === DISPATCH CREATION ERROR ===', error);

    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// GET all dispatches with filtering
const getAllDispatches = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, dateFrom, dateTo, customerId } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = { Stock_Type_ID: 12 };

    if (status && status !== 'all') whereClause.Status = status;
    if (dateFrom && dateTo) whereClause.Date = { [Op.between]: [dateFrom, dateTo] };
    if (customerId) whereClause.COA_ID = customerId;

    const { count, rows } = await Stk_main.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Stk_Detail, as: 'details',
          include: [
            { model: ZItems, as: 'item', attributes: ['id', 'itemName', 'sellingPrice'],
              include: [
                { model: Uom, as: 'uom1', attributes: ['uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['uom'] },
                { model: Uom, as: 'uomThree', attributes: ['uom'] }
              ]
            },
            { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName', 'city', 'mobileNo'] }
          ]
        },
        { model: ZCoa, as: 'account', attributes: ['id', 'acName', 'city', 'mobileNo'] },
        { model: Order_Main, as: 'order', attributes: ['ID', 'Number', 'Date', 'Next_Status'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) }
    });
  } catch (error) {
    console.error('Error fetching dispatches:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET dispatch by ID
const getDispatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const dispatch = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: 12 },
      include: [
        {
          model: Stk_Detail, as: 'details',
          include: [{ model: ZItems, as: 'item',
            include: [
              { model: Uom, as: 'uom1' },
              { model: Uom, as: 'uomTwo' },
              { model: Uom, as: 'uomThree' }
            ]
          }]
        },
        { model: ZCoa, as: 'account', attributes: ['id', 'acName', 'city', 'mobileNo'] },
        { model: Order_Main, as: 'order', attributes: ['ID', 'Number', 'Date', 'Next_Status'] }
      ]
    });

    if (!dispatch) return res.status(404).json({ success: false, error: 'Dispatch not found' });
    res.json({ success: true, data: dispatch });
  } catch (error) {
    console.error(`Error fetching dispatch ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE dispatch
const updateDispatch = async (req, res) => {
  const { id } = req.params;
  const { stockMain, stockDetails } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const existingDispatch = await Stk_main.findOne({ where: { ID: id, Stock_Type_ID: 12 } });
    if (!existingDispatch) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Dispatch not found' });
    }

    await Stk_main.update({
      COA_ID: stockMain.COA_ID,
      Date: stockMain.Date,
      Status: stockMain.Status,
      Purchase_Type: stockMain.Purchase_Type,
      Remarks: stockMain.Remarks || ''
    }, { where: { ID: id }, transaction });

    await Stk_Detail.destroy({ where: { STK_Main_ID: id }, transaction });

    const stockDetailsWithMainId = stockDetails.map((detail, index) => {
      let selectedUomNumber = null;
      if (detail.Stock_out_UOM === 1) selectedUomNumber = 1;
      else if (detail.Stock_out_SKU_UOM === 2) selectedUomNumber = 2;
      else if (detail.Stock_out_UOM3 === 3) selectedUomNumber = 3;

      return {
        STK_Main_ID: id,
        Line_Id: detail.Line_Id || (index + 1),
        Item_ID: detail.Item_ID,
        batchno: detail.batchno,
        Stock_Price: parseFloat(detail.Stock_Price) || 0,
        Stock_out_UOM: selectedUomNumber,
        Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
        Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
        Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
        Stock_In_UOM_Qty: 0,
        Stock_In_SKU_UOM_Qty: 0,
        Stock_In_UOM3_Qty: 0,
        Sale_Unit: detail.Sale_Unit || null,
        Discount_A: parseFloat(detail.Discount_A) || 0,
        Discount_B: parseFloat(detail.Discount_B) || 0,
        Discount_C: parseFloat(detail.Discount_C) || 0,
        Remarks: detail.Remarks || ''
      };
    });

    const newDetails = await Stk_Detail.bulkCreate(stockDetailsWithMainId, { transaction, validate: true });
    await transaction.commit();

    const updatedDispatch = await Stk_main.findByPk(id, {
      include: [
        { model: Stk_Detail, as: 'details',
          include: [{ model: ZItems, as: 'item',
            include: [
              { model: Uom, as: 'uom1', attributes: ['uom'] },
              { model: Uom, as: 'uomTwo', attributes: ['uom'] },
              { model: Uom, as: 'uomThree', attributes: ['uom'] }
            ]
          }]
        },
        { model: ZCoa, as: 'account' }
      ]
    });

    res.json({
      success: true,
      message: 'Dispatch updated successfully',
      data: { dispatchId: id, updatedDetails: newDetails.length, dispatch: updatedDispatch }
    });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error updating dispatch ID ${id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE dispatch
const deleteDispatch = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, error: 'Valid dispatch ID is required' });
  }

  const transaction = await sequelize.transaction();

  try {
    const existingDispatch = await Stk_main.findOne({
      where: { ID: parseInt(id), Stock_Type_ID: 12 },
      include: [{ model: Order_Main, as: 'order', attributes: ['ID', 'Number', 'is_Note_generated', 'Next_Status'] }],
      transaction
    });

    if (!existingDispatch) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Dispatch record not found' });
    }

    const dispatchNumber = existingDispatch.Number;
    const sourceOrderId = existingDispatch.Order_Main_ID;

    let otherStockRecords = 0;
    if (sourceOrderId) {
      otherStockRecords = await Stk_main.count({
        where: { Order_Main_ID: sourceOrderId, ID: { [sequelize.Op.ne]: parseInt(id) } },
        transaction
      });
    }

    const deletedDetails = await Stk_Detail.destroy({ where: { STK_Main_ID: parseInt(id) }, transaction });
    await Stk_main.destroy({ where: { ID: parseInt(id) }, transaction, hooks: true, individualHooks: true });

    // Reset order status if this was the only dispatch
    if (sourceOrderId && otherStockRecords === 0) {
      await sequelize.query(`
        UPDATE order_main 
        SET is_Note_generated = false, Next_Status = 'Incomplete', Dispatch_Status = 'Pending', updatedAt = NOW()
        WHERE ID = :orderId
      `, { replacements: { orderId: sourceOrderId }, type: sequelize.QueryTypes.UPDATE, transaction });
    }

    await transaction.commit();

    res.json({
      success: true,
      message: `Dispatch ${dispatchNumber} deleted successfully`,
      data: {
        deletedDispatchId: parseInt(id),
        dispatchNumber,
        deletedDetails,
        sourceOrderId,
        orderStatusReset: sourceOrderId && otherStockRecords === 0
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error(`Error deleting dispatch ID ${id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get stock summary for item
const getStockSummaryForItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const stockSummary = await sequelize.query(`
      SELECT sd.batchno, zi.itemName, zi.id as item_id,
        SUM(CASE WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.Stock_In_UOM_Qty, 0) ELSE 0 END) as total_grn,
        SUM(CASE WHEN sm.Stock_Type_ID = 12 THEN COALESCE(sd.Stock_out_UOM_Qty, 0) ELSE 0 END) as total_dispatch,
        (SUM(CASE WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.Stock_In_UOM_Qty, 0) ELSE 0 END) - 
         SUM(CASE WHEN sm.Stock_Type_ID = 12 THEN COALESCE(sd.Stock_out_UOM_Qty, 0) ELSE 0 END)) as current_stock,
        COUNT(*) as total_transactions,
        MIN(sm.Date) as first_transaction,
        MAX(sm.Date) as last_transaction
      FROM stk_detail sd
      INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
      INNER JOIN zitems zi ON sd.Item_ID = zi.id
      WHERE sd.Item_ID = :itemId AND sd.batchno IS NOT NULL
      GROUP BY sd.batchno, zi.itemName, zi.id
      ORDER BY first_transaction ASC
    `, { replacements: { itemId }, type: sequelize.QueryTypes.SELECT });

    res.json({
      success: true,
      data: stockSummary,
      itemId,
      totalBatches: stockSummary.length,
      totalCurrentStock: stockSummary.reduce((sum, batch) => sum + parseFloat(batch.current_stock), 0)
    });
  } catch (error) {
    console.error(`Error fetching stock summary:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Generate dispatch number
const generateDispatchNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  const lastDispatch = await Stk_main.findOne({
    where: { Stock_Type_ID: 12, Number: { [Op.like]: `DN-${year}${month}%` } },
    order: [['Number', 'DESC']]
  });

  let sequence = 1;
  if (lastDispatch?.Number) {
    const parts = lastDispatch.Number.split('-');
    if (parts.length >= 3) sequence = parseInt(parts[2]) + 1;
  }
  return `DN-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// Get dispatch statistics
const getDispatchStatistics = async (req, res) => {
  try {
    const stats = await sequelize.query(`
      SELECT COUNT(DISTINCT sm.ID) as total_dispatches,
        COUNT(DISTINCT sd.Item_ID) as unique_items_dispatched,
        SUM(sd.Stock_out_UOM_Qty) as total_quantity_dispatched,
        SUM(sd.Stock_out_UOM_Qty * sd.Stock_Price) as total_value_dispatched,
        COUNT(DISTINCT sd.batchno) as batches_used,
        DATE(MIN(sm.Date)) as first_dispatch_date,
        DATE(MAX(sm.Date)) as last_dispatch_date
      FROM stk_main sm
      INNER JOIN stk_detail sd ON sm.ID = sd.STK_Main_ID
      WHERE sm.Stock_Type_ID = 12
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({ success: true, data: stats[0] || {}, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching dispatch statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAvailableBatchesForEdit,
  getAvailableBatchesForItem,
  createDispatch,
  getAllDispatches,
  getDispatchById,
  updateDispatch,
  deleteDispatch,
  getStockSummaryForItem,
  getDispatchStatistics
};
