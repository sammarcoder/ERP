const express = require('express');
const router = express.Router();
const {
    ZCoaCreate,
    ZCoaGetAll,
    ZCoaGetById,
    ZCoaUpdate,
    ZCoaDelete,
    ZCoaGetByCoaTypes,
    ZCoaGetByCoaTypesCarriage
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
// Get by Coa Types route
router.get('/by-coa-types', ZCoaGetByCoaTypes);

router.get('/by-coa-type-carriage',ZCoaGetByCoaTypesCarriage)
module.exports = router;
