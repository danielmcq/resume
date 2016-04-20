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
		this._initDescribers(this.data.skills)
	}

	get (field) {
		let output

		switch (field) {
		case "accomplishments":
			output = this.getAccomplishments()
			break
		case "company":
			output = this.getCompany()
			break
		case "duties":
			output = this.getDuties()
			break
		case "projects":
			output = this.getProjects()
			break
		case "skills":
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

	getSkills () { return this.data.skills.sort((a, b)=>{
		let result = 0

		if (a.text().toLowerCase() > b.text().toLowerCase()) { result = 1 }
		if (a.text().toLowerCase() < b.text().toLowerCase()) { result = -1 }

		return result
	}) }

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