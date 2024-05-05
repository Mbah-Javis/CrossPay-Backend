const { v4: uuidv4 } = require('uuid')
const { flwApi } = require('../../../config/config')
const TransactionModel = require('../../../models/transaction_model')
const CrossPayTransactionService = require('../../../services/crosspay_transaction_service');
const { crossPayLogger, crossPayResponse } = require('../../../utils/utils')
const { dateHelper } = require('../../../utils/utils');
const TransactionStatus = require('../../../models/transaction_status');

const initiateFrancoPhoneMobilemoney = async (req, res) => {
    const validator = new TransactionModel()
    const { error } = validator.validateData(req.body)
    if (error) {
        crossPayResponse.sendErrorResponse(res, error.message, 400)
    }
    try {
      const txUuid = uuidv4();
      const reference = `CP_${txUuid.split('-').at(0)}`.toUpperCase()
      const {amount, sender_number, receiver_number, receiver_name, mobile_operator, currency} = req.body
      const {first_name, last_name, uid } = req.user
      const email = 'javismbah2025@gmail.com'
      const dateCreated = dateHelper.getCurrentDate()

      const payload = {
        "tx_ref": reference,
        "amount": `${amount}`,
        "currency": currency,
        "country": "CM",
        "email": email,
        "phone_number": sender_number,
        "fullname": `${first_name} ${last_name}`,
        "meta": {
          "uuid": txUuid,
          'user_id': uid,
          "sender_name": `${first_name} ${last_name}`,
          "sender_number": sender_number,
          "receiver_number": receiver_number,
          "receiver_name": receiver_name,
          "date_created": dateCreated,
          'mobile_operator': mobile_operator,
          "currency": currency
        },
      };
  
      const response = await flwApi.MobileMoney.franco_phone(payload)
      crossPayLogger.info('Flutterwave charge response', [response])
      if (response.status == "success") {
        const transaction = {
          status: TransactionStatus.PENDING,
          amount: amount,
          uuid: txUuid,
          user_id: uid,
          sender_name: `${first_name} ${last_name}`,
          sender_number: sender_number,
          receiver_number: receiver_number,
          receiver_name: receiver_name,
          date_created: dateCreated,
          currency: currency,
          email: email,
          tx_id: response.data.id,
          tx_ref: reference
        }

        await CrossPayTransactionService.saveTransaction(txUuid, transaction)
        return crossPayResponse.sendSuccessResponse(res, response, 200)
      } else {
        const message = {
            message: 'Failed to initiate transaction',
            error: response
        }
        return crossPayResponse.sendErrorResponse(res, message, 400)
      }
    } catch (error) {
        crossPayLogger.error('Sever error', [error])
        return crossPayResponse.sendErrorResponse(res, 'Sever error. Please contact admin', 500)
    }
}

module.exports = initiateFrancoPhoneMobilemoney
