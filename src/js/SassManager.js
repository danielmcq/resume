'use strict'

const sass         = require('sass')
const path         = require('path')
const StyleManager = require('./StyleManager')
const winston      = require('winston')

const SASS_FILE = path.join(process.cwd(), '/src/sass/main.scss')

const OPT_DEFAULTS = { compress: false, filename: SASS_FILE }

module.exports = class SassManager extends StyleManager {
  constructor (options) {
    super(options)
    this._config = Object.assign({}, OPT_DEFAULTS, options)
  }

  async css () {
    if (this._css) return this._css
    else return this._renderSass()
  }

  async _renderSass () {
    const DATA_FILE = this._config.filename

    return new Promise((resolve, reject) => {
      sass.render({
        file: DATA_FILE,
      },(err,data)=>{
        if (err) {
          const msg = `Error rendering CSS from sass file '${DATA_FILE}'\n${err}`
          winston.error(msg)
          reject(msg)
        } else {
          this._css = data.css
          winston.info('sass render complete', this._css.slice(0, 10))
          resolve(this._css)
        }
      })
    })
  }
}