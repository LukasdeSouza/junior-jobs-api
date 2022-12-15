const router = require('express').Router()

const Jobs = require('../models/Jobs')

router.post('/', async (req, res) => {

  const { title, description, salary, local } = req.body

  if (!title && !salary) {
    res.status(422).json({ error: 'Preencha os campos corretamente' })
    return
  }

  const jobs = {
    title,
    description,
    salary,
    local
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

