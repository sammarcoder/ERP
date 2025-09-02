// // 

// const {
//     createJournalMaster,
//     getAllJournalMasters,
//     getJournalMasterById,
//     updateJournalMaster,
//     deleteJournalMaster,

// } = require('../controllers/JournalMaster.controller');


// const express = require('express');
// const router = express.Router();

// router.post('/create', createJournalMaster);
// router.get('/get',getAllJournalMasters);
// router.get('/get/:id',getJournalMasterById);
// router.put('/update/:id',updateJournalMaster);
// router.delete('/delete/:id',deleteJournalMaster)

// module.exports = router



































// routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createCompleteJournal,
  getAllJournals,
  getJournalById,
  updateCompleteJournal,
  deleteCompleteJournal
} = require('../controllers/journalMaster.controller');

// Combined endpoints
router.post('/create-complete', createCompleteJournal);
router.get('/get-all', getAllJournals);
router.get('/get/:id', getJournalById);
router.put('/update/:id', updateCompleteJournal);
router.delete('/delete/:id', deleteCompleteJournal);

module.exports = router;
