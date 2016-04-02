/*eslint no-console:0*/
"use strict"

const express    = require("express")
const app        = express()
const template   = require("jade").compileFile(__dirname + "/src/templates/main.jade")
const fs         = require("fs")
const utils      = require(__dirname+"/src/js/Utils")
const dateformat = require("dateformat")
const phone      = require("phone-formatter")

app.use(express.static(__dirname + "/static"))

app.get("/", function (req, res, next) {
	try {
		fs.readFile(__dirname+"/data.json", (err,contents)=>{
			let locals = Object.assign(
				{
					"$utils": {
						dateformat: dateformat,
						shortDate: (date)=> dateformat.call(dateformat, date, "mmm yyyy"),
						dateRange: (start, end) => locals.$utils.shortDate(start)+" - "+(end?locals.$utils.shortDate(end):"Present"),
						phone: phone
					}
				},
				JSON.parse(contents, utils.JSON.dateParser)
			)

			let html = template(locals)

			res.send(html)
		})
	} catch (e) {
		next(e)
	}
})

app.listen(process.env.PORT || 3000, function () {
	console.log("Listening on http://localhost:" + (process.env.PORT || 3000))
})