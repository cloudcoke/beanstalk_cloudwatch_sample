import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import * as path from 'path';
import { Injectable, LoggerService } from '@nestjs/common';

console.log(winstonDaily);

const env = process.env.NODE_ENV || 'develop';
const logDir = path.join(__dirname, '../../../../logs');

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
  };
};

const winstonFormat =
  env === 'production'
    ? winston.format.simple()
    : winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('develRoket', {
          prettyPrint: true,
        }),
      );

// rfc5424를 따르는 winston만의 log level
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
@Injectable()
export class CustomLoggerService implements LoggerService {
  private errorLogger: LoggerService;
  private warnLogger: LoggerService;
  private infoLogger: LoggerService;

  constructor() {
    this.errorLogger = WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winstonFormat,
        }),
        new winstonDaily(dailyOptions('error')),
      ],
    });

    this.warnLogger = WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winstonFormat,
        }),
        new winstonDaily(dailyOptions('warn')),
      ],
    });

    this.infoLogger = WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winstonFormat,
        }),
        new winstonDaily(dailyOptions('info')),
      ],
    });
  }

  error(message: string, ...optionalParams: any[]) {
    this.errorLogger.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParmas: any[]) {
    this.warnLogger.warn(message, ...optionalParmas);
  }

  log(message: string, ...optionalParams: any[]) {
    this.infoLogger.log(message, ...optionalParams);
  }
}
