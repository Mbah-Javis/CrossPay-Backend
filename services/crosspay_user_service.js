const { db } = require('../config/config')

class CrossPayUserService {
  static users = 'users'

  static async getUser (uid) {
    const query = await db.collection(this.users).where('uid', '==', uid).get()
    return query.docs.length > 0 ? query.docs[0].data() : null
  }
}

module.exports = CrossPayUserService
