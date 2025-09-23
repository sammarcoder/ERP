// // routes/dispatch.js
const express = require('express');
const router = express.Router();
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const {Uom } = require('../models');

// // Generate Dispatch Number based on type sequence
// const generateDispatchNumber = async () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
  
//   const lastDispatch = await Stk_main.findOne({
//     where: { 
//       Stock_Type_ID: 2, // Dispatch type
//       Number: { [Op.like]: `DS-${year}${month}%` }
//     },
//     order: [['Number', 'DESC']]
//   });

//   let sequence = 1;
//   if (lastDispatch) {
//     const lastSequence = parseInt(lastDispatch.Number.split('-')[2]);
//     sequence = lastSequence + 1;
//   }

//   return `DS-${year}${month}-${String(sequence).padStart(4, '0')}`;
// };

// // GET /api/dispatch - Get all dispatches
// router.get('/', async (req, res) => {
//   try {
//     const dispatches = await Stk_main.findAll({
//       where: { Stock_Type_ID: 2 }, // Only dispatch records
//       include: [
//         {
//           model: Stk_Detail,
//           as: 'stock_details',
//           include: [
//             { 
//               model: ZItems, 
//               as: 'stock_item',
//               include: [
//                 { model: Uom, as: 'uom1' },
//                 { model: Uom, as: 'uomTwo' },
//                 { model: Uom, as: 'uomThree' }
//               ]
//             }
//           ]
//         },
//         { model: ZCoa, as: 'account' },
//         { model: Order_Main, as: 'order' },
       
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     res.json({
//       success: true,
//       data: dispatches
//     });
//   } catch (error) {
//     console.error('Error fetching dispatches:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// // GET /api/dispatch/available-batches/:itemId - Get available batches for item
// // router.get('/available-batches/:itemId', async (req, res) => {
// //   try {
// //     const { itemId } = req.params;

// //     // ADVANCED: Get available stock by batch for specific item
// //     const availableBatches = await sequelize.query(`
// //       SELECT 
// //         grn.Purchase_Batchno as batch_number,
// //         grn_detail.Batchno_id as batch_id,
// //         SUM(grn_detail.Stock_In_UOM_Qty) as received_qty,
// //         COALESCE(SUM(dispatch_detail.Stock_out_UOM_Qty), 0) as dispatched_qty,
// //         (SUM(grn_detail.Stock_In_UOM_Qty) - COALESCE(SUM(dispatch_detail.Stock_out_UOM_Qty), 0)) as available_qty
// //       FROM Stk_main grn
// //       JOIN Stk_Detail grn_detail ON grn.ID = grn_detail.STK_Main_ID
// //       LEFT JOIN Stk_Detail dispatch_detail ON grn_detail.Item_ID = dispatch_detail.Item_ID 
// //         AND grn_detail.Batchno_id = dispatch_detail.Batchno_id
// //         AND dispatch_detail.STK_Main_ID IN (
// //           SELECT ID FROM Stk_main WHERE Stock_Type_ID = 2
// //         )
// //       WHERE grn.Stock_Type_ID = 1 
// //         AND grn_detail.Item_ID = :itemId
// //       GROUP BY grn.Purchase_Batchno, grn_detail.Batchno_id
// //       HAVING available_qty > 0
// //       ORDER BY grn.Date ASC
// //     `, {
// //       replacements: { itemId },
// //       type: sequelize.QueryTypes.SELECT
// //     });

// //     res.json({
// //       success: true,
// //       data: availableBatches
// //     });
// //   } catch (error) {
// //     console.error('Error fetching available batches:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message
// //     });
// //   }
// // });





// router.get('/available-batches/:itemId', async (req, res) => {
//   try {
//     const { itemId } = req.params;

//     // SIMPLIFIED: First check if there are any GRN records for this item
//     const grnRecords = await sequelize.query(`
//       SELECT 
//         sm.Purchase_Batchno as batch_number,
//         sd.Batchno_id as batch_id,
//         sm.Date as grn_date,
//         sd.Stock_In_UOM_Qty as received_qty_uom1,
//         COALESCE(sd.Stock_In_SKU_UOM_Qty, 0) as received_qty_uom2,
//         COALESCE(sd.Stock_In_UOM3_Qty, 0) as received_qty_uom3,
//         sm.ID as grn_id,
//         sd.ID as grn_detail_id
//       FROM Stk_main sm
//       INNER JOIN Stk_Detail sd ON sm.ID = sd.STK_Main_ID
//       WHERE sm.Stock_Type_ID = 1
//         AND sd.Item_ID = :itemId
//       ORDER BY sm.Date ASC
//     `, {
//       replacements: { itemId },
//       type: sequelize.QueryTypes.SELECT
//     });

//     console.log(`Found ${grnRecords.length} GRN records for item ${itemId}:`, grnRecords);

//     if (grnRecords.length === 0) {
//       return res.json({
//         success: true,
//         data: [],
//         message: 'No GRN records found for this item'
//       });
//     }

//     // For now, return simplified data
//     const simplifiedBatches = grnRecords.map(record => ({
//       batch_number: record.batch_number,
//       batch_id: record.batch_id,
//       grn_date: record.grn_date,
//       available_qty: record.received_qty_uom1, // For now, assume no dispatches
//       available_qty_uom2: record.received_qty_uom2,
//       available_qty_uom3: record.received_qty_uom3
//     }));

//     res.json({
//       success: true,
//       data: simplifiedBatches
//     });
//   } catch (error) {
//     console.error('Error fetching available batches:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });









// // POST /api/dispatch - Create dispatch with multi-batch logic
// router.post('/', async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const { stockMain, stockDetails } = req.body;

//     // Generate auto dispatch number as per type sequence
//     const dispatchNumber = await generateDispatchNumber();

//     // Create Stk_main record
//     const dispatch = await Stk_main.create({
//       ...stockMain,
//       Number: dispatchNumber
//     }, { transaction });

//     // Create Stk_Detail records (can be multiple rows for same item with different batches)
//     const dispatchDetails = stockDetails.map((detail, index) => ({
//       ...detail,
//       STK_Main_ID: dispatch.ID,
//       Line_Id: index + 1
//     }));

//     const createdDetails = await Stk_Detail.bulkCreate(dispatchDetails, { 
//       transaction,
//       validate: true 
//     });

//     // ADDED: Update Order_Main Dispatch_Status as per your requirement
//     if (stockMain.Order_Main_ID) {
//       await Order_Main.update(
//         { Dispatch_Status: 'Partial' }, // Can be made dynamic based on quantities
//         { 
//           where: { ID: stockMain.Order_Main_ID },
//           transaction 
//         }
//       );
//     }

//     await transaction.commit();

//     res.status(201).json({
//       success: true,
//       message: 'Sales Dispatch created successfully',
//       data: { 
//         ...dispatch.toJSON(), 
//         details: createdDetails,
//         dispatchNumber: dispatchNumber
//       }
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error creating dispatch:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// module.exports = router;











































// routes/dispatch.js (update your existing file)

// FIXED: Convert to Sequelize built-in methods
router.get('/available-batches/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    console.log(`🔍 Fetching available batches for item ID: ${itemId}`);

    // STEP 1: Get all GRN records for this item using Sequelize
    const grnRecords = await Stk_main.findAll({
      where: { 
        Stock_Type_ID: 1 // GRN type only
      },
      include: [
        {
          model: Stk_Detail,
          as: 'stock_details', // Use the alias from your associations
          where: { 
            Item_ID: itemId
          },
          required: true, // INNER JOIN
          include: [
            {
              model: ZItems,
              as: 'stock_item', // Use the alias from your associations
              include: [
                { model: Uom, as: 'uom1' },
                { model: Uom, as: 'uomTwo' },
                { model: Uom, as: 'uomThree' }
              ]
            }
          ]
        }
      ],
      order: [['Date', 'ASC']]
    });

    console.log(`📦 Found ${grnRecords.length} GRN records for item ${itemId}`);

    if (grnRecords.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: `No GRN records found for item ID ${itemId}. Create GRN first.`,
        debug: {
          itemId,
          searchedFor: 'GRN records (Stock_Type_ID = 1)',
          suggestion: 'Create GRN from Purchase Order first'
        }
      });
    }

    // STEP 2: Get dispatch records for this item to calculate consumed stock
    const dispatchRecords = await Stk_main.findAll({
      where: { 
        Stock_Type_ID: 2 // Dispatch type only
      },
      include: [
        {
          model: Stk_Detail,
          as: 'stock_details',
          where: { 
            Item_ID: itemId
          },
          required: true
        }
      ]
    });

    console.log(`🚚 Found ${dispatchRecords.length} dispatch records for item ${itemId}`);

    // STEP 3: Calculate available stock by batch
    const availableBatches = [];

    grnRecords.forEach(grn => {
      grn.stock_details.forEach(grnDetail => {
        // Calculate total dispatched from this specific batch
        let dispatchedUOM1 = 0;
        let dispatchedUOM2 = 0;
        let dispatchedUOM3 = 0;

        dispatchRecords.forEach(dispatch => {
          dispatch.stock_details.forEach(dispatchDetail => {
            // Match by same batch
            if (dispatchDetail.Batchno_id === grnDetail.Batchno_id) {
              dispatchedUOM1 += parseFloat(dispatchDetail.Stock_out_UOM_Qty || 0);
              dispatchedUOM2 += parseFloat(dispatchDetail.Stock_out_SKU_UOM_Qty || 0);
              dispatchedUOM3 += parseFloat(dispatchDetail.Stock_out_UOM3_Qty || 0);
            }
          });
        });

        // Calculate available quantities
        const receivedUOM1 = parseFloat(grnDetail.Stock_In_UOM_Qty || 0);
        const receivedUOM2 = parseFloat(grnDetail.Stock_In_SKU_UOM_Qty || 0);
        const receivedUOM3 = parseFloat(grnDetail.Stock_In_UOM3_Qty || 0);

        const availableUOM1 = receivedUOM1 - dispatchedUOM1;
        const availableUOM2 = receivedUOM2 - dispatchedUOM2;
        const availableUOM3 = receivedUOM3 - dispatchedUOM3;

        // Only include batches with available stock
        if (availableUOM1 > 0 || availableUOM2 > 0 || availableUOM3 > 0) {
          availableBatches.push({
            batch_number: grn.Purchase_Batchno,
            batch_id: grnDetail.Batchno_id,
            grn_id: grn.ID,
            grn_number: grn.Number,
            grn_date: grn.Date,
            
            // Received quantities (from GRN)
            received_qty_uom1: receivedUOM1,
            received_qty_uom2: receivedUOM2,
            received_qty_uom3: receivedUOM3,
            
            // Dispatched quantities (consumed)
            dispatched_qty_uom1: dispatchedUOM1,
            dispatched_qty_uom2: dispatchedUOM2,
            dispatched_qty_uom3: dispatchedUOM3,
            
            // Available quantities (remaining)
            available_qty: availableUOM1, // Default UOM1
            available_qty_uom1: availableUOM1,
            available_qty_uom2: availableUOM2,
            available_qty_uom3: availableUOM3,

            // Item details
            item: grnDetail.stock_item
          });
        }
      });
    });

    console.log(`📊 Calculated ${availableBatches.length} batches with available stock`);

    res.json({
      success: true,
      data: availableBatches,
      count: availableBatches.length,
      debug: {
        itemId,
        grnRecordsFound: grnRecords.length,
        dispatchRecordsFound: dispatchRecords.length,
        batchesWithStock: availableBatches.length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching available batches:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      debug: {
        itemId: req.params.itemId,
        errorType: error.name,
        suggestion: 'Check if Stk_main and Stk_Detail tables exist and have proper associations'
      }
    });
  }
});

// ADD: Debug API to check what data exists
router.get('/debug/check-data/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    // Check if item exists in ZItems
    const itemExists = await ZItems.findByPk(itemId);
    
    // Check total GRN records
    const totalGRNs = await Stk_main.count({ where: { Stock_Type_ID: 1 } });
    
    // Check total dispatch records
    const totalDispatches = await Stk_main.count({ where: { Stock_Type_ID: 2 } });
    
    // Check GRN details for this item
    const grnDetailsForItem = await Stk_Detail.count({ 
      include: [{
        model: Stk_main,
        as: 'stockMain',
        where: { Stock_Type_ID: 1 }
      }],
      where: { Item_ID: itemId }
    });

    // Sample GRN record
    const sampleGRN = await Stk_main.findOne({
      where: { Stock_Type_ID: 1 },
      include: [
        {
          model: Stk_Detail,
          as: 'stock_details',
          limit: 1
        }
      ]
    });

    res.json({
      success: true,
      debug: {
        itemId,
        itemExists: !!itemExists,
        itemName: itemExists?.itemName || 'Not found',
        counts: {
          totalGRNRecords: totalGRNs,
          totalDispatchRecords: totalDispatches,
          grnDetailsForThisItem: grnDetailsForItem
        },
        sampleGRN: sampleGRN ? {
          id: sampleGRN.ID,
          number: sampleGRN.Number,
          date: sampleGRN.Date,
          batchno: sampleGRN.Purchase_Batchno,
          detailsCount: sampleGRN.stock_details?.length || 0
        } : null,
        suggestion: totalGRNs === 0 ? 'No GRN records exist. Create GRN first using Purchase Order.' : 'GRN records exist but not for this item.'
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Check model associations and table names'
    });
  }
});

// ADD: Simple test API
router.get('/test/simple', async (req, res) => {
  try {
    // Test basic table access
    const stkMainCount = await Stk_main.count();
    const stkDetailCount = await Stk_Detail.count();
    
    res.json({
      success: true,
      message: 'API working',
      data: {
        stkMainRecords: stkMainCount,
        stkDetailRecords: stkDetailCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: 'Check if tables exist and models are properly imported'
    });
  }
});





module.exports = router