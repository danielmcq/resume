/*globals institution, location, areaOfStudy, attendStart, attendEnd*/
"use strict"

function Study (options={institution, location, areaOfStudy, attendStart, attendEnd}) {
	const DEFAULTS = {institution:"", location:"", areaOfStudy:"", attendStart:null, attendEnd: null}

	Object.assign(this, DEFAULTS, options)
}

module.exports = Study