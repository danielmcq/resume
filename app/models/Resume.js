'use strict'

const Job = require('./Job')
const Person = require('./Person')
const ProjectDescriber = require('../controllers/ProjectDescriber')
const Study = require('./Study')

class Resume {
  constructor (data, options) {
    const DATA_DEFAULTS = {
      person:           {},
      jobs:             [],
      personalProjects: [],
      studies:          [],
    }
    const OPTS_DEFAULT = {verbosity: 'short'}

    this.config = Object.assign({}, OPTS_DEFAULT, options)

    this.data = Object.assign({}, DATA_DEFAULTS, data)

    if (!(this.data.person instanceof Person)) {
      this.data.person = new Person(this.data.person)
    }

    this._initJobs(this.data.jobs)
    this._initPersonalProjects(this.data.personalProjects)
    this._initStudies(this.data.studies)
  }

  getJobs () { return this.data.jobs }

  getPerson () { return this.data.person }

  getPersonalProjects () { return this.data.personalProjects }

  getStudies () { return this.data.studies }

  _initJobs (jobs) {
    for (let i = 0; i < jobs.length; i++) {
      if (!(jobs[i] instanceof Job)) {
        jobs[i] = new Job(jobs[i], this.config)
      }
    }
  }

  _initPersonalProjects (personalProjects) {
    for (let i = 0; i < personalProjects.length; i++) {
      if (!(personalProjects[i] instanceof ProjectDescriber)) {
        personalProjects[i] = new ProjectDescriber(personalProjects[i])
      }
    }
  }

  _initStudies (studies) {
    for (let i = 0; i < studies.length; i++) {
      if (!(studies[i] instanceof Study)) {
        studies[i] = new Study(studies[i])
      }
    }
  }
}

module.exports = Resume