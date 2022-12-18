const mongoose = require('mongoose')

const Register = mongoose.model('Register', {
  name: String,
  email: String,
  password: String,
  confirmpassword: String
})

module.exports = Register