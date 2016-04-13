"use strict"

class Describer {
	constructor (data, options) {
		const DATA_DEFAULTS = { short:"", medium:"", long: "" }
		const OPTS_DEFAULT = { verbosity:"short" }

		this.data = Object.assign({}, DATA_DEFAULTS, data)
		this.config = Object.assign({}, OPTS_DEFAULT, options)
	}

	text () {
		const VERBOSITY = this.config.verbosity

		let output

		switch (VERBOSITY) {
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
			const VERBOSITIES = ["short", "medium", "long"]
			for (const verbosity of VERBOSITIES) {
				if (this.data[verbosity]) {
					output = this.data[verbosity]
					break
				}
			}
		}

		return output
	}
}

module.exports = Describer