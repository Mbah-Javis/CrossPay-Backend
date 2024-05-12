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
    
    const default_currency = countryCurrency[country]
    const currency = default_currency.toLowerCase()
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
          ngn: null,
          [currency]: null
        },
        wallet_details: {
          [currency]: null,
          ngn: null,
        }
      },
      transactions: {
        total_transactions: 0.0,
        total_amount: 0.0,
      }
    }

    /* Create user account without any wallet and perform transfers from main flutterwave account balance */
    await CrossPayUserService.saveUserData(uid, user)
    
  /*   // Create virtual  subaccount for funding and make transfers without using main account balance
    const accountName = `${first_name} ${last_name}`
    const mobileNumber = `${contry_code}${phone_number}`
    const subAccount = await FlutterwaveService.createSubaccount(accountName, mobileNumber, email, country)
    crossPayLogger.debug('Create Flutterwave subaccount', [subAccount])
    if (subAccount.data.status === 'success') {
      const accountReference = subAccount.data.data.account_reference
      user.sub_account.id = subAccount.data.data.id
      user.sub_account.account_reference = accountReference
      await CrossPayUserService.saveUserData(uid, user)
      
      // Create virtual wallets for funding. NGN is created by default
      const subAc = await FlutterwaveService.createWallet(accountReference, default_currency)
      user.sub_account.wallet_details[currency] = subAc.data.status === 'success' ? subAc.data.data : null;
      
      // Get virtual wallets balance
      const dfWallet = await FlutterwaveService.getWalletBalance(accountReference, default_currency)
      user.sub_account.wallet_balance[currency] = dfWallet.data.status === 'success' ? dfWallet.data.data : null
      const ngnWallet = await FlutterwaveService.getWalletBalance(accountReference, 'NGN')
      user.sub_account.wallet_balance.ngn = ngnWallet.data.status === 'success' ? ngnWallet.data.data : null

      await CrossPayUserService.updateWalletBalance(uid, currency, user.sub_account.wallet_balance[currency])
      await CrossPayUserService.updateWalletBalance(uid, 'ngn', user.sub_account.ngn)
    }  */
    
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
