
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { sequelize } = require('./models')
const config = require('./config/config')

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(config.port)
    console.log('\x1b[36m%s\x1b[0m', `Server started on port ${config.port}`)
  })
