// routes/ZMgrn.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ZMgrn.controller');

router.get('/get', controller.getAll);
router.get('/get/:id', controller.getById);
router.get('/next-number', controller.getNextMGRNNumber);
router.get('/gins-for-mgrn', controller.getGinsForMgrn);
// router.get('/gin-summary/:ginId', controller.getGinProductionSummary);
router.post('/create', controller.create);
router.put('/put/:id', controller.update);
router.delete('/delete/:id', controller.remove);

module.exports = router;
