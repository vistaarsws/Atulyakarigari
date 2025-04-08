import winston from "winston";
import path from "path";
import fs from "fs";
import "winston-daily-rotate-file";
import { fileURLToPath } from "url"; // Import for ES Module fix

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log directory
const logDir = path.join(__dirname, "../../logs");

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  // fs.mkdirSync(logDir, { recursive  : true });  //removed this to deploy
}

// Define custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Function to create a rotating transport
const createRotateTransport = (level, fileName) =>
  new winston.transports.DailyRotateFile({
    filename: path.join(logDir, `${fileName}-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    maxSize: "10m", // Max file size before rotation
    maxFiles: "14d", // Keep logs for 14 days
    level,
    zippedArchive: true, // Compress old logs
  });

// Define transports
const transports = [];

if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    })
  );
}

transports.push(createRotateTransport("info", "info"));
transports.push(createRotateTransport("combined", "combined"));

// Create Winston Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports,
});

export { logger, createRotateTransport };
