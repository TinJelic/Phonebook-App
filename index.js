const express = require('express')
const morgan = require('morgan')
require('dotenv').config()


const Person = require('./models/person')

const app = express()

app.use(express.json())

// Custom token to log the request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// Use morgan with a custom format that includes the request body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())

/*const numberOfPersons = () => persons.length

app.get('/info', (request, response) => {
  const broj = numberOfPersons()
  const requestTime = new Date().toLocaleString()

  response.send(`<p>Phonebook has value of ${broj}</p><p>Request received at: ${requestTime}</p>`)
})*/

app.get('/api/persons', (request, response) =>{
  Person.find({}).then(osoba => {
    response.json(osoba)
  })
})

app.get('/api/persons/:id', (request, response) => {

  Person.findById(request.params.id).then(osoba =>
    response.json(osoba)
  )
})

const getID = () => {
  const maxId = Math.max(...persons.map(osoba => Number(osoba.id))) + 1
  return maxId.toString()
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})



app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(element => element.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})