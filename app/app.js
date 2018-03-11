'use strict'

// node libs
const express = require('express')

const errorHandler = require('./middleware/errorHandler')
const logging      = require('./controllers/logging.controller')
const routes       = require('./routes')

module.exports = (opts={})=>{
  const app = express(opts)

  app.use(logging('request'))
  app.use(routes)
  app.use(errorHandler)

  return app
}
