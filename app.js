const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const compression = require('compression')
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const session = require('express-session')
const morgan = require('morgan')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const { promisify } = require('es6-promisify')
const helpers = require('./helpers')
const routes = require('./routes/index')
const errorHandlers = require('./handlers/errorHandlers')
require('./handlers/passport')

const app = express()
const devMode = app.get('env') !== 'production'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')))

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(helmet()) // cleaning http headers
app.use(compression()) // gzip compression of the response body

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator())

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser())

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
const sess = {
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 3600000 } // one hour
}
if (!devMode) {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))

// Passport JS is what we use to handle our logins
app.use(passport.initialize())
app.use(passport.session())

// sanitizing user input
app.use(require('sanitize').middleware)

// The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash())

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers
  res.locals.flashes = req.flash()
  res.locals.user = req.user || null
  res.locals.currentPath = req.path
  next()
})

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login.bind(req))
  next()
})

// Add protection against CSRF attacks
app.use(csrf({ cookie: true }))

if (devMode) {
  app.use(morgan('dev')) // HTTP request logger
}

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes)

// CSRF token validation error handler
app.use(errorHandlers.csrfErrors)

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound)

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors)

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (devMode) {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors)
}

// production error handler
app.use(errorHandlers.productionErrors)

// done! we export it so we can start the site in start.js
module.exports = app
