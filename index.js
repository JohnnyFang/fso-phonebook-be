const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('post-content', function(req, res) {
    if (req.method === 'POST') return JSON.stringify(req.body)
 })
// app.use(morgan('tiny'))
app.use(morgan(':method :url :response-time :post-content'))

const min = 6
const max = 10000000

let persons = [
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

const getPerson = (id) => persons.find(person => person.id == id)

const getPersonByName = (name) => persons.find(person => person.name == name)

const generateId = () => persons.length > 0 ? Math.max(...persons.map(p => p.id))+1 : 0

const generateRandomId = () => {
    const cMin = Math.ceil(min);
    const fMax = Math.floor(max);
    return Math.floor(Math.random() * (fMax - cMin) + cMin); // The maximum is exclusive and min inclusive
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        response.status(400).json({error: 'name missing'})
    }
    if (getPersonByName(body.name)) {
        response.status(400).json({ error: 'name must be unique' })
    }
    if (!body.number) {
        response.status(400).json({error: 'number missing'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateRandomId()
    }
    persons = persons.concat(person)    
    response.json(person)
  })

app.get('/api/persons/:id', (request, response) => {
    const person = getPerson(Number(request.params.id))
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const person = getPerson(Number(request.params.id))
    if (person) {
        persons = persons.filter(p => p.id !== person.id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${new Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})