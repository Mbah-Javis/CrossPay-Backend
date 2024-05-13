const { db } = require('../../config/config')

class CrossPayTransactionService {
  static allTransactions = 'all_users_transactions'
  static userTransactions = 'user_transactions'
  static transactions = 'transactions'

  static async saveTransaction (uuid, transactionData) {
    return await db.collection(this.allTransactions).doc(uuid).set(transactionData)
  }

  static async saveUserTransaction (uuid, userId, transactionData) {
    return await db
      .collection(this.userTransactions)
      .doc(userId)
      .collection(this.transactions)
      .doc(uuid).
      set(transactionData)
  }

  static async getTransaction (uuid) {
    return await db.collection(this.allTransactions).doc(uuid).get()
  }

  static async updateTransactionStatus (uuid, status) {
    return await db.collection(this.allTransactions).doc(uuid).update({ 'status': status })
  }

  static async updateUserTransactionStatus (uuid, userId, status) {
    return await db
      .collection(this.userTransactions)
      .doc(userId)
      .collection(this.transactions)
      .doc(uuid)
      .update({ 'status': status })
  }

  static async updateDeliveredStatus(uuid, status) {
    return await db.collection(this.allTransactions).doc(uuid).update({ 'delivered_status': status })
  }

  static async updateUserDeliveredStatus(uuid, userId, status) {
    return await db
    .collection(this.userTransactions)
    .doc(userId)
    .collection(this.transactions)
    .doc(uuid)
    .update({ 'delivered_status': status })
  }
}

module.exports = CrossPayTransactionService
