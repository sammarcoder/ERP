const express = require('express');
const router = express.Router();
const {
    ZCoaCreate,
    ZCoaGetAll,
    ZCoaGetById,
    ZCoaUpdate,
    ZCoaDelete
} = require('../controllers/zCoa.controller');

// Create route
router.post('/create', ZCoaCreate);

// Get all route
router.get('/get', ZCoaGetAll);

// Get by ID route
router.get('/get/:id', ZCoaGetById);

// Update route
router.put('/update/:id', ZCoaUpdate);

// Delete route
router.delete('/delete/:id', ZCoaDelete);

module.exports = router;
