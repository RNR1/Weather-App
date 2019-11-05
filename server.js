const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')

const path = require('path')
const api = require('./server/routes/api')

const server = express()
mongoose.connect('mongodb://localhost/weather', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(express.static(path.join(__dirname, 'dist')))
server.use(express.static(path.join(__dirname, 'node_modules')))
server.use(morgan("common"))

server.use('/', api)

const port = 3080
server.listen(port, () => console.log(`Server is running on port ${port}`))
