const { db } = require('../config/config')

class CrossPayTransactionService {
  static transactions = 'user_transactions'

  static async saveTransaction (uuid, transactionData) {
    return await db.collection(this.transactions).doc(uuid).set(transactionData)
  }

  static async getTransaction (uuid) {
    return await db.collection(this.transactions).doc(uuid).get()
  }

  static async updateTransactionStatus (uuid, status) {
    return await db.collection(this.transactions).doc(uuid).update({ status })
  }
}

module.exports = CrossPayTransactionService
