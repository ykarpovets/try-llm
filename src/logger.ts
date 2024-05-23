import winston from "winston";
const { combine, timestamp, printf, colorize, errors } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), customFormat),
  transports: [new winston.transports.Console({ handleExceptions: true })],
});

export default logger;
