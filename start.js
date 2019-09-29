const mongoose = require('mongoose')

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat)
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log(
    "You're on an older version of node that doesn't support the latest and greatest things we are using (Async + Await)! Please go to nodejs.org and download version 7.6 or greater.\n"
  )
  process.exit()
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' })

// Config and Connection to our Database
mongoose.Promise = global.Promise // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', err => {
  console.error(`Mongoose connection error → ${err.message}`)
})
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

// READY?! Let's go!

// import all of our models
require('./models/User')
require('./models/Group')
require('./models/Event')

// Start our app!
const app = require('./app')

app.set('port', process.env.PORT || 7777)

if (app.get('env') !== 'production') {
  require('./watcher.js')
}

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → http://localhost:${server.address().port}`)
})
