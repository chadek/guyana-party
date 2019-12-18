import mongoose from 'mongoose'
import { dbUri } from './env'
import logger from './logger'

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
        logger.error('Unable to connect to database!')
        logger.error(error)
      })
  }
}

export default new Connection()

export { mongoose }
