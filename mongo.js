const mongoose = require('mongoose')
//require('dotenv').config(); // Load environment variables from .env file

const password = process.argv[2]

const url = `mongodb+srv://tinjelic17:${password}@cluster0.p9pv5sf.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

const name = process.argv[3]
const number = process.argv[4]




mongoose.set('strictQuery',false)

mongoose.connect(url)

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', PersonSchema)

console.log('duljina :', process.argv.length)

if(process.argv.length === 3) {

  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(osoba => {
      console.log(`${osoba.name} ${osoba.number}`)
    })
    mongoose.connection.close()
  })

}
else {
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log('person saved!', result)
    mongoose.connection.close()
  })
}




