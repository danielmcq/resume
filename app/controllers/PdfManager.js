'use strict'

const pdf = require('html-pdf')
const url = require('url')

const config = require('./config.controller')

module.exports = {
  createStream,
  resolveHrefForPdf,
}

async function createStream (html) {
  const pdfConfig = config.get('pdf-html')

  return new Promise((resolve,reject)=>{
    pdf.create(resolveHrefForPdf(html), pdfConfig).toStream((err, stream)=>{
      if (err) return reject(err)
      else return resolve(stream)
    })
  })
}

function resolveHrefForPdf (html) {
  const URL_BASE = url.format(config.get('server'))
  const HREF_REGEX = /href="(?!http)([^"]+)"/

  return html.replace(HREF_REGEX,`href="${URL_BASE}$1"`)
}