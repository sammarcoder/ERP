
// // controllers/ZMgrn.controller.js

// const Stk_main = require('../models/stockMain.model');
// const Stk_Detail = require('../models/stockDetail.model');
// const ZGinMain = require('../models/ZGinMain.model');
// const ZItems = require('../models/zItems.model');
// const ZCoa = require('../models/ZCoa.model');
// const Uom = require('../models/zUom.model');
// const sequelize = require('../../config/database');
// const { Op } = require('sequelize');

// // =============================================
// // CONSTANTS
// // =============================================
// const MGRN_STOCK_TYPE_ID = 15; // ✅ MGRN Stock Type

// // =============================================
// // GENERATE MGRN NUMBER
// // =============================================
// const generateMGRNNumber = async () => {
//     const lastMGRN = await Stk_main.findOne({
//         where: { Stock_Type_ID: MGRN_STOCK_TYPE_ID },
//         order: [['ID', 'DESC']],
//         attributes: ['Number']
//     });

//     if (!lastMGRN || !lastMGRN.Number) {
//         return 'MGRN-1';
//     }

//     const match = lastMGRN.Number.match(/MGRN-(\d+)/);
//     const lastNumber = match ? parseInt(match[1]) : 0;
//     return `MGRN-${lastNumber + 1}`;
// };

// // =============================================
// // GET ALL MGRN
// // =============================================
// const getAll = async (req, res) => {
//     try {
//         const mgrns = await Stk_main.findAll({
//             where: { Stock_Type_ID: MGRN_STOCK_TYPE_ID },
//             include: [
//                 {
//                     model: ZCoa,
//                     as: 'account',
//                     attributes: ['id', 'acName']
//                 },
//                 {
//                     model: Stk_Detail,
//                     as: 'details',
//                     include: [
//                         { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
//                         { model: ZGinMain, as: 'ginMain', attributes: ['id', 'gin_number', 'item_id', 'qty_planned'] },
//                         { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName'] }
//                     ]
//                 }
//             ],
//             order: [['ID', 'DESC']]
//         });

//         res.json({ success: true, data: mgrns });
//     } catch (error) {
//         console.error('❌ Error fetching MGRNs:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // =============================================
// // GET MGRN BY ID
// // =============================================
// const getById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const mgrn = await Stk_main.findOne({
//             where: {
//                 ID: id,
//                 Stock_Type_ID: MGRN_STOCK_TYPE_ID
//             },
//             include: [
//                 { model: ZCoa, as: 'account', attributes: ['id', 'acName'] },
//                 {
//                     model: Stk_Detail,
//                     as: 'details',
//                     include: [
//                         {
//                             model: ZItems,
//                             as: 'item',
//                             attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
//                             include: [
//                                 { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//                                 { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//                                 { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//                             ]
//                         },
//                         {
//                             model: ZGinMain,
//                             as: 'ginMain',
//                             attributes: ['id', 'gin_number', 'item_id', 'qty_planned', 'status'],
//                             include: [
//                                 { model: ZItems, as: 'item', attributes: ['id', 'itemName'] }
//                             ]
//                         },
//                         { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName'] }
//                     ]
//                 }
//             ]
//         });

//         if (!mgrn) {
//             return res.status(404).json({ success: false, message: 'MGRN not found' });
//         }

//         res.json({ success: true, data: mgrn });
//     } catch (error) {
//         console.error('❌ Error fetching MGRN:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // =============================================
// // GET NEXT MGRN NUMBER
// // =============================================
// const getNextMGRNNumber = async (req, res) => {
//     try {
//         const mgrnNumber = await generateMGRNNumber();
//         res.json({ success: true, data: mgrnNumber });
//     } catch (error) {
//         console.error('❌ Error generating MGRN number:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // =============================================
// // GET GINS AVAILABLE FOR MGRN (Only Open Status)
// // =============================================
// const getGinsForMgrn = async (req, res) => {
//     try {
//         const gins = await ZGinMain.findAll({
//             where: { status: 'open' },
//             include: [
//                 {
//                     model: ZItems,
//                     as: 'item',
//                     attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
//                     include: [
//                         { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//                         { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//                         { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//                     ]
//                 },
//                 { model: Uom, as: 'uom', attributes: ['id', 'uom'] }
//             ],
//             order: [['id', 'DESC']]
//         });

//         res.json({ success: true, data: gins });
//     } catch (error) {
//         console.error('❌ Error fetching GINs for MGRN:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // =============================================
// // CREATE MGRN
// // =============================================
// const create = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     let isCommitted = false;

//     try {
//         const {
//             coa_id,
//             batchno,
//             mgrn_date,
//             remarks,
//             details = []
//         } = req.body;

//         // Validate
//         if (!coa_id) {
//             await transaction.rollback();
//             return res.status(400).json({ success: false, message: 'Account is required' });
//         }

//         if (!batchno) {
//             await transaction.rollback();
//             return res.status(400).json({ success: false, message: 'Batch is required' });
//         }

//         if (!details || details.length === 0) {
//             await transaction.rollback();
//             return res.status(400).json({ success: false, message: 'At least one GIN must be selected' });
//         }

//         // Validate each detail
//         for (const detail of details) {
//             if (!detail.gin_id) {
//                 await transaction.rollback();
//                 return res.status(400).json({ success: false, message: 'GIN is required for each line' });
//             }
//             if (!detail.qty_received || detail.qty_received <= 0) {
//                 await transaction.rollback();
//                 return res.status(400).json({ success: false, message: 'Quantity received must be greater than 0' });
//             }
//         }

//         // Generate MGRN number
//         const mgrnNumber = await generateMGRNNumber();

//         // Create MGRN header (stk_main)
//         const mgrn = await Stk_main.create({
//             Stock_Type_ID: MGRN_STOCK_TYPE_ID,
//             Number: mgrnNumber,
//             COA_ID: coa_id,
//             Date: mgrn_date || new Date(),
//             Status: 'UnPost',
//             Purchase_Type: 'local manufacturing',
//             Status_Account_Entry: 0,
//             is_Voucher_Generated: 0,
//             approved: 0,
//             Carriage_ID: null,
//             Carriage_Amount: 0,
//             Order_Main_ID: null,
//             Transporter_ID: null,
//             freight_crt: 0,
//             labour_crt: 0,
//             bility_expense: 0,
//             other_expense: 0,
//             booked_crt: 0,
//             remarks: remarks || null
//         }, { transaction });

//         console.log(`✅ Created MGRN: ${mgrnNumber} (ID: ${mgrn.ID})`);

//         // Create stk_detail for each GIN
//         const stkDetailRecords = [];

//         for (let i = 0; i < details.length; i++) {
//             const d = details[i];

//             const gin = await ZGinMain.findByPk(d.gin_id, {
//                 include: [{ model: ZItems, as: 'item' }],
//                 transaction
//             });

//             if (!gin) {
//                 await transaction.rollback();
//                 return res.status(400).json({ success: false, message: `GIN with ID ${d.gin_id} not found` });
//             }

//             const item = gin.item;
//             const uom2Qty = parseFloat(item?.uom2_qty) || 1;
//             const uom3Qty = parseFloat(item?.uom3_qty) || 1;

//             const qtyUom2 = parseFloat(d.qty_received) || 0;
//             const qtyUom1 = qtyUom2 * uom2Qty;
//             const qtyUom3 = uom3Qty > 0 ? qtyUom1 / uom3Qty : 0;

//             stkDetailRecords.push({
//                 STK_Main_ID: mgrn.ID,
//                 Line_Id: i + 1,
//                 Item_ID: gin.item_id,
//                 batchno: batchno,
//                 gin_id: d.gin_id,
//                 Stock_In_UOM: item?.skuUOM || null,
//                 Stock_In_UOM_Qty: qtyUom1,
//                 Stock_In_SKU_UOM: item?.uom2 || null,
//                 Stock_In_SKU_UOM_Qty: qtyUom2,
//                 Stock_In_UOM3_Qty: qtyUom3,
//                 Stock_out_UOM: null,
//                 Stock_out_UOM_Qty: 0,
//                 Stock_out_SKU_UOM: null,
//                 Stock_out_SKU_UOM_Qty: 0,
//                 Stock_out_UOM3_Qty: 0,
//                 uom1_qty: qtyUom1,
//                 uom2_qty: qtyUom2,
//                 uom3_qty: qtyUom3,
//                 sale_Uom: item?.uom2 || 0,
//                 Sale_Unit: '2',
//                 Stock_Price: 0,
//                 Stock_SKU_Price: 0,
//                 Discount_A: 0,
//                 Discount_B: 0,
//                 Discount_C: 0
//             });
//         }

//         await Stk_Detail.bulkCreate(stkDetailRecords, { transaction });
//         console.log(`✅ Created ${stkDetailRecords.length} stk_detail records`);

//         await transaction.commit();
//         isCommitted = true;

//         // Fetch complete MGRN
//         const completeMgrn = await Stk_main.findByPk(mgrn.ID, {
//             include: [
//                 { model: ZCoa, as: 'account', attributes: ['id', 'acName'] },
//                 {
//                     model: Stk_Detail,
//                     as: 'details',
//                     include: [
//                         { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
//                         { model: ZGinMain, as: 'ginMain', attributes: ['id', 'gin_number'] }
//                     ]
//                 }
//             ]
//         });

//         res.status(201).json({
//             success: true,
//             message: `MGRN ${mgrnNumber} created successfully`,
//             data: completeMgrn
//         });

//     } catch (error) {
//         if (!isCommitted) {
//             await transaction.rollback();
//         }
//         console.error('❌ Error creating MGRN:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // =============================================
// // UPDATE MGRN
// // =============================================
// const update = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     let isCommitted = false;

//     try {
//         const { id } = req.params;
//         const {
//             coa_id,
//             batchno,
//             mgrn_date,
//             remarks,
//             details = []
//         } = req.body;

//         const mgrn = await Stk_main.findOne({
//             where: { ID: id, Stock_Type_ID: MGRN_STOCK_TYPE_ID },
//             transaction
//         });

//         if (!mgrn) {
//             await transaction.rollback();
//             return res.status(404).json({ success: false, message: 'MGRN not found' });
//         }

//         // Update MGRN header
//         await mgrn.update({
//             COA_ID: coa_id || mgrn.COA_ID,
//             Date: mgrn_date || mgrn.Date,
//             remarks: remarks !== undefined ? remarks : mgrn.remarks
//         }, { transaction });

//         console.log(`✅ Updated MGRN: ${mgrn.Number}`);

//         // Delete old details
//         await Stk_Detail.destroy({ where: { STK_Main_ID: id }, transaction });

//         // Create new details
//         if (details.length > 0) {
//             const stkDetailRecords = [];

//             for (let i = 0; i < details.length; i++) {
//                 const d = details[i];

//                 const gin = await ZGinMain.findByPk(d.gin_id, {
//                     include: [{ model: ZItems, as: 'item' }],
//                     transaction
//                 });

//                 if (!gin) {
//                     await transaction.rollback();
//                     return res.status(400).json({ success: false, message: `GIN with ID ${d.gin_id} not found` });
//                 }

//                 const item = gin.item;
//                 const uom2Qty = parseFloat(item?.uom2_qty) || 1;
//                 const uom3Qty = parseFloat(item?.uom3_qty) || 1;

//                 const qtyUom2 = parseFloat(d.qty_received) || 0;
//                 const qtyUom1 = qtyUom2 * uom2Qty;
//                 const qtyUom3 = uom3Qty > 0 ? qtyUom1 / uom3Qty : 0;

//                 stkDetailRecords.push({
//                     STK_Main_ID: parseInt(id),
//                     Line_Id: i + 1,
//                     Item_ID: gin.item_id,
//                     batchno: batchno,
//                     gin_id: d.gin_id,
//                     Stock_In_UOM: item?.skuUOM || null,
//                     Stock_In_UOM_Qty: qtyUom1,
//                     Stock_In_SKU_UOM: item?.uom2 || null,
//                     Stock_In_SKU_UOM_Qty: qtyUom2,
//                     Stock_In_UOM3_Qty: qtyUom3,
//                     Stock_out_UOM: null,
//                     Stock_out_UOM_Qty: 0,
//                     Stock_out_SKU_UOM: null,
//                     Stock_out_SKU_UOM_Qty: 0,
//                     Stock_out_UOM3_Qty: 0,
//                     uom1_qty: qtyUom1,
//                     uom2_qty: qtyUom2,
//                     uom3_qty: qtyUom3,
//                     sale_Uom: item?.uom2 || 0,
//                     Sale_Unit: '2',
//                     Stock_Price: 0,
//                     Stock_SKU_Price: 0,
//                     Discount_A: 0,
//                     Discount_B: 0,
//                     Discount_C: 0
//                 });
//             }

//             await Stk_Detail.bulkCreate(stkDetailRecords, { transaction });
//             console.log(`✅ Created ${stkDetailRecords.length} new stk_detail records`);
//         }

//         await transaction.commit();
//         isCommitted = true;

//         // Fetch updated MGRN
//         const updatedMgrn = await Stk_main.findByPk(id, {
//             include: [
//                 { model: ZCoa, as: 'coa', attributes: ['id', 'acName'] },
//                 {
//                     model: Stk_Detail,
//                     as: 'details',
//                     include: [
//                         { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
//                         { model: ZGinMain, as: 'gin', attributes: ['id', 'gin_number'] }
//                     ]
//                 }
//             ]
//         });

//         res.json({
//             success: true,
//             message: 'MGRN updated successfully',
//             data: updatedMgrn
//         });

//     } catch (error) {
//         if (!isCommitted) {
//             await transaction.rollback();
//         }
//         console.error('❌ Error updating MGRN:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // =============================================
// // DELETE MGRN
// // =============================================
// const remove = async (req, res) => {
//     const transaction = await sequelize.transaction();
//     let isCommitted = false;

//     try {
//         const { id } = req.params;

//         const mgrn = await Stk_main.findOne({
//             where: { ID: id, Stock_Type_ID: MGRN_STOCK_TYPE_ID },
//             transaction
//         });

//         if (!mgrn) {
//             await transaction.rollback();
//             return res.status(404).json({ success: false, message: 'MGRN not found' });
//         }

//         // Delete details
//         await Stk_Detail.destroy({ where: { STK_Main_ID: id }, transaction });

//         // Delete header
//         await mgrn.destroy({ transaction });

//         await transaction.commit();
//         isCommitted = true;

//         console.log(`✅ Deleted MGRN: ${mgrn.Number}`);

//         res.json({ success: true, message: 'MGRN deleted successfully' });

//     } catch (error) {
//         if (!isCommitted) {
//             await transaction.rollback();
//         }
//         console.error('❌ Error deleting MGRN:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // =============================================
// // EXPORTS
// // =============================================
// module.exports = {
//     getAll,
//     getById,
//     getNextMGRNNumber,
//     getGinsForMgrn,
//     create,
//     update,
//     remove
// };










































































// controllers/ZMgrn.controller.js

const Stk_main = require('../models/stockMain.model');
const Stk_Detail = require('../models/stockDetail.model');
const ZGinMain = require('../models/ZGinMain.model');
const ZItems = require('../models/zItems.model');
const ZCoa = require('../models/ZCoa.model');
const Uom = require('../models/zUom.model');
const sequelize = require('../../config/database');

// =============================================
// CONSTANTS
// =============================================
const MGRN_STOCK_TYPE_ID = 15;

// =============================================
// GENERATE MGRN NUMBER
// =============================================
const generateMGRNNumber = async () => {
  const lastMGRN = await Stk_main.findOne({
    where: { Stock_Type_ID: MGRN_STOCK_TYPE_ID },
    order: [['ID', 'DESC']],
    attributes: ['Number']
  });

  if (!lastMGRN || !lastMGRN.Number) {
    return 'MGRN-1';
  }

  const match = lastMGRN.Number.match(/MGRN-(\d+)/);
  const lastNumber = match ? parseInt(match[1]) : 0;
  return `MGRN-${lastNumber + 1}`;
};

// =============================================
// GET ALL MGRN
// =============================================
const getAll = async (req, res) => {
  try {
    const mgrns = await Stk_main.findAll({
      where: { Stock_Type_ID: MGRN_STOCK_TYPE_ID },
      include: [
        { model: ZCoa, as: 'account', attributes: ['id', 'acName'] },
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
            { model: ZGinMain, as: 'ginMain', attributes: ['id', 'gin_number', 'item_id', 'qty_planned'] },
            { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName'] }
          ]
        }
      ],
      order: [['ID', 'DESC']]
    });

    res.json({ success: true, data: mgrns });
  } catch (error) {
    console.error('❌ Error fetching MGRNs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET MGRN BY ID
// =============================================
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const mgrn = await Stk_main.findOne({
      where: { 
        ID: id,
        Stock_Type_ID: MGRN_STOCK_TYPE_ID 
      },
      include: [
        { model: ZCoa, as: 'account', attributes: ['id', 'acName'] },
        {
          model: Stk_Detail,
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
            {
              model: ZGinMain,
              as: 'ginMain',
              attributes: ['id', 'gin_number', 'item_id', 'qty_planned', 'status'],
              include: [
                { model: ZItems, as: 'item', attributes: ['id', 'itemName'] }
              ]
            },
            { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName'] }
          ]
        }
      ]
    });

    if (!mgrn) {
      return res.status(404).json({ success: false, message: 'MGRN not found' });
    }

    res.json({ success: true, data: mgrn });
  } catch (error) {
    console.error('❌ Error fetching MGRN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET NEXT MGRN NUMBER
// =============================================
const getNextMGRNNumber = async (req, res) => {
  try {
    const mgrnNumber = await generateMGRNNumber();
    res.json({ success: true, data: mgrnNumber });
  } catch (error) {
    console.error('❌ Error generating MGRN number:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET GINS AVAILABLE FOR MGRN (Only Open Status)
// =============================================
const getGinsForMgrn = async (req, res) => {
  try {
    const gins = await ZGinMain.findAll({
      where: { status: 'open' },
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
        { model: Uom, as: 'uom', attributes: ['id', 'uom'] }
      ],
      order: [['id', 'DESC']]
    });

    res.json({ success: true, data: gins });
  } catch (error) {
    console.error('❌ Error fetching GINs for MGRN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// CREATE MGRN
// =============================================
const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  let isCommitted = false;

  try {
    const {
      coa_id,
      batchno,  // ✅ ONE batch for ALL items
      mgrn_date,
      remarks,
      details = []
    } = req.body;

    // Validate
    if (!coa_id) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Account is required' });
    }

    if (!batchno) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Batch is required' });
    }

    if (!details || details.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'At least one GIN must be selected' });
    }

    // Validate each detail
    for (const detail of details) {
      if (!detail.gin_id) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: 'GIN is required for each line' });
      }
      if (!detail.qty_received || detail.qty_received <= 0) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: 'Quantity received must be greater than 0' });
      }
    }

    // Generate MGRN number
    const mgrnNumber = await generateMGRNNumber();

    // Create MGRN header (stk_main)
    const mgrn = await Stk_main.create({
      Stock_Type_ID: MGRN_STOCK_TYPE_ID,
      Number: mgrnNumber,
      COA_ID: coa_id,
      Date: mgrn_date || new Date(),
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
      remarks: remarks || null
    }, { transaction });

    console.log(`✅ Created MGRN: ${mgrnNumber} (ID: ${mgrn.ID})`);

    // Create stk_detail for each GIN
    const stkDetailRecords = [];

    for (let i = 0; i < details.length; i++) {
      const d = details[i];
      
      const gin = await ZGinMain.findByPk(d.gin_id, {
        include: [{ model: ZItems, as: 'item' }],
        transaction
      });

      if (!gin) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: `GIN with ID ${d.gin_id} not found` });
      }

      const item = gin.item;
      const uom2Qty = parseFloat(item?.uom2_qty) || 1;
      const uom3Qty = parseFloat(item?.uom3_qty) || 1;

      const qtyUom2 = parseFloat(d.qty_received) || 0;
      const qtyUom1 = qtyUom2 * uom2Qty;
      const qtyUom3 = uom3Qty > 0 ? qtyUom1 / uom3Qty : 0;

      stkDetailRecords.push({
        STK_Main_ID: mgrn.ID,
        Line_Id: i + 1,
        Item_ID: gin.item_id,
        batchno: batchno,  // ✅ SAME batch for ALL items
        gin_id: d.gin_id,
        Stock_In_UOM: item?.skuUOM || null,
        Stock_In_UOM_Qty: qtyUom1,
        Stock_In_SKU_UOM: item?.uom2 || null,
        Stock_In_SKU_UOM_Qty: qtyUom2,
        Stock_In_UOM3_Qty: qtyUom3,
        Stock_out_UOM: null,
        Stock_out_UOM_Qty: 0,
        Stock_out_SKU_UOM: null,
        Stock_out_SKU_UOM_Qty: 0,
        Stock_out_UOM3_Qty: 0,
        uom1_qty: qtyUom1,
        uom2_qty: qtyUom2,
        uom3_qty: qtyUom3,
        sale_Uom: item?.uom2 || 0,
        Sale_Unit: '2',
        Stock_Price: 0,
        Stock_SKU_Price: 0,
        Discount_A: 0,
        Discount_B: 0,
        Discount_C: 0
      });
    }

    await Stk_Detail.bulkCreate(stkDetailRecords, { transaction });
    console.log(`✅ Created ${stkDetailRecords.length} stk_detail records with batch ${batchno}`);

    await transaction.commit();
    isCommitted = true;

    // Fetch complete MGRN
    const completeMgrn = await Stk_main.findByPk(mgrn.ID, {
      include: [
        { model: ZCoa, as: 'account', attributes: ['id', 'acName'] },
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
            { model: ZGinMain, as: 'ginMain', attributes: ['id', 'gin_number'] },
            { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName'] }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: `MGRN ${mgrnNumber} created successfully`,
      data: completeMgrn
    });

  } catch (error) {
    if (!isCommitted) {
      await transaction.rollback();
    }
    console.error('❌ Error creating MGRN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// UPDATE MGRN
// =============================================
const update = async (req, res) => {
  const transaction = await sequelize.transaction();
  let isCommitted = false;

  try {
    const { id } = req.params;
    const {
      coa_id,
      batchno,  // ✅ ONE batch for ALL items
      mgrn_date,
      remarks,
      details = []
    } = req.body;

    const mgrn = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: MGRN_STOCK_TYPE_ID },
      transaction
    });

    if (!mgrn) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'MGRN not found' });
    }

    // Update MGRN header
    await mgrn.update({
      COA_ID: coa_id || mgrn.COA_ID,
      Date: mgrn_date || mgrn.Date,
      remarks: remarks !== undefined ? remarks : mgrn.remarks
    }, { transaction });

    console.log(`✅ Updated MGRN: ${mgrn.Number}`);

    // Delete old details
    await Stk_Detail.destroy({ where: { STK_Main_ID: id }, transaction });

    // Create new details
    if (details.length > 0) {
      const stkDetailRecords = [];

      for (let i = 0; i < details.length; i++) {
        const d = details[i];
        
        const gin = await ZGinMain.findByPk(d.gin_id, {
          include: [{ model: ZItems, as: 'item' }],
          transaction
        });

        if (!gin) {
          await transaction.rollback();
          return res.status(400).json({ success: false, message: `GIN with ID ${d.gin_id} not found` });
        }

        const item = gin.item;
        const uom2Qty = parseFloat(item?.uom2_qty) || 1;
        const uom3Qty = parseFloat(item?.uom3_qty) || 1;

        const qtyUom2 = parseFloat(d.qty_received) || 0;
        const qtyUom1 = qtyUom2 * uom2Qty;
        const qtyUom3 = uom3Qty > 0 ? qtyUom1 / uom3Qty : 0;

        stkDetailRecords.push({
          STK_Main_ID: parseInt(id),
          Line_Id: i + 1,
          Item_ID: gin.item_id,
          batchno: batchno,  // ✅ SAME batch for ALL items
          gin_id: d.gin_id,
          Stock_In_UOM: item?.skuUOM || null,
          Stock_In_UOM_Qty: qtyUom1,
          Stock_In_SKU_UOM: item?.uom2 || null,
          Stock_In_SKU_UOM_Qty: qtyUom2,
          Stock_In_UOM3_Qty: qtyUom3,
          Stock_out_UOM: null,
          Stock_out_UOM_Qty: 0,
          Stock_out_SKU_UOM: null,
          Stock_out_SKU_UOM_Qty: 0,
          Stock_out_UOM3_Qty: 0,
          uom1_qty: qtyUom1,
          uom2_qty: qtyUom2,
          uom3_qty: qtyUom3,
          sale_Uom: item?.uom2 || 0,
          Sale_Unit: '2',
          Stock_Price: 0,
          Stock_SKU_Price: 0,
          Discount_A: 0,
          Discount_B: 0,
          Discount_C: 0
        });
      }

      await Stk_Detail.bulkCreate(stkDetailRecords, { transaction });
      console.log(`✅ Created ${stkDetailRecords.length} new stk_detail records with batch ${batchno}`);
    }

    await transaction.commit();
    isCommitted = true;

    // Fetch updated MGRN
    const updatedMgrn = await Stk_main.findByPk(id, {
      include: [
        { model: ZCoa, as: 'account', attributes: ['id', 'acName'] },
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
            { model: ZGinMain, as: 'ginMain', attributes: ['id', 'gin_number'] },
            { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName'] }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'MGRN updated successfully',
      data: updatedMgrn
    });

  } catch (error) {
    if (!isCommitted) {
      await transaction.rollback();
    }
    console.error('❌ Error updating MGRN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// DELETE MGRN
// =============================================
const remove = async (req, res) => {
  const transaction = await sequelize.transaction();
  let isCommitted = false;

  try {
    const { id } = req.params;

    const mgrn = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: MGRN_STOCK_TYPE_ID },
      transaction
    });

    if (!mgrn) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'MGRN not found' });
    }

    // Delete details
    await Stk_Detail.destroy({ where: { STK_Main_ID: id }, transaction });

    // Delete header
    await mgrn.destroy({ transaction });

    await transaction.commit();
    isCommitted = true;

    console.log(`✅ Deleted MGRN: ${mgrn.Number}`);

    res.json({ success: true, message: 'MGRN deleted successfully' });

  } catch (error) {
    if (!isCommitted) {
      await transaction.rollback();
    }
    console.error('❌ Error deleting MGRN:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// EXPORTS
// =============================================
module.exports = {
  getAll,
  getById,
  getNextMGRNNumber,
  getGinsForMgrn,
  create,
  update,
  remove
};
