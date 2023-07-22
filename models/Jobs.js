const mongoose = require('mongoose')

const Jobs = mongoose.model('Jobs', {
  // _id_empresa: String,
  urlImage: String,
  name: String,
  title: String,
  description: String,
  // tecnologies: String,
  // salary: String,
  local: String,
  link: String,
  // tier: String,
  // type: String,
})

module.exports = Jobs