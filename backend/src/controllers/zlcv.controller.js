// controllers/zlcv.controller.js

const { Zlcv, ZCoa } = require('../models');
const { Op } = require('sequelize');

// =============================================
// GET ALL ZLCV
// =============================================
const getAll = async (req, res) => {
  try {
    const { 
    //   page = 1, 
    //   limit = 10, 
      search = '', 
      isDb, 
      status,
      sortBy = 'order',
      sortOrder = 'ASC'
    } = req.query;

    // const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause.description = { [Op.like]: `%${search}%` };
    }

    if (isDb !== undefined && isDb !== '') {
      whereClause.isDb = isDb === 'true' || isDb === '1';
    }

    if (status !== undefined && status !== '') {
      whereClause.status = status === 'true' || status === '1';
    }

    const { count, rows } = await Zlcv.findAndCountAll({
      where: whereClause,
      include: [{
        model: ZCoa,
        as: 'coa',
        attributes: ['id',  'acName']
      }],
      order: [[sortBy, sortOrder]],
    //   limit: parseInt(limit),
    //   offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
    //   pagination: {
    //     total: count,
        // page: parseInt(page),
        // limit: parseInt(limit),
        // totalPages: Math.ceil(count / limit)
    //   }
    });

  } catch (error) {
    console.error('Error fetching ZLCV:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ZLCV records',
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

    const zlcv = await Zlcv.findByPk(id, {
      include: [{
        model: ZCoa,
        as: 'coa',
        attributes: ['id', 'acName']
      }]
    });

    if (!zlcv) {
      return res.status(404).json({
        success: false,
        message: 'ZLCV record not found'
      });
    }

    res.json({
      success: true,
      data: zlcv
    });

  } catch (error) {
    console.error('Error fetching ZLCV:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ZLCV record',
      error: error.message
    });
  }
};

// =============================================
// CREATE
// =============================================
const create = async (req, res) => {
  try {
    const { coaId, description, order, status, isCost, isDb } = req.body;

    // Validation
    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // If Credit (isDb = false), coaId is required
    if (!isDb && !coaId) {
      return res.status(400).json({
        success: false,
        message: 'COA is required for Credit entries'
      });
    }

    // Create record
    const zlcv = await Zlcv.create({
      coaId: isDb ? null : coaId,  // Debit doesn't need COA
      description: description.trim(),
      order: order || 0,
      status: status !== undefined ? status : true,
      isCost: isDb ? isCost : false,  // Credit always isCost = false
      isDb: isDb
    });

    // Fetch with association
    const createdZlcv = await Zlcv.findByPk(zlcv.id, {
      include: [{
        model: ZCoa,
        as: 'coa',
        attributes: ['id', 'acName']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'ZLCV record created successfully',
      data: createdZlcv
    });

  } catch (error) {
    console.error('Error creating ZLCV:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ZLCV record',
      error: error.message
    });
  }
};

// =============================================
// UPDATE
// =============================================
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { coaId, description, order, status, isCost, isDb } = req.body;

    const zlcv = await Zlcv.findByPk(id);

    if (!zlcv) {
      return res.status(404).json({
        success: false,
        message: 'ZLCV record not found'
      });
    }

    // Validation
    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // If Credit (isDb = false), coaId is required
    if (!isDb && !coaId) {
      return res.status(400).json({
        success: false,
        message: 'COA is required for Credit entries'
      });
    }

    // Update record
    await zlcv.update({
      coaId: isDb ? null : coaId,
      description: description.trim(),
      order: order || 0,
      status: status !== undefined ? status : true,
      isCost: isDb ? isCost : false,
      isDb: isDb
    });

    // Fetch updated with association
    const updatedZlcv = await Zlcv.findByPk(id, {
      include: [{
        model: ZCoa,
        as: 'coa',
        attributes: ['id', 'acName']
      }]
    });

    res.json({
      success: true,
      message: 'ZLCV record updated successfully',
      data: updatedZlcv
    });

  } catch (error) {
    console.error('Error updating ZLCV:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ZLCV record',
      error: error.message
    });
  }
};

// =============================================
// DELETE
// =============================================
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const zlcv = await Zlcv.findByPk(id);

    if (!zlcv) {
      return res.status(404).json({
        success: false,
        message: 'ZLCV record not found'
      });
    }

    await zlcv.destroy();

    res.json({
      success: true,
      message: 'ZLCV record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting ZLCV:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ZLCV record',
      error: error.message
    });
  }
};

// =============================================
// BULK DELETE
// =============================================
const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No IDs provided for deletion'
      });
    }

    const deletedCount = await Zlcv.destroy({
      where: {
        id: { [Op.in]: ids }
      }
    });

    res.json({
      success: true,
      message: `${deletedCount} record(s) deleted successfully`
    });

  } catch (error) {
    console.error('Error bulk deleting ZLCV:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ZLCV records',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  bulkDelete
};
