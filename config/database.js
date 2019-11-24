import mongoose from 'mongoose'
import { mongoDBUri } from './env'

class Connection {
  constructor () {
    mongoose
      .connect(mongoDBUri, {
        useCreateIndex: true,
        useFindAndModify: false,
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
