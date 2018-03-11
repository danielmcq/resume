'use strict'

const config = require('config')

config.__get$$ = config.get

config.get = key=>{
  if (key==='server') {
    const serverConf = Object.assign({},config.__get$$('server'))
    if (process.env.PORT) serverConf.port = process.env.PORT
    return serverConf
  }
  else return config.__get$$(key)
}

module.exports = config