/* eslint-disable no-undef */
const redirectorRouter = require('express').Router()
const path = require('path')

redirectorRouter.get('/blogs/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

redirectorRouter.get('/blogs', function(req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

redirectorRouter.get('/users/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

redirectorRouter.get('/users', function(req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

redirectorRouter.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../../dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// eslint-disable-next-line no-undef
module.exports = redirectorRouter