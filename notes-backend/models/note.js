const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Keep logs generic to avoid printing credentials
console.log('Connecting to MongoDB…', isTest ? '(TEST DB)' : '(DEV DB)')
mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message))

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// shape documents returned to clients
noteSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Note', noteSchema)