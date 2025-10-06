// routes/dispatch.js - COMPLETE FIXED ROUTES
const express = require('express');
const router = express.Router();
const {
  getAvailableBatchesForEdit,
  getAvailableBatchesForItem,
  createDispatch,
  getAllDispatches,
  getDispatchById,
  updateDispatch,
  deleteDispatch,
  getStockSummaryForItem,
  getDispatchStatistics
} = require('../controllers/dispatch.controller');

// FIXED: Available batches route - shows ALL batches for item
router.get('/available-batches/:itemId', getAvailableBatchesForItem);

router.get('/available-batches-edit/:itemId/:dispatchId', getAvailableBatchesForEdit);

// Stock summary route
router.get('/stock-summary/:itemId', getStockSummaryForItem);

// Statistics route
router.get('/statistics', getDispatchStatistics);

// CRUD routes
router.post('/', createDispatch);               // Create dispatch
router.get('/', getAllDispatches);              // Get all dispatches  
router.get('/:id', getDispatchById);            // Get dispatch by ID
router.put('/:id', updateDispatch);             // Update dispatch
router.delete('/:id', deleteDispatch);          // Delete dispatch

console.log('🚀 Dispatch routes loaded successfully');

module.exports = router;
