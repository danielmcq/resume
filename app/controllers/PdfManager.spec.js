'use strict'

const config       = require('./config.controller')
const EventEmitter = require('events')
const PdfManager   = require('./PdfManager')
const url          = require('url')

describe('PDF Manager',()=>{
  it('resolveHrefForPdf',()=>{
    const serverConf = config.get('server')
    const baseUrl = url.format(serverConf)
    const html = getTestHtml()
    const updatedHtml = PdfManager.resolveHrefForPdf(html)

    expect(updatedHtml).toContain(`${baseUrl}/styles/main.css`)
    expect(updatedHtml).toContain(`${baseUrl}/styles/pdf.css`)
  })

  it('createStream',async()=>{
    const html = getTestHtml()
    const pdfStream = await PdfManager.createStream(html)

    expect(pdfStream instanceof EventEmitter).toBe(true)
  })
})


function getTestHtml () {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/styles/main.css">
  <link rel="stylesheet" media="print" href="/styles/print.css">
</head><body></body></html>`
}