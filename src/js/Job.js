/*globals title, company, location*/
"use strict"

function Job (options={title, company, location}) {
	const DEFAULTS = {
		title:"",
		company:"",
		location:"",
		"start-date":null,
		"end-date": null,
		duties: [],
		projects: [],
		accomplishments: [],
		skills: []
	}

	Object.assign(this, DEFAULTS, options)
}

Job.prototype = {
	getAccomplishments: function(){ return this.accomplishments },
	getDuties: function(){ return this.duties },
	getProjects: function(){ return this.projects },
	getSkills: function(){ return this.skills }
}

module.exports = Job