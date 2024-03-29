require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { off } = require('./models/Person')
const personRoutes = require('./routes/personRoutes')
const jobsRoutes = require('./routes/jobsRoutes')
const userRoutes = require('./routes/userRoutes')
const userCVRoutes = require('./routes/userCVRoutes')
const userSendNewPasword = require('./routes/sendNewPasswordRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const newsLetterRoutes = require('./routes/newsLetterRoutes')

const app = express()
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "X-Api-Key, Access-Control-Allow-Origin, Origin, X-Requested-With, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform, Content-Type, Accept, Referer, User-Agent, Authorization");
  next();
});

app.options(cors())

app.use('/person', personRoutes)

app.use('/jobs', jobsRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Seek Jobs API' })
})

app.use('/auth', userRoutes)

app.use("/usercv", userCVRoutes)

app.use('/send-new-password', userSendNewPasword)

app.use('/payment', paymentRoutes)

app.use('/newsletter', newsLetterRoutes)


const PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)
mongoose.connect(`mongodb+srv://SeekJobs:${PASSWORD}@cluster0.butjmpf.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Conexão Efetuada com Sucesso!')
    app.listen(4000)
  })
  .catch((err) => console.log(err))
