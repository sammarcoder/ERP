// controllers/ZGin.controller.js

const ZGinMain = require('../models/ZGinMain.model');
const ZGinDetail = require('../models/ZGinDetail.model');
const ZGinEmployee = require('../models/ZGinEmployee.model');
const ZRecipeMain = require('../models/ZRecipeMain.model');
const ZRecipeDetail = require('../models/ZRecipeDetail.model');
const ZItems = require('../models/zItems.model');
const ZEmployee = require('../models/ZEmployee.model');
const Uom = require('../models/zUom.model');
const StkMain = require('../models/stockMain.model');
const StkDetail = require('../models/stockDetail.model');
const ZCoa = require('../models/ZCoa.model');
const sequelize = require('../../config/database');
const { Op } = require('sequelize');

// =============================================
// GENERATE GIN NUMBER
// =============================================
const generateGinNumber = async () => {
  const lastGin = await ZGinMain.findOne({
    order: [['id', 'DESC']],
    attributes: ['gin_number']
  });

  if (!lastGin || !lastGin.gin_number) {
    return 'GIN-1';
  }

  const match = lastGin.gin_number.match(/GIN-(\d+)/);
  const lastNumber = match ? parseInt(match[1]) : 0;
  return `GIN-${lastNumber + 1}`;
};

// =============================================
// GENERATE MGDN NUMBER (Stock Type 14)
// =============================================
const generateMGDNNumber = async () => {
  const lastMGDN = await StkMain.findOne({
    where: { Stock_Type_ID: 14 },
    order: [['ID', 'DESC']],
    attributes: ['Number']
  });

  if (!lastMGDN || !lastMGDN.Number) {
    return 'MGDN-1';
  }

  const match = lastMGDN.Number.match(/MGDN-(\d+)/);
  const lastNumber = match ? parseInt(match[1]) : 0;
  return `MGDN-${lastNumber + 1}`;
};

// =============================================
// GET ALL GIN
// =============================================
const getAll = async (req, res) => {
  try {
    const gins = await ZGinMain.findAll({
      include: [
        {
          model: ZItems,
          as: 'item',
          attributes: ['id', 'itemName']
        },
        {
          model: Uom,
          as: 'uom',
          attributes: ['id', 'uom']
        },
        {
          model: ZCoa,
          as: 'coa',
          attributes: ['id', 'acName']
        },
        {
          model: ZGinDetail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
            { model: Uom, as: 'issueUom', attributes: ['id', 'uom'] }
          ]
        },
        {
          model: ZGinEmployee,
          as: 'employees',
          include: [
            { model: ZEmployee, as: 'employee', attributes: ['id', 'employeeName'] }
          ]
        }
      ],
      order: [['id', 'DESC']]
    });

    res.json({ success: true, data: gins });
  } catch (error) {
    console.error('❌ Error fetching GINs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET GIN BY ID (with Recipe for calculation)
// =============================================
// const getById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const gin = await ZGinMain.findByPk(id, {
//       include: [
//         {
//           model: ZItems,
//           as: 'item',
//           attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
//           include: [
//             { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//             { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//             { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//           ]
//         },
//         { model: Uom, as: 'uom', attributes: ['id', 'uom'] },
//         { model: ZCoa, as: 'coa', attributes: ['id', 'acName'] },
//         {
//           model: ZGinDetail,
//           as: 'details',
//           include: [
//             {
//               model: ZItems,
//               as: 'item',
//               attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
//               include: [
//                 { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//                 { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//                 { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//               ]
//             },
//             { model: Uom, as: 'issueUom', attributes: ['id', 'uom'] }
//           ]
//         },
//         {
//           model: ZGinEmployee,
//           as: 'employees',
//           include: [
//             { model: ZEmployee, as: 'employee', attributes: ['id', 'employeeName'] }
//           ]
//         },
//         {
//           model: StkDetail,
//           as: 'stockDetails',
//           attributes: [ 'batchno', 'uom1_qty', 'uom2_qty', 'uom3_qty'],
//           include: [
//             {
//               model: StkMain,
//               // where: { Stock_Type_ID: 15 },
//               as: 'stockMain',
//               attributes: ['id', 'Number', 'Stock_Type_ID'],
//               // include: [
//               //   {model:StkDetail, as:'mgdnDetails', attributes:['id','batchno','Item_ID','Stock_In_UOM_Qty','Stock_In_SKU_UOM_Qty','Stock_In_UOM3_Qty','Stock_out_UOM_Qty','Stock_out_SKU_UOM_Qty','Stock_out_UOM3_Qty'
//               //   ]}
//               // ]
//             }

//           ]

//         }
//       ]
//     });

//     if (!gin) {
//       return res.status(404).json({ success: false, message: 'GIN not found' });
//     }

//     // Fetch Recipe for this item to get original quantities
//     const recipe = await ZRecipeMain.findOne({
//       where: { Item_id: gin.item_id },
//       include: [
//         {
//           model: ZRecipeDetail,
//           as: 'details',
//           attributes: ['Item_id', 'qty', 'Uom_Id']
//         }
//       ]
//     });

//     // Build response with recipe data
//     const responseData = gin.toJSON();

//     if (recipe) {
//       responseData.recipe = {
//         id: recipe.id,
//         qty: recipe.qty,
//         details: recipe.details.map(d => ({
//           Item_id: d.Item_id,
//           qty: d.qty,
//           Uom_Id: d.Uom_Id
//         }))
//       };
//     }

//     res.json({ success: true, data: responseData });

//   } catch (error) {
//     console.error('❌ Error fetching GIN:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };











const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const gin = await ZGinMain.findByPk(id, {
      include: [
        {
          model: ZItems,
          as: 'item',
          attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
          include: [
            { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
          ]
        },
        { model: Uom, as: 'uom', attributes: ['id', 'uom'] },
        { model: ZCoa, as: 'coa', attributes: ['id', 'acName'] },
        {
          model: ZGinDetail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
              include: [
                { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
              ]
            },
            { model: Uom, as: 'issueUom', attributes: ['id', 'uom'] }
          ]
        },
        {
          model: ZGinEmployee,
          as: 'employees',
          include: [
            { model: ZEmployee, as: 'employee', attributes: ['id', 'employeeName'] }
          ]
        }
      ]
    });

    if (!gin) {
      return res.status(404).json({ success: false, message: 'GIN not found' });
    }

    // ✅ Fetch MGRN entries (Stock_Type_ID = 15) for this GIN
    const mgrnEntries = await StkDetail.findAll({
      attributes: ['ID', 'batchno', 'uom1_qty', 'uom2_qty', 'uom3_qty', 'Stock_In_UOM_Qty', 'Stock_In_SKU_UOM_Qty', 'Stock_In_UOM3_Qty'],
      where: { gin_id: id },
      include: [
        {
          model: StkMain,
          as: 'stockMain',
          attributes: ['ID', 'Number', 'Date', 'Stock_Type_ID', 'Status'],
          where: { Stock_Type_ID: 15 }  // ✅ Only MGRN (type 15)
        },
        {
          model: ZCoa,
          as: 'batchDetails',
          attributes: ['id', 'acName']
        }
      ]
    });

    // ✅ Calculate total produced from all MGRNs
    const totalProduced = mgrnEntries.reduce((sum, entry) => {
      return sum + parseFloat(entry.Stock_In_SKU_UOM_Qty || entry.uom2_qty || 0);
    }, 0);

    // Fetch Recipe for this item
    const recipe = await ZRecipeMain.findOne({
      where: { Item_id: gin.item_id },
      include: [
        {
          model: ZRecipeDetail,
          as: 'details',
          attributes: ['Item_id', 'qty', 'Uom_Id']
        }
      ]
    });

    // Build response
    const responseData = gin.toJSON();

    // ✅ Add MGRN data to response
    responseData.mgrnEntries = mgrnEntries;
    responseData.totalProduced = totalProduced;
    responseData.qtyRemaining = Math.max(0, parseFloat(gin.qty_planned) - totalProduced);

    if (recipe) {
      responseData.recipe = {
        id: recipe.id,
        qty: recipe.qty,
        details: recipe.details.map(d => ({
          Item_id: d.Item_id,
          qty: d.qty,
          Uom_Id: d.Uom_Id
        }))
      };
    }

    res.json({ success: true, data: responseData });

  } catch (error) {
    console.error('❌ Error fetching GIN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
































// =============================================
// GET NEXT GIN NUMBER
// =============================================
const getNextGinNumber = async (req, res) => {
  try {
    const ginNumber = await generateGinNumber();
    res.json({ success: true, data: ginNumber });
  } catch (error) {
    console.error('❌ Error generating GIN number:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET AVAILABLE BATCHES FOR ITEM (Create Mode)
// // =============================================
// const getAvailableBatchesForItem = async (req, res) => {
//   try {
//     const itemId = req.params.itemId;

//     console.log(`🔍 CREATE MODE: Item_ID: ${itemId}`);

//     if (!itemId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Item ID is required'
//       });
//     }

//     const availableBatches = await sequelize.query(`
//       SELECT 
//         sd.batchno,
//         sd.Item_ID,
//         zi.itemName,
//         zc.acName as batchName,

//         -- UOM1
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_received_uom1,

//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_dispatched_uom1,

//         (SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
//           ELSE 0 
//         END) - 
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
//           ELSE 0 
//         END)) as available_qty_uom1,

//         -- UOM2
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_received_uom2,

//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_dispatched_uom2,

//         (SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END) - 
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END)) as available_qty_uom2,

//         -- UOM3
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
//           ELSE 0 
//         END) as total_received_uom3,

//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
//           ELSE 0 
//         END) as total_dispatched_uom3,

//         (SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
//           ELSE 0 
//         END) - 
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
//           ELSE 0 
//         END)) as available_qty_uom3

//       FROM stk_detail sd
//       INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
//       INNER JOIN zitems zi ON sd.Item_ID = zi.id
//       LEFT JOIN zcoas zc ON sd.batchno = zc.id
//       WHERE sd.Item_ID = :itemId 
//         AND sd.batchno IS NOT NULL 
//         AND sd.batchno != ''
//       GROUP BY sd.batchno, sd.Item_ID, zi.itemName, zc.acName
//       ORDER BY sd.batchno ASC
//     `, {
//       replacements: { itemId },
//       type: sequelize.QueryTypes.SELECT
//     });

//     const processedBatches = availableBatches.map(batch => ({
//       batchno: batch.batchno,
//       batchName: batch.batchName || batch.batchno,
//       item_id: batch.Item_ID,
//       item_name: batch.itemName,
//       // UOM1
//       total_received_uom1: parseFloat(batch.total_received_uom1) || 0,
//       total_dispatched_uom1: parseFloat(batch.total_dispatched_uom1) || 0,
//       available_qty_uom1: parseFloat(batch.available_qty_uom1) || 0,
//       // UOM2
//       total_received_uom2: parseFloat(batch.total_received_uom2) || 0,
//       total_dispatched_uom2: parseFloat(batch.total_dispatched_uom2) || 0,
//       available_qty_uom2: parseFloat(batch.available_qty_uom2) || 0,
//       // UOM3
//       total_received_uom3: parseFloat(batch.total_received_uom3) || 0,
//       total_dispatched_uom3: parseFloat(batch.total_dispatched_uom3) || 0,
//       available_qty_uom3: parseFloat(batch.available_qty_uom3) || 0,
//       edit_mode: false
//     }));

//     console.log(`✅ CREATE MODE: ${processedBatches.length} batches for Item_ID ${itemId}`);

//     res.json({
//       success: true,
//       data: processedBatches,
//       mode: 'create'
//     });

//   } catch (error) {
//     console.error(`❌ CREATE API ERROR:`, error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // =============================================
// // GET AVAILABLE BATCHES FOR EDIT MODE
// // =============================================
// const getAvailableBatchesForEdit = async (req, res) => {
//   try {
//     const itemId = req.params.itemId;
//     const ginId = req.params.ginId;

//     console.log(`🔍 EDIT MODE: Item_ID: ${itemId}, GIN_ID: ${ginId}`);

//     if (!itemId || !ginId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Item ID and GIN ID are required for edit mode'
//       });
//     }

//     // First get MGDN IDs linked to this GIN
//     const linkedMGDNs = await StkDetail.findAll({
//       where: { gin_id: ginId },
//       attributes: ['STK_Main_ID'],
//       raw: true
//     });
//     const linkedMGDNIds = linkedMGDNs.map(m => m.STK_Main_ID);

//     const batches = await sequelize.query(`
//       SELECT 
//         sd.batchno,
//         sd.Item_ID,
//         zi.itemName,
//         zc.acName as batchName,

//         -- UOM1: Total received from GRN
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_received_uom1,

//         -- UOM1: Other dispatches (excluding current GIN's MGDN)
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
//           THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_other_dispatched_uom1,

//         -- UOM1: Current GIN's dispatch
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND sd.gin_id = :ginId
//           THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
//           ELSE 0 
//         END) as current_dispatch_uom1,

//         -- UOM1: Available
//         (SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
//           ELSE 0 
//         END) - 
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
//           THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
//           ELSE 0 
//         END)) as available_qty_uom1,

//         -- UOM2
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_received_uom2,

//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
//           THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END) as total_other_dispatched_uom2,

//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND sd.gin_id = :ginId
//           THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END) as current_dispatch_uom2,

//         (SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END) - 
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
//           THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
//           ELSE 0 
//         END)) as available_qty_uom2,

//         -- UOM3
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
//           ELSE 0 
//         END) as total_received_uom3,

//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
//           THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
//           ELSE 0 
//         END) as total_other_dispatched_uom3,

//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND sd.gin_id = :ginId
//           THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
//           ELSE 0 
//         END) as current_dispatch_uom3,

//         (SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (11, 13) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
//           ELSE 0 
//         END) - 
//         SUM(CASE 
//           WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
//           THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
//           ELSE 0 
//         END)) as available_qty_uom3

//       FROM stk_detail sd
//       INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
//       INNER JOIN zitems zi ON sd.Item_ID = zi.id
//       LEFT JOIN zcoas zc ON sd.batchno = zc.id
//       WHERE sd.Item_ID = :itemId 
//         AND sd.batchno IS NOT NULL 
//         AND sd.batchno != ''
//       GROUP BY sd.batchno, sd.Item_ID, zi.itemName, zc.acName
//       ORDER BY sd.batchno ASC
//     `, {
//       replacements: { itemId, ginId },
//       type: sequelize.QueryTypes.SELECT
//     });

//     const processedBatches = batches.map(batch => ({
//       batchno: batch.batchno,
//       batchName: batch.batchName || batch.batchno,
//       item_id: batch.Item_ID,
//       item_name: batch.itemName,
//       // UOM1
//       total_received_uom1: parseFloat(batch.total_received_uom1) || 0,
//       total_other_dispatched_uom1: parseFloat(batch.total_other_dispatched_uom1) || 0,
//       current_dispatch_uom1: parseFloat(batch.current_dispatch_uom1) || 0,
//       available_qty_uom1: parseFloat(batch.available_qty_uom1) || 0,
//       // UOM2
//       total_received_uom2: parseFloat(batch.total_received_uom2) || 0,
//       total_other_dispatched_uom2: parseFloat(batch.total_other_dispatched_uom2) || 0,
//       current_dispatch_uom2: parseFloat(batch.current_dispatch_uom2) || 0,
//       available_qty_uom2: parseFloat(batch.available_qty_uom2) || 0,
//       // UOM3
//       total_received_uom3: parseFloat(batch.total_received_uom3) || 0,
//       total_other_dispatched_uom3: parseFloat(batch.total_other_dispatched_uom3) || 0,
//       current_dispatch_uom3: parseFloat(batch.current_dispatch_uom3) || 0,
//       available_qty_uom3: parseFloat(batch.available_qty_uom3) || 0,
//       edit_mode: true
//     }));

//     console.log(`✅ EDIT MODE: ${processedBatches.length} batches for Item_ID ${itemId}`);

//     res.json({
//       success: true,
//       data: processedBatches,
//       mode: 'edit'
//     });

//   } catch (error) {
//     console.error(`❌ EDIT API ERROR:`, error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };
















const getAvailableBatchesForItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    console.log(`🔍 CREATE MODE: Item_ID: ${itemId}`);

    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: 'Item ID is required'
      });
    }

    const availableBatches = await sequelize.query(`
      SELECT 
        sd.batchno,
        sd.Item_ID,
        zi.itemName,
        zc.acName as batchName,
        
        -- UOM1
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) as total_received_uom1,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END) as total_dispatched_uom1,
        
        (SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom1,

        -- UOM2
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
          ELSE 0 
        END) as total_received_uom2,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
          ELSE 0 
        END) as total_dispatched_uom2,
        
        (SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom2,

        -- UOM3
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
          ELSE 0 
        END) as total_received_uom3,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
          ELSE 0 
        END) as total_dispatched_uom3,
        
        (SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom3
        
      FROM stk_detail sd
      INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
      INNER JOIN zitems zi ON sd.Item_ID = zi.id
      LEFT JOIN zcoas zc ON sd.batchno = zc.id
      WHERE sd.Item_ID = :itemId 
        AND sd.batchno IS NOT NULL 
        AND sd.batchno != ''
      GROUP BY sd.batchno, sd.Item_ID, zi.itemName, zc.acName
      ORDER BY sd.batchno ASC
    `, {
      replacements: { itemId },
      type: sequelize.QueryTypes.SELECT
    });

    const processedBatches = availableBatches.map(batch => ({
      batchno: batch.batchno,
      batchName: batch.batchName || batch.batchno,
      item_id: batch.Item_ID,
      item_name: batch.itemName,
      // UOM1
      total_received_uom1: parseFloat(batch.total_received_uom1) || 0,
      total_dispatched_uom1: parseFloat(batch.total_dispatched_uom1) || 0,
      available_qty_uom1: parseFloat(batch.available_qty_uom1) || 0,
      // UOM2
      total_received_uom2: parseFloat(batch.total_received_uom2) || 0,
      total_dispatched_uom2: parseFloat(batch.total_dispatched_uom2) || 0,
      available_qty_uom2: parseFloat(batch.available_qty_uom2) || 0,
      // UOM3
      total_received_uom3: parseFloat(batch.total_received_uom3) || 0,
      total_dispatched_uom3: parseFloat(batch.total_dispatched_uom3) || 0,
      available_qty_uom3: parseFloat(batch.available_qty_uom3) || 0,
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

// =============================================
// GET AVAILABLE BATCHES FOR EDIT MODE
// =============================================
const getAvailableBatchesForEdit = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const ginId = req.params.ginId;

    console.log(`🔍 EDIT MODE: Item_ID: ${itemId}, GIN_ID: ${ginId}`);

    if (!itemId || !ginId) {
      return res.status(400).json({
        success: false,
        error: 'Item ID and GIN ID are required for edit mode'
      });
    }

    // First get MGDN IDs linked to this GIN
    const linkedMGDNs = await StkDetail.findAll({
      where: { gin_id: ginId },
      attributes: ['STK_Main_ID'],
      raw: true
    });
    const linkedMGDNIds = linkedMGDNs.map(m => m.STK_Main_ID);

    const batches = await sequelize.query(`
      SELECT 
        sd.batchno,
        sd.Item_ID,
        zi.itemName,
        zc.acName as batchName,
        
        -- UOM1: Total received from GRN
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) as total_received_uom1,
        
        -- UOM1: Other dispatches (excluding current GIN's MGDN)
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
          THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END) as total_other_dispatched_uom1,
        
        -- UOM1: Current GIN's dispatch
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND sd.gin_id = :ginId
          THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END) as current_dispatch_uom1,
        
        -- UOM1: Available
        (SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
          THEN COALESCE(sd.Stock_out_UOM_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom1,

        -- UOM2
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
          ELSE 0 
        END) as total_received_uom2,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
          THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
          ELSE 0 
        END) as total_other_dispatched_uom2,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND sd.gin_id = :ginId
          THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
          ELSE 0 
        END) as current_dispatch_uom2,
        
        (SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
          THEN COALESCE(sd.Stock_out_SKU_UOM_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom2,

        -- UOM3
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
          ELSE 0 
        END) as total_received_uom3,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
          THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
          ELSE 0 
        END) as total_other_dispatched_uom3,
        
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND sd.gin_id = :ginId
          THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
          ELSE 0 
        END) as current_dispatch_uom3,
        
        (SUM(CASE 
          WHEN sm.Stock_Type_ID IN (11, 15) THEN COALESCE(sd.Stock_In_UOM3_Qty, 0) 
          ELSE 0 
        END) - 
        SUM(CASE 
          WHEN sm.Stock_Type_ID IN (12, 14) AND (sd.gin_id IS NULL OR sd.gin_id != :ginId)
          THEN COALESCE(sd.Stock_out_UOM3_Qty, 0) 
          ELSE 0 
        END)) as available_qty_uom3
        
      FROM stk_detail sd
      INNER JOIN stk_main sm ON sd.STK_Main_ID = sm.ID
      INNER JOIN zitems zi ON sd.Item_ID = zi.id
      LEFT JOIN zcoas zc ON sd.batchno = zc.id
      WHERE sd.Item_ID = :itemId 
        AND sd.batchno IS NOT NULL 
        AND sd.batchno != ''
      GROUP BY sd.batchno, sd.Item_ID, zi.itemName, zc.acName
      ORDER BY sd.batchno ASC
    `, {
      replacements: { itemId, ginId },
      type: sequelize.QueryTypes.SELECT
    });

    const processedBatches = batches.map(batch => ({
      batchno: batch.batchno,
      batchName: batch.batchName || batch.batchno,
      item_id: batch.Item_ID,
      item_name: batch.itemName,
      // UOM1
      total_received_uom1: parseFloat(batch.total_received_uom1) || 0,
      total_other_dispatched_uom1: parseFloat(batch.total_other_dispatched_uom1) || 0,
      current_dispatch_uom1: parseFloat(batch.current_dispatch_uom1) || 0,
      available_qty_uom1: parseFloat(batch.available_qty_uom1) || 0,
      // UOM2
      total_received_uom2: parseFloat(batch.total_received_uom2) || 0,
      total_other_dispatched_uom2: parseFloat(batch.total_other_dispatched_uom2) || 0,
      current_dispatch_uom2: parseFloat(batch.current_dispatch_uom2) || 0,
      available_qty_uom2: parseFloat(batch.available_qty_uom2) || 0,
      // UOM3
      total_received_uom3: parseFloat(batch.total_received_uom3) || 0,
      total_other_dispatched_uom3: parseFloat(batch.total_other_dispatched_uom3) || 0,
      current_dispatch_uom3: parseFloat(batch.current_dispatch_uom3) || 0,
      available_qty_uom3: parseFloat(batch.available_qty_uom3) || 0,
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




















// =============================================
// CREATE GIN (Also creates MGDN)
// =============================================
const create = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      item_id,
      qty_planned,
      Uom_Id,
      status,
      reason,
      coa_id,
      gin_date,
      details = [],
      employees = []
    } = req.body;

    // Validate
    if (!item_id) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Item is required' });
    }

    if (!coa_id) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Account is required' });
    }

    if ((status === 'pending' || status === 'rejected') && !reason) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Reason is required for pending/rejected status' });
    }

    // Generate GIN number
    const gin_number = await generateGinNumber();

    // Create GIN Main
    const gin = await ZGinMain.create({
      gin_number,
      item_id,
      qty_planned: qty_planned || 0,
      Uom_Id: Uom_Id || null,
      status: status || 'open',
      reason: reason || null,
      coa_id: coa_id || null,
      gin_date: gin_date || new Date()
    }, { transaction });

    console.log(`✅ Created GIN: ${gin_number} (ID: ${gin.id})`);

    // Create GIN details
    if (details.length > 0) {
      const detailRecords = details.map(d => ({
        gin_main_id: gin.id,
        item_id: d.item_id,
        suggested_qty: d.suggested_qty || 0,
        batchno: d.batchno || null,
        issue_qty: d.issue_qty || 0,
        issue_uom1_qty: d.issue_uom1_qty || 0,
        issue_uom2_qty: d.issue_uom2_qty || 0,
        issue_uom3_qty: d.issue_uom3_qty || 0,
        issue_uom_id: d.issue_uom_id || null,
        remained_unused: d.remained_unused || 0,
        wastage: d.wastage || 0,
        actual_used: d.actual_used || 0,
        actual_used_uom1: d.actual_used_uom1 || 0,
        actual_used_uom2: d.actual_used_uom2 || 0,
        actual_used_uom3: d.actual_used_uom3 || 0
      }));

      await ZGinDetail.bulkCreate(detailRecords, { transaction });
      console.log(`✅ Created ${detailRecords.length} GIN detail records`);
    }

    // Create employee assignments
    if (employees.length > 0) {
      const employeeRecords = employees.map(empId => ({
        gin_id: gin.id,
        employee_id: empId
      }));

      await ZGinEmployee.bulkCreate(employeeRecords, { transaction });
      console.log(`✅ Assigned ${employeeRecords.length} employees`);
    }

    // =============================================
    // CREATE MGDN (stk_main with Stock_Type_ID = 14)
    // =============================================

    // Only create MGDN if there are details with actual_used > 0
    const detailsWithUsage = details.filter(d => (d.actual_used || 0) > 0 && d.batchno);

    let mgdnNumber = null;
    let mgdnId = null;

    if (detailsWithUsage.length > 0) {
      mgdnNumber = await generateMGDNNumber();

      const mgdn = await StkMain.create({
        Stock_Type_ID: 14,
        Number: mgdnNumber,
        COA_ID: coa_id,
        Date: gin_date || new Date(),
        Status: 'UnPost',
        Purchase_Type: 'local manufacturing',
        Status_Account_Entry: 0,
        is_Voucher_Generated: 0,
        approved: 0,
        Carriage_ID: null,
        Carriage_Amount: 0,
        Order_Main_ID: null,
        Transporter_ID: null,
        freight_crt: 0,
        labour_crt: 0,
        bility_expense: 0,
        other_expense: 0,
        booked_crt: 0,
        remarks: `GIN: ${gin_number}`
      }, { transaction });

      mgdnId = mgdn.ID;
      console.log(`✅ Created MGDN: ${mgdnNumber} (ID: ${mgdnId})`);

      // =============================================
      // CREATE stk_detail for each GIN detail with usage
      // =============================================
      const stkDetailRecords = detailsWithUsage.map((d, index) => {
        // Calculate UOM values from actual_used (which is in UOM2)
        const actualUsedUom2 = parseFloat(d.actual_used) || 0;
        const actualUsedUom1 = parseFloat(d.actual_used_uom1) || 0;
        const actualUsedUom3 = parseFloat(d.actual_used_uom3) || 0;

        return {
          STK_Main_ID: mgdnId,
          Line_Id: index + 1,
          Item_ID: d.item_id,
          batchno: d.batchno,
          gin_id: gin.id,
          // Stock OUT fields (for GDN type 14)
          Stock_out_UOM: d.issue_uom_id || null,
          Stock_out_UOM_Qty: actualUsedUom1,
          Stock_out_SKU_UOM: d.issue_uom_id || null,
          Stock_out_SKU_UOM_Qty: actualUsedUom2,
          Stock_out_UOM3_Qty: actualUsedUom3,
          // Stock IN fields (null for GDN)
          Stock_In_UOM: null,
          Stock_In_UOM_Qty: 0,
          Stock_In_SKU_UOM: null,
          Stock_In_SKU_UOM_Qty: 0,
          Stock_In_UOM3_Qty: 0,
          // UOM fields
          uom1_qty: actualUsedUom1,
          uom2_qty: actualUsedUom2,
          uom3_qty: actualUsedUom3,
          sale_Uom: d.issue_uom_id || 0,
          Sale_Unit: '2',
          // Price (0 for manufacturing)
          Stock_Price: 0,
          Stock_SKU_Price: 0,
          // Discounts (0 for manufacturing)
          Discount_A: 0,
          Discount_B: 0,
          Discount_C: 0
        };
      });

      await StkDetail.bulkCreate(stkDetailRecords, { transaction });
      console.log(`✅ Created ${stkDetailRecords.length} stk_detail records`);
    }

    await transaction.commit();

    // Fetch complete GIN
    const completeGin = await ZGinMain.findByPk(gin.id, {
      include: [
        { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
        { model: Uom, as: 'uom', attributes: ['id', 'uom'] },
        { model: ZCoa, as: 'coa', attributes: ['id', 'acName'] },
        {
          model: ZGinDetail,
          as: 'details',
          include: [{ model: ZItems, as: 'item', attributes: ['id', 'itemName'] }]
        },
        {
          model: ZGinEmployee,
          as: 'employees',
          include: [{ model: ZEmployee, as: 'employee', attributes: ['id', 'employeeName'] }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: `GIN created successfully${mgdnNumber ? ` with MGDN: ${mgdnNumber}` : ''}`,
      data: completeGin,
      mgdn_number: mgdnNumber,
      mgdn_id: mgdnId
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error creating GIN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// UPDATE GIN (Also updates MGDN)
// =============================================
const update = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      item_id,
      qty_planned,
      Uom_Id,
      status,
      reason,
      coa_id,
      gin_date,
      details = [],
      employees = []
    } = req.body;

    const gin = await ZGinMain.findByPk(id, { transaction });

    if (!gin) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'GIN not found' });
    }

    if ((status === 'pending' || status === 'rejected') && !reason) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Reason is required' });
    }

    // Update GIN main
    await gin.update({
      item_id: item_id || gin.item_id,
      qty_planned: qty_planned !== undefined ? qty_planned : gin.qty_planned,
      Uom_Id: Uom_Id !== undefined ? Uom_Id : gin.Uom_Id,
      status: status || gin.status,
      reason: reason !== undefined ? reason : gin.reason,
      coa_id: coa_id !== undefined ? coa_id : gin.coa_id,
      gin_date: gin_date !== undefined ? gin_date : gin.gin_date
    }, { transaction });

    console.log(`✅ Updated GIN: ${gin.gin_number}`);

    // =============================================
    // DELETE OLD GIN DETAILS
    // =============================================
    await ZGinDetail.destroy({ where: { gin_main_id: id }, transaction });

    // Create new GIN details
    if (details.length > 0) {
      const detailRecords = details.map(d => ({
        gin_main_id: parseInt(id),
        item_id: d.item_id,
        suggested_qty: d.suggested_qty || 0,
        batchno: d.batchno || null,
        issue_qty: d.issue_qty || 0,
        issue_uom1_qty: d.issue_uom1_qty || 0,
        issue_uom2_qty: d.issue_uom2_qty || 0,
        issue_uom3_qty: d.issue_uom3_qty || 0,
        issue_uom_id: d.issue_uom_id || null,
        remained_unused: d.remained_unused || 0,
        wastage: d.wastage || 0,
        actual_used: d.actual_used || 0,
        actual_used_uom1: d.actual_used_uom1 || 0,
        actual_used_uom2: d.actual_used_uom2 || 0,
        actual_used_uom3: d.actual_used_uom3 || 0
      }));

      await ZGinDetail.bulkCreate(detailRecords, { transaction });
      console.log(`✅ Created ${detailRecords.length} new GIN detail records`);
    }

    // =============================================
    // DELETE OLD EMPLOYEES
    // =============================================
    await ZGinEmployee.destroy({ where: { gin_id: id }, transaction });

    // Create new employee assignments
    if (employees.length > 0) {
      const employeeRecords = employees.map(empId => ({
        gin_id: parseInt(id),
        employee_id: empId
      }));

      await ZGinEmployee.bulkCreate(employeeRecords, { transaction });
      console.log(`✅ Assigned ${employeeRecords.length} employees`);
    }

    // =============================================
    // UPDATE MGDN
    // =============================================

    // Delete old stk_detail records linked to this GIN
    await StkDetail.destroy({ where: { gin_id: parseInt(id) }, transaction });
    console.log(`✅ Deleted old stk_detail records for GIN ID: ${id}`);

    // Find existing MGDN linked to this GIN or create new one
    const detailsWithUsage = details.filter(d => (d.actual_used || 0) > 0 && d.batchno);

    let mgdnNumber = null;
    let mgdnId = null;

    if (detailsWithUsage.length > 0) {
      // Find existing MGDN with remarks containing this GIN number
      let mgdn = await StkMain.findOne({
        where: {
          Stock_Type_ID: 14,
          remarks: { [Op.like]: `%GIN: ${gin.gin_number}%` }
        },
        transaction
      });

      if (mgdn) {
        // Update existing MGDN
        await mgdn.update({
          COA_ID: coa_id || gin.coa_id,
          Date: gin_date || gin.gin_date
        }, { transaction });

        mgdnId = mgdn.ID;
        mgdnNumber = mgdn.Number;
        console.log(`✅ Updated existing MGDN: ${mgdnNumber}`);
      } else {
        // Create new MGDN
        mgdnNumber = await generateMGDNNumber();

        mgdn = await StkMain.create({
          Stock_Type_ID: 14,
          Number: mgdnNumber,
          COA_ID: coa_id || gin.coa_id,
          Date: gin_date || gin.gin_date || new Date(),
          Status: 'UnPost',
          Purchase_Type: 'local manufacturing',
          Status_Account_Entry: 0,
          is_Voucher_Generated: 0,
          approved: 0,
          Carriage_ID: null,
          Carriage_Amount: 0,
          Order_Main_ID: null,
          Transporter_ID: null,
          freight_crt: 0,
          labour_crt: 0,
          bility_expense: 0,
          other_expense: 0,
          booked_crt: 0,
          remarks: `GIN: ${gin.gin_number}`
        }, { transaction });

        mgdnId = mgdn.ID;
        console.log(`✅ Created new MGDN: ${mgdnNumber}`);
      }

      // Create new stk_detail records
      const stkDetailRecords = detailsWithUsage.map((d, index) => {
        const actualUsedUom2 = parseFloat(d.actual_used) || 0;
        const actualUsedUom1 = parseFloat(d.actual_used_uom1) || 0;
        const actualUsedUom3 = parseFloat(d.actual_used_uom3) || 0;

        return {
          STK_Main_ID: mgdnId,
          Line_Id: index + 1,
          Item_ID: d.item_id,
          batchno: d.batchno,
          gin_id: parseInt(id),
          Stock_out_UOM: d.issue_uom_id || null,
          Stock_out_UOM_Qty: actualUsedUom1,
          Stock_out_SKU_UOM: d.issue_uom_id || null,
          Stock_out_SKU_UOM_Qty: actualUsedUom2,
          Stock_out_UOM3_Qty: actualUsedUom3,
          Stock_In_UOM: null,
          Stock_In_UOM_Qty: 0,
          Stock_In_SKU_UOM: null,
          Stock_In_SKU_UOM_Qty: 0,
          Stock_In_UOM3_Qty: 0,
          uom1_qty: actualUsedUom1,
          uom2_qty: actualUsedUom2,
          uom3_qty: actualUsedUom3,
          sale_Uom: d.issue_uom_id || 0,
          Sale_Unit: '2',
          Stock_Price: 0,
          Stock_SKU_Price: 0,
          Discount_A: 0,
          Discount_B: 0,
          Discount_C: 0
        };
      });

      await StkDetail.bulkCreate(stkDetailRecords, { transaction });
      console.log(`✅ Created ${stkDetailRecords.length} new stk_detail records`);
    }

    await transaction.commit();

    // Fetch updated GIN
    const updatedGin = await ZGinMain.findByPk(id, {
      include: [
        { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
        { model: Uom, as: 'uom', attributes: ['id', 'uom'] },
        { model: ZCoa, as: 'coa', attributes: ['id', 'acName'] },
        {
          model: ZGinDetail,
          as: 'details',
          include: [{ model: ZItems, as: 'item', attributes: ['id', 'itemName'] }]
        },
        {
          model: ZGinEmployee,
          as: 'employees',
          include: [{ model: ZEmployee, as: 'employee', attributes: ['id', 'employeeName'] }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'GIN updated successfully',
      data: updatedGin,
      mgdn_number: mgdnNumber,
      mgdn_id: mgdnId
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error updating GIN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// DELETE GIN (Also deletes MGDN data)
// =============================================
const remove = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const gin = await ZGinMain.findByPk(id, { transaction });

    if (!gin) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'GIN not found' });
    }

    // Delete stk_detail records linked to this GIN
    await StkDetail.destroy({ where: { gin_id: parseInt(id) }, transaction });
    console.log(`✅ Deleted stk_detail records for GIN ID: ${id}`);

    // Delete employee assignments
    await ZGinEmployee.destroy({ where: { gin_id: parseInt(id) }, transaction });

    // Delete GIN details
    await ZGinDetail.destroy({ where: { gin_main_id: parseInt(id) }, transaction });

    // Delete GIN main
    await gin.destroy({ transaction });

    await transaction.commit();
    console.log(`✅ Deleted GIN: ${gin.gin_number}`);

    res.json({ success: true, message: 'GIN deleted successfully' });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error deleting GIN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// UPDATE GIN STATUS
// =============================================
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const gin = await ZGinMain.findByPk(id);

    if (!gin) {
      return res.status(404).json({ success: false, message: 'GIN not found' });
    }

    if ((status === 'pending' || status === 'rejected') && !reason) {
      return res.status(400).json({ success: false, message: 'Reason is required' });
    }

    await gin.update({ status, reason: reason || null });

    res.json({ success: true, message: 'Status updated', data: gin });

  } catch (error) {
    console.error('❌ Error updating status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// EXPORTS
// =============================================
module.exports = {
  getAll,
  getById,
  getNextGinNumber,
  getAvailableBatchesForItem,
  getAvailableBatchesForEdit,
  create,
  update,
  remove,
  updateStatus
};
