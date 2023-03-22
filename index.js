const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('build'))

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

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!body.name){
    return response.status(400).json({ error: 'name is missing' })
  }
  else if(!body.number){
    return response.status(400).json({ error: 'number is missing' })
  }

  const dup = entries.find(pers => pers.name === body.name)
  if(dup){
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: genId()
  }

  entries = entries.concat(person)

  response.json(person)
})
  
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = entries.find(person => person.id === id)
  if(person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  entries = entries.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons', (request, response) => {
    response.json(entries)
})
  
app.get('/info', (request, response) => {
    const dateformat = new Date(Date.now())
    response.send(`<p>Phonebook has info for ${entries.length} people</p><p>${dateformat}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})