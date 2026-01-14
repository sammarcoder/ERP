// controllers/salesVoucher.controller.js

const db = require('../models');
const { 
  JournalMaster, 
  JournalDetail, 
  ZvoucherType, 
  Stk_main, 
  Stk_Detail, 
  ZCoa, 
  ZItems, 
  Order_Main, 
  sequelize 
} = db;

// ═══════════════════════════════════════════════════════════════
// GET APIs
// ═══════════════════════════════════════════════════════════════

// Get all sales vouchers
const getAllSalesVouchers = async (req, res) => {
  try {
    console.log('═══════════════════════════════════════');
    console.log('📥 GET /api/sales-voucher/get-all');
    console.log('═══════════════════════════════════════');

    const vouchers = await JournalMaster.findAll({
      where: { 
        voucherTypeId: 12,
        is_partially_deleted: false 
      },
      include: [
        {
          model: JournalDetail,
          as: 'details',
          include: [{ model: ZCoa, as: 'coa' }]
        },
        { model: ZvoucherType, as: 'voucherType' },
        {
          model: Stk_main,
          as: 'Voucher',
          include: [
            { model: ZCoa, as: 'account' },
            { model: Order_Main, as: 'order' }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${vouchers.length} sales vouchers`);
    console.log('═══════════════════════════════════════');

    res.json({ success: true, data: vouchers });
  } catch (error) {
    console.error('💥 Error in getAllSalesVouchers:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single sales voucher by ID
const getSalesVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('═══════════════════════════════════════');
    console.log(`📥 GET /api/sales-voucher/get/${id}`);
    console.log('═══════════════════════════════════════');

    const voucher = await JournalMaster.findOne({
      where: { 
        id,
        voucherTypeId: 12 
      },
      include: [
        {
          model: JournalDetail,
          as: 'details',
          include: [{ model: ZCoa, as: 'coa' }]
        },
        { model: ZvoucherType, as: 'voucherType' },
        {
          model: Stk_main,
          as: 'Voucher',
          include: [
            { model: ZCoa, as: 'account' },
            { model: Order_Main, as: 'order' },
            {
              model: Stk_Detail,
              as: 'details',
              include: [
                { model: ZItems, as: 'item' },
                { model: ZCoa, as: 'batchDetails' }
              ]
            }
          ]
        }
      ]
    });

    if (!voucher) {
      console.log('❌ Voucher not found');
      return res.status(404).json({ success: false, error: 'Voucher not found' });
    }

    console.log(`✅ Found voucher: ${voucher.voucherNo}`);
    console.log('═══════════════════════════════════════');

    res.json({ success: true, data: voucher });
  } catch (error) {
    console.error('💥 Error in getSalesVoucherById:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get sales voucher by GDN ID
const getSalesVoucherByGdnId = async (req, res) => {
  try {
    const { gdnId } = req.params;
    console.log('═══════════════════════════════════════');
    console.log(`📥 GET /api/sales-voucher/get-by-gdn/${gdnId}`);
    console.log('═══════════════════════════════════════');

    const voucher = await JournalMaster.findOne({
      where: { 
        stk_Main_ID: gdnId,
        voucherTypeId: 12 
      },
      include: [
        {
          model: JournalDetail,
          as: 'details',
          include: [{ model: ZCoa, as: 'coa' }]
        },
        { model: ZvoucherType, as: 'voucherType' }
      ]
    });

    if (!voucher) {
      console.log('❌ No voucher found for this GDN');
      return res.status(404).json({ success: false, error: 'No voucher found for this GDN' });
    }

    console.log(`✅ Found voucher: ${voucher.voucherNo} for GDN ID: ${gdnId}`);
    console.log('═══════════════════════════════════════');

    res.json({ success: true, data: voucher });
  } catch (error) {
    console.error('💥 Error in getSalesVoucherByGdnId:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get sales voucher stats
const getSalesVoucherStats = async (req, res) => {
  try {
    console.log('═══════════════════════════════════════');
    console.log('📥 GET /api/sales-voucher/stats');
    console.log('═══════════════════════════════════════');

    const [total, posted, unposted, deleted] = await Promise.all([
      JournalMaster.count({ where: { voucherTypeId: 12, is_partially_deleted: false } }),
      JournalMaster.count({ where: { voucherTypeId: 12, status: true, is_partially_deleted: false } }),
      JournalMaster.count({ where: { voucherTypeId: 12, status: false, is_partially_deleted: false } }),
      JournalMaster.count({ where: { voucherTypeId: 12, is_partially_deleted: true } })
    ]);

    const stats = { total, posted, unposted, deleted };

    console.log('✅ Stats:', stats);
    console.log('═══════════════════════════════════════');

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('💥 Error in getSalesVoucherStats:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════
// POST APIs
// ═══════════════════════════════════════════════════════════════

// Generate voucher number
const generateSalesVoucherNumber = async () => {
  const lastSV = await JournalMaster.findOne({
    where: { voucherTypeId: 12 },
    order: [['id', 'DESC']]
  });

  if (!lastSV) return 'SV-1';

  const match = (lastSV.voucherNo || '').match(/(\d+)$/);
  const nextSeq = match ? parseInt(match[1], 10) + 1 : lastSV.id + 1;
  return `SV-${nextSeq}`;
};

// Create journal detail entries (helper)
const createJournalDetailEntries = async (stockMain, journalMasterId, transaction, calculatedTotals = null) => {
  console.log('───────────────────────────────────────────────────────────────');
  console.log('📝 createJournalDetailEntries()');

  let customerAmount, carriageAmount, batchTotals, grandTotal;

  if (calculatedTotals) {
    console.log('✅ Using FRONTEND calculated values');
    customerAmount = calculatedTotals.customerDebit;
    carriageAmount = calculatedTotals.carriageAmount;
    batchTotals = calculatedTotals.batchTotals;
    grandTotal = calculatedTotals.totalNet;

    console.log('   customerDebit:', customerAmount);
    console.log('   carriageAmount:', carriageAmount);
    console.log('   totalNet:', grandTotal);
    console.log('   batches:', Object.keys(batchTotals).length);
  } else {
    console.log('⚠️ Using DATABASE fallback calculation');
    batchTotals = {};
    grandTotal = 0;

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
      const batchName = detail.batchDetails?.acName || `Batch-${batchNo}`;
      
      if (!batchTotals[batchNo]) {
        batchTotals[batchNo] = { amount: 0, batchName };
      }
      batchTotals[batchNo].amount += netAmount;
      grandTotal += netAmount;
    });

    carriageAmount = parseFloat(stockMain.Carriage_Amount) || 0;
    customerAmount = grandTotal - carriageAmount;

    console.log('   customerAmount (calc):', customerAmount);
    console.log('   carriageAmount (calc):', carriageAmount);
    console.log('   grandTotal (calc):', grandTotal);
  }

  // Build descriptions
  const subCity = stockMain.order?.sub_city || '';
  const subCustomer = stockMain.order?.sub_customer || '';
  const customerName = stockMain.account?.acName || '';

  let customerDesc = 'S.Inv';
  if (subCity) customerDesc += `, ${subCity}`;
  if (subCustomer) customerDesc += `, ${subCustomer}`;

  let carriageDesc = 'S.Inv';
  if (customerName) carriageDesc += `, ${customerName}`;

  const journalDetails = [];
  let lineId = 1;

  // ROW 1: Customer (DEBIT)
  journalDetails.push({
    jmId: journalMasterId,
    lineId: lineId++,
    coaId: stockMain.COA_ID,
    description: customerDesc,
    chqNo: null,
    recieptNo: '',
    ownDb: 0,
    ownCr: 0,
    rate: 1,
    amountDb: customerAmount,
    amountCr: 0,
    isCost: false,
    currencyId: 1,
    status: false
  });
  console.log(`   Row ${lineId - 1}: Customer DEBIT = ${customerAmount}`);

  // ROW 2: Carriage (DEBIT)
  if (carriageAmount > 0 && stockMain.Carriage_ID) {
    journalDetails.push({
      jmId: journalMasterId,
      lineId: lineId++,
      coaId: stockMain.Carriage_ID,
      description: carriageDesc,
      chqNo: null,
      recieptNo: '',
      ownDb: 0,
      ownCr: 0,
      rate: 1,
      amountDb: carriageAmount,
      amountCr: 0,
      isCost: true,
      currencyId: 1,
      status: false
    });
    console.log(`   Row ${lineId - 1}: Carriage DEBIT = ${carriageAmount}`);
  }

  // Batch entries (CREDIT)
  Object.entries(batchTotals).forEach(([batchId, batchData]) => {
    journalDetails.push({
      jmId: journalMasterId,
      lineId: lineId++,
      coaId: parseInt(batchId) || 999,
      description: batchData.batchName,
      chqNo: null,
      recieptNo:'',
      ownDb: 0,
      ownCr: 0,
      rate: 1,
      amountDb: 0,
      amountCr: batchData.amount,
      isCost: false,
      currencyId: 1,
      status: false
    });
    console.log(`   Row ${lineId - 1}: Batch "${batchData.batchName}" CREDIT = ${batchData.amount}`);
  });

  await JournalDetail.bulkCreate(journalDetails, { transaction });

  console.log('───────────────────────────────────────────────────────────────');
  console.log(`✅ Created ${journalDetails.length} journal detail entries`);
  console.log(`📊 Summary: Customer=${customerAmount}, Carriage=${carriageAmount}, Total=${grandTotal}`);

  return {
    journalDetails,
    totals: {
      totalRows: journalDetails.length,
      netTotal: grandTotal,
      carriageAmount,
      customerAmount,
      batches: Object.keys(batchTotals).length
    }
  };
};

// Create journal entries (helper)
const createJournalEntries = async (stockMain, stockMainId, transaction, calculatedTotals = null) => {
  console.log('───────────────────────────────────────────────────────────────');
  console.log('📝 createJournalEntries()');

  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId }
  });

  if (existingJournal) {
    console.log('❌ Journal already exists - use edit mode');
    return { success: false, error: 'Journal already exists - use edit mode' };
  }

  const voucherTypeId = stockMain.Stock_Type_ID;
  const voucherNo = voucherTypeId === 12 ? await generateSalesVoucherNumber() : stockMain.Number;

  console.log(`📄 Creating JournalMaster with voucherNo: ${voucherNo}`);

  const journalMaster = await JournalMaster.create({
    date: stockMain.Date,
    stk_Main_ID: stockMainId,
    voucherTypeId: voucherTypeId,
    voucherNo: voucherNo,
    status: false,
    isOpening: false
  }, { transaction });

  console.log(`✅ JournalMaster created: ID=${journalMaster.id}, VoucherNo=${voucherNo}`);

  const { journalDetails, totals } = await createJournalDetailEntries(
    stockMain, 
    journalMaster.id, 
    transaction,
    calculatedTotals
  );
  
  return {
    success: true,
    message: 'Journal created successfully',
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

// Edit journal entries (helper)
// const editJournalEntries = async (stockMain, stockMainId, transaction, calculatedTotals = null) => {
//   console.log('───────────────────────────────────────────────────────────────');
//   console.log('📝 editJournalEntries()');

//   const existingJournal = await JournalMaster.findOne({
//     where: { stk_Main_ID: stockMainId }
//   });

//   if (!existingJournal) {
//     console.log('❌ No journal found - use create mode');
//     return { success: false, error: 'No journal found - use create mode' };
//   }

//   if (existingJournal.status === true) {
//     console.log('❌ Cannot edit posted journal');
//     return { success: false, error: 'Cannot edit posted journal. UnPost first.' };
//   }

//   console.log(`🗑️ Deleting old details for jmId: ${existingJournal.id}`);

//   await JournalDetail.destroy({
//     where: { jmId: existingJournal.id },
//     transaction
//   });

//   await existingJournal.update({ date: stockMain.Date }, { transaction });

//   const { journalDetails, totals } = await createJournalDetailEntries(
//     stockMain, 
//     existingJournal.id, 
//     transaction,
//     calculatedTotals
//   );

//   console.log(`✅ Re-created ${journalDetails.length} journal details`);

//   return {
//     success: true,
//     message: 'Journal updated successfully',
//     mode: 'edit',
//     data: {
//       journalMaster: {
//         id: existingJournal.id,
//         voucherNo: existingJournal.voucherNo,
//         status: 'UnPost'
//       },
//       summary: totals
//     }
//   };
// };



const editJournalEntries = async (stockMain, stockMainId, transaction, calculatedTotals = null) => {
  console.log('───────────────────────────────────────────────────────────────');
  console.log('📝 editJournalEntries()');

  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId }
  });

  if (!existingJournal) {
    console.log('❌ No journal found - use create mode');
    return { success: false, error: 'No journal found - use create mode' };
  }

  if (existingJournal.status === true) {
    console.log('❌ Cannot edit posted journal');
    return { success: false, error: 'Cannot edit posted journal. UnPost first.' };
  }

  console.log(`🗑️ Deleting old details for jmId: ${existingJournal.id}`);

  // Delete old journal details
  await JournalDetail.destroy({
    where: { jmId: existingJournal.id },
    transaction
  });

  // ✅ Update JournalMaster - Reset is_partially_deleted to false
  await existingJournal.update({ 
    date: stockMain.Date,
    is_partially_deleted: false  // ✅ Reset to false on re-generate
  }, { transaction });

  console.log('✅ Reset is_partially_deleted to false');

  // Create new journal details
  const { journalDetails, totals } = await createJournalDetailEntries(
    stockMain, 
    existingJournal.id, 
    transaction,
    calculatedTotals
  );

  console.log(`✅ Re-created ${journalDetails.length} journal details`);

  return {
    success: true,
    message: 'Journal updated successfully',
    mode: 'edit',
    data: {
      journalMaster: {
        id: existingJournal.id,
        voucherNo: existingJournal.voucherNo,
        status: 'UnPost'
      },
      summary: totals
    }
  };
};

// Toggle status (helper)
const toggleJournalStatus = async (stockMain, stockMainId, transaction) => {
  console.log('───────────────────────────────────────────────────────────────');
  console.log('📝 toggleJournalStatus()');

  const existingJournal = await JournalMaster.findOne({
    where: { stk_Main_ID: stockMainId }
  });

  if (!existingJournal) {
    console.log('❌ No journal found');
    return { success: false, error: 'No journal found' };
  }

  const newStatus = !existingJournal.status;
  const statusText = newStatus ? 'Post' : 'UnPost';

  console.log(`🔄 Toggling status: ${existingJournal.status ? 'Post' : 'UnPost'} → ${statusText}`);

  await JournalMaster.update({ status: newStatus }, {
    where: { id: existingJournal.id },
    transaction
  });

  const updatedCount = await JournalDetail.update({ status: newStatus }, {
    where: { jmId: existingJournal.id },
    transaction
  });

  console.log(`✅ Updated ${updatedCount[0]} detail records to ${statusText}`);

  return {
    success: true,
    message: `Journal ${statusText.toLowerCase()}ed successfully`,
    mode: 'post',
    data: { id: existingJournal.id, status: statusText }
  };
};

// POST voucher to journal (create/edit/post)
const postVoucherToJournal = async (req, res) => {
  const { stockMainId } = req.params;
  const { mode = 'create', calculatedTotals } = req.body;
  
  const transaction = await sequelize.transaction();
  
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📥 POST /api/sales-voucher/post-voucher/' + stockMainId);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📌 Request Params:');
    console.log('   stockMainId:', stockMainId);
    console.log('───────────────────────────────────────────────────────────────');
    console.log('📌 Request Body:');
    console.log('   mode:', mode);
    console.log('   calculatedTotals:', calculatedTotals ? 'YES ✅' : 'NO ❌');
    console.log('───────────────────────────────────────────────────────────────');
    
    if (calculatedTotals) {
      console.log('📊 Calculated Totals Received:');
      console.log('   totalNet:', calculatedTotals.totalNet);
      console.log('   carriageAmount:', calculatedTotals.carriageAmount);
      console.log('   customerDebit:', calculatedTotals.customerDebit);
      console.log('   batchTotals:', JSON.stringify(calculatedTotals.batchTotals, null, 2));
    } else {
      console.log('⚠️ No calculatedTotals received - will use database fallback');
    }
    console.log('═══════════════════════════════════════════════════════════════');

    const stockMain = await Stk_main.findByPk(stockMainId, {
      include: [
        {
          model: Stk_Detail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item' },
            { model: ZCoa, as: 'batchDetails' }
          ]
        },
        { model: ZCoa, as: 'account' },
        { model: Order_Main, as: 'order' }
      ]
    });

    if (!stockMain) {
      console.log('❌ Stock main not found');
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Stock main not found' });
    }

    if (!stockMain.is_Voucher_Generated) {
      console.log('❌ Voucher not generated yet');
      await transaction.rollback();
      return res.status(400).json({ success: false, error: 'Voucher not generated yet' });
    }

    console.log(`📦 Found GDN: ${stockMain.Number}`);
    console.log(`📅 Date: ${stockMain.Date}`);
    console.log(`👤 Customer: ${stockMain.account?.acName || 'N/A'}`);
    console.log(`📝 Details count: ${stockMain.details?.length || 0}`);
    console.log('───────────────────────────────────────────────────────────────');

    let result;
    switch (mode.toLowerCase()) {
      case 'create':
        console.log('🔄 Mode: CREATE');
        result = await createJournalEntries(stockMain, stockMainId, transaction, calculatedTotals);
        break;
      case 'edit':
        console.log('🔄 Mode: EDIT');
        result = await editJournalEntries(stockMain, stockMainId, transaction, calculatedTotals);
        break;
      case 'post':
        console.log('🔄 Mode: POST/UNPOST');
        result = await toggleJournalStatus(stockMain, stockMainId, transaction);
        break;
      default:
        throw new Error(`Invalid mode: ${mode}`);
    }

    await transaction.commit();
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ Transaction committed successfully');
    console.log('📤 Response:', JSON.stringify(result, null, 2));
    console.log('═══════════════════════════════════════════════════════════════');

    res.json(result);

  } catch (error) {
    await transaction.rollback();
    console.log('═══════════════════════════════════════════════════════════════');
    console.error('💥 ERROR in postVoucherToJournal:', error.message);
    console.log('═══════════════════════════════════════════════════════════════');
    res.status(500).json({ success: false, error: error.message });
  }
};

// Post/UnPost sales voucher by journal ID
const postUnpostSalesVoucher = async (req, res) => {
  const { id } = req.params;
  
  const transaction = await sequelize.transaction();
  
  try {
    console.log('═══════════════════════════════════════');
    console.log(`📥 POST /api/sales-voucher/post-unpost/${id}`);
    console.log('═══════════════════════════════════════');

    const journalMaster = await JournalMaster.findByPk(id, { transaction });
    
    if (!journalMaster) {
      await transaction.rollback();
      console.log('❌ Voucher not found');
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    const newStatus = !journalMaster.status;
    const statusText = newStatus ? 'Post' : 'UnPost';
    
    console.log(`🔄 Sales Voucher ${id}: ${journalMaster.status ? 'Post' : 'UnPost'} → ${statusText}`);

    await JournalMaster.update(
      { status: newStatus },
      { where: { id: id }, transaction }
    );

    const updatedCount = await JournalDetail.update(
      { status: newStatus },
      { where: { jmId: id }, transaction }
    );

    console.log(`✅ Updated JournalMaster and ${updatedCount[0]} JournalDetail records to ${statusText}`);
    console.log('═══════════════════════════════════════');

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
    console.error('💥 Error in postUnpostSalesVoucher:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to post/unpost voucher',
      error: error.message
    });
  }
};

// Delete voucher and reset
const deleteVoucherAndReset = async (req, res) => {
  const { stockMainId } = req.params;
  const transaction = await sequelize.transaction();

  try {
    console.log('═══════════════════════════════════════');
    console.log(`📥 POST /api/sales-voucher/delete/${stockMainId}`);
    console.log('═══════════════════════════════════════');

    const journal = await JournalMaster.findOne({
      where: { stk_Main_ID: stockMainId },
      transaction
    });

    if (!journal) {
      await transaction.rollback();
      console.log('❌ Journal not found');
      return res.status(404).json({
        success: false,
        error: 'Journal not found for this GDN'
      });
    }

    if (journal.status === true) {
      await transaction.rollback();
      console.log('❌ Journal still posted - cannot delete');
      return res.status(400).json({
        success: false,
        error: 'Please UnPost the voucher before deleting'
      });
    }

    const deletedCount = await JournalDetail.destroy({
      where: { jmId: journal.id },
      transaction
    });
    console.log(`🗑️ Deleted ${deletedCount} journal details`);

    await journal.update({ is_partially_deleted: true }, { transaction });
    console.log('📝 Set is_partially_deleted = true');

    await Stk_main.update(
      { Status: 'UnPost' },
      { where: { ID: stockMainId }, transaction }
    );
    console.log('📝 Set stk_main.Status = UnPost');

    await transaction.commit();
    
    console.log('✅ Delete completed');
    console.log('═══════════════════════════════════════');

    res.json({
      success: true,
      message: 'Voucher deleted. GDN ready for re-generation.',
      data: { journalId: journal.id, voucherNo: journal.voucherNo }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('💥 Error in deleteVoucherAndReset:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  // GET APIs
  getAllSalesVouchers,
  getSalesVoucherById,
  getSalesVoucherByGdnId,
  getSalesVoucherStats,
  // POST APIs
  postVoucherToJournal,
  postUnpostSalesVoucher,
  deleteVoucherAndReset
};
