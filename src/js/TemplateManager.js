"use strict"

const fs        = require("fs")
const jade      = require("jade")
const Resume    = require("./Resume")
const Utils     = require("./Utils")

class TemplateManager {
	constructor (options, dataManager) {
		const OPT_DEFAULTS = { templates: {}, verbosity: "short" }

		this._config = Object.assign({}, OPT_DEFAULTS, options)
		this._dataManager = dataManager

		this._jadeInit()
	}

	html (template) {
		return this._docs[template]
	}

	customRender (template, options) {
		return this._renderers[template](this._prepareLocalPageData( this._dataManager.data, Object.assign({}, this._config, options) ))
	}

	_jadeInit () {
		this._renderers = {}
		this._docs = {}

		for (let templateName in this._config.templates) {
			const TEMPLATE_FILE = this._config.templates[templateName]
			this._renderers[templateName] = jade.compileFile( TEMPLATE_FILE )
			this._dataManager.on("data",(data)=>{
				this._docs[templateName] = this._renderers[templateName](this._prepareLocalPageData( data, this._config ))
			})

			fs.watch(TEMPLATE_FILE, (event)=>{
				if (event === "change") {
					this._renderers[templateName] = jade.compileFile( TEMPLATE_FILE )
					this._docs[templateName] = this._renderers[templateName](this._prepareLocalPageData( this._dataManager.data, this._config ))
				}
			})
		}
	}

	_prepareLocalPageData (sourceData, config) {
		let locals = Object.assign(
			{
				docformat: "html",
				resume: new Resume(sourceData, config),
				Utils: Utils,
				"$utils": {
					dateRange: (start, end) => locals.$utils.shortDate(start)+" - "+(end?locals.$utils.shortDate(end):"Present"),
					shortDate: (date)=> Utils.dateformat.call(Utils.dateformat, date, "mmm yyyy")
				}
			},
			sourceData
		)

		return locals
	}
}

module.exports = TemplateManager