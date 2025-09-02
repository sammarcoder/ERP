// routes/zControlHead2Routes.js
const express = require('express');
const router = express.Router();
const {
    createZControlHead2,
    getAllZControlHead2s,
    getZControlHead2ById,
    updateZControlHead2,
    deleteZControlHead2
} = require('../controllers/zHead2.controller');

router.post('/', createZControlHead2);
router.get('/get', getAllZControlHead2s);
router.get('/get/:id', getZControlHead2ById);
router.put('/update/:id', updateZControlHead2);
router.delete('/delete/:id', deleteZControlHead2);

module.exports = router;
