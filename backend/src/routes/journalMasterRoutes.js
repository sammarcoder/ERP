





















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
    checkJournalStatus
} = require('../controllers/journalMaster.controller');

// Combined endpoints
router.post('/create-complete', createCompleteJournal);
router.get('/get-all', getAllJournals);
router.get('/get/:id', getJournalById);
router.put('/update/:id', updateCompleteJournal);
router.delete('/delete/:id', deleteCompleteJournal);
router.post('/post-voucher/:stockMainId', postVoucherToJournal);
router.get('/check-status/:stockMainId', checkJournalStatus); // ADD THIS

module.exports = router;
