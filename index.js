require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('postBody', (req, res)=>{
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
    else return  " "
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then( people => {
        response.json(people)
    })
      .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
  
        if (person) {
          response.json(person)
        } else {
          console.log(person)
          response.status(404).end()
        }
      })
  
      .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    let numberOfPeople = []
    Person.find({}).then(listOfPeople => response.send(
      `<div>Phonebook has info for ${Object.keys(listOfPeople).length} people</div>
      <div>${new Date().toString()}</div>`)
    )
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(404).json({
        error:"name or number missing"
        })
    }
    const person = new Person({
        name:body.name,
        number:body.number
    })

    person.save().then(savedPerson => {        
        response.json(savedPerson)
    })
    .catch( error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(request.params.id,
    {name, number},
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)})
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log(error.message);
  

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})