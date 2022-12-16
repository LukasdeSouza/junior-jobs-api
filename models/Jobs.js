const mongoose = require('mongoose')

const Jobs = mongoose.model('Jobs', {
  urlImage: String,
  title: String,
  description: String,
  tecnologies: String,
  salary: String,
  local: String,
  link: String,
  pagination: Number
})

module.exports = Jobs