/*globals name, email, phone*/
"use strict"

function Person (options={name, email, phone}) {
	const DEFAULTS = {name:"", email:"", phone:"", github:""}

	Object.assign(this, DEFAULTS, options)
}

module.exports = Person