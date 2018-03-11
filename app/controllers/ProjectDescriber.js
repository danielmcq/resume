'use strict'

const Describer = require('./Describer')
const url       = require('url')

class ProjectDescriber extends Describer {
  constructor (data, options) {
    super(Object.assign({skills: []}, data), options)

    Describer.initDescriberList(this.data.skills)
  }

  getSkills () { return Describer.sortDescriberList(this.data.skills) }

  text () {
    let output = super.text()

    if (this.data.client) {
      output += ` (${this.data.client})`
    } else if (this.data.url) {
      output += ` (${this._wrapAnchor(this.data.url)})`
    }

    return output
  }

  _wrapAnchor (text) {
    const PARSED = url.parse(text)

    let output = text

    if (PARSED.protocol) {
      output = `<a href="${url.format(PARSED)}" target="_blank">${text}</a>`
    }

    return output
  }
}

module.exports = ProjectDescriber