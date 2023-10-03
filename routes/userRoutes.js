const router = require('express').Router()

const { genSalt } = require('bcrypt')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const nodemailer = require('nodemailer')

const { v4: uuidv4 } = require('uuid')

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

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).end()
    }
    req.id = decoded.id
    next()
  })
}

router.post('/', async (req, res) => {
  const { email, password } = req.body
  if (!email) {
    return res.status(422).json({ msg: 'O campo Email é obrigatório' })
  }
  if (!password) {
    return res.status(422).json({ msg: 'O campo Senha é obrigatório' })
  }
  const userExists = await User.findOne({ email: email })
  const userInfo = await User.findOne({ email: email }, '-password -confirmpassword')

  if (!userExists) {
    return res.status(404).json({ msg: "Usuário não encontrado. Cadastre-se para acessar." })
  }

  else {
    bcrypt.compare(password, userExists.password)
      .then((data) => {
        if (data === false) {
          return res.json({ msg: "Usuário ou Senha Inválidos!" })
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

router.patch('/user', verifyJWT, async (req, res) => {
  const { email, subscripted } = req.body
  const filter = { email: email }
  const update = { subscripted: subscripted }

  try {
    const updatedUser = await User.updateOne(filter, update)
    if (updatedUser.matchedCount === 0) {
      res.status(422).json({ msg: 'O usuário não foi encontrado' })
    }
    res.status(200).json(update)
  }
  catch (error) {
    res.status(500).json({ error: error })
  }
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmpassword } = req.body

  const salt = await genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)
  const createdAt = Date.now()

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
    createdAt,
    subscripted: {
      status: false
    }
  }
  const userExists = await User.findOne({ email: email })
  if (userExists !== null) {
    res.status(422).json({ msg: 'Email já cadastrado, tente fazer Login' })
  }

  try {
    await User.create(register)
      .then((result) => {
        const secret = process.env.SECRET
        const token = jwt.sign(
          { id: result._id },
          secret
        )
        return res.status(201).json({
          msg: 'Usuário Criado com Sucesso!',
          userInfo: {
            _id: result._id,
            token: token,
            createdAt: result?.createdAt,
            name: result?.name,
            email: result?.email,
            type: result?.type,
            subscripted: result?.subscripted,
          }
        })
      })
  }
  catch (error) {
    return res.status(500).json({ error: 'Erro ao Criar Cadastro' })
  }
})

router.get("/user/:id", verifyJWT, async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id, '-password -confirmpassword')

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" })
  }
  else {
    return res.status(200).json({ user })
  }
})

router.delete("/user/:id", verifyJWT, async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({ _id: id })

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" })
  }
  try {
    await User.deleteOne({ _id: id })
    res.status(200).json({ message: 'Usuário Excluído com Sucesso' })
  } catch (error) {
    return res.status(200).json({ error: error })
  }
})

// const sendVerificationEmail = ({ _id, email, name }) => {
//   const currentUrl = "https://seek-jobs-website-api.onrender.com"
//   // const uniqueString = uuidv4() + _id
//   //email content
//   const mailOptions = {
//     from: "[Seek Jobs] <lucasdesouzasilva112@gmail.com>",
//     to: email,
//     subject: "Confirme seu Email - Seek Jobs",
//     html: `
//     <img src="https://i.ibb.co/HYX3CB1/logo-size.jpg" <br/> <h3> Olá ${name} 😎! </h3> <h4> Confirme seu Email para a acessar a plataforma Seek Jobs. </h4>
//      <h4> Basta Clicar no Link para realizar a Confirmação do seu Cadastro </h4> 
//      <a href=${currentUrl + "/auth/verify/" + _id}> ${currentUrl + "/auth/verify/" + _id}</a>
//      <br/>
//      <p>Seek Jobs - Open Source Project</p> <a href='https://seek-jobs.netlify.app/'>https://seek-jobs.netlify.app/</a>
//      `
//   }
//   try {
//     transporter.sendMail(mailOptions)
//   } catch (error) {
//     return res.json({ msg: 'Ocorreu um erro ao enviar o Email', error })
//   }
// }

router.get("/users", verifyJWT, async (req, res) => {

  const allUsers = await User.find({}, '-password -confirmpassword')
  if (!allUsers) {
    return res.status(200).json({ msg: "Não foi possível retornar os usuários" })
  }
  else {
    res.status(200).json({ allUsers })
  }
})



module.exports = router
