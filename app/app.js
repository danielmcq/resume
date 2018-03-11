'use strict'

// node libs
const express = require('express')
const morgan  = require('morgan')

const errorHandler = require('./middleware/errorHandler')
const routes       = require('./routes')

module.exports = (opts={})=>{
  const app = express(opts)

  app.use(morgan('combined'))
  app.use(routes)
  app.use(errorHandler)

  return app
}
