const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name:{
    type: String,
    minlength: 5,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: (val) => {
        var regEx2 = /\d{2}-\d{6,}/
        var regEx3 = /\d{3}-\d{5,}/
        return regEx2.test(val) || regEx3.test(val)
      }
    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

