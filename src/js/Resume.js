"use strict"

const Job = require("./Job")
const Person = require("./Person")
const Study = require("./Study")

class Resume {
	constructor (person, jobs=[], studies=[], opts={verbosity:"short"}) {
		Object.assign(this, opts)

		this.person = person

		if (!(this.person instanceof Person)) {
			this.person = new Person(person)
		}

		this._initJobs(jobs)
		this._initStudies(studies)
	}

	getJobs () { return this.jobs }

	getStudies () { return this.studies }

	_initJobs (jobs) {
		this.jobs = this.jobs||[]

		for (let job of jobs) {
			if (!(job instanceof Job)) {
				this.jobs.push(new Job(job, {verbosity:this.verbosity}))
			} else {
				this.jobs.push(job)
			}
		}
	}

	_initStudies (studies) {
		this.studies = this.studies||[]

		for (let study of studies) {
			if (!(study instanceof Study)) {
				this.studies.push(new Study(study))
			} else {
				this.studies.push(study)
			}
		}
	}
}

module.exports = Resume