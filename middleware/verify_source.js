const createLogger = require('../utils/crosspay_logger');

module.exports = (req, res, next) => {
  const secretHash = process.env.CROSSPAY_SECRET_HASH
  const signature = req.headers['verify-crosspay-hash']
  if (!signature || signature !== secretHash) {
    createLogger.warn('unauthorized', signature);
    return res.status(401).end()
  } else {
    return next()
  }
}
