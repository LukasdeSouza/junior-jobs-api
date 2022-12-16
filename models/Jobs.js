const mongoose = require('mongoose')

const Jobs = mongoose.model('Jobs', {
  urlImage: String,
  title: String,
  description: String,
  salary: Number,
  local: String,
  link: String,
  pagination: Number
})

module.exports = Jobs