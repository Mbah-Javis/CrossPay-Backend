const crossPayResponse = {

  sendSuccessResponse: function (res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data
    })
  },

  sendErrorResponse: function (res, message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message
      }
    })
  }
}

module.exports = crossPayResponse
