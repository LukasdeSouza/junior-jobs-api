const router = require('express').Router()

const Register = require('../models/Register')

router.post('/', async (req, res) => {

  const { name, email, password, confirmpassword } = req.body

  if (!name) {
    return res.status(422).json({ msg: 'Campo Nome é Obrigatório' })
  }

  const register = {
    name,
    email,
    password,
    confirmpassword
  }

  try {
    await Register.create(register)
    res.status(201).json({ success: 'Usuário Cadastrado com Sucesso' })
  }
  catch (error) {
    res.status(500).json({ error: error })
  }

})

module.exports = router
