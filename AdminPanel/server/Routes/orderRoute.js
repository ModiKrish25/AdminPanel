const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController');

// Create a new order
router.post('/add', orderController.createOrder);

// Get orders for a specific user by email
router.get('/user/:email', orderController.getUserOrders);

// Get all orders (Admin)
router.get('/all', orderController.getAllOrders);

// Get dashboard analytics
router.get('/dashboard-data', orderController.getDashboardData);

// Update order status (Admin)
router.put('/update/:id', orderController.updateOrderStatus);

module.exports = router;
