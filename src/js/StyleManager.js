'use strict'

const OPT_DEFAULTS = {}

module.exports = class StyleManager {
  constructor (options) {

    this._css = ''
    this._config = Object.assign({}, OPT_DEFAULTS, options)
  }

  async css () {
    return this._css
  }
}
