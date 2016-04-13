"use strict"

const dateformat = require("dateformat")
const phone      = require("phone-formatter")

module.exports = {
	"JSON": {
		dateParser: function(key, value){
			const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/
			const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/

			if (typeof value === "string") {
				let a = reISO.exec(value)
				if (a)
					return new Date(value)
				a = reMsAjax.exec(value)
				if (a) {
					let b = a[1].split(/[-+,.]/)
					return new Date(b[0] ? +b[0] : 0 - +b[1])
				}
			}

			return value
		}
	},
	dateformat: dateformat,
	dateRange: (start, end) => this.shortDate(start)+" - "+(end?this.shortDate(end):"Present"),
	getDescription: function (desc, config) {
		const VERBOSITY = config.verbosity||"short"

		let description

		switch (VERBOSITY) {
		case "long":
			description = desc.long
			break
		case "medium":
		case "med":
			description = desc.medium
			break
		default:
			description = desc.short
			break
		}

		if (!description) {
			let verbosities = ["short", "medium", "long"]
			for (const verbosity of verbosities) {
				if (desc[verbosity]) {
					description = desc[verbosity]
					break
				}
			}
		}

		return description
	},
	phone: phone,
	shortDate: (date)=> dateformat.call(dateformat, date, "mmm yyyy")
}