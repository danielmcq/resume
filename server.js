/*eslint no-console:0*/
"use strict"

const configMgr  = require("config")
const dateformat = require("dateformat")
const express    = require("express")
const fs         = require("fs")
const less       = require("less")
const morgan     = require("morgan")
const pdf        = require("html-pdf")
const phone      = require("phone-formatter")
const utils      = require(__dirname+"/src/js/Utils")

const app        = express()
const config     = configMgr.get("config")
const template   = require("jade").compileFile(__dirname + "/src/templates/main.jade")

app.use(express.static(__dirname + "/static"))
app.use(morgan("combined"))

app.get("/", (req, res, next)=>{
	getPageData(next,(pageData)=>{
		res.send( getHtmlResponse(prepareLocalPageData( pageData, config )) )
	})
})

app.get("/resume.pdf",(req, res, next)=>{
	getPageData(next,(pageData)=>{
		const html = getHtmlResponse(prepareLocalPageData( pageData, config ))
		const pdfConfig = configMgr.get("pdfHtmlConfig")

		pdf.create(resolveHrefForPdf(html), pdfConfig).toStream((err, stream)=>{
			res.type("pdf")
			res.set("Content-Disposition", "attachment; filename=resume.pdf")
			stream.pipe(res)
		})
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
					console.log("Error rendering CSS", err)
					next(err)
				}

				res.type("text/css").send( output.css )
			})
	})
})
app.listen(config.port, ()=>{
	console.log("Listening on %s",getUrlBase())
})

function getUrlBase () {
	return `http://localhost:${config.port}/`
}

function prepareLocalPageData (sourceData, config) {
	let locals = Object.assign(
		{
			"$utils": {
				dateformat: dateformat,
				shortDate: (date)=> dateformat.call(dateformat, date, "mmm yyyy"),
				dateRange: (start, end) => locals.$utils.shortDate(start)+" - "+(end?locals.$utils.shortDate(end):"Present"),
				getDesc: (desc)=> getDescription.call(getDescription, desc, config),
				phone: phone
			}
		},
		sourceData
	)

	return locals
}

function getHtmlResponse (locals) {
	return template(locals)
}

function getPageData (next, callback) {
	fs.readFile(__dirname+"/data.json", (err,contents)=>{
		if (err) { next(err) } else {
			callback(JSON.parse(contents, utils.JSON.dateParser))
		}
	})
}

function getDescription (desc, config) {
	const VERBOSITY = config.verbosity||"short"

	let description

	switch (VERBOSITY) {
	case "long":
		description = desc.long
		break
	case "medium":
	case "med":
		description = desc.medium
		break
	default:
		description = desc.short
		break
	}

	if (!description) {
		let verbosities = ["short", "medium", "long"]
		for (const verbosity of verbosities) {
			if (desc[verbosity]) {
				description = desc[verbosity]
				break
			}
		}
	}

	return description
}


function resolveHrefForPdf (html) {
	const URL_BASE = getUrlBase()
	const HREF_REGEX = /href="(?!http)([^"]+)"/

	return html.replace(HREF_REGEX,`href="${URL_BASE}$1"`)
}