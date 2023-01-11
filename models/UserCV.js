const mongoose = require('mongoose')

const UserCV = mongoose.model('UserCV', {
  profileImage: String,
  fullName: String,
  dateOfBirth: String,
  aboutMe: String,
  phone: String,
  civilState: String,
  interestJob: String,
  sex: String,
  institutionName: String,
  courseName: String,
  beginDate: String,
  endDate: String,
  courseStatus: String,
  education: String,
  expertise: String,
  occupationArea: String,
  experiences: String,
  github: String,
  linkedin: String,
  behance: String,
  portfolio: String
})

module.exports = UserCV