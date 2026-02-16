// routes/BatchReport.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/BatchReport.controller');

// Report 1: Batch Stock Ledger (Item-wise IN/OUT/Balance)
router.get('/stock-ledger', controller.getBatchStockLedger);

// Report 2: Batch In/Out Summary (Total IN + Individual OUT)
router.get('/in-out-summary', controller.getBatchInOutSummary);

// Get all batches that have stock entries
router.get('/batches', controller.getBatchesWithStock);

module.exports = router;
