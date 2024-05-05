const express = require('express')
const router = express.Router();
const { userController } = require('../controllers/api_controller')
const auth = require('../middleware/auth')
const addNewUser = userController.addNewUser

// Add new user data
router.post('/new', addNewUser)

// Get user data

module.exports = router;
