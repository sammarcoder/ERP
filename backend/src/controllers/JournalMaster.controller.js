// // const { JournalDetail } = require('../models/JournalDetail.model');
// // const {JournalMaster} = require('../models/journalMaster.model');

// // const createJournalMaster = async (req, res) => {
// //     const { date, voucherNo, voucherTypeId, balacingId,status } = req.body;

// //     if (!date || !voucherNo || !voucherTypeId ||! status ||!balacingId) {
// //         return res.status(400).json({ error: 'Missing fields are required' });
// //     }

// //     try {
// //         const newJournalMaster = await JournalMaster.create({
// //             date,
// //             voucherNo,
// //             voucherTypeId,
// //             balacingId,
// //             status
// //         });
// //         res.status(201).json(newJournalMaster);
// //     } catch (error) {
// //         console.error("Error creating Journal Master:", error.message);
// //         res.status(500).json({ error: error.message });
// //     }
// // }

// // const getAllJournalMasters = async (req, res) => {
// //     const { page = 1, limit = 10 } = req.query;
// //     const offset = (page - 1) * limit;

// //     try {
// //         const { count, rows } = await JournalMaster.findAndCountAll({
// //             limit: parseInt(limit),
// //             offset: parseInt(offset)
// //         });
// //         res.status(200).json({
// //             total: count,
// //             page: parseInt(page),
// //             totalPages: Math.ceil(count / limit),
// //             data: rows
// //         });
// //     } catch (error) {
// //         console.error("Error fetching Journal Masters:", error.message);
// //         res.status(500).json({ error: error.message });
// //     }
// // }
// // const getJournalMasterById = async (req, res) => {
// //     const { id } = req.params;

// //     try {
// //         const journalMaster = await JournalMaster.findByPk(id
// //             ,{
// //             include:[
// //                 {
// //                     model:JournalDetail,
// //                     as:'details'
// //                 }
// //             ]
// //         }
// //     );
// //         if (!journalMaster) {
// //             return res.status(404).json({ error: 'Journal Master not found' });
// //         }
// //         res.status(200).json(journalMaster);
// //     } catch (error) {
// //         console.error("Error fetching Journal Master by ID:", error.message);
// //         res.status(500).json({ error: error.message });
// //     }
// // }
// // const updateJournalMaster = async (req, res) => {
// //     const { id } = req.params;
// //     const { date, voucherNo, voucherTypeId, balacingId,status } = req.body;

// //     if (!date || !voucherNo || !voucherTypeId || !status ||!balacingId) {
// //         return res.status(400).json({ error: 'All fields are required' });
// //     }

// //     try {
// //         const [updated] = await JournalMaster.update(
// //             { date, voucherNo, voucherTypeId, balacingId, status },
// //             { where: { id } }
// //         );

// //         if (updated) {
// //             const updatedJournalMaster = await JournalMaster.findByPk(id);
// //             res.status(200).json(updatedJournalMaster);
// //         } else {
// //             res.status(404).json({ error: 'Journal Master not found' });
// //         }
// //     } catch (error) {
// //         console.log("Error updating Journal Master:", error.message);
// //         res.status(500).json({ error: error.message });
// //     }
// // }
// // const deleteJournalMaster = async (req, res) => {
// //     const { id } = req.params;

// //     try {
// //         const deleted = await JournalMaster.destroy({ where: { id } });
// //         if (deleted) {
// //             res.status(204).send();
// //         } else {
// //             res.status(404).json({ error: 'Journal Master not found' });
// //         }
// //     } catch (error) {
// //         console.error("Error deleting Journal Master:", error.message);
// //         res.status(500).json({ error: error.message });
// //     }
// // }
// // module.exports = {
// //     createJournalMaster,
// //     getAllJournalMasters,
// //     getJournalMasterById,
// //     updateJournalMaster,
// //     deleteJournalMaster 
// // };





















// const db = require('../models');
// const { JournalMaster, JournalDetail } = db;

// const createJournalMaster = async (req, res) => {
//     const { date, voucherNo, voucherTypeId, balacingId, status } = req.body;
//     console.log(req.body)

//     if (!date || !voucherNo || !voucherTypeId || !balacingId) {
//         return res.status(400).json({ error: 'Missing fields are required' });
//     }

//     try {
//         const newJournalMaster = await JournalMaster.create({
//             date,
//             voucherNo,
//             voucherTypeId,
//             balacingId,
//             status
//         });
//         res.status(201).json(newJournalMaster);
//     } catch (error) {
//         console.error("Error creating Journal Master:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

// const getAllJournalMasters = async (req, res) => {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     try {
//         const { count, rows } = await JournalMaster.findAndCountAll({
//             limit: parseInt(limit),
//             offset: parseInt(offset)
//         });
//         res.status(200).json({
//             total: count,
//             page: parseInt(page),
//             totalPages: Math.ceil(count / limit),
//             data: rows
//         });
//     } catch (error) {
//         console.error("Error fetching Journal Masters:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

// const getJournalMasterById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const journalMaster = await JournalMaster.findByPk(id, {
//             include: [
//                 {
//                     model: JournalDetail,
//                     as: 'details'
//                 }
//             ]
//         });
//         if (!journalMaster) {
//             return res.status(404).json({ error: 'Journal Master not found' });
//         }
//         res.status(200).json(journalMaster);
//     } catch (error) {
//         console.error("Error fetching Journal Master by ID:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

// const updateJournalMaster = async (req, res) => {
//     const { id } = req.params;
//     const { date, voucherNo, voucherTypeId, balacingId, status } = req.body;

//     if (!date || !voucherNo || !voucherTypeId || !status || !balacingId) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     try {
//         const [updated] = await JournalMaster.update(
//             { date, voucherNo, voucherTypeId, balacingId, status },
//             { where: { id } }
//         );

//         if (updated) {
//             const updatedJournalMaster = await JournalMaster.findByPk(id);
//             res.status(200).json(updatedJournalMaster);
//         } else {
//             res.status(404).json({ error: 'Journal Master not found' });
//         }
//     } catch (error) {
//         console.log("Error updating Journal Master:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

// const deleteJournalMaster = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deleted = await JournalMaster.destroy({ where: { id } });
//         if (deleted) {
//             res.status(204).send();
//         } else {
//             res.status(404).json({ error: 'Journal Master not found' });
//         }
//     } catch (error) {
//         console.error("Error deleting Journal Master:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

// module.exports = {
//     createJournalMaster,
//     getAllJournalMasters,
//     getJournalMasterById,
//     updateJournalMaster,
//     deleteJournalMaster 
// };









































// controllers/journalController.js
const db = require('../models');
const { JournalMaster, JournalDetail, ZvoucherType, ZCoa } = db;
const sequelize = db.sequelize;

/**
 * Create a complete journal entry with master and details in a single transaction
 */

const createCompleteJournal = async (req, res) => {
  const { master, details } = req.body;
  console.log('this is master', master)
  console.log('this is details', details)
  
  // Validate master data
  if (!master.date || !master.voucherNo || !master.voucherTypeId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required master fields' 
    });
  }
  
  // Validate details data
  if (!Array.isArray(details) || details.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Journal details are required and must be an array'
    });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Create the journal master record first
    const newJournalMaster = await JournalMaster.create(master, { transaction });
    
    // Add the master ID to all detail records
    const detailsWithMasterId = details.map((detail, index) => ({
      ...detail,
      jmId: newJournalMaster.id,
      lineId: index + 1 // Auto-assign line numbers
    }));
    
    // Create all journal details at once using bulkCreate
    const newJournalDetails = await JournalDetail.bulkCreate(
      detailsWithMasterId, 
      { 
        transaction,
        validate: true 
      }
    );
    
    // Commit the transaction
    await transaction.commit();
    
    // Return complete journal entry data
    return res.status(201).json({
      success: true,
      data: {
        master: newJournalMaster,
        details: newJournalDetails
      }
    });
    
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error creating journal entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create journal entry',
      error: error.message
    });
  }
};






/**
 * Get all journal entries with pagination and filtering
 */
const getAllJournals = async (req, res) => {
  const { page = 1, limit = 10, startDate, endDate, voucherTypeId } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    // Build filter conditions
    const where = {};
    
    if (startDate && endDate) {
      where.date = {
        [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (voucherTypeId) {
      where.voucherTypeId = voucherTypeId;
    }
    
    // Get journal entries with count
    const { count, rows } = await JournalMaster.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']],
      include: [
        {
          model: ZvoucherType,
          as: 'voucherType'
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    console.error('Error fetching journals:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch journal entries',
      error: error.message
    });
  }
};

/**
 * Get a complete journal entry with details by ID
 */
const getJournalById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const journalMaster = await JournalMaster.findByPk(id, {
      include: [
        {
          model: JournalDetail,
          as: 'details',
          include: [
            {
              model: ZCoa,
              as: 'coa'
            }
          ]
        },
        {
          model: ZvoucherType,
          as: 'voucherType'
        }
      ]
    });
    
    if (!journalMaster) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: journalMaster
    });
  } catch (error) {
    console.error('Error fetching journal by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch journal entry',
      error: error.message
    });
  }
};

/**
 * Update a complete journal entry with transaction support
 */
const updateCompleteJournal = async (req, res) => {
  const { id } = req.params;
  const { master, details } = req.body;
  
  // Validate master data
  if (!master.date || !master.voucherNo || !master.voucherTypeId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required master fields' 
    });
  }
  
  // Validate details data
  if (!Array.isArray(details) || details.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Journal details are required and must be an array'
    });
  }
  
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // First find the journal master to update
    const journalMaster = await JournalMaster.findByPk(id);
    
    if (!journalMaster) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }
    
    // Update the journal master
    await journalMaster.update(master, { transaction });
    
    // Delete existing details to replace with new ones
    await JournalDetail.destroy({
      where: { jmId: id },
      transaction
    });
    
    // Create new details with the master ID
    const detailsWithMasterId = details.map((detail, index) => ({
      ...detail,
      jmId: id,
      lineId: index + 1
    }));
    
    const newJournalDetails = await JournalDetail.bulkCreate(
      detailsWithMasterId,
      {
        transaction,
        validate: true
      }
    );
    
    // Commit the transaction
    await transaction.commit();
    
    // Return the updated journal
    return res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      data: {
        master: journalMaster,
        details: newJournalDetails
      }
    });
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error updating journal entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update journal entry',
      error: error.message
    });
  }
};

/**
 * Delete a complete journal entry with its details
 */
const deleteCompleteJournal = async (req, res) => {
  const { id } = req.params;
  
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Check if journal exists
    const journalMaster = await JournalMaster.findByPk(id);
    
    if (!journalMaster) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }
    
    // First delete all related details (cascading deletion)
    await JournalDetail.destroy({
      where: { jmId: id },
      transaction
    });
    
    // Then delete the master
    await journalMaster.destroy({ transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully',
      id
    });
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error deleting journal entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete journal entry',
      error: error.message
    });
  }
};

module.exports = {
  createCompleteJournal,
  getAllJournals,
  getJournalById,
  updateCompleteJournal,
  deleteCompleteJournal
};
