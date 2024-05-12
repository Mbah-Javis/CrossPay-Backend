const { flwApi, flwClient } = require('../../../config/config')

class FlutterwaveService {

  static charge = {
    XAF: this.fMMobileMoney,
    XOF: this.fMMobileMoney,
    GHS: this.ghMobileMoney,
    KES: this.mpesaMobileMoney,
    UGX: this.ugMobileMoney,
    RWF: this.rwMobileMoney,
    ZMW: this.zmMobileMoney
  }

  static async createSubaccount(accountName, mobileNumber, email) {
    const payload = {
        account_name: accountName,
        mobilenumber: mobileNumber,
        email: email
    }
    const response = await flwClient.post('/payout-subaccounts', payload)
    return response
  }

  static async createWallet(accountReference, currency) {
    const response = await flwClient.get(`payout-subaccounts/${accountReference}/static-account?currency=${currency}`)
    return response
  }

  static async getWalletBalance(accountReference, currency) {
    const response = await flwClient.get(`payout-subaccounts/${accountReference}/balances?currency=${currency}`)
    return response
  }

  static async fMMobileMoney(payload) {
    const response = await flwApi.MobileMoney.franco_phone(payload)
    return response
  }

  static async ghMobileMoney(payload) {
    const response = await flwApi.MobileMoney.ghana(payload)
    return response
  }

  static async mpesaMobileMoney(payload) {
    const response = await flwApi.MobileMoney.mpesa(payload)
    return response
  }

  static async ugMobileMoney(payload) {
    const response = await flwApi.MobileMoney.uganda(payload)
    return response
  }

  static async rwMobileMoney(payload) {
    const response = await flwApi.MobileMoney.rwanda(payload)
    return response
  }

  static async zmMobileMoney(payload) {
    const response = await flwApi.MobileMoney.zambia(payload)
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
