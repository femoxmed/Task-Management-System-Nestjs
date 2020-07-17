import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const logger = new Logger('botstrap');
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          level: 'error',
        }),
        // other transports...
      ],
    }),
  });

  //set cors
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;
  await app.listen(3000);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
