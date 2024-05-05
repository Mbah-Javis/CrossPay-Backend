const Joi = require('joi')

class TransactionModel {
  constructor () {
    this.transactionSchema = Joi.object({
      user_id: Joi.string().required(),
      amount: Joi.number().required(),
      sender_number: Joi.number().required(),
      reciever_number: Joi.number().required(),
      reciever_name: Joi.string().required(),
      date_created: Joi.string().required(),
      mobile_operator: Joi.string().valid('mtn', 'orange').required(),
      currency: Joi.string().valid('xaf').required()
    })
  }

  validateData (data) {
    return this.transactionSchema.validate(data)
  }
}

module.exports = TransactionModel
