const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://evelyn:${password}@cluster0.3tkz1yq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'MongoDB is powerful',
    important: false,
})

async function main() {
    await mongoose.connect(url)

    /*const note = new Note({
        content: 'MongoDB is powerful',
        important: false,
    })

    await note.save()
    console.log('note saved!')

    await mongoose.connection.close()*/

    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})

