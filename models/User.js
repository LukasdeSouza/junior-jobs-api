const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  confirmpassword: String,
  createdAt: { type: Date, default: Date.now },
  subscripted: {
    current_period_end: Date,
    current_period_start: Date,
    status: Boolean,
    clientSecret: String,
    customerId: String,
    subscriptionId: String
  },

})

module.exports = User