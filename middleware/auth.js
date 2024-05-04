const { auth } = require('../config/config');
const CrossPayUserService = require('../services/crosspay_user_service');
const {crossPayLogger, crossPayResponse} = require('../utils/utils');

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return crossPayResponse.sendErrorResponse(res, "Unathorized", 401).end();
  }

  auth.verifyIdToken(idToken)
    .then((decodedToken) => {
        const uid = decodedToken.uid;
        // Get authenticated user
        // const user = CrossPayUserService.getUser(uid);
        // req.user = user;
    })
    .then((data) => {
      return next();
    })
    .catch((err) => {
      crossPayLogger.error("Error while verifying token ", [err]);
      const message = {message: "Error while verifying token ", error: err};
      return crossPayResponse.sendErrorResponse(res, message, 401);
    });
};
