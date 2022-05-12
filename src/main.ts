import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { graphqlUploadExpress } from 'graphql-upload';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress());
  await app.listen(3000);
}
bootstrap();
