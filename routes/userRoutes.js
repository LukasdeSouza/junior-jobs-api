const router = require('express').Router()

const { genSalt } = require('bcrypt')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

//nodemailer
const nodemailer = require('nodemailer')

//unique string
const { v4: uuidv4 } = require('uuid')

//.env
const dotenv = require('dotenv')
dotenv.config()

//nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: "gmail",
  port: 465,
  secure: false,
  auth: {
    user: 'lucasdesouzasilva112@gmail.com',
    pass: 'jqzxtfndoqidqrml'
  },

})

transporter.verify((error, success) => {
  if (error) {
    console.log('Não foi possível Conectar ao Gmail', error)
  }
  else {
    console.log("Conectado ao Gmail", success)
  }
})

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

  const user = await User.findById(id, '-password -confirmpassword')

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" })
  }
  else {
    return res.status(200).json({ user })
  }
})

const sendVerificationEmail = ({ _id, email, name }) => {

  const currentUrl = "https://seek-jobs-website-api.onrender.com"
  // const uniqueString = uuidv4() + _id

  //email content
  const mailOptions = {
    from: "[Seek Jobs] <lucasdesouzasilva112@gmail.com>",
    to: email,
    subject: "Confirme seu Email - Seek Jobs",
    html: `
    <img src="https://i.ibb.co/HYX3CB1/logo-size.jpg" <br/> <h3> Olá ${name} 😎! </h3> <h4> Confirme seu Email para a acessar a plataforma Seek Jobs. </h4>
     <h4> Basta Clicar no Link para realizar a Confirmação do seu Cadastro </h4> 
     <a href=${currentUrl + "/auth/verify/" + _id}> ${currentUrl + "/auth/verify/" + _id}</a>
     <br/>
     <p>Seek Jobs - Open Source Project</p> <a href='https://seek-jobs.netlify.app/'>https://seek-jobs.netlify.app/</a>
     `
  }

  try {
    transporter.sendMail(mailOptions)
  } catch (error) {
    return res.json({ msg: 'Ocorreu um erro ao enviar o Email', error })
  }
}

router.get("/verify/:userId", async (req, res) => {

  const { userId } = req.params
  const isUserVerified = await User.findById(userId)

  if (isUserVerified.verified) {
    return res.status(200).json({ msg: "O Usuário já está autenticado. Faça Login para entrar" })
  }

  else {
    await User.findByIdAndUpdate(userId, { verified: true })
    // const secret = process.env.SECRET
    // const token = jwt.sign({
    //   id: userId
    // },
    //   secret,
    // )
    res.status(200).json({ msg: "Usuário Autenticado com Sucesso! Faça Login para Continuar" })
  }

})

router.post('/register', async (req, res) => {

  const { name, email, password, confirmpassword } = req.body

  const salt = await genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  if (!name) {
    return res.status(422).json({ msg: 'O campo Nome é obrigatório' })
  }
  if (!email) {
    return res.status(422).json({ msg: 'O campo Email é obrigatório' })
  }
  if (!password) {
    return res.status(422).json({ msg: 'O campo Senha é obrigatório' })
  }
  if (password !== confirmpassword) {
    return res.status(422).json({ msg: 'As senhas não conferem' })
  }

  const register = {
    name,
    email,
    password: passwordHash,
    confirmpassword: passwordHash,
    verified: false,
    subscripted: {
      status: false
    }
  }

  try {
    await User.create(register)
      .then((result) => {
        res.status(201).json(
          sendVerificationEmail(result)
        )
      })
  }
  catch (error) {
    res.status(500).json({ error: 'Erro ao Criar Cadastro' })
  }

})
router.patch('/', async (req, res) => {
  const { name, email, password, verified, subscripted } = req.body
  const salt = await genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = {
    name,
    email,
    verified,
    subscripted
  }

  try {
    const updateUser = await User.updateOne({ email: email }, user)

    if (updateUser.matchedCount === 0) {
      res.status(422).json({ message: 'O usuário não foi encontrado' })
    }
    res.status(200).json(user)
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

  const userExists = await User.findOne({ email: email })
  //the below info's is to use the user informations on our application
  const userInfo = await User.findOne({ email: email }, '-password -confirmpassword')

  if (!userExists) {
    return res.status(404).json({ msg: "O usuário não está cadastrado. Crie uma Conta" })
  }
  if (userExists.verified === false) {
    return res.json({ msg: "Seu Email ainda não foi confirmado. Verifique sua Caixa de Entrada" })
  }
  else {
    bcrypt.compare(password, userExists.password)
      .then((data) => {
        if (data === false) {
          return res.json({ msg: "Senha Incorreta!" })
        }
        else {
          const secret = process.env.SECRET
          const token = jwt.sign({
            id: userExists._id
          }, secret,
          )
          return res.json({ msg: "Login Efetuado com Sucesso", token, userInfo })
        }
      }
      )
  }
})

module.exports = router
