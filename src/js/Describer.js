"use strict"

function Describer (data, options) {
	const DATA_DEFAULTS = { short:"", medium:"", long: "" }
	const OPTS_DEFAULT = { verbosity:"short" }

	this.data = Object.assign({}, DATA_DEFAULTS, data)
	this.config = Object.assign({}, OPTS_DEFAULT, options)
}

Describer.prototype = {
	text: function(verbosity=this.config.verbosity) {
		let output

		switch (verbosity) {
		case "long":
			output = this.data.long
			break
		case "medium":
		case "med":
			output = this.data.medium
			break
		default:
			output = this.data.short
			break
		}

		if (!output) {
			const verbosities = ["short", "medium", "long"]
			for (const verb of verbosities) {
				if (this.data[verb]) {
					output = this.data[verb]
					break
				}
			}
		}

		return output
	}
}

module.exports = Describer