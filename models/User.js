const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  confirmpassword: String,
  verified: Boolean,
  createdAt: { type: Date, default: Date.now },
  subscripted: {
    current_period_end: Time,
    current_period_start: Time,
    status: Boolean,
    clientSecret: String,
    customerId: String,
    subscriptionId: String
  },

})

module.exports = User