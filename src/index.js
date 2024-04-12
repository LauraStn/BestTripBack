const express = require('express')
const cors = require('cors')
const { connect } = require('./Services/Connexion')
const app = express()
const userRoutes = require('./Routes/user')
const listingRoutes = require('./Routes/listing')
require('dotenv').config()

app.use(express.json())
app.use(cors())

connect(process.env.DB_URL, (error) => {
    if (error) {
        console.log('Failed to connect')
        process.exit(-1)
    } else {
        console.log('successfully connected')
    }
})

app.use('/user', userRoutes)
app.use('/listing', listingRoutes)

app.listen(3500)
console.log('it works')
