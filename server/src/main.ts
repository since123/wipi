import { NestFactory } from '@nestjs/core';
import * as rateLimit from 'express-rate-limit';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );
  app.useGlobalInterceptors(new TransformInterceptor()); // 正常情况下，响应值统一
  app.useGlobalFilters(new HttpExceptionFilter()); // 异常情况下，响应值统一

  await app.listen(4000);
}

bootstrap();
