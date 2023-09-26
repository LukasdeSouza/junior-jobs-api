const router = require('express').Router()

const jwt = require('jsonwebtoken')
const Jobs = require('../models/Jobs')
const dotenv = require('dotenv')
dotenv.config()

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


router.post('/', verifyJWT, async (req, res) => {
  const { name, urlImage, title,
    description, salary, local,
    link } = req.body

  const dateItWasCreated = Date.now()

  if (!name) {
    res.status(422).json({ error: 'Preencha o campo nome da empresa' })
    return
  }

  if (!title) {
    res.status(422).json({ error: 'Preencha o campo de Título' })
    return
  }
  if (!description) {
    res.status(422).json({ error: 'Preencha o campo de descrição' })
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

  const jobs = {
    name,
    urlImage,
    title,
    description,
    salary,
    local,
    link,
    dateItWasCreated
  }

  try {
    await Jobs.create(jobs)
    res.status(201).json({ success: 'Vaga Criada com Sucesso!' })

  } catch (error) {
    res.status(500).json({ error: error })
  }
})

router.get('/', verifyJWT, async (req, res) => {

  try {
    // const jobs = await Jobs.find()
    Jobs.find().sort({ _id: '-1' }).exec((err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err })
      }
      res.status(200).json(results)
    }
    )

  } catch (error) {
    res.status(500).json({ error: error })
  }
})

router.get('/:id', verifyJWT, async (req, res) => {
  const id = req.params.id

  try {
    const jobs = await Jobs.findById(id)

    if (!jobs) {
      res.status(422).json({ message: 'Desculpe! A vaga não foi encontrada' })
      return
    }
    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

router.delete('/:id', verifyJWT, async (req, res) => {
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