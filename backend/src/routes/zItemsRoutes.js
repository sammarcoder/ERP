// routes/zItems.routes.js
const express = require('express');
const router = express.Router();
const {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getItemsByClass,
    searchItems,
    getItemsByClassFilters
} = require('../controllers/zItems.controller');

// Basic CRUD routes
router.post('/items', createItem);
router.get('/items', getAllItems);
router.get('/items/search', searchItems);
router.get('/items/:id', getItemById);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

// Special routes
router.get('/items/class/:classId/level/:classLevel', getItemsByClass);
router.get('/items/by-class-filters', getItemsByClassFilters);

module.exports = router;
