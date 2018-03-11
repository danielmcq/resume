'use strict'

const NOT_FOUND = Error.bind(Error,'Not found')
const FILE_NOT_FOUND = NOT_FOUND.bind(NOT_FOUND,'File not found')

module.exports = {
  FILE_NOT_FOUND,
  NOT_FOUND,
}