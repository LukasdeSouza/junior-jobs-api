const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  confirmpassword: String,
  verified: Boolean,
  paidUser: Boolean,
  createdAt: Date
})

module.exports = User