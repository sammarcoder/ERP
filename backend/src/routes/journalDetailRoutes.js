const express = require('express')
const router = express.Router()
const { createJournalDetail,
    getAllJournalDetail,
    updateJournalDetailById,
    getJournalDetailById,
    destroyJournalDetailById
} = require('../controllers/JournalDetail.controller')

// Journal Details routes start from there
router.post('/create',createJournalDetail);
router.get('/get-all',getAllJournalDetail);
router.get('/get/:id',getJournalDetailById);
router.delete('/delete/:id',destroyJournalDetailById);
router.put('/update/:id',updateJournalDetailById)


module.exports = router




