const notesRouter = require('express').Router()
const Note = require('../models/note')

// GET /api/notes
notesRouter.get('/', async (_req, res) => {
    const notes = await Note.find({})
    res.json(notes)
})

// GET /api/notes/:id
notesRouter.get('/:id', async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id)
        if (!note) return res.status(404).end()
        res.json(note)
    } catch (err) {
        next(err)
    }
})

// POST /api/notes
notesRouter.post('/', async (req, res, next) => {
    try {
        const { content, important = false } = req.body
        const note = new Note({ content, important })
        const saved = await note.save()
        res.json(saved)
    } catch (err) {
        next(err)
    }
})

// DELETE /api/notes/:id
notesRouter.delete('/:id', async (req, res, next) => {
    try {
        await Note.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

// PUT /api/notes/:id
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
