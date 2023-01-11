const mongoose = require('mongoose')

const UserNewPassword = mongoose.model('UserNewPassword', {
  password: String,
  confirmpassword: String,
})

module.exports = UserNewPassword