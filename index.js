const express = require('express')
const app = express()
app.use(express.static('build'))
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const Person = require('./models/person')


app.get('/api/persons', (request, response) => {
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "malformatted id" })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: "malformatted id" })
    })
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

/*
BEFORE:
Implement error handling for the functionality adding new entries to the directory. The request should not be accepted if
- name or number is missing from the request
- the name to be added already exists in the directory
Respond with an appropriate status code. Also include an informative error message */

/*
NOW:
Change the backend so that the new entries are stored in the database.
Here, you do not have to care about the fact that there may already be
a person with the same name in the database.
*/
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(newPerson => {
      response.json(Person.format(newPerson))
    })
    .catch(error => {
      console.log(error)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})