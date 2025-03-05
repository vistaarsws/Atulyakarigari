import winston from "winston"; 
import { logger, createRotateTransport } from "../../config/logger.js";

// Cache loggers to avoid multiple instances
const loggersCache = {};

/**
 * Logs a message to a specified file.
 * @param {string} level - Log level (e.g., 'info', 'warn', 'debug').
 * @param {string} message - Log message.
 * @param {string} [fileName] - Optional file name to store logs separately.
 */
const logMessage = (level, message, fileName = null) => {
  if (fileName) {
    if (!loggersCache[fileName]) {
      loggersCache[fileName] = winston.createLogger({
        level,
        format: logger.format,
        transports: [createRotateTransport(level, fileName)],
      });
    }
    loggersCache[fileName].log({ level, message });
  } else {
    logger.log({ level, message });
  }
};

export { logMessage };
