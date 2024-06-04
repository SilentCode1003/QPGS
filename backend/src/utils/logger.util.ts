import winston from 'winston'
import 'winston-daily-rotate-file'
import { config } from '../config/env.config.js'

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    http: 3,
    info: 4,
    debug: 5,
    trace: 6,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    http: 'white',
    info: 'green',
    debug: 'blue',
    trace: 'cyan',
  },
}

const { combine, timestamp, json, printf, colorize } = winston.format

const fileRotateTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  format: combine(timestamp(), json()),
})

const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize({ all: true, colors: customLevels.colors }),
    timestamp(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
})

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'info',
  format: winston.format.json(),
}) as winston.Logger & Record<keyof (typeof customLevels)['levels'], winston.LeveledLogMethod>

// Always add the console transport even when in production
logger.add(consoleTransport)

// Only add the rotating log file when in production
if (config.NODE_ENV === 'production') {
  logger.add(fileRotateTransport)
}
