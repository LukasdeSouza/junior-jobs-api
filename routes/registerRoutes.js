const router = require('express').Router()

const { genSalt } = require('bcrypt')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Register = require('../models/Register')


//Private Route

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ msg: "Acesso Negado" })
  }
  try {
    const secret = process.env.SECRET
    jwt.verify(token, secret)
    next()

  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: "Token Inválido" })
  }
}

router.get("/user/:id", checkToken, async (req, res) => {

  const id = req.params.id

  const user = await Register.findById(id, '-password -confirmpassword')

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" })
  }
  else {
    return res.status(200).json({ user })
  }
})


router.post('/register', async (req, res) => {

  const { name, email, type, cnpj, password, confirmpassword } = req.body

  const salt = await genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  if (!name) {
    return res.status(422).json({ msg: 'O campo Nome é obrigatório' })
  }
  if (!email) {
    return res.status(422).json({ msg: 'O campo Nome é obrigatório' })
  }
  if (!password) {
    return res.status(422).json({ msg: 'O campo Nome é obrigatório' })
  }
  if (password !== confirmpassword) {
    return res.status(422).json({ msg: 'As senhas não conferem' })
  }

  const register = {
    name,
    email,
    type,
    cnpj,
    password: passwordHash,
    confirmpassword: passwordHash
  }

  try {
    await Register.create(register)
    res.status(201).json({ success: 'Usuário Cadastrado com Sucesso' })
  }
  catch (error) {
    res.status(500).json({ error: error })
  }

})
router.post('/', async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(422).json({ msg: 'O campo Email é obrigatório' })
  }
  if (!password) {
    return res.status(422).json({ msg: 'O campo Senha é obrigatório' })
  }

  const userExists = await Register.findOne({ email: email })
  const allNeededInfo = await Register.find({ email: email }, '-password -confirmpassword')

  if (!userExists) {
    return res.status(404).json({ msg: "O usuário não está cadastrado. Deseja criar conta?" })
  }

  const checkPassword = await bcrypt.compare(password, userExists.password)

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha Inválida" })
  }

  try {
    const secret = process.env.SECRET
    const token = jwt.sign({
      id: userExists._id
    },
      secret,
    )
    res.status(200).json({ msg: "Autenticação Realizada com Sucesso", token, allNeededInfo })

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!" })
  }

  // const user = new Register({
  //   name,
  //   email,
  //   password
  // })

  // try {
  //   await user.save()
  //   res.status(201).json({ msg: "Usuário criado com sucesso" })

  // } catch (error) {

  //   console.log(error)
  //   res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' })
  // }

})

module.exports = router
