const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note' // tells Mongoose these ObjectIds point to Note docs
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toSigned()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash // the passwordHash should not be revealed
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
