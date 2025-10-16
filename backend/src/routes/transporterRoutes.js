const express = require('express');
const router = express.Router();
const {
  getAllTransporters,
  getTransporter,
  createTransporter,
  updateTransporter,
  deleteTransporter,
  restoreTransporter
} = require('../controllers/transporter.controller');

// GET /api/transporter - Get all transporters with pagination & search
router.get('/', getAllTransporters);

// GET /api/transporter/:id - Get single transporter
router.get('/:id', getTransporter);

// POST /api/transporter - Create new transporter
router.post('/', createTransporter);

// PUT /api/transporter/:id - Update transporter
router.put('/:id', updateTransporter);

// DELETE /api/transporter/:id - Delete/Deactivate transporter
router.delete('/:id', deleteTransporter);

// PATCH /api/transporter/:id/restore - Restore transporter
router.patch('/:id/restore', restoreTransporter);

module.exports = router;
