import mongoose from 'mongoose'
import env from './env'

class Connection {
  constructor () {
    mongoose
      .connect(env.mongoDB_URI, {
        useCreateIndex: true,
        // useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .catch(error => {
        console.log('Unable to connect to database!')
        console.error(error)
      })
  }
}

export default new Connection()

export { mongoose }
