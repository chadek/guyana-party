import dotenv from 'dotenv'

dotenv.config()

export const mongoDBUri =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI
export const port = process.env.PORT || 3000
export const secret = process.env.SECRET
export const api = process.env.API_ROUTE
export const googleClientId = process.env.GOOGLE_CLIENT_ID
export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'
