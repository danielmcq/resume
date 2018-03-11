'use strict'

const errors       = require('../misc/errors')
const path         = require('path')
const sass         = require('sass')
const StyleManager = require('./StyleManager')
const winston      = require('winston')

const OPT_DEFAULTS = {
  compress:  false,
  stylesDir: path.join(process.cwd(), '/app/sass'),
  stylesExt: '.scss',
}

module.exports = class SassManager extends StyleManager {
  constructor (options) {
    super(options)
    this._config = Object.assign({}, OPT_DEFAULTS, options)
  }

  async _render (styleFilepath) {
    return new Promise((resolve, reject) => {
      sass.render({
        file: styleFilepath,
      },(err,data)=>{
        if (err) {
          if (err.file === null) reject(new errors.FILE_NOT_FOUND)
          else reject(err)
        } else {
          winston.debug('sass render complete', styleFilepath)
          resolve(data.css)
        }
      })
    })
  }
}