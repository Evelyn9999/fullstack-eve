const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

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