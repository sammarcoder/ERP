

























const express = require('express');
const router = express.Router();
const {
    createCompleteStock,
    getAllStock,
    getStockById,
    updateCompleteStock,
    deleteCompleteStock
} = require('../controllers/stock.controller');

// Basic CRUD routes
router.post('/stock', createCompleteStock);
router.get('/stock', getAllStock);
router.get('/stock/:id', getStockById);
router.put('/stock/:id', updateCompleteStock);
router.delete('/stock/:id', deleteCompleteStock);

module.exports = router;
