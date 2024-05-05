const express = require('express')
const router = express.Router();
const { moneyTransfer } = require('../controllers/api_controller')
const verifyFlw = require('../middleware/verify_flw')
const completeFlwTransaction = moneyTransfer.flutterwave.completeTransaction

// Flutterwave complete trasction web-hook
router.post('/flw', verifyFlw, completeFlwTransaction)

module.exports = router;
