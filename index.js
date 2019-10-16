const express = require('express')
const app = express()

const persons = [
  {
    name: "Arto Hellas",
    number: "040-1234567",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // console.log(id)
  const person = persons.find(person => person.id === id)
  // console.log(person)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
    console.log(response.status(404))
  }

})

app.get('/info', (request, response) => {
  const personsLength = Number(persons.length)
  const date = new Date()
  response.send(`<p>Phonebook has info for ${personsLength} people</p> <p> ${date}</p>`)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
