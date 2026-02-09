// routes/zlcv.routes.js

const express = require('express');
const router = express.Router();
const zlcvController = require('../controllers/zlcv.controller');

// GET all ZLCV records (with pagination)
router.get('/', zlcvController.getAll);

// GET ZLCV by ID
router.get('/:id', zlcvController.getById);

// CREATE new ZLCV
router.post('/', zlcvController.create);

// UPDATE ZLCV
router.put('/:id', zlcvController.update);

// DELETE ZLCV
router.delete('/:id', zlcvController.remove);

// BULK DELETE
router.post('/bulk-delete', zlcvController.bulkDelete);

module.exports = router;
