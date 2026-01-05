
const db = require('../models');
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Uom } = db;
const { Op } = require('sequelize');
const sequelize = db.sequelize;



const getAvailableBatchesForEdit = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const dispatchId = req.params.dispatchId;

    if (!itemId || !dispatchId) {
      return res.status(400).json({
        success: false,
        error: 'Item ID and Dispatch ID required'
      });
    }

    const batches = await sequelize.query(`
      SELECT 
        sd.batchno,
        sd.Item_ID,
        zi.itemName,
        
        -- Total received (GRN = Stock_Type_ID 11)
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END) as total_received,
        
        -- Other dispatches (excluding current)
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 AND sm.ID != :dispatchId 
          THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END) as total_other_dispatched,
        
        -- Current dispatch quantity
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 AND sm.ID = :dispatchId 
          THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END) as current_dispatch,
        
        -- Available = Received - Other Dispatches
        (SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 AND sm.ID != :dispatchId 
          THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END)) as available_qty
        
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
      total_received: parseFloat(batch.total_received) || 0,
      total_other_dispatched: parseFloat(batch.total_other_dispatched) || 0,
      current_dispatch: parseFloat(batch.current_dispatch) || 0,
      available_qty: parseFloat(batch.available_qty) || 0,
      edit_mode: true
    }));

    console.log(`✅ EDIT: ${processedBatches.length} batches for Item ${itemId}`);

    res.json({
      success: true,
      data: processedBatches,
      mode: 'edit'
    });

  } catch (error) {
    console.error('❌ EDIT API ERROR:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 3. BATCH API FOR CREATE/FROM ORDER MODE
// ============================================
const getAvailableBatchesForItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: 'Item ID required'
      });
    }

    const batches = await sequelize.query(`
      SELECT 
        sd.batchno,
        sd.Item_ID,
        zi.itemName,
        
        -- Total received from GRN
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END) as total_received,
        
        -- Total dispatched
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END) as total_dispatched,
        
        -- Available = Received - Dispatched
        (SUM(CASE 
          WHEN sm.Stock_Type_ID = 11 THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID = 12 THEN COALESCE(sd.uom1_qty, 0)
          ELSE 0 
        END)) as available_qty
        
      FROM stk_detail sd
      INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
      INNER JOIN zitems zi ON sd.Item_ID = zi.id
      WHERE sd.Item_ID = :itemId 
        AND sd.batchno IS NOT NULL 
        AND sd.batchno != ''
      GROUP BY sd.batchno, sd.Item_ID, zi.itemName
      ORDER BY sd.batchno ASC
    `, {
      replacements: { itemId },
      type: sequelize.QueryTypes.SELECT
    });

    const processedBatches = batches.map(batch => ({
      batchno: batch.batchno,
      item_id: batch.Item_ID,
      item_name: batch.itemName,
      total_received: parseFloat(batch.total_received) || 0,
      total_dispatched: parseFloat(batch.total_dispatched) || 0,
      available_qty: parseFloat(batch.available_qty) || 0,
      edit_mode: false
    }));

    console.log(`✅ CREATE: ${processedBatches.length} batches for Item ${itemId}`);

    res.json({
      success: true,
      data: processedBatches,
      mode: 'create'
    });

  } catch (error) {
    console.error('❌ CREATE API ERROR:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 4. EXPORT
// ============================================
module.exports = {
  getAvailableBatchesForEdit,
  getAvailableBatchesForItem
};