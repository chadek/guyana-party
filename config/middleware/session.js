// import connectMongo from 'connect-mongo'
// import mongoose from 'mongoose'
// import session from 'express-session'
// import { isProd, secret } from '../env'

// const sess = {
//   secret,
//   saveUninitialized: false, // don't create session until something stored
//   resave: false, // don't save session if unmodified
//   store: new (connectMongo(session))({
//     mongooseConnection: mongoose.connection,
//     touchAfter: 24 * 3600 // time period in seconds
//   }),
//   cookie: { maxAge: 3600000 } // one hour
// }

// if (isProd) sess.cookie.secure = true // serve secure cookies

// export default session(sess)
