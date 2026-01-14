// routes/salesVoucher.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllSalesVouchers,
  getSalesVoucherById,
  getSalesVoucherByGdnId,
  getSalesVoucherStats,
  postVoucherToJournal,
  postUnpostSalesVoucher,
  deleteVoucherAndReset
} = require('../controllers/salesVoucher.controller');

// GET routes
router.get('/get-all', getAllSalesVouchers);
router.get('/get/:id', getSalesVoucherById);
router.get('/get-by-gdn/:gdnId', getSalesVoucherByGdnId);
router.get('/stats', getSalesVoucherStats);

// POST routes
router.post('/post-voucher/:stockMainId', postVoucherToJournal);
router.post('/post-unpost/:id', postUnpostSalesVoucher);
router.post('/delete/:stockMainId', deleteVoucherAndReset);

module.exports = router;
