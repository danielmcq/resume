"use strict"

const fs = require("fs")

const OPTIONS_FILE = "options.json"

function Config (defaults, optionsFile) {
	this.config = Object.assign({}, defaults||{})
	this.optionsReadAt = null
	this.optionsFile = optionsFile || OPTIONS_FILE
}

Config.prototype.getConfig = function(callback) {
	if (!this.optionsReadAt) {
		fs.access(this.optionsFile, fs.R_OK, (err)=>{
			this.optionsReadAt = new Date()

			if (!err) {
				fs.readFile(this.optionsFile, (err, data)=>{
					if (!err) {
						const options = JSON.parse(data)

						callback( Object.assign(this.config, options) )
					}
				})
			}
		})
	} else {
		callback(this.config)
	}
}

module.exports = Config