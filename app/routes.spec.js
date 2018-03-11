'use strict'

const express = require('express')
const request = require('supertest')

describe('routes',()=>{
  let app

  beforeAll(()=>{
    const routes = require('./routes')
    app = express()
      .use(routes)
  })

  it('/',()=>{
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
  })
  it('/skills',()=>{
    return request(app)
      .get('/skills')
      .expect('Content-Type', /html/)
      .expect(200)
  })
  it('/long',()=>{
    return request(app)
      .get('/long')
      .expect('Content-Type', /html/)
      .expect(200)
  })
  it('/resume.pdf',()=>{
    return request(app)
      .get('/resume.pdf')
      .expect('Content-Type', /application\/pdf/)
      .expect(200)
  })
  it('/styles/main.css',()=>{
    return request(app)
      .get('/styles/main.css')
      .expect('Content-Type', /text\/css/)
      .expect(200)
  })
  it('/styles/print.css',()=>{
    return request(app)
      .get('/styles/print.css')
      .expect('Content-Type', /text\/css/)
      .expect(200)
  })
})
