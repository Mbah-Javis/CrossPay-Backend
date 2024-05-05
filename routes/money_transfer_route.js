const express = require('express')
const router = express.Router();
const { moneyTransfer } = require('../controllers/api_controller')
const initiateTransfer = moneyTransfer.flutterwave.initiateFrancoPhoneMobilemoney

router.post('/flw', initiateTransfer)

module.exports = router;
