import dotenv from 'dotenv'

dotenv.config()

export default {
  mongoDB_URI:
    process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI,
  port: process.env.PORT || 3000,
  secret: process.env.SECRET
}

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'
export const api = process.env.API_ROUTE
