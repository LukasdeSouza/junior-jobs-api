const router = require('express').Router()

const { genSalt } = require('bcrypt')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Register = require('../models/Register')
const UserVerification = require('../models/UserVerification')

//nodemailer
const nodemailer = require('nodemailer')

//unique string
const { v4: uuidv4 } = require('uuid')

//.env
require("dotenv").config()

//nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
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

  const user = await Register.findById(id, '-password -confirmpassword')

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" })
  }
  else {
    return res.status(200).json({ user })
  }
})

const sendVerificationEmail = ({ _id, email, name }) => {
  console.log(_id)
  console.log(email)
  console.log(name)
  const currentUrl = "https://seek-jobs-website-api.onrender.com"
  // const uniqueString = uuidv4() + _id

  //email content
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Confirme seu Email - Seek Jobs",
    html: `<p> Olá ${name} 😎. Confirme seu Email para a acessar a plataforma Seek Jobs. </p>
     <p> Basta Clicar no Link para realizar a confirmação de email! </p> 
     <a href=${currentUrl + "/auth/verify/" + _id}> ${currentUrl + "/auth/verify/" + _id}</a>`
  }

  // hashing the uniqueString

  // const saltRounds = 10
  // bcrypt.hash(uniqueString, saltRounds)
  // .then((hashedUniqueString) => {
  //   const newVerification = new UserVerification({
  //     userId: _id,
  //     uniqueString: hashedUniqueString,
  //     createdAt: Date.now(),
  //     expiresAt: Date.noew() + 21600000
  //   })

  //   newVerification.save()
  //     .then(() => {
  transporter.sendMail(mailOptions)
    .then((result) => {
      return res.json({ status: 'Pendente', msg: "Verificação de Email Enviada" })
    })
    .catch((error) => {
      return res.json({ msg: 'Ocorreu um erro ao enviar o Email', error })
    })
  //     })
  //     .catch((error) => {
  //       return res.json({ msg: 'Ocorreu um erro', error })
  //     })
  // })
  // .catch(() => {
  //   return res.status(422).json({ msg: 'Ocorreu um Erro ao fazer o hash do email' })
  // })
}
router.get("/verify/:userId", (req, res) => {
  let { userId } = req.params

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        Register.findOneAndUpdate({
          _id: userId
        }, { verified: true }, { upsert: true, useFindAndModify: false });
        return res.json({ msg: 'Usuário Verificado com Sucesso!', result })
      }
    })

})

router.post('/register', async (req, res) => {

  const { name, email, type, cnpj, password, confirmpassword } = req.body

  const salt = await genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  if (!name) {
    return res.status(422).json({ msg: 'O campo Nome é obrigatório' })
  }
  if (!email) {
    return res.status(422).json({ msg: 'O campo Email é obrigatório' })
  }
  if (!type) {
    return res.status(422).json({ msg: 'O campo Tipo é obrigatório' })
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
    type,
    cnpj,
    password: passwordHash,
    confirmpassword: passwordHash,
    verified: false
  }

  try {
    await Register.create(register)
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
    .then((data) => {
      if (!userExists) {
        return res.status(404).json({ msg: "O usuário não está cadastrado. Deseja criar conta?" })
      }
      if (!data[0].verified) {
        return res.json({ msg: "Seu Email ainda não foi confirmado. Verifique sua Caixa de Entrada" })
      }
      else {

        const checkPassword = bcrypt.compare(password, userExists.password)

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
          res.status(200).json({ msg: "Login Efetuado com Sucesso", token, allNeededInfo })

        } catch (error) {
          console.log(error)
          res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!" })
        }

      }
    })

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
