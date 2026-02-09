const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");

const zRoutes = require("./zRoutes");
const zCoaRoutes = require("./zCoa.Routes");
const journalDetailRoutes = require('./journalDetailRoutes')
const journalMasterRoutes = require('./journalMasterRoutes')

const zControlHead1Routes = require('./zHead1Routes');
const zHead2Routes = require('./zHead2Routes.js');
const zTypeRoutes = require('./zTypeRoutes');

const zClassType = require('./zClassType.js')
const zUomRoutes = require('./zUomRoutes.js')
const zItemsRoutes = require('./zItemsRoutes.js')

const orderRoutes = require('./orderRoutes.js')
const stockRoutes = require('./stockRoutes.js')
const grn = require('../controllers/grn.controller.js')
const zcurrencyRoutes = require('./zcurrencyRoutes.js')
// const dispatchController = require('../controllers/dispatch.controller.js')
const dispatchController = require('./dispatch.js')
const gdnRoutes = require('./gdn.js')

const salesVoucherRoutes = require('./salesVoucher.routes.js')
const zlcvRoutes = require('./zlcv.routes.js');


const masterTypeRoutes = require('./ZMasterType.routes');
const lcMainRoutes = require('./LcMain.routes');




router.use("/auth", authRoutes);
router.use("/z-control", zRoutes);

router.use("/z-coa", zCoaRoutes);
// router.use('/journal-detail', journalDetailRoutes);
router.use('/journal-master', journalMasterRoutes);


router.use('/z-control-head1', zControlHead1Routes);
router.use('/z-control-head2', zHead2Routes);
router.use('/z-coa-type', zTypeRoutes);

router.use('/z-classes', zClassType)
router.use('/z-uom', zUomRoutes)
router.use('/z-items', zItemsRoutes),

router.use('/order', orderRoutes);
router.use('/stock-order', stockRoutes)

router.use('/grn', grn);
router.use('/dispatch', dispatchController);
router.use('/gdn', gdnRoutes);

router.use('/transporter', require('./transporterRoutes'));

router.use('/salesman', require('./salesmanRoutes'));
router.use('/z-currency', require('./zcurrencyRoutes'));



router.use('/machine', require('./machineRoutes'));
router.use('/shift', require('./shiftRoutes'));
router.use('/department', require('./departmentRoutes'));
router.use('/employee', require('./employeeRoutes'));
router.use('/mould', require('./mouldRoutes'));
router.use('/moulding', require('./mouldingRoutes'));
router.use('/reports', require('./reportRoutes'));



router.use('/sales-voucher', salesVoucherRoutes);

router.use('/zlcv', zlcvRoutes);

router.use('/master-types', masterTypeRoutes);





router.use('/lc-main', lcMainRoutes);


module.exports = router