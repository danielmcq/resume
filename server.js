"use strict"

const express  = require('express')
     ,app      = express()
     ,template = require('jade').compileFile(__dirname + "/src/templates/main.jade")
     ,fs       = require("fs")
     ,utils    = require(__dirname+"/src/js/Utils")

app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res, next) {
  try {
    fs.readFile(__dirname+"/data.json", (err,contents)=>{
      let locals = JSON.parse(contents, utils.JSON.dateParser)
      let html = template(locals)

      res.send(html)
    })
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})