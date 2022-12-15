const mongoose = require('mongoose')

const Jobs = mongoose.model('Jobs', {
  title: String,
  description: String,
  salary: Number,
  local: String
})

module.exports = Jobs