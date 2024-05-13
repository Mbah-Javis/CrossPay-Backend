const express = require('express')
const router = express.Router();
const { userController } = require('../controllers/api_controller')
const auth = require('../middleware/auth')
const addNewUser = userController.addNewUser
const getUserData = userController.getUserData

// Add new user data
router.post('/new', addNewUser)

// Get user data
router.get('/get/:id', getUserData)


module.exports = router;
