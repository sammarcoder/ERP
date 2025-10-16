const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

/**
 * @route   POST /api/orders
 * @desc    Create a new complete order with details
 * @access  Private
 */
router.post('/', orderController.createCompleteOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders with pagination and filtering
 * @access  Private
 */
router.get('/', orderController.getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get complete order by ID with all details
 * @access  Private
 */
router.get('/:id', orderController.getOrderById);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update complete order with details
 * @access  Private
 */
router.put('/:id', orderController.updateCompleteOrder);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete complete order and details
 * @access  Private
 */
router.delete('/:id', orderController.deleteCompleteOrder);

router.put('/update-status/:id', orderController.updateOrderStatus);


module.exports = router;
