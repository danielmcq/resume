'use strict'

const url     = require('url')

const app     = require('./app')
const config  = require('./controllers/config.controller')
const logging = require('./controllers/logging.controller')

const serverConf = config.get('server')
const logger = logging('server')

app().listen(serverConf.port, ()=>{
  logger.info(`Listening on ${url.format(serverConf)}`)
})
