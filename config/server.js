import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import path from 'path'
import env, { isDev, isProd } from './env'
import setRoutes from './routes'
import cors from './middleware/cors'
// import session from './middleware/session'
import { notFound, devErrors, prodErrors } from './middleware/errorHandlers'

const server = express()

if (!isProd) console.log(`Environment: ${server.get('env')}`)

server.use(helmet()) // cleaning http headers
server.use(cors) // prevent cors errors
server.use(compression()) // gzip compression of the response body
server.use(express.json()) // for parsing application/json
// server.use(session)

if (isProd) server.set('trust proxy', 1) // trust first proxy

if (isDev) server.use(morgan('dev')) // HTTP request logger

server.use('/uploads', express.static(path.join(__dirname, 'uploads')))

setRoutes(server)

server.use(notFound) // manage 404 errors

if (isDev) server.use(devErrors) // manage development errors - prints stack trace

server.use(prodErrors) // manage production errors

export default server

export const port = env.port
