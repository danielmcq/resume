"use strict"

class Describer {
	constructor (data, options) {
		const DATA_DEFAULTS = { short:"", medium:"", long: "" }
		const OPTS_DEFAULT = { verbosity:"short" }

		if (typeof data === "string") {
			data = { short: data }
		}

		this.data = Object.assign({}, DATA_DEFAULTS, data)
		this.config = Object.assign({}, OPTS_DEFAULT, options)
	}


	static initDescriberList (describers, Subdescriber) {
		Subdescriber = Subdescriber || Describer

		for (let i in describers) {
			if ( !(describers[i] instanceof Subdescriber) ) {
				describers[i] = new Subdescriber(describers[i], this.config)
			}
		}

		return describers
	}

	static sortDescriberList (arrayOfDescribers) {
		return arrayOfDescribers.sort((a, b)=>{
			let result = 0

			if ( !(a instanceof Describer) || !(b instanceof Describer) ) {
				throw new Error("Element in list not an instance of Describer class"+a, b)
			}

			if (a.text().toLowerCase() > b.text().toLowerCase()) { result = 1 }
			if (a.text().toLowerCase() < b.text().toLowerCase()) { result = -1 }

			return result
		})
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