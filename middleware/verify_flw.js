const { crossPayLogger, crossPayResponse } = require('../utils/utils')

module.exports = (req, res, next) => {
  const secretHash = process.env.FLW_SECRET_HASH
  const signature = req.headers['verif-hash']
  if (!signature || signature !== secretHash) {
    crossPayLogger.warn('unauthorized flutterwave', [signature])
    return crossPayResponse.sendErrorResponse(res, 'Unauthorized', 401).end()
  } else {
    return next()
  }
}
