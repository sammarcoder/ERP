// routes/gdn.js - COMPLETE GDN CRUD

const express = require('express');
const router = express.Router();
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Order_Detail, Uom, Ztransporter } = require('../models');
const { Op } = require('sequelize');
// const sequelize = require('../config/database');
const db = require('../models');
const { ar } = require('zod/v4/locales');
const sequelize = db.sequelize;

// =====================================================
// HELPER: Generate GDN Number
// =====================================================
const generateGDNNumber = async () => {
  const lastGDN = await Stk_main.findOne({
    where: { Stock_Type_ID: 12 },
    order: [['ID', 'DESC']]
  });

  if (!lastGDN) return `GDN-1`;

  const numberStr = lastGDN.Number || '';
  const match = numberStr.match(/(\d+)$/);
  let nextSeq;

  if (match) {
    nextSeq = parseInt(match[1], 10) + 1;
  } else if (typeof lastGDN.ID === 'number') {
    nextSeq = lastGDN.ID + 1;
  } else {
    nextSeq = 1;
  }

  return `GDN-${nextSeq}`;
};




// =====================================================
// HELPER: Check Stock Availability
// =====================================================
const checkStockAvailability = async (itemId, requiredQty) => {
  // Total Stock IN (from GRNs)
  const stockInResult = await Stk_Detail.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('Stock_In_UOM_Qty')), 'totalIn']],
    where: { Item_ID: itemId },
    include: [{
      model: Stk_main,
      as: 'stockMain',
      where: { Stock_Type_ID: 11 },
      attributes: []
    }],
    raw: true
  });
  const stockIn = parseFloat(stockInResult[0]?.totalIn) || 0;

  // Total Stock OUT (from GDNs)
  const stockOutResult = await Stk_Detail.findAll({
    attributes: [[sequelize.fn('SUM', sequelize.col('Stock_out_UOM_Qty')), 'totalOut']],
    where: { Item_ID: itemId },
    include: [{
      model: Stk_main,
      as: 'stockMain',
      where: { Stock_Type_ID: 12 },
      attributes: []
    }],
    raw: true
  });
  const stockOut = parseFloat(stockOutResult[0]?.totalOut) || 0;

  const available = stockIn - stockOut;

  return {
    itemId,
    stockIn,
    stockOut,
    available,
    required: requiredQty,
    isAvailable: available >= requiredQty,
    shortage: Math.max(0, requiredQty - available)
  };
};

// =====================================================
// HELPER: Calculate Order Status
// =====================================================
const calculateOrderStatus = async (orderId, gdnDetails) => {
  const orderDetails = await Order_Detail.findAll({
    where: { Order_Main_ID: orderId }
  });

  if (orderDetails.length === 0) return 'Partial';

  let allComplete = true;

  for (const orderItem of orderDetails) {
    const orderQty = parseFloat(orderItem.uom1_qty) || 0;
    const gdnItem = gdnDetails.find(g => g.Item_ID === orderItem.Item_ID);

    if (!gdnItem || (parseFloat(gdnItem.uom1_qty) || 0) < orderQty) {
      allComplete = false;
      break;
    }
  }

  return allComplete ? 'Complete' : 'Partial';
};

// =====================================================
// GET ALL GDNs
// =====================================================
router.get('/', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, customerId, page = 1, limit = 50 } = req.query;

    const where = { Stock_Type_ID: 12 };

    if (status && status !== 'all') where.Status = status;
    if (dateFrom && dateTo) where.Date = { [Op.between]: [dateFrom, dateTo] };
    if (customerId) where.COA_ID = customerId;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Stk_main.findAndCountAll({
      where,
      include: [
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
            { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName', 'city', 'mobileNo'] },
          ]
        },
        { model: ZCoa, as: 'account', attributes: ['id', 'acName', 'city', 'mobileNo'] },

        {
          model: Order_Main,
          as: 'order',
          attributes: ['ID', 'Number', 'Date', 'Next_Status', 'approved', 'is_Note_generated', 'sub_city', 'sub_customer'],
          include: [
            {
              model: Order_Detail, as: 'details',
              attributes: ['ID', 'Item_ID', 'uom1_qty', 'uom2_qty', 'uom3_qty'],
              include: [
                {
                  model: ZItems,
                  as: 'item',
                  attributes: ['id', 'itemName']
                }
              ]
            }
          ]
        },
        { model: Ztransporter, as: 'transporter', artributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      // limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
    });
  } catch (error) {
    console.error('❌ Error fetching GDNs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});









// GET orders with Next_Status = 'partial' for additional GDN
router.get('/orders-for-additional-gdn', async (req, res) => {
  try {
    const { search } = req.query;

    const where = {
      Next_Status: 'partial',
      approved: 1,
      Stock_Type_ID:12
    };

    if (search) {
      where[Op.or] = [
        { Number: { [Op.like]: `%${search}%` } }
      ];
    }

    // ✅ Query Order_Main table (not Stk_Main)
    const rows = await Order_Main.findAll({
      where,
      attributes: ['ID', 'Number', 'Date', 'Next_Status', 'approved', 'is_Note_generated', 'sub_city', 'sub_customer', 'COA_ID'],
      include: [
        {
          model: Order_Detail,
          as: 'details',
          attributes: ['ID', 'Item_ID', 'uom1_qty', 'uom2_qty', 'uom3_qty'],
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
            }
          ]
        },
        {
          model: Stk_main,
          as: 'stockTransactions',
          attributes: ['ID', 'Number', 'Date', 'Status', 'order_Main_ID'],
          include: [
            {
              model: Stk_Detail,
              as: 'details',
              attributes: ['ID', 'Item_ID', 'uom1_qty', 'uom2_qty', 'uom3_qty'],
              // include: [
              //   {
              //     model: ZItems,
              //     as: 'item',
              //     attributes: ['id', 'itemName']
              //   }
              // ]
            }
          ]
        },
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', 'city']
        },
      ],
      order: [['Date', 'DESC']]
    });

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


















// =====================================================
// GET SINGLE GDN
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    const gdn = await Stk_main.findOne({
      where: { ID: req.params.id, Stock_Type_ID: 12 },
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName', 'skuUOM', 'uom2', 'uom2_qty', 'uom3', 'uom3_qty', 'sellingPrice'],
              include: [
                { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
              ]
            },
            { model: ZCoa, as: 'batchDetails', attributes: ['id', 'acName', 'city', 'mobileNo'] }
          ]
        },
        { model: ZCoa, as: 'account', attributes: ['id', 'acName', 'city', 'mobileNo'] },
        { model: Order_Main, as: 'order', attributes: ['ID', 'Number', 'Date', 'Next_Status', 'approved', 'is_Note_generated', 'sub_city', 'sub_customer'] },
        { model: Ztransporter, as: 'transporter', attributes: ['id', 'name'] }
      ]
    });

    if (!gdn) return res.status(404).json({ success: false, error: 'GDN not found' });

    res.json({ success: true, data: gdn });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// CREATE GDN
// =====================================================
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { stockMain, stockDetails } = req.body;

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📤 GDN CREATE REQUEST');
    console.log('═══════════════════════════════════════════════════════════════');

    // Validation
    if (!stockMain?.COA_ID) throw new Error('Customer (COA_ID) is required');
    if (!stockDetails || stockDetails.length === 0) throw new Error('At least one item is required');

    // Check Order
    let orderData = null;
    if (stockMain.Order_Main_ID) {
      orderData = await Order_Main.findByPk(stockMain.Order_Main_ID, {
        include: [{ model: Order_Detail, as: 'details' }]
      });

      if (!orderData) throw new Error(`Order ID ${stockMain.Order_Main_ID} not found`);
      if (orderData.approved !== true && orderData.approved !== 1) {
        throw new Error(`Order ${orderData.Number} is not approved`);
      }
      if (orderData.is_Note_generated === true || orderData.is_Note_generated === 1) {
        throw new Error(`GDN already exists for Order ${orderData.Number}`);
      }
      console.log('✅ Order validation passed:', orderData.Number);
    }

    // Check duplicate
    if (stockMain.Order_Main_ID) {
      const existing = await Stk_main.findOne({
        where: { Order_Main_ID: stockMain.Order_Main_ID, Stock_Type_ID: 12 }
      });
      if (existing) throw new Error(`GDN ${existing.Number} already exists for this order`);
    }

    // ✅ CHECK STOCK AVAILABILITY
    console.log('📊 Checking stock availability...');
    const stockErrors = [];

    for (const detail of stockDetails) {
      const requiredQty = parseFloat(detail.uom1_qty) || 0;
      if (requiredQty <= 0) continue;

      const check = await checkStockAvailability(detail.Item_ID, requiredQty);
      console.log(`  Item ${detail.Item_ID}: Available=${check.available}, Required=${requiredQty}`);

      if (!check.isAvailable) {
        stockErrors.push({
          itemId: detail.Item_ID,
          available: check.available,
          required: requiredQty,
          shortage: check.shortage
        });
      }
    }

    if (stockErrors.length > 0) {
      const errorMsg = stockErrors.map(e =>
        `Item ${e.itemId}: Need ${e.required}, Have ${e.available} (Short: ${e.shortage})`
      ).join('; ');
      throw new Error(`Insufficient stock: ${errorMsg}`);
    }
    console.log('✅ Stock check passed');

    // Validate batchno
    stockDetails.forEach((d, i) => {
      if (d.batchno) d.batchno = parseInt(d.batchno, 10) || null;
    });

    // Generate number
    const gdnNumber = await generateGDNNumber();
    console.log('📝 Generated:', gdnNumber);

    // Create header with all cost fields
    const gdn = await Stk_main.create({
      Stock_Type_ID: 12,
      COA_ID: stockMain.COA_ID,
      Date: stockMain.Date,
      Number: gdnNumber,
      Status: stockMain.Status || 'UnPost',
      Purchase_Type: stockMain.Purchase_Type,
      Order_Main_ID: stockMain.Order_Main_ID,
      Transporter_ID: stockMain.Transporter_ID || null,
      // ✅ Cost fields
      freight_crt: parseFloat(stockMain.freight_crt) || 0,
      labour_crt: parseFloat(stockMain.labour_crt) || 0,
      bility_expense: parseFloat(stockMain.bility_expense) || 0,
      other_expense: parseFloat(stockMain.other_expense) || 0,
      booked_crt: parseFloat(stockMain.booked_crt) || 0,
      remarks: stockMain.remarks || null
    }, { transaction });

    // Create details with Stock_out fields
    const gdnDetails = stockDetails.map((detail, idx) => ({
      ...detail,
      STK_Main_ID: gdn.ID,
      Line_Id: idx + 1,
      Stock_out_UOM: detail.Stock_In_UOM || detail.uom1_id,
      Stock_out_UOM_Qty: detail.uom1_qty,
      Stock_out_SKU_UOM: detail.Stock_In_SKU_UOM || detail.uom2_id,
      Stock_out_SKU_UOM_Qty: detail.uom2_qty,
      Stock_out_UOM3_Qty: detail.uom3_qty
    }));

    await Stk_Detail.bulkCreate(gdnDetails, { transaction });

    // Update order status
    let newStatus = 'Partial';
    if (stockMain.Order_Main_ID) {
      newStatus = await calculateOrderStatus(stockMain.Order_Main_ID, stockDetails);
      await Order_Main.update(
        { is_Note_generated: true, Next_Status: newStatus },
        { where: { ID: stockMain.Order_Main_ID }, transaction }
      );
      console.log(`✅ Order updated: ${newStatus}`);
    }

    await transaction.commit();
    console.log('✅ GDN Created:', gdnNumber);

    res.status(201).json({
      success: true,
      message: 'GDN created successfully',
      data: { ...gdn.toJSON(), details: gdnDetails, gdnNumber, orderStatus: newStatus }
    });

  } catch (error) {
    await transaction.rollback();
    console.log('❌ GDN ERROR:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// UPDATE GDN
// =====================================================
router.put('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { stockMain, stockDetails } = req.body;

    const existing = await Stk_main.findOne({ where: { ID: id, Stock_Type_ID: 12 } });
    if (!existing) throw new Error('GDN not found');
    if (existing.Status === 'Post') throw new Error('Cannot edit Posted GDN');

    // Update header
    await Stk_main.update(
      {
        COA_ID: stockMain.COA_ID,
        Date: stockMain.Date,
        Status: stockMain.Status,
        Purchase_Type: stockMain.Purchase_Type,
        remarks: stockMain.remarks,
        sub_customer: stockMain.sub_customer || null,
        sub_city: stockMain.sub_city || null,
        Transporter_ID: stockMain.Transporter_ID || null,
        labour_crt: stockMain.labour_crt ?? 0,
        freight_crt: stockMain.freight_crt ?? 0,
        bility_expense: stockMain.bility_expense ?? 0,
        other_expense: stockMain.other_expense ?? 0,
        booked_crt: stockMain.booked_crt ?? 0
      },
      { where: { ID: id }, transaction }
    );

    // Replace details
    await Stk_Detail.destroy({ where: { STK_Main_ID: id }, transaction });

    // const updatedDetails = stockDetails.map((detail, idx) => ({
    //   ...detail,
    //   STK_Main_ID: parseInt(id),
    //   Line_Id: idx + 1,
    //   Stock_out_UOM: detail.Stock_In_UOM,
    //   Stock_out_UOM_Qty: detail.uom1_qty,
    //   Stock_out_SKU_UOM: detail.Stock_In_SKU_UOM,
    //   Stock_out_SKU_UOM_Qty: detail.uom2_qty,
    //   Stock_out_UOM3_Qty: detail.uom3_qty
    // }));


    const updatedDetails = stockDetails.map((detail, idx) => ({
      STK_Main_ID: parseInt(id),
      Line_Id: idx + 1,
      Item_ID: detail.Item_ID,
      batchno: parseInt(detail.batchno) || null,
      uom1_qty: parseFloat(detail.uom1_qty) || 0,
      uom2_qty: parseFloat(detail.uom2_qty) || 0,
      uom3_qty: parseFloat(detail.uom3_qty) || 0,
      Sale_Unit: parseInt(detail.Sale_Unit) || 1,
      sale_Uom: parseInt(detail.sale_Uom) || 0,
      Stock_Price: parseFloat(detail.Stock_Price) || 0,
      Stock_out_UOM: parseInt(detail.Stock_out_UOM) || 1,
      Stock_out_UOM_Qty: parseFloat(detail.uom1_qty) || 0,
      Stock_out_SKU_UOM: detail.Stock_out_SKU_UOM ? parseInt(detail.Stock_out_SKU_UOM) : null,
      Stock_out_SKU_UOM_Qty: parseFloat(detail.uom2_qty) || 0,
      Stock_out_UOM3_Qty: parseFloat(detail.uom3_qty) || 0,
      // ✅ Include discount fields
      Discount_A: parseFloat(detail.Discount_A) || 0,
      Discount_B: parseFloat(detail.Discount_B) || 0,
      Discount_C: parseFloat(detail.Discount_C) || 0
    }));


    await Stk_Detail.bulkCreate(updatedDetails, { transaction });

    // Recalculate order status
    if (existing.Order_Main_ID) {
      const newStatus = await calculateOrderStatus(existing.Order_Main_ID, stockDetails);
      await Order_Main.update({ Next_Status: newStatus }, { where: { ID: existing.Order_Main_ID }, transaction });
    }

    await transaction.commit();
    res.json({ success: true, message: 'GDN updated' });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// DELETE GDN
// =====================================================
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const existing = await Stk_main.findOne({ where: { ID: id, Stock_Type_ID: 12 } });
    if (!existing) throw new Error('GDN not found');
    if (existing.Status === 'Post') throw new Error('Cannot delete Posted GDN');

    const orderId = existing.Order_Main_ID;

    await Stk_Detail.destroy({ where: { STK_Main_ID: id }, transaction });
    await Stk_main.destroy({ where: { ID: id }, transaction });

    // Reset order if no more GDNs
    if (orderId) {
      const remaining = await Stk_main.count({
        where: { Order_Main_ID: orderId, Stock_Type_ID: 12, ID: { [Op.ne]: id } },
        transaction
      });

      if (remaining === 0) {
        await Order_Main.update(
          { Next_Status: 'Incomplete', is_Note_generated: false },
          { where: { ID: orderId }, transaction }
        );
      }
    }

    await transaction.commit();
    res.json({ success: true, message: 'GDN deleted' });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
