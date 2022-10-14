const express = require('express')

const app =express()

require('dotenv').config()

const dbConfig =require('./config/db.Config')


const port = process.env.PORT || 5000

app.use(express.json())

const usersRoute = require('./routes/usersRoute')

const busRoute = require('./routes/busesRoute')
const bookingRoute = require('./routes/bookingsRoute')

app.use('/api/users',usersRoute)

app.use('/api/buses',busRoute)

app.use('/api/bookings',bookingRoute)

app.listen(port,()=>console.log("server running on port 5000"))