'use strict'

const path = require('path')
const request = require('supertest')

describe('app',()=>{
  process.env.NODE_CONFIG_DIR = path.resolve(path.join(__dirname, '../config/'))
  process.env.NODE_CONFIG = JSON.stringify({logging: {console: {level: 'error'}}})
  const app = require('./app')()

  describe('routes',()=>{
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
})