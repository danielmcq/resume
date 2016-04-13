"use strict"

const Job = require("./Job")
const Person = require("./Person")
const Study = require("./Study")

function Resume (person, jobs=[], studies=[]) {
	this.person = person

	if (!(this.person instanceof Person)) {
		this.person = new Person(person)
	}

	this._initJobs(jobs)
	this._initStudies(studies)
}

Resume.prototype = {
	getJobs: function() { return this.jobs },
	getStudies: function() { return this.studies},
	_initJobs: function(jobs){
		this.jobs = this.jobs||[]

		for (let job of jobs) {
			if (!(job instanceof Job)) {
				this.jobs.push(new Job(job))
			} else {
				this.jobs.push(job)
			}
		}
	},
	_initStudies: function(studies){
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