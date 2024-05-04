const createLogger = require('../utils/crosspay_logger');
const crossPayResponse = require('../utils/crosspay_response');

module.exports = (req, res, next) => {
  const secretHash = process.env.CROSSPAY_SECRET_HASH
  const signature = req.headers['verify-crosspay-hash']
  if (!signature || signature !== secretHash) {
    createLogger.warn('unauthorized', [signature]);
    return crossPayResponse.sendErrorResponse(res, 'Unauthorized', 401).end();
  } else {
    return next()
  }
}
