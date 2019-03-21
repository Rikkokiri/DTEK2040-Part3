const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = (person) => {
  return {
    id: person._id,
    name: person.name,
    number: person.number
  }
}

personSchema.statics.printFormat = (person) => {
  return {
    name: person.name,
    number: person.number
  }
}

const Person = mongoose.model('Person', personSchema)

// If no command line parameters are given, the program outputs all the entries in the database
if (process.argv.length <= 2) {
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.log(error)
    })
}
// Save given name and number to the database
else if (process.argv.length == 4) {
  const name = process.argv[2]
  const number = process.argv[3]

  const contact = new Person({
    name: name,
    number: number
  })

  contact
    .save()
    .then(result => {
      console.log('Contact ', Person.printFormat(result), ' was saved to the database!')
      mongoose.connection.close()
    })
    .catch(error => {
      console.log(error)
    })

} else {
  console.log("Error: incorrect parameters.")
  console.log("To insert a new name to a database: Provide name and number as parameters.")
  console.log("To print out names and numbers in the database: provide no parameters.")
  mongoose.connection.close()
  process.exit(-1)
}