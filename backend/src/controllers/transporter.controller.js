const db = require('../models');
const { Ztransporter } = db;
const { Op } = require('sequelize');

// GET ALL TRANSPORTERS
const getAllTransporters = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', isActive } = req.query;
    
    const offset = (page - 1) * limit;
    const whereCondition = {};
    
    // Search functionality
    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { contactPerson: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      whereCondition.isActive = isActive === 'true';
    }
    
    const { count, rows } = await Ztransporter.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`✅ Retrieved ${rows.length} transporters`);
    
    res.json({
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
    console.error('💥 Error fetching transporters:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET SINGLE TRANSPORTER
const getTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transporter = await Ztransporter.findByPk(id);
    
    if (!transporter) {
      return res.status(404).json({
        success: false,
        error: 'Transporter not found'
      });
    }
    
    console.log(`✅ Retrieved transporter: ${transporter.name}`);
    
    res.json({
      success: true,
      data: transporter
    });
    
  } catch (error) {
    console.error('💥 Error fetching transporter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// CREATE TRANSPORTER
const createTransporter = async (req, res) => {
  try {
    const { name, contactPerson, phone, address, isActive = true } = req.body;
    
    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Transporter name is required'
      });
    }
    
    // Check for duplicate name
    const existingTransporter = await Ztransporter.findOne({
      where: { name: name.trim() }
    });
    
    if (existingTransporter) {
      return res.status(400).json({
        success: false,
        error: 'Transporter with this name already exists'
      });
    }
    
    const transporter = await Ztransporter.create({
      name: name.trim(),
      contactPerson: contactPerson?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      isActive
    });
    
    console.log(`✅ Created transporter: ${transporter.name}`);
    
    res.status(201).json({
      success: true,
      message: 'Transporter created successfully',
      data: transporter
    });
    
  } catch (error) {
    console.error('💥 Error creating transporter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE TRANSPORTER
const updateTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactPerson, phone, address, isActive } = req.body;
    
    const transporter = await Ztransporter.findByPk(id);
    
    if (!transporter) {
      return res.status(404).json({
        success: false,
        error: 'Transporter not found'
      });
    }
    
    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Transporter name is required'
      });
    }
    
    // Check for duplicate name (excluding current record)
    const existingTransporter = await Ztransporter.findOne({
      where: { 
        name: name.trim(),
        id: { [Op.ne]: id }
      }
    });
    
    if (existingTransporter) {
      return res.status(400).json({
        success: false,
        error: 'Transporter with this name already exists'
      });
    }
    
    const updatedTransporter = await transporter.update({
      name: name.trim(),
      contactPerson: contactPerson?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      isActive: isActive !== undefined ? isActive : transporter.isActive
    });
    
    console.log(`✅ Updated transporter: ${updatedTransporter.name}`);
    
    res.json({
      success: true,
      message: 'Transporter updated successfully',
      data: updatedTransporter
    });
    
  } catch (error) {
    console.error('💥 Error updating transporter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// DELETE TRANSPORTER (Soft delete - set isActive = false)
const deleteTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;
    
    const transporter = await Ztransporter.findByPk(id);
    
    if (!transporter) {
      return res.status(404).json({
        success: false,
        error: 'Transporter not found'
      });
    }
    
    if (permanent === 'true') {
      // Permanent delete
      await transporter.destroy();
      console.log(`✅ Permanently deleted transporter: ${transporter.name}`);
      
      res.json({
        success: true,
        message: 'Transporter permanently deleted'
      });
    } else {
      // Soft delete
      await transporter.update({ isActive: false });
      console.log(`✅ Deactivated transporter: ${transporter.name}`);
      
      res.json({
        success: true,
        message: 'Transporter deactivated successfully',
        data: transporter
      });
    }
    
  } catch (error) {
    console.error('💥 Error deleting transporter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// RESTORE TRANSPORTER
const restoreTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transporter = await Ztransporter.findByPk(id);
    
    if (!transporter) {
      return res.status(404).json({
        success: false,
        error: 'Transporter not found'
      });
    }
    
    const restoredTransporter = await transporter.update({ isActive: true });
    
    console.log(`✅ Restored transporter: ${restoredTransporter.name}`);
    
    res.json({
      success: true,
      message: 'Transporter restored successfully',
      data: restoredTransporter
    });
    
  } catch (error) {
    console.error('💥 Error restoring transporter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllTransporters,
  getTransporter,
  createTransporter,
  updateTransporter,
  deleteTransporter,
  restoreTransporter
};
