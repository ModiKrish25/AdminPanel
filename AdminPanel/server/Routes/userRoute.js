const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

// GET all users
// GET all users
router.get('/', userController.getAllUsers);

// Signup
router.post('/signup', userController.signup);

// Login
router.post('/login', userController.login);

// Logout
router.post('/logout', userController.logout);


// DELETE user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
