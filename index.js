const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')

const { off } = require('./models/Person')
const personRoutes = require('./routes/personRoutes')
const jobsRoutes = require('./routes/jobsRoutes')


const app = express()
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.use('/person', personRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Lucas Node API Example' })
})

app.use('/jobs', jobsRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Lucas Jobs API Example' })
})

// app.get('/customer', (req, res) => {
//   res.json(
//     {
//       customer: {
//         personalInfo: {
//           name: "Lucas",
//           age: 25,
//           country: 'BR',
//           gender: 'Male'
//         },
//         phoneInfo: {
//           DDD: 34,
//           phoneNumber: '99246-1158',
//           operator: 'TIM'
//         },
//         adress: {
//           city: 'Uberlândia',
//           zipCode: '38410-727',
//           neighbourhood: 'Laranjeiras',
//         }
//       },
//       enterprise: {
//         name: 'BestDeal',
//         position: 'Frontend Developer',
//         salary: 'R$4.000',
//         timeInThePosition: '3 Months'
//       }
//     })
// })

const PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)
mongoose.connect(`mongodb+srv://LukasdeSouza:${PASSWORD}@cluster0.ovsw5ph.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Conectado ao MongoDB')
    app.listen(4000)
  })
  .catch((err) => console.log(err))
