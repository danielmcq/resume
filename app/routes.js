'use strict'

// node libs
const express = require('express')
const path    = require('path')

// project classes
const config          = require('./controllers/config.controller')
const DataManager     = require('./controllers/DataManager')
const PdfManager      = require('./controllers/PdfManager')
const SassManager     = require('./controllers/SassManager')
const TemplateManager = require('./controllers/TemplateManager')

module.exports = express.Router()
  .get('/',templateEndoint('main'))
  .get('/skills',templateEndoint('skills'))
  .get('/long',templateEndoint('long'))
  .get('/resume.pdf',pdfEndpoint())
  .get('/styles/*.css',stylesEndpoint())

const dataManager     = new DataManager(config.get('dataSource'))
const templateManager = new TemplateManager({
  verbosity: config.get('app.verbosity'),
  templates: {
    long:   path.join(__dirname, './templates/long.pug'),
    main:   path.join(__dirname, './templates/main.pug'),
    skills: path.join(__dirname, './templates/skill-focus.pug'),
  },
}, dataManager)

function pdfEndpoint () {
  return async (req, res)=>{
    const html = templateManager.customRender('main', {docformat: 'pdf'})
    const stream = await PdfManager.createStream(html)

    res.type('pdf')
    res.set('Content-Disposition', 'attachment; filename=resume.pdf')
    stream.pipe(res)
  }
}

function stylesEndpoint () {
  const sassManager = new SassManager()

  return (req,res,next)=>{
    sassManager.css(req.path)
      .then(css => res.type('text/css').send(css))
      .catch(next)
  }
}

function templateEndoint (templateName) {
  return (req, res)=>{
    res.type('html').send(templateManager.html(templateName))
  }
}