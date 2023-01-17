const router = require('express').Router()

const User = require('../models/User')

const nodemailer = require('nodemailer')


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

const sendNewPassword = ({ _id, email }) => {

  const currentUrl = "https://seek-jobs.netlify.app"
  const mailOptions = {
    from: "[Seek Jobs] <lucasdesouzasilva112@gmail.com>",
    to: email,
    subject: "Recuperação de Senha - Seek Jobs",
    html: `
   <h3> Olá 👋! </h3> <h4> Vimos que solicitou uma Recuperação de Senha. </h4>
     <h4> Basta Clicar no Link para realizar a Recuperação de Senha </h4> 
     <a href=${currentUrl + "/new-password/" + _id}> ${currentUrl + "/new-password/" + _id}</a>
     <p>Seek Jobs - Open Source Project</p> <a href='https://seek-jobs.netlify.app/'>https://seek-jobs.netlify.app/</a>
     `}

  try {
    transporter.sendMail(mailOptions)
  } catch (error) {
    return res.json({ msg: 'Ocorreu um erro ao enviar o Email de Recuperação de Senha', error })
  }
}

router.post('/create-new-password/:id', async (req, res) => {
  const id = req.params.id

  const { email } = req.body

  if (!email) {
    res.status(422).json({ error: 'Preencha seu email para enviarmos uma Recuperação de Senha' })
    return
  }
  try {
    const userInfo = await User.findById(id)
    res.status(201).json(
      sendNewPassword(userInfo)
    )
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível alterar sua senha. Tente novamente mais tarde', error })
  }
})

module.exports = router

