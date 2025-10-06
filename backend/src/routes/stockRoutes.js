

























const express = require('express');
const router = express.Router();
const {
    createCompleteStock,
    getAllStock,
    getStockById,
    updateCompleteStock,
    deleteCompleteStock,
    updateStockDetail,
    updateStockMain
} = require('../controllers/stock.controller');

// Basic CRUD routes
router.post('/stock', createCompleteStock);
router.get('/stock', getAllStock);
router.get('/stock/:id', getStockById);
router.put('/stock/:id', updateCompleteStock);
router.delete('/stock/:id', deleteCompleteStock);
router.put('/stock-detail/:id', updateStockDetail);
router.put('/stock-main/:id', updateStockMain);  // ADD THIS LINE

module.exports = router;
