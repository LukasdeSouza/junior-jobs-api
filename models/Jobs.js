const mongoose = require('mongoose')

const Jobs = mongoose.model('Jobs', {
  urlImage: String,
  name: String,
  title: String,
  description: String,
  salary: String,
  local: String,
  link: String,
  dateItWasCreated: Date
})

module.exports = Jobs