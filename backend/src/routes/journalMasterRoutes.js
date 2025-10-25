





















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
  getPettyCashVouchers // ✅ NEW
  // vTypeJournalVouchers,
  // vTypePettyVouchers
} = require('../controllers/journalMaster.controller');

// Combined endpoints
router.post('/create-complete', createCompleteJournal);
router.get('/get-all', getAllJournals);
router.get('/get/:id', getJournalById);
router.put('/update/:id', updateCompleteJournal);
router.delete('/delete/:id', deleteCompleteJournal);
router.post('/post-voucher/:stockMainId', postVoucherToJournal);
router.get('/check-status/:stockMainId', checkJournalStatus); // ADD THIS
// ✅ NEW: Post/Unpost functionality
router.post('/post-unpost/:id', postUnpostVoucher);

// ✅ NEW: Get vouchers by type
router.get('/vtype/journal-vouchers', getJournalVouchers);
router.get('/vtype/petty-vouchers', getPettyCashVouchers);

// router.get('/vtype/journal-vouchers', vTypeJournalVouchers); //  New route for Journal Vouchers
// router.get('/vtype/petty-vouchers', vTypePettyVouchers); // New route for Petty Vouchers

module.exports = router;
