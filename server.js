'use strict'

// node libs
const config  = require('config')
const express = require('express')
const morgan  = require('morgan')
const path    = require('path')
const pdf     = require('html-pdf')
const url     = require('url')
const winston = require('winston')

// project classes
const DataManager     = require('./src/js/DataManager')
const LessManager     = require('./src/js/LessManager')
const TemplateManager = require('./src/js/TemplateManager')

// server objects
const dataManager     = new DataManager(config.get('dataSource'))
const templateManager = new TemplateManager({
  verbosity: config.get('app.verbosity'),
  templates: {
    long:   path.join(__dirname, 'src/templates/long.pug'),
    main:   path.join(__dirname, 'src/templates/main.pug'),
    skills: path.join(__dirname, 'src/templates/skill-focus.pug'),
  },
}, dataManager)

express()
  .use(morgan('combined'))
  .get('/', (req, res)=>{
    res.send(templateManager.html('main'))
  })
  .get('/skills', (req, res)=>{
    res.send(templateManager.html('skills'))
  })
  .get('/long', (req, res)=>{
    res.send(templateManager.html('long'))
  })
  .get('/resume.pdf',(req, res)=>{
    const html = templateManager.customRender('main', {docformat: 'pdf'})
    const pdfConfig = config.get('pdf-html')

    pdf.create(resolveHrefForPdf(html), pdfConfig).toStream((err, stream)=>{
      res.type('pdf')
      res.set('Content-Disposition', 'attachment; filename=resume.pdf')
      stream.pipe(res)
    })

    function resolveHrefForPdf (html) {
      const URL_BASE = url.format(config.get('server'))
      const HREF_REGEX = /href="(?!http)([^"]+)"/

      return html.replace(HREF_REGEX,`href="${URL_BASE}$1"`)
    }
  })
  .get('/main.css', (req, res)=>{
    const lessManager = new LessManager()

    lessManager.css()
      .then(css => res.type('text/css').send(css))
      .catch(err => res.send(err))
  })
  .get('/print.css', (req, res)=>{
    const filename = path.join(process.cwd(), '/src/less/print.less')
    const lessManager = new LessManager({filename})

    lessManager.css()
      .then(css => res.type('text/css').send(css))
      .catch(err => res.send(err))
  })
  .listen(config.get('server.port'), ()=>{
    winston.info(`Listening on ${url.format(config.get('server'))}`)
  })
