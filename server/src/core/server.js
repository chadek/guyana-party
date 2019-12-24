import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import { api, isDev, isProd, port } from './env'
import setRoutes from './routes'
import { notFound, devErrors, prodErrors } from './middleware/errorHandlers'

const server = express()

if (!isProd) console.log(`Environment: ${server.get('env')}`)

server.use(helmet()) // cleaning http headers
server.use(cors()) // preventing cors errors
server.use(compression()) // gzip compression of the response body
server.use(express.json()) // for parsing application/json
server.use(express.urlencoded({ extended: true }))

server.use(require('sanitize').middleware)

if (isProd) server.set('trust proxy', 1) // trust first proxy

if (isDev) server.use(morgan('dev')) // HTTP request logger

setRoutes(server)

server.use('/static', express.static('uploads'))

server.use(notFound) // manage 404 errors

if (isDev) server.use(devErrors) // manage development errors - prints stack trace

server.use(prodErrors) // manage production errors

export default server

export { api, port }
