'use strict'

const path = require('path')

const OPT_DEFAULTS = {
  stylesDir: null,
  stylesExt: null,
}

module.exports = class StyleManager {
  constructor (options) {
    this._cache = {}
    this._config = Object.assign({}, OPT_DEFAULTS, options)
  }

  async css (cssFilename) {
    if (this._cache[cssFilename]) return this._cache[cssFilename]
    else {
      const styleFilepath = this._getStyleFilepathFromRequestPath(cssFilename)
      const renderedStyle = await this._render(styleFilepath)
      if (renderedStyle) this._cache[cssFilename] = renderedStyle
      return renderedStyle
    }
  }

  async _render () {
    throw new Error('\'_render\' method not implemented on StyleManager child class.')
  }

  _getStyleFilepathFromRequestPath (requestPath) {
    const {stylesDir,stylesExt} = this._config
    const fileBasename = path.basename(requestPath, '.css')+stylesExt
    return path.join(stylesDir, fileBasename)
  }
}
