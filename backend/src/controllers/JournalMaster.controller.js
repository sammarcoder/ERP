

// controllers/journalController.js
const { de } = require('zod/v4/locales');
const db = require('../models');
// const { JournalMaster, JournalDetail, ZvoucherType, ZCoa } = db;
const { JournalMaster, JournalDetail, ZvoucherType, Stk_main, Stk_Detail, ZCoa, ZItems, Order_Main } = db;
const sequelize = db.sequelize;
const { Op } = require('sequelize');











const createCompleteJournal = async (req, res) => {
  const { master, details } = req.body;
  console.log('this is master', master);
  console.log('this is details', details);

  // =============================================
  // 1. VALIDATE MASTER DATA
  // =============================================

  if (!master.date || !master.voucherNo || !master.voucherTypeId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required master fields (date, voucherNo, voucherTypeId)'
    });
  }

  // =============================================
  // 2. VALIDATE LINKED JOURNAL FOR PETTY CASH
  // =============================================

  if (master.voucherTypeId === 14 && !master.linkedJournalId) {
    return res.status(400).json({
      success: false,
      message: 'Petty Cash voucher must be linked to a Journal Voucher',
      errorCode: 'LINKED_JOURNAL_REQUIRED'
    });
  }

  // Validate that linkedJournalId exists and is a Journal voucher
  if (master.linkedJournalId) {
    try {
      const linkedJournal = await JournalMaster.findOne({
        where: {
          id: master.linkedJournalId,
          voucherTypeId: 10  // Must be a Journal voucher
        }
      });

      if (!linkedJournal) {
        return res.status(400).json({
          success: false,
          message: 'Invalid linked Journal Voucher. Please select a valid Journal Voucher.',
          errorCode: 'INVALID_LINKED_JOURNAL'
        });
      }
    } catch (linkError) {
      console.error('Error validating linked journal:', linkError);
      return res.status(500).json({
        success: false,
        message: 'Error validating linked journal',
        error: linkError.message
      });
    }
  }

  // =============================================
  // 3. VALIDATE DETAILS DATA
  // =============================================

  if (!Array.isArray(details) || details.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Journal details are required and must be an array'
    });
  }

  // =============================================
  // 4. CHECK DUPLICATE VOUCHER NUMBER
  // =============================================

  try {
    const existingVoucher = await JournalMaster.findOne({
      where: { voucherNo: master.voucherNo }
    });

    if (existingVoucher) {
      return res.status(409).json({
        success: false,
        message: `Voucher number '${master.voucherNo}' already exists`,
        errorCode: 'DUPLICATE_VOUCHER_NO'
      });
    }
  } catch (checkError) {
    console.error('Error checking voucher number:', checkError);
    return res.status(500).json({
      success: false,
      message: 'Error checking voucher number',
      error: checkError.message
    });
  }

  // =============================================
  // 5. CHECK DUPLICATE RECEIPT NUMBERS (Across ALL vouchers)
  // =============================================

  // try {
  //   const receiptNumbers = details
  //     .filter(d => d.recieptNo && d.recieptNo.trim() !== '')
  //     .map(d => d.recieptNo.trim());

  //   if (receiptNumbers.length > 0) {
  //     const existingReceipts = await JournalDetail.findAll({
  //       where: {
  //         recieptNo: { [Op.in]: receiptNumbers }
  //       },
  //       attributes: ['recieptNo']
  //     });

  //     if (existingReceipts.length > 0) {
  //       const duplicates = [...new Set(existingReceipts.map(r => r.recieptNo))];
  //       return res.status(409).json({
  //         success: false,
  //         message: `Receipt number(s) already exist in database: ${duplicates.join(', ')}`,
  //         errorCode: 'DUPLICATE_RECEIPT_NO'
  //       });
  //     }
  //   }
  // } catch (receiptCheckError) {
  //   console.error('Error checking receipt numbers:', receiptCheckError);
  //   return res.status(500).json({
  //     success: false,
  //     message: 'Error checking receipt numbers',
  //     error: receiptCheckError.message
  //   });
  // }


  // ✅ Check for duplicate receipts with voucher info
  try {
    const receiptNumbers = details
      .filter(d => d.recieptNo && d.recieptNo.trim() !== '')
      .map(d => d.recieptNo.trim());

    if (receiptNumbers.length > 0) {
      const existingReceipts = await JournalDetail.findAll({
        where: {
          recieptNo: { [Op.in]: receiptNumbers }
        },
        attributes: ['recieptNo', 'jmId'],
        include: [{
          model: JournalMaster,
          as: 'master',
          attributes: ['id', 'voucherNo', 'date']
        }]
      });

      if (existingReceipts.length > 0) {
        // ✅ Build detailed error message
        const duplicateDetails = existingReceipts.map(r => {
          const voucherNo = r.master?.voucherNo || 'Unknown'
          const date = r.master?.date
            ? new Date(r.master.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            : 'Unknown date'
          return `${r.recieptNo} (in ${voucherNo} dated ${date})`
        });

        return res.status(409).json({
          success: false,
          message: `Duplicate receipt(s) found: ${duplicateDetails.join(', ')}`,
          errorCode: 'DUPLICATE_RECEIPT_NO',
          duplicates: existingReceipts.map(r => ({
            receiptNo: r.recieptNo,
            voucherNo: r.master?.voucherNo,
            voucherId: r.master?.id,
            date: r.master?.date
          }))
        });
      }
    }
  } catch (receiptCheckError) {
    console.error('Error checking receipt numbers:', receiptCheckError);
    return res.status(500).json({
      success: false,
      message: 'Error checking receipt numbers',
      error: receiptCheckError.message
    });
  }


  // =============================================
  // 6. CREATE JOURNAL ENTRY (Transaction)
  // =============================================

  const transaction = await sequelize.transaction();

  try {
    // Prepare master data with defaults
    const masterWithDefaults = {
      date: master.date,
      voucherNo: master.voucherNo,
      voucherTypeId: master.voucherTypeId,
      balacingId: master.balacingId || null,
      stk_Main_ID: master.stk_Main_ID || null,
      status: master.status !== undefined ? master.status : false,
      isOpening: master.isOpening !== undefined ? master.isOpening : false,
      linkedJournalId: master.linkedJournalId || null,
      is_partially_deleted: false
    };

    // Create the journal master record
    const newJournalMaster = await JournalMaster.create(masterWithDefaults, { transaction });

    // Prepare detail records with master ID
    const detailsWithMasterId = details.map((detail, index) => ({
      jmId: newJournalMaster.id,
      lineId: index + 1,
      coaId: detail.coaId,
      description: detail.description || null,
      chqNo: detail.chqNo || null,
      recieptNo: detail.recieptNo || null,
      ownDb: detail.ownDb || 0,
      ownCr: detail.ownCr || 0,
      rate: detail.rate || null,
      amountDb: detail.amountDb || 0,
      amountCr: detail.amountCr || 0,
      isCost: detail.isCost || false,
      currencyId: detail.currencyId || null,
      status: detail.status !== undefined ? detail.status : false,
      idCard: detail.idCard || null,
      bank: detail.bank || null,
      bankDate: detail.bankDate || null
    }));

    // Create all journal details
    const newJournalDetails = await JournalDetail.bulkCreate(
      detailsWithMasterId,
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    console.log('✅ Journal entry created successfully:', newJournalMaster.id);

    // Return complete journal entry data
    return res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: {
        master: newJournalMaster,
        details: newJournalDetails
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating journal entry:', error);

    // Handle unique constraint error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: `Voucher number '${master.voucherNo}' already exists`,
        errorCode: 'DUPLICATE_VOUCHER_NO'
      });
    }

    // Handle foreign key constraint error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference. Please check COA, Currency, or VoucherType IDs.',
        errorCode: 'FOREIGN_KEY_ERROR'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create journal entry',
      error: error.message
    });
  }
};


// =============================================
// UPDATE COMPLETE JOURNAL
// =============================================

const updateCompleteJournal = async (req, res) => {
  const { id } = req.params;
  const { master, details } = req.body;

  console.log('Updating journal ID:', id);
  console.log('Master data:', master);
  console.log('Details data:', details);

  // =============================================
  // 1. VALIDATE MASTER DATA
  // =============================================

  if (!master.date || !master.voucherNo || !master.voucherTypeId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required master fields (date, voucherNo, voucherTypeId)'
    });
  }

  // =============================================
  // 2. VALIDATE LINKED JOURNAL FOR PETTY CASH
  // =============================================

  if (master.voucherTypeId === 14 && !master.linkedJournalId) {
    return res.status(400).json({
      success: false,
      message: 'Petty Cash voucher must be linked to a Journal Voucher',
      errorCode: 'LINKED_JOURNAL_REQUIRED'
    });
  }

  // Validate that linkedJournalId exists and is a Journal voucher
  if (master.linkedJournalId) {
    try {
      const linkedJournal = await JournalMaster.findOne({
        where: {
          id: master.linkedJournalId,
          voucherTypeId: 10
        }
      });

      if (!linkedJournal) {
        return res.status(400).json({
          success: false,
          message: 'Invalid linked Journal Voucher. Please select a valid Journal Voucher.',
          errorCode: 'INVALID_LINKED_JOURNAL'
        });
      }
    } catch (linkError) {
      console.error('Error validating linked journal:', linkError);
      return res.status(500).json({
        success: false,
        message: 'Error validating linked journal',
        error: linkError.message
      });
    }
  }

  // =============================================
  // 3. VALIDATE DETAILS DATA
  // =============================================

  if (!Array.isArray(details) || details.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Journal details are required and must be an array'
    });
  }

  // =============================================
  // 4. CHECK DUPLICATE VOUCHER NUMBER (Exclude current)
  // =============================================

  try {
    const existingVoucher = await JournalMaster.findOne({
      where: {
        voucherNo: master.voucherNo,
        id: { [Op.ne]: parseInt(id) }  // Exclude current record
      }
    });

    if (existingVoucher) {
      return res.status(409).json({
        success: false,
        message: `Voucher number '${master.voucherNo}' already exists`,
        errorCode: 'DUPLICATE_VOUCHER_NO'
      });
    }
  } catch (checkError) {
    console.error('Error checking voucher number:', checkError);
    return res.status(500).json({
      success: false,
      message: 'Error checking voucher number',
      error: checkError.message
    });
  }

  // =============================================
  // 5. CHECK DUPLICATE RECEIPT NUMBERS (Exclude current voucher)
  // =============================================

  // try {
  //   const receiptNumbers = details
  //     .filter(d => d.recieptNo && d.recieptNo.trim() !== '')
  //     .map(d => d.recieptNo.trim());

  //   if (receiptNumbers.length > 0) {
  //     const existingReceipts = await JournalDetail.findAll({
  //       where: {
  //         recieptNo: { [Op.in]: receiptNumbers },
  //         jmId: { [Op.ne]: parseInt(id) }  // Exclude current voucher's details
  //       },
  //       attributes: ['recieptNo']
  //     });

  //     if (existingReceipts.length > 0) {
  //       const duplicates = [...new Set(existingReceipts.map(r => r.recieptNo))];
  //       return res.status(409).json({
  //         success: false,
  //         message: `Receipt number(s) already exist in database: ${duplicates.join(', ')}`,
  //         errorCode: 'DUPLICATE_RECEIPT_NO'
  //       });
  //     }
  //   }
  // } catch (receiptCheckError) {
  //   console.error('Error checking receipt numbers:', receiptCheckError);
  //   return res.status(500).json({
  //     success: false,
  //     message: 'Error checking receipt numbers',
  //     error: receiptCheckError.message
  //   });
  // }



  // ✅ Check for duplicate receipts (exclude current voucher) with voucher info
  try {
    const receiptNumbers = details
      .filter(d => d.recieptNo && d.recieptNo.trim() !== '')
      .map(d => d.recieptNo.trim());

    if (receiptNumbers.length > 0) {
      const existingReceipts = await JournalDetail.findAll({
        where: {
          recieptNo: { [Op.in]: receiptNumbers },
          jmId: { [Op.ne]: parseInt(id) }  // Exclude current voucher
        },
        attributes: ['recieptNo', 'jmId'],
        include: [{
          model: JournalMaster,
          as: 'master',
          attributes: ['id', 'voucherNo', 'date']
        }]
      });

      if (existingReceipts.length > 0) {
        // ✅ Build detailed error message
        const duplicateDetails = existingReceipts.map(r => {
          const voucherNo = r.master?.voucherNo || 'Unknown'
          const date = r.master?.date
            ? new Date(r.master.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            : 'Unknown date'
          return `${r.recieptNo} (in ${voucherNo} dated ${date})`
        });

        return res.status(409).json({
          success: false,
          message: `Duplicate receipt(s) found: ${duplicateDetails.join(', ')}`,
          errorCode: 'DUPLICATE_RECEIPT_NO',
          duplicates: existingReceipts.map(r => ({
            receiptNo: r.recieptNo,
            voucherNo: r.master?.voucherNo,
            voucherId: r.master?.id,
            date: r.master?.date
          }))
        });
      }
    }
  } catch (receiptCheckError) {
    console.error('Error checking receipt numbers:', receiptCheckError);
    return res.status(500).json({
      success: false,
      message: 'Error checking receipt numbers',
      error: receiptCheckError.message
    });
  }






  // =============================================
  // 6. UPDATE JOURNAL ENTRY (Transaction)
  // =============================================

  const transaction = await sequelize.transaction();

  try {
    // Find the journal master to update
    const journalMaster = await JournalMaster.findByPk(id);

    if (!journalMaster) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    // Prepare master data for update
    const masterUpdateData = {
      date: master.date,
      voucherNo: master.voucherNo,
      voucherTypeId: master.voucherTypeId,
      balacingId: master.balacingId || null,
      stk_Main_ID: master.stk_Main_ID || journalMaster.stk_Main_ID,
      status: master.status !== undefined ? master.status : journalMaster.status,
      isOpening: master.isOpening !== undefined ? master.isOpening : journalMaster.isOpening,
      linkedJournalId: master.linkedJournalId || null
    };

    // Update the journal master
    await journalMaster.update(masterUpdateData, { transaction });

    // Delete existing details
    await JournalDetail.destroy({
      where: { jmId: id },
      transaction
    });

    // Prepare new detail records
    const detailsWithMasterId = details.map((detail, index) => ({
      jmId: parseInt(id),
      lineId: index + 1,
      coaId: detail.coaId,
      description: detail.description || null,
      chqNo: detail.chqNo || null,
      recieptNo: detail.recieptNo || null,
      ownDb: detail.ownDb || 0,
      ownCr: detail.ownCr || 0,
      rate: detail.rate || null,
      amountDb: detail.amountDb || 0,
      amountCr: detail.amountCr || 0,
      isCost: detail.isCost || false,
      currencyId: detail.currencyId || null,
      status: detail.status !== undefined ? detail.status : false,
      idCard: detail.idCard || null,
      bank: detail.bank || null,
      bankDate: detail.bankDate || null
    }));

    // Create new details
    const newJournalDetails = await JournalDetail.bulkCreate(
      detailsWithMasterId,
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    console.log('✅ Journal entry updated successfully:', id);

    return res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully',
      data: {
        master: journalMaster,
        details: newJournalDetails
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error updating journal entry:', error);

    // Handle unique constraint error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: `Voucher number '${master.voucherNo}' already exists`,
        errorCode: 'DUPLICATE_VOUCHER_NO'
      });
    }

    // Handle foreign key constraint error
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference. Please check COA, Currency, or VoucherType IDs.',
        errorCode: 'FOREIGN_KEY_ERROR'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update journal entry',
      error: error.message
    });
  }
};






































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
          model: db.ZvoucherType,
          as: 'voucherType'
        },
        {
          model: db.JournalDetail,
          as: 'details'
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
//  */
// const updateCompleteJournal = async (req, res) => {
//   const { id } = req.params;
//   const { master, details } = req.body;

//   // Validate master data
//   if (!master.date || !master.voucherNo || !master.voucherTypeId) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing required master fields' 
//     });
//   }

//   // Validate details data
//   if (!Array.isArray(details) || details.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Journal details are required and must be an array'
//     });
//   }

//   // Start a transaction
//   const transaction = await sequelize.transaction();

//   try {
//     // First find the journal master to update
//     const journalMaster = await JournalMaster.findByPk(id);

//     if (!journalMaster) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Journal entry not found'
//       });
//     }

//     // Update the journal master
//     await journalMaster.update(master, { transaction });

//     // Delete existing details to replace with new ones
//     await JournalDetail.destroy({
//       where: { jmId: id },
//       transaction
//     });

//     // Create new details with the master ID
//     const detailsWithMasterId = details.map((detail, index) => ({
//       ...detail,
//       jmId: id,
//       lineId: index + 1
//     }));

//     const newJournalDetails = await JournalDetail.bulkCreate(
//       detailsWithMasterId,
//       {
//         transaction,
//         validate: true
//       }
//     );

//     // Commit the transaction
//     await transaction.commit();

//     // Return the updated journal
//     return res.status(200).json({
//       success: true,
//       message: 'Journal entry updated successfully',
//       data: {
//         master: journalMaster,
//         details: newJournalDetails
//       }
//     });
//   } catch (error) {
//     // Rollback the transaction on error
//     await transaction.rollback();
//     console.error('Error updating journal entry:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to update journal entry',
//       error: error.message
//     });
//   }
// };




// const updateCompleteJournal = async (req, res) => {
//   const { id } = req.params;
//   const { master, details } = req.body;

//   // Validate master data
//   if (!master.date || !master.voucherNo || !master.voucherTypeId) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing required master fields' 
//     });
//   }

//   // Validate details data
//   if (!Array.isArray(details) || details.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Journal details are required and must be an array'
//     });
//   }

//   // ✅ NEW: Check if voucherNo already exists for OTHER records (exclude current)
//   try {
//     const existingVoucher = await JournalMaster.findOne({
//       where: { 
//         voucherNo: master.voucherNo,
//         id: { [Op.ne]: id }  // ✅ Exclude current record
//       }
//     });

//     if (existingVoucher) {
//       return res.status(409).json({
//         success: false,
//         message: `Voucher number '${master.voucherNo}' already exists`,
//         errorCode: 'DUPLICATE_VOUCHER_NO'
//       });
//     }
//   } catch (checkError) {
//     console.error('Error checking voucher number:', checkError);
//     return res.status(500).json({
//       success: false,
//       message: 'Error checking voucher number',
//       error: checkError.message
//     });
//   }

//   // Start a transaction
//   const transaction = await sequelize.transaction();

//   try {
//     // First find the journal master to update
//     const journalMaster = await JournalMaster.findByPk(id);

//     if (!journalMaster) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Journal entry not found'
//       });
//     }

//     // ✅ Include isOpening in update
//     const masterWithDefaults = {
//       ...master,
//       isOpening: master.isOpening !== undefined ? master.isOpening : journalMaster.isOpening
//     };

//     // Update the journal master
//     await journalMaster.update(masterWithDefaults, { transaction });

//     // Delete existing details to replace with new ones
//     await JournalDetail.destroy({
//       where: { jmId: id },
//       transaction
//     });

//     // Create new details with the master ID
//     const detailsWithMasterId = details.map((detail, index) => ({
//       ...detail,
//       jmId: id,
//       lineId: index + 1,
//       bankDate: detail.bankDate || null,
//       idCard: detail.idCard || null,
//       bank: detail.bank || null
//     }));

//     const newJournalDetails = await JournalDetail.bulkCreate(
//       detailsWithMasterId,
//       {
//         transaction,
//         validate: true
//       }
//     );

//     // Commit the transaction
//     await transaction.commit();

//     // Return the updated journal
//     return res.status(200).json({
//       success: true,
//       message: 'Journal entry updated successfully',
//       data: {
//         master: journalMaster,
//         details: newJournalDetails
//       }
//     });
//   } catch (error) {
//     // Rollback the transaction on error
//     await transaction.rollback();
//     console.error('Error updating journal entry:', error);

//     // ✅ Handle Sequelize unique constraint error
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({
//         success: false,
//         message: `Voucher number '${master.voucherNo}' already exists`,
//         errorCode: 'DUPLICATE_VOUCHER_NO'
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: 'Failed to update journal entry',
//       error: error.message
//     });
//   }
// };







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



const postVoucherToJournal = async (req, res) => {
  const { stockMainId } = req.params;
  const { mode = 'create' } = req.body; // ADD MODE PARAMETER

  const transaction = await sequelize.transaction();

  try {
    // Fetch dispatch data
    const stockMain = await Stk_main.findByPk(stockMainId, {
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [{ model: ZItems, as: 'item' }]
        },
        { model: ZCoa, as: 'account' },
        { model: Order_Main, as: 'order' }
      ]
    });

    if (!stockMain || !stockMain.is_Voucher_Generated) {
      return res.status(400).json({ success: false, error: 'Voucher not generated yet' });
    }

    console.log(`🔄 Journal operation mode: ${mode.toUpperCase()} for ${stockMain.Number}`);

    // HANDLE DIFFERENT MODES
    let result;
    switch (mode.toLowerCase()) {
      case 'create':
        result = await createJournalEntries(stockMain, stockMainId, transaction);
        break;
      case 'edit':
        result = await editJournalEntries(stockMain, stockMainId, transaction);
        break;
      case 'post':
        result = await toggleJournalStatus(stockMain, stockMainId, transaction);
        break;
      default:
        throw new Error(`Invalid mode: ${mode}`);
    }

    await transaction.commit();
    res.json(result);

  } catch (error) {
    await transaction.rollback();
    console.error('💥 Error in journal operation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};











// Generate Sales Voucher Number (SV-1, SV-2, ...)
const generateSalesVoucherNumber = async () => {
  const lastSV = await JournalMaster.findOne({
    where: { voucherTypeId: 12 },
    order: [['id', 'DESC']]
  });

  if (!lastSV) {
    return 'SV-1';
  }

  const numberStr = lastSV.voucherNo || '';
  const match = numberStr.match(/(\d+)$/);
  let nextSeq;

  if (match) {
    nextSeq = parseInt(match[1], 10) + 1;
  } else {
    nextSeq = lastSV.id + 1;
  }

  return `SV-${nextSeq}`;
};


const createJournalEntries = async (stockMain, stockMainId, transaction) => {
  // Check if already exists
  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId }
  });

  if (existingJournal) {
    return { success: false, error: 'Journal already exists - use edit mode' };
  }

  const voucherTypeId = stockMain.Stock_Type_ID; // 11 or 12

  // ✅ Auto-generate voucher number based on type
  let voucherNo;
  if (voucherTypeId === 12) {
    // Sales Voucher → SV-1, SV-2, ...
    voucherNo = await generateSalesVoucherNumber();
  } else {
    // GRN or others → use stockMain.Number
    voucherNo = stockMain.Number;
  }

  // Create JournalMaster with UnPost status
  const journalMaster = await JournalMaster.create({
    date: stockMain.Date,
    stk_Main_ID: stockMainId,
    voucherTypeId: voucherTypeId,
    voucherNo: voucherNo,  // ✅ Auto-generated for SV
    status: false,
    isOpening: false
  }, { transaction });

  console.log(`✅ Created JournalMaster ID: ${journalMaster.id}, VoucherNo: ${voucherNo}`);

  // Calculate and create journal details
  const { journalDetails, totals } = await createJournalDetailEntries(stockMain, journalMaster.id, transaction);

  return {
    success: true,
    message: 'Journal created successfully with UnPost status',
    mode: 'create',
    data: {
      journalMaster: {
        id: journalMaster.id,
        voucherNo: journalMaster.voucherNo,
        status: 'UnPost'
      },
      summary: totals
    }
  };
};








const editJournalEntries = async (stockMain, stockMainId, transaction) => {
  // Find existing journal
  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId },
    include: [{ model: JournalDetail, as: 'details' }],
    transaction
  });

  if (!existingJournal) {
    return { success: false, error: 'No journal found - use create mode' };
  }

  console.log(`🔄 Re-generating journal ID: ${existingJournal.id}`);

  // Step 1: Delete existing journal details (if any left)
  await JournalDetail.destroy({
    where: { jmId: existingJournal.id },
    transaction
  });
  console.log('🗑️ Old journal details deleted');

  // Step 2: Update JournalMaster - ✅ RESET is_partially_deleted = 0
  await JournalMaster.update({
    date: stockMain.Date,
    is_partially_deleted: false  // ✅ KEY FIX!
  }, {
    where: { id: existingJournal.id },
    transaction
  });
  console.log('📝 JournalMaster updated, is_partially_deleted = 0');

  // Step 3: Recreate journal details with new data
  const { journalDetails, totals } = await createJournalDetailEntries(stockMain, existingJournal.id, transaction);
  console.log(`✅ Created ${journalDetails.length} new journal details`);

  // Step 4: Update stk_main Status to Post
  await Stk_main.update({
    Status: 'Post'
  }, {
    where: { ID: stockMainId },
    transaction
  });
  console.log('📝 stk_main.Status = Post');

  return {
    success: true,
    message: 'Journal re-generated successfully',
    mode: 'edit',
    data: {
      journalMaster: {
        id: existingJournal.id,
        voucherNo: existingJournal.voucherNo,
        status: 'UnPost'
      },
      summary: totals,
      detailsCreated: journalDetails.length
    }
  };
};





// POST MODE: Toggle Post/UnPost status for both JournalMaster and JournalDetail
const toggleJournalStatus = async (stockMain, stockMainId, transaction) => {
  // Find existing journal
  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId }
  });

  if (!existingJournal) {
    return { success: false, error: 'No journal found to post/unpost' };
  }

  // TOGGLE LOGIC: If currently Post (true), make it UnPost (false) and vice versa
  const newStatus = !existingJournal.status;
  const statusText = newStatus ? 'Post' : 'UnPost';

  console.log(`🔄 Changing journal status from ${existingJournal.status ? 'Post' : 'UnPost'} to ${statusText}`);

  // Update JournalMaster status
  await JournalMaster.update({
    status: newStatus
  }, {
    where: { id: existingJournal.id },
    transaction
  });

  // UPDATE ALL JournalDetail records with same jmId
  const updatedDetails = await JournalDetail.update({
    status: newStatus
  }, {
    where: { jmId: existingJournal.id },
    transaction
  });

  console.log(`✅ Updated JournalMaster and ${updatedDetails[0]} JournalDetail records to ${statusText}`);

  return {
    success: true,
    message: `Journal ${statusText.toLowerCase()}ed successfully`,
    mode: 'post',
    data: {
      journalMaster: {
        id: existingJournal.id,
        voucherNo: existingJournal.voucherNo,
        status: statusText,
        previousStatus: existingJournal.status ? 'Post' : 'UnPost'
      },
      updatedDetails: updatedDetails[0]
    }
  };
};



const createJournalDetailEntries = async (stockMain, journalMasterId, transaction) => {
  // Calculate totals and batch grouping
  const batchTotals = {};
  let grandTotal = 0;

  stockMain.details.forEach(detail => {
    const price = parseFloat(detail.Stock_Price) || 0;
    let qty = 0;

    switch (detail.Sale_Unit) {
      case '1': qty = parseFloat(detail.Stock_out_UOM_Qty) || 0; break;
      case '2': qty = parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0; break;
      case '3': qty = parseFloat(detail.Stock_out_UOM3_Qty) || 0; break;
      default: qty = parseFloat(detail.Stock_out_UOM_Qty) || 0;
    }

    const gross = price * qty;
    const discA = gross * (parseFloat(detail.Discount_A) || 0) / 100;
    const afterA = gross - discA;
    const discB = afterA * (parseFloat(detail.Discount_B) || 0) / 100;
    const afterB = afterA - discB;
    const discC = afterB * (parseFloat(detail.Discount_C) || 0) / 100;
    const netAmount = afterB - discC;

    const batchNo = detail.batchno || 'No Batch';
    const batchName = detail.batchDetails?.acName || `Batch-${batchNo}`;

    if (!batchTotals[batchNo]) {
      batchTotals[batchNo] = { amount: 0, batchName };
    }
    batchTotals[batchNo].amount += netAmount;
    grandTotal += netAmount;
  });

  const carriageAmount = parseFloat(stockMain.Carriage_Amount) || 0;
  const customerAmount = grandTotal - carriageAmount;

  // Get description parts
  const subCity = stockMain.order?.sub_city || '';
  const subCustomer = stockMain.order?.sub_customer || '';
  const customerName = stockMain.account?.acName || '';

  // Build descriptions
  let customerDesc = 'S.Inv';
  if (subCity) customerDesc += `, ${subCity}`;
  if (subCustomer) customerDesc += `, ${subCustomer}`;

  let carriageDesc = 'S.Inv';
  if (customerName) carriageDesc += `, ${customerName}`;

  // Create journal entries
  const journalDetails = [];
  let lineId = 1;

  // ROW 1: Customer Entry (DEBIT)
  journalDetails.push({
    jmId: journalMasterId,
    lineId: lineId++,
    coaId: stockMain.COA_ID,
    description: customerDesc,
    chqNo: null,
    recieptNo: 0,
    ownDb: 0,
    ownCr: 0,
    rate: 1,
    amountDb: customerAmount,
    amountCr: 0,
    isCost: false,
    currencyId: 1,
    status: false
  });

  // ROW 2: Carriage Entry (DEBIT)
  if (carriageAmount > 0 && stockMain.Carriage_ID) {
    journalDetails.push({
      jmId: journalMasterId,
      lineId: lineId++,
      coaId: stockMain.Carriage_ID,
      description: carriageDesc,
      chqNo: null,
      recieptNo: 0,
      ownDb: 0,
      ownCr: 0,
      rate: 1,
      amountDb: carriageAmount,
      amountCr: 0,
      isCost: true,
      currencyId: 1,
      status: false
    });
  }

  // REMAINING ROWS: Batch-wise Credit entries
  Object.entries(batchTotals).forEach(([batchNo, batchData]) => {
    journalDetails.push({
      jmId: journalMasterId,
      lineId: lineId++,
      coaId: parseInt(batchNo) || 999,
      description: batchData.batchName,
      chqNo: null,
      recieptNo: 0,
      ownDb: 0,
      ownCr: 0,
      rate: 1,
      amountDb: 0,
      amountCr: batchData.amount,
      isCost: false,
      currencyId: 1,
      status: false
    });
  });

  // Save journal details
  await JournalDetail.bulkCreate(journalDetails, { transaction });

  console.log(`✅ Created ${journalDetails.length} journal detail entries`);

  return {
    journalDetails,
    totals: {
      totalRows: journalDetails.length,
      netTotal: grandTotal,
      carriageAmount: carriageAmount,
      customerAmount: customerAmount,
      batches: Object.keys(batchTotals).length
    }
  };
};






// CHECK JOURNAL STATUS
const checkJournalStatus = async (req, res) => {
  try {
    const { stockMainId } = req.params;

    const existingJournal = await JournalMaster.findOne({
      where: { stk_Main_ID: stockMainId }
    });

    res.json({
      success: true,
      isPosted: !!existingJournal,
      journalStatus: existingJournal ? (existingJournal.status ? 'Post' : 'UnPost') : null,
      journalId: existingJournal?.id || null,
      voucherNo: existingJournal?.voucherNo || null
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// ✅ NEW: Post/Unpost voucher functionality
const postUnpostVoucher = async (req, res) => {
  const { id } = req.params;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the journal master
    const journalMaster = await JournalMaster.findByPk(id, {
      include: [{
        model: JournalDetail,
        as: 'details'
      }],
      transaction
    });

    if (!journalMaster) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    // Toggle status
    const newStatus = !journalMaster.status;

    // Update journal master status
    await journalMaster.update({ status: newStatus }, { transaction });

    // If posting (newStatus = true), update all detail statuses to true
    if (newStatus === true) {
      await JournalDetail.update(
        { status: true },
        {
          where: { jmId: id },
          transaction
        }
      );
    }
    // If unposting (newStatus = false), keep detail statuses as they are
    // This allows individual detail control when needed

    // Commit the transaction
    await transaction.commit();

    // Fetch updated data with details
    const updatedVoucher = await JournalMaster.findByPk(id, {
      include: [{
        model: JournalDetail,
        as: 'details',
        include: [{
          model: ZCoa,
          as: 'coa',
          attributes: ['id', 'acName', 'acCode']
        }]
      }, {
        model: ZvoucherType,
        as: 'voucherType',
        attributes: ['id', 'vType']
      }]
    });

    return res.status(200).json({
      success: true,
      message: `Voucher ${newStatus ? 'posted' : 'unposted'} successfully`,
      data: updatedVoucher
    });

  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error posting/unposting voucher:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to post/unpost voucher',
      error: error.message
    });
  }
};

// ✅ NEW: Get vouchers by type (Journal = 10)
const getJournalVouchers = async (req, res) => {
  try {
    const vouchers = await JournalMaster.findAll({
      where: { voucherTypeId: 10 }, // Journal vouchers
      include: [{
        model: JournalDetail,
        as: 'details',
        include: [{
          model: ZCoa,
          as: 'coa',
          attributes: ['id', 'acName']
        }]
      }, {
        model: ZvoucherType,
        as: 'voucherType',
        attributes: ['id', 'vType']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    console.error('Error fetching journal vouchers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch journal vouchers',
      error: error.message
    });
  }
};

// ✅ NEW: Get vouchers by type (Petty Cash = 14)
const getPettyCashVouchers = async (req, res) => {
  try {
    const vouchers = await JournalMaster.findAll({
      where: { voucherTypeId: 14 }, // Petty cash vouchers
      include: [{
        model: JournalDetail,
        as: 'details',
        include: [{
          model: ZCoa,
          as: 'coa',
          attributes: ['id', 'acName',]
        }]
      }, {
        model: ZvoucherType,
        as: 'voucherType',
        attributes: ['id', 'vType']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    console.error('Error fetching petty cash vouchers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch petty cash vouchers',
      error: error.message
    });
  }
};

// ✅ UPDATED: Create complete journal with default status = false
// const createCompleteJournal = async (req, res) => {
//   const { master, details } = req.body;
//   console.log('this is master', master)
//   console.log('this is details', details)

//   // Validate master data
//   if (!master.date || !master.voucherNo || !master.voucherTypeId) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing required master fields' 
//     });
//   }

//   // Validate details data
//   if (!Array.isArray(details) || details.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Journal details are required and must be an array'
//     });
//   }

//   // Start a transaction
//   const transaction = await sequelize.transaction();

//   try {
//     // ✅ FIXED: Set default status to false
//     const masterWithDefaults = {
//       ...master,
//       status: master.status !== undefined ? master.status : false // Default to false
//     };

//     // Create the journal master record first
//     const newJournalMaster = await JournalMaster.create(masterWithDefaults, { transaction });

//     // Add the master ID to all detail records
//     const detailsWithMasterId = details.map((detail, index) => ({
//       ...detail,
//       jmId: newJournalMaster.id,
//       lineId: index + 1, // Auto-assign line numbers
//       // ✅ FIXED: Handle null/empty bankDate properly
//       bankDate: detail.bankDate || null,
//       idCard: detail.idCard || null,
//       bank: detail.bank || null
//     }));

//     // Create all journal details at once using bulkCreate
//     const newJournalDetails = await JournalDetail.bulkCreate(
//       detailsWithMasterId, 
//       { 
//         transaction,
//         // validate: true // Removed as per your request
//       }
//     );

//     // Commit the transaction
//     await transaction.commit();

//     // Return complete journal entry data
//     return res.status(201).json({
//       success: true,
//       data: {
//         master: newJournalMaster,
//         details: newJournalDetails
//       }
//     });

//   } catch (error) {
//     // Rollback the transaction on error
//     await transaction.rollback();
//     console.error('Error creating journal entry:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to create journal entry',
//       error: error.message
//     });
//   }
// };





// const createCompleteJournal = async (req, res) => {
//   const { master, details } = req.body;
//   console.log('this is master', master)
//   console.log('this is details', details)

//   // Validate master data
//   if (!master.date || !master.voucherNo || !master.voucherTypeId) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing required master fields' 
//     });
//   }

//   // Validate details data
//   if (!Array.isArray(details) || details.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Journal details are required and must be an array'
//     });
//   }

//   // ✅ NEW: Check if voucherNo already exists
//   try {
//     const existingVoucher = await JournalMaster.findOne({
//       where: { voucherNo: master.voucherNo }
//     });

//     if (existingVoucher) {
//       return res.status(409).json({
//         success: false,
//         message: `Voucher number '${master.voucherNo}' already exists`,
//         errorCode: 'DUPLICATE_VOUCHER_NO'
//       });
//     }
//   } catch (checkError) {
//     console.error('Error checking voucher number:', checkError);
//     return res.status(500).json({
//       success: false,
//       message: 'Error checking voucher number',
//       error: checkError.message
//     });
//   }

//   // Start a transaction
//   const transaction = await sequelize.transaction();

//   try {
//     // ✅ FIXED: Set default status to false
//     const masterWithDefaults = {
//       ...master,
//       status: master.status !== undefined ? master.status : false,
//       isOpening: master.isOpening !== undefined ? master.isOpening : false  // ✅ Include isOpening
//     };

//     // Create the journal master record first
//     const newJournalMaster = await JournalMaster.create(masterWithDefaults, { transaction });

//     // Add the master ID to all detail records
//     const detailsWithMasterId = details.map((detail, index) => ({
//       ...detail,
//       jmId: newJournalMaster.id,
//       lineId: index + 1,
//       bankDate: detail.bankDate || null,
//       idCard: detail.idCard || null,
//       bank: detail.bank || null
//     }));

//     // Create all journal details at once using bulkCreate
//     const newJournalDetails = await JournalDetail.bulkCreate(
//       detailsWithMasterId, 
//       { transaction }
//     );

//     // Commit the transaction
//     await transaction.commit();

//     // Return complete journal entry data
//     return res.status(201).json({
//       success: true,
//       data: {
//         master: newJournalMaster,
//         details: newJournalDetails
//       }
//     });

//   } catch (error) {
//     // Rollback the transaction on error
//     await transaction.rollback();
//     console.error('Error creating journal entry:', error);

//     // ✅ Handle Sequelize unique constraint error
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({
//         success: false,
//         message: `Voucher number '${master.voucherNo}' already exists`,
//         errorCode: 'DUPLICATE_VOUCHER_NO'
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: 'Failed to create journal entry',
//       error: error.message
//     });
//   }
// };




// routes/journalMaster.js


// controller
// const deleteVoucherAndReset = async (req, res) => {
//   const { stockMainId } = req.params;
//   const transaction = await sequelize.transaction();

//   try {
//     // Step 1: Find journal by stk_Main_ID
//     const journal = await JournalMaster.findOne({
//       where: { stk_Main_ID: stockMainId },
//       transaction
//     });

//     if (!journal) {
//       await transaction.rollback();
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Journal not found for this GDN' 
//       });
//     }

//     // Step 2: Check if journal is posted - must unpost first
//     if (journal.status === true) {
//       await transaction.rollback();
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please UnPost the voucher before deleting' 
//       });
//     }

//     // Step 3: Delete all journal details
//     await JournalDetail.destroy({
//       where: { jmId: journal.id },
//       transaction
//     });
//     console.log(`🗑️ Deleted all journal details for jmId: ${journal.id}`);

//     // Step 4: Mark journal as partially deleted
//     await journal.update(
//       { is_partially_deleted: true },
//       { transaction }
//     );
//     console.log(`📝 Marked journal ${journal.voucherNo} as partially deleted`);

//     // Step 5: Update stk_main status to UnPost
//     await Stk_main.update(
//       { Status: 'UnPost' },
//       { 
//         where: { ID: stockMainId },
//         transaction 
//       }
//     );
//     console.log(`📝 Updated stk_main ${stockMainId} status to UnPost`);

//     await transaction.commit();

//     res.json({
//       success: true,
//       message: 'Voucher deleted successfully. GDN can now be edited and re-generated.',
//       data: {
//         journalId: journal.id,
//         voucherNo: journal.voucherNo,
//         stockMainId: stockMainId
//       }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error('💥 Error deleting voucher:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };



// controllers/journalMasterController.js

// Get all sales vouchers (voucherTypeId = 12) that are not partially deleted
const getSalesVouchers = async (req, res) => {
  try {
    const salesVouchers = await JournalMaster.findAll({
      where: {
        voucherTypeId: 12,
        is_partially_deleted: false  // Sales voucher type

      },
      include: [
        {
          model: JournalDetail,
          as: 'details',
          include: [{
            model: ZCoa,
            as: 'coa',
            attributes: ['id', 'acName']
          }]
        },
        {
          model: ZvoucherType,
          as: 'voucherType',
          attributes: ['id', 'vType']
        },
        {
          model: Stk_main,
          as: 'Voucher',
          attributes: ['ID', 'Number', 'Date', 'Status', 'COA_ID'],
          include: [{
            model: ZCoa,
            as: 'account',
            attributes: ['id', 'acName', 'city']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: salesVouchers
    });

  } catch (error) {
    console.error('Error fetching sales vouchers:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add route











// controllers/journalMasterController.js

const deleteVoucherAndReset = async (req, res) => {
  const { stockMainId } = req.params;
  const transaction = await sequelize.transaction();

  try {
    console.group(`🗑️ Delete Voucher: stk_main ID ${stockMainId}`);

    // Step 1: Find journal by stk_Main_ID
    const journal = await JournalMaster.findOne({
      where: { stk_Main_ID: stockMainId },
      transaction
    });

    if (!journal) {
      await transaction.rollback();
      console.log('❌ Journal not found');
      console.groupEnd();
      return res.status(404).json({
        success: false,
        error: 'Journal not found for this GDN'
      });
    }

    // Step 2: Check if posted - must unpost first
    if (journal.status === true) {
      await transaction.rollback();
      console.log('❌ Journal still posted');
      console.groupEnd();
      return res.status(400).json({
        success: false,
        error: 'Please UnPost the voucher before deleting'
      });
    }

    // Step 3: Delete all journal details
    const deletedCount = await JournalDetail.destroy({
      where: { jmId: journal.id },
      transaction
    });
    console.log(`🗑️ Deleted ${deletedCount} journal details`);

    // Step 4: Mark journal as partially deleted
    await journal.update({ is_partially_deleted: true }, { transaction });
    console.log('📝 Set is_partially_deleted = true');

    // Step 5: Update stk_main status
    await Stk_main.update(
      { Status: 'UnPost' },
      { where: { ID: stockMainId }, transaction }
    );
    console.log('📝 Set stk_main.Status = UnPost');

    await transaction.commit();
    console.log('✅ Delete completed');
    console.groupEnd();

    res.json({
      success: true,
      message: 'Voucher deleted. GDN ready for re-generation.',
      data: { journalId: journal.id, voucherNo: journal.voucherNo }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('💥 Error:', error);
    console.groupEnd();
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get sales vouchers (voucherTypeId = 12, is_partially_deleted = 0)
// const getSalesVouchers = async (req, res) => {
//   try {
//     const vouchers = await JournalMaster.findAll({
//       where: {
//         voucherTypeId: 12,
//         is_partially_deleted: false
//       },
//       include: [
//         { model: JournalDetail, as: 'details' },
//         {
//           model: Stk_main,
//           as: 'stockMain',
//           include: [{ model: ZCoa, as: 'account', attributes: ['id', 'acName', 'city'] }]
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     res.json({ success: true, data: vouchers });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };










// controllers/journalMasterController.js

// NEW API - Post/UnPost Sales Voucher (updates both master & detail)
const postUnpostSalesVoucher = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    const journalMaster = await JournalMaster.findByPk(id, {
      transaction
    });

    if (!journalMaster) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    // Toggle status
    const newStatus = !journalMaster.status;
    const statusText = newStatus ? 'Post' : 'UnPost';

    console.log(`🔄 Sales Voucher ${id}: ${journalMaster.status ? 'Post' : 'UnPost'} → ${statusText}`);

    // Update JournalMaster status
    await JournalMaster.update(
      { status: newStatus },
      { where: { id: id }, transaction }
    );

    // Update ALL JournalDetail status (both Post and UnPost)
    const updatedCount = await JournalDetail.update(
      { status: newStatus },
      { where: { jmId: id }, transaction }
    );

    console.log(`✅ Updated JournalMaster and ${updatedCount[0]} JournalDetail records to ${statusText}`);

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: `Voucher ${statusText.toLowerCase()}ed successfully`,
      data: {
        journalId: id,
        voucherNo: journalMaster.voucherNo,
        newStatus: statusText,
        detailsUpdated: updatedCount[0]
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error in postUnpostSalesVoucher:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to post/unpost voucher',
      error: error.message
    });
  }
};

// Add route











// const get_BF_RF = async (req, res) => {
//   try {
//     // Step 1: Get the last Journal Voucher entry
//     const lastEntry = await JournalMaster.findOne({
//       where: {
//         voucherTypeId: 10
//       },
//       order: [['id', 'DESC']]
//     });

//     if (!lastEntry) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'No Journal Voucher entries found' 
//       });
//     }

//     console.log('Last JV Entry:', lastEntry.toJSON());

//     // Step 2: Extract the date
//     const lastDate = lastEntry.date;

//     // Step 3: Get ALL JournalMaster entries UP TO that date (all voucher types)
//     const allEntries = await JournalMaster.findAll({
//       where: {
//         date: {
//           [Op.lte]: lastDate  // Less than or equal to last date
//         },
//         is_partially_deleted: false
//       },
//       attributes: ['id', 'date', 'voucherTypeId', 'voucherNo', 'status', 'isOpening'],
//       include: [{
//         model: JournalDetail,
//         as: 'details',
//         where: { coaId:req.query.coaId ? req.query.coaId : { [Op.ne]: null } },
//         required: false,
//         attributes: ['id','description', 'jmId', 'coaId', 'amountDb', 'amountCr']
//       }],
//       order: [['date', 'ASC'], ['id', 'ASC']]
//     });

//     console.log(`Found ${allEntries.length} entries up to date: ${lastDate}`);

//     res.json({ 
//       success: true, 
//       upToDate: lastDate,
//       count: allEntries.length,
//       data: allEntries 
//     });

//   } catch (error) {
//     console.error('Error fetching entries:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error fetching entries',
//       error: error.message 
//     });
//   }


// }














// =============================================
// GET BF/RF REPORT
// =============================================

// const get_BF_RF = async (req, res) => {
//   try {
//     // Step 1: Get the last Journal Voucher entry
//     const lastEntry = await JournalMaster.findOne({
//       where: {
//         voucherTypeId: 10
//       },
//       order: [['id', 'DESC']]
//     });

//     if (!lastEntry) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'No Journal Voucher entries found' 
//       });
//     }

//     console.log('Last JV Entry:', lastEntry.toJSON());

//     // Step 2: Extract the date
//     const lastDate = lastEntry.date;
//     const coaId = req.query.coaId;

//     console.log('Last Date:', lastDate);
//     console.log('Filtering by coaId:', coaId);

//     // Step 3: Get ALL entries with ALL details (no COA filter)
//     const allEntries = await JournalMaster.findAll({
//       where: {
//         date: {
//           [Op.lte]: lastDate
//         },
//         is_partially_deleted: false
//       },
//       attributes: ['id', 'date', 'voucherTypeId', 'voucherNo', 'status', 'isOpening'],
//       include: [{
//         model: JournalDetail,
//         as: 'details',
//         attributes: ['id', 'description', 'jmId', 'coaId', 'amountDb', 'amountCr']
//       }],
//       order: [['date', 'ASC'], ['id', 'ASC']]
//     });

//     // Step 4: Calculate ALL totals (no filter)
//     let allTotalDebit = 0;
//     let allTotalCredit = 0;

//     allEntries.forEach(entry => {
//       if (entry.details && entry.details.length > 0) {
//         entry.details.forEach(detail => {
//           allTotalDebit += parseFloat(detail.amountDb) || 0;
//           allTotalCredit += parseFloat(detail.amountCr) || 0;
//         });
//       }
//     });

//     // Step 5: Calculate COA-specific totals (if coaId provided)
//     let coaTotalDebit = 0;
//     let coaTotalCredit = 0;
//     let coaDetails = [];

//     if (coaId) {
//       const parsedCoaId = parseInt(coaId);

//       allEntries.forEach(entry => {
//         if (entry.details && entry.details.length > 0) {
//           entry.details.forEach(detail => {
//             if (detail.coaId === parsedCoaId) {
//               coaTotalDebit += parseFloat(detail.amountDb) || 0;
//               coaTotalCredit += parseFloat(detail.amountCr) || 0;
//               coaDetails.push({
//                 voucherNo: entry.voucherNo,
//                 date: entry.date,
//                 voucherTypeId: entry.voucherTypeId,
//                 description: detail.description,
//                 amountDb: parseFloat(detail.amountDb) || 0,
//                 amountCr: parseFloat(detail.amountCr) || 0
//               });
//             }
//           });
//         }
//       });
//     }

//     // Step 6: Calculate BF (Brought Forward)
//     // BF = COA Debit - COA Credit
//     const bf = coaId ? (coaTotalDebit - coaTotalCredit) : 0;

//     console.log('=== CALCULATIONS ===');
//     console.log('All Total Debit:', allTotalDebit);
//     console.log('All Total Credit:', allTotalCredit);
//     console.log('COA Total Debit:', coaTotalDebit);
//     console.log('COA Total Credit:', coaTotalCredit);
//     console.log('BF:', bf);
//     console.log('====================');

//     res.json({ 
//       success: true,
//       upToDate: lastDate,
//       coaId: coaId ? parseInt(coaId) : null,
      
//       // ✅ All details sum (no filter)
//       allTotals: {
//         debit: Math.round(allTotalDebit * 100) / 100,
//         credit: Math.round(allTotalCredit * 100) / 100,
//         difference: Math.round(Math.abs(allTotalDebit - allTotalCredit) * 100) / 100
//       },
      
//       // ✅ COA-specific sum (filtered)
//       coaTotals: coaId ? {
//         debit: Math.round(coaTotalDebit * 100) / 100,
//         credit: Math.round(coaTotalCredit * 100) / 100,
//         difference: Math.round(Math.abs(coaTotalDebit - coaTotalCredit) * 100) / 100
//       } : null,
      
//       // ✅ BF (Brought Forward) = COA Debit - COA Credit
//       bf: Math.round(bf * 100) / 100,
      
//       // ✅ Count
//       count: allEntries.length,
//       coaDetailsCount: coaDetails.length,
      
//       // ✅ COA-specific details
//       coaDetails: coaId ? coaDetails : null,
      
//       // ✅ Full data (optional - can remove if too large)
//       data: allEntries 
//     });

//   } catch (error) {
//     console.error('Error fetching entries:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error fetching entries',
//       error: error.message 
//     });
//   }
// };






const get_BF_RF = async (req, res) => {
  try {
    const { coaId, mode, upToDate, excludeId } = req.query;

    console.log('=== BF/RF API PARAMS ===');
    console.log('coaId:', coaId);
    console.log('mode:', mode);
    console.log('upToDate:', upToDate);
    console.log('excludeId:', excludeId);
    console.log('========================');

    let masterWhereClause = {
      is_partially_deleted: false
    };

    // ✅ CREATE MODE: Use last JV date
    if (mode === 'create' || !mode) {
      const lastEntry = await JournalMaster.findOne({
        where: { voucherTypeId: 10 },
        order: [['id', 'DESC']]
      });

      if (!lastEntry) {
        return res.status(200).json({
          success: true,
          message: 'No Journal Voucher entries found',
          bf: 0,
          allTotals: { debit: 0, credit: 0, difference: 0 },
          coaTotals: null,
          count: 0,
          data: []
        });
      }

      masterWhereClause.date = { [Op.lte]: lastEntry.date };
      console.log('CREATE MODE - Last JV Date:', lastEntry.date);
    }

    // ✅ EDIT MODE: Only include vouchers BEFORE current one
    if (mode === 'edit') {
      if (!upToDate || !excludeId) {
        return res.status(400).json({
          success: false,
          message: 'upToDate and excludeId are required for edit mode'
        });
      }

      const parsedDate = new Date(upToDate);
      const parsedExcludeId = parseInt(excludeId);

      // Date < upToDate OR (Date = upToDate AND ID < excludeId)
      masterWhereClause[Op.or] = [
        { date: { [Op.lt]: parsedDate } },
        { 
          date: parsedDate, 
          id: { [Op.lt]: parsedExcludeId } 
        }
      ];

      console.log('EDIT MODE - Date:', parsedDate, 'Exclude ID:', parsedExcludeId);
    }

    // Get entries
    const allEntries = await JournalMaster.findAll({
      where: masterWhereClause,
      attributes: ['id', 'date', 'voucherTypeId', 'voucherNo', 'status', 'isOpening'],
      include: [{
        model: JournalDetail,
        as: 'details',
        attributes: ['id', 'description', 'jmId', 'coaId', 'amountDb', 'amountCr']
      }],
      order: [['date', 'ASC'], ['id', 'ASC']]
    });

    // Calculate totals
    let allTotalDebit = 0;
    let allTotalCredit = 0;
    let coaTotalDebit = 0;
    let coaTotalCredit = 0;
    let coaDetails = [];

    const parsedCoaId = coaId ? parseInt(coaId) : null;

    allEntries.forEach(entry => {
      if (entry.details) {
        entry.details.forEach(detail => {
          allTotalDebit += parseFloat(detail.amountDb) || 0;
          allTotalCredit += parseFloat(detail.amountCr) || 0;

          if (parsedCoaId && detail.coaId === parsedCoaId) {
            coaTotalDebit += parseFloat(detail.amountDb) || 0;
            coaTotalCredit += parseFloat(detail.amountCr) || 0;
            coaDetails.push({
              voucherNo: entry.voucherNo,
              voucherId: entry.id,
              date: entry.date,
              description: detail.description,
              amountDb: parseFloat(detail.amountDb) || 0,
              amountCr: parseFloat(detail.amountCr) || 0
            });
          }
        });
      }
    });

    // const bf = parsedCoaId ? (  coaTotalCredit - coaTotalDebit) : 0;
    const bf = parsedCoaId ? (   coaTotalDebit - coaTotalCredit ) : 0;

    console.log('=== RESULTS ===');
    console.log('Entries Count:', allEntries.length);
    console.log('BF:', bf);
    console.log('===============');

    res.json({
      success: true,
      mode: mode || 'create',
      upToDate,
      excludedId: excludeId ? parseInt(excludeId) : null,
      coaId: parsedCoaId,
      allTotals: {
        debit: Math.round(allTotalDebit * 100) / 100,
        credit: Math.round(allTotalCredit * 100) / 100,
        difference: Math.round(Math.abs(allTotalDebit - allTotalCredit) * 100) / 100
      },
      coaTotals: parsedCoaId ? {
        debit: Math.round(coaTotalDebit * 100) / 100,
        credit: Math.round(coaTotalCredit * 100) / 100,
        difference: Math.round(Math.abs(coaTotalDebit - coaTotalCredit) * 100) / 100
      } : null,
      bf: Math.round(bf * 100) / 100,
      count: allEntries.length,
      coaDetailsCount: coaDetails.length,
      coaDetails: parsedCoaId ? coaDetails : null,
      data: allEntries
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





module.exports = {
  createCompleteJournal,
  getAllJournals,
  getJournalById,
  updateCompleteJournal,
  deleteCompleteJournal,
  postVoucherToJournal,
  checkJournalStatus,
  // vTypeJournalVouchers,
  // vTypePettyVouchers
  // ✅ NEW
  postUnpostVoucher, // 
  getJournalVouchers, // ✅ NEW  
  getPettyCashVouchers, // ✅ NEW
  deleteVoucherAndReset, // ✅ NEW
  getSalesVouchers,
  postUnpostSalesVoucher,
  get_BF_RF
};
