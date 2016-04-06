/*eslint no-console:0*/
"use strict"

const express    = require("express")
const fs         = require("fs")
const utils      = require(__dirname+"/src/js/Utils")
const dateformat = require("dateformat")
const phone      = require("phone-formatter")

const defaults = {
	port: process.env.PORT||3000
}
const options = JSON.parse(fs.readFileSync("options.json"))
let config = Object.assign({},defaults,options)


const app        = express()
const template   = require("jade").compileFile(__dirname + "/src/templates/main.jade")

app.use(express.static(__dirname + "/static"))

app.get("/", function (req, res, next) {
	fs.readFile(__dirname+"/data.json", (err,contents)=>{
		if (err) { next(err) }

		sendHtmlResponse(res, prepareLocalPageData( JSON.parse(contents, utils.JSON.dateParser) ))
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


app.listen(config.port, function () {
	console.log("Listening on http://localhost:" + config.port)
})