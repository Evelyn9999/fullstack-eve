const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (err) {
    next(err)
  }
})


notesRouter.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) return res.status(404).end()
    res.json(note)
  } catch (err) {
    next(err)
  }
})

notesRouter.post('/', async (req, res, next) => {
  try {
    const { content, important = false } = req.body
    const note = new Note({ content, important })
    const savedNote = await note.save()
    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

notesRouter.put('/:id', async (req, res, next) => {
  try {
    const { content, important } = req.body
    const note = await Note.findById(req.params.id)
    if (!note) return res.status(404).end()
    note.content = content
    note.important = important
    const updated = await note.save()
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter
