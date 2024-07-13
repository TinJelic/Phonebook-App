const express = require('express')
const morgan = require('morgan')



const app = express()

app.use(express.json())

// Custom token to log the request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// Use morgan with a custom format that includes the request body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())

const numberOfPersons = () => persons.length

app.get('/info', (request, response) => {
  const broj = numberOfPersons()
  const requestTime = new Date().toLocaleString()

  response.send(`<p>Phonebook has value of ${broj}</p><p>Request received at: ${requestTime}</p>`)
})

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

const getID = () => {
  const maxId = Math.max(...persons.map(osoba => Number(osoba.id))) + 1
  return maxId.toString()
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log('Request Body:', body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const found = persons.find((element) => element.name.toLowerCase() === body.name.toLowerCase())

  if (found) {
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }

  const id = getID()
  console.log("Id", id)

  const person = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(element => element.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})