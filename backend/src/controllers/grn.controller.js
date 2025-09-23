// routes/grn.js
const express = require('express');
const router = express.Router();
const { Stk_main, Stk_Detail, ZItems, ZCOA, Order_Main } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');

// Generate GRN Number based on type sequence
const generateGRNNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  const lastGRN = await Stk_main.findOne({
    where: { 
      Stock_Type_ID: 1, // GRN type
      Number: { [Op.like]: `GRN-${year}${month}%` }
    },
    order: [['Number', 'DESC']]
  });

  let sequence = 1;
  if (lastGRN) {
    const lastSequence = parseInt(lastGRN.Number.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `GRN-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// GET /api/grn - Get all GRNs
router.get('/', async (req, res) => {
  try {
    const grns = await Stk_main.findAll({
      where: { Stock_Type_ID: 1 }, // Only GRN records
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            { 
              model: ZItems, 
              as: 'item',
              include: [
                { model: ZUOM, as: 'uom1' },
                { model: ZUOM, as: 'uomTwo' },
                { model: ZUOM, as: 'uomThree' }
              ]
            }
          ]
        },
        { model: ZCOA, as: 'account' },
        { model: Order_Main, as: 'order' },
        { model: Ztransporter, as: 'transporter' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: grns
    });
  } catch (error) {
    console.error('Error fetching GRNs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/grn - Create GRN
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { stockMain, stockDetails } = req.body;

    // Generate auto GRN number as per type sequence
    const grnNumber = await generateGRNNumber();

    // Create Stk_main record
    const grn = await Stk_main.create({
      ...stockMain,
      Number: grnNumber
    }, { transaction });

    // Create Stk_Detail records
    const grnDetails = stockDetails.map((detail, index) => ({
      ...detail,
      STK_Main_ID: grn.ID,
      Line_Id: index + 1
    }));

    const createdDetails = await Stk_Detail.bulkCreate(grnDetails, { 
      transaction,
      validate: true 
    });

    // ADDED: Update Order_Main GRN_Status as per your requirement
    if (stockMain.Order_Main_ID) {
      await Order_Main.update(
        { GRN_Status: 'Partial' }, // Can be made dynamic based on quantities
        { 
          where: { ID: stockMain.Order_Main_ID },
          transaction 
        }
      );
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'GRN created successfully',
      data: { 
        ...grn.toJSON(), 
        details: createdDetails,
        grnNumber: grnNumber
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating GRN:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/grn/from-po/:orderId - Get GRN data from Purchase Order
router.get('/from-po/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const purchaseOrder = await Order_Main.findByPk(orderId, {
      where: { Stock_Type_ID: 1 }, // Purchase order
      include: [
        {
          model: Order_Detail,
          as: 'details',
          include: [{ model: ZItems, as: 'item' }]
        },
        { model: ZCOA, as: 'account' }
      ]
    });

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        error: 'Purchase Order not found'
      });
    }

    res.json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    console.error('Error fetching PO for GRN:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
