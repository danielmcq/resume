"use strict"

const Describer = require("./Describer")
const ProjectDescriber = require("./ProjectDescriber")

class Job {
	constructor (data, options) {
		const DATA_DEFAULTS = {
			title:"",
			company:"",
			location:"",
			"start-date":null,
			"end-date": null,
			accomplishments: [],
			duties: [],
			projects: [],
			skills: []
		}
		const OPTS_DEFAULT = {verbosity:"short"}

		this.data = Object.assign({}, DATA_DEFAULTS, data)

		this.config = Object.assign({}, OPTS_DEFAULT, options)

		this._initDescribers(this.data.accomplishments)
		this._initDescribers(this.data.duties)
		this._initDescribers(this.data.projects, ProjectDescriber)
	}

	get (field) { return this.data[field] }

	getAccomplishments () { return this.data.accomplishments }

	getDuties () { return this.data.duties }

	getProjects () { return this.data.projects }

	getSkills () { return this.data.skills }

	_initDescribers (describers, Subdescriber){
		Subdescriber = Subdescriber || Describer

		for (let i in describers) {
			if ( !(describers[i] instanceof Subdescriber) ) {
				describers[i] = new Subdescriber(describers[i], this.config)
			}
		}

		return describers
	}
}

module.exports = Job