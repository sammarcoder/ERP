// routes/ZMasterType.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ZMasterType.controller');

// GET /api/master-types/get - Get all
router.get('/get', controller.getAll);

// GET /api/master-types/type-options - Get type options for dropdown
router.get('/type-options', controller.getTypeOptions);

// GET /api/master-types/type/:type - Get by type (1-5)
router.get('/type/:type', controller.getByType);

// GET /api/master-types/get/:id - Get by ID
router.get('/get/:id', controller.getById);

// POST /api/master-types/create - Create
router.post('/create', controller.create);

// PUT /api/master-types/put/:id - Update
router.put('/put/:id', controller.update);

// DELETE /api/master-types/delete/:id - Delete
router.delete('/delete/:id', controller.remove);

// PUT /api/master-types/toggle-status/:id - Toggle status
router.put('/toggle-status/:id', controller.toggleStatus);

module.exports = router;
