'use strict'

const Describer = require('./Describer')

describe('Describer',()=>{
  const DATA_1 = {
    'short':  'Reduced backlog by 50% over 1 year.',
    'medium': 'Worked to reduce backlog by 50% in a 12 month period.',
    'long':   'Worked to reduce the size of the product backlog by half in a 12 month period by resolving existing items and reducing the amount of new backlog entries created.',
  }

  let describer1

  beforeEach(()=>{
    describer1 = new Describer(DATA_1)
  })

  describe('text()',()=>{
    it('always returns a string',()=>{
      const res = describer1.text()

      expect(typeof res).toBe('string')
    })

    it('defaults to short verbosity',()=>{
      const res = describer1.text()

      expect(res).toEqual(DATA_1.short)
    })
  })
})