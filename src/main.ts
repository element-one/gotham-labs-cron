import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SentryInterceptor } from '@interceptors/sentry.interceptor';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { setupSwagger } from '@swagger/setup';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new SentryInterceptor());

  const origin = [];
  if (process.env.APP_ENV === 'dev') {
    origin.push('http://localhost:3000');
  }

  const allowedHeaders = ['Accept', 'Content-Type', 'Authorization'];

  const cors = {
    origin,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders,
  };
  app.enableCors(cors);

  setupSwagger(app);

  await app.listen(port, () => {
    logger.verbose(
      'app is listing on: ' + configService.get<string>('BASE_URL'),
    );
  });
}
bootstrap();
