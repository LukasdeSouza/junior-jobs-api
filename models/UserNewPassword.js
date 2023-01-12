const mongoose = require('mongoose')

const UserNewPassword = mongoose.model('UserNewPassword', {
  userId: String,
  password: String,
})

module.exports = UserNewPassword