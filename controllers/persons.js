const PersonRouter = require('express').Router()
const Person = require('../models/note')

PersonRouter.get('/info', (request, response) => {
  const datetime = new Date()

  Person.countDocuments()
    .then(count => {
      console.log(`Number of persons: ${count}`)
      response.send(`<p>Phonebook has info for ${count} people</p><p>${datetime}</p>`)
    })
    .catch(error => {
      console.error('Error counting documents:', error.message)
      response.status(500).send({ error: 'Failed to count documents' })
    })
})


PersonRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

PersonRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})



PersonRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})



PersonRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

PersonRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

module.exports = PersonRouter