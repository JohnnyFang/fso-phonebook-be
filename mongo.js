const mongoose = require('mongoose')

const option = process.argv.length

if (option < 3) {
  console.log('give password as argument')
  process.exit(1)
}
else if (option !==3 && option !==5) {
  console.log('Not enoguh arguments. HINT: node mongo.js yourpassword Anna 040-1234556')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fangdejavu:${password}@fso-cluster0.8ozb813.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

const getPersons = () => {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
  })
}

const createPerson = () => {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name,
    number
  })

  person.save().then(response => {
    console.log({ response })
    console.log('Person saved successfully')
    mongoose.connection.close()
  })
}
option === 3 ? getPersons() : createPerson()
