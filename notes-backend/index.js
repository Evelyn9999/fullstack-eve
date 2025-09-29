require('dotenv').config();
const express = require('express')
const app = express()

const Note = require('./models/note')

app.use(express.json())  // --- middleware: parse JSON
app.use(require('express').static('dist'));   // <-- serve frontend build

// --- middleware: request logger
const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
}
app.use(requestLogger)

// --- routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if (!note) return res.status(404).end()
            res.json(note)
    })
        .catch(next) // e.g. CastError for bad id
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({ error: 'content missing' })
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    note.save()
        .then(savedNoted => {
        res.json(savedNoted)
    })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).end())
        .catch(next)
})

/** Update note (content and/or important) */
app.put('/api/notes/:id', (req, res, next) => {
    const {content, important} = req.body

    // Option A: update in one go
    Note.findByIdAndUpdate(
        req.params.id,
        {content, important},
        {new: true} // return updated doc
    )
        .then(updated => {
            if (!updated) =>
            res.status(404).end()
            res.json(updated)
        })
        .catch(next)
})

// --- middleware: unknown endpoint (after routes)
const unknownEndpoint = (req, res) => {
    res.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// --- middleware: global error handler (last)
app.use((err, req, res, next) => {
    console.error(err.name, err.message)
    if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
        return res.status(400).json({ error: 'malformed JSON' })
    }
    res.status(500).json({ error: 'internal server error' })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
