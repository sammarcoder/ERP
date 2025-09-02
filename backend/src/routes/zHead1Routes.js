// routes/zControlHead1Routes.js
const express = require('express');
const router = express.Router();
const {
    createZControlHead1,
    getAllZControlHead1s,
    getZControlHead1ById,
    updateZControlHead1,
    deleteZControlHead1
} = require('../controllers/zHead1.controller');

router.post('/', createZControlHead1);
router.get('/', getAllZControlHead1s);
router.get('/:id', getZControlHead1ById);
router.put('/:id', updateZControlHead1);
router.delete('/:id', deleteZControlHead1);

module.exports = router;
