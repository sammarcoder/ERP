const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/', orderController.createCompleteOrder);

router.get('/', orderController.getAllOrders);

router.get('/:id', orderController.getOrderById);

router.put('/:id', orderController.updateCompleteOrder);

router.delete('/:id', orderController.deleteCompleteOrder);

router.put('/update-status/:id', orderController.updateOrderStatus);


module.exports = router;
