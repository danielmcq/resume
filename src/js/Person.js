"use strict"

class Person {
	constructor (options) {
		const DEFAULTS = {
			name:"",
			email:"",
			phone:"",
			github:""
		}

		Object.assign(this, DEFAULTS, options)
	}
}

module.exports = Person