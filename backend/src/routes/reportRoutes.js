
// const express = require('express');
// const router = express.Router();
// const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Order_Detail, Uom, Ztransporter } = require('../models');
// const { Op } = require('sequelize');
// // const sequelize = require('../config/database');
// const db = require('../models');




// // GET Item Order vs Dispatch Report (Order-wise)
// router.get('/item-order-dispatch', async (req, res) => {
//   try {
//     const { dateFrom, dateTo, uom, coaId, itemIds } = req.query;

//     // ✅ Validate required fields
//     if (!dateFrom || !dateTo || !uom) {
//       return res.status(400).json({
//         success: false,
//         error: 'dateFrom, dateTo, and uom are required'
//       });
//     }

//     // ✅ Parse itemIds if provided
//     const itemIdArray = itemIds ? itemIds.split(',').map(id => parseInt(id)) : null;

//     // ✅ Build where clause for Orders (filter by ORDER date)
//     const orderWhere = {
//       Next_Status: 'partial',
//       approved: 1,
//       Stock_Type_ID: 12,
//       Date: {
//         [Op.between]: [dateFrom, dateTo]
//       }
//     };

//     // ✅ Filter by customer if provided
//     if (coaId) {
//       orderWhere.COA_ID = parseInt(coaId);
//     }

//     // ✅ Build detail where clause for items filter
//     const detailWhere = itemIdArray ? { Item_ID: { [Op.in]: itemIdArray } } : {};

//     // ✅ Get Orders WITH their linked Stock Transactions (GDNs)
//     const orders = await Order_Main.findAll({
//       where: orderWhere,
//       attributes: ['ID', 'Number', 'Date', 'COA_ID', 'Next_Status', 'sub_customer', 'sub_city'],
//       include: [
//         {
//           model: Order_Detail,
//           as: 'details',
//           where: Object.keys(detailWhere).length > 0 ? detailWhere : undefined,
//           required: Object.keys(detailWhere).length > 0,
//           attributes: ['ID', 'Item_ID', 'uom1_qty', 'uom2_qty', 'uom3_qty'],
//           include: [
//             {
//               model: ZItems,
//               as: 'item',
//               attributes: ['id', 'itemName'],
//               include: [
//                 { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
//                 { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
//                 { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
//               ]
//             }
//           ]
//         },
//         {
//           // ✅ Include linked Stock Transactions (GDN)
//           model: Stk_main,
//           as: 'stockTransactions',
//           attributes: ['ID', 'Number', 'Date', 'Status', 'Stock_Type_ID'],
//           required: false,
//           include: [
//             {
//               model: Stk_Detail,
//               as: 'details',
//               attributes: ['ID', 'Item_ID', 'uom1_qty', 'uom2_qty', 'uom3_qty']
//             }
//           ]
//         },
//         {
//           model: ZCoa,
//           as: 'account',
//           attributes: ['id', 'acName', 'city']
//         }
//       ],
//       order: [['Date', 'DESC'], ['Number', 'ASC']]
//     });

//     console.log('📦 Orders found:', orders.length);

//     // ✅ Build order-wise report data
//     const reportData = orders.map(order => {
//       const orderNumber = order.Number;
//       const orderId = order.ID;
//       const customerName = order.account?.acName || 'Unknown';
//       const customerCity = order.account?.city || '';
//       const subCustomer = order.sub_customer || '';
//       const subCity = order.sub_city || '';
//       const orderDate = order.Date;
//       const orderStatus = order.Next_Status || 'Pending';

//       // ✅ Get all dispatched quantities from linked stock transactions
//       const dispatchedByItem = {};
//       const gdnNumbers = [];

//       order.stockTransactions?.forEach(stk => {
//         if (stk.Number) gdnNumbers.push(stk.Number);

//         stk.details?.forEach(stkDetail => {
//           const itemId = stkDetail.Item_ID;
//           if (!dispatchedByItem[itemId]) {
//             dispatchedByItem[itemId] = {
//               qty1: 0,
//               qty2: 0,
//               qty3: 0
//             };
//           }
//           dispatchedByItem[itemId].qty1 += parseFloat(stkDetail.uom1_qty) || 0;
//           dispatchedByItem[itemId].qty2 += parseFloat(stkDetail.uom2_qty) || 0;
//           dispatchedByItem[itemId].qty3 += parseFloat(stkDetail.uom3_qty) || 0;
//         });
//       });

//       // ✅ Build items array for this order
//       const items = order.details?.map(detail => {
//         const itemId = detail.Item_ID;
//         const itemName = detail.item?.itemName || 'Unknown';

//         // Get qty based on selected UOM
//         let orderQty = 0, dispatchQty = 0, uomName = '';

//         if (uom === '1') {
//           orderQty = parseFloat(detail.uom1_qty) || 0;
//           dispatchQty = dispatchedByItem[itemId]?.qty1 || 0;
//           uomName = detail.item?.uom1?.uom || 'Pcs';
//         } else if (uom === '2') {
//           orderQty = parseFloat(detail.uom2_qty) || 0;
//           dispatchQty = dispatchedByItem[itemId]?.qty2 || 0;
//           uomName = detail.item?.uomTwo?.uom || 'Box';
//         } else if (uom === '3') {
//           orderQty = parseFloat(detail.uom3_qty) || 0;
//           dispatchQty = dispatchedByItem[itemId]?.qty3 || 0;
//           uomName = detail.item?.uomThree?.uom || 'Crt';
//         }

//         const difference = orderQty - dispatchQty;

//         // Determine status
//         let status = 'Complete';
//         if (orderQty > 0 && dispatchQty === 0) status = 'Pending';
//         else if (dispatchQty > 0 && orderQty === 0) status = 'Over Dispatch';
//         else if (difference > 0) status = 'Partial';
//         else if (difference < 0) status = 'Over Dispatch';

//         return {
//           itemId,
//           itemName,
//           orderQty: Math.trunc(orderQty),
//           dispatchQty: Math.trunc(dispatchQty),
//           difference: Math.trunc(difference),
//           uomName,
//           status
//         };
//       }) || [];

//       // ✅ Calculate order totals
//       const orderTotals = {
//         totalOrderQty: items.reduce((sum, item) => sum + item.orderQty, 0),
//         totalDispatchQty: items.reduce((sum, item) => sum + item.dispatchQty, 0),
//         totalDifference: items.reduce((sum, item) => sum + item.difference, 0)
//       };

//       return {
//         orderId,
//         orderNumber,
//         orderDate,
//         orderStatus,
//         customerName,
//         customerCity,
//         subCustomer,
//         subCity,
//         gdnNumbers,
//         items,
//         orderTotals
//       };
//     });

//     // ✅ Calculate grand totals
//     const grandTotals = {
//       totalOrders: reportData.length,
//       totalOrderQty: reportData.reduce((sum, o) => sum + o.orderTotals.totalOrderQty, 0),
//       totalDispatchQty: reportData.reduce((sum, o) => sum + o.orderTotals.totalDispatchQty, 0),
//       totalDifference: reportData.reduce((sum, o) => sum + o.orderTotals.totalDifference, 0)
//     };

//     res.json({
//       success: true,
//       data: reportData,
//       grandTotals,
//       filters: {
//         dateFrom,
//         dateTo,
//         uom,
//         coaId: coaId || null,
//         itemIds: itemIdArray || []
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error generating report:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });


// module.exports = router;






































const express = require('express');
const router = express.Router();
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Order_Detail, Uom, Ztransporter } = require('../models');
const { Op } = require('sequelize');
// const sequelize = require('../config/database');
const db = require('../models');





// GET Item Order vs Dispatch Report (Customer-wise)
router.get('/item-order-dispatch', async (req, res) => {
  try {
    const { dateFrom, dateTo, uom, coaId, itemIds } = req.query;

    // ✅ Validate required fields
    if (!dateFrom || !dateTo || !uom) {
      return res.status(400).json({
        success: false,
        error: 'dateFrom, dateTo, and uom are required'
      });
    }

    // ✅ Parse itemIds if provided
    const itemIdArray = itemIds ? itemIds.split(',').map(id => parseInt(id)) : null;

    // ✅ Build where clause for Sales Orders
    const orderWhere = {
      Stock_Type_ID: 12,  // Sales Orders only
      Date: {
        [Op.between]: [dateFrom, dateTo]
      }
    };
    
    // ✅ Filter by customer if provided
    if (coaId) {
      orderWhere.COA_ID = parseInt(coaId);
    }

    // ✅ Build detail where clause for items filter
    const detailWhere = itemIdArray ? { Item_ID: { [Op.in]: itemIdArray } } : {};

    // ✅ Get Orders WITH their linked Stock Transactions (GDNs)
    const orders = await Order_Main.findAll({
      where: orderWhere,
      attributes: ['ID', 'Number', 'Date', 'COA_ID', 'Next_Status', 'sub_customer', 'sub_city', 'Stock_Type_ID'],
      include: [
        {
          model: Order_Detail,
          as: 'details',
          where: Object.keys(detailWhere).length > 0 ? detailWhere : undefined,
          required: Object.keys(detailWhere).length > 0,
          attributes: ['ID', 'Item_ID', 'uom1_qty', 'uom2_qty', 'uom3_qty'],
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName'],
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
          attributes: ['ID', 'Number', 'Date', 'Status', 'Stock_Type_ID'],
          required: false,
          include: [
            {
              model: Stk_Detail,
              as: 'details',
              attributes: ['ID', 'Item_ID', 'uom1_qty', 'uom2_qty', 'uom3_qty']
            }
          ]
        },
        {
          model: ZCoa,
          as: 'account',
          attributes: ['id', 'acName', 'city']
        }
      ],
      order: [['COA_ID', 'ASC'], ['Date', 'DESC'], ['Number', 'ASC']]
    });

    console.log('📦 Orders found:', orders.length);

    // ✅ Group by Customer
    const customerMap = {};

    orders.forEach(order => {
      const customerId = order.COA_ID;
      const customerName = order.account?.acName || 'Unknown';
      const customerCity = order.account?.city || '';

      // Initialize customer if not exists
      if (!customerMap[customerId]) {
        customerMap[customerId] = {
          customerId,
          customerName,
          customerCity,
          items: [],
          customerTotals: {
            totalOrderQty: 0,
            totalDispatchQty: 0,
            totalDifference: 0
          }
        };
      }

      // Get dispatched quantities from linked stock transactions
      const dispatchedByItem = {};
      
      order.stockTransactions?.forEach(stk => {
        stk.details?.forEach(stkDetail => {
          const itemId = stkDetail.Item_ID;
          if (!dispatchedByItem[itemId]) {
            dispatchedByItem[itemId] = {
              qty1: 0,
              qty2: 0,
              qty3: 0
            };
          }
          dispatchedByItem[itemId].qty1 += parseFloat(stkDetail.uom1_qty) || 0;
          dispatchedByItem[itemId].qty2 += parseFloat(stkDetail.uom2_qty) || 0;
          dispatchedByItem[itemId].qty3 += parseFloat(stkDetail.uom3_qty) || 0;
        });
      });

      // Add items for this order
      order.details?.forEach(detail => {
        const itemId = detail.Item_ID;
        const itemName = detail.item?.itemName || 'Unknown';
        
        // Get qty based on selected UOM
        let orderQty = 0, dispatchQty = 0, uomName = '';
        
        if (uom === '1') {
          orderQty = parseFloat(detail.uom1_qty) || 0;
          dispatchQty = dispatchedByItem[itemId]?.qty1 || 0;
          uomName = detail.item?.uom1?.uom || 'Pcs';
        } else if (uom === '2') {
          orderQty = parseFloat(detail.uom2_qty) || 0;
          dispatchQty = dispatchedByItem[itemId]?.qty2 || 0;
          uomName = detail.item?.uomTwo?.uom || 'Box';
        } else if (uom === '3') {
          orderQty = parseFloat(detail.uom3_qty) || 0;
          dispatchQty = dispatchedByItem[itemId]?.qty3 || 0;
          uomName = detail.item?.uomThree?.uom || 'Crt';
        }

        const difference = orderQty - dispatchQty;
        
        // Determine status
        let status = 'Complete';
        if (orderQty > 0 && dispatchQty === 0) status = 'Pending';
        else if (dispatchQty > 0 && orderQty === 0) status = 'Over Dispatch';
        else if (difference > 0) status = 'Partial';
        else if (difference < 0) status = 'Over Dispatch';

        const truncOrderQty = Math.trunc(orderQty);
        const truncDispatchQty = Math.trunc(dispatchQty);
        const truncDifference = Math.trunc(difference);

        // Add to customer's items
        customerMap[customerId].items.push({
          orderNumber: order.Number,
          orderDate: order.Date,
           orderStatus: order.Next_Status || 'Pending',
          itemId,
          itemName,
          orderQty: truncOrderQty,
          dispatchQty: truncDispatchQty,
          difference: truncDifference,
          uomName,
          status
        });

        // Update customer totals
        customerMap[customerId].customerTotals.totalOrderQty += truncOrderQty;
        customerMap[customerId].customerTotals.totalDispatchQty += truncDispatchQty;
        customerMap[customerId].customerTotals.totalDifference += truncDifference;
      });
    });

    // ✅ Convert to array and sort by customer name
    const reportData = Object.values(customerMap).sort((a, b) => 
      a.customerName.localeCompare(b.customerName)
    );

    // ✅ Calculate grand totals
    const grandTotals = {
      totalCustomers: reportData.length,
      totalOrders: orders.length,
      totalOrderQty: reportData.reduce((sum, c) => sum + c.customerTotals.totalOrderQty, 0),
      totalDispatchQty: reportData.reduce((sum, c) => sum + c.customerTotals.totalDispatchQty, 0),
      totalDifference: reportData.reduce((sum, c) => sum + c.customerTotals.totalDifference, 0)
    };

    res.json({
      success: true,
      data: reportData,
      grandTotals,
      filters: {
        dateFrom,
        dateTo,
        uom,
        coaId: coaId || null,
        itemIds: itemIdArray || []
      }
    });

  } catch (error) {
    console.error('❌ Error generating report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;