"use strict"

const Describer = require("./Describer")
const ProjectDescriber = require("./ProjectDescriber")

function Job (data, options) {
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

Job.prototype = {
	get: function(field){
		return this.data[field]
	},
	getAccomplishments: function(){ return this.data.accomplishments },
	getDuties: function(){ return this.data.duties },
	getProjects: function(){ return this.data.projects },
	getSkills: function(){ return this.data.skills },
	_initDescribers: function(describers=[], Subdescriber=Describer){
		for (let i in describers) {
			if ( !(describers[i] instanceof Subdescriber) ) {
				describers[i] = new Subdescriber(describers[i], this.config)
			}
		}

		return describers
	}
}

module.exports = Job