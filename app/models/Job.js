'use strict'

const Describer        = require('../controllers/Describer')
const ProjectDescriber = require('../controllers/ProjectDescriber')

class Job {
  constructor (data, options) {
    const DATA_DEFAULTS = {
      title:           '',
      company:         '',
      location:        '',
      'start-date':    null,
      'end-date':      null,
      accomplishments: [],
      duties:          [],
      projects:        [],
      skills:          [],
    }
    const OPTS_DEFAULT = {verbosity: 'short'}

    this.data = Object.assign({}, DATA_DEFAULTS, data)

    this.config = Object.assign({}, OPTS_DEFAULT, options)

    Describer.initDescriberList(this.data.accomplishments)
    Describer.initDescriberList(this.data.duties)
    Describer.initDescriberList(this.data.projects, ProjectDescriber)
    Describer.initDescriberList(this.data.skills)
  }

  get (field) {
    let output

    switch (field) {
      case 'accomplishments':
        output = this.getAccomplishments()
        break
      case 'company':
        output = this.getCompany()
        break
      case 'duties':
        output = this.getDuties()
        break
      case 'projects':
        output = this.getProjects()
        break
      case 'skills':
        output = this.getSkills()
        break
      default:
        output = this.data[field]
    }

    return output
  }

  getAccomplishments () { return this.data.accomplishments }

  getCompany () {
    let output = this.data.company

    if (output && this.data.url) {
      output = `<a href="${this.data.url}" target="_blank">${output}</a>`
    }

    return output
  }

  getDuties () { return this.data.duties }

  getProjects () { return this.data.projects }

  getSkills () { return Describer.sortDescriberList(this.data.skills) }
}

module.exports = Job