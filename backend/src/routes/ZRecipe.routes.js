// routes/ZRecipe.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ZRecipe.controller');

router.get('/get', controller.getAll);
router.get('/used-item-ids', controller.getUsedItemIds);
router.get('/get/:id', controller.getById);
router.get('/by-item/:itemId', controller.getByItemId);
router.post('/create', controller.create);
router.put('/put/:id', controller.update);
router.delete('/delete/:id', controller.remove);
router.put('/toggle-status/:id', controller.toggleStatus);

module.exports = router;
