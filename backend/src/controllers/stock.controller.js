

// const db = require('../models');
// const { Order_Main, Order_Detail, ZItems, Uom, ZCoa } = db;
// const sequelize = db.sequelize;

// // Generate Order Number
// const generateOrderNumber = async (stockTypeId) => {
//   const prefix = stockTypeId === 1 ? 'PO' : 'SO';
//   const year = new Date().getFullYear();
//   const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
//   const lastOrder = await Order_Main.findOne({
//     where: { Stock_Type_ID: stockTypeId },
//     order: [['createdAt', 'DESC']]
//   });
  
//   let sequence = 1;
//   if (lastOrder && lastOrder.Number) {
//     const lastSequence = parseInt(lastOrder.Number.split('-').pop());
//     sequence = lastSequence + 1;
//   }
  
//   return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
// };

// const createCompleteOrder = async (req, res) => {
//   const { master, details } = req.body;
  
//   if (!master || !details || details.length === 0) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Master and details are required' 
//     });
//   }
  
//   const transaction = await sequelize.transaction();
  
//   try {
//     // Generate order number
//     const orderNumber = await generateOrderNumber(master.Stock_Type_ID);
    
//     // Create master with generated number
//     const orderMaster = await Order_Main.create({
//       ...master,
//       Number: orderNumber
//     }, { transaction });
    
//     // Add master ID to details and ensure Line_Id is sequential
//     const orderDetails = details.map((detail, index) => ({
//       ...detail,
//       Order_Main_Id: orderMaster.ID,
//       Line_Id: index + 1
//     }));
    
//     // Create details
//     const createdDetails = await Order_Detail.bulkCreate(orderDetails, { 
//       transaction,
//       validate: true 
//     });
    
//     await transaction.commit();
    
//     // Fetch complete order with associations
//     const completeOrder = await Order_Main.findByPk(orderMaster.ID, {
//       include: [
//         {
//           model: Order_Detail,
//           as: 'details',
//           include: [
//             { model: ZItems, as: 'item' }
//           ]
//         },
//         { model: ZCoa, as: 'account' }
//       ]
//     });
    
//     return res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       data: completeOrder
//     });
    
//   } catch (error) {
//     await transaction.rollback();
    
//     if (error.name === 'SequelizeForeignKeyConstraintError') {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid reference: ${error.message}`
//       });
//     }
    
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to create order',
//       error: error.message
//     });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const { stockTypeId, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
    
//     const whereClause = {};
//     if (stockTypeId) whereClause.Stock_Type_ID = stockTypeId;
    
//     const { count, rows } = await Order_Main.findAndCountAll({
//       where: whereClause,
//       include: [
//         { model: ZCoa, as: 'account', attributes: ['id', 'acName'] }
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

// const getOrderById = async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     const order = await Order_Main.findByPk(id, {
//       include: [
//         {
//           model: Order_Detail,
//           as: 'details',
//           include: [
//             { model: ZItems, as: 'item' }
//           ]
//         },
//         { model: ZCoa, as: 'account' }
//       ]
//     });
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }
    
//     return res.status(200).json({
//       success: true,
//       data: order
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch order',
//       error: error.message
//     });
//   }
// };

// const updateCompleteOrder = async (req, res) => {
//   const { id } = req.params;
//   const { master, details } = req.body;
  
//   const transaction = await sequelize.transaction();
  
//   try {
//     // Check if order exists
//     const existingOrder = await Order_Main.findByPk(id);
//     if (!existingOrder) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }
    
//     // Update master
//     await Order_Main.update(master, {
//       where: { ID: id },
//       transaction
//     });
    
//     // Delete old details
//     await Order_Detail.destroy({
//       where: { Order_Main_Id: id },
//       transaction
//     });
    
//     // Create new details
//     const orderDetails = details.map((detail, index) => ({
//       ...detail,
//       Order_Main_Id: id,
//       Line_Id: index + 1
//     }));
    
//     await Order_Detail.bulkCreate(orderDetails, { 
//       transaction,
//       validate: true 
//     });
    
//     await transaction.commit();
    
//     return res.status(200).json({
//       success: true,
//       message: 'Order updated successfully'
//     });
//   } catch (error) {
//     await transaction.rollback();
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to update order',
//       error: error.message
//     });
//   }
// };

// const deleteCompleteOrder = async (req, res) => {
//   const { id } = req.params;
  
//   const transaction = await sequelize.transaction();
  
//   try {
//     // Check if order exists
//     const existingOrder = await Order_Main.findByPk(id);
//     if (!existingOrder) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }
    
//     // Delete details first (due to foreign key)
//     await Order_Detail.destroy({
//       where: { Order_Main_Id: id },
//       transaction
//     });
    
//     // Delete master
//     await Order_Main.destroy({
//       where: { ID: id },
//       transaction
//     });
    
//     await transaction.commit();
    
//     return res.status(200).json({
//       success: true,
//       message: 'Order deleted successfully'
//     });
//   } catch (error) {
//     await transaction.rollback();
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to delete order',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   createCompleteOrder,
//   getAllOrders,
//   getOrderById,
//   updateCompleteOrder,
//   deleteCompleteOrder
// };













































const db = require('../models');
const { StockMain, StockDetail, ZItems, Uom, ZCoa, ZvoucherType } = db;
const sequelize = db.sequelize;

// Generate Stock Number
const generateStockNumber = async (stockTypeId) => {
  const prefix = stockTypeId === 1 ? 'STK-IN' : 'STK-OUT';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  const lastStock = await StockMain.findOne({
    where: { stockTypeId: stockTypeId }, // Fixed: was Stock_Type_ID
    order: [['createdAt', 'DESC']]
  });
  
  let sequence = 1;
  if (lastStock && lastStock.number) { // Fixed: was Number
    const lastSequence = parseInt(lastStock.number.split('-').pop());
    sequence = lastSequence + 1;
  }
  
  return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

const createCompleteStock = async (req, res) => {
  const { master, details } = req.body;
  
  if (!master || !details || details.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Master and details are required' 
    });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    // Check if the stockTypeId exists - REMOVE THIS CHECK if you don't want it
    const voucherType = await ZvoucherType.findByPk(master.stockTypeId);
    if (!voucherType) {
      // First, let's create the voucher types if they don't exist
      await ZvoucherType.bulkCreate([
        { id: 1, vType: 'Stock In', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, vType: 'Stock Out', createdAt: new Date(), updatedAt: new Date() }
      ], { ignoreDuplicates: true });
    }
    
    // Generate stock number
    const stockNumber = await generateStockNumber(master.stockTypeId);
    
    // Create master with generated number
    const stockMaster = await StockMain.create({
      ...master,
      number: stockNumber // Fixed: was Number
    }, { transaction });
    
    // Add master ID to details and ensure lineId is sequential
    const stockDetails = details.map((detail, index) => ({
      ...detail,
      stkMainId: stockMaster.id, // Fixed: was STK_Main_ID and ID
      lineId: index + 1 // Fixed: was Line_Id
    }));
    
    // Create details
    const createdDetails = await StockDetail.bulkCreate(stockDetails, { 
      transaction,
      validate: true 
    });
    
    await transaction.commit();
    
    // Fetch complete stock with associations
    const completeStock = await StockMain.findByPk(stockMaster.id, { // Fixed: was ID
      include: [
        {
          model: StockDetail,
          as: 'stockDetails',
          include: [
            { model: ZItems, as: 'stock_item' }
          ]
        },
        { model: ZCoa, as: 'mainAccount' }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      data: completeStock
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
    if (stockTypeId) whereClause.stockTypeId = stockTypeId; // Fixed: was Stock_Type_ID
    
    const { count, rows } = await StockMain.findAndCountAll({
      where: whereClause,
      include: [
        { model: ZCoa, as: 'account', attributes: ['id', 'acName'] }
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
    const stock = await StockMain.findByPk(id, {
      include: [
        {
          model: StockDetail,
          as: 'stockDetails',
          include: [
            { model: ZItems, as: 'stock_item' }
          ]
        },
        { model: ZCoa, as: 'mainAccount' }
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
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stock',
      error: error.message
    });
  }
};

const updateCompleteStock = async (req, res) => {
  const { id } = req.params;
  const { master, details } = req.body;
  
  const transaction = await sequelize.transaction();
  
  try {
    // Check if stock exists
    const existingStock = await StockMain.findByPk(id);
    if (!existingStock) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }
    
    // Update master
    await StockMain.update(master, {
      where: { id: id }, // Fixed: was ID
      transaction
    });
    
    // Delete old details
    await StockDetail.destroy({
      where: { stkMainId: id }, // Fixed: was STK_Main_ID
      transaction
    });
    
    // Create new details
    const stockDetails = details.map((detail, index) => ({
      ...detail,
      stkMainId: id, // Fixed: was STK_Main_ID
      lineId: index + 1 // Fixed: was Line_Id
    }));
    
    await StockDetail.bulkCreate(stockDetails, { 
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
    // Check if stock exists
    const existingStock = await StockMain.findByPk(id);
    if (!existingStock) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }
    
    // Delete details first (due to foreign key)
    await StockDetail.destroy({
      where: { stkMainId: id }, // Fixed: was STK_Main_ID
      transaction
    });
    
    // Delete master
    await StockMain.destroy({
      where: { id: id }, // Fixed: was ID
      transaction
    });
    
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Stock deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: 'Failed to delete stock',
      error: error.message
    });
  }
};

module.exports = {
  createCompleteStock,
  getAllStock,
  getStockById,
  updateCompleteStock,
  deleteCompleteStock
};