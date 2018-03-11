/* global beforeEach, describe, expect, it*/
'use strict'

const Describer = require('../../app/controllers/Describer')
const Job = require('../../app/models/Job')

describe('Job', ()=>{
  const DATA_1 = {
    'title':      'Web Developer',
    'company':    'Constoso',
    'location':   'New York',
    'start-date': '2010-01-01',
    'end-date':   '2012-12-31',
    'duties':     [
      {
        'short':  '',
        'medium': 'Investigate and resolve client reported bugs.',
        'long':   '',
      },
      {
        'short':  '',
        'medium': 'Plan and code new features for app.',
        'long':   '',
      }
    ],
    'projects': [
      {
        'short':  '',
        'medium': 'Built JavaScript/Node.js based server for new web app.',
        'long':   '',
      },
      {
        'short':  '',
        'medium': 'Reduced backlog by 50% over 1 year.',
        'long':   '',
      }
    ],
  }
  // const DATA_2 = {}

  let job1//, job2

  beforeEach(()=>{
    job1 = new Job(DATA_1)
  })

  describe('getAccomplishments()',()=>{
    it('returns an empty array',()=>{
      const res = job1.getAccomplishments()
      expect(res).not.toBeUndefined()
      expect(res).not.toBeNull()
      expect(Array.isArray(res)).toBe(true)
      expect(res.length).toEqual(0)
    })
  })
  describe('getDuties()',()=>{
    it('returns a non-empty array',()=>{
      const res = job1.getDuties()
      expect(res).not.toBeUndefined()
      expect(res).not.toBeNull()
      expect(Array.isArray(res)).toBe(true)
      expect(res.length).toEqual(2)
    })

    it('converts array items to instances of Describer',()=>{
      const res = job1.getDuties()[0]
      expect(res instanceof Describer).toBe(true)
    })
  })
  describe('getProjects()',()=>{
    it('returns a non-empty array',()=>{
      const res = job1.getProjects()
      expect(res).not.toBeUndefined()
      expect(res).not.toBeNull()
      expect(Array.isArray(res)).toBe(true)
      expect(res.length).toEqual(2)
    })

    it('converts array items to instances of Describer',()=>{
      const res = job1.getProjects()[0]
      expect(res instanceof Describer).toBe(true)
    })
  })
})