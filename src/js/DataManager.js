"use strict"

const Firebase  = require("firebase")
const fs        = require("fs")
const path      = require("path")
const Utils     = require("./Utils")
const winston   = require("winston")

class DataManager {
	constructor (options) {
		const OPT_DEFAULTS = { type: "file", location: path.join(process.cwd(), "data.json") }

		this._config = Object.assign({}, OPT_DEFAULTS, options)

		if (this._config.type === "file") {
			this._fileInit()
		} else if (this._config.type === "firebase") {
			this._firebaseInit()
		}
	}

	get data () {
		return this._data
	}

	_fileInit () {
		const DATA_FILE = this._config.location

		this._readDataFile(DATA_FILE)

		fs.watch(DATA_FILE, (event)=>{
			if (event === "change") {
				this._readDataFile(DATA_FILE)
			}
		})
	}

	_firebaseInit () {
		this._firebase = new Firebase(this._config.location)

		this._firebase.on("value", (snapshot)=>{
			this._data = snapshot.val()
		}, (err)=>{
			winston.error(`Failed to parse JSON data from Firebase source ${this._config.location}\n${err}`)
		})
	}

	_readDataFile (dataFile) {
		fs.readFile(dataFile, (err,contents)=>{
			try {
				if (err) {
					throw err
				} else {
					this._data = JSON.parse(contents, Utils.JSON.dateParser)
				}
			} catch (er) {
				winston.error(`Failed to parse JSON data from '${dataFile}'\n${er}`)
			}
		})
	}
}

module.exports = DataManager