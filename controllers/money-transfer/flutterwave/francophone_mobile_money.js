const { v4: uuidv4 } = require('uuid')
const TransactionModel = require('../../../models/transaction_model')
const CrossPayTransactionService = require('../../../services/transaction/crosspay_transaction_service')
const FlutterwaveService = require('../../../services/payments/flutterwave/flutterwave_service')
const { crossPayLogger, crossPayResponse } = require('../../../utils/utils')
const { dateHelper } = require('../../../utils/utils');
const TransactionStatus = require('../../../models/transaction_status');

const initiateFrancoPhoneMobilemoney = async (req, res) => {
    const validator = new TransactionModel()
    const { error } = validator.validateData(req.body)
    if (error) {
        return crossPayResponse.sendErrorResponse(res, error.message, 400).end()
    }

    try {
      const txUuid = uuidv4();
      const reference = `CP_${txUuid.split('-').at(0)}`.toUpperCase()
      const {amount, currency, contry_code, 
        country, network, operator,
        sender_number, receive_amount, 
        receiver_currency, receiver_country_code,
        receiver_country, receiver_number, receiver_name, } = req.body
      const {first_name, last_name, uid, email } = req.user
      const dateCreated = dateHelper.getCurrentDate()
      const fullname = `${first_name} ${last_name}`
      const payload = {
        'tx_ref': reference,
        'amount': amount,
        'currency': currency,
        'country': country,
        'email': email,
        'phone_number': `${contry_code}${sender_number}`,
        'fullname': fullname,
        'meta': {
          'amount': amount,
          'uuid': txUuid,
          'user_id': uid,
          'sender': fullname,
          'mobile_number': sender_number,
          'sender_country': country,
          'currency': currency,
          'contry_code': contry_code,
          'network': network,
          'operator': operator,
          'receive_amount': receive_amount,
          'receiver_currency': receiver_currency,
          'receiver_country': receiver_country,
          'receiver_country_code': receiver_country_code,
          'receiver_number': receiver_number,
          'receiver_name': receiver_name,
          'date_created': dateCreated,
          'tx_ref': reference
        },
      };
  
      const response = await FlutterwaveService.charge[currency](payload)
      crossPayLogger.info('Flutterwave charge response', [response])
      if (response.status === 'success') {
        const transaction = {
          status: TransactionStatus.PENDING,
          amount: amount,
          uuid: txUuid,
          user_id: uid,
          delivered_status: TransactionStatus.PENDING,
          email: email,
          tx_id: response.data.id,
          tx_ref: reference,
          meta: payload.meta
        }

        await CrossPayTransactionService.saveTransaction(txUuid, transaction)
        await CrossPayTransactionService.saveUserTransaction(txUuid, uid, transaction)
        // Send transaction initiate notification
        return crossPayResponse.sendSuccessResponse(res, response)
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
