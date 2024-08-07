const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
      {
        "name": "Arto Hellas",
        "number": "123",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      }
    ]

const generateId = () => {
    const maxId = Math.max(...persons.map(person => Number(person.id)))

    return String(maxId + 1)
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (!person) {
        return response.status(404).end()
    }
    else {
        response.json(person)
    }
})

app.get('/info', (request, response) => {
    const numberOfPeople = persons.length
    response.send(`<div>Phonebook has info for ${numberOfPeople} people</div>
                    <div>${new Date().toString()}</div>`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(404).json({
        error:"name or number missing"
        })
    }
    else if (persons.find(person => person.name === body.name)){
        response.status(422).json({
            error:"name must be unique"
        })
    }
    else {
        const person = {
            "name": body.name,
            "number": body.number,
            "id" : generateId()
        }

        persons = persons.concat(person)
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons =  persons.filter(person => person.id !== id)

    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})