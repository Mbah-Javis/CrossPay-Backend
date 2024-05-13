const CrossPayUserService = require('../../../services/user/crosspay_user_service')
const { crossPayLogger, crossPayResponse } = require('../../../utils/utils')

const getUserData = async (req, res) => {
  try {
    const id = req.params.id
    const userData = await CrossPayUserService.getUser(id)
    if (userData !== null) {
      const data = {
        message: 'User found',
        user: userData
      }
      return crossPayResponse.sendSuccessResponse(res, data)
    } else {
      return crossPayResponse.sendErrorResponse(res, 'User not found', 404)
    }
  } catch (error) {
    crossPayLogger.error('Get user data', [error])
    return crossPayResponse.sendErrorResponse(res, 'Sever error. Please contact admin', 500)
  }
}

module.exports = getUserData
