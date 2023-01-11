const router = require('express').Router()

const UserCV = require('../models/UserCV')

router.post('/', async (req, res) => {

  const { profileImage, fullName, dateOfBirth, aboutMe, phone, civilState, interestJob,
    sex, institutionName, courseName, beginDate, endDate, courseStatus, education, expertise, occupationArea, experiences, github, linkedin, behance, portfolio } = req.body

  if (!fullName) {
    res.status(422).json({ error: 'Preencha o campo "Nome Completo"' })
    return
  }
  if (!dateOfBirth) {
    res.status(422).json({ error: 'Preencha o campo "Data de Nascimento"' })
    return
  }
  if (!aboutMe) {
    res.status(422).json({ error: 'Preencha o campo "Sobre Mim"' })
    return
  }
  if (!phone) {
    res.status(422).json({ error: 'Preencha o campo "Telefone"' })
    return
  }
  if (!civilState) {
    res.status(422).json({ error: 'Preencha o campo "Estado Civil"' })
    return
  }
  if (!interestJob) {
    res.status(422).json({ error: 'Preencha o campo "Interesse de Trabalho"' })
    return
  }
  if (!sex) {
    res.status(422).json({ error: 'Preencha o campo "Sexo"' })
    return
  }
  if (!education) {
    res.status(422).json({ error: 'Preencha o campo "NoEducação"' })
    return
  }
  if (!occupationArea) {
    res.status(422).json({ error: 'Preencha o campo "Área de atuação"' })
    return
  }
  if (!experiences) {
    res.status(422).json({ error: 'Preencha o campo "Experiências"' })
    return
  }

  const usercv = {
    profileImage,
    fullName,
    dateOfBirth,
    aboutMe,
    phone,
    civilState,
    interestJob,
    sex,
    institutionName,
    courseName,
    beginDate,
    endDate,
    courseStatus,
    education,
    expertise,
    occupationArea,
    experiences,
    github,
    linkedin,
    behance,
    portfolio,
  }

  try {
    await UserCV.create(usercv)
    res.status(201).json({ success: 'Currículo atualizado com Sucesso!' })

  } catch (error) {
    res.status(500).json({ error: "Ops! Não foi possível atualizar o seu currículo", error })
  }
})

router.get('/:fullName', async (req, res) => {
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

