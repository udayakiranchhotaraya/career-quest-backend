const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
require('winston-daily-rotate-file');

// Log format for displaying log details in a readable format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create a rotating file transport for error logs
const errorTransport = new transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '14d', // Keep logs for 14 days
});

// Create a rotating file transport for general application logs
const infoTransport = new transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'info',
  maxFiles: '30d', // Keep logs for 30 days
});

// Configure Winston logger
const logger = createLogger({
  level: 'info', // Set the minimum log level
  format: combine(
    timestamp(), // Add timestamp to logs
    errors({ stack: true }), // Capture stack traces for error logs
    logFormat
  ),
  transports: [
    errorTransport,  // Error-specific logs
    infoTransport    // General logs
  ],
});

// Morgan stream function to write HTTP request logs using Winston, stripping ANSI color codes
logger.stream = {
  write: (message) => {
    const cleanMessage = message.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');;
    logger.info(cleanMessage);
  },
};

// If the environment is not production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      timestamp(),
      logFormat
    ),
  }));
}

module.exports = logger;