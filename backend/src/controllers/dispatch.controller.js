

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
    const availableBatches = await sequelize.query(`
      SELECT 
        sd.batchno,
        sd.Item_ID,
        zi.itemName,
        
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
      WHERE sd.Item_ID = :itemId 
        AND sd.batchno IS NOT NULL 
        AND sd.batchno != ''
      GROUP BY sd.batchno, sd.Item_ID, zi.itemName
      -- FIXED: No HAVING clause - show all batches
      ORDER BY sd.batchno ASC
    `, {
      replacements: { itemId },
      type: sequelize.QueryTypes.SELECT
    });

    const processedBatches = availableBatches.map(batch => ({
      batchno: batch.batchno,
      item_id: batch.Item_ID,
      item_name: batch.itemName,
      total_received_uom1: parseFloat(batch.total_received_uom1) || 0,
      total_dispatched_uom1: parseFloat(batch.total_dispatched_uom1) || 0,
      available_qty_uom1: parseFloat(batch.available_qty_uom1) || 0,
      edit_mode: false
    }));

    console.log(`✅ CREATE MODE: ${processedBatches.length} batches for Item_ID ${itemId}`);

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






































// CREATE dispatch with enhanced validation
const createDispatch = async (req, res) => {
  const { stockMain, stockDetails } = req.body;

  console.log('📥 === CREATING DISPATCH ===');
  console.log('Stock Main:', stockMain);
  console.log('Stock Details:', stockDetails);

  if (!stockMain || !stockDetails || stockDetails.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Stock main and details are required'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Generate dispatch number
    const dispatchNumber = await generateDispatchNumber();
    console.log(`🔢 Generated dispatch number: ${dispatchNumber}`);

    // FIXED: Create stock main with proper Stock_Type_ID
    const stockMainData = await Stk_main.create({
      Stock_Type_ID: 12, // Dispatch type
      COA_ID: stockMain.COA_ID,
      Date: stockMain.Date,
      Status: stockMain.Status || 'UnPost',
      Purchase_Type: stockMain.Purchase_Type || 'Local selling',
      Order_Main_ID: stockMain.Order_Main_ID,
      Number: dispatchNumber,
      Remarks: stockMain.Remarks || ''
    }, { transaction });

    console.log(`✅ Created Stk_main record with ID: ${stockMainData.ID}`);

    // FIXED: Validate batch availability before creating details
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
      const requestedQty = parseFloat(detail.Stock_out_UOM_Qty) || 0;

      if (requestedQty > availableStock) {
        throw new Error(`Insufficient stock for Item_ID ${detail.Item_ID} in batch ${detail.batchno}. Available: ${availableStock}, Requested: ${requestedQty}`);
      }
    }

    // FIXED: Create stock details with proper field mapping
    const stockDetailsWithMainId = stockDetails.map((detail, index) => ({
      STK_Main_ID: stockMainData.ID,
      Line_Id: detail.Line_Id || (index + 1),
      Item_ID: detail.Item_ID,
      batchno: detail.batchno,
      Stock_Price: parseFloat(detail.Stock_Price) || 0,
      Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
      Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
      Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
      // Set Stock_In quantities to 0 for dispatch
      Stock_In_UOM_Qty: 0,
      Stock_In_SKU_UOM_Qty: 0,
      Stock_In_UOM3_Qty: 0,
      Sale_Unit: detail.Sale_Unit || null,
      Discount_A: parseFloat(detail.Discount_A) || 0,
      Discount_B: parseFloat(detail.Discount_B) || 0,
      Discount_C: parseFloat(detail.Discount_C) || 0,
      Remarks: detail.Remarks || ''
    }));

    const createdDetails = await Stk_Detail.bulkCreate(stockDetailsWithMainId, {
      transaction,
      validate: true
    });

    console.log(`✅ Created ${createdDetails.length} Stk_Detail records`);

    await transaction.commit();

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
                { model: Uom, as: 'uom1', attributes: ['uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['uom'] },
                { model: Uom, as: 'uomThree', attributes: ['uom'] }
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

    res.json({
      success: true,
      message: 'Dispatch created successfully',
      data: {
        dispatchId: stockMainData.ID,
        dispatchNumber: dispatchNumber,
        dispatch: completeDispatch,
        itemsDispatched: createdDetails.length
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

// GET all dispatches with enhanced filtering
const getAllDispatches = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, dateFrom, dateTo, customerId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { Stock_Type_ID: 12 }; // Only dispatches

    if (status && status !== 'all') {
      whereClause.Status = status;
    }

    if (dateFrom && dateTo) {
      whereClause.Date = {
        [Op.between]: [dateFrom, dateTo]
      };
    }

    if (customerId) {
      whereClause.COA_ID = customerId;
    }

    const { count, rows } = await Stk_main.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName', 'sellingPrice'],
              include: [
                { model: Uom, as: 'uom1', attributes: ['uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['uom'] },
                { model: Uom, as: 'uomThree', attributes: ['uom'] }
              ]
            }
          ]
        },
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', 'city', 'mobileNo']
        },
        {
          model: Order_Main,
          as: 'order',
          attributes: ['ID', 'Number', 'Date', 'Next_Status']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    console.log(`📋 Retrieved ${rows.length} dispatches out of ${count} total`);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dispatches:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET dispatch by ID
const getDispatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const dispatch = await Stk_main.findOne({
      where: {
        ID: id,
        Stock_Type_ID: 12
      },
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              include: [
                { model: Uom, as: 'uom1' },
                { model: Uom, as: 'uomTwo' },
                { model: Uom, as: 'uomThree' }
              ]
            }
          ]
        },
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', 'city', 'mobileNo']
        },
        {
          model: Order_Main,
          as: 'order',
          attributes: ['ID', 'Number', 'Date', 'Next_Status']
        }
      ]
    });

    if (!dispatch) {
      return res.status(404).json({
        success: false,
        error: 'Dispatch not found'
      });
    }

    console.log(`✅ Retrieved dispatch ID: ${id}, Number: ${dispatch.Number}`);

    res.json({
      success: true,
      data: dispatch
    });
  } catch (error) {
    console.error(`❌ Error fetching dispatch ID ${id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE dispatch
const updateDispatch = async (req, res) => {
  const { id } = req.params;
  const { stockMain, stockDetails } = req.body;

  const transaction = await sequelize.transaction();

  try {
    console.log(`📝 === UPDATING DISPATCH ID: ${id} ===`);

    // Check if dispatch exists
    const existingDispatch = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: 12 }
    });

    if (!existingDispatch) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Dispatch not found'
      });
    }

    // Update main record
    const [updatedRows] = await Stk_main.update({
      COA_ID: stockMain.COA_ID,
      Date: stockMain.Date,
      Status: stockMain.Status,
      Purchase_Type: stockMain.Purchase_Type,
      Remarks: stockMain.Remarks
    }, {
      where: { ID: id },
      transaction
    });

    console.log(`✅ Updated ${updatedRows} main records`);

    // Delete old details
    const deletedDetails = await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });

    console.log(`🗑️ Deleted ${deletedDetails} old detail records`);

    // Create new details with validation
    const stockDetailsWithMainId = stockDetails.map((detail, index) => ({
      STK_Main_ID: id,
      Line_Id: detail.Line_Id || (index + 1),
      Item_ID: detail.Item_ID,
      batchno: detail.batchno,
      Stock_Price: parseFloat(detail.Stock_Price) || 0,
      Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
      Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
      Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
      Stock_In_UOM_Qty: 0,
      Stock_In_SKU_UOM_Qty: 0,
      Stock_In_UOM3_Qty: 0,
      Remarks: detail.Remarks || '',
      Sale_Unit: detail.Sale_Unit || null,
      Discount_A: parseFloat(detail.Discount_A) || 0,
      Discount_B: parseFloat(detail.Discount_B) || 0,
      Discount_C: parseFloat(detail.Discount_C) || 0,
    }));

    const newDetails = await Stk_Detail.bulkCreate(stockDetailsWithMainId, {
      transaction,
      validate: true
    });

    console.log(`✅ Created ${newDetails.length} new detail records`);

    await transaction.commit();

    res.json({
      success: true,
      message: 'Dispatch updated successfully',
      data: {
        dispatchId: id,
        updatedDetails: newDetails.length
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error(`❌ Error updating dispatch ID ${id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// DELETE dispatch
const deleteDispatch = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    console.log(`🗑️ === DELETING DISPATCH ID: ${id} ===`);

    // Check if dispatch exists
    const existingDispatch = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: 12 }
    });

    if (!existingDispatch) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Dispatch not found'
      });
    }

    console.log(`Found dispatch: ${existingDispatch.Number}`);

    // Delete details first (foreign key constraint)
    const deletedDetails = await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });

    console.log(`🗑️ Deleted ${deletedDetails} detail records`);

    // Delete main record
    const deletedMain = await Stk_main.destroy({
      where: { ID: id },
      transaction
    });

    console.log(`🗑️ Deleted ${deletedMain} main records`);

    await transaction.commit();

    res.json({
      success: true,
      message: `Dispatch ${existingDispatch.Number} deleted successfully`,
      data: {
        deletedDispatchId: id,
        deletedDetails: deletedDetails,
        dispatchNumber: existingDispatch.Number
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error(`❌ Error deleting dispatch ID ${id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get stock summary for item across all batches
const getStockSummaryForItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    console.log(`📊 Getting stock summary for Item_ID: ${itemId}`);

    const stockSummary = await sequelize.query(`
      SELECT 
        sd.batchno,
        zi.itemName,
        zi.id as item_id,
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
    `, {
      replacements: { itemId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: stockSummary,
      itemId: itemId,
      totalBatches: stockSummary.length,
      totalCurrentStock: stockSummary.reduce((sum, batch) => sum + parseFloat(batch.current_stock), 0)
    });
  } catch (error) {
    console.error(`❌ Error fetching stock summary for Item_ID ${itemId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// FIXED: Generate dispatch number
const generateDispatchNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  const lastDispatch = await Stk_main.findOne({
    where: {
      Stock_Type_ID: 12,
      Number: { [Op.like]: `DN-${year}${month}%` }
    },
    order: [['Number', 'DESC']]
  });

  let sequence = 1;
  if (lastDispatch && lastDispatch.Number) {
    const parts = lastDispatch.Number.split('-');
    if (parts.length >= 3) {
      sequence = parseInt(parts[2]) + 1;
    }
  }

  return `DN-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// Get dispatch statistics
const getDispatchStatistics = async (req, res) => {
  try {
    const stats = await sequelize.query(`
      SELECT 
        COUNT(DISTINCT sm.ID) as total_dispatches,
        COUNT(DISTINCT sd.Item_ID) as unique_items_dispatched,
        SUM(sd.Stock_out_UOM_Qty) as total_quantity_dispatched,
        SUM(sd.Stock_out_UOM_Qty * sd.Stock_Price) as total_value_dispatched,
        COUNT(DISTINCT sd.batchno) as batches_used,
        DATE(MIN(sm.Date)) as first_dispatch_date,
        DATE(MAX(sm.Date)) as last_dispatch_date
      FROM stk_main sm
      INNER JOIN stk_detail sd ON sm.ID = sd.STK_Main_ID
      WHERE sm.Stock_Type_ID = 12
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: stats[0] || {},
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching dispatch statistics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
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
