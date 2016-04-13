/*eslint no-console:0*/
"use strict"

const configMgr = require("config")
const express   = require("express")
const fs        = require("fs")
const jade      = require("jade")
const less      = require("less")
const morgan    = require("morgan")
const Resume    = require(__dirname+"/src/js/Resume")
const pdf       = require("html-pdf")
const Utils     = require(__dirname+"/src/js/Utils")

const app       = express()
const config    = configMgr.get("config")
const template  = jade.compileFile(__dirname + "/src/templates/main.jade")

app.use(express.static(__dirname + "/static"))
app.use(morgan("combined"))

app.get("/", (req, res, next)=>{
	getPageData(next,(pageData)=>{
		res.send( getHtmlResponse(prepareLocalPageData( pageData, config )) )
	})
})

app.get("/resume.pdf",(req, res, next)=>{
	getPageData(next,(pageData)=>{
		let pdfPageData = prepareLocalPageData( Object.assign({}, pageData, {docformat:"pdf"}), config )
		const html = getHtmlResponse(pdfPageData)
		// const pageHeaderHtml = jade.compileFile(__dirname + "/src/templates/includes/header.jade")(pdfPageData, config)
		// const pdfConfig = Object.assign({}, configMgr.get("pdfHtmlConfig"), {header: {height: ".25in", contents: pageHeaderHtml}})
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
			docformat: "html",
			resume: new Resume(sourceData.person, sourceData.jobs, sourceData.education, config),
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


function getHtmlResponse (locals) {
	return template(locals)
}


function getPageData (next, callback) {
	fs.readFile(__dirname+"/data.json", (err,contents)=>{
		if (err) { next(err) } else {
			callback(JSON.parse(contents, Utils.JSON.dateParser))
		}
	})
}


function resolveHrefForPdf (html) {
	const URL_BASE = getUrlBase()
	const HREF_REGEX = /href="(?!http)([^"]+)"/

	return html.replace(HREF_REGEX,`href="${URL_BASE}$1"`)
}