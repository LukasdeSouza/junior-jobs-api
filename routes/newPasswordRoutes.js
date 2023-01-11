const router = require('express').Router()

const UserNewPassword = require('../models/UserNewPassword')
const User = require('../models/User')

// router.post('/', async (req, res) => {

//   const { _id_empresa, urlImage, title, description, tecnologies, salary, local, link } = req.body

//   if (!_id_empresa) {
//     res.status(422).json({ error: 'Preencha o id da empresa' })
//     return
//   }
//   if (!urlImage) {
//     res.status(422).json({ error: 'Preencha os campos corretamente' })
//     return
//   }
//   if (!title) {
//     res.status(422).json({ error: 'Preencha os campos corretamente' })
//     return
//   }
//   if (!description) {
//     res.status(422).json({ error: 'Preencha os campos corretamente' })
//     return
//   }
//   if (!tecnologies) {
//     res.status(422).json({ error: 'Preencha os campos corretamente' })
//     return
//   }
//   if (!salary) {
//     res.status(422).json({ error: 'Preencha o salário da Vaga' })
//     return
//   }
//   if (!local) {
//     res.status(422).json({ error: 'Preencha o local da Vaga' })
//     return
//   }
//   if (!link) {
//     res.status(422).json({ error: 'Preencha o link da Vaga' })
//     return
//   }

//   const jobs = {
//     _id_empresa,
//     urlImage,
//     title,
//     description,
//     tecnologies,
//     salary,
//     local,
//     link,
//   }

//   try {
//     await Jobs.create(jobs)
//     res.status(201).json({ success: 'Vaga Criada com Sucesso!' })

//   } catch (error) {
//     res.status(500).json({ error: error })
//   }
// })

router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findOne({ _id: id })
    if (!user) {
      res.status(422).json({ message: 'Usuário encontrado para recuperar senha' })
      return
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

// router.delete('/:id', async (req, res) => {
//   const id = req.params.id

//   const jobs = await Jobs.findOne({ _id: id })
//   if (!jobs) {
//     res.status(422).json({ message: 'A vaga não foi encontrada' })
//     return
//   }

//   try {

//     await Jobs.deleteOne({ _id: id })

//     res.status(200).json({ message: 'Vaga removida com Sucesso' })

//   } catch (error) {
//     res.status(500).json({ error: error })

//   }
// })

module.exports = router

