'use strict'

const url     = require('url')
const winston = require('winston')

const app    = require('./app')
const config = require('./controllers/config.controller')

const serverConf = config.get('server')

app().listen(serverConf.port, ()=>{
  winston.info(`Listening on ${url.format(serverConf)}`)
})
