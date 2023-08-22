const router = require('express').Router()
const jwt = require('jsonwebtoken')
const NewsLetter = require('../models/NewsLetter')
const dotenv = require('dotenv')
dotenv.config()



router.post('/register', async (req, res) => {
  const { email } = req.body

  if (!email) {
    res.status(422).json({ error: 'O Campo Email é obrigatório"' })
    return
  }

  let user = { email }

  try {
    await NewsLetter.create(user)
      .then((result) => res.status(201).json({ success: 'Inscrito com Sucesso!' }))
  } catch (error) {
    res.status(500).json({ error: "Ops! Não foi realizar a inscrição" })
  }
})

router.get('/register', async (req, res) => {
  try {
    const users = await NewsLetter.find()
    res.status(200).json(users)

  } catch (error) {
    res.status(500).json({ error: error })
  }
})


module.exports = router