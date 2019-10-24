require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())



// TEHTAVA 3.7-3.8 - Morgan middleware loggaus
morgan.token('body', function (req, res) { return JSON.stringify(req.body)})

app.use(morgan(function (tokens, req, res) {
  if (tokens.method(req, res) === "POST") {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['body'](req, res)
    ].join(' ')
  } else {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
  }
})
)


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


// Kaikkien tietueiden näyttäminen localhost:3001/api/persons-sivulla, tietueet haetaan tietokannasta
app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person.find({}).then(people => {
    response.json(people.map(person => person.toJSON()))
  });
});


// TEHTÄVÄ 3.2 - Info-sivun sisältö
app.get('/info', (request, response) => {
  const personsLength = Number(persons.length)
  const date = new Date()
  response.send(`<p>Phonebook has info for ${personsLength} people</p> <p> ${date}</p>`)
})


// TEHTÄVÄ 3.3 - Yksittäisen tietueen tulostaminen /api/persons/id-sivulla
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person) // tulostaa JSON-muodossa yksittäisen numerotiedon
    // response.send(`Name: ${person.name} <br> Number: ${person.number}`) <-- tällä saisi tulostettua numeron tiedot, en ole varma kumpaa tehtävänannossa 3.3 loppujen lopuksi haluttiin
  } else {
    response.status(404).end() // Jos id:ta ei löydy, tulostaa 404 Not found -virheen
  }
})


// TEHTÄVÄ 3.4 - Yksittäisen tietueen poistaminen
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


// TEHTÄVÄ 3.5 - Generoi random-id:n uudelle tietueelle, generateId kutsutaan tietuetta lisätessä id-kentän arvoksi
const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max( ...persons.map(p => p.id))
  : 0
  return Math.round(Math.random() * (100 - maxId) + maxId)
}


// TEHTÄVÄT 3.5 ja 3.6 - Tietueen lisääminen
app.post('/api/persons', (request, response) => {
  const body = request.body

    if(!body.name) {
      return response.status(400).json({
      error: "Add name"
      })

    } else if (!body.number) {
      return response.status(400).json({
        error: "Add number"
      })

    } else if (persons.some(p => p.name === body.name)) { // testataan, ettei nimeä ole jo puhelinluettelossa
      return response.status(400).json({
        error: "Name is already added"
    })

  } else if (persons.some(p => p.number === body.number)) { // testataan, ettei numeroa ole jo puhelinluettelossa
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


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
