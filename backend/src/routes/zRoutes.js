const express = require('express');
const router = express.Router();
// Head Controller
const { ZHeadCreate, ZHeadUpdate, ZHeadDelete, ZHeadGet } = require('../controllers/zHead.controller');
// Salesman Controller
const { ZsalesManCreate, ZsalesManGetAll, ZsalesManGetById, ZsalesManUpdate, ZsalesManDelete } = require('../controllers/zSalesMan.controller');
// Voucher Type Controller
const { ZVoucherTypeCreate, ZVoucherTypeGetAll, ZVoucherTypeGetById, ZVoucherTypeUpdate, ZVoucherTypeDelete } = require('../controllers/zVoucherType.controller');
console.log(`z sales man import`, ZsalesManCreate);

// Z Head Routes
router.post('/create', ZHeadCreate);
router.get('/get', ZHeadGet);
router.put('/update/:id', ZHeadUpdate);
router.delete('/delete/:id', ZHeadDelete);

// Salesman Routes
router.post('/salesman/create', ZsalesManCreate);
router.get('/salesman', ZsalesManGetAll);
router.get('/salesman/:id', ZsalesManGetById);
router.put('/salesman/update/:id', ZsalesManUpdate);
router.delete('/salesman/delete/:id', ZsalesManDelete);


//  Voucher Type Routes
router.post('/voucher-type/create', ZVoucherTypeCreate);
router.get('/voucher-type', ZVoucherTypeGetAll);
router.get('/voucher-type/:id', ZVoucherTypeGetById);
router.put('/voucher-type/update/:id', ZVoucherTypeUpdate);
router.delete('/voucher-type/delete/:id', ZVoucherTypeDelete);

module.exports = router;