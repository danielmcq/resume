"use strict"

// node libs
const config  = require("config")
const express = require("express")
const jade    = require("jade")
const morgan  = require("morgan")
const pdf     = require("html-pdf")
const url     = require("url")
const winston = require("winston")

// project classes
const DataManager = require( "./src/js/DataManager" )
const LessManager = require( "./src/js/LessManager" )
const Resume      = require( "./src/js/Resume" )
const Utils       = require( "./src/js/Utils" )

// server objects
const dataManager    = new DataManager( config.get("dataSource") )
const lessManager    = new LessManager()
const mainTemplate   = jade.compileFile( "./src/templates/main.jade" )
const skillsTemplate = jade.compileFile( "./src/templates/skill-focus.jade" )

express()
	.use(morgan("combined"))
	.get("/", (req, res)=>{
		res.send( mainTemplate(prepareLocalPageData( dataManager.data, config.get("app") )) )
	})
	.get("/skills", (req, res)=>{
		res.send( skillsTemplate(prepareLocalPageData( dataManager.data, config.get("app") )) )
	})
	.get("/resume.pdf",(req, res)=>{
		let pdfPageData = prepareLocalPageData( Object.assign({}, dataManager.data, {docformat:"pdf"}), config.get("app") )
		const html = mainTemplate(pdfPageData)
		const pdfConfig = config.get("pdf-html")

		pdf.create(resolveHrefForPdf(html), pdfConfig).toStream((err, stream)=>{
			res.type("pdf")
			res.set("Content-Disposition", "attachment; filename=resume.pdf")
			stream.pipe(res)
		})
	})
	.get("/main.css", (req, res)=>{
		res.type("text/css").send( lessManager.css )
	})
	.listen(config.get("server.port"), ()=>{
		winston.info(`Listening on ${url.format(config.get("server"))}`)
	})


function prepareLocalPageData (sourceData, config) {
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


function resolveHrefForPdf (html) {
	const URL_BASE = url.format(config.get("server"))
	const HREF_REGEX = /href="(?!http)([^"]+)"/

	return html.replace(HREF_REGEX,`href="${URL_BASE}$1"`)
}