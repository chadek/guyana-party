require('dotenv').config()

export const appName = process.env.APP_NAME || 'LibHum.org'
export const dbUri = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL
export const port = process.env.PORT || 3000
export const secret = process.env.SECRET
export const api = process.env.API_ROUTE
export const googleClientId = process.env.GOOGLE_CLIENT_ID
export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'
export const logs = process.env.LOGS
