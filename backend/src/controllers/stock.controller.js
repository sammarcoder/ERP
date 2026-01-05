
const db = require('../models');
const { Stk_main, Stk_Detail, ZItems, Uom, ZCoa, ZvoucherType } = db;  // FIXED: Use Stk_main
const sequelize = db.sequelize;

// Generate Stock Number
const generateStockNumber = async (stockTypeId) => {
  const prefix = stockTypeId === 1 ? 'STK-IN' : 'STK-OUT';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');

  const lastStock = await Stk_main.findOne({  // FIXED: Use Stk_main
    where: { Stock_Type_ID: stockTypeId },
    order: [['createdAt', 'DESC']]
  });

  let sequence = 1;
  if (lastStock && lastStock.Number) {
    const lastSequence = parseInt(lastStock.Number.split('-').pop());
    sequence = lastSequence + 1;
  }

  return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
};







const createCompleteStock = async (req, res) => {
  const { stockMain, stockDetails } = req.body;

  if (!stockMain || !stockDetails || stockDetails.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Stock main and details are required'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const stockNumber = await generateStockNumber(stockMain.Stock_Type_ID);

    const stockMainData = await Stk_main.create({  // FIXED: Use Stk_main
      ...stockMain,
      Number: stockNumber,
      is_Voucher_Generated: false  // FIXED: Add default value
    }, { transaction });

    const stockDetailsWithMainId = stockDetails.map((detail, index) => ({
      STK_Main_ID: stockMainData.ID,
      Line_Id: detail.Line_Id || (index + 1),
      Item_ID: detail.Item_ID,
      batchno: detail.batchno,
      Stock_Price: parseFloat(detail.Stock_Price) || 0,
      Stock_out_UOM_Qty: parseFloat(detail.Stock_out_UOM_Qty) || 0,
      Stock_out_SKU_UOM_Qty: parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0,
      Stock_out_UOM3_Qty: parseFloat(detail.Stock_out_UOM3_Qty) || 0,
      Stock_In_UOM_Qty: parseFloat(detail.Stock_In_UOM_Qty) || 0,
      Stock_In_SKU_UOM_Qty: parseFloat(detail.Stock_In_SKU_UOM_Qty) || 0,
      Stock_In_UOM3_Qty: parseFloat(detail.Stock_In_UOM3_Qty) || 0,
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

    await transaction.commit();

    const completeStock = await Stk_main.findByPk(stockMainData.ID, {  // FIXED: Use Stk_main
      include: [
        {
          model: Stk_Detail,
          as: 'stockDetails',
          include: [
            { model: ZItems, as: 'item' }
          ]
        },
        { model: ZCoa, as: 'account' }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      data: completeStock
    });

  } catch (error) {
    await transaction.rollback();

    console.error('💥 Error creating stock:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create stock',
      error: error.message
    });
  }
};





const getAllStock = async (req, res) => {
  try {
    const { stockTypeId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (stockTypeId) whereClause.Stock_Type_ID = stockTypeId;

    const { count, rows } = await Stk_main.findAndCountAll({  // FIXED: Use Stk_main
      where: whereClause,
      include: [
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName']
        },
        {
          model: Stk_Detail,
          as: 'stockDetails',
          include: [
            { model: ZItems, as: 'item' }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
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
    console.error('💥 Error fetching stock:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stock',
      error: error.message
    });
  }
};





const getStockById = async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await Stk_main.findByPk(id, {  // FIXED: Use Stk_main
      include: [
        {
          model: Stk_Detail,
          as: 'stockDetails',
          include: [
            { model: ZItems, as: 'item' },
            { model: Uom, as: 'SaleUnit' }
          ]
        },
        { model: ZCoa, as: 'account' }
      ]
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error('💥 Error fetching stock by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stock',
      error: error.message
    });
  }
};





const updateCompleteStock = async (req, res) => {
  const { id } = req.params;
  const { stockMain, stockDetails } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const existingStock = await Stk_main.findByPk(id);  // FIXED: Use Stk_main
    if (!existingStock) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    await Stk_main.update(stockMain, {  // FIXED: Use Stk_main
      where: { ID: id },
      transaction
    });

    await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });

    const stockDetailsWithMainId = stockDetails.map((detail, index) => ({
      ...detail,
      STK_Main_ID: id,
      Line_Id: index + 1
    }));

    await Stk_Detail.bulkCreate(stockDetailsWithMainId, {
      transaction,
      validate: true
    });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('💥 Error updating stock:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};





const deleteCompleteStock = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    const existingStock = await Stk_main.findByPk(id);  // FIXED: Use Stk_main
    if (!existingStock) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    });

    await Stk_main.destroy({  // FIXED: Use Stk_main
      where: { ID: id },
      transaction
    });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Stock deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('💥 Error deleting stock:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete stock',
      error: error.message
    });
  }
};





const updateStockMain = async (req, res) => {
  const { id } = req.params;
  const { 
    is_Voucher_Generated, 
    Carriage_Amount,
    Carriage_ID  // Store COA ID here, not in Transporter
  } = req.body;
  
  try {
    const updateFields = {};
    
    if (is_Voucher_Generated !== undefined) updateFields.is_Voucher_Generated = is_Voucher_Generated;
    if (Carriage_Amount !== undefined) updateFields.Carriage_Amount = Carriage_Amount;
    if (Carriage_ID !== undefined) updateFields.Carriage_ID = Carriage_ID;  // ADD THIS


    console.log(`🔄 Updating stock main ID: ${id} with fields:`, updateFields);

    const [updated] = await Stk_main.update(updateFields, {
      where: { ID: id }
    });
    
    if (updated > 0) {
      console.log(`✅ Successfully updated stock main ID: ${id}`);
      res.json({
        success: true,
        message: 'Stock main updated successfully',
        updatedFields: updateFields
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Stock main not found'
      });
    }
  } catch (error) {
    console.error(`💥 Error updating stock main ID: ${id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};




const updateStockDetail = async (req, res) => {
  const { id } = req.params;
  const {
    Stock_Price,
    Stock_out_UOM_Qty,
    Stock_out_SKU_UOM_Qty,
    Stock_out_UOM3_Qty,
    Stock_In_UOM_Qty,
    Stock_In_SKU_UOM_Qty,
    Stock_In_UOM3_Qty,
    Sale_Unit,
    Discount_A,
    Discount_B,
    Discount_C,
    
  } = req.body;

  try {
    const updateFields = {};

    if (Stock_Price !== undefined) updateFields.Stock_Price = Stock_Price;
    if (Stock_out_UOM_Qty !== undefined) updateFields.Stock_out_UOM_Qty = Stock_out_UOM_Qty;
    if (Stock_out_SKU_UOM_Qty !== undefined) updateFields.Stock_out_SKU_UOM_Qty = Stock_out_SKU_UOM_Qty;
    if (Stock_out_UOM3_Qty !== undefined) updateFields.Stock_out_UOM3_Qty = Stock_out_UOM3_Qty;
    if (Stock_In_UOM_Qty !== undefined) updateFields.Stock_In_UOM_Qty = Stock_In_UOM_Qty;
    if (Stock_In_SKU_UOM_Qty !== undefined) updateFields.Stock_In_SKU_UOM_Qty = Stock_In_SKU_UOM_Qty;
    if (Stock_In_UOM3_Qty !== undefined) updateFields.Stock_In_UOM3_Qty = Stock_In_UOM3_Qty;
    if (Sale_Unit !== undefined) updateFields.Sale_Unit = Sale_Unit;
    if (Discount_A !== undefined) updateFields.Discount_A = Discount_A;
    if (Discount_B !== undefined) updateFields.Discount_B = Discount_B;
    if (Discount_C !== undefined) updateFields.Discount_C = Discount_C;

   

    console.log(`🔄 Updating stock detail ID: ${id} with fields:`, updateFields);

    const [updated] = await Stk_Detail.update(updateFields, {
      where: { ID: id }
    });

    if (updated > 0) {
      console.log(`✅ Successfully updated stock detail ID: ${id}`);
      res.json({
        success: true,
        message: 'Stock detail updated successfully',
        updatedFields: updateFields
      });
    } else {
      console.log(`❌ Stock detail ID: ${id} not found`);
      res.status(404).json({
        success: false,
        error: 'Stock detail not found'
      });
    }
  } catch (error) {
    console.error(`💥 Error updating stock detail ID: ${id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};









// controllers/stock.controller.js - ADD DELETE FUNCTION
const deleteDispatch = async (req, res) => {
  const { id } = req.params

  const transaction = await sequelize.transaction()

  try {
    const dispatch = await Stk_main.findByPk(id)
    if (!dispatch) {
      return res.status(404).json({ success: false, error: 'Dispatch not found' })
    }

    if (dispatch.is_Voucher_Generated) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete dispatch - voucher already generated'
      })
    }

    // Delete details first
    await Stk_Detail.destroy({
      where: { STK_Main_ID: id },
      transaction
    })

    // Delete main record
    await Stk_main.destroy({
      where: { ID: id },
      transaction
    })

    await transaction.commit()

    res.json({
      success: true,
      message: 'Dispatch deleted successfully'
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}



module.exports = {
  createCompleteStock,
  getAllStock,
  getStockById,
  updateCompleteStock,
  deleteCompleteStock,
  updateStockDetail,
  updateStockMain,
  deleteDispatch
};
