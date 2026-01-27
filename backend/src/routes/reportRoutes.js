

const express = require('express');
const router = express.Router();
const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Order_Detail, Uom, Ztransporter, JournalMaster, JournalDetail } = require('../models');
const { Op, where } = require('sequelize');
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



//   try {
//     // Simplified join to avoid alias parsing issues from exported SQL
//     const sql = `
//       SELECT jm.*, jd.*, zv.*, zc.*, zcoa.*, zt.*
//       FROM journalmaster jm
//       LEFT JOIN journaldetail jd ON jm.id = jd.jmId
//       LEFT JOIN zvouchertype zv ON jm.voucherTypeId = zv.id
//       LEFT JOIN zcurrencies zc ON jd.currencyId = zc.id
//       LEFT JOIN zcoas zcoa ON jd.coaId = zcoa.id
//       LEFT JOIN ztransporter zt ON zcoa.Transporter_ID = zt.id
//       LIMIT 1048575
//     `;

//     const rows = await db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT });
//     res.json({ success: true, data: rows });
//   } catch (err) {
//     console.error('❌ /journal-master-raw error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


router.get('/journal-master-raw', async (req, res) => {
  try {
    const sql = `
SELECT
  journalmaster.id AS id,
  journalmaster.date AS date,
  journalmaster.stk_Main_ID AS stk_Main_ID,
  journalmaster.voucherTypeId AS voucherTypeId,
  journalmaster.voucherNo AS voucherNo,
  journalmaster.balacingId AS balacingId,
  journalmaster.status AS status,
  journalmaster.isOpening AS isOpening,
  journalmaster.createdAt AS createdAt,
  journalmaster.updatedAt AS updatedAt,

  Journaldetail.id AS Journaldetail__id,
  Journaldetail.jmId AS Journaldetail__jmId,
  Journaldetail.lineId AS Journaldetail__lineId,
  Journaldetail.coaId AS Journaldetail__coaId,
  Journaldetail.description AS Journaldetail__description,
  Journaldetail.chqNo AS Journaldetail__chqNo,
  Journaldetail.recieptNo AS Journaldetail__recieptNo,
  Journaldetail.ownDb AS Journaldetail__ownDb,
  Journaldetail.ownCr AS Journaldetail__ownCr,
  Journaldetail.rate AS Journaldetail__rate,
  Journaldetail.amountDb AS Journaldetail__amountDb,
  Journaldetail.amountCr AS Journaldetail__amountCr,
  Journaldetail.isCost AS Journaldetail__isCost,
  Journaldetail.currencyId AS Journaldetail__currencyId,
  Journaldetail.status AS Journaldetail__status,
  Journaldetail.createdAt AS Journaldetail__createdAt,
  Journaldetail.updatedAt AS Journaldetail__updatedAt,
  Journaldetail.idCard AS Journaldetail__idCard,
  Journaldetail.bank AS Journaldetail__bank,
  Journaldetail.bankDate AS Journaldetail__bankDate,

  Zvouchertype_VoucherTypeId.id AS Zvouchertype__id,
  Zvouchertype_VoucherTypeId.vType AS Zvouchertype__vType,
  Zvouchertype_VoucherTypeId.createdAt AS Zvouchertype__createdAt,
  Zvouchertype_VoucherTypeId.updatedAt AS Zvouchertype__updatedAt,

  Zcurrencies_CurrencyId.id AS Zcurrencies__id,
  Zcurrencies_CurrencyId.currencyName AS Zcurrencies__currencyName,

  Zcoas_CoaId.id AS Zcoas__id,
  Zcoas_CoaId.acName AS Zcoas__acName,
  Zcoas_CoaId.Transporter_ID AS Zcoas__Transporter_ID,

  Ztransporter_Transporter.id AS Ztransporter__id,
  Ztransporter_Transporter.name AS Ztransporter__name

FROM journalmaster

LEFT JOIN (
  SELECT * FROM journaldetail
) AS Journaldetail
  ON journalmaster.id = Journaldetail.jmId

LEFT JOIN (
  SELECT * FROM zvouchertype
) AS Zvouchertype_VoucherTypeId
  ON journalmaster.voucherTypeId = Zvouchertype_VoucherTypeId.id

LEFT JOIN (
  SELECT * FROM zcurrencies
) AS Zcurrencies_CurrencyId
  ON Journaldetail.currencyId = Zcurrencies_CurrencyId.id

LEFT JOIN (
  SELECT * FROM zcoas
) AS Zcoas_CoaId
  ON Journaldetail.coaId = Zcoas_CoaId.id

LEFT JOIN (
  SELECT * FROM ztransporter
) AS Ztransporter_Transporter
  ON Zcoas_CoaId.Transporter_ID = Ztransporter_Transporter.id

LIMIT 1048575;
`;

    const rows = await db.sequelize.query(sql, {
      type: db.sequelize.QueryTypes.SELECT
    });

    res.json({ success: true, data: rows });

  } catch (err) {
    console.error('❌ journal-master-raw error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});




















// router.get('/get', async (req,res) => {
//   try {
//     const lastEntry = await JournalMaster.findOne({
//       where: {
//         voucherTypeID: 10
//       },
//       // Order by primary key or timestamp descending to get the latest
//       order: [
//         ['id', 'DESC'] // Assuming 'id' is the primary key
//       ]
//     });

//     if(lastEntry) {
//       console.log('Last Entry:', lastEntry.toJSON());
//       res.json({ success: true, data: lastEntry });
//     } else {
//       console.log('No entries found for voucherTypeID: 10');
//       return null;
//     }
//   } catch(error) {
//     console.error('Error fetching entry:', error);
//   }
// })






router.get('/reports/get_BF_RF', async (req, res) => {
  try {
    // Step 1: Get the last Journal Voucher entry
    const lastEntry = await JournalMaster.findOne({
      where: {
        voucherTypeId: 10
      },
      order: [['id', 'DESC']]
    });

    if (!lastEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'No Journal Voucher entries found' 
      });
    }

    console.log('Last JV Entry:', lastEntry.toJSON());

    // Step 2: Extract the date
    const lastDate = lastEntry.date;

    // Step 3: Get ALL JournalMaster entries UP TO that date (all voucher types)
    const allEntries = await JournalMaster.findAll({
      where: {
        date: {
          [Op.lte]: lastDate  // Less than or equal to last date
        },
        is_partially_deleted: false
      },
      attributes: ['id', 'date', 'voucherTypeId'],
      include: [{
        model: JournalDetail,
        as: 'details',
        where: { coaId:req.query.coaId ? req.query.coaId : { [Op.ne]: null } },
        required: false,
        attributes: ['id','description', 'jmId', 'coaId', 'amountDb', 'amountCr']
      }],
      order: [['date', 'ASC'], ['id', 'ASC']]
    });

    console.log(`Found ${allEntries.length} entries up to date: ${lastDate}`);

    res.json({ 
      success: true, 
      upToDate: lastDate,
      count: allEntries.length,
      data: allEntries 
    });

  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching entries',
      error: error.message 
    });
  }
});



module.exports = router;