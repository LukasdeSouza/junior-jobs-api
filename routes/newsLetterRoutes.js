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

router.get('/:fullName', verifyJWT, async (req, res) => {
  const fullname = req.params.id

  try {
    const usercv = await UserCV.findOne({ fullname: fullname })
    if (!usercv) {
      res.status(422).json({ message: 'Desculpe! Nenhum usuário com este nome foi encontrado' })
      return
    }
    res.status(200).json(usercv)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

module.exports = router

