"use strict"

const Describer = require("./Describer")

class ProjectDescriber extends Describer {
	text (){
		let output = super.text()

		if (this.data.client) {
			output += ` (${this.data.client})`
		}

		return output
	}
}

module.exports = ProjectDescriber