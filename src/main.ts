import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());

  await app.listen(3000);
}
bootstrap();
