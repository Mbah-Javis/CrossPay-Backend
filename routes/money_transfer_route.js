const express = require('express')
const router = express.Router();
const { moneyTransfer } = require('../controllers/api_controller')
const initiateFMMTransfer = moneyTransfer.flutterwave.initiateFrancoPhoneMobilemoney

router.post('/franco-phone', initiateFMMTransfer)

module.exports = router;
