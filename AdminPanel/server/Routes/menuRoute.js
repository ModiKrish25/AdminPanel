const express = require('express');
const router = express.Router();
const menuController = require('../Controller/menuController');

// GET all menu items
router.get('/', menuController.getAllMenuItems);

// POST new menu item
router.post('/', menuController.createMenuItem);

// PUT update menu item
router.put('/:id', menuController.updateMenuItem);

// DELETE menu item
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
