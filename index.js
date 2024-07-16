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

app.use(express.json())

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



app.get('/api/person/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(osoba => {
      if (osoba) {
        response.json(osoba)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
      
    })

const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }
    
    // handler of requests with unknown endpoint
app.use(unknownEndpoint)

const getID = () => {
  const maxId = Math.max(...persons.map(osoba => Number(osoba.id))) + 1
  return maxId.toString()
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  else if (body.number === undefined){
    return response.status(400).json({ error: 'number missing' })

  }
  else {
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  }

})



app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


/app.put('/api/persons/:id',(request, response, next) => {
  
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { name: person.name })
  .then(updatedNote => {
    response.json(updatedNote)
  })
  .catch(error => next(error))

})



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})