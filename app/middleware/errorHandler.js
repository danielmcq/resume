'use strict'

const errors = require('../misc/errors')

module.exports = (err, req, res, next)=>{
  if (err instanceof errors.NOT_FOUND) res.status(404).end()
  else res.status(500).json(err).end()
  // If express.js does not see the 'next' param in the function definition,
  // then it will skip it for error handling. The param referenced on this line
  // so that the linter won't cause a warning about unused params.
  next
}