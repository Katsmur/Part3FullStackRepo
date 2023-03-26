require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

const genId = () => {
  return Math.floor(Math.random() * 420)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if(!body.name){
    return response.status(400).json({ error: 'name is missing' })
  }
  else if(!body.number){
    return response.status(400).json({ error: 'number is missing' })
  }

  /*const dup = entries.find(pers => pers.name === body.name)
  if(dup){
    return response.status(400).json({ error: 'name must be unique' })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  //entries = entries.concat(person)
  person.save()
    .then(savedPers => {
      response.json(savedPers)
    })
    .catch(error => next(error))

  //response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number} = request.body
  /*const person = {
    name: body.name,
    number: body.number,
  }*/
  //console.log(body.name)

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number},
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPers => {
      response.json(updatedPers)
    })
    .catch(error => next(error))
})
  
app.get('/api/persons/:id', (request, response, next) => {
  /*const id = Number(request.params.id)
  const person = entries.find(person => person.id === id)
  if(person){
    response.json(person)
  } else {
    response.status(404).end()
  }*/
  Person.findById(request.params.id).then(pers => {
    if (pers) {
      response.json(pers)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  /*const id = Number(request.params.id)
  entries = entries.filter(person => person.id !== id)

  response.status(204).end()*/
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(pers => {
      response.json(pers)
    })
    .catch(error => next(error))
})
  
app.get('/info', (request, response, next) => {
    const dateformat = new Date(Date.now())
    Person.find({}).then(pers => {
      const num = pers.length
      response.send(`<p>Phonebook has info for ${num} people</p><p>${dateformat}</p>`)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})