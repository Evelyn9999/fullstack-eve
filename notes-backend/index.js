const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
// --- middleware: parse JSON
app.use(express.json())

// --- middleware: request logger
const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
}
app.use(requestLogger)

let notes = [
    { id: '1', content: 'HTML is easy', important: true },
    { id: '2', content: 'Browser can execute only JavaScript', important: false },
    { id: '3', content: 'GET and POST are the most important methods of HTTP protocol', important: true },
]

// --- routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes) // 200 by default
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id // ids are strings in your data
    const note = notes.find(n => n.id === id)
    if (!note) return res.status(404).end()
    res.json(note)
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({ error: 'content missing' })
    }
    const generateId = () => {
        const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
        return String(maxId + 1)
    }
    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false,
    }
    notes = notes.concat(note)
    res.status(201).json(note)
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(n => n.id !== id)
    res.status(204).end()
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
