require('dotenv').config()

const express = require('express')
const loadDb = require('./config/loadDb')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()


// loadDb.connect()
app.use(cors())
const route = require('./routes/index')
app.use(bodyParser.json())

route(app)

app.listen(5000)