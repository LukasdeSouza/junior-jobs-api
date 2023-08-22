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

  try {
    await UserCV.create(email)
    res.status(201).json({ success: 'Inscrito com Sucesso!' })
  } catch (error) {
    res.status(500).json({ error: "Ops! Não foi realizar a inscrição", error })
  }
})


module.exports = router