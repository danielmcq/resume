/*eslint no-console:0*/
"use strict"

const express    = require("express")
const fs         = require("fs")
const utils      = require(__dirname+"/src/js/Utils")
const dateformat = require("dateformat")
const phone      = require("phone-formatter")

const app        = express()
const template   = require("jade").compileFile(__dirname + "/src/templates/main.jade")

app.use(express.static(__dirname + "/static"))

app.get("/", function (req, res, next) {
	try {
		fs.readFile(__dirname+"/data.json", (err,contents)=>{
			sendHtmlResponse(res, prepareLocalPageData( JSON.parse(contents, utils.JSON.dateParser) ))
		})
	} catch (e) {
		next(e)
	}
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

app.listen(process.env.PORT || 3000, function () {
	console.log("Listening on http://localhost:" + (process.env.PORT || 3000))
})