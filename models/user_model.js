const Joi = require('joi')

class UserModel {
  constructor () {
    this.userSchema = Joi.object({
      uid: Joi.string().required(),
      first_name: Joi.string().alphanum().min(3).max(30).required(),
      last_name: Joi.string().alphanum().min(3).max(30).required(),
      phone_number: Joi.number().required(),
      profile_image: Joi.string().allow(null),
      country: Joi.string().valid('CM'),
      phone_code: Joi.number().valid('237'),
      notification_settings: Joi.object({
        language: Joi.string().allow(null),
        device_info: Joi.object().allow(null),
        player_id: Joi.string().allow(null)
      }).required()
    })
  }

  validateData (data) {
    return this.userSchema.validate(data)
  }
}

module.exports = UserModel
