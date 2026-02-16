

// routes/ZGin.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ZGin.controller');

router.get('/get', controller.getAll);
router.get('/get/:id', controller.getById);
router.get('/next-number', controller.getNextGinNumber);
router.get('/available-batches/:itemId', controller.getAvailableBatchesForItem);
router.get('/available-batches-edit/:itemId/:ginId', controller.getAvailableBatchesForEdit);
router.post('/create', controller.create);
router.put('/put/:id', controller.update);
router.delete('/delete/:id', controller.remove);
router.put('/status/:id', controller.updateStatus);

module.exports = router;

