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

// localhost:3001-sivun näkymä käyttäjälle
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Kaikkien tietueiden näyttäminen localhost:3001/api/persons-sivulla
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Yksittäisen tietueen tulostaminen /api/persons/id-sivulla
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // console.log(id)
  const person = persons.find(person => person.id === id)
  // console.log(person)

  if (person) {
    response.json(person) // tulostaa JSON-muodossa yksittäisen numerotiedon
    // response.send(`Name: ${person.name} <br> Number: ${person.number}`) <-- tällä saisi tulostettua numeron tiedot, en ole varma kumpaa tehtävänannossa 3.3 loppujen lopuksi haluttiin
  } else {
    response.status(404).end() // Jos id:ta ei löydy, tulostaa 404 Not found -virheen
  }

})

// Info-sivun sisältö
app.get('/info', (request, response) => {
  const personsLength = Number(persons.length)
  const date = new Date()
  response.send(`<p>Phonebook has info for ${personsLength} people</p> <p> ${date}</p>`)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
