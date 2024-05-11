const { flwApi } = require('../../../config/config')

class FlutterwaveService {

  static async fMMobileMoney(payload) {
    const response = await flwApi.MobileMoney.franco_phone(payload)
    return response
  }

  static async initiateTransfer(payload) {
    const response = await flwApi.Transfer.initiate(payload)
    return response
  }

  static async verify(transactionId) {
    const response = await flwApi.Transaction.verify({ id: transactionId })
    return response
  }

} 

module.exports = FlutterwaveService
