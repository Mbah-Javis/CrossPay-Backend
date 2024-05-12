const CrossPayUserService = require('../../../services/user/crosspay_user_service')
const FlutterwaveService = require('../../../services/payments/flutterwave/flutterwave_service')
const UserModel = require('../../../models/user_model')
const { crossPayLogger, crossPayResponse } = require('../../../utils/utils')
const { dateHelper } = require('../../../utils/utils')

const addNewUser = async (req, res) => {
    const validator = new UserModel()
    const { error } = validator.validateData(req.body)
    if (error) {
      crossPayResponse.sendErrorResponse(res, error.message, 400)
    }

  try {
    const { uid, first_name, last_name, phone_number,
      profile_image, notification_settings, country, contry_code } = req.body

    let user = {
      uid: uid,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      contry_code: contry_code,
      country: country,
      date_created: dateHelper.getCurrentDate(),
      profile_image: profile_image,
      notification_settings: notification_settings,
      sub_account: {
        id: null,
        account_reference: null,
        wallets: {
          USD: null,
        }
      },
      transactions: {
        total_transactions: 0.0,
        total_amount: 0.0,
      }
    }

    // Create sub account
    const accountName = `${first_name} ${last_name}`
    const mobileNumber = `${contry_code}${phone_number}`
    const subAccount = await FlutterwaveService.createSubaccount(accountName, mobileNumber, country)
    crossPayLogger('Create Flutterwave subaccount', [subAccount])
    if (subAccount.data.status === 'success') {
      const accountReference = subAccount.data.data.account_reference
      user.sub_account.id = subAccount.data.data.id
      user.sub_account.account_reference = accountReference

      // create USD wallet
      const wallet = await FlutterwaveService.createWallet(accountReference, 'USD')
      crossPayLogger('Create Flutterwave wallet', [wallet])
      if (wallet.data.status === 'success') {
        user.sub_account.wallets.USD = wallet.data.data
        await CrossPayUserService.saveUserData(uid, user)
      }

    }
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
