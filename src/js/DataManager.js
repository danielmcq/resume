'use strict'

const EventEmitter = require('events')
const Firebase     = require('firebase')
const fs           = require('fs')
const path         = require('path')
const Utils        = require('./Utils')
const winston      = require('winston')

class DataManager extends EventEmitter {
  constructor (options) {
    super()

    const OPT_DEFAULTS = { type: 'file', location: path.join(process.cwd(), 'data.json') }

    this._config = Object.assign({}, OPT_DEFAULTS, options)

    if (this._config.type === 'file') {
      this._fileInit()
    } else if (this._config.type === 'firebase') {
      this._firebaseInit()
    }
  }

  get data () {
    return this._data
  }

  _fileInit () {
    const DATA_FILE = this._config.location

    this._readDataFile(DATA_FILE)

    fs.watch(DATA_FILE, (event)=>{
      if (event === 'change') {
        this._readDataFile(DATA_FILE)
      }
    })
  }

  _firebaseInit () {
    Firebase.initializeApp({databaseURL: this._config.location})
    this._firebase = Firebase.database()

    this._firebase.ref('/').on('value', (snapshot)=>{
      this._data = snapshot.val()
      this.emit('data', this._data)
    }, (err)=>{
      winston.error(`Failed to parse JSON data from Firebase source ${this._config.location}\n${err}`)
    })
  }

  _readDataFile (dataFile) {
    fs.readFile(dataFile, (err,contents)=>{
      try {
        if (err) {
          throw err
        } else {
          this._data = JSON.parse(contents, Utils.JSON.dateParser)
          this.emit('data', this._data)
        }
      } catch (er) {
        winston.error(`Failed to parse JSON data from '${dataFile}'\n${er}`)
      }
    })
  }
}

module.exports = DataManager