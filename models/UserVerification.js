const mongoose = require('mongoose')

const UserVerification = mongoose.model('UserVerification', {
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
})

module.exports = UserVerification