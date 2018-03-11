'use strict'

const expressWinston = require('express-winston')
const moment         = require('moment')
const winston        = require('winston')

const timestamp = ()=>moment.utc().format()

winston.emitErrs = true

const consoleDefaults = {
  level:            'debug',
  timestamp,
  handleExceptions: true,
  json:             false,
  colorize:         true,
  prettyPrint:      true,
}

const loggerDefaults = {
  transports:  [],
  exitOnError: false,
  stripColors: true,
}

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
  const loggerOptions = Object.assign({}, loggerDefaults, opts.global, {transports: []})
  const {transports} = loggerOptions

  const consoleOptions = Object.assign({}, consoleDefaults, opts.console)

  if (!consoleOptions.disabled) {
    transports.push(getConsoleTransport(opts.console))
  }

  return new winston.Logger(loggerOptions)
}

function getConsoleTransport (opts={label: 'App'}) {
  const consoleOptions = Object.assign({}, consoleDefaults, opts)
  return new winston.transports.Console(consoleOptions)
}

function createRequestLogger (opts={}) {
  const consoleOptions = Object.assign({}, opts.console, {label: 'HTTP'})
  const transport = getConsoleTransport(consoleOptions)

  const DEFAULTS = {
    transports:    [transport],
    meta:          false,
    expressFormat: true,
    level:         'verbose',
    colorize:      true,
    statusLevels:  {
      success: 'verbose',
      warn:    'warn',
      error:   'error',
    },
  }

  const options = Object.assign({}, DEFAULTS, opts.request)

  return expressWinston.logger(options)
}