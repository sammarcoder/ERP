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
// const dispatchController = require('../controllers/dispatch.controller.js')
const dispatchController = require('./dispatch.js')

router.use("/auth", authRoutes);
router.use("/z-control", zRoutes);

router.use("/z-coa", zCoaRoutes);
router.use('/journal-detail', journalDetailRoutes);
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

router.use('/transporter', require('./transporterRoutes'));


module.exports = router