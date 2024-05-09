const CrossPayUserService = require('../../../services/crosspay_user_service')
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
    const { uid, first_name, last_name, phone_number, profile_image, notification_settings, country, phone_code } = req.body

    const user = {
      uid: uid,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      phone_code: phone_code,
      country: country,
      date_created: dateHelper.getCurrentDate(),
      profile_image: profile_image,
      notification_settings: notification_settings,
      transactions: {
        total_transactions: 0.0,
        total_amount: 0.0,
      }
    }
    await CrossPayUserService.saveUserData(uid, user)
    const userData = await CrossPayUserService.getUser(uid)
    // Send welcome notification
    const message = {
      message: 'User created successfully',
      user: userData !== null ? userData.data() : null
    }
    return crossPayResponse.sendSuccessResponse(res, message)
  } catch (error) {
    crossPayLogger.error('Add new user', [error])
    return crossPayResponse.sendErrorResponse(res, 'Sever error. Please contact admin', 500)
  }
}

module.exports = addNewUser
