const { db } = require('../config/config')

class CrossPayUserService {
  static users = 'users'

  static async getUser (uid) {
    const ref = await db.collection(this.users).doc(uid).get()
    return ref.exists ? ref.data() : null
  }

  static async saveUserData (uid, userData) {
    return await db.collection(this.users).doc(uid).set(userData)
  }

  static async getNotificationSettings (uid) {
    const ref = await db.collection(this.users).doc(uid).get()
    const userData = ref.data().notification_settings
    const settings = {
      language: userData.language,
      player_id: userData.player_id
    }
    return settings
  }
}

module.exports = CrossPayUserService
