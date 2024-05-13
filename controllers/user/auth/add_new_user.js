const CrossPayUserService = require('../../../services/user/crosspay_user_service')
const FlutterwaveService = require('../../../services/payments/flutterwave/flutterwave_service')
const UserModel = require('../../../models/user_model')
const { crossPayLogger, crossPayResponse } = require('../../../utils/utils')
const { dateHelper, countryCurrency } = require('../../../utils/utils')

const addNewUser = async (req, res) => {
    const validator = new UserModel()
    const { error } = validator.validateData(req.body)
    if (error) {
      return crossPayResponse.sendErrorResponse(res, error.message, 400).end()
    }

  try {
    const { uid, first_name, last_name, phone_number, email,
      profile_image, notification_settings, country, contry_code } = req.body
    
    const currency = countryCurrency[country]
    let user = {
      uid: uid,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      email: email,
      contry_code: contry_code,
      country: country,
      date_created: dateHelper.getCurrentDate(),
      profile_image: profile_image,
      notification_settings: notification_settings,
      sub_account: {
        id: null,
        account_reference: null,
        default_currency: currency,
        wallet_balance: {
          [currency]: null
        },
        wallet_details: {
          [currency]: null,
        }
      },
      transactions: {
        total_transactions: 0.0,
        total_amount: 0.0,
      }
    }

    /* Create user account without any wallet and perform transfers from main flutterwave account balance */
    await CrossPayUserService.saveUserData(uid, user)
    
    const userData = await CrossPayUserService.getUser(uid)
    // Send welcome notification
    const message = {
      message: 'User created successfully',
      user: userData
    }
    return crossPayResponse.sendSuccessResponse(res, message)
  } catch (error) {
    crossPayLogger.error('Add new user', [error])
    return crossPayResponse.sendErrorResponse(res, 'Sever error. Please contact admin', 500)
  }
}

module.exports = addNewUser
