const express = require('express');
const router = express.Router();
const categoryController = require('../Controller/categoryController');

// GET all categories
router.get('/', categoryController.getAllCategories);

// POST new category
router.post('/', categoryController.createCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
