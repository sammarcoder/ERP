








const { Stk_main, Stk_Detail, ZItems, ZCoa, Order_Main, Order_Detail, Uom, Ztransporter, Zcurrency, LcMain, LcDetail, ZMasterType,JournalDetail } = require('../models');






// controllers/LcMain.controller.js

// const LcMain = require('../models/LcMain');
// const LcDetail = require('../models/LcDetail');
// const ZCoa = require('../models/zCoa.model');
// const Zcurrency = require('../models/Zcurrency');
// const ZMasterType = require('../models/ZMasterType');
// const ZItems = require('../models/ZItems');
// const Stk_main = require('../models/Stk_main');
// const Stk_Detail = require('../models/Stk_Detail');
// const Uom = require('../models/Uom');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');

// Include options for main queries
const includeOptions = [
  {
    model: ZCoa,
    as: 'lc',
    attributes: ['id', 'acName']
  },
  {
    model: Stk_main,
    as: 'gdn',
    attributes: ['ID', 'Number']
  },
  {
    model: ZMasterType,
    as: 'shipper',
    attributes: ['id', 'actualName', 'type', 'typeName']
  },
  {
    model: ZMasterType,
    as: 'consignee',
    attributes: ['id', 'actualName', 'type', 'typeName']
  },
  {
    model: ZMasterType,
    as: 'bankName',
    attributes: ['id', 'actualName', 'type', 'typeName']
  },
  {
    model: ZMasterType,
    as: 'contactType',
    attributes: ['id', 'actualName', 'type', 'typeName']
  },
  {
    model: ZMasterType,
    as: 'clearingAgent',
    attributes: ['id', 'actualName', 'type', 'typeName']
  },
  {
    model: Zcurrency,
    as: 'currency',
    attributes: ['id', 'currencyName']
  },
  {
    model: LcDetail,
    as: 'details',
    include: [{
      model: ZItems,
      as: 'item',
      attributes: ['id', 'itemName'],
      include: [
        { model: Uom, as: 'uom1', attributes: ['uom'] },
        { model: Uom, as: 'uomTwo', attributes: ['uom'] },
        { model: Uom, as: 'uomThree', attributes: ['uom'] }
      ]
    }]
  }
];

// =============================================
// GET ALL
// =============================================
const getAll = async (req, res) => {
  try {
    const { status, lcId } = req.query;

    const whereClause = {};

    if (status !== undefined) {
      whereClause.status = status === 'true' || status === '1';
    }

    if (lcId) {
      whereClause.lcId = parseInt(lcId);
    }

    const data = await LcMain.findAll({
      where: whereClause,
      include: includeOptions,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching LC Main:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch LC Main records',
      error: error.message
    });
  }
};

// =============================================
// GET USED COA IDS
// =============================================
const getUsedCoaIds = async (req, res) => {
  try {
    const { excludeId } = req.query;

    const whereClause = {};

    if (excludeId) {
      whereClause.id = { [Op.ne]: parseInt(excludeId) };
    }

    const records = await LcMain.findAll({
      where: whereClause,
      attributes: ['lcId'],
      raw: true
    });

    const usedIds = records.map(r => r.lcId);

    res.json({
      success: true,
      data: usedIds
    });

  } catch (error) {
    console.error('Error fetching used COA IDs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch used COA IDs',
      error: error.message
    });
  }
};

// =============================================
// GET BY ID
// =============================================
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await LcMain.findByPk(id, {
      include: includeOptions
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'LC Main record not found'
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching LC Main by id:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch LC Main record',
      error: error.message
    });
  }
};

// =============================================
// GET ALL GDN (by batchno/coaId)
// =============================================
const get_all_gdn = async (req, res) => {
  try {
    const { batchno } = req.query;

    if (!batchno) {
      return res.status(400).json({
        success: false,
        message: 'batchno is required'
      });
    }

    const detailRows = await Stk_Detail.findAll({
      where: { batchno: parseInt(batchno) },
      attributes: ['STK_Main_ID'],
      group: ['STK_Main_ID'],
      order: [['STK_Main_ID', 'DESC']],
      raw: true
    });

    const stkMainIds = detailRows.map(r => r.STK_Main_ID);

    if (stkMainIds.length === 0) {
      return res.json({ success: true, data: [], count: 0 });
    }

    const mainRows = await Stk_main.findAll({
      where: {
        ID: stkMainIds,
        Stock_Type_ID: 11
      },
      attributes: ['ID', 'Number', 'Stock_Type_ID'],
      order: [['ID', 'DESC']]
    });

    res.json({
      success: true,
      data: mainRows,
      count: mainRows.length
    });

  } catch (error) {
    console.error('❌ Error in get_all_gdn:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================
// GET GDN DETAILS
// =============================================
const get_gdn = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'GDN id is required'
      });
    }

    const { count, rows } = await Stk_main.findAndCountAll({
      where: { ID: id },
      attributes: ['ID', 'Number'],
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          attributes: ['ID', 'batchno', 'uom1_qty', 'uom2_qty', 'uom3_qty', 'Item_ID'],
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: [
                'id', 'itemName', 'incomeTaxWithheld', 'cd', 'acd', 'rd',
                'salesTax', 'addSalesTax', 'itaxImport', 'furtherTax',
                'assessedPrice', 'purchasePriceFC'
              ],
              include: [
                { model: Uom, as: 'uom1', attributes: ['uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['uom'] },
                { model: Uom, as: 'uomThree', attributes: ['uom'] }
              ]
            }
          ]
        }
      ],
      order: [['ID', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      count: count
    });

  } catch (error) {
    console.error('❌ Error in get_gdn:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// =============================================
// CREATE
// =============================================
const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const {
      lcId,
      gdnId,
      shipperId,
      consigneeId,
      bankNameId,
      contactTypeId,
      bl,
      container,
      containerCount,
      containerSize,
      inv,
      currencyId,
      amount,
      clearingAgentId,
      gd,
      gdDate,
      exchangeRateDuty,
      exchangeRateDocuments,
      totalExp,
      averageDollarRate,
      paymentDate,
      itemDescription,
      landedCost,
      status = true,
      details = []
    } = req.body;

    if (!lcId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'LC is required'
      });
    }

    // Check LC unique
    const existingLc = await LcMain.findOne({
      where: { lcId },
      transaction
    });

    if (existingLc) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'This LC is already used in another record'
      });
    }

    // Check GDN unique
    if (gdnId) {
      const existingGdn = await LcMain.findOne({
        where: { gdnId },
        transaction
      });

      if (existingGdn) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'This GDN is already linked to another LC Main'
        });
      }
    }

    // Create LC Main
    const lcMain = await LcMain.create({
      lcId,
      gdnId: gdnId || null,
      shipperId: shipperId || null,
      consigneeId: consigneeId || null,
      bankNameId: bankNameId || null,
      contactTypeId: contactTypeId || null,
      bl: bl || null,
      container: container || null,
      containerCount: containerCount || 0,
      containerSize: containerSize || null,
      inv: inv || null,
      currencyId: currencyId || null,
      amount: amount || 0,
      clearingAgentId: clearingAgentId || null,
      gd: gd || null,
      gdDate: gdDate || null,
      exchangeRateDuty: exchangeRateDuty || 0,
      exchangeRateDocuments: exchangeRateDocuments || 0,
      totalExp: totalExp || 0,
      averageDollarRate: averageDollarRate || 0,
      paymentDate: paymentDate || null,
      itemDescription: itemDescription || null,
      landedCost: landedCost || 0,
      status
    }, { transaction });

    // Create LC Details (only stored fields)
    if (details && details.length > 0) {
      const detailRecords = details.map(detail => ({
        lcMainId: lcMain.id,
        itemId: detail.itemId || null,
        cd: detail.cd || 0,
        acd: detail.acd || 0,
        rd: detail.rd || 0,
        salesTax: detail.salesTax || 0,
        addSalesTax: detail.addSalesTax || 0,
        itaxImport: detail.itaxImport || 0,
        furtherTax: detail.furtherTax || 0,
        incomeTaxWithheld: detail.incomeTaxWithheld || 0,
        assessedPrice: detail.assessedPrice || 0,
        priceFC: detail.priceFC || 0,
        assessedQty: detail.assessedQty || 0
      }));

      await LcDetail.bulkCreate(detailRecords, { transaction });
      console.log(`✅ Created ${details.length} LC Details`);
    }

    await transaction.commit();
    committed = true;

    const result = await LcMain.findByPk(lcMain.id, {
      include: includeOptions
    });

    res.status(201).json({
      success: true,
      message: 'LC Main created successfully',
      data: result
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('Error creating LC Main:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'This LC or GDN is already used in another record'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create LC Main record',
      error: error.message
    });
  }
};

// =============================================
// UPDATE
// =============================================
const update = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { id } = req.params;
    const {
      lcId,
      gdnId,
      shipperId,
      consigneeId,
      bankNameId,
      contactTypeId,
      bl,
      container,
      containerCount,
      containerSize,
      inv,
      currencyId,
      amount,
      clearingAgentId,
      gd,
      gdDate,
      exchangeRateDuty,
      exchangeRateDocuments,
      totalExp,
      averageDollarRate,
      paymentDate,
      itemDescription,
      landedCost,
      status
    } = req.body;

    const record = await LcMain.findByPk(id, { transaction });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'LC Main record not found'
      });
    }

    // Check LC unique if changing
    if (lcId && lcId !== record.lcId) {
      const existing = await LcMain.findOne({
        where: { lcId, id: { [Op.ne]: id } },
        transaction
      });

      if (existing) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'This LC is already used in another record'
        });
      }
    }

    // Check GDN unique if changing
    if (gdnId && gdnId !== record.gdnId) {
      const existingGdn = await LcMain.findOne({
        where: { gdnId, id: { [Op.ne]: id } },
        transaction
      });

      if (existingGdn) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'This GDN is already linked to another LC Main'
        });
      }
    }

    await record.update({
      lcId: lcId !== undefined ? lcId : record.lcId,
      gdnId: gdnId !== undefined ? gdnId : record.gdnId,
      shipperId: shipperId !== undefined ? shipperId : record.shipperId,
      consigneeId: consigneeId !== undefined ? consigneeId : record.consigneeId,
      bankNameId: bankNameId !== undefined ? bankNameId : record.bankNameId,
      contactTypeId: contactTypeId !== undefined ? contactTypeId : record.contactTypeId,
      bl: bl !== undefined ? bl : record.bl,
      container: container !== undefined ? container : record.container,
      containerCount: containerCount !== undefined ? containerCount : record.containerCount,
      containerSize: containerSize !== undefined ? containerSize : record.containerSize,
      inv: inv !== undefined ? inv : record.inv,
      currencyId: currencyId !== undefined ? currencyId : record.currencyId,
      amount: amount !== undefined ? amount : record.amount,
      clearingAgentId: clearingAgentId !== undefined ? clearingAgentId : record.clearingAgentId,
      gd: gd !== undefined ? gd : record.gd,
      gdDate: gdDate !== undefined ? gdDate : record.gdDate,
      exchangeRateDuty: exchangeRateDuty !== undefined ? exchangeRateDuty : record.exchangeRateDuty,
      exchangeRateDocuments: exchangeRateDocuments !== undefined ? exchangeRateDocuments : record.exchangeRateDocuments,
      totalExp: totalExp !== undefined ? totalExp : record.totalExp,
      averageDollarRate: averageDollarRate !== undefined ? averageDollarRate : record.averageDollarRate,
      paymentDate: paymentDate !== undefined ? paymentDate : record.paymentDate,
      itemDescription: itemDescription !== undefined ? itemDescription : record.itemDescription,
      landedCost: landedCost !== undefined ? landedCost : record.landedCost,
      status: status !== undefined ? status : record.status
    }, { transaction });

    await transaction.commit();
    committed = true;

    const result = await LcMain.findByPk(id, {
      include: includeOptions
    });

    res.json({
      success: true,
      message: 'LC Main updated successfully',
      data: result
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('Error updating LC Main:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'This LC or GDN is already used in another record'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update LC Main record',
      error: error.message
    });
  }
};

// =============================================
// SYNC DETAILS (PATCH) - Compare by itemId
// =============================================
const syncDetails = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { id } = req.params;
    const { details = [] } = req.body;

    const lcMain = await LcMain.findByPk(id, {
      include: [{ model: LcDetail, as: 'details' }],
      transaction
    });

    if (!lcMain) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'LC Main record not found'
      });
    }

    const existingDetails = lcMain.details || [];
    const existingItemIds = existingDetails.map(d => d.itemId);
    const newItemIds = details.map(d => d.itemId);

    // 1. ADD - items in new but not in existing
    const toAdd = details.filter(d => !existingItemIds.includes(d.itemId));

    // 2. REMOVE - items in existing but not in new
    const toRemove = existingDetails.filter(d => !newItemIds.includes(d.itemId));

    // 3. UPDATE - items in both (compare values)
    const toUpdate = details.filter(d => existingItemIds.includes(d.itemId));

    // Execute ADD
    if (toAdd.length > 0) {
      const addRecords = toAdd.map(detail => ({
        lcMainId: parseInt(id),
        itemId: detail.itemId,
        cd: detail.cd || 0,
        acd: detail.acd || 0,
        rd: detail.rd || 0,
        salesTax: detail.salesTax || 0,
        addSalesTax: detail.addSalesTax || 0,
        itaxImport: detail.itaxImport || 0,
        furtherTax: detail.furtherTax || 0,
        incomeTaxWithheld: detail.incomeTaxWithheld || 0,
        assessedPrice: detail.assessedPrice || 0,
        priceFC: detail.priceFC || 0,
        assessedQty: detail.assessedQty || 0
      }));

      await LcDetail.bulkCreate(addRecords, { transaction });
      console.log(`✅ Added ${toAdd.length} new details`);
    }

    // Execute REMOVE
    if (toRemove.length > 0) {
      const removeIds = toRemove.map(d => d.id);
      await LcDetail.destroy({
        where: { id: { [Op.in]: removeIds }, lcMainId: parseInt(id) },
        transaction
      });
      console.log(`✅ Removed ${toRemove.length} details`);
    }

    // Execute UPDATE
    for (const detail of toUpdate) {
      const existing = existingDetails.find(d => d.itemId === detail.itemId);
      if (existing) {
        await LcDetail.update({
          cd: detail.cd,
          acd: detail.acd,
          rd: detail.rd,
          salesTax: detail.salesTax,
          addSalesTax: detail.addSalesTax,
          itaxImport: detail.itaxImport,
          furtherTax: detail.furtherTax,
          incomeTaxWithheld: detail.incomeTaxWithheld,
          assessedPrice: detail.assessedPrice,
          priceFC: detail.priceFC,
          assessedQty: detail.assessedQty
        }, {
          where: { id: existing.id, lcMainId: parseInt(id) },
          transaction
        });
      }
    }
    console.log(`✅ Updated ${toUpdate.length} details`);

    await transaction.commit();
    committed = true;

    const result = await LcMain.findByPk(id, {
      include: includeOptions
    });

    res.json({
      success: true,
      message: 'LC Details synced successfully',
      data: result,
      summary: {
        added: toAdd.length,
        removed: toRemove.length,
        updated: toUpdate.length
      }
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('Error syncing LC Details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync LC Details',
      error: error.message
    });
  }
};

// =============================================
// DELETE
// =============================================
const remove = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { id } = req.params;

    const record = await LcMain.findByPk(id, { transaction });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'LC Main record not found'
      });
    }

    await LcDetail.destroy({
      where: { lcMainId: id },
      transaction
    });

    await record.destroy({ transaction });

    await transaction.commit();
    committed = true;

    res.json({
      success: true,
      message: 'LC Main deleted successfully'
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('Error deleting LC Main:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete LC Main record',
      error: error.message
    });
  }
};

// =============================================
// TOGGLE STATUS
// =============================================
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await LcMain.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'LC Main record not found'
      });
    }

    await record.update({ status: !record.status });

    const result = await LcMain.findByPk(id, {
      include: includeOptions
    });

    res.json({
      success: true,
      message: `LC Main status updated to ${result.status ? 'Active' : 'Inactive'}`,
      data: result
    });

  } catch (error) {
    console.error('Error toggling LC Main status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: error.message
    });
  }
};









// =============================================
// GET JOURNAL DETAILS BY COA ID
// =============================================
const getJournalDetailsByCoa = async (req, res) => {
  try {
    const { coaId } = req.query;

    if (!coaId) {
      return res.status(400).json({
        success: false,
        message: 'coaId is required'
      });
    }

    const details = await JournalDetail.findAll({
      where: {
        coaId: parseInt(coaId),
        amountDb: { [Op.gt]: 0 }  // amountDb > 0
      },
      attributes: ['id', 'jmId', 'lineId', 'coaId', 'description', 'rate', 'ownDb', 'amountDb', 'isCost', 'currencyId'],
      include: [
        {
          model: ZCoa,
          as: 'coa',
          attributes: ['id', 'acName']
        },
        {
          model: Zcurrency,
          as: 'currency',
          attributes: ['id', 'currencyName']
        }
      ],
      order: [['id', 'ASC']]
    });

    console.log(`✅ Found ${details.length} journal details for coaId=${coaId} with amountDb > 0`);

    res.json({
      success: true,
      data: details,
      count: details.length
    });

  } catch (error) {
    console.error('❌ Error fetching journal details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journal details',
      error: error.message
    });
  }
};

// =============================================
// UPDATE JOURNAL DETAILS
// =============================================
const updateJournalDetails = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { updates = [] } = req.body;

    if (!updates || updates.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No updates provided'
      });
    }

    

    let updatedCount = 0;

    for (const item of updates) {
      if (!item.id) continue;

      const updateData = {};

      if (item.description !== undefined) updateData.description = item.description;
      if (item.rate !== undefined) updateData.rate = parseFloat(item.rate) || 0;
      if (item.ownDb !== undefined) updateData.ownDb = parseFloat(item.ownDb) || 0;
      if (item.isCost !== undefined) updateData.isCost = Boolean(item.isCost);

      if (Object.keys(updateData).length > 0) {
        await JournalDetail.update(updateData, {
          where: { id: item.id },
          transaction
        });
        updatedCount++;
      }
    }

    await transaction.commit();
    committed = true;

    console.log(`✅ Updated ${updatedCount} journal details`);

    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} journal details`,
      updatedCount
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('❌ Error updating journal details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update journal details',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getUsedCoaIds,
  getById,
  get_all_gdn,
  get_gdn,
  create,
  update,
  syncDetails,
  remove,
  toggleStatus,
  getJournalDetailsByCoa,    
  updateJournalDetails       
};


