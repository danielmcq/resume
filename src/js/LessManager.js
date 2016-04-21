"use strict"

const fs      = require("fs")
const less    = require("less")
const path    = require("path")
const winston = require("winston")

const LESS_FILE = path.join(process.cwd(), "/src/less/main.less")

class LessManager {
	constructor (options) {
		const OPT_DEFAULTS = { compress: false, filename: LESS_FILE }

		this._css = ""
		this._config = Object.assign({}, OPT_DEFAULTS, options)

		this._lessInit()
	}

	get css () { return this._css }

	_lessInit () {
		const DATA_FILE = this._config.filename

		this._renderLess(DATA_FILE)

		fs.watch(DATA_FILE, (event)=>{
			if (event === "change") {
				this._renderLess(DATA_FILE)
			}
		})
	}

	_renderLess () {
		const DATA_FILE = this._config.filename

		fs.readFile(DATA_FILE, "utf8", (err, data)=>{
			if (err) {
				winston.error(`Error reading LESS file '${DATA_FILE}'\n${err}`)
			} else {
				less.render(data, this._config, (err, output) => {
					if (err) {
						winston.error(`Error rendering CSS from LESS file '${DATA_FILE}'\n${err}`)
					} else {
						this._css = output.css
					}
				})
			}
		})
	}
}

module.exports = LessManager