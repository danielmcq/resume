'use strict'

// node libs
const express = require('express')
const path    = require('path')
const pdf     = require('html-pdf')
const url     = require('url')

// project classes
const config          = require('./controllers/config.controller')
const DataManager     = require('./controllers/DataManager')
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
  return (req, res)=>{
    const html = templateManager.customRender('main', {docformat: 'pdf'})
    const pdfConfig = config.get('pdf-html')

    pdf.create(resolveHrefForPdf(html), pdfConfig).toStream((err, stream)=>{
      res.type('pdf')
      res.set('Content-Disposition', 'attachment; filename=resume.pdf')
      stream.pipe(res)
    })
  }
}

function resolveHrefForPdf (html) {
  const URL_BASE = url.format(config.get('server'))
  const HREF_REGEX = /href="(?!http)([^"]+)"/

  return html.replace(HREF_REGEX,`href="${URL_BASE}$1"`)
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