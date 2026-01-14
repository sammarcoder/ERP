// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createCompleteJournal,
  getAllJournals,
  getJournalById,
  updateCompleteJournal,
  deleteCompleteJournal,
  postVoucherToJournal,
  checkJournalStatus,
    postUnpostVoucher, // ✅ NEW
  getJournalVouchers, // ✅ NEW
  getPettyCashVouchers, // ✅ NEW
  // vTypeJournalVouchers,
  // vTypePettyVouchers
  deleteVoucherAndReset,
  getSalesVouchers,
  postUnpostSalesVoucher
} = require('../controllers/JournalMaster.controller');

// Combined endpoints
router.post('/create-complete', createCompleteJournal);
router.get('/get-all', getAllJournals);
router.get('/get/:id', getJournalById);
router.put('/update/:id', updateCompleteJournal);
router.delete('/delete/:id', deleteCompleteJournal);

router.post('/post-voucher/:stockMainId', postVoucherToJournal);
router.get('/check-status/:stockMainId', checkJournalStatus); // ADD THIS
router.post('/post-unpost/:id', postUnpostVoucher);

// ✅ NEW: Get vouchers by type
router.get('/vtype/journal-vouchers', getJournalVouchers);

router.get('/vtype/petty-vouchers', getPettyCashVouchers);
router.post('/delete-voucher/:stockMainId', deleteVoucherAndReset);
router.get('/sales-vouchers', getSalesVouchers);

router.post('/sales-voucher-post-unpost/:id', postUnpostSalesVoucher);
// router.get('/vtype/journal-vouchers', vTypeJournalVouchers); //  New route for Journal Vouchers
// router.get('/vtype/petty-vouchers', vTypePettyVouchers); // New route for Petty Vouchers

module.exports = router;
