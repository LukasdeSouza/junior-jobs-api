const router = require('express').Router()

const Jobs = require('../models/Jobs')

router.post('/', async (req, res) => {

  const { _id_empresa, name, urlImage, title,
    description, tecnologies, salary, local,
    link, tier, type } = req.body

  if (!_id_empresa) {
    res.status(422).json({ error: 'Preencha o id da empresa' })
    return
  }
  if (!name) {
    res.status(422).json({ error: 'Preencha o campo nome da empresa' })
    return
  }
  // if (!urlImage) {
  //   res.status(422).json({ error: 'Preencha os campos corretamente' })
  //   return
  // }
  if (!title) {
    res.status(422).json({ error: 'Preencha o campo de Título' })
    return
  }
  if (!description) {
    res.status(422).json({ error: 'Preencha o campo de descrição' })
    return
  }
  if (!tecnologies) {
    res.status(422).json({ error: 'Preencha o campo Tecnologias' })
    return
  }
  if (!salary) {
    res.status(422).json({ error: 'Preencha o salário da Vaga' })
    return
  }
  if (!local) {
    res.status(422).json({ error: 'Preencha o local da Vaga (Remoto/Híbrido)' })
    return
  }
  if (!link) {
    res.status(422).json({ error: 'Preencha o link da Vaga' })
    return
  }
  if (!tier) {
    res.status(422).json({ error: 'Preencha o campo Nível (Jr/Pleno/Sênior)' })
    return
  }
  if (!type) {
    res.status(422).json({ error: 'Preencha o campo Tipo (CLT/PJ)' })
  }

  const jobs = {
    _id_empresa,
    name,
    urlImage,
    title,
    description,
    tecnologies,
    salary,
    local,
    link,
    tier,
    type
  }

  try {
    await Jobs.create(jobs)
    res.status(201).json({ success: 'Vaga Criada com Sucesso!' })

  } catch (error) {
    res.status(500).json({ error: error })
  }
})

router.get('/', async (req, res) => {

  try {
    const jobs = await Jobs.find()

    res.status(200).json(jobs)

  } catch (error) {
    res.status(500).json({ error: error })
  }
})

// router.get('/:job', async (req, res) => {
//   const job = req.params.job
//   try {
//     const jobs = await Jobs.find()

//     res.status(200).json(jobs)

//   } catch (error) {
//     res.status(500).json({ error: error })
//   }
// })

router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const jobs = await Jobs.findOne({ _id: id })
    if (!jobs) {
      res.status(422).json({ message: 'Desculpe! A vaga não foi encontrada' })
      return
    }
    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id

  const jobs = await Jobs.findOne({ _id: id })
  if (!jobs) {
    res.status(422).json({ message: 'A vaga não foi encontrada' })
    return
  }

  try {

    await Jobs.deleteOne({ _id: id })

    res.status(200).json({ message: 'Vaga removida com Sucesso' })

  } catch (error) {
    res.status(500).json({ error: error })

  }
})

module.exports = router

