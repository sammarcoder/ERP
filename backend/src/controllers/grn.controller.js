
// // routes/grn.js - COMPLETE CRUD
// const express = require('express');
// const router = express.Router();
// const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Order_Detail, Uom } = require('../models');
// const { Op } = require('sequelize');
// const sequelize = require('../../config/database');

// // Generate GRN Number
// // const generateGRNNumber = async () => {
// //   const today = new Date();
// //   const year = today.getFullYear();
// //   const month = String(today.getMonth() + 1).padStart(2, '0');

// //   const lastGRN = await Stk_main.findOne({
// //     where: {
// //       Stock_Type_ID: 11,
// //       Number: { [Op.like]: `GRN-${year}${month}%` }
// //     },
// //     order: [['Number', 'DESC']]
// //   });

// //   let sequence = 1;
// //   if (lastGRN) {
// //     const lastSequence = parseInt(lastGRN.Number.split('-')[2]);
// //     sequence = lastSequence + 1;
// //   }

// //   return `GRN-${year}${month}-${String(sequence).padStart(4, '0')}`;
// // };


// const generateGRNNumber = async () => {
//   const lastGRN = await Stk_main.findOne({
//     where: { Stock_Type_ID: 11 },
//     order: [['ID', 'DESC']]
//   });

//   const nextNumber = lastGRN ? lastGRN.ID + 1 : 1;
//   return `GRN-${String(nextNumber).padStart(6, '0')}`;
// };




// // GET all GRNs
// router.get('/', async (req, res) => {
//   try {
//     // console.log('🧩 Stk_main attributes:', Object.keys(Stk_main.rawAttributes));
//     const grns = await Stk_main.findAll({
//       where: { Stock_Type_ID: 11 },
//       // logging: console.log,
//       include: [
//         {
//           model: Stk_Detail,
//           as: 'details',
//           include: [{
//             model: ZItems, as: 'item', attributes: ['id', 'itemName', 'skuUOM', 'uom1_qyt', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
//             include: [
//               { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//               { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//               { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//             ]
//           },
//           { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName', "setupName", 'city', 'mobileNo'] }
//           ]
//         },
//         { model: ZCoa, as: 'account', attributes: ['id', 'acName', "setupName", 'city', 'mobileNo'] },
//         { model: Order_Main, as: 'order', attributes: ['id', 'Number', 'Date', 'Next_Status', 'approved', 'is_Note_generated'] },

//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     res.json({ success: true, data: grns });
//   } catch (error) {
//     console.error('Error fetching GRNs:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // GET single GRN
// router.get('/:id', async (req, res) => {
//   try {
//     const grn = await Stk_main.findOne({
//       where: { ID: req.params.id, Stock_Type_ID: 11 },
//       include: [
//         {
//           model: Stk_Detail,
//           as: 'details',

//           include: [
//             { model: ZItems, as: 'item', attributes: ['id', 'itemName', 'skuUOM', 'uom1_qyt', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'] },
//             { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName', "setupName", 'city', 'mobileNo'] }
//           ]
//         },
//         { model: ZCoa, as: 'account', attributes: ['id', 'acName', "setupName", 'city', 'mobileNo'] },
//         { model: Order_Main, as: 'order', attributes: ['id', 'Number', 'Date', 'Next_Status', 'approved', 'is_Note_generated'] },

//       ]
//     });

//     if (!grn) {
//       return res.status(404).json({ success: false, error: 'GRN not found' });
//     }

//     res.json({ success: true, data: grn });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// router.post('/', async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { stockMain, stockDetails } = req.body;

//     console.log('═══════════════════════════════════════════════════════════════');
//     console.log('📥 GRN API - INCOMING REQUEST');
//     console.log('═══════════════════════════════════════════════════════════════');
//     console.log('📋 stockMain:', JSON.stringify(stockMain, null, 2));
//     console.log('📦 stockDetails:', JSON.stringify(stockDetails, null, 2));

//     // =====================================================
//     // 1️⃣ VALIDATION
//     // =====================================================
//     if (!stockMain?.COA_ID) {
//       throw new Error('COA_ID is required');
//     }

//     if (!stockDetails || stockDetails.length === 0) {
//       throw new Error('At least one item is required');
//     }

//     // =====================================================
//     // 2️⃣ CHECK ORDER EXISTS & NOT ALREADY PROCESSED
//     // =====================================================
//     let orderData = null;
//     let orderDetails = [];

//     if (stockMain.Order_Main_ID) {
//       orderData = await Order_Main.findByPk(stockMain.Order_Main_ID, {
//         include: [{
//           model: Order_Detail,
//           as: 'details'  // Make sure this alias matches your model association
//         }]
//       });

//       if (!orderData) {
//         throw new Error(`Order ID ${stockMain.Order_Main_ID} not found`);
//       }

//       if (orderData.is_Note_generated === true || orderData.is_Note_generated === 1) {
//         throw new Error(`GRN already exists for Order ${orderData.Number}`);
//       }

//       orderDetails = orderData.details || [];
//       console.log('✅ Order validation passed:', orderData.Number);
//       console.log('📋 Order has', orderDetails.length, 'items');
//     }

//     // =====================================================
//     // 3️⃣ CHECK DUPLICATE GRN
//     // =====================================================
//     if (stockMain.Order_Main_ID) {
//       const existingGRN = await Stk_main.findOne({
//         where: {
//           Order_Main_ID: stockMain.Order_Main_ID,
//           Stock_Type_ID: 11
//         }
//       });

//       if (existingGRN) {
//         throw new Error(`GRN ${existingGRN.Number} already exists for this order`);
//       }
//       console.log('✅ No duplicate GRN found');
//     }

//     // =====================================================
//     // 4️⃣ VALIDATE BATCHNO (Must be integer)
//     // =====================================================
//     for (let i = 0; i < stockDetails.length; i++) {
//       if (stockDetails[i].batchno !== null && stockDetails[i].batchno !== undefined) {
//         const batchInt = parseInt(stockDetails[i].batchno, 10);
//         if (isNaN(batchInt)) {
//           throw new Error(`Invalid batchno for item ${i + 1}`);
//         }
//         stockDetails[i].batchno = batchInt;
//       }
//     }

//     // =====================================================
//     // 5️⃣ GENERATE GRN NUMBER
//     // =====================================================
//     const grnNumber = await generateGRNNumber();
//     console.log('📝 Generated GRN Number:', grnNumber);

//     // =====================================================
//     // 6️⃣ CREATE Stk_main (Header)
//     // =====================================================
//     const grn = await Stk_main.create({
//       ...stockMain,
//       Number: grnNumber,
//       Stock_Type_ID: 11
//     }, { transaction });

//     console.log('✅ GRN Header Created:', grn.ID);

//     // =====================================================
//     // 7️⃣ CREATE Stk_Detail (Items)
//     // =====================================================
//     const grnDetails = stockDetails.map((detail, index) => ({
//       ...detail,
//       STK_Main_ID: grn.ID,
//       Line_Id: index + 1,
//       batchno: parseInt(detail.batchno, 10) || null
//     }));

//     await Stk_Detail.bulkCreate(grnDetails, { transaction });
//     console.log('✅ GRN Details Created:', grnDetails.length, 'items');

//     // =====================================================
//     // 8️⃣ CALCULATE ORDER STATUS
//     // =====================================================
//     let newOrderStatus = 'Partial';  // Default to Partial

//     if (stockMain.Order_Main_ID && orderDetails.length > 0) {
//       console.log('═══════════════════════════════════════════════════════════════');
//       console.log('📊 COMPARING ORDER vs GRN');
//       console.log('═══════════════════════════════════════════════════════════════');

//       // Check if ALL order items are in GRN with SAME or MORE quantity
//       let allItemsComplete = true;
//       let comparisonLog = [];

//       for (const orderItem of orderDetails) {
//         const orderItemId = orderItem.Item_ID || orderItem.item_id;
//         const orderQty = parseFloat(orderItem.uom1_qty) || 0;

//         // Find matching GRN item
//         const grnItem = stockDetails.find(g => g.Item_ID === orderItemId);

//         if (!grnItem) {
//           // Order item NOT in GRN
//           allItemsComplete = false;
//           comparisonLog.push({
//             Item_ID: orderItemId,
//             orderQty: orderQty,
//             grnQty: 0,
//             status: '❌ MISSING'
//           });
//         } else {
//           const grnQty = parseFloat(grnItem.uom1_qty) || 0;

//           if (grnQty >= orderQty) {
//             // Fully received
//             comparisonLog.push({
//               Item_ID: orderItemId,
//               orderQty: orderQty,
//               grnQty: grnQty,
//               status: '✅ COMPLETE'
//             });
//           } else {
//             // Partial receive
//             allItemsComplete = false;
//             comparisonLog.push({
//               Item_ID: orderItemId,
//               orderQty: orderQty,
//               grnQty: grnQty,
//               status: '⚠️ PARTIAL'
//             });
//           }
//         }
//       }

//       // Log comparison
//       console.log('📋 Item Comparison:');
//       comparisonLog.forEach(log => {
//         console.log(`  - Item ${log.Item_ID}: Order=${log.orderQty}, GRN=${log.grnQty} → ${log.status}`);
//       });

//       // Set status based on comparison
//       if (allItemsComplete) {
//         newOrderStatus = 'Complete';
//         console.log('✅ All items fully received → Status: Complete');
//       } else {
//         newOrderStatus = 'Partial';
//         console.log('⚠️ Some items missing or partial → Status: Partial');
//       }

//       console.log('═══════════════════════════════════════════════════════════════');
//     }

//     // =====================================================
//     // 9️⃣ UPDATE ORDER STATUS
//     // =====================================================
//     if (stockMain.Order_Main_ID) {
//       await Order_Main.update(
//         {
//           is_Note_generated: true,  // or 1 if your column is TINYINT
//           Next_Status: newOrderStatus
//         },
//         {
//           where: { ID: stockMain.Order_Main_ID },
//           transaction
//         }
//       );
//       console.log(`✅ Order Updated: is_Note_generated=true, Next_Status=${newOrderStatus}`);
//     }

//     // =====================================================
//     // 🔟 COMMIT TRANSACTION
//     // =====================================================
//     await transaction.commit();
//     console.log('✅ Transaction Committed Successfully');
//     console.log('═══════════════════════════════════════════════════════════════');

//     res.status(201).json({
//       success: true,
//       message: 'GRN created successfully',
//       data: {
//         ...grn.toJSON(),
//         details: grnDetails,
//         grnNumber,
//         orderStatus: newOrderStatus,
//         batchApplied: grnDetails[0]?.batchno
//       }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.log('═══════════════════════════════════════════════════════════════');
//     console.log('❌ GRN API ERROR:', error.message);
//     console.log('═══════════════════════════════════════════════════════════════');
//     res.status(500).json({ success: false, error: error.message });
//   }
// });




















// router.put('/:id', async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     const { stockMain, stockDetails } = req.body;

//     await Stk_main.update(stockMain, {
//       where: { ID: id, Stock_Type_ID: 11 },
//       transaction
//     });

//     // Delete and recreate details
//     await Stk_Detail.destroy({
//       where: { STK_Main_ID: id },
//       transaction
//     });

//     const updatedDetails = stockDetails.map((detail, index) => ({
//       ...detail,
//       STK_Main_ID: id,
//       Line_Id: index + 1,
//       batchno: stockMain.batchno
//     }));

//     await Stk_Detail.bulkCreate(updatedDetails, { transaction });

//     await transaction.commit();

//     res.json({
//       success: true,
//       message: 'GRN updated successfully'
//     });
//   } catch (error) {
//     await transaction.rollback();
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // DELETE GRN
// router.delete('/:id', async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;

//     await Stk_Detail.destroy({
//       where: { STK_Main_ID: id },
//       transaction
//     });

//     const deleted = await Stk_main.destroy({
//       where: { ID: id, Stock_Type_ID: 11 },
//       transaction
//     });

//     if (!deleted) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         error: 'GRN not found'
//       });
//     }

//     await transaction.commit();

//     res.json({
//       success: true,
//       message: 'GRN deleted successfully'
//     });
//   } catch (error) {
//     await transaction.rollback();
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;
















































































// routes/grn.js - COMPLETE CRUD WITH ALL FEATURES

const express = require('express');
const router = express.Router();
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Order_Detail, Uom } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');

// =====================================================
// HELPER: Generate GRN Number
// =====================================================
// const generateGRNNumber = async () => {
//   const lastGRN = await Stk_main.findOne({
//     where: { Stock_Type_ID: 11 },
//     order: [['ID', 'DESC']]
//   });

//   const nextNumber = lastGRN ? lastGRN.ID + 1 : 1;
//   return `GRN-${String(nextNumber).padStart(1, '0')}`;
// };





const generateGRNNumber = async () => {
  const lastGRN = await Stk_main.findOne({
    where: { Stock_Type_ID: 11 },
    order: [['ID', 'DESC']]
  });

  if (!lastGRN) {
    return `GRN-1`;
  }

  const numberStr = lastGRN.Number || '';
  const match = numberStr.match(/(\d+)$/);
  let nextSeq;

  if (match) {
    nextSeq = parseInt(match[1], 10) + 1;
  } else if (typeof lastGRN.ID === 'number') {
    nextSeq = lastGRN.ID + 1;
  } else {
    nextSeq = 1;
  }

  return `GRN-${nextSeq}`;
};

// =====================================================
// HELPER: Calculate Order Status (Complete/Partial)
// =====================================================
const calculateOrderStatus = async (orderId, grnDetails) => {
  const orderDetails = await Order_Detail.findAll({
    where: { Order_Main_ID: orderId }
  });

  if (orderDetails.length === 0) {
    return 'Partial';
  }

  console.log('📊 Comparing Order vs GRN:');
  let allItemsComplete = true;

  for (const orderItem of orderDetails) {
    const orderItemId = orderItem.Item_ID || orderItem.item_id;
    const orderQty = parseFloat(orderItem.uom1_qty) || 0;

    const grnItem = grnDetails.find(g => g.Item_ID === orderItemId);

    if (!grnItem) {
      allItemsComplete = false;
      console.log(`  ❌ Item ${orderItemId}: NOT in GRN (Order: ${orderQty})`);
    } else {
      const grnQty = parseFloat(grnItem.uom1_qty) || 0;
      
      if (grnQty >= orderQty) {
        console.log(`  ✅ Item ${orderItemId}: Complete (Order: ${orderQty}, GRN: ${grnQty})`);
      } else {
        allItemsComplete = false;
        console.log(`  ⚠️ Item ${orderItemId}: Partial (Order: ${orderQty}, GRN: ${grnQty})`);
      }
    }
  }

  return allItemsComplete ? 'Complete' : 'Partial';
};

// =====================================================
// GET ALL GRNs
// =====================================================
router.get('/', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, supplierId, page = 1, limit = 50 } = req.query;

    const where = { Stock_Type_ID: 11 };

    // Filter by status
    if (status && status !== 'all') {
      where.Status = status;
    }

    // Filter by date range
    if (dateFrom && dateTo) {
      where.Date = {
        [Op.between]: [dateFrom, dateTo]
      };
    } else if (dateFrom) {
      where.Date = {
        [Op.gte]: dateFrom
      };
    } else if (dateTo) {
      where.Date = {
        [Op.lte]: dateTo
      };
    }

    // Filter by supplier
    if (supplierId) {
      where.COA_ID = supplierId;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: grns } = await Stk_main.findAndCountAll({
      where,
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName', 'skuUOM', 'uom1_qyt', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
              include: [
                { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
              ]
            },
            {
              model: ZCoa,
              as: 'batchDetails',
              attributes: ['id', 'acName', 'setupName', 'city', 'mobileNo']
            }
          ]
        },
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', 'setupName', 'city', 'mobileNo']
        },
        {
          model: Order_Main,
          as: 'order',
          attributes: ['id', 'Number', 'Date', 'Next_Status', 'approved', 'is_Note_generated']
        }
      ],
      order: [['createdAt', 'DESC']],
      // limit: parseInt(limit),
      // offset
    });

    res.json({
      success: true,
      data: grns,
      // pagination: {
      //   total: count,
      //   page: parseInt(page),
      //   limit: parseInt(limit),
      //   totalPages: Math.ceil(count / parseInt(limit))
      // }
    });
  } catch (error) {
    console.error('❌ Error fetching GRNs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// GET SINGLE GRN BY ID
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    const grn = await Stk_main.findOne({
      where: { ID: req.params.id, Stock_Type_ID: 11 },
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName', 'skuUOM', 'uom1_qyt', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty'],
              include: [
                { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
              ]
            },
            {
              model: ZCoa,
              as: 'batchDetails',
              attributes: ['id', 'acName', 'setupName', 'city', 'mobileNo']
            }
          ]
        },
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', 'setupName', 'city', 'mobileNo']
        },
        {
          model: Order_Main,
          as: 'order',
          attributes: ['id', 'Number', 'Date', 'Next_Status', 'approved', 'is_Note_generated']
        }
      ]
    });

    if (!grn) {
      return res.status(404).json({ success: false, error: 'GRN not found' });
    }

    res.json({ success: true, data: grn });
  } catch (error) {
    console.error('❌ Error fetching GRN:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// CREATE GRN
// =====================================================
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { stockMain, stockDetails } = req.body;

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📥 GRN CREATE REQUEST');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 stockMain:', JSON.stringify(stockMain, null, 2));
    console.log('📦 stockDetails:', JSON.stringify(stockDetails, null, 2));

    // =====================================================
    // 1️⃣ VALIDATION
    // =====================================================
    if (!stockMain?.COA_ID) {
      throw new Error('COA_ID is required');
    }

    if (!stockDetails || stockDetails.length === 0) {
      throw new Error('At least one item is required');
    }

    // =====================================================
    // 2️⃣ CHECK ORDER - EXISTS, APPROVED, NOT ALREADY PROCESSED
    // =====================================================
    let orderData = null;
    let orderDetails = [];

    if (stockMain.Order_Main_ID) {
      orderData = await Order_Main.findByPk(stockMain.Order_Main_ID, {
        include: [{
          model: Order_Detail,
          as: 'details'
        }]
      });

      if (!orderData) {
        throw new Error(`Order ID ${stockMain.Order_Main_ID} not found`);
      }

      // ✅ CHECK: Order must be approved
      if (orderData.approved !== true && orderData.approved !== 1) {
        throw new Error(`Order ${orderData.Number} is not approved. Please approve the order first.`);
      }

      // ✅ CHECK: GRN not already generated
      if (orderData.is_Note_generated === true || orderData.is_Note_generated === 1) {
        throw new Error(`GRN already exists for Order ${orderData.Number}`);
      }

      orderDetails = orderData.details || [];
      console.log('✅ Order validation passed:', orderData.Number);
      console.log('📋 Order has', orderDetails.length, 'items');
    }

    // =====================================================
    // 3️⃣ CHECK DUPLICATE GRN
    // =====================================================
    if (stockMain.Order_Main_ID) {
      const existingGRN = await Stk_main.findOne({
        where: {
          Order_Main_ID: stockMain.Order_Main_ID,
          Stock_Type_ID: 11
        }
      });

      if (existingGRN) {
        throw new Error(`GRN ${existingGRN.Number} already exists for this order`);
      }
      console.log('✅ No duplicate GRN found');
    }

    // =====================================================
    // 4️⃣ VALIDATE BATCHNO (Must be integer)
    // =====================================================
    for (let i = 0; i < stockDetails.length; i++) {
      if (stockDetails[i].batchno !== null && stockDetails[i].batchno !== undefined) {
        const batchInt = parseInt(stockDetails[i].batchno, 10);
        if (isNaN(batchInt)) {
          throw new Error(`Invalid batchno for item ${i + 1}`);
        }
        stockDetails[i].batchno = batchInt;
      }
    }

    // =====================================================
    // 5️⃣ GENERATE GRN NUMBER
    // =====================================================
    const grnNumber = await generateGRNNumber();
    console.log('📝 Generated GRN Number:', grnNumber);

    // =====================================================
    // 6️⃣ CREATE Stk_main (Header)
    // =====================================================
    const grn = await Stk_main.create({
      ...stockMain,
      Number: grnNumber,
      Stock_Type_ID: 11
    }, { transaction });

    console.log('✅ GRN Header Created:', grn.ID);

    // =====================================================
    // 7️⃣ CREATE Stk_Detail (Items)
    // =====================================================
    const grnDetails = stockDetails.map((detail, index) => ({
      ...detail,
      STK_Main_ID: grn.ID,
      Line_Id: index + 1,
      batchno: parseInt(detail.batchno, 10) || null
    }));

    await Stk_Detail.bulkCreate(grnDetails, { transaction });
    console.log('✅ GRN Details Created:', grnDetails.length, 'items');

    // =====================================================
    // 8️⃣ CALCULATE ORDER STATUS (Complete/Partial)
    // =====================================================
    let newOrderStatus = 'Partial';

    if (stockMain.Order_Main_ID && orderDetails.length > 0) {
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('📊 COMPARING ORDER vs GRN');
      console.log('═══════════════════════════════════════════════════════════════');

      let allItemsComplete = true;

      for (const orderItem of orderDetails) {
        const orderItemId = orderItem.Item_ID || orderItem.item_id;
        const orderQty = parseFloat(orderItem.uom1_qty) || 0;

        const grnItem = stockDetails.find(g => g.Item_ID === orderItemId);

        if (!grnItem) {
          allItemsComplete = false;
          console.log(`  ❌ Item ${orderItemId}: NOT in GRN (Order: ${orderQty})`);
        } else {
          const grnQty = parseFloat(grnItem.uom1_qty) || 0;

          if (grnQty >= orderQty) {
            console.log(`  ✅ Item ${orderItemId}: Complete (Order: ${orderQty}, GRN: ${grnQty})`);
          } else {
            allItemsComplete = false;
            console.log(`  ⚠️ Item ${orderItemId}: Partial (Order: ${orderQty}, GRN: ${grnQty})`);
          }
        }
      }

      newOrderStatus = allItemsComplete ? 'Complete' : 'Partial';
      console.log(`📊 Final Status: ${newOrderStatus}`);
      console.log('═══════════════════════════════════════════════════════════════');
    }

    // =====================================================
    // 9️⃣ UPDATE ORDER STATUS
    // =====================================================
    if (stockMain.Order_Main_ID) {
      await Order_Main.update(
        {
          is_Note_generated: true,
          Next_Status: newOrderStatus
        },
        {
          where: { ID: stockMain.Order_Main_ID },
          transaction
        }
      );
      console.log(`✅ Order Updated: is_Note_generated=true, Next_Status=${newOrderStatus}`);
    }

    // =====================================================
    // 🔟 COMMIT TRANSACTION
    // =====================================================
    await transaction.commit();
    console.log('✅ Transaction Committed Successfully');
    console.log('═══════════════════════════════════════════════════════════════');

    res.status(201).json({
      success: true,
      message: 'GRN created successfully',
      data: {
        ...grn.toJSON(),
        details: grnDetails,
        grnNumber,
        orderStatus: newOrderStatus,
        batchApplied: grnDetails[0]?.batchno
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('❌ GRN CREATE ERROR:', error.message);
    console.log('═══════════════════════════════════════════════════════════════');
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// UPDATE GRN
// =====================================================
router.put('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { stockMain, stockDetails } = req.body;

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📝 GRN UPDATE REQUEST - ID:', id);
    console.log('═══════════════════════════════════════════════════════════════');

    // =====================================================
    // 1️⃣ CHECK GRN EXISTS
    // =====================================================
    const existingGRN = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: 11 }
    });

    if (!existingGRN) {
      throw new Error('GRN not found');
    }

    // =====================================================
    // 2️⃣ CHECK IF GRN IS POSTED (Cannot edit if Posted)
    // =====================================================
    if (existingGRN.Status === 'Post') {
      throw new Error('Cannot edit a Posted GRN. Please UnPost first.');
    }

    // =====================================================
    // 3️⃣ VALIDATE BATCHNO
    // =====================================================
    for (let i = 0; i < stockDetails.length; i++) {
      if (stockDetails[i].batchno !== null && stockDetails[i].batchno !== undefined) {
        const batchInt = parseInt(stockDetails[i].batchno, 10);
        if (isNaN(batchInt)) {
          throw new Error(`Invalid batchno for item ${i + 1}`);
        }
        stockDetails[i].batchno = batchInt;
      }
    }

    // =====================================================
    // 4️⃣ UPDATE Stk_main (Header)
    // =====================================================
    await Stk_main.update(
      {
        COA_ID: stockMain.COA_ID,
        Date: stockMain.Date,
        Status: stockMain.Status,
        Purchase_Type: stockMain.Purchase_Type,
        Transporter_ID: stockMain.Transporter_ID,
        freight_crt: stockMain.freight_crt,
        labour_crt: stockMain.labour_crt,
        other_expense: stockMain.other_expense,
        remarks: stockMain.remarks
      },
      {
        where: { ID: id },
        transaction
      }
    );
    console.log('✅ GRN Header Updated');

    // =====================================================
    // 5️⃣ DELETE OLD DETAILS & CREATE NEW
    // =====================================================
    await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });

    const updatedDetails = stockDetails.map((detail, index) => ({
      ...detail,
      STK_Main_ID: parseInt(id),
      Line_Id: index + 1,
      batchno: parseInt(detail.batchno, 10) || null
    }));

    await Stk_Detail.bulkCreate(updatedDetails, { transaction });
    console.log('✅ GRN Details Updated:', updatedDetails.length, 'items');

    // =====================================================
    // 6️⃣ RECALCULATE ORDER STATUS
    // =====================================================
    let newOrderStatus = 'Partial';

    if (existingGRN.Order_Main_ID) {
      newOrderStatus = await calculateOrderStatus(existingGRN.Order_Main_ID, stockDetails);

      await Order_Main.update(
        { Next_Status: newOrderStatus },
        {
          where: { ID: existingGRN.Order_Main_ID },
          transaction
        }
      );
      console.log(`✅ Order Status Recalculated: ${newOrderStatus}`);
    }

    // =====================================================
    // 7️⃣ COMMIT TRANSACTION
    // =====================================================
    await transaction.commit();
    console.log('✅ Transaction Committed Successfully');
    console.log('═══════════════════════════════════════════════════════════════');

    res.json({
      success: true,
      message: 'GRN updated successfully',
      data: {
        id,
        orderStatus: newOrderStatus
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('❌ GRN UPDATE ERROR:', error.message);
    console.log('═══════════════════════════════════════════════════════════════');
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// DELETE GRN
// =====================================================
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🗑️ GRN DELETE REQUEST - ID:', id);
    console.log('═══════════════════════════════════════════════════════════════');

    // =====================================================
    // 1️⃣ GET GRN BEFORE DELETE (to get Order_Main_ID)
    // =====================================================
    const existingGRN = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: 11 }
    });

    if (!existingGRN) {
      throw new Error('GRN not found');
    }

    // =====================================================
    // 2️⃣ CHECK IF GRN IS POSTED (Cannot delete if Posted)
    // =====================================================
    if (existingGRN.Status === 'Post') {
      throw new Error('Cannot delete a Posted GRN. Please UnPost first.');
    }

    const orderId = existingGRN.Order_Main_ID;
    console.log('📋 GRN belongs to Order ID:', orderId);

    // =====================================================
    // 3️⃣ DELETE DETAILS FIRST
    // =====================================================
    await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });
    console.log('✅ GRN Details Deleted');

    // =====================================================
    // 4️⃣ DELETE MAIN RECORD
    // =====================================================
    await Stk_main.destroy({
      where: { ID: id },
      transaction
    });
    console.log('✅ GRN Header Deleted');

    // =====================================================
    // 5️⃣ RESET ORDER STATUS
    // =====================================================
    if (orderId) {
      // Check if there are any OTHER GRNs for this order
      const remainingGRNs = await Stk_main.count({
        where: {
          Order_Main_ID: orderId,
          Stock_Type_ID: 11,
          ID: { [Op.ne]: id }
        },
        transaction
      });

      console.log('📊 Remaining GRNs for order:', remainingGRNs);

      if (remainingGRNs === 0) {
        // No more GRNs, reset order status
        await Order_Main.update(
          {
            Next_Status: 'Incomplete',
            is_Note_generated: false
          },
          {
            where: { ID: orderId },
            transaction
          }
        );
        console.log('✅ Order Reset: Next_Status=Incomplete, is_Note_generated=false');
      } else {
        // Other GRNs exist, recalculate status
        // Get remaining GRN details
        const remainingGRNDetails = await Stk_Detail.findAll({
          include: [{
            model: Stk_main,
            as: 'main',
            where: {
              Order_Main_ID: orderId,
              Stock_Type_ID: 11,
              ID: { [Op.ne]: id }
            }
          }],
          transaction
        });

        const newStatus = await calculateOrderStatus(orderId, remainingGRNDetails);
        await Order_Main.update(
          { Next_Status: newStatus },
          {
            where: { ID: orderId },
            transaction
          }
        );
        console.log(`✅ Order Status Recalculated: ${newStatus}`);
      }
    }

    // =====================================================
    // 6️⃣ COMMIT TRANSACTION
    // =====================================================
    await transaction.commit();
    console.log('✅ Transaction Committed Successfully');
    console.log('═══════════════════════════════════════════════════════════════');

    res.json({
      success: true,
      message: 'GRN deleted successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('❌ GRN DELETE ERROR:', error.message);
    console.log('═══════════════════════════════════════════════════════════════');
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// POST/UNPOST GRN (Optional - Status Toggle)
// =====================================================
router.patch('/:id/status', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;  // 'Post' or 'UnPost'

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🔄 GRN STATUS CHANGE - ID:', id, 'New Status:', status);
    console.log('═══════════════════════════════════════════════════════════════');

    // Validate status
    if (!['Post', 'UnPost'].includes(status)) {
      throw new Error('Invalid status. Use "Post" or "UnPost"');
    }

    // Check GRN exists
    const existingGRN = await Stk_main.findOne({
      where: { ID: id, Stock_Type_ID: 11 }
    });

    if (!existingGRN) {
      throw new Error('GRN not found');
    }

    // Update status
    await Stk_main.update(
      { Status: status },
      {
        where: { ID: id },
        transaction
      }
    );

    await transaction.commit();
    console.log(`✅ GRN Status Changed to: ${status}`);

    res.json({
      success: true,
      message: `GRN ${status === 'Post' ? 'posted' : 'unposted'} successfully`,
      data: { id, status }
    });

  } catch (error) {
    await transaction.rollback();
    console.log('❌ GRN STATUS ERROR:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
