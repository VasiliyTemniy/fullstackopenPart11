const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const redirectorRouter = require('./controllers/redirector')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('../dist'))

// eslint-disable-next-line no-undef
const isProduction = process.env.NODE_ENV === 'production'
// eslint-disable-next-line no-undef
const isE2ETest = process.env.NODE_ENV === 'e2e-test'
// eslint-disable-next-line no-undef
const isTest = process.env.NODE_ENV === 'test' || isE2ETest

if (isProduction || isE2ETest) {
  let webpackMiddleware = require('webpack-dev-middleware')
  let webpack = require('webpack')
  let webpackConfig = require('../webpack.config.js')
  app.use(webpackMiddleware(webpack(webpackConfig), {}))
}

app.use(express.json())

const mongoUrl = config.MONGODB_URI
logger.info('connecting to', mongoUrl)

mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (isProduction) {
  app.use('/', redirectorRouter)
}

if (isTest) {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// eslint-disable-next-line no-undef
module.exports = app
