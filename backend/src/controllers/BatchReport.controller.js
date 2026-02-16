// // controllers/BatchReport.controller.js

// const Stk_main = require('../models/stockMain.model');
// const Stk_Detail = require('../models/stockDetail.model');
// const ZItems = require('../models/zItems.model');
// const ZCoa = require('../models/ZCoa.model');
// const Uom = require('../models/zUom.model');
// const sequelize = require('../../config/database');
// const { Op } = require('sequelize');

// // =============================================
// // CONSTANTS
// // =============================================
// const STOCK_IN_TYPES = [11, 15];   // GRN, MGRN
// const STOCK_OUT_TYPES = [12, 14];  // GDN, MGDN

// // =============================================
// // HELPER: Get UOM Field Names
// // =============================================
// const getUomFields = (uomType) => {
//   switch (uomType) {
//     case '1':
//       return {
//         inField: 'Stock_In_UOM_Qty',
//         outField: 'Stock_out_UOM_Qty',
//         qtyField: 'uom1_qty'
//       };
//     case '3':
//       return {
//         inField: 'Stock_In_UOM3_Qty',
//         outField: 'Stock_out_UOM3_Qty',
//         qtyField: 'uom3_qty'
//       };
//     case '2':
//     default:
//       return {
//         inField: 'Stock_In_SKU_UOM_Qty',
//         outField: 'Stock_out_SKU_UOM_Qty',
//         qtyField: 'uom2_qty'
//       };
//   }
// };

// // =============================================
// // REPORT 1: BATCH STOCK LEDGER
// // Group by Item, Sum IN/OUT, Calculate Balance
// // =============================================
// const getBatchStockLedger = async (req, res) => {
//   try {
//     const { batchno, uom = '2' } = req.query;

//     // Validate
//     if (!batchno) {
//       return res.status(400).json({
//         success: false,
//         message: 'Batch is required'
//       });
//     }

//     const uomFields = getUomFields(uom);

//     // Get batch info
//     const batchInfo = await ZCoa.findByPk(batchno, {
//       attributes: ['id', 'acName']
//     });

//     if (!batchInfo) {
//       return res.status(404).json({
//         success: false,
//         message: 'Batch not found'
//       });
//     }

//     // Fetch all stock details for this batch
//     const stockDetails = await Stk_Detail.findAll({
//       where: { batchno: batchno },
//       include: [
//         {
//           model: Stk_main,
//           as: 'stockMain',
//           attributes: ['ID', 'Number', 'Date', 'Stock_Type_ID', 'Status']
//         },
//         {
//           model: ZItems,
//           as: 'item',
//           attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom3'],
//           include: [
//             { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//             { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//             { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//           ]
//         }
//       ],
//       order: [['Item_ID', 'ASC']]
//     });

//     // Group by Item and calculate totals
//     const itemMap = new Map();

//     stockDetails.forEach(detail => {
//       const stockTypeId = detail.stockMain?.Stock_Type_ID;
//       const itemId = detail.Item_ID;

//       if (!itemId || !stockTypeId) return;

//       // Initialize item entry
//       if (!itemMap.has(itemId)) {
//         itemMap.set(itemId, {
//           item_id: itemId,
//           itemName: detail.item?.itemName || `Item #${itemId}`,
//           uomName: uom === '1' 
//             ? detail.item?.uom1?.uom 
//             : uom === '3' 
//               ? detail.item?.uomThree?.uom 
//               : detail.item?.uomTwo?.uom || 'Pcs',
//           totalIn: 0,
//           totalOut: 0,
//           balance: 0,
//           transactions: []
//         });
//       }

//       const entry = itemMap.get(itemId);

//       // Calculate IN or OUT based on stock type
//       if (STOCK_IN_TYPES.includes(stockTypeId)) {
//         const qty = parseFloat(detail[uomFields.inField]) || 0;
//         entry.totalIn += qty;
//         entry.transactions.push({
//           id: detail.ID,
//           document: detail.stockMain?.Number || '-',
//           date: detail.stockMain?.Date,
//           type: 'IN',
//           stockTypeId,
//           qty: qty
//         });
//       } else if (STOCK_OUT_TYPES.includes(stockTypeId)) {
//         const qty = parseFloat(detail[uomFields.outField]) || 0;
//         entry.totalOut += qty;
//         entry.transactions.push({
//           id: detail.ID,
//           document: detail.stockMain?.Number || '-',
//           date: detail.stockMain?.Date,
//           type: 'OUT',
//           stockTypeId,
//           qty: qty
//         });
//       }
//     });

//     // Calculate balance and prepare result
//     const items = [];
//     let grandTotalIn = 0;
//     let grandTotalOut = 0;

//     itemMap.forEach(entry => {
//       entry.balance = entry.totalIn - entry.totalOut;
//       grandTotalIn += entry.totalIn;
//       grandTotalOut += entry.totalOut;
//       items.push(entry);
//     });

//     // Sort by item name
//     items.sort((a, b) => a.itemName.localeCompare(b.itemName));

//     res.json({
//       success: true,
//       data: {
//         batch: {
//           id: batchInfo.id,
//           name: batchInfo.acName
//         },
//         uomType: uom,
//         items: items,
//         summary: {
//           totalItems: items.length,
//           grandTotalIn: parseFloat(grandTotalIn.toFixed(3)),
//           grandTotalOut: parseFloat(grandTotalOut.toFixed(3)),
//           grandBalance: parseFloat((grandTotalIn - grandTotalOut).toFixed(3))
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error fetching batch stock ledger:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =============================================
// // REPORT 2: BATCH IN/OUT SUMMARY
// // Total IN (all items combined), Individual OUT lines
// // =============================================
// const getBatchInOutSummary = async (req, res) => {
//   try {
//     const { batchno, uom = '2' } = req.query;

//     // Validate
//     if (!batchno) {
//       return res.status(400).json({
//         success: false,
//         message: 'Batch is required'
//       });
//     }

//     const uomFields = getUomFields(uom);

//     // Get batch info
//     const batchInfo = await ZCoa.findByPk(batchno, {
//       attributes: ['id', 'acName']
//     });

//     if (!batchInfo) {
//       return res.status(404).json({
//         success: false,
//         message: 'Batch not found'
//       });
//     }

//     // Fetch all stock details for this batch
//     const stockDetails = await Stk_Detail.findAll({
//       where: { batchno: batchno },
//       include: [
//         {
//           model: Stk_main,
//           as: 'stockMain',
//           attributes: ['ID', 'Number', 'Date', 'Stock_Type_ID', 'Status']
//         },
//         {
//           model: ZItems,
//           as: 'item',
//           attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom3'],
//           include: [
//             { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//             { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//             { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//           ]
//         }
//       ],
//       order: [[{ model: Stk_main, as: 'stockMain' }, 'Date', 'ASC']]
//     });

//     // Calculate total IN and collect OUT details
//     let totalStockIn = 0;
//     const stockInDetails = [];
//     const stockOutDetails = [];

//     stockDetails.forEach(detail => {
//       const stockTypeId = detail.stockMain?.Stock_Type_ID;
//       if (!stockTypeId) return;

//       const uomName = uom === '1' 
//         ? detail.item?.uom1?.uom 
//         : uom === '3' 
//           ? detail.item?.uomThree?.uom 
//           : detail.item?.uomTwo?.uom || 'Pcs';

//       if (STOCK_IN_TYPES.includes(stockTypeId)) {
//         const qty = parseFloat(detail[uomFields.inField]) || 0;
//         totalStockIn += qty;

//         stockInDetails.push({
//           id: detail.ID,
//           document: detail.stockMain?.Number || '-',
//           documentId: detail.stockMain?.ID,
//           date: detail.stockMain?.Date,
//           stockTypeId,
//           stockTypeName: stockTypeId === 11 ? 'GRN' : 'MGRN',
//           item_id: detail.Item_ID,
//           itemName: detail.item?.itemName || `Item #${detail.Item_ID}`,
//           qty: parseFloat(qty.toFixed(3)),
//           uomName
//         });
//       } else if (STOCK_OUT_TYPES.includes(stockTypeId)) {
//         const qty = parseFloat(detail[uomFields.outField]) || 0;

//         stockOutDetails.push({
//           id: detail.ID,
//           document: detail.stockMain?.Number || '-',
//           documentId: detail.stockMain?.ID,
//           date: detail.stockMain?.Date,
//           stockTypeId,
//           stockTypeName: stockTypeId === 12 ? 'GDN' : 'MGDN',
//           item_id: detail.Item_ID,
//           itemName: detail.item?.itemName || `Item #${detail.Item_ID}`,
//           qty: parseFloat(qty.toFixed(3)),
//           uomName
//         });
//       }
//     });

//     // Calculate total OUT
//     const totalStockOut = stockOutDetails.reduce((sum, d) => sum + d.qty, 0);

//     res.json({
//       success: true,
//       data: {
//         batch: {
//           id: batchInfo.id,
//           name: batchInfo.acName
//         },
//         uomType: uom,
//         stockIn: {
//           total: parseFloat(totalStockIn.toFixed(3)),
//           count: stockInDetails.length,
//           details: stockInDetails
//         },
//         stockOut: {
//           total: parseFloat(totalStockOut.toFixed(3)),
//           count: stockOutDetails.length,
//           details: stockOutDetails
//         },
//         summary: {
//           totalIn: parseFloat(totalStockIn.toFixed(3)),
//           totalOut: parseFloat(totalStockOut.toFixed(3)),
//           remaining: parseFloat((totalStockIn - totalStockOut).toFixed(3))
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error fetching batch in/out summary:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =============================================
// // GET ALL BATCHES WITH STOCK
// // =============================================
// const getBatchesWithStock = async (req, res) => {
//   try {
//     // Get distinct batches that have stock entries
//     const batches = await Stk_Detail.findAll({
//       attributes: [
//         [sequelize.fn('DISTINCT', sequelize.col('batchno')), 'batchno']
//       ],
//       where: {
//         batchno: { [Op.ne]: null }
//       },
//       raw: true
//     });

//     const batchIds = batches.map(b => b.batchno).filter(Boolean);

//     if (batchIds.length === 0) {
//       return res.json({ success: true, data: [] });
//     }

//     // Get batch details from COA
//     const batchDetails = await ZCoa.findAll({
//       where: { id: { [Op.in]: batchIds } },
//       attributes: ['id', 'acName'],
//       order: [['acName', 'ASC']]
//     });

//     res.json({ success: true, data: batchDetails });

//   } catch (error) {
//     console.error('❌ Error fetching batches with stock:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // =============================================
// // EXPORTS
// // =============================================
// module.exports = {
//   getBatchStockLedger,
//   getBatchInOutSummary,
//   getBatchesWithStock
// };




























// controllers/BatchReport.controller.js

const Stk_main = require('../models/stockMain.model');
const Stk_Detail = require('../models/stockDetail.model');
const ZItems = require('../models/zItems.model');
const ZCoa = require('../models/ZCoa.model');
const Uom = require('../models/zUom.model');
const sequelize = require('../../config/database');
const { Op } = require('sequelize');

// =============================================
// CONSTANTS
// =============================================
const STOCK_IN_TYPES = [11, 15];   // GRN, MGRN
const STOCK_OUT_TYPES = [12, 14];  // GDN, MGDN

// =============================================
// HELPER: Get UOM Field Names
// =============================================
const getUomFields = (uomType) => {
  switch (uomType) {
    case '1':
      return {
        inField: 'Stock_In_UOM_Qty',
        outField: 'Stock_out_UOM_Qty',
        qtyField: 'uom1_qty'
      };
    case '3':
      return {
        inField: 'Stock_In_UOM3_Qty',
        outField: 'Stock_out_UOM3_Qty',
        qtyField: 'uom3_qty'
      };
    case '2':
    default:
      return {
        inField: 'Stock_In_SKU_UOM_Qty',
        outField: 'Stock_out_SKU_UOM_Qty',
        qtyField: 'uom2_qty'
      };
  }
};

// =============================================
// REPORT 1: BATCH STOCK LEDGER
// =============================================
const getBatchStockLedger = async (req, res) => {
  console.log('📊 [BATCH STOCK LEDGER] Request received');
  console.log('📊 [BATCH STOCK LEDGER] Query params:', req.query);

  try {
    const { batchno, uom = '2' } = req.query;

    // Validate
    if (!batchno) {
      console.log('❌ [BATCH STOCK LEDGER] Error: Batch is required');
      return res.status(400).json({
        success: false,
        message: 'Batch is required'
      });
    }

    console.log(`📊 [BATCH STOCK LEDGER] Fetching data for batch: ${batchno}, UOM: ${uom}`);

    const uomFields = getUomFields(uom);
    console.log('📊 [BATCH STOCK LEDGER] UOM Fields:', uomFields);

    // Get batch info
    const batchInfo = await ZCoa.findByPk(batchno, {
      attributes: ['id', 'acName']
    });

    if (!batchInfo) {
      console.log(`❌ [BATCH STOCK LEDGER] Batch not found: ${batchno}`);
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    console.log('📊 [BATCH STOCK LEDGER] Batch info:', batchInfo.toJSON());

    // Fetch all stock details for this batch
    console.log('📊 [BATCH STOCK LEDGER] Fetching stock details...');
    
    const stockDetails = await Stk_Detail.findAll({
      where: { batchno: batchno },
      include: [
        {
          model: Stk_main,
          as: 'stockMain',
          attributes: ['ID', 'Number', 'Date', 'Stock_Type_ID', 'Status', 'COA_ID'],
          include: [
            {
              model: ZCoa,
              as: 'account',
              attributes: ['id', 'acName']
            }
          ]
        },
        {
          model: ZItems,
          as: 'item',
          attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom3'],
          include: [
            { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
          ]
        }
      ],
      order: [['Item_ID', 'ASC']]
    });

    console.log(`📊 [BATCH STOCK LEDGER] Found ${stockDetails.length} stock detail records`);

    // Group by Item and calculate totals
    const itemMap = new Map();

    stockDetails.forEach(detail => {
      const stockTypeId = detail.stockMain?.Stock_Type_ID;
      const itemId = detail.Item_ID;

      if (!itemId || !stockTypeId) {
        console.log(`⚠️ [BATCH STOCK LEDGER] Skipping record - Missing itemId: ${itemId}, stockTypeId: ${stockTypeId}`);
        return;
      }

      // Initialize item entry
      if (!itemMap.has(itemId)) {
        itemMap.set(itemId, {
          item_id: itemId,
          itemName: detail.item?.itemName || `Item #${itemId}`,
          uomName: uom === '1' 
            ? detail.item?.uom1?.uom 
            : uom === '3' 
              ? detail.item?.uomThree?.uom 
              : detail.item?.uomTwo?.uom || 'Pcs',
          totalIn: 0,
          totalOut: 0,
          balance: 0,
          transactions: []
        });
      }

      const entry = itemMap.get(itemId);

      // Calculate IN or OUT based on stock type
      if (STOCK_IN_TYPES.includes(stockTypeId)) {
        const qty = parseFloat(detail[uomFields.inField]) || 0;
        entry.totalIn += qty;
        entry.transactions.push({
          id: detail.ID,
          document: detail.stockMain?.Number || '-',
          date: detail.stockMain?.Date,
          type: 'IN',
          stockTypeId,
          qty: qty,
          acName: detail.stockMain?.account?.acName || '-'
        });
        console.log(`📥 [BATCH STOCK LEDGER] IN: Item ${itemId}, Doc: ${detail.stockMain?.Number}, Qty: ${qty}`);
      } else if (STOCK_OUT_TYPES.includes(stockTypeId)) {
        const qty = parseFloat(detail[uomFields.outField]) || 0;
        entry.totalOut += qty;
        entry.transactions.push({
          id: detail.ID,
          document: detail.stockMain?.Number || '-',
          date: detail.stockMain?.Date,
          type: 'OUT',
          stockTypeId,
          qty: qty,
          acName: detail.stockMain?.account?.acName || '-'
        });
        console.log(`📤 [BATCH STOCK LEDGER] OUT: Item ${itemId}, Doc: ${detail.stockMain?.Number}, Qty: ${qty}`);
      }
    });

    // Calculate balance and prepare result
    const items = [];
    let grandTotalIn = 0;
    let grandTotalOut = 0;

    itemMap.forEach(entry => {
      entry.balance = entry.totalIn - entry.totalOut;
      grandTotalIn += entry.totalIn;
      grandTotalOut += entry.totalOut;
      items.push(entry);
    });

    // Sort by item name
    items.sort((a, b) => a.itemName.localeCompare(b.itemName));

    const responseData = {
      batch: {
        id: batchInfo.id,
        name: batchInfo.acName
      },
      uomType: uom,
      items: items,
      summary: {
        totalItems: items.length,
        grandTotalIn: parseFloat(grandTotalIn.toFixed(3)),
        grandTotalOut: parseFloat(grandTotalOut.toFixed(3)),
        grandBalance: parseFloat((grandTotalIn - grandTotalOut).toFixed(3))
      }
    };

    console.log('✅ [BATCH STOCK LEDGER] Summary:', responseData.summary);
    console.log('✅ [BATCH STOCK LEDGER] Response sent successfully');

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ [BATCH STOCK LEDGER] Error:', error);
    console.error('❌ [BATCH STOCK LEDGER] Error Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// =============================================
// REPORT 2: BATCH IN/OUT SUMMARY
// =============================================
const getBatchInOutSummary = async (req, res) => {
  console.log('📊 [BATCH IN/OUT SUMMARY] Request received');
  console.log('📊 [BATCH IN/OUT SUMMARY] Query params:', req.query);

  try {
    const { batchno, uom = '2' } = req.query;

    // Validate
    if (!batchno) {
      console.log('❌ [BATCH IN/OUT SUMMARY] Error: Batch is required');
      return res.status(400).json({
        success: false,
        message: 'Batch is required'
      });
    }

    console.log(`📊 [BATCH IN/OUT SUMMARY] Fetching data for batch: ${batchno}, UOM: ${uom}`);

    const uomFields = getUomFields(uom);
    console.log('📊 [BATCH IN/OUT SUMMARY] UOM Fields:', uomFields);

    // Get batch info
    const batchInfo = await ZCoa.findByPk(batchno, {
      attributes: ['id', 'acName']
    });

    if (!batchInfo) {
      console.log(`❌ [BATCH IN/OUT SUMMARY] Batch not found: ${batchno}`);
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    console.log('📊 [BATCH IN/OUT SUMMARY] Batch info:', batchInfo.toJSON());

    // Fetch all stock details for this batch
    console.log('📊 [BATCH IN/OUT SUMMARY] Fetching stock details...');

    const stockDetails = await Stk_Detail.findAll({
      where: { batchno: batchno },
      include: [
        {
          model: Stk_main,
          as: 'stockMain',
          attributes: ['ID', 'Number', 'Date', 'Stock_Type_ID', 'Status', 'COA_ID'],
          include: [
            {
              model: ZCoa,
              as: 'account',
              attributes: ['id', 'acName']
            }
          ]
        },
        {
          model: ZItems,
          as: 'item',
          attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom3'],
          include: [
            { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
          ]
        }
      ],
      order: [[{ model: Stk_main, as: 'stockMain' }, 'Date', 'ASC']]
    });

    console.log(`📊 [BATCH IN/OUT SUMMARY] Found ${stockDetails.length} stock detail records`);

    // Calculate total IN and collect OUT details
    let totalStockIn = 0;
    const stockInDetails = [];
    const stockOutDetails = [];

    stockDetails.forEach(detail => {
      const stockTypeId = detail.stockMain?.Stock_Type_ID;
      
      if (!stockTypeId) {
        console.log(`⚠️ [BATCH IN/OUT SUMMARY] Skipping record - Missing stockTypeId`);
        return;
      }

      // Get UOM name
      const uomName = uom === '1' 
        ? detail.item?.uom1?.uom 
        : uom === '3' 
          ? detail.item?.uomThree?.uom 
          : detail.item?.uomTwo?.uom || 'Pcs';

      // ✅ Get account info from stk_main
      const coaId = detail.stockMain?.COA_ID || null;
      const acName = detail.stockMain?.account?.acName || '-';
      console.log(`📊 [BATCH IN/OUT SUMMARY] Processing record ID: ${detail.ID}, Stock Type: ${stockTypeId}, Account: ${detail.stockMain.account.acName}`);

      if (STOCK_IN_TYPES.includes(stockTypeId)) {
        const qty = parseFloat(detail[uomFields.inField]) || 0;
        totalStockIn += qty;

        stockInDetails.push({
          id: detail.ID,
          document: detail.stockMain?.Number || '-',
          documentId: detail.stockMain?.ID,
          date: detail.stockMain?.Date,
          stockTypeId: stockTypeId,
          stockTypeName: stockTypeId === 11 ? 'GRN' : 'MGRN',
          accountId: coaId,
          acName: acName,
          item_id: detail.Item_ID,
          itemName: detail.item?.itemName || `Item #${detail.Item_ID}`,
          qty: parseFloat(qty.toFixed(3)),
          uomName: uomName
        });

        console.log(`📥 [BATCH IN/OUT SUMMARY] IN: ${detail.stockMain?.Number}, Account: ${acName}, Qty: ${qty}`);

      } else if (STOCK_OUT_TYPES.includes(stockTypeId)) {
        const qty = parseFloat(detail[uomFields.outField]) || 0;

        stockOutDetails.push({
          id: detail.ID,
          document: detail.stockMain?.Number || '-',
          documentId: detail.stockMain?.ID,
          date: detail.stockMain?.Date,
          stockTypeId: stockTypeId,
          stockTypeName: stockTypeId === 12 ? 'GDN' : 'MGDN',
          accountId: coaId,
          acName: acName,
          item_id: detail.Item_ID,
          itemName: detail.item?.itemName || `Item #${detail.Item_ID}`,
          qty: parseFloat(qty.toFixed(3)),
          uomName: uomName
        });

        console.log(`📤 [BATCH IN/OUT SUMMARY] OUT: ${detail.stockMain?.Number}, Account: ${acName}, Qty: ${qty}`);
      }
    });

    // Calculate total OUT
    const totalStockOut = stockOutDetails.reduce((sum, d) => sum + d.qty, 0);

    const responseData = {
      batch: {
        id: batchInfo.id,
        name: batchInfo.acName
      },
      uomType: uom,
      stockIn: {
        total: parseFloat(totalStockIn.toFixed(3)),
        count: stockInDetails.length,
        details: stockInDetails
      },
      stockOut: {
        total: parseFloat(totalStockOut.toFixed(3)),
        count: stockOutDetails.length,
        details: stockOutDetails
      },
      summary: {
        totalIn: parseFloat(totalStockIn.toFixed(3)),
        totalOut: parseFloat(totalStockOut.toFixed(3)),
        remaining: parseFloat((totalStockIn - totalStockOut).toFixed(3))
      }
    };

    console.log('✅ [BATCH IN/OUT SUMMARY] Summary:', responseData.summary);
    console.log('✅ [BATCH IN/OUT SUMMARY] Stock IN count:', stockInDetails.length);
    console.log('✅ [BATCH IN/OUT SUMMARY] Stock OUT count:', stockOutDetails.length);

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ [BATCH IN/OUT SUMMARY] Error:', error);
    console.error('❌ [BATCH IN/OUT SUMMARY] Error Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// =============================================
// GET ALL BATCHES WITH STOCK
// =============================================
const getBatchesWithStock = async (req, res) => {
  console.log('📊 [BATCHES WITH STOCK] Request received');

  try {
    // Get distinct batches that have stock entries
    const batches = await Stk_Detail.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('batchno')), 'batchno']
      ],
      where: {
        batchno: { [Op.ne]: null }
      },
      raw: true
    });

    console.log(`📊 [BATCHES WITH STOCK] Found ${batches.length} distinct batches`);

    const batchIds = batches.map(b => b.batchno).filter(Boolean);

    if (batchIds.length === 0) {
      console.log('📊 [BATCHES WITH STOCK] No batches found');
      return res.json({ success: true, data: [] });
    }

    // Get batch details from COA
    const batchDetails = await ZCoa.findAll({
      where: { id: { [Op.in]: batchIds } },
      attributes: ['id', 'acName'],
      order: [['acName', 'ASC']]
    });

    console.log(`✅ [BATCHES WITH STOCK] Returning ${batchDetails.length} batches`);

    res.json({ success: true, data: batchDetails });

  } catch (error) {
    console.error('❌ [BATCHES WITH STOCK] Error:', error);
    console.error('❌ [BATCHES WITH STOCK] Error Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// =============================================
// EXPORTS
// =============================================
module.exports = {
  getBatchStockLedger,
  getBatchInOutSummary,
  getBatchesWithStock
};
