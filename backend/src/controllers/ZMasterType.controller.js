// controllers/ZMasterType.controller.js



const ZMasterType = require('../models/ZMasterType');
const { Op } = require('sequelize');


// Type mapping
const TYPE_NAMES = {
  1: 'Shipper',
  2: 'Carriage',
  3: 'Bank Name',
  4: 'Contact Type',
  5: 'Clearing Agent'
};

// =============================================
// GET ALL
// =============================================
const getAll = async (req, res) => {
  try {
    const { type, status } = req.query;

    const whereClause = {};

    if (type) {
      whereClause.type = parseInt(type);
    }

    if (status !== undefined) {
      whereClause.status = status === 'true' || status === '1';
    }

    const data = await ZMasterType.findAll({
      where: whereClause,
      order: [['type', 'ASC'], ['actualName', 'ASC']]
    });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching master types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch master types',
      error: error.message
    });
  }
};

// =============================================
// GET BY TYPE
// =============================================
const getByType = async (req, res) => {
  try {
    const { type } = req.params;
    const typeInt = parseInt(type);

    if (!TYPE_NAMES[typeInt]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be 1-5'
      });
    }

    const data = await ZMasterType.findAll({
      where: { type: typeInt },
      order: [['actualName', 'ASC']]
    });

    res.json({
      success: true,
      typeName: TYPE_NAMES[typeInt],
      data
    });

  } catch (error) {
    console.error('Error fetching by type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
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

    const data = await ZMasterType.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching by id:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
      error: error.message
    });
  }
};

// =============================================
// CREATE
// =============================================
const create = async (req, res) => {
  try {
    const { type, actualName, status = true } = req.body;
    const typeInt = parseInt(type);

    // Validate type
    if (!TYPE_NAMES[typeInt]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be 1-5'
      });
    }

    // Validate actualName
    if (!actualName || actualName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Check for duplicate
    const existing = await ZMasterType.findOne({
      where: {
        type: typeInt,
        actualName: actualName.trim()
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `${TYPE_NAMES[typeInt]} with this name already exists`
      });
    }

    // Create record
    const data = await ZMasterType.create({
      type: typeInt,
      typeName: TYPE_NAMES[typeInt],
      actualName: actualName.trim(),
      status
    });

    res.status(201).json({
      success: true,
      message: `${TYPE_NAMES[typeInt]} created successfully`,
      data
    });

  } catch (error) {
    console.error('Error creating master type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create record',
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
    const { actualName, status } = req.body;

    const record = await ZMasterType.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Check for duplicate if actualName is being changed
    if (actualName && actualName.trim() !== record.actualName) {
      const existing = await ZMasterType.findOne({
        where: {
          type: record.type,
          actualName: actualName.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: `${record.typeName} with this name already exists`
        });
      }
    }

    // Update record
    await record.update({
      actualName: actualName?.trim() || record.actualName,
      status: status !== undefined ? status : record.status
    });

    res.json({
      success: true,
      message: `${record.typeName} updated successfully`,
      data: record
    });

  } catch (error) {
    console.error('Error updating master type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update record',
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

    const record = await ZMasterType.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    const typeName = record.typeName;
    await record.destroy();

    res.json({
      success: true,
      message: `${typeName} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting master type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete record',
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

    const record = await ZMasterType.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    await record.update({ status: !record.status });

    res.json({
      success: true,
      message: `${record.typeName} status updated`,
      data: record
    });

  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: error.message
    });
  }
};

// =============================================
// GET TYPE OPTIONS (for dropdowns)
// =============================================
const getTypeOptions = async (req, res) => {
  try {
    res.json({
      success: true,
      data: Object.entries(TYPE_NAMES).map(([key, value]) => ({
        id: parseInt(key),
        name: value
      }))
    });

  } catch (error) {
    console.error('Error fetching type options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch type options',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getByType,
  getById,
  create,
  update,
  remove,
  toggleStatus,
  getTypeOptions
};
