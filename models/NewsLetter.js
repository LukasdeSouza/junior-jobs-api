const mongoose = require('mongoose')

const NewsLetter = mongoose.model('NewsLetter', {
  email: String,
})

module.exports = NewsLetter