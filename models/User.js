const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: String,
  email: String,
  type: String,
  cnpj: String,
  password: String,
  confirmpassword: String,
  verified: Boolean
})

module.exports = User