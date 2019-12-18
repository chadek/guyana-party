import { createLogger, format, transports } from 'winston'
import { isProd, logs } from './env'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  // defaultMeta: { service: 'gp' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: `${logs}/error.log`, level: 'error' }),
    new transports.File({ filename: `${logs}/combined.log` })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!isProd) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), format.simple())
    })
  )
}

export default logger
