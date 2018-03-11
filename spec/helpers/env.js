'use strict'

const path = require('path')

const originalNodeConfig = process.env.NODE_CONFIG
const originalNodeConfigDir = process.env.NODE_CONFIG_DIR
process.env.NODE_CONFIG = JSON.stringify({logging: {console: {level: 'error'}}})
process.env.NODE_CONFIG_DIR = path.resolve(path.join(__dirname, '../../config/'))

jasmine.getEnv().afterAll(()=>{
  process.env.NODE_CONFIG = originalNodeConfig
  process.env.NODE_CONFIG_DIR = originalNodeConfigDir
})
