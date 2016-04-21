"use strict"

// node libs
const Config  = require("config")
const express = require("express")
const fs      = require("fs")
const jade    = require("jade")
const less    = require("less")
const morgan  = require("morgan")
const pdf     = require("html-pdf")
const url     = require("url")
const winston = require("winston")

// project classes
const DataManager = require( "./src/js/DataManager" )
const Resume      = require( "./src/js/Resume" )
const Utils       = require( "./src/js/Utils" )

// server objects
const app         = express()
const config      = Config.get("config")
const dataManager = new DataManager(config.dataSource)
const template    = jade.compileFile( "./src/templates/main.jade" )

app.use(express.static( "./static" ))
app.use(morgan("combined"))

app.get("/", (req, res)=>{
	res.send( template(prepareLocalPageData( dataManager.data, config )) )
})

app.get("/skills", (req, res)=>{
	let template = jade.compileFile( "./src/templates/skill-focus.jade" )
	res.send( template(prepareLocalPageData( dataManager.data, config )) )
})

app.get("/resume.pdf",(req, res)=>{
	let pdfPageData = prepareLocalPageData( Object.assign({}, dataManager.data, {docformat:"pdf"}), config )
	const html = template(pdfPageData)
	// const pageHeaderHtml = jade.compileFile(__dirname + "/src/templates/includes/header.jade")(pdfPageData, config)
	// const pdfConfig = Object.assign({}, Config.get("pdfHtmlConfig"), {header: {height: ".25in", contents: pageHeaderHtml}})
	const pdfConfig = Config.get("pdfHtmlConfig")

	pdf.create(resolveHrefForPdf(html), pdfConfig).toStream((err, stream)=>{
		res.type("pdf")
		res.set("Content-Disposition", "attachment; filename=resume.pdf")
		stream.pipe(res)
	})
})

app.get("/main.css", (req, res, next)=>{
	const LESS_FILE = "src/less/main.less"

	fs.readFile(LESS_FILE, "utf8", (err, data)=>{
		if (err) { next(err) }

		less.render(data,
			{
				filename: LESS_FILE,
				compress: false
			},
			(err, output) => {
				if (err) {
					winston.error(`Error rendering CSS from LESS file '${LESS_FILE}'\n${err}`)
					next(err)
				}

				res.type("text/css").send( output.css )
			})
	})
})
app.listen(config.port, ()=>{
	winston.info(`Listening on ${url.format(config)}`)
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
	const URL_BASE = url.format(config)
	const HREF_REGEX = /href="(?!http)([^"]+)"/

	return html.replace(HREF_REGEX,`href="${URL_BASE}$1"`)
}