const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
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

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max( ...persons.map(p => p.id))
  : 0
  return Math.round(Math.random() * (100 - maxId) + maxId)
}

// Tietueen lisääminen
app.post('/api/persons', (request, response) => {
  const body = request.body
    if(!body.name) {
      // console.log("add name")
      return response.status(400).json({
      error: "Add name"
      })

    } else if (!body.number) {
      // console.log("add number")
      return response.status(400).json({
        error: "Add number"
      })

    } else if (persons.some(p => p.name === body.name)) {
      return response.status(400).json({
        error: "Name is already added"
    })
    
  } else if (persons.some(p => p.number === body.number)) {
    return response.status(400).json({
      error: "Number is already added"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
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
