const Joi = require('joi')

class TransactionModel {
  constructor () {
    this.transactionSchema = Joi.object({
      amount: Joi.number().required(),
      sender_number: Joi.number().required(),
      receiver_number: Joi.number().required(),
      receiver_name: Joi.string().required(),
      mobile_operator: Joi.string().valid('MTN', 'ORANGE').required(),
      currency: Joi.string().valid('XAF').required(),
      contry_code: Joi.string().valid('237').required()
    })
  }

  validateData (data) {
    return this.transactionSchema.validate(data)
  }
}

module.exports = TransactionModel
