const { crossPayLogger, crossPayResponse } = require('../utils/utils')

module.exports = (req, res, next) => {
  const secretHash = process.env.CROSSPAY_SECRET_HASH
  const signature = req.headers['verify-crosspay-hash']
  if (!signature || signature !== secretHash) {
    crossPayLogger.warn('unauthorized', [signature])
    return crossPayResponse.sendErrorResponse(res, 'Unauthorized', 401).end()
  } else {
    return next()
  }
}
