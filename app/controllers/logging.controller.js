'use strict'

const expressWinston = require('express-winston')
const moment         = require('moment')
const winston        = require('winston')

const config = require('./config.controller')

const timestamp = ()=>moment.utc().format()

winston.emitErrs = true

module.exports = label=>{
  if (customerLoggers[label.toLowerCase()]) return customerLoggers[label.toLowerCase()]
  else return defaultLogger
}

const customerLoggers = {
  server:  createLogger({console: {label: 'Server'}}),
  datamgr: createLogger({console: {label: 'Data Manager'}}),
  sass:    createLogger({console: {label: 'Sass'}}),
  request: createRequestLogger(),
}
const defaultLogger = createLogger()


function createLogger (opts={}) {
  const loggerOptions = Object.assign({}, opts, config.get('logging.global'), {transports: []})
  const {transports} = loggerOptions

  const consoleOptions = Object.assign({}, opts.console)

  if (!consoleOptions.disabled) {
    transports.push(getConsoleTransport(opts.console))
  }

  return new winston.Logger(loggerOptions)
}

function getConsoleTransport (opts={label: 'App'}) {
  const consoleOptions = Object.assign({timestamp}, opts, config.get('logging.console'))
  return new winston.transports.Console(consoleOptions)
}

function createRequestLogger (opts={}) {
  const consoleOptions = Object.assign({}, opts.console, {label: 'HTTP'})
  const transport = getConsoleTransport(consoleOptions)

  const options = Object.assign({transports: [transport]}, opts, config.get('logging.request'))

  return expressWinston.logger(options)
}