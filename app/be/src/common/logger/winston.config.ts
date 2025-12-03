import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const transports = [
  // Console transport for development
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('QuotesApp', {
        colors: true,
        prettyPrint: true,
      }),
    ),
  }),
  // File transport for production/audit
  new winston.transports.DailyRotateFile({
    filename: process.env.LOG_FILE_PATH || 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: process.env.LOG_MAX_FILES || '5d',
    level: process.env.LOG_LEVEL || 'info',
    dirname: process.env.LOG_FILE_PATH ? undefined : 'logs', // Use default dirname if path not set
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  }),
];

export const winstonConfig = {
  transports,
};
