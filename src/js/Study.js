'use strict'

class Study {
  constructor (options) {
    const DEFAULTS = {
      institution: '',
      location:    '',
      areaOfStudy: '',
      attendStart: null,
      attendEnd:   null,
    }

    Object.assign(this, DEFAULTS, options)
  }
}

module.exports = Study