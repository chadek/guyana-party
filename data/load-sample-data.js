const path = require('path')
const fs = require('fs')
const backup = require('mongodb-backup')
const restore = require('mongodb-restore')

require('dotenv').config({ path: path.join(__dirname, '/../variables.env') })

const mongoose = require('mongoose')
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true }
)
mongoose.Promise = global.Promise // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const Event = require('../models/Event')
const Organism = require('../models/Organism')
const User = require('../models/User')

const events = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/events.json'), 'utf-8')
)
const groups = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/groups.json'), 'utf-8')
)
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/users.json'), 'utf-8')
)

const root = path.join(__dirname, '/backup')
const dbName = process.env.DATABASE.split('/').slice(-1)[0]

const conf = {
  uri: process.env.DATABASE,
  root,
  metadata: true,
  parser: 'json',
  logger: root + '/log'
}

function deleteData (packed = false) {
  // Create backup first
  backupData(packed, async () => {
    // Then remove data
    console.log('\n😢😢 Goodbye Data...')
    await Event.remove()
    await Organism.remove()
    await User.remove()
    console.log('\n👍 Data Deleted.')
    console.log('\nTo restore data, run\n\t"npm run restore"')
    console.log('\nTo load sample data, run\n\t"npm run sample"\n')
  })
}

function backupData (packed, callbackFn) {
  console.log('Creating Backup...')
  catchErrors(() =>
    backup({
      ...conf,
      tar: packed ? 'dump.tar' : null,
      callback: async err => {
        if (err) {
          console.error('Backup failed:', err)
        } else {
          console.log('👍 Done!\n')
          if (typeof callbackFn === 'function') {
            await callbackFn()
          }
        }
        process.exit()
      }
    })
  )
}

function restoreData (packed) {
  console.log('Restoring data...')
  catchErrors(() =>
    restore({
      ...conf,
      root: path.join(root, dbName),
      drop: true,
      tar: packed ? 'dump.tar' : null,
      callback: async err => {
        if (err) {
          console.error('Restore failed:', err)
        } else {
          console.log('👍 Done!\n')
        }
        process.exit()
      }
    })
  )
}

let error

async function loadData () {
  console.log('Loading data...')
  await catchPromiseErrors(() => Event.insertMany(events))
  await catchPromiseErrors(() => Organism.insertMany(groups))
  await catchPromiseErrors(() => User.insertMany(users))
  if (!error) {
    console.log('👍 Done!\n')
  } else {
    console.log(
      '\n⚠️  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first:\n\t npm run blowitallaway\n'
    )
    console.log(` ➡ Error: ${error}`)
  }
  process.exit()
}

function catchErrors (fn, catchFn) {
  try {
    if (typeof fn === 'function') fn()
  } catch (err) {
    if (typeof catchFn === 'function') catchFn()
    console.log(err)
    process.exit()
  }
}

function catchPromiseErrors (fn) {
  return fn().catch(({ err }) => {
    if (err) error += `${err.errmsg}\n`
  })
}

const packed = process.argv.includes('--tar')
if (process.argv.includes('--delete')) {
  deleteData(packed)
} else if (process.argv.includes('--backup')) {
  backupData(packed)
} else if (process.argv.includes('--restore')) {
  restoreData(packed)
} else {
  loadData()
}
