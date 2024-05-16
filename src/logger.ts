import winston from "winston";
const { combine, timestamp, cli } = winston.format;

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({format: combine(timestamp(), cli())}),
    ],
});

export default logger;