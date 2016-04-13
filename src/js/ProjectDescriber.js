"use strict"

const Describer = require("./Describer")

function ProjectDescriber () {
	Describer.apply(this, arguments)
}

// Extend Describer class
ProjectDescriber.prototype = Object.create(Describer.prototype)
ProjectDescriber.prototype.constructor = ProjectDescriber
ProjectDescriber.prototype.parent = Describer.prototype

ProjectDescriber.prototype.text = function(){
	let output = Describer.prototype.text.call(this)

	if (this.data.client) {
		output += ` (${this.data.client})`
	}

	return output
}

module.exports = ProjectDescriber