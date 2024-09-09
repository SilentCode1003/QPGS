// The Logger that acts like a singleton(because it does not check if there's only one instance running)
// Logs to console and file if in production
// Logs to console if in development

import { CONFIG_ENV } from '@/config/env.config'
import winston from 'winston'
import 'winston-daily-rotate-file'

const isProduction = CONFIG_ENV.NODE_ENV === 'production'

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
  maxFiles: '14d', // Delete files after 14 days
  format: combine(timestamp(), json()),
})

const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize({ all: true, colors: customLevels.colors }),
    timestamp(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
})

export const Logger = winston.createLogger({
  levels: customLevels.levels,
  level: isProduction ? CONFIG_ENV.SERVER_LOGGING_LEVEL : 'trace', // Include all levels below trace on development
  format: winston.format.json(),
}) as winston.Logger & Record<keyof (typeof customLevels)['levels'], winston.LeveledLogMethod>

// Always add the console transport even when in production
Logger.add(consoleTransport)

// Only add the rotating log file when in production
if (isProduction) {
  Logger.add(fileRotateTransport)
}
