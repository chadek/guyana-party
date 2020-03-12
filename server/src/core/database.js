import mongoose from 'mongoose'
import { dbUri } from './env'
import { logError } from './logger'

class Connection {
  constructor() {
    mongoose
      .connect(dbUri, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .catch(error => {
        logError('Unable to connect to database!')
        logError(error)
      })
  }
}

export default new Connection()

export { mongoose }
