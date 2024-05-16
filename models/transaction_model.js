const Joi = require('joi')

class TransactionModel {
  constructor () {
    this.transactionSchema = Joi.object({
      amount: Joi.number().required(),
      receive_amount: Joi.number().required(),
      currency: Joi.string().valid('XAF').required(), /* 'XOF', 'GHS', 'KES', 'MWK', 'RWF', 'TZS', 'UGX', 'ZMW'*/
      country_code: Joi.string().valid(237).required(),
      country: Joi.string().valid('CM').required(),
      network: Joi.string().valid('MTN', 'ORANGE'), /* 'AIRTEL', 'TIGO', 'VODAFONE' */
      operator: Joi.string().valid('FMM').required(), /* 'WAVE', 'MTN', 'AIRTEL', 'TIGO', 'VODAFONE', 'MPX', 'MPS', 'EMONEY', 'FREEMONEY', 'ORANGEMONEY', 'AIRTELMW', 'AMOLEMONEY' */
      sender_number: Joi.number().required(),
      receiver_currency: Joi.string().valid('XAF').required(),
      receiver_country: Joi.string().valid('CM').required(),
      receiver_country_code: Joi.string().valid(237).required(),
      receiver_number: Joi.number().required(),
      receiver_name: Joi.string().required()
    })
  }

  validateData (data) {
    return this.transactionSchema.validate(data)
  }
}

module.exports = TransactionModel
