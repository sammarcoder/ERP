const db = require('../models');
const { Order_Main, Order_Detail, ZItems, Uom, ZCoa } = db;
const sequelize = db.sequelize;

// Generate Order Number
const generateOrderNumber = async (stockTypeId) => {
  const prefix = stockTypeId === 1 ? 'PO' : 'SO';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  const lastOrder = await Order_Main.findOne({
    where: { Stock_Type_ID: stockTypeId },
    order: [['createdAt', 'DESC']]
  });
  
  let sequence = 1;
  if (lastOrder && lastOrder.Number) {
    const lastSequence = parseInt(lastOrder.Number.split('-').pop());
    sequence = lastSequence + 1;
  }
  
  return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

const createCompleteOrder = async (req, res) => {
  const { master, details } = req.body;
  
  if (!master || !details || details.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Master and details are required' 
    });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    // Generate order number
    const orderNumber = await generateOrderNumber(master.Stock_Type_ID);
    
    // Create master with generated number
    const orderMaster = await Order_Main.create({
      ...master,
      Number: orderNumber
    }, { transaction });
    
    // Add master ID to details and ensure Line_Id is sequential
    // Old code (before sale_unit):
    // const orderDetails = details.map((detail, index) => ({
    //   ...detail,
    //   Order_Main_Id: orderMaster.ID,
    //   Line_Id: index + 1
    // }));
    // New code: include all UOM quantities and sale_unit from frontend
    const orderDetails = details.map((detail, index) => ({
      ...detail,
      Order_Main_Id: orderMaster.ID,
      Line_Id: index + 1,
      uom1_qty: detail.uom1_qty || 0,
      uom2_qty: detail.uom2_qty || 0,
      uom3_qty: detail.uom3_qty || 0,
      sale_unit: detail.sale_unit || null
    }));
    // Create details
    const createdDetails = await Order_Detail.bulkCreate(orderDetails, { 
      transaction,
      validate: true 
    });
    
    await transaction.commit();
    
    // Fetch complete order with associations
    const completeOrder = await Order_Main.findByPk(orderMaster.ID, {
      include: [
        {
          model: Order_Detail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item' }
          ]
        },
        { model: ZCoa, as: 'account' }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: completeOrder
    });
    
  } catch (error) {
    await transaction.rollback();
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: `Invalid reference: ${error.message}`
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// const getAllOrders = async (req, res) => {
//   try {
//     const { stockTypeId, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
    
//     const whereClause = {};
//     if (stockTypeId) whereClause.Stock_Type_ID = stockTypeId;
    
//     const { count, rows } = await Order_Main.findAndCountAll({
//       where: whereClause,
//       include: [
//         { model: ZCoa, as: 'account', attributes: ['id', 'acName','city'] },
//         {model:Order_Detail,as:'details', },
//         { model: ZItems, as: 'item', attributes: ['id', 'Item_Name'] }
//       ],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order: [['createdAt', 'DESC']]
//     });
    
//     return res.status(200).json({
//       success: true,
//       data: rows,
//       pagination: {
//         total: count,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(count / limit)
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch orders',
//       error: error.message
//     });
//   }
// };









const getAllOrders = async (req, res) => {
  try {
    const { stockTypeId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (stockTypeId) whereClause.Stock_Type_ID = stockTypeId;

    const { count, rows } = await Order_Main.findAndCountAll({
      where: whereClause,
      include: [
        { model: ZCoa, as: 'account', attributes: ['id', 'acName','city'] },
        // Corrected: Nested include for ZItems within Order_Detail
        {
          model: Order_Detail,
          as: 'details',
          include: [{
            model: ZItems,
            as: 'item',
            include: [{ model: Uom, as: 'uom1' }, { model: Uom, as: 'uomTwo' }, { model: Uom, as: 'uomThree' }],
            attributes: ['id', 'itemName']
          }]
        },
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
    console.error('Failed to fetch orders:', error); // Log the full error for debugging
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};




const getOrderById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await Order_Main.findByPk(id, {
      include: [
        {
          model: Order_Detail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item', include: [{ model: Uom, as: 'uom1' }, { model: Uom, as: 'uomTwo' }, { model: Uom, as: 'uomThree' }]}
          ]
        },
        { model: ZCoa, as: 'account' }
      ]
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

const updateCompleteOrder = async (req, res) => {
  const { id } = req.params;
  const { master, details } = req.body;
  
  const transaction = await sequelize.transaction();
  
  try {
    // Check if order exists
    const existingOrder = await Order_Main.findByPk(id);
    if (!existingOrder) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update master
    await Order_Main.update(master, {
      where: { ID: id },
      transaction
    });
    
    // Delete old details
    await Order_Detail.destroy({
      where: { Order_Main_Id: id },
      transaction
    });
    
    // Create new details
    // Old code (before sale_unit):
    // const orderDetails = details.map((detail, index) => ({
    //   ...detail,
    //   Order_Main_Id: id,
    //   Line_Id: index + 1
    // }));
    // New code: include all UOM quantities and sale_unit from frontend
    const orderDetails = details.map((detail, index) => ({
      ...detail,
      Order_Main_Id: id,
      Line_Id: index + 1,
      uom1_qty: detail.uom1_qty || 0,
      uom2_qty: detail.uom2_qty || 0,
      uom3_qty: detail.uom3_qty || 0,
      sale_unit: detail.sale_unit || null
    }));
    await Order_Detail.bulkCreate(orderDetails, { 
      transaction,
      validate: true 
    });
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

const deleteCompleteOrder = async (req, res) => {
  const { id } = req.params;
  
  const transaction = await sequelize.transaction();
  
  try {
    // Check if order exists
    const existingOrder = await Order_Main.findByPk(id);
    if (!existingOrder) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Delete details first (due to foreign key)
    await Order_Detail.destroy({
      where: { Order_Main_Id: id },
      transaction
    });
    
    // Delete master
    await Order_Main.destroy({
      where: { ID: id },
      transaction
    });
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

module.exports = {
  createCompleteOrder,
  getAllOrders,
  getOrderById,
  updateCompleteOrder,
  deleteCompleteOrder
};
