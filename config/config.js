const fbAdmin = require('firebase-admin')
const OneSignal = require('onesignal-node')
const Flutterwave = require('flutterwave-node-v3')
const serviceAccount = require('./serviceAccountKey.json')
const i18next = require('i18next')
const Backend = require('i18next-node-fs-backend')
const onesignalAppId = process.env.ONESIGNAL_APP_ID
const onesignalApiKey = process.env.ONESIGNAL_API_KEY
const flwPublicKey = process.env.FLW_PUBLIC_KEY
const flwSecreteKey = process.env.FLW_SECRETE_KEY
const oneSignalClient = new OneSignal.Client(onesignalAppId, onesignalApiKey)
const flwApi = new Flutterwave(flwPublicKey, flwSecreteKey)

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.FB_DATABASE_URL
})

const gCloudConfig = {
  credentials: {
    private_key: serviceAccount.private_key,
    client_email: serviceAccount.client_email
  }
}

i18next.use(Backend).init({
  fallbackLng: 'en',
  backend: {
    loadPath: '../locales/{{lng}}/{{ns}}.json'
  },
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: {
      translation: require('../locales/en.json')
    },
    fr: {
      translation: require('../locales/fr.json')
    }
  }
})

const db = fbAdmin.firestore()
const auth = fbAdmin.auth()

module.exports = { db, auth, gCloudConfig, oneSignalClient, i18next, flwApi }
