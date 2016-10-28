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
	}


	css () {
		if (this._css) {
			return new Promise((resolve, reject) => {
				resolve(this._css)
			})
		} else {
			return this._renderLess()
		}
	}


	_renderLess () {
		const DATA_FILE = this._config.filename

		return new Promise((resolve, reject) => {
			fs.readFile(DATA_FILE, "utf8", (err, data)=>{
				if (err) {
					const msg = `Error reading LESS file '${DATA_FILE}'\n${err}`
					winston.error(msg)
					reject(msg)
				} else {
					less.render(data, this._config, (err, output) => {
						if (err) {
							const msg = `Error rendering CSS from LESS file '${DATA_FILE}'\n${err}`
							winston.error(msg)
							reject(msg)
						} else {
							this._css = output.css
							winston.info("less render complete", this._css.slice(0, 10))
							resolve(this._css)
						}
					})
				}
			})
		})
	}
}

module.exports = LessManager