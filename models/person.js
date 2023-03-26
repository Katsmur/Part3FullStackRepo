const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (num) => {
                if (num.search(' ') >= 0){
                    return false
                }
                const firstDash = num.search('-')
                if (firstDash === 2 || firstDash === 3){
                    if (num.match(/-/g).length === 1) {
                        return true
                    }
                }
                return false
            },
            message: 'No spaces and must contain a two or three digit area code separated by a single dash'
        },
        required: true
    },
})
      
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)