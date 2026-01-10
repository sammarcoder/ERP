const db = require('../models');
const { Order_Main, Order_Detail, ZItems, Uom, ZCoa, Stk_main, Ztransporter } = db;
const sequelize = db.sequelize;


// FIXED: Use correct Stock_Type_ID values (11 = PO, 12 = SO)
// const generateOrderNumber = async (stockTypeId) => {
//   const prefix = stockTypeId === 11 ? 'PO' : 'SO'; // FIXED: 11 for PO, 12 for SO
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

const generateOrderNumber = async (stockTypeId) => {
  const prefix = stockTypeId === 11 ? 'PO' : 'SO'; // 11 = PO, 12 = SO

  const lastOrder = await Order_Main.findOne({
    where: { Stock_Type_ID: stockTypeId },
    order: [['createdAt', 'DESC']]
  });

  let sequence = 1;

  if (lastOrder && lastOrder.Number) {
    // Number format: PO-12 or SO-45
    const lastSequence = parseInt(lastOrder.Number.split('-')[1], 10);
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}-${sequence}`;
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
    console.log('order master data ', master)
    const orderMaster = await Order_Main.create({
      ...master,
      Number: orderNumber
    }, { transaction });

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
//         { model: ZCoa, as: 'account', attributes: ['id', 'acName', 'city'] },
//         // Corrected: Nested include for ZItems within Order_Detail
//         {
//           model: Order_Detail,
//           as: 'details',
//           include: [{
//             model: ZItems,
//             as: 'item',
//             attributes: ['id', 'itemName'],
//             include: [{ model: Uom, as: 'uom1', attributes: ['uom'] },
//             { model: Uom, as: 'uomTwo', attributes: ['uom'] },
//             { model: Uom, as: 'uomThree', attributes: ['uom'] }]

//           },
//           ],
//         }
//         ]
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
//     console.error('Failed to fetch orders:', error); // Log the full error for debugging
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch orders',
//       error: error.message
//     });
//   }
// };

















const getAllOrders = async (req, res) => {
  try {
    const { stockTypeId, status, dateFrom, dateTo, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (stockTypeId) {
      whereClause.Stock_Type_ID = parseInt(stockTypeId); // Parse to integer
    }
    if (status && status !== 'all') {
      whereClause.Next_Status = status;
    }
    if (dateFrom && dateTo) {
      whereClause.Date = {
        [sequelize.Op.between]: [dateFrom, dateTo]
      };
    }

    const { count, rows } = await Order_Main.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', "setupName", 'city', 'mobileNo']
        },
        {
          model: Order_Detail,
          as: 'details',
          include: [{
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
            model: Uom,
            as: 'uom',
            attributes: ['id', 'uom']
          }
          ]
        },
        {model: Ztransporter, as: 'transporter' }

      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true // Important for accurate count with includes
    });

    return res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
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
      // include: [
      //   {
      //     model: Order_Detail,
      //     as: 'details',
      //     include: [
      //       {
      //         model: ZItems, as: 'item', include: [{ model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
      //         // model: ZItems, as: 'item', include: [{ model: Uom, as: 'uom1', attributes: ['uom'] },
      //         { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
      //         { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }]

      //       },

      //       {
      //         model: Uom,
      //         as: 'uom',
      //         attributes: ['id', 'uom']
      //       }
      //     ]

      //   },
      //   { model: ZCoa, as: 'account' },

      // ]
      include: [
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', "setupName", 'city', 'mobileNo']
        },
        {
          model: Order_Detail,
          as: 'details',
          include: [{
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
            model: Uom,
            as: 'uom',
            attributes: ['id', 'uom']
          }
          ]
        },
        {model: Ztransporter, as: 'transporter' }

      ],
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



// ADD THIS: Update order status function



// const deleteCompleteOrder = async (req, res) => {
//   const { id } = req.params;
//   const transaction = await sequelize.transaction();

//   try {
//     const existingOrder = await Order_Main.findByPk(id);
//     if (!existingOrder) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // ✅ ADD: Business rule validation
//     if (existingOrder.is_Note_generated) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete order. GRN/Dispatch note already generated. Delete the note first.'
//       });
//     }

//     // Check if any line items have been transferred
//     const transferredItems = await Order_Detail.findOne({
//       where: {
//         Order_Main_Id: id,
//         trade: true
//       },
//       transaction
//     });

//     if (transferredItems) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete order. Some items have already been transferred.'
//       });
//     }

//     // Delete details first (foreign key constraint)
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


























// controllers/orderController.js - UPDATE DELETE FUNCTION






const deleteCompleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ADD THIS: Check if order has stock transactions
    const order = await Order_Main.findByPk(id, {
      include: [{
        model: Stk_main,
        as: 'stockTransactions'
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // ✅ ADD THIS: Business rule check
    if (order.stockTransactions && order.stockTransactions.length > 0) {
      const stockType = order.Stock_Type_ID === 11 ? 'GRN' : 'GDN';
      const stockNumbers = order.stockTransactions.map(st => st.Number).join(', ');

      return res.status(400).json({
        success: false,
        message: `Cannot delete order ${order.Number}. ${stockType} records exist: ${stockNumbers}. Please delete the ${stockType} records first.`,
      });
    }

    // ✅ REST OF DELETE LOGIC REMAINS THE SAME
    await Order_Main.destroy({ where: { ID: id } });

    return res.status(200).json({
      success: true,
      message: `Order deleted successfully`
    });

  } catch (error) {
    // ✅ ADD THIS: Handle foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete order due to related records. Please delete GRN/GDN records first.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

















// const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     // Validate status
//     if (!['Incomplete', 'Complete', 'Partial'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Use: Incomplete, Complete, or Partial'
//       });
//     }

//     // Check if order exists
//     const order = await Order_Main.findByPk(id);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Update status
//     const [updatedRows] = await Order_Main.update(
//       { Next_Status: status },
//       { where: { ID: id } }
//     );

//     if (updatedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Failed to update order status'
//       });
//     }

//     // Return updated order
//     const updatedOrder = await Order_Main.findByPk(id, {
//       include: [
//         { model: ZCoa, as: 'account', attributes: ['id', 'acName'] }
//       ]
//     });

//     return res.status(200).json({
//       success: true,
//       message: `Order status updated to ${status}`,
//       data: updatedOrder
//     });
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to update order status',
//       error: error.message
//     });
//   }
// };


// controllers/orderController.js - SIMPLIFIED WITHOUT TRANSPORTER






const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approved, is_Note_generated } = req.body;

    console.log('📝 Order Status Update Request:', {
      orderId: id,
      status,
      approved,
      is_Note_generated
    });

    // Check if order exists
    const order = await Order_Main.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Prepare update object
    const updateData = {};

    if (status !== undefined) {
      const validStatuses = ['Incomplete', 'Complete', 'Pending', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }
      updateData.Next_Status = status;
    }

    if (approved !== undefined) {
      const approvedValue = parseInt(approved);
      if (![0, 1].includes(approvedValue)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid approval value. Use: 0 or 1'
        });
      }
      updateData.approved = approvedValue;
    }

    if (is_Note_generated !== undefined) {
      const noteValue = parseInt(is_Note_generated);
      if (![0, 1].includes(noteValue)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid note generated value. Use: 0 or 1'
        });
      }
      updateData.is_Note_generated = noteValue;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    console.log('💾 Updating order with data:', updateData);

    // Update order
    const [updatedRows] = await Order_Main.update(updateData, {
      where: { ID: id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update order'
      });
    }

    // ✅ SIMPLIFIED: Get updated order WITHOUT transporter
    const updatedOrder = await Order_Main.findByPk(id, {
      include: [
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', 'city']
        }
        // ✅ REMOVED: No transporter include needed for status updates
      ]
    });

    // Check if order can generate GRN/GDN
    const canGenerateNote = updatedOrder.approved === 1 &&
      updatedOrder.Next_Status === 'Incomplete' &&
      updatedOrder.is_Note_generated === 0;

    console.log('✅ Order updated successfully:', {
      orderId: id,
      updatedFields: updateData,
      canGenerateNote
    });

    // Prepare response message
    let message = 'Order updated successfully';
    if (approved !== undefined) {
      message = approved == 1 ? 'Order approved successfully' : 'Order rejected successfully';
    } else if (status !== undefined) {
      message = `Order status updated to ${status}`;
    }

    return res.status(200).json({
      success: true,
      message,
      data: {
        ...updatedOrder.toJSON(),
        canGenerateNote,
        permissions: {
          canApprove: updatedOrder.approved === 0,
          canReject: updatedOrder.approved === 1,
          canGenerateGRN: canGenerateNote && updatedOrder.Stock_Type_ID === 11,
          canGenerateGDN: canGenerateNote && updatedOrder.Stock_Type_ID === 12
        }
      }
    });

  } catch (error) {
    console.error('❌ Error updating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};















module.exports = {
  createCompleteOrder,
  getAllOrders,
  getOrderById,
  updateCompleteOrder,
  deleteCompleteOrder,
  updateOrderStatus,
};
