/*eslint no-console:0*/
"use strict"

const Config     = require("./src/js/Config")
const dateformat = require("dateformat")
const express    = require("express")
const fs         = require("fs")
const less       = require("less")
const morgan     = require("morgan")
const phone      = require("phone-formatter")
const utils      = require(__dirname+"/src/js/Utils")

const app        = express()
const configMgr  = new Config({port: process.env.PORT||3000})
const template   = require("jade").compileFile(__dirname + "/src/templates/main.jade")


configMgr.getConfig((config)=>{
	app.use(morgan("combined"))
	app.use(express.static(__dirname + "/static"))

	app.get("/", function (req, res, next) {
		fs.readFile(__dirname+"/data.json", (err,contents)=>{
			if (err) { next(err) }

			sendHtmlResponse(res, prepareLocalPageData( JSON.parse(contents, utils.JSON.dateParser) ))
		})
	})
	app.get("/main.css", (req, res, next)=>{
		let filePath = "src/less/main.less"
		fs.readFile(filePath, "utf8", (err, data)=>{
			if (err) { next(err) }

			less.render(data,
				{
					filename: filePath,
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
		console.log("Listening on http://localhost:" + config.port)
	})
})

function prepareLocalPageData (sourceData) {
	let locals = Object.assign(
		{
			"$utils": {
				dateformat: dateformat,
				shortDate: (date)=> dateformat.call(dateformat, date, "mmm yyyy"),
				dateRange: (start, end) => locals.$utils.shortDate(start)+" - "+(end?locals.$utils.shortDate(end):"Present"),
				phone: phone
			}
		},
		sourceData
	)

	return locals
}

function sendHtmlResponse (res, locals) {
	res.send( template(locals) )
}