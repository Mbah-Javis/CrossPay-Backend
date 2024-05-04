const { auth } = require('../config/config')
const CrossPayUserService = require('../services/crosspay_user_service')
const { crossPayLogger, crossPayResponse } = require('../utils/utils')

module.exports = async (req, res, next) => {
  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else {
    return crossPayResponse.sendErrorResponse(res, 'Unauthorized', 401).end()
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken)
    const uid = decodedToken.uid
    // Get authenticated user
    const user = await CrossPayUserService.getUser(uid)
    if (user !== null) {
      req.user = user
      next()
    } else {
      return crossPayResponse.sendErrorResponse(res, 'User data not found', 404).end()
    }
  } catch (err) {
    crossPayLogger.error('Error while verifying token ', [err])
    const message = { message: 'Error while verifying token ', error: err }
    return crossPayResponse.sendErrorResponse(res, message, 401)
  }
}
