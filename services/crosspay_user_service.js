const { db } = require('../config/config')

class CrossPayUserService {
  static users = 'users'

  static async getUser (uid) {
    const ref = await db.collection(this.users).doc(uid).get()
    return ref.exists ? ref.data() : null
  }
}

module.exports = CrossPayUserService
