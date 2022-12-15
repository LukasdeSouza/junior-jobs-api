const mongoose = require('mongoose')

const Jobs = mongoose.model('Jobs', {
  title: String,
  description: String,
  salary: Number,
  local: String,
  pagination: Number
})

module.exports = Jobs