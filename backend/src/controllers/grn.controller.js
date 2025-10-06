
// routes/grn.js - COMPLETE CRUD
const express = require('express');
const router = express.Router();
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Uom } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');

// Generate GRN Number
const generateGRNNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  const lastGRN = await Stk_main.findOne({
    where: {
      Stock_Type_ID: 11,
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

// GET all GRNs
router.get('/', async (req, res) => {
  try {
    const grns = await Stk_main.findAll({
      where: { Stock_Type_ID: 11 },
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [{ model: ZItems, as: 'item' }]
        },
        { model: ZCoa, as: 'account' },
        { model: Order_Main, as: 'order' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: grns });
  } catch (error) {
    console.error('Error fetching GRNs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single GRN
router.get('/:id', async (req, res) => {
  try {
    const grn = await Stk_main.findOne({
      where: { ID: req.params.id, Stock_Type_ID: 11 },
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [{ model: ZItems, as: 'item' }]
        },
        { model: ZCoa, as: 'account' },
        { model: Order_Main, as: 'order' }
      ]
    });

    if (!grn) {
      return res.status(404).json({ success: false, error: 'GRN not found' });
    }

    res.json({ success: true, data: grn });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE GRN
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { stockMain, stockDetails } = req.body;

    const grnNumber = await generateGRNNumber();
    // console.log('this is order stock main data ', ...stockMain)
    const grn = await Stk_main.create({
      ...stockMain,
      Number: grnNumber
    }, { transaction });

    const grnDetails = stockDetails.map((detail, index) => ({
      ...detail,
      STK_Main_ID: grn.ID,
      Line_Id: index + 1,
      batchno: stockMain.batchno // Pass batch number from main
    }));

    await Stk_Detail.bulkCreate(grnDetails, { transaction });

    if (stockMain.Order_Main_ID) {
      await Order_Main.update(
        { Next_Status: 'Partial' },
        { where: { ID: stockMain.Order_Main_ID }, transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'GRN created successfully',
      data: { ...grn.toJSON(), details: grnDetails, grnNumber }
    });
  } catch (error) {
    await transaction.rollback();
    
    console.error('Error creating GRN:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE GRN
router.put('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { stockMain, stockDetails } = req.body;

    await Stk_main.update(stockMain, {
      where: { ID: id, Stock_Type_ID: 11 },
      transaction
    });

    // Delete and recreate details
    await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });

    const updatedDetails = stockDetails.map((detail, index) => ({
      ...detail,
      STK_Main_ID: id,
      Line_Id: index + 1,
      batchno: stockMain.batchno
    }));

    await Stk_Detail.bulkCreate(updatedDetails, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'GRN updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE GRN
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });

    const deleted = await Stk_main.destroy({
      where: { ID: id, Stock_Type_ID: 11 },
      transaction
    });

    if (!deleted) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'GRN not found'
      });
    }

    await transaction.commit();

    res.json({
      success: true,
      message: 'GRN deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
