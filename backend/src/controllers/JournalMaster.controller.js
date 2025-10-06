

// controllers/journalController.js
const db = require('../models');
// const { JournalMaster, JournalDetail, ZvoucherType, ZCoa } = db;
const { JournalMaster, JournalDetail, Stk_main, Stk_Detail, ZCoa, ZItems } = db;
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












// const postVoucherToJournal = async (req, res) => {
//   const { stockMainId } = req.params;
  
//   const transaction = await sequelize.transaction();
  
//   try {
//     // Fetch dispatch data
//     const stockMain = await Stk_main.findByPk(stockMainId, {
//       include: [
//         {
//           model: Stk_Detail,
//           as: 'details',
//           include: [{ model: ZItems, as: 'item' }]
//         },
//         { model: ZCoa, as: 'account' }
//       ]
//     });

//     if (!stockMain || !stockMain.is_Voucher_Generated) {
//       return res.status(400).json({ success: false, error: 'Voucher not generated yet' });
//     }

//     // Check if already posted
//     const existingJournal = await JournalMaster.findOne({
//       where: { stk_Main_ID: stockMainId }
//     });

//     if (existingJournal) {
//       return res.status(400).json({ success: false, error: 'Already posted to journal' });
//     }

//     // FIXED: Use Stock_Type_ID directly (no mapping needed!)
//     // Your table already has: 11=Purchase, 12=Sales
//     const voucherTypeId = stockMain.Stock_Type_ID; // 11 or 12

//     console.log(`📋 Using voucherTypeId: ${voucherTypeId} for ${stockMain.Number}`);

//     // Create JournalMaster
//     const journalMaster = await JournalMaster.create({
//       date: stockMain.Date,
//       stk_Main_ID: stockMainId,
//       voucherTypeId: voucherTypeId, // DIRECT: 11 or 12
//       voucherNo: stockMain.Number,
//       status: stockMain.Status === 'Post'
//     }, { transaction });

//     // Calculate totals and batch grouping
//     const batchTotals = {};
//     let grandTotal = 0;

//     stockMain.details.forEach(detail => {
//       const price = parseFloat(detail.Stock_Price) || 0;
//       let qty = 0;
      
//       switch(detail.Sale_Unit) {
//         case '1': qty = parseFloat(detail.Stock_out_UOM_Qty) || 0; break;
//         case '2': qty = parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0; break;
//         case '3': qty = parseFloat(detail.Stock_out_UOM3_Qty) || 0; break;
//         default: qty = parseFloat(detail.Stock_out_UOM_Qty) || 0;
//       }
      
//       const gross = price * qty;
//       const discA = gross * (parseFloat(detail.Discount_A) || 0) / 100;
//       const afterA = gross - discA;
//       const discB = afterA * (parseFloat(detail.Discount_B) || 0) / 100;
//       const afterB = afterA - discB;
//       const discC = afterB * (parseFloat(detail.Discount_C) || 0) / 100;
//       const netAmount = afterB - discC;
      
//       const batchNo = detail.batchno || 'No Batch';
//       if (!batchTotals[batchNo]) {
//         batchTotals[batchNo] = 0;
//       }
//       batchTotals[batchNo] += netAmount;
//       grandTotal += netAmount;
//     });

//     const carriageAmount = parseFloat(stockMain.Carriage_Amount) || 0;
//     const customerAmount = grandTotal - carriageAmount;

//     console.log(`💰 Totals - Grand: ${grandTotal}, Carriage: ${carriageAmount}, Customer: ${customerAmount}`);

//     // Create journal entries
//     const journalDetails = [];
//     let lineId = 1;

//     // ROW 1: Customer Entry (Net - Carriage)
//     journalDetails.push({
//       jmId: journalMaster.id,
//       lineId: lineId++,
//       coaId: stockMain.COA_ID,
//       description: stockMain.Number,
//       chqNo: null,
//       recieptNo: stockMain.Number,
//       ownDb: customerAmount,
//       ownCr: 0,
//       rate: 1,
//       amountDb: customerAmount,
//       amountCr: 0,
//       isCost: false,
//       currencyId: 1,
//       status: true
//     });

//     console.log(`✅ ROW 1 - Customer Dr: ${customerAmount}`);

//     // ROW 2: Carriage Entry (if exists)
//     if (carriageAmount > 0 && stockMain.Carriage_ID) {
//       journalDetails.push({
//         jmId: journalMaster.id,
//         lineId: lineId++,
//         coaId: stockMain.Carriage_ID,
//         description: stockMain.Number,
//         chqNo: null,
//         recieptNo: stockMain.Number,
//         ownDb: carriageAmount,
//         ownCr: 0,
//         rate: 1,
//         amountDb: carriageAmount,
//         amountCr: 0,
//         isCost: true,
//         currencyId: 1,
//         status: true
//       });

//       console.log(`✅ ROW 2 - Carriage Dr: ${carriageAmount}`);
//     }

//     // REMAINING ROWS: Batch-wise Cr entries
//     Object.entries(batchTotals).forEach(([batchNo, batchTotal]) => {
//       journalDetails.push({
//         jmId: journalMaster.id,
//         lineId: lineId++,
//         coaId: parseInt(batchNo) || 999, // Use batch number as coaId
//         description: stockMain.Number,
//         chqNo: null,
//         recieptNo: stockMain.Number,
//         ownDb: 0,
//         ownCr: batchTotal,
//         rate: 1,
//         amountDb: 0,
//         amountCr: batchTotal,
//         isCost: false,
//         currencyId: 1,
//         status: true
//       });

//       console.log(`✅ BATCH ROW - Batch ${batchNo} Cr: ${batchTotal}`);
//     });

//     // Verify balance
//     const totalDr = journalDetails.reduce((sum, entry) => sum + entry.amountDb, 0);
//     const totalCr = journalDetails.reduce((sum, entry) => sum + entry.amountCr, 0);
    
//     console.log(`🧮 Balance Check - Dr: ${totalDr}, Cr: ${totalCr}, Balanced: ${totalDr === totalCr}`);

//     await JournalDetail.bulkCreate(journalDetails, { transaction });
//     await transaction.commit();

//     res.json({
//       success: true,
//       message: 'Voucher posted to journal successfully',
//       data: {
//         journalMaster: {
//           id: journalMaster.id,
//           voucherNo: journalMaster.voucherNo,
//           voucherTypeId: journalMaster.voucherTypeId
//         },
//         summary: {
//           totalRows: journalDetails.length,
//           netTotal: grandTotal,
//           carriageAmount: carriageAmount,
//           customerAmount: customerAmount,
//           batches: Object.keys(batchTotals).length,
//           totalDr: totalDr,
//           totalCr: totalCr,
//           balanced: totalDr === totalCr
//         },
//         journalEntries: journalDetails.map(detail => ({
//           lineId: detail.lineId,
//           coaId: detail.coaId,
//           description: detail.description,
//           debit: detail.amountDb,
//           credit: detail.amountCr
//         }))
//       }
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error('💥 Error posting to journal:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };





























// const postVoucherToJournal = async (req, res) => {
//   const { stockMainId } = req.params;
//   const { mode = 'create' } = req.body; // ADD MODE PARAMETER
  
//   const transaction = await sequelize.transaction();
  
//   try {
//     // Fetch dispatch data
//     const stockMain = await Stk_main.findByPk(stockMainId, {
//       include: [
//         {
//           model: Stk_Detail,
//           as: 'details',
//           include: [{ model: ZItems, as: 'item' }]
//         },
//         { model: ZCoa, as: 'account' }
//       ]
//     });

//     if (!stockMain || !stockMain.is_Voucher_Generated) {
//       return res.status(400).json({ success: false, error: 'Voucher not generated yet' });
//     }

//     console.log(`🔄 Journal operation mode: ${mode.toUpperCase()} for ${stockMain.Number}`);

//     // HANDLE DIFFERENT MODES
//     let result;
//     switch (mode.toLowerCase()) {
//       case 'create':
//         result = await handleCreateJournal(stockMain, stockMainId, transaction);
//         break;
//       case 'edit':
//         result = await handleEditJournal(stockMain, stockMainId, transaction);
//         break;
//       case 'post':
//         result = await handlePostJournal(stockMain, stockMainId, transaction);
//         break;
//       default:
//         throw new Error(`Invalid mode: ${mode}`);
//     }

//     await transaction.commit();
//     res.json(result);

//   } catch (error) {
//     await transaction.rollback();
//     console.error('💥 Error in journal operation:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // CREATE MODE: Create new journal entries with UnPost status
// const handleCreateJournal = async (stockMain, stockMainId, transaction) => {
//   // Check if already exists
//   const existingJournal = await JournalMaster.findOne({
//     where: { stk_Main_ID: stockMainId }
//   });

//   if (existingJournal) {
//     return { success: false, error: 'Journal already exists - use edit mode' };
//   }

//   const voucherTypeId = stockMain.Stock_Type_ID; // 11 or 12
  
//   // Create JournalMaster with UnPost status
//   const journalMaster = await JournalMaster.create({
//     date: stockMain.Date,
//     stk_Main_ID: stockMainId,
//     voucherTypeId: voucherTypeId,
//     voucherNo: stockMain.Number,
//     status: false // UnPost = false, Post = true
//   }, { transaction });

//   console.log(`✅ Created JournalMaster ID: ${journalMaster.id} with UnPost status`);

//   // Calculate and create journal details
//   const { journalDetails, totals } = await createJournalDetails(stockMain, journalMaster.id, transaction);
  
//   return {
//     success: true,
//     message: 'Journal created successfully with UnPost status',
//     mode: 'create',
//     data: {
//       journalMaster: {
//         id: journalMaster.id,
//         voucherNo: journalMaster.voucherNo,
//         status: 'UnPost'
//       },
//       summary: totals
//     }
//   };
// };

// // EDIT MODE: Update existing journal entries
// const handleEditJournal = async (stockMain, stockMainId, transaction) => {
//   // Find existing journal
//   const existingJournal = await JournalMaster.findOne({
//     where: { stk_Main_ID: stockMainId },
//     include: [{ model: JournalDetail, as: 'details' }]
//   });

//   if (!existingJournal) {
//     return { success: false, error: 'No journal found - use create mode' };
//   }

//   console.log(`🔄 Editing existing journal ID: ${existingJournal.id}`);

//   // Delete existing journal details
//   await JournalDetail.destroy({
//     where: { jmId: existingJournal.id },
//     transaction
//   });

//   // Update JournalMaster date if needed
//   await JournalMaster.update({
//     date: stockMain.Date,
//     voucherNo: stockMain.Number
//   }, {
//     where: { id: existingJournal.id },
//     transaction
//   });

//   // Recreate journal details with new data
//   const { journalDetails, totals } = await createJournalDetails(stockMain, existingJournal.id, transaction);

//   return {
//     success: true,
//     message: 'Journal updated successfully',
//     mode: 'edit',
//     data: {
//       journalMaster: {
//         id: existingJournal.id,
//         voucherNo: existingJournal.voucherNo,
//         status: existingJournal.status ? 'Post' : 'UnPost'
//       },
//       summary: totals
//     }
//   };
// };

// // POST MODE: Only change status from UnPost to Post
// const handlePostJournal = async (stockMain, stockMainId, transaction) => {
//   // Find existing journal
//   const existingJournal = await JournalMaster.findOne({
//     where: { stk_Main_ID: stockMainId }
//   });

//   if (!existingJournal) {
//     return { success: false, error: 'No journal found to post' };
//   }

//   if (existingJournal.status) {
//     return { success: false, error: 'Journal already posted' };
//   }

//   // Update status to Post
//   await JournalMaster.update({
//     status: true // Post = true
//   }, {
//     where: { id: existingJournal.id },
//     transaction
//   });

//   // Update all journal details status
//   await JournalDetail.update({
//     status: true
//   }, {
//     where: { jmId: existingJournal.id },
//     transaction
//   });

//   console.log(`✅ Posted journal ID: ${existingJournal.id} - Status changed to Post`);

//   return {
//     success: true,
//     message: 'Journal posted successfully',
//     mode: 'post',
//     data: {
//       journalMaster: {
//         id: existingJournal.id,
//         voucherNo: existingJournal.voucherNo,
//         status: 'Post'
//       }
//     }
//   };
// };

// // SHARED FUNCTION: Create journal detail entries
// const createJournalDetails = async (stockMain, journalMasterId, transaction) => {
//   // Calculate totals and batch grouping
//   const batchTotals = {};
//   let grandTotal = 0;

//   stockMain.details.forEach(detail => {
//     const price = parseFloat(detail.Stock_Price) || 0;
//     let qty = 0;
    
//     switch(detail.Sale_Unit) {
//       case '1': qty = parseFloat(detail.Stock_out_UOM_Qty) || 0; break;
//       case '2': qty = parseFloat(detail.Stock_out_SKU_UOM_Qty) || 0; break;
//       case '3': qty = parseFloat(detail.Stock_out_UOM3_Qty) || 0; break;
//       default: qty = parseFloat(detail.Stock_out_UOM_Qty) || 0;
//     }
    
//     const gross = price * qty;
//     const discA = gross * (parseFloat(detail.Discount_A) || 0) / 100;
//     const afterA = gross - discA;
//     const discB = afterA * (parseFloat(detail.Discount_B) || 0) / 100;
//     const afterB = afterA - discB;
//     const discC = afterB * (parseFloat(detail.Discount_C) || 0) / 100;
//     const netAmount = afterB - discC;
    
//     const batchNo = detail.batchno || 'No Batch';
//     if (!batchTotals[batchNo]) {
//       batchTotals[batchNo] = 0;
//     }
//     batchTotals[batchNo] += netAmount;
//     grandTotal += netAmount;
//   });

//   const carriageAmount = parseFloat(stockMain.Carriage_Amount) || 0;
//   const customerAmount = grandTotal - carriageAmount;

//   // Create journal entries
//   const journalDetails = [];
//   let lineId = 1;

//   // ROW 1: Customer Entry (Net - Carriage)
//   journalDetails.push({
//     jmId: journalMasterId,
//     lineId: lineId++,
//     coaId: stockMain.COA_ID,
//     description: stockMain.Number,
//     chqNo: null,
//     recieptNo: stockMain.Number,
//     ownDb: customerAmount,
//     ownCr: 0,
//     rate: 1,
//     amountDb: customerAmount,
//     amountCr: 0,
//     isCost: false,
//     currencyId: 1,
//     status: false // UnPost initially
//   });

//   // ROW 2: Carriage Entry (if exists)
//   if (carriageAmount > 0 && stockMain.Carriage_ID) {
//     journalDetails.push({
//       jmId: journalMasterId,
//       lineId: lineId++,
//       coaId: stockMain.Carriage_ID,
//       description: stockMain.Number,
//       chqNo: null,
//       recieptNo: stockMain.Number,
//       ownDb: carriageAmount,
//       ownCr: 0,
//       rate: 1,
//       amountDb: carriageAmount,
//       amountCr: 0,
//       isCost: true,
//       currencyId: 1,
//       status: false
//     });
//   }

//   // REMAINING ROWS: Batch-wise Cr entries
//   Object.entries(batchTotals).forEach(([batchNo, batchTotal]) => {
//     journalDetails.push({
//       jmId: journalMasterId,
//       lineId: lineId++,
//       coaId: parseInt(batchNo) || 999,
//       description: stockMain.Number,
//       chqNo: null,
//       recieptNo: stockMain.Number,
//       ownDb: 0,
//       ownCr: batchTotal,
//       rate: 1,
//       amountDb: 0,
//       amountCr: batchTotal,
//       isCost: false,
//       currencyId: 1,
//       status: false
//     });
//   });

//   // Save journal details
//   await JournalDetail.bulkCreate(journalDetails, { transaction });

//   console.log(`✅ Created ${journalDetails.length} journal detail entries`);

//   return {
//     journalDetails,
//     totals: {
//       totalRows: journalDetails.length,
//       netTotal: grandTotal,
//       carriageAmount: carriageAmount,
//       customerAmount: customerAmount,
//       batches: Object.keys(batchTotals).length
//     }
//   };
// };

// // CHECK JOURNAL STATUS
// const checkJournalStatus = async (req, res) => {
//   try {
//     const { stockMainId } = req.params;
    
//     const existingJournal = await JournalMaster.findOne({
//       where: { stk_Main_ID: stockMainId }
//     });
    
//     res.json({
//       success: true,
//       isPosted: !!existingJournal,
//       journalStatus: existingJournal ? (existingJournal.status ? 'Post' : 'UnPost') : null,
//       journalId: existingJournal?.id || null,
//       voucherNo: existingJournal?.voucherNo || null
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };









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
        { model: ZCoa, as: 'account' }
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

// CREATE MODE: Create new journal entries with UnPost status
const createJournalEntries = async (stockMain, stockMainId, transaction) => {
  // Check if already exists
  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId }
  });

  if (existingJournal) {
    return { success: false, error: 'Journal already exists - use edit mode' };
  }

  const voucherTypeId = stockMain.Stock_Type_ID; // 11 or 12
  
  // Create JournalMaster with UnPost status
  const journalMaster = await JournalMaster.create({
    date: stockMain.Date,
    stk_Main_ID: stockMainId,
    voucherTypeId: voucherTypeId,
    voucherNo: stockMain.Number,
    status: false // UnPost = false, Post = true
  }, { transaction });

  console.log(`✅ Created JournalMaster ID: ${journalMaster.id} with UnPost status`);

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

// EDIT MODE: Update existing journal entries
const editJournalEntries = async (stockMain, stockMainId, transaction) => {
  // Find existing journal
  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId },
    include: [{ model: JournalDetail, as: 'details' }]
  });

  if (!existingJournal) {
    return { success: false, error: 'No journal found - use create mode' };
  }

  console.log(`🔄 Editing existing journal ID: ${existingJournal.id}`);

  // Delete existing journal details
  await JournalDetail.destroy({
    where: { jmId: existingJournal.id },
    transaction
  });

  // Update JournalMaster date if needed
  await JournalMaster.update({
    date: stockMain.Date,
    voucherNo: stockMain.Number
  }, {
    where: { id: existingJournal.id },
    transaction
  });

  // Recreate journal details with new data
  const { journalDetails, totals } = await createJournalDetailEntries(stockMain, existingJournal.id, transaction);

  return {
    success: true,
    message: 'Journal updated successfully',
    mode: 'edit',
    data: {
      journalMaster: {
        id: existingJournal.id,
        voucherNo: existingJournal.voucherNo,
        status: existingJournal.status ? 'Post' : 'UnPost'
      },
      summary: totals
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

// SHARED FUNCTION: Create journal detail entries
const createJournalDetailEntries = async (stockMain, journalMasterId, transaction) => {
  // Calculate totals and batch grouping
  const batchTotals = {};
  let grandTotal = 0;

  stockMain.details.forEach(detail => {
    const price = parseFloat(detail.Stock_Price) || 0;
    let qty = 0;
    
    switch(detail.Sale_Unit) {
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
    if (!batchTotals[batchNo]) {
      batchTotals[batchNo] = 0;
    }
    batchTotals[batchNo] += netAmount;
    grandTotal += netAmount;
  });

  const carriageAmount = parseFloat(stockMain.Carriage_Amount) || 0;
  const customerAmount = grandTotal - carriageAmount;

  // Create journal entries
  const journalDetails = [];
  let lineId = 1;

  // ROW 1: Customer Entry (Net - Carriage)
  journalDetails.push({
    jmId: journalMasterId,
    lineId: lineId++,
    coaId: stockMain.COA_ID,
    description: stockMain.Number,
    chqNo: null,
    recieptNo: stockMain.Number,
    ownDb: customerAmount,
    ownCr: 0,
    rate: 1,
    amountDb: customerAmount,
    amountCr: 0,
    isCost: false,
    currencyId: 1,
    status: false // UnPost initially
  });

  // ROW 2: Carriage Entry (if exists)
  if (carriageAmount > 0 && stockMain.Carriage_ID) {
    journalDetails.push({
      jmId: journalMasterId,
      lineId: lineId++,
      coaId: stockMain.Carriage_ID,
      description: stockMain.Number,
      chqNo: null,
      recieptNo: stockMain.Number,
      ownDb: carriageAmount,
      ownCr: 0,
      rate: 1,
      amountDb: carriageAmount,
      amountCr: 0,
      isCost: true,
      currencyId: 1,
      status: false
    });
  }

  // REMAINING ROWS: Batch-wise Cr entries
  Object.entries(batchTotals).forEach(([batchNo, batchTotal]) => {
    journalDetails.push({
      jmId: journalMasterId,
      lineId: lineId++,
      coaId: parseInt(batchNo) || 999,
      description: stockMain.Number,
      chqNo: null,
      recieptNo: stockMain.Number,
      ownDb: 0,
      ownCr: batchTotal,
      rate: 1,
      amountDb: 0,
      amountCr: batchTotal,
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




































module.exports = {
  createCompleteJournal,
  getAllJournals,
  getJournalById,
  updateCompleteJournal,
  deleteCompleteJournal,
  postVoucherToJournal,
  checkJournalStatus
};
